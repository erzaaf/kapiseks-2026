@echo off
REM ============================================================
REM  RUN.BAT - jalanin bot + proxy ON/OFF otomatis
REM  Cara pakai: klik 2x file ini. Berhenti: tekan Ctrl+C, jawab N.
REM  Proxy Windows otomatis NYALA saat start, otomatis MATI saat stop.
REM
REM  --- GANTI IP/PORT DI SINI KALAU PERLU ---
REM ============================================================
set PROXY_HOST=127.0.0.1
set PROXY_PORT=8080
REM ============================================================
setlocal EnableDelayedExpansion
cd /d "%~dp0"
title BOT - Running (proxy %PROXY_HOST%:%PROXY_PORT%)

set "KEY=HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings"
set "BACKUP=%TEMP%\seb_bot_proxy_backup.txt"

REM --- Cek file penting ---
if not exist "inject.py" (
    echo [GAGAL] inject.py tidak ketemu di %CD%
    pause
    exit /b 1
)
if not exist ".venv\Scripts\mitmdump.exe" (
    REM fallback: coba mitmdump global (PATH) kalau .venv belum di-setup
    where mitmdump >nul 2>&1
    if not errorlevel 1 (
        echo [INFO] Memakai mitmdump global dari PATH.
        set "MITMDUMP=mitmdump"
        goto :AfterCheck
    )
    echo [GAGAL] mitmproxy belum terinstall.
    echo Jalankan dulu: setup.bat (cukup sekali^)
    echo.
    pause
    exit /b 1
)
set "MITMDUMP=.venv\Scripts\mitmdump.exe"
:AfterCheck

REM --- Simpan setting proxy lama (buat restore nanti) ---
echo [*] Menyimpan setting proxy lama ...
for /f "tokens=3" %%a in ('reg query "%KEY%" /v ProxyEnable 2^>nul ^| findstr /i ProxyEnable') do set "OLD_ENABLE=%%a"
for /f "tokens=2,*" %%a in ('reg query "%KEY%" /v ProxyServer 2^>nul ^| findstr /i ProxyServer') do set "OLD_SERVER=%%b"
for /f "tokens=2,*" %%a in ('reg query "%KEY%" /v ProxyOverride 2^>nul ^| findstr /i ProxyOverride') do set "OLD_OVERRIDE=%%b"
> "%BACKUP%" echo OLD_ENABLE=!OLD_ENABLE!
>>"%BACKUP%" echo OLD_SERVER=!OLD_SERVER!
>>"%BACKUP%" echo OLD_OVERRIDE=!OLD_OVERRIDE!

REM --- Nyalakan proxy ---
echo [*] Menyalakan proxy Windows ke %PROXY_HOST%:%PROXY_PORT% ...
reg add "%KEY%" /v ProxyEnable /t REG_DWORD /d 1 /f >nul
reg add "%KEY%" /v ProxyServer /t REG_SZ /d "%PROXY_HOST%:%PROXY_PORT%" /f >nul
REM Bypass proxy untuk localhost agar mitmproxy web UI tetap bisa dibuka (kuliah.itera.ac.id TETAP lewat proxy)
reg add "%KEY%" /v ProxyOverride /t REG_SZ /d "<-loopback>" /f >nul
call :RefreshProxy
echo [OK] Proxy ON -^> %PROXY_HOST%:%PROXY_PORT%
echo.

echo  ==============================================
echo   BOT JALAN. Jangan tutup jendela ini.
echo   Buka file config, kerjakan  seperti biasa.
echo.
echo   BERHENTI: tekan Ctrl+C lalu jawab N
echo   (proxy otomatis dimatikan lagi)
echo  ==============================================
echo.

REM --- Jalanin proxy/injector (Ctrl+C untuk berhenti) ---
"%MITMDUMP%" -s "%~dp0inject.py" --listen-host 0.0.0.0 --listen-port %PROXY_PORT% --set block_global=false

REM --- Sampai sini = user menekan Ctrl+C / mitmdump mati -> matikan proxy ---
:CLEANUP
echo.
echo [*] Mematikan proxy Windows (kembali seperti semula) ...
call :RestoreProxy
call :RefreshProxy
echo [OK] Proxy OFF. Internet kembali normal.
echo.
REM hapus file backup biar tidak menumpuk (opsional, aman)
del "%BACKUP%" >nul 2>&1
pause
exit /b 0

REM ============ fungsi: beritahu Windows agar setting proxy langsung berlaku ============
:RefreshProxy
powershell -NoProfile -Command "Add-Type -Namespace W -Name N -MemberDefinition '[DllImport(\"wininet.dll\")] public static extern bool InternetSetOption(IntPtr h,int o,IntPtr b,int l);'; [W.N]::InternetSetOption([IntPtr]::Zero,39,[IntPtr]::Zero,0) | Out-Null; [W.N]::InternetSetOption([IntPtr]::Zero,37,[IntPtr]::Zero,0) | Out-Null" >nul 2>&1
exit /b 0

REM ============ fungsi: kembalikan setting proxy seperti sebelum run ============
:RestoreProxy
REM default: matikan total kalau sebelumnya tidak ketahuan
if "%OLD_ENABLE%"=="" set "OLD_ENABLE=0x0"
if /i "%OLD_ENABLE%"=="0x1" (
    reg add "%KEY%" /v ProxyEnable /t REG_DWORD /d 1 /f >nul
    if not "%OLD_SERVER%"=="" reg add "%KEY%" /v ProxyServer /t REG_SZ /d "%OLD_SERVER%" /f >nul
) else (
    reg add "%KEY%" /v ProxyEnable /t REG_DWORD /d 0 /f >nul
)
exit /b 0
