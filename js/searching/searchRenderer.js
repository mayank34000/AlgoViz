import { SOP } from '../constants.js';

/*
  SearchRenderer — renders an array of cells (not bars).

  Designed to be a drop-in renderer for the shared AnimationEngine.
  The interface (applyOperation, resetColors, markAllSorted) is identical
  to the sorting Renderer so the engine needs no modification.
*/
export class SearchRenderer {
  constructor(container) {
    this.container  = container;
    this.cells      = [];
    this.values     = [];
    this.colorState = []; // 'default'|'compare'|'visited'|'discard'|'found'
  }

  init(array) {
    this.values     = [...array];
    this.colorState = new Array(array.length).fill('default');
    this._buildCells();
  }

  applyOperation(op) {
    // Clear transient compare highlights before each new op
    if (op.type !== SOP.COMPARE) this._clearCompare();

    switch (op.type) {
      case SOP.COMPARE:
        this._clearCompare();
        this._setState(op.index, 'compare');
        break;

      case SOP.VISIT:
        this._setState(op.index, 'visited');
        break;

      case SOP.DISCARD:
        this._setState(op.index, 'discard');
        break;

      case SOP.DISCARD_RANGE:
        for (let i = op.start; i <= op.end; i++) {
          if (this.colorState[i] !== 'found') this._setState(i, 'discard');
        }
        break;

      case SOP.FOUND:
        this._clearCompare();
        this._setState(op.index, 'found');
        break;

      case SOP.NOT_FOUND:
        this._clearCompare();
        break;

      case SOP.SET_LOW:
        this._setPointer('low', op.index);
        break;

      case SOP.SET_HIGH:
        this._setPointer('high', op.index);
        break;

      case SOP.SET_MID:
        this._setPointer('mid', op.index);
        break;
    }
  }

  // Called when the engine finishes — clear any lingering transient states
  markAllSorted() {
    this._clearCompare();
    this._removeAllPointers();
  }

  resetColors() {
    this.cells.forEach((cell, i) => {
      cell.className = 'search-cell state-default';
      this.colorState[i] = 'default';
    });
    this._removeAllPointers();
  }

  reset(array) {
    this.init(array);
  }

  // ─── Private ──────────────────────────────────────────────────

  _buildCells() {
    this.container.innerHTML = '';

    // Adapt font size / min-width for large arrays
    const isLarge = this.values.length > 30;
    this.container.classList.toggle('cells-large', isLarge);

    this.cells = this.values.map((val, i) => {
      const cell = document.createElement('div');
      cell.className    = 'search-cell state-default';
      cell.dataset.index = i;

      const vEl = document.createElement('span');
      vEl.className   = 'cell-value';
      vEl.textContent = val;

      const iEl = document.createElement('span');
      iEl.className   = 'cell-index';
      iEl.textContent = i;

      cell.appendChild(vEl);
      cell.appendChild(iEl);
      this.container.appendChild(cell);
      return cell;
    });
  }

  _setState(index, state) {
    const cell = this.cells[index];
    if (!cell) return;
    cell.classList.remove('state-default','state-compare','state-visited','state-discard','state-found');
    cell.classList.add(`state-${state}`);
    this.colorState[index] = state;
  }

  _clearCompare() {
    this.colorState.forEach((s, i) => {
      if (s === 'compare') this._setState(i, 'default');
    });
  }

  _setPointer(type, index) {
    // Remove old pointer of this type from all cells
    this.cells.forEach(c => c.classList.remove(`ptr-${type}`));
    const cell = this.cells[index];
    if (cell && index >= 0 && index < this.cells.length) {
      cell.classList.add(`ptr-${type}`);
    }
  }

  _removeAllPointers() {
    this.cells.forEach(c => c.classList.remove('ptr-low', 'ptr-high', 'ptr-mid'));
  }
}
