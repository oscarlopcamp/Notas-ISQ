// Lección 3.4 — La esfera de Bloch
// Salida de código obtenida con CPython 3.14 (2026-10-15). La geometría del
// simulador se prueba en tests/module3.test.js.
// La fase se presenta a gran escala (se estudia en la lección 3.6) y la fórmula
// con números complejos va en «Para profundizar» (Módulo 4).

export default {
  id: 'esfera-de-bloch',
  title: 'La esfera de Bloch',
  lede: 'Cualquier estado de un qubit se puede dibujar como un punto en una esfera. Esta lección presenta esa imagen, la esfera de Bloch: la altura del punto da las probabilidades y su giro alrededor del eje representa la fase.',
  updated: '2026-10-15',

  context: {
    learn: 'Qué es la esfera de Bloch, dónde están |0⟩, |1⟩, |+⟩ y |−⟩, cómo se leen las probabilidades a partir de la altura y qué representa el giro alrededor del eje.',
    why: 'Es la imagen mental que usan los profesionales para un qubit. Las compuertas de un qubit, que veremos en la unidad 3.5, son giros de esta esfera, y muchas herramientas, como Qiskit, la dibujan.',
    previous: 'En [[>estado-general-amplitudes|la lección 3.3]] vimos que un estado es $a|0\\rangle + b|1\\rangle$, con $a^2 + b^2 = 1$, y que el signo de una amplitud importa aunque no cambie las probabilidades.',
    next: 'La unidad 3.2 estudia las propiedades cuánticas: superposición (lección 3.5), fase relativa (3.6), entrelazamiento (3.7) e interferencia (3.8).',
  },

  objectives: [
    'Situar |0⟩, |1⟩, |+⟩ y |−⟩ en la esfera de Bloch.',
    'Leer las probabilidades de medir 0 y 1 a partir de la altura de un punto.',
    'Explicar qué representa el giro alrededor del eje vertical y por qué no cambia las probabilidades.',
    'Reconocer los límites de la imagen: sirve para un solo qubit.',
  ],

  prerequisites: { lessons: ['estado-general-amplitudes'], knowledge: ['Ángulos en grados.'] },

  introduction: [
    { type: 'p', text: 'Un estado de un qubit son dos amplitudes. Con dos números se puede dibujar un punto, y la física ofrece un dibujo especialmente útil: una esfera, en la que cada punto de la superficie es un estado. Se llama <b>[[esfera-de-bloch|esfera de Bloch]]</b> en honor a Felix Bloch, que en 1946 describió el comportamiento de los espines de los núcleos atómicos con un vector que gira en tres dimensiones [@bloch1946]. Juega con ella antes de leer:' },
    { type: 'widget', id: 'bloch-sphere', caption: 'Mueve θ (la altura) y φ (el giro). Las barras muestran las probabilidades de medir 0 y 1. Prueba los botones de |0⟩, |1⟩, |+⟩ y |−⟩, y supera los retos.' },
  ],

  levels: {
    comprender: {
      intro: 'Cómo se lee la esfera: altura, giro y algunos puntos de referencia.',
      sections: [
        {
          id: 'mapa',
          title: 'El mapa de la esfera',
          blocks: [
            { type: 'p', text: 'La esfera funciona como un globo terráqueo [@nielsen2010]:' },
            { type: 'list', items: [
              '<b>Polo norte:</b> $|0\\rangle$. <b>Polo sur:</b> $|1\\rangle$.',
              '<b>Ecuador:</b> todos los estados «mitad y mitad». Entre ellos están $|+\\rangle$ y $|-\\rangle$, en puntos opuestos del ecuador.',
              '<b>Hemisferio norte:</b> estados en los que es más probable obtener 0. <b>Hemisferio sur:</b> más probable obtener 1.',
            ] },
            { type: 'p', text: 'Un estado se sitúa con dos ángulos, como la latitud y la longitud: $\\theta$ (theta) mide cuánto se baja desde el polo norte, de 0° a 180°, y $\\varphi$ (fi) mide cuánto se gira alrededor del eje vertical, de 0° a 360°.' },
          ],
        },
        {
          id: 'altura',
          title: 'La altura decide las probabilidades',
          blocks: [
            { type: 'p', text: 'Las probabilidades de medir 0 y 1 solo dependen de la altura del punto, es decir, de $\\theta$:' },
            { type: 'table', head: ['Dónde está el punto', 'θ', 'Probabilidad de 0', 'Probabilidad de 1'], rows: [
              ['Polo norte', '0°', '100 %', '0 %'],
              ['Entre el polo norte y el ecuador', '60°', '75 %', '25 %'],
              ['Ecuador', '90°', '50 %', '50 %'],
              ['Entre el ecuador y el polo sur', '120°', '25 %', '75 %'],
              ['Polo sur', '180°', '0 %', '100 %'],
            ] },
            { type: 'callout', kind: 'note', title: 'Una regla para recordar', text: 'Si la altura va de +1 (polo norte) a −1 (polo sur), la probabilidad de obtener 0 es $(1 + \\text{altura}) / 2$. En el ecuador, la altura es 0 y la probabilidad, 1/2.' },
          ],
        },
        {
          id: 'giro',
          title: 'El giro es la fase',
          blocks: [
            { type: 'p', text: 'Si mueves solo $\\varphi$, el punto da vueltas a la misma altura y las probabilidades no cambian. Por ejemplo, $|+\\rangle$ y $|-\\rangle$ están en el ecuador a 180° de distancia y ambos dan mitad y mitad. Su diferencia, el signo de la lección 3.3, es un caso particular de <b>fase</b>: lo que mide el giro.' },
            { type: 'p', text: 'La fase no se ve al medir 0 o 1 directamente, pero cambia lo que ocurre cuando el estado se transforma antes de medirlo, como en el interferómetro de la lección 2.1. La estudiaremos en la lección 3.6.' },
            { type: 'callout', kind: 'note', title: '¿Y los estados con amplitudes reales?', text: 'Con las amplitudes reales que hemos usado hasta ahora solo se llega a una «rebanada» de la esfera: la circunferencia que pasa por los polos, $|+\\rangle$ y $|-\\rangle$ ($\\varphi = 0°$ o $180°$). El resto de la esfera necesita amplitudes complejas (Módulo 4). Por eso el reto «mitad y mitad, pero que no sea $|+\\rangle$ ni $|-\\rangle$» lleva a estados que todavía no sabemos escribir.' },
          ],
        },
        {
          id: 'cuidado',
          title: 'Dos advertencias',
          blocks: [
            { type: 'callout', kind: 'warning', title: 'Opuestos en la esfera no es lo mismo que opuestos como listas', text: '$|0\\rangle$ y $|1\\rangle$ están en polos opuestos, a 180°. Pero como listas, $[1, 0]$ y $[0, 1]$ forman un ángulo de 90°, no de 180°. La esfera «duplica» los ángulos: en ella, los estados opuestos son los que se distinguen perfectamente al medir. Es una imagen, no una flecha que represente directamente la lista de amplitudes.' },
            { type: 'callout', kind: 'model', status: 'establecido', title: 'Solo para un qubit', text: 'La esfera de Bloch describe exactamente cualquier estado de <em>un</em> qubit. Para varios qubits no existe una imagen así: con dos o más aparecen estados entrelazados que no se pueden dibujar como una esfera por qubit (lecciones 3.7 y 3.9).' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Una fórmula para pasar del ángulo θ a las probabilidades.',
      sections: [
        {
          id: 'theta-probabilidad',
          title: 'De θ a las probabilidades',
          key: 'La probabilidad de 0 es cos²(θ/2): 100 % en el polo norte, 50 % en el ecuador y 0 % en el polo sur.',
          blocks: [
            { type: 'math', tex: 'P(0) = \\cos^2\\!\\left(\\tfrac{\\theta}{2}\\right), \\qquad P(1) = \\sin^2\\!\\left(\\tfrac{\\theta}{2}\\right)' },
            { type: 'p', text: 'Ejemplo: con $\\theta = 60°$, $\\cos(30°) \\approx 0{,}866$ y $0{,}866^2 = 0{,}75$. Es la segunda fila de la tabla del nivel 1. El ángulo aparece dividido entre 2: es la «duplicación» de la advertencia anterior.' },
            { deep: true, type: 'p', text: 'El estado completo, con su fase, es:' },
            { deep: true, type: 'math', tex: '|\\psi\\rangle = \\cos\\!\\left(\\tfrac{\\theta}{2}\\right)|0\\rangle + e^{i\\varphi}\\sin\\!\\left(\\tfrac{\\theta}{2}\\right)|1\\rangle', note: '$e^{i\\varphi}$ es un número complejo de módulo 1 (Módulo 4). Con $\\varphi = 0°$ vale 1 y con $\\varphi = 180°$ vale $-1$: son los estados con amplitudes reales. Así, $\\theta = 90°$ y $\\varphi = 180°$ da $\\tfrac{1}{\\sqrt2}|0\\rangle - \\tfrac{1}{\\sqrt2}|1\\rangle = |-\\rangle$ [@nielsen2010].' },
            { deep: true, type: 'p', text: 'La regla del nivel 1 se deduce de la fórmula: la altura es $z = \\cos\\theta$, y como $\\cos^2(\\theta/2) = (1 + \\cos\\theta)/2$, resulta $P(0) = (1 + z)/2$.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'La tabla del nivel 1, calculada en Python.',
      sections: [
        {
          id: 'python-bloch',
          title: 'Probabilidades a partir de θ',
          blocks: [
            { type: 'code', lang: 'python', file: 'bloch.py', code: `import math

for grados in [0, 60, 90, 120, 180]:
    theta = math.radians(grados)        # ángulo desde el polo norte
    p0 = math.cos(theta / 2) ** 2
    print(f"θ = {grados:3}°: P(0) = {p0:.2f}, P(1) = {1 - p0:.2f}")`,
            output: `θ =   0°: P(0) = 1.00, P(1) = 0.00
θ =  60°: P(0) = 0.75, P(1) = 0.25
θ =  90°: P(0) = 0.50, P(1) = 0.50
θ = 120°: P(0) = 0.25, P(1) = 0.75
θ = 180°: P(0) = 0.00, P(1) = 1.00` },
            { type: 'p', text: '<code>math.radians</code> convierte grados a radianes, la unidad que usan las funciones trigonométricas de Python. Prueba a añadir más ángulos a la lista, o a calcular la probabilidad con la regla $(1 + \\cos\\theta)/2$ y comprobar que coincide.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«La flecha de la esfera es la lista de amplitudes».', reality: 'Es una representación que duplica los ángulos: $|0\\rangle$ y $|1\\rangle$ están a 180° en la esfera, pero a 90° como listas.' },
    { myth: '«Girar alrededor del eje vertical no cambia nada».', reality: 'No cambia las probabilidades de 0 y 1, pero cambia la fase, que decide cómo interfiere el estado.' },
    { myth: '«Cada qubit de un ordenador cuántico se puede describir con su propia esfera».', reality: 'Solo si no está entrelazado con otros. Los estados entrelazados no caben en esta imagen.' },
  ],

  summary: [
    'Cada estado de un qubit es un punto de la esfera de Bloch: $|0\\rangle$ arriba, $|1\\rangle$ abajo y $|+\\rangle$, $|-\\rangle$ en el ecuador.',
    'La altura (θ) da las probabilidades: $P(0) = \\cos^2(\\theta/2) = (1 + \\text{altura})/2$.',
    'El giro (φ) es la fase: no cambia las probabilidades, pero sí la interferencia.',
    'La imagen vale para un solo qubit; el nombre viene de Felix Bloch [@bloch1946].',
  ],

  exercises: [
    { level: 'comprender', question: 'Un estado está en el hemisferio sur, muy cerca del polo. ¿Qué esperas al medirlo 100 veces?', answer: 'Casi siempre 1, con algún 0 ocasional: cerca del polo sur, la probabilidad de 1 es próxima al 100 %.' },
    { level: 'comprender', question: '¿Qué tienen en común todos los estados del ecuador? ¿En qué se diferencian?', answer: 'Todos dan 0 y 1 con probabilidad 1/2. Se diferencian en la fase (el giro φ), que no cambia esas probabilidades pero sí cómo interfieren.' },
    { level: 'matematico', question: '¿Qué θ da una probabilidad de 1 del 10 %?', answer: '$\\sin^2(\\theta/2) = 0{,}1 \\Rightarrow \\sin(\\theta/2) \\approx 0{,}316 \\Rightarrow \\theta/2 \\approx 18{,}4° \\Rightarrow \\theta \\approx 36{,}9°$.' },
    { level: 'implementar', question: 'Escribe una función <code>theta_para(p1)</code> que devuelva, en grados, el θ que da probabilidad <code>p1</code> de obtener 1.', answer: '<pre><code class="language-python">import math\n\ndef theta_para(p1):\n    return math.degrees(2 * math.asin(math.sqrt(p1)))\n\nprint(round(theta_para(0.1), 1))   # 36.9\nprint(round(theta_para(0.5), 1))   # 90.0</code></pre>' },
  ],

  references: [
    { key: 'bloch1946', use: 'Origen del nombre de la esfera de Bloch.' },
    { key: 'nielsen2010', use: 'Representación de un qubit en la esfera de Bloch y forma general del estado.' },
  ],

  related: ['estado-general-amplitudes', 'notacion-dirac', 'fase-relativa', 'superposicion', 'compuertas-x-h-z'],
  next: 'superposicion',
};
