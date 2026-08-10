import React, { useRef } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSession } from '../SessionContext';
import { END_LONG_PRESS_MS } from '../types';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h.toString()}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s
    .toString()
    .padStart(2, '0')}`;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) {
    return `${h}h ${m.toString().padStart(2, '0')}m`;
  }
  return `${m} min`;
}

export default function ActiveSessionScreen() {
  const { session, endSession } = useSession();
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasEnded = useRef(false);

  const handlePressIn = () => {
    pressTimer.current = setTimeout(() => {
      if (!hasEnded.current) {
        hasEnded.current = true;
        endSession();
      }
    }, END_LONG_PRESS_MS);
  };

  const handlePressOut = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerSection}>
        <Text style={styles.statusBadge}>IN ZONE</Text>
        <Text style={styles.timer}>{formatTime(session.timeRemaining)}</Text>
        <Text style={styles.durationLabel}>
          {formatDuration(session.durationMinutes)} session
        </Text>
        {session.violationsCount > 0 && (
          <Text style={styles.violationNote}>
            {session.violationsCount} violation
            {session.violationsCount !== 1 ? 's' : ''} so far
          </Text>
        )}
      </View>

      <View style={styles.endSection}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            styles.endBtn,
            pressed && styles.endBtnPressed,
          ]}
        >
          <Text style={styles.endBtnText}>Hold to end session</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 60,
  },
  timerSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statusBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4AFF8A',
    backgroundColor: '#0A2A1A',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    letterSpacing: 1,
    marginBottom: 24,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  timer: {
    fontSize: 72,
    fontWeight: '200',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
    marginBottom: 8,
  },
  durationLabel: {
    fontSize: 15,
    color: '#666',
  },
  violationNote: {
    fontSize: 13,
    color: '#FF6B6B',
    marginTop: 16,
  },
  endSection: {
    alignItems: 'center',
  },
  endBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 40,
    paddingVertical: 18,
  },
  endBtnPressed: {
    backgroundColor: 'rgba(255,107,107,0.15)',
    borderColor: '#FF6B6B',
  },
  endBtnText: {
    color: '#555',
    fontSize: 15,
    fontWeight: '600',
  },
});
