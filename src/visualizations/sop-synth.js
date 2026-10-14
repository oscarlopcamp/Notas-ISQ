// De la tabla de verdad al circuito: suma de productos canónica, simplificación
// (Quine–McCluskey) y mapa de Karnaugh con los grupos elegidos.

import { h, clear } from '../utils/dom.js';
import { canonicalSOP, simplifySOP, parse, equivalent } from '../utils/logic.js';

const VARS = ['A', 'B', 'C'];
const PRESETS = {
  Mayoría: [0, 0, 0, 1, 0, 1, 1, 1],
  'Paridad (XOR)': [0, 1, 1, 0, 1, 0, 0, 1],
  'Multiplexor (A = 0 → B; A = 1 → C)': [0, 0, 1, 1, 0, 1, 0, 1],
  'Solo 111': [0, 0, 0, 0, 0, 0, 0, 1],
  'Todo salvo 000': [0, 1, 1, 1, 1, 1, 1, 1],
};
const GRAY = [0, 1, 3, 2]; // orden de las columnas BC en el mapa de Karnaugh: 00, 01, 11, 10
const COLORS = ['k1', 'k2', 'k3', 'k4'];

const covers = (imp, m) => [...imp].every((c, p) => c === '-' || c === String((m >> (2 - p)) & 1));

export function mount(root, { preset = 'Mayoría' } = {}) {
  let out = [...PRESETS[preset]];
  const table = h('div');
  const kmap = h('div', { class: 'kmap-wrap' });
  const result = h('div', { class: 'sop-result' });

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Funciones'),
      Object.keys(PRESETS).map((k) => h('button', { type: 'button', class: 'chip', onclick: () => { out = [...PRESETS[k]]; render(); } }, k))),
    h('p', { class: 'muted small' }, 'Pulsa la columna Y para decidir qué debe valer la función en cada fila.'),
    h('div', { class: 'sop-layout' }, table, kmap),
    result,
  );

  function render() {
    const simp = simplifySOP(VARS, out);
    const canon = canonicalSOP(VARS, out);
    clear(table);
    table.append(h('table', { class: 'tt-table' },
      h('thead', {}, h('tr', {}, VARS.map((v) => h('th', { class: 'mono' }, v)), h('th', { class: 'tt-out' }, 'Y'))),
      h('tbody', {}, out.map((y, m) => h('tr', { class: y ? 'tt-one' : '' },
        VARS.map((_, i) => h('td', { class: 'mono' }, (m >> (2 - i)) & 1)),
        h('td', {}, h('button', { type: 'button', class: `sop-toggle ${y ? 'on' : ''}`, 'aria-label': `Fila ${m}: Y = ${y}`, onclick: () => { out[m] = 1 - out[m]; render(); } }, y)))))));

    clear(kmap);
    const grid = h('table', { class: 'kmap', 'aria-label': 'Mapa de Karnaugh' },
      h('caption', {}, 'Mapa de Karnaugh (columnas BC en código Gray)'),
      h('thead', {}, h('tr', {}, h('th', {}, 'A \\ BC'), GRAY.map((g) => h('th', { class: 'mono' }, g.toString(2).padStart(2, '0'))))),
      h('tbody', {}, [0, 1].map((a) => h('tr', {}, h('th', { class: 'mono' }, a),
        GRAY.map((g) => {
          const m = (a << 2) | g;
          const groups = simp.implicants.map((imp, k) => (covers(imp, m) ? COLORS[k % COLORS.length] : null)).filter(Boolean);
          return h('td', { class: `mono kcell ${out[m] ? 'one' : ''}` }, out[m], h('span', { class: 'kdots' }, groups.map((c) => h('i', { class: c }))));
        })))));
    kmap.append(grid,
      h('p', { class: 'muted small' }, 'Celdas vecinas (también a través de los bordes) difieren en una sola variable; agrupar unos vecinos elimina esa variable.'));

    clear(result);
    const ones = out.filter(Boolean).length;
    const termsCanon = ones;
    const verified = equivalent(parse(simp.expression), parse(canon)).equal;
    result.append(
      h('p', {}, h('b', {}, 'Suma de productos canónica: '), h('code', {}, canon)),
      h('p', { class: 'muted small' }, `Un término AND de 3 entradas por cada fila con Y = 1 (${termsCanon}), unidos por un OR.`),
      h('p', {}, h('b', {}, 'Simplificada: '), h('code', {}, simp.expression),
        simp.implicants.length ? h('span', { class: 'kdots inline' }, simp.implicants.map((_, k) => h('i', { class: COLORS[k % COLORS.length] }))) : null),
      h('p', { class: verified ? 'tc-ok' : 'tc-warn' }, verified ? '✓ Comprobado: ambas expresiones coinciden en las 8 filas.' : 'Las expresiones no coinciden.'),
    );
  }

  render();
}
