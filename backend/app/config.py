import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:8000")
    CORS_ORIGINS_RAW: str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173")
    
    # Supabase settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # Similarity Weights (PRD FR-5)
    WEIGHT_TEXT: float = float(os.getenv("WEIGHT_TEXT", "0.70"))
    WEIGHT_CATEGORY: float = float(os.getenv("WEIGHT_CATEGORY", "0.20"))
    WEIGHT_SUBCATEGORY: float = float(os.getenv("WEIGHT_SUBCATEGORY", "0.05"))
    WEIGHT_NEIGHBORHOOD: float = float(os.getenv("WEIGHT_NEIGHBORHOOD", "0.05"))

    @property
    def CORS_ORIGINS(self) -> list[str]:
        if not self.CORS_ORIGINS_RAW:
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS_RAW.split(",") if origin.strip()]

settings = Settings()
