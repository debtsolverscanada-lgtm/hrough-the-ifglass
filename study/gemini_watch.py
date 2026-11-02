"""Have Gemini watch YouTube videos (Google's own YouTube-link support) and write a detailed timeline for private study.

usage: GEMINI_API_KEY=... python3 study/gemini_watch.py OUT_DIR MODE ID [ID ...]
MODE: style (shot-by-shot picture/sound/pacing study) or talk (full transcript + teachings)
"""
import json, os, sys, time, urllib.request, urllib.error

out, mode, ids = sys.argv[1], sys.argv[2], sys.argv[3:]
os.makedirs(out, exist_ok=True)
KEY = os.environ['GEMINI_API_KEY']
API = 'https://generativelanguage.googleapis.com/v1beta'

def call(url, body=None):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body else None,
                                 headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY})
    with urllib.request.urlopen(req, timeout=900) as r: return json.load(r)

# best available model: newest "pro", else newest "flash", that supports generateContent
names = [m['name'] for m in call(f'{API}/models?pageSize=200')['models'] if 'generateContent' in m.get('supportedGenerationMethods', [])]
def rank(n):
    import re
    v = re.search(r'gemini-(\d+(?:\.\d+)?)', n); v = float(v.group(1)) if v else 0
    bad = any(x in n for x in ('lite', 'tts', 'image', 'live', 'embedding', 'audio', 'computer', 'robotics', 'exp', 'preview-tts'))
    return (not bad, 'pro' in n, v, 'preview' not in n)
models = sorted([n for n in names if 'gemini' in n], key=rank, reverse=True)
# free keys get 0 quota on Pro: keep the best Pro first, then the best Flash models
models = [m for m in models if 'pro' in m][:2] + [m for m in models if 'flash' in m and 'lite' not in m][:3]
dead = set()
print('models:', models[:4])

STYLE = """You are a video editor reverse-engineering why this horror/story video holds viewers. Watch the whole thing (picture AND sound) and answer in English with exact timestamps (m:ss.s). Be concrete and numeric, no vague adjectives.

1. HOOK (first 5 s): every word spoken with timestamps; every shot (what is on screen, framing, camera move, on-screen text); any sound effect / music hit. Why does it stop the scroll?
2. FULL TIMELINE: a row for EVERY shot change: start time, shot length (s), what is shown, framing (wide/medium/close/extreme close), camera move (static/push-in/pull-out/pan/whip/shake/zoom punch) and speed, transition type (hard cut/flash/whip/dissolve/match), on-screen text/captions (style, position, how many words at a time), what the narrator says during it.
3. SOUND: narrator voice (gender, age, pace in words/s, tone, pauses), music (genre, when it starts/stops/drops, silence before scares), every sound effect with timestamp, jump-scare audio.
4. ART STYLE: drawing style, colour palette (hex guesses), lighting, how characters and faces are drawn, how the scary thing is shown (hidden/glimpsed/full reveal and when).
5. STORY STRUCTURE: beat list with timestamps (hook, setup, escalation beats, twist, ending). How long until the first scare? How does it end (last line, last image, loop back to start?).
6. RETENTION TRICKS: list every technique used to stop viewers swiping, with timestamp.
7. NUMBERS: total shots, average shot length, longest shot, cuts per 10 s in first 10 s vs rest, words per second, % of time with music, % with captions.
8. TEN RULES a creator should copy to make videos like this (concrete, measurable)."""
TALK = """Watch this whole video. 1) Give a COMPLETE transcript with timestamps every ~20 s (verbatim, no summarising). 2) Then list every concrete technique, rule, formula, template and example the speaker teaches, in order, with timestamps, each explained fully enough to apply without watching. 3) Then describe any on-screen examples, prompts or text they show. 4) Finally, write how to apply each technique to a faceless animated scary-story channel (Shorts + 8-15 min long-form)."""

for vid in ids:
    body = {'contents': [{'parts': [
        {'file_data': {'file_uri': f'https://www.youtube.com/watch?v={vid}'}, **({'video_metadata': {'fps': 4}} if mode == 'style' else {})},
        {'text': STYLE if mode == 'style' else TALK}]}],
        'generationConfig': {'temperature': 0.2, 'maxOutputTokens': 32768,
                             **({'mediaResolution': 'MEDIA_RESOLUTION_LOW'} if mode == 'talk' else {})}}
    done = False
    for m in models:
        if m in dead: continue
        for attempt in range(3):
            try:
                r = call(f'{API}/{m}:generateContent', body)
                txt = ''.join(p.get('text', '') for c in r.get('candidates', []) for p in c.get('content', {}).get('parts', []))
                if not txt: raise RuntimeError(json.dumps(r)[:500])
                open(f'{out}/{vid}.md', 'w').write(f'# {vid} ({m}, {mode})\n\n{txt}\n')
                print(f'OK {vid} via {m}: {len(txt)} chars'); done = True; time.sleep(20); break
            except urllib.error.HTTPError as e:
                msg = e.read().decode()[:400]; print(f'{vid} {m} HTTP {e.code}: {msg}')
                if e.code == 429 and 'limit: 0' in msg: dead.add(m); break
                if e.code == 404: dead.add(m); break
                if e.code in (429, 500, 503): time.sleep(60 * (attempt + 1)); continue
                break
            except Exception as e:
                print(f'{vid} {m} error: {str(e)[:400]}'); time.sleep(10)
        if done: break
    if not done: print(f'FAILED {vid}')
