import { getState, setState, resetStats } from './state.js';
import { STATUS, DEFAULT_ALGORITHM } from './constants.js';
import { generateArray }     from './visualizer/arrayGenerator.js';
import { Renderer }          from './visualizer/renderer.js';
import { AnimationEngine }   from './visualizer/animation.js';
import { initControls, syncControlState } from './ui/controls.js';
import { initTheme, toggleTheme, getTheme } from './ui/theme.js';
import { renderDescription } from './ui/description.js';
import {
  updateLiveStats,
  updateAlgorithmStats,
  updateArraySize,
  updateStatus,
  resetStats as resetStatDisplay,
} from './ui/statistics.js';
import { getAlgorithm, getAllAlgorithms } from './data/algorithmInfo.js';
import { initRouter, navigateToVisualizer, navigateHome } from './ui/router.js';
import { initHome } from './ui/home.js';
import { showToast, qs } from './utils.js';

class App {
  constructor() {
    this.renderer = null;
    this.engine   = null;
    this._visualizerReady = false;
  }

  init() {
    initTheme();

    // Populate algo <select> eagerly — it's lightweight and needed the
    // moment the user navigates to the visualizer.
    _populateAlgorithmSelect();

    // Boot the router first — it sets #view-home visible and hides the
    // visualizer. The visualizer is not initialised yet.
    initRouter({
      onShowVisualizer: () => this._initVisualizer(),
    });

    // Render the landing page cards.
    initHome({
      onCategorySelect: id => {
        if (id === 'sorting') navigateToVisualizer();
        // Other categories: coming soon — no action needed.
      },
    });

    // Wire the home-page theme toggle (separate from the one inside the
    // visualizer header, which gets wired in _initVisualizer).
    _bindHomeThemeButton();
  }

  // ─── Lazy visualizer init ────────────────────────────────────
  // Called exactly once by the router when the user first navigates
  // to the visualizer view. Nothing here runs on page load.

  _initVisualizer() {
    if (this._visualizerReady) return;
    this._visualizerReady = true;

    this.renderer = new Renderer(qs('#bar-container'));
    this.engine   = new AnimationEngine(this.renderer, {
      onStatUpdate:   stats  => updateLiveStats(stats),
      onFinish:       stats  => this._onSortFinish(stats),
      onStatusChange: status => this._onStatusChange(status),
    });

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
      onHome:                  () => this._goHome(),
    });

    syncControlState(STATUS.IDLE, getState().algorithm);
    updateAlgorithmStats(getState().algorithm);
    renderDescription(getState().algorithm);
    updateStatus(STATUS.IDLE);
    updateArraySize(getState().arraySize);
  }

  // ─── Core actions ─────────────────────────────────────────────

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
    const { algorithm, status } = getState();
    if (status === STATUS.RUNNING) return;

    // After a completed sort, generate fresh before starting again.
    if (status === STATUS.FINISHED) {
      this._generate();
      return;
    }

    const info = getAlgorithm(algorithm);
    if (!info) return;

    const ops = info.fn([...getState().array]);
    this.engine.load(ops);
    this.engine.start();
    // engine.start() fires onStatusChange(RUNNING) → _onStatusChange
  }

  _stop() {
    this.engine.stop();
    this.renderer.reset(getState().array);
    resetStats();
    resetStatDisplay();
  }

  _reset() {
    this.engine.stop();
    this._generate();
  }

  _goHome() {
    // Gracefully stop any running sort before leaving
    if (this.engine?.isActive) {
      this.engine.stop();
      this.renderer.reset(getState().array);
      resetStats();
      resetStatDisplay();
    }
    navigateHome();
  }

  _changeAlgorithm(id) {
    if (this.engine?.isActive) return;
    setState({ algorithm: id });
    updateAlgorithmStats(id);
    renderDescription(id);
    const badge = qs('#header-algo-badge');
    if (badge) badge.textContent = getAlgorithm(id)?.name ?? id;
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
    btn?.setAttribute('title', isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)');
    if (isFullscreen) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  // ─── Engine callbacks ─────────────────────────────────────────

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

// ─── Bootstrap helpers ────────────────────────────────────────

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

// The home page has its own theme toggle independent of the visualizer header.
function _bindHomeThemeButton() {
  const btn = qs('#btn-home-theme');
  if (!btn) return;

  _setThemeIcon(btn, getTheme());

  btn.addEventListener('click', () => {
    const theme = toggleTheme();
    _setThemeIcon(btn, theme);
    // Keep the visualizer header button in sync (if already rendered)
    const vizBtn = qs('#btn-theme');
    if (vizBtn) _setThemeIcon(vizBtn, theme);
  });
}

function _setThemeIcon(btn, theme) {
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  btn.innerHTML = theme === 'dark'
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
}

const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());
