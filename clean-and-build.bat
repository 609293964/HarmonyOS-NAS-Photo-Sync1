@echo off
echo ============================================
echo   HarmonyOS 项目 - 清理并重建脚本
echo ============================================
echo.

echo [步骤 1/4] 停止 DevEco Studio 的 hvigor daemon 进程...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *hvigor*" 2>nul
timeout /t 1 /nobreak >nul

echo [步骤 2/4] 清理构建缓存目录...
if exist "entry\build" (
    echo     删除 entry\build...
    rmdir /S /Q "entry\build"
    echo     ✓ 已删除
) else (
    echo     (目录不存在，跳过)
)

if exist ".hvigor" (
    echo     删除 .hvigor 缓存...
    rmdir /S /Q ".hvigor"
    echo     ✓ 已删除
) else (
    echo     (目录不存在，跳过)
)

if exist "oh_modules" (
    echo     保留 oh_modules (依赖模块)
) else (
    echo     (oh_modules 不存在)
)

if exist "build" (
    echo     删除根目录 build...
    rmdir /S /Q "build"
    echo     ✓ 已删除
) else (
    echo     (目录不存在，跳过)
)

echo.
echo [步骤 3/4] 清理完成！即将开始全新编译...
echo.

echo [步骤 4/4] 执行编译（带签名）...
echo.
call "C:\Program Files\Huawei\DevEco Studio\tools\node\node.exe" "C:\Program Files\Huawei\DevEco Studio\tools\hvigor\bin\hvigorw.js" --mode module -p module=entry@default -p product=default assembleHap --analyze=normal --parallel --daemon

echo.
echo ============================================
echo   编译完成！请检查输出：
echo   - 应该生成: entry-default-signed.hap (带签名)
echo   - 而不是:   entry-default-unsigned.hap (无签名)
echo ============================================
echo.
pause
