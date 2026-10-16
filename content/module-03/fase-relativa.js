// Lección 3.6 — Fase relativa
// Salida de código obtenida con CPython 3.14 (2026-10-16).
// La fase general es un ángulo; con amplitudes reales se reduce a un signo.
// La versión con números complejos va en «Para profundizar» (Módulo 4).

export default {
  id: 'fase-relativa',
  title: 'Fase relativa',
  lede: 'Dos estados pueden dar exactamente las mismas probabilidades al medirlos y, aun así, ser distintos. Lo que los diferencia es la fase relativa: invisible al medir directamente y decisiva en cuanto el estado se transforma.',
  updated: '2026-10-16',

  context: {
    learn: 'Qué es la fase relativa, cómo se ve en la esfera de Bloch, cómo se hace visible con la mezcla y por qué la fase global no tiene ningún efecto.',
    why: 'Los algoritmos cuánticos trabajan, sobre todo, con fases: las preparan para que la interferencia final dé la respuesta. Y los errores de fase son un tipo de fallo que una medición directa no detecta.',
    previous: 'En [[>estado-general-amplitudes|la lección 3.3]] vimos que el signo de una amplitud no cambia las probabilidades; en [[>esfera-de-bloch|la 3.4]], que el giro φ tampoco; y en [[>superposicion|la 3.5]], la operación de mezcla.',
    next: 'La lección 3.8 muestra cómo la fase y la mezcla producen interferencia constructiva y destructiva. Antes, la 3.7 presenta el entrelazamiento.',
  },

  objectives: [
    'Explicar qué es la fase relativa y dónde se ve en la esfera de Bloch.',
    'Explicar por qué una medición directa no detecta la fase relativa y la mezcla sí.',
    'Distinguir fase relativa de fase global.',
  ],

  prerequisites: { lessons: ['superposicion'], knowledge: [] },

  introduction: [
    { type: 'p', text: '$|+\\rangle$ y $|-\\rangle$ dan mitad y mitad al medirlos. Sin embargo, en la lección anterior vimos que, tras la mezcla, $|+\\rangle$ da siempre 0 y $|-\\rangle$, siempre 1. Toda la diferencia está en un signo. Ese signo es el caso más sencillo de algo más general: la <b>[[fase-relativa|fase relativa]]</b>.' },
    { type: 'widget', id: 'phase-dial', caption: 'Gira la fase de un estado «mitad y mitad». Compara las dos mediciones. Después activa la fase global y comprueba que nada cambia. Supera los dos retos.' },
  ],

  levels: {
    comprender: {
      intro: 'Qué es la fase relativa, cómo se hace visible y por qué la fase global no cuenta.',
      sections: [
        {
          id: 'que-es',
          title: 'Del signo al ángulo',
          blocks: [
            { type: 'p', text: 'En $|+\\rangle$ las dos amplitudes tienen el mismo signo; en $|-\\rangle$, signos opuestos. Esa relación entre las dos amplitudes se llama fase relativa: $0°$ para $|+\\rangle$ y $180°$ para $|-\\rangle$.' },
            { type: 'p', text: 'En general la fase relativa puede ser cualquier ángulo entre 0° y 360°. Es exactamente el giro $\\varphi$ de la esfera de Bloch (lección 3.4): todos los estados del ecuador son «mitad y mitad» y solo se diferencian en su fase. Los ángulos que no son 0° ni 180° necesitan amplitudes complejas, que estudiaremos en el Módulo 4; aquí basta con la idea del ángulo [@nielsen2010].' },
          ],
        },
        {
          id: 'hacerla-visible',
          title: 'Invisible al medir, decisiva al mezclar',
          blocks: [
            { type: 'p', text: 'Medir directamente solo mira las probabilidades de cada estado base, y la fase no las cambia. Por eso dos estados con fases distintas dan los mismos resultados.' },
            { type: 'p', text: 'La mezcla, en cambio, combina las dos amplitudes. Si tienen la misma fase, se refuerzan hacia el 0; si tienen fases opuestas, hacia el 1; con fases intermedias, a medias. El simulador lo muestra: tras la mezcla, la probabilidad de obtener 0 va del 100 % (0°) al 0 % (180°).' },
            { type: 'callout', kind: 'note', status: 'establecido', title: 'Ya lo habías visto', text: 'El control de «desfase» del interferómetro de la lección 2.1 era exactamente una fase relativa entre los dos caminos, y el segundo divisor de haz, una mezcla. Por eso la probabilidad de llegar a D0 seguía la misma curva que este simulador.' },
          ],
        },
        {
          id: 'global',
          title: 'Fase relativa frente a fase global',
          blocks: [
            { type: 'p', text: 'Si se cambia el signo de <em>todo</em> el estado, $-|+\\rangle = -\\tfrac{1}{\\sqrt2}|0\\rangle - \\tfrac{1}{\\sqrt2}|1\\rangle$, la relación entre las amplitudes no cambia: siguen teniendo el mismo signo. Ninguna medición, con o sin mezcla, distingue $|+\\rangle$ de $-|+\\rangle$. Ese cambio se llama <b>fase global</b> y no tiene ningún efecto: los dos se consideran el mismo estado [@nielsen2010].' },
            { type: 'callout', kind: 'analogy', title: 'Una analogía y su límite', text: 'Piensa en dos relojes. Lo que importa es la diferencia entre sus agujas (la fase relativa), no hacia dónde apuntan ambas a la vez (la fase global): si giras los dos relojes juntos, la diferencia no cambia. El límite de la analogía es que las fases no son horas: son ángulos que se combinan sumando amplitudes, como veremos en la lección 3.8.' },
          ],
        },
        {
          id: 'ingenieria',
          title: 'Por qué le importa a un ingeniero',
          blocks: [
            { type: 'list', items: [
              '<b>Los algoritmos trabajan con fases.</b> Preparan fases relativas para que, en la interferencia final, la respuesta correcta se refuerce y las incorrectas se cancelen (Módulo 7).',
              '<b>Hay errores invisibles.</b> El ruido puede cambiar la fase sin cambiar las probabilidades. Una prueba que solo mida directamente no lo detecta; hace falta transformar el estado antes de medir (unidad 3.7 y Módulo 8).',
              '<b>No hay que perseguir la fase global.</b> Dos simuladores pueden dar estados que difieren en un signo global y ser igual de correctos. Al comparar estados en pruebas, hay que ignorarla.',
            ] },
          ],
        },
      ],
    },

    matematico: {
      intro: 'La curva del simulador, en una fórmula.',
      sections: [
        {
          id: 'curva',
          title: 'La probabilidad tras la mezcla',
          key: 'Para un estado «mitad y mitad» con fase relativa φ, la probabilidad de obtener 0 tras la mezcla es cos²(φ/2): 1 con 0°, 1/2 con 90° y 0 con 180°.',
          blocks: [
            { type: 'math', tex: 'P(0 \\text{ tras mezclar}) = \\cos^2\\!\\left(\\tfrac{\\varphi}{2}\\right)' },
            { type: 'p', text: 'Con amplitudes reales hay dos casos: $\\varphi = 0°$ ($|+\\rangle$, probabilidad 1) y $\\varphi = 180°$ ($|-\\rangle$, probabilidad 0). Coinciden con la tabla de la lección 3.5.' },
            { deep: true, type: 'p', text: 'Con amplitudes complejas, el estado es $\\tfrac{1}{\\sqrt2}\\big(|0\\rangle + e^{i\\varphi}|1\\rangle\\big)$. La mezcla da para el 0 la amplitud $\\tfrac12(1 + e^{i\\varphi})$, cuyo módulo al cuadrado es $\\tfrac14|1 + e^{i\\varphi}|^2 = \\tfrac12(1 + \\cos\\varphi) = \\cos^2(\\varphi/2)$. Los números complejos se estudian en el Módulo 4.' },
            { deep: true, type: 'p', text: 'Fase global: multiplicar todo el estado por $e^{i\\gamma}$ multiplica también cada amplitud tras cualquier operación, y su módulo no cambia porque $|e^{i\\gamma}| = 1$. Por eso ninguna probabilidad la detecta.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'La tabla del simulador, en Python.',
      sections: [
        {
          id: 'python-fase',
          title: 'Fase relativa: directa frente a mezclada',
          blocks: [
            { type: 'code', lang: 'python', file: 'fase.py', code: `import math

for grados in [0, 45, 90, 135, 180]:
    fase = math.radians(grados)
    directo = 0.5                          # medir sin mezclar: siempre mitad y mitad
    tras_mezclar = math.cos(fase / 2) ** 2  # probabilidad de 0 tras la mezcla
    print(f"fase {grados:3}°: P(0) directa = {directo:.2f}, P(0) tras mezclar = {tras_mezclar:.2f}")`,
            output: `fase   0°: P(0) directa = 0.50, P(0) tras mezclar = 1.00
fase  45°: P(0) directa = 0.50, P(0) tras mezclar = 0.85
fase  90°: P(0) directa = 0.50, P(0) tras mezclar = 0.50
fase 135°: P(0) directa = 0.50, P(0) tras mezclar = 0.15
fase 180°: P(0) directa = 0.50, P(0) tras mezclar = 0.00` },
            { type: 'p', text: 'La primera columna no cambia nunca: medir directamente no ve la fase. La segunda recorre todos los valores. El programa usa la fórmula del nivel 2; en el Módulo 4, con números complejos, la obtendrás aplicando la mezcla a las amplitudes.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Si dos estados dan las mismas probabilidades, son el mismo estado».', reality: 'Pueden diferir en la fase relativa, como $|+\\rangle$ y $|-\\rangle$. La diferencia aparece tras transformarlos.' },
    { myth: '«Cambiar el signo de un estado lo cambia».', reality: 'Cambiar el signo de todo el estado (fase global) no tiene efecto observable. Solo importa la fase relativa.' },
    { myth: '«La fase es un detalle matemático sin importancia práctica».', reality: 'Es la materia prima de los algoritmos cuánticos, y los errores de fase son uno de los tipos de ruido principales.' },
  ],

  summary: [
    'La fase relativa es la relación entre las amplitudes; con amplitudes reales, su signo relativo.',
    'En la esfera de Bloch es el giro φ; los estados del ecuador solo difieren en su fase.',
    'Una medición directa no la ve; tras la mezcla, P(0) = cos²(φ/2).',
    'La fase global (todo el estado multiplicado por un mismo factor) no tiene efecto [@nielsen2010].',
  ],

  exercises: [
    { level: 'comprender', question: 'Un qubit debería estar en $|+\\rangle$, pero un error lo ha dejado en $|-\\rangle$. ¿Lo detecta una prueba que prepara y mide directamente 10 000 veces?', answer: 'No: los dos estados dan mitad y mitad. Una prueba que mezcle antes de medir sí lo detecta: $|+\\rangle$ daría siempre 0 y $|-\\rangle$, siempre 1.' },
    { level: 'comprender', question: '¿Son el mismo estado $-|0\\rangle$ y $|0\\rangle$? ¿Y $\\tfrac{1}{\\sqrt2}(-|0\\rangle + |1\\rangle)$ y $|-\\rangle$?', answer: 'Sí en ambos casos. $-|0\\rangle$ difiere de $|0\\rangle$ en una fase global. $\\tfrac{1}{\\sqrt2}(-|0\\rangle + |1\\rangle) = -\\tfrac{1}{\\sqrt2}(|0\\rangle - |1\\rangle) = -|-\\rangle$, también una fase global.' },
    { level: 'matematico', question: '¿Qué fase relativa da una probabilidad de 0 del 25 % tras la mezcla?', answer: '$\\cos^2(\\varphi/2) = 0{,}25 \\Rightarrow \\cos(\\varphi/2) = 0{,}5 \\Rightarrow \\varphi/2 = 60° \\Rightarrow \\varphi = 120°$ (o $240°$).' },
    { level: 'implementar', question: 'Modifica <code>fase.py</code> para encontrar, de grado en grado, la primera fase con la que la probabilidad tras mezclar baja del 25 %.', answer: '<pre><code class="language-python">import math\n\nfor grados in range(361):\n    if math.cos(math.radians(grados) / 2) ** 2 &lt; 0.25:\n        print(grados)\n        break</code></pre>Imprime 121: en 120° vale exactamente 0,25 (salvo redondeo) y a partir de 121° queda por debajo.' },
  ],

  references: [
    { key: 'nielsen2010', use: 'Fase relativa y fase global.' },
  ],

  related: ['superposicion', 'esfera-de-bloch', 'interferencia', 'que-es-computacion-cuantica'],
  next: 'entrelazamiento',
};
