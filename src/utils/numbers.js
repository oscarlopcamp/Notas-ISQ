// Representación de números: enteros de ancho fijo, complemento a dos,
// fracciones binarias e IEEE 754. Funciones puras, cubiertas por tests/.
// Los cálculos de punto flotante usan el propio formato del navegador
// (DataView) y aritmética exacta con BigInt: nada se aproxima a mano.

/** Valor de un patrón de n bits (entero 0…2^n−1) según la interpretación. */
export function interpret(pattern, n, mode = 'unsigned') {
  const top = 1 << (n - 1);
  if (mode === 'signed') return pattern & top ? pattern - (1 << n) : pattern;
  if (mode === 'sign-magnitude') {
    const magnitude = pattern & (top - 1);
    return pattern & top ? -magnitude : magnitude;
  }
  return pattern;
}

/** Rango representable con n bits en cada interpretación. */
export function range(n, mode = 'unsigned') {
  if (mode === 'signed') return [-(2 ** (n - 1)), 2 ** (n - 1) - 1];
  if (mode === 'sign-magnitude') return [-(2 ** (n - 1) - 1), 2 ** (n - 1) - 1];
  return [0, 2 ** n - 1];
}

/** Patrón de n bits en complemento a dos para un entero dentro de rango. */
export function toTwos(value, n) {
  const [lo, hi] = range(n, 'signed');
  if (!Number.isInteger(value) || value < lo || value > hi) throw new RangeError(`${value} no cabe en ${n} bits con signo`);
  return value < 0 ? value + 2 ** n : value;
}

/**
 * Suma columna a columna de dos patrones de n bits.
 * Devuelve los bits del resultado (sin el acarreo final), los acarreos que
 * entran en cada columna y los indicadores de desbordamiento.
 */
export function addBits(a, b, n) {
  const sum = [];
  const carries = [0]; // acarreo que entra en la columna i (empezando por la derecha)
  for (let i = 0; i < n; i += 1) {
    const total = ((a >> i) & 1) + ((b >> i) & 1) + carries[i];
    sum.push(total % 2);
    carries.push(total >> 1);
  }
  const result = sum.reduce((acc, bit, i) => acc | (bit << i), 0);
  const carryOut = carries[n];
  return {
    result,
    sumBits: sum,            // sum[i] = bit de la columna i
    carries,                 // carries[i] = acarreo que entra en la columna i; carries[n] = acarreo final
    carryOut,
    unsignedOverflow: carryOut === 1,
    signedOverflow: carries[n - 1] !== carryOut, // acarreo hacia el bit de signo ≠ acarreo final
  };
}

/** Pasos de la negación en complemento a dos: invertir y sumar 1. */
export function negateSteps(value, n) {
  const pattern = toTwos(value, n);
  const mask = 2 ** n - 1;
  const inverted = ~pattern & mask;
  const result = (inverted + 1) & mask;
  return { pattern, inverted, result, resultValue: interpret(result, n, 'signed'), wraps: result === pattern && value !== 0 };
}

// ---------- Fracciones binarias exactas ----------

const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a < 0n ? -a : a; };

/** Convierte una cadena decimal («0.1», «1.25», «3e-2») en fracción exacta {num, den} reducida. */
export function parseDecimal(text) {
  const m = String(text).trim().match(/^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/);
  if (!m || (!m[2] && !m[3])) return null;
  const [, sign, intPart = '', fracPart = '', exp = '0'] = m;
  let num = BigInt((intPart + fracPart) || '0');
  let den = 10n ** BigInt(fracPart.length);
  const e = Number(exp);
  if (e > 0) num *= 10n ** BigInt(e); else if (e < 0) den *= 10n ** BigInt(-e);
  if (sign === '-') num = -num;
  const g = gcd(num, den) || 1n;
  return { num: num / g, den: den / g };
}

/**
 * Expansión binaria de una fracción 0 ≤ x < 1 por multiplicaciones sucesivas.
 * Detecta el período de forma exacta (cuando se repite un resto).
 * Devuelve { digits, steps, periodStart, terminated }.
 */
export function fractionToBinary(num, den, maxSteps = 40) {
  num = BigInt(num); den = BigInt(den);
  if (num < 0n || num >= den) throw new RangeError('Se esperaba 0 ≤ x < 1');
  const seen = new Map();
  const steps = [];
  let r = num;
  while (r !== 0n && steps.length < maxSteps) {
    if (seen.has(r)) return { digits: steps.map((s) => s.bit), steps, periodStart: seen.get(r), terminated: false };
    seen.set(r, steps.length);
    const doubled = 2n * r;
    const bit = doubled >= den ? 1 : 0;
    const next = doubled - BigInt(bit) * den;
    steps.push({ before: r, doubled, bit, after: next, den });
    r = next;
  }
  return { digits: steps.map((s) => s.bit), steps, periodStart: r === 0n ? null : -1, terminated: r === 0n };
}

/** Una fracción reducida p/q tiene expansión binaria finita si y solo si q es potencia de 2. */
export function hasFiniteBinary(den) {
  den = BigInt(den);
  return den > 0n && (den & (den - 1n)) === 0n;
}

// ---------- IEEE 754 ----------

export const FORMATS = {
  binary32: { bits: 32, exp: 8, frac: 23, bias: 127, label: 'binary32 (float, precisión simple)' },
  binary64: { bits: 64, exp: 11, frac: 52, bias: 1023, label: 'binary64 (double, precisión doble)' },
};

