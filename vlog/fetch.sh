#!/bin/bash
# Download public Drive folders into raw/batchN; retries, keeps going if a file still fails.
i=0; for u in "$@"; do i=$((i+1))
  for try in 1 2 3; do gdown -q --folder --continue "$u" -O "raw/batch$i" && break; echo "retry $try for folder $i"; sleep 20; done
done
find raw -type f | wc -l; du -sh raw; exit 0
