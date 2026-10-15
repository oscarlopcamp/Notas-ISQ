// Lección 1.3 — Caracteres y texto: ASCII, Unicode y UTF-8
// Salidas de código obtenidas con CPython 3.14 (2026-10-14). Los recuentos de
// grafemas, puntos de código y unidades UTF-16 se comprueban en tests/module1.test.js.

export default {
  id: 'texto-ascii-unicode',
  title: 'Caracteres y texto: ASCII, Unicode y UTF-8',
  lede: '¿Cuántos caracteres tiene «👍🏽»? Según a quién preguntes, 1, 2, 4 u 8. Esta lección explica por qué y qué consecuencias tiene para quien programa: longitudes, comparaciones, archivos corruptos y hasta ataques de suplantación.',
  updated: '2026-10-14',

  context: {
    learn: 'La diferencia entre grafema, punto de código, unidad de código y byte; cómo funcionan UTF-8 y UTF-16; la normalización; por qué aparece el mojibake y qué riesgos de seguridad tiene Unicode.',
    why: 'Casi todo el software procesa texto, y los errores de codificación están entre los más frecuentes. Además, distinguir entre lo que vemos y cómo se representa por dentro es la misma disciplina mental que exige la computación cuántica.',
    previous: 'En [[>representacion-informacion|la lección 1.1]] vimos que el texto se convierte en puntos de código y bytes, y cómo UTF-8 codifica «ñ». Aquí profundizamos.',
    next: 'La lección 1.4 aplica las mismas ideas a imágenes y sonido. La seguridad de Unicode reaparece en el Módulo 9, al analizar la superficie de ataque de las aplicaciones.',
  },

  objectives: [
    'Distinguir grafema, punto de código, unidad de código UTF-16 y byte, y predecir cuántos de cada hay en un texto.',
    'Explicar por qué cada lenguaje de programación puede dar una «longitud» distinta para el mismo texto.',
    'Normalizar texto (NFC/NFD) antes de compararlo.',
    'Diagnosticar mojibake y distinguirlo de la pérdida de información al codificar.',
    'Reconocer el riesgo de los caracteres visualmente confundibles.',
  ],

  prerequisites: { lessons: ['representacion-informacion', 'sistema-binario'], knowledge: ['Hexadecimal y el esquema UTF-8 de la lección 1.1.'] },

  introduction: [
    { type: 'p', text: 'En la lección 1.1 seguimos un camino sencillo: un carácter tiene un punto de código, y el punto de código se convierte en bytes. Para «HOLA» todo encaja: 4 letras, 4 puntos de código, 4 bytes. Pero el texto real es más rico. Hay acentos que se pueden escribir de dos formas, emojis formados por varias piezas y caracteres de alfabetos distintos que se ven idénticos.' },
    { type: 'p', text: 'Para manejar texto correctamente hay que separar cuatro niveles que, en el caso de «HOLA», coinciden por casualidad. Vamos a descubrirlos con un inspector de cadenas.' },
  ],

  levels: {
    comprender: {
      intro: 'Exploramos el texto por capas, desde lo que ve una persona hasta los bytes que se guardan.',
      sections: [
        {
          id: 'cuatro-niveles',
          title: 'Cuatro formas de contar un texto',
          blocks: [
            { type: 'list', ordered: true, items: [
              '<b>Grafemas:</b> lo que una persona considera un «carácter»: una letra, una letra acentuada, un emoji, una bandera [@uax29].',
              '<b>Puntos de código:</b> los números que asigna Unicode. Un grafema puede necesitar varios.',
              '<b>Unidades de código:</b> los bloques en que una codificación divide cada punto de código (8 bits en UTF-8 y 16 bits en UTF-16).',
              '<b>Bytes:</b> lo que finalmente se guarda en un archivo o se envía por la red.',
            ] },
            { type: 'widget', id: 'string-inspector', options: { text: 'café' }, caption: 'Prueba los ejemplos. Cada recuadro es un grafema; dentro aparecen sus puntos de código, su tipo, su escritura y sus bytes UTF-8. «café (NFD)» y «café (NFC)» se ven iguales, pero no lo son por dentro.' },
            { type: 'p', text: 'Fíjate en el pulgar con tono de piel, 👍🏽. Es <em>un</em> grafema formado por dos puntos de código: el pulgar (U+1F44D) y un modificador de tono (U+1F3FD). Una bandera, como 🇪🇸, son dos «indicadores regionales» (E y S) que el sistema dibuja juntos. Y una «é» puede ser un único punto de código (U+00E9) o una «e» seguida de un acento combinante (U+0301).' },
            { type: 'callout', kind: 'warning', title: 'La «longitud» depende del lenguaje', text: 'Python, <code>len()</code>, cuenta puntos de código: <code>len("👍🏽")</code> es 2. JavaScript, <code>.length</code>, cuenta unidades UTF-16 [@mdn-string-length]: da 4. El tamaño en UTF-8 es 8 bytes. Y una persona diría que hay 1. Ninguno se equivoca: miden cosas distintas. Si un formulario limita un nombre a «20 caracteres», hay que decidir cuál de estas cuatro cosas se cuenta.' },
          ],
        },
        {
          id: 'utf16',
          title: 'UTF-16: dieciséis bits no siempre bastan',
          blocks: [
            { type: 'p', text: 'Cuando se diseñó Unicode se pensó que 65 536 caracteres ($2^{16}$) serían suficientes, y algunos sistemas adoptaron unidades de 16 bits: Windows, Java y JavaScript. Pero Unicode creció hasta 1 114 112 puntos de código posibles, organizados en 17 «planos» de 65 536. El primero, el <em>plano multilingüe básico</em>, contiene casi todas las escrituras modernas. Los emojis y muchos símbolos están en planos superiores.' },
            { type: 'p', text: 'La solución de [[utf-16|UTF-16]] para esos puntos de código es usar dos unidades de 16 bits, llamadas <em>par sustituto</em> [@rfc2781]. Por eso 𝄞 (U+1D11E, la clave de sol) ocupa 2 unidades en JavaScript y, en general, por eso un emoji puede «medir» 2.' },
            { type: 'table', head: ['Texto', 'Grafemas', 'Puntos de código', 'Unidades UTF-16', 'Bytes UTF-8'], mono: [1, 2, 3, 4], rows: [
              ['A', '1', '1', '1', '1'],
              ['é (U+00E9)', '1', '1', '1', '2'],
              ['é (e + U+0301)', '1', '2', '2', '3'],
              ['€', '1', '1', '1', '3'],
              ['𝄞', '1', '1', '2', '4'],
              ['👍🏽', '1', '2', '4', '8'],
            ], caption: 'Los mismos recuentos que muestra el inspector, comprobados con Python (nivel 3).' },
          ],
        },
        {
          id: 'normalizacion',
          title: 'Dos «café» distintos: la normalización',
          blocks: [
            { type: 'p', text: 'Si un usuario escribe «café» con una «é» precompuesta y otro con «e» + acento, una comparación ingenua dirá que son textos distintos, aunque en pantalla sean idénticos. Unicode define estas dos formas como <em>canónicamente equivalentes</em> y ofrece formas de [[normalizacion|normalización]] para convertirlas a una representación única [@uax15]:' },
            { type: 'list', items: [
              '<b>NFC</b> (composición): usa los caracteres precompuestos siempre que existan. Es la forma recomendada para almacenar e intercambiar texto.',
              '<b>NFD</b> (descomposición): separa cada letra de sus marcas diacríticas. Es útil, por ejemplo, para buscar ignorando los acentos.',
            ] },
            { type: 'p', text: 'Usa los botones «→ NFC» y «→ NFD» del inspector con «café» y observa cómo cambian los puntos de código sin que cambie lo que ves.' },
            { type: 'callout', kind: 'note', title: 'Regla práctica', text: 'Normaliza el texto que llega del exterior (formularios, archivos, APIs) antes de compararlo, buscarlo o usarlo como clave. Un sistema que no lo hace puede tener «dos usuarios con el mismo nombre».' },
          ],
        },
        {
          id: 'mojibake',
          title: 'Mojibake: bytes correctos, lectura equivocada',
          blocks: [
            { type: 'p', text: 'Antes de Unicode convivían decenas de codificaciones de 8 bits. Cada una usaba los valores 128–255 para letras distintas: Windows-1252 para Europa occidental, otras para el cirílico o el griego. Hoy UTF-8 domina, pero las codificaciones antiguas siguen apareciendo en archivos, bases de datos y sistemas heredados.' },
            { type: 'p', text: 'Cuando unos bytes se leen con una codificación distinta de la usada para escribirlos aparece el [[mojibake]]. Pruébalo:' },
            { type: 'widget', id: 'mojibake-lab', caption: 'Elige con qué se escribe y con qué se lee. El caso «Año: windows-1252 → utf-8» produce «�», porque esos bytes no forman UTF-8 válido. Prueba también a escribir «€» en ASCII: ahí no hay mojibake, sino pérdida de información.' },
            { type: 'p', text: 'Distingue bien los dos fallos posibles. En el <b>mojibake</b>, los bytes están intactos y el texto original se puede recuperar si se sabe qué codificación se usó. En la <b>pérdida al codificar</b>, la codificación de destino no puede representar un carácter, se escribe un sustituto (como «?») y la información desaparece para siempre.' },
          ],
        },
        {
          id: 'seguridad',
          title: 'Caracteres que se parecen demasiado',
          blocks: [
            { type: 'p', text: 'La «а» cirílica (U+0430) y la «a» latina (U+0061) se dibujan igual en la mayoría de las fuentes. Un dominio, un nombre de usuario o un identificador pueden parecer legítimos y estar escritos con caracteres de otra escritura. El estándar de seguridad de Unicode, UTS #39, describe estos caracteres <em>confundibles</em> y mecanismos para detectarlos [@uts39].' },
            { type: 'p', text: 'Prueba el ejemplo «pаypal» en el inspector: el aviso detecta que mezcla las escrituras latina y cirílica.' },
            { type: 'callout', kind: 'preview', title: 'Avance: Módulo 9', text: 'Este es el primer ejemplo de un tema que retomaremos en ciberseguridad: la representación de los datos forma parte de la superficie de ataque. La misma idea aparece en cualquier sistema, también en las plataformas de computación cuántica, que reciben texto (nombres de trabajos, parámetros, credenciales) desde fuera.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Aquí ponemos números a las ideas del nivel 1. Cada sección empieza con la idea en pocas palabras y un ejemplo; las demostraciones están en «Para profundizar», por si te interesan. Basta con aritmética.',
      sections: [
        {
          id: 'planos',
          title: 'El espacio de códigos y sus planos', key: 'Unicode se organiza en 17 «planos» de 65 536 caracteres. Casi todos los emojis están fuera del primero.',
          blocks: [
            { deep: true, type: 'p', text: 'Los puntos de código van de U+0000 a U+10FFFF. Como $\\text{10FFFF}_{16} + 1 = 17 \\times 2^{16}$, el espacio se divide en 17 planos de $2^{16}$ puntos de código. El plano de un punto de código es su parte entera al dividir entre $2^{16}$:' },
            { deep: true, type: 'math', tex: '\\text{plano}(c) = \\left\\lfloor \\frac{c}{2^{16}} \\right\\rfloor, \\qquad \\text{U+1D11E} \\to \\left\\lfloor \\frac{\\text{1D11E}_{16}}{\\text{10000}_{16}} \\right\\rfloor = 1' },
          ],
        },
        {
          id: 'sustitutos',
          title: 'Pares sustitutos de UTF-16', key: 'En UTF-16, los caracteres fuera del primer plano ocupan dos unidades de 16 bits, un «par sustituto». Por ejemplo, 𝄞 = D834 DD1E.',
          blocks: [
            { deep: true, type: 'p', text: 'Para $c \\ge \\text{10000}_{16}$, UTF-16 resta $\\text{10000}_{16}$ (queda un número de 20 bits), lo parte en dos mitades de 10 bits y suma a cada una una base fija [@rfc2781]:' },
            { deep: true, type: 'math', tex: "c' = c - \\text{10000}_{16}, \\qquad \\text{alto} = \\text{D800}_{16} + \\lfloor c' / 2^{10} \\rfloor, \\qquad \\text{bajo} = \\text{DC00}_{16} + (c' \\bmod 2^{10})" },
            { deep: true, type: 'steps', items: [
              { text: 'Restamos la base:', tex: "c' = \\text{1D11E}_{16} - \\text{10000}_{16} = \\text{D11E}_{16} = 0000\\,1101\\,0001\\,0001\\,1110_2" },
              { text: 'Los 10 bits altos y los 10 bits bajos:', tex: "\\lfloor c'/2^{10} \\rfloor = 0000110100_2 = \\text{34}_{16}, \\qquad c' \\bmod 2^{10} = 0100011110_2 = \\text{11E}_{16}" },
              { text: 'Sumamos las bases:', tex: '\\text{alto} = \\text{D800} + \\text{34} = \\text{D834}_{16}, \\qquad \\text{bajo} = \\text{DC00} + \\text{11E} = \\text{DD1E}_{16}' },
              { text: 'Resultado: 𝄞 se representa en UTF-16 como <code>D834 DD1E</code>. Los valores D800–DFFF están reservados en Unicode precisamente para esto: nunca son caracteres por sí solos.' },
            ] },
          ],
        },
        {
          id: 'utf8-4bytes',
          title: 'El mismo carácter en UTF-8 (4 bytes)', key: 'En UTF-8, ese mismo carácter ocupa 4 bytes: F0 9D 84 9E.',
          blocks: [
            { deep: true, type: 'p', text: 'U+1D11E está en el rango U+10000–U+10FFFF, que en UTF-8 usa el patrón <code>11110xxx 10xxxxxx 10xxxxxx 10xxxxxx</code>, con 21 bits útiles [@rfc3629].' },
            { deep: true, type: 'steps', items: [
              { text: 'Escribimos el punto de código con 21 bits:', tex: '\\text{1D11E}_{16} = 000\\;011101\\;000100\\;011110_2' },
              { text: 'Repartimos 3 + 6 + 6 + 6 bits y añadimos los prefijos:', tex: '\\texttt{11110}000,\\; \\texttt{10}011101,\\; \\texttt{10}000100,\\; \\texttt{10}011110' },
              { text: 'En hexadecimal:', tex: '\\text{F0}\\;\\text{9D}\\;\\text{84}\\;\\text{9E}' },
            ] },
            { type: 'p', text: 'Puedes comprobar ambos resultados con el inspector: escribe 𝄞 y mira los bytes UTF-8 y las unidades UTF-16.' },
          ],
        },
        {
          id: 'equivalencia',
          title: 'La normalización como función', key: 'Para comparar textos, primero normaliza los dos (NFC) y después compáralos.',
          blocks: [
            { deep: true, type: 'p', text: 'Formalmente, la normalización es una función $N$ sobre cadenas tal que dos cadenas canónicamente equivalentes tienen la misma imagen, y aplicarla dos veces no cambia nada (es <em>idempotente</em>) [@uax15]:' },
            { deep: true, type: 'math', tex: 's \\equiv t \\iff N(s) = N(t), \\qquad N(N(s)) = N(s)' },
            { type: 'p', text: 'Por eso la comparación correcta de texto no es $s = t$, sino $N(s) = N(t)$.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Comprobamos todo con Python. El módulo <code>unicodedata</code> de la biblioteca estándar da acceso a la base de datos de Unicode (nombres, normalización).',
      sections: [
        {
          id: 'python-contar',
          title: 'Contar y normalizar',
          blocks: [
            { type: 'code', lang: 'python', file: 'contar_texto.py', code: `import unicodedata

for texto in ["é", "é", "👍🏽", "🇪🇸"]:
    puntos = len(texto)
    bytes_utf8 = len(texto.encode("utf-8"))
    unidades_utf16 = len(texto.encode("utf-16-le")) // 2
    print(ascii(texto), puntos, bytes_utf8, unidades_utf16)

a = "café"  # é precompuesta (U+00E9)
b = "café"  # e + acento agudo combinante (U+0301)
print(a == b, len(a), len(b))
print(unicodedata.normalize("NFC", a) == unicodedata.normalize("NFC", b))
print([unicodedata.name(c) for c in b[-2:]])`,
            output: `'e\\u0301' 2 3 2
'\\xe9' 1 2 1
'\\U0001f44d\\U0001f3fd' 2 8 4
'\\U0001f1ea\\U0001f1f8' 2 8 4
False 4 5
True
['LATIN SMALL LETTER E', 'COMBINING ACUTE ACCENT']` },
            { type: 'list', items: [
              '<b>Líneas 4–7:</b> tres formas de medir el mismo texto: puntos de código (<code>len</code>), bytes en UTF-8 y unidades UTF-16 (bytes UTF-16 entre 2). <code>ascii()</code> muestra los puntos de código como secuencias de escape, para verlos aunque la terminal no dibuje el emoji.',
              '<b>Línea 11:</b> las dos «café» son distintas para <code>==</code> y tienen distinta longitud.',
              '<b>Línea 12:</b> tras normalizar a NFC, son iguales.',
              'Python no cuenta grafemas en la biblioteca estándar; para eso hacen falta bibliotecas externas que implementen UAX #29. En JavaScript existe <code>Intl.Segmenter</code>, que es lo que usa el inspector de esta lección.',
            ] },
          ],
        },
        {
          id: 'python-mojibake',
          title: 'Reproducir y diagnosticar el mojibake',
          blocks: [
            { type: 'code', lang: 'python', file: 'mojibake.py', code: `original = "Año"
datos = original.encode("utf-8")
print(datos.decode("latin-1"))
print(datos.decode("cp1252"))
print(datos.decode("utf-8"))
try:
    "Año".encode("latin-1").decode("utf-8")
except UnicodeDecodeError as e:
    print("UnicodeDecodeError:", e.reason)`,
            output: `AÃ±o
AÃ±o
Año
UnicodeDecodeError: invalid continuation byte` },
            { type: 'p', text: 'El patrón «Ã» seguido de otro símbolo es la huella típica de UTF-8 leído como Latin-1 o Windows-1252: el primer byte de cada carácter de 2 bytes (<code>C3</code>) se muestra como «Ã». En sentido contrario, los bytes Latin-1 no suelen ser UTF-8 válido, y Python lo detecta con un error en lugar de inventar caracteres.' },
          ],
        },
        {
          id: 'python-confundibles',
          title: 'Detectar caracteres confundibles',
          blocks: [
            { type: 'code', lang: 'python', file: 'confundibles.py', code: `import unicodedata

latina = "paypal"
mezclada = "p\\u0430ypal"  # la segunda letra es la «а» cirílica
print(latina == mezclada)
for c in mezclada[:3]:
    print(c, f"U+{ord(c):04X}", unicodedata.name(c))`,
            output: `False
p U+0070 LATIN SMALL LETTER P
а U+0430 CYRILLIC SMALL LETTER A
y U+0079 LATIN SMALL LETTER Y` },
            { type: 'p', text: 'El nombre Unicode revela la escritura de cada carácter. Las aplicaciones que aceptan identificadores (nombres de usuario, dominios) deben aplicar las comprobaciones de UTS #39 en lugar de confiar en lo que se ve [@uts39].' },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Un carácter es un byte» o «un carácter es un char».', reality: 'En UTF-8 un carácter ocupa de 1 a 4 bytes; en UTF-16, una o dos unidades. Y lo que una persona percibe como un carácter (grafema) puede estar formado por varios puntos de código.' },
    { myth: '«Si dos textos se ven iguales, son iguales».', reality: 'Pueden diferir por la normalización (é precompuesta frente a e + acento) o por usar caracteres confundibles de otra escritura. Hay que normalizar antes de comparar y validar los identificadores.' },
    { myth: '«El mojibake estropea el archivo».', reality: 'Los bytes suelen estar intactos; el fallo es la convención de lectura. Si se identifica la codificación original, el texto se recupera. Distinto es codificar en una tabla que no tiene el carácter: ahí sí se pierde información.' },
    { myth: '«UTF-16 usa siempre 2 bytes por carácter».', reality: 'Los caracteres fuera del plano básico (muchos emojis, símbolos musicales, algunas escrituras históricas) necesitan un par sustituto: 4 bytes.' },
  ],

  summary: [
    'El texto se puede contar en grafemas, puntos de código, unidades de código y bytes; cada lenguaje y cada API puede contar una cosa distinta.',
    'UTF-16 usa pares sustitutos (D800–DFFF) para los puntos de código mayores que U+FFFF; UTF-8 usa de 1 a 4 bytes.',
    'Textos canónicamente equivalentes pueden tener puntos de código distintos; la normalización (NFC/NFD) los unifica.',
    'Mojibake: bytes correctos leídos con la codificación equivocada. Pérdida al codificar: la codificación de destino no tiene el carácter.',
    'Los caracteres confundibles de distintas escrituras son un riesgo de seguridad documentado (UTS #39).',
  ],

  exercises: [
    { level: 'comprender', question: 'Un sistema limita los nombres de usuario a 10 «caracteres» y está escrito en JavaScript usando <code>.length</code>. ¿Cuántos emojis 👍🏽 cabrían? ¿Y si estuviera en Python con <code>len()</code>?', answer: 'Cada 👍🏽 mide 4 en JavaScript (unidades UTF-16): cabrían 2 (8 unidades; un tercero llevaría a 12). En Python mide 2 (puntos de código): cabrían 5. Una persona vería 2 y 5 «caracteres» respectivamente, aunque el límite anunciado sea 10.' },
    { level: 'comprender', question: 'Un archivo muestra «EspaÃ±a». ¿Qué ha pasado y cómo se recupera el texto?', answer: 'Es mojibake: el texto se escribió en UTF-8 («ñ» = C3 B1) y se leyó como Latin-1 o Windows-1252. Se recupera leyendo los bytes otra vez como UTF-8; en Python, <code>"EspaÃ±a".encode("cp1252").decode("utf-8")</code> devuelve «España».' },
    { level: 'matematico', question: 'Calcula el par sustituto UTF-16 de 😀 (U+1F600).', answer: "$c' = \\text{1F600} - \\text{10000} = \\text{F600}_{16}$. $\\lfloor c'/2^{10} \\rfloor = \\text{3D}_{16}$ y $c' \\bmod 2^{10} = \\text{200}_{16}$. Alto: $\\text{D800} + \\text{3D} = \\text{D83D}$; bajo: $\\text{DC00} + \\text{200} = \\text{DE00}$. Resultado: <code>D83D DE00</code>." },
    { level: 'matematico', question: '¿En qué plano está U+20AC (€)? ¿Cuántas unidades UTF-16 necesita?', answer: '$\\lfloor \\text{20AC}_{16} / \\text{10000}_{16} \\rfloor = 0$: está en el plano básico, así que necesita una sola unidad UTF-16 (el valor 20AC).' },
    { level: 'implementar', question: 'Escribe una función <code>iguales(a, b)</code> que compare dos textos de forma robusta frente a la normalización. Pruébala con las dos «café».', answer: '<pre><code>import unicodedata\n\ndef iguales(a, b):\n    return unicodedata.normalize("NFC", a) == unicodedata.normalize("NFC", b)\n\nassert iguales("café", "cafe\\u0301")</code></pre>' },
  ],

  references: [
    { key: 'unicode18', use: 'Puntos de código, planos y la versión vigente del estándar.' },
    { key: 'uax29', use: 'Definición de grupo de grafemas («carácter percibido por el usuario»).' },
    { key: 'uax15', use: 'Equivalencia canónica y formas de normalización NFC y NFD.' },
    { key: 'rfc2781', use: 'UTF-16 y el cálculo de los pares sustitutos.' },
    { key: 'rfc3629', use: 'Patrón de 4 bytes de UTF-8.' },
    { key: 'mdn-string-length', use: 'String.length cuenta unidades UTF-16 en JavaScript.' },
    { key: 'uts39', use: 'Caracteres confundibles y suplantación de identificadores.' },
  ],

  related: ['representacion-informacion', 'imagenes-y-datos', 'superficie-ataque'],
  next: 'imagenes-y-datos',
};
