// Lección 1.1 — ¿Cómo representa información una computadora clásica?
//
// Todas las salidas de código de esta lección se obtuvieron ejecutando los
// ejemplos con CPython 3.14 (2026-10-14). Los valores numéricos (códigos ASCII,
// bytes UTF-8, logaritmos) se comprobaron con el mismo intérprete.

export default {
  id: 'representacion-informacion',
  title: '¿Cómo representa información una computadora clásica?',
  lede: 'Antes de hablar de qubits necesitamos entender con precisión qué es un bit, de dónde sale y por qué los mismos bits pueden significar una letra, un número o un color. Esta lección construye esa base.',
  updated: '2026-10-14',

  context: {
    learn: 'Qué es la información, cómo se materializa físicamente en bits, cómo los bits se agrupan en bytes y cómo las codificaciones (binario, ASCII, Unicode/UTF-8, píxeles) les dan significado.',
    why: 'El qubit se define, en buena parte, por contraste con el bit. Si no sabemos exactamente qué propiedades tiene un bit, no podremos reconocer qué cambia —y qué no— al pasar a la computación cuántica.',
    previous: 'Es la primera lección del libro. Solo se asume experiencia programando en algún lenguaje.',
    next: 'Las siguientes lecciones del Módulo 1 profundizan en números, texto, lógica y arquitectura. En el Módulo 3 volveremos a las propiedades del bit que se resumen al final de esta lección para compararlas con las del qubit.',
  },

  objectives: [
    'Explicar qué significa «información» en el sentido técnico de Shannon y por qué no depende del significado.',
    'Describir un bit como una abstracción sobre un sistema físico con dos estados distinguibles.',
    'Calcular cuántos patrones distintos admiten $n$ bits y cuántos bits se necesitan para distinguir $N$ alternativas.',
    'Convertir números entre decimal, binario y hexadecimal, paso a paso.',
    'Explicar la diferencia entre carácter, punto de código y codificación (ASCII, Unicode, UTF-8).',
    'Representar texto e imágenes sencillas como secuencias de bytes, a mano y con Python.',
  ],

  prerequisites: {
    lessons: [],
    knowledge: [
      'Experiencia básica programando en cualquier lenguaje (variables, bucles, funciones).',
      'Aritmética con potencias: $2^3 = 8$, $10^2 = 100$.',
    ],
  },

  introduction: [
    { type: 'p', text: 'Cuando escribes «HOLA» en un teclado, en algún lugar de la computadora aparece algo que representa esa palabra. Pero dentro de la máquina no hay letras: hay transistores, condensadores, regiones magnetizadas, pulsos de luz. ¿Cómo se pasa de una cosa a la otra?' },
    { type: 'p', text: 'La respuesta tiene tres partes, y las recorreremos en orden. Primero veremos qué entendemos por <em>información</em>. Después veremos cómo un fenómeno físico se convierte en un <em>bit</em>, el símbolo con dos valores posibles. Finalmente veremos cómo, mediante convenciones llamadas <em>codificaciones</em>, los bits llegan a representar números, letras e imágenes.' },
    { type: 'p', text: 'Puede parecer un punto de partida lejano para un libro sobre computación cuántica, pero no lo es. Un qubit es también una abstracción sobre un sistema físico, también se manipula con operaciones y también se lee para obtener bits. Lo que cambia son las reglas. Para apreciar esas diferencias, primero hay que conocer bien las reglas clásicas.' },
    { type: 'callout', kind: 'note', title: 'Cómo leer esta lección', text: 'La lección tiene tres niveles. <b>Comprender</b> no usa más matemáticas que contar y sumar. <b>Entender matemáticamente</b> formaliza lo anterior con notación posicional, logaritmos y el esquema UTF-8. <b>Implementar</b> lo lleva a Python. Puedes leerlos en orden (recomendado) o elegir uno con el selector de nivel.' },
  ],

  levels: {
    // =====================================================================
    comprender: {
      intro: 'En este nivel construimos la intuición. Todo lo que aparece aquí se formaliza en el nivel 2.',
      sections: [
        {
          id: 'que-es-informacion',
          title: '¿Qué es la información?',
          blocks: [
            { type: 'p', text: 'Empecemos por una situación cotidiana. Alguien te dice que lanzó una moneda y tú no sabes el resultado. Hay dos posibilidades: cara o cruz. Cuando te dicen «cara», tu incertidumbre desaparece. Ese mensaje te dio información.' },
            { type: 'p', text: 'Ahora imagina que lanzaron un dado. Hay seis posibilidades. Cuando te dicen «cuatro», descartas cinco alternativas. Intuitivamente, ese mensaje te dio <em>más</em> información que el de la moneda, porque eliminó más incertidumbre.' },
            { type: 'p', text: 'Esta es la idea central que Claude Shannon formalizó en 1948: comunicar información consiste en seleccionar un mensaje entre un conjunto de mensajes posibles [@shannon1948]. Lo importante no es <em>qué significa</em> el mensaje, sino <em>cuántas alternativas</em> permite distinguir. Shannon lo dejó escrito de forma explícita: los aspectos semánticos —el significado— son irrelevantes para el problema técnico de transmitir el mensaje.' },
            { type: 'callout', kind: 'analogy', title: 'Analogía: el juego de las preguntas', text: 'Piensa en el juego de adivinar un objeto con preguntas de sí o no. Cada respuesta divide las posibilidades. Con una pregunta bien elegida distingues entre 2 opciones; con dos preguntas, entre 4; con tres, entre 8. La información se puede medir, de forma aproximada, por <em>cuántas preguntas de sí o no harían falta</em>. <br><b>Límite de la analogía:</b> en el juego las preguntas son secuenciales y adaptativas; la medida de Shannon es una propiedad del conjunto de alternativas y de sus probabilidades, no de una estrategia de preguntas concreta. Las dos ideas coinciden exactamente solo cuando las alternativas son igualmente probables y su número es una potencia de 2.' },
            { type: 'p', text: 'De aquí sale una consecuencia muy práctica para la ingeniería: si la información es elegir entre alternativas, entonces para almacenarla o transmitirla basta con un medio capaz de distinguir alternativas. Y el medio más sencillo posible distingue solo dos.' },
            { type: 'callout', kind: 'note', status: 'establecido', title: 'Idea clave', text: 'Información, en sentido técnico, es la capacidad de distinguir entre alternativas. El significado lo aportamos nosotros mediante convenciones.' },
          ],
        },
        {
          id: 'del-fenomeno-al-bit',
          title: 'Del fenómeno físico al bit',
          blocks: [
            { type: 'p', text: 'Una computadora es un objeto físico. Para guardar información necesita algo que pueda estar en estados distintos y que esos estados se puedan producir y reconocer de forma fiable. Algunos ejemplos reales:' },
            { type: 'list', items: [
              '<b>Voltaje</b> en un cable o en la salida de un transistor: «bajo» o «alto».',
              '<b>Carga eléctrica</b> atrapada en una celda de memoria flash: presente o ausente (en muchas memorias actuales, varios niveles por celda).',
              '<b>Magnetización</b> de una pequeña región de un disco duro: orientada en un sentido o en el otro.',
              '<b>Luz</b> en una fibra óptica: un pulso presente o ausente, o con una propiedad que cambia.',
            ] },
            { type: 'p', text: 'Todos estos fenómenos son, en realidad, <em>continuos</em>: un voltaje puede valer 0,3 V, 2,71 V o cualquier otro valor, y siempre hay ruido que lo hace fluctuar. Los ingenieros toman una decisión: dividir los valores posibles en dos rangos y darles nombre. Al rango bajo lo llamamos <b>0</b> y al alto, <b>1</b>. Entre ambos se deja una zona de separación que no debería usarse [@harris2013].' },
            { type: 'p', text: 'Eso es un [[bit|bit]] (de <i>binary digit</i>, dígito binario): no un objeto físico en sí, sino una <em>abstracción</em> que nos permite ignorar los detalles del voltaje exacto y pensar solo en «0 o 1». La siguiente simulación lo muestra.' },
            { type: 'widget', id: 'voltage-threshold', caption: '<b>Modelo simplificado.</b> Los niveles (0–5 V) y umbrales (1,5 V y 3,5 V) son ilustrativos; cada familia de circuitos define los suyos. El ruido se modela como una perturbación aleatoria aproximadamente gaussiana. Cada punto marca el instante en que el circuito «lee» la señal: verde si la lectura coincide con el bit enviado y rojo si no.' },
            { type: 'p', text: 'Observa qué ocurre al mover el control. Con poco ruido, todas las lecturas son correctas aunque la señal nunca valga exactamente 0,4 V o 4,6 V: la abstracción funciona porque los rangos están bien separados. Con mucho ruido, algunas lecturas caen en la zona prohibida o en el rango contrario y aparecen errores. La disciplina digital consiste, precisamente, en diseñar circuitos para que esto sea extraordinariamente improbable.' },
            { type: 'callout', kind: 'preview', title: 'Avance: esto volverá en el Módulo 3', text: 'Los qubits también son abstracciones sobre sistemas físicos (circuitos superconductores, iones, fotones…) y también sufren ruido. Pero, como veremos en la unidad «Del qubit ideal al qubit real», el ruido cuántico no se puede eliminar con un simple umbral, y la protección de la información cuántica requiere técnicas mucho más elaboradas. Es una diferencia de ingeniería importante, no un detalle.' },
          ],
        },
        {
          id: 'bits-y-patrones',
          title: 'Un bit, dos bits, ocho bits',
          blocks: [
            { type: 'p', text: 'Un único bit distingue dos alternativas. Es suficiente para «sí o no», «encendido o apagado», «cara o cruz». Pero para distinguir más alternativas necesitamos combinar bits.' },
            { type: 'p', text: 'Con dos bits tenemos cuatro combinaciones: 00, 01, 10 y 11. Con tres, ocho: 000, 001, 010, 011, 100, 101, 110 y 111. Cada bit añadido <em>duplica</em> el número de combinaciones, porque cada patrón anterior puede continuar con un 0 o con un 1.' },
            { type: 'widget', id: 'bit-explorer', options: { bits: 3 }, caption: 'Pulsa los bits para cambiarlos y usa «+1» para contar. Cambia la cantidad de bits y observa cómo el número de patrones se duplica. Debajo de cada bit aparece su <em>peso</em>, que explicaremos en el nivel 2.' },
            { type: 'table', head: ['Bits', 'Patrones distintos', 'Ejemplo de uso'], rows: [
              ['1', '2', 'Un interruptor: apagado / encendido'],
              ['2', '4', 'Los cuatro palos de la baraja francesa'],
              ['3', '8', 'Los siete días de la semana (y sobra uno)'],
              ['7', '128', 'Los caracteres del código ASCII'],
              ['8', '256', 'Un <b>byte</b>: los niveles de gris de una imagen'],
            ], caption: 'Cada bit adicional duplica el número de patrones.' },
            { type: 'p', text: 'Un grupo de 8 bits recibe un nombre propio: <b>[[byte|byte]]</b>. En las computadoras actuales, el byte es la unidad mínima que se puede direccionar en memoria: cada byte tiene su propia dirección, como cada casa tiene su número en una calle [@bryant2016].' },
            { type: 'callout', kind: 'preview', title: 'Avance: n bits y n qubits', text: 'En el Módulo 3 veremos que un sistema de $n$ qubits tiene $2^n$ <em>estados base</em>, una cuenta que se parece mucho a esta tabla. Conviene no adelantar conclusiones: que haya $2^n$ estados base no significa que $n$ qubits «almacenen» $2^n$ valores que se puedan leer. Ese matiz es una de las ideas centrales de la computación cuántica y lo estudiaremos con calma.' },
          ],
        },
        {
          id: 'codificacion',
          title: 'Los bits no significan nada por sí solos',
          blocks: [
            { type: 'p', text: 'Considera el byte <code>01000001</code>. ¿Qué representa? La pregunta no tiene respuesta hasta que sepamos <em>cómo</em> hay que leerlo. Si lo interpretamos como número entero, es 65. Si lo interpretamos como carácter en el código ASCII, es la letra «A». Si es el brillo de un píxel en escala de grises, es un gris bastante oscuro.' },
            { type: 'p', text: 'A la regla que asigna significado a los patrones de bits la llamamos [[codificacion|codificación]]. Una codificación es una <em>convención</em>: un acuerdo entre quien escribe los bits y quien los lee. La memoria de la computadora no guarda «letras» ni «números»; guarda patrones, y es el programa el que decide cómo interpretarlos. Bryant y O\'Hallaron lo resumen con una fórmula que conviene recordar: la información son bits más contexto [@bryant2016, §1.1].' },
            { type: 'widget', id: 'byte-interpretations', caption: 'El mismo byte, cinco lecturas distintas. Cambia los bits o prueba los ejemplos. Observa que el byte <code>11111111</code> es 255 como entero sin signo, −1 como entero con signo y no corresponde a ningún carácter ASCII.' },
            { type: 'figure', id: 'abstraction-layers', caption: '<b>Figura 1.</b> Capas de abstracción. Cada capa oculta los detalles de la inferior: quien programa trabaja con texto y números; quien diseña circuitos, con voltajes. Las codificaciones son el puente entre los patrones de bits y el significado.' },
            { type: 'callout', kind: 'warning', title: 'Consecuencia práctica', text: 'Muchos errores reales de software son errores de codificación: un archivo escrito con una convención y leído con otra. El texto «Año» guardado en UTF-8 y leído como si fuera Latin-1 aparece como «AÃ±o». Los bits son correctos; la interpretación no.' },
          ],
        },
        {
          id: 'texto',
          title: 'Del texto a los bits',
          blocks: [
            { type: 'p', text: 'Veamos ahora el caso más importante para nuestro ejemplo: el texto. El proceso tiene varias etapas, y es útil distinguirlas.' },
            { type: 'list', ordered: true, items: [
              '<b>Texto:</b> la secuencia que vemos, por ejemplo «HOLA».',
              '<b>Caracteres:</b> el texto se descompone en unidades abstractas: H, O, L, A. Un [[caracter|carácter]] es la letra como idea, independientemente de la fuente con que se dibuje.',
              '<b>Codificación:</b> un conjunto de caracteres asigna un número a cada uno. En ASCII y en Unicode, «H» es el 72.',
              '<b>Bits:</b> ese número se escribe en binario: 72 es <code>01001000</code>.',
              '<b>Representación binaria:</b> los bytes de todos los caracteres, uno tras otro, son lo que realmente se guarda en memoria o se envía por la red.',
            ] },
            { type: 'p', text: 'El código [[ascii|ASCII]], estandarizado en los años sesenta, asigna números del 0 al 127 a 128 caracteres: las letras del alfabeto inglés en mayúsculas y minúsculas, los dígitos, signos de puntuación y algunos caracteres de control. Como $128 = 2^7$, le bastan 7 bits; en la práctica cada carácter se guarda en un byte cuyo primer bit es 0 [@rfc20].' },
            { type: 'p', text: 'Pruébalo tú. El conversor empieza con «HOLA» en ASCII:' },
            { type: 'widget', id: 'text-to-binary', options: { text: 'HOLA', mode: 'ascii' }, caption: 'Pasa el cursor (o el foco del teclado) por una fila para ver dónde quedan sus bits en la secuencia final. Prueba también «Año» en modo ASCII y después en UTF-8. La codificación UTF-8 la calcula el propio navegador con <code>TextEncoder</code>, no una tabla escrita a mano.' },
            { type: 'table', head: ['Carácter', 'Decimal', 'Binario (8 bits)'], mono: [1, 2], rows: [
              ['H', '72', '01001000'],
              ['O', '79', '01001111'],
              ['L', '76', '01001100'],
              ['A', '65', '01000001'],
            ], caption: '«HOLA» en ASCII. Los valores corresponden a las letras <em>mayúsculas</em>; las minúsculas tienen otros códigos (por ejemplo, «h» es 104).' },
            { type: 'p', text: 'ASCII tiene un límite evidente para quien escribe en español: no incluye «ñ», «á» ni «¿». Para resolverlo de forma universal surgió [[unicode|Unicode]], un estándar que asigna un número —llamado [[punto-de-codigo|punto de código]]— a los caracteres de prácticamente todos los sistemas de escritura del mundo, además de símbolos matemáticos y emojis. La versión 18.0, publicada en septiembre de 2026, define 172 808 caracteres [@unicode18].' },
            { type: 'p', text: 'Unicode dice <em>qué número</em> corresponde a cada carácter, pero no <em>cuántos bytes</em> usar para guardarlo. De eso se encarga una forma de codificación. La más extendida es [[utf-8|UTF-8]], que usa de 1 a 4 bytes por carácter y tiene una propiedad muy valiosa: los 128 caracteres de ASCII se codifican exactamente igual que en ASCII, con un solo byte [@rfc3629]. Por eso «HOLA» produce los mismos bits en ambos modos, mientras que «ñ» necesita dos bytes en UTF-8 y no existe en ASCII.' },
          ],
        },
        {
          id: 'imagenes',
          title: 'Imágenes: una cuadrícula de números',
          blocks: [
            { type: 'p', text: 'El texto no es el único tipo de dato. Una imagen digital es una cuadrícula de pequeños cuadrados llamados [[pixel|píxeles]], y cada píxel se describe con números. En la versión más simple, un píxel es blanco o negro, y basta un bit: 0 para blanco, 1 para negro.' },
            { type: 'widget', id: 'pixel-grid', caption: 'Pulsa o arrastra sobre la cuadrícula para dibujar. A la derecha aparece cada fila como un byte, en binario y en hexadecimal. Con 1 bit por píxel, una fila de 8 píxeles cabe exactamente en un byte.' },
            { type: 'p', text: 'Las imágenes reales usan más bits por píxel. En escala de grises es habitual usar un byte por píxel, con 256 niveles entre el negro (0) y el blanco (255). En color, el esquema más común guarda tres números por píxel —rojo, verde y azul (RGB)—, cada uno con 8 bits: 24 bits por píxel. Una fotografía de 12 megapíxeles ocuparía así unos 36 millones de bytes sin comprimir; los formatos como JPEG o PNG reducen ese tamaño, pero la idea de base no cambia: la imagen es una lista de números con una convención para interpretarlos.' },
          ],
        },
        {
          id: 'procesamiento',
          title: 'Un recorrido simplificado por la computadora',
          blocks: [
            { type: 'p', text: 'Ya sabemos cómo se representa la información. Falta ver, al menos a grandes rasgos, qué hace la computadora con ella. Sigamos el viaje de una sola letra desde el teclado hasta la pantalla.' },
            { type: 'widget', id: 'information-flow', caption: '<b>Modelo simplificado.</b> Omite deliberadamente controladores de dispositivo, interrupciones, el sistema operativo, las memorias caché y el funcionamiento real de las fuentes tipográficas. Su objetivo es mostrar que, en cada etapa, lo que circula son patrones de bits interpretados según una convención.' },
            { type: 'p', text: 'Este recorrido sigue, de forma muy resumida, la organización que John von Neumann describió en 1945 para las computadoras con programa almacenado: unidades de entrada y salida, una memoria que guarda tanto los datos como las instrucciones, y una unidad que ejecuta esas instrucciones [@vonneumann1993; @patterson2021]. Los procesadores actuales son mucho más complejos, pero conservan esa estructura conceptual. La estudiaremos con detalle en la unidad «Arquitectura y ejecución» de este módulo.' },
            { type: 'callout', kind: 'model', status: 'simplificacion', title: 'Sobre el paso 4', text: 'El paso 4 usa un hecho real de ASCII —las mayúsculas y minúsculas de una letra difieren en 32— para que el ejemplo sea concreto. Las bibliotecas de texto modernas no convierten mayúsculas así, porque esa regla solo funciona para el alfabeto inglés básico; con Unicode se usan tablas de correspondencia.' },
          ],
        },
        {
          id: 'propiedades-bit',
          title: 'Lo que damos por sentado sobre un bit',
          blocks: [
            { type: 'p', text: 'Terminemos el nivel 1 haciendo explícitas algunas propiedades del bit que solemos dar por supuestas, porque en el Módulo 3 vamos a compararlas con las del qubit:' },
            { type: 'list', items: [
              '<b>Tiene siempre un valor definido.</b> En cada instante un bit vale 0 o 1 (en un circuito bien diseñado, fuera de los breves momentos de transición).',
              '<b>Leerlo no lo modifica.</b> Podemos consultar el valor de un bit en memoria tantas veces como queramos y seguirá siendo el mismo.',
              '<b>Se puede copiar libremente.</b> Copiar un archivo es copiar sus bits, y la copia es idéntica al original.',
              '<b>El ruido se combate con márgenes y redundancia.</b> Umbrales bien separados, repetición y códigos de corrección permiten que los bits sean fiables.',
            ] },
            { type: 'callout', kind: 'preview', status: 'establecido', title: 'Avance: el qubit cambia estas reglas', text: 'Para los qubits, varias de estas propiedades dejan de cumplirse de la forma habitual. En general, medir un qubit produce un resultado (0 o 1) que solo se puede predecir de forma probabilística, y la medición altera el estado. Además, no existe un procedimiento que copie un estado cuántico desconocido arbitrario: es el teorema de no clonación [@nielsen2010, recuadro 12.1]. No intentes entender todavía el porqué: lo construiremos paso a paso en los módulos 3 y 4. Lo importante ahora es saber qué estamos dando por sentado en el mundo clásico.' },
          ],
        },
      ],
    },

    // =====================================================================
    matematico: {
      intro: 'Aquí ponemos números a las ideas del nivel 1. Cada sección empieza con la idea en pocas palabras y un ejemplo; las demostraciones están en «Para profundizar», por si te interesan. Basta con aritmética.',
      sections: [
        {
          id: 'notacion-posicional',
          title: 'Notación posicional en base 2', key: 'Cada posición de un número binario vale el doble que la de su derecha: 1, 2, 4, 8, 16… Para saber cuánto vale, suma los valores de las posiciones donde hay un 1.',
          blocks: [
            { type: 'p', text: 'Empecemos por algo que ya sabes hacer sin pensar. En decimal, el número 472 significa:' },
            { type: 'math', tex: '472 = 4 \\cdot 10^2 + 7 \\cdot 10^1 + 2 \\cdot 10^0 = 400 + 70 + 2' },
            { deep: true, type: 'p', text: 'Cada posición tiene un <em>peso</em> que es una potencia de la base (10), y cada dígito dice cuántas veces se toma ese peso. El [[binario|sistema binario]] funciona exactamente igual, con base 2 y solo dos dígitos posibles, 0 y 1. Un número binario de $n$ dígitos $b_{n-1} b_{n-2} \\dots b_1 b_0$ vale:' },
            { deep: true, type: 'math', tex: 'N = \\sum_{i=0}^{n-1} b_i \\cdot 2^i, \\qquad b_i \\in \\{0, 1\\}', note: 'El subíndice $i$ indica la posición contando desde la derecha y empezando en 0. El bit $b_0$ es el <em>menos significativo</em> (peso $2^0 = 1$) y $b_{n-1}$ el <em>más significativo</em>.' },
            { type: 'p', text: 'Apliquémoslo al byte de la letra «H», $01001000_2$ (el subíndice 2 indica que está en base 2):' },
            { type: 'table', head: ['Posición', '7', '6', '5', '4', '3', '2', '1', '0'], mono: [1, 2, 3, 4, 5, 6, 7, 8], rows: [
              ['Peso', '128', '64', '32', '16', '8', '4', '2', '1'],
              ['Bit', '0', '1', '0', '0', '1', '0', '0', '0'],
              ['Bit × peso', '0', '64', '0', '0', '8', '0', '0', '0'],
            ] },
            { type: 'math', tex: '\\begin{aligned} 01001000_2 &= 0\\cdot128 + 1\\cdot64 + 0\\cdot32 + 0\\cdot16 \\\\ &\\quad + 1\\cdot8 + 0\\cdot4 + 0\\cdot2 + 0\\cdot1 \\\\ &= 64 + 8 = 72 \\end{aligned}' },
            { type: 'p', text: 'En la práctica, basta con sumar los pesos de las posiciones donde hay un 1. Es lo que hace el explorador de bits del nivel 1 al mostrar el peso bajo cada bit.' },
            { type: 'widget', id: 'bit-explorer', options: { bits: 8, initial: '01001000' }, caption: 'El byte de «H». Cambia bits y comprueba que el valor es siempre la suma de los pesos activos.' },
          ],
        },
        {
          id: 'decimal-a-binario',
          title: 'De decimal a binario: divisiones sucesivas', key: 'Para pasar un número a binario, divídelo entre 2 una y otra vez, apunta los restos y léelos de abajo arriba.',
          blocks: [
            { type: 'p', text: 'Para el camino inverso usamos un método sistemático: dividir repetidamente entre 2 y anotar los restos. Convirtamos 72:' },
            { type: 'table', head: ['Paso', 'División', 'Cociente', 'Resto'], mono: [1, 2, 3], rows: [
              ['1', '72 ÷ 2', '36', '<b>0</b>'],
              ['2', '36 ÷ 2', '18', '<b>0</b>'],
              ['3', '18 ÷ 2', '9', '<b>0</b>'],
              ['4', '9 ÷ 2', '4', '<b>1</b>'],
              ['5', '4 ÷ 2', '2', '<b>0</b>'],
              ['6', '2 ÷ 2', '1', '<b>0</b>'],
              ['7', '1 ÷ 2', '0', '<b>1</b>'],
            ], caption: 'Se detiene cuando el cociente llega a 0.' },
            { type: 'p', text: 'Leyendo los restos <em>de abajo arriba</em> obtenemos $1001000_2$. Para completar un byte añadimos un 0 a la izquierda, que no cambia el valor: $01001000_2$. Comprobación: $64 + 8 = 72$. ✓' },
            { deep: true, type: 'h', text: '¿Por qué funciona?' },
            { deep: true, type: 'p', text: 'Dividir un número entre 2 separa su último bit. Si $N = 2q + r$ con $r \\in \\{0,1\\}$, entonces $r$ es exactamente $b_0$, porque todos los demás términos de la suma $\\sum b_i 2^i$ son múltiplos de 2. El cociente $q$ es el número que queda al «quitar» ese último bit, y repetir el proceso con $q$ nos da $b_1$, luego $b_2$, etc. Por eso los restos salen en orden del menos al más significativo y hay que leerlos al revés.' },
            { deep: true, type: 'steps', items: [
              { text: 'Partimos de la expansión binaria:', tex: '72 = b_6 2^6 + b_5 2^5 + b_4 2^4 + b_3 2^3 + b_2 2^2 + b_1 2^1 + b_0' },
              { text: 'Todo salvo $b_0$ es par, así que el resto de dividir entre 2 es $b_0$:', tex: '72 = 2 \\cdot 36 + 0 \\;\\Rightarrow\\; b_0 = 0' },
              { text: 'El cociente contiene los bits restantes desplazados una posición:', tex: '36 = b_6 2^5 + b_5 2^4 + b_4 2^3 + b_3 2^2 + b_2 2^1 + b_1' },
              { text: 'Repetimos hasta que el cociente es 0. Los restos son $b_0, b_1, \\dots, b_6$.' },
            ] },
          ],
        },
        {
          id: 'contar-patrones',
          title: 'Cuántos patrones y cuántos bits', key: 'Con n bits hay 2ⁿ combinaciones. Para distinguir N opciones necesitas tantos bits como haga falta para que 2ⁿ llegue a N: 26 letras → 5 bits, porque 2⁵ = 32.',
          blocks: [
            { type: 'p', text: 'En el nivel 1 vimos que cada bit duplica las combinaciones. Formalmente, como cada uno de los $n$ bits puede tomar 2 valores de forma independiente, el principio multiplicativo da:' },
            { type: 'math', tex: '\\underbrace{2 \\times 2 \\times \\cdots \\times 2}_{n\\ \\text{veces}} = 2^n \\ \\text{patrones}' },
            { deep: true, type: 'p', text: 'La pregunta inversa es igual de útil en ingeniería: ¿cuántos bits necesito, como mínimo, para dar un patrón distinto a cada una de $N$ alternativas? Necesitamos que $2^n \\ge N$, y el menor entero que lo cumple es:' },
            { deep: true, type: 'math', tex: 'n_{\\min} = \\lceil \\log_2 N \\rceil', note: '$\\lceil x \\rceil$ («techo de $x$») es el menor entero mayor o igual que $x$. $\\log_2 N$ es el exponente al que hay que elevar 2 para obtener $N$.' },
            { type: 'table', head: ['Alternativas $N$', '$\\log_2 N$', 'Bits mínimos', 'Comprobación'], rows: [
              ['2 (moneda)', '1', '1', '$2^1 = 2$'],
              ['26 (letras del alfabeto inglés)', '≈ 4,70', '5', '$2^4 = 16 < 26 \\le 32 = 2^5$'],
              ['128 (ASCII)', '7', '7', '$2^7 = 128$'],
              ['256 (un byte)', '8', '8', '$2^8 = 256$'],
              ['1 114 112 (puntos de código Unicode)', '≈ 20,09', '21', '$2^{20} = 1\\,048\\,576 < 1\\,114\\,112 \\le 2^{21}$'],
            ], caption: 'El espacio de Unicode va de U+0000 a U+10FFFF, es decir, $\\text{10FFFF}_{16} + 1 = 1\\,114\\,112$ valores posibles.' },
            { deep: true, type: 'h', text: 'Una medida de la información (avance)' },
            { deep: true, type: 'p', text: 'En su artículo de 1948, Shannon mide la información de una elección entre $N$ alternativas <em>igualmente probables</em> con el logaritmo de $N$ —una idea que él mismo atribuye a Hartley (1928)— y, al usar logaritmos en base 2, llama <em>bits</em> a la unidad resultante, término que atribuye a J. W. Tukey [@shannon1948]:' },
            { deep: true, type: 'math', tex: 'I = \\log_2 N \\ \\text{bits}' },
            { deep: true, type: 'p', text: 'Para la moneda, $\\log_2 2 = 1$ bit; para el dado, $\\log_2 6 \\approx 2{,}585$ bits; para una letra elegida al azar entre 26, $\\log_2 26 \\approx 4{,}70$ bits. Observa la diferencia con la tabla anterior: la <em>medida</em> de información puede no ser entera, pero para <em>almacenar</em> una sola letra con un código de longitud fija necesitamos un número entero de bits (5). Cuando las alternativas no son igualmente probables, la medida se generaliza con la entropía de Shannon, $H = -\\sum_i p_i \\log_2 p_i$, que estudiaremos cuando la necesitemos.' },
            { type: 'callout', kind: 'warning', title: 'Dos usos de la palabra «bit»', text: '«Bit» designa tanto un dígito binario de almacenamiento como la unidad de medida de información. No son lo mismo: un archivo de un millón de bits que contiene solo ceros ocupa un millón de bits de almacenamiento, pero apenas aporta información, y por eso se comprime muchísimo.' },
          ],
        },
        {
          id: 'hexadecimal',
          title: 'Hexadecimal: una abreviatura para leer bits', key: 'Cada dígito hexadecimal resume exactamente 4 bits: 0100 1000 → 4 y 8 → 0x48.',
          blocks: [
            { type: 'p', text: 'Las cadenas binarias largas son difíciles de leer. Por eso se usa con frecuencia la base 16, o [[hexadecimal|hexadecimal]], con los dígitos 0–9 y A–F (A = 10, …, F = 15). La clave es que $16 = 2^4$: cada dígito hexadecimal corresponde exactamente a 4 bits, de modo que la conversión se hace por bloques, sin cálculos:' },
            { type: 'steps', items: [
              { text: 'Partimos el byte en dos grupos de 4 bits:', tex: '01001000_2 = 0100\\;\\,1000' },
              { text: 'Convertimos cada grupo por separado:', tex: '0100_2 = 4, \\qquad 1000_2 = 8' },
              { text: 'Escribimos los dígitos juntos:', tex: '01001000_2 = 48_{16} \\quad (\\text{a menudo escrito } \\texttt{0x48})' },
              { text: 'Comprobación en decimal:', tex: '4 \\cdot 16 + 8 = 72 \\;\\checkmark' },
            ] },
            { type: 'table', head: ['Carácter', 'Binario', 'Grupos de 4', 'Hexadecimal'], mono: [1, 2, 3], rows: [
              ['H', '01001000', '0100 · 1000', '48'],
              ['O', '01001111', '0100 · 1111', '4F'],
              ['L', '01001100', '0100 · 1100', '4C'],
              ['A', '01000001', '0100 · 0001', '41'],
            ] },
            { type: 'p', text: 'Los puntos de código Unicode se escriben en hexadecimal precedidos de «U+»: «H» es U+0048 y «ñ» es U+00F1.' },
          ],
        },
        {
          id: 'utf8',
          title: 'UTF-8 paso a paso: por qué «ñ» ocupa dos bytes', key: 'UTF-8 reparte los bits de cada carácter en 1 a 4 bytes, y los primeros bits de cada byte indican cuántos bytes forman el carácter. Así, «ñ» se guarda como C3 B1.',
          blocks: [
            { type: 'p', text: 'UTF-8 reparte los bits del punto de código en 1, 2, 3 o 4 bytes según su tamaño. Los primeros bits de cada byte indican su función [@rfc3629]:' },
            { type: 'table', head: ['Rango de puntos de código', 'Bits útiles', 'Patrón de bytes'], mono: [0, 2], rows: [
              ['U+0000 – U+007F', '7', '0xxxxxxx'],
              ['U+0080 – U+07FF', '11', '110xxxxx 10xxxxxx'],
              ['U+0800 – U+FFFF', '16', '1110xxxx 10xxxxxx 10xxxxxx'],
              ['U+10000 – U+10FFFF', '21', '11110xxx 10xxxxxx 10xxxxxx 10xxxxxx'],
            ], caption: 'Las «x» se rellenan con los bits del punto de código, de izquierda a derecha. Fuente: RFC 3629, sección 3.' },
            { deep: true, type: 'p', text: 'Codifiquemos «ñ», cuyo punto de código es U+00F1:' },
            { deep: true, type: 'steps', items: [
              { text: 'Pasamos el punto de código a decimal y binario:', tex: '\\text{F1}_{16} = 15 \\cdot 16 + 1 = 241 = 11110001_2' },
              { text: 'Como $128 \\le 241 \\le 2047$ (es decir, U+0080–U+07FF), corresponde la fila de 2 bytes, que tiene 11 bits útiles. Rellenamos con ceros a la izquierda hasta 11 bits:', tex: '000\\,1111\\,0001' },
              { text: 'Repartimos: los 5 primeros bits van al primer byte y los 6 últimos al segundo:', tex: '\\underbrace{00011}_{5} \\;|\\; \\underbrace{110001}_{6}' },
              { text: 'Añadimos los prefijos «110» y «10»:', tex: '\\texttt{110}\\,00011 = 11000011_2 = \\text{C3}_{16}, \\qquad \\texttt{10}\\,110001 = 10110001_2 = \\text{B1}_{16}' },
              { text: 'Resultado: «ñ» se codifica en UTF-8 como los bytes <code>C3 B1</code>.' },
            ] },
            { type: 'figure', id: 'utf8-enye', caption: '<b>Figura 2.</b> Los 11 bits del punto de código U+00F1 se distribuyen en dos bytes. Los prefijos permiten a quien lee saber, al ver el primer byte, cuántos bytes forman el carácter.' },
            { type: 'p', text: 'Este diseño explica las propiedades que mencionamos en el nivel 1: un byte que empieza por 0 es siempre un carácter ASCII completo, de modo que cualquier texto ASCII ya es UTF-8 válido; y ningún byte de continuación (prefijo 10) se confunde con el inicio de un carácter.' },
          ],
        },
      ],
    },

    // =====================================================================
    implementar: {
      intro: 'Llevamos a código lo que hemos razonado. Los ejemplos usan solo Python estándar (versión 3.8 o superior) y se pueden ejecutar en cualquier terminal con <code>python3 archivo.py</code>. Las salidas mostradas se obtuvieron ejecutando cada programa.',
      sections: [
        {
          id: 'python-ascii',
          title: 'Explorar la codificación de un texto',
          blocks: [
            { type: 'p', text: 'En Python, <code>ord(c)</code> devuelve el punto de código Unicode de un carácter, y <code>format(n, "08b")</code> escribe un entero en binario con 8 dígitos (rellenando con ceros a la izquierda). Para los caracteres ASCII, el punto de código coincide con el código ASCII.' },
            { type: 'code', lang: 'python', file: 'hola_binario.py', code: `texto = "HOLA"
for c in texto:
    codigo = ord(c)  # punto de código (aquí coincide con ASCII)
    print(c, codigo, format(codigo, "08b"), format(codigo, "02X"))`,
            output: `H 72 01001000 48
O 79 01001111 4F
L 76 01001100 4C
A 65 01000001 41` },
            { type: 'list', items: [
              '<b>Línea 2:</b> recorremos el texto carácter a carácter. En Python 3, un <code>str</code> es una secuencia de puntos de código, no de bytes.',
              '<b>Línea 3:</b> <code>ord</code> obtiene el número asignado al carácter.',
              '<b>Línea 4:</b> <code>"08b"</code> significa «binario, ancho 8, relleno con ceros»; <code>"02X"</code>, «hexadecimal en mayúsculas, ancho 2».',
            ] },
          ],
        },
        {
          id: 'python-bytes',
          title: 'Texto no es lo mismo que bytes',
          blocks: [
            { type: 'p', text: 'Python distingue explícitamente entre texto (<code>str</code>) y bytes (<code>bytes</code>). El paso de uno a otro <em>exige</em> indicar una codificación, lo cual refleja exactamente la idea de esta lección.' },
            { type: 'code', lang: 'python', file: 'texto_y_bytes.py', code: `palabra = "Año"
datos = palabra.encode("utf-8")
print(datos)
print(len(palabra), len(datos))
print(" ".join(format(b, "08b") for b in datos))
print(datos.decode("utf-8"))
try:
    palabra.encode("ascii")
except UnicodeEncodeError as e:
    print("ASCII no puede representar:", e.object[e.start])`,
            output: `b'A\\xc3\\xb1o'
3 4
01000001 11000011 10110001 01101111
Año
ASCII no puede representar: ñ` },
            { type: 'list', items: [
              '<b>Línea 2:</b> <code>encode</code> convierte texto en bytes según UTF-8.',
              '<b>Línea 3:</b> Python muestra los bytes no ASCII en hexadecimal: <code>\\xc3\\xb1</code> son los bytes <code>C3 B1</code> que calculamos a mano en el nivel 2.',
              '<b>Línea 4:</b> la palabra tiene 3 caracteres pero ocupa 4 bytes.',
              '<b>Líneas 7–10:</b> intentar codificar «ñ» en ASCII produce un error, porque ASCII no le asigna ningún valor.',
            ] },
          ],
        },
        {
          id: 'python-conversion',
          title: 'Implementar la conversión y probarla',
          blocks: [
            { type: 'p', text: 'Python ya ofrece <code>bin()</code> e <code>int(s, 2)</code>, pero implementar la conversión nosotros mismos es un buen ejercicio para fijar el método de las divisiones sucesivas. Añadimos además pruebas automáticas: un hábito de ingeniería de software que retomaremos —con dificultades nuevas— cuando hablemos de probar programas cuánticos en el Módulo 8.' },
            { type: 'code', lang: 'python', file: 'conversion.py', code: `def a_binario(n, ancho=8):
    digitos = []
    while n > 0:
        n, resto = divmod(n, 2)
        digitos.append(str(resto))
    binario = "".join(reversed(digitos)) or "0"
    return binario.zfill(ancho)


def a_decimal(bits):
    valor = 0
    for b in bits:
        valor = valor * 2 + int(b)
    return valor


assert a_binario(72) == "01001000"
assert a_decimal("01001000") == 72
assert all(a_decimal(a_binario(n)) == n for n in range(256))
print("Todas las pruebas pasan")`,
            output: 'Todas las pruebas pasan' },
            { type: 'list', items: [
              '<b><code>a_binario</code></b>: <code>divmod(n, 2)</code> devuelve a la vez el cociente y el resto. Los restos se acumulan del bit menos significativo al más significativo, por eso se invierten con <code>reversed</code>. <code>zfill</code> completa con ceros a la izquierda.',
              '<b><code>a_decimal</code></b>: en lugar de sumar potencias, usa la <em>regla de Horner</em>: cada nuevo bit desplaza el valor acumulado una posición a la izquierda (multiplica por 2) y suma el bit. Para <code>"1001"</code>: 0 → 1 → 2 → 4 → 9.',
              '<b>Pruebas</b>: las dos primeras comprueban el ejemplo de la lección; la tercera verifica que convertir y deshacer la conversión devuelve el valor original para los 256 valores de un byte. Es una <em>propiedad</em>, no un caso aislado.',
            ] },
            { type: 'callout', kind: 'note', title: 'Para seguir explorando', text: 'Modifica <code>texto_y_bytes.py</code> para probar «€» (tres bytes: <code>E2 82 AC</code>) o un emoji (cuatro bytes). Comprueba con <code>len()</code> la diferencia entre caracteres y bytes.' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«La computadora almacena letras, números e imágenes».', reality: 'Almacena estados físicos que interpretamos como bits. Que esos bits sean una letra, un número o un color depende de la codificación que use el programa que los lee.' },
    { myth: '«Un 0 es 0 voltios y un 1 es exactamente un voltaje fijo».', reality: 'Cada valor lógico corresponde a un rango de valores físicos, con una zona de separación entre rangos. Esa separación es lo que permite tolerar ruido.' },
    { myth: '«Un carácter ocupa siempre un byte».', reality: 'Solo en codificaciones de un byte como ASCII. En UTF-8 un carácter ocupa entre 1 y 4 bytes: «A» ocupa 1, «ñ» ocupa 2 y «€» ocupa 3.' },
    { myth: '«ASCII, Unicode y UTF-8 son lo mismo».', reality: 'ASCII es un código de 128 caracteres. Unicode es un conjunto universal de caracteres que asigna puntos de código. UTF-8 es una forma de convertir esos puntos de código en bytes, compatible con ASCII en sus primeros 128 valores.' },
    { myth: '«Más bits siempre significa más información».', reality: 'El número de bits de almacenamiento y la cantidad de información en sentido de Shannon son cosas distintas. Un archivo muy repetitivo ocupa muchos bits pero contiene poca información, y por eso se comprime bien.' },
    { myth: '«Un qubit es un bit mejorado que vale 0 y 1 a la vez».', reality: 'Es una simplificación engañosa. Un qubit no es un bit con dos valores simultáneos que podamos leer; sus estados se describen con reglas distintas y medirlo produce un solo resultado. Lo veremos con cuidado en el Módulo 3.' },
  ],

  summary: [
    'En sentido técnico, la información consiste en distinguir entre alternativas; el significado lo aportan las convenciones [@shannon1948].',
    'Un bit es una abstracción sobre un sistema físico continuo y ruidoso, al que se le asignan dos rangos de valores distinguibles.',
    'Con $n$ bits hay $2^n$ patrones; para distinguir $N$ alternativas hacen falta $\\lceil \\log_2 N \\rceil$ bits. Un byte son 8 bits y admite 256 valores.',
    'Los números se representan en notación posicional en base 2; el hexadecimal abrevia cada grupo de 4 bits con un dígito.',
    'El texto pasa por las etapas carácter → punto de código → bytes. ASCII define 128 caracteres; Unicode asigna puntos de código a casi todos los sistemas de escritura; UTF-8 los codifica con 1 a 4 bytes.',
    'Las imágenes son cuadrículas de píxeles, cada uno descrito por uno o varios números.',
    'Un bit clásico tiene siempre un valor definido, se puede leer sin alterarlo y se puede copiar. Estas propiedades cambiarán al estudiar el qubit.',
  ],

  exercises: [
    { level: 'comprender', question: '¿Cuántos patrones distintos se pueden formar con 6 bits? ¿Bastarían para dar un código distinto a cada una de las 27 letras del alfabeto español (incluida la ñ)?', answer: 'Con 6 bits hay $2^6 = 64$ patrones. Sí bastan para 27 letras, y sobran 37 patrones (por ejemplo, para mayúsculas y minúsculas habría que cubrir 54 símbolos, que también caben).' },
    { level: 'comprender', question: 'El byte <code>01000001</code> está guardado en memoria. ¿Puedes decir con certeza si representa la letra «A»?', answer: 'No. Representa «A» solo si el programa lo interpreta como carácter ASCII (o UTF-8). Como entero sin signo es 65, y como nivel de gris es un gris oscuro. Sin conocer la codificación, el byte no tiene un significado definido.' },
    { level: 'matematico', question: 'Convierte la letra «Q» (código 81) a binario de 8 bits usando divisiones sucesivas, y comprueba el resultado con la suma de pesos.', answer: '81 ÷ 2 = 40 r <b>1</b>; 40 ÷ 2 = 20 r <b>0</b>; 20 ÷ 2 = 10 r <b>0</b>; 10 ÷ 2 = 5 r <b>0</b>; 5 ÷ 2 = 2 r <b>1</b>; 2 ÷ 2 = 1 r <b>0</b>; 1 ÷ 2 = 0 r <b>1</b>. Leyendo de abajo arriba: $1010001_2$, es decir, <code>01010001</code>. Comprobación: $64 + 16 + 1 = 81$.' },
    { level: 'matematico', question: '¿Cuál es el número mínimo de bits para asignar un código distinto a 200 productos de un catálogo?', answer: '$\\lceil \\log_2 200 \\rceil = 8$, porque $2^7 = 128 < 200 \\le 256 = 2^8$.' },
    { level: 'matematico', question: 'Decodifica la secuencia ASCII <code>01001001 01010011 01010001</code>.', answer: '$01001001_2 = 64 + 8 + 1 = 73$ → «I»; $01010011_2 = 64 + 16 + 2 + 1 = 83$ → «S»; $01010001_2 = 81$ → «Q». El texto es «ISQ».' },
    { level: 'implementar', question: '¿Cuántos bytes ocupa la palabra «camión» en UTF-8? Razónalo y compruébalo con Python.', answer: 'Tiene 6 caracteres: «c», «a», «m», «i» y «n» son ASCII (1 byte cada uno) y «ó» (U+00F3) pertenece al rango de 2 bytes. Total: $5 + 2 = 7$ bytes. En Python: <code>len("camión".encode("utf-8"))</code> devuelve <code>7</code>.' },
  ],

  references: [
    { key: 'shannon1948', use: 'Definición técnica de información como selección entre mensajes posibles, independencia del significado y medida logarítmica en bits.' },
    { key: 'harris2013', use: 'Niveles lógicos, umbrales y márgenes de ruido en circuitos digitales.' },
    { key: 'bryant2016', use: 'Bytes como unidad direccionable, hexadecimal y la idea de «información = bits + contexto» (§1.1).' },
    { key: 'rfc20', use: 'ASCII como código de 7 bits transmitido en bytes de 8 bits con el bit de mayor orden en 0.' },
    { key: 'unicode18', use: 'Puntos de código Unicode y número de caracteres de la versión 18.0.' },
    { key: 'rfc3629', use: 'Esquema de codificación UTF-8 y su compatibilidad con ASCII (tabla de rangos de la sección 3).' },
    { key: 'vonneumann1993', use: 'Organización de la computadora con programa almacenado que subyace al recorrido simplificado.' },
    { key: 'patterson2021', use: 'Componentes clásicos de una computadora (entrada, salida, memoria, ruta de datos y control).' },
    { key: 'nielsen2010', use: 'Avance sobre la medición cuántica y el teorema de no clonación.' },
    { key: 'petzold2022', use: 'Lectura complementaria recomendada: códigos, binario y construcción de una computadora desde cero.' },
  ],

  related: ['sistema-binario', 'texto-ascii-unicode', 'imagenes-y-datos', 'von-neumann', 'el-qubit'],
  next: 'sistema-binario',
};
