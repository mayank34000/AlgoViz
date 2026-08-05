import { OP } from '../constants.js';

export function quickSort(array) {
  const ops = [];
  const arr = [...array];
  _quickSort(arr, 0, arr.length - 1, ops);
  return ops;
}

function _quickSort(arr, low, high, ops) {
  if (low < high) {
    const pivotIdx = _partition(arr, low, high, ops);
    _quickSort(arr, low, pivotIdx - 1, ops);
    _quickSort(arr, pivotIdx + 1, high, ops);
  } else if (low === high) {
    ops.push({ type: OP.SORTED, indices: [low] });
  }
}

function _partition(arr, low, high, ops) {
  const pivot = arr[high];
  ops.push({ type: OP.PIVOT, index: high });

  let i = low - 1;

  for (let j = low; j < high; j++) {
    ops.push({ type: OP.COMPARE, indices: [j, high] });

    if (arr[j] <= pivot) {
      i++;
      if (i !== j) {
        ops.push({ type: OP.SWAP, a: i, b: j });
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
  }

  const pivotFinal = i + 1;
  if (pivotFinal !== high) {
    ops.push({ type: OP.SWAP, a: pivotFinal, b: high });
    [arr[pivotFinal], arr[high]] = [arr[high], arr[pivotFinal]];
  }

  ops.push({ type: OP.SORTED, indices: [pivotFinal] });
  return pivotFinal;
}
