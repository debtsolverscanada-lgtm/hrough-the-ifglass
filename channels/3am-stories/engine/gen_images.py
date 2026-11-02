"""Generate story art with Gemini image models (painted, realistic horror-illustration look).

usage: GEMINI_API_KEY=... python3 gen_images.py prompts.json OUT_DIR
prompts.json: [{"id": "01-malloy", "prompt": "...", "aspect": "9:16"}, ...]
"""
import base64, json, os, sys, time, urllib.request, urllib.error
P, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
KEY = os.environ['GEMINI_API_KEY']; API = 'https://generativelanguage.googleapis.com/v1beta'
def call(url, body=None):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body else None,
                                 headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY})
    with urllib.request.urlopen(req, timeout=300) as r: return json.load(r)
ms = call(f'{API}/models?pageSize=200')['models']
img = [m['name'] for m in ms if 'image' in m['name'] and 'generateContent' in m.get('supportedGenerationMethods', [])]
imagen = [m['name'] for m in ms if 'imagen' in m['name'] and 'predict' in m.get('supportedGenerationMethods', [])]
print('image models:', img, imagen, flush=True)
STYLE = ('Painted semi-realistic digital illustration, detailed graphic-novel inking, rich textures, cinematic lighting, '
         'muted gritty palette, vertical 9:16 composition, no text, no watermark. ')
for it in json.load(open(P)):
    ok = False
    for m in img:
        try:
            r = call(f'{API}/{m}:generateContent', {'contents': [{'parts': [{'text': STYLE + it['prompt']}]}],
                     'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': it.get('aspect', '9:16')}}})
            for c in r.get('candidates', []):
                for p in c.get('content', {}).get('parts', []):
                    if 'inlineData' in p:
                        open(f"{OUT}/{it['id']}.png", 'wb').write(base64.b64decode(p['inlineData']['data'])); ok = True
            if ok: print('OK', it['id'], m, flush=True); break
            print(it['id'], m, 'no image', json.dumps(r)[:300], flush=True)
        except urllib.error.HTTPError as e:
            print(it['id'], m, 'HTTP', e.code, e.read().decode()[:300], flush=True)
    if not ok:
        for m in imagen:
            try:
                r = call(f'{API}/{m}:predict', {'instances': [{'prompt': STYLE + it['prompt']}], 'parameters': {'sampleCount': 1, 'aspectRatio': it.get('aspect', '9:16')}})
                b = r['predictions'][0]['bytesBase64Encoded']; open(f"{OUT}/{it['id']}.png", 'wb').write(base64.b64decode(b)); ok = True
                print('OK', it['id'], m, flush=True); break
            except urllib.error.HTTPError as e:
                print(it['id'], m, 'HTTP', e.code, e.read().decode()[:300], flush=True)
    if not ok: print('FAILED', it['id'], flush=True)
    time.sleep(8)
