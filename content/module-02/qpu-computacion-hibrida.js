// Lección 2.5 — La QPU y la computación híbrida
// Salida de código obtenida con CPython 3.14 (2026-10-14). La lógica de los
// simuladores se comprueba en tests/module2.test.js.

export default {
  id: 'qpu-computacion-hibrida',
  title: 'La QPU y la computación híbrida',
  lede: 'Una computadora cuántica no funciona sola: es un coprocesador, la QPU, rodeado de computadoras clásicas que preparan, envían, controlan y procesan. Esta lección sigue el viaje de un programa cuántico de principio a fin.',
  updated: '2026-10-14',

  context: {
    learn: 'Qué es una QPU, qué componentes forman una computadora cuántica, cómo viaja un programa desde tu computadora hasta los qubits y de vuelta, y cómo colaboran la parte clásica y la cuántica.',
    why: 'Todo programa cuántico que escribas será, en realidad, un programa híbrido. Entender el flujo explica por qué se repiten los circuitos miles de veces, por qué hay colas y por qué la parte clásica importa tanto.',
    previous: 'En [[>ventajas-y-limitaciones|la lección 2.4]] concluimos que la computación cuántica complementa a la clásica. En [[>von-neumann|la 1.9]] vimos cómo se organiza una computadora clásica.',
    next: 'La lección 2.6 presenta las tecnologías con las que se construyen las QPU y cómo comparar equipos. El Módulo 3 explica qué ocurre dentro: qubits, puertas y medición.',
  },

  objectives: [
    'Explicar qué es una QPU y por qué se usa como coprocesador.',
    'Describir los componentes de una computadora cuántica y la función de cada uno.',
    'Seguir el flujo clásico → cuántico → clásico de un programa.',
    'Explicar cómo colaboran en bucle una computadora clásica y una QPU.',
  ],

  prerequisites: { lessons: ['ventajas-y-limitaciones'], knowledge: ['Arquitectura clásica básica (lecciones 1.8 y 1.9).'] },

  introduction: [
    { type: 'p', text: 'Cuando un programa usa una GPU, la CPU le envía un trabajo, espera y recoge el resultado. Con una computadora cuántica pasa algo parecido, pero el viaje es más largo y el resultado llega en forma de estadísticas. Recórrelo paso a paso:' },
    { type: 'widget', id: 'hybrid-flow', caption: 'El recorrido de un programa cuántico. Fíjate en «qué viaja» en cada paso: los datos clásicos nunca se «convierten» en qubits; lo que llega a la QPU son instrucciones.' },
  ],

  levels: {
    comprender: {
      intro: 'Qué es una QPU, de qué se compone una computadora cuántica y cómo colaboran las partes clásica y cuántica.',
      sections: [
        {
          id: 'que-es-qpu',
          title: '¿Qué es una QPU?',
          blocks: [
            { type: 'p', text: 'Una [[qpu|QPU]] (<i>Quantum Processing Unit</i>, unidad de procesamiento cuántico) es el componente que contiene los qubits y aplica sobre ellos operaciones y mediciones. Se usa como un coprocesador: la computadora clásica le encarga una tarea concreta, igual que encarga gráficos a una GPU.' },
            { type: 'callout', kind: 'analogy', title: 'La QPU como una GPU', text: 'La analogía acierta en el reparto de papeles: la CPU dirige y la QPU hace una parte especializada. Falla en tres puntos. La QPU no guarda datos entre trabajos, no tiene memoria a la que el programa acceda como a la RAM y no devuelve un resultado exacto, sino muestras aleatorias que hay que repetir y contar.' },
            { type: 'p', text: 'Al programa que ejecuta la QPU se le llama <b>circuito cuántico</b>, por su parecido con los circuitos de la lección 1.7: una lista de operaciones sobre los qubits, seguida de una medición. Lo veremos en detalle en el Módulo 3. Lo importante ahora es que un programa cuántico nunca es solo cuántico. Antes de la QPU hay que escribir y compilar el circuito; durante, generar señales de control muy precisas; después, procesar las mediciones. Todo eso lo hacen computadoras clásicas.' },
          ],
        },
        {
          id: 'arquitectura',
          title: 'Arquitectura general',
          blocks: [
            { type: 'p', text: 'Aunque cada tecnología tiene sus detalles (lección 2.6), casi todas las computadoras cuánticas comparten estas capas:' },
            { type: 'table', head: ['Capa', 'Qué hace', '¿Clásica o cuántica?'], rows: [
              ['Software del usuario', 'Define el problema y escribe el circuito (por ejemplo, con la biblioteca de Python Qiskit [@qiskit-docs])', 'Clásica'],
              ['Compilador', 'Traduce el circuito a las pocas operaciones que sabe hacer ese equipo concreto, como un compilador clásico (lección 1.10)', 'Clásica'],
              ['Servicio en la nube', 'Recibe trabajos de muchos usuarios y los pone en cola', 'Clásica'],
              ['Electrónica de control', 'Convierte cada operación en señales físicas precisas (pulsos de microondas o de láser) y lee el resultado de las mediciones', 'Clásica'],
              ['QPU', 'Los qubits, aislados del entorno (en frío extremo o en vacío, según la tecnología)', 'Cuántica'],
            ] },
            { type: 'p', text: 'Llama la atención cuánta maquinaria clásica rodea a los qubits. Incluso para protegerlos de errores hace falta una computadora clásica que vigile los qubits en tiempo real y decida cómo corregirlos, en menos de una décima de milisegundo [@google2025].' },
            { type: 'callout', kind: 'warning', title: 'Los bits no se convierten en qubits', text: 'Una idea frecuente es que los datos de la computadora «se cargan» en los qubits como en una memoria. En realidad, los qubits empiezan en un estado fijo y lo que llega a la QPU son instrucciones: qué operaciones aplicar. Si quieres que el circuito dependa de un dato, ese dato tiene que convertirse en operaciones o en el ajuste de alguna operación, y eso tiene un coste (lección 2.4).' },
          ],
        },
        {
          id: 'acceso-nube',
          title: 'Acceso en la nube',
          blocks: [
            { type: 'p', text: 'Casi nadie tiene una QPU en su oficina. Se accede a ellas a través de servicios en la nube como IBM Quantum Platform [@ibm-quantum-platform], Amazon Braket [@amazon-braket] o Azure Quantum [@azure-quantum]; los dos últimos ofrecen equipos de varios fabricantes. Todos ofrecen también simuladores, que se ejecutan en computadoras clásicas y sirven para circuitos pequeños (lección 2.3).' },
            { type: 'p', text: 'Para un ingeniero, esto tiene consecuencias prácticas:' },
            { type: 'list', items: [
              '<b>Colas.</b> El equipo se comparte, así que un trabajo puede esperar mucho más de lo que tarda en ejecutarse.',
              '<b>Latencia.</b> Cada viaje de ida y vuelta por la red cuesta tiempo. Un algoritmo que envía miles de trabajos pequeños puede pasar más tiempo esperando que calculando.',
              '<b>Repeticiones.</b> Un trabajo incluye cuántas veces repetir el circuito ([[shot|<i>shots</i>]]). El resultado es un recuento, por ejemplo <code>{"0": 507, "1": 493}</code>.',
              '<b>Calibración.</b> Las propiedades del equipo (cuánto falla, qué qubits están disponibles) cambian de un día a otro, y el compilador las tiene en cuenta.',
            ] },
          ],
        },
        {
          id: 'bucle-hibrido',
          title: 'Un bucle entre los dos mundos',
          blocks: [
            { type: 'p', text: 'En algunos algoritmos, la colaboración es un bucle. La QPU ejecuta un circuito que tiene «perillas» de ajuste. La computadora clásica mira lo cerca que está el resultado del objetivo y mueve las perillas. Se repite hasta que el resultado deja de mejorar. Muchos algoritmos de la era NISQ funcionan así [@peruzzo2014; @farhi2014]; los programarás en el Módulo 5.' },
            { type: 'p', text: 'Pruébalo con el caso más pequeño posible: un qubit, una sola perilla y el objetivo de obtener 1 un porcentaje concreto de las veces. Primero haz tú de computadora clásica moviendo la perilla; después deja que lo haga el optimizador automático, un programa clásico sencillo.' },
            { type: 'widget', id: 'hybrid-loop', caption: 'La QPU está simulada: no sabes qué probabilidad da cada posición de la perilla, solo ves recuentos de ceros y unos. Con pocas repeticiones el resultado salta mucho; con más, se estabiliza, pero cada trabajo cuesta más tiempo de QPU.' },
            { type: 'callout', kind: 'model', status: 'simplificacion', text: 'Un algoritmo real tiene decenas o cientos de perillas, un objetivo más complejo (por ejemplo, la energía de una molécula) y optimizadores más elaborados. La estructura del bucle es la misma.' },
            { type: 'p', text: 'Este ejemplo muestra los dos límites de este tipo de algoritmos: el ruido estadístico de las repeticiones impide afinar más allá de cierto punto, y cada vuelta del bucle es un viaje a la QPU. Si un algoritmo híbrido aporta una ventaja práctica sobre los métodos clásicos sigue siendo una pregunta abierta (lección 2.4).' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Una sola idea con números: cuánto se puede confiar en una probabilidad estimada con repeticiones.',
      sections: [
        {
          id: 'precision-shots',
          title: 'Cuántas repeticiones hacen falta',
          key: 'Con más repeticiones la estimación mejora, pero despacio: para dividir el error entre 10 hacen falta 100 veces más repeticiones.',
          blocks: [
            { type: 'p', text: 'Si la probabilidad real de obtener 1 es $p$ y repites el circuito $n$ veces, la proporción de unos que observas se desvía de $p$, típicamente, en:' },
            { type: 'math', tex: '\\text{error típico} = \\sqrt{\\frac{p\\,(1-p)}{n}}' },
            { type: 'p', text: 'Ejemplo con $p = 0{,}5$: con 100 repeticiones, el error típico es $0{,}05$ (5 puntos porcentuales); con 10 000, $0{,}005$. Cien veces más tiempo de QPU para una cifra decimal más.' },
            { deep: true, type: 'p', text: 'Cada repetición es un experimento de Bernoulli: da 1 con probabilidad $p$. El número de unos en $n$ repeticiones sigue una distribución binomial, de media $np$ y varianza $np(1-p)$. Al dividir entre $n$, la proporción tiene media $p$ y varianza $p(1-p)/n$; el error típico es su raíz cuadrada. En el Módulo 3 (shots e histogramas) se usa esta idea para leer los resultados de un circuito.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'El bucle en unas quince líneas de Python. La QPU está simulada con números aleatorios; en el Módulo 5 la sustituirás por un circuito de verdad.',
      sections: [
        {
          id: 'python-bucle',
          title: 'Un bucle híbrido con una QPU simulada',
          blocks: [
            { type: 'code', lang: 'python', file: 'bucle.py', code: `import math
import random

random.seed(7)

def qpu(ajuste, shots=1000):
    """QPU simulada: cuenta cuántas veces sale 1.
    La probabilidad depende del ajuste (la fórmula se explica en el Módulo 3)."""
    p1 = math.sin(ajuste / 2) ** 2
    return sum(random.random() < p1 for _ in range(shots))

objetivo = 0.7   # queremos obtener 1 el 70 % de las veces
ajuste = 0.5     # primer intento

for paso in range(6):
    p = qpu(ajuste) / 1000           # parte cuántica: ejecutar y contar
    ajuste += 2 * (objetivo - p)     # parte clásica: corregir el ajuste
    print(f"paso {paso}: frecuencia de 1 = {p:.3f}, nuevo ajuste = {ajuste:.3f}")`,
            output: `paso 0: frecuencia de 1 = 0.072, nuevo ajuste = 1.756
paso 1: frecuencia de 1 = 0.576, nuevo ajuste = 2.004
paso 2: frecuencia de 1 = 0.733, nuevo ajuste = 1.938
paso 3: frecuencia de 1 = 0.657, nuevo ajuste = 2.024
paso 4: frecuencia de 1 = 0.710, nuevo ajuste = 2.004
paso 5: frecuencia de 1 = 0.729, nuevo ajuste = 1.946` },
            { type: 'p', text: 'En dos pasos se acerca al objetivo y después oscila: el ajuste no se queda quieto porque cada recuento tiene ruido estadístico. Prueba a cambiar <code>shots=1000</code> por <code>shots=100</code> y observa cómo aumenta la oscilación.' },
            { type: 'callout', kind: 'note', text: 'La función <code>qpu</code> es lo único «cuántico» del programa, y aquí la imita un generador de números aleatorios. Con una QPU real, esa función enviaría un circuito a la nube y esperaría el recuento; el resto del programa no cambiaría.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Una computadora cuántica sustituye a la clásica».', reality: 'Es un coprocesador: necesita computadoras clásicas para compilar, controlar, corregir errores y procesar resultados.' },
    { myth: '«Los datos se copian a los qubits como a una memoria».', reality: 'Lo que llega a la QPU son instrucciones. Los qubits parten de un estado fijo, y un dato solo influye si se traduce en operaciones.' },
    { myth: '«Ejecutar un circuito una vez da la respuesta».', reality: 'Cada ejecución da una muestra aleatoria. Se repite cientos o miles de veces y se cuentan los resultados.' },
    { myth: '«Lo que tarda un programa cuántico es lo que tarda la QPU».', reality: 'A menudo dominan la cola, la red y el procesamiento clásico, sobre todo en algoritmos híbridos con muchas vueltas.' },
  ],

  summary: [
    'La QPU es un coprocesador que contiene los qubits; el resto del sistema es clásico.',
    'Capas: software, compilador, servicio en la nube, electrónica de control y QPU.',
    'A la QPU llegan instrucciones, no datos; de ella salen bits, que se repiten y cuentan.',
    'Se accede a las QPU sobre todo en la nube, con colas, latencia y calibraciones que cambian [@ibm-quantum-platform; @amazon-braket; @azure-quantum].',
    'Algunos algoritmos forman un bucle: la QPU ejecuta y la computadora clásica ajusta [@peruzzo2014].',
  ],

  exercises: [
    { level: 'comprender', question: 'Un algoritmo híbrido hace 500 vueltas del bucle. Cada trabajo tarda 0,2 s en la QPU, pero la ida y vuelta por la red con la cola tarda 5 s. ¿Cuánto tarda en total y qué parte domina?', answer: '500 × (0,2 + 5) = 2600 s, unos 43 minutos. La QPU solo trabaja 100 s: domina la espera. Por eso algunos servicios ofrecen formas de ejecutar el bucle clásico cerca de la QPU o de reservar el equipo durante una sesión, en lugar de hacer cola en cada vuelta.' },
    { level: 'comprender', question: '¿En qué se parece y en qué se diferencia una QPU de una GPU?', answer: 'Se parecen en que ambas son coprocesadores a los que la CPU encarga una tarea especializada. Se diferencian en que la QPU no guarda datos entre trabajos y devuelve muestras aleatorias, no un resultado exacto, y en que necesita mucha más infraestructura clásica de control.' },
    { level: 'matematico', question: 'Con $p = 0{,}5$, ¿cuántas repeticiones hacen falta para que el error típico sea de 1 punto porcentual ($0{,}01$)?', answer: '$\\sqrt{0{,}25/n} = 0{,}01 \\Rightarrow 0{,}25/n = 0{,}0001 \\Rightarrow n = 2500$.' },
    { level: 'implementar', question: 'Modifica <code>bucle.py</code> para que se detenga cuando la frecuencia esté a menos de 0,02 del objetivo, y que diga en qué paso lo logró.', answer: '<pre><code class="language-python">import math\nimport random\n\nrandom.seed(7)\n\ndef qpu(ajuste, shots=1000):\n    p1 = math.sin(ajuste / 2) ** 2\n    return sum(random.random() &lt; p1 for _ in range(shots))\n\nobjetivo = 0.7\najuste = 0.5\n\nfor paso in range(20):\n    p = qpu(ajuste) / 1000\n    if abs(p - objetivo) &lt; 0.02:\n        print(f"Objetivo alcanzado en el paso {paso}: frecuencia {p:.3f} con ajuste {ajuste:.3f}")\n        break\n    ajuste += 2 * (objetivo - p)</code></pre>Con la semilla 7 imprime <code>Objetivo alcanzado en el paso 4: frecuencia 0.710 con ajuste 2.024</code>.' },
  ],

  references: [
    { key: 'qiskit-docs', use: 'Construcción de circuitos con Qiskit.' },
    { key: 'google2025', use: 'Una computadora clásica corrige errores en tiempo real (latencia media de 63 µs).' },
    { key: 'ibm-quantum-platform', use: 'Acceso a QPU en la nube.' },
    { key: 'amazon-braket', use: 'Acceso a QPU de varios fabricantes en la nube.' },
    { key: 'azure-quantum', use: 'Acceso a QPU de varios fabricantes en la nube.' },
    { key: 'peruzzo2014', use: 'Primer algoritmo híbrido en bucle (VQE).' },
    { key: 'farhi2014', use: 'Algoritmo híbrido de optimización (QAOA).' },
  ],

  related: ['ventajas-y-limitaciones', 'von-neumann', 'panorama-tecnologico', 'motivaciones-simulacion'],
  next: 'panorama-tecnologico',
};
