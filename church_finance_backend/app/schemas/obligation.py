from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from decimal import Decimal

class ObligationBase(BaseModel):
    description: str
    amount: Decimal
    due_date: date
    status: Optional[str] = "Pending"
    linked_project_id: Optional[int] = None

class ObligationCreate(ObligationBase):
    pass

class ObligationUpdate(ObligationBase):
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    due_date: Optional[date] = None
    status: Optional[str] = None
    linked_project_id: Optional[int] = None

class Obligation(ObligationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True