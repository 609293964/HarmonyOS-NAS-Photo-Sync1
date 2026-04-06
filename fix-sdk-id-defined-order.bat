@echo off
chcp 65001 >nul
setlocal

echo ============================================
echo   Fix OpenHarmony id_defined Order
echo ============================================
echo.
echo This script updates the SDK file:
echo   openharmony\toolchains\id_defined.json
echo and rewrites each record's order to match
echo its actual sequence.
echo.
echo If Administrator permission is unavailable,
echo the script will fall back to a workspace-local
echo fixed restool toolchain automatically.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0fix-sdk-id-defined-order.ps1"

echo.
if %ERRORLEVEL% EQU 0 (
    echo [OK] SDK order repair finished.
) else (
    echo [ERROR] SDK order repair failed. See the log above.
)

pause
