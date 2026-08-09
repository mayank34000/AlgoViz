import { qs } from '../utils.js';

const CATEGORIES = [
  {
    id:     'sorting',
    label:  'Sorting Algorithms',
    count:  '10 algorithms',
    desc:   'Bubble, Quick, Merge, Heap, Shell, Counting, Radix, and more. Watch every swap and comparison animate in real time.',
    icon:   _iconSorting(),
    active: true,
  },
  {
    id:     'searching',
    label:  'Searching Algorithms',
    count:  '6 algorithms',
    desc:   'Linear, Binary, Jump, Interpolation, Exponential, and Fibonacci search. Watch the search window narrow step by step.',
    icon:   _iconSearching(),
    active: true,
  },
  {
    id:     'trees',
    label:  'Trees',
    count:  'Coming Soon',
    desc:   'BST, AVL, Red-Black trees. Watch rotations, insertions, and deletions happen node by node with animated rebalancing.',
    icon:   _iconTrees(),
    active: false,
  },
  {
    id:     'graphs',
    label:  'Graph Algorithms',
    count:  'Coming Soon',
    desc:   "BFS, DFS, Dijkstra's, and A*. Explore traversal order and shortest paths on interactive node graphs.",
    icon:   _iconGraphs(),
    active: false,
  },
  {
    id:     'dp',
    label:  'Dynamic Programming',
    count:  'Coming Soon',
    desc:   'Fibonacci, knapsack, LCS. Watch the memoization table fill in step by step.',
    icon:   _iconDP(),
    active: false,
  },
  {
    id:     'greedy',
    label:  'Greedy Algorithms',
    count:  'Coming Soon',
    desc:   "Activity selection, Huffman coding, Kruskal's MST. See how locally optimal choices lead to globally optimal solutions.",
    icon:   _iconGreedy(),
    active: false,
  },
];

export function initHome({ onCategorySelect }) {
  const grid = qs('#category-grid');
  if (!grid) return;

  grid.innerHTML = CATEGORIES.map(_buildCard).join('');

  grid.addEventListener('click', e => {
    const card = e.target.closest('.category-card[data-active="true"]');
    if (!card) return;
    card.classList.add('card-activating');
    setTimeout(() => onCategorySelect(card.dataset.id), 120);
  });

  grid.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.category-card[data-active="true"]');
    if (!card) return;
    e.preventDefault();
    card.classList.add('card-activating');
    setTimeout(() => onCategorySelect(card.dataset.id), 120);
  });
}

function _buildCard(cat) {
  if (cat.active) {
    return `
      <div class="category-card" data-id="${cat.id}" data-active="true"
           role="button" tabindex="0" aria-label="Open ${cat.label}">
        <div class="card-accent-bar"></div>
        <div class="card-icon">${cat.icon}</div>
        <div class="card-body">
          <span class="card-pill card-pill--active">${cat.count}</span>
          <h3 class="card-title">${cat.label}</h3>
          <p class="card-desc">${cat.desc}</p>
        </div>
        <div class="card-cta">
          <span>Explore</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>
      </div>`;
  }

  return `
    <div class="category-card category-card--soon" data-id="${cat.id}"
         data-active="false" aria-disabled="true">
      <div class="card-icon">${cat.icon}</div>
      <div class="card-body">
        <span class="card-pill card-pill--soon">${cat.count}</span>
        <h3 class="card-title">${cat.label}</h3>
        <p class="card-desc">${cat.desc}</p>
      </div>
    </div>`;
}

// ─── SVG Icons ─────────────────────────────────────────────────

function _iconSorting() {
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2"  y="32" width="9" height="14" rx="2" fill="currentColor" opacity="0.30"/>
    <rect x="15" y="22" width="9" height="24" rx="2" fill="currentColor" opacity="0.55"/>
    <rect x="28" y="10" width="9" height="36" rx="2" fill="currentColor" opacity="0.80"/>
    <rect x="41" y="2"  width="7" height="44" rx="2" fill="currentColor"/>
  </svg>`;
}

function _iconSearching() {
  return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
    xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="14"/>
    <line x1="30.5" y1="30.5" x2="44" y2="44"/>
  </svg>`;
}

