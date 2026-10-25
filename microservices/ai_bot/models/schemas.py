from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CompanyScoreBreakdown(BaseModel):
    fundamental_score: float = Field(..., description="Fundamentals score out of 35")
    technical_score: float = Field(..., description="Technicals score out of 30")
    performance_score: float = Field(..., description="Volume & price performance score out of 15")
    sentiment_score: float = Field(..., description="News sentiment score out of 10")
    valuation_score: float = Field(..., description="Valuation score out of 10")
    total_score: float = Field(..., description="Total company score out of 100")
    rating_category: str = Field(..., description="Strong (>=70), Mixed/Moderate (45-69), or Weaker (<45)")
    key_positives: List[str] = Field(default_factory=list)
    key_risks: List[str] = Field(default_factory=list)
    analytical_conclusion: str = ""

class FundamentalData(BaseModel):
    cmp: Optional[float] = Field(None, description="Current Market Price (₹ or $)")
    currency: Optional[str] = "INR"
    price_timestamp: Optional[str] = None
    delay_status: str = "Real-time / Latest Available"
    data_source: str = "Exchange Feed / Yahoo Finance"
    
    # Core Requested Metrics
    pe_ratio: Optional[float] = Field(None, description="Trailing P/E Ratio")
    forward_pe: Optional[float] = Field(None, description="Forward P/E Ratio")
    pb_ratio: Optional[float] = Field(None, description="Price-to-Book Ratio")
    market_cap: Optional[float] = None
    market_cap_cr: Optional[float] = Field(None, description="Market Capitalization in ₹ Crores")
    market_cap_formatted: Optional[str] = None
    dividend_yield: Optional[float] = Field(None, description="Dividend Yield in %")
    dividend_rate: Optional[float] = Field(None, description="Annual Dividend per share")
    ex_dividend_date: Optional[str] = None
    
    # Quarterly Financials
    quarterly_net_profit_cr: Optional[float] = Field(None, description="Quarterly Net Profit in ₹ Crores (NP Qtr)")
    quarterly_profit_var_pct: Optional[float] = Field(None, description="Quarterly Profit Variation % (Qtr Profit Var %)")
    quarterly_sales_cr: Optional[float] = Field(None, description="Quarterly Sales/Revenue in ₹ Crores (Sales Qtr)")
    quarterly_sales_var_pct: Optional[float] = Field(None, description="Quarterly Sales Variation % (Qtr Sales Var %)")
    quarter_reporting_period: Optional[str] = None
    
    # Efficiency & Ratios
    roce: Optional[float] = Field(None, description="Return on Capital Employed % (ROCE %)")
    roe: Optional[float] = Field(None, description="Return on Equity % (ROE %)")
    eps: Optional[float] = Field(None, description="Earnings Per Share")
    debt_to_equity: Optional[float] = Field(None, description="Debt to Equity Ratio")
    profit_margins: Optional[float] = Field(None, description="Net Profit Margin in %")
    
    # Trading Range
    fifty_two_week_high: Optional[float] = None
    fifty_two_week_low: Optional[float] = None
    day_high: Optional[float] = None
    day_low: Optional[float] = None
    volume: Optional[int] = None
    avg_volume: Optional[int] = None
    sector: Optional[str] = None
    industry: Optional[str] = None
    summary: Optional[str] = None

class CandleData(BaseModel):
    timestamp: str
    open: float
    high: float
    low: float
    close: float
    volume: int
    is_completed: bool = True

class TechnicalIndicator(BaseModel):
    timeframe: str = "15m"
    rsi_14: Optional[float] = None
    rsi_condition: Optional[str] = None  # Overbought, Oversold, Neutral
    macd: Optional[float] = None
    macd_signal: Optional[float] = None
    macd_histogram: Optional[float] = None
    macd_crossover: Optional[str] = None  # Bullish, Bearish, Neutral
    sma_20: Optional[float] = None
    sma_50: Optional[float] = None
    sma_200: Optional[float] = None
    ema_9: Optional[float] = None
    ema_21: Optional[float] = None
    bollinger_upper: Optional[float] = None
    bollinger_middle: Optional[float] = None
    bollinger_lower: Optional[float] = None
    support_level: Optional[float] = None
    resistance_level: Optional[float] = None
    trend_signal: str = "Neutral"  # Bullish Rise / Bearish Fall / Neutral

class NewsItem(BaseModel):
    title: str
    source: Optional[str] = None
    published_at: Optional[str] = None
    link: Optional[str] = None
    sentiment_tag: Optional[str] = None  # Positive / Neutral / Negative

class SentimentData(BaseModel):
    score: float = Field(0.0, description="Sentiment Score ranging from -1.0 to +1.0")
    sentiment_label: str = "Neutral"  # Bullish / Positive, Neutral, Bearish / Negative
    positive_count: int = 0
    negative_count: int = 0
    neutral_count: int = 0
    headlines: List[NewsItem] = []
    key_drivers: List[str] = []

class StockAnalysisSummary(BaseModel):
    ticker: str
    company_name: str
    exchange: str = "NSE"
    data_timestamp: str
    fundamentals: FundamentalData
    technicals: TechnicalIndicator
    sentiment: SentimentData
    company_score: CompanyScoreBreakdown
    overall_prediction: str
    confidence_level: str

class StockComparisonResponse(BaseModel):
    company_a: StockAnalysisSummary
    company_b: StockAnalysisSummary
    technical_winner: str
    fundamental_winner: str
    sentiment_winner: str
    score_winner: str
    overall_recommendation: str
    metric_comparison: Dict[str, Any]

class ChatRequest(BaseModel):
    message: str = Field(..., description="User prompt or question")
    session_id: Optional[str] = Field(None, description="Session ID for continuous conversation memory")
    current_stock: Optional[str] = Field(None, description="Currently viewed stock ticker or name")
    compare_stock: Optional[str] = Field(None, description="Optional secondary stock for comparison")
    page_context: Optional[str] = Field(None, description="Active page or view context")

class ChatResponse(BaseModel):
    reply: str
    session_id: str
    active_company: Optional[str] = None
    active_ticker: Optional[str] = None
    analyzed_stocks: List[StockAnalysisSummary] = []
    comparison: Optional[StockComparisonResponse] = None
    timestamp: str

class CandleResponse(BaseModel):
    ticker: str
    company_name: str
    interval: str  # 5m, 10m, 15m
    candles: List[CandleData]
    latest_completed_candle: Optional[CandleData] = None
