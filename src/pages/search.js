import { h } from '../utils/dom.js';
import { search } from '../components/search.js';
import { breadcrumbs, setTitle } from '../components/ui.js';

export function render(main, [raw = '']) {
  const q = decodeURIComponent(raw);
  setTitle(`Búsqueda: ${q}`);
  const results = search(q, 100);
  const groups = new Map();
  results.forEach((r) => {
    if (!groups.has(r.kind)) groups.set(r.kind, []);
    groups.get(r.kind).push(r);
  });

  main.append(h('div', { class: 'page' },
    breadcrumbs([['Inicio', '#/'], ['Búsqueda']]),
    h('h1', {}, `Resultados para «${q}»`),
    h('p', { class: 'muted' }, results.length ? `${results.length} resultado${results.length > 1 ? 's' : ''}.` : 'No se encontraron resultados. Prueba con otro término o consulta la biblioteca.'),
    [...groups].map(([kind, items]) => [
      h('h2', {}, kind),
      h('ul', { class: 'toc-list' }, items.map((r) => h('li', {}, h('a', { class: 'toc-row', href: r.href },
        h('span', { class: 'num' }, '→'),
        h('span', { class: 'title' }, r.title, h('span', { class: 'desc' }, r.snippet)),
        h('span', { class: 'meta' }))))),
    ]),
  ));
}
