import time
from typing import Any

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.logging import get_logger
from app.core.security import create_app_jwt
from app.services.ai.base import ReviewResult

log = get_logger(__name__)

_API = "https://api.github.com"
_HEADERS_JSON = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}
_HEADERS_DIFF = {
    "Accept": "application/vnd.github.v3.diff",
    "X-GitHub-Api-Version": "2022-11-28",
}


class _TokenCache:
    """Tiny per-installation cache. Tokens last 1 hour; we refresh after 50 min."""

    def __init__(self) -> None:
        self._tokens: dict[int, tuple[str, float]] = {}

    def get(self, installation_id: int) -> str | None:
        entry = self._tokens.get(installation_id)
        if entry and entry[1] > time.time():
            return entry[0]
        return None

    def set(self, installation_id: int, token: str) -> None:
        self._tokens[installation_id] = (token, time.time() + 50 * 60)


_token_cache = _TokenCache()


@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=8))
async def _installation_token(installation_id: int) -> str:
    cached = _token_cache.get(installation_id)
    if cached:
        return cached

    jwt_token = create_app_jwt()
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(
            f"{_API}/app/installations/{installation_id}/access_tokens",
            headers={**_HEADERS_JSON, "Authorization": f"Bearer {jwt_token}"},
        )
        r.raise_for_status()
        token = r.json()["token"]
    _token_cache.set(installation_id, token)
    return token


async def fetch_pr_diff(*, installation_id: int, repo: str, pr_number: int) -> str:
    token = await _installation_token(installation_id)
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(
            f"{_API}/repos/{repo}/pulls/{pr_number}",
            headers={**_HEADERS_DIFF, "Authorization": f"Bearer {token}"},
        )
        r.raise_for_status()
        return r.text


def _severity_emoji(sev: str) -> str:
    return {"error": "🔴", "warn": "🟡", "info": "🔵"}.get(sev, "🔵")


def render_review_comment(result: ReviewResult) -> str:
    lines = [
        "## 🤖 Codexa AI Review",
        "",
        result.summary or "_No summary._",
        "",
    ]
    if not result.findings:
        lines.append("✅ No issues found.")
    else:
        lines.append(f"### Findings ({len(result.findings)})")
        lines.append("")
        for f in result.findings:
            loc = f"`{f.file}`" + (f":{f.line}" if f.line else "")
            lines.append(f"- {_severity_emoji(f.severity)} **{f.severity.upper()}** — {loc}")
            lines.append(f"  - {f.message}")
            if f.suggestion:
                lines.append(f"  - 💡 _Suggestion:_ {f.suggestion}")
        lines.append("")
    lines.append(f"<sub>Reviewed by `{result.provider}` · powered by [Codexa](https://github.com/apps/codexa)</sub>")
    return "\n".join(lines)


async def post_pr_comment(
    *, installation_id: int, repo: str, pr_number: int, body: str
) -> dict[str, Any]:
    token = await _installation_token(installation_id)
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(
            f"{_API}/repos/{repo}/issues/{pr_number}/comments",
            headers={**_HEADERS_JSON, "Authorization": f"Bearer {token}"},
            json={"body": body},
        )
        r.raise_for_status()
        return r.json()
