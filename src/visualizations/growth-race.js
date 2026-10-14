// Carrera de crecimiento: cuánto tarda un algoritmo según su coste,
// suponiendo 10⁹ operaciones elementales por segundo.

import { h, clear } from '../utils/dom.js';
import { GROWTH, humanTime, SECONDS_PER_YEAR, AGE_OF_UNIVERSE_YEARS } from '../utils/complexity.js';
import { renderMath } from '../utils/math.js';

export function mount(root, { n = 30 } = {}) {
  let N = n;
  const out = h('output', { class: 'mono' }, String(N));
  const slider = h('input', { type: 'range', min: '1', max: '100', value: String(N), 'aria-label': 'Tamaño de la entrada n', oninput: (e) => { N = Number(e.target.value); out.textContent = String(N); render(); } });
  const list = h('div', { class: 'gr-list' });
  root.append(
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'Tamaño n', slider), out,
      [10, 20, 40, 60, 100].map((v) => h('button', { type: 'button', class: 'chip', onclick: () => { N = v; slider.value = String(v); out.textContent = String(v); render(); } }, `n = ${v}`))),
    list,
    h('p', { class: 'muted small' }, 'Barras en escala logarítmica de operaciones. Se supone una máquina que hace 10⁹ operaciones por segundo; una 1000 veces más rápida solo dividiría cada tiempo entre 1000.'),
  );

  function render() {
    clear(list);
    const maxLog = Math.log10(GROWTH[GROWTH.length - 1].f(100));
    GROWTH.forEach((g) => {
      const ops = g.f(N);
      const years = ops / 1e9 / SECONDS_PER_YEAR;
      const beyond = years > AGE_OF_UNIVERSE_YEARS;
      const w = ops <= 1 ? 1 : (Math.log10(ops) / maxLog) * 100;
      list.append(h('div', { class: `gr-row ${beyond ? 'beyond' : ''}` },
        h('span', { class: 'gr-label', html: renderMath(g.tex) }),
        h('div', { class: 'gr-bar' }, h('div', { style: { width: `${Math.max(1, Math.min(100, w))}%` } })),
        h('span', { class: 'gr-ops mono' }, ops < 1e6 ? Math.round(ops).toLocaleString('es') : ops.toExponential(2).replace('e+', '×10^')),
        h('span', { class: 'gr-time' }, humanTime(ops), beyond ? ' · más que la edad del universo' : '')));
    });
  }
  render();
}
