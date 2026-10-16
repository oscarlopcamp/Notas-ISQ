// Constructor de interferencias: aplica operaciones a un qubit que empieza en |0⟩
// y observa cómo las amplitudes se refuerzan o se cancelan en cada mezcla.

import { h, clear } from '../utils/dom.js';
import { OPS, runOps, mixContributions } from '../utils/qubit.js';

const R = Math.SQRT1_2;
const MAX = 8;
const CHALLENGES = [
  { text: 'Obtener 1 con certeza sin usar «Intercambiar»', check: (ops, [, b]) => !ops.includes('X') && ops.includes('M') && b * b > 0.999 },
  { text: 'Preparar |−⟩ = (|0⟩ − |1⟩)/√2', check: (ops, [a, b]) => Math.abs(a - R) < 1e-9 && Math.abs(b + R) < 1e-9 },
  { text: 'Volver a |0⟩ usando al menos dos mezclas y un cambio de signo', check: (ops, [a]) => ops.split('M').length > 2 && ops.includes('S') && a > 0.999 },
];
const fmt = (x) => { const v = Math.abs(x) < 1e-12 ? 0 : x; return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(3); };

export function mount(root) {
  let ops = '';
  const solved = new Set();
  const palette = Object.entries(OPS).map(([k, op]) => h('button', { type: 'button', class: 'btn', onclick: () => { if (ops.length < MAX) { ops += k; render(); } } }, `${k} · ${op.label}`));
  const strip = h('div', { class: 'ib-strip', role: 'img' });
  const explain = h('p', { class: 'ib-explain', 'aria-live': 'polite' });
  const final = h('div', { class: 'ab-bars' });
  const chal = h('ul', { class: 'ab-challenges' });

  root.append(
    h('p', { class: 'small' }, 'El qubit empieza en |0⟩. Añade operaciones (como mucho 8) y observa las amplitudes después de cada una: hacia arriba, positivas; hacia abajo, negativas.'),
    h('div', { class: 'btn-row' }, ...palette,
      h('button', { type: 'button', class: 'btn', onclick: () => { ops = ops.slice(0, -1); render(); } }, 'Deshacer'),
      h('button', { type: 'button', class: 'btn', onclick: () => { ops = ''; render(); } }, 'Vaciar')),
    strip, explain,
    h('p', { class: 'widget-label' }, 'Al medir al final'), final,
    h('p', { class: 'te-quiz-title' }, 'Retos:'), chal);

  const column = ([a, b], title) => h('div', { class: 'ib-col' },
    h('span', { class: 'ib-title mono' }, title),
    h('div', { class: 'ib-bars' }, [['0', a], ['1', b]].map(([k, v]) => h('div', { class: 'ib-cell' },
      h('div', { class: 'ib-half up' }, v > 1e-12 ? h('i', { style: { height: `${v * 100}%` } }) : null),
      h('div', { class: 'ib-half down' }, v < -1e-12 ? h('i', { style: { height: `${-v * 100}%` } }) : null),
      h('span', { class: 'mono' }, k)))),
    h('span', { class: 'ib-amps mono' }, `${fmt(a)}`, h('br'), `${fmt(b)}`));

  function render() {
    palette.forEach((b) => { b.disabled = ops.length >= MAX; });
    const steps = runOps(ops);
    clear(strip);
    strip.append(column(steps[0], 'inicio'));
    [...ops].forEach((op, k) => strip.append(h('span', { class: 'ib-op mono' }, op), column(steps[k + 1], `paso ${k + 1}`)));
    strip.setAttribute('aria-label', `Secuencia ${ops || 'vacía'}; amplitudes finales ${steps[steps.length - 1].map(fmt).join(' y ')}`);

    const lastMix = ops.lastIndexOf('M');
    if (lastMix === -1) {
      explain.textContent = 'Añade una mezcla (M) para ver cómo se combinan las amplitudes.';
    } else {
      const [a, b] = steps[lastMix];
      const c = mixContributions(a, b);
      const kind = (x, y) => (Math.abs(x + y) < 1e-12 && Math.abs(x) > 1e-12 ? 'se cancelan: interferencia destructiva'
        : Math.abs(x) > 1e-12 && Math.abs(y) > 1e-12 && Math.sign(x) === Math.sign(y) ? 'se refuerzan: interferencia constructiva' : 'solo hay una contribución');
      explain.textContent = `En la última mezcla (paso ${lastMix + 1}), al 0 llegan ${fmt(c.to0[0])} y ${fmt(c.to0[1])}: ${kind(...c.to0)}. Al 1 llegan ${fmt(c.to1[0])} y ${fmt(c.to1[1])}: ${kind(...c.to1)}.`;
    }
    const [a, b] = steps[steps.length - 1];
    clear(final);
    [['0', a * a], ['1', b * b]].forEach(([k, p]) => final.append(h('div', { class: 'ql-bar' },
      h('span', {}, k), h('div', { class: 'ql-track' }, h('i', { style: { width: `${p * 100}%` } })), h('b', {}, `${Math.round(p * 1000) / 10} %`))));
    clear(chal);
    CHALLENGES.forEach((ch, k) => {
      if (ch.check(ops, [a, b])) solved.add(k);
      chal.append(h('li', { class: solved.has(k) ? 'ok' : '' }, `${solved.has(k) ? '✓' : '○'} ${ch.text}`));
    });
  }
  render();
}
