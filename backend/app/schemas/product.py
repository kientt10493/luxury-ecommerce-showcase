from typing import List, Dict, Optional, Any
from pydantic import BaseModel

class ProductPriceSchema(BaseModel):
    currency: str
    price: float
    compare_at_price: Optional[float] = None

class ProductVariantSchema(BaseModel):
    id: int
    sku: str
    attributes: Dict[str, Any]
    attribute_translations: Dict[str, Any] = {}
    stock_quantity: int
    variant_image: Optional[str] = None
    is_active: bool
    prices: List[ProductPriceSchema] = []

class ProductListItemSchema(BaseModel):
    id: int
    slug: str
    name: str
    tagline: str
    images: List[str]
    is_featured: bool
    currency: str
    price: float
    compare_at_price: Optional[float] = None
    total_stock: int

class ProductDetailSchema(BaseModel):
    id: int
    slug: str
    images: List[str]
    is_featured: bool
    is_active: bool
    language: str
    name: str
    tagline: str
    description: str
    features: List[str]
    specifications: Dict[str, Any] = {}
    currency: str
    price: float
    compare_at_price: Optional[float] = None
    variants: List[ProductVariantSchema]
