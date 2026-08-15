/* photo/day-photo-elements.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- ФОТО ГРАФИКА СМЕН, ПРИКРЕПЛЁННОЕ К ДНЮ ----------
// Фото графика (расписание по всем машинам/водителям на 5 рабочих дней и
// выходные, которое иногда меняют) хранится как base64-картинка прямо в
// объекте дня (d.photo), поэтому автоматически попадает во все существующие
// механизмы сохранения — localStorage, локальный бэкап, экспорт/импорт JSON,
// облачную синхронизацию — без каких-либо дополнительных изменений там.
// Перед сохранением фото пережимаем на canvas (макс. сторона ~1600px, JPEG
// ~0.78 качества), иначе несколько фото в высоком разрешении быстро упрутся
// в лимит localStorage (обычно 5–10 МБ на домен).
const dayPhotoInput = $('dayPhotoInput');
const dayPhotoAddBtn = $('dayPhotoAddBtn');
const dayPhotoRemoveBtn = $('dayPhotoRemoveBtn');
const dayPhotoPreview = $('dayPhotoPreview');
const dayPhotoHint = $('dayPhotoHint');
let pendingDayPhoto = null; // dataURL строкой, null — если фото не прикреплено; undefined никогда не используется
