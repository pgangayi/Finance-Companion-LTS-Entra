import os
import json
import requests
from jose import jwt
from jose.utils import base64url_decode
from typing import Dict, Any
from datetime import datetime, timezone

# Environment configuration
MS_ENTRA_TENANT_ID = os.getenv("MS_ENTRA_TENANT_ID")
MS_ENTRA_CLIENT_ID = os.getenv("MS_ENTRA_CLIENT_ID")

_JWKS_CACHE: Dict[str, Any] = {"keys": [], "fetched_at": None}


def _get_jwks_url() -> str:
    # Using v2.0 endpoint supports both v1 and v2 tokens
    return f"https://login.microsoftonline.com/{MS_ENTRA_TENANT_ID}/discovery/v2.0/keys"


def _fetch_jwks() -> Dict[str, Any]:
    global _JWKS_CACHE
    now = datetime.now(timezone.utc)
    # Simple 10 minute cache
    if _JWKS_CACHE["keys"] and _JWKS_CACHE["fetched_at"] and (now - _JWKS_CACHE["fetched_at"]).total_seconds() < 600:
        return {"keys": _JWKS_CACHE["keys"]}
    resp = requests.get(_get_jwks_url(), timeout=5)
    resp.raise_for_status()
    data = resp.json()
    _JWKS_CACHE = {"keys": data.get("keys", []), "fetched_at": now}
    return {"keys": _JWKS_CACHE["keys"]}


def _get_signing_key(kid: str) -> Dict[str, Any]:
    jwks = _fetch_jwks()
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return key
    # refetch once in case of rotation
    jwks = _fetch_jwks()
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return key
    raise ValueError("Signing key not found for kid")


def validate_entra_jwt(token: str) -> Dict[str, Any]:
    """Validate a Microsoft Entra access or id token using JWKS.

    Returns decoded claims if valid. Raises ValueError on failure.
    """
    try:
        headers = jwt.get_unverified_header(token)
    except Exception:
        raise ValueError("Invalid JWT header")

    kid = headers.get("kid")
    if not kid:
        raise ValueError("Missing kid in token header")

    signing_key = _get_signing_key(kid)

    issuer = f"https://login.microsoftonline.com/{MS_ENTRA_TENANT_ID}/v2.0"
    audience = MS_ENTRA_CLIENT_ID

    try:
        claims = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            audience=audience,
            issuer=issuer,
            options={
                "verify_aud": True,
                "verify_iss": True,
                "verify_signature": True,
                "verify_exp": True,
            },
        )
        return claims
    except Exception as exc:
        raise ValueError(f"Token validation failed: {exc}")


