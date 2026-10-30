"""Upload a finished vlog render to the user's Drive under 'Vlog Edits' (kept apart from the channel folders).

usage: python3 vlog/drive_put.py FILE TITLE   (needs the same GDRIVE_* env as pipeline/drive_upload.py)
"""
import pathlib, sys
src = (pathlib.Path(__file__).resolve().parent.parent / 'pipeline' / 'drive_upload.py').read_text()
exec(src[:src.index("\ntop = folder(")])  # reuse auth + folder() + resumable upload() without running the episode upload
fid = upload(sys.argv[1], sys.argv[2], folder('Vlog Edits'), 'video/mp4')
print(f'uploaded https://drive.google.com/file/d/{fid}/view')
