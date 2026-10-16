// Lección 3.5 — Superposición
// Salida de código obtenida con CPython 3.14 (2026-10-16). La lógica del
// simulador está en src/utils/qubit.js y se prueba en tests/module3.test.js.
// La «mezcla» es la compuerta de Hadamard; aquí no se usa ese nombre hasta
// presentarla en la unidad 3.5 (lección 3.11).

export default {
  id: 'superposicion',
  title: 'Superposición',
  lede: 'Superposición es la palabra más repetida, y peor explicada, de la computación cuántica. Esta lección precisa qué significa, la distingue de la simple incertidumbre de una moneda y presenta la operación con la que se ve la diferencia: la mezcla.',
  updated: '2026-10-16',

  context: {
    learn: 'Qué es un estado en superposición, por qué no es lo mismo que un qubit que vale 0 o 1 sin que lo sepamos, y cómo la operación de mezcla permite distinguirlos.',
    why: 'Confundir la superposición con «estar en dos estados a la vez» o con «no saber en cuál está» lleva a errores de razonamiento sobre qué puede hacer un programa cuántico.',
    previous: 'En la unidad «El qubit» ([[>el-qubit|3.1]]–[[>esfera-de-bloch|3.4]]) vimos que un estado es $a|0\\rangle + b|1\\rangle$ y que se dibuja en la esfera de Bloch. En [[>que-es-computacion-cuantica|la lección 2.1]], el interferómetro.',
    next: 'La lección 3.6 estudia la fase relativa, la diferencia entre estados como $|+\\rangle$ y $|-\\rangle$. Las lecciones 3.7 y 3.8 usan la mezcla para presentar el entrelazamiento y la interferencia.',
  },

  objectives: [
    'Definir un estado en superposición respecto a los estados base 0 y 1.',
    'Explicar por qué un qubit en superposición no es una moneda lanzada.',
    'Aplicar la operación de mezcla a un estado y calcular el resultado.',
  ],

  prerequisites: { lessons: ['esfera-de-bloch'], knowledge: [] },

  introduction: [
    { type: 'p', text: '$|+\\rangle$ da 0 la mitad de las veces y 1 la otra mitad. Una moneda lanzada, también. ¿Qué diferencia hay entonces entre un qubit en superposición y un bit que vale 0 o 1 al azar? Antes de leer la respuesta, intenta encontrarla tú:' },
    { type: 'widget', id: 'superposition-vs-coin', caption: 'Envía 100 de cada fuente midiendo directamente; después, mezclando antes de medir. Luego resuelve la caja misteriosa con el menor número de pruebas posible.' },
  ],

  levels: {
    comprender: {
      intro: 'Qué es la superposición, la operación de mezcla y lo que la superposición no es.',
      sections: [
        {
          id: 'definicion',
          title: '¿Qué es la superposición?',
          blocks: [
            { type: 'p', text: 'Un qubit está en <b>[[superposicion|superposición]]</b> de 0 y 1 cuando su estado $a|0\\rangle + b|1\\rangle$ tiene las dos amplitudes distintas de cero. Es decir, cuando no es ni $|0\\rangle$ ni $|1\\rangle$, sino una combinación [@nielsen2010]. En la esfera de Bloch, son todos los puntos salvo los dos polos.' },
            { type: 'p', text: 'El nombre viene de la física de ondas, donde «superponer» significa sumar: dos ondas se superponen y su suma es otra onda. Los estados cuánticos se combinan con la misma regla, sumando amplitudes. No hay nada más misterioso en la palabra.' },
          ],
        },
        {
          id: 'mezcla',
          title: 'Una nueva herramienta: la mezcla',
          blocks: [
            { type: 'p', text: 'Para ver qué tiene de especial la superposición necesitamos hacer algo con el qubit antes de medirlo. Recuerda el divisor de haz de la lección 2.1: combinaba los dos caminos de un fotón. Los qubits tienen una operación equivalente, que llamaremos <b>mezcla</b>. Transforma las amplitudes así:' },
            { type: 'math', tex: '(a,\\ b) \\;\\longrightarrow\\; \\left(\\tfrac{a + b}{\\sqrt2},\\ \\tfrac{a - b}{\\sqrt2}\\right)' },
            { type: 'p', text: 'Aplicada a los estados que conocemos:' },
            { type: 'table', head: ['Antes', 'Después de mezclar', 'Al medir'], rows: [
              ['$|0\\rangle$', '$|+\\rangle$', 'Mitad y mitad'],
              ['$|1\\rangle$', '$|-\\rangle$', 'Mitad y mitad'],
              ['$|+\\rangle$', '$|0\\rangle$', 'Siempre 0'],
              ['$|-\\rangle$', '$|1\\rangle$', 'Siempre 1'],
            ] },
            { type: 'callout', kind: 'preview', title: 'Su nombre oficial', text: 'La mezcla es una de las operaciones más usadas de la computación cuántica. En la unidad 3.5 la presentaremos con su nombre oficial, junto con las demás compuertas.' },
          ],
        },
        {
          id: 'no-es-moneda',
          title: 'Superposición no es incertidumbre',
          blocks: [
            { type: 'p', text: 'Ahora el simulador se explica solo. Medidos directamente, $|+\\rangle$ y la moneda dan mitad y mitad. Pero si se mezcla antes de medir:' },
            { type: 'list', items: [
              '<b>$|+\\rangle$ se convierte en $|0\\rangle$ y da 0 siempre.</b> Sus dos amplitudes se combinan: hacia el 0 se suman y hacia el 1 se cancelan.',
              '<b>La moneda sigue dando mitad y mitad.</b> Cada vez es $|0\\rangle$ o $|1\\rangle$, y la mezcla convierte cualquiera de los dos en un estado «mitad y mitad».',
            ] },
            { type: 'p', text: 'La moneda es un qubit que está en un estado base que no conocemos: eso es incertidumbre ordinaria, la de una variable que no hemos leído. Un qubit en $|+\\rangle$ está en un estado perfectamente definido; no le falta información, y la mezcla lo demuestra llevándolo a un resultado seguro. Es la misma lección del interferómetro (2.1), ahora con un qubit.' },
            { type: 'callout', kind: 'note', status: 'establecido', title: 'Superposición «respecto a algo»', text: '$|+\\rangle$ es una superposición de $|0\\rangle$ y $|1\\rangle$, pero tras la mezcla da un resultado seguro. Decir que un estado está en superposición siempre significa «respecto a ciertos estados base», normalmente 0 y 1. En la lección 3.14 veremos que se puede medir respecto a otros.' },
          ],
        },
        {
          id: 'lo-que-no-es',
          title: 'Lo que la superposición no es',
          blocks: [
            { type: 'list', items: [
              '<b>No es «estar en 0 y en 1 a la vez».</b> Es un estado concreto, distinto de ambos. Medirlo da un solo resultado.',
              '<b>No es no saber si está en 0 o en 1.</b> Eso es la moneda, y se comporta de otra forma.',
              '<b>No es «calcular todas las respuestas en paralelo».</b> Un algoritmo que pusiera muchos valores en superposición y midiera obtendría solo uno al azar. La utilidad está en combinar las amplitudes para que la respuesta buscada sea probable (lecciones 2.1 y 3.8).',
              '<b>No es duradera por sí sola.</b> El ruido del entorno va convirtiendo la superposición en algo parecido a la moneda. Es la decoherencia, el principal enemigo del hardware (unidad 3.7).',
            ] },
          ],
        },
      ],
    },

    matematico: {
      intro: 'La regla de la mezcla, con dos ejemplos.',
      sections: [
        {
          id: 'calcular-mezcla',
          title: 'Calcular una mezcla',
          key: 'La mezcla suma y resta las dos amplitudes y divide entre √2. Si son iguales, la resta da 0: es una cancelación.',
          blocks: [
            { type: 'p', text: 'Mezclar $|+\\rangle = (\\tfrac{1}{\\sqrt2}, \\tfrac{1}{\\sqrt2})$:' },
            { type: 'math', tex: '\\left(\\tfrac{\\frac{1}{\\sqrt2} + \\frac{1}{\\sqrt2}}{\\sqrt2},\\ \\tfrac{\\frac{1}{\\sqrt2} - \\frac{1}{\\sqrt2}}{\\sqrt2}\\right) = \\left(\\tfrac{2/\\sqrt2}{\\sqrt2},\\ 0\\right) = (1,\\ 0) = |0\\rangle' },
            { type: 'p', text: 'Mezclar $|0\\rangle = (1, 0)$ da $(\\tfrac{1}{\\sqrt2}, \\tfrac{1}{\\sqrt2}) = |+\\rangle$. Por tanto, mezclar dos veces devuelve el estado inicial.' },
            { deep: true, type: 'p', text: 'Por qué la moneda da mitad y mitad tras la mezcla: con probabilidad 1/2 es $|0\\rangle$, que pasa a $|+\\rangle$ (P(0) = 1/2), y con probabilidad 1/2 es $|1\\rangle$, que pasa a $|-\\rangle$ (P(0) = 1/2). En total, $\\tfrac12 \\cdot \\tfrac12 + \\tfrac12 \\cdot \\tfrac12 = \\tfrac12$. En la moneda se promedian <em>probabilidades</em>; en $|+\\rangle$ se suman <em>amplitudes</em>. Es la misma distinción que en el interferómetro (lección 2.1).' },
            { deep: true, type: 'p', text: 'La mezcla es una operación lineal y se escribe como una matriz de 2 × 2 que multiplica la lista $[a, b]$. Las operaciones sobre qubits como matrices se estudian en el Módulo 4.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'El experimento del simulador en Python: superposición frente a moneda.',
      sections: [
        {
          id: 'python-superposicion',
          title: 'Superposición frente a moneda',
          blocks: [
            { type: 'code', lang: 'python', file: 'superposicion.py', code: `import math
import random

random.seed(3)
r = 1 / math.sqrt(2)

def mezclar(a, b):
    """La operación de mezcla (como el divisor de haz de la lección 2.1)."""
    return (a + b) * r, (a - b) * r

def medir(a, b):
    return 1 if random.random() < b**2 else 0

qubit = (r, r)                       # |+⟩: superposición «mitad y mitad»

def moneda():                        # qubit en 0 o en 1, al azar (no es superposición)
    return random.choice([(1, 0), (0, 1)])

n = 1000
print("medir directamente:   qubit", sum(medir(*qubit) for _ in range(n)),
      " moneda", sum(medir(*moneda()) for _ in range(n)))
print("mezclar y luego medir: qubit", sum(medir(*mezclar(*qubit)) for _ in range(n)),
      " moneda", sum(medir(*mezclar(*moneda())) for _ in range(n)))`,
            output: `medir directamente:   qubit 509  moneda 528
mezclar y luego medir: qubit 0  moneda 497` },
            { type: 'p', text: 'Los números son cuántos unos salieron de 1000. Medidos directamente, ambos rondan 500. Tras mezclar, el qubit da 0 unos y la moneda sigue rondando 500. <code>medir(*qubit)</code> desempaqueta la tupla: equivale a <code>medir(qubit[0], qubit[1])</code>.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Un qubit en superposición está en 0 y en 1 a la vez».', reality: 'Está en un estado concreto, distinto de $|0\\rangle$ y de $|1\\rangle$. Al medirlo da un solo resultado.' },
    { myth: '«Superposición significa que no sabemos si es 0 o 1».', reality: 'Eso es una moneda. Tras la mezcla, la moneda da mitad y mitad y $|+\\rangle$ da siempre 0.' },
    { myth: '«Con n qubits en superposición se calculan 2ⁿ resultados a la vez y se leen todos».', reality: 'Al medir se obtiene uno solo, al azar. La ventaja, cuando existe, viene de la interferencia.' },
  ],

  summary: [
    'Un qubit está en superposición de 0 y 1 si sus dos amplitudes son distintas de cero.',
    'La mezcla transforma $(a, b)$ en $((a+b)/\\sqrt2, (a-b)/\\sqrt2)$; lleva $|0\\rangle$ a $|+\\rangle$ y $|+\\rangle$ a $|0\\rangle$.',
    'Superposición no es incertidumbre: tras la mezcla, $|+\\rangle$ da siempre 0 y una moneda sigue dando mitad y mitad.',
    'La superposición es frágil: el ruido la degrada (decoherencia) [@nielsen2010].',
  ],

  exercises: [
    { level: 'comprender', question: 'En la caja misteriosa, ¿cuál es la estrategia más rápida para saber qué hay dentro?', answer: 'Mezclar y medir. Si sale algún 1, es la moneda (la superposición $|+\\rangle$ nunca da 1 tras la mezcla). Si tras unas 20 pruebas solo salen ceros, es casi seguro superposición: una moneda daría 20 ceros seguidos con probabilidad $(1/2)^{20}$, menos de una entre un millón.' },
    { level: 'matematico', question: 'Mezcla el estado $0{,}6|0\\rangle + 0{,}8|1\\rangle$. ¿Qué probabilidades se obtienen al medir?', answer: '$(\\tfrac{1{,}4}{\\sqrt2}, \\tfrac{-0{,}2}{\\sqrt2}) \\approx (0{,}990,\\ -0{,}141)$. Probabilidades: $0{,}98$ para el 0 y $0{,}02$ para el 1.' },
    { level: 'implementar', question: 'Añade a <code>superposicion.py</code> el estado $|-\\rangle$ y comprueba qué da tras mezclar.', answer: '<pre><code class="language-python">menos = (r, -r)\nprint("|−⟩ mezclado:", sum(medir(*mezclar(*menos)) for _ in range(n)))</code></pre>Da 1000: tras la mezcla, $|-\\rangle$ se convierte en $|1\\rangle$ y da siempre 1.' },
  ],

  references: [
    { key: 'nielsen2010', use: 'Superposición, la operación de mezcla (Hadamard) y decoherencia.' },
  ],

  related: ['esfera-de-bloch', 'fase-relativa', 'interferencia', 'que-es-computacion-cuantica', 'compuertas-x-h-z'],
  next: 'fase-relativa',
};
