// Del voltaje al bit: una señal con ruido se interpreta mediante umbrales.
// Valores ilustrativos (0–5 V, umbrales 1,5 V y 3,5 V); cada familia lógica
// define sus propios niveles y márgenes de ruido.

import { h, svg, clear } from '../utils/dom.js';

const SENT = [0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1];
const V_LOW = 0.4;
const V_HIGH = 4.6;
const V_IL = 1.5;
const V_IH = 3.5;
const SAMPLES_PER_BIT = 24;

// Generador pseudoaleatorio determinista (mulberry32) para que la figura sea reproducible.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Aproximación de una normal estándar (suma de 6 uniformes).
function gaussian(rand) {
  let s = 0;
  for (let i = 0; i < 6; i += 1) s += rand();
  return (s - 3) / Math.sqrt(0.5);
}

export function mount(root, { noise = 0.3 } = {}) {
  let sigma = noise;
  let seed = 7;

  const W = 720, H = 260, padL = 46, padR = 92, padT = 14, padB = 34;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const x = (t) => padL + (t / SENT.length) * plotW;
  const y = (v) => padT + (1 - v / 5) * plotH;

  const figure = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'volt-svg', role: 'img', 'aria-label': 'Señal de voltaje con umbrales de lectura' });
  const slider = h('input', { type: 'range', min: '0', max: '1.6', step: '0.05', value: String(sigma), 'aria-label': 'Intensidad del ruido', oninput: (e) => { sigma = Number(e.target.value); render(); } });
  const sliderValue = h('output', { class: 'mono' });
  const table = h('div', { class: 'volt-bits mono' });
  const verdict = h('p', { class: 'widget-stats' });

  root.append(
    h('div', { class: 'widget-controls' },
      h('label', { class: 'widget-label' }, 'Ruido', slider), sliderValue,
      h('button', { type: 'button', class: 'chip', onclick: () => { seed += 1; render(); } }, 'Otra muestra de ruido'),
    ),
    figure, table, verdict,
  );

  function render() {
    sliderValue.textContent = `σ = ${sigma.toFixed(2).replace('.', ',')} V`;
    const rand = rng(seed);
    const points = [];
    const read = [];
    SENT.forEach((bit, i) => {
      const level = bit ? V_HIGH : V_LOW;
      for (let k = 0; k < SAMPLES_PER_BIT; k += 1) {
        const v = Math.max(-0.4, Math.min(5.4, level + sigma * gaussian(rand)));
        const t = i + k / SAMPLES_PER_BIT;
        points.push([t, v]);
        if (k === SAMPLES_PER_BIT / 2) read.push({ t: i + 0.5, v, bit: v < V_IL ? 0 : v > V_IH ? 1 : null });
      }
    });

    clear(figure);
    figure.append(
      svg('rect', { x: padL, y: y(5), width: plotW, height: y(V_IH) - y(5), class: 'volt-band high' }),
      svg('rect', { x: padL, y: y(V_IH), width: plotW, height: y(V_IL) - y(V_IH), class: 'volt-band forbidden' }),
      svg('rect', { x: padL, y: y(V_IL), width: plotW, height: y(0) - y(V_IL), class: 'volt-band low' }),
      svg('text', { x: padL + plotW + 8, y: (y(5) + y(V_IH)) / 2 + 4, class: 'volt-label' }, 'se lee 1'),
      svg('text', { x: padL + plotW + 8, y: (y(V_IH) + y(V_IL)) / 2 - 3, class: 'volt-label' }, 'zona'),
      svg('text', { x: padL + plotW + 8, y: (y(V_IH) + y(V_IL)) / 2 + 11, class: 'volt-label' }, 'prohibida'),
      svg('text', { x: padL + plotW + 8, y: (y(V_IL) + y(0)) / 2 + 4, class: 'volt-label' }, 'se lee 0'),
    );
    [0, V_IL, V_IH, 5].forEach((v) => {
      figure.append(svg('line', { x1: padL - 4, x2: padL, y1: y(v), y2: y(v), class: 'volt-axis' }));
      figure.append(svg('text', { x: padL - 8, y: y(v) + 4, class: 'volt-tick', 'text-anchor': 'end' }, `${String(v).replace('.', ',')} V`));
    });
    SENT.forEach((bit, i) => {
      if (i) figure.append(svg('line', { x1: x(i), x2: x(i), y1: padT, y2: padT + plotH, class: 'volt-grid' }));
      figure.append(svg('text', { x: x(i + 0.5), y: H - 10, class: 'volt-tick', 'text-anchor': 'middle' }, `enviado ${bit}`));
    });
    figure.append(svg('polyline', { points: points.map(([t, v]) => `${x(t).toFixed(1)},${y(v).toFixed(1)}`).join(' '), class: 'volt-signal' }));
    read.forEach((r, i) => {
      const ok = r.bit === SENT[i];
      figure.append(svg('circle', { cx: x(r.t), cy: y(r.v), r: 5, class: `volt-sample ${ok ? 'ok' : 'bad'}` }));
    });

    clear(table);
    table.append(
      h('div', {}, h('span', { class: 'widget-label' }, 'Enviado'), SENT.map((b) => h('span', { class: 'cell' }, b))),
      h('div', {}, h('span', { class: 'widget-label' }, 'Leído'), read.map((r, i) => h('span', { class: `cell ${r.bit === SENT[i] ? '' : 'bad'}` }, r.bit ?? '?'))),
    );
    const errors = read.filter((r, i) => r.bit !== SENT[i]).length;
    verdict.textContent = errors === 0
      ? 'Todas las lecturas coinciden con los bits enviados: el ruido es pequeño frente a la separación entre niveles.'
      : `${errors} de ${SENT.length} lecturas son incorrectas o indeterminadas (?). Con ruido grande, la abstracción «0 o 1» deja de ser fiable sin técnicas adicionales (márgenes mayores, redundancia, códigos de corrección).`;
  }

  render();
}
