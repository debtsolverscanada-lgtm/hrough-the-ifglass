// episode 016 scenes: What If You Turned INVISIBLE? (story episode)
const i16_DEFS=`<defs>
 <linearGradient id="i16beamG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF6D6" stop-opacity=".8"/><stop offset="1" stop-color="#FFF6D6" stop-opacity="0"/></linearGradient>
 <radialGradient id="i16hot" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF7A0"/><stop offset=".45" stop-color="#FFB03B"/><stop offset=".8" stop-color="#FF4D5E"/><stop offset="1" stop-color="#7C2A8A"/></radialGradient>
 <radialGradient id="i16glass" cx=".4" cy=".4" r=".7"><stop offset="0" stop-color="#E6FAFF" stop-opacity=".6"/><stop offset="1" stop-color="#6FD3F7" stop-opacity=".22"/></radialGradient>
 <linearGradient id="i16sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A3A8A"/><stop offset=".6" stop-color="#FF7A9A"/><stop offset="1" stop-color="#FFC36B"/></linearGradient>
 <linearGradient id="i16day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6EC1F5"/><stop offset="1" stop-color="#CDEBFF"/></linearGradient>
 <radialGradient id="i16spot"><stop offset="0" stop-color="#C9DCFF" stop-opacity=".45"/><stop offset="1" stop-color="#C9DCFF" stop-opacity="0"/></radialGradient>
 <radialGradient id="i16warm"><stop offset="0" stop-color="#FFD9A0" stop-opacity=".5"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/></radialGradient>
</defs>`;
const i16_GH='#BFEFFF';
const i16_ARMS={down:['M0 40 Q-48 80 -62 150','M0 40 Q48 80 62 150'],point:['M0 40 Q-48 80 -62 150','M0 40 L80 40 L160 20'],
  shrug:['M0 40 Q-70 70 -110 10','M0 40 Q70 70 110 10'],reach:['M0 40 Q-60 30 -130 0','M0 40 Q60 30 130 0'],
  hold:['M0 40 Q-40 95 30 92','M0 40 Q40 95 70 70'],nose:['M0 40 Q-48 80 -62 150','M0 40 Q80 40 14 -24'],
  hips:['M0 40 Q-70 80 -12 118','M0 40 Q70 80 12 118']};
