import { getState, setState, resetStats } from './state.js';
import { STATUS, DEFAULT_ALGORITHM, DEFAULT_ARRAY_TYPE, ARRAY_SIZE_DEFAULT, SPEED_DEFAULT } from './constants.js';
import { generateArray }     from './visualizer/arrayGenerator.js';
import { Renderer }          from './visualizer/renderer.js';
import { AnimationEngine }   from './visualizer/animation.js';
import { initControls, syncControlState } from './ui/controls.js';
import { initTheme, getTheme }  from './ui/theme.js';
import { renderDescription }    from './ui/description.js';
import { initStatistics, updateLiveStats, updateAlgorithmStats, updateArraySize, updateStatus, resetStats as resetStatDisplay } from './ui/statistics.js';
import { getAlgorithm, getAllAlgorithms } from './data/algorithmInfo.js';
import { showToast, qs } from './utils.js';

class App {
  constructor() {
    this.renderer = null;
    this.engine   = null;
  }

  init() {
    initTheme();
    _populateAlgorithmSelect();

    this.renderer = new Renderer(qs('#bar-container'));
    this.engine   = new AnimationEngine(this.renderer, {
      onStatUpdate:   stats => updateLiveStats(stats),
      onFinish:       stats => this._onSortFinish(stats),
      onStatusChange: status => this._onStatusChange(status),
    });

    initStatistics();
    this._generate();

    initControls({
      onAlgorithmChange: id    => this._changeAlgorithm(id),
      onArrayTypeChange: type  => this._changeArrayType(type),
      onSizeChange:      size  => this._changeSize(size),
      onSpeedChange:     speed => setState({ speed }),
      onGenerate:              () => this._generate(),
      onStart:                 () => this._start(),
      onPause:                 () => this.engine.pause(),
      onResume:                () => this.engine.resume(),
      onStop:                  () => this._stop(),
      onReset:                 () => this._reset(),
      onFullscreen:            () => this._toggleFullscreen(),
    });

    syncControlState(STATUS.IDLE, getState().algorithm);
    updateAlgorithmStats(getState().algorithm);
    renderDescription(getState().algorithm);
    updateStatus(STATUS.IDLE);
    updateArraySize(getState().arraySize);
  }

  // ─── User actions ────────────────────────────────────────────

  _generate() {
    if (this.engine?.isActive) return;

    const { arraySize, arrayType, algorithm } = getState();
    const arr = generateArray(arraySize, arrayType);

    setState({ array: arr, status: STATUS.IDLE });
    resetStats();
    resetStatDisplay();

    this.renderer.init(arr);
    this.engine.reset();

    syncControlState(STATUS.IDLE, algorithm);
    updateStatus(STATUS.IDLE);
    updateArraySize(arraySize);
  }

  _start() {
    const { array, algorithm, status } = getState();

    if (status === STATUS.RUNNING) return;
    if (status === STATUS.FINISHED) this._generate();

    const info = getAlgorithm(algorithm);
    if (!info) return;

    const ops = info.fn([...array]);
    this.engine.load(ops);
    this.engine.start();

    setState({ status: STATUS.RUNNING });
    syncControlState(STATUS.RUNNING, algorithm);
  }

  _stop() {
    this.engine.stop();
    const { array } = getState();
    this.renderer.reset(array);
    setState({ status: STATUS.IDLE });
    resetStats();
    resetStatDisplay();
    syncControlState(STATUS.IDLE, getState().algorithm);
    updateStatus(STATUS.IDLE);
  }

  _reset() {
    this.engine.stop();
    const { algorithm } = getState();
    setState({ status: STATUS.IDLE });
    resetStatDisplay();
    syncControlState(STATUS.IDLE, algorithm);
    updateStatus(STATUS.IDLE);
    this._generate();
  }

  _changeAlgorithm(id) {
    if (this.engine?.isActive) return;
    setState({ algorithm: id });
    updateAlgorithmStats(id);
    renderDescription(id);

    const headerBadge = qs('#header-algo-badge');
    if (headerBadge) headerBadge.textContent = getAlgorithm(id)?.name ?? id;
  }

  _changeArrayType(type) {
    if (this.engine?.isActive) return;
    setState({ arrayType: type });
    this._generate();
  }

  _changeSize(size) {
    if (this.engine?.isActive) return;
    setState({ arraySize: size });
    this._generate();
  }

  _toggleFullscreen() {
    const isFullscreen = document.body.classList.toggle('is-fullscreen');
    setState({ isFullscreen });

    const btn = qs('#btn-fullscreen');
    btn?.classList.toggle('active', isFullscreen);
    btn?.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
    btn?.setAttribute('title', isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)');

    if (isFullscreen) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  // ─── Engine callbacks ────────────────────────────────────────

  _onStatusChange(status) {
    setState({ status });
    syncControlState(status, getState().algorithm);
    updateStatus(status);
  }

  _onSortFinish(stats) {
    setState({ status: STATUS.FINISHED });
    updateLiveStats(stats);
    updateStatus(STATUS.FINISHED);
    syncControlState(STATUS.FINISHED, getState().algorithm);

    const area = qs('#visualizer-area');
    area?.classList.add('finished');
    setTimeout(() => area?.classList.remove('finished'), 1200);

    showToast('Sorting complete ✓', 2000);
  }
}

// ─── Bootstrap ────────────────────────────────────────────────

function _populateAlgorithmSelect() {
  const select = qs('#algo-select');
  if (!select) return;

  getAllAlgorithms().forEach(algo => {
    const opt = document.createElement('option');
    opt.value = algo.id;
    opt.textContent = algo.name;
    if (algo.id === DEFAULT_ALGORITHM) opt.selected = true;
    select.appendChild(opt);
  });

  const badge = qs('#header-algo-badge');
  if (badge) badge.textContent = getAlgorithm(DEFAULT_ALGORITHM)?.name ?? '';
}

const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());
