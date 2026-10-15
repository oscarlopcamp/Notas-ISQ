// Esfera de Bloch: θ (latitud, desde el polo norte) decide las probabilidades;
// φ (longitud) es la fase, que no las cambia. Proyección ortográfica en SVG.

import { h, svg, clear } from '../utils/dom.js';
import { blochPoint, blochProbabilities } from '../utils/qubit.js';

const PRESETS = [['|0⟩', 0, 0], ['|1⟩', 180, 0], ['|+⟩', 90, 0], ['|−⟩', 90, 180]];
const CHALLENGES = [
  { text: 'Que salga 1 el 75 % de las veces', check: (t) => Math.abs(blochProbabilities(t).p1 - 0.75) < 0.01 },
  { text: 'Mitad y mitad, pero que no sea |+⟩ ni |−⟩', check: (t, f) => Math.abs(t - Math.PI / 2) < 0.02 && Math.abs(Math.sin(f)) > 0.5 },
  { text: 'Que salga siempre 1', check: (t) => blochProbabilities(t).p1 > 0.999 },
];
const AZ = (-25 * Math.PI) / 180, EL = (18 * Math.PI) / 180;
const W = 300, C = 150, R = 110;
const rad = (d) => (d * Math.PI) / 180;
const pct = (p) => `${(p * 100).toLocaleString('es', { maximumFractionDigits: 1 })} %`;

/** Proyección ortográfica: coordenadas de pantalla y profundidad (> 0, delante). */
function project({ x, y, z }) {
  const x1 = x * Math.cos(AZ) - y * Math.sin(AZ);
  const y1 = x * Math.sin(AZ) + y * Math.cos(AZ);
  return { sx: C + R * y1, sy: C - R * (-Math.sin(EL) * x1 + Math.cos(EL) * z), depth: Math.cos(EL) * x1 + Math.sin(EL) * z };
}

function circlePath(theta, cls) {
  // Paralelo de latitud θ: delante, línea continua; detrás, discontinua.
  const parts = [];
  for (let i = 0; i < 72; i += 1) {
    const a = project(blochPoint(theta, (i * Math.PI) / 36)), b = project(blochPoint(theta, ((i + 1) * Math.PI) / 36));
    parts.push(svg('line', { x1: a.sx, y1: a.sy, x2: b.sx, y2: b.sy, class: `${cls} ${a.depth + b.depth >= 0 ? '' : 'back'}` }));
  }
  return parts;
}

