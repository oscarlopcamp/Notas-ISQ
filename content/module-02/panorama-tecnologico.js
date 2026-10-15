// Lección 2.6 — Panorama tecnológico
// Salida de código obtenida con CPython 3.14 (2026-10-14). El modelo de éxito
// de un circuito se comprueba en tests/module2.test.js.
// Política: descripciones cualitativas y citadas; se evitan cifras de equipos
// concretos, que cambian cada pocos meses.

export default {
  id: 'panorama-tecnologico',
  title: 'Panorama tecnológico',
  lede: 'Hay varias formas de construir un qubit, y ninguna ha ganado todavía. Esta lección presenta las principales tecnologías, explica por qué el número de qubits dice poco por sí solo y da criterios para leer anuncios y hojas de ruta sin dejarse llevar.',
  updated: '2026-10-14',

  context: {
    learn: 'Qué necesita una tecnología para servir como computadora cuántica, las principales familias de qubits con sus puntos fuertes y sus retos, las métricas que importan además del número de qubits y cómo leer anuncios con criterio.',
    why: 'Como ingeniero elegirás equipos, interpretarás resultados y evaluarás proveedores. Las cifras de marketing (sobre todo el número de qubits) pueden engañar si no se leen junto con la calidad de las operaciones.',
    previous: 'En [[>qpu-computacion-hibrida|la lección 2.5]] vimos la arquitectura de un sistema cuántico; aquí miramos dentro de la QPU. En [[>representacion-informacion|la 1.1]], cómo un bit clásico es una abstracción de un sistema físico.',
    next: 'Con esta lección termina el Módulo 2. El Módulo 3 explica qué es un qubit y cómo se opera con él, con independencia de la tecnología.',
  },

  objectives: [
    'Enumerar los requisitos básicos de una tecnología de computación cuántica.',
    'Describir cualitativamente cinco familias de qubits, sus puntos fuertes y sus retos.',
    'Explicar por qué la tasa de error importa tanto como el número de qubits.',
    'Aplicar preguntas críticas a anuncios y hojas de ruta.',
  ],

  prerequisites: { lessons: ['qpu-computacion-hibrida'], knowledge: [] },

  introduction: [
    { type: 'p', text: 'Un bit clásico es una abstracción: da igual si es un voltaje, una carga o una zona magnetizada (lección 1.1). Con los qubits ocurre lo mismo, y hoy compiten varias formas físicas de construirlos. Ninguna es la mejor en todo: cada una cambia unas dificultades por otras.' },
    { type: 'callout', kind: 'note', title: 'Por qué esta lección casi no tiene cifras', text: 'El número de qubits, las tasas de error y los récords cambian cada pocos meses. Aquí se describe lo que caracteriza a cada tecnología a largo plazo, con fuentes de revisión. Para las cifras actuales, consulta la documentación de cada proveedor y los artículos más recientes.' },
  ],

  levels: {
    comprender: {
      intro: 'Requisitos, tecnologías, métricas y lectura crítica de anuncios.',
      sections: [
        {
          id: 'requisitos',
          title: 'Qué necesita una computadora cuántica',
          blocks: [
            { type: 'p', text: 'En 2000, David DiVincenzo formuló los requisitos que debe cumplir un sistema físico para servir como computadora cuántica [@divincenzo2000]. Dichos en lenguaje de ingeniero:' },
            { type: 'list', ordered: true, items: [
              '<b>Qubits bien definidos y escalables:</b> poder añadir más sin que todo empeore.',
              '<b>Inicialización:</b> poner todos los qubits en un estado de partida conocido.',
              '<b>Coherencia suficiente:</b> que los qubits conserven su estado durante más tiempo del que duran las operaciones.',
              '<b>Un conjunto universal de operaciones:</b> unas pocas operaciones con las que construir cualquier programa (como NAND en la lógica clásica, lección 1.6).',
              '<b>Medición:</b> poder leer cada qubit al final.',
            ] },
            { type: 'p', text: 'Todas las tecnologías cumplen estos requisitos a pequeña escala. La diferencia está en lo bien que lo hacen y en cuánto les cuesta crecer.' },
          ],
        },
        {
          id: 'tecnologias',
          title: 'Las principales tecnologías',
          blocks: [
            { type: 'p', text: 'Explora las cinco familias más estudiadas y pon a prueba lo que has leído [@ladd2010]:' },
            { type: 'widget', id: 'technology-explorer', caption: 'Descripción cualitativa de cada tecnología, basada en artículos de revisión. Los puntos fuertes y los retos son relativos: todas avanzan rápido.' },
            { type: 'p', text: 'Hay otras propuestas en investigación, como los qubits topológicos, que protegerían la información gracias a sus propiedades físicas. Trátalas como investigación abierta mientras no haya demostraciones aceptadas por la comunidad.' },
            { type: 'callout', kind: 'note', status: 'abierto', title: '¿Cuál ganará?', text: 'Nadie lo sabe. Es posible que no gane ninguna en solitario: unas tecnologías pueden servir para calcular y otras, como la fotónica, para comunicar qubits entre equipos.' },
          ],
        },
        {
          id: 'metricas',
          title: 'Más qubits no siempre es mejor',
          blocks: [
            { type: 'p', text: 'El número de qubits es la cifra más anunciada, pero un procesador también se describe con:' },
            { type: 'table', head: ['Métrica', 'Qué mide', 'Por qué importa'], rows: [
              ['[[tasa-de-error|Tasa de error]] de las operaciones', 'Con qué frecuencia falla una operación (sobre todo las de dos qubits)', 'Limita cuántas operaciones caben en un circuito antes de que el resultado sea ruido'],
              ['Coherencia', 'Cuánto tiempo conserva un qubit su estado', 'Todo el circuito debe ejecutarse antes de que se pierda'],
              ['Conectividad', 'Qué pares de qubits pueden interactuar directamente', 'Si no están conectados, el compilador añade operaciones extra (lección 2.5)'],
              ['Error de medición', 'Con qué frecuencia se lee mal un qubit', 'Contamina directamente los resultados'],
              ['[[volumen-cuantico|Volumen cuántico]]', 'El tamaño del mayor programa de prueba que el equipo ejecuta con éxito', 'Resume en un número qubits, errores, conectividad y compilador [@cross2019]'],
            ] },
            { type: 'p', text: 'Compruébalo con tres procesadores ficticios. Elige el tamaño del circuito y observa cuál lo ejecuta mejor:' },
            { type: 'widget', id: 'qubit-metrics', caption: 'Con circuitos pequeños gana el procesador con menos errores, aunque tenga pocos qubits. El de 1000 qubits solo es el único posible cuando el circuito no cabe en los demás, y entonces su resultado suele ser ruido.' },
            { type: 'callout', kind: 'model', status: 'simplificacion', text: 'El simulador supone que los errores de cada operación son independientes y que el circuito solo acierta si todas salen bien. Los errores reales están correlacionados, algunos no afectan al resultado y existen técnicas de mitigación. El modelo sirve para entender el orden de magnitud.' },
          ],
        },
        {
          id: 'leer-anuncios',
          title: 'Cómo leer anuncios y hojas de ruta',
          blocks: [
            { type: 'p', text: 'Las empresas publican hojas de ruta con metas a varios años, y la prensa se hace eco de cada récord. Cuatro preguntas ayudan a separar el resultado de la promesa:' },
            { type: 'list', items: [
              '<b>¿Es un resultado o una meta?</b> Una hoja de ruta es una propuesta; un artículo revisado por pares con datos es un resultado.',
              '<b>¿Qué calidad tienen los qubits?</b> Sin tasas de error, el número de qubits dice poco.',
              '<b>¿Frente a qué se compara?</b> Las ventajas se miden frente al mejor método clásico conocido, que puede mejorar [@pan2022].',
              '<b>¿Sirve para algo útil?</b> Muchas demostraciones usan tareas elegidas por ser difíciles para una computadora clásica, no por ser útiles (lección 2.2).',
            ] },
            { type: 'widget', id: 'headline-check', caption: 'Titulares ficticios. Para cada uno, elige la pregunta que más conviene hacer.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Una cuenta sencilla explica por qué la tasa de error importa tanto: basta con multiplicar probabilidades.',
      sections: [
        {
          id: 'exito-circuito',
          title: 'Cuántas operaciones aguanta un circuito',
          key: 'Si cada operación falla con probabilidad «error», un circuito aguanta del orden de 1/error operaciones. Con un error del 1 %, unas 100; con un 0,1 %, unas 1000.',
          blocks: [
            { type: 'p', text: 'Si cada operación sale bien con probabilidad $1 - \\varepsilon$ y los fallos son independientes, la probabilidad de que salgan bien las $G$ operaciones del circuito es:' },
            { type: 'math', tex: 'P(\\text{éxito}) \\approx (1 - \\varepsilon)^{G}' },
            { type: 'p', text: 'Ejemplo: con $\\varepsilon = 0{,}01$ (1 %) y $G = 100$ operaciones, $0{,}99^{100} \\approx 0{,}37$. Con $G = 1000$, $0{,}99^{1000} \\approx 0{,}00004$: el resultado es ruido. Mejorar el error diez veces permite circuitos diez veces más largos.' },
            { deep: true, type: 'p', text: 'Por qué aparece siempre $0{,}37$: cuando $\\varepsilon$ es pequeño, $(1-\\varepsilon)^G \\approx e^{-\\varepsilon G}$. Con $G = 1/\\varepsilon$ operaciones, la probabilidad de éxito es $e^{-1} \\approx 0{,}37$. Por eso $1/\\varepsilon$ es una buena medida del «presupuesto» de operaciones de un procesador sin corrección de errores.' },
            { deep: true, type: 'p', text: 'El volumen cuántico se define como $V_Q = 2^n$, donde $n$ es el mayor tamaño para el que el equipo ejecuta con éxito circuitos aleatorios de $n$ qubits y $n$ capas [@cross2019]. Un circuito de $n \\times n$ tiene del orden de $n^2$ operaciones, así que, según la cuenta anterior, $n$ queda limitado aproximadamente a $1/\\sqrt{\\varepsilon}$, por muchos qubits que tenga el equipo.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'La cuenta del nivel 2 en Python, para varias tasas de error y tamaños de circuito.',
      sections: [
        {
          id: 'python-exito',
          title: 'Probabilidad de éxito de un circuito',
          blocks: [
            { type: 'code', lang: 'python', file: 'exito.py', code: `for error in [0.01, 0.001, 0.0001]:          # probabilidad de fallo de cada operación
    for operaciones in [100, 1_000, 10_000]:
        exito = (1 - error) ** operaciones   # todas tienen que salir bien
        print(f"error {error}, {operaciones:>6} operaciones: éxito ≈ {exito:.2g}")`,
            output: `error 0.01,    100 operaciones: éxito ≈ 0.37
error 0.01,   1000 operaciones: éxito ≈ 4.3e-05
error 0.01,  10000 operaciones: éxito ≈ 2.2e-44
error 0.001,    100 operaciones: éxito ≈ 0.9
error 0.001,   1000 operaciones: éxito ≈ 0.37
error 0.001,  10000 operaciones: éxito ≈ 4.5e-05
error 0.0001,    100 operaciones: éxito ≈ 0.99
error 0.0001,   1000 operaciones: éxito ≈ 0.9
error 0.0001,  10000 operaciones: éxito ≈ 0.37` },
            { type: 'p', text: 'Fíjate en la diagonal: siempre que el número de operaciones es 1/error, el éxito ronda el 37 %. Cada mejora de diez veces en el error permite circuitos diez veces más largos.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«El procesador con más qubits es el más potente».', reality: 'Sin operaciones fiables, los qubits extra no se pueden aprovechar: el circuito se vuelve ruido antes de usarlos.' },
    { myth: '«Ya se sabe qué tecnología ganará».', reality: 'Varias tecnologías avanzan en paralelo, cada una con sus ventajas y sus retos [@ladd2010].' },
    { myth: '«Una hoja de ruta es un calendario seguro».', reality: 'Es una propuesta. Conviene compararla con los resultados publicados y verificados.' },
    { myth: '«Las computadoras cuánticas siempre funcionan a temperaturas cercanas al cero absoluto».', reality: 'Los qubits superconductores y los de espín, sí. Los iones y los átomos neutros se aíslan en vacío y se enfrían con láseres, sin un refrigerador de dilución; los fotones apenas necesitan aislamiento, aunque algunos detectores sí requieren frío.' },
  ],

  summary: [
    'Una tecnología de computación cuántica necesita qubits escalables, inicialización, coherencia, un conjunto universal de operaciones y medición [@divincenzo2000].',
    'Superconductores, iones, átomos neutros, fotones y espines en semiconductores son las familias principales; ninguna domina en todo [@ladd2010].',
    'La tasa de error importa tanto como el número de qubits: un circuito aguanta del orden de 1/error operaciones.',
    'El volumen cuántico resume en un número la capacidad de ejecutar circuitos [@cross2019].',
    'Ante un anuncio: ¿resultado o meta?, ¿qué calidad?, ¿frente a qué?, ¿para qué sirve?',
  ],

  exercises: [
    { level: 'comprender', question: 'Un proveedor ofrece un procesador de 500 qubits con un 2 % de error por operación entre dos qubits; otro, uno de 60 qubits con un 0,2 %. Tu circuito usa 40 qubits y unas 400 operaciones entre dos qubits. ¿Cuál eliges?', answer: 'El de 60 qubits: el circuito cabe y su éxito ronda $0{,}998^{400} \\approx 0{,}45$. En el de 500 qubits sería $0{,}98^{400} \\approx 0{,}0003$, es decir, ruido.' },
    { level: 'comprender', question: '¿Por qué los fotones son buenos para comunicar información cuántica, pero difíciles para hacer operaciones entre dos qubits?', answer: 'Por la misma razón: interactúan muy poco con su entorno y entre sí. Eso los protege del ruido mientras viajan, pero dificulta que dos fotones se influyan mutuamente, que es lo que necesita una operación entre dos qubits [@slussarenko2019; @kok2007].' },
    { level: 'matematico', question: 'Un procesador tiene un error por operación de 0,5 %. ¿Cuántas operaciones puede tener un circuito antes de que la probabilidad de éxito baje a un 37 %?', answer: 'Unas $1/0{,}005 = 200$ operaciones.' },
    { level: 'implementar', question: 'Escribe un programa que calcule cuántas operaciones puede tener un circuito para que su éxito sea al menos del 50 %, con un error de 0,001.', answer: '<pre><code class="language-python">error = 0.001\noperaciones = 0\nwhile (1 - error) ** (operaciones + 1) &gt;= 0.5:\n    operaciones += 1\nprint(operaciones)</code></pre>Imprime <code>692</code>. Coincide con $\\ln 2 / \\varepsilon \\approx 693$.' },
  ],

  references: [
    { key: 'divincenzo2000', use: 'Requisitos de una implementación física.' },
    { key: 'ladd2010', use: 'Panorama de tecnologías.' },
    { key: 'kjaergaard2020', use: 'Qubits superconductores.' },
    { key: 'bruzewicz2019', use: 'Iones atrapados.' },
    { key: 'henriet2020', use: 'Átomos neutros.' },
    { key: 'slussarenko2019', use: 'Fotónica.' },
    { key: 'kok2007', use: 'Operaciones probabilísticas con óptica lineal.' },
    { key: 'burkard2023', use: 'Espines en semiconductores.' },
    { key: 'cross2019', use: 'Volumen cuántico.' },
    { key: 'google2025', use: 'Protección contra errores que supera a un qubit sin proteger (titulares).' },
    { key: 'arute2019', use: 'Estimación de ventaja de 2019 (titulares).' },
    { key: 'pan2022', use: 'La estimación clásica se rebajó (titulares).' },
  ],

  related: ['qpu-computacion-hibrida', 'que-es-computacion-cuantica', 'historia-computacion-cuantica', 'el-qubit'],
  next: 'el-qubit',
};
