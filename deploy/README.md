# Fanous-e Khial deployment

The public brand is **فانوس خیال / Fanous-e Khial**. Existing `manderia` infrastructure identifiers are retained; see [brand.md](brand.md) for the identity and asset workflow.

Public URL: https://fanous.online. This follows the existing Darvazeh/Hamafarin worker pattern: context `ravand`, node `ravand-worker-01`, namespace `astronomy`, Deployment and ClusterIP Service `manderia`. The shared Caddy stays in `hamafarin-apps`; no new Ingress, host port, separate database server or Caddy instance is required.

## Release

Prerequisites: Python 3.12+, Docker Linux engine/buildx, Docker Hub login for `atamoradi/manderia`, and kubectl access to `ravand`. PowerShell wrappers require PowerShell 7; Bash wrappers use `python3`. Run from a committed, clean checkout. Credentials come from `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN` or the existing Docker credential helper, and are used for a namespace-local pull Secret without being printed or written to a release file.

```powershell
./scripts/build-and-push.ps1 -Tag release-YYYYMMDD-NN
./scripts/deploy.ps1 apply -Tag release-YYYYMMDD-NN -DryRun
./scripts/deploy.ps1 apply -Tag release-YYYYMMDD-NN
./scripts/deploy.ps1 status
```

```bash
./scripts/build-and-push.sh --tag release-YYYYMMDD-NN
./scripts/deploy.sh apply --tag release-YYYYMMDD-NN --dry-run
./scripts/deploy.sh apply --tag release-YYYYMMDD-NN
./scripts/deploy.sh status
```

Build uses a Git archive, excludes local env files/caches/source books, builds Linux amd64, and labels the image with its full Git source revision. Each unique release record in `.releases/` contains the pushed digest and source revision. Deploy validates the fixed target and exact digest, saves the previous Deployment under `.local/deployment-backups/`, validates on the API server, rolls out, and verifies placement/readiness/running image identity. It stops on failure and never deletes a namespace or PVC. A digest-pinned `IfNotPresent` image and namespace-local Docker Hub Secret are used. Do not edit a release record to substitute another image.

The Next server runs as UID/GID 1001, with no Kubernetes API token, no Linux capabilities, resource limits, and startup/readiness/liveness probes at `/api/health`. The account store is SQLite on the `manderia-users` 1 Gi PVC at `/data/users.sqlite`. The Deployment uses one replica and Recreate to preserve a single writer. Before later deployments the driver takes an online SQLite snapshot, checks its integrity, and retains a private off-pod copy under `.local/user-backups/`. Never delete this PVC during a release.

## DNS and shared gateway

Preview first; `--apply` is required to mutate DNS/Caddy:

```powershell
python scripts/configure-public-endpoint.py --env-file PATH/TO/OPERATOR.env
python scripts/configure-public-endpoint.py --env-file PATH/TO/OPERATOR.env --apply
```

The helper reads only `CLOUDFLARE_API_TOKEN` from the environment or that private env file. No token is copied into this project or the application. It manages `fanous.online`, a proxied A record to worker `2.29.120.138`, and the marked `deploy/caddy/manderia.Caddyfile` block. The former `manderia.daryajan.com` hostname redirects permanently with the full path/query preserved. Apply the gateway configuration only after the application release and the new Google origin/callback are ready. It requires live ConfigMap, active Caddy configuration, and the owning desired-state files in sibling `hamafarin-cluster` to agree. `--gateway-repo` can select that repository explicitly.

Before DNS/gateway mutation it saves the original Caddyfile, ConfigMap, active JSON, owning source, and DNS record under ignored `.local/gateway-backups/<UTC timestamp>/`, and copies the recovery snapshot to **`ravand-worker-01:/var/backups/manderia/caddy/<UTC timestamp>/`** with directory mode 0700 and files 0600. These snapshots can contain resolved gateway credentials: keep them private and never commit them.

The ConfigMap is mounted with `subPath`: updating it alone does not change the running Caddyfile. The helper patches the persisted ConfigMap with a resource-version test and reloads the complete validated configuration through stdin, preserving the other sites. It updates both owning gateway source files for future reconciliation. The existing Caddy image, secrets, certificates, storage, node placement and other routes remain intact.

## Verify and recover

For a domain cutover, require successful resolution through the operator machine's default DNS resolver and a fresh browser without hostname mappings, in addition to public-resolver and origin checks. `curl --resolve` verifies routing/TLS but does not establish normal browser reachability. An earlier negative DNS response can remain cached upstream even after clearing the Windows cache; wait for that response to refresh and repeat normal HTTPS checks before declaring the cutover complete.

