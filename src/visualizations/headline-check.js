// Leer anuncios con criterio: titulares ficticios y la pregunta que conviene hacer.

import { h, clear } from '../utils/dom.js';
import { inline } from '../utils/text.js';

const ITEMS = [
  {
    headline: '«Presentamos el procesador más grande del mundo: 5000 qubits».',
    options: ['¿De qué color es el chip?', '¿Con qué frecuencia fallan sus operaciones y cuántas puede encadenar?', '¿Cuánto cuesta?'],
    right: 1,
    why: 'El número de qubits no basta: con operaciones poco fiables, el resultado se vuelve ruido enseguida. Pregunta por la tasa de error o por métricas de todo el sistema, como el volumen cuántico [@cross2019].',
  },
  {
    headline: '«Nuestro equipo resolvió en minutos lo que a un superordenador le llevaría miles de años».',
    options: ['¿Qué tarea, frente a qué algoritmo clásico, y sirve para algo?', '¿Cuántos ingenieros participaron?', '¿Se publicó en redes sociales?'],
    right: 0,
    why: 'Estas comparaciones dependen del mejor método clásico conocido, que puede mejorar: la estimación de 10 000 años de 2019 se rebajó a unas 15 horas con 512 GPU en 2022 [@arute2019; @pan2022]. Además, la tarea suele elegirse por ser difícil, no por ser útil.',
  },
  {
    headline: '«Hemos protegido un qubit contra los errores».',
    options: ['¿Usa un lenguaje de programación nuevo?', '¿Cuántos qubits extra usa y falla de verdad menos que un qubit sin proteger?', '¿Funciona a temperatura ambiente?'],
    right: 1,
    why: 'Proteger un qubit exige repartir su información entre muchos (unidad 3.7). Solo vale la pena si el resultado falla menos que un qubit sin proteger, y si mejora al añadir más qubits. Un experimento publicado a finales de 2024 mostró ambas cosas con qubits superconductores: el error bajaba al agrandar la protección y la información duraba más que en su mejor qubit sin proteger [@google2025].',
  },
  {
    headline: '«En 2030 tendremos un millón de qubits».',
    options: ['Es una hoja de ruta: ¿qué hitos intermedios ha cumplido ya la empresa?', 'Es un hecho: ya se puede planificar con él.', 'Es imposible: nunca habrá un millón de qubits.'],
    right: 0,
    why: 'Una hoja de ruta es una propuesta, no un resultado. Compara lo prometido con lo que la empresa ha publicado y verificado en años anteriores. Tampoco hay que descartarla: algunas metas se cumplen.',
  },
];

export function mount(root) {
  const answers = {};
  const list = h('div', { class: 'sc-list' });
  const score = h('p', { class: 'widget-stats', 'aria-live': 'polite' });
  root.append(h('p', { class: 'small' }, 'Titulares ficticios, inspirados en anuncios habituales. Elige la pregunta que más conviene hacer.'), list, score);

  function render() {
    clear(list);
    ITEMS.forEach((it, i) => {
      const a = answers[i];
      list.append(h('div', { class: `sc-item ${a == null ? '' : a === it.right ? 'ok' : 'bad'}` },
        h('p', { class: 'sc-task hc-headline' }, it.headline),
        h('div', { class: 'hc-options', role: 'group', 'aria-label': `Pregunta para: ${it.headline}` },
          it.options.map((o, k) => h('button', { type: 'button', class: `chip ${a != null && k === it.right ? 'sc-correct' : ''}`, 'aria-pressed': String(a === k), onclick: () => { answers[i] = k; render(); } }, o))),
        a == null ? null : h('p', { class: 'sc-why', html: `${a === it.right ? '✓ ' : '✗ Mejor la otra pregunta. '}${inline(it.why)}` })));
    });
    const done = Object.keys(answers).length;
    const ok = Object.entries(answers).filter(([i, a]) => ITEMS[i].right === a).length;
    score.textContent = done ? `${ok} de ${done} acertadas.` : '';
  }
  render();
}
