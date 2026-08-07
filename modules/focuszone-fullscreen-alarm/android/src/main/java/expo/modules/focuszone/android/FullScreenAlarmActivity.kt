package expo.modules.focuszone.android

import android.app.Activity
import android.app.NotificationManager
import android.content.Context
import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.view.WindowManager
import android.widget.Button
import android.widget.FrameLayout
import android.widget.TextView

class FullScreenAlarmActivity : Activity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    window.addFlags(
      WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
        WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
    )

    val root = FrameLayout(this).apply {
      setBackgroundColor(Color.parseColor("#1A0000"))
    }

    val label = TextView(this).apply {
      text = "🚨 ZONE VIOLATION"
      textSize = 34f
      setTextColor(Color.parseColor("#FF3B30"))
      gravity = Gravity.CENTER
    }
    root.addView(
      label,
      FrameLayout.LayoutParams(
        FrameLayout.LayoutParams.MATCH_PARENT,
        FrameLayout.LayoutParams.MATCH_PARENT
      )
    )

    val okButton = Button(this).apply {
      text = "I'm back. Resume."
      setTextColor(Color.WHITE)
      setBackgroundColor(Color.parseColor("#FF3B30"))
      setOnClickListener {
        cancelNotification()
        finish()
      }
    }
    root.addView(
      okButton,
      FrameLayout.LayoutParams(
        FrameLayout.LayoutParams.WRAP_CONTENT,
        FrameLayout.LayoutParams.WRAP_CONTENT
      ).apply {
        gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
        bottomMargin = 120.dp
      }
    )

    setContentView(root)
  }

  private fun cancelNotification() {
    val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    nm.cancelAll()
  }

  private val Int.dp: Int
    get() = (this * resources.displayMetrics.density).toInt()
}
