import { OP } from '../constants.js';

export function heapSort(array) {
  const ops = [];
  const arr = [...array];
  const n = arr.length;

  // Build max-heap (bottom-up)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    _heapify(arr, n, i, ops);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    ops.push({ type: OP.SWAP, a: 0, b: i });
    [arr[0], arr[i]] = [arr[i], arr[0]];

    ops.push({ type: OP.SORTED, indices: [i] });
    _heapify(arr, i, 0, ops);
  }

  ops.push({ type: OP.SORTED, indices: [0] });
  return ops;
}

function _heapify(arr, heapSize, root, ops) {
  let largest = root;
  const left  = 2 * root + 1;
  const right = 2 * root + 2;

  if (left < heapSize) {
    ops.push({ type: OP.COMPARE, indices: [left, largest] });
    if (arr[left] > arr[largest]) largest = left;
  }

  if (right < heapSize) {
    ops.push({ type: OP.COMPARE, indices: [right, largest] });
    if (arr[right] > arr[largest]) largest = right;
  }

  if (largest !== root) {
    ops.push({ type: OP.SWAP, a: root, b: largest });
    [arr[root], arr[largest]] = [arr[largest], arr[root]];
    _heapify(arr, heapSize, largest, ops);
  }
}
