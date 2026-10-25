"""Yahoo Finance chart candles with a direct chart API request.

Using the chart endpoint avoids yfinance's crumb/cookie handshake, which is
prone to getting rate limited independently from the public chart endpoint.
"""
import pandas as pd
import requests


YAHOO_SYMBOLS = {"TATAMOTORS": "TMPV"}


def _ticker(symbol: str) -> str:
    symbol = symbol.upper().strip()
    if symbol.endswith(".NS"):
        return symbol
    return f"{YAHOO_SYMBOLS.get(symbol, symbol)}.NS"


def _chart_request(ticker: str, period: str, interval: str) -> pd.DataFrame:
    last_error = None
    for host in ("query1.finance.yahoo.com", "query2.finance.yahoo.com"):
        try:
            response = requests.get(
                f"https://{host}/v8/finance/chart/{ticker}",
                params={"range": period, "interval": interval, "events": "history"},
                headers={"User-Agent": "Mozilla/5.0 (compatible; InvestIQ/1.0)"},
                timeout=20,
            )
            response.raise_for_status()
            payload = response.json().get("chart", {})
            if payload.get("error"):
                raise RuntimeError(payload["error"].get("description", "Yahoo Finance returned an error."))
            result = (payload.get("result") or [None])[0]
            if not result:
                raise ValueError(f"Yahoo Finance returned no candles for {ticker}.")
            timestamps = result.get("timestamp") or []
            quote = (result.get("indicators", {}).get("quote") or [{}])[0]
            frame = pd.DataFrame({
                "timestamp": pd.to_datetime(timestamps, unit="s", utc=True),
                "open": quote.get("open", []), "high": quote.get("high", []),
                "low": quote.get("low", []), "close": quote.get("close", []),
                "volume": quote.get("volume", []),
            })
            frame = frame.dropna(subset=["timestamp", "open", "high", "low", "close"])
            if frame.empty:
                raise ValueError(f"Yahoo Finance returned no usable candles for {ticker}.")
            frame["volume"] = frame["volume"].fillna(0)
            return frame.reset_index(drop=True)
        except Exception as exc:
            last_error = exc
    raise RuntimeError(f"Yahoo Finance chart request failed for {ticker}: {last_error}") from last_error


def yahoo_frame_to_ohlcv(history: pd.DataFrame) -> pd.DataFrame:
    """Normalize yfinance.download output across flat and MultiIndex columns."""
    if history is None or history.empty:
        raise ValueError("Yahoo Finance returned no recent five-minute candles for this symbol.")
    frame = history.copy()
    if isinstance(frame.columns, pd.MultiIndex):
        frame.columns = frame.columns.get_level_values(0)
    frame.columns = [str(c).strip().lower().replace(" ", "_") for c in frame.columns]
    required = ["timestamp", "open", "high", "low", "close", "volume"]
    if all(column in frame.columns for column in required):
        return frame[required].reset_index(drop=True)
    frame = frame.reset_index()
    frame.columns = [str(c).strip().lower().replace(" ", "_") for c in frame.columns]
    time_col = next((c for c in frame.columns if c in ("timestamp", "datetime", "date", "index")), None)
    if time_col is None:
        raise ValueError("Yahoo Finance response did not include candle timestamps.")
    frame = frame.rename(columns={time_col: "timestamp"})
    missing = [column for column in required if column not in frame.columns]
    if missing: raise ValueError("Yahoo Finance response is missing: " + ", ".join(missing))
    return frame[required]


def fetch_recent_candles(symbol: str) -> tuple[str, pd.DataFrame]:
    symbol = symbol.upper().strip()
    if not symbol or not symbol.replace("&", "").isalnum():
        raise ValueError("Choose a valid Yahoo Finance ticker.")
    ticker = _ticker(symbol)
    return symbol.removesuffix(".NS"), _chart_request(ticker, "1mo", "5m")


def fetch_chart_history(symbol: str, period: str, interval: str) -> pd.DataFrame:
    """Fetch one chart range using a Yahoo interval compatible with its window."""
    symbol = symbol.upper().strip()
    return _chart_request(_ticker(symbol), period, interval)
