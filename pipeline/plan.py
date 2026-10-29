import json,re,sys
W=json.load(open(sys.argv[1]))           # words.json  (usage: plan.py words.json timeline.json EPISODE_DIR)
norm=lambda s:re.sub(r"[^a-z0-9']",'',s.lower())
NW=[norm(w['w']) for w in W]
pos=0
def find(phrase,start=None):
    global pos
    toks=[norm(x) for x in phrase.replace('-',' ').split()]
    i=pos if start is None else start
    while i<len(NW):
        if NW[i:i+len(toks)]==toks: return i
        i+=1
    raise SystemExit(f"anchor not found: {phrase}")
# (anchor, shot, params) ; params values starting with '@' are sub-anchors -> local seconds
EP=sys.argv[3]
PLAN=json.load(open(EP+'/shotplan.json'))
META=json.load(open(EP+'/meta.json'))
shots=[]
for anchor,shot,p in PLAN:
    i=find(anchor); pos=i+1
    s=W[i]['s']; rp={}
    for k,v in p.items():
        if isinstance(v,list):
            rp[k]=[round(W[find(x[1:],start=i)]['s']-s,3) if isinstance(x,str) and x.startswith('@') else x for x in v]; continue
        if isinstance(v,str) and v.startswith('@'):
            j=find(v[1:],start=i); rp[k]=round(W[j]['s']-s,3)
            if shot=='heartShock' and k=='t2': # second Thump
                j=find(v[1:],start=find(v[1:],start=i)+1); rp[k]=round(W[j]['s']-s,3)
        else: rp[k]=v
    shots.append({"s":round(s,3),"shot":shot,"p":rp})
for a,b in zip(shots,shots[1:]): a['e']=b['s']
shots[0]['s']=0; shots[-1]['e']=round(W[-1]['e']+2.0,3)
# ---- captions with number formatting ----
SUBS=[("twenty thousand","20,000"),("a hundred and thirty decibels","130 decibels"),("three hundred and forty meters","340 meters"),("two hundred calls","200 calls"),("ten weeks","10 weeks"),("three thousand and twenty six","3026"),("seven hundred and five","705"),("ninety nine point nine nine percent","99.99%"),
 ("fourteen seventy two","1472"),("nineteen seventy seven","1977"),("five hundred and fifty","550"),("six hundred trillion dollars","$600 trillion"),
 ("one hundred dollars","$100"),("three percent","3%"),("twenty twenty six","2026"),("forty generations","40 generations"),("fourteen years","14 years"),
 ("four thousand years","4,000 years"),("one thousand years","1,000 years"),("a thousand years","1,000 years"),("a thousand","1,000"),("four light years","4 light years"),
 ("minus one hundred and ninety six degrees Celsius","−196°C"),("twenty one twenty six","2126"),("one hundred","100"),
 ("sixty percent","60%"),("twenty twenty three","2023"),("twenty twenty","2020"),("twenty seven","27"),("nineteen seventies","1970s"),
 ("ten billion","10 billion"),("twenty eighties","2080s"),("ten thousand dollars","$10,000"),("seven percent","7%"),
 ("eight million","8 million"),("five hundred","500"),("nineteen sixty seven","1967"),("one thousand","1,000"),("six months","6 months"),("a hundred","100")]
toks=[dict(w) for w in W]; i=0; merged=[]
while i<len(toks):
    hit=False
    for ph,rep in SUBS:
        p=ph.split(); n=len(p)
        if [norm(x['w']) for x in toks[i:i+n]]==p:
            last=toks[i+n-1]['w']; tail=re.sub(r"^[A-Za-z']+","",last)
            merged.append({"w":rep+tail,"s":toks[i]['s'],"e":toks[i+n-1]['e']}); i+=n; hit=True; break
    if not hit: merged.append(toks[i]); i+=1
caps=[];cur=[]
for w in merged:
    cur.append(w)
    end = w['w'][-1:] in '.?!,' or w['w'].endswith('...') or len(cur)>=4
    if end: caps.append(cur); cur=[]
if cur: caps.append(cur)
C=[]
for c in caps:
    C.append({"s":c[0]['s'],"e":c[-1]['e'],"words":[{"w":x['w'].upper().replace('...','…'),"s":x['s'],"e":x['e']} for x in c]})
for a,b in zip(C,C[1:]):
    if b['s']-a['e']<0.6: a['e']=b['s']-0.01
out={"shots":shots,"captions":C,"duration":shots[-1]['e'],"hook":META["hook"][0],"hook2":META["hook"][1],"handle":META.get("handle","@throughtheifglass")}
json.dump(out,open(sys.argv[2],'w'))
print(len(shots),'shots',len(C),'caption groups, dur',out['duration'])
