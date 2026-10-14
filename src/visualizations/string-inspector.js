// Inspector de cadenas: grafemas, puntos de código, unidades UTF-16 y bytes UTF-8,
// normalización (NFC/NFD) y detección de escrituras mezcladas.

import { h, clear } from '../utils/dom.js';
import { graphemes, codePoints, utf16Units, utf8Bytes, scriptOf, scriptsUsed } from '../utils/unicode.js';
import { codePointLabel, toHex } from '../utils/encoding.js';

const PRESETS = [
  ['café (NFC)', 'café'],
  ['café (NFD)', 'café'],
  ['👍🏽', '👍🏽'],
  ['🇪🇸', '🇪🇸'],
  ['𝄞', '𝄞'],
  ['pаypal', 'pаypal'],
  ['Ñandú', 'Ñandú'],
];

function kindOf(ch) {
  if (/\p{M}/u.test(ch)) return 'marca combinante';
  if (/\p{Regional_Indicator}/u.test(ch)) return 'indicador regional';
  if (/\p{Emoji_Modifier}/u.test(ch)) return 'modificador de tono';
  if (/\p{Extended_Pictographic}/u.test(ch)) return 'pictograma (emoji)';
  if (/\p{L}/u.test(ch)) return 'letra';
  if (/\p{N}/u.test(ch)) return 'número';
  if (/\s/u.test(ch)) return 'espacio';
  if (/\p{P}|\p{S}/u.test(ch)) return 'signo';
  return 'otro';
}

export function mount(root, { text = 'café' } = {}) {
  let value = text;
  const input = h('input', { type: 'text', value, spellcheck: 'false', 'aria-label': 'Texto que se va a inspeccionar', oninput: (e) => { value = e.target.value; render(); } });
  const counts = h('div', { class: 'si-counts' });
  const warn = h('p', { class: 'widget-warning', hidden: true });
  const table = h('div', { class: 'si-graphemes' });

  const setText = (t) => { value = t; input.value = t; render(); };
  root.append(
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'Texto'), input),
    h('div', { class: 'widget-controls subtle' }, h('span', { class: 'widget-label' }, 'Probar'),
      PRESETS.map(([label, t]) => h('button', { type: 'button', class: 'chip', onclick: () => setText(t) }, label)),
      h('button', { type: 'button', class: 'chip', title: 'Composición canónica', onclick: () => setText(value.normalize('NFC')) }, '→ NFC'),
      h('button', { type: 'button', class: 'chip', title: 'Descomposición canónica', onclick: () => setText(value.normalize('NFD')) }, '→ NFD')),
    counts, warn, table,
  );

  function render() {
    const g = graphemes(value);
    clear(counts);
    const stat = (n, label, note) => h('div', { class: 'si-stat' }, h('b', {}, n), h('span', {}, label), h('small', {}, note));
    counts.append(
      stat(g.length, 'grafemas', 'lo que una persona cuenta como «caracteres»'),
      stat(codePoints(value).length, 'puntos de código', 'len() en Python'),
      stat(utf16Units(value).length, 'unidades UTF-16', '.length en JavaScript y Java'),
      stat(utf8Bytes(value).length, 'bytes en UTF-8', 'tamaño en un archivo o en la red'),
    );

    const scripts = scriptsUsed(value);
    warn.hidden = scripts.length < 2;
    warn.textContent = scripts.length >= 2
      ? `Atención: el texto mezcla escrituras (${scripts.join(', ')}). Caracteres de alfabetos distintos pueden verse idénticos; es una técnica conocida de suplantación (UTS #39).`
      : '';

    clear(table);
    g.forEach((cluster, i) => {
      const cps = Array.from(cluster);
      table.append(h('div', { class: 'si-cluster' },
        h('div', { class: 'si-glyph', 'aria-label': `Grafema ${i + 1}` }, cluster === ' ' ? '␠' : cluster),
        h('ul', { class: 'si-cps' }, cps.map((c) => {
          const cp = c.codePointAt(0);
          const units = utf16Units(c);
          return h('li', {},
            h('span', { class: 'mono si-cp' }, codePointLabel(cp)),
            h('span', { class: 'si-kind' }, kindOf(c), scriptOf(c) !== 'Common' && scriptOf(c) !== 'Inherited' ? ` · ${scriptOf(c)}` : ''),
            h('span', { class: 'mono si-bytes', title: 'Bytes UTF-8' }, utf8Bytes(c).map((b) => toHex(b)).join(' ')),
            units.length > 1 ? h('span', { class: 'si-sur', title: 'Par sustituto UTF-16' }, `UTF-16: ${units.map((u) => toHex(u, 4)).join(' ')}`) : null);
        }))));
    });
    if (!g.length) table.append(h('p', { class: 'muted widget-empty' }, 'Escribe algo para inspeccionarlo.'));
  }

  render();
}
