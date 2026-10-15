// Registro de visualizaciones y simuladores.
// Cada módulo exporta `mount(container, options)` y puede devolver una función de limpieza.
// Las lecciones las insertan con un bloque { type: 'widget', id, options }.

export const widgets = {
  'text-to-binary': {
    title: 'Conversor texto → binario',
    description: 'Escribe un texto y observa cómo se descompone en caracteres, puntos de código, bytes y bits, en ASCII o UTF-8.',
    module: 1,
    load: () => import('./text-to-binary.js'),
    lessons: ['representacion-informacion'],
  },
  'bit-explorer': {
    title: 'Explorador de bits',
    description: 'Activa y desactiva bits, observa el valor posicional de cada uno y cuántos patrones distintos existen con n bits.',
    module: 1,
    load: () => import('./bit-explorer.js'),
    lessons: ['representacion-informacion'],
  },
  'byte-interpretations': {
    title: 'Un byte, muchas interpretaciones',
    description: 'El mismo patrón de 8 bits leído como entero, carácter ASCII, nivel de gris o hexadecimal.',
    module: 1,
    load: () => import('./byte-interpretations.js'),
    lessons: ['representacion-informacion'],
  },
  'pixel-grid': {
    title: 'Imagen de 8 × 8 píxeles',
    description: 'Dibuja una imagen en blanco y negro y observa los bytes que la representan.',
    module: 1,
    load: () => import('./pixel-grid.js'),
    lessons: ['representacion-informacion'],
  },
  'voltage-threshold': {
    title: 'Del voltaje al bit',
    description: 'Una señal física con ruido se interpreta como 0 o 1 mediante umbrales. Aumenta el ruido y observa cuándo aparecen errores.',
    module: 1,
    load: () => import('./voltage-threshold.js'),
    lessons: ['representacion-informacion'],
  },
  'information-flow': {
    title: 'Recorrido de un carácter por la computadora',
    description: 'Modelo simplificado, paso a paso, de cómo una tecla pulsada se convierte en bits, se almacena, se procesa y se muestra.',
    module: 1,
    load: () => import('./information-flow.js'),
    lessons: ['representacion-informacion'],
  },
  'number-wheel': {
    title: 'La rueda de los números de ancho fijo',
    description: 'Los 16 patrones de 4 bits dispuestos en círculo. Suma y resta, observa el desbordamiento y compara sin signo, signo y magnitud y complemento a dos.',
    module: 1,
    load: () => import('./number-wheel.js'),
    lessons: ['sistema-binario'],
  },
  'binary-adder': {
    title: 'Sumador binario paso a paso',
    description: 'Suma dos números de 4 u 8 bits columna a columna, con acarreos visibles y detección de desbordamiento con y sin signo.',
    module: 1,
    load: () => import('./binary-adder.js'),
    lessons: ['sistema-binario'],
  },
  'twos-complement': {
    title: 'Laboratorio de complemento a dos',
    description: 'Niega cualquier entero de 8 bits invirtiendo los bits y sumando 1, y comprueba el resultado con los pesos.',
    module: 1,
    load: () => import('./twos-complement.js'),
    lessons: ['sistema-binario'],
  },
  'fraction-binary': {
    title: 'Fracciones decimales en binario',
    description: 'Convierte fracciones como 0,625 o 0,1 a binario por multiplicaciones sucesivas y descubre cuáles son periódicas.',
    module: 1,
    load: () => import('./fraction-binary.js'),
    lessons: ['sistema-binario'],
  },
  'float-explorer': {
    title: 'Explorador IEEE 754',
    description: 'Escribe un número o cambia sus bits: signo, exponente, fracción, valor exacto almacenado y error de redondeo en binary32 y binary64.',
    module: 1,
    load: () => import('./float-explorer.js'),
    lessons: ['sistema-binario'],
  },
  // ---------- Lecciones 1.3–1.11 ----------
  'string-inspector': { title: 'Inspector de cadenas Unicode', description: 'Cuenta grafemas, puntos de código, unidades UTF-16 y bytes UTF-8; normaliza (NFC/NFD) y detecta escrituras mezcladas.', module: 1, load: () => import('./string-inspector.js'), lessons: ['texto-ascii-unicode'] },
  'mojibake-lab': { title: 'Laboratorio de mojibake', description: 'Escribe un texto con una codificación y léelo con otra para ver cómo se corrompe (o se pierde) la información.', module: 1, load: () => import('./mojibake-lab.js'), lessons: ['texto-ascii-unicode'] },
  'rgb-mixer': { title: 'Mezclador RGB y profundidad de color', description: 'Un color son tres números de 8 bits. Reduce los bits por canal y observa las bandas de cuantización.', module: 1, load: () => import('./rgb-mixer.js'), lessons: ['imagenes-y-datos'] },
  'rle-compressor': { title: 'Compresión por longitud de series', description: 'Dibuja una imagen y comprueba cuándo la compresión RLE ahorra espacio y cuándo lo desperdicia.', module: 1, load: () => import('./rle-compressor.js'), lessons: ['imagenes-y-datos'] },
  'audio-sampling': { title: 'Muestreo y aliasing', description: 'Muestrea una señal con distinta frecuencia y bits por muestra; observa la cuantización y el aliasing.', module: 1, load: () => import('./audio-sampling.js'), lessons: ['imagenes-y-datos'] },
  'truth-table': { title: 'Generador de tablas de verdad', description: 'Escribe una expresión booleana y obtén su tabla de verdad con todas las subexpresiones.', module: 1, load: () => import('./truth-table.js'), lessons: ['algebra-booleana'] },
  'equivalence-checker': { title: 'Comprobador de equivalencias', description: 'Comprueba leyes booleanas como De Morgan probando todas las combinaciones, y encuentra contraejemplos.', module: 1, load: () => import('./equivalence-checker.js'), lessons: ['algebra-booleana'] },
  'logic-gates': { title: 'Compuertas lógicas', description: 'AND, OR, NOT, XOR, NAND, NOR y XNOR: símbolo, entradas y tabla de verdad.', module: 1, load: () => import('./logic-gates.js'), lessons: ['compuertas-logicas'] },
  'nand-builder': { title: 'Todo con NAND', description: 'NOT, AND, OR y XOR construidas solo con compuertas NAND, verificadas en todas las entradas.', module: 1, load: () => import('./nand-builder.js'), lessons: ['compuertas-logicas'] },
  'reversible-gates': { title: 'Compuertas reversibles e irreversibles', description: 'AND pierde información; CNOT y Toffoli no. Un puente directo hacia las compuertas cuánticas.', module: 1, load: () => import('./reversible-gates.js'), lessons: ['compuertas-logicas'] },
  'circuit-sim': { title: 'Simulador de circuitos', description: 'Semisumador, sumador completo, multiplexor y sumador de 4 bits, con propagación de señales por niveles.', module: 1, load: () => import('./circuit-sim.js'), lessons: ['circuitos-logicos'] },
  'sop-synth': { title: 'De la tabla de verdad al circuito', description: 'Define una función con su tabla y obtén la suma de productos, su simplificación y el mapa de Karnaugh.', module: 1, load: () => import('./sop-synth.js'), lessons: ['circuitos-logicos'] },
  'memory-endianness': { title: 'Memoria y orden de los bytes', description: 'Cómo se guardan los bytes de un entero de 32 bits en big-endian y little-endian, frente a un texto.', module: 1, load: () => import('./memory-endianness.js'), lessons: ['procesador-memoria'] },
  'cache-sim': { title: 'Simulador de caché', description: 'Recorre una matriz por filas o por columnas y observa los aciertos y fallos de una caché de correspondencia directa.', module: 1, load: () => import('./cache-sim.js'), lessons: ['procesador-memoria'] },
  'memory-hierarchy': { title: 'Jerarquía de memoria', description: 'Registros, cachés, RAM, SSD y disco en escala logarítmica, y a escala humana.', module: 1, load: () => import('./memory-hierarchy.js'), lessons: ['procesador-memoria'] },
  'mini-cpu': { title: 'MiniCPU: un procesador paso a paso', description: 'Procesador educativo de von Neumann con 8 instrucciones: ensambla, ejecuta y observa búsqueda, decodificación y ejecución.', module: 1, load: () => import('./mini-cpu.js'), lessons: ['von-neumann'] },
  'instruction-format': { title: 'Formato de instrucción', description: 'Los bits de una instrucción de la MiniCPU: código de operación y dirección.', module: 1, load: () => import('./instruction-format.js'), lessons: ['von-neumann'] },
  'expression-compiler': { title: 'Compilador de expresiones', description: 'Tokens, árbol sintáctico, código para una máquina de pila y ejecución paso a paso.', module: 1, load: () => import('./expression-compiler.js'), lessons: ['ejecucion-programas'] },
  'call-stack': { title: 'La pila de llamadas', description: 'Observa cómo se apilan y desapilan los marcos de factorial(n) recursivo.', module: 1, load: () => import('./call-stack.js'), lessons: ['ejecucion-programas'] },
  'growth-race': { title: 'Carrera de crecimiento', description: 'Compara n, n log n, n², 2ⁿ y n! y el tiempo que tardarían para cada tamaño de entrada.', module: 1, load: () => import('./growth-race.js'), lessons: ['limites-complejidad'] },
  'tsp-brute': { title: 'El viajante por fuerza bruta', description: 'Busca la ruta óptima entre ciudades probando todas las permutaciones y compárala con una heurística.', module: 1, load: () => import('./tsp-brute.js'), lessons: ['limites-complejidad'] },
  // ---------- Módulo 2 ----------
  interferometer: { title: 'Interferómetro de Mach–Zehnder', description: 'Envía fotones de uno en uno: dos caminos posibles interfieren, algo que un modelo clásico de caminos al azar no puede explicar.', module: 2, load: () => import('./interferometer.js'), lessons: ['que-es-computacion-cuantica'] },
  'history-timeline': { title: 'Línea de tiempo de la computación cuántica', description: 'De la paradoja EPR (1935) a la corrección de errores bajo el umbral (2025), con la fuente original de cada hito.', module: 2, load: () => import('./history-timeline.js'), lessons: ['historia-computacion-cuantica'] },
  'chronology-quiz': { title: 'Reto de cronología', description: 'Ordena hitos de la historia de la computación cuántica y comprueba el resultado.', module: 2, load: () => import('./chronology-quiz.js'), lessons: ['historia-computacion-cuantica'] },
  'deutsch-game': { title: 'El problema de Deutsch', description: '¿Es constante o balanceada? Descubre cuántas consultas necesita un algoritmo clásico.', module: 2, load: () => import('./deutsch-game.js'), lessons: ['historia-computacion-cuantica'] },
  'state-space': { title: 'La explosión del espacio de estados', description: 'Cuánta memoria hace falta para guardar el estado de n qubits en una computadora clásica.', module: 2, load: () => import('./state-space.js'), lessons: ['motivaciones-simulacion'] },
  'simulation-benchmark': { title: 'Mide el coste de simular qubits', description: 'Tu navegador simula vectores de estado de 12 a 22 qubits y mide cómo se duplica el tiempo con cada qubit.', module: 2, load: () => import('./simulation-benchmark.js'), lessons: ['motivaciones-simulacion'] },
  'advantage-calculator': { title: '¿Cuándo empieza a ganar un algoritmo cuántico?', description: 'Modelo del punto de cruce entre un algoritmo clásico y uno cuántico más lento por operación.', module: 2, load: () => import('./advantage-calculator.js'), lessons: ['ventajas-y-limitaciones'] },
  'speedup-classifier': { title: '¿Se beneficia de la computación cuántica?', description: 'Clasifica diez tareas y compara tu respuesta con el estado actual del conocimiento.', module: 2, load: () => import('./speedup-classifier.js'), lessons: ['ventajas-y-limitaciones'] },
  'hybrid-flow': { title: 'El viaje de un programa cuántico', description: 'Sigue paso a paso un programa desde tu computadora hasta la QPU y de vuelta, y observa qué viaja entre cada componente.', module: 2, load: () => import('./hybrid-flow.js'), lessons: ['qpu-computacion-hibrida'] },
  'hybrid-loop': { title: 'Bucle híbrido clásico-cuántico', description: 'Mueve una perilla, envía el circuito a una QPU simulada y observa cómo el ruido de las repeticiones limita la precisión.', module: 2, load: () => import('./hybrid-loop.js'), lessons: ['qpu-computacion-hibrida'] },
  'technology-explorer': { title: 'Tecnologías de qubits', description: 'Superconductores, iones, átomos neutros, fotones y espines: cómo funcionan, sus puntos fuertes y sus retos. Incluye un juego para ponerte a prueba.', module: 2, load: () => import('./technology-explorer.js'), lessons: ['panorama-tecnologico'] },
  'qubit-metrics': { title: '¿Más qubits es mejor?', description: 'Compara tres procesadores ficticios con un circuito de tamaño ajustable y descubre por qué la tasa de error importa tanto como el número de qubits.', module: 2, load: () => import('./qubit-metrics.js'), lessons: ['panorama-tecnologico'] },
  'headline-check': { title: 'Leer anuncios con criterio', description: 'Titulares ficticios sobre computación cuántica: elige la pregunta que conviene hacer ante cada uno.', module: 2, load: () => import('./headline-check.js'), lessons: ['panorama-tecnologico'] },
  'qubit-lab': { title: 'Laboratorio: bit frente a qubit', description: 'Lee un bit tantas veces como quieras; mide un qubit y descubre que el resultado es aleatorio, que medir lo cambia y que hay que repetir para conocerlo.', module: 3, load: () => import('./qubit-lab.js'), lessons: ['el-qubit'] },
  'ket-match': { title: 'Une cada ket con su vector', description: 'Juego de emparejar: cada estado escrito en notación de Dirac con su lista de amplitudes.', module: 3, load: () => import('./ket-match.js'), lessons: ['notacion-dirac'] },
  'amplitude-builder': { title: 'Constructor de amplitudes', description: 'Elige las dos amplitudes de un qubit, comprueba si forman un estado válido, normalízalo y supera los retos.', module: 3, load: () => import('./amplitude-builder.js'), lessons: ['estado-general-amplitudes'] },
  'bloch-sphere': { title: 'Esfera de Bloch', description: 'Mueve el estado de un qubit por la esfera: la altura decide las probabilidades y el giro (la fase) no las cambia. Con retos.', module: 3, load: () => import('./bloch-sphere.js'), lessons: ['esfera-de-bloch'] },
};

export async function mountWidget(id, container, options = {}) {
  const entry = widgets[id];
  if (!entry) {
    container.textContent = `Visualización no encontrada: ${id}`;
    return null;
  }
  try {
    const mod = await entry.load();
    return mod.mount(container, options) || null;
  } catch (err) {
    console.error(err);
    container.textContent = 'No se pudo cargar esta visualización.';
    return null;
  }
}
