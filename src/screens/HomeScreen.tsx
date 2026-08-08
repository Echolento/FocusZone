import React, { useRef, useState } from 'react';
import {
  GestureResponderEvent,
  PanResponder,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSession } from '../SessionContext';
import { DURATION_PRESETS } from '../types';

interface HomeScreenProps {
  onSettings: () => void;
}

const DIAL_SIZE = 300;
const DIAL_CENTER = DIAL_SIZE / 2;
const DIAL_TICK_COUNT = 48;
const DIAL_TICK_RADIUS = DIAL_SIZE * 0.4;
const DIAL_LABEL_RADIUS = DIAL_SIZE * 0.2875;
const DIAL_DEAD_RADIUS = DIAL_SIZE * 0.3;
const DIAL_STEP_DEGREES = 360 / DURATION_PRESETS.length;
const DIAL_LABELS = DURATION_PRESETS;

export default function HomeScreen({ onSettings }: HomeScreenProps) {
  const { startSession } = useSession();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [liveAngle, setLiveAngle] = useState<number | null>(null);
  const selectedIndexRef = useRef(0);
  const selectedDuration = DURATION_PRESETS[selectedIndex];

  const rotationRef = useRef(selectedIndex * DIAL_STEP_DEGREES);
  const lastSample = useRef(0);
  const pointerActive = useRef(false);

  const angleOf = (event: GestureResponderEvent) => {
    const dx = event.nativeEvent.locationX - DIAL_CENTER;
    const dy = event.nativeEvent.locationY - DIAL_CENTER;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  const inDeadZone = (event: GestureResponderEvent) => {
    const dx = event.nativeEvent.locationX - DIAL_CENTER;
    const dy = event.nativeEvent.locationY - DIAL_CENTER;
    return Math.sqrt(dx * dx + dy * dy) <= DIAL_DEAD_RADIUS;
  };

  const commitRotation = () => {
    const raw =
      Math.round(rotationRef.current / DIAL_STEP_DEGREES);
    const index = Math.max(
      0,
      Math.min(DURATION_PRESETS.length - 1, raw),
    );
    if (index !== selectedIndexRef.current) {
      selectedIndexRef.current = index;
      setSelectedIndex(index);
    }
  };

  const applyPointer = (event: GestureResponderEvent) => {
    if (inDeadZone(event)) {
      pointerActive.current = false;
      lastSample.current = angleOf(event);
      return;
    }
    const angle = angleOf(event);
    if (!pointerActive.current) {
      pointerActive.current = true;
      lastSample.current = angle;
      return;
    }
    let delta = angle - lastSample.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    lastSample.current = angle;

    rotationRef.current = Math.max(
      0,
      Math.min(360, rotationRef.current + delta),
    );
    setLiveAngle(rotationRef.current);
    commitRotation();
  };

  const finishPointer = () => {
    pointerActive.current = false;
    commitRotation();
    setLiveAngle(null);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: applyPointer,
      onPanResponderMove: applyPointer,
      onPanResponderRelease: finishPointer,
      onPanResponderTerminate: finishPointer,
    }),
  ).current;

  const activeTickCount = Math.min(
    DIAL_TICK_COUNT,
    liveAngle != null
      ? Math.floor((liveAngle / 360) * DIAL_TICK_COUNT) + 1
      : Math.round((selectedIndex / DURATION_PRESETS.length) * DIAL_TICK_COUNT) +
        1,
  );
  const thumbAngle = liveAngle ?? selectedIndex * DIAL_STEP_DEGREES;
  const thumbX =
    DIAL_CENTER + Math.cos((thumbAngle * Math.PI) / 180) * DIAL_TICK_RADIUS;
  const thumbY =
    DIAL_CENTER + Math.sin((thumbAngle * Math.PI) / 180) * DIAL_TICK_RADIUS;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FocusZone</Text>
      <Text style={styles.subtitle}>
        Put your phone down and get to work.
      </Text>

      <View
        style={styles.dial}
        {...panResponder.panHandlers}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Session duration"
        accessibilityValue={{
          min: DURATION_PRESETS[0],
          max: DURATION_PRESETS[DURATION_PRESETS.length - 1],
          now: selectedDuration,
          text: `${selectedDuration} minutes`,
        }}
      >
        <View style={styles.dialTrack} pointerEvents="none" />

        {Array.from({ length: DIAL_TICK_COUNT }, (_, index) => {
          const angle = (index / DIAL_TICK_COUNT) * 360;
          const radians = (angle * Math.PI) / 180;
          const isActive = index < activeTickCount;

          return (
            <View
              key={index}
              pointerEvents="none"
              style={[
                styles.dialTick,
                isActive && styles.dialTickActive,
                {
                  left:
                    DIAL_CENTER + Math.cos(radians) * DIAL_TICK_RADIUS - 1,
                  top:
                    DIAL_CENTER + Math.sin(radians) * DIAL_TICK_RADIUS - 4,
                  transform: [{ rotate: `${angle + 90}deg` }],
                },
              ]}
            />
          );
        })}

        {DIAL_LABELS.map((label, index) => {
          const angle = index * DIAL_STEP_DEGREES;
          const radians = (angle * Math.PI) / 180;

          return (
            <Text
              key={label}
              pointerEvents="none"
              style={[
                styles.dialLabel,
                index === selectedIndex && styles.dialLabelActive,
                {
                  left:
                    DIAL_CENTER + Math.cos(radians) * DIAL_LABEL_RADIUS - 12,
                  top:
                    DIAL_CENTER + Math.sin(radians) * DIAL_LABEL_RADIUS - 9,
                },
              ]}
            >
              {label}
            </Text>
          );
        })}

        <View
          pointerEvents="none"
          style={[
            styles.dialThumb,
            { left: thumbX - 9, top: thumbY - 9 },
          ]}
        />

        <View style={styles.dialCenter} pointerEvents="none">
          <Text style={styles.dialValue}>{selectedDuration}</Text>
          <Text style={styles.dialUnit}>MINS</Text>
        </View>
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
  dial: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    marginBottom: 32,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialTrack: {
    position: 'absolute',
    width: DIAL_SIZE * 0.8,
    height: DIAL_SIZE * 0.8,
    borderRadius: DIAL_SIZE * 0.4,
    borderWidth: DIAL_SIZE * 0.1,
    borderColor: '#1A1A2E',
  },
  dialTick: {
    position: 'absolute',
    width: 2,
    height: 8,
    backgroundColor: '#666',
  },
  dialTickActive: {
    backgroundColor: '#4AFF8A',
  },
  dialLabel: {
    position: 'absolute',
    color: '#666',
    fontSize: 12,
    width: 24,
    textAlign: 'center',
  },
  dialThumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4AFF8A',
    borderWidth: 3,
    borderColor: '#1A1A2E',
  },
  dialCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialValue: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '300',
    lineHeight: 40,
  },
  dialLabelActive: {
    color: '#4AFF8A',
    fontWeight: '700',
  },
  dialUnit: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  startBtn: {
    width: DIAL_SIZE,
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
