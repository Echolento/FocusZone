export const HOURS_MAX = 99;
export const MINUTES_MAX = 59;
export const SECONDS_MAX = 59;

export function durationMinutes(
  hours: number,
  minutes: number,
  seconds: number,
): number {
  return hours * 60 + minutes + Math.round(seconds / 60);
}

export function wrapIndex(index: number, count: number): number {
  return ((index % count) + count) % count;
}

export function isEmpty(hours: number, minutes: number, seconds: number): boolean {
  return hours === 0 && minutes === 0 && seconds === 0;
}

export function padValues(count: number): number[] {
  const base = Array.from({ length: count }, (_, i) => i);
  return [...base, ...base, ...base];
}

export function initialPadIndex(value: number, count: number): number {
  return count + wrapIndex(value, count);
}

export function valueFromPadIndex(index: number, count: number): number {
  return wrapIndex(index, count);
}
