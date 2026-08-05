const STORAGE_KEY = 'sv-theme';
const DEFAULT_THEME = 'dark';

let _currentTheme = DEFAULT_THEME;

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  _currentTheme = saved === 'light' ? 'light' : 'dark';
  _apply();
}

export function toggleTheme() {
  _currentTheme = _currentTheme === 'dark' ? 'light' : 'dark';
  _apply();
  localStorage.setItem(STORAGE_KEY, _currentTheme);
  return _currentTheme;
}

export function getTheme() {
  return _currentTheme;
}

function _apply() {
  document.documentElement.setAttribute('data-theme', _currentTheme);
}
