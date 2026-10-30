#!/bin/bash
# Exact-time frame grids for picking thumbnail moments.
# usage: vlog/thumb/probe.sh <out_dir> CLIP:START-END[:STEP] ...   (frames labelled with their true source time)
out=$1; shift; mkdir -p "$out"
for spec in "$@"; do
  IFS=: read clip range step <<< "$spec"; step=${step:-0.5}; s=${range%-*}; e=${range#*-}
  f=$(find raw -name "$clip" | head -1); [ -z "$f" ] && { echo "missing $clip"; continue; }
  ffmpeg -v error -y -ss "$s" -to "$e" -copyts -i "$f" -vf "fps=1/$step:round=down,scale=360:-2,drawtext=text='${clip%.*} %{pts\:flt}':x=4:y=4:fontsize=18:fontcolor=yellow:box=1:boxcolor=black@0.7,tile=6x7" -q:v 5 "$out/${clip%.*}_${s}_%02d.jpg"
  echo "probed $spec"
done
