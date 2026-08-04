import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSession } from '../SessionContext';
import { Sensitivity, AlertStyle, SENSITIVITY_THRESHOLDS } from '../types';
import { loadSettings, saveSettings } from '../storage';

interface SettingsScreenProps {
  onBack: () => void;
}

const ALERT_OPTIONS: { value: AlertStyle; label: string }[] = [
  { value: 'silent', label: 'Silent (vibrate only)' },
  { value: 'low', label: 'Low tone' },
  { value: 'loud', label: 'Loud (hardcore)' },
];

const SENSITIVITY_OPTIONS: { value: Sensitivity; label: string; desc: string }[] = [
  { value: 'low', label: 'Low', desc: 'Forgiving — larger movements needed' },
  { value: 'medium', label: 'Medium', desc: 'Balanced sensitivity' },
  { value: 'high', label: 'High', desc: 'Strict — slightest moves trigger' },
];

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { settings, updateSettings } = useSession();

  useEffect(() => {
    loadSettings().then((s) => updateSettings(s));
  }, []);

  const handleSensitivity = (v: Sensitivity) => {
    const next = { ...settings, sensitivity: v };
    updateSettings(next);
    saveSettings(next);
  };

  const handleAlertStyle = (v: AlertStyle) => {
    const next = { ...settings, alertStyle: v };
    updateSettings(next);
    saveSettings(next);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backBtn}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.spacer} />
      </View>

      <Text style={styles.sectionLabel}>Motion Sensitivity</Text>
      {SENSITIVITY_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.option, settings.sensitivity === opt.value && styles.optionActive]}
          onPress={() => handleSensitivity(opt.value)}
        >
          <View>
            <Text
              style={[
                styles.optionLabel,
                settings.sensitivity === opt.value && styles.optionLabelActive,
              ]}
            >
              {opt.label}
            </Text>
            <Text style={styles.optionDesc}>{opt.desc}</Text>
          </View>
          {settings.sensitivity === opt.value && (
            <Text style={styles.check}>OK</Text>
          )}
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionLabel}>Alert Style</Text>
      {ALERT_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.option, settings.alertStyle === opt.value && styles.optionActive]}
          onPress={() => handleAlertStyle(opt.value)}
        >
          <Text
            style={[
              styles.optionLabel,
              settings.alertStyle === opt.value && styles.optionLabelActive,
            ]}
          >
            {opt.label}
          </Text>
          {settings.alertStyle === opt.value && (
            <Text style={styles.check}>OK</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backBtn: {
    color: '#4AFF8A',
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    width: 50,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionLabel: {
    color: '#666',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 24,
  },
  option: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: '#0A2A1A',
    borderWidth: 1,
    borderColor: '#4AFF8A',
  },
  optionLabel: {
    color: '#CCC',
    fontSize: 16,
    fontWeight: '600',
  },
  optionLabelActive: {
    color: '#4AFF8A',
  },
  optionDesc: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
  check: {
    color: '#4AFF8A',
    fontSize: 16,
    fontWeight: '700',
  },
});
