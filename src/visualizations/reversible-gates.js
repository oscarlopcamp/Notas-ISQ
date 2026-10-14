// Compuertas reversibles e irreversibles: cada línea une una combinación de
// entrada con la salida que produce. Una compuerta es reversible si a cada
// salida le corresponde exactamente una entrada (la función es biyectiva).

import { h, svg, clear } from '../utils/dom.js';

const GATES = {
  AND: { inBits: 2, outBits: 1, f: ([a, b]) => [a & b], text: 'AND tiene 4 entradas posibles y solo 2 salidas: tres entradas distintas producen 0. Si ves la salida 0, no puedes saber cuál de ellas fue. Se pierde información.' },
  XOR: { inBits: 2, outBits: 1, f: ([a, b]) => [a ^ b], text: 'XOR también comprime 4 entradas en 2 salidas: es irreversible.' },
  NOT: { inBits: 1, outBits: 1, f: ([a]) => [1 - a], text: 'NOT es reversible: cada salida procede de una única entrada, y aplicar NOT otra vez deshace la operación.' },
  CNOT: { inBits: 2, outBits: 2, f: ([a, b]) => [a, a ^ b], text: 'CNOT (NOT controlado) conserva a y sustituye b por a ⊕ b. Hace el cálculo de XOR sin perder información: las 4 entradas van a 4 salidas distintas, y aplicarla dos veces devuelve la entrada.' },
  Toffoli: { inBits: 3, outBits: 3, f: ([a, b, c]) => [a, b, c ^ (a & b)], text: 'Toffoli (NOT doblemente controlado) invierte c solo si a = b = 1. Con c = 0 calcula a·b en la tercera salida sin borrar a ni b: es un AND reversible. Es universal para la computación clásica reversible.' },
};

const bits = (m, n) => m.toString(2).padStart(n, '0');

export function mount(root, { gate = 'AND' } = {}) {
  let which = gate;
  let selected = null;
  const chips = Object.keys(GATES).map((g) => h('button', { type: 'button', class: 'chip mono', onclick: () => { which = g; selected = null; render(); } }, g));
  const pic = svg('svg', { class: 'rev-svg', role: 'img' });
  const verdict = h('div', { class: 'rev-verdict' });
  const text = h('p', {});

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Compuerta'), chips),
    pic, h('p', { class: 'muted small' }, 'Pulsa una salida para resaltar las entradas que la producen.'), verdict, text,
  );

  function render() {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.textContent === which)));
    const g = GATES[which];
    const nIn = 2 ** g.inBits, nOut = 2 ** g.outBits;
    const H = Math.max(nIn, nOut) * 40 + 40, W = 460;
    const yIn = (i) => 30 + i * ((H - 60) / Math.max(1, nIn - 1));
    const yOut = (o) => (nOut === 1 ? H / 2 : 30 + o * ((H - 60) / Math.max(1, nOut - 1)));
    clear(pic);
    pic.setAttribute('viewBox', `0 0 ${W} ${H}`);
    pic.setAttribute('aria-label', `Correspondencia entre entradas y salidas de ${which}`);
    const preimages = Array.from({ length: nOut }, () => []);
    for (let m = 0; m < nIn; m += 1) {
      const outBits = g.f(bits(m, g.inBits).split('').map(Number));
      const o = parseInt(outBits.join(''), 2);
      preimages[o].push(m);
      pic.append(svg('line', { x1: 130, y1: yIn(m), x2: 330, y2: yOut(o), class: `rev-line ${selected === o ? 'sel' : ''}` }));
    }
    pic.append(svg('text', { x: 80, y: 14, 'text-anchor': 'middle', class: 'rev-head' }, 'Entrada'), svg('text', { x: 380, y: 14, 'text-anchor': 'middle', class: 'rev-head' }, 'Salida'));
    for (let m = 0; m < nIn; m += 1) {
      pic.append(svg('g', { class: `rev-node ${selected !== null && preimages[selected].includes(m) ? 'sel' : ''}` },
        svg('rect', { x: 50, y: yIn(m) - 13, width: 80, height: 26, rx: 4 }),
        svg('text', { x: 90, y: yIn(m) + 5, 'text-anchor': 'middle' }, bits(m, g.inBits))));
    }
    for (let o = 0; o < nOut; o += 1) {
      const node = svg('g', { class: `rev-node out ${selected === o ? 'sel' : ''} ${preimages[o].length > 1 ? 'many' : ''}`, tabindex: '0', role: 'button', 'aria-label': `Salida ${bits(o, g.outBits)}` },
        svg('rect', { x: 330, y: yOut(o) - 13, width: 80, height: 26, rx: 4 }),
        svg('text', { x: 370, y: yOut(o) + 5, 'text-anchor': 'middle' }, bits(o, g.outBits)),
        svg('text', { x: 418, y: yOut(o) + 5, class: 'rev-count' }, preimages[o].length ? `← ${preimages[o].length}` : ''));
      node.addEventListener('click', () => { selected = selected === o ? null : o; render(); });
      pic.append(node);
    }
    const reversible = preimages.every((p) => p.length === 1);
    clear(verdict);
    verdict.className = `rev-verdict ${reversible ? 'ok' : 'bad'}`;
    verdict.textContent = reversible
      ? 'Reversible: cada salida tiene exactamente una entrada. A partir de la salida se puede reconstruir la entrada.'
      : 'Irreversible: alguna salida procede de varias entradas. La salida no basta para saber cuál era la entrada.';
    text.textContent = g.text;
  }

  render();
}
