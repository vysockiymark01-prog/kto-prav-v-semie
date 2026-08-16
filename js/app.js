// ===== "Кто прав в семье?" / "Who's Right in the Family?" — логика приложения =====
// Все данные хранятся локально на устройстве (localStorage), без сервера.

const STORAGE_KEY = 'ktoprav_counters_v1';

// ---------- Локализация ----------
function ruPluralDaysWord(n) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня';
  return 'дней';
}

const I18N = {
  ru: {
    strings: {
      appTitle: 'Кто прав в семье?',
      metaDescription: 'Кто прав в семье? — шуточный трекер, кто чаще оказывается прав.',
      archive: 'Архив',
      statsSummary: 'Общая статистика',
      settings: 'Настройки',
      homeEmpty: 'Пока никого нет. Добавь первого «правого» — и понеслась.',
      addCounter: 'Добавить счётчик',
      back: 'Назад',
      moveToArchive: 'Переместить в архив',
      scoreLabel: 'раз оказал(ась) прав(а)',
      statToday: 'сегодня',
      statWeek: 'на этой неделе',
      statPrevWeek: 'на прошлой',
      tapAria: 'Засчитать правоту',
      tapHint: 'ТАП!',
      tapWithComment: 'Тап с комментарием',
      undoLast: '↩ отменить последний тап',
      openHistory: '📜 история и комментарии',
      chartDaily: 'Тапы по дням (7 дней)',
      chartWeekly: 'По неделям',
      historyEmpty: 'Тапов пока нет.',
      langTitle: '🌐 Язык',
      langSub: 'Авто — по языку телефона',
      langAuto: 'Авто',
      themeTitle: '🌗 Тема',
      themeSub: 'Авто — по теме телефона',
      themeAuto: 'Авто',
      themeLight: 'Светлая',
      themeDark: 'Тёмная',
      soundTitle: '🔊 Звук при тапе',
      soundSub: 'Короткий звук в момент тапа',
      vibroTitle: '📳 Вибрация при тапе',
      vibroSub: 'Короткий отклик на телефоне',
      backupTitle: 'Резервная копия',
      backupHint: 'Все данные хранятся только на этом устройстве. Сделай бэкап, чтобы не потерять историю при смене телефона.',
      exportBtn: '⬇️ Экспортировать данные (.json)',
      importBtn: '⬆️ Импортировать из файла',
      supportTitle: 'Поддержка и безопасность',
      supportHint: 'Нашли ошибку, недопустимый контент или проблему, связанную с безопасностью? Напишите нам напрямую.',
      contactEmailAria: 'Написать на почту vysockiy.mark98@mail.ru',
      contactVkAria: 'Написать ВКонтакте',
      archiveHint: 'Персонажи отсюда не удаляются насовсем автоматически — их можно вернуть или стереть окончательно.',
      archiveEmpty: 'В архиве пока пусто.',
      weekResults: 'Итоги недели',
      summaryEmpty: 'Добавь хотя бы одного персонажа, чтобы увидеть рейтинг правоты.',
      addModalTitle: 'Кто на этот раз?',
      customLabel: 'Или свой вариант:',
      customNamePlaceholder: 'Имя / прозвище',
      addBtn: 'Добавить',
      close: 'Закрыть',
      commentPlaceholder: 'Почему был(а) прав(а)? (необязательно)',
      savePatternLabel: 'Сохранить как паттерн для быстрого выбора',
      deleteTapBtn: 'Удалить тап',
      tapSubmitBtn: 'Тап!',
      saveSubmitBtn: 'Сохранить',
      commentModalTitleAdd: 'Тап с комментарием',
      commentModalTitleEdit: 'Комментарий к тапу',
      restoreTitle: 'Восстановить',
      deleteForeverTitle: 'Удалить насовсем',
      noComment: 'без комментария',
      weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      totalText: (n) => `всего: ${n}`,
      historyTitle: (name) => `История: ${name}`,
      enterNameToast: 'Введи имя персонажа',
      addedToast: (name) => `«${name}» добавлен(а)!`,
      archivedToast: (name) => `«${name}» отправлен(а) в архив`,
      restoredToast: (name) => `«${name}» восстановлен(а)`,
      deleteForeverConfirm: (name) => `Удалить «${name}» насовсем? Это нельзя отменить.`,
      deletedForeverToast: 'Удалено насовсем',
      undoneToast: 'Последний тап отменён',
      deleteTapConfirm: 'Удалить этот тап целиком? Счёт уменьшится на 1.',
      tapDeletedToast: 'Тап удалён',
      commentSavedToast: 'Комментарий сохранён',
      recordedToast: (pattern) => `Записано: «${pattern}»`,
      backupSavedToast: 'Файл с бэкапом сохранён',
      importConfirm: 'Импорт заменит все текущие данные в приложении данными из файла. Продолжить?',
      importParseError: 'Не удалось прочитать файл',
      importFormatError: 'Файл не похож на бэкап этого приложения',
      importedToast: 'Данные импортированы',
      confirmTitle: 'Подтвердите действие',
      confirmCancel: 'Отмена',
      confirmOk: 'Да',
      streakText: (n) => `🔥 ${n} ${ruPluralDaysWord(n)} подряд`,
      feedTitle: 'Лента событий',
      feedEmpty: 'Пока нет ни одного тапа.',
      compareTitle: 'Кто кого?',
      compare: 'Сравнение',
      comparePick1: 'Первый',
      comparePick2: 'Второй',
      compareBtn: 'Сравнить',
      compareNeedTwo: 'Выбери двух разных персонажей',
      compareVs: 'против',
      compareWinner: (name) => `👑 Пока побеждает: ${name}`,
      compareTie: '🤝 Пока ничья',
      streakLeadersTitle: 'Лидеры по сериям 🔥',
      streakLeadersEmpty: 'Пока ни у кого нет серии подряд идущих дней.',
      shareResults: '📤 Поделиться итогами',
      shareTitle: (n) => `Итоги недели — ${n}`,
      shareGenerating: 'Готовим картинку...',
      shareFallbackSaved: 'Картинка сохранена',
      photoPickBtn: '🖼️ Фото',
      photoRemoveBtn: '❌ Убрать фото',
      changePhotoAria: 'Изменить фото',
      micAria: 'Голосовой ввод',
      micListening: '🎙️ Слушаю...',
      micUnsupported: 'Голосовой ввод не поддерживается на этом устройстве',
    },
    predictions: [
      'Сегодня кто-то один точно окажется прав. Вопрос — кто первым нажмёт кнопку.',
      'Звёзды говорят: сегодня разговор о мелочи затянется минимум на 10 минут.',
      'Прогноз дня: количество "я же говорил(а)" превысит норму.',
      'Сегодня хороший день, чтобы признать чужую правоту. Но вряд ли кто-то признает.',
      'Внимание: вероятность спора о посуде сегодня повышена.',
      'Сегодня побеждает не тот, кто прав, а тот, кто громче.',
      'День пройдёт спокойно. Наверное. Скорее всего нет.',
      'Совет дня: соглашайтесь сразу — сэкономите 20 минут и нервы.',
      'Сегодня отличный день для нового рекорда правоты.',
      'Кто-то сегодня скажет "ладно, проехали" — и все поймут, что это неправда.',
      'Сегодня явно кто-то забыл, кто выносит мусор. Спойлер: не он(а).',
      'Прогноз: минимум один "ты сам(а) так сказал(а)" в течение дня.',
    ],
    presets: [
      { name: 'Тёща', emoji: '👵', color: '#FF5A7A' },
      { name: 'Тесть', emoji: '👴', color: '#1FC8C0' },
      { name: 'Свекровь', emoji: '👵', color: '#8B5CF6' },
      { name: 'Свёкор', emoji: '👴', color: '#FFC93C' },
      { name: 'Муж', emoji: '🤵', color: '#1FC8C0' },
      { name: 'Жена', emoji: '👰', color: '#FF5A7A' },
      { name: 'Кот', emoji: '🐱', color: '#FFC93C' },
      { name: 'Собака', emoji: '🐶', color: '#5AA9FF' },
      { name: 'Мама', emoji: '👩', color: '#FF9F5A' },
      { name: 'Папа', emoji: '👨', color: '#5AA9FF' },
      { name: 'Брат', emoji: '🧑', color: '#1FC8C0' },
      { name: 'Сестра', emoji: '👧', color: '#FF5A7A' },
      { name: 'Начальник', emoji: '🧑‍💼', color: '#8B5CF6' },
      { name: 'Я сам(а)', emoji: '🤓', color: '#FFC93C' },
    ],
    quips: [
      { min: 0, max: 0, text: 'Пока тишина. Затишье перед бурей?' },
      { min: 1, max: 3, text: 'Разминка началась.' },
      { min: 4, max: 9, text: 'Уже заметно. Может, просто соглашаться сразу?' },
      { min: 10, max: 19, text: 'Двузначные числа. Уважение.' },
      { min: 20, max: 49, text: 'Легенда семьи в процессе становления.' },
      { min: 50, max: 99, text: 'Официально: спорить бесполезно.' },
      { min: 100, max: Infinity, text: 'Занесено в семейную летопись навечно.' },
    ],
    weekLabels: [
      { min: 0, max: 0, text: 'Спокойная неделя. Подозрительно спокойная.' },
      { min: 1, max: 2, text: 'Лёгкая разминка недели.' },
      { min: 3, max: 5, text: 'Обычная семейная неделя.' },
      { min: 6, max: 9, text: 'Неделя явного превосходства.' },
      { min: 10, max: 14, text: 'Ораторская неделя. Аргументы не иссякают.' },
      { min: 15, max: Infinity, text: 'Рекорд недели! Пора вручать медаль.' },
    ],
    achievements: [
      { min: 0, text: 'Легенда только начинается' },
      { min: 5, text: '🏅 Достижение: «Уверенная позиция» (5)' },
      { min: 10, text: '🏅 Достижение: «Двузначный авторитет» (10)' },
      { min: 25, text: '🥈 Достижение: «Голос разума семьи» (25)' },
      { min: 50, text: '🥇 Достижение: «Непререкаемый авторитет» (50)' },
      { min: 100, text: '👑 Достижение: «Живая легенда» (100)' },
      { min: 250, text: '🐐 Достижение: «GOAT семьи» (250)' },
    ],
  },

  en: {
    strings: {
      appTitle: "Who's Right in the Family?",
      metaDescription: "Who's Right in the Family? — a joke tracker for who turns out to be right most often.",
      archive: 'Archive',
      statsSummary: 'Overall stats',
      settings: 'Settings',
      homeEmpty: 'No one here yet. Add the first "right one" and off we go.',
      addCounter: 'Add counter',
      back: 'Back',
      moveToArchive: 'Move to archive',
      scoreLabel: 'times proven right',
      statToday: 'today',
      statWeek: 'this week',
      statPrevWeek: 'last week',
      tapAria: 'Count as right',
      tapHint: 'TAP!',
      tapWithComment: 'Tap with a comment',
      undoLast: '↩ undo last tap',
      openHistory: '📜 history & comments',
      chartDaily: 'Taps by day (7 days)',
      chartWeekly: 'By week',
      historyEmpty: 'No taps yet.',
      langTitle: '🌐 Language',
      langSub: 'Auto — matches your phone language',
      langAuto: 'Auto',
      themeTitle: '🌗 Theme',
      themeSub: 'Auto — matches your phone theme',
      themeAuto: 'Auto',
      themeLight: 'Light',
      themeDark: 'Dark',
      soundTitle: '🔊 Sound on tap',
      soundSub: 'A short sound on every tap',
      vibroTitle: '📳 Vibration on tap',
      vibroSub: 'A short buzz on your phone',
      backupTitle: 'Backup',
      backupHint: 'All data is stored only on this device. Make a backup so you don’t lose your history when you switch phones.',
      exportBtn: '⬇️ Export data (.json)',
      importBtn: '⬆️ Import from file',
      supportTitle: 'Support & safety',
      supportHint: 'Found a bug, inappropriate content, or a safety concern? Contact us directly.',
      contactEmailAria: 'Email vysockiy.mark98@mail.ru',
      contactVkAria: 'Message on VK',
      archiveHint: "Characters here aren't deleted automatically — you can restore them or erase them for good.",
      archiveEmpty: 'The archive is empty.',
      weekResults: "Week's results",
      summaryEmpty: 'Add at least one character to see the rightness ranking.',
      addModalTitle: 'Who is it this time?',
      customLabel: 'Or your own:',
      customNamePlaceholder: 'Name / nickname',
      addBtn: 'Add',
      close: 'Close',
      commentPlaceholder: 'Why were they right? (optional)',
      savePatternLabel: 'Save as a quick-pick pattern',
      deleteTapBtn: 'Delete tap',
      tapSubmitBtn: 'Tap!',
      saveSubmitBtn: 'Save',
      commentModalTitleAdd: 'Tap with a comment',
      commentModalTitleEdit: 'Comment on tap',
      restoreTitle: 'Restore',
      deleteForeverTitle: 'Delete forever',
      noComment: 'no comment',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      totalText: (n) => `total: ${n}`,
      historyTitle: (name) => `History: ${name}`,
      enterNameToast: 'Enter a name for the character',
      addedToast: (name) => `"${name}" added!`,
      archivedToast: (name) => `"${name}" moved to archive`,
      restoredToast: (name) => `"${name}" restored`,
      deleteForeverConfirm: (name) => `Delete "${name}" for good? This can’t be undone.`,
      deletedForeverToast: 'Deleted for good',
      undoneToast: 'Last tap undone',
      deleteTapConfirm: 'Delete this tap entirely? The count will drop by 1.',
      tapDeletedToast: 'Tap deleted',
      commentSavedToast: 'Comment saved',
      recordedToast: (pattern) => `Logged: "${pattern}"`,
      backupSavedToast: 'Backup file saved',
      importConfirm: 'Importing will replace all current app data with the data from the file. Continue?',
      importParseError: "Couldn't read the file",
      importFormatError: "This file doesn't look like a backup from this app",
      importedToast: 'Data imported',
      confirmTitle: 'Confirm action',
      confirmCancel: 'Cancel',
      confirmOk: 'Yes',
      streakText: (n) => `🔥 ${n}-day streak`,
      feedTitle: 'Activity feed',
      feedEmpty: 'No taps yet.',
      compareTitle: 'Who beats whom?',
      compare: 'Compare',
      comparePick1: 'First',
      comparePick2: 'Second',
      compareBtn: 'Compare',
      compareNeedTwo: 'Pick two different characters',
      compareVs: 'vs',
      compareWinner: (name) => `👑 Currently winning: ${name}`,
      compareTie: "🤝 It's a tie",
      streakLeadersTitle: 'Streak leaders 🔥',
      streakLeadersEmpty: 'No one has a streak of consecutive days yet.',
      shareResults: '📤 Share results',
      shareTitle: (n) => `Week's results — ${n}`,
      shareGenerating: 'Generating image...',
      shareFallbackSaved: 'Image saved',
      photoPickBtn: '🖼️ Photo',
      photoRemoveBtn: '❌ Remove photo',
      changePhotoAria: 'Change photo',
      micAria: 'Voice input',
      micListening: '🎙️ Listening...',
      micUnsupported: 'Voice input is not supported on this device',
    },
    predictions: [
      "Today someone will definitely be right. The only question is who taps first.",
      "The stars say: an argument over something tiny will drag on for 10+ minutes today.",
      "Forecast: the number of \"I told you so\" moments will exceed the norm.",
      "Good day to admit someone else was right. Unlikely anyone actually will, though.",
      "Warning: elevated chance of a dishes-related dispute today.",
      "Today the winner isn't the one who's right — it's the one who's louder.",
      "The day will go smoothly. Probably. Actually, probably not.",
      "Tip of the day: just agree right away — save yourself 20 minutes and some nerves.",
      "Great day for a new rightness record.",
      "Someone will say \"fine, never mind\" today — and everyone will know it's a lie.",
      "Someone clearly forgot whose turn it is to take out the trash. Spoiler: not them.",
      "Forecast: at least one \"you said that yourself\" incoming today.",
    ],
    presets: [
      { name: "Mother-in-law (wife's mom)", emoji: '👵', color: '#FF5A7A' },
      { name: "Father-in-law (wife's dad)", emoji: '👴', color: '#1FC8C0' },
      { name: "Mother-in-law (husband's mom)", emoji: '👵', color: '#8B5CF6' },
      { name: "Father-in-law (husband's dad)", emoji: '👴', color: '#FFC93C' },
      { name: 'Husband', emoji: '🤵', color: '#1FC8C0' },
      { name: 'Wife', emoji: '👰', color: '#FF5A7A' },
      { name: 'Cat', emoji: '🐱', color: '#FFC93C' },
      { name: 'Dog', emoji: '🐶', color: '#5AA9FF' },
      { name: 'Mom', emoji: '👩', color: '#FF9F5A' },
      { name: 'Dad', emoji: '👨', color: '#5AA9FF' },
      { name: 'Brother', emoji: '🧑', color: '#1FC8C0' },
      { name: 'Sister', emoji: '👧', color: '#FF5A7A' },
      { name: 'Boss', emoji: '🧑‍💼', color: '#8B5CF6' },
      { name: 'Myself', emoji: '🤓', color: '#FFC93C' },
    ],
    quips: [
      { min: 0, max: 0, text: 'All quiet so far. Calm before the storm?' },
      { min: 1, max: 3, text: 'Warm-up has started.' },
      { min: 4, max: 9, text: 'Getting noticeable. Maybe just agree right away?' },
      { min: 10, max: 19, text: 'Double digits. Respect.' },
      { min: 20, max: 49, text: 'A family legend in the making.' },
      { min: 50, max: 99, text: 'Officially: arguing is pointless.' },
      { min: 100, max: Infinity, text: 'Forever etched into family history.' },
    ],
    weekLabels: [
      { min: 0, max: 0, text: 'A quiet week. Suspiciously quiet.' },
      { min: 1, max: 2, text: 'A light warm-up week.' },
      { min: 3, max: 5, text: 'A pretty average family week.' },
      { min: 6, max: 9, text: 'A week of clear dominance.' },
      { min: 10, max: 14, text: 'A week of nonstop arguments.' },
      { min: 15, max: Infinity, text: 'Record week! Time for a medal.' },
    ],
    achievements: [
      { min: 0, text: 'The legend is just beginning' },
      { min: 5, text: '🏅 Achievement: "Solid Case" (5)' },
      { min: 10, text: '🏅 Achievement: "Double-Digit Authority" (10)' },
      { min: 25, text: '🥈 Achievement: "Voice of Reason" (25)' },
      { min: 50, text: '🥇 Achievement: "Undisputed Authority" (50)' },
      { min: 100, text: '👑 Achievement: "Living Legend" (100)' },
      { min: 250, text: '🐐 Achievement: "Family GOAT" (250)' },
    ],
  },
};

