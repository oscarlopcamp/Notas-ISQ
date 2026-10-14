// Lección 1.10 — Ejecución de programas
// Salidas de código obtenidas con CPython 3.14.0 (2026-10-14). La salida de dis
// es específica de esa versión: el bytecode cambia entre versiones de Python.

export default {
  id: 'ejecucion-programas',
  title: 'Ejecución de programas: del código fuente a la máquina',
  lede: 'Escribimos programas en Python, no en lenguaje máquina. ¿Qué ocurre entre el texto del programa y las instrucciones que ejecuta la CPU? Esta lección recorre ese camino: compilación, interpretación, procesos, memoria y la pila de llamadas.',
  updated: '2026-10-14',

  context: {
    learn: 'Las fases de un compilador (análisis léxico, sintáctico y generación de código), la diferencia entre compilar e interpretar, el bytecode de Python, qué es un proceso y cómo organiza su memoria, y cómo funciona la pila de llamadas.',
    why: 'Los programas cuánticos también se compilan: un circuito escrito en Qiskit se transforma («transpila») en las operaciones que entiende un dispositivo concreto. Entender la compilación clásica hace natural ese proceso, que será central en los módulos 5 y 8.',
    previous: 'En [[>von-neumann|la lección 1.9]] vimos que la CPU solo ejecuta instrucciones de su ISA, y escribimos programas en ensamblador para la MiniCPU.',
    next: 'La lección 1.11 cierra el módulo preguntando qué problemas puede resolver eficientemente cualquier programa, lo que motiva la computación cuántica (Módulo 2).',
  },

  objectives: [
    'Describir las fases de un compilador: análisis léxico, análisis sintáctico y generación de código.',
    'Distinguir compilación, interpretación y modelos mixtos (bytecode y máquina virtual), y situar CPython en ellos.',
    'Traducir una expresión a código de una máquina de pila y ejecutarlo a mano.',
    'Explicar qué es un proceso y cómo se organiza su memoria (código, datos, montículo y pila).',
    'Seguir la pila de llamadas de una función recursiva y explicar el desbordamiento de pila.',
  ],

  prerequisites: { lessons: ['von-neumann'], knowledge: ['Funciones y recursión en algún lenguaje.'] },

  introduction: [
    { type: 'p', text: 'Entre <code>print((2 + 3) * 4)</code> y los bits que mueve la CPU hay un largo camino. Alguien tiene que entender el texto, comprobar que tiene sentido y producir instrucciones equivalentes. Ese «alguien» es un [[compilador]], un [[interprete|intérprete]] o, muy a menudo, una combinación de ambos.' },
    { type: 'figure', id: 'compile-pipeline', caption: '<b>Figura 1.</b> Dos rutas del código fuente a la ejecución. Un compilador puede traducir directamente a código máquina (ruta superior) o a <em>bytecode</em> para una máquina virtual, que es a su vez un programa que se ejecuta en la CPU (ruta inferior, la de CPython).' },
  ],

  levels: {
    comprender: {
      intro: 'Un compilador en miniatura, CPython por dentro y la memoria de un programa en ejecución.',
      sections: [
        {
          id: 'fases',
          title: 'Las fases de un compilador',
          blocks: [
            { type: 'p', text: 'Un compilador trabaja por etapas, cada una con una responsabilidad clara [@aho2006]:' },
            { type: 'list', ordered: true, items: [
              '<b>Análisis léxico:</b> divide el texto en <em>tokens</em> (números, operadores, paréntesis, nombres), del mismo modo que leemos palabras y no letras sueltas.',
              '<b>Análisis sintáctico:</b> organiza los tokens en un <em>árbol sintáctico</em> según la gramática del lenguaje, que refleja la estructura (qué se opera con qué y en qué orden).',
              '<b>Análisis semántico y optimización:</b> comprueba que el programa tiene sentido (tipos, nombres definidos) y lo mejora.',
              '<b>Generación de código:</b> recorre el árbol y produce instrucciones para la máquina de destino.',
            ] },
            { type: 'widget', id: 'expression-compiler', options: { expression: '(2 + 3) * 4' }, caption: 'Un compilador completo, en miniatura, para expresiones aritméticas. Escribe una expresión y observa las cuatro etapas. Después ejecuta el código instrucción a instrucción. Compara «(2 + 3) * 4» con «2 + 3 * 4»: los mismos tokens producen árboles distintos.' },
            { type: 'p', text: 'La máquina de destino de este compilador es una <b>máquina de pila</b>: sus instrucciones toman los operandos de la cima de una pila y dejan allí el resultado. Es un modelo muy usado en máquinas virtuales, incluida la de CPython, porque el código se genera recorriendo el árbol de forma muy sencilla.' },
          ],
        },
        {
          id: 'compilar-interpretar',
          title: 'Compilar, interpretar… o las dos cosas',
          blocks: [
            { type: 'list', items: [
              '<b>Compilación a código máquina</b> (C, C++, Rust, Go): el programa se traduce una vez y se ejecuta directamente en la CPU. Es rápido al ejecutarse, pero el ejecutable depende de la ISA y del sistema operativo.',
              '<b>Interpretación:</b> un programa (el intérprete) lee el código y realiza las acciones que indica. Es más flexible y portable, pero suele ser más lento.',
              '<b>Modelos mixtos:</b> CPython, la implementación de referencia de Python, compila el código fuente a <em>bytecode</em> y lo ejecuta en su máquina virtual [@python-dis]. Java y C# usan bytecode con compilación «justo a tiempo» (JIT) a código máquina durante la ejecución.',
            ] },
            { type: 'p', text: 'En el nivel 3 veremos el [[bytecode]] real que genera Python para una función de una línea.' },
          ],
        },
        {
          id: 'proceso',
          title: 'Un programa en ejecución: el proceso',
          blocks: [
            { type: 'p', text: 'Cuando ejecutas un programa, el sistema operativo crea un [[proceso]]: carga el código en memoria, le asigna un espacio de direcciones propio y lo pone en marcha [@tanenbaum2015]. Ese espacio se organiza, típicamente, así:' },
            { type: 'figure', id: 'process-memory', caption: '<b>Figura 2.</b> Organización típica del espacio de direcciones de un proceso. La pila y el montículo crecen el uno hacia el otro. Es un modelo simplificado: los sistemas reales añaden bibliotecas compartidas, protecciones y aleatorización de direcciones.' },
            { type: 'list', items: [
              '<b>Código:</b> las instrucciones del programa (en lenguaje máquina o, en CPython, las del propio intérprete).',
              '<b>Datos globales:</b> variables que existen durante toda la ejecución.',
              '<b>Montículo</b> (<i>heap</i>): memoria que se pide y libera dinámicamente. En Python, todos los objetos (listas, cadenas…) viven aquí.',
              '<b>Pila</b> (<i>stack</i>): la [[pila-de-llamadas|pila de llamadas]], con un marco por cada función en curso.',
            ] },
          ],
        },
        {
          id: 'pila',
          title: 'La pila de llamadas',
          blocks: [
            { type: 'p', text: 'Cada vez que se llama a una función, se apila un <em>marco</em> con sus parámetros, sus variables locales y el punto al que debe volver. Al terminar, el marco se desapila. Esto permite que una función se llame a sí misma (recursión): cada llamada tiene su propio marco y sus propias variables.' },
            { type: 'widget', id: 'call-stack', options: { n: 4 }, caption: 'Sigue factorial(4) paso a paso. La pila crece mientras cada llamada espera a la siguiente y se vacía a medida que llegan los resultados. Prueba con factorial(6): la pila llega a tener 6 marcos.' },
            { type: 'p', text: 'La pila tiene un tamaño limitado. Una recursión demasiado profunda la agota (un «desbordamiento de pila»). Python, para protegerse, limita por defecto la profundidad de recursión y lanza un <code>RecursionError</code> antes de llegar a ese punto, como veremos en el nivel 3.' },
            { type: 'callout', kind: 'preview', title: 'Avance: compilar un circuito cuántico', text: 'Un circuito cuántico escrito en Qiskit usa compuertas genéricas, pero cada procesador cuántico solo implementa un conjunto reducido de compuertas nativas y solo permite interacciones entre ciertos pares de qubits. Antes de ejecutarlo, el circuito se <em>transpila</em>: se traduce a las compuertas nativas, se adapta a la conectividad del dispositivo y se optimiza [@qiskit-docs]. Es un compilador con las mismas fases que acabas de ver, y lo estudiaremos en los módulos 5 y 8.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Gramáticas, árboles y la corrección de la evaluación con pila.',
      sections: [
        {
          id: 'gramatica',
          title: 'Una gramática para expresiones',
          blocks: [
            { type: 'p', text: 'La sintaxis de las expresiones del simulador se describe con tres reglas, en notación BNF (cada regla dice cómo se forma una categoría a partir de otras):' },
            { type: 'math', tex: '\\begin{aligned} \\langle\\text{expr}\\rangle &::= \\langle\\text{term}\\rangle \\;\\big((\\texttt{+} \\mid \\texttt{-})\\; \\langle\\text{term}\\rangle\\big)^{*} \\\\ \\langle\\text{term}\\rangle &::= \\langle\\text{factor}\\rangle \\;\\big(\\texttt{*}\\; \\langle\\text{factor}\\rangle\\big)^{*} \\\\ \\langle\\text{factor}\\rangle &::= \\text{número} \\mid \\texttt{(}\\; \\langle\\text{expr}\\rangle \\;\\texttt{)} \\end{aligned}', note: '$X^{*}$ significa «cero o más repeticiones de $X$». El asterisco entre comillas es el símbolo de multiplicar.' },
            { type: 'p', text: 'La precedencia está codificada en la propia gramática: un $\\langle\\text{term}\\rangle$ agrupa las multiplicaciones antes de que $\\langle\\text{expr}\\rangle$ combine las sumas. Por eso <code>2 + 3 * 4</code> produce el árbol $2 + (3 \\times 4)$. Y la repetición de izquierda a derecha hace que <code>10 - 3 - 2</code> sea $(10 - 3) - 2 = 5$, no $10 - (3 - 2) = 9$ [@aho2006].' },
          ],
        },
        {
          id: 'postorden',
          title: 'Generar código: recorrido en postorden',
          blocks: [
            { type: 'p', text: 'Para un árbol con raíz $op$ e hijos $L$ y $R$, la regla de generación es:' },
            { type: 'math', tex: '\\text{gen}(n) = \\begin{cases} \\texttt{PUSH } n & \\text{si } n \\text{ es un número} \\\\ \\text{gen}(L)\\;\\text{gen}(R)\\;\\texttt{OP} & \\text{si } n = L \\;op\\; R \\end{cases}' },
            { type: 'p', text: '<b>Propiedad:</b> ejecutar $\\text{gen}(n)$ sobre una pila cualquiera deja esa pila intacta con el valor de $n$ encima. Se demuestra por inducción sobre la altura del árbol:' },
            { type: 'steps', items: [
              { text: 'Caso base: si $n$ es un número, $\\texttt{PUSH } n$ añade exactamente ese valor.' },
              { text: 'Paso inductivo: por hipótesis, $\\text{gen}(L)$ deja el valor $v_L$ encima, y después $\\text{gen}(R)$ deja $v_R$ encima de $v_L$. $\\texttt{OP}$ desapila ambos y apila $v_L \\;op\\; v_R$, que es el valor de $n$. ∎' },
            ] },
            { type: 'p', text: 'Ejemplo: $(2 + 3) \\times 4$ genera <code>PUSH 2, PUSH 3, ADD, PUSH 4, MUL</code>. La pila evoluciona así: [2], [2, 3], [5], [5, 4], [20].' },
          ],
        },
        {
          id: 'profundidad',
          title: 'Profundidad de la pila de llamadas',
          blocks: [
            { type: 'p', text: '<code>factorial(n)</code> recursivo llega a tener $n$ marcos en la pila a la vez: la memoria que necesita crece linealmente con $n$, aunque el resultado sea un único número. Una versión iterativa (un bucle) usa memoria constante. Es la misma diferencia entre «tiempo» y «memoria» que formalizaremos en la lección 1.11.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Miramos dentro de CPython: el bytecode, el árbol sintáctico y el límite de recursión.',
      sections: [
        {
          id: 'python-dis',
          title: 'El bytecode de una función',
          blocks: [
            { type: 'code', lang: 'python', file: 'bytecode.py', code: `import dis
import sys


def cuadrado(x):
    return x * x


print(sys.version.split()[0])
dis.dis(cuadrado)`,
            output: `3.14.0
  5           RESUME                   0

  6           LOAD_FAST_BORROW_LOAD_FAST_BORROW 0 (x, x)
              BINARY_OP                5 (*)
              RETURN_VALUE`, note: 'Salida de CPython 3.14.0. Los nombres de las instrucciones cambian entre versiones; en otra versión verás algo distinto. Los números de la izquierda son las líneas del archivo.' },
            { type: 'list', items: [
              '<b>LOAD_FAST_BORROW_LOAD_FAST_BORROW</b> apila dos veces la variable local <code>x</code> (es una instrucción combinada, una optimización de esta versión).',
              '<b>BINARY_OP (*)</b> desapila dos valores, los multiplica y apila el resultado: exactamente el MUL de la máquina de pila del simulador.',
              '<b>RETURN_VALUE</b> devuelve la cima de la pila.',
              'La documentación advierte que el bytecode es un detalle de implementación de CPython y que puede cambiar en cualquier versión [@python-dis]. Por eso el programa imprime la versión.',
            ] },
          ],
        },
        {
          id: 'python-ast',
          title: 'El árbol sintáctico de Python',
          blocks: [
            { type: 'code', lang: 'python', file: 'arbol.py', code: `import ast

arbol = ast.parse("(2 + 3) * 4", mode="eval")
print(ast.dump(arbol.body))
print(eval(compile(arbol, "<expresión>", "eval")))`,
            output: `BinOp(left=BinOp(left=Constant(value=2), op=Add(), right=Constant(value=3)), op=Mult(), right=Constant(value=4))
20` },
            { type: 'p', text: 'Es el mismo árbol que dibuja el simulador: una multiplicación cuyo hijo izquierdo es una suma. <code>compile</code> genera el bytecode a partir del árbol, y <code>eval</code> lo ejecuta.' },
          ],
        },
        {
          id: 'python-recursion',
          title: 'Recursión y su límite',
          blocks: [
            { type: 'code', lang: 'python', file: 'recursion.py', code: `import sys


def factorial(n):
    return 1 if n <= 1 else n * factorial(n - 1)


print(factorial(5))
print(sys.getrecursionlimit())
try:
    factorial(10**5)
except RecursionError as e:
    print("RecursionError:", e)`,
            output: `120
1000
RecursionError: maximum recursion depth exceeded` },
            { type: 'p', text: 'Python limita la recursión a 1000 niveles por defecto. Calcular <code>factorial(100000)</code> recursivamente necesitaría 100 000 marcos, así que el intérprete lo detiene con una excepción controlada en lugar de agotar la pila del proceso. La solución no es subir el límite, sino usar un bucle: <code>math.factorial</code> o un <code>for</code>.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Python es un lenguaje interpretado y por eso no se compila».', reality: 'CPython compila el código fuente a bytecode antes de ejecutarlo; lo que interpreta es ese bytecode. «Compilado» e «interpretado» describen implementaciones, no lenguajes.' },
    { myth: '«El código máquina compilado funciona en cualquier computadora».', reality: 'Depende de la ISA (x86-64, ARM…) y del sistema operativo. Por eso hay ejecutables distintos para cada plataforma.' },
    { myth: '«La recursión infinita solo hace que el programa tarde más».', reality: 'Cada llamada consume un marco de pila, que es finita: la recursión sin caso base termina en un error (RecursionError en Python o un fallo por desbordamiento de pila en otros lenguajes).' },
    { myth: '«El bytecode de Python es estable y se puede usar como formato de intercambio».', reality: 'Es un detalle de implementación que cambia entre versiones; por ejemplo, la instrucción combinada que vimos es propia de versiones recientes.' },
  ],

  summary: [
    'Un compilador analiza el código (léxico, sintaxis, semántica) y genera código para una máquina de destino [@aho2006].',
    'CPython compila a bytecode y lo ejecuta en una máquina virtual de pila; el bytecode cambia entre versiones [@python-dis].',
    'Una expresión se compila a código de pila recorriendo su árbol en postorden; la corrección se demuestra por inducción.',
    'Un proceso tiene código, datos, montículo y pila; cada llamada a función apila un marco [@tanenbaum2015].',
    'La recursión profunda agota la pila; Python la limita (1000 niveles por defecto).',
  ],

  exercises: [
    { level: 'comprender', question: '¿Qué árbol produce <code>2 * 3 + 4 * 5</code>? Compruébalo en el simulador.', answer: 'Una suma cuya rama izquierda es $2 \\times 3$ y la derecha, $4 \\times 5$. Resultado: 26.' },
    { level: 'comprender', question: '¿Cuántos marcos tiene como máximo la pila al calcular factorial(6)?', answer: 'Seis: factorial(6), factorial(5), …, factorial(1), todos esperando a la vez justo antes de que el caso base devuelva 1.' },
    { level: 'matematico', question: 'Genera el código de pila de $(1 + 2) \\times (3 + 4)$ y la evolución de la pila.', answer: '<code>PUSH 1, PUSH 2, ADD, PUSH 3, PUSH 4, ADD, MUL</code>. Pila: [1], [1, 2], [3], [3, 3], [3, 3, 4], [3, 7], [21]. Nota que llega a tener 3 elementos.' },
    { level: 'matematico', question: '¿Cuál es la altura máxima de la pila al evaluar un árbol? Relaciónala con la forma del árbol.', answer: 'Para un árbol degenerado hacia la izquierda, como $((1+2)+3)+4$, basta con 2 posiciones. Hacia la derecha, como $1+(2+(3+4))$, se acumulan todos los operandos antes de operar. La profundidad de pila depende de la forma del árbol, no solo del número de nodos.' },
    { level: 'implementar', question: 'Escribe una versión iterativa de <code>factorial</code> y comprueba que calcula <code>factorial(100000)</code> sin error. ¿Cuántas cifras tiene el resultado?', answer: '<pre><code>import sys\n\ndef factorial(n):\n    r = 1\n    for k in range(2, n + 1):\n        r *= k\n    return r\n\nsys.set_int_max_str_digits(0)  # sin límite de conversión a texto\nprint(len(str(factorial(100_000))))</code></pre>Funciona porque no apila marcos, y los enteros de precisión ilimitada de Python (lección 1.2) permiten guardar el resultado: 456 574 cifras. Sin la línea <code>set_int_max_str_digits(0)</code>, <code>str()</code> lanza <code>ValueError</code>: desde Python 3.11, la conversión de enteros enormes a texto decimal está limitada por defecto a 4300 cifras, como protección frente a ataques de denegación de servicio [@python-stdtypes].' },
  ],

  references: [
    { key: 'aho2006', use: 'Fases de un compilador, gramáticas, árboles sintácticos y máquinas de pila.' },
    { key: 'python-dis', use: 'Bytecode de CPython como detalle de implementación.' },
    { key: 'tanenbaum2015', use: 'Procesos y organización de su espacio de direcciones.' },
    { key: 'patterson2021', use: 'De los lenguajes de alto nivel al lenguaje máquina.' },
    { key: 'qiskit-docs', use: 'Transpilación de circuitos cuánticos (avance).' },
    { key: 'python-stdtypes', use: 'Límite de conversión de enteros grandes a texto (ejercicio 5).' },
  ],

  related: ['von-neumann', 'limites-complejidad', 'transpilacion-hardware', 'optimizacion-recursos'],
  next: 'limites-complejidad',
};
