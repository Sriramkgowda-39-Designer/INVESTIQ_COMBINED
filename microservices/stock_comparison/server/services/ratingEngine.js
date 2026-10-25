// Dynamic Rating & Scoring Engine for Indian Equities
// Calculates Fundamental Score, Technical Score, Sentiment Score, and Composite Rating.

export function calculateCompanyRating(stock) {
  // 1. Fundamental Score (0 - 100)
  let fundScore = 50;

  // Valuation factor (P/E vs Industry P/E)
  if (stock.peRatio && stock.industryPe) {
    const peRatio = stock.peRatio / stock.industryPe;
    if (peRatio < 0.8) fundScore += 12; // Discounted
    else if (peRatio <= 1.2) fundScore += 8; // Fairly valued
    else if (peRatio > 2.0) fundScore -= 10; // Stretched
  }

  // ROE & ROCE factor
  if (stock.roe >= 25) fundScore += 12;
  else if (stock.roe >= 15) fundScore += 8;
  else if (stock.roe < 10) fundScore -= 5;

  if (stock.roce >= 30) fundScore += 10;
  else if (stock.roce >= 18) fundScore += 6;

  // Debt to Equity factor (Adjust for banking sector which has regulatory deposits)
  const isBank = stock.sector.toLowerCase().includes('bank');
  if (!isBank) {
    if (stock.debtToEquity < 0.2) fundScore += 10; // Virtually debt free
    else if (stock.debtToEquity < 0.6) fundScore += 5;
    else if (stock.debtToEquity > 1.2) fundScore -= 12; // High leverage
  } else {
    // For banks, ROE and Operating Margin matter more
    if (stock.roe >= 16) fundScore += 8;
  }

  // Promoter Pledging (Severe Red Flag)
  if (stock.pledgedPromoter === 0) {
    fundScore += 6;
  } else if (stock.pledgedPromoter > 10) {
    fundScore -= 15;
  } else if (stock.pledgedPromoter > 0) {
    fundScore -= 6;
  }

  // Profit & Sales Growth
  if (stock.profitGrowth3yr > 20) fundScore += 8;
  else if (stock.profitGrowth3yr > 10) fundScore += 4;
  else if (stock.profitGrowth3yr < 0) fundScore -= 8;

  fundScore = Math.min(98, Math.max(25, Math.round(fundScore)));

  // 2. Technical Score (0 - 100)
  let techScore = 50;

  // Moving Average Position
  if (stock.cmp > stock.dma50 && stock.cmp > stock.dma200) {
    techScore += 18; // Strong Uptrend (Golden alignment)
  } else if (stock.cmp > stock.dma200) {
    techScore += 8; // Above long-term baseline
  } else if (stock.cmp < stock.dma50 && stock.cmp < stock.dma200) {
    techScore -= 16; // Strong Downtrend
  }

  // RSI Momentum
  if (stock.rsi >= 50 && stock.rsi <= 65) {
    techScore += 12; // Healthy bullish momentum
  } else if (stock.rsi > 75) {
    techScore -= 6; // Overbought risk
  } else if (stock.rsi < 35) {
    techScore -= 8; // Oversold weakness
  }

  // 52-Week Range Positioning
  if (stock.high52w && stock.low52w && stock.high52w > stock.low52w) {
    const rangePosition = (stock.cmp - stock.low52w) / (stock.high52w - stock.low52w);
    if (rangePosition > 0.75) techScore += 8;
    else if (rangePosition < 0.25) techScore -= 6;
  }

  // MACD Signal
  if (stock.macdSignal === 'Bullish') techScore += 8;
  else if (stock.macdSignal === 'Bearish') techScore -= 8;

  techScore = Math.min(95, Math.max(20, Math.round(techScore)));

  // 3. Sentiment Score (0 - 100)
  let sentimentScore = stock.newsSentimentScore || 70;
  if (stock.analystRatings) {
    const buyWeight = stock.analystRatings.buyPercent * 0.4;
    const holdWeight = stock.analystRatings.holdPercent * 0.1;
    const sellPenalty = stock.analystRatings.sellPercent * 0.3;
    const analystScore = buyWeight + holdWeight - sellPenalty + 40;
    sentimentScore = Math.round((sentimentScore * 0.6) + (analystScore * 0.4));
  }
  sentimentScore = Math.min(96, Math.max(25, sentimentScore));

  // 4. Composite Score & Rating
  const compositeScore = Math.round((fundScore * 0.45) + (techScore * 0.30) + (sentimentScore * 0.25));

  let grade = "B";
  let verdict = "Hold / Balanced";
  let badgeColor = "amber";

  if (compositeScore >= 85) {
    grade = "A+";
    verdict = "Strong Outperform";
    badgeColor = "emerald";
  } else if (compositeScore >= 75) {
    grade = "A";
    verdict = "Buy / High Quality";
    badgeColor = "emerald";
  } else if (compositeScore >= 65) {
    grade = "B+";
    verdict = "Accumulate";
    badgeColor = "blue";
  } else if (compositeScore >= 52) {
    grade = "B";
    verdict = "Hold / Neutral";
    badgeColor = "amber";
  } else if (compositeScore >= 42) {
    grade = "C";
    verdict = "Caution / Underperform";
    badgeColor = "orange";
  } else {
    grade = "D";
    verdict = "High Risk / Reduce";
    badgeColor = "red";
  }

  return {
    grade,
    verdict,
    badgeColor,
    compositeScore,
    fundamentalScore: fundScore,
    technicalScore: techScore,
    sentimentScore: sentimentScore,
    lastUpdated: new Date().toISOString()
  };
}
