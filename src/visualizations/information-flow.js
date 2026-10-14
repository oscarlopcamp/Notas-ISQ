// Recorrido simplificado de un carácter: teclado → codificación → memoria → CPU → salida.
// Es un modelo pedagógico: omite controladores, interrupciones, cachés, sistema
// operativo y la representación real de las fuentes tipográficas.

import { h, clear } from '../utils/dom.js';
import { inline } from '../utils/text.js';

const STAGES = [
  {
    title: 'Entrada',
    icon: '⌨',
    data: 'tecla «H»',
    text: 'Pulsas la tecla H. El teclado no envía la letra: envía un <b>código de tecla</b> que identifica qué tecla física se pulsó; la tecla Mayúsculas envía su propio código.',
  },
  {
    title: 'Codificación',
    icon: '⇄',
    data: '72 → 01001000',
    text: 'El sistema operativo traduce ese código de tecla, según la distribución del teclado, al carácter «H». El programa lo representa con la codificación acordada: en ASCII/UTF-8, «H» es 72, es decir, <span class="mono">01001000</span>.',
  },
  {
    title: 'Memoria',
    icon: '▦',
    data: 'dir. 0x1000: 01001000',
    text: 'El byte se guarda en una celda de memoria con una dirección. La memoria solo guarda el patrón de bits: no «sabe» que es una letra. Esa interpretación pertenece al programa.',
  },
  {
    title: 'Procesamiento (CPU)',
    icon: '⚙',
    data: '01001000 + 00100000 = 01101000',
    text: 'Supongamos que el programa convierte el texto a minúsculas. En ASCII, las mayúsculas y minúsculas de una misma letra difieren exactamente en 32 (el bit de peso $2^5$). La CPU ejecuta una instrucción de suma: $72 + 32 = 104$, que es «h».',
  },
  {
    title: 'Salida',
    icon: '▭',
    data: '104 → glifo «h» → píxeles',
    text: 'Para mostrar el resultado, el programa busca la forma (glifo) del carácter 104 en una fuente tipográfica y la pantalla enciende los píxeles correspondientes: de nuevo, números que codifican colores.',
  },
];

export function mount(root) {
  let step = 0;

  const track = h('ol', { class: 'flow-track' });
  const explanation = h('div', { class: 'flow-explanation', 'aria-live': 'polite' });
  const prev = h('button', { type: 'button', class: 'btn', onclick: () => go(step - 1) }, '← Anterior');
  const next = h('button', { type: 'button', class: 'btn primary', onclick: () => go(step + 1) }, 'Siguiente →');
  const counter = h('span', { class: 'muted sans' });

  root.append(track, explanation, h('div', { class: 'btn-row flow-nav' }, prev, counter, next));

  function go(i) {
    step = Math.max(0, Math.min(STAGES.length - 1, i));
    render();
  }

  function render() {
    clear(track);
    STAGES.forEach((s, i) => {
      track.append(h('li', { class: `flow-stage${i === step ? ' current' : ''}${i < step ? ' past' : ''}` },
        h('button', { type: 'button', onclick: () => go(i), 'aria-current': i === step ? 'step' : null },
          h('span', { class: 'flow-icon', 'aria-hidden': 'true' }, s.icon),
          h('span', { class: 'flow-title' }, `${i + 1}. ${s.title}`),
          h('span', { class: 'flow-data mono' }, s.data))));
    });
    explanation.innerHTML = `<p>${inline(STAGES[step].text)}</p>`;
    prev.disabled = step === 0;
    next.disabled = step === STAGES.length - 1;
    counter.textContent = `Paso ${step + 1} de ${STAGES.length}`;
  }

  render();
}
