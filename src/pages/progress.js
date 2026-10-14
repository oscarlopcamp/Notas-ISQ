import { h } from '../utils/dom.js';
import { store } from '../utils/storage.js';
import { modules, lessons, lessonById, availableLessons } from '../../content/curriculum.js';
import { breadcrumbs, moduleProgress, progressBar, recommendedLesson, setTitle } from '../components/ui.js';

export function render(main) {
  setTitle('Mi progreso');
  const s = store.get();
  const done = lessons.filter((l) => store.isCompleted(l.id));
  const available = availableLessons();
  const rec = recommendedLesson();
  const visited = Object.entries(s.visited).sort((a, b) => b[1].localeCompare(a[1])).slice(0, 5).map(([id]) => lessonById(id)).filter(Boolean);
  const favorites = s.favorites.map(lessonById).filter(Boolean);

  main.append(h('div', { class: 'page' },
    breadcrumbs([['Inicio', '#/'], ['Mi progreso']]),
    h('h1', {}, 'Mi progreso'),
    h('p', { class: 'muted' }, 'El progreso se guarda solo en este navegador (almacenamiento local). No se envía a ningún servidor.'),
    h('div', { class: 'stat-row' },
      h('div', { class: 'stat' }, h('b', {}, done.length), h('span', {}, 'lecciones completadas')),
      h('div', { class: 'stat' }, h('b', {}, `${available.length ? Math.round((done.filter((l) => l.status === 'disponible').length / available.length) * 100) : 0} %`), h('span', {}, 'del contenido publicado')),
      h('div', { class: 'stat' }, h('b', {}, `${Math.round((done.length / lessons.length) * 100)} %`), h('span', {}, `del programa completo (${lessons.length} lecciones)`))),

    h('h2', {}, 'Siguiente paso recomendado'),
    rec ? h('p', {}, h('a', { class: 'btn primary', href: `#/leccion/${rec.id}` }, `${rec.number} ${rec.title}`),
      rec.status === 'pendiente' ? h('span', { class: 'muted' }, '  Has completado todo el contenido publicado; esta es la próxima lección prevista.') : null)
      : h('p', {}, '¡Has completado todo el programa!'),

    h('h2', {}, 'Por módulo'),
    h('ul', { class: 'toc-list' }, modules.map((m) => {
      const p = moduleProgress(m.id);
      return h('li', {}, h('a', { class: 'toc-row', href: `#/modulo/${m.id}` },
        h('span', { class: 'num' }, m.number),
        h('span', { class: 'title' }, m.fullTitle, h('span', { class: 'desc' }, `${p.done}/${p.total} completadas · ${p.available} disponibles`), progressBar(p.done, p.total, m.title)),
        h('span', { class: 'meta' })));
    })),

    h('h2', {}, 'Favoritos'),
    favorites.length ? h('ul', {}, favorites.map((l) => h('li', {}, h('a', { href: `#/leccion/${l.id}` }, `${l.number} ${l.title}`))))
      : h('p', { class: 'muted' }, 'Aún no has marcado lecciones como favoritas. Usa el botón «Añadir a favoritos» en cualquier lección.'),

    h('h2', {}, 'Visitadas recientemente'),
    visited.length ? h('ul', {}, visited.map((l) => h('li', {}, h('a', { href: `#/leccion/${l.id}` }, `${l.number} ${l.title}`))))
      : h('p', { class: 'muted' }, 'Todavía no has abierto ninguna lección.'),

    h('h2', {}, 'Datos'),
    h('div', { class: 'btn-row' },
      h('button', {
        type: 'button', class: 'btn',
        onclick: () => {
          const url = URL.createObjectURL(new Blob([store.exportJSON()], { type: 'application/json' }));
          const a = h('a', { href: url, download: 'progreso-isq.json' });
          document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        },
      }, 'Exportar progreso (JSON)'),
      h('button', {
        type: 'button', class: 'btn',
        onclick: () => {
          if (confirm('¿Borrar el progreso, los favoritos y el historial de este navegador?')) { store.reset(); location.hash = '#/progreso'; dispatchEvent(new HashChangeEvent('hashchange')); }
        },
      }, 'Reiniciar progreso')),
  ));
}
