// Ejecución de Python en el navegador mediante un worker con Pyodide.
// El worker se crea la primera vez que se ejecuta código (descarga de unos
// 10 MB que el navegador guarda en caché) y se reinicia si un programa
// supera el tiempo máximo.

let worker = null;
let readyPromise = null;
let pythonVersion = null;
let seq = 0;
const pending = new Map();

function start() {
  worker = new Worker(new URL('../workers/python-worker.js', import.meta.url));
  readyPromise = new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === 'ready') { pythonVersion = msg.version; resolve(msg.version); }
      else if (msg.type === 'load-error') reject(new Error(msg.error));
      else if (msg.type === 'result') {
        const p = pending.get(msg.id);
        if (p) { pending.delete(msg.id); clearTimeout(p.timer); p.resolve(msg); }
      }
    };
    worker.onerror = (e) => reject(new Error(e.message || 'No se pudo iniciar Python en el navegador.'));
  });
}

function stop() {
  if (worker) worker.terminate();
  worker = null;
  readyPromise = null;
  pending.forEach((p) => { clearTimeout(p.timer); p.reject(new Error('Ejecución interrumpida.')); });
  pending.clear();
}

export const isLoaded = () => pythonVersion !== null && worker !== null;
export const getPythonVersion = () => pythonVersion;

/**
 * Ejecuta `code` y devuelve { ok, stdout, stderr, error, ms, version }.
 * onStatus('loading') se llama si hay que descargar Python primero.
 */
export async function runPython(code, { timeout = 20000, onStatus = () => {} } = {}) {
  if (!worker) start();
  if (!pythonVersion) onStatus('loading');
  try {
    await readyPromise;
  } catch (err) {
    stop(); // permite reintentar (p. ej., si no había conexión)
    throw err;
  }
  onStatus('running');
  const id = ++seq;
  const result = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      stop(); // el único modo fiable de detener un bucle infinito
      reject(new Error(`El programa tardó más de ${timeout / 1000} s y se detuvo. ¿Hay un bucle infinito?`));
    }, timeout);
    pending.set(id, { resolve, reject, timer });
    worker.postMessage({ id, code });
  });
  const join = (stream) => result.out.filter((o) => o.stream === stream).map((o) => o.text).join('\n');
  return { ok: result.ok, stdout: join('out'), stderr: join('err'), error: result.error || null, ms: result.ms, version: pythonVersion };
}
