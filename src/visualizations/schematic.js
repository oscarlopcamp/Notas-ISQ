// Motor de esquemas lógicos en SVG, compartido por los simuladores de compuertas
// y circuitos. Dibuja los símbolos de forma distintiva (ANSI/IEEE Std 91), los cables
// coloreados según su valor y permite mostrar la propagación por niveles.
//
// Un esquema (layout) tiene:
//   inputs:  [{ id, label, x, y, fixed? }]          nodos de entrada (pulsables salvo fixed)
//   gates:   [{ id, type, x, y, in: [fuente…], label? }]   en orden topológico
//   outputs: [{ id, src, label, x, y }]
// Las fuentes son ids de entradas o de compuertas; en un bloque FA (sumador
// completo) las salidas se llaman «id.S» e «id.Cout».

import { svg } from '../utils/dom.js';
import { GATES } from '../utils/logic.js';

const BUBBLE = { NAND: true, NOR: true, XNOR: true, NOT: true };
const OUT_X = { AND: 48, NAND: 56, OR: 56, NOR: 64, XOR: 62, XNOR: 70, NOT: 52, FA: 0 };

export function evaluateLayout(layout, inputValues) {
  const v = { ...inputValues };
  const depth = {};
  layout.inputs.forEach((i) => { depth[i.id] = 0; });
  layout.gates.forEach((g) => {
    const args = g.in.map((s) => v[s]);
    const d = 1 + Math.max(...g.in.map((s) => depth[s] ?? 0));
    if (g.type === 'FA') {
      const [a, b, c] = args;
      v[`${g.id}.S`] = (a + b + c) % 2;
      v[`${g.id}.Cout`] = (a + b + c) >> 1;
      depth[`${g.id}.S`] = d; depth[`${g.id}.Cout`] = d;
    } else {
      v[g.id] = GATES[g.type].fn(...args);
      depth[g.id] = d;
    }
  });
  return { values: v, depth, maxDepth: Math.max(0, ...Object.values(depth)) };
}

function shape(type, x, y) {
  const base = type.replace(/^N(AND|OR)$/, '$1').replace('XNOR', 'XOR');
  let d;
  if (base === 'AND') d = `M${x},${y} H${x + 28} A20,20 0 0 1 ${x + 28},${y + 40} H${x} Z`;
  else if (base === 'OR') d = `M${x},${y} Q${x + 12},${y + 20} ${x},${y + 40} Q${x + 36},${y + 40} ${x + 56},${y + 20} Q${x + 36},${y} ${x},${y} Z`;
  else if (base === 'XOR') d = `M${x + 6},${y} Q${x + 18},${y + 20} ${x + 6},${y + 40} Q${x + 42},${y + 40} ${x + 62},${y + 20} Q${x + 42},${y} ${x + 6},${y} Z`;
  else if (base === 'NOT') d = `M${x},${y + 4} L${x + 44},${y + 20} L${x},${y + 36} Z`;
  const g = svg('g', { class: 'sch-gate' }, svg('path', { d }));
  if (base === 'XOR') g.append(svg('path', { d: `M${x},${y} Q${x + 12},${y + 20} ${x},${y + 40}`, class: 'sch-back' }));
  if (BUBBLE[type]) g.append(svg('circle', { cx: x + OUT_X[type] - 4, cy: y + 20, r: 4 }));
  return g;
}

function pinIn(g, i) {
  if (g.type === 'FA') return [[g.x + 18, g.y], [g.x + 46, g.y], [g.x + 64, g.y + 32]][i];
  if (g.in.length === 1) return [g.x + (g.type === 'XOR' || g.type === 'XNOR' ? 0 : 2), g.y + 20];
  return [g.x + 3, g.y + 10 + i * 20];
}

function source(layout, id) {
  const inp = layout.inputs.find((i) => i.id === id);
  if (inp) return [inp.x + 11, inp.y];
  const [gid, port] = id.split('.');
  const g = layout.gates.find((x) => x.id === gid);
  if (!g) throw new Error(`Fuente desconocida ${id}`);
  if (g.type === 'FA') return port === 'S' ? [g.x + 32, g.y + 64] : [g.x, g.y + 32];
  return [g.x + OUT_X[g.type], g.y + 20];
}

function wirePath([sx, sy], [dx, dy], toTop, bend) {
  if (toTop) return `M${sx},${sy} H${dx} V${dy}`;
  if (Math.abs(sy - dy) < 0.5) return `M${sx},${sy} H${dx}`;
  const mx = bend ?? (sx + dx) / 2;
  return `M${sx},${sy} H${mx} V${dy} H${dx}`;
}

