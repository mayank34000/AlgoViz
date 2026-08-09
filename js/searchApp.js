import { getState, setState }   from './state.js';
import { STATUS, SOP, SEARCH_SIZE_DEFAULT, SPEED_DEFAULT, DEFAULT_SEARCH_ALGO } from './constants.js';
import { AnimationEngine }      from './visualizer/animation.js';
import { SearchRenderer }       from './searching/searchRenderer.js';
import { getSearchAlgorithm, getAllSearchAlgorithms } from './searching/searchInfo.js';
import { navigateHome }         from './ui/router.js';
import { toggleTheme, getTheme } from './ui/theme.js';
import { showToast, qs, qsa, formatTime, formatNumber, randomInt } from './utils.js';

/*
  SearchingApp — self-contained module that manages the entire
  searching experience. Mirrors the structure of the App class
  in app.js but operates on its own DOM view (#view-searching).
*/
export class SearchingApp {
  constructor() {
    this.renderer  = null;
    this.engine    = null;
    this._ready    = false;

    // Local state (separate from sorting state in state.js)
    this._algo     = DEFAULT_SEARCH_ALGO;
    this._size     = SEARCH_SIZE_DEFAULT;
    this._speed    = SPEED_DEFAULT;
    this._target   = null;
    this._array    = [];
    this._useSorted = true; // default: sorted array
    this._status   = STATUS.IDLE;
  }

  // Called once by the router when user first navigates to searching
  init() {
    if (this._ready) return;
    this._ready = true;

    this.renderer = new SearchRenderer(qs('#search-cell-container'));
    this.engine   = new AnimationEngine(this.renderer, {
      onStatUpdate:   stats  => this._updateStats(stats),
      onFinish:       stats  => this._onFinish(stats),
      onStatusChange: status => this._onStatusChange(status),
    });

    _populateSearchAlgoSelect();
    this._generate();
    this._bindControls();
    this._syncControlState();
    this._updateAlgoInfo(this._algo);
  }

  // ─── Core actions ─────────────────────────────────────────────

  _generate() {
    if (this.engine?.isActive) return;

    this._array  = _buildArray(this._size, this._useSorted);
    this._target = _pickTarget(this._array);

    this.renderer.init(this._array);
    this.engine.reset();

    _updateTargetDisplay(this._target);
    _updateSearchTargetInput(this._target);
    _resetStatDisplay();
    this._syncControlState();
    _setText('#search-stat-array-size', String(this._size));
    _setText('#search-stat-target', String(this._target));
  }

  _start() {
    if (this._status === STATUS.RUNNING) return;

    if (this._status === STATUS.FINISHED) {
      this._generate();
      return;
    }

    const info = getSearchAlgorithm(this._algo);
    if (!info) return;

    // Validate sorted requirement
    if (info.requiresSorted && !this._useSorted) {
      showToast('This algorithm needs a sorted array — switching to sorted.', 2800);
      this._useSorted = true;
      _setArrayTypeBtnActive('sorted');
      this._generate();
      return;
    }

    if (this._target === null || this._target === undefined) {
      showToast('Please enter a target value.', 2000);
      return;
    }

    const ops = info.fn([...this._array], this._target);
    this.engine.load(ops);
    _setText('#search-stat-target', String(this._target));
    this.engine.start();
  }

  _stop() {
    this.engine.stop();
    this.renderer.reset(this._array);
    _resetStatDisplay();
  }

  _reset() {
    this.engine.stop();
    this._generate();
  }

  _changeAlgo(id) {
    if (this.engine?.isActive) return;
    this._algo = id;
    this._updateAlgoInfo(id);

    // Auto-switch to sorted if this algorithm requires it
    const info = getSearchAlgorithm(id);
    if (info?.requiresSorted && !this._useSorted) {
      this._useSorted = true;
      _setArrayTypeBtnActive('sorted');
      this._generate();
    }

    const badge = qs('#search-header-badge');
    if (badge) badge.textContent = getSearchAlgorithm(id)?.name ?? id;
  }

