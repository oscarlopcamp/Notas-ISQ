// Biblioteca de consulta: acceso directo a conceptos, con búsqueda y categorías.

import { h, clear } from '../utils/dom.js';
import { normalize } from '../utils/text.js';
import { concepts } from '../../content/library.js';
import { modules, lessonById, moduleById } from '../../content/curriculum.js';
import { glossaryById } from '../../content/glossary.js';
import { breadcrumbs, statusBadge, setTitle } from '../components/ui.js';

export function render(main) {
  setTitle('Biblioteca');
  let category = 'todas';
  let query = '';

  const list = h('div');
  const input = h('input', { type: 'search', class: 'filter-input', placeholder: 'Filtrar preguntas…', 'aria-label': 'Filtrar preguntas', oninput: (e) => { query = e.target.value; update(); } });
  const chips = [['todas', 'Todas'], ...modules.map((m) => [m.id, `${m.number} ${m.title}`])].map(([id, label]) =>
    h('button', { type: 'button', class: 'chip', 'aria-pressed': String(id === category), onclick: () => { category = id; update(); } }, label));

  main.append(h('div', { class: 'page' },
    breadcrumbs([['Inicio', '#/'], ['Biblioteca']]),
    h('h1', {}, 'Biblioteca de consulta'),
    h('p', { class: 'lede' }, 'Accede directamente a un concepto sin seguir la ruta guiada. Cada pregunta lleva a la lección que la desarrolla; si la lección aún no está disponible, verás qué temas cubrirá y qué conviene estudiar antes.'),
    input,
    h('div', { class: 'filter-bar', role: 'group', 'aria-label': 'Categorías' }, chips),
    list,
    h('p', { class: 'muted' }, 'También puedes consultar el ', h('a', { href: '#/glosario' }, 'glosario'), ', las ', h('a', { href: '#/referencias' }, 'referencias'), ' o usar el buscador global (tecla /).'),
  ));

  function update() {
    chips.forEach((c, i) => c.setAttribute('aria-pressed', String((i === 0 ? 'todas' : modules[i - 1].id) === category)));
    const q = normalize(query);
    const items = concepts
      .map((c) => ({ ...c, l: lessonById(c.lesson) }))
      .filter((c) => c.l && (category === 'todas' || c.l.moduleId === category))
      .filter((c) => !q || normalize(`${c.q} ${c.tags.join(' ')}`).includes(q));
    clear(list);
    if (!items.length) { list.append(h('p', { class: 'muted' }, 'Ninguna pregunta coincide con el filtro.')); return; }
    const byModule = new Map();
    items.forEach((c) => {
      if (!byModule.has(c.l.moduleId)) byModule.set(c.l.moduleId, []);
      byModule.get(c.l.moduleId).push(c);
    });
    byModule.forEach((group, mid) => {
      const mod = moduleById(mid);
      list.append(h('h2', {}, `${mod.number} · ${mod.title}`),
        h('ul', { class: 'toc-list' }, group.map((c) => h('li', {}, h('a', { class: 'toc-row', href: `#/leccion/${c.lesson}` },
          h('span', { class: 'num' }, c.l.number),
          h('span', { class: 'title' }, c.q, h('span', { class: 'desc' }, `Lección: ${c.l.title}${c.term && glossaryById[c.term] ? ` · Glosario: ${glossaryById[c.term].term}` : ''}`)),
          h('span', { class: 'meta' }, statusBadge(c.l)))))));
    });
  }
  update();
}
