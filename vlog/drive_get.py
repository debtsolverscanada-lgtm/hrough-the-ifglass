"""Download every file in 'Vlog Edits/<SUBFOLDER>' (files this app uploaded) into OUTDIR.

usage: python3 vlog/drive_get.py SUBFOLDER OUTDIR   (needs the same GDRIVE_* env as pipeline/drive_upload.py)
"""
import os, pathlib, sys
src = (pathlib.Path(__file__).resolve().parent.parent / 'pipeline' / 'drive_upload.py').read_text()
exec(src[:src.index("\ntop = folder(")])  # reuse auth + find()/folder() helpers
out = pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
sub = find(sys.argv[1], find('Vlog Edits', None, FOLDER), FOLDER) or sys.exit('folder not found')
files = ok(requests.get(API, headers=H, params={'q': f"'{sub}' in parents and trashed = false", 'fields': 'files(id,name,size)', 'pageSize': 200}))['files']
for f in files:
    with requests.get(f"{API}/{f['id']}?alt=media", headers=H, stream=True) as r:
        r.raise_for_status()
        with open(out / f['name'], 'wb') as fh:
            for chunk in r.iter_content(1 << 20): fh.write(chunk)
    print('got', f['name'], f.get('size'))
