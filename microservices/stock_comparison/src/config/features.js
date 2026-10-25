// Modular Feature Configuration & Plugin Registry
// Developers or users can easily enable, disable, reorder, or inject custom modules here.

export const defaultFeatureFlags = {
  // Head-to-Head Duel Summary & Winner Verdict
  showQuickDuelSummary: true,

  // Multi-factor Quality Rating & Letter Grade (A+, A, B, C, D)
  showRatingScorecard: true,

  // Risk, Red Flags & Vulnerabilities Detector
  showVulnerabilities: true,

  // Interactive 1-Year Price & Normalized Return Duel Chart
  showInteractiveChart: true,

  // Fundamental Matrix (P/E, ROE, ROCE, Debt/Equity, Margins, Shareholding)
  showFundamentalAnalysis: true,

  // Technical Room (CMP, 52W range, 50/200 DMA, RSI, MACD)
  showTechnicalAnalysis: true,

  // Market Sentiment, Analyst Consensus & Institutional Holdings
  showSentimentAnalysis: true,

  // Interactive "What-If" Scenario Simulator (Interest rates, Capex, Inflation)
  showScenarioSimulator: true,

  // Searchable Financial Glossary & Learning Academy
  showGlossaryHub: true,

  // Live Exchange News & Market Buzz
  showNewsFeed: true,
};

// Feature metadata for the interactive Feature Customizer drawer
export const featureDefinitions = [
  {
    key: "showQuickDuelSummary",
    name: "Duel Winner Summary",
    description: "Side-by-side winning tally highlighting which company leads across fundamental & technical metrics.",
    category: "Core Comparison",
    icon: "Trophy"
  },
  {
    key: "showRatingScorecard",
    name: "AI Rating Scorecard",
    description: "Composite letter grade (A+ to D) with sub-scores for Fundamentals, Technicals, and Sentiment.",
    category: "Core Comparison",
    icon: "Award"
  },
  {
    key: "showVulnerabilities",
    name: "Vulnerabilities & Red Flags",
    description: "Critical risk analyzer identifying high debt, valuation stretch, promoter pledging, and technical pitfalls.",
    category: "Risk Intelligence",
    icon: "ShieldAlert"
  },
  {
    key: "showInteractiveChart",
    name: "Interactive Price Performance Chart",
    description: "Normalized 12-month return % and actual price comparison curves.",
    category: "Analytics",
    icon: "LineChart"
  },
  {
    key: "showFundamentalAnalysis",
    name: "Fundamental Deep-Dive",
    description: "Valuation multiples, profitability, balance sheet leverage, and shareholding patterns.",
    category: "Financials",
    icon: "Layers"
  },
  {
    key: "showTechnicalAnalysis",
    name: "Technical Momentum Room",
    description: "RSI gauge, 50/200 DMA crossover signals, MACD trend, and 52-week price range sliders.",
    category: "Financials",
    icon: "Gauge"
  },
  {
    key: "showSentimentAnalysis",
    name: "Sentiment & Analyst Consensus",
    description: "Street consensus (Buy/Hold/Sell percentages), news sentiment gauge, and institutional flow.",
    category: "Market Mood",
    icon: "Smile"
  },
  {
    key: "showScenarioSimulator",
    name: "What-If Scenario Simulator",
    description: "Interactive simulation testing how rate hikes or margin shifts impact each company differently.",
    category: "Learning & Simulation",
    icon: "Sliders"
  },
  {
    key: "showGlossaryHub",
    name: "Stock Market Glossary & Academy",
    description: "Searchable dictionary of 30+ financial terms with ELI5 explanations, formulas, and benchmarks.",
    category: "Education",
    icon: "BookOpen"
  },
  {
    key: "showNewsFeed",
    name: "Curated Exchange News Feed",
    description: "Latest business headlines and developments verified from financial disclosures.",
    category: "News",
    icon: "Newspaper"
  }
];
