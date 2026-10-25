"""Local InvestIQ server for historical CSV analysis."""
from __future__ import annotations

import json
import os
import threading
import time
from datetime import datetime, timezone, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

ROOT = Path(__file__).resolve().parent
# Load simple KEY=value settings without requiring a dotenv dependency.
for _line in (ROOT / ".env").read_text(encoding="utf-8").splitlines() if (ROOT / ".env").exists() else []:
    _line = _line.strip()
    if _line and not _line.startswith("#") and "=" in _line:
        _key, _value = _line.split("=", 1)
        os.environ.setdefault(_key.strip(), _value.strip().strip("\"'"))
WEB = ROOT / "web"
DATA = ROOT / "data"
DATA.mkdir(exist_ok=True)
MARKET_HISTORY = DATA / "market_history"
MARKET_HISTORY.mkdir(exist_ok=True)
HISTORY_PATH = DATA / "prediction_history.json"
PORT = int(os.environ.get("INVESTIQ_PORT", "8001"))
LOCK = threading.RLock()
STATE: dict = {"symbol": None, "frame": None, "features": None, "models": {}, "metrics": {}, "status": "Upload a historical OHLCV CSV to begin."}
FEED = {"active": False, "symbol": None, "last_fetch": None, "error": None}
FEED_STOP = threading.Event()
FEED_THREAD = None
CHART_CACHE = {}
FORECAST_CACHE = {}
CHART_RETRY_UNTIL = {}
STATE["data_fetched_at"] = None
WATCHLIST = [
    {"symbol": "RELIANCE", "name": "Reliance Industries"}, {"symbol": "TCS", "name": "Tata Consultancy Services"},
    {"symbol": "INFY", "name": "Infosys"}, {"symbol": "HDFCBANK", "name": "HDFC Bank"},
    {"symbol": "ICICIBANK", "name": "ICICI Bank"}, {"symbol": "ITC", "name": "ITC"},
    {"symbol": "BHARTIARTL", "name": "Bharti Airtel"}, {"symbol": "TATAMOTORS", "name": "Tata Motors"},
]
FEATURES = ["return_1", "return_2", "return_3", "return_6", "rsi_14", "macd", "macd_signal", "ema_gap", "atr_pct", "volume_change", "volume_ratio", "vwap_gap", "range_pct", "minute_of_day"]


def _json_default(value):
    if isinstance(value, (np.integer,)): return int(value)
    if isinstance(value, (np.floating,)): return float(value)
    if isinstance(value, (pd.Timestamp, datetime)): return value.isoformat()
    raise TypeError(f"Cannot encode {type(value)}")


def _history():
    try: return json.loads(HISTORY_PATH.read_text(encoding="utf-8"))
    except (OSError, ValueError): return []


def _market_cache_path(symbol: str, period: str) -> Path:
    return MARKET_HISTORY / f"{symbol}_{period}.csv"


def _read_market_cache(symbol: str, period: str):
    path = _market_cache_path(symbol, period)
    if not path.exists(): return None, None
    try:
        frame = pd.read_csv(path)
        frame["timestamp"] = pd.to_datetime(frame["timestamp"], errors="coerce", utc=True)
        for column in ("open", "high", "low", "close", "volume"):
            frame[column] = pd.to_numeric(frame[column], errors="coerce")
        frame = frame.dropna(subset=["timestamp", "open", "high", "low", "close", "volume"]).sort_values("timestamp").drop_duplicates("timestamp", keep="last").reset_index(drop=True)
        return (frame, datetime.fromtimestamp(path.stat().st_mtime, timezone.utc).isoformat()) if not frame.empty else (None, None)
    except (OSError, ValueError, KeyError):
        return None, None


def _save_market_cache(symbol: str, period: str, frame: pd.DataFrame):
    path = _market_cache_path(symbol, period)
    temp_path = path.with_suffix(".tmp")
    frame.to_csv(temp_path, index=False)
    temp_path.replace(path)


