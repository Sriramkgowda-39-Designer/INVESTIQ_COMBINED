import re
import uuid
from typing import Dict, List, Optional, Any
from models.schemas import StockAnalysisSummary

class SessionState:
    def __init__(self, session_id: str):
        self.session_id: str = session_id
        self.history: List[Dict[str, str]] = []
        self.active_ticker: Optional[str] = None
        self.active_company_name: Optional[str] = None
        self.active_timeframe: str = "15m"
        self.last_analysis: Optional[StockAnalysisSummary] = None

class SessionManager:
    def __init__(self, max_history: int = 12):
        self._sessions: Dict[str, SessionState] = {}
        self.max_history: int = max_history

    def get_or_create(self, session_id: Optional[str]) -> SessionState:
        if not session_id or session_id.strip() == "":
            session_id = str(uuid.uuid4())
        if session_id not in self._sessions:
            self._sessions[session_id] = SessionState(session_id)
        return self._sessions[session_id]

    def reset_session(self, session_id: str) -> bool:
        if session_id in self._sessions:
            del self._sessions[session_id]
            return True
        return False

    def add_message(self, session_id: str, role: str, content: str):
        session = self.get_or_create(session_id)
        session.history.append({"role": role, "content": content})
        if len(session.history) > self.max_history:
            session.history = session.history[-self.max_history:]

    def set_active_company(self, session_id: str, ticker: str, company_name: str, analysis: Optional[StockAnalysisSummary] = None):
        session = self.get_or_create(session_id)
        session.active_ticker = ticker
        session.active_company_name = company_name
        if analysis:
            session.last_analysis = analysis

    def has_pronoun_reference(self, text: str) -> bool:
        """Checks if user query contains pronouns or contextual references to prior stock."""
        lower = text.lower().strip()
        pronoun_patterns = [
            r"\bit\b", r"\bits\b", r"\bthat\b", r"\bthis\b",
            r"\bthe company\b", r"\bthis company\b", r"\bthat company\b",
            r"\bthe stock\b", r"\bthis stock\b", r"\bthat stock\b",
            r"\bprevious\b", r"\bthe former\b", r"\bsame\b"
        ]
        return any(re.search(pat, lower) for pat in pronoun_patterns)

session_manager = SessionManager()
