// Trusted Indian Stock Market Database (NSE / BSE)
// Curated metrics based on latest financial reports, audited statements, and exchange disclosures.

export const indianStocksDatabase = [
  {
    symbol: "TCS",
    yahooSymbol: "TCS.NS",
    name: "Tata Consultancy Services Ltd.",
    sector: "Information Technology",
    marketCapCategory: "Large Cap",
    marketCap: 1245000, // In Crores INR
    cmp: 3450.50,
    previousClose: 3432.00,
    dayChange: 18.50,
    dayChangePercent: 0.54,
    high52w: 4585.90,
    low52w: 3310.00,
    peRatio: 26.8,
    industryPe: 27.5,
    pbRatio: 12.4,
    dividendYield: 1.62,
    roe: 48.2, // %
    roce: 61.5, // %
    debtToEquity: 0.08,
    eps: 128.75,
    salesGrowth3yr: 11.4, // %
    profitGrowth3yr: 10.2, // %
    operatingMargin: 24.6, // %
    freeCashFlow: 39500, // in Cr
    promoterHolding: 71.77, // %
    pledgedPromoter: 0.0, // %
    fiiHolding: 12.46, // %
    diiHolding: 10.55, // %
    publicHolding: 5.22, // %
    beta: 0.72,
    rsi: 46.2,
    dma50: 3580.0,
    dma200: 3820.0,
    macdSignal: "Neutral",
    newsSentimentScore: 78, // 0 to 100
    newsHighlights: [
      "Secured massive $1.2B digital transformation deal in European banking sector.",
      "Accelerating enterprise AI adoption with new Generative AI platform for global clients.",
      "Steady quarterly operating margin expansion defying global tech spending softness."
    ],
    analystRatings: {
      buyPercent: 68,
      holdPercent: 24,
      sellPercent: 8,
      consensus: "Buy",
      targetPrice: 4200.00
    },
    vulnerabilities: [
      {
        title: "Global Discretionary Tech Slowdown",
        severity: "Moderate",
        explanation: "Macro uncertainty in the US and Europe may prolong decision cycles for mega IT contracts.",
        impact: "Could temper revenue growth to single digits over next 2 quarters."
      },
      {
        title: "Trading Below 200-DMA",
        severity: "Moderate",
        explanation: "Stock is currently trading below its 200-day moving average, signaling medium-term consolidation.",
        impact: "May face technical resistance around ₹3,800 levels before resuming strong bull momentum."
      },
      {
        title: "High Valuation Multiple vs Historical Nifty IT",
        severity: "Low",
        explanation: "Price to Book of 12.4x is premium, though supported by exceptionally high ROE (48.2%).",
        impact: "Limited room for multiple expansion without significant earnings surprises."
      }
    ]
  },
  {
    symbol: "INFY",
    yahooSymbol: "INFY.NS",
    name: "Infosys Ltd.",
    sector: "Information Technology",
    marketCapCategory: "Large Cap",
    marketCap: 685000,
    cmp: 1650.25,
    previousClose: 1640.10,
    dayChange: 10.15,
    dayChangePercent: 0.62,
    high52w: 1991.45,
    low52w: 1358.35,
    peRatio: 25.2,
    industryPe: 27.5,
    pbRatio: 7.9,
    dividendYield: 2.30,
    roe: 32.8,
    roce: 42.1,
    debtToEquity: 0.10,
    eps: 65.40,
    salesGrowth3yr: 12.8,
    profitGrowth3yr: 9.6,
    operatingMargin: 21.2,
    freeCashFlow: 23100,
    promoterHolding: 14.71,
    pledgedPromoter: 0.0,
    fiiHolding: 32.18,
    diiHolding: 36.42,
    publicHolding: 16.69,
    beta: 0.88,
    rsi: 48.5,
    dma50: 1720.0,
    dma200: 1690.0,
    macdSignal: "Bullish",
    newsSentimentScore: 74,
    newsHighlights: [
      "Large deal total contract value (TCV) touched $3.4B in latest quarterly review.",
      "Expanding collaboration with cloud hyperscalers on enterprise GenAI tooling.",
      "Active share buyback and dividend policy providing solid downside cushion."
    ],
    analystRatings: {
      buyPercent: 72,
      holdPercent: 20,
      sellPercent: 8,
      consensus: "Buy",
      targetPrice: 1950.00
    },
    vulnerabilities: [
      {
        title: "Subdued Margin Compared to Tier-1 Peers",
        severity: "Moderate",
        explanation: "Operating margin at 21.2% trails TCS (24.6%) due to higher subcontractor and wage inflation costs.",
        impact: "EBIT margin guidance pressure if pricing power softens in legacy renewals."
      },
      {
        title: "Low Promoter Holding (14.7%)",
        severity: "Low",
        explanation: "Institutional ownership is very high (FII + DII = ~68%), which can lead to volatility during FII capital reallocation.",
        impact: "Higher sensitivity to foreign portfolio investor outflow cycles."
      },
      {
        title: "Senior Leadership Transitions",
        severity: "Low",
        explanation: "Executive attrition in strategic service lines requires continuous bench rebuilding.",
        impact: "Potential short-term execution hiccups in specialized verticals."
      }
    ]
  },
  {
    symbol: "RELIANCE",
    yahooSymbol: "RELIANCE.NS",
    name: "Reliance Industries Ltd.",
    sector: "Conglomerate / Energy & Telecom",
    marketCapCategory: "Large Cap",
    marketCap: 1890000,
    cmp: 1285.50,
    previousClose: 1272.00,
    dayChange: 13.50,
    dayChangePercent: 1.06,
    high52w: 1608.80,
    low52w: 1220.00,
    peRatio: 24.5,
    industryPe: 22.0,
    pbRatio: 2.1,
    dividendYield: 0.39,
    roe: 9.8,
    roce: 10.4,
    debtToEquity: 0.42,
    eps: 52.40,
    salesGrowth3yr: 15.6,
    profitGrowth3yr: 11.8,
    operatingMargin: 16.8,
    freeCashFlow: 38200,
    promoterHolding: 50.31,
    pledgedPromoter: 0.0,
    fiiHolding: 21.55,
    diiHolding: 17.80,
    publicHolding: 10.34,
    beta: 1.05,
    rsi: 42.1,
    dma50: 1340.0,
    dma200: 1410.0,
    macdSignal: "Neutral",
    newsSentimentScore: 82,
    newsHighlights: [
      "Jio 5G subscriber additions maintain market leadership across Indian telecom circles.",
      "Reliance Retail expanding quick-commerce and consumer brands footprint nationwide.",
      "New Energy giga-factories in Gujarat progressing towards pilot commissioning."
    ],
    analystRatings: {
      buyPercent: 80,
      holdPercent: 15,
      sellPercent: 5,
      consensus: "Strong Buy",
      targetPrice: 1580.00
    },
    vulnerabilities: [
      {
        title: "Capital Expenditure (Capex) Drag on Free Cash Flow",
        severity: "Moderate",
        explanation: "Massive ongoing investments in 5G, New Energy giga-complexes, and retail logistics consume significant operating cash flow.",
        impact: "Depresses headline return on capital (ROCE ~10.4%) until new assets achieve peak commercial utilization."
      },
      {
        title: "Global Refining & Petrochemical Margin Volatility",
        severity: "Moderate",
        explanation: "Oil-to-Chemicals (O2C) segment remains sensitive to volatile Singapore gross refining margins (GRMs).",
        impact: "Quarterly earnings variability driven by OPEC+ crude dynamics and Chinese petchem dumping."
      },
      {
        title: "Net Debt Overhead",
        severity: "Low",
        explanation: "While leverage is manageable (Debt-to-Equity 0.42x), gross consolidated debt remains over ₹3 lakh crore.",
        impact: "Sensitivity to elevated domestic borrowing costs and telecom spectrum payment schedules."
      }
    ]
  },
  {
    symbol: "TATAMOTORS",
    yahooSymbol: "TATAMOTORS.NS",
    name: "Tata Motors Ltd.",
    sector: "Automobile & EV",
    marketCapCategory: "Large Cap",
    marketCap: 312000,
    cmp: 795.40,
    previousClose: 806.20,
    dayChange: -10.80,
    dayChangePercent: -1.34,
    high52w: 1179.05,
    low52w: 752.10,
    peRatio: 9.8,
    industryPe: 24.0,
    pbRatio: 3.4,
    dividendYield: 0.75,
    roe: 38.6,
    roce: 21.4,
    debtToEquity: 0.65,
    eps: 81.15,
    salesGrowth3yr: 24.2,
    profitGrowth3yr: 185.0,
    operatingMargin: 13.9,
    freeCashFlow: 26800,
    promoterHolding: 41.86,
    pledgedPromoter: 0.0,
    fiiHolding: 18.22,
    diiHolding: 16.48,
    publicHolding: 23.44,
    beta: 1.45,
    rsi: 36.8,
    dma50: 860.0,
    dma200: 955.0,
    macdSignal: "Bearish",
    newsSentimentScore: 68,
    newsHighlights: [
      "Jaguar Land Rover (JLR) reports steady order book backed by Defender and Range Rover.",
      "Demerger plan into two separate listed entities (Commercial Vehicles and Passenger Vehicles/EVs) on track.",
      "Domestic EV market share remains above 65% with new Curvv EV and Nexon EV refreshes."
    ],
    analystRatings: {
      buyPercent: 62,
      holdPercent: 26,
      sellPercent: 12,
      consensus: "Buy",
      targetPrice: 980.00
    },
    vulnerabilities: [
      {
        title: "JLR Dependency for Consolidated Profits",
        severity: "Critical",
        explanation: "Over 70% of consolidated revenues and operating profits originate from Jaguar Land Rover, exposing earnings to UK/US/China auto cycles.",
        impact: "Any slowdown in luxury EV/SUV demand in Europe or China directly hits profitability."
      },
      {
        title: "Domestic Commercial Vehicle (CV) Cyclicality",
        severity: "Moderate",
        explanation: "Indian CV sales follow capital expenditure and freight demand cycles which are currently moderating.",
        impact: "Margin pressure in medium and heavy commercial trucks."
      },
      {
        title: "High Stock Beta & Technical Weakness",
        severity: "Moderate",
        explanation: "Beta of 1.45 signifies high market volatility; stock has corrected >25% from 52-week peak.",
        impact: "Prone to sharper pullbacks during broader Nifty corrections."
      }
    ]
  },
  {
    symbol: "HDFCBANK",
    yahooSymbol: "HDFCBANK.NS",
    name: "HDFC Bank Ltd.",
    sector: "Banking & Financial Services",
    marketCapCategory: "Large Cap",
    marketCap: 1340000,
    cmp: 1765.00,
    previousClose: 1752.40,
    dayChange: 12.60,
    dayChangePercent: 0.72,
    high52w: 1880.00,
    low52w: 1363.55,
    peRatio: 18.5,
    industryPe: 16.2,
    pbRatio: 2.7,
    dividendYield: 1.10,
    roe: 16.8,
    roce: 15.2,
    debtToEquity: 5.80, // Bank leverage standard
    eps: 95.40,
    salesGrowth3yr: 28.5,
    profitGrowth3yr: 23.2,
    operatingMargin: 38.4,
    freeCashFlow: 45000,
    promoterHolding: 0.0, // Institutional widely held bank
    pledgedPromoter: 0.0,
    fiiHolding: 47.80,
    diiHolding: 34.20,
    publicHolding: 18.00,
    beta: 0.95,
    rsi: 54.2,
    dma50: 1730.0,
    dma200: 1640.0,
    macdSignal: "Bullish",
    newsSentimentScore: 84,
    newsHighlights: [
      "Credit-to-Deposit (LDR) ratio consistently improving post mega-merger with HDFC Ltd.",
      "Branch expansion drive reaching tier-2 and tier-3 towns delivering robust retail deposit accretion.",
      "Gross NPA remains pristine at 1.36%, among the best quality books in the Indian banking system."
    ],
    analystRatings: {
      buyPercent: 88,
      holdPercent: 10,
      sellPercent: 2,
      consensus: "Strong Buy",
      targetPrice: 2050.00
    },
    vulnerabilities: [
      {
        title: "Credit-to-Deposit Ratio Normalization",
        severity: "Moderate",
        explanation: "Post-merger loan-to-deposit ratio spiked above 100%, forcing the bank to slow loan growth to match retail deposit accretion.",
        impact: "May restrain net interest income (NII) growth relative to historical 20%+ compounding."
      },
      {
        title: "Net Interest Margin (NIM) Compression",
        severity: "Low",
        explanation: "Higher cost of retail term deposits in a stubborn interest rate environment pressures core margins.",
        impact: "Core NIM expected to stabilize around 3.4 - 3.5% rather than pre-merger 4.0%."
      },
      {
        title: "High FII Ownership Sensitivity",
        severity: "Low",
        explanation: "Foreign institutional investors hold nearly 48% of the equity, making the stock susceptible to foreign outflow waves.",
        impact: "Price lag during periods of global emerging market risk-off sentiment."
      }
    ]
  },
  {
    symbol: "ICICIBANK",
    yahooSymbol: "ICICIBANK.NS",
    name: "ICICI Bank Ltd.",
    sector: "Banking & Financial Services",
    marketCapCategory: "Large Cap",
    marketCap: 890000,
    cmp: 1260.00,
    previousClose: 1251.50,
    dayChange: 8.50,
    dayChangePercent: 0.68,
    high52w: 1342.00,
    low52w: 928.00,
    peRatio: 17.8,
    industryPe: 16.2,
    pbRatio: 2.9,
    dividendYield: 0.79,
    roe: 18.9,
    roce: 16.8,
    debtToEquity: 5.40,
    eps: 70.80,
    salesGrowth3yr: 22.4,
    profitGrowth3yr: 34.8,
    operatingMargin: 42.1,
    freeCashFlow: 38000,
    promoterHolding: 0.0,
    pledgedPromoter: 0.0,
    fiiHolding: 44.50,
    diiHolding: 41.20,
    publicHolding: 14.30,
    beta: 1.02,
    rsi: 58.1,
    dma50: 1245.0,
    dma200: 1180.0,
    macdSignal: "Bullish",
    newsSentimentScore: 89,
    newsHighlights: [
      "Industry-leading Return on Assets (RoA) sustained above 2.3% with exceptional cost discipline.",
      "Digital iMobile Pay platform driving superior retail deposit franchise and cross-selling efficiency.",
      "Consistent low slippages and high provision coverage ratio (>80%) protect balance sheet strength."
    ],
    analystRatings: {
      buyPercent: 92,
      holdPercent: 6,
      sellPercent: 2,
      consensus: "Strong Buy",
      targetPrice: 1480.00
    },
    vulnerabilities: [
      {
        title: "Unsecured Retail Credit Exposure",
        severity: "Moderate",
        explanation: "Rapid growth in personal loans and credit cards prompts regulatory vigilance from RBI regarding unsecured consumer loans.",
        impact: "Higher risk weights require extra capital allocation, slightly curtailing risk-adjusted returns."
      },
      {
        title: "Trading Near Upper Historical Valuation Band",
        severity: "Low",
        explanation: "P/B ratio of 2.9x is near all-time peak relative to its 10-year average of 2.2x.",
        impact: "Future upside heavily depends on earnings delivery rather than further valuation re-rating."
      },
      {
        title: "Deposit Competition from Fintech & Private Peers",
        severity: "Low",
        explanation: "Intense battle for CASA deposits keeps liability acquisition costs elevated.",
        impact: "Slight margin pressure on incremental corporate lending."
      }
    ]
  },
  {
    symbol: "ZOMATO",
    yahooSymbol: "ZOMATO.NS",
    name: "Zomato Ltd. (Eternal)",
    sector: "Consumer Tech / Quick Commerce",
    marketCapCategory: "Large Cap",
    marketCap: 235000,
    cmp: 265.80,
    previousClose: 259.40,
    dayChange: 6.40,
    dayChangePercent: 2.47,
    high52w: 298.20,
    low52w: 108.00,
    peRatio: 92.4,
    industryPe: 45.0,
    pbRatio: 8.8,
    dividendYield: 0.00,
    roe: 10.2,
    roce: 11.5,
    debtToEquity: 0.02,
    eps: 2.88,
    salesGrowth3yr: 56.4,
    profitGrowth3yr: 140.0,
    operatingMargin: 6.8,
    freeCashFlow: 3200,
    promoterHolding: 0.0,
    pledgedPromoter: 0.0,
    fiiHolding: 52.80,
    diiHolding: 24.10,
    publicHolding: 23.10,
    beta: 1.35,
    rsi: 61.2,
    dma50: 255.0,
    dma200: 220.0,
    macdSignal: "Bullish",
    newsSentimentScore: 86,
    newsHighlights: [
      "Blinkit quick commerce dark store expansion reaches 1,000+ hubs with profitable unit economics.",
      "Going-out business acquisition from Paytm expands high-margin event ticketing ecosystem.",
      "Food delivery adjusted EBITDA margins continuously expanding quarter-on-quarter."
    ],
    analystRatings: {
      buyPercent: 84,
      holdPercent: 12,
      sellPercent: 4,
      consensus: "Strong Buy",
      targetPrice: 320.00
    },
    vulnerabilities: [
      {
        title: "Hyper-Expensive Valuation Multiple",
        severity: "Critical",
        explanation: "P/E ratio of ~92x leaves zero margin of safety for execution stumbles or growth slowdown.",
        impact: "High vulnerability to aggressive sell-offs on slight quarterly earnings misses."
      },
      {
        title: "Fierce Quick Commerce Cash Burn Warfare",
        severity: "Critical",
        explanation: "Intense competitive spending from Zepto, Swiggy Instamart, and Flipkart Minutes could trigger price discounting.",
        impact: "Risk of dark store store-level contribution margin erosion."
      },
      {
        title: "Regulatory Scrutiny on Gig Worker Welfare",
        severity: "Moderate",
        explanation: "Increasing legislative discussions around social security benefits and minimum wage for delivery fleet.",
        impact: "Could inflate delivery costs per order by ₹3-₹6."
      }
    ]
  },
  {
    symbol: "ITC",
    yahooSymbol: "ITC.NS",
    name: "ITC Ltd.",
    sector: "FMCG / Cigarettes & Hotels",
    marketCapCategory: "Large Cap",
    marketCap: 580000,
    cmp: 462.50,
    previousClose: 460.00,
    dayChange: 2.50,
    dayChangePercent: 0.54,
    high52w: 522.00,
    low52w: 399.30,
    peRatio: 27.2,
    industryPe: 38.0,
    pbRatio: 7.6,
    dividendYield: 3.15,
    roe: 28.5,
    roce: 37.2,
    debtToEquity: 0.01,
    eps: 17.00,
    salesGrowth3yr: 13.5,
    profitGrowth3yr: 12.8,
    operatingMargin: 36.5,
    freeCashFlow: 18200,
    promoterHolding: 0.0, // Professionally managed
    pledgedPromoter: 0.0,
    fiiHolding: 39.80,
    diiHolding: 42.10,
    publicHolding: 18.10,
    beta: 0.62,
    rsi: 44.8,
    dma50: 475.0,
    dma200: 482.0,
    macdSignal: "Neutral",
    newsSentimentScore: 75,
    newsHighlights: [
      "Demerger of ITC Hotels into standalone listed entity unlocks hospitality asset value.",
      "Non-cigarette FMCG brand portfolio (Aashirvaad, Sunfeast, Bingo) reaches ₹20,000 Cr annual consumer spend.",
      "Resilient dividend yield (>3%) continues to attract conservative and institutional income funds."
    ],
    analystRatings: {
      buyPercent: 78,
      holdPercent: 18,
      sellPercent: 4,
      consensus: "Buy",
      targetPrice: 535.00
    },
    vulnerabilities: [
      {
        title: "Cigarette Taxation & Regulatory Headwinds",
        severity: "Moderate",
        explanation: "GST Council reviews and National Calamity Contingent Duty (NCCD) rate hikes periodically overhang volume growth.",
        impact: "Sudden tax increases require retail price hikes that can trigger illicit trade competition."
      },
      {
        title: "Agri-Commodity & Packaging Input Cost Inflation",
        severity: "Low",
        explanation: "Fluctuations in wheat, spices, edible oil, and paperboard costs impact FMCG division operating margins.",
        impact: "Delays in passing input hikes to price-sensitive rural consumers."
      },
      {
        title: "Low Beta Consolidation",
        severity: "Low",
        explanation: "With beta of 0.62, stock can significantly lag roaring bull markets during aggressive risk-on rallies.",
        impact: "Perceived as a defensive dividend play with slower capital appreciation."
      }
    ]
  },
  {
    symbol: "M&M",
    yahooSymbol: "M&M.NS",
    name: "Mahindra & Mahindra Ltd.",
    sector: "Automobile & Farm Equipment",
    marketCapCategory: "Large Cap",
    marketCap: 365000,
    cmp: 2980.00,
    previousClose: 2950.00,
    dayChange: 30.00,
    dayChangePercent: 1.02,
    high52w: 3222.00,
    low52w: 1515.00,
    peRatio: 28.5,
    industryPe: 24.0,
    pbRatio: 5.2,
    dividendYield: 0.72,
    roe: 20.4,
    roce: 18.2,
    debtToEquity: 1.15,
    eps: 104.50,
    salesGrowth3yr: 26.8,
    profitGrowth3yr: 48.0,
    operatingMargin: 15.2,
    freeCashFlow: 14500,
    promoterHolding: 18.90,
    pledgedPromoter: 0.05,
    fiiHolding: 41.20,
    diiHolding: 27.50,
    publicHolding: 12.35,
    beta: 1.18,
    rsi: 55.4,
    dma50: 2920.0,
    dma200: 2650.0,
    macdSignal: "Bullish",
    newsSentimentScore: 83,
    newsHighlights: [
      "SUV order book remains strong with Scorpio-N, XUV700, and Thar Roxx commanding long wait times.",
      "Tractor division showing resilient market share (>41%) ahead of auspicious rabi crop cycle.",
      "Dedicated EV born-electric architecture 'INGLO' launch planned to rival global EV players."
    ],
    analystRatings: {
      buyPercent: 82,
      holdPercent: 14,
      sellPercent: 4,
      consensus: "Buy",
      targetPrice: 3400.00
    },
    vulnerabilities: [
      {
        title: "SUV Capacity Bottlenecks & Order Cancellation Risk",
        severity: "Moderate",
        explanation: "Long waiting periods for popular SUV models test consumer patience as competitors launch alternatives.",
        impact: "Customer drop-offs to rival brands like Hyundai, Tata, and Kia."
      },
      {
        title: "Rural Income & Monsoon Sensitivity",
        severity: "Moderate",
        explanation: "Tractor and farm equipment business relies heavily on rural disposable incomes and monsoon dispersion.",
        impact: "Subdued farm cash flows can curb high-margin tractor sales."
      },
      {
        title: "Subsidiary Financial Leverage",
        severity: "Low",
        explanation: "Consolidated debt includes financing book of Mahindra Finance (MMFS).",
        impact: "Asset quality cycles in rural non-bank financing require monitoring."
      }
    ]
  },
  {
    symbol: "SBIN",
    yahooSymbol: "SBIN.NS",
    name: "State Bank of India",
    sector: "Banking (Public Sector)",
    marketCapCategory: "Large Cap",
    marketCap: 730000,
    cmp: 818.00,
    previousClose: 810.20,
    dayChange: 7.80,
    dayChangePercent: 0.96,
    high52w: 912.10,
    low52w: 555.30,
    peRatio: 10.8,
    industryPe: 12.5,
    pbRatio: 1.6,
    dividendYield: 1.68,
    roe: 17.5,
    roce: 14.8,
    debtToEquity: 9.80,
    eps: 75.70,
    salesGrowth3yr: 18.2,
    profitGrowth3yr: 38.6,
    operatingMargin: 29.8,
    freeCashFlow: 32000,
    promoterHolding: 57.49, // Government of India
    pledgedPromoter: 0.0,
    fiiHolding: 11.20,
    diiHolding: 23.80,
    publicHolding: 7.51,
    beta: 1.25,
    rsi: 52.8,
    dma50: 812.0,
    dma200: 785.0,
    macdSignal: "Bullish",
    newsSentimentScore: 81,
    newsHighlights: [
      "Standalone net profit reaches all-time high with lowest net NPA ratio in two decades (0.53%).",
      "YONO app crosses 70M registered users, originating majority of retail personal advances.",
      "Unmatched corporate lending franchise driving India's infrastructure and green energy capex."
    ],
    analystRatings: {
      buyPercent: 86,
      holdPercent: 11,
      sellPercent: 3,
      consensus: "Strong Buy",
      targetPrice: 990.00
    },
    vulnerabilities: [
      {
        title: "PSU Wage Revision Overhead",
        severity: "Moderate",
        explanation: "Periodic bipartite wage hike revisions create one-time operating expense bumps and pension liabilities.",
        impact: "Temporary pressure on cost-to-income ratio."
      },
      {
        title: "Sovereign / Policy Obligations",
        severity: "Low",
        explanation: "As the nation's premier public lender, SBI shoulders national developmental and priority sector lending priorities.",
        impact: "Occasionally carries lower-margin public welfare credit mandates."
      },
      {
        title: "Corporate Balance Sheet Stress Sensitivity",
        severity: "Low",
        explanation: "Large exposure to infrastructure, power, and road construction consortium loans.",
        impact: "Vulnerable to macroeconomic credit cycles if debt defaults rise."
      }
    ]
  },
  {
    symbol: "BHARTIARTL",
    yahooSymbol: "BHARTIARTL.NS",
    name: "Bharti Airtel Ltd.",
    sector: "Telecommunications",
    marketCapCategory: "Large Cap",
    marketCap: 940000,
    cmp: 1610.00,
    previousClose: 1595.00,
    dayChange: 15.00,
    dayChangePercent: 0.94,
    high52w: 1779.00,
    low52w: 1045.00,
    peRatio: 52.5,
    industryPe: 35.0,
    pbRatio: 8.4,
    dividendYield: 0.50,
    roe: 18.2,
    roce: 16.5,
    debtToEquity: 1.82,
    eps: 30.65,
    salesGrowth3yr: 16.4,
    profitGrowth3yr: 42.0,
    operatingMargin: 52.8,
    freeCashFlow: 31000,
    promoterHolding: 53.48,
    pledgedPromoter: 0.0,
    fiiHolding: 25.10,
    diiHolding: 15.20,
    publicHolding: 6.22,
    beta: 0.78,
    rsi: 54.0,
    dma50: 1625.0,
    dma200: 1480.0,
    macdSignal: "Neutral",
    newsSentimentScore: 85,
    newsHighlights: [
      "Average Revenue Per User (ARPU) hits industry benchmark of ₹233 per month.",
      "Airtel Business (B2B) cloud and IoT solutions revenue growing at double digits.",
      "Africa telecommunication business delivers steady dollar-hedged cash flows."
    ],
    analystRatings: {
      buyPercent: 85,
      holdPercent: 12,
      sellPercent: 3,
      consensus: "Strong Buy",
      targetPrice: 1850.00
    },
    vulnerabilities: [
      {
        title: "High Consolidated Debt & AGR Dues",
        severity: "Critical",
        explanation: "Debt-to-equity stands at 1.82x due to past spectrum auctions and deferred AGR liabilities to DoT.",
        impact: "Annual debt servicing and spectrum installment requirements restrict equity dividend yield."
      },
      {
        title: "Depreciation of African Currencies",
        severity: "Moderate",
        explanation: "Devaluation of Nigerian Naira and other African currencies creates foreign exchange translation losses.",
        impact: "Dampens consolidated PAT reporting in INR terms."
      },
      {
        title: "Elevated P/E Multiple",
        severity: "Moderate",
        explanation: "Trailing P/E of 52.5x already prices in further tariff hikes.",
        impact: "Requires continuous ARPU expansion to justify rich multiples."
      }
    ]
  },
  {
    symbol: "ADANIENT",
    yahooSymbol: "ADANIENT.NS",
    name: "Adani Enterprises Ltd.",
    sector: "Infrastructure & Incubator",
    marketCapCategory: "Large Cap",
    marketCap: 320000,
    cmp: 2805.00,
    previousClose: 2790.00,
    dayChange: 15.00,
    dayChangePercent: 0.54,
    high52w: 3450.00,
    low52w: 2142.00,
    peRatio: 72.8,
    industryPe: 28.0,
    pbRatio: 6.8,
    dividendYield: 0.05,
    roe: 11.2,
    roce: 12.8,
    debtToEquity: 1.45,
    eps: 38.50,
    salesGrowth3yr: 38.2,
    profitGrowth3yr: 72.0,
    operatingMargin: 8.5,
    freeCashFlow: 8500,
    promoterHolding: 74.72,
    pledgedPromoter: 1.85,
    fiiHolding: 14.20,
    diiHolding: 5.60,
    publicHolding: 5.48,
    beta: 1.85,
    rsi: 48.0,
    dma50: 2890.0,
    dma200: 3010.0,
    macdSignal: "Neutral",
    newsSentimentScore: 66,
    newsHighlights: [
      "Navi Mumbai International Airport project enters final commissioning phase.",
      "Green Hydrogen ecosystem in Khavda progresses with wind-solar hybrid integration.",
      "Successfully tied up global institutional funding from Middle East and US funds."
    ],
    analystRatings: {
      buyPercent: 55,
      holdPercent: 25,
      sellPercent: 20,
      consensus: "Hold",
      targetPrice: 3100.00
    },
    vulnerabilities: [
      {
        title: "High Beta & Headline Volatility",
        severity: "Critical",
        explanation: "Beta of 1.85 indicates extreme sensitivity to regulatory, investigative, and political news flows.",
        impact: "Severe price swings during global short-seller or judicial scrutiny reports."
      },
      {
        title: "High Leverage for Infrastructure Incubation",
        severity: "Critical",
        explanation: "Debt-to-equity at 1.45x with massive ongoing capital commitments across airports, roads, and green hydrogen.",
        impact: "Sensitivity to global debt refinancing spreads and bond yields."
      },
      {
        title: "Stretched Valuation & Modest ROE",
        severity: "Moderate",
        explanation: "Trading at 72x P/E with an ROE of 11.2% reflects future growth priced in advance.",
        impact: "Low margin of error for timeline delays in asset monetization."
      }
    ]
  },
  {
    symbol: "TATASTEEL",
    yahooSymbol: "TATASTEEL.NS",
    name: "Tata Steel Ltd.",
    sector: "Metals & Mining",
    marketCapCategory: "Large Cap",
    marketCap: 178000,
    cmp: 142.50,
    previousClose: 141.20,
    dayChange: 1.30,
    dayChangePercent: 0.92,
    high52w: 184.60,
    low52w: 114.60,
    peRatio: 38.2, // Depressed by UK restructuring
    industryPe: 16.0,
    pbRatio: 1.9,
    dividendYield: 2.50,
    roe: 6.2,
    roce: 8.5,
    debtToEquity: 0.88,
    eps: 3.73,
    salesGrowth3yr: 8.4,
    profitGrowth3yr: -12.0,
    operatingMargin: 12.5,
    freeCashFlow: 9200,
    promoterHolding: 33.19,
    pledgedPromoter: 0.0,
    fiiHolding: 19.50,
    diiHolding: 23.40,
    publicHolding: 23.91,
    beta: 1.42,
    rsi: 47.5,
    dma50: 148.0,
    dma200: 156.0,
    macdSignal: "Neutral",
    newsSentimentScore: 71,
    newsHighlights: [
      "Transition to electric arc furnace (EAF) at Port Talbot UK backed by UK government grant.",
      "Kalinganagar blast furnace expansion commissions additional 5 MTPA hot metal capacity in Odisha.",
      "Domestic Indian steel consumption robust across automotive and infrastructure projects."
    ],
    analystRatings: {
      buyPercent: 65,
      holdPercent: 22,
      sellPercent: 13,
      consensus: "Buy",
      targetPrice: 170.00
    },
    vulnerabilities: [
      {
        title: "Chinese Steel Dumping & Global Price Softness",
        severity: "Critical",
        explanation: "Surplus Chinese steel exports suppress global hot rolled coil (HRC) spot prices.",
        impact: "EBITDA per tonne compression across domestic and international operations."
      },
      {
        title: "UK Operations Restructuring Cash Burn",
        severity: "Moderate",
        explanation: "Decommissioning aging blast furnaces in Port Talbot incurs severance and restructuring outlays.",
        impact: "Drags down consolidated profitability until low-emission arc furnaces come online."
      },
      {
        title: "Cyclical Commodity Downturn Exposure",
        severity: "Moderate",
        explanation: "Steel is deeply cyclical; earnings swing wildly with coking coal and iron ore input prices.",
        impact: "High earnings volatility making standard P/E multiple less predictive."
      }
    ]
  },
  {
    symbol: "JSWSTEEL",
    yahooSymbol: "JSWSTEEL.NS",
    name: "JSW Steel Ltd.",
    sector: "Metals & Mining",
    marketCapCategory: "Large Cap",
    marketCap: 228000,
    cmp: 935.00,
    previousClose: 942.00,
    dayChange: -7.00,
    dayChangePercent: -0.74,
    high52w: 1066.00,
    low52w: 735.00,
    peRatio: 26.5,
    industryPe: 16.0,
    pbRatio: 2.8,
    dividendYield: 0.78,
    roe: 12.4,
    roce: 13.8,
    debtToEquity: 1.10,
    eps: 35.25,
    salesGrowth3yr: 18.2,
    profitGrowth3yr: 15.0,
    operatingMargin: 15.8,
    freeCashFlow: 11000,
    promoterHolding: 44.80,
    pledgedPromoter: 12.50, // Promoter pledge flag!
    fiiHolding: 25.20,
    diiHolding: 10.40,
    publicHolding: 19.60,
    beta: 1.30,
    rsi: 45.0,
    dma50: 960.0,
    dma200: 920.0,
    macdSignal: "Neutral",
    newsSentimentScore: 73,
    newsHighlights: [
      "Crude steel production volume expands to 6.8 million tonnes in Q3.",
      "Bhakra and Vijayanagar brownfield expansions ramping up to reach 38 MTPA capacity by 2025.",
      "Strategic tie-up with JFE Steel Japan for electrical steel grain-oriented CRGO sheets."
    ],
    analystRatings: {
      buyPercent: 60,
      holdPercent: 28,
      sellPercent: 12,
      consensus: "Buy",
      targetPrice: 1050.00
    },
    vulnerabilities: [
      {
        title: "Promoter Share Pledging (12.5%)",
        severity: "Critical",
        explanation: "Substantial portion of promoter shares pledged against borrowings, posing margin call risk during market crashes.",
        impact: "Heightened downside volatility during sharp sector selloffs."
      },
      {
        title: "Elevated Leverage (Debt/Equity > 1.1x)",
        severity: "Moderate",
        explanation: "Rapid debt-fueled capacity expansion keeps net debt elevated at over ₹70,000 Cr.",
        impact: "Limits cash distributions and free cash flow yields during steel down-cycles."
      },
      {
        title: "Coking Coal Import Cost Sensitivity",
        severity: "Moderate",
        explanation: "Reliance on premium Australian coking coal imports leaves margins exposed to seaborne price shocks.",
        impact: "EBITDA margin fluctuations on international port freight disruptions."
      }
    ]
  },
  {
    symbol: "LT",
    yahooSymbol: "LT.NS",
    name: "Larsen & Toubro Ltd.",
    sector: "Infrastructure & Heavy Engineering",
    marketCapCategory: "Large Cap",
    marketCap: 495000,
    cmp: 3600.00,
    previousClose: 3575.00,
    dayChange: 25.00,
    dayChangePercent: 0.70,
    high52w: 3948.00,
    low52w: 2872.00,
    peRatio: 36.2,
    industryPe: 32.0,
    pbRatio: 5.1,
    dividendYield: 0.95,
    roe: 15.8,
    roce: 14.5,
    debtToEquity: 1.12,
    eps: 99.40,
    salesGrowth3yr: 18.5,
    profitGrowth3yr: 24.2,
    operatingMargin: 11.4,
    freeCashFlow: 16500,
    promoterHolding: 0.0, // Professionally managed
    pledgedPromoter: 0.0,
    fiiHolding: 23.50,
    diiHolding: 38.90,
    publicHolding: 37.60,
    beta: 0.94,
    rsi: 53.0,
    dma50: 3620.0,
    dma200: 3510.0,
    macdSignal: "Bullish",
    newsSentimentScore: 86,
    newsHighlights: [
      "Consolidated order book crosses record ₹5 lakh crore mark ($60B+), guaranteeing 3+ years revenue visibility.",
      "Middle East hydrocarbons and renewable infrastructure orders surging strongly.",
      "Green hydrogen, defense systems, and semiconductor design ventures gaining commercial traction."
    ],
    analystRatings: {
      buyPercent: 86,
      holdPercent: 11,
      sellPercent: 3,
      consensus: "Strong Buy",
      targetPrice: 4200.00
    },
    vulnerabilities: [
      {
        title: "Core EPC Margin Dilution",
        severity: "Moderate",
        explanation: "Legacy fixed-price contracts in infrastructure and transportation divisions face cost inflation.",
        impact: "Core construction EBITDA margin lingers around 8-9%, trailing management's aspirational 10% target."
      },
      {
        title: "Middle East Geopolitical & Project Delay Risk",
        severity: "Moderate",
        explanation: "Over 35% of fresh order inflows come from Saudi Arabia and GCC nations.",
        impact: "Project milestone delays or payment cycle extensions if regional tensions flare."
      },
      {
        title: "Working Capital Intensity",
        severity: "Low",
        explanation: "Mega-scale infrastructure projects require heavy bank guarantees and retention money.",
        impact: "Short-term operating cash flow volatility."
      }
    ]
  },
  {
    symbol: "SUNPHARMA",
    yahooSymbol: "SUNPHARMA.NS",
    name: "Sun Pharmaceutical Industries Ltd.",
    sector: "Pharmaceuticals & Healthcare",
    marketCapCategory: "Large Cap",
    marketCap: 415000,
    cmp: 1730.00,
    previousClose: 1715.00,
    dayChange: 15.00,
    dayChangePercent: 0.87,
    high52w: 1960.00,
    low52w: 1098.00,
    peRatio: 37.8,
    industryPe: 34.0,
    pbRatio: 5.6,
    dividendYield: 0.78,
    roe: 16.4,
    roce: 18.2,
    debtToEquity: 0.08,
    eps: 45.80,
    salesGrowth3yr: 12.4,
    profitGrowth3yr: 19.8,
    operatingMargin: 27.5,
    freeCashFlow: 9800,
    promoterHolding: 54.48,
    pledgedPromoter: 1.20,
    fiiHolding: 17.50,
    diiHolding: 19.20,
    publicHolding: 8.82,
    beta: 0.58,
    rsi: 51.5,
    dma50: 1760.0,
    dma200: 1620.0,
    macdSignal: "Bullish",
    newsSentimentScore: 80,
    newsHighlights: [
      "Global specialty portfolio (Ilumya, Cequa, Winlevi) contributes over $1.1B in high-margin revenues.",
      "Domestic formulation business retains #1 rank in Indian prescription market with 8.5% share.",
      "Clean balance sheet with near zero net debt and strong free cash conversion."
    ],
    analystRatings: {
      buyPercent: 78,
      holdPercent: 18,
      sellPercent: 4,
      consensus: "Buy",
      targetPrice: 2000.00
    },
    vulnerabilities: [
      {
        title: "US FDA Regulatory Inspection Inspections",
        severity: "Moderate",
        explanation: "Facilities like Halol and Dadra face periodic US FDA warning letters or import alerts.",
        impact: "Can stall generic product approvals for the US market."
      },
      {
        title: "Litigation & Patent Invalidation Risks",
        severity: "Moderate",
        explanation: "Specialty dermatology and ophthalmology drugs face patent challenges from generic competitors.",
        impact: "Legal defense costs and potential patent expiry cliffs."
      },
      {
        title: "R&D Expense Escalation",
        severity: "Low",
        explanation: "Clinical trials for innovative specialty pipeline require escalating annual R&D budgets (7-8% of sales).",
        impact: "Slight margin drag if phase 3 trials face delayed outcomes."
      }
    ]
  }
];
