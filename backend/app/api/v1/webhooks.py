from fastapi import APIRouter, Request, Header, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.order import Order
from app.models.product import ProductVariant
from app.core.config import settings
import stripe

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None),
    x_mock_test: str = Header(None),
    db: Session = Depends(get_db)
):
    body = await request.body()
    order_id = None

    if x_mock_test == "true" or settings.STRIPE_WEBHOOK_SECRET == "whsec_placeholder":
        # Mock / Sandbox verification
        try:
            data = await request.json()
            order_id = data.get("metadata", {}).get("order_id") or data.get("order_id")
        except Exception:
            pass
    else:
        # Production Stripe HMAC Verification
        try:
            event = stripe.Webhook.construct_event(
                body, stripe_signature, settings.STRIPE_WEBHOOK_SECRET
            )
            if event["type"] in ["checkout.session.completed", "payment_intent.succeeded"]:
                session = event["data"]["object"]
                order_id = session.get("metadata", {}).get("order_id") or session.get("client_reference_id")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid webhook signature: {str(e)}")

    if not order_id:
        return {"status": "ignored", "reason": "No order_id in webhook payload"}

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return {"status": "ignored", "reason": "Order not found"}

    # IDEMPOTENCY CHECK
    if order.payment_status == "PAID":
        return {"status": "ok", "message": "Order already marked as PAID (idempotent)"}

    # Transition status to PAID
    order.payment_status = "PAID"

    # Decrement inventory safely
    if order.variant_id:
        variant = db.query(ProductVariant).filter(ProductVariant.id == order.variant_id).first()
        if variant:
            variant.stock_quantity = max(0, variant.stock_quantity - 1)

    db.commit()
    return {"status": "success", "order_id": order_id, "payment_status": "PAID"}

@router.post("/payos")
async def payos_webhook(
    request: Request,
    x_mock_test: str = Header(None),
    db: Session = Depends(get_db)
):
    payload = await request.json()
    data = payload.get("data", {})
    order_code = data.get("orderCode")
    description = data.get("description", "")

    # Find order by gateway_ref_id or text match in description
    order = None
    if order_code:
        order = db.query(Order).filter(Order.gateway_ref_id == str(order_code)).first()

    if not order and "AURA " in description:
        extracted_id = description.split("AURA ")[-1].strip()
        order = db.query(Order).filter(Order.id == extracted_id).first()

    if not order:
        # Try finding by plain order_id inside data
        plain_id = data.get("order_id")
        if plain_id:
            order = db.query(Order).filter(Order.id == plain_id).first()

    if not order:
        return {"status": "ignored", "reason": "No matching order found"}

    # IDEMPOTENCY CHECK
    if order.payment_status == "PAID":
        return {"status": "ok", "message": "Order already marked as PAID (idempotent)"}

    order.payment_status = "PAID"

    # Decrement stock
    if order.variant_id:
        variant = db.query(ProductVariant).filter(ProductVariant.id == order.variant_id).first()
        if variant:
            variant.stock_quantity = max(0, variant.stock_quantity - 1)

    db.commit()
    return {"status": "success", "order_id": order.id, "payment_status": "PAID"}
