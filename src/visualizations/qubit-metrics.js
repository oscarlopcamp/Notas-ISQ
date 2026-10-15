// ¿Más qubits es mejor? Tres procesadores ficticios y un circuito de anchura y
// profundidad elegibles. Modelo simplificado: éxito ≈ (1 − error)^operaciones.

import { h, clear } from '../utils/dom.js';
import { PROCESSORS, evaluateCircuit } from '../utils/hardware.js';

const PRESETS = [['Pequeño', 10, 10], ['Mediano', 50, 50], ['Grande', 100, 100]];

export function formatChance(p) {
  if (p >= 0.001) return `${(p * 100).toLocaleString('es', { maximumFractionDigits: 1 })} %`;
  if (p > 0) return `${(p * 100).toExponential(0).replace('e', ' × 10^')} %`;
  return '0 %';
}

export function mount(root, { width: w0 = 50, depth: d0 = 50 } = {}) {
  let width = w0, depth = d0;
  const presetBtns = PRESETS.map(([label, w, d]) => h('button', { type: 'button', class: 'chip', onclick: () => { width = w; depth = d; render(); } }, `${label} (${w} × ${d})`));
  const wIn = h('input', { type: 'range', min: '2', max: '120', step: '1', 'aria-label': 'Anchura: número de qubits del circuito', oninput: (e) => { width = Number(e.target.value); render(); } });
  const dIn = h('input', { type: 'range', min: '1', max: '120', step: '1', 'aria-label': 'Capas: cuántas rondas de operaciones se aplican', oninput: (e) => { depth = Number(e.target.value); render(); } });
  const wOut = h('output', { class: 'mono' }), dOut = h('output', { class: 'mono' });
  const gatesOut = h('p', { class: 'small' });
  const rows = h('div', { class: 'qm-rows' });
  const verdict = h('p', { class: 'widget-stats', 'aria-live': 'polite' });

  root.append(
    h('p', { class: 'small' }, 'Un circuito usa cierto número de qubits y les aplica varias capas de operaciones, una tras otra. Elige su tamaño:'),
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Circuito'), presetBtns),
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'Qubits', wIn), wOut, h('label', { class: 'widget-label' }, 'Capas', dIn), dOut),
    gatesOut, rows, verdict,
    h('p', { class: 'muted small' }, 'Procesadores ficticios. Modelo simplificado: solo cuenta los errores de las operaciones entre dos qubits (una por cada pareja de qubits en cada capa), los supone independientes e ignora la conectividad, la medición y la mitigación de errores.'),
  );

  function render() {
    wIn.value = String(width); dIn.value = String(depth);
    wOut.textContent = String(width); dOut.textContent = String(depth);
    presetBtns.forEach((b, k) => b.setAttribute('aria-pressed', String(PRESETS[k][1] === width && PRESETS[k][2] === depth)));
    const results = PROCESSORS.map((p) => ({ p, ...evaluateCircuit(p, width, depth) }));
    gatesOut.textContent = `El circuito tiene unas ${results[0].gates.toLocaleString('es')} operaciones entre dos qubits.`;
    clear(rows);
    results.forEach(({ p, fits, success }) => rows.append(h('div', { class: `qm-row ${fits ? '' : 'nofit'}` },
      h('div', { class: 'qm-name' }, h('b', {}, p.name), h('small', {}, `${p.qubits.toLocaleString('es')} qubits · error ${(p.error * 100).toLocaleString('es')} % · ${p.note}`)),
      h('div', { class: 'qm-track' }, h('i', { style: { width: `${success * 100}%` } })),
      h('span', { class: 'qm-val mono' }, fits ? formatChance(success) : 'no cabe'))));
    const best = results.filter((r) => r.fits).sort((a, b) => b.success - a.success)[0];
    const most = results.reduce((a, b) => (b.p.qubits > a.p.qubits ? b : a));
    verdict.textContent = !best ? 'El circuito no cabe en ningún procesador.'
      : best.success < 0.01 ? `Ningún procesador lo ejecuta con fiabilidad: el mejor (${best.p.name}) acierta solo un ${formatChance(best.success)} de las veces.`
        : best.p === most.p ? `${best.p.name} es la mejor opción para este circuito.`
          : `${best.p.name} gana a ${most.p.name}, aunque tenga muchos menos qubits: la calidad de las operaciones importa tanto como la cantidad.`;
  }
  render();
}
