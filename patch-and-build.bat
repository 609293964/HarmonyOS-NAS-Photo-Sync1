@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ============================================
echo   NAS Photo Sync - Patch + Build
echo ============================================
echo.

set "HVIGOR_CACHE=c:\Users\lishi\.hvigor"
set "TARGET_FILE=hos-version-mapper.js"
set "PATCH_PATTERN=transferVersionIntoHosVersion(o){const s=this.getFullBaseApi(o)"
set "PATCH_REPLACE=transferVersionIntoHosVersion(o){o=o.replace(/\(\d+\)$/,"");const s=this.getFullBaseApi(o)"

echo [Step 1/3] Searching for hos-version-mapper.js in hvigor cache...
set "FOUND=0"

for /r "%HVIGOR_CACHE%" %%F in (%TARGET_FILE%) do (
    echo   Found: %%F
    set "FILEPATH=%%F"
    set "FOUND=1"
    
    echo [Step 2/3] Checking if already patched...
    findstr /C:"o=o.replace" "!FILEPATH!" >nul 2>&1
    if !errorlevel! equ 0 (
        echo   Already patched, skipping.
    ) else (
        echo   Applying patch...
        powershell -Command "(Get-Content '!FILEPATH!' -Raw) -replace '%PATCH_PATTERN%', '%PATCH_REPLACE%' | Set-Content '!FILEPATH!' -NoNewline"
        if !errorlevel! equ 0 (
            echo   Patch applied OK.
        ) else (
            echo   Patch FAILED!
        )
    )
)

if %FOUND% equ 0 (
    echo   WARNING: No hos-version-mapper.js found in cache!
)

echo.
echo [Step 3/3] Running build...
echo.

set "DEVECO_SDK_HOME=C:\Program Files\Huawei\DevEco Studio\sdk\default"
"C:\Program Files\Huawei\DevEco Studio\tools\node\node.exe" "C:\Program Files\Huawei\DevEco Studio\tools\hvigor\bin\hvigorw.js" --mode module -p module=entry@default -p product=default -p requiredDeviceType=phone assembleHap --analyze=normal --parallel --incremental --daemon

echo.
echo Build exit code: %errorlevel%
endlocal
