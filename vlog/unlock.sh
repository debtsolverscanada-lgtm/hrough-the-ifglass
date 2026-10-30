#!/usr/bin/env bash
# Unpack the encrypted private inputs (songs + per-vlog Drive clip lists) into the working tree.
# Needs the VLOG_KEY repository secret. Every Drive id is masked so it never shows in public logs.
set -euo pipefail
[ -n "${VLOG_KEY:-}" ] || { echo "VLOG_KEY secret is missing"; exit 1; }
openssl enc -d -aes-256-cbc -pbkdf2 -pass env:VLOG_KEY -in "$(dirname "$0")/private.tar.enc" | tar xzf -
for c in vlog/*/clips.json; do
  python3 -c "import json,sys; [print('::add-mask::' + v) for v in json.load(open(sys.argv[1])).values()]" "$c"
done
echo "private inputs unlocked"
