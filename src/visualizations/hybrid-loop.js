// Bucle híbrido: tú (o un optimizador clásico) mueves una perilla y una QPU
// simulada devuelve recuentos aleatorios. Objetivo: obtener 1 con cierta frecuencia.
// Internamente la perilla es un ángulo θ y P(1) = sin²(θ/2), pero el lector aún no
// conoce los qubits (Módulo 3), así que la interfaz no lo muestra.

import { h, clear } from '../utils/dom.js';
import { runShots, optimizerStep, probabilityOfOne, shotError } from '../utils/hardware.js';

const TARGETS = [0.3, 0.7, 0.9];
const SHOTS = [10, 100, 1000];
const pct = (p) => `${(p * 100).toLocaleString('es', { maximumFractionDigits: 1 })} %`;

export function mount(root, { target: t0 = 0.7 } = {}) {
  let target = t0, theta = 0.5, shots = 100, history = [], showTrue = false;

  const targetChips = TARGETS.map((t) => h('button', { type: 'button', class: 'chip', onclick: () => { target = t; history = []; render(); } }, pct(t)));
  const shotChips = SHOTS.map((n) => h('button', { type: 'button', class: 'chip', onclick: () => { shots = n; render(); } }, String(n)));
  const slider = h('input', { type: 'range', min: '0', max: '3.14', step: '0.01', value: String(theta), 'aria-label': 'Posición de la perilla de ajuste', oninput: (e) => { theta = Number(e.target.value); render(); } });
  const thetaOut = h('output', { class: 'mono' });
  const send = h('button', { type: 'button', class: 'btn primary', onclick: () => { run(); } }, 'Enviar a la QPU');
  const auto = h('button', { type: 'button', class: 'btn', onclick: () => {
    const last = history[history.length - 1];
    theta = Math.min(3.14, Math.max(0, optimizerStep(last.theta, last.p, target)));
    run();
  } }, 'Que decida el optimizador');
  const reset = h('button', { type: 'button', class: 'btn', onclick: () => { history = []; theta = 0.5; render(); } }, 'Reiniciar');
  const truth = h('input', { type: 'checkbox', onchange: (e) => { showTrue = e.target.checked; render(); } });
  const result = h('div', { class: 'hl-result', 'aria-live': 'polite' });
  const log = h('ol', { class: 'hl-log' });

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Objetivo: obtener 1 el'), targetChips),
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'Perilla de ajuste', slider), thetaOut),
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Repeticiones (shots)'), shotChips),
    h('div', { class: 'btn-row' }, send, auto, reset),
    result,
    h('label', { class: 'small hl-truth' }, truth, ' Mostrar la probabilidad real (solo es posible en una simulación; una QPU real no la revela)'),
    log,
  );

  function run() {
    const ones = runShots(theta, shots);
    history.push({ theta, shots, ones, p: ones / shots });
    render();
  }

  function render() {
    targetChips.forEach((c, k) => c.setAttribute('aria-pressed', String(TARGETS[k] === target)));
    shotChips.forEach((c, k) => c.setAttribute('aria-pressed', String(SHOTS[k] === shots)));
    slider.value = String(theta);
    thetaOut.textContent = theta.toFixed(2);
    auto.disabled = history.length === 0;
    auto.title = history.length ? '' : 'Primero envía un circuito: el optimizador necesita un resultado';

    clear(result);
    const last = history[history.length - 1];
    if (!last) {
      result.append(h('p', { class: 'muted' }, 'Mueve la perilla y envía el circuito. La QPU solo devuelve cuántas veces salió 0 y cuántas 1.'));
    } else {
      const zeros = last.shots - last.ones;
      const close = Math.abs(last.p - target) <= 2 * shotError(target, last.shots);
      result.append(
        h('div', { class: 'hl-bars' },
          h('div', { class: 'hl-bar' }, h('span', {}, '0'), h('div', { class: 'hl-track' }, h('i', { style: { width: `${(zeros / last.shots) * 100}%` } })), h('b', {}, String(zeros))),
          h('div', { class: 'hl-bar one' }, h('span', {}, '1'), h('div', { class: 'hl-track' }, h('i', { style: { width: `${last.p * 100}%` } }),
            h('em', { class: 'hl-target', style: { left: `${target * 100}%` }, title: 'objetivo' })), h('b', {}, String(last.ones)))),
        h('p', {}, `Salió 1 en el ${pct(last.p)} de las repeticiones (objetivo: ${pct(target)}). Trabajos enviados a la QPU: ${history.length}.`),
        showTrue ? h('p', { class: 'small' }, `Probabilidad real con la perilla en ${last.theta.toFixed(2)}: ${pct(probabilityOfOne(last.theta))}. La diferencia con lo observado es ruido estadístico de las repeticiones.`) : null,
        close ? h('p', { class: 'hl-ok' }, `✓ Dentro del margen de ruido de ${last.shots} repeticiones. Para afinar más hacen falta más shots, y cada trabajo cuesta tiempo de QPU.`) : null,
      );
    }
    clear(log);
    history.slice(-8).forEach((r) => log.append(h('li', { class: 'mono' }, `perilla ${r.theta.toFixed(2)} · ${r.shots} repeticiones · salió 1 el ${pct(r.p)}`)));
    log.hidden = history.length === 0;
    log.start = Math.max(1, history.length - 7);
  }
  render();
}
