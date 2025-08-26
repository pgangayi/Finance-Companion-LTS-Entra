from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.project import Project
from app.schemas.project import Project as ProjectSchema

router = APIRouter()

@router.get("/", response_model=List[ProjectSchema])
async def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()


