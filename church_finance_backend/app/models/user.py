from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum
from sqlalchemy.sql import func
from app.database import Base
from enum import Enum as PyEnum
from datetime import datetime

class UserRole(str, PyEnum):
    ADMIN = "Admin"
    FINANCE_CHAIR = "FinanceChair"
    TREASURER = "Treasurer"
    SECRETARY = "Secretary"
    VIEWER = "Viewer"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    role = Column(String(20), nullable=False)
    password_hash = Column(String(255), nullable=True)  # Made nullable for Microsoft Entra users
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    auth_provider = Column(String(20), default="local", nullable=False)  # To distinguish between local and Microsoft Entra users
    
    # Relationship placeholders (to be implemented with proper relationships)
    # created_transactions = relationship("Transaction", foreign_keys="Transaction.created_by")
    # approved_transactions = relationship("Transaction", foreign_keys="Transaction.approved_by")
    # audit_logs = relationship("AuditLog")