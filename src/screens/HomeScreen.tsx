import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSession } from '../SessionContext';
import DurationWheel from '../components/DurationWheel';
import { durationMinutes, isEmpty } from '../wheelModel';
import { loadTimerWheel, saveTimerWheel } from '../storage';

interface HomeScreenProps {
  onSettings: () => void;
}

const BTN_WIDTH = 300;

export default function HomeScreen({ onSettings }: HomeScreenProps) {
  const { startSession } = useSession();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const startDisabled = isEmpty(hours, minutes, seconds);

  useEffect(() => {
    loadTimerWheel().then((saved) => {
      if (saved) {
        setHours(saved.hours);
        setMinutes(saved.minutes);
        setSeconds(saved.seconds);
      }
    });
  }, []);

  const handleWheelChange = (h: number, m: number, s: number) => {
    setHours(h);
    setMinutes(m);
    setSeconds(s);
    saveTimerWheel({ hours: h, minutes: m, seconds: s });
  };

  const start = () => {
    if (startDisabled) return;
    startSession(durationMinutes(hours, minutes, seconds));
  };

  const wheelText = `${String(hours).padStart(2, '0')}:${String(
    minutes,
  ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FocusZone</Text>
      <Text style={styles.subtitle}>
        Put your phone down and get to work.
      </Text>

      <View
        style={styles.wheelWrap}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Session duration"
        accessibilityValue={{
          text: wheelText,
        }}
      >
        <DurationWheel
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          onChange={handleWheelChange}
        />
      </View>

      <TouchableOpacity
        style={[styles.startBtn, startDisabled && styles.startBtnDisabled]}
        onPress={start}
        disabled={startDisabled}
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
    fontSize: 15,
    color: '#7BC79E',
    marginTop: 8,
    marginBottom: 40,
  },
  wheelWrap: {
    marginBottom: 56,
  },
  startBtn: {
    width: BTN_WIDTH,
    backgroundColor: '#4AFF8A',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  startBtnDisabled: {
    opacity: 0.3,
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
