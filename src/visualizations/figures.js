// Figuras estáticas (SVG) usadas en las lecciones. Usan clases CSS para
// adaptarse a los temas claro y oscuro.

import { h } from '../utils/dom.js';

function fromSVG(markup) {
  return h('div', { class: 'fig', html: markup.trim() });
}

export const figures = {
  /** Capas de abstracción: de lo físico al significado. */
  'abstraction-layers': () => {
    const layers = [
      ['Significado', '«HOLA», el número 72, una fotografía', 'Lo que le importa a la persona usuaria'],
      ['Codificación', 'ASCII, UTF-8, enteros, RGB…', 'Convención que asigna significado a patrones de bits'],
      ['Agrupaciones', 'bytes (8 bits), palabras (32 o 64 bits)', 'Unidades con las que trabajan memoria y CPU'],
      ['Bits', '0 y 1', 'Abstracción: dos estados distinguibles'],
      ['Física', 'voltaje, carga eléctrica, magnetización, luz', 'Fenómeno real, continuo y con ruido'],
    ];
    const W = 640, rowH = 58, gap = 10, x0 = 150;
    const rows = layers.map(([name, ex, role], i) => {
      const y = i * (rowH + gap);
      const w = W - x0 - 10 - i * 22;
      const x = x0 + i * 11;
      return `
        <text x="${x0 - 14}" y="${y + rowH / 2 + 5}" text-anchor="end" class="fig-label">${name}</text>
        <rect x="${x}" y="${y}" width="${w}" height="${rowH}" rx="6" class="fig-box ${i === 3 ? 'accent' : i === 4 ? 'teal' : ''}"/>
        <text x="${x + 14}" y="${y + 24}" class="fig-text strong">${ex}</text>
        <text x="${x + 14}" y="${y + 44}" class="fig-text muted">${role}</text>`;
    }).join('');
    const total = layers.length * (rowH + gap);
    return fromSVG(`
      <svg viewBox="0 0 ${W} ${total + 10}" role="img" aria-label="Capas de abstracción desde el fenómeno físico hasta el significado">
        <defs><marker id="arrow-up" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fig-arrowhead"/></marker></defs>
        <line x1="22" y1="${total - 20}" x2="22" y2="16" class="fig-arrow" marker-end="url(#arrow-up)"/>
        <text x="34" y="${total / 2}" class="fig-text muted" transform="rotate(-90 34 ${total / 2})" text-anchor="middle">más abstracto ↑</text>
        ${rows}
      </svg>`);
  },

  /** Arquitectura de von Neumann (modelo conceptual). */
  'von-neumann-arch': () => fromSVG(`
    <svg viewBox="0 0 640 300" role="img" aria-label="CPU con unidad de control, ALU y registros, conectada por un bus a una memoria única de instrucciones y datos y a la entrada y salida">
      <rect x="20" y="20" width="250" height="200" rx="8" class="fig-box accent"/>
      <text x="145" y="44" text-anchor="middle" class="fig-label">CPU</text>
      <rect x="40" y="60" width="210" height="44" rx="6" class="fig-box"/>
      <text x="145" y="80" text-anchor="middle" class="fig-text strong">Unidad de control</text>
      <text x="145" y="96" text-anchor="middle" class="fig-text muted">PC, IR: decide qué hacer</text>
      <rect x="40" y="114" width="100" height="44" rx="6" class="fig-box"/>
      <text x="90" y="134" text-anchor="middle" class="fig-text strong">ALU</text>
      <text x="90" y="150" text-anchor="middle" class="fig-text muted">aritmética y lógica</text>
      <rect x="150" y="114" width="100" height="44" rx="6" class="fig-box"/>
      <text x="200" y="134" text-anchor="middle" class="fig-text strong">Registros</text>
      <text x="200" y="150" text-anchor="middle" class="fig-text muted">ACC y otros</text>
      <text x="145" y="198" text-anchor="middle" class="fig-text muted">ciclo: búsqueda → decodificación → ejecución</text>
      <rect x="380" y="20" width="240" height="200" rx="8" class="fig-box teal"/>
      <text x="500" y="44" text-anchor="middle" class="fig-label">Memoria única</text>
      <rect x="400" y="60" width="200" height="60" rx="6" class="fig-box"/>
      <text x="500" y="86" text-anchor="middle" class="fig-text strong">Instrucciones</text>
      <text x="500" y="104" text-anchor="middle" class="fig-text muted">el programa almacenado</text>
      <rect x="400" y="130" width="200" height="60" rx="6" class="fig-box"/>
      <text x="500" y="156" text-anchor="middle" class="fig-text strong">Datos</text>
      <text x="500" y="174" text-anchor="middle" class="fig-text muted">mismos bits, otro uso</text>
      <line x1="270" y1="120" x2="380" y2="120" class="fig-arrow"/>
      <text x="325" y="110" text-anchor="middle" class="fig-text muted">bus</text>
      <rect x="160" y="245" width="320" height="40" rx="6" class="fig-box"/>
      <text x="320" y="270" text-anchor="middle" class="fig-text strong">Entrada / salida (teclado, pantalla, red, disco)</text>
      <line x1="145" y1="220" x2="200" y2="245" class="fig-arrow"/>
      <line x1="500" y1="220" x2="440" y2="245" class="fig-arrow"/>
    </svg>`),

  /** Organización típica de la memoria de un proceso. */
  'process-memory': () => fromSVG(`
    <svg viewBox="0 0 560 330" role="img" aria-label="Memoria de un proceso: código, datos, montículo que crece hacia arriba, espacio libre y pila que crece hacia abajo">
      <text x="100" y="20" class="fig-text muted">direcciones altas ↑</text>
      <rect x="100" y="30" width="220" height="56" rx="4" class="fig-box accent"/>
      <text x="210" y="56" text-anchor="middle" class="fig-text strong">Pila (stack)</text>
      <text x="210" y="74" text-anchor="middle" class="fig-text muted">marcos de llamadas ↓ crece</text>
      <rect x="100" y="86" width="220" height="80" rx="4" class="fig-box" style="stroke-dasharray:4 3"/>
      <text x="210" y="130" text-anchor="middle" class="fig-text muted">espacio libre</text>
      <rect x="100" y="166" width="220" height="56" rx="4" class="fig-box teal"/>
      <text x="210" y="190" text-anchor="middle" class="fig-text strong">Montículo (heap)</text>
      <text x="210" y="208" text-anchor="middle" class="fig-text muted">memoria dinámica ↑ crece</text>
      <rect x="100" y="222" width="220" height="40" rx="4" class="fig-box"/>
      <text x="210" y="247" text-anchor="middle" class="fig-text strong">Datos globales</text>
      <rect x="100" y="262" width="220" height="40" rx="4" class="fig-box"/>
      <text x="210" y="287" text-anchor="middle" class="fig-text strong">Código (instrucciones)</text>
      <text x="100" y="322" class="fig-text muted">direcciones bajas</text>
      <text x="340" y="58" class="fig-text">variables locales, direcciones de retorno</text>
      <text x="340" y="194" class="fig-text">objetos creados durante la ejecución</text>
      <text x="340" y="246" class="fig-text">variables globales y constantes</text>
      <text x="340" y="286" class="fig-text">el programa en lenguaje máquina</text>
    </svg>`),

  /** Compilación frente a interpretación (y el caso de CPython). */
  'compile-pipeline': () => fromSVG(`
    <svg viewBox="0 0 660 250" role="img" aria-label="Del código fuente a la ejecución: compilador a código máquina, o compilador a bytecode más máquina virtual, como en CPython">
      <defs><marker id="arr-cp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fig-arrowhead"/></marker></defs>
      <rect x="10" y="95" width="120" height="50" rx="6" class="fig-box"/>
      <text x="70" y="118" text-anchor="middle" class="fig-text strong">Código fuente</text>
      <text x="70" y="134" text-anchor="middle" class="fig-text muted">texto legible</text>
      <rect x="190" y="30" width="150" height="50" rx="6" class="fig-box accent"/>
      <text x="265" y="53" text-anchor="middle" class="fig-text strong">Compilador</text>
      <text x="265" y="69" text-anchor="middle" class="fig-text muted">p. ej. C, Rust</text>
      <rect x="400" y="30" width="130" height="50" rx="6" class="fig-box"/>
      <text x="465" y="53" text-anchor="middle" class="fig-text strong">Código máquina</text>
      <text x="465" y="69" text-anchor="middle" class="fig-text muted">para una CPU concreta</text>
      <rect x="560" y="30" width="90" height="50" rx="6" class="fig-box teal"/>
      <text x="605" y="60" text-anchor="middle" class="fig-text strong">CPU</text>
      <rect x="190" y="160" width="150" height="50" rx="6" class="fig-box accent"/>
      <text x="265" y="183" text-anchor="middle" class="fig-text strong">Compilador a bytecode</text>
      <text x="265" y="199" text-anchor="middle" class="fig-text muted">p. ej. CPython</text>
      <rect x="400" y="160" width="130" height="50" rx="6" class="fig-box"/>
      <text x="465" y="183" text-anchor="middle" class="fig-text strong">Bytecode</text>
      <text x="465" y="199" text-anchor="middle" class="fig-text muted">instrucciones de una VM</text>
      <rect x="560" y="160" width="90" height="50" rx="6" class="fig-box teal"/>
      <text x="605" y="183" text-anchor="middle" class="fig-text strong">Máquina</text>
      <text x="605" y="199" text-anchor="middle" class="fig-text strong">virtual</text>
      <path d="M130,110 L190,60" class="fig-arrow" marker-end="url(#arr-cp)"/>
      <path d="M130,130 L190,180" class="fig-arrow" marker-end="url(#arr-cp)"/>
      <path d="M340,55 L400,55" class="fig-arrow" marker-end="url(#arr-cp)"/>
      <path d="M530,55 L560,55" class="fig-arrow" marker-end="url(#arr-cp)"/>
      <path d="M340,185 L400,185" class="fig-arrow" marker-end="url(#arr-cp)"/>
      <path d="M530,185 L560,185" class="fig-arrow" marker-end="url(#arr-cp)"/>
      <path d="M605,160 L605,80" class="fig-arrow" marker-end="url(#arr-cp)"/>
      <text x="612" y="124" class="fig-text muted">la VM es</text>
      <text x="612" y="138" class="fig-text muted">un programa</text>
      <text x="612" y="152" class="fig-text muted">en la CPU</text>
      <text x="10" y="240" class="fig-text muted">Las dos rutas son modelos simplificados: muchos lenguajes combinan ambas (p. ej., compilación «justo a tiempo»).</text>
    </svg>`),

  /** Clases de complejidad: relaciones demostradas y conjeturadas. */
  'complexity-classes': () => fromSVG(`
    <svg viewBox="0 0 620 330" role="img" aria-label="P contenido en NP y en BQP; BQP contiene la factorización; los problemas NP-completos fuera de BQP según la conjetura más aceptada">
      <ellipse cx="250" cy="175" rx="215" ry="135" class="fig-box"/>
      <text x="90" y="80" class="fig-label">NP</text>
      <ellipse cx="400" cy="175" rx="170" ry="110" class="fig-box teal" style="fill-opacity:0.55"/>
      <text x="520" y="110" class="fig-label">BQP</text>
      <ellipse cx="330" cy="200" rx="75" ry="60" class="fig-box accent"/>
      <text x="322" y="206" class="fig-label">P</text>
      <circle cx="420" cy="150" r="6" class="fig-a"/>
      <text x="432" y="146" class="fig-text strong">factorización</text>
      <text x="432" y="162" class="fig-text muted">(Shor; no se conoce</text>
      <text x="432" y="176" class="fig-text muted">algoritmo clásico eficiente)</text>
      <ellipse cx="120" cy="190" rx="60" ry="45" class="fig-box" style="stroke-dasharray:4 3"/>
      <text x="120" y="186" text-anchor="middle" class="fig-text strong">NP-completos</text>
      <text x="120" y="202" text-anchor="middle" class="fig-text muted">p. ej. SAT</text>
      <text x="20" y="318" class="fig-text muted">Demostrado: P ⊆ NP, P ⊆ BQP, factorización ∈ BQP. Conjeturado (abierto): P ≠ NP; NP-completos ∉ BQP; factorización ∉ P.</text>
    </svg>`),

  /** Codificación UTF-8 de «ñ» (U+00F1). */
  'utf8-enye': () => {
    const cp = '00011110001'.split(''); // 241 en 11 bits
    const cell = 30;
    const box = (x, y, bit, cls) => `<rect x="${x}" y="${y}" width="${cell - 3}" height="${cell}" rx="3" class="fig-bit ${cls}"/><text x="${x + (cell - 3) / 2}" y="${y + 20}" text-anchor="middle" class="fig-mono ${cls}">${bit}</text>`;
    let top = '';
    cp.forEach((b, i) => { top += box(150 + i * cell, 30, b, i < 5 ? 'grp-a' : 'grp-b'); });
    const byte1 = ['1', '1', '0', ...cp.slice(0, 5)];
    const byte2 = ['1', '0', ...cp.slice(5)];
    let bottom = '';
    byte1.forEach((b, i) => { bottom += box(40 + i * cell, 150, b, i < 3 ? 'prefix' : 'grp-a'); });
    byte2.forEach((b, i) => { bottom += box(330 + i * cell, 150, b, i < 2 ? 'prefix' : 'grp-b'); });
    return fromSVG(`
      <svg viewBox="0 0 600 230" role="img" aria-label="Los 11 bits del punto de código U+00F1 se reparten en dos bytes UTF-8 con prefijos 110 y 10">
        <text x="150" y="20" class="fig-text strong">U+00F1 = 241 = 000 1111 0001 (11 bits)</text>
        ${top}
        <path d="M ${150 + 2.5 * cell} 64 L ${40 + 5.5 * cell} 146" class="fig-arrow"/>
        <path d="M ${150 + 8 * cell} 64 L ${330 + 5 * cell} 146" class="fig-arrow"/>
        ${bottom}
        <text x="40" y="200" class="fig-text">Byte 1: 110<tspan class="fig-a">00011</tspan> = 0xC3</text>
        <text x="330" y="200" class="fig-text">Byte 2: 10<tspan class="fig-b">110001</tspan> = 0xB1</text>
        <text x="40" y="222" class="fig-text muted">Prefijo «110»: inicio de un carácter de 2 bytes. Prefijo «10»: byte de continuación.</text>
      </svg>`);
  },
};
