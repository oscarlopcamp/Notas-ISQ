// Programa académico: módulos → unidades → lecciones.
//
// Este archivo es el índice del libro. Cada lección declara:
//   id           identificador estable (se usa en URLs y en el progreso)
//   title        título
//   topics       temas del programa que cubre
//   prerequisites lecciones previas recomendadas (ids)
//   load         importación dinámica del contenido; si falta, la lección está pendiente
//
// Para publicar una lección basta con crear su archivo en content/module-XX/
// y añadir `load` aquí. La interfaz no necesita cambios.

const L = (id, title, topics, extra = {}) => ({ id, title, topics, prerequisites: [], ...extra });

export const modules = [
  {
    id: 'm01',
    number: '01',
    title: 'Fundamentos clásicos',
    fullTitle: 'De la información a la computación clásica',
    objective: 'Comprender cómo una computadora clásica representa, procesa y transforma información.',
    units: [
      {
        title: 'Información y representación',
        lessons: [
          L('representacion-informacion', '¿Cómo representa información una computadora clásica?',
            ['¿Qué es la información?', '¿Cómo interpreta información una computadora?', 'Bits', 'Sistema binario (introducción)', 'Conversión decimal-binario', 'Caracteres', 'Código ASCII', 'Unicode (introducción)', 'Representación de texto', 'Representación de imágenes (introducción)'],
            { load: () => import('./module-01/representacion-informacion.js'), minutes: 60 }),
          L('sistema-binario', 'Sistema binario y representación de números',
            ['Sistema binario', 'Conversión decimal-binario', 'Representación de números', 'Enteros con signo (complemento a dos)', 'Punto flotante (IEEE 754)'],
            { prerequisites: ['representacion-informacion'], load: () => import('./module-01/sistema-binario.js'), minutes: 75 }),
          L('texto-ascii-unicode', 'Caracteres y texto: ASCII, Unicode y UTF-8',
            ['Caracteres', 'Código ASCII', 'Unicode', 'Representación de texto'],
            { load: () => import('./module-01/texto-ascii-unicode.js'), minutes: 60, prerequisites: ['representacion-informacion'] }),
          L('imagenes-y-datos', 'Representación de imágenes, sonido y otros datos',
            ['Representación de imágenes', 'Color', 'Sonido y muestreo', 'Compresión (introducción)'],
            { load: () => import('./module-01/imagenes-y-datos.js'), minutes: 60, prerequisites: ['representacion-informacion'] }),
        ],
      },
      {
        title: 'Lógica digital',
        lessons: [
          L('algebra-booleana', 'Álgebra booleana', ['Álgebra booleana'], { load: () => import('./module-01/algebra-booleana.js'), minutes: 55, prerequisites: ['sistema-binario'] }),
          L('compuertas-logicas', 'Compuertas lógicas: AND, OR, NOT, XOR, NAND y NOR',
            ['Compuertas AND, OR y NOT', 'Compuertas XOR, NAND y NOR', 'Tablas de verdad'], { load: () => import('./module-01/compuertas-logicas.js'), minutes: 60, prerequisites: ['algebra-booleana'] }),
          L('circuitos-logicos', 'Tablas de verdad y circuitos lógicos', ['Tablas de verdad', 'Circuitos lógicos'], { load: () => import('./module-01/circuitos-logicos.js'), minutes: 65, prerequisites: ['compuertas-logicas'] }),
        ],
      },
      {
        title: 'Arquitectura y ejecución',
        lessons: [
          L('procesador-memoria', '¿Qué hace un procesador? CPU y memoria', ['¿Qué hace un procesador?', 'CPU', 'Memoria'], { load: () => import('./module-01/procesador-memoria.js'), minutes: 60, prerequisites: ['circuitos-logicos'] }),
          L('von-neumann', 'Instrucciones y arquitectura de von Neumann', ['Instrucciones', 'Arquitectura de von Neumann'], { load: () => import('./module-01/von-neumann.js'), minutes: 70, prerequisites: ['procesador-memoria'] }),
          L('ejecucion-programas', 'Ejecución de programas: del código fuente a la máquina', ['Ejecución de programas'], { load: () => import('./module-01/ejecucion-programas.js'), minutes: 60, prerequisites: ['von-neumann'] }),
        ],
      },
      {
        title: 'Límites de la computación clásica',
        lessons: [
          L('limites-complejidad', 'Limitaciones de la computación clásica e introducción a la complejidad',
            ['Limitaciones de la computación clásica', 'Introducción a complejidad computacional'], { load: () => import('./module-01/limites-complejidad.js'), minutes: 70, prerequisites: ['ejecucion-programas'] }),
        ],
      },
    ],
  },
  {
    id: 'm02',
    number: '02',
    title: 'Introducción a la computación cuántica',
    fullTitle: 'Introducción a la computación cuántica',
    objective: 'Comprender por qué surgió la computación cuántica y qué problemas busca abordar.',
    units: [
      {
        title: 'Qué es y de dónde viene',
        lessons: [
          L('que-es-computacion-cuantica', '¿Qué es la computación cuántica?', ['¿Qué es computación cuántica?', 'Computación clásica frente a cuántica'], { load: () => import('./module-02/que-es-computacion-cuantica.js'), minutes: 60, prerequisites: ['limites-complejidad'] }),
          L('historia-computacion-cuantica', 'Historia: Feynman, Deutsch, Shor y Grover', ['Historia', 'Richard Feynman', 'David Deutsch', 'Peter Shor', 'Lov Grover'], { load: () => import('./module-02/historia-computacion-cuantica.js'), minutes: 60 }),
        ],
      },
      {
        title: 'Motivaciones y límites',
        lessons: [
          L('motivaciones-simulacion', 'Motivaciones: simular la naturaleza', ['Motivaciones de la computación cuántica', 'Simulación de sistemas físicos', 'Simulación molecular', 'Crecimiento de espacios de estados'], { load: () => import('./module-02/motivaciones-simulacion.js'), minutes: 45 }),
          L('ventajas-y-limitaciones', 'Posibles ventajas y limitaciones', ['Problemas de optimización', 'Posibles ventajas cuánticas', 'Limitaciones', 'Qué problemas no se benefician necesariamente', 'Computación cuántica como complemento de la clásica'], { load: () => import('./module-02/ventajas-y-limitaciones.js'), minutes: 50 }),
        ],
      },
      {
        title: 'El sistema de cómputo',
        lessons: [
          L('qpu-computacion-hibrida', 'La QPU y la computación híbrida', ['¿Qué es una QPU?', 'Computación híbrida', 'Arquitectura general de una computadora cuántica'], { load: () => import('./module-02/qpu-computacion-hibrida.js'), minutes: 45 }),
          L('panorama-tecnologico', 'Panorama tecnológico', ['Panorama tecnológico'], { load: () => import('./module-02/panorama-tecnologico.js'), minutes: 45 }),
        ],
      },
    ],
  },
  {
    id: 'm03',
    number: '03',
    title: 'Fundamentos conceptuales',
    fullTitle: 'Fundamentos conceptuales de computación cuántica',
    objective: 'Comprender los fundamentos de la computación cuántica antes de profundizar en matemáticas.',
    units: [
      {
        title: '3.1 El qubit',
        lessons: [
          L('el-qubit', '¿Qué es un qubit? Bit frente a qubit', ['¿Qué es un qubit?', 'Bit frente a qubit', 'Estados base'], { prerequisites: ['qpu-computacion-hibrida'], load: () => import('./module-03/el-qubit.js'), minutes: 35 }),
          L('notacion-dirac', 'Notación de Dirac: |0⟩ y |1⟩', ['Notación de Dirac', 'Ket cero', 'Ket uno', 'Representación vectorial introductoria'], { load: () => import('./module-03/notacion-dirac.js'), minutes: 30 }),
          L('estado-general-amplitudes', 'Estado general y amplitudes de probabilidad', ['Estado general', 'Amplitudes de probabilidad'], { load: () => import('./module-03/estado-general-amplitudes.js'), minutes: 35 }),
          L('esfera-de-bloch', 'La esfera de Bloch', ['Esfera de Bloch', 'Interpretación geométrica'], { load: () => import('./module-03/esfera-de-bloch.js'), minutes: 35 }),
        ],
      },
      {
        title: '3.2 Propiedades cuánticas',
        lessons: [
          L('superposicion', 'Superposición', ['Superposición', 'Amplitudes'], { load: () => import('./module-03/superposicion.js'), minutes: 35 }),
          L('fase-relativa', 'Fase relativa', ['Fase relativa'], { load: () => import('./module-03/fase-relativa.js'), minutes: 30 }),
          L('entrelazamiento', 'Entrelazamiento y correlación clásica', ['Entrelazamiento', 'Correlación clásica frente a entrelazamiento'], { load: () => import('./module-03/entrelazamiento.js'), minutes: 40 }),
          L('interferencia', 'Interferencia constructiva y destructiva', ['Interferencia constructiva', 'Interferencia destructiva', 'Relación entre fase e interferencia'], { load: () => import('./module-03/interferencia.js'), minutes: 35 }),
        ],
      },
      {
        title: '3.3 Sistemas de varios qubits',
        lessons: [
          L('varios-qubits', 'Sistemas de uno, dos, tres y n qubits', ['Un qubit', 'Dos qubits', 'Tres qubits', 'Estados base', 'Sistemas compuestos', 'Crecimiento exponencial de la dimensión del espacio', 'Superposición de estados de varios qubits'], { load: () => import('./module-03/varios-qubits.js'), minutes: 40 }),
        ],
      },
      {
        title: '3.4 Circuitos cuánticos',
        lessons: [
          L('circuitos-cuanticos', 'Cómo leer un circuito cuántico', ['¿Qué es un circuito?', 'Cómo leer un circuito', 'Líneas de qubits', 'Estado inicial', 'Operaciones', 'Compuertas', 'Mediciones', 'Registros clásicos', 'Interpretación de símbolos'], { load: () => import('./module-03/circuitos-cuanticos.js'), minutes: 45 }),
        ],
      },
      {
        title: '3.5 Compuertas cuánticas',
        lessons: [
          L('compuertas-x-h-z', 'Compuertas X, H y Z', ['X', 'H', 'Z']),
          L('compuertas-y-s-t', 'Compuertas Y, S y T', ['Y', 'S', 'T']),
          L('compuertas-multiqubit', 'CNOT, CZ, SWAP y Toffoli', ['CNOT', 'CZ', 'SWAP', 'Toffoli']),
        ],
      },
      {
        title: '3.6 Medición cuántica',
        lessons: [
          L('medicion-cuantica', '¿Qué significa medir un qubit?', ['¿Qué significa medir?', 'Resultado clásico', 'Medición en base computacional', 'Probabilidades', 'Estado posterior a una medición ideal', 'Introducción a bases de medición']),
          L('shots-histogramas', 'Shots, histogramas y distribuciones', ['Shots', 'Histogramas', 'Distribución de resultados']),
        ],
      },
      {
        title: '3.7 Del qubit ideal al qubit real',
        lessons: [
          L('ruido-decoherencia', 'Ruido, decoherencia, T1 y T2', ['Qubit ideal', 'Qubit físico', 'Ruido', 'Decoherencia', 'Relajación', 'T1', 'T2', 'Errores de compuertas', 'Errores de medición', 'Fidelidad']),
          L('qubits-logicos', 'Qubits físicos, qubits lógicos y corrección de errores', ['Qubits físicos', 'Qubits lógicos', 'Corrección de errores', 'Mitigación de errores', 'No clonación']),
        ],
      },
      {
        title: '3.8 Hardware cuántico',
        lessons: [
          L('hardware-cuantico', 'Tecnologías de qubits', ['Qubits superconductores', 'Iones atrapados', 'Fotones', 'Átomos neutros', 'Otras tecnologías']),
          L('sistemas-de-control', 'Refrigeración, control, conectividad y simuladores', ['Refrigeración', 'Sistemas de control', 'Conectividad', 'Limitaciones físicas', 'Simuladores frente a hardware real']),
        ],
      },
    ],
  },
  {
    id: 'm04',
    number: '04',
    title: 'Matemáticas para computación cuántica',
    fullTitle: 'Matemáticas para computación cuántica',
    objective: 'Formalizar matemáticamente los conceptos aprendidos anteriormente.',
    units: [
      {
        title: 'Números y vectores',
        lessons: [
          L('numeros-complejos', 'Números complejos', ['Números complejos', 'Parte real e imaginaria', 'Módulo', 'Fase', 'Forma polar']),
          L('vectores', 'Vectores, producto interno y normalización', ['Vectores', 'Vectores columna', 'Operaciones vectoriales', 'Producto interno', 'Norma', 'Normalización']),
          L('espacios-vectoriales', 'Espacios vectoriales, bases y espacios de Hilbert', ['Espacios vectoriales', 'Bases', 'Ortogonalidad', 'Espacios de Hilbert']),
          L('bra-ket', 'Notación bra-ket y producto externo', ['Notación bra-ket', 'Producto externo']),
        ],
      },
      {
        title: 'Matrices y operadores',
        lessons: [
          L('matrices', 'Matrices, conjugación y matriz adjunta', ['Matrices', 'Multiplicación matricial', 'Conjugación', 'Transposición', 'Matriz adjunta']),
          L('operadores', 'Operadores lineales, unitarios y hermitianos', ['Operadores lineales', 'Operadores unitarios', 'Operadores hermitianos']),
          L('autovalores', 'Autovalores y autovectores', ['Autovalores', 'Autovectores']),
          L('matrices-de-compuertas', 'Matrices de compuertas', ['Matrices de compuertas']),
        ],
      },
      {
        title: 'Sistemas compuestos y medición',
        lessons: [
          L('producto-tensorial', 'Producto tensorial y estados de múltiples qubits', ['Producto tensorial', 'Estados de múltiples qubits']),
          L('regla-de-born', 'Regla de Born, proyectores y medición', ['Regla de Born', 'Proyectores', 'Medición']),
          L('fase-global-relativa', 'Fase global y fase relativa', ['Fase global', 'Fase relativa']),
          L('matrices-de-densidad', 'Matrices de densidad, estados mixtos y ruido', ['Matrices de densidad', 'Estados puros', 'Estados mixtos', 'Introducción matemática al ruido']),
        ],
      },
    ],
  },
  {
    id: 'm05',
    number: '05',
    title: 'Programación cuántica',
    fullTitle: 'Programación cuántica con Python y Qiskit',
    objective: 'Aprender a construir, simular, ejecutar y analizar programas cuánticos.',
    units: [
      {
        title: 'Entorno y primeros circuitos',
        lessons: [
          L('entorno-desarrollo', 'Entorno de desarrollo: Python, entornos virtuales, Qiskit y Jupyter', ['Entorno de desarrollo', 'Instalación de Python', 'Entornos virtuales', 'Instalación de Qiskit', 'Jupyter Notebook']),
          L('primer-circuito', 'Primer circuito con QuantumCircuit', ['Primer circuito', 'QuantumCircuit', 'Registros cuánticos', 'Registros clásicos', 'Inicialización']),
          L('compuertas-qiskit', 'Compuertas de un qubit en Qiskit', ['Compuerta X', 'Compuerta Y', 'Compuerta Z', 'Compuerta H', 'Compuertas parametrizadas']),
          L('multiqubit-qiskit', 'Circuitos de varios qubits, CNOT y estados de Bell', ['Circuitos de múltiples qubits', 'CNOT', 'Estados de Bell']),
        ],
      },
      {
        title: 'Ejecutar y analizar',
        lessons: [
          L('medicion-simulacion-qiskit', 'Mediciones, shots, simulación e histogramas', ['Mediciones', 'Shots', 'Simulación', 'Histogramas']),
          L('statevector-operadores', 'Statevector y operadores', ['Statevector', 'Operadores']),
          L('transpilacion-hardware', 'Transpilación y ejecución en hardware real', ['Transpilación', 'Hardware real', 'Interpretación de resultados']),
          L('ruido-qiskit', 'Modelos de ruido', ['Modelos de ruido']),
        ],
      },
      {
        title: 'Programas híbridos',
        lessons: [
          L('circuitos-variacionales', 'Circuitos parametrizados y variacionales', ['Circuitos parametrizados', 'Circuitos variacionales']),
          L('programas-hibridos', 'Programas híbridos clásico-cuánticos', ['Programas híbridos']),
        ],
      },
    ],
  },
  {
    id: 'm06',
    number: '06',
    title: 'Protocolos cuánticos',
    fullTitle: 'Protocolos cuánticos',
    objective: 'Comprender cómo se utilizan recursos cuánticos para tareas de comunicación y procesamiento de información.',
    units: [
      {
        title: 'Comunicación cuántica',
        lessons: [
          L('que-es-protocolo', '¿Qué es un protocolo cuántico?', ['¿Qué es un protocolo cuántico?', 'Diferencia entre protocolo y algoritmo', 'Comunicación cuántica', 'Comunicación clásica y cuántica']),
          L('estados-bell-recurso', 'Estados de Bell como recurso', ['Estados de Bell']),
          L('teleportacion', 'Teleportación cuántica', ['Teleportación cuántica']),
          L('superdense-coding', 'Codificación superdensa', ['Superdense coding']),
        ],
      },
      {
        title: 'Distribución cuántica de claves',
        lessons: [
          L('bb84', 'BB84', ['Distribución cuántica de claves', 'BB84']),
          L('e91', 'E91', ['E91']),
          L('seguridad-protocolos', 'Seguridad, limitaciones y aplicaciones', ['Seguridad de protocolos', 'Limitaciones', 'Aplicaciones']),
        ],
      },
    ],
  },
  {
    id: 'm07',
    number: '07',
    title: 'Algoritmos cuánticos',
    fullTitle: 'Algoritmos cuánticos',
    objective: 'Comprender cómo se diseñan algoritmos que aprovechan propiedades cuánticas.',
    units: [
      {
        title: 'Introducción',
        lessons: [
          L('que-es-algoritmo-cuantico', '¿Qué es un algoritmo cuántico? Oráculos e interferencia', ['Qué es un algoritmo cuántico', 'Diferencia entre algoritmo y protocolo', 'Oráculos', 'Interferencia']),
          L('amplificacion-amplitudes', 'Amplificación de amplitudes', ['Amplificación de amplitudes']),
          L('qft', 'Transformada cuántica de Fourier', ['Transformada cuántica de Fourier']),
          L('estimacion-fase', 'Estimación de fase', ['Estimación de fase']),
        ],
      },
      {
        title: '7.1 Algoritmo de Grover',
        lessons: [
          L('grover-problema', 'Búsqueda no estructurada y ventaja cuadrática', ['Problema de búsqueda no estructurada', 'Solución clásica', 'Ventaja cuadrática']),
          L('grover-oraculo-difusion', 'Oráculo, difusión e iteraciones', ['Oráculo', 'Marcado de soluciones', 'Operador de difusión', 'Amplificación de amplitudes', 'Número de iteraciones', 'Circuito', 'Ejemplo manual']),
          L('grover-qiskit', 'Grover en Qiskit, resultados y limitaciones', ['Implementación en Qiskit', 'Resultados', 'Limitaciones', 'Aplicaciones']),
        ],
      },
      {
        title: '7.2 Algoritmo de Shor',
        lessons: [
          L('shor-motivacion', 'Factorización e importancia criptográfica', ['Factorización', 'Importancia criptográfica']),
          L('shor-periodo', 'Búsqueda de período y aritmética modular', ['Búsqueda de período', 'Aritmética modular', 'Reducción del problema']),
          L('shor-circuito', 'Circuito, QFT, estimación de fase y procesamiento clásico', ['Transformada cuántica de Fourier', 'Estimación de fase', 'Circuito', 'Procesamiento clásico', 'Ejemplo numérico', 'Implementación educativa']),
          L('shor-recursos-rsa', 'Recursos necesarios e implicaciones para RSA', ['Recursos necesarios', 'Limitaciones actuales', 'Implicaciones para RSA']),
        ],
      },
    ],
  },
  {
    id: 'm08',
    number: '08',
    title: 'Ingeniería de software cuántico',
    fullTitle: 'Ingeniería de software cuántico',
    objective: 'Conectar los fundamentos cuánticos con la ingeniería de software.',
    units: [
      {
        title: 'Sistemas y arquitectura',
        lessons: [
          L('que-es-isq', '¿Qué es la ingeniería de software cuántico?', ['¿Qué es ingeniería de software cuántico?', 'Programación frente a ingeniería de software']),
          L('arquitecturas-hibridas', 'Sistemas híbridos y arquitecturas clásico-cuánticas', ['Sistemas híbridos', 'Arquitecturas clásicas-cuánticas', 'Componentes']),
          L('servicios-cuanticos', 'APIs, servicios cuánticos y computación en la nube', ['APIs', 'Servicios cuánticos', 'Computación en la nube']),
        ],
      },
      {
        title: 'Proceso de desarrollo',
        lessons: [
          L('requisitos-diseno', 'Requisitos, diseño y modelado', ['Ingeniería de requisitos', 'Diseño', 'Modelado']),
          L('patrones-ciclos-vida', 'Patrones de diseño, ciclos de vida y metodologías', ['Patrones de diseño', 'Ciclos de vida', 'Metodologías']),
        ],
      },
      {
        title: 'Calidad y verificación',
        lessons: [
          L('pruebas-cuanticas', 'Pruebas y testing estadístico', ['Pruebas', 'Testing estadístico']),
          L('depuracion-verificacion', 'Depuración, verificación y validación', ['Depuración', 'Verificación', 'Validación']),
          L('mantenimiento-code-smells', 'Mantenimiento, refactorización, code smells y deuda técnica', ['Mantenimiento', 'Refactorización', 'Code smells', 'Deuda técnica']),
        ],
      },
      {
        title: 'Operación',
        lessons: [
          L('optimizacion-recursos', 'Optimización de circuitos, transpilación y gestión de recursos', ['Optimización de circuitos', 'Transpilación', 'Gestión de recursos']),
          L('reproducibilidad-devops', 'Reproducibilidad, integración continua, despliegue y observabilidad', ['Reproducibilidad', 'Integración continua', 'Despliegue', 'Observabilidad']),
          L('calidad-arquitecturas-referencia', 'Calidad y arquitecturas de referencia', ['Calidad', 'Arquitecturas de referencia']),
          L('problemas-abiertos-isq', 'Problemas abiertos en ingeniería de software cuántico', ['Problemas abiertos']),
        ],
      },
    ],
  },
  {
    id: 'm09',
    number: '09',
    title: 'Ciberseguridad cuántica',
    fullTitle: 'Ciberseguridad cuántica',
    objective: 'Comprender el impacto de la computación cuántica sobre la seguridad clásica y los problemas de seguridad de los propios sistemas cuánticos.',
    units: [
      {
        title: '9.1 Fundamentos',
        lessons: [
          L('fundamentos-seguridad', 'Propiedades de seguridad y modelos de amenazas', ['Confidencialidad', 'Integridad', 'Disponibilidad', 'Autenticación', 'Modelos de amenazas']),
          L('criptografia-clasica', 'Criptografía simétrica, asimétrica, RSA, ECC y hash', ['Criptografía simétrica', 'Criptografía asimétrica', 'RSA', 'Curvas elípticas', 'Funciones hash']),
        ],
      },
      {
        title: '9.2 Amenazas cuánticas',
        lessons: [
          L('impacto-shor-grover', 'Impacto de Shor y Grover sobre la criptografía', ['Impacto de Shor', 'Impacto de Grover', 'RSA', 'ECC', 'Criptografía simétrica']),
          L('harvest-now-decrypt-later', 'Harvest now, decrypt later y riesgos de transición', ['Harvest now, decrypt later', 'Riesgos de transición']),
        ],
      },
      {
        title: '9.3 Criptografía poscuántica',
        lessons: [
          L('pqc-vs-qkd', '¿Qué es PQC? Diferencias con QKD', ['¿Qué es PQC?', 'Diferencias entre PQC y QKD']),
          L('familias-pqc', 'Retículas, códigos y firmas poscuánticas', ['Criptografía basada en retículas', 'Criptografía basada en códigos', 'Firmas poscuánticas']),
          L('estandares-nist', 'Estándares NIST: ML-KEM, ML-DSA y SLH-DSA', ['Estándares NIST', 'ML-KEM', 'ML-DSA', 'SLH-DSA']),
          L('criptoagilidad-migracion', 'Criptoagilidad, migración y retos de implementación', ['Criptoagilidad', 'Migración', 'Retos de implementación']),
        ],
      },
      {
        title: '9.4 Seguridad de sistemas cuánticos',
        lessons: [
          L('superficie-ataque', 'Superficie de ataque y seguridad de plataformas', ['Superficie de ataque', 'Seguridad de plataformas', 'Servicios en la nube', 'Sistemas híbridos']),
          L('seguridad-apis-credenciales', 'APIs, autenticación, autorización y credenciales', ['Seguridad de APIs', 'Autenticación', 'Autorización', 'Protección de credenciales', 'Protección de datos clásicos', 'Envío de trabajos cuánticos', 'Procesamiento de resultados']),
          L('seguridad-software-cuantico', 'Dependencias, vulnerabilidades, bugs y verificación', ['Dependencias', 'Vulnerabilidades', 'Bugs', 'Code smells', 'Verificación de programas', 'Seguridad de compiladores', 'Seguridad de transpiladores']),
          L('amenazas-hardware', 'Amenazas de hardware y modelos de amenazas', ['Amenazas de hardware', 'Modelos de amenazas']),
          L('caso-estudio-hibrido', 'Caso de estudio: seguridad de una aplicación híbrida', ['Arquitectura', 'Componentes', 'Activos', 'Límites de confianza', 'Amenazas', 'Vulnerabilidades', 'Controles', 'Pruebas', 'Riesgos residuales']),
          L('problemas-abiertos-seguridad', 'Problemas abiertos', ['Problemas abiertos']),
        ],
      },
    ],
  },
];

