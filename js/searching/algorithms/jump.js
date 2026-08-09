import { SOP } from '../../constants.js';

// Requires a sorted array.
export function jumpSearch(array, target) {
  const ops = [];
  const n    = array.length;
  const step = Math.floor(Math.sqrt(n));

  let blockStart = 0;
  let blockEnd   = step - 1;

  // Jump phase: skip whole blocks while block-end < target
  while (blockEnd < n && array[Math.min(blockEnd, n - 1)] < target) {
    const idx = Math.min(blockEnd, n - 1);
    ops.push({ type: SOP.COMPARE,       index: idx });
    ops.push({ type: SOP.DISCARD_RANGE, start: blockStart, end: idx });
    ops.push({ type: SOP.VISIT,         index: idx });

    blockStart = blockEnd + 1;
    blockEnd  += step;
  }

  // Linear scan within the surviving block
  const scanEnd = Math.min(blockEnd, n - 1);
  for (let i = blockStart; i <= scanEnd; i++) {
    ops.push({ type: SOP.COMPARE, index: i });

    if (array[i] === target) {
      ops.push({ type: SOP.FOUND, index: i });
      return ops;
    }

    ops.push({ type: SOP.VISIT, index: i });

    if (array[i] > target) break; // sorted — won't find it further right
  }

  ops.push({ type: SOP.NOT_FOUND });
  return ops;
}
