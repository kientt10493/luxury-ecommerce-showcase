import uuid
import shutil
import os
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Header, UploadFile, File
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
    return {"id": prod.id, "message": "Product created successfully"}

@router.get("/products/{product_id}")
def get_admin_product_detail(
    product_id: int,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    translations_data = {
        t.language: {
            "name": t.name,
            "tagline": t.tagline or "",
            "description": t.description or "",
            "features": "\n".join(t.features) if isinstance(t.features, list) else (t.features or ""),
            "specifications": t.specifications or {}
        }
        for t in prod.translations
    }

    for lang in ["en", "vi", "ar"]:
        if lang not in translations_data:
            translations_data[lang] = {"name": "", "tagline": "", "description": "", "features": "", "specifications": {}}

    first_variant = prod.variants[0] if prod.variants else None
    price_usd = 0.0
    price_vnd = 0.0
    price_sar = 0.0
    if first_variant:
        for p in first_variant.prices:
            if p.currency == "USD":
                price_usd = float(p.price)
            elif p.currency == "VND":
                price_vnd = float(p.price)
            elif p.currency == "SAR":
                price_sar = float(p.price)

    all_variants_data = []
    for v in prod.variants:
        all_variants_data.append({
            "id": v.id,
            "sku": v.sku,
            "attributes": v.attributes or {},
            "attribute_translations": v.attribute_translations or {},
            "stock_quantity": v.stock_quantity,
            "variant_image": v.variant_image,
            "is_active": v.is_active,
            "prices": [
                {
                    "currency": p.currency,
                    "price": float(p.price),
                    "compare_at_price": float(p.compare_at_price) if p.compare_at_price else None
                }
                for p in v.prices
            ]
        })

    root_specs = prod.translations[0].specifications if (prod.translations and prod.translations[0].specifications) else {}

    return {
        "id": prod.id,
        "slug": prod.slug,
        "images": prod.images or [],
        "is_featured": prod.is_featured,
        "translations": translations_data,
        "specifications": root_specs,
        "variant": {
            "sku": first_variant.sku if first_variant else "",
            "color": (first_variant.attributes or {}).get("color", "") if first_variant else "",
            "storage": (first_variant.attributes or {}).get("storage", "") if first_variant else "",
            "stock": first_variant.stock_quantity if first_variant else 0,
            "price_usd": price_usd,
            "price_vnd": price_vnd,
            "price_sar": price_sar,
        },
        "variants": all_variants_data
    }

@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    admin: AdminUser = Depends(get_current_admin)
):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]:
        ext = ".png"

    filename = f"{uuid.uuid4().hex}{ext}"
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    uploads_dir = os.path.join(base_dir, "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    file_path = os.path.join(uploads_dir, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "url": f"/uploads/{filename}",
        "filename": filename
    }

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
