"""Build both vlog thumbnails from picked frames.
spec (vlog/<id>/thumb.json):
 {"raw": "raw", "A": {"bg": ["C0045.MP4", 12.3], "title": "hi kids", "sticker": "NYC",
                       "cuts": [{"clip": "C0021.MP4", "t": 4.2, "x": 330, "h": 600, "crop": [x,y,w,h]?}]},
  "B": {"photos": [{"clip": "...", "t": 1.0, "x":60,"y":70,"w":430,"h":540,"rot":-4,"tape":1}],
        "t1": {...}, "t2": {...}}}
usage: python3 vlog/thumb/make.py vlog/<id>  -> vlog/<id>/thumb-A.jpg, thumb-B.jpg (+ phone-size preview)"""
import json, os, subprocess, sys, pathlib
D = pathlib.Path(sys.argv[1]).resolve(); spec = json.load(open(D / 'thumb.json'))
RAW = pathlib.Path(spec.get('raw', 'raw')).resolve(); W = D / 'thumbwork'; W.mkdir(exist_ok=True)
HERE = pathlib.Path(__file__).resolve().parent

def find(name):
    return next(RAW.rglob(name))
def frame(clip, t, crop=None):
    out = W / f'{pathlib.Path(clip).stem}_{t:.2f}.png'
    if not out.exists():
        vf = ['-vf', f'crop={crop[2]}:{crop[3]}:{crop[0]}:{crop[1]}'] if crop else []
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', str(find(clip)), '-frames:v', '1', *vf, str(out)], check=True)
    return out
def cutout(png):
    out = png.with_name(png.stem + '_cut.png')
    if not out.exists():
        from rembg import remove, new_session
        from PIL import Image
        im = remove(Image.open(png), session=new_session('isnet-general-use'))
        im.crop(im.getbbox()).save(out)
    return out

cfg = {}
if 'A' in spec:
    a = spec['A']
    cfg['A'] = {'bg': 'file://' + str(frame(*a['bg'])), 'title': a.get('title', 'hi kids'), 'sticker': a.get('sticker', 'NYC'),
                'cuts': [{**c, 'src': 'file://' + str(frame(c['clip'], c['t'], c.get('crop')) if c.get('card') else cutout(frame(c['clip'], c['t'], c.get('crop'))))} for c in a['cuts']]}
if 'B' in spec:
    b = spec['B']
    cfg['B'] = {'photos': [{**p, 'src': 'file://' + str(frame(p['clip'], p['t'], p.get('crop')))} for p in b['photos']],
                't1': b['t1'], 't2': b['t2']}
for v in [k for k in ('A', 'B') if k in cfg]:
    json.dump({**cfg, 'v': v}, open(W / f'{v}.json', 'w'))
    subprocess.run(['node', str(HERE / 'render.js'), str(W / f'{v}.json'), str(D / f'thumb-{v}.jpg')], check=True)
# phone-size preview: how it looks in the feed
ins = [str(D / f'thumb-{v}.jpg') for v in ('A', 'B') if v in cfg]
subprocess.run(['ffmpeg', '-v', 'error', '-y', *sum([['-i', i] for i in ins], []), '-filter_complex',
                ''.join(f'[{i}]scale=360:-1[s{i}];' for i in range(len(ins))) + ''.join(f'[s{i}]' for i in range(len(ins))) + f'hstack={len(ins)}' if len(ins) > 1 else '[0]scale=360:-1',
                str(D / 'thumb-phone-preview.jpg')], check=True)
print('thumbnails:', ins)
