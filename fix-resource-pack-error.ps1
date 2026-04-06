$ErrorActionPreference = 'Stop'

$cacheRoot = Join-Path $env:USERPROFILE '.hvigor\project_caches'
$relativeTargets = @(
  'workspace\node_modules\@ohos\hvigor-ohos-plugin\src\tasks\process-resource.js',
  'workspace\node_modules\@ohos\hvigor-ohos-plugin\src\tasks\process-resource-increment.js',
  'workspace\node_modules\@ohos\hvigor-ohos-plugin\src\tasks\abstract\abstract-previewer-compile-resource.js',
  'workspace\node_modules\@ohos\hvigor-ohos-plugin\src\tasks\legacy-tasks\legacy-process-resource.js',
  'workspace\node_modules\@ohos\hvigor-ohos-plugin\src\tasks\legacy-tasks\legacy-process-resource-increment.js'
)

$replacements = @(
  @{
    Pattern = 'fs_1\.default\.existsSync\(e\)&&this\.restoolConfigBuilder\.addDefinedSysIds\(e\)'
    Replacement = 'fs_1.default.existsSync(e)&&0'
  },
  @{
    Pattern = 'this\.sdkInfo\.isOhos\|\|this\.restoolConfigBuilder\.addDefinedSysIds\(this\.sdkInfo\.getHosToolchainsDir\(\)\)'
    Replacement = 'this.sdkInfo.isOhos||0'
  },
  @{
    Pattern = 'this\.sdkInfo\.isOhos\|\|this\.linkCommand\.push\("--defined-sysids",path_1\.default\.resolve\(this\.sdkInfo\.getHosToolchainsDir\(\),"id_defined\.json"\)\)'
    Replacement = 'this.sdkInfo.isOhos||0'
  }
)

if (-not (Test-Path $cacheRoot)) {
  Write-Host "[ERROR] Hvigor cache directory not found: $cacheRoot"
  Write-Host "Please build or sync the project once in DevEco Studio, then run this script again."
  exit 1
}

$patchedFiles = New-Object System.Collections.Generic.List[string]
$scannedFiles = 0

Get-ChildItem $cacheRoot -Directory | ForEach-Object {
  foreach ($relativeTarget in $relativeTargets) {
    $filePath = Join-Path $_.FullName $relativeTarget
    if (-not (Test-Path $filePath)) {
      continue
    }

    $scannedFiles++
    $originalContent = Get-Content $filePath -Raw
    $updatedContent = $originalContent

    foreach ($replacement in $replacements) {
      $updatedContent = [regex]::Replace(
        $updatedContent,
        $replacement.Pattern,
        $replacement.Replacement
      )
    }

    if ($updatedContent -eq $originalContent) {
      continue
    }

    $backupPath = "$filePath.bak"
    if (-not (Test-Path $backupPath)) {
      Copy-Item $filePath $backupPath
    }

    Set-Content $filePath $updatedContent -NoNewline -Encoding UTF8
    $patchedFiles.Add($filePath)
  }
}

Write-Host "Scanned hvigor plugin files: $scannedFiles"

if ($patchedFiles.Count -eq 0) {
  Write-Host "[WARN] No patchable hvigor cache files were changed."
  Write-Host "If the error still exists, clean project caches in DevEco Studio, sync once, and rerun this script."
  exit 1
}

Write-Host "[OK] Patched hvigor cache files:"
$patchedFiles | ForEach-Object { Write-Host "  - $_" }
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Close DevEco Studio if it is currently building."
Write-Host "  2. Reopen the project."
Write-Host "  3. Run Build > Clean Project, then Build > Rebuild Project."
