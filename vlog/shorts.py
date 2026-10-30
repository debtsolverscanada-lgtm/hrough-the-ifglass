"""Render vertical Shorts from vlog/<id>/shorts.json.

Layouts: "panel" (4:3 panel on a blurred background) or "full" (full-screen 9:16 crop that follows the
faces in each shot). Extras a short can switch on:
  tight   cut the silences inside talking segments (jump cuts, alternating punch-in)
  tag     per-segment pop-up sticker text (with a pop sound)
  board   a scoreboard whose lines appear on given segments and stay on screen
plus a hook at the top, word-by-word captions, bass hits on punchlines, and a music bed ducked under talking.

usage: python3 vlog/shorts.py vlog/vlog01 [slug ...] [--no-captions]
"""
import json, sys, pathlib, re, subprocess
D = pathlib.Path(sys.argv[1]).resolve()
CFG = json.load(open(D / 'shorts.json'))
HERE = pathlib.Path(__file__).resolve().parent
RAW = pathlib.Path(CFG.get('raw', 'raw')).resolve()
MUSIC, FONTS = HERE / 'music', HERE / 'fonts'
MARKER, BOLD = FONTS / 'PermanentMarker-Regular.ttf', FONTS / 'Anton-Regular.ttf'
OUT = D / 'shorts'; OUT.mkdir(exist_ok=True)
W = OUT / 'work'; W.mkdir(exist_ok=True)
BEATS = json.load(open(MUSIC / 'beats.json'))
GRADE = 'eq=contrast=1.06:saturation=1.16:gamma=0.98,colorbalance=rs=0.03:bs=-0.03'
PANEL_Y, PANEL_H = 500, 810  # 4:3 panel 1080x810
CAP_Y = {'panel': PANEL_Y + PANEL_H + 60, 'full': 1240}  # top of the caption line

from edit import run, clip, has_audio, load_audio, camera_speed, NOROTATE  # same helpers as the long-form editor


def esc(t):
    return t.replace('\\', '\\\\').replace("'", '’').replace(':', '\\:').replace('%', '\\%')


def face_cx(src, s, e, norotate):
    """Horizontal crop position (0..1) that centres the faces in this clip range; 0.5 if none found."""
    try:
        import cv2
        det = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    except (ImportError, AttributeError):  # no OpenCV, or OpenCV 5 (Haar cascades moved out): keep it centred
        return 0.5
    xs, ws = [], []
    for k in range(4):
        t = s + (e - s) * (k + 0.5) / 4
        png = W / 'face.png'
        r = subprocess.run(['ffmpeg', '-v', 'error', '-y', *(['-noautorotate'] if norotate else []), '-ss', f'{t:.3f}',
                            '-i', str(src), '-frames:v', '1', '-vf', 'scale=640:-2', str(png)], capture_output=True)
        img = cv2.imread(str(png)) if r.returncode == 0 else None
        if img is None: continue
        g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        for (x, y, w, h) in det.detectMultiScale(g, 1.1, 6, minSize=(48, 48)):
            xs.append((x + w / 2) / img.shape[1]); ws.append(w * h)
    if not xs:
        return 0.5
    fc = sum(x * w for x, w in zip(xs, ws)) / sum(ws)  # face centre as a fraction of the frame width
    crop = 9 / 16 / (16 / 9)                            # 9:16 crop width as a fraction of a 16:9 frame
    return min(1.0, max(0.0, (fc - crop / 2) / (1 - crop)))


def speech_spans(src, s, e, pad=0.12, gap=0.35):
    """Sub-ranges of [s, e] that contain sound, so silences longer than `gap` can be cut out."""
    r = subprocess.run(['ffmpeg', '-v', 'info', '-ss', f'{s:.3f}', '-t', f'{e - s:.3f}', '-i', str(src), '-vn',
                        '-af', f'silencedetect=noise=-32dB:d={gap}', '-f', 'null', '-'], capture_output=True, text=True)
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r.stderr)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r.stderr)]
    spans, cur = [], 0.0
    for a, b in zip(starts, ends + [e - s] * (len(starts) - len(ends))):
        if a - cur > 0.25: spans.append((s + max(0, cur - pad), s + min(e - s, a + pad)))
        cur = b
    if (e - s) - cur > 0.25: spans.append((s + max(0, cur - pad), e))
    return spans or [(s, e)]


