import express from 'express';
import cors from 'cors';
import { indianStocksDatabase } from './data/indianStocks.js';
import { calculateCompanyRating } from './services/ratingEngine.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Helper to enrich live data via Yahoo Finance if available
async function enrichWithLiveYahooData(stock) {
  try {
    const symbol = stock.yahooSymbol || `${stock.symbol}.NS`;
    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(2500)
    });
    if (response.ok) {
      const data = await response.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (meta && meta.regularMarketPrice) {
        const liveCmp = Number(meta.regularMarketPrice.toFixed(2));
        const prevClose = Number((meta.chartPreviousClose || stock.previousClose).toFixed(2));
        const dayChange = Number((liveCmp - prevClose).toFixed(2));
        const dayChangePercent = Number(((dayChange / prevClose) * 100).toFixed(2));

        return {
          ...stock,
          cmp: liveCmp,
          previousClose: prevClose,
          dayChange,
          dayChangePercent,
          high52w: meta.fiftyTwoWeekHigh || stock.high52w,
          low52w: meta.fiftyTwoWeekLow || stock.low52w,
          isLiveSynced: true
        };
      }
    }
  } catch (err) {
    // Graceful fallback to verified base dataset
  }
  return { ...stock, isLiveSynced: false };
}

// Generate realistic 12-month normalized price comparison data for charts
function generateHistoricalChartData(stock1, stock2) {
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const data = [];

  // Starting base normalized to 100
  let p1 = 100;
  let p2 = 100;

  // Predictable seed based on symbols to keep chart coherent
  const s1Factor = (stock1.profitGrowth3yr || 10) / 100;
  const s2Factor = (stock2.profitGrowth3yr || 10) / 100;

  for (let i = 0; i < months.length; i++) {
    // Generate realistic market waves
    const marketWave = Math.sin(i / 1.5) * 4;
    const v1 = Math.cos((i * 1.8) + (stock1.symbol.charCodeAt(0) % 5)) * 3;
    const v2 = Math.sin((i * 1.6) + (stock2.symbol.charCodeAt(0) % 5)) * 3.5;

    p1 = Number((100 + (s1Factor * i * 3) + marketWave + v1).toFixed(1));
    p2 = Number((100 + (s2Factor * i * 3) + marketWave + v2).toFixed(1));

    // Calculate actual estimated historical price based on current CMP
    const actualPrice1 = Number(((p1 / 100) * (stock1.cmp * 0.88)).toFixed(2));
    const actualPrice2 = Number(((p2 / 100) * (stock2.cmp * 0.88)).toFixed(2));

    data.push({
      month: months[i],
      [`${stock1.symbol}_return`]: Number((p1 - 100).toFixed(1)),
      [`${stock2.symbol}_return`]: Number((p2 - 100).toFixed(1)),
      [`${stock1.symbol}_price`]: actualPrice1,
      [`${stock2.symbol}_price`]: actualPrice2,
    });
  }

  // Ensure last point aligns with current CMP
  data[data.length - 1][`${stock1.symbol}_price`] = stock1.cmp;
  data[data.length - 1][`${stock2.symbol}_price`] = stock2.cmp;

  return data;
}

// Search API: Search Indian companies by name or symbol
app.get('/api/stocks/search', (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();
  if (!query) {
    return res.json(indianStocksDatabase.slice(0, 10).map(s => ({
      symbol: s.symbol,
      name: s.name,
      sector: s.sector,
      cmp: s.cmp,
      dayChangePercent: s.dayChangePercent
    })));
  }

  const results = indianStocksDatabase.filter(s =>
    s.symbol.toLowerCase().includes(query) ||
    s.name.toLowerCase().includes(query) ||
    s.sector.toLowerCase().includes(query)
  ).map(s => ({
    symbol: s.symbol,
    name: s.name,
    sector: s.sector,
    cmp: s.cmp,
    dayChangePercent: s.dayChangePercent
  }));

  res.json(results);
});

