"""Build one episode end-to-end (no upload).

usage: python3 pipeline/build.py episodes/001-frozen-100-years [--workers 2] [--seconds 20]
outputs: build/<episode>/out/<episode>.mp4, thumbnail.jpg, clips/clip-0N.mp4
"""
import argparse, json, os, subprocess, sys, shutil, math
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument('episode'); ap.add_argument('--workers', type=int, default=os.cpu_count() or 2)
ap.add_argument('--seconds', type=float, default=None, help='only render the first N seconds (test)')
ap.add_argument('--no-clips', action='store_true')
ap.add_argument('--parts-only', action='store_true', help='skip the main video; render only the vertical Part series')
a = ap.parse_args()
EP = os.path.abspath(a.episode); name = os.path.basename(EP)
META = json.load(open(f'{EP}/meta.json'))
B = os.path.join(ROOT, 'build', name); OUT = f'{B}/out'; os.makedirs(f'{OUT}/clips', exist_ok=True)
run = lambda *c, **k: subprocess.run(list(c), check=True, **k)
voice = f'{EP}/{META["voice"]}'

# 1. word timings
if not os.path.exists(f'{EP}/words.json'):
    run(sys.executable, f'{ROOT}/pipeline/align.py', f'{EP}/{META["script"]}', voice, f'{EP}/words.json')
# 2. shot timeline + captions
run(sys.executable, f'{ROOT}/pipeline/plan.py', f'{EP}/words.json', f'{EP}/timeline.json', EP)
TL = json.load(open(f'{EP}/timeline.json'))
dur = min(TL['duration'], a.seconds or 1e9); FPS = 30; N = int(dur * FPS)

def render(tlfile, frames_dir, n, mode, toff=0.0):
    shutil.rmtree(frames_dir, ignore_errors=True); os.makedirs(frames_dir)
    q = math.ceil(n / a.workers); procs = []
    env = dict(os.environ, TLFILE=tlfile, TOFF=str(toff))
    for i in range(a.workers):
        s, e = i * q, min(n, (i + 1) * q)
        if s < e: procs.append(subprocess.Popen(['node', f'{ROOT}/studio/render.js', frames_dir, str(s), str(e), mode], env=env))
    if any(p.wait() for p in procs): raise SystemExit('render failed')

# 3. audio: loudness-normalised voice + soft ambient pad
pad = f'{B}/pad.wav'; mix = f'{B}/mix.wav'
run('ffmpeg', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i',
    "aevalsrc='0.10*sin(2*PI*110*t)*(0.6+0.4*sin(2*PI*0.05*t))+0.07*sin(2*PI*130.81*t)*(0.6+0.4*sin(2*PI*0.037*t+1))"
    "+0.07*sin(2*PI*164.81*t)*(0.6+0.4*sin(2*PI*0.043*t+2))+0.04*sin(2*PI*220*t)*(0.5+0.5*sin(2*PI*0.06*t))'"
    f":s=44100:d={TL['duration']+3}",
    '-af', f"lowpass=f=900,aecho=0.8:0.7:120|240:0.35|0.25,afade=t=in:d=3,afade=t=out:st={TL['duration']-3}:d=5,volume=-14dB", pad)
run('ffmpeg', '-loglevel', 'error', '-y', '-i', voice, '-i', pad, '-filter_complex',
    '[0:a]loudnorm=I=-14:TP=-1.5:LRA=11,apad=pad_dur=2[v];[1:a]volume=4.5[m];[v][m]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89[a]',
    '-map', '[a]', '-ar', '48000', '-c:a', 'pcm_s16le', mix)

# 4. main video (kept ~100 MB so Zapier can move it)
main = f'{OUT}/{name}.mp4'
if a.parts_only: a.no_main = True
frames = f'{B}/frames'
if not getattr(a, 'no_main', False): render(f'{EP}/timeline.json', frames, N, 'land')
if not getattr(a, 'no_main', False):
  run('ffmpeg', '-loglevel', 'error', '-y', '-framerate', str(FPS), '-i', f'{frames}/f%06d.jpg', '-i', mix, '-t', str(dur),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-tune', 'animation', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', main)
  shutil.rmtree(frames)
shutil.copy(f'{EP}/{META["thumbnail"]}', f'{OUT}/thumbnail.jpg')

# 5. vertical clips: the Part series (parts.json) if present, else highlight clips (clips.json)
PARTS = os.path.exists(f'{EP}/parts.json')
if PARTS: shutil.rmtree(f'{OUT}/clips', ignore_errors=True); os.makedirs(f'{OUT}/clips')
if not a.no_clips and (PARTS or os.path.exists(f'{EP}/clips.json')):
    CL = json.load(open(f'{EP}/parts.json' if PARTS else f'{EP}/clips.json'))
    for c in CL:
        if a.seconds and c['s'] > dur: continue
        tl = dict(TL, hook=c['hook'], hook2=c['hook2'])
        if PARTS: tl['part'] = {'n': c['n'], 'N': len(CL), 's': c['s'], 'e': c['e']}
        tlf = f'{B}/tl_clip{c["n"]}.json'; json.dump(tl, open(tlf, 'w'))
        n = int((c['e'] - c['s']) * FPS); cf = f'{B}/clip{c["n"]}'
        render(tlf, cf, n, 'vert', c['s'])
        run('ffmpeg', '-loglevel', 'error', '-y', '-framerate', str(FPS), '-i', f'{cf}/f%06d.jpg', '-ss', str(c['s']), '-t', str(c['e'] - c['s']),
            '-i', mix, '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-tune', 'animation', '-pix_fmt', 'yuv420p',
            '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', f'{OUT}/clips/{"part" if PARTS else "clip"}-{c["n"]:02d}.mp4')
        shutil.rmtree(cf)
print('done:', main if os.path.exists(main) else '(parts only)', f'{os.path.getsize(main)/1e6:.1f} MB' if os.path.exists(main) else '')
