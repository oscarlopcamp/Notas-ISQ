// Envoltorio de KaTeX. Si la biblioteca no está disponible (sin conexión),
// se muestra el código TeX en monoespaciado en lugar de fallar.

export function renderMath(tex, displayMode = false) {
  const katex = globalThis.katex;
  if (katex) {
    try {
      return katex.renderToString(tex, { displayMode, throwOnError: false, strict: 'ignore', output: 'htmlAndMathml' });
    } catch {
      /* cae al modo de respaldo */
    }
  }
  const safe = tex.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return displayMode
    ? `<div class="math-fallback">${safe}</div>`
    : `<code class="math-fallback">${safe}</code>`;
}
