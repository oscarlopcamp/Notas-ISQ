// Generador de tablas de verdad con columnas para cada subexpresión.

import { h, clear } from '../utils/dom.js';
import { parse, evaluate, format, variables, canonicalSOP, LogicSyntaxError } from '../utils/logic.js';

const PRESETS = ['A·B', 'A + B', '¬A', 'A ⊕ B', '¬(A·B)', 'A·(B + C)', 'A·B + A·C + B·C'];
const SYNTAX = 'Variables A–F · NOT: ¬A, A\', !A · AND: A·B, AB, A*B · OR: A + B · XOR: A ⊕ B, A ^ B';

/** Subexpresiones en orden de evaluación (postorden), sin repetir ni incluir variables. */
function subexpressions(ast, acc = []) {
  if (ast.a) subexpressions(ast.a, acc);
  if (ast.b) subexpressions(ast.b, acc);
  if (ast.type !== 'var' && ast.type !== 'const' && !acc.some((x) => format(x) === format(ast))) acc.push(ast);
  return acc;
}

export function mount(root, { expression = '¬(A·B)' } = {}) {
  let src = expression;
  const input = h('input', { type: 'text', value: src, class: 'mono', spellcheck: 'false', 'aria-label': 'Expresión booleana', oninput: (e) => { src = e.target.value; render(); } });
  const insert = (sym) => h('button', { type: 'button', class: 'chip mono', title: `Insertar ${sym}`, onclick: () => {
    const p = input.selectionStart ?? input.value.length;
    input.value = input.value.slice(0, p) + sym + input.value.slice(input.selectionEnd ?? p);
    src = input.value; input.focus(); input.setSelectionRange(p + sym.length, p + sym.length); render();
  } }, sym);
  const out = h('div');

  root.append(
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'Expresión'), input, ['¬', '·', '+', '⊕', '(', ')'].map(insert)),
    h('div', { class: 'widget-controls subtle' }, h('span', { class: 'widget-label' }, 'Probar'),
      PRESETS.map((p) => h('button', { type: 'button', class: 'chip mono', onclick: () => { input.value = p; src = p; render(); } }, p))),
    h('p', { class: 'muted small' }, SYNTAX),
    out,
  );

  function render() {
    clear(out);
    let ast;
    try { ast = parse(src); } catch (err) {
      if (!(err instanceof LogicSyntaxError)) throw err;
      out.append(h('p', { class: 'widget-warning' }, `${err.message}${Number.isFinite(err.position) ? ` (posición ${err.position + 1})` : ''}.`));
      return;
    }
    const vars = variables(ast);
    if (vars.length > 4) { out.append(h('p', { class: 'widget-warning' }, 'Usa como máximo 4 variables (16 filas).')); return; }
    const subs = subexpressions(ast);
    const rows = [];
    const outputs = [];
    for (let m = 0; m < 2 ** vars.length; m += 1) {
      const env = {};
      vars.forEach((v, i) => { env[v] = Boolean((m >> (vars.length - 1 - i)) & 1); });
      const result = evaluate(ast, env);
      outputs.push(result ? 1 : 0);
      rows.push(h('tr', { class: result ? 'tt-one' : '' },
        vars.map((v) => h('td', { class: 'mono' }, env[v] ? '1' : '0')),
        subs.map((s, i) => h('td', { class: `mono ${i === subs.length - 1 ? 'tt-out' : 'tt-mid'}` }, evaluate(s, env) ? '1' : '0'))));
    }
    out.append(
      h('p', { class: 'tt-normal' }, 'Forma normalizada: ', h('code', {}, format(ast))),
      h('div', { class: 'table-wrap' }, h('table', { class: 'tt-table' },
        h('thead', {}, h('tr', {}, vars.map((v) => h('th', { class: 'mono' }, v)), subs.map((s, i) => h('th', { class: `mono ${i === subs.length - 1 ? 'tt-out' : 'tt-mid'}` }, format(s))))),
        h('tbody', {}, rows))),
      h('p', { class: 'widget-stats' }, `${outputs.filter(Boolean).length} de ${outputs.length} filas valen 1. `,
        vars.length ? ['Suma de productos canónica: ', h('code', {}, canonicalSOP(vars, outputs))] : null),
    );
  }

  render();
}
