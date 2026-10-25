"""
InvestIQ Microservice API Gateway & Unified Orchestrator
Coordinates and routes traffic between:
  - Microservice 1 (Port 8001): Market Dashboard & ML Lab (MAINDASHBOARD)
  - Microservice 2 (Port 5001): Stock Clash & Comparison Engine (Invest-IQ)
  - Microservice 3 (Port 8002): Groq 120B AI Market Assistant (AiBOT)
  - Master Gateway (Port 8000): Unified Single-Portal Interface + API Gateway
"""
import os
import json
import time
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any

import httpx
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Microservices Network Topology
MARKET_CORE_URL = os.environ.get("MARKET_CORE_URL", "http://127.0.0.1:8001")
FINCLASH_URL = os.environ.get("FINCLASH_URL", "http://127.0.0.1:5001")
AIBOT_URL = os.environ.get("AIBOT_URL", "http://127.0.0.1:8002")
GATEWAY_PORT = int(os.environ.get("PORT", "8000"))
GATEWAY_HOST = os.environ.get("HOST", "0.0.0.0")

ROOT_DIR = Path(__file__).resolve().parent
STATIC_DIR = ROOT_DIR / "static"
DATA_DIR = ROOT_DIR / "data"
GLOSSARY_FILE = DATA_DIR / "financial_glossary.json"

app = FastAPI(
    title="InvestIQ Unified Microservice Gateway",
    description="Microservice orchestrator unifying Market Lab & ML, Stock Clash Duel, and Groq AI Assistant",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Helper proxy client
async def _proxy_request(target_url: str, request: Request, method: Optional[str] = None) -> Response:
    """Forwards incoming client requests directly to target microservice."""
    client_method = method or request.method
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("content-length", None)

    body = await request.body()
    params = dict(request.query_params)

    async with httpx.AsyncClient(timeout=35.0) as client:
        try:
            resp = await client.request(
                method=client_method,
                url=target_url,
                headers=headers,
                params=params,
                content=body if body else None
            )
            return Response(
                content=resp.content,
                status_code=resp.status_code,
                headers=dict(resp.headers)
            )
        except httpx.ConnectError:
            raise HTTPException(
                status_code=503,
                detail=f"Downstream microservice at {target_url} is unavailable or starting up."
            )
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"Proxy error: {str(exc)}")

# ── Health & Diagnostics ──────────────────────────────────────────────────────