function detectDeviceLang() {
  const nav = ((navigator.language || navigator.userLanguage || 'en') + '').toLowerCase();
  return nav.startsWith('ru') ? 'ru' : 'en';
}

function currentLang() {
  const pref = (state.settings && state.settings.lang) || 'auto';
  if (pref === 'ru' || pref === 'en') return pref;
  return detectDeviceLang();
}

function t(key, ...args) {
  const dict = I18N[currentLang()].strings;
  const val = dict[key];
  if (typeof val === 'function') return val(...args);
  return val !== undefined ? val : key;
}

function getPresets() { return I18N[currentLang()].presets; }
function getQuips() { return I18N[currentLang()].quips; }
function getWeekLabels() { return I18N[currentLang()].weekLabels; }
function getAchievements() { return I18N[currentLang()].achievements; }
function getPredictions() { return I18N[currentLang()].predictions; }

// Одна и та же "фраза дня" для всех, кто откроет приложение в один день —
// индекс выбирается детерминированно по дате, без Math.random().
function getDailyPrediction() {
  const list = getPredictions();
  const key = dayKey(Date.now());
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return list[hash % list.length];
}

const EMOJI_CHOICES = ['😀', '😎', '🥲', '🤨', '🧐', '😤', '🙄', '😇', '🤷', '🤷‍♀️', '🤷‍♂️', '👻', '🐱', '🐶', '🦄', '🔥', '👑', '💅', '🫡', '🧙', '🧑‍🍳', '🐍', '🦉', '🐢'];
const COLOR_CHOICES = ['#FF5A7A', '#1FC8C0', '#FFC93C', '#8B5CF6', '#5AA9FF', '#FF9F5A'];

