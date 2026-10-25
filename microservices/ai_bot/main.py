import datetime
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

from config import settings
from routers.chat import router as chat_router
from routers.stock import router as stock_router

app = FastAPI(
    title="InvestIQ AI Financial Co-Pilot API",
    description="Intelligent AI backend for the InvestIQ Stock Market platform. Powers conversational analytics, real-time fundamentals, technical indicator calculations (5m/10m/15m candles), news sentiment scoring, and company comparisons.",
    version="1.0.0"
)

# CORS setup for seamless connection with React/Vue/Next.js/Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(chat_router)
app.include_router(stock_router)

# Mount static folder for developer testing interface
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/health", tags=["Health & Status"])
def health_check():
    """Health check endpoint to verify backend status and LLM configuration."""
    is_groq_set = bool(settings.GROQ_API_KEY and settings.GROQ_API_KEY != "your_groq_api_key_here")
    is_gemini_set = bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here")
    return {
        "status": "healthy",
        "service": "InvestIQ AI Co-Pilot",
        "environment": settings.ENVIRONMENT,
        "provider": "groq",
        "groq_active": is_groq_set,
        "groq_model": settings.GROQ_MODEL,
        "gemini_active": is_gemini_set,
        "gemini_model": settings.GEMINI_MODEL,
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

@app.get("/", response_class=HTMLResponse, tags=["Test UI"])
def get_index():
    """Serves the interactive developer testing web interface."""
    index_file = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return HTMLResponse("<h1>InvestIQ AI Bot Backend Running. Visit <a href='/docs'>/docs</a> for API Documentation.</h1>")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
