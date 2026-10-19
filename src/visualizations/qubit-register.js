// Registro de n qubits: prepara cada qubit (o un estado GHZ entrelazado), mira
// las 2ⁿ amplitudes y mide. Convenio de Qiskit: el qubit 0 a la derecha.

import { h, clear } from '../utils/dom.js';
import { productState, ghzState, basisLabel, sampleIndex } from '../utils/qubit.js';

const R = Math.SQRT1_2;
const PREPS = { '|0⟩': [1, 0], '|1⟩': [0, 1], '|+⟩': [R, R], '|−⟩': [R, -R] };
const CHALLENGES = [
  { text: 'Con 3 qubits, que solo pueda salir el número 6', check: (n, s) => n === 3 && s[6] ** 2 > 0.999 },
  { text: 'Con 4 qubits, que solo puedan salir 0101 y 0111, mitad y mitad', check: (n, s) => n === 4 && Math.abs(s[5] ** 2 - 0.5) < 1e-9 && Math.abs(s[7] ** 2 - 0.5) < 1e-9 },
  { text: 'Con 4 qubits, que las 16 combinaciones sean igual de probables', check: (n, s) => n === 4 && s.every((a) => Math.abs(a * a - 1 / 16) < 1e-9) },
];
const pct = (p) => `${(p * 100).toLocaleString('es', { maximumFractionDigits: 1 })} %`;

export function mount(root, { n: n0 = 2 } = {}) {
  let n = n0, ghz = false, counts = null, last = null;
  let preps = Array(5).fill('|0⟩');
  const solved = new Set();
  const nChips = [1, 2, 3, 4, 5].map((k) => h('button', { type: 'button', class: 'chip', onclick: () => { n = k; reset(); } }, String(k)));
  const ghzBox = h('input', { type: 'checkbox', onchange: (e) => { ghz = e.target.checked; reset(); } });
  const qubitRow = h('div', { class: 'qr-qubits' });
  const info = h('p', { class: 'widget-stats' });
  const table = h('div', { class: 'qr-table', role: 'table' });
  const chal = h('ul', { class: 'ab-challenges' });

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Qubits'), nChips,
      h('label', { class: 'small ql-inside' }, ghzBox, ' Entrelazarlos todos (estado GHZ)')),
    qubitRow, info,
    h('div', { class: 'btn-row' },
      h('button', { type: 'button', class: 'btn primary', onclick: () => { last = sampleIndex(state()); render(); } }, 'Medir 1 vez'),
      h('button', { type: 'button', class: 'btn', onclick: () => {
        counts = counts ?? new Array(2 ** n).fill(0);
        for (let i = 0; i < 100; i += 1) counts[sampleIndex(state())] += 1;
        render();
      } }, 'Medir 100 veces')),
    table,
    h('p', { class: 'te-quiz-title' }, 'Retos:'), chal);

  const state = () => (ghz ? ghzState(n) : productState(preps.slice(0, n).map((p) => PREPS[p])));
  function reset() { counts = null; last = null; render(); }

  function render() {
    nChips.forEach((b, k) => b.setAttribute('aria-pressed', String(k + 1 === n)));
    clear(qubitRow);
    // Se muestran como en la cadena: el qubit n−1 a la izquierda y el 0 a la derecha.
    for (let q = n - 1; q >= 0; q -= 1) {
      qubitRow.append(h('div', { class: `qr-qubit ${ghz ? 'off' : ''}` },
        h('span', { class: 'widget-label' }, `qubit ${q}`),
        h('div', { class: 'qr-preps', role: 'group', 'aria-label': `Preparación del qubit ${q}` },
          Object.keys(PREPS).map((p) => h('button', { type: 'button', class: 'chip mono', disabled: ghz, 'aria-pressed': String(!ghz && preps[q] === p), onclick: () => { preps[q] = p; reset(); } }, p)))));
    }
    const s = state();
    info.textContent = `${n} qubit${n > 1 ? 's' : ''}: ${2 ** n} estados base y ${2 ** n} amplitudes. Al medir se obtienen solo ${n} bit${n > 1 ? 's' : ''}.${ghz ? ' Estado entrelazado: no se puede describir qubit por qubit.' : ''}`;

    clear(table);
    const total = counts ? counts.reduce((p, c) => p + c, 0) : 0;
    table.append(h('div', { class: 'qr-row head', role: 'row' }, ['Estado base', 'En decimal', 'Amplitud', 'Probabilidad', counts ? `Veces (de ${total})` : ''].map((t) => h('span', { role: 'columnheader' }, t))));
    s.forEach((a, x) => {
      if (n === 5 && Math.abs(a) < 1e-12 && !(counts && counts[x])) return; // con 32 filas se ocultan las nulas
      table.append(h('div', { class: `qr-row ${last === x ? 'hit' : ''} ${Math.abs(a) < 1e-12 ? 'zero' : ''}`, role: 'row' },
        h('span', { class: 'mono' }, `|${basisLabel(x, n)}⟩`),
        h('span', { class: 'mono' }, String(x)),
        h('span', { class: 'qr-amp' }, h('i', { class: a < 0 ? 'neg' : '', style: { width: `${Math.abs(a) * 100}%` } }), h('b', { class: 'mono' }, (Math.abs(a) < 1e-12 ? 0 : a).toFixed(3).replace('-', '−'))),
        h('span', { class: 'mono' }, pct(a * a)),
        h('span', { class: 'mono' }, counts ? String(counts[x]) : '')));
    });
    if (n === 5) table.append(h('p', { class: 'small muted' }, 'Con 5 qubits se ocultan los estados base de amplitud 0.'));
    if (last !== null) table.append(h('p', { 'aria-live': 'polite' }, `Última medición: ${basisLabel(last, n)} (el número ${last}).`));

    clear(chal);
    CHALLENGES.forEach((c, k) => {
      if (!ghz && c.check(n, s)) solved.add(k);
      chal.append(h('li', { class: solved.has(k) ? 'ok' : '' }, `${solved.has(k) ? '✓' : '○'} ${c.text}`));
    });
  }
  render();
}
