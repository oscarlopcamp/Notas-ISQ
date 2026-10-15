// Lección 1.2 — Sistema binario y representación de números
//
// Todas las salidas de código se obtuvieron ejecutando los ejemplos con
// CPython 3.14 (2026-10-14). Los patrones IEEE 754 (3DCCCCCD, C0200000,
// 3E200000…) y los valores exactos almacenados se comprobaron con struct y
// decimal en el mismo intérprete, y con las pruebas automáticas de tests/.

export default {
  id: 'sistema-binario',
  title: 'Sistema binario y representación de números',
  lede: 'Una computadora guarda cada número en un número fijo de bits. Esa decisión, aparentemente pequeña, explica por qué 127 + 1 puede dar −128, por qué 0,1 + 0,2 no da exactamente 0,3 y cómo se representan los números negativos y los decimales.',
  updated: '2026-10-14',

  context: {
    learn: 'Cómo se representan los enteros con un ancho fijo de bits, cómo se suman, cómo se codifican los negativos (complemento a dos) y los números reales (punto flotante IEEE 754), y qué consecuencias tiene: desbordamiento y error de redondeo.',
    why: 'Muchos fallos reales de software nacen aquí. Además, cuando más adelante simulemos computadoras cuánticas en una computadora normal, todo se calculará con números de punto flotante, y entender el redondeo será imprescindible para interpretar y probar los resultados.',
    previous: 'En [[>representacion-informacion|la lección 1.1]] vimos la notación posicional, la conversión decimal-binario por divisiones sucesivas y el hexadecimal. Aquí los damos por sabidos y vamos un paso más allá.',
    next: 'La aritmética módulo $2^n$ y el punto flotante reaparecerán más adelante en el curso. En la unidad «Lógica digital» construiremos el sumador de esta lección con compuertas.',
  },

  objectives: [
    'Calcular el rango de enteros representable con $n$ bits, con y sin signo.',
    'Sumar números binarios columna a columna y reconocer el desbordamiento.',
    'Explicar por qué el complemento a dos sustituyó a la representación con signo y magnitud, y negar números invirtiendo bits y sumando 1.',
    'Convertir fracciones decimales a binario y predecir cuándo la expansión es infinita.',
    'Leer un número IEEE 754 (signo, exponente y fracción) y calcular su valor.',
    'Explicar el error de redondeo y comparar números de punto flotante con tolerancia.',
  ],

  prerequisites: {
    lessons: ['representacion-informacion'],
    knowledge: [
      'Notación posicional en base 2 y conversión decimal-binario (lección 1.1).',
      'Notación científica en base 10, por ejemplo $6{,}02 \\times 10^{23}$.',
    ],
  },

  introduction: [
    { type: 'p', text: 'En la lección anterior escribimos el número 72 como <code>01001000</code>. Pero los programas no solo guardan números: los suman, los restan y los comparan. Además necesitan números negativos (una temperatura, un saldo bancario) y números con decimales (una velocidad, una probabilidad).' },
    { type: 'p', text: 'Hay una restricción que lo condiciona todo: el procesador trabaja con números de un tamaño fijo, normalmente de 8, 16, 32 o 64 bits. No puede «añadir una cifra más» cuando un resultado crece. Esta lección explora qué ocurre por eso y qué soluciones ingeniosas se han adoptado.' },
    { type: 'callout', kind: 'note', title: 'Cómo aprovechar esta lección', text: 'Tiene cinco simuladores. Úsalos <em>antes</em> de leer la explicación que los sigue: intenta predecir qué va a pasar, pulsa y comprueba. Los errores de predicción son la parte más valiosa.' },
  ],

  levels: {
    // =====================================================================
    comprender: {
      intro: 'Construimos la intuición con la rueda de números, el sumador y el explorador de punto flotante. Las fórmulas llegan en el nivel 2.',
      sections: [
        {
          id: 'ancho-fijo',
          title: 'Contar con un número fijo de cifras',
          blocks: [
            { type: 'p', text: 'Piensa en el cuentakilómetros mecánico de un coche antiguo, con seis ruedas de dígitos. Puede mostrar desde 000000 hasta 999999. ¿Qué ocurre al recorrer un kilómetro más cuando marca 999999? Todas las ruedas giran a la vez y el contador vuelve a 000000. La cifra que «debería» aparecer a la izquierda no tiene dónde escribirse.' },
            { type: 'p', text: 'Los enteros dentro de un procesador se comportan igual. Cada número ocupa un [[ancho-fijo|ancho fijo]] de bits, y con $n$ bits hay exactamente $2^n$ patrones. Si los usamos para los enteros no negativos, el rango va de 0 a $2^n - 1$. Después del último patrón viene otra vez el primero.' },
            { type: 'widget', id: 'number-wheel', options: { bits: 4, mode: 'unsigned', start: 13 }, caption: 'Con 4 bits hay 16 patrones, dispuestos en círculo. Empieza en <code>1101</code> (13) y pulsa «+1» varias veces: tras <code>1111</code> (15) se vuelve a <code>0000</code> (0). La línea roja marca ese salto. Puedes pulsar cualquier punto de la rueda para ir a ese patrón.' },
            { type: 'callout', kind: 'analogy', title: 'Límite de la analogía', text: 'El cuentakilómetros es decimal y solo avanza. Los registros del procesador son binarios y la aritmética también resta, pero la idea esencial se conserva: un número fijo de posiciones y una vuelta completa al superar el máximo.' },
            { type: 'table', head: ['Bits', 'Patrones', 'Rango sin signo', 'Uso habitual'], rows: [
              ['8', '256', '0 … 255', 'Un byte; un canal de color'],
              ['16', '65 536', '0 … 65 535', 'Muestras de audio en CD'],
              ['32', '4 294 967 296', '0 … 4 294 967 295', 'Direcciones IPv4; enteros «int» en muchos lenguajes'],
              ['64', '≈ 1,8 × 10¹⁹', '0 … 18 446 744 073 709 551 615', 'Enteros y direcciones de memoria en procesadores actuales'],
            ], caption: 'Rangos de los anchos más comunes. Cada bit adicional duplica el número de patrones.' },
          ],
        },
        {
          id: 'suma-binaria',
          title: 'Sumar en binario',
          blocks: [
            { type: 'p', text: 'La suma binaria se hace exactamente igual que la suma que aprendiste en la escuela: columna a columna, de derecha a izquierda, «llevando» cuando el resultado de una columna no cabe en una cifra. La única diferencia es que en binario una columna se llena antes: $1 + 1$ ya es «2», que en binario se escribe <code>10</code>. Se escribe 0 y se lleva 1. A ese bit que se lleva lo llamamos [[acarreo]].' },
            { type: 'table', head: ['Bit de A', 'Bit de B', 'Acarreo que llega', 'Total', 'Se escribe', 'Se lleva'], mono: [0, 1, 2, 3, 4, 5], rows: [
              ['0', '0', '0', '0', '0', '0'],
              ['0', '1', '0', '1', '1', '0'],
              ['1', '1', '0', '2', '0', '1'],
              ['1', '1', '1', '3', '1', '1'],
            ], caption: 'Los casos de una columna (el resto son permutaciones de estos). El total es como mucho 3, así que el acarreo nunca pasa de 1.' },
            { type: 'widget', id: 'binary-adder', options: { bits: 4, a: 6, b: 7, mode: 'unsigned' }, caption: 'Pulsa «Siguiente columna» para resolver $6 + 7$ paso a paso. Después prueba el ejemplo «12 + 5»: la suma real es 17, que no cabe en 4 bits. Observa qué pasa con el último acarreo.' },
            { type: 'p', text: 'En «12 + 5» el resultado tendría cinco bits, <code>10001</code>, pero solo hay sitio para cuatro. El acarreo final se pierde y queda <code>0001</code>: $12 + 5 = 1$. Es la vuelta de la rueda que vimos antes. Este fenómeno se llama [[desbordamiento]] (<i>overflow</i>).' },
          ],
        },
        {
          id: 'negativos',
          title: '¿Cómo se guardan los números negativos?',
          blocks: [
            { type: 'p', text: 'Hasta ahora todos los patrones representaban números no negativos. Para tener negativos hay que «gastar» parte de los patrones en ellos. Veamos dos ideas.' },
            { type: 'h', text: 'Primera idea: un bit para el signo' },
            { type: 'p', text: 'La más natural es reservar el primer bit para el signo (0 positivo, 1 negativo) y usar el resto para el valor absoluto, igual que escribimos «−5». Es la representación de [[signo-magnitud|signo y magnitud]]. Pruébala en la rueda:' },
            { type: 'widget', id: 'number-wheel', options: { bits: 4, mode: 'sign-magnitude', start: 9 }, caption: 'Signo y magnitud con 4 bits. Empieza en <code>1001</code> (−1) y pulsa «+1». Fíjate también en <code>0000</code> y <code>1000</code>.' },
            { type: 'p', text: 'Aparecen dos problemas. Hay <em>dos ceros</em> (+0 y −0), lo que desperdicia un patrón y complica las comparaciones. Y, sobre todo, la suma ordinaria de patrones deja de funcionar: al sumar 1 a −1 (<code>1001</code>) se obtiene <code>1010</code>, que es −2. Habría que construir circuitos distintos para sumar según los signos.' },
            { type: 'h', text: 'Segunda idea: el complemento a dos' },
            { type: 'p', text: 'La solución que se impuso es más astuta. Mira la rueda sin signo: si partimos de 0 y retrocedemos un paso, llegamos a <code>1111</code>. ¿Por qué no decir, simplemente, que <code>1111</code> <em>es</em> −1? Y que <code>1110</code>, un paso más atrás, es −2, y así sucesivamente. La mitad de la rueda que empieza por 1 pasa a representar los negativos. Esta es la representación en [[complemento-a-dos|complemento a dos]].' },
            { type: 'widget', id: 'number-wheel', options: { bits: 4, mode: 'signed', start: 14 }, caption: 'Complemento a dos con 4 bits: de −8 a 7. Empieza en <code>1110</code> (−2) y pulsa «+1» tres veces: −2, −1, 0, 1, sin ningún caso especial. Después avanza hasta 7 y suma 1 de nuevo.' },
            { type: 'p', text: 'La ventaja decisiva es que el circuito de suma es <em>exactamente el mismo</em> para números con signo y sin signo: solo cambia cómo interpretamos los patrones. Por eso prácticamente todas las computadoras actuales representan así los enteros con signo [@bryant2016, §2.2]. Además, solo hay un cero, y el primer bit sigue indicando el signo.' },
            { type: 'p', text: '¿Cómo se obtiene el patrón de un número negativo sin dibujar la rueda? Hay una receta sencilla: <b>se invierten todos los bits del número positivo y se suma 1</b>. En el nivel 2 demostraremos por qué funciona. Por ahora, compruébalo:' },
            { type: 'widget', id: 'twos-complement', options: { bits: 8, value: 5 }, caption: 'Elige un número entre −128 y 127. El simulador lo niega paso a paso y comprueba el resultado. Prueba también con 0 y con −128: uno de los dos es un caso especial.' },
            { type: 'callout', kind: 'note', status: 'establecido', title: 'Idea clave', text: 'Un patrón de bits no lleva etiqueta de signo. <code>11111011</code> es 251 si lo leemos sin signo y −5 si lo leemos en complemento a dos. Es la misma lección de la 1.1: el significado depende de la convención.' },
          ],
        },
        {
          id: 'desbordamiento',
          title: 'Cuando el resultado no cabe',
          blocks: [
            { type: 'p', text: 'En complemento a dos con 8 bits, el mayor número es 127 (<code>01111111</code>). ¿Qué ocurre al sumarle 1? El sumador hace su trabajo con los patrones y produce <code>10000000</code>, que en complemento a dos es −128. Una suma de dos positivos ha dado un negativo.' },
            { type: 'widget', id: 'binary-adder', options: { bits: 8, a: 127, b: 1, mode: 'signed' }, caption: 'Resuelve $127 + 1$ con 8 bits en complemento a dos. El veredicto final explica cómo detecta el hardware este desbordamiento.' },
            { type: 'p', text: 'Esto tiene consecuencias reales. Muchos sistemas cuentan el tiempo como el número de segundos transcurridos desde el 1 de enero de 1970 a las 00:00 UTC. Si ese contador es un entero de 32 bits con signo, su valor máximo es $2^{31} - 1 = 2\\,147\\,483\\,647$, que corresponde al <b>19 de enero de 2038 a las 03:14:07 UTC</b>. Un segundo después, el contador desborda y pasa a $-2^{31}$, que se interpreta como el 13 de diciembre de 1901. Es el llamado «problema del año 2038»; en el nivel 3 lo reproduciremos con Python.' },
            { type: 'callout', kind: 'warning', title: 'Depende del lenguaje', text: 'Los enteros de Python tienen precisión ilimitada [@python-stdtypes]: crecen lo que haga falta y nunca desbordan. Pero los enteros de C, C++, Java, Rust o los arreglos de NumPy tienen ancho fijo. En C y C++, el desbordamiento de enteros con signo es además «comportamiento indefinido» [@cppreference-arith]: el estándar no garantiza que dé la vuelta, y el compilador puede suponer que nunca ocurre. Saber qué tipo de entero usa tu programa no es un detalle.' },
          ],
        },
        {
          id: 'fracciones',
          title: 'Números con decimales en binario',
          blocks: [
            { type: 'p', text: 'En decimal, las cifras a la derecha de la coma valen décimas, centésimas, milésimas: potencias negativas de 10. En binario, las cifras a la derecha de la coma valen mitades, cuartos, octavos: potencias negativas de 2. Así, $0{,}101_2 = \\tfrac{1}{2} + \\tfrac{1}{8} = 0{,}625$.' },
            { type: 'p', text: 'Ahora viene una sorpresa. En decimal sabemos que $\\tfrac{1}{3} = 0{,}333\\ldots$ no se puede escribir con un número finito de cifras. En binario ocurre algo parecido con números que en decimal parecen inofensivos, como 0,1. Compruébalo:' },
            { type: 'widget', id: 'fraction-binary', options: { value: '0.1' }, caption: 'El método de las multiplicaciones sucesivas: se multiplica por 2, la parte entera es la siguiente cifra binaria y se continúa con la parte fraccionaria. El simulador usa aritmética exacta, así que detecta con certeza cuándo un resto se repite. Prueba 0,625, 0,1, 0,2 y 0,3.' },
            { type: 'p', text: 'El número 0,1 en binario es $0{,}0\\overline{0011}_2$: el bloque <code>0011</code> se repite para siempre. Con un número finito de bits <em>no se puede</em> guardar exactamente 0,1; solo una aproximación. Esto no es un defecto de una computadora concreta, sino una propiedad matemática de la base 2.' },
            { type: 'callout', kind: 'note', title: 'Práctica de ingeniería', text: 'Por esta razón, el software financiero no suele guardar importes de dinero como números con decimales binarios. Los guarda como enteros en la unidad mínima (céntimos) o usa tipos decimales específicos, como <code>decimal.Decimal</code> en Python.' },
          ],
        },
        {
          id: 'punto-flotante',
          title: 'Punto flotante: la notación científica de la computadora',
          blocks: [
            { type: 'p', text: 'Los científicos escriben números muy grandes o muy pequeños en notación científica: $6{,}022 \\times 10^{23}$, $1{,}6 \\times 10^{-19}$. Así se separa la <em>precisión</em> (las cifras significativas, 6,022) de la <em>escala</em> (el exponente, 23). Con pocas cifras se cubre un rango enorme.' },
            { type: 'p', text: 'Las computadoras usan la misma idea en base 2. El estándar IEEE 754 [@ieee754] define formatos de [[punto-flotante|punto flotante]] con tres campos:' },
            { type: 'list', items: [
              '<b>Signo</b> (1 bit): 0 positivo, 1 negativo. Aquí sí se usa signo y magnitud.',
              '<b>Exponente</b>: la escala, la potencia de 2 por la que se multiplica.',
              '<b>Fracción</b>: las cifras significativas en binario.',
            ] },
            { type: 'p', text: 'Los dos formatos más usados son <b>binary32</b> (32 bits, el <code>float</code> de muchos lenguajes) y <b>binary64</b> (64 bits, el <code>double</code>; también el <code>float</code> de Python y el <code>Number</code> de JavaScript) [@python-floating-point]. Explóralos:' },
            { type: 'widget', id: 'float-explorer', options: { format: 'binary32', value: '0.1' }, caption: 'Escribe un número o pulsa cualquier bit para cambiarlo. «Valor exacto almacenado» es el número que realmente queda guardado, calculado con aritmética exacta. Prueba 0,1 en binary32 y en binary64; prueba 16777217 en binary32; y cambia los bits del exponente para ver cómo el número salta de escala.' },
            { type: 'p', text: 'Fíjate en tres cosas. Primero, 0,1 se guarda como un número <em>muy cercano</em> a 0,1, pero no igual: en binary32, 0,100000001490116…. Segundo, el formato tiene un número limitado de valores. Entre dos valores representables consecutivos hay un hueco, y todo lo que cae en él se redondea al más cercano. Tercero, ese hueco crece con el tamaño del número: por eso 16 777 217 no cabe en binary32 y se guarda como 16 777 216.' },
            { type: 'p', text: 'La consecuencia más famosa: en Python, <code>0.1 + 0.2</code> da <code>0.30000000000000004</code>. Cada sumando ya llevaba un pequeño [[error-de-redondeo|error de redondeo]], y el resultado se redondea otra vez. El error es diminuto, pero suficiente para que <code>0.1 + 0.2 == 0.3</code> sea falso.' },
            { type: 'callout', kind: 'misconception', title: 'El error de redondeo no es aleatorio', text: 'A menudo se dice que los números de punto flotante son «imprecisos» como si fallaran al azar. No es así. El estándar IEEE 754 especifica exactamente cómo se redondea cada operación, y el mismo cálculo da siempre el mismo resultado. El error es determinista y acotado; lo que hay que hacer es tenerlo en cuenta [@goldberg1991].' },
          ],
        },
        {
          id: 'puente-cuantico',
          title: 'Avance: por qué esto importará en computación cuántica',
          blocks: [
            { type: 'p', text: 'Todo esto no es solo cultura general clásica. Más adelante simularemos pequeñas computadoras cuánticas en una computadora normal, y una de las primeras sorpresas será cuánta memoria hace falta: cada [[qubit|qubit]] que se añade <b>duplica</b> la cantidad de números que hay que guardar. Esa duplicación es la misma de esta lección: $n$ bits dan $2^n$ combinaciones.' },
            { type: 'table', head: ['Qubits simulados', 'Números que guardar ($2^n$)', 'Memoria (16 bytes cada uno)'], rows: [
              ['10', '1 024', '16 KiB'],
              ['20', '≈ 10⁶', '16 MiB'],
              ['30', '≈ 10⁹', '16 GiB'],
              ['40', '≈ 10¹²', '16 TiB'],
              ['50', '≈ 10¹⁵', '16 PiB'],
            ], caption: 'Es aritmética directa: $2^n \\times 16$ bytes. Por qué hacen falta esos números se explica en los módulos 2 y 3.' },
            { type: 'callout', kind: 'preview', title: 'Lo que retomaremos', text: 'Esos números son de punto flotante, así que los resultados de un simulador tendrán pequeños errores de redondeo, y las pruebas deberán comparar con tolerancia, nunca con <code>==</code>. Lo verás en el nivel 3 con un número que aparecerá a menudo: $1/\\sqrt{2}$.' },
          ],
        },
      ],
    },

    // =====================================================================
    matematico: {
      intro: 'Aquí ponemos números a las ideas del nivel 1. Cada sección empieza con la idea en pocas palabras y un ejemplo; las demostraciones están en «Para profundizar», por si te interesan. Basta con aritmética.',
      sections: [
        {
          id: 'rango',
          title: 'Rango de los enteros de n bits', key: 'Con n bits sin signo se cuenta de 0 a 2ⁿ − 1: con 8 bits, de 0 a 255.',
          blocks: [
            { deep: true, type: 'p', text: 'El mayor entero sin signo de $n$ bits es el patrón con todos los bits a 1. Su valor es una suma geométrica:' },
            { deep: true, type: 'steps', items: [
              { text: 'Todos los bits valen 1:', tex: 'N_{\\max} = \\sum_{i=0}^{n-1} 2^i = 1 + 2 + 4 + \\cdots + 2^{n-1}' },
              { text: 'Multiplicamos por 2, lo que desplaza cada término una posición:', tex: '2N_{\\max} = 2 + 4 + \\cdots + 2^{n-1} + 2^{n}' },
              { text: 'Restamos ambas expresiones; todos los términos intermedios se cancelan:', tex: '2N_{\\max} - N_{\\max} = 2^n - 1' },
              { text: 'Por tanto, el rango sin signo es:', tex: '0 \\le N \\le 2^n - 1' },
            ] },
            { type: 'p', text: 'Ejemplo: con $n = 8$, el máximo es $2^8 - 1 = 255$, es decir, <code>11111111</code>. Una forma rápida de verlo: $11111111_2 + 1 = 100000000_2 = 2^8$.' },
          ],
        },
        {
          id: 'aritmetica-modular',
          title: 'Suma binaria y aritmética módulo 2ⁿ', key: 'Se suma como en la escuela, columna a columna. Si el resultado no cabe, se pierde el último acarreo y el número «da la vuelta», como un reloj.',
          blocks: [
            { deep: true, type: 'p', text: 'Sean $a_i$ y $b_i$ los bits de la columna $i$ y $c_i$ el acarreo que entra en ella (con $c_0 = 0$). El bit del resultado y el acarreo siguiente son:' },
            { deep: true, type: 'math', tex: 's_i = (a_i + b_i + c_i) \\bmod 2, \\qquad c_{i+1} = \\left\\lfloor \\frac{a_i + b_i + c_i}{2} \\right\\rfloor', note: '$x \\bmod 2$ es el resto de dividir entre 2; $\\lfloor x \\rfloor$ es la parte entera por abajo.' },
            { type: 'p', text: 'Calculemos $6 + 7$ con 4 bits, $0110_2 + 0111_2$:' },
            { type: 'table', head: ['Columna (peso)', '8', '4', '2', '1'], mono: [1, 2, 3, 4], rows: [
              ['Acarreo que llega', '1', '1', '0', '0'],
              ['A = 6', '0', '1', '1', '0'],
              ['B = 7', '0', '1', '1', '1'],
              ['Suma de la columna', '1', '3', '2', '1'],
              ['Se escribe', '<b>1</b>', '<b>1</b>', '<b>0</b>', '<b>1</b>'],
            ], caption: 'Se lee de derecha a izquierda. El acarreo de cada columna se calcula con la columna anterior. Resultado: $1101_2 = 13$, sin acarreo final.' },
            { deep: true, type: 'p', text: 'Como solo se conservan $n$ bits, el resultado almacenado es la suma <em>módulo $2^n$</em>, el resto de dividir entre $2^n$:' },
            { deep: true, type: 'math', tex: '\\text{resultado} = (A + B) \\bmod 2^n' },
            { type: 'p', text: 'Ejemplo con desbordamiento: $12 + 5 = 17$, y $17 \\bmod 16 = 1$. El acarreo final es exactamente el «16» que se pierde. Esta aritmética se llama <em>aritmética modular</em>, y es la de un reloj: 10 horas después de las 9 son las 7, porque $19 \\bmod 12 = 7$. La reencontraremos en el algoritmo de Shor.' },
          ],
        },
        {
          id: 'complemento-definicion',
          title: 'Complemento a dos: definición y rango', key: 'En complemento a dos, el primer bit resta en lugar de sumar: con 8 bits vale −128. Así, 11111011 = −128 + 123 = −5.',
          blocks: [
            { deep: true, type: 'p', text: 'En complemento a dos, el bit más significativo tiene peso <em>negativo</em>. Todo lo demás es igual que en la notación posicional sin signo:' },
            { deep: true, type: 'math', tex: 'N = -b_{n-1}\\, 2^{n-1} + \\sum_{i=0}^{n-2} b_i\\, 2^i', note: 'Si $b_{n-1} = 0$, el número coincide con su lectura sin signo. Si $b_{n-1} = 1$, se resta $2^{n-1}$ y el resultado es negativo.' },
            { type: 'p', text: 'Ejemplo con $n = 8$: $11111011_2$.' },
            { type: 'math', tex: '11111011_2 = -128 + 64 + 32 + 16 + 8 + 0 + 2 + 1 = -128 + 123 = -5' },
            { type: 'p', text: 'Con 8 bits, el rango va de −128 (<code>10000000</code>) a 127 (<code>01111111</code>). Hay un negativo más que positivos, porque el cero ocupa uno de los patrones que empiezan por 0.' },
            { deep: true, type: 'p', text: 'En general, con $n$ bits, el menor valor tiene solo el bit de signo a 1, $-2^{n-1}$, y el mayor tiene todos los demás a 1, $2^{n-1} - 1$:' },
            { deep: true, type: 'math', tex: '-2^{n-1} \\le N \\le 2^{n-1} - 1' },
            { deep: true, type: 'p', text: 'Hay otra forma equivalente de verlo que conecta con la rueda. Un patrón con $b_{n-1} = 1$ tiene valor sin signo $U$ y valor con signo $U - 2^n$. Ambos coinciden módulo $2^n$, y por eso el mismo sumador sirve para las dos interpretaciones.' },
            { deep: true, type: 'math', tex: 'N_{\\text{con signo}} = \\begin{cases} U & \\text{si } U < 2^{n-1} \\\\ U - 2^n & \\text{si } U \\ge 2^{n-1} \\end{cases}' },
          ],
        },
        {
          id: 'negacion',
          title: 'Por qué «invertir y sumar 1» niega un número', key: 'Para cambiar el signo de un número: invierte todos sus bits y suma 1.',
          blocks: [
            { deep: true, type: 'p', text: 'Llamemos $\\bar{x}$ al patrón $x$ con todos sus bits invertidos. Demostremos que $\\bar{x} + 1$ representa $-x$:' },
            { deep: true, type: 'steps', items: [
              { text: 'En cada posición, exactamente uno de los dos bits ($x_i$ o $\\bar{x}_i$) es 1, así que su suma no produce acarreos y da todo unos:', tex: 'x + \\bar{x} = \\underbrace{11\\cdots1}_{n} = 2^n - 1' },
              { text: 'Despejamos y sumamos 1 a ambos lados:', tex: '\\bar{x} + 1 = 2^n - x' },
              { text: 'Trabajando módulo $2^n$, sumar $2^n$ no cambia nada (es una vuelta completa a la rueda):', tex: '2^n - x \\equiv -x \\pmod{2^n}' },
              { text: 'Por tanto, $\\bar{x} + 1$ es el patrón que representa $-x$. ∎' },
            ] },
            { type: 'p', text: 'Ejemplo: negar 5 con 8 bits.' },
            { type: 'steps', items: [
              { text: 'Patrón de 5:', tex: '00000101' },
              { text: 'Invertimos:', tex: '11111010' },
              { text: 'Sumamos 1:', tex: '11111010 + 1 = 11111011' },
              { text: 'Comprobamos con la definición:', tex: '-128 + 64 + 32 + 16 + 8 + 2 + 1 = -5 \\;\\checkmark' },
            ] },
            { type: 'callout', kind: 'warning', title: 'El caso de −128', text: 'Si negamos $-128 = 10000000_2$, invertimos ($01111111$) y sumamos 1, obtenemos $10000000$ otra vez. El resultado matemático, $+128$, no cabe en 8 bits con signo. Es consecuencia directa de la asimetría del rango, y una fuente clásica de errores: calcular el valor absoluto (o el opuesto) del mínimo entero desborda. En C y C++ es comportamiento indefinido [@cppreference-arith].' },
          ],
        },
        {
          id: 'desbordamiento-signo',
          title: 'Detectar el desbordamiento con signo', key: 'Con signo, hay desbordamiento cuando dos números del mismo signo dan un resultado de signo contrario: 127 + 1 = −128.',
          blocks: [
            { type: 'p', text: 'Sin signo, el desbordamiento se reconoce por el acarreo final: $c_n = 1$. Con signo, el acarreo final no indica nada por sí solo (en $-5 + 6$ hay acarreo final y el resultado, 1, es correcto). La regla es otra [@bryant2016, §2.3]:' },
            { type: 'callout', kind: 'note', status: 'establecido', title: 'Regla del desbordamiento en complemento a dos', text: 'Hay desbordamiento si y solo si los dos sumandos tienen el mismo signo y el resultado tiene el signo contrario. Equivalentemente, si el acarreo que <em>entra</em> en el bit de signo ($c_{n-1}$) es distinto del que <em>sale</em> ($c_n$).' },
            { type: 'p', text: 'Sumar dos números de signo distinto nunca desborda: el resultado está entre ambos y, por tanto, dentro del rango. Ejemplo de desbordamiento: $127 + 1$ con 8 bits.' },
            { type: 'math', tex: '\\underbrace{01111111}_{127} + \\underbrace{00000001}_{1} = \\underbrace{10000000}_{-128}, \\qquad c_7 = 1 \\ne c_8 = 0' },
          ],
        },
        {
          id: 'fracciones-formal',
          title: 'Fracciones binarias: cuándo son finitas', key: 'Una fracción tiene un número finito de cifras binarias solo si su denominador (simplificado) es una potencia de 2: ½, ¼, ⅛… Por eso 0,1 = 1/10 no se puede guardar exactamente.',
          blocks: [
            { type: 'p', text: 'Una fracción binaria $0{,}d_1 d_2 d_3 \\ldots$ vale $\\sum_{k \\ge 1} d_k\\, 2^{-k}$. Para convertir $x \\in [0, 1)$ se multiplica por 2: la parte entera de $2x$ es $d_1$, y se repite con la parte fraccionaria. Ejemplo con 0,625:' },
            { type: 'table', head: ['Paso', 'Cálculo', 'Cifra', 'Resto'], mono: [2], rows: [
              ['1', '$2 \\times 0{,}625 = 1{,}25$', '1', '$0{,}25$'],
              ['2', '$2 \\times 0{,}25 = 0{,}5$', '0', '$0{,}5$'],
              ['3', '$2 \\times 0{,}5 = 1{,}0$', '1', '$0$'],
            ], caption: 'El proceso termina al llegar a resto 0: $0{,}625 = 0{,}101_2$. Comprobación: $\\tfrac12 + \\tfrac18 = 0{,}625$.' },
            { type: 'p', text: '¿Cuándo termina el proceso? Si $x = p/q$ es una fracción irreducible, se cumple un criterio sencillo:' },
            { type: 'callout', kind: 'note', status: 'establecido', title: 'Criterio', text: '$p/q$ (irreducible) tiene una expansión binaria finita si y solo si $q$ es una potencia de 2.' },
            { deep: true, type: 'steps', items: [
              { text: 'Si la expansión tiene $m$ cifras, entonces $x = \\sum_{k=1}^{m} d_k 2^{-k}$, y multiplicando por $2^m$ se obtiene un entero:', tex: 'x = \\frac{\\text{entero}}{2^m}' },
              { text: 'Al simplificar esa fracción, el denominador solo puede contener el factor primo 2. Recíprocamente, $p/2^m$ se escribe con $m$ cifras binarias.' },
              { text: 'Para 0,1:', tex: '0{,}1 = \\frac{1}{10} = \\frac{1}{2 \\cdot 5}' },
              { text: 'El factor 5 impide que la expansión termine. Como solo hay finitos restos posibles (menores que $q$), alguno se repite y la expansión es periódica:', tex: '0{,}1 = 0{,}0\\overline{0011}_2' },
            ] },
            { deep: true, type: 'p', text: 'El mismo criterio en base 10 dice que $p/q$ es finito si $q$ solo tiene los factores 2 y 5. Por eso $\\tfrac{1}{3}$ es infinito en decimal, mientras que $\\tfrac{1}{10}$ es finito en decimal pero infinito en binario.' },
          ],
        },
        {
          id: 'ieee754',
          title: 'IEEE 754: formato, valor y casos especiales', key: 'Un número de punto flotante guarda signo, exponente y cifras significativas, como la notación científica pero en base 2. Como las cifras son limitadas (23 en float, 52 en double), muchos números se redondean.',
          blocks: [
            { type: 'p', text: 'Un número normal de IEEE 754 con bit de signo $s$, exponente almacenado $E$ y fracción $f$ (las cifras tras la coma) vale [@ieee754; @goldberg1991]:' },
            { type: 'math', tex: 'x = (-1)^{s} \\times 1{,}f_2 \\times 2^{E - \\text{sesgo}}', note: 'El «1,» inicial no se almacena, porque en un número normalizado siempre vale 1: es un bit gratis de precisión. El <em>sesgo</em> permite guardar exponentes negativos como enteros sin signo.' },
            { type: 'table', head: ['Formato', 'Signo', 'Exponente', 'Fracción', 'Sesgo', 'Precisión', 'Máximo aprox.'], rows: [
              ['binary32', '1', '8', '23', '127', '24 bits ≈ 7 cifras decimales', '$3{,}4 \\times 10^{38}$'],
              ['binary64', '1', '11', '52', '1023', '53 bits ≈ 16 cifras decimales', '$1{,}8 \\times 10^{308}$'],
            ] },
            { deep: true, type: 'h', text: 'Ejemplo 1: codificar −2,5 en binary32' },
            { deep: true, type: 'steps', items: [
              { text: 'Signo negativo:', tex: 's = 1' },
              { text: 'Pasamos 2,5 a binario y normalizamos (coma tras el primer 1):', tex: '2{,}5 = 10{,}1_2 = 1{,}01_2 \\times 2^{1}' },
              { text: 'Exponente almacenado:', tex: 'E = 1 + 127 = 128 = 10000000_2' },
              { text: 'Fracción (lo que va tras «1,», completado con ceros hasta 23 bits):', tex: 'f = 0100\\,0000\\,0000\\,0000\\,0000\\,000' },
              { text: 'Juntamos los campos y agrupamos de 4 en 4 para el hexadecimal:', tex: '1\\,10000000\\,0100\\ldots0 = \\texttt{C0200000}_{16}' },
            ] },
            { deep: true, type: 'h', text: 'Ejemplo 2: por qué 0,1 no se guarda exactamente' },
            { deep: true, type: 'steps', items: [
              { text: 'Expansión binaria (sección anterior) y normalización:', tex: '0{,}1 = 0{,}0\\overline{0011}_2 = 1{,}\\overline{1001}_2 \\times 2^{-4}' },
              { text: 'Exponente almacenado:', tex: 'E = -4 + 127 = 123 = 01111011_2' },
              { text: 'Solo caben 23 bits de fracción. Los siguientes bits son «1100…», más de la mitad de una unidad en la última posición, así que se redondea hacia arriba:', tex: '\\underbrace{10011001100110011001100}_{23 \\text{ bits}}\\,|\\,1100\\ldots \\;\\to\\; 10011001100110011001101' },
              { text: 'Patrón resultante:', tex: '0\\,01111011\\,10011001100110011001101 = \\texttt{3DCCCCCD}_{16}' },
              { text: 'Valor exacto almacenado (ligeramente mayor que 0,1, por haber redondeado hacia arriba):', tex: '0{,}100000001490116119384765625' },
            ] },
            { deep: true, type: 'h', text: 'Valores especiales' },
            { deep: true, type: 'table', head: ['Exponente almacenado', 'Fracción', 'Significado'], rows: [
              ['todo ceros', '0', '$\\pm 0$'],
              ['todo ceros', '≠ 0', 'Subnormal: $(-1)^s \\times 0{,}f \\times 2^{1-\\text{sesgo}}$'],
              ['ni todo ceros ni todo unos', 'cualquiera', 'Normal: $(-1)^s \\times 1{,}f \\times 2^{E-\\text{sesgo}}$'],
              ['todo unos', '0', '$\\pm\\infty$'],
              ['todo unos', '≠ 0', 'NaN («Not a Number»)'],
            ], caption: 'Los subnormales rellenan el hueco entre 0 y el menor número normal; el menor subnormal positivo de binary32 es $2^{-149} \\approx 1{,}4 \\times 10^{-45}$. Puedes verlos con el explorador.' },
          ],
        },
        {
          id: 'precision',
          title: 'Precisión, unidad de redondeo y comparación con tolerancia', key: 'Un float acierta unas 7 cifras y un double unas 16. Por eso los decimales se comparan con tolerancia (math.isclose), nunca con ==.',
          blocks: [
            { deep: true, type: 'p', text: 'Con redondeo al más cercano, el valor almacenado de un real $x$ (dentro del rango normal) cumple [@higham2002]:' },
            { deep: true, type: 'math', tex: '\\mathrm{fl}(x) = x\\,(1 + \\delta), \\qquad |\\delta| \\le u = 2^{-p}', note: '$p$ es la precisión en bits: $u = 2^{-24} \\approx 6 \\times 10^{-8}$ en binary32 y $u = 2^{-53} \\approx 1{,}1 \\times 10^{-16}$ en binary64. $u$ se llama <em>unidad de redondeo</em>.' },
            { deep: true, type: 'p', text: 'Es decir, el error <em>relativo</em> está acotado, pero el absoluto crece con el tamaño del número. Dos consecuencias importantes:' },
            { type: 'list', items: [
              'Los enteros son exactos solo hasta $2^{p}$: $2^{24} = 16\\,777\\,216$ en binary32 y $2^{53} = 9\\,007\\,199\\,254\\,740\\,992$ en binary64. Por encima, el hueco entre valores consecutivos es mayor que 1.',
              'Cada operación introduce un nuevo error de hasta $u$, y los errores se acumulan. Por eso dos cálculos matemáticamente equivalentes pueden dar resultados que difieren en las últimas cifras.',
            ] },
            { type: 'p', text: 'La consecuencia práctica es que dos números de punto flotante no se comparan con <code>==</code>, sino con una tolerancia. La forma habitual combina una tolerancia relativa y una absoluta:' },
            { type: 'math', tex: '|a - b| \\le \\max\\big(\\varepsilon_{\\text{rel}} \\cdot \\max(|a|, |b|),\\; \\varepsilon_{\\text{abs}}\\big)', note: 'Es la fórmula que usa <code>math.isclose</code> de Python, con $\\varepsilon_{\\text{rel}} = 10^{-9}$ y $\\varepsilon_{\\text{abs}} = 0$ por defecto [@python-math]. Cerca de cero hay que indicar una tolerancia absoluta, porque la relativa se vuelve demasiado estricta.' },
          ],
        },
      ],
    },

    // =====================================================================
    implementar: {
      intro: 'Comprobamos todo lo anterior con Python estándar (3.8 o superior). Recuerda que los <code>int</code> de Python no tienen ancho fijo, así que para imitar el hardware aplicaremos máscaras de bits. Las salidas se obtuvieron ejecutando cada programa.',
      sections: [
        {
          id: 'python-enteros',
          title: 'Enteros de Python frente a enteros de ancho fijo',
          blocks: [
            { type: 'code', lang: 'python', file: 'ancho_fijo.py', code: `print(2**100)
print(255 + 1)


def suma_8_bits(a, b):
    return (a + b) % 256  # un registro de 8 bits solo guarda el resto módulo 2^8


def con_signo(patron):
    return patron - 256 if patron >= 128 else patron  # complemento a dos de 8 bits


r = suma_8_bits(255, 1)
print(r)
r = suma_8_bits(127, 1)
print(r, format(r, "08b"), con_signo(r))`,
            output: `1267650600228229401496703205376
256
0
128 10000000 -128` },
            { type: 'list', items: [
              '<b>Líneas 1–2:</b> Python calcula $2^{100}$ exacto y $255 + 1 = 256$ sin desbordar: sus enteros crecen lo necesario.',
              '<b><code>suma_8_bits</code>:</b> <code>% 256</code> calcula $(a + b) \\bmod 2^8$, que es lo que hace un registro de 8 bits. En código real verás a menudo la forma equivalente <code>&amp; 0xFF</code> (una «máscara» de 8 unos).',
              '<b><code>con_signo</code>:</b> implementa la fórmula del nivel 2 para 8 bits: los patrones de 128 en adelante (bit de signo a 1) representan el valor menos 256.',
              '<b>Resultado:</b> $255 + 1 = 0$ sin signo y $127 + 1 = -128$ con signo, como en la rueda y el sumador.',
            ] },
          ],
        },
        {
          id: 'python-bytes-signo',
          title: 'Complemento a dos con to_bytes y from_bytes',
          blocks: [
            { type: 'p', text: 'Python puede convertir enteros en bytes de ancho fijo y viceversa, indicando si se usa signo. Lo hace en complemento a dos.' },
            { type: 'code', lang: 'python', file: 'complemento_a_dos.py', code: `datos = (-5).to_bytes(1, "big", signed=True)
print(datos, format(datos[0], "08b"))
print(int.from_bytes(datos, "big", signed=True))
print(int.from_bytes(datos, "big", signed=False))
try:
    (128).to_bytes(1, "big", signed=True)
except OverflowError as e:
    print("OverflowError:", e)`,
            output: `b'\\xfb' 11111011
-5
251
OverflowError: int too big to convert` },
            { type: 'list', items: [
              '<b>Línea 1:</b> −5 en 1 byte con signo. <code>"big"</code> indica el orden de los bytes (el más significativo primero), que importa cuando hay más de uno.',
              '<b>Líneas 3–4:</b> el <em>mismo</em> byte <code>0xFB</code> es −5 con signo y 251 sin signo. Es la idea clave del nivel 1, ahora en código.',
              '<b>Líneas 5–8:</b> 128 no cabe en 8 bits con signo (máximo 127). Python, a diferencia del hardware, avisa con una excepción en lugar de dar la vuelta.',
            ] },
          ],
        },
        {
          id: 'python-2038',
          title: 'Reproducir el problema del año 2038',
          blocks: [
            { type: 'code', lang: 'python', file: 'año_2038.py', code: `from datetime import datetime, timedelta, timezone

EPOCA = datetime(1970, 1, 1, tzinfo=timezone.utc)


def a_int32(x):
    x = x % 2**32  # se queda con 32 bits
    return x - 2**32 if x >= 2**31 else x  # y los lee en complemento a dos


maximo = 2**31 - 1
print(maximo, EPOCA + timedelta(seconds=maximo))
siguiente = a_int32(maximo + 1)
print(siguiente, EPOCA + timedelta(seconds=siguiente))`,
            output: `2147483647 2038-01-19 03:14:07+00:00
-2147483648 1901-12-13 20:45:52+00:00` },
            { type: 'list', items: [
              '<b><code>a_int32</code>:</b> imita un entero de 32 bits con signo: se queda con 32 bits y los interpreta en complemento a dos.',
              '<b>Resultado:</b> un segundo después del máximo, el contador salta a $-2^{31}$, y la fecha retrocede más de 136 años.',
              'Se usa <code>EPOCA + timedelta</code> en lugar de <code>datetime.fromtimestamp</code> porque esta última depende del sistema operativo con valores negativos.',
            ] },
          ],
        },
        {
          id: 'python-float',
          title: 'Inspeccionar números de punto flotante',
          blocks: [
            { type: 'code', lang: 'python', file: 'punto_flotante.py', code: `import math
import struct
from decimal import Decimal

print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
print(math.isclose(0.1 + 0.2, 0.3))
print(Decimal(0.1))
print(struct.pack(">d", 0.1).hex())
print(struct.pack(">f", 0.1).hex())
print(2.0**53 + 1 == 2.0**53)`,
            output: `0.30000000000000004
False
True
0.1000000000000000055511151231257827021181583404541015625
3fb999999999999a
3dcccccd
True` },
            { type: 'list', items: [
              '<b>Líneas 5–7:</b> la suma no da exactamente 0,3, pero <code>math.isclose</code> confirma que la diferencia está dentro de la tolerancia relativa por defecto ($10^{-9}$).',
              '<b>Línea 8:</b> <code>Decimal(0.1)</code> muestra el valor <em>exacto</em> del binary64 más cercano a 0,1, el mismo que calcula el explorador del nivel 1 [@python-floating-point].',
              '<b>Líneas 9–10:</b> <code>struct.pack</code> devuelve los bytes reales: <code>">d"</code> es binary64 y <code>">f"</code> binary32. <code>3dcccccd</code> es el patrón que obtuvimos a mano en el nivel 2.',
              '<b>Línea 11:</b> por encima de $2^{53}$, sumar 1 no cambia un binary64: el hueco entre valores consecutivos ya es 2.',
            ] },
          ],
        },
        {
          id: 'python-tolerancia',
          title: 'Comparar con tolerancia',
          blocks: [
            { type: 'p', text: 'El número $1/\\sqrt{2}$ aparecerá a menudo en computación cuántica: al elevarlo al cuadrado da una probabilidad de $1/2$, y dos mitades suman exactamente 1. Matemáticamente, claro. Veamos qué calcula la computadora:' },
            { type: 'code', lang: 'python', file: 'tolerancia.py', code: `import math

x = 1 / math.sqrt(2)
mitad = x**2
print(mitad)
print(mitad + mitad)
print(mitad + mitad == 1.0)
print(math.isclose(mitad + mitad, 1.0, rel_tol=1e-9))`,
            output: `0.4999999999999999
0.9999999999999998
False
True` },
            { type: 'p', text: '$\\sqrt{2}$ es irracional y no se puede representar exactamente, así que $1/\\sqrt{2}$ ya lleva un error de redondeo. Al elevarlo al cuadrado sale $0{,}4999999999999999$, y las dos mitades suman $0{,}9999999999999998$. Una prueba automática escrita como <code>assert total == 1.0</code> fallaría aunque el programa sea correcto. Escrita con <code>math.isclose</code>, pasa.' },
            { type: 'callout', kind: 'preview', title: 'Más adelante', text: 'Con programas cuánticos habrá una dificultad más: los resultados varían de una ejecución a otra, no solo por redondeo. Ahí la tolerancia dependerá de cuántas veces se repita el experimento.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Los enteros de una computadora no tienen límite».', reality: 'En el hardware, cada entero tiene un ancho fijo (8, 16, 32 o 64 bits) y un rango finito. Python oculta este límite con enteros de precisión ilimitada, pero C, Java, Rust o NumPy no.' },
    { myth: '«Un número negativo se guarda poniendo un 1 delante del positivo».', reality: 'Eso es signo y magnitud, que no se usa para enteros. En complemento a dos, −5 no es <code>10000101</code> sino <code>11111011</code>: se invierten los bits de 5 y se suma 1.' },
    { myth: '«Si la suma da un acarreo final, el resultado con signo es incorrecto».', reality: 'Con signo, el acarreo final se descarta sin más: $-5 + 6$ produce acarreo final y el resultado (1) es correcto. El desbordamiento con signo se detecta cuando el resultado tiene un signo distinto del de dos sumandos del mismo signo.' },
    { myth: '«0,1 se almacena exactamente; el problema es solo cómo se muestra».', reality: '0,1 tiene una expansión binaria infinita y lo que se almacena es otro número, muy cercano. Python muestra «0.1» porque es la representación decimal más corta que identifica ese valor, pero <code>Decimal(0.1)</code> revela el valor real.' },
    { myth: '«Los errores de punto flotante son aleatorios o fallos del hardware».', reality: 'Son deterministas: IEEE 754 especifica el resultado exacto de cada operación. El error está acotado por la unidad de redondeo y se puede analizar.' },
    { myth: '«Usar binary64 en lugar de binary32 elimina el problema».', reality: 'Reduce el error (de $\\approx 10^{-7}$ a $\\approx 10^{-16}$ relativo), pero no lo elimina: 0,1 tampoco es exacto en binary64. Las comparaciones deben seguir usando tolerancia.' },
  ],

  summary: [
    'El hardware trabaja con un ancho fijo de $n$ bits: $2^n$ patrones, rango $0 \\dots 2^n - 1$ sin signo.',
    'La suma binaria se hace columna a columna con acarreos; el resultado almacenado es $(A + B) \\bmod 2^n$. Si el resultado no cabe, hay desbordamiento.',
    'El complemento a dos da peso $-2^{n-1}$ al bit más significativo. Rango: $-2^{n-1} \\dots 2^{n-1} - 1$. Negar es invertir y sumar 1, y el mismo sumador sirve con y sin signo.',
    'El desbordamiento con signo se produce cuando dos sumandos del mismo signo dan un resultado de signo contrario.',
    'Una fracción irreducible $p/q$ tiene expansión binaria finita si y solo si $q$ es potencia de 2; 0,1 es periódico en binario.',
    'IEEE 754 representa reales como $(-1)^s \\times 1{,}f \\times 2^{E - \\text{sesgo}}$; binary32 (1+8+23) y binary64 (1+11+52).',
    'El error de redondeo es relativo y acotado por $u$ ($2^{-24}$ o $2^{-53}$); los números de punto flotante se comparan con tolerancia, nunca con <code>==</code>.',
  ],

  exercises: [
    { level: 'comprender', question: '¿Cuál es el rango de un entero de 16 bits sin signo? ¿Y en complemento a dos?', answer: 'Sin signo: de 0 a $2^{16} - 1 = 65\\,535$. Con signo: de $-2^{15} = -32\\,768$ a $2^{15} - 1 = 32\\,767$. Puedes comprobarlo con la tabla del nivel 1 o con la fórmula del nivel 2.' },
    { level: 'comprender', question: 'Con 4 bits, suma <code>1011</code> + <code>0110</code>. Interpreta el resultado sin signo y en complemento a dos. ¿Hay desbordamiento en cada caso? (Compruébalo después con el sumador.)', answer: 'El resultado de 5 bits sería <code>10001</code>; con 4 bits queda <code>0001</code>. <b>Sin signo:</b> $11 + 6 = 17$, que no cabe (máximo 15), así que hay desbordamiento y se obtiene 1. <b>Con signo:</b> <code>1011</code> es $-8 + 3 = -5$, así que $-5 + 6 = 1$, correcto y sin desbordamiento, aunque hubo acarreo final. El mismo cálculo de bits es correcto en una interpretación e incorrecto en la otra.' },
    { level: 'matematico', question: 'Escribe −20 en complemento a dos con 8 bits y compruébalo con los pesos.', answer: '$20 = 00010100_2$. Invertimos: $11101011$. Sumamos 1: $11101100$. Comprobación: $-128 + 64 + 32 + 8 + 4 = -20$. ✓' },
    { level: 'matematico', question: '¿Qué valor tiene <code>10000001</code> en complemento a dos? ¿Y su negación?', answer: '$-128 + 1 = -127$. Al negarlo, invertimos ($01111110$) y sumamos 1: $01111111 = 127$. ✓ (Solo $-128$ no tiene opuesto representable.)' },
    { level: 'matematico', question: 'Convierte 0,375 a binario por multiplicaciones sucesivas. ¿Es finita su expansión? Justifícalo con el criterio del denominador.', answer: '$2 \\times 0{,}375 = 0{,}75 \\to 0$; $2 \\times 0{,}75 = 1{,}5 \\to 1$; $2 \\times 0{,}5 = 1{,}0 \\to 1$. Resultado: $0{,}011_2$. Es finita porque $0{,}375 = 3/8$ y $8 = 2^3$.' },
    { level: 'matematico', question: '¿Cuáles de estos números se representan exactamente en binary64: 0,75; 0,2; 0,5; 0,3?', answer: '0,75 = 3/4 y 0,5 = 1/2 sí (denominadores potencia de 2). 0,2 = 1/5 y 0,3 = 3/10 no (su denominador tiene el factor 5). Puedes verificarlo con el explorador IEEE 754: el error de redondeo será cero solo en los dos primeros.' },
    { level: 'matematico', question: 'Obtén el patrón binary32 de 0,15625 y escríbelo en hexadecimal.', answer: '$0{,}15625 = 5/32 = 0{,}00101_2 = 1{,}01_2 \\times 2^{-3}$. $s = 0$; $E = -3 + 127 = 124 = 01111100_2$; $f = 0100\\ldots0$. Patrón: $0\\,01111100\\,0100\\ldots0 = \\texttt{3E200000}_{16}$.' },
    { level: 'implementar', question: 'Escribe una función <code>desborda_8_bits(a, b)</code> que, para dos enteros en $[-128, 127]$, indique si su suma desborda en complemento a dos de 8 bits, usando la regla de los signos. Pruébala con todas las parejas posibles.', answer: '<pre><code>def con_signo(p):\n    return p - 256 if p &gt;= 128 else p\n\ndef desborda_8_bits(a, b):\n    r = con_signo((a + b) % 256)\n    return (a &lt; 0) == (b &lt; 0) and (r &lt; 0) != (a &lt; 0)\n\nassert all(desborda_8_bits(a, b) == (not (-128 &lt;= a + b &lt;= 127))\n           for a in range(-128, 128) for b in range(-128, 128))</code></pre>La prueba final compara la regla con la definición (el resultado real está fuera de rango) para las 65 536 parejas.' },
  ],

  references: [
    { key: 'bryant2016', use: 'Representación de enteros con y sin signo, complemento a dos (§2.2), aritmética entera y desbordamiento (§2.3) y punto flotante (§2.4).' },
    { key: 'harris2013', use: 'Sistemas de numeración, suma binaria y sumadores.' },
    { key: 'patterson2021', use: 'Aritmética de computadora: enteros con signo y punto flotante en el procesador.' },
    { key: 'ieee754', use: 'Formatos binary32 y binary64, valores especiales y redondeo.' },
    { key: 'goldberg1991', use: 'Error de redondeo y carácter determinista de la aritmética IEEE 754.' },
    { key: 'higham2002', use: 'Modelo $\\mathrm{fl}(x) = x(1 + \\delta)$ con $|\\delta| \\le u$.' },
    { key: 'python-floating-point', use: 'Python usa binary64; valor exacto almacenado de 0.1.' },
    { key: 'python-stdtypes', use: 'Los enteros de Python tienen precisión ilimitada.' },
    { key: 'python-math', use: 'Definición de <code>math.isclose</code> y sus tolerancias por defecto.' },
    { key: 'cppreference-arith', use: 'El desbordamiento de enteros con signo es comportamiento indefinido en C y C++.' },
  ],

  related: ['representacion-informacion', 'texto-ascii-unicode', 'compuertas-logicas', 'numeros-complejos', 'shor-periodo', 'pruebas-cuanticas'],
  next: 'texto-ascii-unicode',
};
