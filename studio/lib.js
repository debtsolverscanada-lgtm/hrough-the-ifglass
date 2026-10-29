// ============================================================
//  Glint studio: shared drawing library (palette, rig, props)
// ============================================================
const P = {
  skyTop:'#0B1026', skyBot:'#2A1846', haze:'#5B2A6E', ground:'#120B22', far:'#1E1638', mid:'#170F2E',
  mint:'#3DF5C2', mintDark:'#1FAF8A', coral:'#FF5E5B', gold:'#FFC83D', goldRim:'#F2C14E',
  ice:'#BFEFFF', iceDeep:'#6FD3F7', steel:'#9AA7BD', steelDark:'#5D6A82',
  cream:'#FFF6EA', ink:'#120E1C', white:'#FFFFFF', red:'#FF4D5E', warm:'#FF9F43', violet:'#7C5CFF'
};
const INK = P.ink;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,k)=>a+(b-a)*k;
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const eout=t=>1-Math.pow(1-t,3);
const prog=(t,a,b)=>clamp((t-a)/(b-a));
const back=t=>{const c=1.70158,c3=c+1;return 1+c3*Math.pow(t-1,3)+c*Math.pow(t-1,2);};
const pop=(t,at,d=.35)=>{const k=prog(t,at,at+d);return k<=0?0:(k>=1?1:back(k));};
function rng(seed){ return ()=>{ seed=(seed*16807)%2147483647; return (seed-1)/2147483646; }; }

// sticker-style text: ink outline + fill
function T(x,y,str,o={}){
  const {size=72,fill=P.white,anchor='middle',weight=900,stroke=size*.22,op=1,rot=0,sc=1,ls=0}=o;
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${sc})" opacity="${op}">
    <text text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" letter-spacing="${ls}" fill="${INK}" stroke="${INK}" stroke-width="${stroke}" stroke-linejoin="round">${str}</text>
    <text text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" letter-spacing="${ls}" fill="${fill}">${str}</text></g>`;
}
const G=(x,y,s,inner,o='')=>`<g transform="translate(${x},${y}) scale(${s}) ${o}">${inner}</g>`;

// ---------------- shared defs (one per frame) ----------------
const DEFS = `<defs>
 <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.skyTop}"/><stop offset=".75" stop-color="${P.skyBot}"/><stop offset="1" stop-color="${P.haze}"/></linearGradient>
 <linearGradient id="lab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1E2A"/><stop offset="1" stop-color="#0E3340"/></linearGradient>
 <linearGradient id="room" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16203A"/><stop offset="1" stop-color="#22305A"/></linearGradient>
 <linearGradient id="future" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A0B3A"/><stop offset=".6" stop-color="#5A1E7A"/><stop offset="1" stop-color="#FF7A6B"/></linearGradient>
 <radialGradient id="micro" cx=".5" cy=".5" r=".8"><stop offset="0" stop-color="#3A1650"/><stop offset="1" stop-color="#120722"/></radialGradient>
 <radialGradient id="cardMint" cx=".5" cy=".45" r=".8"><stop offset="0" stop-color="#14524A"/><stop offset="1" stop-color="#081A22"/></radialGradient>
 <radialGradient id="cardIce" cx=".5" cy=".45" r=".8"><stop offset="0" stop-color="#1D5A80"/><stop offset="1" stop-color="#07152A"/></radialGradient>
 <radialGradient id="cardWarm" cx=".5" cy=".45" r=".8"><stop offset="0" stop-color="#6A2A3A"/><stop offset="1" stop-color="#1A0A1A"/></radialGradient>
 <radialGradient id="cardGold" cx=".5" cy=".45" r=".8"><stop offset="0" stop-color="#5A4612"/><stop offset="1" stop-color="#151006"/></radialGradient>
 <radialGradient id="cardDark" cx=".5" cy=".45" r=".8"><stop offset="0" stop-color="#26204A"/><stop offset="1" stop-color="#0A0818"/></radialGradient>
 <radialGradient id="moon"><stop offset="0" stop-color="#fff7e6"/><stop offset=".5" stop-color="#ffe1b0" stop-opacity=".5"/><stop offset="1" stop-color="#ffe1b0" stop-opacity="0"/></radialGradient>
 <radialGradient id="gGold"><stop offset="0" stop-color="${P.gold}" stop-opacity=".7"/><stop offset="1" stop-color="${P.gold}" stop-opacity="0"/></radialGradient>
 <radialGradient id="gMint"><stop offset="0" stop-color="${P.mint}" stop-opacity=".7"/><stop offset="1" stop-color="${P.mint}" stop-opacity="0"/></radialGradient>
 <radialGradient id="gIce"><stop offset="0" stop-color="${P.ice}" stop-opacity=".8"/><stop offset="1" stop-color="${P.ice}" stop-opacity="0"/></radialGradient>
 <radialGradient id="gRed"><stop offset="0" stop-color="${P.red}" stop-opacity=".8"/><stop offset="1" stop-color="${P.red}" stop-opacity="0"/></radialGradient>
 <radialGradient id="gWhite"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
 <radialGradient id="gWarm"><stop offset="0" stop-color="${P.warm}" stop-opacity=".8"/><stop offset="1" stop-color="${P.warm}" stop-opacity="0"/></radialGradient>
 <radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
 <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5D6A82"/><stop offset=".35" stop-color="#C9D3E3"/><stop offset=".6" stop-color="#8E9AB0"/><stop offset="1" stop-color="#4A5468"/></linearGradient>
 <linearGradient id="iceG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E6FAFF" stop-opacity=".85"/><stop offset="1" stop-color="#6FD3F7" stop-opacity=".55"/></linearGradient>
 <linearGradient id="trail"><stop offset="0" stop-color="${P.gold}" stop-opacity="0"/><stop offset="1" stop-color="${P.gold}" stop-opacity=".8"/></linearGradient>
</defs>`;
const VIG = `<rect width="1920" height="1080" fill="url(#vig)"/>`;

