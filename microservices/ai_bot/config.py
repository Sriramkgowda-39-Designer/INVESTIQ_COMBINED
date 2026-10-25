import os
from typing import List
from dotenv import load_dotenv

# Load .env file from the current directory
load_dotenv(override=True)

class Settings:
    # ── Groq (primary LLM provider) ───────────────────────────────────────
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "").strip()
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b").strip()

    # ── Gemini (kept for reference, not used for chat) ────────────────────
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.8-flash").strip()

    # ── Server ────────────────────────────────────────────────────────────
    HOST: str = os.getenv("HOST", "0.0.0.0").strip()
    PORT: int = int(os.getenv("PORT", "8002"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development").strip()

    # Parse CORS origins
    _cors_raw: str = os.getenv("CORS_ORIGINS", "*")
    if _cors_raw == "*":
        CORS_ORIGINS: List[str] = ["*"]
    else:
        CORS_ORIGINS: List[str] = [origin.strip() for origin in _cors_raw.split(",") if origin.strip()]

settings = Settings()
