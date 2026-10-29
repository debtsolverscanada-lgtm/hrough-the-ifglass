import json,re,sys
W=json.load(open(sys.argv[1]))           # words.json
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
PLAN=[
("What if you were frozen","hook",{}),
("You close your eyes","yearSpin",{"open":"@You open them"}),
("Everyone you know is gone","gonePeople",{}),
("Your phone is a museum","museum",{}),
("And the first doctor","doctor",{}),
("So let's actually do it","talk",{"bg":"night","pose":"point","mouth":"grin","text":"STEP","text2":"BY STEP","textAt":"@Step by step","text2At":"@Step by step"}),
("First problem","freezer",{"die":"@you die"}),
("Your body is about","water",{}),
("And when water freezes","crystals",{}),
("Your cells shrivel","cellsBurst",{}),
("Thaw you out later","deadCold",{}),
("So scientists use a trick","bigWord",{"word":"VITRIFICATION","size":130,"sub":"turning you into glass"}),
("Instead of freezing you","glassy",{}),
("They replace the water","vessel",{"label":"CRYOPROTECTANT","sub":"a special antifreeze"}),
("Then they cool you down","molecules",{"stop":"@They just stop"}),
("This isn't science fiction","vial",{}),
("In twenty twenty a baby","babies",{"emma":"@Her older sister"}),
("So small things can come","talk",{"bg":"lab","mouth":"o","brows":"raised","text":"CAN","text2":"YOU?","textAt":"@can you","text2At":"@can you"}),
("You're cooled to minus","thermo",{"ln":"@The temperature of liquid"}),
("Colder than any natural","coldest",{}),
("At this point you are not","vitals",{"coma":"@You're not in","heart":"@Your heart isn't","brain":"@Your brain shows"}),
("Every chemical reaction","clocks",{}),
("Which means something strange","noAge",{"dont":"@You don't age","pass":"@One hundred years can pass"}),
("You're placed upside down","dewarIn",{"brain":"@your brain is the last"}),
("And now you wait","wait",{}),
("Here's what most people","talk",{"bg":"lab","pose":"shrug","mouth":"smirk","icon":"bulb","text":"WHO KEEPS","text2":"YOU COLD?","size":96}),
("Liquid nitrogen slowly boils","refill",{}),
("For a century","century",{"a":"@Through recessions","b":"@Power cuts","c":"@Wars","e":"@Companies going"}),
("And this has already gone","cemetery",{"money":"@ran out of money"}),
("The tanks weren't refilled","tanksWarn",{"thaw":"@thawed","bill":"@It's a bill"}),
("Let's say you get lucky","lucky",{}),
("Now comes the hardest part","bigWord",{"word":"WAKING UP","card":"cardWarm","col":"#FF9F43","sub":"the hardest part"}),
("Rewarming is actually more","rewarmBad",{"uneven":"@If you warm up unevenly"}),
("Like an ice cube","iceCube",{}),
("But scientists have an idea","talk",{"bg":"lab","pose":"up","mouth":"grin","brows":"raised","icon":"bulb","gl":1}),
("In twenty twenty three","kidneyLab",{"rew":"@Then they rewarmed","work":"@and they worked"}),
("So in the future doctors","nanoBody",{"field":"@they switch on the field","every":"@Every cell warms"}),
("They flush out the antifreeze","flush",{}),
("And then they shock","heartShock",{"t1":"@Thump","t2":"@Thump","alive":"@You're alive"}),
("The first thing you feel","shiver",{}),
("But here's a weird bonus","astro",{"legs":"@You've been gone"}),
("Your brain though","brainDim",{"mem":"@You might lose"}),
("And for the first few hours","confused",{}),
("Then a nurse walks in","nurse",{"mask":"@And she's wearing"}),
("Because you are a walking","hazard",{}),
("Your immune system","viruses",{}),
("A flu that's harmless","icu",{}),
("And the germs living","jar",{}),
("So before you see","quarantine",{}),
("Finally they open the door","doorOpen",{}),
("What does the world","futureReveal",{"sub":"educated guesses"}),
("There are probably fewer","popGraph",{}),
("The sea is higher","seaWall",{}),
("The people around you","slang",{"bees":"@the bee's knees"}),
("The technology","then1926",{"tv":"@most homes didn't","space":"@Nobody had ever","pc":"@Computers didn't"}),
("You waking up in","holo",{}),
("Then there's the paperwork","paperwork",{"dead":"@declared dead","id":"@No identity","bank":"@No bank account","home":"@No home"}),
("But here's a twist","money",{"comp":"@After one hundred years"}),
("Of course prices go up","prices",{}),
("And a lawyer would have","lawyer",{"fp":"@Your fingerprints"}),
("Still","ghostRich",{"ghost":"@a ghost","rich":"@and a millionaire"}),
("But eventually the excitement","walk",{}),
("Your parents","chairs",{"a":"@Gone","b":"@Your friends"}),
("If you had children","lifetimes",{}),
("Maybe you find a great","grandchild",{"eyes":"@A stranger with","str":"@They know your"}),
("Psychologists think","lonely",{"a":"@Not the cold","b":"@Not the viruses","c":"@The loneliness"}),
("You'd be the only person","aloneHill",{}),
("So could this really happen","talk",{"bg":"dark","mouth":"o","brows":"raised","text":"COULD THIS","text2":"HAPPEN?","size":96}),
("Right now no one has","zero",{}),
("Around five hundred people","warehouse",{}),
("The very first","bedford",{"still":"@Still waiting"}),
("Maybe science will get","stepOut",{"open":"@a door will open"}),
("So let me ask you","ask",{"q":"@If you could be frozen"}),
("Tell me in the comments","endCard",{"next":"@And if you'd rather"}),
]
shots=[]
for anchor,shot,p in PLAN:
    i=find(anchor); pos=i+1
    s=W[i]['s']; rp={}
    for k,v in p.items():
        if isinstance(v,str) and v.startswith('@'):
            j=find(v[1:],start=i); rp[k]=round(W[j]['s']-s,3)
            if shot=='heartShock' and k=='t2': # second Thump
                j=find(v[1:],start=find(v[1:],start=i)+1); rp[k]=round(W[j]['s']-s,3)
        else: rp[k]=v
    shots.append({"s":round(s,3),"shot":shot,"p":rp})
for a,b in zip(shots,shots[1:]): a['e']=b['s']
shots[0]['s']=0; shots[-1]['e']=round(W[-1]['e']+2.0,3)
# ---- captions with number formatting ----
SUBS=[("minus one hundred and ninety six degrees Celsius","−196°C"),("twenty one twenty six","2126"),("one hundred","100"),
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
out={"shots":shots,"captions":C,"duration":shots[-1]['e'],"hook":"WHAT IF YOU WERE","hook2":"FROZEN FOR 100 YEARS?","handle":"@throughtheifglass"}
json.dump(out,open(sys.argv[2],'w'))
print(len(shots),'shots',len(C),'caption groups, dur',out['duration'])
