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
 "shark's":'SH AA R K S','ampullae':'AE M P UH L IY','wannerton':'W AA N ER T AH N','bouba':'B UW B AH','eilish':'AY L IH SH','synesthesia':'S IH N AH S TH IY ZH AH',
 'compressions':'K AH M P R EH SH AH N Z', 'duvet':'D UW V EY', "glint's":'G L IH N T S', 'kneels':'N IY L Z', 'osei':'OW S EY', "osei's":'OW S EY Z', 'rewires':'R IY W AY ER Z', 'centrepiece':'S EH N T ER P IY S', 'haldane':'HH AO L D EY N', "kai's":'K AY Z', 'shrews':'SH R UW Z', 'stretchy':'S T R EH CH IY', 'swivelled':'S W IH V AH L D', 'whirs':'W ER Z', 'bonks':'B AA NG K S', 'maths':'M AE TH S', 'streetlights':'S T R IY T L AY T S', 'fizzes':'F IH Z IH Z', 'yelps':'Y EH L P S', 'fibbing':'F IH B IH NG', 'fiddly':'F IH D L IY', 'flattens':'F L AE T AH N Z', 'proprioception':'P R OW P R IY OW S EH P SH AH N', 'doorframe':'D AO R F R EY M', 'glymphatic':'G L IH M F AE T IH K', 'mews':'M Y UW Z', 'microsleep':'M AY K R OW S L IY P', 'nightie':'N AY T IY', 'sleepier':'S L IY P IY ER', 'throbs':'TH R AA B Z', 'brithday':'B R IH TH D EY', 'creaks':'K R IY K S', 'reran':'R IY R AE N', 'rewinds':'R IY W AY N D Z', 'faints':'F EY N T S', "lorry's":'L AO R IY Z', 'roadworks':'R OW D W ER K S', 'scrubs':'S K R AH B Z', 'steadies':'S T EH D IY Z', 'codas':'K OW D AH Z', 'croaks':'K R OW K S', 'hoodie':'HH UH D IY', "marzluff's":'M AA R Z L AH F S', 'meowing':'M IY AW IH NG', 'mobbing':'M AA B IH NG', 'slobodchikoff':'S L OW B AA D CH IH K AO F', 'squints':'S K W IH N T S', 'waggle':'W AE G AH L', 'ionising':'AY AH N AY Z IH NG', 'radiographers':'R EY D IY AA G R AH F ER Z', 'rntgen':'R EH N T G AH N', "rntgen's":'R EH N T G AH N Z', 'scatters':'S K AE T ER Z'}
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
