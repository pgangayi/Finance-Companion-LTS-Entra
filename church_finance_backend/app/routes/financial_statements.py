from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.schemas.financial_statement import (
    IncomeExpenditureStatement, 
    CashFlowStatement, 
    ProvinceStatement,
    StatementOfFinancialPosition
)
from app.database import get_db
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.services.financial_statements_service import FinancialStatementsService

router = APIRouter()

@router.get("/income-expenditure", response_model=IncomeExpenditureStatement)
async def get_income_expenditure_statement(
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db)
):
    """Generate Income and Expenditure Statement"""
    service = FinancialStatementsService(db)
    return service.generate_income_expenditure_statement(start_date, end_date)

@router.get("/cash-flow", response_model=CashFlowStatement)
async def get_cash_flow_statement(
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db)
):
    """Generate Cash Flow Statement"""
    service = FinancialStatementsService(db)
    return service.generate_cash_flow_statement(start_date, end_date)

@router.get("/province/{province_id}", response_model=ProvinceStatement)
async def get_province_statement(
    province_id: int,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    """Generate detailed statement for a specific province"""
    if not start_date or not end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date and end_date are required"
        )
    service = FinancialStatementsService(db)
    return service.generate_province_statement(province_id, start_date, end_date)

@router.get("/financial-position", response_model=StatementOfFinancialPosition)
async def get_statement_of_financial_position(
    as_of_date: date,
    db: Session = Depends(get_db)
):
    """Generate Statement of Financial Position (Balance Sheet)"""
    service = FinancialStatementsService(db)
    return service.generate_statement_of_financial_position(as_of_date)

@router.get("/export")
async def export_financial_statement(
    statement_type: str,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    format: str = Query("pdf", regex="^(pdf|excel|csv)$"),
    db: Session = Depends(get_db)
):
    """Export financial statement in specified format"""
    service = FinancialStatementsService(db)
    if statement_type == "income_expenditure":
        if not start_date or not end_date:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="start_date and end_date are required")
        data = service.generate_income_expenditure_statement(start_date, end_date)
    elif statement_type == "province":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="province export requires province_id; not implemented in this endpoint")
    elif statement_type == "cash_flow":
        if not start_date or not end_date:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="start_date and end_date are required")
        data = service.generate_cash_flow_statement(start_date, end_date)
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported statement_type")
    # For now, just return data (export streaming can be implemented later)
    return data

# Alias for frontend compatibility: /api/v1/receipts/province-statement/{province_id}
@router.get("/receipts/province-statement/{province_id}", response_model=ProvinceStatement)
async def get_province_statement_alias(
    province_id: int,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    if not start_date or not end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date and end_date are required"
        )
    service = FinancialStatementsService(db)
    return service.generate_province_statement(province_id, start_date, end_date)