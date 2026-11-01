"""Make (or reuse) an ElevenLabs instant voice clone from voice memos. Each memo is cleaned with the Voice Isolator first
(strips street noise), then all of them go into one clone. Prints the voice id.
usage: python3 realme/clone.py NAME memo1 [memo2 ...]"""
import os, sys, requests
name, files = sys.argv[1], sys.argv[2:]
H = {'xi-api-key': os.environ['ELEVENLABS_API_KEY']}
API = 'https://api.elevenlabs.io/v1'
old = [v for v in requests.get(f'{API}/voices', headers=H, timeout=60).json()['voices'] if v['name'] == name]
if old and os.environ.get('RECLONE') != 'yes':
    print(old[0]['voice_id']); sys.exit()
for v in old: requests.delete(f"{API}/voices/{v['voice_id']}", headers=H, timeout=60)
clean = []
for f in files:
    with open(f, 'rb') as fh:
        r = requests.post(f'{API}/audio-isolation', headers=H, files={'audio': fh}, timeout=600)
    if r.ok:
        out = f + '.clean.mp3'; open(out, 'wb').write(r.content); clean.append(out); print('isolated', f, file=sys.stderr)
    else:
        print('isolator failed for', f, r.status_code, r.text[:200], file=sys.stderr); clean.append(f)
r = requests.post(f'{API}/voices/add', headers=H, timeout=600, data={'name': name, 'remove_background_noise': 'true', 'description': 'channel owner, from his own voice memos'},
                  files=[('files', (os.path.basename(f), open(f, 'rb'))) for f in clean])
if not r.ok: sys.exit(f'clone failed {r.status_code}: {r.text[:300]}')
print(r.json()['voice_id'])