/** Patrón de bits (BigInt) del número x redondeado al formato. */
export function floatToBits(x, format = 'binary64') {
  const view = new DataView(new ArrayBuffer(8));
  if (format === 'binary32') {
    view.setFloat32(0, x);
    return BigInt(view.getUint32(0));
  }
  view.setFloat64(0, x);
  return view.getBigUint64(0);
}

/** Número (de JavaScript) representado por un patrón de bits. */
export function bitsToFloat(bits, format = 'binary64') {
  const view = new DataView(new ArrayBuffer(8));
  if (format === 'binary32') {
    view.setUint32(0, Number(bits));
    return view.getFloat32(0);
  }
  view.setBigUint64(0, bits);
  return view.getFloat64(0);
}

/** Campos y clasificación de un patrón IEEE 754. */
export function decodeFloat(bits, format = 'binary64') {
  const f = FORMATS[format];
  const fracMask = (1n << BigInt(f.frac)) - 1n;
  const expMask = (1n << BigInt(f.exp)) - 1n;
  const sign = Number(bits >> BigInt(f.bits - 1));
  const E = Number((bits >> BigInt(f.frac)) & expMask);
  const fraction = bits & fracMask;
  const maxE = Number(expMask);
  let kind;
  if (E === maxE) kind = fraction === 0n ? 'infinity' : 'nan';
  else if (E === 0) kind = fraction === 0n ? 'zero' : 'subnormal';
  else kind = 'normal';
  const exponent = kind === 'subnormal' || kind === 'zero' ? 1 - f.bias : E - f.bias;
  // Valor exacto = (−1)^s · m · 2^q con m entero
  const m = kind === 'normal' ? (1n << BigInt(f.frac)) | fraction : fraction;
  const q = exponent - f.frac;
  return { sign, E, fraction, kind, exponent, m, q, format };
}

/** Valor exacto (cadena decimal) de un patrón finito. */
export function exactDecimal(bits, format = 'binary64') {
  const d = decodeFloat(bits, format);
  if (d.kind === 'nan') return 'NaN';
  if (d.kind === 'infinity') return d.sign ? '-Infinity' : 'Infinity';
  return scaledToString(exactScaled(d), d.sign);
}

/** Representación exacta como entero escalado {int, scale}: valor = int / 10^scale. */
function exactScaled({ m, q }) {
  if (q >= 0) return { int: m << BigInt(q), scale: 0 };
  return { int: m * 5n ** BigInt(-q), scale: -q }; // m / 2^k = m·5^k / 10^k
}

function scaledToString({ int, scale }, negative = false) {
  let s = int.toString().padStart(scale + 1, '0');
  let out = scale ? `${s.slice(0, s.length - scale)}.${s.slice(s.length - scale)}` : s;
  if (scale) out = out.replace(/0+$/, '').replace(/\.$/, '');
  return (negative ? '-' : '') + out;
}

/**
 * Error exacto al almacenar un número decimal: almacenado − original.
 * Devuelve { stored, error, relative } como cadenas/números aproximados para mostrar.
 */
export function roundingError(text, format = 'binary64') {
  const exact = parseDecimal(text);
  if (!exact) return null;
  const x = Number(text);
  const bits = floatToBits(x, format);
  const d = decodeFloat(bits, format);
  if (d.kind === 'nan' || d.kind === 'infinity') return { stored: exactDecimal(bits, format), error: null, relative: null, bits };
  const s = exactScaled(d);
  const storedNum = d.sign ? -s.int : s.int;
  // error = storedNum/10^scale − exact.num/exact.den  (fracción exacta)
  const errNum = storedNum * exact.den - exact.num * 10n ** BigInt(s.scale);
  const errDen = exact.den * 10n ** BigInt(s.scale);
  return {
    stored: exactDecimal(bits, format),
    bits,
    errorIsZero: errNum === 0n,
    error: ratioToNumber(errNum, errDen),
    relative: exact.num === 0n ? 0 : Math.abs(ratioToNumber(errNum * exact.den, errDen * exact.num)),
  };
}

/** Aproximación de num/den como Number sin perder el orden de magnitud. */
export function ratioToNumber(num, den) {
  if (num === 0n) return 0;
  const neg = (num < 0n) !== (den < 0n);
  num = num < 0n ? -num : num; den = den < 0n ? -den : den;
  const shift = num.toString().length - den.toString().length;
  let scaledNum = num, scaledDen = den;
  if (shift > 0) scaledDen *= 10n ** BigInt(shift); else scaledNum *= 10n ** BigInt(-shift);
  const mant = Number((scaledNum * 10n ** 17n) / scaledDen) / 1e17;
  const value = mant * 10 ** shift;
  return neg ? -value : value;
}

/** Distancia al siguiente valor representable (ULP) para un patrón finito y normal o subnormal. */
export function ulp(bits, format = 'binary64') {
  const d = decodeFloat(bits, format);
  if (d.kind === 'nan' || d.kind === 'infinity') return null;
  return 2 ** d.q;
}

/** Representación decimal más corta que reproduce el valor en el formato dado. */
export function shortest(x, format = 'binary64') {
  if (!Number.isFinite(x)) return String(x);
  if (format === 'binary64') return String(x);
  for (let p = 1; p <= 9; p += 1) {
    const s = Number(x.toPrecision(p));
    if (Math.fround(s) === x) return String(s);
  }
  return String(x);
}
