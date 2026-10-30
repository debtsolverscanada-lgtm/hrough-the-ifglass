"""Google Drive helpers for the vlog tools (same OAuth app and GDRIVE_* env as pipeline/drive_upload.py)."""
import os, requests
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
    """Resumable upload; rides out Google's occasional 5xx / dropped connections by resuming where it stopped."""
    import time
    meta = {'name': title, 'parents': [parent]}
    for attempt in range(5):
        r = requests.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', headers={**H, 'X-Upload-Content-Type': mime}, json=meta)
        if r.status_code < 500: break
        time.sleep(5 * (attempt + 1))
    r.raise_for_status(); url = r.headers['Location']; size = os.path.getsize(path); chunk = 32 * 1024 * 1024
    pos, fails = 0, 0
    with open(path, 'rb') as f:
        while pos < size:
            f.seek(pos); data = f.read(chunk); end = pos + len(data) - 1
            try:
                rr = requests.put(url, headers={'Content-Range': f'bytes {pos}-{end}/{size}'}, data=data, timeout=300)
            except requests.RequestException:
                rr = None
            if rr is not None and rr.status_code in (200, 201): return rr.json()['id']
            if rr is not None and rr.status_code == 308:
                rng = rr.headers.get('Range'); pos = int(rng.split('-')[1]) + 1 if rng else 0; fails = 0; continue
            if rr is not None and rr.status_code < 500 and rr.status_code != 429:
                raise SystemExit(f'upload failed {rr.status_code}: {rr.text[:300]}')
            fails += 1
            if fails > 6: raise SystemExit(f'upload kept failing ({rr.status_code if rr is not None else "connection error"})')
            time.sleep(min(60, 5 * 2 ** fails))
            # ask Google how much it already has, then resume from there
            q = requests.put(url, headers={'Content-Range': f'bytes */{size}'}, timeout=60)
            if q.status_code in (200, 201): return q.json()['id']
            rng = q.headers.get('Range'); pos = int(rng.split('-')[1]) + 1 if (q.status_code == 308 and rng) else 0
    raise SystemExit('upload ended without file id')
