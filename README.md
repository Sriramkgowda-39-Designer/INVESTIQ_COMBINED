# InvestIQ · Unified Financial Suite & Microservice Platform

This is the combined repository housing all three core features of the InvestIQ application under a clean **Microservice Architecture**.

---

## 📁 Directory Structure

```
InvestIQ_Combined/
├── microservices/
│   ├── market_dashboard/      # Core Feature 1: Real-time NSE/Yahoo Feed, Candlestick Engine & Random Forest ML Predictor (Port 8001)
│   ├── stock_comparison/      # Core Feature 2: Indian Stock Clash & Duel, 10-Dimension Matrix, Rating Scorecards (Port 5001)
│   └── ai_bot/                # Core Feature 3: InvestIQ AI Co-Pilot powered by Groq 120B with multi-turn memory (Port 8002)
├── gateway/
│   ├── gateway.py             # Central FastAPI API Gateway & Reverse Proxy (Port 8000)
│   ├── data/
│   │   └── financial_glossary.json  # Universal glossary for hover tooltips
│   └── static/
│       ├── portal.html        # Unified Master Web Portal UI with all 3 features integrated
│       ├── tooltip.js         # Interactive hover information card engine
│       └── tooltip.css
├── run.py                     # Master Cluster Orchestrator (starts all 4 services concurrently)
├── main.py                    # Root entrypoint (`python main.py` runs the entire suite)
├── start.bat                  # One-click Windows startup script
└── README.md
```

---

## 🚀 How to Run the Entire Application

From this combined folder, run:

```powershell
python main.py
```
*(Or double-click `start.bat`)*

This single command starts:
1. **Microservice 1 (Market Lab & ML)** on `http://localhost:8001`
2. **Microservice 2 (Stock Clash Duel)** on `http://localhost:5001`
3. **Microservice 3 (AI Co-Pilot Chat)** on `http://localhost:8002`
4. **Master API Gateway & Unified UI** on `http://localhost:8000`

Then open: **`http://localhost:8000`** in your browser.

---

## 🌟 Key Features

1. **Three Core Modules in One Seamless View**:
   - **📈 Market Lab & ML**: Live candlestick charts (1D, 1W, 1M, 1Y, 3Y, 5Y), candlestick & line styles, Random Forest price forecasting engine with estimated ranges.
   - **⚔️ Stock Clash Duel**: Head-to-head comparison between any two Indian equities with 10-factor multi-pillar matrix, winner tallies, and composite scores.
   - **🤖 AI Market Assistant**: Full conversational assistant powered by Groq 120B (`openai/gpt-oss-120b`).
2. **Omnipresent Floating AI Co-Pilot**:
   - Accessible via the `💬 Ask InvestIQ AI` button on **any tab**.
   - Context-aware: automatically detects the stock or comparison being viewed.
3. **Universal Interactive Hover Tooltips**:
   - Hovering over ANY metric (CMP, P/E, ROCE, ROE, D/E, RSI, MACD, Dividends, ML Prediction, InvestIQ Score) pops up a rich glassmorphic card with category badges, plain-English ELI5 explanations, formulas, benchmarks (green/red), and examples.
