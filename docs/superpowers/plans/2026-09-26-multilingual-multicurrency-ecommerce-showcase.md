# Multilingual & Multi-Currency E-Commerce Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng hoàn chỉnh nền tảng web thương mại điện tử giới thiệu sản phẩm cao cấp (Shopify/Apple-like) đa ngôn ngữ (EN, VI, AR hỗ trợ RTL), đa tiền tệ (USD, VND, SAR theo đơn giá cố định từng vùng), tích hợp cổng thanh toán kép quốc tế (Stripe) và nội địa (PayOS VietQR) cùng trang quản trị Admin.

**Architecture:** Decoupled Architecture gồm FastAPI Backend (Python 3.14) xử lý logic nghiệp vụ, tính toán đơn giá theo vùng, bảo mật JWT và xác thực HMAC Webhooks cho Stripe/PayOS; Frontend React Vite tối ưu trải nghiệm người dùng cao cấp, quản lý ngôn ngữ LTR/RTL tự động, đồng bộ tiền tệ và tích hợp Admin Dashboard.

**Tech Stack:** 
- Backend: Python 3.14, FastAPI, Uvicorn, SQLAlchemy, SQLite/PostgreSQL, Pydantic v2, PyJWT, passlib/bcrypt, stripe, payos, pytest, httpx.
- Frontend: React 18/19, Vite, TailwindCSS / CSS Logical properties, Lucide React, Canvas-confetti.

**Spec:** `docs/superpowers/specs/2026-09-26-multilingual-multicurrency-ecommerce-showcase-design.md`

## Global Constraints

- Hỗ trợ 3 ngôn ngữ: `en` (US, LTR), `vi` (Vietnam, LTR), `ar` (Arabic, RTL với font Cairo).
- Hỗ trợ 3 loại tiền tệ: `USD` ($), `VND` (₫), `SAR` (﷼) gắn liền với đơn giá định riêng (Fixed Regional Pricing).
- Khi đổi ngôn ngữ sang Tiếng Việt -> tự động chọn VND; Tiếng Anh -> USD; Tiếng Ả Rập -> SAR.
- Cổng thanh toán quốc tế: Stripe (Card/Apple Pay). Cổng thanh toán nội địa: PayOS VietQR (quét mã QR ngân hàng tự động).
- Mọi Webhook bắt buộc phải kiểm tra chữ ký số HMAC và xử lý idempotent (không trừ kho 2 lần).

---

### Task 1: Backend Foundation, Data Models & Seed Data

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/app/core/config.py`
- Create: `backend/app/core/security.py`
- Create: `backend/app/db/session.py`
- Create: `backend/app/models/product.py`
- Create: `backend/app/models/order.py`
- Create: `backend/app/models/user.py`
- Create: `backend/app/db/seed.py`
- Create: `backend/main.py`
- Test: `backend/tests/test_models.py`

**Interfaces:**
- Produces: SQLAlchemy ORM models (`Product`, `ProductTranslation`, `ProductVariant`, `VariantPrice`, `Order`, `AdminUser`), `get_db` dependency, `verify_password()`, `get_password_hash()`, `create_access_token()`.

- [ ] **Step 1: Write the failing test for models and db initialization**

```python
# backend/tests/test_models.py
import pytest
from app.db.session import Base, engine, SessionLocal
from app.models.product import Product, ProductTranslation, ProductVariant, VariantPrice
from app.models.user import AdminUser
from app.core.security import get_password_hash, verify_password

