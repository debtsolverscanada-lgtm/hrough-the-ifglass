// episode 027 scenes (zombie outbreak) — story episode. Family-friendly: the infected are patients (pale green,
// sleepy, swaying), never gory. Palette: sickly green + emergency red.
const Z27={g:'#8CFF5A',g2:'#4FBF3A',sick:'#B4D69A',sickD:'#86A870',red:'#FF3B3B',redD:'#7A0E1C',night:'#07110C',ice:'#FFF0A8',pink:'#FF9EC4'};
// LAST BOAT countdown keyframes [global seconds, seconds left] — set from words.json so it lands on each spoken number
let Z27_KF=[[366.43,1200],[408.06,1080],[449.72,900],[468.98,600],[475.39,300],[485.45,60]];
function z27_left(gt){const K=Z27_KF;if(gt<=K[0][0])return K[0][1];for(let i=1;i<K.length;i++)if(gt<=K[i][0])return lerp(K[i-1][1],K[i][1],(gt-K[i-1][0])/(K[i][0]-K[i-1][0]));return K[K.length-1][1];}
function z27_fmt(sec){sec=Math.max(0,Math.ceil(sec));return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;}
function z27_timer(sec,g,o={}){const {x=1660,y=120,s=1,label='LAST BOAT'}=o;const c=sec<=600?Z27.red:Z27.g;const pl=1+.035*Math.sin(g*8);
  return `<g transform="translate(${x},${y}) scale(${(s*pl).toFixed(3)})"><rect x="-220" y="-80" width="440" height="160" rx="20" fill="#0A0606" fill-opacity=".92" stroke="${c}" stroke-width="7"/>
   <g transform="translate(-178,-38)"><path d="M-22 4 H22 L14 16 H-14Z" fill="${c}"/><path d="M0 4 V-18 L14 -6 H0" fill="${c}"/></g>
   <text x="14" y="-28" text-anchor="middle" font-size="32" font-weight="900" letter-spacing="4" fill="${c}">${label}</text>
   <text y="54" text-anchor="middle" font-size="90" font-weight="900" fill="#fff" style="font-variant-numeric:tabular-nums">${z27_fmt(sec)}</text></g>`;}
function z27_pm(t,kind,sub){const plus=kind==='plus',col=plus?Z27.g:Z27.red,k=eout(prog(t,2.1,2.7)),sc=lerp(1,.4,k)*pop(t,.02,.4),x=lerp(960,330,k),y=lerp(470,105,k);
  return `<rect width="1920" height="1080" fill="#030805" opacity="${(.62*(1-k)).toFixed(3)}"/><g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(3)}) rotate(${(-3*(1-k)).toFixed(2)})">${T(0,0,plus?'PLUS:':'MINUS:',{size:230,fill:col,stroke:52})}${T(0,150,sub,{size:96,fill:P.white})}</g>`;}
