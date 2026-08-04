import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import {
  SessionState,
  SessionData,
  Settings,
  BaselineGravity,
  DEFAULT_SETTINGS,
} from './types';
import { loadSession, saveSession, clearSession } from './storage';

interface SessionContextValue {
  session: SessionData;
  settings: Settings;
  isSettled: boolean;
  dispatch: React.Dispatch<SessionAction>;
  startSession: (duration: number) => void;
  armSession: () => void;
  triggerViolation: () => void;
  triggerResettle: () => void;
  endSession: () => void;
  resetSession: () => void;
  timerTick: (remaining: number) => void;
  setBaseline: (baseline: BaselineGravity) => void;
  updateSettings: (s: Partial<Settings>) => void;
}

type SessionAction =
  | { type: 'HYDRATE'; session: SessionData }
  | { type: 'START'; duration: number }
  | { type: 'ARM' }
  | { type: 'VIOLATION' }
  | { type: 'RESETTLE' }
  | { type: 'END' }
  | { type: 'RESET' }
  | { type: 'TIMER_TICK'; remaining: number }
  | { type: 'SET_BASELINE'; baseline: BaselineGravity };

const initialSession: SessionData = {
  state: 'idle',
  durationMinutes: 0,
  timeRemaining: 0,
  violationsCount: 0,
  totalFrozenSeconds: 0,
  baselineGravity: null,
};

function sessionReducer(state: SessionData, action: SessionAction): SessionData {
  switch (action.type) {
    case 'HYDRATE':
      return action.session;
    case 'START':
      return {
        ...initialSession,
        state: 'arming' as SessionState,
        durationMinutes: action.duration,
        timeRemaining: action.duration * 60,
      };
    case 'ARM':
      return { ...state, state: 'active' as SessionState };
    case 'VIOLATION':
      if (state.state !== 'active') return state;
      return {
        ...state,
        state: 'violated' as SessionState,
        violationsCount: state.violationsCount + 1,
      };
    case 'RESETTLE':
      if (state.state !== 'violated') return state;
      return { ...state, state: 'active' as SessionState };
    case 'END':
      if (state.state !== 'active') return state;
      return { ...state, state: 'ended-early' as SessionState };
    case 'TIMER_TICK':
      if (state.state === 'active') {
        const newRemaining = action.remaining;
        if (newRemaining <= 0) {
          return { ...state, timeRemaining: 0, state: 'completed' as SessionState };
        }
        return { ...state, timeRemaining: newRemaining };
      }
      if (state.state === 'violated') {
        return { ...state, totalFrozenSeconds: state.totalFrozenSeconds + 1 };
      }
      return state;
    case 'SET_BASELINE':
      return { ...state, baselineGravity: action.baseline };
    case 'RESET':
      return { ...initialSession };
    default:
      return state;
  }
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, dispatch] = useReducer(sessionReducer, initialSession);
  const [settings, setSettings] = React.useState<Settings>(DEFAULT_SETTINGS);
  const [isSettled, setIsSettled] = React.useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadSession().then((persisted) => {
      if (cancelled || !persisted) return;
      const elapsed = Math.floor((Date.now() - persisted.savedAt) / 1000);
      let s = persisted.session;
      if ((s.state === 'active' || s.state === 'violated') && s.timeRemaining > 0) {
        s = { ...s, timeRemaining: Math.max(0, s.timeRemaining - elapsed) };
      }
      dispatch({ type: 'HYDRATE', session: s });
      hydratedRef.current = true;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (session.state === 'idle' || session.state === 'completed' || session.state === 'ended-early') {
      clearSession();
    } else {
      saveSession({ session, savedAt: Date.now() });
    }
  }, [session]);

  const startSession = useCallback((duration: number) => {
    dispatch({ type: 'START', duration });
    setIsSettled(false);
  }, []);

  const armSession = useCallback(() => {
    dispatch({ type: 'ARM' });
  }, []);

  const triggerViolation = useCallback(() => {
    dispatch({ type: 'VIOLATION' });
  }, []);

  const triggerResettle = useCallback(() => {
    dispatch({ type: 'RESETTLE' });
  }, []);

  const endSession = useCallback(() => {
    dispatch({ type: 'END' });
  }, []);

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const timerTick = useCallback((remaining: number) => {
    dispatch({ type: 'TIMER_TICK', remaining });
  }, []);

  const setBaseline = useCallback((baseline: BaselineGravity) => {
    dispatch({ type: 'SET_BASELINE', baseline });
  }, []);

  const updateSettings = useCallback((s: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...s }));
  }, []);

  const value: SessionContextValue = {
    session,
    settings,
    isSettled,
    dispatch,
    startSession,
    armSession,
    triggerViolation,
    triggerResettle,
    endSession,
    resetSession,
    timerTick,
    setBaseline,
    updateSettings,
  };

  return React.createElement(SessionContext.Provider, { value }, children);
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
