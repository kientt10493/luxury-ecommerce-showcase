from fastapi.testclient import TestClient
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app
from app.db.seed import seed_data

client = TestClient(app)

def test_get_products_with_language_and_currency():
    seed_data()
    # 1. Test English + USD
    resp_en = client.get("/api/v1/products?lang=en&currency=USD")
    assert resp_en.status_code == 200
    items = resp_en.json()
    assert len(items) > 0
    assert "name" in items[0]
    assert items[0]["currency"] == "USD"
    assert items[0]["price"] > 0
    assert "tagline" in items[0]

    # 2. Test Vietnamese + VND
    resp_vi = client.get("/api/v1/products?lang=vi&currency=VND")
    assert resp_vi.status_code == 200
    items_vi = resp_vi.json()
    assert items_vi[0]["currency"] == "VND"
    assert items_vi[0]["price"] >= 1000000  # VND prices are in millions

    # 3. Test Arabic + SAR
    resp_ar = client.get("/api/v1/products?lang=ar&currency=SAR")
    assert resp_ar.status_code == 200
    items_ar = resp_ar.json()
    assert items_ar[0]["currency"] == "SAR"

def test_get_product_detail_and_variants():
    seed_data()
    # Query product by slug
    resp = client.get("/api/v1/products/aura-vision-pro?lang=en&currency=USD")
    assert resp.status_code == 200
    detail = resp.json()
    assert detail["name"] == "Aura Vision Pro"
    assert len(detail["variants"]) >= 3
    assert len(detail["features"]) > 0
    assert len(detail["specifications"]) > 0

    # Verify Arabic translation of same product
    resp_ar = client.get("/api/v1/products/aura-vision-pro?lang=ar&currency=SAR")
    assert resp_ar.status_code == 200
    detail_ar = resp_ar.json()
    assert "فيجن" in detail_ar["name"]
    assert detail_ar["currency"] == "SAR"