export function mount(root, { theta: t0 = 60, phi: f0 = 0 } = {}) {
  let thetaDeg = t0, phiDeg = f0;
  const solved = new Set();
  const pic = svg('svg', { viewBox: `0 0 ${W} ${W}`, class: 'bs-svg', role: 'img' });
  const tIn = h('input', { type: 'range', min: '0', max: '180', step: '1', 'aria-label': 'θ: ángulo desde el polo norte, en grados', oninput: (e) => { thetaDeg = Number(e.target.value); render(); } });
  const fIn = h('input', { type: 'range', min: '0', max: '359', step: '1', 'aria-label': 'φ: giro alrededor del eje vertical (fase), en grados', oninput: (e) => { phiDeg = Number(e.target.value); render(); } });
  const tOut = h('output', { class: 'mono' }), fOut = h('output', { class: 'mono' });
  const presets = PRESETS.map(([label, t, f]) => h('button', { type: 'button', class: 'chip mono', onclick: () => { thetaDeg = t; phiDeg = f; render(); } }, label));
  const bars = h('div', { class: 'ab-bars' });
  const note = h('p', { class: 'small', 'aria-live': 'polite' });
  const chal = h('ul', { class: 'ab-challenges' });

  root.append(
    h('div', { class: 'bs-layout' },
      pic,
      h('div', { class: 'bs-side' },
        h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Ir a'), presets),
        h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'θ (altura)', tIn), tOut),
        h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'φ (giro, fase)', fIn), fOut),
        bars, note)),
    h('p', { class: 'te-quiz-title' }, 'Retos:'), chal,
  );

  function render() {
    tIn.value = String(thetaDeg); fIn.value = String(phiDeg);
    tOut.textContent = `${thetaDeg}°`; fOut.textContent = `${phiDeg}°`;
    presets.forEach((b, k) => b.setAttribute('aria-pressed', String(PRESETS[k][1] === thetaDeg && (PRESETS[k][2] === phiDeg || thetaDeg % 180 === 0))));
    const th = rad(thetaDeg), ph = rad(phiDeg);
    const { p0, p1 } = blochProbabilities(th);

    clear(pic);
    pic.append(svg('circle', { cx: C, cy: C, r: R, class: 'bs-outline' }));
    pic.append(...circlePath(Math.PI / 2, 'bs-equator'));
    if (thetaDeg > 0 && thetaDeg < 180 && thetaDeg !== 90) pic.append(...circlePath(th, 'bs-parallel'));
    const top = project({ x: 0, y: 0, z: 1 }), bottom = project({ x: 0, y: 0, z: -1 });
    pic.append(svg('line', { x1: top.sx, y1: top.sy, x2: bottom.sx, y2: bottom.sy, class: 'bs-axis' }));
    const label = (p, text, dx = 0, dy = 0) => svg('text', { x: p.sx + dx, y: p.sy + dy, class: 'bs-label', 'text-anchor': 'middle' }, text);
    pic.append(label(top, '|0⟩', 0, -8), label(bottom, '|1⟩', 0, 20));
    const px = project({ x: 1, y: 0, z: 0 }), mx = project({ x: -1, y: 0, z: 0 });
    pic.append(svg('circle', { cx: px.sx, cy: px.sy, r: 3, class: 'bs-mark' }), svg('circle', { cx: mx.sx, cy: mx.sy, r: 3, class: 'bs-mark back' }));
    pic.append(label(px, '|+⟩', -14, 16), label(mx, '|−⟩', 14, -8));

    const p = project(blochPoint(th, ph));
    const axisPoint = project({ x: 0, y: 0, z: Math.cos(th) });
    pic.append(
      svg('line', { x1: p.sx, y1: p.sy, x2: axisPoint.sx, y2: axisPoint.sy, class: 'bs-height' }),
      svg('line', { x1: C, y1: C, x2: p.sx, y2: p.sy, class: 'bs-vector' }),
      svg('circle', { cx: p.sx, cy: p.sy, r: p.depth >= 0 ? 7 : 5, class: `bs-state ${p.depth >= 0 ? '' : 'back'}` }),
    );
    pic.setAttribute('aria-label', `Estado en θ = ${thetaDeg}°, φ = ${phiDeg}°. Probabilidad de 0: ${pct(p0)}; de 1: ${pct(p1)}.`);

    clear(bars);
    [['0', p0], ['1', p1]].forEach(([k, v]) => bars.append(h('div', { class: 'ql-bar' },
      h('span', {}, k), h('div', { class: 'ql-track' }, h('i', { style: { width: `${v * 100}%` } })), h('b', {}, pct(v)))));
    note.textContent = thetaDeg === 0 || thetaDeg === 180
      ? `En el polo, el giro φ no cambia nada: es siempre el estado ${thetaDeg === 0 ? '0' : '1'}.`
      : `Cuanto más cerca del polo norte, más probable el 0. Mueve φ: el punto gira a la misma altura y las probabilidades no cambian. Esa diferencia, la fase, importará en la interferencia (lecciones 3.6 y 3.8).`;

    clear(chal);
    CHALLENGES.forEach((c, k) => {
      if (c.check(th, ph)) solved.add(k);
      chal.append(h('li', { class: solved.has(k) ? 'ok' : '' }, `${solved.has(k) ? '✓' : '○'} ${c.text}`));
    });
  }
  render();
}
