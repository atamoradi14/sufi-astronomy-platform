# Private phone sensor lab

URL: `https://fanous.online/admin/sensors`. Only the verified Google account
`atamoradi8@gmail.com` can open it. The server checks the session identity before
rendering the client component; membership of the general admin allowlist does
not grant this capability. The route is dynamic, noindex, and excluded from the
public sitemap. It is not bound to a particular phone model.

## On an Android phone

1. Sign in with the authorized account, then choose **Phone sensors** in the menu.
2. Press **Start & request permission** and allow motion/orientation and location.
   Each stream reports its own availability. A missing magnetometer API is not
   evidence that the phone has no compass: browser orientation may still work.
3. For gyro calibration, leave the phone untouched on a stationary surface for
   five seconds. For raw magnetic calibration, remove magnetic cases and rotate
   slowly through all three axes for thirty seconds. Insufficient coverage,
   motion during stationary calibration, or excessive distortion is rejected.
4. Browser-reference mode is the default. Calibrated raw fusion is offered only
   after a successful magnetometer calibration. Neither mode invents readings.
5. Select the screen normal (+Z), rear camera direction (-Z), or physical top
   edge (+Y). The default is the direction out of the front screen, not the rear
   camera. Face-up means altitude +90 degrees; azimuth there is undefined.
6. Enter the current local magnetic declination (east positive) and confirm it
   to enable approximate RA/Dec with a fresh GPS fix. Zero is not an automatic
   geomagnetic-model calculation. Device clock accuracy matters.

Stop, navigation away, sign-out/account loss, or hiding the page stops capture.
Returning to the page requires Start again. Samples and calibrations exist only
in page memory; no telemetry endpoint, location upload, or database storage is
used. Reloading clears them. Capture is bounded to 300 samples per vector stream
at approximately 10 Hz and 300 GPS fixes. Optional raw acquisition requests 50 Hz.

## Coordinates and filtering

- Device axes follow W3C: X right, Y physical top, Z out of the screen, independent
  of display rotation. DeviceOrientation rotations are intrinsic Z-X'-Y''.
- The orientation quaternion rotates device vectors into east/north/up. Legacy
  motion rotation rates map `[beta, gamma, alpha]` to body `[x,y,z]`, converting
  degrees/s to radians/s. Accelerometer support force points upward at rest.
- A three-state multiplicative attitude-error Kalman filter predicts with the
  bias-corrected gyro, corrects using a quaternion-log innovation, and maintains
  a full 3x3 covariance with Joseph update and local-error recentering. Bias is
  measured in a separate stationary calibration, not estimated as EKF states.
- Browser mode uses the browser's fused orientation as its sole orientation
  measurement, at approximately 10 Hz. It does not count correlated raw gravity
  and magnetic readings as additional independent measurements. Without a gyro,
  it smooths the reference without inertial prediction. Model sigma is not a
  measured absolute accuracy and retains a conservative covariance floor.
- Raw mode uses calibrated magnetic field and near-static support acceleration
  to form a TRIAD reference. Strong acceleration, implausible magnetic norms and
  nearly vertical magnetic fields cannot provide a valid reference. Calibration
  estimates hard-iron offsets and diagonal soft-iron scales; it is not a full
  ellipsoid fit. It does not modify browser-fused orientation.
- Display yaw/pitch/roll use intrinsic ZYX, not raw alpha/beta/gamma. Yaw is
  counterclockwise from east; compass azimuth runs clockwise from north. Euler
  yaw/roll lose uniqueness near pitch +/-90 degrees; the quaternion remains valid.
- Positive magnetic declination applies a clockwise ENU correction to both the
  phone model and sky direction. Relative orientation cannot supply north or
  equatorial sky coordinates. Fresh orientation and GPS checks prevent an old
  pose or location from looking live. RA/Dec are geometric approximations of date,
  without refraction, rather than a precision telescope pointing solution.
- The 3D model shows attitude at a fixed origin. GPS is geographic position;
  accelerometer integration is deliberately not presented as 3D displacement.

The shared compass hook prioritizes absolute over relative events, uses a common
angle convention, tilt-aware heading projection, circular Kalman smoothing and
continuous CSS rotations through north. The map no longer substitutes GPS travel
course for the phone's compass heading. Unsupported orientation globals are safe.

## Validation and limits

Run `npm test`, `npx tsc --noEmit`, and focused ESLint checks for the mobile-sensors
modules. Math tests include independent W3C pose fixtures, competing source
arbitration, wrap continuity, quaternion sign invariance, gyro integration,
stationary jitter reduction, TRIAD recovery, invalid calibration and spherical
coordinate round trips in both hemispheres. Browser checks use isolated local
accounts and simulated sensor/GPS events, including permission denial, cleanup,
calibration, account gating and bilingual responsive layouts.

Simulated tests do not establish real hardware accuracy. Actual permissions,
magnetic interference and browser sensor support must be checked on the phone.
The first physical checks should be a stationary face-up phone, a slow full turn
through north, a portrait/landscape change, and a screen/rear-camera direction
comparison away from metal and magnets. No Android browser can expose hardware
or APIs that the operating system/browser does not make available.

References: [W3C orientation and motion](https://www.w3.org/TR/orientation-event/),
[W3C orientation reference axes](https://www.w3.org/TR/orientation-sensor/),
[Chrome sensor capabilities](https://developer.chrome.com/docs/capabilities/web-apis/generic-sensor),
[Markley and Bauer, attitude error representations](https://ntrs.nasa.gov/citations/20020060647).