def test_create_and_query_product_with_translations_and_variants():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Create test product
        prod = Product(slug="test-vision-pro", images=["https://example.com/img1.jpg"], is_featured=True)
        db.add(prod)
        db.commit()
        db.refresh(prod)

        # Add translations (EN, VI, AR)
        t_en = ProductTranslation(product_id=prod.id, language="en", name="Vision Pro", tagline="Spatial Computer", description="Top luxury", features=["8K Display"], specifications={"weight": "250g"})
        t_vi = ProductTranslation(product_id=prod.id, language="vi", name="Kính Vision Pro", tagline="Máy tính không gian", description="Đỉnh cao công nghệ", features=["Màn hình 8K"], specifications={"trọng lượng": "250g"})
        t_ar = ProductTranslation(product_id=prod.id, language="ar", name="فيجن برو", tagline="كمبيوتر مكاني", description="قمة الفخامة", features=["شاشة 8K"], specifications={"الوزن": "250g"})
        db.add_all([t_en, t_vi, t_ar])

        # Add variant & prices
        variant = ProductVariant(product_id=prod.id, sku="VIS-BLK-512", attributes={"color": "Titanium", "storage": "512GB"}, stock_quantity=10)
        db.add(variant)
        db.commit()
        db.refresh(variant)

        p_usd = VariantPrice(variant_id=variant.id, currency="USD", price=1299.00)
        p_vnd = VariantPrice(variant_id=variant.id, currency="VND", price=32500000.00)
        p_sar = VariantPrice(variant_id=variant.id, currency="SAR", price=4870.00)
        db.add_all([p_usd, p_vnd, p_sar])
        db.commit()

        # Query back
        saved = db.query(Product).filter_by(slug="test-vision-pro").first()
        assert saved is not None
        assert len(saved.translations) == 3
        assert len(saved.variants) == 1
        assert len(saved.variants[0].prices) == 3
    finally:
        db.close()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_models.py`
Expected: FAIL (modules not found)

- [ ] **Step 3: Setup requirements and implement configuration, security, session, and models**

Install dependencies:
```bash
pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings python-jose passlib bcrypt python-multipart pytest httpx
```

Write `backend/app/core/config.py`:
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Luxury E-Commerce Showcase API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "luxury-super-secret-key-change-in-prod-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    DATABASE_URL: str = "sqlite:///./showcase.db"
    
    # Payments
    STRIPE_API_KEY: str = "sk_test_placeholder"
    STRIPE_WEBHOOK_SECRET: str = "whsec_placeholder"
    PAYOS_CLIENT_ID: str = "payos_client_id_placeholder"
    PAYOS_API_KEY: str = "payos_api_key_placeholder"
    PAYOS_CHECKSUM_KEY: str = "payos_checksum_key_placeholder"
    
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
```

Write `backend/app/core/security.py`:
```python
from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(subject: str, expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
```

Write `backend/app/db/session.py`:
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

Write `backend/app/models/product.py`:
```python
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, JSON, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    images = Column(JSON, default=list)  # list of URLs
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    translations = relationship("ProductTranslation", back_populates="product", cascade="all, delete-orphan")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="product")

class ProductTranslation(Base):
    __tablename__ = "product_translations"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    language = Column(String(10), nullable=False, index=True)  # 'en', 'vi', 'ar'
    name = Column(String(255), nullable=False)
    tagline = Column(String(255), default="")
    description = Column(Text, default="")
    features = Column(JSON, default=list)  # list of strings
    specifications = Column(JSON, default=dict)  # dict {spec_name: spec_val}

    product = relationship("Product", back_populates="translations")

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    attributes = Column(JSON, default=dict)  # {"color": "Titanium Gray", "storage": "512GB"}
    attribute_translations = Column(JSON, default=dict)  # {"vi": {"color": "Xám Titan"}}
    stock_quantity = Column(Integer, default=10)
    variant_image = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)

    product = relationship("Product", back_populates="variants")
    prices = relationship("VariantPrice", back_populates="variant", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="variant")

class VariantPrice(Base):
    __tablename__ = "variant_prices"

    id = Column(Integer, primary_key=True, index=True)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=False)
    currency = Column(String(10), nullable=False, index=True)  # 'USD', 'VND', 'SAR'
    price = Column(Numeric(12, 2), nullable=False)
    compare_at_price = Column(Numeric(12, 2), nullable=True)

    variant = relationship("ProductVariant", back_populates="prices")
```

