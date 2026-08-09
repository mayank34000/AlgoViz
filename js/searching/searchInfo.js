import { linearSearch }        from './algorithms/linear.js';
import { binarySearch }        from './algorithms/binary.js';
import { jumpSearch }          from './algorithms/jump.js';
import { interpolationSearch } from './algorithms/interpolation.js';
import { exponentialSearch }   from './algorithms/exponential.js';
import { fibonacciSearch }     from './algorithms/fibonacci.js';

/*
  To add a new search algorithm:
  1. Create js/searching/algorithms/yourSearch.js
  2. Import it above
  3. Add an entry to SEARCH_ALGORITHMS — nothing else changes.
*/

export const SEARCH_ALGORITHMS = {
  linear: {
    id:            'linear',
    name:          'Linear Search',
    fn:            linearSearch,
    requiresSorted: false,
    best:          'O(1)',
    average:       'O(n)',
    worst:         'O(n)',
    space:         'O(1)',
    overview:      'Scans the array from left to right, comparing each element with the target. The simplest search algorithm — no prerequisites required.',
    principle:     'Iterate index by index. If the current element equals the target, return its index. If the entire array is scanned without a match, the target is absent.',
    advantages:    ['Works on unsorted arrays', 'No preprocessing needed', 'Simple to implement', 'O(1) space'],
    disadvantages: ['O(n) time — slow for large arrays', 'Makes no use of sorted order even if available'],
    applications:  ['Searching unsorted or small datasets', 'One-off lookups where sorting is not worth it', 'Linked lists (random access unavailable)'],
  },

  binary: {
    id:            'binary',
    name:          'Binary Search',
    fn:            binarySearch,
    requiresSorted: true,
    best:          'O(1)',
    average:       'O(log n)',
    worst:         'O(log n)',
    space:         'O(1)',
    overview:      'Repeatedly halves the search range by comparing the target with the middle element, discarding the half that cannot contain the target.',
    principle:     'Maintain low and high pointers. Compute mid = ⌊(low+high)/2⌋. If arr[mid] < target, search right half (low = mid+1). If arr[mid] > target, search left half (high = mid-1). Repeat until found or range empty.',
    advantages:    ['O(log n) — extremely fast on large sorted arrays', 'Simple and predictable', 'Widely applicable'],
    disadvantages: ['Requires sorted input', 'Not suitable for linked lists (no O(1) random access)'],
    applications:  ['Dictionary lookups', 'Database index scans', 'Finding insertion points', 'stdlib lower_bound / upper_bound'],
  },

  jump: {
    id:            'jump',
    name:          'Jump Search',
    fn:            jumpSearch,
    requiresSorted: true,
    best:          'O(1)',
    average:       'O(√n)',
    worst:         'O(√n)',
    space:         'O(1)',
    overview:      'Jumps ahead by √n steps to find the block likely containing the target, then does a short linear scan within that block.',
    principle:     'Step through indices 0, √n, 2√n, 3√n… until the block boundary element ≥ target. Then scan backwards within the last block linearly. Optimal block size is √n.',
    advantages:    ['Faster than linear — O(√n)', 'Better than binary on systems where backward traversal is costly', 'Simple to tune block size'],
    disadvantages: ['Requires sorted input', 'Slower than binary search (O(√n) vs O(log n))'],
    applications:  ['Sorted magnetic tape or sequential-access media', 'When backward jumping is expensive', 'Moderate-sized sorted datasets'],
  },

  interpolation: {
    id:            'interpolation',
    name:          'Interpolation Search',
    fn:            interpolationSearch,
    requiresSorted: true,
    best:          'O(1)',
    average:       'O(log log n)',
    worst:         'O(n)',
    space:         'O(1)',
    overview:      'An improved binary search that probes not at the midpoint but at an estimated position based on linear interpolation of the target\'s likely location.',
    principle:     'Probe at pos = low + ⌊((target − arr[low]) / (arr[high] − arr[low])) × (high − low)⌋. Like binary search, but smarter about where to look on uniform data.',
    advantages:    ['O(log log n) average on uniform data — better than binary search', 'Very fast in practice for phone-book-like distributions'],
    disadvantages: ['O(n) worst case on skewed distributions', 'Requires sorted input', 'Needs numeric keys for interpolation formula'],
    applications:  ['Phone directories', 'Uniformly distributed sorted datasets', 'Indexed numeric lookups'],
  },

  exponential: {
    id:            'exponential',
    name:          'Exponential Search',
    fn:            exponentialSearch,
    requiresSorted: true,
    best:          'O(1)',
    average:       'O(log n)',
    worst:         'O(log n)',
    space:         'O(1)',
    overview:      'First finds the range where the target could exist by doubling the index (1, 2, 4, 8…), then runs binary search within that range.',
    principle:     'Start at index 1 and double: if arr[bound] < target, set bound *= 2. Once arr[bound] >= target, binary search in [bound/2, bound]. Useful when array size is unknown.',
    advantages:    ['O(log n) time', 'Excellent for unbounded or infinite sorted arrays', 'Outperforms binary search when target is near the beginning'],
    disadvantages: ['Requires sorted input', 'No advantage over binary search on bounded arrays with known size'],
    applications:  ['Unbounded/infinite sorted sequences', 'Sorted arrays where element is likely near the front', 'Searching in sorted linked lists'],
  },

  fibonacci: {
    id:            'fibonacci',
    name:          'Fibonacci Search',
    fn:            fibonacciSearch,
    requiresSorted: true,
    best:          'O(1)',
    average:       'O(log n)',
    worst:         'O(log n)',
    space:         'O(1)',
    overview:      'Divides the array using Fibonacci numbers instead of halving, allowing it to avoid division operations and use only addition and subtraction.',
    principle:     'Maintain Fibonacci triplet (fib2, fib1, fib). Index the probe at offset + fib2. If target > arr[probe], discard left; if target < arr[probe], discard right. Decrease Fibonacci numbers accordingly.',
    advantages:    ['O(log n) without division — beneficial on hardware where division is slow', 'Better cache locality than binary search on some architectures'],
    disadvantages: ['More complex to implement than binary search', 'Requires sorted input', 'Marginal benefit over binary on modern CPUs'],
    applications:  ['Embedded systems with limited arithmetic', 'Hardware where division is expensive', 'Historical significance in search algorithm theory'],
  },
};

export function getSearchAlgorithm(id) {
  return SEARCH_ALGORITHMS[id] ?? null;
}

export function getAllSearchAlgorithms() {
  return Object.values(SEARCH_ALGORITHMS);
}
