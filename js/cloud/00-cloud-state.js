/* cloud/00-cloud-state.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
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
const CLOUD_CLIENT_ID = '524857013705-lcro9dq97ctlfdq0rmubkgcvhao0724n.apps.googleusercontent.com';
const CLOUD_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const CLOUD_FILE_NAME = 'rabochiy-grafik-sync.json.enc';
const CLOUD_ENABLED_KEY = 'cloudSyncEnabled_v1';
const CLOUD_PASS_SESSION_KEY = 'cloudSyncPass_v1';
// токен доступа Google живёт максимум ~1 час и по правилам OAuth не может
// храниться постоянно (это не пароль, а одноразовый пропуск с истечением) —
// но мы кэшируем его в sessionStorage, чтобы обновление страницы или
// случайное закрытие/переоткрытие вкладки в рамках одной сессии браузера
// не требовало заново идти в Google. После полного закрытия браузера или
// истечения часа Google всё равно потребует авторизацию — так работает
// эта версия Google OAuth без выделенного сервера-бэкенда.
const CLOUD_TOKEN_CACHE_KEY = 'cloudAccessToken_v1';
const CLOUD_CONSENT_GIVEN_KEY = 'cloudConsentGiven_v1';

let cloudAccessToken = null;
let cloudTokenExpiresAt = 0;
try{
  const cachedTokenRaw = sessionStorage.getItem(CLOUD_TOKEN_CACHE_KEY);
  if(cachedTokenRaw){
    const cached = JSON.parse(cachedTokenRaw);
    if(cached && cached.token && cached.expiresAt > Date.now() + 60000){
      cloudAccessToken = cached.token;
      cloudTokenExpiresAt = cached.expiresAt;
    }
  }
}catch(err){ /* битый кэш токена — просто игнорируем, запросим новый */ }
let cloudTokenClient = null;
let cloudFileId = null;
let cloudPassword = localStorage.getItem(CLOUD_PASS_SESSION_KEY) || null;
let cloudBusy = false;

const cloudSyncBtn = $('cloudSyncBtn');
const cloudSyncStatus = $('cloudSyncStatus');