Write `backend/app/models/order.py`:
```python
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(64), primary_key=True, index=True)  # ORD-2026-XXXXX
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=True)
    variant_snapshot = Column(JSON, default=dict)
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    shipping_address = Column(String(500), default="")
    currency = Column(String(10), nullable=False)  # USD, VND, SAR
    amount = Column(Numeric(12, 2), nullable=False)
    language = Column(String(10), default="en")
    payment_method = Column(String(50), default="STRIPE")  # STRIPE, PAYOS_VIETQR
    payment_status = Column(String(50), default="PENDING")  # PENDING, PAID, FAILED, REFUNDED
    gateway_ref_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    product = relationship("Product", back_populates="orders")
    variant = relationship("ProductVariant", back_populates="orders")
```

Write `backend/app/models/user.py`:
```python
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime
from app.db.session import Base

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="ADMIN")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
```

Write `backend/app/db/seed.py`:
Create initial luxury showcase products (Aura Horizon Smart Watch & Vision Spatial Headset) with EN/VI/AR translations, variants with distinct colors & storage, USD/VND/SAR regional pricing, and an admin user (`admin` / `Admin@2026`).

Write `backend/main.py`:
FastAPI application with CORS middleware enabled for all origins / `http://localhost:5173`.

- [ ] **Step 4: Run tests to verify pass**

Run: `pytest backend/tests/test_models.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/
git commit -m "feat(backend): setup foundation, database models, security and seed data"
```

---

### Task 2: Backend Catalog & Multi-Language / Regional Pricing API

**Files:**
- Create: `backend/app/schemas/product.py`
- Create: `backend/app/api/v1/products.py`
- Modify: `backend/main.py`
- Test: `backend/tests/test_products_api.py`

**Interfaces:**
- Produces: `GET /api/v1/products?lang=en&currency=USD` (returns list of active products formatted for selected language and currency), `GET /api/v1/products/{id_or_slug}?lang=en&currency=USD` (returns full detail with all variants and pricing).

- [ ] **Step 1: Write the failing test for product catalog endpoints**

```python
# backend/tests/test_products_api.py
from fastapi.testclient import TestClient
from main import app
from app.db.seed import seed_data

client = TestClient(app)

def test_get_products_with_language_and_currency():
    seed_data()
    # Test English + USD
    resp_en = client.get("/api/v1/products?lang=en&currency=USD")
    assert resp_en.status_code == 200
    items = resp_en.json()
    assert len(items) > 0
    assert "name" in items[0]
    assert items[0]["currency"] == "USD"
    assert items[0]["price"] > 0

    # Test Vietnamese + VND
    resp_vi = client.get("/api/v1/products?lang=vi&currency=VND")
    assert resp_vi.status_code == 200
    items_vi = resp_vi.json()
    assert items_vi[0]["currency"] == "VND"
    assert items_vi[0]["price"] >= 1000000  # VND prices are large integers

    # Test Arabic + SAR
    resp_ar = client.get("/api/v1/products?lang=ar&currency=SAR")
    assert resp_ar.status_code == 200
    items_ar = resp_ar.json()
    assert items_ar[0]["currency"] == "SAR"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_products_api.py`
Expected: FAIL (404 Not Found)

- [ ] **Step 3: Implement product schemas & endpoint router**

Implement `backend/app/schemas/product.py` with Pydantic models for product detail, variants, translations, and regional pricing resolution.
Implement `backend/app/api/v1/products.py`:
- Handle fallback language if translation for requested lang is missing (default to `en`).
- Handle regional pricing lookup for variant and currency (default to `USD` if currency missing).
- Return cleanly structured response containing localized strings and variant options.
Register router in `backend/main.py`.

- [ ] **Step 4: Run test to verify pass**

Run: `pytest backend/tests/test_products_api.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/
git commit -m "feat(backend): implement product catalog API with multi-language and regional pricing"
```

---

### Task 3: Backend Admin Authentication & Product Management CRUD

**Files:**
- Create: `backend/app/schemas/admin.py`
- Create: `backend/app/api/v1/auth.py`
- Create: `backend/app/api/v1/admin.py`
- Modify: `backend/main.py`
- Test: `backend/tests/test_admin_api.py`

