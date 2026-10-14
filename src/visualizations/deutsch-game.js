// El problema de Deutsch como juego: una función oculta de un bit es constante
// o balanceada. ¿Cuántas consultas necesita un algoritmo clásico para saberlo?

import { h, clear, append } from '../utils/dom.js';
import { DEUTSCH_FUNCTIONS, compatibleFunctions, decided } from '../utils/quantumintro.js';

export function mount(root) {
  let secret, queries, answer, stats = { games: 0, queries: 0 };
  const box = h('div', { class: 'dg-box' });
  root.append(
    h('p', { class: 'small' }, 'Hay una función oculta f que recibe un bit y devuelve un bit. Es una de estas cuatro:'),
    h('div', { class: 'dg-funcs' }, DEUTSCH_FUNCTIONS.map((fn) => h('span', { class: 'dg-func' }, h('b', {}, fn.name), ` f(0)=${fn.f(0)}, f(1)=${fn.f(1)} · ${fn.kind}`))),
    h('p', { class: 'small' }, 'Puedes consultarla (preguntar f(0) o f(1)). Tu objetivo: decidir con certeza si es constante o balanceada.'),
    box,
  );

  function newGame() {
    secret = DEUTSCH_FUNCTIONS[Math.floor(Math.random() * 4)];
    queries = {};
    answer = null;
    render();
  }

  function render() {
    clear(box);
    const compat = compatibleFunctions(queries);
    const known = decided(queries);
    const n = Object.keys(queries).length;
    append(box, [
      h('div', { class: 'btn-row' },
        [0, 1].map((x) => h('button', { type: 'button', class: 'btn', disabled: x in queries || answer !== null, onclick: () => { queries[x] = secret.f(x); render(); } },
          x in queries ? `f(${x}) = ${queries[x]}` : `Consultar f(${x})`)),
        h('span', { class: 'dg-count' }, `Consultas: ${n}`)),
      h('p', { class: 'small' }, n === 0 ? 'Aún no has consultado nada: cualquiera de las cuatro es posible.'
        : `Funciones compatibles con lo que sabes: ${compat.map((f) => `${f.name} (${f.kind})`).join(', ')}.`),
      answer === null
        ? h('div', { class: 'btn-row' },
          h('span', { class: 'widget-label' }, 'Tu respuesta'),
          ['constante', 'balanceada'].map((k) => h('button', { type: 'button', class: 'btn primary', onclick: () => { answer = k; stats.games += 1; stats.queries += n; render(); } }, `Es ${k}`)))
        : h('div', { class: `dg-result ${answer === secret.kind ? 'ok' : 'bad'}` },
          h('p', {}, answer === secret.kind ? '✓ Correcto' : '✗ Incorrecto', `: era «${secret.name}», que es ${secret.kind}.`),
          h('p', {}, known
            ? `Con ${n} consultas podías estar seguro.`
            : `Con ${n} consulta${n === 1 ? '' : 's'} no podías saberlo: quedaban posibles funciones de los dos tipos. ${answer === secret.kind ? 'Acertaste por suerte (probabilidad 1/2).' : ''}`),
          h('button', { type: 'button', class: 'btn', onclick: newGame }, 'Otra función')),
      stats.games ? h('p', { class: 'muted small' }, `Partidas: ${stats.games} · media de consultas: ${(stats.queries / stats.games).toFixed(2)}`) : null,
    ]);
  }

  newGame();
}
