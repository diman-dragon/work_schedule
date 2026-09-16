# Запускает приложение на http://localhost:8000 и открывает его в браузере.
#
# Зачем это нужно: при открытии index.html двойным кликом адрес выглядит как
# file:///C:/... — в таком режиме Google OAuth принципиально не работает
# (Google требует нормальный http/https-адрес), да и часть возможностей
# браузера отключена. Через localhost всё работает как на настоящем сайте.
#
# Запуск: правой кнопкой по файлу -> "Выполнить с помощью PowerShell",
# либо в консоли из корня проекта:  .\start-localhost.ps1
#
# Остановить сервер: Ctrl+C в открывшемся окне.

param([int]$Port = 8000)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path 'index.html')) {
    Write-Host "index.html не найден. Запускайте скрипт из корня проекта." -ForegroundColor Red
    exit 1
}

$url = "http://localhost:$Port"

# ищем, чем поднять сервер: сначала Python, потом Node
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) { $python = Get-Command py -ErrorAction SilentlyContinue }
$node = Get-Command npx -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "  Адрес приложения: $url" -ForegroundColor Cyan
Write-Host "  Остановить сервер: Ctrl+C" -ForegroundColor DarkGray
Write-Host ""

# открываем браузер с небольшой задержкой, чтобы сервер успел подняться
Start-Job -ScriptBlock { Start-Sleep -Seconds 2; Start-Process $using:url } | Out-Null

if ($python) {
    & $python.Source -m http.server $Port
}
elseif ($node) {
    & npx --yes http-server -p $Port -c-1 .
}
else {
    Write-Host "Не найден ни Python, ни Node.js." -ForegroundColor Red
    Write-Host "Установите Python с https://www.python.org/downloads/ (при установке отметьте 'Add to PATH')," -ForegroundColor Yellow
    Write-Host "после чего запустите этот скрипт снова." -ForegroundColor Yellow
    exit 1
}
