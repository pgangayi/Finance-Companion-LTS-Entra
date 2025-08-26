from app.models.transaction import Transaction
from app.database import get_db
from sqlalchemy.orm import Session
from typing import List, Dict
import pandas as pd
from io import BytesIO
import uuid
import os

class BulkUploadService:
    def __init__(self, db: Session):
        self.db = db
    
    def generate_excel_template(self) -> BytesIO:
        """Generate Excel template for bulk upload"""
        template_data = {
            "date": ["2023-04-01"],
            "type": ["receipt"],
            "amount": [1000.00],
            "description": ["Sample transaction"],
            "category": ["Donation"],
            "project_id": [1],
            "department_id": [1],
            "province_id": [1]
        }
        
        df = pd.DataFrame(template_data)
        excel_buffer = BytesIO()
        df.to_excel(excel_buffer, index=False, sheet_name="Transactions")
        excel_buffer.seek(0)
        
        return excel_buffer
    
    def process_excel_upload(self, file_content: bytes, created_by: int) -> Dict:
        """Process Excel file for bulk transaction upload"""
        try:
            # Read Excel file
            df = pd.read_excel(BytesIO(file_content))
            
            # Validate required columns
            required_columns = ["date", "type", "amount", "description"]
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                return {
                    "success": False,
                    "error": f"Missing required columns: {', '.join(missing_columns)}"
                }
            
            # Process each row
            created_transactions = []
            errors = []
            
            for index, row in df.iterrows():
                try:
                    # Create transaction
                    transaction = Transaction(
                        date=row["date"],
                        type=row["type"],
                        amount=row["amount"],
                        description=row["description"],
                        category=row.get("category"),
                        project_id=row.get("project_id"),
                        department_id=row.get("department_id"),
                        province_id=row.get("province_id"),
                        created_by=created_by
                    )
                    
                    self.db.add(transaction)
                    created_transactions.append(transaction)
                    
                except Exception as e:
                    errors.append(f"Row {index + 1}: {str(e)}")
            
            if errors:
                # Rollback if there are errors
                self.db.rollback()
                return {
                    "success": False,
                    "error": f"Errors occurred during upload: {'; '.join(errors)}"
                }
            
            # Commit all transactions
            self.db.commit()
            
            # Refresh transactions to get IDs
            for transaction in created_transactions:
                self.db.refresh(transaction)
            
            return {
                "success": True,
                "transactions_created": len(created_transactions),
                "transaction_ids": [t.id for t in created_transactions]
            }
            
        except Exception as e:
            self.db.rollback()
            return {
                "success": False,
                "error": f"Failed to process Excel file: {str(e)}"
            }
    
    def validate_transaction_data(self, data: Dict) -> Dict:
        """Validate transaction data before creation"""
        errors = []
        
        # Validate required fields
        if not data.get("date"):
            errors.append("Date is required")
        
        if not data.get("type") or data["type"] not in ["receipt", "expense", "transfer"]:
            errors.append("Valid transaction type is required (receipt, expense, transfer)")
        
        if not data.get("amount") or data["amount"] <= 0:
            errors.append("Amount must be greater than 0")
        
        if not data.get("description"):
            errors.append("Description is required")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors
        }