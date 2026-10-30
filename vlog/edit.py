"""Render a vlog from an edit decision list (vlog/<id>/edl.json).

Pipeline: every piece is normalised to 1920x1080 30fps / 48k stereo with its effects baked in,
pieces are concatenated, music cues are laid on a separate bed and ducked under the dialogue,
synth SFX are added, then word-by-word captions (transcribed from the cut) are burned in.

usage: python3 vlog/edit.py vlog/vlog01 [--preview SECONDS]
"""
import json, os, re, subprocess, sys, pathlib, random, shutil

D = pathlib.Path(sys.argv[1]).resolve()
EDL = json.load(open(D / 'edl.json'))
RAW = pathlib.Path(EDL.get('raw', 'raw')).resolve()
HERE = pathlib.Path(__file__).resolve().parent
MUSIC = HERE / 'music'
W = D / 'work'; W.mkdir(exist_ok=True)
FONTS = HERE / 'fonts'
MARKER, BOLD = FONTS / 'PermanentMarker-Regular.ttf', FONTS / 'Anton-Regular.ttf'
PREVIEW = float(sys.argv[sys.argv.index('--preview') + 1]) if '--preview' in sys.argv else None
FPS, BEATS = 30, json.load(open(MUSIC / 'beats.json'))
NOROTATE = set(EDL.get('norotate', []))  # clips whose camera rotation tag is wrong (footage is already upright)
SPEEDFIX = EDL.get('speedfix', {})  # manual override for camera_speed, e.g. {"C0024.MP4": 4}
_CAM = {}
INTRO = EDL.get('intro') if EDL.get('intro') and (MUSIC / EDL['intro']['song']).exists() and EDL['intro']['song'] in BEATS else None  # song from the first frame
if EDL.get('intro') and not INTRO: print('intro song missing, using the teaser song instead:', EDL['intro']['song'], flush=True)
GRADE = 'eq=contrast=1.06:saturation=1.14:gamma=0.98,colorbalance=rs=0.03:bs=-0.03:rh=0.02:bh=-0.02,vignette=PI/5'
GRAIN = 'noise=alls=7:allf=t'
LETTERBOX = 'drawbox=y=0:w=iw:h=132:color=black:t=fill,drawbox=y=ih-132:w=iw:h=132:color=black:t=fill'


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        print(' '.join(map(str, cmd))[:2000]); print(r.stderr[-3000:]); raise SystemExit(1)
    return r


def clip(name):
    p = next(RAW.rglob(name), None)
    if not p: raise SystemExit(f'missing clip {name}')
    return p


def camera_speed(name):
    """How much faster than the file plays the scene really happened. Sony slow & quick clips store e.g. 120 fps
    footage as a 29.97 fps file with no sound; the camera's XML (captureFps vs formatFps) says so. 1.0 for normal clips."""
    if name in SPEEDFIX: return float(SPEEDFIX[name])
    if name not in _CAM:
        f, sp = clip(name), 1.0
        with open(f, 'rb') as fh:
            head = fh.read(4 << 20); fh.seek(max(0, f.stat().st_size - (4 << 20))); blob = head + fh.read()
        cap = re.search(rb'captureFps="([0-9.]+)', blob); fmt = re.search(rb'formatFps="([0-9.]+)', blob)
        if cap and fmt and float(cap.group(1)) > float(fmt.group(1)) * 1.05: sp = float(cap.group(1)) / float(fmt.group(1))
        how = f"captureFps {cap.group(1).decode()}" if cap else ''
        if sp == 1.0 and not cap and EDL.get('slowmo_fallback'):  # no camera tag: a silent 29.97 fps clip from this camera is slow & quick
            rate = run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', str(f)]).stdout.strip()
            if rate == '30000/1001' and audio_peak(f) < -60: sp, how = float(EDL['slowmo_fallback']), 'no camera tag; silent 29.97 fps clip'
        _CAM[name] = round(sp, 3)
        if sp != 1.0: print(f'{name}: camera slow-motion x{sp:.2f} ({how}), playing at real speed;'
                            f' loudest sound in the file {audio_peak(f):.0f} dB', flush=True)
    return _CAM[name]


def clip_len(name):
    return float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(clip(name))]).stdout)


