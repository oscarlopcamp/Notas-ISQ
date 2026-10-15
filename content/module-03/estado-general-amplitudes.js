// Lección 3.3 — Estado general y amplitudes de probabilidad
// Salida de código obtenida con CPython 3.14 (2026-10-15). La lógica del
// constructor de amplitudes se prueba en tests/module3.test.js.
// Amplitudes reales; los números complejos solo se mencionan (Módulo 4).

export default {
  id: 'estado-general-amplitudes',
  title: 'Estado general y amplitudes de probabilidad',
  lede: 'Cualquier estado de un qubit se escribe a|0⟩ + b|1⟩. Esta lección explica la regla que conecta las amplitudes con las probabilidades, la condición que deben cumplir y por qué el signo de una amplitud importa aunque no cambie las probabilidades.',
  updated: '2026-10-15',

  context: {
    learn: 'El estado general de un qubit, la regla «probabilidad = amplitud al cuadrado», la normalización (las probabilidades suman 1) y el papel del signo.',
    why: 'Es la regla con la que se lee el resultado de cualquier programa cuántico: de las amplitudes que calcula un simulador a las probabilidades que se observan al repetir.',
    previous: 'En [[>notacion-dirac|la lección 3.2]] aprendimos a escribir estados como $a|0\\rangle + b|1\\rangle$ y como listas $[a, b]$. En [[>que-es-computacion-cuantica|la 2.1]] ya usamos la regla del cuadrado con el interferómetro.',
    next: 'La lección 3.4 dibuja estos estados en la esfera de Bloch. La 3.5 (superposición) y la 3.6 (fase relativa) profundizan en las combinaciones y en el signo.',
  },

  objectives: [
    'Escribir el estado general de un qubit y calcular sus probabilidades.',
    'Comprobar si un par de amplitudes forma un estado válido y normalizarlo si no.',
    'Explicar por qué una amplitud no es una probabilidad y por qué su signo importa.',
  ],

  prerequisites: { lessons: ['notacion-dirac'], knowledge: ['Elevar al cuadrado y calcular raíces cuadradas.'] },

  introduction: [
    { type: 'p', text: 'Ya sabemos escribir un estado. Ahora vamos a leerlo: dado $a|0\\rangle + b|1\\rangle$, ¿con qué probabilidad saldrá cada resultado? La respuesta es una regla sencilla, propuesta por Max Born en 1926 [@born1926], con una consecuencia que conviene tener muy presente: las amplitudes no son probabilidades.' },
  ],

  levels: {
    comprender: {
      intro: 'La regla del cuadrado, la normalización y el signo.',
      sections: [
        {
          id: 'estado-general',
          title: 'El estado general',
          blocks: [
            { type: 'p', text: 'Todo estado de un qubit se puede escribir como:' },
            { type: 'math', tex: '|\\psi\\rangle = a\\,|0\\rangle + b\\,|1\\rangle' },
            { type: 'p', text: '$|\\psi\\rangle$ (se lee «ket psi») es un nombre para el estado, igual que una variable; la letra griega psi es una costumbre de los físicos. $a$ y $b$ son las amplitudes. Los estados base son casos particulares: $|0\\rangle$ tiene $a = 1$ y $b = 0$.' },
          ],
        },
        {
          id: 'regla-cuadrado',
          title: 'De amplitudes a probabilidades',
          blocks: [
            { type: 'p', text: 'La regla, que ya usamos en el interferómetro (lección 2.1), se llama [[regla-de-born|regla de Born]] [@born1926; @nielsen2010]:' },
            { type: 'callout', kind: 'note', status: 'establecido', title: 'Regla de Born (con amplitudes reales)', text: 'Al medir $a|0\\rangle + b|1\\rangle$, se obtiene 0 con probabilidad $a^2$ y 1 con probabilidad $b^2$.' },
            { type: 'p', text: 'Ejemplo: con $0{,}6|0\\rangle + 0{,}8|1\\rangle$, la probabilidad de 0 es $0{,}6^2 = 0{,}36$ y la de 1, $0{,}8^2 = 0{,}64$. Si preparas y mides este estado 1000 veces, obtendrás unos 360 ceros y unos 640 unos.' },
            { type: 'callout', kind: 'misconception', title: 'Una amplitud no es una probabilidad', text: 'Con $a = 0{,}5$ la probabilidad de 0 no es del 50 %, sino del 25 % ($0{,}5^2$). Y una amplitud puede ser negativa, mientras que una probabilidad nunca lo es.' },
          ],
        },
        {
          id: 'normalizacion',
          title: 'Las probabilidades deben sumar 1',
          blocks: [
            { type: 'p', text: 'Al medir siempre sale 0 o 1, así que sus probabilidades deben sumar 1. Eso impone una condición a las amplitudes, la <b>[[normalizacion-estado|normalización]]</b>:' },
            { type: 'math', tex: 'a^2 + b^2 = 1' },
            { type: 'p', text: 'No cualquier par de números es un estado. $[1, 1]$, por ejemplo, daría probabilidades que suman 2. Para arreglarlo se divide cada amplitud por la misma cantidad hasta que los cuadrados sumen 1; eso se llama <b>normalizar</b>. Normalizar $[1, 1]$ da $[\\tfrac{1}{\\sqrt2}, \\tfrac{1}{\\sqrt2}] \\approx [0{,}707,\\ 0{,}707]$: ese es el origen del $\\tfrac{1}{\\sqrt2}$ de $|+\\rangle$ y $|-\\rangle$.' },
            { type: 'widget', id: 'amplitude-builder', caption: 'Mueve las dos amplitudes. Observa cuándo el estado es válido, pulsa «Normalizar» y comprueba que cambiar el signo de b no cambia las probabilidades. Después, supera los tres retos.' },
          ],
        },
        {
          id: 'signo',
          title: 'Si no cambia las probabilidades, ¿para qué sirve el signo?',
          blocks: [
            { type: 'p', text: '$0{,}6|0\\rangle + 0{,}8|1\\rangle$ y $0{,}6|0\\rangle - 0{,}8|1\\rangle$ dan exactamente las mismas probabilidades, porque $(-0{,}8)^2 = 0{,}8^2$. Midiendo uno solo de ellos, nunca los distinguirías. Pero son estados distintos, y la diferencia aparece cuando el estado se transforma antes de medirlo: las amplitudes se suman, y un signo opuesto puede cancelarlas. Es lo que ocurría en el interferómetro de la lección 2.1, y la base de los algoritmos cuánticos (lecciones 3.6 y 3.8).' },
            { type: 'callout', kind: 'preview', title: 'En general, las amplitudes son números complejos', text: 'En este módulo usamos amplitudes que son números reales (positivos o negativos), y bastan para entender casi todo. En general, una amplitud puede ser un número complejo, y la regla se escribe con su «módulo» al cuadrado. El signo es el caso más sencillo de lo que se llama <b>fase</b>. Lo veremos en la lección 3.6 y lo formalizaremos en el Módulo 4.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'La regla de Born y la normalización, con un ejemplo de cada una.',
      sections: [
        {
          id: 'normalizar',
          title: 'Cómo normalizar',
          key: 'Para normalizar, divide las dos amplitudes por la raíz cuadrada de la suma de sus cuadrados.',
          blocks: [
            { type: 'p', text: 'Si $a^2 + b^2 = L^2$, dividir ambas por $L$ da cuadrados que suman 1. Ejemplo con $[3, 4]$:' },
            { type: 'math', tex: 'L = \\sqrt{3^2 + 4^2} = 5 \\quad\\Rightarrow\\quad \\big[\\tfrac35,\\ \\tfrac45\\big] = [0{,}6,\\ 0{,}8]' },
            { deep: true, type: 'p', text: '$L$ es la longitud del vector $[a, b]$ (teorema de Pitágoras), y normalizar es escalarlo para que mida 1. Por eso los estados de un qubit con amplitudes reales son los puntos de una circunferencia de radio 1. Con amplitudes complejas, $a = a_r + i\\,a_i$, la condición es $|a|^2 + |b|^2 = 1$, donde $|a|^2 = a_r^2 + a_i^2$ (Módulo 4).' },
            { deep: true, type: 'p', text: 'Multiplicar todo el estado por $-1$ da $-a|0\\rangle - b|1\\rangle$, con las mismas probabilidades. A diferencia de cambiar el signo de una sola amplitud, este cambio («fase global») no tiene ningún efecto observable, ni siquiera en la interferencia: $|\\psi\\rangle$ y $-|\\psi\\rangle$ representan el mismo estado físico [@nielsen2010].' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'La regla de Born y la normalización en Python.',
      sections: [
        {
          id: 'python-amplitudes',
          title: 'Probabilidades y normalización',
          blocks: [
            { type: 'code', lang: 'python', file: 'amplitudes.py', code: `import math

def probabilidades(a, b):
    """Probabilidades de obtener 0 y 1: el cuadrado de cada amplitud."""
    return round(a**2, 3), round(b**2, 3)

def normalizar(a, b):
    """Escala a y b para que sus cuadrados sumen 1."""
    largo = math.sqrt(a**2 + b**2)
    return a / largo, b / largo

print(probabilidades(0.6, 0.8))
print(probabilidades(0.6, -0.8))   # el signo no cambia las probabilidades
print(probabilidades(1, 1))        # suman 2: no es un estado válido

a, b = normalizar(1, 1)
print(round(a, 3), round(b, 3), probabilidades(a, b))`,
            output: `(0.36, 0.64)
(0.36, 0.64)
(1, 1)
0.707 0.707 (0.5, 0.5)` },
            { type: 'p', text: 'Se usa <code>round</code> por lo que vimos en la lección 1.2: $0{,}6^2$ no da exactamente 0,36 en punto flotante. Prueba a quitarlo y a normalizar <code>(3, 4)</code>.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Una amplitud de 0,5 significa un 50 % de probabilidad».', reality: 'La probabilidad es el cuadrado: $0{,}5^2 = 0{,}25$, un 25 %.' },
    { myth: '«Cualquier par de números describe un qubit».', reality: 'Solo los que cumplen $a^2 + b^2 = 1$. Los demás se pueden normalizar.' },
    { myth: '«Como el signo no cambia las probabilidades, no importa».', reality: 'Importa cuando el estado se transforma antes de medirlo: las amplitudes con signos opuestos pueden cancelarse (interferencia).' },
  ],

  summary: [
    'Todo estado de un qubit es $a|0\\rangle + b|1\\rangle$.',
    'Al medir, sale 0 con probabilidad $a^2$ y 1 con probabilidad $b^2$ (regla de Born) [@born1926].',
    'Las amplitudes deben cumplir $a^2 + b^2 = 1$ (normalización).',
    'El signo de una amplitud no cambia las probabilidades, pero sí la interferencia. En general las amplitudes son complejas (Módulo 4).',
  ],

  exercises: [
    { level: 'comprender', question: '¿Es válido el estado $0{,}5|0\\rangle + 0{,}5|1\\rangle$? Si no lo es, normalízalo.', answer: 'No: $0{,}25 + 0{,}25 = 0{,}5 \\neq 1$. Normalizado es $\\tfrac{1}{\\sqrt2}|0\\rangle + \\tfrac{1}{\\sqrt2}|1\\rangle = |+\\rangle$.' },
    { level: 'comprender', question: 'Quieres un estado que dé 1 el 90 % de las veces. Escribe uno, y otro distinto con las mismas probabilidades.', answer: '$b^2 = 0{,}9 \\Rightarrow b \\approx 0{,}949$ y $a^2 = 0{,}1 \\Rightarrow a \\approx 0{,}316$: $0{,}316|0\\rangle + 0{,}949|1\\rangle$. Otro: $0{,}316|0\\rangle - 0{,}949|1\\rangle$ (o cambiando el signo de $a$).' },
    { level: 'matematico', question: 'Normaliza $[1, 2]$ y calcula sus probabilidades.', answer: '$L = \\sqrt{5} \\approx 2{,}236$, así que $[0{,}447,\\ 0{,}894]$. Probabilidades: $0{,}2$ y $0{,}8$.' },
    { level: 'implementar', question: 'Escribe una función <code>es_valido(a, b)</code> que diga si un par de amplitudes forma un estado válido, comparando con tolerancia (lección 1.2).', answer: '<pre><code class="language-python">import math\n\ndef es_valido(a, b):\n    return math.isclose(a**2 + b**2, 1.0)\n\nprint(es_valido(0.6, 0.8))      # True\nprint(es_valido(0.5, 0.5))      # False\nr = 1 / math.sqrt(2)\nprint(es_valido(r, r))          # True, aunque r**2 + r**2 no sea exactamente 1</code></pre>' },
  ],

  references: [
    { key: 'born1926', use: 'Interpretación probabilística de las amplitudes.' },
    { key: 'nielsen2010', use: 'Regla de la medición, normalización y fase global.' },
  ],

  related: ['notacion-dirac', 'esfera-de-bloch', 'superposicion', 'fase-relativa', 'medicion-cuantica'],
  next: 'esfera-de-bloch',
};
