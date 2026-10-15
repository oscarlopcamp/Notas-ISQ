// Lección 1.4 — Representación de imágenes y otros datos
// Salidas de código obtenidas con CPython 3.14 (2026-10-14). Tamaños, RLE y
// aliasing se comprueban también en tests/module1.test.js.

export default {
  id: 'imagenes-y-datos',
  title: 'Representación de imágenes, sonido y otros datos',
  lede: 'Una fotografía, una canción o un vídeo son, para la computadora, listas de números. Esta lección explica cómo se obtienen esos números a partir del mundo continuo, cuánto ocupan y por qué se pueden comprimir… casi siempre.',
  updated: '2026-10-14',

  context: {
    learn: 'Cómo se representan el color (RGB) y las imágenes, cómo se digitaliza el sonido mediante muestreo y cuantización, qué es el aliasing y cómo funciona la compresión con y sin pérdida, incluidos sus límites.',
    why: 'Todo dato del mundo real pasa por un proceso de digitalización con decisiones de ingeniería: cuántos bits, con qué frecuencia y qué se pierde. Además, la medición en computación cuántica también convierte algo continuo en resultados discretos, y conviene tener clara la versión clásica.',
    previous: 'En [[>representacion-informacion|la lección 1.1]] vimos una imagen de 8 × 8 píxeles en blanco y negro, y en [[>sistema-binario|la lección 1.2]], la cuantización y el redondeo de los números reales.',
    next: 'La unidad «Lógica digital» empieza a mirar dentro del hardware que procesa todos estos bits. El muestreo estadístico reaparecerá al estudiar los «shots» de un circuito cuántico (Módulo 3).',
  },

  objectives: [
    'Representar un color como tres números y convertirlo a notación hexadecimal.',
    'Calcular el tamaño sin comprimir de una imagen y de un fragmento de audio.',
    'Explicar el muestreo, la cuantización y el teorema de muestreo, y reconocer el aliasing.',
    'Distinguir la compresión sin pérdida de la compresión con pérdida, y justificar por qué no existe un compresor universal.',
  ],

  prerequisites: { lessons: ['representacion-informacion', 'sistema-binario'], knowledge: ['Potencias de 2 y conversión a hexadecimal.', 'Idea de función seno (para la parte de sonido; no hace falta trigonometría).'] },

  introduction: [
    { type: 'p', text: 'El mundo que percibimos es continuo: los colores varían gradualmente y la presión del aire que forma un sonido cambia de forma suave en el tiempo. Una computadora solo guarda listas finitas de números enteros. Digitalizar consiste en tomar dos decisiones: <em>dónde</em> o <em>cuándo</em> medir (muestreo) y con <em>cuántos niveles</em> describir cada medida (cuantización).' },
    { type: 'p', text: 'Veremos estas dos decisiones primero en las imágenes y después en el sonido. Terminaremos con la compresión, que intenta reducir el tamaño de los resultados.' },
  ],

  levels: {
    comprender: {
      intro: 'Tres laboratorios: el color, la compresión y el muestreo de una señal.',
      sections: [
        {
          id: 'color',
          title: 'Un color son tres números',
          blocks: [
            { type: 'p', text: 'Las pantallas forman los colores mezclando luz roja, verde y azul (modelo RGB). Cada [[pixel|píxel]] se describe con la intensidad de cada una, habitualmente de 0 a 255, es decir, 8 bits por canal y 24 bits por píxel. En la web estos tres bytes se escriben en hexadecimal: <code>#1F4E8C</code> es rojo <code>1F</code> = 31, verde <code>4E</code> = 78 y azul <code>8C</code> = 140.' },
            { type: 'widget', id: 'rgb-mixer', caption: 'Mueve los controles y observa los bits de cada canal. Después reduce la profundidad a 3 o 2 bits por canal: el degradado inferior se rompe en bandas, porque hay pocos niveles disponibles.' },
            { type: 'p', text: 'Las bandas que aparecen al reducir los bits son el efecto de la [[cuantizacion|cuantización]]: cada valor se redondea al nivel representable más cercano. Con 8 bits por canal, 256 niveles bastan para que el ojo no distinga los saltos en la mayoría de los casos; con 2 bits por canal, solo hay 4 niveles por canal y las bandas son evidentes.' },
            { type: 'callout', kind: 'note', title: 'Más canales', text: 'Muchos formatos añaden un cuarto canal, alfa (A), que indica la opacidad: RGBA usa 32 bits por píxel. Y la [[profundidad-de-color|profundidad de color]] puede ser mayor que 8 bits por canal en fotografía profesional o en imágenes médicas.' },
          ],
        },
        {
          id: 'tamano',
          title: '¿Cuánto ocupa una imagen?',
          blocks: [
            { type: 'p', text: 'Una imagen sin comprimir ocupa simplemente anchura × altura × bits por píxel. Una pantalla Full HD tiene 1920 × 1080 píxeles:' },
            { type: 'table', head: ['Profundidad', 'Bytes', 'MiB'], mono: [1, 2], rows: [
              ['1 bit (blanco y negro)', '259 200', '0,25'],
              ['8 bits (escala de grises)', '2 073 600', '1,98'],
              ['24 bits (RGB)', '6 220 800', '5,93'],
              ['32 bits (RGBA)', '8 294 400', '7,91'],
            ], caption: 'Tamaño de una sola imagen de 1920 × 1080 sin comprimir (calculado con Python en el nivel 3). Un vídeo a 30 imágenes por segundo multiplicaría el de 24 bits por 30 cada segundo.' },
            { type: 'p', text: 'Con estas cifras, un minuto de vídeo Full HD sin comprimir ocuparía más de 10 GiB. Los vídeos reales ocupan muchísimo menos gracias a la compresión.' },
          ],
        },
        {
          id: 'compresion',
          title: 'Comprimir: aprovechar la redundancia',
          blocks: [
            { type: 'p', text: 'La [[compresion|compresión]] se basa en una idea que ya vimos con Shannon: la cantidad de información depende de lo predecible que sea el contenido. Una imagen con grandes zonas del mismo color es muy predecible y se puede describir con menos bits.' },
            { type: 'p', text: 'El método más sencillo es la <b>codificación por longitud de series</b> (RLE): en lugar de «blanco, blanco, blanco…» se guarda «blanco × 10». Pruébalo:' },
            { type: 'widget', id: 'rle-compressor', caption: 'Dibuja sobre la cuadrícula o elige una imagen. Compara el círculo con el tablero de ajedrez y con el ruido: ¿cuándo la «compresión» aumenta el tamaño?' },
            { type: 'p', text: 'Con el tablero de ajedrez, RLE es un desastre: cada píxel es una serie de longitud 1 y guardar la longitud solo añade bytes. Los compresores reales combinan ideas más potentes. PNG, por ejemplo, usa el método deflate, que busca repeticiones de secuencias anteriores (familia LZ77) y asigna códigos más cortos a los símbolos más frecuentes (códigos de Huffman) [@png3; @ziv1977; @huffman1952].' },
            { type: 'list', items: [
              '<b>Compresión sin pérdida</b> (ZIP, PNG, FLAC): el original se recupera exactamente. Imprescindible para texto, programas o datos científicos.',
              '<b>Compresión con pérdida</b> (JPEG, MP3, la mayoría del vídeo): descarta detalles que los sentidos humanos apenas perciben. Logra reducciones mucho mayores, pero el original no se puede recuperar.',
            ] },
            { type: 'callout', kind: 'note', status: 'establecido', title: 'No existe el compresor universal', text: 'Ningún método sin pérdida puede reducir el tamaño de <em>todos</em> los archivos posibles. Si lo hiciera, aplicándolo una y otra vez llegaríamos a un archivo vacío. En el nivel 2 lo demostraremos con un simple argumento de conteo, y en el nivel 3 verás que zlib hace crecer los datos aleatorios.' },
          ],
        },
        {
          id: 'sonido',
          title: 'El sonido: muestrear y cuantizar',
          blocks: [
            { type: 'p', text: 'Un micrófono convierte la presión del aire en una señal eléctrica que varía de forma continua. Para digitalizarla se mide su valor a intervalos regulares ([[muestreo]]) y cada medida se redondea a uno de $2^b$ niveles (cuantización con $b$ bits).' },
            { type: 'widget', id: 'audio-sampling', caption: 'La curva gris es la señal original; los puntos, las muestras cuantizadas; la línea escalonada, la reconstrucción más sencilla. Baja la frecuencia de muestreo por debajo del doble de la frecuencia de la señal y aparecerá una línea roja discontinua: otra señal más lenta que pasa exactamente por las mismas muestras.' },
            { type: 'p', text: 'Ese fenómeno es el [[aliasing]]. El <b>teorema de muestreo</b> dice que, si una señal no contiene frecuencias por encima de $W$ hercios, queda completamente determinada por muestras tomadas a más de $2W$ muestras por segundo [@shannon1949; @nyquist1928]. Si se muestrea más despacio, frecuencias distintas se vuelven indistinguibles y la información se pierde de forma irreversible.' },
            { type: 'p', text: 'El oído humano percibe, aproximadamente, hasta unos 20 000 Hz. Por eso el audio del CD usa 44 100 muestras por segundo (más del doble de 20 000), con 16 bits por muestra y dos canales. Eso supone 1 411 200 bits por segundo, unos 10 MiB por minuto sin comprimir.' },
            { type: 'callout', kind: 'model', status: 'simplificacion', text: 'El simulador usa frecuencias muy bajas (de 1 a 12 Hz) para poder dibujar la señal, y la reconstrucción escalonada es la más simple posible. Los convertidores reales filtran la señal antes de muestrear (para eliminar frecuencias que producirían aliasing) y reconstruyen con filtros más sofisticados.' },
          ],
        },
        {
          id: 'otros-datos',
          title: 'Todo lo demás: datos con formato',
          blocks: [
            { type: 'p', text: 'Vídeo, documentos, hojas de cálculo, mapas… todos siguen el mismo principio: una secuencia de bytes más una convención (un <em>formato</em>) que dice cómo interpretarlos. Un archivo PNG empieza con unos bytes fijos que lo identifican; un JSON es texto UTF-8 con una sintaxis concreta; un vídeo es una sucesión de imágenes comprimidas, sincronizada con audio.' },
            { type: 'callout', kind: 'preview', title: 'Avance: medir en computación cuántica', text: 'Cuando en el Módulo 3 midamos un qubit, obtendremos un resultado discreto (0 o 1), y para estimar probabilidades repetiremos el experimento muchas veces (los llamados <em>shots</em>). No es lo mismo que muestrear una señal clásica, pero comparte una lección: con un número finito de observaciones solo se obtiene una estimación, cuya precisión depende de cuántas se tomen.' },
          ],
        },
      ],
    },

    matematico: {
      intro: 'Aquí ponemos números a las ideas del nivel 1. Cada sección empieza con la idea en pocas palabras y un ejemplo; las demostraciones están en «Para profundizar», por si te interesan. Basta con aritmética.',
      sections: [
        {
          id: 'formulas-tamano',
          title: 'Tamaños y número de colores', key: 'Imagen: ancho × alto × bits por píxel. Audio: muestras por segundo × bits por muestra × canales.',
          blocks: [
            { type: 'p', text: 'Con $b$ bits por canal y $k$ canales, cada píxel tiene $bk$ bits y existen $2^{bk}$ colores distintos. Una imagen de $W \\times H$ píxeles sin comprimir ocupa:' },
            { type: 'math', tex: '\\text{bits} = W \\cdot H \\cdot b \\cdot k, \\qquad 1920 \\cdot 1080 \\cdot 8 \\cdot 3 = 49\\,766\\,400 \\text{ bits} = 6\\,220\\,800 \\text{ bytes}' },
            { type: 'p', text: 'Para el audio PCM (sin comprimir) con frecuencia de muestreo $f_s$, $b$ bits por muestra y $c$ canales:' },
            { type: 'math', tex: '\\text{tasa} = f_s \\cdot b \\cdot c = 44\\,100 \\cdot 16 \\cdot 2 = 1\\,411\\,200 \\text{ bit/s}' },
          ],
        },
        {
          id: 'conteo',
          title: 'Por qué no existe el compresor universal', key: 'Hay más archivos de n bits que archivos más cortos, así que ningún compresor puede acortarlos todos.',
          blocks: [
            { deep: true, type: 'p', text: 'Supongamos un compresor sin pérdida $C$ que acorta todos los archivos de exactamente $n$ bits. Contemos:' },
            { deep: true, type: 'steps', items: [
              { text: 'Archivos distintos de $n$ bits:', tex: '2^n' },
              { text: 'Archivos distintos de menos de $n$ bits (longitudes $0, 1, \\dots, n-1$):', tex: '\\sum_{k=0}^{n-1} 2^k = 2^n - 1' },
              { text: 'Hay más entradas que salidas posibles, así que dos archivos distintos tendrían que comprimirse en el mismo resultado (principio del palomar). Entonces la descompresión no podría saber cuál de los dos era el original: $C$ no sería sin pérdida. Contradicción. ∎' },
            ] },
            { type: 'p', text: 'Los compresores funcionan porque los datos reales no son aleatorios: tienen estructura. A cambio, siempre hay entradas que no se reducen, y algunas crecen un poco.' },
          ],
        },
        {
          id: 'aliasing-formal',
          title: 'La frecuencia aparente del aliasing', key: 'Si se muestrea demasiado despacio, una señal parece tener otra frecuencia: 9 Hz muestreados 10 veces por segundo parecen 1 Hz.',
          blocks: [
            { deep: true, type: 'p', text: 'Muestrear $\\sin(2\\pi f t)$ en los instantes $t_k = k/f_s$ da $\\sin(2\\pi f k / f_s)$. Como el seno se repite cada $2\\pi$, sumar o restar múltiplos de $f_s$ a la frecuencia no cambia ninguna muestra:' },
            { deep: true, type: 'math', tex: '\\sin\\!\\Big(2\\pi (f + m f_s)\\tfrac{k}{f_s}\\Big) = \\sin\\!\\Big(2\\pi f \\tfrac{k}{f_s} + 2\\pi m k\\Big) = \\sin\\!\\Big(2\\pi f \\tfrac{k}{f_s}\\Big)', note: '$m$ y $k$ son enteros, así que $2\\pi m k$ es un múltiplo de $2\\pi$.' },
            { deep: true, type: 'p', text: 'Por tanto, las muestras son indistinguibles de las de una señal con frecuencia $f_a$, la distancia de $f$ al múltiplo de $f_s$ más cercano:' },
            { deep: true, type: 'math', tex: 'f_a = \\big|\\, f - f_s \\cdot \\mathrm{round}(f / f_s) \\,\\big|' },
            { type: 'p', text: 'Ejemplo: una señal de 9 Hz muestreada a 10 Hz parece de $|9 - 10| = 1$ Hz. Pruébalo en el simulador con 9 Hz y 10 muestras por segundo. Para que $f_a = f$ (sin confusión) hace falta $f < f_s / 2$, que es la condición del teorema de muestreo.' },
          ],
        },
      ],
    },

    implementar: {
      intro: 'Calculamos tamaños, implementamos RLE y comprobamos con zlib, el compresor de la biblioteca estándar, que los datos aleatorios no se comprimen.',
      sections: [
        {
          id: 'python-tamanos',
          title: 'Tamaño de una imagen según su profundidad',
          blocks: [
            { type: 'code', lang: 'python', file: 'tamano_imagen.py', code: `ancho, alto = 1920, 1080
for nombre, bits in [("1 bit", 1), ("gris 8 bits", 8), ("RGB 24 bits", 24), ("RGBA 32 bits", 32)]:
    n_bytes = ancho * alto * bits // 8
    print(f"{nombre:13} {n_bytes:>9} bytes = {n_bytes / 2**20:6.2f} MiB")`,
            output: `1 bit            259200 bytes =   0.25 MiB
gris 8 bits     2073600 bytes =   1.98 MiB
RGB 24 bits     6220800 bytes =   5.93 MiB
RGBA 32 bits    8294400 bytes =   7.91 MiB` },
          ],
        },
        {
          id: 'python-rle',
          title: 'RLE en pocas líneas',
          blocks: [
            { type: 'code', lang: 'python', file: 'rle.py', code: `def rle(datos):
    salida = []
    for valor in datos:
        if salida and salida[-1][0] == valor:
            salida[-1][1] += 1
        else:
            salida.append([valor, 1])
    return salida


fila = [255] * 10 + [0] * 3 + [255] * 7
print(rle(fila))
print(rle([10, 20, 30, 40]))`,
            output: `[[255, 10], [0, 3], [255, 7]]
[[10, 1], [20, 1], [30, 1], [40, 1]]` },
            { type: 'p', text: 'Una fila de 20 píxeles se describe con 3 series. En cambio, 4 valores distintos producen 4 series: más datos que el original, porque cada serie guarda también su longitud.' },
          ],
        },
        {
          id: 'python-zlib',
          title: 'zlib frente a datos repetitivos y aleatorios',
          blocks: [
            { type: 'code', lang: 'python', file: 'comprimir.py', code: `import random
import zlib

repetitivo = b"ABAB" * 2500
random.seed(1)
aleatorio = bytes(random.getrandbits(8) for _ in range(10000))
print(len(repetitivo), len(zlib.compress(repetitivo)))
print(len(aleatorio), len(zlib.compress(aleatorio)))`,
            output: `10000 34
10000 10011` },
            { type: 'p', text: '10 000 bytes repetitivos se reducen a 34. Los 10 000 bytes aleatorios <em>crecen</em> hasta 10 011: no hay redundancia que aprovechar, y el formato añade unos bytes de cabecera y control. Es el argumento de conteo del nivel 2 en la práctica. <code>random.seed(1)</code> hace que el experimento sea reproducible.' },
          ],
        },
        {
          id: 'python-audio',
          title: 'Tasa de bits del audio de CD',
          blocks: [
            { type: 'code', lang: 'python', file: 'audio_cd.py', code: `frecuencia = 44_100  # muestras por segundo
bits = 16            # bits por muestra
canales = 2          # estéreo
bits_por_segundo = frecuencia * bits * canales
print(bits_por_segundo)
print(bits_por_segundo * 60 // 8, "bytes por minuto")
print(f"{bits_por_segundo * 60 / 8 / 2**20:.1f} MiB por minuto")`,
            output: `1411200
10584000 bytes por minuto
10.1 MiB por minuto` },
          ],
        },
      ],
    },
  },

  misconceptions: [
    { myth: '«Más bits por píxel siempre se nota».', reality: 'Por encima de cierto umbral (habitualmente 8 bits por canal en pantallas comunes), el ojo deja de distinguir los niveles. Más profundidad sirve para editar sin degradar o para aplicaciones especiales, pero no siempre es visible.' },
    { myth: '«Se puede comprimir cualquier archivo; basta con un buen algoritmo».', reality: 'Ningún compresor sin pérdida reduce todos los archivos: lo prueba un argumento de conteo. Los datos aleatorios o ya comprimidos no se reducen, e incluso crecen.' },
    { myth: '«Muestrear más rápido nunca hace daño, y muestrear más lento solo pierde calidad».', reality: 'Muestrear demasiado despacio no solo pierde detalle: crea frecuencias falsas (aliasing) que no estaban en la señal original y que no se pueden eliminar después.' },
    { myth: '«Un JPEG guardado de nuevo conserva la calidad».', reality: 'La compresión con pérdida descarta información cada vez que se aplica; volver a comprimir puede degradar más la imagen.' },
  ],

  summary: [
    'Un color RGB son tres números, habitualmente de 8 bits cada uno (24 bits por píxel, $2^{24}$ colores).',
    'Digitalizar implica muestrear (cuándo o dónde medir) y cuantizar (con cuántos niveles).',
    'Teorema de muestreo: hace falta más del doble de la frecuencia máxima de la señal; si no, aparece aliasing.',
    'La compresión aprovecha la redundancia; sin pérdida recupera el original, con pérdida no.',
    'Ningún compresor sin pérdida reduce todos los archivos (principio del palomar).',
  ],

  exercises: [
    { level: 'comprender', question: '¿Qué color es <code>#FFFF00</code>? ¿Y <code>#808080</code>?', answer: '<code>#FFFF00</code>: rojo 255, verde 255, azul 0, es decir, amarillo (la luz roja y la verde se suman). <code>#808080</code>: 128 en los tres canales, un gris medio.' },
    { level: 'comprender', question: 'Una señal contiene un tono de 15 Hz y se muestrea a 20 muestras por segundo. ¿Se puede reconstruir? ¿Qué frecuencia «aparece»?', answer: 'No: hace falta más de 30 muestras por segundo. Se observa una frecuencia aparente de $|15 - 20| = 5$ Hz. En el simulador puedes reproducir un caso análogo: una señal de 9 Hz muestreada a 12 muestras por segundo parece de $|9 - 12| = 3$ Hz.' },
    { level: 'matematico', question: '¿Cuánto ocupa un minuto de vídeo de 1920 × 1080, RGB de 24 bits, a 30 imágenes por segundo, sin comprimir?', answer: '$6\\,220\\,800 \\times 30 \\times 60 = 11\\,197\\,440\\,000$ bytes, unos 10,4 GiB.' },
    { level: 'matematico', question: '¿Cuántos colores distintos hay con 5 bits para el rojo, 6 para el verde y 5 para el azul (formato de 16 bits)?', answer: '$2^5 \\cdot 2^6 \\cdot 2^5 = 2^{16} = 65\\,536$ colores.' },
    { level: 'implementar', question: 'Escribe <code>des_rle(series)</code>, la inversa de <code>rle</code>, y comprueba que <code>des_rle(rle(x)) == x</code> para varias listas.', answer: '<pre><code>def des_rle(series):\n    salida = []\n    for valor, n in series:\n        salida.extend([valor] * n)\n    return salida\n\nfor x in ([], [1], [5, 5, 5, 2], [255] * 10 + [0] * 3):\n    assert des_rle(rle(x)) == x</code></pre>' },
  ],

  references: [
    { key: 'shannon1948', use: 'La información depende de lo predecible del contenido: base de la compresión.' },
    { key: 'shannon1949', use: 'Teorema de muestreo.' },
    { key: 'nyquist1928', use: 'Antecedente del criterio de muestreo.' },
    { key: 'huffman1952', use: 'Códigos de longitud variable usados por deflate.' },
    { key: 'ziv1977', use: 'Compresión por referencias a repeticiones (LZ77).' },
    { key: 'png3', use: 'PNG como formato sin pérdida basado en deflate.' },
    { key: 'bryant2016', use: 'Representación de datos como bytes con un formato.' },
  ],

  related: ['representacion-informacion', 'sistema-binario', 'texto-ascii-unicode', 'shots-histogramas'],
  next: 'algebra-booleana',
};
