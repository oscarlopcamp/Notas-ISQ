// Laboratorio: bit frente a qubit. Leer un bit no lo cambia; medir un qubit da
// un resultado aleatorio y lo deja en ese resultado. Para conocer cómo se preparó
// hay que preparar y medir muchas veces.

import { h, clear } from '../utils/dom.js';
import { fromTheta, measure } from '../utils/qubit.js';

const PREPS = [
  ['Siempre 0', 0],
  ['Mitad y mitad', Math.PI / 2],
  ['Casi siempre 1', 2 * Math.asin(Math.sqrt(0.8))],
  ['Siempre 1', Math.PI],
];
const pct = (p) => `${Math.round(p * 100)} %`;

export function mount(root) {
  // Bit clásico
  let bit = 0;
  const bitReads = [];
  const bitValue = h('span', { class: 'ql-value mono' });
  const bitLog = h('p', { class: 'ql-log mono', 'aria-live': 'polite' });
  const setBit = (v) => { bit = v; bitReads.length = 0; renderBit(); };
  const bitCard = h('div', { class: 'ql-card' },
    h('h5', {}, 'Bit clásico'),
    h('div', { class: 'btn-row' },
      h('button', { type: 'button', class: 'btn', onclick: () => setBit(0) }, 'Guardar 0'),
      h('button', { type: 'button', class: 'btn', onclick: () => setBit(1) }, 'Guardar 1'),
      h('button', { type: 'button', class: 'btn primary', onclick: () => { bitReads.push(bit); renderBit(); } }, 'Leer')),
    h('p', {}, 'Valor guardado: ', bitValue),
    bitLog);

  // Qubit
  let prep = 1, state = fromTheta(PREPS[1][1]), measured = null, history = [], showInside = false;
  const prepChips = PREPS.map(([label], k) => h('button', { type: 'button', class: 'chip', onclick: () => { prep = k; reset(); history = []; render(); } }, label));
  const status = h('p', { class: 'ql-status', 'aria-live': 'polite' });
  const measureBtn = h('button', { type: 'button', class: 'btn primary', onclick: () => {
    const r = measure(state[0], state[1]);
    if (measured === null) history.push(r.bit); // solo cuenta la primera medición de cada qubit preparado
    measured = r.bit; state = r.after; render();
  } }, 'Medir');
  const again = h('button', { type: 'button', class: 'btn', onclick: () => { reset(); render(); } }, 'Preparar otro igual');
  const hundred = h('button', { type: 'button', class: 'btn', onclick: () => {
    for (let i = 0; i < 100; i += 1) { reset(); history.push(measure(state[0], state[1]).bit); }
    reset(); render();
  } }, 'Preparar y medir 100');
  const inside = h('input', { type: 'checkbox', onchange: (e) => { showInside = e.target.checked; render(); } });
  const insideOut = h('p', { class: 'small' });
  const hist = h('div', { class: 'ql-hist' });
  const qubitCard = h('div', { class: 'ql-card quantum' },
    h('h5', {}, 'Qubit'),
    h('div', { class: 'widget-controls', role: 'group', 'aria-label': 'Cómo se prepara el qubit' }, h('span', { class: 'widget-label' }, 'Preparación'), prepChips),
    h('div', { class: 'btn-row' }, measureBtn, again, hundred),
    status, hist,
    h('label', { class: 'small ql-inside' }, inside, ' Ver las amplitudes (en un qubit real no se pueden ver)'),
    insideOut);

  root.append(h('div', { class: 'ql-grid' }, bitCard, qubitCard));

  function reset() { state = fromTheta(PREPS[prep][1]); measured = null; }

  function renderBit() {
    bitValue.textContent = String(bit);
    bitLog.textContent = bitReads.length ? `Lecturas: ${bitReads.join(' ')}  → siempre el mismo valor.` : 'Pulsa «Leer» varias veces.';
  }

  function render() {
    prepChips.forEach((c, k) => c.setAttribute('aria-pressed', String(k === prep)));
    measureBtn.textContent = measured === null ? 'Medir' : 'Medir otra vez';
    status.textContent = measured === null
      ? 'Qubit preparado. Todavía no sabes qué dará: mídelo.'
      : `Resultado: ${measured}. Ahora el qubit está en el estado ${measured}: si lo vuelves a medir, dará ${measured} siempre. Para repetir el experimento hay que preparar otro igual.`;
    clear(hist);
    if (history.length) {
      const ones = history.filter((b) => b === 1).length, n = history.length;
      [[0, n - ones], [1, ones]].forEach(([v, c]) => hist.append(h('div', { class: 'ql-bar' },
        h('span', {}, String(v)), h('div', { class: 'ql-track' }, h('i', { style: { width: `${(c / n) * 100}%` } })), h('b', {}, String(c)))));
      hist.append(h('p', { class: 'small muted' }, `Resultados de ${n} qubits preparados igual (solo cuenta la primera medición de cada uno).`));
    }
    const [a, b] = state;
    insideOut.textContent = showInside
      ? `Amplitudes ahora: ${a.toFixed(3)} para el 0 y ${b.toFixed(3)} para el 1 → probabilidades ${pct(a * a)} y ${pct(b * b)}.`
      : '';
  }
  renderBit();
  render();
}
