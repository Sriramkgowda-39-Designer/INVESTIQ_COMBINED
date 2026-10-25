"""
gemini_service.py – Phase 3: Gemini-first, tools-when-needed architecture.

Flow:
  User message
      ↓
  Resolve active company / pronouns
      ↓
  Decide if financial data is needed (lightweight signal check)
      ↓
  If yes → fetch data → pass as [FINANCIAL DATA] context to Gemini
  If no  → send conversation history + user message directly to Gemini
      ↓
  Gemini is the SOLE response generator (no hardcoded templates)
"""
import re
from typing import Dict, List, Optional

from config import settings
from models.schemas import (
    StockAnalysisSummary,
    StockComparisonResponse,
    ChatResponse,
    CandleData,
)
from services.ticker_resolver import (
    extract_tickers_from_text,
    resolve_ticker,
    format_ticker_display,
)
from services.financial_data import (
    get_complete_stock_analysis,
    fetch_stock_candles,
    get_current_kolkata_time,
)
from services.stock_comparator import compare_two_companies
from services.session_manager import session_manager

# ---------------------------------------------------------------------------
# SYSTEM PROMPT – general-purpose assistant that can also do finance
# ---------------------------------------------------------------------------
INVESTIQ_SYSTEM_PROMPT = """You are **InvestIQ AI** – a smart, versatile, and naturally conversational assistant embedded in the InvestIQ stock market platform.

## YOUR CORE IDENTITY
- You think, reason, and respond exactly like a senior analyst combined with ChatGPT's conversational warmth.
- You can answer ANY question: general knowledge, science, technology, coding, economics, finance, market concepts, philosophy, history, or anything the user brings up.
- You are NOT a fixed-command bot. You adapt to the user's question fluidly.

## HOW TO RESPOND
1. **Match depth to question**: One-line questions get crisp answers. Complex questions get thorough, well-structured answers.
2. **Be natural and direct**: Start answering immediately. Never open with a generic welcome banner or capability list unless the user explicitly asks what you can do.
3. **For greetings** ("hi", "hello", "how are you"): Respond warmly and briefly. Invite a follow-up naturally.
4. **For educational/conceptual questions** ("What is RSI?", "Explain P/E", "What is compound interest?"): Explain clearly with a formula or example where helpful. Do not fetch live stock data.
5. **For live financial questions** ("CMP of Reliance", "Analyze TCS", "Compare Infosys and HCL"): Use the [FINANCIAL DATA] block if provided. Never invent numbers.
6. **For follow-up questions** ("Give me its P/E", "What about its dividend?", "Explain that score"): Use the active company context provided.
7. **For comparisons**: Present a clean markdown table with key metrics side-by-side, then declare winners per pillar and give an overall recommendation.
8. **For analysis/score requests**: Show the 9-metric table, the 5-pillar InvestIQ Score breakdown, key strengths, key risks, and a balanced conclusion.
9. **For coding or math questions**: Provide correct, commented code or step-by-step calculations.
10. **Topic switches**: Follow the user's lead naturally. Do not force financial framing on non-financial questions.

## RESPONSE QUALITY RULES
- Use markdown: **bold** for key terms, tables for comparisons, bullet lists for structured info.
- Use ₹ for Indian currency values.
- State "Data unavailable from source" when a metric is missing. Never fabricate numbers.
- Keep responses concise but complete. Avoid padding, filler phrases, or repeating the user's question back to them.
- The InvestIQ Company Score is out of 100. Always show the 5-pillar breakdown (Fundamentals/35, Technicals/30, Performance·Volume/15, Sentiment/10, Valuation/10) when asked for a score or full analysis.
"""

