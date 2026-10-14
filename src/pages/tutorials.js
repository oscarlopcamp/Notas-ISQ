import { h } from '../utils/dom.js';
import { tutorials } from '../../content/tutorials.js';
import { lessonById } from '../../content/curriculum.js';
import { breadcrumbs, setTitle } from '../components/ui.js';

export function render(main) {
  setTitle('Tutoriales');
  main.append(h('div', { class: 'page' },
    breadcrumbs([['Inicio', '#/'], ['Tutoriales']]),
    h('h1', {}, 'Tutoriales guiados'),
    h('p', { class: 'lede' }, 'Tutoriales de programación cuántica con Python y Qiskit, pensados para ejecutarse en tu propio entorno.'),
    h('p', {}, 'Cada tutorial incluirá: objetivo, explicación conceptual, circuito visual, código completo, explicación línea por línea, resultado esperado, interpretación, errores frecuentes y referencias a la documentación oficial vigente.'),
    h('aside', { class: 'callout warning' },
      h('div', { class: 'callout-title' }, 'Estado'),
      h('p', {}, 'Los tutoriales de Qiskit se desarrollarán en la Etapa 5. Se publicarán solo después de ejecutar el código con la versión vigente de Qiskit y registrar la versión utilizada; la plataforma no simula la ejecución de Python. Mientras tanto, la lección 1.1 contiene ejemplos de Python estándar con su salida real.')),
    h('h2', {}, 'Tutoriales previstos'),
    h('ul', { class: 'toc-list' }, tutorials.map((t, i) => {
      const l = lessonById(t.lesson);
      return h('li', {}, h('div', { class: 'toc-row' },
        h('span', { class: 'num' }, `T${i + 1}`),
        h('span', { class: 'title' }, t.title, h('span', { class: 'desc', html: `Asociado a la lección <a href="#/leccion/${l.id}">${l.number} ${l.title}</a>` })),
        h('span', { class: 'meta' }, h('span', { class: 'badge pending' }, 'Pendiente'))));
    })),
  ));
}
