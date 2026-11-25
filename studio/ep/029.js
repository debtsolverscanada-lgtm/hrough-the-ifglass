// episode 029 scenes (swap bodies with your bully) — story episode
// Colour code for whose MIND is inside a body: Glint = blue, Dex = orange (matches the thumbnail split).
const t29_B='#4DA8FF', t29_O='#FF8A2A';
// SWAP LOCKS IN keyframes: [global seconds, seconds left] — lands on each spoken time
const t29_KF=[[374.0,10800],[400.4,10520],[400.5,7200],[418.4,7020],[418.5,6600],[455.7,6240],[455.8,2700],[486.7,2400],[486.77,1200],[508.0,1080],[508.11,120]];
function t29_left(gt){const K=t29_KF;if(gt<=K[0][0])return K[0][1];for(let i=1;i<K.length;i++)if(gt<=K[i][0])return lerp(K[i-1][1],K[i][1],(gt-K[i-1][0])/(K[i][0]-K[i-1][0]));return K[K.length-1][1];}
function t29_fmt(sec){sec=Math.max(0,Math.ceil(sec));const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}
function t29_timer(sec,g,o={}){const {x=1640,y=120,s=1,label='SWAP LOCKS IN',done=0}=o;const c=done?P.mint:sec<=1800?P.red:t29_O;const pl=done?1:1+.03*Math.sin(g*8);
  return `<g transform="translate(${x},${y}) scale(${(s*pl).toFixed(3)})"><rect x="-250" y="-82" width="500" height="164" rx="20" fill="#120610" fill-opacity=".92" stroke="${c}" stroke-width="7"/>
   <g transform="translate(-200,-40)"><rect x="-14" y="-6" width="28" height="22" rx="4" fill="${c}"/><path d="M-9 -6 V-14 A9 9 0 0 1 9 -14 V-6" stroke="${c}" stroke-width="5" fill="none"/></g>
   <text x="18" y="-30" text-anchor="middle" font-size="30" font-weight="900" letter-spacing="3" fill="${c}">${done?'SWAP UNDONE':label}</text>
   <text y="52" text-anchor="middle" font-size="84" font-weight="900" fill="#fff" style="font-variant-numeric:tabular-nums">${t29_fmt(sec)}</text></g>`;}
const t29_DEF=`<defs><radialGradient id="t29gB"><stop offset="0" stop-color="${t29_B}" stop-opacity=".75"/><stop offset="1" stop-color="${t29_B}" stop-opacity="0"/></radialGradient>
 <radialGradient id="t29gO"><stop offset="0" stop-color="${t29_O}" stop-opacity=".75"/><stop offset="1" stop-color="${t29_O}" stop-opacity="0"/></radialGradient>
 <linearGradient id="t29ward" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10283C"/><stop offset="1" stop-color="#1C4258"/></linearGradient>
 <linearGradient id="t29flat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2E2A"/><stop offset="1" stop-color="#55403A"/></linearGradient>
 <linearGradient id="t29gym" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1E2C"/><stop offset="1" stop-color="#34324A"/></linearGradient>
 <linearGradient id="t29sep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A3A28"/><stop offset="1" stop-color="#2A2016"/></linearGradient>
 <linearGradient id="t29day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB8E8"/><stop offset="1" stop-color="#CFE6F5"/></linearGradient></defs>`;
// PLUS: / MINUS: label (pops centre, tucks top-left) — same grammar as the other story episodes
function t29_pm(t,kind,sub){const plus=kind==='plus',col=plus?P.mint:P.red,k=eout(prog(t,2.1,2.7)),sc=lerp(1,.4,k)*pop(t,.02,.4),x=lerp(960,330,k),y=lerp(470,105,k);
  return `<rect width="1920" height="1080" fill="#05030C" opacity="${(.62*(1-k)).toFixed(3)}"/><g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(3)}) rotate(${(-3*(1-k)).toFixed(2)})">${T(0,0,plus?'PLUS:':'MINUS:',{size:230,fill:col,stroke:52})}${T(0,150,sub,{size:96,fill:P.white})}</g>`;}
function t29_bub(x,y,w,l1,l2,o={}){const {size=46,tail='left',sc=1,fill='#FFF6EA',col=INK}=o;const h=l2?size*2.7:size*1.8,tx=tail==='left'?-w/2+60:tail==='right'?w/2-60:0;
  return `<g transform="translate(${x},${y}) scale(${typeof sc==='number'?sc.toFixed(3):sc})"><path d="M${-w/2} ${-h/2} H${w/2} V${h/2} H${tx+30} L${tx} ${h/2+46} L${tx-14} ${h/2} H${-w/2}Z" fill="${fill}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   <text y="${l2?-size*.2:size*.35}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${col}">${l1}</text>${l2?`<text y="${size*1.0}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${col}">${l2}</text>`:''}</g>`;}
const t29_pill=(x,y,str,col,size=44,sc=1)=>`<g transform="translate(${x},${y}) scale(${(+sc).toFixed(3)})">${labelPill(0,0,str,col,size)}</g>`;
const t29_title=(t,a,str,col=P.white,size=90,y=150)=>T(960,y,str,{size,fill:col,sc:a==null?IN(t,.1):pop(t,a)});
// ---------- mind marker: glow behind a body + floating name tag above it ----------
function t29_mindGlow(x,y,r,who,g){return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${(r*1.35).toFixed(0)}" fill="url(#${who==='glint'?'t29gB':'t29gO'})" opacity="${(.55+.15*Math.sin(g*3)).toFixed(2)}"/>`;}
function t29_mindTag(x,y,who,g,s=1){const col=who==='glint'?t29_B:t29_O,lab=who==='glint'?'GLINT INSIDE':'DEX INSIDE',w=lab.length*24+92,b=Math.sin(g*2.2)*6;
  const ic=who==='glint'?`<circle cx="-12" r="11" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="12" r="11" fill="none" stroke="${INK}" stroke-width="5"/>`:`<path d="M-14 8 L0 -14 L14 8Z" fill="${INK}"/>`;
  return `<g transform="translate(${x},${(y+b).toFixed(1)}) scale(${s})"><path d="M-14 30 L0 52 L14 30Z" fill="${col}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="${-w/2}" y="-30" width="${w}" height="62" rx="31" fill="${col}" stroke="${INK}" stroke-width="7"/>
   <g transform="translate(${-w/2+40},0)">${ic}</g><text x="${22}" y="12" text-anchor="middle" font-size="34" font-weight="900" letter-spacing="2" fill="${INK}">${lab}</text></g>`;}
// ---------- Glint (wrapper adds the mind marker) ----------
function t29_gl(o){const {x=0,y=0,s=1,t=0,mind=null,tag=true,gy=null}=o;const yy=gy!=null?gy-300*s:y;const oo={...o,y:yy};
  const by=Math.sin(t*2.4)*5;let pre='',post='';
  if(mind){pre=t29_mindGlow(x,yy+by+20*s,230*s,mind,t);if(tag)post=t29_mindTag(x,yy+by-215*s,mind,t,Math.max(.7,s*.9));}
  return pre+glint(oo)+post;}
function t29_glHead(x,y,s,t){return [x,y+Math.sin(t*2.4)*5-60*s,92*s];}
// ---------- Dex Harlow: big, buzz cut, black-and-orange jacket ----------
function t29_dex(o){
  const {x=0,y=0,s=1,t=0,pose='down',mouth='smirk',brows='angry',blink=0,look=0,legs='stand',mind=null,tag=true,guard=false,rot=0,sweat=0,gy=null,kid=false}=o;
  const S=s*1.2, yy=gy!=null?gy-300*S:y, by=Math.sin(t*2.4+1)*5, LW=19, skin='#E2A97E', jk=guard?'#1E2436':'#24222E', st=guard?'#9AA7BD':t29_O;
  const limb=(d,col)=>`<path d="${d}" stroke="${INK}" stroke-width="${LW+12}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${col}" stroke-width="${LW}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const wa=Math.sin(t*9)*20;
  const A={down:['M-58 46 Q-84 100 -80 160','M58 46 Q84 100 80 160'],point:['M-58 46 Q-84 100 -80 160','M58 46 L130 40 L200 16'],
    up:[`M-58 46 Q-110 10 -130 ${-60+Math.sin(t*6)*8}`,`M58 46 Q110 10 130 ${-60+Math.sin(t*6+1)*8}`],hips:['M-58 46 Q-110 90 -40 128','M58 46 Q110 90 40 128'],
    cross:['M-58 46 Q-60 110 44 96','M58 46 Q60 116 -44 84'],hold:['M-58 46 Q-50 110 20 104','M58 46 Q60 110 70 96'],reach:['M-58 46 Q-110 40 -190 20','M58 46 Q110 40 190 20'],
    slam:['M-58 46 Q-84 100 -80 160',`M58 46 Q120 -40 ${80} ${-120}`],shrug:['M-58 46 Q-110 70 -140 10','M58 46 Q110 70 140 10'],
    braid:['M-58 46 Q-40 -10 -30 -60','M58 46 Q40 -10 30 -60'],handout:['M-58 46 Q-84 100 -80 160','M58 46 Q110 110 170 120'],wave:['M-58 46 Q-84 100 -80 160',`M58 46 Q130 40 ${150+wa*.4} ${-30+wa}`]}[pose]||[];
  const lg=legs==='walk'?Math.sin(t*8)*22:0;
  const L=legs==='sit'?['M-30 180 L-110 180 L-110 300','M30 180 L90 185 L90 300']:[`M-26 180 Q${-36-lg} 240 ${-50-lg} 300`,`M26 180 Q${36+lg} 240 ${50+lg} 300`];
  const sleeve=jk;
  const torso=`<path d="M-74 30 Q0 14 74 30 L84 192 Q0 206 -84 192Z" fill="${jk}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M-30 26 L0 66 L30 26" fill="${guard?'#E8ECF4':'#3A3848'}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M-80 150 H80" stroke="${st}" stroke-width="12"/><path d="M-78 166 H78" stroke="${st}" stroke-width="6" opacity=".8"/>
    ${guard?`<rect x="18" y="80" width="50" height="28" rx="5" fill="#E8ECF4" stroke="${INK}" stroke-width="4"/><text x="43" y="100" text-anchor="middle" font-size="16" font-weight="900" fill="${INK}">SEC</text>`:`<circle cx="44" cy="96" r="14" fill="${t29_O}" stroke="${INK}" stroke-width="4"/>`}`;
  const ey=-66, lx=look*8;
  const eyes=blink?`<path d="M-44 ${ey} h26 M18 ${ey} h26" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`
    :mouth==='o'||mouth==='scream'?`<circle cx="${-30+lx}" cy="${ey}" r="15" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="${-30+lx}" cy="${ey}" r="7" fill="${INK}"/><circle cx="${30+lx}" cy="${ey}" r="15" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="${30+lx}" cy="${ey}" r="7" fill="${INK}"/>`
    :`<circle cx="${-30+lx}" cy="${ey}" r="10" fill="${INK}"/><circle cx="${30+lx}" cy="${ey}" r="10" fill="${INK}"/>`;
  const bY={calm:-98,raised:-112,angry:-90,sad:-100}[brows]||-96, bR={calm:0,raised:-8,angry:18,sad:-16}[brows]||0;
  const brow=(cx,d)=>`<g transform="translate(${cx},${bY}) rotate(${bR*d})"><rect x="-22" y="-8" width="44" height="16" rx="7" fill="${INK}"/></g>`;
  const M={smile:`<path d="M-24 -20 Q0 0 24 -20" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    smirk:`<path d="M-22 -16 Q6 -8 26 -28" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>`,
    laugh:`<path d="M-30 -30 H30 Q26 8 0 8 Q-26 8 -30 -30Z" fill="#3a1220" stroke="${INK}" stroke-width="6"/><path d="M-26 -29 H26 L24 -20 H-24Z" fill="#fff"/>`,
    grin:`<path d="M-30 -28 Q0 8 30 -28Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`,
    frown:`<path d="M-22 -8 Q0 -28 22 -8" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>`,
    flat:`<path d="M-18 -16 H18" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`,
    o:`<ellipse cx="0" cy="-14" rx="14" ry="18" fill="#3a1220" stroke="${INK}" stroke-width="6"/>`,
    scream:`<ellipse cx="0" cy="-10" rx="24" ry="30" fill="#3a1220" stroke="${INK}" stroke-width="6"/>`,
    wavy:`<path d="M-26 -14 q6 -8 13 0 t13 0 t13 0 t13 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`}[mouth]||'';
  const hair=`<path d="M-86 -82 Q-90 -150 0 -154 Q90 -150 86 -82 Q80 -122 0 -126 Q-80 -122 -86 -82Z" fill="#2A1C14" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    ${[-56,-30,-4,22,48].map((hx,i)=>`<path d="M${hx} ${-138+Math.abs(hx)*.12} l6 -6" stroke="#4A3424" stroke-width="5" stroke-linecap="round"/>`).join('')}`;
  const jaw=`<path d="M-62 -8 Q0 36 62 -8" stroke="#B9835C" stroke-width="16" fill="none" opacity=".55" stroke-linecap="round"/>`;
  const SW=sweat?`<path d="M84 -118 q10 18 0 26 q-10 -8 0 -26Z" fill="#9AD1FF" stroke="${INK}" stroke-width="4"/>`:'';
  const head=`<g transform="translate(0,${kid?8:0})"><ellipse cx="0" cy="-58" rx="${kid?84:92}" ry="${kid?86:94}" fill="${skin}" stroke="${INK}" stroke-width="10"/>
    <ellipse cx="-92" cy="-56" rx="14" ry="22" fill="${skin}" stroke="${INK}" stroke-width="7"/><ellipse cx="92" cy="-56" rx="14" ry="22" fill="${skin}" stroke="${INK}" stroke-width="7"/>
    ${hair}${jaw}${brow(-30,1)}${brow(30,-1)}${eyes}<path d="M-6 -50 Q-12 -34 4 -32" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>${M}
    <ellipse cx="-58" cy="-26" rx="14" ry="8" fill="${P.coral}" opacity=".3"/><ellipse cx="58" cy="-26" rx="14" ry="8" fill="${P.coral}" opacity=".3"/>${SW}</g>`;
  let pre='',post='';
  if(mind){pre=t29_mindGlow(x,yy+by+20*S,250*S,mind,t);if(tag)post=t29_mindTag(x,yy+by-230*S,mind,t,Math.max(.7,s*.9));}
  return `${pre}<g transform="translate(${x},${(yy+by).toFixed(1)}) rotate(${rot}) scale(${S.toFixed(3)})"><ellipse cx="0" cy="${(302-by/S).toFixed(1)}" rx="96" ry="14" fill="rgba(0,0,0,.35)"/>
    ${limb(L[0],'#2B3350')}${limb(L[1],'#2B3350')}${torso}${A[0]?limb(A[0],sleeve):''}${A[1]?limb(A[1],sleeve):''}
    ${A[0]?`<circle cx="${A[0].split(' ').slice(-2)[0]}" cy="${A[0].split(' ').slice(-1)[0]}" r="17" fill="${skin}" stroke="${INK}" stroke-width="6"/>`:''}${A[1]?`<circle cx="${A[1].split(' ').slice(-2)[0]}" cy="${A[1].split(' ').slice(-1)[0]}" r="17" fill="${skin}" stroke="${INK}" stroke-width="6"/>`:''}
    ${head}</g>${post}`;}
function t29_dxHead(x,y,s,t){const S=s*1.2;return [x,y+Math.sin(t*2.4+1)*5-58*S,93*S];}
// ---------- Poppy (8): pigtails, gap tooth. gown=true in hospital ----------
function t29_poppy(o){const {x=0,y=0,s=1,t=0,mouth='gap',blink=0,pose='down',gown=false,look=0,gy=null,brows='calm',tear=0}=o;
  const yy=gy!=null?gy-200*s:y, by=Math.sin(t*2.6+2)*3, LW=12;const top=gown?'#BFE3F2':'#FFD84D', top2=gown?'#8CC6DE':'#E2B21E';
  const limb=(d,col=P.cream)=>`<path d="${d}" stroke="${INK}" stroke-width="${LW+9}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${col}" stroke-width="${LW}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const A={down:['M-20 30 Q-40 60 -46 104','M20 30 Q40 60 46 104'],up:['M-20 30 Q-60 0 -76 -50','M20 30 Q60 0 76 -50'],
    hold:['M-20 30 Q-40 60 -46 104','M20 30 Q60 50 96 50'],both:['M-20 30 Q-70 50 -110 40','M20 30 Q70 50 110 40'],point:['M-20 30 Q-40 60 -46 104','M20 30 L80 10 L130 -10']}[pose];
  const M={gap:`<path d="M-22 -26 Q0 2 22 -26Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="-4" y="-27" width="8" height="12" fill="#3a1220"/>`,
    smile:`<path d="M-16 -22 Q0 -6 16 -22" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    frown:`<path d="M-14 -10 Q0 -24 14 -10" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    o:`<ellipse cx="0" cy="-16" rx="10" ry="13" fill="#3a1220" stroke="${INK}" stroke-width="5"/>`}[mouth];
  const bY=brows==='sad'?-84:-88, bR=brows==='sad'?-14:brows==='raised'?-6:0;
  return `<g transform="translate(${x},${(yy+by).toFixed(1)}) scale(${s})"><ellipse cx="0" cy="${(202-by/s).toFixed(1)}" rx="54" ry="10" fill="rgba(0,0,0,.3)"/>
   ${limb('M-14 118 Q-18 160 -24 200')}${limb('M14 118 Q18 160 24 200')}
   <path d="M-30 20 Q0 12 30 20 L54 124 Q0 136 -54 124Z" fill="${top}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>${gown?[[-20,60],[14,82],[-8,104],[26,50]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="5" fill="${top2}"/>`).join(''):`<path d="M-40 96 H40" stroke="${top2}" stroke-width="7"/>`}
   ${limb(A[0])}${limb(A[1])}
   <circle cx="-74" cy="-74" r="26" fill="#6A3A1E" stroke="${INK}" stroke-width="6"/><circle cx="74" cy="-74" r="26" fill="#6A3A1E" stroke="${INK}" stroke-width="6"/><circle cx="-56" cy="-86" r="9" fill="${t29_O}" stroke="${INK}" stroke-width="4"/><circle cx="56" cy="-86" r="9" fill="${t29_O}" stroke="${INK}" stroke-width="4"/>
   <circle cx="0" cy="-50" r="64" fill="#F0C29A" stroke="${INK}" stroke-width="8"/>
   <path d="M-62 -66 Q-60 -116 0 -118 Q60 -116 62 -66 Q40 -96 0 -94 Q-40 -96 -62 -66Z" fill="#6A3A1E" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
   <path d="M-${30} ${bY} h18 M12 ${bY} h18" stroke="#6A3A1E" stroke-width="6" stroke-linecap="round" transform="rotate(${bR} 0 ${bY})"/>
   ${blink?`<path d="M-30 -54 h16 M14 -54 h16" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`:`<ellipse cx="${-22+look*6}" cy="-54" rx="10" ry="12" fill="${INK}"/><ellipse cx="${22+look*6}" cy="-54" rx="10" ry="12" fill="${INK}"/><circle cx="${-19+look*6}" cy="-58" r="3.5" fill="#fff"/><circle cx="${25+look*6}" cy="-58" r="3.5" fill="#fff"/>`}
   ${M}<circle cx="-40" cy="-28" r="10" fill="#FF8FA3" opacity=".45"/><circle cx="40" cy="-28" r="10" fill="#FF8FA3" opacity=".45"/>
   ${tear?`<path d="M-30 -38 q8 16 0 22 q-8 -6 0 -22Z" fill="#9AD1FF" stroke="${INK}" stroke-width="3" opacity="${tear}"/>`:''}</g>`;}
// ---------- Dex's dad: grey cardigan, stubble, crutch ----------
CAST.dad={skin:'#D9A07A',top:'#8E8A94',top2:'#6E6A76',hair:'#6E6A70',s:1.0};
function t29_dad(o){const {x=0,y=0,s=1,t=0,sleep=0,gy=null,legs='sit'}=o;const yy=gy!=null?gy-300*s:y;
  const crutch=`<g transform="translate(${x+130*s},${yy})" ><path d="M0 ${-20*s} L${-20*s} ${300*s}" stroke="${INK}" stroke-width="${16*s}" stroke-linecap="round"/><path d="M0 ${-20*s} L${-20*s} ${300*s}" stroke="#9AA7BD" stroke-width="${8*s}" stroke-linecap="round"/><path d="M${-24*s} ${-22*s} H${24*s}" stroke="${INK}" stroke-width="${18*s}" stroke-linecap="round"/></g>`;
  const zz=sleep?[0,1,2].map(i=>{const k=((t*.5+i/3)%1);return T(x+60*s+k*60,yy-200*s-k*90,'Z',{size:40+k*20,fill:'#C9D2E0',op:(1-k).toFixed(2)});}).join(''):'';
  return crutch+person({x,y:yy,s,t,who:'dad',legs,mouth:sleep?'flat':'smile',brows:sleep?'calm':'sad',blink:sleep?1:BL(t)})+`<path d="M${x-40*s} ${yy-4*s} Q${x} ${yy+26*s} ${x+40*s} ${yy-4*s}" stroke="#8A6A5A" stroke-width="${10*s}" fill="none" opacity=".5"/>`+zz;}
// ---------- props ----------
function t29_chair(x,y,s=1,dir=1,col='#5A3A8A'){return `<g transform="translate(${x},${y}) scale(${s*dir},${s})"><rect x="-120" y="-310" width="70" height="300" rx="26" fill="${col}" stroke="${INK}" stroke-width="8"/><rect x="-130" y="-60" width="260" height="70" rx="22" fill="${col}" stroke="${INK}" stroke-width="8"/><path d="M-90 10 V120 M90 10 V120" stroke="${INK}" stroke-width="14"/><path d="M-110 120 H-60 M60 120 H110" stroke="${INK}" stroke-width="12" stroke-linecap="round"/></g>`;}
// helmet with tiny camera, worn on a head (cx,cy,r = head circle). headset=true adds goggles
function t29_helmet(cx,cy,r,o={}){const {headset=true,lit=1,dir=1,g=0,burnt=0}=o;const k=r/92;const led=(Math.sin(g*6)>0||!lit)?(lit?P.red:'#444'):'#661';
  return `<g transform="translate(${cx},${cy}) scale(${k*dir},${k})"><path d="M-100 -20 Q-104 -128 0 -132 Q104 -128 100 -20 Z" fill="#D9DEE8" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>
   <path d="M-80 -60 Q0 -96 80 -60" stroke="#AEB6C6" stroke-width="10" fill="none"/>${burnt?`<path d="M-60 -100 l20 10 l-8 16 M40 -110 l16 18" stroke="#333" stroke-width="8"/>`:''}
   <g transform="translate(0,-138)"><rect x="-34" y="-28" width="68" height="44" rx="10" fill="#2A3248" stroke="${INK}" stroke-width="7"/><circle cx="0" cy="-6" r="13" fill="#7CF5FF" stroke="${INK}" stroke-width="5"/><circle cx="26" cy="-20" r="5" fill="${led}"/></g>
   ${headset?`<rect x="-92" y="-92" width="184" height="70" rx="26" fill="#2A3248" stroke="${INK}" stroke-width="9"/><rect x="-74" y="-80" width="148" height="46" rx="18" fill="${lit?t29_B:'#334'}" opacity="${lit?(.55+.3*Math.sin(g*4)).toFixed(2):1}"/>`:''}</g>`;}
// cardboard phone headset, worn
function t29_cardboard(cx,cy,r,o={}){const {g=0,phone=true}=o;const k=r/92;return `<g transform="translate(${cx},${cy}) scale(${k})">
   <rect x="-96" y="-98" width="192" height="76" rx="12" fill="#C9A06A" stroke="${INK}" stroke-width="9"/><path d="M-96 -60 H-110 M96 -60 H110" stroke="${INK}" stroke-width="8"/><path d="M-100 -74 Q0 -170 100 -74" stroke="#3A3F58" stroke-width="12" fill="none"/>
   ${phone?`<g transform="translate(0,-150)"><rect x="-48" y="-30" width="96" height="58" rx="10" fill="#1A1A26" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="0" r="12" fill="#7CF5FF" stroke="${INK}" stroke-width="4"/><circle cx="30" cy="-16" r="5" fill="${Math.sin(g*6)>0?P.red:'#622'}"/></g>`:''}
   <path d="M-30 -60 h60" stroke="#8E6A3A" stroke-width="6"/></g>`;}
function t29_rig(x,y,s,g,o={}){const {on=1,burnt=0,smoke=0,spark=0}=o;let sm='';
  if(smoke>0)for(let i=0;i<7;i++){const k=((g*.4+i/7)%1);sm+=`<circle cx="${(Math.sin(g*1.5+i)*40+(i%3-1)*40).toFixed(0)}" cy="${(-140-k*300).toFixed(0)}" r="${(24+k*50).toFixed(0)}" fill="#6A6E80" opacity="${(smoke*.5*(1-k)).toFixed(2)}"/>`;}
  const btn=[0,1,2,3,4].map(i=>`<circle cx="${-120+i*60}" cy="-70" r="18" fill="${burnt?'#333':[t29_B,P.gold,P.red,P.mint,t29_O][i]}" stroke="${INK}" stroke-width="5" opacity="${burnt?1:(.5+.5*Math.abs(Math.sin(g*(on?5:0)+i))).toFixed(2)}"/>`).join('');
  const sp=spark?`<g opacity="${spark}"><path d="M0 -120 L-40 -220 L10 -200 L-20 -320" stroke="#fff" stroke-width="14" fill="none" stroke-linejoin="round"/><path d="M0 -120 L-40 -220 L10 -200 L-20 -320" stroke="${P.gold}" stroke-width="6" fill="none" stroke-linejoin="round"/><circle cy="-110" r="${(60+Math.sin(g*40)*14).toFixed(0)}" fill="url(#gGold)"/></g>`:'';
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-190" y="-120" width="380" height="120" rx="16" fill="${burnt?'#2A2626':'#2A3248'}" stroke="${INK}" stroke-width="9"/>
   <rect x="-160" y="-108" width="200" height="22" rx="6" fill="${burnt?'#111':'#0E1830'}"/>${btn}${burnt?`<path d="M-150 -40 l40 -20 l30 24 l50 -30 l40 20" stroke="#111" stroke-width="10" fill="none"/>`:''}
   <rect x="-150" y="0" width="300" height="140" fill="${burnt?'#221E1E':'#1E2436'}" stroke="${INK}" stroke-width="8"/><text y="100" text-anchor="middle" font-size="40" font-weight="900" fill="${burnt?'#555':t29_B}">SWAP</text>${sm}${sp}</g>`;}
