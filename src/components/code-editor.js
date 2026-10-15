// Bloque de código editable: resaltado de sintaxis, edición, restablecer,
// copiar, descargar y, para Python, ejecución real en el navegador (Pyodide).
//
// Técnica: un <textarea> transparente superpuesto a un <pre> resaltado con
// la misma tipografía. Los cambios se guardan en el navegador por bloque.

import { h } from '../utils/dom.js';
import { inline } from '../utils/text.js';
import { runPython, getPythonVersion } from '../utils/python-runner.js';

const PREFIX = 'isq.code.';
const load = (key) => { try { return key ? localStorage.getItem(PREFIX + key) : null; } catch { return null; } };
const save = (key, value) => { try { if (key) localStorage.setItem(PREFIX + key, value); } catch { /* sin almacenamiento */ } };
const forget = (key) => { try { if (key) localStorage.removeItem(PREFIX + key); } catch { /* sin almacenamiento */ } };

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function highlight(code, lang) {
  const hljs = globalThis.hljs;
  if (hljs && lang && hljs.getLanguage?.(lang)) {
    try { return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value; } catch { /* sin resaltado */ }
  }
  return escapeHtml(code);
}

/**
 * Crea el editor. Opciones: code, lang, file, output, outputLabel, note, storageKey.
 */