**Interfaces:**
- Produces: `POST /api/v1/auth/login`, `POST /api/v1/admin/products`, `PUT /api/v1/admin/products/{id}`, `DELETE /api/v1/admin/products/{id}`, `GET /api/v1/admin/metrics`, `GET /api/v1/admin/orders`.
- Consumes: `verify_password()`, `create_access_token()`, `get_current_admin()` dependency.

- [ ] **Step 1: Write the failing test for Admin Auth and CRUD**

```python
# backend/tests/test_admin_api.py
from fastapi.testclient import TestClient
from main import app
from app.db.seed import seed_data

client = TestClient(app)

def test_admin_login_and_crud():
    seed_data()
    # 1. Login
    login_resp = client.post("/api/v1/auth/login", data={"username": "admin", "password": "Admin@2026"})
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Metrics
    metrics_resp = client.get("/api/v1/admin/metrics", headers=headers)
    assert metrics_resp.status_code == 200
    assert "revenue_by_currency" in metrics_resp.json()

    # 3. Create Product with 3 languages and variants
    payload = {
        "slug": "luxury-aurora-ring",
        "images": ["https://images.unsplash.com/photo-1605100804763-247f67b3557e"],
        "is_featured": False,
        "is_active": True,
        "translations": [
            {"language": "en", "name": "Aurora Smart Ring", "tagline": "Bio-tracking luxury", "description": "Pure titanium", "features": ["Sleep tracking"], "specifications": {"Material": "Titanium"}},
            {"language": "vi", "name": "Nhẫn Thông Minh Aurora", "tagline": "Trang sức theo dõi sức khỏe", "description": "Titan nguyên khối", "features": ["Theo dõi giấc ngủ"], "specifications": {"Chất liệu": "Titanium"}},
            {"language": "ar", "name": "خاتم أورورا الذكي", "tagline": "فخامة التتبع الحيوي", "description": "تيتانيوم نقي", "features": ["تتبع النوم"], "specifications": {"المادة": "تيتانيوم"}}
        ],
        "variants": [
            {
                "sku": "RING-GLD-8",
                "attributes": {"color": "Gold", "size": "8"},
                "stock_quantity": 15,
                "prices": [
                    {"currency": "USD", "price": 499.00},
                    {"currency": "VND", "price": 12500000.00},
                    {"currency": "SAR", "price": 1870.00}
                ]
            }
        ]
    }
    create_resp = client.post("/api/v1/admin/products", json=payload, headers=headers)
    assert create_resp.status_code == 201
    created_id = create_resp.json()["id"]

    # 4. Verify public endpoint sees the new product
    pub_resp = client.get(f"/api/v1/products/{created_id}?lang=vi&currency=VND")
    assert pub_resp.status_code == 200
    assert pub_resp.json()["name"] == "Nhẫn Thông Minh Aurora"
    assert pub_resp.json()["price"] == 12500000.00
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_admin_api.py`
Expected: FAIL (404 Not Found)

- [ ] **Step 3: Implement Auth, Admin routes & security dependencies**

Write `backend/app/api/v1/auth.py` with OAuth2 password request form handler.
Write `backend/app/api/v1/admin.py` with:
- `get_current_admin` JWT token validation dependency.
- CRUD handlers for products with nested translation and variant saving.
- Revenue metrics breakdown by currency (`USD`, `VND`, `SAR`).
- Orders listing for admin with pagination.
Register routers in `backend/main.py`.

- [ ] **Step 4: Run test to verify pass**

Run: `pytest backend/tests/test_admin_api.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/
git commit -m "feat(backend): implement admin authentication, metrics, and product CRUD"
```

---

### Task 4: Backend Payment Gateways (Stripe & PayOS/VietQR) and Webhooks

**Files:**
- Create: `backend/app/schemas/payment.py`
- Create: `backend/app/services/payment_service.py`
- Create: `backend/app/api/v1/payments.py`
- Create: `backend/app/api/v1/webhooks.py`
- Modify: `backend/main.py`
- Test: `backend/tests/test_payments_webhooks.py`

