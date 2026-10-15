// Juego de emparejar: cada ket con su lista de dos amplitudes.

import { h, clear } from '../utils/dom.js';

const PAIRS = [
  ['|0⟩', '[1, 0]'],
  ['|1⟩', '[0, 1]'],
  ['0,6|0⟩ + 0,8|1⟩', '[0.6, 0.8]'],
  ['0,8|0⟩ − 0,6|1⟩', '[0.8, −0.6]'],
  ['|+⟩ = (|0⟩ + |1⟩) / √2', '[0.707, 0.707]'],
  ['|−⟩ = (|0⟩ − |1⟩) / √2', '[0.707, −0.707]'],
];
const ORDER = [3, 0, 5, 2, 4, 1]; // orden fijo y mezclado de la columna derecha

export function mount(root) {
  let picked = null, wrong = null, tries = 0;
  const done = new Set();
  const left = h('div', { class: 'km-col', role: 'group', 'aria-label': 'Kets' });
  const right = h('div', { class: 'km-col', role: 'group', 'aria-label': 'Listas de amplitudes' });
  const msg = h('p', { class: 'widget-stats', 'aria-live': 'polite' });
  root.append(
    h('p', { class: 'small' }, 'Pulsa un ket de la izquierda y después la lista de amplitudes [para el 0, para el 1] que le corresponde.'),
    h('div', { class: 'km-grid' }, left, right), msg,
    h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn', onclick: () => { done.clear(); picked = null; wrong = null; tries = 0; render(); } }, 'Empezar de nuevo')));

  function choose(k) {
    if (picked === null || done.has(k)) return;
    tries += 1;
    if (k === picked) { done.add(k); wrong = null; } else { wrong = k; }
    picked = null;
    render();
  }

  function render() {
    clear(left); clear(right);
    PAIRS.forEach(([ket], k) => left.append(h('button', {
      type: 'button', class: `km-item mono ${done.has(k) ? 'ok' : ''} ${picked === k ? 'picked' : ''}`,
      disabled: done.has(k), 'aria-pressed': String(picked === k),
      onclick: () => { picked = k; wrong = null; render(); },
    }, ket)));
    ORDER.forEach((k) => right.append(h('button', {
      type: 'button', class: `km-item mono ${done.has(k) ? 'ok' : ''} ${wrong === k ? 'bad' : ''}`,
      disabled: done.has(k), onclick: () => choose(k),
    }, PAIRS[k][1])));
    msg.textContent = done.size === PAIRS.length
      ? `¡Completado en ${tries} intentos! Un ket es solo otra forma de escribir la lista [amplitud del 0, amplitud del 1].`
      : wrong !== null ? 'Esa no es. Pista: el primer número acompaña a |0⟩ y el segundo a |1⟩.'
        : picked !== null ? 'Ahora elige su lista de amplitudes.' : `${done.size} de ${PAIRS.length} parejas.`;
  }
  render();
}
