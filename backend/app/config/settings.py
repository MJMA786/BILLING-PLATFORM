from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Global application settings for Subly.
    Values are loaded automatically from the .env file.
    """

    # ==========================================
    # Database
    # ==========================================

    DATABASE_URL: str

    # ==========================================
    # JWT Authentication
    # ==========================================

    SECRET_KEY: str
    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    JWT_ISSUER: str = "Subly"
    JWT_AUDIENCE: str = "Subly Users"

    # ==========================================
    # Google OAuth
    # ==========================================

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str

    # ==========================================
    # Email
    # ==========================================

    SMTP_HOST: str
    SMTP_PORT: int

    SMTP_USERNAME: str
    SMTP_PASSWORD: str

    SMTP_FROM_EMAIL: str

    # ==========================================
    # Frontend
    # ==========================================

    FRONTEND_URL: str = "http://localhost:5173"

    # ==========================================
    # Environment
    # ==========================================

    ENVIRONMENT: str = "development"

    DEBUG: bool = True

    # ==========================================
    # Pydantic Configuration
    # ==========================================

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=True,
    )


settings = Settings()