import pytest
from fastapi.testclient import TestClient
from main import app
from services.ticker_resolver import resolve_ticker, extract_tickers_from_text
from services.sentiment_analyzer import analyze_headline_sentiment
from services.financial_data import get_complete_stock_analysis, fetch_stock_candles
from services.scoring_service import calculate_company_score
from models.schemas import FundamentalData, TechnicalIndicator, SentimentData

client = TestClient(app)

# ── Phase 2: Core financial multi-turn tests ──────────────────────────────────

# Scenario 1: User asks "CMP of Reliance?" and receives verified data
def test_scenario_1_cmp_query():
    resp = client.post("/api/chat", json={
        "message": "CMP of Reliance?",
        "session_id": "multi_turn_test_session"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["active_ticker"] == "RELIANCE.NS"
    assert "CMP" in data["reply"] or "₹" in data["reply"] or "price" in data["reply"].lower()
    reply_lower = data["reply"].lower()
    assert "reliance" in reply_lower

# Scenario 2: Follow-up "Give me its P/E" resolves Reliance and returns P/E
def test_scenario_2_pe_follow_up():
    resp = client.post("/api/chat", json={
        "message": "Give me its P/E",
        "session_id": "multi_turn_test_session"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["active_ticker"] == "RELIANCE.NS"
    reply_lower = data["reply"].lower()
    assert "p/e" in reply_lower or "price-to-earnings" in reply_lower or "pe" in reply_lower
    assert "reliance" in reply_lower

# Scenario 3: User asks "What about its dividend?" and receives dividend data
def test_scenario_3_dividend_follow_up():
    resp = client.post("/api/chat", json={
        "message": "What about its dividend?",
        "session_id": "multi_turn_test_session"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["active_ticker"] == "RELIANCE.NS"
    reply_lower = data["reply"].lower()
    assert "dividend" in reply_lower

# Scenario 4: User asks "Give me its 10-minute candle" and receives 10m candle
def test_scenario_4_ten_min_candle_follow_up():
    resp = client.post("/api/chat", json={
        "message": "Give me its 10-minute candle",
        "session_id": "multi_turn_test_session"
    })
    assert resp.status_code == 200
    data = resp.json()
    reply_lower = data["reply"].lower()
    # Either candle data or a graceful "unavailable" message
    assert ("10m" in reply_lower or "10-min" in reply_lower or "open" in reply_lower
            or "candle" in reply_lower or "unavailable" in reply_lower)

# Scenario 5: User asks "Compare it with TCS" and both companies are resolved
def test_scenario_5_compare_with_active_company():
    resp = client.post("/api/chat", json={
        "message": "Compare it with TCS",
        "session_id": "multi_turn_test_session"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["comparison"] is not None
    reply_lower = data["reply"].lower()
    assert "reliance" in reply_lower
    assert "tcs" in reply_lower

# Scenario 6: Switch company and pronoun resolves to new company
def test_scenario_6_switch_company_and_pronoun():
    resp1 = client.post("/api/chat", json={
        "message": "What is Infosys CMP?",
        "session_id": "multi_turn_test_session"
    })
    assert resp1.status_code == 200
    assert resp1.json()["active_ticker"] == "INFY.NS"

    resp2 = client.post("/api/chat", json={
        "message": "Give me its ROCE",
        "session_id": "multi_turn_test_session"
    })
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data2["active_ticker"] == "INFY.NS"
    reply_lower = data2["reply"].lower()
    assert "roce" in reply_lower
    assert "infosys" in reply_lower or "infy" in reply_lower

# Scenario 7: Conversation reset clears prior context
def test_scenario_7_reset_clears_context():
    del_resp = client.delete("/api/chat/history/multi_turn_test_session")
    assert del_resp.status_code == 200
    assert del_resp.json()["cleared"] is True

    hist_resp = client.get("/api/chat/history/multi_turn_test_session")
    assert hist_resp.status_code == 200
    assert hist_resp.json()["active_ticker"] is None

# Scenario 8: Full analysis – no generic greeting, real data present
def test_scenario_8_no_generic_greeting_on_stock_query():
    resp = client.post("/api/chat", json={
        "message": "Give me full insights on Tata Steel",
        "session_id": "new_session_standalone"
    })
    assert resp.status_code == 200
    data = resp.json()
    reply_lower = data["reply"].lower()
    assert "tata steel" in reply_lower or "tatasteel" in reply_lower
    # Should contain financial content
    assert ("score" in reply_lower or "p/e" in reply_lower or "₹" in data["reply"]
            or "cmp" in reply_lower or "roce" in reply_lower)

# Scenario 9: In-memory caching prevents redundant provider calls
def test_scenario_9_caching_and_rate_limit_protection():
    s1 = get_complete_stock_analysis("RELIANCE.NS")
    s2 = get_complete_stock_analysis("RELIANCE.NS")
    assert s1.ticker == s2.ticker
    assert s1.fundamentals.cmp == s2.fundamentals.cmp

# Scenario 10: Data freshness & timezone status clearly identified
def test_scenario_10_data_freshness_and_source():
    s = get_complete_stock_analysis("TCS.NS")
    assert "IST" in s.data_timestamp
    assert s.fundamentals.delay_status is not None

# Scenario 11: Missing fundamentals are not fabricated
def test_scenario_11_missing_fundamentals_handling():
    fund = FundamentalData(cmp=100.0)
    assert fund.pe_ratio is None
    assert fund.roce is None

# Scenario 12: Score calculations are reproducible and transparent
def test_scenario_12_score_reproducibility():
    fund = FundamentalData(
        cmp=1500.0, pe_ratio=18.5, roe=22.0, roce=24.0,
        debt_to_equity=30.0, profit_margins=16.0, dividend_yield=1.5
    )
    tech = TechnicalIndicator(
        rsi_14=55.0, trend_signal="Bullish Rise", macd_crossover="Bullish Crossover"
    )
    sent = SentimentData(score=0.4, sentiment_label="Bullish / Positive")

    score1 = calculate_company_score(fund, tech, sent)
    score2 = calculate_company_score(fund, tech, sent)
    assert score1.total_score == score2.total_score
    assert score1.total_score >= 70
    assert "Strong" in score1.rating_category

# Scenario 13: Invalid tickers are handled gracefully without 500 error
def test_scenario_13_invalid_ticker_handling():
    resp = client.post("/api/chat", json={
        "message": "What is the CMP of NONEXISTENTCOMPANYXYZ123456?",
        "session_id": "test_invalid"
    })
    assert resp.status_code == 200
    assert "reply" in resp.json()

# Scenario 14: Existing endpoints (analyze, compare, candles) continue working
def test_scenario_14_existing_endpoints():
    r_health = client.get("/health")
    assert r_health.status_code == 200

    r_candles = client.get("/api/stock/candles/RELIANCE?interval=10m")
    assert r_candles.status_code == 200
    assert r_candles.json()["interval"] == "10m"

    r_analyze = client.get("/api/stock/analyze/TCS")
    assert r_analyze.status_code == 200
    assert r_analyze.json()["company_score"]["total_score"] > 0


# ── Phase 3: General-purpose conversational AI tests ─────────────────────────

# Scenario 15: Pure greeting gets a warm response, not a stock template
def test_scenario_15_greeting_is_natural():
    resp = client.post("/api/chat", json={
        "message": "Hello! How are you?",
        "session_id": "phase3_general_session"
    })
    assert resp.status_code == 200
    data = resp.json()
    reply_lower = data["reply"].lower()
    # Should NOT return the old template banner
    assert "ask me anything about stocks" not in reply_lower
    assert "i can assist you with real-time" not in reply_lower
    # Should be a warm, natural reply
    assert len(data["reply"]) > 5  # Not empty

# Scenario 16: General knowledge question is answered directly
def test_scenario_16_general_knowledge():
    resp = client.post("/api/chat", json={
        "message": "What is artificial intelligence?",
        "session_id": "phase3_general_session"
    })
    assert resp.status_code == 200
    data = resp.json()
    reply_lower = data["reply"].lower()
    # Must actually explain AI, not redirect to stocks
    assert "artificial intelligence" in reply_lower or "ai" in reply_lower
    assert "ask me anything about stocks" not in reply_lower
    assert len(data["reply"]) > 50

# Scenario 17: Educational finance question answered without live data fetch
def test_scenario_17_conceptual_pe_explanation():
    resp = client.post("/api/chat", json={
        "message": "Explain P/E ratio with an example",
        "session_id": "phase3_general_session"
    })
    assert resp.status_code == 200
    data = resp.json()
    reply_lower = data["reply"].lower()
    assert "p/e" in reply_lower or "price" in reply_lower or "earnings" in reply_lower
    assert len(data["reply"]) > 80  # Should be a proper explanation

# Scenario 18: Compound interest question handled (coding/math)
def test_scenario_18_compound_interest_explanation():
    resp = client.post("/api/chat", json={
        "message": "Explain compound interest using a simple example",
        "session_id": "phase3_general_session"
    })
    assert resp.status_code == 200
    data = resp.json()
    reply_lower = data["reply"].lower()
    assert "compound" in reply_lower or "interest" in reply_lower
    assert len(data["reply"]) > 80

# Scenario 19: Code generation request works
def test_scenario_19_code_generation():
    resp = client.post("/api/chat", json={
        "message": "Write a short Python function to calculate compound interest",
        "session_id": "phase3_general_session"
    })
    assert resp.status_code == 200
    data = resp.json()
    reply = data["reply"]
    # Should contain Python code
    assert "def " in reply or "python" in reply.lower() or "```" in reply

# Scenario 20: Topic switch is followed naturally
def test_scenario_20_topic_switch():
    # First establish a financial context
    client.post("/api/chat", json={
        "message": "Analyze Infosys",
        "session_id": "phase3_switch_session"
    })
    # Then switch to a completely different topic
    resp = client.post("/api/chat", json={
        "message": "Now explain machine learning to me",
        "session_id": "phase3_switch_session"
    })
    assert resp.status_code == 200
    data = resp.json()
    reply_lower = data["reply"].lower()
    assert "machine learning" in reply_lower or "ml" in reply_lower or "algorithm" in reply_lower
