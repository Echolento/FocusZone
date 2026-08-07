import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';
import { useSession } from './SessionContext';
import { Sensitivity, SENSITIVITY_THRESHOLDS } from './types';

const UPDATE_INTERVAL = 100;
const MOTION_FRAMES = 3;
const RESETTLE_FRAMES = 8;

export function useMotion() {
  const { session, settings, triggerViolation, triggerResettle } = useSession();

  const triggerVRef = useRef(triggerViolation);
  const triggerRRef = useRef(triggerResettle);
  triggerVRef.current = triggerViolation;
  triggerRRef.current = triggerResettle;

  const dataRef = useRef({
    baseline: session.baselineGravity,
    sensitivity: settings.sensitivity,
    state: session.state,
  });
  dataRef.current = {
    baseline: session.baselineGravity,
    sensitivity: settings.sensitivity,
    state: session.state,
  };

  const motionRef = useRef(0);
  const settleRef = useRef(0);

  useEffect(() => {
    let sub: { remove: () => void } | undefined;
    let cancelled = false;

    Accelerometer.isAvailableAsync().then((available) => {
      if (!available || cancelled) return;
      sub = Accelerometer.addListener(({ x, y, z }) => {
      const { baseline, sensitivity, state } = dataRef.current;
      if (!baseline) return;

      const b = baseline || { x: 0, y: 0, z: -9.8 };
      const dot = x * b.x + y * b.y + z * b.z;
      const magR = Math.sqrt(x * x + y * y + z * z);
      const magB = Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z);
      if (magR === 0 || magB === 0) return;
      const angle = (Math.acos(dot / (magR * magB)) * 180) / Math.PI;

      if (state === 'active') {
        const threshold = SENSITIVITY_THRESHOLDS[sensitivity];
        if (angle > threshold) {
          motionRef.current += 1;
          if (motionRef.current >= MOTION_FRAMES) {
            motionRef.current = 0;
            settleRef.current = 0;
            triggerVRef.current();
          }
        } else {
          motionRef.current = Math.max(0, motionRef.current - 1);
        }
      }

      if (state === 'violated') {
        if (angle < 12) {
          settleRef.current += 1;
          if (settleRef.current >= RESETTLE_FRAMES) {
            settleRef.current = 0;
            triggerRRef.current();
          }
        } else {
          settleRef.current = 0;
        }
      }
      });

      Accelerometer.setUpdateInterval(UPDATE_INTERVAL);
    });

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  useEffect(() => {
    motionRef.current = 0;
    settleRef.current = 0;
  }, [session.state]);
}
