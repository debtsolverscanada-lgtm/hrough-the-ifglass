"""Upload a finished vlog render to the user's Drive under 'Vlog Edits' (kept apart from the channel folders).

usage: python3 vlog/drive_put.py FILE TITLE [SUBFOLDER]   (needs the same GDRIVE_* env as pipeline/drive_upload.py)
"""
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from gdrive import *  # auth, find(), folder(), upload()
dest = folder('Vlog Edits')
if len(sys.argv) > 3: dest = folder(sys.argv[3], dest)
fid = upload(sys.argv[1], sys.argv[2], dest, 'video/mp4')
print(f'uploaded https://drive.google.com/file/d/{fid}/view')
