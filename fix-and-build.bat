@echo off
chcp 65001 >nul
echo ========================================
echo   NAS Photo Sync - 恢复插件缓存并编译
echo ========================================
echo.

set "SRC=C:\Program Files\Huawei\DevEco Studio\tools\hvigor\hvigor-ohos-plugin"
set "DST=C:\Users\lishi\.hvigor\project_caches\48df5750110a5d4df108a75c1b995f37\workspace\node_modules\@ohos\hvigor-ohos-plugin"

if not exist "%SRC%" (
    echo [ERROR] 插件源不存在: %SRC%
    echo 请确认 DevEco Studio 已正确安装
    pause
    exit /b 1
)

echo [1/3] 创建目标目录...
mkdir "%DST%" 2>nul

echo [2/3] 复制 hvigor-ohos-plugin...
xcopy /E /Y /I "%SRC%" "%DST%"

if exist "%DST%\package.json" (
    echo [OK] 插件复制成功
) else (
    echo [ERROR] 复制失败
    pause
    exit /b 1
)

echo.
echo [3/3] 开始编译...
cd /d "c:\Users\lishi\Desktop\0402"
set "DEVECO_SDK_HOME=C:\Program Files\Huawei\DevEco Studio\sdk\default\openharmony"

"C:\Program Files\Huawei\DevEco Studio\tools\node\node.exe" "C:\Program Files\Huawei\DevEco Studio\tools\hvigor\bin\hvigorw.js" --mode module -p product=default assembleHap --analyze=normal --parallel

echo.
if %ERRORLEVEL% EQU 0 (
    echo ======
    echo   BUILD SUCCESSFUL ^!
    echo ======
) else (
    echo ======
    echo   BUILD FAILED - Code: %ERRORLEVEL%
    echo ======
)
pause
