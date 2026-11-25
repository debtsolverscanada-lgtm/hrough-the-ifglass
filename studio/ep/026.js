// episode 026 scenes (read your crush's mind) — story episode
const t26_PK='#FF7AC8', t26_PU='#B57CFF', t26_LAV='#F1E4FF', t26_AMB='#FFB45C';
// LEAVES IN keyframes: [global seconds, seconds until Dr. Osei drives off] — lands on each spoken number
const t26_KF=[[328.3,900],[391.8,720],[407.4,480],[413.1,300],[476.8,215]];
function t26_left(gt){const K=t26_KF;if(gt<=K[0][0])return K[0][1];for(let i=1;i<K.length;i++)if(gt<=K[i][0])return lerp(K[i-1][1],K[i][1],(gt-K[i-1][0])/(K[i][0]-K[i-1][0]));return K[K.length-1][1];}
function t26_fmt(sec){sec=Math.max(0,Math.ceil(sec));return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;}
function t26_timer(sec,g,o={}){const {x=1660,y=120,s=1,label='HE DRIVES IN',safe=0}=o;const c=safe?P.mint:sec<=360?P.red:t26_AMB;const pl=safe?1:1+.035*Math.sin(g*8);
  return `<g transform="translate(${x},${y}) scale(${(s*pl).toFixed(3)})"><rect x="-230" y="-80" width="460" height="160" rx="20" fill="#14061A" fill-opacity=".92" stroke="${c}" stroke-width="7"/>
   <g transform="translate(-186,-40) scale(.5)"><rect x="-40" y="-16" width="80" height="26" rx="10" fill="${c}"/><path d="M-26 -16 L-14 -34 H14 L26 -16Z" fill="${c}"/><circle cx="-22" cy="12" r="9" fill="#14061A"/><circle cx="22" cy="12" r="9" fill="#14061A"/></g>
   <text x="14" y="-30" text-anchor="middle" font-size="30" font-weight="900" letter-spacing="3" fill="${c}">${safe?'KEYS HANDED OVER':label}</text>
   <text y="52" text-anchor="middle" font-size="88" font-weight="900" fill="#fff" style="font-variant-numeric:tabular-nums">${safe?'SAFE':t26_fmt(sec)}</text></g>`;}
// thought bubble: rounded cloud + trailing dots toward the thinker (tx,ty relative to the bubble centre)
function t26_think(x,y,str,o={}){const {size=50,col=t26_PK,sc=1,tx=0,ty=null,op=1,minw=300,hi=-1,tag='THOUGHT',italic=true,glow=0}=o;const L=Array.isArray(str)?str:[str];
  const w=Math.max(minw,Math.max(...L.map(l=>l.length))*size*.62+100),h=L.length*size*1.18+64;const ey=ty==null?h/2+110:ty;
  let bumps='';const nb=Math.max(4,Math.round(w/120));for(let i=0;i<nb;i++){const bx=-w/2+40+i*(w-80)/(nb-1);bumps+=`<circle cx="${bx.toFixed(0)}" cy="${(-h/2+6).toFixed(0)}" r="${(34+(i%2)*8)}" fill="#1A0A26"/><circle cx="${bx.toFixed(0)}" cy="${(h/2-6).toFixed(0)}" r="${(30+((i+1)%2)*8)}" fill="#1A0A26"/>`;}
  const dots=[.35,.62,.86].map((k,i)=>`<circle cx="${(tx*k).toFixed(0)}" cy="${(h/2+(ey-h/2)*k).toFixed(0)}" r="${16-i*4}" fill="#1A0A26" stroke="${col}" stroke-width="5"/>`).join('');
  return `<g transform="translate(${x},${y}) scale(${typeof sc==='number'?sc.toFixed(3):sc})" opacity="${op}">${glow?`<ellipse rx="${w*.7}" ry="${h*1.1}" fill="${col}" opacity="${(.18*glow).toFixed(2)}"/>`:''}${dots}
   <g stroke="${col}" stroke-width="14" stroke-linejoin="round">${bumps}<rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="${Math.min(60,h/2)}" fill="#1A0A26"/></g>${bumps}<rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="${Math.min(60,h/2)}" fill="#1A0A26"/>
   <g transform="translate(${-w/2+30},${-h/2-26})"><rect y="-22" width="${tag.length*19+72}" height="44" rx="16" fill="${col}" stroke="${INK}" stroke-width="5"/><path d="M14 0 q0 -14 14 -14 q10 0 12 8 q12 0 12 10 q0 12 -14 12 h-12 q-12 0 -12 -16Z" fill="#FFD6EC" stroke="${INK}" stroke-width="3"/><text x="62" y="9" font-size="26" font-weight="900" letter-spacing="2" fill="${INK}">${tag}</text></g>
   ${L.map((l,i)=>`<text y="${((i-(L.length-1)/2)*size*1.18+size*.36+4).toFixed(1)}" text-anchor="middle" font-size="${size}" font-weight="900" ${italic?'font-style="italic"':''} fill="${hi===i?col:'#fff'}">${l}</text>`).join('')}</g>`;}
// Maya: planetarium volunteer (this episode). long curly hair, star headband, purple jumper
function t26_maya(o){const {x=0,y=0,s=1,t=0,pose='down',mouth='smile',look=0,blink=0,legs='stand',blush=0,brows='calm',rot=0,dir=1}=o;
  const LW=14,by=Math.sin(t*2.4+3)*4,skin='#B07650',hair='#2B1426',top='#8A4FD8',top2='#6E36B8';
  const limb=(d,col=P.cream)=>`<path d="${d}" stroke="${INK}" stroke-width="${LW+10}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${col}" stroke-width="${LW}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const wa=Math.sin(t*9)*20;
  const A={down:['M0 40 Q-48 80 -60 145','M0 40 Q48 80 60 145'],point:['M0 40 Q-48 80 -60 145','M0 40 L85 35 L165 15'],wave:['M0 40 Q-48 80 -60 145',`M0 40 Q90 40 ${120+wa*.4} ${-30+wa}`],
    mic:['M0 40 Q-48 80 -60 145','M0 40 Q70 70 40 -10'],hold:['M0 40 Q-40 95 30 92','M0 40 Q40 95 62 82'],shrug:['M0 40 Q-70 70 -110 10','M0 40 Q70 70 110 10'],
    tap:['M0 40 Q-48 80 -60 145','M0 40 Q90 30 66 -70'],up:[`M0 40 Q-70 10 -100 ${-70+Math.sin(t*6)*8}`,`M0 40 Q70 10 100 ${-70+Math.sin(t*6+1)*8}`],hips:['M0 40 Q-70 80 -12 118','M0 40 Q70 80 12 118']}[pose]||[];
  const lg=legs==='walk'?Math.sin(t*8)*22:0;
  const L=legs==='sit'?['M0 170 L-70 170 L-70 290','M0 170 L60 175 L60 290']:legs==='flat'?['M0 170 L-30 300','M0 170 L40 300']:[`M0 170 Q${-20-lg} 230 ${-38-lg} 300`,`M0 170 Q${20+lg} 230 ${38+lg} 300`];
  const curls=[[-92,-40],[-100,10],[-88,60],[-60,96],[92,-40],[100,10],[88,60],[60,96],[-70,-110],[70,-110],[0,-140]].map(([cx,cy],i)=>`<circle cx="${cx}" cy="${cy}" r="${40+(i%3)*6}" fill="${hair}" stroke="${INK}" stroke-width="8"/>`).join('');
  const bY={calm:-98,raised:-110,sad:-100,angry:-92}[brows]||-98,bR={calm:0,raised:-6,sad:-14,angry:16}[brows]||0;
  const eyes=blink?`<path d="M-42 -62 q14 8 28 0 M14 -62 q14 8 28 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`
    :`<ellipse cx="-28" cy="-62" rx="14" ry="17" fill="#fff" stroke="${INK}" stroke-width="5"/><ellipse cx="28" cy="-62" rx="14" ry="17" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="${-28+look*6}" cy="-60" r="8" fill="#2A1030"/><circle cx="${28+look*6}" cy="-60" r="8" fill="#2A1030"/><circle cx="${-25+look*6}" cy="-64" r="3" fill="#fff"/><circle cx="${31+look*6}" cy="-64" r="3" fill="#fff"/>
     <path d="M-44 -74 l-10 -8 M-40 -78 l-6 -10 M44 -74 l10 -8 M40 -78 l6 -10" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  const M={smile:`<path d="M-20 -24 Q0 -4 20 -24" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`,smirk:`<path d="M-16 -18 Q6 -10 22 -28" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    o:`<ellipse cx="0" cy="-16" rx="11" ry="14" fill="#3a1220" stroke="${INK}" stroke-width="5"/>`,laugh:`<path d="M-24 -28 H24 Q20 4 0 4 Q-20 4 -24 -28Z" fill="#3a1220" stroke="${INK}" stroke-width="5"/>`,
    flat:`<path d="M-12 -18 H12" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`,closed:`<path d="M-14 -18 H14" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`}[mouth]||'';
  return `<g transform="translate(${x},${y+by}) rotate(${rot}) scale(${s*dir},${s})">
    <ellipse cx="0" cy="302" rx="72" ry="12" fill="rgba(0,0,0,.3)"/>${curls}
    ${limb(L[0],'#3B2A58')}${limb(L[1],'#3B2A58')}<path d="M-52 30 Q0 18 52 30 L60 180 Q0 194 -60 180Z" fill="${top}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M0 70 l8 18 l20 2 l-15 13 l5 20 l-18 -11 l-18 11 l5 -20 l-15 -13 l20 -2Z" fill="${P.gold}" stroke="${INK}" stroke-width="3"/>
    ${A[0]?limb(A[0],top2):''}${A[1]?limb(A[1],top2):''}${pose==='mic'?`<g transform="translate(40,-10) rotate(30)"><rect x="-10" y="-10" width="20" height="56" rx="8" fill="#2A2A38" stroke="${INK}" stroke-width="5"/><circle cy="-18" r="16" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/></g>`:''}
    <circle cx="0" cy="-55" r="84" fill="${skin}" stroke="${INK}" stroke-width="9"/>
    <path d="M-84 -66 Q-80 -150 0 -146 Q80 -150 84 -66 Q60 -118 18 -112 Q-20 -128 -84 -66Z" fill="${hair}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M-78 -92 Q0 -150 78 -92" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M-78 -92 Q0 -150 78 -92" stroke="${t26_PK}" stroke-width="9" fill="none" stroke-linecap="round"/>
    ${[[-44,-118],[0,-130],[44,-118]].map(([sx,sy])=>`<path d="M${sx} ${sy-12} l4 8 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1Z" fill="${P.gold}" stroke="${INK}" stroke-width="2.5"/>`).join('')}
    <g transform="translate(0,${bR?0:0})"><path d="M-44 ${bY} L-14 ${bY}" stroke="${INK}" stroke-width="7" stroke-linecap="round" transform="rotate(${bR} -30 ${bY})"/><path d="M14 ${bY} L44 ${bY}" stroke="${INK}" stroke-width="7" stroke-linecap="round" transform="rotate(${-bR} 30 ${bY})"/></g>
    ${eyes}${M}<ellipse cx="-50" cy="-30" rx="${14+blush*6}" ry="${10+blush*3}" fill="#FF6FA8" opacity="${(.35+blush*.5).toFixed(2)}"/><ellipse cx="50" cy="-30" rx="${14+blush*6}" ry="${10+blush*3}" fill="#FF6FA8" opacity="${(.35+blush*.5).toFixed(2)}"/>
  </g>`;}
// extra blush over Glint (same x,y,s,t as the glint() call)
function t26_blush(x,y,s,t,a=1){const by=Math.sin(t*2.4)*5;return a>0?`<g transform="translate(${x},${(y+by).toFixed(1)}) scale(${s})" opacity="${a.toFixed(2)}"><ellipse cx="-58" cy="-24" rx="30" ry="15" fill="#FF4F8F" opacity=".7"/><ellipse cx="58" cy="-24" rx="30" ry="15" fill="#FF4F8F" opacity=".7"/><path d="M-82 -36 l10 -8 M-70 -36 l10 -8 M62 -36 l10 -8 M74 -36 l10 -8" stroke="#FF4F8F" stroke-width="5" stroke-linecap="round"/></g>`:'';}
// sleepy lids for Dr. Osei (same x,y,s,t as the person() call); amt 0..1
function t26_lids(x,y,s,t,amt=.5){const S=s*1.02,by=Math.sin(t*2.4+4)*4,h=24*amt;
  return `<g transform="translate(${x},${(y+by).toFixed(1)}) scale(${S})"><rect x="-44" y="-76" width="32" height="${(h).toFixed(1)}" fill="#6B3F24"/><rect x="12" y="-76" width="32" height="${(h).toFixed(1)}" fill="#6B3F24"/><path d="M-44 ${(-76+h).toFixed(1)} H-12 M12 ${(-76+h).toFixed(1)} H44" stroke="${INK}" stroke-width="5" stroke-linecap="round"/></g>`;}
