import { h } from '../utils/dom.js';
import { modules, lessons, availableLessons } from '../../content/curriculum.js';
import { store } from '../utils/storage.js';
import { moduleProgress, recommendedLesson, setTitle } from '../components/ui.js';

const METHOD = ['Intuición', 'Visualización', 'Explicación conceptual', 'Ejemplo', 'Formalización matemática', 'Implementación', 'Aplicación práctica'];

export function render(main) {
  setTitle(null);
  const rec = recommendedLesson();
  const started = Object.keys(store.get().completed).length > 0 || store.get().lastLesson;
  const total = lessons.length;
  const available = availableLessons().length;

  main.append(h('div', { class: 'page' },
    h('section', { class: 'home-hero' },
      h('div', { class: 'eyebrow' }, 'Libro interactivo'),
      h('h1', {}, 'Del bit al qubit: ingeniería de software cuántico'),
      h('p', { class: 'lede' }, 'Un recorrido progresivo para ingenieras e ingenieros de software: desde cómo una computadora clásica representa información hasta la arquitectura, la calidad y la seguridad de los sistemas híbridos clásico-cuánticos.'),
      h('div', { class: 'btn-row' },
        rec ? h('a', { class: 'btn primary', href: `#/leccion/${rec.id}` }, started ? `Continuar: ${rec.title}` : 'Comenzar la ruta guiada') : null,
        h('a', { class: 'btn', href: '#/biblioteca' }, 'Consultar un concepto'))),

    h('h2', {}, 'Cómo está pensado este libro'),
    h('p', {}, 'Cada idea se presenta en el orden en que se aprende mejor: primero entendemos qué ocurre, después cómo se representa y, al final, cómo se calcula y se programa. Nunca tendrás que aprender a la vez un fenómeno cuántico, una ecuación nueva y una biblioteca de programación.'),
    h('p', { class: 'sans muted', style: { fontSize: '0.88rem' } }, METHOD.join('  →  ')),

    h('h3', {}, 'Tres niveles de profundidad'),
    h('p', {}, 'Las lecciones se organizan, cuando el tema lo permite, en tres niveles. Puedes leerlos en orden (recomendado) o elegir uno desde el selector de nivel.'),
    h('div', { class: 'level-legend' },
      h('div', {}, h('strong', {}, '1 · Comprender'), 'Intuición, analogías, diagramas y simulaciones, con comparaciones con la computación clásica.'),
      h('div', {}, h('strong', {}, '2 · Entender matemáticamente'), 'Notación, definiciones y cálculos desarrollados paso a paso.'),
      h('div', {}, h('strong', {}, '3 · Implementar'), 'Código en Python (y, desde el Módulo 5, Qiskit), resultados esperados y experimentos.')),

    h('h3', {}, 'Dos formas de usarlo'),
    h('div', { class: 'two-col' },
      h('div', { class: 'panel' }, h('h3', {}, 'Ruta guiada'), h('p', {}, 'Avanza módulo a módulo. Cada lección indica qué necesitas saber antes, qué aprenderás y para qué te servirá después. Tu progreso se guarda en este navegador.'), h('a', { href: '#/progreso' }, 'Ver mi progreso →')),
      h('div', { class: 'panel' }, h('h3', {}, 'Biblioteca de consulta'), h('p', {}, 'Busca directamente un concepto («¿qué es un qubit?», «¿qué es BB84?») desde el buscador superior —atajo: tecla /— o en la biblioteca, el glosario y las referencias.'), h('a', { href: '#/biblioteca' }, 'Ir a la biblioteca →'))),

    h('h2', {}, 'La ruta'),
    h('ol', { class: 'learning-path' }, modules.map((m) => {
      const p = moduleProgress(m.id);
      return h('li', { class: p.done > 0 ? 'started' : '' },
        h('span', { class: 'node' }, m.number),
        h('div', {},
          h('a', { href: `#/modulo/${m.id}` }, m.fullTitle),
          h('small', {}, `${m.objective} · ${p.total} lecciones · ${p.available ? `${p.available} disponible${p.available > 1 ? 's' : ''}` : 'en preparación'}${p.done ? ` · ${p.done} completada${p.done > 1 ? 's' : ''}` : ''}`)));
    })),

    h('h2', {}, 'Estado de la obra'),
    h('p', {}, `La plataforma se construye por etapas y solo publica lecciones cuyo contenido, ejemplos y referencias se han verificado. Actualmente hay ${available} de ${total} lecciones disponibles; el resto aparece en el índice marcado como «pendiente», con los temas que cubrirá.`),
    h('p', { class: 'muted' }, 'Las referencias académicas incluyen el método y la fecha de verificación. Los recuadros de cada lección distinguen el conocimiento establecido de los modelos simplificados, los resultados experimentales, las propuestas de investigación y los problemas abiertos.'),
  ));
}
