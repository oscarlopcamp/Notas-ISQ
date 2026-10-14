// Compresión por longitud de series (RLE) de una imagen de 16 × 16 en escala de grises.
// Formato educativo: sin comprimir, 1 byte por píxel; comprimido, cada serie
// ocupa 2 bytes (valor, longitud ≤ 255). Los formatos reales son más elaborados.

import { h, clear } from '../utils/dom.js';
import { rle } from '../utils/media.js';
import { seededPoints } from '../utils/complexity.js';

const N = 16;
const PRESETS = {
  'En blanco': () => Array(N * N).fill(255),
  Franjas: () => Array.from({ length: N * N }, (_, i) => (Math.floor(i / N) % 4 < 2 ? 0 : 255)),
  Círculo: () => Array.from({ length: N * N }, (_, i) => ((Math.floor(i / N) - 7.5) ** 2 + ((i % N) - 7.5) ** 2 < 36 ? 0 : 255)),
  Ajedrez: () => Array.from({ length: N * N }, (_, i) => ((Math.floor(i / N) + i) % 2 ? 0 : 255)),
  Ruido: () => seededPoints(N * N / 2, 11).flat().map((x) => (x > 0.5 ? 0 : 255)),
};

export function mount(root, { preset = 'Círculo' } = {}) {
  let px = PRESETS[preset]();
  let painting = null;
  const cells = [];
  const grid = h('div', { class: 'rle-grid', role: 'grid', 'aria-label': 'Imagen de 16 por 16 píxeles' });
  for (let i = 0; i < N * N; i += 1) {
    const cell = h('button', {
      type: 'button', class: 'rle-px', 'aria-label': `Píxel ${i + 1}`,
      onpointerdown: (e) => { e.preventDefault(); painting = px[i] ? 0 : 255; px[i] = painting; render(); },
      onpointerenter: () => { if (painting !== null) { px[i] = painting; render(); } },
      onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); px[i] = px[i] ? 0 : 255; render(); } },
    });
    cells.push(cell);
    grid.append(cell);
  }
  const stop = () => { painting = null; };
  window.addEventListener('pointerup', stop);

  const runsBox = h('div', { class: 'rle-runs mono' });
  const bar = h('div', { class: 'rle-bars' });
  const verdict = h('p', { class: 'widget-stats' });

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Imágenes'),
      Object.keys(PRESETS).map((k) => h('button', { type: 'button', class: 'chip', onclick: () => { px = PRESETS[k](); render(); } }, k))),
    h('div', { class: 'rle-layout' }, grid, h('div', { class: 'rle-side' }, bar, verdict, h('div', { class: 'widget-label' }, 'Primeras series (valor × longitud)'), runsBox)),
  );

  function render() {
    cells.forEach((c, i) => c.classList.toggle('on', px[i] === 0));
    // Series de como mucho 255 píxeles (la longitud cabe en un byte)
    const runs = rle(px).flatMap(([v, n]) => { const out = []; while (n > 0) { out.push([v, Math.min(n, 255)]); n -= 255; } return out; });
    const raw = N * N, comp = runs.length * 2;
    clear(bar);
    const max = Math.max(raw, comp);
    bar.append(
      h('div', { class: 'rle-bar' }, h('span', {}, `Sin comprimir: ${raw} bytes`), h('div', { style: { width: `${(raw / max) * 100}%` } })),
      h('div', { class: `rle-bar ${comp > raw ? 'worse' : 'better'}` }, h('span', {}, `RLE: ${runs.length} series × 2 = ${comp} bytes`), h('div', { style: { width: `${(comp / max) * 100}%` } })),
    );
    verdict.textContent = comp < raw
      ? `La imagen ocupa el ${Math.round((comp / raw) * 100)} % del original: hay series largas de píxeles iguales.`
      : comp === raw ? 'Mismo tamaño: RLE no aporta nada aquí.'
        : `¡La «compresión» ocupa un ${Math.round((comp / raw - 1) * 100)} % más! Sin series largas, guardar la longitud de cada una es un coste extra.`;
    clear(runsBox);
    runs.slice(0, 24).forEach(([v, n]) => runsBox.append(h('span', { class: `rle-run ${v === 0 ? 'dark' : ''}` }, `${v}×${n}`)));
    if (runs.length > 24) runsBox.append(h('span', { class: 'muted' }, ` … y ${runs.length - 24} más`));
  }

  render();
  return () => window.removeEventListener('pointerup', stop);
}
