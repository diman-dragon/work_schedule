#!/usr/bin/env bash
# Запускать из корня проекта (там же, где index.html), например:
#   bash cleanup.sh
#
# Удаляет файлы, которые больше не подключены в index.html и были заменены
# в одном из прошлых обновлений (плашка "Итого за весь период" перенесена
# во вкладку "Статистика" — эти два файла её рисовали на вкладке "Табель").
set -e

FILES=(
  "css/04-overall-bar.css"
  "js/ui/render-overall-bar.js"
)

for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    rm -v "$f"
  else
    echo "уже отсутствует: $f"
  fi
done

echo "Готово."
