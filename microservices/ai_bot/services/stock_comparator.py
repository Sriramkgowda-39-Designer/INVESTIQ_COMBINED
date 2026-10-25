from typing import Dict, Any
from models.schemas import StockAnalysisSummary, StockComparisonResponse
from services.financial_data import get_complete_stock_analysis

def compare_two_companies(stock_a: str, stock_b: str) -> StockComparisonResponse:
    """
    Performs head-to-head comparison between two companies
    evaluating Fundamental, Technical, Sentimental, and Overall Score analysis.
    """
    analysis_a = get_complete_stock_analysis(stock_a)
    analysis_b = get_complete_stock_analysis(stock_b)

    fa = analysis_a.fundamentals
    fb = analysis_b.fundamentals
    ta = analysis_a.technicals
    tb = analysis_b.technicals
    sa = analysis_a.sentiment
    sb = analysis_b.sentiment
    score_a = analysis_a.company_score
    score_b = analysis_b.company_score

    # --- 1. Fundamental Evaluation ---
    fund_score_a = 0
    fund_score_b = 0

    if fa.pe_ratio and fb.pe_ratio:
        if 0 < fa.pe_ratio < fb.pe_ratio:
            fund_score_a += 1
        elif 0 < fb.pe_ratio < fa.pe_ratio:
            fund_score_b += 1

    if fa.roe and fb.roe:
        if fa.roe > fb.roe:
            fund_score_a += 1
        elif fb.roe > fa.roe:
            fund_score_b += 1

    if fa.roce and fb.roce:
        if fa.roce > fb.roce:
            fund_score_a += 1
        elif fb.roce > fa.roce:
            fund_score_b += 1

    if fa.profit_margins and fb.profit_margins:
        if fa.profit_margins > fb.profit_margins:
            fund_score_a += 1
        elif fb.profit_margins > fa.profit_margins:
            fund_score_b += 1

    if fa.debt_to_equity is not None and fb.debt_to_equity is not None:
        if fa.debt_to_equity < fb.debt_to_equity:
            fund_score_a += 1
        elif fb.debt_to_equity < fa.debt_to_equity:
            fund_score_b += 1

    div_a = fa.dividend_yield or 0.0
    div_b = fb.dividend_yield or 0.0
    if div_a > div_b:
        fund_score_a += 1
    elif div_b > div_a:
        fund_score_b += 1

    if fund_score_a > fund_score_b:
        fund_winner = analysis_a.company_name
    elif fund_score_b > fund_score_a:
        fund_winner = analysis_b.company_name
    else:
        fund_winner = "Tie / Comparable Fundamentals"

    # --- 2. Technical Evaluation ---
    tech_score_a = 0
    tech_score_b = 0

    if "Bullish" in ta.trend_signal:
        tech_score_a += 2
    if "Bullish" in tb.trend_signal:
        tech_score_b += 2

    if ta.macd_crossover == "Bullish Crossover":
        tech_score_a += 1
    if tb.macd_crossover == "Bullish Crossover":
        tech_score_b += 1

    if ta.rsi_14 and 45 <= ta.rsi_14 <= 65:
        tech_score_a += 1
    if tb.rsi_14 and 45 <= tb.rsi_14 <= 65:
        tech_score_b += 1

    if tech_score_a > tech_score_b:
        tech_winner = analysis_a.company_name
    elif tech_score_b > tech_score_a:
        tech_winner = analysis_b.company_name
    else:
        tech_winner = "Tie / Similar Momentum"

    # --- 3. Sentimental Evaluation ---
    if sa.score > sb.score:
        sent_winner = analysis_a.company_name
    elif sb.score > sa.score:
        sent_winner = analysis_b.company_name
    else:
        sent_winner = "Tie / Neutral Sentiment"

    # --- 4. Company Score Winner ---
    if score_a.total_score > score_b.total_score:
        score_winner = f"{analysis_a.company_name} ({score_a.total_score}/100)"
    elif score_b.total_score > score_a.total_score:
        score_winner = f"{analysis_b.company_name} ({score_b.total_score}/100)"
    else:
        score_winner = f"Tie ({score_a.total_score}/100)"

    if score_a.total_score > score_b.total_score + 3:
        overall_rec = f"{analysis_a.company_name} leads with an InvestIQ Score of {score_a.total_score}/100 vs {score_b.total_score}/100 for {analysis_b.company_name}."
    elif score_b.total_score > score_a.total_score + 3:
        overall_rec = f"{analysis_b.company_name} leads with an InvestIQ Score of {score_b.total_score}/100 vs {score_a.total_score}/100 for {analysis_a.company_name}."
    else:
        overall_rec = f"Both {analysis_a.company_name} ({score_a.total_score}/100) and {analysis_b.company_name} ({score_b.total_score}/100) are closely matched."

    metrics_table = {
        "Metric": [
            "CMP (₹)", "P/E", "Mar Cap (₹ Cr)", "Div Yld %", "NP Qtr (₹ Cr)", 
            "Qtr Profit Var %", "Sales Qtr (₹ Cr)", "Qtr Sales Var %", "ROCE %", 
            "ROE %", "RSI (14)", "InvestIQ Score"
        ],
        analysis_a.company_name: [
            fa.cmp, fa.pe_ratio or "N/A", fa.market_cap_cr or "N/A", 
            f"{fa.dividend_yield}%" if fa.dividend_yield else "0.0%",
            fa.quarterly_net_profit_cr or "N/A",
            f"{fa.quarterly_profit_var_pct:+.1f}%" if fa.quarterly_profit_var_pct is not None else "N/A",
            fa.quarterly_sales_cr or "N/A",
            f"{fa.quarterly_sales_var_pct:+.1f}%" if fa.quarterly_sales_var_pct is not None else "N/A",
            f"{fa.roce}%" if fa.roce else "N/A",
            f"{fa.roe}%" if fa.roe else "N/A",
            fa.pe_ratio,
            f"{score_a.total_score}/100"
        ],
        analysis_b.company_name: [
            fb.cmp, fb.pe_ratio or "N/A", fb.market_cap_cr or "N/A", 
            f"{fb.dividend_yield}%" if fb.dividend_yield else "0.0%",
            fb.quarterly_net_profit_cr or "N/A",
            f"{fb.quarterly_profit_var_pct:+.1f}%" if fb.quarterly_profit_var_pct is not None else "N/A",
            fb.quarterly_sales_cr or "N/A",
            f"{fb.quarterly_sales_var_pct:+.1f}%" if fb.quarterly_sales_var_pct is not None else "N/A",
            f"{fb.roce}%" if fb.roce else "N/A",
            f"{fb.roe}%" if fb.roe else "N/A",
            fb.pe_ratio,
            f"{score_b.total_score}/100"
        ]
    }

    return StockComparisonResponse(
        company_a=analysis_a,
        company_b=analysis_b,
        technical_winner=tech_winner,
        fundamental_winner=fund_winner,
        sentiment_winner=sent_winner,
        score_winner=score_winner,
        overall_recommendation=overall_rec,
        metric_comparison=metrics_table
    )
