# ==============================================================================
# Script khởi chạy toàn bộ hệ sinh thái Website Showcase (FastAPI + React Vite)
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   AURA LUXURY E-COMMERCE SHOWCASE (FastAPI + React Vite)             " -ForegroundColor Yellow
Write-Host "   Multi-Language (EN, VI, AR - RTL) | Multi-Currency (USD, VND, SAR) " -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

# 0. Giải phóng cổng 8000 và 5173 nếu có tiến trình cũ bị treo
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

Write-Host "`n[0/3] Kiểm tra & dọn dẹp các tiến trình cũ..." -ForegroundColor Gray
Clean-Port 8000
Clean-Port 5173
Start-Sleep -Milliseconds 500

# 1. Start FastAPI Backend on port 8000
Write-Host "[1/3] Khởi chạy FastAPI Backend trên http://127.0.0.1:8000..." -ForegroundColor Cyan
$backendCmd = "`$host.UI.RawUI.WindowTitle='FastAPI Backend - Port 8000'; Set-Location '$root\backend'; & '$root\backend\venv\Scripts\uvicorn.exe' main:app --host 0.0.0.0 --port 8000 --reload"
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", $backendCmd

# 2. Start React Vite Frontend on port 5173
Write-Host "[2/3] Khởi chạy React Vite Frontend trên http://127.0.0.1:5173..." -ForegroundColor Cyan
$frontendCmd = "`$host.UI.RawUI.WindowTitle='React Vite Frontend - Port 5173'; Set-Location '$root\frontend'; npm run dev -- --host 0.0.0.0 --port 5173"
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", $frontendCmd

# 3. Đợi server Frontend sẵn sàng phản hồi HTTP 200
Write-Host "[3/3] Đang đợi Frontend & Backend khởi động hoàn tất" -ForegroundColor Cyan -NoNewline
$isReady = $false
for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Seconds 1
    Write-Host "." -ForegroundColor Cyan -NoNewline
    try {
        $res = Invoke-WebRequest -Uri "http://127.0.0.1:5173/" -UseBasicParsing -TimeoutSec 1 2>$null
        if ($res.StatusCode -eq 200) {
            $isReady = $true
            break
        }
    } catch {}
}
Write-Host " [SẴN SÀNG!]" -ForegroundColor Green

Write-Host "`n======================================================================" -ForegroundColor Green
Write-Host "   HỆ THỐNG WEBSITE ĐÃ SẴN SÀNG!" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  * Storefront Showcase: http://127.0.0.1:5173/ hoặc http://localhost:5173/" -ForegroundColor White
Write-Host "  * Admin Dashboard:    http://127.0.0.1:5173/admin (admin / Admin@2026)" -ForegroundColor White
Write-Host "  * Backend Swagger API: http://127.0.0.1:8000/api/v1/docs" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Green

# Tự động mở trình duyệt
Start-Process "http://127.0.0.1:5173/"
