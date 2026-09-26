import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
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
    product_id = variant.product_id
    db.close()

    # 1. Create PayOS VietQR Payment Request
    order_req = {
        "product_id": product_id,
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
    assert "account_number" in data
    order_id = data["order_id"]

    # 2. Check Order is PENDING
    status_resp = client.get(f"/api/v1/orders/{order_id}/status")
    assert status_resp.status_code == 200
    assert status_resp.json()["payment_status"] == "PENDING"

    # 3. Simulate PayOS Webhook
    webhook_payload = {
        "code": "00",
        "desc": "success",
        "data": {
            "orderCode": int(data["gateway_order_code"]),
            "amount": int(data["amount"]),
            "description": f"AURA {order_id}"
        },
        "signature": "simulated_valid_signature"
    }
    hook_resp = client.post("/api/v1/webhooks/payos", json=webhook_payload, headers={"x-mock-test": "true"})
    assert hook_resp.status_code == 200
    assert hook_resp.json()["payment_status"] == "PAID"

    # 4. Check Order is PAID and stock decremented
    status_resp2 = client.get(f"/api/v1/orders/{order_id}/status")
    assert status_resp2.json()["payment_status"] == "PAID"

    db2 = SessionLocal()
    v_updated = db2.query(ProductVariant).filter_by(id=variant_id).first()
    assert v_updated.stock_quantity == initial_stock - 1
    db2.close()

    # 5. Test idempotency (repeated webhook call must NOT decrement again)
    hook_resp2 = client.post("/api/v1/webhooks/payos", json=webhook_payload, headers={"x-mock-test": "true"})
    assert hook_resp2.status_code == 200
    assert hook_resp2.json()["status"] == "ok"

    db3 = SessionLocal()
    v_updated2 = db3.query(ProductVariant).filter_by(id=variant_id).first()
    assert v_updated2.stock_quantity == initial_stock - 1  # Intact!
    db3.close()

def test_stripe_payment_creation_and_webhook():
    seed_data()
    db = SessionLocal()
    variant = db.query(ProductVariant).first()
    initial_stock = variant.stock_quantity
    variant_id = variant.id
    product_id = variant.product_id
    db.close()

    # 1. Create Stripe session
    order_req = {
        "product_id": product_id,
        "variant_id": variant_id,
        "customer_name": "John Doe",
        "customer_email": "john.doe@example.com",
        "customer_phone": "+14155552671",
        "shipping_address": "555 California St, San Francisco, CA",
        "currency": "USD",
        "language": "en"
    }
    resp = client.post("/api/v1/payments/stripe/create-session", json=order_req)
    assert resp.status_code == 200
    data = resp.json()
    assert "order_id" in data
    assert "checkout_url" in data
    order_id = data["order_id"]

    # 2. Check Order is PENDING
    status_resp = client.get(f"/api/v1/orders/{order_id}/status")
    assert status_resp.json()["payment_status"] == "PENDING"

    # 3. Simulate Stripe webhook
    hook_resp = client.post(
        "/api/v1/webhooks/stripe",
        json={"order_id": order_id, "metadata": {"order_id": order_id}},
        headers={"x-mock-test": "true"}
    )
    assert hook_resp.status_code == 200

    # 4. Check Order is PAID
    status_resp2 = client.get(f"/api/v1/orders/{order_id}/status")
    assert status_resp2.json()["payment_status"] == "PAID"

    # 5. Check Idempotency
    hook_resp2 = client.post(
        "/api/v1/webhooks/stripe",
        json={"order_id": order_id},
        headers={"x-mock-test": "true"}
    )
    assert hook_resp2.status_code == 200
    assert "already marked" in hook_resp2.json()["message"]
