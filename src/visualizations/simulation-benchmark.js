// Mide de verdad, en el navegador, cuánto cuesta actualizar un vector de estado
// de n qubits. Cada qubit añadido duplica la memoria y el tiempo.

import { h, clear } from '../utils/dom.js';
import { applyPairUpdate, formatBytes, statevectorBytes } from '../utils/advantage.js';

const SIZES = [12, 14, 16, 18, 20, 22];

function measure(n) {
  const state = new Float64Array(2 * 2 ** n);
  state[0] = 1;
  let passes = 0;
  const t0 = performance.now();
  // Repite pasadas completas hasta acumular al menos 30 ms, para medir con estabilidad.
  do { applyPairUpdate(state, n, passes % n); passes += 1; } while (performance.now() - t0 < 30);
  return (performance.now() - t0) / passes;
}

export function mount(root) {
  const results = [];
  let running = false;
  const btn = h('button', { type: 'button', class: 'btn primary', onclick: () => start() }, 'Medir en mi navegador');
  const table = h('div', { class: 'bm-table' });
  const note = h('p', { class: 'widget-stats', 'aria-live': 'polite' });
  root.append(
    h('p', { class: 'small' }, 'El simulador aplica una operación sobre un qubit, que obliga a recorrer y actualizar todas las amplitudes, y mide el tiempo medio de cada pasada. Es código real, ejecutado en tu dispositivo.'),
    h('div', { class: 'btn-row' }, btn), table, note);

  function render() {
    clear(table);
    const max = Math.max(...results.map((r) => r.ms), 1e-9);
    results.forEach((r, i) => table.append(h('div', { class: 'bm-row' },
      h('span', { class: 'mono' }, `${r.n} qubits`),
      h('span', { class: 'muted small' }, formatBytes(statevectorBytes(r.n))),
      h('div', { class: 'bm-bar' }, h('div', { style: { width: `${Math.max(1, (r.ms / max) * 100)}%` } })),
      h('span', { class: 'mono' }, `${r.ms < 1 ? r.ms.toFixed(3) : r.ms.toFixed(1)} ms`),
      h('span', { class: 'muted small' }, i ? `×${(r.ms / results[i - 1].ms).toFixed(1)}` : ''))));
  }

  function start() {
    if (running) return;
    running = true; btn.disabled = true; results.length = 0; render();
    note.textContent = 'Midiendo…';
    let k = 0;
    const next = () => {
      if (k >= SIZES.length) {
        running = false; btn.disabled = false;
        const last = results[results.length - 1];
        const perQubit = (last.ms / results[0].ms) ** (1 / (last.n - results[0].n));
        const est = (q) => last.ms * perQubit ** (q - last.n);
        const fmt = (ms) => (ms < 1000 ? `${ms.toFixed(0)} ms` : ms < 3.6e6 ? `${(ms / 1000).toFixed(0)} s` : ms < 8.64e7 ? `${(ms / 3.6e6).toFixed(1)} h` : `${(ms / 8.64e7).toFixed(0)} días`);
        note.textContent = `Cada 2 qubits más, el tiempo se multiplica por unos ${(perQubit ** 2).toFixed(1)} (lo esperado es ×4). Extrapolando, una sola pasada con 30 qubits tardaría unos ${fmt(est(30))} y necesitaría ${formatBytes(statevectorBytes(30))}; con 40 qubits, unos ${fmt(est(40))} y ${formatBytes(statevectorBytes(40))}, si hubiera memoria. Es una estimación de orden de magnitud: depende de tu dispositivo.`;
        return;
      }
      const n = SIZES[k];
      results.push({ n, ms: measure(n) });
      k += 1;
      render();
      setTimeout(next, 30); // deja respirar a la página entre medidas
    };
    setTimeout(next, 30);
  }
}
