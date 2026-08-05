import { OP } from '../constants.js';

export function bucketSort(array) {
  const ops = [];
  const arr = [...array];
  const n = arr.length;

  if (n <= 1) return ops;

  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const bucketCount = Math.max(2, Math.floor(Math.sqrt(n)));
  const range = max - min + 1;

  // Distribute elements into buckets
  const buckets = Array.from({ length: bucketCount }, () => []);
  for (let i = 0; i < n; i++) {
    const bucketIdx = Math.min(
      Math.floor(((arr[i] - min) / range) * bucketCount),
      bucketCount - 1
    );
    ops.push({ type: OP.COMPARE, indices: [i] });
    buckets[bucketIdx].push(arr[i]);
  }

  // Sort each bucket (insertion sort) and write back
  let pos = 0;
  for (const bucket of buckets) {
    _insertionSort(bucket);
    for (const value of bucket) {
      ops.push({ type: OP.OVERWRITE, index: pos, value });
      arr[pos] = value;
      ops.push({ type: OP.SORTED, indices: [pos] });
      pos++;
    }
  }

  return ops;
}

function _insertionSort(bucket) {
  for (let i = 1; i < bucket.length; i++) {
    const key = bucket[i];
    let j = i - 1;
    while (j >= 0 && bucket[j] > key) {
      bucket[j + 1] = bucket[j];
      j--;
    }
    bucket[j + 1] = key;
  }
}
