#!/usr/bin/env bash
set -euo pipefail
python3 "$(dirname "$0")/satellite-release.py" build-and-push --tag "${1:?Supply a unique image tag}"
