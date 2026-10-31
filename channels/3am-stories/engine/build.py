"""Build a 3 AM Stories video from stories/<id>/story.json.

Each scene's line is voiced separately with ElevenLabs (with word timings), so every scene lasts exactly as long
as its line plus a pause. Then: sound design, frames (render.js, several Chromium workers), mix, captions for
Shorts, thumbnail. Voice files are cached in stories/<id>/voice/ so a re-render costs no credits.

usage: python3 engine/build.py stories/001-bathroom [--workers 4] [--seconds 10]
needs: ELEVENLABS_API_KEY (only for lines not voiced yet), ffmpeg, node + playwright
outputs: stories/<id>/out/video.mp4, thumb.jpg
"""
import argparse, base64, hashlib, json, os, subprocess, sys
import requests

HERE = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser(); ap.add_argument('story'); ap.add_argument('--workers', type=int, default=os.cpu_count() or 2)
ap.add_argument('--seconds', type=float); a = ap.parse_args()
D = os.path.abspath(a.story); ST = json.load(open(f'{D}/story.json'))
SHORT = ST['format'] == 'short'
VO, OUT, WK = f'{D}/voice', f'{D}/out', f'{D}/work'
for x in (VO, OUT, WK): os.makedirs(x, exist_ok=True)
run = lambda *c: subprocess.run([str(x) for x in c], check=True)
dur_of = lambda f: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)

# ---------- voice ----------
KEY = os.environ.get('ELEVENLABS_API_KEY')
TTS = ST.get('tts', {})
SETTINGS = {'stability': TTS.get('stability', 0.5), 'similarity_boost': TTS.get('similarity', 0.8), 'style': TTS.get('style', 0.2),
            'use_speaker_boost': True, 'speed': TTS.get('speed', 1.0)}
# Characters can speak in their own voice: a scene's "voice" is a list of ElevenLabs voice names to try in order.
NARRATOR = [ST.get('voice', 'Brian'), 'Brian', 'Bill', 'Callum', 'George', 'Daniel', 'Adam']
_vs, _ids = None, {}
def voice_id(want):
    global _vs
    want = tuple(want)
    if want in _ids: return _ids[want]
    if _vs is None: _vs = requests.get('https://api.elevenlabs.io/v1/voices', headers={'xi-api-key': KEY}, timeout=60).json().get('voices', [])
    for w in want:
        hit = [v for v in _vs if v['name'].lower().startswith(w.lower())]
        if hit: _ids[want] = hit[0]['voice_id']; print('voice:', hit[0]['name'], 'for', want[0], flush=True); return _ids[want]
    sys.exit('none of these voices exist on the account: ' + ', '.join(want) + ' | have: ' + ', '.join(v['name'] for v in _vs))

