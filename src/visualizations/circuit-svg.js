// Dibujo de circuitos cuánticos en SVG con los símbolos habituales (como Qiskit:
// el qubit 0 es la línea de arriba). Lo usan el editor y el cuestionario de circuitos.

import { svg } from '../utils/dom.js';
import { CTRL, TARG } from '../utils/circuit.js';

const ROW = 46, COL = 54, LEFT = 74, TOP = 26;

/**
 * Dibuja n líneas de qubit, las columnas de compuertas y, si `measure`, los medidores
 * y el registro clásico. `onCell(q, k)` hace clicables las celdas; `active` resalta una columna.
 */
export function drawCircuit(n, columns, { measure = true, onCell = null, active = -1, label = 'Circuito cuántico' } = {}) {
  const cols = columns.length;
  const xMeasure = LEFT + cols * COL + 20;
  const width = xMeasure + (measure ? n * 38 + 24 : 10);
  const yClassical = TOP + n * ROW + 10;
  const height = measure ? yClassical + 30 : TOP + n * ROW;
  const pic = svg('svg', { viewBox: `0 0 ${width} ${height}`, class: 'cs-svg', role: 'img', 'aria-label': label, style: `max-width:${width}px` });
  const y = (q) => TOP + q * ROW + ROW / 2 - 10;
  const x = (k) => LEFT + k * COL + COL / 2;

  if (active >= 0 && active < cols) pic.append(svg('rect', { x: LEFT + active * COL + 2, y: TOP - 14, width: COL - 4, height: n * ROW + 4, rx: 6, class: 'cs-active' }));

  for (let q = 0; q < n; q += 1) {
    pic.append(
      svg('text', { x: 8, y: y(q) + 4, class: 'cs-label' }, `q${q}`),
      svg('text', { x: 34, y: y(q) + 4, class: 'cs-init' }, '|0⟩'),
      svg('line', { x1: 60, x2: measure ? xMeasure + q * 38 : width, y1: y(q), y2: y(q), class: 'cs-wire' }));
  }

  columns.forEach((col, k) => {
    const ci = col.indexOf(CTRL), ti = col.indexOf(TARG);
    if (ci >= 0 && ti >= 0) pic.append(svg('line', { x1: x(k), x2: x(k), y1: y(ci), y2: y(ti), class: 'cs-link' }));
    col.forEach((g, q) => {
      if (g === CTRL) pic.append(svg('circle', { cx: x(k), cy: y(q), r: 6, class: 'cs-ctrl' }));
      else if (g === TARG) pic.append(svg('circle', { cx: x(k), cy: y(q), r: 12, class: 'cs-targ' }), svg('line', { x1: x(k) - 12, x2: x(k) + 12, y1: y(q), y2: y(q), class: 'cs-targ-line' }), svg('line', { x1: x(k), x2: x(k), y1: y(q) - 12, y2: y(q) + 12, class: 'cs-targ-line' }));
      else if (g) pic.append(svg('rect', { x: x(k) - 15, y: y(q) - 15, width: 30, height: 30, rx: 4, class: `cs-gate g-${g}` }), svg('text', { x: x(k), y: y(q) + 5, class: 'cs-gate-label', 'text-anchor': 'middle' }, g));
      if (onCell) pic.append(svg('rect', { x: LEFT + k * COL + 2, y: y(q) - ROW / 2 + 2, width: COL - 4, height: ROW - 4, class: 'cs-hit', tabindex: '0', role: 'button', 'aria-label': `Qubit ${q}, columna ${k + 1}`, onclick: () => onCell(q, k), onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCell(q, k); } } }));
    });
  });

  if (measure) {
    pic.append(
      svg('line', { x1: 60, x2: width - 6, y1: yClassical - 2, y2: yClassical - 2, class: 'cs-classical' }),
      svg('line', { x1: 60, x2: width - 6, y1: yClassical + 2, y2: yClassical + 2, class: 'cs-classical' }),
      svg('text', { x: 8, y: yClassical + 4, class: 'cs-label' }, 'c'));
    for (let q = 0; q < n; q += 1) {
      const mx = xMeasure + q * 38;
      pic.append(
        svg('rect', { x: mx, y: y(q) - 13, width: 30, height: 26, rx: 3, class: 'cs-meter' }),
        svg('path', { d: `M ${mx + 6} ${y(q) + 6} A 10 10 0 0 1 ${mx + 24} ${y(q) + 6}`, class: 'cs-meter-arc' }),
        svg('line', { x1: mx + 15, y1: y(q) + 7, x2: mx + 23, y2: y(q) - 7, class: 'cs-meter-arc' }),
        svg('line', { x1: mx + 13, x2: mx + 13, y1: y(q) + 13, y2: yClassical - 2, class: 'cs-classical' }),
        svg('line', { x1: mx + 17, x2: mx + 17, y1: y(q) + 13, y2: yClassical - 2, class: 'cs-classical' }),
        svg('text', { x: mx + 22, y: yClassical + 16, class: 'cs-init' }, String(q)));
    }
  }
  return pic;
}
