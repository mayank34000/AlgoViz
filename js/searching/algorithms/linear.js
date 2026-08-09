import { SOP } from '../../constants.js';

export function linearSearch(array, target) {
  const ops = [];

  for (let i = 0; i < array.length; i++) {
    ops.push({ type: SOP.COMPARE, index: i });

    if (array[i] === target) {
      ops.push({ type: SOP.FOUND, index: i });
      return ops;
    }

    ops.push({ type: SOP.VISIT, index: i });
  }

  ops.push({ type: SOP.NOT_FOUND });
  return ops;
}
