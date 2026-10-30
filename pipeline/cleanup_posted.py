"""Move the Drive video of every already-posted (or replaced) queue row to the trash, then blank its file id.
Only rows with status 'posted' AND a youtube_id, or status 'replaced', are touched; 'ready' rows never are.
Thumbnails are kept (small, and needed if a live thumbnail is swapped later).
Needs env: GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET, GDRIVE_REFRESH_TOKEN.  usage: cleanup_posted.py [--dry-run]"""
import os, sys, requests
DRY = '--dry-run' in sys.argv
CID, CSEC, RTOK = (os.environ[k].strip().strip('"').strip("'") for k in ('GDRIVE_CLIENT_ID', 'GDRIVE_CLIENT_SECRET', 'GDRIVE_REFRESH_TOKEN'))
tok = requests.post('https://oauth2.googleapis.com/token', data={
    'client_id': CID, 'client_secret': CSEC, 'refresh_token': RTOK, 'grant_type': 'refresh_token'}).json()
H = {'Authorization': f'Bearer {tok["access_token"]}'}
API = 'https://www.googleapis.com/drive/v3/files'
SH = 'https://sheets.googleapis.com/v4/spreadsheets'

def find(q):
    r = requests.get(API, headers=H, params={'q': q + ' and trashed = false', 'fields': 'files(id)'}).json()
    return r['files'][0]['id'] if r.get('files') else None
top = find("name = 'Through the Ifglass - Auto' and mimeType = 'application/vnd.google-apps.folder'")
SHEET = find(f"name = 'Ifglass Queue' and '{top}' in parents")

# (tab, file-id column, status column, youtube-id column), 0-based
TABS = [('Sheet1', 4, 6, 7), ('Shorts', 5, 6, 7)]
trashed = cleared = 0
for tab, fcol, scol, ycol in TABS:
    rows = requests.get(f'{SH}/{SHEET}/values/{tab}!A:J', headers=H).json().get('values', [])
    for n, r in enumerate(rows[1:], start=2):
        r = r + [''] * (10 - len(r))
        fid, status, yt = r[fcol].strip(), r[scol].strip().lower(), r[ycol].strip()
        if not fid or not ((status == 'posted' and yt) or status == 'replaced'):
            continue
        label = f'{tab} row {n} ({r[0]} {r[1] if tab == "Shorts" else ""}) {status}'
        if DRY:
            print('would trash', label, fid); continue
        g = requests.patch(f'{API}/{fid}', headers=H, json={'trashed': True})
        if g.status_code in (200, 404):  # 404 = already gone
            trashed += g.status_code == 200
            col = 'ABCDEFGHIJ'[fcol]
            requests.put(f'{SH}/{SHEET}/values/{tab}!{col}{n}?valueInputOption=RAW', headers=H, json={'values': [['']]}).raise_for_status()
            cleared += 1
            print('trashed' if g.status_code == 200 else 'already gone', label)
        else:
            print('skip', label, g.status_code, g.text[:200])
print(f'done: {trashed} files trashed, {cleared} rows cleared' + (' (dry run)' if DRY else ''))
