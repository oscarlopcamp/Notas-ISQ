// La explosión del espacio de estados: cuánta memoria necesita guardar el
// estado completo de n qubits (o de n sistemas de dos niveles) en una computadora clásica.

import { h, clear } from '../utils/dom.js';
import { statevectorBytes, formatBytes } from '../utils/advantage.js';

// Escalas de referencia aproximadas (órdenes de magnitud, no equipos concretos).
const REFS = [
  { label: 'un portátil (≈ 16 GiB de RAM)', bytes: 16 * 2 ** 30 },
  { label: 'un servidor grande (≈ 1 TiB)', bytes: 2 ** 40 },
  { label: 'un gran superordenador (del orden de petabytes)', bytes: 10 * 2 ** 50 },
];

export function mount(root, { n = 20 } = {}) {
  let N = n;
  const out = h('output', { class: 'mono' }, String(N));
  const slider = h('input', { type: 'range', min: '1', max: '80', value: String(N), 'aria-label': 'Número de qubits', oninput: (e) => { N = Number(e.target.value); out.textContent = String(N); render(); } });
  const big = h('div', { class: 'ss-big' });
  const refs = h('ul', { class: 'ss-refs' });

  root.append(
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'Qubits', slider), out,
      [10, 30, 40, 50, 60].map((v) => h('button', { type: 'button', class: 'chip', onclick: () => { N = v; slider.value = String(v); out.textContent = String(v); render(); } }, `${v}`))),
    big, refs,
    h('p', { class: 'muted small' }, '16 bytes por amplitud, como en la tabla de la lección 1.2. Las escalas de referencia son órdenes de magnitud aproximados.'),
  );

  function render() {
    const amps = 2 ** N;
    const bytes = statevectorBytes(N);
    clear(big);
    big.append(
      h('div', {}, h('b', {}, amps < 1e15 ? amps.toLocaleString('es') : amps.toExponential(2).replace('e+', ' × 10^')), h('span', {}, 'amplitudes ($2^n$)')),
      h('div', {}, h('b', {}, formatBytes(bytes)), h('span', {}, 'de memoria')),
    );
    big.querySelector('span').innerHTML = `amplitudes (2<sup>${N}</sup>)`;
    clear(refs);
    REFS.forEach((r) => {
      const fits = bytes <= r.bytes;
      refs.append(h('li', { class: fits ? 'fits' : 'nofit' }, fits ? '✓ Cabe en ' : '✗ No cabe en ', r.label,
        fits ? '' : ` (haría falta ${bytes / r.bytes >= 1e6 ? (bytes / r.bytes).toExponential(1).replace('e+', ' × 10^') : Math.ceil(bytes / r.bytes).toLocaleString('es')} veces más)`));
    });
  }
  render();
}
