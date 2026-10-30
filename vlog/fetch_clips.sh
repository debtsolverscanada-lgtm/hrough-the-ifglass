#!/usr/bin/env bash
# Download NAME|URL pairs into raw/. Zapier-hydrated links fail on very large files (they return a
# tiny error body), so anything under 1 MB is re-fetched by Drive file id with gdown (vlog/<id>/clips.json).
# usage: vlog/fetch_clips.sh vlog/vlog01 "$URLS"
set -u
D=$1; shift; mkdir -p raw
for p in $*; do
  n="${p%%|*}"; u="${p#*|}"
  (cd raw && curl -sSL --retry 5 --retry-all-errors -o "$n" "$u")
  if [ "$(stat -c %s "raw/$n" 2>/dev/null || echo 0)" -lt 1000000 ]; then
    echo "hydrate link failed for $n: $(head -c 200 "raw/$n" 2>/dev/null)"; rm -f "raw/$n"
    id=$(python3 -c "import json,sys; print(json.load(open('$D/clips.json')).get('$n',''))")
    for t in 1 2 3; do [ -n "$id" ] && (cd raw && gdown -q -O "$n" "$id") && break; sleep 20; done
    [ -s "raw/$n" ] || echo "FAILED $n"
  fi
done
ls -la raw; df -h /