// invisible Glint: faint dashed shimmer outline + two dark eye dots (red = red-eye flare 0..1)
function i16_ghost(o){
  const {x=0,y=0,s=1,t=0,pose='down',legs='stand',op=.4,red=0,look=0,shake=0,dir=1,dots=1,rot=0,halo=1}=o;
  const by=Math.sin(t*2.4)*5, jx=shake?Math.sin(t*60)*5*shake:0;
  let A=i16_ARMS[pose];
  if(pose==='up') A=[`M0 40 Q-70 10 -100 ${-70+Math.sin(t*9)*22}`,`M0 40 Q70 10 100 ${-70+Math.sin(t*9+1)*22}`];
  const lg=legs==='walk'?Math.sin(t*8)*20:0;
  const L=legs==='sit'?['M0 170 L-70 170 L-70 290','M0 170 L60 175 L60 290']:legs==='kneel'?['M0 170 L-60 230 L-130 290','M0 170 L50 240 L40 300']:[`M0 170 Q-20 230 ${-40+lg} 300`,`M0 170 Q20 230 ${40-lg} 300`];
  const off=(t*40)%26, sh=.75+.25*Math.sin(t*4);
  const ln=d=>`<path d="${d}" stroke="${i16_GH}" stroke-width="6" fill="none" stroke-dasharray="16 10" stroke-dashoffset="${off}" stroke-linecap="round"/>`;
  let sp=''; const r=rng(5); for(let i=0;i<9;i++){const px=(r()-.5)*200,py=-150+r()*440,k=(Math.sin(t*3+i*1.7)+1)/2; sp+=`<path d="M${px} ${py-10*k} L${px+3} ${py-3} L${px+10*k} ${py} L${px+3} ${py+3} L${px} ${py+10*k} L${px-3} ${py+3} L${px-10*k} ${py} L${px-3} ${py-3}Z" fill="#fff" opacity="${.7*k}"/>`;}
  const eye=cx=>{const ex=cx+look*10;
    return `${halo?`<circle cx="${ex}" cy="-62" r="26" fill="${i16_GH}" opacity="${.16*dots}"/>`:''}
     ${red>0?`<circle cx="${ex}" cy="-62" r="${80*red}" fill="url(#gRed)" opacity="${red}"/>`:''}
     <circle cx="${ex}" cy="-62" r="12" fill="${red>.3?P.red:'#06040C'}" stroke="${red>.3?'#FFD0D0':i16_GH}" stroke-width="3" opacity="${dots}"/>
     ${red>.3?`<g transform="translate(${ex},-62) scale(${red*1.4}) rotate(${t*40})"><path d="M0 -26 L4 -4 L26 0 L4 4 L0 26 L-4 4 L-26 0 L-4 -4Z" fill="#FFE0E0"/></g>`:''}`;};
  return `<g transform="translate(${x+jx},${y+by}) rotate(${rot}) scale(${s*dir},${s})">
   <g opacity="${op*sh}">${ln(L[0])}${ln(L[1])}${ln('M0 30 L0 170')}${ln(A[0])}${ln(A[1])}
    <circle cx="0" cy="-60" r="92" fill="${i16_GH}" fill-opacity=".05" stroke="${i16_GH}" stroke-width="6" stroke-dasharray="16 10" stroke-dashoffset="${off}"/>${sp}</g>
   ${eye(-30)}${eye(30)}</g>`;
}
// Glint fading between visible (f=0) and invisible (f=1)
function i16_fade(o,f){ return `${f<1?`<g opacity="${1-f}">${glint(o)}</g>`:''}${f>0?i16_ghost({...o,op:.4*f,dots:f>.5?1:f*2,halo:f}):''}`; }
// PLUS / MINUS label: big pop in the centre, then docks top-left
function i16_pm(t,kind,sub){
  const plus=kind==='plus', col=plus?P.mint:P.red, word=plus?'PLUS:':'MINUS:';
  const k=ease(prog(t,1.7,2.3)), sc=lerp(1,.4,k)*(t<1.7?pop(t,0,.4):1), x=lerp(960,330,k), y=lerp(470,120,k);
  return `${k<1?`<rect width="1920" height="1080" fill="#05030C" opacity="${.55*(1-k)}"/>`:''}
   <g transform="translate(${x},${y}) scale(${sc})">
    <g transform="translate(${-word.length*70-40},-70)"><circle r="78" fill="${col}" stroke="${INK}" stroke-width="12"/><path d="${plus?'M-40 0 H40 M0 -40 V40':'M-40 0 H40'}" stroke="${INK}" stroke-width="22" stroke-linecap="round"/></g>
    ${T(70,0,word,{size:220,fill:col,stroke:44})}${T(70,150,sub,{size:96,fill:P.white,stroke:22})}</g>`;
}
function i16_timer(x,y,secs,o={}){
  const {s=1,col=P.red,label='TIME LEFT',g=0,done=0}=o; const v=Math.max(0,secs), m=Math.floor(v/60), ss=Math.floor(v%60);
  const c=done?P.mint:col, pul=done?0:(Math.sin(g*Math.PI*2)>.6?1:0);
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-175" y="-82" width="350" height="164" rx="22" fill="#0B0814" fill-opacity=".9" stroke="${c}" stroke-width="8"/>
   <circle cx="-140" cy="-52" r="10" fill="${c}" opacity="${.4+.6*pul}"/>
   <text y="-34" text-anchor="middle" font-size="30" font-weight="900" fill="${c}" letter-spacing="4">${done?'MADE IT':label}</text>
   <text y="58" text-anchor="middle" font-size="104" font-weight="900" fill="#fff" style="font-variant-numeric:tabular-nums">${m}:${String(ss).padStart(2,'0')}</text></g>`;
}
const i16_cd=g=>90-(g-408.31);
function i16_ecgIrr(x,y,w,g,col=P.red){ let d=`M${x} ${y}`; const n=90;
  for(let i=1;i<=n;i++){const px=x+w*i/n, u=i/n*4-g*1.6, ph=((u%1)+1)%1, k=Math.floor(u); const amp=50+((k*37)%40);
    let py=y; if(ph>.3&&ph<.36)py=y-amp; else if(ph>=.36&&ph<.42)py=y+amp*.5; else if(ph>.62&&ph<.66&&k%2)py=y-amp*.6; d+=` L${px.toFixed(1)} ${py}`;}
  return `<path d="${d}" stroke="${col}" stroke-width="6" fill="none" stroke-linejoin="round"/>`; }
function i16_hudHeart(x,y,g,o={}){ const {calm=0}=o; const b=calm?Math.max(0,Math.sin(g*5)):Math.max(0,Math.sin(g*13))*(.5+.5*Math.sin(g*3.7));
  return `<g transform="translate(${x},${y})"><rect x="-200" y="-82" width="400" height="164" rx="22" fill="#0B0814" fill-opacity=".9" stroke="${calm?P.mint:P.red}" stroke-width="8"/>
   <text x="-180" y="-38" font-size="30" font-weight="900" fill="${calm?P.mint:P.red}" letter-spacing="3">NAN'S HEART</text>
   ${heart(150,-40,.14,b)}${calm?ecg(-180,30,360,g):i16_ecgIrr(-180,30,360,g)}</g>`; }
function i16_beam(x,y,ang,len=900,w=170,op=1){ return `<g transform="translate(${x},${y}) rotate(${ang})" opacity="${op}"><path d="M0 -10 L${len} ${-w} L${len} ${w} L0 10Z" fill="url(#i16beamG)"/></g>`; }
const i16_dark=op=>`<rect width="1920" height="1080" fill="#03020A" opacity="${op}"/>`;
function i16_rain(g,x0,y0,w,h,n=40,op=.4,seed=3){ const r=rng(seed); let s='';
  for(let i=0;i<n;i++){const x=x0+r()*w, y=y0+((r()*h+g*(700+r()*300))%h); s+=`<path d="M${x} ${y} l-8 32" stroke="#9AB8FF" stroke-width="3" opacity="${op}"/>`;} return s; }
function i16_bolt(x,y,s,op=1){ return `<g transform="translate(${x},${y}) scale(${s})" opacity="${op}"><path d="M0 0 L-40 160 L10 150 L-30 330 L80 120 L25 130 L60 0Z" fill="#FFF7C2" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/></g>`; }
// paramedic: extra + green vest + cap; returns {b:body, l:flashlight beam}
function i16_medic(x,y,s,t,o={}){
  const {dir=1,head='#E0B48A',pose='point',ang=0,beam=1,len=900,rot=0}=o; const by=Math.sin(t*2.4+1)*4;
  const flip=inner=>`<g transform="translate(${x},${y}) rotate(${rot}) scale(${dir},1) translate(${-x},${-y})">${inner}</g>`;
  const hx=pose==='point'?150:60, hy=pose==='point'?10:80;
  const b=extra({x,y,s,t,head,pose})+`<g transform="translate(${x},${y+by}) scale(${s})">
    <path d="M-42 30 L42 30 L48 165 L-48 165Z" fill="#2FA866" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-48" y="105" width="96" height="16" fill="#E8FF6A" stroke="${INK}" stroke-width="3"/>
    <path d="M-80 -100 Q0 -180 80 -100Z" fill="#2E8B57" stroke="${INK}" stroke-width="7"/><path d="M40 -104 H112" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>
    <g transform="translate(${hx},${hy}) rotate(${ang})"><rect x="-14" y="-14" width="56" height="28" rx="6" fill="#3B4A78" stroke="${INK}" stroke-width="5"/><rect x="40" y="-18" width="14" height="36" rx="4" fill="#FFF6D6" stroke="${INK}" stroke-width="4"/></g></g>`;
  const l=beam?`<g transform="translate(${x},${y+by}) scale(${s})">${i16_beam(hx+54*Math.cos(ang*Math.PI/180),hy+54*Math.sin(ang*Math.PI/180),ang,len,180,beam)}</g>`:'';
  return {b:flip(b),l:flip(l)};
}
function i16_phone(x,y,s,inner,rot=0,id='p'){
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-120" y="-230" width="240" height="460" rx="34" fill="${INK}" stroke="#3B4A78" stroke-width="6"/>
   <clipPath id="i16ph${id}"><rect x="-104" y="-200" width="208" height="400" rx="14"/></clipPath><rect x="-104" y="-200" width="208" height="400" rx="14" fill="#101425"/>
   <g clip-path="url(#i16ph${id})">${inner}</g><rect x="-30" y="-218" width="60" height="8" rx="4" fill="#3B4A78"/></g>`;
}
// --- backgrounds ---
function i16_bgHall(g,o={}){ const {storm=1,flash=0}=o; let w='';
  [360,960,1560].forEach((x,i)=>{const arch=`M${x-150} 640 V260 Q${x-150} 110 ${x} 110 Q${x+150} 110 ${x+150} 260 V640Z`;
    w+=`<clipPath id="i16hw${i}"><path d="${arch}"/></clipPath><path d="${arch}" fill="#0A0F24"/><g clip-path="url(#i16hw${i})">${i16_rain(g,x-160,100,320,560,18,.45*storm,30+i)}</g>
     <path d="${arch}" fill="#fff" opacity="${flash*.9}"/><path d="${arch}" fill="none" stroke="#2B3560" stroke-width="14"/><path d="M${x} 112 V640 M${x-150} 380 H${x+150}" stroke="#2B3560" stroke-width="8"/>`;});
  let tl=''; for(let i=-12;i<=12;i++) tl+=`<path d="M${960+i*80} 800 L${960+i*260} 1080" stroke="#222B50" stroke-width="4"/>`;
  return `<rect width="1920" height="1080" fill="#10162E"/>${w}<rect x="630" y="90" width="60" height="710" fill="#1C2448"/><rect x="1230" y="90" width="60" height="710" fill="#1C2448"/>
   <rect y="0" width="1920" height="80" fill="#0C1128"/><rect y="790" width="1920" height="290" fill="#151B36"/>${tl}<path d="M0 860 H1920 M0 950 H1920" stroke="#222B50" stroke-width="4"/><path d="M0 795 H1920" stroke="#2B3560" stroke-width="10"/>`;
}
function i16_bgBase(g,o={}){ const {stairs=1,moon=1}=o; let dr='';
  for(let c=0;c<3;c++)for(let r=0;r<5;r++){const x=110+c*150,y=420+r*78; dr+=`<rect x="${x}" y="${y}" width="140" height="70" rx="6" fill="#5A4030" stroke="${INK}" stroke-width="5"/><rect x="${x+40}" y="${y+14}" width="60" height="16" rx="3" fill="#E8D8B8"/><circle cx="${x+70}" cy="${y+48}" r="7" fill="${P.gold}" stroke="${INK}" stroke-width="3"/>`;}
  let st=''; if(stairs) for(let i=0;i<8;i++) st+=`<rect x="${1480+i*55}" y="${820-(i+1)*50}" width="${440-i*55}" height="50" fill="#22203A" stroke="#33304F" stroke-width="4"/>`;
  return `<rect width="1920" height="1080" fill="#100E1E"/>${[...Array(9)].map((_,i)=>`<path d="M0 ${120+i*80} H1920" stroke="#16142A" stroke-width="4"/>`).join('')}
   <path d="M0 70 H1920" stroke="#2A2840" stroke-width="26"/><path d="M0 115 H1920" stroke="#24223A" stroke-width="16"/>
   ${moon?`<rect x="880" y="150" width="220" height="90" rx="6" fill="#2A3A6A" stroke="#33304F" stroke-width="8"/><path d="M880 240 L700 820 H1300 L1100 240Z" fill="url(#i16spot)" opacity=".6"/>`:''}
   <rect x="90" y="400" width="470" height="420" rx="8" fill="#3A2A22" stroke="${INK}" stroke-width="8"/>${dr}<rect x="150" y="350" width="350" height="46" rx="8" fill="#E8D8B8" stroke="${INK}" stroke-width="5"/><text x="325" y="384" text-anchor="middle" font-size="32" font-weight="900" fill="${INK}">FOSSILS</text>
   ${st}<rect y="820" width="1920" height="260" fill="#0A0912"/><path d="M0 820 H1920" stroke="#24223A" stroke-width="6"/>`;
}
function i16_bgKitchen(g){
  return `<rect width="1920" height="1080" fill="#4A3550"/>${[...Array(16)].map((_,i)=>`<rect x="${i*130}" y="0" width="40" height="640" fill="#54405C"/>`).join('')}
   <rect x="1120" y="140" width="560" height="380" rx="10" fill="url(#i16day)" stroke="#F3E3C8" stroke-width="18"/><path d="M1400 140 V520 M1120 330 H1680" stroke="#F3E3C8" stroke-width="12"/>
   <circle cx="1560" cy="230" r="44" fill="#FFF4C2"/><circle cx="1560" cy="230" r="140" fill="url(#i16warm)"/>
   <path d="M1090 120 Q1150 330 1100 540 L1060 540 L1060 120Z M1710 120 Q1650 330 1700 540 L1740 540 L1740 120Z" fill="#E86A8A" stroke="${INK}" stroke-width="6"/>
   <rect x="140" y="250" width="460" height="22" fill="#7A4E3A" stroke="${INK}" stroke-width="5"/>${[0,1,2,3].map(i=>`<rect x="${170+i*110}" y="${180}" width="70" height="70" rx="12" fill="${['#FFC83D','#FF9F43','#9BE15D','#BFEFFF'][i]}" stroke="${INK}" stroke-width="5"/>`).join('')}
   <rect y="640" width="1920" height="40" fill="#E8D2B0" stroke="${INK}" stroke-width="6"/><rect y="680" width="1920" height="220" fill="#7A4E3A"/>
   ${[...Array(8)].map((_,i)=>`<rect x="${30+i*240}" y="700" width="210" height="180" rx="10" fill="#8C5C44" stroke="${INK}" stroke-width="5"/><circle cx="${210+i*240}" cy="790" r="9" fill="${P.gold}" stroke="${INK}" stroke-width="3"/>`).join('')}
   <rect y="900" width="1920" height="180" fill="#2E2236"/>`;
}
function i16_bgStreet(g){ const r=rng(8); let b='', x=-40;
  while(x<1980){const w=160+r()*160,h=220+r()*300,c=['#8FA3C8','#C9A0B8','#A0C8B0','#E0C08A','#B0A8D8'][Math.floor(r()*5)];
    b+=`<rect x="${x}" y="${640-h}" width="${w}" height="${h}" fill="${c}" stroke="${INK}" stroke-width="6"/>`;
    for(let yy=640-h+30;yy<600;yy+=70)for(let xx=x+24;xx<x+w-40;xx+=60) b+=`<rect x="${xx}" y="${yy}" width="32" height="40" rx="4" fill="#E6F4FF" stroke="${INK}" stroke-width="3"/>`; x+=w+6;}
  let z=''; for(let i=0;i<8;i++) z+=`<rect x="${690+i*70}" y="700" width="40" height="190" fill="#F4F6FA" opacity=".9"/>`;
  return `<rect width="1920" height="1080" fill="url(#i16day)"/>${b}<rect y="630" width="1920" height="60" fill="#B8B0C0" stroke="${INK}" stroke-width="6"/>
   <rect y="690" width="1920" height="210" fill="#3A3A4A"/>${z}${[...Array(8)].map((_,i)=>`<rect x="${i*260-60}" y="790" width="120" height="10" fill="#FFC83D" opacity=".6"/>`).join('')}<rect y="900" width="1920" height="180" fill="#8A8498"/>`;
}
function i16_bgDino(g){
  const bone='#C9C2B8', st=(d,w=14)=>`<path d="${d}" stroke="${INK}" stroke-width="${w+10}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${bone}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  let ribs=''; for(let i=0;i<7;i++){const x=420+i*45; ribs+=st(`M${x} ${360-Math.sin(i/6*3.1)*30} Q${x+10} 470 ${x-5} 520`,9);}
  return `<rect width="1920" height="1080" fill="#11162C"/>${[200,700,1200,1700].map(x=>`<rect x="${x}" y="0" width="70" height="800" fill="#161D3A"/>`).join('')}
   <rect x="80" y="700" width="900" height="100" fill="#1E2546" stroke="${INK}" stroke-width="6"/>
   ${st('M120 470 Q300 330 520 340 Q700 350 820 300')}${ribs}${st('M480 520 L440 700 M620 500 L660 700')}${st('M800 300 Q840 250 880 250')}
   <path d="M860 200 Q960 190 980 250 Q960 300 870 290 Z" fill="${bone}" stroke="${INK}" stroke-width="8"/><circle cx="910" cy="235" r="12" fill="${INK}"/>
   <rect y="800" width="1920" height="280" fill="#0D1124"/><path d="M0 800 H1920" stroke="#222B50" stroke-width="6"/>`;
}
function i16_bgHosp(g,sun=1){
  return `<rect width="1920" height="1080" fill="#2C3A5E"/><rect x="1100" y="130" width="600" height="400" rx="12" fill="url(#i16sun)" stroke="#E8EEF8" stroke-width="16"/>
   <clipPath id="i16hwin"><rect x="1100" y="130" width="600" height="400"/></clipPath><g clip-path="url(#i16hwin)"><circle cx="1400" cy="${560-170*sun}" r="80" fill="#FFE08A"/><circle cx="1400" cy="${560-170*sun}" r="220" fill="url(#gGold)"/>
   <path d="M1100 500 Q1300 440 1500 480 T1700 470 V530 H1100Z" fill="#3A2A5A"/></g><path d="M1400 130 V530" stroke="#E8EEF8" stroke-width="10"/>
   <rect x="1100" y="130" width="600" height="400" fill="#FFD9A0" opacity="${.1*sun}"/><path d="M1100 530 L900 1080 H1900 L1700 530Z" fill="#FFD9A0" opacity="${.08*sun}"/>
   <rect y="820" width="1920" height="260" fill="#232F4C"/><path d="M0 820 H1920" stroke="#3B4A78" stroke-width="5"/>`;
}
function i16_bed(x,y,blanket=1){ return `<g transform="translate(${x},${y})"><rect x="-340" y="-40" width="680" height="70" rx="20" fill="#E8EEF8" stroke="${INK}" stroke-width="8"/>
   <rect x="-360" y="-200" width="40" height="320" rx="10" fill="#9AA7BD" stroke="${INK}" stroke-width="6"/><rect x="320" y="-120" width="40" height="240" rx="10" fill="#9AA7BD" stroke="${INK}" stroke-width="6"/>
   ${blanket?`<path d="M-200 -60 Q60 -90 330 -50 L330 20 L-200 20Z" fill="#9EC9E8" stroke="${INK}" stroke-width="7"/>`:''}</g>`; }
function i16_lens(x,y,s,g,o={}){ const {hum=0,smudge=0,flash=0}=o; let rg=''; if(hum>0) for(let i=0;i<3;i++){const k=((g*.9+i/3)%1); rg+=`<circle r="${270+k*200}" fill="none" stroke="${P.ice}" stroke-width="6" opacity="${hum*(1-k)*.7}"/>`;}
  return `<g transform="translate(${x},${y}) scale(${s})">${rg}<path d="M-120 250 L-180 440 M120 250 L180 440 M0 260 V440" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="M-120 250 L-180 440 M120 250 L180 440 M0 260 V440" stroke="#8C6A3A" stroke-width="14" stroke-linecap="round"/>
   <circle r="270" fill="#B8893A" stroke="${INK}" stroke-width="12"/><circle r="236" fill="url(#i16glass)" stroke="${INK}" stroke-width="6"/>
   <path d="M-150 -120 A190 190 0 0 1 60 -200" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round" opacity=".6"/><path d="M120 150 A190 190 0 0 1 40 200" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".4"/>
   ${smudge?`<ellipse cx="90" cy="40" rx="40" ry="24" fill="#8C7A6A" opacity="${.5*smudge}"/>`:''}<circle r="236" fill="#fff" opacity="${flash}"/>
   <rect x="-150" y="300" width="300" height="60" rx="8" fill="#E8D8B8" stroke="${INK}" stroke-width="5"/><text y="342" text-anchor="middle" font-size="28" font-weight="900" fill="${INK}">HOW LIGHT BENDS</text></g>`;
}
// eye cross-section, light enters from the left
function i16_eyeX(x,y,s,o={}){ const {ghost=0,glow=0,red=0}=o; const da=ghost?'stroke-dasharray="18 14"':'';
  const sk=ghost?i16_GH:INK;
  return `<g transform="translate(${x},${y}) scale(${s})">${red>0?`<circle cx="0" r="${260}" fill="url(#gRed)" opacity="${red*.6}"/>`:''}
   <path d="M195 30 Q260 60 330 70" stroke="${ghost?i16_GH:'#E8A0A8'}" stroke-width="${ghost?6:40}" fill="none" ${da}/>
   <circle r="200" fill="${ghost?'none':'#FFF6EA'}" stroke="${sk}" stroke-width="${ghost?6:10}" ${da}/>
   <path d="M-172 -100 Q-250 0 -172 100" fill="${ghost?'none':'#DDF3FF'}" stroke="${sk}" stroke-width="${ghost?5:8}" ${da}/>
   <path d="M-180 -78 V-34 M-180 34 V78" stroke="${ghost?i16_GH:'#3B6EA8'}" stroke-width="${ghost?6:18}" ${da}/>
   <ellipse cx="-140" cy="0" rx="26" ry="64" fill="${ghost?'none':'#BFEFFF'}" stroke="${sk}" stroke-width="${ghost?5:7}" ${da}/>
   ${ghost?'':`<path d="M120 -152 A192 192 0 0 1 120 152" stroke="#C93A52" stroke-width="30" fill="none"/><path d="M120 -152 A192 192 0 0 1 120 152" stroke="${P.gold}" stroke-width="30" fill="none" opacity="${glow}"/>`}
   ${red>0?`<circle cx="186" cy="0" r="40" fill="${P.red}" opacity="${red}"/>`:''}</g>`;
}
function i16_quote(x,y,str,o={}){ const {size=64,fill=P.gold,who=''}=o; return `${T(x,y,'"'+str+'"',{size,fill})}${who?T(x,y+size*.95,'- '+who,{size:size*.55,fill:P.white}):''}`; }
function i16_frog(x,y,s,g,o={}){ const {sleep=0}=o; const veins=1-sleep;
  return `<g transform="translate(${x},${y}) scale(${s})">
   <path d="M-300 150 Q0 60 300 150 L300 200 L-300 200Z" fill="#3FA34D" stroke="${INK}" stroke-width="8"/>
   <path d="M-150 120 Q-230 150 -260 130 M150 120 Q230 150 260 130 M-100 60 Q-180 40 -200 90 M100 60 Q180 40 200 90" stroke="#BFF5C8" stroke-width="26" fill="none" stroke-linecap="round" opacity=".75"/>
   <ellipse cx="0" cy="40" rx="190" ry="110" fill="#CFFFD8" fill-opacity=".45" stroke="${INK}" stroke-width="8"/>
   <path d="M-120 30 Q0 -10 120 30 M-90 70 Q0 40 90 70" stroke="${P.red}" stroke-width="7" fill="none" opacity="${veins*.9}"/><path d="M-40 -10 V90 M40 -10 V90" stroke="${P.red}" stroke-width="6" opacity="${veins*.8}"/>
   <ellipse cx="0" cy="60" rx="${40+40*sleep}" ry="${26+20*sleep}" fill="#B8243A" stroke="${INK}" stroke-width="5"/>
   <path d="M-60 40 Q0 30 60 40" stroke="#E8F0E8" stroke-width="6" fill="none" opacity=".7"/>
   ${[-80,80].map(ex=>`<circle cx="${ex}" cy="-60" r="46" fill="#CFFFD8" fill-opacity=".6" stroke="${INK}" stroke-width="7"/><circle cx="${ex}" cy="-60" r="32" fill="#E8C24A" stroke="${INK}" stroke-width="5"/><ellipse cx="${ex}" cy="-60" rx="20" ry="12" fill="${INK}"/>`).join('')}</g>`;
}
function i16_cat(x,y,s,g,o={}){ return pickles(x,y,s,g,o); }
function i16_flashBurst(k){ return k>0&&k<1?`<rect width="1920" height="1080" fill="#fff" opacity="${(1-k)*.95}"/>`:''; }
function i16_shotPhoto(x,y,s,g,o={}){ const {red=1,title=''}=o; // photo of the dark hall with red eye dots
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-96" y="-130" width="192" height="200" fill="#0A0E20"/><path d="M-96 40 H96" stroke="#1E2546" stroke-width="6"/>
   <path d="M-70 -110 V30 M70 -110 V30" stroke="#1C2448" stroke-width="20"/>
   <circle cx="-14" cy="-40" r="22" fill="url(#gRed)" opacity="${red}"/><circle cx="14" cy="-40" r="22" fill="url(#gRed)" opacity="${red}"/>
   <circle cx="-14" cy="-40" r="6" fill="${P.red}" opacity="${red}"/><circle cx="14" cy="-40" r="6" fill="${P.red}" opacity="${red}"/>
   ${title?`<text y="110" text-anchor="middle" font-size="22" font-weight="900" fill="#fff">${title}</text>`:''}</g>`;
}
function i16_bgBuilding(g,o={}){ const {lights=1,alarm=0}=o; let rooms='';
  const fl=[230,390,550,710];
  fl.forEach((fy,f)=>{for(let c=0;c<9;c++){const rx=230+c*115; rooms+=`<rect x="${rx}" y="${fy}" width="105" height="140" fill="${lights>0&&((c+f)%3)?'#FFE08A':'#151B36'}" opacity="${lights>0&&((c+f)%3)?lights*.8:1}" stroke="#2B3560" stroke-width="5"/><rect x="${rx+40}" y="${fy+90}" width="26" height="50" fill="#0A0E20"/>`;}});
  return `${card('cardDark',g)}<path d="M190 210 L700 90 L1270 210Z" fill="#1E2546" stroke="${INK}" stroke-width="8"/><rect x="200" y="210" width="1070" height="660" fill="#10162E" stroke="${INK}" stroke-width="10"/>${rooms}
   ${[0,1,2].map(i=>`<path d="M${i%2?1150:250} ${370+i*160} L${i%2?250:1150} ${370+i*160}" stroke="none"/>`).join('')}
   <rect x="200" y="690" width="1070" height="10" fill="#2B3560"/><text x="1230" y="770" text-anchor="end" font-size="28" font-weight="900" fill="#5D6A82">BASEMENT</text>
   ${alarm?`<g transform="translate(1180,170)"><circle r="40" fill="${P.red}" stroke="${INK}" stroke-width="6" opacity="${.5+.5*Math.abs(Math.sin(g*8))}"/>${rings(0,0,g*2,alarm*.6,P.red).replace(/r="(\d+(\.\d+)?)"/g,(m,a)=>`r="${(+a)*.35}"`)}</g>`:''}`;
}


