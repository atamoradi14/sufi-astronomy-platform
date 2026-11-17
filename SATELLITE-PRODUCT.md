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

## Verified release: 17 November 2026

- Web release `release-20261117-07`, source `f0b7c24`, image
  `docker.io/atamoradi/manderia@sha256:a662338e05551768004413fea47521a66aa4ccc71a23215fedfd167f7889c113`.
- Satellite release `release-20261117-01`, source `cd3b33b`, image
  `docker.io/atamoradi/fanous-satellite@sha256:760be044a77161e66f394819ed1b47744e4b31bbfc246029d7857753f2de8cf4`.
- Both workloads ready on `ravand-worker-01`, zero restarts at release verification.
- Android release build and lint succeeded; APK signature verified. Public APK is
  1,036,370 bytes, SHA-256
  `a79d8d5761b290dff90ab4eb785deb5c541d47d85494a733c42b1224eb83b9fd`.
  Downloaded production bytes match the locally verified signed file exactly.
- Main suite: 54 passing tests, including Kepler energy/period, LVLH axes and
  Earth occultation. Service suite: 2 passing integration/validation tests covering
  matching-email approval, expiry, cross-owner rejection, role separation,
  one-use viewer tickets, wrong-Origin rejection, telemetry, binary camera and revoke.
- Production protocol verified over public HTTPS/WSS with a synthetic native
  publisher using Android's OkHttp user-agent: pairing, two simultaneous viewers,
  telemetry/Kalman diagnostics, camera frames, publishing reconnect and revocation.
  Only the uniquely named test records were removed afterwards.
- Browser checks: two viewers received live telemetry and camera; no local
  sensor/GPS/camera reads; a different Google fixture account saw zero devices
  and could not revoke the owner's device; cross-Origin writes rejected.
  Phone/tablet/desktop layouts, Persian/English, charts, equations and orbit preview
  exercised without page errors or horizontal document overflow.
- Public production page returns 200, shows the anonymous Google gate and APK
  link, and denies camera/GPS/IMU acquisition through Permissions-Policy. Internal
  control routes return 404 publicly. Google auth remains available, core public
  pages are healthy, the sitemap includes `/satellite`, and the old route redirects.
- All pre-existing account IDs were preserved across both web rollouts. The users
  SQLite database was integrity-checked and backed up before each deployment.
- Shared gateway config/runtime and owning desired-state backed up locally under
  `.local/gateway-backups/satellite-20261117T012232Z` and on the worker under
  `/var/backups/manderia/caddy/satellite-20261117T012232Z`; the later route-order
  correction has an additional `satellite-20261117T012522Z` backup.

Not hardware-verified: APK installation on a physical phone, actual sensor/lens
alignment, low-light camera quality, and OEM-specific background/battery behavior.
No physical Android device was connected during this release. Protocol tests and
synthetic streams are not evidence of real handset attitude accuracy.

## Version 1.1 update

- Android remembers one approved phone registration. Its paired screen hides email/request controls, shows actual socket connection status with a large green/red transmission toggle (amber while reconnecting), one camera toggle, dashboard and relay controls. Cancellation revokes the server credential before local pairing is cleared. Pending challenges survive app restarts.
- SHA-256 of Android scoped ANDROID_ID identifies a phone within this signing key/package/Android user; it is not a global hardware serial or an attestation mechanism. Server active-registration uniqueness prevents duplicate pairings; existing clients register their identity after upgrading. Older clients must upgrade before making new requests. A factory reset or Android-user change can create a new scoped identity. Existing paired credentials remain usable.
- The stale SM-G781B entry that never published was backed up and revoked; the working registration was preserved.
- Orbit graphics use attributed Solar System Scope Earth/cloud textures, simulated sunlight, a spacecraft with solar panels and rear camera along body minus-Z, a ray/FOV guide, Earth overview, follow mode and camera mode. Imagery is static; spacecraft size is exaggerated for legibility.
- Focused checks only for this release: Android assemble/lint/signature, TypeScript/build checks, two service tests including duplicate rejection and device unpair, and one browser orbit/interaction smoke check. No full test-suite rerun.

