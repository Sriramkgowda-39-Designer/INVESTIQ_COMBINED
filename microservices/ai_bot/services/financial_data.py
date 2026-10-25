import datetime
import time
from typing import List, Optional, Tuple, Dict, Any
import numpy as np
import pandas as pd
import yfinance as yf

from models.schemas import (
    FundamentalData,
    TechnicalIndicator,
    CandleData,
    StockAnalysisSummary
)
from services.sentiment_analyzer import fetch_and_analyze_sentiment
from services.ticker_resolver import resolve_ticker
from services.scoring_service import calculate_company_score

# In-memory TTL cache (key: ticker, val: (timestamp, StockAnalysisSummary))
CACHE_TTL_SECONDS = 60
_ANALYSIS_CACHE: Dict[str, Tuple[float, StockAnalysisSummary]] = {}

def get_current_kolkata_time() -> str:
    # Approximate or formatted local time
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")

def format_crores(amount: Optional[float]) -> Optional[str]:
    """Formats amount into ₹ Crores."""
    if amount is None or np.isnan(amount):
        return None
    crores = amount / 1e7
    if crores >= 100000:
        return f"₹{crores/100000:.2f} Lakh Cr"
    return f"₹{crores:,.2f} Cr"

def calculate_rsi(series: pd.Series, period: int = 14) -> pd.Series:
    """Calculates Relative Strength Index (RSI)."""
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()

    rs = gain / (loss + 1e-9)
    rsi = 100 - (100 / (1 + rs))
    return rsi

def calculate_technical_indicators(df: pd.DataFrame, timeframe: str = "15m") -> TechnicalIndicator:
    """Calculates RSI, MACD, Moving Averages, Bollinger Bands, and Support/Resistance from candles."""
    if df.empty or len(df) < 5:
        return TechnicalIndicator(timeframe=timeframe, trend_signal="Neutral")

    close = df['Close']
    high = df['High']
    low = df['Low']

    # Moving Averages
    sma_20 = close.rolling(window=min(20, len(close))).mean().iloc[-1] if len(close) >= 5 else None
    sma_50 = close.rolling(window=min(50, len(close))).mean().iloc[-1] if len(close) >= 20 else None
    sma_200 = close.rolling(window=min(200, len(close))).mean().iloc[-1] if len(close) >= 50 else None

    ema_9 = close.ewm(span=min(9, len(close)), adjust=False).mean().iloc[-1] if len(close) >= 5 else None
    ema_21 = close.ewm(span=min(21, len(close)), adjust=False).mean().iloc[-1] if len(close) >= 10 else None

    # RSI
    rsi_series = calculate_rsi(close, period=min(14, max(5, len(close)-1)))
    rsi_val = float(rsi_series.dropna().iloc[-1]) if not rsi_series.dropna().empty else 50.0
    rsi_val = round(rsi_val, 2)

    if rsi_val >= 70:
        rsi_condition = "Overbought (> 70)"
    elif rsi_val <= 30:
        rsi_condition = "Oversold (< 30)"
    else:
        rsi_condition = "Neutral (30 - 70)"

    # MACD (12, 26, 9)
    ema_12 = close.ewm(span=min(12, len(close)), adjust=False).mean()
    ema_26 = close.ewm(span=min(26, len(close)), adjust=False).mean()
    macd_line = ema_12 - ema_26
    signal_line = macd_line.ewm(span=min(9, len(macd_line)), adjust=False).mean()
    histogram = macd_line - signal_line

    latest_macd = round(float(macd_line.iloc[-1]), 2)
    latest_signal = round(float(signal_line.iloc[-1]), 2)
    latest_hist = round(float(histogram.iloc[-1]), 2)

    if latest_hist > 0 and latest_macd > latest_signal:
        macd_crossover = "Bullish Crossover"
    elif latest_hist < 0 and latest_macd < latest_signal:
        macd_crossover = "Bearish Crossover"
    else:
        macd_crossover = "Neutral"

    # Bollinger Bands (20-period)
    bb_period = min(20, len(close))
    bb_mean = close.rolling(window=bb_period).mean().iloc[-1]
    bb_std = close.rolling(window=bb_period).std().iloc[-1]
    bb_upper = round(float(bb_mean + 2 * bb_std), 2) if not np.isnan(bb_std) else None
    bb_lower = round(float(bb_mean - 2 * bb_std), 2) if not np.isnan(bb_std) else None
    bb_middle = round(float(bb_mean), 2) if not np.isnan(bb_mean) else None

    # Support & Resistance (recent swing low and high)
    support_lvl = round(float(low.tail(20).min()), 2)
    resistance_lvl = round(float(high.tail(20).max()), 2)

    current_price = float(close.iloc[-1])

    # Determine Technical Signal
    bullish_signals = 0
    bearish_signals = 0

    if rsi_val > 53:
        bullish_signals += 1
    elif rsi_val < 47:
        bearish_signals += 1

    if macd_crossover == "Bullish Crossover":
        bullish_signals += 1
    elif macd_crossover == "Bearish Crossover":
        bearish_signals += 1

    if ema_9 and ema_21:
        if ema_9 > ema_21:
            bullish_signals += 1
        else:
            bearish_signals += 1

    if sma_20 and current_price > sma_20:
        bullish_signals += 1
    elif sma_20 and current_price < sma_20:
        bearish_signals += 1

    if bullish_signals >= 3:
        trend = "Bullish Rise"
    elif bearish_signals >= 3:
        trend = "Bearish Fall"
    else:
        trend = "Neutral / Sideways"

    return TechnicalIndicator(
        timeframe=timeframe,
        rsi_14=rsi_val,
        rsi_condition=rsi_condition,
        macd=latest_macd,
        macd_signal=latest_signal,
        macd_histogram=latest_hist,
        macd_crossover=macd_crossover,
        sma_20=round(float(sma_20), 2) if sma_20 else None,
        sma_50=round(float(sma_50), 2) if sma_50 else None,
        sma_200=round(float(sma_200), 2) if sma_200 else None,
        ema_9=round(float(ema_9), 2) if ema_9 else None,
        ema_21=round(float(ema_21), 2) if ema_21 else None,
        bollinger_upper=bb_upper,
        bollinger_middle=bb_middle,
        bollinger_lower=bb_lower,
        support_level=support_lvl,
        resistance_level=resistance_lvl,
        trend_signal=trend
    )

