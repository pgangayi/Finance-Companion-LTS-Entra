from datetime import datetime, date
from decimal import Decimal
from typing import Dict, List, Optional
import re

def format_currency(amount: Decimal) -> str:
    """Format decimal amount as currency string"""
    return f"${amount:,.2f}"

def validate_date_range(start_date: date, end_date: date) -> bool:
    """Validate that start date is before end date"""
    return start_date <= end_date

def calculate_variance(budget_amount: Decimal, actual_amount: Decimal) -> Decimal:
    """Calculate variance between budget and actual amounts"""
    return budget_amount - actual_amount

def calculate_percentage(part: Decimal, whole: Decimal) -> float:
    """Calculate percentage of part to whole"""
    if whole == 0:
        return 0.0
    return float((part / whole) * 100)

def sanitize_filename(filename: str) -> str:
    """Sanitize filename by removing special characters"""
    # Remove any character that is not alphanumeric, underscore, hyphen, or dot
    sanitized = re.sub(r'[^\w\-_\.]', '_', filename)
    return sanitized

def get_financial_year_dates(year: int) -> Dict[str, date]:
    """Get start and end dates for financial year (April 1 to March 31)"""
    return {
        "start_date": date(year, 4, 1),
        "end_date": date(year + 1, 3, 31)
    }

def calculate_performance_score(actual: Decimal, target: Decimal) -> float:
    """Calculate performance score as percentage of target achieved"""
    if target == 0:
        return 0.0
    return float((actual / target) * 100)

def generate_report_filename(report_type: str, start_date: date, end_date: date) -> str:
    """Generate standardized filename for reports"""
    date_str = f"{start_date.strftime('%Y%m%d')}-{end_date.strftime('%Y%m%d')}"
    return f"{report_type}_{date_str}.xlsx"

def is_transaction_approvable(user_role: str) -> bool:
    """Check if user role can approve transactions"""
    approvable_roles = ["Admin", "FinanceChair"]
    return user_role in approvable_roles

def is_transaction_creatable(user_role: str) -> bool:
    """Check if user role can create transactions"""
    creatable_roles = ["Admin", "FinanceChair", "Treasurer"]
    return user_role in creatable_roles

def is_transaction_deletable(user_role: str) -> bool:
    """Check if user role can delete transactions"""
    deletable_roles = ["Admin", "FinanceChair"]
    return user_role in deletable_roles