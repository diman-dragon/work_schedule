/* ---------- application bootstrap state ---------- */
try{
  const savedRaw = localStorage.getItem(STORAGE_KEY);
  if(savedRaw){
    const saved = JSON.parse(savedRaw);
    if(saved && typeof saved === 'object'){
      APP = Object.assign(APP, saved);
      if(!APP.schemaVersion) APP.schemaVersion = 1;
    }
  }
}catch(err){
  console.error('Не удалось прочитать сохранённые данные', err);
}
DATA = APP.months || {};
order = sanitizeOrder(APP.order, APP.months);
rate = APP.rate;
currentKey = APP.currentKey;
hiddenShiftTimes = new Set(Array.isArray(APP.hiddenShiftTimes) ? APP.hiddenShiftTimes : []);
cloudPassword = localStorage.getItem(CLOUD_PASS_SESSION_KEY) || null;

if(window.Chart && window.ChartDataLabels){ Chart.register(ChartDataLabels); }

// пары "начало–конец", которые пользователь скрыл из подсказок (напр. случайно
// введённое время или опечатка) — сама история смен при этом не трогается
// Сохраняет текущее состояние (график, ставку, тему) в localStorage —
// вызывается после каждого изменения данных.

// Всегда возвращает однозначный формат "N часов M минут" — никаких "82:11", которые легко принять за время
// точный момент окончания смены (учитывает переход через полночь)
// смена ещё не завершилась к текущему моменту — доход по ней пока не засчитывается

// плавный "прокрут" числовых LED-значений при обновлении

// recompute derived fields (minutes/hours/sum) for a single day based on start/end + rate.
// IMPORTANT: only days the user has actually edited (d.edited === true) get recalculated
// against the live rate. Original data loaded from the file keeps its numbers exactly as
// they were originally calculated, regardless of rate changes.
recomputeAll();

// ---------- СОРТИРОВКА ПОРЯДКА МЕСЯЦЕВ ПО ДАТЕ ----------
sortOrderChronologically();

// ---------- ФОКУС НА ТЕКУЩЕМ МЕСЯЦЕ/ДНЕ ----------
// гарантирует, что месяц с сегодняшней датой есть в графике; создаёт пустой, если нет

// ---------- ВКЛАДКИ ----------
const tabBtnTable = document.getElementById('tabBtnTable');
const tabBtnStats = document.getElementById('tabBtnStats');
const tabTable = document.getElementById('tabTable');
const tabStats = document.getElementById('tabStats');
tabBtnTable.addEventListener('click', () => switchTab('table'));
tabBtnStats.addEventListener('click', () => switchTab('stats'));

// ---------- HEADER SUB ----------

// ---------- ТЕПЛОВАЯ КАРТА КАЛЕНДАРЯ (по аналогии с GitHub) ----------
// чем выше заработок за смену относительно самой прибыльной смены за весь период,
// тем насыщеннее заливка дня акцентным цветом
let heatmapMode = false;
const heatmapToggleBtn = document.getElementById('heatmapToggleBtn');
heatmapToggleBtn.addEventListener('click', () => {
  heatmapMode = !heatmapMode;
  heatmapToggleBtn.classList.toggle('active', heatmapMode);
  heatmapToggleBtn.setAttribute('aria-pressed', String(heatmapMode));
  applyHeatmap();
});
// тёплый градиент: янтарный (мало) → оранжевый (средне) → глубокий красный (много) —
// вся шкала в тёплых тонах, без холодных цветов на нижнем конце

// ---------- ТЕМА ----------
applyTheme(APP.theme === 'dark' ? 'dark' : 'light');
document.getElementById('themeToggle').addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur === 'dark' ? 'light' : 'dark');
  persist();
});

// ---------- СТАВКА ----------
document.getElementById('rateInput').addEventListener('input', (e) => {
  const v = parseFloat(e.target.value);
  if(!isNaN(v) && v >= 0){
    rate = v;
    recomputeAll();
    renderMonthsStrip();
    render(currentKey);
    persist();
  }
});

// ---------- ЛЕНТА МЕСЯЦЕВ (прошедшие — под спойлером, текущий/будущие — сразу) ----------


// ---------- КАЛЕНДАРЬ ----------

// ---------- МОДАЛКА ДНЯ ----------
const overlay = document.getElementById('modalOverlay');
const workSwitch = document.getElementById('workSwitch');
const timeFields = document.getElementById('timeFields');
const startInput = document.getElementById('startInput');
const endInput = document.getElementById('endInput');
const busInput = document.getElementById('busInput');
const routeInput = document.getElementById('routeInput');
const calcPreview = document.getElementById('calcPreview');


