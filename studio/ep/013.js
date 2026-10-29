// episode 013 scenes (shark sixth sense)
const s13_Y='#FFE14D', s13_C='#5CF2FF', s13_SK='#7C93AE', s13_SKB='#D6E2EE', s13_SAND='#4A4A3E';
const s13_DEF=`<defs><linearGradient id="s13_wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A3557"/><stop offset=".55" stop-color="#06213A"/><stop offset="1" stop-color="#03101F"/></linearGradient>
 <radialGradient id="s13_gy"><stop offset="0" stop-color="${s13_Y}" stop-opacity=".75"/><stop offset="1" stop-color="${s13_Y}" stop-opacity="0"/></radialGradient>
 <radialGradient id="s13_gc"><stop offset="0" stop-color="${s13_C}" stop-opacity=".7"/><stop offset="1" stop-color="${s13_C}" stop-opacity="0"/></radialGradient>
 <linearGradient id="s13_pool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FB6E0" stop-opacity=".55"/><stop offset="1" stop-color="#0C4C7A" stop-opacity=".85"/></linearGradient>
 <linearGradient id="s13_beach" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060A1E"/><stop offset="1" stop-color="#1B1F4A"/></linearGradient></defs>`;
// dark water with light rays, drifting specks, optional sand floor
function s13_water(g,o={}){const {sand=true,sy=820}=o;const r=rng(31);let sp='';
  for(let i=0;i<46;i++){const x=r()*1920,y=((r()*1080)-g*(8+r()*16))%1080;sp+=`<circle cx="${x+Math.sin(g+i)*12}" cy="${y<0?y+1080:y}" r="${1.5+r()*3}" fill="#BFEFFF" opacity="${.12+r()*.25}"/>`;}
  let rays='';for(let i=0;i<5;i++){const x=200+i*400+Math.sin(g*.4+i)*60;rays+=`<path d="M${x-60} 0 L${x+60} 0 L${x+260} 900 L${x+40} 900Z" fill="#BFEFFF" opacity="${.035+.02*Math.sin(g*.7+i)}"/>`;}
  return `${s13_DEF}<rect width="1920" height="1080" fill="url(#s13_wg)"/>${rays}${sp}
   ${sand?`<path d="M0 ${sy} Q240 ${sy-30} 480 ${sy} T960 ${sy} T1440 ${sy} T1920 ${sy} V1080 H0Z" fill="${s13_SAND}"/><path d="M0 ${sy} Q240 ${sy-30} 480 ${sy} T960 ${sy} T1440 ${sy} T1920 ${sy}" stroke="#6E6A52" stroke-width="6" fill="none"/>`:''}`;}
// pulsing electric rings
function s13_pulse(x,y,g,o={}){const {col=s13_Y,n=4,max=260,min=20,speed=.9,op=.85,w=6,ry=1}=o;let s=`<ellipse cx="${x}" cy="${y}" rx="${max*.55}" ry="${max*.55*ry}" fill="url(#${col===s13_C?'s13_gc':'s13_gy'})" opacity="${op*.45*(.6+.4*Math.sin(g*6))}"/>`;
  for(let i=0;i<n;i++){const k=((g*speed+i/n)%1);s+=`<ellipse cx="${x}" cy="${y}" rx="${min+k*max}" ry="${(min+k*max)*ry}" fill="none" stroke="${col}" stroke-width="${w}" opacity="${op*(1-k)}"/>`;}return s;}
// jittery zig-zag spark
function s13_zap(x,y,len,ang,g,seed=1,col=s13_Y,w=7,op=1){const f=Math.floor(g*14);const r=rng(seed*97+f%13+1);let d=`M0 0`;const n=6;
  for(let i=1;i<=n;i++){d+=` L${(len*i/n).toFixed(1)} ${i===n?0:((r()-.5)*len*.35).toFixed(1)}`;}
  return `<g transform="translate(${x},${y}) rotate(${ang})" opacity="${op}"><path d="${d}" stroke="${INK}" stroke-width="${w+8}" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linejoin="round" stroke-linecap="round"/></g>`;}
function s13_sparks(x,y,R,g,n=6,seed=3,col=s13_Y,op=1){let s='';for(let i=0;i<n;i++){const a=i/n*360+g*20;const rr=R*(.9+.2*Math.sin(g*5+i));s+=s13_zap(x+Math.cos(a*Math.PI/180)*rr,y+Math.sin(a*Math.PI/180)*rr,R*.5,a,g,seed+i,i%2?s13_C:col,6,op);}return s;}
// cartoon shark, faces right (dir=-1 faces left)
function s13_shark(x,y,s,g,o={}){const {dir=1,glow=0,mouth='flat',eye='open'}=o;const tw=Math.sin(g*5)*10;
  const pores=glow>0?[[228,-20],[246,-6],[262,-26],[240,-38],[274,-8],[214,-4],[256,8]].map(([px,py],i)=>`<circle cx="${px}" cy="${py}" r="5" fill="${INK}"/><circle cx="${px}" cy="${py}" r="${12+4*Math.sin(g*8+i)}" fill="url(#s13_gy)" opacity="${glow}"/>`).join(''):'';
  const M=mouth==='open'?`<path d="M190 22 Q240 70 285 18 Z" fill="#3a1220" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M200 26 l10 12 l10 -10 l10 12 l10 -10 l10 10 l10 -10" stroke="#fff" stroke-width="5" fill="none"/>`
   :mouth==='grim'?`<path d="M196 30 q12 -10 24 0 t24 0 t24 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`
   :`<path d="M200 30 Q240 40 272 22" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  const E=eye==='x'?`<path d="M178 -46 l20 20 M198 -46 l-20 20" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`:`<circle cx="188" cy="-34" r="13" fill="${INK}"/><circle cx="192" cy="-38" r="4" fill="#fff"/>`;
  return `<g transform="translate(${x},${y}) scale(${s*dir},${s})">
   <g transform="rotate(${tw} -280 0)"><path d="M-270 0 L-400 -130 Q-372 -20 -392 100Z" fill="${s13_SK}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/></g>
   <path d="M-20 -78 L-90 -200 Q-30 -180 70 -86Z" fill="${s13_SK}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
   <path d="M-300 0 C-200 -90 100 -112 262 -34 Q312 0 262 30 C100 92 -200 72 -300 0Z" fill="${s13_SK}" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>
   <path d="M-250 18 C-120 62 120 72 268 26 C120 44 -120 40 -250 18Z" fill="${s13_SKB}"/>
   <path d="M30 40 L-30 ${130+tw*.4} Q40 104 110 50Z" fill="${s13_SK}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   ${[100,122,144].map(gx=>`<path d="M${gx} -30 q-10 26 0 50" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}
   ${E}${M}${pores}</g>`;}
function s13_flatfish(x,y,s,g,o={}){const {buried=0,col='#C9A46A'}=o;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M80 0 L140 -40 L136 40Z" fill="${col}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
   <ellipse rx="110" ry="40" fill="${col}" stroke="${INK}" stroke-width="8"/>${[[-50,6],[0,-10],[40,10],[-20,20]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="8" fill="#8A6A3A"/>`).join('')}
   <circle cx="-62" cy="-30" r="14" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-34" cy="-36" r="14" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-60" cy="-30" r="6" fill="${INK}"/><circle cx="-32" cy="-36" r="6" fill="${INK}"/>
   ${buried>0?`<path d="M-170 ${-6} Q-80 ${-30} 0 ${-24} Q90 ${-30} 180 ${-4} L180 60 L-170 60Z" fill="${s13_SAND}" opacity="${buried}"/><path d="M-170 -6 Q-80 -30 0 -24 Q90 -30 180 -4" stroke="#6E6A52" stroke-width="6" fill="none" opacity="${buried}"/>`:''}</g>`;}
function s13_crab(x,y,s,g,o={}){const {buried=0}=o;const c=Math.sin(g*4)*6;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-40 -46 v-30 M40 -46 v-30" stroke="${INK}" stroke-width="7"/><circle cx="-40" cy="-80" r="12" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="40" cy="-80" r="12" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-40" cy="-80" r="5" fill="${INK}"/><circle cx="40" cy="-80" r="5" fill="${INK}"/>
   <path d="M-70 -10 L-120 ${-50+c} M70 -10 L120 ${-50-c}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><circle cx="-124" cy="${-58+c}" r="22" fill="#FF7A4D" stroke="${INK}" stroke-width="6"/><circle cx="124" cy="${-58-c}" r="22" fill="#FF7A4D" stroke="${INK}" stroke-width="6"/>
   <ellipse rx="80" ry="48" fill="#FF7A4D" stroke="${INK}" stroke-width="8"/>
   ${buried>0?`<path d="M-160 -50 Q-60 -64 0 -56 Q80 -66 160 -48 L160 60 L-160 60Z" fill="${s13_SAND}" opacity="${buried}"/>`:''}</g>`;}