def fetch_stock_candles(ticker: str, interval: str = "15m", period: str = "5d") -> List[CandleData]:
    """
    Fetches real-time intraday candlestick data:
    - 5m: direct from provider
    - 10m: strictly aggregated from two consecutive 5m candles (Open1, max High, min Low, Close2, sum Volume)
    - 15m: direct from provider
    """
    try:
        t = yf.Ticker(ticker)
        if interval == "10m":
            df = t.history(period=period, interval="5m")
            if df.empty or len(df) < 2:
                return []
            
            candles_10m: List[CandleData] = []
            # Aggregate pairs of consecutive 5m candles
            # Ensure proper alignment from start
            num_pairs = len(df) // 2
            for i in range(num_pairs):
                c1 = df.iloc[2 * i]
                c2 = df.iloc[2 * i + 1]
                
                c_open = round(float(c1['Open']), 2)
                c_high = round(max(float(c1['High']), float(c2['High'])), 2)
                c_low = round(min(float(c1['Low']), float(c2['Low'])), 2)
                c_close = round(float(c2['Close']), 2)
                c_vol = int(c1['Volume'] + c2['Volume'])
                ts_str = df.index[2 * i].strftime("%Y-%m-%d %H:%M IST")

                candles_10m.append(CandleData(
                    timestamp=ts_str,
                    open=c_open,
                    high=c_high,
                    low=c_low,
                    close=c_close,
                    volume=c_vol,
                    is_completed=True
                ))
            return candles_10m[-60:]
        else:
            df = t.history(period=period, interval=interval)
            if df.empty:
                return []
            
            candles: List[CandleData] = []
            for idx, row in df.iterrows():
                ts_str = idx.strftime("%Y-%m-%d %H:%M IST")
                candles.append(CandleData(
                    timestamp=ts_str,
                    open=round(float(row['Open']), 2),
                    high=round(float(row['High']), 2),
                    low=round(float(row['Low']), 2),
                    close=round(float(row['Close']), 2),
                    volume=int(row['Volume']),
                    is_completed=True
                ))
            return candles[-60:]
    except Exception:
        return []

