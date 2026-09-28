# Luxury eCommerce Showcase 🌟

Hệ thống giới thiệu và bán sản phẩm công nghệ cao cấp chuẩn phong cách Apple, tích hợp trình chỉnh sửa trực tiếp chuẩn **Canva Studio**, đa ngôn ngữ (Tiếng Việt, English, 日本語), đa tiền tệ (VND, USD, JPY), tích hợp thanh toán tự động VietQR (PayOS) và Stripe.

---

## ✨ Tính Năng Nổi Bật

- **Giao Diện Đỉnh Cao (Apple Luxury Aesthetic)**: Hiệu ứng typography, bento grid, dark theme và animation mượt mà.
- **Canva Live Studio**:
  - Tự do kéo thả, thay đổi kích thước với 8 điểm neo (resize handles), xoay góc phần tử.
  - Chỉnh sửa văn bản trực tiếp (WYSIWYG inline editing) như MS Word / Canva.
  - Thanh công cụ Canva Toolbar: tuỳ chỉnh font, màu sắc, bóng đổ, gradient, căn lề.
  - Thư viện tài nguyên (Drawer): slider hình ảnh, các nút bấm, container, biểu tượng, hình vẽ.
  - Lịch sử Undo / Redo (`Ctrl+Z`, `Ctrl+Y`) và lưu trữ tự động vào cơ sở dữ liệu.
- **Đa Ngôn Ngữ & Đa Tiền Tệ**:
  - Hỗ trợ chuyển đổi nhanh Tiếng Việt, English, Japanese.
  - Quy đổi tiền tệ VND (₫), USD ($), JPY (¥) theo thời gian thực.
- **Thanh Toán Đa Kênh**:
  - Cổng thanh toán quốc tế **Stripe**.
  - Thanh toán QR chuyển khoản ngân hàng Việt Nam tự động qua **VietQR / PayOS**.
- **Admin Dashboard**:
  - Quản trị viên quản lý danh mục sản phẩm, biến thể, hình ảnh và dịch thuật đa ngôn ngữ.
  - Mẫu sản phẩm tạo sẵn (Presets) 1-click cho người dùng không rành kỹ thuật.
  - Xem thống kê đơn hàng, doanh thu và trạng thái thanh toán.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Canvas Confetti.
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy, SQLite, Pydantic, Uvicorn, Pytest.

---

## 🚀 Hướng Dẫn Khởi Động Nhanh

### Cách 1: Sử dụng Script tự động (Khuyên dùng trên Windows)

Chỉ cần click đúp vào file hoặc chạy qua PowerShell:

```powershell
# Chạy script cài đặt tự động & khởi động
.\setup_and_run.ps1
```

Hoặc nếu bạn dùng Command Prompt (CMD):
```cmd
setup_and_run.bat
```

Script sẽ tự động:
1. Tạo môi trường ảo Python (`venv`) và cài đặt các thư viện cần thiết.
2. Cài đặt các gói `npm` cho Frontend.
3. Khởi tạo cơ sở dữ liệu mẫu và chạy đồng thời cả Backend (Port 8000) và Frontend (Port 5173).

---

### Cách 2: Khởi động thủ công

#### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux / macOS:
# source venv/bin/activate

pip install -r requirements.txt
python -m app.db.seed
uvicorn main:app --reload --port 8000
```
Backend API Docs sẵn sàng tại: `http://localhost:8000/docs`

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:5173`

---

## 🧪 Chạy Kiểm Thử (Tests)

- **Backend tests**:
  ```bash
  pytest backend/tests/
  ```
- **Frontend build test**:
  ```bash
  cd frontend
  npm run build
  ```

---

## 📄 Bản Quyền & Giấy Phép

Dự án phát triển bởi **kientt10493**. Mọi quyền được bảo lưu.
