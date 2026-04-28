import json
import re
from app.services.ai.base import Finding, ReviewResult


_JSON_BLOCK = re.compile(r"\{[\s\S]*\}")


def parse_review(raw: str, *, provider: str) -> ReviewResult:
    """Best-effort parse of model output into a ReviewResult.

    Models occasionally wrap JSON in ```json fences or add trailing prose,
    so we extract the first {...} block before json.loads.
    """
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:].lstrip()
    match = _JSON_BLOCK.search(text)
    if not match:
        return ReviewResult(
            summary="Codexa could not parse the model response.",
            findings=[],
            provider=provider,
        )

    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError:
        return ReviewResult(
            summary="Codexa received malformed JSON from the model.",
            findings=[],
            provider=provider,
        )

    findings = []
    for f in data.get("findings", []) or []:
        sev = f.get("severity", "info")
        if sev not in ("info", "warn", "error"):
            sev = "info"
        findings.append(
            Finding(
                file=str(f.get("file", "") or ""),
                line=f.get("line"),
                severity=sev,
                message=str(f.get("message", "") or "").strip(),
                suggestion=(f.get("suggestion") or None),
            )
        )

    return ReviewResult(
        summary=str(data.get("summary", "")).strip() or "No summary provided.",
        findings=findings,
        provider=provider,
    )