let state = { counters: [], settings: { sound: true, vibro: true, lang: 'auto', theme: 'auto' } };
let currentId = null;
let pendingEmoji = '😀';
let pendingColor = COLOR_CHOICES[0];
let pendingPhoto = null; // dataURL строки, если выбрано фото вместо эмодзи

// Персонаж для смены фото в карточке (id того, чью фотографию сейчас меняем)
let photoEditTargetId = null;

// Выбранные персонажи для режима сравнения "Кто кого?"
let compareIds = [null, null];

// Состояние модалки комментария
let commentModalMode = 'add'; // 'add' | 'edit'
let commentModalTapId = null;

// ---------- Хранилище ----------
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = JSON.parse(raw);
  } catch (e) { console.warn('Не удалось прочитать данные', e); }
  if (!state.counters) state.counters = [];
  if (!state.settings) state.settings = { sound: true, vibro: true, lang: 'auto', theme: 'auto' };
  if (typeof state.settings.sound !== 'boolean') state.settings.sound = true;
  if (typeof state.settings.vibro !== 'boolean') state.settings.vibro = true;
  if (!['auto', 'ru', 'en'].includes(state.settings.lang)) state.settings.lang = 'auto';
  if (!['auto', 'light', 'dark'].includes(state.settings.theme)) state.settings.theme = 'auto';

  // Миграция старого формата тапов (числа) в новый (объекты с id/ts/note)
  state.counters.forEach(c => {
    if (!Array.isArray(c.patterns)) c.patterns = [];
    c.taps = (c.taps || []).map(t => {
      if (typeof t === 'number') return { id: uid(), ts: t, note: '' };
      if (t && typeof t === 'object') return { id: t.id || uid(), ts: t.ts, note: t.note || '' };
      return null;
    }).filter(Boolean);
  });
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid() {
  return 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

// ---------- Утилиты дат ----------
function dayKey(ts) {
  const d = new Date(ts);
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Пн = 0
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

function tapsInRange(counter, from, to) {
  return counter.taps.filter(tap => tap.ts >= from.getTime() && tap.ts < to.getTime()).length;
}

// ---------- Стрики (серии подряд идущих дней) ----------
function computeStreak(counter) {
  const daySet = new Set(counter.taps.map(tap => dayKey(tap.ts)));
  if (daySet.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!daySet.has(dayKey(cursor.getTime()))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (daySet.has(dayKey(cursor.getTime()))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function tapsToday(counter) {
  const now = new Date();
  const start = new Date(now); start.setHours(0, 0, 0, 0);
  const end = new Date(start); end.setDate(end.getDate() + 1);
  return tapsInRange(counter, start, end);
}

function tapsThisWeek(counter) {
  const now = new Date();
  const start = startOfWeek(now);
  const end = new Date(start); end.setDate(end.getDate() + 7);
  return tapsInRange(counter, start, end);
}

function tapsPrevWeek(counter) {
  const now = new Date();
  const start = startOfWeek(now);
  start.setDate(start.getDate() - 7);
  const end = new Date(start); end.setDate(end.getDate() + 7);
  return tapsInRange(counter, start, end);
}

function findQuip(total) {
  const quips = getQuips();
  return (quips.find(q => total >= q.min && total <= q.max) || quips[0]).text;
}

function findWeekLabel(count) {
  const labels = getWeekLabels();
  return (labels.find(q => count >= q.min && count <= q.max) || labels[0]).text;
}

function findAchievement(total) {
  const achievements = getAchievements();
  let best = achievements[0];
  for (const a of achievements) if (total >= a.min) best = a;
  return best.text;
}

// ---------- Навигация ----------
// Каждый переход вглубь (детали, история, настройки, архив, статистика) кладёт запись в
// историю браузера. Аппаратная кнопка/жест "назад" на Android тем самым сначала возвращает
// пользователя на предыдущий экран приложения и только потом (когда стек исчерпан) закрывает
// само приложение — вместо того чтобы выходить сразу с любого экрана.
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function renderView(id) {
  switch (id) {
    case 'view-home': renderHome(); break;
    case 'view-detail': renderDetail(); break;
    case 'view-history': renderHistory(); break;
    case 'view-settings': renderSettings(); break;
    case 'view-archive': renderArchive(); break;
    case 'view-summary': renderSummary(); break;
    case 'view-feed': renderFeed(); break;
    case 'view-compare': renderCompare(); break;
  }
}

function navigateTo(id) {
  history.pushState({ view: id }, '', location.href);
  renderView(id);
  showView(id);
}

function goHome() {
  // Если мы куда-то заходили из главного экрана, "домой" — это просто шаг назад по истории:
  // тогда сработает единый popstate-обработчик и стек истории останется в согласованном виде.
  if (history.state && history.state.view && history.state.view !== 'view-home') {
    history.back();
    return;
  }
  renderHome();
  showView('view-home');
}

// ---------- Рендер: главный экран ----------
function renderHome() {
  const predictionEl = document.getElementById('daily-prediction-text');
  if (predictionEl) predictionEl.textContent = getDailyPrediction();

  const list = document.getElementById('home-list');
  const empty = document.getElementById('home-empty');
  list.innerHTML = '';

  const active = state.counters.filter(c => !c.archived);

  if (active.length === 0) {
    empty.classList.remove('hidden');
    updateArchiveBadge();
    return;
  }
  empty.classList.add('hidden');

  active.forEach(c => {
    const wrap = document.createElement('div');
    wrap.className = 'counter-card-wrap';
    wrap.innerHTML = `
      <div class="swipe-action-bg">${t('archive')} 📦</div>
      <div class="counter-card" style="border-left-color:${c.color}">
        <div class="counter-card-emoji" style="background:${c.color}22">${avatarMarkup(c)}</div>
        <div class="counter-card-body">
          <div class="counter-card-name">${escapeHtml(c.name)}</div>
          <div class="counter-card-sub">${tapsThisWeek(c)} ${t('statWeek')}</div>
        </div>
        <div class="counter-card-score">${c.taps.length}</div>
      </div>
    `;
    const card = wrap.querySelector('.counter-card');
    attachSwipeToArchive(card, wrap, c.id);
    card.addEventListener('click', () => {
      // Игнорируем клик, если карточка сейчас сдвинута свайпом
      if (card.dataset.swiped === '1') return;
      openDetail(c.id);
    });
    list.appendChild(wrap);
  });

  updateArchiveBadge();
}

function updateArchiveBadge() {
  const badge = document.getElementById('archive-badge');
  const n = state.counters.filter(c => c.archived).length;
  badge.textContent = n;
  badge.classList.toggle('hidden', n === 0);
}

// ---------- Свайп влево для отправки в архив ----------
const SWIPE_OPEN = -84;
const SWIPE_TRIGGER = -60;

function attachSwipeToArchive(card, wrap, id) {
  let startX = 0, startY = 0, dx = 0, dragging = false, decided = false, isHorizontal = false;

  function closeAllOtherCards() {
    document.querySelectorAll('.counter-card[data-swiped="1"]').forEach(el => {
      if (el !== card) {
        el.style.transform = 'translateX(0)';
        el.dataset.swiped = '0';
      }
    });
  }

  card.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    startX = e.clientX;
    startY = e.clientY;
    dx = 0;
    dragging = true;
    decided = false;
    isHorizontal = false;
    card.style.transition = 'none';
  });

  card.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const rawDx = e.clientX - startX;
    const rawDy = e.clientY - startY;

    if (!decided) {
      if (Math.abs(rawDx) > 6 || Math.abs(rawDy) > 6) {
        decided = true;
        isHorizontal = Math.abs(rawDx) > Math.abs(rawDy);
      } else {
        return;
      }
    }
    if (!isHorizontal) return;

    e.preventDefault();
    const base = card.dataset.swiped === '1' ? SWIPE_OPEN : 0;
    dx = Math.max(SWIPE_OPEN - 10, Math.min(0, base + rawDx));
    card.style.transform = `translateX(${dx}px)`;
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    card.style.transition = 'transform 0.2s ease';
    if (!isHorizontal) return;
    if (dx <= SWIPE_TRIGGER) {
      card.style.transform = `translateX(${SWIPE_OPEN}px)`;
      card.dataset.swiped = '1';
    } else {
      card.style.transform = 'translateX(0)';
      card.dataset.swiped = '0';
    }
  }

  card.addEventListener('pointerup', endDrag);
  card.addEventListener('pointercancel', endDrag);
  card.addEventListener('pointerleave', () => { if (dragging) endDrag(); });

  wrap.querySelector('.swipe-action-bg').addEventListener('click', () => {
    archiveCounter(id);
  });

  card.addEventListener('pointerdown', closeAllOtherCards);
}

// ---------- Аватар персонажа: фото (если есть) или эмодзи ----------
function avatarMarkup(c) {
  if (c.photo) return `<img src="${c.photo}" class="avatar-photo" alt="">`;
  return `<span class="avatar-emoji">${c.emoji}</span>`;
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ---------- Рендер: карточка персонажа ----------
function openDetail(id) {
  currentId = id;
  navigateTo('view-detail');
}

function getCurrentCounter() {
  return state.counters.find(c => c.id === currentId);
}

function renderDetail() {
  const c = getCurrentCounter();
  if (!c) { goHome(); return; }

  document.getElementById('detail-emoji').innerHTML = avatarMarkup(c);
  document.getElementById('detail-name').textContent = c.name;
  document.getElementById('tap-emoji').innerHTML = avatarMarkup(c);

  const total = c.taps.length;
  document.getElementById('score-total').textContent = total;
  document.getElementById('score-quip').textContent = findQuip(total);
  document.getElementById('score-banner').style.background =
    `linear-gradient(135deg, ${c.color}, #8B5CF6)`;

  document.getElementById('stat-today').textContent = tapsToday(c);
  document.getElementById('stat-week').textContent = tapsThisWeek(c);
  document.getElementById('stat-prev-week').textContent = tapsPrevWeek(c);

  document.getElementById('achievement-text').textContent = findAchievement(total);

  document.getElementById('btn-undo').style.visibility = total > 0 ? 'visible' : 'hidden';

  const streak = computeStreak(c);
  const streakChip = document.getElementById('streak-chip');
  if (streak >= 1) {
    streakChip.textContent = t('streakText', streak);
    streakChip.classList.remove('hidden');
  } else {
    streakChip.classList.add('hidden');
  }

  renderDailyChart(c);
  renderWeeklyChart(c);
}

function renderDailyChart(c) {
  const el = document.getElementById('chart-week');
  el.innerHTML = '';
  const now = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  const counts = days.map(d => {
    const start = new Date(d); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(end.getDate() + 1);
    return tapsInRange(c, start, end);
  });
  const max = Math.max(1, ...counts);
  const labels = t('weekdays');

  days.forEach((d, i) => {
    const isToday = i === days.length - 1;
    const col = document.createElement('div');
    col.className = 'chart-col' + (isToday ? ' is-today' : '');
    const h = Math.round((counts[i] / max) * 90) + 4;
    col.innerHTML = `
      <div class="chart-val">${counts[i]}</div>
      <div class="chart-bar" style="height:${h}px"></div>
      <div class="chart-label">${labels[(d.getDay() + 6) % 7]}</div>
    `;
    el.appendChild(col);
  });
}

function renderWeeklyChart(c) {
  const el = document.getElementById('chart-weeks');
  el.innerHTML = '';
  const now = new Date();
  const weeks = [];
  for (let i = 5; i >= 0; i--) {
    const start = startOfWeek(now);
    start.setDate(start.getDate() - i * 7);
    const end = new Date(start); end.setDate(end.getDate() + 7);
    weeks.push({ start, end });
  }
  const counts = weeks.map(w => tapsInRange(c, w.start, w.end));
  const max = Math.max(1, ...counts);

  weeks.forEach((w, i) => {
    const isThis = i === weeks.length - 1;
    const col = document.createElement('div');
    col.className = 'chart-col' + (isThis ? ' is-today' : '');
    const h = Math.round((counts[i] / max) * 90) + 4;
    col.innerHTML = `
      <div class="chart-val">${counts[i]}</div>
      <div class="chart-bar" style="height:${h}px"></div>
      <div class="chart-label">${w.start.getDate()}.${w.start.getMonth() + 1}</div>
    `;
    el.appendChild(col);
  });
}

// ---------- Звук ----------
let audioCtx = null;
function getAudioCtx() {
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTapSound() {
  if (!state.settings.sound) return;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.16, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch (e) { /* звук не критичен, тихо игнорируем */ }
}

// ---------- Тап ----------
function addTap(counter, note) {
  const tap = { id: uid(), ts: Date.now(), note: (note || '').trim() };
  counter.taps.push(tap);
  saveState();

  if (state.settings.vibro && navigator.vibrate) navigator.vibrate(25);
  playTapSound();
  burstConfetti(counter.color);

  const btn = document.getElementById('btn-tap');
  btn.classList.remove('pop');
  void btn.offsetWidth;
  btn.classList.add('pop');

  renderDetail();

  const total = counter.taps.length;
  const milestone = getAchievements().find(a => a.min === total);
  if (milestone) showToast(milestone.text);

  return tap;
}

function handleTap() {
  const c = getCurrentCounter();
  if (!c) return;
  addTap(c, '');
}

function handleUndo() {
  const c = getCurrentCounter();
  if (!c || c.taps.length === 0) return;
  c.taps.pop();
  saveState();
  renderDetail();
  showToast(t('undoneToast'));
}

function burstConfetti(color) {
  const colors = [color, '#FFC93C', '#8B5CF6', '#1FC8C0'];
  const btn = document.getElementById('btn-tap');
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 14; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = cx + 'px';
    piece.style.top = cy + 'px';
    piece.style.background = colors[i % colors.length];
    document.body.appendChild(piece);

    const angle = (Math.PI * 2 * i) / 14;
    const dist = 60 + Math.random() * 60;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    piece.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${360 * Math.random()}deg)`, opacity: 0 }
    ], { duration: 550 + Math.random() * 200, easing: 'ease-out' })
      .onfinish = () => piece.remove();
  }
}

let toastTimer = null;
function showToast(text) {
  const el = document.getElementById('toast');
  el.textContent = text;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2200);
}

// ---------- Модалка подтверждения (замена нативного confirm()) ----------
let confirmResolve = null;

function showConfirm(message) {
  return new Promise(resolve => {
    confirmResolve = resolve;
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('modal-confirm').classList.remove('hidden');
  });
}

function closeConfirm(result) {
  document.getElementById('modal-confirm').classList.add('hidden');
  if (confirmResolve) {
    confirmResolve(result);
    confirmResolve = null;
  }
}

// ---------- Архив ----------
function archiveCounter(id) {
  const c = state.counters.find(x => x.id === id);
  if (!c || c.archived) return;
  c.archived = true;
  c.archivedAt = Date.now();
  saveState();
  if (document.getElementById('view-home').classList.contains('active')) {
    renderHome();
  } else {
    goHome();
  }
  showToast(t('archivedToast', c.name));
}

function restoreCounter(id) {
  const c = state.counters.find(x => x.id === id);
  if (!c) return;
  c.archived = false;
  delete c.archivedAt;
  saveState();
  renderArchive();
  updateArchiveBadge();
  showToast(t('restoredToast', c.name));
}

async function deleteForever(id) {
  const c = state.counters.find(x => x.id === id);
  if (!c) return;
  if (!(await showConfirm(t('deleteForeverConfirm', c.name)))) return;
  state.counters = state.counters.filter(x => x.id !== id);
  saveState();
  renderArchive();
  updateArchiveBadge();
  showToast(t('deletedForeverToast'));
}

function renderArchive() {
  const list = document.getElementById('archive-list');
  const empty = document.getElementById('archive-empty');
  list.innerHTML = '';

  const archived = state.counters
    .filter(c => c.archived)
    .sort((a, b) => (b.archivedAt || 0) - (a.archivedAt || 0));

  if (archived.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  archived.forEach(c => {
    const row = document.createElement('div');
    row.className = 'archive-row';
    row.innerHTML = `
      <span class="archive-emoji">${c.emoji}</span>
      <span class="archive-name">${escapeHtml(c.name)}</span>
      <span class="archive-total">${t('totalText', c.taps.length)}</span>
      <span class="archive-actions">
        <button class="archive-btn" title="${t('restoreTitle')}" aria-label="${t('restoreTitle')}">♻️</button>
        <button class="archive-btn danger" title="${t('deleteForeverTitle')}" aria-label="${t('deleteForeverTitle')}">🗑️</button>
      </span>
    `;
    const [restoreBtn, deleteBtn] = row.querySelectorAll('.archive-btn');
    restoreBtn.addEventListener('click', () => restoreCounter(c.id));
    deleteBtn.addEventListener('click', () => deleteForever(c.id));
    list.appendChild(row);
  });
}

// ---------- Кнопка "в архив" на карточке персонажа ----------
function handleDelete() {
  const c = getCurrentCounter();
  if (!c) return;
  archiveCounter(c.id);
}

// ---------- Добавление счётчика ----------
function openAddModal() {
  renderPresetGrid();
  renderEmojiPalette();
  renderColorRow();
  document.getElementById('input-custom-name').value = '';
  pendingPhoto = null;
  updatePhotoPreview();
  document.getElementById('modal-add').classList.remove('hidden');
}

function closeAddModal() {
  document.getElementById('modal-add').classList.add('hidden');
  document.getElementById('emoji-palette').classList.add('hidden');
}

// ---------- Фото вместо эмодзи ----------
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Сжимаем фото до небольшого квадрата, чтобы не раздувать localStorage.
function resizeImageDataUrl(dataUrl, size) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale, h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

async function handlePhotoFile(file) {
  if (!file) return;
  const raw = await readFileAsDataUrl(file);
  pendingPhoto = await resizeImageDataUrl(raw, 200);
  updatePhotoPreview();
}

function updatePhotoPreview() {
  const btn = document.getElementById('btn-pick-emoji');
  if (pendingPhoto) {
    btn.innerHTML = `<img src="${pendingPhoto}" class="avatar-photo" alt="">`;
  } else {
    btn.textContent = pendingEmoji;
  }
  const removeBtn = document.getElementById('btn-remove-photo');
  if (removeBtn) removeBtn.classList.toggle('hidden', !pendingPhoto);
}

async function handleChangePhotoFile(file) {
  const c = getCurrentCounter();
  if (!c || !file) return;
  const raw = await readFileAsDataUrl(file);
  c.photo = await resizeImageDataUrl(raw, 200);
  saveState();
  renderDetail();
  renderHome();
}

function renderPresetGrid() {
  const grid = document.getElementById('preset-grid');
  grid.innerHTML = '';
  getPresets().forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'preset-item';
    btn.innerHTML = `<span class="p-emoji">${p.emoji}</span><span>${escapeHtml(p.name)}</span>`;
    btn.addEventListener('click', () => addCounter(p.name, p.emoji, p.color));
    grid.appendChild(btn);
  });
}

function renderEmojiPalette() {
  const pal = document.getElementById('emoji-palette');
  pal.innerHTML = '';
  EMOJI_CHOICES.forEach(e => {
    const btn = document.createElement('button');
    btn.textContent = e;
    btn.addEventListener('click', () => {
      pendingEmoji = e;
      pendingPhoto = null;
      updatePhotoPreview();
      pal.classList.add('hidden');
    });
    pal.appendChild(btn);
  });
}

function renderColorRow() {
  const row = document.getElementById('color-row');
  row.innerHTML = '';
  pendingColor = COLOR_CHOICES[0];
  COLOR_CHOICES.forEach((color, i) => {
    const dot = document.createElement('button');
    dot.className = 'color-dot' + (i === 0 ? ' selected' : '');
    dot.style.background = color;
    dot.addEventListener('click', () => {
      pendingColor = color;
      row.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected'));
      dot.classList.add('selected');
    });
    row.appendChild(dot);
  });
}

function addCounter(name, emoji, color, photo) {
  const c = { id: uid(), name, emoji, color, taps: [], patterns: [] };
  if (photo) c.photo = photo;
  state.counters.unshift(c);
  saveState();
  closeAddModal();
  openDetail(c.id);
  showToast(t('addedToast', name));
}

function handleAddCustom() {
  const name = document.getElementById('input-custom-name').value.trim();
  if (!name) {
    showToast(t('enterNameToast'));
    return;
  }
  addCounter(name, pendingEmoji, pendingColor, pendingPhoto);
}

// ---------- Общая статистика (итоги недели) ----------
function renderSummary() {
  const list = document.getElementById('summary-list');
  const empty = document.getElementById('summary-empty');
  list.innerHTML = '';

  const activeCounters = state.counters.filter(c => !c.archived);

  if (activeCounters.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  const ranked = activeCounters
    .map(c => ({ c, week: tapsThisWeek(c) }))
    .sort((a, b) => b.week - a.week);

  ranked.forEach((r, i) => {
    const row = document.createElement('div');
    row.className = 'summary-row';
    row.innerHTML = `
      <div class="summary-rank">#${i + 1}</div>
      <div class="summary-emoji">${r.c.emoji}</div>
      <div class="summary-name">${escapeHtml(r.c.name)}</div>
      <div class="summary-count">${r.week}</div>
    `;
    list.appendChild(row);
  });

  if (ranked.length) {
    const top = ranked[0];
    const label = findWeekLabel(top.week);
    const banner = document.createElement('div');
    banner.className = 'achievement-badge';
    banner.style.marginTop = '14px';
    banner.textContent = `${top.c.emoji} ${top.c.name}: ${label}`;
    list.appendChild(banner);
  }

  renderStreakLeaders(activeCounters);
}

// ---------- Лидеры по сериям (стрикам) ----------
function renderStreakLeaders(activeCounters) {
  const wrap = document.getElementById('streak-leaders-list');
  const empty = document.getElementById('streak-leaders-empty');
  if (!wrap) return;
  wrap.innerHTML = '';

  const ranked = activeCounters
    .map(c => ({ c, streak: computeStreak(c) }))
    .filter(r => r.streak > 0)
    .sort((a, b) => b.streak - a.streak);

  if (ranked.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  ranked.forEach((r, i) => {
    const row = document.createElement('div');
    row.className = 'summary-row';
    row.innerHTML = `
      <div class="summary-rank">#${i + 1}</div>
      <div class="summary-emoji">${avatarMarkup(r.c)}</div>
      <div class="summary-name">${escapeHtml(r.c.name)}</div>
      <div class="summary-count">${t('streakText', r.streak)}</div>
    `;
    wrap.appendChild(row);
  });
}

// ---------- Поделиться итогами недели как картинкой ----------
async function shareWeeklyResults() {
  const activeCounters = state.counters.filter(c => !c.archived);
  if (activeCounters.length === 0) return;

  const ranked = activeCounters
    .map(c => ({ c, week: tapsThisWeek(c) }))
    .sort((a, b) => b.week - a.week);

  const width = 800, rowH = 92, headerH = 140, footerH = 50;
  const height = headerH + ranked.length * rowH + footerH;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#FF5A7A');
  grad.addColorStop(1, '#8B5CF6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#fff';
  ctx.font = '900 40px sans-serif';
  ctx.fillText('🤔 ' + t('appTitle'), 32, 60);
  ctx.font = '700 26px sans-serif';
  ctx.fillText(t('weekResults'), 32, 104);

  ranked.forEach((r, i) => {
    const y = headerH + i * rowH;
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    roundRect(ctx, 24, y, width - 48, rowH - 14, 18);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '900 30px sans-serif';
    ctx.fillText(`#${i + 1}`, 44, y + 50);
    ctx.font = '48px sans-serif';
    ctx.fillText(r.c.emoji, 120, y + 55);
    ctx.font = '700 30px sans-serif';
    ctx.fillText(r.c.name, 200, y + 50);
    ctx.font = '900 34px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(String(r.week), width - 60, y + 52);
    ctx.textAlign = 'left';
  });

  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '500 18px sans-serif';
  ctx.fillText('kto-prav-v-semie', 32, height - 20);

  canvas.toBlob(async (blob) => {
    if (!blob) return;
    const fileName = 'kto-prav-itogi-nedeli.png';
    const file = new File([blob], fileName, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: t('shareTitle', t('appTitle')) });
        return;
      } catch (e) { /* пользователь отменил или шеринг не сработал — упадём в скачивание */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(t('shareFallbackSaved'));
  }, 'image/png');
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ---------- Лента событий (все тапы всех персонажей) ----------
function renderFeed() {
  const list = document.getElementById('feed-list');
  const empty = document.getElementById('feed-empty');
  list.innerHTML = '';

  const activeCounters = state.counters.filter(c => !c.archived);
  const events = [];
  activeCounters.forEach(c => {
    c.taps.forEach(tap => events.push({ c, tap }));
  });
  events.sort((a, b) => b.tap.ts - a.tap.ts);

  if (events.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  events.slice(0, 200).forEach(({ c, tap }) => {
    const row = document.createElement('div');
    row.className = 'history-row feed-row';
    row.innerHTML = `
      <span class="history-row-icon feed-avatar" style="background:${c.color}22">${avatarMarkup(c)}</span>
      <div class="history-row-body">
        <div class="history-row-date">${escapeHtml(c.name)} · ${formatTapDate(tap.ts)}</div>
        <div class="history-row-note ${tap.note ? '' : 'empty'}">${tap.note ? escapeHtml(tap.note) : t('noComment')}</div>
      </div>
    `;
    row.addEventListener('click', () => { currentId = c.id; navigateTo('view-detail'); });
    list.appendChild(row);
  });
}

// ---------- Сравнение "Кто кого?" ----------
function renderCompareSelects() {
  const active = state.counters.filter(c => !c.archived);
  [1, 2].forEach(n => {
    const sel = document.getElementById('compare-select-' + n);
    const current = compareIds[n - 1];
    sel.innerHTML = `<option value="">—</option>` + active.map(c =>
      `<option value="${c.id}">${c.emoji} ${escapeHtml(c.name)}</option>`
    ).join('');
    sel.value = current && active.some(c => c.id === current) ? current : '';
  });
}

function renderCompare() {
  renderCompareSelects();
  renderCompareResult();
}

function renderCompareResult() {
  const result = document.getElementById('compare-result');
  const [id1, id2] = compareIds;
  const c1 = state.counters.find(c => c.id === id1);
  const c2 = state.counters.find(c => c.id === id2);

  if (!c1 || !c2 || c1.id === c2.id) {
    result.innerHTML = `<div class="empty-state"><div class="empty-emoji">⚔️</div><p>${t('compareNeedTwo')}</p></div>`;
    return;
  }

  const rows = [
    { label: t('statToday'), a: tapsToday(c1), b: tapsToday(c2) },
    { label: t('statWeek'), a: tapsThisWeek(c1), b: tapsThisWeek(c2) },
    { label: t('scoreLabel'), a: c1.taps.length, b: c2.taps.length },
    { label: '🔥', a: computeStreak(c1), b: computeStreak(c2) },
  ];

  let html = `
    <div class="compare-header-row">
      <div class="compare-side"><div class="compare-avatar">${avatarMarkup(c1)}</div><div class="compare-name">${escapeHtml(c1.name)}</div></div>
      <div class="compare-vs">${t('compareVs')}</div>
      <div class="compare-side"><div class="compare-avatar">${avatarMarkup(c2)}</div><div class="compare-name">${escapeHtml(c2.name)}</div></div>
    </div>
  `;

  rows.forEach(r => {
    const max = Math.max(r.a, r.b, 1);
    html += `
      <div class="compare-row">
        <div class="compare-val compare-val-left ${r.a >= r.b ? 'compare-lead' : ''}">${r.a}</div>
        <div class="compare-bars">
          <div class="compare-bar-track compare-bar-left"><div class="compare-bar-fill" style="width:${(r.a / max) * 100}%;background:${c1.color}"></div></div>
          <div class="compare-row-label">${r.label}</div>
          <div class="compare-bar-track compare-bar-right"><div class="compare-bar-fill" style="width:${(r.b / max) * 100}%;background:${c2.color}"></div></div>
        </div>
        <div class="compare-val compare-val-right ${r.b >= r.a ? 'compare-lead' : ''}">${r.b}</div>
      </div>
    `;
  });

  const totalA = c1.taps.length, totalB = c2.taps.length;
  const verdict = totalA === totalB ? t('compareTie') : t('compareWinner', totalA > totalB ? c1.name : c2.name);
  html += `<div class="achievement-badge" style="margin-top:16px">${verdict}</div>`;

  result.innerHTML = html;
}

function handleCompareSelectChange() {
  compareIds = [
    document.getElementById('compare-select-1').value || null,
    document.getElementById('compare-select-2').value || null,
  ];
  renderCompareResult();
}

// ---------- Модалка "тап с комментарием" / редактирование тапа ----------
function openCommentModal(mode, tap) {
  const c = getCurrentCounter();
  if (!c) return;

  commentModalMode = mode;
  commentModalTapId = tap ? tap.id : null;

  document.getElementById('comment-modal-title').textContent =
    mode === 'edit' ? t('commentModalTitleEdit') : t('commentModalTitleAdd');
  document.getElementById('input-comment-text').value = tap ? (tap.note || '') : '';
  document.getElementById('chk-save-pattern').checked = mode !== 'edit';
  document.getElementById('btn-comment-submit').textContent = mode === 'edit' ? t('saveSubmitBtn') : t('tapSubmitBtn');
  document.getElementById('btn-comment-delete').classList.toggle('hidden', mode !== 'edit');

  renderPatternChips(c);

  document.getElementById('modal-comment').classList.remove('hidden');
  document.getElementById('input-comment-text').focus();
}

function closeCommentModal() {
  document.getElementById('modal-comment').classList.add('hidden');
  stopVoiceInput();
}

// ---------- Голосовой ввод комментария ----------
let voiceRecognition = null;
let voiceListening = false;

function getSpeechRecognitionCtor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function toggleVoiceInput() {
  const Ctor = getSpeechRecognitionCtor();
  const micBtn = document.getElementById('btn-voice-input');
  if (!Ctor) {
    showToast(t('micUnsupported'));
    return;
  }
  if (voiceListening) {
    stopVoiceInput();
    return;
  }
  voiceRecognition = new Ctor();
  voiceRecognition.lang = currentLang() === 'ru' ? 'ru-RU' : 'en-US';
  voiceRecognition.interimResults = false;
  voiceRecognition.maxAlternatives = 1;

  voiceRecognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    const field = document.getElementById('input-comment-text');
    field.value = (field.value ? field.value + ' ' : '') + transcript;
  };
  voiceRecognition.onerror = () => stopVoiceInput();
  voiceRecognition.onend = () => stopVoiceInput();

  try {
    voiceRecognition.start();
    voiceListening = true;
    if (micBtn) { micBtn.classList.add('listening'); micBtn.textContent = '⏺️'; }
  } catch (e) { stopVoiceInput(); }
}

function stopVoiceInput() {
  if (voiceRecognition) {
    try { voiceRecognition.stop(); } catch (e) {}
  }
  voiceListening = false;
  const micBtn = document.getElementById('btn-voice-input');
  if (micBtn) { micBtn.classList.remove('listening'); micBtn.textContent = '🎙️'; }
}

function renderPatternChips(c) {
  const wrap = document.getElementById('pattern-chips');
  wrap.innerHTML = '';
  c.patterns.forEach(pattern => {
    const chip = document.createElement('span');
    chip.className = 'pattern-chip';
    chip.innerHTML = `
      <button class="chip-text">${escapeHtml(pattern)}</button>
      <button class="chip-remove" aria-label="×">×</button>
    `;
    chip.querySelector('.chip-text').addEventListener('click', () => {
      // Быстрый тап по готовому паттерну — без лишнего ввода текста
      if (commentModalMode === 'edit') {
        document.getElementById('input-comment-text').value = pattern;
        return;
      }
      addTap(c, pattern);
      closeCommentModal();
      showToast(t('recordedToast', pattern));
    });
    chip.querySelector('.chip-remove').addEventListener('click', (e) => {
      e.stopPropagation();
      c.patterns = c.patterns.filter(p => p !== pattern);
      saveState();
      renderPatternChips(c);
    });
    wrap.appendChild(chip);
  });
}

function submitCommentModal() {
  const c = getCurrentCounter();
  if (!c) return;
  const text = document.getElementById('input-comment-text').value.trim();
  const savePattern = document.getElementById('chk-save-pattern').checked;

  if (savePattern && text && !c.patterns.includes(text)) {
    c.patterns.push(text);
  }

  if (commentModalMode === 'edit') {
    const tap = c.taps.find(t2 => t2.id === commentModalTapId);
    if (tap) tap.note = text;
    saveState();
    closeCommentModal();
    renderHistory();
    renderDetail();
    showToast(t('commentSavedToast'));
  } else {
    addTap(c, text);
    closeCommentModal();
  }
}

async function deleteTapFromModal() {
  const c = getCurrentCounter();
  if (!c || !commentModalTapId) return;
  if (!(await showConfirm(t('deleteTapConfirm')))) return;
  c.taps = c.taps.filter(tap => tap.id !== commentModalTapId);
  saveState();
  closeCommentModal();
  renderHistory();
  renderDetail();
  showToast(t('tapDeletedToast'));
}

// ---------- История тапов ----------
function formatTapDate(ts) {
  const d = new Date(ts);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}.${mm}, ${hh}:${mi}`;
}

function renderHistory() {
  const c = getCurrentCounter();
  if (!c) return;

  document.getElementById('history-title').textContent = t('historyTitle', c.name);

  const list = document.getElementById('history-list');
  const empty = document.getElementById('history-empty');
  list.innerHTML = '';

  const sorted = [...c.taps].sort((a, b) => b.ts - a.ts);

  if (sorted.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  sorted.forEach(tap => {
    const row = document.createElement('div');
    row.className = 'history-row';
    row.innerHTML = `
      <span class="history-row-icon">${tap.note ? '💬' : '👉'}</span>
      <div class="history-row-body">
        <div class="history-row-date">${formatTapDate(tap.ts)}</div>
        <div class="history-row-note ${tap.note ? '' : 'empty'}">${tap.note ? escapeHtml(tap.note) : t('noComment')}</div>
      </div>
    `;
    row.addEventListener('click', () => openCommentModal('edit', tap));
    list.appendChild(row);
  });
}

// ---------- Настройки ----------
function renderSettings() {
  document.getElementById('chk-sound').checked = state.settings.sound;
  document.getElementById('chk-vibro').checked = state.settings.vibro;
  updateLangSegmentedUI();
  updateThemeSegmentedUI();
}

function updateLangSegmentedUI() {
  const pref = state.settings.lang || 'auto';
  document.querySelectorAll('#lang-segmented .segmented-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === pref);
  });
}

// ---------- Тема ----------
function applyTheme() {
  const pref = (state.settings && state.settings.theme) || 'auto';
  document.getElementById('html-root').setAttribute('data-theme', pref);
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    const isDark = pref === 'dark' || (pref === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    metaTheme.setAttribute('content', isDark ? '#1B1420' : '#FF5A7A');
  }
}

function updateThemeSegmentedUI() {
  const pref = (state.settings && state.settings.theme) || 'auto';
  document.querySelectorAll('#theme-segmented .segmented-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeOption === pref);
  });
}

function exportData() {
  const dataStr = JSON.stringify(state, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const a = document.createElement('a');
  a.href = url;
  a.download = `kto-prav-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(t('backupSavedToast'));
}

