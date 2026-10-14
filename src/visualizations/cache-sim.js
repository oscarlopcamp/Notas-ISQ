// Simulador educativo de caché de correspondencia directa: recorrer una matriz
// por filas o por columnas cambia drásticamente la tasa de aciertos.

import { h, clear } from '../utils/dom.js';
import { simulateCache, matrixTraversal, hitRate } from '../utils/cache.js';

const ROWS = 8, COLS = 8, ELEM = 4; // matriz 8×8 de enteros de 4 bytes, almacenada por filas

export function mount(root, { order = 'rows', lines = 4, blockSize = 16 } = {}) {
  let ord = order, nLines = lines, bs = blockSize, step = 0, timer = null;
  const sel = (label, options, value, set) => h('label', { class: 'widget-label' }, label,
    h('select', { onchange: (e) => { set(e.target.value); step = 0; render(); } }, options.map(([v, t]) => h('option', { value: v, selected: String(v) === String(value) }, t))));
  const matrix = h('div', { class: 'cache-matrix', role: 'grid', 'aria-label': 'Matriz 8 × 8 en memoria' });
  const cacheView = h('div', { class: 'cache-lines' });
  const stats = h('p', { class: 'widget-stats', 'aria-live': 'polite' });
  const playBtn = h('button', { type: 'button', class: 'btn primary', onclick: () => toggle() }, '▶ Reproducir');

  root.append(
    h('div', { class: 'widget-controls' },
      sel('Recorrido', [['rows', 'Por filas (m[i][j], j interior)'], ['cols', 'Por columnas (m[i][j], i interior)']], ord, (v) => { ord = v; }),
      sel('Líneas', [[2, '2'], [4, '4'], [8, '8']], nLines, (v) => { nLines = Number(v); }),
      sel('Bloque', [[8, '8 bytes'], [16, '16 bytes'], [32, '32 bytes']], bs, (v) => { bs = Number(v); })),
    h('div', { class: 'btn-row' }, playBtn,
      h('button', { type: 'button', class: 'btn', onclick: () => { stop(); step = Math.min(ROWS * COLS, step + 1); render(); } }, 'Paso'),
      h('button', { type: 'button', class: 'btn', onclick: () => { stop(); step = ROWS * COLS; render(); } }, 'Hasta el final'),
      h('button', { type: 'button', class: 'btn', onclick: () => { stop(); step = 0; render(); } }, 'Reiniciar')),
    h('div', { class: 'cache-layout' }, matrix, cacheView),
    stats,
  );

  function stop() { if (timer) { clearInterval(timer); timer = null; playBtn.textContent = '▶ Reproducir'; } }
  function toggle() {
    if (timer) { stop(); return; }
    if (step >= ROWS * COLS) step = 0;
    playBtn.textContent = '⏸ Pausa';
    timer = setInterval(() => { step += 1; render(); if (step >= ROWS * COLS) stop(); }, 140);
  }

  function render() {
    const addrs = matrixTraversal(ROWS, COLS, ELEM, ord);
    const results = simulateCache({ lines: nLines, blockSize: bs, addresses: addrs });
    const done = results.slice(0, step);
    const status = new Map(done.map((r) => [r.addr, r.hit ? 'hit' : 'miss']));
    const current = done[done.length - 1];
    clear(matrix);
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        const addr = (r * COLS + c) * ELEM;
        const blockIdx = Math.floor(addr / bs);
        matrix.append(h('div', { class: `cache-cell ${status.get(addr) || ''} ${current?.addr === addr ? 'current' : ''} ${blockIdx % 2 ? 'alt' : ''}`, title: `m[${r}][${c}] · dirección ${addr} · bloque ${blockIdx}` }, `${r},${c}`));
      }
    }
    // Estado de la caché tras `step` accesos
    const tags = Array(nLines).fill(null);
    done.forEach((x) => { tags[x.index] = x.block; });
    clear(cacheView);
    cacheView.append(h('div', { class: 'widget-label' }, 'Caché'), ...tags.map((b, i) => h('div', { class: `cache-line ${current?.index === i ? (current.hit ? 'hit' : 'miss') : ''}` },
      h('span', { class: 'mono' }, `línea ${i}`),
      h('span', { class: 'mono' }, b === null ? 'vacía' : `bloque ${b} (bytes ${b * bs}–${b * bs + bs - 1})`))));
    const hits = done.filter((x) => x.hit).length;
    stats.textContent = step === 0
      ? `Matriz de ${ROWS}×${COLS} enteros de ${ELEM} bytes guardada fila tras fila. Cada bloque de ${bs} bytes contiene ${bs / ELEM} elementos contiguos. Caché: ${nLines} líneas (${nLines * bs} bytes).`
      : `Acceso ${step}/${ROWS * COLS}: m[${Math.floor(current.addr / ELEM / COLS)}][${(current.addr / ELEM) % COLS}] → ${current.hit ? 'acierto' : 'fallo'}${current.evicted !== null ? ` (expulsa el bloque ${current.evicted * nLines + current.index})` : ''}. Aciertos: ${hits}/${step} = ${Math.round((hits / step) * 100)} %${step === ROWS * COLS ? `. Total del recorrido: ${Math.round(hitRate(results) * 100)} % de aciertos.` : '.'}`;
  }

  render();
  return stop;
}
