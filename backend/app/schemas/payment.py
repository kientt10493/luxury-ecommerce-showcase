from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr

class CreatePaymentRequest(BaseModel):
    product_id: int
    variant_id: Optional[int] = None
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    shipping_address: str = ""
    currency: str = "USD"
    language: str = "en"

class PayOSPaymentResponse(BaseModel):
    order_id: str
    gateway_order_code: int
    amount: float
    currency: str
    account_number: str
    account_name: str
    bin: str
    description: str
    qr_code: str
    checkout_url: str

class StripeSessionResponse(BaseModel):
    order_id: str
    checkout_url: str
    amount: float
    currency: str

class OrderStatusResponse(BaseModel):
    order_id: str
    payment_status: str  # PENDING, PAID, FAILED, REFUNDED
    currency: str
    amount: float
    customer_name: str
    customer_email: str
    product_name: str
    variant_snapshot: Dict[str, Any]
    created_at: str
