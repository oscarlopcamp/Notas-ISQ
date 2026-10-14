// Imágenes y audio: color, cuantización, compresión RLE y muestreo.
// Funciones puras, cubiertas por tests/.

export const toHexColor = (r, g, b) => `#${[r, g, b].map((v) => v.toString(16).toUpperCase().padStart(2, '0')).join('')}`;

export function fromHexColor(hex) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  return m ? m.slice(1).map((x) => parseInt(x, 16)) : null;
}

/**
 * Cuantiza un valor 0–255 a `bits` bits por canal y lo devuelve escalado a 0–255
 * para poder mostrarlo. Con 8 bits no cambia nada.
 */
export function quantize(value, bits) {
  const levels = 2 ** bits;
  const level = Math.round((value / 255) * (levels - 1));
  return { level, levels, shown: Math.round((level * 255) / (levels - 1)) };
}

/** Tamaño sin comprimir de una imagen. */
export const imageBytes = (width, height, bitsPerPixel) => (width * height * bitsPerPixel) / 8;

/** Codificación por longitud de series (run-length encoding). */
export function rle(values) {
  const runs = [];
  for (const v of values) {
    if (runs.length && runs[runs.length - 1][0] === v) runs[runs.length - 1][1] += 1;
    else runs.push([v, 1]);
  }
  return runs;
}

export const unrle = (runs) => runs.flatMap(([v, n]) => Array(n).fill(v));

/**
 * Muestreo y cuantización de una señal s(t) = sin(2π f t) en [0, duration).
 * Devuelve las muestras (instante, valor exacto, nivel cuantizado y valor reconstruido).
 */
export function sampleSine({ freq, rate, bits, duration = 1 }) {
  const n = Math.floor(rate * duration);
  const levels = 2 ** bits;
  const samples = [];
  for (let k = 0; k < n; k += 1) {
    const t = k / rate;
    const v = Math.sin(2 * Math.PI * freq * t);
    const level = Math.round(((v + 1) / 2) * (levels - 1));
    samples.push({ t, v, level, q: (level / (levels - 1)) * 2 - 1 });
  }
  return samples;
}

/** Frecuencia aparente (alias) de una senoide de frecuencia f muestreada a fs. */
export function aliasFrequency(f, fs) {
  const r = ((f % fs) + fs) % fs;
  return Math.min(r, fs - r);
}

/** Tasa de bits de audio PCM sin comprimir. */
export const pcmBitrate = (rate, bits, channels) => rate * bits * channels;
