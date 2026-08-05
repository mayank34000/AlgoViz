import { OP } from '../constants.js';

export function mergeSort(array) {
  const ops = [];
  const arr = [...array];
  _mergeSort(arr, 0, arr.length - 1, ops);
  return ops;
}

function _mergeSort(arr, left, right, ops) {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);
  _mergeSort(arr, left, mid, ops);
  _mergeSort(arr, mid + 1, right, ops);
  _merge(arr, left, mid, right, ops);
}

function _merge(arr, left, mid, right, ops) {
  const leftSlice  = arr.slice(left, mid + 1);
  const rightSlice = arr.slice(mid + 1, right + 1);

  let i = 0;
  let j = 0;
  let k = left;

  while (i < leftSlice.length && j < rightSlice.length) {
    ops.push({ type: OP.COMPARE, indices: [left + i, mid + 1 + j] });

    if (leftSlice[i] <= rightSlice[j]) {
      ops.push({ type: OP.OVERWRITE, index: k, value: leftSlice[i] });
      arr[k] = leftSlice[i];
      i++;
    } else {
      ops.push({ type: OP.OVERWRITE, index: k, value: rightSlice[j] });
      arr[k] = rightSlice[j];
      j++;
    }
    k++;
  }

  while (i < leftSlice.length) {
    ops.push({ type: OP.OVERWRITE, index: k, value: leftSlice[i] });
    arr[k] = leftSlice[i];
    i++;
    k++;
  }

  while (j < rightSlice.length) {
    ops.push({ type: OP.OVERWRITE, index: k, value: rightSlice[j] });
    arr[k] = rightSlice[j];
    j++;
    k++;
  }

  ops.push({ type: OP.RANGE_SORTED, start: left, end: right });
}
