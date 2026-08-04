import { requireNativeModule } from 'expo-modules-core';

const NativeModule = requireNativeModule('FocusZoneFullScreenAlarm');

export function showFullScreenAlarm(): void {
  NativeModule.show();
}
