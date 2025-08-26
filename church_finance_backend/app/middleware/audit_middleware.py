from fastapi import Request
from app.models.audit import AuditLog
from app.database import get_db
from sqlalchemy.orm import Session
from datetime import datetime

async def audit_middleware(request: Request, call_next):
    """Audit middleware to log user actions"""
    # Process the request
    response = await call_next(request)
    
    # Log the action if user is authenticated
    if hasattr(request.state, 'user_id'):
        # Create audit log entry
        audit_log = AuditLog(
            user_id=request.state.user_id,
            action=f"{request.method} {request.url.path}",
            entity="API_CALL",
            entity_id=None,
            details=f"Status: {response.status_code}",
            timestamp=datetime.utcnow()
        )
        
        # Save to database
        try:
            db = next(get_db())
            db.add(audit_log)
            db.commit()
        except Exception:
            # Don't fail the request if audit logging fails
            pass
        finally:
            db.close()
    
    return response