# ---------------------------------------------------------------------------
# Signal detection – used ONLY to decide whether to fetch financial data
# ---------------------------------------------------------------------------
_FINANCIAL_SIGNALS = [
    # company actions
    "analyze", "analysis", "study", "overview", "insights",
    "invest", "buy or sell", "performance", "fundamental",
    # specific metrics
    "cmp", "current price", "market price", "share price", "price of",
    "p/e", "pe ratio", "price to earnings", "valuation multiple",
    "dividend", "div yield", "dividend yield",
    "market cap", "mcap", "market capitalization",
    "roce", "return on capital",
    "roe", "return on equity",
    "quarterly sales", "sales qtr", "quarterly profit", "np qtr", "net profit",
    "profit variance", "revenue",
    "rsi", "macd", "moving average", "support", "resistance",
    "technicals", "technical",
    # candles
    "candle", "candlestick", "5-min", "10-min", "15-min", "chart data",
    # comparison
    "compare", " vs ", "versus", "better than",
    # score
    "score", "rating",
]

_PURE_CONCEPT_SIGNALS = [
    # these indicate educational questions where we should NOT fetch live data
    "what is", "what are", "explain", "define", "how does", "how do",
    "difference between", "why is", "why are",
]

_GREETINGS = {"hi", "hello", "hey", "namaste", "greetings", "howdy", "sup"}


def _needs_financial_data(message: str, active_ticker: Optional[str]) -> tuple[bool, bool, str]:
    """
    Returns (needs_data, is_comparison, candle_interval).

    Decision logic:
    - If message is a pure greeting → no data needed.
    - If message contains a financial metric signal AND a resolvable ticker
      (or active ticker + pronoun reference) → fetch data.
    - If the message is clearly educational (what is X?) with no ticker → no data.
    """
    lowered = message.lower().strip()

    # Pure greeting – no data
    words = set(lowered.split())
    if words & _GREETINGS and len(lowered.split()) <= 4:
        return False, False, ""

    has_financial_signal = any(sig in lowered for sig in _FINANCIAL_SIGNALS)
    is_comparison = any(sig in lowered for sig in ["compare", " vs ", "versus", "better than"])
    
    # Candle interval
    if "5" in lowered and ("min" in lowered or "candle" in lowered):
        candle_interval = "5m"
    elif "15" in lowered and ("min" in lowered or "candle" in lowered):
        candle_interval = "15m"
    else:
        candle_interval = "10m"

    if not has_financial_signal:
        return False, False, ""

    # Has financial signal – check if there's a ticker to work with
    extracted = extract_tickers_from_text(message)
    if extracted:
        return True, is_comparison, candle_interval

    # Pronoun or active-company reference
    if active_ticker and _has_pronoun(message):
        return True, is_comparison, candle_interval

    # Has signals but no ticker – might be educational ("what is P/E?")
    # If it looks like a pure concept question, don't fetch data
    if any(sig in lowered for sig in _PURE_CONCEPT_SIGNALS) and not extracted:
        return False, False, ""

    return False, False, ""


def _has_pronoun(text: str) -> bool:
    patterns = [
        r"\bit\b", r"\bits\b", r"\bthat\b", r"\bthis\b",
        r"\bthe company\b", r"\bthis company\b", r"\bthat company\b",
        r"\bthe stock\b", r"\bthis stock\b", r"\bthat stock\b",
        r"\bprevious\b", r"\bthe former\b", r"\bsame\b",
    ]
    lower = text.lower()
    return any(re.search(p, lower) for p in patterns)


# ---------------------------------------------------------------------------
# Financial data formatters (used to build the [FINANCIAL DATA] context block)
# ---------------------------------------------------------------------------

