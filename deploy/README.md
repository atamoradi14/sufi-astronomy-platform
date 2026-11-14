# Manderia deployment

Public URL: https://manderia.daryajan.com. This follows the existing Darvazeh/Hamafarin worker pattern: context `ravand`, node `ravand-worker-01`, namespace `astronomy`, Deployment and ClusterIP Service `manderia`. The shared Caddy stays in `hamafarin-apps`; no new Ingress, host port, database or Caddy instance is required.

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

The Next server runs as UID/GID 1001, with no Kubernetes API token, no Linux capabilities, resource limits, and startup/readiness/liveness probes at `/api/health`. The app currently has no server-side user database or volume.

## DNS and shared gateway

Preview first; `--apply` is required to mutate DNS/Caddy:

```powershell
python scripts/configure-public-endpoint.py --env-file PATH/TO/OPERATOR.env
python scripts/configure-public-endpoint.py --env-file PATH/TO/OPERATOR.env --apply
```

The helper reads only `CLOUDFLARE_API_TOKEN` from the environment or that private env file. No token is copied into this project or the application. It manages only `manderia.daryajan.com`, a proxied A record to worker `2.29.120.138`, and the marked `deploy/caddy/manderia.Caddyfile` block. It requires live ConfigMap, active Caddy configuration, and the owning desired-state files in sibling `hamafarin-cluster` to agree. `--gateway-repo` can select that repository explicitly.

Before DNS/gateway mutation it saves the original Caddyfile, ConfigMap, active JSON, owning source, and DNS record under ignored `.local/gateway-backups/<UTC timestamp>/`, and copies the recovery snapshot to **`ravand-worker-01:/var/backups/manderia/caddy/<UTC timestamp>/`** with directory mode 0700 and files 0600. These snapshots can contain resolved gateway credentials: keep them private and never commit them.

The ConfigMap is mounted with `subPath`: updating it alone does not change the running Caddyfile. The helper patches the persisted ConfigMap with a resource-version test and reloads the complete validated configuration through stdin, preserving the other sites. It updates both owning gateway source files for future reconciliation. The existing Caddy image, secrets, certificates, storage, node placement and other routes remain intact.

## Verify and recover

Check HTTPS, the title/logo/favicon, both content languages and numeral formats, course/proof navigation, sphere interaction, sky search, the live-chart tabs, and API responses. Also verify the existing Hamafarin and Darvazeh hostnames after the shared reload. Live ISS calls can return a clearly marked sample when the upstream provider times out; do not report that sample as live tracking.

For an application rollback, run deploy with a previously recorded, compatible release tag. Only `astronomy/manderia` changes. The previous Deployment snapshot is retained for inspection. For gateway recovery, use the matching snapshot and restore the owning files plus the ConfigMap with a concurrent-change guard, then reload `caddy-runtime.before.json` through `kubectl --context ravand -n hamafarin-apps exec -i deployment/caddy -- caddy reload --config -` (JSON, no adapter). Do not blindly restart the shared gateway or apply an outdated full cluster manifest. Restore/remove only Manderia's DNS record according to `dns.before.json` if DNS rollback is needed.
