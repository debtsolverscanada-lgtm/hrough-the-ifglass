"""Upload a built episode to Google Drive and queue it for the auto-post Zap.

Needs env: GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET, GDRIVE_REFRESH_TOKEN (OAuth, scope drive.file).
With drive.file the app can only see files/folders it created itself, so on first run it creates:
  "Through the Ifglass - Auto" / Ready, Posted, Clips   and the "Ifglass Queue" spreadsheet.
usage: python3 pipeline/drive_upload.py episodes/001-frozen-100-years
"""
import json, os, sys, datetime, requests
EP = os.path.abspath(sys.argv[1]); name = os.path.basename(EP)
TEST = '--test' in sys.argv  # upload to a Test folder, never queue
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
META = json.load(open(f'{EP}/meta.json')); OUT = f'{ROOT}/build/{name}/out'
CID, CSEC, RTOK = (os.environ[k].strip().strip('"').strip("'") for k in ('GDRIVE_CLIENT_ID', 'GDRIVE_CLIENT_SECRET', 'GDRIVE_REFRESH_TOKEN'))
tok = requests.post('https://oauth2.googleapis.com/token', data={
    'client_id': CID, 'client_secret': CSEC, 'refresh_token': RTOK, 'grant_type': 'refresh_token'}).json()
if 'access_token' not in tok:
    # safe diagnostics: shapes only, never the values
    print('client_id  : len', len(CID), '| ends with .apps.googleusercontent.com:', CID.endswith('.apps.googleusercontent.com'))
    print('secret     : len', len(CSEC), '| starts with GOCSPX-:', CSEC.startswith('GOCSPX-'))
    print('refresh tok: len', len(RTOK), '| starts with 1//:', RTOK.startswith('1//'))
    raise SystemExit(f'token error: {tok}')
H = {'Authorization': f'Bearer {tok["access_token"]}'}
API = 'https://www.googleapis.com/drive/v3/files'
FOLDER = 'application/vnd.google-apps.folder'

def ok(r):
    """Return JSON or stop with Google's actual error message."""
    if r.status_code >= 400:
        try: err = r.json().get('error', {}); msg = err.get('message', r.text)
        except Exception: msg = r.text
        raise SystemExit(f'Google API error {r.status_code}: {msg[:500]}')
    return r.json()

def find(title, parent=None, mime=None):
    q = [f"name = '{title}'", 'trashed = false'] + ([f"'{parent}' in parents"] if parent else []) + ([f"mimeType = '{mime}'"] if mime else [])
    r = ok(requests.get(API, headers=H, params={'q': ' and '.join(q), 'fields': 'files(id)'}))
    return r['files'][0]['id'] if r.get('files') else None

def folder(title, parent=None):
    fid = find(title, parent, FOLDER)
    if fid: return fid
    body = {'name': title, 'mimeType': FOLDER, **({'parents': [parent]} if parent else {})}
    return ok(requests.post(API, headers=H, json=body))['id']

def upload(path, title, parent, mime):
    meta = {'name': title, 'parents': [parent]}
    r = requests.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', headers={**H, 'X-Upload-Content-Type': mime}, json=meta)
    r.raise_for_status(); url = r.headers['Location']; size = os.path.getsize(path); chunk = 32 * 1024 * 1024
    with open(path, 'rb') as f:
        pos = 0
        while pos < size:
            data = f.read(chunk); end = pos + len(data) - 1
            rr = requests.put(url, headers={'Content-Range': f'bytes {pos}-{end}/{size}'}, data=data)
            if rr.status_code in (200, 201): return rr.json()['id']
            if rr.status_code != 308: raise SystemExit(f'upload failed {rr.status_code}: {rr.text[:300]}')
            pos = end + 1
    raise SystemExit('upload ended without file id')

top = folder('Through the Ifglass - Auto'); ready = folder('Test' if TEST else 'Ready', top); folder('Posted', top)
clips_dir = folder(name, folder('Clips', top))
vid = upload(f'{OUT}/{name}.mp4', f'{name}.mp4', ready, 'video/mp4')
th = upload(f'{OUT}/thumbnail.jpg', f'{name}-thumbnail.jpg', ready, 'image/jpeg')
for c in sorted(os.listdir(f'{OUT}/clips')) if os.path.isdir(f'{OUT}/clips') else []:
    upload(f'{OUT}/clips/{c}', c, clips_dir, 'video/mp4')

if TEST:
    print(f'TEST upload ok: video {vid}, thumbnail {th} (not queued)'); sys.exit(0)

# queue sheet (created by this app so drive.file can edit it)
SHEET = find('Ifglass Queue', top, 'application/vnd.google-apps.spreadsheet')
cols = ['episode', 'title', 'description', 'tags', 'video_file_id', 'thumbnail_file_id', 'status', 'youtube_id', 'added_at']
if not SHEET:
    SHEET = ok(requests.post(API, headers=H, json={'name': 'Ifglass Queue', 'mimeType': 'application/vnd.google-apps.spreadsheet', 'parents': [top]}))['id']
    requests.put(f'https://sheets.googleapis.com/v4/spreadsheets/{SHEET}/values/A1:I1?valueInputOption=RAW', headers=H, json={'values': [cols]}).raise_for_status()
row = [META['episode'], META['title'], META['description'], ', '.join(META['tags']), vid, th, 'ready', '', datetime.datetime.utcnow().isoformat(timespec='seconds') + 'Z']
requests.post(f'https://sheets.googleapis.com/v4/spreadsheets/{SHEET}/values/A:I:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS', headers=H, json={'values': [row]}).raise_for_status()
print(f'queued episode {META["episode"]}: video {vid}, thumbnail {th}, sheet {SHEET}')