def _format_analysis_for_gemini(summary: StockAnalysisSummary, interval: str = "10m") -> str:
    """Serialises a StockAnalysisSummary into a structured text block for Gemini."""
    f = summary.fundamentals
    t = summary.technicals
    score = summary.company_score
    sent = summary.sentiment
    symbol = format_ticker_display(summary.ticker)

    # Candle data
    candle_text = ""
    if interval:
        candles = fetch_stock_candles(summary.ticker, interval=interval, period="5d")
        if candles:
            latest = candles[-1]
            agg_note = " (aggregated from two 5m candles)" if interval == "10m" else ""
            candle_text = f"""
Candle ({interval}){agg_note}:
  Timestamp : {latest.timestamp}
  Open      : ₹{latest.open:,.2f}
  High      : ₹{latest.high:,.2f}
  Low       : ₹{latest.low:,.2f}
  Close     : ₹{latest.close:,.2f}
  Volume    : {latest.volume:,} shares
"""

    positives = "\n  ".join(score.key_positives) if score.key_positives else "None highlighted"
    risks = "\n  ".join(score.key_risks) if score.key_risks else "None highlighted"

    return f"""[FINANCIAL DATA — {summary.company_name} ({symbol})]
Source: Yahoo Finance (yfinance) | Data as of: {summary.data_timestamp}

Fundamentals:
  CMP               : ₹{f.cmp:,.2f} ({f.delay_status}) | Updated: {f.price_timestamp}
  P/E (Trailing TTM): {f.pe_ratio or 'Unavailable'}x
  Forward P/E       : {f.forward_pe or 'Unavailable'}x
  Market Cap        : {f.market_cap_formatted or 'Unavailable'} (₹{f.market_cap_cr:,.2f} Cr)
  Dividend Yield    : {f.dividend_yield or '0.0'}%  | Rate: ₹{f.dividend_rate or 0:.2f}/share | Ex-Date: {f.ex_dividend_date or 'N/A'}
  ROE               : {f.roe or 'Unavailable'}%
  ROCE              : {f.roce or 'Unavailable'}%
  Debt/Equity       : {f.debt_to_equity or 'Unavailable'}
  Profit Margin     : {f.profit_margins or 'Unavailable'}%

Quarterly (Latest — {f.quarter_reporting_period or 'N/A'}):
  Net Profit (NP Qtr)    : ₹{f.quarterly_net_profit_cr or 'Unavailable'} Cr | Var%: {f.quarterly_profit_var_pct or 'Unavailable'}%
  Revenue/Sales (Sales Qtr): ₹{f.quarterly_sales_cr or 'Unavailable'} Cr | Var%: {f.quarterly_sales_var_pct or 'Unavailable'}%

52-Week Range: ₹{f.fifty_two_week_low or 'N/A'} – ₹{f.fifty_two_week_high or 'N/A'}

Technicals ({t.timeframe}):
  Trend Signal   : {t.trend_signal}
  RSI (14)       : {t.rsi_14 or 'N/A'} ({t.rsi_condition or 'N/A'})
  MACD Crossover : {t.macd_crossover}
  EMA 9          : ₹{t.ema_9 or 'N/A'}
  EMA 21         : ₹{t.ema_21 or 'N/A'}
  SMA 50         : ₹{t.sma_50 or 'N/A'}

News Sentiment:
  Label : {sent.sentiment_label}
  Score : {sent.score:+.3f}
  Recent Headlines: {'; '.join([h.title for h in sent.headlines[:3]]) if sent.headlines else 'None fetched'}

InvestIQ Company Score: {score.total_score}/100 — {score.rating_category}
  Fundamentals & Quality : {score.fundamental_score}/35
  Technical Trend        : {score.technical_score}/30
  Performance & Volume   : {score.performance_score}/15
  News Sentiment         : {score.sentiment_score}/10
  Valuation              : {score.valuation_score}/10
  Key Strengths          : {positives}
  Key Risks              : {risks}
  Analytical Conclusion  : {score.analytical_conclusion}
{candle_text}"""


