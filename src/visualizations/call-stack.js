// La pila de llamadas de factorial(n), paso a paso.

import { h, clear } from '../utils/dom.js';

function events(n) {
  const ev = [];
  const fact = (k, depth) => {
    ev.push({ type: 'call', k, depth });
    if (k <= 1) { ev.push({ type: 'return', k, depth, value: 1 }); return 1; }
    const sub = fact(k - 1, depth + 1);
    const value = k * sub;
    ev.push({ type: 'return', k, depth, value, sub });
    return value;
  };
  fact(n, 0);
  return ev;
}

export function mount(root, { n = 4 } = {}) {
  let N = n, step = 0, timer = null;
  const nSel = h('select', { 'aria-label': 'Valor de n', onchange: (e) => { N = Number(e.target.value); step = 0; render(); } },
    [1, 2, 3, 4, 5, 6].map((v) => h('option', { value: String(v), selected: v === N }, `factorial(${v})`)));
  const stackView = h('div', { class: 'cs-stack', 'aria-live': 'polite' });
  const text = h('p', { class: 'small' });
  const code = h('pre', { class: 'cs-code mono' }, 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)');
  const playBtn = h('button', { type: 'button', class: 'btn', onclick: () => toggle() }, '▶ Reproducir');

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Llamada'), nSel),
    h('div', { class: 'cs-layout' }, code, h('div', {}, stackView, text)),
    h('div', { class: 'btn-row' },
      h('button', { type: 'button', class: 'btn primary', onclick: () => { stop(); step += 1; render(); } }, 'Siguiente paso'),
      playBtn, h('button', { type: 'button', class: 'btn', onclick: () => { stop(); step = 0; render(); } }, 'Reiniciar')),
  );

  function stop() { if (timer) { clearInterval(timer); timer = null; playBtn.textContent = '▶ Reproducir'; } }
  function toggle() {
    if (timer) { stop(); return; }
    const total = events(N).length;
    if (step >= total) step = 0;
    playBtn.textContent = '⏸ Pausa';
    timer = setInterval(() => { step += 1; render(); if (step >= total) stop(); }, 700);
  }

  function render() {
    const ev = events(N);
    step = Math.min(step, ev.length);
    // Reconstruye la pila tras `step` eventos
    const frames = [];
    let last = null;
    ev.slice(0, step).forEach((e) => {
      if (e.type === 'call') frames.push({ k: e.k, waiting: e.k > 1 });
      else { frames.pop(); if (frames.length) frames[frames.length - 1].got = e.value; }
      last = e;
    });
    clear(stackView);
    stackView.append(h('div', { class: 'widget-label' }, `Pila de llamadas (${frames.length} marco${frames.length === 1 ? '' : 's'})`));
    if (!frames.length) stackView.append(h('div', { class: 'muted small cs-empty' }, step === 0 ? 'Aún no se ha llamado a la función.' : `La pila vuelve a estar vacía. Resultado: ${ev[ev.length - 1].value}.`));
    [...frames].reverse().forEach((f, i) => stackView.append(h('div', { class: `cs-frame ${i === 0 ? 'top' : ''}` },
      h('span', { class: 'mono' }, `factorial(${f.k})`),
      h('span', { class: 'small' }, f.k <= 1 ? 'caso base' : f.got !== undefined ? `calcula ${f.k} × ${f.got}` : `espera a factorial(${f.k - 1})`))));
    text.textContent = !last
      ? 'Cada llamada crea un marco en la pila con sus propias variables (aquí, n). Pulsa «Siguiente paso».'
      : last.type === 'call'
        ? `Se llama a factorial(${last.k}): se apila un marco nuevo${last.k <= 1 ? '. Es el caso base: devolverá 1 sin llamar a nadie más.' : `. Para terminar necesita factorial(${last.k - 1}), así que queda esperando.`}`
        : `factorial(${last.k}) devuelve ${last.value}${last.sub !== undefined ? ` (= ${last.k} × ${last.sub})` : ''} y su marco se desapila.`;
  }

  render();
  return stop;
}
