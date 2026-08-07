import { OP } from '../constants.js';

export function radixSort(array) {
  const ops = [];
  const arr = [...array];
  const n = arr.length;

  const max = Math.max(...arr);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    _countingPassByDigit(arr, n, exp, ops);
  }

  ops.push({ type: OP.RANGE_SORTED, start: 0, end: n - 1 });
  return ops;
}

function _countingPassByDigit(arr, n, exp, ops) {
  const output = new Array(n).fill(0);
  const count  = new Array(10).fill(0);

  // Count occurrences
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }

  // Cumulative counts
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];

  // Build output array (right to left for stability)
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[--count[digit]] = arr[i];
  }

  // Copy back with overwrite operations
  for (let i = 0; i < n; i++) {
    if (arr[i] !== output[i]) {
      ops.push({ type: OP.OVERWRITE, index: i, value: output[i] });
    }
    arr[i] = output[i];
  }
}
