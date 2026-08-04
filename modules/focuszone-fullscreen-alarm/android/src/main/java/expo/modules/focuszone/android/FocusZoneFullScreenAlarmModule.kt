package expo.modules.focuszone.android

import android.content.Intent
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class FocusZoneFullScreenAlarmModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("FocusZoneFullScreenAlarm")

    AsyncFunction("show") {
      val activity = appContext.currentActivity
        ?: return@AsyncFunction
      val intent = Intent(activity, FullScreenAlarmActivity::class.java)
        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
      activity.startActivity(intent)
    }
  }
}