def seg(i, p, slug, layout):
    out = W / f'{slug}-{i:02d}.mp4'
    src = clip(p['clip'])
    s, e = p['s'], p['e']; cam = camera_speed(p['clip']); dur = (e - s) / cam; z = p.get('zoom', 1.0); cx = p.get('cx', 0.5)
    bg = 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:2,eq=brightness=-0.12'
    if layout == 'full' or p.get('full'):  # 9:16 crop of the frame, positioned on the faces
        fg = f"crop='min(iw,ih*9/16)/{z}':'min(ih,iw*16/9)/{z}':(iw-ow)*{cx}:(ih-oh)/2,scale=1080:1920"
        lay = '[b][f]overlay=0:0'
    else:
        fg = f"crop='min(iw,ih*4/3)/{z}':'min(iw,ih*4/3)*3/4/{z}':(iw-ow)*{cx}:(ih-oh)/2,scale=1080:{PANEL_H}"
        lay = f'[b][f]overlay=0:{PANEL_Y}'
    tag = ''
    if p.get('tag'):  # sticker that pops in and stays for the segment
        col = p.get('tag_color', '0xFFD84D')
        tag = (f",drawtext=fontfile={MARKER}:text='{esc(p['tag'])}':fontsize={p.get('tag_size', 84)}:fontcolor=black:"
               f"box=1:boxcolor={col}:boxborderw=22:x=(w-text_w)/2:y={p.get('tag_y', 1040)}:"
               f"alpha='min(1,t/0.12)'")
    v = (f"[0:v]setpts=PTS/{cam},fps=30,split[x][y];[x]{bg}[b];[y]{fg},{GRADE}[f];{lay},noise=alls=6:allf=t{tag}"
         + (",fade=t=in:st=0:d=0.1:color=white" if p.get('boom') else '')
         + (f",tpad=stop_mode=clone:stop_duration={p['freeze']}" if p.get('freeze') else '') + ',format=yuv420p[v]')
    out_dur = dur + p.get('freeze', 0)
    af = f"aresample=48000,aformat=channel_layouts=stereo,volume={0 if p.get('mute') else p.get('vol', 1.0)}" \
         + (f",apad=pad_dur={p['freeze']}" if p.get('freeze') else '') + f",atrim=0:{out_dur:.3f},afade=t=in:d=0.02[a]"
    ins = (['-noautorotate'] if p['clip'] in NOROTATE else []) + ['-ss', f'{s:.3f}', '-t', f'{e - s:.3f}', '-i', str(src)]
    if has_audio(src) and cam == 1.0: graph = f'{v};[0:a:0]{af}'
    else:
        ins += ['-f', 'lavfi', '-t', f'{out_dur:.3f}', '-i', 'anullsrc=r=48000:cl=stereo']; graph = f'{v};[1:a]{af}'
    run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', graph, '-map', '[v]', '-map', '[a]', '-t', f'{out_dur:.3f}',
         '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-r', '30', '-c:a', 'aac', '-b:a', '192k', str(out)])
    return out, out_dur


def captions(wav, ass, model, layout):
    segs, _ = ([], None) if model is None else model.transcribe(load_audio(wav), word_timestamps=True, vad_filter=True, language='en',
                               initial_prompt='hi kids. Bye kids. Bye cats. New York, NYC.')
    words = [w for s_ in segs for w in (s_.words or []) if w.probability > 0.35]
    ts = lambda x: f'{int(x // 3600)}:{int(x % 3600 // 60):02d}:{x % 60:05.2f}'
    head = ('[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\n\n[V4+ Styles]\n'
            'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n'
            f'Style: Cap,Anton,{104 if layout == "full" else 96},&H00FFFFFF,&H0000D4FF,&H00000000,&H80000000,0,0,0,0,100,100,1,0,1,8,3,8,60,60,{CAP_Y[layout]},1\n\n'
            '[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n')
    lines, group = [], []
    def flush():
        for k, w in enumerate(group):
            en = group[k + 1].start if k + 1 < len(group) else w.end + 0.15
            txt = ' '.join(('{\\c&H00D4FF&\\fscx115\\fscy115}' + x.word.strip().upper() + '{\\r}') if x is w else x.word.strip().upper() for x in group)
            lines.append(f'Dialogue: 0,{ts(w.start)},{ts(en)},Cap,,0,0,0,,{txt}')
        group.clear()
    for w in words:
        if group and (len(group) >= 2 or w.start - group[-1].end > 0.5): flush()
        group.append(w)
    flush()
    open(ass, 'w').write(head + '\n'.join(lines) + '\n')


