// Simulador de una caché de correspondencia directa (modelo educativo).
// Cada dirección de byte se divide en: etiqueta | índice de línea | desplazamiento
// dentro del bloque. Una línea guarda un bloque completo de bytes contiguos.

export function simulateCache({ lines, blockSize, addresses }) {
  const tags = Array(lines).fill(null);
  return addresses.map((addr) => {
    const block = Math.floor(addr / blockSize);
    const index = block % lines;
    const tag = Math.floor(block / lines);
    const hit = tags[index] === tag;
    const evicted = !hit && tags[index] !== null ? tags[index] : null;
    tags[index] = tag;
    return { addr, block, index, tag, offset: addr % blockSize, hit, evicted };
  });
}

/**
 * Direcciones al recorrer una matriz rows × cols de enteros de `elementSize`
 * bytes almacenada por filas (como en C o NumPy por defecto).
 */
export function matrixTraversal(rows, cols, elementSize, order = 'rows') {
  const out = [];
  if (order === 'rows') {
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) out.push((r * cols + c) * elementSize);
  } else {
    for (let c = 0; c < cols; c += 1) for (let r = 0; r < rows; r += 1) out.push((r * cols + c) * elementSize);
  }
  return out;
}

export const hitRate = (results) => (results.length ? results.filter((r) => r.hit).length / results.length : 0);
