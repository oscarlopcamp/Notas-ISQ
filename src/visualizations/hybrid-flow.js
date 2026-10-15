// El viaje de un programa cuántico: de tu computadora a la QPU y de vuelta.
// Cada paso resalta el componente que trabaja y lo que viaja entre componentes.

import { h, clear } from '../utils/dom.js';

const PARTS = [
  { name: 'Tu computadora', detail: 'programa clásico' },
  { name: 'Servicio en la nube', detail: 'compilador y cola' },
  { name: 'Electrónica de control', detail: 'genera señales' },
  { name: 'QPU', detail: 'qubits aislados' },
];

const STEPS = [
  { part: 0, title: 'Plantear el problema', text: 'Todo empieza en una computadora normal: qué quieres calcular y qué parte, si alguna, merece ejecutarse en la QPU.', travels: 'Nada todavía.' },
  { part: 0, title: 'Escribir el circuito', text: 'Con una biblioteca como Qiskit, el programa describe un circuito cuántico: cuántos qubits usa, qué operaciones aplica y qué se mide al final.', travels: 'Una descripción del circuito: datos clásicos, como cualquier otro archivo.' },
  { part: 1, title: 'Compilar', text: 'El circuito se traduce a las pocas operaciones que sabe hacer ese equipo concreto, igual que un compilador clásico traduce un programa a las instrucciones de una CPU (lección 1.10).', travels: 'El circuito, reescrito para un equipo concreto.' },
  { part: 1, title: 'Esperar turno', text: 'Muchos usuarios comparten el mismo equipo, así que el trabajo entra en una cola. La espera puede ser mucho más larga que la propia ejecución.', travels: 'El trabajo: el circuito y cuántas veces repetirlo (shots).' },
  { part: 2, title: 'Generar las señales', text: 'La electrónica de control convierte cada operación en una señal física muy precisa: pulsos de microondas o de láser, según la tecnología (lección 2.6).', travels: 'Señales físicas cronometradas al nanosegundo.' },
  { part: 3, title: 'Ejecutar y medir', text: 'Los qubits parten del estado 0, reciben los pulsos y se miden. Cada medición da un bit por qubit. Como el resultado es aleatorio, todo se repite cientos o miles de veces.', travels: 'Una cadena de bits por repetición, por ejemplo 0110.' },
  { part: 0, title: 'Procesar los resultados', text: 'Una computadora clásica cuenta los resultados, estima probabilidades y, si hace falta, corrige el efecto del ruido. En un algoritmo híbrido, decide además qué circuito ejecutar a continuación.', travels: 'Un recuento, por ejemplo {"0": 507, "1": 493}.' },
];

export function mount(root) {
  let i = 0;
  const lane = h('div', { class: 'hf-lane' });
  const card = h('div', { class: 'hf-card', 'aria-live': 'polite' });
  const dots = h('div', { class: 'hf-dots', role: 'group', 'aria-label': 'Ir a un paso' });
  const prev = h('button', { type: 'button', class: 'btn', onclick: () => { i = Math.max(0, i - 1); render(); } }, '← Anterior');
  const next = h('button', { type: 'button', class: 'btn primary', onclick: () => { i = Math.min(STEPS.length - 1, i + 1); render(); } }, 'Siguiente →');

  root.append(lane, card, h('div', { class: 'btn-row' }, prev, next, dots));

  function render() {
    const s = STEPS[i];
    clear(lane);
    PARTS.forEach((p, k) => {
      if (k) lane.append(h('span', { class: 'hf-arrow', 'aria-hidden': 'true' }, '⇄'));
      lane.append(h('div', { class: `hf-part ${k === s.part ? 'active' : ''} ${k === 3 ? 'quantum' : ''}` }, h('b', {}, p.name), h('small', {}, p.detail)));
    });
    clear(card);
    card.append(
      h('p', { class: 'hf-step' }, `Paso ${i + 1} de ${STEPS.length} · ${PARTS[s.part].name}`),
      h('h5', {}, s.title),
      h('p', {}, s.text),
      h('p', { class: 'hf-travels' }, h('span', {}, 'Qué viaja: '), s.travels),
    );
    clear(dots);
    STEPS.forEach((st, k) => dots.append(h('button', { type: 'button', class: `hf-dot ${k === i ? 'on' : ''}`, 'aria-label': `Paso ${k + 1}: ${st.title}`, 'aria-current': k === i ? 'step' : null, onclick: () => { i = k; render(); } })));
    prev.disabled = i === 0;
    next.disabled = i === STEPS.length - 1;
  }
  render();
}
