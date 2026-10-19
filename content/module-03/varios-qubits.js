// Lección 3.9 — Sistemas de uno, dos, tres y n qubits
// Salida de código obtenida con CPython 3.14 (2026-10-18). La lógica del
// simulador está en src/utils/qubit.js y se prueba en tests/module3.test.js.
// Desde esta lección se usa el convenio de orden de Qiskit (qubit 0 a la derecha),
// comprobado en su guía oficial (qiskit-bit-ordering).

export default {
  id: 'varios-qubits',
  title: 'Sistemas de uno, dos, tres y n qubits',
  lede: 'Con cada qubit que se añade, el número de estados base se duplica. Esta lección explica cómo se describen los sistemas de varios qubits, cómo se numeran (y la trampa del orden que confunde a casi todos los programadores) y qué significa de verdad ese crecimiento exponencial.',
  updated: '2026-10-18',

  context: {
    learn: 'Cuántos estados base tienen n qubits, cómo se escribe su estado, el convenio de orden de Qiskit, cómo se combinan qubits independientes, la superposición de n qubits y qué crece exponencialmente (y qué no).',
    why: 'Todo programa útil usa varios qubits. Leer sus resultados exige saber a qué qubit corresponde cada bit de la cadena: equivocarse con el orden es uno de los errores más frecuentes al empezar con Qiskit.',
    previous: 'En [[>entrelazamiento|la lección 3.7]] vimos lo mínimo de dos qubits y los estados entrelazados. En [[>representacion-informacion|la 1.1]], que n bits tienen 2ⁿ combinaciones, y en [[>motivaciones-simulacion|la 2.3]], cuánta memoria cuesta simular muchos qubits.',
    next: 'La unidad 3.4 enseña a leer circuitos cuánticos, que operan sobre registros de varios qubits como los de esta lección.',
  },

  objectives: [
    'Contar y escribir los estados base de un sistema de n qubits.',
    'Aplicar el convenio de orden de Qiskit para leer una cadena de bits.',
    'Calcular el estado de qubits independientes multiplicando amplitudes.',
    'Distinguir lo que crece exponencialmente (la descripción) de lo que no (lo que se lee al medir).',
  ],

  prerequisites: { lessons: ['interferencia'], knowledge: ['Números binarios (lección 1.1).'] },

  introduction: [
    { type: 'p', text: 'Un qubit tiene dos estados base; dos qubits, cuatro. ¿Y diez? La respuesta es la misma que para los bits (lección 1.1): $2^{10} = 1024$. La diferencia es que un sistema de qubits no está en <em>una</em> de esas combinaciones, sino que tiene una amplitud para cada una.' },
  ],

  levels: {
    comprender: {
      intro: 'Estados base, orden, sistemas compuestos y el famoso crecimiento exponencial.',
      sections: [
        {
          id: 'de-uno-a-n',
          title: 'De uno a n qubits',
          blocks: [
            { type: 'p', text: 'Los estados base de $n$ qubits son todas las cadenas de $n$ bits:' },
            { type: 'table', head: ['Qubits', 'Estados base', 'Cuántos'], rows: [
              ['1', '$|0\\rangle,\\ |1\\rangle$', '2'],
              ['2', '$|00\\rangle,\\ |01\\rangle,\\ |10\\rangle,\\ |11\\rangle$', '4'],
              ['3', '$|000\\rangle,\\ |001\\rangle,\\ \\dots,\\ |111\\rangle$', '8'],
              ['n', 'todas las cadenas de n bits', '$2^n$'],
            ] },
            { type: 'p', text: 'El estado general asigna una amplitud a cada estado base, y las reglas de siempre se mantienen: al medir los $n$ qubits se obtiene <b>una</b> cadena de $n$ bits, con probabilidad igual al cuadrado de su amplitud, y los cuadrados suman 1 [@nielsen2010].' },
          ],
        },
        {
          id: 'orden',
          title: 'Cómo se numeran los qubits (y la trampa del orden)',
          blocks: [
            { type: 'p', text: 'Los qubits de un sistema se numeran desde 0: qubit 0, qubit 1, … , qubit $n-1$. Al escribir una cadena hay que decidir qué qubit va en cada posición. Qiskit, la biblioteca que usaremos en el Módulo 5, sigue este [[orden-de-qubits|convenio]] [@qiskit-bit-ordering]:' },
            { type: 'callout', kind: 'note', status: 'establecido', title: 'Convenio de Qiskit (el que usaremos desde ahora)', text: 'El qubit 0 es el bit de la <b>derecha</b> y el qubit $n-1$, el de la izquierda. Así, la cadena se lee como un número binario normal, y ese número es la posición de su amplitud en la lista: $|110\\rangle$ es el número 6.' },
            { type: 'p', text: 'Ejemplo: con tres qubits, si el qubit 0 vale 0 y los qubits 1 y 2 valen 1, la cadena es $110$. Es el mismo problema de «en qué orden se escriben las partes» que el de la [[endianness|endianness]] de la lección 1.8.' },
            { type: 'callout', kind: 'warning', title: 'No todo el mundo usa el mismo orden', text: 'Muchos libros y otras herramientas escriben el qubit 0 a la <em>izquierda</em>, y la propia guía de Qiskit advierte de que algunas de sus funciones devuelven los resultados en el orden contrario [@qiskit-bit-ordering]. Antes de interpretar una cadena de bits, comprueba siempre qué convenio sigue la herramienta. En las lecciones 3.7 y anteriores no hacía falta: los estados eran simétricos.' },
          ],
        },
        {
          id: 'compuestos',
          title: 'Qubits independientes y qubits entrelazados',
          blocks: [
            { type: 'p', text: 'Si cada qubit está preparado por su cuenta, la amplitud de cada cadena es el <b>producto</b> de las amplitudes de cada qubit para su bit. Por ejemplo, con el qubit 0 en $|+\\rangle$ y el qubit 1 en $|0\\rangle$, las cadenas $00$ y $01$ tienen amplitud $1 \\cdot \\tfrac{1}{\\sqrt2}$, y $10$ y $11$, amplitud 0. Se dice que es un <b>[[estado-producto|estado producto]]</b>.' },
            { type: 'p', text: 'Un caso muy útil: si se mezclan todos los qubits partiendo de $|0\\rangle$, cada uno queda en $|+\\rangle$, y las $2^n$ cadenas tienen la misma amplitud. Al medir sale una cadena de $n$ bits perfectamente al azar. Es la base de los generadores cuánticos de números aleatorios.' },
            { type: 'p', text: 'Los estados entrelazados (lección 3.7) no se pueden escribir así. El estado de Bell se generaliza a $n$ qubits en el estado <b>GHZ</b>, $\\tfrac{1}{\\sqrt2}(|00\\ldots0\\rangle + |11\\ldots1\\rangle)$: todos los qubits dan el mismo resultado al azar [@nielsen2010].' },
            { type: 'widget', id: 'qubit-register', options: { n: 2 }, caption: 'Elige cuántos qubits hay y prepara cada uno. La tabla muestra las 2ⁿ amplitudes en el orden de Qiskit (qubit 0 a la derecha). Prueba también el estado GHZ y los tres retos: el segundo obliga a pensar bien en el orden.' },
          ],
        },
        {
          id: 'crecimiento',
          title: 'Qué crece exponencialmente, y qué no',
          blocks: [
            { type: 'p', text: 'Describir un estado general de $n$ qubits exige $2^n$ amplitudes. Por eso simularlos cuesta tanto (lección 2.3):' },
            { type: 'widget', id: 'state-space', options: { n: 20 }, caption: 'Memoria para guardar todas las amplitudes de n qubits, a 16 bytes cada una.' },
            { type: 'p', text: 'Pero conviene precisar qué crece:' },
            { type: 'list', items: [
              '<b>Lo que se lee no crece.</b> Medir $n$ qubits da $n$ bits, ni uno más (lección 2.1).',
              '<b>Los estados producto son baratos.</b> Si los qubits son independientes, basta con guardar 2 amplitudes por qubit: $2n$ números en lugar de $2^n$. Lo que exige una descripción exponencial es el entrelazamiento.',
              '<b>No es paralelismo gratuito.</b> Tener $2^n$ amplitudes no significa calcular $2^n$ cosas y leerlas todas. Los algoritmos útiles usan la interferencia entre esas amplitudes para que la cadena buscada sea la probable (lección 3.8).',
            ] },
            { type: 'callout', kind: 'note', title: 'Por eso algunos simuladores llegan más lejos', text: 'Hay simuladores clásicos que aprovechan que muchos circuitos generan poco entrelazamiento y guardan mucho menos que $2^n$ amplitudes. Funcionan muy bien en esos casos y mal en los demás (lección 2.3).' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Contar, multiplicar amplitudes y la superposición uniforme.',
      sections: [
        {
          id: 'producto-n',
          title: 'Amplitudes de qubits independientes',
          key: 'Para qubits independientes, la amplitud de una cadena es el producto de las amplitudes de cada qubit. Si todos están en |+⟩, cada cadena tiene amplitud 1/√(2ⁿ).',
          blocks: [
            { type: 'p', text: 'Con tres qubits en $|+\\rangle$, cada cadena tiene amplitud:' },
            { type: 'math', tex: '\\tfrac{1}{\\sqrt2}\\cdot\\tfrac{1}{\\sqrt2}\\cdot\\tfrac{1}{\\sqrt2} = \\tfrac{1}{\\sqrt8} \\approx 0{,}354 \\quad\\Rightarrow\\quad P = \\tfrac18' },
            { deep: true, type: 'p', text: 'Formalmente, el estado de qubits independientes es el <b>producto tensorial</b> de sus estados, $|\\psi_1\\rangle \\otimes |\\psi_0\\rangle$, y $|1\\rangle \\otimes |0\\rangle$ se abrevia $|10\\rangle$. El espacio de $n$ qubits tiene dimensión $2^n$ (Módulo 4). Un estado producto se describe con $2n$ números, pero el espacio completo necesita $2^n$: la diferencia la ocupan los estados entrelazados.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Construir el estado de varios qubits independientes en Python, con el orden de Qiskit.',
      sections: [
        {
          id: 'python-varios',
          title: 'Juntar qubits',
          blocks: [
            { type: 'code', lang: 'python', file: 'varios_qubits.py', code: `import itertools
import math
import random

random.seed(4)
r = 1 / math.sqrt(2)

def juntar(*qubits):
    """Estado de varios qubits independientes: multiplica sus amplitudes.
    Se escriben como Qiskit: el último qubit de la lista queda a la izquierda."""
    estado = {}
    for bits in itertools.product("01", repeat=len(qubits)):   # '00', '01', '10', '11'...
        amplitud = 1
        for qubit, bit in zip(reversed(qubits), bits):
            amplitud *= qubit[int(bit)]
        estado["".join(bits)] = amplitud
    return estado

mas, cero = (r, r), (1, 0)
print(juntar(mas, cero))                  # qubit 0 en |+⟩, qubit 1 en |0⟩

tres = juntar(mas, mas, mas)              # 2³ = 8 estados base
print(len(tres), "amplitudes, cada una", round(tres["000"], 3))
print("cinco mediciones:", random.choices(list(tres), weights=[a**2 for a in tres.values()], k=5))`,
            output: `{'00': 0.7071067811865475, '01': 0.7071067811865475, '10': 0.0, '11': 0.0}
8 amplitudes, cada una 0.354
cinco mediciones: ['001', '000', '011', '001', '000']` },
            { type: 'list', items: [
              '<b><code>itertools.product("01", repeat=n)</code></b> genera las $2^n$ cadenas en orden binario.',
              '<b><code>reversed(qubits)</code></b> aplica el convenio de Qiskit: el qubit 0, primero de la lista, corresponde al último carácter de la cadena.',
              'El primer resultado coincide con el ejemplo de la guía de Qiskit: qubit 0 en $|+\\rangle$ y qubit 1 en $|0\\rangle$ dan $00$ y $01$ [@qiskit-bit-ordering].',
            ] },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«n qubits guardan 2ⁿ valores que se pueden leer».', reality: 'Se describen con 2ⁿ amplitudes, pero medirlos da n bits.' },
    { myth: '«En la cadena 01, el primer bit es el qubit 0».', reality: 'En Qiskit es al revés: el qubit 0 es el de la derecha. Otras herramientas usan el otro orden; hay que comprobarlo siempre.' },
    { myth: '«Simular n qubits siempre cuesta 2ⁿ números».', reality: 'Solo en general. Los estados producto se describen con 2n números; lo caro es el entrelazamiento.' },
  ],

  summary: [
    '$n$ qubits tienen $2^n$ estados base (las cadenas de $n$ bits) y una amplitud para cada uno [@nielsen2010].',
    'En Qiskit, el qubit 0 es el bit de la derecha, y la cadena leída en binario es la posición de su amplitud [@qiskit-bit-ordering].',
    'Para qubits independientes, las amplitudes se multiplican; los estados entrelazados, como GHZ, no se pueden escribir así.',
    'La descripción crece exponencialmente, pero al medir solo se leen $n$ bits.',
  ],

  exercises: [
    { level: 'comprender', question: 'Con 4 qubits en Qiskit, mides la cadena 1000. ¿Qué qubit dio 1? ¿Qué número es?', answer: 'El qubit 3 (el de la izquierda). En binario, $1000 = 8$.' },
    { level: 'comprender', question: 'Quieres un generador de números aleatorios del 0 al 255. ¿Cuántos qubits necesitas y cómo los preparas?', answer: '8 qubits ($2^8 = 256$), todos mezclados desde $|0\\rangle$ (en $|+\\rangle$). Cada medición da una cadena de 8 bits uniformemente al azar, que leída en binario es un número del 0 al 255.' },
    { level: 'matematico', question: 'El qubit 0 está en $0{,}6|0\\rangle + 0{,}8|1\\rangle$ y el qubit 1 en $|+\\rangle$. Calcula la amplitud y la probabilidad de la cadena $11$.', answer: 'Amplitud: $\\tfrac{1}{\\sqrt2} \\cdot 0{,}8 \\approx 0{,}566$ (bit de la izquierda, qubit 1, por bit de la derecha, qubit 0). Probabilidad: $0{,}5 \\cdot 0{,}64 = 0{,}32$.' },
    { level: 'implementar', question: 'Usa <code>juntar</code> para calcular las probabilidades del ejercicio anterior.', answer: '<pre><code class="language-python">estado = juntar((0.6, 0.8), mas)   # qubit 0, qubit 1\nprint({k: round(a**2, 2) for k, a in estado.items()})\n# {\'00\': 0.18, \'01\': 0.32, \'10\': 0.18, \'11\': 0.32}</code></pre>' },
  ],

  references: [
    { key: 'nielsen2010', use: 'Sistemas de varios qubits, estados producto y estado GHZ.' },
    { key: 'qiskit-bit-ordering', use: 'Convenio de orden de los qubits en Qiskit.' },
  ],

  related: ['entrelazamiento', 'representacion-informacion', 'motivaciones-simulacion', 'procesador-memoria', 'circuitos-cuanticos'],
  next: 'circuitos-cuanticos',
};
