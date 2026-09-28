# ==============================================================================
# SCRIPT TỰ ĐỘNG CÀI ĐẶT MÔI TRƯỜNG & KHỞI CHẠY HỆ THỐNG WEBSITE
# Hỗ trợ máy tính mới hoàn toàn (chưa có Python, Node.js, thư viện)
# ==============================================================================

#Requires -Version 5.1
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$rootDir = $PSScriptRoot

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   AURA LUXURY E-COMMERCE SHOWCASE - AUTO SETUP & LAUNCHER            " -ForegroundColor Yellow
Write-Host "   Tự động kiểm tra, cài đặt Python, Node.js, thư viện và chạy Web    " -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# ------------------------------------------------------------------------------
# 1. HÀM CẬP NHẬT BIẾN MÔI TRƯỜNG PATH TRONG PHIÊN HIỆN TẠI
# ------------------------------------------------------------------------------
function Refresh-Path {
    $machinePath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
    $combined = "$machinePath;$userPath"

    $extraPaths = @(
        "C:\Program Files\nodejs",
        "$env:APPDATA\npm",
        "$env:LOCALAPPDATA\Programs\Python\Python312",
        "$env:LOCALAPPDATA\Programs\Python\Python312\Scripts",
        "$env:LOCALAPPDATA\Programs\Python\Python311",
        "$env:LOCALAPPDATA\Programs\Python\Python311\Scripts",
        "$env:LOCALAPPDATA\Programs\Python\Python310",
        "$env:LOCALAPPDATA\Programs\Python\Python310\Scripts",
        "C:\Program Files\Python312",
        "C:\Program Files\Python312\Scripts",
        "C:\Program Files\Python311",
        "C:\Program Files\Python311\Scripts",
        "C:\Program Files\Python310",
        "C:\Program Files\Python310\Scripts"
    )

    foreach ($p in $extraPaths) {
        if ((Test-Path $p) -and ($combined -notlike "*$p*")) {
            $combined = "$p;$combined"
        }
    }
    $env:Path = $combined
}

# Gọi cập nhật PATH ban đầu
Refresh-Path

# Kiểm tra quyền Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

# ------------------------------------------------------------------------------
# 2. KIỂM TRA & CÀI ĐẶT PYTHON
# ------------------------------------------------------------------------------
Write-Host "[1/5] Kiểm tra môi trường Python..." -ForegroundColor Cyan

function Find-Python {
    Refresh-Path
    # 1. Thử lệnh python
    try {
        $ver = & python --version 2>&1
        if ($ver -match "Python 3\.(\d+)") {
            $subVer = [int]$matches[1]
            if ($subVer -ge 9) { return "python" }
        }
    } catch {}

    # 2. Thử lệnh py
    try {
        $ver = & py -3 --version 2>&1
        if ($ver -match "Python 3\.(\d+)") {
            $subVer = [int]$matches[1]
            if ($subVer -ge 9) { return "py -3" }
        }
    } catch {}

    # 3. Kiểm tra các đường dẫn mặc định
    $directPaths = @(
        "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe",
        "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe",
        "$env:LOCALAPPDATA\Programs\Python\Python310\python.exe",
        "C:\Program Files\Python312\python.exe",
        "C:\Program Files\Python311\python.exe",
        "C:\Program Files\Python310\python.exe"
    )
    foreach ($p in $directPaths) {
        if (Test-Path $p) { return $p }
    }
    return $null
}

$pyCmd = Find-Python

