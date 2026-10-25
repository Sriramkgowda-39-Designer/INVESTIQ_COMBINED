// Comprehensive Financial Glossary for Indian Stock Market Investors
// Formatted with plain-English ELI5 explanations, practical benchmarks, and formulas.

export const financialGlossary = {
  cmp: {
    term: "CMP (Current Market Price)",
    category: "Technical & Pricing",
    eli5: "The exact price at which a stock was last bought or sold on the National Stock Exchange (NSE) or Bombay Stock Exchange (BSE) during market hours.",
    formula: "Last traded price recorded by the exchange matching buyers and sellers.",
    whyItMatters: "CMP tells you what you need to pay right now to own 1 share of the company.",
    benchmarks: {
      green: "Reasonable entry price when backed by solid business fundamentals.",
      red: "CMP inflated far beyond the company's real underlying asset or earnings value."
    },
    example: "If TCS is quoting at ₹3,450.50 on the NSE ticker, that ₹3,450.50 is its CMP."
  },

  peRatio: {
    term: "P/E Ratio (Price-to-Earnings)",
    category: "Valuation",
    eli5: "How many rupees investors are willing to pay for every ₹1 of annual profit earned by the company.",
    formula: "Current Market Price (CMP) ÷ Earnings Per Share (EPS)",
    whyItMatters: "It is the primary measuring tape of whether a stock is cheap or expensive compared to its peers and history.",
    benchmarks: {
      green: "P/E between 15x - 28x is standard for stable Indian blue-chips.",
      red: "P/E > 60x without fast profit growth indicates overvaluation or bubble risk."
    },
    example: "If a company earns ₹50 EPS and trades at ₹1,000 CMP, its P/E is 20x. You pay ₹20 for ₹1 of annual earnings."
  },

  industryPe: {
    term: "Industry P/E",
    category: "Valuation",
    eli5: "The average Price-to-Earnings ratio of all companies operating within the same sector (e.g. IT, Banking, Auto).",
    formula: "Average P/E of all listed peer companies in that industry.",
    whyItMatters: "Comparing a stock's P/E to its Industry P/E reveals if it enjoys a quality premium or trades at a bargain discount.",
    benchmarks: {
      green: "Trading below or in-line with Industry P/E with superior margins.",
      red: "Trading at 3x the Industry P/E without higher profit compounding."
    },
    example: "If Indian IT sector average P/E is 27x and Infosys trades at 25x, Infosys is trading at a discount to the sector."
  },

  pbRatio: {
    term: "P/B Ratio (Price-to-Book)",
    category: "Valuation",
    eli5: "Compares the stock price against the net tangible liquidation value of the company's balance sheet (Assets minus Liabilities).",
    formula: "Current Market Price (CMP) ÷ Book Value Per Share (BVPS)",
    whyItMatters: "Essential for valuing banks, NBFCs, and capital-heavy industries like steel and power.",
    benchmarks: {
      green: "For Indian banks: 1.5x - 2.8x is healthy. Manufacturing < 3x.",
      red: "Excessive P/B (>8x) in low-margin manufacturing suggests speculative pricing."
    },
    example: "A P/B of 2.0x means you pay ₹2 in the market for ₹1 of net accounting assets."
  },

  roe: {
    term: "ROE (Return on Equity)",
    category: "Profitability",
    eli5: "Measures how efficiently the management turns shareholders' invested capital into net profit.",
    formula: "(Net Annual Profit ÷ Total Shareholders' Equity) × 100",
    whyItMatters: "High ROE proves management can generate great profits without needing to constantly dilute or beg for new capital.",
    benchmarks: {
      green: "ROE > 18% is great in India; > 30% is exceptional (e.g. TCS, Tata Motors).",
      red: "ROE < 10% means company earns less than the cost of capital or a safe fixed deposit."
    },
    example: "If a company has ₹1,000 Cr net worth and makes ₹250 Cr net profit, ROE is 25%."
  },

  roce: {
    term: "ROCE (Return on Capital Employed)",
    category: "Profitability",
    eli5: "The true test of capital efficiency: how much profit the company generates from ALL money deployed (Equity + Long-term Debt).",
    formula: "(Operating Profit / EBIT ÷ Total Capital Employed) × 100",
    whyItMatters: "Unlike ROE (which can be artificially boosted by taking high loans), ROCE exposes whether debt is actually generating productive profits.",
    benchmarks: {
      green: "ROCE > 20% indicates a strong economic moat (pricing power).",
      red: "ROCE < 12% means returns barely beat corporate borrowing interest rates."
    },
    example: "TCS boasts a ROCE of 61%, meaning every ₹100 of capital employed yields ₹61 in annual operating profit."
  },

  roi: {
    term: "ROI (Return on Investment)",
    category: "Profitability",
    eli5: "The percentage gain or loss generated on an investment relative to the amount of money initially put in.",
    formula: "[(Final Value - Initial Investment) ÷ Initial Investment] × 100",
    whyItMatters: "Helps you evaluate whether putting money in Stock A yielded better returns than Stock B or the Nifty index.",
    benchmarks: {
      green: "Consistent 14-18% CAGR over 5+ years beats fixed deposits and mutual fund averages.",
      red: "Negative ROI or lagging inflation (< 6%)."
    },
    example: "Buying a share at ₹1,000 and selling at ₹1,300 yields a 30% ROI."
  },

  debtToEquity: {
    term: "Debt-to-Equity Ratio (D/E)",
    category: "Financial Health & Solvency",
    eli5: "Shows how heavily the company relies on borrowed money (debt) compared to shareholders' own money.",
    formula: "Total Borrowings ÷ Total Shareholders' Equity",
    whyItMatters: "High debt leads to massive interest payment burdens during recessions or high interest rate cycles.",
    benchmarks: {
      green: "D/E < 0.5x is conservative and very safe (TCS is 0.08x).",
      red: "D/E > 1.5x in non-banking companies poses severe bankruptcy or default danger."
    },
    example: "A D/E of 0.1x means the company has only ₹10 of debt for every ₹100 of net worth."
  },

  marketCap: {
    term: "Market Capitalization (M-Cap)",
    category: "Size & Classification",
    eli5: "The total rupee value of all the company's shares combined.",
    formula: "Current Market Price (CMP) × Total Number of Issued Shares",
    whyItMatters: "Classifies Indian stocks into Large Cap (Top 100 stocks), Mid Cap (101-250), and Small Cap (251+).",
    benchmarks: {
      green: "Large caps (> ₹20,000 Cr) offer stability and institutional liquidity.",
      red: "Micro caps (< ₹500 Cr) carry high illiquidity and pump-and-dump risks."
    },
    example: "Reliance Industries has a Market Cap of ₹18+ lakh crore, making it India's most valuable enterprise."
  },

  eps: {
    term: "EPS (Earnings Per Share)",
    category: "Profitability",
    eli5: "The portion of a company's total annual net profit allocated to each individual outstanding share.",
    formula: "Net Profit After Tax ÷ Total Number of Shares",
    whyItMatters: "Consistently growing EPS is the single biggest engine behind long-term share price appreciation.",
    benchmarks: {
      green: "Double-digit EPS growth (> 12% YoY) sustained over 3 to 5 years.",
      red: "Declining EPS or erratic losses."
    },
    example: "If TCS makes ₹46,000 Cr profit with 360 Cr shares, each share earned ~₹128 in profit."
  },

  dividendYield: {
    term: "Dividend Yield",
    category: "Shareholder Returns",
    eli5: "The annual cash payout a company distributes directly into your bank account as a percentage of its current share price.",
    formula: "(Annual Dividend Per Share ÷ Current Market Price) × 100",
    whyItMatters: "Provides steady passive income even when the stock market is trading sideways or falling.",
    benchmarks: {
      green: "2.0% - 4.5% is a healthy dividend yield for cash-rich Indian companies (e.g. ITC, Coal India).",
      red: "0% in mature companies with no growth capex, or unsustainably high > 10% yield signaling capital distress."
    },
    example: "If ITC pays ₹14.50 dividend per share and CMP is ₹462, the Dividend Yield is ~3.15%."
  },

  high52w: {
    term: "52-Week High",
    category: "Technical & Pricing",
    eli5: "The highest price at which a stock has traded over the preceding 52 weeks (1 full year).",
    formula: "Highest trade tick price recorded on exchange in last 365 days.",
    whyItMatters: "Acts as psychological resistance. Stocks breaking above their 52W high often trigger strong momentum breakouts.",
    benchmarks: {
      green: "Consolidating near 52W high with heavy institutional volume.",
      red: "Rejection from 52W high on high volume forming a double-top reversal."
    },
    example: "If TCS touched ₹4,585 in the past 12 months, that is its 52-Week High ceiling."
  },

  low52w: {
    term: "52-Week Low",
    category: "Technical & Pricing",
    eli5: "The lowest price at which a stock traded in the previous 52 weeks (1 year).",
    formula: "Lowest trade tick price recorded on exchange in last 365 days.",
    whyItMatters: "Acts as a psychological floor/support. Stocks trading near 52W low are either deeply undervalued or suffering business decay.",
    benchmarks: {
      green: "Solid reversal pattern forming at 52W low with improving quarterly earnings.",
      red: "Freefalling stock repeatedly breaking new 52W lows (falling knife)."
    },
    example: "Infosys bottomed at ₹1,358 during market corrections before rebounding."
  },

  beta: {
    term: "Beta (Volatility Index)",
    category: "Risk & Technical",
    eli5: "Measures how violently a stock swings compared to the benchmark Nifty 50 index.",
    formula: "Covariance of Stock with Nifty ÷ Variance of Nifty",
    whyItMatters: "Tells you whether the stock is calm and defensive or a rollercoaster ride.",
    benchmarks: {
      green: "Beta < 1.0 (e.g. ITC 0.62) means defensive and stable during market crashes.",
      red: "Beta > 1.4 (e.g. Adani Ent 1.85) means stock swings twice as wildly as the market."
    },
    example: "If Nifty falls 1% and a stock with Beta 1.5 falls 1.5%, that extra volatility is its Beta."
  },

  rsi: {
    term: "RSI (Relative Strength Index)",
    category: "Technical Momentum",
    eli5: "A momentum oscillator scaled 0 to 100 that measures the speed and magnitude of recent price changes.",
    formula: "100 - [100 ÷ (1 + Average Gain ÷ Average Loss)] calculated over 14 days.",
    whyItMatters: "Identifies whether buyers have pushed the price too high (Overbought) or sellers have panicked too hard (Oversold).",
    benchmarks: {
      green: "RSI 45 - 65 represents healthy trending momentum.",
      red: "RSI > 75 = Overbought (pullback risk); RSI < 30 = Oversold (potential bounce)."
    },
    example: "An RSI of 78 signals the stock surged too fast and may experience a short-term cooling off."
  },

  dma50: {
    term: "50-DMA (50-Day Moving Average)",
    category: "Technical Trend",
    eli5: "The average closing price of the stock over the past 50 trading sessions (~2.5 months).",
    formula: "Sum of last 50 closing prices ÷ 50",
    whyItMatters: "Serves as the key short-to-medium term trendline support for institutional buyers.",
    benchmarks: {
      green: "CMP trading comfortably above 50-DMA indicates active bullish trend.",
      red: "Slicing below 50-DMA indicates short-term weakness and selling pressure."
    },
    example: "When CMP stays above its 50-DMA, swing traders view it as a buy on dips candidate."
  },

  dma200: {
    term: "200-DMA (200-Day Moving Average)",
    category: "Technical Trend",
    eli5: "The holy grail of long-term trend analysis: the average closing price over the last 200 trading days (~10 months).",
    formula: "Sum of last 200 closing prices ÷ 200",
    whyItMatters: "Defines whether a stock is in a structural multi-year bull market or bear market.",
    benchmarks: {
      green: "CMP > 200-DMA confirms a healthy long-term bull market.",
      red: "CMP < 200-DMA signifies structural bear market or prolonged consolidation."
    },
    example: "FIIs and mutual funds typically avoid taking heavy long positions when a stock is below its 200-DMA."
  },

  macdSignal: {
    term: "MACD (Moving Average Convergence Divergence)",
    category: "Technical Momentum",
    eli5: "A trend-following momentum indicator showing the relationship between two moving averages (12-day and 26-day).",
    formula: "12-day EMA minus 26-day EMA; signaled by a 9-day trigger line.",
    whyItMatters: "Spotting a 'Bullish Crossover' (MACD crossing above signal line) flags the beginning of a fresh upward price impulse.",
    benchmarks: {
      green: "Bullish Crossover above zero line confirms strong buyer control.",
      red: "Bearish Crossover below zero line indicates escalating downward momentum."
    },
    example: "When Infosys MACD crosses above its signal line, algorithmic traders increase long bets."
  },

  operatingMargin: {
    term: "Operating Margin (OPM)",
    category: "Profitability & Operations",
    eli5: "The percentage of sales revenue left over after paying all core production and employee expenses, before taxes and interest.",
    formula: "(Operating Profit ÷ Net Sales) × 100",
    whyItMatters: "Directly demonstrates pricing power and operational efficiency against competitors.",
    benchmarks: {
      green: "OPM > 20% in IT/Software or FMCG indicates high pricing power.",
      red: "OPM < 5% leaves negligible room to absorb inflation or raw material surges."
    },
    example: "TCS boasts a 24.6% operating margin, retaining ~₹25 of operating cash from every ₹100 of revenue."
  },

  freeCashFlow: {
    term: "Free Cash Flow (FCF)",
    category: "Cash & Solvency",
    eli5: "The real cash remaining in the bank after the company has paid for all factory repairs, software, and capital expenditures (Capex).",
    formula: "Cash Flow from Operations minus Capital Expenditures (Capex)",
    whyItMatters: "Accounting profits can be manipulated; real Free Cash Flow in the bank account cannot. It pays dividends and debt.",
    benchmarks: {
      green: "Consistently positive and growing FCF covering 80%+ of Net Profit.",
      red: "Chronic negative FCF due to runaway capex or uncollected customer receivables."
    },
    example: "TCS generates ~₹39,500 Cr in Free Cash Flow annually, funding generous dividends and share buybacks."
  },

  promoterHolding: {
    term: "Promoter Holding & Pledging",
    category: "Corporate Governance",
    eli5: "The percentage of company equity held by the founding families or controlling promoters, and how much of it is pledged as loan collateral.",
    formula: "Shares owned by promoters ÷ Total issued shares. Pledged % = Pledged shares ÷ Total promoter shares.",
    whyItMatters: "Promoter skin in the game aligns founders with retail investors. Pledging is a dangerous red flag of debt distress.",
    benchmarks: {
      green: "Promoter holding > 50% with 0% Pledged shares (TCS, Reliance).",
      red: "Promoter pledge > 10% can trigger forced lender liquidation and stock crashes."
    },
    example: "Tata Sons holds 71.8% of TCS with ZERO pledged shares, signifying gold-standard corporate governance."
  },

  fiiHolding: {
    term: "FII / FPI (Foreign Institutional Investors)",
    category: "Institutional Ownership",
    eli5: "Global sovereign wealth funds, foreign pension funds, and hedge funds (e.g. BlackRock, Vanguard, GIC) investing in Indian stocks.",
    formula: "Percentage of total shares held by foreign institutional entities registered with SEBI.",
    whyItMatters: "FIIs bring massive foreign currency inflows, driving re-rating of top Indian blue-chips.",
    benchmarks: {
      green: "Consistent quarterly increase in FII shareholding.",
      red: "Continuous FII dumping due to geopolitical shifts or currency depreciation."
    },
    example: "HDFC Bank has ~48% FII ownership, making it the most liquid proxy for foreign money entering India."
  },

  diiHolding: {
    term: "DII (Domestic Institutional Investors)",
    category: "Institutional Ownership",
    eli5: "Indian mutual funds (SBI MF, HDFC MF), domestic insurance companies (LIC), and pension funds deploying domestic Indian savings.",
    formula: "Percentage of total shares held by domestic Indian institutional funds.",
    whyItMatters: "DIIs act as the shock absorber of the Indian stock market through monthly Systematic Investment Plans (SIPs).",
    benchmarks: {
      green: "Rising DII holding counteracts foreign outflows and stabilizes stock prices.",
      red: "DIIs actively slashing exposure across consecutive quarters."
    },
    example: "Indian retail SIP inflows exceed ₹23,000 Cr monthly, providing relentless buying power to DIIs."
  },

  sentimentScore: {
    term: "Sentiment Score",
    category: "Market Sentiment & News",
    eli5: "An aggregated metric (0 to 100) scoring news headlines, analyst recommendation consensus (Buy/Hold/Sell), and market commentary.",
    formula: "Weighted blend of financial press headline sentiment, institutional research targets, and retail momentum.",
    whyItMatters: "Explains short-term price momentum that fundamentals alone cannot account for.",
    benchmarks: {
      green: "Score > 75 = Highly Bullish market sentiment and strong analyst endorsements.",
      red: "Score < 40 = Bearish overhang, regulatory worries, or downgrade cycle."
    },
    example: "A sentiment score of 84 for HDFC Bank highlights overwhelming Wall Street & Dalal Street 'Buy' recommendations."
  },

  compositeRating: {
    term: "Composite Rating (Overall Rating)",
    category: "Rating & Verdict",
    eli5: "Our comprehensive multi-factor rating combining Fundamental Health (45%), Technical Momentum (30%), and Market Sentiment (25%).",
    formula: "(Fundamental Score × 0.45) + (Technical Score × 0.30) + (Sentiment Score × 0.25)",
    whyItMatters: "Gives beginners and pros an instant, unbiased letter grade (A+, A, B, C, D) summarizing total investment attractiveness.",
    benchmarks: {
      green: "Grade A+ / A = High conviction, superior business with favorable technical trend.",
      red: "Grade C / D = Elevated vulnerabilities, stretched valuation, or deteriorating balance sheet."
    },
    example: "TCS scores an 'A' grade backed by 48% ROE, zero debt, and pristine governance."
  },

  profitGrowth3yr: {
    term: "3-Year Profit Growth (CAGR)",
    category: "Growth",
    eli5: "The compounded annual growth rate at which the company's net bottom-line profit has expanded over the last 3 years.",
    formula: "[(Profit Year 3 ÷ Profit Year 0) ^ (1/3) - 1] × 100",
    whyItMatters: "Smooths out single-year fluke earnings to reveal genuine multi-year business expansion.",
    benchmarks: {
      green: "Profit CAGR > 15% represents strong compounding power.",
      red: "Negative profit growth signals structural headwinds or loss of market share."
    },
    example: "Tata Motors achieved high 3-year profit growth as JLR turned around and domestic EV sales took off."
  },

  salesGrowth3yr: {
    term: "3-Year Sales / Revenue Growth",
    category: "Growth",
    eli5: "The rate at which top-line customer revenues have expanded annually over the last 3 years.",
    formula: "[(Sales Year 3 ÷ Sales Year 0) ^ (1/3) - 1] × 100",
    whyItMatters: "A company cannot grow profits indefinitely without growing sales; top-line growth is the true sign of expanding customer demand.",
    benchmarks: {
      green: "Sales CAGR > 12% in India indicates beating broader GDP growth.",
      red: "Sales CAGR < 4% indicates stagnant market share."
    },
    example: "Zomato achieved >50% sales growth driven by explosive quick commerce adoption."
  }
};
