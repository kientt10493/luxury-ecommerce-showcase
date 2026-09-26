from app.db.session import Base, engine, SessionLocal
from app.models.product import Product, ProductTranslation, ProductVariant, VariantPrice
from app.models.user import AdminUser
from app.core.security import get_password_hash

def seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed Admin User
        admin = db.query(AdminUser).filter_by(username="admin").first()
        if not admin:
            admin = AdminUser(
                username="admin",
                hashed_password=get_password_hash("Admin@2026"),
                role="ADMIN"
            )
            db.add(admin)

        # 2. Seed Flagship Product 1: Aura Vision Pro Max (Spatial Headset)
        p1 = db.query(Product).filter_by(slug="aura-vision-pro").first()
        if not p1:
            p1 = Product(
                slug="aura-vision-pro",
                images=[
                    "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1200&auto=format&fit=crop"
                ],
                is_featured=True,
                is_active=True
            )
            db.add(p1)
            db.flush()

            # Translations (EN, VI, AR)
            t1_en = ProductTranslation(
                product_id=p1.id,
                language="en",
                name="Aura Vision Pro",
                tagline="Welcome to the Era of Spatial Computing",
                description="Engineered with aerospace-grade titanium and bespoke dual micro-OLED 4K displays delivering an unprecedented visual immersion. Experience seamless digital integration into your physical realm with intuitive eye tracking, subtle hand gestures, and hyper-realistic spatial audio.",
                features=[
                    "Dual Micro-OLED 4K Displays with 23 million pixels",
                    "Intuitive 3D Gesture & Sub-millimeter Eye Tracking",
                    "Custom Carbon-Titanium Thermal Acoustic Frame",
                    "Spatial Audio with Dynamic Head Tracking"
                ],
                specifications={
                    "Display": "2x 4K Micro-OLED 120Hz",
                    "Sensors": "12 cameras, 5 sensors, 6 microphones",
                    "Battery": "Up to 3 hours active, external hot-swappable pack",
                    "Weight": "448g lightweight frame",
                    "Materials": "Laminated glass, aerospace aluminum & titanium alloy"
                }
            )

            t1_vi = ProductTranslation(
                product_id=p1.id,
                language="vi",
                name="Kính Không Gian Aura Vision Pro",
                tagline="Kỷ nguyên điện toán không gian đỉnh cao",
                description="Được chế tác từ hợp kim titan hàng không vũ trụ và hệ thống màn hình kép Micro-OLED 4K đột phá mang lại trải nghiệm thị giác ngoạn mục chưa từng có. Hòa quyện thế giới số sống động vào không gian thực của bạn thông qua cử chỉ mắt, tay tinh tế và âm thanh không gian đa chiều.",
                features=[
                    "Màn hình kép Micro-OLED 4K với 23 triệu điểm ảnh siêu nét",
                    "Điều khiển ánh mắt và cử chỉ tay 3D độ chính xác từng milimet",
                    "Khung hợp kim Titan - Carbon tản nhiệt thông minh",
                    "Âm thanh không gian Spatial Audio theo dõi chuyển động đầu"
                ],
                specifications={
                    "Màn hình": "2x Micro-OLED 4K 120Hz",
                    "Cảm biến": "12 camera, 5 cảm biến môi trường, 6 micro định hướng",
                    "Pin": "Khoảng 3 giờ sử dụng liên tục, hỗ trợ thay pin nóng",
                    "Trọng lượng": "448g siêu nhẹ",
                    "Chất liệu": "Kính cường lực quang học, hợp kim titan và nhôm cao cấp"
                }
            )

            t1_ar = ProductTranslation(
                product_id=p1.id,
                language="ar",
                name="نظارة أورا فيجن برو المكانية",
                tagline="مرحباً بك في عصر الحوسبة المكانية الفاخرة",
                description="تمت هندستها من التيتانيوم المستخدم في صناعة الطائرات مع شاشتي Micro-OLED 4K مخصصتين تمنحانك تجربة بصرية فائقة الوضوح. ادمج عالمك الرقمي بسلاسة تامة مع محيطك الحقيقي عبر حركات العين واليد البديهية والصوت المكاني السينمائي.",
                features=[
                    "شاشتان Micro-OLED بدقة 4K مع 23 مليون بكسل فائق الدقة",
                    "تتبع دقيق للغاية لحركة العين وإيماءات اليد ثلاثية الأبعاد",
                    "هيكل حراري وصوتي متطور من التيتانيوم وألياف الكربون",
                    "صوت مكاني ديناميكي مع تتبع ذكي لحركة الرأس"
                ],
                specifications={
                    "الشاشة": "شاشتان Micro-OLED 4K بتردد 120Hz",
                    "المستشعرات": "12 كاميرا، 5 مستشعرات بيئية، 6 ميكروفونات",
                    "البطارية": "حتى 3 ساعات استخدام متواصل مع بطارية خارجية سريعة التبديل",
                    "الوزن": "448 غرام خفيف ومريح",
                    "المواد": "زجاج مقسى مصفح، سبيكة ألمنيوم وتيتانيوم فاخرة"
                }
            )
            db.add_all([t1_en, t1_vi, t1_ar])

            # Variants: Titanium Gray (256GB / 512GB) and Celestial Silver (512GB)
            v1 = ProductVariant(
                product_id=p1.id,
                sku="AURA-VP-GRY-256",
                attributes={"color": "Titanium Gray", "storage": "256GB"},
                attribute_translations={
                    "vi": {"color": "Xám Titan", "storage": "256GB"},
                    "ar": {"color": "رمادي تيتانيوم", "storage": "٢٥٦ جيجابايت"}
                },
                stock_quantity=18,
                variant_image="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop",
                is_active=True
            )
            v2 = ProductVariant(
                product_id=p1.id,
                sku="AURA-VP-GRY-512",
                attributes={"color": "Titanium Gray", "storage": "512GB"},
                attribute_translations={
                    "vi": {"color": "Xám Titan", "storage": "512GB"},
                    "ar": {"color": "رمادي تيتانيوم", "storage": "٥١٢ جيجابايت"}
                },
                stock_quantity=12,
                variant_image="https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=1200&auto=format&fit=crop",
                is_active=True
            )
            v3 = ProductVariant(
                product_id=p1.id,
                sku="AURA-VP-SLV-512",
                attributes={"color": "Celestial Silver", "storage": "512GB"},
                attribute_translations={
                    "vi": {"color": "Bạc Ánh Sao", "storage": "512GB"},
                    "ar": {"color": "فضي سماوي", "storage": "٥١٢ جيجابايت"}
                },
                stock_quantity=8,
                variant_image="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1200&auto=format&fit=crop",
                is_active=True
            )
            db.add_all([v1, v2, v3])
            db.flush()

            # Regional Prices for v1 (256GB)
            db.add_all([
                VariantPrice(variant_id=v1.id, currency="USD", price=1299.00, compare_at_price=1499.00),
                VariantPrice(variant_id=v1.id, currency="VND", price=32500000.00, compare_at_price=36900000.00),
                VariantPrice(variant_id=v1.id, currency="SAR", price=4870.00, compare_at_price=5620.00)
            ])
            # Regional Prices for v2 (512GB)
            db.add_all([
                VariantPrice(variant_id=v2.id, currency="USD", price=1499.00, compare_at_price=1699.00),
                VariantPrice(variant_id=v2.id, currency="VND", price=37500000.00, compare_at_price=41900000.00),
                VariantPrice(variant_id=v2.id, currency="SAR", price=5620.00, compare_at_price=6370.00)
            ])
            # Regional Prices for v3 (Silver 512GB)
            db.add_all([
                VariantPrice(variant_id=v3.id, currency="USD", price=1549.00, compare_at_price=1749.00),
                VariantPrice(variant_id=v3.id, currency="VND", price=38900000.00, compare_at_price=43500000.00),
                VariantPrice(variant_id=v3.id, currency="SAR", price=5810.00, compare_at_price=6560.00)
            ])

        # 3. Seed Flagship Product 2: Chrono Horizon Precision Watch
        p2 = db.query(Product).filter_by(slug="chrono-horizon-watch").first()
        if not p2:
            p2 = Product(
                slug="chrono-horizon-watch",
                images=[
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop"
                ],
                is_featured=False,
                is_active=True
            )
            db.add(p2)
            db.flush()

            db.add_all([
                ProductTranslation(
                    product_id=p2.id,
                    language="en",
                    name="Chrono Horizon Precision Watch",
                    tagline="Mastery of Time & Celestial Engineering",
                    description="Forged from single-block 904L sapphire crystal and ceramic bezel with integrated health telemetry.",
                    features=["Sapphire Crystal 904L", "ECG & Biomarker Telemetry", "100m Water Resistance"],
                    specifications={"Diameter": "42mm", "Battery": "14 Days", "Waterproof": "10 ATM"}
                ),
                ProductTranslation(
                    product_id=p2.id,
                    language="vi",
                    name="Đồng Hồ Chrono Horizon",
                    tagline="Kiệt tác thời gian & Cơ khí chính xác",
                    description="Chế tác từ tinh thể sapphire 904L nguyên khối và viền gốm ceramic tích hợp cảm biến sinh trắc học tiên tiến.",
                    features=["Kính Sapphire 904L chống trầy", "Đo điện tâm đồ ECG & chỉ số sinh học", "Kháng nước 100m"],
                    specifications={"Đường kính": "42mm", "Thời lượng pin": "14 ngày", "Kháng nước": "10 ATM"}
                ),
                ProductTranslation(
                    product_id=p2.id,
                    language="ar",
                    name="ساعة كرونو هورايزون الفاخرة",
                    tagline="إتقان الوقت والهندسة الدقيقة",
                    description="مصنوعة من كريستال الياقوت 904L وإطار سيراميك فائق الصلابة مع قياسات بيومترية دقيقة.",
                    features=["زجاج ياقوتي 904L مقاوم للخدش", "مخطط كهربية القلب ECG ومؤشرات حيوية", "مقاومة الماء حتى 100 متر"],
                    specifications={"القطر": "42 مم", "عمر البطارية": "14 يوماً", "مقاومة الماء": "10 ATM"}
                )
            ])

            v_p2 = ProductVariant(
                product_id=p2.id,
                sku="CHRONO-OBSIDIAN-42",
                attributes={"color": "Obsidian Black", "case": "42mm"},
                attribute_translations={
                    "vi": {"color": "Đen Huyền Vũ", "case": "42mm"},
                    "ar": {"color": "أسود سبجي", "case": "٤٢ مم"}
                },
                stock_quantity=25,
                variant_image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
                is_active=True
            )
            db.add(v_p2)
            db.flush()

            db.add_all([
                VariantPrice(variant_id=v_p2.id, currency="USD", price=899.00, compare_at_price=999.00),
                VariantPrice(variant_id=v_p2.id, currency="VND", price=22500000.00, compare_at_price=24900000.00),
                VariantPrice(variant_id=v_p2.id, currency="SAR", price=3370.00, compare_at_price=3750.00)
            ])

        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
    print("Database seeded successfully with luxury products, EN/VI/AR translations, and regional pricing!")
