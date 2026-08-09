import { SOP } from '../../constants.js';

// Requires a sorted array. Works best on uniformly distributed data.
export function interpolationSearch(array, target) {
  const ops = [];
  let low = 0, high = array.length - 1;

  ops.push({ type: SOP.SET_LOW,  index: low });
  ops.push({ type: SOP.SET_HIGH, index: high });

  while (low <= high && target >= array[low] && target <= array[high]) {
    if (low === high) {
      ops.push({ type: SOP.COMPARE, index: low });
      if (array[low] === target) {
        ops.push({ type: SOP.FOUND, index: low });
      } else {
        ops.push({ type: SOP.VISIT,     index: low });
        ops.push({ type: SOP.NOT_FOUND });
      }
      return ops;
    }

    // Estimate position using linear interpolation
    const range = array[high] - array[low];
    const pos = range === 0
      ? low
      : low + Math.floor(((target - array[low]) / range) * (high - low));

    const probe = Math.max(low, Math.min(high, pos));
    ops.push({ type: SOP.SET_MID,  index: probe });
    ops.push({ type: SOP.COMPARE,  index: probe });

    if (array[probe] === target) {
      ops.push({ type: SOP.FOUND, index: probe });
      return ops;
    }

    if (array[probe] < target) {
      ops.push({ type: SOP.DISCARD_RANGE, start: low,   end: probe });
      ops.push({ type: SOP.VISIT,         index: probe });
      low = probe + 1;
      ops.push({ type: SOP.SET_LOW, index: low });
    } else {
      ops.push({ type: SOP.DISCARD_RANGE, start: probe, end: high });
      ops.push({ type: SOP.VISIT,         index: probe });
      high = probe - 1;
      if (high >= 0) ops.push({ type: SOP.SET_HIGH, index: high });
    }
  }

  ops.push({ type: SOP.NOT_FOUND });
  return ops;
}
