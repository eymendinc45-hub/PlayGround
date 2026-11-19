#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

PORT="${PORT:-3000}"
case "$PORT" in
  ''|*[!0-9]*) echo "PORT must be a positive integer: $PORT" >&2; exit 1 ;;
esac

/usr/bin/time -p npm install
/usr/bin/time -p npm run build

DIST_DIR="$PROJECT_DIR/dist"
if [[ ! -f "$DIST_DIR/index.html" ]]; then
  echo "Build did not create $DIST_DIR/index.html" >&2
  exit 1
fi

mkdir_parent="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
/usr/bin/time -p mkdir -p "$mkdir_parent"
METADATA="$mkdir_parent/deployment-output.json"
printf '{"project":"%s","directory":"%s"}\n' "$PROJECT_DIR" "$DIST_DIR" > "$METADATA"

exec /usr/bin/time -p node "$PROJECT_DIR/node_modules/vite/bin/vite.js" preview --host 0.0.0.0 --port "$PORT" --strictPort
