// Del texto a la ejecución: tokens → árbol sintáctico → código de pila → ejecución.

import { h, svg, clear } from '../utils/dom.js';
import { tokenize, parse, compile, execute, formatInstruction, CompileError } from '../utils/exprcompiler.js';

function layoutTree(tree) {
  // Coordenadas por recorrido en orden: x según el orden de las hojas, y según la profundidad.
  let leaf = 0;
  const nodes = [], edges = [];
  const walk = (n, depth) => {
    let x;
    if (n.type === 'num') { x = leaf; leaf += 1; }
    else { const l = walk(n.left, depth + 1); const r = walk(n.right, depth + 1); x = (l.x + r.x) / 2; edges.push([{ x, depth }, l], [{ x, depth }, r]); }
    const node = { x, depth, label: n.type === 'num' ? String(n.value) : n.op, op: n.type !== 'num' };
    nodes.push(node);
    return node;
  };
  walk(tree, 0);
  return { nodes, edges, width: leaf, depth: Math.max(...nodes.map((n) => n.depth)) + 1 };
}

export function mount(root, { expression = '(2 + 3) * 4' } = {}) {
  let src = expression, step = 0, compiled = null;
  const input = h('input', { type: 'text', value: src, class: 'mono', 'aria-label': 'Expresión aritmética', oninput: (e) => { src = e.target.value; step = 0; render(); } });
  const tokensBox = h('div', { class: 'ec-tokens' });
  const treeBox = svg('svg', { class: 'ec-tree', role: 'img', 'aria-label': 'Árbol sintáctico' });
  const codeBox = h('ol', { class: 'ec-code mono' });
  const stackBox = h('div', { class: 'ec-stack' });
  const msg = h('p', { class: 'small' });
  const stepBtn = h('button', { type: 'button', class: 'btn primary', onclick: () => { step += 1; render(); } }, 'Ejecutar una instrucción');

  root.append(
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'Expresión'), input,
      ['(2 + 3) * 4', '2 + 3 * 4', '10 - 3 - 2', '(1 + 2) * (3 + 4)'].map((p) => h('button', { type: 'button', class: 'chip mono', onclick: () => { src = p; input.value = p; step = 0; render(); } }, p))),
    msg,
    h('div', { class: 'ec-grid' },
      h('section', {}, h('h5', {}, '1. Análisis léxico: tokens'), tokensBox),
      h('section', {}, h('h5', {}, '2. Análisis sintáctico: árbol'), treeBox),
      h('section', {}, h('h5', {}, '3. Generación de código'), codeBox),
      h('section', {}, h('h5', {}, '4. Ejecución en la máquina de pila'), stackBox,
        h('div', { class: 'btn-row' }, stepBtn, h('button', { type: 'button', class: 'btn', onclick: () => { step = 0; render(); } }, 'Reiniciar')))),
  );

  function render() {
    [tokensBox, treeBox, codeBox, stackBox].forEach(clear);
    let tokens;
    try {
      tokens = tokenize(src);
      const tree = parse(tokens);
      compiled = { tree, code: compile(tree) };
      msg.className = 'small muted';
      msg.textContent = 'Fíjate en que el árbol ya no tiene paréntesis: la estructura del árbol los hace innecesarios.';
    } catch (err) {
      if (!(err instanceof CompileError)) throw err;
      msg.className = 'small tc-warn';
      msg.textContent = `Error de compilación: ${err.message}${Number.isFinite(err.position) ? ` (posición ${err.position + 1})` : ''}.`;
      compiled = null;
    }
    (tokens || []).forEach((t) => tokensBox.append(h('span', { class: `ec-token ${t.type === 'num' ? 'num' : t.type === 'op' ? 'op' : 'par'}` },
      h('b', { class: 'mono' }, t.text), h('small', {}, t.type === 'num' ? 'número' : t.type === 'op' ? 'operador' : 'paréntesis'))));
    if (!compiled) { stepBtn.disabled = true; return; }

    const L = layoutTree(compiled.tree);
    const W = Math.max(L.width * 56, 120), Hh = L.depth * 56;
    treeBox.setAttribute('viewBox', `0 0 ${W} ${Hh}`);
    const px = (x) => 28 + x * 56 * (W - 56) / Math.max((L.width - 1) * 56, 1) / 1;
    const py = (d) => 26 + d * 52;
    L.edges.forEach(([a, b]) => treeBox.append(svg('line', { x1: px(a.x), y1: py(a.depth), x2: px(b.x), y2: py(b.depth), class: 'ec-edge' })));
    L.nodes.forEach((n) => treeBox.append(svg('g', { class: `ec-node ${n.op ? 'op' : ''}` },
      svg('circle', { cx: px(n.x), cy: py(n.depth), r: 17 }),
      svg('text', { x: px(n.x), y: py(n.depth) + 5, 'text-anchor': 'middle' }, n.label === '*' ? '×' : n.label))));

    const { trace, result } = execute(compiled.code);
    step = Math.min(step, compiled.code.length);
    compiled.code.forEach((ins, i) => codeBox.append(h('li', { class: i === step - 1 ? 'current' : i < step ? 'done' : '' }, formatInstruction(ins))));
    const stack = step ? trace[step - 1].stack : [];
    stackBox.append(
      h('div', { class: 'ec-stack-cells' }, stack.length ? [...stack].reverse().map((v, i) => h('div', { class: `ec-cell mono ${i === 0 ? 'top' : ''}` }, v)) : h('div', { class: 'muted small' }, 'pila vacía')),
      h('p', { class: 'small' }, step === 0
        ? 'PUSH apila un número; ADD, SUB y MUL desapilan dos, operan y apilan el resultado.'
        : step < compiled.code.length ? `Ejecutada: ${formatInstruction(compiled.code[step - 1])}.` : `Resultado: ${result}. La pila termina con un único valor.`));
    stepBtn.disabled = step >= compiled.code.length;
  }

  render();
}
