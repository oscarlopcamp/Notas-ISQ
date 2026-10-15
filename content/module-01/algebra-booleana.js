// Lección 1.5 — Álgebra booleana
// Salidas de código obtenidas con CPython 3.14 (2026-10-14). Las leyes se
// verifican por tabla de verdad en tests/module1.test.js.

export default {
  id: 'algebra-booleana',
  title: 'Álgebra booleana',
  lede: 'Con solo dos valores y tres operaciones se puede describir cualquier decisión lógica, desde una condición «if» hasta el circuito que suma dentro de un procesador. Esta lección presenta esa álgebra, sus leyes y cómo demostrarlas.',
  updated: '2026-10-14',

  context: {
    learn: 'Las operaciones AND, OR, NOT y XOR, las tablas de verdad, las leyes del álgebra booleana (incluidas las de De Morgan) y cómo demostrar o refutar una equivalencia.',
    why: 'Es el lenguaje con el que se diseñan los circuitos digitales y con el que razonamos sobre condiciones en el código. XOR, en particular, será esencial para entender la compuerta CNOT de la computación cuántica.',
    previous: 'En [[>sistema-binario|la lección 1.2]] sumamos bits columna a columna. Las reglas de esa suma son, en realidad, funciones booleanas: aquí aprenderemos a escribirlas.',
    next: 'En la lección 1.6 estas operaciones se convierten en compuertas físicas, y en la 1.7 las combinamos para construir el sumador.',
  },

  objectives: [
    'Evaluar expresiones con AND, OR, NOT y XOR y construir su tabla de verdad.',
    'Aplicar las leyes del álgebra booleana, en especial las de De Morgan, la distributiva y la absorción.',
    'Demostrar una equivalencia por tabla de verdad y por manipulación algebraica, y refutarla con un contraejemplo.',
    'Relacionar el álgebra booleana con las condiciones y los operadores bit a bit de un lenguaje de programación.',
  ],

  prerequisites: { lessons: ['sistema-binario'], knowledge: ['Uso de condiciones (if, and, or, not) en algún lenguaje de programación.'] },

  introduction: [
    { type: 'p', text: 'En 1854, George Boole propuso tratar el razonamiento lógico con métodos algebraicos: variables que solo pueden ser verdaderas o falsas y operaciones entre ellas [@boole1854]. Durante casi un siglo fue una herramienta de lógicos y matemáticos. En 1938, Claude Shannon mostró que la misma álgebra describe con exactitud los circuitos de relés y conmutadores [@shannon1938]: un interruptor cerrado es 1, uno abierto es 0, dos interruptores en serie son AND y dos en paralelo son OR.' },
    { type: 'p', text: 'Desde entonces, el [[algebra-booleana|álgebra booleana]] es el puente entre la lógica de un programa y el hardware que lo ejecuta.' },
  ],

  levels: {
    comprender: {
      intro: 'Operaciones, tablas de verdad y leyes, explorados con dos simuladores.',
      sections: [
        {
          id: 'operaciones',
          title: 'Dos valores, cuatro operaciones',
          blocks: [
            { type: 'p', text: 'Las variables booleanas solo toman dos valores, que escribiremos 0 (falso) y 1 (verdadero). Las operaciones básicas son:' },
            { type: 'table', head: ['Operación', 'Notación', 'Vale 1 cuando…', 'En Python'], rows: [
              ['NOT (negación)', '$\\lnot A$', '$A$ vale 0', '<code>not a</code>'],
              ['AND (conjunción)', '$A \\cdot B$', 'ambas valen 1', '<code>a and b</code>'],
              ['OR (disyunción)', '$A + B$', 'al menos una vale 1', '<code>a or b</code>'],
              ['XOR (o exclusivo)', '$A \\oplus B$', 'valen distinto', '<code>a != b</code>'],
            ] },
            { type: 'callout', kind: 'warning', title: 'Cuidado con «+»', text: 'En álgebra booleana, $1 + 1 = 1$: el «+» es OR, no la suma aritmética. La suma de bits que hace un sumador corresponde a XOR (la cifra) y AND (el acarreo), como veremos en la lección 1.7.' },
            { type: 'p', text: 'Una [[tabla-de-verdad|tabla de verdad]] lista el resultado de una expresión para todas las combinaciones de sus entradas. Con $n$ variables hay $2^n$ combinaciones, el mismo conteo de patrones de la lección 1.1.' },
            { type: 'widget', id: 'truth-table', options: { expression: '¬(A·B)' }, caption: 'Escribe una expresión o elige un ejemplo. La tabla incluye una columna para cada subexpresión, en el orden en que se evalúan; la última es el resultado. Admite varias notaciones: <code>A\'</code> o <code>!A</code> para NOT, <code>AB</code> o <code>A*B</code> para AND.' },
            { type: 'p', text: 'Como en la aritmética, hay una precedencia: primero NOT, después AND, después XOR y, por último, OR. Así, $A + B \\cdot C$ significa $A + (B \\cdot C)$.' },
          ],
        },
        {
          id: 'leyes',
          title: 'Las leyes del álgebra booleana',
          blocks: [
            { type: 'p', text: 'Igual que en la aritmética se cumple $a \\cdot (b + c) = a\\cdot b + a\\cdot c$, en el álgebra booleana hay leyes que permiten transformar expresiones sin cambiar su valor:' },
            { type: 'table', head: ['Ley', 'Forma con AND', 'Forma con OR'], rows: [
              ['Identidad', '$A \\cdot 1 = A$', '$A + 0 = A$'],
              ['Anulación', '$A \\cdot 0 = 0$', '$A + 1 = 1$'],
              ['Idempotencia', '$A \\cdot A = A$', '$A + A = A$'],
              ['Complemento', '$A \\cdot \\lnot A = 0$', '$A + \\lnot A = 1$'],
              ['Doble negación', '$\\lnot\\lnot A = A$', ''],
              ['Conmutativa', '$A \\cdot B = B \\cdot A$', '$A + B = B + A$'],
              ['Asociativa', '$(A \\cdot B) \\cdot C = A \\cdot (B \\cdot C)$', '$(A + B) + C = A + (B + C)$'],
              ['Distributiva', '$A \\cdot (B + C) = A\\cdot B + A\\cdot C$', '$A + B \\cdot C = (A + B)\\cdot(A + C)$'],
              ['Absorción', '$A \\cdot (A + B) = A$', '$A + A \\cdot B = A$'],
              ['De Morgan', '$\\lnot(A \\cdot B) = \\lnot A + \\lnot B$', '$\\lnot(A + B) = \\lnot A \\cdot \\lnot B$'],
            ], caption: 'Cada ley tiene una versión «dual»: se obtiene intercambiando · con + y 0 con 1. La distributiva del OR sobre el AND no tiene equivalente en la aritmética ordinaria.' },
            { type: 'p', text: 'Las [[de-morgan|leyes de De Morgan]] son las más útiles en la práctica: la negación de un «y» es un «o» de negaciones. ¿Cómo sabemos que son ciertas? Con solo dos valores posibles por variable, basta con probar todas las combinaciones:' },
            { type: 'widget', id: 'equivalence-checker', caption: 'Pulsa «Error típico»: es la versión equivocada de De Morgan que muchos escriben en sus programas. El comprobador encuentra las filas en las que falla. Prueba también la distributiva del OR, que sorprende por no existir en la aritmética.' },
            { type: 'callout', kind: 'note', status: 'establecido', title: 'Una demostración completa', text: 'En el álgebra ordinaria no podemos demostrar $a(b + c) = ab + ac$ probando números, porque hay infinitos. En el álgebra booleana sí: con $n$ variables hay $2^n$ combinaciones, y si dos expresiones coinciden en todas, son equivalentes. Este método se llama <em>inducción perfecta</em>. Y para refutar una ley basta un único contraejemplo.' },
          ],
        },
        {
          id: 'xor',
          title: 'XOR, la operación de las diferencias',
          blocks: [
            { type: 'p', text: '$A \\oplus B$ vale 1 si $A$ y $B$ son distintos. Tiene propiedades muy útiles:' },
            { type: 'list', items: [
              '$A \\oplus 0 = A$ y $A \\oplus 1 = \\lnot A$: XOR con 1 invierte un bit, y con 0 lo deja igual. Es un «NOT controlado».',
              '$A \\oplus A = 0$: aplicar dos veces el mismo XOR deshace el cambio, porque $(A \\oplus B) \\oplus B = A$.',
              'XOR es la suma módulo 2: $1 \\oplus 1 = 0$ es «1 + 1 = 10, escribo 0».',
            ] },
            { type: 'callout', kind: 'preview', title: 'Avance: la compuerta CNOT', text: 'La propiedad «XOR con un bit de control invierte o no invierte el otro bit» es exactamente lo que hace la compuerta CNOT (NOT controlado), una de las más importantes de la computación cuántica. Y que aplicar dos veces el mismo XOR deshaga la operación está relacionado con la reversibilidad que exige la mecánica cuántica. Lo veremos en la lección 1.6 y en el Módulo 3.' },
          ],
        },
        {
          id: 'programacion',
          title: 'Álgebra booleana en el código',
          blocks: [
            { type: 'p', text: 'Las leyes no son solo teoría. Simplificar una condición complicada es aplicar leyes booleanas, y hacerlo mal es una fuente clásica de errores. Por ejemplo, «el usuario <em>no</em> es (administrador y propietario)» se puede reescribir con De Morgan como «no es administrador <em>o</em> no es propietario», pero no como «no es administrador <em>y</em> no es propietario».' },
            { type: 'p', text: 'Los lenguajes ofrecen dos familias de operadores: los lógicos (<code>and</code>, <code>or</code>, <code>not</code>), que trabajan con valores de verdad y evalúan en <em>cortocircuito</em> (dejan de evaluar en cuanto conocen el resultado), y los bit a bit (<code>&amp;</code>, <code>|</code>, <code>^</code>, <code>~</code>), que aplican la operación a cada par de bits de dos enteros. Los veremos en el nivel 3.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Aquí ponemos números a las ideas del nivel 1. Cada sección empieza con la idea en pocas palabras y un ejemplo; las demostraciones están en «Para profundizar», por si te interesan. Basta con aritmética.',
      sections: [
        {
          id: 'definicion',
          title: 'Definición', key: 'AND da 1 solo si todo es 1; OR, si algo es 1; NOT invierte; XOR da 1 si los valores son distintos (es la suma sin acarreo).',
          blocks: [
            { deep: true, type: 'p', text: 'Trabajamos en el conjunto $\\mathbb{B} = \\{0, 1\\}$. Las operaciones básicas se definen por sus tablas, o de forma equivalente con aritmética entera:' },
            { deep: true, type: 'math', tex: 'A \\cdot B = \\min(A, B), \\qquad A + B = \\max(A, B), \\qquad \\lnot A = 1 - A, \\qquad A \\oplus B = (A + B) \\bmod 2', note: 'En la fórmula de XOR, «+» es la suma de enteros.' },
            { deep: true, type: 'p', text: 'Una <em>función booleana</em> de $n$ variables es cualquier función $f : \\mathbb{B}^n \\to \\mathbb{B}$.' },
          ],
        },
        {
          id: 'demostraciones',
          title: 'Dos formas de demostrar', key: 'Una ley booleana se demuestra comprobando todas las filas de su tabla. Si una sola fila falla, la ley es falsa.',
          blocks: [
            { type: 'h', text: 'Por inducción perfecta (tabla de verdad): De Morgan' },
            { type: 'table', head: ['$A$', '$B$', '$A \\cdot B$', '$\\lnot(A\\cdot B)$', '$\\lnot A$', '$\\lnot B$', '$\\lnot A + \\lnot B$'], mono: [0, 1, 2, 3, 4, 5, 6], rows: [
              ['0', '0', '0', '<b>1</b>', '1', '1', '<b>1</b>'],
              ['0', '1', '0', '<b>1</b>', '1', '0', '<b>1</b>'],
              ['1', '0', '0', '<b>1</b>', '0', '1', '<b>1</b>'],
              ['1', '1', '1', '<b>0</b>', '0', '0', '<b>0</b>'],
            ], caption: 'Las columnas en negrita coinciden en las cuatro filas: $\\lnot(A \\cdot B) = \\lnot A + \\lnot B$. ∎' },
            { deep: true, type: 'h', text: 'Por manipulación algebraica: la absorción' },
            { deep: true, type: 'steps', items: [
              { text: 'Identidad ($A = A \\cdot 1$):', tex: 'A + A \\cdot B = A \\cdot 1 + A \\cdot B' },
              { text: 'Distributiva (sacamos factor común):', tex: '= A \\cdot (1 + B)' },
              { text: 'Anulación ($1 + B = 1$):', tex: '= A \\cdot 1' },
              { text: 'Identidad:', tex: '= A \\quad \\blacksquare' },
            ] },
            { deep: true, type: 'p', text: 'La manipulación algebraica no depende del número de variables y produce expresiones más cortas; la tabla de verdad es mecánica e infalible, pero crece como $2^n$. En la práctica se usan ambas.' },
          ],
        },
        {
          id: 'contar-funciones',
          title: '¿Cuántas funciones booleanas hay?', key: 'Con 2 entradas hay 16 funciones distintas posibles; con 3, 256. Crecen muy deprisa.',
          blocks: [
            { deep: true, type: 'p', text: 'Una función de $n$ variables queda determinada por su tabla, que tiene $2^n$ filas. En cada fila la salida puede ser 0 o 1, de forma independiente. Por el principio multiplicativo:' },
            { deep: true, type: 'math', tex: '\\#\\{f : \\mathbb{B}^n \\to \\mathbb{B}\\} = 2^{2^n}' },
            { type: 'p', text: 'Con $n = 2$ hay $2^4 = 16$ funciones (AND, OR, XOR, NAND… y 12 más). Con $n = 3$, 256; con $n = 5$, más de cuatro mil millones. En la lección 1.7 demostraremos que todas ellas pueden escribirse usando solo AND, OR y NOT.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Construimos tablas de verdad y comprobamos equivalencias con Python, y vemos la diferencia entre operadores lógicos y bit a bit.',
      sections: [
        {
          id: 'python-tablas',
          title: 'Tablas de verdad y equivalencias por fuerza bruta',
          blocks: [
            { type: 'code', lang: 'python', file: 'tablas.py', code: `from itertools import product


def tabla(f, n):
    for valores in product([False, True], repeat=n):
        print(*(int(v) for v in valores), "|", int(f(*valores)))


def equivalentes(f, g, n):
    return all(f(*v) == g(*v) for v in product([False, True], repeat=n))


tabla(lambda a, b: not (a and b), 2)
print(equivalentes(lambda a, b: not (a and b), lambda a, b: (not a) or (not b), 2))
print(equivalentes(lambda a, b: not (a and b), lambda a, b: (not a) and (not b), 2))`,
            output: `0 0 | 1
0 1 | 1
1 0 | 1
1 1 | 0
True
False` },
            { type: 'list', items: [
              '<b><code>product([False, True], repeat=n)</code></b> genera las $2^n$ combinaciones en el mismo orden que una tabla de verdad.',
              '<b><code>equivalentes</code></b> es la inducción perfecta convertida en código: compara las dos funciones en todas las combinaciones.',
              'El resultado confirma De Morgan (<code>True</code>) y refuta la versión errónea (<code>False</code>).',
            ] },
          ],
        },
        {
          id: 'python-bits',
          title: 'Operadores bit a bit y cortocircuito',
          blocks: [
            { type: 'code', lang: 'python', file: 'bits_y_cortocircuito.py', code: `a, b = 0b1100, 0b1010
print(format(a & b, "04b"), format(a | b, "04b"), format(a ^ b, "04b"), format(~a & 0b1111, "04b"))


def avisa(nombre, valor):
    print("evaluando", nombre)
    return valor


print(avisa("A", False) and avisa("B", True))
print(avisa("A", True) or avisa("B", True))`,
            output: `1000 1110 0110 0011
evaluando A
False
evaluando A
True` },
            { type: 'list', items: [
              '<b>Línea 2:</b> <code>&amp;</code>, <code>|</code> y <code>^</code> aplican AND, OR y XOR a cada pareja de bits. <code>~a</code> invierte todos los bits; como los enteros de Python no tienen ancho fijo, se aplica la máscara <code>0b1111</code> para quedarse con 4 bits.',
              '<b>Cortocircuito:</b> en <code>False and …</code> el resultado ya es falso, así que Python no evalúa el segundo operando: nunca se imprime «evaluando B». Lo mismo ocurre con <code>True or …</code>.',
              'El cortocircuito importa cuando el segundo operando tiene efectos (una llamada a red, una excepción posible) y se usa a menudo como protección: <code>if usuario is not None and usuario.activo:</code>.',
            ] },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«¬(A·B) es lo mismo que ¬A·¬B».', reality: 'Es el error más común con De Morgan. Lo correcto es $\\lnot(A\\cdot B) = \\lnot A + \\lnot B$: la negación cambia AND por OR. Las dos expresiones difieren cuando exactamente una de las variables vale 1.' },
    { myth: '«En álgebra booleana, 1 + 1 = 2» o «= 0».', reality: 'Con «+» como OR, $1 + 1 = 1$. La operación que da 0 es XOR ($1 \\oplus 1 = 0$), que corresponde a la cifra de la suma binaria.' },
    { myth: '«and y & son intercambiables».', reality: '<code>and</code> trabaja con valores de verdad y evalúa en cortocircuito; <code>&amp;</code> opera bit a bit sobre enteros y evalúa siempre ambos operandos. Además tienen precedencias distintas.' },
    { myth: '«Probar unos cuantos casos demuestra una ley».', reality: 'Solo probar <em>todas</em> las combinaciones demuestra una ley booleana. Unos cuantos casos pueden coincidir por casualidad, como ocurre con la versión errónea de De Morgan en las filas 00 y 11.' },
  ],

  summary: [
    'El álgebra booleana trabaja con los valores 0 y 1 y las operaciones NOT, AND, OR y XOR [@boole1854; @shannon1938].',
    'Una tabla de verdad con $2^n$ filas describe completamente una función de $n$ variables; hay $2^{2^n}$ funciones distintas.',
    'Leyes clave: distributivas (dos), absorción y De Morgan: $\\lnot(A\\cdot B) = \\lnot A + \\lnot B$.',
    'Una equivalencia se demuestra comprobando todas las filas (o con álgebra) y se refuta con un solo contraejemplo.',
    'XOR es la suma módulo 2 y un «NOT controlado»: aplicarlo dos veces deshace el cambio.',
  ],

  exercises: [
    { level: 'comprender', question: 'Simplifica la condición <code>not (edad &lt; 18 or sin_permiso)</code> usando De Morgan.', answer: '<code>edad &gt;= 18 and not sin_permiso</code>. La negación de un OR es el AND de las negaciones, y la negación de <code>edad &lt; 18</code> es <code>edad &gt;= 18</code>.' },
    { level: 'comprender', question: '¿Para qué combinaciones vale 1 la expresión $A \\oplus B \\oplus C$? Compruébalo con el generador de tablas.', answer: 'Cuando hay un número impar de unos: 001, 010, 100 y 111. Por eso XOR encadenado calcula la <em>paridad</em>, que se usa para detectar errores de transmisión.' },
    { level: 'matematico', question: 'Demuestra algebraicamente que $A \\cdot (A + B) = A$.', answer: 'Distributiva: $A\\cdot A + A\\cdot B$. Idempotencia: $A + A\\cdot B$. Por la absorción demostrada en el nivel 2, $= A$. ∎' },
    { level: 'matematico', question: '¿Es cierto que $A + (B \\oplus C) = (A + B) \\oplus (A + C)$? Encuentra un contraejemplo o demuéstralo.', answer: 'Es falso. Con $A = 1$: el lado izquierdo vale 1, y el derecho, $1 \\oplus 1 = 0$. OR no se distribuye sobre XOR.' },
    { level: 'implementar', question: 'Usa la función <code>equivalentes</code> para comprobar la distributiva del OR sobre el AND, $A + B\\cdot C = (A+B)\\cdot(A+C)$, con $n = 3$.', answer: '<code>equivalentes(lambda a, b, c: a or (b and c), lambda a, b, c: (a or b) and (a or c), 3)</code> devuelve <code>True</code>.' },
  ],

  references: [
    { key: 'boole1854', use: 'Origen del álgebra de la lógica.' },
    { key: 'shannon1938', use: 'El álgebra booleana describe los circuitos de conmutación.' },
    { key: 'harris2013', use: 'Leyes del álgebra booleana aplicadas al diseño digital.' },
    { key: 'bryant2016', use: 'Operadores lógicos frente a operadores bit a bit.' },
  ],

  related: ['sistema-binario', 'compuertas-logicas', 'circuitos-logicos', 'compuertas-multiqubit'],
  next: 'compuertas-logicas',
};
