# AlgoViz — Algorithm Visualizer

A professional, interactive visualizer for ten classic sorting algorithms. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no dependencies. Designed to be a polished portfolio piece that demonstrates both software architecture and frontend craft.

---

## Features

**Visualization**
- Smooth, real-time bar chart animations for comparisons, swaps, and overwrites
- Distinct colour states: default, comparing, swapping, pivot, overwrite, sorted
- Floor line and optional value labels for small arrays
- Fullscreen mode

**Array Generation**
- Random
- Nearly Sorted (≈5% disruption)
- Reverse Sorted
- Few Unique Values
- Duplicate Heavy

**Controls**
- Array size slider (4 – 200 elements)
- Animation speed slider (1 – 100)
- Start / Pause / Resume / Stop / Reset
- Generate new array at any time

**Statistics Panel** — live updates
- Algorithm name
- Comparisons, Swaps, Writes
- Elapsed time
- Best / Average / Worst case complexity
- Space complexity

**Description Panel** — per algorithm
- Overview and working principle
- Advantages and disadvantages
- Stable? In-place?
- Real-world applications

**UX**
- Dark and light themes (persisted in localStorage)
- Keyboard shortcuts (`Space`, `R`, `G`, `F`, `T`)
- Responsive — works on tablet and mobile
- Accessible markup (ARIA labels, roles, keyboard nav)
- Toast notifications

---

## Algorithms

| Algorithm      | Best       | Average    | Worst      | Space    | Stable | In-Place |
|----------------|-----------|-----------|-----------|---------|--------|----------|
| Bubble Sort    | O(n)       | O(n²)      | O(n²)      | O(1)     | ✓      | ✓        |
| Selection Sort | O(n²)      | O(n²)      | O(n²)      | O(1)     | ✗      | ✓        |
| Insertion Sort | O(n)       | O(n²)      | O(n²)      | O(1)     | ✓      | ✓        |
| Merge Sort     | O(n log n) | O(n log n) | O(n log n) | O(n)     | ✓      | ✗        |
| Quick Sort     | O(n log n) | O(n log n) | O(n²)      | O(log n) | ✗      | ✓        |
| Heap Sort      | O(n log n) | O(n log n) | O(n log n) | O(1)     | ✗      | ✓        |
| Shell Sort     | O(n log n) | O(n log² n)| O(n²)      | O(1)     | ✗      | ✓        |
| Counting Sort  | O(n + k)   | O(n + k)   | O(n + k)   | O(k)     | ✓      | ✗        |
| Radix Sort     | O(nk)      | O(nk)      | O(nk)      | O(n + k) | ✓      | ✗        |
| Bucket Sort    | O(n + k)   | O(n + k)   | O(n²)      | O(n + k) | ✓      | ✗        |

---

## Architecture

The project separates concerns into distinct layers. Sorting logic, animation, rendering, and UI are fully independent.

```
Sorting Algorithm
      ↓  (produces operations[])
Animation Engine
      ↓  (consumes operations one by one)
Renderer
      ↓  (updates DOM bar heights and colours)
Statistics / UI
      ↓  (reflects state changes)
```

**Key design decisions:**

- **Operation-based playback.** Each algorithm produces a flat list of operations (`compare`, `swap`, `overwrite`, `pivot`, `sorted`). The animation engine replays these independently — algorithms have zero knowledge of the DOM.
- **Registry pattern.** Adding a new algorithm requires only creating one file and adding one entry to `js/data/algorithmInfo.js`. Nothing else changes.
- **Separation of state.** `state.js` is the single source of truth. UI modules read from it; the app module writes to it.
- **No framework.** The architecture demonstrates the same patterns you'd find in React (unidirectional data flow, component boundaries) but in ~1,200 lines of plain JavaScript.

---

## Folder Structure

