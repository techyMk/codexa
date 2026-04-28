from functools import lru_cache
from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    github_app_id: str = Field(default="")
    github_app_client_id: str = Field(default="")
    github_app_client_secret: str = Field(default="")
    github_app_private_key: str = Field(default="")
    github_app_private_key_path: str = Field(default="")
    github_webhook_secret: str = Field(default="")

    gemini_api_key: str = Field(default="")
    groq_api_key: str = Field(default="")

    supabase_url: str = Field(default="")
    supabase_service_role_key: str = Field(default="")

    frontend_url: str = Field(default="http://localhost:3000")
    environment: str = Field(default="development")
    log_level: str = Field(default="INFO")

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

    @property
    def normalized_private_key(self) -> str:
        # Prefer reading the .pem from disk — avoids the \n-escape quagmire.
        if self.github_app_private_key_path:
            return Path(self.github_app_private_key_path).read_text()
        # Fallback: env-var with escaped newlines (e.g. on Render/Vercel where files are awkward).
        return self.github_app_private_key.replace("\\n", "\n")


@lru_cache
def get_settings() -> Settings:
    return Settings()
