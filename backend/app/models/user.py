from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime
from app.db.session import Base

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="ADMIN")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
