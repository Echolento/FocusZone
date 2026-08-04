const { withAndroidManifest } = require('@expo/config-plugins');

const ACTIVITY = 'expo.modules.focuszone.android.FullScreenAlarmActivity';

function withFullScreenAlarm(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const application = manifest.manifest.application && manifest.manifest.application[0];
    if (!application) return config;

    const existing = Array.isArray(application.activity) ? application.activity : [];
    const hasActivity = existing.some((a) => a.$ && a.$['android:name'] === ACTIVITY);
    if (!hasActivity) {
      application.activity = existing.concat([
        {
          $: {
            'android:name': ACTIVITY,
            'android:exported': 'true',
            'android:theme': '@android:style/Theme.Black.NoTitleBar.Fullscreen',
            'android:showWhenLocked': 'true',
            'android:turnScreenOn': 'true',
            'android:excludeFromRecents': 'true',
          },
        },
      ]);
    }
    return config;
  });
}

module.exports = withFullScreenAlarm;
