from fastapi import Request, HTTPException, status
from app.auth.jwt_handler import decode_token
from app.database import get_db
from app.models.user import User
import os
from dotenv import load_dotenv
from app.auth.ms_entra_jwt import validate_entra_jwt

# Load environment variables
load_dotenv()

MS_ENTRA_CLIENT_ID = os.getenv("MS_ENTRA_CLIENT_ID")
MS_ENTRA_TENANT_ID = os.getenv("MS_ENTRA_TENANT_ID")

# Central set of paths that should skip authentication
PUBLIC_PATHS = {
    "/",  # root path
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/auth/ms-entra/login-url",
    "/api/v1/auth/ms-entra/callback",
    "/docs",
    "/redoc",
    "/openapi.json",
    "/favicon.ico",
    "/healthcheck"
}

async def auth_middleware(request: Request, call_next):
    """Authentication middleware to validate JWT tokens"""

    # Normalise path for matching
    path = request.url.path.rstrip("/").lower() or "/"

    # Skip authentication for public paths, OPTIONS preflights, or static files
    if (
        path in PUBLIC_PATHS
        or request.method.upper() == "OPTIONS"
        or path.startswith("/static/")
    ):
        return await call_next(request)

    # Extract token from Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )

    try:
        token_type, token = auth_header.split(" ")
        if token_type != "Bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )

        # First, try to decode as our own JWT token
        payload = decode_token(token)
        if payload:
            request.state.user_id = payload.get("id")
            request.state.user_role = payload.get("role")
        else:
            # If our JWT decoding failed, validate as Microsoft Entra token
            try:
                claims = validate_entra_jwt(token)
                user_email = (
                    claims.get("preferred_username")
                    or claims.get("upn")
                    or claims.get("email")
                )
                if not user_email:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="User email not found in token"
                    )

                db = next(get_db())
                user = db.query(User).filter(User.email == user_email).first()
                if not user:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="User not found in database"
                    )

                request.state.user_id = str(user.id)
                request.state.user_role = user.role
            except HTTPException:
                raise
            except Exception:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token"
                )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    return await call_next(request)