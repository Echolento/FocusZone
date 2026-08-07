import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { useSession } from '../SessionContext';
import { SETTLE_COUNTDOWN } from '../types';

export default function ArmingScreen() {
  const { armSession, setBaseline } = useSession();
  const [countdown, setCountdown] = useState(SETTLE_COUNTDOWN);
  const hasArmed = useRef(false);
  const lastSample = useRef({ x: 0, y: 0, z: -9.8 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown > 0) return;

    let cancelled = false;
    let checkFlat: { remove: () => void } | undefined;

    Accelerometer.isAvailableAsync().then((available) => {
      if (!available || cancelled) return;

      checkFlat = Accelerometer.addListener((sample) => {
        lastSample.current = sample;
        if (hasArmed.current) return;
        const { x, y, z } = sample;
        const mag = Math.sqrt(x * x + y * y + z * z);
        const flatX = Math.abs(x) < 1.5;
        const flatY = Math.abs(y) < 1.5;
        if (flatX && flatY && Math.abs(mag - 9.8) < 1.5) {
          hasArmed.current = true;
          setBaseline({ x, y, z });
          Accelerometer.setUpdateInterval(100);
          armSession();
        }
      });

      Accelerometer.setUpdateInterval(200);
    });

    const fallback = setTimeout(() => {
      if (!hasArmed.current) {
        hasArmed.current = true;
        setBaseline({ ...lastSample.current });
        if (checkFlat) Accelerometer.setUpdateInterval(100);
        armSession();
      }
      checkFlat?.remove();
    }, 2000);

    return () => {
      cancelled = true;
      checkFlat?.remove();
      clearTimeout(fallback);
    };
  }, [countdown, armSession, setBaseline]);

  if (countdown <= 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.calibrating}>Calibrating...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.countdown}>{countdown}</Text>
      <Text style={styles.label}>Place your phone flat on the desk</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  countdown: {
    fontSize: 96,
    fontWeight: '200',
    color: '#4AFF8A',
    marginBottom: 24,
  },
  label: {
    fontSize: 17,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  calibrating: {
    fontSize: 20,
    color: '#4AFF8A',
    fontWeight: '600',
  },
});
