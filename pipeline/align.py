"""Force-align a known script to its voiceover.  usage: align.py script.txt voice.mp3 words.json"""
import re, json, wave, sys, subprocess, tempfile, os
from pocketsphinx import Decoder
EXTRA = {  # phonemes for words missing from the CMU dictionary (add more per episode as needed)
 'cryogenically':'K R AY AH JH EH N IH K L IY','cryoprotectant':'K R AY OW P R AH T EH K T AH N T',
 'nanoparticles':'N AE N OW P AA R T IH K AH L Z','rewarmed':'R IY W AO R M D','rewarming':'R IY W AO R M IH NG',
 'vitrification':'V IH T R AH F AH K EY SH AH N','vitrified':'V IH T R AH F AY D',
 'chickenpox':'CH IH K AH N P AA K S','loneliest':'L OW N L IY AH S T','fah':'F AA','hev':'HH EH V','oo':'UW','theh':'DH EH','thoo':'TH UW',
 "bat's":'B AE T S','shhhhh':'SH','slideshow':'S L AY D SH OW','terrifyingly':'T EH R AH F AY IH NG L IY',
 'earbuds':'IH R B AH D Z','gigahertz':'G IH G AH HH ER T S','smartwatch':'S M AA R T W AA CH',
 'windowsill':'W IH N D OW S IH L','soundproof':'S AW N D P R UW F','heatwave':'HH IY T W EY V','ebbinghaus':'EH B IH NG HH AW S',
 'opioids':'OW P IY OY D Z','chilli':'CH IH L IY',"hummingbird's":'HH AH M IH NG B ER D Z','strobing':'S T R OW B IH NG',
 'hibernating':'HH AY B ER N EY T IH NG','hibernates':'HH AY B ER N EY T S','brainwaves':'B R EY N W EY V Z','yimithirr':'Y IH M IH TH IH R',
 'guugu':'G UW G UW','caltech':'K AE L T EH K',"octopus's":'AA K T AH P AH S IH Z','octopuses':'AA K T AH P AH S IH Z',
 "shark's":'SH AA R K S','ampullae':'AE M P UH L IY','wannerton':'W AA N ER T AH N','bouba':'B UW B AH','eilish':'AY L IH SH','synesthesia':'S IH N AH S TH IY ZH AH'}
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
