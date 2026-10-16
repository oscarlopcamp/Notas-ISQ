// Entrelazamiento frente a correlación clásica: ambos pares coinciden siempre
// al medirlos directamente; tras mezclar los dos qubits, solo el entrelazado.

import { h, clear } from '../utils/dom.js';
import { BELL, mixQubit, measurePair } from '../utils/qubit.js';

const SOURCES = {
  bell: { label: 'Par entrelazado: (|00⟩ + |11⟩)/√2', prepare: () => BELL },
  classical: { label: 'Par clásico: 00 o 11 al azar', prepare: () => (Math.random() < 0.5 ? [1, 0, 0, 0] : [0, 0, 0, 1]) },
};
const MODES = { direct: 'Medir directamente', mixed: 'Mezclar los dos y medir' };

export function mount(root) {
  let source = 'bell', mode = 'direct';
  const counts = {}, last = {};
  const key = () => `${source}.${mode}`;
  const srcChips = Object.entries(SOURCES).map(([s, src]) => h('button', { type: 'button', class: 'chip', onclick: () => { source = s; render(); } }, src.label));
  const modeChips = Object.entries(MODES).map(([m, label]) => h('button', { type: 'button', class: 'chip', onclick: () => { mode = m; render(); } }, label));
  const run = (n) => {
    const c = counts[key()] ?? (counts[key()] = { '00': 0, '01': 0, '10': 0, '11': 0 });
    const seq = [];
    for (let i = 0; i < n; i += 1) {
      let st = SOURCES[source].prepare();
      if (mode === 'mixed') st = mixQubit(mixQubit(st, 0), 1);
      const r = measurePair(st); c[r] += 1; seq.push(r);
    }
    last[key()] = seq.slice(-12);
    render();
  };
  const out = h('div', { class: 'el-out', 'aria-live': 'polite' });
  const summary = h('div', { class: 'el-summary' });

  root.append(
    h('div', { class: 'widget-controls', role: 'group', 'aria-label': 'Fuente' }, h('span', { class: 'widget-label' }, 'Fuente'), srcChips),
    h('div', { class: 'widget-controls', role: 'group', 'aria-label': 'Cómo medir' }, h('span', { class: 'widget-label' }, 'Medición'), modeChips),
    h('div', { class: 'btn-row' },
      h('button', { type: 'button', class: 'btn primary', onclick: () => run(1) }, 'Medir 1 par'),
      h('button', { type: 'button', class: 'btn', onclick: () => run(100) }, 'Medir 100 pares')),
    out, summary);

  const rate = (c) => { const n = c['00'] + c['01'] + c['10'] + c['11']; return n ? (c['00'] + c['11']) / n : null; };

  function render() {
    srcChips.forEach((b, k) => b.setAttribute('aria-pressed', String(Object.keys(SOURCES)[k] === source)));
    modeChips.forEach((b, k) => b.setAttribute('aria-pressed', String(Object.keys(MODES)[k] === mode)));
    clear(out);
    const c = counts[key()];
    if (!c) {
      out.append(h('p', { class: 'muted' }, 'Mide algunos pares. Cada par da dos bits: el del qubit izquierdo y el del derecho.'));
    } else {
      const n = c['00'] + c['01'] + c['10'] + c['11'];
      out.append(
        h('p', { class: 'mono el-seq' }, `Últimos pares: ${last[key()].join(' ')}`),
        h('div', { class: 'ab-bars' }, ['00', '01', '10', '11'].map((r) => h('div', { class: 'ql-bar el-bar' },
          h('span', {}, r), h('div', { class: 'ql-track' }, h('i', { style: { width: `${(c[r] / n) * 100}%` } })), h('b', {}, String(c[r]))))),
        h('p', {}, `Los dos qubits coinciden en el ${Math.round(rate(c) * 100)} % de ${n} pares.`));
    }
    clear(summary);
    const rows = Object.entries(SOURCES).map(([s, src]) => h('tr', {}, h('td', {}, src.label),
      ...Object.keys(MODES).map((m) => { const r = counts[`${s}.${m}`] ? rate(counts[`${s}.${m}`]) : null; return h('td', { class: 'mono' }, r === null ? '—' : `${Math.round(r * 100)} %`); })));
    summary.append(h('table', { class: 'el-table' },
      h('thead', {}, h('tr', {}, h('th', {}, 'Coincidencias'), ...Object.values(MODES).map((m) => h('th', {}, m)))),
      h('tbody', {}, rows)));
    const done = Object.keys(SOURCES).every((s) => Object.keys(MODES).every((m) => counts[`${s}.${m}`]));
    if (done) summary.append(h('p', { class: 'widget-stats' }, 'Medidos directamente, los dos pares siempre coinciden. Tras la mezcla, el entrelazado sigue coincidiendo siempre y el clásico solo la mitad de las veces: el entrelazamiento es una correlación más fuerte que cualquier acuerdo previo.'));
  }
  render();
}
