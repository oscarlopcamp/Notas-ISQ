// Patio de compuertas: elige una compuerta, cambia sus entradas y observa
// la salida y la fila correspondiente de su tabla de verdad.

import { h, svg, clear } from '../utils/dom.js';
import { GATES } from '../utils/logic.js';
import { renderSchematic } from './schematic.js';

const INFO = {
  AND: 'Vale 1 solo si todas las entradas valen 1 (conjunción, «y»).',
  OR: 'Vale 1 si al menos una entrada vale 1 (disyunción, «o» inclusivo).',
  NOT: 'Invierte la entrada (negación). Es la única compuerta básica de una entrada.',
  XOR: 'Vale 1 si las entradas son distintas («o» exclusivo). Equivale a sumar módulo 2.',
  NAND: 'Negación de AND. Por sí sola permite construir cualquier función lógica.',
  NOR: 'Negación de OR. También es universal.',
  XNOR: 'Negación de XOR: vale 1 si las entradas son iguales (comparador de igualdad).',
};

export function mount(root, { gate = 'AND' } = {}) {
  let type = gate;
  let inputs = { A: 0, B: 1 };
  const chips = Object.keys(GATES).map((g) => h('button', { type: 'button', class: 'chip mono', onclick: () => { type = g; render(); } }, g));
  const pic = svg('svg', { class: 'sch-svg gate-svg', role: 'img' });
  const desc = h('p', { class: 'gate-desc' });
  const table = h('div', { class: 'gate-table' });

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Compuerta'), chips),
    h('div', { class: 'gate-layout' }, h('div', {}, pic, h('p', { class: 'muted small' }, 'Pulsa las entradas (círculos de la izquierda) para cambiarlas.')), table),
    desc,
  );

  function render() {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.textContent === type)));
    const unary = GATES[type].arity === 1;
    const layout = {
      w: 360, h: 160,
      inputs: unary ? [{ id: 'A', label: 'A', x: 50, y: 80 }] : [{ id: 'A', label: 'A', x: 50, y: 50 }, { id: 'B', label: 'B', x: 50, y: 110 }],
      gates: [{ id: 'g', type, x: 150, y: 60, in: unary ? ['A'] : ['A', 'B'] }],
      outputs: [{ id: 'Y', src: 'g', label: 'Y', x: 300, y: 80 }],
    };
    renderSchematic(pic, layout, inputs, { onToggle: (id) => { inputs[id] = 1 - inputs[id]; render(); } });
    pic.setAttribute('aria-label', `Compuerta ${type} con entradas ${unary ? `A = ${inputs.A}` : `A = ${inputs.A}, B = ${inputs.B}`}`);

    clear(table);
    const rows = unary ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
    const current = unary ? [inputs.A] : [inputs.A, inputs.B];
    table.append(h('table', { class: 'tt-table' },
      h('thead', {}, h('tr', {}, (unary ? ['A'] : ['A', 'B']).map((v) => h('th', { class: 'mono' }, v)), h('th', { class: 'mono tt-out' }, `Y = ${type}`))),
      h('tbody', {}, rows.map((r) => h('tr', { class: r.join() === current.join() ? 'tt-active' : '' },
        r.map((v) => h('td', { class: 'mono' }, v)), h('td', { class: 'mono tt-out' }, GATES[type].fn(...r)))))));
    desc.textContent = INFO[type];
  }

  render();
}
