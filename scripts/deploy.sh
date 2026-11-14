#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
ACTION="${1:-apply}"
if [[ $# -gt 0 ]]; then shift; fi
case "$ACTION" in
  apply) exec python3 "$ROOT/scripts/release.py" deploy "$@" ;;
  status) exec python3 "$ROOT/scripts/release.py" status "$@" ;;
  *) echo 'Usage: deploy.sh apply --tag RELEASE [--dry-run] | status' >&2; exit 2 ;;
esac
