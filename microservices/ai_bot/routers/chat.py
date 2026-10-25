from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, ChatResponse
from services.gemini_service import process_chat
from services.session_manager import session_manager

router = APIRouter(prefix="/api/chat", tags=["Chat & AI Assistant"])

@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Core AI Chatbot endpoint for the InvestIQ website.
    Accepts natural language user questions, optional current company context, 
    and session id for conversational continuity.
    """
    try:
        response = await process_chat(
            message=request.message,
            session_id=request.session_id,
            current_stock=request.current_stock,
            compare_stock=request.compare_stock,
            page_context=request.page_context
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating chat response: {str(e)}")

@router.get("/history/{session_id}")
async def get_history(session_id: str):
    """Retrieves conversation history and active stock for a given session."""
    session = session_manager.get_or_create(session_id)
    return {
        "session_id": session_id,
        "active_ticker": session.active_ticker,
        "active_company": session.active_company_name,
        "messages": session.history
    }

@router.delete("/history/{session_id}")
async def reset_history(session_id: str):
    """Clears conversation history and active company context for a given session."""
    cleared = session_manager.reset_session(session_id)
    return {"session_id": session_id, "cleared": cleared}
