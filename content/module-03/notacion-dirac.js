// Lección 3.2 — Notación de Dirac: |0⟩ y |1⟩
// Salida de código obtenida con CPython 3.14 (2026-10-15).
// Amplitudes reales: los números complejos llegan en el Módulo 4.

export default {
  id: 'notacion-dirac',
  title: 'Notación de Dirac: |0⟩ y |1⟩',
  lede: 'Los estados de un qubit se escriben con una notación propia, la de Dirac, que aparece en todos los libros, artículos y documentaciones. Esta lección enseña a leerla y a traducirla a algo que un programador ya conoce: una lista de dos números.',
  updated: '2026-10-15',

  context: {
    learn: 'Qué significan |0⟩ y |1⟩, cómo se escribe y se lee un estado como 0,6|0⟩ + 0,8|1⟩, qué son los estados |+⟩ y |−⟩ y cómo se corresponde todo con una lista de amplitudes.',
    why: 'Es el idioma del campo. La documentación de Qiskit, los artículos y el resto de este libro escriben así los estados. Leerla con soltura ahorra mucho esfuerzo después.',
    previous: 'En [[>el-qubit|la lección 3.1]] vimos que el estado de un qubit se describe con dos amplitudes, una para el 0 y otra para el 1.',
    next: 'La lección 3.3 explica qué reglas deben cumplir las amplitudes y cómo se calculan las probabilidades. La 3.4 dibuja los estados en la esfera de Bloch.',
  },

  objectives: [
    'Leer y escribir los estados |0⟩, |1⟩, |+⟩ y |−⟩.',
    'Traducir un estado escrito como a|0⟩ + b|1⟩ a la lista [a, b], y al revés.',
    'Entender un ket como una etiqueta, no como una operación.',
  ],

  prerequisites: { lessons: ['el-qubit'], knowledge: ['Listas o arrays en cualquier lenguaje de programación.'] },

  introduction: [
    { type: 'p', text: 'En 1939, el físico Paul Dirac propuso una notación compacta para los estados cuánticos [@dirac1939]. Ochenta años después sigue siendo la estándar, también en computación cuántica. Asusta un poco al principio por sus símbolos, pero es más sencilla que muchas sintaxis de programación: casi todo se reduce a una regla.' },
  ],

  levels: {
    comprender: {
      intro: 'La notación, cómo se lee y su traducción a listas de números.',
      sections: [
        {
          id: 'kets',
          title: 'Kets: |0⟩ y |1⟩',
          blocks: [
            { type: 'p', text: 'El estado base 0 se escribe $|0\\rangle$ y el estado base 1, $|1\\rangle$. Se leen «ket cero» y «ket uno». La barra y el ángulo, $|\\;\\rangle$, forman un [[ket|ket]]: un envoltorio que dice «esto es un estado cuántico». Lo de dentro es solo una etiqueta, igual que el nombre de una variable.' },
            { type: 'callout', kind: 'warning', title: '|0⟩ no es el número 0', text: 'El número 0 y el estado $|0\\rangle$ son cosas distintas. $|0\\rangle$ es el estado de un qubit que, al medirlo, da 0 con certeza. Por eso se envuelve en un ket: para no confundirlo con un número.' },
            { type: 'p', text: 'De dónde viene el nombre: Dirac llamó <i>bra-ket</i> a una expresión que se escribe $\\langle\\;|\\;\\rangle$, como los corchetes (<i>brackets</i>) en inglés, y la partió en dos mitades: el «bra», $\\langle\\;|$, y el «ket», $|\\;\\rangle$ [@dirac1939]. Los bras los necesitaremos en el Módulo 4; por ahora basta con los kets.' },
          ],
        },
        {
          id: 'combinaciones',
          title: 'Escribir combinaciones',
          blocks: [
            { type: 'p', text: 'Un estado que combina los dos estados base se escribe con sus amplitudes delante de cada ket:' },
            { type: 'math', tex: '0{,}6\\,|0\\rangle + 0{,}8\\,|1\\rangle' },
            { type: 'p', text: 'Se lee: «amplitud 0,6 para el estado 0 y amplitud 0,8 para el estado 1». El signo + significa «combinado con». Si una amplitud es negativa, se escribe con un signo menos: $0{,}8\\,|0\\rangle - 0{,}6\\,|1\\rangle$.' },
            { type: 'p', text: 'Dos estados aparecen tanto que tienen nombre propio. Los dos son «mitad y mitad»: al medirlos, dan 0 o 1 con la misma probabilidad. Se diferencian en el signo:' },
            { type: 'table', head: ['Nombre', 'Se escribe', 'Se lee'], rows: [
              ['$|+\\rangle$', '$\\tfrac{1}{\\sqrt2}\\,|0\\rangle + \\tfrac{1}{\\sqrt2}\\,|1\\rangle$', '«ket más»'],
              ['$|-\\rangle$', '$\\tfrac{1}{\\sqrt2}\\,|0\\rangle - \\tfrac{1}{\\sqrt2}\\,|1\\rangle$', '«ket menos»'],
            ], caption: '$\\tfrac{1}{\\sqrt2} \\approx 0{,}707$. Por qué precisamente ese número, en la lección 3.3.' },
            { type: 'p', text: 'Si $|+\\rangle$ y $|-\\rangle$ dan las mismas probabilidades, ¿por qué distinguirlos? Por el signo. Recuerda el interferómetro de la lección 2.1: un signo menos hacía que dos caminos se cancelaran. Con $|+\\rangle$ y $|-\\rangle$ ocurre lo mismo, y lo veremos en las lecciones 3.6 y 3.8.' },
          ],
        },
        {
          id: 'vectores',
          title: 'Un ket es una lista de dos números',
          blocks: [
            { type: 'p', text: 'Para un programador, la traducción más útil es esta: un estado de un qubit es una lista de dos números, <b>[amplitud del 0, amplitud del 1]</b>. Los matemáticos la llaman <b>vector</b>, y la escriben en columna:' },
            { type: 'math', tex: '|0\\rangle = \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}, \\qquad |1\\rangle = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}, \\qquad 0{,}6\\,|0\\rangle + 0{,}8\\,|1\\rangle = \\begin{bmatrix} 0{,}6 \\\\ 0{,}8 \\end{bmatrix}' },
            { type: 'p', text: 'Es la misma información escrita de dos maneras. La notación de Dirac es cómoda para leer y razonar; la lista es la que guarda un programa. Las bibliotecas de simulación, como Qiskit, almacenan el estado exactamente así: una lista de amplitudes (lección 1.2) [@qiskit-docs].' },
            { type: 'widget', id: 'ket-match', caption: 'Empareja cada estado escrito con kets con su lista de amplitudes. Las listas usan punto decimal, como en Python.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Dos operaciones con listas bastan para entender la notación.',
      sections: [
        {
          id: 'operaciones',
          title: 'Multiplicar y sumar listas',
          key: 'Escribir a|0⟩ + b|1⟩ es multiplicar cada lista por un número y sumarlas posición a posición. El resultado es simplemente [a, b].',
          blocks: [
            { type: 'p', text: 'Multiplicar una lista por un número multiplica cada elemento; sumar dos listas suma posición a posición. Con eso:' },
            { type: 'math', tex: '0{,}6 \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} + 0{,}8 \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} 0{,}6 \\\\ 0 \\end{bmatrix} + \\begin{bmatrix} 0 \\\\ 0{,}8 \\end{bmatrix} = \\begin{bmatrix} 0{,}6 \\\\ 0{,}8 \\end{bmatrix}' },
            { deep: true, type: 'p', text: 'En lenguaje matemático, $|0\\rangle$ y $|1\\rangle$ forman una <b>base</b> del espacio de vectores de dos componentes: cualquier vector $[a, b]$ se escribe de una única forma como $a|0\\rangle + b|1\\rangle$. De ahí el nombre de «estados base». En general las amplitudes son números complejos, y el espacio se llama $\\mathbb{C}^2$; lo formalizaremos en el Módulo 4.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Los kets como listas de Python.',
      sections: [
        {
          id: 'python-kets',
          title: 'De kets a listas',
          blocks: [
            { type: 'code', lang: 'python', file: 'kets.py', code: `import math

ket0 = [1, 0]   # |0⟩
ket1 = [0, 1]   # |1⟩

def combinar(a, b):
    """Devuelve a|0⟩ + b|1⟩ como una lista de dos números."""
    return [a * ket0[0] + b * ket1[0], a * ket0[1] + b * ket1[1]]

r = 1 / math.sqrt(2)
print("|0⟩:              ", ket0)
print("|1⟩:              ", ket1)
print("0.6|0⟩ + 0.8|1⟩:  ", combinar(0.6, 0.8))
print("|+⟩ = (|0⟩+|1⟩)/√2:", [round(x, 3) for x in combinar(r, r)])
print("|−⟩ = (|0⟩−|1⟩)/√2:", [round(x, 3) for x in combinar(r, -r)])`,
            output: `|0⟩:               [1, 0]
|1⟩:               [0, 1]
0.6|0⟩ + 0.8|1⟩:   [0.6, 0.8]
|+⟩ = (|0⟩+|1⟩)/√2: [0.707, 0.707]
|−⟩ = (|0⟩−|1⟩)/√2: [0.707, -0.707]` },
            { type: 'p', text: '<code>combinar</code> hace exactamente la cuenta del nivel 2: multiplica cada lista por su amplitud y suma posición a posición. El resultado siempre es <code>[a, b]</code>; la función existe para que veas que la notación de Dirac «es» esa cuenta.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«|0⟩ es el número cero».', reality: 'Es el estado de un qubit que da 0 con certeza al medirlo. Como lista de amplitudes es [1, 0], no 0.' },
    { myth: '«|+⟩ y |−⟩ son el mismo estado porque dan las mismas probabilidades».', reality: 'Son estados distintos: se diferencian en el signo de una amplitud, y eso cambia cómo interfieren.' },
    { myth: '«El signo + de |0⟩ + |1⟩ es una suma de números».', reality: 'Es una suma de listas (vectores): combina los dos estados base. No se puede simplificar a un único número.' },
  ],

  summary: [
    '$|0\\rangle$ y $|1\\rangle$ son los estados base; el ket $|\\;\\rangle$ marca que se trata de un estado [@dirac1939].',
    'Un estado se escribe $a|0\\rangle + b|1\\rangle$: amplitud $a$ para el 0 y $b$ para el 1.',
    'Equivale a la lista (vector) $[a, b]$; así lo guardan los simuladores.',
    '$|+\\rangle$ y $|-\\rangle$ son «mitad y mitad» y se diferencian en un signo.',
  ],

  exercises: [
    { level: 'comprender', question: 'Escribe como lista de amplitudes el estado $0{,}8|0\\rangle - 0{,}6|1\\rangle$, y en notación de Dirac la lista $[0, -1]$.', answer: '$[0{,}8,\\ -0{,}6]$ y $-|1\\rangle$.' },
    { level: 'matematico', question: 'Calcula $\\tfrac{1}{\\sqrt2}\\big(|+\\rangle + |-\\rangle\\big)$ como lista. ¿Qué estado conocido es?', answer: '$|+\\rangle + |-\\rangle = [0{,}707 + 0{,}707,\\ 0{,}707 - 0{,}707] = [1{,}414,\\ 0]$. Multiplicado por $\\tfrac{1}{\\sqrt2} \\approx 0{,}707$ da $[1, 0] = |0\\rangle$.' },
    { level: 'implementar', question: 'Añade a <code>kets.py</code> una función <code>a_texto(lista)</code> que convierta <code>[a, b]</code> en el texto <code>"a|0⟩ + b|1⟩"</code>.', answer: '<pre><code class="language-python">def a_texto(lista):\n    a, b = lista\n    signo = "-" if b &lt; 0 else "+"\n    return f"{a}|0⟩ {signo} {abs(b)}|1⟩"\n\nprint(a_texto([0.6, 0.8]))   # 0.6|0⟩ + 0.8|1⟩\nprint(a_texto([0.8, -0.6]))  # 0.8|0⟩ - 0.6|1⟩</code></pre>' },
  ],

  references: [
    { key: 'dirac1939', use: 'Origen de la notación de bras y kets.' },
    { key: 'nielsen2010', use: 'Notación de Dirac y estados de un qubit.' },
    { key: 'qiskit-docs', use: 'Los simuladores guardan el estado como lista de amplitudes.' },
  ],

  related: ['el-qubit', 'estado-general-amplitudes', 'esfera-de-bloch', 'superposicion'],
  next: 'estado-general-amplitudes',
};
