#!/usr/bin/env bash
# cleanup.sh — привести репозиторий work_schedule в порядок.
# Запускать из корня репозитория (там, где .git).
#
# Делает три независимые вещи — при желании закомментируйте лишнее:
#   1) Удаляет 1.zip из ВСЕЙ истории git (сейчас .git весит ~55 МБ из-за
#      трёх закоммиченных копий архива по 16–27 МБ каждая — сам файл сейчас
#      пустой в HEAD, но байты всё равно лежат в истории и тянутся при клонировании).
#   2) Убирает из репозитория личные экспортированные файлы (график.html,
#      график_данные.csv/json, Рабочий график мой.xlsx) — это результаты
#      работы приложения, а не его код, им не место в git.
#   3) Добавляет .gitignore, чтобы такое не попадало обратно случайно.
#
# ВНИМАНИЕ: шаг 1 переписывает историю (меняются хэши всех коммитов).
# Если репозиторий запушен на GitHub/куда-либо ещё — после этого скрипта
# нужен `git push --force` и предупреждение всем, кто клонировал репо.
# Сделайте резервную копию перед запуском: cp -r . ../work_schedule.bak

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

echo "== 1. Удаляем 1.zip из истории git =="
if git log --all --oneline -- '1.zip' | grep -q .; then
  if command -v git-filter-repo >/dev/null 2>&1; then
    git filter-repo --path 1.zip --invert-paths --force
  else
    echo "git-filter-repo не найден, использую pip для установки..."
    if command -v pip3 >/dev/null 2>&1; then
      pip3 install --user --break-system-packages git-filter-repo || true
    fi
    if command -v git-filter-repo >/dev/null 2>&1; then
      git filter-repo --path 1.zip --invert-paths --force
    else
      echo "Не удалось установить git-filter-repo, откатываюсь на git filter-branch (медленнее, но без внешних зависимостей)."
      git filter-branch --force --index-filter \
        'git rm --cached --ignore-unmatch 1.zip' \
        --prune-empty --tag-name-filter cat -- --all
      rm -rf .git/refs/original/
    fi
  fi
else
  echo "1.zip в истории не найден — пропускаю."
fi

echo "== 2. Убираем личные экспортированные файлы из отслеживания =="
git rm --cached --ignore-unmatch \
  "график.html" \
  "график_данные.csv" \
  "график_данные.json" \
  "Рабочий график мой.xlsx" 2>/dev/null || true
# сами файлы на диске не трогаем — просто перестаём их коммитить

echo "== 3. Создаём/дополняем .gitignore =="
cat >> .gitignore <<'EOF'

# экспортированные пользователем данные — не часть приложения
график.html
график_данные.csv
график_данные.json
*.xlsx
!icons/*.png

# архивы никогда не коммитим
*.zip
EOF

echo "== 4. Финальная очистка и сборка мусора =="
git add .gitignore
git commit -m "chore: убрать zip-архив из истории и личные экспорты из репозитория" || true
rm -rf .git/refs/original/ 2>/dev/null || true
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "== Готово =="
echo "Размер .git до/после:"
du -sh .git
echo
echo "Если репозиторий уже был запушен куда-либо:"
echo "  git push --force --all"
echo "  git push --force --tags"
