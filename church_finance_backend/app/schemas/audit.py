from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AuditLogBase(BaseModel):
    action: str
    entity: str
    entity_id: int
    details: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    user_id: Optional[int] = None

class AuditLog(AuditLogBase):
    id: int
    timestamp: datetime
    user_id: Optional[int] = None
    
    class Config:
        orm_mode = True