  _changeSize(size) {
    if (this.engine?.isActive) return;
    this._size = size;
    this._generate();
  }

  _changeSpeed(speed) {
    this._speed = speed;
    // Propagate to global state so speedToDelay() picks it up
    setState({ speed });
  }

  _changeTarget(val) {
    const n = Number(val);
    this._target = isNaN(n) ? null : n;
    _updateTargetDisplay(this._target);
    _setText('#search-stat-target', this._target !== null ? String(this._target) : '—');
  }

  _randomTarget() {
    this._target = _pickTarget(this._array);
    _updateTargetDisplay(this._target);
    _updateSearchTargetInput(this._target);
    _setText('#search-stat-target', String(this._target));
  }

  _changeArrayType(type) {
    if (this.engine?.isActive) return;
    this._useSorted = type === 'sorted';
    this._generate();
  }

  _goHome() {
    if (this.engine?.isActive) {
      this.engine.stop();
      _resetStatDisplay();
    }
    navigateHome();
  }

  // ─── Engine callbacks ─────────────────────────────────────────

  _onStatusChange(status) {
    this._status = status;
    this._syncControlState();
    _updateStatusBadge(status);
  }

  _onFinish(stats) {
    this._status = STATUS.FINISHED;
    this._updateStats(stats);
    this._syncControlState();
    _updateStatusBadge(STATUS.FINISHED);

    const found = stats.foundIndex >= 0;
    _showSearchResult(found, stats.foundIndex, this._target);

    showToast(found
      ? `Found ${this._target} at index ${stats.foundIndex} ✓`
      : `${this._target} not found in array`,
      2500
    );
  }

  _updateStats({ comparisons, visited, currentIndex, foundIndex, elapsed }) {
    _setText('#search-stat-comparisons', formatNumber(comparisons));
    _setText('#search-stat-visited',     formatNumber(visited));
    _setText('#search-stat-current',
      currentIndex >= 0 ? String(currentIndex) : '—'
    );
    _setText('#search-stat-found',
      foundIndex >= 0  ? String(foundIndex)    : foundIndex === -1 ? 'Not found' : '—'
    );
    _setText('#search-stat-elapsed', formatTime(elapsed));
  }

  _updateAlgoInfo(id) {
    const info = getSearchAlgorithm(id);
    if (!info) return;

    _setText('#search-stat-algorithm', info.name);
    _setText('#search-stat-best',      info.best);
    _setText('#search-stat-worst',     info.worst);
    _setText('#search-stat-space',     info.space);

    _renderSearchDescription(info);

    // Show or hide the sorted-array notice
    const notice = qs('#search-sorted-notice');
    if (notice) notice.style.display = info.requiresSorted ? '' : 'none';
  }

  // ─── Controls binding ─────────────────────────────────────────