function s13_fish(x,y,s,g,col='#FFB86B',dir=1){const w=Math.sin(g*8)*8;
  return `<g transform="translate(${x},${y}) scale(${s*dir},${s})"><path d="M-50 0 L-90 ${-30+w} L-90 ${30+w}Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><ellipse rx="62" ry="34" fill="${col}" stroke="${INK}" stroke-width="7"/><circle cx="30" cy="-8" r="8" fill="${INK}"/></g>`;}
function s13_weed(x,y,h,g,col='#2E8A47'){let s='';for(let k=0;k<3;k++){const xo=x+k*34-34;const sw=Math.sin(g*1.2+k+x)*30;s+=`<path d="M${xo} ${y} Q${xo+sw} ${y-h*.5} ${xo-sw*.6} ${y-h}" stroke="${INK}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M${xo} ${y} Q${xo+sw} ${y-h*.5} ${xo-sw*.6} ${y-h}" stroke="${col}" stroke-width="18" fill="none" stroke-linecap="round"/>`;}return s;}
function s13_platypus(x,y,s,g,o={}){const {sweep=0}=o;const a=sweep?Math.sin(g*4)*16:0;const pd=Math.sin(g*6)*10;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-160 0 Q-260 ${-10+pd*.5} -300 20 Q-260 50 -160 30Z" fill="#6B4A2E" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   ${[[-80,1],[60,-1]].map(([fx,k])=>`<path d="M${fx} 40 l${-20} ${50+pd*k} l50 0Z" fill="#3A2A1E" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`).join('')}
   <ellipse rx="190" ry="70" fill="#8A5E3A" stroke="${INK}" stroke-width="9"/>
   <g transform="translate(170,-10) rotate(${a})"><circle r="62" fill="#8A5E3A" stroke="${INK}" stroke-width="8"/><path d="M40 -26 Q170 -40 190 0 Q170 40 40 26Z" fill="#3A3A44" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M6 -24 q12 8 24 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/></g></g>`;}
function s13_dolphin(x,y,s,g){const w=Math.sin(g*4)*8;
  return `<g transform="translate(${x},${y}) scale(${s})"><g transform="rotate(${w} -250 0)"><path d="M-240 0 L-330 -60 Q-300 0 -330 60Z" fill="#7FA6C9" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/></g>
   <path d="M-40 -70 L-90 -150 Q-20 -130 40 -76Z" fill="#7FA6C9" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   <path d="M-250 0 C-150 -90 120 -110 220 -30 L320 -6 Q330 10 300 18 L210 30 C100 80 -150 60 -250 0Z" fill="#7FA6C9" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
   <path d="M-200 20 C-80 56 120 56 220 24 C100 36 -80 38 -200 20Z" fill="#DDEBF7"/><circle cx="180" cy="-20" r="10" fill="${INK}"/><path d="M220 14 Q260 24 300 12" stroke="${INK}" stroke-width="5" fill="none"/></g>`;}
function s13_bee(x,y,s,g,dir=1){const f=Math.sin(g*40)*.5+.5;
  return `<g transform="translate(${x},${y}) scale(${s*dir},${s})"><ellipse cx="-10" cy="-40" rx="34" ry="${18+f*10}" fill="#E8F6FF" opacity=".85" stroke="${INK}" stroke-width="4"/><ellipse cx="20" cy="-40" rx="30" ry="${16+f*8}" fill="#E8F6FF" opacity=".85" stroke="${INK}" stroke-width="4"/>
   <ellipse rx="56" ry="38" fill="${P.gold}" stroke="${INK}" stroke-width="7"/><path d="M-20 -34 V34 M8 -38 V38" stroke="${INK}" stroke-width="12"/><circle cx="52" cy="-6" r="22" fill="${INK}"/><circle cx="58" cy="-12" r="6" fill="#fff"/><path d="M-56 0 l-18 0" stroke="${INK}" stroke-width="6"/></g>`;}
function s13_flower(x,y,s,g,o={}){const {charge=1,col='#FF8FC8',drained=0}=o;let pe='';for(let i=0;i<6;i++)pe+=`<ellipse cx="0" cy="-46" rx="26" ry="44" fill="${col}" stroke="${INK}" stroke-width="6" transform="rotate(${i*60})"/>`;
  const sym=charge>0?[0,1,2,3,4,5].map(i=>{const a=i/6*6.283+g*.6;return `<text x="${Math.cos(a)*150}" y="${Math.sin(a)*150+14}" text-anchor="middle" font-size="44" font-weight="900" fill="${drained?'#9AA7BD':s13_C}" opacity="${charge}">${i%2?'+':'−'}</text>`;}).join(''):'';
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M0 40 V320" stroke="${INK}" stroke-width="22"/><path d="M0 40 V320" stroke="#4FC36A" stroke-width="12"/><path d="M0 200 q60 -40 90 -10 q-40 30 -90 10" fill="#4FC36A" stroke="${INK}" stroke-width="6"/>
   <circle r="${140+6*Math.sin(g*4)}" fill="url(#${drained?'s13_gy':'s13_gc'})" opacity="${.6*charge}"/>${pe}<circle r="34" fill="${P.gold}" stroke="${INK}" stroke-width="6"/>${sym}</g>`;}
