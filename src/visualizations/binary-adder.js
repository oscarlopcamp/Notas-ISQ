// Sumador binario paso a paso: columna a columna, con acarreos visibles,
// interpretación sin signo o en complemento a dos y detección de desbordamiento.

import { h, clear } from '../utils/dom.js';
import { addBits, interpret, range } from '../utils/numbers.js';
import { toBinary } from '../utils/encoding.js';

const PRESETS = {
  4: [
    ['6 + 7', 0b0110, 0b0111, 'unsigned'],
    ['12 + 5', 0b1100, 0b0101, 'unsigned'],
    ['7 + 1', 0b0111, 0b0001, 'signed'],
    ['−5 + 6', 0b1011, 0b0110, 'signed'],
  ],
  8: [
    ['72 + 32', 0b01001000, 0b00100000, 'unsigned'],
    ['200 + 100', 200, 100, 'unsigned'],
    ['127 + 1', 0b01111111, 0b00000001, 'signed'],
    ['−20 + 5', 0b11101100, 0b00000101, 'signed'],
  ],
};

export function mount(root, { bits = 4, a = 0b0110, b = 0b0111, mode = 'unsigned' } = {}) {
  let n = bits, A = a, B = b, interp = mode, step = 0;

  const widthChips = [4, 8].map((w) => h('button', { type: 'button', class: 'chip', onclick: () => setWidth(w) }, `${w} bits`));
  const modeChips = [['unsigned', 'Sin signo'], ['signed', 'Complemento a dos']].map(([id, label]) =>
    h('button', { type: 'button', class: 'chip', onclick: () => { interp = id; render(); } }, label));
  const presetBox = h('span', { class: 'chip-group wrap' });
  const grid = h('div', { class: 'adder-grid', role: 'table', 'aria-label': 'Suma en columnas' });
  const explain = h('p', { class: 'adder-explain', 'aria-live': 'polite' });
  const verdict = h('div', { class: 'adder-verdict', 'aria-live': 'polite' });
  const nextBtn = h('button', { type: 'button', class: 'btn primary', onclick: () => { step = Math.min(n, step + 1); render(); } }, 'Siguiente columna →');
  const allBtn = h('button', { type: 'button', class: 'btn', onclick: () => { step = n; render(); } }, 'Resolver todo');
  const resetBtn = h('button', { type: 'button', class: 'btn', onclick: () => { step = 0; render(); } }, 'Reiniciar');

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Ancho'), widthChips,
      h('span', { class: 'widget-label' }, 'Interpretación'), modeChips),
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Ejemplos'), presetBox),
    h('p', { class: 'muted small' }, 'Pulsa los bits de A y B para cambiarlos. Después resuelve la suma columna a columna, de derecha a izquierda, como en la escuela.'),
    grid,
    h('div', { class: 'btn-row' }, nextBtn, allBtn, resetBtn),
    explain,
    verdict,
  );

  function setWidth(w) {
    if (w === n) return;
    const [, pa, pb, pm] = PRESETS[w][0];
    n = w; A = pa; B = pb; interp = pm; step = 0;
    render();
  }

  function cell(content, cls = '', attrs = {}) {
    return h('div', { role: 'cell', class: `adder-cell ${cls}`, ...attrs }, content);
  }

  function operandRow(label, value, set) {
    const row = h('div', { role: 'row', class: 'adder-row' }, cell(label, 'adder-label'), cell('', 'adder-carryout'));
    for (let i = n - 1; i >= 0; i -= 1) {
      const bit = (value >> i) & 1;
      row.append(cell(h('button', {
        type: 'button', class: `adder-bit${bit ? ' on' : ''}`, 'aria-pressed': String(Boolean(bit)),
        'aria-label': `${label}, bit de peso 2 a la ${i}: ${bit}`,
        onclick: () => { set(value ^ (1 << i)); step = 0; render(); },
      }, bit), i === step && step < n ? 'col-current' : ''));
    }
    row.append(cell(h('span', { class: 'adder-dec' }, `= ${interpret(value, n, interp)}`), 'adder-decimal'));
    return row;
  }

  function render() {
    widthChips.forEach((c, i) => c.setAttribute('aria-pressed', String([4, 8][i] === n)));
    modeChips.forEach((c, i) => c.setAttribute('aria-pressed', String(['unsigned', 'signed'][i] === interp)));
    clear(presetBox);
    PRESETS[n].forEach(([label, pa, pb, pm]) => presetBox.append(h('button', {
      type: 'button', class: 'chip', onclick: () => { A = pa; B = pb; interp = pm; step = 0; render(); },
    }, label)));

    const res = addBits(A, B, n);
    clear(grid);
    grid.style.setProperty('--cols', String(n));

    // Fila de pesos
    const weights = h('div', { role: 'row', class: 'adder-row adder-weights' }, cell('Peso', 'adder-label'), cell('', 'adder-carryout'));
    for (let i = n - 1; i >= 0; i -= 1) {
      const w = interp === 'signed' && i === n - 1 ? `−${2 ** i}` : String(2 ** i);
      weights.append(cell(w, i === step && step < n ? 'col-current' : ''));
    }
    weights.append(cell('', 'adder-decimal'));

    // Fila de acarreos (el acarreo que entra en la columna i se conoce tras procesar i−1)
    const carries = h('div', { role: 'row', class: 'adder-row adder-carries' }, cell('Acarreo', 'adder-label'),
      cell(step >= n ? String(res.carryOut) : '', `adder-carryout${step >= n && res.carryOut ? ' hot' : ''}`));
    for (let i = n - 1; i >= 0; i -= 1) {
      const known = i > 0 && i <= step;
      carries.append(cell(known ? String(res.carries[i]) : '', `${known && res.carries[i] ? 'hot' : ''} ${i === step && step < n ? 'col-current' : ''}`));
    }
    carries.append(cell('', 'adder-decimal'));

    // Resultado
    const result = h('div', { role: 'row', class: 'adder-row adder-result' }, cell('A + B', 'adder-label'), cell('', 'adder-carryout'));
    for (let i = n - 1; i >= 0; i -= 1) {
      result.append(cell(i < step ? String(res.sumBits[i]) : '', `adder-sum ${i === step && step < n ? 'col-current' : ''}`));
    }
    result.append(cell(step >= n ? h('span', { class: 'adder-dec' }, `= ${interpret(res.result, n, interp)}`) : '', 'adder-decimal'));

    grid.append(weights, carries, operandRow('A', A, (v) => { A = v; }), operandRow('B', B, (v) => { B = v; }), result);

    // Explicación de la última columna procesada
    if (step === 0) {
      explain.textContent = `Empieza por la columna de la derecha (peso 1). En cada columna se suman tres bits: el de A, el de B y el acarreo que llega.`;
    } else if (step <= n) {
      const i = step - 1;
      const ai = (A >> i) & 1, bi = (B >> i) & 1, ci = res.carries[i];
      const total = ai + bi + ci;
      explain.innerHTML = `<b>Columna de peso ${interp === 'signed' && i === n - 1 ? `−${2 ** i}` : 2 ** i}:</b> ${ai} + ${bi} + ${ci} (acarreo) = ${total}`
        + ` → se escribe <b>${total % 2}</b> y se lleva <b>${total >> 1}</b>.`
        + (total >= 2 ? ` (En binario, ${total} es «${total.toString(2)}».)` : '');
    }
    nextBtn.disabled = step >= n;

    clear(verdict);
    if (step >= n) {
      const va = interpret(A, n, interp), vb = interpret(B, n, interp), vr = interpret(res.result, n, interp);
      const real = va + vb;
      const [lo, hi] = range(n, interp);
      const overflow = interp === 'unsigned' ? res.unsignedOverflow : res.signedOverflow;
      verdict.className = `adder-verdict ${overflow ? 'bad' : 'ok'}`;
      verdict.append(h('p', {}, h('b', {}, `${toBinary(A, n)} + ${toBinary(B, n)} = ${toBinary(res.result, n)}`),
        `  →  ${va} + ${vb} = ${vr}`));
      if (!overflow) {
        verdict.append(h('p', {}, `Correcto: ${real} cabe en el rango ${lo}…${hi}.`
          + (interp === 'signed' && res.carryOut ? ' Hubo acarreo final, pero en complemento a dos se descarta sin error: lo que importa es la regla del signo.' : '')));
      } else if (interp === 'unsigned') {
        verdict.append(h('p', {}, `Desbordamiento: el resultado real es ${real}, que no cabe en ${n} bits (máximo ${hi}). El acarreo final se pierde y queda ${real} − ${2 ** n} = ${vr}.`));
      } else {
        verdict.append(h('p', {}, `Desbordamiento con signo: ${va} + ${vb} = ${real} se sale del rango ${lo}…${hi}. Se detecta porque el acarreo que entra en el bit de signo (${res.carries[n - 1]}) es distinto del que sale (${res.carryOut}): dos sumandos del mismo signo han dado un resultado de signo contrario.`));
      }
    }
  }

  render();
}
