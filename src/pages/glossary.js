import { h, clear } from '../utils/dom.js';
import { inline, normalize, stripMarkup } from '../utils/text.js';
import { glossary, glossaryById } from '../../content/glossary.js';
import { lessonById } from '../../content/curriculum.js';
import { breadcrumbs, setTitle } from '../components/ui.js';

export function render(main, [focus]) {
  setTitle(focus && glossaryById[focus] ? `${glossaryById[focus].term} (glosario)` : 'Glosario');
  const list = h('div');
  const input = h('input', { type: 'search', class: 'filter-input', placeholder: 'Filtrar términos…', 'aria-label': 'Filtrar términos', oninput: () => update() });

  main.append(h('div', { class: 'page' },
    breadcrumbs([['Inicio', '#/'], ['Glosario']]),
    h('h1', {}, 'Glosario'),
    h('p', { class: 'lede' }, 'Definiciones breves de los términos desarrollados en las lecciones publicadas. Cada entrada enlaza con la lección donde se explica con calma.'),
    input, list));

  function update() {
    const q = normalize(input.value);
    const items = [...glossary]
      .sort((a, b) => a.term.localeCompare(b.term, 'es'))
      .filter((g) => !q || normalize(`${g.term} ${stripMarkup(g.definition)}`).includes(q));
    clear(list);
    let letter = '';
    items.forEach((g) => {
      const first = normalize(g.term[0]).toUpperCase();
      if (first !== letter) { letter = first; list.append(h('h2', { class: 'glossary-letter' }, letter)); }
      const lesson = lessonById(g.lesson);
      list.append(h('dl', { class: `glossary-entry${g.id === focus ? ' highlight' : ''}`, id: `term-${g.id}` },
        h('dt', {}, g.term),
        h('dd', { html: inline(g.definition) }),
        h('dd', { class: 'see-also' },
          lesson ? h('span', { html: `Lección: ${inline(`[[>${lesson.id}|${lesson.number} ${lesson.title}]]`)}` }) : null,
          g.related?.length ? h('span', { html: ` · Relacionados: ${g.related.map((r) => inline(`[[${r}]]`)).join(', ')}` }) : null)));
    });
    if (!items.length) list.append(h('p', { class: 'muted' }, 'Ningún término coincide.'));
  }
  update();
  if (focus) requestAnimationFrame(() => document.getElementById(`term-${focus}`)?.scrollIntoView({ block: 'center' }));
}
