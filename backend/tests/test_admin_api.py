import uuid
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
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
    assert token is not None
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Metrics
    metrics_resp = client.get("/api/v1/admin/metrics", headers=headers)
    assert metrics_resp.status_code == 200
    assert "revenue_by_currency" in metrics_resp.json()
    assert "total_products" in metrics_resp.json()

    # 3. Create Product with 3 languages and variants
    slug = f"luxury-aurora-ring-{uuid.uuid4().hex[:6]}"
    sku = f"RING-GLD-{uuid.uuid4().hex[:6]}"
    payload = {
        "slug": slug,
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
                "sku": sku,
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

    # 4. Verify public endpoint sees the newly created product
    pub_resp = client.get(f"/api/v1/products/{created_id}?lang=vi&currency=VND")
    assert pub_resp.status_code == 200
    assert pub_resp.json()["name"] == "Nhẫn Thông Minh Aurora"
    assert pub_resp.json()["price"] == 12500000.00

    # 5. Delete product
    del_resp = client.delete(f"/api/v1/admin/products/{created_id}", headers=headers)
    assert del_resp.status_code == 200
