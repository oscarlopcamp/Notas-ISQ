// Lección 1.9 — Instrucciones y arquitectura de von Neumann
// La MiniCPU es un modelo educativo propio. Su implementación en Python (nivel 3)
// se ejecutó con CPython 3.14 (2026-10-14) y coincide con la de JavaScript
// (tests/module1.test.js): mismas codificaciones, salidas y número de instrucciones.

export default {
  id: 'von-neumann',
  title: 'Instrucciones y arquitectura de von Neumann',
  lede: 'Un programa es una lista de instrucciones guardadas como bits en la misma memoria que los datos. Esta idea, el programa almacenado, es el corazón de casi todas las computadoras. Aquí la verás funcionar dentro de un procesador simulado, instrucción a instrucción.',
  updated: '2026-10-14',

  context: {
    learn: 'Qué es una instrucción de máquina y un juego de instrucciones (ISA), cómo se codifica una instrucción en bits, el ciclo búsqueda-decodificación-ejecución, el concepto de programa almacenado y sus consecuencias, incluido el «cuello de botella de von Neumann».',
    why: 'Comprender cómo un procesador ejecuta un programa elimina la «magia» de la computación y prepara para comparar: una QPU no funciona así, sino como un coprocesador al que un programa clásico envía circuitos.',
    previous: 'En [[>procesador-memoria|la lección 1.8]] conocimos la CPU (ALU, registros, control) y la memoria. Falta ver qué hace la unidad de control.',
    next: 'La lección 1.10 explica cómo un programa escrito en un lenguaje de alto nivel llega a convertirse en instrucciones como estas. En el Módulo 2 veremos la arquitectura de un sistema híbrido clásico-cuántico.',
  },

  objectives: [
    'Explicar el concepto de programa almacenado y la arquitectura de von Neumann.',
    'Codificar y decodificar instrucciones de la MiniCPU (código de operación + dirección).',
    'Seguir el ciclo búsqueda-decodificación-ejecución y el efecto de cada instrucción sobre PC, IR, ACC y memoria.',
    'Escribir programas sencillos en ensamblador con bucles y saltos condicionales.',
    'Explicar el cuello de botella de von Neumann y los riesgos de mezclar código y datos.',
  ],

  prerequisites: { lessons: ['procesador-memoria', 'sistema-binario'], knowledge: ['Bucles y condicionales en algún lenguaje.'] },

  introduction: [
    { type: 'p', text: 'Las primeras computadoras electrónicas se «programaban» recableándolas: cambiar de tarea suponía conectar cables y ajustar interruptores. En 1945, el informe preliminar sobre el EDVAC, firmado por John von Neumann, describió una organización distinta: el programa se guarda en la memoria, igual que los datos, y una unidad de control lo lee y ejecuta instrucción a instrucción [@vonneumann1993]. Cambiar de programa pasó a ser tan sencillo como cambiar el contenido de la memoria.' },
    { type: 'figure', id: 'von-neumann-arch', caption: '<b>Figura 1.</b> Arquitectura de von Neumann (modelo conceptual): CPU, una memoria única para instrucciones y datos, y entrada/salida, conectadas por un bus. Los procesadores actuales son mucho más complejos, pero conservan esta estructura lógica [@patterson2021].' },
  ],

  levels: {
    comprender: {
      intro: 'Una instrucción en bits, la MiniCPU paso a paso y las consecuencias de mezclar programa y datos.',
      sections: [
        {
          id: 'instruccion',
          title: '¿Qué es una instrucción?',
          blocks: [
            { type: 'p', text: 'Una instrucción es una orden elemental que la CPU sabe ejecutar: «carga en un registro el dato de tal dirección», «suma», «salta a tal instrucción si el resultado es cero». El conjunto de instrucciones de un procesador, junto con sus registros y reglas, se llama [[isa|juego de instrucciones]] o ISA (<i>instruction set architecture</i>). x86-64, ARM y RISC-V son ISA reales [@riscv-spec]; la ISA es el contrato entre el hardware y el software.' },
            { type: 'p', text: 'Para esta lección usaremos una ISA mínima diseñada para aprender, la de la <b>MiniCPU</b>: 8 instrucciones de 8 bits. Los 3 primeros bits indican la operación y los 5 restantes, una dirección de memoria (de 0 a 31).' },
            { type: 'widget', id: 'instruction-format', caption: 'Pulsa los bits o elige la instrucción en el desplegable. Morado: código de operación; verde azulado: dirección. El mismo byte puede ser una instrucción o un número, según cómo se use.' },
            { type: 'callout', kind: 'model', status: 'simplificacion', text: 'La MiniCPU es un modelo educativo, no un procesador real. Tiene un único registro de trabajo (el acumulador, ACC), 32 bytes de memoria y 8 instrucciones. Las ISA reales tienen decenas de registros, cientos de instrucciones y palabras de 32 o 64 bits, pero el principio es el mismo.' },
          ],
        },
        {
          id: 'ciclo',
          title: 'El ciclo de instrucción, paso a paso',
          blocks: [
            { type: 'p', text: 'La unidad de control repite incansablemente el [[ciclo-de-instruccion|ciclo de instrucción]]:' },
            { type: 'list', ordered: true, items: [
              '<b>Búsqueda</b> (<i>fetch</i>): lee la instrucción de la dirección indicada por el <b>contador de programa</b> (PC), la copia en el <b>registro de instrucción</b> (IR) e incrementa el PC.',
              '<b>Decodificación</b> (<i>decode</i>): separa los campos de la instrucción para saber qué operación es y sobre qué dirección actúa.',
              '<b>Ejecución</b> (<i>execute</i>): realiza la operación (usar la ALU, leer o escribir memoria o cambiar el PC si es un salto).',
            ] },
            { type: 'widget', id: 'mini-cpu', options: { program: 'suma' }, caption: 'Pulsa «Siguiente fase» y observa los registros y la memoria. La celda con borde azul es la que señala el PC; la marca verde azulada indica lectura y la naranja, escritura. Después carga «Cuenta atrás»: un bucle hecho con un salto condicional (JZ) y uno incondicional (JMP). También puedes editar el código y pulsar «Ensamblar y cargar».' },
            { type: 'p', text: 'Fíjate en tres cosas. Primera: el PC avanza solo, salvo cuando un salto lo cambia. Así se construyen los bucles y las condiciones; no hace falta nada más. Segunda: el programa «multiplica» sin tener una instrucción de multiplicar, mediante sumas repetidas, que es lo que harían los primeros procesadores o uno muy sencillo hoy. Tercera: el programa «H → h» suma 32 al código ASCII de «H», el paso 4 del recorrido de la lección 1.1, ahora ejecutado de verdad.' },
          ],
        },
        {
          id: 'ensamblador',
          title: 'Lenguaje máquina y ensamblador',
          blocks: [
            { type: 'p', text: 'Los bits de las instrucciones son el <b>lenguaje máquina</b>. Escribir <code>00110100</code> es poco práctico, así que se usa el <b>ensamblador</b>: una notación legible (<code>LOAD 20</code>) que un programa, también llamado ensamblador, traduce a bits uno a uno. Para comparar, así se escribiría una suma en RISC-V, una ISA real y abierta [@riscv-spec]:' },
            { type: 'code', lang: 'plaintext', code: `lw   x5, 0(x10)    # carga en el registro x5 la palabra de la dirección x10
lw   x6, 4(x10)    # carga en x6 la palabra siguiente
add  x7, x5, x6    # x7 ← x5 + x6
sw   x7, 8(x10)    # guarda x7 en memoria`, note: 'Ilustración de la sintaxis de RISC-V (no se ejecuta en esta página). A diferencia de la MiniCPU, RISC-V tiene 32 registros y las operaciones aritméticas trabajan solo con registros; la memoria se usa con cargas (lw) y almacenamientos (sw).' },
          ],
        },
        {
          id: 'consecuencias',
          title: 'Consecuencias del programa almacenado',
          blocks: [
            { type: 'p', text: 'Guardar programa y datos en la misma memoria es una idea poderosa: un programa puede cargar otro programa, un compilador puede generar instrucciones como datos y luego ejecutarlas. Pero tiene dos consecuencias importantes.' },
            { type: 'h', text: 'El cuello de botella de von Neumann' },
            { type: 'p', text: 'Todo, instrucciones y datos, viaja por el mismo canal entre CPU y memoria. En 1978, John Backus llamó a este canal el «cuello de botella de von Neumann» [@backus1978]: el procesador pasa mucho tiempo esperando a que lleguen. Las cachés de la lección 1.8 son la principal respuesta. Muchos procesadores usan cachés separadas para instrucciones y datos cerca del núcleo, una organización llamada «Harvard modificada» [@hennessy2012].' },
            { type: 'h', text: 'Datos que se convierten en código' },
            { type: 'p', text: 'Si para la CPU una instrucción es solo un byte, un error que escribe datos donde hay código, o que hace saltar el PC a una zona de datos, puede hacer que la máquina ejecute algo que nunca debió ejecutarse. Pruébalo en la MiniCPU: añade <code>STORE 2</code> al principio de un programa y verás cómo el programa se sobrescribe a sí mismo. Muchos ataques informáticos explotan esta idea, y los sistemas modernos la mitigan marcando zonas de memoria como no ejecutables.' },
            { type: 'callout', kind: 'preview', title: 'Avance: la QPU no es una CPU de von Neumann', text: 'En los sistemas cuánticos actuales, el programa no se guarda en los qubits ni la QPU busca instrucciones en una memoria propia. Una computadora clásica prepara el circuito cuántico, lo envía a la QPU para que lo ejecute (a menudo muchas veces) y recibe los resultados de las mediciones. La QPU actúa como un coprocesador especializado. Estudiaremos esta arquitectura híbrida en el Módulo 2 y su ingeniería en el Módulo 8.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Aquí ponemos números a las ideas del nivel 1. Cada sección empieza con la idea en pocas palabras y un ejemplo; las demostraciones están en «Para profundizar», por si te interesan. Basta con aritmética.',
      sections: [
        {
          id: 'codificacion',
          title: 'Codificar una instrucción', key: 'Cada instrucción tiene 3 bits para la operación y 5 para la dirección: por eso hay 8 instrucciones y 32 celdas.',
          blocks: [
            { deep: true, type: 'p', text: 'Una instrucción de la MiniCPU con código de operación $o \\in \\{0, \\dots, 7\\}$ y dirección $d \\in \\{0, \\dots, 31\\}$ es el byte:' },
            { deep: true, type: 'math', tex: 'w = o \\cdot 2^5 + d, \\qquad o = \\lfloor w / 2^5 \\rfloor, \\qquad d = w \\bmod 2^5' },
            { type: 'p', text: 'Ejemplo: <code>LOAD 20</code> tiene $o = 1$ y $d = 20$: $w = 32 + 20 = 52 = 00110100_2$. Con 3 bits hay $2^3 = 8$ operaciones posibles, y con 5 bits de dirección, $2^5 = 32$ celdas. Ese límite de 32 bytes es consecuencia directa del formato: con instrucciones de 8 bits no se puede direccionar más memoria sin cambiar el diseño.' },
          ],
        },
        {
          id: 'traza',
          title: 'La ejecución como secuencia de estados', key: 'Ejecutar un programa es avanzar de un estado (PC, ACC y memoria) al siguiente, una instrucción cada vez.',
          blocks: [
            { deep: true, type: 'p', text: 'El estado de la MiniCPU es la tupla $(\\text{PC}, \\text{ACC}, M)$, donde $M$ es el contenido de la memoria. Cada instrucción es una función que transforma un estado en el siguiente. Para <code>ADD d</code>:' },
            { deep: true, type: 'math', tex: '(\\text{PC}, \\text{ACC}, M) \\;\\mapsto\\; \\big(\\text{PC} + 1,\\; (\\text{ACC} + M[d]) \\bmod 256,\\; M\\big)' },
            { type: 'p', text: 'Traza del programa «cuenta atrás» con $M[20] = 3$ y $M[21] = 1$ (los saltos cambian el PC):' },
            { type: 'table', head: ['Paso', 'PC', 'Instrucción', 'ACC después', 'Salida'], mono: [1, 2, 3, 4], rows: [
              ['1', '0', 'LOAD 20', '3', ''], ['2', '1', 'OUT', '3', '3'], ['3', '2', 'SUB 21', '2', ''], ['4', '3', 'JZ 5', '2', '(no salta)'], ['5', '4', 'JMP 1', '2', ''],
              ['6', '1', 'OUT', '2', '2'], ['7', '2', 'SUB 21', '1', ''], ['8', '3', 'JZ 5', '1', ''], ['9', '4', 'JMP 1', '1', ''],
              ['10', '1', 'OUT', '1', '1'], ['11', '2', 'SUB 21', '0', ''], ['12', '3', 'JZ 5', '0', '(salta a 5)'], ['13', '5', 'OUT', '0', '0'], ['14', '6', 'HALT', '0', ''],
            ], caption: '14 instrucciones ejecutadas y salida 3, 2, 1, 0, igual que en el simulador y en el programa Python del nivel 3.' },
            { type: 'p', text: 'El número de instrucciones ejecutadas depende de los datos: con $n$ en lugar de 3 se ejecutan $4n + 2$ instrucciones. Es una primera estimación del coste de un programa, la idea que formalizaremos en la lección 1.11.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Implementamos la MiniCPU completa en Python: el ciclo de instrucción es un bucle con un if por instrucción.',
      sections: [
        {
          id: 'python-cpu',
          title: 'Una CPU en menos de 50 líneas de Python',
          blocks: [
            { type: 'code', lang: 'python', file: 'minicpu.py', code: `NOMBRES = ["HALT", "LOAD", "STORE", "ADD", "SUB", "JMP", "JZ", "OUT"]


def ins(nombre, direccion=0):
    return NOMBRES.index(nombre) << 5 | direccion


def ejecutar(programa, datos, max_ciclos=1000):
    memoria = [0] * 32
    for i, palabra in enumerate(programa):
        memoria[i] = palabra
    for direccion, valor in datos.items():
        memoria[direccion] = valor
    pc, acc, salida = 0, 0, []
    for ciclo in range(max_ciclos):
        ir = memoria[pc]                          # 1. búsqueda (fetch)
        pc = (pc + 1) % 32
        op, d = ir >> 5, ir & 0b11111             # 2. decodificación
        if op == 0:                               # 3. ejecución
            break
        elif op == 1:
            acc = memoria[d]
        elif op == 2:
            memoria[d] = acc
        elif op == 3:
            acc = (acc + memoria[d]) % 256
        elif op == 4:
            acc = (acc - memoria[d]) % 256
        elif op == 5:
            pc = d
        elif op == 6 and acc == 0:
            pc = d
        elif op == 7:
            salida.append(acc)
    return salida, ciclo + 1


suma = [ins("LOAD", 20), ins("ADD", 21), ins("STORE", 22), ins("OUT"), ins("HALT")]
print([format(p, "08b") for p in suma])
print(ejecutar(suma, {20: 5, 21: 7}))

cuenta_atras = [ins("LOAD", 20), ins("OUT"), ins("SUB", 21), ins("JZ", 5),
                ins("JMP", 1), ins("OUT"), ins("HALT")]
print(ejecutar(cuenta_atras, {20: 3, 21: 1}))`,
            output: `['00110100', '01110101', '01010110', '11100000', '00000000']
([12], 5)
([3, 2, 1, 0], 14)` },
            { type: 'list', items: [
              '<b><code>ins</code></b>: el ensamblador mínimo; desplaza el código 5 bits (<code>&lt;&lt; 5</code>) y combina la dirección con OR.',
              '<b>Búsqueda:</b> <code>ir = memoria[pc]</code> e incremento del PC (módulo 32, porque solo hay 32 direcciones).',
              '<b>Decodificación:</b> <code>ir &gt;&gt; 5</code> extrae los 3 bits altos, y <code>ir &amp; 0b11111</code>, los 5 bajos.',
              '<b>Ejecución:</b> una rama por instrucción. Los saltos solo cambian el PC.',
              '<b><code>max_ciclos</code></b> evita que un programa con un bucle infinito cuelgue el intérprete: el problema de saber si un programa terminará aparecerá en la lección 1.11.',
              'Este programa es, en sí mismo, un <em>emulador</em>: un programa que se comporta como otra máquina. Los simuladores cuánticos que usaremos son, en esencia, emuladores de una QPU ideal.',
            ] },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«La CPU entiende Python, Java o C».', reality: 'La CPU solo ejecuta instrucciones de su ISA, en lenguaje máquina. Los programas de alto nivel deben traducirse (compilarse) o interpretarse por otro programa, como veremos en la lección 1.10.' },
    { myth: '«Un bucle necesita una instrucción especial de bucle».', reality: 'Basta con saltos: uno condicional para salir y otro incondicional para volver al principio. Todas las estructuras de control (if, while, for) se compilan así.' },
    { myth: '«Instrucciones y datos son cosas físicamente distintas».', reality: 'En una arquitectura de von Neumann, ambos son bytes en la misma memoria. Lo que convierte un byte en instrucción es que el PC apunte a él.' },
    { myth: '«Una computadora cuántica es una CPU de von Neumann con qubits en lugar de bits».', reality: 'Las QPU actuales funcionan como coprocesadores: ejecutan circuitos preparados y enviados por una computadora clásica, que también procesa los resultados.' },
  ],

  summary: [
    'Arquitectura de von Neumann: programa y datos en la misma memoria; la CPU los lee y ejecuta [@vonneumann1993].',
    'Una ISA define las instrucciones que entiende la CPU; el ensamblador es su notación legible.',
    'Ciclo de instrucción: búsqueda (PC → IR, PC + 1), decodificación y ejecución; los saltos modifican el PC.',
    'Bucles y condiciones se construyen con saltos condicionales e incondicionales.',
    'El canal CPU-memoria limita el rendimiento (cuello de botella de von Neumann [@backus1978]), y mezclar código y datos tiene implicaciones de seguridad.',
  ],

  exercises: [
    { level: 'comprender', question: 'Decodifica la palabra <code>10110101</code> de la MiniCPU.', answer: 'Código $101_2 = 5$ (JMP), dirección $10101_2 = 21$: <code>JMP 21</code>.' },
    { level: 'comprender', question: 'Escribe en el simulador un programa que muestre la suma 10 + 20 + 30 usando tres datos en las direcciones 20, 21 y 22.', answer: '<pre><code class="language-plaintext">LOAD 20\nADD 21\nADD 22\nOUT\nHALT\n20: 10\n21: 20\n22: 30</code></pre>La salida es 60.' },
    { level: 'matematico', question: 'Si la MiniCPU tuviera instrucciones de 12 bits con 4 bits de código de operación, ¿cuántas operaciones y cuántas direcciones podría tener?', answer: '$2^4 = 16$ operaciones y $2^{12-4} = 2^8 = 256$ direcciones.' },
    { level: 'matematico', question: '¿Cuántas instrucciones ejecuta el programa «cuenta atrás» si $M[20] = n \\ge 1$?', answer: 'El bucle (OUT, SUB, JZ, JMP) se ejecuta completo $n - 1$ veces, y en la última pasada se ejecutan OUT, SUB y JZ (que salta). Más LOAD al principio y OUT y HALT al final: $1 + 4(n-1) + 3 + 2 = 4n + 2$. Para $n = 3$, 14.' },
    { level: 'implementar', question: 'Añade al intérprete de Python una instrucción nueva <code>JN d</code> («salta si el bit de signo del ACC es 1», es decir, si ACC ≥ 128). ¿Qué código de operación usarías, si los 8 están ocupados?', answer: 'No hay códigos libres con 3 bits: habría que sustituir una instrucción, o bien ampliar el código de operación (por ejemplo, a 4 bits), lo que reduciría las direcciones a $2^4 = 16$ con palabras de 8 bits. Diseñar una ISA es repartir bits entre operaciones y operandos. Si se sustituyera STORE por JN, la rama sería <code>elif op == 2 and acc &gt;= 128: pc = d</code>.' },
  ],

  references: [
    { key: 'vonneumann1993', use: 'Programa almacenado y organización de la computadora.' },
    { key: 'patterson2021', use: 'ISA, ciclo de instrucción, lenguaje máquina y ensamblador; RISC-V.' },
    { key: 'riscv-spec', use: 'ISA real y abierta usada como comparación.' },
    { key: 'backus1978', use: 'Cuello de botella de von Neumann.' },
    { key: 'hennessy2012', use: 'Cachés separadas de instrucciones y datos (Harvard modificada).' },
  ],

  related: ['procesador-memoria', 'ejecucion-programas', 'qpu-computacion-hibrida', 'arquitecturas-hibridas'],
  next: 'ejecucion-programas',
};
