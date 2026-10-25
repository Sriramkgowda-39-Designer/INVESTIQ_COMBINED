# 🇮🇳 FinClash India - Educational Indian Stock Market Comparison & Intelligence Platform

**FinClash India** is an interactive, creative fintech web application built to help users deeply understand how the Indian stock market (NSE / BSE) works. It enables side-by-side comparison of any two Indian companies across **Fundamental**, **Technical**, and **Sentimental** dimensions, complete with **Live AI Quality Ratings**, **Vulnerability & Red Flag Detection**, and **Interactive Hover Explanations** for every financial term.

---

## 🌟 Key Features

### 1. ⚔️ Side-by-Side Indian Stock Duel
- **Two Named Search Bars**: Search bars clearly labeled **"First"** and **"Second"** allowing you to search any Indian listed company by NSE ticker, name, or industry sector.
- **Default Rivalry**: Launches with the classic Indian IT rivalry: **TCS vs Infosys**.
- **Quick One-Click Rivalry Presets**:
  - ⚡ **TCS vs Infosys** (IT Giants)
  - ⚡ **HDFC Bank vs ICICI Bank** (Private Banking Titans)
  - ⚡ **Reliance Industries vs Tata Motors** (Conglomerate & EV Leaders)
  - ⚡ **Tata Steel vs JSW Steel** (Metals & Infrastructure)
  - ⚡ **Zomato vs ITC** (New Age Tech vs Classic FMCG Moat)

### 2. 🏅 Dynamic AI Quality Rating Scorecard
- Computes multi-factor rating grades (**A+**, **A**, **B+**, **B**, **C**, **D**) that update based on latest metrics:
  - **Fundamental Health Score (45% Weight)**: Valuation multiple, ROE, ROCE, debt leverage, profit compounding, promoter pledge.
  - **Technical Momentum Score (30% Weight)**: Moving averages (50 & 200 DMA), 14-day RSI, MACD signal, 52-week positioning.
  - **Market Sentiment Score (25% Weight)**: Analyst consensus breakdown (Buy/Hold/Sell), news sentiment index, institutional flow.
- Visual composite cards and dual progress meters for each company.

### 3. 🚨 Vulnerabilities & Red Flag Intelligence
- Analyzes and surfaces specific vulnerabilities of each searched company:
  - **Promoter Pledging**: Warning on shares pledged as loan collateral.
  - **Valuation Stretch**: Warnings when P/E significantly exceeds sector median.
  - **Solvency / High Debt**: High Debt-to-Equity flags.
  - **Technical Breakdowns**: Trading below 200-DMA or overbought RSI (>70).
  - **Geopolitical & Macro Dependencies**: JLR dependencies, raw material cost sensitivity, regulatory scrutiny.
  - Every vulnerability is color-coded by severity (**Critical**, **Moderate**, **Watchlist**) with financial impact analysis.

### 4. 🎓 Interactive Financial Term Hover Tooltips (ELI5)
- Hovering over **ANY** term (e.g. `P/E`, `CMP`, `ROE`, `ROCE`, `Market Cap`, `EPS`, `P/B`, `Dividend Yield`, `52W High`, `52W Low`, `Beta`, `RSI`, `50-DMA`, `200-DMA`, `MACD`, `Debt-to-Equity`, `Promoter Holding`, `FII / DII`, `Free Cash Flow`, etc.) reveals an interactive learning card:
  - 💡 **ELI5 (In Simple Words)**: Plain English explanation without financial jargon.
  - 📐 **Formula**: Mathematical intuition.
  - 🎯 **Why it Matters**: How professional investors on Dalal Street evaluate it.
  - 🟢 **Healthy Benchmark** vs 🔴 **Danger Red Flag**.
  - 📝 **Real-World Example**: Realistic calculation with rupee numbers.

