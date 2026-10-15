// ¿Se beneficia de la computación cuántica? Clasifica tareas y compara tu
// respuesta con lo que se sabe hoy (con su fuente).

import { h, clear } from '../utils/dom.js';
import { inline } from '../utils/text.js';

const CATS = {
  exp: 'Ventaja exponencial conocida',
  poly: 'Ventaja polinómica (p. ej., cuadrática)',
  research: 'Posible, pero en investigación',
  none: 'Sin ventaja esperada',
};

const TASKS = [
  { task: 'Factorizar un entero de 2048 bits', cat: 'exp', why: 'El algoritmo de Shor es polinómico y el mejor algoritmo clásico conocido es subexponencial [@shor1997]. Requiere una computadora tolerante a fallos que aún no existe.' },
  { task: 'Simular la evolución en el tiempo de un sistema cuántico de muchas partículas', cat: 'exp', why: 'Es la motivación de Feynman: un simulador cuántico universal lo hace eficientemente para sistemas con interacciones locales, mientras que los métodos clásicos exactos necesitan recursos exponenciales [@lloyd1996; @feynman1982].' },
  { task: 'Calcular con precisión la energía de una molécula compleja', cat: 'research', why: 'Es una aplicación prometedora, pero un análisis de 2023 concluye que aún no hay pruebas de una ventaja exponencial general en este problema [@lee2023].' },
  { task: 'Buscar un elemento en una lista sin ningún orden ni estructura', cat: 'poly', why: 'Grover necesita del orden de √N consultas en lugar de N, y no se puede hacer mejor [@grover1996; @bennett1997]. Con los costes de la corrección de errores, una ventaja cuadrática puede no compensar en la práctica [@babbush2021].' },
  { task: 'Buscar un registro en una base de datos indexada', cat: 'none', why: 'Con un índice, la búsqueda clásica ya cuesta del orden de log N. Para listas ordenadas, la mejora cuántica máxima es un factor constante [@hoyer2001].' },
  { task: 'Ordenar una lista de números', cat: 'none', why: 'Incluso un algoritmo cuántico necesita del orden de N log N comparaciones, igual que los clásicos [@hoyer2001].' },
  { task: 'Servir las páginas de una tienda en línea', cat: 'none', why: 'El cuello de botella es la entrada/salida (red, discos, bases de datos), no un cálculo con estructura aprovechable. Las aplicaciones prometedoras manejan pocos datos [@hoefler2023].' },
  { task: 'Entrenar un modelo con terabytes de datos', cat: 'none', why: 'Cargar N datos clásicos en un dispositivo cuántico ya cuesta del orden de N operaciones, y las operaciones cuánticas son lentas: los problemas con grandes volúmenes de datos son malos candidatos [@hoefler2023; @aaronson2015].' },
  { task: 'Optimizar las rutas de reparto de una flota de camiones', cat: 'research', why: 'Hay heurísticas cuánticas [@farhi2014], pero no se conoce ventaja demostrada frente a las buenas heurísticas clásicas. Los problemas NP-difíciles no se esperan resolver eficientemente (lección 1.11).' },
  { task: 'Probar por fuerza bruta todas las claves secretas de 128 bits', cat: 'poly', why: 'Grover reduce 2¹²⁸ intentos a unos 2⁶⁴, que siguen siendo inviables en la práctica; por eso se recomiendan claves de 256 bits como margen (Módulo 9).' },
];

export function mount(root) {
  const answers = {};
  const list = h('div', { class: 'sc-list' });
  const score = h('p', { class: 'widget-stats', 'aria-live': 'polite' });
  root.append(h('p', { class: 'small' }, 'Para cada tarea, elige lo que crees que puede aportar la computación cuántica. Después lee la explicación.'), list, score);

  function render() {
    clear(list);
    TASKS.forEach((t, i) => {
      const a = answers[i];
      list.append(h('div', { class: `sc-item ${a ? (a === t.cat ? 'ok' : 'bad') : ''}` },
        h('p', { class: 'sc-task' }, h('b', {}, `${i + 1}. `), t.task),
        h('div', { class: 'sc-options', role: 'group', 'aria-label': `Respuesta para: ${t.task}` },
          Object.entries(CATS).map(([id, label]) => h('button', {
            type: 'button', class: `chip ${a && id === t.cat ? 'sc-correct' : ''}`, 'aria-pressed': String(a === id),
            onclick: () => { answers[i] = id; render(); },
          }, label))),
        a ? h('p', { class: 'sc-why', html: `${a === t.cat ? '✓ ' : `✗ La respuesta es «${CATS[t.cat]}». `}${inline(t.why)}` }) : null));
    });
    const done = Object.keys(answers).length;
    const ok = Object.entries(answers).filter(([i, a]) => TASKS[i].cat === a).length;
    score.textContent = done ? `${ok} de ${done} respuestas coinciden con el estado actual del conocimiento.${done === TASKS.length ? ' Fíjate en cuántas tareas habituales no se benefician: la computación cuántica es una herramienta especializada.' : ''}` : '';
  }
  render();
}
