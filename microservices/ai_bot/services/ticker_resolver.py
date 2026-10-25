import re
import requests
from typing import List, Optional, Tuple, Dict

# In-memory cache for dynamic ticker lookups to prevent duplicate HTTP calls
_DYNAMIC_TICKER_CACHE: Dict[str, str] = {}

# Common Indian & Global stocks dictionary for instant zero-latency resolution
COMMON_STOCKS = {
    # Indian Bluechips & Popular Midcaps
    "reliance": "RELIANCE.NS",
    "ril": "RELIANCE.NS",
    "reliance industries": "RELIANCE.NS",
    "tcs": "TCS.NS",
    "tata consultancy": "TCS.NS",
    "tata consultancy services": "TCS.NS",
    "infy": "INFY.NS",
    "infosys": "INFY.NS",
    "hdfc": "HDFCBANK.NS",
    "hdfc bank": "HDFCBANK.NS",
    "hdfcbank": "HDFCBANK.NS",
    "icici": "ICICIBANK.NS",
    "icici bank": "ICICIBANK.NS",
    "icicibank": "ICICIBANK.NS",
    "sbi": "SBIN.NS",
    "sbin": "SBIN.NS",
    "state bank of india": "SBIN.NS",
    "state bank": "SBIN.NS",
    "tata motors": "TMCV.NS",
    "tatamotors": "TMCV.NS",
    "tmcv": "TMCV.NS",
    "tmpv": "TMPV.NS",
    "tata steel": "TATASTEEL.NS",
    "tatasteel": "TATASTEEL.NS",
    "tata power": "TATAPOWER.NS",
    "tatapower": "TATAPOWER.NS",
    "itc": "ITC.NS",
    "bharti airtel": "BHARTIARTL.NS",
    "airtel": "BHARTIARTL.NS",
    "bhartiartl": "BHARTIARTL.NS",
    "kotak": "KOTAKBANK.NS",
    "kotak bank": "KOTAKBANK.NS",
    "kotak mahindra": "KOTAKBANK.NS",
    "kotakbank": "KOTAKBANK.NS",
    "wipro": "WIPRO.NS",
    "hcl tech": "HCLTECH.NS",
    "hcltech": "HCLTECH.NS",
    "bajaj finance": "BAJFINANCE.NS",
    "bajfinance": "BAJFINANCE.NS",
    "maruti": "MARUTI.NS",
    "maruti suzuki": "MARUTI.NS",
    "l&t": "LT.NS",
    "lt": "LT.NS",
    "larsen": "LT.NS",
    "larsen and toubro": "LT.NS",
    "asian paints": "ASIANPAINT.NS",
    "asianpaint": "ASIANPAINT.NS",
    "titan": "TITAN.NS",
    "sun pharma": "SUNPHARMA.NS",
    "sunpharma": "SUNPHARMA.NS",
    "adani enterprises": "ADANIENT.NS",
    "adanient": "ADANIENT.NS",
    "adani ports": "ADANIPORTS.NS",
    "adaniports": "ADANIPORTS.NS",
    "zomato": "ZOMATO.NS",
    "paytm": "PAYTM.NS",
    "one97": "PAYTM.NS",
    "jio": "JIOFIN.NS",
    "jio financial": "JIOFIN.NS",
    "jiofin": "JIOFIN.NS",
    "swiggy": "SWIGGY.NS",
    "hindustan unilever": "HINDUNILVR.NS",
    "hul": "HINDUNILVR.NS",
    "hindunilvr": "HINDUNILVR.NS",
    "ntpc": "NTPC.NS",
    "powergrid": "POWERGRID.NS",
    "ongc": "ONGC.NS",
    "coal india": "COALINDIA.NS",
    "coalindia": "COALINDIA.NS",
    "axis bank": "AXISBANK.NS",
    "axisbank": "AXISBANK.NS",
    "motilal": "MOTILALOFS.NS",
    "motilal oswal": "MOTILALOFS.NS",
    "motilalofs": "MOTILALOFS.NS",
    "suzlon": "SUZLON.NS",
    "cdsl": "CDSL.NS",
    "bse": "BSE.NS",
    "angel one": "ANGELONE.NS",
    "angelone": "ANGELONE.NS",
    "ireda": "IREDA.NS",
    "irfc": "IRFC.NS",
    "trent": "TRENT.NS",
    "hal": "HAL.NS",
    "bel": "BEL.NS",
    "vedanta": "VEDL.NS",
    "vedl": "VEDL.NS",
    "rvnl": "RVNL.NS",
    "mazagon": "MAZDOCK.NS",
    "mazagon dock": "MAZDOCK.NS",
    "mazdock": "MAZDOCK.NS",

    # US / Global Tech Giants
    "apple": "AAPL",
    "aapl": "AAPL",
    "google": "GOOGL",
    "googl": "GOOGL",
    "alphabet": "GOOGL",
    "microsoft": "MSFT",
    "msft": "MSFT",
    "tesla": "TSLA",
    "tsla": "TSLA",
    "nvidia": "NVDA",
    "nvda": "NVDA",
    "amazon": "AMZN",
    "amzn": "AMZN",
    "meta": "META",
    "facebook": "META"
}