function t29_museum(g,o={}){return `${t29_DEF}${t21_museum(g,o)}`;}
function t29_clock(x,y,r,h,m){const ah=((h%12)+m/60)*30,am=m*6;return `<g transform="translate(${x},${y})"><circle r="${r}" fill="#F4F1EA" stroke="${INK}" stroke-width="8"/>${[...Array(12)].map((_,i)=>`<path d="M0 ${-r+8} V${-r+20}" stroke="${INK}" stroke-width="5" transform="rotate(${i*30})"/>`).join('')}
   <path d="M0 0 V${-r*.5}" stroke="${INK}" stroke-width="8" stroke-linecap="round" transform="rotate(${ah})"/><path d="M0 0 V${-r*.78}" stroke="${INK}" stroke-width="5" stroke-linecap="round" transform="rotate(${am})"/><circle r="6" fill="${P.red}"/></g>`;}
// hospital ward at night
function t29_ward(g,o={}){const {lights=0}=o;let s=`${t29_DEF}<rect width="1920" height="1080" fill="url(#t29ward)"/><rect y="800" width="1920" height="280" fill="#0C1C2A"/><path d="M0 800 H1920" stroke="${INK}" stroke-width="6"/>
  ${[...Array(12)].map((_,i)=>`<path d="M${i*170} 800 L${i*170-120} 1080" stroke="#173246" stroke-width="4"/>`).join('')}
  <rect x="120" y="140" width="420" height="380" rx="10" fill="#0A1430"/>${t21_stars(g).replace(/cx="(\d+)"/g,(m,v)=>`cx="${140+(+v%380)}"`).replace(/cy="(\d+)"/g,(m,v)=>`cy="${160+(+v%330)}"`)}<circle cx="450" cy="230" r="44" fill="#FFF4DC"/><circle cx="450" cy="230" r="120" fill="url(#moon)" opacity=".5"/>
  <rect x="120" y="140" width="420" height="380" rx="10" fill="none" stroke="#C9D2E0" stroke-width="16"/><path d="M330 140 V520 M120 330 H540" stroke="#C9D2E0" stroke-width="10"/>
  <path d="M600 80 H1880" stroke="#9AA7BD" stroke-width="10"/>${[0,1,2,3,4,5,6].map(i=>`<path d="M${1460+i*60} 84 q-14 360 10 700" stroke="#5FA8A8" stroke-width="54" fill="none" opacity=".75"/>`).join('')}
  <rect x="1180" y="250" width="200" height="150" rx="14" fill="#1A1A26" stroke="${INK}" stroke-width="8"/><rect x="1196" y="266" width="168" height="118" rx="8" fill="#062018"/>${ecg(1200,330,160,g)}
  <path d="M1280 400 V800" stroke="#5D6A82" stroke-width="10"/>${t29_clock(700,330,50,o.h??11,o.m??0)}
  <rect x="0" y="0" width="1920" height="1080" fill="#FFE9B0" opacity="${(.04+lights*.1).toFixed(3)}"/>`;return s;}
function t29_bed(x,y,s=1,inner=''){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-330" y="-40" width="660" height="110" rx="20" fill="#E8ECF4" stroke="${INK}" stroke-width="9"/>
   <rect x="-330" y="-210" width="40" height="300" rx="12" fill="#9AA7BD" stroke="${INK}" stroke-width="8"/><rect x="290" y="-150" width="40" height="240" rx="12" fill="#9AA7BD" stroke="${INK}" stroke-width="8"/>
   <path d="M-300 70 V160 M300 70 V160" stroke="${INK}" stroke-width="14"/><circle cx="-300" cy="170" r="16" fill="#333" stroke="${INK}" stroke-width="5"/><circle cx="300" cy="170" r="16" fill="#333" stroke="${INK}" stroke-width="5"/>
   <rect x="-290" y="-80" width="160" height="60" rx="26" fill="#fff" stroke="${INK}" stroke-width="7"/>${inner}
   <path d="M-120 -44 Q100 -70 320 -40 L320 40 H-120Z" fill="#8CC6DE" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-80 -30 Q100 -56 300 -26" stroke="#BFE3F2" stroke-width="8" fill="none"/></g>`;}
// Dex's small flat kitchen
function t29_flatK(g,o={}){let s=`${t29_DEF}<rect width="1920" height="1080" fill="url(#t29flat)"/><rect y="800" width="1920" height="280" fill="#2A2220"/><path d="M0 800 H1920" stroke="${INK}" stroke-width="6"/>
  <rect x="1300" y="160" width="300" height="260" fill="#14183A"/><circle cx="1520" cy="230" r="26" fill="#fff4dc"/><rect x="1300" y="160" width="300" height="260" fill="none" stroke="#D8CFC0" stroke-width="14"/><path d="M1450 160 V420" stroke="#D8CFC0" stroke-width="10"/>
  <rect x="380" y="560" width="900" height="40" rx="8" fill="#B89870" stroke="${INK}" stroke-width="7"/><rect x="400" y="600" width="860" height="200" fill="#7A5E44" stroke="${INK}" stroke-width="7"/>${[0,1,2].map(i=>`<rect x="${420+i*285}" y="620" width="260" height="160" rx="6" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="${540+i*285}" cy="700" r="8" fill="${INK}"/>`).join('')}
  <rect x="160" y="380" width="200" height="420" rx="10" fill="#E8E2D6" stroke="${INK}" stroke-width="8"/><path d="M160 540 H360" stroke="${INK}" stroke-width="6"/><path d="M330 430 V500 M330 580 V660" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
  <path d="M880 470 h80 v90 h-80Z" fill="#E8E2D6" stroke="${INK}" stroke-width="6"/><path d="M1020 500 q30 -30 60 0 v60 h-60Z" fill="#C9575A" stroke="${INK}" stroke-width="6"/>`;
  return s;}
function t29_note(x,y,str,o={}){const {rot=0,sc=1,col='#FFE45C',size=34,w=230}=o;const L=Array.isArray(str)?str:[str];const h=L.length*size*1.2+44;
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${typeof sc==='number'?sc.toFixed(3):sc})"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" fill="${col}" stroke="${INK}" stroke-width="6"/><rect x="${-w/2}" y="${-h/2}" width="${w}" height="18" fill="#000" opacity=".08"/>
   ${L.map((l,i)=>`<text y="${((i-(L.length-1)/2)*size*1.2+size*.36+4).toFixed(1)}" text-anchor="middle" font-size="${size}" font-weight="900" font-style="italic" fill="#2A2A40">${l}</text>`).join('')}</g>`;}
function t29_street(g,o={}){const {night=0}=o;const r=rng(29);let b='';let x=-40;while(x<1980){const w=150+r()*200,h=260+r()*300;b+=`<rect x="${x.toFixed(0)}" y="${(800-h).toFixed(0)}" width="${w.toFixed(0)}" height="${(h+100).toFixed(0)}" fill="${night?'#1B1640':['#C9B8A8','#B8A898','#D4C4B0'][Math.floor(r()*3)]}" stroke="${INK}" stroke-width="5"/>`;
    for(let k=0;k<4;k++)b+=`<rect x="${(x+16+r()*(w-60)).toFixed(0)}" y="${(800-h+30+r()*(h-120)).toFixed(0)}" width="34" height="44" fill="${night?P.gold:'#7FA8C8'}" opacity="${night?.5:.8}" stroke="${INK}" stroke-width="4"/>`;x+=w+16;}
  return `${t29_DEF}<rect width="1920" height="1080" fill="${night?'url(#sky)':'url(#t29day)'}"/>${b}<rect y="800" width="1920" height="280" fill="${night?P.ground:'#8A8A94'}"/><rect y="800" width="1920" height="40" fill="${night?'#2A2238':'#B4B4BC'}" stroke="${INK}" stroke-width="5"/>`;}
function t29_busStop(x,y){return `<g transform="translate(${x},${y})"><path d="M-260 0 V-420 M260 0 V-420" stroke="${INK}" stroke-width="16"/><rect x="-290" y="-450" width="580" height="50" rx="10" fill="#E8414B" stroke="${INK}" stroke-width="8"/><rect x="-250" y="-400" width="500" height="300" fill="#BFE3F2" opacity=".35" stroke="${INK}" stroke-width="6"/><rect x="230" y="-520" width="90" height="90" rx="45" fill="#E8414B" stroke="${INK}" stroke-width="7"/><text x="275" y="-462" text-anchor="middle" font-size="44" font-weight="900" fill="#fff">BUS</text></g>`;}
function t29_gymBg(g){let s=`${t29_DEF}<rect width="1920" height="1080" fill="url(#t29gym)"/><rect y="800" width="1920" height="280" fill="#141420"/><path d="M0 800 H1920" stroke="${INK}" stroke-width="6"/>
  <rect x="100" y="120" width="1720" height="90" fill="#0E0E18" stroke="${INK}" stroke-width="6"/><text x="960" y="186" text-anchor="middle" font-size="64" font-weight="900" letter-spacing="14" fill="${t29_O}">IRON HOUSE GYM</text>
  ${[260,1660].map(x=>`<g transform="translate(${x},640)"><rect x="-120" y="-10" width="240" height="20" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/><rect x="-150" y="-60" width="34" height="120" rx="8" fill="#333" stroke="${INK}" stroke-width="5"/><rect x="116" y="-60" width="34" height="120" rx="8" fill="#333" stroke="${INK}" stroke-width="5"/><path d="M-90 10 V160 M90 10 V160" stroke="${INK}" stroke-width="10"/></g>`).join('')}
  <rect x="700" y="300" width="520" height="300" fill="#2A3248" stroke="${INK}" stroke-width="8"/><rect x="720" y="320" width="480" height="260" fill="#46507A" opacity=".5"/>`;return s;}
function t29_cup(x,y,s=1,crush=0,rot=0){const k=crush;return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-50 -110 L50 -110 L${40-k*30} ${-30+k*20} L${38-k*10} 0 L-38 0 L${-40+k*28} ${-40+k*30}Z" fill="#FFF6EA" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
   <rect x="-56" y="-124" width="112" height="20" rx="6" fill="#7A5A3A" stroke="${INK}" stroke-width="6"/><path d="M-46 -70 H46" stroke="${t29_O}" stroke-width="16" opacity="${1-k*.4}"/>${k>.3?`<path d="M-30 -60 l20 14 l-10 16 M20 -80 l-14 20" stroke="${INK}" stroke-width="5" fill="none"/>`:''}${k>.3?[[-70,-30],[70,-50],[-60,10]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="10" fill="#8A5A2A" opacity=".8"/>`).join(''):''}</g>`;}
function t29_hand(x,y,s=1,o={}){const {skin='#E2A97E',rot=0,sq=0,flip=1}=o;const q=1-sq*.08;return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s*flip*q},${s/q})">
   <path d="M-70 -60 Q-90 40 -40 80 Q20 110 70 70 Q100 30 90 -40 Z" fill="${skin}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
   ${[-48,-16,16,48].map((fx,i)=>`<path d="M${fx} -50 Q${fx+(i-1.5)*4} -120 ${fx+(i-1.5)*8} -146" stroke="${INK}" stroke-width="44" stroke-linecap="round" fill="none"/><path d="M${fx} -50 Q${fx+(i-1.5)*4} -120 ${fx+(i-1.5)*8} -146" stroke="${skin}" stroke-width="28" stroke-linecap="round" fill="none"/>`).join('')}
   <path d="M-70 -10 Q-130 -40 -140 -100" stroke="${INK}" stroke-width="46" stroke-linecap="round" fill="none"/><path d="M-70 -10 Q-130 -40 -140 -100" stroke="${skin}" stroke-width="30" stroke-linecap="round" fill="none"/></g>`;}
