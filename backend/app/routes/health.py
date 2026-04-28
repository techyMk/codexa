from fastapi import APIRouter
from app.config import get_settings

router = APIRouter(tags=["health"])


@router.get("/")
async def root() -> dict[str, str]:
    return {"service": "codexa", "status": "ok"}


@router.get("/healthz")
async def healthz() -> dict[str, object]:
    s = get_settings()
    return {
        "status": "ok",
        "environment": s.environment,
        "providers": {
            "gemini": bool(s.gemini_api_key),
            "groq": bool(s.groq_api_key),
        },
        "github_app_configured": bool(s.github_app_id and s.github_app_private_key),
    }
