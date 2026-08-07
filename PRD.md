FocusZone – Product Requirements Document (PRD)
1. Overview
Product name: FocusZone
One-liner: A focus enforcer that makes cheating physically inconvenient. Put your phone on the table, define a “safe zone” via the camera, and if the phone leaves that zone during a focus session, the app alarms and locks you out.

Hackathon theme fit: Optimizes the technology behind the systems we depend on (smartphones) by turning the phone from a distraction device into an enforced focus tool.

Target users:

Students who need to study without phone distraction.

Anyone who wants brutal, physical enforcement of focus sessions.

Core value proposition:

Not “gentle reminders” or “soft limits.”

If your phone moves out of the defined zone, it screams and locks.

Makes using your phone during focus sessions as inconvenient as possible.

2. Problem Statement
Students and focused workers know they should not use their phones while studying, but:

Existing focus apps rely on willpower (you can just turn them off).

App blockers are often bypassed or ignored.

There’s no physical “contract” that makes cheating annoying in real time.

Result: People keep checking their phones, breaking focus, and wasting study time.

3. Solution
FocusZone adds a physical constraint to focus sessions:

User puts phone face-up on the table, camera pointing up.

Via the camera preview, they draw a rectangle on the screen that maps to a “safe zone” on the table.

During a focus session, the app monitors the phone’s position/motion.

If the phone moves outside the rectangle:

Loud alarm/notification triggers.

App shows a “You left your focus zone” lock screen.

(Optionally) distracting apps are blocked or access is restricted.

This makes cheating physically inconvenient and immediately noticeable.

4. Goals & Non-Goals
Goals (MVP)
Provide a simple, visual way to define a “safe zone” on a table using the camera.

Detect when the phone moves outside that zone during a focus session.

Trigger a loud alarm and a lock screen when the zone is violated.

Allow users to start/end focus sessions easily.

Be demoable in 1–2 minutes with a clear before/after story.

Non-Goals (for hackathon MVP)
Perfect AR tracking or sub-centimeter precision.

Full OS-level app blocking across all apps (can be partial or simulated).

Multi-device sync, accounts, cloud, or social features.

Complex analytics or gamification.

5. User Stories
US1 – Define a Focus Zone
As a user,
I want to see my camera feed and draw a rectangle on the screen,
So that I can define the area on the table where my phone is allowed to stay.

Acceptance criteria:

App shows live camera preview.

User can draw a rectangle by dragging on the screen.

Rectangle is visible and adjustable before starting a session.

App stores the rectangle for the current session.

US2 – Start a Focus Session
As a user,
I want to start a timed focus session with my defined zone,
So that the app can monitor my phone’s position and enforce the rule.

Acceptance criteria:

User can pick a duration (e.g., 25 / 50 / 90 minutes).

“Start session” button begins a timer and starts monitoring.

UI clearly shows: time remaining, zone status (“in zone” / “violated”).

US3 – Detect Zone Violation
As a user,
I want the app to detect when my phone moves outside the defined zone,
So that cheating is immediately flagged.

Acceptance criteria:

App uses motion sensors (accelerometer/gyroscope) and/or camera frame changes to infer movement.

When movement indicates the phone has left the zone, the app triggers a violation state.

Detection works reasonably well in normal indoor conditions (good lighting, flat table).

US4 – Alarm & Lock on Violation
As a user,
I want the app to make a loud noise and show a lock screen when I cheat,
So that using my phone becomes annoying and I’m discouraged from repeating it.

Acceptance criteria:

On zone violation:

Loud alarm sound plays (max volume if possible).

Full-screen “You left your focus zone” message appears.

User must acknowledge the violation (e.g., press a button) to continue.

Alarm is clearly noticeable even if the phone was face-down or in another room.

US5 – End Session Normally
As a user,
I want to end a focus session when the timer completes,
So that I can use my phone normally again.

Acceptance criteria:

When timer reaches 0, monitoring stops.

App shows “Session completed” screen.

No alarm is triggered if the phone moves after session ends.

6. Functional Requirements
FR1 – Camera Preview & Zone Drawing
FR1.1: App must display live camera preview on the “Set Zone” screen.

FR1.2: User must be able to draw a rectangle by touch-dragging on the preview.

FR1.3: Rectangle coordinates must be stored relative to the camera frame.

FR1.4: User can reset/re-draw the rectangle before starting a session.

FR2 – Focus Session Management
FR2.1: User can select session duration from preset options (e.g., 25, 50, 90 minutes).

FR2.2: App displays a countdown timer for the session.

FR2.3: Session can be manually ended by the user (with optional confirmation).

FR2.4: Only one active session at a time.

FR3 – Motion & Zone Monitoring
FR3.1: App must monitor device motion using accelerometer/gyroscope during sessions.

FR3.2: Optionally, app may use camera frame changes to detect sliding/movement.

FR3.3: App must infer when the phone has moved beyond the defined rectangle.

FR3.4: Sensitivity threshold must be tunable (to avoid false positives from small vibrations).

FR4 – Violation Handling
FR4.1: On zone violation, app must trigger a loud alarm sound.

