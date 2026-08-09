import { SOP } from '../../constants.js';

// Requires a sorted array.
// Phase 1: double the bound until element could be in range.
// Phase 2: binary search in that range.
export function exponentialSearch(array, target) {
  const ops = [];
  const n   = array.length;

  if (n === 0) { ops.push({ type: SOP.NOT_FOUND }); return ops; }

  // Check first element
  ops.push({ type: SOP.COMPARE, index: 0 });
  if (array[0] === target) { ops.push({ type: SOP.FOUND, index: 0 }); return ops; }
  ops.push({ type: SOP.VISIT, index: 0 });

  // Double bound until arr[bound] >= target or end of array
  let bound = 1;
  while (bound < n && array[bound] < target) {
    ops.push({ type: SOP.COMPARE, index: bound });
    ops.push({ type: SOP.VISIT,   index: bound });
    bound *= 2;
  }

  // Binary search in [bound/2, min(bound, n-1)]
  const bLow  = Math.floor(bound / 2) + 1;
  const bHigh = Math.min(bound, n - 1);

  // Discard ranges outside our window
  if (bLow > 1)      ops.push({ type: SOP.DISCARD_RANGE, start: 1,     end: bLow - 1 });
  if (bHigh < n - 1) ops.push({ type: SOP.DISCARD_RANGE, start: bHigh + 1, end: n - 1 });

  ops.push({ type: SOP.SET_LOW,  index: bLow });
  ops.push({ type: SOP.SET_HIGH, index: bHigh });

  let low = bLow, high = bHigh;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    ops.push({ type: SOP.SET_MID,  index: mid });
    ops.push({ type: SOP.COMPARE,  index: mid });

    if (array[mid] === target) {
      ops.push({ type: SOP.FOUND, index: mid });
      return ops;
    }

    if (array[mid] < target) {
      ops.push({ type: SOP.DISCARD_RANGE, start: low, end: mid });
      low = mid + 1;
      if (low <= high) ops.push({ type: SOP.SET_LOW, index: low });
    } else {
      ops.push({ type: SOP.DISCARD_RANGE, start: mid, end: high });
      high = mid - 1;
      if (high >= low) ops.push({ type: SOP.SET_HIGH, index: high });
    }
  }

  ops.push({ type: SOP.NOT_FOUND });
  return ops;
}
