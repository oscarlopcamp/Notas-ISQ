// Lección 1.7 — Tablas de verdad y circuitos lógicos
// Salidas de código obtenidas con CPython 3.14 (2026-10-14). El sumador completo
// y Quine–McCluskey se verifican exhaustivamente en tests/module1.test.js.

export default {
  id: 'circuitos-logicos',
  title: 'Tablas de verdad y circuitos lógicos',
  lede: 'Combinando compuertas se construyen circuitos que suman, eligen y comparan. Esta lección construye, pieza a pieza, el sumador que usamos en la lección 1.2, y demuestra que cualquier tabla de verdad se puede convertir en un circuito.',
  updated: '2026-10-14',

  context: {
    learn: 'Qué es un circuito combinacional, cómo se construyen el semisumador, el sumador completo, el sumador de n bits y el multiplexor, cómo se pasa de una tabla de verdad a un circuito (suma de productos) y cómo se simplifica. También, brevemente, cómo se guarda un bit con un circuito secuencial.',
    why: 'Cierra el círculo entre la aritmética binaria (lección 1.2), la lógica (1.5) y las compuertas (1.6). Además, «diseñar un circuito a partir de lo que debe calcular» es exactamente la tarea de la programación cuántica a bajo nivel.',
    previous: 'En [[>compuertas-logicas|la lección 1.6]] conocimos las compuertas y su universalidad. En [[>sistema-binario|la 1.2]] sumamos bits con acarreos.',
    next: 'En la lección 1.8 estos circuitos se convierten en la ALU y los registros de un procesador. En el Módulo 3 leerás circuitos cuánticos, que se dibujan y se razonan de una forma parecida.',
  },

  objectives: [
    'Derivar las ecuaciones del semisumador y del sumador completo a partir de su tabla de verdad.',
    'Construir un sumador de n bits encadenando sumadores completos y explicar el retardo de propagación del acarreo.',
    'Obtener la suma de productos canónica de cualquier tabla de verdad y justificar la universalidad de {AND, OR, NOT}.',
    'Simplificar funciones de 3 variables con mapas de Karnaugh.',
    'Distinguir circuitos combinacionales y secuenciales.',
  ],

  prerequisites: { lessons: ['compuertas-logicas', 'sistema-binario'], knowledge: [] },

  introduction: [
    { type: 'p', text: 'Un [[circuito-combinacional|circuito combinacional]] es una red de compuertas sin bucles: su salida depende solo de las entradas de ese instante. Diseñarlo consiste en traducir una especificación («quiero sumar dos bits») a una tabla de verdad y la tabla a compuertas.' },
    { type: 'p', text: 'Haremos ese recorrido con el ejemplo más importante de la informática: la suma.' },
  ],

  levels: {
    comprender: {
      intro: 'Construimos el sumador pieza a pieza y aprendemos a convertir cualquier tabla en un circuito.',
      sections: [
        {
          id: 'semisumador',
          title: 'Sumar dos bits: el semisumador',
          blocks: [
            { type: 'p', text: 'Sumar dos bits $A$ y $B$ da un resultado de 0 a 2, que en binario necesita dos cifras: la cifra de la suma ($S$) y el acarreo ($C$).' },
            { type: 'table', head: ['$A$', '$B$', '$A+B$', '$C$ (acarreo)', '$S$ (suma)'], mono: [0, 1, 2, 3, 4], rows: [['0', '0', '0', '0', '0'], ['0', '1', '1', '0', '1'], ['1', '0', '1', '0', '1'], ['1', '1', '2', '1', '0']] },
            { type: 'p', text: 'Mira las columnas: $S$ es exactamente la tabla de XOR y $C$ es la de AND. Por tanto, $S = A \\oplus B$ y $C = A \\cdot B$. Ese circuito de dos compuertas se llama <b>semisumador</b>.' },
            { type: 'widget', id: 'circuit-sim', options: { circuit: 'half' }, caption: 'Pulsa las entradas y observa la fila activa de la tabla. Después elige «Sumador completo» y «Multiplexor 2:1». En cualquier circuito, «Propagar un nivel» muestra cómo las señales atraviesan las compuertas por etapas.' },
          ],
        },
        {
          id: 'sumador-completo',
          title: 'Tres bits: el sumador completo',
          blocks: [
            { type: 'p', text: 'En una suma de varias cifras, cada columna (salvo la primera) recibe además el acarreo de la anterior. El [[sumador-completo|sumador completo]] suma tres bits: $A$, $B$ y $C_{in}$. Se construye con dos semisumadores: el primero suma $A$ y $B$, y el segundo suma el resultado con $C_{in}$. Hay acarreo de salida si cualquiera de los dos semisumadores lo produce:' },
            { type: 'math', tex: 'S = A \\oplus B \\oplus C_{in}, \\qquad C_{out} = A \\cdot B + C_{in} \\cdot (A \\oplus B)' },
            { type: 'p', text: 'Encadenando cuatro sumadores completos, de modo que el acarreo de salida de cada uno entre en el siguiente, obtenemos un sumador de 4 bits: el mismo que manejaste en el simulador de la lección 1.2, ahora construido con compuertas.' },
            { type: 'widget', id: 'circuit-sim', options: { circuit: 'ripple' }, caption: 'Sumador de 4 bits con propagación del acarreo. Empieza con 7 + 1 (0111 + 0001) y pulsa varias veces «Propagar un nivel»: el acarreo tiene que atravesar los cuatro bloques antes de que el resultado sea correcto.' },
            { type: 'p', text: 'Esto revela un problema de ingeniería. El resultado no es válido hasta que el acarreo ha recorrido toda la cadena, y en un sumador de 64 bits eso supone 64 etapas. Los procesadores usan diseños más ingeniosos, como los sumadores con anticipación de acarreo (<i>carry-lookahead</i>), que calculan los acarreos en paralelo a cambio de más compuertas [@harris2013]. Es un compromiso clásico entre velocidad y tamaño.' },
          ],
        },
        {
          id: 'multiplexor',
          title: 'Elegir: el multiplexor',
          blocks: [
            { type: 'p', text: 'Un multiplexor elige una de varias entradas de datos según una señal de selección. El de 2 entradas calcula $Y = D_0 \\cdot \\lnot S + D_1 \\cdot S$: si $S = 0$ pasa $D_0$ y si $S = 1$ pasa $D_1$. Es la versión en hardware de <code>y = d1 if s else d0</code>, y aparece por todas partes en un procesador, por ejemplo para elegir qué registro llega a la ALU.' },
          ],
        },
        {
          id: 'sintesis',
          title: 'De cualquier tabla a un circuito',
          blocks: [
            { type: 'p', text: 'Hasta ahora hemos «adivinado» los circuitos mirando las tablas. Hay un método que siempre funciona, la [[suma-de-productos|suma de productos]]:' },
            { type: 'list', ordered: true, items: [
              'Para cada fila en la que la salida vale 1, escribe un término AND que solo valga 1 en esa fila: cada variable aparece tal cual si vale 1 y negada si vale 0. Por ejemplo, la fila $A=0, B=1, C=1$ da $\\lnot A \\cdot B \\cdot C$.',
              'Une todos esos términos con OR.',
            ] },
            { type: 'p', text: 'La expresión resultante vale 1 exactamente en las filas elegidas, así que reproduce la tabla. Como solo usa AND, OR y NOT, esto demuestra que {AND, OR, NOT} es universal, el resultado que la lección 1.6 dejó pendiente.' },
            { type: 'widget', id: 'sop-synth', options: { preset: 'Mayoría' }, caption: 'Pulsa la columna Y para definir la función. Arriba aparece la suma de productos canónica y, debajo, una versión simplificada. En el mapa de Karnaugh, los puntos de color señalan qué celdas cubre cada término de la versión simplificada. Prueba la paridad: es una función que no se puede simplificar.' },
            { type: 'p', text: 'La forma canónica es correcta, pero suele ser larga. Para simplificarla se agrupan filas vecinas que difieren en una sola variable. Por ejemplo, $A\\cdot B\\cdot\\lnot C + A\\cdot B\\cdot C = A\\cdot B$, porque $C$ no importa. Los <b>mapas de Karnaugh</b> [@karnaugh1953] ordenan la tabla de forma que esas filas queden visualmente juntas, y el método de <b>Quine–McCluskey</b> [@quine1952; @mccluskey1956] lo hace de forma sistemática y programable; es el que usa el simulador.' },
            { type: 'callout', kind: 'note', title: 'Honestidad del simulador', text: 'El simulador encuentra todos los implicantes primos con Quine–McCluskey y elige una cobertura con una estrategia voraz. Para funciones de 3 variables el resultado es mínimo en los casos habituales, pero la estrategia voraz no garantiza el mínimo en general. Lo que sí garantiza, y comprueba en cada caso, es que la expresión simplificada es equivalente a la tabla.' },
          ],
        },
        {
          id: 'secuenciales',
          title: 'Más allá: circuitos con memoria',
          blocks: [
            { type: 'p', text: 'Si se permiten bucles, conectando la salida de una compuerta de nuevo a la entrada de otra, el circuito puede «recordar». Dos compuertas NOR conectadas en cruz forman un <em>cerrojo</em> (latch) que guarda un bit mientras tenga alimentación [@harris2013]. Con estos elementos, sincronizados por una señal de reloj, se construyen los registros y las memorias de la lección 1.8. Estos circuitos se llaman <em>secuenciales</em>: su salida depende de las entradas y del estado guardado.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Derivación formal del sumador completo, prueba de que la suma de productos funciona y análisis del retardo.',
      sections: [
        {
          id: 'derivacion',
          title: 'Derivar el sumador completo',
          blocks: [
            { type: 'p', text: 'La especificación es $A + B + C_{in} = 2\\,C_{out} + S$, con sumas aritméticas. $S$ vale 1 cuando la suma es impar (1 o 3) y $C_{out}$, cuando es al menos 2:' },
            { type: 'table', head: ['$A$', '$B$', '$C_{in}$', 'suma', '$C_{out}$', '$S$'], mono: [0, 1, 2, 3, 4, 5], rows: [
              ['0', '0', '0', '0', '0', '0'], ['0', '0', '1', '1', '0', '1'], ['0', '1', '0', '1', '0', '1'], ['0', '1', '1', '2', '1', '0'],
              ['1', '0', '0', '1', '0', '1'], ['1', '0', '1', '2', '1', '0'], ['1', '1', '0', '2', '1', '0'], ['1', '1', '1', '3', '1', '1'],
            ] },
            { type: 'steps', items: [
              { text: '«Impar número de unos» es la paridad, que es XOR encadenado (lección 1.5):', tex: 'S = A \\oplus B \\oplus C_{in}' },
              { text: '$C_{out}$ es la función mayoría. Su suma de productos canónica es:', tex: 'C_{out} = \\lnot A B C_{in} + A \\lnot B C_{in} + A B \\lnot C_{in} + A B C_{in}' },
              { text: 'Agrupando los dos últimos términos ($C_{in}$ no importa) y los dos primeros (son $C_{in}\\cdot(A \\oplus B)$):', tex: 'C_{out} = A\\cdot B + C_{in}\\cdot(A \\oplus B)' },
            ] },
            { type: 'p', text: 'Esta forma reutiliza la compuerta $A \\oplus B$ que ya necesitamos para $S$, y por eso el circuito tiene solo 5 compuertas.' },
          ],
        },
        {
          id: 'universalidad-sop',
          title: 'Por qué la suma de productos siempre funciona',
          blocks: [
            { type: 'p', text: 'Para cada combinación $m = (m_1, \\dots, m_n)$ definimos el <em>minitérmino</em> $P_m = \\ell_1 \\cdot \\ell_2 \\cdots \\ell_n$, con $\\ell_i = x_i$ si $m_i = 1$ y $\\ell_i = \\lnot x_i$ si $m_i = 0$.' },
            { type: 'steps', items: [
              { text: '$P_m(x) = 1$ si y solo si todos sus literales valen 1, es decir, si $x = m$.' },
              { text: 'Definimos', tex: 'F(x) = \\sum_{m \\,:\\, f(m) = 1} P_m(x) \\quad (\\text{OR de minitérminos})' },
              { text: 'Si $f(x) = 1$, el minitérmino $P_x$ está en la suma y vale 1, así que $F(x) = 1$. Si $f(x) = 0$, ningún minitérmino de la suma coincide con $x$ y todos valen 0, así que $F(x) = 0$. Por tanto, $F = f$. ∎' },
            ] },
          ],
        },
        {
          id: 'retardo',
          title: 'El coste del acarreo en cadena',
          blocks: [
            { type: 'p', text: 'Si cada sumador completo tarda $t$ en producir su acarreo, el sumador de $n$ bits en cadena tarda en el peor caso:' },
            { type: 'math', tex: 'T_{\\text{ripple}}(n) \\approx n \\cdot t = O(n)' },
            { type: 'p', text: 'El peor caso es un acarreo que recorre todas las posiciones, como en $0111\\ldots1 + 0000\\ldots1$. Los sumadores con anticipación de acarreo reducen el retardo a un crecimiento logarítmico en $n$, a cambio de más compuertas [@harris2013]. Es nuestro primer encuentro con el análisis de complejidad, que formalizaremos en la lección 1.11.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Simulamos en Python el sumador construido con compuertas y lo comparamos con el operador +; después sintetizamos una suma de productos.',
      sections: [
        {
          id: 'python-sumador',
          title: 'Un sumador de 4 bits hecho de compuertas',
          blocks: [
            { type: 'code', lang: 'python', file: 'sumador.py', code: `def semisumador(a, b):
    return a ^ b, a & b  # (suma, acarreo)


def sumador_completo(a, b, c):
    s1, c1 = semisumador(a, b)
    s, c2 = semisumador(s1, c)
    return s, c1 | c2


def sumador_4_bits(x, y):
    acarreo, resultado = 0, 0
    for i in range(4):
        s, acarreo = sumador_completo((x >> i) & 1, (y >> i) & 1, acarreo)
        resultado |= s << i
    return resultado, acarreo


print(sumador_4_bits(6, 7))
print(sumador_4_bits(12, 5))
assert all(sumador_4_bits(x, y) == ((x + y) & 0xF, (x + y) >> 4) for x in range(16) for y in range(16))
print("El sumador de 4 bits coincide con + para las 256 parejas")`,
            output: `(13, 0)
(1, 1)
El sumador de 4 bits coincide con + para las 256 parejas` },
            { type: 'list', items: [
              '<b><code>sumador_completo</code></b>: dos semisumadores y un OR, exactamente como el esquema del simulador.',
              '<b><code>(x &gt;&gt; i) &amp; 1</code></b> extrae el bit $i$; <code>resultado |= s &lt;&lt; i</code> lo coloca en su posición.',
              '<b>Resultados:</b> 6 + 7 = 13 sin acarreo; 12 + 5 = 1 con acarreo final, el desbordamiento de la lección 1.2.',
              'La aserción final es una verificación exhaustiva: el circuito y el operador <code>+</code> coinciden en las 256 parejas de 4 bits.',
            ] },
          ],
        },
        {
          id: 'python-sop',
          title: 'Síntesis automática de la suma de productos',
          blocks: [
            { type: 'code', lang: 'python', file: 'suma_productos.py', code: `from itertools import product


def suma_de_productos(tabla, nombres):
    terminos = []
    for entrada, salida in tabla.items():
        if salida:
            literales = [n if v else f"¬{n}" for n, v in zip(nombres, entrada)]
            terminos.append("·".join(literales))
    return " + ".join(terminos) or "0"


mayoria = {e: int(sum(e) >= 2) for e in product([0, 1], repeat=3)}
print(suma_de_productos(mayoria, ["A", "B", "C"]))`,
            output: '¬A·B·C + A·¬B·C + A·B·¬C + A·B·C' },
            { type: 'p', text: 'Es la demostración del nivel 2 convertida en programa: un término por cada fila con salida 1. La forma simplificada de la mayoría, $A\\cdot B + A\\cdot C + B\\cdot C$, es la que muestra el sintetizador del nivel 1.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«La suma de bits es un OR».', reality: 'El OR da $1 + 1 = 1$. La suma aritmética de dos bits necesita dos salidas: la cifra (XOR) y el acarreo (AND).' },
    { myth: '«Un circuito más corto en el papel es siempre más rápido».', reality: 'Lo que limita la velocidad es el camino más largo que debe recorrer una señal (la profundidad), no el número total de compuertas. Un sumador con anticipación de acarreo tiene más compuertas que uno en cadena y es más rápido.' },
    { myth: '«La expresión mínima de una función es única».', reality: 'A veces hay varias expresiones mínimas distintas e igual de cortas. Lo único que importa es que todas sean equivalentes a la tabla.' },
  ],

  summary: [
    'Semisumador: $S = A \\oplus B$, $C = A \\cdot B$. Sumador completo: $S = A \\oplus B \\oplus C_{in}$, $C_{out} = AB + C_{in}(A \\oplus B)$.',
    'Encadenando $n$ sumadores completos se suma con $n$ bits; el acarreo en cadena tarda $O(n)$.',
    'Toda tabla de verdad se convierte en una suma de productos; por eso {AND, OR, NOT} es universal.',
    'Karnaugh y Quine–McCluskey simplifican agrupando filas que difieren en una variable.',
    'Los circuitos secuenciales, con realimentación, guardan bits: son la base de registros y memorias.',
  ],

  exercises: [
    { level: 'comprender', question: 'En el sumador de 4 bits, ¿qué suma hace que el acarreo recorra los cuatro bloques? Compruébalo con «Propagar un nivel».', answer: 'Por ejemplo, $0111 + 0001$ (7 + 1) o $1111 + 0001$: el acarreo generado en el bit 0 debe propagarse por todos los bloques siguientes.' },
    { level: 'comprender', question: 'Diseña con el sintetizador una función de 3 variables que valga 1 solo cuando exactamente una entrada vale 1. ¿Se puede simplificar?', answer: 'Las filas 001, 010 y 100: $\\lnot A\\lnot B C + \\lnot A B \\lnot C + A \\lnot B \\lnot C$. Ninguna pareja de esas celdas es vecina en el mapa de Karnaugh (difieren en dos variables), así que no se puede simplificar como suma de productos.' },
    { level: 'matematico', question: 'Simplifica $A\\,\\lnot B\\,C + A\\,B\\,C + \\lnot A\\,B\\,C$.', answer: 'Los dos primeros términos dan $A\\cdot C$ ($B$ no importa) y los dos últimos, $B\\cdot C$. Resultado: $A\\cdot C + B\\cdot C = C\\cdot(A + B)$.' },
    { level: 'matematico', question: '¿Cuántas compuertas usa un sumador de $n$ bits en cadena construido como en esta lección?', answer: 'Cada sumador completo usa 5 compuertas (2 XOR, 2 AND, 1 OR), así que $5n$. Para 64 bits, 320 compuertas, pero con una profundidad que crece con $n$.' },
    { level: 'implementar', question: 'Implementa un multiplexor 2:1 con compuertas en Python y compruébalo en las 8 combinaciones.', answer: '<pre><code>def mux(d0, d1, s):\n    return (d0 &amp; (1 - s)) | (d1 &amp; s)\n\nfrom itertools import product\nassert all(mux(d0, d1, s) == (d1 if s else d0) for d0, d1, s in product([0, 1], repeat=3))</code></pre>' },
  ],

  references: [
    { key: 'harris2013', use: 'Sumadores, multiplexores, anticipación de acarreo, cerrojos y circuitos secuenciales.' },
    { key: 'patterson2021', use: 'El sumador como parte de la ALU del procesador.' },
    { key: 'karnaugh1953', use: 'Mapas de Karnaugh.' },
    { key: 'quine1952', use: 'Implicantes primos.' },
    { key: 'mccluskey1956', use: 'Método tabular de minimización (Quine–McCluskey).' },
    { key: 'shannon1938', use: 'Síntesis de funciones lógicas con circuitos de conmutación.' },
  ],

  related: ['sistema-binario', 'compuertas-logicas', 'procesador-memoria', 'circuitos-cuanticos'],
  next: 'procesador-memoria',
};
