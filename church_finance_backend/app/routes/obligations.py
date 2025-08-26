from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.obligation import Obligation
from app.schemas.obligation import Obligation as ObligationSchema, ObligationCreate, ObligationUpdate

router = APIRouter()

@router.get("/", response_model=List[ObligationSchema])
async def list_obligations(db: Session = Depends(get_db)):
    return db.query(Obligation).all()

@router.post("/", response_model=ObligationSchema, status_code=status.HTTP_201_CREATED)
async def create_obligation(data: ObligationCreate, db: Session = Depends(get_db)):
    obj = Obligation(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put("/{obligation_id}", response_model=ObligationSchema)
async def update_obligation(obligation_id: int, data: ObligationUpdate, db: Session = Depends(get_db)):
    obj = db.query(Obligation).filter(Obligation.id == obligation_id).first()
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Obligation not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{obligation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_obligation(obligation_id: int, db: Session = Depends(get_db)):
    obj = db.query(Obligation).filter(Obligation.id == obligation_id).first()
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Obligation not found")
    db.delete(obj)
    db.commit()
    return None


