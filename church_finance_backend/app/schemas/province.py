from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProvinceBase(BaseModel):
    name: str
    region: Optional[str] = None
    currency: Optional[str] = "USD"
    allocation_percent: Optional[float] = 0.0

class ProvinceCreate(ProvinceBase):
    pass

class ProvinceUpdate(ProvinceBase):
    name: Optional[str] = None
    performance_rank: Optional[int] = None

class Province(ProvinceBase):
    id: int
    performance_rank: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True