from fastapi import APIRouter, Depends, HTTPException, status, Request
from app.schemas.user import UserLogin, Token, UserCreate, User
from app.auth.auth import login_user, get_password_hash
from app.auth.ms_entra_auth import get_ms_entra_login_url, authenticate_ms_entra_user
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User as UserModel
from app.auth.jwt_handler import create_access_token, create_refresh_token, decode_token

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login user and get access tokens"""
    tokens = login_user(user_data, db)
    return tokens

@router.get("/me", response_model=User)
async def get_current_user(request: Request, db: Session = Depends(get_db)):
    """Get current authenticated user"""
    user_id = request.state.user_id
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.get("/ms-entra/login-url")
async def ms_entra_login_url():
    """Get Microsoft Entra login URL"""
    login_url = get_ms_entra_login_url()
    return {"login_url": login_url}

@router.post("/ms-entra/callback", response_model=Token)
async def ms_entra_callback(code: str, db: Session = Depends(get_db)):
    """Handle Microsoft Entra authentication callback"""
    try:
        # Authenticate user with Microsoft Entra
        ms_auth_result = authenticate_ms_entra_user(code)
        
        # Create our own JWT tokens
        user = ms_auth_result["user"]
        access_token = create_access_token(data={"id": str(user.id), "role": user.role})
        refresh_token = create_refresh_token(data={"id": str(user.id)})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register new user"""
    # Check if user already exists
    existing_user = db.query(UserModel).filter(UserModel.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user
    db_user = UserModel(
        name=user_data.name,
        email=user_data.email,
        role=user_data.role,
        password_hash=hashed_password,
        auth_provider="local"  # Set auth provider to local for registered users
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/refresh")
async def refresh_token(refresh_token: str):
    """Refresh access token"""
    # Implementation for refreshing tokens
    pass

@router.post("/logout")
async def logout():
    """Logout user"""
    # Implementation for logout
    pass