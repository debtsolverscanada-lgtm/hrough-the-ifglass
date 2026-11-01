"""Real-motion video of him from his photos, shot by shot, through fal.ai (Kling / Veo / Wan image-to-video).
shots.json: [{"photo": "in/face.jpg", "prompt": "he walks down King St W at night, handheld camera follows", "secs": 5}, ...]
Each shot -> out/shot_NN.mp4. Needs FAL_KEY. Model ids are settings, so a newer model is a one-word change.
usage: python3 realme/shots.py shots.json [MODEL]"""
import base64, json, mimetypes, os, sys, time, requests
shots = json.load(open(sys.argv[1]))
MODEL = sys.argv[2] if len(sys.argv) > 2 else os.environ.get('FAL_VIDEO_MODEL', 'fal-ai/kling-video/v2.1/master/image-to-video')
H = {'Authorization': f"Key {os.environ['FAL_KEY']}", 'Content-Type': 'application/json'}
STYLE = ('photorealistic, shot on iPhone, natural skin texture, real motion, same person as the photo, '
         'same face, same gold hexagon glasses and beard, no cartoon, no morphing')
def data_url(p):
    return f"data:{mimetypes.guess_type(p)[0] or 'image/jpeg'};base64," + base64.b64encode(open(p, 'rb').read()).decode()
def run(model, body):
    r = requests.post(f'https://queue.fal.run/{model}', headers=H, json=body, timeout=120); r.raise_for_status(); j = r.json()
    while True:
        s = requests.get(j['status_url'], headers=H, timeout=60).json()
        if s.get('status') == 'COMPLETED': break
        if s.get('status') in ('FAILED', 'ERROR'): sys.exit(f'fal failed: {s}')
        time.sleep(8)
    return requests.get(j['response_url'], headers=H, timeout=60).json()
os.makedirs('out', exist_ok=True)
for i, sh in enumerate(shots):
    body = {'prompt': f"{sh['prompt']}. {STYLE}", 'image_url': data_url(sh['photo']), 'duration': str(sh.get('secs', 5)),
            'negative_prompt': 'cartoon, anime, distorted face, extra fingers, blurry, different person', 'aspect_ratio': '9:16'}
    res = run(MODEL, body)
    url = (res.get('video') or {}).get('url') or res['videos'][0]['url']
    open(f'out/shot_{i:02d}.mp4', 'wb').write(requests.get(url, timeout=300).content)
    print('shot', i, 'done', flush=True)
