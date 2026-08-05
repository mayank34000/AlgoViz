import { OP, VALUE_MAX } from '../constants.js';

const BAR_STATE_CLASS = {
  [OP.COMPARE]:   'state-compare',
  [OP.SWAP]:      'state-swap',
  [OP.PIVOT]:     'state-pivot',
  [OP.SORTED]:    'state-sorted',
  [OP.OVERWRITE]: 'state-overwrite',
};

const TRANSIENT_STATES = new Set(['state-compare', 'state-swap', 'state-overwrite']);

export class Renderer {
  constructor(container) {
    this.container = container;
    this.bars = [];
    this.values = [];
    this.colorState = [];
  }

  init(array) {
    this.values = [...array];
    this.colorState = new Array(array.length).fill('default');
    this._buildBars();
  }

  _buildBars() {
    this.container.innerHTML = '';
    this.bars = this.values.map((val, i) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      this._setBarHeight(bar, val);
      bar.dataset.value = val;
      this.container.appendChild(bar);
      return bar;
    });

    // Show value labels on small arrays
    this.container.classList.toggle('bar-container--small', this.values.length <= 30);
  }

  applyOperation(op) {
    this._clearTransientColors();

    switch (op.type) {
      case OP.COMPARE:
        this._colorBars(op.indices, 'state-compare');
        break;

      case OP.SWAP:
        this._swapBars(op.a, op.b);
        this._colorBars([op.a, op.b], 'state-swap');
        break;

      case OP.OVERWRITE:
        this._updateBar(op.index, op.value);
        this._colorBar(op.index, 'state-overwrite');
        break;

      case OP.PIVOT:
        this._colorBar(op.index, 'state-pivot');
        this.colorState[op.index] = 'pivot';
        break;

      case OP.SORTED:
        this._colorBars(op.indices, 'state-sorted');
        op.indices.forEach(i => { this.colorState[i] = 'sorted'; });
        break;

      case OP.RANGE_SORTED:
        for (let i = op.start; i <= op.end; i++) {
          this._colorBar(i, 'state-sorted');
          this.colorState[i] = 'sorted';
        }
        break;

      case OP.MARK:
        this._colorBar(op.index, BAR_STATE_CLASS[op.state] ?? 'state-compare');
        break;

      case OP.CLEAR_MARKS:
        (op.indices ?? []).forEach(i => this._restoreBar(i));
        break;
    }
  }

  // Mark all bars sorted (final state)
  markAllSorted() {
    this.bars.forEach((bar, i) => {
      this._removeTransientClasses(bar);
      bar.classList.add('state-sorted');
      this.colorState[i] = 'sorted';
    });
  }

  resetColors() {
    this.bars.forEach((bar, i) => {
      bar.className = 'bar';
      this.colorState[i] = 'default';
    });
  }

  reset(array) {
    this.init(array);
  }

  // ─── Internals ────────────────────────────────────────────────

  _setBarHeight(bar, value) {
    bar.style.height = `${(value / VALUE_MAX) * 100}%`;
  }

  _updateBar(index, value) {
    this.values[index] = value;
    const bar = this.bars[index];
    if (!bar) return;
    this._setBarHeight(bar, value);
    bar.dataset.value = value;
  }

  _swapBars(a, b) {
    const valA = this.values[a];
    const valB = this.values[b];
    this._updateBar(a, valB);
    this._updateBar(b, valA);
    [this.colorState[a], this.colorState[b]] = [this.colorState[b], this.colorState[a]];
  }

  _colorBar(index, cls) {
    const bar = this.bars[index];
    if (!bar) return;
    this._removeTransientClasses(bar);
    bar.classList.add(cls);
  }

  _colorBars(indices, cls) {
    indices.forEach(i => this._colorBar(i, cls));
  }

  _restoreBar(index) {
    const bar = this.bars[index];
    if (!bar) return;
    this._removeTransientClasses(bar);

    const saved = this.colorState[index];
    if (saved === 'sorted') bar.classList.add('state-sorted');
    else if (saved === 'pivot') bar.classList.add('state-pivot');
  }

  _clearTransientColors() {
    this.bars.forEach((bar, i) => {
      const hasSorted = this.colorState[i] === 'sorted';
      const hasPivot  = this.colorState[i] === 'pivot';

      this._removeTransientClasses(bar);

      if (hasSorted) bar.classList.add('state-sorted');
      else if (hasPivot) bar.classList.add('state-pivot');
    });
  }

  _removeTransientClasses(bar) {
    bar.classList.remove(
      'state-compare',
      'state-swap',
      'state-overwrite',
      'state-sorted',
      'state-pivot'
    );
  }
}
