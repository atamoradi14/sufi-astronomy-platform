# Build your own satellite

## Approved scope and delivery plan

The product has a downloadable native Android app, an isolated telemetry service,
and a Fanous dashboard at `/satellite`. The old private phone-sensor URL redirects
to this product. Browsers are viewers; no browser path starts local phone/laptop
sensors. Device acquisition belongs exclusively to the approved Android app.

1. Define and test pairing, device/viewer authentication, bounded telemetry,
   reconnects, revocation, and owner isolation in a separate service.
2. Build a signed Android APK: native accelerometer, gyro, magnetometer,
   rotation-vector quaternion and GPS, foreground notification, explicit start/
   stop and camera permission, relay/display-saving mode, and dashboard shortcut.
3. Build the bilingual Fanous dashboard: APK download, Google sign-in, pending
   approval requests, connected-device selection, live plots, attitude, sky and
   optional camera relay. Phone and laptop use the same dashboard.
4. Add a two-body orbital simulator with six classical elements and epoch. Real
   phone attitude/rates command the simulated spacecraft's body orientation.
5. Test protocols and science, compile/verify the signed APK, exercise browser
   flows, deploy separate workloads, back up the shared gateway before adding a
   narrowly scoped route, and verify the public production paths.

## Identity and privacy

Entering an email in the app requests pairing; it does not authenticate ownership.
The app displays a short challenge and opens the normal Fanous system-browser
Google login. Only a signed-in user whose verified email matches the request can
explicitly approve it. Claiming approval also requires the app's high-entropy
pairing secret. A browser never receives the device's publishing credential.

The existing web OAuth client is sufficient for this flow. Native Google OAuth
can be added later with its own Android package/certificate registration.

Device and viewer credentials have separate audiences. The web backend exchanges
its verified session for a short-lived, single-use viewer ticket. Devices cannot
read another owner's telemetry. Revocation terminates publishing and watching.
Pairing requests expire; request rates and payload sizes are bounded.

Camera activation is a local Android action with native permission and a visible
foreground notification. The laptop cannot remotely enable a phone camera or
start a phone's sensors. No microphone is requested. Camera frames and recent
telemetry are bounded live memory, not a video archive. The SQLite volume stores
pairing/device records, not continuous GPS or camera history.

## Service boundary

`services/satellite` owns pairing, device credentials, telemetry, viewer tickets,
WebSocket fanout, the APK download, and a separate SQLite volume. Its public path
is `/satellite-api/`; its internal control API accepts only signed Fanous session
claims. It runs as its own Kubernetes Deployment/Service/PVC. Fanous retains Google
authentication and the dashboard; existing lessons, accounts and tools remain on
the existing deployment.

## Native device and battery behavior

Native Android sensor APIs remove the browser's raw-magnetometer limitation.
Actual hardware availability is reported, never replaced by fabricated readings.
The rotation-vector frame is device-to-magnetic east/north/up; scalar/vector order
is converted explicitly to `[x,y,z,w]`. Motion rates use radians/s and fields µT.
GPS is timestamped and includes accuracy. A foreground service runs acquisition
only after an explicit user start and remains visible in Android's notification.

Relay mode leaves native acquisition active while the screen is dimmed/off and
disables camera transmission for lower power. The phone can open the same web
dashboard in its system browser. Android/OEM power management and camera behavior
still require a real-phone check; simulated streams are not hardware validation.

## Orbit semantics

Inputs are semi-major axis (km), eccentricity, inclination, ascending-node longitude,
argument of periapsis, and mean anomaly at an explicit epoch. A Newton-solved
Kepler model uses Earth µ = 398600.4418 km³/s², with bound orbits and perigee above
Earth enforced. It omits drag, J2 and maneuvers and is labelled an educational
simulation. The simulated position is never confused with the phone's real GPS.

Phone attitude is mapped to a right-handed LVLH spacecraft-command frame:
X along-track, Y opposite orbit normal, Z nadir. The orbit determines translation;
the phone determines body attitude and measured body angular rates. An inertial
sky view uses J2000 catalog vectors and Earth occultation rather than a ground
observer horizon. Live ground sky uses actual device GPS and automatic WMM north
correction. Camera frames use their capture-time attitude, not an unrelated newer
telemetry sample.

