import os
from datetime import datetime
import requests
from fastapi import HTTPException
import json
from groq import AsyncGroq
from app.db import Base, Chat as ChatModel, engine, SessionLocal
import httpx
import logging
from sqlalchemy import update


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)


class Chat:

    def __init__(self):
        Base.metadata.create_all(bind=engine)

    async def get_chats(self, email):
        try:

            with SessionLocal() as session:
                chats = session.query(ChatModel).filter(
                    ChatModel.user_id == email,
                    ChatModel.status == "START"
                    ).order_by(ChatModel.timestamp).all()
                history = [
                    {
                        "role": c.role,
                        "content": c.content,
                        "timestamp": c.timestamp
                    }
                    for c in chats
                ]

            return {"email": email, "history": history}

        except Exception as e:
            logger.error(f"❌ Error in /get_chats endpoint:  {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"❌ Error in /get_chats endpoint: {str(e)}")


    async def update_status_to_end(self,email: str):

        with SessionLocal() as session:
            stmt = (
                update(ChatModel)
                .where(ChatModel.user_id == email)
                .values(status="END")
            )
            session.execute(stmt)
            session.commit()
            return {"message": f"Status updated to END for {email}"}