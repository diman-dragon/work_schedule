# Перестраивает историю git в 4 понятных коммита вместо 32 коммитов
# с названиями «1», «2», «123», «финал», «Финальный фикс» и т.п.
#
# Получится:
#   1. Инициализация
#   2. Первая версия
#   3. Вторая версия: мобильная (PWA, иконка, установка на телефон)
#   4. Финальная версия 3.0
#
# ВАЖНО:
#  * Старая история НЕ удаляется безвозвратно — скрипт сначала создаёт ветку
#    backup-<дата>, по которой всегда можно вернуться назад.
#  * Содержимое файлов не меняется. Меняется только то, как они разложены
#    по коммитам.
#  * Если репозиторий уже залит на GitHub/GitLab, отправить переписанную
#    историю можно только принудительно (git push --force) — это перезапишет
#    историю и на сервере. Если репозиторием пользуется кто-то ещё, так делать
#    не стоит; в одиночку — нормально.
#
# Запуск из корня проекта:  .\rebuild-git-history.ps1

$ErrorActionPreference = 'Stop'

if (-not (Test-Path '.git')) {
    Write-Host "Это не корень git-репозитория (.git не найден)." -ForegroundColor Red
    exit 1
}

# коммиты-опорные точки существующей истории
$initCommit   = '2dc360a'   # first commit — самое начало проекта
$firstVersion = 'd1a283e'   # «выбор автобуса» — последнее состояние до мобильной части
$mobileVer    = 'f63bb16'   # состояние после добавления PWA/иконок/манифеста

foreach ($c in @($initCommit, $firstVersion, $mobileVer)) {
    git rev-parse --verify "$c^{commit}" *> $null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Не найден коммит $c — история отличается от ожидаемой." -ForegroundColor Red
        Write-Host "Покажите вывод 'git log --oneline', и я поправлю скрипт." -ForegroundColor Yellow
        exit 1
    }
}

# 0) страховка: запоминаем текущую ветку и делаем резервную копию
$branch = (git rev-parse --abbrev-ref HEAD).Trim()
$backup = "backup-" + (Get-Date -Format 'yyyyMMdd-HHmmss')
git branch $backup
Write-Host "Старая история сохранена в ветке: $backup" -ForegroundColor Green

# сохраняем текущее рабочее состояние (включая незакоммиченные правки)
git add -A
git stash push -u -m "rebuild-history-worktree" *> $null
$hasStash = ($LASTEXITCODE -eq 0)

try {
    # 1) Инициализация — дерево самого первого коммита
    $t1 = git rev-parse "$initCommit^{tree}"
    $c1 = "Инициализация" | git commit-tree $t1

    # 2) Первая версия
    $t2 = git rev-parse "$firstVersion^{tree}"
    $msg2 = @"
Первая версия

Расчёт смен, часов и заработка, календарь по месяцам,
статистика и графики, экспорт и импорт данных.
"@
    $c2 = $msg2 | git commit-tree $t2 -p $c1

    # 3) Вторая версия: мобильная
    $t3 = git rev-parse "$mobileVer^{tree}"
    $msg3 = @"
Вторая версия: мобильная

PWA-манифест и иконки, установка на главный экран Android,
адаптация интерфейса под телефон.
"@
    $c3 = $msg3 | git commit-tree $t3 -p $c2

    # переводим ветку на новую историю
    git reset --hard $c3 *> $null

    # 4) Финальная версия 3.0 — текущее состояние файлов
    if ($hasStash) { git stash pop *> $null }
    git add -A

    $msg4 = @"
Финальная версия 3.0

Синхронизация с Google Диском только по кнопке; исправлена работа
на мобильных устройствах (запрос входа Google внутри нажатия,
токен больше не считается признаком подключения).

Защита данных: метка времени обновляется только при реальном изменении,
загрузка из облака учитывает содержимое, а не только время, запись
в облако не затирает более полную версию без подтверждения.
Добавлена кнопка восстановления данных из облака.

Версионирование ресурсов (?v=) против кеша браузера, показ версии
в интерфейсе, память о времени последней синхронизации,
понятные сообщения об ошибках, запуск с localhost.
"@
    $msg4 | git commit-tree (git write-tree) -p $c3 | ForEach-Object {
        git reset --hard $_ *> $null
    }

    git tag -f v3.0 *> $null

    Write-Host ""
    Write-Host "Готово. Новая история:" -ForegroundColor Green
    git log --oneline
    Write-Host ""
    Write-Host "Вернуться к старой истории, если что:  git reset --hard $backup" -ForegroundColor DarkGray
    Write-Host "Отправить на сервер:  git push --force origin $branch" -ForegroundColor DarkGray
}
catch {
    Write-Host "Ошибка: $_" -ForegroundColor Red
    Write-Host "Восстановите состояние командой:  git reset --hard $backup" -ForegroundColor Yellow
    exit 1
}
