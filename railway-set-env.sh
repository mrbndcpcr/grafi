#!/usr/bin/env bash
# Sets Railway env from box-secrets.json without printing the password.
set -euo pipefail
SECRETS="${SECRETS_FILE:-/home/box/agent-data/box-secrets.json}"
if [[ ! -f "$SECRETS" ]]; then
  echo "Missing secrets file" >&2
  exit 1
fi
PW=$(python3 -c "import json,sys; print(json.load(open(sys.argv[1]))['card']['GRAFI_STUDIO_PASSWORD'])" "$SECRETS")
railway variables set \
  "GRAFI_STUDIO_PASSWORD=${PW}" \
  "DATA_DIR=/data" \
  "NODE_ENV=production"
unset PW
echo "Railway variables set (GRAFI_STUDIO_PASSWORD, DATA_DIR, NODE_ENV)."
