"""Verify Supabase-issued JWTs from the Authorization header.

Supabase exposes a JWKS endpoint at `{SUPABASE_URL}/auth/v1/.well-known/jwks.json`
for projects using asymmetric (RS256/ES256) signing — the modern default.

Older projects use HS256 with a shared secret, configured via SUPABASE_JWT_SECRET.

We try JWKS first, fall back to HS256, raise 401 otherwise.
"""

from functools import lru_cache
from typing import Any

import jwt
from fastapi import Header, HTTPException, status
from jwt import PyJWKClient
from pydantic import BaseModel

from app.config import get_settings
from app.core.logging import get_logger

log = get_logger(__name__)


class CurrentUser(BaseModel):
    id: str
    email: str | None = None
    github_login: str | None = None


@lru_cache
def _jwks_client() -> PyJWKClient:
    settings = get_settings()
    if not settings.supabase_url:
        raise RuntimeError("SUPABASE_URL not set — cannot verify JWTs")
    return PyJWKClient(
        f"{settings.supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json",
        cache_keys=True,
        lifespan=3600,
    )


def _decode_with_jwks(token: str) -> dict[str, Any]:
    signing_key = _jwks_client().get_signing_key_from_jwt(token)
    return jwt.decode(
        token,
        signing_key.key,
        algorithms=["RS256", "ES256"],
        audience="authenticated",
        options={"verify_aud": True, "verify_exp": True},
    )


def _decode_with_hs256(token: str, secret: str) -> dict[str, Any]:
    return jwt.decode(
        token,
        secret,
        algorithms=["HS256"],
        audience="authenticated",
        options={"verify_aud": True, "verify_exp": True},
    )


async def get_current_user(
    authorization: str | None = Header(default=None),
) -> CurrentUser:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="missing bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.split(None, 1)[1].strip()
    settings = get_settings()

    # Try asymmetric first (modern Supabase default)
    payload: dict[str, Any] | None = None
    jwks_error: Exception | None = None
    try:
        payload = _decode_with_jwks(token)
    except Exception as e:
        jwks_error = e

    # Fall back to HS256 if shared secret is configured
    if payload is None and settings.supabase_jwt_secret:
        try:
            payload = _decode_with_hs256(token, settings.supabase_jwt_secret)
        except Exception as e:
            log.warning("jwt_hs256_failed", error=str(e), jwks_error=str(jwks_error))

    if payload is None:
        log.warning("jwt_verify_failed", error=str(jwks_error))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=401, detail="token missing subject")

    user_meta = payload.get("user_metadata") or {}
    github_login = (
        user_meta.get("user_name")
        or user_meta.get("preferred_username")
        or None
    )

    return CurrentUser(
        id=str(sub),
        email=payload.get("email"),
        github_login=github_login,
    )
