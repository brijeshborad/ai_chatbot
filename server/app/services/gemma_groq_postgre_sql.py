import os
from datetime import datetime
import requests
from fastapi import HTTPException
import json
from groq import AsyncGroq
from app.db import Base, Chat, engine, SessionLocal
from app.system_prompt import system_prompt as sp
# Note: Removed the sqlite3 and ollama imports as they're no longer needed

class GemmaBOT:
    def __init__(self, model="gemma2-9b-it"):
        self.model = model
        # Ensure tables are created (this can be called once, e.g., in app startup)
        Base.metadata.create_all(bind=engine)

        self.system_prompt = {
            "role": "system",
            "content": sp
        }

    async def generate_response(self, query: str,user_id:str):
        try:
            #user_id = '123'
            # Fetch past history using SQLAlchemy
            with SessionLocal() as session:
                chats = session.query(Chat).filter(Chat.user_id == user_id).order_by(Chat.timestamp).all()
                history = [{"role": c.role, "content": c.content} for c in chats]

            # Build messages
            messages = [self.system_prompt] + history + [{"role": "user", "content": query}]

            # Initialize async Groq client
            client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

            chat_completion = await client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                top_p=0.1,
                max_tokens=1024  # Equivalent to num_predict; top_k not directly supported in Groq API
            )

            reply = chat_completion.choices[0].message.content

            # Log user + assistant messages
            timestamp = datetime.now().isoformat()
            with SessionLocal() as session:
                session.add(Chat(user_id=user_id, timestamp=timestamp, role="user", content=query))
                session.add(Chat(user_id=user_id, timestamp=timestamp, role="assistant", content=reply))
                session.commit()

            return reply
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")