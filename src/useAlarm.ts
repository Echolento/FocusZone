import { useEffect, useRef } from 'react';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { useSession } from './SessionContext';
import { AlertStyle } from './types';

let alarmAsset: number | null = null;
try {
  alarmAsset = require('../assets/alarm.wav');
} catch {}

export function useAlarm() {
  const { session, settings } = useSession();
  const playerRef = useRef<AudioPlayer | null>(null);
  const vibeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canceledRef = useRef(false);

  const stopAll = () => {
    canceledRef.current = true;

    if (vibeRef.current) {
      clearInterval(vibeRef.current);
      vibeRef.current = null;
    }

    if (playerRef.current) {
      const p = playerRef.current;
      playerRef.current = null;
      try {
        p.pause();
        p.remove();
      } catch {}
    }
  };

  useEffect(() => {
    return () => stopAll();
  }, []);

  useEffect(() => {
    if (session.state !== 'violated') {
      stopAll();
      return;
    }

    canceledRef.current = false;
    startAlarm(settings.alertStyle, playerRef, vibeRef, canceledRef);

    return () => {
      stopAll();
    };
  }, [session.state, settings.alertStyle]);
}

function startAlarm(
  style: AlertStyle,
  playerRef: React.MutableRefObject<AudioPlayer | null>,
  vibeRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>,
  canceledRef: React.MutableRefObject<boolean>,
) {
  vibeRef.current = setInterval(() => {
    impactAsync(ImpactFeedbackStyle.Heavy).catch(() => {});
  }, 500);
  impactAsync(ImpactFeedbackStyle.Heavy).catch(() => {});

  if (style === 'silent' || !alarmAsset) return;

  try {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    }).catch(() => {});

    const player = createAudioPlayer(alarmAsset);
    player.loop = true;
    player.volume = style === 'loud' ? 1.0 : 0.2;

    if (canceledRef.current) {
      player.remove();
      return;
    }

    playerRef.current = player;
    player.play();
  } catch {}
}
