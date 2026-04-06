$ErrorActionPreference = 'Stop'

$sdkFile = 'C:\Program Files\Huawei\DevEco Studio\sdk\default\openharmony\toolchains\id_defined.json'
$sdkToolchainsDir = Split-Path $sdkFile -Parent
$localToolchainsDir = Join-Path $PSScriptRoot 'tools\openharmony-toolchains-fixed'
$cacheRoot = Join-Path $env:USERPROFILE '.hvigor\project_caches'

function Get-OrderMismatchCount {
  param(
    [Parameter(Mandatory = $true)]
    [object]$JsonObject
  )

  $count = 0
  for ($i = 0; $i -lt $JsonObject.record.Count; $i++) {
    if ([int]$JsonObject.record[$i].order -ne $i) {
      $count++
    }
  }

  return $count
}

function Normalize-OrdersInFile {
  param(
    [Parameter(Mandatory = $true)]
    [string]$FilePath
  )

  $json = Get-Content $FilePath -Raw | ConvertFrom-Json
  $mismatchCount = Get-OrderMismatchCount -JsonObject $json

  if ($mismatchCount -eq 0) {
    return 0
  }

  for ($i = 0; $i -lt $json.record.Count; $i++) {
    $json.record[$i].order = $i
  }

  $newContent = $json | ConvertTo-Json -Depth 6 -Compress
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($FilePath, $newContent, $utf8NoBom)

  $verifyJson = Get-Content $FilePath -Raw | ConvertFrom-Json
  $remaining = Get-OrderMismatchCount -JsonObject $verifyJson
  if ($remaining -ne 0) {
    throw "Verification failed for $FilePath. Remaining mismatches: $remaining"
  }

  return $mismatchCount
}

function Patch-HvigorCacheForLocalRestool {
  param(
    [Parameter(Mandatory = $true)]
    [string]$LocalToolchainsDir
  )

  if (-not (Test-Path $cacheRoot)) {
    throw "Hvigor cache directory not found: $cacheRoot"
  }

  $targetRelativePath = 'workspace\node_modules\@ohos\hvigor-ohos-plugin\src\sdk\impl\sdk-toolchains-component.js'
  $patchedFiles = New-Object System.Collections.Generic.List[string]
  $escapedLocalDir = $LocalToolchainsDir.Replace('\', '\\')
  $pattern = 'getRestoolPath\(\)\{const o=\(0,hvigor_1\.isWindows\)\(\)\?"restool\.exe":"restool"(?:,e=path_1\.default\.resolve\(".*?",o\);return require\("fs"\)\.existsSync\(e\)\?e:|;)return path_1\.default\.resolve\(this\.getBaseDir\(\),o\)\}'
  $replacement = 'getRestoolPath(){const o=(0,hvigor_1.isWindows)()?"restool.exe":"restool",e=path_1.default.resolve("' + $escapedLocalDir + '",o);return require("fs").existsSync(e)?e:path_1.default.resolve(this.getBaseDir(),o)}'

  Get-ChildItem $cacheRoot -Directory | ForEach-Object {
    $filePath = Join-Path $_.FullName $targetRelativePath
    if (-not (Test-Path $filePath)) {
      return
    }

    $originalContent = Get-Content $filePath -Raw
    $updatedContent = [regex]::Replace($originalContent, $pattern, $replacement)

    if ($updatedContent -eq $originalContent) {
      if ($originalContent.Contains($escapedLocalDir)) {
        $patchedFiles.Add($filePath)
      }
      return
    }

    $backupPath = "$filePath.bak"
    if (-not (Test-Path $backupPath)) {
      Copy-Item $filePath $backupPath
    }

    Set-Content $filePath $updatedContent -NoNewline -Encoding UTF8
    $patchedFiles.Add($filePath)
  }

  if ($patchedFiles.Count -eq 0) {
    throw 'No hvigor cache sdk-toolchains-component.js file was patched.'
  }

  return $patchedFiles
}

function Use-LocalToolchainWorkaround {
  if (-not (Test-Path $sdkToolchainsDir)) {
    throw "SDK toolchains directory not found: $sdkToolchainsDir"
  }

  Write-Host "[INFO] Falling back to a workspace-local restool toolchain copy."

  if (Test-Path $localToolchainsDir) {
    Remove-Item -LiteralPath $localToolchainsDir -Recurse -Force
  }

  New-Item -ItemType Directory -Path $localToolchainsDir -Force | Out-Null
  Copy-Item -Path (Join-Path $sdkToolchainsDir '*') -Destination $localToolchainsDir -Recurse -Force

  $localIdDefined = Join-Path $localToolchainsDir 'id_defined.json'
  $fixedCount = Normalize-OrdersInFile -FilePath $localIdDefined
  $patchedFiles = Patch-HvigorCacheForLocalRestool -LocalToolchainsDir $localToolchainsDir

  Write-Host "[OK] Local restool toolchain created: $localToolchainsDir"
  Write-Host "[OK] Local id_defined.json normalized. Fixed mismatches: $fixedCount"
  Write-Host "[OK] Hvigor cache patched to use workspace-local restool:"
  $patchedFiles | ForEach-Object { Write-Host "  - $_" }
}

if (-not (Test-Path $sdkFile)) {
  Write-Host "[ERROR] SDK file not found: $sdkFile"
  exit 1
}

$json = Get-Content $sdkFile -Raw | ConvertFrom-Json
$mismatchCount = Get-OrderMismatchCount -JsonObject $json

if ($mismatchCount -eq 0) {
  Write-Host "[OK] No order mismatch found in SDK file."
  exit 0
}

$firstMismatch = $null
for ($i = 0; $i -lt $json.record.Count; $i++) {
  if ([int]$json.record[$i].order -ne $i) {
    $firstMismatch = [PSCustomObject]@{
      Index = $i
      Order = [int]$json.record[$i].order
      Name = $json.record[$i].name
      Type = $json.record[$i].type
    }
    break
  }
}

Write-Host "Found order mismatches: $mismatchCount"
Write-Host "First mismatch:"
$firstMismatch | Format-Table -AutoSize

try {
  $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  $backupFile = "$sdkFile.$timestamp.bak"
  Copy-Item $sdkFile $backupFile
  Write-Host "Backup created: $backupFile"

  $fixedCount = Normalize-OrdersInFile -FilePath $sdkFile
  Write-Host "[OK] SDK id_defined.json order values were normalized."
  Write-Host "[OK] Fixed mismatches: $fixedCount"
  Write-Host "Next steps:"
  Write-Host "  1. Rebuild the project in DevEco Studio."
  Write-Host "  2. If another resource error appears, run fix-resource-pack-error.bat as well."
}
catch {
  Write-Host "[WARN] Direct SDK repair failed: $($_.Exception.Message)"
  Use-LocalToolchainWorkaround
  Write-Host "Next steps:"
  Write-Host "  1. Rebuild the project in DevEco Studio."
  Write-Host "  2. If another resource error appears, run fix-resource-pack-error.bat as well."
}
