# commit-13.ps1
# Adds commit #13 on top of your current history, dated today, with the
# offline/performance work (vendored libraries, lazy loading, Service Worker).
#
# Run this AFTER copying the changed files from this delivery into the
# project folder (overwriting the old ones / adding the new ones).
#
# Same safety approach as rebuild-git-history-12.ps1: this file is pure
# ASCII, the Russian commit message is Base64-encoded below and written to
# a temp UTF-8 file, passed to git via "commit -F <file>" (never piped
# through "|"), so it cannot be corrupted by console/pipe encoding issues.
#
# Run from the project root:
#   .\commit-13.ps1

$ErrorActionPreference = 'Stop'

function Decode-Utf8Base64([string]$b64) {
    $bytes = [System.Convert]::FromBase64String($b64)
    return [System.Text.Encoding]::UTF8.GetString($bytes)
}

function Write-Utf8NoBom([string]$path, [string]$text) {
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($path, $text, $utf8NoBom)
}

if (-not (Test-Path '.git')) {
    Write-Host "This is not a git repo root (.git not found here)." -ForegroundColor Red
    exit 1
}

$MSG13 = Decode-Utf8Base64 "0JDQstGC0L7QvdC+0LzQvdCw0Y8g0YDQsNCx0L7RgtCwINC+0YTQu9Cw0LnQvSDQuCDRg9GB0LrQvtGA0LXQvdC40LUg0LfQsNC/0YPRgdC60LAKCtCf0YDQuNC70L7QttC10L3QuNC1INCx0L7Qu9GM0YjQtSDQvdC1INC+0LHRgNCw0YnQsNC10YLRgdGPINCyINC40L3RgtC10YDQvdC10YIg0L/RgNC4INC+0LHRi9GH0L3QvtC8INC+0YLQutGA0YvRgtC40LguCgpDaGFydC5qcywg0L/Qu9Cw0LPQuNC9INC/0L7QtNC/0LjRgdC10Lkg0Log0L3QtdC80YMg0LggY29uZmV0dGkg0YDQsNC90YzRiNC1INCz0YDRg9C30LjQu9C40YHRjCDRgSBDRE4g0L/RgNC4CtC60LDQttC00L7QvCDQt9Cw0L/Rg9GB0LrQtSwg0LTQsNC20LUg0LXRgdC70Lgg0LLQutC70LDQtNC60LAg0YHRgtCw0YLQuNGB0YLQuNC60Lgg0L3QuCDRgNCw0LfRgyDQvdC1INC+0YLQutGA0YvQstCw0LvQsNGB0Ywg4oCUCtGC0LXQv9C10YDRjCDRjdGC0L4g0LvQvtC60LDQu9GM0L3Ri9C1INGE0LDQudC70YsgKGpzL3ZlbmRvci8pLCDQv9C+0LTQs9GA0YPQttCw0Y7RgtGB0Y8g0LvQtdC90LjQstC+LCDRgtC+0LvRjNC60L4K0LrQvtCz0LTQsCDQtNC10LnRgdGC0LLQuNGC0LXQu9GM0L3QviDQvdGD0LbQvdGLLCDQuCDRgNCw0LHQvtGC0LDRjtGCINCx0LXQtyDRgdC10YLQuC4KCtCh0LrRgNC40L/RgiDQsNCy0YLQvtGA0LjQt9Cw0YbQuNC4IEdvb2dsZSDQsdC+0LvRjNGI0LUg0L3QtSDQs9GA0YPQt9C40YLRgdGPINC30LDRgNCw0L3QtdC1OiDQv9C+0LTQutC70Y7Rh9Cw0LXRgtGB0Y8K0YLQvtC70YzQutC+INCyINC80L7QvNC10L3RgiDQvdCw0LbQsNGC0LjRjyDQutC90L7Qv9C60LggwqvQodC40L3RhdGA0L7QvdC40LfQuNGA0L7QstCw0YLRjMK7IOKAlCDQuNC90YLQtdGA0L3QtdGCINGC0LXQv9C10YDRjArQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0YDQvtCy0L3QviDRgtC+0LPQtNCwLCDQutC+0LPQtNCwINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDRgdCw0Lwg0Y3RgtC+INC30LDQv9GA0L7RgdC40LssINC4INC90LjQs9C00LUK0LHQvtC70YzRiNC1LgoK0JTQvtCx0LDQstC70LXQvSBTZXJ2aWNlIFdvcmtlciAoc3cuanMpOiDQstGB0LUg0YTQsNC50LvRiyDQv9GA0LjQu9C+0LbQtdC90LjRjyDQutGN0YjQuNGA0YPRjtGC0YHRjyDQvdCwCtGD0YHRgtGA0L7QudGB0YLQstC1INC/0YDQuCDQv9C10YDQstC+0Lwg0L/QvtGB0LXRidC10L3QuNC4INC4INC00LDQu9GM0YjQtSDQvtGC0LTQsNGO0YLRgdGPINC80LPQvdC+0LLQtdC90L3QviDQuNC3INC60Y3RiNCwLArQsdC10Lcg0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgtC4IOKAlCDRjdGC0L4g0Lgg0LTQsNGR0YIg0L3QsNGB0YLQvtGP0YnRg9GOINCw0LLRgtC+0L3QvtC80L3QvtGB0YLRjCDQuCDQsdGL0YHRgtGA0YvQuQrQt9Cw0L/Rg9GB0Log0L3QsCDRgtC10LvQtdGE0L7QvdC1LgoK0JjRgdC/0YDQsNCy0LvQtdC90L4g0L7RgtC+0LHRgNCw0LbQtdC90LjQtSDQstGA0LXQvNC10L3QuCDQv9C+0YHQu9C10LTQvdC10Lkg0YHQuNC90YXRgNC+0L3QuNC30LDRhtC40Lgg0L/RgNC4INC+0YLQutGA0YvRgtC40Lg6CtGA0LDQvdGM0YjQtSDQsdC70L7QutC40YDRg9GO0YnQsNGPINC30LDQs9GA0YPQt9C60LAg0LLQvdC10YjQvdC40YUg0LHQuNCx0LvQuNC+0YLQtdC6ICjQsdC10LcgZGVmZXIpINC80L7Qs9C70LAK0LfQsNGB0YLQvtC/0L7RgNC40YLRjCDQstGL0L/QvtC70L3QtdC90LjQtSDQstGB0LXQuSDQvtGH0LXRgNC10LTQuCDRgdC60YDQuNC/0YLQvtCyINC90LAg0LzQtdC00LvQtdC90L3QvtC5INC80L7QsdC40LvRjNC90L7QuQrRgdC10YLQuCwg0LLQutC70Y7Rh9Cw0Y8g0LrQvtC0LCDQv9C+0LrQsNC30YvQstCw0Y7RidC40Lkg0Y3RgtC+0YIg0YHRgtCw0YLRg9GBLgoKYnVtcC12ZXJzaW9uLnBzMSDRgtC10L/QtdGA0Ywg0L/RgNC4INGB0LzQtdC90LUg0LLQtdGA0YHQuNC4INC+0LHQvdC+0LLQu9GP0LXRgiDQuCBzdy5qcyAo0LLQtdGA0YHQuNGOINC60Y3RiNCwCtC4INGB0L/QuNGB0L7QuiDQutGN0YjQuNGA0YPQtdC80YvRhSDRhNCw0LnQu9C+0LIpLCDQvdC1INGC0L7Qu9GM0LrQviBpbmRleC5odG1sLg=="

$tmp = [System.IO.Path]::GetTempFileName()
try {
    Write-Utf8NoBom $tmp $MSG13
    git add -A
    git commit -F $tmp
    if ($LASTEXITCODE -ne 0) { throw "git commit failed" }
} finally {
    Remove-Item $tmp -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Done. Current history:" -ForegroundColor Green
git log --pretty="%h  %ad  %s" --date=format:'%Y-%m-%d'
Write-Host ""
Write-Host "To push:  git push origin main" -ForegroundColor DarkGray
