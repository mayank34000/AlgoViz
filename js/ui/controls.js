import { qs, qsa } from '../utils.js';
import { STATUS, ARRAY_SIZE_MIN, ARRAY_SIZE_MAX, SPEED_MIN, SPEED_MAX } from '../constants.js';
import { getState } from '../state.js';
import { toggleTheme, getTheme } from './theme.js';

/*
  Controls wires up all DOM events and delegates to an event map
  provided by app.js. This keeps controls fully decoupled from
  sorting logic — it only knows about user intent, not execution.
*/
export function initControls(events) {
  _bindAlgorithmSelect(events);
  _bindArrayTypeButtons(events);
  _bindSliders(events);
  _bindActionButtons(events);
  _bindHeaderButtons(events);
  _bindKeyboard(events);
  _bindMobileMenu();
}

export function syncControlState(status, algorithmId) {
  const isRunning  = status === STATUS.RUNNING;
  const isPaused   = status === STATUS.PAUSED;
  const isActive   = isRunning || isPaused;
  const isFinished = status === STATUS.FINISHED;

  _setDisabled('#btn-start',   isActive || isFinished);
  _setDisabled('#btn-pause',   !isRunning);
  _setDisabled('#btn-resume',  !isPaused);
  _setDisabled('#btn-stop',    !isActive);
  _setDisabled('#btn-reset',   false);
  _setDisabled('#btn-generate',isActive);

  qsa('.array-type-btn').forEach(btn => {
    btn.disabled = isActive;
  });

  const algoSelect = qs('#algo-select');
  if (algoSelect) algoSelect.disabled = isActive;
}

// ─── Binding helpers ───────────────────────────────────────────

function _bindAlgorithmSelect(events) {
  const select = qs('#algo-select');
  if (!select) return;

  select.addEventListener('change', () => {
    events.onAlgorithmChange(select.value);
  });
}

function _bindArrayTypeButtons(events) {
  qsa('.array-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      qsa('.array-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      events.onArrayTypeChange(btn.dataset.type);
    });
  });
}

function _bindSliders(events) {
  const sizeSlider  = qs('#slider-size');
  const speedSlider = qs('#slider-speed');

  sizeSlider?.addEventListener('input', () => {
    _setText('#slider-size-val', sizeSlider.value);
    events.onSizeChange(Number(sizeSlider.value));
  });

  speedSlider?.addEventListener('input', () => {
    _setText('#slider-speed-val', speedSlider.value);
    events.onSpeedChange(Number(speedSlider.value));
  });
}

function _bindActionButtons(events) {
  _onClick('#btn-generate', events.onGenerate);
  _onClick('#btn-start',    events.onStart);
  _onClick('#btn-pause',    events.onPause);
  _onClick('#btn-resume',   events.onResume);
  _onClick('#btn-stop',     events.onStop);
  _onClick('#btn-reset',    events.onReset);
}

function _bindHeaderButtons(events) {
  const themeBtn = qs('#btn-theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const theme = toggleTheme();
      _updateThemeIcon(themeBtn, theme);
    });
  }

  _onClick('#btn-fullscreen', events.onFullscreen);
}

function _bindKeyboard(events) {
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    switch (e.key) {
      case ' ':
      case 'Space':
        e.preventDefault();
        _handleSpaceKey(events);
        break;
      case 'r':
      case 'R':
        events.onReset();
        break;
      case 'g':
      case 'G':
        events.onGenerate();
        break;
      case 'f':
      case 'F':
        events.onFullscreen();
        break;
      case 't':
      case 'T': {
        const theme = toggleTheme();
        const btn = qs('#btn-theme');
        if (btn) _updateThemeIcon(btn, theme);
        break;
      }
    }
  });
}

function _bindMobileMenu() {
  const menuBtn  = qs('#btn-mobile-menu');
  const sidebar  = qs('#sidebar');
  const overlay  = qs('#sidebar-overlay');

  if (!menuBtn || !sidebar) return;

  const open  = () => { sidebar.classList.add('open');  overlay?.classList.add('active'); };
  const close = () => { sidebar.classList.remove('open'); overlay?.classList.remove('active'); };

  menuBtn.addEventListener('click', open);
  overlay?.addEventListener('click', close);
}

// ─── State helpers ─────────────────────────────────────────────

function _handleSpaceKey(events) {
  const { status } = getState();
  if (status === STATUS.IDLE || status === STATUS.FINISHED) {
    events.onStart();
  } else if (status === STATUS.RUNNING) {
    events.onPause();
  } else if (status === STATUS.PAUSED) {
    events.onResume();
  }
}

function _updateThemeIcon(btn, theme) {
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  btn.innerHTML = theme === 'dark' ? _sunIcon() : _moonIcon();
}

// ─── DOM utilities ─────────────────────────────────────────────

function _onClick(selector, handler) {
  qs(selector)?.addEventListener('click', handler);
}

function _setDisabled(selector, disabled) {
  const el = qs(selector);
  if (el) el.disabled = disabled;
}

function _setText(selector, text) {
  const el = qs(selector);
  if (el) el.textContent = text;
}

function _sunIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
}

function _moonIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
}
