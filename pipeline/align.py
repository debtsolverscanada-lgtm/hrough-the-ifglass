"""Force-align a known script to its voiceover.  usage: align.py script.txt voice.mp3 words.json"""
import re, json, wave, sys, subprocess, tempfile, os
from pocketsphinx import Decoder
EXTRA = {  # phonemes for words missing from the CMU dictionary (add more per episode as needed)
 'cryogenically':'K R AY AH JH EH N IH K L IY','cryoprotectant':'K R AY OW P R AH T EH K T AH N T',
 'nanoparticles':'N AE N OW P AA R T IH K AH L Z','rewarmed':'R IY W AO R M D','rewarming':'R IY W AO R M IH NG',
 'vitrification':'V IH T R AH F AH K EY SH AH N','vitrified':'V IH T R AH F AY D',
 'chickenpox':'CH IH K AH N P AA K S','loneliest':'L OW N L IY AH S T','fah':'F AA','hev':'HH EH V','oo':'UW','theh':'DH EH','thoo':'TH UW'}
script, audio, out = sys.argv[1:4]
src = open(script).read()
disp = []
for tok in re.sub(r'<[^>]+>|\[[^\]]+\]', ' ', src).split():
    for part in tok.split('-'):
        n = re.sub(r"[^a-z']", '', part.lower())
        if n: disp.append((part, n))
wav = os.path.join(tempfile.mkdtemp(), 'vo16k.wav')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', audio, '-ar', '16000', '-ac', '1', wav], check=True)
d = Decoder(samprate=16000, bestpath=False)
for w, p in EXTRA.items(): d.add_word(w, p, True)
d.set_align_text(' '.join(n for _, n in disp))
w = wave.open(wav, 'rb'); data = w.readframes(w.getnframes())
d.start_utt(); d.process_raw(data, full_utt=True); d.end_utt()
seg = [(re.sub(r'\(\d+\)$', '', s.word), s.start_frame / 100, (s.end_frame + 1) / 100) for s in d.seg()]
words = [x for x in seg if x[0] not in ('<s>', '</s>', '<sil>', '[NOISE]')]
res, j = [], 0
for shown, n in disp:
    while j < len(words) and words[j][0] != n: j += 1
    if j < len(words): res.append({'w': shown, 's': words[j][1], 'e': words[j][2]}); j += 1
    else: raise SystemExit(f'alignment lost at word: {shown}')
json.dump(res, open(out, 'w'))
print(f'aligned {len(res)} words, last ends at {res[-1]["e"]:.2f}s')