@app.get("/health", tags=["Gateway Diagnostics"])
async def gateway_health():
    return {
        "status": "healthy",
        "gateway": "InvestIQ Microservice API Gateway",
        "port": GATEWAY_PORT,
        "services": {
            "market_core": MARKET_CORE_URL,
            "finclash_comparison": FINCLASH_URL,
            "aibot_assistant": AIBOT_URL
        },
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

@app.get("/api/services/status", tags=["Gateway Diagnostics"])
async def check_all_services():
    """Concurrently pings all 3 microservices and reports their status & latencies."""
    services = [
        {"id": "market_core", "name": "Market Lab & ML Predictor", "url": f"{MARKET_CORE_URL}/api/status", "port": 8001},
        {"id": "finclash", "name": "Stock Clash Duel Engine", "url": f"{FINCLASH_URL}/api/stocks/popular-duels", "port": 5001},
        {"id": "aibot", "name": "InvestIQ AI Co-Pilot (Groq)", "url": f"{AIBOT_URL}/health", "port": 8002}
    ]

    results = {}
    async with httpx.AsyncClient(timeout=4.0) as client:
        for svc in services:
            start_t = time.perf_counter()
            try:
                resp = await client.get(svc["url"])
                elapsed_ms = round((time.perf_counter() - start_t) * 1000, 1)
                results[svc["id"]] = {
                    "name": svc["name"],
                    "port": svc["port"],
                    "active": resp.status_code == 200,
                    "status_code": resp.status_code,
                    "latency_ms": elapsed_ms,
                    "url": svc["url"]
                }
            except Exception as e:
                results[svc["id"]] = {
                    "name": svc["name"],
                    "port": svc["port"],
                    "active": False,
                    "status_code": 0,
                    "latency_ms": 0,
                    "error": str(e)
                }

    all_online = all(s.get("active", False) for s in results.values())
    return {
        "gateway_active": True,
        "all_services_online": all_online,
        "services": results,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

# ── Financial Glossary API ───────────────────────────────────────────────────

@app.get("/api/glossary", tags=["Financial Glossary"])
def get_glossary():
    """Serves the universal financial glossary for interactive hover tooltips."""
    if GLOSSARY_FILE.exists():
        try:
            return json.loads(GLOSSARY_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}

# ── Routing to Microservice 1: MAINDASHBOARD (Port 8001) ──────────────────────

@app.get("/api/market/status")
@app.get("/api/status")
async def market_status(request: Request):
    return await _proxy_request(f"{MARKET_CORE_URL}/api/status", request)

@app.get("/api/market/chart")
@app.get("/api/chart")
async def market_chart(request: Request):
    return await _proxy_request(f"{MARKET_CORE_URL}/api/chart", request)

@app.get("/api/market/series")
@app.get("/api/series")
async def market_series(request: Request):
    return await _proxy_request(f"{MARKET_CORE_URL}/api/series", request)

@app.get("/api/market/history")
@app.get("/api/history")
async def market_history(request: Request):
    return await _proxy_request(f"{MARKET_CORE_URL}/api/history", request)

@app.post("/api/market/predict")
@app.post("/api/predict")
async def market_predict(request: Request):
    return await _proxy_request(f"{MARKET_CORE_URL}/api/predict", request)

@app.post("/api/market/start")
async def market_start_feed(request: Request):
    return await _proxy_request(f"{MARKET_CORE_URL}/api/market/start", request)

@app.post("/api/market/stop")
async def market_stop_feed(request: Request):
    return await _proxy_request(f"{MARKET_CORE_URL}/api/market/stop", request)

@app.post("/api/market/upload")
async def market_upload(request: Request):
    return await _proxy_request(f"{MARKET_CORE_URL}/api/upload", request)

# ── Routing to Microservice 2: Invest-IQ / FinClash (Port 5001) ───────────────

@app.get("/api/stocks/popular-duels")
async def stocks_popular_duels(request: Request):
    return await _proxy_request(f"{FINCLASH_URL}/api/stocks/popular-duels", request)

@app.get("/api/stocks/compare")
@app.get("/api/compare")
async def stocks_compare(request: Request):
    return await _proxy_request(f"{FINCLASH_URL}/api/stocks/compare", request)

@app.get("/api/stocks")
async def list_stocks(request: Request):
    return await _proxy_request(f"{FINCLASH_URL}/api/stocks", request)

@app.get("/api/stocks/{symbol}")
async def get_single_stock(symbol: str, request: Request):
    return await _proxy_request(f"{FINCLASH_URL}/api/stocks/{symbol}", request)

# ── Routing to Microservice 3: AiBOT (Port 8002) ──────────────────────────────

@app.post("/api/chat")
async def bot_chat(request: Request):
    return await _proxy_request(f"{AIBOT_URL}/api/chat", request)

@app.get("/api/chat/history/{session_id}")
async def bot_chat_history(session_id: str, request: Request):
    return await _proxy_request(f"{AIBOT_URL}/api/chat/history/{session_id}", request)

@app.delete("/api/chat/history/{session_id}")
async def bot_clear_history(session_id: str, request: Request):
    return await _proxy_request(f"{AIBOT_URL}/api/chat/history/{session_id}", request)

@app.get("/api/stock/analyze/{ticker}")
async def bot_stock_analyze(ticker: str, request: Request):
    return await _proxy_request(f"{AIBOT_URL}/api/stock/analyze/{ticker}", request)

@app.get("/api/stock/candles/{ticker}")
async def bot_stock_candles(ticker: str, request: Request):
    return await _proxy_request(f"{AIBOT_URL}/api/stock/candles/{ticker}", request)

@app.get("/api/stock/compare/{ticker_a}/{ticker_b}")
async def bot_stock_compare(ticker_a: str, ticker_b: str, request: Request):
    return await _proxy_request(f"{AIBOT_URL}/api/stock/compare/{ticker_a}/{ticker_b}", request)

# ── Unified Master Portal Single Page Interface ──────────────────────────────

@app.get("/", response_class=HTMLResponse, tags=["Master Interface"])
@app.head("/", response_class=HTMLResponse, tags=["Master Interface"])
@app.get("/index.html", response_class=HTMLResponse, tags=["Master Interface"])
def master_portal():
    portal_html_path = STATIC_DIR / "portal.html"
    if portal_html_path.exists():
        response = FileResponse(str(portal_html_path))
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return response
    return HTMLResponse("<h1>InvestIQ Unified Gateway Active</h1>")

if __name__ == "__main__":
    import uvicorn
    print(f"🚀 InvestIQ Gateway starting on http://{GATEWAY_HOST}:{GATEWAY_PORT}")
    uvicorn.run("gateway:app", host=GATEWAY_HOST, port=GATEWAY_PORT, reload=True)
