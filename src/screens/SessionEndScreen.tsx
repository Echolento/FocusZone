import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSession } from '../SessionContext';

interface SessionEndScreenProps {
  onGoHome: () => void;
}

export default function SessionEndScreen({ onGoHome }: SessionEndScreenProps) {
  const { session } = useSession();
  const isCompleted = session.state === 'completed';

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{isCompleted ? 'OK' : 'STOP'}</Text>
      </View>

      <Text style={styles.title}>
        {isCompleted ? 'Session Completed' : 'Session Ended'}
      </Text>

      <Text style={styles.body}>
        {isCompleted
          ? 'Great job staying focused. Your phone is now free.'
          : 'You ended this session early. The phone is yours again.'}
      </Text>

      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{session.durationMinutes} min</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Violations</Text>
          <Text style={[styles.statValue, session.violationsCount > 0 && styles.statValueWarn]}>
            {session.violationsCount}
          </Text>
        </View>
        {session.totalFrozenSeconds > 0 && (
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Time out of zone</Text>
            <Text style={[styles.statValue, styles.statValueWarn]}>
              {Math.round(session.totalFrozenSeconds / 60)} min
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={onGoHome} style={styles.homeBtn}>
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4AFF8A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0D0D0D',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  statsCard: {
    width: '100%',
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  statLabel: {
    color: '#888',
    fontSize: 15,
  },
  statValue: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  statValueWarn: {
    color: '#FF6B6B',
  },
  homeBtn: {
    backgroundColor: '#4AFF8A',
    borderRadius: 14,
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
  homeBtnText: {
    color: '#0D0D0D',
    fontSize: 16,
    fontWeight: '700',
  },
});
