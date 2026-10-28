@echo off
REM ============================================================
REM  STOP.BAT - pengaman: matikan proxy Windows secara paksa
REM  Dipakai kalau jendela run.bat tertutup paksa (klik X)
REM  dan internet terasa mati / proxy masih nyangkut ON.
REM  Cara pakai: klik 2x file ini.
REM ============================================================
setlocal
cd /d "%~dp0"
title SEB BOT - Stop / matikan proxy

set "KEY=HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings"

echo [*] Mematikan proxy Windows ...
reg add "%KEY%" /v ProxyEnable /t REG_DWORD /d 0 /f >nul
powershell -NoProfile -Command "Add-Type -Namespace W -Name N -MemberDefinition '[DllImport(\"wininet.dll\")] public static extern bool InternetSetOption(IntPtr h,int o,IntPtr b,int l);'; [W.N]::InternetSetOption([IntPtr]::Zero,39,[IntPtr]::Zero,0) | Out-Null; [W.N]::InternetSetOption([IntPtr]::Zero,37,[IntPtr]::Zero,0) | Out-Null" >nul 2>&1

REM matikan juga sisa proses mitmdump kalau masih nyangkut
taskkill /f /im mitmdump.exe >nul 2>&1
taskkill /f /im mitmproxy.exe >nul 2>&1

echo [OK] Proxy OFF. Internet kembali normal.
echo.
pause