Object.assign(SHOTS,{
// ===== COLD OPEN =====
invCold(t,d,p,g){
  const nanA=p.nan??2.5, hA=p.heart??8.7, paA=p.para??11.7, loA=p.lost??13.9, wyA=p.way??15.9, invA=p.inv??20.7, dtA=p.dots??23.1;
  const beat=Math.max(0,Math.sin(g*13))*(.5+.5*Math.sin(g*3.7)), gf=prog(t,invA,invA+1.5), sw=Math.sin(g*1.3);
  const m1=i16_medic(1150,250,.5,g,{dir:-1,ang:20+sw*25,beam:IN(t,paA),len:700}), m2=i16_medic(1350,250,.5,g+1,{dir:-1,head:'#8D5A3B',ang:-5+Math.sin(g*1.1+1)*25,beam:IN(t,paA),len:700});
  const nan=person({x:700,y:770,s:.55,t:g,who:'nan',mouth:'o',brows:'sad',blink:BL(g),rot:-88,sweat:1}).replace(/<ellipse cx="0" cy="302"[^>]*\/>/,'');
  const zoom=IN(t,dtA);
  return `${i16_DEFS}<rect width="1920" height="450" fill="#121833"/>${[...Array(5)].map((_,i)=>`<rect x="${120+i*380}" y="40" width="70" height="400" fill="#182044"/>`).join('')}
   <g transform="translate(0,0)">${i16_bgBase(g,{stairs:0,moon:0}).replace('<rect width="1920" height="1080" fill="#100E1E"/>','<rect y="470" width="1920" height="610" fill="#100E1E"/>')}</g>
   <rect y="0" width="1920" height="450" fill="#121833"/><rect y="440" width="1920" height="34" fill="#2A2F4A" stroke="${INK}" stroke-width="6"/>
   ${T(150,90,'GROUND FLOOR',{size:34,fill:'#5D6A82',anchor:'start',stroke:8})}${T(1800,530,'BASEMENT',{size:34,fill:'#5D6A82',anchor:'end',stroke:8})}
   ${AT(t,paA)?m1.b+m2.b:''}
   ${i16_dark(.55)}
   <ellipse cx="760" cy="800" rx="${300*IN(t,nanA)}" ry="90" fill="url(#i16spot)"/>${AT(t,nanA)?nan:''}
   ${AT(t,hA)?`${heart(760,640,.22,beat)}`:''}${AT(t,nanA)?labelPill(560,590,'NAN',P.violet,34):''}
   ${AT(t,paA)?m1.l+m2.l:''}
   ${AT(t,loA)?T(1250,150+Math.sin(g*3)*6,'? ?',{size:70,fill:P.gold}):''}
   ${AT(t,wyA)&&!AT(t,invA)?`<g opacity="${.5+.5*Math.sin(g*5)}">${T(700,260,'?',{size:150,fill:P.white})}</g>`:''}
   ${AT(t,invA)?i16_ghost({x:700,y:262,s:.55,t:g,op:.6*gf,dots:gf,pose:'reach'}):''}
   ${zoom>0?`<path d="M700 228 L470 260" stroke="${i16_GH}" stroke-width="4" opacity=".6"/><g transform="translate(360,260) scale(${zoom})"><circle r="150" fill="#0A0E20" stroke="${i16_GH}" stroke-width="8"/>
      <clipPath id="i16zc"><circle r="142"/></clipPath><g clip-path="url(#i16zc)">${i16_ghost({x:0,y:110,s:1.5,t:g,op:.5})}</g></g>${T(360,470,'TWO DARK DOTS',{size:46,fill:i16_GH,sc:zoom})}`:''}
   ${i16_timer(1700,120,90-g,{g,label:'TIME LEFT',s:IN(t,.1)})}`;
},
// ===== LET'S GO BACK + the lens =====
invLens(t,d,p,g){
  const mA=p.mus??3.3, lA=p.lens??9, sA=p.storm??14.9, poA=p.polish??17.6;
  const rw=1-prog(t,mA-1.2,mA), gx=lerp(560,800,eout(prog(t,poA,poA+1.5)));
  let lines=''; if(rw>0) for(let i=0;i<10;i++){const y=((i*113+t*900)%1080); lines+=`<rect x="0" y="${y}" width="1920" height="${6+i%3*4}" fill="#fff" opacity="${.12*rw}"/>`;}
  const fl=AT(t,sA)&&(g%4.1)>3.9?1:0;
  return `${i16_DEFS}${i16_bgHall(g,{storm:AT(t,sA)?1:.3,flash:fl*.5})}
   ${i16_lens(1250,430,lerp(.85,1,IN(t,lA)),g,{smudge:1-prog(t,poA+1,poA+3)})}
   ${glint({x:gx,y:520,s:1,t:g,pose:AT(t,poA)?'point':'down',mouth:AT(t,poA)?'smile':'o',brows:'calm',look:1,blink:BL(g)})}
   ${AT(t,poA)?`<rect x="${gx+140}" y="${520+Math.sin(g*10)*14}" width="44" height="34" rx="6" fill="#FFF6EA" stroke="${INK}" stroke-width="5"/>`:''}
   ${labelPill(220,110,'2:00 AM',P.gold,46)}
   ${AT(t,lA)?T(1250,120,'WIDER THAN A DOOR',{size:64,fill:P.ice,sc:IN(t,lA)}):''}
   ${AT(t,sA)?T(560,250,'STORM',{size:60,fill:'#9AB8FF',sc:IN(t,sA),op:1-prog(t,sA+3,sA+4)}):''}
   ${rw>0?`<rect width="1920" height="1080" fill="#1A0B3A" opacity="${.7*rw}"/>${lines}${T(960,470,'LET\'S GO BACK',{size:120,fill:P.white,sc:pop(t,0)})}${T(960,640,'3 DAYS EARLIER',{size:110,fill:P.gold,sc:pop(t,1.4)})}
     <g transform="translate(960,800)" opacity="${rw}"><path d="M-60 -40 L-120 0 L-60 40Z M20 -40 L-40 0 L20 40Z" fill="#fff"/></g>`:''}`;
},
// ===== lightning: Glint turns invisible =====
invStrike(t,d,p,g){
  const fA=p.flash??1.7, hA=p.hum??3.4, thA=p.thru??5.1, goA=p.gone??7.8, lkA=p.look??9.9, a1=p.hands??11.8, a2=p.shoes??13.4, a3=p.scarf??14.4, a4=p.floor??15.9;
  const bolt=t<1.2?1:0, fl=Math.max(0,1-Math.abs(t-fA)/.8), f=ease(prog(t,thA,goA+1.2));
  let rays=''; if(AT(t,thA)&&t<lkA+1) for(let i=0;i<5;i++){const y=300+i*60,k=prog(t,thA+i*.1,thA+1.4+i*.1); rays+=`<path d="M0 ${y-120} L${1920*k} ${y+60}" stroke="#FFF6D6" stroke-width="8" opacity="${.55*(1-prog(t,lkA,lkA+1))}"/>`;}
  const lab=(at,x,y,s)=>AT(t,at)?`<g transform="translate(${x},${y}) scale(${pop(t,at)})">${labelPill(0,0,s,P.coral,42)}</g>`:'';
  return `${i16_DEFS}${i16_bgHall(g,{flash:fl})}${i16_lens(1400,430,.85,g,{hum:IN(t,hA)*(1-prog(t,lkA,lkA+1)),flash:fl*.8})}
   ${i16_fade({x:760,y:520,s:1.05,t:g,pose:AT(t,lkA)?'reach':(AT(t,fA)?'shrug':'down'),mouth:'o',brows:'raised',look:AT(t,lkA)?0:1,blink:0},f)}
   ${rays}${bolt?i16_bolt(1300,-40,1.6,1-prog(t,.6,1.2)):''}<rect width="1920" height="1080" fill="#fff" opacity="${fl*.8}"/>
   ${AT(t,hA)&&!AT(t,lkA)?T(1400,120,'HMMMM',{size:64,fill:P.ice,sc:IN(t,hA)}):''}
   ${lab(a1,420,480,'NO HANDS')}${lab(a2,760,880,'NO SNEAKERS')}${lab(a3,1100,560,'NO SCARF')}
   ${AT(t,a4)?T(760,140,'JUST FLOOR TILES',{size:84,fill:P.white,sc:IN(t,a4)}):''}`;
},
// ===== mirror: only the eyes =====
invMirror(t,d,p,g){
  const nA=p.nothing??2, cA=p.closer??3.15, sA=p.sees??5.1, ciA=p.circ??6.7, eA=p.eyes??10.7;
  const run=eout(prog(t,0,1.8)), lean=eout(prog(t,cA,cA+1.5)), gx=lerp(-100,560,run)+lean*120;
  const dots=IN(t,sA), pul=.5+.5*Math.sin(g*4);
  let tiles=''; for(let i=0;i<16;i++)for(let j=0;j<9;j++) tiles+=`<rect x="${i*120}" y="${j*100}" width="120" height="100" fill="none" stroke="#24485A" stroke-width="3"/>`;
  return `${i16_DEFS}<rect width="1920" height="1080" fill="#1C3A48"/>${tiles}
   <rect x="1000" y="140" width="680" height="520" rx="16" fill="#C9D3E3" stroke="${INK}" stroke-width="10"/><rect x="1024" y="164" width="632" height="472" rx="8" fill="#0E2430"/>
   <clipPath id="i16mir"><rect x="1024" y="164" width="632" height="472"/></clipPath><g clip-path="url(#i16mir)">${[...Array(6)].map((_,i)=>`<path d="M${1024+i*120} 164 V636" stroke="#183644" stroke-width="3"/>`).join('')}
     <path d="M1060 200 L1180 180 M1060 250 L1250 210" stroke="#fff" stroke-width="10" opacity=".25" stroke-linecap="round"/>
     ${dots>0?`<g transform="translate(${1340-lean*40},${430}) scale(${(.8+lean*.5)*dots})"><circle cx="-30" cy="-62" r="${26+8*pul}" fill="${i16_GH}" opacity=".2"/><circle cx="30" cy="-62" r="${26+8*pul}" fill="${i16_GH}" opacity=".2"/><circle cx="-30" cy="-62" r="13" fill="#06040C" stroke="${i16_GH}" stroke-width="3"/><circle cx="30" cy="-62" r="13" fill="#06040C" stroke="${i16_GH}" stroke-width="3"/></g>`:''}</g>
   <rect x="1080" y="680" width="520" height="70" rx="30" fill="#E8EEF8" stroke="${INK}" stroke-width="8"/><rect x="1320" y="750" width="40" height="150" fill="#9AA7BD" stroke="${INK}" stroke-width="6"/>
   <rect y="880" width="1920" height="200" fill="#163040"/>
   ${i16_ghost({x:gx,y:520,s:1,t:g,legs:run<1?'walk':'stand',op:.45,look:1,rot:lean*8})}
   ${AT(t,nA)&&!AT(t,sA)?T(1340,420,'NOTHING',{size:90,fill:P.white,sc:IN(t,nA)}):''}
   ${AT(t,ciA)?`<path d="M1300 340 L1180 260" stroke="${P.gold}" stroke-width="6"/>${labelPill(1080,240,'TWO DARK CIRCLES',P.gold,36)}`:''}
   ${AT(t,eA)?T(1340,110,'HIS EYES',{size:110,fill:P.gold,sc:IN(t,eA)}):''}`;
},
// ===== THE RULES: bounce, bend, air =====
invRulesSee(t,d,p,g){
  const rA=p.real??1.5, sA=p.see??4, glA=p.glass??9.2, aA=p.air??15.1, b1=p.nb??21.2, b2=p.nbe??22.6;
  const k1=prog(t,sA,sA+1.5), k2=prog(t,glA,glA+1.5), k3=prog(t,aA,aA+1.5);
  const panel=(x,lab,on,col)=>`<g opacity="${.25+.75*on}"><rect x="${x-290}" y="250" width="580" height="600" rx="26" fill="#0B0F22" stroke="${col}" stroke-width="6"/>${T(x,320,lab,{size:46,fill:col})}</g>`;
  const ray=(pts,k,col='#FFF6D6')=>{let d=`M${pts[0][0]} ${pts[0][1]}`; for(let i=1;i<pts.length;i++) d+=` L${pts[i][0]} ${pts[i][1]}`; return `<path d="${d}" stroke="${col}" stroke-width="7" fill="none" stroke-dasharray="1400" stroke-dashoffset="${1400*(1-k)}" stroke-linecap="round"/>`;};
  return `${i16_DEFS}${card('cardDark',g)}${T(960,150,'THE RULES',{size:110,fill:P.gold,sc:pop(t,0)})}${AT(t,rA)?labelPill(960,215,'REAL SCIENCE',P.mint,30):''}
   ${panel(370,'BOUNCES',IN(t,sA),P.gold)}${panel(960,'BENDS',IN(t,glA),P.ice)}${panel(1550,'LIKE AIR',IN(t,aA),P.mint)}
   <circle cx="180" cy="430" r="40" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><circle cx="180" cy="430" r="90" fill="url(#gGold)"/>
   <circle cx="480" cy="560" r="70" fill="${P.coral}" stroke="${INK}" stroke-width="8"/>
   ${ray([[220,450],[420,530],[250,760]],k1)}<g transform="translate(250,770)"><ellipse rx="44" ry="26" fill="#fff" stroke="${INK}" stroke-width="6"/><circle r="14" fill="${INK}"/></g>
   <g transform="translate(960,570)"><path d="M-80 -150 L-65 150 Q0 165 65 150 L80 -150Z" fill="#BFEFFF" fill-opacity=".35" stroke="${INK}" stroke-width="8"/><path d="M-76 -60 L-68 148 Q0 162 68 148 L76 -60Z" fill="#6FD3F7" fill-opacity=".5"/></g>
   ${ray([[700,480],[882,520],[1040,600],[1220,560]],k2)}${ray([[700,640],[885,620],[1035,540],[1220,610]],k2)}
   ${k2>.6?`<circle cx="882" cy="520" r="14" fill="${P.ice}"/><circle cx="1040" cy="600" r="14" fill="${P.ice}"/>`:''}
   ${i16_ghost({x:1550,y:560,s:.7,t:g,op:.6*IN(t,aA),dots:0,halo:0})}
   ${ray([[1290,420],[1810,420]],k3)}${ray([[1290,560],[1810,560]],k3)}${ray([[1290,700],[1810,700]],k3)}
   ${AT(t,b1)?`<g transform="translate(560,920) scale(${pop(t,b1)})">${labelPill(0,-30,'NOTHING BOUNCES',P.gold,40)}</g>`:''}${AT(t,b2)?`<g transform="translate(1360,920) scale(${pop(t,b2)})">${labelPill(0,-30,'NOTHING BENDS',P.ice,40)}</g>`:''}`;
},
// ===== the catch: retina must absorb light =====
invRetina(t,d,p,g){
  const rA=p.ret??1.5, abA=p.abs??6.3, sgA=p.sig??8.1, ivA=p.inv??11.2, blA=p.blind??16.5;
  const gh=AT(t,ivA)?1:0, k=prog(t,rA,rA+1.5), kk=prog(t,ivA,ivA+1.5);
  const ray=(y0)=>gh?`<path d="M100 ${500+y0} L1900 ${500+y0}" stroke="#FFF6D6" stroke-width="7" stroke-dasharray="1800" stroke-dashoffset="${1800*(1-kk)}"/>`
     :`<path d="M100 ${500+y0} L${760-140} ${500+y0*.5} L${760+186} 500" stroke="#FFF6D6" stroke-width="7" fill="none" stroke-dasharray="1000" stroke-dashoffset="${1000*(1-k)}"/>`;
  let sig=''; if(AT(t,sgA)&&!gh) for(let i=0;i<3;i++){const q=((g*.8+i/3)%1); sig+=`<circle cx="${lerp(1090,1420,q)}" cy="${lerp(570,470,q)}" r="14" fill="${P.gold}" stroke="${INK}" stroke-width="4"/>`;}
  return `${i16_DEFS}${card('cardWarm',g)}${T(960,150,'BUT THERE\'S A CATCH',{size:90,fill:P.coral,sc:pop(t,0)})}
   <circle cx="100" cy="500" r="44" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><circle cx="100" cy="500" r="110" fill="url(#gGold)"/>
   ${i16_eyeX(760,500,1,{ghost:gh,glow:AT(t,abA)&&!gh?.5+.5*Math.sin(g*6):0})}${ray(-90)}${ray(0)}${ray(90)}
   ${!gh&&AT(t,rA)?`<path d="M990 360 L1080 280" stroke="${P.white}" stroke-width="5"/>${labelPill(1180,260,'RETINA',P.coral,40)}`:''}
   ${AT(t,abA)&&!gh?labelPill(760,800,'ABSORBS LIGHT',P.gold,44):''}
   ${brain(1560,450,.75,gh?.1:(AT(t,sgA)?1:.2),g,gh?1:0)}${sig}
   ${gh?labelPill(760,800,'LIGHT PASSES THROUGH',i16_GH,44):''}
   ${AT(t,blA)?stamp(1560,460,pop(t,blA)*.9,'BLIND'):''}`;
},
// ===== the rule in this world =====
invRule(t,d,p,g){
  const hA=p.holds??3.4, eA=p.except??8.2, dA=p.dots??12.2, prA=p.price??14.1;
  const mugF=ease(prog(t,hA+.6,hA+2)), z=IN(t,eA);
  return `${i16_DEFS}${card('cardMint',g)}${labelPill(960,120,'IN THIS WORLD...',P.gold,52)}
   ${i16_ghost({x:560,y:520,s:1.1,t:g,pose:'hold',op:.55,red:0})}
   <g transform="translate(${560+77},${520+77+Math.sin(g*2.4)*5})"><g opacity="${1-mugF*.8}"><rect x="-10" y="-20" width="70" height="80" rx="10" fill="${mugF<.5?P.coral:'none'}" stroke="${mugF<.5?INK:i16_GH}" stroke-width="7" ${mugF>.3?'stroke-dasharray="12 8"':''}/><path d="M60 0 q30 10 0 40" stroke="${mugF<.5?INK:i16_GH}" stroke-width="7" fill="none"/></g></g>
   ${T(1350,330,'INVISIBLE:',{size:70,fill:P.white,sc:pop(t,.4)})}${T(1350,420,'HIS BODY',{size:60,fill:P.mint,sc:pop(t,.8)})}${AT(t,hA)?T(1350,500,'+ ANYTHING HE HOLDS',{size:56,fill:P.mint,sc:IN(t,hA)}):''}
   ${AT(t,eA)?T(1350,640,'EXCEPT: HIS EYES\' DARK',{size:50,fill:P.gold,sc:z})+T(1350,700,'LIGHT-CATCHING LAYERS',{size:50,fill:P.gold,sc:z}):''}
   ${AT(t,dA)?`<g transform="translate(560,${418+Math.sin(g*2.4)*5})"><circle cx="-33" r="${40+10*Math.sin(g*5)}" fill="none" stroke="${P.gold}" stroke-width="6"/><circle cx="33" r="${40+10*Math.sin(g*5)}" fill="none" stroke="${P.gold}" stroke-width="6"/></g>`:''}
   ${AT(t,prA)?T(960,850,'THE PRICE OF SEEING',{size:96,fill:P.white,sc:IN(t,prA)}):''}`;
},
// ===== PLUS: breakfast =====
invScone(t,d,p,g){
  const nA=p.nan??2.5, wA=p.worry??3.9, trA=p.tray??8.1, lA=p.lift??11.5, vA=p.vanish??14, fA=p.freeze??15.7;
  const lift=eout(prog(t,lA,lA+1.6)), van=prog(t,vA,vA+.8);
  let sc=''; for(let i=0;i<6;i++){const x=1250+(i%3)*95, y=600-(i>2?40:0); if(i===4) continue; sc+=`<path d="M${x-36} ${y+16} Q${x-30} ${y-30} ${x} ${y-34} Q${x+30} ${y-30} ${x+36} ${y+16}Z" fill="#E0A45A" stroke="${INK}" stroke-width="5"/><path d="M${x-14} ${y-14} q6 -6 12 0" stroke="#8C5A2A" stroke-width="4" fill="none"/>`;}
  const sx=1345+lift*60, sy=560-lift*230+Math.sin(g*4)*6*lift;
  let steam=''; for(let i=0;i<3;i++){const q=((g*.5+i/3)%1); steam+=`<circle cx="${1300+i*80+Math.sin(g+i)*10}" cy="${560-q*140}" r="${14+q*20}" fill="#fff" opacity="${.3*(1-q)}"/>`;}
  return `${i16_DEFS}${i16_bgKitchen(g)}
   <rect x="1180" y="610" width="360" height="26" rx="8" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/>${AT(t,trA)?sc+steam:''}
   ${AT(t,lA)&&van<1?`<g opacity="${1-van}"><path d="M${sx-36} ${sy+16} Q${sx-30} ${sy-30} ${sx} ${sy-34} Q${sx+30} ${sy-30} ${sx+36} ${sy+16}Z" fill="#E0A45A" stroke="${INK}" stroke-width="5"/></g>`:''}
   ${van>0&&van<1?`<g transform="translate(${sx},${sy}) scale(${van*2})"><path d="M0 -26 L5 -5 L26 0 L5 5 L0 26 L-5 5 L-26 0 L-5 -5Z" fill="#fff"/></g>`:''}
   ${AT(t,lA)?i16_ghost({x:1480,y:540,s:.95,t:g,pose:'reach',op:.25}):''}
   ${person({x:560,y:560,s:1,t:g,who:'nan',pose:AT(t,fA)?'up':'hold',mouth:AT(t,fA)?'o':(AT(t,wA)?'flat':'smile'),brows:AT(t,fA)?'raised':(AT(t,wA)?'sad':'calm'),look:AT(t,lA)?1:0,blink:AT(t,fA)?0:BL(g)})}
   ${AT(t,fA)?'':`<g transform="translate(610,${650+Math.sin(g*2.4+2)*4})"><path d="M-70 0 Q0 80 70 0Z" fill="#BFEFFF" stroke="${INK}" stroke-width="6"/><path d="M20 -10 L60 -70" stroke="${INK}" stroke-width="7"/></g>`}
   ${AT(t,wA)?`<g transform="translate(860,250) scale(${IN(t,wA)})">${bubble(0,0,380,110,'GLINT? HOME?',{size:44,tail:'left'})}</g>`:''}
   ${AT(t,nA)?labelPill(560,880,'NAN',P.violet,38):''}
   ${i16_pm(t,'plus','BREAKFAST')}`;
},
invPutBack(t,d,p,g){
  const pu=p.put??2, it=p.it??2.6, bk=p.back??3.2, la=p.laugh??4.3, sh=p.shriek??5.25, ca=p.cat??6.6, si=p.sit??12.65, pr=p.promise??17.9;
  const sit=AT(t,si), words=['GLINT.','PUT.','IT.','BACK.'].filter((w,i)=>t>=[0,pu,it,bk][i]).join(' ');
  const beat=Math.max(0,Math.sin(g*4))*.5;
  return `${i16_DEFS}${i16_bgKitchen(g)}
   ${sit?`<g transform="translate(560,760)"><rect x="-110" y="-30" width="220" height="30" fill="#8C5C44" stroke="${INK}" stroke-width="6"/><path d="M-100 0 V140 M100 0 V140" stroke="#8C5C44" stroke-width="16"/><rect x="-110" y="-230" width="26" height="230" fill="#8C5C44" stroke="${INK}" stroke-width="6"/></g>`:''}
   ${person({x:560,y:sit?490:560,s:1,t:g,who:'nan',pose:sit?'hold':(AT(t,sh)&&!AT(t,ca)?'up':'point'),legs:sit?'sit':'stand',mouth:sit?'frown':(AT(t,sh)&&!AT(t,ca)?'o':'flat'),brows:sit?'sad':(AT(t,sh)&&!AT(t,ca)?'raised':'angry'),blink:BL(g),look:1})}
   ${!sit?`<g transform="translate(600,190)">${bubble(0,0,Math.max(300,words.length*30+80),120,words,{size:52,tail:'left'})}</g>`:''}
   ${AT(t,la)&&!AT(t,ca)?T(1060,300+Math.sin(g*12)*8,'HA HA!',{size:60,fill:P.mint}):''}${AT(t,sh)&&!AT(t,ca)?T(330,250,'EEK!',{size:70,fill:P.coral,sc:IN(t,sh)}):''}
   ${i16_ghost({x:sit?820:1020,y:520+(AT(t,la)&&!AT(t,ca)?-Math.abs(Math.sin(g*10))*20:0),s:.95,t:g,op:.25,look:-1})}
   ${AT(t,ca)?`${i16_cat(1450,800,.95,g,{mood:'grump',blink:0})}${labelPill(1450,920,'MR. PICKLES',P.warm,34)}${!sit?`<path d="M1380 720 Q1200 560 1050 470" stroke="#fff" stroke-width="4" stroke-dasharray="10 10" opacity=".6"/>${labelPill(1640,640,'BLINKS: 0',P.gold,34)}`:''}`:''}
   ${sit?`${heart(600,600,.16,beat)}${labelPill(560,170,'HER HEART IS WEAK',P.coral,46)}`:''}
   ${AT(t,pr)?`<g transform="translate(1060,240) scale(${IN(t,pr)})">${bubble(0,0,460,110,"I'LL BE CAREFUL",{size:46,tail:'left'})}</g>`:''}`;
},
// ===== MINUS: his own hands =====
invHands(t,d,p,g){
  const prA=p.prop??3, whA=p.where??5.9, stA=p.still??10.5, noA=p.nose??12.1, fiA=p.fiddly??14.4, trA=p.try??19.4, caA=p.cat??22.3;
  const pts=[[-62,150],[62,150],[-30,300],[40,300],[0,40]];
  let sn=''; if(AT(t,whA)) pts.forEach(([x,y],i)=>{sn+=`<circle cx="${560+x*1.05}" cy="${510+y*1.05}" r="${16+6*Math.sin(g*5+i)}" fill="${P.gold}" opacity=".85"/><path d="M${560+x*1.05} ${510+y*1.05} L560 380" stroke="${P.gold}" stroke-width="3" opacity=".4"/>`;});
  const tb=IN(t,fiA), kn=AT(t,caA)?1:0, bx=AT(t,caA)?1520+Math.sin(g*4)*40:1280+Math.sin(g*3)*120, by=AT(t,caA)?640+Math.cos(g*4)*20:590+Math.cos(g*5)*60;
  return `${i16_DEFS}${card('cardDark',g)}<rect width="1920" height="1080" fill="#000" opacity=".25"/>
   ${AT(t,prA)?T(560,150,'PROPRIOCEPTION',{size:80,fill:P.gold,sc:IN(t,prA)}):''}${AT(t,whA)?labelPill(560,230,'EYES SHUT? STILL WORKS',P.mint,34):''}
   ${i16_ghost({x:560,y:510,s:1.05,t:g,pose:AT(t,noA)&&!AT(t,fiA)?'nose':(AT(t,fiA)?'reach':'down'),op:.55})}${sn}
   ${AT(t,stA)?icon('check',800,330,IN(t,stA)*.7):''}
   ${tb>0?`<g opacity="${tb}"><rect x="1050" y="700" width="800" height="40" rx="10" fill="#8C5C44" stroke="${INK}" stroke-width="7"/><path d="M1100 740 V900 M1800 740 V900" stroke="#8C5C44" stroke-width="22"/>
     <ellipse cx="1240" cy="690" rx="120" ry="22" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="1170" y="610" width="140" height="80" rx="20" fill="#E0A45A" stroke="${INK}" stroke-width="6"/>
     ${AT(t,trA)?`<ellipse cx="${bx}" cy="${by}" rx="26" ry="14" fill="#FFE07A" stroke="${INK}" stroke-width="4"/>`:''}
     ${i16_cat(1560,620,.8,g,{mood:'grump'})}${kn?`<path d="M1440 590 Q1500 560 1560 590" stroke="#FFE07A" stroke-width="18" stroke-linecap="round" opacity="${prog(t,caA,caA+1)}"/>`:''}</g>
     ${T(1450,180,'TRY BUTTERING TOAST',{size:60,fill:P.white,sc:IN(t,trA),op:AT(t,trA)?1:0})}`:''}
   ${AT(t,caA)?T(1450,280,'HE BUTTERS THE CAT',{size:72,fill:P.gold,sc:IN(t,caA)}):''}
   ${i16_pm(t,'minus','HIS OWN HANDS')}`;
},
// ===== PLUS: Kai =====
invKai(t,d,p,g){
  const i1=p.i1??1.8, i2=p.i2??5.2, i3=p.i3??8, no=p.no??11.4;
  const ideas=[[i1,'HAUNT OUR OLD SCHOOL'],[i2,'HAUNT THE MAYOR'],[i3,'GHOST VIDEO AT THE MUSEUM']];
  let L=''; ideas.forEach(([a,s],i)=>{ if(!AT(t,a)) return; const y=380+i*170; L+=`<g transform="translate(1340,${y}) scale(${pop(t,a)})"><rect x="-430" y="-60" width="860" height="120" rx="20" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/>
     <circle cx="-370" r="38" fill="${P.coral}" stroke="${INK}" stroke-width="6"/><text x="-370" y="16" text-anchor="middle" font-size="44" font-weight="900" fill="#fff">${i+1}</text><text x="-310" y="16" font-size="${s.length>20?40:46}" font-weight="900" fill="${INK}">${s}</text></g>
     ${AT(t,no+i*.5)?stamp(1600,y,pop(t,no+i*.5)*.5,'NO'):''}`;});
  return `${i16_DEFS}${bgNight(g)}${T(1340,200,"KAI'S IDEAS",{size:84,fill:P.coral,sc:pop(t,.5)})}
   ${person({x:430,y:560,s:1.05,t:g,who:'kai',pose:'up',mouth:AT(t,no)?'frown':'grin',brows:AT(t,no)?'sad':'raised',blink:BL(g)})}${labelPill(430,900,'KAI',P.coral,38)}
   ${i16_ghost({x:760,y:540,s:.85,t:g,op:.3,look:1})}${L}
   ${i16_pm(t,'plus','KAI')}`;
},
// ===== flash photo -> red-eye -> viral =====
invFlash(t,d,p,g){
  const snA=p.snap??1.6, scA=p.screen??3.7, reA=p.redeye??7, boA=p.bounce??8.7, poA=p.post??16.5, viA=p.views??19.2;
  const ph1=t<reA, ph2=AT(t,reA)&&!AT(t,poA), fl=prog(t,snA,snA+.7);
  if(ph1) return `${i16_DEFS}${i16_bgHall(g,{storm:.4})}${i16_dark(.5)}
   ${person({x:600,y:560,s:1,t:g,who:'kai',pose:'point',mouth:'grin',brows:'raised',blink:BL(g)})}${i16_phone(765,575,.35,`<rect x="-104" y="-200" width="208" height="400" fill="#22305A"/>`,0,'k')}
   ${i16_ghost({x:1250,y:530,s:1,t:g,op:.35,look:-1,red:AT(t,snA)&&fl<1?1-fl:0})}${i16_flashBurst(fl)}
   ${AT(t,scA)?`<g transform="scale(${IN(t,scA)})" transform-origin="960 470">${i16_phone(960,470,1.6,i16_shotPhoto(0,-20,1,g),0,'s')}</g>${T(960,180,'TWO GLOWING RED DOTS',{size:64,fill:P.red,sc:IN(t,scA)})}`:''}`;
  if(ph2){ const k=prog(t,boA,boA+2.5), k2=prog(t,boA+2.5,boA+5);
    return `${i16_DEFS}${card('cardWarm',g)}${T(960,150,'THE RED-EYE EFFECT',{size:100,fill:P.red,sc:pop(t,reA)})}
     <g transform="translate(300,500)"><rect x="-110" y="-70" width="220" height="140" rx="20" fill="#3B4A78" stroke="${INK}" stroke-width="8"/><circle cx="20" r="44" fill="#101425" stroke="${INK}" stroke-width="6"/><rect x="-90" y="-100" width="70" height="34" rx="8" fill="#FFF6D6" stroke="${INK}" stroke-width="5"/>${labelPill(0,150,'FLASH',P.gold,36)}</g>
     ${i16_eyeX(1250,500,1,{red:k2})}
     <path d="M400 470 L1436 500" stroke="#FFF6D6" stroke-width="10" stroke-dasharray="1100" stroke-dashoffset="${1100*(1-k)}"/>
     <path d="M1436 520 L400 530" stroke="${P.red}" stroke-width="10" stroke-dasharray="1100" stroke-dashoffset="${1100*(1-k2)}"/>
     ${AT(t,boA)?`<path d="M1440 640 L1520 760" stroke="${P.white}" stroke-width="5"/>${labelPill(1560,800,'BLOOD-RICH LAYERS',P.coral,38)}`:''}
     ${k2>.5?labelPill(860,640,'STRAIGHT BACK TO THE LENS',P.red,38):''}`; }
  const v=Math.round(2000000*ease(prog(t,poA+.5,viA+.4)));
  let hearts=''; for(let i=0;i<8;i++){const q=((g*.6+i/8)%1); hearts+=`<g transform="translate(${1300+((i*97)%300)},${820-q*600}) scale(${.12*(1-q*.4)})" opacity="${1-q}">${heart(0,0,1,0)}</g>`;}
  return `${i16_DEFS}${bgNight(g)}${i16_phone(760,470,1.7,`<rect x="-104" y="-200" width="208" height="400" fill="#0B0F22"/><rect x="-104" y="-200" width="208" height="44" fill="#FF5E5B"/><text x="-90" y="-170" font-size="22" font-weight="900" fill="#fff">KAI POSTED</text>
     ${i16_shotPhoto(0,-10,1,g)}<text x="0" y="122" text-anchor="middle" font-size="22" font-weight="900" fill="#fff">"THE MUSEUM GHOST"</text>
     <text x="0" y="170" text-anchor="middle" font-size="26" font-weight="900" fill="${P.gold}" style="font-variant-numeric:tabular-nums">${v.toLocaleString('en-US')}</text>`,0,'v')}
   ${hearts}${T(1400,300,'VIEWS',{size:70,fill:P.white,sc:pop(t,poA+.5)})}${AT(t,viA)?T(1400,470,'2,000,000',{size:120,fill:P.gold,sc:IN(t,viA)})+T(1400,570,'BY LUNCHTIME',{size:56,fill:P.white,sc:IN(t,viA+.4)}):''}
   ${person({x:1620,y:640,s:.7,t:g,who:'kai',pose:'up',mouth:'laugh',brows:'raised',blink:BL(g)})}`;
},
// ===== MINUS: the street =====
invStreet(t,d,p,g){
  const nbA=p.nobody??2.1, drA=p.drivers??5.1, cyA=p.cyclist??6.7, buA=p.bus??9.6, ciA=p.city??11.9;
  const cyx=lerp(2200,-400,prog(t,cyA,cyA+1.4)), dodge=Math.max(0,1-Math.abs(t-(cyA+.7))/.6);
  const bux=lerp(-900,2400,prog(t,buA-.6,buA+1.6)), hit=Math.max(0,1-Math.abs(t-(buA+.2))/.7);
  const carx=((t*600)%3200)-700;
  const cyc=`<g transform="translate(${cyx},720)"><circle cx="-80" cy="60" r="56" fill="none" stroke="${INK}" stroke-width="12"/><circle cx="80" cy="60" r="56" fill="none" stroke="${INK}" stroke-width="12"/><path d="M-80 60 L-20 -20 L60 -20 L80 60 M-20 -20 L0 60 L60 -20" stroke="${P.coral}" stroke-width="10" fill="none" stroke-linejoin="round"/>
     ${extra({x:0,y:-150,s:.5,t:g,head:'#C3B1FF',pose:'point'}).replace(/<ellipse cx="0" cy="300"[^>]*\/>/,'')}<path d="M100 -60 h120 M110 -20 h160 M100 20 h120" stroke="#fff" stroke-width="6" opacity=".7"/></g>`;
  const bus=`<g transform="translate(${bux},600)"><rect x="-420" y="-260" width="840" height="300" rx="30" fill="${P.gold}" stroke="${INK}" stroke-width="10"/>${[...Array(5)].map((_,i)=>`<rect x="${-380+i*150}" y="-220" width="120" height="100" rx="10" fill="#BFEFFF" stroke="${INK}" stroke-width="6"/>`).join('')}
     <circle cx="-250" cy="40" r="56" fill="#2A2A3A" stroke="${INK}" stroke-width="8"/><circle cx="250" cy="40" r="56" fill="#2A2A3A" stroke="${INK}" stroke-width="8"/><path d="M420 -200 L480 -200 L480 -120" stroke="${INK}" stroke-width="10" fill="none"/><rect x="460" y="-140" width="40" height="70" rx="8" fill="#5D6A82" stroke="${INK}" stroke-width="6"/></g>`;
  return `${i16_DEFS}${i16_bgStreet(g)}
   <g transform="translate(${carx},760)"><rect x="-150" y="-70" width="300" height="90" rx="24" fill="#7C5CFF" stroke="${INK}" stroke-width="8"/><path d="M-90 -70 L-60 -120 H60 L90 -70Z" fill="#BFEFFF" stroke="${INK}" stroke-width="7"/><circle cx="-90" cy="20" r="30" fill="${INK}"/><circle cx="90" cy="20" r="30" fill="${INK}"/></g>
   ${AT(t,buA-.6)?bus:''}
   ${i16_ghost({x:960-dodge*120,y:480-dodge*40,s:.85,t:g,legs:'walk',op:.5,rot:-dodge*12+hit*Math.sin(t*30)*14,shake:hit})}
   ${AT(t,cyA)?cyc:''}
   ${dodge>.2?T(960,260,'WHOOSH!',{size:80,fill:P.white}):''}${hit>.2?T(1100,260,'CLIP!',{size:90,fill:P.red}):''}
   ${AT(t,nbA)&&!AT(t,ciA)?labelPill(960,130,'NOBODY SEES YOU COMING',P.coral,44):''}
   ${AT(t,ciA)?T(960,150,'NOT BUILT FOR SOMEONE',{size:76,fill:P.white,sc:IN(t,ciA)})+T(960,240,"WHO ISN'T THERE",{size:76,fill:P.gold,sc:IN(t,ciA+.3)}):''}
   ${i16_pm(t,'minus','THE STREET')}`;
},
// ===== PLUS: heat camera =====
invHeatCam(t,d,p,g){
  const caA=p.cam??3.1, thA=p.there??7.6, woA=p.world??10.3, heA=p.heat??15;
  const on=IN(t,caA), sil=prog(t,thA,thA+1);
  let waves=''; if(AT(t,heA)) for(let i=0;i<3;i++){const q=((g*.7+i/3)%1); waves+=`<path d="M${900+120+q*160} ${400+i*80} q20 -20 40 0 t40 0" stroke="${P.warm}" stroke-width="7" fill="none" opacity="${1-q}"/>`;}
  const th=`<g transform="translate(1480,470) scale(.62)">${['M0 170 Q-20 230 -40 300','M0 170 Q20 230 40 300','M0 30 L0 170','M0 40 Q-48 80 -62 150','M0 40 Q48 80 62 150'].map(d=>`<path d="${d}" stroke="#FF4D5E" stroke-width="54" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#FFB03B" stroke-width="28" fill="none" stroke-linecap="round"/>`).join('')}<circle cy="-60" r="100" fill="url(#i16hot)"/></g>`;
  return `${i16_DEFS}${bgLab(g)}
   ${person({x:380,y:540,s:1,t:g,who:'osei',pose:'point',mouth:'smile',brows:'calm',blink:BL(g),look:1})}
   <g transform="translate(${380+165},${540+15})"><rect x="-20" y="-40" width="110" height="80" rx="12" fill="#3B4A78" stroke="${INK}" stroke-width="7"/><circle cx="90" r="22" fill="#101425" stroke="${INK}" stroke-width="6"/><circle cx="90" r="10" fill="${P.red}" opacity="${.5+.5*Math.sin(g*6)}"/></g>
   ${i16_ghost({x:900,y:520,s:.95,t:g,op:.35,look:-1})}${waves}
   <rect x="1150" y="190" width="660" height="520" rx="22" fill="#2A3248" stroke="${INK}" stroke-width="10"/><rect x="1175" y="215" width="610" height="470" rx="10" fill="#14081F"/>
   <g opacity="${on}"><rect x="1175" y="215" width="610" height="470" rx="10" fill="#3A1A5A"/><g opacity="${sil}">${th}</g>${T(1480,260,'HEAT CAMERA',{size:36,fill:P.warm,stroke:8})}</g>
   ${AT(t,thA)?T(1480,800,'GLOWING ORANGE',{size:64,fill:P.warm,sc:IN(t,thA)}):''}
   ${AT(t,woA)?labelPill(700,170,'IN THIS WORLD: HIDDEN ONLY FROM VISIBLE LIGHT',P.gold,32):''}
   ${AT(t,heA)?labelPill(900,880,'BODY HEAT = INFRARED LIGHT',P.warm,40):''}
   ${i16_pm(t,'plus',"DR. OSEI'S LAB")}`;
},
// ===== glass frog =====
invFrog(t,d,p,g){
  const slA=p.sleep??4.6, eyA=p.eyes??11.4, quA=p.quote??14.5;
  const sl=ease(prog(t,slA+1,slA+5));
  return `${i16_DEFS}${bgLab(g)}<rect width="1920" height="1080" fill="#000" opacity=".35"/>
   ${person({x:250,y:560,s:.9,t:g,who:'osei',pose:'point',mouth:'smile',blink:BL(g),look:1})}
   <g transform="translate(1060,${AT(t,quA)?520:470}) scale(${pop(t,0)*(AT(t,quA)?.85:1)})"><rect x="-560" y="-300" width="1120" height="600" rx="16" fill="#FFF6EA" stroke="${INK}" stroke-width="10"/><rect x="-530" y="-270" width="1060" height="540" fill="#1E5A3A"/>
    ${i16_frog(0,20,1.15,g,{sleep:sl})}${T(-500,-215,'GLASS FROG',{size:44,fill:'#CFFFD8',anchor:'start',stroke:10})}</g>
   ${AT(t,slA)&&!AT(t,eyA)?labelPill(1060,830,sl>.5?'ASLEEP: BLOOD HIDDEN IN LIVER':'AWAKE: RED BLOOD SHOWS',sl>.5?P.mint:P.coral,40):''}
   ${AT(t,eyA)&&!AT(t,quA)?`${[-92,92].map(ex=>`<circle cx="${1060+ex}" cy="${470+20-69}" r="${70+8*Math.sin(g*5)}" fill="none" stroke="${P.gold}" stroke-width="8"/>`).join('')}${labelPill(1060,830,"CAN'T HIDE ITS EYES",P.gold,44)}`:''}
   ${AT(t,quA)?`<g transform="scale(${IN(t,quA)})" transform-origin="960 130">${i16_quote(1060,130,'NATURE ALWAYS LEAVES THE EYES.',{size:62,fill:P.gold})}</g>`:''}`;
},
// ===== MINUS: Nan stops sleeping -> the trip to the museum =====
invNanWorry(t,d,p,g){
  const fcA=p.face??2.8, tsA=p.tired??4.5, qA=p.quote??8.3, ngA=p.night??11.8, buA=p.bus??16.3, drA=p.door??21, stA=p.stairs??23.6, ouA=p.out??26.5;
  if(t<ngA){
    return `${i16_DEFS}<rect width="1920" height="1080" fill="#1B1F3D"/><rect x="1180" y="150" width="440" height="340" rx="10" fill="#0B1026" stroke="#3B4A78" stroke-width="14"/><circle cx="1500" cy="240" r="40" fill="#fff4dc"/>${i16_rain(g,1190,160,420,320,20,.4)}
     <g transform="translate(300,230)"><circle r="70" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><path d="M0 0 V-46 M0 0 L30 20" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>${T(0,130,'3:00 AM',{size:40,fill:P.white,stroke:9})}</g>
     <rect y="820" width="1920" height="260" fill="#141832"/>
     ${person({x:700,y:530,s:1,t:g,who:'nan',pose:'hold',mouth:AT(t,qA)?'flat':'frown',brows:'sad',blink:0})}${i16_bed(760,800)}
     ${i16_ghost({x:1350,y:520,s:.9,t:g,op:.25,look:-1})}
     ${AT(t,fcA)&&!AT(t,qA)?labelPill(1350,250,"CAN'T SEE HIS FACE",P.coral,40):''}
     ${AT(t,tsA)&&!AT(t,qA)?['TIRED?','SAD?','FIBBING?'].map((s,i)=>`<g transform="translate(${1050+i*230},${380+(i%2)*60}) scale(${pop(t,tsA+i*.9)})">${labelPill(0,0,s,P.violet,38)}</g>`).join(''):''}
     ${AT(t,qA)?`<g transform="translate(960,190) scale(${IN(t,qA)})">${bubble(0,0,1240,130,'I RAISED YOU BY LOOKING AT YOU.',{size:54,tail:'left'})}</g>`:''}
     ${i16_pm(t,'minus','NAN STOPS SLEEPING')}`;
  }
  const out=AT(t,ouA), w=prog(t,buA+1,drA);
  const inside=AT(t,stA);
  const sc=inside?`<rect width="1920" height="1080" fill="#151226"/>${[...Array(9)].map((_,i)=>`<rect x="${300+i*140}" y="${200+i*70}" width="${1700-i*140}" height="70" fill="#24203C" stroke="#33304F" stroke-width="5"/>`).join('')}<path d="M300 120 L1560 750" stroke="#5D6A82" stroke-width="12"/>
     ${labelPill(1500,160,'SERVICE STAIRS',P.ice,40)}${person({x:lerp(500,1100,prog(t,stA,ouA)),y:lerp(60,380,prog(t,stA,ouA)),s:.8,t:g,who:'nan',pose:'hold',legs:'walk',mouth:'flat',blink:BL(g)})}`
   :`${bgNight(g)}${i16_rain(g,0,0,1920,900,90,.45)}<g transform="translate(1250,0)"><path d="M-480 330 L0 170 L480 330Z" fill="#2A2F4A" stroke="${INK}" stroke-width="8"/><rect x="-460" y="330" width="920" height="520" fill="#232842" stroke="${INK}" stroke-width="8"/>
     ${[-360,-200,-40,120,280].map(x=>`<rect x="${x}" y="360" width="60" height="460" fill="#2E3555" stroke="${INK}" stroke-width="5"/>`).join('')}${T(0,300,'CITY SCIENCE MUSEUM',{size:40,fill:P.gold,stroke:9})}
     <rect x="380" y="660" width="70" height="160" fill="${AT(t,drA)?'#FFE08A':'#3B4A78'}" stroke="${INK}" stroke-width="6"/></g>
     ${AT(t,drA)?labelPill(1630,620,'STAFF ENTRANCE',P.gold,34):''}
     ${AT(t,buA)?`<g transform="translate(${lerp(-500,200,eout(prog(t,buA,buA+1.2)))-lerp(0,900,prog(t,buA+2,buA+4))},640) scale(.6)"><rect x="-420" y="-260" width="840" height="300" rx="30" fill="#5D6A82" stroke="${INK}" stroke-width="10"/>${[...Array(5)].map((_,i)=>`<rect x="${-380+i*150}" y="-220" width="120" height="100" rx="10" fill="#FFE08A" stroke="${INK}" stroke-width="6"/>`).join('')}<circle cx="-250" cy="40" r="56" fill="#2A2A3A" stroke="${INK}" stroke-width="8"/><circle cx="250" cy="40" r="56" fill="#2A2A3A" stroke="${INK}" stroke-width="8"/>${T(0,-150,'LATE BUS',{size:60,fill:INK,stroke:0})}</g>`:''}
     ${person({x:lerp(300,1620,w),y:560,s:.75,t:g,who:'nan',pose:'hold',legs:w>0&&w<1?'walk':'stand',mouth:'flat',brows:'calm',blink:BL(g)})}
     <g transform="translate(${lerp(300,1620,w)+50},${560+75})"><rect x="-14" y="-40" width="28" height="70" rx="8" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/></g>
     ${labelPill(400,140,'THE THIRD NIGHT',P.violet,44)}`;
  return `${i16_DEFS}${sc}${out?`<rect width="1920" height="1080" fill="#000" opacity="${.85*prog(t,ouA,ouA+.3)}"/>${T(960,500,'CLICK.',{size:150,fill:P.white,sc:pop(t,ouA)})}${T(960,660,'POWER OUT',{size:80,fill:P.red,sc:pop(t,ouA+.4)})}`:''}`;
},
// ===== THE CRISIS =====
invCrash(t,d,p,g){
  const fiA=p.finds??2.75, flA=p.floor??5.3, heA=p.heart??9.1, tiA=p.tight??13.4, caA=p.call??16;
  if(t<fiA) return `${i16_DEFS}${i16_bgHall(g,{storm:1,flash:(g%3)>2.85?.6:0})}${i16_dark(.6)}${i16_ghost({x:960,y:520,s:1,t:g,op:.45,shake:1})}
     ${T(960,250,'CRASH!',{size:170,fill:P.red,sc:pop(t,0)})}${labelPill(960,880,'TWO FLOORS UP',P.ice,40)}`;
  const nan=person({x:760,y:740,s:.85,t:g,who:'nan',mouth:'o',brows:'sad',blink:BL(g),rot:-82,sweat:1}).replace(/<ellipse cx="0" cy="302"[^>]*\/>/,'');
  let br=''; for(let i=0;i<3;i++){const q=((g*.9+i/3)%1); br+=`<path d="M${560-q*40} ${700-q*60} q-20 -10 -30 -30" stroke="#BFD8FF" stroke-width="5" fill="none" opacity="${1-q}"/>`;}
  return `${i16_DEFS}${i16_bgBase(g)}${i16_dark(.45)}<ellipse cx="820" cy="760" rx="420" ry="140" fill="url(#i16spot)"/>
   ${AT(t,flA)?nan+br:''}
   ${i16_ghost({x:1180,y:520,s:1,t:g,legs:'kneel',pose:AT(t,caA)?'hold':'reach',op:.4,look:-1})}
   ${AT(t,caA)?`<g transform="translate(1250,600)" opacity=".8"><rect x="-40" y="-75" width="80" height="150" rx="14" fill="none" stroke="${i16_GH}" stroke-width="5" stroke-dasharray="12 8"/></g>
     <g transform="translate(1500,330) scale(${IN(t,caA)})"><rect x="-230" y="-60" width="460" height="120" rx="20" fill="#0B0814" stroke="${P.mint}" stroke-width="6"/><text y="-10" text-anchor="middle" font-size="34" font-weight="900" fill="${P.mint}">CALLING...</text><text y="38" text-anchor="middle" font-size="40" font-weight="900" fill="#fff">AMBULANCE</text></g>`:''}
   ${AT(t,tiA)&&!AT(t,caA)?`<g transform="translate(560,420) scale(${IN(t,tiA)})">${bubble(0,0,420,100,'my chest... tight',{size:40,tail:'left',fill:'#E8E6EF'})}</g>`:''}
   ${AT(t,heA)?i16_hudHeart(1680,120,g):''}${AT(t,heA)?labelPill(420,160,'OUT OF RHYTHM',P.red,40):''}`;
},
invMaze(t,d,p,g){
  const mzA=p.maze??3.2, f4=p.four??5.2, roA=p.rooms??6.4, liA=p.lights??7.9, alA=p.alarm??9.4;
  const lights=AT(t,liA)?1-prog(t,liA,liA+.8):1;
  return `${i16_DEFS}${i16_bgBuilding(g,{lights,alarm:AT(t,alA)?1:0})}
   ${labelPill(735,70,'10 MINUTES LATER',P.ice,40)}
   ${[0,1].map(i=>`<g transform="translate(${260+i*60},610)"><circle r="16" fill="${P.mint}" stroke="${INK}" stroke-width="4"/>${AT(t,liA)?i16_beam(10,0,180+Math.sin(g*2+i)*30+180,200,60,.8):''}</g>`).join('')}
   <g transform="translate(1100,800)"><circle r="${22+6*Math.sin(g*8)}" fill="${P.red}" stroke="${INK}" stroke-width="5"/>${T(0,-40,'NAN',{size:34,fill:P.red,stroke:8})}</g>
   ${AT(t,mzA)?T(1600,300,'A MAZE',{size:96,fill:P.gold,sc:IN(t,mzA)}):''}${AT(t,f4)?labelPill(1600,420,'4 FLOORS',P.white,46):''}
   ${AT(t,roA)?labelPill(1600,520,'HUNDREDS OF ROOMS',P.white,40):''}${AT(t,liA)?labelPill(1600,620,'EVERY LIGHT OUT',P.ice,40):''}
   ${AT(t,alA)?`${labelPill(1600,740,'FIRE ALARM',P.red,48)}${T(1600,860,'SHOUTING = USELESS',{size:48,fill:P.white,sc:IN(t,alA+2)})}`:''}
   ${AT(t,liA)?i16_hudHeart(1680,120,g):''}`;
},
invUnseen(t,d,p,g){
  const wwA=p.wrong??2.7, wsA=p.stairs??4, spA=p.sprint??6.05, shA=p.shout??7.7, swA=p.swallow??8.8, waA=p.waves??11, noA=p.nothing??12.1, tuA=p.tug??13.6;
  const spin=AT(t,tuA+1), back=prog(t,tuA+2,tuA+4);
  const gx=AT(t,spA)?lerp(200,1000,eout(prog(t,spA,spA+1.2))):-300;
  const m1=i16_medic(1350+back*150,500,.8,g,{dir:spin?-1:1,ang:spin?-8:25+Math.sin(g*1.3)*20,len:900}), m2=i16_medic(1600,500,.8,g+2,{dir:1,head:'#8D5A3B',ang:30+Math.sin(g*1.1)*20,len:800});
  const al=AT(t,swA)?1:0;
  return `${i16_DEFS}${i16_bgDino(g)}${m1.b}${m2.b}${i16_dark(.55)}${m1.l}${m2.l}
   <rect width="1920" height="1080" fill="${P.red}" opacity="${al*(Math.sin(g*8)>0?.12:0)}"/>
   ${i16_ghost({x:gx,y:520,s:1,t:g,legs:AT(t,spA)&&!AT(t,spA+1.2)?'walk':'stand',pose:AT(t,waA)&&!AT(t,tuA)?'up':(AT(t,tuA)?'reach':'down'),op:.5,look:1})}
   ${AT(t,wwA)&&!AT(t,spA)?`<path d="M1300 300 L1050 300" stroke="${P.red}" stroke-width="20" marker-end=""/><path d="M1050 270 L990 300 L1050 330Z" fill="${P.red}"/>${T(1150,240,'WRONG WAY',{size:72,fill:P.red,sc:IN(t,wwA)})}`:''}
   ${AT(t,wsA)&&!AT(t,spA)?labelPill(700,850,'TOWARD THE WRONG STAIRS',P.red,40):''}
   ${AT(t,shA)&&!AT(t,waA)?`${T(gx+150,250,'HEY!',{size:90,fill:P.white,op:AT(t,swA)?1-prog(t,swA,swA+1):1})}`:''}
   ${al&&!AT(t,tuA)?T(1500,170,'BEEP BEEP BEEP',{size:64,fill:P.red,op:.6+.4*Math.sin(g*10)}):''}
   ${AT(t,noA)&&!AT(t,tuA)?T(1450,300,'?',{size:120,fill:P.gold,sc:IN(t,noA)}):''}
   ${AT(t,tuA+1.2)?T(1300,250,'EMPTY AIR?!',{size:72,fill:P.ice,sc:IN(t,tuA+1.2)}):''}`;
},
invTorch(t,d,p,g){
  const faA=p.fade??2, hoA=p.holds??4.4, guA=p.guide??7.2;
  const f=ease(prog(t,faA,faA+1.8));
  return `${i16_DEFS}${i16_bgDino(g)}${i16_dark(.65)}
   <g transform="translate(${800+130*1.3},${520+Math.sin(g*2.4)*5*1.3})" opacity="${1-f*.85}"><rect x="-10" y="-22" width="90" height="44" rx="10" fill="${f<.5?'#3B4A78':'none'}" stroke="${f<.5?INK:i16_GH}" stroke-width="7" ${f>.3?'stroke-dasharray="12 8"':''}/>${i16_beam(80,0,0,800,190,1-f)}</g>
   ${i16_ghost({x:800,y:520,s:1.3,t:g,pose:'reach',op:.5})}
   ${AT(t,hoA)?labelPill(960,170,'ANYTHING HE HOLDS TURNS INVISIBLE',P.ice,46):''}
   ${AT(t,guA)?T(960,860,'A GUIDE NOBODY CAN FOLLOW',{size:84,fill:P.gold,sc:IN(t,guA)}):''}
   ${i16_hudHeart(1680,120,g)}`;
},
invOperator(t,d,p,g){
  const nwA=p.now??2.6, tnA=p.ten??4.4, n2A=(p.now2??5.1)+.6, diA=p.dist??6.9, s2A=p.stairs??9.7, d3A=p.doors??11.4, exA=p.exit??17.8;
  const msgs=[[nwA,'NAN NEEDS HELP NOW',P.white],[tnA,'NOT IN 10 MINUTES',P.white]];
  const route='M1000 230 H1300 L1360 330 L1300 430 H1500 L1560 530 L1500 630 H1820 V780';
  const rk=prog(t,diA,d3A+2), m=Math.round(140*(1));
  const ex=prog(t,exA,exA+2);
  return `${i16_DEFS}${card('cardDark',g)}
   ${i16_phone(400,470,1.55,`<rect x="-104" y="-200" width="208" height="400" fill="#0B1026"/><text y="-150" text-anchor="middle" font-size="20" font-weight="900" fill="${P.mint}">EMERGENCY</text><text y="-120" text-anchor="middle" font-size="20" font-weight="900" fill="#fff">OPERATOR</text>
     ${msgs.map(([a,s],i)=>AT(t,a)?`<rect x="-94" y="${-80+i*70}" width="188" height="56" rx="12" fill="#22305A"/><text y="${-46+i*70}" text-anchor="middle" font-size="${s.length>17?14:16}" font-weight="900" fill="#fff">${s}</text>`:'').join('')}
     ${AT(t,n2A)?`<text y="${120}" text-anchor="middle" font-size="${70*pop(t,n2A)}" font-weight="900" fill="${P.red}">NOW.</text>`:''}`,0,'o')}
   ${AT(t,diA)?`<g opacity="${IN(t,diA)}"><path d="${route}" stroke="#2B3560" stroke-width="26" fill="none" stroke-linejoin="round"/><path d="${route}" stroke="${P.gold}" stroke-width="12" fill="none" stroke-linejoin="round" stroke-dasharray="1800" stroke-dashoffset="${1800*(1-rk)}"/>
     <g transform="translate(1000,230)"><circle r="24" fill="${P.mint}" stroke="${INK}" stroke-width="5"/>${T(0,-40,'PARAMEDICS',{size:30,fill:P.mint,stroke:7})}</g>
     <g transform="translate(1820,780)"><circle r="${26+5*Math.sin(g*8)}" fill="${P.red}" stroke="${INK}" stroke-width="5"/>${T(-10,-44,'NAN',{size:34,fill:P.red,stroke:8})}</g>
     ${T(1240,620,'140 m',{size:120,fill:P.white,sc:IN(t,diA)})}</g>`:''}
   ${AT(t,s2A)?`${labelPill(1330,380,'STAIRS 1',P.ice,28)}${labelPill(1530,580,'STAIRS 2',P.ice,28)}`:''}
   ${AT(t,d3A)?[[1180,230],[1420,430],[1700,630]].map(([x,y],i)=>`<g transform="translate(${x},${y}) scale(${pop(t,d3A+i*.3)})"><rect x="-22" y="-36" width="44" height="72" rx="4" fill="#7A5A3A" stroke="${INK}" stroke-width="5"/></g>`).join('')+labelPill(1240,750,'3 DOORS',P.gold,36):''}
   ${AT(t,diA)?labelPill(1240,140,'IN THE PITCH DARK',P.ice,36):''}
   ${AT(t,exA)?`<g transform="translate(${1000-ex*220},${230})"><circle r="24" fill="${P.mint}" stroke="${INK}" stroke-width="5"/></g><path d="M960 300 L760 300" stroke="${P.red}" stroke-width="14"/><path d="M770 270 L720 300 L770 330Z" fill="${P.red}"/>${labelPill(760,380,'EXIT',P.red,40)}`:''}
   ${i16_hudHeart(1680,120,g)}`;
},
invRemember(t,d,p,g){
  const mlA=p.less??2.4, phA=p.photo??3.85, reA=p.red??8, liA=p.line??9.7, bkA=p.back??15.6, caA=p.cam??20.9, toA=p.torch??22.6;
  const big=1-ease(prog(t,1.6,2.6)), tx=lerp(960,1700,1-big), ty=lerp(470,120,1-big), ts=lerp(2.2,1,1-big);
  const diag=AT(t,liA), k=prog(t,liA+1,liA+3.5), k2=prog(t,bkA,bkA+2.5);
  let body;
  if(!diag) body=`${bgNight(g)}${i16_dark(.4)}${i16_ghost({x:560,y:520,s:1.2,t:g,op:.35})}
     ${AT(t,phA)?`<g transform="translate(1250,500) scale(${IN(t,phA)})" >${i16_phone(0,0,1.4,i16_shotPhoto(0,-20,1,g),-6,'r')}</g>${icon('bulb',820,250,IN(t,phA)*.8)}`:''}
     ${AT(t,reA)?T(1250,880,'RED-EYE EFFECT',{size:80,fill:P.red,sc:IN(t,reA)}):''}`;
  else body=`${card('cardDark',g)}${T(800,190,'SAME LINE',{size:84,fill:P.gold,sc:IN(t,liA)})}
     <g transform="translate(260,500)">${AT(t,toA)?`<rect x="-70" y="-26" width="120" height="52" rx="10" fill="#3B4A78" stroke="${INK}" stroke-width="6"/><rect x="40" y="-32" width="24" height="64" rx="6" fill="#FFF6D6" stroke="${INK}" stroke-width="5"/>`:AT(t,caA)?`<rect x="-80" y="-60" width="160" height="110" rx="18" fill="#3B4A78" stroke="${INK}" stroke-width="7"/><circle cx="10" r="34" fill="#101425" stroke="${INK}" stroke-width="5"/>`:`<circle r="40" fill="${P.gold}" stroke="${INK}" stroke-width="6"/>`}
       <g transform="translate(-40,-150) scale(.5)">${extra({head:'#E0B48A',t:g})}</g></g>
     <path d="M330 480 L1236 490" stroke="#FFF6D6" stroke-width="12" stroke-dasharray="1000" stroke-dashoffset="${1000*(1-k)}"/>
     <path d="M1236 510 L330 515" stroke="${P.red}" stroke-width="12" stroke-dasharray="1000" stroke-dashoffset="${1000*(1-k2)}"/>
     ${i16_eyeX(1050,500,.95,{red:k2})}
     ${k2>.6?labelPill(700,640,'STRAIGHT BACK TO THE SOURCE',P.red,40):''}
     ${AT(t,caA)?labelPill(260,700,AT(t,toA)?'FLASHLIGHT':'CAMERA FLASH',P.gold,40):''}`;
  return `${i16_DEFS}${body}${AT(t,mlA)&&!diag?T(560,880,'MAYBE LESS',{size:64,fill:P.coral,sc:IN(t,mlA)}):''}${i16_timer(tx,ty,i16_cd(g),{g,s:ts})}`;
},
invSparks(t,d,p,g){
  const beA=p.bend??3.1, loA=p.look??6.2, blA=p.blaze??8.3, stA=p.stop??11.3;
  const step=eout(prog(t,0,1.5)), bend=eout(prog(t,beA,beA+1.4)), red=AT(t,blA)?Math.min(1,prog(t,blA,blA+.4))*(.85+.15*Math.sin(g*9)):0;
  const m=i16_medic(1400,500,1,g,{dir:-1,ang:-8+(AT(t,stA)?0:Math.sin(g*1.2)*6),len:1100});
  return `${i16_DEFS}${i16_bgDino(g)}${m.b}${i16_dark(.72)}${m.l}
   ${i16_ghost({x:lerp(400,780,step),y:520+bend*40,s:1.1,t:g,op:.3,rot:bend*12,pose:'hips',red,look:1,dir:1})}
   ${red>0?`<rect width="1920" height="1080" fill="${P.red}" opacity="${.12*Math.max(0,1-prog(t,blA,blA+1))}"/>`:''}
   ${AT(t,blA)?T(960,180,'TWO RED SPARKS',{size:110,fill:P.red,sc:IN(t,blA)}):''}
   ${AT(t,beA)&&!AT(t,blA)?labelPill(780,880,'EYES LEVEL WITH THE BEAM',P.ice,40):''}
   ${AT(t,stA)?T(1380,260,'!',{size:160,fill:P.gold,sc:IN(t,stA)}):''}
   ${i16_timer(1700,120,i16_cd(g),{g})}`;
},
invFollow(t,d,p,g){
  const mvA=p.move??2.3, waA=p.wait??3.8, foA=p.follows??4.9, wkA=p.walk??6.7, stA=p.stairs??13.7, drA=p.doors??15, wdA=p.wander??16.5, ldA=p.lead??20.1;
  const sc=prog(t,wkA,d)*2600+prog(t,0,1.6)*240;
  const fol=AT(t,foA)?prog(t,foA,d)*0:0;
  const wob=AT(t,wdA)&&!AT(t,wdA+2)?Math.sin((t-wdA)*3)*14:0;
  const desc=AT(t,stA)?Math.min(1,prog(t,stA,stA+1.2))*1:0;
  let bgp=''; for(let i=0;i<10;i++){const x=((i*420-sc)%4200+4200)%4200-300; bgp+= i%3===1?`<rect x="${x}" y="300" width="180" height="500" rx="6" fill="#2A2238" stroke="#3B3456" stroke-width="10"/><circle cx="${x+150}" cy="560" r="10" fill="${P.gold}"/>`
     : i%3===2?`<path d="M${x} 800 L${x+300} 500 L${x+320} 500 L${x+20} 800Z" fill="#22203A" stroke="#3B3456" stroke-width="6"/>`:`<rect x="${x}" y="200" width="80" height="600" fill="#1A1630"/>`;}
  const gx=600-eout(prog(t,0,1.6))*120, red=.9+.1*Math.sin(g*9);
  const m1=i16_medic(1280,500,.9,g,{dir:-1,ang:3+wob,len:900}), m2=i16_medic(1560,500,.8,g+1,{dir:-1,head:'#8D5A3B',beam:0});
  const dist=Math.max(0,Math.round(140*(1-prog(t,wkA,d))));
  return `${i16_DEFS}<g transform="translate(0,${-desc*0})"><rect width="1920" height="1080" fill="#100E1E"/>${bgp}<rect y="800" width="1920" height="280" fill="#0A0912"/></g>
   ${m1.b}${m2.b}${i16_dark(.7)}${m1.l}
   ${i16_ghost({x:gx,y:520,s:1,t:g,legs:AT(t,wkA)||t<1.6?'walk':'stand',op:.3,red,look:1,dir:1,rot:8})}
   ${AT(t,mvA)&&!AT(t,wkA)?T(gx,240,AT(t,foA)?'IT FOLLOWS!':(AT(t,waA)?'WAIT...':'THE SPARKS MOVE'),{size:56,fill:P.red}):''}
   ${AT(t,stA)&&!AT(t,drA)?labelPill(960,880,'DOWN THE STAIRS',P.ice,48):''}${AT(t,drA)&&!AT(t,wdA)?labelPill(960,880,'THROUGH THE DOORS',P.ice,48):''}
   ${AT(t,wdA)&&!AT(t,ldA)?labelPill(960,880,'STEP BACK INTO THE BEAM',P.gold,44):''}
   ${AT(t,ldA)?T(960,860,'LEADING THE WAY',{size:84,fill:P.red,sc:IN(t,ldA)}):''}
   ${AT(t,wkA)?`<g transform="translate(250,120)"><rect x="-190" y="-60" width="380" height="120" rx="20" fill="#0B0814" fill-opacity=".9" stroke="${P.gold}" stroke-width="6"/><text y="-12" text-anchor="middle" font-size="28" font-weight="900" fill="${P.gold}" letter-spacing="3">TO NAN</text><text y="44" text-anchor="middle" font-size="60" font-weight="900" fill="#fff">${dist} m</text></g>`:''}
   ${i16_timer(1700,120,i16_cd(g),{g})}`;
},
invArrive(t,d,p,g){
  const oxA=p.oxy??4, moA=p.monitor??5, caA=p.calm??6.2, coA=p.corner??7.9;
  const nan=person({x:700,y:740,s:.85,t:g,who:'nan',mouth:'flat',brows:'sad',blink:1,rot:-82}).replace(/<ellipse cx="0" cy="302"[^>]*\/>/,'');
  const m1=i16_medic(980,560,.8,g,{dir:-1,pose:'hold',beam:0,rot:-14}), m2=i16_medic(420,560,.8,g+1,{dir:1,pose:'hold',head:'#8D5A3B',beam:0,rot:14});
  return `${i16_DEFS}${i16_bgBase(g)}${i16_dark(.3)}<ellipse cx="760" cy="760" rx="520" ry="200" fill="url(#i16warm)"/>${i16_beam(1500,300,150,700,160,.6)}
   ${m2.b}${nan}${m1.b}
   ${AT(t,oxA)?`<g transform="translate(${700-118},${740-28})"><ellipse rx="30" ry="22" fill="#DDF3FF" fill-opacity=".8" stroke="${INK}" stroke-width="5"/><path d="M0 22 Q40 90 140 90" stroke="#9AD1FF" stroke-width="8" fill="none"/></g>${labelPill(560,300,'OXYGEN',P.ice,40)}`:''}
   ${AT(t,moA)?`<g transform="translate(1220,520) scale(${IN(t,moA)})"><rect x="-170" y="-100" width="340" height="200" rx="16" fill="#0B1026" stroke="${INK}" stroke-width="8"/>${ecg(-150,10,300,g)}<text x="-150" y="-60" font-size="28" font-weight="900" fill="${P.mint}">HEART MONITOR</text></g>`:''}
   ${AT(t,caA)?labelPill(960,170,'CALM VOICES',P.mint,44):''}
   ${AT(t,coA)?i16_ghost({x:1700,y:520,s:.85,t:g,op:.35,shake:1,look:-1}):''}
   ${i16_timer(1700,120,i16_cd(408.31+62.56),{g,done:1})}`;
},
// ===== Nan is fine, Glint fades back in =====
invHospital(t,d,p,g){
  const seA=p.settle??2.1, suA=p.sunrise??4.4, faA=p.fade??9.4, hA=p.hands??12.9, scA=p.scarf??13.8, glA=p.glasses??14.8;
  const sun=ease(prog(t,suA,suA+4));
  let clip=''; if(AT(t,hA)) clip+=`<rect x="-120" y="100" width="240" height="90"/>`; if(AT(t,scA)) clip+=`<rect x="-50" y="10" width="170" height="75"/>`; if(AT(t,glA)) clip+=`<rect x="-120" y="-170" width="240" height="180"/>`; if(AT(t,glA+1.2)) clip+=`<rect x="-200" y="-200" width="400" height="560"/>`;
  const gO={t:g,pose:'down',mouth:AT(t,glA)?'grin':'o',brows:'raised',blink:BL(g),look:-1};
  return `${i16_DEFS}${i16_bgHosp(g,sun)}
   ${person({x:640,y:470,s:.95,t:g,who:'nan',pose:'hold',legs:'sit',mouth:AT(t,suA)?'frown':'smile',brows:AT(t,suA)?'angry':'calm',blink:BL(g)})}${i16_bed(700,760)}
   ${AT(t,suA)?`<g transform="translate(${640+62},${470+70})"><rect x="0" y="-20" width="50" height="50" rx="8" fill="#FFF6EA" stroke="${INK}" stroke-width="5"/><path d="M50 -6 q22 8 0 26" stroke="${INK}" stroke-width="5" fill="none"/></g><g transform="translate(560,180) scale(${IN(t,suA+1)})">${bubble(0,0,360,110,'THIS TEA...',{size:48,tail:'left'})}</g>`:''}
   <g transform="translate(140,420)"><rect x="-90" y="-70" width="180" height="140" rx="14" fill="#0B1026" stroke="${INK}" stroke-width="7"/>${ecg(-75,10,150,g)}</g>
   ${AT(t,seA)&&!AT(t,suA)?labelPill(600,170,'NAN IS GOING TO BE FINE',P.mint,44):''}
   ${AT(t,faA)?`${i16_ghost({x:1350,y:540,s:1,t:g,op:.4,look:-1})}<clipPath id="i16rev"><g transform="translate(1350,540)">${clip}</g></clipPath><g clip-path="url(#i16rev)">${glint({x:1350,y:540,s:1,...gO})}</g>`:''}
   ${AT(t,hA)?labelPill(1700,640,'HANDS',P.mint,36):''}${AT(t,scA)?labelPill(1700,520,'SCARF',P.mint,36):''}${AT(t,glA)?labelPill(1700,400,'GLASSES',P.gold,36):''}
   ${AT(t,faA)&&!AT(t,hA)?T(1350,180,'FADING BACK IN',{size:70,fill:P.white,sc:IN(t,faA)}):''}`;
},
// ===== THE TWIST: Grandad, 1968 =====
invTwist(t,d,p,g){
  const neA=p.never??2.1, grA=p.grand??6.4, yrA=p.y68??11.4, knA=p.knew??17.1, foA=p.found??19.1, doA=p.dots??21.3;
  if(t<grA) return `${i16_DEFS}${i16_bgHosp(g,1)}${person({x:640,y:470,s:.95,t:g,who:'nan',pose:'hold',legs:'sit',mouth:'smile',brows:'calm',blink:BL(g)})}${i16_bed(700,760)}
     ${glint({x:1350,y:540,s:1,t:g,mouth:'o',brows:'raised',blink:BL(g),look:-1})}
     ${T(960,160,"HERE'S THE STRANGE PART",{size:80,fill:P.gold,sc:pop(t,0)})}${AT(t,neA)?labelPill(640,880,'NEVER SCARED. NOT ONCE.',P.mint,40):''}`;
  const yl=prog(t,foA,foA+3);
  return `${i16_DEFS}<rect width="1920" height="1080" fill="#1E1810"/>${[...Array(9)].map((_,i)=>`<rect x="${300+i*140}" y="${200+i*70}" width="${1700-i*140}" height="70" fill="#3A2E1E" stroke="#4E3E28" stroke-width="5"/>`).join('')}<path d="M300 120 L1560 750" stroke="#6A5636" stroke-width="12"/>
   ${i16_rain(g,0,0,1920,200,20,.2)}
   ${AT(t,foA)?`${person({x:lerp(1500,1150,yl),y:lerp(560,500,yl),s:.8,t:g,who:'nan',pose:'point',mouth:'o',brows:'raised',blink:BL(g),look:-1})}${i16_beam(lerp(1500,1150,yl)+130,515,190,700,140,.9)}`:''}
   ${i16_ghost({x:640,y:330,s:.8,t:g,op:AT(t,doA)?.18:.06,halo:1,dots:1})}
   ${AT(t,doA)?`<g transform="translate(640,${330-62*.8})"><circle cx="-24" r="${36+8*Math.sin(g*5)}" fill="none" stroke="${P.gold}" stroke-width="6"/><circle cx="24" r="${36+8*Math.sin(g*5)}" fill="none" stroke="${P.gold}" stroke-width="6"/></g>${labelPill(640,560,'TWO DARK DOTS',P.gold,40)}`:''}
   <rect width="1920" height="1080" fill="#B07A3A" opacity=".28"/><rect x="20" y="20" width="1880" height="1040" fill="none" stroke="#E8D8B8" stroke-width="18" opacity=".7"/>
   ${T(330,150,'SUMMER',{size:60,fill:'#E8D8B8',sc:IN(t,yrA)})}${AT(t,yrA)?T(330,290,'1968',{size:150,fill:P.gold,sc:IN(t,yrA)}):''}
   ${T(1500,130,'HIS GRANDAD',{size:64,fill:'#E8D8B8',sc:pop(t,grA)})}${AT(t,yrA+1.5)&&!AT(t,foA)?labelPill(1500,250,'VANISHED FOR 3 DAYS',P.coral,40):''}
   ${AT(t,knA)&&!AT(t,doA)?T(960,860,'NOBODY ELSE EVER KNEW',{size:72,fill:P.white,sc:IN(t,knA)}):''}`;
},
invGlasses(t,d,p,g){
  const glA=p.glasses??3.15, eyA=p.eyes??5.8, quA=p.quote??8.85;
  const fly=eout(prog(t,glA,glA+1.4));
  const rows=['E','F P','T O Z','L P E D'];
  return `${i16_DEFS}${i16_bgHosp(g,1)}
   <g transform="translate(260,400)"><rect x="-150" y="-250" width="300" height="440" rx="14" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/>${rows.map((r,i)=>`<text y="${-150+i*95}" text-anchor="middle" font-size="${90-i*18}" font-weight="900" fill="${INK}">${r}</text>`).join('')}${icon('check',120,170,.5)}</g>
   ${labelPill(260,700,'EYE TESTS: NEVER SKIPPED',P.mint,30)}
   ${person({x:760,y:470,s:.95,t:g,who:'nan',pose:'hold',legs:'sit',mouth:'smile',brows:'calm',blink:BL(g),look:1})}${i16_bed(820,760)}
   ${glint({x:1380,y:540,s:1.05,t:g,mouth:AT(t,quA)?'smile':'o',brows:AT(t,quA)?'calm':'raised',blink:BL(g),look:-1,glint:AT(t,glA+1.4)?Math.max(0,Math.sin((t-glA)*3)):0})}
   ${AT(t,glA)&&fly<1?`<g transform="translate(${lerp(900,1380,fly)},${lerp(420,477,fly)-Math.sin(fly*Math.PI)*150}) scale(1.05)"><circle cx="-30" cy="0" r="29" fill="none" stroke="${P.goldRim}" stroke-width="10"/><circle cx="30" cy="0" r="29" fill="none" stroke="${P.goldRim}" stroke-width="10"/></g>`:''}
   ${AT(t,glA)?labelPill(1380,880,'THE GOLD GLASSES',P.gold,44):''}
   ${AT(t,eyA)&&!AT(t,quA)?T(1000,170,'SO SHE ALWAYS KNEW',{size:70,fill:P.white,sc:IN(t,eyA)})+T(1000,260,'WHERE HIS EYES WERE',{size:70,fill:P.gold,sc:IN(t,eyA+.3)}):''}
   ${AT(t,quA)?`<g transform="translate(960,200) scale(${IN(t,quA)})">${bubble(0,0,1100,130,'I ALWAYS KNOW WHERE TO LOOK.',{size:56,tail:'left'})}</g>`:''}`;
},
invAsk(t,d,p,g){
  const q=p.q??1.7, f=(Math.sin(g*1.6)+1)/2;
  return `${i16_DEFS}${bgNight(g)}${i16_fade({x:960,y:600,s:1.4,t:g,pose:'shrug',mouth:'smile',brows:'raised',blink:BL(g)},f)}
   ${person({x:420,y:600,s:.9,t:g,who:'nan',pose:'hold',mouth:'smile',blink:BL(g),look:1})}
   ${AT(t,q)?`${T(960,160,'WOULD YOU?',{size:130,fill:P.mint,sc:pop(t,q)})}${T(960,260,'BE INVISIBLE, IF NOBODY COULD SEE YOUR FACE',{size:44,fill:P.white,sc:pop(t,q+.4)})}${labelPill(1460,480,'YES',P.mint,64)}${labelPill(1460,640,'NO',P.coral,64)}`:''}`;
}
});
