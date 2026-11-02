"""Download a Drive file by id with the app's own login (not a public link, so the public 'too many downloads' quota
doesn't apply). usage: python3 vlog/drive_fetch.py FILE_ID OUT  (needs the GDRIVE_* env)"""
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from gdrive import *  # auth headers H, API
fid, out = sys.argv[1], sys.argv[2]
with requests.get(f'{API}/{fid}', headers=H, params={'alt': 'media', 'supportsAllDrives': 'true', 'acknowledgeAbuse': 'true'}, stream=True, timeout=600) as r:
    if r.status_code != 200: sys.exit(f'drive api {r.status_code}: {r.text[:300]}')
    with open(out, 'wb') as fh:
        for chunk in r.iter_content(8 << 20): fh.write(chunk)
print('got', out, pathlib.Path(out).stat().st_size)
