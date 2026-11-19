#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

: "${CAPTURE_URL:?Set CAPTURE_URL to the preview URL}" 
: "${CAPTURE_DIR:?Set CAPTURE_DIR to the capture output directory}"

/usr/bin/time -p mkdir -p "$CAPTURE_DIR"

RUNTIME_DIR="${RUNTIME_DIR:-/home/runner/work/_temp/omgithub-runtime}"
export RUNTIME_DIR
export CAPTURE_START_SELECTOR="${CAPTURE_START_SELECTOR:-#startBtn}"
exec /usr/bin/time -p node "$RUNTIME_DIR/scripts/default-capture.mjs"
