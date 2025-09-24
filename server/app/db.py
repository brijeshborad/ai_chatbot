from sqlalchemy import Column, Integer, String, Text, Boolean, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import expression
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
import enum


load_dotenv(override=True)


DATABASE_URL = os.getenv("DB_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class ChatStatus(enum.Enum):
    START = "START"
    END = "END"

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True)
    user_id = Column(String)
    timestamp = Column(String)
    role = Column(String)
    content = Column(Text)
    #status = Column(Boolean, server_default=expression.true(), nullable=False)
    status = Column(
        Enum(ChatStatus, name="chat_status"), 
        nullable=False, 
        server_default="START"
    )