export function createCodeEditor({ code, lang = 'python', file, output, outputLabel, note, storageKey }) {
  const original = code.replace(/\s+$/, '');
  let current = load(storageKey) ?? original;
  const runnable = lang === 'python';

  const highlighted = h('code', { class: lang ? `hljs language-${lang}` : 'hljs' });
  const pre = h('pre', { class: 'ce-highlight', 'aria-hidden': 'true' }, highlighted);
  const textarea = h('textarea', {
    class: 'ce-input', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', wrap: 'off',
    'aria-label': `Código editable${file ? ` (${file})` : ''}. Tab inserta espacios; Escape y después Tab para salir.${runnable ? ' Ctrl+Enter ejecuta.' : ''}`,
  });
  textarea.value = current;
  const area = h('div', { class: 'ce-area' }, pre, textarea);

  const badge = h('span', { class: 'ce-badge', hidden: true }, 'modificado');
  const status = h('span', { class: 'ce-status', 'aria-live': 'polite' });
  const resetBtn = h('button', { type: 'button', title: 'Volver al código original', onclick: () => reset() }, 'Restablecer');
  const copyBtn = h('button', { type: 'button', onclick: () => copy() }, 'Copiar');
  const downloadBtn = file ? h('button', { type: 'button', onclick: () => download() }, 'Descargar') : null;
  const runBtn = runnable ? h('button', { type: 'button', class: 'ce-run', onclick: () => run() }, '▶ Ejecutar') : null;

  const resultBox = h('div', { class: 'code-output ce-result', hidden: true });
  const expectedHead = h('div', { class: 'code-head' }, h('span', { class: 'ce-expected-label' }));
  const expectedBox = output != null ? h('div', { class: 'code-output' }, expectedHead, h('pre', {}, h('samp', {}, output.trim()))) : null;

  const el = h('div', { class: 'code-block ce' },
    h('div', { class: 'code-head' }, h('span', {}, file || lang || 'código'), badge, h('span', { class: 'spacer' }), status, runBtn, resetBtn, copyBtn, downloadBtn),
    area, resultBox, expectedBox,
    note ? h('p', { class: 'widget-caption', html: inline(note) }) : null);

  function refresh() {
    // El espacio final evita que el <pre> mida una línea menos que el textarea.
    highlighted.innerHTML = `${highlight(current, lang)}\n`;
    const modified = current !== original;
    badge.hidden = !modified;
    resetBtn.disabled = !modified;
    if (expectedBox) {
      expectedHead.firstChild.textContent = modified
        ? `${outputLabel || 'Salida esperada'} del código original (CPython 3.14)`
        : `${outputLabel || 'Salida esperada'} (CPython 3.14)`;
    }
    if (el.isConnected) size(); // ajuste inmediato (fuerza un cálculo de diseño, barato en bloques pequeños)
    requestAnimationFrame(size); // y otro cuando el bloque ya está en la página
  }

  function size() {
    // El textarea ocupa exactamente lo mismo que el código resaltado.
    textarea.style.height = '0px';
    textarea.style.width = '0px';
    const w = Math.max(pre.scrollWidth, area.clientWidth);
    const hgt = Math.max(pre.scrollHeight, textarea.scrollHeight);
    textarea.style.width = `${w}px`;
    textarea.style.height = `${hgt}px`;
    pre.style.minWidth = `${w}px`;
  }

  textarea.addEventListener('input', () => { current = textarea.value; save(storageKey, current); if (current === original) forget(storageKey); refresh(); });
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey && !textarea.dataset.escaped) {
      e.preventDefault();
      const { selectionStart: a, selectionEnd: b } = textarea;
      textarea.setRangeText('    ', a, b, 'end');
      textarea.dispatchEvent(new Event('input'));
    } else if (e.key === 'Escape') {
      textarea.dataset.escaped = '1'; // el siguiente Tab mueve el foco fuera del editor
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && runnable) {
      e.preventDefault();
      run();
    } else {
      delete textarea.dataset.escaped;
    }
  });
  textarea.addEventListener('blur', () => { delete textarea.dataset.escaped; });

  function reset() {
    current = original;
    textarea.value = original;
    forget(storageKey);
    resultBox.hidden = true;
    status.textContent = 'Código restablecido';
    setTimeout(() => { if (status.textContent === 'Código restablecido') status.textContent = ''; }, 1800);
    refresh();
  }

  async function copy() {
    try { await navigator.clipboard.writeText(current); copyBtn.textContent = 'Copiado'; } catch { copyBtn.textContent = 'No se pudo copiar'; }
    setTimeout(() => { copyBtn.textContent = 'Copiar'; }, 1600);
  }

  function download() {
    const url = URL.createObjectURL(new Blob([`${current}\n`], { type: 'text/plain' }));
    const a = h('a', { href: url, download: file });
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function run() {
    if (!runBtn || runBtn.disabled) return;
    runBtn.disabled = true;
    resultBox.hidden = false;
    resultBox.replaceChildren(h('div', { class: 'code-head' }, h('span', {}, 'Tu ejecución')), h('pre', { class: 'muted' }, '…'));
    try {
      const r = await runPython(current, {
        onStatus: (s) => { status.textContent = s === 'loading' ? 'Cargando Python en el navegador (solo la primera vez)…' : 'Ejecutando…'; },
      });
      status.textContent = '';
      const body = h('pre', {});
      if (r.stdout) body.append(h('samp', {}, r.stdout));
      if (r.stderr) body.append(h('samp', { class: 'ce-err' }, (r.stdout ? '\n' : '') + r.stderr));
      if (r.error) body.append(h('samp', { class: 'ce-err' }, (r.stdout || r.stderr ? '\n' : '') + r.error));
      if (!r.stdout && !r.stderr && !r.error) body.append(h('samp', { class: 'muted' }, '(el programa no imprimió nada)'));
      resultBox.replaceChildren(
        h('div', { class: 'code-head' }, h('span', {}, `Tu ejecución · Python ${r.version} en el navegador · ${Math.max(1, Math.round(r.ms))} ms`)),
        body);
    } catch (err) {
      status.textContent = '';
      resultBox.replaceChildren(h('div', { class: 'code-head' }, h('span', {}, 'Tu ejecución')),
        h('pre', {}, h('samp', { class: 'ce-err' }, err.message || String(err))),
        h('p', { class: 'widget-caption' }, getPythonVersion() ? 'Pulsa «Ejecutar» para volver a intentarlo.' : 'No se pudo cargar Python en el navegador. Comprueba la conexión a internet o ejecuta el código en tu equipo con python3.'));
    } finally {
      runBtn.disabled = false;
    }
  }

  refresh();
  // Recalcula el tamaño cuando el bloque se hace visible o cambia de anchura.
  if ('ResizeObserver' in window) new ResizeObserver(() => size()).observe(area);
  return el;
}
