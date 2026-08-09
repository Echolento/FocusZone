import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings, DEFAULT_SETTINGS, SessionData } from './types';

const SETTINGS_KEY = '@focuszone/settings';
const SESSION_KEY = '@focuszone/session';
const WHEEL_KEY = '@focuszone/timer-wheel';

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export interface PersistedSession {
  session: SessionData;
  savedAt: number;
}

export async function loadSession(): Promise<PersistedSession | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

export async function saveSession(persisted: PersistedSession): Promise<void> {
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(persisted));
  } catch {}
}

export async function clearSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch {}
}

export interface TimerWheelValue {
  hours: number;
  minutes: number;
  seconds: number;
}

export async function loadTimerWheel(): Promise<TimerWheelValue | null> {
  try {
    const raw = await AsyncStorage.getItem(WHEEL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const hours = Number(parsed.hours);
      const minutes = Number(parsed.minutes);
      const seconds = Number(parsed.seconds);
      if (
        Number.isInteger(hours) &&
        Number.isInteger(minutes) &&
        Number.isInteger(seconds) &&
        hours >= 0 &&
        hours <= 99 &&
        minutes >= 0 &&
        minutes <= 59 &&
        seconds >= 0 &&
        seconds <= 59
      ) {
        return { hours, minutes, seconds };
      }
    }
  } catch {}
  return null;
}

export async function saveTimerWheel(value: TimerWheelValue): Promise<void> {
  try {
    await AsyncStorage.setItem(WHEEL_KEY, JSON.stringify(value));
  } catch {}
}