function importDataFromFile(file) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    let parsed;
    try {
      parsed = JSON.parse(e.target.result);
    } catch (err) {
      showToast(t('importParseError'));
      return;
    }
    if (!parsed || !Array.isArray(parsed.counters)) {
      showToast(t('importFormatError'));
      return;
    }
    if (!(await showConfirm(t('importConfirm')))) return;
    state = parsed;
    if (!state.settings) state.settings = { sound: true, vibro: true, lang: 'auto', theme: 'auto' };
    if (!['auto', 'ru', 'en'].includes(state.settings.lang)) state.settings.lang = 'auto';
    if (!['auto', 'light', 'dark'].includes(state.settings.theme)) state.settings.theme = 'auto';
    state.counters.forEach(c => {
      if (!Array.isArray(c.patterns)) c.patterns = [];
      c.taps = (c.taps || []).map(tap => typeof tap === 'number' ? { id: uid(), ts: tap, note: '' } : tap);
    });
    saveState();
    applyTheme();
    applyLanguage();
    goHome();
    showToast(t('importedToast'));
  };
  reader.readAsText(file);
}

// ---------- Применение языка ко всему интерфейсу ----------
function applyStaticTranslations() {
  const lang = currentLang();
  document.getElementById('html-root').setAttribute('lang', lang);
  document.getElementById('page-title').textContent = t('appTitle');
  document.title = t('appTitle');
  document.getElementById('meta-description').setAttribute('content', t('metaDescription'));

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });

  updateLangSegmentedUI();
}