// a big hand holding a small hand, squeeze pulse sq 0..1
function t29_clasp(x,y,s,o={}){const {big='#E2A97E',small='#F0C29A',sq=0,sleeve='#24222E',sleeve2='#BFE3F2'}=o;const k=1-sq*.07;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-640 120 Q-400 80 -170 40" stroke="${INK}" stroke-width="190" stroke-linecap="round" fill="none"/><path d="M-640 120 Q-400 80 -170 40" stroke="${sleeve}" stroke-width="170" stroke-linecap="round" fill="none"/>
   <path d="M640 140 Q420 100 170 60" stroke="${INK}" stroke-width="110" stroke-linecap="round" fill="none"/><path d="M640 140 Q420 100 170 60" stroke="${sleeve2}" stroke-width="92" stroke-linecap="round" fill="none"/>
   <g transform="scale(${k})"><ellipse cx="40" cy="40" rx="150" ry="110" fill="${small}" stroke="${INK}" stroke-width="10"/>
   <path d="M-210 -60 Q-60 -150 120 -80 Q200 -40 190 40 Q170 140 20 150 Q-160 150 -230 60Z" fill="${big}" stroke="${INK}" stroke-width="11" stroke-linejoin="round"/>
   ${[-40,20,80,140].map(fx=>`<path d="M${fx} -86 Q${fx+30} 0 ${fx+10} 120" stroke="#B9835C" stroke-width="8" fill="none" opacity=".6"/>`).join('')}
   <path d="M-120 -10 Q-40 30 60 10" stroke="#B9835C" stroke-width="8" fill="none" opacity=".6"/>${[-120,-70,-20,30].map(fx=>`<ellipse cx="${fx}" cy="-92" rx="24" ry="30" fill="${small}" stroke="${INK}" stroke-width="7"/>`).join('')}<ellipse cx="200" cy="30" rx="40" ry="26" fill="${small}" stroke="${INK}" stroke-width="7"/></g></g>`;}
function t29_pulse(x,y,g0,t,col,r0=120){if(g0<0||g0>1)return '';return `<circle cx="${x}" cy="${y}" r="${(r0+g0*200).toFixed(0)}" fill="none" stroke="${col}" stroke-width="${(16*(1-g0)).toFixed(1)}" opacity="${(1-g0).toFixed(2)}"/>`;}
function t29_notebook(x,y,s=1,o={}){const {open=0,rot=0,glow=0}=o;return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">${glow?`<circle r="300" fill="url(#gGold)" opacity="${glow}"/>`:''}
   <rect x="-170" y="-220" width="340" height="440" rx="18" fill="#3D6FB8" stroke="${INK}" stroke-width="10"/><rect x="-170" y="-220" width="44" height="440" rx="12" fill="#2A4E88" stroke="${INK}" stroke-width="8"/>
   <rect x="-90" y="-150" width="220" height="90" rx="10" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><text x="20" y="-118" text-anchor="middle" font-size="30" font-weight="900" fill="${INK}">GLINT'S</text><text x="20" y="-80" text-anchor="middle" font-size="30" font-weight="900" fill="${INK}">FACT BOOK</text>
   ${[[-40,30,1],[60,10,.8],[100,110,1.1],[-60,140,.9],[20,180,.7],[110,-190,.8],[-80,-10,.6]].map(([a,b,c])=>`<path d="M${a} ${b-26*c} L${a+8*c} ${b-8*c} L${a+26*c} ${b-6*c} L${a+12*c} ${b+6*c} L${a+16*c} ${b+24*c} L${a} ${b+14*c} L${a-16*c} ${b+24*c} L${a-12*c} ${b+6*c} L${a-26*c} ${b-6*c} L${a-8*c} ${b-8*c}Z" fill="${P.gold}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`).join('')}
   <path d="M150 -200 l14 30 M160 160 l12 -24" stroke="#2A4E88" stroke-width="8"/></g>`;}
function t29_brainMap(x,y,s,g,o={}){const {strip=1,hot=-1}=o;return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-260 40 Q-290 -150 -100 -200 Q40 -250 170 -180 Q290 -110 250 40 Q230 120 120 130 Q60 190 -40 150 Q-200 160 -260 40Z" fill="#F4A6B8" stroke="${INK}" stroke-width="10"/>
   <path d="M-180 -60 q40 -40 80 0 t80 0 M-200 40 q50 -40 100 0 t100 0 M60 -120 q40 30 80 0 M120 60 q30 -30 70 0" stroke="#D97A90" stroke-width="9" fill="none"/>
   ${strip?`<path d="M-10 -226 Q20 -60 -30 140" stroke="${P.gold}" stroke-width="${(34+6*Math.sin(g*4)).toFixed(0)}" fill="none" stroke-linecap="round" opacity="${(.6+.3*Math.sin(g*3)).toFixed(2)}"/>`:''}</g>`;}
// the homunculus: huge hands, huge lips, tiny back
function t29_homunculus(x,y,s,g){const w=Math.sin(g*3)*8,sk='#F2B48A';return `<g transform="translate(${x},${y}) scale(${s})">
   <path d="M-20 60 L-40 220 M20 60 L40 220" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="M-20 60 L-40 220 M20 60 L40 220" stroke="${sk}" stroke-width="14" stroke-linecap="round"/>
   <ellipse cx="-56" cy="236" rx="56" ry="26" fill="${sk}" stroke="${INK}" stroke-width="7"/><ellipse cx="56" cy="236" rx="56" ry="26" fill="${sk}" stroke="${INK}" stroke-width="7"/>
   <rect x="-34" y="-10" width="68" height="80" rx="24" fill="${sk}" stroke="${INK}" stroke-width="8"/>
   <path d="M-30 10 Q-100 0 -150 ${-30+w}" stroke="${INK}" stroke-width="26" stroke-linecap="round" fill="none"/><path d="M-30 10 Q-100 0 -150 ${-30+w}" stroke="${sk}" stroke-width="14" stroke-linecap="round" fill="none"/>
   <path d="M30 10 Q100 0 150 ${-30-w}" stroke="${INK}" stroke-width="26" stroke-linecap="round" fill="none"/><path d="M30 10 Q100 0 150 ${-30-w}" stroke="${sk}" stroke-width="14" stroke-linecap="round" fill="none"/>
   ${[[-230,-80+w,-1],[230,-80-w,1]].map(([hx,hy,d])=>`<g transform="translate(${hx},${hy}) scale(${d*1.15},1.15)">${t29_hand(0,0,.62,{skin:sk})}</g>`).join('')}
   <circle cx="0" cy="-90" r="88" fill="${sk}" stroke="${INK}" stroke-width="9"/><ellipse cx="-96" cy="-90" rx="30" ry="44" fill="${sk}" stroke="${INK}" stroke-width="7"/><ellipse cx="96" cy="-90" rx="30" ry="44" fill="${sk}" stroke="${INK}" stroke-width="7"/>
   <circle cx="-34" cy="-118" r="16" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="34" cy="-118" r="16" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-34" cy="-116" r="7" fill="${INK}"/><circle cx="34" cy="-116" r="7" fill="${INK}"/>
   <path d="M0 -104 q18 20 -2 30" stroke="${INK}" stroke-width="6" fill="none"/><ellipse cx="0" cy="-36" rx="70" ry="38" fill="#E8607A" stroke="${INK}" stroke-width="8"/><path d="M-62 -36 Q0 -22 62 -36" stroke="${INK}" stroke-width="6" fill="none"/>
   <ellipse cx="0" cy="-18" rx="30" ry="12" fill="#F08AA0" opacity=".9"/></g>`;}
function t29_brush(x,y,s=1,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-10" y="-200" width="20" height="150" rx="8" fill="#C9A46A" stroke="${INK}" stroke-width="6"/><rect x="-14" y="-60" width="28" height="30" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/><path d="M-14 -30 Q-18 10 0 30 Q18 10 14 -30Z" fill="#7A4A2A" stroke="${INK}" stroke-width="5"/></g>`;}
function t29_cal(x,y,s,n,lockA=0,o={}){const {labels=['SAT','SUN','MON','TUE','WED','THU','FRI']}=o;let c=`<rect x="-520" y="-150" width="1040" height="300" rx="20" fill="#F4F1EA" stroke="${INK}" stroke-width="10"/><rect x="-520" y="-150" width="1040" height="70" rx="20" fill="${P.red}" stroke="${INK}" stroke-width="10"/><text y="-100" text-anchor="middle" font-size="40" font-weight="900" fill="#fff" letter-spacing="6">7 DAYS</text>`;
  labels.forEach((l,i)=>{const cx=-450+i*150;c+=`<text x="${cx}" y="-20" text-anchor="middle" font-size="36" font-weight="900" fill="#2A2A35">${l}</text>`;if(i<n)c+=`<path d="M${cx-44} 10 L${cx+44} 100 M${cx+44} 10 L${cx-44} 100" stroke="${P.red}" stroke-width="12" stroke-linecap="round"/>`;});
  if(lockA>0)c+=`<g transform="translate(470,60) scale(${lockA.toFixed(3)})"><rect x="-60" y="-30" width="120" height="100" rx="14" fill="${P.gold}" stroke="${INK}" stroke-width="8"/><path d="M-36 -30 V-60 A36 36 0 0 1 36 -60 V-30" stroke="${INK}" stroke-width="14" fill="none"/><circle cy="18" r="12" fill="${INK}"/></g>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${c}</g>`;}
function t29_doorframe(x,y,h=560){return `<g transform="translate(${x},${y})"><rect x="-190" y="${-h}" width="380" height="${h}" fill="#2A1E1A"/><path d="M-190 0 V${-h} H190 V0" stroke="#C9A46A" stroke-width="40" fill="none"/><path d="M-190 0 V${-h} H190 V0" stroke="${INK}" stroke-width="6" fill="none"/><path d="M-210 ${-h-20} H210" stroke="${INK}" stroke-width="6"/></g>`;}
function t29_bonk(x,y,t,a){if(a==null||t<a||t>a+1.1)return '';const k=(t-a)/1.1;return `<g transform="translate(${x},${y}) scale(${pop(t,a,.2).toFixed(3)})" opacity="${(1-k).toFixed(2)}">${[0,1,2,3,4].map(i=>{const an=i*72+t*200;return `<g transform="rotate(${an}) translate(90,0)"><path d="M0 -16 L5 -5 L16 0 L5 5 L0 16 L-5 5 L-16 0 L-5 -5Z" fill="${P.gold}" stroke="${INK}" stroke-width="3"/></g>`;}).join('')}${T(0,-110,'BONK!',{size:64,fill:P.gold})}</g>`;}
function t29_bike(x,y,s,g){const sp=g*10;const wheel=cx=>`<g transform="translate(${cx},0)"><circle r="90" fill="none" stroke="${INK}" stroke-width="14"/><circle r="90" fill="none" stroke="#3A3F58" stroke-width="7"/>${[0,1,2,3].map(i=>`<path d="M0 0 L${(Math.cos(sp+i*.785)*86).toFixed(0)} ${(Math.sin(sp+i*.785)*86).toFixed(0)}" stroke="#9AA7BD" stroke-width="3"/>`).join('')}</g>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${wheel(-170)}${wheel(170)}<path d="M-170 0 L-40 -110 L110 -110 L170 0 M-40 -110 L0 0 L110 -110 M0 0 L-170 0 M110 -110 L100 -170 L150 -180" stroke="${P.red}" stroke-width="16" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M-70 -130 H-10" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M-120 -40 H-210" stroke="${INK}" stroke-width="10"/></g>`;}
function t29_frame(x,y,w,h,inner,col,label=''){return `<g transform="translate(${x},${y})"><clipPath id="t29c${Math.round(x)}${Math.round(y)}w${w}h${h}"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="26"/></clipPath><g clip-path="url(#t29c${Math.round(x)}${Math.round(y)}w${w}h${h})">${inner}</g><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="26" fill="none" stroke="${INK}" stroke-width="12"/><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="26" fill="none" stroke="${col}" stroke-width="6"/>${label?`<g transform="translate(0,${-h/2})">${labelPill(0,0,label,col,34)}</g>`:''}</g>`;}
function t29_split(left,right,g){return `<g><clipPath id="t29L"><rect width="960" height="1080"/></clipPath><clipPath id="t29R"><rect x="960" width="960" height="1080"/></clipPath><g clip-path="url(#t29L)">${left}</g><g clip-path="url(#t29R)">${right}</g><path d="M960 0 V1080" stroke="${INK}" stroke-width="16"/><path d="M960 0 V1080" stroke="#fff" stroke-width="6"/></g>`;}
function t29_school(g){return `${t29_DEF}<rect width="1920" height="1080" fill="url(#t29sep)"/><rect y="780" width="1920" height="300" fill="#2A2016"/>${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${100+i*220}" y="260" width="180" height="520" fill="#6A5236" stroke="${INK}" stroke-width="7"/><path d="M${130+i*220} 320 h120 M${130+i*220} 350 h120" stroke="${INK}" stroke-width="5"/><circle cx="${250+i*220}" cy="520" r="8" fill="${INK}"/>`).join('')}<path d="M0 780 H1920" stroke="${INK}" stroke-width="6"/>`;}
function t29_bin(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-80 -150 H80 L64 0 H-64Z" fill="#5D6A82" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><rect x="-92" y="-168" width="184" height="24" rx="8" fill="#7A879E" stroke="${INK}" stroke-width="7"/><path d="M-40 -130 V-20 M0 -130 V-20 M40 -130 V-20" stroke="#4A5468" stroke-width="7"/></g>`;}
// sepia tint for flashbacks
const t29_sepia=(inner)=>`<g style="filter:sepia(.75) saturate(.8)">${inner}</g>`;

