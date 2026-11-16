#!/usr/bin/env bash
set -euo pipefail
python3 "$(dirname "$0")/satellite-release.py" deploy --tag "${1:?Supply the built image tag}"
