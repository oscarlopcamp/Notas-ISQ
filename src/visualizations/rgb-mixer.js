// Mezclador RGB: un color son tres números. Incluye la reducción de la
// profundidad de color (bits por canal) para ver el efecto de la cuantización.

import { h, clear } from '../utils/dom.js';
import { toHexColor, fromHexColor, quantize } from '../utils/media.js';
import { toBinary } from '../utils/encoding.js';

const CHANNELS = [['R', 'Rojo'], ['G', 'Verde'], ['B', 'Azul']];

export function mount(root, { rgb = [31, 78, 140], bits = 8 } = {}) {
  let c = [...rgb];
  let depth = bits;

  const sliders = CHANNELS.map(([k, name], i) => h('input', {
    type: 'range', min: '0', max: '255', value: String(c[i]), 'aria-label': `Canal ${name}`, class: `rgb-${k}`,
    oninput: (e) => { c[i] = Number(e.target.value); render(); },
  }));
  const hexInput = h('input', { type: 'text', class: 'mono', value: toHexColor(...c), 'aria-label': 'Color en hexadecimal', size: '8',
    onchange: (e) => { const v = fromHexColor(e.target.value); if (v) { c = v; render(); } } });
  const depthSel = h('select', { 'aria-label': 'Bits por canal', onchange: (e) => { depth = Number(e.target.value); render(); } },
    [8, 6, 5, 4, 3, 2, 1].map((b) => h('option', { value: String(b), selected: b === depth }, `${b} bit${b > 1 ? 's' : ''} por canal (${3 * b} bits por píxel)`)));
  const swatch = h('div', { class: 'rgb-swatch' });
  const swatchQ = h('div', { class: 'rgb-swatch' });
  const rows = h('div', { class: 'rgb-rows' });
  const gradient = h('canvas', { width: '512', height: '40', class: 'rgb-gradient', 'aria-label': 'Degradado con la profundidad elegida' });
  const gradient8 = h('canvas', { width: '512', height: '40', class: 'rgb-gradient', 'aria-label': 'Degradado con 8 bits por canal' });
  const note = h('p', { class: 'widget-stats' });

  root.append(
    h('div', { class: 'rgb-layout' },
      h('div', { class: 'rgb-controls' },
        CHANNELS.map(([k, name], i) => h('label', { class: 'rgb-slider' }, h('span', { class: `rgb-tag ${k}` }, k), sliders[i])),
        h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Hex'), hexInput,
          ['#FFFFFF', '#000000', '#FF0000', '#FFFF00', '#808080', '#1F4E8C'].map((x) => h('button', { type: 'button', class: 'chip mono', onclick: () => { c = fromHexColor(x); render(); } }, x)))),
      h('div', { class: 'rgb-swatches' },
        h('figure', {}, swatch, h('figcaption', {}, '8 bits por canal')),
        h('figure', {}, swatchQ, h('figcaption', { class: 'rgb-qcap' })))),
    rows,
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Profundidad'), depthSel),
    h('div', { class: 'rgb-grad-wrap' }, h('small', { class: 'muted' }, 'Degradado del negro a tu color con 8 bits por canal'), gradient8,
      h('small', { class: 'muted rgb-qlabel' }), gradient),
    note,
  );

  function drawGradient(canvas, bitsPerChannel) {
    const ctx = canvas.getContext('2d');
    for (let x = 0; x < canvas.width; x += 1) {
      const f = x / (canvas.width - 1);
      const col = c.map((v) => quantize(Math.round(v * f), bitsPerChannel).shown);
      ctx.fillStyle = `rgb(${col.join(',')})`;
      ctx.fillRect(x, 0, 1, canvas.height);
    }
  }

  function render() {
    sliders.forEach((s, i) => { s.value = String(c[i]); });
    hexInput.value = toHexColor(...c);
    swatch.style.background = `rgb(${c.join(',')})`;
    const q = c.map((v) => quantize(v, depth));
    swatchQ.style.background = `rgb(${q.map((x) => x.shown).join(',')})`;
    root.querySelector('.rgb-qcap').textContent = `${depth} bit${depth > 1 ? 's' : ''} por canal`;
    root.querySelector('.rgb-qlabel').textContent = `El mismo degradado con ${depth} bit${depth > 1 ? 's' : ''} por canal (${2 ** depth} niveles)`;
    clear(rows);
    CHANNELS.forEach(([k, name], i) => rows.append(h('div', { class: 'rgb-row' },
      h('span', { class: `rgb-tag ${k}` }, name),
      h('span', { class: 'mono' }, String(c[i]).padStart(3, ' ')),
      h('span', { class: 'mono rgb-bin' }, toBinary(c[i], 8)),
      h('span', { class: 'mono' }, `0x${toHexColor(...c).slice(1 + 2 * i, 3 + 2 * i)}`),
      depth < 8 ? h('span', { class: 'muted small' }, `→ nivel ${q[i].level} de ${q[i].levels - 1}`) : null)));
    drawGradient(gradient8, 8);
    drawGradient(gradient, depth);
    note.textContent = `Este color ocupa 24 bits: ${toBinary(c[0], 8)} ${toBinary(c[1], 8)} ${toBinary(c[2], 8)}. Con ${8} bits por canal hay 2²⁴ = 16 777 216 colores posibles; con ${depth} bits por canal, ${(2 ** (3 * depth)).toLocaleString('es')}.`;
  }

  render();
}
