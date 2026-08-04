import { useEffect } from 'react';
import { AppState, BackHandler } from 'react-native';
import { useSession } from './SessionContext';
import { fireExitNotification } from './exitNotification';

export function useAppLock() {
  const { session, triggerViolation } = useSession();

  const isSessionActive =
    session.state === 'arming' ||
    session.state === 'active' ||
    session.state === 'violated';

  useEffect(() => {
    if (!isSessionActive) return;

    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'background' && session.state === 'active') {
        triggerViolation();
        fireExitNotification();
      }
    });

    return () => sub.remove();
  }, [isSessionActive, session.state, triggerViolation]);

  useEffect(() => {
    if (!isSessionActive) return;

    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    return () => sub.remove();
  }, [isSessionActive]);
}
