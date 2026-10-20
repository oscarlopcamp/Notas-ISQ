// Leer circuitos: cada pregunta muestra un circuito y pide qué puede salir al medir.
// Las respuestas se comprueban con el simulador (tests/module3.test.js).

import { h, clear } from '../utils/dom.js';
import { CTRL, TARG } from '../utils/circuit.js';
import { drawCircuit } from './circuit-svg.js';

export const QUESTIONS = [
  { n: 1, cols: [['X']], options: ['Siempre 0', 'Siempre 1', '0 o 1, mitad y mitad'], right: 1,
    why: 'X intercambia 0 y 1: el qubit empieza en |0⟩ y termina en |1⟩.' },
  { n: 2, cols: [[null, 'X']], options: ['Siempre 01', 'Siempre 10', '00 o 11'], right: 1,
    why: 'La X está en q1, la segunda línea. En la cadena, el qubit 1 es el bit de la izquierda: 10. Es el ejemplo de la guía de Qiskit.' },
  { n: 2, cols: [['H', null]], options: ['00 o 10, mitad y mitad', '00 o 01, mitad y mitad', 'Las cuatro cadenas'], right: 1,
    why: 'Solo se mezcla q0, la línea de arriba, que en la cadena es el bit de la derecha. q1 sigue en 0.' },
  { n: 1, cols: [['H'], ['Z'], ['H']], options: ['Siempre 0', 'Siempre 1', '0 o 1, mitad y mitad'], right: 1,
    why: 'Es la secuencia mezclar, cambiar signo, mezclar de la lección 3.8: interferencia destructiva en el 0.' },
  { n: 2, cols: [['H', null], [CTRL, TARG]], options: ['00, 01, 10 u 11', '00 u 11, mitad y mitad', 'Siempre 00'], right: 1,
    why: 'Es el par de Bell de la lección 3.7: q0 se mezcla y la CNOT copia su valor en q1 en cada uno de los dos casos.' },
];

export function mount(root) {
  const answers = {};
  const list = h('div', {});
  const score = h('p', { class: 'widget-stats', 'aria-live': 'polite' });
  root.append(list, score);
  function render() {
    clear(list);
    QUESTIONS.forEach((qz, i) => {
      const a = answers[i];
      list.append(h('div', { class: `rq-item ${a == null ? '' : a === qz.right ? 'ok' : 'bad'}` },
        h('p', { class: 'sc-task' }, `${i + 1}. ¿Qué puede salir al medir?`),
        drawCircuit(qz.n, qz.cols, { label: `Circuito de la pregunta ${i + 1}` }),
        h('div', { class: 'sc-options', role: 'group', 'aria-label': `Respuesta ${i + 1}` },
          qz.options.map((o, k) => h('button', { type: 'button', class: `chip mono ${a != null && k === qz.right ? 'sc-correct' : ''}`, 'aria-pressed': String(a === k), onclick: () => { answers[i] = k; render(); } }, o))),
        a == null ? null : h('p', { class: 'sc-why' }, `${a === qz.right ? '✓ ' : '✗ '}${qz.why}`)));
    });
    const done = Object.keys(answers).length, ok = Object.entries(answers).filter(([i, a]) => QUESTIONS[i].right === a).length;
    score.textContent = done ? `${ok} de ${done} correctas.` : '';
  }
  render();
}
