# Script khởi chạy toàn bộ hệ sinh thái Website Showcase E-Commerce (FastAPI + React Vite)
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   AURA LUXURY E-COMMERCE SHOWCASE (FastAPI + React Vite)" -ForegroundColor Yellow
Write-Host "   Multi-Language (EN, VI, AR - RTL) | Multi-Currency (USD, VND, SAR)" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

# 1. Start FastAPI Backend on port 8000
Write-Host "`n[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Cyan
Start-Process -FilePath "$root\backend\venv\Scripts\uvicorn.exe" -ArgumentList "main:app --host 127.0.0.1 --port 8000 --reload" -WorkingDirectory "$root\backend"

# 2. Start React Vite Frontend on port 5173
Write-Host "[2/2] Starting React Vite Frontend on http://127.0.0.1:5173..." -ForegroundColor Cyan
Start-Process -FilePath "npm.cmd" -ArgumentList "run dev -- --host 127.0.0.1 --port 5173" -WorkingDirectory "$root\frontend"

Start-Sleep -Seconds 3

Write-Host "`n✓ System is ready!" -ForegroundColor Green
Write-Host "  • Storefront Showcase: http://127.0.0.1:5173/" -ForegroundColor White
Write-Host "  • Admin Dashboard:    http://127.0.0.1:5173/admin (admin / Admin@2026)" -ForegroundColor White
Write-Host "  • Backend Swagger API: http://127.0.0.1:8000/api/v1/docs" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Cyan

# Open default browser
Start-Process "http://127.0.0.1:5173/"
