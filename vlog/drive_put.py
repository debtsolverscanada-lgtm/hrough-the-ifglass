"""Upload a file (finished vlog render, Short, or private input) to the user's Drive under 'Vlog Edits' (kept apart from the channel folders).

usage: python3 vlog/drive_put.py FILE TITLE [SUBFOLDER]   (needs the same GDRIVE_* env as pipeline/drive_upload.py)
"""
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from gdrive import *  # auth, find(), folder(), upload()
dest = folder('Vlog Edits')
if len(sys.argv) > 3: dest = folder(sys.argv[3], dest)
import mimetypes
fid = upload(sys.argv[1], sys.argv[2], dest, mimetypes.guess_type(sys.argv[2])[0] or 'application/octet-stream')
print(f'uploaded https://drive.google.com/file/d/{fid}/view')