  _bindControls() {
    const s = this; // alias for callbacks

    // Algorithm select
    qs('#search-algo-select')?.addEventListener('change', e => {
      s._changeAlgo(e.target.value);
    });

    // Array type buttons
    qsa('.search-array-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        qsa('.search-array-type-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        s._changeArrayType(btn.dataset.arrayType);
      });
    });

    // Size slider
    const sizeSlider = qs('#search-slider-size');
    if (sizeSlider) {
      sizeSlider.addEventListener('input', () => {
        _updateSliderFill(sizeSlider);
        _setText('#search-slider-size-val', sizeSlider.value);
        s._changeSize(Number(sizeSlider.value));
      });
      _updateSliderFill(sizeSlider);
    }

    // Speed slider
    const speedSlider = qs('#search-slider-speed');
    if (speedSlider) {
      speedSlider.addEventListener('input', () => {
        _updateSliderFill(speedSlider);
        _setText('#search-slider-speed-val', speedSlider.value);
        s._changeSpeed(Number(speedSlider.value));
      });
      _updateSliderFill(speedSlider);
    }

    // Target input
    const targetInput = qs('#search-target-input');
    if (targetInput) {
      targetInput.addEventListener('input',  () => s._changeTarget(targetInput.value));
      targetInput.addEventListener('change', () => s._changeTarget(targetInput.value));
    }

    qs('#btn-search-random-target')?.addEventListener('click', () => s._randomTarget());

    // Action buttons
    qs('#search-btn-generate')?.addEventListener('click', () => s._generate());
    qs('#search-btn-start')   ?.addEventListener('click', () => s._start());
    qs('#search-btn-pause')   ?.addEventListener('click', () => s.engine.pause());
    qs('#search-btn-resume')  ?.addEventListener('click', () => s.engine.resume());
    qs('#search-btn-stop')    ?.addEventListener('click', () => s._stop());
    qs('#search-btn-reset')   ?.addEventListener('click', () => s._reset());
    qs('#search-btn-home')    ?.addEventListener('click', () => s._goHome());

    // Theme toggle — syncs icon on all three theme buttons
    qs('#search-btn-theme')?.addEventListener('click', () => {
      const theme = toggleTheme();
      _syncAllThemeButtons(theme);
    });

    // Mobile menu
    const menuBtn   = qs('#search-mobile-menu-btn');
    const sidebar   = qs('#search-sidebar');
    const overlay   = qs('#search-sidebar-overlay');
    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay?.classList.add('active');
      });
      overlay?.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay?.classList.remove('active');
      });
    }

    // Keyboard shortcuts (only active when searching view is visible)
    document.addEventListener('keydown', e => {
      if (!qs('#view-searching.is-visible')) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (this._status === STATUS.IDLE || this._status === STATUS.FINISHED) this._start();
          else if (this._status === STATUS.RUNNING) this.engine.pause();
          else if (this._status === STATUS.PAUSED)  this.engine.resume();
          break;
        case 'r': case 'R': this._reset();   break;
        case 'g': case 'G': this._generate(); break;
        case 'h': case 'H': this._goHome();   break;
      }
    });
  }

  _syncControlState() {
    const isRunning  = this._status === STATUS.RUNNING;
    const isPaused   = this._status === STATUS.PAUSED;
    const isActive   = isRunning || isPaused;
    const isFinished = this._status === STATUS.FINISHED;

    _setDisabled('#search-btn-start',    isActive || isFinished);
    _setDisabled('#search-btn-pause',    !isRunning);
    _setDisabled('#search-btn-resume',   !isPaused);
    _setDisabled('#search-btn-stop',     !isActive);
    _setDisabled('#search-btn-reset',    false);
    _setDisabled('#search-btn-generate', isActive);

    const algoSelect = qs('#search-algo-select');
    if (algoSelect) algoSelect.disabled = isActive;

    qsa('.search-array-type-btn').forEach(btn => { btn.disabled = isActive; });
  }
}

// ─── Module-level helpers ──────────────────────────────────────

function _populateSearchAlgoSelect() {
  const select = qs('#search-algo-select');
  if (!select) return;

  getAllSearchAlgorithms().forEach(algo => {
    const opt = document.createElement('option');
    opt.value = algo.id;
    opt.textContent = algo.name + (algo.requiresSorted ? ' *' : '');
    if (algo.id === DEFAULT_SEARCH_ALGO) opt.selected = true;
    select.appendChild(opt);
  });

  const badge = qs('#search-header-badge');
  if (badge) badge.textContent = getSearchAlgorithm(DEFAULT_SEARCH_ALGO)?.name ?? '';
}

function _buildArray(size, sorted) {
  if (sorted) {
    // Uniformly spaced integers 1..100 — good for interpolation search
    const step = Math.max(1, Math.floor(100 / size));
    const arr  = Array.from({ length: size }, (_, i) => Math.max(1, (i + 1) * step));
    return arr;
  }
  return Array.from({ length: size }, () => randomInt(1, 99));
}

function _pickTarget(array) {
  if (!array.length) return 1;
  // 80% chance to pick an element that exists (better for visualization)
  if (Math.random() < 0.8) {
    return array[randomInt(0, array.length - 1)];
  }
  return randomInt(1, 99);
}

function _updateTargetDisplay(target) {
  const el = qs('#search-target-display-value');
  if (el) el.textContent = target !== null ? String(target) : '—';
}

