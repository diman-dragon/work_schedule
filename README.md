# Рабочий график — атомарная структура
## Архитектурный принцип

**Одна прикладная функция — один JS-файл.** Исходный монолитный `<script>` разобран на отдельные функции. `index.html` теперь отвечает за сборку DOM и подключение ресурсов, а CSS и JavaScript вынесены наружу.
## Структура

```text
work-schedule-atomic/
├── index.html
├── README.md
├── css/
│   └── app.css
└── js/
    ├── 00-config.js
    ├── 01-sanitizeorder.js
    ├── ...
    ├── 82-disconnectcloudsync.js
    ├── 84-close-data-menu.js
    ├── 85-move-month.js
    ├── 86-init-enhancements.js
    ├── 87-resume-cloud-sync.js
    └── bootstrap.js
```
## Роли файлов

### `index.html`
Только разметка приложения и подключения CSS/внешних библиотек/локальных JS-файлов. В нём нет прикладного JS и нет встроенного CSS.

### `css/app.css`
Весь исходный визуальный слой: Fluent/Windows 11, темы, календарь, карточки, модалки, адаптивность, печать, focus states, анимации и heatmap.

### `js/00-config.js`
Глобальное состояние и конфигурация. Прикладных функций нет.

### `js/*-function.js`
Каждый файл содержит одну именованную функцию верхнего уровня. Например `computeMinutes()` находится только в своём файле.

### `js/bootstrap.js`
Оркестратор запуска. Восстанавливает состояние, привязывает DOM, подключает обработчики, запускает render/синхронизацию/периодический пересчёт. Это связующий слой, а не место для отдельных бизнес-функций.

### UX-слой
`84-close-data-menu.js` и `85-move-month.js` вынесены отдельно; `86-init-enhancements.js` только собирает enhancement-поведение.

### Ядро и расчёты
- `sanitizeOrder()`
- `persistLocalOnly()`
- `persist()`
- `fmtNum()`
- `pluralRu()`
- `minutesToHM()`
- `timeToMin()`
- `computeMinutes()`
- `parseDate()`
- `shiftEndDateTime()`
- `isShiftPending()`
- `recomputeDay()`
- `recomputeMonth()`
- `recomputeAll()`

### Навигация и UI
- `getTodayYM()`
- `isTodayKey()`
- `ensureCurrentMonthExists()`
- `switchTab()`
- `updateHeaderSub()`
- `monthButton()`
- `renderMonthsStrip()`
- `renderOverallBar()`
- `render()`
- `openModal()`
- `getFrequentShiftTimes()`
- `renderRecentTimes()`
- `closeModal()`
- `updatePreview()`
- `showConfirmModal()`
- `closeConfirmModal()`
- `promptSyncPassword()`
- `closeSyncPassModal()`
- `makeMonthKey()`
- `buildEmptyMonth()`
- `showToast()`
- `applyTheme()`
- `applyHeatmap()`

### Статистика и графики
- `isoWeekKey()`
- `computeStats()`
- `renderStatCards()`
- `computeMonthComparisons()`
- `renderCompareCards()`
- `destroyCharts()`
- `chartColors()`
- `baseOptions()`
- `moneyLabel()`
- `hoursLabel()`
- `buildCharts()`
- `buildStats()`

### Файлы и backup
- `saveJsonFile()`
- `createLocalBackup()`
- `validateLoadedData()`
- `applyLoadedJson()`
- `loadJsonFile()`

### Crypto / Google Drive
- `b64encode()`
- `b64decode()`
- `deriveKey()`
- `encryptForCloud()`
- `decryptFromCloud()`
- `ensureTokenClient()`
- `requestCloudToken()`
- `driveApiError()`
- `driveFindFile()`
- `driveCreateFile()`
- `driveUpdateFile()`
- `driveDownloadFile()`
- `pullFromCloud()`
- `pushToCloud()`
- `isCloudSyncActive()`
- `runFullSync()`
- `pushAfterDaySave()`
- `connectCloudSync()`
- `disconnectCloudSync()`

### Визуальные утилиты
- `animateRaw()`
- `animateNumberLed()`
- `animateMinutesLed()`
- `sortOrderChronologically()`
- `hexToRgb()`
- `mixRgb()`
- `warmHeatColor()`
- `cssVar()`

## Что сохранено

Декомпозиция сделана от исходного приложения, а не как новая реализация. Сохранены основные подсистемы:

- календарь и месяцы;
- рабочие/выходные дни;
- расчёт времени и заработка;
- ставка;
- pending-смены;
- localStorage;
- JSON import/export;
- CSV export;
- локальный backup;
- статистика;
- сравнение месяцев;
- Chart.js-графики;
- тепловая карта;
- светлая/тёмная тема;
- печатный табель;
- Google Drive;
- клиентское шифрование AES-GCM/PBKDF2;
- адаптивность и UX enhancements.

## Запуск

Проект не требует npm/Vite/Webpack. Можно открыть `index.html` напрямую.

Для более предсказуемой работы браузерных API рекомендуется:

```bash
python -m http.server 8000
```

и открыть `http://localhost:8000/`.

Google Drive требует интернет-доступа к Google Identity Services и API.

## Правило дальнейшей разработки

Не возвращать бизнес-логику в `index.html`.

Если появляется новая возможность:

```text
UI      → index.html
style   → css/app.css
logic   → отдельный js-файл
wiring  → bootstrap.js / enhancement layer
```

Если функция стала достаточно самостоятельной — она должна жить в отдельном файле.

## Почему здесь пока не ES Modules

Архитектура сделана без сборщика и максимально близко к исходному приложению. Поэтому JS-файлы подключаются обычными `<script>` и используют общее состояние браузерной страницы.

Следующий этап, если понадобится ещё более строгая архитектура: перевести проект на ES Modules и сделать зависимости явными через `import`/`export`. Это уже отдельный рефакторинг, потому что придётся формализовать зависимости общего состояния.
