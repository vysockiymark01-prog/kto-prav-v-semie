// ===== "Кто прав в семье?" — логика приложения =====
// Все данные хранятся локально на устройстве (localStorage), без сервера.

const STORAGE_KEY = 'ktoprav_counters_v1';

const PRESETS = [
  { name: 'Тёща',      emoji: '👵', color: '#FF5A7A' },
  { name: 'Тесть',     emoji: '👴', color: '#1FC8C0' },
  { name: 'Свекровь',  emoji: '👵', color: '#8B5CF6' },
  { name: 'Свёкор',    emoji: '👴', color: '#FFC93C' },
  { name: 'Муж',       emoji: '🤵', color: '#1FC8C0' },
  { name: 'Жена',      emoji: '👰', color: '#FF5A7A' },
  { name: 'Мама',      emoji: '👩', color: '#FF9F5A' },
  { name: 'Папа',      emoji: '👨', color: '#5AA9FF' },
  { name: 'Брат',      emoji: '🧑', color: '#1FC8C0' },
  { name: 'Сестра',    emoji: '👧', color: '#FF5A7A' },
  { name: 'Начальник', emoji: '🧑‍💼', color: '#8B5CF6' },
  { name: 'Я сам(а)',  emoji: '🤓', color: '#FFC93C' },
];

const EMOJI_CHOICES = ['😀','😎','🥲','🤨','🧐','😤','🙄','😇','🤷','🤷‍♀️','🤷‍♂️','👻','🐱','🐶','🦄','🔥','👑','💅','🫡','🧙','🧑‍🍳','🐍','🦉','🐢'];
const COLOR_CHOICES = ['#FF5A7A', '#1FC8C0', '#FFC93C', '#8B5CF6', '#5AA9FF', '#FF9F5A'];

const QUIPS_BY_COUNT = [
  { min: 0, max: 0, text: 'Пока тишина. Затишье перед бурей?' },
  { min: 1, max: 3, text: 'Разминка началась.' },
  { min: 4, max: 9, text: 'Уже заметно. Может, просто соглашаться сразу?' },
  { min: 10, max: 19, text: 'Двузначные числа. Уважение.' },
  { min: 20, max: 49, text: 'Легенда семьи в процессе становления.' },
  { min: 50, max: 99, text: 'Официально: спорить бесполезно.' },
  { min: 100, max: Infinity, text: 'Занесено в семейную летопись навечно.' },
];

const WEEK_LABELS = [
  { min: 0, max: 0, text: 'Спокойная неделя. Подозрительно спокойная.' },
  { min: 1, max: 2, text: 'Лёгкая разминка недели.' },
  { min: 3, max: 5, text: 'Обычная семейная неделя.' },
  { min: 6, max: 9, text: 'Неделя явного превосходства.' },
  { min: 10, max: 14, text: 'Ораторская неделя. Аргументы не иссякают.' },
  { min: 15, max: Infinity, text: 'Рекорд недели! Пора вручать медаль.' },
];

const ACHIEVEMENTS = [
  { min: 0, text: 'Легенда только начинается' },
  { min: 5, text: '🏅 Достижение: «Уверенная позиция» (5)' },
  { min: 10, text: '🏅 Достижение: «Двузначный авторитет» (10)' },
  { min: 25, text: '🥈 Достижение: «Голос разума семьи» (25)' },
  { min: 50, text: '🥇 Достижение: «Непререкаемый авторитет» (50)' },
  { min: 100, text: '👑 Достижение: «Живая легенда» (100)' },
  { min: 250, text: '🐐 Достижение: «GOAT семьи» (250)' },
];

let state = { counters: [], settings: { sound: true, vibro: true } };
let currentId = null;
let pendingEmoji = '😀';
let pendingColor = COLOR_CHOICES[0];

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
  if (!state.settings) state.settings = { sound: true, vibro: true };
  if (typeof state.settings.sound !== 'boolean') state.settings.sound = true;
  if (typeof state.settings.vibro !== 'boolean') state.settings.vibro = true;

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
  return counter.taps.filter(t => t.ts >= from.getTime() && t.ts < to.getTime()).length;
}

// ---------- Стрики (серии подряд идущих дней) ----------
function ruPluralDays(n) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня';
  return 'дней';
}

function computeStreak(counter) {
  const daySet = new Set(counter.taps.map(t => dayKey(t.ts)));
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
  const start = new Date(now); start.setHours(0,0,0,0);
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
  return (QUIPS_BY_COUNT.find(q => total >= q.min && total <= q.max) || QUIPS_BY_COUNT[0]).text;
}

function findWeekLabel(count) {
  return (WEEK_LABELS.find(q => count >= q.min && count <= q.max) || WEEK_LABELS[0]).text;
}

