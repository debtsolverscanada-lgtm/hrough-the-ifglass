"""Voice an episode with ElevenLabs when it has no recording yet.

Reads the script named in meta.json ("script"), sends it to ElevenLabs in a few chunks (split on the
<break> lines, stitched with request ids so the voice flows across chunks) and writes the MP3 named in
meta.json ("voice"). Does nothing if that MP3 already exists, so hand-recorded episodes are never touched.

needs: ELEVENLABS_API_KEY, and the voice id or name in ELEVENLABS_VOICE_ID (or "voice_id" in meta.json)
usage: python3 pipeline/tts.py episodes/022-...   or   python3 pipeline/tts.py SCRIPT.txt OUT.mp3
"""
import json, os, re, subprocess, sys, tempfile
import requests

if sys.argv[1].endswith('.txt'):  # tts.py SCRIPT.txt OUT.mp3: voice a script that is not an episode yet
    SCRIPT, OUT, META = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2]), {}
else:
    EP = os.path.abspath(sys.argv[1])
    META = json.load(open(f'{EP}/meta.json'))
    SCRIPT, OUT = f'{EP}/{META["script"]}', f'{EP}/{META["voice"]}'
if os.path.exists(OUT):
    print('already voiced:', OUT); sys.exit(0)
KEY = os.environ.get('ELEVENLABS_API_KEY')
VOICE = META.get('voice_id') or os.environ.get('ELEVENLABS_VOICE_ID')
if not KEY or not VOICE:
    sys.exit('no recording and no ElevenLabs key/voice id: add the ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID secrets')
TTS = META.get('tts', {})  # optional per-episode overrides: model, stability, similarity, style, speed
MODEL = TTS.get('model', os.environ.get('ELEVENLABS_MODEL') or 'eleven_multilingual_v2')
SETTINGS = {'stability': TTS.get('stability', 0.5), 'similarity_boost': TTS.get('similarity', 0.75),
            'style': TTS.get('style', 0.0), 'use_speaker_boost': True, 'speed': TTS.get('speed', 1.0)}
LIMIT = 4000  # characters per request, well inside the model's limit

if not re.fullmatch(r'[A-Za-z0-9]{20}', VOICE):  # a voice name ("Adam") instead of an id: look it up
    vs = requests.get('https://api.elevenlabs.io/v1/voices', headers={'xi-api-key': KEY}, timeout=60).json().get('voices', [])
    hit = [v for v in vs if v['name'].strip().lower() == VOICE.strip().lower()] or \
          [v for v in vs if v['name'].strip().lower().startswith(VOICE.strip().lower())]
    if not hit: sys.exit(f'no voice called {VOICE!r}; your voices: ' + ', '.join(v['name'] for v in vs))
    print(f'voice {VOICE!r} -> {hit[0]["name"]} ({hit[0]["voice_id"]})'); VOICE = hit[0]['voice_id']

text = open(SCRIPT).read().strip()
paras, chunks, cur = re.split(r'\n\s*\n', text), [], ''
for p in paras:  # keep whole paragraphs together; start a new chunk at a break line once it is long enough
    if cur and (len(cur) + len(p) > LIMIT or (len(cur) > LIMIT / 2 and p.strip().startswith('<break'))):
        chunks.append(cur.strip()); cur = ''
    cur += p + '\n\n'
if cur.strip(): chunks.append(cur.strip())

parts, prev_ids = [], []
tmp = tempfile.mkdtemp()
for i, chunk in enumerate(chunks):
    body = {'text': chunk, 'model_id': MODEL, 'voice_settings': SETTINGS, 'previous_request_ids': prev_ids[-3:]}
    r = requests.post(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}', params={'output_format': 'mp3_44100_128'},
                      headers={'xi-api-key': KEY, 'Content-Type': 'application/json'}, json=body, timeout=600)
    if r.status_code != 200: sys.exit(f'ElevenLabs error {r.status_code}: {r.text[:500]}')
    prev_ids.append(r.headers.get('request-id', ''))
    f = f'{tmp}/part{i:02d}.mp3'; open(f, 'wb').write(r.content); parts.append(f)
    print(f'chunk {i + 1}/{len(chunks)}: {len(chunk)} characters', flush=True)

lst = f'{tmp}/list.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', OUT], check=True)
print('voiced', OUT, f'{sum(len(c) for c in chunks)} characters')
