// Constructor de amplitudes: elige a y b, comprueba si sus cuadrados suman 1,
// normaliza y observa que el signo no cambia las probabilidades.

import { h, clear } from '../utils/dom.js';
import { norm2, isNormalized, normalize, ketText } from '../utils/qubit.js';

const CHALLENGES = [
  { text: 'Que salga 1 el 25 % de las veces', check: (a, b) => Math.abs(b * b - 0.25) < 0.01 },
  { text: 'Mitad y mitad, con la amplitud del 1 negativa', check: (a, b) => Math.abs(a * a - 0.5) < 0.01 && b < 0 },
  { text: 'Que salga 0 el 90 % de las veces', check: (a, b) => Math.abs(a * a - 0.9) < 0.01 },
];
const pct = (p) => `${(p * 100).toLocaleString('es', { maximumFractionDigits: 1 })} %`;
const num = (x) => x.toFixed(2).replace('-', '−');

export function mount(root) {
  let a = 0.6, b = 0.8;
  const solved = new Set();
  const slider = (label, get, set) => h('input', { type: 'range', min: '-1', max: '1', step: '0.01', 'aria-label': label, oninput: (e) => { set(Number(e.target.value)); render(); } });
  const aIn = slider('Amplitud del 0', () => a, (v) => { a = v; });
  const bIn = slider('Amplitud del 1', () => b, (v) => { b = v; });
  const aOut = h('output', { class: 'mono' }), bOut = h('output', { class: 'mono' });
  const ket = h('p', { class: 'ab-ket mono' });
  const sum = h('p', { class: 'ab-sum', 'aria-live': 'polite' });
  const bars = h('div', { class: 'ab-bars' });
  const normBtn = h('button', { type: 'button', class: 'btn primary', onclick: () => { try { [a, b] = normalize(a, b); } catch { /* ambas a 0 */ } render(); } }, 'Normalizar');
  const signBtn = h('button', { type: 'button', class: 'btn', onclick: () => { b = -b; render(); } }, 'Cambiar el signo de b');
  const chal = h('ul', { class: 'ab-challenges' });

  root.append(
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'a (amplitud del 0)', aIn), aOut),
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'b (amplitud del 1)', bIn), bOut),
    ket, sum, bars,
    h('div', { class: 'btn-row' }, normBtn, signBtn),
    h('p', { class: 'te-quiz-title' }, 'Retos (el estado debe ser válido):'), chal,
  );

  function render() {
    aIn.value = String(a); bIn.value = String(b);
    aOut.textContent = num(a); bOut.textContent = num(b);
    ket.textContent = `Estado: ${ketText(a, b, 2)}   ·   lista: [${num(a)}, ${num(b)}]`;
    const n = norm2(a, b), ok = isNormalized(a, b, 0.005);
    sum.className = `ab-sum ${ok ? 'ok' : 'bad'}`;
    sum.textContent = ok
      ? `a² + b² = ${num(n)}: es un estado válido.`
      : `a² + b² = ${num(n)}: no es un estado válido. Las probabilidades sumarían ${pct(n)}. Pulsa «Normalizar».`;
    clear(bars);
    [['0', a * a], ['1', b * b]].forEach(([k, p]) => bars.append(h('div', { class: 'ql-bar' },
      h('span', {}, k), h('div', { class: 'ql-track' }, h('i', { style: { width: `${Math.min(1, p) * 100}%` } })), h('b', {}, pct(p)))));
    clear(chal);
    CHALLENGES.forEach((c, k) => {
      if (ok && c.check(a, b)) solved.add(k);
      chal.append(h('li', { class: solved.has(k) ? 'ok' : '' }, `${solved.has(k) ? '✓' : '○'} ${c.text}`));
    });
  }
  render();
}
