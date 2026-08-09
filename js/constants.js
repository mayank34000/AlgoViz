export const OP = Object.freeze({
  COMPARE:      'compare',
  SWAP:         'swap',
  OVERWRITE:    'overwrite',
  PIVOT:        'pivot',
  SORTED:       'sorted',
  RANGE_SORTED: 'range_sorted',
  MARK:         'mark',
  CLEAR_MARKS:  'clear_marks',
});

// Search-specific operation types
export const SOP = Object.freeze({
  COMPARE:       'search_compare',       // examining this index
  VISIT:         'search_visit',         // checked, not target
  DISCARD:       'search_discard',       // single index eliminated
  DISCARD_RANGE: 'search_discard_range', // range eliminated
  FOUND:         'search_found',         // target found here
  NOT_FOUND:     'search_not_found',     // search exhausted
  SET_LOW:       'search_set_low',       // lower bound pointer
  SET_HIGH:      'search_set_high',      // upper bound pointer
  SET_MID:       'search_set_mid',       // mid / probe pointer
});

export const STATUS = Object.freeze({
  IDLE:     'idle',
  RUNNING:  'running',
  PAUSED:   'paused',
  FINISHED: 'finished',
});

export const ARRAY_TYPE = Object.freeze({
  RANDOM:          'random',
  NEARLY_SORTED:   'nearly_sorted',
  REVERSE:         'reverse',
  FEW_UNIQUE:      'few_unique',
  DUPLICATE_HEAVY: 'duplicate_heavy',
});

export const THEME = Object.freeze({
  DARK:  'dark',
  LIGHT: 'light',
});

// Sorting defaults
export const ARRAY_SIZE_MIN     = 4;
export const ARRAY_SIZE_MAX     = 200;
export const ARRAY_SIZE_DEFAULT = 50;

// Searching defaults — smaller arrays so cells stay legible
export const SEARCH_SIZE_MIN     = 5;
export const SEARCH_SIZE_MAX     = 50;
export const SEARCH_SIZE_DEFAULT = 20;

export const SPEED_MIN     = 1;
export const SPEED_MAX     = 100;
export const SPEED_DEFAULT = 50;

export const VALUE_MIN = 5;
export const VALUE_MAX = 100;

export const DEFAULT_ALGORITHM      = 'bubble';
export const DEFAULT_ARRAY_TYPE     = ARRAY_TYPE.RANDOM;
export const DEFAULT_SEARCH_ALGO    = 'linear';
