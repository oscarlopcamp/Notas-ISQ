// Un mismo byte leído con distintas convenciones de codificación.

import { h, clear } from '../utils/dom.js';
import { interpretByte, toBinary } from '../utils/encoding.js';

const PRESETS = [
  ['01000001', '«A»'],
  ['01001000', '«H»'],
  ['00110111', '«7»'],
  ['10000000', '128'],
  ['11111111', '255'],
];

export function mount(root, { initial = '01000001' } = {}) {
  let bits = Array.from(initial, Number);

  const row = h('div', { class: 'bits-row compact', role: 'group', 'aria-label': 'Byte (pulsa un bit para cambiarlo)' });
  const out = h('dl', { class: 'interp-grid' });

  root.append(
    h('div', { class: 'widget-controls' },
      h('span', { class: 'widget-label' }, 'Probar'),
      PRESETS.map(([b, label]) => h('button', {
        type: 'button', class: 'chip mono', title: label,
        onclick: () => { bits = Array.from(b, Number); render(); },
      }, b))),
    row,
    out,
  );

  function render() {
    clear(row);
    bits.forEach((b, i) => row.append(h('button', {
      type: 'button', class: `bit-cell${b ? ' on' : ''}`, 'aria-pressed': String(Boolean(b)),
      'aria-label': `Bit ${7 - i}, valor ${b}`,
      onclick: () => { bits[i] = 1 - bits[i]; render(); },
    }, h('span', { class: 'bit-digit' }, b))));

    const byte = bits.reduce((acc, b) => acc * 2 + b, 0);
    const r = interpretByte(byte);
    clear(out);
    const item = (label, value, note) => h('div', {},
      h('dt', {}, label),
      h('dd', {}, value, note ? h('small', { class: 'muted' }, note) : null));

    out.append(
      item('Entero sin signo', h('b', { class: 'mono' }, r.unsigned), 'rango 0–255'),
      item('Entero con signo', h('b', { class: 'mono' }, r.signed), 'complemento a dos, rango −128…127 (lección 1.2)'),
      item('Carácter ASCII', r.ascii != null
        ? h('b', { class: 'interp-char' }, r.ascii)
        : h('span', { class: 'muted' }, r.asciiDefined ? 'carácter de control (no imprimible)' : 'no definido: ASCII solo usa 0–127')),
      item('Nivel de gris (8 bits)', h('span', { class: 'gray-swatch', style: { background: `rgb(${r.gray},${r.gray},${r.gray})` }, 'aria-hidden': 'true' }),
        `${r.gray} de 255 (0 = negro, 255 = blanco)`),
      item('Hexadecimal', h('b', { class: 'mono' }, `0x${r.hex}`), `${toBinary(byte).slice(0, 4)} → ${r.hex[0]}, ${toBinary(byte).slice(4)} → ${r.hex[1]}`),
    );
  }

  render();
}
