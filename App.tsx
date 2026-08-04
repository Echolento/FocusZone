import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

import { SessionProvider, useSession } from './src/SessionContext';
import { useMotion } from './src/useMotion';
import { useAlarm } from './src/useAlarm';
import { useAppLock } from './src/useAppLock';
import HomeScreen from './src/screens/HomeScreen';
import ArmingScreen from './src/screens/ArmingScreen';
import ActiveSessionScreen from './src/screens/ActiveSessionScreen';
import ViolationScreen from './src/screens/ViolationScreen';
import SessionEndScreen from './src/screens/SessionEndScreen';
import SettingsScreen from './src/screens/SettingsScreen';

type Page = 'home' | 'settings';

function useTimer() {
  const { session, timerTick } = useSession();
  const remainingRef = useRef(session.timeRemaining);
  remainingRef.current = session.timeRemaining;

  useEffect(() => {
    if (session.state !== 'active') return;

    const interval = setInterval(() => {
      timerTick(remainingRef.current - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [session.state]);
}

function useKeepAwake() {
  const { session } = useSession();
  useEffect(() => {
    const shouldKeepAwake =
      session.state === 'active' ||
      session.state === 'violated' ||
      session.state === 'arming';

    if (shouldKeepAwake) {
      activateKeepAwakeAsync().catch(() => {});
    }

    return () => {
      if (shouldKeepAwake) {
        deactivateKeepAwake().catch(() => {});
      }
    };
  }, [session.state === 'active' || session.state === 'violated' || session.state === 'arming']);
}

function AppContent() {
  const { session, resetSession } = useSession();
  const [page, setPage] = React.useState<Page>('home');

  useMotion();
  useAlarm();
  useAppLock();
  useTimer();
  useKeepAwake();

  const handleGoHome = () => {
    resetSession();
    setPage('home');
  };

  if (session.state === 'violated') {
    return <ViolationScreen />;
  }

  if (session.state === 'completed' || session.state === 'ended-early') {
    return <SessionEndScreen onGoHome={handleGoHome} />;
  }

  if (session.state === 'arming') {
    return <ArmingScreen />;
  }

  if (session.state === 'active') {
    return <ActiveSessionScreen />;
  }

  // idle state
  if (page === 'settings') {
    return <SettingsScreen onBack={() => setPage('home')} />;
  }

  return (
    <HomeScreen
      onSettings={() => setPage('settings')}
    />
  );
}

export default function App() {
  return (
    <SessionProvider>
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
        <AppContent />
      </View>
    </SessionProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
});
