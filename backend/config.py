import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

load_dotenv()

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "NIRVAHA Autonomous Supply Chain Recovery Engine"
    DEBUG: bool = True
    DATABASE_URL: str = "sqlite:///./nirvaha.db"
    
    # LLM Settings
    DEFAULT_LLM_PROVIDER: str = "groq"  # "ollama", "gemini", "groq"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY")
    GROQ_MODEL: str = "qwen/qwen3.8-27b"
    
    # Optimization Objective Weights (default balanced)
    WEIGHT_COST: float = 0.30
    WEIGHT_DELAY: float = 0.25
    WEIGHT_CARBON: float = 0.15
    WEIGHT_SLA: float = 0.20
    WEIGHT_RISK: float = 0.10

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
