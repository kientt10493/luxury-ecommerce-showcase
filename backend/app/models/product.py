from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, JSON, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    images = Column(JSON, default=list)  # list of URLs
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    translations = relationship("ProductTranslation", back_populates="product", cascade="all, delete-orphan")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="product")

class ProductTranslation(Base):
    __tablename__ = "product_translations"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    language = Column(String(10), nullable=False, index=True)  # 'en', 'vi', 'ar'
    name = Column(String(255), nullable=False)
    tagline = Column(String(255), default="")
    description = Column(Text, default="")
    features = Column(JSON, default=list)  # list of strings
    specifications = Column(JSON, default=dict)  # dict {spec_name: spec_val}

    product = relationship("Product", back_populates="translations")

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    attributes = Column(JSON, default=dict)  # {"color": "Titanium Gray", "storage": "512GB"}
    attribute_translations = Column(JSON, default=dict)  # {"vi": {"color": "Xám Titan"}}
    stock_quantity = Column(Integer, default=10)
    variant_image = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)

    product = relationship("Product", back_populates="variants")
    prices = relationship("VariantPrice", back_populates="variant", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="variant")

class VariantPrice(Base):
    __tablename__ = "variant_prices"

    id = Column(Integer, primary_key=True, index=True)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=False)
    currency = Column(String(10), nullable=False, index=True)  # 'USD', 'VND', 'SAR'
    price = Column(Numeric(12, 2), nullable=False)
    compare_at_price = Column(Numeric(12, 2), nullable=True)

    variant = relationship("ProductVariant", back_populates="prices")
