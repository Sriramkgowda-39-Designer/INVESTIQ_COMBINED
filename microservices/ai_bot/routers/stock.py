from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from models.schemas import StockAnalysisSummary, StockComparisonResponse, CandleResponse
from services.financial_data import get_complete_stock_analysis, fetch_stock_candles
from services.stock_comparator import compare_two_companies
from services.ticker_resolver import resolve_ticker

router = APIRouter(prefix="/api/stock", tags=["Stock Market Analytics"])

@router.get("/analyze/{ticker_or_name}", response_model=StockAnalysisSummary)
def analyze_stock(ticker_or_name: str):
    """
    Returns complete Fundamental, Technical, and Sentimental analysis
    along with synthesis and rise/fall trend prediction for a single company.
    """
    try:
        return get_complete_stock_analysis(ticker_or_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze stock '{ticker_or_name}': {str(e)}")

@router.get("/compare", response_model=StockComparisonResponse)
def compare_stocks(
    stock_a: str = Query(..., description="First stock name or ticker (e.g. RELIANCE, TCS)"),
    stock_b: str = Query(..., description="Second stock name or ticker (e.g. INFY, HDFCBANK)")
):
    """
    Compares two companies side-by-side across Fundamentals, Technicals, and Sentiment.
    """
    try:
        return compare_two_companies(stock_a, stock_b)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compare '{stock_a}' and '{stock_b}': {str(e)}")

@router.get("/candles/{ticker_or_name}", response_model=CandleResponse)
def get_candles(
    ticker_or_name: str,
    interval: str = Query("15m", pattern="^(5m|10m|15m)$", description="Candle interval (5m, 10m, or 15m)"),
    period: str = Query("5d", description="Historical duration, e.g. 1d, 5d, 1mo")
):
    """
    Returns intraday candlestick data (open, high, low, close, volume) 
    for 5 min, 10 min, or 15 min intervals.
    """
    ticker = resolve_ticker(ticker_or_name)
    candles = fetch_stock_candles(ticker, interval=interval, period=period)
    return CandleResponse(
        ticker=ticker,
        company_name=ticker.replace(".NS", ""),
        interval=interval,
        candles=candles,
        latest_completed_candle=candles[-1] if candles else None
    )
