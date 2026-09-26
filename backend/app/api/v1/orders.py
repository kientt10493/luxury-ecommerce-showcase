from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.order import Order
from app.schemas.payment import OrderStatusResponse

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/{order_id}/status", response_model=OrderStatusResponse)
def get_order_status(order_id: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    prod_name = "Product"
    if order.product and order.product.translations:
        # Match order language or default to first
        t = next((tr for tr in order.product.translations if tr.language == order.language), order.product.translations[0])
        prod_name = t.name

    return OrderStatusResponse(
        order_id=order.id,
        payment_status=order.payment_status,
        currency=order.currency,
        amount=float(order.amount),
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        product_name=prod_name,
        variant_snapshot=order.variant_snapshot or {},
        created_at=order.created_at.isoformat() if order.created_at else ""
    )
