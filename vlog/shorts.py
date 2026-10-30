"""Render vertical Shorts from vlog/<id>/shorts.json.

Each short: framed 4:3 panel on a blurred full-screen background (or full-bleed for vertical clips),
a hook line at the top, word-by-word captions under the panel, punch-in zooms with a bass hit,
and a music bed ducked under the talking.

usage: python3 vlog/shorts.py vlog/vlog01 [slug ...] [--no-captions]
"""
import json, sys, pathlib
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

from edit import run, clip, has_audio, load_audio  # same helpers as the long-form editor


def seg(i, p, slug):
    out = W / f'{slug}-{i:02d}.mp4'
    src = clip(p['clip'])
    s, e = p['s'], p['e']; dur = e - s; z = p.get('zoom', 1.0); cx = p.get('cx', 0.5)
    bg = 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:2,eq=brightness=-0.12'
    if p.get('full'):  # vertical or full-bleed crop
        fg = f"scale=-2:{int(1920 * z)},crop=1080:1920:(iw-1080)*{cx}:(ih-1920)/2"
        lay = f'[b][f]overlay=0:0'
    else:
        fg = f"crop='min(iw,ih*4/3)/{z}':'min(iw,ih*4/3)*3/4/{z}':(iw-ow)*{cx}:(ih-oh)/2,scale=1080:{PANEL_H}"
        lay = f'[b][f]overlay=0:{PANEL_Y}'
    v = (f"[0:v]fps=30,split[x][y];[x]{bg}[b];[y]{fg},{GRADE}[f];{lay},noise=alls=6:allf=t"
         + (",fade=t=in:st=0:d=0.1:color=white" if p.get('boom') else '')
         + (f",tpad=stop_mode=clone:stop_duration={p['freeze']}" if p.get('freeze') else '') + ',format=yuv420p[v]')
    out_dur = dur + p.get('freeze', 0)
    af = f"aresample=48000,aformat=channel_layouts=stereo,volume={0 if p.get('mute') else p.get('vol', 1.0)}" \
         + (f",apad=pad_dur={p['freeze']}" if p.get('freeze') else '') + f",atrim=0:{out_dur:.3f},afade=t=in:d=0.02[a]"
    ins = ['-ss', f'{s:.3f}', '-t', f'{dur:.3f}', '-i', str(src)]
    if has_audio(src): graph = f'{v};[0:a:0]{af}'
    else:
        ins += ['-f', 'lavfi', '-t', f'{out_dur:.3f}', '-i', 'anullsrc=r=48000:cl=stereo']; graph = f'{v};[1:a]{af}'
    run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', graph, '-map', '[v]', '-map', '[a]', '-t', f'{out_dur:.3f}',
         '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-r', '30', '-c:a', 'aac', '-b:a', '192k', str(out)])
    return out, out_dur


def captions(wav, ass, model):
    segs, _ = ([], None) if model is None else model.transcribe(load_audio(wav), word_timestamps=True, vad_filter=True, language='en',
                               initial_prompt='hi kids. Bye kids. Bye cats. New York, NYC.')
    words = [w for s_ in segs for w in (s_.words or []) if w.probability > 0.35]
    ts = lambda x: f'{int(x // 3600)}:{int(x % 3600 // 60):02d}:{x % 60:05.2f}'
    head = ('[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\n\n[V4+ Styles]\n'
            'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n'
            f'Style: Cap,Anton,96,&H00FFFFFF,&H0000D4FF,&H00000000,&H80000000,0,0,0,0,100,100,1,0,1,7,3,8,60,60,{PANEL_Y + PANEL_H + 60},1\n\n'
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


def boom(path):  # sub-bass hit for punchlines
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i',
         "sine=f=55:d=0.9,volume='1.6*exp(-4*t)':eval=frame,asetrate=48000,aformat=channel_layouts=stereo", str(path)])