def photo(pattern):
    """A still from vlog/<id>/photos (kept in the encrypted private inputs) or the raw footage folder."""
    return next((D / 'photos').glob(pattern), None) or next(RAW.rglob(pattern), None)


def audio_peak(p):
    """Peak level of the clip's sound in dB (-91 = silent or no sound track)."""
    if not has_audio(p): return -91.0
    err = subprocess.run(['ffmpeg', '-v', 'info', '-t', '60', '-i', str(p), '-vn', '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = re.search(r'max_volume: (-?[0-9.]+|-inf) dB', err)
    return float(m.group(1)) if m and m.group(1) != '-inf' else -91.0


def talking(p):
    """Pieces where we hear people: the music drops right down under these."""
    if p.get('mute') or p.get('_silent') or p.get('reverse') or p.get('asset') or p.get('vol', 1.0) == 0: return False
    return has_audio(clip(p['clip']))


def has_audio(p):
    out = run(['ffprobe', '-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', str(p)]).stdout
    return bool(out.strip())


def esc(t):
    return t.replace('\\', '\\\\').replace(':', '\\:').replace("'", "’").replace('%', '\\%')


def title_filter(text, style='lower', start=0.25, dur=3.2):
    """Slide-in title: 'lower' = marker lower-third, 'big' = centred title card."""
    t, e = esc(text), start + dur
    if style == 'note':  # small heads-up line, centred under the top bar, fades in and out
        fade = f"if(lt(t,{start}),0,min(1,(t-{start})/0.3))*if(gt(t,{e}),max(0,1-(t-{e})/0.4),1)"
        return (f"drawtext=fontfile={BOLD}:text='{t}':fontsize=46:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=18:"
                f"x=(w-text_w)/2:y=170:alpha='{fade}'")
    if style == 'big':
        return (f"drawtext=fontfile={MARKER}:text='{t}':fontsize=150:fontcolor=white:borderw=8:bordercolor=black@0.85:"
                f"x=(w-text_w)/2:y=(h-text_h)/2-20+40*max(0\\,1-(t-{start})/0.35):alpha='if(lt(t,{start}),0,min(1,(t-{start})/0.25))*if(gt(t,{e}),max(0,1-(t-{e})/0.3),1)'")
    return (f"drawtext=fontfile={MARKER}:text='{t}':fontsize=64:fontcolor=white:borderw=5:bordercolor=black@0.9:"
            f"x=70-500*max(0\\,1-(t-{start})/0.3):y=h-250:enable='between(t,{start},{e})'")


def frames(sec):
    """Round a length to whole video frames. Every piece is a whole number of frames long with exactly that much
    sound, so nothing creeps out of sync when 180 pieces are joined."""
    return max(1, round(sec * FPS)) / FPS


def piece(i, p):
    """Render one normalised piece -> work/pNNN.mov. Returns its duration."""
    out = W / f'p{i:03d}.mov'  # PCM sound: no AAC padding added per piece
    src = HERE / p['asset'] if p.get('asset') else clip(p['clip']); s, e = p['s'], p['e']; speed = p.get('speed', 1.0)
    dur_src = e - s
    vf = [  # fit any orientation onto a blurred 16:9 background
        f"split[fa][fb];[fb]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=28:2[bg];"
        f"[fa]scale=1920:1080:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2", f'fps={FPS}']
    if p.get('zoom'):  # punch-in
        z = p['zoom']; vf.append(f'scale={int(1920*z)}:{int(1080*z)},crop=1920:1080')
    if p.get('reverse'): vf.append('reverse')
    if speed != 1.0: vf.append(f'setpts=PTS/{speed}')
    if p.get('push'):  # cinematic slow push-in (or pull-out when negative) across the shot, with a teal/orange grade
        d, k = max(0.1, dur_src / speed), p['push']
        z = f"(1+{k:.3f}*t/{d:.3f})" if k > 0 else f"(1+{-k:.3f}*(1-t/{d:.3f}))"
        vf += [f"scale=w='2*trunc(960*{z})':h='2*trunc(540*{z})':eval=frame", 'crop=1920:1080',
               'colorbalance=rs=-0.04:bs=0.06:rh=0.05:bh=-0.05,eq=saturation=1.06:contrast=1.04']
    vf += [GRADE, GRAIN]
    if p.get('letterbox'): vf.append(LETTERBOX)
    if p.get('vhs'):
        vf += ['scale=960:540,scale=1920:1080:flags=bilinear', 'rgbashift=rh=7:bh=-7:gv=2', 'noise=alls=28:allf=t',
               'eq=saturation=1.35:contrast=1.15',
               f"drawtext=fontfile={BOLD}:text='<< REWIND':fontsize=72:fontcolor=white:x=80:y=70:alpha='if(lt(mod(t,0.5),0.3),1,0)'",
               f"drawtext=fontfile={BOLD}:text='%{{pts\\:hms}}':fontsize=56:fontcolor=white:x=w-tw-80:y=h-120"]
    if p.get('flash'): vf.append('fade=t=in:st=0:d=0.12:color=white')
    for tt in p.get('titles', []): vf.append(title_filter(tt['text'], tt.get('style', 'lower'), tt.get('at', 0.25), tt.get('dur', 3.2)))
    pics = [o for o in p.get('photos', []) if photo(o['file'])]
    if p.get('freeze'): vf.append(f"tpad=stop_mode=clone:stop_duration={p['freeze']}")
    vf += ['tpad=stop_mode=clone:stop_duration=3', 'format=yuv420p']  # never let the picture run short of the sound
    out_dur = frames(dur_src / speed + p.get('freeze', 0))
    af = ['aresample=48000', 'aformat=channel_layouts=stereo']
    if p.get('reverse'): af.append('areverse')
    if speed != 1.0:
        sp = speed; chain = []
        while sp > 2.0: chain.append('atempo=2.0'); sp /= 2.0
        chain.append(f'atempo={sp:.4f}'); af += chain
    af.append(f"volume={p.get('vol', 1.0)}")
    if p.get('mute'): af.append('volume=0')
    if p.get('freeze'): af.append(f"apad=pad_dur={p['freeze']}")
    af += ['apad', f'atrim=0:{out_dur:.3f}', 'afade=t=in:d=0.02', f'afade=t=out:st={max(0, out_dur - 0.03):.3f}:d=0.03']
    inputs = (['-noautorotate'] if p.get('clip') in NOROTATE else []) + ['-ss', f'{s:.3f}', '-t', f'{dur_src:.3f}', '-i', str(src)]
    vout, extra = '[v]', ''
    for k, o in enumerate(pics):  # a photo pops in over the shot ("look at this picture")
        inputs += ['-loop', '1', '-t', f'{out_dur:.3f}', '-i', str(photo(o['file']))]
        a, b = o.get('at', 0.5), o.get('at', 0.5) + o.get('dur', 4.0)
        extra += (f";[{k + 1}:v]scale=-2:{o.get('h', 760)},pad=iw+24:ih+24:12:12:white,format=rgba,rotate={o.get('rot', -3)}*PI/180:c=none:ow=rotw(iw):oh=roth(ih),format=rgba[ph{k}]"
                  f";{vout}[ph{k}]overlay=x={o.get('x', 'W-w-90')}:y=(H-h)/2+H*max(0\\,1-(t-{a})/0.25):enable='between(t,{a},{b})'[pv{k}]")
        vout = f'[pv{k}]'
    if p.get('loc'):  # cute location tag in the top-left corner (vlog/loc/<slug>.webm, rendered by loc/render.js)
        at = p.get('loc_at', 0.3)
        inputs += ['-itsoffset', f'{at:.3f}', '-c:v', 'libvpx-vp9', '-i', str(HERE / 'loc' / f"{p['loc']}.webm")]
        extra += f";[{1 + len(pics)}:v]format=rgba[lc];{vout}[lc]overlay=x=40:y={150 if p.get('letterbox') else 40}:eof_action=pass[lv]"
        vout = '[lv]'
    na = 1 + len(pics) + (1 if p.get('loc') else 0)
    if has_audio(src) and not p.get('_silent'):
        graph = f"[0:v]{vf[0]}[v0];[v0]{','.join(vf[1:])}[v];[0:a:0]{','.join(af)}[a]{extra}"
        amap = ['-map', vout, '-map', '[a]']
    else:
        inputs += ['-f', 'lavfi', '-t', f'{out_dur:.3f}', '-i', 'anullsrc=r=48000:cl=stereo']
        graph = f"[0:v]{vf[0]}[v0];[v0]{','.join(vf[1:])}[v]{extra}"
        amap = ['-map', vout, '-map', f'{na}:a']
    run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', graph, *amap,
         '-t', f'{out_dur:.3f}', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-r', str(FPS),
         '-c:a', 'pcm_s16le', '-ar', '48000', str(out)])
    lens = [float(x) for x in run(['ffprobe', '-v', 'error', '-show_entries', 'stream=duration', '-of', 'csv=p=0', str(out)]).stdout.split()]
    if max(lens) - min(lens) > 0.05: print(f'WARNING piece {i}: picture/sound lengths differ {lens}', flush=True)
    return out_dur


