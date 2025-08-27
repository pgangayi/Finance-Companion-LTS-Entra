from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.budget import Budget
from app.schemas.budget import Budget as BudgetSchema, BudgetCreate, BudgetUpdate

router = APIRouter()

@router.get("/", response_model=List[BudgetSchema])
async def list_budgets(year: Optional[int] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Budget)
    if year is not None:
        query = query.filter(Budget.year == year)
    return query.all()

@router.post("/", response_model=BudgetSchema, status_code=status.HTTP_201_CREATED)
async def create_budget(budget_data: BudgetCreate, db: Session = Depends(get_db)):
    budget = Budget(**budget_data.dict())
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget

@router.put("/{budget_id}", response_model=BudgetSchema)
async def update_budget(budget_id: int, budget_data: BudgetUpdate, db: Session = Depends(get_db)):
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not budget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    for key, value in budget_data.dict(exclude_unset=True).items():
        setattr(budget, key, value)
    db.commit()
    db.refresh(budget)
    return budget

@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget(budget_id: int, db: Session = Depends(get_db)):
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not budget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    db.delete(budget)
    db.commit()
    return None


