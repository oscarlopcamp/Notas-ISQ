// Búsqueda global sobre lecciones (incluidas las pendientes), glosario,
// biblioteca de conceptos, referencias y simuladores.

import { h, clear } from '../utils/dom.js';
import { normalize, stripMarkup } from '../utils/text.js';
import { lessons, moduleById } from '../../content/curriculum.js';
import { glossary } from '../../content/glossary.js';
import { concepts } from '../../content/library.js';
import { referenceList, citationLabel } from '../../references/references.js';
import { widgets } from '../visualizations/registry.js';

let index = null;

function buildIndex() {
  const items = [];
  lessons.forEach((l) => items.push({
    kind: l.status === 'disponible' ? 'Lección' : 'Lección (pendiente)',
    title: `${l.number} ${l.title}`,
    snippet: `${moduleById(l.moduleId).title} · ${l.topics.join(', ')}`,
    href: `#/leccion/${l.id}`,
    text: [l.title, l.topics.join(' '), l.unitTitle].join(' '),
    weight: l.status === 'disponible' ? 3 : 1,
  }));
  glossary.forEach((g) => items.push({
    kind: 'Glosario', title: g.term, snippet: stripMarkup(g.short), href: `#/glosario/${g.id}`,
    text: `${g.term} ${stripMarkup(g.short)} ${stripMarkup(g.definition)}`, weight: 3,
  }));
  concepts.forEach((c) => items.push({
    kind: 'Biblioteca', title: c.q, snippet: c.tags.join(', '), href: `#/leccion/${c.lesson}`,
    text: `${c.q} ${c.tags.join(' ')}`, weight: 2,
  }));
  referenceList.forEach((r) => items.push({
    kind: 'Referencia', title: r.title, snippet: citationLabel(r), href: `#/referencias/${r.key}`,
    text: `${r.title} ${r.authors.join(' ')} ${r.year ?? ''} ${r.supports ?? ''}`, weight: 1,
  }));
  Object.entries(widgets).forEach(([id, w]) => items.push({
    kind: 'Simulador', title: w.title, snippet: w.description, href: `#/simulador/${id}`,
    text: `${w.title} ${w.description}`, weight: 2,
  }));
  return items.map((it) => ({ ...it, haystack: normalize(it.text), titleN: normalize(it.title) }));
}

export function search(query, limit = 50) {
  if (!index) index = buildIndex();
  const terms = normalize(query).split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [];
  return index
    .filter((it) => terms.every((t) => it.haystack.includes(t) || it.titleN.includes(t)))
    .map((it) => ({ ...it, score: it.weight + terms.filter((t) => it.titleN.includes(t)).length * 3 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Conecta el cuadro de búsqueda de la barra superior. */
export function setupSearch(input, panel) {
  let results = [];
  let selected = -1;

  const close = () => { panel.hidden = true; input.setAttribute('aria-expanded', 'false'); selected = -1; };

  function render() {
    clear(panel);
    const q = input.value.trim();
    if (q.length < 2) { close(); return; }
    results = search(q, 8);
    panel.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    if (!results.length) {
      panel.append(h('div', { class: 'search-empty' }, 'Sin resultados.'));
      return;
    }
    results.forEach((r, i) => panel.append(h('a', {
      class: 'search-result', href: r.href, role: 'option', 'aria-selected': String(i === selected),
      onclick: () => { close(); input.value = ''; },
    }, h('span', { class: 'kind' }, r.kind), h('div', {}, r.title), h('span', { class: 'snippet' }, r.snippet))));
    panel.append(h('a', { class: 'search-result', href: `#/buscar/${encodeURIComponent(q)}`, onclick: close }, 'Ver todos los resultados →'));
  }

  input.addEventListener('input', () => { selected = -1; render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!results.length) return;
      selected = (selected + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length;
      render();
    } else if (e.key === 'Enter') {
      const q = input.value.trim();
      if (!q) return;
      location.hash = selected >= 0 ? results[selected].href : `#/buscar/${encodeURIComponent(q)}`;
      close();
      input.value = '';
      input.blur();
    } else if (e.key === 'Escape') {
      close();
    }
  });
  document.addEventListener('click', (e) => { if (!panel.contains(e.target) && e.target !== input) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
      e.preventDefault();
      input.focus();
    }
  });
}
