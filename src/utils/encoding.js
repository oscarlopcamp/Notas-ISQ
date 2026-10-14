// Funciones puras de representación binaria y codificación de texto.
// Son la base de los simuladores del Módulo 1 y están cubiertas por tests/.

/** Representación binaria de un entero no negativo con `width` dígitos mínimo. */
export function toBinary(n, width = 8) {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('Se esperaba un entero no negativo');
  return n.toString(2).padStart(width, '0');
}

/** Valor de una cadena de bits (regla de Horner: v = 2v + b). */
export function fromBinary(bits) {
  if (!/^[01]+$/.test(bits)) throw new SyntaxError('La cadena solo puede contener 0 y 1');
  let value = 0;
  for (const b of bits) value = value * 2 + Number(b);
  return value;
}

export function toHex(n, width = 2) {
  return n.toString(16).toUpperCase().padStart(width, '0');
}

/** Pasos del método de divisiones sucesivas: [{dividend, quotient, remainder}]. */
export function divisionSteps(n) {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('Se esperaba un entero no negativo');
  const steps = [];
  if (n === 0) return [{ dividend: 0, quotient: 0, remainder: 0 }];
  while (n > 0) {
    steps.push({ dividend: n, quotient: Math.floor(n / 2), remainder: n % 2 });
    n = Math.floor(n / 2);
  }
  return steps;
}

/** Número mínimo de bits para distinguir `count` alternativas (count ≥ 1). */
export function bitsNeeded(count) {
  if (!Number.isInteger(count) || count < 1) throw new RangeError('Se esperaba un entero positivo');
  return count === 1 ? 0 : Math.ceil(Math.log2(count));
}

/** Formato del punto de código: U+0048. */
export function codePointLabel(cp) {
  return `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
}

const utf8 = new TextEncoder();

/**
 * Descompone un texto en caracteres (puntos de código) y su codificación.
 * mode = 'ascii' | 'utf8'. En modo ASCII, los caracteres fuera de 0–127
 * se marcan como no representables en lugar de inventar un valor.
 */
export function encodeText(text, mode = 'utf8') {
  return Array.from(text).map((char) => {
    const cp = char.codePointAt(0);
    if (mode === 'ascii') {
      const ok = cp < 128;
      return { char, codePoint: cp, representable: ok, bytes: ok ? [cp] : [] };
    }
    return { char, codePoint: cp, representable: true, bytes: Array.from(utf8.encode(char)) };
  });
}

/** Etiqueta legible para caracteres invisibles o de control. */
export function describeChar(char) {
  const cp = char.codePointAt(0);
  const names = { 32: 'espacio', 9: 'tabulador', 10: 'salto de línea', 13: 'retorno de carro' };
  if (names[cp]) return names[cp];
  if (cp < 32 || cp === 127) return 'control';
  return char;
}

/** Interpretaciones de un mismo byte (0–255). */
export function interpretByte(byte) {
  const printable = byte >= 32 && byte < 127;
  return {
    unsigned: byte,
    signed: byte >= 128 ? byte - 256 : byte,
    ascii: byte < 128 ? (printable ? String.fromCharCode(byte) : null) : null,
    asciiDefined: byte < 128,
    gray: byte,
    hex: toHex(byte),
  };
}
