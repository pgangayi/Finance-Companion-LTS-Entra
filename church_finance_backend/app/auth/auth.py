from app.models.user import User
from app.schemas.user import UserLogin
from app.auth.jwt_handler import create_access_token, create_refresh_token
from app.database import get_db
from sqlalchemy.orm import Session
import bcrypt
from fastapi import HTTPException, status

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    """Hash password"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def authenticate_user(email: str, password: str, db: Session) -> User:
    """Authenticate user with email and password"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    # Check if user is a Microsoft Entra user (no password hash)
    if user.auth_provider == "microsoft" and user.password_hash is None:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user

def login_user(user_data: UserLogin, db: Session) -> dict:
    """Login user and generate tokens"""
    user = authenticate_user(user_data.email, user_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"id": str(user.id), "role": user.role})
    refresh_token = create_refresh_token(data={"id": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }