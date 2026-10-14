// Menú lateral: índice completo del libro con estado de cada lección.

import { h, clear } from '../utils/dom.js';
import { modules, lessonById } from '../../content/curriculum.js';
import { store } from '../utils/storage.js';

const EXTRA = [
  ['#/biblioteca', 'Biblioteca'],
  ['#/tutoriales', 'Tutoriales'],
  ['#/simuladores', 'Simuladores'],
  ['#/glosario', 'Glosario'],
  ['#/referencias', 'Referencias'],
  ['#/progreso', 'Mi progreso'],
];

export function renderSidebar(nav, route) {
  const currentLesson = route.name === 'leccion' ? lessonById(route.params[0]) : null;
  const currentModule = route.name === 'modulo' ? route.params[0] : currentLesson?.moduleId;
  const href = `#${route.path}`;

  clear(nav);
  nav.append(link('#/', 'Inicio', href === '#/'));
  nav.append(h('div', { class: 'nav-section-label' }, 'Ruta guiada'));

  modules.forEach((mod) => {
    const details = h('details', { class: 'nav-module', open: mod.id === currentModule });
    details.append(h('summary', {}, h('span', { class: 'nav-num' }, mod.number), h('span', {}, mod.title)));
    const body = h('div', { class: 'nav-module-body' },
      link(`#/modulo/${mod.id}`, 'Presentación del módulo', href === `#/modulo/${mod.id}`));
    mod.units.forEach((unit) => {
      body.append(h('div', { class: 'nav-unit' }, unit.title));
      unit.lessons.forEach((lesson) => {
        const state = store.isCompleted(lesson.id) ? 'done' : lesson.status === 'disponible' ? 'available' : 'pending';
        const label = lesson.status === 'pendiente' ? `${lesson.title} (pendiente)` : lesson.title;
        body.append(h('a', {
          class: `nav-link nav-lesson ${state}`,
          href: `#/leccion/${lesson.id}`,
          'aria-current': currentLesson?.id === lesson.id ? 'page' : null,
          title: label,
        }, h('span', { class: 'dot', 'aria-hidden': 'true' }), h('span', {}, lesson.title),
        h('span', { class: 'visually-hidden' }, state === 'done' ? ' (completada)' : state === 'pending' ? ' (pendiente)' : '')));
      });
    });
    details.append(body);
    nav.append(details);
  });

  nav.append(h('div', { class: 'nav-section-label' }, 'Consulta'));
  EXTRA.forEach(([to, label]) => nav.append(link(to, label, href.startsWith(to))));

  nav.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest' });
}

function link(to, label, current) {
  return h('a', { class: 'nav-link', href: to, 'aria-current': current ? 'page' : null }, label);
}
