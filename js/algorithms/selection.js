import { OP } from '../constants.js';

export function selectionSort(array) {
  const ops = [];
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    // Mark current position
    ops.push({ type: OP.PIVOT, index: i });

    for (let j = i + 1; j < n; j++) {
      ops.push({ type: OP.COMPARE, indices: [minIdx, j] });

      if (arr[j] < arr[minIdx]) {
        // Clear old min highlight
        if (minIdx !== i) ops.push({ type: OP.CLEAR_MARKS, indices: [minIdx] });
        minIdx = j;
        ops.push({ type: OP.PIVOT, index: minIdx });
      }
    }

    if (minIdx !== i) {
      ops.push({ type: OP.SWAP, a: i, b: minIdx });
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }

    ops.push({ type: OP.SORTED, indices: [i] });
  }

  ops.push({ type: OP.SORTED, indices: [n - 1] });
  return ops;
}
