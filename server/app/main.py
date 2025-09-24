from fastapi import FastAPI, HTTPException
from app.api import chatbot
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Laravel Documentation RAG Chatbot")

origins = [
    "http://localhost:4200",   # Angular dev server
    "http://127.0.0.1:4200",   # Alternate localhost
    "https://your-frontend-domain.com"  # Production domain
]

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,             # 👈 allowed origins
    allow_credentials=True,
    allow_methods=["*"],               # 👈 allow all methods (POST, GET, etc)
    allow_headers=["*"],               # 👈 allow all headers
)

app.include_router(chatbot.router, prefix="/api", tags=["ChatBot"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}