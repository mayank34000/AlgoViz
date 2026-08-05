import { ARRAY_TYPE, VALUE_MIN, VALUE_MAX } from '../constants.js';
import { randomInt } from '../utils.js';

export function generateArray(size, type) {
  switch (type) {
    case ARRAY_TYPE.NEARLY_SORTED:   return nearlySorted(size);
    case ARRAY_TYPE.REVERSE:         return reverse(size);
    case ARRAY_TYPE.FEW_UNIQUE:      return fewUnique(size);
    case ARRAY_TYPE.DUPLICATE_HEAVY: return duplicateHeavy(size);
    default:                         return random(size);
  }
}

function random(size) {
  return Array.from({ length: size }, () => randomInt(VALUE_MIN, VALUE_MAX));
}

function nearlySorted(size) {
  // Build a sorted array then swap ~5% of pairs
  const arr = sorted(size);
  const swapCount = Math.max(1, Math.floor(size * 0.05));
  for (let i = 0; i < swapCount; i++) {
    const a = randomInt(0, size - 1);
    const b = randomInt(0, size - 1);
    [arr[a], arr[b]] = [arr[b], arr[a]];
  }
  return arr;
}

function sorted(size) {
  return Array.from({ length: size }, (_, i) =>
    Math.round(VALUE_MIN + (i / Math.max(size - 1, 1)) * (VALUE_MAX - VALUE_MIN))
  );
}

function reverse(size) {
  return Array.from({ length: size }, (_, i) =>
    Math.round(VALUE_MAX - (i / Math.max(size - 1, 1)) * (VALUE_MAX - VALUE_MIN))
  );
}

function fewUnique(size) {
  const palette = [15, 30, 50, 70, 90];
  return Array.from({ length: size }, () => palette[randomInt(0, palette.length - 1)]);
}

function duplicateHeavy(size) {
  const poolSize = Math.max(3, Math.floor(size * 0.08));
  const pool = Array.from({ length: poolSize }, () => randomInt(VALUE_MIN, VALUE_MAX));
  return Array.from({ length: size }, () => pool[randomInt(0, pool.length - 1)]);
}
