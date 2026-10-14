// Simulador de circuitos combinacionales con propagación por niveles.

import { h, svg, clear } from '../utils/dom.js';
import { renderSchematic, evaluateLayout } from './schematic.js';

const FA_LAYOUT = (() => {
  const inputs = [{ id: 'C0', label: 'C₀ = 0', x: 560, y: 132, fixed: true }];
  const gates = [];
  const outputs = [];
  for (let i = 0; i < 4; i += 1) {
    const x = 400 - i * 120;
    inputs.push({ id: `A${i}`, label: `A${i}`, x: x + 18, y: 40, labelAbove: true }, { id: `B${i}`, label: `B${i}`, x: x + 46, y: 40, labelAbove: true });
    gates.push({ id: `fa${i}`, type: 'FA', x, y: 100, in: [`A${i}`, `B${i}`, i === 0 ? 'C0' : `fa${i - 1}.Cout`], label: `bit ${i}` });
    outputs.push({ id: `S${i}`, src: `fa${i}.S`, label: `S${i}`, x: x + 32, y: 230, labelBelow: true });
  }
  outputs.push({ id: 'C4', src: 'fa3.Cout', label: 'C₄', x: 40, y: 230, labelBelow: true });
  return { w: 620, h: 280, inputs, gates, outputs };
})();

const CIRCUITS = {
  half: {
    title: 'Semisumador',
    text: 'Suma dos bits. S = A ⊕ B es el bit de la suma; C = A·B es el acarreo. Es la columna de la derecha de una suma binaria, donde no llega acarreo.',
    layout: { w: 420, h: 210,
      inputs: [{ id: 'A', label: 'A', x: 40, y: 60 }, { id: 'B', label: 'B', x: 40, y: 150 }],
      gates: [{ id: 'x', type: 'XOR', x: 170, y: 50, in: ['A', 'B'], bends: [100, 130] }, { id: 'a', type: 'AND', x: 170, y: 130, in: ['A', 'B'], bends: [100, 130] }],
      outputs: [{ id: 'S', src: 'x', label: 'S (suma)', x: 320, y: 70 }, { id: 'C', src: 'a', label: 'C (acarreo)', x: 320, y: 150 }] },
    ins: ['A', 'B'], outs: ['S', 'C'],
  },
  full: {
    title: 'Sumador completo',
    text: 'Suma tres bits: A, B y el acarreo que llega (Cᵢₙ). Está formado por dos semisumadores y una compuerta OR para combinar los dos posibles acarreos.',
    layout: { w: 600, h: 250,
      inputs: [{ id: 'A', label: 'A', x: 40, y: 50 }, { id: 'B', label: 'B', x: 40, y: 110 }, { id: 'Cin', label: 'Cᵢₙ', x: 40, y: 210 }],
      gates: [
        { id: 'x1', type: 'XOR', x: 140, y: 40, in: ['A', 'B'], bends: [90, 100] },
        { id: 'S', type: 'XOR', x: 300, y: 60, in: ['x1', 'Cin'], bends: [250, 230] },
        { id: 'a1', type: 'AND', x: 140, y: 130, in: ['A', 'B'], bends: [110, 90] },
        { id: 'a2', type: 'AND', x: 300, y: 160, in: ['x1', 'Cin'], bends: [250, 230] },
        { id: 'o', type: 'OR', x: 430, y: 140, in: ['a1', 'a2'], bends: [400, 400] }],
      outputs: [{ id: 'Sout', src: 'S', label: 'S', x: 540, y: 80 }, { id: 'Cout', src: 'o', label: 'Cₒᵤₜ', x: 540, y: 160 }] },
    ins: ['A', 'B', 'Cin'], outs: ['S', 'o'],
  },
  mux: {
    title: 'Multiplexor 2:1',
    text: 'Elige entre dos datos según una señal de selección: si Sel = 0, Y = D₀; si Sel = 1, Y = D₁. Expresión: Y = D₀·¬Sel + D₁·Sel. Es un «if» hecho con compuertas.',
    layout: { w: 560, h: 250,
      inputs: [{ id: 'D0', label: 'D₀', x: 40, y: 40 }, { id: 'D1', label: 'D₁', x: 40, y: 130 }, { id: 'Sel', label: 'Sel', x: 40, y: 220 }],
      gates: [
        { id: 'ns', type: 'NOT', x: 110, y: 160, in: ['Sel'], bends: [80] },
        { id: 'a0', type: 'AND', x: 260, y: 30, in: ['D0', 'ns'], bends: [200, 200] },
        { id: 'a1', type: 'AND', x: 260, y: 120, in: ['D1', 'Sel'], bends: [200, 220] },
        { id: 'o', type: 'OR', x: 390, y: 70, in: ['a0', 'a1'], bends: [350, 350] }],
      outputs: [{ id: 'Y', src: 'o', label: 'Y', x: 510, y: 90 }] },
    ins: ['D0', 'D1', 'Sel'], outs: ['o'],
  },
  ripple: {
    title: 'Sumador de 4 bits',
    text: 'Cuatro sumadores completos en cadena: el acarreo de cada uno entra en el siguiente («ripple carry»). Pulsa «Propagar un nivel» y observa cómo el acarreo debe recorrer los cuatro bloques: cuantos más bits, más tarda en estabilizarse el resultado.',
    layout: FA_LAYOUT,
    ins: ['A3', 'A2', 'A1', 'A0', 'B3', 'B2', 'B1', 'B0'], outs: [],
  },
};