FR4.2: App must show a full-screen violation UI (“You left your focus zone”).

FR4.3: User must explicitly acknowledge the violation (e.g., “I understand” button).

FR4.4: Violation events are logged locally (count, timestamps) for demo purposes.

FR5 – Basic Settings (Optional, Nice-to-Have)
FR5.1: Allow user to adjust alarm volume (within OS limits).

FR5.2: Allow user to adjust motion sensitivity.

FR5.3: Allow user to choose from 2–3 alarm sounds.

7. Non-Functional Requirements
Performance:

Motion detection loop should run at least 10–20 Hz.

UI must remain responsive during monitoring.

Battery:

Reasonable battery usage for 1–2 hour sessions; avoid unnecessary background work when no session is active.

Privacy:

Camera feed is used locally only; no images/video are stored or sent anywhere.

No account or cloud storage required for MVP.

Robustness:

App should handle poor lighting / noisy sensor data gracefully (e.g., ignore tiny movements).

Clear error messages if camera or sensors are unavailable.

Platform:

Primary: React Native (iOS + Android if time permits).

Fallback: focus on one platform if time is tight.

8. Technical Architecture (High-Level)
8.1 Stack
Frontend: React Native (Expo if possible for speed).

Camera:

expo-camera or react-native-vision-camera for preview.

Sensors:

expo-sensors (accelerometer, gyroscope) or equivalent.

Audio:

expo-av or react-native-sound for alarm.

Storage:

AsyncStorage or expo-secure-store for session settings/logs.

8.2 Core Modules
CameraZoneModule

Handles camera preview.

Captures rectangle coordinates from user input.

Provides zone data to MotionModule.

MotionModule

Subscribes to accelerometer/gyroscope data.

Computes movement metrics (e.g., displacement, rotation).

Decides if movement exceeds threshold → zone violation.

SessionModule

Manages session state (idle, active, violated, completed).

Controls timer.

Coordinates between CameraZoneModule and MotionModule.

AlarmModule

Plays alarm sound on violation.

Manages volume and sound selection.

UI Layer

Screens:

Home (start/stop session, settings).

SetZone (camera preview + rectangle drawing).

ActiveSession (timer, status).

Violation (full-screen alarm + acknowledgment).

9. Data Model (Local Only)
SessionLog (local)
id (string)

startTime (timestamp)

endTime (timestamp or null)

durationSeconds (number)

violationsCount (number)

status (‘completed’ | ‘aborted’ | ‘violated’)

Settings (local)
sensitivity (number, 1–5)

alarmVolume (number, 0–1)

alarmSoundId (string)

No server-side DB is required for MVP.

10. MVP Scope (Hackathon Version)
Must-have features:

Camera preview + rectangle drawing.

Focus session timer (presets).

Motion detection using sensors.

Zone violation detection (basic thresholding).

Loud alarm + full-screen violation UI.

Session completion screen.

Nice-to-have (if time):

Sensitivity and volume settings.

Simple violation history (list of past sessions with violations).

Basic app blocking simulation (e.g., show a fake “apps locked” screen).

Out of scope for MVP:

Full OS-level app blocking across all apps.

Cloud sync, accounts, or social features.

Advanced AR tracking.

11. Demo Story (for Judges)
Narrative:

Show the problem:

“I’m trying to study, but my phone is right here, buzzing, tempting me.”

Show the setup:

Open FocusZone, show camera preview.

Draw a rectangle around the phone’s spot on the table.

Start a session:

Pick 25 minutes, hit “Start.”

Show timer running, status “In zone.”

Demonstrate violation:

Move the phone out of the rectangle.

Alarm goes off, full-screen “You left your focus zone.”

Explain:

“This optimizes the phone from a distraction device into an enforced focus tool. It makes cheating physically annoying.”

Keep the demo under 2 minutes.

12. Risks & Mitigations
Risk: Motion detection is too noisy (false positives).

Mitigation: Add sensitivity setting; ignore small movements; test on a stable surface.

Risk: Can’t implement full app blocking in time.

Mitigation: Focus on alarm + lock screen; simulate blocking visually if needed.

Risk: Camera/motion integration in React Native is tricky.

Mitigation: Use Expo and well-maintained libraries; keep logic simple; prioritize one platform.

Risk: Time runs out.

Mitigation: Stick strictly to MVP scope; cut settings and history before core flow.

13. Success Metrics (for Hackathon)
Functional:

App can start a session, detect movement, and trigger alarm in demo.

No crashes during 2-minute demo.

Theme fit:

Clear story: “Optimizing phone behavior for focus.”

Demo quality:

Judges can see the rectangle, the movement, and the alarm in real time.

Explanation is under 2 minutes and easy to understand.

Completeness:

At least one end-to-end flow works: set zone → start session → violate → alarm.

14. Future Enhancements (Post-Hackathon)
Better motion models (sensor fusion, AR-based tracking).

These can be decided during implementation, but default should be:

One platform first (likely the one you’re most comfortable with).

No deep OS blocking in MVP; focus on alarm + lock.

Medium sensitivity, adjustable if time allows.

