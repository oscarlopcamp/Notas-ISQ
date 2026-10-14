// Texto Unicode: grafemas, puntos de código, unidades UTF-16, codificaciones
// y decodificaciones erróneas (mojibake). Funciones puras, cubiertas por tests/.
// Se apoyan en las implementaciones del navegador (Intl.Segmenter, TextEncoder,
// TextDecoder, String.prototype.normalize), que siguen los estándares Unicode y WHATWG.

const utf8Encoder = new TextEncoder();

/** Grupos de grafemas («caracteres percibidos», UAX #29). */
export function graphemes(text) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter('es', { granularity: 'grapheme' }).segment(text), (s) => s.segment);
  }
  return Array.from(text); // respaldo: puntos de código
}

export const codePoints = (text) => Array.from(text, (c) => c.codePointAt(0));

/** Unidades de código UTF-16 (lo que cuenta String.length en JavaScript). */
export function utf16Units(text) {
  const units = [];
  for (let i = 0; i < text.length; i += 1) units.push(text.charCodeAt(i));
  return units;
}

export const utf8Bytes = (text) => Array.from(utf8Encoder.encode(text));

// Windows-1252: 0x00–0x7F y 0xA0–0xFF coinciden con el punto de código.
// Tabla 0x80–0x9F generada con el códec cp1252 de CPython 3.14.
const CP1252_HIGH = {
  0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87,
  0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A, 0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91,
  0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97, 0x02DC: 0x98,
  0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F,
};

export const ENCODINGS = {
  'utf-8': 'UTF-8',
  'utf-16le': 'UTF-16 (little-endian)',
  'windows-1252': 'Windows-1252 (Latin-1 occidental)',
  ascii: 'ASCII (7 bits)',
};

/**
 * Codifica un texto. Devuelve { bytes, unencodable } donde unencodable lista
 * los caracteres que la codificación no puede representar (se sustituyen por «?»,
 * como hace Python con errors="replace").
 */
export function encode(text, encoding) {
  const unencodable = [];
  if (encoding === 'utf-8') return { bytes: utf8Bytes(text), unencodable };
  if (encoding === 'utf-16le') {
    const bytes = [];
    utf16Units(text).forEach((u) => bytes.push(u & 0xFF, u >> 8));
    return { bytes, unencodable };
  }
  const bytes = [];
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    let b = null;
    if (cp < 0x80) b = cp;
    else if (encoding === 'windows-1252') {
      if (cp >= 0xA0 && cp <= 0xFF) b = cp;
      else if (CP1252_HIGH[cp] !== undefined) b = CP1252_HIGH[cp];
    }
    if (b === null) { unencodable.push(ch); b = 0x3F; }
    bytes.push(b);
  }
  return { bytes, unencodable };
}

/** Decodifica bytes. Con fatal = false, las secuencias inválidas se sustituyen por U+FFFD (�). */
export function decode(bytes, encoding, fatal = false) {
  const label = encoding === 'ascii' ? 'windows-1252' : encoding;
  if (encoding === 'ascii' && bytes.some((b) => b > 0x7F)) {
    if (fatal) throw new TypeError('Byte fuera de ASCII');
    return bytes.map((b) => (b > 0x7F ? '�' : String.fromCharCode(b))).join('');
  }
  return new TextDecoder(label, { fatal }).decode(new Uint8Array(bytes));
}

/** Nombre de la escritura (script) de un carácter, para detectar mezclas sospechosas. */
const SCRIPTS = ['Latin', 'Cyrillic', 'Greek', 'Arabic', 'Hebrew', 'Han', 'Hiragana', 'Katakana', 'Hangul', 'Devanagari', 'Armenian', 'Georgian', 'Thai'];
const SCRIPT_RE = SCRIPTS.map((s) => [s, new RegExp(`\\p{Script=${s}}`, 'u')]);
export function scriptOf(char) {
  for (const [name, re] of SCRIPT_RE) if (re.test(char)) return name;
  if (/\p{Script=Common}/u.test(char)) return 'Common';
  if (/\p{Script=Inherited}/u.test(char)) return 'Inherited';
  return 'Other';
}

/** Escrituras «reales» presentes (ignora Common e Inherited: espacios, signos, acentos combinantes). */
export function scriptsUsed(text) {
  return [...new Set(Array.from(text, scriptOf))].filter((s) => s !== 'Common' && s !== 'Inherited');
}

/** ¿Es una marca combinante (se une al carácter anterior)? */
export const isCombining = (char) => /\p{M}/u.test(char);
