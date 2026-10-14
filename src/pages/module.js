import { h } from '../utils/dom.js';
import { moduleById, modules } from '../../content/curriculum.js';
import { breadcrumbs, lessonRow, moduleProgress, progressBar, setTitle } from '../components/ui.js';
import { store } from '../utils/storage.js';

export function render(main, [id]) {
  const mod = moduleById(id);
  if (!mod) {
    main.append(h('div', { class: 'page' }, h('h1', {}, 'Módulo no encontrado'), h('a', { href: '#/' }, 'Volver al inicio')));
    return;
  }
  setTitle(mod.fullTitle);
  const p = moduleProgress(id);
  const first = mod.units.flatMap((u) => u.lessons).find((l) => l.status === 'disponible' && !store.isCompleted(l.id));
  const idx = modules.indexOf(mod);

  main.append(h('div', { class: 'page' },
    breadcrumbs([['Inicio', '#/'], [`Módulo ${mod.number}`]]),
    h('div', { class: 'eyebrow' }, `Módulo ${mod.number}`),
    h('h1', {}, mod.fullTitle),
    h('p', { class: 'lede' }, mod.objective),
    h('div', { class: 'sans muted', style: { fontSize: '0.85rem', margin: '1rem 0 0.4rem' } },
      `${p.done} de ${p.total} lecciones completadas · ${p.available} disponibles`),
    progressBar(p.done, p.total, `Progreso del módulo ${mod.number}`),
    first ? h('div', { class: 'btn-row' }, h('a', { class: 'btn primary', href: `#/leccion/${first.id}` }, `Continuar: ${first.title}`)) : null,
    p.available === 0 ? h('p', { class: 'pending-note', style: { marginTop: '1.5rem' } }, 'Este módulo está en preparación. Su índice muestra los temas previstos; las lecciones se publicarán cuando su contenido esté desarrollado y verificado.') : null,
    mod.units.map((unit) => [
      h('h2', {}, unit.title),
      h('ul', { class: 'toc-list' }, unit.lessons.map((l) => lessonRow(l))),
    ]),
    h('nav', { class: 'next-lesson', 'aria-label': 'Otros módulos' },
      modules[idx - 1] ? h('a', { href: `#/modulo/${modules[idx - 1].id}` }, h('small', {}, '← Módulo anterior'), modules[idx - 1].fullTitle) : h('span'),
      modules[idx + 1] ? h('a', { class: 'next', href: `#/modulo/${modules[idx + 1].id}` }, h('small', {}, 'Módulo siguiente →'), modules[idx + 1].fullTitle) : null),
  ));
}
