from fastapi import Request, HTTPException, status
from app.auth.jwt_handler import decode_token
from app.database import get_db
from app.models.user import User
from sqlalchemy.orm import Session
import msal
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Microsoft Entra configuration
MS_ENTRA_CLIENT_ID = os.getenv("MS_ENTRA_CLIENT_ID")
MS_ENTRA_CLIENT_SECRET = os.getenv("MS_ENTRA_CLIENT_SECRET")
MS_ENTRA_TENANT_ID = os.getenv("MS_ENTRA_TENANT_ID")

# Initialize MSAL confidential client for token validation
authority = f"https://login.microsoftonline.com/{MS_ENTRA_TENANT_ID}"
client_app = msal.ConfidentialClientApplication(
    MS_ENTRA_CLIENT_ID,
    authority=authority,
    client_credential=MS_ENTRA_CLIENT_SECRET
)

async def auth_middleware(request: Request, call_next):
    """Authentication middleware to validate JWT tokens"""
    # Skip authentication for login and register endpoints
    if request.url.path in ["/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/ms-entra/login-url", "/api/v1/auth/ms-entra/callback", "/docs", "/redoc", "/openapi.json"]:
        response = await call_next(request)
        return response
    
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
        
        # First try to decode as our own JWT token
        payload = decode_token(token)
        if payload:
            # Add user info to request state
            request.state.user_id = payload.get("id")
            request.state.user_role = payload.get("role")
        else:
            # If our JWT decoding failed, try to validate as Microsoft Entra token
            try:
                # Validate Microsoft Entra token
                result = client_app.acquire_token_on_behalf_of(
                    token,
                    ["User.Read"]
                )
                
                if "error" in result:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid Microsoft Entra token"
                    )
                
                # Get user info from token
                id_token_claims = result.get("id_token_claims", {})
                user_email = id_token_claims.get("preferred_username") or id_token_claims.get("email")
                
                if not user_email:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="User email not found in token"
                    )
                
                # Get user from database using email
                db = next(get_db())
                user = db.query(User).filter(User.email == user_email).first()
                if not user:
                    # If user doesn't exist in our database, they shouldn't be authenticated
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="User not found in database"
                    )
                
                request.state.user_id = str(user.id)
                request.state.user_role = user.role
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
    
    response = await call_next(request)
    return response