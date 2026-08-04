# FocusZone

Mobile app that enforces a physical focus contract: the phone must stay in a user-defined spot on the desk for the duration of a timed session, or the app alarms and locks the screen.

## Language

**Focus Zone**:
The spot on the desk where the phone must remain for the duration of a focus session. The zone is marked before the session begins; during the session it means the phone must stay flat and still.
_Avoid_: Safe zone, boundary, allowed area

**Zone Setup**:
The pre-session step where the user holds the phone above the desk and draws a rectangle on the live camera preview to mark the Focus Zone. The camera and the rectangle are not used again once the phone is placed.
_Avoid_: Calibration, configuration

**Focus Session**:
A timed period during which the phone is required to stay in its Focus Zone.
_Avoid_: Study block, timer session

**Zone Violation**:
The phone ceasing to be flat, still, and in place in its Focus Zone during a Focus Session.
_Avoid_: Cheating, breach, leaving the safe zone

**Ending the Session**:
The only deliberate way to use the phone during a Focus Session without triggering a Zone Violation. Performed while the phone is still lying flat on the desk, by a deliberate on-phone gesture. Ends the session without penalty.
_Avoid_: Aborting, quitting, bypassing, unlocking

**Violation Recovery**:
The way a Zone Violation ends: the user puts the phone back flat and still, and the alarm stops and the Focus Session resumes on its own. There is no on-screen acknowledgment button; the phone forgives through physics alone.
_Avoid_: Acknowledgment, confirming, dismissing
