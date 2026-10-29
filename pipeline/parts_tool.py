"""Helper for the vertical Part series (parts.json).
  python3 pipeline/parts_tool.py list  episodes/<ep>   -> numbered sentences with start times
  python3 pipeline/parts_tool.py check episodes/<ep>   -> validate parts.json
parts.json: [{"n":1,"s":0,"e":44.2,"hook":"WHAT IF YOU COULD","hook2":"SEE WIFI?","title":"... #shorts"}, ...]
Rules: contiguous (part n+1 starts where part n ends), first s = 0, last e = timeline duration,
each part 25-58 s, boundaries just before a sentence start, hooks <= 18 chars per line, title <= 95 chars.
"""
import json, sys, re
cmd, EP = sys.argv[1], sys.argv[2].rstrip('/')
W = json.load(open(f'{EP}/words.json')); TL = json.load(open(f'{EP}/timeline.json'))
def sentences():
    out, cur = [], []
    for i, w in enumerate(W):
        cur.append(i)
        if re.search(r'[.?!]["”]?$|\.\.\.$|…$', w['w']): out.append(cur); cur = []
    if cur: out.append(cur)
    return out
if cmd == 'list':
    print(f'duration (use as last e): {TL["duration"]}')
    for k, s in enumerate(sentences()):
        st = W[s[0]]['s']; cut = max(0, round(st - 0.12, 2))
        print(f'[{k:3d}] start {st:7.2f}  cut-at {cut:7.2f}  ' + ' '.join(W[i]['w'] for i in s))
elif cmd == 'check':
    P = json.load(open(f'{EP}/parts.json')); bad = []
    starts = {max(0, round(W[s[0]]['s'] - 0.12, 2)) for s in sentences()} | {0}
    for i, p in enumerate(P):
        d = p['e'] - p['s']
        if p['n'] != i + 1: bad.append(f'part {i+1}: n should be {i+1}')
        if not 25 <= d <= 58.5: bad.append(f'part {p["n"]}: length {d:.1f}s (need 25-58)')
        if i and abs(p['s'] - P[i-1]['e']) > 1e-6: bad.append(f'part {p["n"]}: not contiguous')
        if round(p['s'], 2) not in starts: bad.append(f'part {p["n"]}: s={p["s"]} is not a cut-at value from list')
        for k in ('hook', 'hook2'):
            if len(p.get(k, '')) > 18: bad.append(f'part {p["n"]}: {k} too long ({len(p[k])} chars)')
            if p.get(k, '') != p.get(k, '').upper(): bad.append(f'part {p["n"]}: {k} must be UPPERCASE')
        if len(p.get('title', '')) > 95 or '#shorts' not in p.get('title', ''): bad.append(f'part {p["n"]}: title missing #shorts or >95 chars')
    if P and P[0]['s'] != 0: bad.append('first part must start at 0')
    if P and abs(P[-1]['e'] - TL['duration']) > 0.01: bad.append(f'last part must end at {TL["duration"]}')
    print('\n'.join(bad) or f'OK: {len(P)} parts, ' + ', '.join(f'{p["e"]-p["s"]:.0f}s' for p in P))
