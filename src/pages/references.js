import { h, clear } from '../utils/dom.js';
import { normalize } from '../utils/text.js';
import { referenceList, formatReference, SOURCE_TYPES, TOPICS } from '../../references/references.js';
import { availableLessons } from '../../content/curriculum.js';
import { breadcrumbs, setTitle } from '../components/ui.js';

export async function render(main, [focus]) {
  setTitle('Referencias');
  let topic = 'todas';
  const list = h('div');
  const input = h('input', { type: 'search', class: 'filter-input', placeholder: 'Filtrar por autor, título o año…', 'aria-label': 'Filtrar referencias', oninput: () => update() });
  const chips = [['todas', 'Todas'], ...Object.entries(TOPICS)].map(([id, label]) =>
    h('button', { type: 'button', class: 'chip', dataset: { topic: id }, onclick: () => { topic = id; update(); } }, label));

  main.append(h('div', { class: 'page' },
    breadcrumbs([['Inicio', '#/'], ['Referencias']]),
    h('h1', {}, 'Referencias académicas'),
    h('p', { class: 'lede' }, 'Fuentes reales que respaldan el contenido de la plataforma: artículos originales, libros académicos, estándares y documentación oficial.'),
    h('aside', { class: 'callout note' },
      h('div', { class: 'callout-title' }, 'Política de referencias'),
      h('p', {}, 'Cada referencia indica cómo y cuándo se verificaron sus metadatos (DOI resuelto en Crossref, ISBN en Open Library o enlace oficial comprobado) y qué afirmaciones respalda. No se incluyen referencias que no se hayan podido verificar; si alguna vez fuera necesario citar una fuente no verificada, aparecerá marcada como tal. La bibliografía especializada en ingeniería de software cuántico y seguridad de plataformas se incorporará en las etapas 7 y 8, tras su revisión.')),
    input,
    h('div', { class: 'filter-bar', role: 'group', 'aria-label': 'Temas' }, chips),
    list));

  // Qué lecciones publicadas citan cada referencia.
  const citedBy = {};
  await Promise.all(availableLessons().map(async (l) => {
    try {
      const content = (await l.load()).default;
      (content.references || []).forEach(({ key }) => { (citedBy[key] ||= []).push(l); });
    } catch { /* lección no cargable: se omite */ }
  }));

  function update() {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.topic === topic)));
    const q = normalize(input.value);
    const items = referenceList
      .filter((r) => topic === 'todas' || r.topics.includes(topic))
      .filter((r) => !q || normalize(`${r.authors.join(' ')} ${r.title} ${r.year ?? ''} ${r.container ?? ''}`).includes(q))
      .sort((a, b) => a.authors[0].localeCompare(b.authors[0], 'es') || (a.year ?? 0) - (b.year ?? 0));
    clear(list);
    if (!items.length) { list.append(h('p', { class: 'muted' }, 'Ninguna referencia coincide.')); return; }
    list.append(h('ol', { class: 'ref-list' }, items.map((r) => h('li', { class: `ref-item${r.key === focus ? ' highlight' : ''}`, id: `ref-${r.key}` },
      h('div', { html: formatReference(r) }),
      r.note ? h('p', { class: 'ref-note muted' }, r.note) : null,
      r.supports ? h('p', { class: 'ref-note' }, h('b', {}, 'Respalda: '), r.supports) : null,
      h('div', { class: 'ref-meta' },
        h('span', { class: 'badge' }, SOURCE_TYPES[r.type]),
        r.topics.map((t) => h('span', { class: 'badge' }, TOPICS[t])),
        h('span', { class: `badge ${r.verification?.status === 'verificado' ? 'verified' : 'unverified'}` },
          r.verification?.status === 'verificado' ? `Verificada · ${r.verification.method} · ${r.verification.date}` : 'Sin verificar')),
      citedBy[r.key] ? h('p', { class: 'ref-note muted' }, 'Citada en: ', citedBy[r.key].map((l, i) => [i ? ', ' : '', h('a', { href: `#/leccion/${l.id}` }, `${l.number} ${l.title}`)])) : null))));
  }
  update();
  if (focus) requestAnimationFrame(() => document.getElementById(`ref-${focus}`)?.scrollIntoView({ block: 'center' }));
}
