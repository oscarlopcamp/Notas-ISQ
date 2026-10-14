// Problema del viajante por fuerza bruta frente a una heurística rápida.
// La búsqueda exhaustiva se ejecuta de verdad en el navegador y se mide su tiempo.

import { h, svg, clear } from '../utils/dom.js';
import { seededPoints, tspBruteForce, nearestNeighbor, tourCount, factorial, humanTime } from '../utils/complexity.js';

export function mount(root, { n = 7 } = {}) {
  let N = n, seed = 4, result = null;
  const nSel = h('select', { 'aria-label': 'Número de ciudades', onchange: (e) => { N = Number(e.target.value); result = null; render(); } },
    [4, 5, 6, 7, 8, 9, 10].map((v) => h('option', { value: String(v), selected: v === N }, `${v} ciudades`)));
  const map = svg('svg', { viewBox: '0 0 400 400', class: 'tsp-svg', role: 'img', 'aria-label': 'Mapa de ciudades y rutas' });
  const info = h('div', { class: 'tsp-info' });
  const runBtn = h('button', { type: 'button', class: 'btn primary', onclick: () => solve() }, 'Buscar la mejor ruta (fuerza bruta)');

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Ciudades'), nSel,
      h('button', { type: 'button', class: 'chip', onclick: () => { seed += 1; result = null; render(); } }, 'Otras ciudades')),
    h('div', { class: 'btn-row' }, runBtn),
    h('div', { class: 'tsp-layout' }, map, info),
  );

  function solve() {
    const pts = seededPoints(N, seed);
    const t0 = performance.now();
    const bf = tspBruteForce(pts);
    const ms = Math.max(performance.now() - t0, 0.01);
    result = { bf, ms, nn: nearestNeighbor(pts) };
    render();
  }

  function render() {
    const pts = seededPoints(N, seed);
    const P = (i) => [pts[i][0] * 400, pts[i][1] * 400];
    clear(map);
    const drawTour = (tour, cls) => map.append(svg('polygon', { points: tour.map((i) => P(i).join(',')).join(' '), class: cls }));
    if (result) { drawTour(result.nn.tour, 'tsp-nn'); drawTour(result.bf.tour, 'tsp-best'); }
    pts.forEach((_, i) => map.append(svg('g', { class: 'tsp-city' }, svg('circle', { cx: P(i)[0], cy: P(i)[1], r: 9 }), svg('text', { x: P(i)[0], y: P(i)[1] + 4, 'text-anchor': 'middle' }, String(i + 1)))));

    clear(info);
    info.append(h('p', {}, `Rutas cerradas distintas: (n − 1)!/2 = ${tourCount(N).toLocaleString('es')}.`));
    if (result) {
      const perPerm = result.ms / result.bf.evaluated; // ms por permutación evaluada en este navegador
      const est20 = factorial(19) * perPerm / 1000; // segundos
      info.append(
        h('p', {}, h('span', { class: 'tsp-key best' }), `Óptima (fuerza bruta): longitud ${result.bf.length.toFixed(3)}. Se evaluaron ${result.bf.evaluated.toLocaleString('es')} permutaciones en ${result.ms.toFixed(1)} ms.`),
        h('p', {}, h('span', { class: 'tsp-key nn' }), `Vecino más cercano (heurística): longitud ${result.nn.length.toFixed(3)} — ${result.nn.length - result.bf.length < 1e-9 ? 'esta vez coincide con la óptima' : `un ${(((result.nn.length / result.bf.length) - 1) * 100).toFixed(1)} % más larga`}, calculada en un instante.`),
        h('p', { class: 'tc-warn' }, `Extrapolación: a este ritmo, 20 ciudades exigirían ${factorial(19).toExponential(2).replace('e+', ' × 10^')} permutaciones, unos ${humanTime(est20, 1)}. Cada ciudad nueva multiplica el trabajo.`),
        h('p', { class: 'muted small' }, 'El tiempo medido depende de tu dispositivo; la extrapolación es una estimación de orden de magnitud.'),
      );
    } else {
      info.append(h('p', { class: 'muted' }, 'Pulsa el botón para probar todas las rutas posibles.'));
    }
  }

  render();
}
