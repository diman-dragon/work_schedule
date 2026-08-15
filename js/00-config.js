/* Global configuration/state declarations. No business functions live here. */
const STORAGE_KEY = 'workScheduleData_v1';
const DATA_SCHEMA_VERSION = 2;
const BACKUP_KEY = 'workScheduleBackup_v1';

const monthNamesGen = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
const monthNamesNom = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const WEEKDAYS_ORDER = ["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресенье"];
const WEEKDAYS_SHORT = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

const CLOUD_CLIENT_ID = '524857013705-lcro9dq97ctlfdq0rmubkgcvhao0724n.apps.googleusercontent.com';
const CLOUD_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const CLOUD_FILE_NAME = 'rabochiy-grafik-sync.json.enc';
const CLOUD_ENABLED_KEY = 'cloudSyncEnabled_v1';
const CLOUD_PASS_SESSION_KEY = 'cloudSyncPass_v1';

let APP = { rate: 700, currentKey: null, order: [], months: {}, theme: 'dark' };
let DATA = {};
let order = [];
let rate = 700;
let currentKey = null;
let editingDay = null;
let charts = {};
let hiddenShiftTimes = new Set();
const ledAnimState = {};
const ledAnimContexts = {};

let cloudAccessToken = null;
let cloudTokenClient = null;
let cloudFileId = null;
let cloudPassword = null;
let cloudPushTimer = null;
let cloudBusy = false;
