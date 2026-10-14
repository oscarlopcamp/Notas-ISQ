// Lección 2.2 — Historia: Feynman, Deutsch, Shor y Grover
// La cita de Feynman se comprobó en el texto del artículo de 1982. Salidas de
// código obtenidas con CPython 3.14 (2026-10-14). Los datos de la línea de tiempo
// están en content/module-02/historia-datos.js y se validan en tests/module2.test.js.

export default {
  id: 'historia-computacion-cuantica',
  title: 'Historia: Feynman, Deutsch, Shor y Grover',
  lede: 'La computación cuántica no nació de una tecnología, sino de una pregunta: ¿puede una computadora simular la naturaleza? Esta lección recorre medio siglo de ideas, de la paradoja EPR a la corrección de errores, leyendo cada hito en su fuente original y separando lo demostrado de lo prometido.',
  updated: '2026-10-14',

  context: {
    learn: 'De dónde viene la computación cuántica: la motivación de Feynman, la máquina universal de Deutsch, los primeros algoritmos (Deutsch–Jozsa, Simon, Shor, Grover), la corrección de errores y el camino hacia el hardware actual.',
    why: 'Conocer el origen de cada idea ayuda a entender por qué el campo se organiza como lo hace y a leer con criterio las afirmaciones actuales. Las promesas y las objeciones de hoy tienen precedentes.',
    previous: 'En [[>que-es-computacion-cuantica|la lección 2.1]] vimos qué es la computación cuántica y cómo la interferencia distingue el modelo cuántico de uno clásico con azar.',
    next: 'Las lecciones 2.3 y 2.4 profundizan en las motivaciones (simulación, optimización) y en las ventajas y limitaciones que esta historia anticipa. Shor y Grover se estudian a fondo en el Módulo 7.',
  },

  objectives: [
    'Explicar la motivación de Feynman y su relación con el coste exponencial de simular sistemas cuánticos.',
    'Situar en el tiempo las contribuciones de Deutsch, Deutsch–Jozsa, Simon, Shor y Grover, y lo que aportó cada una.',
    'Resolver el problema de Deutsch de forma clásica y explicar qué significa que un algoritmo cuántico use menos consultas.',
    'Explicar por qué la corrección de errores (1995) y el teorema del umbral (1997) fueron decisivos.',
    'Distinguir resultados teóricos, demostraciones experimentales y afirmaciones de ventaja cuántica.',
  ],

  prerequisites: { lessons: ['que-es-computacion-cuantica'], knowledge: ['Notación O grande y las clases P, NP y BQP (lección 1.11).'] },

  introduction: [
    { type: 'p', text: 'La historia de la computación cuántica tiene una estructura curiosa: la teoría fue décadas por delante del hardware. Los algoritmos más famosos se publicaron cuando no existía ningún dispositivo capaz de ejecutarlos, y muchas de las preguntas de entonces (¿se puede controlar el ruido?, ¿para qué problemas sirve?) siguen guiando la investigación actual.' },
    { type: 'p', text: 'Empieza explorando la línea de tiempo y vuelve a ella cuando quieras: cada hito incluye su fuente original.' },
    { type: 'widget', id: 'history-timeline', caption: 'Filtra por tipo de hito. Los colores de los puntos distinguen física, teoría, algoritmos, comunicación, corrección de errores y hardware. Cada hito indica su estatus: establecido o resultado experimental.' },
  ],

  levels: {
    comprender: {
      intro: 'Cinco capítulos de esta historia y un juego para entender el primer algoritmo cuántico.',
      sections: [
        {
          id: 'antecedentes',
          title: 'Antecedentes: una física extraña (1935–1964)',
          blocks: [
            { type: 'p', text: 'La mecánica cuántica se formuló en los años veinte y treinta del siglo pasado. En 1935, Einstein, Podolsky y Rosen señalaron que la teoría predice correlaciones tan fuertes entre sistemas separados, lo que hoy llamamos entrelazamiento, que, en su opinión, la teoría debía ser incompleta [@epr1935]. En 1964, John Bell demostró que la discusión podía resolverse con experimentos: ninguna teoría de variables ocultas locales puede reproducir todas las predicciones cuánticas [@bell1964]. Los experimentos posteriores dieron la razón a la mecánica cuántica.' },
            { type: 'p', text: 'Durante décadas, estos fenómenos se vieron como rarezas filosóficas. La idea de que pudieran ser un <em>recurso</em> para procesar información llegó más tarde.' },
          ],
        },
        {
          id: 'feynman',
          title: '¿Puede una computadora simular la naturaleza? (1980–1982)',
          blocks: [
            { type: 'p', text: 'En 1980, Paul Benioff mostró que una computadora clásica (una máquina de Turing) podía describirse como un sistema mecanocuántico [@benioff1980]: la computación era compatible con las leyes cuánticas. En 1981, en una conferencia publicada en 1982, Richard Feynman planteó la pregunta inversa. Simular un sistema cuántico con una computadora clásica parece requerir recursos que crecen exponencialmente con el tamaño del sistema, el mismo crecimiento de $2^n$ amplitudes que vimos en la lección 1.2. ¿Y si usáramos un sistema cuántico controlable para simular otros sistemas cuánticos [@feynman1982]?' },
            { type: 'quote', text: '«…nature isn’t classical, dammit, and if you want to make a simulation of nature, you’d better make it quantum mechanical, and by golly it’s a wonderful problem, because it doesn’t look so easy.»', source: 'Richard Feynman, «Simulating physics with computers» (1982), al cierre de su conferencia [@feynman1982]' },
            { type: 'p', text: 'En español: «la naturaleza no es clásica, maldita sea; si quieres simularla, más vale que lo hagas con mecánica cuántica. Y, caramba, es un problema maravilloso, porque no parece nada fácil». Esta motivación, simular la física y la química, sigue siendo una de las aplicaciones más prometedoras (lección 2.3).' },
          ],
        },
        {
          id: 'deutsch',
          title: 'La computadora cuántica universal y el primer algoritmo (1985–1992)',
          blocks: [
            { type: 'p', text: 'En 1985, David Deutsch dio el paso decisivo: definió una <b>computadora cuántica universal</b>, una máquina de Turing cuántica capaz de simular cualquier otra computadora cuántica, y planteó un primer ejemplo de tarea en la que la interferencia ofrece una ventaja [@deutsch1985]. La computación cuántica pasó de idea física a modelo de cómputo preciso.' },
            { type: 'p', text: 'El ejemplo más sencillo, conocido como el <b>problema de Deutsch</b>, cabe en un juego. Pruébalo:' },
            { type: 'widget', id: 'deutsch-game', caption: 'Una función oculta f de un bit es constante (f(0) = f(1)) o balanceada (f(0) ≠ f(1)). Juega varias partidas. ¿Puedes acertar siempre con una sola consulta?' },
            { type: 'p', text: 'Con una sola consulta, por ejemplo $f(0) = 0$, siguen siendo posibles una función constante y una balanceada: hay que acertar al azar. Cualquier algoritmo clásico que quiera estar seguro necesita <b>dos consultas</b>. El algoritmo cuántico de Deutsch (en la versión mejorada de Cleve, Ekert, Macchiavello y Mosca) responde con certeza con <b>una sola consulta</b>, aplicando la función a una superposición y usando la interferencia para que el resultado de la medición indique directamente si $f(0)$ y $f(1)$ son iguales [@nielsen2010]. No obtiene $f(0)$ ni $f(1)$: obtiene una propiedad global de la función, que es justo lo que se preguntaba.' },
            { type: 'callout', kind: 'preview', title: 'Avance: el algoritmo de Deutsch', text: 'Para entender el algoritmo hacen falta la compuerta de Hadamard y la idea de oráculo, que veremos en los módulos 3 y 7. La clave es la misma que en el interferómetro: dos «caminos» (las entradas 0 y 1) cuyas amplitudes se refuerzan o se cancelan según la función.' },
            { type: 'p', text: 'En 1992, Deutsch y Richard Jozsa lo generalizaron a funciones de $n$ bits [@deutsch1992]. El algoritmo cuántico sigue necesitando una sola consulta, mientras que un algoritmo clásico <em>determinista</em> puede necesitar $2^{n-1} + 1$. Sin embargo, como veremos en el nivel 2, un algoritmo clásico <em>aleatorio</em> resuelve el problema con pocas consultas y una probabilidad de error minúscula. La separación era real, pero frágil.' },
          ],
        },
        {
          id: 'shor-grover',
          title: 'Simon, Shor y Grover: de la curiosidad a la revolución (1993–1997)',
          blocks: [
            { type: 'p', text: 'Ethan Bernstein y Umesh Vazirani definieron la clase BQP y dieron nuevas separaciones [@bernstein1997]. En 1994, Daniel Simon encontró un problema de consultas que un algoritmo cuántico resuelve exponencialmente más rápido que <em>cualquier</em> algoritmo clásico, incluso aleatorio [@simon1997].' },
            { type: 'p', text: 'Inspirado por la estructura del algoritmo de Simon, Peter Shor publicó ese mismo año algoritmos cuánticos de tiempo polinómico para <b>factorizar enteros</b> y calcular <b>logaritmos discretos</b> [@shor1994; @shor1997]. No se conoce ningún algoritmo clásico eficiente para estos problemas, y la seguridad de RSA y de la criptografía de curva elíptica depende de su dificultad. De repente, la computación cuántica dejó de ser una curiosidad teórica: tenía consecuencias para la seguridad de las comunicaciones de todo el mundo.' },
            { type: 'p', text: 'En 1996, Lov Grover propuso un algoritmo de búsqueda sin estructura que necesita del orden de $\\sqrt{N}$ consultas en lugar de $N$ [@grover1996]. Un año después se demostró que, en ese modelo, ningún algoritmo cuántico puede hacerlo mejor [@bennett1997]. Shor y Grover marcan los dos extremos que estudiaremos en el Módulo 7: ventajas exponenciales para problemas con estructura muy particular, y ventajas cuadráticas para problemas generales.' },
          ],
        },
        {
          id: 'errores',
          title: '¿Y el ruido? La corrección de errores (1995–1997)',
          blocks: [
            { type: 'p', text: 'Tras el algoritmo de Shor llegó una objeción seria: los sistemas cuánticos son extremadamente frágiles, el ruido destruye la interferencia, y la no clonación impide proteger la información copiándola, como se hace con los bits. Parecía que una computadora cuántica grande sería imposible.' },
            { type: 'p', text: 'En 1995, el propio Shor mostró cómo codificar un qubit lógico en nueve qubits físicos de modo que ciertos errores puedan detectarse y corregirse <em>sin medir</em> la información codificada [@shor1995]. Poco después, varios grupos demostraron el <b>teorema del umbral</b>: si el error físico por operación está por debajo de cierto valor, se puede computar con una fiabilidad arbitraria a un coste razonable [@aharonov1997]. La computación cuántica a gran escala pasó de «imposible» a «extremadamente difícil de ingeniería». Lo estudiaremos en la unidad 3.7.' },
          ],
        },
        {
          id: 'hardware',
          title: 'Del papel al laboratorio (1995–hoy)',
          blocks: [
            { type: 'p', text: 'En 1995, Ignacio Cirac y Peter Zoller propusieron cómo construir compuertas cuánticas con iones atrapados [@cirac1995]. Las primeras demostraciones de algoritmos llegaron con la resonancia magnética nuclear: Grover con 2 qubits en 1998 [@chuang1998] y Shor factorizando 15 = 3 × 5 en 2001 [@vandersypen2001]. En 1999 se controló por primera vez un qubit superconductor [@nakamura1999], la tecnología que usan hoy muchos procesadores. En 2000, David DiVincenzo resumió los requisitos de una implementación física útil [@divincenzo2000].' },
            { type: 'callout', kind: 'warning', title: 'Factorizar 15 no es romper RSA', text: 'Las demostraciones de Shor con números pequeños son pruebas de concepto. Factorizar claves RSA de uso real exigiría computadoras cuánticas tolerantes a fallos, con un número de qubits y una calidad muy superiores a los actuales. Lo estudiaremos con cifras en los módulos 7 y 9.' },
            { type: 'p', text: 'La historia reciente, la era NISQ [@preskill2018], el experimento de muestreo de 2019 [@arute2019] y su respuesta clásica de 2022 [@pan2022], y la corrección de errores por debajo del umbral en 2025 [@google2025], se presentó en la lección 2.1. Muestra un patrón que conviene recordar: cada afirmación de ventaja estimula mejores algoritmos clásicos, y la frontera se mueve en ambas direcciones.' },
          ],
        },
        {
          id: 'repaso',
          title: 'Ponte a prueba',
          blocks: [
            { type: 'widget', id: 'chronology-quiz', caption: 'Ordena los hitos sin mirar la línea de tiempo. Recordar antes de consultar consolida mucho mejor lo aprendido. Pulsa «Nuevo reto» para practicar con otros hitos.' },
            { type: 'callout', kind: 'note', title: 'Lo que enseña esta historia a un ingeniero', text: 'La teoría fue décadas por delante del hardware. Las objeciones serias (el ruido) se resolvieron con ideas nuevas, no ignorándolas. Las afirmaciones de ventaja se ponen a prueba con mejores métodos clásicos. Y leer la fuente original evita repetir simplificaciones: «Shor rompe RSA» no es lo mismo que «Shor factorizó 15».' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Contamos consultas: el problema de Deutsch, Deutsch–Jozsa determinista y aleatorio, y por qué Simon y Shor fueron distintos.',
      sections: [
        {
          id: 'deutsch-formal',
          title: 'El problema de Deutsch: dos consultas clásicas',
          blocks: [
            { type: 'p', text: 'Hay $2^{2} = 4$ funciones $f : \\{0,1\\} \\to \\{0,1\\}$ (lección 1.5): dos constantes ($f \\equiv 0$, $f \\equiv 1$) y dos balanceadas (identidad y negación). Queremos decidir si $f(0) = f(1)$, es decir, calcular $f(0) \\oplus f(1)$.' },
            { type: 'steps', items: [
              { text: 'Tras consultar $f(0) = b$, las funciones compatibles son una constante ($f \\equiv b$) y una balanceada ($f(1) = 1 - b$).' },
              { text: 'Un algoritmo que responda tras una consulta acierta solo en una de esas dos funciones. Por tanto, ningún algoritmo clásico determinista resuelve el problema con una consulta.' },
              { text: 'Con dos consultas se calcula $f(0) \\oplus f(1)$ directamente.' },
            ] },
            { type: 'p', text: 'El algoritmo cuántico obtiene $f(0) \\oplus f(1)$ con una sola consulta [@nielsen2010]. No es que calcule dos valores en paralelo y nos deje leerlos: calcula una propiedad global, la paridad de los dos valores, y nada más.' },
          ],
        },
        {
          id: 'dj',
          title: 'Deutsch–Jozsa: determinista frente a aleatorio',
          blocks: [
            { type: 'p', text: 'Con $f : \\{0,1\\}^n \\to \\{0,1\\}$, que se sabe que es constante o balanceada (vale 1 en exactamente la mitad de las $2^n$ entradas) [@deutsch1992]:' },
            { type: 'list', items: [
              '<b>Clásico determinista:</b> en el peor caso hay que consultar $2^{n-1} + 1$ entradas, una más que la mitad. Con $2^{n-1}$ valores iguales todavía podría ser balanceada.',
              '<b>Cuántico:</b> 1 consulta, con certeza.',
              '<b>Clásico aleatorio:</b> consultar $k$ entradas elegidas al azar y responder «constante» si todas coinciden.',
            ] },
            { type: 'p', text: 'Si $f$ es constante, el algoritmo aleatorio nunca se equivoca. Si es balanceada, cada consulta da 0 o 1 con probabilidad $\\tfrac12$ (eligiendo con reemplazamiento), y solo se equivoca si las $k$ coinciden:' },
            { type: 'math', tex: 'P(\\text{error}) = 2 \\cdot \\left(\\tfrac12\\right)^{k} = 2^{1-k}', note: 'Con $k = 10$, el error es menor que 0,2 %, sea cual sea $n$. Con $n = 10$, el algoritmo determinista necesita 513 consultas.' },
            { type: 'p', text: 'Por eso Deutsch–Jozsa no demuestra una ventaja frente a los algoritmos clásicos que pueden equivocarse con probabilidad pequeña. El algoritmo de Simon sí: su problema exige un número exponencial de consultas incluso a los algoritmos clásicos aleatorios, mientras que el cuántico necesita un número polinómico [@simon1997]. Ese salto, y la técnica de buscar periodos, condujo a Shor.' },
          ],
        },
        {
          id: 'shor-contexto',
          title: 'Qué cambió Shor, en términos de complejidad',
          blocks: [
            { type: 'p', text: 'Para un entero de $n$ bits, los mejores algoritmos clásicos conocidos para factorizar (la criba del cuerpo de números) tienen un coste subexponencial, del orden de $\\exp\\big(\\Theta(n^{1/3} (\\log n)^{2/3})\\big)$, mientras que el algoritmo de Shor es polinómico en $n$ [@nielsen2010; @shor1997]. Dos matices importan:' },
            { type: 'list', items: [
              'La ventaja es frente al mejor algoritmo clásico <em>conocido</em>; no está demostrado que factorizar sea difícil para las computadoras clásicas.',
              'La factorización no se cree NP-completa, así que el algoritmo de Shor no implica que las computadoras cuánticas resuelvan eficientemente los problemas NP-completos (lección 1.11).',
            ] },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Comprobamos con Python el argumento clásico del problema de Deutsch y la probabilidad de error del algoritmo aleatorio de Deutsch–Jozsa.',
      sections: [
        {
          id: 'python-deutsch',
          title: 'Una consulta no basta',
          blocks: [
            { type: 'code', lang: 'python', file: 'deutsch_clasico.py', code: `funciones = {
    "constante 0": lambda x: 0,
    "constante 1": lambda x: 1,
    "identidad": lambda x: x,
    "negación": lambda x: 1 - x,
}
for nombre, f in funciones.items():
    tipo = "constante" if f(0) == f(1) else "balanceada"
    print(f"{nombre:12} f(0)={f(0)} f(1)={f(1)} -> {tipo}")

compatibles = [n for n, f in funciones.items() if f(0) == 0]
print("si f(0) = 0, puede ser:", compatibles)`,
            output: `constante 0  f(0)=0 f(1)=0 -> constante
constante 1  f(0)=1 f(1)=1 -> constante
identidad    f(0)=0 f(1)=1 -> balanceada
negación     f(0)=1 f(1)=0 -> balanceada
si f(0) = 0, puede ser: ['constante 0', 'identidad']` },
            { type: 'p', text: 'Tras la consulta $f(0) = 0$ quedan una función constante y una balanceada: el argumento del nivel 2, verificado por enumeración.' },
          ],
        },
        {
          id: 'python-dj',
          title: 'El algoritmo aleatorio de Deutsch–Jozsa',
          blocks: [
            { type: 'code', lang: 'python', file: 'deutsch_jozsa_aleatorio.py', code: `import random


def prueba_aleatoria(f, n, k):
    """Consulta k entradas al azar y responde «constante» si todas dan lo mismo."""
    valores = {f(random.getrandbits(n)) for _ in range(k)}
    return "constante" if len(valores) == 1 else "balanceada"


n = 10
balanceada = lambda x: x & 1  # vale 1 en exactamente la mitad de las 2^n entradas
random.seed(2026)
for k in [1, 2, 5, 10]:
    errores = sum(prueba_aleatoria(balanceada, n, k) == "constante" for _ in range(100_000))
    print(f"k = {k:2}: error observado {errores / 100_000:.4f}, cota 2^(1-k) = {2 ** (1 - k):.4f}")
print("consultas deterministas en el peor caso:", 2 ** (n - 1) + 1)`,
            output: `k =  1: error observado 1.0000, cota 2^(1-k) = 1.0000
k =  2: error observado 0.4983, cota 2^(1-k) = 0.5000
k =  5: error observado 0.0630, cota 2^(1-k) = 0.0625
k = 10: error observado 0.0019, cota 2^(1-k) = 0.0020
consultas deterministas en el peor caso: 513` },
            { type: 'list', items: [
              '<b><code>random.getrandbits(n)</code></b> elige una entrada de $n$ bits al azar (con reemplazamiento).',
              '<b><code>x &amp; 1</code></b> es una función balanceada: vale 1 en las entradas impares, que son exactamente la mitad.',
              'Las frecuencias observadas en 100 000 repeticiones coinciden con $2^{1-k}$ salvo fluctuaciones estadísticas. Con $k = 1$ siempre responde «constante», así que con una función balanceada falla siempre.',
              'Con 10 consultas aleatorias, el error es del 0,2 %, frente a las 513 que exige el algoritmo determinista: la ventaja cuántica de Deutsch–Jozsa no se mantiene frente al azar clásico.',
            ] },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Feynman inventó la computadora cuántica».', reality: 'Feynman planteó la motivación (simular la naturaleza) en 1982. Benioff había descrito antes un modelo cuántico de máquina de Turing, y Deutsch definió en 1985 la computadora cuántica universal. Es una historia con muchos protagonistas.' },
    { myth: '«El algoritmo de Deutsch calcula f(0) y f(1) a la vez».', reality: 'Solo obtiene $f(0) \\oplus f(1)$, una propiedad global. Si se intentara leer ambos valores, la medición daría solo uno.' },
    { myth: '«Desde 1994 RSA está roto».', reality: 'Shor demostró que una computadora cuántica suficientemente grande y fiable rompería RSA. Las demostraciones experimentales han factorizado números muy pequeños; las claves reales siguen fuera del alcance del hardware actual, lo que no elimina el riesgo futuro (Módulo 9).' },
    { myth: '«Las demostraciones de supremacía cuántica prueban que las computadoras cuánticas ya son útiles».', reality: 'Se refieren a tareas de muestreo diseñadas para la demostración, sin aplicación práctica, y su ventaja se ha discutido con nuevos algoritmos clásicos.' },
  ],

  summary: [
    'EPR (1935) y Bell (1964) convirtieron el entrelazamiento en una predicción comprobable [@epr1935; @bell1964].',
    'Feynman (1982) propuso usar sistemas cuánticos para simular la naturaleza; Deutsch (1985) definió la computadora cuántica universal.',
    'Deutsch–Jozsa (1992) separa algoritmos cuánticos y clásicos deterministas; Simon (1994) separa también frente a los aleatorios e inspira a Shor.',
    'Shor (1994) factoriza en tiempo polinómico; Grover (1996) busca con $\\sqrt{N}$ consultas, y es óptimo.',
    'La corrección de errores (1995) y el teorema del umbral (1997) hicieron plausible la computación cuántica a gran escala; el hardware llegó después y sigue en desarrollo.',
  ],

  exercises: [
    { level: 'comprender', question: '¿Por qué el algoritmo de Shor despertó mucho más interés que el de Deutsch–Jozsa?', answer: 'Porque resuelve problemas con importancia práctica enorme (factorización y logaritmo discreto, base de RSA y de la criptografía de curva elíptica) con una ventaja exponencial frente a los mejores algoritmos clásicos conocidos, mientras que la ventaja de Deutsch–Jozsa desaparece si se permite un algoritmo clásico aleatorio con un error pequeño.' },
    { level: 'comprender', question: '¿Qué objeción respondieron la corrección de errores de Shor (1995) y el teorema del umbral (1997)?', answer: 'Que el ruido y la imposibilidad de copiar estados cuánticos harían imposible una computación cuántica fiable a gran escala. Mostraron que, por debajo de un umbral de error, se puede proteger la información con un coste razonable.' },
    { level: 'matematico', question: 'Para Deutsch–Jozsa con $n = 20$, ¿cuántas consultas necesita en el peor caso un algoritmo clásico determinista? ¿Y uno aleatorio para garantizar un error menor que $10^{-6}$?', answer: 'Determinista: $2^{19} + 1 = 524\\,289$. Aleatorio: $2^{1-k} < 10^{-6}$ exige $k - 1 > \\log_2 10^6 \\approx 19{,}9$, así que $k = 21$ consultas.' },
    { level: 'matematico', question: 'Tras consultar $f(1) = 1$ en el problema de Deutsch, ¿qué funciones quedan?', answer: 'La constante 1 y la identidad: una constante y una balanceada. Sigue sin poder decidirse con certeza.' },
    { level: 'implementar', question: 'Modifica <code>deutsch_jozsa_aleatorio.py</code> para elegir las entradas <em>sin</em> reemplazamiento (con <code>random.sample(range(2**n), k)</code>). ¿Aumenta o disminuye el error? ¿Por qué?', answer: 'Disminuye ligeramente: sin reemplazamiento, tras ver valores iguales es un poco menos probable que el siguiente coincida, porque quedan menos entradas con ese valor. Para $n = 10$ la diferencia es pequeña, ya que $k$ es mucho menor que $2^n$.' },
  ],

  references: [
    { key: 'epr1935', use: 'Argumento EPR.' },
    { key: 'bell1964', use: 'Desigualdades de Bell.' },
    { key: 'benioff1980', use: 'Modelo mecanocuántico de la máquina de Turing.' },
    { key: 'feynman1982', use: 'Motivación de la simulación cuántica y cita textual (comprobada en el artículo).' },
    { key: 'deutsch1985', use: 'Computadora cuántica universal.' },
    { key: 'deutsch1992', use: 'Algoritmo de Deutsch–Jozsa.' },
    { key: 'bernstein1997', use: 'Clase BQP y separaciones.' },
    { key: 'simon1997', use: 'Separación exponencial frente a algoritmos aleatorios.' },
    { key: 'shor1994', use: 'Algoritmos de factorización y logaritmo discreto.' },
    { key: 'shor1997', use: 'Versión en revista del algoritmo de Shor.' },
    { key: 'grover1996', use: 'Búsqueda cuántica.' },
    { key: 'bennett1997', use: 'Optimalidad de la búsqueda cuántica.' },
    { key: 'shor1995', use: 'Primer código de corrección de errores cuántico.' },
    { key: 'aharonov1997', use: 'Teorema del umbral.' },
    { key: 'cirac1995', use: 'Propuesta de iones atrapados.' },
    { key: 'chuang1998', use: 'Grover experimental en RMN.' },
    { key: 'nakamura1999', use: 'Primer qubit superconductor.' },
    { key: 'divincenzo2000', use: 'Criterios de DiVincenzo.' },
    { key: 'vandersypen2001', use: 'Factorización de 15 en RMN.' },
    { key: 'preskill2018', use: 'Era NISQ.' },
    { key: 'arute2019', use: 'Experimento de muestreo de 2019.' },
    { key: 'pan2022', use: 'Simulación clásica posterior.' },
    { key: 'google2025', use: 'Corrección de errores bajo el umbral.' },
    { key: 'nielsen2010', use: 'Algoritmo de Deutsch y coste de la factorización clásica.' },
    { key: 'wootters1982', use: 'No clonación (línea de tiempo).' },
    { key: 'dieks1982', use: 'No clonación (línea de tiempo).' },
    { key: 'wiesner1983', use: 'Codificación conjugada (línea de tiempo).' },
    { key: 'bennett2014', use: 'BB84 (línea de tiempo).' },
    { key: 'ekert1991', use: 'E91 (línea de tiempo).' },
    { key: 'bennett1993', use: 'Teleportación (línea de tiempo).' },
    { key: 'fips203', use: 'Estándares de criptografía poscuántica (línea de tiempo).' },
    { key: 'fips204', use: 'Estándares de criptografía poscuántica (línea de tiempo).' },
    { key: 'fips205', use: 'Estándares de criptografía poscuántica (línea de tiempo).' },
  ],

  related: ['que-es-computacion-cuantica', 'motivaciones-simulacion', 'ventajas-y-limitaciones', 'grover-problema', 'shor-motivacion', 'qubits-logicos'],
  next: 'motivaciones-simulacion',
};