def _format_comparison_for_gemini(comp: StockComparisonResponse) -> str:
    """Serialises a StockComparisonResponse into a structured text block for Gemini."""
    ca = comp.company_a
    cb = comp.company_b
    fa = ca.fundamentals
    fb = cb.fundamentals

    return f"""[FINANCIAL DATA — Head-to-Head Comparison]

Company A: {ca.company_name} ({format_ticker_display(ca.ticker)})
Company B: {cb.company_name} ({format_ticker_display(cb.ticker)})

Metric Comparison:
  CMP           : ₹{fa.cmp:,.2f}  vs  ₹{fb.cmp:,.2f}
  P/E           : {fa.pe_ratio or 'N/A'}x  vs  {fb.pe_ratio or 'N/A'}x
  Market Cap    : ₹{fa.market_cap_cr:,.2f} Cr  vs  ₹{fb.market_cap_cr:,.2f} Cr
  Div Yield     : {fa.dividend_yield or 0:.2f}%  vs  {fb.dividend_yield or 0:.2f}%
  NP Qtr (Cr)  : ₹{fa.quarterly_net_profit_cr or 'N/A'}  vs  ₹{fb.quarterly_net_profit_cr or 'N/A'}
  Qtr Profit Var: {fa.quarterly_profit_var_pct or 'N/A'}%  vs  {fb.quarterly_profit_var_pct or 'N/A'}%
  Sales Qtr (Cr): ₹{fa.quarterly_sales_cr or 'N/A'}  vs  ₹{fb.quarterly_sales_cr or 'N/A'}
  ROCE          : {fa.roce or 'N/A'}%  vs  {fb.roce or 'N/A'}%
  ROE           : {fa.roe or 'N/A'}%  vs  {fb.roe or 'N/A'}%
  Debt/Equity   : {fa.debt_to_equity or 'N/A'}  vs  {fb.debt_to_equity or 'N/A'}
  RSI (14)      : {ca.technicals.rsi_14 or 'N/A'} ({ca.technicals.rsi_condition})  vs  {cb.technicals.rsi_14 or 'N/A'} ({cb.technicals.rsi_condition})
  Trend Signal  : {ca.technicals.trend_signal}  vs  {cb.technicals.trend_signal}
  Sentiment     : {ca.sentiment.sentiment_label}  vs  {cb.sentiment.sentiment_label}
  InvestIQ Score: {ca.company_score.total_score}/100  vs  {cb.company_score.total_score}/100

Pillar Winners:
  Fundamentals  : {comp.fundamental_winner}
  Technical     : {comp.technical_winner}
  Sentiment     : {comp.sentiment_winner}
  Overall Score : {comp.score_winner}

Platform Recommendation: {comp.overall_recommendation}"""


# ---------------------------------------------------------------------------
# LLM API calls (Groq primary, Gemini fallback)
# ---------------------------------------------------------------------------

def _call_groq(
    user_message: str,
    financial_context: str,
    history: List[Dict[str, str]],
    active_company: Optional[str],
    active_ticker: Optional[str],
) -> str:
    """
    Sends the conversation to Groq and returns its response text.
    history is a list of {"role": "user"/"assistant", "content": "..."} dicts.
    """
    api_key = settings.GROQ_API_KEY
    if not api_key or api_key == "your_groq_api_key_here":
        return "_Groq API key not configured. Please set GROQ_API_KEY in your .env file._"

    from groq import Groq
    import time

    client = Groq(api_key=api_key)

    messages = [
        {"role": "system", "content": INVESTIQ_SYSTEM_PROMPT}
    ]

    # Convert session history (last 8 turns to keep context manageable)
    for msg in history[-8:]:
        role = "user" if msg["role"] == "user" else "assistant"
        messages.append({"role": role, "content": msg["content"]})

    active_ctx = ""
    if active_company and active_ticker:
        active_ctx = f"\n[Active Company Context: {active_company} ({active_ticker})]"

    if financial_context:
        user_turn_text = f"{active_ctx}\n\nUser: {user_message}\n\n{financial_context}"
    else:
        user_turn_text = f"{active_ctx}\n\nUser: {user_message}" if active_ctx else user_message

    messages.append({"role": "user", "content": user_turn_text})

    max_attempts = 3
    backoff_seconds = [2, 4, 8]

    for attempt in range(max_attempts):
        try:
            completion = client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=messages,
                temperature=0.7,
                max_tokens=2048,
            )
            choice = completion.choices[0]
            if choice and choice.message and choice.message.content:
                return choice.message.content.strip()
            return "I wasn't able to generate a response. Please try again."
        except Exception as e:
            err_str = str(e).lower()
            is_transient = "503" in err_str or "unavailable" in err_str or "429" in err_str or "rate_limit" in err_str or "timeout" in err_str
            if is_transient and attempt < max_attempts - 1:
                time.sleep(backoff_seconds[attempt])
                continue
            return f"I encountered an error while generating a response: {str(e)}"


