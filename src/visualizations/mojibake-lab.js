// Laboratorio de mojibake: escribir con una codificación y leer con otra.

import { h, clear } from '../utils/dom.js';
import { encode, decode, ENCODINGS } from '../utils/unicode.js';
import { toHex } from '../utils/encoding.js';

export function mount(root, { text = 'Año', writeAs = 'utf-8', readAs = 'windows-1252' } = {}) {
  let value = text, w = writeAs, r = readAs;
  const select = (current, onchange, label) => h('select', { 'aria-label': label, onchange: (e) => { onchange(e.target.value); render(); } },
    Object.entries(ENCODINGS).map(([id, name]) => h('option', { value: id, selected: id === current }, name)));
  const input = h('input', { type: 'text', value, 'aria-label': 'Texto original', oninput: (e) => { value = e.target.value; render(); } });
  const out = h('div', { class: 'mj-out' });

  root.append(
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'Texto'), input),
    h('div', { class: 'widget-controls' },
      h('span', { class: 'widget-label' }, 'Se escribe en'), select(w, (v) => { w = v; }, 'Codificación al escribir'),
      h('span', { class: 'widget-label' }, 'y se lee como'), select(r, (v) => { r = v; }, 'Codificación al leer')),
    h('div', { class: 'widget-controls subtle' }, h('span', { class: 'widget-label' }, 'Casos'),
      [['Año', 'utf-8', 'windows-1252'], ['Año', 'windows-1252', 'utf-8'], ['“comillas”', 'utf-8', 'windows-1252'], ['€ 5', 'utf-8', 'utf-16le'], ['Año', 'utf-8', 'utf-8']]
        .map(([t, a, b]) => h('button', { type: 'button', class: 'chip', onclick: () => { value = t; w = a; r = b; input.value = t; root.querySelectorAll('select')[0].value = a; root.querySelectorAll('select')[1].value = b; render(); } }, `${t}: ${a} → ${b}`))),
    out,
  );

  function render() {
    clear(out);
    const { bytes, unencodable } = encode(value, w);
    const read = decode(bytes, r);
    const ok = read === value;
    out.append(
      h('div', { class: 'mj-row' }, h('span', { class: 'widget-label' }, '1. Texto original'), h('span', { class: 'mj-text' }, value || ' ')),
      h('div', { class: 'mj-row' }, h('span', { class: 'widget-label' }, `2. Bytes (${ENCODINGS[w]})`),
        h('span', { class: 'mono mj-bytes' }, bytes.map((b) => toHex(b)).join(' ') || '—')),
      unencodable.length ? h('p', { class: 'widget-warning' }, `${ENCODINGS[w]} no puede representar: ${[...new Set(unencodable)].join(' ')}. Se ha escrito «?» en su lugar: esa información se pierde para siempre.`) : null,
      h('div', { class: 'mj-row' }, h('span', { class: 'widget-label' }, `3. Leído como ${ENCODINGS[r]}`), h('span', { class: `mj-text ${ok ? 'ok' : 'bad'}` }, read)),
      h('p', { class: ok ? 'tc-ok' : 'tc-warn' }, ok
        ? 'Se recupera el texto original: quien lee usa la misma convención que quien escribió.'
        : unencodable.length && w === r
          ? 'El texto no se recupera porque la codificación de escritura no podía representarlo: no es un error de lectura, sino una pérdida al escribir.'
          : read.includes('�')
          ? 'Algunos bytes no forman una secuencia válida en la codificación de lectura y se muestran como «�» (U+FFFD, carácter de sustitución).'
          : 'Mojibake: los bytes son correctos, pero se interpretan con otra tabla. Ningún dato se ha alterado; solo la convención de lectura es errónea.'),
    );
  }

  render();
}
