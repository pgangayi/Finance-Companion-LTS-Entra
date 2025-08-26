from app.models.transaction import Transaction
from app.models.budget import Budget
from app.models.province import Province
from app.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from typing import Dict, List
from datetime import date
import pandas as pd

class FinancialStatementsService:
    def __init__(self, db: Session):
        self.db = db
    
    def generate_income_expenditure_statement(self, start_date: date, end_date: date) -> Dict:
        """Generate Income and Expenditure Statement"""
        # Get all receipt transactions
        receipts = self.db.query(
            func.sum(Transaction.amount).label('total_receipts')
        ).filter(
            and_(
                Transaction.type == "receipt",
                Transaction.date >= start_date,
                Transaction.date <= end_date
            )
        ).scalar() or 0
        
        # Get all expense transactions by category
        expenses_by_category = self.db.query(
            Transaction.category,
            func.sum(Transaction.amount).label('total_amount')
        ).filter(
            and_(
                Transaction.type == "expense",
                Transaction.date >= start_date,
                Transaction.date <= end_date
            )
        ).group_by(Transaction.category).all()
        
        total_expenses = sum(row.total_amount or 0 for row in expenses_by_category)
        surplus_deficit = receipts - total_expenses
        
        return {
            "period": f"{start_date} to {end_date}",
            "receipts": {
                "total": float(receipts)
            },
            "expenses": [
                {
                    "category": row.category,
                    "amount": float(row.total_amount or 0)
                }
                for row in expenses_by_category
            ],
            "total_expenses": float(total_expenses),
            "surplus_deficit": float(surplus_deficit)
        }
    
    def generate_statement_of_financial_position(self, as_of_date: date) -> Dict:
        """Generate Statement of Financial Position (Balance Sheet)"""
        # This would require asset and liability tracking which isn't in current schema
        # For now, we'll provide a simplified version
        return {
            "as_of_date": as_of_date,
            "assets": [],
            "liabilities": [],
            "equity": []
        }
    
    def generate_cash_flow_statement(self, start_date: date, end_date: date) -> Dict:
        """Generate Cash Flow Statement"""
        # Operating activities
        operating_receipts = self.db.query(
            func.sum(Transaction.amount)
        ).filter(
            and_(
                Transaction.type == "receipt",
                Transaction.date >= start_date,
                Transaction.date <= end_date
            )
        ).scalar() or 0
        
        operating_expenses = self.db.query(
            func.sum(Transaction.amount)
        ).filter(
            and_(
                Transaction.type == "expense",
                Transaction.date >= start_date,
                Transaction.date <= end_date
            )
        ).scalar() or 0
        
        net_operating_cash_flow = operating_receipts - operating_expenses
        
        return {
            "period": f"{start_date} to {end_date}",
            "operating_activities": {
                "receipts": float(operating_receipts),
                "expenses": float(operating_expenses),
                "net_cash_flow": float(net_operating_cash_flow)
            },
            "investing_activities": {
                "net_cash_flow": 0  # Not implemented in current schema
            },
            "financing_activities": {
                "net_cash_flow": 0  # Not implemented in current schema
            },
            "net_increase_decrease_cash": float(net_operating_cash_flow),
            "cash_beginning": 0,  # Would need opening balance tracking
            "cash_ending": float(net_operating_cash_flow)
        }
    
    def generate_province_statement(self, province_id: int, start_date: date, end_date: date) -> Dict:
        """Generate detailed statement for a specific province"""
        # Get province details
        province = self.db.query(Province).filter(Province.id == province_id).first()
        
        # Get all transactions for this province in the date range
        transactions = self.db.query(Transaction).filter(
            and_(
                Transaction.province_id == province_id,
                Transaction.date >= start_date,
                Transaction.date <= end_date
            )
        ).all()
        
        # Calculate totals
        total_receipts = sum(t.amount for t in transactions if t.type == "receipt")
        total_expenses = sum(t.amount for t in transactions if t.type == "expense")
        
        return {
            "province_name": province.name if province else "Unknown",
            "period": f"{start_date} to {end_date}",
            "transactions": [
                {
                    "date": transaction.date,
                    "type": transaction.type,
                    "description": transaction.description,
                    "amount": float(transaction.amount),
                    "category": transaction.category
                }
                for transaction in transactions
            ],
            "summary": {
                "total_receipts": float(total_receipts),
                "total_expenses": float(total_expenses),
                "net_amount": float(total_receipts - total_expenses)
            }
        }
    
    def export_statement_to_excel(self, statement_data: Dict, statement_type: str) -> bytes:
        """Export financial statement to Excel"""
        # Create DataFrame from statement data
        if statement_type == "income_expenditure":
            # Create separate sheets for receipts and expenses
            receipts_df = pd.DataFrame([statement_data["receipts"]])
            expenses_df = pd.DataFrame(statement_data["expenses"])
            
            # Write to Excel with multiple sheets
            excel_buffer = BytesIO()
            with pd.ExcelWriter(excel_buffer, engine='openpyxl') as writer:
                receipts_df.to_excel(writer, sheet_name='Receipts', index=False)
                expenses_df.to_excel(writer, sheet_name='Expenses', index=False)
            
            excel_buffer.seek(0)
            return excel_buffer.getvalue()
        
        elif statement_type == "province":
            # Create DataFrame for transactions
            transactions_df = pd.DataFrame(statement_data["transactions"])
            
            # Write to Excel
            excel_buffer = BytesIO()
            with pd.ExcelWriter(excel_buffer, engine='openpyxl') as writer:
                transactions_df.to_excel(writer, sheet_name='Transactions', index=False)
            
            excel_buffer.seek(0)
            return excel_buffer.getvalue()
        
        else:
            # Generic export for other statement types
            df = pd.DataFrame([statement_data])
            excel_buffer = BytesIO()
            df.to_excel(excel_buffer, index=False)
            excel_buffer.seek(0)
            return excel_buffer.getvalue()