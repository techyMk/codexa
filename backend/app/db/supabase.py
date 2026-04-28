from functools import lru_cache
from supabase import create_client, Client
from app.config import get_settings


@lru_cache
def supabase() -> Client:
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def log_review(
    *,
    repo: str,
    pr_number: int,
    installation_id: int,
    provider: str,
    status: str,
    summary: str | None = None,
    findings_count: int = 0,
    duration_ms: int | None = None,
    error: str | None = None,
) -> None:
    """Insert a review row. Silent on failure — logging must never break webhook handling."""
    try:
        supabase().table("reviews").insert(
            {
                "repo": repo,
                "pr_number": pr_number,
                "installation_id": installation_id,
                "provider": provider,
                "status": status,
                "summary": summary,
                "findings_count": findings_count,
                "duration_ms": duration_ms,
                "error": error,
            }
        ).execute()
    except Exception:
        from app.core.logging import get_logger
        get_logger(__name__).exception("supabase_log_failed")
