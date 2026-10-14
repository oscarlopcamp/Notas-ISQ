// Formato de instrucción de la MiniCPU: de bits a ensamblador y viceversa.

import { h, clear } from '../utils/dom.js';
import { OPCODES, encode, decodeWord } from '../utils/minicpu.js';

export function mount(root, { word = 0b00110100 } = {}) {
  let w = word;
  const bitsRow = h('div', { class: 'if-bits', role: 'group', 'aria-label': 'Bits de la instrucción' });
  const opSel = h('select', { 'aria-label': 'Código de operación', onchange: (e) => { w = encode(e.target.value, w & 0x1F); render(); } },
    OPCODES.map((o) => h('option', { value: o.name }, o.name)));
  const addr = h('input', { type: 'number', min: '0', max: '31', 'aria-label': 'Dirección', class: 'tc-input', oninput: (e) => { const v = Number(e.target.value); if (v >= 0 && v <= 31) { w = (w & 0xE0) | v; render(); } } });
  const out = h('div', { class: 'if-out' });

  root.append(bitsRow, h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Ensamblador'), opSel, addr), out);

  function render() {
    const d = decodeWord(w);
    clear(bitsRow);
    w.toString(2).padStart(8, '0').split('').forEach((b, i) => bitsRow.append(h('button', {
      type: 'button', class: `if-bit ${i < 3 ? 'op' : 'ad'} ${b === '1' ? 'on' : ''}`, 'aria-label': `Bit ${7 - i}: ${b}`,
      onclick: () => { w ^= 1 << (7 - i); render(); },
    }, b)));
    opSel.value = d.name;
    addr.value = String(d.address);
    clear(out);
    out.append(
      h('p', {}, h('span', { class: 'if-tag op' }, `código ${(w >> 5).toString(2).padStart(3, '0')} = ${d.name}`), ' ',
        h('span', { class: 'if-tag ad' }, `dirección ${(w & 31).toString(2).padStart(5, '0')} = ${d.address}`)),
      h('p', {}, `Significado: ${OPCODES[d.op].desc.replace(/\bd\b/g, String(d.address))}`),
      h('p', { class: 'muted small' }, `La palabra ${w.toString(2).padStart(8, '0')} (= ${w}) solo es una instrucción si la CPU la lee como tal. Guardada como dato, sería simplemente el número ${w}.`),
    );
  }
  render();
}
