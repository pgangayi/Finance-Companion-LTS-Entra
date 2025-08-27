from enum import Enum
from sqlalchemy import Column, Integer, Date, DateTime, Numeric, String, Text, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class TransactionType(str, Enum):
    RECEIPT = "receipt"
    EXPENSE = "expense"
    TRANSFER = "transfer"

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    type = Column(String(10), nullable=False)
    amount = Column(Numeric(precision=15, scale=2), nullable=False)
    description = Column(Text)
    category = Column(String(100))
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    province_id = Column(Integer, ForeignKey("provinces.id"), nullable=True)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)