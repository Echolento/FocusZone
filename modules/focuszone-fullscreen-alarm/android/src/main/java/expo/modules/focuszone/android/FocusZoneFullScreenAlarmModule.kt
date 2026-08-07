package expo.modules.focuszone.android

import android.Manifest
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class FocusZoneFullScreenAlarmModule : Module() {
  private val channelId = "focuszone_violation"
  private val notificationId = 1001

  override fun definition() = ModuleDefinition {
    Name("FocusZoneFullScreenAlarm")

    AsyncFunction("requestPermissions") {
      requestNotificationPermission()
    }

    AsyncFunction("show") {
      fireAlarmNotification()
    }
  }

  private fun requestNotificationPermission() {
    val activity = appContext.currentActivity ?: return
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      if (activity.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
        activity.requestPermissions(
          arrayOf(Manifest.permission.POST_NOTIFICATIONS),
          REQUEST_NOTIFICATION_PERMISSION
        )
      }
    }
  }

  private fun fireAlarmNotification() {
    val context = appContext.reactContext ?: appContext.currentActivity ?: return
    val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        channelId,
        "Zone violations",
        NotificationManager.IMPORTANCE_HIGH
      ).apply {
        description = "Full screen alarm when you leave your focus zone"
        enableVibration(true)
        lockscreenVisibility = Notification.VISIBILITY_PUBLIC
      }
      notificationManager.createNotificationChannel(channel)
    }

    val intent = Intent(context, FullScreenAlarmActivity::class.java)
      .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
    val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    val fullScreenIntent = PendingIntent.getActivity(context, 0, intent, flags)

    val notification = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      Notification.Builder(context, channelId)
        .setContentTitle("ZONE VIOLATION")
        .setContentText("You left your focus zone")
        .setSmallIcon(android.R.drawable.ic_dialog_alert)
        .setPriority(Notification.PRIORITY_MAX)
        .setCategory(Notification.CATEGORY_ALARM)
        .setOngoing(true)
        .setFullScreenIntent(fullScreenIntent, true)
        .build()
    } else {
      @Suppress("DEPRECATION")
      Notification.Builder(context)
        .setContentTitle("ZONE VIOLATION")
        .setContentText("You left your focus zone")
        .setSmallIcon(android.R.drawable.ic_dialog_alert)
        .setPriority(Notification.PRIORITY_MAX)
        .setOngoing(true)
        .setFullScreenIntent(fullScreenIntent, true)
        .build()
    }

    notificationManager.notify(notificationId, notification)
  }

  companion object {
    private const val REQUEST_NOTIFICATION_PERMISSION = 1337
  }
}
