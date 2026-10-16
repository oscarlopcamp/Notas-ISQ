// Lección 3.7 — Entrelazamiento y correlación clásica
// Salida de código obtenida con CPython 3.14 (2026-10-16). La lógica del
// simulador está en src/utils/qubit.js y se prueba en tests/module3.test.js.
// Se presenta lo mínimo de dos qubits; la lección 3.9 trata los sistemas de n qubits.
// Honestidad epistémica: el simulador distingue el par entrelazado de UN par clásico
// concreto; la imposibilidad de imitarlo con cualquier estrategia clásica es el
// teorema de Bell, que se cita y se deja para el Módulo 6.

export default {
  id: 'entrelazamiento',
  title: 'Entrelazamiento y correlación clásica',
  lede: 'Dos qubits entrelazados dan resultados al azar que, sin embargo, siempre coinciden. Parecería un simple acuerdo previo, como dos sobres con la misma carta. Esta lección muestra en qué se diferencia el entrelazamiento de esa correlación clásica, y qué no permite hacer.',
  updated: '2026-10-16',

  context: {
    learn: 'Cómo se describe un estado de dos qubits, qué es un estado entrelazado, en qué se diferencia de una correlación clásica y por qué no permite comunicarse más rápido que la luz.',
    why: 'El entrelazamiento es un recurso de la teleportación, de la distribución cuántica de claves y de muchos algoritmos. También es fuente de malentendidos frecuentes.',
    previous: 'En [[>superposicion|la lección 3.5]] vimos la mezcla, que distingue la superposición de una moneda. En [[>historia-computacion-cuantica|la 2.2]], la paradoja EPR y el teorema de Bell.',
    next: 'La lección 3.8 explica la interferencia. La 3.9 generaliza a sistemas de n qubits, y el Módulo 6 usa el entrelazamiento en protocolos de comunicación.',
  },

  objectives: [
    'Escribir un estado de dos qubits con sus cuatro amplitudes.',
    'Explicar por qué el estado (|00⟩ + |11⟩)/√2 no se puede describir qubit por qubit.',
    'Distinguir el entrelazamiento de una correlación clásica con un experimento.',
    'Explicar por qué el entrelazamiento no permite enviar mensajes.',
  ],

  prerequisites: { lessons: ['fase-relativa'], knowledge: [] },

  introduction: [
    { type: 'p', text: 'Hasta ahora hemos trabajado con un qubit. Para hablar de entrelazamiento hacen falta dos, así que empezamos por lo mínimo para describirlos; la lección 3.9 lo generaliza.' },
  ],

  levels: {
    comprender: {
      intro: 'Dos qubits, el estado entrelazado más sencillo y el experimento que lo distingue de una correlación clásica.',
      sections: [
        {
          id: 'dos-qubits',
          title: 'Lo mínimo sobre dos qubits',
          blocks: [
            { type: 'p', text: 'Dos bits pueden valer 00, 01, 10 u 11. Dos qubits tienen esos mismos cuatro estados base, que se escriben $|00\\rangle$, $|01\\rangle$, $|10\\rangle$ y $|11\\rangle$: el primer dígito es el qubit de la izquierda y el segundo, el de la derecha. Su estado general tiene <b>cuatro amplitudes</b>, una por estado base, y la regla de Born funciona igual: la probabilidad de cada resultado es el cuadrado de su amplitud, y los cuatro cuadrados suman 1.' },
            { type: 'p', text: 'El estado entrelazado más famoso es:' },
            { type: 'math', tex: '\\tfrac{1}{\\sqrt2}\\,|00\\rangle + \\tfrac{1}{\\sqrt2}\\,|11\\rangle', note: 'Uno de los cuatro «estados de Bell», en honor a John Bell (lección 2.2).' },
            { type: 'p', text: 'Al medir los dos qubits se obtiene 00 o 11, cada uno con probabilidad 1/2, y nunca 01 ni 10. Cada qubit, por separado, da 0 o 1 al azar; pero los dos siempre coinciden.' },
          ],
        },
        {
          id: 'no-por-separado',
          title: 'Un estado que no se puede repartir',
          blocks: [
            { type: 'p', text: 'Si dos qubits son independientes, el estado de la pareja se obtiene combinando el de cada uno, y cada qubit tiene «su» estado. Con $\\tfrac{1}{\\sqrt2}(|00\\rangle + |11\\rangle)$ eso es imposible: no existe ningún estado para el qubit de la izquierda y otro para el de la derecha que, juntos, den este resultado (lo demostramos en el nivel 2). El estado solo existe para la pareja. Eso es estar <b>[[entrelazamiento|entrelazados]]</b> [@nielsen2010].' },
            { type: 'p', text: 'Por eso, en la lección 3.4, la esfera de Bloch tenía un límite: un qubit entrelazado no tiene un punto propio en su esfera.' },
          ],
        },
        {
          id: 'frente-a-clasico',
          title: '¿No es solo un acuerdo previo?',
          blocks: [
            { type: 'p', text: 'Que dos resultados aleatorios coincidan siempre no tiene nada de raro. Mete una carta roja en dos sobres o una negra en los dos, al azar, y envía un sobre a Madrid y otro a Lima: al abrirlos, siempre coinciden. Es una <b>correlación clásica</b>: los resultados se decidieron al preparar los sobres.' },
            { type: 'p', text: 'La pregunta es si el par entrelazado es solo eso. La mezcla de la lección 3.5 permite comprobarlo: se mezclan los dos qubits antes de medirlos. Pruébalo:' },
            { type: 'widget', id: 'entanglement-lab', caption: 'Mide 100 pares de cada fuente, primero directamente y después mezclando los dos qubits. La tabla de abajo resume el porcentaje de coincidencias de las cuatro combinaciones.' },
            { type: 'p', text: 'Midiendo directamente, las dos fuentes coinciden siempre. Tras la mezcla, el par clásico coincide solo la mitad de las veces y el entrelazado sigue coincidiendo siempre. La correlación del par entrelazado se mantiene aunque cambiemos qué se mide; la de los sobres, no.' },
            { type: 'callout', kind: 'warning', title: 'Lo que este experimento demuestra y lo que no', text: 'Este experimento distingue el par entrelazado de <em>este</em> par clásico. Que <em>ninguna</em> estrategia clásica, por ingeniosa que sea, pueda imitar al par entrelazado en todas las mediciones posibles es un resultado más fuerte: el teorema de Bell [@bell1964], que necesita mediciones con ángulos intermedios. Los experimentos le dan la razón a la mecánica cuántica [@aspect1982; @hensen2015], y por ellos se concedió el Nobel de Física de 2022 [@nobel2022]. Lo veremos con más detalle en el Módulo 6.' },
          ],
        },
        {
          id: 'sin-mensajes',
          title: 'El entrelazamiento no sirve para enviar mensajes',
          blocks: [
            { type: 'p', text: 'Si los dos qubits de un par entrelazado están lejos y medimos el de Madrid, el de Lima dará el mismo resultado. ¿Se ha enviado información instantáneamente? No [@nielsen2010]:' },
            { type: 'list', items: [
              'Quien está en Lima ve, al medir su qubit, un 0 o un 1 al azar, mitad y mitad, haga lo que haga quien está en Madrid. Sus resultados por sí solos no contienen ningún mensaje.',
              'La coincidencia solo se descubre al comparar los dos resultados, y para eso hay que comunicarlos por un canal normal, que no supera la velocidad de la luz.',
            ] },
            { type: 'p', text: 'El entrelazamiento es un recurso valioso, por ejemplo para la teleportación o la distribución cuántica de claves (Módulo 6), pero siempre combinado con comunicación clásica.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'La demostración de que el estado de Bell no se puede repartir en dos qubits.',
      sections: [
        {
          id: 'producto',
          title: 'Estados producto y estados entrelazados',
          key: 'Si dos qubits son independientes, las cuatro amplitudes de la pareja son productos de las de cada uno. El estado de Bell no puede escribirse así.',
          blocks: [
            { type: 'p', text: 'Si el qubit izquierdo está en $a|0\\rangle + b|1\\rangle$ y el derecho en $c|0\\rangle + d|1\\rangle$, la pareja tiene estas amplitudes:' },
            { type: 'table', head: ['|00⟩', '|01⟩', '|10⟩', '|11⟩'], rows: [['$a\\,c$', '$a\\,d$', '$b\\,c$', '$b\\,d$']] },
            { type: 'steps', items: [
              { text: 'Para obtener $\\tfrac{1}{\\sqrt2}(|00\\rangle + |11\\rangle)$, necesitaríamos $a\\,d = 0$ (no hay $|01\\rangle$).' },
              { text: 'Entonces $a = 0$ o $d = 0$. Pero si $a = 0$, también $a\\,c = 0$, y falta $|00\\rangle$; si $d = 0$, $b\\,d = 0$, y falta $|11\\rangle$.' },
              { text: 'Ninguna elección funciona: el estado de Bell no es un estado producto. Está entrelazado.' },
            ] },
            { deep: true, type: 'p', text: 'Una prueba rápida para cuatro amplitudes reales $[p, q, r, s]$: el estado es producto si y solo si $p\\,s = q\\,r$. Para el estado de Bell, $p\\,s = \\tfrac12$ y $q\\,r = 0$. Formalmente, el estado de dos qubits vive en el producto tensorial de dos espacios de un qubit, que se estudia en el Módulo 4.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'El experimento del simulador, con cuatro amplitudes y la mezcla aplicada a cada qubit.',
      sections: [
        {
          id: 'python-entrelazamiento',
          title: 'Entrelazado frente a clásico',
          blocks: [
            { type: 'code', lang: 'python', file: 'entrelazamiento.py', code: `import math
import random

random.seed(5)
r = 1 / math.sqrt(2)

def mezclar(estado, qubit):
    """Aplica la mezcla a un qubit (0 = izquierdo, 1 = derecho) de [a00, a01, a10, a11]."""
    e = list(estado)
    pares = [(0, 2), (1, 3)] if qubit == 0 else [(0, 1), (2, 3)]
    for i, j in pares:
        e[i], e[j] = (e[i] + e[j]) * r, (e[i] - e[j]) * r
    return e

def medir(estado):
    resultado = random.choices(["00", "01", "10", "11"], weights=[x**2 for x in estado])[0]
    return resultado[0] == resultado[1]          # ¿coinciden los dos qubits?

bell = [r, 0, 0, r]                              # (|00⟩ + |11⟩) / √2: entrelazado

def pareja_clasica():                            # 00 o 11 al azar: correlación clásica
    return random.choice([[1, 0, 0, 0], [0, 0, 0, 1]])

n = 1000
for nombre, preparar in [("entrelazado", lambda: bell), ("clásico    ", pareja_clasica)]:
    directo = sum(medir(preparar()) for _ in range(n))
    mezclado = sum(medir(mezclar(mezclar(preparar(), 0), 1)) for _ in range(n))
    print(f"{nombre}: coinciden {directo} de {n} sin mezclar y {mezclado} de {n} tras mezclar")`,
            output: `entrelazado: coinciden 1000 de 1000 sin mezclar y 1000 de 1000 tras mezclar
clásico    : coinciden 1000 de 1000 sin mezclar y 467 de 1000 tras mezclar` },
            { type: 'list', items: [
              '<b><code>mezclar</code></b> aplica la regla de la lección 3.5 a cada pareja de amplitudes que solo difieren en el qubit elegido: para el izquierdo, $|00\\rangle$ con $|10\\rangle$ y $|01\\rangle$ con $|11\\rangle$.',
              '<b><code>random.choices</code></b> elige un resultado con probabilidades proporcionales a los pesos, aquí los cuadrados de las amplitudes (regla de Born).',
              'El par clásico se prepara de nuevo en cada repetición, como los sobres: cada vez, 00 o 11 al azar.',
            ] },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«El entrelazamiento es como dos sobres con la misma carta».', reality: 'Midiendo directamente se parecen, pero tras la mezcla el par clásico deja de coincidir y el entrelazado no. Y el teorema de Bell muestra que ninguna estrategia clásica lo imita en todas las mediciones [@bell1964].' },
    { myth: '«Con el entrelazamiento se pueden enviar mensajes instantáneos».', reality: 'Cada lado ve resultados al azar, mitad y mitad, haga lo que haga el otro. La coincidencia solo se descubre comparando por un canal normal.' },
    { myth: '«Cada qubit de un par entrelazado tiene su propio estado, solo que no lo conocemos».', reality: 'El estado solo existe para la pareja; no hay un estado para cada qubit que reproduzca el comportamiento observado.' },
  ],

  summary: [
    'Dos qubits tienen cuatro estados base ($|00\\rangle$ … $|11\\rangle$) y cuatro amplitudes.',
    'Un estado está entrelazado si no se puede describir como un estado para cada qubit; $\\tfrac{1}{\\sqrt2}(|00\\rangle + |11\\rangle)$ es el ejemplo típico.',
    'A diferencia de una correlación clásica preparada de antemano, la del par entrelazado se mantiene tras mezclar ambos qubits; los experimentos de Bell confirman que ninguna estrategia clásica lo imita [@aspect1982; @hensen2015].',
    'El entrelazamiento no permite enviar mensajes por sí solo.',
  ],

  exercises: [
    { level: 'comprender', question: 'Recibes millones de pares en Lima, pero no sabes si tu compañero en Madrid está midiendo los suyos o no. ¿Puedes saberlo mirando solo tus resultados?', answer: 'No. Tus resultados son 0 y 1 al azar, mitad y mitad, en ambos casos. Solo comparando con los resultados de Madrid, que te tendrían que llegar por un canal normal, verías la correlación.' },
    { level: 'matematico', question: '¿Está entrelazado el estado $\\tfrac12(|00\\rangle + |01\\rangle + |10\\rangle + |11\\rangle)$?', answer: 'No. Es $\\tfrac{1}{\\sqrt2}(|0\\rangle + |1\\rangle)$ para cada qubit: $a = b = c = d = \\tfrac{1}{\\sqrt2}$ da los cuatro productos iguales a $\\tfrac12$. Con la prueba rápida, $p\\,s = q\\,r = \\tfrac14$.' },
    { level: 'implementar', question: 'Añade a <code>entrelazamiento.py</code> el estado $\\tfrac{1}{\\sqrt2}(|01\\rangle + |10\\rangle)$. ¿Cuántas veces coinciden sus qubits sin mezclar y tras mezclar?', answer: '<pre><code class="language-python">otro = [0, r, r, 0]\nprint(sum(medir(otro) for _ in range(n)),\n      sum(medir(mezclar(mezclar(otro, 0), 1)) for _ in range(n)))</code></pre>Sin mezclar no coinciden nunca (siempre 01 o 10): 0 de 1000. Tras mezclar, coinciden siempre: 1000 de 1000. También está entrelazado: la correlación se mantiene, aunque cambia de «distintos» a «iguales».' },
  ],

  references: [
    { key: 'nielsen2010', use: 'Estados de dos qubits, entrelazamiento y ausencia de comunicación.' },
    { key: 'bell1964', use: 'Ninguna teoría local con resultados predeterminados reproduce todas las predicciones cuánticas.' },
    { key: 'aspect1982', use: 'Prueba experimental de las desigualdades de Bell.' },
    { key: 'hensen2015', use: 'Prueba de Bell sin las lagunas experimentales principales.' },
    { key: 'nobel2022', use: 'Reconocimiento de los experimentos con fotones entrelazados.' },
  ],

  related: ['superposicion', 'fase-relativa', 'varios-qubits', 'historia-computacion-cuantica', 'interferencia'],
  next: 'interferencia',
};
