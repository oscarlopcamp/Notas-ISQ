// Explorador de bits: valor posicional y número de patrones posibles con n bits.

import { h, clear } from '../utils/dom.js';
import { renderMath } from '../utils/math.js';

export function mount(root, { bits = 4, max = 8, initial } = {}) {
  let n = bits;
  let values = initial ? Array.from(initial, Number) : Array(n).fill(0);

  const select = h('select', { 'aria-label': 'Número de bits', onchange: (e) => setN(Number(e.target.value)) },
    Array.from({ length: max }, (_, i) => h('option', { value: String(i + 1), selected: i + 1 === n }, `${i + 1} ${i ? 'bits' : 'bit'}`)));
  const row = h('div', { class: 'bits-row', role: 'group', 'aria-label': 'Bits (pulsa para cambiar)' });
  const value = h('div', { class: 'bits-value' });
  const combos = h('div', { class: 'bits-combos' });

  root.append(
    h('div', { class: 'widget-controls' },
      h('span', { class: 'widget-label' }, 'Cantidad'), select,
      h('button', { type: 'button', class: 'chip', onclick: () => { values = values.map(() => 0); render(); } }, 'Todo a 0'),
      h('button', { type: 'button', class: 'chip', onclick: () => increment() }, '+1 (contar)'),
    ),
    row, value, combos,
  );

  function setN(next) {
    values = Array.from({ length: next }, (_, i) => values[values.length - next + i] ?? 0);
    n = next;
    render();
  }

  function increment() {
    const total = values.reduce((acc, b) => acc * 2 + b, 0);
    const next = (total + 1) % 2 ** n;
    values = next.toString(2).padStart(n, '0').split('').map(Number);
    render();
  }

  function render() {
    clear(row);
    values.forEach((b, i) => {
      const power = n - 1 - i;
      row.append(h('button', {
        type: 'button', class: `bit-cell${b ? ' on' : ''}`, 'aria-pressed': String(Boolean(b)),
        'aria-label': `Bit de peso 2 elevado a ${power}, valor ${b}`,
        onclick: () => { values[i] = 1 - values[i]; render(); },
      },
        h('span', { class: 'bit-digit' }, b),
        h('span', { class: 'bit-weight', html: renderMath(`2^{${power}}=${2 ** power}`) })));
    });

    const total = values.reduce((acc, b) => acc * 2 + b, 0);
    const terms = values.map((b, i) => (b ? 2 ** (n - 1 - i) : null)).filter((x) => x !== null);
    value.innerHTML = `<span class="mono">${values.join('')}</span><sub>2</sub> = `
      + (terms.length ? renderMath(`${terms.join(' + ')} = ${total}`) : renderMath('0'));

    clear(combos);
    combos.append(h('p', { html: `Con ${n} ${n === 1 ? 'bit' : 'bits'} hay ${renderMath(`2^{${n}} = ${2 ** n}`)} patrones distintos. El patrón actual es el número ${total} de esa lista (contando desde 0).` }));
    if (n <= 4) {
      const grid = h('div', { class: 'bits-all mono', 'aria-label': `Los ${2 ** n} patrones posibles` });
      for (let k = 0; k < 2 ** n; k += 1) {
        grid.append(h('span', { class: k === total ? 'current' : '' }, k.toString(2).padStart(n, '0')));
      }
      combos.append(grid);
    } else {
      combos.append(h('p', { class: 'muted small' }, 'Con más de 4 bits la lista completa es demasiado larga para mostrarla; observa cómo se duplica con cada bit añadido.'));
    }
  }

  render();
}