function findAchievement(total) {
  let best = ACHIEVEMENTS[0];
  for (const a of ACHIEVEMENTS) if (total >= a.min) best = a;
  return best.text;
}

// ---------- Навигация ----------
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goHome() {
  renderHome();
  showView('view-home');
}

// ---------- Рендер: главный экран ----------
function renderHome() {
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
      <div class="swipe-action-bg">В архив 📦</div>
      <div class="counter-card" style="border-left-color:${c.color}">
        <div class="counter-card-emoji" style="background:${c.color}22">${c.emoji}</div>
        <div class="counter-card-body">
          <div class="counter-card-name">${escapeHtml(c.name)}</div>
          <div class="counter-card-sub">${tapsThisWeek(c)} на этой неделе</div>
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

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ---------- Рендер: карточка персонажа ----------
function openDetail(id) {
  currentId = id;
  renderDetail();
  showView('view-detail');
}

function getCurrentCounter() {
  return state.counters.find(c => c.id === currentId);
}

function renderDetail() {
  const c = getCurrentCounter();
  if (!c) { goHome(); return; }

  document.getElementById('detail-emoji').textContent = c.emoji;
  document.getElementById('detail-name').textContent = c.name;
  document.getElementById('tap-emoji').textContent = c.emoji;

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
    streakChip.textContent = `🔥 ${streak} ${ruPluralDays(streak)} подряд`;
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
    const start = new Date(d); start.setHours(0,0,0,0);
    const end = new Date(start); end.setDate(end.getDate() + 1);
    return tapsInRange(c, start, end);
  });
  const max = Math.max(1, ...counts);
  const labels = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

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
      <div class="chart-label">${w.start.getDate()}.${w.start.getMonth()+1}</div>
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
  const milestone = ACHIEVEMENTS.find(a => a.min === total);
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
  showToast('Последний тап отменён');
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
  const t = document.getElementById('toast');
  t.textContent = text;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2200);
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
  showToast(`«${c.name}» отправлен(а) в архив`);
}

function restoreCounter(id) {
  const c = state.counters.find(x => x.id === id);
  if (!c) return;
  c.archived = false;
  delete c.archivedAt;
  saveState();
  renderArchive();
  updateArchiveBadge();
  showToast(`«${c.name}» восстановлен(а)`);
}

function deleteForever(id) {
  const c = state.counters.find(x => x.id === id);
  if (!c) return;
  if (!confirm(`Удалить «${c.name}» насовсем? Это нельзя отменить.`)) return;
  state.counters = state.counters.filter(x => x.id !== id);
  saveState();
  renderArchive();
  updateArchiveBadge();
  showToast('Удалено насовсем');
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
      <span class="archive-total">всего: ${c.taps.length}</span>
      <span class="archive-actions">
        <button class="archive-btn" title="Восстановить" aria-label="Восстановить">♻️</button>
        <button class="archive-btn danger" title="Удалить насовсем" aria-label="Удалить насовсем">🗑️</button>
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
  document.getElementById('modal-add').classList.remove('hidden');
}

function closeAddModal() {
  document.getElementById('modal-add').classList.add('hidden');
  document.getElementById('emoji-palette').classList.add('hidden');
}

