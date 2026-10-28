@echo off
REM ============================================================
REM  SETUP.BAT - sekali klik, install semua kebutuhan
REM  Cara pakai: klik 2x file ini (cukup 1x seumur hidup / PC baru)
REM ============================================================
setlocal
cd /d "%~dp0"
title Setup sekali jalan

echo.
echo  ==============================================
echo   Setup otomatis
echo  ==============================================
echo.

REM --- 1. Cek Python ---
python --version >nul 2>&1
if errorlevel 1 (
    echo [GAGAL] Python tidak ketemu!
    echo Download di https://www.python.org/downloads/
    echo PENTING: centang "Add python.exe to PATH" saat install.
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('python --version 2^>^&1') do echo [OK] %%v

REM --- 2. Buat virtual env kalau belum ada ---
if not exist ".venv\Scripts\python.exe" (
    echo [*] Membuat .venv ...
    python -m venv .venv
    if errorlevel 1 (
        echo [GAGAL] Tidak bisa buat .venv
        pause
        exit /b 1
    )
) else (
    echo [OK] .venv sudah ada
)

REM --- 3. Install mitmproxy ---
echo [*] Menginstall mitmproxy (bisa 1-3 menit saat pertama kali) ...
".venv\Scripts\python.exe" -m pip install --upgrade pip
".venv\Scripts\python.exe" -m pip install mitmproxy
if errorlevel 1 (
    echo [GAGAL] pip install mitmproxy gagal. Cek koneksi internet.
    pause
    exit /b 1
)
echo [OK] mitmproxy terinstall:
".venv\Scripts\mitmdump.exe" --version

REM --- 4. Generate sertifikat mitmproxy kalau belum ada ---
if not exist "%USERPROFILE%\.mitmproxy\mitmproxy-ca-cert.cer" (
    echo [*] Membuat sertifikat mitmproxy (jalan 5 detik lalu mati otomatis) ...
    REM jalankan sebentar agar cert ter-generate, lalu paksa berhenti
    start "" /min ".venv\Scripts\mitmdump.exe" --listen-port 18080
    timeout /t 6 /nobreak >nul
    taskkill /f /im mitmdump.exe >nul 2>&1
    timeout /t 1 /nobreak >nul
)

REM --- 5. Pasang sertifikat ke Windows (agar HTTPS bisa di-inject) ---
if exist "%USERPROFILE%\.mitmproxy\mitmproxy-ca-cert.cer" (
    echo [*] Memasang sertifikat ke Trusted Root (user, tanpa admin) ...
    certutil -user -addstore root "%USERPROFILE%\.mitmproxy\mitmproxy-ca-cert.cer" >nul
    echo [OK] Sertifikat dipasang. Kalau browser masih warning, install manual:
    echo      file: %USERPROFILE%\.mitmproxy\mitmproxy-ca-cert.cer
) else (
    echo [WARNING] Sertifikat belum ketemu, nanti otomatis dibuat saat run.bat pertama kali.
)

REM --- 6. Cek file penting ---
if not exist "inject.py" echo [WARNING] inject.py tidak ketemu!
if not exist "bot.js" echo [WARNING] bot.js tidak ketemu!
if not exist "key.txt" (
    echo xxx > key.txt
    echo [*] key.txt dibuat, isi dengan API key Gemini/Groq kamu.
) else (
    echo [OK] key.txt ada
)
if not exist "run.bat" echo [INFO] run.bat akan dibuat terpisah.
if not exist "stop.bat" echo [INFO] stop.bat akan dibuat terpisah.

echo.
echo  ==============================================
echo   SETUP SELESAI. Selanjutnya klik 2x: run.bat
echo  ==============================================
echo.
pause
