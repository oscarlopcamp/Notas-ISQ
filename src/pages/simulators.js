import { h } from '../utils/dom.js';
import { widgets, mountWidget } from '../visualizations/registry.js';
import { lessonById } from '../../content/curriculum.js';
import { breadcrumbs, setTitle } from '../components/ui.js';

// Simuladores previstos en el programa que aún no están implementados.
const PLANNED = [
  ['Editor de circuitos cuánticos', 3],
  ['Plano complejo, vectores y matrices', 4],
  ['Producto tensorial', 4],
  ['Histogramas y shots', 5],
  ['Teleportación, superdense coding, BB84 y E91', 6],
  ['Amplificación de amplitudes (Grover)', 7],
  ['QFT y búsqueda de período (Shor)', 7],
  ['Arquitecturas híbridas y ciclo de vida', 8],
  ['Superficie de ataque y límites de confianza', 9],
];

export function render(main) {
  setTitle('Simuladores');
  main.append(h('div', { class: 'page' },
    breadcrumbs([['Inicio', '#/'], ['Simuladores']]),
    h('h1', {}, 'Laboratorio de simulaciones'),
    h('p', { class: 'lede' }, 'Visualizaciones interactivas que acompañan a las lecciones. Todas se pueden usar de forma independiente.'),
    h('h2', {}, 'Disponibles'),
    h('ul', { class: 'toc-list' }, Object.entries(widgets).map(([id, w]) => h('li', {}, h('a', { class: 'toc-row', href: `#/simulador/${id}` },
      h('span', { class: 'num' }, `M${String(w.module).padStart(2, '0')}`),
      h('span', { class: 'title' }, w.title, h('span', { class: 'desc' }, w.description)),
      h('span', { class: 'meta' }, h('span', { class: 'badge available' }, 'Disponible')))))),
    h('h2', {}, 'Previstos'),
    h('p', { class: 'muted' }, 'Se implementarán junto con las lecciones correspondientes. Cuando una simulación use un modelo simplificado, se indicará explícitamente.'),
    h('ul', { class: 'toc-list' }, PLANNED.map(([title, m]) => h('li', {}, h('div', { class: 'toc-row' },
      h('span', { class: 'num' }, `M${String(m).padStart(2, '0')}`),
      h('span', { class: 'title' }, title),
      h('span', { class: 'meta' }, h('span', { class: 'badge pending' }, 'Pendiente')))))),
  ));
}

export function renderOne(main, [id], ctx) {
  const w = widgets[id];
  if (!w) {
    main.append(h('div', { class: 'page' }, h('h1', {}, 'Simulador no encontrado'), h('a', { href: '#/simuladores' }, 'Ver simuladores')));
    return;
  }
  setTitle(w.title);
  const body = h('div', { class: 'widget-body' });
  main.append(h('div', { class: 'page' },
    breadcrumbs([['Inicio', '#/'], ['Simuladores', '#/simuladores'], [w.title]]),
    h('h1', {}, w.title),
    h('p', { class: 'lede' }, w.description),
    h('section', { class: 'widget' }, body),
    h('p', {}, 'Explicación completa en: ', w.lessons.map((lid, i) => {
      const l = lessonById(lid);
      return [i ? ', ' : '', h('a', { href: `#/leccion/${lid}` }, `${l.number} ${l.title}`)];
    }))));
  mountWidget(id, body).then((cleanup) => { if (cleanup) ctx.cleanups.push(cleanup); });
}
