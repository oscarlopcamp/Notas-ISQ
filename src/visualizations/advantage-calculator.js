// Calculadora (modelo simplificado) del punto de cruce entre un algoritmo
// clásico y uno cuántico cuando cada operación cuántica es mucho más lenta.

import { h, svg, clear } from '../utils/dom.js';
import { crossover, runtimes } from '../utils/advantage.js';
import { humanTime } from '../utils/complexity.js';

const KINDS = [
  ['quadratic', 'Cuadrática (N frente a √N, como Grover)'],
  ['quartic', 'Cuártica (N frente a N^¼)'],
  ['exponential', 'Exponencial (2ⁿ frente a n³)'],
];

export function mount(root, { kind = 'quadratic', exponent = 6 } = {}) {
  let k = kind, e = exponent;
  const chips = KINDS.map(([id, label]) => h('button', { type: 'button', class: 'chip', onclick: () => { k = id; render(); } }, label));
  const out = h('output', { class: 'mono' });
  const slider = h('input', { type: 'range', min: '2', max: '10', step: '1', value: String(e), 'aria-label': 'Ralentización de cada operación cuántica (potencia de 10)', oninput: (ev) => { e = Number(ev.target.value); render(); } });
  const chart = svg('svg', { viewBox: '0 0 600 260', class: 'ac-svg', role: 'img' });
  const verdict = h('div', { class: 'ac-verdict', 'aria-live': 'polite' });

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Ventaja'), chips),
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'Cada operación cuántica es más lenta', slider), out),
    chart, verdict,
    h('p', { class: 'muted small' }, 'Modelo simplificado: 1 ns por operación clásica y la ralentización elegida por operación cuántica (que incluye el coste de la corrección de errores). Ignora la carga de datos, el paralelismo y las constantes de cada algoritmo concreto.'),
  );

  function render() {
    chips.forEach((c, i) => c.setAttribute('aria-pressed', String(KINDS[i][0] === k)));
    const s = 10 ** e;
    out.textContent = `× 10^${e}`;
    const c = crossover(k, s);
    // Gráfica log-log del tiempo de cada algoritmo frente a N
    clear(chart);
    const W = 600, H = 260, pl = 54, pr = 14, pt = 12, pb = 34;
    const logN0 = 0, logN1 = Math.max(Math.log10(c.N) * 1.4, 6);
    const pts = 80;
    const series = { classical: [], quantum: [] };
    for (let i = 0; i <= pts; i += 1) {
      const lN = logN0 + ((logN1 - logN0) * i) / pts;
      const r = runtimes(k, 10 ** lN, s);
      series.classical.push([lN, Math.log10(r.classical)]);
      series.quantum.push([lN, Math.log10(r.quantum)]);
    }
    const ys = [...series.classical, ...series.quantum].map((p) => p[1]);
    const y0 = Math.min(...ys), y1 = Math.max(...ys);
    const X = (l) => pl + ((l - logN0) / (logN1 - logN0)) * (W - pl - pr);
    const Y = (l) => H - pb - ((l - y0) / (y1 - y0 || 1)) * (H - pt - pb);
    chart.append(svg('line', { x1: pl, x2: W - pr, y1: H - pb, y2: H - pb, class: 'ac-axis' }), svg('line', { x1: pl, x2: pl, y1: pt, y2: H - pb, class: 'ac-axis' }));
    chart.append(svg('text', { x: (W + pl) / 2, y: H - 6, 'text-anchor': 'middle', class: 'ac-label' }, 'tamaño del problema N (escala logarítmica)'));
    chart.append(svg('text', { x: 14, y: (H - pb) / 2, 'text-anchor': 'middle', class: 'ac-label', transform: `rotate(-90 14 ${(H - pb) / 2})` }, 'tiempo (log)'));
    [['classical', 'clásico'], ['quantum', 'cuántico']].forEach(([key, label]) => {
      chart.append(svg('polyline', { points: series[key].map(([a, b]) => `${X(a).toFixed(1)},${Y(b).toFixed(1)}`).join(' '), class: `ac-line ${key}` }));
      const [la, lb] = series[key][pts];
      chart.append(svg('text', { x: X(la) - 4, y: Math.max(pt + 12, Y(lb) - 6) + (key === 'quantum' ? 16 : 0), 'text-anchor': 'end', class: `ac-tag ${key}` }, label));
    });
    const cx = X(Math.log10(c.N)), cy = Y(Math.log10(c.seconds));
    chart.append(svg('circle', { cx, cy, r: 6, class: 'ac-cross' }), svg('line', { x1: cx, x2: cx, y1: cy, y2: H - pb, class: 'ac-drop' }));
    chart.setAttribute('aria-label', `El algoritmo cuántico empieza a ganar cuando N ≈ 10^${Math.round(Math.log10(c.N))}`);

    clear(verdict);
    const days = c.seconds / 86400;
    verdict.className = `ac-verdict ${days > 365 ? 'bad' : c.seconds > 1 ? 'warn' : 'ok'}`;
    verdict.append(
      h('p', {}, `El algoritmo cuántico solo empieza a ser más rápido a partir de N ≈ ${c.N.toExponential(1).replace('e+', ' × 10^')}${k === 'exponential' ? ` (n = ${c.n} bits de entrada)` : ''}. En ese punto, ambos tardan unos ${humanTime(c.seconds, 1)}.`),
      h('p', {}, days > 365
        ? 'La ventaja solo aparecería en cálculos que duran años: en la práctica, no hay ventaja.'
        : days > 1 ? 'Hay ventaja, pero solo para cálculos muy largos: el problema tiene que merecer días de cómputo.'
          : c.seconds > 1 ? 'Hay ventaja, pero solo en problemas muy grandes, que ya tardarían minutos u horas en una computadora clásica.'
            : 'La ventaja aparece pronto: problemas de tamaño moderado ya se benefician.'),
    );
  }
  render();
}
