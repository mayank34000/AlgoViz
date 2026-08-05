import { OP } from '../constants.js';

export function countingSort(array) {
  const ops = [];
  const arr = [...array];
  const n = arr.length;

  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;

  // Build count table
  const count = new Array(range).fill(0);
  for (let i = 0; i < n; i++) {
    count[arr[i] - min]++;
  }

  // Reconstruct sorted array via overwrites
  let pos = 0;
  for (let v = 0; v < range; v++) {
    while (count[v] > 0) {
      const value = v + min;
      ops.push({ type: OP.OVERWRITE, index: pos, value });
      arr[pos] = value;
      ops.push({ type: OP.SORTED, indices: [pos] });
      pos++;
      count[v]--;
    }
  }

  return ops;
}
