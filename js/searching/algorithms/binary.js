import { SOP } from '../../constants.js';

// Requires a sorted array.
export function binarySearch(array, target) {
  const ops = [];
  let low = 0, high = array.length - 1;

  ops.push({ type: SOP.SET_LOW,  index: low });
  ops.push({ type: SOP.SET_HIGH, index: high });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    ops.push({ type: SOP.SET_MID,   index: mid });
    ops.push({ type: SOP.COMPARE,   index: mid });

    if (array[mid] === target) {
      ops.push({ type: SOP.FOUND, index: mid });
      return ops;
    }

    if (array[mid] < target) {
      ops.push({ type: SOP.DISCARD_RANGE, start: low, end: mid });
      low = mid + 1;
      ops.push({ type: SOP.SET_LOW, index: low });
    } else {
      ops.push({ type: SOP.DISCARD_RANGE, start: mid, end: high });
      high = mid - 1;
      if (high >= 0) ops.push({ type: SOP.SET_HIGH, index: high });
    }
  }

  ops.push({ type: SOP.NOT_FOUND });
  return ops;
}
