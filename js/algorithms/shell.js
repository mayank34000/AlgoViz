import { OP } from '../constants.js';

export function shellSort(array) {
  const ops = [];
  const arr = [...array];
  const n = arr.length;

  // Knuth gap sequence: 1, 4, 13, 40, 121, ...
  let gap = 1;
  while (gap < Math.floor(n / 3)) gap = gap * 3 + 1;

  while (gap >= 1) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      ops.push({ type: OP.PIVOT, index: i });

      let j = i;
      while (j >= gap) {
        ops.push({ type: OP.COMPARE, indices: [j - gap, j] });

        if (arr[j - gap] <= temp) break;

        ops.push({ type: OP.OVERWRITE, index: j, value: arr[j - gap] });
        arr[j] = arr[j - gap];
        j -= gap;
      }

      ops.push({ type: OP.OVERWRITE, index: j, value: temp });
      arr[j] = temp;
    }

    gap = Math.floor(gap / 3);
  }

  // Mark all as sorted after completion
  ops.push({ type: OP.RANGE_SORTED, start: 0, end: n - 1 });
  return ops;
}
