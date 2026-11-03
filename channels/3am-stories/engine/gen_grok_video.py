"""Animate chosen scenes with Grok Imagine video (image-to-video from the scene's painting). For each scene with an
"anim" prompt: stories/<id>/art/NN.mp4, frames at 12 fps in art/NN/, and p.imgs/p.fps set so S.paint plays them.
usage: python3 engine/gen_grok_video.py stories/<id>     (auth: XAI_API_KEY env or the session's injected key)
"""
import base64, json, os, subprocess, sys, time, urllib.request
D = sys.argv[1]; ST = json.load(open(f'{D}/story.json'))
H = {'Content-Type': 'application/json'}
if os.environ.get('XAI_API_KEY'): H['Authorization'] = 'Bearer ' + os.environ['XAI_API_KEY']
def api(url, body=None):
    req = urllib.request.Request(url, json.dumps(body).encode() if body else None, H)
    with urllib.request.urlopen(req, timeout=120) as r: return json.load(r)
rel = os.path.relpath(D, os.path.join(os.path.dirname(__file__), '../../..'))
jobs = {}
for i, s in enumerate(ST['scenes']):
    if not s.get('anim') or os.path.exists(f'{D}/art/{i:02d}.mp4'): continue
    img = base64.b64encode(open(f'{D}/art/{i:02d}.jpg', 'rb').read()).decode()
    r = api('https://api.x.ai/v1/videos/generations', {'model': ST.get('anim_model', 'grok-imagine-video'), 'prompt': s['anim'],
            'image': {'url': 'data:image/jpeg;base64,' + img}, 'duration': s.get('anim_dur', 5), 'aspect_ratio': ST.get('art_aspect', '9:16')})
    jobs[i] = r['request_id']; print('queued', i, flush=True)
while jobs:
    time.sleep(8)
    for i, rid in list(jobs.items()):
        r = api(f'https://api.x.ai/v1/videos/{rid}')
        if r.get('status') == 'done':
            urllib.request.urlretrieve(r['video']['url'], f'{D}/art/{i:02d}.mp4'); del jobs[i]; print('animated', i, flush=True)
        elif r.get('status') not in ('pending', 'processing', None): print('failed', i, r); del jobs[i]
for i, s in enumerate(ST['scenes']):
    mp4 = f'{D}/art/{i:02d}.mp4'
    if not s.get('anim') or not os.path.exists(mp4): continue
    fd = f'{D}/art/{i:02d}'; os.makedirs(fd, exist_ok=True)
    if not os.listdir(fd):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp4, '-vf', 'fps=12,scale=' + ('1280:-2' if ST.get('art_aspect') == '16:9' else '720:-2'), '-q:v', '4', f'{fd}/f%03d.jpg'], check=True)
    s['p']['imgs'] = [f'{rel}/art/{i:02d}/{f}' for f in sorted(os.listdir(fd))]; s['p']['fps'] = 12
json.dump(ST, open(f'{D}/story.json', 'w'), indent=1, ensure_ascii=False)
