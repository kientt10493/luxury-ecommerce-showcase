import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.product import Product, ProductVariant, VariantPrice
from app.models.order import Order
from app.schemas.payment import CreatePaymentRequest, StripeSessionResponse, PayOSPaymentResponse
from app.services.payment_service import create_stripe_checkout_session, create_payos_payment_data
from app.core.config import settings

router = APIRouter(prefix="/payments", tags=["Payments"])

def get_product_and_variant(req: CreatePaymentRequest, db: Session):
    prod = db.query(Product).filter(Product.id == req.product_id, Product.is_active == True).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    variant = None
    if req.variant_id:
        variant = db.query(ProductVariant).filter(
            ProductVariant.id == req.variant_id,
            ProductVariant.product_id == prod.id,
            ProductVariant.is_active == True
        ).first()
    else:
        variant = next((v for v in prod.variants if v.is_active), None)

    if not variant:
        raise HTTPException(status_code=400, detail="No active variant available")

    if variant.stock_quantity <= 0:
        raise HTTPException(status_code=400, detail="Selected variant is out of stock")

    # Find price for target currency
    target_currency = req.currency.upper()
    price_obj = next((p for p in variant.prices if p.currency == target_currency), None)
    if not price_obj:
        # Fallback to first price or USD
        price_obj = next((p for p in variant.prices if p.currency == "USD"), variant.prices[0] if variant.prices else None)

    if not price_obj:
        raise HTTPException(status_code=400, detail="Pricing not configured for this product")

    return prod, variant, float(price_obj.price), price_obj.currency

@router.post("/stripe/create-session", response_model=StripeSessionResponse)
def create_stripe_session(req: CreatePaymentRequest, db: Session = Depends(get_db)):
    prod, variant, amount, currency = get_product_and_variant(req, db)

    order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"
    new_order = Order(
        id=order_id,
        product_id=prod.id,
        variant_id=variant.id,
        variant_snapshot={
            "sku": variant.sku,
            "attributes": variant.attributes,
            "product_name": prod.translations[0].name if prod.translations else prod.slug
        },
        customer_name=req.customer_name,
        customer_email=req.customer_email,
        customer_phone=req.customer_phone,
        shipping_address=req.shipping_address,
        currency=currency,
        amount=amount,
        language=req.language,
        payment_method="STRIPE",
        payment_status="PENDING"
    )
    db.add(new_order)
    db.commit()

    prod_name = prod.translations[0].name if prod.translations else prod.slug
    session_data = create_stripe_checkout_session(
        order_id=order_id,
        product_name=f"{prod_name} ({variant.sku})",
        amount=amount,
        currency=currency,
        customer_email=req.customer_email,
        success_url=f"{settings.FRONTEND_URL}/order-success",
        cancel_url=f"{settings.FRONTEND_URL}"
    )

    new_order.gateway_ref_id = session_data.get("session_id")
    db.commit()

    return StripeSessionResponse(
        order_id=order_id,
        checkout_url=session_data["checkout_url"],
        amount=amount,
        currency=currency
    )

@router.post("/payos/create-payment", response_model=PayOSPaymentResponse)
def create_payos_payment(req: CreatePaymentRequest, db: Session = Depends(get_db)):
    # PayOS is specifically for Vietnam VND
    req.currency = "VND"
    prod, variant, amount, currency = get_product_and_variant(req, db)

    order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"
    new_order = Order(
        id=order_id,
        product_id=prod.id,
        variant_id=variant.id,
        variant_snapshot={
            "sku": variant.sku,
            "attributes": variant.attributes,
            "product_name": prod.translations[0].name if prod.translations else prod.slug
        },
        customer_name=req.customer_name,
        customer_email=req.customer_email,
        customer_phone=req.customer_phone,
        shipping_address=req.shipping_address,
        currency="VND",
        amount=amount,
        language=req.language or "vi",
        payment_method="PAYOS_VIETQR",
        payment_status="PENDING"
    )
    db.add(new_order)
    db.commit()

    pay_data = create_payos_payment_data(
        order_id=order_id,
        amount=amount,
        description=f"AURA {order_id}"
    )

    new_order.gateway_ref_id = str(pay_data["gateway_order_code"])
    db.commit()

    return PayOSPaymentResponse(**pay_data)
