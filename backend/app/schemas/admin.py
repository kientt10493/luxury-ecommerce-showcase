from typing import List, Dict, Optional, Any
from pydantic import BaseModel

class TranslationCreate(BaseModel):
    language: str  # en, vi, ar
    name: str
    tagline: str = ""
    description: str = ""
    features: List[str] = []
    specifications: Dict[str, str] = {}

class PriceCreate(BaseModel):
    currency: str  # USD, VND, SAR
    price: float
    compare_at_price: Optional[float] = None

class VariantCreate(BaseModel):
    sku: str
    attributes: Dict[str, Any]
    attribute_translations: Dict[str, Any] = {}
    stock_quantity: int = 10
    variant_image: Optional[str] = None
    is_active: bool = True
    prices: List[PriceCreate]

class ProductCreateRequest(BaseModel):
    slug: str
    images: List[str] = []
    is_featured: bool = False
    is_active: bool = True
    translations: List[TranslationCreate]
    variants: List[VariantCreate]

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str = "ADMIN"

class AdminMetricsResponse(BaseModel):
    total_orders: int
    paid_orders: int
    pending_orders: int
    revenue_by_currency: Dict[str, float]  # {"USD": 1299.0, "VND": 32500000.0, "SAR": 4870.0}
    total_products: int
    total_stock: int
    low_stock_variants: List[Dict[str, Any]]
