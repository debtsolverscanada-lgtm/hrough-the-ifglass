"""Vlog ingest: metadata, word-level transcript, loudness curve and frame sheet for every raw clip.
Usage: python3 vlog/ingest.py <raw_dir> <out_dir>"""
import json, os, subprocess, sys, pathlib
import numpy as np

RAW, OUT = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)
VIDEO = {'.mov', '.mp4', '.m4v', '.mkv', '.avi', '.3gp', '.hevc', '.webm'}
clips = sorted(p for p in RAW.rglob('*') if p.suffix.lower() in VIDEO)
print(f'{len(clips)} clips')

from faster_whisper import WhisperModel
model = WhisperModel(os.environ.get('WHISPER_MODEL', 'small.en'), device='cpu', compute_type='int8')

def probe(p):
    j = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', str(p)],
                                  capture_output=True, text=True).stdout or '{}')
    tags = {k.lower(): v for k, v in (j.get('format', {}).get('tags') or {}).items()}
    v = next((s for s in j.get('streams', []) if s.get('codec_type') == 'video'), {})
    rot = 0
    for sd in v.get('side_data_list', []) or []:
        if 'rotation' in sd: rot = int(sd['rotation'])
    rot = rot or int((v.get('tags') or {}).get('rotate', 0))
    return {
        'created': tags.get('com.apple.quicktime.creationdate') or tags.get('creation_time'),
        'location': tags.get('com.apple.quicktime.location.iso6709') or tags.get('location'),
        'device': tags.get('com.apple.quicktime.model'),
        'duration': float(j.get('format', {}).get('duration', 0)),
        'w': v.get('width'), 'h': v.get('height'), 'rotation': rot,
        'fps': v.get('avg_frame_rate'), 'codec': v.get('codec_name'),
        'has_audio': any(s.get('codec_type') == 'audio' for s in j.get('streams', [])),
    }

index = []
for i, p in enumerate(clips, 1):
    cid = f'c{i:03d}'
    meta = probe(p)
    meta.update(id=cid, file=str(p.relative_to(RAW)), size_mb=round(p.stat().st_size / 1e6, 1))
    print(cid, meta['file'], meta['duration'], meta['created'], flush=True)
    words, segs, loud = [], [], []
    if meta['has_audio'] and meta['duration'] > 0:
        wav = OUT / f'{cid}.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(p), '-vn', '-ac', '1', '-ar', '16000', str(wav)])
        a = np.fromfile(wav, dtype=np.int16)[22:].astype(np.float32) / 32768
        hop = 1600  # 0.1 s
        loud = [round(float(20 * np.log10(np.sqrt(np.mean(a[k:k + hop] ** 2)) + 1e-6)), 1) for k in range(0, len(a), hop)]
        s_iter, _ = model.transcribe(a, word_timestamps=True, vad_filter=True, language='en',
                                     initial_prompt='hi kids. Hi kids! New York, NYC.')
        for s in s_iter:
            segs.append({'s': round(s.start, 2), 'e': round(s.end, 2), 't': s.text.strip()})
            words += [{'w': w.word.strip(), 's': round(w.start, 2), 'e': round(w.end, 2), 'p': round(w.probability, 2)} for w in (s.words or [])]
        wav.unlink()
    # frame sheet: up to 12 frames evenly spaced
    n = 12 if meta['duration'] > 6 else max(2, int(meta['duration'] * 2))
    step = max(meta['duration'] / n, 0.1)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(p), '-vf',
                    f"fps=1/{step:.3f},scale=320:320:force_original_aspect_ratio=decrease,pad=320:320:(ow-iw)/2:(oh-ih)/2,"
                    f"drawtext=text='{cid} %{{pts\\:hms}}':x=4:y=4:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.6,tile=6x2",
                    '-frames:v', '1', '-q:v', '5', str(OUT / f'{cid}.jpg')])
    json.dump({'meta': meta, 'segments': segs, 'words': words, 'loudness_db_10hz': loud},
              open(OUT / f'{cid}.json', 'w'))
    index.append(meta)

index.sort(key=lambda m: (m['created'] or '9999', m['file']))
json.dump(index, open(OUT / 'index.json', 'w'), indent=1)
print('done', len(index))
