// Punto de entrada: enrutador por hash (compatible con alojamiento estático
// como GitHub Pages), preferencias de lectura y montaje de páginas.

import { store } from '../utils/storage.js';
import { renderSidebar } from '../components/sidebar.js';
import { setupSearch } from '../components/search.js';
import { h, clear } from '../utils/dom.js';

const routes = [
  [/^\/$/, 'inicio', () => import('../pages/home.js')],
  [/^\/modulo\/([\w-]+)$/, 'modulo', () => import('../pages/module.js')],
  [/^\/leccion\/([\w-]+)$/, 'leccion', () => import('../pages/lesson.js')],
  [/^\/biblioteca$/, 'biblioteca', () => import('../pages/library.js')],
  [/^\/tutoriales$/, 'tutoriales', () => import('../pages/tutorials.js')],
  [/^\/simuladores$/, 'simuladores', () => import('../pages/simulators.js')],
  [/^\/simulador\/([\w-]+)$/, 'simulador', () => import('../pages/simulators.js'), 'renderOne'],
  [/^\/glosario(?:\/([\w-]+))?$/, 'glosario', () => import('../pages/glossary.js')],
  [/^\/referencias(?:\/([\w-]+))?$/, 'referencias', () => import('../pages/references.js')],
  [/^\/progreso$/, 'progreso', () => import('../pages/progress.js')],
  [/^\/buscar\/(.*)$/, 'buscar', () => import('../pages/search.js')],
];

const main = document.getElementById('main');
const nav = document.getElementById('sidebar');
let ctx = { cleanups: [] };
let currentRoute = null;
let renderToken = 0;

function parse() {
  const path = (location.hash.replace(/^#/, '') || '/').split('?')[0];
  for (const [re, name, load, fn] of routes) {
    const m = path.match(re);
    if (m) return { name, path, params: m.slice(1).filter((x) => x !== undefined), load, fn: fn || 'render' };
  }
  return { name: 'no-encontrada', path, params: [] };
}

async function navigate() {
  const token = ++renderToken;
  const route = parse();
  ctx.cleanups.forEach((fn) => { try { fn(); } catch { /* ignorar */ } });
  ctx = { cleanups: [] };
  currentRoute = route;
  renderSidebar(nav, route);
  closeSidebar();

  if (!route.load) {
    clear(main).append(h('div', { class: 'page' }, h('h1', {}, 'Página no encontrada'), h('p', {}, h('a', { href: '#/' }, 'Volver al inicio'))));
    return;
  }
  try {
    const page = await route.load();
    if (token !== renderToken) return;
    clear(main);
    await page[route.fn](main, route.params, ctx);
  } catch (err) {
    console.error(err);
    clear(main).append(h('div', { class: 'page' }, h('h1', {}, 'Error al cargar la página'), h('p', {}, String(err.message || err))));
  }
  if (token === renderToken) {
    window.scrollTo(0, 0);
    if (document.activeElement === document.body || nav.contains(document.activeElement)) main.focus({ preventScroll: true });
  }
}

// ---------- Desplazamiento interno (el hash está reservado para las rutas) ----------
document.addEventListener('click', (e) => {
  const scrollLink = e.target.closest('[data-scroll]');
  if (scrollLink) {
    const target = document.getElementById(scrollLink.dataset.scroll);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }
  const cite = e.target.closest('a.cite[data-ref]');
  if (cite) {
    const target = document.getElementById(`ref-${cite.dataset.ref}`);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('highlight');
      setTimeout(() => target.classList.remove('highlight'), 2200);
    }
  }
  if (e.target.closest('[data-skip]')) {
    e.preventDefault();
    main.focus();
  }
});

// ---------- Preferencias de lectura ----------
function applyTheme(theme) {
  if (theme === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
}
document.querySelector('.theme-toggle').addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = dark ? 'light' : 'dark';
  store.set({ theme });
  applyTheme(theme);
});
document.querySelectorAll('[data-font]').forEach((btn) => btn.addEventListener('click', () => {
  const next = Math.min(1.3, Math.max(0.85, Math.round((store.get().fontScale + Number(btn.dataset.font) * 0.075) * 1000) / 1000));
  store.set({ fontScale: next });
  document.documentElement.style.setProperty('--font-scale', next);
}));

// ---------- Menú lateral en pantallas pequeñas ----------
const toggle = document.querySelector('.menu-toggle');
const backdrop = document.querySelector('.sidebar-backdrop');
function closeSidebar() {
  nav.classList.remove('open');
  backdrop.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
}
toggle.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  backdrop.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
});
backdrop.addEventListener('click', closeSidebar);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebar(); });

// El índice refleja inmediatamente las lecciones completadas.
let completedSnapshot = JSON.stringify(store.get().completed);
store.subscribe((state) => {
  const snap = JSON.stringify(state.completed);
  if (snap !== completedSnapshot && currentRoute) renderSidebar(nav, currentRoute);
  completedSnapshot = snap;
});

setupSearch(document.getElementById('global-search'), document.getElementById('search-results'));
applyTheme(store.get().theme);
window.addEventListener('hashchange', navigate);
navigate();
