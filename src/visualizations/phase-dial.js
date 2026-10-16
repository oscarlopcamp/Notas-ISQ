// Fase relativa: un estado «mitad y mitad» con fase φ. Medido directamente,
// siempre 50 %; tras la mezcla, P(0) = cos²(φ/2). La fase global no cambia nada.

import { h, svg, clear } from '../utils/dom.js';
import { phaseMixP0 } from '../utils/qubit.js';

const CHALLENGES = [
  { text: 'Que tras mezclar salga siempre 1', check: (d) => phaseMixP0((d * Math.PI) / 180) < 0.001 },
  { text: 'Que tras mezclar salga 0 el 75 % de las veces', check: (d) => Math.abs(phaseMixP0((d * Math.PI) / 180) - 0.75) < 0.01 },
];
const pct = (p) => `${(p * 100).toLocaleString('es', { maximumFractionDigits: 1 })} %`;

export function mount(root, { phase = 0 } = {}) {
  let deg = phase, global = false;
  const solved = new Set();
  const dial = svg('svg', { viewBox: '0 0 200 200', class: 'pd-svg', role: 'img' });
  const slider = h('input', { type: 'range', min: '0', max: '359', step: '1', 'aria-label': 'Fase relativa en grados', oninput: (e) => { deg = Number(e.target.value); render(); } });
  const out = h('output', { class: 'mono' });
  const stateText = h('p', { class: 'mono pd-state' });
  const globalBox = h('input', { type: 'checkbox', onchange: (e) => { global = e.target.checked; render(); } });
  const results = h('div', { class: 'pd-results' });
  const note = h('p', { class: 'small', 'aria-live': 'polite' });
  const chal = h('ul', { class: 'ab-challenges' });

  root.append(
    h('div', { class: 'bs-layout' }, h('figure', { class: 'pd-figure' }, dial, h('figcaption', { class: 'small muted' }, 'El ecuador de la esfera de Bloch, visto desde arriba: el ángulo es la fase.')),
      h('div', { class: 'bs-side' },
        h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'Fase relativa', slider), out),
        stateText,
        h('label', { class: 'small ql-inside' }, globalBox, ' Multiplicar todo el estado por −1 (fase global)'),
        results, note)),
    h('p', { class: 'te-quiz-title' }, 'Retos:'), chal);

  function render() {
    slider.value = String(deg); out.textContent = `${deg}°`;
    const phi = (deg * Math.PI) / 180, p0 = phaseMixP0(phi);
    const sign = global ? '−' : '';
    stateText.textContent = deg === 0 ? `${sign}|+⟩ = ${sign}(|0⟩ + |1⟩)/√2`
      : deg === 180 ? `${sign}|−⟩ = ${sign}(|0⟩ − |1⟩)/√2`
        : `${sign}(|0⟩ + [fase ${deg}°]·|1⟩)/√2`;

    // Vista desde arriba de la esfera de Bloch: el ecuador y el punto a ángulo φ.
    clear(dial);
    const C = 100, RR = 66;
    dial.append(svg('circle', { cx: C, cy: C, r: RR, class: 'bs-outline' }));
    [[0, '0°'], [90, '90°'], [180, '180°'], [270, '270°']].forEach(([d, t]) => {
      const a = (d * Math.PI) / 180;
      dial.append(
        svg('line', { x1: C + (RR - 5) * Math.cos(a), y1: C - (RR - 5) * Math.sin(a), x2: C + (RR + 5) * Math.cos(a), y2: C - (RR + 5) * Math.sin(a), class: 'bs-axis' }),
        svg('text', { x: C + (RR + 20) * Math.cos(a), y: C - (RR + 20) * Math.sin(a) + 4, class: 'bs-label', 'text-anchor': 'middle' }, t));
    });
    const x = C + RR * Math.cos(phi), y = C - RR * Math.sin(phi);
    dial.append(
      svg('line', { x1: C, y1: C, x2: x, y2: y, class: 'bs-vector' }),
      svg('circle', { cx: x, cy: y, r: 7, class: 'bs-state' }),
    );
    dial.setAttribute('aria-label', `Punto del ecuador de la esfera de Bloch a ${deg}°`);

    clear(results);
    [['Medir directamente', 0.5], ['Mezclar y medir', p0]].forEach(([label, q]) => results.append(
      h('div', { class: 'sv-mode' }, h('span', { class: 'widget-label' }, label),
        h('div', { class: 'ab-bars' }, [['0', q], ['1', 1 - q]].map(([k, v]) => h('div', { class: 'ql-bar' },
          h('span', {}, k), h('div', { class: 'ql-track' }, h('i', { style: { width: `${v * 100}%` } })), h('b', {}, pct(v))))))));
    note.textContent = global
      ? 'Multiplicar todo por −1 cambia cómo se escribe el estado, pero ninguna medición lo nota: la fase global no tiene efecto.'
      : 'Medido directamente, el estado da siempre mitad y mitad, sea cual sea la fase. Tras la mezcla, la fase decide el resultado.';
    clear(chal);
    CHALLENGES.forEach((c, k) => {
      if (c.check(deg)) solved.add(k);
      chal.append(h('li', { class: solved.has(k) ? 'ok' : '' }, `${solved.has(k) ? '✓' : '○'} ${c.text}`));
    });
  }
  render();
}
