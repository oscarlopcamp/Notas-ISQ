// Laboratorio de complemento a dos: negar un número invirtiendo los bits y
// sumando 1, con comprobación mediante el peso negativo del bit de signo.

import { h, clear } from '../utils/dom.js';
import { negateSteps, range } from '../utils/numbers.js';
import { toBinary } from '../utils/encoding.js';
import { renderMath } from '../utils/math.js';

export function mount(root, { bits = 8, value = 5 } = {}) {
  const n = bits;
  const [lo, hi] = range(n, 'signed');
  let x = value;

  const input = h('input', {
    type: 'number', min: String(lo), max: String(hi), value: String(x), class: 'tc-input', 'aria-label': 'Número entero',
    oninput: (e) => {
      const v = Number(e.target.value);
      if (Number.isInteger(v) && v >= lo && v <= hi) { x = v; render(); }
    },
  });
  const slider = h('input', { type: 'range', min: String(lo), max: String(hi), value: String(x), 'aria-label': 'Número entero', oninput: (e) => { x = Number(e.target.value); input.value = String(x); render(); } });
  const out = h('div', { class: 'tc-steps' });

  root.append(
    h('div', { class: 'widget-controls' },
      h('label', { class: 'widget-label' }, `Número (${String(lo).replace('-', '−')} … ${hi})`, input), slider,
      [5, -5, 1, 0, 127, -128].map((v) => h('button', { type: 'button', class: 'chip', onclick: () => { x = v; input.value = String(v); slider.value = String(v); render(); } }, String(v)))),
    out,
  );

  const bitsRow = (pattern, highlight = () => '') => h('span', { class: 'tc-bits mono' },
    Array.from(toBinary(pattern, n)).map((b, i) => h('span', { class: `tc-bit ${b === '1' ? 'b1' : 'b0'} ${highlight(i)}` }, b)));

  function render() {
    slider.value = String(x);
    const s = negateSteps(x, n);
    const weights = Array.from({ length: n }, (_, i) => n - 1 - i);
    const terms = weights.filter((w, i) => toBinary(s.result, n)[i] === '1').map((w) => (w === n - 1 ? `-${2 ** w}` : `${2 ** w}`));
    clear(out);
    out.append(
      h('div', { class: 'tc-step' }, h('span', { class: 'tc-num' }, '1'),
        h('div', {}, h('div', { class: 'tc-title' }, `Patrón de ${x}`), bitsRow(s.pattern),
          h('div', { class: 'muted small' }, x < 0 ? `(${x} ya es negativo: su patrón tiene el bit de signo a 1)` : 'Un número no negativo se escribe igual que sin signo, con el primer bit a 0.'))),
      h('div', { class: 'tc-step' }, h('span', { class: 'tc-num' }, '2'),
        h('div', {}, h('div', { class: 'tc-title' }, 'Invertir todos los bits (0 ↔ 1)'), bitsRow(s.inverted, () => 'flipped'))),
      h('div', { class: 'tc-step' }, h('span', { class: 'tc-num' }, '3'),
        h('div', {}, h('div', { class: 'tc-title' }, 'Sumar 1'), bitsRow(s.result),
          s.inverted === 2 ** n - 1 ? h('div', { class: 'muted small' }, `${'1'.repeat(n)} + 1 = 1${'0'.repeat(n)}: el acarreo final se descarta y quedan ${n} ceros.`) : null)),
      h('div', { class: 'tc-step' }, h('span', { class: 'tc-num' }, '✓'),
        h('div', {},
          h('div', { class: 'tc-title' }, 'Comprobación con los pesos (el bit de signo pesa ', h('span', { html: renderMath(`-2^{${n - 1}} = -${2 ** (n - 1)}`) }), ')'),
          h('div', { html: renderMath(`${toBinary(s.result, n)} \\;\\to\\; ${terms.length ? terms.join(' + ').replace(/\+ -/g, '- ') : '0'} = ${s.resultValue}`) }),
          s.wraps
            ? h('p', { class: 'tc-warn' }, `Caso especial: −(${String(x).replace('-', '−')}) = ${-x} no cabe en ${n} bits con signo (el máximo es ${hi}). La negación devuelve el mismo patrón: el rango del complemento a dos es asimétrico.`)
            : h('p', { class: 'tc-ok' }, `−(${String(x).replace('-', '−')}) = ${String(s.resultValue).replace('-', '−')}  ✓`))),
    );
  }

  render();
}

