// Línea de tiempo filtrable de la computación cuántica (datos en content/module-02).

import { h, clear } from '../utils/dom.js';
import { inline } from '../utils/text.js';
import { EVENTS, CATEGORIES } from '../../content/module-02/historia-datos.js';
import { EPISTEMIC } from '../components/blocks.js';

export function mount(root) {
  let filter = 'todas';
  let open = null;
  const chips = [['todas', 'Todos'], ...Object.entries(CATEGORIES)].map(([id, label]) =>
    h('button', { type: 'button', class: `chip tl-chip ${id}`, dataset: { cat: id }, onclick: () => { filter = id; render(); } }, label));
  const list = h('ol', { class: 'tl-list' });
  root.append(h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Mostrar'), chips), list,
    h('p', { class: 'muted small' }, 'Pulsa un hito para ver qué ocurrió, por qué importa y su fuente original.'));

  function render() {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.cat === filter)));
    clear(list);
    let lastDecade = null;
    EVENTS.forEach((ev, i) => {
      if (filter !== 'todas' && ev.cat !== filter) return;
      const decade = Math.floor(ev.year / 10) * 10;
      if (decade !== lastDecade) { list.append(h('li', { class: 'tl-decade' }, `${decade}s`)); lastDecade = decade; }
      const isOpen = open === i;
      list.append(h('li', { class: `tl-item ${ev.cat} ${isOpen ? 'open' : ''}` },
        h('button', { type: 'button', class: 'tl-head', 'aria-expanded': String(isOpen), onclick: () => { open = isOpen ? null : i; render(); } },
          h('span', { class: 'tl-year mono' }, ev.year),
          h('span', { class: 'tl-dot', 'aria-hidden': 'true' }),
          h('span', { class: 'tl-title' }, ev.title, h('small', {}, ev.who))),
        isOpen ? h('div', { class: 'tl-body' },
          h('p', { html: inline(ev.text) }),
          h('p', { html: `<b>Por qué importa:</b> ${inline(ev.why)}` }),
          h('p', { class: 'small' }, h('span', { class: 'epistemic' }, EPISTEMIC[ev.status]), ' ', h('span', { class: 'muted' }, CATEGORIES[ev.cat]), ' · Fuente: ',
            h('span', { html: inline(`[${ev.refs.map((r) => `@${r}`).join('; ')}]`) }))) : null));
    });
  }
  render();
}
