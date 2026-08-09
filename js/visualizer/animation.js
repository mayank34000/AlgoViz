import { OP, SOP, STATUS } from '../constants.js';
import { speedToDelay } from '../utils.js';
import { getState } from '../state.js';

export class AnimationEngine {
  constructor(renderer, { onStatUpdate, onFinish, onStatusChange }) {
    this.renderer = renderer;
    this.onStatUpdate = onStatUpdate;
    this.onFinish = onFinish;
    this.onStatusChange = onStatusChange;

    this._ops = [];
    this._index = 0;
    this._status = STATUS.IDLE;
    this._timerId = null;
    this._stats = _emptyStats();
    this._startTime = 0;
    this._elapsed = 0;
    this._timerInterval = null;
  }

  load(operations) {
    this._ops = operations;
    this._index = 0;
    this._stats = _emptyStats();
    this._elapsed = 0;
  }

  start() {
    this._status = STATUS.RUNNING;
    this._startTime = Date.now() - this._elapsed;
    this._startElapsedTimer();
    this.onStatusChange(STATUS.RUNNING);
    this._scheduleNext();
  }

  pause() {
    if (this._status !== STATUS.RUNNING) return;
    this._status = STATUS.PAUSED;
    clearTimeout(this._timerId);
    this._stopElapsedTimer();
    this._elapsed = Date.now() - this._startTime;
    this.onStatusChange(STATUS.PAUSED);
  }

  resume() {
    if (this._status !== STATUS.PAUSED) return;
    this._status = STATUS.RUNNING;
    this._startTime = Date.now() - this._elapsed;
    this._startElapsedTimer();
    this.onStatusChange(STATUS.RUNNING);
    this._scheduleNext();
  }

  stop(silent = false) {
    this._status = STATUS.IDLE;
    clearTimeout(this._timerId);
    this._stopElapsedTimer();
    this._ops = [];
    this._index = 0;
    if (!silent) {
      this.renderer.resetColors();
      this.onStatusChange(STATUS.IDLE);
    }
  }

  reset() {
    this.stop(true);
    this._stats = _emptyStats();
    this._elapsed = 0;
  }

  get status()   { return this._status; }
  get isActive() { return this._status === STATUS.RUNNING || this._status === STATUS.PAUSED; }

  // ─── Private ──────────────────────────────────────────────────

  _scheduleNext() {
    if (this._status !== STATUS.RUNNING) return;
    if (this._index >= this._ops.length) { this._finish(); return; }

    const delay = speedToDelay(getState().speed);
    const BROWSER_MIN = 4;
    const opsPerTick = delay < BROWSER_MIN ? Math.ceil(BROWSER_MIN / Math.max(delay, 0.5)) : 1;

    this._timerId = setTimeout(() => this._processBatch(opsPerTick), Math.max(delay, 0));
  }

  _processBatch(count) {
    if (this._status !== STATUS.RUNNING) return;

    for (let i = 0; i < count && this._index < this._ops.length; i++) {
      const op = this._ops[this._index++];
      this._applyStats(op);
      this.renderer.applyOperation(op);
    }

    if (this._index >= this._ops.length) { this._finish(); return; }

    this.onStatUpdate({ ...this._stats, elapsed: Date.now() - this._startTime });
    this._scheduleNext();
  }

  _applyStats(op) {
    switch (op.type) {
      // Sorting ops
      case OP.COMPARE:   this._stats.comparisons++; break;
      case OP.SWAP:      this._stats.swaps++;        break;
      case OP.OVERWRITE: this._stats.writes++;       break;
      // Searching ops
      case SOP.COMPARE:
        this._stats.comparisons++;
        this._stats.currentIndex = op.index;
        break;
      case SOP.VISIT:
        this._stats.visited++;
        break;
      case SOP.FOUND:
        this._stats.foundIndex = op.index;
        break;
      case SOP.NOT_FOUND:
        this._stats.foundIndex = -1;
        break;
    }
  }

  _finish() {
    this._status = STATUS.FINISHED;
    this._stopElapsedTimer();
    this.renderer.markAllSorted();
    this.onStatusChange(STATUS.FINISHED);
    this.onFinish({ ...this._stats, elapsed: Date.now() - this._startTime });
  }

  _startElapsedTimer() {
    this._timerInterval = setInterval(() => {
      if (this._status === STATUS.RUNNING) {
        this.onStatUpdate({ ...this._stats, elapsed: Date.now() - this._startTime });
      }
    }, 100);
  }

  _stopElapsedTimer() {
    clearInterval(this._timerInterval);
  }
}

function _emptyStats() {
  return { comparisons: 0, swaps: 0, writes: 0, visited: 0, currentIndex: -1, foundIndex: -2 };
}
