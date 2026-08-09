import { SOP } from '../../constants.js';

// Requires a sorted array.
// Uses Fibonacci numbers to divide the array rather than halving it.
export function fibonacciSearch(array, target) {
  const ops = [];
  const n   = array.length;

  // Build smallest Fibonacci number >= n
  let fib2 = 0; // F(k-2)
  let fib1 = 1; // F(k-1)
  let fib  = 1; // F(k)
  while (fib < n) { fib2 = fib1; fib1 = fib; fib = fib1 + fib2; }

  let offset = -1; // excluded left boundary

  while (fib > 1) {
    const i = Math.min(offset + fib2, n - 1);

    ops.push({ type: SOP.SET_MID,  index: i });
    ops.push({ type: SOP.COMPARE,  index: i });

    if (target > array[i]) {
      // Target is in the right sub-array — discard left portion
      const discardEnd = i < n - 1 ? i : i - 1;
      if (offset + 1 <= discardEnd) {
        ops.push({ type: SOP.DISCARD_RANGE, start: offset + 1, end: discardEnd });
      }
      ops.push({ type: SOP.VISIT, index: i });
      fib  = fib1; fib1 = fib2; fib2 = fib - fib1;
      offset = i;
    } else if (target < array[i]) {
      // Target is in the left sub-array — discard right portion
      if (i + 1 <= n - 1) {
        ops.push({ type: SOP.DISCARD_RANGE, start: i, end: n - 1 });
      }
      ops.push({ type: SOP.VISIT, index: i });
      fib  = fib2; fib1 = fib1 - fib2; fib2 = fib - fib1;
    } else {
      ops.push({ type: SOP.FOUND, index: i });
      return ops;
    }
  }

  // One remaining element to check
  if (fib1 > 0 && offset + 1 < n) {
    const last = offset + 1;
    ops.push({ type: SOP.COMPARE, index: last });
    if (array[last] === target) {
      ops.push({ type: SOP.FOUND, index: last });
      return ops;
    }
    ops.push({ type: SOP.VISIT, index: last });
  }

  ops.push({ type: SOP.NOT_FOUND });
  return ops;
}
