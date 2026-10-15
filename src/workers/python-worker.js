// Worker que ejecuta Python real en el navegador con Pyodide (CPython compilado
// a WebAssembly). Se ejecuta en un hilo aparte: si un programa entra en un bucle
// infinito, la página sigue respondiendo y el worker se puede detener.

/* global importScripts, loadPyodide */
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';
importScripts(`${PYODIDE_URL}pyodide.js`);

const ready = loadPyodide({ indexURL: PYODIDE_URL }).then((py) => {
  const version = py.runPython('import sys; sys.version.split()[0]');
  self.postMessage({ type: 'ready', version });
  return py;
}).catch((err) => {
  self.postMessage({ type: 'load-error', error: String(err && err.message || err) });
  throw err;
});

// Quita del traceback los marcos internos de Pyodide y deja los del programa.
function cleanTraceback(message) {
  const lines = String(message).split('\n');
  const first = lines.findIndex((l) => l.includes('File "<exec>"'));
  if (first < 0) return message.trim();
  return [lines[0], ...lines.slice(first)].join('\n').trim();
}

self.onmessage = async (event) => {
  const { id, code } = event.data;
  const py = await ready;
  const out = [];
  py.setStdout({ batched: (text) => out.push({ stream: 'out', text }) });
  py.setStderr({ batched: (text) => out.push({ stream: 'err', text }) });
  const namespace = py.globals.get('dict')();
  const t0 = performance.now();
  try {
    await py.runPythonAsync(code, { globals: namespace });
    self.postMessage({ type: 'result', id, ok: true, out, ms: performance.now() - t0 });
  } catch (err) {
    self.postMessage({ type: 'result', id, ok: false, out, error: cleanTraceback(err.message), ms: performance.now() - t0 });
  } finally {
    namespace.destroy();
  }
};
