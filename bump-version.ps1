# Меняет версию приложения сразу везде: во всех ?v=... в index.html
# и в js/config/app-version.js.
#
# Запускать из корня проекта (там же, где index.html):
#   .\bump-version.ps1              -> 2.1.0 станет 2.1.1 (следующая по счёту)
#   .\bump-version.ps1 -Version 3.0.0  -> поставит ровно 3.0.0
#
# После этого залейте файлы на хостинг — телефон гарантированно скачает новые,
# а не покажет старую версию из кеша.

param([string]$Version)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path 'index.html')) {
    Write-Host "index.html не найден. Запускайте скрипт из корня проекта." -ForegroundColor Red
    exit 1
}

$verFile = 'js/config/app-version.js'
$verText = Get-Content $verFile -Raw -Encoding UTF8
if ($verText -notmatch "APP_VERSION\s*=\s*'([^']+)'") {
    Write-Host "Не удалось прочитать текущую версию из $verFile" -ForegroundColor Red
    exit 1
}
$current = $Matches[1]

if ([string]::IsNullOrWhiteSpace($Version)) {
    # автоматически увеличиваем последнее число: 2.1.0 -> 2.1.1
    $parts = $current.Split('.')
    $parts[-1] = [int]$parts[-1] + 1
    $Version = $parts -join '.'
}

Write-Host "Версия: $current  ->  $Version"

# 1) js/config/app-version.js
$verText = $verText -replace "APP_VERSION\s*=\s*'[^']+'", "APP_VERSION = '$Version'"
[System.IO.File]::WriteAllText((Resolve-Path $verFile), $verText, (New-Object System.Text.UTF8Encoding $false))

# 2) все ?v=... в index.html
$html = Get-Content 'index.html' -Raw -Encoding UTF8
$html = $html -replace '\?v=[0-9A-Za-z\.\-]+', "?v=$Version"
$html = $html -replace 'ВЕРСИЯ ПРИЛОЖЕНИЯ: [0-9A-Za-z\.\-]+', "ВЕРСИЯ ПРИЛОЖЕНИЯ: $Version"
[System.IO.File]::WriteAllText((Resolve-Path 'index.html'), $html, (New-Object System.Text.UTF8Encoding $false))

Write-Host "Готово. Обновлены index.html и $verFile" -ForegroundColor Green
Write-Host "Теперь залейте файлы на хостинг."
