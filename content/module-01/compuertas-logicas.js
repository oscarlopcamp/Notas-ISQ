// Lección 1.6 — Compuertas lógicas
// Salidas de código obtenidas con CPython 3.14 (2026-10-14). La universalidad
// de NAND y la reversibilidad de Toffoli se verifican también en tests/.

export default {
  id: 'compuertas-logicas',
  title: 'Compuertas lógicas: AND, OR, NOT, XOR, NAND y NOR',
  lede: 'Las operaciones del álgebra booleana se pueden construir con transistores. Esas construcciones, las compuertas lógicas, son los ladrillos de todo procesador. Veremos que una sola de ellas basta para construirlo todo, y que algunas pierden información mientras que otras no, una distinción clave para la computación cuántica.',
  updated: '2026-10-14',

  context: {
    learn: 'Qué es una compuerta lógica, sus símbolos y tablas, cómo se construye con transistores, por qué NAND es universal y qué distingue a las compuertas reversibles (CNOT, Toffoli) de las irreversibles (AND, OR).',
    why: 'Los circuitos cuánticos también se describen con compuertas. Entender las compuertas clásicas, y en particular las reversibles, hace mucho más natural el paso a las compuertas cuánticas del Módulo 3.',
    previous: 'En [[>algebra-booleana|la lección 1.5]] definimos las operaciones booleanas y sus leyes. Aquí las convertimos en dispositivos.',
    next: 'En la lección 1.7 combinaremos compuertas para construir circuitos útiles: sumadores y multiplexores. En el Módulo 3 aparecerán las compuertas cuánticas X, CNOT y Toffoli, herederas directas de NOT, CNOT y Toffoli.',
  },

  objectives: [
    'Reconocer los símbolos y tablas de verdad de AND, OR, NOT, XOR, NAND, NOR y XNOR.',
    'Explicar a grandes rasgos cómo se implementa una compuerta con transistores.',
    'Construir NOT, AND, OR y XOR usando solo compuertas NAND, y justificar por qué NAND es universal.',
    'Distinguir compuertas reversibles e irreversibles y relacionar la reversibilidad con la información y la energía.',
  ],

  prerequisites: { lessons: ['algebra-booleana'], knowledge: [] },

  introduction: [
    { type: 'p', text: 'Una [[compuerta-logica|compuerta lógica]] es un circuito que recibe una o más señales binarias (los niveles de voltaje de la lección 1.1) y produce una salida que es una función booleana de ellas. Es la materialización física de las operaciones de la lección anterior.' },
    { type: 'p', text: 'Empezamos por conocer las compuertas, después veremos que una sola basta para construir todas las demás y terminaremos con una pregunta que parece filosófica pero tiene consecuencias físicas: ¿se puede deshacer lo que hace una compuerta?' },
  ],

  levels: {
    comprender: {
      intro: 'Tres simuladores: las compuertas una a una, la universalidad de NAND y la reversibilidad.',
      sections: [
        {
          id: 'catalogo',
          title: 'El catálogo de compuertas',
          blocks: [
            { type: 'widget', id: 'logic-gates', options: { gate: 'AND' }, caption: 'Elige una compuerta y pulsa los círculos de entrada para cambiar su valor. Los cables de color llevan un 1; los grises, un 0. La fila activa de la tabla se resalta. Los símbolos son los de forma distintiva de ANSI/IEEE; un pequeño círculo en la salida indica negación.' },
            { type: 'p', text: 'Fíjate en las compuertas con círculo en la salida. NAND es AND seguida de NOT, NOR es OR seguida de NOT y XNOR es XOR negada (vale 1 cuando las entradas son iguales, así que sirve para comparar).' },
          ],
        },
        {
          id: 'transistores',
          title: 'De los transistores a las compuertas',
          blocks: [
            { type: 'p', text: 'En los chips actuales (tecnología CMOS), cada compuerta se construye con transistores que funcionan como interruptores controlados por voltaje. Un inversor (NOT) necesita 2 transistores y una NAND de dos entradas, 4 [@harris2013]. Un procesador moderno contiene miles de millones de transistores organizados así.' },
            { type: 'callout', kind: 'model', status: 'simplificacion', text: 'Tratar los transistores como interruptores ideales es un modelo simplificado. En la realidad, una compuerta tarda un tiempo en cambiar su salida (retardo de propagación), consume energía en cada cambio y solo funciona bien si las señales respetan los márgenes de ruido de la lección 1.1. Estos detalles determinan la velocidad y el consumo de los procesadores.' },
            { type: 'p', text: 'Curiosamente, en CMOS la compuerta natural no es AND sino NAND: AND se construye como NAND seguida de un inversor. Esto nos lleva a la siguiente idea.' },
          ],
        },
        {
          id: 'universalidad',
          title: 'Una compuerta para gobernarlas a todas',
          blocks: [
            { type: 'p', text: 'Un conjunto de compuertas es [[conjunto-universal|universal]] si con él se puede construir cualquier función booleana. En la lección 1.7 veremos que {AND, OR, NOT} lo es. Pero hay algo más sorprendente: NAND, por sí sola, también lo es.' },
            { type: 'widget', id: 'nand-builder', options: { target: 'XOR' }, caption: 'Cada circuito usa solo compuertas NAND. Cambia las entradas y comprueba que la salida coincide con la función objetivo; el simulador lo verifica además en todas las combinaciones. Empieza por NOT, la más sencilla: una NAND con las dos entradas unidas.' },
            { type: 'list', items: [
              '<b>NOT:</b> $A \\text{ NAND } A = \\lnot(A \\cdot A) = \\lnot A$.',
              '<b>AND:</b> NAND seguida de NOT.',
              '<b>OR:</b> por De Morgan, $A + B = \\lnot(\\lnot A \\cdot \\lnot B)$: niega las entradas y aplica NAND.',
            ] },
            { type: 'p', text: 'Si NAND construye NOT, AND y OR, y estas construyen cualquier función, entonces NAND construye cualquier función. Lo mismo ocurre con NOR. Esto tiene valor práctico: fabricar un único tipo de compuerta optimizada es más sencillo.' },
          ],
        },
        {
          id: 'reversibilidad',
          title: '¿Se puede deshacer una compuerta?',
          blocks: [
            { type: 'p', text: 'Imagina que una compuerta AND ha producido un 0. ¿Cuáles eran sus entradas? Pudieron ser 00, 01 o 10: no hay forma de saberlo. AND <em>pierde información</em>. En cambio, NOT sí se puede deshacer: si la salida es 0, la entrada era 1. Decimos que NOT es [[computacion-reversible|reversible]].' },
            { type: 'widget', id: 'reversible-gates', options: { gate: 'AND' }, caption: 'Cada línea une una entrada con la salida que produce. Una compuerta es reversible si a cada salida llega exactamente una línea. Compara AND con CNOT y Toffoli, y pulsa una salida para ver de qué entradas procede.' },
            { type: 'p', text: '¿Podemos calcular cosas útiles sin perder información? Sí: basta con conservar suficientes entradas en la salida. La compuerta <b>CNOT</b> (NOT controlado) recibe dos bits $(a, b)$ y devuelve $(a, a \\oplus b)$: calcula XOR y conserva $a$, de modo que nada se pierde. La compuerta de <b>Toffoli</b> recibe tres bits y devuelve $(a, b, c \\oplus a\\cdot b)$; con $c = 0$, la tercera salida es $a \\cdot b$, un AND reversible. Toffoli demostró que su compuerta es universal para la computación reversible [@toffoli1980], y Bennett, que cualquier cálculo puede hacerse de forma reversible [@bennett1973].' },
            { type: 'h', text: '¿Por qué importa? Información y energía' },
            { type: 'p', text: 'En 1961, Rolf Landauer argumentó que borrar información tiene un coste físico: toda operación lógicamente irreversible, como borrar un bit, debe disipar al menos $kT \\ln 2$ de energía en forma de calor, donde $k$ es la constante de Boltzmann y $T$ la temperatura [@landauer1961]. A temperatura ambiente, unos $3 \\times 10^{-21}$ julios por bit. Es una cantidad minúscula, muy por debajo de lo que disipan los circuitos actuales, pero es un límite de principio que conecta la información con la física.' },
            { type: 'callout', kind: 'preview', status: 'establecido', title: 'Avance: las compuertas cuánticas son reversibles', text: 'Por las leyes de la física cuántica, <em>todas</em> las compuertas de una computadora cuántica son reversibles [@nielsen2010]: no existe un AND cuántico que «tire» información. Por eso NOT, CNOT y Toffoli, que acabas de ver, tienen versiones cuánticas directas. La única excepción es leer el resultado al final (la medición). Lo veremos en el Módulo 3.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Aquí ponemos números a las ideas del nivel 1. Cada sección empieza con la idea en pocas palabras y un ejemplo; las demostraciones están en «Para profundizar», por si te interesan. Basta con aritmética.',
      sections: [
        {
          id: 'nand-formal',
          title: 'Universalidad de NAND: demostración', key: 'Con NAND se construye todo: NOT (uniendo sus dos entradas), AND (NAND seguida de NOT) y OR (negando antes las entradas). XOR necesita 4 NAND.',
          blocks: [
            { deep: true, type: 'p', text: 'Escribimos $A \\uparrow B = \\lnot(A \\cdot B)$ (NAND). Basta expresar NOT, AND y OR con $\\uparrow$:' },
            { deep: true, type: 'steps', items: [
              { text: 'NOT, por idempotencia:', tex: 'A \\uparrow A = \\lnot(A \\cdot A) = \\lnot A' },
              { text: 'AND, por doble negación:', tex: '(A \\uparrow B) \\uparrow (A \\uparrow B) = \\lnot(A \\uparrow B) = \\lnot\\lnot(A\\cdot B) = A \\cdot B' },
              { text: 'OR, por De Morgan:', tex: '(A \\uparrow A) \\uparrow (B \\uparrow B) = \\lnot(\\lnot A \\cdot \\lnot B) = A + B' },
              { text: 'Como {NOT, AND, OR} es universal (lección 1.7), también lo es {NAND}. ∎' },
            ] },
            { deep: true, type: 'p', text: 'XOR necesita 4 compuertas NAND. Sea $m = A \\uparrow B = \\lnot(A\\cdot B)$:' },
            { deep: true, type: 'steps', items: [
              { text: 'Primera compuerta intermedia (distributiva, De Morgan y complemento):', tex: 'A \\cdot m = A \\cdot (\\lnot A + \\lnot B) = A\\cdot\\lnot A + A\\cdot\\lnot B = A \\cdot \\lnot B \\;\\Rightarrow\\; A \\uparrow m = \\lnot(A\\cdot\\lnot B)' },
              { text: 'Por simetría:', tex: 'B \\uparrow m = \\lnot(\\lnot A \\cdot B)' },
              { text: 'Última compuerta, con De Morgan y doble negación:', tex: '(A \\uparrow m) \\uparrow (B \\uparrow m) = \\lnot\\big(\\lnot(A\\cdot\\lnot B)\\cdot\\lnot(\\lnot A\\cdot B)\\big) = A\\cdot\\lnot B + \\lnot A\\cdot B' },
              { text: 'La última expresión vale 1 exactamente cuando $A$ y $B$ son distintos:', tex: 'A\\cdot\\lnot B + \\lnot A\\cdot B = A \\oplus B \\quad \\blacksquare' },
            ] },
          ],
        },
        {
          id: 'reversible-formal',
          title: 'Reversible significa biyectiva', key: 'Una compuerta es reversible si cada salida viene de una sola entrada. AND no lo es (tres entradas distintas dan 0); Toffoli sí, y aplicarla dos veces deja todo como estaba.',
          blocks: [
            { deep: true, type: 'p', text: 'Una compuerta de $n$ bits de entrada y $n$ de salida es una función $f : \\mathbb{B}^n \\to \\mathbb{B}^n$. Es reversible si y solo si es <em>biyectiva</em>: a cada salida le corresponde exactamente una entrada, de modo que existe la inversa $f^{-1}$.' },
            { type: 'p', text: 'AND, $\\mathbb{B}^2 \\to \\mathbb{B}$, no puede serlo: tiene 4 entradas y 2 salidas, así que alguna salida tiene varias preimágenes. En concreto, la salida 0 tiene 3.' },
            { deep: true, type: 'p', text: 'Toffoli, $T(a, b, c) = (a, b, c \\oplus ab)$, es su propia inversa:' },
            { deep: true, type: 'math', tex: 'T(T(a,b,c)) = T(a, b, c \\oplus ab) = (a, b, c \\oplus ab \\oplus ab) = (a, b, c)', note: 'Usamos que $x \\oplus x = 0$. Si $T \\circ T$ es la identidad, $T$ es biyectiva.' },
          ],
        },
        {
          id: 'landauer',
          title: 'El límite de Landauer en números', key: 'Borrar un bit cuesta, como mínimo, unos 3 × 10⁻²¹ julios a temperatura ambiente: una cantidad minúscula, pero no cero.',
          blocks: [
            { deep: true, type: 'p', text: 'La constante de Boltzmann vale exactamente $k_B = 1{,}380649 \\times 10^{-23}$ J/K en el Sistema Internacional. A $T = 300$ K (unos 27 °C):' },
            { deep: true, type: 'math', tex: 'E_{\\min} = k_B T \\ln 2 = 1{,}380649 \\times 10^{-23} \\cdot 300 \\cdot 0{,}693\\ldots \\approx 2{,}87 \\times 10^{-21} \\text{ J por bit borrado}' },
            { deep: true, type: 'p', text: 'El límite se refiere a operaciones lógicamente irreversibles [@landauer1961]. Un cálculo reversible no está sujeto a él, aunque los circuitos reales disipan energía por muchas otras causas.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Construimos compuertas con NAND en Python, comprobamos la reversibilidad de Toffoli y calculamos el límite de Landauer.',
      sections: [
        {
          id: 'python-nand',
          title: 'Todo con NAND, comprobado exhaustivamente',
          blocks: [
            { type: 'code', lang: 'python', file: 'nand.py', code: `from itertools import product


def nand(a, b):
    return 1 - (a & b)


def no(a):
    return nand(a, a)


def y(a, b):
    return no(nand(a, b))


def o(a, b):
    return nand(no(a), no(b))


def xor(a, b):
    m = nand(a, b)
    return nand(nand(a, m), nand(b, m))


for a, b in product([0, 1], repeat=2):
    assert y(a, b) == (a & b) and o(a, b) == (a | b) and xor(a, b) == (a ^ b)
    assert no(a) == 1 - a
print("NAND basta para construir NOT, AND, OR y XOR")`,
            output: 'NAND basta para construir NOT, AND, OR y XOR' },
          ],
        },
        {
          id: 'python-reversible',
          title: 'Irreversibilidad de AND y reversibilidad de Toffoli',
          blocks: [
            { type: 'code', lang: 'python', file: 'reversible.py', code: `from itertools import product
from collections import Counter

pares = list(product([0, 1], repeat=2))
print(Counter(a & b for a, b in pares))


def toffoli(a, b, c):
    return a, b, c ^ (a & b)


ternas = list(product([0, 1], repeat=3))
print(len({toffoli(*t) for t in ternas}) == len(ternas))
print(all(toffoli(*toffoli(*t)) == t for t in ternas))
print([toffoli(a, b, 0)[2] for a, b in pares])`,
            output: `Counter({0: 3, 1: 1})
True
True
[0, 0, 0, 1]` },
            { type: 'list', items: [
              '<b>Línea 5:</b> la salida 0 de AND procede de 3 entradas distintas: información perdida.',
              '<b>Línea 13:</b> Toffoli produce 8 salidas distintas para 8 entradas (es biyectiva).',
              '<b>Línea 14:</b> aplicarla dos veces devuelve la entrada: es su propia inversa.',
              '<b>Línea 15:</b> con $c = 0$, la tercera salida es la tabla de AND: 0, 0, 0, 1.',
            ] },
          ],
        },
        {
          id: 'python-landauer',
          title: 'El límite de Landauer',
          blocks: [
            { type: 'code', lang: 'python', file: 'landauer.py', code: `import math

k_B = 1.380649e-23  # constante de Boltzmann, J/K (valor exacto en el SI)
T = 300             # temperatura ambiente aproximada, K
print(f"{k_B * T * math.log(2):.3e} J")`,
            output: '2.871e-21 J' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Un procesador necesita muchos tipos distintos de compuertas».', reality: 'NAND (o NOR) por sí sola basta para construir cualquier función lógica. En la práctica se usan varios tipos por eficiencia, no por necesidad.' },
    { myth: '«Una compuerta lógica responde instantáneamente».', reality: 'Toda compuerta tiene un retardo de propagación. En circuitos grandes estos retardos se acumulan y limitan la frecuencia de reloj, como veremos con el sumador de la lección 1.7.' },
    { myth: '«Reversible significa que se puede ejecutar hacia atrás en el tiempo».', reality: 'Significa que la salida determina de forma única la entrada (la función es biyectiva), de modo que existe una operación inversa que la recupera. No implica viajar en el tiempo.' },
    { myth: '«Las compuertas cuánticas son como las clásicas, pero más rápidas».', reality: 'Las compuertas cuánticas siguen otras reglas y son siempre reversibles; no son versiones aceleradas de AND u OR. Su ventaja, cuando la hay, procede de la estructura de los algoritmos, no de la velocidad de cada compuerta.' },
  ],

  summary: [
    'Una compuerta lógica implementa físicamente una función booleana; en CMOS se construye con transistores.',
    'NAND es universal: con ella se construyen NOT, AND, OR y, por tanto, cualquier función.',
    'Una compuerta es reversible si es biyectiva. AND y OR no lo son; NOT, CNOT y Toffoli sí.',
    'Landauer: borrar un bit disipa al menos $kT\\ln 2$; Bennett y Toffoli mostraron que se puede computar de forma reversible.',
    'Las compuertas cuánticas son siempre reversibles y generalizan NOT, CNOT y Toffoli.',
  ],

  exercises: [
    { level: 'comprender', question: '¿Qué compuerta de dos entradas sirve para comprobar si dos bits son iguales?', answer: 'XNOR: vale 1 si y solo si las entradas coinciden. Es la negación de XOR.' },
    { level: 'comprender', question: 'CNOT transforma $(a, b)$ en $(a, a \\oplus b)$. Si la salida es $(1, 0)$, ¿cuál era la entrada?', answer: '$a = 1$ y $a \\oplus b = 0$, luego $b = 1$: la entrada era $(1, 1)$. Se puede recuperar porque CNOT es reversible; de hecho, aplicar CNOT otra vez a $(1, 0)$ da $(1, 1)$.' },
    { level: 'matematico', question: 'Construye NOT, AND y OR usando solo NOR ($A \\downarrow B = \\lnot(A + B)$).', answer: 'NOT: $A \\downarrow A = \\lnot A$. OR: $(A \\downarrow B) \\downarrow (A \\downarrow B) = A + B$. AND, por De Morgan: $(A \\downarrow A) \\downarrow (B \\downarrow B) = \\lnot(\\lnot A + \\lnot B) = A\\cdot B$.' },
    { level: 'matematico', question: '¿Cuántas funciones reversibles de 2 bits a 2 bits existen?', answer: 'Son las biyecciones de un conjunto de 4 elementos en sí mismo: $4! = 24$. CNOT, la identidad y el intercambio (SWAP) son tres de ellas.' },
    { level: 'implementar', question: 'Implementa <code>cnot(a, b)</code> y comprueba en Python que es su propia inversa y que con <code>b = 0</code> copia <code>a</code>.', answer: '<pre><code>def cnot(a, b):\n    return a, a ^ b\n\nassert all(cnot(*cnot(a, b)) == (a, b) for a in (0, 1) for b in (0, 1))\nassert [cnot(a, 0)[1] for a in (0, 1)] == [0, 1]</code></pre>Con <code>b = 0</code> la segunda salida es una copia de <code>a</code>. Esta «copia mediante CNOT» funciona para bits clásicos; en el Módulo 3 veremos que con qubits no sirve para copiar.' },
  ],

  references: [
    { key: 'harris2013', use: 'Compuertas, símbolos, implementación CMOS y retardos.' },
    { key: 'shannon1938', use: 'Implementación física de la lógica con conmutadores.' },
    { key: 'landauer1961', use: 'Coste energético mínimo de las operaciones irreversibles.' },
    { key: 'bennett1973', use: 'Toda computación puede hacerse reversible.' },
    { key: 'toffoli1980', use: 'Compuerta de Toffoli y universalidad en la computación reversible.' },
    { key: 'nielsen2010', use: 'Las compuertas cuánticas son reversibles (unitarias); CNOT y Toffoli cuánticas.' },
  ],

  related: ['algebra-booleana', 'circuitos-logicos', 'compuertas-multiqubit', 'qubits-logicos'],
  next: 'circuitos-logicos',
};
