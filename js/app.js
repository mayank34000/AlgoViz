import { getState, setState, resetStats } from './state.js';
import { STATUS, DEFAULT_ALGORITHM }      from './constants.js';
import { generateArray }        from './visualizer/arrayGenerator.js';
import { Renderer }             from './visualizer/renderer.js';
import { AnimationEngine }      from './visualizer/animation.js';
import { initControls, syncControlState } from './ui/controls.js';
import { initTheme, toggleTheme, getTheme } from './ui/theme.js';
import { renderDescription }    from './ui/description.js';
import {
  updateLiveStats, updateAlgorithmStats,
  updateArraySize, updateStatus,
  resetStats as resetStatDisplay,
} from './ui/statistics.js';
import { getAlgorithm, getAllAlgorithms } from './data/algorithmInfo.js';
import { initRouter, navigate, navigateToVisualizer,
         navigateToSearching, navigateHome } from './ui/router.js';
import { initHome }      from './ui/home.js';
import { SearchingApp }  from './searchApp.js';
import { showToast, qs } from './utils.js';

// ─── Platform orchestrator ─────────────────────────────────────

class App {
  constructor() {
    this._sortRenderer = null;
    this._sortEngine   = null;
    this._sortReady    = false;

    this._searchApp    = new SearchingApp();
  }

  init() {
    initTheme();
    _populateAlgorithmSelect();

    // Register all views with the router. Lazy-init callbacks fire once.
    initRouter({
      home:       {},
      visualizer: { onFirst: () => this._initSorting() },
      searching:  { onFirst: () => this._searchApp.init() },
    });

    initHome({
      onCategorySelect: id => {
        if      (id === 'sorting')   navigateToVisualizer();
        else if (id === 'searching') navigateToSearching();
      },
    });

    _bindHomeThemeButton(this);
  }

  // ─── Sorting module (lazy init) ──────────────────────────────

  _initSorting() {
    if (this._sortReady) return;
    this._sortReady = true;

    this._sortRenderer = new Renderer(qs('#bar-container'));
    this._sortEngine   = new AnimationEngine(this._sortRenderer, {
      onStatUpdate:   s => updateLiveStats(s),
      onFinish:       s => this._onSortFinish(s),
      onStatusChange: s => this._onSortStatusChange(s),
    });

    this._generate();

    initControls({
      onAlgorithmChange: id    => this._changeAlgorithm(id),
      onArrayTypeChange: type  => this._changeArrayType(type),
      onSizeChange:      size  => this._changeSize(size),
      onSpeedChange:     speed => setState({ speed }),
      onGenerate:              () => this._generate(),
      onStart:                 () => this._start(),
      onPause:                 () => this._sortEngine.pause(),
      onResume:                () => this._sortEngine.resume(),
      onStop:                  () => this._stop(),
      onReset:                 () => this._reset(),
      onFullscreen:            () => this._toggleFullscreen(),
      onHome:                  () => this._goSortHome(),
    });

    syncControlState(STATUS.IDLE, getState().algorithm);
    updateAlgorithmStats(getState().algorithm);
    renderDescription(getState().algorithm);
    updateStatus(STATUS.IDLE);
    updateArraySize(getState().arraySize);
  }

  // ─── Sorting actions ─────────────────────────────────────────

  _generate() {
    if (this._sortEngine?.isActive) return;
    const { arraySize, arrayType, algorithm } = getState();
    const arr = generateArray(arraySize, arrayType);
    setState({ array: arr, status: STATUS.IDLE });
    resetStats();
    resetStatDisplay();
    this._sortRenderer.init(arr);
    this._sortEngine.reset();
    syncControlState(STATUS.IDLE, algorithm);
    updateStatus(STATUS.IDLE);
    updateArraySize(arraySize);
  }

  _start() {
    const { algorithm, status } = getState();
    if (status === STATUS.RUNNING) return;
    if (status === STATUS.FINISHED) { this._generate(); return; }
    const info = getAlgorithm(algorithm);
    if (!info) return;
    const ops = info.fn([...getState().array]);
    this._sortEngine.load(ops);
    this._sortEngine.start();
  }

  _stop() {
    this._sortEngine.stop();
    this._sortRenderer.reset(getState().array);
    resetStats();
    resetStatDisplay();
  }

  _reset() {
    this._sortEngine.stop();
    this._generate();
  }

  _changeAlgorithm(id) {
    if (this._sortEngine?.isActive) return;
    setState({ algorithm: id });
    updateAlgorithmStats(id);
    renderDescription(id);
    const badge = qs('#header-algo-badge');
    if (badge) badge.textContent = getAlgorithm(id)?.name ?? '';
  }

  _changeArrayType(type) {
    if (this._sortEngine?.isActive) return;
    setState({ arrayType: type });
    this._generate();
  }

  _changeSize(size) {
    if (this._sortEngine?.isActive) return;
    setState({ arraySize: size });
    this._generate();
  }

  _toggleFullscreen() {
    const full = document.body.classList.toggle('is-fullscreen');
    setState({ isFullscreen: full });
    const btn = qs('#btn-fullscreen');
    btn?.classList.toggle('active', full);
    btn?.setAttribute('title', full ? 'Exit fullscreen (F)' : 'Fullscreen (F)');
    if (full) document.documentElement.requestFullscreen?.().catch(() => {});
    else      document.exitFullscreen?.().catch(() => {});
  }

  _goSortHome() {
    if (this._sortEngine?.isActive) {
      this._sortEngine.stop();
      this._sortRenderer.reset(getState().array);
      resetStats();
      resetStatDisplay();
    }
    navigateHome();
  }

  // ─── Sorting engine callbacks ─────────────────────────────────

  _onSortStatusChange(status) {
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

  // Blank placeholder
  const ph = document.createElement('option');
  ph.value = ''; ph.textContent = '— Select Algorithm —'; ph.selected = true;
  select.appendChild(ph);

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

function _bindHomeThemeButton(app) {
  const btn = qs('#btn-home-theme');
  if (!btn) return;
  _setThemeIcon(btn, getTheme());
  btn.addEventListener('click', () => {
    const t = toggleTheme();
    _setThemeIcon(btn, t);
    _setThemeIcon(qs('#btn-theme'),        t);
    _setThemeIcon(qs('#search-btn-theme'), t);
  });
}

function _setThemeIcon(btn, theme) {
  if (!btn) return;
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  btn.innerHTML = theme === 'dark'
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
}

const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());
