// Reto de cronología: ordena seis hitos y comprueba el resultado.
// Es práctica de recuperación: intentar recordar antes de mirar la respuesta.

import { h, clear } from '../utils/dom.js';
import { EVENTS } from '../../content/module-02/historia-datos.js';

const SIZE = 6;

function pickEvents(seed) {
  // Elige hitos de años distintos, de forma reproducible para cada «reto».
  let a = seed >>> 0;
  const rand = () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; };
  const pool = [...EVENTS];
  const chosen = [];
  while (chosen.length < SIZE && pool.length) {
    const ev = pool.splice(Math.floor(rand() * pool.length), 1)[0];
    if (!chosen.some((c) => c.year === ev.year)) chosen.push(ev);
  }
  const shuffled = [...chosen].sort(() => rand() - 0.5);
  // Evita que el orden inicial ya sea el correcto
  if (shuffled.every((e, i, arr) => i === 0 || arr[i - 1].year <= e.year)) shuffled.reverse();
  return shuffled;
}

export function mount(root, { seed = 3 } = {}) {
  let round = seed;
  let items = pickEvents(round);
  let checked = false;
  const list = h('ol', { class: 'cq-list' });
  const result = h('p', { class: 'cq-result', 'aria-live': 'polite' });

  root.append(
    h('p', { class: 'small' }, 'Ordena estos hitos del más antiguo al más reciente con las flechas. Después, comprueba.'),
    list,
    h('div', { class: 'btn-row' },
      h('button', { type: 'button', class: 'btn primary', onclick: () => { checked = true; render(); } }, 'Comprobar'),
      h('button', { type: 'button', class: 'btn', onclick: () => { round += 1; items = pickEvents(round); checked = false; render(); } }, 'Nuevo reto')),
    result,
  );

  function move(i, d) {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    [items[i], items[j]] = [items[j], items[i]];
    checked = false;
    render();
  }

  function render() {
    clear(list);
    const sorted = [...items].sort((a, b) => a.year - b.year);
    items.forEach((ev, i) => {
      const ok = sorted[i].year === ev.year;
      list.append(h('li', { class: `cq-item ${checked ? (ok ? 'ok' : 'bad') : ''}` },
        h('span', { class: 'cq-text' }, h('b', {}, ev.title), h('small', {}, ev.who)),
        checked ? h('span', { class: 'cq-year mono' }, ev.year) : null,
        h('span', { class: 'cq-btns' },
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': `Subir «${ev.title}»`, disabled: i === 0, onclick: () => move(i, -1) }, '↑'),
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': `Bajar «${ev.title}»`, disabled: i === items.length - 1, onclick: () => move(i, 1) }, '↓'))));
    });
    if (!checked) { result.textContent = ''; return; }
    const correct = items.filter((ev, i) => sorted[i].year === ev.year).length;
    result.className = `cq-result ${correct === items.length ? 'tc-ok' : 'tc-warn'}`;
    result.textContent = correct === items.length
      ? '¡Orden perfecto! Abre la línea de tiempo para repasar por qué importa cada hito.'
      : `${correct} de ${items.length} en su posición correcta (en verde). Los años ya están a la vista: reordena y vuelve a comprobar.`;
  }
  render();
}