// ---------- ЧАСТО ИСПОЛЬЗУЕМЫЕ СМЕНЫ (подстановка исторических данных) ----------
// считаем, какие пары начало-конец смены встречаются в истории,
// чтобы при вводе новой смены можно было в один клик подставить привычное время.
// Важно: смена появляется в списке сразу после первого же сохранения (без порога
// в 2+ повторения) — иначе только что введённая смена не попадала в подсказки.
workSwitch.addEventListener('click', () => {
  const on = !workSwitch.classList.contains('on');
  workSwitch.classList.toggle('on', on);
  timeFields.style.display = on ? 'block' : 'none';
  updatePreview();
});
workSwitch.addEventListener('keydown', (e) => {
  if(e.key === ' '){ e.preventDefault(); workSwitch.click(); }
});
startInput.addEventListener('input', updatePreview);
endInput.addEventListener('input', updatePreview);
document.getElementById('cancelBtn').addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if(e.target === overlay) closeModal(); });

document.getElementById('saveBtn').addEventListener('click', (ev) => {
  if(!editingDay) return;
  const {key, idx} = editingDay;
  const d = DATA[key].days[idx];
  const isWorking = workSwitch.classList.contains('on');
  if(isWorking && startInput.value === endInput.value){
    showToast('Начало и конец смены совпадают — исправьте время');
    return;
  }
  d.edited = true;
  if(isWorking){
    d.start = startInput.value;
    d.end = endInput.value;
    d.bus = busInput.value.trim() || null;
    d.route = routeInput.value.trim() || null;
  } else {
    d.start = null;
    d.end = null;
    d.bus = null;
    d.route = null;
  }
  recomputeMonth(key);
  closeModal();
  render(key);
  persist();
  if(typeof isCloudSyncActive === 'function' && isCloudSyncActive()) pushAfterDaySave();
  if(isWorking && window.confetti){
    confetti({ particleCount: 45, spread: 55, startVelocity: 28, gravity: 1.1,
      origin: { x: 0.5, y: 0.35 }, colors: [cssVar('--accent'), cssVar('--teal')], scalar: 0.8, ticks: 140 });
  }
});

// ---------- ДОБАВЛЕНИЕ МЕСЯЦА ----------
const addMonthOverlay = document.getElementById('addMonthOverlay');
const addMonthInput = document.getElementById('addMonthInput');
document.getElementById('addMonthBtn').addEventListener('click', () => {
  // подставляем месяц, следующий за последним в текущем графике
  let y, mo;
  if(order.length){
    const last = DATA[order[order.length-1]];
    y = last.year; mo = last.month + 1;
    if(mo > 12){ mo = 1; y += 1; }
  } else {
    const now = new Date();
    y = now.getFullYear(); mo = now.getMonth()+1;
  }
  addMonthInput.value = `${y}-${String(mo).padStart(2,'0')}`;
  addMonthOverlay.classList.add('show');
  setTimeout(() => addMonthInput.focus(), 50);
});
document.getElementById('addMonthCancelBtn').addEventListener('click', () => addMonthOverlay.classList.remove('show'));
addMonthOverlay.addEventListener('click', (e) => { if(e.target === addMonthOverlay) addMonthOverlay.classList.remove('show'); });

// ---------- ОБЩАЯ МОДАЛКА ПОДТВЕРЖДЕНИЯ (замена системного confirm()) ----------
const confirmOverlay = document.getElementById('confirmOverlay');
const confirmTitleEl = document.getElementById('confirmTitle');
const confirmMessageEl = document.getElementById('confirmMessage');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const confirmOkBtn = document.getElementById('confirmOkBtn');
let confirmResolve = null;
// возвращает Promise<boolean>: true если пользователь подтвердил, false — отменил
confirmCancelBtn.addEventListener('click', () => closeConfirmModal(false));
confirmOkBtn.addEventListener('click', () => closeConfirmModal(true));
confirmOverlay.addEventListener('click', (e) => { if(e.target === confirmOverlay) closeConfirmModal(false); });

// ---------- МОДАЛКА ВВОДА ПАРОЛЯ ШИФРОВАНИЯ (для облачной синхронизации) ----------
const syncPassOverlay = document.getElementById('syncPassOverlay');
const syncPassInput = document.getElementById('syncPassInput');
const syncPassCancelBtn = document.getElementById('syncPassCancelBtn');
const syncPassOkBtn = document.getElementById('syncPassOkBtn');
let syncPassResolve = null;
// возвращает Promise<string|null>: введённый пароль, либо null при отмене
syncPassCancelBtn.addEventListener('click', () => closeSyncPassModal(null));
syncPassOkBtn.addEventListener('click', () => closeSyncPassModal(syncPassInput.value || null));
syncPassOverlay.addEventListener('click', (e) => { if(e.target === syncPassOverlay) closeSyncPassModal(null); });

