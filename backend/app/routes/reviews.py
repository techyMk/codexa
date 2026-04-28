from fastapi import APIRouter, HTTPException, Query

from app.db.supabase import supabase

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("")
async def list_reviews(
    limit: int = Query(default=50, ge=1, le=200),
    repo: str | None = None,
):
    """Recent review records — used by the dashboard."""
    try:
        q = supabase().table("reviews").select("*").order("created_at", desc=True).limit(limit)
        if repo:
            q = q.eq("repo", repo)
        result = q.execute()
        return {"reviews": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
async def stats():
    """Aggregate counters for the dashboard hero cards."""
    try:
        rows = supabase().table("reviews").select("status,findings_count,duration_ms").execute().data
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