Check HTTPS, the title/logo/favicon, both content languages and numeral formats, course/proof navigation, sphere interaction, sky search, the live-chart tabs, and API responses. Also verify the existing Hamafarin and Darvazeh hostnames after the shared reload. Live ISS calls can return a clearly marked sample when the upstream provider times out; do not report that sample as live tracking.

For an application rollback, run deploy with a previously recorded, compatible authenticated release tag (`authSchema: 1`). The driver refuses older stateless releases because they would remove login protection. Only `astronomy/manderia` changes. The previous Deployment snapshot is retained for inspection. For gateway recovery, use the matching snapshot and restore the owning files plus the ConfigMap with a concurrent-change guard, then reload `caddy-runtime.before.json` through `kubectl --context ravand -n hamafarin-apps exec -i deployment/caddy -- caddy reload --config -` (JSON, no adapter). Do not blindly restart the shared gateway or apply an outdated full cluster manifest. Restore/remove only Manderia's DNS record according to `dns.before.json` if DNS rollback is needed.


## Google sign-in and the user administrator

The ignored root `.env` supplies `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, a unique 32+ character `NEXTAUTH_SECRET`, `NEXTAUTH_URL=https://fanous.online`, and comma-separated `ADMIN_EMAILS`. See `auth.env.example` for names only. The deployment driver validates these settings and creates `astronomy/manderia-auth` without logging its values. The app never receives the Cloudflare token. When reusing the existing Google client, preserve Darvazeh’s origin/callback and add the Fanous origin plus `https://fanous.online/api/auth/callback/google`.

Google sign-in uses NextAuth’s OAuth code flow, state and PKCE, and only `openid email profile`. Unverified email identities are rejected. Google’s subject identifier, rather than email alone, keys account records. Only basic profile information and login timestamps/counts are saved; OAuth access/refresh tokens and Gmail messages are not stored. The session is encrypted/signed by NextAuth and uses secure cookies in HTTPS production.

The homepage offers a dismissible login dialog. `/lab`, `/sensor`, and `/atlas` are checked on the server; the embedded course lab checks the validated session too. The public lessons, proofs and informational pages remain available without signing in. `/admin` and `/api/admin/users` check the server session and the configured exact email allowlist, including on each API request. Ordinary users cannot read the account list. The admin page shows real registrations, search and pagination; it does not pre-create or fabricate Google accounts.

SEO uses canonical URLs, `robots.txt`, `sitemap.xml`, social-card metadata, and escaped Website/LearningResource JSON-LD. Protected tools, auth endpoints and admin pages are excluded from the sitemap and marked noindex.

Submit **https://fanous.online/sitemap.xml** in Google Search Console. See [seo.md](seo.md) for the public directory, canonical/indexing policy, structured data and verification procedure.

## Iranian connectivity (November 2026)

Visitors in Iran reported the site hanging while `fanous.online` was proxied through Cloudflare (16–18 November 2026). Cloudflare edges are throttled or challenged on many Iranian networks. The record is now **DNS-only** to the worker, as `ravands.app` has always been, and `configure-public-endpoint.py` keeps it that way. Use `--gateway-only` to change only the Caddy block without a Cloudflare token.

Both shared gateways (`hamafarin-apps` and `ravand`) serve **HTTP/1.1 and HTTP/2 over TCP only**: their global Caddy options contain `servers { protocols h1 h2 }`, so they no longer advertise HTTP/3. UDP 443 was never reachable on either worker, and QUIC is unreliable from Iran. Cloudflare-proxied hosts on other projects still advertise HTTP/3 from Cloudflare's edge until it is turned off in each zone.

The `fanous.online` block writes a JSON access log to the Caddy container's stderr (`kubectl --context ravand -n hamafarin-apps logs deploy/caddy | grep http.log.access`); Caddy redacts cookies and authorization headers.

Check from Iran with `ssh tehran-server` (a Tehran data-centre host): `curl -4 -I --http2 https://fanous.online` and the same with `--resolve fanous.online:443:2.29.120.138`. Data-centre results do not prove reachability on Iranian mobile and home networks; confirm with testers on MCI and Irancell.

## One-time-code sign-in

Besides Google, visitors can sign in with a 6-digit code by SMS or email. Phone codes go through Ravand's in-cluster SMS relay (`http://sms.ravand.svc.cluster.local:8000`, approved Melipayamak OTP pattern); email codes go through the Azure Communication Services resource and sender Darvazeh uses. Neither service is changed. Set `OTP_SMS_URL`/`OTP_SMS_API_KEY` and `ACS_CONNECTION_STRING`/`ACS_SENDER_ADDRESS` in the private `.env` (see `auth.env.example`); each channel is enabled only when both of its values are present. Codes are single use, expire in 10 minutes, allow 5 attempts, and are rate limited per target and IP. Email sign-in reuses an existing account with that email. Administrator access still requires a Google sign-in.
