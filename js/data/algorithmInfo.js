import { bubbleSort }    from '../algorithms/bubble.js';
import { selectionSort } from '../algorithms/selection.js';
import { insertionSort } from '../algorithms/insertion.js';
import { mergeSort }     from '../algorithms/merge.js';
import { quickSort }     from '../algorithms/quick.js';
import { heapSort }      from '../algorithms/heap.js';
import { shellSort }     from '../algorithms/shell.js';
import { countingSort }  from '../algorithms/counting.js';
import { radixSort }     from '../algorithms/radix.js';
import { bucketSort }    from '../algorithms/bucket.js';

/*
  To add a new algorithm:
  1. Create js/algorithms/yourSort.js and export yourSort(array)
  2. Import it above
  3. Add an entry to ALGORITHMS below — nothing else needs to change.
*/

export const ALGORITHMS = {
  bubble: {
    id:        'bubble',
    name:      'Bubble Sort',
    fn:        bubbleSort,
    best:      'O(n)',
    average:   'O(n²)',
    worst:     'O(n²)',
    space:     'O(1)',
    stable:    true,
    inPlace:   true,
    overview:  'A straightforward comparison-based algorithm that repeatedly steps through the list, comparing adjacent elements and swapping them if they are out of order. The pass is repeated until no swaps are needed.',
    principle: 'Each pass "bubbles" the largest unsorted element to its correct position at the end. After k passes, the last k elements are in their final sorted positions.',
    advantages:    ['Simple to understand and implement', 'Detects already-sorted arrays in O(n)', 'Stable — equal elements keep their relative order', 'In-place with O(1) extra memory'],
    disadvantages: ['O(n²) average and worst case makes it impractical for large datasets', 'Many unnecessary comparisons even for nearly-sorted data', 'Slower than insertion sort in practice'],
    applications:  ['Educational purposes', 'Very small datasets', 'When simplicity outweighs performance'],
  },

  selection: {
    id:        'selection',
    name:      'Selection Sort',
    fn:        selectionSort,
    best:      'O(n²)',
    average:   'O(n²)',
    worst:     'O(n²)',
    space:     'O(1)',
    stable:    false,
    inPlace:   true,
    overview:  'Divides the array into a sorted and an unsorted region. Repeatedly finds the minimum element in the unsorted region and moves it to the end of the sorted region.',
    principle: 'On each pass, scans the entire unsorted portion to find the minimum value and swaps it into position. Exactly n-1 swaps are performed regardless of initial order.',
    advantages:    ['Minimises the number of swaps (exactly n-1)', 'Simple implementation', 'O(1) extra space'],
    disadvantages: ['O(n²) in all cases — cannot detect sorted input', 'Not stable', 'More comparisons than necessary on nearly-sorted data'],
    applications:  ['Systems where writes are expensive (flash memory)', 'Small arrays where swap cost dominates comparison cost'],
  },

  insertion: {
    id:        'insertion',
    name:      'Insertion Sort',
    fn:        insertionSort,
    best:      'O(n)',
    average:   'O(n²)',
    worst:     'O(n²)',
    space:     'O(1)',
    stable:    true,
    inPlace:   true,
    overview:  'Builds the sorted array one element at a time by taking each unsorted element and inserting it into its correct position in the already-sorted portion.',
    principle: 'Like sorting a hand of playing cards. Iterates from index 1 to n-1, and for each element, shifts larger elements rightward to create space before inserting.',
    advantages:    ['O(n) best case on nearly-sorted data', 'Stable and adaptive', 'Efficient for small arrays — used inside TimSort and IntroSort', 'Online: can sort as data arrives'],
    disadvantages: ['O(n²) worst case', 'Many shifts for reverse-sorted input'],
    applications:  ['Small arrays (threshold within hybrid sorts)', 'Online sorting of streaming data', 'Nearly-sorted datasets'],
  },

  merge: {
    id:        'merge',
    name:      'Merge Sort',
    fn:        mergeSort,
    best:      'O(n log n)',
    average:   'O(n log n)',
    worst:     'O(n log n)',
    space:     'O(n)',
    stable:    true,
    inPlace:   false,
    overview:  'A classic divide-and-conquer algorithm. Recursively splits the array in half, sorts each half independently, then merges the two sorted halves into one sorted result.',
    principle: 'Divides until single elements (trivially sorted), then merges pairs of sorted subarrays. Merge compares leading elements of each half and writes the smaller one, producing a sorted output.',
    advantages:    ['Guaranteed O(n log n) in all cases', 'Stable sort', 'Well-suited for linked lists and external sorting (disk)', 'Highly parallelisable'],
    disadvantages: ['Requires O(n) auxiliary space', 'Slower in practice than quicksort for in-memory data due to cache misses'],
    applications:  ['External sorting (files too large for RAM)', 'Sorting linked lists', 'Stable sort requirement (Python\'s Timsort builds on it)', 'Parallel sorting systems'],
  },

  quick: {
    id:        'quick',
    name:      'Quick Sort',
    fn:        quickSort,
    best:      'O(n log n)',
    average:   'O(n log n)',
    worst:     'O(n²)',
    space:     'O(log n)',
    stable:    false,
    inPlace:   true,
    overview:  'A highly efficient divide-and-conquer algorithm that selects a pivot element and partitions the array into elements less than and greater than the pivot, then recursively sorts each partition.',
    principle: 'Lomuto partition: pivot is the last element. A pointer scans left-to-right swapping any element ≤ pivot to the left partition. The pivot is placed at its final sorted position.',
    advantages:    ['O(n log n) average — fastest in practice for in-memory sorting', 'Cache-friendly in-place operation', 'Small constant factors'],
    disadvantages: ['O(n²) worst case on already-sorted or adversarial input (mitigated by random pivot)', 'Not stable', 'Stack depth O(n) worst case without tail-call optimisation'],
    applications:  ['General-purpose in-memory sorting (C stdlib qsort, Java Arrays.sort for primitives)', 'When average performance matters more than worst-case guarantee'],
  },

  heap: {
    id:        'heap',
    name:      'Heap Sort',
    fn:        heapSort,
    best:      'O(n log n)',
    average:   'O(n log n)',
    worst:     'O(n log n)',
    space:     'O(1)',
    stable:    false,
    inPlace:   true,
    overview:  'Uses a binary max-heap data structure. First builds a heap from the array, then repeatedly extracts the maximum element, placing it at the end of the array.',
    principle: 'Build phase (O(n)): heapify from the middle outward. Extract phase (O(n log n)): swap root (max) with last element, shrink heap size, then restore the heap property by sifting down.',
    advantages:    ['O(n log n) guaranteed — no worst-case degradation', 'O(1) extra space', 'Useful when you only need the top-k elements (priority queue)'],
    disadvantages: ['Not stable', 'Poor cache locality compared to quicksort — random memory access pattern', 'Slower constant factor than quicksort in practice'],
    applications:  ['Priority queues', 'Order statistics (top-k)', 'Real-time systems requiring guaranteed performance', 'IntroSort fallback'],
  },

  shell: {
    id:        'shell',
    name:      'Shell Sort',
    fn:        shellSort,
    best:      'O(n log n)',
    average:   'O(n log² n)',
    worst:     'O(n²)',
    space:     'O(1)',
    stable:    false,
    inPlace:   true,
    overview:  'A generalisation of insertion sort that allows the exchange of distant elements. Uses a shrinking gap sequence to progressively bring elements closer to their final positions before a final pass.',
    principle: 'Performs multiple passes of gap-insertion sort using a decreasing gap sequence (Knuth: 1, 4, 13, 40, …). Large gaps move elements long distances early, small gaps fine-tune. Final gap-1 pass completes the sort.',
    advantages:    ['Much faster than O(n²) algorithms in practice', 'In-place with O(1) extra memory', 'Simple to implement', 'Good on nearly-sorted data'],
    disadvantages: ['Complexity depends on gap sequence — no single universally optimal sequence', 'Not stable', 'Harder to analyse theoretically than other sorts'],
    applications:  ['Embedded systems with limited memory', 'Sorting medium-sized arrays', 'Used in uClibc and older Unix implementations'],
  },

  counting: {
    id:        'counting',
    name:      'Counting Sort',
    fn:        countingSort,
    best:      'O(n + k)',
    average:   'O(n + k)',
    worst:     'O(n + k)',
    space:     'O(k)',
    stable:    true,
    inPlace:   false,
    overview:  'A non-comparison sort that works by counting the occurrences of each distinct value. Uses those counts to determine the position of each element in the output.',
    principle: 'Three phases: count each value\'s frequency into a table, compute cumulative sums to find final positions, then scatter elements into the output array. k is the range of input values.',
    advantages:    ['O(n + k) time — linear when k = O(n)', 'Stable sort', 'Simple implementation'],
    disadvantages: ['Only works on integer-valued or discretisable keys', 'O(k) space — impractical when range k >> n', 'Not suitable for floating-point or string keys directly'],
    applications:  ['Sorting integers with small value range', 'Used as a subroutine in radix sort', 'Counting occurrences by category (histograms)'],
  },

  radix: {
    id:        'radix',
    name:      'Radix Sort',
    fn:        radixSort,
    best:      'O(nk)',
    average:   'O(nk)',
    worst:     'O(nk)',
    space:     'O(n + k)',
    stable:    true,
    inPlace:   false,
    overview:  'A non-comparison sort that processes integer keys digit by digit from least significant to most significant, using counting sort as a stable subroutine at each digit position.',
    principle: 'LSD (Least Significant Digit) radix sort: performs one stable counting sort pass per digit position. After d passes (where d = log₁₀(max)), the array is fully sorted.',
    advantages:    ['Linear time O(nk) when k is small (e.g., 32-bit ints have k ≤ 10 digits)', 'Stable sort', 'Can outperform comparison sorts for large n with fixed-width keys'],
    disadvantages: ['Only works on integers (or fixed-length strings)', 'Requires O(n) extra space per pass', 'Less cache-friendly than comparison sorts'],
    applications:  ['Sorting fixed-width integers at scale', 'Network packet sorting by IP address', 'Suffix array construction algorithms'],
  },

  bucket: {
    id:        'bucket',
    name:      'Bucket Sort',
    fn:        bucketSort,
    best:      'O(n + k)',
    average:   'O(n + k)',
    worst:     'O(n²)',
    space:     'O(n + k)',
    stable:    true,
    inPlace:   false,
    overview:  'Distributes elements into a number of buckets across the value range, sorts each bucket independently (using insertion sort), then concatenates the buckets in order.',
    principle: 'Divide the value range into equally-spaced intervals (buckets). Assign each element to its bucket, sort small buckets cheaply, then output in bucket order. Efficient when input is roughly uniform.',
    advantages:    ['O(n) average when data is uniformly distributed', 'Can be parallelised per bucket', 'Stable with a stable inner sort'],
    disadvantages: ['O(n²) worst case if all elements fall into one bucket', 'Performance depends heavily on input distribution', 'Requires O(n + k) extra space'],
    applications:  ['Floating-point data in a known range', 'External sorting when data is uniformly distributed', 'Histogram-based image processing'],
  },
};

export function getAlgorithm(id) {
  return ALGORITHMS[id] ?? null;
}

export function getAllAlgorithms() {
  return Object.values(ALGORITHMS);
}
