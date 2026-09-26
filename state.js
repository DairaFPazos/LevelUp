const KEY = 'levelup-life';
const initial = () => ({
  onboard: true,
  name: '',
  xp: 0,
  energy: 70,
  mood: 'good',
  checkins: {},
  completed: {},
  goals: [],
  achievements: [],
  boss: null,
  defeatedBosses: []
});

const numberOr = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export function today() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (!raw || typeof raw !== 'object') return initial();
    const s = { ...initial(), ...raw };
    s.xp = Math.max(0, Math.floor(numberOr(s.xp)));
    s.energy = Math.min(100, Math.max(1, Math.floor(numberOr(s.energy, 70))));
    s.checkins = s.checkins && typeof s.checkins === 'object' ? s.checkins : {};
    s.completed = s.completed && typeof s.completed === 'object' ? s.completed : {};
    s.goals = Array.isArray(s.goals) ? s.goals : [];
    s.achievements = Array.isArray(s.achievements) ? s.achievements : [];
    s.defeatedBosses = Array.isArray(s.defeatedBosses) ? s.defeatedBosses : [];
    if (s.name === 'Nia') { s.name = ''; s.onboard = true; }
    return s;
  } catch {
    return initial();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(KEY);
}

export function safeAdd(value, amount) {
  return numberOr(value) + numberOr(amount);
}
