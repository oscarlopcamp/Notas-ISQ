// Imagen monocroma de 8 × 8 píxeles: cada fila es un byte.

import { h, clear } from '../utils/dom.js';
import { toBinary, toHex } from '../utils/encoding.js';

const SIZE = 8;
const PRESETS = {
  'Letra A': [0x18, 0x24, 0x42, 0x42, 0x7E, 0x42, 0x42, 0x00],
  Cara: [0x3C, 0x42, 0xA5, 0x81, 0xA5, 0x99, 0x42, 0x3C],
  Flecha: [0x08, 0x0C, 0xFE, 0xFF, 0xFE, 0x0C, 0x08, 0x00],
};

export function mount(root, { preset = 'Letra A' } = {}) {
  let rows = [...PRESETS[preset]];
  let painting = null;

  const grid = h('div', { class: 'pixel-grid', role: 'grid', 'aria-label': 'Imagen de 8 por 8 píxeles' });
  const bytes = h('ol', { class: 'pixel-bytes mono', 'aria-label': 'Bytes de cada fila' });
  const stats = h('p', { class: 'widget-stats' });
  const cells = [];

  const isOn = (r, c) => Boolean(rows[r] & (1 << (SIZE - 1 - c)));
  function setPixel(r, c, value) {
    const mask = 1 << (SIZE - 1 - c);
    rows[r] = value ? rows[r] | mask : rows[r] & ~mask;
    refresh();
  }

  for (let r = 0; r < SIZE; r += 1) {
    const line = h('div', { role: 'row', class: 'pixel-row' });
    for (let c = 0; c < SIZE; c += 1) {
      const cell = h('button', {
        type: 'button', role: 'gridcell', class: 'pixel',
        onpointerdown: (e) => {
          e.preventDefault();
          cell.releasePointerCapture?.(e.pointerId);
          painting = isOn(r, c) ? 0 : 1;
          setPixel(r, c, painting);
        },
        onpointerenter: () => { if (painting !== null) setPixel(r, c, painting); },
        onkeydown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPixel(r, c, isOn(r, c) ? 0 : 1); }
        },
      });
      cells.push(cell);
      line.append(cell);
    }
    grid.append(line);
  }

  const stop = () => { painting = null; };
  window.addEventListener('pointerup', stop);

  root.append(
    h('div', { class: 'widget-controls' },
      h('span', { class: 'widget-label' }, 'Imágenes'),
      Object.keys(PRESETS).map((name) => h('button', { type: 'button', class: 'chip', onclick: () => { rows = [...PRESETS[name]]; refresh(); } }, name)),
      h('button', { type: 'button', class: 'chip', onclick: () => { rows = rows.map((r) => r ^ 0xFF); refresh(); } }, 'Invertir'),
      h('button', { type: 'button', class: 'chip', onclick: () => { rows = Array(SIZE).fill(0); refresh(); } }, 'Borrar'),
    ),
    h('div', { class: 'pixel-layout' }, grid, bytes),
    stats,
  );

  function refresh() {
    cells.forEach((cell, i) => {
      const r = Math.floor(i / SIZE), c = i % SIZE, on = isOn(r, c);
      cell.classList.toggle('on', on);
      cell.setAttribute('aria-pressed', String(on));
      cell.setAttribute('aria-label', `Fila ${r + 1}, columna ${c + 1}: ${on ? 'negro (1)' : 'blanco (0)'}`);
    });
    clear(bytes);
    rows.forEach((row) => bytes.append(h('li', {}, toBinary(row), h('span', { class: 'muted' }, `  0x${toHex(row)}`))));
    stats.innerHTML = `Esta imagen ocupa <b>${SIZE * SIZE} bits</b> (${SIZE} bytes) con 1 bit por píxel. `
      + `La misma cuadrícula en escala de grises de 8 bits necesitaría ${SIZE * SIZE * 8} bits, y en color RGB de 24 bits, ${SIZE * SIZE * 24} bits.`;
  }

  refresh();
  return () => window.removeEventListener('pointerup', stop);
}
