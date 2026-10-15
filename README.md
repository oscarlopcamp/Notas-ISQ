# Ingeniería de Software Cuántico — libro interactivo

> 📖 **Si quieres la visualización de lector, [da clic aquí](https://oscarlopcamp.github.io/Notas-ISQ/).**
> La plataforma está publicada en GitHub Pages: puedes leer las lecciones y usar los simuladores directamente en el navegador, sin instalar nada.

Plataforma web para aprender de forma progresiva, desde cómo una computadora clásica representa información hasta la ingeniería de software cuántico y la ciberseguridad cuántica. Está pensada para ingenieras e ingenieros de software sin conocimientos previos de mecánica cuántica.

Combina libro de texto, curso autodidacta, laboratorio de simulaciones, glosario y biblioteca de referencias verificadas. Cada lección se organiza en tres niveles de profundidad: **Comprender**, **Entender matemáticamente** e **Implementar**.

## Estado

| Etapa | Contenido | Estado |
|---|---|---|
| 1 | Arquitectura, interfaz, navegación, modelo de contenido, referencias y lección 1.1 completa | **Terminada** |
| 2 | Módulo 1 completo (fundamentos clásicos): 11 lecciones, 32 simuladores | **Terminada** |
| 3 | Módulos 2 y 3 (introducción y fundamentos conceptuales cuánticos) | En curso: Módulo 2 completo (6 lecciones); del Módulo 3, la unidad «El qubit» (lecciones 3.1 a 3.4) |
| 4 | Módulo 4 (matemáticas) | Pendiente |
| 5 | Módulo 5 (Python y Qiskit) y tutoriales | Pendiente |
| 6 | Módulos 6 y 7 (protocolos; Grover y Shor) | Pendiente |
| 7 | Módulo 8 (ingeniería de software cuántico) | Pendiente |
| 8 | Módulo 9 (ciberseguridad cuántica) | Pendiente |
| 9 | Revisión integral | Pendiente |

El índice muestra el programa completo (9 módulos, 102 lecciones). El Módulo 1 (11 lecciones) está publicado completo, y también el Módulo 2 (6 lecciones): «Qué es y de dónde viene», «Motivaciones y límites» y «El sistema de cómputo». Del Módulo 3 está publicada la unidad «El qubit» (lecciones 3.1 a 3.4). Las demás lecciones aparecen como «pendiente» con los temas que cubrirán, sin contenido provisional.

## Código editable y ejecutable

Todos los bloques de código de las lecciones, incluidas las soluciones de los ejercicios, son editables:

- **Editar:** escribe directamente sobre el código. El resaltado de sintaxis se mantiene, y los cambios se guardan en el navegador por bloque y se conservan al volver a la lección.
- **Restablecer:** recupera el código original y borra la versión guardada.
- **▶ Ejecutar** (o Ctrl/Cmd + Enter): ejecuta Python de verdad en el navegador con [Pyodide](https://pyodide.org/) 0.27.7 (CPython 3.12 compilado a WebAssembly). La primera ejecución descarga unos 10 MB, que el navegador guarda en caché. El código corre en un *worker* aparte, así que un bucle infinito se detiene a los 20 s sin congelar la página.
- **Copiar** y **Descargar** el código, con tus cambios.

Las «salidas esperadas» de las lecciones se obtuvieron con CPython 3.14. `tests/python.html` ejecuta todos los ejemplos en Pyodide y comprueba que coinciden. Solo difiere el bytecode de `dis` (lección 1.10), porque depende de la versión de Python, y la propia lección lo aprovecha para explicarlo.

## Ejecutar en local

No hace falta instalar dependencias ni compilar nada. Solo se necesita Python 3 para servir los archivos:

```bash
python3 tools/serve.py          # http://127.0.0.1:8000/
```

Los módulos ES no se pueden cargar con `file://`, así que abrir `index.html` con doble clic no funciona: hay que usar un servidor. `python3 -m http.server` también sirve, pero puede fallar de forma intermitente al cargar muchos módulos en paralelo porque solo admite 5 conexiones en cola. `tools/serve.py` evita ese problema.

Las fuentes (Google Fonts), KaTeX y highlight.js se cargan desde CDN. Sin conexión la plataforma sigue funcionando, pero las fórmulas se muestran como código TeX y el código aparece sin resaltar.

## Publicar

Es un sitio estático con rutas basadas en `#`, así que funciona en GitHub Pages, Netlify o cualquier alojamiento estático sin configurar nada. En GitHub Pages basta con publicar la raíz de la rama; el archivo `.nojekyll` ya está incluido.

## Pruebas

```bash
tools/run-tests.sh              # necesita python3 y Google Chrome o Chromium
```

El script ejecuta tres páginas en Chrome sin interfaz. También se pueden abrir a mano con el servidor en marcha:

- `tests/index.html`: pruebas unitarias de codificación binaria y UTF-8, y **pruebas de integridad del contenido**. Comprueban que toda cita, término del glosario, enlace entre lecciones, visualización y figura exista, que cada referencia citada aparezca en la bibliografía de la lección y que las referencias estén verificadas.
- `tests/interaction.html`: usa la aplicación real (progreso, favoritos, niveles, conversor, búsqueda, páginas pendientes). Borra el progreso guardado en ese navegador.
- `tests/responsive.html`: comprueba que ninguna página se desborde en horizontal a 360 px de ancho ni muestre texto residual («null»).
- `tests/python.html`: ejecuta en Pyodide todos los ejemplos de Python de las lecciones y compara su salida con la publicada. También comprueba que un bucle infinito se detiene y que los errores muestran un traceback limpio. Necesita conexión a internet; `SKIP_PYTHON=1 tools/run-tests.sh` la omite.

## Arquitectura

```
index.html                 Estructura de la aplicación (barra superior, índice, área principal)
src/
  scripts/app.js           Arranque, enrutador por hash y preferencias de lectura
  pages/                   Una página por ruta: inicio, módulo, lección, biblioteca, glosario…
  components/              Renderizador de bloques, índice lateral, búsqueda y piezas de UI
  visualizations/          Simuladores interactivos (registry.js) y figuras SVG estáticas
  utils/                   DOM, marcado de contenido, KaTeX, codificación, almacenamiento
  styles/                  tokens.css (colores y tipografía, tema claro y oscuro) y hojas por área
content/
  curriculum.js            Índice del libro: módulos, unidades y lecciones
  module-01/…              Contenido de cada lección, como datos
  glossary.js, library.js, tutorials.js
references/references.js   Biblioteca académica con estado de verificación
tests/                     Pruebas en el navegador
tools/                     Servidor de desarrollo y ejecutor de pruebas
docs/                      Modelo de contenido y criterios académicos
```

Decisiones principales:

- **Sin paso de compilación.** JavaScript moderno con módulos ES nativos. Se puede desplegar copiando archivos y mantener sin herramientas de Node.
- **El contenido son datos.** Cada lección es un objeto (`content/module-XX/*.js`) con objetivos, contexto, niveles, secciones y bloques tipados. La interfaz los dibuja con `src/components/blocks.js`. Para añadir una lección no hay que tocar la interfaz.
- **Carga bajo demanda.** Lecciones, páginas y simuladores se importan dinámicamente solo cuando se necesitan.
- **Rutas con `#`** (`#/leccion/<id>`, `#/glosario/<termino>`…), compatibles con cualquier alojamiento estático.
- **Progreso local.** El progreso, los favoritos, el nivel preferido, el tema y el tamaño de letra se guardan en `localStorage`. Todos los accesos están protegidos: si el almacenamiento está bloqueado, la plataforma funciona en memoria.
- **Bibliotecas externas mínimas:** KaTeX 0.16.9 (fórmulas), highlight.js 11.9.0 (resaltado de Python) y fuentes IBM Plex y Source Serif 4. Todas tienen alternativa sin conexión.

## Añadir una lección

1. Crea `content/module-XX/<id>.js` siguiendo [docs/modelo-de-contenido.md](docs/modelo-de-contenido.md). Puedes partir de `content/module-01/representacion-informacion.js`.
2. En `content/curriculum.js`, añade `load: () => import('./module-XX/<id>.js')` a la entrada de la lección.
3. Si introduces términos nuevos, añádelos a `content/glossary.js`. Si citas fuentes nuevas, verifícalas y añádelas a `references/references.js` según [docs/criterios-academicos.md](docs/criterios-academicos.md).
4. Si la lección necesita un simulador nuevo, crea `src/visualizations/<id>.js` exportando `mount(container, options)` y regístralo en `registry.js`.
5. Ejecuta `tools/run-tests.sh`. Las pruebas de integridad detectan citas, términos o enlaces rotos.

## Accesibilidad

Navegación completa con teclado (atajo `/` para buscar, enlace para saltar al contenido, foco visible), controles con etiquetas accesibles, contraste en ambos temas, tamaño de letra ajustable, respeto de `prefers-reduced-motion` y fórmulas con MathML para lectores de pantalla.

## Limitaciones conocidas

- La ejecución en el navegador usa Python 3.12 (Pyodide) y necesita conexión la primera vez. No admite `input()` interactivo ni bibliotecas que no estén en Pyodide; para Qiskit (Módulo 5) se indicará cómo ejecutarlo en local.
- El progreso no se sincroniza entre dispositivos (se puede exportar como JSON desde «Mi progreso»).
- La MiniCPU de la lección 1.9 es un procesador educativo propio, no una ISA real; la lección lo indica y la compara con RISC-V.
- Los simuladores cuánticos (esfera de Bloch, editor de circuitos, etc.) llegarán en etapas posteriores. La página «Simuladores» enumera los previstos.
