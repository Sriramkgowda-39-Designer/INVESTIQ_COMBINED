import urllib.parse
import xml.etree.ElementTree as ET
from typing import List, Dict, Any, Optional, Tuple
import httpx
from models.schemas import SentimentData, NewsItem

POSITIVE_WORDS_STRONG = [
    "surge", "skyrocket", "record profit", "bullish breakout", "all-time high",
    "massive gain", "strong buy", "outperform", "multibagger", "soar", "blockbuster"
]
POSITIVE_WORDS = [
    "jump", "rally", "gain", "rise", "profit", "dividend", "growth", "boost", 
    "upbeat", "buy", "expansion", "order win", "beat estimates", "recovery", 
    "positive", "higher", "rebound", "milestone", "strong"
]

NEGATIVE_WORDS_STRONG = [
    "crash", "plunge", "massive loss", "scam", "fraud", "probe", "investigation",
    "bearish breakdown", "default", "bankruptcy", "downgrade", "meltdown", "bloodbath"
]
NEGATIVE_WORDS = [
    "fall", "drop", "decline", "slump", "loss", "deficit", "penalty", "weak", 
    "concern", "sell", "misses", "pressure", "cautious", "lower", "headwind",
    "cut", "warning", "tumble", "negative"
]

def analyze_headline_sentiment(title: str) -> Tuple[float, str]:
    lower_title = title.lower()
    score = 0.0

    for word in POSITIVE_WORDS_STRONG:
        if word in lower_title:
            score += 2.0
    for word in POSITIVE_WORDS:
        if word in lower_title:
            score += 1.0

    for word in NEGATIVE_WORDS_STRONG:
        if word in lower_title:
            score -= 2.0
    for word in NEGATIVE_WORDS:
        if word in lower_title:
            score -= 1.0

    if score > 0.5:
        return score, "Positive"
    elif score < -0.5:
        return score, "Negative"
    return score, "Neutral"

def fetch_and_analyze_sentiment(company_name: str, ticker: str, max_articles: int = 6) -> SentimentData:
    """
    Fetches real-time financial news for the company from Google News RSS
    and performs financial sentiment evaluation.
    """
    # Clean ticker display
    clean_symbol = ticker.replace(".NS", "").replace(".BO", "")
    query = f"{company_name} {clean_symbol} stock"
    encoded_query = urllib.parse.quote(query)
    url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"
    
    news_items: List[NewsItem] = []
    total_score = 0.0
    pos_count = 0
    neg_count = 0
    neut_count = 0
    drivers: List[str] = []

    try:
        with httpx.Client(timeout=6.0, follow_redirects=True) as client:
            resp = client.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            if resp.status_code == 200:
                root = ET.fromstring(resp.content)
                items = root.findall(".//item")[:max_articles]
                
                for item in items:
                    title_elem = item.find("title")
                    link_elem = item.find("link")
                    pub_elem = item.find("pubDate")
                    source_elem = item.find("source")
                    
                    title = title_elem.text.strip() if title_elem is not None and title_elem.text else ""
                    if not title:
                        continue
                    
                    link = link_elem.text.strip() if link_elem is not None and link_elem.text else ""
                    pub_date = pub_elem.text.strip() if pub_elem is not None and pub_elem.text else ""
                    source_name = source_elem.text.strip() if source_elem is not None and source_elem.text else "Market News"

                    raw_score, tag = analyze_headline_sentiment(title)
                    total_score += raw_score
                    
                    if tag == "Positive":
                        pos_count += 1
                        if len(drivers) < 3:
                            drivers.append(f"Positive: {title}")
                    elif tag == "Negative":
                        neg_count += 1
                        if len(drivers) < 3:
                            drivers.append(f"Caution: {title}")
                    else:
                        neut_count += 1

                    news_items.append(NewsItem(
                        title=title,
                        source=source_name,
                        published_at=pub_date,
                        link=link,
                        sentiment_tag=tag
                    ))
    except Exception as e:
        # Fallback if network or parsing fails
        pass

    # Normalize score between -1.0 and 1.0
    total_articles = len(news_items)
    if total_articles > 0:
        normalized_score = max(-1.0, min(1.0, total_score / (total_articles * 1.5)))
    else:
        normalized_score = 0.0

    if normalized_score >= 0.15:
        label = "Bullish / Positive"
    elif normalized_score <= -0.15:
        label = "Bearish / Negative"
    else:
        label = "Neutral / Mixed"

    if not drivers and news_items:
        drivers.append(f"Recent coverage: {news_items[0].title}")

    return SentimentData(
        score=round(normalized_score, 2),
        sentiment_label=label,
        positive_count=pos_count,
        negative_count=neg_count,
        neutral_count=neut_count,
        headlines=news_items,
        key_drivers=drivers
    )
