from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(64), primary_key=True, index=True)  # ORD-2026-XXXXX
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=True)
    variant_snapshot = Column(JSON, default=dict)
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    shipping_address = Column(String(500), default="")
    currency = Column(String(10), nullable=False)  # USD, VND, SAR
    amount = Column(Numeric(12, 2), nullable=False)
    language = Column(String(10), default="en")
    payment_method = Column(String(50), default="STRIPE")  # STRIPE, PAYOS_VIETQR
    payment_status = Column(String(50), default="PENDING")  # PENDING, PAID, FAILED, REFUNDED
    gateway_ref_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    product = relationship("Product", back_populates="orders")
    variant = relationship("ProductVariant", back_populates="orders")
