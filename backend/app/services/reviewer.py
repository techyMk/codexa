import time

from app.core.logging import get_logger
from app.db.supabase import log_review
from app.services.ai.router import AIRouter
from app.services.github import (
    fetch_pr_diff,
    post_pr_comment,
    render_review_comment,
)

log = get_logger(__name__)


_router: AIRouter | None = None


def _get_router() -> AIRouter:
    global _router
    if _router is None:
        _router = AIRouter()
    return _router


async def review_pr(
    *,
    installation_id: int,
    repo: str,
    pr_number: int,
    title: str,
    body: str,
) -> None:
    started = time.perf_counter()
    log.info("review_started", repo=repo, pr=pr_number)

    try:
        diff = await fetch_pr_diff(
            installation_id=installation_id, repo=repo, pr_number=pr_number
        )
    except Exception as e:
        log.exception("fetch_diff_failed")
        log_review(
            repo=repo,
            pr_number=pr_number,
            installation_id=installation_id,
            provider="-",
            status="failed",
            error=f"fetch_diff: {e}",
        )
        return

    if not diff.strip():
        log.info("review_skipped_empty_diff", repo=repo, pr=pr_number)
        return

    try:
        result = await _get_router().review(title=title, body=body, diff=diff)
    except Exception as e:
        log.exception("ai_review_failed")
        log_review(
            repo=repo,
            pr_number=pr_number,
            installation_id=installation_id,
            provider="-",
            status="failed",
            error=str(e),
        )
        return

    comment = render_review_comment(result)
    try:
        await post_pr_comment(
            installation_id=installation_id,
            repo=repo,
            pr_number=pr_number,
            body=comment,
        )
    except Exception as e:
        log.exception("post_comment_failed")
        log_review(
            repo=repo,
            pr_number=pr_number,
            installation_id=installation_id,
            provider=result.provider,
            status="failed",
            summary=result.summary,
            findings_count=len(result.findings),
            error=f"post_comment: {e}",
        )
        return

    duration_ms = int((time.perf_counter() - started) * 1000)
    log_review(
        repo=repo,
        pr_number=pr_number,
        installation_id=installation_id,
        provider=result.provider,
        status="completed",
        summary=result.summary,
        findings_count=len(result.findings),
        duration_ms=duration_ms,
    )
    log.info(
        "review_completed",
        repo=repo,
        pr=pr_number,
        provider=result.provider,
        findings=len(result.findings),
        duration_ms=duration_ms,
    )
