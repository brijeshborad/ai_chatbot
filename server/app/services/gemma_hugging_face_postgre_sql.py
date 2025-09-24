import os
from datetime import datetime
import requests
from fastapi import HTTPException
import json
from groq import AsyncGroq
from app.db import Base, Chat, engine, SessionLocal
from app.system_prompt import system_prompt as sp
import httpx
import logging


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)


class GemmaHuggingFaceBOT:
    def __init__(self):

        self.model = "gemma2-9b-it"
        Base.metadata.create_all(bind=engine)

        self.system_prompt = {
            "role": "system",
            "content": sp
        }

    async def generate_response(self, query: str,user_id:str,llm_call="api"):
        try:

            with SessionLocal() as session:
                chats = session.query(Chat).filter(Chat.user_id == user_id).order_by(Chat.timestamp).all()
                history = [{"role": c.role, "content": c.content} for c in chats]

            messages = [self.system_prompt] + history + [{"role": "user", "content": query}]


            if llm_call == "api":
                
                # Initialize async Groq client
                client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

                chat_completion = await client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.7,
                    top_p=0.1,
                    max_tokens=1024
                )

                reply = chat_completion.choices[0].message.content

            else:

                # Initialize HF                
                payload = {"prompt": messages}
                headers = {"Content-Type": "application/json"}

                async with httpx.AsyncClient(timeout=None) as client:
                    response = await client.post(
                        os.getenv("HUGGING_FACE_SPACE"), 
                        json=payload, 
                        headers=headers
                    )

                    if response.status_code != 200:
                        raise HTTPException(status_code=response.status_code, detail=f"HuggingFace API Error: {response.text}")

                    data = response.json()
                    reply = data.get("bot_response", "").strip()


            timestamp = datetime.now().isoformat()
            with SessionLocal() as session:
                session.add(Chat(user_id=user_id, timestamp=timestamp, role="user", content=query))
                session.add(Chat(user_id=user_id, timestamp=timestamp, role="assistant", content=reply))
                session.commit()

            return reply
        except Exception as e:
            logger.error(f"❌ Error in /generate endpoint:  {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")