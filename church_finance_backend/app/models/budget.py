from sqlalchemy import Column, Integer, DateTime, Numeric, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from app.database import Base

class Budget(Base):
    __tablename__ = "budgets"
    
    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    allocated_amount = Column(Numeric(precision=15, scale=2), nullable=False)
    actual_spent = Column(Numeric(precision=15, scale=2), default=0.00)
    variance = Column(Numeric(precision=15, scale=2), default=0.00)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Constraints
    __table_args__ = (UniqueConstraint('year', 'department_id', name='unique_year_department'),)