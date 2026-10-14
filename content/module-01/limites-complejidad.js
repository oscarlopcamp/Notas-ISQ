// Lección 1.11 — Limitaciones de la computación clásica e introducción a la complejidad
// Salidas de código obtenidas con CPython 3.14 (2026-10-14). Recuentos de rutas
// y tiempos verificados también en tests/module1.test.js.

export default {
  id: 'limites-complejidad',
  title: 'Limitaciones de la computación clásica e introducción a la complejidad',
  lede: 'Hay problemas que ninguna computadora puede resolver, y otros que en teoría sí, pero tardaría más que la edad del universo. Esta lección distingue ambos tipos de límite, presenta las herramientas para medir la dificultad de un problema y explica, con precisión, qué podría aportar y qué no la computación cuántica.',
  updated: '2026-10-14',

  context: {
    learn: 'La notación O grande, el crecimiento polinómico frente al exponencial, las clases P y NP, los problemas indecidibles (el problema de la parada), los límites físicos del hardware y una primera visión, cuidadosa, de la complejidad cuántica.',
    why: 'Es la pregunta que motiva la computación cuántica: ¿hay problemas que una computadora clásica no puede resolver eficientemente y una cuántica sí? Responderla con rigor exige separar lo demostrado de lo conjeturado, algo que haremos durante todo el curso.',
    previous: 'A lo largo del módulo hemos medido costes: el acarreo en cadena tarda $O(n)$ (lección 1.7), la cuenta atrás ejecuta $4n + 2$ instrucciones (1.9) y la recursión usa memoria proporcional a $n$ (1.10).',
    next: 'El Módulo 2 empieza aquí: veremos por qué Feynman propuso usar sistemas cuánticos para simular la naturaleza y qué problemas concretos motivan la computación cuántica.',
  },

  objectives: [
    'Usar la notación O grande para comparar algoritmos y reconocer el crecimiento exponencial.',
    'Explicar las clases P y NP y por qué la pregunta P = NP sigue abierta.',
    'Distinguir un problema intratable de uno indecidible, con el problema de la parada como ejemplo.',
    'Describir los límites físicos que frenan la mejora del hardware clásico.',
    'Explicar qué se sabe y qué no sobre la ventaja de la computación cuántica, sin exagerarla.',
  ],

  prerequisites: { lessons: ['ejecucion-programas'], knowledge: ['Funciones exponenciales y logaritmos (lecciones 1.1 y 1.2).'] },

  introduction: [
    { type: 'p', text: 'Las computadoras son cada vez más rápidas. ¿Significa eso que, con paciencia y hardware suficiente, cualquier problema acabará resolviéndose? La respuesta es no, por dos motivos muy distintos. Algunos problemas son <em>imposibles</em>: no existe ningún algoritmo que los resuelva. Otros son posibles en principio, pero los mejores algoritmos conocidos necesitan un tiempo que crece tan deprisa con el tamaño del problema que ninguna mejora del hardware basta.' },
    { type: 'p', text: 'Para hablar de esto con precisión necesitamos medir el coste de los algoritmos. Empecemos por ahí.' },
  ],

  levels: {
    comprender: {
      intro: 'El crecimiento de los costes, un problema que explota y los dos tipos de límite.',
      sections: [
        {
          id: 'crecimiento',
          title: 'No importa la velocidad, importa el crecimiento',
          blocks: [
            { type: 'p', text: 'Para comparar algoritmos no medimos segundos, que dependen de la máquina, sino cómo crece el número de operaciones con el tamaño de la entrada $n$. Un algoritmo $O(n)$ hace un trabajo proporcional a $n$; uno $O(n^2)$, proporcional a $n^2$; uno $O(2^n)$ duplica su trabajo cada vez que $n$ aumenta en 1. Esta es la [[o-grande|notación O grande]] [@cormen2022].' },
            { type: 'widget', id: 'growth-race', options: { n: 30 }, caption: 'Mueve el tamaño $n$ y observa cuánto tardaría cada tipo de algoritmo con una máquina de mil millones de operaciones por segundo. Con $n = 60$, un algoritmo $2^n$ tarda unos 36 años; con $n = 100$, $n!$ supera con mucho la edad del universo.' },
            { type: 'p', text: 'La lección es contundente: para los algoritmos exponenciales, una máquina mil veces más rápida solo permite aumentar $n$ en unas 10 unidades ($2^{10} \\approx 1000$). El hardware no rescata a un mal crecimiento. Por eso la frontera importante es la que separa los algoritmos <b>polinómicos</b> ($n$, $n^2$, $n^3$…) de los <b>exponenciales</b> ($2^n$, $n!$…).' },
          ],
        },
        {
          id: 'viajante',
          title: 'Un problema que explota: el viajante',
          blocks: [
            { type: 'p', text: 'Un repartidor debe visitar $n$ ciudades y volver al punto de partida recorriendo la menor distancia posible. La forma obvia de resolverlo es probarlas todas. Pero el número de rutas distintas es $(n-1)!/2$: 12 con 5 ciudades, 181 440 con 10 y más de $6 \\times 10^{16}$ con 20.' },
            { type: 'widget', id: 'tsp-brute', options: { n: 7 }, caption: 'Pulsa el botón: tu navegador prueba de verdad todas las rutas y mide cuánto tarda. Después sube a 9 o 10 ciudades y observa cómo crece el tiempo. La línea discontinua es una heurística rápida (ir siempre a la ciudad más cercana), que a menudo da una buena ruta pero no garantiza la mejor.' },
            { type: 'p', text: 'Nadie conoce un algoritmo que resuelva este problema de forma exacta y eficiente para cualquier entrada. En la práctica se usan heurísticas y algoritmos aproximados que dan buenas soluciones sin garantizar la óptima. Es el día a día de la ingeniería: cuando el problema exacto es intratable, se cambia la pregunta.' },
          ],
        },
        {
          id: 'p-np',
          title: 'Encontrar frente a comprobar: P y NP',
          blocks: [
            { type: 'p', text: 'Observa una asimetría curiosa. Encontrar la ruta más corta parece dificilísimo, pero si alguien te da una ruta y te dice «mide menos de 100 km», comprobarlo es fácil: sumas las distancias. Muchos problemas tienen esta forma: difíciles de resolver, fáciles de verificar. Un sudoku es otro ejemplo.' },
            { type: 'list', items: [
              '<b>P</b> es la clase de problemas (de decisión, con respuesta sí o no) que se pueden <em>resolver</em> en tiempo polinómico.',
              '<b>NP</b> es la clase de problemas cuyas soluciones se pueden <em>verificar</em> en tiempo polinómico.',
            ] },
            { type: 'p', text: 'Todo problema de P está en NP (si sabes resolverlo, sabes verificarlo). ¿Son la misma clase? Es decir, ¿todo lo que se verifica rápido se resuelve rápido? Esta es la pregunta [[p-np|P frente a NP]], una de las más importantes de la matemática y la informática. Sigue abierta, aunque la gran mayoría de los especialistas cree que P ≠ NP [@arora2009]. Ciertos problemas, llamados NP-completos, son los «más difíciles» de NP: si uno de ellos tuviera un algoritmo polinómico, todos los de NP lo tendrían. El primero identificado fue el problema de satisfacibilidad lógica (SAT) [@cook1971], y la versión de decisión del viajante también lo es [@arora2009].' },
            { type: 'callout', kind: 'note', status: 'abierto', title: 'Problema abierto', text: 'Que P ≠ NP <em>no está demostrado</em>. Cuando decimos que un problema NP-completo es «intratable», queremos decir que no se conoce ningún algoritmo polinómico y que se cree que no existe.' },
          ],
        },
        {
          id: 'indecidible',
          title: 'Lo imposible: el problema de la parada',
          blocks: [
            { type: 'p', text: 'Más allá de lo difícil está lo imposible. En 1936, Alan Turing demostró que no existe ningún programa capaz de decidir, para cualquier programa y cualquier entrada, si ese programa terminará o se quedará en un bucle infinito [@turing1937]. Es el [[problema-de-la-parada|problema de la parada]].' },
            { type: 'p', text: 'No es cuestión de velocidad ni de memoria: ninguna computadora, ni clásica ni cuántica, puede resolverlo en general. Esto tiene consecuencias prácticas para la ingeniería de software: ningún analizador automático puede detectar <em>todos</em> los bucles infinitos o <em>todos</em> los errores de un programa. Las herramientas de verificación siempre hacen concesiones: dan falsos avisos, dejan casos sin cubrir o se restringen a programas de cierta forma.' },
            { type: 'callout', kind: 'note', status: 'establecido', title: 'Computable no es lo mismo que eficiente', text: 'Una computadora cuántica puede simularse con una clásica (con un coste enorme, como vimos en la lección 1.2). Por eso no puede resolver problemas indecidibles: lo que es computable es lo mismo en ambos modelos [@deutsch1985; @nielsen2010]. La pregunta interesante es si cambia lo que se puede calcular <em>eficientemente</em>.' },
          ],
        },
        {
          id: 'limites-fisicos',
          title: 'Los límites del hardware',
          blocks: [
            { type: 'p', text: 'Durante décadas, el rendimiento de los procesadores creció de forma exponencial. En 1965, Gordon Moore observó que el número de componentes por circuito integrado se duplicaba a un ritmo regular [@moore1965], y durante años, al reducirse los transistores, también se pudo aumentar la frecuencia del reloj sin disparar el consumo por unidad de área (el escalado de Dennard [@dennard1974]).' },
            { type: 'p', text: 'Ese escalado de Dennard terminó a mediados de la década de 2000, y el ritmo de la ley de Moore se ha frenado [@hennessy2019]. Por eso los procesadores ya no ganan velocidad de reloj de forma notable y, en su lugar, añaden núcleos y circuitos especializados (para gráficos, para inteligencia artificial…). La computación cuántica forma parte de esa búsqueda de hardware especializado para ciertos problemas, no de un sustituto general.' },
          ],
        },
        {
          id: 'cuantica',
          title: '¿Qué podría aportar la computación cuántica?',
          blocks: [
            { type: 'p', text: 'Con todo lo anterior podemos formular la pregunta con precisión. Existe una clase de complejidad para los problemas que una computadora cuántica resuelve eficientemente (con probabilidad de error acotada), llamada [[bqp|BQP]] [@bernstein1997]. Esto es lo que se sabe, y lo que no:' },
            { type: 'figure', id: 'complexity-classes', caption: '<b>Figura 1.</b> Relaciones entre clases. Demostrado: P ⊆ NP y P ⊆ BQP, y la factorización está en BQP (algoritmo de Shor). Conjeturado, pero <em>no demostrado</em>: P ≠ NP, la factorización no está en P y los problemas NP-completos no están en BQP. El dibujo representa las relaciones que se creen ciertas.' },
            { type: 'list', items: [
              '<b>Ventajas exponenciales para problemas concretos.</b> El algoritmo de Shor factoriza enteros en tiempo polinómico [@shor1997], mientras que no se conoce ningún algoritmo clásico polinómico para ello. La simulación de sistemas cuánticos, la motivación original de Feynman [@feynman1982], es otro ejemplo.',
              '<b>Ventajas más modestas para problemas generales.</b> Para la búsqueda sin estructura, el algoritmo de Grover reduce el número de consultas de $N$ a aproximadamente $\\sqrt{N}$, y se ha demostrado que, en ese modelo, ningún algoritmo cuántico puede hacerlo mejor [@grover1996; @bennett1997]. Es una mejora cuadrática, no exponencial.',
              '<b>Sin atajo general para los problemas NP-completos.</b> No se conoce ningún algoritmo cuántico eficiente para ellos, y el resultado anterior sugiere que la fuerza bruta no se acelera exponencialmente. Que NP-completo esté fuera de BQP es una conjetura, no un teorema.',
            ] },
            { type: 'callout', kind: 'misconception', title: 'Lo que la computación cuántica no hace', text: 'Una computadora cuántica no «prueba todas las soluciones a la vez y lee la correcta». Ese malentendido llevaría a pensar que resuelve el viajante instantáneamente. En los módulos 3 y 7 veremos por qué: la medición devuelve un único resultado, y los algoritmos cuánticos útiles deben usar la interferencia para que la respuesta correcta sea probable.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Definiciones formales, una comparación rigurosa de crecimientos y la demostración de Turing.',
      sections: [
        {
          id: 'o-formal',
          title: 'La notación O grande',
          blocks: [
            { type: 'math', tex: 'f(n) = O(g(n)) \\iff \\exists\\, c > 0,\\; n_0 :\\; f(n) \\le c\\, g(n) \\;\\; \\forall n \\ge n_0', note: 'Se ignoran las constantes ($c$) y los valores pequeños de $n$ ($n_0$): solo importa el crecimiento a largo plazo [@cormen2022].' },
            { type: 'p', text: 'Ejemplo: $f(n) = 4n + 2$ (la cuenta atrás de la lección 1.9) es $O(n)$: con $c = 5$ y $n_0 = 2$, se cumple $4n + 2 \\le 5n$ para todo $n \\ge 2$.' },
          ],
        },
        {
          id: 'exponencial',
          title: 'Lo exponencial acaba ganando',
          blocks: [
            { type: 'p', text: 'Para cualquier exponente fijo $k$, $n^k = O(2^n)$, pero $2^n$ no es $O(n^k)$. Una forma de verlo es con logaritmos:' },
            { type: 'math', tex: '\\log_2(n^k) = k \\log_2 n, \\qquad \\log_2(2^n) = n, \\qquad \\lim_{n \\to \\infty} \\frac{k \\log_2 n}{n} = 0' },
            { type: 'p', text: 'El logaritmo de $n^k$ crece mucho más despacio que el de $2^n$, así que a partir de cierto $n$ la exponencial supera a cualquier polinomio. Por ejemplo, $n^{10}$ es mayor que $2^n$ para $n = 10$ ($10^{10}$ frente a $1024$), pero a partir de $n = 59$ ya es menor.' },
            { type: 'p', text: 'El número de rutas del viajante crece aún más deprisa. Por la fórmula de Stirling, $n! \\approx \\sqrt{2\\pi n}\\,(n/e)^n$, que supera a $c^n$ para cualquier constante $c$.' },
          ],
        },
        {
          id: 'np-formal',
          title: 'P y NP con verificadores',
          blocks: [
            { type: 'p', text: 'Un problema de decisión $L$ está en NP si existe un algoritmo verificador $V$ de tiempo polinómico y un polinomio $p$ tales que [@arora2009; @sipser2013]:' },
            { type: 'math', tex: 'x \\in L \\iff \\exists\\, w,\\; |w| \\le p(|x|) : V(x, w) = 1', note: '$w$ es el «certificado»: por ejemplo, una ruta concreta. $V$ comprueba que es válida y que cumple la condición pedida.' },
            { type: 'p', text: 'Probar todos los certificados posibles resuelve cualquier problema de NP, pero hay hasta $2^{p(n)}$ certificados: tiempo exponencial. La pregunta P = NP es si siempre existe una forma radicalmente mejor.' },
          ],
        },
        {
          id: 'parada',
          title: 'La demostración de Turing (esquema)',
          blocks: [
            { type: 'p', text: 'Supongamos, por reducción al absurdo, que existe una función <code>para(P, x)</code> que devuelve siempre, en tiempo finito, si el programa <code>P</code> termina con la entrada <code>x</code> [@turing1937; @sipser2013].' },
            { type: 'steps', items: [
              { text: 'Construimos un programa <code>D(P)</code> que hace lo contrario de lo que predice <code>para</code> cuando un programa se recibe a sí mismo: si <code>para(P, P)</code> es verdadero, <code>D</code> entra en un bucle infinito; si es falso, <code>D</code> termina.' },
              { text: 'Preguntamos qué hace <code>D(D)</code>. Si <code>D(D)</code> termina, es porque <code>para(D, D)</code> dijo que no termina: contradicción.' },
              { text: 'Si <code>D(D)</code> no termina, es porque <code>para(D, D)</code> dijo que termina: contradicción.' },
              { text: 'En ambos casos llegamos a una contradicción, así que <code>para</code> no puede existir. ∎' },
            ] },
            { type: 'p', text: 'Es un argumento de <em>diagonalización</em>, el mismo tipo de razonamiento que usó Cantor para demostrar que hay infinitos de distintos tamaños.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Contamos rutas y tiempos con Python y escribimos, como ejercicio de pensamiento, el programa imposible de Turing.',
      sections: [
        {
          id: 'python-rutas',
          title: 'Cuántas rutas hay',
          blocks: [
            { type: 'code', lang: 'python', file: 'rutas.py', code: `from math import factorial

for n in [5, 10, 15, 20]:
    print(n, factorial(n - 1) // 2)`,
            output: `5 12
10 181440
15 43589145600
20 60822550204416000` },
          ],
        },
        {
          id: 'python-tiempos',
          title: 'Cuánto tarda un algoritmo exponencial',
          blocks: [
            { type: 'code', lang: 'python', file: 'tiempos.py', code: `OPERACIONES_POR_SEGUNDO = 1e9
SEGUNDOS_POR_AÑO = 3600 * 24 * 365.25

for n in [10, 30, 50, 70, 90]:
    t = 2**n / OPERACIONES_POR_SEGUNDO
    print(f"n = {n:2}: {t:9.3g} s = {t / SEGUNDOS_POR_AÑO:9.3g} años")`,
            output: `n = 10:  1.02e-06 s =  3.24e-14 años
n = 30:      1.07 s =   3.4e-08 años
n = 50:  1.13e+06 s =    0.0357 años
n = 70:  1.18e+12 s =  3.74e+04 años
n = 90:  1.24e+18 s =  3.92e+10 años` },
            { type: 'p', text: 'Pasar de $n = 50$ (unos 13 días) a $n = 90$ (unos 39 000 millones de años, casi tres veces la edad del universo) solo exige 40 elementos más en la entrada.' },
          ],
        },
        {
          id: 'python-parada',
          title: 'El programa imposible',
          blocks: [
            { type: 'p', text: 'Este código no se puede ejecutar, porque <code>para</code> no existe. Escribirlo ayuda a ver por qué la demostración funciona.' },
            { type: 'code', lang: 'python', file: 'parada.py', code: `def para(programa, entrada) -> bool:
    """Supuesto oráculo: True si programa(entrada) termina. No puede existir."""
    ...


def D(programa):
    if para(programa, programa):
        while True:      # si se predice que termina, no termina
            pass
    return               # si se predice que no termina, termina

# ¿Qué haría D(D)? Cualquier respuesta de para(D, D) es incorrecta.`, note: 'Ilustración de la demostración; no tiene salida porque <code>para</code> no se puede implementar.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Con computadoras suficientemente rápidas, todo problema se resuelve».', reality: 'Hay problemas indecidibles, como el de la parada, que ninguna computadora puede resolver, y problemas cuyo coste exponencial hace inútil cualquier mejora previsible del hardware.' },
    { myth: '«Está demostrado que P ≠ NP».', reality: 'Es una conjetura ampliamente aceptada, pero sigue siendo un problema abierto.' },
    { myth: '«Las computadoras cuánticas resolverán eficientemente los problemas NP-completos».', reality: 'No se conoce ningún algoritmo cuántico eficiente para ellos, y para la búsqueda sin estructura se ha demostrado que la mejora cuántica es como mucho cuadrática.' },
    { myth: '«Una computadora cuántica puede resolver problemas que ninguna clásica puede resolver».', reality: 'Lo computable es lo mismo en ambos modelos. La posible diferencia está en la eficiencia, y solo para ciertos problemas.' },
    { myth: '«Todos los algoritmos cuánticos son exponencialmente más rápidos».', reality: 'Algunos ofrecen ventajas exponenciales para problemas muy concretos (factorización), otros solo cuadráticas (búsqueda), y para muchos problemas no hay ventaja conocida.' },
  ],

  summary: [
    'La notación O grande compara algoritmos por su crecimiento; lo exponencial supera a cualquier polinomio [@cormen2022].',
    'P: resoluble en tiempo polinómico; NP: verificable en tiempo polinómico. P ⊆ NP, y si son iguales sigue abierto [@arora2009].',
    'El problema de la parada es indecidible [@turing1937]: un límite de lo computable, no de la velocidad.',
    'El escalado de Dennard terminó y la ley de Moore se ha frenado: el futuro del hardware pasa por la especialización [@hennessy2019].',
    'La computación cuántica no cambia lo computable; puede cambiar lo eficientemente computable para ciertos problemas (BQP), con ventajas exponenciales demostradas solo frente a los mejores algoritmos clásicos conocidos.',
  ],

  exercises: [
    { level: 'comprender', question: 'Un algoritmo $O(2^n)$ resuelve en un segundo instancias de tamaño 40. Si la máquina fuera 1000 veces más rápida, ¿qué tamaño resolvería en un segundo?', answer: 'Unos 50: como $2^{10} \\approx 1000$, la mejora solo permite añadir unas 10 unidades a $n$.' },
    { level: 'comprender', question: '¿Por qué un compilador no puede avisar de todos los bucles infinitos de un programa?', answer: 'Porque eso resolvería el problema de la parada, que es indecidible. Los compiladores y analizadores detectan casos concretos, pero no todos.' },
    { level: 'matematico', question: 'Demuestra que $3n^2 + 10n + 5 = O(n^2)$.', answer: 'Para $n \\ge 1$: $3n^2 + 10n + 5 \\le 3n^2 + 10n^2 + 5n^2 = 18n^2$. Con $c = 18$ y $n_0 = 1$ se cumple la definición.' },
    { level: 'matematico', question: 'Grover necesita del orden de $\\sqrt{N}$ consultas. Para buscar una clave entre $N = 2^{128}$, ¿cuántas consultas son eso? ¿Qué relación tiene con la seguridad de las claves de 128 bits?', answer: '$\\sqrt{2^{128}} = 2^{64}$ consultas. Por eso se dice que Grover «reduce a la mitad» los bits de seguridad efectivos de una clave simétrica; lo analizaremos con cuidado en el Módulo 9.' },
    { level: 'implementar', question: 'Modifica <code>tiempos.py</code> para calcular el mayor $n$ tal que $2^n$ operaciones caben en un año a $10^9$ operaciones por segundo.', answer: '<pre><code>import math\nprint(math.floor(math.log2(1e9 * 3600 * 24 * 365.25)))</code></pre>Da 54: $2^{54} \\approx 1{,}8 \\times 10^{16}$ operaciones, unos 0,57 años; $2^{55}$ ya supera un año.' },
  ],

  references: [
    { key: 'cormen2022', use: 'Notación asintótica y análisis de algoritmos.' },
    { key: 'sipser2013', use: 'Problema de la parada y clases P y NP.' },
    { key: 'arora2009', use: 'P, NP, NP-completitud, BQP y el estado abierto de P frente a NP.' },
    { key: 'cook1971', use: 'SAT como primer problema NP-completo.' },
    { key: 'turing1937', use: 'Indecidibilidad del problema de la parada.' },
    { key: 'deutsch1985', use: 'Computadora cuántica universal y principio de Church–Turing.' },
    { key: 'nielsen2010', use: 'Una computadora cuántica puede simularse clásicamente (con coste exponencial).' },
    { key: 'moore1965', use: 'Ley de Moore.' },
    { key: 'dennard1974', use: 'Escalado de Dennard.' },
    { key: 'hennessy2019', use: 'Fin del escalado de Dennard y desaceleración de la ley de Moore.' },
    { key: 'bernstein1997', use: 'Definición de BQP.' },
    { key: 'shor1997', use: 'Factorización en tiempo polinómico cuántico.' },
    { key: 'grover1996', use: 'Búsqueda con $O(\\sqrt{N})$ consultas.' },
    { key: 'bennett1997', use: 'Optimalidad de la búsqueda cuántica: no hay atajo exponencial genérico.' },
    { key: 'feynman1982', use: 'Simulación de sistemas cuánticos como motivación.' },
  ],

  related: ['ejecucion-programas', 'que-es-computacion-cuantica', 'motivaciones-simulacion', 'ventajas-y-limitaciones', 'grover-problema', 'impacto-shor-grover'],
  next: 'que-es-computacion-cuantica',
};
