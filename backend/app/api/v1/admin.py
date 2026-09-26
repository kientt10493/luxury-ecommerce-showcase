from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from app.core.config import settings
from app.db.session import get_db
from app.models.user import AdminUser
from app.models.product import Product, ProductTranslation, ProductVariant, VariantPrice
from app.models.order import Order
from app.schemas.admin import ProductCreateRequest, AdminMetricsResponse

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

def get_current_admin(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
) -> AdminUser:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token"
        )
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token validation failed")

    admin = db.query(AdminUser).filter(AdminUser.username == username).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin user not found")
    return admin

@router.get("/metrics", response_model=AdminMetricsResponse)
def get_metrics(
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).all()
    total_orders = len(orders)
    paid_orders = sum(1 for o in orders if o.payment_status == "PAID")
    pending_orders = sum(1 for o in orders if o.payment_status == "PENDING")

    revenue = {"USD": 0.0, "VND": 0.0, "SAR": 0.0}
    for o in orders:
        if o.payment_status == "PAID":
            curr = o.currency
            if curr not in revenue:
                revenue[curr] = 0.0
            revenue[curr] += float(o.amount)

    products = db.query(Product).all()
    total_products = len(products)

    variants = db.query(ProductVariant).all()
    total_stock = sum(v.stock_quantity for v in variants)
    low_stock = [
        {"id": v.id, "sku": v.sku, "stock": v.stock_quantity, "product_id": v.product_id}
        for v in variants if v.stock_quantity <= 3
    ]

    return AdminMetricsResponse(
        total_orders=total_orders,
        paid_orders=paid_orders,
        pending_orders=pending_orders,
        revenue_by_currency=revenue,
        total_products=total_products,
        total_stock=total_stock,
        low_stock_variants=low_stock
    )

@router.get("/orders")
def get_orders(
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    results = []
    for o in orders:
        results.append({
            "id": o.id,
            "product_id": o.product_id,
            "product_name": o.product.translations[0].name if o.product and o.product.translations else "Product",
            "variant_id": o.variant_id,
            "variant_snapshot": o.variant_snapshot or {},
            "customer_name": o.customer_name,
            "customer_email": o.customer_email,
            "customer_phone": o.customer_phone,
            "shipping_address": o.shipping_address,
            "currency": o.currency,
            "amount": float(o.amount),
            "language": o.language,
            "payment_method": o.payment_method,
            "payment_status": o.payment_status,
            "gateway_ref_id": o.gateway_ref_id,
            "created_at": o.created_at.isoformat() if o.created_at else None
        })
    return results

@router.post("/products", status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreateRequest,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(Product).filter(Product.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Product with slug '{payload.slug}' already exists")

    prod = Product(
        slug=payload.slug,
        images=payload.images,
        is_featured=payload.is_featured,
        is_active=payload.is_active
    )
    db.add(prod)
    db.flush()

    # Add translations
    for t in payload.translations:
        trans = ProductTranslation(
            product_id=prod.id,
            language=t.language,
            name=t.name,
            tagline=t.tagline,
            description=t.description,
            features=t.features,
            specifications=t.specifications
        )
        db.add(trans)

    # Add variants and their prices
    for v in payload.variants:
        variant = ProductVariant(
            product_id=prod.id,
            sku=v.sku,
            attributes=v.attributes,
            attribute_translations=v.attribute_translations,
            stock_quantity=v.stock_quantity,
            variant_image=v.variant_image,
            is_active=v.is_active
        )
        db.add(variant)
        db.flush()

        for p in v.prices:
            vp = VariantPrice(
                variant_id=variant.id,
                currency=p.currency,
                price=p.price,
                compare_at_price=p.compare_at_price
            )
            db.add(vp)

    db.commit()
    db.refresh(prod)
    return {"message": "Product created successfully", "id": prod.id, "slug": prod.slug}

@router.put("/products/{product_id}")
def update_product(
    product_id: int,
    payload: ProductCreateRequest,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    prod.slug = payload.slug
    prod.images = payload.images
    prod.is_featured = payload.is_featured
    prod.is_active = payload.is_active

    # Recreate translations
    db.query(ProductTranslation).filter(ProductTranslation.product_id == prod.id).delete()
    for t in payload.translations:
        db.add(ProductTranslation(
            product_id=prod.id,
            language=t.language,
            name=t.name,
            tagline=t.tagline,
            description=t.description,
            features=t.features,
            specifications=t.specifications
        ))

    # Recreate variants
    db.query(ProductVariant).filter(ProductVariant.product_id == prod.id).delete()
    for v in payload.variants:
        variant = ProductVariant(
            product_id=prod.id,
            sku=v.sku,
            attributes=v.attributes,
            attribute_translations=v.attribute_translations,
            stock_quantity=v.stock_quantity,
            variant_image=v.variant_image,
            is_active=v.is_active
        )
        db.add(variant)
        db.flush()
        for p in v.prices:
            db.add(VariantPrice(
                variant_id=variant.id,
                currency=p.currency,
                price=p.price,
                compare_at_price=p.compare_at_price
            ))

    db.commit()
    return {"message": "Product updated successfully", "id": prod.id}

@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(prod)
    db.commit()
    return {"message": "Product deleted successfully"}