if (-not $pyCmd) {
    Write-Host "  [!] Máy chưa có Python 3.9+. Bắt đầu quá trình tải và cài đặt tự động..." -ForegroundColor Yellow

    # Thử qua winget trước nếu có
    $hasWinget = $false
    try {
        $wgCheck = & winget --version 2>&1
        if ($LASTEXITCODE -eq 0 -or $wgCheck -match "v\d") { $hasWinget = $true }
    } catch {}

    $installed = $false
    if ($hasWinget) {
        Write-Host "  --> Đang cài đặt Python 3.12 bằng Windows Package Manager (winget)..." -ForegroundColor Gray
        try {
            & winget install --id Python.Python.3.12 --exact --source winget --accept-package-agreements --accept-source-agreements --silent
            if ($LASTEXITCODE -eq 0) { $installed = $true }
        } catch {}
    }

    if (-not $installed) {
        # Fallback: Tải file installer trực tiếp từ trang chính thức python.org
        $pythonUrl = "https://www.python.org/ftp/python/3.12.3/python-3.12.3-amd64.exe"
        $installerPath = "$env:TEMP\python-3.12.3-setup.exe"
        Write-Host "  --> Đang tải Python 3.12 Installer trực tiếp từ python.org..." -ForegroundColor Gray
        
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        try {
            Invoke-WebRequest -Uri $pythonUrl -OutFile $installerPath -UseBasicParsing
        } catch {
            Write-Host "  [x] Không thể tải Python installer tự động. Vui lòng kiểm tra kết nối mạng." -ForegroundColor Red
            throw $_
        }

        Write-Host "  --> Đang tiến hành cài đặt Python tự động (chế độ nền)..." -ForegroundColor Gray
        $proc = Start-Process -FilePath $installerPath -ArgumentList "/quiet InstallAllUsers=0 PrependPath=1 Include_test=0 SimpleInstall=1" -Wait -PassThru
        Start-Sleep -Seconds 3
        if (Test-Path $installerPath) { Remove-Item -Force $installerPath -ErrorAction SilentlyContinue }
    }

    Refresh-Path
    $pyCmd = Find-Python
    if (-not $pyCmd) {
        Write-Host "  [!] Không thể tự động kích hoạt Python trong phiên hiện tại." -ForegroundColor Red
        Write-Host "      Vui lòng tải và cài đặt thủ công Python từ: https://www.python.org/downloads/" -ForegroundColor Yellow
        Write-Host "      LƯU Ý: Hãy tích chọn ô [x] Add Python to PATH khi cài đặt!" -ForegroundColor Yellow
        pause
        exit 1
    }
}

$pyVerStr = & ($pyCmd.Split(' ')[0]) ($pyCmd.Split(' ')[1..10]) --version 2>&1
Write-Host "  [✓] Python đã sẵn sàng: $pyVerStr" -ForegroundColor Green

# ------------------------------------------------------------------------------
# 3. KIỂM TRA & CÀI ĐẶT NODE.JS & NPM
# ------------------------------------------------------------------------------
Write-Host "`n[2/5] Kiểm tra môi trường Node.js & npm..." -ForegroundColor Cyan

function Find-Node {
    Refresh-Path
    try {
        $ver = & node -v 2>&1
        if ($ver -match "v\d+") { return "node" }
    } catch {}

    $directNode = "C:\Program Files\nodejs\node.exe"
    if (Test-Path $directNode) { return $directNode }
    return $null
}

$nodeCmd = Find-Node

