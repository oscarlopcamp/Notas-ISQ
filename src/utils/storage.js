// Persistencia local del progreso y las preferencias del lector.
// Todo acceso a localStorage va protegido: en modo privado o con el
// almacenamiento bloqueado la plataforma sigue funcionando en memoria.

const KEY = 'isq.v1';

const DEFAULTS = {
  completed: {},      // { lessonId: ISO date }
  favorites: [],      // [lessonId]
  visited: {},        // { lessonId: ISO date }
  lastLesson: null,
  level: 'todo',      // nivel de profundidad preferido
  theme: 'auto',
  fontScale: 1,
};

let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return { ...DEFAULTS, ...(raw ? JSON.parse(raw) : {}) };
  } catch {
    return { ...DEFAULTS };
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* sin almacenamiento disponible: se conserva en memoria */
  }
  listeners.forEach((fn) => fn(state));
}

export const store = {
  get: () => state,
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  set(patch) {
    state = { ...state, ...patch };
    save();
  },
  isCompleted: (id) => Boolean(state.completed[id]),
  toggleCompleted(id) {
    const completed = { ...state.completed };
    if (completed[id]) delete completed[id];
    else completed[id] = new Date().toISOString();
    store.set({ completed });
  },
  isFavorite: (id) => state.favorites.includes(id),
  toggleFavorite(id) {
    const favorites = store.isFavorite(id)
      ? state.favorites.filter((f) => f !== id)
      : [...state.favorites, id];
    store.set({ favorites });
  },
  markVisited(id) {
    store.set({ visited: { ...state.visited, [id]: new Date().toISOString() }, lastLesson: id });
  },
  reset() {
    state = { ...DEFAULTS, theme: state.theme, fontScale: state.fontScale };
    save();
  },
  exportJSON: () => JSON.stringify(state, null, 2),
};
