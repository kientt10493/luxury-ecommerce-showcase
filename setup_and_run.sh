#!/usr/bin/env bash
# ==============================================================================
# SCRIPT TỰ ĐỘNG THIẾT LẬP VÀ CHẠY DỰ ÁN CHO LINUX & MACOS
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "======================================================================"
echo "   AURA LUXURY E-COMMERCE SHOWCASE - AUTO SETUP & LAUNCHER (Linux/macOS)"
echo "======================================================================"
echo ""

# 1. Kiểm tra Python
echo "[1/4] Kiểm tra Python 3..."
if ! command -v python3 &>/dev/null; then
    echo "  [!] Không tìm thấy Python 3. Đang thử cài đặt..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew &>/dev/null; then
            brew install python
        else
            echo "  [x] Vui lòng cài Homebrew hoặc Python từ https://python.org"
            exit 1
        fi
    elif [ -f /etc/debian_version ]; then
        sudo apt update && sudo apt install -y python3 python3-pip python3-venv
    elif [ -f /etc/redhat-release ]; then
        sudo dnf install -y python3 python3-pip
    fi
else
    echo "  [✓] $(python3 --version) đã sẵn sàng."
fi

# 2. Kiểm tra Node.js & npm
echo "[2/4] Kiểm tra Node.js & npm..."
if ! command -v node &>/dev/null || ! command -v npm &>/dev/null; then
    echo "  [!] Không tìm thấy Node.js/npm. Đang thử cài đặt..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install node
    elif [ -f /etc/debian_version ]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [ -f /etc/redhat-release ]; then
        sudo dnf install -y nodejs
    fi
else
    echo "  [✓] Node $(node -v) (npm $(npm -v)) đã sẵn sàng."
fi

# 3. Cài đặt Backend
echo "[3/4] Cài đặt Backend (FastAPI, SQLite, Python venv)..."
if [ ! -d "backend/venv" ] || [ ! -f "backend/venv/bin/python" ]; then
    echo "  --> Tạo Python Virtualenv..."
    python3 -m venv backend/venv
fi

echo "  --> Cài đặt thư viện Python requirements.txt..."
./backend/venv/bin/pip install --upgrade pip --quiet
./backend/venv/bin/pip install -r backend/requirements.txt --quiet
echo "  [✓] Backend đã sẵn sàng."

# 4. Cài đặt Frontend
echo "[4/4] Cài đặt Frontend (React Vite & Tailwind CSS)..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "  --> Chạy npm install..."
    npm install
else
    echo "  [✓] node_modules đã tồn tại."
fi
cd "$SCRIPT_DIR"

# 5. Khởi chạy cả 2 dịch vụ
echo ""
echo "======================================================================"
echo "   ĐANG KHỞI CHẠY HỆ THỐNG WEBSITE..."
echo "======================================================================"

# Khởi chạy Backend nền
(
    cd backend
    ./venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --reload
) &
BACKEND_PID=$!

# Khởi chạy Frontend nền
(
    cd frontend
    npm run dev -- --host 127.0.0.1 --port 5173
) &
FRONTEND_PID=$!

# Đảm bảo tắt cả 2 process khi nhấn Ctrl+C
cleanup() {
    echo ""
    echo "Đang dừng các dịch vụ..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM

sleep 3

# Mở trình duyệt
if command -v xdg-open &>/dev/null; then
    xdg-open "http://127.0.0.1:5173/" &>/dev/null &
elif command -v open &>/dev/null; then
    open "http://127.0.0.1:5173/" &>/dev/null &
fi

echo ""
echo "======================================================================"
echo "   WEBSITE ĐÃ ĐƯỢC KHỞI CHẠY THÀNH CÔNG!"
echo "======================================================================"
echo "  * Storefront   : http://127.0.0.1:5173/"
echo "  * Admin Panel  : http://127.0.0.1:5173/admin (admin / Admin@2026)"
echo "  * API Swagger  : http://127.0.0.1:8000/api/v1/docs"
echo "======================================================================"
echo "  (Nhấn tổ hợp phím Ctrl + C để dừng cả Backend và Frontend)"
echo ""

wait
