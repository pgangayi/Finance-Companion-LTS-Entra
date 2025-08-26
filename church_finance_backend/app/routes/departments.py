from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.department import Department
from app.schemas.department import Department as DepartmentSchema

router = APIRouter()

@router.get("/", response_model=List[DepartmentSchema])
async def list_departments(db: Session = Depends(get_db)):
    return db.query(Department).all()


