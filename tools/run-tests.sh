#!/usr/bin/env bash
# Ejecuta las tres páginas de pruebas en Chrome/Chromium sin interfaz.
# Uso: tools/run-tests.sh   (requiere python3 y Google Chrome o Chromium)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8765}"
CHROME="${CHROME:-}"
if [[ -z "$CHROME" ]]; then
  for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" google-chrome chromium chromium-browser; do
    if command -v "$c" >/dev/null 2>&1 || [[ -x "$c" ]]; then CHROME="$c"; break; fi
  done
fi
[[ -n "$CHROME" ]] || { echo "No se encontró Chrome/Chromium (define CHROME=...)"; exit 2; }

PROFILE="$(mktemp -d)"
python3 "$ROOT/tools/serve.py" "$PORT" --quiet >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null; rm -rf "$PROFILE"' EXIT
sleep 1

status=0
for page in index.html interaction.html responsive.html; do
  dom="$("$CHROME" --headless=new --disable-gpu --no-first-run --user-data-dir="$PROFILE" \
    --virtual-time-budget=90000 --window-size=1300,900 --dump-dom "http://127.0.0.1:$PORT/tests/$page" 2>/dev/null)"
  result="$(grep -o 'data-status="[a-z]*"' <<<"$dom" | head -1 | cut -d'"' -f2)"
  printf '%-18s %s\n' "$page" "${result:-sin resultado}"
  grep -o 'class="fail">[^<]*' <<<"$dom" | sed 's/class="fail">/   /' || true
  if [[ "$result" != "pass" ]]; then grep -o 'id="summary">[^<]*' <<<"$dom" | sed 's/id="summary">/   /' || true; fi
  [[ "$result" == "pass" ]] || status=1
done
if [[ "${SKIP_PYTHON:-0}" != "1" ]]; then
  # Ejecuta los ejemplos de Python en el navegador (Pyodide; requiere internet).
  python3 "$ROOT/tools/run-python-tests.py" "http://127.0.0.1:$PORT" "$CHROME" || status=1
fi
exit $status