QUERY_STOPWORDS = {
    'analyze', 'study', 'overview', 'insights', 'company', 'score', 'stock', 'share',
    'shares', 'cmp', 'price', 'what', 'is', 'the', 'of', 'for', 'give', 'me', 'its',
    'it', 'tell', 'about', 'ratio', 'pe', 'dividend', 'candles', 'candle', 'technicals',
    'fundamentals', 'sentiment', 'performance', 'trend', 'how', 'does', 'do', 'can', 'i',
    'check', 'inspect', 'review', 'verify', 'look', 'at', 'find', 'show', 'get', 'today',
    'now', 'market', 'analysis', 'invest', 'investing', 'details', 'detail', 'info', 'information',
    'hello', 'hi', 'hey', 'good', 'morning', 'afternoon', 'evening', 'thanks', 'thank'
}

GREETING_WORDS = {
    'hello', 'hi', 'hey', 'namaste', 'greetings', 'thanks', 'thank', 'thx', 'bye', 
    'good', 'morning', 'afternoon', 'evening'
}

PURE_METRIC_FOLLOWUPS = {
    'pe', 'p', 'e', 'cmp', 'dividend', 'roce', 'roe', 'eps', 'rsi', 'macd', 
    'candle', 'candles', 'candlestick', 'sales', 'profit', 'score', 'rating', 
    'ratio', 'technicals', 'fundamentals', '10', '5', '15', 'min', 'minute', 
    'minutes', 'price', 'yield', 'mcap', 'give', 'me', 'its', 'it', 'what', 
    'is', 'the', 'of', 'for', 'about', 'tell', 'show', 'check', 'how', 'does', 
    'in', 'and', 'to', 'can', 'you', 'please'
}

def is_pure_greeting_or_metric_query(text: str) -> bool:
    """Returns True if the user input contains only greetings or follow-up metric requests."""
    clean = text.lower().replace('/', ' ').replace('-', ' ')
    words = set(re.findall(r'[a-zA-Z0-9]+', clean))
    if not words:
        return True
    if words.issubset(GREETING_WORDS):
        return True
    if words.issubset(PURE_METRIC_FOLLOWUPS):
        return True
    return False