lines = [s.get('text') for s in ST['scenes']]
def voice_line(i, text, who=None):
    """-> (mp3 path, [(word, start, end)]) for scene i, voicing it only if the cached take is missing or stale."""
    who = who or NARRATOR
    h = hashlib.sha1(json.dumps([text, who if who != NARRATOR else ST.get('voice'), SETTINGS]).encode()).hexdigest()[:10]
    mp3, js = f'{VO}/{i:02d}-{h}.mp3', f'{VO}/{i:02d}-{h}.json'
    if os.environ.get('FAKE_TTS'):  # layout previews without spending credits: silence, 0.33 s per word
        mp3, js = f'{WK}/fake{i:02d}.mp3', f'{WK}/fake{i:02d}.json'
        n = len(text.split()); run('ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'anullsrc=r=44100:cl=mono', '-t', n * 0.33, mp3)
        chars, st, en, tt = [], [], [], 0.0
        for w in text.split():
            for c in w + ' ': chars.append(c); st.append(tt); en.append(tt + 0.3)
            tt += 0.33
        json.dump({'characters': chars, 'character_start_times_seconds': st, 'character_end_times_seconds': en}, open(js, 'w'))
    elif not os.path.exists(mp3):
        if not KEY: sys.exit('ELEVENLABS_API_KEY needed to voice: ' + text)
        prev = ' '.join(t for t in lines[max(0, i - 2):i] if t); nxt = next((t for t in lines[i + 1:] if t), '')
        r = requests.post(f'https://api.elevenlabs.io/v1/text-to-speech/{voice_id(who)}/with-timestamps', params={'output_format': 'mp3_44100_128'},
                          headers={'xi-api-key': KEY}, timeout=300,
                          json={'text': text, 'model_id': TTS.get('model', 'eleven_multilingual_v2'), 'voice_settings': SETTINGS,
                                'previous_text': prev, 'next_text': nxt})
        if r.status_code != 200: sys.exit(f'ElevenLabs {r.status_code}: {r.text[:400]}')
        j = r.json(); open(mp3, 'wb').write(base64.b64decode(j['audio_base64']))
        json.dump(j.get('alignment') or j.get('normalized_alignment'), open(js, 'w'))
        print(f'voiced scene {i}: {text[:50]}', flush=True)
    al = json.load(open(js)); words, cur, st = [], '', None
    for ch, s0, e0 in zip(al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']):
        if ch.isspace():
            if cur: words.append((cur, st, last)); cur = ''
        else:
            if not cur: st = s0
            cur += ch; last = e0
    if cur: words.append((cur, st, last))
    return mp3, words

# ---------- timeline ----------
tl, voices, caps, t = [], [], [], 0.0
for i, s in enumerate(ST['scenes']):
    if s.get('text'):
        mp3, words = voice_line(i, s['text'], s.get('voice'))
        lead = 0.25
        dur = lead + dur_of(mp3) + s.get('pause', 0.45)
        voices.append((mp3, t + lead, s.get('fx')))
        if s['scene'] in ('text', 'black'): words = []  # the words are already on screen
        caps += [(w, t + lead + a0, t + lead + b0) for w, a0, b0 in words]
    else:
        dur = s.get('dur', 2.5)
    tl.append({'scene': s['scene'], 'p': {**s.get('p', {}), **({'style': ST['style']} if ST.get('style') else {})}, 'start': round(t, 3), 'dur': round(dur, 3), 'sfx': s.get('sfx', []),
               'fade': 0.0 if i == 0 else 0.25})
    t += dur
TOTAL = min(t, a.seconds or 1e9)
tl = [x for x in tl if x['start'] < TOTAL]
json.dump(tl, open(f'{WK}/timeline.json', 'w'))
print(f'{len(tl)} scenes, {TOTAL:.1f}s', flush=True)

# ---------- sound design (all synthesised) ----------
SFX = {  # kind: (lavfi graph, seconds, gain)
    'tick': ("aevalsrc='0.5*sin(2*PI*2600*t)*exp(-90*mod(t\\,1))':d=4", 4, 0.5),
    'breath': ("anoisesrc=d=4:c=pink:a=0.5,bandpass=f=700:w=500,tremolo=f=0.35:d=0.9", 4, 0.35),
    'whisper': ("anoisesrc=d=2.5:c=white:a=0.4,bandpass=f=2600:w=1800,tremolo=f=7:d=0.8,afade=t=in:d=0.4,afade=t=out:st=1.8:d=0.7", 2.5, 0.35),
    'voice_far': ("anoisesrc=d=2:c=pink:a=0.5,bandpass=f=900:w=500,tremolo=f=5:d=0.7,lowpass=f=1500,afade=t=in:d=0.3,afade=t=out:st=1.4:d=0.6", 2, 0.4),
    'steps': ("aevalsrc='0.9*sin(2*PI*70*t)*exp(-22*mod(t\\,0.62))':d=3.1,lowpass=f=400", 3.1, 0.6),
    'buzz': ("aevalsrc='0.06*sin(2*PI*100*t)+0.04*sin(2*PI*200*t)+0.02*sin(2*PI*300*t)':d=8,tremolo=f=11:d=0.6", 8, 0.6),
    'creak': ("aevalsrc='0.3*sin(2*PI*(170+70*sin(2*PI*0.8*t))*t)*sin(PI*t/2.2)':d=2.2,bandpass=f=600:w=900,vibrato=f=14:d=0.6", 2.2, 0.6),
    'water': ("anoisesrc=d=2.4:c=pink:a=0.6,highpass=f=700,lowpass=f=6000,afade=t=in:d=0.2,afade=t=out:st=1.6:d=0.8", 2.4, 0.35),
    'heart': ("aevalsrc='0.9*sin(2*PI*52*t)*(exp(-28*mod(t\\,1.05))+0.7*exp(-28*mod(t-0.24\\,1.05))*gte(mod(t\\,1.05)\\,0.24))':d=4.2,lowpass=f=180", 4.2, 0.9),
    'drone': ("aevalsrc='0.22*sin(2*PI*55*t)+0.22*sin(2*PI*58.3*t)+0.09*sin(2*PI*110.7*t)+0.05*sin(2*PI*233*t)':d=7,afade=t=in:d=2.5,afade=t=out:st=5:d=2", 7, 0.8),
    'sting': ("aevalsrc='(0.4*sin(2*PI*1480*t)+0.4*sin(2*PI*1571*t)+0.3*sin(2*PI*2217*t)+0.4*sin(2*PI*97*t))*exp(-2.2*t)':d=2.4", 2.4, 1.1),
    'boom': ("aevalsrc='0.9*sin(2*PI*(62-26*t)*t)*exp(-2.6*t)':d=2.5,lowpass=f=300", 2.5, 1.2),
    'knock': ("aevalsrc='0.9*sin(2*PI*170*t)*exp(-45*mod(t\\,0.3))*lt(t\\,0.88)':d=1.2,lowpass=f=900", 1.2, 1.0),
    'buzzphone': ("aevalsrc='0.35*sin(2*PI*165*t)*lt(mod(t\\,0.55)\\,0.38)':d=1.1", 1.1, 0.7),
    'fridge': ("aevalsrc='0.05*sin(2*PI*60*t)+0.03*sin(2*PI*120*t)':d=9", 9, 0.7),
    'snore': ("anoisesrc=d=4:c=brown:a=0.6,bandpass=f=220:w=160,tremolo=f=0.3:d=0.95", 4, 0.45),
    'jump': ("aevalsrc='(0.5*sin(2*PI*1480*t)+0.5*sin(2*PI*1571*t)+0.4*sin(2*PI*2217*t)+0.6*sin(2*PI*(80-40*t)*t))*exp(-1.6*t)+0.5*(random(0)-0.5)*exp(-6*t)':d=2.2", 2.2, 1.6),
    'static': ("anoisesrc=d=1.2:c=white:a=0.5,highpass=f=1500,tremolo=f=22:d=0.9,afade=t=out:st=0.8:d=0.4", 1.2, 0.5),
    'silence_hit': ("aevalsrc='0.8*sin(2*PI*45*t)*exp(-1.2*t)':d=3,lowpass=f=120", 3, 1.3),
}
ins, parts = [], []
FX = {'far': 'highpass=f=250,lowpass=f=2600,aecho=0.8:0.7:120|260:0.35|0.22,volume=0.9',     # a voice from another room
      'whisper': 'highpass=f=400,aecho=0.8:0.6:90:0.3,volume=1.2',
      'wrong': 'asetrate=48000*0.88,aresample=48000,aecho=0.8:0.6:70|150:0.4|0.3,volume=1.1'}   # something pretending to be human
for k, (mp3, at, fx) in enumerate(voices):
    if at < TOTAL: ins += ['-i', mp3]; parts.append(f'[{len(ins) // 2 - 1}:a]aresample=48000,aformat=channel_layouts=stereo,{FX[fx] + "," if fx in FX else ""}adelay={int(at * 1000)}:all=1[v{k}]')
nv = len(parts)
for k, (kind, at) in enumerate((x, s['start'] + off) for s in tl for x, off in s['sfx']):
    if at >= TOTAL or kind not in SFX: continue
    f = f'{WK}/sfx-{kind}.wav'
    if not os.path.exists(f): run('ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', SFX[kind][0], '-ar', '48000', '-ac', '2', f)
    ins += ['-i', f]; parts.append(f'[{len(ins) // 2 - 1}:a]volume={SFX[kind][2]},adelay={int(at * 1000)}:all=1[s{k}]')
amb = f"anoisesrc=d={TOTAL + 1}:c=brown:a=0.4,lowpass=f=180,volume=0.12[amb]"
labels = ''.join(p[p.rindex('['):] for p in parts)
graph = ';'.join(parts + [amb]) + f";{labels}[amb]amix=inputs={len(parts) + 1}:normalize=0,alimiter=limit=0.95,loudnorm=I=-15:TP=-1.5[mix]"
run('ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', graph, '-map', '[mix]', '-t', f'{TOTAL:.3f}', '-ar', '48000', f'{WK}/mix.wav')

# ---------- captions (Shorts): two-three words at a time, current word red ----------
ass = f'{WK}/caps.ass'
def ts(x): return f'{int(x // 3600)}:{int(x % 3600 // 60):02d}:{x % 60:05.2f}'
head = ('[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\n\n[V4+ Styles]\n'
        'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n'
        'Style: Cap,Permanent Marker,84,&H00FFFFFF,&H000000FF,&H00000000,&H96000000,0,0,0,0,100,100,1,0,1,7,3,2,60,60,560,1\n\n'
        '[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n')
ev, grp = [], []
def flush():
    for k, w in enumerate(grp):
        en = grp[k + 1][1] if k + 1 < len(grp) else w[2] + 0.2
        txt = ' '.join(('{\\c&H3B3BFF&}' + x[0].upper() + '{\\r}') if x is w else x[0].upper() for x in grp)
        ev.append(f'Dialogue: 0,{ts(w[1])},{ts(en)},Cap,,0,0,0,,{txt}')
    grp.clear()
for w in caps:
    if w[1] >= TOTAL: break
    if grp and (len(grp) >= 3 or w[1] - grp[-1][2] > 0.5 or grp[-1][0][-1] in '.?!'): flush()
    grp.append(w)
flush()
for k in range(len(ev) - 1):  # never let one caption still be up when the next appears
    nxt = ev[k + 1].split(',')[1]; parts_ = ev[k].split(',', 3)
    if parts_[2] > nxt: ev[k] = ','.join([parts_[0], parts_[1], nxt, parts_[3]])
open(ass, 'w').write(head + '\n'.join(ev) + '\n')

# ---------- frames ----------
FR = f'{WK}/frames'; subprocess.run(['rm', '-rf', FR])
fmt = 'short' if SHORT else 'long'
procs = [subprocess.Popen(['node', f'{HERE}/render.js', f'{WK}/timeline.json', FR, fmt, str(w), str(a.workers)]) for w in range(a.workers)]
if any(p.wait() for p in procs): sys.exit('frame render failed')
vf = f"subtitles={ass}:fontsdir={HERE}" if SHORT else 'null'
run('ffmpeg', '-v', 'error', '-y', '-framerate', 30, '-i', f'{FR}/f%05d.jpg', '-i', f'{WK}/mix.wav', '-vf', vf,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', 19, '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', f'{OUT}/video.mp4')

# ---------- thumbnail (Day One style) ----------
json.dump([{'scene': ST.get('thumb', {}).get('scene', 'thumb'), 'p': {**ST.get('thumb', {}), 'still': True}, 'start': 0, 'dur': 1, 'fade': 0}], open(f'{WK}/thumb.json', 'w'))
subprocess.run(['rm', '-rf', f'{WK}/thumbf'])
run('node', f'{HERE}/render.js', f'{WK}/thumb.json', f'{WK}/thumbf', 'long', 0, 1000)
run('ffmpeg', '-v', 'error', '-y', '-i', f'{WK}/thumbf/f00000.jpg', '-vf', 'scale=1280:720', '-q:v', 2, f'{OUT}/thumb.jpg')
print('done', f'{OUT}/video.mp4', f'{dur_of(f"{OUT}/video.mp4"):.1f}s', flush=True)