// ---------------- Glint (stickman host) ----------------
// pose: down|wave|up|point|shrug|cross|flex|hips|reach   legs: stand|walk|wobble|sit
// eyes: open|x|closed   mouth: smile|grin|o|flat|smirk|wavy|frown   tint: head colour override
function glint(o){
  const {x=0,y=0,s=1,t=0,look=0,blink=0,mouth='smile',brows='calm',pose='down',legs='stand',
         glint:gl=0,lid=0,eyes='open',tint=null,frost=0,shiver=0,rot=0,scarf=true,sweat=0,dir=1}=o;
  const head = tint || P.cream, LW=15;
  const limb = d => `<path d="${d}" stroke="${INK}" stroke-width="${LW+12}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                     <path d="${d}" stroke="${P.cream}" stroke-width="${LW}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const by = Math.sin(t*2.4)*5;
  const jx = shiver ? Math.sin(t*70)*4*shiver : 0;
  const wa = Math.sin(t*9)*22;
  const A = {
    down:['M0 40 Q-48 80 -62 150','M0 40 Q48 80 62 150'],
    wave:['M0 40 Q-48 80 -62 150',`M0 40 Q90 40 ${120+wa*.4} ${-30+wa}`],
    up:[`M0 40 Q-70 10 -100 ${-70+Math.sin(t*6)*8}`,`M0 40 Q70 10 100 ${-70+Math.sin(t*6+1)*8}`],
    point:['M0 40 Q-48 80 -62 150','M0 40 L80 40 L160 20'],
    shrug:['M0 40 Q-70 70 -110 10','M0 40 Q70 70 110 10'],
    cross:['M0 40 Q-50 95 34 86','M0 40 Q50 100 -34 74'],
    flex:['M0 40 Q-48 80 -62 150','M0 40 Q90 50 96 -26'],
    hips:['M0 40 Q-70 80 -12 118','M0 40 Q70 80 12 118'],
    reach:['M0 40 Q-60 30 -130 0','M0 40 Q60 30 130 0']
  }[pose];
  const lg = legs==='walk'?Math.sin(t*8)*20:0;
  const L = legs==='sit' ? ['M0 170 L-70 170 L-70 290','M0 170 L60 175 L60 290']
          : legs==='wobble' ? [`M0 170 Q${-40+Math.sin(t*5)*18} 230 ${-30} 300`,`M0 170 Q${40+Math.sin(t*5+2)*18} 230 ${36} 300`]
          : [`M0 170 Q-20 230 ${-40+lg} 300`,`M0 170 Q20 230 ${40-lg} 300`];
  const lx = look*10, LL=Math.max(lid,blink);
  const eye = cx => eyes==='x' ? `<path d="M${cx-12} -74 L${cx+12} -50 M${cx+12} -74 L${cx-12} -50" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`
    : eyes==='closed' ? `<path d="M${cx-14} -60 Q${cx} -52 ${cx+14} -60" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="${cx}" cy="-62" rx="17" ry="20" fill="#fff" stroke="${INK}" stroke-width="5"/>
    <circle cx="${cx+lx}" cy="-60" r="9.5" fill="${INK}"/><circle cx="${cx+lx+3}" cy="-64" r="3.2" fill="#fff"/>
    ${LL>0?`<path d="M${cx-19} -84 H${cx+19} V${-84+42*LL} H${cx-19}Z" fill="${head}"/><path d="M${cx-18} ${-84+42*LL} H${cx+18}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`:''}`;
  const M={
    smile:`<path d="M-22 -18 Q0 4 22 -18" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    grin:`<path d="M-26 -22 Q0 -20 26 -22 Q22 12 0 12 Q-22 12 -26 -22Z" fill="#3a1220" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-22 -21 H22 L20 -13 H-20Z" fill="#fff"/>`,
    o:`<ellipse cx="0" cy="-10" rx="11" ry="14" fill="#3a1220" stroke="${INK}" stroke-width="5"/>`,
    flat:`<path d="M-16 -14 H16" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`,
    smirk:`<path d="M-18 -14 Q4 -8 22 -24" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    frown:`<path d="M-20 -6 Q0 -24 20 -6" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    wavy:`<path d="M-24 -14 q6 -8 12 0 t12 0 t12 0 t12 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    teeth:`<rect x="-26" y="-26" width="52" height="24" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M-13 -26 V-2 M0 -26 V-2 M13 -26 V-2" stroke="${INK}" stroke-width="3"/>`
  };
  const bY={calm:-98,raised:-112,angry:-92,sad:-100}[brows], bR={calm:0,raised:-8,angry:16,sad:-14}[brows];
  const brow=(cx,d)=>`<g transform="translate(${cx},${bY}) rotate(${bR*d})"><rect x="-16" y="-5" width="32" height="10" rx="5" fill="${INK}"/></g>`;
  const glasses = `
    <circle cx="-30" cy="-62" r="29" fill="rgba(255,230,160,.12)" stroke="${INK}" stroke-width="13"/>
    <circle cx="30" cy="-62" r="29" fill="rgba(255,230,160,.12)" stroke="${INK}" stroke-width="13"/>
    <circle cx="-30" cy="-62" r="29" fill="none" stroke="${P.goldRim}" stroke-width="6"/>
    <circle cx="30" cy="-62" r="29" fill="none" stroke="${P.goldRim}" stroke-width="6"/>
    <path d="M-3 -64 Q0 -70 3 -64" stroke="${P.goldRim}" stroke-width="5" fill="none"/>
    <path d="M-50 -78 A22 22 0 0 1 -36 -86" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>
    ${gl>0?`<g transform="translate(46,-82) scale(${gl})"><path d="M0 -20 L5 -5 L20 0 L5 5 L0 20 L-5 5 L-20 0 L-5 -5Z" fill="#fff"/></g>`:''}`;
  const f1=Math.sin(t*5)*10, f2=Math.sin(t*5+1.2)*14;
  const SC = scarf ? `<path d="M-34 22 Q0 40 34 22 L36 40 Q0 58 -36 40Z" fill="${P.mint}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M24 38 Q60 ${44+f1} 96 ${36+f2} L100 ${58+f2} Q62 ${66+f1} 30 54Z" fill="${P.mint}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`:'';
  const FR = frost>0 ? `<g opacity="${frost}"><circle cx="0" cy="-60" r="92" fill="${P.ice}" opacity=".35"/>
    <path d="M-70 -110 l20 18 l-6 22 M60 -120 l-14 24 l10 14 M-80 -20 l26 -6 l8 18 M50 -10 l20 10" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></g>`:'';
  const SW = sweat>0 ? `<path d="M80 -110 q10 18 0 26 q-10 -8 0 -26Z" fill="${P.iceDeep}" stroke="${INK}" stroke-width="4" opacity="${sweat}"/>`:'';
  return `<g transform="translate(${x+jx},${y+by}) scale(${s*dir},${s}) rotate(${rot})">
    <ellipse cx="0" cy="${305-by}" rx="80" ry="14" fill="rgba(0,0,0,.35)"/>
    ${limb(L[0])}${limb(L[1])}${limb('M0 30 L0 170')}${limb(A[0])}${limb(A[1])}${SC}
    <g transform="rotate(${look*4})">
      <circle cx="0" cy="-60" r="92" fill="${head}" stroke="${INK}" stroke-width="10"/>
      <path d="M-60 -120 A88 88 0 0 1 10 -146" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".35"/>
      <ellipse cx="-56" cy="-26" rx="15" ry="9" fill="${P.coral}" opacity=".45"/><ellipse cx="56" cy="-26" rx="15" ry="9" fill="${P.coral}" opacity=".45"/>
      ${eye(-30)}${eye(30)}${glasses}${brow(-30,1)}${brow(30,-1)}${M[mouth]||M.smile}${FR}${SW}
    </g></g>`;
}
// generic side character (plain stick figure, different head colour)
function extra(o){
  const {x=0,y=0,s=1,t=0,head='#9AD1FF',mask=false,mouth='smile',hair=null,glasses=false,pose='down',look=0,tie=false}=o;
  const LW=13, limb=d=>`<path d="${d}" stroke="${INK}" stroke-width="${LW+10}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${P.cream}" stroke-width="${LW}" fill="none" stroke-linecap="round"/>`;
  const by=Math.sin(t*2.4+1)*4;
  const A={down:['M0 40 Q-44 80 -56 140','M0 40 Q44 80 56 140'],point:['M0 40 Q-44 80 -56 140','M0 40 L80 30 L150 10'],
           hold:['M0 40 Q-40 90 30 90','M0 40 Q40 90 60 80'],up:['M0 40 Q-60 10 -90 -60','M0 40 Q60 10 90 -60']}[pose];
  return `<g transform="translate(${x},${y+by}) scale(${s})">
    <ellipse cx="0" cy="300" rx="70" ry="12" fill="rgba(0,0,0,.3)"/>
    ${limb('M0 165 Q-18 225 -36 295')}${limb('M0 165 Q18 225 36 295')}${limb('M0 30 L0 165')}${limb(A[0])}${limb(A[1])}
    ${tie?`<path d="M0 40 L-10 60 L0 110 L10 60Z" fill="${P.red}" stroke="${INK}" stroke-width="4"/>`:''}
    <circle cx="0" cy="-55" r="82" fill="${head}" stroke="${INK}" stroke-width="9"/>
    ${hair||''}
    <circle cx="${-26+look*8}" cy="-62" r="10" fill="${INK}"/><circle cx="${26+look*8}" cy="-62" r="10" fill="${INK}"/>
    ${glasses?`<circle cx="-26" cy="-62" r="24" fill="none" stroke="${INK}" stroke-width="11"/><circle cx="26" cy="-62" r="24" fill="none" stroke="${INK}" stroke-width="11"/><circle cx="-26" cy="-62" r="24" fill="none" stroke="${P.goldRim}" stroke-width="5"/><circle cx="26" cy="-62" r="24" fill="none" stroke="${P.goldRim}" stroke-width="5"/>`:''}
    ${mask?`<path d="M-56 -36 Q0 -50 56 -36 L50 6 Q0 26 -50 6Z" fill="#DDF3FF" stroke="${INK}" stroke-width="6"/><path d="M-40 -20 H40 M-40 -6 H40" stroke="#9cc" stroke-width="3"/>`
      : mouth==='smile'?`<path d="M-18 -22 Q0 -4 18 -22" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`
      : mouth==='laugh'?`<path d="M-24 -26 H24 Q20 4 0 4 Q-20 4 -24 -26Z" fill="#3a1220" stroke="${INK}" stroke-width="5"/>`
      : `<path d="M-14 -16 H14" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`}
  </g>`;
}