def expand(edl):
    """Turn the high-level sections into a flat list of pieces with timeline info."""
    pieces, cues, sfx, t = [], [], [], 0.0
    def add(p):
        nonlocal t
        p['_t'] = t; pieces.append(p)
        t += frames((p['e'] - p['s']) / p.get('speed', 1.0) + p.get('freeze', 0))
    if INTRO: cues.append({'song': INTRO['song'], 'at': 0.0, 'from': INTRO.get('from', 0.0), 'dur': None, 'gain': INTRO.get('gain', 0.9), 'tag': 'intro'})
    for sec in edl['sections']:
        kind = sec['type']
        if kind == 'hikids':  # rapid accelerating supercut with punch-ins and flashes, one cut per beat of the intro song
            n = len(sec['clips'])
            beat = 60 / BEATS[INTRO['song']]['bpm'] if INTRO else None
            for k, (c, s, e) in enumerate(sec['clips']):
                sp = sec.get('speed_from', 1.5) + (sec.get('speed_to', 2.6) - sec.get('speed_from', 1.5)) * k / max(1, n - 1)
                if beat and sec.get('beats_each'): sp = (e - s) / (beat * sec['beats_each'])  # every cut the same length
                elif beat: sp = (e - s) / (beat * max(1, round((e - s) / sp / beat)))  # each cut lasts whole beats: 2 beats early, 1 beat at the end
                sfx.append(('whoosh', t)); add({'clip': c, 's': s, 'e': e, 'speed': round(sp, 3), 'zoom': 1.0 + 0.12 * (k % 2), 'flash': True, '_duck': 0.55})
        elif kind == 'teaser':  # beat-cut highlights on a song drop, letterboxed, ends on a freeze
            per = sec.get('beats_per_cut', 2); t0 = t
            if INTRO:  # the intro song keeps playing under the teaser; cut on its beats from where it has got to
                song = INTRO['song']; beats = [b for b in BEATS[song]['beats'] if b >= INTRO.get('from', 0.0) + t0]
                cues[0]['from'] = beats[0] - t0  # nudge the song start so a beat lands exactly on the first teaser cut
            else:
                song = sec['song']; beats = [b for b in BEATS[song]['beats'] if b >= sec['song_from']]
                cues.append({'song': song, 'at': t0, 'from': beats[0], 'dur': None, 'gain': sec.get('gain', 0.9), 'tag': 'teaser'})
            sec['_pieces'] = []
            for k, (c, s) in enumerate(sec['clips']):
                d = beats[(k + 1) * per] - beats[k * per]
                cam = camera_speed(c)
                p = {'clip': c, 's': s, 'e': s + d * cam, 'speed': cam, 'letterbox': True, 'mute': True}
                if k == len(sec['clips']) - 1: p['freeze'] = sec.get('freeze', 0.7)
                add(p); sec['_pieces'].append(dict(p))
            cues[-1]['dur'] = t - cues[-1]['at']
            sec['_song'] = (song, cues[-1]['from'] + cues[-1]['dur'] - sec.get('freeze', 0.7))
            if any(x['type'] == 'rewind' for x in edl['sections']): sfx.append(('scratch', t - sec.get('freeze', 0.7)))
        elif kind == 'rewind':  # replay the teaser backwards, fast, VHS
            teaser = next(s for s in edl['sections'] if s['type'] == 'teaser')
            t0 = t
            for p in reversed(teaser['_pieces']):
                add({'clip': p['clip'], 's': p['s'], 'e': p['e'], 'reverse': True, 'speed': sec.get('speed', 3.0) * p['speed'], 'vhs': True, 'mute': True})
            sfx.append(('rewind', t0, {'song': teaser['_song'][0], 'end': teaser['_song'][1], 'dur': t - t0}))
        elif kind == 'scenes':
            if sec.get('music'):
                m = sec['music']; bt = BEATS[m['song']]['beats']
                frm = min(bt, key=lambda b: abs(b - m.get('from', 0)))  # start the song on a beat
                cues.append({'song': m['song'], 'at': t, 'from': frm, 'dur': None, 'gain': m.get('gain', 0.35), 'tag': 'bed'})
            for p in sec['clips']:
                p = dict(p)
                parts = [p]
                if p.get('clip'):
                    cam = camera_speed(p['clip'])
                    if cam != 1.0:  # slow-motion camera clip: real speed, no sound
                        p['speed'] = round(p.get('speed', 1.0) * cam, 3); p['_silent'] = True
                        if sec.get('music'):
                            parts = montage(p, 60 / BEATS[sec['music']['song']]['bpm'], sec.get('broll_beats', 2))
                for q in parts:
                    if q.get('loc'): sfx.append(('pin', t + q.get('loc_at', 0.3)))
                    add(q)
            if sec.get('music'): cues[-1]['dur'] = t - cues[-1]['at']
    return pieces, cues, sfx, t


