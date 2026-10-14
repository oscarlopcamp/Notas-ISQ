// Lección 2.1 — ¿Qué es la computación cuántica?
// Salidas de código obtenidas con CPython 3.14 (2026-10-14). Las probabilidades
// del interferómetro se comprueban en tests/module2.test.js.

export default {
  id: 'que-es-computacion-cuantica',
  title: '¿Qué es la computación cuántica?',
  lede: 'Antes de hablar de qubits y compuertas conviene responder a la pregunta de fondo: ¿qué tiene de distinto la computación cuántica? Esta lección lo explica con un experimento real, enviar fotones de uno en uno por un interferómetro, y separa con cuidado lo que la computación cuántica es de lo que se suele decir de ella.',
  updated: '2026-10-14',

  context: {
    learn: 'Una definición precisa de la computación cuántica, la comparación punto por punto con la computación clásica, el fenómeno de la interferencia observado con fotones individuales y el estado actual de la tecnología.',
    why: 'Todo el resto del curso se apoya en esta distinción. Sin ella es fácil caer en las simplificaciones engañosas más extendidas («prueba todas las soluciones a la vez», «es más rápida para todo»), que llevan a malas decisiones de ingeniería.',
    previous: 'El Módulo 1 terminó con los límites de la computación clásica ([[>limites-complejidad|lección 1.11]]): problemas intratables, el coste exponencial de simular sistemas cuánticos y la clase BQP.',
    next: 'La lección 2.2 cuenta cómo surgieron estas ideas, de Feynman a Shor y Grover. El Módulo 3 formaliza el qubit, la superposición, la interferencia y la medición que aquí se presentan de forma intuitiva.',
  },

  objectives: [
    'Definir la computación cuántica sin recurrir a simplificaciones engañosas.',
    'Comparar bit y qubit en cinco aspectos: estado, lectura, copia, operaciones y errores.',
    'Describir el experimento del interferómetro y explicar por qué un modelo de probabilidades clásicas no basta para explicarlo.',
    'Explicar la idea de amplitud y la diferencia entre sumar probabilidades y sumar amplitudes.',
    'Situar la tecnología actual (NISQ) y distinguir resultados establecidos, experimentales y abiertos.',
  ],

  prerequisites: { lessons: ['limites-complejidad'], knowledge: ['Probabilidad elemental: si dos sucesos independientes tienen probabilidad 1/2, ambos ocurren con probabilidad 1/4.'] },

  introduction: [
    { type: 'p', text: 'Una forma habitual de presentar la computación cuántica es: «los bits clásicos valen 0 o 1, pero los qubits valen 0 y 1 a la vez, así que una computadora cuántica prueba todas las soluciones simultáneamente». Es una frase atractiva y casi todo en ella es engañoso. Si fuera cierta, una computadora cuántica resolvería instantáneamente el problema del viajante, y no es así.' },
    { type: 'p', text: 'En esta lección construiremos una idea más precisa. No necesitaremos todavía ecuaciones: nos basta con un experimento que cualquiera puede reproducir en el simulador y que se ha realizado en laboratorios reales.' },
  ],

  levels: {
    comprender: {
      intro: 'Un experimento, una comparación con lo clásico y un panorama honesto de la tecnología.',
      sections: [
        {
          id: 'definicion',
          title: 'Una definición honesta',
          blocks: [
            { type: 'p', text: 'La [[computacion-cuantica|computación cuántica]] es una forma de procesar información usando sistemas físicos cuyo comportamiento describe la mecánica cuántica: fotones, átomos, iones o circuitos superconductores enfriados casi al cero absoluto [@nielsen2010]. Lo esencial no es que sean pequeños ni rápidos, sino que la información que contienen se combina según reglas distintas de las de los bits.' },
            { type: 'p', text: 'Tres ideas resumen esas reglas, y las desarrollaremos a lo largo del curso:' },
            { type: 'list', items: [
              '<b>Las posibilidades se describen con amplitudes, no con probabilidades.</b> Las [[amplitud|amplitudes]] de caminos distintos se suman y pueden cancelarse: es la [[interferencia]].',
              '<b>Varios sistemas pueden estar entrelazados.</b> Su estado conjunto no se puede describir como una lista de estados individuales (Módulo 3).',
              '<b>Medir da un único resultado clásico,</b> con una probabilidad que depende de las amplitudes, y cambia el estado.',
            ] },
            { type: 'p', text: 'La unidad de información es el [[qubit]]: un sistema con dos estados base, que se escriben $|0\\rangle$ y $|1\\rangle$, y que puede estar en combinaciones de ambos. Al medirlo se obtiene un bit: 0 o 1. Un algoritmo cuántico es una receta para preparar los qubits, transformarlos con operaciones y medirlos, de modo que la interferencia haga muy probable obtener la respuesta buscada.' },
          ],
        },
        {
          id: 'experimento',
          title: 'Un experimento: fotones de uno en uno',
          blocks: [
            { type: 'p', text: 'Un <b>divisor de haz</b> es un espejo semitransparente: la mitad de la luz lo atraviesa y la otra mitad se refleja. Si enviamos un único fotón, no se divide: llega entero a uno de los dos detectores, cada uno con probabilidad 1/2 [@grangier1986]. Hasta aquí parece que el fotón «elige» un camino al azar.' },
            { type: 'p', text: 'Ahora volvemos a juntar los dos caminos con espejos y un segundo divisor de haz. Este montaje es un <b>interferómetro de Mach–Zehnder</b>. Si cada divisor eligiera al azar, cada detector recibiría la mitad de los fotones. Compruébalo:' },
            { type: 'widget', id: 'interferometer', caption: '<b>Modelo ideal</b> (divisores perfectos 50/50, sin pérdidas y con los caminos ajustados). Empieza con el «modelo clásico», envía 1000 fotones y observa el reparto. Después cambia a la «predicción cuántica», sin desfase. Luego prueba el desfase de 180°, bloquea el camino inferior y, por último, registra por qué camino va el fotón.' },
            { type: 'p', text: 'El resultado cuántico, que es el que se observa en el laboratorio, contradice la idea del fotón que elige un camino al azar:' },
            { type: 'list', items: [
              '<b>Sin desfase, todos los fotones llegan a D0 y ninguno a D1</b>, aunque se envíen de uno en uno, con mucho tiempo entre ellos.',
              '<b>Bloquear un camino hace que aparezcan fotones en D1.</b> Quitar una posibilidad hace posible un resultado que antes era imposible. Ningún modelo de «el fotón va por un camino concreto, solo que no sabemos cuál» puede explicar esto.',
              '<b>Si se registra por qué camino va cada fotón, el efecto desaparece</b> y vuelve el reparto 50/50.',
            ] },
            { type: 'callout', kind: 'note', status: 'establecido', title: 'Lo que nos enseña el experimento', text: 'No basta con asignar probabilidades a los caminos. Hay que asignarles <em>amplitudes</em>, que se suman cuando dos caminos llevan al mismo detector y que pueden cancelarse. La probabilidad se calcula al final, a partir de la amplitud total. Esta es la diferencia de fondo entre la computación cuántica y una computadora clásica con un generador de números aleatorios.' },
            { type: 'callout', kind: 'analogy', title: 'Analogía con las ondas y su límite', text: 'Las ondas en un estanque también se refuerzan o se cancelan, y la luz intensa se describe bien como una onda clásica. La sorpresa es que la interferencia aparece con fotones individuales, cada uno de los cuales llega entero a un único detector. La analogía con las ondas explica el patrón, pero no que la detección sea de partículas individuales ni por qué es probabilística.' },
          ],
        },
        {
          id: 'comparacion',
          title: 'Bit frente a qubit, punto por punto',
          blocks: [
            { type: 'p', text: 'En la lección 1.1 hicimos explícitas las propiedades del bit que solemos dar por sentadas. Ahora podemos compararlas con las del qubit. Cada fila se estudiará en detalle en el Módulo 3:' },
            { type: 'table', head: ['Aspecto', 'Bit clásico', 'Qubit'], rows: [
              ['Estado', 'Siempre 0 o 1', 'Descrito por dos amplitudes asociadas a $|0\\rangle$ y $|1\\rangle$'],
              ['Lectura', 'Leer no cambia el valor', 'Medir da 0 o 1 con cierta probabilidad y, en general, modifica el estado'],
              ['Copia', 'Se copia libremente', 'Un estado desconocido no puede copiarse (no clonación [@wootters1982])'],
              ['Varios a la vez', 'n bits: un valor de n bits', 'n qubits: el estado se describe con $2^n$ amplitudes y puede estar entrelazado'],
              ['Operaciones', 'Pueden perder información (AND)', 'Reversibles; la única operación irreversible es la medición'],
              ['Errores', 'Se controlan con umbrales y redundancia', 'Ruido y decoherencia; requieren corrección de errores cuántica'],
            ] },
            { type: 'callout', kind: 'warning', title: '$2^n$ amplitudes no son $2^n$ resultados', text: 'Describir el estado de $n$ qubits puede requerir $2^n$ amplitudes, y por eso es tan costoso simularlos (lección 1.2). Pero al medirlos se obtienen solo $n$ bits. Hay un resultado preciso, la cota de Holevo, que limita la información clásica que se puede extraer de $n$ qubits a $n$ bits [@nielsen2010]. La potencia de la computación cuántica no está en «guardar» muchos valores, sino en usar la interferencia para que el resultado medido sea útil.' },
          ],
        },
        {
          id: 'lo-que-no-es',
          title: 'Lo que la computación cuántica no es',
          blocks: [
            { type: 'list', items: [
              '<b>No es una computadora clásica más rápida.</b> Cada operación cuántica no es más rápida que una clásica; las ventajas, cuando existen, provienen de algoritmos que aprovechan la interferencia.',
              '<b>No prueba todas las soluciones y lee la buena.</b> La medición devuelve un único resultado. Sin un algoritmo que haga probable la respuesta correcta, se obtiene un resultado al azar.',
              '<b>No acelera todos los problemas.</b> Hay ventajas exponenciales conocidas para problemas concretos (factorización, simulación de sistemas cuánticos), ventajas cuadráticas para la búsqueda y ninguna ventaja conocida para muchos otros (lección 1.11).',
              '<b>No sustituirá a las computadoras clásicas.</b> En los sistemas actuales, la parte cuántica es un coprocesador: una computadora clásica prepara el trabajo, lo envía a la QPU y procesa los resultados (lección 2.5).',
              '<b>Su carácter probabilístico no se debe solo al ruido.</b> Incluso un qubit ideal, sin ningún ruido, da resultados probabilísticos al medirse. El ruido añade errores además de esa probabilidad intrínseca.',
            ] },
          ],
        },
        {
          id: 'estado-actual',
          title: '¿Dónde estamos hoy?',
          blocks: [
            { type: 'p', text: 'En 2018, John Preskill acuñó el término [[nisq|NISQ]] (<i>Noisy Intermediate-Scale Quantum</i>) para los dispositivos con decenas o cientos de qubits ruidosos, sin corrección de errores completa. Advirtió que serían herramientas valiosas para explorar la física, pero que «no cambiarán el mundo de inmediato», y que el objetivo a largo plazo es la computación cuántica tolerante a fallos [@preskill2018].' },
            { type: 'p', text: 'Desde entonces ha habido resultados experimentales notables, que conviene leer con su contexto (la lección 2.2 los sitúa en la historia):' },
            { type: 'list', items: [
              '<b>2019:</b> un procesador de 53 qubits realizó una tarea de muestreo de circuitos aleatorios en unos 200 segundos; los autores estimaron unos 10 000 años para el mejor superordenador [@arute2019]. <b>2022:</b> un nuevo método clásico resolvió ese mismo problema en unas 15 horas con 512 GPU [@pan2022]. Las afirmaciones de ventaja cuántica son relativas al mejor algoritmo clásico conocido en cada momento.',
              '<b>2025:</b> se mostró experimentalmente que, al aumentar el tamaño de un código de corrección de errores, el error lógico disminuye, como predice la teoría [@google2025]. Es un paso hacia la tolerancia a fallos, todavía lejos de las máquinas necesarias para aplicaciones como romper RSA.',
            ] },
            { type: 'callout', kind: 'note', status: 'emergente', title: 'Cómo leer las noticias', text: 'Ante un anuncio, conviene preguntarse: ¿es una tarea útil o una demostración? ¿Con qué algoritmo clásico se compara, y se ha intentado mejorarlo? ¿Los qubits están protegidos por corrección de errores? ¿Hay un artículo revisado por pares? En el Módulo 3 añadiremos criterios técnicos sobre el hardware.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Una primera cuenta con amplitudes, sin más herramientas que la aritmética. El formalismo completo (vectores y números complejos) llega en el Módulo 4.',
      sections: [
        {
          id: 'probabilidades-vs-amplitudes',
          title: 'Sumar probabilidades frente a sumar amplitudes',
          blocks: [
            { type: 'p', text: '<b>Modelo clásico.</b> En cada divisor, el fotón toma cada salida con probabilidad $\\tfrac12$. Para llegar a D0 hay dos caminos (superior o inferior) y cada uno exige dos elecciones independientes:' },
            { type: 'math', tex: 'P(D_0) = \\underbrace{\\tfrac12 \\cdot \\tfrac12}_{\\text{camino superior}} + \\underbrace{\\tfrac12 \\cdot \\tfrac12}_{\\text{camino inferior}} = \\tfrac12' },
            { type: 'p', text: '<b>Modelo cuántico.</b> Cada salida de un divisor tiene una <em>amplitud</em> de valor absoluto $\\tfrac{1}{\\sqrt2}$, y una de las salidas del segundo divisor lleva un signo negativo. Para un camino, las amplitudes se multiplican; para caminos que llegan al mismo detector, se <em>suman</em>. Al final, la probabilidad es el cuadrado de la amplitud total:' },
            { type: 'steps', items: [
              { text: 'Amplitud total en D0 (los dos caminos contribuyen con el mismo signo):', tex: 'a(D_0) = \\tfrac{1}{\\sqrt2}\\cdot\\tfrac{1}{\\sqrt2} + \\tfrac{1}{\\sqrt2}\\cdot\\tfrac{1}{\\sqrt2} = \\tfrac12 + \\tfrac12 = 1' },
              { text: 'Amplitud total en D1 (un camino aporta con signo negativo):', tex: 'a(D_1) = \\tfrac{1}{\\sqrt2}\\cdot\\tfrac{1}{\\sqrt2} - \\tfrac{1}{\\sqrt2}\\cdot\\tfrac{1}{\\sqrt2} = \\tfrac12 - \\tfrac12 = 0' },
              { text: 'Probabilidades:', tex: 'P(D_0) = 1^2 = 1, \\qquad P(D_1) = 0^2 = 0' },
            ] },
            { type: 'p', text: 'La diferencia está en el orden de las operaciones. En el modelo clásico se elevan al cuadrado las contribuciones de cada camino (son probabilidades positivas) y después se suman: nunca pueden cancelarse. En el cuántico se suman primero las amplitudes, que pueden tener signos opuestos, y después se eleva al cuadrado.' },
          ],
        },
        {
          id: 'bloqueo-desfase',
          title: 'Bloquear un camino y desfasar',
          blocks: [
            { type: 'p', text: 'Si se bloquea el camino inferior, solo queda una contribución para cada detector:' },
            { type: 'math', tex: 'a(D_0) = \\tfrac12, \\quad a(D_1) = \\tfrac12 \\;\\Rightarrow\\; P(D_0) = P(D_1) = \\tfrac14, \\quad P(\\text{absorbido}) = \\tfrac12' },
            { type: 'p', text: 'D1 pasa de probabilidad 0 a $\\tfrac14$: quitar una posibilidad eliminó la cancelación.' },
            { type: 'p', text: 'Un desfase de media longitud de onda (180°) en un camino cambia el signo de su amplitud, y las dos salidas se intercambian: $a(D_0) = 0$ y $a(D_1) = -1$. Para un desfase general $\\varphi$ hacen falta números complejos (Módulo 4); el resultado, que usa el simulador, es:' },
            { type: 'math', tex: 'P(D_0) = \\cos^2\\!\\left(\\tfrac{\\varphi}{2}\\right), \\qquad P(D_1) = \\sin^2\\!\\left(\\tfrac{\\varphi}{2}\\right)', note: 'Para $\\varphi = 0$ da 1 y 0; para $\\varphi = 180°$, 0 y 1. Lo demostraremos en el Módulo 4.' },
          ],
        },
        {
          id: 'estadistica',
          title: '¿Cuántos fotones hacen falta para notar la diferencia?',
          blocks: [
            { type: 'p', text: 'Cada fotón da un único resultado. Para estimar una probabilidad $p$ se repite el experimento $N$ veces y se calcula la fracción observada $\\hat p$. Su error típico es:' },
            { type: 'math', tex: '\\sigma_{\\hat p} = \\sqrt{\\frac{p(1-p)}{N}}', note: 'Con $p = \\tfrac12$ y $N = 1000$: $\\sigma \\approx 0{,}016$, es decir, unos 16 fotones de variación típica en cada detector.' },
            { type: 'p', text: 'Por eso, en el modelo clásico, observar 511 fotones en D0 de 1000 es perfectamente compatible con $p = \\tfrac12$. En cambio, 1000 de 1000 es incompatible con $p = \\tfrac12$ más allá de toda duda razonable. Esta misma estadística gobernará los <em>shots</em> de los circuitos cuánticos (Módulo 3) y las pruebas de software cuántico (Módulo 8).' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Reproducimos el cálculo de amplitudes y simulamos el envío de fotones con Python estándar. Todavía no usamos ninguna biblioteca cuántica: primero el concepto, después la herramienta.',
      sections: [
        {
          id: 'python-amplitudes',
          title: 'El interferómetro con amplitudes',
          blocks: [
            { type: 'code', lang: 'python', file: 'interferometro.py', code: `import math

r = 1 / math.sqrt(2)  # amplitud de cada salida de un divisor de haz 50/50


def interferometro(signo_superior=1, bloqueado=False):
    sup, inf = r, r              # primer divisor: dos caminos con la misma amplitud
    sup *= signo_superior        # -1: desfase de media longitud de onda en el camino superior
    if bloqueado:
        inf = 0.0                # un obstáculo absorbe lo que va por el camino inferior
    d0 = r * sup + r * inf       # segundo divisor: las contribuciones se suman...
    d1 = r * sup - r * inf       # ...o se restan, según la salida
    return d0**2, d1**2          # probabilidad = cuadrado de la amplitud


print("sin desfase:   ", [round(p, 3) for p in interferometro()])
print("con desfase:   ", [round(p, 3) for p in interferometro(signo_superior=-1)])
print("camino tapado: ", [round(p, 3) for p in interferometro(bloqueado=True)])`,
            output: `sin desfase:    [1.0, 0.0]
con desfase:    [0.0, 1.0]
camino tapado:  [0.25, 0.25]` },
            { type: 'list', items: [
              '<b>Líneas 7–10:</b> el estado tras el primer divisor son dos amplitudes, una por camino. Bloquear un camino pone su amplitud a 0.',
              '<b>Líneas 11–12:</b> el segundo divisor combina los caminos. Que una salida reste es lo que permite la cancelación.',
              '<b>Línea 13:</b> solo al final se pasa de amplitudes a probabilidades.',
              'Con un camino tapado, las probabilidades suman 0,5: la otra mitad son fotones absorbidos.',
              'Se usa <code>round</code> porque, como vimos en la lección 1.2, $(1/\\sqrt2)^2$ no da exactamente 0,5 en punto flotante.',
            ] },
          ],
        },
        {
          id: 'python-fotones',
          title: 'Simular el envío de fotones',
          blocks: [
            { type: 'code', lang: 'python', file: 'fotones.py', code: `import random


def modelo_clasico():
    """Cada divisor elige un camino al azar; el segundo vuelve a elegir al azar."""
    return random.choice(["D0", "D1"])


def modelo_cuantico(p_d0):
    """Cada fotón llega a D0 con probabilidad p_d0 (calculada con amplitudes)."""
    return "D0" if random.random() < p_d0 else "D1"


random.seed(7)
fotones = 1000
clasico = sum(modelo_clasico() == "D0" for _ in range(fotones))
cuantico = sum(modelo_cuantico(1.0) == "D0" for _ in range(fotones))
print(f"modelo clásico: D0 = {clasico}, D1 = {fotones - clasico}")
print(f"predicción cuántica: D0 = {cuantico}, D1 = {fotones - cuantico}")`,
            output: `modelo clásico: D0 = 511, D1 = 489
predicción cuántica: D0 = 1000, D1 = 0` },
            { type: 'p', text: 'Fíjate en un detalle importante: <code>modelo_cuantico</code> no simula los caminos, solo muestrea un resultado con la probabilidad calculada con amplitudes. Así funcionan también los simuladores cuánticos que usaremos: calculan las amplitudes de forma exacta (con un coste que crece como $2^n$) y después generan resultados aleatorios como lo haría una medición. <code>random.seed(7)</code> hace el experimento reproducible.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Un qubit vale 0 y 1 al mismo tiempo».', reality: 'El estado de un qubit se describe con amplitudes para $|0\\rangle$ y $|1\\rangle$, pero al medirlo se obtiene un único valor. La frase sugiere que podríamos leer ambos valores, y no es así.' },
    { myth: '«Una computadora cuántica prueba todas las soluciones a la vez y lee la correcta».', reality: 'La medición devuelve un único resultado. Los algoritmos útiles usan la interferencia para que la respuesta correcta sea probable, y eso solo es posible para problemas con estructura adecuada.' },
    { myth: '«En el interferómetro, el fotón va por un camino, solo que no sabemos cuál».', reality: 'Ese modelo predice un reparto 50/50 y no explica que bloquear un camino haga aparecer fotones en D1. Los resultados exigen sumar amplitudes de ambos caminos.' },
    { myth: '«La aleatoriedad de los resultados cuánticos se debe al ruido de los aparatos».', reality: 'Un sistema cuántico ideal, sin ruido, ya da resultados probabilísticos al medirse. El ruido es un problema adicional que la corrección de errores intenta controlar.' },
    { myth: '«Ya existe una computadora cuántica que supera a las clásicas en todo».', reality: 'Las demostraciones de ventaja se refieren a tareas concretas, sin aplicación práctica directa, y se comparan con el mejor algoritmo clásico conocido, que puede mejorar.' },
  ],

  summary: [
    'La computación cuántica procesa información con sistemas cuánticos: amplitudes que interfieren, entrelazamiento y medición probabilística.',
    'En el interferómetro, los fotones individuales interfieren: el resultado exige sumar amplitudes, no probabilidades.',
    'Bit frente a qubit: lectura sin perturbación frente a medición, copia libre frente a no clonación, operaciones irreversibles frente a reversibles.',
    'n qubits se describen con hasta $2^n$ amplitudes, pero medirlos solo da n bits (cota de Holevo).',
    'La tecnología actual es NISQ [@preskill2018]; las afirmaciones de ventaja son relativas al mejor método clásico conocido.',
  ],

  exercises: [
    { level: 'comprender', question: 'En el simulador, con la predicción cuántica, ¿qué desfase hace que los fotones se repartan a partes iguales entre D0 y D1?', answer: '90° (o 270°): $\\cos^2(45°) = \\tfrac12$. Ojo: el reparto es el mismo que en el modelo clásico, pero por una razón distinta (amplitudes con una fase relativa), y cambiar el desfase lo modifica.' },
    { level: 'comprender', question: '¿Por qué registrar el camino del fotón hace desaparecer la interferencia?', answer: 'Porque entonces los dos caminos llevan a resultados distinguibles (el registro dice cuál se tomó), y las amplitudes de resultados distinguibles no se suman. Solo interfieren las posibilidades que conducen exactamente al mismo resultado final.' },
    { level: 'matematico', question: 'Con el camino superior bloqueado (en lugar del inferior), calcula las amplitudes y las probabilidades en D0 y D1.', answer: 'Solo contribuye el camino inferior: $a(D_0) = \\tfrac12$ y $a(D_1) = -\\tfrac12$. Probabilidades: $\\tfrac14$ y $\\tfrac14$; el signo no afecta a la probabilidad. La otra mitad se absorbe.' },
    { level: 'matematico', question: 'Si enviamos 100 fotones en el modelo clásico, ¿entre qué valores esperas, aproximadamente, el número de detecciones en D0 (± 2 errores típicos)?', answer: '$\\sigma_{\\hat p} = \\sqrt{0{,}25/100} = 0{,}05$, es decir, 5 fotones. ±2 errores típicos: entre unos 40 y 60.' },
    { level: 'implementar', question: 'Modifica <code>fotones.py</code> para simular el caso del camino bloqueado, con tres resultados posibles: D0, D1 o absorbido.', answer: '<pre><code>def bloqueado():\n    u = random.random()\n    return "D0" if u &lt; 0.25 else "D1" if u &lt; 0.5 else "absorbido"\n\nresultados = [bloqueado() for _ in range(1000)]\nprint({k: resultados.count(k) for k in ("D0", "D1", "absorbido")})</code></pre>Esperarás unos 250, 250 y 500, con variaciones del orden de ±15.' },
  ],

  references: [
    { key: 'nielsen2010', use: 'Definición de la computación cuántica, cota de Holevo y no clonación.' },
    { key: 'grangier1986', use: 'Experimento con fotones individuales en un divisor de haz y en un interferómetro de Mach–Zehnder.' },
    { key: 'wootters1982', use: 'Teorema de no clonación.' },
    { key: 'preskill2018', use: 'Era NISQ y sus limitaciones.' },
    { key: 'arute2019', use: 'Experimento de muestreo de 2019 y su estimación clásica.' },
    { key: 'pan2022', use: 'Simulación clásica posterior del mismo problema.' },
    { key: 'google2025', use: 'Corrección de errores por debajo del umbral.' },
  ],

  related: ['limites-complejidad', 'historia-computacion-cuantica', 'el-qubit', 'superposicion', 'interferencia', 'qpu-computacion-hibrida'],
  next: 'historia-computacion-cuantica',
};