Object.assign(SHOTS,{
s29Hook(t,d,p,g){
  const st=AT(t,p.stand),six=AT(t,p.six),wh=AT(t,p.who),go=AT(t,p.gog),tr=AT(t,p.tray),gi=AT(t,p.girl);
  if(!st){ // the threat, first frame
    return `${t29_ward(g,{h:0,m:0})}<rect width="1920" height="1080" fill="#05030C" opacity=".55"/>
     ${t29_dex({x:760,gy:980,s:1.1,t:g,mouth:'o',brows:'raised',mind:'glint',tag:false,sweat:1})}
     ${T(960,170,'STUCK IN HIS BULLY’S',{size:100,fill:P.white,sc:IN(t,0,.25)})}${T(960,290,'BODY FOREVER',{size:120,fill:t29_O,sc:IN(t,.25,.3)})}
     ${t29_timer(7200,g,{x:1520,y:560,s:1.05})}`;}
  if(wh&&!gi){ // whose body is it
    const k=eout(prog(t,p.who,p.who+1));
    return `${t29_card('cardWarm',g)}${t29_dex({x:960,gy:980,s:1.15,t:g,mouth:'smirk',brows:'angry',pose:'cross'})}
     ${t29_pill(960,170,'DEX HARLOW',t29_O,64,pop(t,p.who))}
     ${go?`${t29_bub(520,330,440,'“GOGGLES!”','',{size:60,tail:'right',sc:pop(t,p.gog)})}${T(470,520,'8 YEARS',{size:84,fill:P.gold,sc:pop(t,p.gog+.5)})}`:''}
     ${tr?`<g transform="translate(1460,520) rotate(${(-20+((t-p.tray)*260)%360).toFixed(0)}) scale(${pop(t,p.tray).toFixed(3)})"><rect x="-130" y="-20" width="260" height="40" rx="10" fill="#9AA7BD" stroke="${INK}" stroke-width="7"/><circle cx="-60" cy="-40" r="26" fill="#FF9F43" stroke="${INK}" stroke-width="5"/><rect x="10" y="-60" width="50" height="40" rx="6" fill="#FFF6EA" stroke="${INK}" stroke-width="5"/></g>${T(1460,760,'EVERY DAY OF SCHOOL',{size:52,fill:P.white,sc:pop(t,p.tray+.3)})}`:''}`;}
  // in the hospital, inside Dex's body
  const hold=gi;
  return `${t29_ward(g,{h:0,m:0})}
   ${t29_dex({x:hold?1060:960,gy:960,s:1.05,t:g,mouth:six?'wavy':'flat',brows:'raised',mind:'glint',pose:hold?'handout':'down',sweat:1})}
   ${hold?t29_poppy({x:1330,gy:960,s:1,t:g,gown:true,pose:'hold',mouth:'frown',brows:'sad',look:-1,dir:-1})+`<g transform="translate(${1330-96},${960-200+50})"></g>`:''}
   ${six&&!hold?`<g transform="translate(1500,560)"><path d="M0 -330 V330" stroke="${P.white}" stroke-width="8"/><path d="M-30 -330 H30 M-30 330 H30" stroke="${P.white}" stroke-width="8"/>${T(150,10,'6′4″',{size:96,fill:P.gold,sc:pop(t,p.six)})}</g>`:''}
   ${AT(t,p.fists)&&!hold?`<g transform="translate(420,700) scale(${pop(t,p.fists).toFixed(3)})">${t29_hand(0,0,1.1,{})}${T(0,190,'FISTS LIKE BREAD',{size:50,fill:P.white})}</g>`:''}
   ${t29_timer(7200,g,{x:1640,y:120,s:.8})}
   ${hold?T(800,170,'SHE WON’T LET GO',{size:96,fill:P.white,sc:pop(t,p.girl)}):T(800,170,'A CHILDREN’S HOSPITAL',{size:84,fill:P.white,sc:pop(t,p.stand)})}`;
},
s29Across(t,d,p,g){
  const ma=AT(t,p.mach),bx=AT(t,p.box);
  const left=`${t29_ward(g)}${t29_dex({x:480,gy:960,s:.9,t:g,mouth:'wavy',brows:'raised',mind:'glint'})}`;
  const right=`${t29_museum(g)}${t29_rig(1260,860,.9,g,{on:0,burnt:bx?1:0,smoke:bx?1:.4})}${t29_gl({x:1680,gy:960,s:.75,t:g,mind:'dex',mouth:'frown',brows:'angry'})}`;
  return `${t29_split(left,right,g)}${t29_timer(7200,g,{x:480,y:120,s:.7})}
   ${T(1440,150,ma?'THE ONLY WAY BACK':'DEX, IN GLINT’S FACE',{size:62,fill:ma?t29_O:P.white,sc:pop(t,ma?p.mach:.1)})}
   ${bx?`<g transform="translate(1440,950) scale(${pop(t,p.box).toFixed(3)})">${labelPill(0,0,'SMOKING BOX',P.red,50)}</g>`:''}`;
},
s29Seats(t,d,p,g){
  const sv=AT(t,p.seven),mu=AT(t,p.mus),ch=AT(t,p.chairs),he=AT(t,p.helm),hs=AT(t,p.head),op=AT(t,p.opp),sf=AT(t,p.self);
  if(!mu) return `${t29_card('cardDark',g)}<g transform="translate(960,420) scale(${pop(t,.05).toFixed(3)})">${[0,1].map(i=>`<path d="M${-20-i*110} -90 L${-150-i*110} 0 L${-20-i*110} 90Z" fill="${t29_B}" stroke="${INK}" stroke-width="10" stroke-linejoin="round" transform="translate(${130+((g*200)%40)},0)"/>`).join('')}</g>${T(960,660,"LET'S GO BACK",{size:110,fill:P.white,sc:IN(t,.1)})}${sv?T(960,800,'7 DAYS',{size:90,fill:t29_O,sc:pop(t,p.seven)}):''}`;
  if(op){ // the exhibit in action: two strangers see themselves
    const k=sf?eout(prog(t,p.self,p.self+1)):0;
    const A=extra({x:560,y:520,s:.85,t:g,head:'#F2C9A0',pose:'down'}),B=extra({x:1360,y:520,s:.85,t:g,head:'#9AD1FF',pose:'down'});
    const [ax,ay,ar]=[560,520+Math.sin(g*2.4+1)*4-55*.85,82*.85],[bx,by,br]=[1360,520+Math.sin(g*2.4+1)*4-55*.85,82*.85];
    return `${t29_museum(g)}${t29_chair(560,830,.9,1)}${t29_chair(1360,830,.9,-1)}${A}${B}${t29_helmet(ax,ay,ar,{g})}${t29_helmet(bx,by,br,{g,dir:-1})}
     <path d="M${ax+60} ${ay-120} Q960 ${ay-320} ${bx-60} ${by-120}" stroke="${t29_B}" stroke-width="8" fill="none" stroke-dasharray="20 16" stroke-dashoffset="${(-g*80).toFixed(0)}"/><path d="M${bx-60} ${by-90} Q960 ${by-260} ${ax+60} ${ay-90}" stroke="${t29_O}" stroke-width="8" fill="none" stroke-dasharray="20 16" stroke-dashoffset="${(-g*80).toFixed(0)}"/>
     ${sf?`<g transform="translate(960,700) scale(${k.toFixed(3)})">${t29_frame(0,0,520,300,`<rect x="-260" y="-150" width="520" height="300" fill="#1C1430"/>${extra({x:0,y:40,s:.6,t:g,head:'#F2C9A0'})}`,t29_B,'WHAT YOU SEE: YOU')}</g>`:''}
     ${T(960,150,sf?'SEE YOURSELF THROUGH THEIR EYES':'THE CAMERAS TRADE WHAT YOU SEE',{size:66,fill:P.white,sc:pop(t,sf?p.self:p.opp)})}`;}
  const helmS=he?pop(t,p.helm):0,hsS=hs?pop(t,p.head):0;
  return `${t29_museum(g)}${t21_sign(960,170,'SWAP SEATS',t29_B,g,84)}
   ${ch?t29_chair(560,830,1,1)+t29_chair(1360,830,1,-1):''}
   ${ch?T(960,320,'2 CHAIRS',{size:70,fill:P.white,sc:pop(t,p.chairs)}):''}
   ${he?`<g transform="translate(560,500) scale(${helmS.toFixed(3)})">${t29_helmet(0,0,92,{headset:hs,g})}</g><g transform="translate(1360,500) scale(${helmS.toFixed(3)})">${t29_helmet(0,0,92,{headset:hs,g,dir:-1})}</g>`:''}
   ${he?T(960,430,'2 HELMETS + CAMERAS',{size:56,fill:t29_B,sc:pop(t,p.helm)}):''}${hs?T(960,520,'2 HEADSETS',{size:56,fill:t29_O,sc:pop(t,p.head)}):''}
   ${t29_gl({x:960,gy:990,s:.8,t:g,mouth:'grin',brows:'raised',blink:BL(g)})}`;
},
s29Guard(t,d,p,g){
  const wk=AT(t,p.walk),sk=AT(t,p.sick),ag=AT(t,p.agency),dx=AT(t,p.dex);const enter=wk?eout(prog(t,p.walk,p.walk+2.2)):0;
  return `${t29_museum(g)}${t29_chair(700,830,.8,1)}${t29_chair(1180,830,.8,-1)}${t29_rig(940,830,.7,g)}
   ${t29_gl({x:700,gy:900,s:.72,t:g,legs:'sit',mouth:dx?'o':'smile',brows:dx?'raised':'calm',look:1,blink:BL(g)})}${(()=>{const [cx,cy,r]=t29_glHead(700,900-300*.72,.72,g);return t29_helmet(cx,cy,r,{g,headset:false});})()}
   ${wk?t29_dex({x:lerp(2150,1560,enter),gy:960,s:.95,t:g,guard:true,legs:enter<1?'walk':'stand',mouth:dx?'smirk':'flat',brows:'angry',look:-1}):''}
   ${wk?`<g transform="translate(${lerp(2150,1560,enter)+60},640) rotate(-20)"><rect x="-14" y="-50" width="28" height="100" rx="10" fill="#333" stroke="${INK}" stroke-width="5"/><circle cy="-60" r="22" fill="#FFF6D0" opacity=".9"/></g>`:''}
   <g transform="translate(260,140)"><rect x="-190" y="-60" width="380" height="120" rx="18" fill="#0B1026" stroke="${P.ice}" stroke-width="6"/>${T(0,24,'2:00 AM',{size:72,fill:P.ice})}</g>
   ${sk&&!ag?t29_pill(960,330,'USUAL GUARD: OFF SICK',P.ice,44,pop(t,p.sk)):''}${ag&&!dx?t29_pill(960,330,'THE AGENCY SENDS A COVER',P.gold,44,pop(t,p.agency)):''}
   ${dx?T(1100,170,'DEX HARLOW',{size:120,fill:t29_O,sc:pop(t,p.dex)}):T(1100,170,'TESTING IT ALONE',{size:80,fill:P.white,sc:IN(t,.1)})}`;
},
s29Taunt(t,d,p,g){
  const sa=AT(t,p.say),dr=AT(t,p.drop),sl=AT(t,p.slam),sp=AT(t,p.spark),bn=AT(t,p.bang),dk=AT(t,p.dark);
  if(dk){const k=prog(t,p.dark,p.dark+.8);return `<rect width="1920" height="1080" fill="#000"/>${T(960,560,'DARKNESS',{size:110,fill:'#333',op:(1-k*.6).toFixed(2)})}`;}
  const sh=bn?Math.sin(g*60)*14:sp?Math.sin(g*50)*5:0, fl=bn?Math.max(0,1-(t-p.bang)*1.6):0;
  const dxx=dr?1180:1500;const sit=dr;
  const [gx,gy0,gr]=t29_glHead(700,900-300*.72,.72,g);const [hx,hy,hr]=t29_dxHead(dxx,sit?900-300*1.2*.85:960-300*1.2*.85,.85,g);
  return `<g transform="translate(${sh.toFixed(1)},${(-sh*.5).toFixed(1)})">${t29_museum(g,{flare:fl})}${t29_chair(700,830,.8,1)}${t29_chair(1180,830,.8,-1)}${t29_rig(940,830,.7,g,{spark:sp?1:0})}
   ${t29_gl({x:700,gy:900,s:.72,t:g,legs:'sit',mouth:sp?'o':'flat',brows:sp?'raised':'sad',look:1,blink:sp?0:BL(g),shiver:sp?1:0})}${t29_helmet(gx,gy0,gr,{g})}
   ${t29_dex({x:dxx,gy:sit?900:960,s:.85,t:g,guard:true,legs:sit?'sit':'stand',pose:sl?'slam':sa?'point':'cross',mouth:sp?'scream':sa?'laugh':'smirk',brows:sp?'raised':'angry',look:-1,dir:-1})}${sit?t29_helmet(hx,hy,hr,{g,dir:-1}):''}
   ${sa&&!dr?t29_bub(1180,300,700,'“STILL PLAYING WITH','TOYS, GOGGLES?”',{size:52,tail:'right',sc:pop(t,p.say)}):''}
   ${sl&&!sp?`<g transform="translate(940,700) scale(${pop(t,p.slam).toFixed(3)})">${T(0,0,'SLAM!',{size:100,fill:t29_O})}</g>`:''}</g>
   <rect width="1920" height="1080" fill="#fff" opacity="${fl.toFixed(2)}"/>
   ${bn?T(960,180,'BANG!',{size:150,fill:P.gold,sc:pop(t,p.bang)}):sp?T(960,180,'A SPARK',{size:110,fill:P.gold,sc:pop(t,p.spark)}):''}`;
},
s29Wake(t,d,p,g){
  const fa=AT(t,p.far),ha=AT(t,p.hands),ac=AT(t,p.across),sc=AT(t,p.scream);
  if(ac){const k=eout(prog(t,p.across,p.across+1.4));
    return `${t29_museum(g)}${t29_chair(1180,830,.8,-1)}${t29_rig(800,830,.7,g,{on:0,smoke:1,burnt:1})}
     ${t29_gl({x:1300,gy:960,s:.9,t:g,mind:'dex',mouth:sc?'o':'flat',brows:'raised',pose:sc?'up':'down',shiver:sc?1:0,dir:-1,tag:sc})}
     ${t29_dex({x:lerp(500,430,k),gy:980,s:.85,t:g,mind:'glint',mouth:'o',brows:'raised',guard:true,sweat:1,tag:sc,look:1})}
     ${sc?T(1300,330,'AAAAH!',{size:90,fill:t29_O,sc:pop(t,p.scream),rot:6}):''}${T(960,150,'HIS OWN FACE',{size:100,fill:P.white,sc:pop(t,p.across)})}`;}
  if(ha) return `${t29_museum(g)}<rect width="1920" height="1080" fill="#05030C" opacity=".35"/>
     <g transform="translate(560,640) rotate(-12)">${t29_hand(0,0,1.7,{})}</g><g transform="translate(1360,640) rotate(12)">${t29_hand(0,0,1.7,{flip:-1})}</g>
     <path d="M560 1080 V900 M1360 1080 V900" stroke="${INK}" stroke-width="200"/><path d="M560 1080 V900 M1360 1080 V900" stroke="#1E2436" stroke-width="180"/>
     ${T(960,170,'HIS HANDS ARE ENORMOUS',{size:96,fill:P.gold,sc:pop(t,p.hands)})}`;
  return `${t29_museum(g)}${t29_rig(1500,830,.7,g,{on:0,smoke:1,burnt:1})}
   ${t29_dex({x:700,y:770,s:.85,t:0,rot:-90,blink:t<1.2?1:0,mouth:'wavy',guard:true,brows:'sad'})}
   ${fa?`<g transform="translate(1100,560)"><path d="M0 -260 V240" stroke="#fff" stroke-width="7" stroke-dasharray="18 14"/><path d="M-24 -230 L0 -264 L24 -230 M-24 210 L0 244 L24 210" stroke="#fff" stroke-width="7" fill="none"/></g>${T(1340,560,'FAR AWAY',{size:70,fill:P.white,sc:pop(t,p.far)})}`:''}
   ${T(960,150,'HE WAKES UP',{size:100,fill:P.white,sc:IN(t,.1)})}`;
},
s29Rules(t,d,p,g){
  const st=AT(t,p.str),mp=AT(t,p.map);
  if(mp){const k=eout(prog(t,p.map,p.map+1.2));return `${t29_card('cardMint',g)}${t29_brainMap(620,520,.9*k,g,{strip:0})}
     <g transform="translate(1340,560)">${glint({x:0,y:-60,s:.95,t:g,mouth:'smile',blink:BL(g)})}<path d="M-120 -260 H120 V300 H-120Z" fill="none" stroke="${t29_B}" stroke-width="6" stroke-dasharray="16 12" opacity="${k}"/></g>
     <path d="M880 500 Q1040 420 1180 500" stroke="${P.gold}" stroke-width="10" fill="none" stroke-dasharray="20 14" stroke-dashoffset="${(-g*60).toFixed(0)}" opacity="${k}"/>${T(960,150,'YOUR BRAIN KEEPS A MAP',{size:90,fill:P.white,sc:pop(t,p.map)})}`;}
  return `${t29_card('cardDark',g)}${t29_gl({x:960,gy:960,s:1,t:g,mouth:'smile',brows:'raised',pose:'hips',blink:BL(g)})}${T(960,170,'THE RULES',{size:130,fill:P.gold,sc:IN(t,.1)})}
   ${st?`<g transform="translate(960,860) rotate(-4) scale(${pop(t,p.str).toFixed(3)})">${labelPill(0,0,'STRANGER THAN THE SWAP',P.coral,52)}</g>`:''}`;
},
s29Penfield(t,d,p,g){
  const pe=AT(t,p.pen),sp=AT(t,p.strip),we=AT(t,p.weird),ho=AT(t,p.homo);
  if(we){const parts=[[p.hands,'HUGE HANDS',P.gold,330,420],[p.lips,'HUGE LIPS',P.coral,1590,420],[p.back,'TINY BACK','#9AD1FF',1590,760]];
    return `${t29_card('cardWarm',g)}${t29_homunculus(960,560,1.05*pop(t,p.weird),g)}
     ${parts.map(([a,l,c,x,y])=>AT(t,a)?t29_pill(x,y,l,c,48,pop(t,a)):'').join('')}
     ${T(960,150,ho?'THE HOMUNCULUS':'A WEIRD MAP',{size:100,fill:ho?P.gold:P.white,sc:pop(t,ho?p.homo:p.weird)})}${ho?T(960,1000,'“LITTLE MAN”',{size:50,fill:P.white,sc:pop(t,p.homo+.4)}):''}`;}
  return `${t29_DEF}<rect width="1920" height="1080" fill="#2A3A3A"/><rect y="800" width="1920" height="280" fill="#1A2626"/><circle cx="960" cy="0" r="520" fill="url(#gWhite)" opacity=".35"/>
   ${t29_brainMap(1180,500,1,g,{strip:sp?1:0})}${sp?`<g transform="translate(1180,840) scale(${pop(t,p.strip).toFixed(3)})">${labelPill(0,0,'A STRIP THAT MAPS EVERY PART OF YOU',P.gold,40)}</g>`:''}
   ${person({x:440,y:500,s:.9,t:g,who:'osei',mouth:'smile',pose:'point',blink:BL(g)}).replace(/#F4F6FA/g,'#DDE8E0')}
   <g transform="translate(260,140)"><rect x="-190" y="-60" width="380" height="120" rx="18" fill="#0B1026" stroke="${P.gold}" stroke-width="6"/>${T(0,24,'1930s',{size:72,fill:P.gold})}</g>
   ${pe?`<g transform="translate(1180,150) scale(${pop(t,p.pen).toFixed(3)})">${labelPill(0,0,'SURGEON WILDER PENFIELD',P.white,46)}</g>`:''}${pe?T(1180,260,'AWAKE PATIENTS',{size:54,fill:P.ice,sc:pop(t,p.pen+1)}):''}`;
},
s29Proprio(t,d,p,g){
  const nm=AT(t,p.name),se=AT(t,p.sens),lk=AT(t,p.look);
  const joints=[[-62,150],[62,150],[0,170],[-40,300],[40,300],[0,30],[-36,235],[36,235]];
  const dots=se?joints.map(([jx,jy],i)=>`<circle cx="${960+jx}" cy="${300+jy+Math.sin(g*2.4)*5}" r="${(16+6*Math.sin(g*6+i)).toFixed(1)}" fill="${t29_B}" stroke="${INK}" stroke-width="4" opacity="${pop(t,p.sens+i*.12).toFixed(2)}"/>`).join(''):'';
  const lines=se?joints.map(([jx,jy],i)=>`<path d="M${960+jx} ${300+jy} Q${960+jx*2} 200 960 ${180}" stroke="${t29_B}" stroke-width="4" fill="none" stroke-dasharray="10 10" stroke-dashoffset="${(-g*60).toFixed(0)}" opacity=".7"/>`).join(''):'';
  return `${t29_card('cardIce',g)}${lines}${glint({x:960,y:300,s:1,t:g,eyes:lk?'closed':'open',mouth:'smile',pose:lk?'up':'down',blink:BL(g)})}${dots}
   ${T(960,150,nm?'PROPRIOCEPTION':'A HIDDEN SENSE',{size:nm?110:96,fill:nm?t29_B:P.white,sc:pop(t,nm?p.name:.1)})}
   ${se?t29_pill(420,560,'MUSCLES + JOINTS',t29_B,46,pop(t,p.sens)):''}${lk?t29_pill(1500,560,'NO LOOKING NEEDED',P.gold,46,pop(t,p.look)):''}`;
},
s29Rubber(t,d,p,g){
  const fo=AT(t,p.fool),yr=AT(t,p.year),hi=AT(t,p.hid),ru=AT(t,p.rub),br=AT(t,p.brush),mi=AT(t,p.min),cl=AT(t,p.claim);
  if(!yr) return `${t29_card('cardWarm',g)}${t29_brainMap(960,560,1,g,{strip:1})}${fo?`<g transform="translate(960,560) rotate(-12) scale(${pop(t,p.fool).toFixed(3)})">${stamp(0,0,1.1,'FOOLED',P.red)}</g>`:''}${T(960,150,'THE SCARY PART',{size:100,fill:P.white,sc:IN(t,.1)})}`;
  const sw=br?Math.sin(g*5)*40:0;
  return `${t29_DEF}<rect width="1920" height="1080" fill="#1E2A3A"/><rect y="640" width="1920" height="440" fill="#8A6A4A"/><path d="M0 640 H1920" stroke="${INK}" stroke-width="8"/>
   ${t29_gl({x:1720,y:330,s:.6,t:g,mouth:mi?'o':'flat',brows:mi?'raised':'calm',look:-1,blink:BL(g)})}
   <rect x="1030" y="440" width="26" height="300" fill="#C9C2B8" stroke="${INK}" stroke-width="7"/>${!hi?T(1340,560,'?',{size:150,fill:'#9AA7BD'})+T(700,560,'?',{size:150,fill:'#9AA7BD'}):''}${hi?`<g transform="translate(1340,720) rotate(-90)">${t29_hand(0,0,.85,{skin:'#F2C9A0'})}</g>${t29_pill(1340,870,'REAL HAND (HIDDEN)','#9AA7BD',36,pop(t,p.hid))}`:''}
   ${ru?`<g transform="translate(700,720) rotate(-90)">${t29_hand(0,0,.85,{skin:'#F4A6B8'})}</g>${t29_pill(700,870,'RUBBER HAND',P.coral,40,pop(t,p.rub))}`:''}
   ${br?t29_brush(700+sw,640,1.1,20)+t29_brush(1340+sw,640,1.1,20)+`<path d="M760 520 Q1020 430 1280 520" stroke="${P.gold}" stroke-width="7" fill="none" stroke-dasharray="14 12"/>${T(1020,450,'SAME TIME',{size:44,fill:P.gold})}`:''}
   ${mi?`<g transform="translate(700,560) scale(${pop(t,p.min).toFixed(3)})"><circle r="${(70+10*Math.sin(g*6)).toFixed(0)}" fill="url(#gGold)"/></g>`:''}
   <g transform="translate(260,140)"><rect x="-190" y="-60" width="380" height="120" rx="18" fill="#0B1026" stroke="${P.gold}" stroke-width="6"/>${T(0,24,'1998',{size:72,fill:P.gold})}</g>
   ${cl?T(960,150,'THE BRAIN CLAIMED IT',{size:96,fill:P.gold,sc:pop(t,p.claim)}):mi?T(960,150,'THEY FELT THE RUBBER HAND',{size:80,fill:P.white,sc:pop(t,p.min)}):T(1100,150,'BOTVINICK & COHEN',{size:84,fill:P.white,sc:pop(t,p.year)})}`;
},
s29Ehrsson(t,d,p,g){
  const ca=AT(t,p.cam),sh=AT(t,p.shake),fe=AT(t,p.felt),sf=AT(t,p.self);
  const kf=fe?eout(prog(t,p.felt,p.felt+.8)):0,vx=lerp(620,380,kf),ex=lerp(1300,1540,kf);const [vhx,vhy,vhr]=[vx,520+Math.sin(g*2.4+1)*4-55*.9,82*.9],[ehx,ehy,ehr]=[ex,520+Math.sin(g*2.4+1)*4-55*.9,82*.9];
  const V=extra({x:vx,y:520,s:.9,t:g,head:'#F2C9A0',pose:sh?'point':'down'}),E=extra({x:ex,y:520,s:.9,t:g,head:'#9AD1FF',pose:sh?'point':'down'}).replace(/M0 40 L80 30 L150 10/,'M0 40 L-80 30 L-150 10');
  const view=`<rect x="-300" y="-170" width="600" height="340" fill="#1E2A3A"/>${extra({x:0,y:30,s:.75,t:g,head:'#F2C9A0',pose:'point'})}<rect x="-300" y="-170" width="600" height="340" fill="${t29_B}" opacity=".08"/>`;
  return `${t29_card('cardIce',g)}${V}${E}${t29_helmet(vhx,vhy,vhr,{g,headset:true}).replace(/<g transform="translate\(0,-138\)">[\s\S]*?<\/g>/,'')}${ca?`<g transform="translate(${ehx},${ehy-110}) scale(${pop(t,p.cam).toFixed(3)})"><rect x="-40" y="-30" width="80" height="54" rx="10" fill="#2A3248" stroke="${INK}" stroke-width="7"/><circle cx="-14" cy="-4" r="14" fill="#7CF5FF" stroke="${INK}" stroke-width="5"/><path d="M-60 -10 L-100 -40 M-60 10 L-100 30" stroke="#7CF5FF" stroke-width="5" opacity=".7"/></g>`:''}
   ${sh&&!fe?`<circle cx="960" cy="545" r="${(40+8*Math.sin(g*8)).toFixed(0)}" fill="url(#gGold)"/>`:''}
   ${fe?`<g transform="translate(960,560) scale(${(pop(t,p.felt)*.95).toFixed(3)})">${t29_frame(0,0,600,340,view,t29_B,'WHAT THE VOLUNTEER SEES')}</g>`:''}
   <g transform="translate(260,140)"><rect x="-190" y="-60" width="380" height="120" rx="18" fill="#0B1026" stroke="${P.gold}" stroke-width="6"/>${T(0,24,'2008',{size:72,fill:P.gold})}</g>
   ${sf?T(1080,150,'SHAKING HANDS WITH YOURSELF',{size:72,fill:P.gold,sc:pop(t,p.self)}):T(1100,150,'PETKOVIC & EHRSSON',{size:84,fill:P.white,sc:IN(t,.1)})}`;
},
s29Lock(t,d,p,g){
  const mv=AT(t,p.moved),ru=AT(t,p.rule),sv=AT(t,p.seven),lk=AT(t,p.lock);
  if(!ru) return `${t29_museum(g)}${t29_rig(960,860,1,g,{on:1})}<path d="M520 520 Q960 260 1400 520" stroke="${t29_B}" stroke-width="14" fill="none" stroke-dasharray="26 18" stroke-dashoffset="${(-g*120).toFixed(0)}"/><path d="M1400 600 Q960 860 520 600" stroke="${t29_O}" stroke-width="14" fill="none" stroke-dasharray="26 18" stroke-dashoffset="${(-g*120).toFixed(0)}"/>
    ${t29_gl({x:1500,gy:980,s:.7,t:g,mind:'dex',mouth:'frown',brows:'angry',tag:false})}${t29_dex({x:420,gy:980,s:.7,t:g,mind:'glint',mouth:'wavy',brows:'raised',guard:true,tag:false})}
    ${T(960,150,'IN THIS WORLD:',{size:86,fill:P.white,sc:IN(t,.1)})}${mv?T(960,270,'IT REALLY MOVED THEM',{size:90,fill:t29_B,sc:pop(t,p.moved)}):''}`;
  const n=sv?Math.min(7,Math.floor((t-p.seven)*1.6)+1):0;
  return `${t29_card('cardDark',g)}${t29_cal(960,560,1,n,lk?pop(t,p.lock):0)}${T(960,170,lk?'THEN THE SWAP LOCKS':'THE RULE',{size:lk?100:120,fill:lk?P.red:P.gold,sc:pop(t,lk?p.lock:p.rule)})}
   ${sv?`<g transform="translate(960,880) scale(${pop(t,p.seven).toFixed(3)})">${labelPill(0,0,'EACH BRAIN REDRAWS ITS MAP',t29_B,48)}</g>`:''}`;
},
s29Size(t,d,p,g){
  const th=AT(t,p.thinks),df=AT(t,p.diff),bu=AT(t,p.bus),fr=AT(t,p.frame),ev=AT(t,p.every),pl=AT(t,p.plan);
  if(bu){const hitA=fr?(ev?p.every:p.frame):p.bus;const k=prog(t,hitA,hitA+.35),back=Math.sin(Math.min(1,k)*Math.PI)*-10;
    const fx=960;
    return `${t29_flatK(g)}${t29_doorframe(fx,820,560)}${t29_dex({x:fx-80+back,gy:830,s:.95,t:g,mind:'glint',mouth:'o',brows:'raised',rot:back*.6,tag:false})}${t29_bonk(fx-60,830-560+10,t,hitA)}
     ${pl?`<g transform="translate(1520,520) scale(${pop(t,p.plan).toFixed(3)})"><rect x="-260" y="-150" width="520" height="300" rx="20" fill="#0B1026" stroke="${t29_B}" stroke-width="7"/>${T(0,-80,'BRAIN’S MAP',{size:40,fill:t29_B})}<path d="M-180 60 V-40 M-60 60 V-10" stroke="${t29_B}" stroke-width="30" stroke-linecap="round"/>${T(0,110,'OLD SIZE',{size:36,fill:P.white})}<path d="M60 60 V-100 M180 60 V-70" stroke="${t29_O}" stroke-width="30" stroke-linecap="round"/></g>`:''}
     ${pl?T(1100,150,'THE BODY DOESN’T MATCH',{size:90,fill:P.white,sc:pop(t,p.plan)}):T(1150,150,ev?'EVERY DOORFRAME':fr?'THE KITCHEN DOORFRAME':'THE BUS DOOR',{size:84,fill:P.gold,sc:pop(t,hitA)})}`;}
  return `${t29_card('cardDark',g)}${t29_pm(t,'minus','THE WRONG SIZE')}
   ${t>2.4?`<g>${glint({x:620,y:500,s:.8,t:g,mouth:'flat',blink:BL(g)})}<g opacity=".5">${''}</g>${t29_dex({x:1300,gy:980,s:1,t:g,mind:'glint',mouth:'wavy',brows:'raised',tag:false})}
     <path d="M840 740 V260 M1580 740 V180" stroke="#fff" stroke-width="6"/>${th?T(840,230,'5′9″',{size:70,fill:t29_B,sc:pop(t,p.thinks)}):''}${th?T(1580,150,'6′4″',{size:70,fill:t29_O,sc:pop(t,p.thinks+.4)}):''}
     ${df?['HEIGHT','MUSCLES','HORMONES'].map((l,i)=>AT(t,p.diff+i*.9)?t29_pill(600+i*360,820,l,[P.gold,t29_O,P.coral][i],40,pop(t,p.diff+i*.9)):'').join(''):''}
     ${th&&!df?T(1150,150,'HIS BRAIN: STILL 5′9″',{size:70,fill:P.white,sc:pop(t,p.thinks)}):''}</g>`:''}`;
},
s29Jar(t,d,p,g){
  const ja=AT(t,p.jar),po=AT(t,p.pop),ka=AT(t,p.kai);const lid=po?eout(prog(t,p.pop,p.pop+.8)):0;
  return `${t29_DEF}${t21_kitchen(g)}${t29_pm(t,'plus','STRENGTH')}
   ${t>2.4?`${person({x:420,y:520,s:.85,t:g,who:'nan',mouth:po?'laugh':'smile',brows:'raised',blink:BL(g)})}
   ${t29_dex({x:960,gy:820,s:.9,t:g,mind:'glint',pose:'hold',mouth:po?'grin':'flat',brows:'raised',tag:false})}
   ${ja?`<g transform="translate(1030,${600})"><rect x="-50" y="-70" width="100" height="120" rx="20" fill="#C9575A" stroke="${INK}" stroke-width="7"/><rect x="-40" y="-40" width="80" height="50" fill="#FFF6EA" stroke="${INK}" stroke-width="4"/><text y="-8" text-anchor="middle" font-size="22" font-weight="900" fill="${INK}">JAM</text>
     <g transform="translate(${lid*140},${-84-lid*260}) rotate(${lid*540})"><rect x="-56" y="-16" width="112" height="30" rx="8" fill="${P.gold}" stroke="${INK}" stroke-width="6"/></g></g>`:''}
   ${person({x:1520,y:520,s:.85,t:g,who:'kai',mouth:ka?'o':'smile',brows:ka?'raised':'calm',blink:BL(g)})}
   ${po?T(1030,280,'POP!',{size:120,fill:P.gold,sc:pop(t,p.pop)}):ja?T(1180,150,'THE JAR NOBODY CAN OPEN',{size:70,fill:P.white,sc:pop(t,p.jar)}):''}${ka?t29_pill(1520,960,'JAW: DROPPED',P.coral,40,pop(t,p.kai)):''}`:''}`;
},
s29Grip(t,d,p,g){
  const se=AT(t,p.sets),ex=AT(t,p.exp),cr=AT(t,p.crush);
  if(cr){const n=Math.min(3,Math.floor((t-p.crush)/.8)+1);
    return `${t29_museum(g)}<rect x="300" y="700" width="1320" height="40" rx="10" fill="#C9A46A" stroke="${INK}" stroke-width="7"/>
     ${[0,1,2].map(i=>t29_cup(620+i*340,700,1.2,i<n?pop(t,p.crush+i*.8,.25):0)).join('')}
     ${t29_dex({x:1660,gy:980,s:.7,t:g,mind:'glint',mouth:'wavy',brows:'sad',sweat:1,tag:false})}
     ${T(960,150,`${n} COFFEE CUP${n>1?'S':''}`,{size:100,fill:P.gold,sc:pop(t,p.crush+(n-1)*.8)})}${T(960,280,'BEFORE LUNCH',{size:60,fill:P.white})}`;}
  const k=se?eout(prog(t,p.sets,p.sets+1.5)):0;
  return `${t29_card('cardMint',g)}<g transform="translate(960,560)"><rect x="-560" y="-280" width="1120" height="560" rx="24" fill="#0B1026" fill-opacity=".85" stroke="${INK}" stroke-width="8"/>
    <path d="M-480 200 H480 M-480 200 V-220" stroke="#fff" stroke-width="6"/>${T(-300,250,'BEFORE TOUCH',{size:34,fill:P.white})}${T(260,250,'TOUCH',{size:34,fill:P.white})}<path d="M40 -220 V200" stroke="#fff" stroke-width="4" stroke-dasharray="12 10"/>
    <path d="M-480 200 Q-200 ${200-k*0} ${-480+520*k} ${200-260*k}" stroke="${t29_B}" stroke-width="14" fill="none" stroke-linecap="round"/>${se?T(-250,-160,'GRIP SET BY EXPECTATION',{size:38,fill:t29_B,sc:pop(t,p.sets+.6)}):''}
    ${ex?`<path d="M40 -60 H480" stroke="${t29_O}" stroke-width="14" stroke-dasharray="24 16"/>${T(260,-90,'SKINNY ARMS?',{size:40,fill:t29_O,sc:pop(t,p.exp)})}${T(260,40,'DEX’S ARMS: 3× FORCE',{size:40,fill:P.red,sc:pop(t,p.exp+1)})}`:''}</g>
   ${T(960,150,'YOUR BRAIN SETS YOUR GRIP FIRST',{size:76,fill:P.white,sc:IN(t,.1)})}`;
},
s29Starve(t,d,p,g){
  const bu=AT(t,p.burn),fo=AT(t,p.four),na=AT(t,p.nan);
  const n=fo?Math.min(4,Math.floor((t-p.four)/.6)+1):0;
  const plates=[...Array(n)].map((_,i)=>`<g transform="translate(${720+i*170},${700})"><ellipse rx="80" ry="22" fill="#fff" stroke="${INK}" stroke-width="6"/><ellipse cx="-20" cy="-14" rx="26" ry="18" fill="#FFD84D" stroke="${INK}" stroke-width="5"/><rect x="0" y="-30" width="50" height="22" rx="8" fill="#C9575A" stroke="${INK}" stroke-width="5"/></g>`).join('');
  return `${t29_DEF}${t21_kitchen(g)}${t29_pm(t,'minus','ALWAYS STARVING')}
   ${t>2.4?`<rect x="600" y="730" width="760" height="30" rx="8" fill="#C9A46A" stroke="${INK}" stroke-width="6"/>${plates}
   ${t29_dex({x:400,gy:980,s:.85,t:g,mind:'glint',mouth:fo?'grin':'o',brows:'raised',tag:false})}
   ${na?person({x:1580,y:520,s:.85,t:g,who:'nan',mouth:'laugh',brows:'raised',pose:'hold',blink:BL(g)})+`<g transform="translate(1640,600)"><rect x="-110" y="-12" width="220" height="24" rx="8" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/>${[0,1,2,3,4].map(i=>`<circle cx="${-80+i*40}" cy="-30" r="20" fill="#E8A860" stroke="${INK}" stroke-width="5"/>`).join('')}</g>`:''}
   ${bu&&!fo?`<g transform="translate(1300,450) scale(${pop(t,p.burn).toFixed(3)})"><rect x="-300" y="-110" width="600" height="220" rx="20" fill="#0B1026" stroke="${t29_O}" stroke-width="7"/>${T(0,-30,'MORE MUSCLE',{size:56,fill:P.white})}${T(0,50,'= MORE ENERGY AT REST',{size:44,fill:t29_O})}</g>`:''}
   ${na?T(1150,150,'NAN BAKES FOR AN ARMY',{size:86,fill:P.gold,sc:pop(t,p.nan)}):fo?T(1150,150,`${n} BREAKFAST${n>1?'S':''}`,{size:100,fill:P.white,sc:pop(t,p.four+(n-1)*.6)}):''}`:''}`;
},
s29HeadT(t,d,p,g){
  const re=AT(t,p.real),wh=AT(t,p.white),se=AT(t,p.see),co=AT(t,p.cord),an=AT(t,p.ann),nv=AT(t,p.never);
  if(!re) return `${t29_museum(g)}${person({x:520,y:520,s:.95,t:g,who:'osei',mouth:'smile',pose:'point',blink:BL(g)})}${t29_dex({x:1300,gy:980,s:.85,t:g,mind:'glint',mouth:'o',brows:'raised',tag:false})}
    ${T(960,150,'CLOSEST THING TO A',{size:80,fill:P.white,sc:IN(t,.2)})}${T(960,260,'HEAD TRANSPLANT',{size:110,fill:P.gold,sc:IN(t,1.2)})}`;
  const cardA=wh?`<g transform="translate(560,560) rotate(-3) scale(${pop(t,p.white).toFixed(3)})"><rect x="-330" y="-260" width="660" height="520" rx="18" fill="#F4F1EA" stroke="${INK}" stroke-width="10"/>${T(0,-180,'1970',{size:90,fill:P.red})}${T(0,-100,'ROBERT WHITE',{size:48,fill:'#2A2A35',stroke:0})}
     <g transform="translate(0,20)"><circle r="70" fill="#B8865A" stroke="${INK}" stroke-width="7"/><circle cx="-62" cy="-10" r="24" fill="#B8865A" stroke="${INK}" stroke-width="6"/><circle cx="62" cy="-10" r="24" fill="#B8865A" stroke="${INK}" stroke-width="6"/><ellipse cy="20" rx="44" ry="34" fill="#E8C49A"/><circle cx="-22" cy="-14" r="8" fill="${INK}"/><circle cx="22" cy="-14" r="8" fill="${INK}"/></g>
     ${se?`<g transform="translate(0,160)">${labelPill(-130,0,'COULD SEE',P.mint,34)}${labelPill(130,0,'COULD TASTE',P.mint,34)}</g>`:''}${co?`<g transform="translate(0,225)">${labelPill(0,0,'COULD NEVER MOVE',P.red,38)}</g>`:''}</g>`:'';
  const spine=co?`<g transform="translate(1380,560) scale(${pop(t,p.cord).toFixed(3)})"><rect x="-260" y="-260" width="520" height="520" rx="18" fill="#0B1026" stroke="${INK}" stroke-width="8"/>${[0,1,2,3,4,5].map(i=>`<rect x="-50" y="${-210+i*70+(i>2?30:0)}" width="100" height="50" rx="14" fill="#F4F1EA" stroke="${INK}" stroke-width="6"/>`).join('')}
     <path d="M0 -220 V0 M0 30 V230" stroke="${P.gold}" stroke-width="12"/><path d="M-90 15 H90" stroke="${P.red}" stroke-width="10" stroke-dasharray="16 10"/>${T(0,-240+520,'',{size:10})}${T(150,24,'CUT',{size:44,fill:P.red})}${T(0,300,'A CUT SPINAL CORD CAN’T RECONNECT',{size:36,fill:P.white})}</g>`:'';
  if(an) return `${t29_card('cardDark',g)}<g transform="translate(960,540) rotate(2) scale(${pop(t,p.ann).toFixed(3)})"><rect x="-460" y="-300" width="920" height="600" rx="18" fill="#F4F1EA" stroke="${INK}" stroke-width="10"/>${T(0,-200,'2017',{size:100,fill:P.red})}
     ${T(0,-90,'“FIRST HUMAN',{size:66,fill:'#2A2A35',stroke:0})}${T(0,-10,'HEAD TRANSPLANT”',{size:66,fill:'#2A2A35',stroke:0})}${T(0,80,'ANNOUNCED',{size:44,fill:'#6A6A75',stroke:0})}
     ${[0,1,2].map(i=>`<rect x="-380" y="${130+i*44}" width="${760-i*120}" height="18" rx="9" fill="#C9C2B8"/>`).join('')}</g>
     ${nv?`<g transform="translate(960,560) scale(${pop(t,p.never).toFixed(3)})">${stamp(0,0,1.4,'NEVER HAPPENED',P.red,-12)}</g>`:''}`;
  return `${t29_card('cardWarm',g)}${cardA}${spine}${T(960,150,'REAL SURGEONS HAVE TRIED',{size:80,fill:P.white,sc:pop(t,p.real)})}`;
},
s29Flat(t,d,p,g){
  const ke=AT(t,p.keys),ex=AT(t,p.exp),ins=AT(t,p.inst);
  if(!ins) return `${t29_DEF}${t29_street(g,{night:0})}${t29_pm(t,'plus','THE FLAT')}
    ${t>2.4?`<g transform="translate(1180,800)"><rect x="-150" y="-440" width="300" height="440" fill="#3A5A8A" stroke="${INK}" stroke-width="9"/><circle cx="100" cy="-220" r="14" fill="${P.gold}" stroke="${INK}" stroke-width="5"/><rect x="-60" y="-400" width="120" height="40" rx="6" fill="#FFF6EA" stroke="${INK}" stroke-width="5"/><text y="-370" text-anchor="middle" font-size="30" font-weight="900" fill="${INK}">14B</text></g>
     ${t29_dex({x:880,gy:830,s:.9,t:g,mind:'glint',pose:'point',mouth:'flat',brows:'raised',tag:false})}
     ${ke?`<g transform="translate(1060,560) rotate(${(Math.sin(g*6)*10).toFixed(1)}) scale(${pop(t,p.keys).toFixed(3)})"><circle r="22" fill="none" stroke="${P.gold}" stroke-width="8"/><path d="M18 10 L70 40 M50 30 L44 44 M62 36 L58 50" stroke="${P.gold}" stroke-width="8" stroke-linecap="round"/></g>`:''}
     ${ex?`<g transform="translate(480,400) scale(${pop(t,p.exp).toFixed(3)})"><ellipse rx="300" ry="190" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><circle cx="220" cy="210" r="22" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><circle cx="270" cy="260" r="12" fill="#FFF6EA" stroke="${INK}" stroke-width="5"/>
       <g transform="translate(-110,0)"><path d="M-50 -70 H50 Q50 0 0 20 Q-50 0 -50 -70Z" fill="${P.gold}" stroke="${INK}" stroke-width="7"/><rect x="-14" y="20" width="28" height="40" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><rect x="-44" y="60" width="88" height="24" fill="${P.gold}" stroke="${INK}" stroke-width="6"/></g>
       <g transform="translate(110,0)"><rect x="-60" y="-90" width="120" height="170" rx="14" fill="#2A3248" stroke="${INK}" stroke-width="7"/><circle cy="-30" r="26" fill="#46507A" stroke="${INK}" stroke-width="5"/><circle cy="40" r="20" fill="#46507A" stroke="${INK}" stroke-width="5"/>${t21_arcs(80,-30,g,1,'#fff',1,.7)}</g></g>`:''}
     ${T(1150,150,ex?'HE EXPECTS TROPHIES':'DEX’S HOME',{size:96,fill:P.white,sc:pop(t,ex?p.exp:p.keys??.1)})}`:''}`;
  const notes=[[p.n1,'POPPY:',' NO CRUSTS',560,300,-6],[p.n2,'POPPY:','HOSPITAL BAG',960,260,4],[p.n3,'DAD:','TABLETS AT 6',1360,300,-3]];
  return `${t29_flatK(g)}${[[300,470,-8],[700,440,6],[1660,520,-5],[1100,450,3]].map(([x,y,r])=>t29_note(x,y,'',{rot:r,w:120,size:10,col:['#FFE45C','#FF9FB0','#9AE6FF','#B4F08A'][Math.abs(r)%4]})).join('')}
   ${notes.map(([a,l1,l2,x,y,r])=>AT(t,a)?t29_note(x,y,[l1,l2],{rot:r,sc:pop(t,a),w:340,size:40}):'').join('')}
   ${t29_dex({x:1640,gy:980,s:.75,t:g,mind:'glint',mouth:'o',brows:'sad',tag:false,look:-1})}
   ${T(960,AT(t,p.n1)?120:150,'STICKY NOTES EVERYWHERE',{size:76,fill:P.gold,sc:pop(t,p.inst)})}`;
},
s29Family(t,d,p,g){
  const po=AT(t,p.pop),op=AT(t,p.op),ni=AT(t,p.night),br=AT(t,p.braid),ba=AT(t,p.bad);
  if(ni){ // every night: cooks, homework, braids
    const k=br?1:0;
    return `${t29_flatK(g)}${t29_dex({x:880,gy:980,s:.85,t:g,mind:'glint',pose:br?'braid':'hold',mouth:ba?'wavy':'flat',brows:'raised',tag:false})}
     ${t29_poppy({x:960,gy:990,s:.95,t:g,mouth:ba?'o':'gap',look:1})}
     ${br?`<path d="M1032 ${720} q24 30 0 60 q-24 30 6 60 q30 30 -10 70" stroke="#6A3A1E" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M1032 720 q24 30 0 60 q-24 30 6 60 q30 30 -10 70" stroke="${INK}" stroke-width="4" fill="none" stroke-dasharray="6 18"/>`:''}
     ${['COOKS','CHECKS HOMEWORK','BRAIDS HAIR'].map((l,i)=>AT(t,p.night+i*.9)?t29_pill(1500,330+i*130,l,[P.gold,t29_B,P.coral][i],44,pop(t,p.night+i*.9)):'').join('')}
     ${ba?T(960,150,'BADLY.',{size:130,fill:P.coral,sc:pop(t,p.bad),rot:-4}):T(960,150,'EVERY NIGHT',{size:100,fill:P.white,sc:pop(t,p.night)})}`;}
  return `${t29_flatK(g)}<g transform="translate(560,800)"><rect x="-210" y="-300" width="420" height="230" rx="40" fill="#5A6A4A" stroke="${INK}" stroke-width="8"/><rect x="-230" y="-100" width="460" height="100" rx="20" fill="#5A6A4A" stroke="${INK}" stroke-width="8"/></g>
   ${t29_dad({x:560,gy:870,s:.9,t:g})}
   ${po?t29_poppy({x:1180,gy:990,s:1.05,t:g,mouth:'gap',look:-1,pose:'up'}):''}
   ${op?`<g transform="translate(1560,500) rotate(4) scale(${pop(t,p.op).toFixed(3)})"><rect x="-170" y="-160" width="340" height="320" rx="16" fill="#F4F1EA" stroke="${INK}" stroke-width="8"/><rect x="-170" y="-160" width="340" height="70" rx="16" fill="${P.red}" stroke="${INK}" stroke-width="8"/>${T(0,-110,'SATURDAY',{size:40,fill:'#fff',stroke:0})}${T(0,-10,'HIP',{size:70,fill:'#2A2A35',stroke:0})}${T(0,70,'OPERATION',{size:50,fill:'#2A2A35',stroke:0})}<circle cy="0" r="140" fill="none" stroke="${P.red}" stroke-width="8" opacity=".7"/></g>`:''}
   ${po?t29_pill(1180,300,'POPPY, 8',P.gold,50,pop(t,p.pop)):t29_pill(560,300,'DAD: HURT HIS BACK','#9AA7BD',44,IN(t,.4))}
   ${T(960,150,po?'AND A LITTLE SISTER':'DEX’S DAD',{size:90,fill:P.white,sc:pop(t,po?p.pop:.1)})}`;
},
s29Squeeze(t,d,p,g){
  const th=AT(t,p.three),me=AT(t,p.means),fo=AT(t,p.four),mo=AT(t,p.more),g4=AT(t,p.g4);
  const sqAt=(a,n,gap=.32)=>{if(a==null||t<a)return 0;for(let i=0;i<n;i++){const k=(t-a-i*gap)/.22;if(k>=0&&k<1)return Math.sin(k*Math.PI);}return 0;};
  const sq=Math.max(sqAt(p.three,3),sqAt(p.four,4),sqAt(p.g4,4));
  const cnt=g4?Math.min(4,Math.floor((t-p.g4)/.32)+1):fo&&!g4?Math.min(4,Math.floor((t-p.four)/.32)+1):th?Math.min(3,Math.floor((t-p.three)/.32)+1):0;
  const col=g4?t29_B:fo?t29_O:P.coral;
  return `${t29_card('cardWarm',g)}${t29_clasp(960,600,1,{sq})}${t29_pulse(960,600,sq>0?1-sq:2,t,col)}
   ${cnt?T(960,330,'●'.repeat(cnt),{size:90,fill:col,ls:20}):''}
   ${me&&!fo?t29_pill(960,920,'3 SQUEEZES = I LOVE YOU',P.coral,50,pop(t,p.means)):''}
   ${fo&&!g4?t29_pill(960,920,mo?'4 = I LOVE YOU MORE':'DEX ALWAYS SQUEEZES BACK 4',t29_O,50,pop(t,mo?p.more:p.four)):''}
   ${g4?t29_pill(960,920,'GLINT SQUEEZES BACK 4',t29_B,50,pop(t,p.g4)):''}
   ${T(960,150,g4?'HE GETS IT RIGHT':'POPPY’S SECRET CODE',{size:90,fill:P.white,sc:pop(t,g4?p.g4:.1)})}`;
},
s29Book(t,d,p,g){
  const id=AT(t,p.idea),hi=AT(t,p.hide);
  return `${t29_flatK(g)}${t29_dex({x:700,gy:980,s:.85,t:g,mind:'glint',mouth:id?'o':'smile',brows:id?'raised':'calm',pose:id?'shrug':'down',tag:false})}
   ${t29_poppy({x:1240,gy:990,s:1.05,t:g,mouth:hi?'smile':'gap',look:-1,pose:hi?'point':'up'})}
   ${t29_bub(1300,330,560,'“READ ME THE','FACT BOOK!”',{size:52,tail:'left',sc:IN(t,.2)})}
   ${id?T(700,380,'?',{size:200,fill:t29_B,sc:pop(t,p.idea)}):''}
   ${hi?`<g transform="translate(960,800) scale(${pop(t,p.hide).toFixed(3)})"><rect x="-380" y="-60" width="760" height="120" rx="20" fill="#0B1026" stroke="${P.gold}" stroke-width="7"/><g transform="translate(-320,0)"><rect x="-24" y="-8" width="48" height="40" rx="6" fill="${P.gold}" stroke="${INK}" stroke-width="5"/><path d="M-14 -8 V-22 A14 14 0 0 1 14 -22 V-8" stroke="${P.gold}" stroke-width="7" fill="none"/></g>${T(30,18,'DEX HIDES IT. NOBODY SEES.',{size:46,fill:P.gold})}</g>`:''}`;
},
s29Treat(t,d,p,g){
  const bu=AT(t,p.bus),mu=AT(t,p.mus);
  if(mu){return `${t29_museum(g)}${extra({x:560,y:520,s:.95,t:g,head:'#F2C9A0',mouth:'laugh',pose:'point'})}${extra({x:1360,y:520,s:.95,t:g,head:'#C9A0F2',mouth:'laugh'})}
     ${t29_gl({x:960,gy:960,s:.75,t:g,mind:'dex',mouth:'flat',brows:'sad',tag:false,blink:BL(g)})}
     ${t29_bub(700,250,300,'BLAH BLAH','',{size:44,tail:'left'})}${t29_bub(1220,230,300,'BLAH BLAH','',{size:44,tail:'right'})}
     ${T(960,150,'PEOPLE TALK RIGHT OVER HIM',{size:76,fill:P.white,sc:pop(t,p.mus)})}`;}
  const sh=bu?eout(prog(t,p.bus+.5,p.bus+1)):0;
  return `${t29_street(g)}${t29_pm(t,'minus','THE GLINT TREATMENT')}
   ${t>2.4?`${t29_busStop(1100,800)}${extra({x:1320,y:500,s:1.15,t:g,head:'#B8865A',pose:'point',mouth:'flat'})}
   ${t29_gl({x:lerp(1000,760,sh),gy:960,s:.75,t:g,mind:'dex',mouth:sh?'o':'frown',brows:sh?'raised':'angry',rot:-sh*14,tag:true})}
   ${bu?T(1150,150,'SHOVED ASIDE',{size:100,fill:P.coral,sc:pop(t,p.bus+.5)}):''}`:''}`;
},
s29Gym(t,d,p,g){
  const la=AT(t,p.laugh),go=AT(t,p.gog),ta=AT(t,p.taught);
  const mates=[[420,'#E2A97E'],[700,'#B8865A'],[1260,'#F2C9A0'],[1540,'#8A5A3A']].map(([x,h],i)=>extra({x,y:500,s:1.05,t:g+i,head:h,mouth:la?'laugh':'smile',pose:la&&i%2?'point':'down'})+`<path d="M${x-50} ${540+Math.sin((g+i)*2.4+1)*4} h100 l10 120 h-120Z" fill="${['#2A3248','#5A3A3A','#3A5A3A','#24222E'][i]}" stroke="${INK}" stroke-width="6"/>`).join('');
  return `${t29_gymBg(g)}${mates}${t29_gl({x:980,gy:960,s:.75,t:g,mind:'dex',mouth:'frown',brows:'sad',tag:true})}
   ${go?[[420,330,-8],[1520,320,7],[700,420,4]].map(([x,y,r],i)=>`<g transform="translate(${x},${y}) rotate(${r})">${t29_bub(0,0,330,'“GOGGLES!”','',{size:50,tail:i?'right':'left',sc:pop(t,p.gog+i*.25)})}</g>`).join(''):''}
   ${ta?T(960,300,'THE WORD HE TAUGHT THEM',{size:84,fill:t29_O,sc:pop(t,p.taught)}):T(960,300,la?'HIS OWN MATES LAUGH':'HIS OWN GYM',{size:84,fill:P.white,sc:pop(t,la?p.laugh:.1)})}`;
},
s29Phone(t,d,p,g){
  const as=AT(t,p.ask),si=AT(t,p.since),sl=AT(t,p.sil),so=AT(t,p.sorry);
  const phone=(x,y,rot)=>`<g transform="translate(${x},${y}) rotate(${rot})"><rect x="-26" y="-50" width="52" height="100" rx="12" fill="#1A1A26" stroke="${INK}" stroke-width="6"/></g>`;
  const left=`${t29_DEF}<rect width="960" height="1080" fill="#1A2040"/><rect y="760" width="960" height="320" fill="#121630"/><rect x="80" y="660" width="700" height="140" rx="20" fill="#4A4A7A" stroke="${INK}" stroke-width="8"/><rect x="80" y="620" width="200" height="70" rx="26" fill="#E8ECF4" stroke="${INK}" stroke-width="6"/>
    <rect x="560" y="160" width="300" height="260" fill="#0A1030"/>${t21_stars(g).replace(/cx="(\d+)"/g,(m,v)=>`cx="${570+(+v%280)}"`).replace(/cy="(\d+)"/g,(m,v)=>`cy="${170+(+v%240)}"`)}<rect x="560" y="160" width="300" height="260" fill="none" stroke="#9AA7BD" stroke-width="12"/>
    ${t29_gl({x:400,y:420,s:.8,t:g,mind:'dex',legs:'sit',mouth:si?'frown':'flat',brows:'sad',tag:false})}${phone(470,380,15)}`;
  const right=`${t29_flatK(g)}${t29_dex({x:1420,gy:980,s:.8,t:g,mind:'glint',mouth:so?'smile':'flat',brows:sl?'sad':'calm',tag:false})}${phone(1500,330,-15)}`;
  return `${t29_split(left,right,g)}${t29_pill(480,90,'DEX (IN GLINT)',t29_O,40)}${t29_pill(1440,90,'GLINT (IN DEX)',t29_B,40)}
   ${as?t29_bub(480,250,520,'“IS IT ALWAYS','LIKE THIS?”',{size:46,tail:'left',sc:pop(t,p.ask)}):''}
   ${si?t29_bub(1440,250,520,'“SINCE WE','WERE ELEVEN.”',{size:46,tail:'right',sc:pop(t,p.since)}):''}
   ${sl&&!so?T(960,560,'…',{size:160,fill:P.white,sc:pop(t,p.sil)}):''}${so?t29_bub(480,560,340,'“SORRY.”','',{size:60,tail:'left',sc:pop(t,p.sorry)}):''}
   ${!as?T(960,560,'THAT NIGHT',{size:100,fill:P.white,sc:IN(t,.1)}):''}`;
},
s29Fit(t,d,p,g){
  const th=AT(t,p.thu),du=AT(t,p.duck),tr=AT(t,p.trip),ru=AT(t,p.rub),fi=AT(t,p.five),mp=AT(t,p.map);
  if(ru){const pct=mp?lerp(60,71,prog(t,p.map,p.map+1)):fi?60:35;
    return `${t29_card('cardWarm',g)}<g transform="translate(960,520)">${glint({x:-380,y:-60,s:.8,t:g,mouth:'flat',blink:BL(g)})}${t29_dex({x:380,gy:300,s:.8,t:g,mouth:'flat',brows:'calm',tag:false})}
      <path d="M-200 -40 H200" stroke="${t29_B}" stroke-width="14" stroke-dasharray="26 16" stroke-dashoffset="${(-g*90).toFixed(0)}"/><path d="M170 -70 L210 -40 L170 -10" stroke="${t29_B}" stroke-width="12" fill="none"/></g>
     <g transform="translate(960,830)"><rect x="-500" y="-44" width="1000" height="88" rx="44" fill="#0B1026" stroke="${INK}" stroke-width="8"/><rect x="-486" y="-30" width="${(972*pct/100).toFixed(0)}" height="60" rx="30" fill="${P.red}"/>${T(0,18,`BODY MAP REDRAWN: ${Math.round(pct)}%`,{size:46,fill:'#fff'})}</g>
     ${T(960,150,mp?'THE MAP IS REDRAWING':fi?'THEIR BRAINS HAVE HAD 5 DAYS':'THE RUBBER HAND: MINUTES',{size:80,fill:mp?P.red:P.white,sc:pop(t,mp?p.map:fi?p.five:p.rub)})}`;}
  const dk=du?Math.sin(clamp((t-p.duck)/1.2)*Math.PI):0;
  return `${t29_flatK(g)}${t29_pm(t,'minus','IT’S STARTING TO FIT')}
   ${t>2.4?`${t29_doorframe(900,820,560)}${t29_dex({x:lerp(700,1100,clamp((t-2.4)/6)),gy:830+dk*60,s:.95,t:g,mind:'glint',mouth:'flat',brows:'calm',legs:'walk',rot:dk*12,tag:false})}
   ${tr?`<g transform="translate(1560,560) scale(${pop(t,p.trip).toFixed(3)})">${t29_frame(0,0,520,420,`<rect x="-260" y="-210" width="520" height="420" fill="#1C1430"/>${t29_gl({x:0,y:-100,s:.6,t:g,mind:'dex',legs:'walk',mouth:'flat',tag:false})}`,t29_O,'DEX: NO MORE TRIPPING')}</g>`:''}
   ${T(1150,150,du?'HE DUCKS WITHOUT THINKING':'BY THURSDAY',{size:80,fill:du?P.red:P.white,sc:pop(t,du?p.duck:p.thu??2.4)})}`:''}`;
},
s29Burnt(t,d,p,g){
  const tw=AT(t,p.two);
  return `${t29_museum(g)}${t29_rig(1060,860,1.1,g,{on:0,burnt:1,smoke:.8})}${person({x:520,y:520,s:.95,t:g,who:'osei',mouth:'frown',brows:'sad',pose:'point',blink:BL(g)})}
   ${tw?`<g transform="translate(1500,420) scale(${pop(t,p.two).toFixed(3)})"><rect x="-260" y="-110" width="520" height="220" rx="20" fill="#0B1026" stroke="${P.red}" stroke-width="7"/>${T(0,-20,'REBUILD: 2 WEEKS',{size:56,fill:P.white})}${T(0,60,'SWAP LOCKS: FRIDAY',{size:46,fill:P.red})}</g>`:''}
   ${T(960,150,'THE BURNT RIG',{size:100,fill:P.white,sc:IN(t,.1)})}`;
},
s29Ward(t,d,p,g){
  const lk=AT(t,p.lock),po=AT(t,p.pop),da=AT(t,p.dad),te=AT(t,p.terr),ex=AT(t,p.except),ca=AT(t,p.cant),le=AT(t,p.leave);
  const sec=t29_left(g);
  if(!po) return `${t29_card('cardDark',g)}${T(960,330,'FRIDAY',{size:150,fill:P.white,sc:IN(t,.1)})}${T(960,470,'11 PM',{size:110,fill:t29_O,sc:IN(t,.8)})}
    ${lk?`${t29_timer(sec,g,{x:960,y:660,s:1.3})}`:''}${lk?T(960,840,'7 DAYS AFTER THE SPARK',{size:56,fill:P.white,sc:pop(t,p.lock+1.5)}):''}`;
  return `${t29_ward(g,{h:11,m:Math.floor(clamp((g-374)/60*1))})}
   ${da?`<g transform="translate(1600,820)"><rect x="-150" y="-260" width="300" height="200" rx="30" fill="#5A6A7A" stroke="${INK}" stroke-width="8"/><rect x="-170" y="-80" width="340" height="80" rx="20" fill="#5A6A7A" stroke="${INK}" stroke-width="8"/></g>${t29_dad({x:1600,gy:880,s:.75,t:g,sleep:1})}`:''}
   ${t29_bed(900,780,1,t29_poppy({x:-200,y:-180,s:.9,t:g,gown:true,mouth:te?'frown':'smile',brows:te?'sad':'calm',tear:te?1:0,pose:'hold'}))}
   ${t29_dex({x:520,gy:1000,s:.85,t:g,mind:ex?'glint':null,pose:'handout',mouth:ca?'wavy':'flat',brows:'sad',tag:ex})}
   ${t29_timer(sec,g,{x:1640,y:120,s:.8})}
   ${le?`<g transform="translate(960,960) scale(${pop(t,p.leave).toFixed(3)})">${labelPill(0,0,'IF HE LEAVES, SHE GOES IN ALONE',P.coral,46)}</g>`:''}
   ${T(800,170,ex?'IT ISN’T HER BROTHER':te?'SHE’S TERRIFIED':'SURGERY AT 8 AM',{size:86,fill:ex?t29_B:P.white,sc:pop(t,ex?p.except:te?p.terr:p.pop)})}`;
},
s29Midnight(t,d,p,g){
  const dx=AT(t,p.dex),iff=AT(t,p.if),na=AT(t,p.nan);const sec=t29_left(g);
  if(iff){const A=`${t29_ward(g)}${t29_bed(480,780,.8,t29_poppy({x:-200,y:-180,s:.9,t:g,gown:true,mouth:'o',brows:'raised'}))}${extra({x:780,y:520,s:.8,t:g,head:'#9AD1FF',mouth:'flat'})}${T(480,320,'A STRANGER',{size:60,fill:P.white})}${T(480,400,'FOR A BROTHER',{size:60,fill:t29_O})}`;
    const B=`${t29_DEF}${t21_kitchen(g)}${na?person({x:1440,y:520,s:.85,t:g,who:'nan',mouth:'frown',brows:'sad',blink:BL(g)}):''}${na?T(1440,320,'NAN LOSES',{size:60,fill:P.white})+T(1440,400,'HER GRANDSON',{size:60,fill:t29_B}):''}`;
    return `${t29_split(A,B,g)}${t29_timer(sec,g,{x:1640,y:120,s:.7})}${T(800,170,'IF THE SWAP LOCKS…',{size:84,fill:P.red,sc:pop(t,p.if)})}`;}
  return `${t29_museum(g)}${t29_rig(1060,860,1.1,g,{on:0,burnt:1,smoke:.6})}${person({x:600,y:520,s:.9,t:g,who:'osei',mouth:'frown',brows:'sad',pose:'shrug',blink:BL(g)})}
   ${t29_gl({x:1500,gy:960,s:.8,t:g,mind:'dex',mouth:dx?'wavy':'frown',brows:'sad',sweat:dx?1:0})}
   ${dx?`<g transform="translate(1600,620) rotate(-15)"><rect x="-26" y="-50" width="52" height="100" rx="12" fill="#1A1A26" stroke="${INK}" stroke-width="6"/></g>${t21_arcs(1640,560,g,1,t29_O,1,.7)}`:''}
   ${t29_timer(sec,g,{x:1640,y:120,s:.8})}${T(800,170,dx?'DEX’S VOICE CRACKS':'CAN’T BE SAVED',{size:90,fill:dx?t29_O:P.red,sc:pop(t,dx?p.dex:.3)})}`;
},
s29Think(t,d,p,g){
  const ha=AT(t,p.hand),ru=AT(t,p.rub),ma=AT(t,p.magic),eh=AT(t,p.ehr),tr=AT(t,p.trick),bra=AT(t,p.brain),se=AT(t,p.see),fe=AT(t,p.feel),sa=AT(t,p.same),ka=AT(t,p.kai);const sec=t29_left(g);
  if(ka) return `${t29_ward(g)}${t29_dex({x:960,gy:1000,s:.95,t:g,mind:'glint',pose:'wave',mouth:'grin',brows:'raised'})}<g transform="translate(1140,560) rotate(-10)"><rect x="-30" y="-56" width="60" height="112" rx="12" fill="#1A1A26" stroke="${INK}" stroke-width="6"/></g>
     ${person({x:1560,y:480,s:.8,t:g,who:'kai',mouth:'grin',brows:'raised',pose:'up'})}${t29_timer(sec,g,{x:1640,y:120,s:.8})}${T(800,170,'GLINT CALLS KAI',{size:96,fill:P.gold,sc:pop(t,p.kai)})}`;
  if(tr){const items=[[p.see,'SEE THE TOUCH',t29_B],[p.feel,'FEEL THE TOUCH',t29_O],[p.same,'AT THE SAME MOMENT',P.gold]];
    return `${t29_card('cardMint',g)}${t29_brainMap(560,560,.8,g,{strip:bra?1:0})}${!se?`<g transform="translate(1340,620) scale(${pop(t,p.trick).toFixed(3)})">${t29_rig(0,0,1,g,{on:0})}<path d="M-220 -200 L220 160 M220 -200 L-220 160" stroke="${P.red}" stroke-width="26" stroke-linecap="round"/></g>`:''}${items.map(([a,l,c],i)=>AT(t,a)?`<g transform="translate(1340,${380+i*170}) scale(${pop(t,a).toFixed(3)})">${labelPill(0,0,l,c,56)}</g>`:'').join('')}
     ${t29_timer(sec,g,{x:1640,y:120,s:.7})}${T(800,170,bra?'IT’S IN THE BRAIN':'NOT IN THE MACHINE',{size:96,fill:bra?P.gold:P.white,sc:pop(t,bra?p.brain:p.trick)})}`;}
  if(ru){return `${t29_card('cardIce',g)}${t29_dex({x:400,gy:1000,s:.8,t:g,mind:'glint',mouth:'o',brows:'raised',tag:false,look:1})}
     <g transform="translate(1160,560)"><ellipse rx="560" ry="330" fill="#FFF6EA" stroke="${INK}" stroke-width="9"/><circle cx="-560" cy="260" r="34" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/><circle cx="-640" cy="320" r="18" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/>
      ${eh?`<g transform="translate(0,20)">${extra({x:-180,y:-60,s:.55,t:g,head:'#F2C9A0',pose:'point'})}${extra({x:180,y:-60,s:.55,t:g,head:'#9AD1FF',pose:'point'}).replace(/M0 40 L80 30 L150 10/,'M0 40 L-80 30 L-150 10')}${T(0,230,'2 CAMERAS + A HANDSHAKE',{size:46,fill:INK,stroke:0})}</g>`
       :`<g transform="translate(-160,60) rotate(-90)">${t29_hand(0,0,.75,{skin:'#F4A6B8'})}</g>${t29_brush(-160+Math.sin(g*5)*30,-10,.9,20)}<g transform="translate(200,60) rotate(-90)">${t29_hand(0,0,.75,{skin:'#F2C9A0'})}</g>${t29_brush(200+Math.sin(g*5)*30,-10,.9,20)}
       ${ma?T(0,250,'A RUBBER HAND + 2 BRUSHES',{size:46,fill:INK,stroke:0}):''}`}</g>
     ${t29_timer(sec,g,{x:1640,y:120,s:.7})}${T(820,150,ma?'NO MAGIC MACHINE':'THE RUBBER HAND',{size:90,fill:P.white,sc:pop(t,ma?p.magic:p.rub)})}`;}
  return `${t29_card('cardWarm',g)}${t29_clasp(960,620,.95,{})}${t29_timer(sec,g,{x:960,y:300,s:1.1})}${T(960,150,ha?'THE TINY HAND IN HIS':'1 HOUR 50 MINUTES',{size:84,fill:P.white,sc:pop(t,ha?p.hand:.1)})}`;
},
s29Ride(t,d,p,g){
  const pe=AT(t,p.ped);const sec=t29_left(g);const cam=g*600;
  const sl=[...Array(10)].map((_,i)=>{const x=((i*260-cam*.9)%2600+2600)%2600-300;return `<path d="M${x} ${700+(i%3)*60} h160" stroke="#fff" stroke-width="6" opacity=".35"/>`;}).join('');
  if(!pe) return `${t29_museum(g)}<rect x="200" y="560" width="1100" height="260" fill="#2A2040" stroke="${INK}" stroke-width="8"/>${t21_sign(750,300,'GIFT SHOP',P.gold,g,64)}
    ${[0,1,2,3].map(i=>`<g transform="translate(${340+i*270},680)"><rect x="-90" y="-40" width="180" height="80" rx="12" fill="#C9A06A" stroke="${INK}" stroke-width="7"/><circle cx="-40" r="20" fill="#3A2A1A"/><circle cx="40" r="20" fill="#3A2A1A"/></g>`).join('')}
    ${person({x:1560,y:440,s:.8,t:g,who:'kai',mouth:'grin',brows:'raised',pose:'up'})}<g transform="translate(1640,300) rotate(${(Math.sin(g*6)*14).toFixed(0)})"><rect x="-90" y="-40" width="180" height="80" rx="12" fill="#C9A06A" stroke="${INK}" stroke-width="7"/></g>
    ${t29_pill(560,880,'2 CARDBOARD HEADSETS',P.gold,40,IN(t,.6))}${t29_pill(1400,880,'2 OLD PHONES',t29_B,40,IN(t,2.4))}${t29_timer(sec,g,{x:1640,y:120,s:.7})}`;
  const by=Math.sin(g*16)*4;
  return `${t29_DEF}${t21_city_night(g)}${sl}<g transform="translate(0,${by.toFixed(1)})">${t29_bike(960,880,1,g)}
   ${person({x:920,y:560,s:.8,t:g*2,who:'kai',mouth:'grin',brows:'angry',pose:'reach',legs:'sit'})}
   ${t29_gl({x:780,y:700,s:.62,t:g,mind:'dex',mouth:'o',brows:'raised',pose:'up',legs:'sit'})}</g>
   ${t29_timer(sec,g,{x:1640,y:120,s:.8})}${T(800,170,'LIKE A MANIAC',{size:100,fill:P.gold,sc:pop(t,p.ped)})}`;
},
s29Plan(t,d,p,g){
  const pl=AT(t,p.plan),st=AT(t,p.strap),se=AT(t,p.sees),to=AT(t,p.touch),sa=AT(t,p.same),mi=AT(t,p.mine);const sec=t29_left(g);
  if(!pl) return `${t29_ward(g,{h:1,m:15})}${person({x:1500,y:520,s:.85,t:g,who:'kai',mouth:'grin',brows:'raised',pose:'up'})}${t29_gl({x:1200,gy:980,s:.75,t:g,mind:'dex',mouth:'o',brows:'raised',tag:false})}
    ${t29_dex({x:460,gy:1000,s:.85,t:g,mind:'glint',mouth:'o',brows:'raised',tag:false})}${t29_timer(sec,g,{x:1640,y:120,s:.8})}${T(800,170,'1:15 AM',{size:110,fill:P.white,sc:IN(t,.1)})}`;
  if(to){const ph=(g*1.6)%1, sq=ph<.25?Math.sin(ph/.25*Math.PI):0;
    return `${t29_card('cardDark',g)}<g transform="translate(560,620) rotate(-90)">${t29_hand(0,0,1,{skin:'#E9C9AE',sq})}</g><g transform="translate(1360,620) rotate(-90)">${t29_hand(0,0,1.3,{skin:'#E2A97E',sq})}</g>
     ${t29_pulse(560,560,sq>0?1-sq:2,t,t29_B)}${t29_pulse(1360,560,sq>0?1-sq:2,t,t29_O)}
     ${sa?`<path d="M680 380 Q960 260 1240 380" stroke="${P.gold}" stroke-width="8" fill="none" stroke-dasharray="16 12"/>${T(960,330,'EXACTLY THE SAME MOMENT',{size:50,fill:P.gold,sc:pop(t,p.same)})}`:''}
     ${t29_timer(sec,g,{x:1640,y:120,s:.7})}${mi?`<g transform="translate(960,960) scale(${pop(t,p.mine).toFixed(3)})">${labelPill(0,0,'“THAT HAND IS MINE”',P.mint,60)}</g>`:''}${T(800,170,'THEN: A TOUCH',{size:96,fill:P.white,sc:pop(t,p.touch)})}`;}
  const gh=t29_glHead(560,980-300*.85,.85,g), dh=t29_dxHead(1360,1000-300*1.2*.85,.85,g);
  return `${t29_card('cardIce',g)}${t29_gl({x:560,gy:980,s:.85,t:g,mind:'dex',mouth:'flat',brows:'calm',tag:false})}${t29_dex({x:1360,gy:1000,s:.85,t:g,mind:'glint',mouth:'flat',brows:'calm',tag:false})}
   ${st?t29_cardboard(gh[0],gh[1],gh[2],{g})+t29_cardboard(dh[0],dh[1],dh[2],{g}):''}
   ${se?`<path d="M${gh[0]+40} ${gh[1]-210} Q960 ${gh[1]-420} ${dh[0]-40} ${dh[1]-150}" stroke="${t29_B}" stroke-width="12" fill="none" stroke-dasharray="26 16" stroke-dashoffset="${(-g*120).toFixed(0)}"/><path d="M${dh[0]-40} ${dh[1]-230} Q960 ${dh[1]-380} ${gh[0]+40} ${gh[1]-140}" stroke="${t29_O}" stroke-width="12" fill="none" stroke-dasharray="26 16" stroke-dashoffset="${(-g*120).toFixed(0)}"/>
     <g transform="translate(960,880) scale(${pop(t,p.sees).toFixed(3)})">${labelPill(0,0,'EACH SEES THROUGH HIS OLD EYES',P.gold,46)}</g>`:''}
   ${t29_timer(sec,g,{x:1640,y:120,s:.7})}${T(800,170,st?'PHONES ON FOREHEADS':'THE PLAN',{size:96,fill:P.white,sc:pop(t,st?p.strap:p.plan)})}`;
},
s29Squeeze2(t,d,p,g){
  const bo=AT(t,p.both),fo=AT(t,p.forty),sq=AT(t,p.sq),th=AT(t,p.thru),fe=AT(t,p.feel),lu=AT(t,p.lurch);const sec=t29_left(g);
  let s=0;if(sq){const ph=((t-p.sq)%1.4);for(let i=0;i<3;i++){const k=(ph-i*.32)/.22;if(k>=0&&k<1)s=Math.sin(k*Math.PI);}}
  if(th&&!lu){const view=`<rect x="-420" y="-250" width="840" height="500" fill="#1C4258"/><g transform="translate(-60,60) rotate(-90)">${t29_hand(0,0,.9,{skin:'#E9C9AE',sq:s})}</g><g transform="translate(120,10)">${t29_hand(0,0,.55,{skin:'#F0C29A',sq:s,rot:200})}</g><rect x="-420" y="-250" width="840" height="500" fill="${t29_B}" opacity=".1"/>`;
    return `${t29_card('cardIce',g)}${t29_frame(960,560,840,500,view,t29_B,'THROUGH THE HEADSET')}${t29_pulse(900,600,s>0?1-s:2,t,t29_B)}
     ${t29_timer(sec,g,{x:1640,y:120,s:.7})}${T(960,150,fe?'AND HE FEELS IT':'HIS OWN THIN HAND',{size:96,fill:fe?P.gold:P.white,sc:pop(t,fe?p.feel:p.thru)})}`;}
  if(lu){const k=prog(t,p.lurch,p.lurch+1.2);const w=Math.sin(k*Math.PI);
    return `${t29_card('cardDark',g)}<g transform="translate(960,560) scale(${(1+w*.3).toFixed(3)}) rotate(${(w*8).toFixed(1)})">${[0,1,2,3,4,5].map(i=>`<circle r="${(80+i*90+k*200).toFixed(0)}" fill="none" stroke="${i%2?t29_B:t29_O}" stroke-width="18" opacity="${(1-k*.7).toFixed(2)}"/>`).join('')}</g>
     <rect width="1920" height="1080" fill="#fff" opacity="${(w*.8).toFixed(2)}"/>${T(960,560,'SOMETHING LURCHES',{size:110,fill:P.white,sc:pop(t,p.lurch)})}`;}
  const gh=t29_glHead(1500,1000-300*.8,.8,g), dh=t29_dxHead(400,1010-300*1.2*.8,.8,g);
  return `${t29_ward(g,{h:1,m:40})}${t29_bed(960,820,.9,t29_poppy({x:-60,y:-170,s:.85,t:g,gown:true,mouth:sq?'gap':'smile',pose:bo?'both':'down',look:0}))}
   ${t29_dex({x:400,gy:1010,s:.8,t:g,mind:'glint',pose:'handout',mouth:'flat',brows:'calm',tag:false})}${t29_cardboard(dh[0],dh[1],dh[2],{g})}
   ${t29_gl({x:1500,gy:1000,s:.8,t:g,mind:'dex',pose:'reach',mouth:'flat',brows:'calm',dir:-1,tag:false})}${t29_cardboard(gh[0],gh[1],gh[2],{g})}
   ${sq?t29_pulse(760,700,s>0?1-s:2,t,t29_B,60)+t29_pulse(1180,700,s>0?1-s:2,t,t29_O,60)+T(960,330,'SQUEEZE · SQUEEZE · SQUEEZE',{size:56,fill:P.gold}):''}
   ${t29_timer(sec,g,{x:1640,y:120,s:.8})}${T(800,170,fo?'1:40 AM':'POPPY HOLDS OUT BOTH HANDS',{size:fo?110:76,fill:P.white,sc:pop(t,fo?p.forty:p.both)})}`;
},
s29Back(t,d,p,g){
  const sm=AT(t,p.small),gl=AT(t,p.glass),t1=AT(t,p.t158),op=AT(t,p.opp),fo=AT(t,p.four);const sec=t1?120:t29_left(g);
  if(op){let s=0;if(fo){const ph=(t-p.four);for(let i=0;i<4;i++){const k=(ph-i*.32)/.22;if(k>=0&&k<1)s=Math.sin(k*Math.PI);}}
    return `${t29_ward(g,{h:1,m:58})}${t29_bed(1100,820,.9,t29_poppy({x:-200,y:-170,s:.85,t:g,gown:true,mouth:'gap',pose:'hold'}))}
     ${t29_dex({x:560,gy:1010,s:.85,t:g,pose:fo?'handout':'hold',mouth:fo?'smile':'o',brows:'raised'})}${fo?t29_pulse(860,700,s>0?1-s:2,t,t29_O,60):''}
     ${fo?T(960,330,'●●●●',{size:80,fill:t29_O,ls:20}):''}${t29_timer(120,g,{x:1640,y:120,s:.8,done:1})}${T(800,170,fo?'HE SQUEEZES BACK 4':'DEX, BACK IN HIS OWN BODY',{size:80,fill:fo?t29_O:P.white,sc:pop(t,fo?p.four:p.opp)})}`;}
  return `${t29_ward(g,{h:1,m:58})}${t29_bed(1300,820,.9,'')}${t29_gl({x:700,gy:980,s:.9,t:g,mouth:gl?'grin':'o',brows:'raised',glint:gl?1:0,blink:BL(g),look:1})}
   ${sm?`<g transform="translate(1000,560)"><path d="M0 -240 V240" stroke="#fff" stroke-width="7" stroke-dasharray="18 14"/><path d="M-24 -210 L0 -244 L24 -210" stroke="#fff" stroke-width="7" fill="none"/></g>`:''}
   ${t1?`<g transform="translate(1300,560) rotate(-10) scale(${pop(t,p.t158).toFixed(3)})">${stamp(0,0,1.1,'SWAPPED BACK',P.mint,-10)}</g>`:''}
   ${t29_timer(sec,g,{x:1640,y:120,s:.8,done:t1?1:0})}${T(800,170,t1?'1:58 AM':gl?'HIS GOLD GLASSES':'HE’S SMALL AGAIN',{size:96,fill:t1?P.mint:P.gold,sc:pop(t,t1?p.t158:gl?p.glass:p.small)})}`;
},
s29Notebook(t,d,p,g){
  const wa=AT(t,p.wake),re=AT(t,p.red),pu=AT(t,p.pull),kn=AT(t,p.knows);
  if(pu){const k=eout(prog(t,p.pull,p.pull+1.2));
    return `${t29_ward(g,{lights:1,h:9,m:30})}${t29_dex({x:520,gy:1010,s:.85,t:g,mouth:'smile',brows:'sad',pose:'hold'})}<rect x="520" y="560" width="0" height="0"/>
     ${t29_notebook(lerp(700,960,k),lerp(700,560,k),lerp(.4,1,k),{glow:kn?.7:0,rot:lerp(-20,4,k)})}${t29_gl({x:1500,gy:980,s:.85,t:g,mouth:kn?'o':'smile',brows:'raised',look:-1,blink:kn?0:BL(g)})}
     ${kn?T(1500,330,'!',{size:180,fill:P.gold,sc:pop(t,p.knows)}):''}${T(960,150,kn?'GLINT KNOWS THAT NOTEBOOK':'GOLD STAR STICKERS',{size:84,fill:kn?P.gold:P.white,sc:pop(t,kn?p.knows:p.pull)})}`;}
  return `${t29_ward(g,{lights:1,h:9,m:30})}${t29_bed(960,820,.95,t29_poppy({x:-200,y:-170,s:.9,t:g,gown:true,mouth:wa?'gap':'smile',blink:wa?0:1}))}
   ${t29_dex({x:420,gy:1010,s:.85,t:g,mouth:re?'wavy':'smile',brows:re?'sad':'raised'})}${re?`<ellipse cx="380" cy="740" rx="30" ry="16" fill="${P.red}" opacity=".5"/><ellipse cx="480" cy="740" rx="30" ry="16" fill="${P.red}" opacity=".5"/>`:''}
   ${t29_gl({x:1600,gy:980,s:.8,t:g,mouth:'smile',blink:BL(g),look:-1})}
   ${wa&&!re?t29_bub(800,330,500,'“THE FACT BOOK?”','',{size:50,tail:'left',sc:pop(t,p.wake+1.5)}):''}
   ${T(960,150,re?'DEX GOES RED':'THE OPERATION: PERFECT',{size:90,fill:re?P.coral:P.mint,sc:pop(t,re?p.red:.1)})}`;
},
s29Flash(t,d,p,g){
  const el=AT(t,p.eleven),ev=AT(t,p.every),sn=AT(t,p.snatch),bi=AT(t,p.bin),di=AT(t,p.didnt),rd=AT(t,p.read);
  if(di){const n=rd?Math.min(4,Math.floor((t-p.read)/.6)+1):0;
    return `${t29_DEF}<rect width="1920" height="1080" fill="#141A3A"/><rect x="1300" y="160" width="360" height="300" fill="#0A1030"/><circle cx="1560" cy="250" r="34" fill="#fff4dc"/><rect x="1300" y="160" width="360" height="300" fill="none" stroke="#9AA7BD" stroke-width="12"/>
     <rect x="300" y="720" width="900" height="130" rx="20" fill="#7A5AA8" stroke="${INK}" stroke-width="8"/><rect x="300" y="660" width="240" height="90" rx="30" fill="#E8ECF4" stroke="${INK}" stroke-width="6"/>
     ${t29_poppy({x:470,y:600,s:.75,t:g,mouth:'gap',blink:BL(g+1)})}${t29_dex({x:900,y:575,s:.7,t:g,legs:'sit',mouth:'smile',brows:'calm',pose:'hold'})}${t29_notebook(950,655,.3,{glow:.4})}
     ${n?`<g transform="translate(1480,700)">${[...Array(n)].map((_,i)=>`<g transform="translate(${(i-1.5)*120},0) scale(${pop(t,p.read+i*.6).toFixed(3)})"><circle r="40" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><circle cx="18" cy="-12" r="36" fill="#141A3A"/></g>`).join('')}</g>`:''}
     ${T(960,150,rd?'EVERY NIGHT, FOR YEARS':'HE DIDN’T THROW IT AWAY',{size:86,fill:P.gold,sc:pop(t,rd?p.read:p.didnt)})}`;}
  const k=sn?eout(prog(t,p.snatch,p.snatch+1)):0, kb=bi?eout(prog(t,p.bin,p.bin+.9)):0;
  const nbx=sn?lerp(760,1160,k):760, nby=sn?lerp(620,560,k):620;
  return t29_sepia(`${t29_school(g)}${glint({x:700,y:640,s:.55,t:g,mouth:sn?'o':'smile',brows:sn?'sad':'raised',pose:sn?'reach':'cross',blink:BL(g),scarf:false})}
   ${sn?t29_dex({x:1260,y:610,s:.55,t:g,kid:true,mouth:'laugh',brows:'angry',pose:bi?'point':'up'}):''}${t29_bin(1600,780,1)}
   ${t29_notebook(bi?lerp(1260,1600,kb):nbx,bi?lerp(420,640,kb)-Math.sin(kb*Math.PI)*200:sn?lerp(nby,420,k):nby,.28,{rot:bi?kb*400:0})}
   ${ev?`<g transform="translate(560,340)">${t29_bub(0,0,420,'EVERY COOL','FACT HE KNEW',{size:44,tail:'right',sc:pop(t,p.every)})}</g>`:''}`)
   +`${T(960,150,sn?'FIRST DAY OF SECONDARY SCHOOL':'GLINT, AGE 11',{size:sn?70:96,fill:P.white,sc:pop(t,sn?p.snatch:.1)})}${bi?T(1600,500,'IN THE BIN',{size:60,fill:P.red,sc:pop(t,p.bin)}):''}`;
},
s29Name(t,d,p,g){
  const ye=AT(t,p.yeah),fi=AT(t,p.first);
  return `${t29_ward(g,{lights:1,h:10,m:0})}${t29_bed(960,820,.95,t29_poppy({x:-200,y:-170,s:.9,t:g,gown:true,mouth:'gap',pose:'point'}))}
   ${t29_dex({x:420,gy:1010,s:.85,t:g,mouth:'smile',brows:'calm'})}${t29_gl({x:1600,gy:980,s:.8,t:g,mouth:ye?'grin':'o',brows:'raised',look:-1,blink:BL(g),glint:fi?1:0})}
   ${!ye?t29_bub(760,330,620,'“IS THAT THE','FACT BOOK MAN?”',{size:50,tail:'left',sc:IN(t,.3)}):t29_bub(560,330,600,'“YEAH.','THAT’S GLINT.”',{size:54,tail:'left',sc:pop(t,p.yeah)})}
   ${fi?`<g transform="translate(1300,560) scale(${pop(t,p.first).toFixed(3)})"><rect x="-300" y="-110" width="600" height="220" rx="20" fill="#0B1026" stroke="${P.gold}" stroke-width="7"/>${T(0,-20,'FIRST TIME IN 8 YEARS',{size:44,fill:P.white})}${T(0,60,'HE SAID HIS NAME',{size:52,fill:P.gold})}</g>`:''}`;
},
s29Ask(t,d,p,g){
  const wh=AT(t,p.who),fi=AT(t,p.find),pa=AT(t,p.part),nx=AT(t,p.next);
  if(nx) return `${t29_card('cardDark',g)}${T(960,420,'NEXT TIME:',{size:90,fill:P.white,sc:pop(t,p.next)})}${T(960,560,'A BRAND NEW WHAT IF',{size:100,fill:P.gold,sc:pop(t,p.next+.6)})}${T(960,700,'WITH A BRAND NEW DANGER',{size:70,fill:P.red,sc:pop(t,p.next+1.4)})}`;
  return `${t29_split(`${t29_card('cardIce',g)}${t29_gl({x:480,gy:960,s:.85,t:g,mouth:'smirk',brows:'raised',pose:'shrug',blink:BL(g),glint:1})}`,`${t29_card('cardWarm',g)}${t29_dex({x:1440,gy:980,s:.85,t:g,mouth:'smile',brows:'calm',pose:'shrug'})}`,g)}
   ${T(960,160,wh?'WHO WOULD YOU SWAP WITH?':'ONE WEEK IN SOMEONE ELSE',{size:80,fill:P.white,sc:pop(t,wh?p.who:.1)})}
   ${fi?`<g transform="translate(960,560) scale(${pop(t,p.find).toFixed(3)})">${icon('comment',0,0,1.3)}</g>${T(960,740,'TELL ME BELOW',{size:56,fill:P.gold,sc:pop(t,p.find+.3)})}`:''}
   ${pa?`<g transform="translate(960,900) scale(${pop(t,p.part).toFixed(3)})">${labelPill(0,0,'WANT PART 2? COMMENT',P.mint,52)}</g>`:''}`;
}
});
function t29_card(id,g){return t29_DEF+bgCard(id,g);}
