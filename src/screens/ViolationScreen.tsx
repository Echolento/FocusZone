import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSession } from '../SessionContext';

export default function ViolationScreen() {
  const { session } = useSession();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>!</Text>
      </View>
      <Text style={styles.title}>Zone Violation Detected</Text>
      <Text style={styles.body}>
        Put the phone back down flat on the desk to resume your session.
      </Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Violations</Text>
        <Text style={styles.infoValue}>{session.violationsCount}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Time remaining</Text>
        <Text style={styles.infoValue}>
          {String(Math.floor(session.timeRemaining / 60)).padStart(2, '0')}:
          {String(session.timeRemaining % 60).padStart(2, '0')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF3B30',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    color: '#FF8888',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,59,48,0.2)',
  },
  infoLabel: {
    color: '#FF6666',
    fontSize: 15,
  },
  infoValue: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