// ---------------- backgrounds ----------------
function bgNight(t,cam=0){
  const r=rng(7); let st='';
  for(let i=0;i<120;i++){const x=r()*2200-140,y=r()*620,z=r()*2.4+.6,tw=.4+.6*Math.abs(Math.sin(t*2+i));st+=`<circle cx="${x-cam*.05}" cy="${y}" r="${z}" fill="#fff" opacity="${tw*.8}"/>`;}
  const r2=rng(3); let far='',mid=''; let bx=-200;
  while(bx<2300){const w=60+r2()*110,h=160+r2()*300;far+=`<rect x="${bx-cam*.2}" y="${760-h}" width="${w}" height="${h+400}" fill="${P.far}"/>`;
    for(let k=0;k<6;k++) if(r2()>.55) far+=`<rect x="${bx-cam*.2+10+r2()*(w-24)}" y="${770-h+20+r2()*(h-40)}" width="8" height="10" fill="${P.gold}" opacity=".35"/>`; bx+=w+8;}
  bx=-200; while(bx<2400){const w=90+r2()*160,h=90+r2()*200;mid+=`<rect x="${bx-cam*.45}" y="${860-h}" width="${w}" height="${h+300}" rx="6" fill="${P.mid}"/>`;bx+=w+14;}
  return `<rect width="1920" height="1080" fill="url(#sky)"/>${st}
   <circle cx="${1500-cam*.08}" cy="230" r="230" fill="url(#moon)" opacity=".55"/><circle cx="${1500-cam*.08}" cy="230" r="78" fill="#fff4dc"/>
   ${far}${mid}<rect x="0" y="900" width="1920" height="200" fill="${P.ground}"/>`;
}
function bgCard(id='cardDark',t=0){
  const r=rng(11); let d='';
  for(let i=0;i<40;i++){const x=r()*1920,y=(r()*1080 - t*(10+r()*30))%1080;d+=`<circle cx="${x}" cy="${y<0?y+1080:y}" r="${1+r()*3}" fill="#fff" opacity="${.1+r()*.25}"/>`;}
  return `<rect width="1920" height="1080" fill="url(#${id})"/>${d}`;
}
function bgLab(t){
  let panels=''; for(let i=0;i<9;i++) panels+=`<rect x="${i*220-20}" y="80" width="200" height="680" rx="10" fill="#0F2A36" stroke="#16404F" stroke-width="4"/>`;
  let lamps=''; [380,960,1540].forEach(x=>lamps+=`<path d="M${x} 0 V60" stroke="#1d3d4a" stroke-width="6"/><path d="M${x-60} 60 H${x+60} L${x+40} 90 H${x-40}Z" fill="#1d3d4a"/><ellipse cx="${x}" cy="100" rx="200" ry="40" fill="url(#gMint)" opacity=".25"/>`);
  return `<rect width="1920" height="1080" fill="url(#lab)"/>${panels}${lamps}<rect y="820" width="1920" height="260" fill="#071820"/><path d="M0 820 H1920" stroke="#1FAF8A" stroke-width="4" opacity=".4"/>`;
}
function bgMicro(t){
  const r=rng(5); let b='';
  for(let i=0;i<18;i++){const x=r()*1920,y=r()*1080,rr=30+r()*90;b+=`<circle cx="${x+Math.sin(t*.5+i)*20}" cy="${y+Math.cos(t*.4+i)*16}" r="${rr}" fill="#fff" opacity="${.03+r()*.05}"/>`;}
  return `<rect width="1920" height="1080" fill="url(#micro)"/>${b}`;
}
function bgRoom(t){
  return `<rect width="1920" height="1080" fill="url(#room)"/>
   <rect x="1180" y="160" width="520" height="380" rx="14" fill="#0B1026" stroke="#3B4A78" stroke-width="12"/><path d="M1440 160 V540 M1180 350 H1700" stroke="#3B4A78" stroke-width="8"/>
   <circle cx="1600" cy="250" r="34" fill="#fff4dc" opacity=".8"/>
   <rect y="820" width="1920" height="260" fill="#141C34"/><path d="M0 820 H1920" stroke="#3B4A78" stroke-width="4"/>
   <rect x="120" y="200" width="16" height="420" fill="#3B4A78"/><rect x="80" y="200" width="96" height="60" rx="10" fill="#22305A" stroke="#3B4A78" stroke-width="5"/>
   <path d="M90 230 h20 l8 -14 l10 28 l8 -14 h28" stroke="${P.mint}" stroke-width="4" fill="none"/>`;
}
function bgFuture(t,cam=0){
  const r=rng(21); let tw='', cars='';
  let x=-100; while(x<2100){const w=70+r()*120,h=280+r()*520,c=r()>.5?P.mint:'#FF6BD6';
    tw+=`<rect x="${x-cam*.3}" y="${900-h}" width="${w}" height="${h}" rx="${r()>.6?w/2:8}" fill="#1B0F33" stroke="#2D1A55" stroke-width="4"/>
        <rect x="${x-cam*.3+w*.45}" y="${920-h}" width="6" height="${h-60}" fill="${c}" opacity=".7"/>`;
    for(let k=0;k<5;k++) tw+=`<rect x="${x-cam*.3+10+r()*(w-30)}" y="${940-h+r()*(h-80)}" width="12" height="6" fill="${c}" opacity=".5"/>`;
    x+=w+30;}
  for(let i=0;i<5;i++){const cx=((t*(120+i*40)+i*500)%2400)-200, cy=220+i*70;
    cars+=`<g transform="translate(${cx},${cy})"><rect x="-30" y="-10" width="60" height="20" rx="10" fill="#E8E8FF" stroke="${INK}" stroke-width="4"/><circle cx="-34" cy="0" r="6" fill="${P.mint}"/><path d="M-36 0 H-120" stroke="${P.mint}" stroke-width="3" opacity=".4"/></g>`;}
  return `<rect width="1920" height="1080" fill="url(#future)"/><circle cx="960" cy="760" r="320" fill="#FFB36B" opacity=".5"/>${tw}${cars}<rect y="900" width="1920" height="180" fill="#120826"/>`;
}

