# rebuild-git-history.ps1
#
# Rebuilds git history into 4 clean commits instead of 32 messy ones
# ("1", "2", "123", "final fix", etc.):
#   1. Init
#   2. First version
#   3. Second version: mobile (PWA, icon, install on phone)
#   4. Final version 3.0
#
# SAFE BY DESIGN:
#  - This file is pure ASCII on purpose (no Cyrillic in the code itself).
#    Russian commit-message text is stored below as Base64 and decoded at
#    runtime, so the file's own encoding never breaks parsing.
#  - Commit messages are written to temporary UTF-8 files and passed to git
#    via "commit-tree -F <file>", NOT piped through "|". Piping a .NET string
#    into a native program goes through PowerShell's $OutputEncoding, which
#    on Windows PowerShell 5.1 defaults to plain ASCII and silently turns
#    every Cyrillic character into "?". Writing an explicit UTF-8 file and
#    passing its path avoids that pipe entirely.
#  - Old history is NOT deleted. A backup branch is created first; its name
#    is printed at the end, and you can always go back with:
#      git reset --hard <backup-branch-name>
#  - File contents are not changed, only how they are grouped into commits.
#
# If this repo is already pushed to GitHub/GitLab, sending the new history
# there requires a FORCE push (shown at the end). That's fine if you are the
# only one using this repo; don't do it if others rely on the old history.
#
# Run from the project root (same folder as the .git folder):
#   .\rebuild-git-history.ps1

$ErrorActionPreference = 'Stop'

function Decode-Utf8Base64([string]$b64) {
    $bytes = [System.Convert]::FromBase64String($b64)
    return [System.Text.Encoding]::UTF8.GetString($bytes)
}

# writes text to a temp file as UTF-8 WITHOUT BOM (git expects raw UTF-8,
# a BOM in a commit message would show up as a stray character on GitHub etc.)
function Write-Utf8NoBom([string]$path, [string]$text) {
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($path, $text, $utf8NoBom)
}

function New-CommitFromMessage([string]$tree, [string]$parent, [string]$text) {
    $tmp = [System.IO.Path]::GetTempFileName()
    try {
        Write-Utf8NoBom $tmp $text
        if ($parent) {
            $hash = git commit-tree $tree -p $parent -F $tmp
        } else {
            $hash = git commit-tree $tree -F $tmp
        }
        if ($LASTEXITCODE -ne 0) { throw "git commit-tree failed" }
        return $hash.Trim()
    } finally {
        Remove-Item $tmp -ErrorAction SilentlyContinue
    }
}

