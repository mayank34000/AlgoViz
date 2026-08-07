/*
  router.js — lightweight two-view manager.

  The app has exactly two screens:
    - "home"       → #view-home
    - "visualizer" → #view-visualizer

  Both are position:fixed in the DOM at all times. The active view
  gets .is-visible; the inactive one gets .is-hidden. CSS handles
  the fade + slide transition; JS only swaps the class names.

  The visualizer is initialised lazily — only when the user first
  navigates to it. onShowVisualizer is called once and never again.
*/

const VIEWS = Object.freeze({ HOME: 'home', VISUALIZER: 'visualizer' });
const TRANSITION_MS = 380;

const EL = {
  home:       () => document.getElementById('view-home'),
  visualizer: () => document.getElementById('view-visualizer'),
};

let _onShowVisualizer = null;
let _visualizerReady  = false;
let _current          = null;

export function initRouter({ onShowVisualizer }) {
  _onShowVisualizer = onShowVisualizer;
  _activate(VIEWS.HOME);
}

export function navigateToVisualizer() {
  if (_current === VIEWS.VISUALIZER) return;
  _deactivate(VIEWS.HOME);
  setTimeout(() => {
    _activate(VIEWS.VISUALIZER);
    if (!_visualizerReady) {
      _visualizerReady = true;
      _onShowVisualizer?.();
    }
  }, TRANSITION_MS);
}

export function navigateHome() {
  if (_current === VIEWS.HOME) return;
  _deactivate(VIEWS.VISUALIZER);
  setTimeout(() => _activate(VIEWS.HOME), TRANSITION_MS);
}

// ─── Private ──────────────────────────────────────────────────

function _activate(view) {
  const el = EL[view]?.();
  if (!el) return;
  el.classList.remove('is-hidden');
  el.classList.add('is-visible');
  _current = view;
}

function _deactivate(view) {
  const el = EL[view]?.();
  if (!el) return;
  el.classList.remove('is-visible');
  el.classList.add('is-hidden');
}
