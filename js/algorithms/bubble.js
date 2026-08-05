import { OP } from '../constants.js';

export function bubbleSort(array) {
  const ops = [];
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - 1 - i; j++) {
      ops.push({ type: OP.COMPARE, indices: [j, j + 1] });

      if (arr[j] > arr[j + 1]) {
        ops.push({ type: OP.SWAP, a: j, b: j + 1 });
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    ops.push({ type: OP.SORTED, indices: [n - 1 - i] });

    if (!swapped) {
      // Early exit: mark remaining elements as sorted
      const remaining = Array.from({ length: n - 1 - i }, (_, k) => k);
      if (remaining.length) ops.push({ type: OP.SORTED, indices: remaining });
      break;
    }
  }

  ops.push({ type: OP.SORTED, indices: [0] });
  return ops;
}
