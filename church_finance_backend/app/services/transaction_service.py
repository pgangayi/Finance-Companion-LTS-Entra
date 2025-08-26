from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.transaction import TransactionCreate, TransactionUpdate
from app.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from typing import List, Optional
from datetime import date, datetime
import re

class TransactionService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_transaction(self, transaction_data: TransactionCreate, created_by: int) -> Transaction:
        """Create a new transaction"""
        # Auto-tag expenses based on description
        category = self._auto_tag_expense(transaction_data.description, transaction_data.type)
        
        db_transaction = Transaction(
            date=transaction_data.date,
            type=transaction_data.type,
            amount=transaction_data.amount,
            description=transaction_data.description,
            category=category,
            project_id=transaction_data.project_id,
            department_id=transaction_data.department_id,
            province_id=transaction_data.province_id,
            created_by=created_by
        )
        
        self.db.add(db_transaction)
        self.db.commit()
        self.db.refresh(db_transaction)
        return db_transaction
    
    def get_transaction(self, transaction_id: int) -> Optional[Transaction]:
        """Get a transaction by ID"""
        return self.db.query(Transaction).filter(Transaction.id == transaction_id).first()
    
    def get_transactions(
        self,
        skip: int = 0,
        limit: int = 100,
        province_id: Optional[int] = None,
        department_id: Optional[int] = None,
        project_id: Optional[int] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        transaction_type: Optional[str] = None,
        category: Optional[str] = None,
        approved_only: bool = False
    ) -> List[Transaction]:
        """Get a list of transactions with filtering"""
        query = self.db.query(Transaction)
        
        # Apply filters
        if province_id:
            query = query.filter(Transaction.province_id == province_id)
        if department_id:
            query = query.filter(Transaction.department_id == department_id)
        if project_id:
            query = query.filter(Transaction.project_id == project_id)
        if start_date:
            query = query.filter(Transaction.date >= start_date)
        if end_date:
            query = query.filter(Transaction.date <= end_date)
        if transaction_type:
            query = query.filter(Transaction.type == transaction_type)
        if category:
            query = query.filter(Transaction.category == category)
        if approved_only:
            query = query.filter(Transaction.approved_by.isnot(None))
        
        return query.offset(skip).limit(limit).all()
    
    def update_transaction(self, transaction_id: int, transaction_data: TransactionUpdate, updated_by: int) -> Optional[Transaction]:
        """Update a transaction"""
        db_transaction = self.get_transaction(transaction_id)
        if not db_transaction:
            return None
        
        # Check if user has permission to update
        if db_transaction.approved_by is not None:
            raise Exception("Cannot update an approved transaction")
        
        # Update auto-tag if description changed
        if transaction_data.description and transaction_data.description != db_transaction.description:
            category = self._auto_tag_expense(transaction_data.description, db_transaction.type)
            transaction_data.category = category
        
        update_data = transaction_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_transaction, key, value)
        
        db_transaction.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(db_transaction)
        return db_transaction
    
    def delete_transaction(self, transaction_id: int) -> bool:
        """Delete a transaction"""
        db_transaction = self.get_transaction(transaction_id)
        if not db_transaction:
            return False
        
        # Check if transaction is approved
        if db_transaction.approved_by is not None:
            raise Exception("Cannot delete an approved transaction")
        
        self.db.delete(db_transaction)
        self.db.commit()
        return True
    
    def approve_transaction(self, transaction_id: int, approved_by: int) -> Optional[Transaction]:
        """Approve a transaction"""
        db_transaction = self.get_transaction(transaction_id)
        if not db_transaction:
            return None
        
        # Check if already approved
        if db_transaction.approved_by is not None:
            raise Exception("Transaction already approved")
        
        db_transaction.approved_by = approved_by
        db_transaction.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(db_transaction)
        return db_transaction
    
    def _auto_tag_expense(self, description: Optional[str], transaction_type: str) -> Optional[str]:
        """Auto-tag expenses by category based on description"""
        if not description or transaction_type != "expense":
            return None
        
        description_lower = description.lower()
        
        # Define category keywords
        categories = {
            "Travel": ["travel", "transport", "fuel", "gas", "mileage", "cab", "taxi"],
            "Office Supplies": ["office", "supplies", "stationery", "paper", "pen", "printer"],
            "Equipment": ["equipment", "computer", "laptop", "software", "hardware"],
            "Utilities": ["electricity", "water", "internet", "phone", "utility"],
            "Food": ["food", "meal", "lunch", "dinner", "restaurant"],
            "Maintenance": ["maintenance", "repair", "service", "fix"],
            "Training": ["training", "course", "seminar", "workshop", "education"],
            "Insurance": ["insurance", "premium", "policy"],
            "Rent": ["rent", "lease", "facility"],
            "Marketing": ["marketing", "advertising", "promotion", "campaign"]
        }
        
        # Find matching category
        for category, keywords in categories.items():
            for keyword in keywords:
                if keyword in description_lower:
                    return category
        
        return "Other"
    
    def get_transaction_summary(
        self,
        province_id: Optional[int] = None,
        department_id: Optional[int] = None,
        project_id: Optional[int] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> dict:
        """Get transaction summary statistics"""
        query = self.db.query(
            func.sum(Transaction.amount).label("total_amount"),
            func.count(Transaction.id).label("total_count"),
            func.sum(Transaction.amount).filter(Transaction.type == "receipt").label("total_receipts"),
            func.sum(Transaction.amount).filter(Transaction.type == "expense").label("total_expenses")
        )
        
        # Apply filters
        if province_id:
            query = query.filter(Transaction.province_id == province_id)
        if department_id:
            query = query.filter(Transaction.department_id == department_id)
        if project_id:
            query = query.filter(Transaction.project_id == project_id)
        if start_date:
            query = query.filter(Transaction.date >= start_date)
        if end_date:
            query = query.filter(Transaction.date <= end_date)
        
        result = query.first()
        
        return {
            "total_amount": result.total_amount or 0,
            "total_count": result.total_count or 0,
            "total_receipts": result.total_receipts or 0,
            "total_expenses": result.total_expenses or 0,
            "net_amount": (result.total_receipts or 0) - (result.total_expenses or 0)
        }
    
    def get_category_breakdown(
        self,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> List[dict]:
        """Get expense breakdown by category"""
        query = self.db.query(
            Transaction.category,
            func.sum(Transaction.amount).label("total_amount"),
            func.count(Transaction.id).label("count")
        ).filter(
            Transaction.type == "expense",
            Transaction.category.isnot(None)
        )
        
        if start_date:
            query = query.filter(Transaction.date >= start_date)
        if end_date:
            query = query.filter(Transaction.date <= end_date)
        
        query = query.group_by(Transaction.category)
        
        results = query.all()
        
        return [
            {
                "category": result.category,
                "total_amount": float(result.total_amount or 0),
                "count": result.count
            }
            for result in results
        ]