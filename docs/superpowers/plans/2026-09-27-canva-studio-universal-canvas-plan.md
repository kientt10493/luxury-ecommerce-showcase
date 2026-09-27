# Canva Studio Universal Canvas, Page Resizer & Expanded Asset Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai hệ thống Canva Studio Universal Canvas toàn diện: chỉnh sửa kích thước trang (Length + Width), biến toàn bộ phần tử UI trên trang thành dạng có thể sửa/xóa/khôi phục/tạo mới, và mở rộng kho mẫu nút bấm cùng ký hiệu phong phú.

**Architecture:** Quản lý tập trung trạng thái `pageDimensions` và `hiddenElements` tại `HomePage.jsx`, bọc toàn trang bằng container co giãn động; tạo các module presets nút (`buttonPresets.js`) và ký hiệu (`symbolPresets.js`); cập nhật `CanvaDrawer.jsx` và `CanvaOverlay.jsx` để hỗ trợ Universal Selection, Mini Action Bar, Xóa/Ẩn và Khôi phục phần tử.

**Tech Stack:** React 18, Tailwind CSS v4, Lucide React, Axios, Vite.

**Spec:** [docs/superpowers/specs/2026-09-27-canva-studio-universal-canvas-design.md](file:///e:/AI/Build%20Website/docs/superpowers/specs/2026-09-27-canva-studio-universal-canvas-design.md)

## Global Constraints
- Phải giữ nguyên vẹn toàn bộ chức năng thương mại điện tử: giỏ hàng, đa tiền tệ (USD/VND/SAR), đa ngôn ngữ (EN/VI/AR), thanh toán PayOS / VietQR / Stripe.
- Không gây lỗi trắng trang hoặc crash khi render; luôn có fallback an toàn cho mảng và object rỗng.
- Tất cả phím tắt (`Delete`, `Backspace`, `Ctrl+Z`, `Ctrl+Y`) phải được kiểm tra cẩn thận để không ảnh hưởng khi người dùng đang gõ trong ô `<input>` hoặc `<textarea>`.

---

### Task 1: Tạo Module Presets Nút Bấm Đẳng Cấp (`buttonPresets.js`)

**Files:**
- Create: `frontend/src/components/common/canva/buttonPresets.js`

**Interfaces:**
- Produces: `BUTTON_PRESETS` (Mảng chứa 12+ mẫu nút bấm đa dạng: Apple Liquid Glass, 24K Luxury Gold, Cyberpunk Neon Cyan/Emerald/Ruby/Violet, Titanium Minimalist, 3D Skeuomorphic, Quick Buy Lightning, Cart CTA, Concierge Hotline).

- [ ] **Step 1: Tạo file `buttonPresets.js` với đầy đủ mẫu nút bấm**

```javascript
export const BUTTON_PRESETS = [
  {
    id: 'btn-apple-glass',
    name: 'Apple Liquid Glass',
    desc: 'Kính mờ xuyên thấu bo tròn sang trọng',
    category: 'luxury',
    text: 'Khám Phá Ngay',
    style: {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      border: '1px solid rgba(255, 255, 255, 0.28)',
      borderRadius: '9999px',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: 14,
      padding: '10px 26px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)'
    }
  },
  {
    id: 'btn-gold-luxury',
    name: '24K Luxury Gold Foil',
    desc: 'Ánh kim vàng hoàng gia cao cấp',
    category: 'luxury',
    text: 'Sở Hữu Ngay · $1,299',
    style: {
      background: 'linear-gradient(135deg, #fde047 0%, #ca8a04 100%)',
      border: '1px solid rgba(254, 240, 138, 0.5)',
      borderRadius: '9999px',
      color: '#000000',
      fontWeight: '700',
      fontSize: 14,
      padding: '12px 28px',
      boxShadow: '0 0 25px rgba(234, 179, 8, 0.45)'
    }
  },
  {
    id: 'btn-neon-cyan',
    name: 'Cyberpunk Neon Cyan',
    desc: 'Laser xanh công nghệ không gian',
    category: 'cyber',
    text: '⚡ KÍCH HOẠT SẢN PHẨM',
    style: {
      backgroundColor: 'rgba(6, 182, 212, 0.15)',
      border: '1.5px solid #06b6d4',
      borderRadius: '14px',
      color: '#22d3ee',
      fontWeight: '700',
      fontSize: 13,
      padding: '10px 24px',
      letterSpacing: '0.08em',
      boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'
    }
  },
  {
    id: 'btn-neon-emerald',
    name: 'Emerald Laser Glow',
    desc: 'Xanh ngọc lục bảo phát sáng',
    category: 'cyber',
    text: '✓ ĐẶT HÀNG NHẬN NGAY',
    style: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      border: '1px solid #34d399',
      borderRadius: '9999px',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: 13,
      padding: '10px 24px',
      boxShadow: '0 0 22px rgba(16, 185, 129, 0.45)'
    }
  },
  {
    id: 'btn-neon-ruby',
    name: 'Ruby Crimson Pulse',
    desc: 'Đỏ rực bùng cháy thu hút ánh nhìn',
    category: 'cyber',
    text: 'ƯU ĐÃI ĐỘC QUYỀN -20%',
    style: {
      background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
      border: '1px solid #fb7185',
      borderRadius: '9999px',
      color: '#ffffff',
      fontWeight: '700',
      fontSize: 13,
      padding: '10px 24px',
      boxShadow: '0 0 25px rgba(244, 63, 94, 0.45)'
    }
  },
  {
    id: 'btn-neon-violet',
    name: 'Violet Space Cyber',
    desc: 'Tím vũ trụ huyền bí',
    category: 'cyber',
    text: 'TRẢI NGHIỆM AR / VR',
    style: {
      background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
      border: '1px solid #c084fc',
      borderRadius: '16px',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: 13,
      padding: '10px 24px',
      boxShadow: '0 0 22px rgba(168, 85, 247, 0.45)'
    }
  },
  {
    id: 'btn-titanium-pill',
    name: 'Titanium Minimalist Pill',
    desc: 'Khung kim loại tối giản Apple Store',
    category: 'minimal',
    text: 'Xem Chi Tiết Kỹ Thuật ›',
    style: {
      backgroundColor: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      borderRadius: '9999px',
      color: '#f5f5f7',
      fontWeight: '500',
      fontSize: 14,
      padding: '10px 24px'
    }
  },
  {
    id: 'btn-3d-depth',
    name: '3D Modern Skeuomorphic',
    desc: 'Nổi khối có độ sâu xúc giác',
    category: 'modern',
    text: 'Thêm Vào Giỏ Hàng',
    style: {
      backgroundColor: '#1f1f23',
      border: '1px solid #333338',
      borderRadius: '16px',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: 14,
      padding: '12px 26px',
      boxShadow: '0 5px 0 #0c0c0e, 0 10px 20px rgba(0,0,0,0.6)'
    }
  },
  {
    id: 'btn-quick-lightning',
    name: 'Quick Buy Lightning',
    desc: 'Nút Mua Tức Thì kèm biểu tượng tia sét',
    category: 'ecommerce',
    text: '⚡ Mua Nhanh Siêu Tốc',
    style: {
      background: 'linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)',
      border: '1px solid #fde047',
      borderRadius: '9999px',
      color: '#ffffff',
      fontWeight: '700',
      fontSize: 14,
      padding: '12px 28px',
      boxShadow: '0 0 25px rgba(234, 88, 12, 0.4)'
    }
  },
  {
    id: 'btn-cart-pill',
    name: 'Cart Pill Action',
    desc: 'Nút Giỏ Hàng kèm số lượng nổi bật',
    category: 'ecommerce',
    text: '🛒 Giỏ Hàng (1 Sản phẩm)',
    style: {
      backgroundColor: 'rgba(0, 113, 227, 0.95)',
      border: '1px solid #2997ff',
      borderRadius: '9999px',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: 13,
      padding: '10px 24px',
      boxShadow: '0 8px 24px rgba(0, 113, 227, 0.4)'
    }
  },
  {
    id: 'btn-concierge-vip',
    name: 'VIP Concierge Hotline',
    desc: 'Hỗ trợ khách hàng VIP chuyên nghiệp',
    category: 'ecommerce',
    text: '💎 Concierge Hotline 24/7',
    style: {
      backgroundColor: 'rgba(23, 23, 23, 0.95)',
      border: '1px solid rgba(234, 179, 8, 0.4)',
      borderRadius: '16px',
      color: '#fde047',
      fontWeight: '600',
      fontSize: 13,
      padding: '10px 22px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    }
  }
];
```

- [ ] **Step 2: Commit file `buttonPresets.js`**
```bash
git add frontend/src/components/common/canva/buttonPresets.js
git commit -m "feat: add comprehensive button presets library"
```

---

### Task 2: Tạo Module Kho Ký Hiệu & Biểu Tượng (`symbolPresets.js`)

**Files:**
- Create: `frontend/src/components/common/canva/symbolPresets.js`

**Interfaces:**
- Produces: `SYMBOL_CATEGORIES` (Bảng phân loại ký hiệu: Tiền tệ, Đánh giá/Sao, Chứng nhận uy tín, Mũi tên điều hướng, Glyphs công nghệ & nghệ thuật, E-commerce).

- [ ] **Step 1: Tạo file `symbolPresets.js`**

```javascript
export const SYMBOL_CATEGORIES = [
  {
    id: 'currencies',
    name: 'Tiền Tệ Quốc Tế',
    items: [
      { name: 'Việt Nam Đồng (₫)', symbol: '₫', color: '#4ade80', size: 32 },
      { name: 'Đô la Mỹ ($)', symbol: '$', color: '#38bdf8', size: 32 },
      { name: 'Euro (€)', symbol: '€', color: '#60a5fa', size: 32 },
      { name: 'Bảng Anh (£)', symbol: '£', color: '#fbbf24', size: 32 },
      { name: 'Yên Nhật (¥)', symbol: '¥', color: '#f43f5e', size: 32 },
      { name: 'Riyal Ả Rập (﷼)', symbol: '﷼', color: '#34d399', size: 32 },
      { name: 'Bitcoin (₿)', symbol: '₿', color: '#f59e0b', size: 32 },
      { name: 'Won Hàn Quốc (₩)', symbol: '₩', color: '#c084fc', size: 32 }
    ]
  },
  {
    id: 'ratings',
    name: 'Đánh Giá & Uy Tín',
    items: [
      { name: '5 Sao Hoàng Kim', symbol: '★★★★★', color: '#fde047', size: 24 },
      { name: '4.9 Sao Đánh Giá', symbol: '★★★★☆', color: '#fde047', size: 24 },
      { name: '3 Sao Tỏa Sáng', symbol: '✦ ✦ ✦', color: '#fde047', size: 26 },
      { name: 'Huy Hiệu Huy Hoàng', symbol: '✪ ✪ ✪', color: '#f59e0b', size: 24 },
      { name: 'Ngôi Sao Lấp Lánh', symbol: '🌟', color: '#fde047', size: 32 },
      { name: 'Ánh Sao Sắc Nét', symbol: '💫', color: '#38bdf8', size: 32 },
      { name: 'Vương Miện Hoàng Gia', symbol: '👑', color: '#fbbf24', size: 32 },
      { name: 'Cúp Vô Địch', symbol: '🏆', color: '#fde047', size: 32 }
    ]
  },
  {
    id: 'trust',
    name: 'Huy Hiệu Niềm Tin',
    items: [
      { name: '100% Chính Hãng', symbol: '🛡️ 100% AUTHENTIC', color: '#38bdf8', size: 14, isPill: true },
      { name: 'Giao Siêu Tốc Express', symbol: '🚀 EXPRESS DELIVERY', color: '#4ade80', size: 14, isPill: true },
      { name: 'Bảo Mật SSL 256-bit', symbol: '🔒 256-BIT ENCRYPTION', color: '#a1a1a6', size: 14, isPill: true },
      { name: 'Chuẩn Chế Tác Luxury', symbol: '💎 LUXURY EDITION', color: '#fde047', size: 14, isPill: true },
      { name: 'Bảo Hành 2 Năm', symbol: '✓ 2-YEAR WARRANTY', color: '#2dd4bf', size: 14, isPill: true },
      { name: 'Đặc Quyền Hội Viên VIP', symbol: 'VIP EXCLUSIVE 2026', color: '#c084fc', size: 14, isPill: true }
    ]
  },
  {
    id: 'arrows',
    name: 'Mũi Tên & Điều Hướng',
    items: [
      { name: 'Mũi tên sang phải dày', symbol: '➔', color: '#ffffff', size: 28 },
      { name: 'Mũi tên nét đậm', symbol: '➜', color: '#38bdf8', size: 28 },
      { name: 'Mũi tên tam giác chỉ dẫn', symbol: '➤', color: '#fde047', size: 28 },
      { name: 'Mũi tên cong đón chào', symbol: '➥', color: '#4ade80', size: 28 },
      { name: 'Ký tự điều hướng Chevron', symbol: '❯', color: '#ffffff', size: 28 },
      { name: 'Mũi tên vòng cung', symbol: '⮞', color: '#f43f5e', size: 28 }
    ]
  },
  {
    id: 'glyphs',
    name: 'Ký Tự Nghệ Thuật & Công Nghệ',
    items: [
      { name: 'Logo Apple', symbol: '', color: '#ffffff', size: 34 },
      { name: 'Biểu Tượng Aura Luxury', symbol: '❖', color: '#2dd4bf', size: 32 },
      { name: 'Lục Giác Công Nghệ', symbol: '⬡', color: '#38bdf8', size: 30 },
      { name: 'Kim Cương Đơn', symbol: '⟡', color: '#fde047', size: 30 },
      { name: 'Tia Sáng Vũ Trụ', symbol: '⟢', color: '#c084fc', size: 30 },
      { name: 'Bông Tuyết Tinh Thể', symbol: '❄', color: '#e0f2fe', size: 30 }
    ]
  },
  {
    id: 'ecommerce',
    name: 'Thương Mại & Mua Sắm',
    items: [
      { name: 'Giỏ Hàng', symbol: '🛒', color: '#ffffff', size: 32 },
      { name: 'Túi Xách Mua Sắm', symbol: '🛍️', color: '#ffffff', size: 32 },
      { name: 'Hộp Quà Cao Cấp', symbol: '🎁', color: '#ffffff', size: 32 },
      { name: 'Gói Hàng Niêm Phong', symbol: '📦', color: '#ffffff', size: 32 },
      { name: 'Thẻ Tín Dụng Vàng', symbol: '💳', color: '#ffffff', size: 32 },
      { name: 'Tia Sét Khuyến Mãi', symbol: '⚡', color: '#fde047', size: 32 },
      { name: 'Ngọn Lửa Hot Sale', symbol: '🔥', color: '#f43f5e', size: 32 },
      { name: 'Điểm 100 Hoàn Hảo', symbol: '💯', color: '#ef4444', size: 32 }
    ]
  }
];
```

- [ ] **Step 2: Commit file `symbolPresets.js`**
```bash
git add frontend/src/components/common/canva/symbolPresets.js
git commit -m "feat: add rich categorized symbols and glyphs library"
```

---

### Task 3: Tạo Tab Kích Thước Trang (`Page Canvas`) trong `CanvaDrawer.jsx`

**Files:**
- Modify: `frontend/src/components/common/canva/CanvaDrawer.jsx`

**Interfaces:**
- Consumes: `pageDimensions` và `onUpdatePageDimensions` từ props.
- Produces: Giao diện điều khiển chiều rộng (Width: Presets + Custom px/%), chiều cao/độ dài (Length / Min-Height: Slider + Input), khoảng đệm (Padding), và màu nền toàn trang.

- [ ] **Step 1: Bổ sung tab `page` (Kích thước Trang) vào header tabs và render giao diện trong `CanvaDrawer.jsx`**
  - Thêm tab button `<button onClick={() => setActiveTab('page')}>` kèm icon `Maximize2` / `Sliders`.
  - Thiết kế panel chỉnh sửa:
    - Nhóm Preset nhanh: 100%, 1920px, 1600px, 1440px, 1200px, 768px, 390px.
    - Nhóm Chiều Rộng: Range slider (320 - 2560) + ô nhập số.
    - Nhóm Chiều Cao/Độ dài (Length / Min-Height): Slider (600 - 5000px hoặc 100vh).
    - Nhóm Khoảng Đệm (Padding): Slider 0 - 80px.
    - Nhóm Màu Nền Toàn Trang.

- [ ] **Step 2: Kiểm tra cú pháp và build thử**
Run: `npm run build` inside `frontend/`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add frontend/src/components/common/canva/CanvaDrawer.jsx
git commit -m "feat: add Page Canvas Dimensions tab to CanvaDrawer"
```

---

### Task 4: Tích Hợp Kho Mẫu Nút Bấm & Kho Ký Hiệu Mới vào `CanvaDrawer.jsx`

**Files:**
- Modify: `frontend/src/components/common/canva/CanvaDrawer.jsx`

**Interfaces:**
- Consumes: `BUTTON_PRESETS` từ `buttonPresets.js`, `SYMBOL_CATEGORIES` từ `symbolPresets.js`.
- Produces:
  - Tab "Nút & Khối" hiển thị danh sách các mẫu nút phân loại rõ ràng (Luxury, Cyber, Minimal, Modern, E-commerce).
  - Tab "Chữ & Ký tự" hiển thị kho ký hiệu theo từng danh mục (Tiền tệ, Đánh giá, Niềm tin, Mũi tên, Nghệ thuật, E-commerce).
  - Khi nhấp vào nút hoặc ký hiệu: Gọi `onAddButton(preset)` hoặc `onAddSymbol(item)` để tạo ngay phần tử lên canvas.

- [ ] **Step 1: Cập nhật `CanvaDrawer.jsx` import và render các presets mới**
  - Import `BUTTON_PRESETS` và `SYMBOL_CATEGORIES`.
  - Thay thế hoặc mở rộng giao diện nút bấm và ký hiệu cũ bằng bộ sưu tập mới với giao diện preview cực đẹp mắt.

- [ ] **Step 2: Commit**
```bash
git add frontend/src/components/common/canva/CanvaDrawer.jsx
git commit -m "feat: integrate expanded button presets and symbol catalog in CanvaDrawer"
```

---

### Task 5: Triển Khai Tab Khôi Phục Phần Tử Đã Xóa (`hiddenElements`) trong `CanvaDrawer.jsx`

**Files:**
- Modify: `frontend/src/components/common/canva/CanvaDrawer.jsx`

**Interfaces:**
- Consumes: `hiddenElements` (mảng chứa ID các phần tử đã bị ẩn/xóa), `onRestoreElement(id)`, `onRestoreAllElements()`.
- Produces: Tab "Khôi phục Phần tử" (Restore Elements) hiển thị badge số lượng phần tử đang ẩn, danh sách các mục với nút "Khôi phục" 1-click.

- [ ] **Step 1: Thêm Tab `restore` vào danh sách tabs trong `CanvaDrawer.jsx`**
  - Hiển thị badge: `hiddenElements.length > 0 ? (<span>{hiddenElements.length}</span>) : null`.
  - Liệt kê danh sách các phần tử đã xóa với nhãn dễ hiểu.
  - Mỗi hàng có nút "Khôi phục" màu xanh lá.
  - Phía trên cùng có nút "Khôi phục tất cả" (Restore All).

- [ ] **Step 2: Commit**
```bash
git add frontend/src/components/common/canva/CanvaDrawer.jsx
git commit -m "feat: add hidden elements restore drawer tab in CanvaDrawer"
```

---

### Task 6: Nâng Cấp `CanvaBlockInspector.jsx` và `CanvaToolbar.jsx` Hỗ Trợ Xóa, Nhân Bản & Sửa Toàn Bộ Phần Tử

**Files:**
- Modify: `frontend/src/components/common/canva/CanvaBlockInspector.jsx`
- Modify: `frontend/src/components/common/canva/CanvaToolbar.jsx`

**Interfaces:**
- Produces: Nút "Xóa / Ẩn phần tử" (`Trash2`) với màu đỏ nổi bật, nút "Nhân bản" (`Copy`), và thanh công cụ gắn liền trên đầu mỗi khối.

- [ ] **Step 1: Bổ sung nút Xóa/Ẩn và nút Nhân bản vào `CanvaBlockInspector.jsx`**
  - Thêm props `onDeleteBlock(activeBlock.id)` và `onDuplicateBlock(activeBlock.id)`.
  - Hiển thị nút bấm đỏ "Xóa / Ẩn phần tử này khỏi trang" kèm phím tắt `Delete`.

- [ ] **Step 2: Bổ sung Floating Action Bar hoặc Mini Toolbar trên đầu phần tử đang chọn**
  - Đảm bảo khi chọn bất kỳ element nào (nút bấm, card, specs), thanh công cụ nổi xuất hiện với các nút: Sửa, Đổi Style, Xóa.

- [ ] **Step 3: Commit**
```bash
git add frontend/src/components/common/canva/CanvaBlockInspector.jsx frontend/src/components/common/canva/CanvaToolbar.jsx
git commit -m "feat: enhance CanvaBlockInspector and Toolbar with universal delete and duplicate actions"
```

---

### Task 7: Chuyển Đổi Các Phần Tử Trong `HeroShowcase.jsx`, `VariantPicker.jsx`, `BentoFeatures.jsx`, `TechSpecs.jsx` Sang Universal Editable & Deletable

**Files:**
- Modify: `frontend/src/components/showcase/HeroShowcase.jsx`
- Modify: `frontend/src/components/showcase/VariantPicker.jsx`
- Modify: `frontend/src/components/showcase/BentoFeatures.jsx`
- Modify: `frontend/src/components/showcase/TechSpecs.jsx`

**Interfaces:**
- Consumes: `hiddenElements` array, `onDeleteElement(id)`, `onSelectBlock(block)`.
- Produces: Tất cả các nút CTA ("Mua Ngay", "Xem thông số", "Thêm giỏ"), các thẻ Bento, các dòng Tech Specs, các huy hiệu đều:
  - Kiểm tra `hiddenElements.includes(elementId)`: nếu có thì KHÔNG render (đã bị xóa/ẩn).
  - Có viền hover khi ở `isEditMode`.
  - Nhấp chuột kích hoạt `onSelectBlock`.
  - Có nút xóa mini ở góc khi hover trong edit mode.

- [ ] **Step 1: Cập nhật `HeroShowcase.jsx`**
  - Bổ sung `hiddenElements` cho các nút: `hero-cta-buy`, `hero-cta-specs`, `hero-pricing-box`, `hero-product-model-pills`, `hero-guarantee-pills`, `hero-eyebrow`, `hero-product-desc`.
  - Khi `isEditMode`: nhấp chuột chọn khối, hiển thị nút xóa nhanh.

- [ ] **Step 2: Cập nhật `VariantPicker.jsx`**
  - Hỗ trợ ẩn/xóa/sửa cho nút "Thêm vào giỏ", khối màu sắc, khối dung lượng/phiên bản.

- [ ] **Step 3: Cập nhật `BentoFeatures.jsx`**
  - Hỗ trợ ẩn/xóa/sửa cho từng thẻ Bento card riêng biệt (`bento-card-0`, `bento-card-1`...).

- [ ] **Step 4: Cập nhật `TechSpecs.jsx`**
  - Hỗ trợ ẩn/xóa/sửa cho từng dòng thông số kỹ thuật (`spec-row-0`, `spec-row-1`...).

- [ ] **Step 5: Commit**
```bash
git add frontend/src/components/showcase/HeroShowcase.jsx frontend/src/components/showcase/VariantPicker.jsx frontend/src/components/showcase/BentoFeatures.jsx frontend/src/components/showcase/TechSpecs.jsx
git commit -m "feat: make all showcase sections elements universally selectable, editable and deletable"
```

---

### Task 8: Tích Hợp Toàn Bộ Hệ Thống & Quản Lý Trạng Thái Trong `HomePage.jsx`

**Files:**
- Modify: `frontend/src/pages/HomePage.jsx`

**Interfaces:**
- Quản lý trạng thái:
  - `pageDimensions`: `{ widthMode, customWidth, minHeight, paddingX, paddingY, backgroundColor, align }`
  - `hiddenElements`: Mảng các string ID của các phần tử bị ẩn/xóa.
- Bọc layout chính `<main>` với style tương ứng từ `pageDimensions`.
- Lắng nghe phím tắt `Delete` / `Backspace` toàn cục khi có `activeBlock` được chọn để xóa ngay lập tức.
- Truyền đầy đủ props cho `CanvaOverlay`, `CanvaDrawer`, `HeroShowcase`, `VariantPicker`, `BentoFeatures`, `TechSpecs`.

- [ ] **Step 1: Cập nhật `HomePage.jsx`**
  - Khởi tạo state `pageDimensions` với giá trị mặc định tối ưu.
  - Khởi tạo state `hiddenElements` với khả năng đọc và lưu vào `product.specifications['hidden_elements']` hoặc `localStorage`.
  - Cập nhật `<main>` wrapper áp dụng chiều rộng và độ cao động:
    ```jsx
    <main
      id="page-canvas-wrapper"
      className="relative transition-all duration-300"
      style={{
        maxWidth: pageDimensions.customWidth || '100%',
        minHeight: pageDimensions.minHeight !== 'auto' ? pageDimensions.minHeight : undefined,
        paddingLeft: pageDimensions.paddingX ? `${pageDimensions.paddingX}px` : undefined,
        paddingRight: pageDimensions.paddingX ? `${pageDimensions.paddingX}px` : undefined,
        paddingTop: pageDimensions.paddingY ? `${pageDimensions.paddingY}px` : undefined,
        paddingBottom: pageDimensions.paddingY ? `${pageDimensions.paddingY}px` : undefined,
        backgroundColor: pageDimensions.backgroundColor || undefined,
        marginLeft: pageDimensions.align === 'center' ? 'auto' : undefined,
        marginRight: pageDimensions.align === 'center' ? 'auto' : undefined,
      }}
    >
    ```
  - Kết nối các hàm `handleUpdatePageDimensions`, `handleDeleteElement`, `handleRestoreElement`, `handleRestoreAllElements`.

- [ ] **Step 2: Commit**
```bash
git add frontend/src/pages/HomePage.jsx
git commit -m "feat: integrate page dimensions controller and universal hidden elements state in HomePage"
```

---

### Task 9: Kiểm Thử Toàn Diện & Tối Ưu Hóa Trải Nghiệm (End-to-End Verification)

**Files:**
- Toàn bộ codebase frontend

- [ ] **Step 1: Chạy build kiểm tra không có lỗi cú pháp hoặc đóng gói**
Run: `npm run build` inside `frontend/`
Expected: Output build thành công không lỗi.

- [ ] **Step 2: Kiểm tra trực tiếp trên dev server**
- Thao tác kiểm tra:
  1. Bật Chế độ Sửa (Edit Mode).
  2. Mở Canva Drawer -> Tab "Kích thước Trang" -> Đổi giữa các preset (100%, 1440px, 1200px, 390px Mobile) -> Khung trang co giãn mượt mà.
  3. Chọn 1 nút CTA (ví dụ "Nút Mua Ngay") -> Ấn phím `Delete` hoặc nút Thùng rác -> Nút biến mất.
  4. Mở tab "Khôi phục Phần tử" -> Thấy "Nút Mua Ngay" -> Nhấp "Khôi phục" -> Nút xuất hiện lại.
  5. Mở tab "Nút & Khối" -> Thử chèn mẫu nút Apple Liquid Glass hoặc 24K Gold -> Nút hiển thị sắc nét.
  6. Mở tab "Chữ & Ký tự" -> Thử chèn ký hiệu tiền tệ `₫`, `$`, ngôi sao `★★★★★`, huy hiệu `🛡️` -> Hiển thị hoàn hảo.
  7. Nhấn "Lưu Thay Đổi" -> Tải lại trang (F5) -> Toàn bộ kích thước trang, phần tử đã ẩn và nút mới vẫn giữ nguyên.

- [ ] **Step 3: Commit hoàn tất**
```bash
git add -A
git commit -m "feat: complete Canva Studio Universal Canvas, Page Resizer and Asset Library"
```
