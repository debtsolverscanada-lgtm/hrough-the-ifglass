import re,json,wave,sys,time
from pocketsphinx import Decoder
EXTRA={'cryogenically':'K R AY AH JH EH N IH K L IY','cryoprotectant':'K R AY OW P R AH T EH K T AH N T',
 'nanoparticles':'N AE N OW P AA R T IH K AH L Z','rewarmed':'R IY W AO R M D','rewarming':'R IY W AO R M IH NG',
 'vitrification':'V IH T R AH F AH K EY SH AH N','vitrified':'V IH T R AH F AY D'}
src=open('../scripts/001-frozen-100-years-VOICEOVER.txt').read()
# keep display tokens (with punctuation) aligned 1:1 with normalized tokens
disp=[]
for tok in re.sub(r'<[^>]+>',' ',src).split():
    for part in tok.split('-'):
        n=re.sub(r"[^a-z']",'',part.lower())
        if n: disp.append((part,n))
d=Decoder(samprate=16000,bestpath=False)
for w,p in EXTRA.items(): d.add_word(w,p,True)
d.set_align_text(' '.join(n for _,n in disp))
w=wave.open('vo16k.wav','rb'); data=w.readframes(w.getnframes())
t0=time.time(); d.start_utt(); d.process_raw(data,full_utt=True); d.end_utt()
seg=[(s.word,s.start_frame/100,(s.end_frame+1)/100) for s in d.seg()]
print('secs',round(time.time()-t0,1),'segs',len(seg))
words=[x for x in seg if x[0] not in ('<s>','</s>','<sil>','[NOISE]')]
words=[(re.sub(r'\(\d+\)$','',a),b,c) for a,b,c in words]
print('aligned words',len(words),'expected',len(disp))
out=[]; j=0
for (shown,n) in disp:
    while j<len(words) and words[j][0]!=n: j+=1
    if j<len(words): out.append({'w':shown,'s':words[j][1],'e':words[j][2]}); j+=1
    else: out.append({'w':shown,'s':None,'e':None})
json.dump(out,open('words.json','w'),indent=0)
print(out[:5], out[-3:])
