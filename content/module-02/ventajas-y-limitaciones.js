// Lección 2.4 — Posibles ventajas y limitaciones
// Salida de código obtenida con CPython 3.14 (2026-10-14). El modelo del punto
// de cruce se comprueba en tests/module2.test.js.

export default {
  id: 'ventajas-y-limitaciones',
  title: 'Posibles ventajas y limitaciones',
  lede: '¿Para qué servirá, y para qué no, una computadora cuántica? Esta lección ordena las ventajas conocidas por su tamaño, explica por qué una ventaja teórica no siempre se convierte en una práctica y presenta los límites que hacen de la computación cuántica una herramienta especializada.',
  updated: '2026-10-14',

  context: {
    learn: 'Los tipos de ventaja (exponencial, polinómica, heurística o ninguna), el caso de la optimización, las limitaciones prácticas (corrección de errores, carga de datos, lectura de resultados) y por qué la computación cuántica complementa a la clásica en lugar de sustituirla.',
    why: 'Un ingeniero tendrá que decidir si un problema merece una solución cuántica. Esta lección da los criterios para hacerlo y para detectar promesas exageradas.',
    previous: 'En [[>motivaciones-simulacion|la lección 2.3]] vimos la motivación más sólida, la simulación. En [[>limites-complejidad|la 1.11]], las clases de complejidad y los límites del cómputo.',
    next: 'La unidad siguiente explica cómo se organiza un sistema que combina una QPU con computadoras clásicas (lección 2.5).',
  },

  objectives: [
    'Clasificar las ventajas cuánticas conocidas por su tamaño y su grado de evidencia.',
    'Explicar por qué una ventaja cuadrática puede no ser útil en la práctica.',
    'Identificar las limitaciones de entrada y salida de datos, y las del ruido.',
    'Reconocer qué tipos de tareas no se benefician de la computación cuántica.',
  ],

  prerequisites: { lessons: ['motivaciones-simulacion'], knowledge: ['Notación O grande (lección 1.11).'] },

  introduction: [
    { type: 'p', text: 'Las noticias sobre computación cuántica suelen hablar de una revolución que lo acelerará todo. La realidad es más interesante y más útil para un ingeniero: hay problemas concretos con ventajas enormes, problemas con ventajas modestas que quizá no compensen y muchos problemas sin ninguna ventaja. Empieza por poner a prueba tu intuición:' },
    { type: 'widget', id: 'speedup-classifier', caption: 'Para cada tarea, elige qué puede aportar la computación cuántica según lo que se sabe hoy. La explicación de cada caso incluye su fuente.' },
  ],

  levels: {
    comprender: {
      intro: 'Una clasificación de las ventajas, el problema de las ventajas pequeñas y los límites prácticos.',
      sections: [
        {
          id: 'tipos',
          title: 'Cuatro tipos de respuesta',
          blocks: [
            { type: 'table', head: ['Tipo', 'Ejemplos', 'Grado de evidencia'], rows: [
              ['Exponencial (frente al mejor algoritmo clásico conocido)', 'Factorización (Shor), simulación de dinámica cuántica', 'Teoremas sobre el algoritmo cuántico; la dificultad clásica no está demostrada'],
              ['Polinómica (a menudo cuadrática)', 'Búsqueda sin estructura (Grover)', 'Demostrada en el modelo de consultas [@bennett1997]'],
              ['Heurística o desconocida', 'Optimización con heurísticas cuánticas', 'En investigación: hay que compararlos experimentalmente con heurísticas clásicas'],
              ['Ninguna esperada', 'Ordenar, búsquedas con índice, tareas dominadas por la entrada/salida', 'En algunos casos hay cotas inferiores demostradas [@hoyer2001]'],
            ] },
            { type: 'p', text: 'Fíjate en el matiz de la primera fila. Que no se conozca un algoritmo clásico eficiente para factorizar no demuestra que no exista. Las ventajas «exponenciales» son relativas al estado del conocimiento (lección 1.11).' },
          ],
        },
        {
          id: 'optimizacion',
          title: 'El caso de la optimización',
          blocks: [
            { type: 'p', text: 'Planificar rutas, asignar recursos o diseñar carteras de inversión son problemas de optimización, a menudo NP-difíciles, y aparecen en muchas promesas comerciales. Existen algoritmos cuánticos heurísticos para ellos [@farhi2014], pero:' },
            { type: 'list', items: [
              'No se espera que una computadora cuántica resuelva eficientemente los problemas NP-difíciles en general (lección 1.11).',
              'Los algoritmos heurísticos deben compararse con las mejores heurísticas clásicas, que son muy buenas y llevan décadas perfeccionándose.',
              'Hasta la fecha, no hay una ventaja práctica demostrada en optimización.',
            ] },
          ],
        },
        {
          id: 'cuadraticas',
          title: 'Por qué una ventaja cuadrática puede no servir',
          blocks: [
            { type: 'p', text: 'Una ventaja cuadrática parece enorme: Grover busca entre un billón de elementos con un millón de consultas. Pero hay que considerar el coste de cada operación. Las operaciones de una computadora cuántica tolerante a fallos, con corrección de errores, son muchísimo más lentas que las de un procesador clásico. El algoritmo cuántico solo gana a partir de cierto tamaño, y ese tamaño puede ser tan grande que el cálculo dure años.' },
            { type: 'widget', id: 'advantage-calculator', caption: 'Cambia el tipo de ventaja y la ralentización de cada operación cuántica. Con una ventaja cuadrática y operaciones un millón de veces más lentas, el cuántico solo gana en cálculos de más de un cuarto de hora; con mil millones, en cálculos de décadas. Con ventajas mayores, el cruce llega mucho antes.' },
            { type: 'p', text: 'Un estudio de 2021 hizo este análisis con estimaciones realistas de la corrección de errores y concluyó que las ventajas cuadráticas no darán ventaja práctica en las primeras generaciones de computadoras tolerantes a fallos, mientras que las cuárticas parecen mucho más prometedoras [@babbush2021]. Otro análisis llega a la misma idea y la resume como una regla práctica: hacen falta <b>ventajas mayores que cuadráticas y problemas con pocos datos</b> [@hoefler2023].' },
            { type: 'callout', kind: 'model', status: 'simplificacion', text: 'La calculadora usa un modelo deliberadamente simple: un coste fijo por operación en cada máquina, sin paralelismo ni constantes propias de cada algoritmo. Sirve para entender la forma del problema, no para predecir cuándo una aplicación concreta será ventajosa.' },
          ],
        },
        {
          id: 'limites',
          title: 'Límites prácticos',
          blocks: [
            { type: 'list', items: [
              '<b>Ruido.</b> Los dispositivos actuales son ruidosos (NISQ). Proteger la información es posible, pero exige muchos qubits adicionales por cada qubit útil y hace cada operación más lenta (unidad 3.7).',
              '<b>Cargar los datos.</b> Introducir $N$ datos clásicos en un dispositivo cuántico cuesta, al menos, del orden de $N$ operaciones. Si el algoritmo cuántico era más rápido que $N$, la carga se come la ventaja [@aaronson2015; @hoefler2023].',
              '<b>Leer el resultado.</b> Medir da pocos bits por ejecución. Si la respuesta es un vector enorme, leerlo entero exige muchísimas repeticiones [@aaronson2015].',
              '<b>Tamaño del hardware.</b> Muchas aplicaciones útiles requieren millones de qubits (lección 2.3).',
            ] },
          ],
        },
        {
          id: 'complemento',
          title: 'Un complemento, no un sustituto',
          blocks: [
            { type: 'p', text: 'Todo lo anterior conduce a una conclusión: la computación cuántica es una herramienta especializada para cierta clase de problemas, con pocos datos de entrada, una estructura matemática aprovechable y un gran valor por resolverlos. Para todo lo demás, que es casi todo el software que usamos, las computadoras clásicas seguirán siendo la herramienta adecuada.' },
            { type: 'p', text: 'Incluso en los problemas en los que la parte cuántica aporta, una computadora clásica prepara los datos, envía los circuitos, corrige errores en tiempo real y procesa los resultados. Ese sistema híbrido es el tema de la lección 2.5 y del Módulo 8.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Aquí ponemos números a las ideas del nivel 1. Cada sección empieza con la idea en pocas palabras y un ejemplo; las demostraciones están en «Para profundizar», por si te interesan. Basta con aritmética.',
      sections: [
        {
          id: 'cruce',
          title: 'Cuándo empieza a ganar el algoritmo cuántico', key: 'Si cada operación cuántica es s veces más lenta, una ventaja cuadrática solo empieza a ganar a partir de un tamaño N = s².',
          blocks: [
            { type: 'p', text: 'Supongamos que una operación clásica tarda $t_c$ y una cuántica $s \\cdot t_c$, donde $s$ es la ralentización. Para una ventaja cuadrática, los tiempos son $t_c N$ y $s\\, t_c \\sqrt{N}$. El cuántico empieza a ganar cuando:' },
            { type: 'math', tex: 't_c N = s\\, t_c \\sqrt{N} \\;\\Longrightarrow\\; \\sqrt{N} = s \\;\\Longrightarrow\\; N^{*} = s^2, \\qquad T^{*} = t_c\\, s^2' },
            { type: 'p', text: 'Con $t_c = 1$ ns y $s = 10^6$: $N^* = 10^{12}$ y $T^* = 1000$ s. Con $s = 10^9$: $T^* = 10^9$ s, unos 32 años.' },
            { deep: true, type: 'p', text: 'Para una ventaja cuártica (cuántico $N^{1/4}$), $N^{3/4} = s$, es decir, $N^* = s^{4/3}$ y $T^* = t_c\\, s^{4/3}$. Con $s = 10^9$, $T^* = 10^{12} \\cdot 10^{-9} = 1000$ s. El mismo hardware que no aprovechaba una ventaja cuadrática sí aprovecha una cuártica: de ahí la recomendación de buscar ventajas mayores que cuadráticas [@babbush2021].' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'El cálculo del punto de cruce en Python.',
      sections: [
        {
          id: 'python-cruce',
          title: 'Punto de cruce para una ventaja cuadrática',
          blocks: [
            { type: 'code', lang: 'python', file: 'cruce.py', code: `segundos_por_op_clasica = 1e-9  # 1 nanosegundo
segundos_por_año = 31_557_600

for ralentizacion in [1e3, 1e6, 1e9]:  # cuántas veces más lenta es cada operación cuántica
    n_cruce = ralentizacion**2         # N = s·√N  se cumple cuando N = s²
    segundos = n_cruce * segundos_por_op_clasica
    print(f"s = {ralentizacion:.0e}: gana a partir de N = {n_cruce:.0e}, tras {segundos:.3g} s ({segundos / segundos_por_año:.2g} años)")`,
            output: `s = 1e+03: gana a partir de N = 1e+06, tras 0.001 s (3.2e-11 años)
s = 1e+06: gana a partir de N = 1e+12, tras 1e+03 s (3.2e-05 años)
s = 1e+09: gana a partir de N = 1e+18, tras 1e+09 s (32 años)` },
            { type: 'p', text: 'Prueba a cambiar <code>ralentizacion**2</code> por <code>ralentizacion**(4/3)</code> (ventaja cuártica) y vuelve a ejecutar: el tiempo de cruce pasa de años a minutos.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Una computadora cuántica acelerará cualquier programa».', reality: 'Solo problemas con una estructura concreta. Tareas como servir páginas web, ordenar o procesar grandes volúmenes de datos no se benefician.' },
    { myth: '«Una ventaja cuadrática siempre es útil».', reality: 'Por el coste de cada operación cuántica con corrección de errores, puede que solo compense para cálculos que durarían años [@babbush2021].' },
    { myth: '«La computación cuántica resolverá la optimización logística».', reality: 'Hay heurísticas cuánticas en investigación, pero no una ventaja demostrada frente a las heurísticas clásicas, y no se espera resolver eficientemente los problemas NP-difíciles en general.' },
    { myth: '«Con más datos, la ventaja cuántica es mayor».', reality: 'Al contrario: cargar datos clásicos tiene un coste que puede anular la ventaja. Los mejores candidatos son los problemas con pocos datos y mucho cómputo.' },
  ],

  summary: [
    'Las ventajas conocidas van de exponenciales (para problemas concretos, frente al mejor algoritmo clásico conocido) a cuadráticas, heurísticas o nulas.',
    'Una ventaja cuadrática puede no compensar el coste de la corrección de errores; se buscan ventajas mayores que cuadráticas [@babbush2021; @hoefler2023].',
    'Cargar los datos y leer los resultados limitan la ventaja en problemas con muchos datos [@aaronson2015].',
    'La optimización cuántica es un campo de investigación sin ventaja práctica demostrada.',
    'La computación cuántica complementa a la clásica: es una herramienta especializada dentro de sistemas híbridos.',
  ],

  exercises: [
    { level: 'comprender', question: 'Un proveedor afirma que su algoritmo cuántico acelerará el análisis de los registros de un servidor web (terabytes de texto). ¿Qué preguntas le harías?', answer: '¿Qué tipo de ventaja tiene el algoritmo y frente a qué algoritmo clásico? ¿Cómo se cargan los terabytes de datos en el dispositivo y cuánto cuesta? ¿Qué se lee al final y cuántas repeticiones hacen falta? ¿Se tiene en cuenta el coste de la corrección de errores? Con muchos datos y sin una estructura especial, lo más probable es que no haya ventaja.' },
    { level: 'matematico', question: 'Con $t_c = 1$ ns y $s = 10^{4}$, ¿a partir de qué tamaño gana un algoritmo con ventaja cuadrática y cuánto tarda en ese punto?', answer: '$N^* = s^2 = 10^8$ y $T^* = 10^8 \\cdot 10^{-9} = 0{,}1$ s.' },
    { level: 'implementar', question: 'Modifica <code>cruce.py</code> para calcular, para $s = 10^6$, el tiempo de cruce de una ventaja cuártica.', answer: 'Con <code>n_cruce = ralentizacion**(4/3)</code>: $N^* = 10^8$ y $T^* = 0{,}1$ s, frente a 1000 s con la ventaja cuadrática.' },
  ],

  references: [
    { key: 'bennett1997', use: 'La búsqueda cuántica es como mucho cuadráticamente más rápida.' },
    { key: 'hoyer2001', use: 'Cotas inferiores para ordenar y buscar en listas ordenadas.' },
    { key: 'farhi2014', use: 'Heurísticas cuánticas para optimización (QAOA).' },
    { key: 'babbush2021', use: 'Las ventajas cuadráticas no bastan con los costes realistas de la corrección de errores.' },
    { key: 'hoefler2023', use: 'Criterios prácticos: problemas con pocos datos y ventajas mayores que cuadráticas.' },
    { key: 'aaronson2015', use: 'Limitaciones de entrada y salida de datos.' },
    { key: 'shor1997', use: 'Ventaja exponencial en factorización (clasificador).' },
    { key: 'lloyd1996', use: 'Simulación eficiente de sistemas cuánticos (clasificador).' },
    { key: 'feynman1982', use: 'Motivación de la simulación (clasificador).' },
    { key: 'lee2023', use: 'Estado de la evidencia en química (clasificador).' },
    { key: 'grover1996', use: 'Búsqueda cuántica (clasificador).' },
  ],

  related: ['motivaciones-simulacion', 'limites-complejidad', 'qpu-computacion-hibrida', 'grover-problema', 'impacto-shor-grover'],
  next: 'qpu-computacion-hibrida',
};
