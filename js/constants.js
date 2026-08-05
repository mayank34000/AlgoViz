export const OP = Object.freeze({
  COMPARE:     'compare',
  SWAP:        'swap',
  OVERWRITE:   'overwrite',
  PIVOT:       'pivot',
  SORTED:      'sorted',
  RANGE_SORTED:'range_sorted',
  MARK:        'mark',
  CLEAR_MARKS: 'clear_marks',
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
  light: 'light',
});

export const ARRAY_SIZE_MIN = 4;
export const ARRAY_SIZE_MAX = 200;
export const ARRAY_SIZE_DEFAULT = 50;

export const SPEED_MIN = 1;
export const SPEED_MAX = 100;
export const SPEED_DEFAULT = 50;

export const VALUE_MIN = 5;
export const VALUE_MAX = 100;

export const DEFAULT_ALGORITHM = 'bubble';
export const DEFAULT_ARRAY_TYPE = ARRAY_TYPE.RANDOM;
