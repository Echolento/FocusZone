export type SessionState =
  | 'idle'
  | 'arming'
  | 'active'
  | 'violated'
  | 'completed'
  | 'ended-early';

export type AlertStyle = 'silent' | 'low' | 'loud';

export type Sensitivity = 'low' | 'medium' | 'high';

export interface BaselineGravity {
  x: number;
  y: number;
  z: number;
}

export interface SessionData {
  state: SessionState;
  durationMinutes: number;
  timeRemaining: number;
  violationsCount: number;
  totalFrozenSeconds: number;
  baselineGravity: BaselineGravity | null;
}

export interface Settings {
  sensitivity: Sensitivity;
  alertStyle: AlertStyle;
}

export const DEFAULT_SETTINGS: Settings = {
  sensitivity: 'medium',
  alertStyle: 'silent',
};

export const SENSITIVITY_THRESHOLDS: Record<Sensitivity, number> = {
  low: 25,
  medium: 15,
  high: 8,
};

export const SETTLE_COUNTDOWN = 5;

export const END_LONG_PRESS_MS = 2000;
