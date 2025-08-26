from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from datetime import date
from sqlalchemy import func, and_
from app.models.transaction import Transaction

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_summary(db: Session = Depends(get_db)):
    total_receipts = db.query(func.sum(Transaction.amount)).filter(Transaction.type == "receipt").scalar() or 0
    total_expenses = db.query(func.sum(Transaction.amount)).filter(Transaction.type == "expense").scalar() or 0
    return {
        "total_receipts": float(total_receipts),
        "total_expenses": float(total_expenses),
        "net": float(total_receipts - total_expenses)
    }

@router.get("/dashboard/{year}")
async def get_dashboard_summary_by_year(year: int, db: Session = Depends(get_db)):
    start = date(year, 1, 1)
    end = date(year, 12, 31)
    total_receipts = db.query(func.sum(Transaction.amount)).filter(and_(Transaction.type == "receipt", Transaction.date >= start, Transaction.date <= end)).scalar() or 0
    total_expenses = db.query(func.sum(Transaction.amount)).filter(and_(Transaction.type == "expense", Transaction.date >= start, Transaction.date <= end)).scalar() or 0
    return {
        "total_receipts": float(total_receipts),
        "total_expenses": float(total_expenses),
        "net": float(total_receipts - total_expenses)
    }


