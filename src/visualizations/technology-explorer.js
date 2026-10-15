// Explorador de tecnologías de qubits (descripción cualitativa, con fuentes)
// y un pequeño juego: «¿qué tecnología es?».

import { h, clear } from '../utils/dom.js';
import { inline } from '../utils/text.js';

const TECHS = [
  {
    id: 'sc', name: 'Superconductores',
    qubit: 'Un pequeño circuito eléctrico de material superconductor (sin resistencia eléctrica en frío), fabricado como un chip.',
    control: 'Pulsos de microondas. El chip se enfría a milikelvin (milésimas de grado sobre el cero absoluto) en un refrigerador de dilución.',
    pros: ['Operaciones muy rápidas.', 'Se fabrica con técnicas parecidas a las de la industria de chips.', 'Ha protagonizado experimentos destacados de corrección de errores.'],
    cons: ['Cada qubit suele conectarse solo con sus vecinos.', 'Necesita refrigeración extrema y mucho cableado.', 'Los qubits fabricados no son idénticos: hay que calibrarlos uno a uno.'],
    cite: '[@kjaergaard2020; @google2025]',
  },
  {
    id: 'ion', name: 'Iones atrapados',
    qubit: 'Un átomo con carga eléctrica, suspendido en el vacío por campos electromagnéticos. El qubit son dos de sus niveles de energía.',
    control: 'Láseres o microondas. Los iones de una cadena interactúan a través de su movimiento compartido.',
    pros: ['Todos los iones de un elemento son idénticos por naturaleza.', 'Conservan su estado mucho tiempo y sus operaciones son muy precisas.', 'Dentro de una cadena, cualquier ion puede interactuar con cualquier otro.'],
    cons: ['Operaciones más lentas que las superconductoras.', 'Las cadenas largas son difíciles de controlar: se investigan trampas con varias zonas y el transporte de iones.'],
    cite: '[@bruzewicz2019]',
  },
  {
    id: 'atom', name: 'Átomos neutros',
    qubit: 'Un átomo sin carga, atrapado con un haz de láser muy enfocado («pinza óptica»). Se forman matrices de cientos de átomos.',
    control: 'Láseres. Para que dos átomos interactúen, un láser los «hincha» momentáneamente hasta que notan a sus vecinos.',
    pros: ['Matrices grandes y reconfigurables.', 'Se programa con circuitos o en modo analógico, guiando directamente la evolución física.'],
    cons: ['Las operaciones y la medición son más lentas que en los superconductores.', 'Hacer más precisas las operaciones entre átomos es un área activa de investigación.'],
    cite: '[@henriet2020]',
  },
  {
    id: 'photon', name: 'Fotónica',
    qubit: 'Un fotón, una partícula de luz. La información va, por ejemplo, en su polarización o en el camino que sigue.',
    control: 'Componentes ópticos (divisores de haz, desfasadores), cada vez más integrados en chips, y detectores de fotones individuales.',
    pros: ['Los fotones viajan lejos con poco ruido: son la base de las comunicaciones cuánticas.', 'Interactúan poco con el entorno.'],
    cons: ['Precisamente porque apenas interactúan, las operaciones entre dos fotones son difíciles; con los métodos más sencillos solo funcionan algunas veces.', 'Cada fotón perdido es información perdida.'],
    cite: '[@slussarenko2019; @kok2007]',
  },
  {
    id: 'spin', name: 'Espines en semiconductores',
    qubit: 'El espín (una especie de pequeño imán) de un electrón atrapado en una trampa diminuta de silicio o germanio.',
    control: 'Voltajes en electrodos y campos de microondas, a temperaturas criogénicas.',
    pros: ['Qubits diminutos, compatibles con la fabricación de semiconductores.', 'Conservan su estado mucho tiempo: el espín es poco sensible a las perturbaciones eléctricas.'],
    cons: ['Los dispositivos varían entre sí.', 'Integrar muchos qubits con su electrónica de control sigue siendo un reto.'],
    cite: '[@burkard2023]',
  },
];

const QUIZ = [
  ['Necesita milikelvin y sus qubits son circuitos fabricados como chips.', 'sc'],
  ['Sus qubits son idénticos por naturaleza y, en una cadena, cualquier par puede interactuar.', 'ion'],
  ['Atrapa sus qubits uno a uno con haces de láser («pinzas ópticas»).', 'atom'],
  ['Su portador viaja lejos con poco ruido, pero las operaciones entre dos qubits son su gran reto.', 'photon'],
  ['Aprovecha la industria del silicio con qubits diminutos.', 'spin'],
];

export function mount(root) {
  let current = 'sc';
  const answers = {};
  const tabs = TECHS.map((t) => h('button', { type: 'button', class: 'chip', onclick: () => { current = t.id; render(); } }, t.name));
  const card = h('div', { class: 'te-card' });
  const quiz = h('div', { class: 'te-quiz' });

  root.append(h('div', { class: 'widget-controls', role: 'group', 'aria-label': 'Tecnología' }, tabs), card, h('h5', { class: 'te-quiz-title' }, 'Ponte a prueba: ¿qué tecnología es?'), quiz);

  function render() {
    tabs.forEach((b, k) => b.setAttribute('aria-pressed', String(TECHS[k].id === current)));
    const t = TECHS.find((x) => x.id === current);
    clear(card);
    card.append(
      h('dl', { class: 'te-facts' }, h('dt', {}, 'El qubit'), h('dd', {}, t.qubit), h('dt', {}, 'Cómo se controla'), h('dd', {}, t.control)),
      h('div', { class: 'te-cols' },
        h('div', {}, h('p', { class: 'te-head ok' }, 'Puntos fuertes'), h('ul', {}, t.pros.map((x) => h('li', {}, x)))),
        h('div', {}, h('p', { class: 'te-head bad' }, 'Retos'), h('ul', {}, t.cons.map((x) => h('li', {}, x))))),
      h('p', { class: 'small muted', html: `Fuente: ${inline(t.cite)}` }),
    );
    clear(quiz);
    QUIZ.forEach(([clue, id], k) => {
      const a = answers[k];
      quiz.append(h('div', { class: `sc-item ${a ? (a === id ? 'ok' : 'bad') : ''}` },
        h('p', { class: 'sc-task' }, `${k + 1}. ${clue}`),
        h('div', { class: 'sc-options', role: 'group', 'aria-label': `Respuesta ${k + 1}` },
          TECHS.map((t2) => h('button', { type: 'button', class: `chip ${a && t2.id === id ? 'sc-correct' : ''}`, 'aria-pressed': String(a === t2.id), onclick: () => { answers[k] = t2.id; render(); } }, t2.name))),
        a ? h('p', { class: 'sc-why' }, a === id ? '✓ Correcto.' : `✗ Es ${TECHS.find((x) => x.id === id).name.toLowerCase()}.`) : null));
    });
  }
  render();
}
