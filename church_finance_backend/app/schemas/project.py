from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class ProjectBase(BaseModel):
    name: str
    type: Optional[str] = None
    province_id: Optional[int] = None
    status: Optional[str] = "Planned"
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    name: Optional[str] = None

class Project(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True  # replaces orm_mode in Pydantic v2
