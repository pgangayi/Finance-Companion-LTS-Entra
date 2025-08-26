from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Integer as IntColumn
from sqlalchemy.sql import func
from app.database import Base

class TransactionAttachment(Base):
    __tablename__ = "transaction_attachments"
    
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer, ForeignKey("transactions.id"))
    file_name = Column(String(255))
    file_path = Column(String(500))
    file_type = Column(String(50))
    file_size = Column(IntColumn)  # Size in bytes
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    uploaded_at = Column(DateTime, server_default=func.now())