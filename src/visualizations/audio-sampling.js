// Muestreo y cuantización de una señal: frecuencia de muestreo, bits por muestra
// y aliasing. Señal: una senoide de 1 a 12 Hz durante 1 segundo (frecuencias
// bajas para poder dibujarla; el principio es el mismo que en el audio real).

import { h, svg, clear } from '../utils/dom.js';
import { sampleSine, aliasFrequency } from '../utils/media.js';

export function mount(root, { freq = 3, rate = 20, bits = 3 } = {}) {
  let f = freq, fs = rate, b = bits;
  const W = 720, H = 260, pad = 30;
  const x = (t) => pad + t * (W - 2 * pad);
  const y = (v) => H / 2 - v * (H / 2 - pad);

  const slider = (label, min, max, value, set, unit) => {
    const out = h('output', { class: 'mono' }, `${value} ${unit}`);
    const input = h('input', { type: 'range', min: String(min), max: String(max), value: String(value), 'aria-label': label,
      oninput: (e) => { set(Number(e.target.value)); out.textContent = `${e.target.value} ${unit}`; render(); } });
    return h('label', { class: 'widget-label' }, label, input, out);
  };
  const plot = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'as-svg', role: 'img', 'aria-label': 'Señal, muestras y reconstrucción' });
  const info = h('div', { class: 'as-info' });

  root.append(
    h('div', { class: 'widget-controls' },
      slider('Frecuencia de la señal', 1, 12, f, (v) => { f = v; }, 'Hz'),
      slider('Muestreo', 2, 60, fs, (v) => { fs = v; }, 'muestras/s'),
      slider('Bits por muestra', 1, 8, b, (v) => { b = v; }, 'bits')),
    plot, info,
  );

  function render() {
    clear(plot);
    const levels = 2 ** b;
    if (b <= 4) {
      for (let l = 0; l < levels; l += 1) {
        const v = (l / (levels - 1)) * 2 - 1;
        plot.append(svg('line', { x1: pad, x2: W - pad, y1: y(v), y2: y(v), class: 'as-level' }));
      }
    }
    plot.append(svg('line', { x1: pad, x2: W - pad, y1: y(0), y2: y(0), class: 'as-axis' }));
    // Señal continua
    const pts = [];
    for (let i = 0; i <= 600; i += 1) { const t = i / 600; pts.push(`${x(t).toFixed(1)},${y(Math.sin(2 * Math.PI * f * t)).toFixed(1)}`); }
    plot.append(svg('polyline', { points: pts.join(' '), class: 'as-signal' }));

    const samples = sampleSine({ freq: f, rate: fs, bits: b });
    // Reconstrucción escalonada (retención de orden cero)
    const stair = [];
    samples.forEach((s, k) => {
      const t1 = (k + 1) / fs > 1 ? 1 : (k + 1) / fs;
      stair.push(`${x(s.t).toFixed(1)},${y(s.q).toFixed(1)}`, `${x(t1).toFixed(1)},${y(s.q).toFixed(1)}`);
    });
    plot.append(svg('polyline', { points: stair.join(' '), class: 'as-stair' }));

    const alias = aliasFrequency(f, fs);
    const undersampled = fs <= 2 * f;
    if (undersampled && alias !== f) {
      // Senoide de baja frecuencia que pasa por las mismas muestras. Si f mod fs = r,
      // sin(2π f k/fs) = sin(2π r k/fs); y si r > fs/2, es −sin(2π (fs − r) k/fs).
      const r = ((f % fs) + fs) % fs;
      const s = r <= fs / 2 ? 1 : -1;
      const apts = [];
      for (let i = 0; i <= 600; i += 1) {
        const t = i / 600;
        apts.push(`${x(t).toFixed(1)},${y(s * Math.sin(2 * Math.PI * alias * t)).toFixed(1)}`);
      }
      plot.append(svg('polyline', { points: apts.join(' '), class: 'as-alias' }));
    }
    samples.forEach((s) => {
      plot.append(svg('line', { x1: x(s.t), x2: x(s.t), y1: y(0), y2: y(s.v), class: 'as-stem' }));
      plot.append(svg('circle', { cx: x(s.t), cy: y(s.q), r: 4, class: 'as-sample' }));
    });

    clear(info);
    const bitsTotal = fs * b;
    info.append(
      h('p', {}, `Se guardan ${fs} muestras × ${b} bit${b > 1 ? 's' : ''} = ${bitsTotal} bits por segundo de señal. Cada muestra se redondea a uno de ${levels} niveles (puntos), y la línea escalonada muestra la señal reconstruida de la forma más sencilla.`),
      undersampled
        ? h('p', { class: 'tc-warn' }, `Muestreo insuficiente: hacen falta más de 2 × ${f} = ${2 * f} muestras por segundo. ${alias !== f ? `Las muestras son indistinguibles de las de una señal de ${alias} Hz (línea discontinua): es el fenómeno de aliasing.` : 'Con exactamente el doble pueden perderse completamente las oscilaciones.'}`)
        : h('p', { class: 'tc-ok' }, `El muestreo supera el doble de la frecuencia de la señal (${fs} > ${2 * f}), condición del teorema de muestreo para poder reconstruirla.`),
    );
  }

  render();
}
