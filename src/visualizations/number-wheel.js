// Rueda de números de ancho fijo: los 2^n patrones forman un círculo.
// Sumar 1 al patrón avanza un paso en sentido horario; tras el último patrón
// se vuelve al primero. Cambiar la interpretación muestra por qué el
// complemento a dos es la elección natural para los enteros con signo.

import { h, svg, clear } from '../utils/dom.js';
import { interpret, range } from '../utils/numbers.js';
import { toBinary } from '../utils/encoding.js';

const MODES = [
  ['unsigned', 'Sin signo'],
  ['sign-magnitude', 'Signo y magnitud'],
  ['signed', 'Complemento a dos'],
];

export function mount(root, { bits = 4, mode = 'unsigned', start = 0 } = {}) {
  const n = bits;
  const size = 2 ** n;
  let current = start;
  let interp = mode;
  let message = 'Pulsa «+1» o «−1» para recorrer la rueda. Cada paso suma o resta 1 al patrón de bits.';
  let lastJump = null;

  const modeButtons = MODES.map(([id, label]) => h('button', {
    type: 'button', class: 'chip', 'aria-pressed': String(id === interp),
    onclick: () => { interp = id; message = describeMode(); lastJump = null; render(); },
  }, label));
  const stepInput = h('input', { type: 'number', value: '3', min: '1', max: String(size - 1), class: 'wheel-step', 'aria-label': 'Cantidad a sumar' });

  const figure = svg('svg', { viewBox: '0 0 420 420', class: 'wheel-svg', role: 'img' });
  const status = h('div', { class: 'wheel-status', 'aria-live': 'polite' });
  const rangeLine = h('p', { class: 'widget-stats' });

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Interpretación'), modeButtons),
    h('div', { class: 'wheel-layout' },
      figure,
      h('div', { class: 'wheel-side' },
        status,
        h('div', { class: 'btn-row' },
          h('button', { type: 'button', class: 'btn', onclick: () => move(-1) }, '−1'),
          h('button', { type: 'button', class: 'btn primary', onclick: () => move(1) }, '+1'),
          h('span', { class: 'wheel-plus' },
            h('button', { type: 'button', class: 'btn', onclick: () => move(Number(stepInput.value) || 0) }, '+'),
            stepInput)),
        rangeLine)),
  );

  function describeMode() {
    const [lo, hi] = range(n, interp);
    if (interp === 'unsigned') return `Sin signo: los ${size} patrones representan 0…${hi}. El salto está entre ${'1'.repeat(n)} y ${'0'.repeat(n)}.`;
    if (interp === 'sign-magnitude') return `Signo y magnitud: el primer bit es el signo y el resto, el valor absoluto. Fíjate en que hay dos ceros (${'0'.repeat(n)} y 1${'0'.repeat(n - 1)}) y en hacia dónde avanza «+1» en la mitad negativa.`;
    return `Complemento a dos: la mitad superior de la rueda son los negativos. ${'1'.repeat(n)} es −1 porque al sumarle 1 se llega a ${'0'.repeat(n)}. Rango: ${lo}…${hi}.`;
  }

  function move(delta) {
    const before = current;
    current = (((current + delta) % size) + size) % size;
    const vb = interpret(before, n, interp);
    const va = interpret(current, n, interp);
    const expected = vb + delta;
    const ok = va === expected;
    const pb = toBinary(before, n), pa = toBinary(current, n);
    const op = delta >= 0 ? `+ ${delta}` : `− ${-delta}`;
    if (ok) {
      message = `${pb} ${op} → ${pa}:  ${vb} ${op} = ${va}. ✓`;
      lastJump = null;
    } else if (expected >= range(n, interp)[0] && expected <= range(n, interp)[1]) {
      // El resultado correcto cabía en el rango: el fallo es del formato (solo ocurre en signo y magnitud).
      message = `${pb} ${op} → ${pa}: el patrón avanzó, pero el valor pasó de ${vb} a ${va} en lugar de ${expected}. En signo y magnitud, la suma ordinaria de patrones no funciona con negativos.`;
      lastJump = 'bad';
    } else {
      message = `${pb} ${op} → ${pa}: ${vb} ${op} debería dar ${expected}, pero se obtiene ${va}. El resultado no cabe en ${n} bits: es un desbordamiento y la rueda «da la vuelta».`;
      lastJump = 'overflow';
    }
    render();
  }

  function render() {
    modeButtons.forEach((b, i) => b.setAttribute('aria-pressed', String(MODES[i][0] === interp)));
    clear(figure);
    const cx = 210, cy = 210, rOuter = 172, rDot = 132, rValue = 100;
    figure.setAttribute('aria-label', `Rueda de ${size} patrones de ${n} bits; patrón actual ${toBinary(current, n)}, valor ${interpret(current, n, interp)}`);
    figure.append(svg('circle', { cx, cy, r: rDot, class: 'wheel-ring' }));

    // Marca dónde se produce el salto de valor (desbordamiento) en esta interpretación.
    const jumpAfter = interp === 'unsigned' ? size - 1 : size / 2 - 1;
    const jumpAngle = ((jumpAfter + 0.5) / size) * 2 * Math.PI - Math.PI / 2;
    figure.append(svg('line', {
      x1: cx + (rDot - 26) * Math.cos(jumpAngle), y1: cy + (rDot - 26) * Math.sin(jumpAngle),
      x2: cx + (rDot + 26) * Math.cos(jumpAngle), y2: cy + (rDot + 26) * Math.sin(jumpAngle),
      class: 'wheel-jump',
    }));

    for (let k = 0; k < size; k += 1) {
      const angle = (k / size) * 2 * Math.PI - Math.PI / 2;
      const isCur = k === current;
      const value = interpret(k, n, interp);
      const negative = value < 0 || (interp === 'sign-magnitude' && k >= size / 2);
      const g = svg('g', { class: `wheel-slot${isCur ? ' current' : ''}${negative ? ' negative' : ''}`, tabindex: '-1' });
      g.append(
        svg('circle', { cx: cx + rDot * Math.cos(angle), cy: cy + rDot * Math.sin(angle), r: isCur ? 15 : 9 }),
        svg('text', { x: cx + rOuter * Math.cos(angle), y: cy + rOuter * Math.sin(angle) + 4, 'text-anchor': 'middle', class: 'wheel-pattern' }, toBinary(k, n)),
        svg('text', { x: cx + rValue * Math.cos(angle), y: cy + rValue * Math.sin(angle) + 5, 'text-anchor': 'middle', class: 'wheel-value' },
          interp === 'sign-magnitude' && k === size / 2 ? '−0' : String(value)),
      );
      g.addEventListener('click', () => { current = k; message = `Patrón ${toBinary(k, n)} = ${interp === 'sign-magnitude' && k === size / 2 ? '−0' : value}.`; lastJump = null; render(); });
      figure.append(g);
    }
    figure.append(
      svg('text', { x: cx, y: cy - 8, 'text-anchor': 'middle', class: 'wheel-center-pattern' }, toBinary(current, n)),
      svg('text', { x: cx, y: cy + 22, 'text-anchor': 'middle', class: 'wheel-center-value' },
        interp === 'sign-magnitude' && current === size / 2 ? '−0' : String(interpret(current, n, interp))),
    );

    status.className = `wheel-status${lastJump ? ` ${lastJump}` : ''}`;
    status.textContent = message;
    const [lo, hi] = range(n, interp);
    rangeLine.innerHTML = `Rango con ${n} bits: <b>${lo} … ${hi}</b>. La línea roja marca dónde el valor «salta» al dar la vuelta.`;
  }

  message = describeMode();
  render();
}
