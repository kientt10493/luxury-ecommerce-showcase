from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Luxury E-Commerce Showcase API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "luxury-super-secret-key-change-in-prod-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    DATABASE_URL: str = "sqlite:///./showcase.db"
    
    # Payments
    STRIPE_API_KEY: str = "sk_test_placeholder"
    STRIPE_WEBHOOK_SECRET: str = "whsec_placeholder"
    PAYOS_CLIENT_ID: str = "payos_client_id_placeholder"
    PAYOS_API_KEY: str = "payos_api_key_placeholder"
    PAYOS_CHECKSUM_KEY: str = "payos_checksum_key_placeholder"
    
    FRONTEND_URL: str = "http://localhost:5173"

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", extra="ignore")

settings = Settings()
