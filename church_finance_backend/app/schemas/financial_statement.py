from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from decimal import Decimal

class IncomeExpenditureItem(BaseModel):
    category: str
    amount: Decimal

class IncomeExpenditureStatement(BaseModel):
    period: str
    receipts: dict
    expenses: List[IncomeExpenditureItem]
    total_expenses: Decimal
    surplus_deficit: Decimal

class CashFlowStatement(BaseModel):
    period: str
    operating_activities: dict
    investing_activities: dict
    financing_activities: dict
    net_increase_decrease_cash: Decimal
    cash_beginning: Decimal
    cash_ending: Decimal

class ProvinceStatementTransaction(BaseModel):
    date: date
    type: str
    description: str
    amount: Decimal
    category: Optional[str] = None

class ProvinceStatement(BaseModel):
    province_name: str
    period: str
    transactions: List[ProvinceStatementTransaction]
    summary: dict

class FinancialPositionItem(BaseModel):
    account: str
    amount: Decimal

class StatementOfFinancialPosition(BaseModel):
    as_of_date: date
    assets: List[FinancialPositionItem]
    liabilities: List[FinancialPositionItem]
    equity: List[FinancialPositionItem]