function applyLanguage() {
  applyStaticTranslations();
  const activeView = document.querySelector('.view.active');
  if (!activeView) return;
  switch (activeView.id) {
    case 'view-home': renderHome(); break;
    case 'view-detail': renderDetail(); break;
    case 'view-history': renderHistory(); break;
    case 'view-settings': renderSettings(); break;
    case 'view-archive': renderArchive(); break;
    case 'view-summary': renderSummary(); break;
    case 'view-feed': renderFeed(); break;
    case 'view-compare': renderCompare(); break;
  }
}

// ---------- Инициализация ----------
function init() {
  loadState();
  applyTheme();
  applyStaticTranslations();
  history.replaceState({ view: 'view-home' }, '', location.href);
  goHome();

  window.addEventListener('popstate', (e) => {
    const view = (e.state && e.state.view) || 'view-home';
    renderView(view);
    showView(view);
  });

  document.getElementById('btn-add-counter').addEventListener('click', openAddModal);
  document.getElementById('btn-close-modal').addEventListener('click', closeAddModal);
  document.getElementById('modal-add').addEventListener('click', (e) => {
    if (e.target.id === 'modal-add') closeAddModal();
  });

  document.getElementById('btn-back-home').addEventListener('click', goHome);
  document.getElementById('btn-back-home-2').addEventListener('click', goHome);
  document.getElementById('btn-delete-counter').addEventListener('click', handleDelete);

  document.getElementById('btn-confirm-cancel').addEventListener('click', () => closeConfirm(false));
  document.getElementById('btn-confirm-ok').addEventListener('click', () => closeConfirm(true));
  document.getElementById('modal-confirm').addEventListener('click', (e) => {
    if (e.target.id === 'modal-confirm') closeConfirm(false);
  });

  document.getElementById('btn-tap').addEventListener('click', handleTap);
  document.getElementById('btn-undo').addEventListener('click', handleUndo);

  document.getElementById('btn-pick-emoji').addEventListener('click', () => {
    document.getElementById('emoji-palette').classList.toggle('hidden');
  });
  document.getElementById('btn-add-custom').addEventListener('click', handleAddCustom);

  document.getElementById('btn-open-stats-summary').addEventListener('click', () => {
    navigateTo('view-summary');
  });

  document.getElementById('btn-open-archive').addEventListener('click', () => {
    navigateTo('view-archive');
  });
  document.getElementById('btn-back-home-3').addEventListener('click', goHome);

  // ---- Лента событий ----
  document.getElementById('btn-open-feed').addEventListener('click', () => {
    navigateTo('view-feed');
  });
  document.getElementById('btn-back-from-feed').addEventListener('click', goHome);

  // ---- Сравнение "Кто кого?" ----
  document.getElementById('btn-open-compare').addEventListener('click', () => {
    compareIds = [null, null];
    navigateTo('view-compare');
  });
  document.getElementById('btn-back-from-compare').addEventListener('click', goHome);
  document.getElementById('compare-select-1').addEventListener('change', handleCompareSelectChange);
  document.getElementById('compare-select-2').addEventListener('change', handleCompareSelectChange);

  // ---- Итоги недели: поделиться и лидеры по сериям ----
  document.getElementById('btn-share-results').addEventListener('click', shareWeeklyResults);

  // ---- Фото вместо эмодзи (добавление персонажа) ----
  document.getElementById('input-photo-file').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handlePhotoFile(file);
    e.target.value = '';
  });
  document.getElementById('btn-pick-photo').addEventListener('click', () => {
    document.getElementById('input-photo-file').click();
  });
  document.getElementById('btn-remove-photo').addEventListener('click', () => {
    pendingPhoto = null;
    updatePhotoPreview();
  });

  // ---- Смена фото у существующего персонажа (тап по аватару в карточке) ----
  document.getElementById('detail-emoji').addEventListener('click', () => {
    document.getElementById('input-change-photo-file').click();
  });
  document.getElementById('input-change-photo-file').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleChangePhotoFile(file);
    e.target.value = '';
  });

  // ---- Голосовой ввод комментария ----
  document.getElementById('btn-voice-input').addEventListener('click', toggleVoiceInput);

  // ---- Комментарии к тапам ----
  document.getElementById('btn-tap-comment').addEventListener('click', () => openCommentModal('add', null));
  document.getElementById('btn-close-comment-modal').addEventListener('click', closeCommentModal);
  document.getElementById('modal-comment').addEventListener('click', (e) => {
    if (e.target.id === 'modal-comment') closeCommentModal();
  });
  document.getElementById('btn-comment-submit').addEventListener('click', submitCommentModal);
  document.getElementById('btn-comment-delete').addEventListener('click', deleteTapFromModal);

  // ---- История ----
  document.getElementById('btn-open-history').addEventListener('click', () => {
    navigateTo('view-history');
  });
  document.getElementById('btn-back-from-history').addEventListener('click', () => history.back());

  // ---- Настройки ----
  document.getElementById('btn-open-settings').addEventListener('click', () => {
    navigateTo('view-settings');
  });
  document.getElementById('btn-back-from-settings').addEventListener('click', goHome);
  document.getElementById('chk-sound').addEventListener('change', (e) => {
    state.settings.sound = e.target.checked;
    saveState();
  });
  document.getElementById('chk-vibro').addEventListener('change', (e) => {
    state.settings.vibro = e.target.checked;
    saveState();
  });
  document.querySelectorAll('#lang-segmented .segmented-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.settings.lang = btn.dataset.lang;
      saveState();
      applyLanguage();
    });
  });
  document.querySelectorAll('#theme-segmented .segmented-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.settings.theme = btn.dataset.themeOption;
      saveState();
      applyTheme();
      updateThemeSegmentedUI();
    });
  });
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if ((state.settings.theme || 'auto') === 'auto') applyTheme();
    });
  }
  document.getElementById('btn-export-data').addEventListener('click', exportData);
  document.getElementById('btn-import-data').addEventListener('click', () => {
    document.getElementById('input-import-file').click();
  });
  document.getElementById('input-import-file').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) importDataFromFile(file);
    e.target.value = '';
  });

  if (!getSpeechRecognitionCtor()) {
    const micBtn = document.getElementById('btn-voice-input');
    if (micBtn) micBtn.classList.add('hidden');
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', init);