def _fetch_tej_history(symbol: str, period: str) -> pd.DataFrame:
    """Fallback daily NSE history from TejHQ's public OHLCV endpoint."""
    import requests

    years = {"1mo": 1, "1y": 1, "3y": 3, "5y": 5}
    if period not in years:
        return pd.DataFrame()
    end = datetime.now().date()
    start = end - timedelta(days=365 * years[period] + (31 if period == "1mo" else 0))
    url = f"https://api.tejhq.dev/v1/ohlcv/nse/{symbol}"
    response = requests.get(url, params={"from": start.isoformat(), "to": end.isoformat()}, timeout=20,
                            headers={"User-Agent": "InvestIQ/1.0"})
    response.raise_for_status()
    frame = pd.DataFrame(response.json().get("data", []))
    if frame.empty:
        return frame
    frame = frame.rename(columns={"date": "timestamp"})
    frame["timestamp"] = pd.to_datetime(frame["timestamp"], errors="coerce").dt.tz_localize("Asia/Kolkata").dt.tz_convert("UTC")
    frame["volume"] = pd.to_numeric(frame.get("volume", 0), errors="coerce").fillna(0)
    for column in ("open", "high", "low", "close"):
        frame[column] = pd.to_numeric(frame[column], errors="coerce")
    frame = frame.dropna(subset=["timestamp", "open", "high", "low", "close"])
    frame = frame[["timestamp", "open", "high", "low", "close", "volume"]].sort_values("timestamp").reset_index(drop=True)
    cutoff = (pd.Timestamp.now(tz="Asia/Kolkata") - pd.DateOffset(months=1)
              if period == "1mo" else pd.Timestamp.now(tz="Asia/Kolkata") - pd.DateOffset(years=years[period]))
    return frame.loc[frame.timestamp.dt.tz_convert("Asia/Kolkata") >= cutoff].reset_index(drop=True)


def _normalise_csv(content: str) -> pd.DataFrame:
    from io import StringIO
    df = pd.read_csv(StringIO(content))
    df.columns = [str(c).strip().lower().replace(" ", "_") for c in df.columns]
    aliases = {"date": "timestamp", "datetime": "timestamp", "time": "timestamp", "adj_close": "close", "vol": "volume"}
    df = df.rename(columns=aliases)
    needed = ["timestamp", "open", "high", "low", "close", "volume"]
    missing = [c for c in needed if c not in df.columns]
    if missing: raise ValueError("CSV must include timestamp/date, open, high, low, close and volume columns. Missing: " + ", ".join(missing))
    df = df[needed].copy()
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce", utc=True)
    for col in needed[1:]: df[col] = pd.to_numeric(df[col], errors="coerce")
    df = df.dropna(subset=needed).sort_values("timestamp").drop_duplicates("timestamp", keep="last").reset_index(drop=True)
    valid = (df["open"] > 0) & (df["high"] > 0) & (df["low"] > 0) & (df["close"] > 0) & (df["volume"] >= 0)
    valid &= (df["high"] >= df[["open", "low", "close"]].max(axis=1)) & (df["low"] <= df[["open", "high", "close"]].min(axis=1))
    df = df.loc[valid].reset_index(drop=True)
    if len(df) < 100: raise ValueError(f"At least 100 valid candles are required; found {len(df)}.")
    if df["timestamp"].duplicated().any(): raise ValueError("Duplicate candle timestamps remain after cleanup.")
    return df


