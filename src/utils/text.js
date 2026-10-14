// Normalización de texto para búsqueda y procesamiento del marcado ligero
// que usan los archivos de contenido.

import { references, citationLabel } from '../../references/references.js';
import { glossaryById } from '../../content/glossary.js';
import { lessonById } from '../../content/curriculum.js';
import { renderMath } from './math.js';
import { esc } from './dom.js';

/** Minúsculas y sin diacríticos: "Compuerta Hadamard" ≈ "compuerta hadamard". */
export function normalize(text) {
  return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/**
 * Convierte el marcado de contenido a HTML. Sintaxis admitida:
 *   $...$                  matemáticas en línea (KaTeX)
 *   [@clave]               cita;  [@clave, cap. 2]  con localizador
 *   [@a; @b]               varias citas
 *   [[termino]]            enlace al glosario;  [[termino|texto]]
 *   [[>leccion|texto]]     enlace a otra lección
 * El resto se interpreta como HTML de autor (contenido propio, no de usuarios).
 */
export function inline(source) {
  if (source == null) return '';
  const math = [];
  let out = String(source).replace(/(?<!\\)\$([^$]+?)\$/g, (_, tex) => {
    math.push(renderMath(tex, false));
    return `\u0000${math.length - 1}\u0000`;
  });
  out = out.replace(/\\\$/g, '$');

  out = out.replace(/\[(@[^\]]+)\]/g, (_, body) => {
    const parts = body.split(';').map((p) => p.trim()).filter(Boolean);
    const items = parts.map((part) => {
      const m = part.match(/^@([\w-]+)(?:\s*,\s*(.+))?$/);
      if (!m) return esc(part);
      const [, key, locator] = m;
      const ref = references[key];
      if (!ref) {
        console.warn(`Referencia no definida: ${key}`);
        return `<span class="cite-missing" title="Referencia no definida">?${esc(key)}</span>`;
      }
      const label = citationLabel(ref) + (locator ? `, ${esc(locator)}` : '');
      return `<a class="cite" href="#/referencias/${key}" data-ref="${key}" title="${esc(ref.title)}">${label}</a>`;
    });
    return `(${items.join('; ')})`;
  });

  out = out.replace(/\[\[(>?)([\w-]+)(?:\|([^\]]+))?\]\]/g, (_, isLesson, id, label) => {
    if (isLesson) {
      const lesson = lessonById(id);
      if (!lesson) console.warn(`Lección no definida: ${id}`);
      return `<a href="#/leccion/${id}">${label || esc(lesson ? lesson.title : id)}</a>`;
    }
    const term = glossaryById[id];
    if (!term) console.warn(`Término de glosario no definido: ${id}`);
    const title = term ? esc(stripMarkup(term.short)) : '';
    return `<a class="term" href="#/glosario/${id}" title="${title}">${label || esc(term ? term.term : id)}</a>`;
  });

  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => math[Number(i)]);
}

/** Texto plano aproximado (para búsqueda y atributos title). */
export function stripMarkup(source) {
  return String(source ?? '')
    .replace(/\[@[^\]]+\]/g, '')
    .replace(/\[\[>?[\w-]+\|([^\]]+)\]\]/g, '$1')
    .replace(/\[\[>?([\w-]+)\]\]/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
