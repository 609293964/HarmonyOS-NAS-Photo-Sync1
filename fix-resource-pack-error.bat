@echo off
chcp 65001 >nul
setlocal

echo ============================================
echo   HarmonyOS Resource Pack Error Fix
echo ============================================
echo.
echo Patching hvigor cache to avoid duplicated
echo system id_defined.json injection...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0fix-resource-pack-error.ps1"

echo.
if %ERRORLEVEL% EQU 0 (
    echo [OK] Patch finished.
) else (
    echo [ERROR] Patch failed. See the log above.
)

pause
