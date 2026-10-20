// Editor de circuitos: coloca compuertas en una cuadrícula, recorre el circuito
// columna a columna y mide. Simulación exacta del vector de estado (src/utils/circuit.js).

import { h, clear } from '../utils/dom.js';
import { CTRL, TARG, simulate, columnError, probabilitiesOf } from '../utils/circuit.js';
import { basisLabel, sampleIndex } from '../utils/qubit.js';
import { drawCircuit } from './circuit-svg.js';

const COLS = 6;
const TOOLS = [['H', 'H · mezcla'], ['X', 'X · intercambio'], ['Z', 'Z · signo'], [CTRL, '● control'], [TARG, '⊕ objetivo'], [null, 'Borrar']];
const empty = (n) => Array.from({ length: COLS }, () => Array(n).fill(null));
const PRESETS = {
  'Un qubit mezclado': [1, [['H']]],
  'Mezclar dos veces': [1, [['H'], ['H']]],
  'Mezclar, signo, mezclar': [1, [['H'], ['Z'], ['H']]],
  'Par de Bell': [2, [['H', null], [CTRL, TARG]]],
  'GHZ de 3 qubits': [3, [['H', null, null], [CTRL, TARG, null], [CTRL, null, TARG]]],
};
const pct = (p) => `${(p * 100).toLocaleString('es', { maximumFractionDigits: 1 })} %`;

export function mount(root, { preset = 'Par de Bell' } = {}) {
  let n = 2, grid = empty(2), tool = 'H', view = COLS, counts = null;
  const toolBtns = TOOLS.map(([t, label]) => h('button', { type: 'button', class: 'chip mono', onclick: () => { tool = t; render(); } }, label));
  const nBtns = [1, 2, 3].map((k) => h('button', { type: 'button', class: 'chip', onclick: () => { n = k; grid = empty(k); view = COLS; counts = null; render(); } }, `${k} qubit${k > 1 ? 's' : ''}`));
  const presetSel = h('select', { 'aria-label': 'Cargar un ejemplo', onchange: (e) => { if (e.target.value) load(e.target.value); e.target.value = ''; } },
    h('option', { value: '' }, 'Cargar un ejemplo…'), Object.keys(PRESETS).map((k) => h('option', { value: k }, k)));
  const pic = h('div', { class: 'cb-scroll' });
  const err = h('p', { class: 'cb-error', 'aria-live': 'polite' });
  const stepIn = h('input', { type: 'range', min: '0', max: String(COLS), step: '1', 'aria-label': 'Ver el estado tras la columna', oninput: (e) => { view = Number(e.target.value); render(); } });
  const stepOut = h('output', { class: 'mono' });
  const table = h('div', { class: 'qr-table' });

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Qubits'), nBtns, presetSel),
    h('div', { class: 'widget-controls cb-palette', role: 'group', 'aria-label': 'Herramienta' }, h('span', { class: 'widget-label' }, 'Coloca'), toolBtns),
    h('p', { class: 'small muted' }, 'Elige una herramienta y pulsa una casilla del circuito. Una CNOT necesita un ● y un ⊕ en la misma columna.'),
    pic, err,
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'Estado tras la columna', stepIn), stepOut),
    table,
    h('div', { class: 'btn-row' },
      h('button', { type: 'button', class: 'btn primary', onclick: () => {
        const s = simulate(n, grid).at(-1);
        counts = new Array(2 ** n).fill(0);
        const probs = probabilitiesOf(s), amps = probs.map(Math.sqrt);
        for (let i = 0; i < 1000; i += 1) counts[sampleIndex(amps)] += 1;
        view = COLS; // los recuentos corresponden al final del circuito
        render();
      } }, 'Ejecutar 1000 veces y medir'),
      h('button', { type: 'button', class: 'btn', onclick: () => { grid = empty(n); counts = null; view = COLS; render(); } }, 'Vaciar')));

  function load(name) {
    const [k, cols] = PRESETS[name];
    n = k; grid = empty(k);
    cols.forEach((c, i) => { grid[i] = [...c]; });
    view = COLS; counts = null; render();
  }

  function place(q, k) {
    const col = grid[k];
    if (tool === CTRL || tool === TARG) col.forEach((g, i) => { if (g && g !== CTRL && g !== TARG) col[i] = null; }); // una CNOT ocupa la columna
    else if (tool) col.forEach((g, i) => { if (g === CTRL || g === TARG) col[i] = null; });
    col[q] = col[q] === tool ? null : tool;
    counts = null; render();
  }

  function render() {
    toolBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(TOOLS[i][0] === tool)));
    nBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(i + 1 === n)));
    const bad = grid.findIndex((c) => columnError(c));
    err.textContent = bad >= 0 ? `Columna ${bad + 1}: ${columnError(grid[bad])} La simulación se detiene ahí.` : '';
    const states = simulate(n, grid);
    const last = states.length - 1;
    view = Math.min(view, last);
    stepIn.max = String(last); stepIn.value = String(view);
    stepOut.textContent = view === 0 ? 'inicio' : `${view} de ${last}`;
    clear(pic);
    pic.append(drawCircuit(n, grid, { onCell: place, active: view > 0 && view < last ? view - 1 : -1, label: `Circuito de ${n} qubits` }));

    const s = states[view], probs = probabilitiesOf(s);
    clear(table);
    table.append(h('div', { class: 'qr-row head' }, ['Estado base', 'En decimal', 'Amplitud', 'Probabilidad', counts && view === last ? 'Veces (de 1000)' : ''].map((t) => h('span', {}, t))));
    probs.forEach((p, x) => {
      const a = Math.abs(s.im[x]) < 1e-12 ? s.re[x] : NaN;
      table.append(h('div', { class: `qr-row ${p < 1e-12 ? 'zero' : ''}` },
        h('span', { class: 'mono' }, `|${basisLabel(x, n)}⟩`), h('span', { class: 'mono' }, String(x)),
        h('span', { class: 'qr-amp' }, h('i', { class: a < 0 ? 'neg' : '', style: { width: `${Math.sqrt(p) * 100}%` } }), h('b', { class: 'mono' }, (Math.abs(a) < 1e-12 ? 0 : a).toFixed(3).replace('-', '−'))),
        h('span', { class: 'mono' }, pct(p)),
        h('span', { class: 'mono' }, counts && view === last ? String(counts[x]) : '')));
    });
  }
  load(preset in PRESETS ? preset : 'Par de Bell');
}

