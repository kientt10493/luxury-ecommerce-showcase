from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.product import Product, ProductTranslation, ProductVariant, VariantPrice
from app.schemas.product import ProductListItemSchema, ProductDetailSchema, ProductVariantSchema, ProductPriceSchema

router = APIRouter(prefix="/products", tags=["Products"])

def get_best_translation(translations: List[ProductTranslation], lang: str) -> ProductTranslation:
    # 1. Exact match
    for t in translations:
        if t.language == lang:
            return t
    # 2. English fallback
    for t in translations:
        if t.language == "en":
            return t
    # 3. First available
    return translations[0] if translations else None

def get_price_for_currency(prices: List[VariantPrice], target_currency: str) -> Optional[VariantPrice]:
    for p in prices:
        if p.currency == target_currency:
            return p
    # Fallback to USD
    for p in prices:
        if p.currency == "USD":
            return p
    return prices[0] if prices else None

@router.get("", response_model=List[ProductListItemSchema])
def list_products(
    lang: str = Query("en", description="Language code: en, vi, ar"),
    currency: str = Query("USD", description="Currency code: USD, VND, SAR"),
    db: Session = Depends(get_db)
):
    products = db.query(Product).filter(Product.is_active == True).all()
    results = []

    for p in products:
        t = get_best_translation(p.translations, lang)
        if not t:
            continue

        # Get representative price from first active variant
        first_variant = next((v for v in p.variants if v.is_active), None)
        price_val = 0.0
        compare_at_val = None
        if first_variant:
            price_obj = get_price_for_currency(first_variant.prices, currency)
            if price_obj:
                price_val = float(price_obj.price)
                compare_at_val = float(price_obj.compare_at_price) if price_obj.compare_at_price else None

        total_stock = sum(v.stock_quantity for v in p.variants if v.is_active)

        results.append(ProductListItemSchema(
            id=p.id,
            slug=p.slug,
            name=t.name,
            tagline=t.tagline or "",
            images=p.images or [],
            is_featured=p.is_featured,
            currency=currency,
            price=price_val,
            compare_at_price=compare_at_val,
            total_stock=total_stock
        ))

    return results

@router.get("/{id_or_slug}", response_model=ProductDetailSchema)
def get_product(
    id_or_slug: str,
    lang: str = Query("en", description="Language code: en, vi, ar"),
    currency: str = Query("USD", description="Currency code: USD, VND, SAR"),
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    if id_or_slug.isdigit():
        prod = query.filter(Product.id == int(id_or_slug)).first()
    else:
        prod = query.filter(Product.slug == id_or_slug).first()

    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    t = get_best_translation(prod.translations, lang)
    if not t:
        raise HTTPException(status_code=404, detail="No translation available")

    # Build variants
    variant_schemas = []
    base_price = 0.0
    base_compare_price = None

    for v in prod.variants:
        if not v.is_active:
            continue
        v_prices = [
            ProductPriceSchema(
                currency=vp.currency,
                price=float(vp.price),
                compare_at_price=float(vp.compare_at_price) if vp.compare_at_price else None
            )
            for vp in v.prices
        ]

        # Localize attribute values if translation is available
        attrs = dict(v.attributes or {})
        if v.attribute_translations and lang in v.attribute_translations:
            attrs.update(v.attribute_translations[lang])

        variant_schemas.append(ProductVariantSchema(
            id=v.id,
            sku=v.sku,
            attributes=attrs,
            attribute_translations=v.attribute_translations or {},
            stock_quantity=v.stock_quantity,
            variant_image=v.variant_image,
            is_active=v.is_active,
            prices=v_prices
        ))

    if variant_schemas:
        first_v = prod.variants[0]
        p_obj = get_price_for_currency(first_v.prices, currency)
        if p_obj:
            base_price = float(p_obj.price)
            base_compare_price = float(p_obj.compare_at_price) if p_obj.compare_at_price else None

    return ProductDetailSchema(
        id=prod.id,
        slug=prod.slug,
        images=prod.images or [],
        is_featured=prod.is_featured,
        is_active=prod.is_active,
        language=t.language,
        name=t.name,
        tagline=t.tagline or "",
        description=t.description or "",
        features=t.features or [],
        specifications=t.specifications or {},
        currency=currency,
        price=base_price,
        compare_at_price=base_compare_price,
        variants=variant_schemas
    )
