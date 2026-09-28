# 🚀 HƯỚNG DẪN CHUYỂN DỰ ÁN SANG MÁY MỚI & TỰ ĐỘNG CÀI ĐẶT

Tài liệu này hướng dẫn cách chuyển toàn bộ dự án website **Aura Luxury E-Commerce Showcase (FastAPI + React Vite)** sang một máy tính mới hoàn toàn (chưa có Python, Node.js, hay thư viện lập trình nào).

---

## 📦 1. Lưu ý khi sao chép mã nguồn (Codebase) sang máy khác

Khi nén file ZIP hoặc sao chép thư mục dự án sang máy tính khác, **BẠN NÊN BỎ QUA** 2 thư mục sau (để dung lượng nhẹ hơn và tránh lỗi đường dẫn cứng giữa các máy):
- `backend/venv/` *(Môi trường ảo Python của máy cũ)*
- `frontend/node_modules/` *(Thư viện JavaScript nặng hàng trăm MB)*

> 💡 **Yên tâm:** Script tự động sẽ tự tạo lại `venv` chuẩn và cài đặt `node_modules` sạch sẽ tương thích 100% với máy mới.

---

## ⚡ 2. Cách chạy trên Máy mới (1 Thao tác)

### 🪟 Dành cho hệ điều hành Windows:
Có 2 cách thực hiện:

#### Cách 1 (Khuyên dùng - Nhanh nhất):
* Nhấp đúp chuột (Double Click) vào file:
  👉 **`setup_and_run.bat`**
*(Nếu máy hiện thông báo hỏi quyền Administrator / UAC, hãy chọn **Yes** để script cài đặt Python và Node.js vào máy).*

#### Cách 2 (Dùng PowerShell):
1. Mở PowerShell trong thư mục dự án.
2. Chạy lệnh:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\setup_and_run.ps1
   ```

---

### 🐧 Dành cho hệ điều hành Linux / macOS:
1. Mở Terminal trong thư mục dự án.
2. Phân quyền và thực thi script:
   ```bash
   chmod +x setup_and_run.sh
   ./setup_and_run.sh
   ```

---

## 🛠️ 3. Kịch bản mà Script sẽ tự động thực hiện từ A đến Z:

1. **Kiểm tra Python:**
   - Nếu máy chưa có Python: Tự động tải bộ cài đặt chính thức từ `python.org` (hoặc qua `winget`) và cài đặt ngầm trong chế độ Silent, tự kích hoạt `Add to PATH`.
2. **Kiểm tra Node.js & npm:**
   - Nếu máy chưa có Node.js: Tự động tải bản Node.js LTS từ `nodejs.org` (hoặc qua `winget`) và cài đặt ngầm.
3. **Cập nhật biến môi trường PATH:**
   - Ngay lập tức nạp đường dẫn thực thi của Python, pip, Node.js, npm vào phiên làm việc mà không bắt buộc người dùng phải khởi động lại máy hay mở lại terminal.
4. **Cấu hình Backend (Python Virtualenv):**
   - Tự động tạo thư mục môi trường ảo `backend/venv`.
   - Nâng cấp `pip` lên phiên bản mới nhất.
   - Cài đặt toàn bộ thư viện trong `backend/requirements.txt` (FastAPI, Uvicorn, SQLAlchemy, Pydantic, Passlib, Bcrypt, Stripe, PayOS, v.v.).
   - Khởi tạo cơ sở dữ liệu SQLite `showcase.db` và nạp dữ liệu mẫu ban đầu (sản phẩm, tài khoản admin).
5. **Cấu hình Frontend (React Vite):**
   - Di chuyển vào thư mục `frontend` và tự động thực thi `npm install` để tải tất cả dependencies (React, Vite, Tailwind CSS, Lucide icons, Axios, Confetti, v.v.).
6. **Khởi chạy ứng dụng Website:**
   - Chạy dịch vụ Backend trên cổng `8000` (FastAPI Swagger).
   - Chạy dịch vụ Frontend trên cổng `5173` (React Vite).
   - Đợi 4 giây để 2 cổng sẵn sàng, sau đó **tự động mở trình duyệt web mặc định** đến địa chỉ trang chủ website.

---

## 🌐 4. Địa chỉ truy cập hệ thống sau khi khởi chạy

| Mục | Địa chỉ URL | Ghi chú |
| :--- | :--- | :--- |
| **Giao diện Khách hàng (Storefront)** | `http://127.0.0.1:5173/` | Trải nghiệm mua sắm, giỏ hàng, đa tiền tệ & đa ngôn ngữ |
| **Bảng điều khiển Quản trị (Admin)** | `http://127.0.0.1:5173/admin` | Quản lý sản phẩm, đơn hàng, thống kê doanh thu |
| **Tài khoản Admin mặc định** | `admin` / `Admin@2026` | Đã được nạp sẵn vào cơ sở dữ liệu |
| **Tài liệu API Swagger Backend** | `http://127.0.0.1:8000/api/v1/docs` | Kiểm tra và gọi thử toàn bộ các API endpoint |

---

## 🛑 5. Cách dừng hoặc chạy lại các lần sau

- **Để dừng Website:** Bạn chỉ cần đóng 2 cửa sổ dòng lệnh PowerShell/Terminal (Backend và Frontend) đang mở.
- **Để chạy lại ở các lần sau (khi máy đã cài đặt xong):**
  - Vẫn có thể nhấp đúp vào `setup_and_run.bat` (script sẽ nhận diện mọi thứ đã có sẵn và khởi chạy ngay trong vài giây).
  - Hoặc chạy script nhanh `run_dev.ps1`.
