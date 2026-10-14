// Jerarquía de memoria en escala logarítmica, con una analogía a escala humana.
// Los tiempos son órdenes de magnitud representativos (Patterson y Hennessy, cap. 5;
// Hennessy y Patterson, cap. 2); varían mucho entre generaciones y fabricantes.

import { h, clear } from '../utils/dom.js';

const LEVELS = [
  { name: 'Registros', where: 'dentro de la CPU', t: 0.3, cap: 'cientos de bytes', note: 'Se leen en el mismo ciclo de reloj de la instrucción.' },
  { name: 'Caché L1', where: 'en el chip de la CPU', t: 1, cap: 'decenas de KiB', note: 'Memoria SRAM muy rápida y cara, junto a cada núcleo.' },
  { name: 'Caché L2/L3', where: 'en el chip de la CPU', t: 10, cap: 'MiB', note: 'Más grande y algo más lenta; la L3 suele compartirse entre núcleos.' },
  { name: 'Memoria principal (DRAM)', where: 'módulos en la placa', t: 60, cap: 'GiB', note: 'La «RAM». Del orden de 50–100 ns por acceso.' },
  { name: 'SSD (memoria flash)', where: 'almacenamiento', t: 50_000, cap: 'cientos de GB a TB', note: 'Conserva los datos sin energía. Decenas de microsegundos.' },
  { name: 'Disco magnético', where: 'almacenamiento', t: 10_000_000, cap: 'TB', note: 'Tiene partes móviles: milisegundos para posicionar el cabezal.' },
];

function human(ns) {
  const s = ns; // 1 ns → 1 s
  if (s < 60) return `${s.toPrecision(2)} s`;
  if (s < 3600) return `${(s / 60).toPrecision(2)} min`;
  if (s < 86400) return `${(s / 3600).toPrecision(2)} h`;
  if (s < 86400 * 365) return `${(s / 86400).toPrecision(2)} días`;
  return `${(s / 86400 / 365.25).toPrecision(2)} años`;
}
function real(ns) {
  if (ns < 1000) return `≈ ${ns} ns`;
  if (ns < 1e6) return `≈ ${ns / 1000} µs`;
  return `≈ ${ns / 1e6} ms`;
}

export function mount(root) {
  let humanScale = false;
  const toggle = h('button', { type: 'button', class: 'chip', 'aria-pressed': 'false', onclick: () => { humanScale = !humanScale; render(); } }, 'Escala humana: 1 ns → 1 s');
  const list = h('ol', { class: 'mh-list' });
  root.append(h('div', { class: 'widget-controls' }, toggle), list,
    h('p', { class: 'muted small' }, 'Barras en escala logarítmica: cada marca es 10 veces más que la anterior. Valores representativos de orden de magnitud; los reales dependen del equipo.'));

  function render() {
    toggle.setAttribute('aria-pressed', String(humanScale));
    clear(list);
    const max = Math.log10(LEVELS[LEVELS.length - 1].t) + 1;
    LEVELS.forEach((l) => {
      const width = ((Math.log10(l.t) + 1) / max) * 100;
      list.append(h('li', { class: 'mh-item' },
        h('div', { class: 'mh-head' }, h('b', {}, l.name), h('span', { class: 'muted small' }, ` · ${l.where} · capacidad: ${l.cap}`)),
        h('div', { class: 'mh-bar' }, h('div', { style: { width: `${Math.max(width, 2)}%` } }), h('span', { class: 'mono' }, humanScale ? human(l.t) : real(l.t))),
        h('small', { class: 'muted' }, l.note)));
    });
  }
  render();
}
