import msal
import os
from dotenv import load_dotenv
from app.models.user import User
from app.database import get_db
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

# Load environment variables
load_dotenv()

# Microsoft Entra configuration
MS_ENTRA_CLIENT_ID = os.getenv("MS_ENTRA_CLIENT_ID")
MS_ENTRA_CLIENT_SECRET = os.getenv("MS_ENTRA_CLIENT_SECRET")
MS_ENTRA_TENANT_ID = os.getenv("MS_ENTRA_TENANT_ID")
MS_ENTRA_REDIRECT_URI = os.getenv("MS_ENTRA_REDIRECT_URI")

# Initialize MSAL confidential client
authority = f"https://login.microsoftonline.com/{MS_ENTRA_TENANT_ID}"
client_app = msal.ConfidentialClientApplication(
    MS_ENTRA_CLIENT_ID,
    authority=authority,
    client_credential=MS_ENTRA_CLIENT_SECRET
)

def get_ms_entra_login_url():
    """Generate the Microsoft Entra login URL"""
    auth_url = client_app.get_authorization_request_url(
        scopes=["User.Read"],
        redirect_uri=MS_ENTRA_REDIRECT_URI
    )
    return auth_url

def authenticate_ms_entra_user(auth_code: str) -> dict:
    """Authenticate user with Microsoft Entra authorization code"""
    try:
        # Acquire token using authorization code
        result = client_app.acquire_token_by_authorization_code(
            auth_code,
            scopes=["User.Read"],
            redirect_uri=MS_ENTRA_REDIRECT_URI
        )
        
        if "error" in result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Microsoft Entra authentication failed: {result.get('error_description')}"
            )
        
        # Get user info from Microsoft Entra
        access_token = result.get("access_token")
        user_info = get_user_info_from_ms_entra(access_token)
        
        # Find or create user in our database
        db = next(get_db())
        user = get_or_create_user(db, user_info)
        
        return {
            "user": user,
            "access_token": access_token,
            "id_token": result.get("id_token")
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication error: {str(e)}"
        )

def get_user_info_from_ms_entra(access_token: str) -> dict:
    """Get user information from Microsoft Entra using access token"""
    import requests
    
    # Microsoft Graph API endpoint for user info
    graph_url = "https://graph.microsoft.com/v1.0/me"
    headers = {"Authorization": f"Bearer {access_token}"}
    
    response = requests.get(graph_url, headers=headers)
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to retrieve user information from Microsoft Entra"
        )
    
    return response.json()

def get_or_create_user(db: Session, ms_entra_user_info: dict) -> User:
    """Find existing user or create new user based on Microsoft Entra user info"""
    email = ms_entra_user_info.get("mail") or ms_entra_user_info.get("userPrincipalName")
    
    # Check if user already exists
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Create new user
        user = User(
            name=ms_entra_user_info.get("displayName", ""),
            email=email,
            role="Viewer",  # Default role for new Microsoft Entra users
            password_hash=None,  # No password hash needed for Microsoft Entra users
            is_active=True,
            auth_provider="microsoft"  # Set auth provider to microsoft
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif user.auth_provider != "microsoft":
        # If user exists but is not a Microsoft Entra user, they can't log in with Microsoft Entra
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User exists but is not registered with Microsoft Entra"
        )
    
    return user