const t26_osei=o=>person({...o,who:'osei'});
function t26_zzz(x,y,g,a=1){if(a<=0)return '';let s='';for(let i=0;i<3;i++){const k=((g*.6+i/3)%1);s+=`<text x="${(x+k*60).toFixed(0)}" y="${(y-k*110).toFixed(0)}" font-size="${(34+k*30).toFixed(0)}" font-weight="900" fill="${P.ice}" opacity="${(a*(1-k)).toFixed(2)}">Z</text>`;}return s;}
// ---------- sets ----------
const t26_DEF=`<defs><linearGradient id="t26hall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A0F3E"/><stop offset=".7" stop-color="#5A1F5E"/><stop offset="1" stop-color="#7A2A62"/></linearGradient>
 <radialGradient id="t26dome" cx=".5" cy=".85" r=".9"><stop offset="0" stop-color="#3A1A6A"/><stop offset=".6" stop-color="#1A0B38"/><stop offset="1" stop-color="#090418"/></radialGradient>
 <radialGradient id="t26pk"><stop offset="0" stop-color="${t26_PK}" stop-opacity=".75"/><stop offset="1" stop-color="${t26_PK}" stop-opacity="0"/></radialGradient>
 <radialGradient id="t26pu"><stop offset="0" stop-color="${t26_PU}" stop-opacity=".75"/><stop offset="1" stop-color="${t26_PU}" stop-opacity="0"/></radialGradient>
 <linearGradient id="t26night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A0820"/><stop offset="1" stop-color="#2A1446"/></linearGradient></defs>`;
function t26_lights(g,y0=120,n=9){let s='';for(let k=0;k<2;k++){const yy=y0+k*90;s+=`<path d="M-40 ${yy} Q480 ${yy+90} 960 ${yy} Q1440 ${yy+90} 1960 ${yy}" stroke="#1A0A20" stroke-width="5" fill="none"/>`;
  for(let i=0;i<=n*2;i++){const x=-40+i*2000/(n*2),seg=(i%n)/n,yb=yy+Math.sin(seg*Math.PI)*90*(i%(n)===0?0:1)*.98,c=[P.gold,t26_PK,P.mint,t26_PU][(i+k)%4],on=.55+.45*Math.abs(Math.sin(g*2+i*1.7+k));s+=`<circle cx="${x.toFixed(0)}" cy="${(yb+10).toFixed(0)}" r="20" fill="${c}" opacity="${(on*.25).toFixed(2)}"/><circle cx="${x.toFixed(0)}" cy="${(yb+10).toFixed(0)}" r="9" fill="${c}" opacity="${on.toFixed(2)}"/>`;}}return s;}
function t26_lantern(x,y,s,g,c=t26_PK){const sw=Math.sin(g*1.4+x)*4;return `<g transform="translate(${x},${y}) rotate(${sw.toFixed(1)}) scale(${s})"><path d="M0 -200 V-60" stroke="#1A0A20" stroke-width="4"/><circle r="130" fill="${c}" opacity=".18"/><ellipse rx="56" ry="66" fill="${c}" stroke="${INK}" stroke-width="6"/><path d="M-50 -20 Q0 -10 50 -20 M-54 14 Q0 24 54 14" stroke="${INK}" stroke-width="3" opacity=".4" fill="none"/><rect x="-24" y="-78" width="48" height="14" rx="4" fill="#3A1A30" stroke="${INK}" stroke-width="4"/><rect x="-24" y="62" width="48" height="14" rx="4" fill="#3A1A30" stroke="${INK}" stroke-width="4"/></g>`;}
function t26_dino(x,y,s=1,op=1){const b='#E9DCC4';let rib='';for(let i=0;i<7;i++){const rx=-120+i*42;rib+=`<path d="M${rx} ${-150+Math.abs(i-3)*6} q14 70 0 110" stroke="${b}" stroke-width="12" fill="none" stroke-linecap="round"/>`;}
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="${op}"><g stroke="${INK}" stroke-width="24" fill="none" stroke-linecap="round" opacity=".55"><path d="M-420 -60 Q-250 -200 0 -170 Q200 -160 320 -260"/><path d="M-60 -60 L-90 160 M40 -70 L70 160"/></g>
   <path d="M-420 -60 Q-250 -200 0 -170 Q200 -160 320 -260" stroke="${b}" stroke-width="14" fill="none" stroke-linecap="round"/>${rib}
   <path d="M-60 -60 L-90 70 L-70 160 M40 -70 L70 70 L50 160 M200 -190 L230 -120" stroke="${b}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
   <g transform="translate(350,-280) rotate(-12)"><path d="M-40 -30 Q30 -60 100 -20 L110 20 Q40 40 -30 30Z" fill="none" stroke="${b}" stroke-width="12" stroke-linejoin="round"/><circle cx="10" cy="-10" r="12" fill="none" stroke="${b}" stroke-width="7"/><path d="M40 24 l6 14 M60 22 l6 14 M80 18 l6 14" stroke="${b}" stroke-width="6"/></g></g>`;}
function t26_crowd(g,o={}){const {n=14,seed=5,y=600,s=.55,op=.75,x0=0,x1=1920,mumble=0}=o;const r=rng(seed);let c='';const heads=['#E8B898','#C68B59','#8A5A3A','#F2C9A0','#B07650','#D9A878'];
  for(let i=0;i<n;i++){const x=x0+(i+.5)*(x1-x0)/n+(r()-.5)*40,yy=y+r()*40,ss=s*(.85+r()*.3);c+=`<g opacity="${op}">${extra({x,y:yy,s:ss,t:g+i,head:heads[i%heads.length],pose:r()>.7?'hold':'down',mouth:r()>.6?'laugh':'smile'})}</g>`;
    if(mumble&&((Math.floor(g*1.3+i*.7))%3===0))c+=`<text x="${x.toFixed(0)}" y="${(yy-120*ss).toFixed(0)}" text-anchor="middle" font-size="34" font-weight="900" fill="#C9B8E0" opacity="${(mumble*.7).toFixed(2)}">mmm…</text>`;}
  return c;}
function t26_hall(g,o={}){const {lights=1,dino=1,banner=1}=o;
  return `${t26_DEF}<rect width="1920" height="1080" fill="url(#t26hall)"/>${[160,620,1300,1760].map(x=>`<rect x="${x-60}" y="0" width="120" height="820" fill="#2A0F38" stroke="${INK}" stroke-width="6"/><rect x="${x-80}" y="0" width="160" height="40" fill="#3A1748"/>`).join('')}
   ${dino?t26_dino(960,660,1.05,.9):''}<circle cx="960" cy="300" r="520" fill="url(#t26pk)" opacity=".35"/>
   <rect y="820" width="1920" height="260" fill="#2A1230"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="6"/>${[...Array(12)].map((_,i)=>`<path d="M${i*170} 820 L${i*170-120} 1080" stroke="#3A1A40" stroke-width="5"/>`).join('')}
   ${lights?t26_lights(g):''}${banner?`<g transform="translate(960,70)">${t21_sign(0,0,'LATE NIGHT',t26_PK,g,54)}</g>`:''}`;}
function t26_meg(x,y,s,g,o={}){const {fog=0,crack=0,glow=.4,label=1}=o;let fg='';
  for(let i=0;i<10;i++){const k=((g*.5+i/10)%1),fx=(i%2?1:-1)*(40+k*380*fog)+Math.sin(g+i)*20;fg+=`<circle cx="${fx.toFixed(0)}" cy="${(-160-k*80+k*k*260).toFixed(0)}" r="${(40+k*120).toFixed(0)}" fill="#F4F8FF" opacity="${(fog*.55*(1-k)).toFixed(2)}"/>`;}
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="300" rx="260" ry="28" fill="rgba(0,0,0,.35)"/>
   <rect x="-200" y="-560" width="400" height="460" rx="40" fill="url(#steel)" stroke="${INK}" stroke-width="10"/><rect x="-220" y="-590" width="440" height="60" rx="18" fill="#7E8AA2" stroke="${INK}" stroke-width="10"/>
   <path d="M-200 -120 Q-230 40 -140 110 Q0 170 140 110 Q230 40 200 -120Z" fill="#C9D3E3" stroke="${INK}" stroke-width="10"/><path d="M-130 40 Q0 120 130 40 Q120 -40 0 -50 Q-120 -40 -130 40Z" fill="#1A1430" stroke="${INK}" stroke-width="7"/>
   ${[...Array(7)].map((_,i)=>`<circle cx="${-150+i*50}" cy="${-60+Math.abs(i-3)*10}" r="10" fill="${P.mint}" opacity="${(glow*(.5+.5*Math.sin(g*6+i))).toFixed(2)}"/>`).join('')}
   <path d="M-60 140 V300 M60 140 V300" stroke="${INK}" stroke-width="18"/><rect x="-140" y="280" width="280" height="30" rx="10" fill="#5D6A82" stroke="${INK}" stroke-width="7"/>
   ${label?`<rect x="-150" y="-470" width="300" height="80" rx="12" fill="#14061A" stroke="${P.ice}" stroke-width="6"/><text y="-415" text-anchor="middle" font-size="44" font-weight="900" fill="${P.ice}">−269°C</text>`:''}
   ${crack?`<path d="M200 -330 L240 -300 L226 -270 L262 -240" stroke="#fff" stroke-width="9" fill="none" stroke-linejoin="round"/>${[0,1,2].map(i=>{const k=((g*2.4+i/3)%1);return `<path d="M${270+k*200} ${-280-i*24} h${60+k*40}" stroke="#E6FAFF" stroke-width="${(10*(1-k)).toFixed(1)}" stroke-linecap="round" opacity="${(1-k).toFixed(2)}"/>`;}).join('')}`:''}
   ${fg}</g>`;}
function t26_planet(g,o={}){const {show=1,seats=1,saturn=1}=o;const r=rng(26);let st='';for(let i=0;i<110;i++){const a=r()*Math.PI,d=r();const x=960+Math.cos(a)*1000*d*1.05,y=860-Math.sin(a)*820*d;st+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1+r()*3).toFixed(1)}" fill="#fff" opacity="${(.3+.6*Math.abs(Math.sin(g*1.1+i))).toFixed(2)}"/>`;}
  const sat=saturn?`<g transform="translate(1440,300) rotate(-18)"><ellipse rx="190" ry="44" fill="none" stroke="#E8C98A" stroke-width="16" opacity=".9"/><circle r="100" fill="#F0C987" stroke="${INK}" stroke-width="6"/><path d="M-96 -20 Q0 -10 96 -20 M-90 26 Q0 36 90 26" stroke="#C99A5A" stroke-width="10" fill="none"/><path d="M-190 0 A190 44 0 0 0 190 0" fill="none" stroke="#E8C98A" stroke-width="16"/></g>`:'';
  let rows='';if(seats)for(let k=0;k<3;k++)for(let i=0;i<12;i++){const x=120+i*150+(k%2)*70,y=900+k*70;rows+=`<rect x="${x-56}" y="${y-60}" width="112" height="90" rx="26" fill="#2A1046" stroke="${INK}" stroke-width="5"/>`;}
  return `${t26_DEF}<rect width="1920" height="1080" fill="#090418"/><path d="M-120 880 A1080 900 0 0 1 2040 880 V1080 H-120Z" fill="url(#t26dome)"/>${st}
   ${show?`<ellipse cx="760" cy="420" rx="520" ry="200" fill="${t26_PU}" opacity=".12"/><ellipse cx="1100" cy="380" rx="420" ry="140" fill="${t26_PK}" opacity=".1"/>`:''}${sat}
   <path d="M-120 880 A1080 900 0 0 1 2040 880" fill="none" stroke="#3A1A6A" stroke-width="10"/>${rows}`;}
