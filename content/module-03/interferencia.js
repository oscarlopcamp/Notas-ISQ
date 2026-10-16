// Lección 3.8 — Interferencia constructiva y destructiva
// Salida de código obtenida con CPython 3.14 (2026-10-16). La lógica del
// constructor de interferencias se prueba en tests/module3.test.js.
// Operaciones con amplitudes reales: mezclar, cambiar signo e intercambiar
// (Hadamard, Z y X, que reciben su nombre en la unidad 3.5).

export default {
  id: 'interferencia',
  title: 'Interferencia constructiva y destructiva',
  lede: 'La interferencia es el mecanismo que hace útil a la computación cuántica: las amplitudes que llegan a un mismo resultado se suman, y pueden reforzarse o anularse. Esta lección la muestra paso a paso, con un constructor en el que tú decides las operaciones.',
  updated: '2026-10-16',

  context: {
    learn: 'Qué son la interferencia constructiva y la destructiva, cómo la fase decide cuál se produce y por qué los algoritmos cuánticos se diseñan como coreografías de interferencia.',
    why: 'Es la respuesta a la pregunta de toda la unidad: si medir da un solo resultado al azar, ¿de dónde sale la ventaja? Sale de preparar las amplitudes para que, al combinarse, la respuesta buscada se refuerce y las demás se cancelen.',
    previous: 'En [[>superposicion|la lección 3.5]] vimos la mezcla; en [[>fase-relativa|la 3.6]], la fase relativa; en [[>que-es-computacion-cuantica|la 2.1]], la interferencia con fotones.',
    next: 'La unidad 3.3 pasa a sistemas de varios qubits (lección 3.9), y la 3.4 enseña a leer circuitos cuánticos, que son secuencias de operaciones como las de esta lección.',
  },

  objectives: [
    'Explicar la interferencia constructiva y la destructiva sumando contribuciones de amplitud.',
    'Predecir el resultado de secuencias sencillas de mezclas y cambios de signo.',
    'Relacionar la fase con el tipo de interferencia.',
    'Explicar por qué la interferencia es la fuente de las ventajas cuánticas y por qué el ruido la destruye.',
  ],

  prerequisites: { lessons: ['entrelazamiento'], knowledge: [] },

  introduction: [
    { type: 'p', text: 'Cuando mezclamos un qubit, cada amplitud de entrada «envía» una contribución a cada resultado, como los dos caminos del interferómetro llegaban a cada detector. Lo que medimos depende de cómo se suman esas contribuciones. Constrúyelo tú:' },
    { type: 'widget', id: 'interference-builder', caption: 'Añade operaciones y observa las amplitudes tras cada paso (arriba, positivas; abajo, negativas). El texto explica qué contribuciones llegan a cada resultado en la última mezcla. Prueba primero M, M y después M, S, M.' },
  ],

  levels: {
    comprender: {
      intro: 'Contribuciones que se suman, el papel de la fase y por qué todo esto importa.',
      sections: [
        {
          id: 'contribuciones',
          title: 'Sumar contribuciones',
          blocks: [
            { type: 'p', text: 'En una mezcla, la amplitud del 0 a la entrada aporta $\\tfrac{a}{\\sqrt2}$ a cada salida. La del 1 aporta $\\tfrac{b}{\\sqrt2}$ a la salida 0 y $-\\tfrac{b}{\\sqrt2}$ a la salida 1. Cada salida recibe dos contribuciones, y la amplitud final es su suma:' },
            { type: 'list', items: [
              '<b>[[interferencia|Interferencia]] constructiva:</b> las dos contribuciones tienen el mismo signo y se refuerzan. La probabilidad de ese resultado crece.',
              '<b>Interferencia destructiva:</b> tienen signos opuestos y se cancelan, total o parcialmente. Ese resultado se vuelve menos probable, o imposible.',
            ] },
            { type: 'p', text: 'Ejemplo: mezclar dos veces. La primera mezcla lleva $|0\\rangle$ a $|+\\rangle$. En la segunda, al 0 llegan $+\\tfrac12$ y $+\\tfrac12$: se refuerzan y suman 1. Al 1 llegan $+\\tfrac12$ y $-\\tfrac12$: se cancelan. El qubit vuelve a $|0\\rangle$ con certeza.' },
            { type: 'callout', kind: 'note', status: 'establecido', title: 'Lo que no puede pasar con probabilidades', text: 'Si en lugar de amplitudes sumáramos probabilidades, que nunca son negativas, nada podría cancelarse: cada camino solo podría añadir. La interferencia destructiva es exclusiva de las amplitudes, y es lo que separa la computación cuántica de una computadora clásica con un generador de números aleatorios (lección 2.1) [@nielsen2010].' },
          ],
        },
        {
          id: 'fase-decide',
          title: 'La fase decide qué se cancela',
          blocks: [
            { type: 'p', text: 'Ahora prueba la secuencia mezclar, cambiar signo, mezclar. El cambio de signo invierte la fase relativa entre las dos contribuciones (lección 3.6), y la cancelación pasa del 1 al 0: el resultado es 1 con certeza.' },
            { type: 'p', text: 'Esta secuencia es el interferómetro de la lección 2.1 escrito con operaciones: un divisor de haz (mezclar), un desfase de 180° en un camino (cambiar signo) y otro divisor (mezclar). Con fases intermedias, la cancelación es parcial, y obtenemos la curva $\\cos^2(\\varphi/2)$ de la lección 3.6.' },
            { type: 'table', head: ['Secuencia desde |0⟩', 'Resultado', 'Por qué'], rows: [
              ['M', 'Mitad y mitad', 'Una sola mezcla: aún no hay dos contribuciones que combinar'],
              ['M, M', 'Siempre 0', 'Al 1 llegan contribuciones opuestas: se cancelan'],
              ['M, S, M', 'Siempre 1', 'El cambio de signo traslada la cancelación al 0'],
              ['S, M', 'Mitad y mitad', 'Cambiar el signo de una amplitud nula no hace nada'],
            ] },
          ],
        },
        {
          id: 'por-que-importa',
          title: 'La interferencia como recurso',
          blocks: [
            { type: 'p', text: 'Un algoritmo cuántico es, en el fondo, una coreografía de interferencia: prepara superposiciones, ajusta las fases según el problema y, al final, las combina de modo que las respuestas incorrectas interfieran destructivamente y la correcta, constructivamente [@nielsen2010]. El algoritmo de Deutsch (lección 2.2) es el ejemplo más pequeño: la función decide una fase, y una mezcla final la convierte en un resultado seguro.' },
            { type: 'callout', kind: 'warning', title: 'La interferencia es frágil', text: 'En la lección 2.1, registrar por qué camino iba el fotón destruía la interferencia. Con qubits ocurre lo mismo: si el entorno «se entera» del estado del qubit, porque interactúa con él y queda en cierto modo entrelazado con él, las contribuciones dejan de poder cancelarse. Ese proceso, la decoherencia, es la razón principal por la que el hardware cuántico es tan difícil (unidad 3.7).' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'La secuencia mezclar, cambiar signo, mezclar, cuenta a cuenta.',
      sections: [
        {
          id: 'msm',
          title: 'Seguir las amplitudes',
          key: 'Para saber qué sale, se sigue la lista de amplitudes paso a paso. En cada mezcla, cada salida suma dos contribuciones; si son opuestas, se cancelan.',
          blocks: [
            { type: 'steps', items: [
              { text: 'Inicio:', tex: '(1,\\ 0)' },
              { text: 'Mezclar:', tex: '\\left(\\tfrac{1}{\\sqrt2},\\ \\tfrac{1}{\\sqrt2}\\right)' },
              { text: 'Cambiar signo del 1:', tex: '\\left(\\tfrac{1}{\\sqrt2},\\ -\\tfrac{1}{\\sqrt2}\\right)' },
              { text: 'Mezclar: al 0 llegan $\\tfrac12$ y $-\\tfrac12$; al 1, $\\tfrac12$ y $+\\tfrac12$:', tex: '\\left(\\tfrac12 - \\tfrac12,\\ \\tfrac12 + \\tfrac12\\right) = (0,\\ 1)' },
            ] },
            { deep: true, type: 'p', text: 'En general, si dos contribuciones $x$ e $y$ llegan al mismo resultado, la probabilidad es $(x + y)^2 = x^2 + y^2 + 2xy$. Los dos primeros términos son lo que darían las probabilidades por separado; el tercero, $2xy$, es el <b>término de interferencia</b>. Es positivo si $x$ e $y$ tienen el mismo signo (constructiva) y negativo si tienen signos opuestos (destructiva). Con amplitudes complejas, el término es $2\\,\\mathrm{Re}(x\\,\\bar y)$ y depende del ángulo de fase entre ellas (Módulo 4).' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Seguir las amplitudes de una secuencia de operaciones en Python.',
      sections: [
        {
          id: 'python-interferencia',
          title: 'Constructiva y destructiva, en cuatro pasos',
          blocks: [
            { type: 'code', lang: 'python', file: 'interferencia.py', code: `import math

r = 1 / math.sqrt(2)

def mezclar(a, b):
    return (a + b) * r, (a - b) * r

def ver(nombre, a, b):
    print(f"{nombre:28} amplitudes = ({a:+.3f}, {b:+.3f})  P(1) = {b**2:.2f}")

a, b = 1, 0
ver("empezamos en |0⟩", a, b)
a, b = mezclar(a, b)
ver("mezclar", a, b)
ver("mezclar otra vez", *mezclar(a, b))   # las contribuciones al 1 se cancelan
ver("cambiar signo y mezclar", *mezclar(a, -b))   # ahora se cancela el 0`,
            output: `empezamos en |0⟩             amplitudes = (+1.000, +0.000)  P(1) = 0.00
mezclar                      amplitudes = (+0.707, +0.707)  P(1) = 0.50
mezclar otra vez             amplitudes = (+1.000, +0.000)  P(1) = 0.00
cambiar signo y mezclar      amplitudes = (+0.000, +1.000)  P(1) = 1.00` },
            { type: 'p', text: 'Las dos últimas líneas parten del mismo estado, $|+\\rangle$. Solo difieren en un signo, y eso basta para que la cancelación pase del 1 al 0. El formato <code>{a:+.3f}</code> muestra siempre el signo.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«La interferencia es un fenómeno de las ondas de luz, no de los qubits».', reality: 'Es una propiedad de las amplitudes de cualquier sistema cuántico: fotones, qubits superconductores, iones… En todos se suman amplitudes que pueden cancelarse.' },
    { myth: '«La ventaja cuántica viene de probar muchas posibilidades a la vez».', reality: 'Viene de hacer que las amplitudes de las respuestas incorrectas se cancelen y las de la correcta se refuercen.' },
    { myth: '«Cambiar un signo en mitad de un cálculo es un detalle menor».', reality: 'Puede convertir un resultado seguro en el contrario, como en M, M frente a M, S, M.' },
  ],

  summary: [
    'Las contribuciones de amplitud que llegan a un mismo resultado se suman: si tienen el mismo signo, interferencia constructiva; si tienen signos opuestos, destructiva.',
    'La fase relativa decide qué resultado se refuerza y cuál se cancela: M, M da 0 y M, S, M da 1.',
    'Con probabilidades no hay cancelación posible: la interferencia destructiva es exclusiva de las amplitudes.',
    'Los algoritmos cuánticos son coreografías de interferencia, y la decoherencia la destruye [@nielsen2010].',
  ],

  exercises: [
    { level: 'comprender', question: 'Sin usar el simulador, ¿qué da la secuencia M, X, M desde $|0\\rangle$? (X intercambia las amplitudes del 0 y del 1).', answer: 'M da $|+\\rangle = (\\tfrac{1}{\\sqrt2}, \\tfrac{1}{\\sqrt2})$; X intercambia dos amplitudes iguales y no cambia nada; M vuelve a $|0\\rangle$. Resultado: siempre 0.' },
    { level: 'comprender', question: '¿Qué tiene que ver un fotón cuyo camino se registra con un qubit que pierde su información en el entorno?', answer: 'En ambos casos, la información sobre «por qué camino» queda en otro sistema (el detector o el entorno). Las contribuciones dejan de ser indistinguibles, ya no pueden cancelarse y la interferencia desaparece. Es la decoherencia.' },
    { level: 'matematico', question: 'Sigue las amplitudes de la secuencia M, S, M, S, M desde $|0\\rangle$.', answer: 'M: $(0{,}707, 0{,}707)$. S: $(0{,}707, -0{,}707)$. M: $(0, 1)$. S: $(0, -1)$. M: $(-0{,}707, 0{,}707)$, es decir, $-|-\\rangle$: mitad y mitad al medir.' },
    { level: 'implementar', question: 'Escribe una función <code>aplicar(secuencia)</code> que reciba un texto como <code>"MSM"</code> y devuelva las amplitudes finales partiendo de $|0\\rangle$.', answer: '<pre><code class="language-python">import math\n\nr = 1 / math.sqrt(2)\nOPERACIONES = {\n    "M": lambda a, b: ((a + b) * r, (a - b) * r),\n    "S": lambda a, b: (a, -b),\n    "X": lambda a, b: (b, a),\n}\n\ndef aplicar(secuencia):\n    a, b = 1, 0\n    for op in secuencia:\n        a, b = OPERACIONES[op](a, b)\n    return round(a, 3), round(b, 3)\n\nprint(aplicar("MM"))     # (1.0, 0.0)\nprint(aplicar("MSM"))    # (0.0, 1.0)</code></pre>' },
  ],

  references: [
    { key: 'nielsen2010', use: 'Interferencia, algoritmos cuánticos y decoherencia.' },
  ],

  related: ['superposicion', 'fase-relativa', 'que-es-computacion-cuantica', 'varios-qubits', 'circuitos-cuanticos'],
  next: 'varios-qubits',
};
