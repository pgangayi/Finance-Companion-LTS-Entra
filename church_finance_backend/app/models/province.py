from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from app.database import Base

class Province(Base):
    __tablename__ = "provinces"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    region = Column(String(100))
    currency = Column(String(10), default="USD")
    allocation_percent = Column(Float, default=0.0)
    performance_rank = Column(Integer)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)