function s13_tower(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-70 400 L-20 0 L20 0 L70 400 M-50 250 L50 250 M-40 160 L40 160 M-30 80 L30 80 M-55 250 L35 160 M55 250 L-35 160 M-40 160 L25 80 M40 160 L-25 80" stroke="#9AA7BD" stroke-width="12" fill="none"/><path d="M-110 30 H110 M-90 100 H90" stroke="#9AA7BD" stroke-width="14"/></g>`;}
function s13_cloud(x,y,s,col='#2A2E48'){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-200 60 Q-260 60 -250 10 Q-240 -40 -180 -30 Q-170 -100 -90 -96 Q-40 -150 30 -110 Q100 -150 150 -80 Q230 -80 230 -10 Q260 60 190 60Z" fill="${col}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/></g>`;}
function s13_heartMini(x,y,s,g,rate=1.3){const k=(g*rate)%1;const b=k<.15?1-k/.15:0;return heart(x,y,s,b);}

Object.assign(SHOTS,{
shkHook(t,d,p,g){
  const fi=p.fish??3.2, ns=p.notSee??8.5, nm=p.notSmell??9.6, fe=p.feel??10.8, bt=p.beat??12.1;
  const gx=lerp(380,640,prog(t,0,d));
  const pills=[['NOT SEE','cross',ns,480],['NOT SMELL','cross',nm,960],['FEEL IT!','check',fe,1440]];
  return `${s13_water(g)}${s13_weed(180,830,260,g)}${s13_weed(1760,830,320,g)}
   ${AT(t,fi)?s13_pulse(1250,800,g,{max:AT(t,bt)?380:240,op:.35+.6*prog(t,fi,fe),speed:AT(t,bt)?1.3:.8,ry:.6}):''}
   ${s13_flatfish(1250,800,1.1,g,{buried:1})}
   ${AT(t,bt)?`${s13_heartMini(1250,640,.22,g,1.3)}${T(1250,520,'BA-DUM',{size:54,fill:s13_Y,stroke:8,sc:pop(t,bt)})}`:''}
   ${AT(t,bt)?s13_shark(lerp(2300,1640,eout(prog(t,bt,bt+2))),600,.7,g,{dir:-1,glow:1}):''}
   ${glint({x:gx,y:420,s:.95,t:g,rot:72,pose:'up',legs:'walk',mouth:AT(t,fe)?'grin':'o',brows:'raised',eyes:AT(t,fe)?'closed':'open',blink:BL(g)})}
   ${AT(t,ns)?pills.map(([s,ic,a,x])=>AT(t,a)?`<g transform="translate(${x},200)">${labelPill(0,0,s,ic==='check'?s13_Y:'#9AA7BD',52)}${icon(ic,0,120,.55*pop(t,a))}</g>`:'').join('')
     :T(960,170,"A SHARK'S SIXTH SENSE",{size:100,fill:s13_Y,sc:IN(t,.2)})}`;
},
shkPromise(t,d,p,g){
  const you=AT(t,p.you??2.3);const sx=lerp(-400,2300,prog(t,0,you?p.you??2.3:d)*1);
  return you?`${card('cardDark',g)}${s13_pulse(960,560,g,{max:520,op:.8,n:5})}${s13_sparks(960,500,300,g,8,5)}
     ${glint({x:960,y:470,s:.95,t:g,pose:'up',mouth:'o',brows:'raised',blink:BL(g)})}
     ${T(960,150,"YOU'RE ELECTRIC",{size:110,fill:s13_Y,sc:pop(t,p.you??2.3)})}${AT(t,(p.you??2.3)+3)?T(960,880,'RIGHT NOW',{size:70,fill:s13_C,sc:pop(t,(p.you??2.3)+3)}):''}`
   :`${s13_water(g)}${s13_flatfish(1100,800,1,g,{buried:1})}${s13_pulse(1100,800,g,{max:220,ry:.6,op:.7})}${s13_shark(sx,520,.9,g,{glow:1})}
     ${T(960,170,'SHARKS DO THIS DAILY',{size:96,fill:P.white,sc:IN(t,.2)})}`;
},
shkBody(t,d,p,g){
  const mu=AT(t,p.mus??2.8), br=AT(t,p.brain??5.9);const X=720,Y=560,S=1.1;
  const k=(g*1.3)%1, beat=k<.15?1-k/.15:0;
  return `${card('cardDark',g)}${glint({x:X,y:Y,s:S,t:0,pose:mu?'flex':'down',mouth:br?'o':'smile',brows:br?'raised':'calm',blink:BL(g)})}
   ${heart(X+10,Y+90,.16,beat)}${s13_pulse(X+10,Y+90,g,{max:120,n:3,op:.8,speed:1.3})}
   ${mu?[0,1,2].map(i=>s13_zap(X+60+i*22,Y+20-i*40,70,-60-i*20,g,i+11,s13_C,6)).join('')+s13_zap(X-70,Y+110,80,110,g,19,s13_C,6):''}
   ${br?s13_sparks(X,Y-66*S,150,g,7,23,s13_Y):''}
   ${[['HEART',0,P.red],['MUSCLES',p.mus??2.8,s13_C],['BRAIN',p.brain??5.9,s13_Y]].map(([s,a,c],i)=>AT(t,a)?`<g transform="translate(1420,${330+i*170}) scale(${pop(t,a)})">${labelPill(0,0,s,c,60)}</g>${s13_zap(1180,330+i*170,90,0,g,40+i,c,6)}`:'').join('')}
   ${T(960,140,'YOU RUN ON ELECTRICITY',{size:90,fill:P.white,sc:IN(t,.2)})}`;
},
shkEcg(t,d,p,g){
  const pk=AT(t,p.pick??3.9);
  return `${bgRoom(g)}${glint({x:500,y:540,s:1,t:g,mouth:'smile',blink:BL(g)})}
   ${[[470,600],[540,620],[505,670]].map(([x,y],i)=>`<path d="M${x} ${y} Q${800} ${500+i*40} 1080 ${440+i*30}" stroke="${INK}" stroke-width="12" fill="none"/><path d="M${x} ${y} Q${800} ${500+i*40} 1080 ${440+i*30}" stroke="${[P.red,s13_Y,P.white][i]}" stroke-width="5" fill="none"/><circle cx="${x}" cy="${y}" r="18" fill="#FFF6EA" stroke="${INK}" stroke-width="5"/>`).join('')}
   <rect x="1060" y="280" width="720" height="420" rx="24" fill="#0B1A22" stroke="${INK}" stroke-width="12"/><rect x="1080" y="300" width="680" height="380" rx="14" fill="#06120A" stroke="#1FAF8A" stroke-width="4"/>
   ${ecg(1100,520,640,g)}${T(1420,650,'HEARTBEAT',{size:40,fill:P.mint,stroke:6})}
   ${pk?s13_sparks(505,620,90,g,6,7,s13_Y):''}
   ${T(960,150,pk?'IT READS YOUR ELECTRICITY':'STICKERS ON YOUR CHEST',{size:86,fill:pk?s13_Y:P.white,sc:pop(t,pk?p.pick??3.9:.2)})}`;
},
shkField(t,d,p,g){
  const wk=AT(t,p.weak??5.6), sh=AT(t,p.shark??8.1);const sx=lerp(2300,1450,eout(prog(t,p.shark??8.1,(p.shark??8.1)+1.6)));
  return `${s13_water(g)}${s13_pulse(760,560,g,{max:wk?320:460,n:5,op:wk?.35:.7,ry:1.1})}
   ${glint({x:760,y:470,s:.95,t:g,legs:'wobble',pose:'shrug',mouth:sh?'o':'smile',brows:sh?'raised':'calm',blink:BL(g)})}
   ${sh?s13_shark(sx,560,.9,g,{dir:-1,glow:1}):''}
   ${wk&&!sh?T(1420,560,'VERY, VERY WEAK',{size:70,fill:s13_Y,sc:pop(t,p.weak??5.6)}):''}
   ${T(960,150,sh?'SHARKS CAN FEEL IT':'YOUR ELECTRIC FIELD',{size:96,fill:sh?s13_Y:P.white,sc:pop(t,sh?p.shark??8.1:.2)})}`;
},
shkSnout(t,d,p,g){
  const tb=AT(t,p.tube??5.5), se=AT(t,p.sensor??9.6);const r=rng(17);let pores='';
  for(let i=0;i<34;i++){const px=600+r()*300, py=420+r()*190; if(px>860&&py>560)continue; pores+=`<circle cx="${px}" cy="${py}" r="${6+r()*3}" fill="${INK}"/>${se?`<circle cx="${px}" cy="${py}" r="${14+5*Math.sin(g*7+i)}" fill="url(#s13_gy)"/>`:''}`;}
  const jl=prog(t,p.tube??5.5,(p.tube??5.5)+1.4);
  return `${s13_water(g,{sand:false})}
   <path d="M-60 230 Q560 210 880 440 Q960 520 900 600 Q640 820 -60 800Z" fill="${s13_SK}" stroke="${INK}" stroke-width="14" stroke-linejoin="round"/>
   <path d="M-60 640 Q500 700 880 600 Q640 820 -60 800Z" fill="${s13_SKB}"/><path d="M520 690 Q700 700 860 620" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/>
   <circle cx="470" cy="400" r="30" fill="${INK}"/><circle cx="480" cy="390" r="9" fill="#fff"/>${pores}
   <circle cx="760" cy="480" r="34" fill="none" stroke="${s13_Y}" stroke-width="7"/>
   ${tb?`<path d="M794 480 L1100 360" stroke="${s13_Y}" stroke-width="6" stroke-dasharray="14 12"/>
    <g transform="translate(1420,520) scale(${pop(t,p.tube??5.5)})"><rect x="-330" y="-300" width="660" height="560" rx="30" fill="#18213A" stroke="${s13_Y}" stroke-width="9"/>
     <rect x="-330" y="-300" width="660" height="90" rx="30" fill="${s13_SK}"/><path d="M-330 -210 H330" stroke="${INK}" stroke-width="6"/>
     <path d="M-40 -230 C-40 -60 -20 40 60 110" stroke="${INK}" stroke-width="64" fill="none" stroke-linecap="round"/><path d="M-40 -230 C-40 -60 -20 40 60 110" stroke="#2A3A4E" stroke-width="44" fill="none" stroke-linecap="round"/>
     <path d="M-40 -230 C-40 -60 -20 40 60 110" stroke="#7CF5D0" stroke-width="36" fill="none" stroke-linecap="round" stroke-dasharray="${420*jl} 600" opacity=".85"/>
     <circle cx="60" cy="140" r="${62}" fill="${se?s13_Y:'#556'}" stroke="${INK}" stroke-width="8"/>${se?s13_pulse(60,140,g,{max:140,n:3,op:.8})+s13_sparks(60,140,90,g,5,31):''}
     ${T(-180,-40,'JELLY',{size:44,fill:'#7CF5D0',stroke:7})}${T(-170,20,'TUBE',{size:44,fill:'#7CF5D0',stroke:7})}${se?T(200,230,'SENSOR',{size:44,fill:s13_Y,stroke:7}):''}</g>`:''}
   ${!tb?T(1360,520,'TINY PORES',{size:80,fill:s13_Y,sc:IN(t,2.2)}):''}
   ${T(960,140,"A SHARK'S SNOUT",{size:96,fill:P.white,sc:IN(t,.2)})}`;
},
shkLorenzini(t,d,p,g){
  const nm=AT(t,p.named??3), bk=AT(t,p.back??8.2);
  const q=bk?[0,1,2,3,4].map(i=>T(1180+i*130,380+Math.sin(g*3+i)*24+(i%2)*80,'?',{size:110,fill:[s13_Y,s13_C,P.white][i%3],sc:pop(t,(p.back??8.2)+i*.15)})).join(''):'';
  return `${card('cardWarm',g)}${extra({x:420,y:560,s:1,t:g,head:'#F2C9A0',glasses:true,pose:'hold'})}
   <g transform="translate(470,570) rotate(-30)"><path d="M0 0 L120 -110" stroke="#FFF6EA" stroke-width="10" stroke-linecap="round"/><path d="M120 -110 q40 -20 50 -60 q-40 0 -60 40Z" fill="#FFF6EA" stroke="${INK}" stroke-width="4"/></g>
   ${bk?q:`<g transform="translate(1300,560) rotate(4) scale(${IN(t,.6)})"><rect x="-300" y="-220" width="600" height="420" rx="16" fill="#E8D7B0" stroke="${INK}" stroke-width="9"/><g transform="translate(20,-20)">${s13_shark(0,0,.62,0,{glow:1})}</g>
     <path d="M-250 140 H120 M-250 170 H60" stroke="#A48A60" stroke-width="10" stroke-linecap="round"/></g>`}
   ${nm?`<g transform="translate(${bk?1440:1300},${bk?720:860})">${labelPill(0,0,'300+ YEARS AGO',s13_Y,50)}</g>`:''}
   ${T(960,150,bk?'WHAT ARE THEY FOR?':'AMPULLAE OF LORENZINI',{size:bk?96:84,fill:bk?P.white:s13_Y,sc:pop(t,bk?p.back??8.2:.2)})}`;
},
shkNano(t,d,p,g){
  const sn=AT(t,p.sense??5.2);
  return `${card('cardIce',g)}
   <g transform="translate(480,540)"><rect x="-110" y="-200" width="220" height="400" rx="26" fill="#2A3248" stroke="${INK}" stroke-width="10"/><rect x="-40" y="-236" width="80" height="40" rx="8" fill="#9AA7BD" stroke="${INK}" stroke-width="8"/><rect x="-110" y="-200" width="220" height="150" rx="26" fill="${s13_Y}" stroke="${INK}" stroke-width="10"/>${T(0,60,'1',{size:150,fill:P.white})}${T(0,150,'VOLT',{size:56,fill:P.white,stroke:8})}</g>
   ${sn?`<path d="M680 540 H1080" stroke="${P.white}" stroke-width="12" stroke-dasharray="20 20"/><path d="M1060 510 L1110 540 L1060 570" stroke="${P.white}" stroke-width="12" fill="none" stroke-linecap="round"/>
     ${T(880,500,'÷ 1,000,000,000',{size:46,fill:s13_C,stroke:7})}
     <g transform="translate(1400,520)">${s13_pulse(0,0,g,{max:180,n:3,op:.9,col:s13_Y})}<circle r="7" fill="${s13_Y}"/><circle r="110" fill="none" stroke="${INK}" stroke-width="22"/><circle r="110" fill="none" stroke="#C9D3E3" stroke-width="12"/><path d="M78 78 L170 170" stroke="${INK}" stroke-width="34" stroke-linecap="round"/><path d="M78 78 L170 170" stroke="#7A5A3A" stroke-width="20" stroke-linecap="round"/></g>
     ${T(1400,800,'A BILLIONTH OF A VOLT',{size:56,fill:s13_Y,sc:pop(t,p.sense??5.2)})}`:`${T(1340,560,'MOST SENSITIVE',{size:80,fill:s13_C,sc:IN(t,.5)})}${T(1340,660,'IN NATURE',{size:80,fill:P.white,sc:IN(t,.8)})}`}
   ${T(960,150,sn?'SHARKS FEEL THIS':'ELECTRIC DETECTORS',{size:96,fill:P.white,sc:pop(t,sn?p.sense??5.2:.2)})}`;
},
shkTank(t,d,p,g){
  const bu=p.buried??3.1, sw=p.swim??6.5, hd=p.hide??10, ps=p.past??16.2, el=p.elec??18.7, at=p.attack??23.6;
  const ph=t<hd?1:t<el?2:3;const FX=1100,FY=790;let sx,sy=520,dir=1,mouth='flat';
  if(ph===1){const k=eout(prog(t,sw,sw+1.6));sx=lerp(520,FX-160,k);sy=lerp(480,FY-110,k);mouth=k>.9?'open':'flat';if(t<sw){sx=520+Math.sin(g*.8)*120;dir=Math.cos(g*.8)>0?1:-1;}}
  else if(ph===2){const k=prog(t,ps,ps+2.4);sx=t<ps?420:lerp(420,1500,k);sy=460;}
  else{const k=eout(prog(t,at,at+1));sx=t<at?500+Math.sin(g*.8)*100:lerp(600,FX-170,k);sy=t<at?470:lerp(470,FY-110,k);mouth=t>=at?'open':'flat';dir=t<at?(Math.cos(g*.8)>0?1:-1):1;}
  const tank=`<rect x="240" y="270" width="1440" height="600" rx="20" fill="#0B3A5A" opacity=".85"/><path d="M240 780 Q600 760 960 780 T1680 780 V870 H240Z" fill="${s13_SAND}"/>`;
  const fish=ph<3?s13_flatfish(FX,FY,.8,g,{buried:AT(t,bu)?1:0}):'';
  const field=ph===1&&AT(t,bu)?s13_pulse(FX,FY,g,{max:200,ry:.6,op:.8}):'';
  const box=ph===2?`<g transform="translate(${FX},${FY-40})"><rect x="-170" y="-90" width="340" height="150" rx="12" fill="#5D6A82" stroke="${INK}" stroke-width="8"/>${[...Array(7)].map((_,i)=>`<circle cx="${-120+i*40}" cy="-60" r="8" fill="${INK}"/>`).join('')}
     ${[0,1,2].map(i=>{const k=((g*.5+i/3)%1);return `<circle cx="${-60+i*60+Math.sin(g+i)*14}" cy="${-110-k*140}" r="${16+k*20}" fill="#9BE15D" opacity="${.6*(1-k)}"/>`;}).join('')}
     ${T(0,20,'SMELL ONLY',{size:38,fill:P.white,stroke:6})}</g>`:'';
  const elec=ph===3?`<path d="M1700 500 H1760 V900" stroke="#333" stroke-width="10" fill="none"/>${[FX-60,FX+60].map(x=>`<path d="M${x} ${FY} V${FY-30}" stroke="#9AA7BD" stroke-width="16"/><path d="M${x} ${FY+40} Q${x+300} ${FY+80} 1680 ${FY+20}" stroke="#E04848" stroke-width="7" fill="none"/>`).join('')}
     ${s13_pulse(FX,FY-20,g,{max:220,ry:.6,op:.9})}${t>=at+.8?s13_sparks(FX,FY-40,120,g,7,51):''}`:'';
  const lab=[[1,'TEST 1: BURIED FISH'],[2,'TEST 2: ELECTRICITY BLOCKED'],[3,'TEST 3: FAKE FISH SIGNAL']][ph-1][1];
  const res=ph===1&&t>=sw+1.6?['FOUND IT!','check']:ph===2&&t>=ps+.6?['SWAM RIGHT PAST','cross']:ph===3&&t>=at+.6?['ATTACKED THE WIRES!','check']:null;
  return `${bgLab(g)}${tank}${field}${fish}${box}${elec}${s13_shark(sx,sy,.55,g,{dir,mouth,glow:1})}
   <rect x="240" y="270" width="1440" height="600" rx="20" fill="none" stroke="#BFEFFF" stroke-width="12"/><path d="M270 300 L420 300" stroke="#fff" stroke-width="8" opacity=".4" stroke-linecap="round"/>
   ${labelPill(960,340,lab,ph===2?'#9AA7BD':s13_Y,40)}
   ${res?`<g transform="translate(560,640) scale(${pop(t,ph===1?sw+1.6:ph===2?ps+.6:at+.6)})">${icon(res[1],0,0,.7)}${T(0,-80,res[0],{size:52,fill:res[1]==='check'?s13_Y:P.coral,stroke:9})}</g>`:''}
   ${T(960,170,'THE BURIED FISH EXPERIMENT',{size:84,fill:P.white,sc:IN(t,.2)})}
   ${AT(t,p.feel??27)?`<rect width="1920" height="1080" fill="#05081A" opacity=".88"/>${T(960,460,'NOT SMELLING...',{size:120,fill:'#9AA7BD',sc:pop(t,p.feel??27)})}${AT(t,p.feel2??29)?T(960,650,'FEELING!',{size:170,fill:s13_Y,sc:pop(t,p.feel2??29)})+s13_sparks(960,600,330,g,8,141):''}`:''}`;
},
shkPool(t,d,p,g){
  const fe=AT(t,p.feel??5.8), bz=AT(t,p.buzz??8.8), mu=AT(t,p.mus??11.4), ht=AT(t,p.hearts??13.4);
  const ppl=[[260,'#FFD3A8'],[600,'#C68B59'],[1320,'#F2C9A0'],[1660,'#8D5A3B']];
  return `${s13_DEF}<rect width="1920" height="1080" fill="#1C2A44"/>${[...Array(12)].map((_,i)=>`<path d="M${i*170} 300 V900" stroke="#2A3E60" stroke-width="4"/>`).join('')}
   ${ppl.map(([x,h],i)=>extra({x,y:500,s:.8,t:g+i,head:h,pose:'down'})).join('')}
   ${glint({x:960,y:470,s:.85,t:g,eyes:'closed',mouth:fe?'grin':'smile',brows:fe?'raised':'calm',pose:'shrug'})}
   <rect x="0" y="500" width="1920" height="400" fill="url(#s13_pool)"/><path d="M0 500 ${[...Array(25)].map((_,i)=>`Q${i*80+40} ${500+Math.sin(g*3+i)*10} ${i*80+80} 500`).join(' ')}" stroke="#BFEFFF" stroke-width="6" fill="none"/>
   <rect x="0" y="900" width="1920" height="180" fill="#0C3A5E"/>
   ${fe?ppl.map(([x],i)=>s13_pulse(x,620,g+i*.3,{max:bz?220:150,n:3,op:.75,ry:1.2})).join(''):''}
   ${mu?ppl.map(([x],i)=>s13_zap(x+20,560,90,-30+i*15,g,60+i,s13_C,6)).join(''):''}
   ${ht?ppl.map(([x],i)=>s13_heartMini(x,600,.12,g+i*.4,1.2)).join(''):''}
   ${T(960,150,ht?'THEIR HEARTS, BEATING':mu?'THEIR MUSCLES, MOVING':fe?'YOU STILL FEEL THEM':'EYES CLOSED...',{size:90,fill:fe?s13_Y:P.white,sc:pop(t,ht?p.hearts??13.4:mu?p.mus??11.4:fe?p.feel??5.8:.2)})}`;
},
shkHideSeek(t,d,p,g){
  const hs=AT(t,p.hide??4.2);
  return `${s13_water(g)}${s13_weed(1360,830,380,g)}${s13_weed(1480,830,300,g,'#3FA35C')}
   ${extra({x:1430,y:560,s:.75,t:g,head:'#FFB4A2'})}
   <path d="M1180 830 Q1200 520 1420 500 Q1660 520 1680 830Z" fill="#5B5A6E" stroke="${INK}" stroke-width="10"/>
   ${s13_pulse(1430,600,g,{max:240,n:4,op:.85})}${s13_heartMini(1430,620,.16,g,1.3)}
   ${glint({x:560,y:480,s:1,t:g,eyes:'closed',legs:'wobble',pose:'point',mouth:hs?'grin':'smirk',blink:0})}
   ${hs?`<g transform="translate(560,170) scale(${pop(t,p.hide??4.2)})">${bubble(0,0,520,120,'FOUND YOU!',{size:64})}</g>`:''}
   ${T(1430,260,hs?'YOU ALWAYS WIN':'NO PEEKING',{size:76,fill:hs?s13_Y:P.white,sc:pop(t,hs?p.hide??4.2:.2)})}`;
},
shkOcean(t,d,p,g){
  const al=AT(t,p.alive??1.7), fi=AT(t,p.fish??3.9), cr=AT(t,p.crab??6), ev=AT(t,p.every??8.4);
  const r=rng(77);let many='';if(ev){for(let i=0;i<14;i++){const x=120+r()*1680,y=300+r()*480;many+=s13_pulse(x,y,g+i*.37,{max:70,n:2,op:.6,w:4,col:i%2?s13_C:s13_Y,min:8})+s13_fish(x,y,.35,g+i,['#FFB86B','#7CF5A0','#FF8FA3'][i%3],i%2?1:-1);}}
  return `${s13_water(g)}${al?many:''}${s13_weed(420,830,420,g)}${s13_weed(560,830,340,g,'#3FA35C')}
   ${fi?s13_pulse(480,560,g,{max:200,n:3,op:.8}):''}${s13_fish(490,560,.8,g,'#FFB86B',1)}${s13_weed(470,830,300,g,'#2A7A40')}
   ${cr?s13_pulse(1380,800,g,{max:200,ry:.6,op:.8}):''}${s13_crab(1380,820,.9,g,{buried:1})}${s13_crab(1660,830,.7,g+1,{buried:1})}${cr?s13_pulse(1660,810,g+.4,{max:150,ry:.6,op:.7}):''}
   ${glint({x:1000,y:400,s:.7,t:g,rot:70,pose:'up',eyes:'closed',mouth:'grin'})}
   ${fi?`<g transform="translate(480,350)">${labelPill(0,0,'FISH IN SEAWEED',s13_Y,38)}</g>`:''}${cr?`<g transform="translate(1500,620)">${labelPill(0,0,'BURIED CRABS',s13_C,38)}</g>`:''}
   ${T(960,150,ev?'TINY ELECTRIC WHISPERS':'THE OCEAN IS ALIVE',{size:94,fill:ev?s13_Y:P.white,sc:pop(t,ev?p.every??8.4:al?p.alive??1.7:0)})}`;
},
shkCheat(t,d,p,g){
  const wa=AT(t,p.water??2.7), ln=AT(t,p.land??8.5);
  if(!wa) return `${card('cardDark',g)}${glint({x:560,y:520,s:1.1,t:g,pose:'shrug',mouth:'smirk',brows:'raised',blink:BL(g)})}${T(1300,470,"LET'S CHEAT",{size:110,fill:s13_Y,sc:IN(t,.9)})}${T(1300,620,'A LITTLE',{size:110,fill:P.white,sc:IN(t,1.2)})}`;
  const pan=(x,lab,col,strong,bgc)=>`<g transform="translate(${x},500)"><rect x="-340" y="-260" width="680" height="520" rx="30" fill="${bgc}" stroke="${INK}" stroke-width="10"/>${s13_pulse(0,0,g,{max:strong?240:90,n:4,op:strong?.9:.35})}${strong?s13_sparks(0,0,120,g,6,71):''}<circle r="22" fill="${s13_Y}" stroke="${INK}" stroke-width="5"/>${T(0,220,lab,{size:52,fill:col,stroke:8})}</g>`;
  return `${card('cardDark',g)}${pan(520,'WATER: GREAT',s13_C,true,'#0C3A5E')}${pan(1400,'AIR: WEAK',P.coral,false,'#3A2E48')}
   ${ln?`${stamp(960,520,1.1*pop(t,p.land??8.5),'ON LAND TOO!',s13_Y,-10)}`:''}
   ${T(960,150,ln?"LET'S IMAGINE...":'IT WORKS BEST IN WATER',{size:90,fill:P.white,sc:pop(t,ln?p.land??8.5:p.water??2.7)})}`;
},
shkHouse(t,d,p,g){
  const lo=AT(t,p.loud??1.6),ch=AT(t,p.charger??2.6),wi=AT(t,p.wiring??5.1),lp=AT(t,p.laptop??8.6),tv=AT(t,p.tv??9.6),fr=AT(t,p.fridge??10.7),all=AT(t,p.all??12.1);
  const wires=wi?`<path d="M0 250 H1920 M420 250 V820 M1100 250 V820 M1560 250 V820" stroke="${s13_Y}" stroke-width="8" stroke-dasharray="26 16" stroke-dashoffset="${-g*80}" opacity=".8"/><path d="M0 250 H1920" stroke="${s13_Y}" stroke-width="30" opacity=".12"/>`:'';
  return `${bgRoom(g)}${wires}
   <g transform="translate(330,380)"><rect x="-150" y="-100" width="300" height="190" rx="12" fill="#1C2433" stroke="${INK}" stroke-width="10"/><rect x="-130" y="-82" width="260" height="154" rx="6" fill="#3B6E9A"/></g>${tv?s13_pulse(330,380,g,{max:200,n:3})+s13_zap(330,250,80,-90,g,81):''}
   <g transform="translate(1720,620)"><rect x="-120" y="-260" width="240" height="470" rx="18" fill="#E8EEF5" stroke="${INK}" stroke-width="10"/><path d="M-120 -80 H120 M80 -200 V-120 M80 -40 V60" stroke="${INK}" stroke-width="8"/></g>${fr?s13_pulse(1720,600,g,{max:220,n:3})+s13_zap(1720,340,80,-90,g,82):''}
   <rect x="1180" y="760" width="360" height="24" rx="8" fill="#7A5A3A" stroke="${INK}" stroke-width="6"/><path d="M1200 784 V830 M1520 784 V830" stroke="${INK}" stroke-width="10"/>
   <g transform="translate(1360,760)"><path d="M-120 0 H120 L100 -12 H-100Z" fill="#9AA7BD" stroke="${INK}" stroke-width="6"/><path d="M-100 -12 L-110 -150 H110 L100 -12" fill="#2A3248" stroke="${INK}" stroke-width="7"/></g>${lp?s13_pulse(1360,690,g,{max:170,n:3})+s13_zap(1360,600,70,-90,g,83):''}
   <g transform="translate(700,760)"><rect x="-30" y="-50" width="60" height="80" rx="10" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><path d="M0 30 Q0 80 80 70" stroke="#E8EEF5" stroke-width="8" fill="none"/><rect x="70" y="50" width="70" height="36" rx="8" fill="${INK}"/></g>${ch?s13_pulse(700,740,g,{max:150,n:3})+s13_sparks(700,730,70,g,5,85):''}
   ${glint({x:960,y:500,s:.85,t:g,pose:all?'up':'shrug',legs:all?'wobble':'stand',mouth:all?'wavy':lo?'o':'smile',brows:all?'angry':'raised',blink:BL(g),shiver:all?.6:0})}
   ${[['CHARGER',ch,700,640],['WIRING',wi,1100,300],['LAPTOP',lp,1360,560],['TV',tv,330,560],['FRIDGE',fr,1720,320]].map(([s,on,x,y])=>on?`<g transform="translate(${x},${y})">${labelPill(0,0,s,s13_Y,32)}</g>`:'').join('')}
   ${T(960,150,all?'BZZZZZZZ':lo?"AND IT'S LOUD":'YOUR HOUSE...',{size:100,fill:all?s13_Y:P.white,sc:pop(t,all?p.all??12.1:lo?p.loud??1.6:.2)})}`;
},
shkWires(t,d,p,g){
  const pl=AT(t,p.plug??4.1);let wp='';for(let i=0;i<10;i++)wp+=`<path d="M${i*190+60} 220 V840" stroke="#3B4A78" stroke-width="40" opacity=".35"/>`;
  return `<rect width="1920" height="1080" fill="#22305A"/>${wp}<rect y="840" width="1920" height="240" fill="#141C34"/>
   <path d="M0 330 H700 V700 H1500 V330 H1920" stroke="${s13_Y}" stroke-width="10" fill="none" stroke-dasharray="30 16" stroke-dashoffset="${-g*90}"/><path d="M0 330 H700 V700 H1500 V330 H1920" stroke="${s13_Y}" stroke-width="40" fill="none" opacity=".15"/>
   <path d="M1100 700 V840" stroke="${s13_C}" stroke-width="8" stroke-dasharray="20 14" stroke-dashoffset="${-g*90}"/>
   <rect x="1640" y="300" width="20" height="540" fill="${INK}"/>
   ${glint({x:520,y:520,s:1,t:g,pose:'reach',eyes:'closed',mouth:pl?'o':'smile',brows:pl?'raised':'calm'})}
   ${pl?`${s13_pulse(1800,640,g,{max:260,n:4,col:s13_C})}<g transform="translate(1800,640)"><rect x="-40" y="-50" width="80" height="100" rx="10" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/></g>${s13_sparks(1800,640,80,g,5,91)}${T(1500,520,'NEXT ROOM: CLICK!',{size:54,fill:s13_C,sc:pop(t,p.plug??4.1)})}`:''}
   ${T(960,150,'WIRES BEHIND THE WALL',{size:96,fill:s13_Y,sc:IN(t,.2)})}`;
},
shkStorm(t,d,p,g){
  const st=AT(t,p.storm??3.4);const cx=lerp(2400,1300,eout(prog(t,p.storm??3.4,(p.storm??3.4)+2.5)));
  const chg=prog(t,(p.storm??3.4)+1.5,d);
  return `${nightSky(g)}${s13_DEF}${s13_tower(260,460,1)}${s13_tower(1020,500,.9)}
   <path d="M150 490 Q640 600 1120 520 M150 560 Q640 680 1120 590 M1120 520 Q1500 610 1980 540" stroke="#9AA7BD" stroke-width="5" fill="none"/>
   ${[0,1,2,3,4].map(i=>s13_zap(200+i*200,560+((i*37)%40),130,8,g,100+i,s13_Y,6,st?.5:1)).join('')}
   ${!st?T(640,780,'ROAR!',{size:110,fill:s13_Y,sc:IN(t,.5),rot:-6}):''}
   ${st?`${s13_cloud(cx,330,1.6)}${s13_cloud(cx+380,260,1.2,'#33385A')}${[0,1,2,3,4,5].map(i=>T(cx-200+i*90,340+(i%2)*30,'+',{size:54,fill:s13_Y,stroke:8,op:clamp(chg*3-i*.3)})).join('')}
     ${chg>.5&&(g%1.6)<.25?s13_zap(cx,400,320,95,g,111,'#fff',10):''}`:''}
   ${glint({x:st?820:1500,y:600,s:.85,t:g,pose:'point',look:1,mouth:st?'o':'grin',brows:'raised',blink:BL(g)})}
   ${T(960,150,st?'A STORM IS COMING':'POWER LINES ROAR',{size:96,fill:P.white,sc:pop(t,st?p.storm??3.4:.2)})}`;
},
shkPlatypus(t,d,p,g){
  const pl=AT(t,p.platy??2.9), sw=AT(t,p.sweep??8.6);
  return `${s13_water(g)}${s13_weed(160,830,240,g)}
   ${sw?[[1240,800,'shrimp'],[1500,820,'worm'],[1700,790,'shrimp']].map(([x,y,k],i)=>`${s13_pulse(x,y,g+i*.4,{max:120,ry:.6,n:3,op:.85})}${k==='worm'?`<path d="M${x-50} ${y} q12 -20 25 0 t25 0 t25 0 t25 0" stroke="${INK}" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M${x-50} ${y} q12 -20 25 0 t25 0 t25 0 t25 0" stroke="#FF8FA3" stroke-width="10" fill="none" stroke-linecap="round"/>`:`<path d="M${x-40} ${y} Q${x} ${y-50} ${x+40} ${y}" stroke="${INK}" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M${x-40} ${y} Q${x} ${y-50} ${x+40} ${y}" stroke="#FFA07A" stroke-width="16" fill="none" stroke-linecap="round"/>`}`).join(''):''}
   ${s13_platypus(sw?lerp(720,860,prog(t,p.sweep??8.6,d)):760,560,1.25,g,{sweep:sw})}
   ${pl&&!sw?['EYES: SHUT','EARS: SHUT','NOSE: SHUT'].map((s,i)=>`<g transform="translate(1450,${330+i*150})">${labelPill(0,0,s,'#9AA7BD',46)}</g>`).join(''):''}
   ${sw?s13_sparks(1060,550,90,g,5,121,s13_C):''}
   ${T(960,150,sw?'SWEEP... AND FEEL':'THE PLATYPUS',{size:100,fill:sw?s13_Y:P.white,sc:pop(t,sw?p.sweep??8.6:.2)})}`;
},
shkBee(t,d,p,g){
  const be=p.bee??2.45, ln=p.land??6.85, sk=p.skip??10.8, nc=p.nectar??15.3;
  if(t<be) return `${s13_water(g,{sand:false})}${s13_pulse(1100,520,g,{max:300,n:4,col:s13_C,op:.6})}${s13_dolphin(960,560,1.3,g)}${T(960,170,'SOME DOLPHINS TOO',{size:96,fill:s13_C,sc:IN(t,.2)})}`;
  const k1=eout(prog(t,ln-1.2,ln)), dr=AT(t,ln);
  const b1x=lerp(400,1100,k1)+(dr?0:Math.sin(g*3)*20), b1y=lerp(330,470,k1)+(dr?0:Math.sin(g*5)*16);
  const k2=prog(t,sk,sk+3.2), b2x=lerp(1900,1250,Math.sin(k2*Math.PI)), b2y=300+Math.sin(g*5)*14;
  return `${s13_DEF}${plGarden(g)}${s13_flower(1100,560,1,g,{charge:dr?.7:1,drained:dr})}${s13_flower(500,620,.8,g+1,{col:'#B47CFF'})}
   ${s13_bee(b1x,b1y,.9,g,1)}${AT(t,sk)?s13_bee(b2x,b2y,.8,g+.5,k2>.5?1:-1):''}
   ${AT(t,sk)&&k2>.35&&k2<.75?`<g transform="translate(1480,170)">${bubble(0,0,380,100,'NOPE, TAKEN',{size:48,tail:'right'})}</g>`:''}
   ${dr&&!AT(t,sk)?T(1420,420,'CHARGE CHANGES',{size:60,fill:s13_Y,sc:pop(t,ln)}):''}
   ${AT(t,nc)?T(960,860,'NECTAR ALREADY TAKEN',{size:64,fill:P.coral,sc:pop(t,nc)}):''}
   ${T(AT(t,sk)?700:960,150,'BEES FEEL FLOWERS',{size:96,fill:P.white,sc:IN(t,be+.2)})}
   ${AT(t,p.secret??18)?`<rect width="1920" height="1080" fill="#05081A" opacity=".75"/>${T(960,480,'A SECRET',{size:150,fill:s13_Y,sc:pop(t,p.secret??18)})}${T(960,660,'LANGUAGE',{size:150,fill:P.white,sc:pop(t,(p.secret??18)+.3)})}${s13_sparks(960,560,420,g,8,151)}`:''}`;
},
shkDeterrent(t,d,p,g){
  const bl=AT(t,p.blast??10.45), tu=AT(t,p.turn??15.5);
  const sx=tu?lerp(1350,2400,prog(t,p.turn??15.5,(p.turn??15.5)+2)):lerp(2300,1350,eout(prog(t,.5,4)));
  return `${s13_water(g)}${s13_pulse(780,640,g,{max:bl?700:420,n:6,col:P.red,op:.8,speed:1.6,w:10})}
   ${glint({x:560,y:420,s:.8,t:g,legs:'wobble',pose:'shrug',mouth:tu?'grin':'o',brows:'raised',blink:BL(g)})}
   <path d="M620 560 L740 640" stroke="${INK}" stroke-width="8"/><g transform="translate(780,640)"><rect x="-70" y="-30" width="140" height="60" rx="14" fill="#2A3248" stroke="${INK}" stroke-width="7"/><circle cx="40" cy="0" r="10" fill="${P.red}" opacity="${.5+.5*Math.sin(g*12)}"/></g>${s13_sparks(780,640,110,g,6,131,s13_Y)}${!bl?T(780,800,'POWERFUL PULSES',{size:50,fill:P.red,stroke:8,sc:IN(t,2)}):''}
   ${s13_shark(sx,500,.95,g,{dir:tu?1:-1,mouth:bl&&!tu?'grim':'flat',eye:bl&&!tu?'x':'open'})}
   ${bl&&!tu?`${[0,1,2].map(i=>`<path d="M${1050-i*40} ${420+i*60} q-30 20 0 40 q30 20 0 40" stroke="${s13_Y}" stroke-width="10" fill="none" opacity="${.5+.5*Math.sin(g*10+i)}"/>`).join('')}${T(1350,300,'BLAAARRGH!',{size:84,fill:P.red,sc:pop(t,p.blast??10.45),rot:-5})}`:''}
   ${tu?T(1400,330,'NOPE!',{size:110,fill:s13_Y,sc:pop(t,p.turn??15.5)}):''}
   ${T(960,150,'SHARK DETERRENTS',{size:96,fill:P.white,sc:IN(t,.2)})}`;
},
shkCable(t,d,p,g){
  const wh=AT(t,p.why??4.2), id=AT(t,p.idea??6.6), wr=AT(t,p.wrap??11.7);
  const cab=`<path d="M-50 780 Q600 720 1100 770 T1980 740" stroke="${INK}" stroke-width="66" fill="none"/><path d="M-50 780 Q600 720 1100 770 T1980 740" stroke="${wr?'#C9A46A':'#3A3F55'}" stroke-width="50" fill="none"/>${wr?`<path d="M-50 780 Q600 720 1100 770 T1980 740" stroke="${INK}" stroke-width="50" fill="none" stroke-dasharray="8 40" opacity=".5"/>`:''}`;
  const fld=id?[200,600,1000,1400,1800].map((x,i)=>s13_pulse(x,760,g+i*.3,{max:130,n:2,op:.7,ry:.7,col:i%2?s13_C:s13_Y})).join(''):'';
  return `${s13_water(g)}${fld}${cab}
   ${s13_shark(lerp(1340,1300,Math.sin(g*3)*.5+.5),640,.9,g,{dir:-1,mouth:wr?'flat':'open'})}
   ${wh&&!id?T(1500,420,'?',{size:220,fill:s13_Y,sc:pop(t,p.why??4.2)}):''}
   ${id&&!wr?T(700,520,'CONFUSING FIELDS?',{size:64,fill:s13_C,sc:pop(t,p.idea??6.6)}):''}
   ${wr?T(700,520,'TOUGHER WRAP, JUST IN CASE',{size:56,fill:'#E8C88A',sc:pop(t,p.wrap??11.7)}):''}
   ${T(960,150,'SHARKS BITING CABLES?',{size:96,fill:P.white,sc:IN(t,.2)})}`;
},
shkMagnet(t,d,p,g){
  const tr=AT(t,p.tried??3.6), im=AT(t,p.implant??5.1), nr=AT(t,p.near??9.3), fl=AT(t,p.feel??15.4), wk=AT(t,p.weak??18.7);
  if(wk) return `${card('cardDark',g)}
   ${[[540,"SHARK",1,s13_Y],[1380,"MAGNET FINGER",.18,s13_C]].map(([x,s,v,c],i)=>`<g transform="translate(${x},560)"><rect x="-90" y="-300" width="180" height="420" rx="20" fill="#18213A" stroke="${INK}" stroke-width="9"/><rect x="-70" y="${100-380*v*eout(prog(t,p.weak??18.7,(p.weak??18.7)+1.2))}" width="140" height="${380*v*eout(prog(t,p.weak??18.7,(p.weak??18.7)+1.2))}" rx="12" fill="${c}"/>${T(0,210,s,{size:52,fill:c,stroke:8})}</g>`).join('')}
   ${AT(t,p.taste??21.3)?T(960,870,'A TASTE OF IT',{size:64,fill:P.white,sc:pop(t,p.taste??21.3)}):''}${T(960,150,'NOWHERE NEAR A SHARK',{size:90,fill:P.white,sc:pop(t,p.weak??18.7)})}`;
  const jit=nr?Math.sin(g*60)*4:0;
  return `${card('cardDark',g)}
   ${tr?`<g transform="translate(${jit},0)"><rect x="-80" y="420" width="560" height="380" rx="120" fill="#FFD3A8" stroke="${INK}" stroke-width="10"/><rect x="300" y="450" width="560" height="130" rx="65" fill="#FFD3A8" stroke="${INK}" stroke-width="10"/><path d="M760 470 Q820 470 830 515 Q820 560 760 560" fill="#FFE8D6" stroke="${INK}" stroke-width="6"/>
     ${im?`<circle cx="720" cy="515" r="60" fill="#E8A888" stroke="${s13_Y}" stroke-width="6" stroke-dasharray="10 8"/><rect x="690" y="500" width="60" height="30" rx="6" fill="${P.red}" stroke="${INK}" stroke-width="5"/><rect x="720" y="500" width="30" height="30" rx="4" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/>${T(720,400,'TINY MAGNET',{size:50,fill:s13_Y,stroke:8,sc:pop(t,p.implant??5.1)})}`:''}</g>`:glint({x:960,y:540,s:1.05,t:g,pose:'shrug',mouth:'smirk',brows:'raised',blink:BL(g)})}
   ${nr?`<g transform="translate(1460,600)"><rect x="-230" y="-150" width="460" height="300" rx="20" fill="#E8EEF5" stroke="${INK}" stroke-width="10"/><rect x="-200" y="-120" width="290" height="240" rx="12" fill="#2A3248" stroke="${INK}" stroke-width="6"/><circle cx="160" cy="-60" r="20" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/></g>${s13_pulse(1460,600,g,{max:420,n:5,col:s13_C,op:.75})}${T(960,880-30,'BZZZ',{size:70,fill:s13_Y,sc:pop(t,p.near??9.3)})}`:''}
   ${fl?T(1460,330,'INVISIBLE FIELDS',{size:64,fill:s13_C,sc:pop(t,p.feel??15.4)}):''}
   ${T(960,150,tr?'MAGNETS IN FINGERTIPS':'COULD YOU FEEL IT?',{size:90,fill:P.white,sc:pop(t,tr?p.tried??3.6:.2)})}`;
},
shkBeach(t,d,p,g){
  const cr=AT(t,p.crab??4.7), fi=AT(t,p.fish??7.5), fr=AT(t,p.friend??9.3);const wx=lerp(560,820,prog(t,0,d));
  return `${s13_DEF}<rect width="1920" height="1080" fill="url(#s13_beach)"/>${nightSky(g).replace(/<rect[^>]*fill="#05060F"\/>/,'').replace(/<path d="M0 1080[^>]*\/>/,'')}
   <circle cx="1600" cy="190" r="70" fill="#FFF4DC"/><circle cx="1600" cy="190" r="200" fill="url(#gWhite)" opacity=".25"/>
   <rect y="470" width="1920" height="220" fill="#12305A"/>${[0,1,2].map(i=>`<path d="M0 ${520+i*60} ${[...Array(20)].map((_,j)=>`Q${j*100+50} ${510+i*60+Math.sin(g*2+j+i)*12} ${j*100+100} ${520+i*60}`).join(' ')}" stroke="#7CC4FF" stroke-width="4" fill="none" opacity=".4"/>`).join('')}
   <path d="M0 690 Q960 650 1920 700 V1080 H0Z" fill="#3A3448"/>
   ${fi?[[300,560],[1300,600],[1650,540]].map(([x,y],i)=>s13_pulse(x,y,g+i*.5,{max:120,n:3,op:.8,col:s13_C})).join(''):''}
   ${cr?[[200,820],[1500,830],[1150,860]].map(([x,y],i)=>s13_pulse(x,y,g+i*.4,{max:110,ry:.5,n:3,op:.85})+s13_crab(x,y+20,.45,g+i,{buried:1})).join(''):''}
   ${extra({x:wx+280,y:520,s:.8,t:g,head:'#FFB4A2'})}${fr?s13_pulse(wx+280,560,g,{max:200,n:3,op:.85})+s13_heartMini(wx+280,580,.12,g,1.2):''}
   ${glint({x:wx,y:500,s:.85,t:g,legs:'walk',eyes:'closed',mouth:'smile'})}
   ${!cr?T(960,150,'THE BEACH, AT NIGHT',{size:90,fill:P.white,sc:IN(t,.3)}):''}
   ${[['CRABS',cr,320,720],['FISH',fi,1300,460],['A HEARTBEAT',fr,wx+280,250]].map(([s,on,x,y])=>on?`<g transform="translate(${x},${y})">${labelPill(0,0,s,s13_Y,40)}</g>`:'').join('')}`;
}
});