def _make_features(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    close, high, low, volume = out.close, out.high, out.low, out.volume
    returns = close.pct_change()
    delta = close.diff()
    gain = delta.clip(lower=0).rolling(14, min_periods=14).mean()
    loss = -delta.clip(upper=0).rolling(14, min_periods=14).mean()
    rs = gain / loss.replace(0, np.nan)
    out["rsi_14"] = 100 - (100 / (1 + rs))
    ema12 = close.ewm(span=12, adjust=False).mean()
    ema26 = close.ewm(span=26, adjust=False).mean()
    out["macd"] = (ema12 - ema26) / close
    out["macd_signal"] = out.macd.ewm(span=9, adjust=False).mean()
    out["ema_gap"] = (close.ewm(span=8, adjust=False).mean() - close.ewm(span=21, adjust=False).mean()) / close
    prev_close = close.shift(1)
    tr = pd.concat([high-low, (high-prev_close).abs(), (low-prev_close).abs()], axis=1).max(axis=1)
    out["atr_pct"] = tr.rolling(14, min_periods=14).mean() / close
    for n in [1, 2, 3, 6]: out[f"return_{n}"] = close.pct_change(n)
    out["volume_change"] = volume.pct_change().replace([np.inf, -np.inf], np.nan).clip(-10, 10)
    vol_mean = volume.rolling(20, min_periods=10).mean()
    out["volume_ratio"] = volume / vol_mean.replace(0, np.nan)
    typical = (high + low + close) / 3
    out["vwap_gap"] = (close - (typical * volume).rolling(20, min_periods=10).sum() / volume.rolling(20, min_periods=10).sum()) / close
    out["range_pct"] = (high - low) / close
    ts = out.timestamp.dt.tz_convert("Asia/Kolkata")
    out["minute_of_day"] = ts.dt.hour * 60 + ts.dt.minute
    return out.replace([np.inf, -np.inf], np.nan)


def _train(symbol: str, df: pd.DataFrame):
    features = _make_features(df).dropna(subset=FEATURES).reset_index(drop=True)
    if len(features) < 90: raise ValueError("Not enough usable rows after indicator warm-up; provide a longer history.")
    models, metrics = {}, {}
    for horizon, steps in [(5, 1), (10, 2), (15, 3)]:
        target = (features.close.shift(-steps) > features.close).astype(int)
        usable = features.iloc[:-steps].copy()
        y = target.iloc[:-steps].to_numpy()
        n = len(usable)
        train_end, valid_end = int(n * .70), int(n * .85)
        if train_end < 30 or valid_end - train_end < 10: raise ValueError("Not enough observations for chronological train/validation/test splits.")
        model = RandomForestClassifier(n_estimators=180, min_samples_leaf=3, max_features="sqrt", class_weight="balanced_subsample", random_state=42, n_jobs=-1)
        model.fit(usable.iloc[:train_end][FEATURES], y[:train_end])
        pred = model.predict(usable.iloc[valid_end:][FEATURES])
        baseline = int(np.mean(y[:train_end]) >= .5)
        test_y = y[valid_end:]
        metrics[str(horizon)] = {"accuracy": float(accuracy_score(test_y, pred)), "balanced_accuracy": float(balanced_accuracy_score(test_y, pred)), "baseline_accuracy": float(accuracy_score(test_y, np.full(len(test_y), baseline))), "test_rows": int(len(test_y))}
        # Refit on all labeled historical examples once the holdout score has been recorded.
        final_model = RandomForestClassifier(n_estimators=180, min_samples_leaf=3, max_features="sqrt", class_weight="balanced_subsample", random_state=42, n_jobs=-1)
        final_model.fit(usable[FEATURES], y)
        models[str(horizon)] = final_model
    return features, models, metrics


def _prediction(horizon: int):
    if STATE["features"] is None: raise ValueError("Upload historical CSV data first.")
    row = STATE["features"].iloc[[-1]]
    model = STATE["models"][str(horizon)]
    probs = model.predict_proba(row[FEATURES])[0]
    classes = list(model.classes_)
    p_up = float(probs[classes.index(1)]) if 1 in classes else 0.0
    p_down = 1 - p_up
    score = max(p_up, p_down)
    return {"symbol": STATE["symbol"], "horizon_minutes": horizon, "direction": ("bullish" if p_up >= .5 else "bearish") if score >= .55 else "abstain", "upward_score": p_up, "downward_score": p_down, "score_note": "Uncalibrated model score; not a reliable probability.", "reference_price": float(row.close.iloc[0]), "data_timestamp": row.timestamp.iloc[0].isoformat(), "generated_at": datetime.now(timezone.utc).isoformat(), "model_version": "investiq-rf-1", "status": "experimental historical mode"}


FORECAST_HORIZONS = {"1d": (1, "1 day"), "2d": (2, "2 days"), "3d": (3, "3 days"), "1w": (5, "1 week")}


def _train_forecasts(symbol: str, daily: pd.DataFrame):
    features = _make_features(daily).dropna(subset=FEATURES).reset_index(drop=True)
    if len(features) < 400: raise ValueError("Yahoo Finance needs to provide at least 400 daily candles to train the longer forecasts.")
    models = {}
    for key, (steps, _) in FORECAST_HORIZONS.items():
        usable = features.iloc[:-steps].copy()
        y_direction = (features.close.shift(-steps).iloc[:-steps] > usable.close).astype(int).to_numpy()
        y_close = features.close.shift(-steps).iloc[:-steps].to_numpy()
        classifier = RandomForestClassifier(n_estimators=240, min_samples_leaf=5, max_features="sqrt", class_weight="balanced_subsample", random_state=42, n_jobs=-1)
        regressor = RandomForestRegressor(n_estimators=240, min_samples_leaf=5, max_features="sqrt", random_state=42, n_jobs=-1)
        classifier.fit(usable[FEATURES], y_direction)
        regressor.fit(usable[FEATURES], y_close)
        models[key] = (classifier, regressor, steps)
    return features, models


def _forecast(horizon: str, symbol: str | None = None):
    if horizon not in FORECAST_HORIZONS: raise ValueError("Choose 1 day, 2 days, 3 days or 1 week.")
    symbol = symbol or STATE.get("symbol") or FEED.get("symbol") or "RELIANCE"
    cached = FORECAST_CACHE.get(symbol)
    if cached and (datetime.now(timezone.utc) - cached[0]).total_seconds() < 21600:
        features, models = cached[1], cached[2]
    else:
        from src.providers.yahoo import fetch_chart_history
        daily_raw = fetch_chart_history(symbol, "5y", "1d")
        daily = _normalise_csv(daily_raw.to_csv(index=False))
        features, models = _train_forecasts(symbol, daily)
        FORECAST_CACHE[symbol] = (datetime.now(timezone.utc), features, models)
    if horizon not in models: raise ValueError(f"The {horizon} price prediction is not available for {symbol} yet.")
    classifier, regressor, steps = models[horizon]
    daily_row = features.iloc[[-1]]
    live_row = daily_row
    with LOCK:
        live_frame = STATE.get("frame") if STATE.get("symbol") == symbol else None
    if live_frame is not None and len(live_frame) >= 30:
        usable_live = _make_features(live_frame).dropna(subset=FEATURES)
        if not usable_live.empty:
            live_row = usable_live.iloc[[-1]]
    probs = classifier.predict_proba(daily_row[FEATURES])[0]
    classes = list(classifier.classes_)
    p_up = float(probs[classes.index(1)]) if 1 in classes else 0.0
    daily_close = float(daily_row.close.iloc[0])
    predicted_daily = float(regressor.predict(daily_row[FEATURES])[0])
    live_close = float(live_row.close.iloc[0])
    predicted_close = max(.01, live_close + predicted_daily - daily_close)
    atr = float(live_row.atr_pct.iloc[0]) if pd.notna(live_row.atr_pct.iloc[0]) else .02
    spread = max(.005, atr * (steps ** .5) * .75)
    future_date = pd.Timestamp(live_row.timestamp.iloc[0]).tz_convert("Asia/Kolkata").date() + pd.offsets.BDay(steps)
    direction = "bullish" if p_up >= .5 else "bearish"
    return {"symbol": symbol, "horizon": horizon, "horizon_label": FORECAST_HORIZONS[horizon][1], "direction": direction,
            "forecast_candle": {"timestamp": future_date.isoformat(), "open": live_close, "high": max(live_close, predicted_close) * (1 + spread / 2), "low": min(live_close, predicted_close) * (1 - spread / 2), "close": predicted_close},
            "data_timestamp": live_row.timestamp.iloc[0].isoformat(), "generated_at": datetime.now(timezone.utc).isoformat(), "status": "experimental forecast; range is an estimate"}


def _refresh_from_provider(symbol):
    from src.providers.yahoo import fetch_chart_history, fetch_recent_candles
    symbol, raw_frame = fetch_recent_candles(symbol)
    frame = _normalise_csv(raw_frame.to_csv(index=False))
    fetched_at = datetime.now(timezone.utc)
    _save_market_cache(symbol, "recent_5m", frame)
    # Publish recent prices immediately. A failure fetching the separate daily
    # model history must never hide the price history that was fetched correctly.
    with LOCK:
        STATE.update(symbol=symbol, frame=frame, data_fetched_at=fetched_at.isoformat(), status=f"Yahoo Finance · auto-refresh · {len(frame):,} recent candles for {symbol}.")
        FEED.update(last_fetch=datetime.now(timezone.utc).isoformat(), error=None)
    cached_forecast = FORECAST_CACHE.get(symbol)
    if cached_forecast and (datetime.now(timezone.utc) - cached_forecast[0]).total_seconds() < 21600:
        features, models = cached_forecast[1], cached_forecast[2]
    else:
        try:
            daily_raw = fetch_chart_history(symbol, "5y", "1d")
            daily = _normalise_csv(daily_raw.to_csv(index=False))
            features, models = _train_forecasts(symbol, daily)
            FORECAST_CACHE[symbol] = (datetime.now(timezone.utc), features, models)
        except Exception:
            # Keep feed and chart usable when only the larger model-history query fails.
            with LOCK:
                STATE.update(features=None, models={}, metrics={}, status=f"Yahoo Finance · {len(frame):,} recent candles loaded; longer forecast history unavailable.")
            return
    with LOCK:
        STATE.update(features=features, models=models, metrics={}, status=f"Yahoo Finance · auto-refresh · {len(frame):,} candles for {symbol}.")


def _feed_worker(symbol):
    interval = max(60, int(os.environ.get("YAHOO_POLL_SECONDS", "300")))
    try:
        while not FEED_STOP.is_set():
            try:
                _refresh_from_provider(symbol)
            except Exception as exc:
                message = str(exc)
                delay = max(interval, 900) if "rate limit" in message.lower() or "too many requests" in message.lower() else interval
                with LOCK:
                    FEED["error"] = message
                    FEED["retry_in_seconds"] = delay
                if FEED_STOP.wait(delay): break
                continue
            with LOCK: FEED["retry_in_seconds"] = interval
            if FEED_STOP.wait(interval): break
    finally:
        with LOCK: FEED["active"] = False


def _start_feed(symbol):
    global FEED_THREAD
    symbol = symbol.upper().strip()
    supported = {item["symbol"] for item in WATCHLIST}
    if symbol not in supported: raise ValueError("Choose one of the configured NSE stocks.")
    cached_frame, cached_at = _read_market_cache(symbol, "recent_5m")
    if cached_frame is not None:
        with LOCK:
            STATE.update(symbol=symbol, frame=cached_frame, features=None, models={}, metrics={}, data_fetched_at=cached_at, status=f"Yahoo Finance · showing saved {len(cached_frame):,}-candle history for {symbol} while refreshing.")
    if FEED_THREAD and FEED_THREAD.is_alive():
        if FEED["active"] and FEED["symbol"] == symbol: return
        FEED_STOP.set()
        FEED_THREAD.join(timeout=25)
        if FEED_THREAD.is_alive(): raise RuntimeError("Previous market-data refresh is still stopping; retry in a moment.")
    FEED_STOP.clear()
    with LOCK: FEED.update(active=True, symbol=symbol, error=None)
    FEED_THREAD = threading.Thread(target=_feed_worker, args=(symbol,), daemon=True, name="investiq-yahoo-feed")
    FEED_THREAD.start()


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args): pass
    def _send(self, status, payload, content_type="application/json; charset=utf-8"):
        data = payload if isinstance(payload, bytes) else (json.dumps(payload, default=_json_default).encode() if content_type.startswith("application/json") else payload.encode())
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()
    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/status":
            from src.explanations.bedrock import is_enabled
            self._send(200, {"status": STATE["status"], "ready": STATE["frame"] is not None, "mode": "Yahoo Finance auto-fetch" if FEED["active"] else "waiting for market data", "feed": FEED, "yahoo_configured": True, "bedrock_enabled": is_enabled(), "watchlist": WATCHLIST, "symbol": STATE["symbol"], "rows": len(STATE["frame"]) if STATE["frame"] is not None else 0, "timestamp": STATE["frame"].timestamp.iloc[-1] if STATE["frame"] is not None else None, "metrics": STATE["metrics"]}); return
        if path == "/api/history": self._send(200, _history()[-100:]); return
        if path == "/api/series":
            df = STATE["frame"]
            self._send(200, [] if df is None else df.tail(120)[["timestamp", "close"]].to_dict("records")); return
        if path == "/api/chart":
            # Fetch each displayed range directly from Yahoo at a supported granularity.
            # Yahoo limits intraday history, so week/month and longer ranges use intervals
            # appropriate to the selected window.
            ranges = {"1d": ("1d", "5m"), "1w": ("5d", "15m"), "1mo": ("1mo", "1d"), "1y": ("1y", "1d"), "3y": ("5y", "1d"), "5y": ("5y", "1d")}
            query = parse_qs(urlparse(self.path).query)
            period = query.get("range", ["1d"])[0]
            if period not in ranges: self._send(400, {"error": "Choose a supported chart range."}); return
            requested_symbol = query.get("symbol", [None])[0]
            supported = {item["symbol"] for item in WATCHLIST}
            if requested_symbol and requested_symbol not in supported: self._send(400, {"error": "Choose a supported stock symbol."}); return
            with LOCK:
                symbol = requested_symbol or STATE["symbol"] or FEED["symbol"]
                live_frame = STATE["frame"] if STATE["symbol"] == symbol else None
            if not symbol: self._send(503, {"error": "Choose a stock to load its price history."}); return
            try:
                cache_key = (symbol, period)
                cached = CHART_CACHE.get(cache_key)
                cache_ttl = 300 if period in ("1d", "1w") else 21600
                candles, updated_at, stale, source = None, None, False, "Yahoo Finance"
                if period in ("1d", "1w", "1mo") and live_frame is not None:
                    candles = live_frame.copy()
                    with LOCK: updated_at = STATE.get("data_fetched_at")
                    if updated_at:
                        stale = (datetime.now(timezone.utc) - pd.Timestamp(updated_at).to_pydatetime()).total_seconds() > 300
                    local_times = candles.timestamp.dt.tz_convert("Asia/Kolkata")
                    if period == "1d": candles = candles.loc[local_times.dt.date == local_times.iloc[-1].date()]
                    elif period == "1w": candles = candles.loc[local_times >= local_times.iloc[-1] - pd.Timedelta(days=7)]
                    else:
                        candles = candles.set_index("timestamp").sort_index()
                        candles.index = candles.index.tz_convert("Asia/Kolkata")
                        candles = candles.resample("1D").agg({"open": "first", "high": "max", "low": "min", "close": "last", "volume": "sum"}).dropna(subset=["open", "high", "low", "close"]).reset_index()
                        candles = candles.rename(columns={candles.columns[0]: "timestamp"})
                    if not candles.empty and period == "1mo": _save_market_cache(symbol, period, candles)
                elif cached and (datetime.now(timezone.utc) - cached[0]).total_seconds() < cache_ttl:
                    candles = cached[1]
                    updated_at = cached[0].isoformat()
                else:
                    disk_candles, disk_updated_at = _read_market_cache(symbol, period)
                    retry_at = CHART_RETRY_UNTIL.get(cache_key, 0)
                    if time.time() < retry_at:
                        candles, updated_at, stale = disk_candles, disk_updated_at, disk_candles is not None
                    else:
                        try:
                            from src.providers.yahoo import fetch_chart_history
                            from src.providers.yahoo import yahoo_frame_to_ohlcv
                            candles = yahoo_frame_to_ohlcv(fetch_chart_history(symbol, *ranges[period]))
                            candles["timestamp"] = pd.to_datetime(candles["timestamp"], errors="coerce", utc=True)
                            for column in ("open", "high", "low", "close", "volume"):
                                candles[column] = pd.to_numeric(candles[column], errors="coerce")
                            candles = candles.dropna(subset=["timestamp", "open", "high", "low", "close", "volume"]).sort_values("timestamp").drop_duplicates("timestamp", keep="last").reset_index(drop=True)
                            if period == "3y":
                                cutoff = pd.Timestamp.now(tz="UTC") - pd.DateOffset(years=3)
                                candles = candles.loc[candles.timestamp >= cutoff].reset_index(drop=True)
                            if candles.empty: raise ValueError("No usable candles were returned for this timeframe.")
                        except Exception:
                            # TejHQ supplies daily NSE candles when Yahoo is unavailable.
                            # Preserve intraday expectations for 1d/1w rather than
                            # presenting old daily candles as current intraday data.
                            if period in ("1d", "1w"):
                                raise
                            candles = _fetch_tej_history(symbol, period)
                            if candles.empty:
                                raise ValueError("Price history is temporarily unavailable. Retrying automatically.")
                            source = "TejHQ · NSE daily history"
                            latest = candles.timestamp.max()
                            stale = (pd.Timestamp.now(tz="UTC") - latest).total_seconds() > 7 * 86400
                        updated_at = datetime.now(timezone.utc).isoformat()
                        _save_market_cache(symbol, period, candles)
                        CHART_CACHE[cache_key] = (datetime.now(timezone.utc), candles)
                        CHART_RETRY_UNTIL.pop(cache_key, None)
                if candles is None or candles.empty: raise ValueError("Price history is temporarily unavailable. Retrying automatically.")
                as_of = candles.timestamp.max().isoformat() if "timestamp" in candles else None
                self._send(200, {"symbol": symbol, "range": period, "candles": candles.to_dict("records"), "updated_at": updated_at, "as_of": as_of, "stale": stale, "source": source})
            except Exception as exc:
                if "rate limit" in str(exc).lower() or "too many requests" in str(exc).lower():
                    CHART_RETRY_UNTIL[cache_key] = time.time() + 900
                    fallback, fallback_at = _read_market_cache(symbol, period)
                    if fallback is not None:
                        self._send(200, {"symbol": symbol, "range": period, "candles": fallback.to_dict("records"), "updated_at": fallback_at, "as_of": fallback.timestamp.max().isoformat(), "stale": True, "source": "Saved market history"})
                        return
                self._send(502, {"error": "Price history is temporarily unavailable. Retrying automatically."})
            return
        if path == "/": self._send(200, (WEB / "index.html").read_bytes(), "text/html; charset=utf-8"); return
        self._send(404, {"error": "Not found"})
    def do_POST(self):
        path = urlparse(self.path).path
        try:
            size = int(self.headers.get("Content-Length", "0"))
            if size > 15_000_000: raise ValueError("CSV is too large (15 MB maximum).")
            raw = self.rfile.read(size)
            if path == "/api/upload":
                payload = json.loads(raw or b"{}")
                symbol = str(payload.get("symbol", "CUSTOM")).strip().upper()[:20] or "CUSTOM"
                df = _normalise_csv(payload.get("csv", ""))
                features, models, metrics = _train(symbol, df)
                with LOCK:
                    STATE.update(symbol=symbol, frame=df, features=features, models=models, metrics=metrics, status=f"Loaded {len(df):,} historical candles for {symbol}.")
                self._send(200, {"ok": True, "status": STATE["status"], "rows": len(df), "metrics": metrics}); return
            if path == "/api/market/start":
                req = json.loads(raw or b"{}")
                _start_feed(str(req.get("symbol", "RELIANCE")))
                self._send(200, {"ok": True, "feed": FEED, "status": f"Fetching five-minute candles for {FEED['symbol']} from Yahoo Finance."}); return
            if path == "/api/market/stop":
                FEED_STOP.set()
                with LOCK: FEED["active"] = False
                self._send(200, {"ok": True, "feed": FEED}); return
            if path == "/api/predict":
                req = json.loads(raw or b"{}")
                horizon = str(req.get("horizon", "1d"))
                symbol = str(req.get("symbol") or STATE.get("symbol") or FEED.get("symbol") or "RELIANCE").upper()
                if symbol not in {item["symbol"] for item in WATCHLIST}:
                    raise ValueError("Choose a supported stock before requesting a prediction.")
                result = _forecast(horizon, symbol)
                with LOCK:
                    history = _history(); history.append(result); HISTORY_PATH.write_text(json.dumps(history[-1000:], indent=2), encoding="utf-8")
                self._send(200, result); return
            if path == "/api/explain":
                from src.explanations.bedrock import explain
                req = json.loads(raw or b"{}")
                horizon = int(req.get("horizon", 5))
                if horizon not in (5, 10, 15): raise ValueError("Choose a 5, 10 or 15 minute horizon.")
                with LOCK:
                    prediction = _prediction(horizon)
                    row = STATE["features"].iloc[-1]
                    indicators = {key: float(row[key]) for key in ("return_1", "rsi_14", "macd", "ema_gap", "atr_pct", "volume_ratio", "vwap_gap") if pd.notna(row[key])}
                self._send(200, {"explanation": explain(prediction, indicators)}); return
            self._send(404, {"error": "Not found"})
        except Exception as exc:
            self._send(400, {"error": str(exc)})


if __name__ == "__main__":
    print(f"InvestIQ dashboard: http://127.0.0.1:{PORT}")
    threading.Timer(1.0, lambda: _start_feed(os.environ.get("AUTO_FETCH_SYMBOL", "RELIANCE"))).start()
    ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