export function mount(root, { circuit = 'half' } = {}) {
  let which = circuit;
  let inputs = {};
  let level = Infinity;
  const chips = Object.entries(CIRCUITS).map(([k, c]) => h('button', { type: 'button', class: 'chip', dataset: { k }, onclick: () => { which = k; reset(); render(); } }, c.title));
  const pic = svg('svg', { class: 'sch-svg', role: 'img' });
  const desc = h('p', {});
  const side = h('div', { class: 'cs-side' });
  const stepBtn = h('button', { type: 'button', class: 'btn', onclick: () => { level = level === Infinity ? 1 : level + 1; render(); } }, 'Propagar un nivel');
  const allBtn = h('button', { type: 'button', class: 'btn', onclick: () => { level = Infinity; render(); } }, 'Mostrar todo');
  const levelInfo = h('span', { class: 'muted small' });

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Circuito'), chips),
    pic,
    h('div', { class: 'btn-row' }, stepBtn, allBtn, levelInfo),
    desc, side,
  );

  function reset() {
    const c = CIRCUITS[which];
    inputs = Object.fromEntries(c.layout.inputs.map((i) => [i.id, 0]));
    if (which === 'ripple') Object.assign(inputs, { A0: 1, A1: 1, A2: 1, B0: 1 }); // 7 + 1
    if (which === 'half' || which === 'full') inputs.A = 1;
    level = Infinity;
  }

  function render() {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.k === which)));
    const c = CIRCUITS[which];
    const { maxDepth } = evaluateLayout(c.layout, inputs);
    if (level !== Infinity && level >= maxDepth) level = Infinity;
    const values = renderSchematic(pic, c.layout, inputs, { level, onToggle: (id) => { inputs[id] = 1 - inputs[id]; level = Infinity; render(); } });
    pic.setAttribute('aria-label', `Esquema del ${c.title}`);
    levelInfo.textContent = level === Infinity ? `Profundidad del circuito: ${maxDepth} nivel${maxDepth > 1 ? 'es' : ''} de ${which === 'ripple' ? 'bloques' : 'compuertas'}.` : `Nivel ${level} de ${maxDepth}: las señales grises aún no se han calculado.`;
    desc.textContent = c.text;
    clear(side);
    if (which === 'ripple') {
      const a = [3, 2, 1, 0].reduce((acc, i) => acc * 2 + inputs[`A${i}`], 0);
      const b = [3, 2, 1, 0].reduce((acc, i) => acc * 2 + inputs[`B${i}`], 0);
      const s = [3, 2, 1, 0].reduce((acc, i) => acc * 2 + values[`fa${i}.S`], 0) + 16 * values['fa3.Cout'];
      side.append(h('p', { class: 'widget-stats' }, `A = ${a}, B = ${b}  →  C₄S₃S₂S₁S₀ = ${s.toString(2).padStart(5, '0')} = ${s}  ${a + b === s ? '✓' : '✗'}`));
      return;
    }
    // Tabla de verdad del circuito con la fila actual resaltada
    const outIds = c.layout.outputs.map((o) => o.src);
    const rows = [];
    for (let m = 0; m < 2 ** c.ins.length; m += 1) {
      const env = Object.fromEntries(c.ins.map((id, i) => [id, (m >> (c.ins.length - 1 - i)) & 1]));
      const v = evaluateLayout(c.layout, env).values;
      const active = c.ins.every((id) => env[id] === inputs[id]);
      rows.push(h('tr', { class: active ? 'tt-active' : '' }, c.ins.map((id) => h('td', { class: 'mono' }, env[id])), outIds.map((o) => h('td', { class: 'mono tt-out' }, v[o]))));
    }
    side.append(h('table', { class: 'tt-table' },
      h('thead', {}, h('tr', {}, c.layout.inputs.map((i) => h('th', {}, i.label)), c.layout.outputs.map((o) => h('th', { class: 'tt-out' }, o.label)))),
      h('tbody', {}, rows)));
  }

  reset();
  render();
}
