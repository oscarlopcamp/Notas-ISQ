// Superposición frente a moneda: |+⟩ y «0 o 1 al azar» dan lo mismo al medir
// directamente, pero no tras la mezcla. Incluye una caja misteriosa.

import { h, clear } from '../utils/dom.js';
import { mix, measure } from '../utils/qubit.js';

const R = Math.SQRT1_2;
const SOURCES = {
  sup: { label: 'Qubit en |+⟩ (superposición)', prepare: () => [R, R] },
  coin: { label: 'Moneda: |0⟩ o |1⟩ al azar', prepare: () => (Math.random() < 0.5 ? [1, 0] : [0, 1]) },
};
const MODES = { direct: 'Medir directamente', mixed: 'Mezclar y medir' };

function shot(source, mode) {
  let [a, b] = SOURCES[source].prepare();
  if (mode === 'mixed') [a, b] = mix(a, b);
  return measure(a, b).bit;
}

export function mount(root) {
  const tally = { sup: { direct: [0, 0], mixed: [0, 0] }, coin: { direct: [0, 0], mixed: [0, 0] } };
  const grid = h('div', { class: 'sv-grid' });
  const msg = h('p', { class: 'widget-stats', 'aria-live': 'polite' });

  // Caja misteriosa
  let secret = Math.random() < 0.5 ? 'sup' : 'coin', mystery = { direct: [0, 0], mixed: [0, 0] }, verdict = null;
  const mysteryOut = h('div', { class: 'sv-mystery-out' });
  const guessOut = h('p', { 'aria-live': 'polite' });

  root.append(grid, msg,
    h('h5', { class: 'te-quiz-title' }, 'La caja misteriosa'),
    h('p', { class: 'small' }, 'Dentro hay una de las dos fuentes. Haz pruebas y decide cuál es.'),
    h('div', { class: 'btn-row' },
      ...Object.entries(MODES).map(([m, label]) => h('button', { type: 'button', class: 'btn', onclick: () => { for (let i = 0; i < 20; i += 1) mystery[m][shot(secret, m)] += 1; renderMystery(); } }, `${label} ×20`))),
    mysteryOut,
    h('div', { class: 'btn-row' },
      h('button', { type: 'button', class: 'btn primary', onclick: () => { verdict = 'sup'; renderMystery(); } }, 'Es superposición'),
      h('button', { type: 'button', class: 'btn primary', onclick: () => { verdict = 'coin'; renderMystery(); } }, 'Es una moneda'),
      h('button', { type: 'button', class: 'btn', onclick: () => { secret = Math.random() < 0.5 ? 'sup' : 'coin'; mystery = { direct: [0, 0], mixed: [0, 0] }; verdict = null; renderMystery(); } }, 'Otra caja')),
    guessOut);

  const bars = ([z, o]) => {
    const n = z + o;
    return h('div', { class: 'ab-bars' }, [[0, z], [1, o]].map(([k, c]) => h('div', { class: 'ql-bar' },
      h('span', {}, String(k)), h('div', { class: 'ql-track' }, h('i', { style: { width: n ? `${(c / n) * 100}%` : '0' } })), h('b', {}, String(c)))));
  };

  function render() {
    clear(grid);
    Object.entries(SOURCES).forEach(([s, src]) => grid.append(h('div', { class: `ql-card ${s === 'sup' ? 'quantum' : ''}` },
      h('h5', {}, src.label),
      ...Object.entries(MODES).map(([m, label]) => h('div', { class: 'sv-mode' },
        h('div', { class: 'sv-mode-head' }, h('span', { class: 'widget-label' }, label),
          h('button', { type: 'button', class: 'btn', onclick: () => { for (let i = 0; i < 100; i += 1) tally[s][m][shot(s, m)] += 1; render(); } }, 'Enviar 100')),
        bars(tally[s][m]))))));
    const triedMixed = tally.sup.mixed[0] + tally.sup.mixed[1] > 0 && tally.coin.mixed[0] + tally.coin.mixed[1] > 0;
    const triedDirect = tally.sup.direct[0] + tally.sup.direct[1] > 0 && tally.coin.direct[0] + tally.coin.direct[1] > 0;
    msg.textContent = triedMixed
      ? 'Tras la mezcla, la superposición da siempre 0 y la moneda sigue dando mitad y mitad. Son cosas distintas, aunque medidas directamente parezcan iguales.'
      : triedDirect ? 'Medidas directamente, las dos fuentes dan mitad y mitad: no se distinguen. Prueba ahora «Mezclar y medir».'
        : 'Envía 100 por cada fuente, primero midiendo directamente.';
  }

  function renderMystery() {
    clear(mysteryOut);
    Object.entries(MODES).forEach(([m, label]) => {
      if (mystery[m][0] + mystery[m][1]) mysteryOut.append(h('div', { class: 'sv-mode' }, h('span', { class: 'widget-label' }, label), bars(mystery[m])));
    });
    guessOut.textContent = verdict === null ? ''
      : verdict === secret ? `✓ Correcto: era ${secret === 'sup' ? 'superposición' : 'una moneda'}.${mystery.mixed[0] + mystery.mixed[1] ? '' : ' (Acertaste sin mezclar: ¡suerte!)'}`
        : `✗ Era ${secret === 'sup' ? 'superposición' : 'una moneda'}. Pista: midiendo directamente no se pueden distinguir.`;
  }
  render();
  renderMystery();
}
