// Interferómetro de Mach–Zehnder con fotones individuales (modelo ideal).
// Compara la predicción cuántica (amplitudes que interfieren) con un modelo
// clásico en el que cada divisor envía el fotón al azar por un camino.

import { h, svg, clear } from '../utils/dom.js';
import { interferometer, sampleOutcome } from '../utils/quantumintro.js';

export function mount(root, { model = 'quantum' } = {}) {
  let mode = model, phase = 0, blocked = false, whichPath = false;
  let counts = { d0: 0, d1: 0, absorbed: 0 };
  let flash = null;

  const modeChips = [['quantum', 'Predicción cuántica'], ['classical', 'Modelo clásico (caminos al azar)']].map(([id, label]) =>
    h('button', { type: 'button', class: 'chip', onclick: () => { mode = id; reset(); } }, label));
  const phaseOut = h('output', { class: 'mono' }, '0°');
  const phaseIn = h('input', { type: 'range', min: '0', max: '360', step: '15', value: '0', 'aria-label': 'Desfase en el camino superior', oninput: (e) => { phase = (Number(e.target.value) * Math.PI) / 180; phaseOut.textContent = `${e.target.value}°`; reset(); } });
  const blockBox = h('input', { type: 'checkbox', onchange: (e) => { blocked = e.target.checked; reset(); } });
  const pathBox = h('input', { type: 'checkbox', onchange: (e) => { whichPath = e.target.checked; reset(); } });
  const pic = svg('svg', { viewBox: '0 0 560 200', class: 'mz-svg', role: 'img', 'aria-label': 'Interferómetro de Mach–Zehnder' });
  const stats = h('div', { class: 'mz-stats', 'aria-live': 'polite' });

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Modelo'), modeChips),
    h('div', { class: 'widget-controls' },
      h('label', { class: 'widget-label' }, 'Desfase', phaseIn), phaseOut,
      h('label', { class: 'mz-check' }, blockBox, ' Bloquear el camino inferior'),
      h('label', { class: 'mz-check' }, pathBox, ' Registrar por qué camino va')),
    pic,
    h('div', { class: 'btn-row' },
      h('button', { type: 'button', class: 'btn primary', onclick: () => fire(1) }, 'Enviar 1 fotón'),
      h('button', { type: 'button', class: 'btn', onclick: () => fire(100) }, 'Enviar 100'),
      h('button', { type: 'button', class: 'btn', onclick: () => fire(1000) }, 'Enviar 1000'),
      h('button', { type: 'button', class: 'btn', onclick: () => reset() }, 'Reiniciar contadores')),
    stats,
  );

  function reset() { counts = { d0: 0, d1: 0, absorbed: 0 }; flash = null; render(); }

  function fire(n) {
    const p = interferometer({ phase, blocked, whichPath, model: mode });
    for (let i = 0; i < n; i += 1) {
      const out = sampleOutcome(p);
      counts[out] += 1;
      flash = out;
    }
    render();
  }

  function render() {
    modeChips.forEach((c, i) => c.setAttribute('aria-pressed', String(['quantum', 'classical'][i] === mode)));
    clear(pic);
    const beam = (d, cls = '') => pic.append(svg('path', { d, class: `mz-beam ${cls}` }));
    // Caminos: fuente → divisor 1 (120,150). Superior: espejo (120,60) → divisor 2 (440,60).
    // Inferior: espejo (440,150) → divisor 2. Salidas: D0 a la derecha y D1 hacia arriba.
    beam('M30,150 H120');
    beam('M120,150 V60 H440', 'up');
    beam(`M120,150 H${blocked ? 280 : 440} ${blocked ? '' : 'V60'}`, 'down');
    beam('M440,60 H520', 'out0');
    beam('M440,60 V20', 'out1');
    // Divisores de haz y espejos
    const bs = (x, y, label) => pic.append(svg('g', { class: 'mz-bs' }, svg('rect', { x: x - 12, y: y - 12, width: 24, height: 24, transform: `rotate(45 ${x} ${y})` }), svg('text', { x, y: y + 32, 'text-anchor': 'middle', class: 'mz-label' }, label)));
    bs(120, 150, 'divisor 1');
    bs(440, 60, '');
    pic.append(svg('text', { x: 470, y: 90, class: 'mz-label' }, 'divisor 2'));
    pic.append(svg('line', { x1: 108, y1: 48, x2: 132, y2: 72, class: 'mz-mirror' }), svg('line', { x1: 428, y1: 138, x2: 452, y2: 162, class: 'mz-mirror' }));
    pic.append(svg('text', { x: 140, y: 52, class: 'mz-label' }, 'espejo'), svg('text', { x: 396, y: 180, class: 'mz-label' }, 'espejo'));
    // Desfasador en el camino superior
    pic.append(svg('rect', { x: 260, y: 48, width: 30, height: 24, rx: 3, class: 'mz-phase' }), svg('text', { x: 275, y: 40, 'text-anchor': 'middle', class: 'mz-label' }, `φ = ${Math.round((phase * 180) / Math.PI)}°`));
    if (blocked) pic.append(svg('rect', { x: 280, y: 136, width: 14, height: 28, class: 'mz-block' }), svg('text', { x: 287, y: 186, 'text-anchor': 'middle', class: 'mz-label' }, 'obstáculo'));
    if (whichPath) pic.append(svg('circle', { cx: 200, cy: 150, r: 9, class: 'mz-eye' }), svg('text', { x: 200, y: 182, 'text-anchor': 'middle', class: 'mz-label' }, 'detector de camino'));
    // Fuente y detectores
    pic.append(svg('rect', { x: 6, y: 138, width: 24, height: 24, rx: 4, class: 'mz-source' }), svg('text', { x: 18, y: 182, 'text-anchor': 'middle', class: 'mz-label' }, 'fuente'));
    const det = (x, y, id, label) => pic.append(svg('g', { class: `mz-det ${flash === id ? 'flash' : ''}` },
      svg('circle', { cx: x, cy: y, r: 16 }), svg('text', { x, y: y + 5, 'text-anchor': 'middle', class: 'mz-det-label' }, label)));
    det(536, 60, 'd0', 'D0');
    det(440, 18, 'd1', 'D1');

    const p = interferometer({ phase, blocked, whichPath, model: mode });
    const total = counts.d0 + counts.d1 + counts.absorbed;
    clear(stats);
    const row = (label, key) => h('div', { class: 'mz-row' },
      h('span', {}, label),
      h('div', { class: 'mz-bar' }, h('div', { class: 'pred', style: { width: `${p[key] * 100}%` } }), h('div', { class: 'obs', style: { width: `${total ? (counts[key] / total) * 100 : 0}%` } })),
      h('span', { class: 'mono' }, `${counts[key]}`), h('span', { class: 'mono muted' }, `p = ${p[key].toFixed(2)}`));
    stats.append(row('D0', 'd0'), row('D1', 'd1'));
    if (blocked) stats.append(row('Absorbido', 'absorbed'));
    stats.append(h('p', { class: 'small muted' }, 'Barra fina: probabilidad predicha. Barra gruesa: fracción observada en los fotones enviados.'));
    stats.append(h('p', { class: 'mz-verdict' }, verdictText()));
  }

  function verdictText() {
    if (mode === 'classical') return 'Modelo clásico: cada divisor envía el fotón por un camino al azar. Así, cada detector recibe la mitad de los fotones, sea cual sea el desfase. Pero eso no es lo que se observa en el laboratorio con el aparato bien ajustado: cambia a la predicción cuántica.';
    if (blocked) return 'Con un camino bloqueado no hay dos caminos que interfieran: de los fotones que no se absorben, la mitad llega a cada detector. ¡Bloquear un camino hace que lleguen fotones a D1, donde antes no llegaba ninguno!';
    if (whichPath) return 'Si se registra por qué camino va el fotón, la interferencia desaparece y cada detector recibe la mitad. Obtener información sobre el camino destruye el efecto.';
    const deg = Math.round((phase * 180) / Math.PI) % 360;
    if (deg === 0) return 'Sin desfase, todos los fotones llegan a D0 y ninguno a D1, aunque cada fotón llega de uno en uno. Las dos posibilidades se combinan: se refuerzan hacia D0 y se cancelan hacia D1. Es interferencia.';
    if (deg === 180) return 'Con un desfase de 180°, la situación se invierte: todos van a D1. El resultado depende de una diferencia entre los caminos, no de un camino concreto.';
    return 'Con desfases intermedios, cada detector recibe una fracción que depende del desfase, cos²(φ/2) en D0. Cada fotón individual sigue llegando a un único detector.';
  }

  render();
}
