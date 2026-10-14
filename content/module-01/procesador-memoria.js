// Lección 1.8 — ¿Qué hace un procesador? CPU y memoria
// Salidas de código obtenidas con CPython 3.14 en un Mac con procesador ARM
// (little-endian), 2026-10-14. La simulación de caché coincide con tests/module1.test.js.

export default {
  id: 'procesador-memoria',
  title: '¿Qué hace un procesador? CPU y memoria',
  lede: 'Con sumadores, multiplexores y circuitos que guardan bits ya podemos ensamblar las dos piezas centrales de una computadora: el procesador, que transforma datos, y la memoria, que los guarda. Esta lección explica cómo se organizan y por qué la memoria, más que el procesador, suele marcar la velocidad de un programa.',
  updated: '2026-10-14',

  context: {
    learn: 'Las partes de una CPU (ALU, registros, unidad de control, reloj), la memoria direccionable por bytes, el orden de los bytes (endianness), la jerarquía de memoria y el funcionamiento de las cachés y la localidad.',
    why: 'Para escribir programas eficientes, también en simuladores cuánticos que manejan vectores enormes, hay que entender cómo viajan los datos entre memoria y procesador. Además, la arquitectura de un sistema híbrido clásico-cuántico reproduce a mayor escala esta misma separación entre quien calcula y dónde se guardan los datos.',
    previous: 'En [[>circuitos-logicos|la lección 1.7]] construimos sumadores (la base de la ALU) y vimos que los circuitos con realimentación guardan bits (la base de los registros).',
    next: 'La lección 1.9 explica cómo la CPU ejecuta un programa almacenado en esta memoria, con un procesador simulado paso a paso.',
  },

  objectives: [
    'Identificar las partes de una CPU y la función de cada una.',
    'Explicar qué es una dirección de memoria y calcular cuánta memoria pueden direccionar n bits.',
    'Interpretar el orden de los bytes (big-endian y little-endian) de un entero en memoria.',
    'Explicar la jerarquía de memoria y el principio de localidad, y predecir qué recorridos aprovechan la caché.',
    'Calcular el tiempo medio de acceso a memoria (AMAT).',
  ],

  prerequisites: { lessons: ['circuitos-logicos'], knowledge: [] },

  introduction: [
    { type: 'p', text: 'Una computadora, en su forma más esquemática, tiene dos grandes componentes conectados entre sí. La [[cpu|CPU]] (unidad central de procesamiento) transforma datos: suma, compara, decide. La [[memoria]] los guarda: el programa, los números, el texto, las imágenes. Toda la actividad del sistema consiste en traer datos de la memoria, transformarlos y devolverlos.' },
    { type: 'p', text: 'Primero miraremos dentro de la CPU, después dentro de la memoria y, al final, la relación entre ambas, donde se esconde uno de los problemas de rendimiento más importantes de la informática.' },
  ],

  levels: {
    comprender: {
      intro: 'Tres simuladores: los bytes en memoria, la jerarquía de memoria y una caché en funcionamiento.',
      sections: [
        {
          id: 'dentro-cpu',
          title: 'Dentro de la CPU',
          blocks: [
            { type: 'list', items: [
              '<b>[[alu|ALU]]</b> (unidad aritmético-lógica): el circuito que suma, resta, compara y hace operaciones lógicas. Está construida con sumadores y compuertas como los de las lecciones 1.6 y 1.7.',
              '<b>[[registro|Registros]]</b>: unas pocas «casillas» de memoria dentro de la propia CPU, las más rápidas del sistema. La ALU opera sobre ellas.',
              '<b>Unidad de control</b>: decide qué hace la ALU en cada momento, qué registros intervienen y qué dato se lee o escribe en memoria, según la instrucción que se esté ejecutando. Usa multiplexores para dirigir los datos.',
              '<b>Reloj</b>: una señal que oscila miles de millones de veces por segundo y marca el ritmo. Con un reloj de 3 GHz, cada ciclo dura $1/(3 \\times 10^9)$ s, unos 0,33 nanosegundos.',
            ] },
            { type: 'p', text: 'Un procesador actual tiene además varios <em>núcleos</em> (cada uno es, en esencia, una CPU completa), cachés y muchos mecanismos para ejecutar varias instrucciones a la vez [@patterson2021]. Pero las piezas básicas son estas.' },
          ],
        },
        {
          id: 'memoria-bytes',
          title: 'La memoria: una larga fila de bytes',
          blocks: [
            { type: 'p', text: 'La memoria principal se comporta como una larga fila de bytes, cada uno con su número de posición: la <em>dirección</em>. Leer o escribir significa indicar una dirección. Un entero de 32 bits ocupa 4 bytes consecutivos. ¿En qué orden se colocan? Hay dos convenciones:' },
            { type: 'widget', id: 'memory-endianness', caption: 'El mismo número 0x12345678 en memoria. En big-endian, el byte más significativo (12) va en la dirección más baja; en little-endian, el menos significativo (78). El texto, en cambio, es una secuencia de bytes independientes y se guarda igual en ambos casos.' },
            { type: 'p', text: 'La mayoría de los procesadores actuales, como x86-64 y los ARM habituales, son little-endian. El orden de los bytes no importa mientras los datos se quedan en una máquina, pero sí cuando se escriben en un archivo binario o se envían por la red a otra máquina que podría usar la otra convención [@bryant2016]. Es la misma lección de siempre: los bytes necesitan una convención para tener significado.' },
          ],
        },
        {
          id: 'jerarquia',
          title: 'La memoria rápida es pequeña y la grande es lenta',
          blocks: [
            { type: 'p', text: 'Sería ideal tener una memoria enorme, barata y tan rápida como los registros. No existe: las tecnologías rápidas (SRAM) son caras y ocupan mucho espacio en el chip, y las baratas y grandes (DRAM, memoria flash, discos) son mucho más lentas. La solución es una [[jerarquia-de-memoria|jerarquía]] de niveles [@patterson2021]:' },
            { type: 'widget', id: 'memory-hierarchy', caption: 'Activa la «escala humana»: si un acceso a la caché L1 durara un segundo, ir a la RAM costaría alrededor de un minuto, y a un disco magnético, meses. Los valores son órdenes de magnitud representativos, no medidas de un equipo concreto.' },
            { type: 'p', text: 'Para que esta jerarquía funcione, los datos que se usan a menudo deben estar en los niveles rápidos. De eso se encargan las [[cache|cachés]].' },
          ],
        },
        {
          id: 'cache',
          title: 'Cachés y localidad',
          blocks: [
            { type: 'p', text: 'Una caché guarda copias de bloques de memoria usados recientemente. Funciona gracias a que los programas tienden a tener <b>localidad</b> [@patterson2021]:' },
            { type: 'list', items: [
              '<b>Localidad temporal:</b> un dato usado ahora probablemente se usará pronto (una variable dentro de un bucle).',
              '<b>Localidad espacial:</b> si se usa una dirección, probablemente se usarán las cercanas (los elementos siguientes de un arreglo). Por eso la caché trae bloques enteros de bytes contiguos, no bytes sueltos.',
            ] },
            { type: 'p', text: 'Veámoslo con una matriz de enteros guardada fila tras fila, como hacen C y NumPy por defecto. Recorrerla por filas o por columnas hace exactamente el mismo cálculo, pero no con la misma eficiencia:' },
            { type: 'widget', id: 'cache-sim', caption: 'Reproduce el recorrido por filas y luego por columnas. Verde: acierto (el dato ya estaba en la caché). Rojo: fallo (hay que ir a memoria). Por filas, cada fallo trae un bloque con los siguientes elementos; por columnas, cada acceso salta a otro bloque y expulsa los anteriores antes de reutilizarlos.' },
            { type: 'callout', kind: 'model', status: 'simplificacion', text: 'Es una caché de correspondencia directa minúscula, elegida para que se vea el efecto. Las cachés reales son mucho mayores y asociativas, tienen varios niveles y se combinan con mecanismos de precarga. Pero el principio se mantiene: los recorridos con buena localidad espacial son mucho más rápidos [@hennessy2012].' },
            { type: 'callout', kind: 'preview', title: 'Avance: simuladores cuánticos', text: 'Un simulador de vector de estado manipula arreglos de $2^n$ números complejos (lección 1.2). Muchas operaciones recorren ese arreglo con saltos de tamaño $2^k$, y su rendimiento depende de cómo aprovechan la caché y la memoria. La ingeniería de software cuántico también es ingeniería de rendimiento clásica.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Espacio de direcciones, descomposición de una dirección en una caché y tiempo medio de acceso.',
      sections: [
        {
          id: 'direcciones',
          title: 'Cuánta memoria se puede direccionar',
          blocks: [
            { type: 'p', text: 'Si las direcciones tienen $a$ bits y cada dirección corresponde a un byte, hay $2^a$ bytes direccionables (el mismo conteo de patrones de la lección 1.1):' },
            { type: 'math', tex: 'a = 32 \\Rightarrow 2^{32} \\text{ B} = 4 \\text{ GiB}, \\qquad a = 64 \\Rightarrow 2^{64} \\text{ B} = 16 \\text{ EiB}', note: '1 GiB = $2^{30}$ bytes; 1 EiB = $2^{60}$ bytes. Por eso los sistemas de 32 bits no podían usar más de 4 GiB de memoria por proceso de forma directa.' },
          ],
        },
        {
          id: 'direccion-cache',
          title: 'Cómo localiza un dato una caché de correspondencia directa',
          blocks: [
            { type: 'p', text: 'Con bloques de $B$ bytes y $L$ líneas, la dirección $d$ se descompone en:' },
            { type: 'math', tex: '\\text{bloque} = \\lfloor d / B \\rfloor, \\qquad \\text{línea} = \\text{bloque} \\bmod L, \\qquad \\text{etiqueta} = \\lfloor \\text{bloque} / L \\rfloor' },
            { type: 'p', text: 'La línea indica dónde buscar; la etiqueta, guardada junto al bloque, permite saber si el bloque que hay en esa línea es el buscado. Ejemplo con $B = 16$ y $L = 4$, para la dirección 100:' },
            { type: 'steps', items: [
              { tex: '\\text{bloque} = \\lfloor 100 / 16 \\rfloor = 6' },
              { tex: '\\text{línea} = 6 \\bmod 4 = 2, \\qquad \\text{etiqueta} = \\lfloor 6 / 4 \\rfloor = 1' },
              { text: 'Si la línea 2 contiene la etiqueta 1, es un acierto. Si no, es un fallo y se trae el bloque 6 (bytes 96–111).' },
            ] },
            { type: 'p', text: 'En el recorrido por columnas del simulador (filas de 32 bytes), los elementos de una columna están en direcciones separadas 32 bytes: bloques 0, 2, 4, 6…, que con 4 líneas caen alternativamente en las líneas 0 y 2 y se expulsan unos a otros antes de reutilizarse. De ahí el 0 % de aciertos.' },
          ],
        },
        {
          id: 'amat',
          title: 'Tiempo medio de acceso a memoria',
          blocks: [
            { type: 'p', text: 'Si un acierto cuesta $t_h$, la tasa de fallos es $m$ y cada fallo añade una penalización $t_p$, el tiempo medio de acceso es [@patterson2021]:' },
            { type: 'math', tex: '\\text{AMAT} = t_h + m \\cdot t_p' },
            { type: 'p', text: 'Ejemplo ilustrativo: con $t_h = 1$ ns y $t_p = 60$ ns, el recorrido por filas ($m = 0{,}25$) da $1 + 0{,}25 \\cdot 60 = 16$ ns, y el recorrido por columnas ($m = 1$), $1 + 60 = 61$ ns, casi cuatro veces más para el mismo cálculo.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Orden de los bytes y simulación de la caché en Python.',
      sections: [
        {
          id: 'python-endianness',
          title: 'Orden de los bytes en Python',
          blocks: [
            { type: 'code', lang: 'python', file: 'endianness.py', code: `import sys

n = 0x12345678
print(n.to_bytes(4, "big").hex(" "))
print(n.to_bytes(4, "little").hex(" "))
print(sys.byteorder)
print(int.from_bytes(bytes([0x78, 0x56, 0x34, 0x12]), "little") == n)`,
            output: `12 34 56 78
78 56 34 12
little
True`, note: '<code>sys.byteorder</code> depende de la máquina: el resultado <code>little</code> se obtuvo en un Mac con procesador ARM. En la mayoría de los equipos actuales también será <code>little</code>.' },
            { type: 'p', text: 'Al guardar datos binarios para otra máquina, hay que fijar explícitamente el orden (<code>"big"</code> o <code>"little"</code>) en lugar de depender del de la máquina que escribe.' },
          ],
        },
        {
          id: 'python-cache',
          title: 'Simular la caché',
          blocks: [
            { type: 'code', lang: 'python', file: 'cache.py', code: `def tasa_aciertos(direcciones, lineas=4, bloque=16):
    etiquetas = [None] * lineas
    aciertos = 0
    for d in direcciones:
        numero_bloque = d // bloque
        linea = numero_bloque % lineas
        etiqueta = numero_bloque // lineas
        if etiquetas[linea] == etiqueta:
            aciertos += 1
        else:
            etiquetas[linea] = etiqueta  # fallo: se trae el bloque
    return aciertos / len(direcciones)


FILAS, COLUMNAS, TAM = 8, 8, 4  # matriz 8×8 de enteros de 4 bytes, por filas
por_filas = [(i * COLUMNAS + j) * TAM for i in range(FILAS) for j in range(COLUMNAS)]
por_columnas = [(i * COLUMNAS + j) * TAM for j in range(COLUMNAS) for i in range(FILAS)]
print(f"por filas:    {tasa_aciertos(por_filas):.0%}")
print(f"por columnas: {tasa_aciertos(por_columnas):.0%}")`,
            output: `por filas:    75%
por columnas: 0%` },
            { type: 'p', text: 'Es la fórmula del nivel 2 en código. Prueba a cambiar <code>lineas</code> a 8 o 16: con una caché suficientemente grande para guardar toda la matriz, el recorrido por columnas también empieza a acertar.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Un procesador más rápido hace siempre más rápido el programa».', reality: 'Muchos programas pasan la mayor parte del tiempo esperando datos de la memoria. Mejorar la localidad de los accesos puede acelerar más que un procesador más rápido.' },
    { myth: '«Recorrer una matriz por filas o por columnas da igual: son las mismas operaciones».', reality: 'El número de operaciones es el mismo, pero el número de fallos de caché puede ser muy distinto. El orden de recorrido debe seguir el orden en que la matriz está guardada.' },
    { myth: '«La RAM es la memoria más rápida de la computadora».', reality: 'Los registros y las cachés son mucho más rápidos. La RAM está en medio de la jerarquía: muy rápida comparada con un disco y muy lenta comparada con la caché L1.' },
    { myth: '«El orden de los bytes afecta también al texto UTF-8».', reality: 'UTF-8 es una secuencia de bytes individuales y se escribe igual en cualquier máquina. El orden de los bytes afecta a valores de varios bytes leídos como una unidad, como un entero de 32 bits o una unidad UTF-16.' },
  ],

  summary: [
    'La CPU tiene ALU, registros, unidad de control y reloj; la memoria es una fila de bytes con direcciones.',
    'Con $a$ bits de dirección se direccionan $2^a$ bytes.',
    'Big-endian y little-endian difieren en el orden de los bytes de un valor de varios bytes; la mayoría de las CPU actuales son little-endian.',
    'La jerarquía de memoria combina niveles pequeños y rápidos con niveles grandes y lentos; las cachés explotan la localidad temporal y espacial.',
    'AMAT = $t_h + m \\cdot t_p$: la tasa de fallos puede dominar el rendimiento.',
  ],

  exercises: [
    { level: 'comprender', question: '¿Cómo se guarda el entero de 16 bits 0x0102 en little-endian a partir de la dirección 0x2000?', answer: 'En 0x2000 va 02 (el byte menos significativo) y en 0x2001, 01.' },
    { level: 'comprender', question: 'En el simulador de caché, ¿qué tamaño de bloque da más aciertos en el recorrido por filas? ¿Por qué?', answer: 'Bloques de 32 bytes: cada fallo trae 8 enteros contiguos y los 7 siguientes accesos aciertan (87,5 %). Con bloques más grandes se aprovecha mejor la localidad espacial, aunque en cachés reales los bloques muy grandes tienen otros costes.' },
    { level: 'matematico', question: '¿Cuántos bits de dirección hacen falta para 16 GiB de memoria direccionable por bytes?', answer: '$16 \\text{ GiB} = 2^4 \\cdot 2^{30} = 2^{34}$ bytes: 34 bits.' },
    { level: 'matematico', question: 'Con $t_h = 1$ ns y $t_p = 100$ ns, ¿qué tasa de fallos da un AMAT de 3 ns?', answer: '$3 = 1 + m \\cdot 100 \\Rightarrow m = 0{,}02$: solo un 2 % de fallos ya triplica el tiempo de un acierto.' },
    { level: 'implementar', question: 'Modifica <code>cache.py</code> para recorrer una matriz de 16×16 y compara las tasas de aciertos con 4 y 64 líneas.', answer: 'Por filas, la tasa es 75 % con bloques de 16 bytes en ambos casos. Por columnas, con 4 líneas es 0 %; con 64 líneas (1 KiB, toda la matriz) solo fallan los primeros accesos a cada bloque y se obtiene 75 %, porque los bloques ya no se expulsan antes de reutilizarse.' },
  ],

  references: [
    { key: 'patterson2021', use: 'Componentes de la CPU, jerarquía de memoria, localidad, cachés y AMAT.' },
    { key: 'hennessy2012', use: 'Organización real de las cachés y la jerarquía de memoria.' },
    { key: 'bryant2016', use: 'Direccionamiento por bytes y orden de los bytes (endianness).' },
  ],

  related: ['circuitos-logicos', 'von-neumann', 'ejecucion-programas', 'statevector-operadores'],
  next: 'von-neumann',
};
