# Modelo de contenido

Cada lección es un módulo JavaScript que exporta por defecto un objeto. La interfaz no contiene texto académico: todo sale de estos objetos.

## Estructura de una lección

```js
export default {
  id: 'representacion-informacion',      // igual que en content/curriculum.js
  title: '…',
  lede: '…',                             // entradilla bajo el título
  updated: 'AAAA-MM-DD',                 // fecha de la última revisión

  context: {                             // Regla 4: conectar los conceptos
    learn: 'Qué aprenderemos',
    why: 'Por qué lo necesitamos',
    previous: 'Relación con lo anterior',
    next: 'Para qué servirá después',
  },

  objectives: ['…'],
  prerequisites: { lessons: ['id'], knowledge: ['…'] },
  introduction: [ /* bloques */ ],

  levels: {                              // cada nivel es opcional; no forzar contenido
    comprender:  { intro: '…', sections: [{ id, title, blocks: [] }] },
    matematico:  { intro: '…', sections: [] },
    implementar: { intro: '…', sections: [] },
  },

  misconceptions: [{ myth: '…', reality: '…' }],
  summary: ['…'],
  exercises: [{ level: 'comprender' | 'matematico' | 'implementar', question: '…', answer: '…' }],
  references: [{ key: 'shannon1948', use: 'Qué respalda en esta lección' }],
  related: ['id-leccion'],
  next: 'id-leccion',                    // siguiente recomendada (si no, la siguiente del índice)
};
```

Los identificadores de sección (`id`) deben ser únicos dentro de la lección: se usan en el índice lateral.

## Bloques

| `type` | Campos | Uso |
|---|---|---|
| `p` | `text` | Párrafo |
| `h` | `text` | Subtítulo dentro de una sección |
| `list` | `items`, `ordered?` | Lista |
| `callout` | `kind`, `title?`, `text` o `blocks`, `status?` | Recuadro (ver abajo) |
| `math` | `tex`, `note?` | Ecuación destacada (KaTeX) |
| `steps` | `items: [{ text?, tex? }]` | Desarrollo paso a paso |
| `table` | `head`, `rows`, `caption?`, `mono?` (índices de columnas en monoespaciado) | Tabla |
| `figure` | `id`, `caption?`, `options?` | Figura SVG estática de `src/visualizations/figures.js` |
| `widget` | `id`, `options?`, `caption?`, `title?` | Simulador de `src/visualizations/registry.js` |
| `code` | `lang`, `code`, `file?`, `output?`, `note?` | Código con botones de copiar y descargar (si hay `file`) |
| `quote` | `text`, `source?` | Cita textual |

**Tipos de recuadro (`kind`):** `note` (nota), `analogy` (analogía, que debe indicar sus límites), `warning` (atención), `misconception` (error frecuente), `preview` (avance de un tema posterior), `model` (modelo simplificado).

**Estatus epistémico (`status`, Regla 9):** `establecido`, `simplificacion`, `experimental`, `propuesta`, `emergente`, `abierto`. Se muestra como etiqueta en el recuadro.

## Marcado dentro del texto

| Sintaxis | Resultado |
|---|---|
| `$x^2$` | Fórmula en línea (escribir `\$` para un símbolo de dólar literal) |
| `[@clave]`, `[@clave, cap. 2]`, `[@a; @b]` | Cita autor-año enlazada a la bibliografía |
| `[[termino]]`, `[[termino\|texto]]` | Enlace al glosario con definición emergente |
| `[[>id-leccion]]`, `[[>id-leccion\|texto]]` | Enlace a otra lección |

Dentro de una cadena JavaScript, las barras invertidas de TeX se escriben dobles: `'\\frac{1}{2}'`.

`[[termino]]` muestra el nombre del término tal como figura en el glosario, con mayúscula inicial. En mitad de una frase conviene usar `[[bit|bit]]`.

## Simuladores

Un simulador es un módulo con `export function mount(container, options)`. Puede devolver una función de limpieza, que se llama al salir de la página. Se registra en `src/visualizations/registry.js` con título, descripción, módulo y lecciones que lo usan. Así aparece también en la página «Simuladores» y en la búsqueda.

Requisitos:

- Si el simulador simplifica la realidad, el pie (`caption`) debe decirlo.
- Debe usarse con teclado y tener etiquetas accesibles.
- Los cálculos deben ser reales: la codificación UTF-8, por ejemplo, la hace `TextEncoder`, no una tabla escrita a mano.
- La lógica pura va en `src/utils/` y tiene pruebas en `tests/`.