def sfx(kind, path):
    g = {'boom': "sine=f=55:d=0.9,volume='1.6*exp(-4*t)':eval=frame",                       # sub-bass hit for punchlines
         'pop': "sine=f=1200:d=0.12,volume='0.9*exp(-30*t)':eval=frame",                    # sticker / text pop
         'ding': "sine=f=1568:d=0.5,volume='0.7*exp(-7*t)':eval=frame"}[kind]               # score reveal
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', g + ',asetrate=48000,aformat=channel_layouts=stereo', str(path)])


def expand(sh, segs):
    """Apply beat timing, face-centred crops and silence cutting; returns (segments, original index of each)."""
    layout = sh.get('layout', 'panel')
    if sh.get('beats'):  # beat-cut: each clip lasts four beats from the song start
        bt = [b for b in BEATS[sh['beats']]['beats'] if b >= sh['music']['from']]
        n = 0
        for p in segs:
            k = p.get('beats', 4)
            if 'e' not in p: p['e'] = p['s'] + (bt[n + k] - bt[n]) * camera_speed(p['clip'])
            n += k
    out, idx = [], []
    for i, p in enumerate(segs):
        src = clip(p['clip']); nr = p['clip'] in NOROTATE
        if camera_speed(p['clip']) != 1.0: p['mute'] = True  # slow-motion camera clip: no sound, played at real speed
        if layout == 'full' and 'cx' not in p and not p.get('full'):
            p['cx'] = face_cx(src, p['s'], p['e'], nr)
        spans = speech_spans(src, p['s'], p['e']) if sh.get('tight') and not p.get('mute') and not p.get('keep') and has_audio(src) else [(p['s'], p['e'])]
        for k, (a, b) in enumerate(spans):
            q = dict(p, s=a, e=b)
            if k: q.pop('boom', None); q.pop('tag_pop', None)
            if k < len(spans) - 1: q.pop('freeze', None)
            if len(spans) > 1 and 'zoom' not in p: q['zoom'] = 1.0 if k % 2 == 0 else 1.1  # jump-cut punch-ins
            out.append(q); idx.append(i)
    return out, idx


def drop_missing(sh):
    """Leave out segments whose clip did not download; scoreboard lines follow their segment (or go with it)."""
    have = [next(RAW.rglob(p['clip']), None) is not None for p in sh['segs']]
    if all(have): return sh
    print('skipping (not downloaded):', sorted({p['clip'] for p, h in zip(sh['segs'], have) if not h}), flush=True)
    new_idx = {old: n for n, old in enumerate(i for i, h in enumerate(have) if h)}
    sh = dict(sh, segs=[p for p, h in zip(sh['segs'], have) if h])
    if sh.get('board'):
        sh['board'] = dict(sh['board'], items=[dict(it, seg=new_idx[it['seg']]) for it in sh['board']['items'] if it['seg'] in new_idx])
    return sh


