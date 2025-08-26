from sqlalchemy import Column, Integer, Date, DateTime, Numeric, String, Text, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
from enum import Enum

class ObligationStatus(str, Enum):
    PENDING = "Pending"
    COMPLETED = "Completed"
    OVERDUE = "Overdue"

class Obligation(Base):
    __tablename__ = "obligations"
    
    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    amount = Column(Numeric(precision=15, scale=2), nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(String(20), default=ObligationStatus.PENDING)
    linked_project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)