from sqlalchemy import Column, Integer, Date, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base

class FinancialYear(Base):
    __tablename__ = "financial_years"
    
    id = Column(Integer, primary_key=True, index=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    year = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())