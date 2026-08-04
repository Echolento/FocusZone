import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSession } from '../SessionContext';
import { DURATION_PRESETS } from '../types';

interface HomeScreenProps {
  onSettings: () => void;
}

export default function HomeScreen({ onSettings }: HomeScreenProps) {
  const { session, startSession } = useSession();
  const [selectedDuration, setSelectedDuration] = useState(DURATION_PRESETS[0]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FocusZone</Text>
      <Text style={styles.subtitle}>
        Put your phone down and get to work.
      </Text>

      <Text style={styles.durationLabel}>Duration</Text>
      <View style={styles.durationRow}>
        {DURATION_PRESETS.map((min) => (
          <TouchableOpacity
            key={min}
            style={[
              styles.durationBtn,
              selectedDuration === min && styles.durationBtnActive,
            ]}
            onPress={() => setSelectedDuration(min)}
          >
            <Text
              style={[
                styles.durationBtnText,
                selectedDuration === min && styles.durationBtnTextActive,
              ]}
            >
              {min} min
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => startSession(selectedDuration)}
      >
        <Text style={styles.startBtnText}>Start Session</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSettings} style={styles.settingsBtn}>
        <Text style={styles.settingsBtnText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
    marginBottom: 40,
  },
  durationLabel: {
    fontSize: 14,
    color: '#888',
    alignSelf: 'flex-start',
    marginBottom: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 32,
  },
  durationBtn: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  durationBtnActive: {
    borderColor: '#4AFF8A',
    backgroundColor: '#0A2A1A',
  },
  durationBtnText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  durationBtnTextActive: {
    color: '#4AFF8A',
  },
  startBtn: {
    width: '100%',
    backgroundColor: '#4AFF8A',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  startBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D0D0D',
  },
  settingsBtn: {
    position: 'absolute',
    bottom: 60,
  },
  settingsBtnText: {
    color: '#555',
    fontSize: 15,
  },
});