function t26_car(x,y,s,o={}){const {col='#3D5A8A',lights=0,taxi=0,g=0,driver=''}=o;
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="96" rx="330" ry="20" fill="rgba(0,0,0,.4)"/>${lights?`<path d="M300 20 L1200 -120 L1200 200Z" fill="#FFF3C4" opacity=".14"/>`:''}
   <path d="M-320 60 L-300 -20 L-170 -40 L-90 -120 H120 L210 -40 L320 -20 L330 60Z" fill="${taxi?'#FFC83D':col}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
   <path d="M-150 -44 L-80 -106 H0 V-44Z M24 -44 V-106 H110 L180 -44Z" fill="#9AD1FF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>${driver}
   ${taxi?`<rect x="-50" y="-160" width="100" height="40" rx="10" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><text y="-130" text-anchor="middle" font-size="28" font-weight="900" fill="${INK}">TAXI</text>`:''}
   <circle cx="-190" cy="64" r="50" fill="#22202E" stroke="${INK}" stroke-width="8"/><circle cx="200" cy="64" r="50" fill="#22202E" stroke="${INK}" stroke-width="8"/><circle cx="-190" cy="64" r="18" fill="#9AA7BD"/><circle cx="200" cy="64" r="18" fill="#9AA7BD"/>
   <rect x="300" y="-10" width="26" height="22" rx="6" fill="${lights?'#FFF3C4':'#E8E2D6'}" stroke="${INK}" stroke-width="4"/><rect x="-322" y="-6" width="20" height="20" rx="5" fill="${P.red}" stroke="${INK}" stroke-width="4"/></g>`;}
function t26_carpark(g,o={}){const {museum=1}=o;const r=rng(9);let st='';for(let i=0;i<50;i++)st+=`<circle cx="${(r()*1920).toFixed(0)}" cy="${(r()*420).toFixed(0)}" r="${(1+r()*2).toFixed(1)}" fill="#fff" opacity="${(.3+.5*Math.abs(Math.sin(g+i))).toFixed(2)}"/>`;
  return `${t26_DEF}<rect width="1920" height="1080" fill="url(#t26night)"/>${st}<circle cx="1640" cy="170" r="60" fill="#FFF4DC" opacity=".9"/>
   ${museum?`<path d="M80 640 V300 L560 180 L1040 300 V640Z" fill="#2A1846" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>${[...Array(5)].map((_,i)=>`<rect x="${150+i*170}" y="360" width="60" height="280" fill="#3A2260" stroke="${INK}" stroke-width="5"/><rect x="${215+i*170}" y="420" width="50" height="90" fill="${t26_PK}" opacity="${(.5+.3*Math.sin(g*2+i)).toFixed(2)}"/>`).join('')}<text x="560" y="275" text-anchor="middle" font-size="40" font-weight="900" fill="${t26_LAV}" letter-spacing="6">MUSEUM</text>`:''}
   <rect y="640" width="1920" height="440" fill="#262238"/><path d="M0 640 H1920" stroke="${INK}" stroke-width="6"/>${[...Array(8)].map((_,i)=>`<path d="M${160+i*240} 700 L${120+i*240} 1080" stroke="#E8E2D6" stroke-width="8" opacity=".35"/>`).join('')}
   ${[1250,1800].map(x=>`<rect x="${x-8}" y="240" width="16" height="420" fill="#4A4660" stroke="${INK}" stroke-width="4"/><path d="M${x} 240 h50" stroke="#4A4660" stroke-width="12"/><circle cx="${x+56}" cy="250" r="200" fill="url(#gWarm)" opacity=".35"/><ellipse cx="${x+56}" cy="250" rx="26" ry="12" fill="#FFD9A0"/>`).join('')}`;}
function t26_stall(g){return `${t26_hall(g,{dino:0,banner:0})}<g transform="translate(960,180)">${t21_sign(0,0,'BAKE-OFF STALL',P.gold,g,50)}</g>
   ${[...Array(9)].map((_,i)=>`<path d="M${520+i*100} 270 l50 70 l50 -70Z" fill="${[t26_PK,P.gold,P.mint][i%3]}" stroke="${INK}" stroke-width="4"/>`).join('')}<path d="M500 270 H1440" stroke="#1A0A20" stroke-width="5"/>
   <rect x="440" y="640" width="1040" height="60" rx="10" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><rect x="460" y="700" width="1000" height="160" fill="#F2B8D8" stroke="${INK}" stroke-width="8"/>${[...Array(10)].map((_,i)=>`<path d="M${460+i*100} 700 v160" stroke="#E79BC4" stroke-width="16"/>`).join('')}
   <g transform="translate(620,600)"><ellipse cx="0" cy="30" rx="110" ry="18" fill="#E8E2D6" stroke="${INK}" stroke-width="5"/><rect x="-90" y="-40" width="180" height="70" rx="12" fill="#E8C08A" stroke="${INK}" stroke-width="6"/><rect x="-90" y="-10" width="180" height="12" fill="#C0304A"/><path d="M-90 -40 h180" stroke="#FFF6EA" stroke-width="10"/></g>
   <g transform="translate(1300,610)"><ellipse cx="0" cy="22" rx="90" ry="14" fill="#E8E2D6" stroke="${INK}" stroke-width="5"/><path d="M-70 20 L-50 -40 H50 L70 20Z" fill="#7A4A2A" stroke="${INK}" stroke-width="6"/><circle cx="-20" cy="-50" r="12" fill="#C0304A" stroke="${INK}" stroke-width="3"/><circle cx="20" cy="-52" r="12" fill="#C0304A" stroke="${INK}" stroke-width="3"/></g>`;}
function t26_cake(x,y,s=1,brick=0){return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="40" rx="150" ry="22" fill="#E8E2D6" stroke="${INK}" stroke-width="6"/><rect x="-120" y="-50" width="240" height="90" rx="14" fill="${brick?'#B5562E':'#F0C98A'}" stroke="${INK}" stroke-width="7"/>${brick?`<path d="M-120 -5 H120 M-40 -50 V-5 M60 -50 V-5 M10 -5 V40 M-80 -5 V40" stroke="#7A3218" stroke-width="6"/>`:`<rect x="-120" y="-10" width="240" height="14" fill="#E0405A"/><path d="M-120 -50 h240" stroke="#FFF6EA" stroke-width="12"/>`}</g>`;}
function t26_hotdog(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-130 0 Q-130 -40 -90 -40 H90 Q130 -40 130 0 Q130 40 90 40 H-90 Q-130 40 -130 0Z" fill="#E8B060" stroke="${INK}" stroke-width="7"/><path d="M-150 -6 Q-150 -26 -120 -26 H120 Q150 -26 150 -6 Q150 14 120 14 H-120 Q-150 14 -150 -6Z" fill="#D0503A" stroke="${INK}" stroke-width="6"/><path d="M-110 -8 q20 -14 40 0 t40 0 t40 0 t40 0 t40 0" stroke="${P.gold}" stroke-width="7" fill="none"/></g>`;}
function t26_board(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-150" y="-20" width="300" height="40" rx="20" fill="${P.mint}" stroke="${INK}" stroke-width="7"/><circle cx="-90" cy="34" r="20" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><circle cx="90" cy="34" r="20" fill="${P.gold}" stroke="${INK}" stroke-width="6"/></g>`;}
function t26_scanner(x,y,s,g,o={}){const {lit=.5}=o;return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-260" y="-220" width="520" height="440" rx="60" fill="#E8EEF8" stroke="${INK}" stroke-width="10"/><circle r="140" fill="#1A1430" stroke="${INK}" stroke-width="10"/><circle r="140" fill="none" stroke="${P.mint}" stroke-width="6" opacity="${(lit*(.5+.5*Math.sin(g*4))).toFixed(2)}"/>
   <rect x="-420" y="40" width="560" height="60" rx="20" fill="#C9D3E3" stroke="${INK}" stroke-width="8"/><g transform="translate(-260,40) scale(.42) rotate(-90)">${extra({t:0,head:'#F2C9A0'})}</g>
   <g transform="translate(-60,-40)"><path d="M-30 -30 h40 a24 24 0 0 1 0 48 h-40Z" fill="#2A2A38" stroke="${INK}" stroke-width="5"/><path d="M14 -40 q30 30 0 60 M30 -54 q44 44 0 88" stroke="${P.gold}" stroke-width="7" fill="none" opacity="${(.4+.6*Math.abs(Math.sin(g*5))).toFixed(2)}"/></g></g>`;}
function t26_brainIcon(x,y,s=1,col=t26_PK,g=0){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-80 10 C-100 -60 -30 -90 0 -64 C30 -90 104 -60 80 10 C100 54 40 80 0 60 C-40 80 -100 54 -80 10Z" fill="#FFB6D9" stroke="${INK}" stroke-width="7"/><path d="M0 -64 V60 M-50 -30 q20 10 6 30 M50 -30 q-20 10 -6 30" stroke="#E07AAE" stroke-width="6" fill="none" stroke-linecap="round"/><circle r="110" fill="none" stroke="${col}" stroke-width="5" opacity="${(.3+.3*Math.sin(g*4)).toFixed(2)}"/></g>`;}
function t26_hours(x,y,w,frac,label,col=P.gold,size=34){return `<g transform="translate(${x},${y})"><rect x="0" y="-18" width="${w}" height="36" rx="18" fill="#14061A" stroke="${INK}" stroke-width="6"/><rect x="4" y="-14" width="${Math.max(0,(w-8)*clamp(frac)).toFixed(0)}" height="28" rx="14" fill="${col}"/><text x="${w+20}" y="12" font-size="${size}" font-weight="900" fill="#fff">${label}</text></g>`;}

Object.assign(SHOTS,{
aniHook26(t,d,p,g){
  const aw=AT(t,p.awake??2.5),ff=AT(t,p.fifteen??6.6),mw=AT(t,p.motor??8.3),kn=AT(t,p.knows??11.3),ht=AT(t,p.heard??13);
  const yawn=Math.sin(g*1.3)>.6;
  const dr=`<g transform="translate(-110,-70) scale(.42)">${t26_osei({t:g,mouth:'flat',blink:Math.sin(g*1.1)>.3?1:0})}</g>`;
  return `${t26_carpark(g)}${t26_car(1180,830,1.1,{lights:mw?1:0,g,driver:mw?dr:''})}
   ${mw?'':`${t26_osei({x:1160,y:560,s:.95,t:g,mouth:yawn?'o':'flat',pose:'hold',blink:Math.sin(g*1.1)>.5?1:0})}${t26_lids(1160,560,.95,g,.6)}<g transform="translate(1250,640)"><circle r="12" fill="none" stroke="${P.gold}" stroke-width="6"/><path d="M10 6 l30 16 M30 16 l-6 10" stroke="${P.gold}" stroke-width="6"/></g>${t26_zzz(1240,380,g,yawn?1:.5)}`}
   ${aw?t26_think(1180,250,'AWAKE 20 HOURS',{size:58,col:P.ice,tag:'DR. OSEI',sc:pop(t,p.awake??2.5),tx:-20,ty:200}):''}
   ${glint({x:420,y:560,s:.95,t:g,mouth:kn?'o':'flat',brows:'raised',look:1,blink:kn?0:BL(g),sweat:ht?1:0})}
   ${ff?t26_timer(900,g,{x:420,y:200,s:1.05}):''}${mw?`<g transform="translate(1180,520) scale(${pop(t,p.motor??8.3).toFixed(3)})">${labelPill(0,0,'90 MINUTES OF MOTORWAY',P.coral,44)}</g>`:''}
   ${ht?`<g transform="translate(420,880) scale(${pop(t,p.heard??13).toFixed(3)})">${labelPill(0,0,'HE HEARD THE THOUGHT',t26_PK,46)}</g>`:''}
   ${T(960,ff?150:150,'ABOUT TO DRIVE HALF ASLEEP',{size:ff?62:88,fill:P.white,sc:IN(t,.1)})}`;
},
aniCast(t,d,p,g){
  const bf=AT(t,p.best??3.3),me=AT(t,p.mentor??4.6),gi=AT(t,p.girl??5.6),nb=AT(t,p.nobody??8.4);
  return `${t26_hall(g)}${t26_crowd(g,{n:10,y:560,s:.45,op:.5})}
   ${person({x:330,y:560,s:.85,t:g,who:'kai',mouth:'grin',blink:BL(g+1)})}${t26_osei({x:1590,y:560,s:.85,t:g,mouth:'flat',blink:BL(g+2)})}${t26_lids(1590,560,.85,g,.5)}
   ${t26_maya({x:1180,y:600,s:.78,t:g,mouth:'smile',look:-1,blink:BL(g+.5)})}
   ${glint({x:760,y:560,s:.95,t:g,mouth:gi?'o':'smile',brows:'raised',blink:BL(g),glint:gi?1:0})}${t26_blush(760,560,.95,g,gi?prog(t,p.girl??5.6,(p.girl??5.6)+.6):0)}
   ${bf?t26_think(330,250,'HOT DOG?',{size:46,col:P.gold,tag:'KAI',minw:240,sc:pop(t,p.best??3.3),ty:140}):''}
   ${me?t26_think(1590,250,'SO TIRED…',{size:46,col:P.ice,tag:'DR. OSEI',minw:260,sc:pop(t,p.mentor??4.6),ty:140}):''}
   ${gi?t26_think(1180,300,'♥ ?',{size:60,col:t26_PK,tag:'MAYA',minw:200,sc:pop(t,p.girl??5.6),ty:150}):''}
   ${nb?T(960,862,'NOBODY WILL BELIEVE HIM',{size:72,fill:P.coral,sc:pop(t,p.nobody??8.4)}):T(960,862,'HE CAN HEAR THOUGHTS',{size:72,fill:t26_PK,sc:IN(t,.2)})}`;
},
aniLate(t,d,p,g){
  const th=AT(t,p.three??1.2),gu=AT(t,p.guests??6),ex=AT(t,p.exhibit??8);
  if(!th) return `${t21_card('cardDark',g)}<g transform="translate(960,470) scale(${pop(t,.05).toFixed(3)})">${[0,1].map(i=>`<path d="M${-20-i*110} -90 L${-150-i*110} 0 L${-20-i*110} 90Z" fill="${t26_PK}" stroke="${INK}" stroke-width="10" stroke-linejoin="round" transform="translate(${130+((g*200)%40)},0)"/>`).join('')}</g>${T(960,700,"LET'S GO BACK",{size:110,fill:P.white,sc:IN(t,.1)})}`;
  const notes=[0,1,2,3].map(i=>{const k=((g*.4+i/4)%1);return `<text x="${(300+i*420+Math.sin(g+i)*30).toFixed(0)}" y="${(700-k*360).toFixed(0)}" font-size="60" fill="${[t26_PK,P.gold,P.mint,t26_PU][i]}" opacity="${(1-k).toFixed(2)}">♪</text>`;}).join('');
  return `${t26_hall(g)}${[[360,330],[1560,330],[760,250],[1160,250]].map(([x,y],i)=>t26_lantern(x,y,.9,g,[t26_PK,t26_PU,P.gold,t26_PK][i])).join('')}${notes}
   ${gu?t26_crowd(g,{n:12,y:600,s:.5,op:.85,seed:3}):''}
   ${!gu?`<g transform="translate(330,520) scale(${pop(t,p.three??1.2).toFixed(3)})"><rect x="-210" y="-90" width="420" height="180" rx="22" fill="#14061A" stroke="${P.gold}" stroke-width="8"/>${T(0,-10,'3 HOURS',{size:84,fill:P.gold})}${T(0,60,'EARLIER',{size:50,fill:P.white})}</g>`:''}
   ${gu&&!ex?`<g transform="translate(960,858) scale(${pop(t,p.guests??6).toFixed(3)})">${labelPill(0,0,'300 GUESTS',t26_PK,56)}</g>`:''}
   ${ex?`<g transform="translate(960,858) scale(${pop(t,p.exhibit??8).toFixed(3)})">${labelPill(0,0,'NEW EXHIBIT: MIND READERS',P.mint,52)}</g>`:''}
   ${T(960,250,'LATE NIGHT AT THE MUSEUM',{size:84,fill:P.white,sc:IN(t,(p.three??1.2)+.3)})}`;
},
aniHelmet(t,d,p,g){
  const on=AT(t,p.on??3),se=AT(t,p.sens??5.2),mi=AT(t,p.minus??7);
  return `${t26_hall(g,{dino:0})}<circle cx="960" cy="560" r="480" fill="url(#gMint)" opacity="${on?.3:.1}"/>${t26_meg(960,560,.95,g,{glow:on?1:.2,label:mi?1:0})}
   <g transform="translate(960,130)">${t21_sign(0,0,'MIND READERS',P.mint,g,62)}</g>
   ${on&&!se?`<g transform="translate(1500,420) scale(${pop(t,p.on??3).toFixed(3)})">${labelPill(0,0,'ONE NIGHT ONLY',P.gold,48)}</g>`:''}
   ${se?`<g transform="translate(1500,420) scale(${pop(t,p.sens??5.2).toFixed(3)})">${labelPill(0,0,'SENSORS IN LIQUID HELIUM',P.ice,40)}</g>`:''}
   ${mi?`<g transform="translate(1500,560) scale(${pop(t,p.minus??7).toFixed(3)})">${labelPill(0,0,'NEAR ABSOLUTE ZERO',P.coral,40)}</g>`:''}
   ${T(480,862,'AN OLD BRAIN SCANNER',{size:60,fill:P.white,sc:IN(t,.3)})}`;
},
aniMaya(t,d,p,g){
  const ma=AT(t,p.maya??1.2),li=AT(t,p.liked??4.6),el=AT(t,p.eleven??6.2),th=AT(t,p.three??8.3),ka=AT(t,p.kai??11.5),gs=AT(t,p.glint??14.8);
  const cnt=el?11:0;
  if(ka){return `${t26_hall(g)}${t26_dino(980,700,.8,1)}${person({x:520,y:560,s:.95,t:g,who:'kai',mouth:gs?'flat':'grin',pose:gs?'hips':'point',brows:'raised',blink:BL(g+1)})}
     ${glint({x:gs?1380:1050,y:gs?640:560,s:.9,t:g,mouth:gs?'wavy':'o',brows:'raised',blink:BL(g),dir:-1,look:-1})}${gs?`<path d="M1180 900 Q1260 500 1240 380" stroke="#E9DCC4" stroke-width="34" stroke-linecap="round" opacity=".95"/>`:''}
     ${t21_bub(520,190,640,'“TONIGHT’S THE NIGHT.','TALK TO HER.”',{size:42,tail:'left'})}
     ${gs?t21_bub(1350,190,700,'“TONIGHT I HIDE','BEHIND THE DINOSAUR.”',{size:42,tail:'right',sc:pop(t,p.glint??14.8)}):''}`;}
  return `${t26_hall(g)}${t26_meg(1520,600,.6,g,{glow:.8,label:0})}
   ${glint({x:520,y:560,s:.95,t:g,mouth:li?'smile':'smile',brows:li?'raised':'calm',blink:BL(g),look:1})}${t26_blush(520,560,.95,g,li?1:0)}
   ${ma?t26_maya({x:1040,y:580,s:.9,t:g,mouth:'smile',pose:'wave',blink:BL(g+.6),look:-1}):''}
   ${ma&&!li?`<g transform="translate(1040,230) scale(${pop(t,p.maya??1.2).toFixed(3)})">${labelPill(0,0,'MAYA · PLANETARIUM VOLUNTEER',t26_PK,40)}</g>`:''}
   ${li&&!el?`<g transform="translate(780,230) scale(${pop(t,p.liked??4.6).toFixed(3)})">${labelPill(0,0,'LIKED HER FOR A YEAR',t26_PK,48)}</g>`:''}
   ${el?`<g transform="translate(780,230) scale(${pop(t,p.eleven??6.2).toFixed(3)})"><rect x="-300" y="-90" width="600" height="180" rx="24" fill="#14061A" stroke="${P.gold}" stroke-width="8"/>${T(0,-6,`${cnt} WORDS`,{size:96,fill:P.gold})}${T(0,62,'IN ONE WHOLE YEAR',{size:40,fill:P.white})}</g>`:''}
   ${th?`<g transform="translate(560,880) rotate(-4) scale(${pop(t,p.three??8.3).toFixed(3)})">${labelPill(0,0,'“SORRY” ×3',P.coral,46)}</g><g transform="translate(1060,858) rotate(3) scale(${pop(t,(p.three??8.3)+1.4).toFixed(3)})">${labelPill(0,0,'“EXCUSE ME” ×2',P.coral,46)}</g>`:''}`;
},
aniCrack(t,d,p,g){
  const sh=AT(t,p.shriek??1.4),fl=AT(t,p.flat??4.3),su=AT(t,p.sits??6.6),hm=AT(t,p.hears??8.6),li=AT(t,p.lips??11.6);
  const fog=sh?clamp(1-prog(t,(p.sits??6.6),(p.sits??6.6)+3)*.8):0;const shake=sh&&!su?Math.sin(g*60)*6:0;
  if(!su){return `<g transform="translate(${shake.toFixed(1)},0)">${t26_hall(g,{dino:0})}${t26_meg(1200,560,.85,g,{fog:sh?1:0,crack:1,glow:1})}
     ${glint({x:520,y:fl?700:560,s:.9,t:g,mouth:'o',brows:'raised',rot:fl?-70:0,pose:sh?'up':'down',blink:0})}${t26_maya({x:820,y:fl?720:580,s:.85,t:g,mouth:'o',rot:fl?-75:0,pose:sh?'up':'down',brows:'raised'})}</g>
     <rect width="1920" height="1080" fill="#F4F8FF" opacity="${(sh?.25+.35*fog*Math.abs(Math.sin(g*2)):0).toFixed(2)}"/>
     ${sh?T(960,170,fl?'KNOCKED FLAT':'CRACK!',{size:130,fill:P.ice,sc:pop(t,fl?p.flat??4.3:p.shriek??1.4)}):T(960,170,'A PIPE CRACKS',{size:110,fill:P.white,sc:IN(t,.1)})}`;}
  return `${t26_hall(g,{dino:0})}${t26_meg(1500,560,.6,g,{fog:fog*.6,glow:.3,label:0})}<rect width="1920" height="1080" fill="#F4F8FF" opacity="${(fog*.25).toFixed(2)}"/>
   ${glint({x:560,y:600,s:.95,t:g,legs:'sit',mouth:hm?'o':'wavy',brows:'raised',look:1,blink:hm?0:BL(g),shiver:hm?0:.6})}${[0,1,2].map(i=>{const k=((g*1.5+i/3)%1);return `<path d="M${(660+k*60).toFixed(0)} ${(420-k*30).toFixed(0)} q20 20 0 40" stroke="#fff" stroke-width="6" fill="none" opacity="${((1-k)*(hm?0:.8)).toFixed(2)}"/>`;}).join('')}
   ${t26_maya({x:1080,y:640,s:.9,t:g,legs:'sit',mouth:'closed',brows:'sad',look:-1,blink:BL(g+.4)})}
   ${hm?t26_think(1080,260,['“GOLD GLASSES.','PLEASE BE OKAY.”'],{size:52,col:t26_PK,tag:'MAYA',sc:pop(t,p.hears??8.6),ty:150}):''}
   ${li?`<g transform="translate(1080,560)"><circle r="70" fill="none" stroke="${P.gold}" stroke-width="8" stroke-dasharray="14 10"/></g><g transform="translate(1080,858) scale(${pop(t,p.lips??11.6).toFixed(3)})">${labelPill(0,0,'HER LIPS DIDN’T MOVE',P.gold,50)}</g>`:''}`;
},
aniRules26(t,d,p,g){
  const ut=AT(t,p.ut??3.6),bu=AT(t,p.built??7.6),ea=AT(t,p.each??10.5),si=AT(t,p.sixteen??12),po=AT(t,p.pod??14.5);
  if(ea){const k=prog(t,p.sixteen??12,(p.sixteen??12)+4);return `${t21_card('cardMint',g)}${t26_scanner(760,520,1,g,{lit:1})}
     ${si?`<g transform="translate(1060,360)">${t26_hours(0,0,400,k,`${Math.round(16*k)} HOURS`,P.gold,48)}</g>`:''}
     ${po?`<g transform="translate(1440,560) scale(${pop(t,p.pod??14.5).toFixed(3)})">${labelPill(0,0,'PODCASTS',t26_PU,52)}</g>`:''}
     ${T(960,150,'TRAINING: ONE BRAIN AT A TIME',{size:76,fill:P.white,sc:pop(t,p.each??10.5)})}`;}
  return `${t21_card('cardDark',g)}${T(960,170,'THE RULES',{size:130,fill:P.gold,sc:IN(t,.1)})}
   ${!ut?`${glint({x:960,y:600,s:1.05,t:g,mouth:'smile',brows:'raised',pose:'hips',blink:BL(g)})}${T(960,330,'BASED ON REAL MACHINES',{size:64,fill:P.mint,sc:IN(t,1.2)})}`:''}
   ${ut?`<g transform="translate(960,330) scale(${pop(t,p.ut??3.6).toFixed(3)})">${labelPill(0,0,'2023 · UNIVERSITY OF TEXAS AT AUSTIN',P.gold,44)}</g>
     ${t26_scanner(560,640,.75,g,{lit:bu?1:.3})}${bu?`<path d="M820 640 H1060" stroke="${P.mint}" stroke-width="12"/><path d="M1050 615 L1090 640 L1050 665Z" fill="${P.mint}"/>
     <g transform="translate(1400,640) scale(${pop(t,p.built??7.6).toFixed(3)})"><rect x="-300" y="-110" width="600" height="220" rx="20" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><text y="-30" text-anchor="middle" font-size="40" font-weight="900" fill="${INK}">BRAIN SCAN</text><text y="40" text-anchor="middle" font-size="40" font-weight="900" fill="${P.red}">→ SENTENCES</text></g>`:''}`:''}`;
},
aniGist(t,d,p,g){
  const gi=AT(t,p.gist??1.5),he=AT(t,p.heard??3),wr=AT(t,p.wrote??6.5);
  const typ=wr?Math.floor(clamp((t-(p.wrote??6.5)-.6)/2.4)*44):0;const out='SHE HAS NOT EVEN STARTED TO LEARN TO DRIVE YET'.slice(0,typ);
  return `${t21_card('cardDark',g)}${T(960,150,gi?'GIST, NOT WORDS':'NOT EXACT WORDS',{size:110,fill:gi?P.gold:P.white,sc:pop(t,gi?p.gist??1.5:.1)})}
   ${he?`<g transform="translate(960,380) scale(${pop(t,p.heard??3).toFixed(3)})">${t21_bub(0,0,1200,'HEARD: “I DON’T HAVE MY','DRIVER’S LICENSE YET.”',{size:50,tail:'left'})}</g>`:''}
   ${wr?`<g transform="translate(960,720)"><rect x="-760" y="-110" width="1520" height="220" rx="24" fill="#071A14" stroke="${P.mint}" stroke-width="8"/><text x="-720" y="-50" font-size="30" font-weight="900" letter-spacing="4" fill="${P.mint}">DECODER WROTE:</text>
     <text x="0" y="40" text-anchor="middle" font-size="52" font-weight="900" fill="#fff" font-family="monospace">${out}${Math.sin(g*8)>0?'▍':''}</text></g>`:''}
   ${wr&&typ>=44?`<g transform="translate(960,858) scale(${pop(t,(p.wrote??6.5)+3.1).toFixed(3)})">${labelPill(0,0,'SAME MEANING · DIFFERENT WORDS',P.gold,44)}</g>`:''}`;
},
aniConsent(t,d,p,g){
  const co=AT(t,p.coop??2.6),cn=AT(t,p.count??4.5),fa=AT(t,p.fell??8.5);
  const nums=['100','93','86','79','72','65'];const nn=cn?Math.min(6,1+Math.floor((t-(p.count??4.5))*1.5)):0;
  const head=(x,ok,lab,c)=>`<g transform="translate(${x},560)">${t26_brainIcon(0,0,1.6,c,g)}<g transform="translate(0,250)">${labelPill(0,0,lab,c,40)}</g>${ok===1?icon('check',150,-150,.8):ok===0?icon('cross',150,-150,.8):''}</g>`;
  if(cn){const scr=fa?prog(t,p.fell??8.5,(p.fell??8.5)+1):0;return `${t21_card('cardWarm',g)}${head(560,-1,'COUNTING BY SEVENS',P.gold)}
     ${nums.slice(0,nn).map((n,i)=>T(330+i*95,300+(i%2)*70,n,{size:64,fill:P.gold,op:1})).join('')}
     <g transform="translate(1340,560)"><rect x="-340" y="-200" width="680" height="400" rx="24" fill="#071A14" stroke="${fa?P.red:P.mint}" stroke-width="8"/>
     ${[0,1,2,3].map(i=>`<rect x="${-300+((i*97+Math.floor(g*8)*31*scr)%120)}" y="${-130+i*80}" width="${560-((i*53+Math.floor(g*6)*17*scr)%260)}" height="34" rx="10" fill="${fa?P.red:P.mint}" opacity="${(.7-scr*.3).toFixed(2)}"/>`).join('')}</g>
     ${fa?T(1340,880,'THE STORY FALLS APART',{size:56,fill:P.red,sc:pop(t,p.fell??8.5)}):''}${T(960,150,'BLOCK IT: COUNT BACKWARDS',{size:84,fill:P.white,sc:pop(t,p.count??4.5)})}`;}
  return `${t21_card('cardDark',g)}${head(560,1,'TRAINED BRAIN',P.mint)}${head(1360,0,'SOMEONE ELSE',P.coral)}
   ${co?`<g transform="translate(960,880) scale(${pop(t,p.coop??2.6).toFixed(3)})">${labelPill(0,0,'ONLY IF THEY COOPERATE',P.gold,52)}</g>`:''}${T(960,150,'ONE PERSON ONLY',{size:110,fill:P.white,sc:IN(t,.1)})}`;
},
aniMEG(t,d,p,g){
  const th=AT(t,p.thou??3.6),pr=AT(t,p.priv??6.5),ag=AT(t,p.agree??9.5);
  const n=Math.floor(g*1000)%100000;let lines='';for(let i=0;i<6;i++){const k=((g*.7+i/6)%1);lines+=`<ellipse cx="960" cy="420" rx="${(180+k*500).toFixed(0)}" ry="${(120+k*300).toFixed(0)}" fill="none" stroke="${t26_PU}" stroke-width="6" opacity="${(1-k).toFixed(2)}"/>`;}
  if(pr){return `${t21_card('cardMint',g)}<g transform="translate(960,520)">${t26_brainIcon(0,0,2,P.mint,g)}<g transform="translate(150,90)"><rect x="-70" y="-40" width="140" height="110" rx="18" fill="${P.gold}" stroke="${INK}" stroke-width="8"/><path d="M-44 -40 V-80 A44 44 0 0 1 44 -80 V-40" stroke="${INK}" stroke-width="16" fill="none"/><circle cy="10" r="14" fill="${INK}"/></g></g>
     ${T(960,170,'MENTAL PRIVACY MATTERS',{size:96,fill:P.white,sc:pop(t,p.priv??6.5)})}${ag?`<g transform="translate(960,858) scale(${pop(t,p.agree??9.5).toFixed(3)})">${labelPill(0,0,'ONLY WITH PERMISSION',P.mint,56)}</g>`:''}`;}
  return `${t21_card('cardDark',g)}${lines}${t26_meg(960,640,.7,g,{glow:1,label:0})}<g transform="translate(960,150)">${labelPill(0,0,'MEG · META AND OTHERS',t26_PU,52)}</g>
   <g transform="translate(300,520)"><rect x="-200" y="-70" width="400" height="140" rx="18" fill="#14061A" stroke="${t26_PU}" stroke-width="6"/>${T(0,24,'MAGNETIC',{size:60,fill:t26_PU})}</g>
   ${th?`<g transform="translate(1620,520) scale(${pop(t,p.thou??3.6).toFixed(3)})"><rect x="-230" y="-100" width="460" height="200" rx="18" fill="#14061A" stroke="${P.gold}" stroke-width="6"/><text y="0" text-anchor="middle" font-size="64" font-weight="900" fill="${P.gold}" style="font-variant-numeric:tabular-nums">${String(n).padStart(5,'0')}</text><text y="60" text-anchor="middle" font-size="32" font-weight="900" fill="#fff">1,000s PER SECOND</text></g>`:''}`;
},
aniTrain(t,d,p,g){
  const li=AT(t,p.like??2.8),pe=AT(t,p.people??6.5),st=AT(t,p.strangers??10);
  const ppl=[[ 'NAN','19 YEARS',1,'nan'],['KAI','14 YEARS',.9,'kai'],['DR. OSEI','3 YEARS',.6,'osei'],['MAYA','1 YEAR OF FRIDAYS',.4,'maya']];
  return `${t21_card('cardWarm',g)}<g transform="translate(420,560)">${glint({t:g,s:1,mouth:'smile',brows:'raised',blink:BL(g),glint:1})}<g transform="translate(0,-60)">${t26_brainIcon(0,0,.6,t26_PK,g)}</g></g>
   ${T(960,150,'GLINT’S BRAIN IS THE DECODER',{size:80,fill:P.white,sc:IN(t,.2)})}${li&&!pe?`<g transform="translate(1180,520) scale(${pop(t,p.like??2.8).toFixed(3)})">${labelPill(0,0,'TRAINED BY LISTENING',P.gold,56)}</g>`:''}
   ${pe?ppl.map(([n,y,f,w],i)=>{const a=(p.people??6.5)+i*.5;if(!AT(t,a))return '';const yy=330+i*130;return `<g transform="translate(860,${yy}) scale(${pop(t,a).toFixed(3)})">${labelPill(80,0,n,w==='maya'?t26_PK:P.mint,40)}${t26_hours(220,0,380,f,y,P.gold,30)}</g>`;}).join(''):''}
   ${st?`<g transform="translate(1180,858) scale(${pop(t,p.strangers??10).toFixed(3)})"><rect x="-330" y="-60" width="660" height="120" rx="20" fill="#14061A" stroke="#8A7AA0" stroke-width="6"/>${T(0,22,'STRANGERS: “MMM… MMM…”',{size:48,fill:'#C9B8E0'})}</g>`:''}`;
},
aniPlusMaya(t,d,p,g){
  const wa=AT(t,p.watched??1.5),lo=AT(t,p.lot??5),ka=AT(t,p.kai??6.6),gc=AT(t,p.gl??8);
  const k=wa?prog(t,p.watched??1.5,(p.watched??1.5)+3.5):0;
  return `${t26_planet(g)}${t26_maya({x:1100,y:560,s:.85,t:g,pose:'mic',mouth:Math.sin(g*7)>0?'o':'smile',look:-1,blink:BL(g+.3)})}
   <g transform="translate(560,760)">${glint({t:g,s:.8,legs:'sit',mouth:'smile',brows:'raised',look:1,blink:BL(g)})}${t26_blush(0,0,.8,g,.8)}</g>
   ${wa?`<g transform="translate(380,330)"><rect x="-270" y="-100" width="540" height="200" rx="22" fill="#14061A" stroke="${P.gold}" stroke-width="7"/>${T(0,-20,`${Math.round(52*k)} FRIDAYS`,{size:70,fill:P.gold})}${T(0,56,'OF PLANETARIUM TALKS',{size:34,fill:P.white})}</g>`:''}
   ${ka?t21_bub(1500,860,520,'KAI: “TRAINING.”','',{size:44,sc:pop(t,p.kai??6.6)}):''}${gc?t21_bub(720,500,580,'GLINT: “ASTRONOMY.”','',{size:44,tail:'left',sc:pop(t,p.gl??8)}):''}
   ${t21_pm(t,'plus','MAYA')}`;
},
aniText(t,d,p,g){
  const sh=AT(t,p.short??2.2),re=AT(t,p.real??4.6),sq=AT(t,p.squash??7.2),wl=AT(t,p.left??8),fa=AT(t,p.fast??9.2);
  const phone=t21_phone(560,560,1.25,`${[['GOLD GLASSES',0],['HERE AGAIN',1],['GOOD ♥',2]].map(([s,i])=>sh&&AT(t,(p.short??2.2)+i*.5)?`<g transform="translate(0,${-110+i*90})"><rect x="-90" y="-30" width="180" height="58" rx="20" fill="${t26_PK}"/><text y="10" text-anchor="middle" font-size="26" font-weight="900" fill="${INK}">${s}</text></g>`:'').join('')}`);
  return `${t26_planet(g,{saturn:0})}${phone}${T(1260,150,'CRYSTAL CLEAR',{size:90,fill:t26_PK,sc:IN(t,.1)})}
   ${re?`<g transform="translate(1260,330) scale(${pop(t,p.real??4.6).toFixed(3)})">${labelPill(0,0,'REAL INNER SPEECH IS LIKE THIS',P.gold,40)}</g>`:''}
   ${sq?`<g transform="translate(1260,500) rotate(-3) scale(${pop(t,p.squash??7.2).toFixed(3)})">${labelPill(0,0,'SQUASHED',P.mint,64)}</g>`:''}
   ${wl?`<g transform="translate(1260,650) rotate(2) scale(${pop(t,p.left??8).toFixed(3)})">${labelPill(0,0,'WORDS LEFT OUT',P.mint,64)}</g>`:''}
   ${fa?`<g transform="translate(1260,820) rotate(-2) scale(${pop(t,p.fast??9.2).toFixed(3)})">${labelPill(0,0,'FASTER THAN TALKING',P.coral,60)}</g>`:''}`;
},
aniSaturn(t,d,p,g){
  const ar=AT(t,p.arrive??1.8),gt=AT(t,p.thinks??5),ms=AT(t,p.says??8),mu=AT(t,p.mutter??12.5);
  return `${t26_planet(g)}${t26_maya({x:1300,y:600,s:.85,t:g,pose:ms?'hips':'mic',mouth:ms?'smirk':'smile',look:-1,blink:BL(g+.3),blush:ar?.4:0})}
   ${glint({x:520,y:600,s:.9,t:g,mouth:ms?'o':gt?'flat':'smile',brows:ms?'raised':'calm',look:1,blink:ms?0:BL(g),sweat:ms?1:0})}${t26_blush(520,600,.9,g,ar?1:.3)}
   ${ar&&!gt?t26_think(1240,250,'“GOLD GLASSES. HERE AGAIN. GOOD.”',{size:46,col:t26_PK,tag:'MAYA',sc:pop(t,p.arrive??1.8),ty:150}):''}
   ${gt?t26_think(560,240,['“SAY SOMETHING CLEVER','ABOUT SATURN.”'],{size:44,col:P.gold,tag:'GLINT',sc:pop(t,p.thinks??5),ty:170,minw:500}):''}
   ${ms?t21_bub(1320,240,760,'“GO ON, THEN. SAY SOMETHING','CLEVER ABOUT SATURN.”',{size:40,tail:'right',sc:pop(t,p.says??8)}):''}
   ${mu?`<g transform="translate(560,858) scale(${pop(t,p.mutter??12.5).toFixed(3)})">${labelPill(0,0,'DID I SAY THAT OUT LOUD?',P.coral,44)}</g>`:''}`;
},
aniNan26(t,d,p,g){
  const ol=AT(t,p.out??3.4),ih=AT(t,p.inside??6.3);
  return `${t26_stall(g)}${person({x:960,y:440,s:.95,t:g,who:'nan',mouth:ih?'flat':'smile',brows:ih?'angry':'calm',blink:BL(g+1),pose:'hold'})}
   ${extra({x:1560,y:540,s:.9,t:g,head:'#E8B898',tie:true,mouth:'smile',pose:'hold'})}<g transform="translate(1610,640)">${t26_cake(0,0,.45,ih?1:0)}</g><path d="M1500 420 h120" stroke="${INK}" stroke-width="8"/><g transform="translate(1560,880)">${labelPill(0,0,'JUDGE',P.gold,34)}</g>
   ${glint({x:340,y:560,s:.85,t:g,mouth:ih?'grin':'smile',brows:'raised',look:1,blink:BL(g)})}
   ${ol?t21_bub(1330,230,520,'“LOVELY SPONGE, DEAR.”','',{size:40,tail:'left',sc:pop(t,p.out??3.4)}):''}
   ${ih?t26_think(600,200,'“THAT SPONGE IS A BRICK.”',{size:46,col:P.gold,tag:'NAN',sc:pop(t,p.inside??6.3),tx:120,ty:150}):''}
   ${t21_pm(t,'plus','NAN')}`;
},
aniBeep(t,d,p,g){
  const be=AT(t,p.beep??1.6),is=AT(t,p.is??4.6),so=AT(t,p.some??9),ns=AT(t,p.nan??11.6);
  const k=is?eout(prog(t,p.is??4.6,(p.is??4.6)+1.6)):0;const a=k*Math.PI*2*.26;
  const pie=`<g transform="translate(1320,560)"><circle r="240" fill="#2A1046" stroke="${INK}" stroke-width="9"/>${k>0?`<path d="M0 0 L0 -240 A240 240 0 ${a>Math.PI?1:0} 1 ${(Math.sin(a)*240).toFixed(1)} ${(-Math.cos(a)*240).toFixed(1)}Z" fill="${t26_PK}" stroke="${INK}" stroke-width="7"/>`:''}${k>.95?T(150,-60,'¼',{size:110,fill:'#fff'}):''}</g>`;
  if(ns){return `${t26_stall(g)}${person({x:960,y:440,s:.95,t:g,who:'nan',mouth:'smile',blink:BL(g+1),pose:'hold'})}
     ${[0,1,2,3,4].map(i=>{const k2=((g*.5+i/5)%1);return t26_think(960+Math.sin(i*2.3)*460,520-k2*380,['TOO MUCH SUGAR','NICE HAT','KETTLE ON?','THAT JUDGE…','WHERE’S GLINT?'][i],{size:34,col:P.gold,tag:'NAN',minw:220,op:Math.sin(k2*Math.PI).toFixed(2),ty:60});}).join('')}
     ${T(960,862,'NAN NEVER STOPS',{size:80,fill:P.gold,sc:pop(t,p.nan??11.6)})}`;}
  const on=be&&((g*1.5)%1)<.3;
  return `${t21_card('cardDark',g)}<g transform="translate(520,560)">${extra({t:g,head:'#F2C9A0',mouth:on?'laugh':'smile'})}<g transform="translate(80,60)"><rect x="-40" y="-30" width="80" height="60" rx="12" fill="#2A2A38" stroke="${INK}" stroke-width="6"/><circle r="12" fill="${on?P.red:'#555'}"/></g>${on?T(150,-170,'BEEP!',{size:60,fill:P.red}):''}</g>
   ${is?pie:''}${is?T(1320,880,'INNER SPEECH: ~1 IN 4 MOMENTS',{size:50,fill:t26_PK}):''}
   ${so?`<g transform="translate(1320,250) scale(${pop(t,p.some??9).toFixed(3)})">${labelPill(0,0,'SOME PEOPLE: NONSTOP',P.gold,44)}</g>`:''}${T(960,150,'REAL FINDING',{size:100,fill:P.white,sc:IN(t,.1)})}`;
},
aniKai26(t,d,p,g){
  const nw=AT(t,p.nowords??2.4),pi=AT(t,p.pics??3.3),hd=AT(t,p.hd??4.6),sk=AT(t,p.sk??5.8),bh=AT(t,p.big??7),re=AT(t,p.real??9);
  const big=bh?1.6:1;
  if(re){return `${t21_card('cardGold',g)}${T(960,150,'THAT’S REAL TOO',{size:110,fill:P.white,sc:pop(t,p.real??9)})}
     <g transform="translate(560,560)">${t26_brainIcon(0,0,1.8,P.gold,g)}</g><g transform="translate(1320,460)">${labelPill(0,0,'LITTLE OR NO INNER VOICE',P.gold,48)}</g>
     <g transform="translate(1320,640)">${labelPill(0,0,'THINKING IN IMAGES',P.mint,48)}</g>${person({x:1320,y:900,s:.4,t:g,who:'kai',mouth:'grin'})}`;}
  return `${t26_hall(g)}${person({x:420,y:600,s:.95,t:g,who:'kai',mouth:'grin',blink:BL(g+1),look:1})}
   <g transform="translate(1180,440)"><rect x="-520" y="-260" width="1040" height="520" rx="40" fill="#14061A" stroke="${P.gold}" stroke-width="10"/><text x="-480" y="-210" font-size="30" font-weight="900" letter-spacing="3" fill="${P.gold}">KAI'S HEAD</text>
   ${!pi?T(0,30,nw?'NO WORDS.':'…',{size:96,fill:'#8A7AA0',sc:nw?pop(t,p.nowords??2.4):1}):''}
   ${pi&&!hd?T(0,30,'JUST PICTURES',{size:90,fill:P.gold,sc:pop(t,p.pics??3.3)}):''}
   ${hd&&!sk?`<g transform="scale(${pop(t,p.hd??4.6).toFixed(3)})">${t26_hotdog(0,0,1.4)}</g>`:''}${sk&&!bh?`<g transform="scale(${pop(t,p.sk??5.8).toFixed(3)})">${t26_board(0,0,1.5)}</g>`:''}${bh?`<g transform="scale(${pop(t,p.big??7).toFixed(3)})">${t26_hotdog(0,0,2.6)}</g>`:''}</g>
   ${t21_pm(t,'plus','KAI')}`;
},
aniNoise26(t,d,p,g){
  const th=AT(t,p.three??1.5),sm=AT(t,p.strange??2.6),hp=AT(t,p.his??5.8),tr=AT(t,p.tries??7.4),si=AT(t,p.sign??8.8);
  return `${t26_hall(g)}${t26_crowd(g,{n:14,y:560,s:.5,op:.9,mumble:sm?1:0,seed:7})}
   ${hp?`${t26_think(330,300,'KETTLE!',{size:44,col:P.gold,tag:'NAN',minw:220,sc:pop(t,p.his??5.8)})}${t26_think(1600,300,'HOT DOG!',{size:44,col:P.gold,tag:'KAI',minw:240,sc:pop(t,(p.his??5.8)+.3)})}${t26_think(1000,250,'STARS!',{size:44,col:t26_PK,tag:'MAYA',minw:220,sc:pop(t,(p.his??5.8)+.6)})}`:''}
   ${glint({x:960,y:720,s:.8,t:g,mouth:tr?'flat':'o',brows:tr?'sad':'raised',blink:BL(g),shiver:hp&&!tr?.5:0,pose:tr?'up':'down'})}
   ${si?`<g transform="translate(1500,820) rotate(4) scale(${pop(t,p.sign??8.8).toFixed(3)})"><rect x="-240" y="-70" width="480" height="140" rx="12" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><text y="18" text-anchor="middle" font-size="50" font-weight="900" fill="${P.red}">DON’T READ THIS</text></g>`:''}
   ${th&&!hp?`<g transform="translate(960,280) scale(${pop(t,p.three??1.5).toFixed(3)})">${labelPill(0,0,'300 GUESTS',t26_PK,56)}</g>`:''}
   ${t21_pm(t,'minus','THE NOISE')}`;
},
aniCocktail(t,d,p,g){
  const ef=AT(t,p.effect??2.5),tu=AT(t,p.tune??4.6),br=AT(t,p.break??8.6),nm=AT(t,p.name??10.2),cl=AT(t,p.classic??12.5);
  let waves='';const N=7;for(let i=0;i<N;i++){const y=300+i*80,focus=tu&&i===3;const op=tu?(focus?1:.18):.6;let d='M300 '+y;for(let x=0;x<=1320;x+=20){d+=` L${300+x} ${(y+Math.sin(x*.03+g*(3+i)+i)*(focus?26:14)).toFixed(1)}`;}waves+=`<path d="${d}" stroke="${focus?t26_PK:['#7C5CFF','#3DF5C2','#FFC83D','#FF7AC8','#9AD1FF','#FF9F43','#B57CFF'][i]}" stroke-width="${focus?10:6}" fill="none" opacity="${op}"/>`;}
  const nameX=lerp(1700,980,prog(t,p.name??10.2,(p.name??10.2)+1.2));
  return `${t21_card('cardDark',g)}${waves}${tu?`<circle cx="960" cy="540" r="${(160+Math.sin(g*3)*8).toFixed(0)}" fill="none" stroke="${t26_PK}" stroke-width="8" stroke-dasharray="20 14"/>`:''}
   ${ef?T(960,150,'THE COCKTAIL PARTY EFFECT',{size:86,fill:P.white,sc:pop(t,p.effect??2.5)}):T(960,150,'A TRICK HIS BRAIN ALREADY KNOWS',{size:76,fill:t26_PK,sc:IN(t,.2)})}
   ${tu&&!br?`<g transform="translate(960,858) scale(${pop(t,p.tune??4.6).toFixed(3)})">${labelPill(0,0,'TUNE IN TO ONE VOICE',t26_PK,52)}</g>`:''}
   ${nm?T(nameX,560,'“GLINT!”',{size:120,fill:P.gold,sc:pop(t,p.name??10.2)}):br?T(960,560,'…BUT',{size:110,fill:P.gold,sc:pop(t,p.break??8.6)}):''}
   ${cl?`<g transform="translate(960,858) scale(${pop(t,p.classic??12.5).toFixed(3)})">${labelPill(0,0,'1 IN 3 HEARD THEIR NAME IN THE IGNORED VOICE',P.mint,38)}</g>`:''}`;
},
aniKaiThinks(t,d,p,g){
  const ah=AT(t,p.across??1.3),ik=AT(t,p.itskai??3.6),th=AT(t,p.thinking??5.4),hu=AT(t,p.hurts??11.4),bp=AT(t,p.best??13),ld=AT(t,p.laugh??17);
  return `${t26_hall(g)}${t26_crowd(g,{n:8,y:620,s:.4,op:.4,seed:12})}${person({x:1250,y:560,s:.9,t:g,who:'kai',mouth:'smile',blink:BL(g+1),look:-1})}${person({x:1620,y:580,s:.9,t:g,who:'nan',mouth:'smile',blink:BL(g+2),look:-1})}
   ${glint({x:380,y:600,s:.9,t:g,mouth:hu&&!bp?'frown':bp?'wavy':'o',brows:hu&&!bp?'sad':'raised',look:1,blink:BL(g)})}
   ${ah&&!th?T(1250,250,'“GLINT…”',{size:90,fill:P.gold,sc:pop(t,p.across??1.3)}):''}
   ${th&&!bp?t26_think(1100,260,['“HE’LL NEVER ASK HER.','HE NEVER GOES FOR ANYTHING.','STUCK ON NIGHT SHIFT FOREVER.”'],{size:40,col:P.coral,tag:'KAI',sc:pop(t,p.thinking??5.4),tx:150,ty:240,minw:600}):''}
   ${bp?t26_think(1100,270,['“BEST PERSON I KNOW.','WISH HE COULD SEE IT.”'],{size:48,col:P.gold,tag:'KAI',sc:pop(t,p.best??13),tx:150,ty:200,glow:1}):''}
   ${hu&&!bp?`<g transform="translate(380,250) scale(${pop(t,p.hurts??11.4).toFixed(3)})">${labelPill(0,0,'OUCH',P.coral,60)}</g>`:''}
   ${ld?`<g transform="translate(380,858) scale(${pop(t,p.laugh??17).toFixed(3)})">${labelPill(0,0,'LAUGH? CRY? BOTH.',t26_PK,44)}</g>`:''}
   ${t21_pm(t,'minus','WHAT KAI REALLY THINKS')}`;
},
aniOseiThinks(t,d,p,g){
  const tu=AT(t,p.tunes??1.8),sl=AT(t,p.slow??4),a1=AT(t,p.a1??6.6),a2=AT(t,p.a2??8.2),a3=AT(t,p.a3??9.4),fi=AT(t,p.fine??11.2),wb=AT(t,p.wont??13);
  const L=[];if(a1)L.push('AWAKE SINCE 4.');if(a2)L.push('AIRPORT AT 2.');if(a3)L.push('WINDOWS DOWN, RADIO LOUD.');if(fi)L.push('I’LL BE FINE.');
  const nod=Math.max(0,Math.sin(g*.9))*12;
  return `${t26_hall(g,{dino:0})}${t26_meg(1640,600,.5,g,{glow:.3,label:0})}${t26_osei({x:1120,y:560,s:1,t:g,mouth:Math.sin(g*1.2)>.7?'o':'flat',blink:Math.sin(g*1.7)>.6?1:0,rot:nod})}${t26_lids(1120,560,1,g,.65)}${t26_zzz(1220,330,g,.7)}
   <g transform="translate(1400,660)"><path d="M-30 -40 h60 l-8 80 h-44Z" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><path d="M30 -20 q24 0 24 20 q0 20 -24 20" stroke="${INK}" stroke-width="6" fill="none"/></g>
   ${glint({x:360,y:600,s:.85,t:g,mouth:wb?'frown':'flat',brows:wb?'sad':'calm',look:1,blink:BL(g)})}
   ${L.length?t26_think(800,260,L,{size:44,col:P.ice,tag:'DR. OSEI',hi:L.length-1,tx:260,ty:220,minw:560}):sl?T(960,180,'SLOW AND HEAVY',{size:90,fill:P.ice,sc:pop(t,p.slow??4)}):''}
   ${wb?T(960,862,'HE WON’T BE FINE',{size:84,fill:P.red,sc:pop(t,p.wont??13)}):''}
   ${t21_pm(t,'minus','DR. OSEI')}`;
},
aniClock26(t,d,p,g){
  const la=AT(t,p.lands??1.6),ai=AT(t,p.air??4);
  return `${t21_card('cardWarm',g)}${clockP(560,520,240,0,true).replace(/rotate\(200\)/,'rotate(352)').replace(/rotate\(40\)/,'rotate(270)')}${T(560,860,'11:45 PM',{size:90,fill:P.white})}
   ${la?`<g transform="translate(1340,380) scale(${pop(t,p.lands??1.6).toFixed(3)})"><g transform="rotate(-20)"><path d="M-120 0 L80 -10 Q120 0 80 10 Z" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/><path d="M-10 -6 L-60 -90 L-30 -90 L40 -6Z M-10 6 L-60 90 L-30 90 L40 6Z" fill="#FFF6EA" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/></g>${T(0,160,'AMA LANDS AT 2:00',{size:56,fill:P.gold})}</g>`:''}
   ${ai?`<g transform="translate(1340,760) scale(${pop(t,p.air??4).toFixed(3)})">${labelPill(0,0,'AIRPORT: 90 MINUTES AWAY',P.coral,46)}</g>`:''}${t26_timer(t26_left(g),g)}`;
},
aniSleep(t,d,p,g){
  const se=AT(t,p.sev??2.8),tw=AT(t,p.twenty??8.6),mi=AT(t,p.micro??10.4),mo=AT(t,p.motor??14.5),no=AT(t,p.notice??19),ca=AT(t,p.cold??23);
  if(ca){const ci=AT(t,p.helped??25.4);return `${t26_carpark(g,{museum:0})}${t26_car(960,780,1.3,{lights:1,g,driver:`<g transform="translate(-110,-70) scale(.42)">${t26_osei({t:g,mouth:'flat',blink:1})}</g>`})}
     ${[0,1,2].map(i=>{const k=((g*1.2+i/3)%1);return `<path d="M${(880-k*300).toFixed(0)} ${(640-i*24).toFixed(0)} h-90" stroke="#E6FAFF" stroke-width="8" stroke-linecap="round" opacity="${(1-k).toFixed(2)}"/>`;}).join('')}${[0,1].map(i=>`<text x="${(1100+i*60+Math.sin(g*4+i)*10).toFixed(0)}" y="${(560-((g*80+i*50)%120)).toFixed(0)}" font-size="56" fill="${P.gold}">♪</text>`).join('')}
     ${T(820,170,'COLD AIR + LOUD RADIO?',{size:76,fill:P.white,sc:pop(t,p.cold??23)})}${ci?`<g transform="translate(960,320) scale(${pop(t,p.helped??25.4).toFixed(3)})">${labelPill(0,0,'ONLY A LITTLE · NOT FOR LONG',P.coral,48)}</g>`:''}${t26_timer(t26_left(g),g)}`;}
  if(mi){const blank=((g*.5)%1)>.65;const kk=mo?prog(t,p.motor??14.5,(p.motor??14.5)+3):0;
    if(mo){return `<rect width="1920" height="1080" fill="#1A1030"/><rect y="620" width="1920" height="300" fill="#3A3650"/><path d="M0 770 H1920" stroke="#fff" stroke-width="10" stroke-dasharray="80 60" stroke-dashoffset="${(-g*600%140).toFixed(0)}"/>
      <rect x="260" y="600" width="1400" height="340" fill="#3DAA5A" opacity=".25" stroke="#7CF5A0" stroke-width="6" stroke-dasharray="20 14"/>${t26_car(lerp(300,1620,kk),760,.55,{lights:1})}
      ${T(960,180,'3 SECONDS AT MOTORWAY SPEED',{size:76,fill:P.white,sc:pop(t,p.motor??14.5)})}${T(960,862,'≈ A FOOTBALL PITCH',{size:70,fill:P.mint,sc:pop(t,(p.motor??14.5)+1.2)})}
      ${no?`<g transform="translate(960,320) scale(${pop(t,p.notice??19).toFixed(3)})">${labelPill(0,0,'OFTEN YOU DON’T EVEN NOTICE',P.coral,48)}</g>`:''}`;}
    return `${t21_card('cardDark',g)}<g transform="translate(960,560)">${t26_osei({t:g,mouth:'flat',blink:blank?1:0,rot:blank?14:0})}</g>${blank?T(1300,380,'…',{size:120,fill:P.ice}):''}
     ${T(960,150,'MICROSLEEPS',{size:120,fill:P.ice,sc:pop(t,p.micro??10.4)})}<g transform="translate(960,858)">${labelPill(0,0,'TINY NAPS · A FEW SECONDS',P.ice,48)}</g>${t26_timer(t26_left(g),g)}`;}
  const lvl=tw?.95:se?.6:.2;
  return `${t21_card('cardWarm',g)}${T(960,150,'GLINT KNOWS THE SCIENCE',{size:90,fill:P.white,sc:IN(t,.2)})}
   <g transform="translate(560,600)"><path d="M-300 0 A300 300 0 0 1 300 0" fill="none" stroke="#2A1046" stroke-width="60"/><path d="M-300 0 A300 300 0 0 1 300 0" fill="none" stroke="url(#t26g)" stroke-width="44"/>
   <defs><linearGradient id="t26g"><stop offset="0" stop-color="${P.mint}"/><stop offset=".5" stroke-color="${P.gold}" stop-color="${P.gold}"/><stop offset="1" stop-color="${P.red}"/></linearGradient></defs>
   <g transform="rotate(${(-90+180*lvl).toFixed(1)})"><path d="M0 0 V-250" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M0 0 V-250" stroke="#fff" stroke-width="8" stroke-linecap="round"/></g><circle r="30" fill="${INK}"/>${T(0,110,'IMPAIRMENT',{size:48,fill:P.white})}</g>
   ${se?`<g transform="translate(1360,420) scale(${pop(t,p.sev??2.8).toFixed(3)})">${labelPill(0,0,'17 HOURS AWAKE',P.gold,52)}</g><g transform="translate(1360,560) scale(${pop(t,(p.sev??2.8)+2.5).toFixed(3)})">${labelPill(0,0,'≈ TOO MUCH TO DRINK',P.coral,48)}</g>`:''}
   ${tw?`<g transform="translate(1360,720) scale(${pop(t,p.twenty??8.6).toFixed(3)})">${labelPill(0,0,'20 HOURS: WORSE',P.red,56)}</g>`:''}${t26_timer(t26_left(g),g)}`;
},
aniTell(t,d,p,g){
  const la=AT(t,p.laughs??1.8),gk=AT(t,p.grabs??5.2),ks=AT(t,p.stares??8.4),kt=AT(t,p.kthinks??9.2),na=AT(t,p.nan??11.4),wh=AT(t,p.what??14.6);
  if(gk){return `${t26_hall(g)}${person({x:1100,y:560,s:.95,t:g,who:'kai',mouth:ks?'o':'smile',brows:'raised',blink:ks?0:BL(g+1),look:-1})}${glint({x:640,y:560,s:.92,t:g,mouth:'o',brows:'raised',pose:'reach',blink:BL(g),sweat:1})}
     ${t21_bub(560,190,640,'“HE CAN’T DRIVE.','I HEARD HIM THINK IT.”',{size:42,tail:'left'})}
     ${kt&&!na?t26_think(1240,300,'“HAS HE HIT HIS HEAD?”',{size:46,col:P.gold,tag:'KAI',sc:pop(t,p.kthinks??9.2),ty:160}):''}
     ${na?`<g transform="translate(1300,250) scale(${pop(t,p.nan??11.4).toFixed(3)})">${labelPill(0,0,'NAN: BUSY · MAYA: ON STAGE',P.gold,34)}</g>`:''}
     ${wh?T(820,862,'“I CAN HEAR THOUGHTS NOW”?',{size:70,fill:P.coral,sc:pop(t,p.what??14.6)}):''}${t26_timer(t26_left(g),g)}`;}
  return `${t26_hall(g)}${t26_osei({x:1200,y:560,s:.95,t:g,mouth:la?'laugh':'flat',blink:BL(g+2),pose:la?'shrug':'down'})}${t26_lids(1200,560,.95,g,.55)}
   ${[0,1,2].map(i=>`<g transform="translate(${1440+i*80},800)"><path d="M-26 -36 h52 l-8 72 h-36Z" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><path d="M-20 -14 h40" stroke="#7A4A2A" stroke-width="8"/></g>`).join('')}
   ${glint({x:560,y:560,s:.92,t:g,mouth:'flat',brows:'sad',look:1,blink:BL(g)})}${t21_bub(560,200,560,'“YOU LOOK REALLY TIRED.”','',{size:40,tail:'left'})}
   ${la?t21_bub(1300,250,600,'“THREE COFFEES, GLINT.','I’M FINE.”',{size:42,tail:'right',sc:pop(t,p.laughs??1.8)}):''}${t26_timer(t26_left(g),g)}`;
},
aniKeys(t,d,p,g){
  const fk=AT(t,p.finds??1.4),br=AT(t,p.breaking??3.4),k1=AT(t,p.k1??5.4),tw=AT(t,p.two??8.6),di=AT(t,p.dips??11.2),dn=AT(t,p.didnt??13.6);
  const blank=tw&&!di;const dip=di?Math.max(0,1-(t-(p.dips??11.2))*1.2)*24:0;
  const words=['KEYS.','COAT.','AMA.','MOTORWAY.'];const nw=k1?Math.min(4,1+Math.floor((t-(p.k1??5.4))*1.4)):0;
  return `${t26_hall(g,{dino:0})}${t26_osei({x:1100,y:560,s:1,t:g,mouth:'flat',blink:blank||di&&dip>8?1:0,rot:blank?18:dip,pose:fk?'hold':'down'})}${t26_lids(1100,560,1,g,.6)}
   ${fk?`<g transform="translate(1180,650) rotate(${(Math.sin(g*3)*10).toFixed(1)})"><circle r="18" fill="none" stroke="${P.gold}" stroke-width="7"/><path d="M14 8 l40 22 M44 24 l-8 12 M30 16 l-6 10" stroke="${P.gold}" stroke-width="7"/></g>`:''}
   ${glint({x:420,y:600,s:.85,t:g,mouth:tw?'o':'flat',brows:'raised',look:1,blink:tw?0:BL(g),sweat:1})}
   ${k1&&!tw?t26_think(1100,230,words.slice(0,nw).join(' '),{size:52,col:P.ice,tag:'DR. OSEI',minw:640,ty:170}):''}
   ${blank?t26_think(1100,230,' ',{size:52,col:'#6A6488',tag:'DR. OSEI',minw:640,ty:170})+T(1100,250,'…NOTHING',{size:60,fill:'#8A84A8'}):''}
   ${br&&!k1?T(1000,180,'HIS THOUGHTS ARE BREAKING UP',{size:76,fill:P.ice,sc:pop(t,p.breaking??3.4)}):''}
   ${tw?`<g transform="translate(1520,460) scale(${pop(t,p.two??8.6).toFixed(3)})"><rect x="-150" y="-70" width="300" height="140" rx="18" fill="#14061A" stroke="${P.red}" stroke-width="7"/>${T(0,24,'2 SEC',{size:72,fill:P.red})}</g>`:''}
   ${dn?T(1100,862,'HE DIDN’T EVEN NOTICE',{size:80,fill:P.red,sc:pop(t,p.didnt??13.6)}):''}${t26_timer(t26_left(g),g)}`;
},
aniCarpark26(t,d,p,g){
  const wo=AT(t,p.walks??1.2),ru=AT(t,p.runs??3.6),fv=AT(t,p.five??5.6);const ox=wo?lerp(900,1300,prog(t,p.walks??1.2,(p.walks??1.2)+5)):900;const gx=ru?lerp(120,820,prog(t,p.runs??3.6,(p.runs??3.6)+3)):-200;
  return `${t26_carpark(g)}${t26_car(1520,830,1,{g})}${t26_osei({x:ox,y:560,s:.9,t:g*1.4,legs:'walk',mouth:'flat',blink:Math.sin(g*1.3)>.6?1:0})}${t26_lids(ox,560,.9,g*1.4,.6)}
   ${glint({x:gx,y:580,s:.9,t:g*1.8,legs:'walk',pose:'reach',mouth:'o',brows:'raised',blink:0,sweat:1})}
   ${T(960,170,ru?'GLINT RUNS':'INTO THE CAR PARK',{size:96,fill:P.white,sc:pop(t,ru?p.runs??3.6:.1)})}
   <g transform="translate(1660,120) scale(${(1+(fv?.5*Math.max(0,1-(t-(p.five??5.6))*1.5):0)).toFixed(3)})">${t26_timer(t26_left(g),g,{x:0,y:0})}</g>`;
},
aniDeal(t,d,p,g){
  const ru=AT(t,p.rules??1.2),cu=AT(t,p.catch??3.4),yt=AT(t,p.told??5.2),so=AT(t,p.sotry??9.4),it=AT(t,p.iftell??13.2),sm=AT(t,p.smiles??18.4),rs=AT(t,p.resist??20.4);
  if(!cu) return `${t21_card('cardMint',g)}${glint({x:960,y:600,s:1.1,t:g,mouth:'o',brows:'raised',glint:1,blink:0})}${icon('bulb',960,260,pop(t,.3))}${T(960,862,'DR. OSEI’S OWN RULES',{size:84,fill:P.gold,sc:pop(t,p.rules??1.2)})}`;
  return `${t26_carpark(g)}${t26_car(1500,830,1,{g})}${t26_osei({x:1200,y:560,s:.95,t:g,mouth:sm?'smile':'flat',brows:sm?'raised':'calm',blink:BL(g+2)})}${t26_lids(1200,560,.95,g,sm?.3:.6)}
   ${glint({x:560,y:580,s:.92,t:g,mouth:'grin',brows:'raised',pose:it?'point':'down',blink:BL(g),look:1})}
   ${yt&&!so?t21_bub(560,200,700,'“YOU TOLD US HOW PEOPLE','BEAT THE DECODER.”',{size:40,tail:'left',sc:pop(t,p.told??5.2)}):''}
   ${so&&!it?t21_bub(560,200,720,'“COUNT BACKWARDS BY SEVENS.','START AT ONE HUNDRED.”',{size:40,tail:'left',sc:pop(t,p.sotry??9.4)}):''}
   ${it?`<g transform="translate(700,230) scale(${pop(t,p.iftell??13.2).toFixed(3)})"><rect x="-430" y="-110" width="860" height="220" rx="24" fill="#14061A" stroke="${P.gold}" stroke-width="8"/>${T(0,-20,'I SAY WHAT YOU COUNTED',{size:52,fill:P.white})}${T(0,60,'→ YOU GIVE ME YOUR KEYS',{size:52,fill:P.gold})}</g>`:''}
   ${rs?`<g transform="translate(1200,858) scale(${pop(t,p.resist??20.4).toFixed(3)})">${labelPill(0,0,'A SCIENTIST CAN’T RESIST A TEST',P.mint,40)}</g>`:''}${t26_timer(t26_left(g),g)}`;
},
aniClever(t,d,p,g){
  const re=AT(t,p.real??1.6),gi=AT(t,p.gave??4.4),dw=AT(t,p.dont??9.4),wn=AT(t,p.wants??11.4);
  return `${t21_card('cardGold',g)}${T(960,150,'THE CLEVER PART',{size:120,fill:P.gold,sc:IN(t,.1)})}
   ${re?`<g transform="translate(520,560) scale(${pop(t,p.real??1.6).toFixed(3)})">${t26_brainIcon(0,0,1.5,P.gold,g)}${gi?['93','86','79'].map((n,i)=>T(-140+i*140,-160,n,{size:56,fill:P.gold})).join(''):''}<g transform="translate(0,260)">${labelPill(0,0,'COUNTING ≠ SILENCE',P.gold,44)}</g></g>`:''}
   ${gi?`<g transform="translate(1360,460) scale(${pop(t,p.gave??4.4).toFixed(3)})"><rect x="-320" y="-100" width="640" height="200" rx="20" fill="#071A14" stroke="${P.red}" stroke-width="8"/>${T(0,-14,'DECODER:',{size:44,fill:P.mint})}${T(0,56,'STORY LOST',{size:64,fill:P.red})}</g>`:''}
   ${dw?`<g transform="translate(1360,740) scale(${pop(t,p.dont??9.4).toFixed(3)})"><rect x="-320" y="-100" width="640" height="200" rx="20" fill="#14061A" stroke="${P.mint}" stroke-width="8"/>${T(0,-14,'GLINT:',{size:44,fill:t26_PK})}${T(0,56,wn?'WANTS THE NUMBERS':'NOT THE STORY',{size:58,fill:wn?P.mint:P.white})}</g>`:''}`;
},
aniSevens(t,d,p,g){
  const ce=AT(t,p.closes??0),li=AT(t,p.listens??1.6),sb=AT(t,p.saysback??14);
  const seq=[[p.n100??2.6,'100',0],[p.n93??3.6,'93',0],[p.n86??4.8,'86',0],[p.n80??6.2,'80',1],[p.no??7,'NO.',2],[p.n79??7.8,'79',0],[p.n73??9.4,'73?',3]];
  const shown=seq.filter(s=>AT(t,s[0]));
  const chips=shown.map(([a,s,k],i)=>{const x=-500+i*168,col=k===1?P.red:k===3?P.gold:k===2?'#C9B8E0':'#fff';return `<g transform="translate(${x},0) scale(${pop(t,a).toFixed(3)})">${T(0,20,s,{size:k===2?54:76,fill:col})}${k===1&&sb?`<path d="M-60 -50 L60 40 M60 -50 L-60 40" stroke="${P.red}" stroke-width="10" stroke-linecap="round"/>`:''}${sb&&k===3?`<circle r="66" fill="none" stroke="${P.gold}" stroke-width="7"/>`:''}</g>`;}).join('');
  return `${t26_carpark(g,{museum:0})}${t26_osei({x:1440,y:600,s:.95,t:g,mouth:'flat',blink:ce?1:0,brows:'calm'})}
   ${glint({x:420,y:620,s:.9,t:g,mouth:sb?'grin':'flat',brows:'raised',look:1,blink:li?0:BL(g),pose:sb?'point':'down'})}
   <g transform="translate(940,300)"><rect x="-620" y="-110" width="1240" height="220" rx="60" fill="#1A0A26" stroke="${P.ice}" stroke-width="10"/><g transform="translate(-590,-130)"><rect y="-22" width="200" height="44" rx="16" fill="${P.ice}" stroke="${INK}" stroke-width="5"/><text x="20" y="9" font-size="26" font-weight="900" letter-spacing="2" fill="${INK}">DR. OSEI</text></g>${chips}</g>
   ${[.35,.62,.86].map((k,i)=>`<circle cx="${(940+500*k).toFixed(0)}" cy="${(410+k*90).toFixed(0)}" r="${16-i*4}" fill="#1A0A26" stroke="${P.ice}" stroke-width="5"/>`).join('')}
   ${sb?T(960,862,'EVERY NUMBER. EVERY MISTAKE.',{size:66,fill:P.gold,sc:pop(t,p.saysback??14)}):li?T(960,862,'GLINT LISTENS',{size:80,fill:P.white,sc:pop(t,p.listens??1.6)}):''}`;
},
aniProof(t,d,p,g){
  const st=AT(t,p.still??0),pi=AT(t,p.imp??1.6),pw=AT(t,p.worse??3.6),ma=AT(t,p.maths??6),ha=AT(t,p.hands??9.6);
  const kx=ha?lerp(1300,700,eout(prog(t,p.hands??9.6,(p.hands??9.6)+1.2))):1300;
  return `${t26_carpark(g)}${t26_car(1600,840,.9,{g})}${t26_osei({x:1300,y:560,s:.95,t:g,mouth:pi?'o':'flat',brows:'raised',blink:0,pose:ha?'point':'down'})}
   ${glint({x:600,y:580,s:.92,t:g,mouth:ha?'smile':'flat',brows:'raised',look:1,blink:BL(g),pose:ha?'reach':'down'})}
   ${ha?`<g transform="translate(${kx.toFixed(0)},500) rotate(${(Math.sin(g*4)*12).toFixed(1)})"><circle r="26" fill="none" stroke="${P.gold}" stroke-width="10"/><path d="M20 12 l56 30 M60 34 l-10 16 M42 24 l-8 14" stroke="${P.gold}" stroke-width="10"/></g>`:''}
   ${pi?`<g transform="translate(960,190) scale(${pop(t,p.imp??1.6).toFixed(3)})">${labelPill(0,0,'PROOF 1: MIND READING IS REAL',t26_PK,44)}</g>`:''}
   ${pw?`<g transform="translate(960,320) scale(${pop(t,p.worse??3.6).toFixed(3)})">${labelPill(0,0,'PROOF 2: HIS BRAIN IS TOO TIRED',P.red,44)}</g>`:''}
   ${ma&&!ha?T(960,862,'86 − 7 = 79, NOT 80',{size:72,fill:P.gold,sc:pop(t,p.maths??6)}):''}
   ${ha?T(960,862,'HE HANDS OVER THE KEYS',{size:80,fill:P.mint,sc:pop(t,p.hands??9.6)}):''}${t26_timer(t26_left(g),g,{safe:ha?1:0})}`;
},
aniTaxi(t,d,p,g){
  const sl=AT(t,p.sleeps??2.6),hp=AT(t,p.half??4.6),am=AT(t,p.ama??7.2);
  const zz=`<g transform="translate(-60,-70) scale(.42)">${t26_osei({t:g,mouth:'o',blink:1,rot:20})}</g>`;
  if(hp){return `${t26_hall(g,{lights:1})}${glint({x:560,y:600,s:.9,t:g,mouth:am?'smile':'o',brows:'raised',blink:BL(g),look:1})}
     ${t21_phone(1220,520,1.3,`<text y="-120" text-anchor="middle" font-size="22" font-weight="900" fill="#9AA7BD">2:30 AM</text><g transform="translate(0,-30)"><rect x="-90" y="-50" width="180" height="${am?150:60}" rx="18" fill="${P.ice}"/><text y="-12" text-anchor="middle" font-size="22" font-weight="900" fill="${INK}">DR. OSEI</text>${am?`<text y="24" text-anchor="middle" font-size="20" font-weight="800" fill="${INK}">AMA IS SAFE.</text><text y="52" text-anchor="middle" font-size="20" font-weight="800" fill="${INK}">THANK YOU.</text><text y="80" text-anchor="middle" font-size="20" font-weight="800" fill="${P.red}">WE NEED TO TALK.</text>`:''}</g>`, Math.sin(g*20)*(am?0:3))}
     ${T(960,150,am?'“WE NEED TO TALK.”':'BZZZT',{size:96,fill:am?P.gold:P.white,sc:pop(t,am?p.ama??7.2:p.half??4.6)})}`;}
  return `<rect width="1920" height="1080" fill="#0E0A24"/>${t26_carpark(g,{museum:0}).replace(/<rect y="640"[\s\S]*$/,'')}<rect y="700" width="1920" height="380" fill="#3A3650"/><path d="M0 860 H1920" stroke="#fff" stroke-width="10" stroke-dasharray="80 60" stroke-dashoffset="${(-g*700%140).toFixed(0)}"/>
   ${t26_car(960,830,1.2,{taxi:1,lights:1,g,driver:zz})}${sl?t26_zzz(960,600,g,1):''}
   ${T(960,170,sl?'HE SLEEPS THE WHOLE WAY':'A TAXI TO THE AIRPORT',{size:90,fill:sl?P.ice:P.gold,sc:pop(t,sl?p.sleeps??2.6:.1)})}`;
},
aniPlanet26(t,d,p,g){
  const em=AT(t,p.empty??1.6),si=AT(t,p.sits??4.6),th=AT(t,p.thinks??6.4),no=AT(t,p.no??11.6),ms=AT(t,p.says??14.8),ta=AT(t,p.taps??18.6);
  const gx=si?760:420;
  return `${t26_planet(g)}${!em?`<g transform="translate(960,300)">${T(0,0,'1:00 AM',{size:110,fill:P.white,sc:IN(t,.1)})}</g>`:''}
   ${t26_maya({x:1180,y:620,s:.9,t:g,legs:'sit',mouth:ms?'smirk':'smile',look:ms?0:-1,pose:ta?'tap':'down',blink:BL(g+.4),blush:ms?.5:0})}
   ${glint({x:gx,y:620,s:.9,t:g,legs:si?'sit':'walk',mouth:ms?'o':th?'wavy':'smile',brows:ms?'raised':'calm',look:1,blink:ms?0:BL(g),sweat:ms?1:0})}${t26_blush(gx,620,.9,g,th?1:.4)}
   ${th&&!ms?t26_think(640,250,no?['“NO. THAT’S TERRIBLE.”']:['“TELL HER SHE’S BRIGHTER','THAN EVERY STAR IN HERE.”'],{size:44,col:P.gold,tag:'GLINT',sc:pop(t,no?p.no??11.6:p.thinks??6.4),tx:100,ty:200,minw:620}):''}
   ${ms?t21_bub(1240,280,560,'“IT’S NOT TERRIBLE.”','',{size:46,tail:'right',sc:pop(t,p.says??14.8)}):''}
   ${ta?`<g transform="translate(1180,520)"><circle r="${(40+((g*2)%1)*80).toFixed(0)}" fill="none" stroke="${t26_PK}" stroke-width="6" opacity="${(1-((g*2)%1)).toFixed(2)}"/></g>`:''}`;
},
aniReveal(t,d,p,g){
  const fy=AT(t,p.year??2.2),hh=AT(t,p.hours??6.6),he=AT(t,p.heard??9.4),sa=AT(t,p.saturn??13),co=AT(t,p.colour??17.4),bw=AT(t,p.btw??20.6),yt=AT(t,p.turn??24.4);
  if(bw){return `${t26_planet(g,{saturn:0})}<g transform="translate(960,560)"><rect x="-420" y="40" width="840" height="200" rx="90" fill="#FFF6EA" stroke="${INK}" stroke-width="10"/><rect x="-400" y="60" width="800" height="90" rx="40" fill="#7FC8F0"/>
     ${[0,1,2].map(i=>`<circle cx="${-300+i*260}" cy="${(70+Math.sin(g*2+i)*6).toFixed(0)}" r="22" fill="#fff" opacity=".7"/>`).join('')}
     <g transform="translate(0,${(-20+Math.sin(g*1.6)*12).toFixed(0)}) rotate(-14)"><ellipse rx="300" ry="64" fill="none" stroke="#E8C98A" stroke-width="22"/><circle r="150" fill="#F0C987" stroke="${INK}" stroke-width="8"/><path d="M-146 -30 Q0 -14 146 -30 M-136 40 Q0 56 136 40" stroke="#C99A5A" stroke-width="14" fill="none"/><path d="M-300 0 A300 64 0 0 0 300 0" fill="none" stroke="#E8C98A" stroke-width="22"/></g></g>
     ${T(960,170,'SATURN WOULD FLOAT IN A BATH',{size:84,fill:P.gold,sc:pop(t,p.btw??20.6)})}${yt?T(960,862,'“YOUR TURN.”',{size:100,fill:t26_PK,sc:pop(t,p.turn??24.4)}):''}`;}
  if(he){const L=[[p.saturn??13,'THE SATURN ONE'],[(p.saturn??13)+1.2,'THE DINOSAUR ONE'],[(p.saturn??13)+2.4,'THE ELEVEN WORDS']];
    return `${t26_planet(g)}${t26_maya({x:1300,y:620,s:.95,t:g,legs:'sit',mouth:'smirk',look:-1,blink:BL(g+.4),blush:.6})}
     <g transform="translate(560,600)">${glint({t:g,s:1.05,legs:'sit',mouth:co?'o':'wavy',brows:'raised',look:1,blink:0,sweat:1,tint:co?'#FFB3C6':null})}${t26_blush(0,0,1.05,g,1)}</g>
     ${T(960,150,'SHE HEARD EVERYTHING',{size:100,fill:t26_PK,sc:pop(t,p.heard??9.4)})}
     ${sa?L.map(([a,s],i)=>AT(t,a)?`<g transform="translate(1300,${260+i*90}) rotate(${i%2?2:-2}) scale(${pop(t,a).toFixed(3)})">${labelPill(0,0,s,P.gold,40)}</g>`:'').join(''):''}
     ${co?T(560,862,'FIRE-ENGINE RED',{size:76,fill:P.red,sc:pop(t,p.colour??17.4)}):''}`;}
  const k=hh?prog(t,p.hours??6.6,(p.hours??6.6)+2.5):0;
  return `${t26_hall(g)}<rect width="1920" height="1080" fill="#F4F8FF" opacity="${(fy?0:.2*Math.abs(Math.sin(g*2))).toFixed(2)}"/>
   ${fy?`${t26_dino(1100,700,.9,1)}${glint({x:1000,y:560,s:.85,t:g,mouth:Math.sin(g*6)>0?'o':'grin',pose:'point',brows:'raised',blink:BL(g),dir:-1})}${t26_crowd(g,{n:4,y:640,s:.5,op:.6,x0:200,x1:700,seed:4})}${t26_maya({x:340,y:600,s:.8,t:g,mouth:'smile',blush:.6,look:1,blink:BL(g+.5)})}
     <g transform="translate(340,240)">${labelPill(0,0,'EVERY FRIDAY · DINOSAUR TALKS',t26_PK,36)}</g>`:`${t26_meg(960,560,.8,g,{fog:1,crack:1,glow:1})}`}
   ${!fy?T(960,170,'THE HELIUM HIT HER TOO',{size:96,fill:P.ice,sc:IN(t,.1)}):''}
   ${hh?`<g transform="translate(960,858)">${t26_hours(-300,0,600,k,'HOURS OF TRAINING',t26_PK,40)}</g>`:''}`;
},
aniAsk26(t,d,p,g){
  const q=AT(t,p.q??2.4),br=AT(t,p.brave??4.6);
  return `${t26_planet(g)}${t26_maya({x:1300,y:620,s:.85,t:g,legs:'sit',mouth:'smile',look:-1,blink:BL(g+.4),blush:.5})}<g transform="translate(620,600)">${glint({t:g,s:.95,legs:'sit',mouth:'grin',brows:'raised',look:1,blink:BL(g)})}${t26_blush(0,0,.95,g,.8)}</g>
   ${t26_think(620,230,'♥ ?',{size:60,col:P.gold,tag:'GLINT',minw:220,ty:150})}${t26_think(1300,230,'♥ !',{size:60,col:t26_PK,tag:'MAYA',minw:220,ty:150})}
   ${q?T(960,862,br?'WOULD YOU LET THEM READ YOURS?':'WOULD YOU WANT TO KNOW?',{size:76,fill:br?t26_PK:P.mint,sc:pop(t,br?p.brave??4.6:p.q??2.4)}):''}`;
}
});
