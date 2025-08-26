from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
from enum import Enum

class ProjectStatus(str, Enum):
    PLANNED = "Planned"
    ACTIVE = "Active"
    COMPLETED = "Completed"
    ON_HOLD = "On Hold"

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    type = Column(String(50))
    province_id = Column(Integer, ForeignKey("provinces.id"), nullable=True)
    status = Column(String(20), default=ProjectStatus.PLANNED)
    start_date = Column(Date)
    end_date = Column(Date)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)