function z27_day(n,x,y,s=1,col=Z27.red){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-150" y="-62" width="300" height="124" rx="16" fill="#0A0606" stroke="${col}" stroke-width="8"/><rect x="-150" y="-62" width="300" height="34" rx="14" fill="${col}"/><text y="-36" text-anchor="middle" font-size="24" font-weight="900" letter-spacing="6" fill="#0A0606">OUTBREAK</text><text y="44" text-anchor="middle" font-size="64" font-weight="900" fill="#fff">DAY ${n}</text></g>`;}
function z27_bub(x,y,w,l1,l2,o={}){const {size=46,tail='left',sc=1,fill='#FFF6EA'}=o;const h=l2?size*2.7:size*1.8,tx=tail==='left'?-w/2+60:tail==='right'?w/2-60:0;
  return `<g transform="translate(${x},${y}) scale(${sc.toFixed?sc.toFixed(3):sc})"><path d="M${-w/2} ${-h/2} H${w/2} V${h/2} H${tx+30} L${tx} ${h/2+46} L${tx-14} ${h/2} H${-w/2}Z" fill="${fill}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   <text y="${l2?-size*.2:size*.35}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${INK}">${l1}</text>${l2?`<text y="${size*1.0}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${INK}">${l2}</text>`:''}</g>`;}
const z27_pill=(x,y,str,col,size,k)=>`<g transform="translate(${x},${y}) scale(${(k==null?1:k).toFixed(3)})">${labelPill(0,0,str,col,size)}</g>`;
// ---------- people ----------
// an infected patient: pale green, droopy eyelids, slow sway. No blood, no wounds.
function z27_inf(x,y,s=1,g=0,o={}){const {ph=0,top='#5A6478',col=Z27.sick,dir=1,arms='fwd',sil=0,walk=0,look=0,band=0}=o;
  const sw=Math.sin(g*1.5+ph)*5,by=Math.sin(g*3+ph)*4,lg=walk?Math.sin(g*3+ph)*16:0,ink=sil?'#020604':INK,sk=sil?'#0F1D14':col,tp=sil?'#0F1D14':top;
  const limb=(d,c)=>`<path d="${d}" stroke="${ink}" stroke-width="24" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${c}" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const A=arms==='fwd'?[`M0 40 Q60 ${60+Math.sin(g*2+ph)*8} 120 ${70+Math.sin(g*2+ph)*10}`,`M0 40 Q50 ${80+Math.sin(g*2+ph+1)*8} 100 ${100+Math.sin(g*2+ph+1)*10}`]:['M0 40 Q-30 90 -40 150','M0 40 Q30 90 40 150'];
  return `<g transform="translate(${x},${(y+by).toFixed(1)}) scale(${s*dir},${s}) rotate(${sw.toFixed(2)})">
   <ellipse cx="0" cy="300" rx="70" ry="12" fill="rgba(0,0,0,.35)"/>
   ${limb(`M0 165 Q${-14-lg} 225 ${-30-lg} 295`,sil?tp:'#3B4A5A')}${limb(`M0 165 Q${14+lg} 225 ${30+lg} 295`,sil?tp:'#3B4A5A')}
   <path d="M-46 30 Q0 20 46 30 L54 175 Q0 186 -54 175Z" fill="${tp}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/>
   ${limb(A[0],tp)}${limb(A[1],tp)}${band?`<rect x="96" y="${86+Math.sin(g*2+ph)*10}" width="30" height="16" rx="4" fill="#fff" stroke="${ink}" stroke-width="4"/>`:''}
   <g transform="rotate(${(8+look*4).toFixed(1)} 0 -50)"><circle cx="0" cy="-55" r="80" fill="${sk}" stroke="${ink}" stroke-width="9"/>
   ${sil?`<circle cx="-26" cy="-60" r="8" fill="${Z27.g}" opacity=".85"/><circle cx="26" cy="-60" r="8" fill="${Z27.g}" opacity=".85"/>`:`
   <path d="M-50 -38 q20 10 40 0 M10 -38 q20 10 40 0" stroke="${Z27.sickD}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>
   <ellipse cx="-28" cy="-60" rx="15" ry="16" fill="#F4F8E8" stroke="${INK}" stroke-width="5"/><ellipse cx="28" cy="-60" rx="15" ry="16" fill="#F4F8E8" stroke="${INK}" stroke-width="5"/>
   <circle cx="${-28+look*5}" cy="-54" r="6" fill="${INK}"/><circle cx="${28+look*5}" cy="-54" r="6" fill="${INK}"/>
   <path d="M-44 -76 H-12 V-60 H-44Z M12 -76 H44 V-60 H12Z" fill="${sk}"/><path d="M-44 -60 H-12 M12 -60 H44" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
   <ellipse cx="4" cy="-14" rx="12" ry="${(9+Math.abs(Math.sin(g*1.2+ph))*4).toFixed(1)}" fill="#2A3A22" stroke="${INK}" stroke-width="4"/>
   <path d="M-60 -120 q10 -20 30 -14 M20 -136 q16 -10 30 6" stroke="${Z27.sickD}" stroke-width="10" fill="none" stroke-linecap="round"/>`}</g></g>`;}
// a crowd of swaying patients/silhouettes along a line
function z27_crowd(g,n,x0,x1,y,s,o={}){const r=rng(o.seed||27);let c='';const tops=['#5A6478','#6A4A5A','#4A6A5A','#6A5A3A','#4A4A6A'];
  for(let i=0;i<n;i++){const x=lerp(x0,x1,(i+r()*.6)/n),yy=y+(r()-.5)*(o.jit||40);c+=z27_inf(x,yy,s*(.85+r()*.3),g,{ph:i*1.7,top:tops[i%5],sil:o.sil,dir:o.dir||(r()>.5?1:-1),arms:r()>.4?'fwd':'down',walk:o.walk,look:o.look||0});}
  return c;}
// a flickering emergency lamp: wash colour over the scene
function z27_wash(g,col=Z27.red,amt=.28,seed=0){const f=.6+.4*Math.abs(Math.sin(g*2.3+seed))*(Math.sin(g*17+seed)>-.85?1:.2);return `<rect width="1920" height="1080" fill="${col}" opacity="${(amt*f).toFixed(3)}" style="mix-blend-mode:screen"/>`;}
function z27_lamp(x,y,g,col=Z27.red,s=1){const f=Math.sin(g*17)>-.85?1:.25;return `<g transform="translate(${x},${y}) scale(${s})"><circle r="300" fill="${col===Z27.red?'url(#gRed)':'url(#gMint)'}" opacity="${(.55*f).toFixed(2)}"/><path d="M0 0 V600" stroke="${INK}" stroke-width="22"/><path d="M0 0 V600" stroke="#2A2E36" stroke-width="12"/><rect x="-46" y="-40" width="92" height="64" rx="20" fill="${col}" stroke="${INK}" stroke-width="8" opacity="${(.5+.5*f).toFixed(2)}"/></g>`;}
function z27_cough(x,y,g,a=1,s=1){if(a<=0)return '';let c='';for(let i=0;i<6;i++){const k=((g*.9+i/6)%1);c+=`<circle cx="${(x+k*180*s).toFixed(0)}" cy="${(y-k*30*s+Math.sin(i*2)*20).toFixed(0)}" r="${((14+k*40)*Math.abs(s)).toFixed(0)}" fill="${Z27.g}" opacity="${(a*.45*(1-k)).toFixed(2)}"/>`;}return c;}
function z27_notes(x,y,g,a=1,col=Z27.pink){if(a<=0)return '';let n='';for(let i=0;i<6;i++){const k=((g*.5+i/6)%1);const nx=x+Math.sin(i*2.1+g)*60+k*260*(i%2?1:-1),ny=y-k*320;n+=`<g transform="translate(${nx.toFixed(0)},${ny.toFixed(0)}) rotate(${(i*20-40)})" opacity="${(a*(1-k)).toFixed(2)}"><ellipse rx="20" ry="15" fill="${col}" stroke="${INK}" stroke-width="5"/><path d="M18 0 V-64 L46 -50" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;}return n;}
function z27_heart(x,y,s,g,weak=1){const b=1+.08*Math.max(0,Math.sin(g*(weak?4:7)));return `<g transform="translate(${x},${y}) scale(${(s*b).toFixed(3)})"><path d="M0 40 C-80 -10 -60 -80 0 -40 C60 -80 80 -10 0 40Z" fill="${P.red}" stroke="${INK}" stroke-width="8"/><path d="M-40 -6 h18 l10 -20 l14 40 l10 -20 h28" stroke="#fff" stroke-width="7" fill="none" stroke-linejoin="round"/></g>`;}
function z27_tin(x,y,s=1,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-60" y="-40" width="120" height="80" rx="14" fill="#E0A040" stroke="${INK}" stroke-width="6"/><rect x="-60" y="-40" width="120" height="22" rx="10" fill="#C9852A" stroke="${INK}" stroke-width="5"/><text y="22" text-anchor="middle" font-size="20" font-weight="900" fill="${INK}">FLAPJACK</text></g>`;}
function z27_beans(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-30" y="-40" width="60" height="80" rx="8" fill="#3D7BFF" stroke="${INK}" stroke-width="5"/><rect x="-30" y="-14" width="60" height="30" fill="#FF7A3A" stroke="${INK}" stroke-width="4"/><text y="8" text-anchor="middle" font-size="14" font-weight="900" fill="#fff">BEANS</text></g>`;}
function z27_pills(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-28" y="-44" width="56" height="88" rx="10" fill="#F4F6FA" stroke="${INK}" stroke-width="6"/><rect x="-32" y="-56" width="64" height="22" rx="6" fill="${P.coral}" stroke="${INK}" stroke-width="5"/><path d="M-12 0 h24 M0 -12 v24" stroke="${P.red}" stroke-width="7"/></g>`;}
// ---------- sets ----------
const Z27_DEF=`<defs><linearGradient id="z27sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#030A07"/><stop offset=".7" stop-color="#0E2A1A"/><stop offset="1" stop-color="#1E4A2A"/></linearGradient>
 <linearGradient id="z27dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#150A1E"/><stop offset=".6" stop-color="#4A1A2A"/><stop offset="1" stop-color="#C8503A"/></linearGradient>
 <linearGradient id="z27day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FB6E8"/><stop offset="1" stop-color="#D8F0FF"/></linearGradient>
 <linearGradient id="z27water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A4A5A"/><stop offset="1" stop-color="#061820"/></linearGradient>
 <radialGradient id="z27g"><stop offset="0" stop-color="${Z27.g}" stop-opacity=".75"/><stop offset="1" stop-color="${Z27.g}" stop-opacity="0"/></radialGradient></defs>`;
function z27_skyline(g,o={}){const {sky='z27sky',seed=27,fires=0}=o;const r=rng(seed);let s=`${Z27_DEF}<rect width="1920" height="1080" fill="url(#${sky})"/>`;let x=-40;
  while(x<1960){const w=90+r()*150,h=220+r()*420;s+=`<rect x="${x.toFixed(0)}" y="${(840-h).toFixed(0)}" width="${w.toFixed(0)}" height="${(h+300).toFixed(0)}" fill="#0C1A12"/>`;
    for(let k=0;k<7;k++)if(r()>.45){const on=Math.sin(g*.7+k+x)>-.6;s+=`<rect x="${(x+8+r()*(w-26)).toFixed(0)}" y="${(850-h+20+r()*(h-80)).toFixed(0)}" width="12" height="14" fill="${k%3?P.gold:Z27.g}" opacity="${on?.55:.12}"/>`;}x+=w+10;}
  if(fires)s+=`<circle cx="1500" cy="700" r="260" fill="url(#gRed)" opacity="${(.35+.1*Math.sin(g*3)).toFixed(2)}"/>`;
  return s;}
function z27_street(g,o={}){return `${z27_skyline(g,o)}<rect y="840" width="1920" height="240" fill="#141A18"/><path d="M0 840 H1920" stroke="${INK}" stroke-width="6"/>${[...Array(10)].map((_,i)=>`<rect x="${i*220+40}" y="950" width="120" height="14" fill="#C9C26A" opacity=".5"/>`).join('')}`;}
function z27_fountain(x,y,s,g,o={}){const {spray=1}=o;let d='';for(let i=0;i<8;i++){const k=((g*1.2+i/8)%1),a=(i/8-.5)*2;d+=`<circle cx="${(a*160*k).toFixed(0)}" cy="${(-180+k*k*190-(1-k)*k*160).toFixed(0)}" r="${(10-k*4).toFixed(0)}" fill="#BFEFFF" opacity="${(spray*(1-k)).toFixed(2)}"/>`;}
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="300" ry="70" fill="#5A6478" stroke="${INK}" stroke-width="9"/><ellipse cx="0" cy="-8" rx="262" ry="52" fill="#2E7A9A"/><path d="M-230 -8 q40 -12 80 0 t80 0 t80 0 t80 0 t80 0" stroke="#BFEFFF" stroke-width="5" fill="none" opacity=".6"/><rect x="-26" y="-170" width="52" height="160" fill="#7A8498" stroke="${INK}" stroke-width="7"/><ellipse cx="0" cy="-172" rx="90" ry="22" fill="#7A8498" stroke="${INK}" stroke-width="7"/>${d}</g>`;}
function z27_bench(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-190" y="-120" width="380" height="30" rx="8" fill="#8A5A3A" stroke="${INK}" stroke-width="6"/><rect x="-200" y="-50" width="400" height="30" rx="8" fill="#8A5A3A" stroke="${INK}" stroke-width="6"/><path d="M-170 -20 V40 M170 -20 V40 M-170 -90 V-50 M170 -90 V-50" stroke="${INK}" stroke-width="12"/></g>`;}
function z27_van(x,y,s,g,o={}){const {on=0,dir=1,kai=0}=o;const b=on?Math.sin(g*14)*2:0;
  return `<g transform="translate(${x},${(y+b).toFixed(1)}) scale(${s*dir},${s})">${on?`<circle cx="-60" cy="-200" r="300" fill="url(#gGold)" opacity=".35"/>`:''}
   <rect x="-300" y="-300" width="440" height="290" rx="24" fill="#FFF6EA" stroke="${INK}" stroke-width="9"/><path d="M140 -220 H230 L290 -120 V-10 H140Z" fill="#FFF6EA" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
   <path d="M160 -200 H226 L270 -126 H160Z" fill="#9AD1FF" stroke="${INK}" stroke-width="6"/>${kai?`<circle cx="200" cy="-150" r="30" fill="#C68B59" stroke="${INK}" stroke-width="6"/><path d="M174 -170 q26 -24 54 0" fill="#2A1A12" stroke="${INK}" stroke-width="5"/>`:''}
   <path d="M-300 -110 H290" stroke="${Z27.pink}" stroke-width="30"/><path d="M-300 -110 q40 -26 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#fff" stroke-width="8" fill="none"/>
   <rect x="-250" y="-260" width="230" height="110" rx="14" fill="#2A3248" stroke="${INK}" stroke-width="6"/>
   <g transform="translate(-80,-340)"><path d="M-40 0 L0 -110 L40 0Z" fill="#E8C07A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><circle cy="-120" r="44" fill="${Z27.pink}" stroke="${INK}" stroke-width="7"/><circle cx="-14" cy="-138" r="8" fill="#fff" opacity=".7"/></g>
   <rect x="80" y="-340" width="80" height="44" rx="10" fill="#5D6A82" stroke="${INK}" stroke-width="6"/>
   <circle cx="-190" cy="0" r="52" fill="#22202E" stroke="${INK}" stroke-width="8"/><circle cx="190" cy="0" r="52" fill="#22202E" stroke="${INK}" stroke-width="8"/><circle cx="-190" cy="0" r="18" fill="#9AA7BD"/><circle cx="190" cy="0" r="18" fill="#9AA7BD"/>
   <text x="-140" y="-178" text-anchor="middle" font-size="40" font-weight="900" fill="${Z27.pink}" transform="scale(${dir},1)" >${dir>0?'ICES':''}</text></g>`;}
function z27_bins(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})">${[0,140].map(dx=>`<rect x="${dx-60}" y="-170" width="120" height="170" rx="10" fill="#2E6A3E" stroke="${INK}" stroke-width="7"/><rect x="${dx-68}" y="-190" width="136" height="30" rx="8" fill="#3E8A4E" stroke="${INK}" stroke-width="7"/>`).join('')}</g>`;}
function z27_square(g,o={}){const {lamp=1,fountain=1,crowd=1,n=18,sil=0,wash=1,bench=1}=o;
  let s=z27_skyline(g,{seed:31});
  s+=`<rect x="0" y="380" width="1920" height="460" fill="#1A2620"/>${[...Array(8)].map((_,i)=>`<path d="M${60+i*240} 840 V560 Q${150+i*240} 470 ${240+i*240} 560 V840" fill="#0B140F" stroke="#26362C" stroke-width="8"/>`).join('')}
   <rect x="0" y="360" width="1920" height="34" fill="#26362C"/><rect y="820" width="1920" height="260" fill="#2A302C"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="6"/>
   ${[...Array(12)].map((_,i)=>`<path d="M${i*170} 820 L${i*170-120} 1080" stroke="#3A403C" stroke-width="5"/>`).join('')}`;
  if(lamp)s+=z27_lamp(1500,300,g);
  if(crowd)s+=z27_crowd(g,n,180,1760,560,.62,{sil,seed:o.seed||9});
  if(fountain)s+=z27_fountain(o.fx||760,880,.9,g);
  if(bench)s+=z27_bench(o.bx||300,980,.8);
  if(wash)s+=z27_wash(g,Z27.red,.22);
  return s;}
function z27_museum(g){let s=`<rect width="1920" height="1080" fill="#0E1A16"/><rect y="820" width="1920" height="260" fill="#16241E"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="6"/>`;
  [140,1780].forEach(x=>s+=`<rect x="${x-50}" y="0" width="100" height="820" fill="#16302A" stroke="${INK}" stroke-width="6"/>`);
  [520,1400].forEach((x,i)=>s+=`<path d="M${x-40} 0 L${x-240} 820 H${x+240} L${x+40} 0Z" fill="#E8FFE0" opacity="${(.05+.02*Math.sin(g*2+i)).toFixed(3)}"/>`);return s;}
function z27_ant(x,y,s=1,g=0,o={}){const {stalk=0,bite=0,rot=0,walk=1}=o;const lg=walk?Math.sin(g*14)*10:0;
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">${[-30,0,30].map((dx,i)=>`<path d="M${dx} 6 L${dx-20+(i%2?lg:-lg)} 46 M${dx} 6 L${dx+20+(i%2?-lg:lg)} -34" stroke="${INK}" stroke-width="6" stroke-linecap="round" fill="none"/>`).join('')}
   <ellipse cx="-60" cy="0" rx="36" ry="26" fill="#3A2418" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="0" rx="24" ry="16" fill="#4A2E1E" stroke="${INK}" stroke-width="5"/><circle cx="44" cy="-6" r="22" fill="#4A2E1E" stroke="${INK}" stroke-width="5"/>
   <path d="M54 -24 Q70 -60 92 -56 M44 -26 Q50 -64 70 -70" stroke="${INK}" stroke-width="4" fill="none"/><circle cx="52" cy="-10" r="5" fill="#fff"/>
   <path d="M62 6 L${80+bite*6} ${bite?0:14} M62 6 L${80+bite*6} ${bite?12:-2}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
   ${stalk>0?`<path d="M40 -26 Q30 ${-26-stalk*90} ${44} ${-26-stalk*170}" stroke="#D8C89A" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="44" cy="${-26-stalk*170}" r="${(4+stalk*12).toFixed(0)}" fill="#E8D8A0" stroke="${INK}" stroke-width="4"/>`:''}</g>`;}
function z27_case(x,y,s,g){let a='';for(let i=0;i<6;i++){const lx=-200+i*80;a+=`<path d="M${lx} 40 Q${lx+30} -40 ${lx+60} 20" fill="#3E8A4E" stroke="${INK}" stroke-width="4"/>${z27_ant(lx+20,10,.35,g,{stalk:1,bite:1,rot:-30,walk:0})}`;}
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-300" y="-40" width="600" height="300" fill="#2A1E18" stroke="${INK}" stroke-width="9"/><rect x="-280" y="-230" width="560" height="200" fill="#BFEFFF" fill-opacity=".12" stroke="#BFEFFF" stroke-width="6"/>${`<g transform="translate(0,-110)">${a}</g>`}<path d="M-240 -210 L-180 -60" stroke="#fff" stroke-width="8" opacity=".35"/><rect x="-120" y="40" width="240" height="60" rx="8" fill="#E8E2D6" stroke="${INK}" stroke-width="5"/><text y="80" text-anchor="middle" font-size="26" font-weight="900" fill="${INK}">ZOMBIE ANTS</text></g>`;}
function z27_radio(x,y,s,g,on=1){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-120 -120 L80 -230" stroke="${INK}" stroke-width="8"/><rect x="-200" y="-120" width="400" height="230" rx="28" fill="#8A5A3A" stroke="${INK}" stroke-width="9"/><circle cx="-90" cy="0" r="72" fill="#3A2A22" stroke="${INK}" stroke-width="7"/>${[...Array(5)].map((_,i)=>`<path d="M-140 ${-40+i*20} H-40" stroke="#5A4A3A" stroke-width="6"/>`).join('')}<rect x="10" y="-60" width="160" height="60" rx="8" fill="${on?'#FFD36A':'#5A4A3A'}" stroke="${INK}" stroke-width="5"/><path d="M${30+((g*40)%120)} -60 V0" stroke="${P.red}" stroke-width="5"/><circle cx="50" cy="60" r="22" fill="#C9A46A" stroke="${INK}" stroke-width="6"/><circle cx="130" cy="60" r="22" fill="#C9A46A" stroke="${INK}" stroke-width="6"/>${on?z27_w(220,-20,g):''}</g>`;}
function z27_w(x,y,g){let o='';for(let i=0;i<3;i++){const k=((g*1.4+i/3)%1),r=30+k*80;o+=`<path d="M${x+r*.4} ${y-r} Q${x+r*1.2} ${y} ${x+r*.4} ${y+r}" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity="${(1-k).toFixed(2)}"/>`;}return o;}
function z27_phone(x,y,s,inner='',rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-120" y="-210" width="240" height="420" rx="32" fill="#1A1A26" stroke="${INK}" stroke-width="9"/><rect x="-100" y="-178" width="200" height="350" rx="14" fill="#0E1830"/>${inner}<rect x="-30" y="-196" width="60" height="8" rx="4" fill="#333"/></g>`;}
function z27_laugh(x,y,r){return `<g transform="translate(${x},${y})"><circle r="${r}" fill="#FFD84D" stroke="${INK}" stroke-width="3"/><path d="M${-r*.5} ${-r*.2} q${r*.2} ${-r*.3} ${r*.35} 0 M${r*.15} ${-r*.2} q${r*.2} ${-r*.3} ${r*.35} 0" stroke="${INK}" stroke-width="3" fill="none"/><path d="M${-r*.55} ${r*.05} H${r*.55} Q${r*.45} ${r*.65} 0 ${r*.65} Q${-r*.45} ${r*.65} ${-r*.55} ${r*.05}Z" fill="#3a1220"/><path d="M${-r*.9} ${-r*.1} q-6 14 0 22 M${r*.9} ${-r*.1} q6 14 0 22" stroke="#6FD3F7" stroke-width="5" fill="none"/></g>`;}
function z27_flat(g,o={}){const {tape=0,oven=1}=o;let s=`<rect width="1920" height="1080" fill="#3A2E4A"/><rect y="560" width="1920" height="260" fill="#4A3A5A"/>`;
  for(let i=1;i<24;i++)s+=`<path d="M${i*80} 560 V820" stroke="#000" stroke-opacity=".12" stroke-width="3"/>`;
  s+=`<rect y="820" width="1920" height="260" fill="#2A2034"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="6"/>
   <rect x="180" y="150" width="380" height="300" fill="#08140E"/>${z27_crowd(g,3,220,520,300,.28,{sil:1,seed:4})}<rect x="180" y="150" width="380" height="300" fill="${Z27.g}" opacity=".06"/>
   <rect x="180" y="150" width="380" height="300" fill="none" stroke="#E8E2D6" stroke-width="16"/><path d="M370 150 V450 M180 300 H560" stroke="#E8E2D6" stroke-width="10"/>
   ${tape?`<path d="M190 160 L550 440 M550 160 L190 440" stroke="#E8D27A" stroke-width="${(26*tape).toFixed(0)}" opacity=".95"/>`:''}`;
  if(oven)s+=`<circle cx="1600" cy="640" r="${(260+Math.sin(g*3)*12).toFixed(0)}" fill="url(#gWarm)" opacity=".45"/><rect x="1440" y="500" width="320" height="320" rx="14" fill="#E8E2D6" stroke="${INK}" stroke-width="9"/><rect x="1475" y="590" width="250" height="180" rx="12" fill="#FF9F43" stroke="${INK}" stroke-width="7"/><rect x="1500" y="612" width="200" height="136" rx="8" fill="#FFC86A" opacity="${(.6+.3*Math.sin(g*4)).toFixed(2)}"/>`;
  s+=`<rect x="1000" y="180" width="160" height="400" rx="10" fill="#5A4A6A" stroke="${INK}" stroke-width="8"/><circle cx="1130" cy="390" r="12" fill="${P.gold}" stroke="${INK}" stroke-width="4"/>`;
  return s;}
function z27_board(x,y,s,inner){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-560" y="-330" width="1120" height="620" rx="16" fill="#F4F6FA" stroke="${INK}" stroke-width="12"/><rect x="-560" y="-330" width="1120" height="620" rx="16" fill="none" stroke="#9AA7BD" stroke-width="5" transform="translate(0,0) scale(.97)"/><path d="M-300 290 L-340 420 M300 290 L340 420" stroke="${INK}" stroke-width="14"/>${inner}</g>`;}
function z27_harbour(g,o={}){const {boat=1,ramp=0,dusk=1,sx=1200,dock=760}=o;let w='';for(let i=0;i<8;i++){const y=840+i*30;w+=`<path d="M0 ${y} ${[...Array(25)].map((_,j)=>`Q${j*80+40} ${y+Math.sin(g*2+j+i)*8} ${j*80+80} ${y}`).join(' ')}" stroke="#4A8AA0" stroke-width="4" fill="none" opacity=".5"/>`;}
  let s=`${Z27_DEF}<rect width="1920" height="1080" fill="url(#${dusk?'z27dusk':'z27day'})"/><circle cx="1600" cy="640" r="300" fill="url(#gWarm)" opacity="${dusk?.6:.3}"/><rect y="800" width="1920" height="280" fill="url(#z27water)"/>${w}`;
  if(boat){const bob=Math.sin(g*1.4)*6;s+=`<g transform="translate(${sx},${(780+bob).toFixed(1)})"><path d="M-480 0 H520 L440 120 H-420Z" fill="#F4F6FA" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><path d="M-470 40 H505" stroke="${P.red}" stroke-width="18"/><rect x="-300" y="-180" width="560" height="180" rx="16" fill="#E8EEF4" stroke="${INK}" stroke-width="9"/>${[...Array(6)].map((_,i)=>`<circle cx="${-240+i*90}" cy="-100" r="24" fill="#FFD36A" stroke="${INK}" stroke-width="6"/>`).join('')}<rect x="60" y="-320" width="70" height="150" fill="#2A3248" stroke="${INK}" stroke-width="8"/><rect x="60" y="-320" width="70" height="30" fill="${P.red}"/>
    <g transform="translate(-480,0) rotate(${(-ramp*28).toFixed(1)})"><rect x="-260" y="-12" width="260" height="24" rx="6" fill="#9AA7BD" stroke="${INK}" stroke-width="7"/></g></g>`;}
  s+=`<rect x="0" y="760" width="${dock}" height="70" fill="#5A4A3A" stroke="${INK}" stroke-width="7"/>${[...Array(Math.ceil(dock/150))].map((_,i)=>`<rect x="${40+i*150}" y="830" width="26" height="160" fill="#3A2A1E" stroke="${INK}" stroke-width="5"/>`).join('')}`;
  return s;}
function z27_canal(g,o={}){let w='';for(let i=0;i<6;i++){const y=880+i*34;w+=`<path d="M0 ${y} ${[...Array(25)].map((_,j)=>`Q${j*80+40} ${y+Math.sin(g*2+j+i)*7} ${j*80+80} ${y}`).join(' ')}" stroke="#6FD3F7" stroke-width="4" fill="none" opacity=".4"/>`;}
  return `${z27_skyline(g,{seed:44})}<rect y="700" width="1920" height="130" fill="#3A3A3A"/><path d="M0 700 H1920" stroke="${INK}" stroke-width="6"/><rect y="830" width="1920" height="250" fill="url(#z27water)"/><path d="M0 830 H1920" stroke="#9AA7BD" stroke-width="12"/>${w}
   ${[...Array(9)].map((_,i)=>`<rect x="${i*230}" y="560" width="14" height="140" fill="#2A302C"/><circle cx="${i*230+7}" cy="556" r="16" fill="${P.gold}" opacity=".6"/>`).join('')}`;}
function z27_shed(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-300" y="-320" width="600" height="320" fill="#7A5A3A" stroke="${INK}" stroke-width="9"/>${[...Array(9)].map((_,i)=>`<path d="M${-300+i*66} -320 V0" stroke="#5A3E26" stroke-width="5"/>`).join('')}<path d="M-340 -320 L0 -470 L340 -320Z" fill="#4A3A2A" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><rect x="60" y="-250" width="170" height="250" fill="#5A3E26" stroke="${INK}" stroke-width="7"/><rect x="-230" y="-240" width="200" height="140" fill="#FFD36A" stroke="${INK}" stroke-width="7"/><path d="M-130 -240 V-100 M-230 -170 H-30" stroke="${INK}" stroke-width="6"/></g>`;}
function z27_guitar(x,y,s,g){return `<g transform="translate(${x},${y}) rotate(-30) scale(${s})"><rect x="40" y="-14" width="200" height="28" fill="#5A3A22" stroke="${INK}" stroke-width="6"/><circle cx="-30" cy="0" r="70" fill="#D9883A" stroke="${INK}" stroke-width="7"/><circle cx="40" cy="0" r="50" fill="#D9883A" stroke="${INK}" stroke-width="7"/><circle cx="0" cy="0" r="18" fill="${INK}"/><path d="M-60 -6 H240 M-60 6 H240" stroke="#eee" stroke-width="2"/></g>`;}
function z27_map(x,y,s,g,k=1,o={}){const r=rng(5);const cities=[[-420,-40],[-380,100],[-80,140],[60,-60],[200,40],[340,-80],[420,30],[300,150],[-200,-120],[100,180],[460,-120]];let d='';
  cities.forEach(([cx,cy],i)=>{const kk=clamp(k*1.6-i*.05);d+=`<circle cx="${cx}" cy="${cy}" r="${(10+kk*60).toFixed(0)}" fill="${Z27.red}" opacity="${(.25+.45*kk).toFixed(2)}"/><circle cx="${cx}" cy="${cy}" r="10" fill="${Z27.red}" stroke="${INK}" stroke-width="3"/>`;});
  const safe=o.safe?`<circle cx="-230" cy="-150" r="${(64+Math.sin(g*3)*6).toFixed(0)}" fill="none" stroke="${Z27.g}" stroke-width="10"/><path d="M-290 -120 L-260 -180 L-230 -140 L-200 -190 L-170 -120Z" fill="#E8EEF4" stroke="${INK}" stroke-width="5"/>`:'';
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-520 -170 L-300 -200 L60 -190 L300 -170 L470 -210 L540 -150 L500 -60 L460 40 L360 120 L300 210 L240 180 L60 180 L-100 220 L-220 160 L-400 120 L-500 40 Z" fill="#2A4A3A" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>${d}${safe}</g>`;}
function z27_hosp(x,y,s,g){const on=Math.sin(g*8)>0;return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-420" y="-460" width="840" height="460" fill="#E8EEF4" stroke="${INK}" stroke-width="10"/>${[...Array(4)].map((_,i)=>[...Array(7)].map((_,j)=>`<rect x="${-380+j*110}" y="${-420+i*95}" width="70" height="60" fill="#9AD1FF" stroke="${INK}" stroke-width="5"/>`).join('')).join('')}<rect x="-90" y="-520" width="180" height="90" rx="12" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="-18" y="-510" width="36" height="70" fill="${P.red}"/><rect x="-44" y="-492" width="88" height="34" fill="${P.red}"/><circle cx="380" cy="-480" r="${on?30:18}" fill="#3D7BFF" opacity=".8"/></g>`;}
function z27_doc(x,y,s,g,o={}){return extra({x,y,s,t:g,head:'#E6B98E',mask:true,pose:o.pose||'down'})+`<g transform="translate(${x},${y+Math.sin(g*2.4+1)*4}) scale(${s})"><path d="M-46 30 L46 30 L60 165 L-60 165Z" fill="#5FD3B8" stroke="${INK}" stroke-width="6"/><path d="M-80 -120 Q0 -160 80 -120 L70 -100 Q0 -130 -70 -100Z" fill="#5FD3B8" stroke="${INK}" stroke-width="6"/></g>`;}
function z27_tv(x,y,s,inner){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-460" y="-280" width="920" height="560" rx="24" fill="#1A1A26" stroke="${INK}" stroke-width="12"/><rect x="-430" y="-250" width="860" height="500" rx="10" fill="#0E1830"/>${inner}<path d="M-100 280 L-160 360 M100 280 L160 360" stroke="${INK}" stroke-width="14"/></g>`;}
const z27_nan=o=>person({...o,who:'nan'}), z27_kai=o=>person({...o,who:'kai'}), z27_osei=o=>person({...o,who:'osei'});

Object.assign(SHOTS,{
// 1. cold open: the threat
zHook(t,d,p,g){
  const run=AT(t,p.run??4.2),heart=AT(t,p.heart??5.7);
  const z=lerp(1,1.08,prog(t,0,d));
  return `<g transform="translate(960,560) scale(${z.toFixed(3)}) translate(-960,-560)">${z27_square(g,{n:14,sil:1,bench:0,fountain:0,seed:3})}
   ${glint({x:760,y:640,s:.9,t:g,mouth:'frown',brows:'raised',look:1,blink:BL(g),sweat:1})}${z27_nan({x:1060,y:660,s:.85,t:g,mouth:'flat',brows:'sad',blink:BL(g+1)})}</g>
   ${z27_timer(1200,g,{x:1460,y:150,s:1.1})}
   ${T(700,150,'20 MINUTES',{size:110,fill:P.white})}${T(700,260,'TO THE LAST BOAT',{size:62,fill:Z27.g})}
   ${run?`<g transform="translate(1340,520) scale(${pop(t,p.run??4.2).toFixed(3)})">${labelPill(0,0,"NAN CAN'T RUN",P.coral,52)}</g>`:''}
   ${heart?z27_heart(1340,680,1.1*pop(t,p.heart??5.7),g):''}`;
},
zSquareOpen(t,d,p,g){
  const n3=AT(t,p.three??2.6),kai=AT(t,p.kai??7),sp=AT(t,p.sprint??8.6),no=AT(t,p.no??11);
  return `${z27_square(g,{n:22,bench:0,fountain:0,seed:12})}
   ${glint({x:520,y:700,s:.8,t:g,mouth:no?'flat':'o',brows:no?'angry':'raised',look:1,blink:BL(g),pose:no?'reach':'down'})}${z27_nan({x:300,y:720,s:.72,t:g,mouth:'flat',brows:'sad'})}
   ${kai?z27_kai({x:760,y:700,s:.8,t:g,mouth:sp?'laugh':'o',brows:'raised',pose:sp?'point':'reach',look:1}):''}
   <g transform="translate(1660,120)">${z27_timer(1200,g,{x:0,y:0,s:.8})}</g>
   ${!kai?T(960,170,'MARKET SQUARE',{size:100,fill:P.white,sc:IN(t,.1)}):''}${n3&&!kai?z27_pill(1180,330,'300 INFECTED',Z27.red,56,pop(t,p.three??2.6)):''}
   ${sp&&!no?z27_bub(900,330,560,'“WE SPRINT','THROUGH. NOW.”',{size:48,tail:'left',sc:pop(t,p.sprint??8.6)}):''}
   ${no?z27_bub(760,320,620,'“NO. WHATEVER HAPPENS,','NOBODY RUNS.”',{size:44,tail:'left',sc:pop(t,p.no??11)}):''}`;
},
// 2. day one at the museum
zExhibit(t,d,p,g){
  const day=AT(t,p.day??1.1),ex=AT(t,p.ex??2.5),cs=AT(t,p.case??6),st=AT(t,p.stalk??9.5);
  if(!day)return `${bgCard('cardDark',g)}<g transform="translate(960,470) scale(${pop(t,.05).toFixed(3)})">${[0,1].map(i=>`<path d="M${-20-i*110} -90 L${-150-i*110} 0 L${-20-i*110} 90Z" fill="${Z27.g}" stroke="${INK}" stroke-width="10" stroke-linejoin="round" transform="translate(${130+((g*200)%40)},0)"/>`).join('')}</g>${T(960,700,"LET'S GO BACK",{size:110,fill:P.white,sc:IN(t,.1)})}`;
  const zc=cs?eout(prog(t,p.case??6,(p.case??6)+1.5)):0;
  return `${z27_museum(g)}<g transform="translate(${lerp(0,-500,zc).toFixed(0)},${lerp(0,-260,zc).toFixed(0)}) scale(${lerp(1,1.5,zc).toFixed(3)})">${z27_case(960,640,1,g)}</g>
   ${z27_osei({x:1600,y:560,s:.85,t:g,mouth:'smile',pose:'point',look:-1,blink:BL(g)})}${!cs?glint({x:330,y:560,s:.85,t:g,mouth:'smile',look:1,blink:BL(g)}):''}
   ${ex?`<g transform="translate(960,150)"><rect x="-330" y="-70" width="660" height="130" rx="18" fill="#0B140F" stroke="${Z27.g}" stroke-width="7"/>${T(0,32,'MIND CONTROL',{size:84,fill:Z27.g})}</g>`:z27_day(1,960,170,1.3,Z27.g)}
   ${st?z27_pill(1300,900,'A STALK FROM ITS HEAD',P.gold,46,pop(t,p.stalk??9.5)):''}`;
},
zRadio(t,d,p,g){
  const ho=AT(t,p.hosp??1.5),wa=AT(t,p.wander??5.2),li=AT(t,p.lights??6.3),no=AT(t,p.noise??8);
  if(!wa)return `${z27_flat(g,{oven:0})}${z27_radio(960,600,1.3,g)}${T(960,170,'ON THE RADIO',{size:100,fill:P.white,sc:IN(t,.1)})}${ho?z27_pill(960,880,'HOSPITAL: FEVER, RESTLESS',Z27.red,50,pop(t,p.hosp??1.5)):''}`;
  const lx=lerp(1200,1500,prog(t,p.lights??6.3,d));
  return `${z27_street(g)}${z27_lamp(1550,380,g,Z27.g,.8)}
   ${z27_inf(lerp(400,lx-260,prog(t,p.wander??5.2,d)),560,.85,g,{walk:1,ph:0,top:'#6A4A5A'})}${z27_inf(lerp(700,lx-60,prog(t,p.wander??5.2,d)),580,.8,g,{walk:1,ph:2})}
   ${no?`<g transform="translate(1680,700)">${z27_w(0,0,g)}${z27_w(-40,-40,g+.5)}</g>`:''}
   ${T(960,150,no?'WALKING TOWARDS NOISE':li?'STARING AT LIGHTS':'THEY WANDER',{size:96,fill:no?Z27.red:P.white,sc:pop(t,no?p.noise??8:li?p.lights??6.3:p.wander??5.2)})}`;
},
zText(t,d,p,g){
  const sir=AT(t,p.sirens??5.4),os=AT(t,p.osei??7);
  if(!sir)return `${bgCard('cardMint',g)}${z27_phone(960,560,1.6,`<rect x="-86" y="-150" width="120" height="60" rx="14" fill="#2E3A5A"/><text x="-26" y="-110" text-anchor="middle" font-size="22" font-weight="900" fill="#fff">KAI</text><rect x="-90" y="-70" width="180" height="70" rx="18" fill="${Z27.g}" stroke="${INK}" stroke-width="4"/><text y="-24" text-anchor="middle" font-size="34" font-weight="900" fill="${INK}">ZOMBIES</text>${[...Array(7)].map((_,i)=>AT(t,1.2+i*.25)?z27_laugh(-72+(i%4)*48,40+Math.floor(i/4)*50,20):'').join('')}`,-4)}
     ${z27_kai({x:420,y:600,s:.85,t:g,mouth:'laugh',pose:'point',look:1,blink:BL(g)})}${T(960,150,'KAI TEXTS ONE WORD',{size:84,fill:P.white,sc:IN(t,.1)})}`;
  const on=Math.sin(g*10)>0;
  return `${z27_street(g,{fires:1})}<circle cx="${on?500:1400}" cy="300" r="420" fill="${on?'#3D7BFF':P.red}" opacity=".22"/>
   ${os?`${z27_museum(g)}${z27_case(700,640,.9,g)}${z27_osei({x:1250,y:560,s:.95,t:g,mouth:'flat',brows:'raised',pose:'point',look:-1,blink:BL(g)})}${z27_bub(1250,170,760,'“NATURE HAS DONE','THIS BEFORE.”',{size:50,tail:'center',sc:pop(t,p.osei??7)})}`
   :`${T(960,170,'MIDNIGHT',{size:110,fill:P.white,sc:pop(t,p.sirens??5.4)})}${T(960,300,'THE SIRENS START',{size:70,fill:Z27.red,sc:pop(t,(p.sirens??5.4)+.4)})}`}`;
},
// 3. the rules
zRules(t,d,p,g){
  const mu=AT(t,p.made??1.6),dr=AT(t,p.drift??4),bo=AT(t,p.borrow??6);
  return `${bgCard('cardDark',g)}${T(960,150,'THE RULES',{size:120,fill:P.gold,sc:IN(t,.1)})}
   ${z27_inf(960,560,1.05,g,{arms:'fwd'})}
   ${mu?`<g transform="translate(470,450) rotate(-6) scale(${pop(t,p.made??1.6).toFixed(3)})">${labelPill(0,0,'MADE UP',P.coral,60)}</g>`:''}
   ${dr?`<g transform="translate(470,600) rotate(-6) scale(${pop(t,p.drift??4).toFixed(3)})">${T(0,0,'“THE DRIFT”',{size:80,fill:Z27.g})}</g>`:''}
   ${bo?`<g transform="translate(1450,520) rotate(4) scale(${pop(t,p.borrow??6).toFixed(3)})"><rect x="-300" y="-110" width="600" height="220" rx="24" fill="#0B140F" stroke="${Z27.g}" stroke-width="8"/>${T(0,-10,'EVERY TRICK',{size:66,fill:P.white})}${T(0,70,'IS REAL',{size:66,fill:Z27.g})}</g>`:''}`;
},
zAnt(t,d,p,g){
  const le=AT(t,p.leave??4.5),cl=AT(t,p.climb??6),bi=AT(t,p.bite??7.2),gr=AT(t,p.grows??9),sp=AT(t,p.spores??10.5);
  const ky=bi?300:cl?lerp(860,300,prog(t,p.climb??6,p.bite??7.2)):860,kx=bi?1010:cl?1010:lerp(400,1010,prog(t,p.leave??4.5,p.climb??6));
  let spore='';if(sp)for(let i=0;i<24;i++){const k=((g*.4+i/24)%1);spore+=`<circle cx="${(1050+Math.sin(i*3)*260*k).toFixed(0)}" cy="${(140+k*800).toFixed(0)}" r="6" fill="#F4E8B0" opacity="${(1-k).toFixed(2)}"/>`;}
  return `${Z27_DEF}<rect width="1920" height="1080" fill="#0E2A1A"/><circle cx="1500" cy="200" r="400" fill="url(#gGold)" opacity=".25"/>${[...Array(7)].map((_,i)=>`<rect x="${i*300-40}" y="0" width="${60+i%3*30}" height="1080" fill="#0A1E12"/>`).join('')}
   <path d="M1000 1080 Q980 700 1010 300" stroke="#3E8A4E" stroke-width="26" fill="none"/><path d="M1010 330 Q1150 260 1260 330 Q1150 380 1010 330Z" fill="#4FBF5A" stroke="${INK}" stroke-width="7"/>
   <rect y="900" width="1920" height="180" fill="#2A1E14"/><path d="M200 900 q60 -60 120 0 q60 -60 120 0Z" fill="#3A2A1A" stroke="${INK}" stroke-width="6"/>
   ${z27_ant(kx,ky,1,g,{rot:cl&&!bi?-80:bi?-10:0,bite:bi?1:0,stalk:gr?prog(t,p.grows??9,(p.grows??9)+1.5):0,walk:!bi})}${spore}
   ${z27_ant(600,940,.5,g)}${z27_ant(1400,950,.5,g+1)}
   ${T(960,150,sp?'SPORES RAIN DOWN':gr?'THE FUNGUS GROWS OUT':bi?'BITES A LEAF':cl?'CLIMBS':'TRICK ONE: A FUNGUS',{size:92,fill:sp||gr?P.gold:P.white,sc:pop(t,sp?p.spores??10.5:gr?p.grows??9:bi?p.bite??7.2:cl?p.climb??6:.1)})}
   ${z27_pill(480,300,'OPHIOCORDYCEPS',Z27.g,40,IN(t,p.name??2.2))}`;
},
zToxo(t,d,p,g){
  const ra=AT(t,p.rats??1.5),dr=AT(t,p.drawn??5);const rx=dr?lerp(560,980,prog(t,p.drawn??5,d)):560;
  const rat=`<g transform="translate(${rx.toFixed(0)},800)"><ellipse rx="110" ry="60" fill="#8A8496" stroke="${INK}" stroke-width="8"/><path d="M-100 10 Q-200 40 -250 -20" stroke="#E8A0A8" stroke-width="10" fill="none"/><circle cx="90" cy="-36" r="50" fill="#8A8496" stroke="${INK}" stroke-width="8"/><circle cx="70" cy="-84" r="22" fill="#E8A0A8" stroke="${INK}" stroke-width="6"/><circle cx="110" cy="-46" r="8" fill="${INK}"/><circle cx="140" cy="-28" r="9" fill="#E8A0A8"/>${ra?`<path d="M90 -110 q10 -30 30 -10" stroke="${Z27.g}" stroke-width="6" fill="none"/><circle cx="90" cy="-36" r="64" fill="none" stroke="${Z27.g}" stroke-width="5" opacity=".6"/>`:''}</g>`;
  return `${bgCard('cardWarm',g)}${pickles(1450,760,1.3,g,{mood:'grump',blink:BL(g)})}${smellCloud(1180,470,g,'#B47CFF','CAT SMELL',1,1)}
   ${rat}${ra&&!dr?T(560,620,'NO FEAR',{size:70,fill:Z27.g,sc:pop(t,p.rats??1.5)}):''}${dr?T(900,620,'DRAWN TO IT',{size:70,fill:Z27.g,sc:pop(t,p.drawn??5)}):''}
   ${T(960,150,'TRICK TWO: TOXOPLASMA',{size:84,fill:P.white,sc:IN(t,.1)})}`;
},
zRabies(t,d,p,g){
  const sa=AT(t,p.saliva??2),sw=AT(t,p.swallow??4.2),wa=AT(t,p.water??6.5);
  return `${bgCard('cardIce',g)}${T(960,150,'TRICK THREE: RABIES',{size:96,fill:P.white,sc:IN(t,.1)})}
   ${sa?`<g transform="translate(480,540) scale(${pop(t,p.saliva??2).toFixed(3)})"><circle r="190" fill="#0B1026" stroke="${Z27.g}" stroke-width="8"/><path d="M-40 -60 q40 70 0 110 q-40 -40 0 -110Z" fill="#BFEFFF" stroke="${INK}" stroke-width="6" transform="translate(40,0)"/><path d="M-120 60 q20 -40 40 0 q20 -40 40 0 q20 -40 40 0" stroke="#fff" stroke-width="8" fill="none"/>${T(0,260,'SALIVA',{size:56,fill:Z27.g})}</g>`:''}
   ${sw?`<g transform="translate(1440,540) scale(${pop(t,p.swallow??4.2).toFixed(3)})"><path d="M-80 -120 L-60 120 H60 L80 -120Z" fill="#9AD1FF" fill-opacity=".5" stroke="${INK}" stroke-width="8"/><path d="M-72 -40 Q0 -54 72 -40" stroke="#fff" stroke-width="5" fill="none"/>${wa?`<path d="M-160 -170 L160 170 M160 -170 L-160 170" stroke="${P.red}" stroke-width="18" stroke-linecap="round" opacity=".9"/>`:''}${T(0,260,wa?'FEAR OF WATER':'PAINFUL TO SWALLOW',{size:wa?56:48,fill:wa?P.red:P.white})}</g>`:''}
   ${z27_inf(960,620,.75,g,{arms:'down',look:sw?1:0})}`;
},
zDriftRules(t,d,p,g){
  const tiles=[[p.slow??1.5,'SLOW',P.ice],[p.fear??2.2,'FEARLESS',P.gold],[p.noise??3.2,'DRAWN TO NOISE',Z27.red],[p.saliva??5.5,'SPREADS BY SALIVA',P.coral],[p.water??8.6,'WON’T GO NEAR WATER','#6FD3F7']];
  const pos=[[430,330],[1490,330],[400,560],[1520,560],[960,860]];
  return `${z27_street(g)}<rect width="1920" height="1080" fill="#030805" opacity=".55"/>${z27_crowd(g,3,700,1220,560,.85,{seed:2})}
   ${tiles.map(([a,l,c],i)=>AT(t,a)?`<g transform="translate(${pos[i][0]},${pos[i][1]}) rotate(${i%2?3:-3})">${labelPill(0,0,l,c,52*(i===4?1.05:1)).replace('<g transform','<g transform')}</g>`.replace(`translate(${pos[i][0]},${pos[i][1]})`,`translate(${pos[i][0]},${pos[i][1]}) scale(${pop(t,a).toFixed(3)})`):'').join('')}
   ${T(960,150,'IN THIS WORLD',{size:100,fill:Z27.g,sc:IN(t,.1)})}`;
},
zPatients(t,d,p,g){
  const pa=AT(t,p.pat??1.5),tr=AT(t,p.treat??3.5),un=AT(t,p.under??7);
  if(un)return `${bgCard('cardMint',g)}${glint({x:960,y:580,s:1.05,t:g,mouth:'smile',brows:'raised',pose:'point',blink:BL(g),glint:1})}
    ${T(960,150,"DON'T FIGHT IT",{size:100,fill:P.white,sc:pop(t,p.under??7)})}${z27_pill(960,880,'UNDERSTAND HOW IT SPREADS',Z27.g,56,pop(t,(p.under??7)+.6))}`;
  return `${z27_museum(g)}<rect x="0" y="0" width="1920" height="1080" fill="#E8FFF0" opacity=".08"/>${z27_inf(700,560,1,g,{band:1,arms:'down'})}${z27_inf(1000,580,.9,g,{band:1,ph:2,top:'#6A4A5A',arms:'down'})}
   ${tr?z27_doc(1450,560,.95,g,{pose:'hold'}):''}${T(960,150,pa?'NOT MONSTERS. PATIENTS.':'BUT THEY AREN’T MONSTERS',{size:88,fill:pa?Z27.g:P.white,sc:pop(t,pa?p.pat??1.5:.1)})}
   ${tr?z27_pill(1450,900,'A TREATMENT EXISTS',P.mint,48,pop(t,p.treat??3.5)):''}`;
},
// 4. plus / minus montage
zIncub(t,d,p,g){
  const ic=AT(t,p.incub??5),al=AT(t,p.already??7.5),fl=AT(t,p.flu??10.5);
  const days=[0,1,2].map(i=>{const on=prog(t,1.5+i*.8,2.3+i*.8);return `<g transform="translate(${560+i*400},520)"><rect x="-170" y="-120" width="340" height="240" rx="22" fill="#0B140F" stroke="${Z27.g}" stroke-width="7" opacity="${(.4+.6*on).toFixed(2)}"/>${T(0,-40,'DAY '+(i+1),{size:52,fill:P.white})}${person({x:0,y:90,s:.32,t:g,who:'kai',mouth:'smile'}).replace('scale(0.32)','scale(0.32)')}</g>`;}).join('');
  let arrows='';if(al)for(let i=0;i<3;i++){const k=((g*.7+i/3)%1);arrows+=`<path d="M${560+i*400} 680 Q${760+i*400} ${780+k*40} ${960+i*400} 680" stroke="${Z27.g}" stroke-width="8" fill="none" stroke-dasharray="16 12" opacity="${(1-k*.6).toFixed(2)}"/>`;}
  return `${bgCard('cardDark',g)}${days}${arrows}${ic?z27_pill(960,280,'INCUBATION: NO SYMPTOMS',P.gold,52,pop(t,p.incub??5)):''}
   ${al?z27_pill(960,870,'ALREADY SPREADING IT',Z27.red,52,pop(t,p.already??7.5)):''}
   ${fl?`<g transform="translate(1600,250) scale(${pop(t,p.flu??10.5).toFixed(3)})"><rect x="-230" y="-80" width="460" height="160" rx="20" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/>${T(0,-12,'REAL: FLU SPREADS',{size:36,fill:INK,stroke:0})}${T(0,40,'A DAY BEFORE SYMPTOMS',{size:30,fill:P.red,stroke:0})}</g>`:''}
   ${z27_day(2,1660,880,.9)}${z27_pm(t,'minus','THE SILENT PART')}`;
},
zFine(t,d,p,g){
  const ha=AT(t,p.hale??3.5),d4=AT(t,p.day4??8.5);
  const win=`<rect x="1080" y="220" width="420" height="380" fill="#FFD36A" stroke="${INK}" stroke-width="10"/><path d="M1290 220 V600 M1080 410 H1500" stroke="${INK}" stroke-width="8"/>`;
  if(d4)return `${z27_street(g)}${z27_lamp(400,420,g,Z27.red,.7)}${z27_inf(960,560,1,g,{top:'#3D7BFF',look:-1})}
    <g transform="translate(1500,820)"><rect x="-200" y="-110" width="400" height="110" rx="30" fill="#C93A3A" stroke="${INK}" stroke-width="8"/><circle cx="-120" cy="0" r="38" fill="#22202E" stroke="${INK}" stroke-width="7"/><circle cx="120" cy="0" r="38" fill="#22202E" stroke="${INK}" stroke-width="7"/>${z27_w(200,-80,g)}</g>
    ${z27_day(4,330,140,.9)}${T(1100,170,'SWAYING IN THE STREET',{size:84,fill:Z27.red,sc:pop(t,p.day4??8.5)})}`;
  return `${z27_street(g,{sky:'z27day'})}<rect x="980" y="120" width="620" height="720" fill="#C98A6A" stroke="${INK}" stroke-width="8"/>${win}
   ${extra({x:1290,y:440,s:.6,t:g,head:'#F4C0A0',pose:'up'})}${ha?z27_pill(1290,690,'MR. HALE · HEALTHY',P.mint,40,pop(t,p.hale??3.5)):''}
   ${glint({x:560,y:560,s:.9,t:g,mouth:'flat',brows:'sad',look:1,blink:BL(g)})}${T(560,170,'THE ONE WHO FEELS FINE',{size:74,fill:P.white,sc:IN(t,.1)})}`;
},
zR0(t,d,p,g){
  const me=AT(t,p.measles??6),fl=AT(t,p.flu??9.5),dr=AT(t,p.drift??12.5);
  const bars=[[me,'MEASLES','12–18',P.red,560],[fl,'FLU','1.3',P.ice,80],[dr,'THE DRIFT','3',Z27.g,180]];
  const ins=`<text x="-490" y="-235" font-size="64" font-weight="900" fill="${INK}">R₀</text><text x="-400" y="-242" font-size="34" font-weight="900" fill="#3D7BFF">= HOW MANY PEOPLE ONE SICK PERSON INFECTS</text>
   ${!me?`<text x="0" y="60" text-anchor="middle" font-size="${(220*pop(t,p.nought??4.5)).toFixed(0)}" font-weight="900" fill="${INK}">R₀</text>${AT(t,p.means??6)?`<g transform="translate(0,170)"><circle cx="-200" r="26" fill="${Z27.red}" stroke="${INK}" stroke-width="6"/><path d="M-160 0 H-40" stroke="${INK}" stroke-width="8"/><path d="M-60 -16 L-36 0 L-60 16" stroke="${INK}" stroke-width="8" fill="none"/>${[0,1,2].map(i=>AT(t,(p.means??6)+.5+i*.4)?`<circle cx="${40+i*80}" r="26" fill="${Z27.red}" stroke="${INK}" stroke-width="6"/>`:'').join('')}<text x="300" y="16" font-size="56" font-weight="900" fill="${INK}">?</text></g>`:''}`:''}
   ${bars.map(([on,l,v,c,h],i)=>on?`<g transform="translate(${-300+i*320},220)"><rect x="-80" y="${-h*.6*pop(t,[p.measles??6,p.flu??9.5,p.drift??12.5][i])}" width="160" height="${h*.6*pop(t,[p.measles??6,p.flu??9.5,p.drift??12.5][i])}" fill="${c}" stroke="${INK}" stroke-width="7"/><text y="56" text-anchor="middle" font-size="40" font-weight="900" fill="${INK}">${l}</text><text y="${-h*.6-20}" text-anchor="middle" font-size="56" font-weight="900" fill="${INK}">${v}</text></g>`:'').join('')}
   <path d="M-460 220 H460" stroke="${INK}" stroke-width="8"/>`;
  return `${z27_museum(g)}${z27_board(860,500,.95,ins)}${z27_osei({x:1640,y:600,s:.8,t:g,mouth:'smile',pose:'point',look:-1,blink:BL(g),dir:-1})}
   ${z27_day(3,1660,170,.8,Z27.g)}${z27_pm(t,'plus','THE NUMBER THAT MATTERS')}`;
},
zAboveOne(t,d,p,g){
  const be=AT(t,p.below??2.6),dr=AT(t,p.door??4.5),fo=AT(t,p.fort??6.5),ta=AT(t,p.tape??9),ba=AT(t,p.bakes??11.5);
  if(fo)return `${z27_flat(g,{tape:ta?prog(t,p.tape??9,(p.tape??9)+.6):0})}${z27_nan({x:1250,y:560,s:.95,t:g,mouth:'smile',pose:ba?'hold':'down',blink:BL(g)})}${ba?z27_tin(1330,640,.7):''}${glint({x:700,y:560,s:.9,t:g,mouth:'smile',pose:ta?'up':'down',blink:BL(g)})}
    ${T(960,150,ba?'NAN BAKES. A LOT.':'NAN’S FLAT = FORTRESS',{size:90,fill:ba?P.gold:P.white,sc:pop(t,ba?p.bakes??11.5:p.fort??6.5)})}`;
  const tree=(x,R,col)=>{let s='';const L=[[0,0]];const lv=R>1?3:2;let pts=[[x,420]];for(let l=0;l<lv;l++){const nx=[];pts.forEach(([px,py])=>{const n=R>1?3:(l===0?1:0);for(let i=0;i<n;i++){const cx=px+(i-(n-1)/2)*(R>1?150/(l+1):0),cy=py+150;s+=`<path d="M${px} ${py} L${cx} ${cy}" stroke="${col}" stroke-width="6"/>`;nx.push([cx,cy]);}});pts.forEach(([px,py])=>s+=`<circle cx="${px}" cy="${py}" r="20" fill="${col}" stroke="${INK}" stroke-width="5"/>`);pts=nx;}pts.forEach(([px,py])=>s+=`<circle cx="${px}" cy="${py}" r="20" fill="${col}" stroke="${INK}" stroke-width="5"/>`);return s;};
  return `${bgCard('cardDark',g)}${tree(560,3,Z27.red)}${T(560,330,'ABOVE 1: IT GROWS',{size:56,fill:Z27.red})}
   ${be?`${tree(1360,.5,Z27.g)}${T(1360,330,'BELOW 1: IT DIES OUT',{size:56,fill:Z27.g,sc:pop(t,p.below??2.6)})}`:''}
   ${dr?`<g transform="translate(960,880) scale(${pop(t,p.door??4.5).toFixed(3)})">${labelPill(0,0,'EVERY CLOSED DOOR PUSHES IT DOWN',P.gold,46)}</g>`:''}${T(960,150,'DR. OSEI’S RULE',{size:90,fill:P.white,sc:IN(t,.1)})}`;
},
zSupermarket(t,d,p,g){
  const ev=AT(t,p.every??2),wh=AT(t,p.why??4.5),si=AT(t,p.sir??7.5),cr=AT(t,p.packed??17);
  if(si&&!cr){const k=prog(t,p.sir??7.5,(p.sir??7.5)+8);const X=u=>460+u*1000,Y=v=>820-v*520;let S='',I='',R='';for(let i=0;i<=40;i++){const u=i/40*k;const inf=Math.exp(-Math.pow((u-.45)/.15,2)),rem=1/(1+Math.exp(-(u-.55)*12)),sus=Math.max(0,1-inf*.6-rem);S+=(i?'L':'M')+X(u)+' '+Y(sus);I+=(i?'L':'M')+X(u)+' '+Y(inf*.6);R+=(i?'L':'M')+X(u)+' '+Y(rem*.9);}
    return `${bgCard('cardDark',g)}<path d="M460 300 V820 H1480" stroke="#fff" stroke-width="7" fill="none"/><path d="${S}" stroke="${P.ice}" stroke-width="12" fill="none"/><path d="${I}" stroke="${Z27.red}" stroke-width="12" fill="none"/><path d="${R}" stroke="${Z27.g}" stroke-width="12" fill="none"/>
     ${[['S · SUSCEPTIBLE',P.ice,p.s1??10.5],['I · INFECTED',Z27.red,p.i1??11.7],['R · REMOVED',Z27.g,p.r1??12.8]].map(([l,c,a],i)=>AT(t,a)?z27_pill(1680,400+i*130,l,c,38,pop(t,a)):'').join('')}
     ${T(960,170,'THE SIR MODEL',{size:100,fill:P.white,sc:pop(t,p.sir??7.5)})}${AT(t,p.bump??14)?z27_pill(960,262,'MORE BUMPING INTO = FASTER',P.gold,44,pop(t,p.bump??14)):''}`;}
  const store=`${z27_street(g,{sky:'z27day'})}<rect x="300" y="260" width="1320" height="580" fill="#E8EEF4" stroke="${INK}" stroke-width="10"/><rect x="300" y="260" width="1320" height="110" fill="${P.red}" stroke="${INK}" stroke-width="10"/>${T(960,340,'MEGAMART',{size:80,fill:'#fff'})}<rect x="760" y="520" width="400" height="320" fill="#9AD1FF" stroke="${INK}" stroke-width="8"/>`;
  if(cr)return `${store}${[...Array(12)].map((_,i)=>extra({x:380+i*105,y:640+(i%2)*40,s:.42,t:g+i,head:['#F2C9A0','#C68B59','#8A5A3A','#E6B98E'][i%4]})).join('')}${z27_cough(800,600,g,1,1)}${T(960,170,'WHERE R JUMPS',{size:100,fill:Z27.red,sc:pop(t,p.packed??17)})}`;
  return `${store}${z27_kai({x:560,y:620,s:.9,t:g,mouth:'laugh',pose:'point',look:1,blink:BL(g)})}${glint({x:1400,y:620,s:.9,t:g,mouth:wh?'frown':'flat',brows:wh?'angry':'raised',pose:wh?'cross':'down',look:-1,blink:BL(g)})}
   ${ev?z27_bub(900,240,560,'“EVERYONE’S GOING.','WE SHOULD TOO.”',{size:40,tail:'left',sc:pop(t,p.every??2)}):''}${wh?z27_bub(1450,360,520,'“THAT’S EXACTLY','WHY NOT.”',{size:40,tail:'right',sc:pop(t,p.why??4.5)}):''}
   ${z27_day(5,1660,900,.8)}${z27_pm(t,'minus',"KAI'S TERRIBLE IDEA")}`;
},
zBeans(t,d,p,g){
  const be=AT(t,p.beans??1.6),co=AT(t,p.cough??3.4);
  return `${z27_flat(g,{oven:0})}${z27_kai({x:900,y:560,s:1,t:g,mouth:co?'o':'laugh',pose:'hold',brows:co?'raised':'calm',blink:BL(g),look:-1})}
   ${be?[...Array(10)].map((_,i)=>z27_beans(760+(i%5)*70,820-Math.floor(i/5)*80,pop(t,(p.beans??1.6)+i*.06))).join(''):''}
   ${co?`${extra({x:1400,y:560,s:.85,t:g,head:'#E6B98E',pose:'down'})}${z27_cough(1330,470,g,1,-1.2)}${z27_pill(1400,200,'A COUGH IN THE FACE',Z27.red,50,pop(t,p.cough??3.4))}`:''}
   ${T(700,150,be?'40 TINS OF BEANS':'KAI GOES ANYWAY',{size:90,fill:P.white,sc:pop(t,be?p.beans??1.6:.1)})}`;
},
zShed(t,d,p,g){
  const ru=AT(t,p.rule??2.6),lo=AT(t,p.longer??4),re=AT(t,p.real??7),sh=AT(t,p.shed??11),ch=AT(t,p.chords??14),fi=AT(t,p.fine??17),pk=AT(t,p.pickles??18);
  if(!sh)return `${bgCard('cardMint',g)}${glint({x:400,y:560,s:.95,t:g,mouth:'smile',brows:'raised',pose:'point',blink:BL(g)})}
    <g transform="translate(1150,500)"><path d="M-500 0 H520" stroke="#fff" stroke-width="10"/>${[0,1,2,3,4,5].map(i=>`<g transform="translate(${-440+i*190},0)"><circle r="40" fill="${i<3?Z27.red:Z27.g}" stroke="${INK}" stroke-width="7" opacity="${AT(t,lo?0:99)?1:i<3?1:.25}"/>${T(0,100,'D'+(i+1),{size:40,fill:P.white})}</g>`).join('')}
     ${lo?`<path d="M-440 -90 H-60" stroke="${Z27.red}" stroke-width="10"/>${T(-250,-120,'CAN HIDE',{size:44,fill:Z27.red})}<path d="M-440 -190 H${(-440+900*prog(t,p.longer??4,(p.longer??4)+1)).toFixed(0)}" stroke="${Z27.g}" stroke-width="10"/>${T(10,-220,'STAY APART LONGER',{size:44,fill:Z27.g})}`:''}</g>
    ${T(1150,150,'QUARANTINE LOGIC',{size:96,fill:P.white,sc:IN(t,.1)})}${re?z27_pill(1150,860,'REAL QUARANTINES = LONGEST HIDING TIME',P.gold,40,pop(t,p.real??7)):''}${z27_pm(t,'plus','QUARANTINE')}`;
  const day=Math.min(5,1+Math.floor(prog(t,p.shed??11,(p.fine??17))*5));
  return `${z27_street(g,{sky:'z27day'})}<rect y="760" width="1920" height="320" fill="#4E8A4A"/>${z27_shed(960,780,1.1)}${ch?z27_notes(800,500,g,.8,P.gold):''}
   ${z27_kai({x:820,y:600,s:.55,t:g,mouth:fi?'grin':'smile',pose:'hold',blink:BL(g)})}${ch?z27_guitar(830,640,.45,g):''}
   ${pk?`${pickles(1500,920,.8,g,{mood:'grump',blink:0})}${T(1500,760,'NOT FINE',{size:56,fill:P.coral,sc:pop(t,p.pickles??18)})}`:''}
   <g transform="translate(330,150)"><rect x="-200" y="-70" width="400" height="140" rx="20" fill="#0B140F" stroke="${Z27.g}" stroke-width="7"/>${T(0,28,`SHED DAY ${day}`,{size:64,fill:Z27.g})}</g>
   ${fi?z27_pill(1300,330,'HE’S FINE',P.mint,56,pop(t,p.fine??17)):''}`;
},
zCornell(t,d,p,g){
  const co=AT(t,p.cornell??3),mo=AT(t,p.model??6),fa=AT(t,p.fast??10),sa=AT(t,p.safe??12),mn=AT(t,p.months??16),le=AT(t,p.lesson??22);
  if(!co)return `${z27_flat(g,{oven:0})}${z27_radio(960,600,1.3,g)}${glint({x:420,y:560,s:.85,t:g,mouth:'o',brows:'raised',look:1,blink:BL(g)})}${z27_pm(t,'plus','A CRACKLY RADIO')}${z27_day(9,1660,880,.8,Z27.g)}`;
  if(le)return `${bgCard('cardMint',g)}${z27_osei({x:960,y:600,s:1,t:g,mouth:'smile',pose:'point',blink:BL(g)})}${T(960,150,'CROWDS = DANGER',{size:110,fill:Z27.red,sc:pop(t,p.lesson??22)})}${T(960,280,'SPACE = SAFETY',{size:90,fill:Z27.g,sc:pop(t,(p.lesson??22)+1.5)})}`;
  return `${bgCard('cardDark',g)}${z27_map(960,580,1.4,g,mo?prog(t,p.model??6,(p.model??6)+6):0,{safe:sa})}
   ${T(960,150,mn?'MONTHS TO REACH QUIET PLACES':sa?'SAFEST: NORTHERN ROCKIES':fa?'DENSE CITIES FELL FASTEST':'CORNELL UNIVERSITY · 2015',{size:mn?76:84,fill:sa||mn?Z27.g:fa?Z27.red:P.white,sc:pop(t,mn?p.months??16:sa?p.safe??12:fa?p.fast??10:p.cornell??3)})}
   ${mo&&!fa?z27_pill(960,900,'A ZOMBIE MODEL, REAL POPULATION DATA',P.gold,42,pop(t,p.model??6)):''}`;
},
zEvac(t,d,p,g){
  const bo=AT(t,p.boat??2),wa=AT(t,p.water??5),la=AT(t,p.last??7),lo=AT(t,p.long??11),nr=AT(t,p.nan??13);
  if(lo)return `${z27_flat(g,{oven:1})}${z27_nan({x:1100,y:560,s:1,t:g,legs:'sit',mouth:'flat',brows:'sad',blink:BL(g)})}${z27_heart(1340,380,.9,g)}${z27_pills(880,760,1)}${glint({x:600,y:560,s:.9,t:g,mouth:'frown',brows:'sad',look:1,blink:BL(g)})}
    ${T(960,150,nr?"AND NAN CAN'T RUN":'A LONG WALK',{size:100,fill:nr?P.coral:P.white,sc:pop(t,nr?p.nan??13:p.long??11)})}`;
  return `${z27_harbour(g,{dusk:0,sx:1300})}<g transform="translate(1720,700)"><ellipse rx="160" ry="40" fill="#4E8A4A" stroke="${INK}" stroke-width="7"/><path d="M-60 -10 L-30 -90 L0 -10 M20 -10 L50 -110 L80 -10" fill="#2E6A3E" stroke="${INK}" stroke-width="5"/></g>
   ${bo?z27_pill(1720,600,'ISLAND',Z27.g,40,pop(t,p.boat??2)):''}${wa?z27_pill(600,300,"THEY WON'T CROSS WATER",'#6FD3F7',48,pop(t,p.water??5)):''}
   ${la?`<g transform="translate(600,500) scale(${pop(t,p.last??7).toFixed(3)})"><rect x="-300" y="-110" width="600" height="220" rx="24" fill="#0A0606" stroke="${Z27.red}" stroke-width="9"/>${T(0,-20,'LAST BOAT',{size:70,fill:Z27.red})}${T(0,70,'DAY 12 · 6 PM',{size:66,fill:P.white})}</g>`:''}
   ${T(1150,150,'EVACUATION BY BOAT',{size:90,fill:P.white,sc:IN(t,.1)})}${z27_pm(t,'minus','THE ANNOUNCEMENT')}`;
},
// 5. the crisis
zWalk(t,d,p,g){
  const ar=AT(t,p.arm??3.5),pi=AT(t,p.pills??5.5);const cam=g*40%1920;
  return `${z27_street(g,{sky:'z27dusk',seed:51})}${z27_lamp(1500,420,g,Z27.red,.7)}
   ${glint({x:860,y:600,s:.9,t:g,legs:'walk',mouth:'flat',brows:'sad',look:1,blink:BL(g)})}${z27_nan({x:1120,y:620,s:.85,t:g*.6,legs:'walk',mouth:'flat',brows:'sad',pose:'hold',blink:BL(g+1)})}${z27_tin(1180,720,.55)}
   ${pi?z27_pills(1060,760,.7):''}${z27_day(12,330,150,.9)}
   <g transform="translate(1600,150)"><rect x="-190" y="-70" width="380" height="140" rx="20" fill="#0A0606" stroke="${Z27.red}" stroke-width="7"/>${T(0,30,'5:40 PM',{size:80,fill:P.white})}</g>
   ${ar?z27_pill(960,330,'STEP BY STEP',P.gold,52,pop(t,p.arm??3.5)):''}`;
},
zSquare(t,d,p,g){
  const sh=AT(t,p.shuffle??3),tw=AT(t,p.twenty??7);
  return `${z27_square(g,{n:26,bench:0,fountain:1,seed:21})}${glint({x:560,y:640,s:.75,t:g,mouth:'o',brows:'raised',look:1,blink:0})}${z27_nan({x:400,y:660,s:.68,t:g,mouth:'o',brows:'sad'})}
   ${T(1000,170,sh?'EVERY STREET TO THE HARBOUR':'MARKET SQUARE',{size:sh?76:100,fill:sh?Z27.red:P.white,sc:pop(t,sh?p.shuffle??3:.1)})}
   ${tw?`<g transform="translate(1660,120) scale(${(1+.5*Math.max(0,1-(t-(p.twenty??7))*1.5)).toFixed(3)})">${z27_timer(z27_left(g),g,{x:0,y:0,s:.85})}</g>`:''}`;
},
zMaths(t,d,p,g){
  const sp=AT(t,p.speed??2),ha=AT(t,p.harb??4.5),ex=AT(t,p.exact??7.5),ar=AT(t,p.around??9.5);
  const ins=`${sp?`<text x="-470" y="-170" font-size="64" font-weight="900" fill="${INK}">NAN: 3 km/h</text>`:''}${ha?`<text x="-470" y="-50" font-size="64" font-weight="900" fill="${INK}">HARBOUR: 1 km</text>`:''}
   ${ex?`<path d="M-470 10 H300" stroke="${INK}" stroke-width="8"/><text x="-470" y="120" font-size="80" font-weight="900" fill="${P.red}">= 20 MINUTES</text>`:''}
   ${ar?`<text x="-470" y="230" font-size="50" font-weight="900" fill="#3D7BFF">GO AROUND? NO TIME.</text>`:''}`;
  return `${z27_square(g,{n:10,bench:0,fountain:0,wash:1,seed:5})}<rect width="1920" height="1080" fill="#030805" opacity=".45"/>${z27_board(820,520,.9,ins)}
   ${glint({x:1580,y:600,s:.85,t:g,mouth:'flat',brows:'raised',pose:'point',dir:-1,look:-1,blink:BL(g)})}<g transform="translate(1660,120)">${z27_timer(z27_left(g),g,{x:0,y:0,s:.8})}</g>`;
},
zBark(t,d,p,g){
  const tu=AT(t,p.turn??1.6),ru=AT(t,p.rule??5);
  const look=tu?1:-1;
  return `${z27_square(g,{n:0,bench:0,fountain:0,seed:6})}${z27_crowd(g,16,200,1500,580,.62,{seed:6,look,dir:tu?1:0})}
   ${dog(1700,800,.7,g)}${z27_w(1800,740,g)}${T(1700,640,'WOOF!',{size:70,fill:P.gold,sc:pop(t,.2)})}
   ${tu?T(1100,170,'THE WHOLE CROWD TURNS',{size:80,fill:Z27.red,sc:pop(t,p.turn??1.6)}):''}${ru?z27_pill(1100,300,'NOISE PULLS THEM IN',P.gold,52,pop(t,p.rule??5)):''}
   <g transform="translate(330,120)">${z27_timer(z27_left(g),g,{x:0,y:0,s:.7})}</g>`;
},
zNoRun(t,d,p,g){
  const sh=AT(t,p.shake??2.5),lo=AT(t,p.loud??4),pu=AT(t,p.pull??5.3),he=AT(t,p.heart??7);
  return `${z27_square(g,{n:8,bench:0,fountain:0,seed:8})}<rect width="1920" height="1080" fill="#030805" opacity=".35"/>
   ${z27_kai({x:560,y:600,s:.95,t:g,mouth:'laugh',pose:'point',look:1,blink:BL(g)})}${z27_bub(560,220,520,'“NEW PLAN.','WE RUN.”',{size:46,tail:'left',sc:IN(t,.3)})}
   ${glint({x:1350,y:600,s:.95,t:g,mouth:'frown',brows:'angry',look:sh?Math.sin(g*10):-1,blink:BL(g),dir:-1})}
   ${lo?z27_pill(1350,240,'RUNNING IS LOUD',Z27.red,46,pop(t,p.loud??4)):''}${pu?z27_pill(1350,350,'NOISE PULLS THEM IN',P.gold,46,pop(t,p.pull??5.3)):''}
   ${he?z27_heart(960,820,1*pop(t,p.heart??7),g):''}<g transform="translate(1660,120)">${z27_timer(z27_left(g),g,{x:0,y:0,s:.75})}</g>`;
},
zBench(t,d,p,g){
  const go=AT(t,p.go??1.8),no=AT(t,p.no??5),e18=AT(t,p.e18??7),ru=AT(t,p.rules??8.5),wa=AT(t,p.water??11),va=AT(t,p.van??13);
  if(va){const z=eout(prog(t,p.van??13,(p.van??13)+1.5));return `${z27_square(g,{n:10,bench:0,fountain:0,seed:14})}<g transform="translate(${lerp(0,-260,z).toFixed(0)},${lerp(0,-120,z).toFixed(0)}) scale(${lerp(1,1.25,z).toFixed(3)})">${z27_bins(300,900,.9)}${z27_van(900,900,.9,g)}</g>
    ${glint({x:1500,y:600,s:.85,t:g,mouth:'o',brows:'raised',look:-1,glint:1,dir:-1})}${T(960,150,'AN ABANDONED ICE CREAM VAN',{size:80,fill:Z27.pink,sc:pop(t,p.van??13)})}<g transform="translate(1660,120)">${z27_timer(z27_left(g),g,{x:0,y:0,s:.7})}</g>`;}
  if(ru)return `${bgCard('cardMint',g)}${glint({x:960,y:580,s:1.05,t:g,mouth:'o',brows:'raised',blink:0,glint:1,pose:'up'})}
    ${z27_pill(480,420,'DRAWN TO NOISE',Z27.red,56,pop(t,p.rules??8.5))}${wa?z27_pill(1440,420,'WON’T GO NEAR WATER','#6FD3F7',56,pop(t,p.water??11)):''}${T(960,150,'THE RULES',{size:110,fill:P.gold,sc:pop(t,p.rules??8.5)})}`;
  return `${z27_square(g,{n:12,bench:1,bx:900,fountain:0,seed:15})}${z27_nan({x:900,y:620,s:.95,t:g,legs:'sit',mouth:'smile',brows:'sad',blink:BL(g)})}
   ${glint({x:1300,y:600,s:.95,t:g,mouth:no?'frown':'o',brows:no?'angry':'sad',look:-1,pose:no?'cross':'down',blink:BL(g),dir:-1})}
   ${go?z27_bub(700,240,620,'“GO WITHOUT ME,','LOVE. BOTH OF YOU.”',{size:44,tail:'right',sc:pop(t,p.go??1.8)}):''}${no?z27_bub(1450,300,460,'“NOT HAPPENING.”','',{size:46,tail:'left',sc:pop(t,p.no??5)}):''}
   <g transform="translate(${e18?1660:1660},120) scale(${e18?(1+.5*Math.max(0,1-(t-(p.e18??7))*1.5)).toFixed(3):1})">${z27_timer(z27_left(g),g,{x:0,y:0,s:.8})}</g>`;
},
// 6. the solution
zVan(t,d,p,g){
  const gr=AT(t,p.grin??3),mu=AT(t,p.music??5.5),he=AT(t,p.heads??10),dr=AT(t,p.drive??12),fo=AT(t,p.follow??15);
  if(!gr)return `${z27_square(g,{n:6,bench:0,fountain:0,seed:16})}${glint({x:760,y:600,s:1,t:g,mouth:'smirk',brows:'raised',pose:'point',look:1,blink:BL(g),glint:1})}${z27_kai({x:1200,y:610,s:.95,t:g,mouth:'o',brows:'raised',look:-1,blink:BL(g)})}
    ${z27_bub(760,220,700,'“YOUR WORST IDEA EVER?','I NEED IT NOW.”',{size:44,tail:'left',sc:IN(t,.3)})}<g transform="translate(1660,120)">${z27_timer(z27_left(g),g,{x:0,y:0,s:.7})}</g>`;
  const vx=dr?lerp(900,1500,prog(t,p.drive??12,d)):900,vy=dr?lerp(860,700,prog(t,p.drive??12,d)):860;
  const cx=fo?lerp(0,500,prog(t,p.follow??15,d)):0;
  return `${z27_square(g,{n:0,bench:0,fountain:0,seed:17,wash:0})}<path d="M1100 840 L1920 520 V840Z" fill="#26362C"/>
   <g transform="translate(${cx.toFixed(0)},0)">${z27_crowd(g,18,100,1100,600,.6,{seed:18,look:he?1:0,dir:he?1:0,walk:fo})}</g>
   ${z27_van(vx,vy,.75,g,{on:mu,kai:1})}${mu?z27_notes(vx-80,vy-380,g,1):''}${z27_wash(g,Z27.red,.18)}
   ${T(960,150,fo?'LIKE THE PIED PIPER':he?'300 HEADS TURN':mu?'LOUD. TINNY. UNBEARABLE.':'KAI GRINS',{size:fo?96:88,fill:mu?Z27.pink:P.white,sc:pop(t,fo?p.follow??15:he?p.heads??10:mu?p.music??5.5:p.grin??3)})}
   <g transform="translate(1660,120)">${z27_timer(z27_left(g),g,{x:0,y:0,s:.7})}</g>`;
},
zCanal(t,d,p,g){
  const fo=AT(t,p.fountain??4),ca=AT(t,p.canal??5.5),sl=AT(t,p.slow??8),qu=AT(t,p.quiet??10),st=AT(t,p.strag??15),tu=AT(t,p.turn??18);
  if(!ca)return `${z27_square(g,{n:3,bench:0,fountain:1,fx:960,seed:19})}${glint({x:620,y:640,s:.8,t:g,legs:'walk',mouth:'flat',blink:BL(g),look:1})}${z27_nan({x:440,y:660,s:.75,t:g*.6,legs:'walk',mouth:'flat'})}
    ${T(960,150,fo?'THE ONE WAY THEY WON’T FOLLOW':'A FEW STRAGGLERS',{size:80,fill:fo?'#6FD3F7':P.white,sc:pop(t,fo?p.fountain??4:.1)})}<g transform="translate(1660,120)">${z27_timer(z27_left(g),g,{x:0,y:0,s:.7})}</g>`;
  const wx=lerp(500,1100,prog(t,p.canal??5.5,d));
  const sx=st?lerp(1700,1400,prog(t,p.strag??15,p.turn??18)):1800;
  return `${z27_canal(g)}${glint({x:wx+200,y:470,s:.7,t:g*.7,legs:'walk',mouth:'flat',brows:'sad',blink:BL(g),look:1})}${z27_nan({x:wx,y:490,s:.65,t:g*.5,legs:'walk',mouth:'flat',pose:'hold'})}
   ${st?z27_inf(sx,470,.7,g,{dir:tu?1:-1,walk:!tu,look:tu?1:-1}):''}${tu?T(1500,300,'…AND TURNS AWAY',{size:56,fill:'#6FD3F7',sc:pop(t,p.turn??18)}):''}
   ${T(760,150,qu?'THE QUIETEST SOUND IN THE CITY':sl?'SLOW STEPS. NO NOISE.':'RIGHT BESIDE THE WATER',{size:qu?72:84,fill:qu?P.gold:'#6FD3F7',sc:pop(t,qu?p.quiet??10:sl?p.slow??8:p.canal??5.5)})}
   <g transform="translate(1660,120)">${z27_timer(z27_left(g),g,{x:0,y:0,s:.7})}</g>`;
},
zBoat(t,d,p,g){
  const ra=AT(t,p.ramp??2),wv=AT(t,p.wave??4),st=AT(t,p.stops??6),ab=AT(t,p.aboard??8),ka=AT(t,p.kai??11);
  if(ka)return `${z27_harbour(g,{ramp:1,sx:1500})}<rect width="1920" height="1080" fill="#030805" opacity=".35"/>${glint({x:1400,y:430,s:.6,t:g,mouth:'frown',brows:'sad',look:-1,blink:BL(g),dir:-1})}${z27_nan({x:1560,y:440,s:.55,t:g,mouth:'flat',brows:'sad'})}
    <path d="M200 500 L500 400" stroke="${Z27.pink}" stroke-width="8" stroke-dasharray="20 18" opacity=".6"/>${T(760,170,'BUT KAI NEVER',{size:100,fill:P.white,sc:pop(t,p.kai??11)})}${T(760,290,'COMES BACK',{size:100,fill:Z27.red,sc:pop(t,(p.kai??11)+.3)})}`;
  const rk=ra&&!st?prog(t,p.ramp??2,(p.ramp??2)+3):st?.35:0;
  const nx=ab?lerp(620,760,prog(t,p.aboard??8,(p.aboard??8)+1)):620;
  return `${z27_harbour(g,{ramp:rk,sx:1250})}${!ra?`<g transform="translate(1180,300)">${z27_w(0,0,g)}</g>${T(960,170,'THE HORN SOUNDS',{size:96,fill:P.white,sc:IN(t,.1)})}`:''}
   ${glint({x:460,y:520,s:.7,t:g,mouth:wv?'o':'frown',brows:'raised',pose:wv?'up':'down',look:1,blink:BL(g)})}${z27_nan({x:nx,y:540,s:.65,t:g,mouth:ab?'smile':'flat'})}
   ${extra({x:1000,y:450,s:.5,t:g,head:'#E6B98E',pose:st?'up':'down'})}${st?z27_pill(1000,260,'STOP THE RAMP!',P.gold,44,pop(t,p.stops??6)):''}
   ${ra&&!ab?T(960,170,'THE RAMP STARTS TO LIFT',{size:84,fill:Z27.red,sc:pop(t,p.ramp??2)}):''}
   ${ab?`<g transform="translate(1600,150) scale(${pop(t,p.aboard??8).toFixed(3)})"><rect x="-200" y="-70" width="400" height="140" rx="20" fill="#0A0606" stroke="${Z27.g}" stroke-width="7"/>${T(0,30,'5:59 PM',{size:84,fill:Z27.g})}</g>`:`<g transform="translate(1660,120)">${z27_timer(z27_left(g),g,{x:0,y:0,s:.7})}</g>`}`;
},
// 7. the twist
zDock(t,d,p,g){
  const sc=AT(t,p.scan??2.5),ka=AT(t,p.kai??5);
  return `${z27_harbour(g,{dusk:0,boat:1,sx:1500})}${z27_day(30,330,150,.9,Z27.g)}
   ${ka?`${z27_van(560,760,.7,g)}${z27_kai({x:500,y:340,s:.55,t:g,legs:'sit',mouth:'grin',pose:'wave',blink:BL(g)})}<g transform="translate(570,300)"><path d="M-14 0 L0 50 L14 0Z" fill="#E8C07A" stroke="${INK}" stroke-width="4"/><circle cy="-6" r="18" fill="${Z27.pink}" stroke="${INK}" stroke-width="4"/></g>${T(960,170,'KAI. ON THE VAN.',{size:100,fill:Z27.pink,sc:pop(t,p.kai??5)})}`
   :`${T(960,170,'THE BOAT COMES HOME',{size:96,fill:P.white,sc:IN(t,.1)})}`}
   ${glint({x:1300,y:430,s:.6,t:g,mouth:ka?'grin':'o',brows:'raised',look:-1,blink:BL(g),pose:ka?'up':'down',dir:-1})}`;
},
zHospital(t,d,p,g){
  const ca=AT(t,p.carpark??4),do_=AT(t,p.doctors??6),bi=AT(t,p.biggest??9),ch=AT(t,p.chains??12),r1=AT(t,p.rfell??15);
  if(ch){const k=prog(t,p.rfell??15,(p.rfell??15)+2);const rv=lerp(3,.6,k);
    return `${bgCard('cardMint',g)}${T(960,150,'THE CHAINS OF INFECTION BREAK',{size:76,fill:P.white,sc:pop(t,p.chains??12)})}
     <g transform="translate(960,560)"><rect x="-340" y="-160" width="680" height="320" rx="30" fill="#0B140F" stroke="${rv<1?Z27.g:Z27.red}" stroke-width="10"/>${T(0,60,`R = ${rv.toFixed(1)}`,{size:170,fill:rv<1?Z27.g:Z27.red})}</g>
     ${r1&&k>=1?z27_pill(960,860,'BELOW ONE: IT DIES OUT',Z27.g,56,pop(t,(p.rfell??15)+2)):''}`;}
  const cx=lerp(-600,200,prog(t,0,(p.carpark??4)+1));
  return `${z27_street(g,{sky:'z27day',seed:60})}${z27_hosp(1300,820,.9,g)}<rect y="840" width="1920" height="240" fill="#5A6478"/>${[...Array(8)].map((_,i)=>`<path d="M${200+i*220} 860 V1060" stroke="#fff" stroke-width="8" opacity=".6"/>`).join('')}
   <g transform="translate(${cx.toFixed(0)},0)">${z27_crowd(g,10,100,900,640,.55,{seed:30,walk:!ca,dir:1})}</g>${z27_van(1700,960,.5,g,{on:1,kai:1,dir:-1})}
   ${do_?z27_doc(1100,620,.7,g,{pose:'up'})+z27_doc(1300,640,.66,g+1,{pose:'hold'}):''}
   ${T(960,150,bi?'THE BIGGEST HOUSE CALL IN HISTORY':ca?'INTO THE HOSPITAL CAR PARK':'HE DROVE THEM UP THE HILL',{size:bi?72:86,fill:bi?P.gold:P.white,sc:pop(t,bi?p.biggest??9:ca?p.carpark??4:.1)})}
   ${do_&&!bi?z27_pill(1200,330,'DOCTORS + TREATMENT',P.mint,46,pop(t,p.doctors??6)):''}`;
},
zNews(t,d,p,g){
  const hu=AT(t,p.hug??3),pk=AT(t,p.pickles??7),ka=AT(t,p.told??11);
  if(!hu)return `${z27_flat(g,{oven:0})}${z27_tv(960,500,1,`${z27_van(-120,140,.5,g,{on:1})}${z27_kai({x:180,y:-30,s:.5,t:g,mouth:'grin',pose:'wave'})}<rect x="-430" y="150" width="860" height="100" fill="${P.red}"/><text x="0" y="218" text-anchor="middle" font-size="46" font-weight="900" fill="#fff">PIED PIPER OF MARKET SQUARE</text>`)}`;
  return `${z27_harbour(g,{dusk:0,boat:0,dock:1920})}${z27_van(1500,800,.7,g)}
   ${z27_nan({x:900,y:520,s:.95,t:g,mouth:'laugh',pose:'reach',blink:1})}${z27_kai({x:1060,y:520,s:.95,t:g,mouth:ka?'laugh':'o',brows:'raised',pose:ka?'point':'down',blink:BL(g)})}
   ${hu&&t<(p.hug??3)+3?`<g transform="translate(1160,${lerp(400,800,prog(t,(p.hug??3)+.5,(p.hug??3)+1.5)).toFixed(0)})"><circle r="26" fill="${Z27.pink}" stroke="${INK}" stroke-width="5"/></g>`:''}${z27_heart(980,240,.6,g,0)}
   ${pk?`${pickles(560,820,.9,g,{mood:'grump',blink:0})}`:''}${glint({x:400,y:520,s:.8,t:g,mouth:'grin',blink:BL(g),look:1})}
   ${ka?z27_bub(1100,200,560,'“TOLD YOU.','BEST IDEA EVER.”',{size:44,tail:'left',sc:pop(t,p.told??11)}):''}`;
},
zAsk(t,d,p,g){
  const op=[[p.stay??4.4,'STAY HOME','#9AD1FF'],[p.hills??5.4,'HEAD FOR THE HILLS',Z27.g],[p.van??6.6,'FOLLOW THE VAN',Z27.pink]];
  return `${z27_skyline(g,{seed:70})}<rect width="1920" height="1080" fill="#030805" opacity=".4"/>${glint({x:960,y:600,s:1.05,t:g,mouth:'smirk',brows:'raised',pose:'shrug',blink:BL(g),glint:1})}
   ${T(960,150,'WHAT WOULD YOU DO?',{size:100,fill:P.white,sc:IN(t,.2)})}
   ${op.map(([a,l,c],i)=>AT(t,a)?z27_pill([440,1480,960][i],[420,420,900][i],l,c,52,pop(t,a)):'').join('')}`;
}
});
