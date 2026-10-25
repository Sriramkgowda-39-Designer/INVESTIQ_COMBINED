# 📈 InvestIQ AI Market Assistant (Context-Aware & Data-Driven)

The official AI Co-Pilot backend for the **InvestIQ Stock Market Platform**. Built using **Python + FastAPI + Google Gemini API + Real-time Indian Financial Data Engine (NSE/BSE & Global)**.

---

## 🎯 Core Capabilities & Upgrades

### 1. The 9 Core Financial Metrics
For any company, the assistant studies and displays:
1. **CMP (₹)**: Real-time/latest price with exchange delay status and Asia/Kolkata timestamp.
2. **P/E**: Trailing twelve months (TTM) and Forward P/E multiples.
3. **Mar Cap (₹ Cr)**: Market capitalization in ₹ Crores.
4. **Div Yld %**: Annualized dividend yield percentage and dividend per share.
5. **NP Qtr (₹ Cr)**: Quarterly Net Profit in ₹ Crores.
6. **Qtr Profit Var %**: Quarterly profit variation (YoY/QoQ).
7. **Sales Qtr (₹ Cr)**: Quarterly revenue/sales in ₹ Crores.
8. **Qtr Sales Var %**: Quarterly sales variation (YoY/QoQ).
9. **ROCE %**: Return on Capital Employed (Annualized EBIT / Capital Employed).

### 2. Transparent InvestIQ Company Score (0 – 100)
A deterministic backend scoring engine based on 5 pillars:
- **Fundamentals & Quality (35 pts)**: ROE, ROCE, Debt-to-Equity, Net Margin, Profit Growth.
- **Technical Trend & Momentum (30 pts)**: RSI-14 momentum zone, Moving Averages (EMA 9/21, SMA 20/50), MACD Crossovers.
- **Volume & Performance (15 pts)**: Position in 52-week trading range, trading volume vs average volume.
- **News Sentiment (10 pts)**: Real-time financial news sentiment score (-1.0 to +1.0).
- **Valuation (10 pts)**: P/E attractiveness and dividend yield support.
- **Output**: Category (`Stronger Evidence >= 70`, `Mixed 45-69`, `Weaker < 45`), key positives, key risks, and balanced conclusion.

### 3. Multi-Turn Conversation Memory & Pronoun Resolution
- **Session Continuity**: Remembers the active company throughout the conversation.
- **Pronoun Resolution**: Follow-ups like *"What is its P/E?"*, *"What about its dividend?"*, *"Give me its 10-minute candle"*, or *"Compare it with TCS"* resolve "it" or "its" to the active company.
- **Company Switching**: When a new company is named (e.g. *"Now check Infosys"*), the active context shifts cleanly.
- **Conversation Reset**: Dedicated endpoint (`DELETE /api/chat/history/{session_id}`) wipes history and active company context.

### 4. Real-Time 10-Minute Candle Aggregation
- Combines consecutive aligned 5-minute candles:
  - `Open = Candle 1 Open`
  - `High = max(Candle 1 High, Candle 2 High)`
  - `Low = min(Candle 1 Low, Candle 2 Low)`
  - `Close = Candle 2 Close`
  - `Volume = Candle 1 Volume + Candle 2 Volume`
  - Formatted with Asia/Kolkata timestamps and completion status.

### 5. Crisp, Specific Replies (No Filler)
- If asked for a specific metric (e.g. *"What is its P/E?"*), responds directly in 1-3 lines.
- If asked for a full study, renders the clean 9-metric table, company score, and positives/risks.
- **Zero Hallucination / Never Generic Greeting on Failures**: Numerical data is fetched first and passed into Gemini. If the key is not set or network fails, verified real-time financial figures are served directly.

---

## 📁 Project Architecture

```
s:\AiBOT\
├── .env.example              # Environment variables template
├── .env                      # Local configuration file (place GEMINI_API_KEY here)
├── .gitignore                # Excludes secrets, caches, logs
├── requirements.txt          # Python dependencies
├── config.py                 # Pydantic Settings & environment loader
├── main.py                   # FastAPI server entrypoint (CORS, routers, test UI)
├── README.md                 # Complete documentation & frontend integration guide
├── models/
│   ├── __init__.py
│   └── schemas.py            # Pydantic schemas (FundamentalData, CompanyScoreBreakdown, etc.)
├── services/
│   ├── __init__.py
│   ├── session_manager.py    # Persistent session memory, active stock tracking & pronoun resolution
│   ├── ticker_resolver.py    # Maps names ("Reliance", "TCS") to exchange tickers (.NS)
│   ├── financial_data.py     # Real-time fundamentals, 10m candle aggregation, ROCE & quarterly metrics
│   ├── scoring_service.py    # Deterministic 0-100 InvestIQ Company Score engine
│   ├── sentiment_analyzer.py # Real-time Google News RSS news scraper & sentiment scorer
│   ├── stock_comparator.py   # Head-to-head comparison engine across all pillars
│   └── gemini_service.py     # Gemini orchestration with grounded factual context injection
├── routers/
│   ├── __init__.py
│   ├── chat.py               # /api/chat & /api/chat/history/{session_id}
│   └── stock.py              # /api/stock/analyze, /compare, /candles
├── static/
│   ├── index.html            # Dark-theme testbench with multi-turn prompt sequence
│   ├── style.css             # Responsive modern styling
│   └── app.js                # Frontend testbench interaction logic with Markdown parsing
└── tests/
    ├── __init__.py
    └── test_backend.py       # 14-scenario automated test suite
```

---

## 🚀 Quick Setup & Running

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Add your Gemini API key in .env (free at https://aistudio.google.com/app/apikey)
# GEMINI_API_KEY=AIzaSy...

# 3. Start the server
python main.py
```
- Interactive Web Testbench: `http://localhost:8000/`
- Interactive Swagger API Documentation: `http://localhost:8000/docs`

---

## 🧪 Automated Test Verification (14/14 Scenarios Passed)

Run tests anytime:
```bash
pytest -v tests/test_backend.py
```
- **Scenario 1**: User asks *"CMP of Reliance?"* -> receives verified price.
- **Scenario 2**: Follow-up *"Give me its P/E"* -> resolves Reliance, returns P/E (not welcome message).
- **Scenario 3**: User asks *"What about its dividend?"* -> returns dividend yield and rate.
- **Scenario 4**: User asks *"Give me its 10-minute candle"* -> returns aggregated OHLCV candle.
- **Scenario 5**: User asks *"Compare it with TCS"* -> compares active company with TCS.
- **Scenario 6**: User switches to Infosys, and subsequent pronouns refer to Infosys.
- **Scenario 7**: Conversation Reset clears prior context and active stock.
- **Scenario 8**: Standalone stock queries produce direct verified analysis, never generic greeting.
- **Scenario 9**: In-memory caching prevents redundant provider calls and rate limits.
- **Scenario 10**: Data freshness and Asia/Kolkata timezone status clearly identified.
- **Scenario 11**: Missing fundamentals are explicitly labeled "Unavailable", not fabricated.
- **Scenario 12**: Company score calculations are reproducible and transparent.
- **Scenario 13**: Invalid tickers handled gracefully without 500 error.
- **Scenario 14**: Existing endpoints (`/api/stock/analyze`, `/compare`, `/candles`) continue working.