**Interfaces:**
- Produces: `POST /api/v1/payments/stripe/create-session`, `POST /api/v1/payments/payos/create-payment`, `POST /api/v1/webhooks/stripe`, `POST /api/v1/webhooks/payos`, `GET /api/v1/orders/{id}/status`.
- Guarantees: HMAC signature verification, idempotent stock decrement (`stock_quantity -= 1`), order status transition to `PAID`.

- [ ] **Step 1: Write the failing test for Payments & Webhooks**

```python
# backend/tests/test_payments_webhooks.py
from fastapi.testclient import TestClient
from main import app
from app.db.seed import seed_data
from app.db.session import SessionLocal
from app.models.product import ProductVariant
from app.models.order import Order

client = TestClient(app)

def test_payos_payment_creation_and_webhook():
    seed_data()
    db = SessionLocal()
    variant = db.query(ProductVariant).first()
    initial_stock = variant.stock_quantity
    variant_id = variant.id
    db.close()

    # 1. Create PayOS VietQR Payment Request
    order_req = {
        "product_id": variant.product_id,
        "variant_id": variant_id,
        "customer_name": "Nguyen Van A",
        "customer_email": "nguyenvana@example.com",
        "customer_phone": "0912345678",
        "shipping_address": "123 Le Loi, Q1, TP HCM",
        "currency": "VND",
        "language": "vi"
    }
    resp = client.post("/api/v1/payments/payos/create-payment", json=order_req)
    assert resp.status_code == 200
    data = resp.json()
    assert "order_id" in data
    assert "qr_code" in data
    order_id = data["order_id"]

    # 2. Check Order is PENDING
    status_resp = client.get(f"/api/v1/orders/{order_id}/status")
    assert status_resp.json()["payment_status"] == "PENDING"

    # 3. Simulate PayOS Webhook
    webhook_payload = {
        "code": "00",
        "desc": "success",
        "data": {
            "orderCode": int(data["gateway_order_code"]),
            "amount": int(data["amount"]),
            "description": f"Thanh toan {order_id}"
        },
        "signature": "simulated_valid_signature"
    }
    hook_resp = client.post("/api/v1/webhooks/payos", json=webhook_payload, headers={"x-mock-test": "true"})
    assert hook_resp.status_code == 200

    # 4. Check Order is PAID and stock decremented
    status_resp2 = client.get(f"/api/v1/orders/{order_id}/status")
    assert status_resp2.json()["payment_status"] == "PAID"

    db2 = SessionLocal()
    v_updated = db2.query(ProductVariant).filter_by(id=variant_id).first()
    assert v_updated.stock_quantity == initial_stock - 1
    db2.close()

    # 5. Test idempotency (repeat webhook call)
    hook_resp2 = client.post("/api/v1/webhooks/payos", json=webhook_payload, headers={"x-mock-test": "true"})
    assert hook_resp2.status_code == 200
    db3 = SessionLocal()
    v_updated2 = db3.query(ProductVariant).filter_by(id=variant_id).first()
    assert v_updated2.stock_quantity == initial_stock - 1  # Not decremented again!
    db3.close()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_payments_webhooks.py`
Expected: FAIL (404 Not Found)

- [ ] **Step 3: Implement payment services, endpoints, and webhook listeners**

Implement `backend/app/services/payment_service.py`:
- Stripe session creator (with mock fallback for sandbox testing when Stripe API keys are not yet configured).
- PayOS QR generator (with standard VietQR specification generator for local demonstration).
Implement `backend/app/api/v1/payments.py` and `backend/app/api/v1/webhooks.py`:
- HMAC signature checks.
- Order update to `PAID`.
- Safe stock deduction with database locks/atomic checks.
Register in `backend/main.py`.

- [ ] **Step 4: Run test to verify pass**

Run: `pytest backend/tests/test_payments_webhooks.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/
git commit -m "feat(backend): implement Stripe, PayOS VietQR payments, and idempotent webhooks"
```

---

