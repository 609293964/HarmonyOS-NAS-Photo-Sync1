@echo off
chcp 65001 >nul
cd /d "c:\Users\lishi\Desktop\0402"
set "DEVECO_SDK_HOME=C:\Program Files\Huawei\DevEco Studio\sdk\default\hms"
echo ========================================
echo   NAS Photo Sync - Build Script
echo   API: 6.0.2 (22) | Hvigor: 6.22.4
echo   SDK: HarmonyOS NEXT (hms)
echo ========================================
echo.

"C:\Program Files\Huawei\DevEco Studio\tools\node\node.exe" "C:\Program Files\Huawei\DevEco Studio\tools\hvigor\bin\hvigorw.js" --mode module -p product=default assembleHap --analyze=normal --parallel

echo.
if %ERRORLEVEL% EQU 0 (
    echo ======
    echo   BUILD SUCCESSFUL ✅
    echo ======
) else (
    echo ======
    echo   BUILD FAILED - Error Code: %ERRORLEVEL%
    echo   Use DevEco Studio IDE: Build ^> Clean Project ^> Rebuild ^> Run
    echo ======
)
pause
