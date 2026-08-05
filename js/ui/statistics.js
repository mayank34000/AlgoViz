import { formatNumber, formatTime, qs } from '../utils.js';
import { getAlgorithm } from '../data/algorithmInfo.js';

const STAT_IDS = {
  algorithm:   '#stat-algorithm',
  comparisons: '#stat-comparisons',
  swaps:       '#stat-swaps',
  writes:      '#stat-writes',
  elapsed:     '#stat-elapsed',
  arraySize:   '#stat-array-size',
  status:      '#stat-status',
  best:        '#stat-best',
  average:     '#stat-average',
  worst:       '#stat-worst',
  space:       '#stat-space',
};

export function initStatistics() {
  // Nothing to initialise — DOM is already rendered
}

export function updateLiveStats({ comparisons, swaps, writes, elapsed }) {
  _setText('#stat-comparisons', formatNumber(comparisons));
  _setText('#stat-swaps',       formatNumber(swaps));
  _setText('#stat-writes',      formatNumber(writes));
  _setText('#stat-elapsed',     formatTime(elapsed));
}

export function updateAlgorithmStats(algorithmId) {
  const info = getAlgorithm(algorithmId);
  if (!info) return;

  _setText('#stat-algorithm', info.name);
  _setText('#stat-best',      info.best);
  _setText('#stat-average',   info.average);
  _setText('#stat-worst',     info.worst);
  _setText('#stat-space',     info.space);
}

export function updateArraySize(size) {
  _setText('#stat-array-size', String(size));
}

export function updateStatus(status) {
  const el = qs('#stat-status');
  if (!el) return;

  el.className = `status-badge status-${status}`;
  el.textContent = _statusLabel(status);
}

export function resetStats() {
  _setText('#stat-comparisons', '0');
  _setText('#stat-swaps',       '0');
  _setText('#stat-writes',      '0');
  _setText('#stat-elapsed',     '0ms');
}

// ─── Helpers ───────────────────────────────────────────────────

function _setText(selector, text) {
  const el = qs(selector);
  if (!el) return;

  if (el.textContent === text) return;
  el.textContent = text;

  // Subtle pop animation for changing numbers
  el.classList.remove('updated');
  void el.offsetWidth; // trigger reflow
  el.classList.add('updated');
}

function _statusLabel(status) {
  const labels = {
    idle:     'Idle',
    running:  'Running',
    paused:   'Paused',
    finished: 'Finished',
  };
  return labels[status] ?? status;
}