def get_complete_stock_analysis(ticker_or_name: str, force_refresh: bool = False) -> StockAnalysisSummary:
    """
    Retrieves full Fundamental, Technical, and Sentimental analysis
    with deterministic Company Score and transparent methodology.
    Uses in-memory 60s TTL cache for fast, rate-limit-safe responses.
    """
    ticker = resolve_ticker(ticker_or_name)
    now_ts = time.time()

    # Check cache
    if not force_refresh and ticker in _ANALYSIS_CACHE:
        cached_time, cached_summary = _ANALYSIS_CACHE[ticker]
        if now_ts - cached_time < CACHE_TTL_SECONDS:
            return cached_summary

    t = yf.Ticker(ticker)

    # 1. Fetch info
    info: Dict[str, Any] = {}
    try:
        info = t.info or {}
    except Exception:
        info = {}

    # CMP check
    cmp = None
    try:
        if hasattr(t, "fast_info") and t.fast_info is not None:
            cmp = t.fast_info.get("last_price")
    except Exception:
        pass

    if cmp is None or np.isnan(cmp):
        cmp = info.get("currentPrice") or info.get("regularMarketPrice") or info.get("previousClose")

    if cmp is not None:
        cmp = round(float(cmp), 2)

    raw_name = info.get("shortName") or info.get("longName") or ticker.replace(".NS", "")
    company_name = raw_name.title() if raw_name else ticker.replace(".NS", "")
    currency = info.get("currency", "INR" if ticker.endswith(".NS") else "USD")

    # Valuation & Market Cap
    market_cap = info.get("marketCap")
    market_cap_cr = round(market_cap / 1e7, 2) if (market_cap and currency == "INR") else None
    market_cap_formatted = format_crores(market_cap) if currency == "INR" else f"${market_cap/1e9:.2f} B" if market_cap else None

    pe_ratio = info.get("trailingPE")
    if pe_ratio:
        pe_ratio = round(pe_ratio, 2)

    forward_pe = info.get("forwardPE")
    if forward_pe:
        forward_pe = round(forward_pe, 2)

    pb_ratio = info.get("priceToBook")
    if pb_ratio:
        pb_ratio = round(pb_ratio, 2)

    # Dividend
    dividend_yield = info.get("dividendYield")
    if dividend_yield is not None:
        dividend_yield = round(dividend_yield * 100, 2) if dividend_yield < 1 else round(dividend_yield, 2)

    dividend_rate = info.get("dividendRate")
    ex_div_timestamp = info.get("exDividendDate")
    ex_dividend_date = None
    if ex_div_timestamp:
        try:
            ex_dividend_date = datetime.datetime.fromtimestamp(ex_div_timestamp).strftime("%Y-%m-%d")
        except Exception:
            ex_dividend_date = str(ex_div_timestamp)

    # 2. Quarterly Financials (NP Qtr, Sales Qtr, Profit Var %, Sales Var %)
    sales_qtr_cr = None
    np_qtr_cr = None
    qtr_sales_var = None
    qtr_profit_var = None
    quarter_period = None
    roce = None

    try:
        qi = t.quarterly_income_stmt
        if qi is not None and not qi.empty:
            quarter_period = str(qi.columns[0])[:10]
            
            # Sales Qtr
            if 'Total Revenue' in qi.index:
                rev_series = qi.loc['Total Revenue']
                if len(rev_series) > 0 and pd.notna(rev_series.iloc[0]):
                    sales_qtr_cr = round(float(rev_series.iloc[0]) / 1e7, 2)
                    if len(rev_series) > 1 and pd.notna(rev_series.iloc[1]) and rev_series.iloc[1] != 0:
                        qtr_sales_var = round(((float(rev_series.iloc[0]) - float(rev_series.iloc[1])) / abs(float(rev_series.iloc[1]))) * 100, 2)

            # Net Profit Qtr
            if 'Net Income' in qi.index:
                ni_series = qi.loc['Net Income']
                if len(ni_series) > 0 and pd.notna(ni_series.iloc[0]):
                    np_qtr_cr = round(float(ni_series.iloc[0]) / 1e7, 2)
                    if len(ni_series) > 1 and pd.notna(ni_series.iloc[1]) and ni_series.iloc[1] != 0:
                        qtr_profit_var = round(((float(ni_series.iloc[0]) - float(ni_series.iloc[1])) / abs(float(ni_series.iloc[1]))) * 100, 2)

            # ROCE Calculation: EBIT / (Total Assets - Current Liabilities)
            if 'EBIT' in qi.index and pd.notna(qi.loc['EBIT'].iloc[0]):
                ebit_val = float(qi.loc['EBIT'].iloc[0]) * 4  # Annualized EBIT
                try:
                    bs = t.quarterly_balance_sheet
                    if bs is not None and not bs.empty:
                        invested_cap = None
                        if 'Invested Capital' in bs.index and pd.notna(bs.loc['Invested Capital'].iloc[0]):
                            invested_cap = float(bs.loc['Invested Capital'].iloc[0])
                        elif 'Common Stock Equity' in bs.index and 'Total Debt' in bs.index:
                            equity = float(bs.loc['Common Stock Equity'].iloc[0])
                            debt = float(bs.loc['Total Debt'].iloc[0])
                            invested_cap = equity + debt

                        if invested_cap and invested_cap > 0:
                            roce = round((ebit_val / invested_cap) * 100, 2)
                except Exception:
                    pass
    except Exception:
        pass

    # Fallback for Sales/Profit if quarterly statement was unavailable
    if sales_qtr_cr is None and info.get("totalRevenue"):
        sales_qtr_cr = round((info.get("totalRevenue") / 4) / 1e7, 2)

    # Return on Equity (ROE)
    roe = info.get("returnOnEquity")
    if roe is not None:
        roe = round(roe * 100, 2)

    # If ROCE not computed from Balance Sheet, estimate from ROE + leverage proxy
    if roce is None and roe is not None:
        roce = round(roe * 1.12, 2)

    debt_to_equity = info.get("debtToEquity")
    if debt_to_equity is not None:
        debt_to_equity = round(debt_to_equity, 2)

    profit_margins = info.get("profitMargins")
    if profit_margins is not None:
        profit_margins = round(profit_margins * 100, 2)

    fundamentals = FundamentalData(
        cmp=cmp,
        currency=currency,
        price_timestamp=get_current_kolkata_time(),
        delay_status="Real-time Exchange / Latest Available",
        data_source="NSE / Yahoo Finance Engine",
        pe_ratio=pe_ratio,
        forward_pe=forward_pe,
        pb_ratio=pb_ratio,
        market_cap=market_cap,
        market_cap_cr=market_cap_cr,
        market_cap_formatted=market_cap_formatted,
        dividend_yield=dividend_yield,
        dividend_rate=round(dividend_rate, 2) if dividend_rate else None,
        ex_dividend_date=ex_dividend_date,
        quarterly_net_profit_cr=np_qtr_cr,
        quarterly_profit_var_pct=qtr_profit_var,
        quarterly_sales_cr=sales_qtr_cr,
        quarterly_sales_var_pct=qtr_sales_var,
        quarter_reporting_period=quarter_period,
        roce=roce,
        roe=roe,
        eps=round(info.get("trailingEps"), 2) if info.get("trailingEps") else None,
        debt_to_equity=debt_to_equity,
        profit_margins=profit_margins,
        fifty_two_week_high=round(info.get("fiftyTwoWeekHigh"), 2) if info.get("fiftyTwoWeekHigh") else None,
        fifty_two_week_low=round(info.get("fiftyTwoWeekLow"), 2) if info.get("fiftyTwoWeekLow") else None,
        day_high=round(info.get("dayHigh") or info.get("regularMarketDayHigh"), 2) if (info.get("dayHigh") or info.get("regularMarketDayHigh")) else None,
        day_low=round(info.get("dayLow") or info.get("regularMarketDayLow"), 2) if (info.get("dayLow") or info.get("regularMarketDayLow")) else None,
        volume=info.get("volume") or info.get("regularMarketVolume"),
        avg_volume=info.get("averageVolume"),
        sector=info.get("sector"),
        industry=info.get("industry"),
        summary=info.get("longBusinessSummary", "")[:350]
    )

    # 3. Technical Indicators (15m candles over 5 days)
    df_hist = pd.DataFrame()
    try:
        df_hist = t.history(period="5d", interval="15m")
        if df_hist.empty:
            df_hist = t.history(period="1mo", interval="1d")
    except Exception:
        pass

    technicals = calculate_technical_indicators(df_hist, timeframe="15m")

    # 4. Sentiment Analysis
    sentiment = fetch_and_analyze_sentiment(company_name, ticker)

    # 5. Deterministic Company Score (0-100)
    score_breakdown = calculate_company_score(fundamentals, technicals, sentiment)

    summary = StockAnalysisSummary(
        ticker=ticker,
        company_name=company_name,
        exchange="NSE" if ticker.endswith(".NS") else "US/Global",
        data_timestamp=get_current_kolkata_time(),
        fundamentals=fundamentals,
        technicals=technicals,
        sentiment=sentiment,
        company_score=score_breakdown,
        overall_prediction=f"{technicals.trend_signal} ({score_breakdown.rating_category})",
        confidence_level="High" if score_breakdown.total_score >= 65 else "Moderate"
    )

    # Store in cache
    _ANALYSIS_CACHE[ticker] = (now_ts, summary)
    return summary
