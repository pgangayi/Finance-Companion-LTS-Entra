from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from decimal import Decimal

class TransactionBase(BaseModel):
    date: date
    type: str
    amount: Decimal
    description: Optional[str] = None
    category: Optional[str] = None
    project_id: Optional[int] = None
    department_id: Optional[int] = None
    province_id: Optional[int] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(TransactionBase):
    date: Optional[date] = None
    type: Optional[str] = None
    amount: Optional[Decimal] = None
    description: Optional[str] = None
    project_id: Optional[int] = None
    department_id: Optional[int] = None
    province_id: Optional[int] = None

class Transaction(TransactionBase):
    id: int
    approved_by: Optional[int] = None
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True