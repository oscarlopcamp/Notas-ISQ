// Lección 3.10 — Cómo leer un circuito cuántico
// Salida de código obtenida con CPython 3.14 (2026-10-20). El simulador de
// circuitos está en src/utils/circuit.js y se prueba en tests/module3.test.js.
// Sin temas adelantados: solo se usan las operaciones ya presentadas (mezcla,
// cambio de signo, intercambio y CNOT, de la lección 1.6), dibujadas con sus
// símbolos estándar H, Z y X; sus nombres se explican en la unidad 3.5.

export default {
  id: 'circuitos-cuanticos',
  title: 'Cómo leer un circuito cuántico',
  lede: 'Los programas cuánticos se dibujan como circuitos: líneas para los qubits, cajas para las operaciones y medidores al final. Esta lección enseña a leer esos diagramas, con un cuestionario y un editor en el que puedes construir y ejecutar tus propios circuitos.',
  updated: '2026-10-20',

  context: {
    learn: 'Qué es un circuito cuántico y cómo se leen sus elementos: líneas de qubits, estado inicial, compuertas, CNOT, mediciones y registros clásicos. También, la trampa del orden entre el diagrama y las cadenas de resultados.',
    why: 'Los circuitos son el «código fuente» visual de la computación cuántica: aparecen en la documentación de Qiskit, en los artículos y en las herramientas de depuración. Saber leerlos es imprescindible antes de escribirlos en el Módulo 5.',
    previous: 'En [[>interferencia|la lección 3.8]] encadenamos operaciones sobre un qubit; en [[>varios-qubits|la 3.9]], registros de varios qubits y el orden de Qiskit; en [[>compuertas-logicas|la 1.6]], la compuerta CNOT; y en [[>circuitos-logicos|la 1.7]], los circuitos lógicos clásicos.',
    next: 'La unidad 3.5 presenta con su nombre cada compuerta: X, H y Z (lección 3.11), Y, S y T (3.12) y las de varios qubits (3.13).',
  },

  objectives: [
    'Identificar en un diagrama las líneas de qubits, el estado inicial, las compuertas, las CNOT, las mediciones y el registro clásico.',
    'Seguir un circuito columna a columna y predecir qué puede salir al medir.',
    'Aplicar correctamente el convenio de orden de Qiskit al pasar del diagrama a las cadenas de resultados.',
  ],

  prerequisites: { lessons: ['varios-qubits'], knowledge: ['La compuerta CNOT (lección 1.6).'] },

  introduction: [
    { type: 'p', text: 'En la lección 3.8 escribíamos secuencias como «mezclar, cambiar signo, mezclar». Con un qubit basta una lista; con varios, hace falta saber además a qué qubit afecta cada operación y cuáles ocurren a la vez. Para eso se dibujan los <b>[[circuito-cuantico|circuitos cuánticos]]</b> [@nielsen2010].' },
  ],

  levels: {
    comprender: {
      intro: 'Qué es un circuito, sus símbolos, la trampa del orden y un editor para practicar.',
      sections: [
        {
          id: 'que-es',
          title: '¿Qué es un circuito cuántico?',
          blocks: [
            { type: 'p', text: 'Un circuito cuántico es la receta que ejecuta la QPU (lección 2.5): preparar los qubits, aplicarles una secuencia de operaciones y medirlos. Se parece a los circuitos lógicos de la lección 1.7, pero con tres diferencias importantes:' },
            { type: 'list', items: [
              '<b>Las líneas son qubits en el tiempo, no cables.</b> Cada línea horizontal es un qubit, y el tiempo avanza de izquierda a derecha. Una caja sobre una línea es una operación que se aplica a ese qubit en ese momento.',
              '<b>No hay bifurcaciones.</b> En un circuito lógico, un cable puede repartir su señal a varias compuertas. En uno cuántico no, porque un qubit no se puede copiar (lección 3.1).',
              '<b>Todo es reversible, salvo medir.</b> Las operaciones cuánticas no pierden información (lección 1.6); solo la medición, al final, la convierte en bits.',
            ] },
          ],
        },
        {
          id: 'simbolos',
          title: 'Los símbolos',
          blocks: [
            { type: 'table', head: ['Símbolo', 'Qué significa'], rows: [
              ['Línea con etiqueta <code>q0</code>, <code>q1</code>…', 'Un qubit. Se numeran desde 0, empezando por arriba.'],
              ['<code>|0⟩</code> al principio de la línea', 'Estado inicial. Salvo que se indique otra cosa, todos los qubits empiezan en $|0\\rangle$.'],
              ['Caja con <b>H</b>', 'La mezcla de la lección 3.5.'],
              ['Caja con <b>X</b>', 'Intercambiar 0 y 1: el NOT de la lección 1.6.'],
              ['Caja con <b>Z</b>', 'Cambiar el signo de la amplitud del 1 (lección 3.8).'],
              ['Punto ● unido a un círculo ⊕', '[[cnot|CNOT]]: si el qubit del punto (el control) vale 1, aplica X al del círculo (el objetivo).'],
              ['Recuadro con una aguja', 'Medición: convierte el qubit en un bit.'],
              ['Doble línea abajo (<code>c</code>)', 'Registro clásico: los bits donde se guardan los resultados.'],
            ] },
            { type: 'callout', kind: 'preview', title: 'De dónde salen las letras', text: 'H, X y Z son los nombres estándar de las operaciones que ya conoces. En la lección 3.11 veremos por qué se llaman así y otras compuertas que necesitan números complejos. La CNOT no es nueva: es la misma de la lección 1.6, ahora aplicada a qubits. Con superposiciones, crea entrelazamiento: así se prepara el par de Bell.' },
            { type: 'p', text: 'Ponte a prueba antes de seguir:' },
            { type: 'widget', id: 'circuit-quiz', caption: 'Cinco circuitos. Fíjate en qué línea está cada compuerta: dos preguntas están pensadas para la trampa del orden.' },
          ],
        },
        {
          id: 'orden',
          title: 'La trampa del orden, otra vez',
          blocks: [
            { type: 'callout', kind: 'warning', title: 'Arriba en el dibujo, a la derecha en la cadena', text: 'En los diagramas de Qiskit, el qubit 0 es la línea de <b>arriba</b>. En las cadenas de resultados es el bit de la <b>derecha</b> (lección 3.9) [@qiskit-bit-ordering]. Por eso un circuito con una X solo en q1 (la segunda línea) da la cadena $10$, no $01$.' },
            { type: 'p', text: 'Una forma de recordarlo: para pasar del diagrama a la cadena, gira mentalmente el dibujo 90° en el sentido de las agujas del reloj: la línea de arriba queda a la derecha y la de abajo, a la izquierda.' },
          ],
        },
        {
          id: 'construir',
          title: 'Construye y ejecuta circuitos',
          blocks: [
            { type: 'p', text: 'En el editor puedes colocar compuertas, recorrer el circuito columna a columna con el control deslizante y ejecutarlo 1000 veces, como haría una QPU sin ruido. Empieza por los ejemplos y después prueba tus propias ideas:' },
            { type: 'widget', id: 'circuit-builder', options: { preset: 'Par de Bell' }, caption: 'El simulador calcula exactamente las amplitudes tras cada columna, como los simuladores de vector de estado de la lección 2.3. La tabla usa el orden de Qiskit. Prueba a convertir el par de Bell en GHZ añadiendo un qubit.' },
            { type: 'list', items: [
              '<b>Columna a columna:</b> en el par de Bell, tras la H solo cambia q0 ($|00\\rangle$ y $|01\\rangle$); tras la CNOT, q1 copia el valor de q0 en cada caso ($|00\\rangle$ y $|11\\rangle$).',
              '<b>Las columnas son momentos:</b> las compuertas de una misma columna se aplican a la vez, a qubits distintos.',
              '<b>La medición está al final:</b> en este editor siempre se miden todos los qubits tras la última columna.',
            ] },
          ],
        },
        {
          id: 'ingenieria',
          title: 'Un circuito como programa',
          blocks: [
            { type: 'p', text: 'Para un ingeniero de software, un circuito es un programa sin bucles: una lista fija de instrucciones que se ejecuta de principio a fin y se repite muchas veces (lección 2.5). Antes de ejecutarse, el compilador lo adapta al equipo concreto, a veces añadiendo operaciones. Por eso el circuito que escribes y el que se ejecuta pueden dibujarse distinto [@qiskit-docs].' },
            { type: 'callout', kind: 'note', title: 'Medir antes del final', text: 'Algunos equipos actuales permiten medir a mitad de circuito y decidir qué hacer después según el resultado, como un <code>if</code>. Se llaman circuitos dinámicos y los veremos al programar en el Módulo 5. En este módulo, la medición siempre va al final.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Leer un circuito es seguir la lista de amplitudes columna a columna.',
      sections: [
        {
          id: 'columna-a-columna',
          title: 'El par de Bell, columna a columna',
          key: 'Cada columna transforma la lista de amplitudes. Para leer un circuito, se parte de |00…0⟩ y se aplica una columna tras otra.',
          blocks: [
            { type: 'steps', items: [
              { text: 'Inicio, dos qubits en 0:', tex: '|00\\rangle' },
              { text: 'H en q0 (el bit de la derecha):', tex: '\\tfrac{1}{\\sqrt2}\\big(|00\\rangle + |01\\rangle\\big)' },
              { text: 'CNOT con control q0 y objetivo q1: en $|01\\rangle$ el control vale 1 y el objetivo cambia, $|01\\rangle \\to |11\\rangle$:', tex: '\\tfrac{1}{\\sqrt2}\\big(|00\\rangle + |11\\rangle\\big)' },
            ] },
            { deep: true, type: 'p', text: 'Cada compuerta es una matriz que multiplica el vector de amplitudes, y un circuito completo es el producto de esas matrices en orden. Una compuerta de un qubit en un sistema de $n$ qubits actúa como una matriz de $2^n \\times 2^n$ construida con el producto tensorial (Módulo 4).' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Un circuito escrito como lista de instrucciones, como en Qiskit, y un mini simulador para ejecutarlo.',
      sections: [
        {
          id: 'python-circuito',
          title: 'Un circuito como lista de instrucciones',
          blocks: [
            { type: 'code', lang: 'python', file: 'circuito.py', code: `import math

r = 1 / math.sqrt(2)

def bit(cadena, q):
    """Bit del qubit q. Como en Qiskit, el qubit 0 es el último carácter."""
    return cadena[len(cadena) - 1 - q]

def voltear(cadena, q):
    i = len(cadena) - 1 - q
    return cadena[:i] + ("1" if cadena[i] == "0" else "0") + cadena[i + 1:]

def aplicar(estado, compuerta, q, objetivo=None):
    nuevo = {}
    for cadena, amp in estado.items():
        if compuerta == "H":                                  # la mezcla
            signo = -1 if bit(cadena, q) == "1" else 1
            cero = cadena if bit(cadena, q) == "0" else voltear(cadena, q)
            salidas = [(cero, r * amp), (voltear(cero, q), signo * r * amp)]
        elif compuerta == "X":                                # intercambiar 0 y 1
            salidas = [(voltear(cadena, q), amp)]
        elif compuerta == "CX":                               # si el control vale 1, X al objetivo
            salidas = [(voltear(cadena, objetivo) if bit(cadena, q) == "1" else cadena, amp)]
        for c, a in salidas:
            nuevo[c] = nuevo.get(c, 0) + a
    return {c: a for c, a in nuevo.items() if abs(a) > 1e-12}

circuito = [("H", 0), ("CX", 0, 1)]          # en Qiskit: qc.h(0) y qc.cx(0, 1)
estado = {"00": 1}                            # todos los qubits empiezan en 0
for instruccion in circuito:
    estado = aplicar(estado, *instruccion)
    print(instruccion, {c: round(a, 3) for c, a in estado.items()})

print("probabilidades:", {c: round(a**2, 2) for c, a in estado.items()})`,
            output: `('H', 0) {'00': 0.707, '01': 0.707}
('CX', 0, 1) {'00': 0.707, '11': 0.707}
probabilidades: {'00': 0.5, '11': 0.5}` },
            { type: 'list', items: [
              '<b><code>circuito</code></b> es una lista de instrucciones: (compuerta, qubit) o (compuerta, control, objetivo). En Qiskit se escribe casi igual: <code>qc.h(0)</code> y <code>qc.cx(0, 1)</code> [@qiskit-docs].',
              '<b>El estado</b> es un diccionario {cadena: amplitud} que solo guarda las amplitudes no nulas.',
              '<b><code>nuevo.get(c, 0) + a</code></b> suma las contribuciones que llegan a una misma cadena: ahí ocurre la interferencia (lección 3.8).',
            ] },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Las líneas de un circuito cuántico son cables por los que viajan los qubits».', reality: 'Cada línea es un qubit que permanece en su sitio; el eje horizontal es el tiempo.' },
    { myth: '«El qubit de arriba es el primer bit de la cadena de resultados».', reality: 'En Qiskit, el qubit de arriba (q0) es el último bit de la cadena, el de la derecha.' },
    { myth: '«Un circuito cuántico es como un programa normal, con bucles y condiciones».', reality: 'En su forma básica es una lista fija de operaciones seguida de mediciones. Los circuitos dinámicos añaden decisiones a mitad, con limitaciones.' },
  ],

  summary: [
    'Un circuito cuántico es una secuencia de operaciones sobre qubits, de izquierda a derecha, seguida de mediciones [@nielsen2010].',
    'Símbolos: líneas q0, q1… que empiezan en $|0\\rangle$, cajas H, X y Z, CNOT (● y ⊕), medidores y el registro clásico de doble línea.',
    'En Qiskit, q0 es la línea de arriba en el diagrama y el bit de la derecha en la cadena [@qiskit-bit-ordering].',
    'Leer un circuito es seguir las amplitudes columna a columna.',
  ],

  exercises: [
    { level: 'comprender', question: 'Un circuito de 3 qubits tiene una X en q0 y otra en q2. ¿Qué cadena se mide?', answer: '$101$: q2 a la izquierda vale 1, q1 en medio vale 0 y q0 a la derecha vale 1. Es el número 5.' },
    { level: 'comprender', question: '¿Qué hace una CNOT cuyo control está en $|0\\rangle$? ¿Y si el control está en $|+\\rangle$ y el objetivo en $|0\\rangle$?', answer: 'Con el control en $|0\\rangle$ no hace nada. Con el control en $|+\\rangle$ produce un par entrelazado: $\\tfrac{1}{\\sqrt2}(|00\\rangle + |11\\rangle)$, el par de Bell.' },
    { level: 'matematico', question: 'Sigue columna a columna el circuito de 2 qubits: H en q0; CNOT de q0 a q1; X en q1.', answer: '$|00\\rangle \\to \\tfrac{1}{\\sqrt2}(|00\\rangle + |01\\rangle) \\to \\tfrac{1}{\\sqrt2}(|00\\rangle + |11\\rangle) \\to \\tfrac{1}{\\sqrt2}(|10\\rangle + |01\\rangle)$. Al medir: $10$ o $01$, mitad y mitad; los dos qubits nunca coinciden.' },
    { level: 'implementar', question: 'Cambia la lista <code>circuito</code> de <code>circuito.py</code> para preparar el estado GHZ de 3 qubits.', answer: '<pre><code class="language-python">circuito = [("H", 0), ("CX", 0, 1), ("CX", 0, 2)]\nestado = {"000": 1}</code></pre>Al final: <code>{\'000\': 0.707, \'111\': 0.707}</code>.' },
  ],

  references: [
    { key: 'nielsen2010', use: 'Modelo de circuitos cuánticos y sus símbolos.' },
    { key: 'qiskit-bit-ordering', use: 'Qubit 0 arriba en los diagramas y a la derecha en las cadenas.' },
    { key: 'qiskit-docs', use: 'Construcción de circuitos y circuitos dinámicos en Qiskit.' },
  ],

  related: ['varios-qubits', 'interferencia', 'compuertas-logicas', 'circuitos-logicos', 'compuertas-x-h-z'],
  next: 'compuertas-x-h-z',
};
