"""Paint a story's scenes with Grok Imagine (xAI). Each scene with an "art" prompt gets stories/<id>/art/NN.jpg and
its p.img set to that file. Existing images are kept (delete one to repaint it). The story's "art_style" is put in
front of every prompt so the whole video looks like one painter made it; "art_cast" describes recurring people/places.

usage: python3 engine/gen_grok.py stories/<id> [--thumb]   (auth: XAI_API_KEY env, or the session's proxy-injected key)
"""
import base64, json, os, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
D = sys.argv[1]; ST = json.load(open(f'{D}/story.json')); os.makedirs(f'{D}/art', exist_ok=True)
H = {'Content-Type': 'application/json'}
if os.environ.get('XAI_API_KEY'): H['Authorization'] = 'Bearer ' + os.environ['XAI_API_KEY']
def paint(prompt, out, aspect):
    body = {'model': ST.get('art_model', 'grok-imagine-image-2.0'), 'n': 1, 'response_format': 'b64_json', 'aspect_ratio': aspect, 'prompt': prompt}
    req = urllib.request.Request('https://api.x.ai/v1/images/generations', json.dumps(body).encode(), H)
    with urllib.request.urlopen(req, timeout=300) as r: d = json.load(r)
    open(out, 'wb').write(base64.b64decode(d['data'][0]['b64_json'])); print('painted', out, flush=True)
style, cast = ST.get('art_style', ''), ST.get('art_cast', '')
rel = os.path.relpath(D, os.path.join(os.path.dirname(__file__), '../../..'))
todo = []
for i, s in enumerate(ST['scenes']):
    if not s.get('art'): continue
    f = f'{D}/art/{i:02d}.jpg'
    if not os.path.exists(f): todo.append((f"{style} {cast} Scene: {s['art']}", f, s.get('aspect', ST.get('art_aspect', '9:16'))))
    s.setdefault('p', {})['img'] = f'{rel}/art/{i:02d}.jpg'
def safe(a):
    for k in range(3):
        try: return paint(*a)
        except Exception as e: print('retry', a[1], e, flush=True)
with ThreadPoolExecutor(4) as ex: list(ex.map(safe, todo))
if '--thumb' in sys.argv and ST.get('thumb_art'):
    f = f'{D}/art/thumb.jpg'
    if not os.path.exists(f): paint(f"{style} {ST['thumb_art']}", f, '16:9')
json.dump(ST, open(f'{D}/story.json', 'w'), indent=1, ensure_ascii=False)
