<div align="center">

# 🚌 Рабочий график — Work Schedule

### A single‑page, zero‑backend timesheet & earnings tracker for shift workers

![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Build Step](https://img.shields.io/badge/Build%20Step-None-success?style=for-the-badge)
![Chart.js](https://img.shields.io/badge/Charts-Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Offline First](https://img.shields.io/badge/Offline-First-2ea44f?style=for-the-badge)
![Google Drive Sync](https://img.shields.io/badge/Sync-Google%20Drive%20(E2E%20Encrypted)-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)

**123 JS modules · 17 CSS layers · 1 `index.html` · 0 dependencies to install · 0 servers to run**

</div>

---

## ✨ What is this?

`work_schedule` is a **fully client‑side web app** for tracking irregular work shifts (built with a bus‑driver's schedule in mind, but generic enough for any hourly job). Open `index.html` in a browser and you get a complete payroll & analytics console — no npm install, no backend, no database. Everything lives in the browser (`localStorage`), with optional **encrypted sync to Google Drive** so the schedule follows you across devices.

It answers three questions at a glance:

1. **When did I work, and for how long?** → interactive monthly calendar
2. **How much did I earn?** → live LED-style counters, computed automatically from an hourly rate
3. **What are my patterns?** → a full statistics dashboard with 10+ charts

```
┌──────────────────────────────────────────────────────────┐
│                     🚌  Рабочий график                     │
├──────────────────────────────────────────────────────────┤
│  [ Ставка: 700 дин/ч ]  [Сегодня] [🌙] [⋯ Данные] [☁️ Sync] │
├──────────────────────────────────────────────────────────┤
│   Табель            Статистика                            │
├──────────────────────────────────────────────────────────┤
│   ⏱ 172ч 30м     💰 120 750 дин.     📅 21 смена           │
├──────────────────────────────────────────────────────────┤
│   Пн  Вт  Ср  Чт  Пт  Сб  Вс                                │
│   ▢   ▢   ●   ●   ●   ▢   ▢     ● = shift   ▢ = day off     │
│   ●   ●   ▢   ●   ●   ●   ▢                                 │
│   ...                                                       │
└──────────────────────────────────────────────────────────┘
```

---

## 🧩 Feature matrix

| Category | What it does |
|---|---|
| 📅 **Interactive calendar** | Click any day to mark it worked/off, set start & end time, attach a bus/route, leave notes. Swipe‑navigation between months on mobile. |
| ⏱ **Auto‑computed everything** | Hours, minutes, and earnings recalculate live from `rate × time` the instant you edit a shift — including shifts that cross midnight. |
| 🟡 **Live shift states** | Distinct visual states for *future*, *not started yet*, and *in progress — earnings not final* shifts, refreshed by a background watcher. |
| 🔥 **Earnings heatmap** | One click recolors the whole calendar by how much each day earned. |
| 📊 **Statistics dashboard** | Best day / best month, average shift length, effective hourly rate, weekday vs. weekend split, top‑5 highest‑earning shifts, shift‑length distribution, weekly trend, most common start times, and per‑bus / per‑route breakdowns. |
| 📈 **10+ live charts** | Rendered with Chart.js + a data‑labels plugin: bar, line, and doughnut charts for hours, earnings, cumulative income, weekday patterns, and more. |
| 🖼 **Day photos** | Attach a photo of the physical shift schedule to any day (auto‑compressed client‑side before storage), with a full‑screen lightbox viewer. |
| 🖨 **Print‑ready timesheet** | One click produces a clean A4 printable table — perfect for HR or payroll submission. |
| 💾 **Import / export** | Full JSON backup/restore, CSV export for spreadsheets, and an automatic local backup safety net before destructive actions. |
| ☁️ **End‑to‑end encrypted cloud sync** | Optional Google Drive sync — your data is encrypted with a password *before* it ever leaves the browser (Web Crypto API), so not even Google can read it. |
| 🌗 **Themes & accessibility** | Light/dark theme toggle, `prefers-reduced-motion` support, full keyboard navigation, and ARIA roles throughout. |
| 📱 **Responsive design** | Two dedicated responsive breakpoints (`08-responsive-early.css`, `15-responsive-late.css`) tuned for phones up through desktops. |

---

## 🏗 Architecture

No framework, no bundler, no `package.json` — just **cleanly decomposed vanilla JS**, loaded as plain `<script>` tags in dependency order, and CSS split into numbered "layers" that build up the design system.

```
work_schedule/
├── index.html                  ← single entry point, wires up every module
├── css/
│   ├── 00-tokens-and-reset.css     ← design tokens (colors, spacing, fonts)
│   ├── 01-header.css … 17-print-a4.css
│   └── ...                         ← 17 layered stylesheets, cascade by number
└── js/
    ├── init/            → app bootstrap, state init, first render
    ├── data/             → load/save/validate/export JSON & CSV, local backups
    ├── shift/            → time math: minutes, midnight‑crossing shifts, recompute
    ├── calendar/          → month grid rendering, swipe navigation
    ├── day-modal/         → the "edit a day" dialog + recent‑times autocomplete
    ├── stats/             → all statistical aggregations
    ├── charts/             → Chart.js chart builders & shared styling
    ├── heatmap/            → earnings heatmap coloring
    ├── photo/              → image compression, preview, lightbox
    ├── cloud/              → Google Drive OAuth, AES encryption, push/pull sync
    ├── print/               → A4 printable timesheet generator
    ├── modals/               → generic confirm/prompt modal helpers
    ├── ui/                    → theming, toasts, tabs, LED-counter animations
    ├── config/                 → month/weekday name tables (RU locale)
    └── utils/                   → date parsing, currency & number formatting
```

**Design philosophy:** every file does one thing — `compute-minutes.js` only computes minutes, `save-day-handler.js` only handles saving a day. This makes the codebase easy to audit, easy to hand off, and trivial to extend without any build tooling.

### Data flow

```
User edits a day  →  save-day-handler.js
                          │
                          ▼
                 recompute-day.js  (minutes, earnings)
                          │
                          ▼
                 recompute-month.js → recompute-all.js
                          │
             ┌────────────┼─────────────┐
             ▼            ▼              ▼
     render-calendar   build-stats   persist.js
     (LEDs, grid)      (dashboard)   (localStorage
                                      + optional
                                      encrypted push
                                      to Google Drive)
```

---

## 🔐 Cloud sync, explained

Sync is **fully optional** and **zero‑trust by design**:

1. You sign in with Google (OAuth, read/write access to your own Drive only).
2. You choose a password — it never leaves your device.
3. A key is derived from that password (`derive-key.js`) and used to **AES‑encrypt** your schedule (`encrypt-for-cloud.js`) before upload.
4. Google Drive only ever stores an opaque encrypted blob; decryption happens locally (`decrypt-from-cloud.js`) after download.

If you forget the password, the encrypted backup simply can't be read by anyone — including the app itself.

---

## 🚀 Getting started

No installation required.

```bash
# Clone or download, then just open it:
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

Or serve it locally if you prefer (needed only for the Google Drive OAuth flow to work correctly):

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

**That's it.** Set your hourly rate in the top bar, click a day, log a shift — the calendar, LEDs, and stats update instantly.

---

## 📦 Data & privacy

- Data is stored **locally first**, in `localStorage` — the app works fully offline.
- Nothing is sent anywhere unless you explicitly turn on cloud sync.
- You can export/import your entire schedule as JSON at any time (`💾 Сохранить JSON` / `📂 Загрузить JSON`), or export a CSV for Excel/Sheets.
- A one‑click **"Быстрый бэкап"** creates a timestamped local safety copy before you do anything risky.

---

## 🛠 Tech stack

| Layer | Choice | Why |
|---|---|---|
| UI | Vanilla HTML/CSS/JS | Zero build step, opens from a single file, easy to self‑host anywhere |
| Charts | [Chart.js](https://www.chartjs.org/) + datalabels plugin | Lightweight, no framework lock‑in |
| Storage | `localStorage` + Web Crypto API | Offline‑first, private by default |
| Cloud sync | Google Drive API (OAuth) | Free, ubiquitous, no custom backend to maintain |

---

## 🗺 Roadmap ideas

- [ ] Multi‑user / multi‑profile support
- [ ] PWA install prompt + service worker for full offline caching
- [ ] Configurable currency & locale (currently tuned for RSD / Russian UI)
- [ ] CSV import (currently export‑only)

---

<div align="center">

Built as a hand‑decomposed, dependency‑free single‑page app — proof that you don't need a framework to ship something polished.

</div>

---
---

<div align="center">

# 🚌 Рабочий график

### Одностраничный трекер смен и заработка без сервера — весь бэкенд у вас в браузере

![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Без сборки](https://img.shields.io/badge/Build%20Step-Не%20нужен-success?style=for-the-badge)
![Chart.js](https://img.shields.io/badge/Графики-Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Офлайн](https://img.shields.io/badge/Offline-First-2ea44f?style=for-the-badge)
![Синхронизация](https://img.shields.io/badge/Sync-Google%20Drive%20(шифрование)-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)

**123 JS‑модуля · 17 слоёв CSS · один `index.html` · ничего не нужно устанавливать и запускать**

</div>

---

## ✨ Что это такое?

`work_schedule` — это **полностью клиентское веб‑приложение** для учёта нерегулярных рабочих смен (изначально сделано под график водителя автобуса, но подходит для любой почасовой работы). Достаточно открыть `index.html` в браузере — и вы получаете полноценный табель и аналитическую панель: не нужен `npm install`, не нужен сервер, не нужна база данных. Все данные хранятся в браузере (`localStorage`), а по желанию — **зашифрованно синхронизируются с Google Диском**, чтобы график был доступен с любого устройства.

Приложение отвечает на три вопроса:

1. **Когда и сколько я работал?** → интерактивный календарь по месяцам
2. **Сколько я заработал?** → «табло» со счётчиками, которое пересчитывается автоматически по ставке
3. **Какие у меня закономерности?** → полноценная статистика с 10+ графиками

```
┌──────────────────────────────────────────────────────────┐
│                     🚌  Рабочий график                     │
├──────────────────────────────────────────────────────────┤
│  [Ставка: 700 дин/ч] [Сегодня] [🌙] [⋯ Данные] [☁️ Синх.]  │
├──────────────────────────────────────────────────────────┤
│   Табель            Статистика                            │
├──────────────────────────────────────────────────────────┤
│   ⏱ 172ч 30м     💰 120 750 дин.     📅 21 смена           │
├──────────────────────────────────────────────────────────┤
│   Пн  Вт  Ср  Чт  Пт  Сб  Вс                                │
│   ▢   ▢   ●   ●   ●   ▢   ▢     ● = смена   ▢ = выходной   │
│   ●   ●   ▢   ●   ●   ●   ▢                                 │
│   ...                                                       │
└──────────────────────────────────────────────────────────┘
```

---

## 🧩 Возможности

| Категория | Что делает |
|---|---|
| 📅 **Интерактивный календарь** | Клик по дню — отметить рабочий/выходной, задать время начала и конца смены, привязать автобус/маршрут, оставить заметку. Свайп‑навигация между месяцами на мобильных. |
| ⏱ **Автоматический пересчёт** | Часы, минуты и заработок пересчитываются мгновенно по формуле «ставка × время» — включая смены, переходящие через полночь. |
| 🟡 **Живые статусы смены** | Отдельные визуальные состояния для смен *в будущем*, *ещё не начавшихся* и *идущих сейчас* (доход по ним ещё не окончателен), обновляются фоновым «наблюдателем». |
| 🔥 **Тепловая карта заработка** | В один клик перекрашивает весь календарь по тому, сколько заработано в каждый день. |
| 📊 **Статистика** | Лучший день/месяц, средняя длительность смены, эффективная почасовая ставка, соотношение будни/выходные, топ‑5 самых прибыльных смен, распределение по длительности смен, недельная динамика, самые частые времена начала смены, разбивка по автобусам и маршрутам. |
| 📈 **10+ живых графиков** | На Chart.js с плагином подписей данных: столбчатые, линейные и кольцевые диаграммы по часам, заработку, накопительному доходу, дням недели и т.д. |
| 🖼 **Фото к дню** | К любому дню можно прикрепить фото физического графика смен (автоматически сжимается прямо в браузере), с полноэкранным просмотром. |
| 🖨 **Печатный табель** | Одна кнопка формирует аккуратную печатную таблицу формата A4 — готово для сдачи в бухгалтерию. |
| 💾 **Импорт / экспорт** | Полный бэкап и восстановление в JSON, экспорт в CSV для таблиц, а также автоматический локальный бэкап перед рискованными действиями. |
| ☁️ **Синхронизация со сквозным шифрованием** | Необязательная синхронизация с Google Диском — данные шифруются паролем *до* отправки (Web Crypto API), поэтому прочитать их не может даже Google. |
| 🌗 **Темы и доступность** | Переключение светлой/тёмной темы, поддержка `prefers-reduced-motion`, полная клавиатурная навигация, ARIA‑атрибуты по всему интерфейсу. |
| 📱 **Адаптивная вёрстка** | Два отдельных брейкпоинта (`08-responsive-early.css`, `15-responsive-late.css`) — от телефонов до десктопа. |

---

## 🏗 Архитектура

Никаких фреймворков, сборщиков и `package.json` — только **чисто декомпозированный vanilla JS**, подключённый обычными тегами `<script>` в нужном порядке, и CSS, разложенный на пронумерованные «слои», из которых складывается дизайн‑система.

```
work_schedule/
├── index.html                  ← единственная точка входа, подключает все модули
├── css/
│   ├── 00-tokens-and-reset.css     ← дизайн‑токены (цвета, отступы, шрифты)
│   ├── 01-header.css … 17-print-a4.css
│   └── ...                         ← 17 слоёв стилей, каскад по номерам
└── js/
    ├── init/            → загрузка приложения, инициализация состояния, первый рендер
    ├── data/             → загрузка/сохранение/валидация JSON и CSV, локальные бэкапы
    ├── shift/            → расчёт времени: минуты, смены через полночь, пересчёт
    ├── calendar/          → отрисовка сетки месяца, свайп‑навигация
    ├── day-modal/          → диалог редактирования дня + подсказки недавних времён
    ├── stats/               → все статистические агрегации
    ├── charts/               → построение графиков Chart.js и их общий стиль
    ├── heatmap/               → раскраска тепловой карты заработка
    ├── photo/                  → сжатие изображений, превью, лайтбокс
    ├── cloud/                   → OAuth Google Диска, AES‑шифрование, push/pull синхронизация
    ├── print/                     → генератор печатного табеля A4
    ├── modals/                     → общие модалки подтверждения/ввода
    ├── ui/                          → темы, тосты, вкладки, анимация LED‑счётчиков
    ├── config/                      → таблицы названий месяцев/дней недели (RU)
    └── utils/                        → разбор дат, форматирование чисел и валюты
```

**Философия:** каждый файл делает одну вещь — `compute-minutes.js` только считает минуты, `save-day-handler.js` только сохраняет день. Благодаря этому код легко проверить, легко передать другому разработчику и легко расширять без какой‑либо сборки.

### Поток данных

```
Пользователь редактирует день  →  save-day-handler.js
                          │
                          ▼
                 recompute-day.js  (минуты, заработок)
                          │
                          ▼
                 recompute-month.js → recompute-all.js
                          │
             ┌────────────┼─────────────┐
             ▼            ▼              ▼
     render-calendar   build-stats   persist.js
     (табло, сетка)    (дашборд)     (localStorage
                                      + опциональная
                                      зашифрованная
                                      отправка
                                      на Google Диск)
```

---

## 🔐 Как устроена облачная синхронизация

Синхронизация **полностью опциональна** и построена по принципу «нулевого доверия»:

1. Вы входите через Google (OAuth, доступ только к вашему собственному Диску).
2. Придумываете пароль — он никогда не покидает устройство.
3. Из пароля выводится ключ (`derive-key.js`), которым график **шифруется по AES** (`encrypt-for-cloud.js`) перед загрузкой.
4. На Google Диске хранится только непрозрачный зашифрованный блок; расшифровка происходит локально (`decrypt-from-cloud.js`) после скачивания.

Если пароль забыт — зашифрованную резервную копию не сможет прочитать никто, включая само приложение.

---

## 🚀 Быстрый старт

Установка не требуется.

```bash
# Скачайте или склонируйте репозиторий и просто откройте файл:
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

Либо запустите локальный сервер (нужен только для корректной работы OAuth Google Диска):

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

**Готово.** Укажите ставку в шапке, кликните по дню, внесите смену — календарь, табло и статистика обновятся мгновенно.

---

## 📦 Данные и приватность

- Данные хранятся **локально в первую очередь**, в `localStorage` — приложение полностью работает офлайн.
- Ничего никуда не отправляется, пока вы явно не включите облачную синхронизацию.
- В любой момент можно экспортировать/импортировать весь график в JSON (`💾 Сохранить JSON` / `📂 Загрузить JSON`) или выгрузить CSV для Excel/Google Таблиц.
- Кнопка **«🛡️ Быстрый бэкап»** создаёт локальную копию с меткой времени перед любым рискованным действием.

---

## 🛠 Технологии

| Слой | Выбор | Почему |
|---|---|---|
| Интерфейс | Vanilla HTML/CSS/JS | Без сборки, открывается из одного файла, легко разместить где угодно |
| Графики | [Chart.js](https://www.chartjs.org/) + плагин подписей данных | Лёгкий вес, без привязки к фреймворку |
| Хранение | `localStorage` + Web Crypto API | Работает офлайн, приватность по умолчанию |
| Синхронизация | Google Drive API (OAuth) | Бесплатно, повсеместно, не нужен собственный сервер |

---

## 🗺 Идеи на будущее

- [ ] Поддержка нескольких профилей/пользователей
- [ ] PWA‑установка и service worker для полного офлайн‑кэширования
- [ ] Настраиваемая валюта и локаль (сейчас — под RSD и русский интерфейс)
- [ ] Импорт из CSV (сейчас только экспорт)

---

<div align="center">

Сделано как вручную декомпозированное одностраничное приложение без единой зависимости — доказательство того, что для качественного продукта фреймворк не обязателен.

</div>