// ---------- КЛАВИАТУРА ДЛЯ ВСЕХ МОДАЛОК: Enter подтверждает, Escape отменяет ----------
// каждая .modal-overlay помечена data-cancel-btn / data-confirm-btn — id соответствующих кнопок
document.addEventListener('keydown', (e) => {
  const openOverlay = document.querySelector('.modal-overlay.show');
  if(!openOverlay) return;
  if(e.key === 'Escape'){
    e.preventDefault();
    const cancelBtn = document.getElementById(openOverlay.dataset.cancelBtn);
    if(cancelBtn) cancelBtn.click();
  } else if(e.key === 'Enter'){
    // не перехватываем Enter, если его уже обработал сам элемент (кнопка, time-chip, месяц-кнопка)
    if(e.target.tagName === 'BUTTON' || (e.target.classList && e.target.classList.contains('time-chip'))) return;
    e.preventDefault();
    const confirmBtn = document.getElementById(openOverlay.dataset.confirmBtn);
    if(confirmBtn) confirmBtn.click();
  }
});



document.getElementById('addMonthConfirmBtn').addEventListener('click', () => {
  const val = addMonthInput.value; // "YYYY-MM"
  if(!val){ addMonthOverlay.classList.remove('show'); return; }
  const [yStr, mStr] = val.split('-');
  const year = parseInt(yStr,10), monthIdx = parseInt(mStr,10);
  // уже есть такой месяц/год?
  const exists = order.some(k => DATA[k].year === year && DATA[k].month === monthIdx);
  if(exists){ showToast('Такой месяц уже есть в графике'); addMonthOverlay.classList.remove('show'); return; }
  const label = monthNamesNom[monthIdx-1];
  const key = makeMonthKey(year, monthIdx, label);
  DATA[key] = buildEmptyMonth(year, monthIdx);
  order.push(key);
  sortOrderChronologically();
  recomputeMonth(key);
  addMonthOverlay.classList.remove('show');
  render(key);
  persist();
  showToast(`Добавлен месяц: ${label} ${year}`);
});

// ---------- ТОСТ ----------

// ---------- СОХРАНЕНИЕ В JSON ----------
// Если браузер поддерживает File System Access API (Chrome/Edge) — показываем
// настоящий системный диалог "Сохранить как", где можно выбрать папку и имя файла.
// Иначе — откатываемся на обычную загрузку файла в папку "Загрузки".
document.getElementById('saveFileBtn').addEventListener('click', saveJsonFile);

// ---------- ЗАГРУЗКА ИЗ JSON ----------
// Если браузер поддерживает File System Access API — показываем настоящий системный
// диалог "Открыть файл". Иначе — откатываемся на скрытый <input type="file">
// (он тоже открывает системный диалог выбора файла, просто более простым способом).
const loadFileInput = document.getElementById('loadFileInput');
document.getElementById('loadFileBtn').addEventListener('click', loadJsonFile);
loadFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try{ applyLoadedJson(ev.target.result, file.name); }
    catch(err){ showToast('Ошибка чтения файла: ' + err.message); }
  };
  reader.onerror = () => showToast('Не удалось прочитать файл');
  reader.readAsText(file, 'utf-8');
  loadFileInput.value = '';
});

