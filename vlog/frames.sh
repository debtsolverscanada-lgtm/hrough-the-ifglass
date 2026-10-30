#!/bin/bash
# Quick contact sheets for picking frames: one tile every 2 s per clip, labelled clip+time.
# usage: vlog/frames.sh <raw_dir> <out_dir>
set -e; mkdir -p "$2"
find "$1" -iname '*.mp4' -o -iname '*.mov' | sort | while read f; do
  n=$(basename "${f%.*}")
  ffmpeg -v error -y -skip_frame nokey -i "$f" -vf "fps=1/2,scale=320:-2,drawtext=text='$n %{pts\:hms}':x=4:y=4:fontsize=15:fontcolor=white:box=1:boxcolor=black@0.6,tile=6x5" -q:v 6 "$2/${n}_%02d.jpg" < /dev/null
  echo "$n $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")"
done