## Acceptance evidence

## Operator runbook

- Public entry: `https://fanous.online/satellite`; legacy `/admin/sensors` redirects here.
- Signed APK: `/satellite-api/download/fanous-satellite.apk`; SHA-256 and version: `/satellite-api/download/manifest.json`.
- Build Android: `pwsh -File scripts/build-android.ps1`. Requires Android SDK 35,
  JDK 21 and Gradle 8.11.1 (or `-GradlePath`). It assembles, lints and verifies the
  signature before copying the APK and manifest into the service release.
- Preserve `.local/android-signing/` in a private encrypted operator backup. The
  same keystore is needed for Android upgrades. Never commit it or its password.
  Certificate SHA-256: `82c354fc1a5ffd5954c2a1487d95949b704b9355943af1993429b4068a622514`.
- Native package `online.fanous.satellite`, minimum Android 8.0/API 26. Install
  from the website, enter the same email as the Google web session, compare the
  eight-digit code and approve the pending device. Press Start on the phone.
- Private `.env` adds `SATELLITE_SHARED_SECRET` (random, at least 32 characters)
  and `SATELLITE_SERVICE_URL=http://fanous-satellite.astronomy.svc.cluster.local:3860`.
  The web and satellite Kubernetes Secrets must contain the same shared secret.
  Do not rotate it casually: existing device tokens would need re-pairing.
- Commit the verified APK and sources, build from a clean checkout with
  `python scripts/satellite-release.py build-and-push --tag <unique-tag>`, then
  `python scripts/satellite-release.py deploy --tag <same-tag>`. Matching PowerShell
  and Bash wrappers are supplied. Release records are in `.releases/`.
- Main website releases remain `scripts/release.py`; it now includes the satellite
  BFF settings in the existing auth Secret without changing the accounts database.
- Gateway: `python scripts/satellite-gateway.py` backs up live config/runtime and
  owning desired-state locally and on the worker, validates drift and reloads
  only the managed Fanous block. Other hosts remain unchanged. `/satellite-api/v1/*`
  is not public; the authenticated web server calls control APIs internally.
- Deployment/service/PVC: `fanous-satellite`, `fanous-satellite`,
  `fanous-satellite-data` in namespace `astronomy` on `ravand-worker-01`.
  SQLite pairing/device records are `/data/satellite.sqlite`, independent of
  `/data/users.sqlite` in the main website. In-memory telemetry/camera are lost
  on service restart; the native relay reconnects automatically.
- Diagnose: `kubectl --context ravand -n astronomy logs deployment/fanous-satellite`
  and `get pods,pvc,service`; health is `/satellite-api/health`. No tokens are
  logged. Pending pairings expire in ten minutes; device credentials in 90 days.
- Recovery: preserve the PVC and roll back the Deployment image to a previous
  recorded digest. Subsequent releases vacuum a checked database backup to
  `/data/backups/` first. Gateway backups restore both ConfigMap/owning files
  and reload saved runtime JSON using Caddy stdin without the Caddyfile adapter.
- Browser viewers never access local sensors, GPS or camera. Only the native app
  publishes. Camera is sampled at up to 1 JPEG/second for low bandwidth, not a
  high-frame-rate video call. Relay mode disables camera and sends sensors at 5 Hz;
  normal mode uses 10 Hz. Kalman diagnostics are server-generated per device.
- Physical lens alignment, weak-field compass behavior, low-light visibility,
  GPS availability and OEM background limits depend on hardware. Missing sensors
  remain missing; no fabricated raw magnetometer channels are provided.

Required checks: cross-owner rejection; pairing-secret and code expiry; no device
publishing via viewer credentials; revoke/disconnect behavior; telemetry bounds
and reconnect; camera opt-in/stop; quaternion axes and sky centre/roll; orbital
period/energy and element validation; APK signature/package/permissions; two web
viewers receiving the same device; no desktop sensor acquisition; production
health/readiness, account preservation and APK SHA-256. Physical phone installation,
OEM background behavior and actual lens/IMU alignment are recorded separately.
