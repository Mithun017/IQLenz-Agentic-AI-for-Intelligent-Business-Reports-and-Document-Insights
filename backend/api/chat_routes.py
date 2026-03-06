from fastapi import APIRouter, Depends
from pydantic import BaseModel
from core.database import get_db
from agents.chat_agent import ask_chat_agent

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_with_docs(request: ChatRequest, db = Depends(get_db)):
    """
    Receive user question, gather DB context (RAG), and query Gemini.
    """
    
    # RAG Step: Retrieve context from MongoDB
    cursor = db.documents.find({"status": "completed"}).sort("created_at", -1).limit(5)
    recent_docs = await cursor.to_list(length=5)
    
    if not recent_docs:
        mock_context = "No documents uploaded yet. Tell the user to upload financial documents first."
    else:
        extracted_bits = [str(doc.get("structured_data", "")) for doc in recent_docs]
        mock_context = "Recent Uploads context:\n" + "\n".join(extracted_bits)
    
    answer = await ask_chat_agent(request.message, mock_context)
    
    return {"reply": answer}
