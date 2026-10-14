// Renderizador de bloques de contenido. Las lecciones son datos (content/),
// y este módulo los convierte en DOM. Tipos admitidos: ver docs/modelo-de-contenido.md.

import { h } from '../utils/dom.js';
import { inline } from '../utils/text.js';
import { renderMath } from '../utils/math.js';
import { mountWidget, widgets } from '../visualizations/registry.js';
import { figures } from '../visualizations/figures.js';

export const EPISTEMIC = {
  establecido: 'Conocimiento establecido',
  simplificacion: 'Modelo simplificado',
  experimental: 'Resultado experimental',
  propuesta: 'Propuesta académica',
  emergente: 'Tecnología emergente',
  abierto: 'Problema abierto',
};

const CALLOUT_TITLES = {
  note: 'Nota',
  analogy: 'Analogía',
  warning: 'Atención',
  misconception: 'Error frecuente',
  preview: 'Avance',
  model: 'Modelo simplificado',
};

const renderers = {
  p: (b) => h('p', { html: inline(b.text) }),
  h: (b) => h('h4', { html: inline(b.text) }),
  list: (b) => h(b.ordered ? 'ol' : 'ul', {}, b.items.map((it) => h('li', { html: inline(it) }))),
  quote: (b) => h('blockquote', { class: 'callout model' }, h('p', { html: inline(b.text) }), b.source ? h('p', { class: 'muted small', html: `— ${inline(b.source)}` }) : null),

  callout: (b, ctx) => h('aside', { class: `callout ${b.kind || 'note'}` },
    h('div', { class: 'callout-title' },
      b.title ?? CALLOUT_TITLES[b.kind || 'note'],
      b.status ? h('span', { class: 'epistemic', title: 'Estatus del conocimiento' }, EPISTEMIC[b.status]) : null),
    b.blocks ? renderBlocks(b.blocks, ctx) : h('p', { html: inline(b.text) })),

  math: (b) => h('div', { class: 'equation' },
    h('div', { html: renderMath(b.tex, true) }),
    b.note ? h('p', { class: 'equation-note', html: inline(b.note) }) : null),

  steps: (b) => h('ol', { class: 'steps' }, b.items.map((it) => h('li', {},
    it.text ? h('div', { html: inline(it.text) }) : null,
    it.tex ? h('div', { class: 'step-math', html: renderMath(it.tex, true) }) : null))),

  table: (b) => {
    const mono = new Set(b.mono || []);
    return h('div', { class: 'table-wrap' }, h('table', {},
      b.caption ? h('caption', { html: inline(b.caption) }) : null,
      h('thead', {}, h('tr', {}, b.head.map((c) => h('th', { scope: 'col', html: inline(c) })))),
      h('tbody', {}, b.rows.map((row) => h('tr', {}, row.map((c, i) => h('td', { class: mono.has(i) ? 'mono' : null, html: inline(String(c)) })))))));
  },

  figure: (b) => {
    const draw = figures[b.id];
    return h('figure', { class: 'figure' },
      h('div', { class: 'figure-frame' }, draw ? draw(b.options || {}) : h('p', {}, `Figura no encontrada: ${b.id}`)),
      b.caption ? h('figcaption', { html: inline(b.caption) }) : null);
  },

  widget: (b, ctx) => {
    const meta = widgets[b.id] || {};
    const body = h('div', { class: 'widget-body' });
    const el = h('section', { class: 'widget', 'aria-label': b.title || meta.title },
      h('div', { class: 'widget-head' },
        h('span', { class: 'kind' }, 'Interactivo'),
        h('h4', {}, b.title || meta.title || b.id)),
      body,
      b.caption ? h('p', { class: 'widget-caption', html: inline(b.caption) }) : null);
    mountWidget(b.id, body, b.options).then((cleanup) => { if (cleanup) ctx?.cleanups?.push(cleanup); });
    return el;
  },

  code: (b) => codeBlock(b),
};

export function renderBlocks(blocks = [], ctx = {}) {
  return blocks.map((b) => {
    const render = renderers[b.type];
    if (!render) {
      console.warn(`Tipo de bloque desconocido: ${b.type}`);
      return h('p', { class: 'muted' }, `[bloque no admitido: ${b.type}]`);
    }
    return render(b, ctx);
  });
}

function codeBlock(b) {
  const code = h('code', { class: b.lang ? `language-${b.lang}` : null }, b.code.trim());
  if (globalThis.hljs && b.lang) {
    try { globalThis.hljs.highlightElement(code); } catch { /* sin resaltado */ }
  }
  const copy = h('button', {
    type: 'button',
    onclick: async () => {
      try {
        await navigator.clipboard.writeText(b.code.trim());
        copy.textContent = 'Copiado';
      } catch {
        copy.textContent = 'No se pudo copiar';
      }
      setTimeout(() => { copy.textContent = 'Copiar'; }, 1600);
    },
  }, 'Copiar');
  const download = b.file ? h('button', {
    type: 'button',
    onclick: () => {
      const url = URL.createObjectURL(new Blob([`${b.code.trim()}\n`], { type: 'text/plain' }));
      const a = h('a', { href: url, download: b.file });
      document.body.append(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
  }, 'Descargar') : null;

  return h('div', { class: 'code-block' },
    h('div', { class: 'code-head' }, h('span', {}, b.file || b.lang || 'código'), h('span', { class: 'spacer' }), copy, download),
    h('pre', {}, code),
    b.output != null ? h('div', { class: 'code-output' },
      h('div', { class: 'code-head' }, h('span', {}, b.outputLabel || 'Salida esperada')),
      h('pre', {}, h('samp', {}, b.output.trim()))) : null,
    b.note ? h('p', { class: 'widget-caption', html: inline(b.note) }) : null);
}