// Popular default comparison pairings
app.get('/api/stocks/popular-duels', (req, res) => {
  res.json([
    {
      id: "tcs-infy",
      name: "TCS vs Infosys",
      subtitle: "The Battle of Indian IT Giants",
      symbol1: "TCS",
      symbol2: "INFY",
      tag: "Tech Titans"
    },
    {
      id: "hdfc-icici",
      name: "HDFC Bank vs ICICI Bank",
      subtitle: "Private Banking Supremacy",
      symbol1: "HDFCBANK",
      symbol2: "ICICIBANK",
      tag: "Banking Leaders"
    },
    {
      id: "reliance-tatamotors",
      name: "Reliance vs Tata Motors",
      subtitle: "Conglomerate & EV Revolution",
      symbol1: "RELIANCE",
      symbol2: "TATAMOTORS",
      tag: "Mega Conglomerates"
    },
    {
      id: "tatasteel-jswsteel",
      name: "Tata Steel vs JSW Steel",
      subtitle: "Infrastructure & Steel Clash",
      symbol1: "TATASTEEL",
      symbol2: "JSWSTEEL",
      tag: "Commodity Kings"
    },
    {
      id: "zomato-itc",
      name: "Zomato vs ITC",
      subtitle: "New Age Tech vs Classic FMCG Moat",
      symbol1: "ZOMATO",
      symbol2: "ITC",
      tag: "New Tech vs Cash Cow"
    }
  ]);
});

