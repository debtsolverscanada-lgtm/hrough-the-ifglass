"""Measure one reference video for private style study (results are sealed before they leave the runner).

usage: python3 study/measure.py VIDEO OUT_DIR
writes OUT_DIR/{meta.json, words.json, motion.csv, loud.csv, sheets/*.jpg, hook/*.jpg}
"""
import json, os, subprocess, sys
import numpy as np

src, out = sys.argv[1], sys.argv[2]
os.makedirs(f'{out}/sheets', exist_ok=True); os.makedirs(f'{out}/hook', exist_ok=True)
run = lambda *a: subprocess.run(a, check=True, capture_output=True, text=True).stdout
pr = json.loads(run('ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', src))
v = next(s for s in pr['streams'] if s['codec_type'] == 'video')
W, H = int(v['width']), int(v['height']); dur = float(pr['format']['duration'])
fps = eval(v['avg_frame_rate'])
long = dur > 180

# --- picture: per-frame motion + colour at 96px wide grey/hsv (whole video for shorts, first 6 min for long ones)
lim = dur if not long else 360
w = 96; h = int(round(H * w / W / 2)) * 2
raw = subprocess.run(['ffmpeg', '-v', 'error', '-t', str(lim), '-i', src, '-vf', f'scale={w}:{h}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                     check=True, capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3).astype(np.float32) / 255
lum = fr @ np.array([.2126, .7152, .0722], np.float32)
mx, mn = fr.max(-1), fr.min(-1); sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
diff = np.r_[0, np.abs(np.diff(lum, axis=0)).mean((1, 2))]
# global shift estimate (camera move) via phase correlation on consecutive frames
def shift(a, b):
    F = np.fft.fft2(a - a.mean()) * np.conj(np.fft.fft2(b - b.mean())); r = np.fft.ifft2(F / (np.abs(F) + 1e-6)).real
    y, x = np.unravel_index(r.argmax(), r.shape); y = y - h if y > h // 2 else y; x = x - w if x > w // 2 else x
    return float(np.hypot(x, y)) * W / w
mov = [0.0] + [shift(lum[i], lum[i - 1]) for i in range(1, len(lum))]
with open(f'{out}/motion.csv', 'w') as f:
    f.write('frame,t,lum_mean,lum_std,sat_mean,absdiff,shift_px_full\n')
    for i in range(len(lum)):
        f.write(f'{i},{i / fps:.3f},{lum[i].mean():.4f},{lum[i].std():.4f},{sat[i].mean():.4f},{diff[i]:.4f},{mov[i]:.2f}\n')

cuts = [float(l.split('pts_time:')[1].split()[0]) for l in subprocess.run(
    ['ffmpeg', '-v', 'info', '-t', str(lim), '-i', src, '-vf', "select='gt(scene,0.32)',showinfo", '-f', 'null', '-'],
    capture_output=True, text=True).stderr.splitlines() if 'pts_time:' in l]

# --- sound: loudness summary + 50 ms RMS profile (dBFS)
eb = subprocess.run(['ffmpeg', '-v', 'info', '-i', src, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
summ = eb[eb.rfind('Summary:'):]
pcm = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'],
                                   check=True, capture_output=True).stdout, np.int16).astype(np.float32) / 32768
n = 800; k = len(pcm) // n; rms = 20 * np.log10(np.sqrt((pcm[:k * n].reshape(k, n) ** 2).mean(1)) + 1e-6)
with open(f'{out}/loud.csv', 'w') as f:
    f.write('t,rms_db\n'); [f.write(f'{i * .05:.2f},{r:.1f}\n') for i, r in enumerate(rms)]

# --- words with timings
from faster_whisper import WhisperModel
m = WhisperModel('small.en', device='cpu', compute_type='int8')
segs, _ = m.transcribe(src, word_timestamps=True, vad_filter=False, beam_size=1)
words = [{'w': x.word.strip(), 's': round(x.start, 2), 'e': round(x.end, 2)} for s in segs for x in s.words]
json.dump(words, open(f'{out}/words.json', 'w'), indent=0)

# --- frames: hook (first 6 s at 10 fps) + whole video sheets (2 fps shorts / 1 per 4 s long)
subprocess.run(['ffmpeg', '-v', 'error', '-t', '6', '-i', src, '-vf',
                "fps=10,scale=216:-2,drawtext=text='%{pts\\:hms}':x=3:y=3:fontsize=13:fontcolor=white:box=1:boxcolor=black@0.6,tile=10x2",
                '-q:v', '5', f'{out}/hook/hook_%02d.jpg'], check=True)
rate = '2' if not long else '1/4'
subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-vf',
                f"fps={rate},scale=180:-2,drawtext=text='%{{pts\\:hms}}':x=3:y=3:fontsize=12:fontcolor=white:box=1:boxcolor=black@0.6,tile=10x4",
                '-q:v', '6', f'{out}/sheets/s_%03d.jpg'], check=True)

wg = [words[i + 1]['s'] - words[i]['e'] for i in range(len(words) - 1)]
speech = (words[-1]['e'] - words[0]['s']) if words else 0
mv = np.array(mov)
meta = dict(file=os.path.basename(src), w=W, h=H, fps=round(fps, 3), dur=round(dur, 2), measured_s=round(min(lim, dur), 1),
            cuts=[round(c, 2) for c in cuts], cuts_per_min=round(len(cuts) / min(lim, dur) * 60, 1),
            first_word_s=words[0]['s'] if words else None, n_words=len(words),
            words_per_s=round(len(words) / speech, 2) if speech else None,
            pause_total_over_0_25s=round(sum(g for g in wg if g > .25), 2), longest_pause=round(max(wg), 2) if wg else None,
            hold_share=round(float((mv < 1).mean()), 3), move_p90_px=round(float(np.percentile(mv, 90)), 1),
            lum_median=round(float(np.median(lum.mean((1, 2)))), 3), sat_median=round(float(np.median(sat.mean((1, 2)))), 3),
            loudness_summary=summ.strip(), first6s_text=' '.join(x['w'] for x in words if x['s'] < 6))
json.dump(meta, open(f'{out}/meta.json', 'w'), indent=1)
print(json.dumps({k: meta[k] for k in ('file', 'dur', 'cuts_per_min', 'words_per_s', 'first_word_s', 'hold_share')}))