```
SortingVisualizer/
│
├── index.html                    Main entry point
├── README.md
│
├── css/
│   ├── variables.css             Design tokens (colours, spacing, radii, fonts)
│   ├── base.css                  CSS reset + foundational rules
│   ├── layout.css                App grid, sidebar, main area
│   ├── controls.css              Sidebar buttons, sliders, selectors
│   ├── visualizer.css            Bar chart, stats row, description panel
│   ├── animations.css            Keyframes and transition utilities
│   └── responsive.css            Media queries (tablet, mobile)
│
├── js/
│   ├── app.js                    Orchestrator — wires all modules together
│   ├── state.js                  Central state store with subscribe/notify
│   ├── utils.js                  Pure helpers (math, DOM, formatting)
│   ├── constants.js              Frozen enums (OP types, STATUS, ARRAY_TYPE)
│   │
│   ├── ui/
│   │   ├── controls.js           Binds all DOM events, delegates to app
│   │   ├── statistics.js         Reads and renders live stat updates
│   │   ├── description.js        Renders algorithm info panel
│   │   └── theme.js              Dark/light toggle with localStorage persist
│   │
│   ├── visualizer/
│   │   ├── renderer.js           Creates bars, applies operation colours
│   │   ├── animation.js          Schedules operations, owns pause/resume/stop
│   │   └── arrayGenerator.js     Generates typed arrays (random, reverse, etc.)
│   │
│   ├── algorithms/
│   │   ├── bubble.js
│   │   ├── selection.js
│   │   ├── insertion.js
│   │   ├── merge.js
│   │   ├── quick.js
│   │   ├── heap.js
│   │   ├── shell.js
│   │   ├── counting.js
│   │   ├── radix.js
│   │   └── bucket.js
│   │
│   └── data/
│       └── algorithmInfo.js      Algorithm registry + metadata
│
└── java/
    ├── BubbleSort.java
    ├── SelectionSort.java
    ├── InsertionSort.java
    ├── MergeSort.java
    ├── QuickSort.java
    ├── HeapSort.java
    ├── ShellSort.java
    ├── CountingSort.java
    ├── RadixSort.java
    └── BucketSort.java
```

---

## Screenshots

> _Add screenshots here after running the project._

| Dark Theme | Light Theme |
|-----------|-------------|
| ![Dark](screenshots/dark.png) | ![Light](screenshots/light.png) |

---

## Getting Started

No build step required. Because the project uses ES modules, it must be served over HTTP rather than opened directly as a `file://` URL.

**Option 1 — VS Code Live Server**
```
Right-click index.html → Open with Live Server
```

**Option 2 — Python**
```bash
cd SortingVisualizer
python3 -m http.server 8080
# Open http://localhost:8080
```

**Option 3 — Node**
```bash
npx serve .
```

### Running the Java Examples

Each Java file has a standalone `main` method. Compile and run from the project root:

```bash
cd java
javac BubbleSort.java
java -cp . sorting.BubbleSort
```

Or compile all at once:

```bash
cd java
javac *.java
java -cp . sorting.QuickSort
```

---

## Keyboard Shortcuts

| Key     | Action                     |
|---------|----------------------------|
| `Space` | Start / Pause / Resume     |
| `R`     | Reset                      |
| `G`     | Generate new array         |
| `F`     | Toggle fullscreen          |
| `T`     | Toggle theme               |

---

## Adding a New Algorithm

1. Create `js/algorithms/yourSort.js` and export a function `yourSort(array)` that returns an operations array:

```js
import { OP } from '../constants.js';

export function yourSort(array) {
  const ops = [];
  const arr = [...array];

  // ... your sorting logic, pushing operations:
  // ops.push({ type: OP.COMPARE,   indices: [i, j] });
  // ops.push({ type: OP.SWAP,      a: i, b: j });
  // ops.push({ type: OP.OVERWRITE, index: i, value: v });
  // ops.push({ type: OP.SORTED,    indices: [i] });

  return ops;
}
```

2. Open `js/data/algorithmInfo.js`, import your function, and add one entry to the `ALGORITHMS` object:

```js
import { yourSort } from '../algorithms/yourSort.js';

// Inside ALGORITHMS:
yourSort: {
  id:           'yourSort',
  name:         'Your Sort',
  fn:           yourSort,
  best:         'O(?)',
  average:      'O(?)',
  worst:        'O(?)',
  space:        'O(?)',
  stable:       true,
  inPlace:      true,
  overview:     '...',
  principle:    '...',
  advantages:   ['...'],
  disadvantages:['...'],
  applications: ['...'],
},
```

That's it. No other file needs to change.

---

## Future Scope

- [ ] **Step mode** — advance one operation at a time
- [ ] **Side-by-side comparison** — run two algorithms simultaneously on the same array
- [ ] **Tim Sort** and **Intro Sort** implementations
- [ ] **Counting operations chart** — bar chart of comparisons vs swaps after completion
- [ ] **Export to GIF** — record a visualisation
- [ ] **Custom input** — sort a user-provided comma-separated list
- [ ] **Audio mode** — pitch mapped to element value (like the classic "Hungarian folk dance" sort video)
- [ ] **3D mode** — WebGL bar chart rendering for very large arrays

---

## Technologies

- **HTML5** — semantic, accessible markup
- **CSS3** — custom properties, CSS Grid, Flexbox, keyframe animations
- **JavaScript (ES2022)** — ES modules, classes, optional chaining, structured clone
- **Java 11+** — for the reference algorithm implementations

---
