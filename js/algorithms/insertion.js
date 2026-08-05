import { OP } from '../constants.js';

export function insertionSort(array) {
  const ops = [];
  const arr = [...array];
  const n = arr.length;

  ops.push({ type: OP.SORTED, indices: [0] });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    ops.push({ type: OP.PIVOT, index: i });

    while (j >= 0 && arr[j] > key) {
      ops.push({ type: OP.COMPARE, indices: [j, j + 1] });
      ops.push({ type: OP.OVERWRITE, index: j + 1, value: arr[j] });
      arr[j + 1] = arr[j];
      j--;
    }

    ops.push({ type: OP.OVERWRITE, index: j + 1, value: key });
    arr[j + 1] = key;

    ops.push({ type: OP.SORTED, indices: [i] });
  }

  return ops;
}