def montage(p, beat, per):
    """Chop a silent b-roll shot into quick on-beat cuts spread across its range (every other slice, so it moves),
    alternating a slight punch-in. The first cut stays long enough for its location tag or title to play out."""
    sp, end = p['speed'], min(p['e'], clip_len(p['clip']) - 0.1)
    cut = per * beat
    if p.get('photos'):  # photos are timed against the whole shot: keep it in one piece, just land it on the beat
        n = max(2, round((end - p['s']) / sp / cut)); return [dict(p, e=min(p['s'] + n * cut * sp, end))]
    hold = max([4.2 if p.get('loc') else 0] + [t.get('at', 0.25) + t.get('dur', 3.2) + 0.3 for t in p.get('titles', [])])
    first = cut * max(1, -(-hold // cut))
    real = (end - p['s']) / sp
    n = max(1, min(10, round((real - first) / (2 * cut)))) if real > first + cut else 0
    out = [dict(p, e=p['s'] + first * sp, letterbox=True, push=0.05)]
    gap = (real - first - n * cut) / max(1, n)
    for k in range(n):
        a = p['s'] + (first + gap * (k + 1) + cut * k) * sp
        out.append({'clip': p['clip'], 's': a, 'e': a + cut * sp, 'speed': sp, '_silent': True, 'mute': p.get('mute'),
                    'letterbox': True, 'push': 0.07 if k % 2 == 0 else -0.07})
    return [{k: v for k, v in q.items() if v is not None} for q in out]


def synth_sfx(kind, out, opt=None):
    if kind == 'pin': shutil.copy(HERE / 'loc' / 'pin.wav', out); return
    if kind == 'rewind' and opt and (MUSIC / opt['song']).exists():
        # tape rewind: the teaser's song runs backwards, sped up and pitched up with wow/flutter, over a motor whir
        sp, d = 3.0, opt['dur']; a = max(0.0, opt['end'] - d * sp)
        g = (f"[0:a]atrim={a:.3f}:{opt['end']:.3f},asetpts=PTS-STARTPTS,areverse,aresample=48000,asetrate=48000*{sp},aresample=48000,"
             f"vibrato=f=7:d=0.35,lowpass=f=7000,highpass=f=180,volume=0.8,atrim=0:{d:.3f}[m];"
             f"anoisesrc=d={d:.3f}:c=pink:a=0.12,bandpass=f=2200:w=1800,tremolo=f=14:d=0.5[w];"
             f"[m][w]amix=inputs=2:normalize=0,afade=t=in:d=0.08,afade=t=out:st={max(0, d - 0.35):.3f}:d=0.35[o]")
        run(['ffmpeg', '-v', 'error', '-y', '-i', str(MUSIC / opt['song']), '-filter_complex', g, '-map', '[o]', '-ar', '48000', '-ac', '2', str(out)]); return
    if kind == 'whoosh':
        g = "anoisesrc=d=0.45:c=pink:a=0.6,highpass=f=300,lowpass=f=6000,afade=t=in:d=0.2,afade=t=out:st=0.2:d=0.25,volume=0.5"
    elif kind == 'scratch':
        g = "anoisesrc=d=0.35:c=brown:a=0.8,vibrato=f=18:d=1,bandpass=f=900:w=600,afade=t=out:st=0.1:d=0.25,volume=1.2"
    else:  # rewind
        g = "anoisesrc=d=3.5:c=white:a=0.25,vibrato=f=9:d=1,bandpass=f=1500:w=1200,tremolo=f=12:d=0.6,afade=t=in:d=0.1,afade=t=out:st=3.0:d=0.5"
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', g, '-ar', '48000', '-ac', '2', str(out)])


def load_audio(path):
    """16 kHz mono float samples via ffmpeg (faster-whisper's own PyAV decoder breaks on some av versions)."""
    import numpy as np
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32)


def captions(dialogue_wav, ass_out):
    from faster_whisper import WhisperModel
    m = WhisperModel('small.en', device='cpu', compute_type='int8')
    segs, _ = m.transcribe(load_audio(dialogue_wav), word_timestamps=True, vad_filter=True, language='en',
                           initial_prompt='hi kids. Hi kids! New York, NYC. Bye kids.')
    words = [w for s in segs for w in (s.words or []) if w.probability > 0.35]
    def ts(x): h = int(x // 3600); m_ = int(x % 3600 // 60); return f'{h}:{m_:02d}:{x % 60:05.2f}'
    head = ('[Script Info]\nScriptType: v4.00+\nPlayResX: 1920\nPlayResY: 1080\n\n[V4+ Styles]\n'
            'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n'
            'Style: Cap,Anton,74,&H00FFFFFF,&H0000D4FF,&H00000000,&H64000000,0,0,0,0,100,100,1,0,1,6,2,2,80,80,150,1\n\n'
            '[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n')
    lines, group = [], []
    def flush():
        if not group: return
        for k, w in enumerate(group):  # one event per word: current word yellow + pop
            st = w.start; en = group[k + 1].start if k + 1 < len(group) else w.end + 0.15
            txt = ' '.join(('{\\c&H00D4FF&\\fscx112\\fscy112}' + x.word.strip().upper() + '{\\r}') if x is w else x.word.strip().upper() for x in group)
            lines.append(f'Dialogue: 0,{ts(st)},{ts(en)},Cap,,0,0,0,,{txt}')
        group.clear()
    for w in words:
        if group and (len(group) >= 3 or w.start - group[-1].end > 0.6): flush()
        group.append(w)
    flush()
    open(ass_out, 'w').write(head + '\n'.join(lines) + '\n')


def drop_missing(edl):
    """Leave out clips that failed to download, so a draft still renders; report what was skipped."""
    have = lambda c: next(RAW.rglob(c), None) is not None
    gone = set()
    for sec in edl['sections']:
        keep = []
        for c in sec.get('clips', []):
            name = c[0] if isinstance(c, list) else c.get('clip')
            if name is None or have(name): keep.append(c)
            else: gone.add(name)
        if 'clips' in sec: sec['clips'] = keep
    edl['sections'] = [s for s in edl['sections'] if s['type'] == 'rewind' or s.get('clips')]
    if gone: print('SKIPPED (not downloaded):', ', '.join(sorted(gone)), flush=True)


def main():
    drop_missing(EDL)
    pieces, cues, sfx, total = expand(EDL)
    if PREVIEW:
        keep = [p for p in pieces if p['_t'] < PREVIEW]; pieces = keep
        total = min(total, PREVIEW)
    print(f'{len(pieces)} pieces, {total/60:.1f} min')
    for i, p in enumerate(pieces):
        piece(i, p); print('piece', i, p.get('clip', p.get('asset')), p['s'], flush=True)
    lst = W / 'list.txt'; lst.write_text(''.join(f"file 'p{i:03d}.mov'\n" for i in range(len(pieces))))
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', str(W / 'cut.mov')])
    run(['ffmpeg', '-v', 'error', '-y', '-i', str(W / 'cut.mov'), '-vn', '-ac', '2', '-ar', '48000', str(W / 'dialogue.wav')])
    # music bed
    ins, parts = [], []
    for k, c in enumerate([c for c in cues if c['at'] < total]):
        dur = min(c['dur'], total - c['at'])
        ins += ['-stream_loop', '-1', '-ss', f"{c['from']:.3f}", '-i', str(MUSIC / c['song'])]  # loops if the scene outlasts the song
        parts.append(f"[{k}:a]asetpts=N/SR/TB,atrim=duration={dur:.3f},aresample=48000,aformat=channel_layouts=stereo,volume={c['gain']},afade=t=in:d=0.3,"
                     f"afade=t=out:st={max(0, dur - 0.8):.3f}:d=0.8,adelay={int(c['at']*1000)}|{int(c['at']*1000)}[m{k}]")
    n = len(parts)
    for k, (kind, at, *opt) in enumerate(s for s in sfx if s[1] < total):
        f = W / f'sfx_{kind}.wav'
        if not f.exists(): synth_sfx(kind, f, opt[0] if opt else None)
        ins += ['-i', str(f)]; parts.append(f"[{n + k}:a]adelay={int(at*1000)}|{int(at*1000)}[s{k}]")
    ns = len(parts) - n
    def bed(prefix, k0, cnt, out):  # mix a set of delayed inputs into one track (silence if none)
        if not cnt:
            run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-t', f'{total:.3f}', '-i', 'anullsrc=r=48000:cl=stereo', str(out)]); return
        env = ''.join(f",volume={f}:enable='between(t,{a:.3f},{b:.3f})'" for a, b, f in (talk if prefix == 'm' else []))
        g = ';'.join(parts[k0:k0 + cnt]) + ';' + ''.join(f'[{prefix}{k}]' for k in range(cnt)) + f'amix=inputs={cnt}:normalize=0,apad{env}[o]'
        run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', g, '-map', '[o]', '-t', f'{total:.3f}', '-ar', '48000', '-ac', '2', str(out)])
    # while people talk the song sits far underneath them (EDL "talk_music", default 18% volume)
    duck = EDL.get('talk_music', 0.18)
    talk = [(p['_t'], p['_t'] + (p['e'] - p['s']) / p.get('speed', 1.0), p.get('_duck', duck)) for p in pieces if talking(p)]
    bed('m', 0, n, W / 'music.wav'); bed('s', n, ns, W / 'sfx.wav')
    # duck music under dialogue, then mix
    run(['ffmpeg', '-v', 'error', '-y', '-i', str(W / 'music.wav'), '-i', str(W / 'dialogue.wav'), '-i', str(W / 'sfx.wav'), '-filter_complex',
         '[1:a]asplit[d1][d2];[0:a][d1]sidechaincompress=threshold=0.02:ratio=12:attack=15:release=350[duck];'
         '[duck][d2][2:a]amix=inputs=3:normalize=0,alimiter=limit=0.95,loudnorm=I=-14:TP=-1.0:LRA=11[out]',
         '-map', '[out]', '-ar', '48000', str(W / 'mix.wav')])
    subs = EDL.get('captions', True)  # word-by-word subtitles; "captions": false in the EDL leaves them out
    if subs: captions(W / 'dialogue.wav', W / 'caps.ass')
    else: (W / 'caps.ass').write_text('')
    out = D / ('preview.mp4' if PREVIEW else 'vlog.mp4')
    vb = int(min(12e6, 940e6 * 8 / total - 200e3))  # keep the file under ~950 MB so the YouTube upload step accepts it
    run(['ffmpeg', '-v', 'error', '-y', '-i', str(W / 'cut.mov'), '-i', str(W / 'mix.wav'), '-map', '0:v', '-map', '1:a',
         '-vf', f"subtitles={W / 'caps.ass'}:fontsdir={FONTS}" if subs else 'null', '-c:v', 'libx264', '-preset', 'fast', '-b:v', f'{vb}', '-maxrate', f'{int(vb * 1.5)}', '-bufsize', f'{vb * 2}',
         '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', str(out)])
    print('done', out, f'{out.stat().st_size/1e6:.0f} MB')


if __name__ == '__main__':
    main()