// Compare endpoint
app.get('/api/stocks/compare', async (req, res) => {
  const sym1 = (req.query.sym1 || 'TCS').toUpperCase().trim();
  const sym2 = (req.query.sym2 || 'INFY').toUpperCase().trim();

  let stock1 = indianStocksDatabase.find(s => s.symbol === sym1);
  let stock2 = indianStocksDatabase.find(s => s.symbol === sym2);

  // If not found, fall back to defaults
  if (!stock1) stock1 = indianStocksDatabase[0]; // TCS
  if (!stock2) stock2 = indianStocksDatabase[1]; // INFY

  // Attempt live refresh
  const [liveStock1, liveStock2] = await Promise.all([
    enrichWithLiveYahooData(stock1),
    enrichWithLiveYahooData(stock2)
  ]);

  // Calculate Ratings
  const rating1 = calculateCompanyRating(liveStock1);
  const rating2 = calculateCompanyRating(liveStock2);

  const enrichedStock1 = { ...liveStock1, rating: rating1 };
  const enrichedStock2 = { ...liveStock2, rating: rating2 };

  // Generate historical chart points
  const chartData = generateHistoricalChartData(enrichedStock1, enrichedStock2);

  // Calculate Head-to-Head Duel Matrix (Who wins in each dimension)
  const duelMatrix = [
    {
      metric: "Valuation (P/E Ratio)",
      key: "peRatio",
      val1: enrichedStock1.peRatio,
      val2: enrichedStock2.peRatio,
      display1: `${enrichedStock1.peRatio}x`,
      display2: `${enrichedStock2.peRatio}x`,
      winner: enrichedStock1.peRatio < enrichedStock2.peRatio ? enrichedStock1.symbol : enrichedStock2.symbol,
      higherIsBetter: false,
      tooltipKey: "peRatio",
      insight: enrichedStock1.peRatio < enrichedStock2.peRatio
        ? `${enrichedStock1.symbol} is priced at a lower earnings multiple`
        : `${enrichedStock2.symbol} is priced at a lower earnings multiple`
    },
    {
      metric: "Return on Equity (ROE)",
      key: "roe",
      val1: enrichedStock1.roe,
      val2: enrichedStock2.roe,
      display1: `${enrichedStock1.roe}%`,
      display2: `${enrichedStock2.roe}%`,
      winner: enrichedStock1.roe > enrichedStock2.roe ? enrichedStock1.symbol : enrichedStock2.symbol,
      higherIsBetter: true,
      tooltipKey: "roe",
      insight: enrichedStock1.roe > enrichedStock2.roe
        ? `${enrichedStock1.symbol} generates superior profit from shareholder equity`
        : `${enrichedStock2.symbol} generates superior profit from shareholder equity`
    },
    {
      metric: "Return on Capital Employed (ROCE)",
      key: "roce",
      val1: enrichedStock1.roce,
      val2: enrichedStock2.roce,
      display1: `${enrichedStock1.roce}%`,
      display2: `${enrichedStock2.roce}%`,
      winner: enrichedStock1.roce > enrichedStock2.roce ? enrichedStock1.symbol : enrichedStock2.symbol,
      higherIsBetter: true,
      tooltipKey: "roce",
      insight: enrichedStock1.roce > enrichedStock2.roce
        ? `${enrichedStock1.symbol} deploys total capital more efficiently`
        : `${enrichedStock2.symbol} deploys total capital more efficiently`
    },
    {
      metric: "Debt-to-Equity Ratio",
      key: "debtToEquity",
      val1: enrichedStock1.debtToEquity,
      val2: enrichedStock2.debtToEquity,
      display1: `${enrichedStock1.debtToEquity}x`,
      display2: `${enrichedStock2.debtToEquity}x`,
      winner: enrichedStock1.debtToEquity < enrichedStock2.debtToEquity ? enrichedStock1.symbol : enrichedStock2.symbol,
      higherIsBetter: false,
      tooltipKey: "debtToEquity",
      insight: enrichedStock1.debtToEquity < enrichedStock2.debtToEquity
        ? `${enrichedStock1.symbol} has a cleaner, less leveraged balance sheet`
        : `${enrichedStock2.symbol} has a cleaner, less leveraged balance sheet`
    },
    {
      metric: "Operating Margin (OPM)",
      key: "operatingMargin",
      val1: enrichedStock1.operatingMargin,
      val2: enrichedStock2.operatingMargin,
      display1: `${enrichedStock1.operatingMargin}%`,
      display2: `${enrichedStock2.operatingMargin}%`,
      winner: enrichedStock1.operatingMargin > enrichedStock2.operatingMargin ? enrichedStock1.symbol : enrichedStock2.symbol,
      higherIsBetter: true,
      tooltipKey: "operatingMargin",
      insight: enrichedStock1.operatingMargin > enrichedStock2.operatingMargin
        ? `${enrichedStock1.symbol} retains higher cash from operational revenue`
        : `${enrichedStock2.symbol} retains higher cash from operational revenue`
    },
    {
      metric: "3-Year Profit Growth",
      key: "profitGrowth3yr",
      val1: enrichedStock1.profitGrowth3yr,
      val2: enrichedStock2.profitGrowth3yr,
      display1: `${enrichedStock1.profitGrowth3yr}%`,
      display2: `${enrichedStock2.profitGrowth3yr}%`,
      winner: enrichedStock1.profitGrowth3yr > enrichedStock2.profitGrowth3yr ? enrichedStock1.symbol : enrichedStock2.symbol,
      higherIsBetter: true,
      tooltipKey: "profitGrowth3yr",
      insight: enrichedStock1.profitGrowth3yr > enrichedStock2.profitGrowth3yr
        ? `${enrichedStock1.symbol} expanded profits faster over the last 3 years`
        : `${enrichedStock2.symbol} expanded profits faster over the last 3 years`
    },
    {
      metric: "Overall Quality Rating",
      key: "rating",
      val1: rating1.compositeScore,
      val2: rating2.compositeScore,
      display1: `${rating1.grade} (${rating1.compositeScore}/100)`,
      display2: `${rating2.grade} (${rating2.compositeScore}/100)`,
      winner: rating1.compositeScore > rating2.compositeScore ? enrichedStock1.symbol : enrichedStock2.symbol,
      higherIsBetter: true,
      tooltipKey: "compositeRating",
      insight: rating1.compositeScore > rating2.compositeScore
        ? `${enrichedStock1.symbol} scores higher on our comprehensive multi-factor rating`
        : `${enrichedStock2.symbol} scores higher on our comprehensive multi-factor rating`
    },
    {
      metric: "Market Sentiment & Analyst Mood",
      key: "sentimentScore",
      val1: rating1.sentimentScore,
      val2: rating2.sentimentScore,
      display1: `${rating1.sentimentScore}/100`,
      display2: `${rating2.sentimentScore}/100`,
      winner: rating1.sentimentScore > rating2.sentimentScore ? enrichedStock1.symbol : enrichedStock2.symbol,
      higherIsBetter: true,
      tooltipKey: "sentimentScore",
      insight: rating1.sentimentScore > rating2.sentimentScore
        ? `${enrichedStock1.symbol} enjoys stronger analyst consensus and positive news coverage`
        : `${enrichedStock2.symbol} enjoys stronger analyst consensus and positive news coverage`
    }
  ];

  // Tally wins
  const wins1 = duelMatrix.filter(d => d.winner === enrichedStock1.symbol).length;
  const wins2 = duelMatrix.filter(d => d.winner === enrichedStock2.symbol).length;

  res.json({
    company1: enrichedStock1,
    company2: enrichedStock2,
    duelMatrix,
    scoreTally: {
      [enrichedStock1.symbol]: wins1,
      [enrichedStock2.symbol]: wins2,
      leader: wins1 > wins2 ? enrichedStock1.symbol : wins2 > wins1 ? enrichedStock2.symbol : 'Tied'
    },
    chartData,
    lastRefreshed: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })
  });
});

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

// Serve static frontend assets
app.use(express.static(distPath));

// Catch-all route to serve the Single Page React application
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🇮🇳 FinClash India API & Web Server running on port ${PORT}`);
});
