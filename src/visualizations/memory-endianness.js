// Memoria direccionable por bytes y orden de los bytes (endianness).

import { h, clear } from '../utils/dom.js';
import { toHex } from '../utils/encoding.js';
import { utf8Bytes } from '../utils/unicode.js';

const BASE = 0x1000;

export function mount(root, { value = '0x12345678', text = 'Hola' } = {}) {
  let raw = value, str = text;
  const numIn = h('input', { type: 'text', class: 'mono', value: raw, size: '14', 'aria-label': 'Entero de 32 bits (decimal o 0x…)', oninput: (e) => { raw = e.target.value; render(); } });
  const textIn = h('input', { type: 'text', value: str, size: '14', 'aria-label': 'Texto', oninput: (e) => { str = e.target.value; render(); } });
  const out = h('div', { class: 'me-out' });

  root.append(
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'Entero de 32 bits'), numIn,
      ['0x12345678', '1', '-1', '1000000'].map((v) => h('button', { type: 'button', class: 'chip mono', onclick: () => { raw = v; numIn.value = v; render(); } }, v))),
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'Texto'), textIn),
    out,
  );

  const cells = (bytes, highlight) => h('div', { class: 'me-cells' }, bytes.map((b, i) => h('div', { class: `me-cell ${highlight?.(i) || ''}` },
    h('span', { class: 'me-addr mono' }, `0x${(BASE + i).toString(16).toUpperCase()}`),
    h('span', { class: 'me-byte mono' }, toHex(b)))));

  function render() {
    clear(out);
    const s = raw.trim();
    const neg = s.startsWith('-');
    const body = neg ? s.slice(1) : s;
    const mag = /^0x[0-9a-f]+$/i.test(body) ? Number(BigInt(body)) : /^\d+$/.test(body) ? Number(body) : NaN;
    const n = neg ? -mag : mag;
    if (!Number.isFinite(n) || n < -(2 ** 31) || n > 2 ** 32 - 1) {
      out.append(h('p', { class: 'widget-warning' }, 'Escribe un entero que quepa en 32 bits (de −2 147 483 648 a 4 294 967 295), en decimal o con el prefijo 0x.'));
    } else {
      const u = n < 0 ? n + 2 ** 32 : n;
      const big = [24, 16, 8, 0].map((sh) => Math.floor(u / 2 ** sh) % 256);
      const little = [...big].reverse();
      out.append(
        h('p', {}, `Valor: ${n} = 0x${u.toString(16).toUpperCase().padStart(8, '0')}. Ocupa 4 bytes; el más significativo es ${toHex(big[0])}.`),
        h('div', { class: 'me-row' }, h('div', { class: 'me-label' }, h('b', {}, 'Big-endian'), h('small', {}, 'el byte más significativo, en la dirección menor')), cells(big, (i) => (i === 0 ? 'msb' : ''))),
        h('div', { class: 'me-row' }, h('div', { class: 'me-label' }, h('b', {}, 'Little-endian'), h('small', {}, 'el byte menos significativo, en la dirección menor (x86-64, ARM habitual)')), cells(little, (i) => (i === 3 ? 'msb' : ''))),
      );
    }
    const tb = utf8Bytes(str).slice(0, 16);
    out.append(
      h('div', { class: 'me-row' }, h('div', { class: 'me-label' }, h('b', {}, 'Texto UTF-8'), h('small', {}, 'una secuencia de bytes: se guarda en el mismo orden con cualquier endianness')), cells(tb)),
    );
  }

  render();
}