// ---------- ЭКСПОРТ В CSV ----------
document.getElementById('exportCsvBtn').addEventListener('click', async () => {
  if(!order.length){ showToast('Нет данных для экспорта'); return; }
  const rows = [['Месяц','Год','Дата','День недели','Начало','Конец','Длительность (ч:мм)','Сумма, дин.','Автобус','Маршрут']];
  order.forEach(key => {
    const m = DATA[key];
    m.days.forEach(d => {
      rows.push([
        m.label, m.year, d.date, d.weekday,
        d.start || '', d.end || '',
        d.start ? minutesToHM(d.minutes) : '',
        d.start ? String(d.sum) : '',
        d.bus || '', d.route || ''
      ]);
    });
  });
  const csv = rows.map(r => r.map(v => {
    const s = String(v ?? '');
    return /[;"\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
  }).join(';')).join('\r\n');
  const csvText = '\uFEFF' + csv;
  if(window.showSaveFilePicker){
    try{
      const handle = await window.showSaveFilePicker({
        suggestedName: 'график_данные.csv',
        types: [{ description: 'CSV файл', accept: {'text/csv': ['.csv']} }]
      });
      const writable = await handle.createWritable();
      await writable.write(csvText);
      await writable.close();
      showToast('CSV-файл сохранён (можно открыть в Excel)');
      return;
    } catch(err){
      if(err.name === 'AbortError') return;
      console.error('Не удалось сохранить через системный диалог', err);
    }
  }
  const blob = new Blob([csvText], {type:'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'график_данные.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  showToast('CSV-файл сохранён (можно открыть в Excel)');
});

// ---------- ПОЛНАЯ ОЧИСТКА ДАННЫХ ----------
document.getElementById('clearDataBtn').addEventListener('click', async () => {
  if(!order.length){ showToast('Данные уже пусты'); return; }
  const ok = await showConfirmModal(
    'Это действие необратимо. Если нужен бэкап — сначала нажмите «Сохранить» (JSON) или «CSV».',
    'Удалить все данные графика?',
    'Удалить'
  );
  if(!ok) return;
  createLocalBackup('перед полной очисткой');
  DATA = {}; order = []; currentKey = null;
  try{ localStorage.removeItem(STORAGE_KEY); }catch(err){}
  persist();
  currentKey = ensureCurrentMonthExists();
  render(currentKey);
  if(tabStats.classList.contains('active')) buildStats();
  showToast('Все данные удалены');
});

// ---------- СТАТИСТИКА ----------


// ---------- СРАВНЕНИЕ МЕСЯЦЕВ (месяц к месяцу) ----------
// для каждого месяца, у которого есть предыдущий месяц в графике, считаем разницу
// по заработку и часам — так сразу видно, какой месяц был лучше/хуже и насколько



// ========================================================================
// ОБЛАЧНАЯ СИНХРОНИЗАЦИЯ ЧЕРЕЗ GOOGLE ДИСК (шифрование на стороне браузера)
// ========================================================================
// Данные хранятся в одном приватном файле на Google Диске, доступном только
// этому приложению (scope drive.file — Google не даёт видеть остальные файлы
// пользователя). Перед отправкой в облако содержимое шифруется AES-256-GCM
// с ключом, полученным из пароля пользователя (PBKDF2). Пароль хранится в
// localStorage этого устройства/браузера (в открытом виде) — так синхронизация
// остаётся включённой между перезапусками браузера и не спрашивает пароль
// заново, пока сами не нажмёте «Отключить синхронизацию».
const cloudSyncBtn = document.getElementById('cloudSyncBtn');
const cloudSyncStatus = document.getElementById('cloudSyncStatus');


// ---- шифрование ----

// ---- Google OAuth (Google Identity Services) ----

// ---- Google Drive REST (scope drive.file — видит только файлы этого приложения) ----

// ---- логика синхронизации ----
// Синхронизация НЕ идёт постоянным фоном. Она запускается только:
//  1) при открытии приложения — один раз подтягиваем свежие данные (pullFromCloud в tryResumeCloudSync)
//  2) по нажатию кнопки «☁️ Синхронизация» — полный цикл: сначала забрать, потом отправить
//  3) при сохранении конкретного дня в карточке — лёгкий пуш только что изменённых данных

const cloudDisconnectBtn = document.getElementById('cloudDisconnectBtn');
cloudSyncBtn.addEventListener('click', async () => {
  if(isCloudSyncActive()) runFullSync();
  else connectCloudSync();
});
cloudDisconnectBtn.addEventListener('click', async () => {
  const ok = await showConfirmModal('Отключить синхронизацию с Google Диском на этом устройстве? Данные в облаке останутся нетронутыми, локальные — тоже.', 'Отключить синхронизацию', 'Отключить');
  if(ok) disconnectCloudSync();
});
// при старте, если синхронизация уже включена на этом устройстве — один раз тихо
// подтягиваем свежие данные (без окна входа, если сессия Google ещё жива)
;

resumeCloudSyncOnStartup();

// init
currentKey = ensureCurrentMonthExists();
APP.currentKey = currentKey;
document.getElementById('rateInput').value = rate;
render(currentKey);
document.getElementById('monthNavLabel') && (document.getElementById('monthNavLabel').textContent = `${DATA[currentKey].label} ${DATA[currentKey].year}`);
persist();

// раз в минуту проверяем — не закончилась ли ещё идущая смена; если да, пересчитываем
// итоги, чтобы доход появился в статистике сам, без перезагрузки страницы
setInterval(() => {
  const m = DATA[currentKey];
  if(!m) return;
  const hadPending = m.days.some(d => d.pending);
  if(hadPending){
    recomputeMonth(currentKey);
    render(currentKey);
    persist();
  }
}, 60000);


/* =========================
   UX ENHANCEMENTS
   ========================= */
;

/* ---------- enhancement initialization ---------- */
initEnhancements();
