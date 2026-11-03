"""Voice audition: find horror/storyteller narrators in the ElevenLabs Voice Library, save their preview samples, and
read our own test lines with the account's voices on the expressive eleven_v3 model, so the owner can pick by ear.
Writes OUT/NN - name.mp3 and OUT/list.txt.   usage: ELEVENLABS_API_KEY=... python3 voice_audition.py OUT
"""
import json, os, sys, requests
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True); K = {'xi-api-key': os.environ['ELEVENLABS_API_KEY']}
LINE = ("[whispers] My doorbell camera recorded a man on my porch at three twelve in the morning. "
        "[pause] The motion log says... nobody was there.")
seen, picks = set(), []
for q in ['horror', 'creepy narrator', 'storyteller', 'dark narration', 'creepypasta', 'deep narrator']:
    r = requests.get('https://api.elevenlabs.io/v1/shared-voices', headers=K, timeout=60,
                     params={'page_size': 30, 'search': q, 'language': 'en', 'sort': 'cloned_by_count'})
    for v in r.json().get('voices', []):
        if v['voice_id'] in seen or not v.get('preview_url'): continue
        seen.add(v['voice_id']); picks.append(v)
picks.sort(key=lambda v: -(v.get('cloned_by_count') or 0))
lines = []
for n, v in enumerate(picks[:14], 1):
    name = f"{n:02d} - {v['name'][:40]} ({v.get('gender','')}, {v.get('age','')}, {v.get('accent','')})".replace('/', '-')
    open(f'{OUT}/{name}.mp3', 'wb').write(requests.get(v['preview_url'], timeout=60).content)
    lines.append(f"{name} | uses {v.get('cloned_by_count')} | {v['public_owner_id']}/{v['voice_id']} | {(v.get('description') or '')[:120]}")
mine = requests.get('https://api.elevenlabs.io/v1/voices', headers=K, timeout=60).json().get('voices', [])
for w in ['Sarah', 'Matilda', 'Brian', 'Bill', 'Callum', 'George']:
    v = next((x for x in mine if x['name'].lower().startswith(w.lower())), None)
    if not v: continue
    r = requests.post(f"https://api.elevenlabs.io/v1/text-to-speech/{v['voice_id']}", headers=K, timeout=300, params={'output_format': 'mp3_44100_128'},
                      json={'text': LINE, 'model_id': 'eleven_v3', 'voice_settings': {'stability': 0.5, 'similarity_boost': 0.8}})
    if r.status_code == 200:
        open(f'{OUT}/v3 - {w} reading our script.mp3', 'wb').write(r.content); lines.append(f'v3 - {w} reading our script | account voice {v["voice_id"]}')
    else: lines.append(f'v3 - {w}: failed {r.status_code} {r.text[:150]}')
open(f'{OUT}/list.txt', 'w').write('\n'.join(lines)); print('\n'.join(lines))
