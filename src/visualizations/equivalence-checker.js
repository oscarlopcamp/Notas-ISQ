// Comprobador de equivalencia: ¿dos expresiones booleanas valen lo mismo en
// todas las combinaciones de entradas? Si no, muestra los contraejemplos.

import { h, clear } from '../utils/dom.js';
import { parse, equivalent, format, LogicSyntaxError } from '../utils/logic.js';

const PRESETS = [
  ['De Morgan (1)', '¬(A·B)', '¬A + ¬B'],
  ['De Morgan (2)', '¬(A + B)', '¬A·¬B'],
  ['Error típico', '¬(A·B)', '¬A·¬B'],
  ['Absorción', 'A + A·B', 'A'],
  ['Distributiva', 'A + B·C', '(A + B)·(A + C)'],
  ['XOR', 'A ⊕ B', '(A + B)·¬(A·B)'],
];

export function mount(root, { left = '¬(A·B)', right = '¬A + ¬B' } = {}) {
  let a = left, b = right;
  const inA = h('input', { type: 'text', value: a, class: 'mono', spellcheck: 'false', 'aria-label': 'Primera expresión', oninput: (e) => { a = e.target.value; render(); } });
  const inB = h('input', { type: 'text', value: b, class: 'mono', spellcheck: 'false', 'aria-label': 'Segunda expresión', oninput: (e) => { b = e.target.value; render(); } });
  const out = h('div');

  root.append(
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'F'), inA),
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'G'), inB),
    h('div', { class: 'widget-controls subtle' }, h('span', { class: 'widget-label' }, 'Probar'),
      PRESETS.map(([label, x, y]) => h('button', { type: 'button', class: 'chip', onclick: () => { a = x; b = y; inA.value = x; inB.value = y; render(); } }, label))),
    out,
  );

  function render() {
    clear(out);
    let fa, fb;
    try { fa = parse(a); fb = parse(b); } catch (err) {
      if (!(err instanceof LogicSyntaxError)) throw err;
      out.append(h('p', { class: 'widget-warning' }, err.message));
      return;
    }
    const r = equivalent(fa, fb);
    if (r.vars.length > 4) { out.append(h('p', { class: 'widget-warning' }, 'Usa como máximo 4 variables.')); return; }
    out.append(
      h('div', { class: `eq-verdict ${r.equal ? 'ok' : 'bad'}` },
        r.equal
          ? `F ≡ G: coinciden en las ${r.rowsA.length} combinaciones posibles. Comprobar todas las filas es una demostración completa.`
          : `F y G no son equivalentes: difieren en ${r.differences.length} de ${r.rowsA.length} combinaciones (filas marcadas). Basta un solo contraejemplo para descartar una ley.`),
      h('div', { class: 'table-wrap' }, h('table', { class: 'tt-table' },
        h('thead', {}, h('tr', {}, r.vars.map((v) => h('th', { class: 'mono' }, v)), h('th', { class: 'mono tt-out' }, `F = ${format(fa)}`), h('th', { class: 'mono tt-out' }, `G = ${format(fb)}`))),
        h('tbody', {}, r.rowsA.map((row, i) => h('tr', { class: row.out !== r.rowsB[i].out ? 'eq-diff' : '' },
          r.vars.map((v) => h('td', { class: 'mono' }, row.env[v] ? '1' : '0')),
          h('td', { class: 'mono tt-out' }, row.out ? '1' : '0'),
          h('td', { class: 'mono tt-out' }, r.rowsB[i].out ? '1' : '0')))))),
    );
  }

  render();
}
