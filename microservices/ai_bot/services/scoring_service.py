from typing import List, Tuple
from models.schemas import FundamentalData, TechnicalIndicator, SentimentData, CompanyScoreBreakdown

def calculate_company_score(
    fundamentals: FundamentalData,
    technicals: TechnicalIndicator,
    sentiment: SentimentData
) -> CompanyScoreBreakdown:
    """
    Calculates transparent, deterministic company analysis score (0-100):
    - Fundamentals & Financial Quality: 35 pts
    - Technical Trend & Momentum: 30 pts
    - Recent Performance & Volume Confirmation: 15 pts
    - News Sentiment: 10 pts
    - Valuation: 10 pts
    """
    positives: List[str] = []
    risks: List[str] = []

    # 1. Fundamentals (Max 35 pts)
    fund_pts = 0.0
    # ROE (0-8 pts)
    if fundamentals.roe is not None:
        if fundamentals.roe >= 20:
            fund_pts += 8.0
            positives.append(f"High Return on Equity (ROE: {fundamentals.roe}%)")
        elif fundamentals.roe >= 12:
            fund_pts += 5.5
        elif fundamentals.roe > 0:
            fund_pts += 3.0
        else:
            risks.append(f"Negative Return on Equity (ROE: {fundamentals.roe}%)")
    else:
        fund_pts += 4.0  # Neutral allocation if missing

    # ROCE (0-7 pts)
    if fundamentals.roce is not None:
        if fundamentals.roce >= 18:
            fund_pts += 7.0
            positives.append(f"Strong ROCE of {fundamentals.roce}% reflects efficient capital deployment")
        elif fundamentals.roce >= 10:
            fund_pts += 4.5
        elif fundamentals.roce > 0:
            fund_pts += 2.0
    else:
        fund_pts += 3.5

    # Debt-to-Equity (0-7 pts)
    if fundamentals.debt_to_equity is not None:
        if fundamentals.debt_to_equity < 50:
            fund_pts += 7.0
            positives.append(f"Low leverage with Debt-to-Equity at {fundamentals.debt_to_equity}")
        elif fundamentals.debt_to_equity < 100:
            fund_pts += 4.5
        elif fundamentals.debt_to_equity < 200:
            fund_pts += 2.0
            risks.append(f"Moderate Debt-to-Equity ratio of {fundamentals.debt_to_equity}")
        else:
            risks.append(f"High Debt-to-Equity ratio of {fundamentals.debt_to_equity}")
    else:
        fund_pts += 3.5

    # Profit Margin (0-7 pts)
    if fundamentals.profit_margins is not None:
        if fundamentals.profit_margins >= 15:
            fund_pts += 7.0
            positives.append(f"Healthy Net Profit Margin of {fundamentals.profit_margins}%")
        elif fundamentals.profit_margins >= 8:
            fund_pts += 4.5
        elif fundamentals.profit_margins > 0:
            fund_pts += 2.5
        else:
            risks.append(f"Negative profit margins ({fundamentals.profit_margins}%)")
    else:
        fund_pts += 3.5

    # Quarterly Profit Growth (0-6 pts)
    if fundamentals.quarterly_profit_var_pct is not None:
        if fundamentals.quarterly_profit_var_pct > 15:
            fund_pts += 6.0
            positives.append(f"Quarterly profit surged {fundamentals.quarterly_profit_var_pct:+.1f}% YoY")
        elif fundamentals.quarterly_profit_var_pct > 0:
            fund_pts += 4.0
        else:
            risks.append(f"Quarterly profit contracted {fundamentals.quarterly_profit_var_pct:.1f}%")
    else:
        fund_pts += 3.0

    # 2. Technical Trend & Momentum (Max 30 pts)
    tech_pts = 0.0
    # RSI (0-10 pts)
    if technicals.rsi_14 is not None:
        if 48 <= technicals.rsi_14 <= 65:
            tech_pts += 10.0
            positives.append(f"RSI-14 ({technicals.rsi_14}) is in the optimal bullish momentum sweet spot")
        elif 40 <= technicals.rsi_14 < 48:
            tech_pts += 6.5
        elif technicals.rsi_14 > 70:
            tech_pts += 4.0
            risks.append(f"RSI-14 ({technicals.rsi_14}) indicates short-term overbought zone")
        elif technicals.rsi_14 < 30:
            tech_pts += 3.0
            risks.append(f"RSI-14 ({technicals.rsi_14}) indicates oversold territory")
        else:
            tech_pts += 5.0
    else:
        tech_pts += 5.0

    # Trend & Moving Averages (0-10 pts)
    if "Bullish" in technicals.trend_signal:
        tech_pts += 10.0
        positives.append(f"Price trending above key moving averages ({technicals.trend_signal})")
    elif "Bearish" in technicals.trend_signal:
        tech_pts += 2.0
        risks.append(f"Technical trend is {technicals.trend_signal} below moving averages")
    else:
        tech_pts += 6.0

    # MACD Crossover (0-10 pts)
    if technicals.macd_crossover == "Bullish Crossover":
        tech_pts += 10.0
        positives.append("MACD completed bullish crossover above signal line")
    elif technicals.macd_crossover == "Bearish Crossover":
        tech_pts += 2.0
        risks.append("MACD is under bearish crossover pressure")
    else:
        tech_pts += 6.0

    # 3. Recent Performance & Volume Confirmation (Max 15 pts)
    perf_pts = 0.0
    # 52W range position (0-8 pts)
    if fundamentals.cmp and fundamentals.fifty_two_week_high and fundamentals.fifty_two_week_low:
        span = fundamentals.fifty_two_week_high - fundamentals.fifty_two_week_low
        if span > 0:
            pos_ratio = (fundamentals.cmp - fundamentals.fifty_two_week_low) / span
            if pos_ratio >= 0.7:
                perf_pts += 8.0
                positives.append("Trading in upper quartile of 52-week range")
            elif pos_ratio >= 0.4:
                perf_pts += 5.0
            else:
                perf_pts += 2.0
                risks.append("Trading near 52-week lows")
        else:
            perf_pts += 4.0
    else:
        perf_pts += 4.0

    # Volume Confirmation (0-7 pts)
    if fundamentals.volume and fundamentals.avg_volume and fundamentals.avg_volume > 0:
        vol_ratio = fundamentals.volume / fundamentals.avg_volume
        if vol_ratio >= 1.2:
            perf_pts += 7.0
            positives.append("Active trading with above-average trading volume")
        elif vol_ratio >= 0.8:
            perf_pts += 5.0
        else:
            perf_pts += 3.0
    else:
        perf_pts += 4.5

    # 4. News Sentiment (Max 10 pts)
    sent_pts = 0.0
    if sentiment.score > 0.3:
        sent_pts = 10.0
        positives.append("Strongly positive news sentiment and market coverage")
    elif sentiment.score > 0.05:
        sent_pts = 7.5
        positives.append("Mildly positive market news sentiment")
    elif sentiment.score >= -0.15:
        sent_pts = 5.0
    elif sentiment.score >= -0.35:
        sent_pts = 2.5
        risks.append("Negative headlines causing market sentiment headwinds")
    else:
        sent_pts = 0.0
        risks.append("Prevalent negative news coverage and sentiment pressure")

    # 5. Valuation (Max 10 pts)
    val_pts = 0.0
    if fundamentals.pe_ratio is not None and fundamentals.pe_ratio > 0:
        if fundamentals.pe_ratio < 20:
            val_pts += 7.0
            positives.append(f"Attractive valuation with P/E ratio of {fundamentals.pe_ratio:.1f}x")
        elif fundamentals.pe_ratio < 35:
            val_pts += 5.0
        else:
            val_pts += 2.0
            risks.append(f"Elevated P/E valuation multiple ({fundamentals.pe_ratio:.1f}x)")
    else:
        val_pts += 4.0

    if fundamentals.dividend_yield is not None:
        if fundamentals.dividend_yield >= 2.0:
            val_pts += 3.0
            positives.append(f"Attractive dividend yield of {fundamentals.dividend_yield}%")
        elif fundamentals.dividend_yield >= 0.5:
            val_pts += 2.0
        else:
            val_pts += 1.0
    else:
        val_pts += 1.5

    # Cap components to their max allowed limits
    fund_pts = round(min(35.0, max(0.0, fund_pts)), 1)
    tech_pts = round(min(30.0, max(0.0, tech_pts)), 1)
    perf_pts = round(min(15.0, max(0.0, perf_pts)), 1)
    sent_pts = round(min(10.0, max(0.0, sent_pts)), 1)
    val_pts = round(min(10.0, max(0.0, val_pts)), 1)

    total = round(fund_pts + tech_pts + perf_pts + sent_pts + val_pts, 1)

    if total >= 70:
        cat = "Stronger Evidence (High Conviction Setup)"
        conclusion = "Robust aggregate performance across fundamentals, technical momentum, and sentiment."
    elif total >= 45:
        cat = "Mixed / Moderate Evidence (Selective Setup)"
        conclusion = "Balanced mix of strengths and risks; suitable for staged accumulation or range strategies."
    else:
        cat = "Weaker Evidence (Caution / Underperforming)"
        conclusion = "Current indicators point to fundamental or technical headwind; caution advised."

    return CompanyScoreBreakdown(
        fundamental_score=fund_pts,
        technical_score=tech_pts,
        performance_score=perf_pts,
        sentiment_score=sent_pts,
        valuation_score=val_pts,
        total_score=total,
        rating_category=cat,
        key_positives=positives[:4],
        key_risks=risks[:4],
        analytical_conclusion=conclusion
    )
