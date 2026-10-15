// Lección 2.3 — Motivaciones: simulación de sistemas físicos y moleculares
// Salida de código obtenida con CPython 3.14 (2026-10-14).

export default {
  id: 'motivaciones-simulacion',
  title: 'Motivaciones: simular la naturaleza',
  lede: 'La primera razón para construir computadoras cuánticas, y todavía una de las más sólidas, es simular sistemas cuánticos: moléculas, materiales y reacciones químicas. Esta lección explica por qué ese problema es tan difícil para las computadoras clásicas y qué se puede esperar, con cifras, de las cuánticas.',
  updated: '2026-10-14',

  context: {
    learn: 'Por qué simular sistemas cuánticos es exponencialmente costoso para una computadora clásica, qué ofrece un simulador cuántico, qué problemas de química y materiales motivan el campo y qué recursos harían falta.',
    why: 'Distinguir aplicaciones con fundamento de aplicaciones de moda es una competencia básica de un ingeniero. La simulación es el caso de uso con mejor base teórica, y conviene conocer también sus límites.',
    previous: 'En [[>historia-computacion-cuantica|la lección 2.2]] vimos que Feynman propuso usar sistemas cuánticos para simular la naturaleza. En [[>sistema-binario|la 1.2]] calculamos cuánta memoria hace falta para simular qubits.',
    next: 'La lección 2.4 extiende el análisis a otros problemas (optimización, búsqueda, datos) y discute cuándo una ventaja teórica se convierte en una ventaja práctica.',
  },

  objectives: [
    'Explicar por qué el estado de n sistemas cuánticos necesita, en general, $2^n$ números para describirse.',
    'Medir y razonar el crecimiento exponencial del coste de la simulación clásica.',
    'Describir qué hace un simulador cuántico y por qué no sufre ese crecimiento.',
    'Citar ejemplos concretos de química y materiales, con sus recursos estimados y sus incertidumbres.',
  ],

  prerequisites: { lessons: ['historia-computacion-cuantica'], knowledge: ['Potencias de 2 y unidades de memoria (lecciones 1.1 y 1.2).'] },

  introduction: [
    { type: 'p', text: 'En 1929, poco después de formularse la mecánica cuántica, Paul Dirac observó que las leyes físicas necesarias para describir toda la química ya se conocían por completo. El problema, señalaba, es que aplicarlas exactamente conduce a ecuaciones demasiado complicadas para resolverlas [@dirac1929]. Casi un siglo después, con computadoras miles de millones de veces más potentes, ese problema sigue abierto para muchas moléculas. Esta lección explica por qué.' },
  ],

  levels: {
    comprender: {
      intro: 'Un crecimiento que se puede medir, una idea para esquivarlo y ejemplos concretos.',
      sections: [
        {
          id: 'explosion',
          title: 'El problema: los estados crecen exponencialmente',
          blocks: [
            { type: 'p', text: 'Piensa en una molécula o en un material como en un conjunto de partículas, cada una con un comportamiento cuántico. Para un sistema sencillo de dos niveles, como un qubit, el estado se describe con dos amplitudes. Para dos sistemas, con cuatro; para tres, con ocho. En general, $n$ sistemas de dos niveles necesitan $2^n$ amplitudes, porque las partes pueden estar entrelazadas (lección 2.1) y no basta con describir cada una por separado.' },
            { type: 'widget', id: 'state-space', options: { n: 30 }, caption: 'Mueve el control. Con 30 sistemas, el estado ya ocupa lo mismo que la memoria de un portátil. Cada uno que se añade duplica la memoria: hacia los 50 ya no cabe en ningún superordenador.' },
            { type: 'p', text: 'No se trata solo de memoria. Simular la evolución del sistema exige actualizar esas $2^n$ amplitudes una y otra vez. Compruébalo en tu propio dispositivo:' },
            { type: 'widget', id: 'simulation-benchmark', caption: 'Medición real en tu navegador. Cada 2 qubits más, el tiempo se multiplica aproximadamente por 4. Los valores absolutos dependen de tu dispositivo; el crecimiento, no.' },
            { type: 'callout', kind: 'note', status: 'establecido', title: 'La clave', text: 'El coste de describir un sistema cuántico de forma exacta en una computadora clásica crece exponencialmente con su tamaño. Es la razón de fondo por la que Feynman propuso las computadoras cuánticas [@feynman1982].' },
          ],
        },
        {
          id: 'simulador',
          title: 'La idea: que un sistema cuántico simule a otro',
          blocks: [
            { type: 'p', text: 'Un conjunto de $n$ qubits ya «es» un sistema de $n$ partes con $2^n$ amplitudes: no necesita guardarlas en una memoria clásica. Si podemos controlar sus interacciones para que imiten las de la molécula o el material que nos interesa, su evolución reproduce la del sistema simulado. En 1996, Seth Lloyd demostró que una computadora cuántica puede simular eficientemente los sistemas cuánticos cuyas partes interaccionan localmente, que es el caso habitual en la naturaleza [@lloyd1996].' },
            { type: 'callout', kind: 'warning', title: 'No se leen las 2ⁿ amplitudes', text: 'Recuerda la lección 2.1: medir $n$ qubits da solo $n$ bits. Un simulador cuántico no nos entrega el estado completo, sino respuestas a preguntas concretas (una energía, una probabilidad, el valor medio de una magnitud) que se estiman repitiendo el experimento muchas veces.' },
          ],
        },
        {
          id: 'quimica',
          title: 'Química y materiales: dónde están las oportunidades',
          blocks: [
            { type: 'p', text: 'Los químicos computacionales no esperan a las computadoras cuánticas: disponen de métodos clásicos aproximados que funcionan muy bien para la mayoría de las moléculas. La dificultad aparece en los sistemas con <em>correlación fuerte</em>, en los que muchos electrones se influyen mutuamente de forma compleja. Por ejemplo:' },
            { type: 'list', items: [
              '<b>La fijación del nitrógeno.</b> La enzima nitrogenasa convierte el nitrógeno del aire en amoníaco a temperatura ambiente gracias a un núcleo de hierro y molibdeno (FeMoco). Industrialmente, ese proceso exige altas presiones y temperaturas. Entender el mecanismo es un problema abierto que se propuso como objetivo para una computadora cuántica [@reiher2017].',
              '<b>Materiales con propiedades cuánticas,</b> como algunos superconductores o imanes, cuyo comportamiento depende de muchos electrones correlacionados.',
            ] },
            { type: 'p', text: '¿Cuánto haría falta? La estimación de recursos más eficiente conocida en su momento para FeMoco requería unos <b>cuatro millones de qubits</b> y <b>menos de cuatro días</b> de cálculo, suponiendo un hardware muy rápido que falle como mucho en una de cada mil operaciones [@lee2021]. Es una máquina muy por encima de las actuales.' },
            { type: 'p', text: 'Mientras tanto, se exploran algoritmos híbridos, en los que un procesador cuántico pequeño y una computadora clásica trabajan juntos [@peruzzo2014]. Veremos cómo colaboran en la lección 2.5.' },
            { type: 'callout', kind: 'note', status: 'abierto', title: 'Una cuestión abierta', text: 'Un análisis publicado en 2023 concluyó que, para la tarea más habitual de la química cuántica (calcular la energía de una molécula en su forma más estable), todavía no hay pruebas de una ventaja exponencial general frente a los mejores métodos clásicos, y que es prudente no suponerla [@lee2023]. La simulación sigue siendo la aplicación más prometedora, pero la ventaja hay que demostrarla problema a problema.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Aquí ponemos números a las ideas del nivel 1. Cada sección empieza con la idea en pocas palabras y un ejemplo; las demostraciones están en «Para profundizar», por si te interesan. Basta con aritmética.',
      sections: [
        {
          id: 'conteo',
          title: 'Por qué $2^n$', key: 'n qubits necesitan 2ⁿ amplitudes de 16 bytes: con 50 qubits, unos 16 PiB.',
          blocks: [
            { type: 'p', text: 'Cada sistema de dos niveles puede encontrarse en dos estados base. Para $n$ sistemas, los estados base son todas las cadenas de $n$ bits (lección 1.1): $2^n$. El estado general asigna una amplitud a cada uno:' },
            { type: 'math', tex: '\\text{memoria} = 2^n \\times 16 \\text{ bytes}, \\qquad n = 50 \\;\\Rightarrow\\; 2^{50} \\times 16 \\approx 1{,}8 \\times 10^{16} \\text{ bytes} = 16 \\text{ PiB}' },
            { deep: true, type: 'p', text: 'Una operación sobre uno de los $n$ sistemas modifica todas las amplitudes, así que cuesta del orden de $2^n$ operaciones aritméticas. Simular $T$ pasos cuesta del orden de $T \\cdot 2^n$. Añadir un sistema duplica el coste: es lo que mide el simulador del nivel 1.' },
            { type: 'callout', kind: 'note', title: 'Matiz', text: 'Hay métodos clásicos ingeniosos que evitan guardar las $2^n$ amplitudes cuando el sistema tiene una estructura especial. Por eso la ventaja cuántica depende del problema concreto [@lee2023].' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Un único cálculo, en Python, que reproduce la tabla de memoria.',
      sections: [
        {
          id: 'python-memoria',
          title: 'Memoria necesaria para n qubits',
          blocks: [
            { type: 'code', lang: 'python', file: 'memoria.py', code: `for n in [10, 20, 30, 40, 50]:
    amplitudes = 2**n
    memoria = amplitudes * 16  # bytes: 16 por amplitud
    print(f"{n} qubits: {amplitudes:,} amplitudes, {memoria:,} bytes")`,
            output: `10 qubits: 1,024 amplitudes, 16,384 bytes
20 qubits: 1,048,576 amplitudes, 16,777,216 bytes
30 qubits: 1,073,741,824 amplitudes, 17,179,869,184 bytes
40 qubits: 1,099,511,627,776 amplitudes, 17,592,186,044,416 bytes
50 qubits: 1,125,899,906,842,624 amplitudes, 18,014,398,509,481,984 bytes` },
            { type: 'p', text: 'El formato <code>{x:,}</code> separa los miles con comas. Prueba a añadir 60 a la lista y pulsa «Ejecutar»: Python no tiene problema con números tan grandes (lección 1.2), pero ninguna computadora podría guardar ese vector.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Las computadoras clásicas no pueden simular moléculas».', reality: 'Pueden, y lo hacen a diario con métodos aproximados que funcionan bien para muchísimas moléculas. Lo difícil son los sistemas con correlación fuerte, donde los métodos aproximados fallan y los exactos crecen exponencialmente.' },
    { myth: '«Un simulador cuántico da el estado completo de la molécula».', reality: 'Da estimaciones de magnitudes concretas, como energías o probabilidades, obtenidas repitiendo mediciones. Leer las $2^n$ amplitudes requeriría un número exponencial de repeticiones.' },
    { myth: '«La química cuántica tiene garantizada una ventaja exponencial».', reality: 'Es la aplicación más prometedora, pero un análisis de 2023 no encontró pruebas de una ventaja exponencial general en el problema más común. La ventaja debe demostrarse caso a caso.' },
  ],

  summary: [
    'Describir exactamente n sistemas cuánticos requiere, en general, $2^n$ amplitudes; el coste de la simulación clásica exacta se duplica con cada sistema añadido.',
    'Un simulador cuántico puede simular eficientemente sistemas con interacciones locales [@lloyd1996].',
    'Los objetivos más citados son la química y los materiales con correlación fuerte (p. ej., FeMoco [@reiher2017]).',
    'Los recursos estimados (millones de qubits [@lee2021]) superan con mucho el hardware actual, y la ventaja general en química no está demostrada [@lee2023].',
  ],

  exercises: [
    { level: 'comprender', question: 'Si tu portátil puede simular 30 qubits, ¿cuántos podría simular una máquina con 1000 veces más memoria?', answer: 'Unos 40: $1000 \\approx 2^{10}$, así que mil veces más memoria solo permite añadir 10 qubits. Es el mismo razonamiento que en la lección 1.11.' },
    { level: 'matematico', question: '¿Cuánta memoria hace falta para 45 qubits, con 16 bytes por amplitud?', answer: '$2^{45} \\times 16 = 2^{49}$ bytes = 512 TiB.' },
    { level: 'implementar', question: 'Modifica <code>memoria.py</code> para usar 8 bytes por amplitud (precisión simple). ¿Cuántos qubits más caben en la misma memoria?', answer: 'Uno más: dividir la memoria por amplitud entre 2 equivale a añadir un qubit ($2^{n+1} \\times 8 = 2^n \\times 16$).' },
  ],

  references: [
    { key: 'dirac1929', use: 'Las leyes de la química se conocen, pero sus ecuaciones son demasiado complejas (idea parafraseada).' },
    { key: 'feynman1982', use: 'Propuesta de simular sistemas cuánticos con sistemas cuánticos.' },
    { key: 'lloyd1996', use: 'Simulación eficiente de sistemas cuánticos con interacciones locales.' },
    { key: 'reiher2017', use: 'FeMoco y la fijación del nitrógeno como objetivo.' },
    { key: 'lee2021', use: 'Estimación de recursos para simular FeMoco.' },
    { key: 'lee2023', use: 'Evidencia (aún insuficiente) de ventaja exponencial en química.' },
    { key: 'peruzzo2014', use: 'Primer algoritmo híbrido para química (VQE).' },
  ],

  related: ['historia-computacion-cuantica', 'ventajas-y-limitaciones', 'sistema-binario', 'varios-qubits', 'circuitos-variacionales'],
  next: 'ventajas-y-limitaciones',
};
