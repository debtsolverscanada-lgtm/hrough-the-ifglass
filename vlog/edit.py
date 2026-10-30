"""Render a vlog from an edit decision list (vlog/<id>/edl.json).

Pipeline: every piece is normalised to 1920x1080 30fps / 48k stereo with its effects baked in,
pieces are concatenated, music cues are laid on a separate bed and ducked under the dialogue,
synth SFX are added, then word-by-word captions (transcribed from the cut) are burned in.

usage: python3 vlog/edit.py vlog/vlog01 [--preview SECONDS]
"""
import json, os, subprocess, sys, pathlib, random, shutil

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


def has_audio(p):
    out = run(['ffprobe', '-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', str(p)]).stdout
    return bool(out.strip())


def esc(t):
    return t.replace('\\', '\\\\').replace(':', '\\:').replace("'", "’").replace('%', '\\%')


def title_filter(text, style='lower', start=0.25, dur=3.2):
    """Slide-in title: 'lower' = marker lower-third, 'big' = centred title card."""
    t, e = esc(text), start + dur
    if style == 'big':
        return (f"drawtext=fontfile={MARKER}:text='{t}':fontsize=150:fontcolor=white:borderw=8:bordercolor=black@0.85:"
                f"x=(w-text_w)/2:y=(h-text_h)/2-20+40*max(0\\,1-(t-{start})/0.35):alpha='if(lt(t,{start}),0,min(1,(t-{start})/0.25))*if(gt(t,{e}),max(0,1-(t-{e})/0.3),1)'")
    return (f"drawtext=fontfile={MARKER}:text='{t}':fontsize=64:fontcolor=white:borderw=5:bordercolor=black@0.9:"
            f"x=70-500*max(0\\,1-(t-{start})/0.3):y=h-250:enable='between(t,{start},{e})'")


def piece(i, p):
    """Render one normalised piece -> work/pNNN.mp4. Returns its duration."""
    out = W / f'p{i:03d}.mp4'
    src = HERE / p['asset'] if p.get('asset') else clip(p['clip']); s, e = p['s'], p['e']; speed = p.get('speed', 1.0)
    dur_src = e - s
    vf = [  # fit any orientation onto a blurred 16:9 background
        f"split[fa][fb];[fb]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=28:2[bg];"
        f"[fa]scale=1920:1080:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2", f'fps={FPS}']
    if p.get('zoom'):  # punch-in
        z = p['zoom']; vf.append(f'scale={int(1920*z)}:{int(1080*z)},crop=1920:1080')
    if p.get('reverse'): vf.append('reverse')
    if speed != 1.0: vf.append(f'setpts=PTS/{speed}')
    vf += [GRADE, GRAIN]
    if p.get('letterbox'): vf.append(LETTERBOX)
    if p.get('vhs'):
        vf += ['scale=960:540,scale=1920:1080:flags=bilinear', 'rgbashift=rh=7:bh=-7:gv=2', 'noise=alls=28:allf=t',
               'eq=saturation=1.35:contrast=1.15',
               f"drawtext=fontfile={BOLD}:text='<< REWIND':fontsize=72:fontcolor=white:x=80:y=70:alpha='if(lt(mod(t,0.5),0.3),1,0)'",
               f"drawtext=fontfile={BOLD}:text='%{{pts\\:hms}}':fontsize=56:fontcolor=white:x=w-tw-80:y=h-120"]
    if p.get('flash'): vf.append('fade=t=in:st=0:d=0.12:color=white')
    for tt in p.get('titles', []): vf.append(title_filter(tt['text'], tt.get('style', 'lower'), tt.get('at', 0.25), tt.get('dur', 3.2)))
    if p.get('freeze'): vf.append(f"tpad=stop_mode=clone:stop_duration={p['freeze']}")
    vf.append('format=yuv420p')
    out_dur = dur_src / speed + p.get('freeze', 0)
    af = ['aresample=48000', 'aformat=channel_layouts=stereo']
    if p.get('reverse'): af.append('areverse')
    if speed != 1.0:
        sp = speed; chain = []
        while sp > 2.0: chain.append('atempo=2.0'); sp /= 2.0
        chain.append(f'atempo={sp:.4f}'); af += chain
    af.append(f"volume={p.get('vol', 1.0)}")
    if p.get('mute'): af.append('volume=0')
    if p.get('freeze'): af.append(f"apad=pad_dur={p['freeze']}")
    af += [f'atrim=0:{out_dur:.3f}', 'afade=t=in:d=0.02', f'afade=t=out:st={max(0, out_dur - 0.03):.3f}:d=0.03']
    inputs = ['-ss', f'{s:.3f}', '-t', f'{dur_src:.3f}', '-i', str(src)]
    if has_audio(src):
        graph = f"[0:v]{vf[0]}[v0];[v0]{','.join(vf[1:])}[v];[0:a:0]{','.join(af)}[a]"
        amap = ['-map', '[v]', '-map', '[a]']
    else:
        inputs += ['-f', 'lavfi', '-t', f'{out_dur:.3f}', '-i', 'anullsrc=r=48000:cl=stereo']
        graph = f"[0:v]{vf[0]}[v0];[v0]{','.join(vf[1:])}[v]"
        amap = ['-map', '[v]', '-map', '1:a']
    run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', graph, *amap,
         '-t', f'{out_dur:.3f}', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-r', str(FPS),
         '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', str(out)])
    return out_dur