def make(sh, model):
    slug = sh['slug']; segs = [dict(p) for p in sh['segs']]
    if sh.get('beats'):  # beat-cut: each clip lasts four beats from the song start
        bt = [b for b in BEATS[sh['beats']]['beats'] if b >= sh['music']['from']]
        for k, p in enumerate(segs): p['e'] = p['s'] + bt[4 * k + 4] - bt[4 * k]
    parts, t, booms = [], 0.0, []
    for i, p in enumerate(segs):
        f, d = seg(i, p, slug); parts.append(f)
        if p.get('boom'): booms.append(t)
        t += d
    total = t
    lst = W / f'{slug}.txt'; lst.write_text(''.join(f"file '{p.name}'\n" for p in parts))
    cut = W / f'{slug}-cut.mp4'
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', str(cut)])
    dia = W / f'{slug}-dia.wav'
    run(['ffmpeg', '-v', 'error', '-y', '-i', str(cut), '-vn', '-ac', '2', '-ar', '48000', str(dia)])
    bm = W / 'boom.wav'
    if not bm.exists(): boom(bm)
    m = sh['music']
    ins = ['-i', str(dia), '-ss', f"{m['from']:.3f}", '-t', f'{total:.3f}', '-i', str(MUSIC / m['song'])]
    g = [f"[1:a]aresample=48000,aformat=channel_layouts=stereo,volume={m['gain']},afade=t=in:d=0.2,afade=t=out:st={max(0, total - 0.6):.3f}:d=0.6[m]",
         '[0:a]asplit[d1][d2]', '[m][d1]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[duck]']
    mix = '[duck][d2]'
    for k, at in enumerate(booms):
        ins += ['-i', str(bm)]; g.append(f'[{2 + k}:a]adelay={int(at * 1000)}|{int(at * 1000)}[b{k}]'); mix += f'[b{k}]'
    g.append(f'{mix}amix=inputs={2 + len(booms)}:normalize=0,alimiter=limit=0.95,loudnorm=I=-14:TP=-1.0[out]')
    mixed = W / f'{slug}-mix.wav'
    run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', ';'.join(g), '-map', '[out]', '-t', f'{total:.3f}', '-ar', '48000', str(mixed)])
    ass = W / f'{slug}.ass'; captions(dia, ass, model)
    # hook: up to two lines, marker font, with a slight pop-in
    hook = sh['hook'].split('|'); vf = []
    for k, line in enumerate(hook):
        txt = line.replace("'", '’').replace(':', '\\:')
        y = 190 + k * 130; size = min(108, int(990 / (0.66 * max(1, len(line)))))  # shrink long lines to fit
        vf.append(f"drawtext=fontfile={MARKER}:text='{txt}':fontsize={size}:fontcolor={'white' if k == 0 else '0xFFD84D'}:"
                  f"borderw=9:bordercolor=black:x=(w-text_w)/2:y={y}+30*max(0\\,1-t/0.25)")
    vf.append(f"subtitles={ass}:fontsdir={FONTS}")
    out = OUT / f'{slug}.mp4'
    run(['ffmpeg', '-v', 'error', '-y', '-i', str(cut), '-i', str(mixed), '-map', '0:v', '-map', '1:a', '-vf', ','.join(vf),
         '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', str(out)])
    print('short', slug, f'{total:.1f}s', flush=True)
    return out


if __name__ == '__main__':
    model = None  # --no-captions: local smoke tests without the whisper model
    if '--no-captions' not in sys.argv:
        from faster_whisper import WhisperModel
        model = WhisperModel('small.en', device='cpu', compute_type='int8')
    want = {a for a in sys.argv[2:] if not a.startswith('--')}
    for sh in CFG['shorts']:
        if want and sh['slug'] not in want: continue
        try: make(sh, model)
        except SystemExit as e: print('FAILED short', sh['slug'], e, flush=True)  # keep going with the rest
    (OUT / 'titles.txt').write_text(''.join(f"{s['slug']}: {s['title']}\n" for s in CFG['shorts']))
