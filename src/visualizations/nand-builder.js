// Universalidad de NAND: NOT, AND, OR y XOR construidas solo con compuertas NAND.

import { h, svg, clear } from '../utils/dom.js';
import { GATES } from '../utils/logic.js';
import { renderSchematic } from './schematic.js';

const CIRCUITS = {
  NOT: {
    formula: 'A NAND A = ¬(A·A) = ¬A',
    target: (v) => 1 - v.A,
    layout: { w: 420, h: 160, inputs: [{ id: 'A', label: 'A', x: 50, y: 80 }],
      gates: [{ id: 'n1', type: 'NAND', x: 170, y: 60, in: ['A', 'A'], bends: [120, 120] }],
      outputs: [{ id: 'Y', src: 'n1', label: '¬A', x: 340, y: 80 }] },
  },
  AND: {
    formula: '¬(A NAND B) = ¬¬(A·B) = A·B',
    target: (v) => v.A & v.B,
    layout: { w: 500, h: 180, inputs: [{ id: 'A', label: 'A', x: 50, y: 60 }, { id: 'B', label: 'B', x: 50, y: 120 }],
      gates: [{ id: 'n1', type: 'NAND', x: 150, y: 70, in: ['A', 'B'] }, { id: 'n2', type: 'NAND', x: 270, y: 70, in: ['n1', 'n1'], bends: [230, 230] }],
      outputs: [{ id: 'Y', src: 'n2', label: 'A·B', x: 410, y: 90 }] },
  },
  OR: {
    formula: '(¬A) NAND (¬B) = ¬(¬A·¬B) = A + B   (De Morgan)',
    target: (v) => v.A | v.B,
    layout: { w: 520, h: 220, inputs: [{ id: 'A', label: 'A', x: 50, y: 50 }, { id: 'B', label: 'B', x: 50, y: 170 }],
      gates: [
        { id: 'n1', type: 'NAND', x: 140, y: 30, in: ['A', 'A'], bends: [100, 100] },
        { id: 'n2', type: 'NAND', x: 140, y: 150, in: ['B', 'B'], bends: [100, 100] },
        { id: 'n3', type: 'NAND', x: 290, y: 90, in: ['n1', 'n2'] }],
      outputs: [{ id: 'Y', src: 'n3', label: 'A + B', x: 430, y: 110 }] },
  },
  XOR: {
    formula: 'Con m = A NAND B:  (A NAND m) NAND (B NAND m) = A ⊕ B',
    target: (v) => v.A ^ v.B,
    layout: { w: 620, h: 240, inputs: [{ id: 'A', label: 'A', x: 50, y: 60 }, { id: 'B', label: 'B', x: 50, y: 180 }],
      gates: [
        { id: 'm', type: 'NAND', x: 150, y: 100, in: ['A', 'B'], bends: [110, 110] },
        { id: 'p', type: 'NAND', x: 280, y: 40, in: ['A', 'm'], bends: [90, 240] },
        { id: 'q', type: 'NAND', x: 280, y: 160, in: ['B', 'm'], bends: [90, 240] },
        { id: 'x', type: 'NAND', x: 400, y: 100, in: ['p', 'q'] }],
      outputs: [{ id: 'Y', src: 'x', label: 'A ⊕ B', x: 520, y: 120 }] },
  },
};

export function mount(root, { target = 'XOR' } = {}) {
  let which = target;
  let inputs = { A: 1, B: 0 };
  const chips = Object.keys(CIRCUITS).map((k) => h('button', { type: 'button', class: 'chip mono', onclick: () => { which = k; render(); } }, k));
  const pic = svg('svg', { class: 'sch-svg', role: 'img' });
  const status = h('div', { class: 'nb-status' });

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Construir'), chips),
    pic, status,
  );

  function render() {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.textContent === which)));
    const c = CIRCUITS[which];
    const values = renderSchematic(pic, c.layout, inputs, { onToggle: (id) => { inputs[id] = 1 - inputs[id]; render(); } });
    pic.setAttribute('aria-label', `${which} construida con ${c.layout.gates.length} compuertas NAND`);
    const got = values[c.layout.outputs[0].src];
    clear(status);
    // Verificación exhaustiva: el circuito coincide con la función objetivo en todas las entradas
    const ids = c.layout.inputs.map((i) => i.id);
    let allOk = true;
    for (let m = 0; m < 2 ** ids.length; m += 1) {
      const env = Object.fromEntries(ids.map((id, i) => [id, (m >> (ids.length - 1 - i)) & 1]));
      const vals = { ...env };
      c.layout.gates.forEach((g) => { vals[g.id] = GATES[g.type].fn(...g.in.map((s) => vals[s])); });
      if (vals[c.layout.outputs[0].src] !== c.target(env)) allOk = false;
    }
    status.append(
      h('p', {}, h('code', {}, c.formula)),
      h('p', {}, `${c.layout.gates.length} compuerta${c.layout.gates.length > 1 ? 's' : ''} NAND. Salida actual: ${got}. `,
        h('span', { class: allOk ? 'tc-ok' : 'tc-warn' }, allOk ? `✓ Coincide con ${which} en las ${2 ** ids.length} combinaciones de entrada.` : 'No coincide.')),
    );
  }

  render();
}
