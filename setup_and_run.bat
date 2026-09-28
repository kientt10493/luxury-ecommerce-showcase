@echo off
setlocal
chcp 65001 >nul
title AURA Showcase - Setup & Launcher

echo ======================================================================
echo    AURA LUXURY E-COMMERCE SHOWCASE - AUTO SETUP & LAUNCHER
echo ======================================================================
echo.
echo [i] Đang kiểm tra môi trường và phân quyền...

:: Kiểm tra quyền Administrator (nếu có thì tốt cho việc cài đặt phần mềm hệ thống)
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [i] Ghi chú: Bạn đang chạy không ở quyền Administrator.
    echo     Nếu Windows yêu cầu xác nhận cài đặt (UAC prompt), vui lòng chọn 'Yes'.
    echo.
)

:: Khởi chạy PowerShell với quyền bypass ExecutionPolicy để đảm bảo chạy mượt mà trên máy mới
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup_and_run.ps1"

if %errorLevel% neq 0 (
    echo.
    echo [!] Đã có thông báo hoặc lỗi xảy ra trong quá trình thiết lập.
    echo [!] Vui lòng đọc thông tin chi tiết ở trên.
    echo.
    pause
)
