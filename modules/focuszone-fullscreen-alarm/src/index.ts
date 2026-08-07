import { requireNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

const isSupported = Platform.OS === 'android';

const NativeModule = isSupported
  ? requireNativeModule('FocusZoneFullScreenAlarm')
  : null;

export function requestAlarmPermissions(): void {
  NativeModule?.requestPermissions();
}

export function showFullScreenAlarm(): void {
  NativeModule?.show();
}