function _updateSearchTargetInput(target) {
  const input = qs('#search-target-input');
  if (input && target !== null) input.value = target;
}

function _setArrayTypeBtnActive(type) {
  qsa('.search-array-type-btn').forEach(btn => {
    const active = btn.dataset.arrayType === type;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

function _showSearchResult(found, index, target) {
  const area = qs('#search-visualizer-area');
  if (!area) return;

  const old = qs('#search-result-banner');
  old?.remove();

  const banner = document.createElement('div');
  banner.id        = 'search-result-banner';
  banner.className = `search-result-banner ${found ? 'found' : 'not-found'}`;
  banner.textContent = found ? `✓ Found ${target} at index ${index}` : `✗ ${target} not found`;
  area.appendChild(banner);
}

function _updateStatusBadge(status) {
  const el = qs('#search-stat-status');
  if (!el) return;
  el.className  = `status-badge status-${status}`;
  el.textContent = { idle: 'Idle', running: 'Searching…', paused: 'Paused', finished: 'Complete' }[status] ?? status;
}

function _resetStatDisplay() {
  ['#search-stat-comparisons','#search-stat-visited','#search-stat-current',
   '#search-stat-found','#search-stat-elapsed'].forEach(id => {
    const el = qs(id);
    if (el) el.textContent = id.includes('elapsed') ? '0ms' : id.includes('current') || id.includes('found') ? '—' : '0';
  });
  qs('#search-result-banner')?.remove();
}

function _renderSearchDescription(info) {
  const panel = qs('#search-description-panel');
  if (!panel) return;

  const sorted = info.requiresSorted
    ? '<span class="desc-tag tag-yes">Requires Sorted Array</span>'
    : '<span class="desc-tag tag-no">Works on Any Array</span>';

  panel.innerHTML = `
    <div class="desc-layout">
      <div class="desc-section">
        <div class="desc-section-title">Overview</div>
        <p class="desc-text">${info.overview}</p>
        <p class="desc-text" style="margin-top:6px">${info.principle}</p>
      </div>
      <div class="desc-section">
        <div class="desc-section-title">Complexity</div>
        <div class="complexity-grid">
          <div class="complexity-row"><span class="complexity-case">Best</span><span class="complexity-val">${info.best}</span></div>
          <div class="complexity-row"><span class="complexity-case">Average</span><span class="complexity-val">${info.average}</span></div>
          <div class="complexity-row"><span class="complexity-case">Worst</span><span class="complexity-val">${info.worst}</span></div>
          <div class="complexity-row"><span class="complexity-case">Space</span><span class="complexity-val">${info.space}</span></div>
        </div>
        <div class="desc-tag-row" style="margin-top:8px">${sorted}</div>
      </div>
      <div class="desc-section">
        <div class="desc-section-title">Advantages</div>
        ${info.advantages.map(a => `<p class="desc-text">+ ${a}</p>`).join('')}
        <div class="desc-section-title" style="margin-top:8px">Disadvantages</div>
        ${info.disadvantages.map(d => `<p class="desc-text">– ${d}</p>`).join('')}
      </div>
      <div class="desc-section">
        <div class="desc-section-title">Applications</div>
        ${info.applications.map(a => `<span class="desc-tag tag-info">${a}</span>`).join('')}
      </div>
    </div>
  `;
}

// ─── DOM utilities ─────────────────────────────────────────────

function _setText(sel, txt) {
  const el = qs(sel);
  if (el && el.textContent !== txt) el.textContent = txt;
}

function _setDisabled(sel, val) {
  const el = qs(sel);
  if (el) el.disabled = val;
}

function _updateSliderFill(slider) {
  const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.setProperty('--range-fill', `${pct}%`);
}

function _syncAllThemeButtons(theme) {
  const icon = theme === 'dark'
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  ['#btn-home-theme','#btn-theme','#search-btn-theme'].forEach(id => {
    const btn = qs(id);
    if (!btn) return;
    btn.innerHTML = icon;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
}