function renderPresetGrid() {
  const grid = document.getElementById('preset-grid');
  grid.innerHTML = '';
  PRESETS.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'preset-item';
    btn.innerHTML = `<span class="p-emoji">${p.emoji}</span><span>${p.name}</span>`;
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
      document.getElementById('btn-pick-emoji').textContent = e;
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

function addCounter(name, emoji, color) {
  const c = { id: uid(), name, emoji, color, taps: [], patterns: [] };
  state.counters.unshift(c);
  saveState();
  closeAddModal();
  openDetail(c.id);
  showToast(`«${name}» добавлен(а)!`);
}

function handleAddCustom() {
  const name = document.getElementById('input-custom-name').value.trim();
  if (!name) {
    showToast('Введи имя персонажа');
    return;
  }
  addCounter(name, pendingEmoji, pendingColor);
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
}

// ---------- Модалка "тап с комментарием" / редактирование тапа ----------
function openCommentModal(mode, tap) {
  const c = getCurrentCounter();
  if (!c) return;

  commentModalMode = mode;
  commentModalTapId = tap ? tap.id : null;

  document.getElementById('comment-modal-title').textContent =
    mode === 'edit' ? 'Комментарий к тапу' : 'Тап с комментарием';
  document.getElementById('input-comment-text').value = tap ? (tap.note || '') : '';
  document.getElementById('chk-save-pattern').checked = mode !== 'edit';
  document.getElementById('btn-comment-submit').textContent = mode === 'edit' ? 'Сохранить' : 'Тап!';
  document.getElementById('btn-comment-delete').classList.toggle('hidden', mode !== 'edit');

  renderPatternChips(c);

  document.getElementById('modal-comment').classList.remove('hidden');
  document.getElementById('input-comment-text').focus();
}

function closeCommentModal() {
  document.getElementById('modal-comment').classList.add('hidden');
}

function renderPatternChips(c) {
  const wrap = document.getElementById('pattern-chips');
  wrap.innerHTML = '';
  c.patterns.forEach(pattern => {
    const chip = document.createElement('span');
    chip.className = 'pattern-chip';
    chip.innerHTML = `
      <button class="chip-text">${escapeHtml(pattern)}</button>
      <button class="chip-remove" aria-label="Удалить паттерн">×</button>
    `;
    chip.querySelector('.chip-text').addEventListener('click', () => {
      // Быстрый тап по готовому паттерну — без лишнего ввода текста
      if (commentModalMode === 'edit') {
        document.getElementById('input-comment-text').value = pattern;
        return;
      }
      addTap(c, pattern);
      closeCommentModal();
      showToast('Записано: «' + pattern + '»');
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
    const tap = c.taps.find(t => t.id === commentModalTapId);
    if (tap) tap.note = text;
    saveState();
    closeCommentModal();
    renderHistory();
    renderDetail();
    showToast('Комментарий сохранён');
  } else {
    addTap(c, text);
    closeCommentModal();
  }
}

function deleteTapFromModal() {
  const c = getCurrentCounter();
  if (!c || !commentModalTapId) return;
  if (!confirm('Удалить этот тап целиком? Счёт уменьшится на 1.')) return;
  c.taps = c.taps.filter(t => t.id !== commentModalTapId);
  saveState();
  closeCommentModal();
  renderHistory();
  renderDetail();
  showToast('Тап удалён');
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

  document.getElementById('history-title').textContent = `История: ${c.name}`;

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
        <div class="history-row-note ${tap.note ? '' : 'empty'}">${tap.note ? escapeHtml(tap.note) : 'без комментария'}</div>
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
  showToast('Файл с бэкапом сохранён');
}

function importDataFromFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    let parsed;
    try {
      parsed = JSON.parse(e.target.result);
    } catch (err) {
      showToast('Не удалось прочитать файл');
      return;
    }
    if (!parsed || !Array.isArray(parsed.counters)) {
      showToast('Файл не похож на бэкап этого приложения');
      return;
    }
    if (!confirm('Импорт заменит все текущие данные в приложении данными из файла. Продолжить?')) return;
    state = parsed;
    if (!state.settings) state.settings = { sound: true, vibro: true };
    state.counters.forEach(c => {
      if (!Array.isArray(c.patterns)) c.patterns = [];
      c.taps = (c.taps || []).map(t => typeof t === 'number' ? { id: uid(), ts: t, note: '' } : t);
    });
    saveState();
    goHome();
    showToast('Данные импортированы');
  };
  reader.readAsText(file);
}

// ---------- Инициализация ----------
function init() {
  loadState();
  goHome();

  document.getElementById('btn-add-counter').addEventListener('click', openAddModal);
  document.getElementById('btn-close-modal').addEventListener('click', closeAddModal);
  document.getElementById('modal-add').addEventListener('click', (e) => {
    if (e.target.id === 'modal-add') closeAddModal();
  });

  document.getElementById('btn-back-home').addEventListener('click', goHome);
  document.getElementById('btn-back-home-2').addEventListener('click', goHome);
  document.getElementById('btn-delete-counter').addEventListener('click', handleDelete);

  document.getElementById('btn-tap').addEventListener('click', handleTap);
  document.getElementById('btn-undo').addEventListener('click', handleUndo);

  document.getElementById('btn-pick-emoji').addEventListener('click', () => {
    document.getElementById('emoji-palette').classList.toggle('hidden');
  });
  document.getElementById('btn-add-custom').addEventListener('click', handleAddCustom);

  document.getElementById('btn-open-stats-summary').addEventListener('click', () => {
    renderSummary();
    showView('view-summary');
  });

  document.getElementById('btn-open-archive').addEventListener('click', () => {
    renderArchive();
    showView('view-archive');
  });
  document.getElementById('btn-back-home-3').addEventListener('click', goHome);

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
    renderHistory();
    showView('view-history');
  });
  document.getElementById('btn-back-from-history').addEventListener('click', () => showView('view-detail'));

  // ---- Настройки ----
  document.getElementById('btn-open-settings').addEventListener('click', () => {
    renderSettings();
    showView('view-settings');
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
  document.getElementById('btn-export-data').addEventListener('click', exportData);
  document.getElementById('btn-import-data').addEventListener('click', () => {
    document.getElementById('input-import-file').click();
  });
  document.getElementById('input-import-file').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) importDataFromFile(file);
    e.target.value = '';
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', init);