### Task 5: Frontend Foundation, i18n & Dynamic Multi-Currency Engine

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.js`
- Create: `frontend/index.html`
- Create: `frontend/src/styles/globals.css`
- Create: `frontend/public/locales/en.json`
- Create: `frontend/public/locales/vi.json`
- Create: `frontend/public/locales/ar.json`
- Create: `frontend/src/contexts/LanguageContext.jsx`
- Create: `frontend/src/contexts/CurrencyContext.jsx`
- Create: `frontend/src/services/api.js`
- Create: `frontend/src/App.jsx`
- Create: `frontend/src/main.jsx`

**Interfaces:**
- Produces: `useLanguage()` hook (provides `language`, `setLanguage`, `t(key)`, `isRTL`), `useCurrency()` hook (provides `currency`, `setCurrency`, `formatPrice(amount, curr)`), Axios API client configured to pass `lang` and `currency`.

- [ ] **Step 1: Scaffold Frontend with Vite & install dependencies**

```bash
cd "e:\AI\Build Website\frontend"
npm install lucide-react canvas-confetti axios
```

- [ ] **Step 2: Create translations JSON (EN, VI, AR)**

Provide comprehensive translations for navbar, hero, variant selection, checkout modal, VietQR instructions, Stripe card inputs, order confirmation, and admin portal.

- [ ] **Step 3: Implement LanguageContext with automatic RTL & Cairo font switching**

In `LanguageContext.jsx`:
- When `language === 'ar'`, set `document.documentElement.dir = 'rtl'` and `document.documentElement.lang = 'ar'`.
- When `language !== 'ar'`, set `document.documentElement.dir = 'ltr'` and `document.documentElement.lang = language`.
- Automatically invoke `setCurrency('SAR')` on Arabic, `setCurrency('VND')` on Vietnamese, and `setCurrency('USD')` on English.

- [ ] **Step 4: Implement CurrencyContext with Intl.NumberFormat**

In `CurrencyContext.jsx`:
- Formats `USD` as `$1,299.00`, `VND` as `32.500.000 ₫`, `SAR` as `4,870 ر.س`.

- [ ] **Step 5: Test language & currency switching in Vite dev server**

Run: `npm run build`
Expected: Build succeeds without error.

- [ ] **Step 6: Commit**

```bash
git add frontend/
git commit -m "feat(frontend): initialize Vite React, i18n engine with RTL, and dynamic currency context"
```

---

### Task 6: Storefront Luxury Showcase, Variant Picker & Specifications

**Files:**
- Create: `frontend/src/components/navbar/Navbar.jsx`
- Create: `frontend/src/components/showcase/HeroShowcase.jsx`
- Create: `frontend/src/components/showcase/VariantPicker.jsx`
- Create: `frontend/src/components/showcase/BentoFeatures.jsx`
- Create: `frontend/src/components/showcase/TechSpecs.jsx`
- Create: `frontend/src/pages/HomePage.jsx`
- Modify: `frontend/src/App.jsx`

**Interfaces:**
- Produces: Complete luxury product showcase storefront that smoothly reacts to language changes, variant selection, and currency shifts.

- [ ] **Step 1: Build Luxury Navbar**

Implement brand mark, language dropdown (`EN 🇺🇸`, `VI 🇻🇳`, `AR 🇸🇦`), currency badge, navigation links, and link to `/admin`.

- [ ] **Step 2: Build HeroShowcase component**

High-resolution visual display, dynamic product title & tagline, interactive CTA button with localized price.

- [ ] **Step 3: Build VariantPicker component**

Interactive color swatches with active ring, storage/edition chips, real-time stock indicator, and price differential display.

- [ ] **Step 4: Build BentoFeatures & TechSpecs**

Bento-grid highlighting camera/sensor/battery capabilities, and tabbed tech specifications table with full RTL support.

- [ ] **Step 5: Verify build & visual responsiveness**

Run: `npm run build`
Expected: Build succeeds cleanly.

- [ ] **Step 6: Commit**

```bash
git add frontend/
git commit -m "feat(frontend): implement luxury storefront, variant selector, and tech specs"
```

---

### Task 7: Quick Buy Checkout Modal, VietQR Dynamic Scanner & Stripe Trigger

**Files:**
- Create: `frontend/src/components/checkout/QuickBuyModal.jsx`
- Create: `frontend/src/components/checkout/VietQRModal.jsx`
- Create: `frontend/src/pages/OrderSuccessPage.jsx`
- Modify: `frontend/src/pages/HomePage.jsx`

**Interfaces:**
- Produces: Direct checkout modal with localized fields, automatic gateway selection (VietQR for VN, Stripe for International), 15-minute countdown QR code with auto-polling for payment confirmation, and confetti-powered Order Success page.

- [ ] **Step 1: Build QuickBuyModal**

Form collecting Customer Name, Email, Phone, Shipping Address. Automatically detects whether VietQR or Stripe should be default based on selected currency.

- [ ] **Step 2: Build VietQRModal with live status polling**

When VietQR is chosen:
- Renders bank name, account number, account holder, amount, transfer memo, and dynamic QR image.
- Starts polling `GET /api/v1/orders/{order_id}/status` every 2 seconds.
- Upon `payment_status === 'PAID'`, triggers celebratory animation and redirects to `/order-success`.

- [ ] **Step 3: Build Stripe trigger & OrderSuccessPage**

Renders order receipt, item variant snapshot, tracking timeline, and customer support details.

- [ ] **Step 4: Verify modal workflows & build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/
git commit -m "feat(frontend): implement Quick Buy modal, VietQR dynamic scanner, and order success flow"
```

