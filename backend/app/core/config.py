import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
DEFAULT_DB_PATH = str(PROJECT_ROOT / "promotix.db").replace("\\", "/")


class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "change-this-to-a-random-secret-key-min-32-chars")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    CORS_ALLOWED_ORIGINS: list[str] = os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://localhost:8000,http://127.0.0.1:5173",
    ).split(",")
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "promotix123")


settings = Settings()
