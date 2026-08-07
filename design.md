# FocusZone Design

## Product

FocusZone is a motion-enforced focus timer. A user chooses a session duration,
places the phone flat on a desk, and works until the timer completes. Moving the
phone pauses the session and requires the phone to be returned to the zone.

The current product is intentionally focused on one job: start and protect a
focus session. It is not currently a general-purpose timer, meditation app, or
interval-timer toolkit.

## Current Visual Language

- Canvas: near-black `#0D0D0D`.
- Primary action/accent: bright green `#4AFF8A`.
- Destructive/warning state: red, centered around `#FF3B30` and `#FF6B6B`.
- Secondary surfaces: dark indigo `#1A1A2E`.
- Primary text: white.
- Secondary text: gray, generally `#666` to `#888`.
- Typography: bold headings, light large timer numerals, tabular numerals for time.
- Layout: centered content, generous vertical spacing, rounded controls, no imagery.
- Status bar: light content on the dark background.

The visual tone is direct and utilitarian: the green action state means the
session is ready or healthy, while red is reserved for a motion violation.

## Current Flow

### Home

- Title: `FocusZone`.
- Supporting copy: `Put your phone down and get to work.`
- Duration selection with three presets: `25 min`, `50 min`, and `90 min`.
- Selected duration uses a green border, green text, and a dark green surface.
- Full-width green `Start Session` button.
- Bottom `Settings` link.

### Arming

- Five-second numeric countdown in large light-weight green text.
- Instruction: `Place your phone flat on the desk`.
- Brief calibration step after the countdown.
- The session arms automatically after a flat-phone reading or a short fallback
  timeout.

### Active Session

- Centered `IN ZONE` green status badge.
- Large `MM:SS` countdown.
- Session duration label below the timer.
- Violation count appears only after a violation.
- Ending requires holding `Hold to end session` for two seconds.

### Violation

- Full red-tinted background: `#1A0000`.
- Red circular alert icon.
- Clear title: `Zone Violation Detected`.
- Instruction to return the phone flat to the desk.
- Violations and time remaining shown as compact information rows.
- The timer does not advance while violated.

### Session End

- Neutral near-black background.
- Green success state for completion; the early-end state uses a stop label.
- Summary includes duration, violations, and time out of zone when applicable.
- Green `Back to Home` button.

### Settings

- Same dark canvas and green accent.
- Motion sensitivity choices: low, medium, and high.
- Alert style choices: silent, low tone, and loud.
- Selected options use a green border, green text, and an `OK` marker.

## Current Interaction Contract

- A session begins in `idle`.
- Starting a duration moves the session to `arming`.
- Arming moves it to `active` and establishes the motion baseline.
- Motion moves it to `violated`.
- Returning the phone to the zone moves it back to `active`.
- Reaching zero moves it to `completed`.
- A two-second hold while active moves it to `ended-early`.
- Active and violated sessions persist across app restarts.
- The screen stays awake during arming, active, and violated states.

## Planned Duration Change

Replace the fixed `25/50/90` preset row with one customizable duration control.
The rest of the session behavior remains unchanged unless explicitly decided
otherwise.

The replacement must:

- Produce the same `durationMinutes` value used by the existing session flow.
- Make the selected duration obvious before starting.
- Work on narrow phone screens without clipping.
- Keep the existing green primary-action language.
- Avoid adding interval bells, meditation modes, or shutdown timers as part of
  this change.

The reference images suggest a wheel-style duration picker and a bottom-aligned
primary CTA. They are visual inspiration only; they do not change the current
FocusZone state machine.

Chosen duration range: `5–180 minutes` in five-minute increments. This covers
normal focus sessions and longer deep-work blocks without making the picker
needlessly difficult to scan.

Chosen placement: the picker replaces the existing preset row directly on the
Home screen. Starting a session remains a single action from Home; no separate
duration setup route is added.

Chosen picker treatment: a vertical wheel with the selected duration centered
and nearby values faded back. The picker remains compact enough to leave room
for the title, supporting copy, and full-width start action.

Chosen initial value: `25 minutes`, preserving the current default and the
familiar Pomodoro starting point.

Chosen persistence: remember the last selected duration for the next Home
screen visit. Use `25 minutes` only when no previous choice exists.

Chosen shortcuts: none. The wheel fully replaces the previous `25/50/90`
preset row rather than adding a second duration-selection mechanism.

Chosen wheel density: show three values at once: the previous value, the
selected value, and the next value. Only the center value receives full
contrast and emphasis.

Chosen value display: show the selected duration as a large number with
`MINS` beneath it, rather than only showing a compact `25 min` label.

Chosen CTA placement: keep `Start Session` in normal content flow immediately
after the duration control. It remains a full-width green primary action; it is
not sticky or bottom-anchored.

Chosen first-pass scope: redesign all FocusZone screens visually while keeping
the existing session behavior, motion enforcement, persistence, and settings
semantics. The reference screens inform the visual language; they do not add
new timer modes or replace FocusZone's state machine.

Chosen visual direction: use one unified FocusZone system across every state.
Do not mix the references' unrelated blue, pink, scenic, and black treatments
as separate product themes.

Chosen progress treatment: retain the existing large numeric countdown for
active sessions. Do not add a circular progress ring or replace the timer with
another progress visualization.

Chosen copy scope: preserve the current screen copy and labels. The redesign
may improve hierarchy and emphasis, but it will not rewrite the product's
instructions or state terminology.

Chosen background treatment: retain the plain near-black canvas. Do not add
scenic imagery, gradients, or decorative atmospheric effects in this pass.

Chosen palette: retain the current green primary accent and red violation
accent. Green communicates ready/healthy state; red remains reserved for
motion violations and warnings.

Chosen typography: stay with platform/system sans-serif typography. Do not add
a display-font dependency for the redesign.

## Open Design Decision

Choose the customizable duration control:

1. Wheel picker for hours and minutes, closest to the reference images.
2. Minutes stepper with plus/minus controls, simplest to understand and test.
3. Numeric duration field with validation, fastest but least expressive.

Recommended: a minutes wheel constrained to the chosen range, with the current
value displayed prominently and no extra timer modes. This preserves the
customizable goal without bringing the other reference-app modes into scope.