// ---------------- props ----------------
const iceShard=(x,y,l,a,op=1)=>`<g transform="translate(${x},${y}) rotate(${a})" opacity="${op}"><path d="M0 0 L${l*.18} ${-l*.08} L${l} 0 L${l*.18} ${l*.08}Z" fill="#E6FAFF" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>`;
function cellShape(x,y,r,shr=0,burst=0,t=0,col='#FF8FA3'){
  if(burst>0){ let s=''; for(let i=0;i<9;i++){const a=i/9*6.283,d=r*(1+burst*1.4);s+=`<circle cx="${x+Math.cos(a)*d}" cy="${y+Math.sin(a)*d}" r="${r*.18*(1-burst*.6)}" fill="${col}" stroke="${INK}" stroke-width="4" opacity="${1-burst}"/>`;}
    return s+`<circle cx="${x}" cy="${y}" r="${r*(1-burst)}" fill="${col}" opacity="${1-burst}"/>`;}
  let d=''; const n=24;
  for(let i=0;i<=n;i++){const a=i/n*6.283,w=1-shr*.35+Math.sin(a*7+t*2)*.03+(shr*Math.sin(a*11)*.12);d+=(i?'L':'M')+(x+Math.cos(a)*r*w).toFixed(1)+' '+(y+Math.sin(a)*r*w).toFixed(1);}
  return `<path d="${d}Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><circle cx="${x+r*.15}" cy="${y-r*.1}" r="${r*.3*(1-shr*.3)}" fill="#C2457A" stroke="${INK}" stroke-width="4"/>`;
}
function thermometer(x,y,level){ // level 0..1
  const h=520, fill=h*level;
  return `<g transform="translate(${x},${y})"><rect x="-38" y="-${h}" width="76" height="${h+20}" rx="38" fill="#E8F4FF" stroke="${INK}" stroke-width="8"/>
   <rect x="-16" y="${-fill}" width="32" height="${fill+10}" rx="16" fill="${P.iceDeep}"/><circle cx="0" cy="40" r="58" fill="${P.iceDeep}" stroke="${INK}" stroke-width="8"/>
   ${[0,1,2,3,4].map(i=>`<path d="M38 ${-80-i*100} h28" stroke="${INK}" stroke-width="6"/>`).join('')}</g>`;
}
function ecg(x,y,w,t,mode='beat'){ // mode beat|flat
  let d=`M${x} ${y}`; const n=120;
  for(let i=1;i<=n;i++){const px=x+w*i/n;let py=y;
    if(mode==='beat'){const ph=((i/n*3)-t*.8)%1; const p=(ph+1)%1; if(p>.45&&p<.5)py=y-90; else if(p>=.5&&p<.55)py=y+50; else if(p>.4&&p<.45) py=y-10;}
    d+=` L${px.toFixed(1)} ${py}`;}
  return `<path d="${d}" stroke="${mode==='beat'?P.mint:P.red}" stroke-width="7" fill="none" stroke-linejoin="round"/>`;
}
function brain(x,y,s,act=1,t=0,dim=0){
  const r=rng(9); let n='';
  const pts=[];for(let i=0;i<16;i++)pts.push([-150+r()*300,-90+r()*170]);
  pts.forEach((p,i)=>{pts.slice(i+1,i+3).forEach(q=>n+=`<path d="M${p[0]} ${p[1]} L${q[0]} ${q[1]}" stroke="${P.mint}" stroke-width="3" opacity="${.25*act}"/>`);});
  pts.forEach((p,i)=>{const off= i%4===1 && dim>0; const b=act*(off?1-dim:1)*(.6+.4*Math.sin(t*4+i)); n+=`<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="${off&&dim>.5?'#555':P.mint}" opacity="${.3+b*.7}"/>`;});
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-170 0 C-200 -120 -60 -170 0 -120 C60 -170 210 -120 170 0 C210 90 80 150 0 110 C-80 150 -210 90 -170 0Z" fill="#FF9EC0" stroke="${INK}" stroke-width="9"/>
   <path d="M0 -120 V110 M-110 -60 q40 20 10 60 M110 -60 q-40 20 -10 60 M-90 60 q30 -10 50 20 M90 60 q-30 -10 -50 20" stroke="#D96B98" stroke-width="7" fill="none" stroke-linecap="round"/>${n}</g>`;
}
function clockP(x,y,r,t,stopped=false){
  const a=stopped?40:t*120, b=stopped?200:t*10;
  return `<g transform="translate(${x},${y})"><circle r="${r}" fill="#FFF6EA" stroke="${INK}" stroke-width="10"/>
   ${[...Array(12)].map((_,i)=>`<path d="M0 ${-r+12} V${-r+28}" stroke="${INK}" stroke-width="6" transform="rotate(${i*30})"/>`).join('')}
   <path d="M0 0 V${-r*.55}" stroke="${INK}" stroke-width="10" stroke-linecap="round" transform="rotate(${b})"/>
   <path d="M0 0 V${-r*.8}" stroke="${P.red}" stroke-width="6" stroke-linecap="round" transform="rotate(${a})"/><circle r="10" fill="${INK}"/></g>`;
}
function dewar(x,y,s,t,o={}){
  const {fog=1,warn=0,label='',inside=false,level=1,frostGlass=true}=o;
  const fogs=[...Array(6)].map((_,i)=>{const k=((t*.35+i/6)%1);return `<circle cx="${-60+i*24+Math.sin(t+i)*10}" cy="${-330-k*160}" r="${30+k*40}" fill="#E6FAFF" opacity="${fog*.35*(1-k)}"/>`;}).join('');
  return `<g transform="translate(${x},${y}) scale(${s})">
   <ellipse cx="0" cy="300" rx="190" ry="26" fill="rgba(0,0,0,.35)"/>
   <rect x="-160" y="-300" width="320" height="590" rx="60" fill="url(#steel)" stroke="${INK}" stroke-width="10"/>
   <rect x="-170" y="-330" width="340" height="60" rx="20" fill="#7E8AA2" stroke="${INK}" stroke-width="10"/>
   <rect x="-60" y="-360" width="120" height="40" rx="12" fill="#5D6A82" stroke="${INK}" stroke-width="8"/>
   ${inside?`<rect x="-90" y="-210" width="180" height="300" rx="30" fill="#0A2A3A" stroke="${INK}" stroke-width="8"/>
     <g transform="translate(0,-60) rotate(180) scale(.42)">${glint({t:0,mouth:'flat',eyes:'closed',tint:'#CFEFFF',frost:.8,scarf:true})}</g>
     ${frostGlass?`<rect x="-90" y="-210" width="180" height="300" rx="30" fill="url(#iceG)" opacity=".35"/>`:''}`:''}
   <rect x="110" y="-220" width="26" height="320" rx="13" fill="#2A3248" stroke="${INK}" stroke-width="5"/>
   <rect x="115" y="${100-310*level}" width="16" height="${310*level}" rx="8" fill="${level<.25?P.red:P.iceDeep}"/>
   ${label?`<rect x="-120" y="140" width="240" height="70" rx="10" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><text x="0" y="188" text-anchor="middle" font-size="34" font-weight="900" fill="${INK}">${label}</text>`:''}
   ${warn>0?`<circle cx="0" cy="-380" r="26" fill="${P.red}" stroke="${INK}" stroke-width="6" opacity="${.4+.6*Math.abs(Math.sin(t*6))}"/><circle cx="0" cy="-380" r="110" fill="url(#gRed)" opacity="${warn*Math.abs(Math.sin(t*6))}"/>`:''}
   ${fogs}</g>`;
}
function heart(x,y,s,beat=0){
  const k=1+beat*.18;
  return `<g transform="translate(${x},${y}) scale(${s*k})"><circle r="170" fill="url(#gRed)" opacity="${.3+beat*.6}"/>
   <path d="M0 60 C-140 -30 -110 -150 -40 -140 C-10 -136 0 -110 0 -96 C0 -110 10 -136 40 -140 C110 -150 140 -30 0 60Z" transform="scale(1.4)" fill="${P.red}" stroke="${INK}" stroke-width="7"/>
   <path d="M-90 -120 q-30 30 -20 70" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity=".5"/></g>`;
}
function virus(x,y,r,t,o={}){
  const {col='#9BE15D',badge='',angry=true}=o; let sp='';
  for(let i=0;i<10;i++){const a=i/10*6.283+t*.5;sp+=`<path d="M${Math.cos(a)*r} ${Math.sin(a)*r} L${Math.cos(a)*r*1.35} ${Math.sin(a)*r*1.35}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><circle cx="${Math.cos(a)*r*1.38}" cy="${Math.sin(a)*r*1.38}" r="${r*.13}" fill="${col}" stroke="${INK}" stroke-width="5"/>`;}
  return `<g transform="translate(${x},${y+Math.sin(t*3+x)*10})">${sp}<circle r="${r}" fill="${col}" stroke="${INK}" stroke-width="8"/>
   <circle cx="${-r*.3}" cy="${-r*.1}" r="${r*.13}" fill="${INK}"/><circle cx="${r*.3}" cy="${-r*.1}" r="${r*.13}" fill="${INK}"/>
   ${angry?`<path d="M${-r*.5} ${-r*.4} L${-r*.15} ${-r*.25} M${r*.5} ${-r*.4} L${r*.15} ${-r*.25}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${-r*.25} ${r*.35} Q0 ${r*.15} ${r*.25} ${r*.35}" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`:''}
   ${badge?`<rect x="${-r*.7}" y="${r*.6}" width="${r*1.4}" height="${r*.5}" rx="${r*.15}" fill="${P.gold}" stroke="${INK}" stroke-width="5"/><text y="${r*.98}" text-anchor="middle" font-size="${r*.36}" font-weight="900" fill="${INK}">${badge}</text>`:''}</g>`;
}
function paper(x,y,s,lines=4,title='',rot=0){
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-170" y="-220" width="340" height="440" rx="14" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/>
   ${title?`<text x="0" y="-150" text-anchor="middle" font-size="40" font-weight="900" fill="${INK}">${title}</text>`:''}
   ${[...Array(lines)].map((_,i)=>`<rect x="-120" y="${-100+i*55}" width="${200+((i*37)%40)}" height="16" rx="8" fill="#C9C2B8"/>`).join('')}</g>`;
}
function stamp(x,y,s,label,col=P.red,rot=-14){
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-230" y="-60" width="460" height="120" rx="14" fill="none" stroke="${col}" stroke-width="14"/><text y="26" text-anchor="middle" font-size="76" font-weight="900" fill="${col}" letter-spacing="4">${label}</text></g>`;
}
function bubble(x,y,w,h,str,o={}){
  const {size=46,fill='#FFF6EA',col=INK,tail='left'}=o;
  const tx= tail==='left'? -w/2+50 : w/2-50;
  return `<g transform="translate(${x},${y})"><path d="M${-w/2} ${-h/2} H${w/2} V${h/2} H${tx+30} L${tx} ${h/2+50} L${tx-10} ${h/2} H${-w/2}Z" fill="${fill}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   <text y="${size*.35}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${col}">${str}</text></g>`;
}
function tankRow(x,y,s,n,t,o={}){ let g=''; for(let i=0;i<n;i++) g+=dewar(x+i*260*s,y,s,t+i*.3,{fog:.6,...o}); return g; }
function door(x,y,s,open){
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-150" y="-330" width="300" height="560" fill="#FFF6EA"/><circle cx="0" cy="-60" r="${300+open*500}" fill="url(#gWhite)" opacity="${open}"/>
   <rect x="-150" y="-330" width="300" height="560" fill="none" stroke="${INK}" stroke-width="12"/>
   <g transform="translate(-150,-330) scale(${1-open*.85},1)"><rect width="300" height="560" fill="#3B4A78" stroke="${INK}" stroke-width="10"/><circle cx="260" cy="290" r="14" fill="${P.gold}" stroke="${INK}" stroke-width="5"/></g></g>`;
}
function coinStack(x,y,n,s=1){ let g=''; for(let i=0;i<n;i++) g+=`<g transform="translate(${x+(i%2)*4},${y-i*22*s})"><ellipse rx="${70*s}" ry="${20*s}" fill="${P.gold}" stroke="${INK}" stroke-width="5"/><rect x="${-70*s}" y="${-6*s}" width="${140*s}" height="${12*s}" fill="${P.gold}"/><ellipse cy="${-8*s}" rx="${70*s}" ry="${20*s}" fill="#FFD966" stroke="${INK}" stroke-width="5"/></g>`; return g; }
function frame(x,y,s,inner,rot=0,col='#C9A46A'){
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-190" y="-230" width="380" height="460" rx="10" fill="${col}" stroke="${INK}" stroke-width="10"/>
   <rect x="-160" y="-200" width="320" height="400" fill="#D9C7A3" stroke="${INK}" stroke-width="6"/><g>${inner}</g></g>`;
}
function hill(t){ return `<path d="M-50 1080 L-50 820 Q500 640 960 700 Q1500 760 1970 860 L1970 1080Z" fill="#0A0716" stroke="${INK}" stroke-width="6"/>`; }
function iceBlock(x,y,w,h,crack=0){
  return `<g transform="translate(${x},${y})"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="26" fill="url(#iceG)" stroke="${INK}" stroke-width="10"/>
   <path d="M${-w/2+30} ${-h/2+40} l40 -14 M${-w/2+30} ${-h/2+80} l90 -30" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".8"/>
   ${crack>0?`<path d="M${-w*.1} ${-h/2} l30 ${h*.2*crack} l-40 ${h*.15*crack} l50 ${h*.2*crack} l-20 ${h*.3*crack}" stroke="#fff" stroke-width="7" fill="none"/>`:''}</g>`;
}
