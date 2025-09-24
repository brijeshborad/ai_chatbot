from fastapi import APIRouter, HTTPException
import logging
from app.models.chatbot import ChatRequest
from app.services.gemma_groq_postgre_sql import GemmaBOT
from app.services.gemma_hugging_face_postgre_sql import GemmaHuggingFaceBOT
from app.services.chat import Chat
import logging


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

router = APIRouter()
#gemmaBOT = GemmaBOT()
gemmaHuggingFaceBOT = GemmaHuggingFaceBOT()
chatDB = Chat()


@router.post("/generate")
async def chat(request: ChatRequest):
    """Handle batch queries and return responses."""
    try:        
        
        result = await gemmaHuggingFaceBOT.generate_response(request.message,request.email,"api")
        return {
            "bot_response": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/hf-generate")
async def chat(request: ChatRequest):
    """Handle batch queries and return responses."""
    try:        
        
        result = await gemmaHuggingFaceBOT.generate_response(request.message,request.email,"hf")
        return {
            "bot_response": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chats/{email}")
async def get_chats(email: str):
    """Fetch chat history for a given email."""
    try:
        return await chatDB.get_chats(email)
    except Exception as e:
        logger.error(f"❌ Error in /chats endpoint:  {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/chats/{email}/end")
async def update_chats(email: str):
    """Fetch chat history for a given email."""
    try:
        return await chatDB.update_status_to_end(email)
    except Exception as e:
        logger.error(f"❌ Error in /chats endpoint:  {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))