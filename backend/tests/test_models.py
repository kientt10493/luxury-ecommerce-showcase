import pytest
import uuid
from app.db.session import Base, engine, SessionLocal
from app.models.product import Product, ProductTranslation, ProductVariant, VariantPrice
from app.models.user import AdminUser
from app.core.security import get_password_hash, verify_password

def test_password_hashing():
    pw = "Secret@123"
    hashed = get_password_hash(pw)
    assert verify_password(pw, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_create_and_query_product_with_translations_and_variants():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    slug = f"test-vision-pro-{uuid.uuid4().hex[:6]}"
    try:
        # Create test product
        prod = Product(slug=slug, images=["https://example.com/img1.jpg"], is_featured=True)
        db.add(prod)
        db.commit()
        db.refresh(prod)

        # Add translations (EN, VI, AR)
        t_en = ProductTranslation(product_id=prod.id, language="en", name="Vision Pro", tagline="Spatial Computer", description="Top luxury", features=["8K Display"], specifications={"weight": "250g"})
        t_vi = ProductTranslation(product_id=prod.id, language="vi", name="Kính Vision Pro", tagline="Máy tính không gian", description="Đỉnh cao công nghệ", features=["Màn hình 8K"], specifications={"trọng lượng": "250g"})
        t_ar = ProductTranslation(product_id=prod.id, language="ar", name="فيجن برو", tagline="كمبيوتر مكاني", description="قمة الفخامة", features=["شاشة 8K"], specifications={"الوزن": "250g"})
        db.add_all([t_en, t_vi, t_ar])

        # Add variant & prices
        variant = ProductVariant(product_id=prod.id, sku=f"VIS-{uuid.uuid4().hex[:6]}", attributes={"color": "Titanium", "storage": "512GB"}, stock_quantity=10)
        db.add(variant)
        db.commit()
        db.refresh(variant)

        p_usd = VariantPrice(variant_id=variant.id, currency="USD", price=1299.00)
        p_vnd = VariantPrice(variant_id=variant.id, currency="VND", price=32500000.00)
        p_sar = VariantPrice(variant_id=variant.id, currency="SAR", price=4870.00)
        db.add_all([p_usd, p_vnd, p_sar])
        db.commit()

        # Query back
        saved = db.query(Product).filter_by(slug=slug).first()
        assert saved is not None
        assert len(saved.translations) == 3
        assert len(saved.variants) == 1
        assert len(saved.variants[0].prices) == 3
        assert saved.translations[0].features == ["8K Display"]
    finally:
        db.close()
