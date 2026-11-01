"""Speak TEXT with an ElevenLabs voice (name or id) -> OUT.wav (16 kHz mono, what the face model wants)
plus OUT.words.json ([[word, start, end], ...]) for the camera moves and captions.
usage: python3 realme/tts.py "text" VOICE OUT.wav"""
import base64, json, os, subprocess, sys, requests
text, want, out = sys.argv[1:4]
H = {'xi-api-key': os.environ['ELEVENLABS_API_KEY']}
vid = want
if len(want) < 20:  # a name, not an id
    vs = requests.get('https://api.elevenlabs.io/v1/voices', headers=H, timeout=60).json()['voices']
    hit = [v for v in vs if v['name'].lower().startswith(want.lower())] or vs
    vid = hit[0]['voice_id']; print('voice:', hit[0]['name'])
r = requests.post(f'https://api.elevenlabs.io/v1/text-to-speech/{vid}/with-timestamps', headers=H, timeout=300,
                  json={'text': text, 'model_id': 'eleven_multilingual_v2', 'voice_settings': {'stability': 0.45, 'similarity_boost': 0.85, 'style': 0.2}})
r.raise_for_status(); j = r.json()
open('tts.mp3', 'wb').write(base64.b64decode(j['audio_base64']))
al = j['alignment']; words, cur, st = [], '', None
for ch, s, e in zip(al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']):
    if ch.isspace():
        if cur: words.append([cur, st, last]); cur = ''
        continue
    if not cur: st = s
    cur += ch; last = e
if cur: words.append([cur, st, last])
json.dump(words, open(out.rsplit('.', 1)[0] + '.words.json', 'w'))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'tts.mp3', '-ar', '16000', '-ac', '1', out], check=True)
print(len(words), 'words')
