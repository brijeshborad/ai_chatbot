from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    email:str