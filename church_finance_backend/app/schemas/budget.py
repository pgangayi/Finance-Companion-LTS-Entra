from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class BudgetBase(BaseModel):
    year: int
    department_id: int
    allocated_amount: Decimal

class BudgetCreate(BudgetBase):
    pass

class BudgetUpdate(BaseModel):
    year: Optional[int] = None
    department_id: Optional[int] = None
    allocated_amount: Optional[Decimal] = None
    actual_spent: Optional[Decimal] = None

class Budget(BudgetBase):
    id: int
    actual_spent: Decimal
    variance: Decimal
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True