def _call_gemini(
    user_message: str,
    financial_context: str,
    history: List[Dict[str, str]],
    active_company: Optional[str],
    active_ticker: Optional[str],
) -> str:
    """
    Sends the conversation to Gemini and returns its response text.
    history is a list of {"role": "user"/"assistant", "content": "..."} dicts.
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key or api_key == "your_gemini_api_key_here":
        return "_Gemini API key not configured. Please set GEMINI_API_KEY in your .env file._"

    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)

    # Build the contents list (system + history + current user turn)
    contents = []

    # Convert session history to Gemini content format (last 8 turns to keep context manageable)
    for msg in history[-8:]:
        role = "user" if msg["role"] == "user" else "model"
        contents.append(types.Content(role=role, parts=[types.Part(text=msg["content"])]))

    # Build the current user turn, injecting financial data if available
    active_ctx = ""
    if active_company and active_ticker:
        active_ctx = f"\n[Active Company Context: {active_company} ({active_ticker})]"

    if financial_context:
        user_turn_text = f"{active_ctx}\n\nUser: {user_message}\n\n{financial_context}"
    else:
        user_turn_text = f"{active_ctx}\n\nUser: {user_message}" if active_ctx else user_message

    contents.append(types.Content(role="user", parts=[types.Part(text=user_turn_text)]))

    import time

    max_attempts = 3
    backoff_seconds = [2, 4, 8]

    for attempt in range(max_attempts):
        try:
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=INVESTIQ_SYSTEM_PROMPT,
                    temperature=0.7,
                    max_output_tokens=2048,
                ),
            )
            return response.text.strip() if response.text else "I wasn't able to generate a response. Please try again."
        except Exception as e:
            err_str = str(e).lower()
            # Retry only on transient server-side errors (503 unavailable, 429 quota)
            is_transient = "503" in err_str or "unavailable" in err_str or "429" in err_str or "resource_exhausted" in err_str
            if is_transient and attempt < max_attempts - 1:
                time.sleep(backoff_seconds[attempt])
                continue
            return f"I encountered an error while generating a response: {str(e)}"


def _call_llm(
    user_message: str,
    financial_context: str,
    history: List[Dict[str, str]],
    active_company: Optional[str],
    active_ticker: Optional[str],
) -> str:
    """
    Primary LLM router: prefers Groq if GROQ_API_KEY is present, falls back to Gemini if needed.
    """
    if settings.GROQ_API_KEY and settings.GROQ_API_KEY != "your_groq_api_key_here":
        resp = _call_groq(user_message, financial_context, history, active_company, active_ticker)
        if not resp.startswith("I encountered an error"):
            return resp
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here":
            return _call_gemini(user_message, financial_context, history, active_company, active_ticker)
        return resp
    elif settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here":
        return _call_gemini(user_message, financial_context, history, active_company, active_ticker)
    return "_No LLM API key configured. Please set GROQ_API_KEY in your .env file._"


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

async def process_chat(
    message: str,
    session_id: Optional[str] = None,
    current_stock: Optional[str] = None,
    compare_stock: Optional[str] = None,
    page_context: Optional[str] = None,
) -> ChatResponse:
    """
    Phase 3: Gemini-first pipeline.

    1. Resolve active company / pronouns from session.
    2. Decide if financial data is needed.
    3. If yes → fetch data → pass as structured context to Gemini.
    4. If no  → send history + message directly to Gemini.
    5. Gemini is the sole response generator.
    """
    session = session_manager.get_or_create(session_id)
    now_iso = get_current_kolkata_time()

    # ------------------------------------------------------------------
    # Step 1: Resolve tickers
    # ------------------------------------------------------------------
    extracted_tickers = extract_tickers_from_text(message)

    target_ticker: Optional[str] = None
    target_ticker_b: Optional[str] = None

    if len(extracted_tickers) >= 2:
        target_ticker = extracted_tickers[0]
        target_ticker_b = extracted_tickers[1]
    elif len(extracted_tickers) == 1:
        target_ticker = extracted_tickers[0]
        # If comparing with one entity and we have an active ticker, use it as company A
        lowered = message.lower()
        if any(s in lowered for s in ["compare", " vs ", "versus", "better than"]):
            if session.active_ticker and session.active_ticker != target_ticker:
                target_ticker_b = target_ticker
                target_ticker = session.active_ticker
    else:
        # No ticker in message – use page context or session (pronoun / implicit)
        if current_stock:
            target_ticker = resolve_ticker(current_stock)
        elif session.active_ticker and (
            _has_pronoun(message) or _needs_financial_data(message, session.active_ticker)[0]
        ):
            target_ticker = session.active_ticker

    if compare_stock and not target_ticker_b:
        target_ticker_b = resolve_ticker(compare_stock)

    # ------------------------------------------------------------------
    # Step 2: Decide if financial data is needed
    # ------------------------------------------------------------------
    needs_data, is_comparison, candle_interval = _needs_financial_data(message, session.active_ticker)

    # Override: if we have tickers resolved and there's a financial signal → fetch
    if target_ticker and any(sig in message.lower() for sig in _FINANCIAL_SIGNALS):
        needs_data = True
    if is_comparison and target_ticker and target_ticker_b:
        needs_data = True

    # ------------------------------------------------------------------
    # Step 3: Fetch financial data when needed
    # ------------------------------------------------------------------
    financial_context = ""
    analyzed_stocks: List[StockAnalysisSummary] = []
    comparison_result: Optional[StockComparisonResponse] = None

    if needs_data:
        if is_comparison and target_ticker and target_ticker_b:
            try:
                comparison_result = compare_two_companies(target_ticker, target_ticker_b)
                analyzed_stocks = [comparison_result.company_a, comparison_result.company_b]
                session_manager.set_active_company(
                    session.session_id,
                    target_ticker,
                    comparison_result.company_a.company_name,
                    comparison_result.company_a,
                )
                financial_context = _format_comparison_for_gemini(comparison_result)
            except Exception as e:
                financial_context = f"[DATA ERROR] Could not fetch comparison data: {e}"

        elif target_ticker:
            try:
                # Determine if we need candle data
                include_candle = any(s in message.lower() for s in ["candle", "candlestick", "chart data", "min"])
                stock_summary = get_complete_stock_analysis(target_ticker)
                analyzed_stocks.append(stock_summary)
                session_manager.set_active_company(
                    session.session_id,
                    target_ticker,
                    stock_summary.company_name,
                    stock_summary,
                )
                financial_context = _format_analysis_for_gemini(
                    stock_summary,
                    interval=candle_interval if include_candle else "",
                )
            except Exception as e:
                financial_context = f"[DATA ERROR] Could not fetch data for {target_ticker}: {e}"

    # ------------------------------------------------------------------
    # Step 4: Call LLM (Groq primary, Gemini fallback)
    # ------------------------------------------------------------------
    reply_text = _call_llm(
        user_message=message,
        financial_context=financial_context,
        history=session.history,
        active_company=session.active_company_name,
        active_ticker=session.active_ticker,
    )

    # ------------------------------------------------------------------
    # Step 5: Persist conversation in session
    # ------------------------------------------------------------------
    session_manager.add_message(session.session_id, "user", message)
    session_manager.add_message(session.session_id, "assistant", reply_text)

    return ChatResponse(
        reply=reply_text,
        session_id=session.session_id,
        active_company=session.active_company_name,
        active_ticker=session.active_ticker,
        analyzed_stocks=analyzed_stocks,
        comparison=comparison_result,
        timestamp=now_iso,
    )
