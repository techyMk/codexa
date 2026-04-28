from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.auth import CurrentUser, get_current_user
from app.db.supabase import supabase

router = APIRouter(prefix="/reviews", tags=["reviews"])


_EMPTY_STATS = {
    "total_reviews": 0,
    "completed_reviews": 0,
    "findings": 0,
    "avg_duration_ms": 0,
}


@router.get("")
async def list_reviews(
    current_user: CurrentUser = Depends(get_current_user),
    limit: int = Query(default=50, ge=1, le=200),
    repo: str | None = None,
):
    """Recent review records — scoped to the signed-in user's GitHub login."""
    if not current_user.github_login:
        return {"reviews": []}

    try:
        q = (
            supabase()
            .table("reviews")
            .select("*")
            .like("repo", f"{current_user.github_login}/%")
            .order("created_at", desc=True)
            .limit(limit)
        )
        if repo:
            q = q.eq("repo", repo)
        result = q.execute()
        return {"reviews": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
async def stats(current_user: CurrentUser = Depends(get_current_user)):
    """Aggregate counters scoped to the signed-in user."""
    if not current_user.github_login:
        return _EMPTY_STATS

    try:
        rows = (
            supabase()
            .table("reviews")
            .select("status,findings_count,duration_ms")
            .like("repo", f"{current_user.github_login}/%")
            .execute()
            .data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    total = len(rows)
    completed = sum(1 for r in rows if r.get("status") == "completed")
    findings = sum((r.get("findings_count") or 0) for r in rows)
    durations = [r["duration_ms"] for r in rows if r.get("duration_ms")]
    avg_ms = int(sum(durations) / len(durations)) if durations else 0
    return {
        "total_reviews": total,
        "completed_reviews": completed,
        "findings": findings,
        "avg_duration_ms": avg_ms,
    }
