/*
  router.js — manages all top-level views.

  Supports an arbitrary number of named views. Each view maps to an
  element with id="view-{name}". The active view gets .is-visible;
  inactive views get .is-hidden.

  Lazy-init callbacks are fired exactly once when a view is first
  activated (e.g. building the sorting or searching module on demand).
*/

const TRANSITION_MS = 380;

// Known view names → lazy-init callbacks
const _lazyInit = {};
const _initDone = {};

let _current = null;

export function initRouter(views) {
  /*
    views: { [name]: { onFirst?: fn } }
    e.g. { home: {}, visualizer: { onFirst: () => app.initSorting() }, searching: { onFirst: () => searchApp.init() } }
  */
  Object.entries(views).forEach(([name, cfg]) => {
    _lazyInit[name] = cfg.onFirst ?? null;
    _initDone[name] = false;
  });

  // Show home immediately (no transition on first load)
  _activate('home');
}

export function navigate(to) {
  if (_current === to) return;

  const from = _current;
  if (from) _deactivate(from);

  const delay = from ? TRANSITION_MS : 0;
  setTimeout(() => {
    _activate(to);
    if (!_initDone[to] && _lazyInit[to]) {
      _initDone[to] = true;
      _lazyInit[to]();
    }
  }, delay);
}

// ─── Convenience helpers (keep existing call sites working) ────

export function navigateToVisualizer() { navigate('visualizer'); }
export function navigateToSearching()  { navigate('searching');  }
export function navigateHome()         { navigate('home');       }

// ─── Private ───────────────────────────────────────────────────

function _activate(name) {
  const el = document.getElementById(`view-${name}`);
  if (!el) return;
  el.classList.remove('is-hidden');
  el.classList.add('is-visible');
  _current = name;
}

function _deactivate(name) {
  const el = document.getElementById(`view-${name}`);
  if (!el) return;
  el.classList.remove('is-visible');
  el.classList.add('is-hidden');
}
