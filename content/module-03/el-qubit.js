// Lección 3.1 — ¿Qué es un qubit? Bit frente a qubit
// Salida de código obtenida con CPython 3.14 (2026-10-15). La lógica del
// laboratorio está en src/utils/qubit.js y se prueba en tests/module3.test.js.
// Esta lección todavía no usa la notación |0⟩ (llega en la 3.2).

export default {
  id: 'el-qubit',
  title: '¿Qué es un qubit? Bit frente a qubit',
  lede: 'El qubit es la unidad de información de la computación cuántica. Esta lección explica qué es, en qué se parece a un bit y en qué se diferencia, con un laboratorio en el que puedes leer bits y medir qubits tú mismo.',
  updated: '2026-10-15',

  context: {
    learn: 'Qué es un qubit, qué son sus dos estados base, qué ocurre al medirlo y por qué hay que repetir un experimento muchas veces para conocer cómo se preparó.',
    why: 'Todo lo que viene después (notación, compuertas, circuitos, algoritmos) trata de qubits. Si el qubit se entiende mal desde el principio, por ejemplo como «un bit que vale 0 y 1 a la vez», todo lo demás se entiende mal.',
    previous: 'En [[>representacion-informacion|la lección 1.1]] hicimos explícitas las propiedades del bit, y en [[>que-es-computacion-cuantica|la 2.1]] las comparamos por primera vez con las del qubit y vimos la idea de amplitud. En [[>panorama-tecnologico|la 2.6]] vimos con qué se construyen los qubits.',
    next: 'La lección 3.2 presenta la notación con la que se escriben los estados de un qubit, y la 3.3, las reglas que deben cumplir sus amplitudes.',
  },

  objectives: [
    'Definir qué es un qubit y cuáles son sus dos estados base.',
    'Explicar qué ocurre al medir un qubit y en qué se diferencia de leer un bit.',
    'Explicar por qué para conocer cómo se preparó un qubit hay que repetir el experimento muchas veces.',
    'Reconocer las simplificaciones engañosas más comunes sobre el qubit.',
  ],

  prerequisites: { lessons: ['qpu-computacion-hibrida'], knowledge: ['La idea de amplitud (lección 2.1).'] },

  introduction: [
    { type: 'p', text: 'Un bit es una abstracción: un sistema físico con dos estados que sabemos distinguir, como dos rangos de voltaje (lección 1.1). Un [[qubit|qubit]] también lo es. El término lo introdujo Benjamin Schumacher en 1995, como abreviatura de <i>quantum bit</i> [@schumacher1995]. La diferencia está en las reglas que sigue ese sistema de dos estados, y la mejor forma de verla es experimentar.' },
    { type: 'widget', id: 'qubit-lab', caption: 'Lee el bit varias veces. Después mide el qubit preparado «mitad y mitad», mídelo otra vez, prepara otro igual y repite. Por último, prepara y mide 100 de golpe. Si quieres, activa «Ver las amplitudes»: es una ayuda que solo existe en la simulación.' },
  ],

  levels: {
    comprender: {
      intro: 'Qué es un qubit, sus estados base, qué significa medirlo y lo que no es.',
      sections: [
        {
          id: 'que-es',
          title: '¿Qué es un qubit?',
          blocks: [
            { type: 'p', text: 'Un qubit es un sistema físico con dos estados distinguibles que sigue las reglas de la mecánica cuántica. En la lección 2.6 vimos varias formas de construirlo: dos niveles de energía de un ion, dos estados de un circuito superconductor, la polarización de un fotón… La computación cuántica, igual que la clásica, se abstrae de esos detalles: lo que importa es el comportamiento [@nielsen2010; @mermin2007].' },
            { type: 'p', text: 'Ese comportamiento se resume en tres ideas, que ya apuntamos en la lección 2.1:' },
            { type: 'list', ordered: true, items: [
              '<b>Dos estados base.</b> Como un bit, un qubit tiene dos estados que se distinguen al medirlo. Se llaman 0 y 1.',
              '<b>Combinaciones de ambos.</b> Además, un qubit puede estar en una combinación de los dos estados base. Esa combinación se describe con dos números, las [[amplitud|amplitudes]]: una para el 0 y otra para el 1.',
              '<b>Medir da un bit.</b> Al medir un qubit se obtiene siempre 0 o 1, nunca «algo intermedio». Cuál de los dos sale depende de las amplitudes, de forma probabilística.',
            ] },
            { type: 'callout', kind: 'analogy', title: 'Una moneda girando… y por qué no basta', text: 'A menudo se compara un qubit con una moneda que gira en el aire: al caer, muestra cara o cruz. La analogía capta que el resultado aparece al medir. Pero falla en lo esencial: una moneda que gira tiene, en cada instante, una orientación concreta que simplemente no conocemos. En el interferómetro de la lección 2.1 vimos que ese tipo de explicación («el fotón va por un camino, solo que no sabemos cuál») no reproduce lo que se observa. Las amplitudes no describen nuestra ignorancia: describen el estado.' },
          ],
        },
        {
          id: 'estados-base',
          title: 'Los estados base',
          blocks: [
            { type: 'p', text: 'Los estados 0 y 1 se llaman <b>[[estado-base|estados base]]</b>. Son especiales porque, si un qubit está en uno de ellos, se comporta exactamente como un bit:' },
            { type: 'list', items: [
              'Un qubit en el estado 0 da 0 al medirlo, siempre.',
              'Un qubit en el estado 1 da 1, siempre.',
            ] },
            { type: 'p', text: 'Compruébalo en el laboratorio con las preparaciones «Siempre 0» y «Siempre 1». Toda la información clásica cabe en estos dos estados: un programa cuántico que solo usara estados base sería, en la práctica, un programa clásico. Lo nuevo aparece con las combinaciones.' },
            { type: 'callout', kind: 'note', text: 'Los estados que se distinguen al medir pueden elegirse de otras formas, y en la lección 3.14 veremos otras «bases» de medición. Mientras tanto, cuando digamos estados base nos referiremos a 0 y 1, que es lo habitual y lo que miden por defecto los equipos y las bibliotecas.' },
          ],
        },
        {
          id: 'medir',
          title: 'Leer un bit frente a medir un qubit',
          blocks: [
            { type: 'p', text: 'El laboratorio muestra las tres diferencias que más sorprenden al principio:' },
            { type: 'table', head: ['', 'Bit', 'Qubit'], rows: [
              ['¿Qué da al leerlo?', 'El valor guardado', 'Un resultado al azar, 0 o 1, con probabilidades que dependen de las amplitudes'],
              ['¿Leerlo lo cambia?', 'No', 'Sí: tras medirlo, queda en el estado base que salió. Medirlo otra vez repite ese resultado'],
              ['¿Cómo conocer su contenido?', 'Leyéndolo una vez', 'No se puede con un solo qubit. Hay que preparar muchos iguales, medirlos y contar'],
            ] },
            { type: 'p', text: 'La segunda fila es la más importante para un ingeniero. Medir no es una operación de solo lectura: destruye la combinación y deja un estado base. Por eso los programas cuánticos miden al final, y por eso un trabajo se repite cientos o miles de veces (lección 2.5): cada repetición prepara el qubit desde cero.' },
            { type: 'callout', kind: 'warning', title: 'Infinitas combinaciones, un solo bit', text: 'Las amplitudes son números que pueden tomar infinitos valores, así que un qubit puede estar en infinitos estados distintos. Sería tentador pensar que guarda «infinita información». No es así: medirlo da un solo bit, y está demostrado que de $n$ qubits no se pueden extraer más de $n$ bits de información (lección 2.1) [@nielsen2010]. La utilidad de las amplitudes está en cómo se combinan e interfieren durante el cálculo, no en almacenar datos.' },
            { type: 'p', text: 'Una diferencia más, que estudiaremos en la unidad 3.7: un bit se puede copiar libremente, pero no existe ningún procedimiento que copie un qubit cuyo estado desconocemos [@wootters1982]. Por eso no se puede «hacer una copia de seguridad» de un qubit ni leer su contenido midiendo muchas copias del mismo.' },
          ],
        },
        {
          id: 'lo-que-no-es',
          title: 'Lo que un qubit no es',
          blocks: [
            { type: 'list', items: [
              '<b>No es un bit que vale 0 y 1 a la vez.</b> Está en un estado concreto, descrito por dos amplitudes. Al medirlo da un único valor; nunca se leen los dos.',
              '<b>No es un bit con un valor oculto.</b> Antes de medir no hay un 0 o un 1 «escondido» esperando a que lo descubramos.',
              '<b>No es un número decimal entre 0 y 1.</b> Aunque las amplitudes sean números, medir da 0 o 1. Las probabilidades aparecen solo al repetir.',
              '<b>No es «más rápido» por sí mismo.</b> Un qubit aislado no calcula nada mejor que un bit. Las ventajas vienen de algoritmos con muchos qubits que aprovechan la interferencia (lección 2.4).',
            ] },
          ],
        },
      ],
    },

    implementar: {
      intro: 'El laboratorio en unas pocas líneas de Python. Todavía no usamos ninguna biblioteca cuántica: basta con números aleatorios.',
      sections: [
        {
          id: 'python-medir',
          title: 'Leer un bit, medir qubits',
          blocks: [
            { type: 'code', lang: 'python', file: 'medir.py', code: `import random

random.seed(1)

def medir(p1):
    """Mide un qubit que da 1 con probabilidad p1."""
    return 1 if random.random() < p1 else 0

bit = 1
print("bit:  ", [bit for _ in range(10)])           # leer un bit 10 veces
print("qubit:", [medir(0.5) for _ in range(10)])    # preparar y medir 10 qubits iguales

unos = sum(medir(0.5) for _ in range(1000))
print("de 1000 qubits iguales, dieron 1:", unos)`,
            output: `bit:   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
qubit: [1, 0, 0, 1, 1, 1, 0, 0, 1, 1]
de 1000 qubits iguales, dieron 1: 472` },
            { type: 'list', items: [
              'Leer el bit diez veces da diez veces lo mismo.',
              'Diez qubits preparados exactamente igual dan resultados distintos: cada medición es aleatoria.',
              'Con 1000 qubits, la proporción de unos (0,472) se acerca a la probabilidad con que se prepararon (0,5), pero no la iguala: es una estimación (lección 2.5).',
            ] },
            { type: 'callout', kind: 'model', status: 'simplificacion', text: 'La función <code>medir</code> solo imita el resultado de medir un qubit ya preparado, a partir de su probabilidad. No representa el estado del qubit ni cómo se calcula esa probabilidad a partir de las amplitudes; eso llega en las lecciones 3.2 y 3.3.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Un qubit vale 0 y 1 al mismo tiempo».', reality: 'Un qubit está en un estado descrito por dos amplitudes. Al medirlo se obtiene un único resultado, 0 o 1; nunca se leen los dos valores.' },
    { myth: '«Medir un qubit es como leer una variable».', reality: 'Medir cambia el qubit: lo deja en el estado base que salió. Volver a medirlo no da información nueva.' },
    { myth: '«Un qubit guarda infinita información porque sus amplitudes son números reales».', reality: 'Al medirlo se obtiene un solo bit. De n qubits no se pueden extraer más de n bits [@nielsen2010].' },
    { myth: '«Antes de medirlo, el qubit ya tenía un valor que no conocíamos».', reality: 'Esa idea, la de la moneda que gira, no explica experimentos como el del interferómetro (lección 2.1).' },
  ],

  summary: [
    'Un qubit es un sistema de dos estados que sigue las reglas cuánticas; el término es de 1995 [@schumacher1995].',
    'Sus estados base, 0 y 1, se comportan como un bit. Además, puede estar en combinaciones descritas por dos amplitudes.',
    'Medir da 0 o 1 al azar, con probabilidades que dependen de las amplitudes, y deja el qubit en el estado que salió.',
    'Para conocer cómo se preparó un qubit hay que preparar y medir muchos iguales.',
    'Un qubit no se puede copiar ni da más de un bit al medirlo.',
  ],

  exercises: [
    { level: 'comprender', question: 'Mides un qubit y obtienes 1. Lo mides otra vez sin hacerle nada. ¿Qué obtienes? ¿Qué sabes ahora de cómo estaba preparado?', answer: 'Obtienes 1 otra vez: tras la primera medición, el qubit quedó en el estado 1. Sobre la preparación solo sabes que la probabilidad de obtener 1 no era cero. Podía estar en el estado 1 o en cualquier combinación con amplitud no nula para el 1.' },
    { level: 'comprender', question: 'Un compañero dice: «Para saber cómo está un qubit, lo mido mil veces seguidas». ¿Qué falla en su plan?', answer: 'Tras la primera medición el qubit queda en un estado base, así que las otras 999 repiten el mismo resultado. Hay que preparar mil qubits iguales (o el mismo, mil veces desde el principio) y medir cada uno una vez.' },
    { level: 'implementar', question: 'Modifica <code>medir.py</code> para estimar la probabilidad de un qubit preparado con <code>p1 = 0.8</code> usando 100, 1000 y 10 000 qubits. ¿Cómo cambia el error de la estimación?', answer: '<pre><code class="language-python">import random\n\nrandom.seed(1)\n\ndef medir(p1):\n    return 1 if random.random() &lt; p1 else 0\n\nfor n in [100, 1000, 10000]:\n    unos = sum(medir(0.8) for _ in range(n))\n    print(n, unos / n)</code></pre>Con la semilla 1 imprime 0,8, 0,79 y 0,7968: las estimaciones se acercan a 0,8 a medida que crece $n$. El error típico baja como $1/\\sqrt{n}$: con cien veces más qubits, se divide entre diez (lección 2.5).' },
  ],

  references: [
    { key: 'schumacher1995', use: 'Origen del término «qubit».' },
    { key: 'nielsen2010', use: 'Definición de qubit, medición y límite de información extraíble (cota de Holevo).' },
    { key: 'mermin2007', use: 'Presentación del qubit a partir del bit clásico.' },
    { key: 'wootters1982', use: 'Un estado cuántico desconocido no se puede copiar.' },
  ],

  related: ['representacion-informacion', 'que-es-computacion-cuantica', 'notacion-dirac', 'estado-general-amplitudes', 'medicion-cuantica'],
  next: 'notacion-dirac',
};
