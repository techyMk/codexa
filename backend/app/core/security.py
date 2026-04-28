import hashlib
import hmac
import time
from typing import Any

import jwt

from app.config import get_settings


def verify_webhook_signature(payload: bytes, signature_header: str | None) -> bool:
    """Validate GitHub's `X-Hub-Signature-256` header against the raw body."""
    if not signature_header or not signature_header.startswith("sha256="):
        return False

    secret = get_settings().github_webhook_secret.encode()
    if not secret:
        return False

    received = signature_header.removeprefix("sha256=")
    expected = hmac.new(secret, payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(received, expected)


def create_app_jwt() -> str:
    """JWT signed with the GitHub App private key — used to mint installation tokens."""
    settings = get_settings()
    now = int(time.time())
    payload: dict[str, Any] = {
        "iat": now - 60,
        "exp": now + 9 * 60,
        "iss": settings.github_app_id,
    }
    return jwt.encode(payload, settings.normalized_private_key, algorithm="RS256")