Version 1.1 production delivery: web `release-20261117-08`, satellite service `release-20261117-02`, source `108a55c`. Signed APK versionCode 2 / 1.1.0, SHA-256 `2be15481b51f1ca18c8902d4ad2beb06f90756b182043abe98fd989619c13638`. Public download matches the signed bytes. Live duplicate request returns 409; cancelled pending requests return rejected (403 when claimed). One working device remains after revoking only the stale never-published duplicate. Database backup precedes migration and web account backups precede rollout.

## Trial and paid access

The public satellite page, APK download and prices remain accessible to everyone.
A verified Google user has one persistent 15-minute elapsed-time trial, starting
at the first authenticated Android WebSocket connection after billing is released.
Disconnects, another phone, unpair/re-pair and service restarts do not reset it.
At expiry the service rejects viewer tickets and closes active publishers/viewers
with code 4003; no more sensor/camera packets are accepted. Android 1.2 stops its
foreground relay, retains its pairing and links the user to the control room.
`atamoradi8@gmail.com` is the billing administrator and is exempt from this limit.

Initial editable plan: 30 days, 199,000 toman or US$5, manual renewal. The admin
can create plans and edit bilingual names, days, toman/USD-cent prices and whether
they are for sale, under “Manage plans & pricing” on the satellite page. `/admin`
links to it. Existing orders retain their original price/duration snapshots;
changing a plan never rewrites a purchased period. New paid periods extend after
any current trial/paid period. No automatic charges or recurring subscription.

Billing tables live in the separate satellite SQLite database: `satellite_accounts`,
`satellite_plans`, `satellite_orders`, `satellite_payment_events`, and
`satellite_billing_audit`. Keep the PVC and database backups on all deployments.
The trial timestamp and payment records must never be cleared to reset access.
Plan changes are audit logged. Full refunds revoke their order's entitlement;
partial refunds do not revoke the remainder of that order's access.

Darvazeh's restricted Stripe key and Iran Ezpay broker credentials/wallet are reused
privately, without modifying Darvazeh or the relay. Fanous orders use dedicated
metadata `app=fanous-satellite`, factor prefix `fanous-satellite-` and isolated
receipts; unrelated Stripe events never activate Fanous. Stripe amounts, currency,
user/order metadata, payment status, line items and mode are checked from Stripe's
API. Webhook signatures are verified against the raw body and timestamp before
processing. Ezpay converts toman to rial (x10), probes the verified receiving
wallet, and verifies exact request id, factor/receiver lookup, rial amount and
transaction reference. The browser return URL cannot mark an order paid.
Reconciliation polls open orders fairly every minute and also runs on request.

Private reuse inputs: `.local/darvazeh-billing-reuse.json`; deployment configuration:
`.local/satellite-billing-config.json`. Both are ignored and contain merchant
credentials: keep private. `scripts/bootstrap-satellite-payments.py` imports the
approved config and optional `SATELLITE_STRIPE_WEBHOOK_SECRET` from `.env` and
checks wallet readiness without charging anyone. The service release helper
loads the settings into `fanous-satellite-config`; the web server never receives
provider secrets. Existing worker/gateway routes already cover the endpoints.

Stripe requires a separate endpoint:
`https://fanous.online/satellite-api/billing/stripe/webhook`.
Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
`checkout.session.async_payment_failed`, `checkout.session.expired`, `charge.refunded`.
The reused restricted key cannot create/list webhooks (HTTP 403). An operator must
create it in Stripe, save its signing secret locally as
`SATELLITE_STRIPE_WEBHOOK_SECRET` in `.env`, run the private bootstrap script,
and redeploy the existing satellite image with updated config. Darvazeh's webhook
signing secret is endpoint-specific and is not reused. Stripe checkout remains
disabled until the Fanous signing secret is configured. Ezpay is independent.

Focused checks: exact trial boundary and persistence, WebSocket shutdown and 402
tickets after expiry, admin/owner isolation, historical price snapshots, forged
webhook signatures, mismatched amounts, duplicate settlement, and rial conversion.
Mobile browser checks cover visible prices/admin editors and the expired paywall.
No real customer payment or real card charge is generated for testing.
