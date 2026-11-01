"""Put his cloned-voice line onto a generated shot so his mouth matches the words (fal.ai lip-sync).
usage: python3 realme/lipsync.py SHOT.mp4 LINE.mp3 OUT.mp4 [MODEL]"""
import base64, os, sys, time, requests
v, a, out = sys.argv[1:4]
MODEL = sys.argv[4] if len(sys.argv) > 4 else os.environ.get('FAL_LIPSYNC_MODEL', 'fal-ai/sync-lipsync')
H = {'Authorization': f"Key {os.environ['FAL_KEY']}", 'Content-Type': 'application/json'}
up = lambda p, mt: f'data:{mt};base64,' + base64.b64encode(open(p, 'rb').read()).decode()
r = requests.post(f'https://queue.fal.run/{MODEL}', headers=H, json={'video_url': up(v, 'video/mp4'), 'audio_url': up(a, 'audio/mpeg')}, timeout=300)
r.raise_for_status(); j = r.json()
while (s := requests.get(j['status_url'], headers=H, timeout=60).json()).get('status') != 'COMPLETED':
    if s.get('status') in ('FAILED', 'ERROR'): sys.exit(f'lipsync failed: {s}')
    time.sleep(8)
res = requests.get(j['response_url'], headers=H, timeout=60).json()
open(out, 'wb').write(requests.get(res['video']['url'], timeout=300).content); print('lipsynced', out)