---

### Task 8: Admin Dashboard Frontend (`/admin`)

**Files:**
- Create: `frontend/src/components/admin/AdminLogin.jsx`
- Create: `frontend/src/components/admin/MetricsCards.jsx`
- Create: `frontend/src/components/admin/ProductListTable.jsx`
- Create: `frontend/src/components/admin/ProductModal.jsx`
- Create: `frontend/src/components/admin/OrderListTable.jsx`
- Create: `frontend/src/pages/AdminPage.jsx`
- Modify: `frontend/src/App.jsx`

**Interfaces:**
- Produces: Complete admin dashboard at `/admin` with JWT login, revenue metrics by currency, product CRUD modal with 3-language tabs (EN, VI, AR with RTL editor), variant manager, and live order tracking table.

- [ ] **Step 1: Build AdminLogin and JWT state persistence**

Store JWT in `localStorage`, handle login errors, and auto-logout on 401.

- [ ] **Step 2: Build MetricsCards and OrderListTable**

Display revenue in USD, VND, SAR. Display orders list with status badges (`PAID` in green, `PENDING` in yellow).

- [ ] **Step 3: Build ProductModal for creating & editing products**

Tabbed multi-language editor (Tab EN, Tab VI, Tab AR with `dir="rtl"` textareas), variant manager with SKU, stock quantity, and 3 currency prices (USD, VND, SAR).

- [ ] **Step 4: Verify Admin flows and build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/
git commit -m "feat(frontend): implement admin dashboard, product editor with 3-language tabs, and order tracker"
```

---

### Task 9: End-to-End Integration, Verification & Demonstration

**Files:**
- Create: `scripts/run_dev.ps1`
- Test: Full End-to-End browser walkthrough via `browser_subagent`

**Verification Steps:**
- [ ] **Step 1: Start Backend server & seed initial data**
- [ ] **Step 2: Start Frontend Vite server**
- [ ] **Step 3: Test language switching: Toggle EN -> VI -> AR. Verify RTL layout and Cairo font.**
- [ ] **Step 4: Test currency binding: Verify USD ($) in EN, VND (₫) in VI, SAR (﷼) in AR.**
- [ ] **Step 5: Test variant picker: Select color and storage, verify price update.**
- [ ] **Step 6: Test VietQR payment flow in Quick Buy modal.**
- [ ] **Step 7: Test Stripe checkout session trigger.**
- [ ] **Step 8: Access `/admin`, login as admin, add new product, verify live storefront update.**
- [ ] **Step 9: Commit final integration**

```bash
git add .
git commit -m "chore: complete end-to-end integration and verification"
```