// ---------- Índices derivados ----------

export const lessons = [];
modules.forEach((mod) => {
  mod.units.forEach((unit, ui) => {
    unit.lessons.forEach((lesson) => {
      lesson.moduleId = mod.id;
      lesson.unitTitle = unit.title;
      lesson.unitIndex = ui;
      lesson.status = lesson.load ? 'disponible' : 'pendiente';
      lesson.order = lessons.length;
      lesson.number = `${Number(mod.number)}.${mod.units.slice(0, ui).reduce((n, u) => n + u.lessons.length, 0) + unit.lessons.indexOf(lesson) + 1}`;
      lessons.push(lesson);
    });
  });
});

// En la ruta guiada, si una lección no declara requisitos, depende de la anterior.
lessons.forEach((lesson, i) => {
  if (i > 0 && lesson.prerequisites.length === 0) lesson.prerequisites = [lessons[i - 1].id];
});

const byId = Object.fromEntries(lessons.map((l) => [l.id, l]));
const modById = Object.fromEntries(modules.map((m) => [m.id, m]));

export const lessonById = (id) => byId[id];
export const moduleById = (id) => modById[id];
export const lessonsOfModule = (id) => lessons.filter((l) => l.moduleId === id);
export const nextLesson = (id) => lessons[(byId[id]?.order ?? -2) + 1];
export const previousLesson = (id) => lessons[(byId[id]?.order ?? 0) - 1];
export const availableLessons = () => lessons.filter((l) => l.status === 'disponible');