/**
 * Dibuja el esquema en `root` (un <svg>). `level` limita la propagación: las
 * señales con profundidad mayor se muestran como desconocidas.
 */
export function renderSchematic(root, layout, inputValues, { onToggle, level = Infinity } = {}) {
  const { values, depth } = evaluateLayout(layout, inputValues);
  const known = (id) => (depth[id] ?? 0) <= level;
  const cls = (id) => (!known(id) ? 'u' : values[id] ? 'on' : 'off');
  while (root.firstChild) root.removeChild(root.firstChild);
  root.setAttribute('viewBox', `0 0 ${layout.w} ${layout.h}`);
  const wires = svg('g', { class: 'sch-wires' });
  const parts = svg('g');
  root.append(wires, parts);

  layout.gates.forEach((g) => {
    g.in.forEach((src, i) => {
      const toTop = g.type === 'FA' && i < 2;
      wires.append(svg('path', { d: wirePath(source(layout, src), pinIn(g, i), toTop, g.bends?.[i]), class: `sch-wire ${cls(src)}` }));
    });
    if (g.type === 'FA') {
      parts.append(svg('g', { class: `sch-block ${known(`${g.id}.S`) ? '' : 'pending'}` },
        svg('rect', { x: g.x, y: g.y, width: 64, height: 64, rx: 6 }),
        svg('text', { x: g.x + 32, y: g.y + 30, 'text-anchor': 'middle', class: 'sch-block-label' }, 'FA'),
        svg('text', { x: g.x + 32, y: g.y + 46, 'text-anchor': 'middle', class: 'sch-pin-label' }, g.label || ''),
        svg('text', { x: g.x + 18, y: g.y + 12, 'text-anchor': 'middle', class: 'sch-pin-label' }, 'A'),
        svg('text', { x: g.x + 46, y: g.y + 12, 'text-anchor': 'middle', class: 'sch-pin-label' }, 'B'),
        svg('text', { x: g.x + 58, y: g.y + 36, 'text-anchor': 'end', class: 'sch-pin-label' }, 'Cᵢₙ'),
        svg('text', { x: g.x + 4, y: g.y + 36, class: 'sch-pin-label' }, 'C'),
        svg('text', { x: g.x + 32, y: g.y + 60, 'text-anchor': 'middle', class: 'sch-pin-label' }, 'S')));
    } else {
      const s = shape(g.type, g.x, g.y);
      s.classList.add(cls(g.id));
      if (g.label) s.append(svg('text', { x: g.x + 20, y: g.y + 56, 'text-anchor': 'middle', class: 'sch-pin-label' }, g.label));
      parts.append(s);
    }
  });

  layout.outputs.forEach((o) => {
    wires.append(svg('path', { d: wirePath(source(layout, o.src), [o.x - 12, o.y], false, o.bend), class: `sch-wire ${cls(o.src)}` }));
    const on = known(o.src) && values[o.src];
    parts.append(svg('g', { class: `sch-out ${!known(o.src) ? 'u' : on ? 'on' : 'off'}` },
      svg('circle', { cx: o.x, cy: o.y, r: 12 }),
      svg('text', { x: o.x, y: o.y + 4, 'text-anchor': 'middle', class: 'sch-val' }, known(o.src) ? String(values[o.src]) : '?'),
      svg('text', { x: o.x + (o.labelBelow ? 0 : 18), y: o.y + (o.labelBelow ? 28 : 4), 'text-anchor': o.labelBelow ? 'middle' : 'start', class: 'sch-label' }, o.label)));
  });

  layout.inputs.forEach((i) => {
    const node = svg('g', { class: `sch-in ${inputValues[i.id] ? 'on' : 'off'} ${i.fixed ? 'fixed' : ''}`, tabindex: i.fixed ? null : '0', role: i.fixed ? null : 'button',
      'aria-label': `Entrada ${i.label} = ${inputValues[i.id]}${i.fixed ? ' (fija)' : '; pulsa para cambiarla'}` },
      svg('circle', { cx: i.x, cy: i.y, r: 11 }),
      svg('text', { x: i.x, y: i.y + 4, 'text-anchor': 'middle', class: 'sch-val' }, String(inputValues[i.id])),
      svg('text', { x: i.x + (i.labelAbove ? 0 : -16), y: i.y + (i.labelAbove ? -16 : 4), 'text-anchor': i.labelAbove ? 'middle' : 'end', class: 'sch-label' }, i.label));
    if (!i.fixed && onToggle) {
      node.addEventListener('click', () => onToggle(i.id));
      node.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(i.id); } });
    }
    parts.append(node);
  });
  return values;
}
