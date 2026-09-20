#!/bin/sh
set -e
DATA_DIR="${DATA_DIR:-/data}"
mkdir -p "$DATA_DIR"
# Railway volumes mount as root and overwrite the image's /data ownership.
# Fix perms at boot (we start as root), then drop to nextjs.
chown -R nextjs:nodejs "$DATA_DIR" 2>/dev/null || chmod -R 777 "$DATA_DIR"
exec su-exec nextjs node server.js