# ---- Russian commit messages, stored as Base64 (see header above) ----
$msg1 = Decode-Utf8Base64 "0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8="
$msg2 = Decode-Utf8Base64 "0J/QtdGA0LLQsNGPINCy0LXRgNGB0LjRjwoK0KDQsNGB0YfRkdGCINGB0LzQtdC9LCDRh9Cw0YHQvtCyINC4INC30LDRgNCw0LHQvtGC0LrQsCwg0LrQsNC70LXQvdC00LDRgNGMINC/0L4g0LzQtdGB0Y/RhtCw0LwsCtGB0YLQsNGC0LjRgdGC0LjQutCwINC4INCz0YDQsNGE0LjQutC4LCDRjdC60YHQv9C+0YDRgiDQuCDQuNC80L/QvtGA0YIg0LTQsNC90L3Ri9GFLg=="
$msg3 = Decode-Utf8Base64 "0JLRgtC+0YDQsNGPINCy0LXRgNGB0LjRjzog0LzQvtCx0LjQu9GM0L3QsNGPCgpQV0Et0LzQsNC90LjRhNC10YHRgiDQuCDQuNC60L7QvdC60LgsINGD0YHRgtCw0L3QvtCy0LrQsCDQvdCwINCz0LvQsNCy0L3Ri9C5INGN0LrRgNCw0L0gQW5kcm9pZCwK0LDQtNCw0L/RgtCw0YbQuNGPINC40L3RgtC10YDRhNC10LnRgdCwINC/0L7QtCDRgtC10LvQtdGE0L7QvS4="
$msg4 = Decode-Utf8Base64 "0KTQuNC90LDQu9GM0L3QsNGPINCy0LXRgNGB0LjRjyAzLjAKCtCh0LjQvdGF0YDQvtC90LjQt9Cw0YbQuNGPINGBIEdvb2dsZSDQlNC40YHQutC+0Lwg0YLQvtC70YzQutC+INC/0L4g0LrQvdC+0L/QutC1OyDQuNGB0L/RgNCw0LLQu9C10L3QsCDRgNCw0LHQvtGC0LAK0L3QsCDQvNC+0LHQuNC70YzQvdGL0YUg0YPRgdGC0YDQvtC50YHRgtCy0LDRhSAo0LfQsNC/0YDQvtGBINCy0YXQvtC00LAgR29vZ2xlINCy0L3Rg9GC0YDQuCDQvdCw0LbQsNGC0LjRjywK0YLQvtC60LXQvSDQsdC+0LvRjNGI0LUg0L3QtSDRgdGH0LjRgtCw0LXRgtGB0Y8g0L/RgNC40LfQvdCw0LrQvtC8INC/0L7QtNC60LvRjtGH0LXQvdC40Y8pLgoK0JfQsNGJ0LjRgtCwINC00LDQvdC90YvRhTog0LzQtdGC0LrQsCDQstGA0LXQvNC10L3QuCDQvtCx0L3QvtCy0LvRj9C10YLRgdGPINGC0L7Qu9GM0LrQviDQv9GA0Lgg0YDQtdCw0LvRjNC90L7QvCDQuNC30LzQtdC90LXQvdC40LgsCtC30LDQs9GA0YPQt9C60LAg0LjQtyDQvtCx0LvQsNC60LAg0YPRh9C40YLRi9Cy0LDQtdGCINGB0L7QtNC10YDQttC40LzQvtC1LCDQsCDQvdC1INGC0L7Qu9GM0LrQviDQstGA0LXQvNGPLCDQt9Cw0L/QuNGB0YwK0LIg0L7QsdC70LDQutC+INC90LUg0LfQsNGC0LjRgNCw0LXRgiDQsdC+0LvQtdC1INC/0L7Qu9C90YPRjiDQstC10YDRgdC40Y4g0LHQtdC3INC/0L7QtNGC0LLQtdGA0LbQtNC10L3QuNGPLgrQlNC+0LHQsNCy0LvQtdC90LAg0LrQvdC+0L/QutCwINCy0L7RgdGB0YLQsNC90L7QstC70LXQvdC40Y8g0LTQsNC90L3Ri9GFINC40Lcg0L7QsdC70LDQutCwLgoK0JLQtdGA0YHQuNC+0L3QuNGA0L7QstCw0L3QuNC1INGA0LXRgdGD0YDRgdC+0LIgKD92PSkg0L/RgNC+0YLQuNCyINC60LXRiNCwINCx0YDQsNGD0LfQtdGA0LAsINC/0L7QutCw0Lcg0LLQtdGA0YHQuNC4CtCyINC40L3RgtC10YDRhNC10LnRgdC1LCDQv9Cw0LzRj9GC0Ywg0L4g0LLRgNC10LzQtdC90Lgg0L/QvtGB0LvQtdC00L3QtdC5INGB0LjQvdGF0YDQvtC90LjQt9Cw0YbQuNC4LArQv9C+0L3Rj9GC0L3Ri9C1INGB0L7QvtCx0YnQtdC90LjRjyDQvtCxINC+0YjQuNCx0LrQsNGFLCDQt9Cw0L/Rg9GB0Log0YEgbG9jYWxob3N0Lg=="

if (-not (Test-Path '.git')) {
    Write-Host "This is not a git repo root (.git not found here)." -ForegroundColor Red
    exit 1
}

$initCommit   = '2dc360a'
$firstVersion = 'd1a283e'
$mobileVer    = 'f63bb16'

foreach ($c in @($initCommit, $firstVersion, $mobileVer)) {
    git rev-parse --verify "$c^{commit}" *> $null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Commit $c not found - your history differs from what this script expects." -ForegroundColor Red
        Write-Host "Please paste the output of 'git log --oneline' and this script will be adjusted." -ForegroundColor Yellow
        exit 1
    }
}

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
$backup = "backup-" + (Get-Date -Format 'yyyyMMdd-HHmmss')
git branch $backup
Write-Host "Old history saved in branch: $backup" -ForegroundColor Green

git add -A
git stash push -u -m "rebuild-history-worktree" *> $null
$hasStash = ($LASTEXITCODE -eq 0)

try {
    $t1 = git rev-parse "$initCommit^{tree}"
    $c1 = New-CommitFromMessage $t1 $null $msg1

    $t2 = git rev-parse "$firstVersion^{tree}"
    $c2 = New-CommitFromMessage $t2 $c1 $msg2

    $t3 = git rev-parse "$mobileVer^{tree}"
    $c3 = New-CommitFromMessage $t3 $c2 $msg3

    git reset --hard $c3 *> $null

    if ($hasStash) { git stash pop *> $null }
    git add -A

    $newTree = (git write-tree).Trim()
    $c4 = New-CommitFromMessage $newTree $c3 $msg4
    git reset --hard $c4 *> $null

    git tag -f v3.0 *> $null

    Write-Host ""
    Write-Host "Done. New history:" -ForegroundColor Green
    git log --pretty="%h  %s"
    Write-Host ""
    Write-Host "To go back to the old history:  git reset --hard $backup" -ForegroundColor DarkGray
    Write-Host "To push to remote (force):      git push --force origin $branch" -ForegroundColor DarkGray
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "Restore previous state with:  git reset --hard $backup" -ForegroundColor Yellow
    exit 1
}