### 5. 🧩 100% Modular & Extensible Architecture
- Designed with a clean plugin/module architecture so you can **easily add or remove features**:
  - Central configuration in `src/config/features.js`:
    ```javascript
    export const defaultFeatureFlags = {
      showQuickDuelSummary: true,
      showRatingScorecard: true,
      showVulnerabilities: true,
      showInteractiveChart: true,
      showFundamentalAnalysis: true,
      showTechnicalAnalysis: true,
      showSentimentAnalysis: true,
      showScenarioSimulator: true,
      showGlossaryHub: true,
      showNewsFeed: true,
    };
    ```
  - **Interactive In-App Feature Customizer**: Click the **"Modular Features"** button in the header to toggle ANY module on or off in real time! Settings persist across browser refreshes via `localStorage`.

### 6. 🧪 Interactive "What-If" Scenario Simulator
- Test how real-world Indian macro shocks impact both companies:
  - 🏦 **RBI Hikes Repo Rate (+50 bps)**: Tests who suffers from debt interest vs who benefits (banks).
  - 💵 **USD/INR Depreciates by 3.5%**: Tests export beneficiaries (IT/Pharma) vs import-heavy industries.
  - 🛢️ **Brent Crude Jumps to $95 / bbl**: Tests margin squeeze on auto/FMCG vs refining gainers.

### 7. 📈 Interactive 12-Month Performance Chart
- Built with Recharts. Toggle between:
  - **% Return (Normalized)**: Fair growth comparison starting from 0%.
  - **₹ Absolute Share Price**: Real historical rupee trajectory.

---

## 🚀 How to Run the Application

The application is located at:
`C:\Users\vishwas gowda\.gemini\antigravity\scratch\indian-stock-clash`

### Option 1: One-Click Production Server (Running Right Now!)
The integrated production server is already running on **port 5001**:
```powershell
cd "C:\Users\vishwas gowda\.gemini\antigravity\scratch\indian-stock-clash"
npm start
```
Open your browser and navigate to:
👉 **`http://localhost:5001`**

### Option 2: Development Mode (with Hot Module Replacement)
To run Vite dev server with instant HMR:
```powershell
cd "C:\Users\vishwas gowda\.gemini\antigravity\scratch\indian-stock-clash"
npm run dev
```
Navigate to:
👉 **`http://localhost:3000`** (Proxies backend API calls to port 5001).

---

## 📂 Project Structure
```
indian-stock-clash/
├── server/
│   ├── index.js                     # Express API & static server
│   ├── data/
│   │   └── indianStocks.js          # Trusted Indian stock database (NSE/BSE)
│   └── services/
│       └── ratingEngine.js          # Multi-factor Rating algorithm (A+ to D)
├── src/
│   ├── config/
│   │   └── features.js              # Modular feature registry & flags
│   ├── data/
│   │   └── financialGlossary.js     # 30+ financial terms with ELI5 definitions
│   ├── components/
│   │   ├── common/
│   │   │   └── GlossaryTooltip.jsx  # Interactive hover cards for all terms
│   │   ├── layout/
│   │   │   ├── Header.jsx           # First & Second search bars + swap
│   │   │   └── FeatureCustomizerDrawer.jsx # Dynamic feature toggle panel
│   │   └── modules/
│   │       ├── HeroClashBanner.jsx        # Side-by-side contender cards
│   │       ├── RatingScorecardModule.jsx  # Dynamic rating breakdown
│   │       ├── VulnerabilitiesModule.jsx  # Risk & red flags intelligence
│   │       ├── QuickDuelSummaryModule.jsx # Head-to-head winner matrix
│   │       ├── FundamentalModule.jsx      # Valuation, ROE, ROCE, Margins
│   │       ├── TechnicalModule.jsx        # CMP, 52W range, 50/200 DMA, RSI
│   │       ├── SentimentModule.jsx        # Analyst targets & news sentiment
│   │       ├── InteractiveChartModule.jsx # Recharts 12-month area chart
│   │       ├── ScenarioSimulatorModule.jsx# What-If macroeconomic simulator
│   │       └── GlossaryHubModule.jsx      # Searchable financial encyclopedia
│   ├── App.jsx                      # Main app shell & tabs
│   ├── main.jsx                     # React root
│   └── index.css                    # Tailwind CSS v4 styling & dark theme
└── package.json
```