if (-not $nodeCmd) {
    Write-Host "  [!] Máy chưa có Node.js. Bắt đầu quá trình tải và cài đặt tự động..." -ForegroundColor Yellow

    $hasWinget = $false
    try {
        $wgCheck = & winget --version 2>&1
        if ($LASTEXITCODE -eq 0 -or $wgCheck -match "v\d") { $hasWinget = $true }
    } catch {}

    $installed = $false
    if ($hasWinget) {
        Write-Host "  --> Đang cài đặt Node.js LTS bằng Windows Package Manager (winget)..." -ForegroundColor Gray
        try {
            & winget install --id OpenJS.NodeJS.LTS --exact --source winget --accept-package-agreements --accept-source-agreements --silent
            if ($LASTEXITCODE -eq 0) { $installed = $true }
        } catch {}
    }

    if (-not $installed) {
        # Fallback: Tải file MSI trực tiếp từ nodejs.org
        $nodeUrl = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi"
        $nodeMsiPath = "$env:TEMP\node-v20.18.0-setup.msi"
        Write-Host "  --> Đang tải Node.js LTS (v20) MSI trực tiếp từ nodejs.org..." -ForegroundColor Gray
        
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        try {
            Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeMsiPath -UseBasicParsing
        } catch {
            Write-Host "  [x] Không thể tải Node.js MSI. Vui lòng kiểm tra kết nối mạng." -ForegroundColor Red
            throw $_
        }

        Write-Host "  --> Đang tiến hành cài đặt Node.js (chế độ yên lặng)..." -ForegroundColor Gray
        $proc = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$nodeMsiPath`" /qn /norestart" -Wait -PassThru
        Start-Sleep -Seconds 3
        if (Test-Path $nodeMsiPath) { Remove-Item -Force $nodeMsiPath -ErrorAction SilentlyContinue }
    }

    Refresh-Path
    $nodeCmd = Find-Node
    if (-not $nodeCmd) {
        Write-Host "  [!] Chưa tìm thấy Node.js sau khi cài đặt." -ForegroundColor Red
        Write-Host "      Vui lòng tải và cài đặt thủ công Node.js từ: https://nodejs.org/" -ForegroundColor Yellow
        pause
        exit 1
    }
}

$nodeVerStr = & node -v 2>&1
$npmVerStr = & npm -v 2>&1
Write-Host "  [✓] Node.js đã sẵn sàng: $nodeVerStr (npm v$npmVerStr)" -ForegroundColor Green

# ------------------------------------------------------------------------------
# 4. THIẾT LẬP BACKEND (FASTAPI & PYTHON VIRTUALENV)
# ------------------------------------------------------------------------------
Write-Host "`n[3/5] Thiết lập Backend (FastAPI, SQLite, Thư viện Python)..." -ForegroundColor Cyan

$backendDir = Join-Path $rootDir "backend"
$venvDir = Join-Path $backendDir "venv"
$venvPython = Join-Path $venvDir "Scripts\python.exe"

# Kiểm tra xem venv hiện tại có hợp lệ hay bị lỗi do chuyển máy khác đường dẫn
$needNewVenv = $false
if (Test-Path $venvPython) {
    try {
        $testVenv = & $venvPython -c "import sys; print(sys.prefix)" 2>&1
        $expectedVenvPath = (Resolve-Path $venvDir).Path
        if ($testVenv -ne $expectedVenvPath) {
            Write-Host "  [i] Phát hiện virtual environment thuộc về đường dẫn máy cũ ($testVenv). Đang tạo lại..." -ForegroundColor Yellow
            $needNewVenv = $true
        }
    } catch {
        $needNewVenv = $true
    }
} else {
    $needNewVenv = $true
}

if ($needNewVenv) {
    if (Test-Path $venvDir) {
        Remove-Item -Recurse -Force $venvDir -ErrorAction SilentlyContinue
    }
    Write-Host "  --> Đang tạo môi trường ảo Python Virtualenv (venv)..." -ForegroundColor Gray
    
    $pyExecutable = ($pyCmd.Split(' ')[0])
    $pyArgs = @()
    if ($pyCmd.Split(' ').Length -gt 1) {
        $pyArgs = $pyCmd.Split(' ')[1..($pyCmd.Split(' ').Length - 1)]
    }
    $pyArgs += @("-m", "venv", "$venvDir")
    
    & $pyExecutable $pyArgs
    if (-not (Test-Path $venvPython)) {
        Write-Host "  [x] Không thể tạo virtualenv tại $venvDir." -ForegroundColor Red
        pause
        exit 1
    }
}

Write-Host "  --> Nâng cấp pip lên phiên bản mới nhất..." -ForegroundColor Gray
& $venvPython -m pip install --upgrade pip --quiet

Write-Host "  --> Cài đặt các thư viện Backend từ requirements.txt..." -ForegroundColor Gray
Write-Host "      (Bao gồm: FastAPI, Uvicorn, SQLAlchemy, Pydantic, Passlib, Bcrypt, Stripe, PayOS...)" -ForegroundColor DarkGray
& $venvPython -m pip install -r "$backendDir\requirements.txt" --quiet

Write-Host "  [✓] Backend và các thư viện Python đã cài đặt hoàn tất!" -ForegroundColor Green

# ------------------------------------------------------------------------------
# 5. THIẾT LẬP FRONTEND (REACT VITE & NODE_MODULES)
# ------------------------------------------------------------------------------
Write-Host "`n[4/5] Thiết lập Frontend (React Vite & Tailwind CSS)..." -ForegroundColor Cyan

$frontendDir = Join-Path $rootDir "frontend"
$nodeModulesDir = Join-Path $frontendDir "node_modules"

if (-not (Test-Path $nodeModulesDir)) {
    Write-Host "  --> Chưa có node_modules. Đang chạy 'npm install'..." -ForegroundColor Gray
    Push-Location $frontendDir
    cmd.exe /c "npm install"
    Pop-Location
} else {
    Write-Host "  [✓] node_modules đã tồn tại. Đảm bảo cập nhật dependencies mới nhất..." -ForegroundColor Gray
    Push-Location $frontendDir
    cmd.exe /c "npm install --prefer-offline"
    Pop-Location
}

Write-Host "  [✓] Frontend và các gói npm đã sẵn sàng!" -ForegroundColor Green

# ------------------------------------------------------------------------------
# 6. KHỞI CHẠY ỨNG DỤNG WEBSITE
# ------------------------------------------------------------------------------
Write-Host "`n[5/5] Khởi động toàn bộ hệ thống..." -ForegroundColor Cyan

# Dọn dẹp tiến trình cũ nếu cổng 8000 hoặc 5173 đang bị giữ
function Clean-Port($port) {
    try {
        $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        foreach ($c in $conns) {
            if ($c.OwningProcess -and $c.OwningProcess -gt 4) {
                Write-Host "  [i] Giải phóng tiến trình cũ (PID $($c.OwningProcess)) đang giữ cổng $port..." -ForegroundColor Yellow
                Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
            }
        }
    } catch {}
}

Clean-Port 8000
Clean-Port 5173
Start-Sleep -Milliseconds 500

# Khởi chạy Backend trên cổng 8000 trong cửa sổ riêng biệt
Write-Host "  --> Đang khởi chạy FastAPI Backend tại http://127.0.0.1:8000..." -ForegroundColor Gray
$backendCommand = "`$host.UI.RawUI.WindowTitle = 'AURA Showcase - Backend API (Port 8000)'; Set-Location '$backendDir'; & '$venvPython' -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", $backendCommand

# Khởi chạy Frontend trên cổng 5173 trong cửa sổ riêng biệt
Write-Host "  --> Đang khởi chạy React Vite Frontend tại http://127.0.0.1:5173..." -ForegroundColor Gray
$frontendCommand = "`$host.UI.RawUI.WindowTitle = 'AURA Showcase - Frontend Vite (Port 5173)'; Set-Location '$frontendDir'; cmd.exe /c 'npm run dev -- --host 0.0.0.0 --port 5173'"
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", $frontendCommand

# Chờ đợi Frontend sẵn sàng phản hồi HTTP 200
Write-Host "  --> Đang đợi máy chủ web sẵn sàng" -ForegroundColor Cyan -NoNewline
for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Seconds 1
    Write-Host "." -ForegroundColor Cyan -NoNewline
    try {
        $res = Invoke-WebRequest -Uri "http://127.0.0.1:5173/" -UseBasicParsing -TimeoutSec 1 2>$null
        if ($res.StatusCode -eq 200) { break }
    } catch {}
}
Write-Host " [SẴN SÀNG!]" -ForegroundColor Green

# Tự động mở trình duyệt mặc định đến trang web
Start-Process "http://127.0.0.1:5173/"

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "               WEBSITE ĐÃ ĐƯỢC KHỞI CHẠY THÀNH CÔNG!                  " -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  * Giao diện Website Storefront : http://127.0.0.1:5173/ hoặc http://localhost:5173/" -ForegroundColor White
Write-Host "  * Bảng điều khiển Quản trị     : http://127.0.0.1:5173/admin" -ForegroundColor White
Write-Host "      - Tài khoản đăng nhập      : admin" -ForegroundColor Gray
Write-Host "      - Mật khẩu đăng nhập       : Admin@2026" -ForegroundColor Gray
Write-Host "  * Tài liệu API Swagger Backend : http://127.0.0.1:8000/api/v1/docs" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  (Hai cửa sổ dòng lệnh cho Backend & Frontend đang chạy độc lập." -ForegroundColor DarkGray
Write-Host "   Bạn có thể đóng các cửa sổ đó bất cứ khi nào muốn dừng website.)" -ForegroundColor DarkGray
Write-Host ""
