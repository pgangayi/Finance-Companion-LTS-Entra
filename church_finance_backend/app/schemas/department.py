from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    budget_allocated: Optional[Decimal] = 0.00

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(DepartmentBase):
    name: Optional[str] = None
    budget_spent: Optional[Decimal] = None

class Department(DepartmentBase):
    id: int
    budget_spent: Decimal
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True