def make(sh, model):
    sh = drop_missing(sh)
    slug = sh['slug']; layout = sh.get('layout', 'panel')
    segs, idx = expand(sh, [dict(p) for p in sh['segs']])
    parts, t, hits, seg_start = [], 0.0, [], {}
    for i, p in enumerate(segs):
        f, d = seg(i, p, slug, layout); parts.append(f)
        seg_start.setdefault(idx[i], t)
        if p.get('boom'): hits.append(('boom', t))
        if p.get('tag') and (i == 0 or idx[i - 1] != idx[i]): hits.append(('pop', t))
        t += d
    total = t
    lst = W / f'{slug}.txt'; lst.write_text(''.join(f"file '{p.name}'\n" for p in parts))
    cut = W / f'{slug}-cut.mp4'
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', str(cut)])
    dia = W / f'{slug}-dia.wav'
    run(['ffmpeg', '-v', 'error', '-y', '-i', str(cut), '-vn', '-ac', '2', '-ar', '48000', str(dia)])
    board = sh.get('board')
    for item in (board or {}).get('items', []):
        hits.append(('ding', seg_start.get(item['seg'], 0) + item.get('at', 0)))
    for kind in {k for k, _ in hits}:
        if not (W / f'{kind}.wav').exists(): sfx(kind, W / f'{kind}.wav')
    m = sh['music']
    ins = ['-i', str(dia), '-ss', f"{m['from']:.3f}", '-t', f'{total:.3f}', '-i', str(MUSIC / m['song'])]
    g = [f"[1:a]aresample=48000,aformat=channel_layouts=stereo,volume={m['gain']},afade=t=in:d=0.2,afade=t=out:st={max(0, total - 0.6):.3f}:d=0.6[m]",
         '[0:a]asplit[d1][d2]', '[m][d1]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[duck]']
    mix = '[duck][d2]'
    for k, (kind, at) in enumerate(hits):
        ins += ['-i', str(W / f'{kind}.wav')]; g.append(f'[{2 + k}:a]adelay={int(at * 1000)}|{int(at * 1000)}[h{k}]'); mix += f'[h{k}]'
    g.append(f'{mix}amix=inputs={2 + len(hits)}:normalize=0,alimiter=limit=0.95,loudnorm=I=-14:TP=-1.0[out]')
    mixed = W / f'{slug}-mix.wav'
    run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', ';'.join(g), '-map', '[out]', '-t', f'{total:.3f}', '-ar', '48000', str(mixed)])
    ass = W / f'{slug}.ass'; captions(dia, ass, model if sh.get('captions', True) else None, layout)
    vf = []
    if layout == 'full' and sh.get('hook'):  # dark band behind the hook so it reads over any footage
        vf.append('drawbox=x=0:y=150:w=iw:h=300:color=black@0.35:t=fill')
    for k, line in enumerate(sh['hook'].split('|') if sh.get('hook') else []):  # hook: up to two lines, marker font, slight pop-in
        y = 190 + k * 130; size = min(108, int(990 / (0.66 * max(1, len(line)))))  # shrink long lines to fit
        vf.append(f"drawtext=fontfile={MARKER}:text='{esc(line)}':fontsize={size}:fontcolor={'white' if k == 0 else '0xFFD84D'}:"
                  f"borderw=9:bordercolor=black:x=(w-text_w)/2:y={y}+30*max(0\\,1-t/0.25)")
    if board:  # scoreboard: title + lines that appear on their segment and stay
        x0, y0 = board.get('x', 60), board.get('y', 470 if sh.get('hook') else 180)
        vf.append(f"drawtext=fontfile={BOLD}:text='{esc(board['title'])}':fontsize=54:fontcolor=white:box=1:boxcolor=black@0.6:"
                  f"boxborderw=14:x={x0}:y={y0}:enable='gte(t,{board.get('from', 0)})'")
        for n, item in enumerate(board['items']):
            at = seg_start.get(item['seg'], 0) + item.get('at', 0)
            vf.append(f"drawtext=fontfile={BOLD}:text='{esc(item['text'])}':fontsize=50:fontcolor={item.get('color', '0xFFD84D')}:"
                      f"box=1:boxcolor=black@0.6:boxborderw=12:x={x0}+40*max(0\\,1-(t-{at:.2f})/0.2):y={y0 + 80 + n * 70}:"
                      f"enable='gte(t,{at:.2f})'")
    vf.append(f"subtitles={ass}:fontsdir={FONTS}")
    out = OUT / f'{slug}.mp4'
    run(['ffmpeg', '-v', 'error', '-y', '-i', str(cut), '-i', str(mixed), '-map', '0:v', '-map', '1:a', '-vf', ','.join(vf),
         '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', str(out)])
    print('short', slug, f'{total:.1f}s', flush=True)
    return out


if __name__ == '__main__':
    model = None  # --no-captions (or "captions": false in shorts.json): no word-by-word subtitles
    if '--no-captions' not in sys.argv and CFG.get('captions', True):
        from faster_whisper import WhisperModel
        model = WhisperModel('small.en', device='cpu', compute_type='int8')
    want = {a for a in sys.argv[2:] if not a.startswith('--')}
    for sh in CFG['shorts']:
        if want and sh['slug'] not in want: continue
        try: make(sh, model)
        except SystemExit as e: print('FAILED short', sh['slug'], e, flush=True)  # keep going with the rest
    (OUT / 'titles.txt').write_text(''.join(f"{s['slug']}: {s['title']}\n" for s in CFG['shorts']))
