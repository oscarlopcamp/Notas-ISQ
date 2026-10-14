// Piezas de interfaz compartidas entre páginas.

import { h } from '../utils/dom.js';
import { store } from '../utils/storage.js';
import { lessons, lessonsOfModule } from '../../content/curriculum.js';

export function breadcrumbs(items) {
  return h('nav', { class: 'breadcrumbs', 'aria-label': 'Ruta de navegación' },
    h('ol', {}, items.map(([label, href], i) => h('li', {},
      href && i < items.length - 1 ? h('a', { href }, label) : h('span', { 'aria-current': i === items.length - 1 ? 'page' : null }, label)))));
}

export function statusBadge(lesson) {
  if (store.isCompleted(lesson.id)) return h('span', { class: 'badge done' }, '✓ Completada');
  return lesson.status === 'disponible'
    ? h('span', { class: 'badge available' }, 'Disponible')
    : h('span', { class: 'badge pending' }, 'Pendiente');
}

export function progressBar(done, total, label) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return h('div', { class: 'progress-bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct), 'aria-label': label },
    h('span', { style: { width: `${pct}%` } }));
}

export function moduleProgress(moduleId) {
  const all = lessonsOfModule(moduleId);
  return {
    total: all.length,
    available: all.filter((l) => l.status === 'disponible').length,
    done: all.filter((l) => store.isCompleted(l.id)).length,
  };
}

/** Siguiente lección recomendada en la ruta guiada: la primera disponible no completada. */
export function recommendedLesson() {
  return lessons.find((l) => l.status === 'disponible' && !store.isCompleted(l.id))
    || lessons.find((l) => l.status === 'pendiente');
}

export function lessonRow(lesson, extra = null) {
  return h('li', {}, h('a', { class: 'toc-row', href: `#/leccion/${lesson.id}` },
    h('span', { class: 'num' }, lesson.number),
    h('span', { class: 'title' }, lesson.title, h('span', { class: 'desc' }, extra ?? lesson.topics.join(' · '))),
    h('span', { class: 'meta' }, statusBadge(lesson))));
}

export function setTitle(title) {
  document.title = title ? `${title} — Ingeniería de Software Cuántico` : 'Ingeniería de Software Cuántico — Libro interactivo';
}
