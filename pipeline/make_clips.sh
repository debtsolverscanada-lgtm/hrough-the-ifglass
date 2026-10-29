#!/bin/bash
# renders the 9 vertical clips (4 at a time) and muxes audio
set -e
B=$(cd "$(dirname "$0")" && pwd); V1=$B/../studio/v1; OUT=$B/../preview/001/clips; mkdir -p $OUT
python3 - <<'P'
import json,os
B=os.environ.get('B') or '.'
P
for c in $(python3 -c "import json;[print(f\"{x['n']}:{x['s']}:{x['e']}\") for x in json.load(open('$B/clips.json'))]"); do
  IFS=: read n s e <<< "$c"
  python3 -c "
import json;tl=json.load(open('$V1/timeline.json'));c=[x for x in json.load(open('$B/clips.json')) if x['n']==$n][0]
tl['hook']=c['hook'];tl['hook2']=c['hook2'];json.dump(tl,open('$B/tl_clip$n.json','w'))"
  nf=$(python3 -c "print(int(($e-$s)*30))")
  ( cd $V1 && TLFILE=$B/tl_clip$n.json TOFF=$s node render.js $B/clip$n 0 $nf vert && \
    ffmpeg -loglevel error -y -framerate 30 -i $B/clip$n/f%06d.jpg -ss $s -t $(python3 -c "print($e-$s)") -i $B/mix.wav \
      -vf "noise=alls=5:allf=t" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart \
      $OUT/clip-0$n.mp4 && rm -rf $B/clip$n ) &
  if (( n % 4 == 0 )); then wait; fi
done; wait; ls -la $OUT
