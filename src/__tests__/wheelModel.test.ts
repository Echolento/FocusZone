import {
  durationMinutes,
  wrapIndex,
  isEmpty,
  padValues,
  initialPadIndex,
  valueFromPadIndex,
  SECONDS_MAX,
} from '../wheelModel';

describe('durationMinutes', () => {
  it('combines hours and minutes into total minutes', () => {
    expect(durationMinutes(2, 45, 0)).toBe(165);
  });

  it('treats minutes alone as a sub-hour duration', () => {
    expect(durationMinutes(0, 15, 0)).toBe(15);
  });

  it('rounds seconds to the nearest minute', () => {
    expect(durationMinutes(0, 0, 30)).toBe(1);
    expect(durationMinutes(0, 0, 29)).toBe(0);
    expect(durationMinutes(2, 0, 45)).toBe(121);
  });

  it('handles the maximum wheel value', () => {
    expect(durationMinutes(99, 59, 59)).toBe(6000);
  });
});

describe('wrapIndex', () => {
  it('keeps an in-range index unchanged', () => {
    expect(wrapIndex(7, 60)).toBe(7);
  });

  it('wraps an index past the top back to the start', () => {
    expect(wrapIndex(60, 60)).toBe(0);
    expect(wrapIndex(119, 60)).toBe(59);
  });

  it('wraps a negative index to the bottom', () => {
    expect(wrapIndex(-1, 60)).toBe(59);
    expect(wrapIndex(-60, 60)).toBe(0);
  });
});

describe('isEmpty', () => {
  it('is true only at 0:00:00', () => {
    expect(isEmpty(0, 0, 0)).toBe(true);
  });

  it('is false when any column is non-zero', () => {
    expect(isEmpty(1, 0, 0)).toBe(false);
    expect(isEmpty(0, 1, 0)).toBe(false);
    expect(isEmpty(0, 0, 1)).toBe(false);
  });
});

describe('seconds column range', () => {
  it('spans 0..59', () => {
    expect(SECONDS_MAX).toBe(59);
  });
});

describe('padValues', () => {
  it('repeats the range three times for a seamless loop', () => {
    expect(padValues(3)).toEqual([0, 1, 2, 0, 1, 2, 0, 1, 2]);
  });
});

describe('initialPadIndex', () => {
  it('places a value in the middle repeat', () => {
    expect(initialPadIndex(0, 3)).toBe(3);
    expect(initialPadIndex(2, 3)).toBe(5);
  });
});

describe('valueFromPadIndex', () => {
  it('maps any padded index back to the column value', () => {
    expect(valueFromPadIndex(0, 3)).toBe(0);
    expect(valueFromPadIndex(3, 3)).toBe(0);
    expect(valueFromPadIndex(8, 3)).toBe(2);
    expect(valueFromPadIndex(-1, 3)).toBe(2);
  });
});
