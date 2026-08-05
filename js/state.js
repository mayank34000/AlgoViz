import {
  STATUS,
  DEFAULT_ALGORITHM,
  DEFAULT_ARRAY_TYPE,
  ARRAY_SIZE_DEFAULT,
  SPEED_DEFAULT,
} from './constants.js';

const _state = {
  array:       [],
  arraySize:   ARRAY_SIZE_DEFAULT,
  arrayType:   DEFAULT_ARRAY_TYPE,
  algorithm:   DEFAULT_ALGORITHM,
  speed:       SPEED_DEFAULT,
  status:      STATUS.IDLE,
  stats: {
    comparisons: 0,
    swaps:       0,
    writes:      0,
    elapsed:     0,
    startTime:   null,
  },
  theme:       'dark',
};

const _listeners = new Set();

export function getState() {
  return _state;
}

export function setState(patch) {
  Object.assign(_state, patch);
  _notify();
}

export function setStats(patch) {
  Object.assign(_state.stats, patch);
}

export function resetStats() {
  _state.stats = {
    comparisons: 0,
    swaps:       0,
    writes:      0,
    elapsed:     0,
    startTime:   null,
  };
}

export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function _notify() {
  _listeners.forEach(fn => fn(_state));
}