def dynamic_search_ticker(query_text: str) -> Optional[str]:
    """
    Dynamically searches Yahoo Finance for listed tickers.
    Prioritizes Indian NSE (.NS) and BSE (.BO) operating companies over ETFs/funds.
    """
    cleaned = query_text.strip().lower()
    if not cleaned or len(cleaned) < 2:
        return None
    if cleaned in _DYNAMIC_TICKER_CACHE:
        return _DYNAMIC_TICKER_CACHE[cleaned]

    try:
        url = f"https://query2.finance.yahoo.com/v1/finance/search?q={cleaned}&quotesCount=8&newsCount=0"
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=3.5).json()
        quotes = resp.get("quotes", [])

        # Priority 1: Indian Equities (.NS or .BO), filtering out ETFs and Mutual Funds
        for q in quotes:
            sym = q.get("symbol", "")
            sname = (q.get("shortname") or "").upper()
            lname = (q.get("longname") or "").upper()
            if (sym.endswith(".NS") or sym.endswith(".BO")) and q.get("quoteType") == "EQUITY":
                if not any(x in sname or x in lname for x in ["ETF", "AMC", "MUTUAL FUND", "BEES", "INDEX"]):
                    _DYNAMIC_TICKER_CACHE[cleaned] = sym
                    return sym

        # Priority 2: Any matching company equity
        for q in quotes:
            if q.get("quoteType") == "EQUITY":
                sym = q.get("symbol")
                _DYNAMIC_TICKER_CACHE[cleaned] = sym
                return sym

        # Priority 3: First valid symbol
        if quotes:
            first_sym = quotes[0].get("symbol")
            if first_sym:
                _DYNAMIC_TICKER_CACHE[cleaned] = first_sym
                return first_sym
    except Exception:
        pass

    return None

def resolve_ticker(name_or_symbol: str) -> str:
    """
    Resolves a stock name, abbreviation, or raw symbol to an exchange ticker.
    Uses dictionary first, then dynamic search, and defaults to Indian NSE (.NS).
    """
    cleaned = name_or_symbol.strip().lower()

    # 1. Direct dictionary lookup
    if cleaned in COMMON_STOCKS:
        return COMMON_STOCKS[cleaned]

    # 2. If already has exchange suffix
    if "." in name_or_symbol:
        return name_or_symbol.upper()

    # 3. Known US tech symbols
    symbol = name_or_symbol.strip().upper()
    if symbol in ["AAPL", "MSFT", "GOOGL", "GOOG", "AMZN", "TSLA", "NVDA", "META"]:
        return symbol

    # 4. Try dynamic search
    dyn = dynamic_search_ticker(cleaned)
    if dyn:
        return dyn

    # Default fallback
    return f"{symbol}.NS"

def extract_tickers_from_text(text: str) -> List[str]:
    """
    Extracts potential stock tickers from freeform natural language queries.
    Combines exact dictionary matching, explicit symbol regex, and smart dynamic candidate search.
    """
    text_lower = text.lower()
    found_tickers: List[str] = []

    # 1. Dictionary matching (longest phrase first)
    sorted_keys = sorted(COMMON_STOCKS.keys(), key=lambda k: len(k), reverse=True)
    matched_ranges = []
    for key in sorted_keys:
        pattern = r'\b' + re.escape(key) + r'\b'
        for match in re.finditer(pattern, text_lower):
            start, end = match.span()
            if not any(s <= start and end <= e for s, e in matched_ranges):
                matched_ranges.append((start, end))
                ticker = COMMON_STOCKS[key]
                if ticker not in found_tickers:
                    found_tickers.append(ticker)

    # 2. Check for explicit exchange ticker pattern (e.g. RELIANCE.NS, MOTILALOFS.NS)
    explicit_matches = re.findall(r'\b[A-Z0-9]{2,12}\.NS\b', text)
    for m in explicit_matches:
        if m not in found_tickers:
            found_tickers.append(m)

    # 3. Dynamic candidate extraction if no ticker was recognized
    # BUT only if the query is not a greeting or pure metric follow-up
    if not found_tickers and not is_pure_greeting_or_metric_query(text):
        tokens = [w for w in re.findall(r'[a-zA-Z0-9]+', text_lower) if w not in QUERY_STOPWORDS]
        if tokens:
            candidate_phrase = " ".join(tokens)
            dyn = dynamic_search_ticker(candidate_phrase)
            if dyn and dyn not in found_tickers:
                found_tickers.append(dyn)
            else:
                for t in tokens:
                    if len(t) >= 3:
                        dyn_token = dynamic_search_ticker(t)
                        if dyn_token and dyn_token not in found_tickers:
                            found_tickers.append(dyn_token)
                            break

    return found_tickers

def format_ticker_display(ticker: str) -> str:
    """Formats ticker for friendly display by removing exchange suffix."""
    if ticker.endswith(".NS") or ticker.endswith(".BO"):
        return ticker.split(".")[0]
    return ticker
