"""Edit a talking-head clip like a TikTok story: the frame keeps moving.
Shots change on phrase breaks (hard cuts between wide / medium / close framings); inside a shot the camera
slow-pushes in, pulls back, pans or tilts up to the face; key words get a quick punch-zoom; a little handheld
drift and roll runs underneath, and some cuts get a 3-frame whip blur.
usage: python3 realme/camera.py IN.mp4 OUT.mp4 [words.json] [WxH]
words.json: [[word, start, end], ...] (from realme/tts.py); without it shots change every ~3 s."""
import cv2, json, math, subprocess, sys, numpy as np
src, out = sys.argv[1], sys.argv[2]
words = json.load(open(sys.argv[3])) if len(sys.argv) > 3 and sys.argv[3] != '-' else []
OW, OH = map(int, (sys.argv[4] if len(sys.argv) > 4 else '1080x1920').split('x'))
cap = cv2.VideoCapture(src); fps = cap.get(cv2.CAP_PROP_FPS) or 25
frames = []
while True:
    ok, f = cap.read()
    if not ok: break
    frames.append(f)
n = len(frames); H, W = frames[0].shape[:2]; dur = n / fps
# where the face is (first frames), so every framing is built around it
det = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
boxes = [b for f in frames[:: max(1, n // 12)] for b in det.detectMultiScale(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY), 1.1, 5, minSize=(W // 6, W // 6))]
if boxes:
    x, y, w, h = max(boxes, key=lambda b: b[2] * b[3]); fx, fy, fw = x + w / 2, y + h / 2, w
else:
    fx, fy, fw = W / 2, H * 0.4, W * 0.45
cover = max(OW / W, OH / H)  # scale at which the source just fills the frame
MED = 0.42 * OW / fw         # medium shot: face about 2/5 of the frame width
print(f'{W}x{H} {n} frames, face at {fx:.0f},{fy:.0f} w{fw:.0f}', flush=True)

# shots: break at gaps / punctuation, 2.2-4 s each
cuts = [0.0]
if words:
    last = 0.0
    for i, (wd, s, e) in enumerate(words):
        gap = words[i + 1][1] - e if i + 1 < len(words) else 0
        if s - cuts[-1] > 2.2 and (wd[-1:] in '.,!?' or gap > 0.18 or s - cuts[-1] > 4): cuts.append(s)
else:
    t = 3.0
    while t < dur - 1: cuts.append(t); t += 3.0
cuts.append(dur + 1)
punches = [s for wd, s, e in words if wd.strip('.,!?').isupper() and len(wd) > 1 or wd.endswith('!') or len(wd.strip('.,!?')) >= 8]
MOVES = ['push', 'close', 'pan', 'pull', 'tilt', 'medium', 'push', 'close']
whips = set(range(2, len(cuts), 3))

def framing(t):
    k = max(i for i, c in enumerate(cuts) if c <= t); a, b = cuts[k], cuts[k + 1]; u = min(1, (t - a) / max(0.5, b - a))
    ease = u * u * (3 - 2 * u); m = MOVES[k % len(MOVES)]
    z, dx, dy = 1.0, 0.0, 0.0   # zoom over the medium framing, offsets in face-widths
    if m == 'push':   z = 0.82 + 0.22 * ease
    if m == 'close':  z = 1.32 + 0.05 * ease
    if m == 'pull':   z = 1.25 - 0.42 * ease
    if m == 'medium': z = 1.0; dx = 0.06 * math.sin(t * 0.9)
    if m == 'pan':    z = 1.08; dx = -0.3 + 0.6 * ease
    if m == 'tilt':   z = 1.1; dy = 0.7 - 0.7 * ease
    for p in punches:  # punch-zoom: snaps in fast, eases back
        if 0 <= t - p < 0.45: z *= 1 + 0.14 * math.exp(-(t - p) * 7) * min(1, (t - p) / 0.05)
    # handheld underneath
    dx += 0.025 * math.sin(t * 1.7) + 0.012 * math.sin(t * 4.3); dy += 0.02 * math.sin(t * 1.3 + 1) + 0.01 * math.sin(t * 5.1)
    rot = 0.4 * math.sin(t * 0.8) + 0.15 * math.sin(t * 2.9)
    return z, dx, dy, rot, k, t - a

enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{OW}x{OH}', '-r', str(fps), '-i', '-',
                        '-i', src, '-map', '0:v', '-map', '1:a?', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
                        '-c:a', 'aac', '-b:a', '192k', '-shortest', out], stdin=subprocess.PIPE)
for i, f in enumerate(frames):
    t = i / fps; z, dx, dy, rot, k, since = framing(t)
    s = MED * z
    cx, cy = fx + dx * fw, fy + dy * fw + 0.35 * fw * (1 - min(z, 1.3) / 1.3)   # eyes sit on the upper third; wider shots show more chest
    if s >= cover:  # no empty edges possible once we're tighter than 'cover': keep the crop inside the picture
        hw, hh = OW / s / 2, OH / s / 2
        cx = min(max(cx, hw), W - hw); cy = min(max(cy, hh), H - hh)
    M = cv2.getRotationMatrix2D((cx, cy), rot, s); M[0, 2] += OW / 2 - cx; M[1, 2] += OH / 2 - cy
    g = cv2.warpAffine(f, M, (OW, OH), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0))
    if s < cover * 1.02:  # wider than the photo: fill the edges with a soft, blurred, enlarged copy (the TikTok look)
        small = cv2.resize(f, (OW // 8, OH // 8)) if False else cv2.resize(f[int(H * 0.05):, :], (OW // 8, int(OW // 8 * (H * 0.95) / W)))
        bg = cv2.resize(small, (OW, OH)); bg = cv2.GaussianBlur(bg, (0, 0), 18); bg = (bg * 0.55).astype(np.uint8)
        mask = cv2.warpAffine(np.full(f.shape[:2], 255, np.uint8), M, (OW, OH), flags=cv2.INTER_LINEAR, borderValue=0)
        mask = cv2.GaussianBlur(mask, (0, 0), 6)[..., None] / 255.0
        g = (g * mask + bg * (1 - mask)).astype(np.uint8)
    if k in whips and since < 3 / fps:  # whip-in: horizontal motion blur for the first frames of the shot
        L = int(60 * (1 - since * fps / 3)) | 1
        kern = np.zeros((1, L), np.float32); kern[0, :] = 1 / L; g = cv2.filter2D(g, -1, kern)
    enc.stdin.write(g.tobytes())
enc.stdin.close(); enc.wait()
print('shots', len(cuts) - 1, 'punches', len(punches))