function _iconTrees() {
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="6"  r="5.5" fill="currentColor"/>
    <circle cx="11" cy="24" r="5"   fill="currentColor" opacity="0.75"/>
    <circle cx="37" cy="24" r="5"   fill="currentColor" opacity="0.75"/>
    <circle cx="4"  cy="41" r="4"   fill="currentColor" opacity="0.50"/>
    <circle cx="18" cy="41" r="4"   fill="currentColor" opacity="0.50"/>
    <circle cx="30" cy="41" r="4"   fill="currentColor" opacity="0.50"/>
    <circle cx="44" cy="41" r="4"   fill="currentColor" opacity="0.50"/>
    <line x1="24" y1="11.5" x2="11" y2="19" stroke="currentColor" stroke-width="2" opacity="0.35"/>
    <line x1="24" y1="11.5" x2="37" y2="19" stroke="currentColor" stroke-width="2" opacity="0.35"/>
    <line x1="11" y1="29"   x2="4"  y2="37" stroke="currentColor" stroke-width="2" opacity="0.35"/>
    <line x1="11" y1="29"   x2="18" y2="37" stroke="currentColor" stroke-width="2" opacity="0.35"/>
    <line x1="37" y1="29"   x2="30" y2="37" stroke="currentColor" stroke-width="2" opacity="0.35"/>
    <line x1="37" y1="29"   x2="44" y2="37" stroke="currentColor" stroke-width="2" opacity="0.35"/>
  </svg>`;
}

function _iconGraphs() {
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="24" y1="11" x2="8"  y2="32" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3" opacity="0.40"/>
    <line x1="24" y1="11" x2="40" y2="32" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3" opacity="0.40"/>
    <line x1="13" y1="37" x2="35" y2="37" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3" opacity="0.40"/>
    <line x1="40" y1="14" x2="35" y2="32" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3" opacity="0.30"/>
    <circle cx="24" cy="8"  r="6.5" fill="currentColor" opacity="0.95"/>
    <circle cx="8"  cy="37" r="6"   fill="currentColor" opacity="0.65"/>
    <circle cx="40" cy="37" r="6"   fill="currentColor" opacity="0.65"/>
    <circle cx="42" cy="12" r="5"   fill="currentColor" opacity="0.45"/>
  </svg>`;
}

function _iconDP() {
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2"  y="2"  width="13" height="13" rx="3" fill="currentColor" opacity="0.20"/>
    <rect x="18" y="2"  width="13" height="13" rx="3" fill="currentColor" opacity="0.35"/>
    <rect x="34" y="2"  width="13" height="13" rx="3" fill="currentColor" opacity="0.20"/>
    <rect x="2"  y="18" width="13" height="13" rx="3" fill="currentColor" opacity="0.35"/>
    <rect x="18" y="18" width="13" height="13" rx="3" fill="currentColor" opacity="0.90"/>
    <rect x="34" y="18" width="13" height="13" rx="3" fill="currentColor" opacity="0.60"/>
    <rect x="2"  y="34" width="13" height="13" rx="3" fill="currentColor" opacity="0.20"/>
    <rect x="18" y="34" width="13" height="13" rx="3" fill="currentColor" opacity="0.60"/>
    <rect x="34" y="34" width="13" height="13" rx="3" fill="currentColor" opacity="1.00"/>
  </svg>`;
}

function _iconGreedy() {
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4 L44 44 L24 34 L4 44 Z" fill="currentColor" opacity="0.20" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="24" cy="4"  r="4" fill="currentColor"/>
    <circle cx="44" cy="44" r="3" fill="currentColor" opacity="0.55"/>
    <circle cx="4"  cy="44" r="3" fill="currentColor" opacity="0.55"/>
    <circle cx="24" cy="34" r="3.5" fill="currentColor" opacity="0.80"/>
  </svg>`;
}