def expand(edl):
    """Turn the high-level sections into a flat list of pieces with timeline info."""
    pieces, cues, sfx, t = [], [], [], 0.0
    def add(p):
        nonlocal t
        p['_t'] = t; pieces.append(p)
        t += (p['e'] - p['s']) / p.get('speed', 1.0) + p.get('freeze', 0)
    for sec in edl['sections']:
        kind = sec['type']
        if kind == 'hikids':  # accelerating supercut with punch-ins and flashes
            n = len(sec['clips'])
            for k, (c, s, e) in enumerate(sec['clips']):
                sp = 1.0 + 0.6 * k / max(1, n - 1)
                sfx.append(('whoosh', t)); add({'clip': c, 's': s, 'e': e, 'speed': round(sp, 3), 'zoom': 1.0 + 0.12 * (k % 2), 'flash': True})
        elif kind == 'teaser':  # beat-cut highlights on a song drop, letterboxed, ends on a freeze
            song = sec['song']; beats = [b for b in BEATS[song]['beats'] if b >= sec['song_from']]
            per = sec.get('beats_per_cut', 2); t0 = t
            cues.append({'song': song, 'at': t0, 'from': beats[0], 'dur': None, 'gain': sec.get('gain', 0.9), 'tag': 'teaser'})
            sec['_pieces'] = []
            for k, (c, s) in enumerate(sec['clips']):
                d = beats[(k + 1) * per] - beats[k * per]
                p = {'clip': c, 's': s, 'e': s + d, 'letterbox': True, 'mute': True}
                if k == len(sec['clips']) - 1: p['freeze'] = sec.get('freeze', 0.7)
                add(p); sec['_pieces'].append(dict(p))
            cues[-1]['dur'] = t - t0
            sfx.append(('scratch', t - sec.get('freeze', 0.7)))
        elif kind == 'rewind':  # replay the teaser backwards, fast, VHS
            teaser = next(s for s in edl['sections'] if s['type'] == 'teaser')
            sfx.append(('rewind', t))
            for p in reversed(teaser['_pieces']):
                add({'clip': p['clip'], 's': p['s'], 'e': p['e'], 'reverse': True, 'speed': sec.get('speed', 3.0), 'vhs': True, 'mute': True})
        elif kind == 'scenes':
            if sec.get('music'):
                m = sec['music']; cues.append({'song': m['song'], 'at': t, 'from': m.get('from', 0), 'dur': None, 'gain': m.get('gain', 0.35), 'tag': 'bed'})
            for p in sec['clips']:
                add(dict(p))
            if sec.get('music'): cues[-1]['dur'] = t - cues[-1]['at']
    return pieces, cues, sfx, t


def synth_sfx(kind, out):
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
    lst = W / 'list.txt'; lst.write_text(''.join(f"file 'p{i:03d}.mp4'\n" for i in range(len(pieces))))
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', str(W / 'cut.mp4')])
    run(['ffmpeg', '-v', 'error', '-y', '-i', str(W / 'cut.mp4'), '-vn', '-ac', '2', '-ar', '48000', str(W / 'dialogue.wav')])
    # music bed
    ins, parts = [], []
    for k, c in enumerate([c for c in cues if c['at'] < total]):
        dur = min(c['dur'], total - c['at'])
        ins += ['-ss', f"{c['from']:.3f}", '-t', f'{dur:.3f}', '-i', str(MUSIC / c['song'])]
        parts.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,volume={c['gain']},afade=t=in:d=0.3,"
                     f"afade=t=out:st={max(0, dur - 0.8):.3f}:d=0.8,adelay={int(c['at']*1000)}|{int(c['at']*1000)}[m{k}]")
    n = len(parts)
    for k, (kind, at) in enumerate(s for s in sfx if s[1] < total):
        f = W / f'sfx_{kind}.wav'
        if not f.exists(): synth_sfx(kind, f)
        ins += ['-i', str(f)]; parts.append(f"[{n + k}:a]adelay={int(at*1000)}|{int(at*1000)}[s{k}]")
    ns = len(parts) - n
    def bed(prefix, k0, cnt, out):  # mix a set of delayed inputs into one track (silence if none)
        if not cnt:
            run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-t', f'{total:.3f}', '-i', 'anullsrc=r=48000:cl=stereo', str(out)]); return
        g = ';'.join(parts[k0:k0 + cnt]) + ';' + ''.join(f'[{prefix}{k}]' for k in range(cnt)) + f'amix=inputs={cnt}:normalize=0,apad[o]'
        run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', g, '-map', '[o]', '-t', f'{total:.3f}', '-ar', '48000', '-ac', '2', str(out)])
    bed('m', 0, n, W / 'music.wav'); bed('s', n, ns, W / 'sfx.wav')
    # duck music under dialogue, then mix
    run(['ffmpeg', '-v', 'error', '-y', '-i', str(W / 'music.wav'), '-i', str(W / 'dialogue.wav'), '-i', str(W / 'sfx.wav'), '-filter_complex',
         '[1:a]asplit[d1][d2];[0:a][d1]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[duck];'
         '[duck][d2][2:a]amix=inputs=3:normalize=0,alimiter=limit=0.95,loudnorm=I=-14:TP=-1.0:LRA=11[out]',
         '-map', '[out]', '-ar', '48000', str(W / 'mix.wav')])
    captions(W / 'dialogue.wav', W / 'caps.ass')
    out = D / ('preview.mp4' if PREVIEW else 'vlog.mp4')
    run(['ffmpeg', '-v', 'error', '-y', '-i', str(W / 'cut.mp4'), '-i', str(W / 'mix.wav'), '-map', '0:v', '-map', '1:a',
         '-vf', f"subtitles={W / 'caps.ass'}:fontsdir={FONTS}", '-c:v', 'libx264', '-preset', 'fast', '-crf', '20',
         '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', str(out)])
    print('done', out, f'{out.stat().st_size/1e6:.0f} MB')


if __name__ == '__main__':
    main()
