// episode 019 scenes (ant size) — story episode
const a19_SMOKE0=339.33, a19_SECS=160; // countdown starts when the smoke appears (global s)
const a19_left=g=>a19_SECS-(g-a19_SMOKE0);
const a19_GREEN='#7CE36A', a19_FUR='#F0913A', a19_FUR2='#C86A1E', a19_TEA='#B8743A';
function a19_fmt(sec){sec=Math.max(0,Math.ceil(sec));return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;}
function a19_timer(sec,g,o={}){const {x=1660,y=120,s=1,label='SMOKING PAN',col=P.red,txt=null}=o;const pl=txt?1:1+.04*Math.sin(g*8);
  return `<g transform="translate(${x},${y}) scale(${(s*pl).toFixed(3)})"><rect x="-210" y="-80" width="420" height="160" rx="20" fill="#120610" fill-opacity=".9" stroke="${col}" stroke-width="7"/>
   ${txt?'':`<circle cx="-170" cy="-44" r="10" fill="${col}" opacity="${Math.sin(g*6)>0?1:.25}"/>`}<text y="-34" text-anchor="middle" font-size="30" font-weight="900" letter-spacing="3" fill="${col}">${label}</text>
   <text y="50" text-anchor="middle" font-size="88" font-weight="900" fill="#fff" style="font-variant-numeric:tabular-nums">${txt||a19_fmt(sec)}</text></g>`;}
// big PLUS:/MINUS: label that pops at centre, then tucks into the top-left corner
function a19_pm(t,kind,sub){const plus=kind==='plus',col=plus?P.mint:P.red,k=eout(prog(t,2.1,2.7)),sc=lerp(1,.4,k)*pop(t,.02,.4),x=lerp(960,310,k),y=lerp(470,110,k);
  return `<rect width="1920" height="1080" fill="#05030C" opacity="${(.62*(1-k)).toFixed(3)}"/><g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(3)}) rotate(${(-3*(1-k)).toFixed(2)})">${T(0,0,plus?'PLUS:':'MINUS:',{size:230,fill:col,stroke:52})}${T(0,150,sub,{size:96,fill:P.white})}</g>`;}
const a19_title=(t,str,at,col=P.white,o={})=>T(o.x??960,o.y??150,str,{size:o.size??92,fill:col,sc:pop(t,at)});
const a19_pill=(t,x,y,str,at,col=P.gold,size=42)=>AT(t,at)?`<g transform="translate(${x},${y}) scale(${pop(t,at).toFixed(3)})">${labelPill(0,0,str,col,size)}</g>`:'';
function a19_bubble(x,y,w,l1,l2,o={}){const {size=46,tail='left',col=INK}=o;const h=l2?size*2.7:size*1.8,tx=tail==='left'?-w/2+60:w/2-60;
  return `<g transform="translate(${x},${y})"><path d="M${-w/2} ${-h/2} H${w/2} V${h/2} H${tx+30} L${tx} ${h/2+46} L${tx-14} ${h/2} H${-w/2}Z" fill="#FFF6EA" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   <text y="${l2?-size*.2:size*.35}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${col}">${l1}</text>${l2?`<text y="${size*1.0}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${col}">${l2}</text>`:''}</g>`;}
function a19_clock(x,y,r,hours,o={}){const {face='#FFF6EA',col=P.red}=o;const m=((hours*60)%60+60)%60,h=((hours%12)+12)%12;
  return `<g transform="translate(${x},${y})"><circle r="${r}" fill="${face}" stroke="${INK}" stroke-width="${Math.max(6,r*.09)}"/>${[...Array(12)].map((_,i)=>`<path d="M0 ${-r*.86} V${-r*.7}" stroke="${INK}" stroke-width="${Math.max(3,r*.05)}" transform="rotate(${i*30})"/>`).join('')}
   <path d="M0 0 V${-r*.5}" stroke="${INK}" stroke-width="${r*.09}" stroke-linecap="round" transform="rotate(${(h*30).toFixed(1)})"/><path d="M0 0 V${-r*.76}" stroke="${col}" stroke-width="${r*.055}" stroke-linecap="round" transform="rotate(${(m*6).toFixed(1)})"/><circle r="${r*.08}" fill="${INK}"/></g>`;}
function a19_zzz(x,y,g,s=1,col=P.ice){let z='';for(let i=0;i<3;i++){const k=((g*.45+i/3)%1);z+=T(x+k*70*s,y-k*130*s,'Z',{size:(34+i*12)*s,fill:col,stroke:7*s,op:Math.sin(k*Math.PI)});}return z;}
// sound wave: wl = wavelength px, ph = phase
function a19_wave(x0,y0,w,amp,wl,ph,col,sw=8,op=1){let d='';for(let x=0;x<=w;x+=Math.max(2,wl/14)){const k=Math.sin(Math.min(x,w-x)/Math.max(1,w)*Math.PI);d+=(x?'L':'M')+(x0+x).toFixed(1)+' '+(y0+amp*Math.min(1,k*3)*Math.sin(x/wl*6.283-ph)).toFixed(1);}
  return `<path d="${d}" stroke="${INK}" stroke-width="${sw+8}" fill="none" stroke-linejoin="round" opacity="${op}"/><path d="${d}" stroke="${col}" stroke-width="${sw}" fill="none" stroke-linejoin="round" opacity="${op}"/>`;}
// squeaky voice: thin high zig-zag arcs radiating from a point, fading fast
function a19_squeak(x,y,g,a=1,dir=1,reach=1){let s='';for(let i=0;i<3;i++){const k=((g*1.6+i/3)%1),r=30+k*160*reach;s+=`<path d="M${x+dir*r*.7} ${y-r*.7} A${r} ${r} 0 0 ${dir>0?1:0} ${x+dir*r*.7} ${y+r*.7}" stroke="${P.gold}" stroke-width="6" fill="none" stroke-dasharray="6 8" opacity="${(a*(1-k)).toFixed(2)}"/>`;}return s;}
// smoke column; th 0..1 (thread -> ribbon -> thick)
function a19_smoke(x,y,g,a=1,th=0,h=420){if(a<=0)return '';let s='';const n=1+Math.round(th*3);
  for(let k=0;k<n;k++){let d='';for(let j=0;j<=22;j++){const yy=y-j*h/22,xx=x+(k-(n-1)/2)*14*th+Math.sin(j*.45-g*2.2+k)*(6+j*(2.2+th*3));d+=(j?'L':'M')+xx.toFixed(1)+' '+yy.toFixed(1);}
    s+=`<path d="${d}" stroke="#B9BCC8" stroke-width="${(6+th*26).toFixed(1)}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${(a*(.55-k*.06)).toFixed(2)}"/>`;}
  for(let i=0;i<4*th;i++){const k=((g*.18+i/4)%1);s+=`<circle cx="${(x+Math.sin(g+i*2)*60*th).toFixed(0)}" cy="${(y-h-k*120).toFixed(0)}" r="${(40+k*90*th).toFixed(0)}" fill="#9EA2B0" opacity="${(a*th*.3*(1-k)).toFixed(2)}"/>`;}
  return s;}
// ---------------- props ----------------
function a19_fridge(x,y,w=300,h=640){return `<g transform="translate(${x},${y})"><rect x="0" y="0" width="${w}" height="${h}" rx="26" fill="#E8EEF4" stroke="${INK}" stroke-width="9"/><path d="M0 ${h*.3} H${w}" stroke="${INK}" stroke-width="7"/>
  <rect x="${w-46}" y="${h*.12}" width="18" height="${h*.12}" rx="9" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/><rect x="${w-46}" y="${h*.36}" width="18" height="${h*.22}" rx="9" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/>
  <rect x="40" y="${h*.42}" width="70" height="56" rx="6" fill="${P.coral}" stroke="${INK}" stroke-width="4" transform="rotate(-6 75 ${h*.45})"/><circle cx="160" cy="${h*.5}" r="18" fill="${P.gold}" stroke="${INK}" stroke-width="4"/>
  <path d="M14 14 H${w-14}" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".7"/></g>`;}
function a19_pan(x,y,s,g,o={}){const {heat=1,lid=0,shim=0}=o;let sh='';
  if(shim>0)for(let i=0;i<4;i++)sh+=`<path d="M${-60+i*40} -40 q10 -20 0 -40 q-10 -20 0 -40" stroke="#FFE6B0" stroke-width="4" fill="none" opacity="${(shim*(.35+.3*Math.sin(g*6+i))).toFixed(2)}" transform="translate(${(Math.sin(g*3+i)*6).toFixed(1)},0)"/>`;
  const fl=heat?[-50,-20,10,40].map((fx,i)=>{const hh=18+Math.sin(g*10+i*2)*6;return `<path d="M${fx-10} 38 Q${fx} ${(38-hh).toFixed(1)} ${fx+10} 38Z" fill="#5AB8FF"/>`;}).join(''):'';
  return `<g transform="translate(${x},${y}) scale(${s})">${heat?`<ellipse cx="0" cy="34" rx="120" ry="26" fill="url(#gWarm)" opacity="${(.5+.2*Math.sin(g*5)).toFixed(2)}"/>`:''}${fl}
   <path d="M-120 -6 L-300 -36" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="M-120 -6 L-300 -36" stroke="#3A3A44" stroke-width="14" stroke-linecap="round"/>
   <path d="M-120 -10 L-104 30 H104 L120 -10Z" fill="#2E3240" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><ellipse cx="0" cy="-10" rx="120" ry="18" fill="#D9A23A" stroke="${INK}" stroke-width="7"/><ellipse cx="-30" cy="-13" rx="40" ry="5" fill="#FFE08A" opacity=".7"/>
   ${sh}${lid>0?`<g transform="translate(${((1-lid)*260).toFixed(1)},${((1-lid)*-60).toFixed(1)})"><path d="M-128 -12 Q0 -70 128 -12Z" fill="#9AA7BD" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><rect x="-22" y="-62" width="44" height="16" rx="8" fill="#2E3240" stroke="${INK}" stroke-width="5"/></g>`:''}</g>`;}
function a19_stove(x,y,on,g){return `<g transform="translate(${x},${y})"><rect x="0" y="0" width="360" height="300" rx="10" fill="#D8DEE8" stroke="${INK}" stroke-width="8"/><rect x="-6" y="-16" width="372" height="26" rx="8" fill="#2A3248" stroke="${INK}" stroke-width="6"/>
  <rect x="40" y="80" width="280" height="160" rx="14" fill="#2A3248" stroke="${INK}" stroke-width="7"/><rect x="60" y="100" width="240" height="100" rx="8" fill="#141A30"/>
  ${[90,180,270].map((kx,i)=>`<g transform="translate(${kx},40)"><circle r="18" fill="#FFF6EA" stroke="${INK}" stroke-width="5"/><path d="M0 0 V-14" stroke="${i===1&&on?P.red:INK}" stroke-width="6" stroke-linecap="round" transform="rotate(${i===1?(on?60:0):0})"/></g>`).join('')}</g>`;}
function a19_chair(x,y,s=1,col='#7A4A6A',blanket=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-150" y="-330" width="300" height="250" rx="40" fill="${col}" stroke="${INK}" stroke-width="8"/><rect x="-170" y="-110" width="340" height="80" rx="20" fill="${col}" stroke="${INK}" stroke-width="8"/><path d="M-130 -30 V0 M130 -30 V0" stroke="${INK}" stroke-width="14"/></g>`;}
function a19_chairArms(x,y,s=1,col='#7A4A6A',blanket=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-200" y="-200" width="60" height="170" rx="26" fill="${col}" stroke="${INK}" stroke-width="8"/><rect x="140" y="-200" width="60" height="170" rx="26" fill="${col}" stroke="${INK}" stroke-width="8"/>
  ${blanket?`<path d="M-210 -210 H-120 L-110 0 Q-160 14 -214 0Z" fill="${P.mint}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>${[0,1,2,3].map(i=>`<path d="M-200 ${-170+i*44} H-122" stroke="${P.mintDark}" stroke-width="6" stroke-dasharray="10 8"/>`).join('')}`:''}</g>`;}
// Nan in her armchair (floor 820). state: doze|awake|shriek
function a19_nan(x,g,o={}){const {state='doze',blanket=1}=o;const aw=state!=='doze';
  return `${a19_chair(x,820,1)}${person({x:x+10,y:580,s:.9,t:g,who:'nan',legs:'sit',pose:state==='shriek'?'up':'down',blink:aw?BL(g):1,mouth:state==='shriek'?'o':aw?'frown':'smile',brows:aw?'raised':'calm'})}${a19_chairArms(x,820,1,'#7A4A6A',blanket)}${state==='doze'?a19_zzz(x+70,330,g):''}`;}
function a19_phone(x,y,s=1,o={}){const {lit=0,ring=0}=o;return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-70" y="-130" width="140" height="260" rx="22" fill="${INK}"/><rect x="-60" y="-114" width="120" height="224" rx="10" fill="${lit?'#2A6A5E':'#1A2238'}"/>
  ${lit?`<circle cy="40" r="24" fill="${P.mint}"/><rect x="-40" y="-80" width="80" height="12" rx="6" fill="#fff" opacity=".6"/><rect x="-30" y="-60" width="60" height="10" rx="5" fill="#fff" opacity=".4"/>`:''}</g>`;}
// Nan's kitchen, human scale. floor y=820, fridge top y=180 (x 120..420)
function a19_kitchen(g,o={}){const {heat=1,smoke=0,th=0,lid=0,shim=0,phone=1,nan='doze',nanOn=1,clock=21.3}=o;
  let s=`<rect width="1920" height="1080" fill="#252B52"/><rect y="400" width="1920" height="160" fill="#2E3866"/>`;
  for(let i=0;i<25;i++)s+=`<path d="M${i*80} 400 V560" stroke="#000" stroke-opacity=".14" stroke-width="3"/>`;
  s+=`<path d="M0 480 H1920" stroke="#000" stroke-opacity=".14" stroke-width="3"/>`;
  s+=`<rect x="530" y="150" width="300" height="230" fill="#0A0F26"/><circle cx="760" cy="210" r="26" fill="#fff4dc"/><circle cx="600" cy="200" r="3" fill="#fff"/><circle cx="680" cy="260" r="2.5" fill="#fff"/>
   <rect x="530" y="150" width="300" height="230" fill="none" stroke="#E8E2D6" stroke-width="14"/><path d="M680 150 V380" stroke="#E8E2D6" stroke-width="9"/>`;
  s+=a19_clock(1400,220,62,clock);
  // floor (lino)
  s+=`<rect y="820" width="1920" height="260" fill="#3E3352"/>`;for(let i=0;i<26;i++)s+=`<path d="M${i*90-200} 1080 L${960+(i*90-200-960)*.55} 820" stroke="#000" stroke-opacity=".16" stroke-width="3"/>`;
  s+=`<path d="M0 900 H1920 M0 1000 H1920" stroke="#000" stroke-opacity=".14" stroke-width="3"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="6"/>`;
  s+=a19_fridge(120,180,300,640);
  // counter
  s+=`<rect x="440" y="520" width="440" height="300" fill="#7A5A3A" stroke="${INK}" stroke-width="8"/><path d="M660 540 V810" stroke="${INK}" stroke-width="5"/><circle cx="640" cy="660" r="8" fill="${P.gold}"/><circle cx="680" cy="660" r="8" fill="${P.gold}"/>
   <rect x="430" y="500" width="460" height="28" rx="6" fill="#E8E2D6" stroke="${INK}" stroke-width="6"/>`;
  if(phone)s+=`<g transform="translate(560,494) rotate(90)">${a19_phone(0,0,.22)}</g>`;
  s+=a19_stove(890,520,heat,g)+a19_pan(1070,494,.75,g,{heat,lid,shim});
  if(smoke>0)s+=a19_smoke(1070,470,g,smoke,th,360+th*120);
  if(nanOn)s+=a19_nan(1620,g,{state:nan});
  return s;}
// tiny Glint standing with his feet at (x,yf); with a pulsing marker so he reads at small scale
function a19_tg(x,yf,s,g,o={}){const {mark=1,label=0}=o;const gl=glint(Object.assign({x,y:yf-300*s,s,t:g,blink:BL(g)},o));
  return `${mark?`<circle cx="${x}" cy="${yf-120*s}" r="${(70+10*Math.sin(g*5)).toFixed(1)}" fill="none" stroke="${P.gold}" stroke-width="6" opacity=".9"/>`:''}${gl}${label?T(x,yf-120*s-100,label,{size:34,fill:P.gold,stroke:8}):''}`;}
// circular zoom inset joined to a point
function a19_inset(x,y,r,inner,px,py,id){return `<path d="M${px} ${py} L${x} ${y}" stroke="${P.gold}" stroke-width="6" stroke-dasharray="14 10"/><clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath>
  <circle cx="${x}" cy="${y}" r="${r+10}" fill="${INK}"/><g clip-path="url(#${id})"><circle cx="${x}" cy="${y}" r="${r}" fill="#1A2142"/>${inner}</g><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${P.gold}" stroke-width="10"/>`;}
function a19_ruler(x,y,len,label,o={}){const {vert=1,col=P.gold}=o;let tk='';const n=10;for(let i=0;i<=n;i++)tk+=vert?`<path d="M0 ${-i*len/n} H${i%5?18:32}" stroke="${INK}" stroke-width="4"/>`:`<path d="M${i*len/n} 0 V${i%5?-18:-32}" stroke="${INK}" stroke-width="4"/>`;
  return `<g transform="translate(${x},${y})">${vert?`<rect x="-6" y="${-len}" width="50" height="${len}" rx="6" fill="${col}" stroke="${INK}" stroke-width="6"/>${tk}${T(70,-len/2+18,label,{size:56,fill:col,anchor:'start',stroke:12})}`
    :`<rect x="0" y="-50" width="${len}" height="50" rx="6" fill="${col}" stroke="${INK}" stroke-width="6"/>${tk}${T(len/2,60,label,{size:52,fill:col,stroke:11})}`}</g>`;}
function a19_cube(x,y,a,rot=0){const r=rng(5);let gr='';for(let i=0;i<26;i++)gr+=`<rect x="${(-a/2+6+r()*(a-16)).toFixed(0)}" y="${(-a/2+6+r()*(a-16)).toFixed(0)}" width="7" height="7" fill="#D6DCE8" transform="rotate(${(r()*90).toFixed(0)})"/>`;
  return `<g transform="translate(${x},${y}) rotate(${rot})"><path d="M${-a/2} ${-a/2} l${a*.22} ${-a*.18} h${a} v${a} l${-a*.22} ${a*.18}Z" fill="#E6EAF2" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="${-a/2}" y="${-a/2}" width="${a}" height="${a}" rx="6" fill="#FFFFFF" stroke="${INK}" stroke-width="7"/>${gr}</g>`;}
function a19_iso(x,y,a,col,n=1){const dx=a*.5,dy=a*.3;let L='';for(let i=1;i<n;i++){const f=i/n;L+=`<path d="M${x} ${y-a+a*f} L${x+dx} ${y-a+a*f-dy}" /><path d="M${x} ${y-a+a*f} L${x-dx} ${y-a+a*f-dy}"/><path d="M${x+dx*f} ${y-dy*f} V${y-dy*f-a}"/><path d="M${x-dx*f} ${y-dy*f} V${y-dy*f-a}"/><path d="M${x-dx+dx*f} ${y-a-dy-dy*f+dy*0} L${x+dx*f} ${y-a-dy*f}" /><path d="M${x+dx-dx*f} ${y-a-dy-dy*f} L${x-dx*f} ${y-a-dy*f}"/>`;}
  return `<g stroke-linejoin="round"><path d="M${x} ${y} L${x-dx} ${y-dy} V${y-dy-a} L${x} ${y-a}Z" fill="${col}" stroke="${INK}" stroke-width="7"/><path d="M${x} ${y} L${x+dx} ${y-dy} V${y-dy-a} L${x} ${y-a}Z" fill="${col}" stroke="${INK}" stroke-width="7" fill-opacity=".7"/>
   <path d="M${x} ${y-a} L${x-dx} ${y-a-dy} L${x} ${y-a-2*dy} L${x+dx} ${y-a-dy}Z" fill="#fff" fill-opacity=".35" stroke="${INK}" stroke-width="7"/><g stroke="${INK}" stroke-width="3" opacity=".5" fill="none">${L}</g></g>`;}
function a19_drop(x,y,r,g,o={}){const {col=a19_TEA,wob=0}=o;const w=r*(1+.05*Math.sin(g*3)+wob*.1*Math.sin(g*9));
  return `<g transform="translate(${x},${y})"><path d="M${-w} 0 C${-w} ${-r*1.05} ${w} ${-r*1.05} ${w} 0Z" fill="${col}" fill-opacity=".8" stroke="${INK}" stroke-width="7"/><path d="M${-w*.55} ${-r*.45} q${w*.2} ${-r*.3} ${w*.5} ${-r*.35}" stroke="#fff" stroke-width="${Math.max(4,r*.08)}" fill="none" stroke-linecap="round" opacity=".7"/></g>`;}
function a19_matchbox(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-120" y="-50" width="240" height="70" rx="6" fill="#E8C47A" stroke="${INK}" stroke-width="7"/><rect x="-150" y="-60" width="200" height="90" rx="6" fill="${P.red}" stroke="${INK}" stroke-width="7"/><path d="M-140 -10 H40" stroke="#fff" stroke-width="6" opacity=".7"/><circle cx="-50" cy="-15" r="16" fill="${P.gold}" stroke="${INK}" stroke-width="4"/></g>`;}
function a19_ant(x,y,s,g,o={}){const {col='#3A2A2A',load=0}=o;const lg=Math.sin(g*8)*10;let L='';
  [[-30,1],[0,-1],[30,1]].forEach(([lx,ph],i)=>{L+=`<path d="M${lx} 10 L${lx-30+ph*lg} 50 L${lx-50+ph*lg} 100" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${lx} 10 L${lx+30-ph*lg} 50 L${lx+50-ph*lg} 100" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;});
  return `<g transform="translate(${x},${y}) scale(${s})">${L}<ellipse cx="-120" cy="0" rx="80" ry="58" fill="${col}" stroke="${INK}" stroke-width="8"/><ellipse cx="0" cy="0" rx="50" ry="34" fill="${col}" stroke="${INK}" stroke-width="8"/><circle cx="90" cy="-14" r="46" fill="${col}" stroke="${INK}" stroke-width="8"/>
   <circle cx="108" cy="-26" r="10" fill="#fff"/><path d="M112 -54 Q140 -120 190 -120 M96 -58 Q110 -130 150 -150" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-170 -24 q30 -20 60 0" stroke="#fff" stroke-width="6" fill="none" opacity=".3"/>
   ${load?`<g transform="translate(70,-120) rotate(${(Math.sin(g*3)*5).toFixed(1)})"><path d="M-120 20 Q0 -90 130 10 Q0 50 -120 20Z" fill="#6FCF5A" stroke="${INK}" stroke-width="7"/><path d="M-110 18 Q0 -10 120 10" stroke="#3E8E33" stroke-width="5" fill="none"/></g>`:''}</g>`;}
function a19_beetle(x,y,s,g){const lg=Math.sin(g*6)*8;return `<g transform="translate(${x},${y}) scale(${s})">${[-50,0,50].map((lx,i)=>`<path d="M${lx} 0 L${lx-40+lg} 90 M${lx} 0 L${lx+40-lg} -90" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>`).join('')}
   <ellipse cx="0" cy="0" rx="140" ry="95" fill="#2E7D6A" stroke="${INK}" stroke-width="8"/><path d="M-20 -95 V95" stroke="${INK}" stroke-width="6"/><circle cx="150" cy="0" r="44" fill="#1E4E44" stroke="${INK}" stroke-width="8"/><path d="M-90 -50 q40 -20 70 0" stroke="#fff" stroke-width="7" fill="none" opacity=".35"/></g>`;}
function a19_spider(x,y,s,g){let L='';for(let i=0;i<4;i++){const a=-60+i*30+Math.sin(g*4+i)*4;[1,-1].forEach(sd=>{L+=`<path d="M0 0 Q${sd*120} ${a-60} ${sd*190} ${a+40}" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/>`;});}
  return `<g transform="translate(${x},${y}) scale(${s})">${L}<circle cy="20" r="70" fill="#5A3A6A" stroke="${INK}" stroke-width="8"/><circle cy="-50" r="40" fill="#5A3A6A" stroke="${INK}" stroke-width="8"/><circle cx="-14" cy="-56" r="7" fill="#fff"/><circle cx="14" cy="-56" r="7" fill="#fff"/></g>`;}
function a19_projector(x,y,s,g,o={}){const {spin=1,rev=0,beam=null,flick=0}=o;const a=(rev?-1:1)*g*(spin?(rev?600:120):0);
  const reel=(cx)=>`<g transform="translate(${cx},-170) rotate(${a.toFixed(0)})"><circle r="78" fill="#3A2A1A" stroke="${INK}" stroke-width="8"/>${[0,60,120].map(r=>`<path d="M0 -66 V66" stroke="#C9A46A" stroke-width="10" transform="rotate(${r})"/>`).join('')}<circle r="16" fill="${P.gold}" stroke="${INK}" stroke-width="5"/></g>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${reel(-90)}${reel(90)}<rect x="-170" y="-90" width="340" height="190" rx="24" fill="#C9963A" stroke="${INK}" stroke-width="9"/><rect x="-140" y="-60" width="200" height="40" rx="8" fill="#8A6424" stroke="${INK}" stroke-width="5"/>
   <rect x="-250" y="-30" width="90" height="70" rx="10" fill="#8A6424" stroke="${INK}" stroke-width="8"/><circle cx="-256" cy="5" r="42" fill="${beam==='violet'?'#B9A2FF':beam?'#FFF6D0':'#2A3248'}" stroke="${INK}" stroke-width="8" opacity="${flick?(.4+.6*(Math.sin(g*40)>0?1:0)):1}"/>
   <path d="M-100 100 L-130 170 M100 100 L130 170" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>${[0,1,2].map(i=>`<circle cx="${80+i*30}" cy="40" r="10" fill="${[P.red,P.gold,P.mint][i]}" stroke="${INK}" stroke-width="4"/>`).join('')}</g>`;}
function a19_beam(x,y,len,spread,col,op=.35){return `<path d="M${x} ${y-14} L${x-len} ${y-spread} L${x-len} ${y+spread} L${x} ${y+14}Z" fill="${col}" opacity="${op}"/>`;}
// giant cat face (Glint's view). ears: -1..1 swivel toward left/right
function a19_catFace(x,y,s,g,o={}){const {ears=0,slit=1,mouth='flat',glow=0,blink=0}=o;const er=ears*24;
  const eye=(cx)=>blink?`<path d="M${cx-60} 0 Q${cx} 30 ${cx+60} 0" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/>`:`<ellipse cx="${cx}" cy="0" rx="66" ry="56" fill="${a19_GREEN}" stroke="${INK}" stroke-width="9"/><ellipse cx="${cx}" cy="0" rx="${slit?12:30}" ry="48" fill="${INK}"/><circle cx="${cx+20}" cy="-20" r="12" fill="#fff"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${glow?`<circle r="420" fill="url(#gMint)" opacity="${glow}"/>`:''}
   <g transform="rotate(${(-12+er).toFixed(1)} -170 -210)"><path d="M-260 -150 L-200 -380 L-60 -250Z" fill="${a19_FUR}" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><path d="M-220 -190 L-195 -320 L-110 -240Z" fill="#F4B6C2"/></g>
   <g transform="rotate(${(12+er).toFixed(1)} 170 -210)"><path d="M260 -150 L200 -380 L60 -250Z" fill="${a19_FUR}" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><path d="M220 -190 L195 -320 L110 -240Z" fill="#F4B6C2"/></g>
   <ellipse cx="0" cy="0" rx="330" ry="280" fill="${a19_FUR}" stroke="${INK}" stroke-width="10"/><path d="M-50 -270 q10 50 0 100 M0 -280 q10 60 0 110 M50 -270 q10 50 0 100" stroke="${a19_FUR2}" stroke-width="12" fill="none" stroke-linecap="round"/>
   <path d="M-320 20 q40 10 70 -10 M320 20 q-40 10 -70 -10" stroke="${a19_FUR2}" stroke-width="12" fill="none"/>
   <g transform="translate(0,-40)">${eye(-120)}${eye(120)}</g><path d="M-30 70 H30 L0 100Z" fill="#E86A8A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
   ${mouth==='open'?`<path d="M-50 120 Q0 190 50 120 Q0 140 -50 120Z" fill="#3a1220" stroke="${INK}" stroke-width="6"/>`:`<path d="M0 100 q-30 40 -60 14 M0 100 q30 40 60 14" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`}
   <path d="M-100 100 h-200 M-100 125 h-190 M100 100 h200 M100 125 h190" stroke="#FFF6EA" stroke-width="5" opacity=".9"/></g>`;}
function a19_eyes(x,y,s,g,a=1){const b=((g%4.1)>3.95)?.15:1;return `<g transform="translate(${x},${y}) scale(${s})" opacity="${a}"><circle r="320" fill="url(#gMint)" opacity=".25"/>${[-110,110].map(cx=>`<ellipse cx="${cx}" cy="0" rx="72" ry="${(60*b).toFixed(1)}" fill="${a19_GREEN}" stroke="#0A2A10" stroke-width="6"/><ellipse cx="${cx}" cy="0" rx="14" ry="${(52*b).toFixed(1)}" fill="${INK}"/><circle cx="${cx+22}" cy="-18" r="${(12*b).toFixed(1)}" fill="#fff"/>`).join('')}</g>`;}
// close-up worlds at Glint scale
function a19_counterTop(g,o={}){const {wall='#2E3866',top='#E8E2D6'}=o;let s=`<rect width="1920" height="1080" fill="${wall}"/>`;
  for(let i=0;i<5;i++)s+=`<path d="M${i*480-60} 0 V700" stroke="#000" stroke-opacity=".18" stroke-width="16"/>`;s+=`<path d="M0 260 H1920" stroke="#000" stroke-opacity=".18" stroke-width="16"/>`;
  s+=`<circle cx="1620" cy="250" r="420" fill="url(#gGold)" opacity=".18"/><path d="M0 700 H1920 V1080 H0Z" fill="${top}"/><path d="M0 700 H1920" stroke="${INK}" stroke-width="8"/>`;
  for(let i=0;i<14;i++)s+=`<path d="M${i*160-160} 1080 L${960+(i*160-160-960)*.35} 700" stroke="#000" stroke-opacity=".06" stroke-width="4"/>`;
  return s;}
function a19_lino(g,o={}){const {wall='#252B52',horizon=520,scroll=0}=o;let s=`<rect width="1920" height="1080" fill="${wall}"/><rect y="${horizon}" width="1920" height="${1080-horizon}" fill="#3E3352"/>`;
  const W=360;for(let r=0;r<6;r++){const y0=horizon+Math.pow(r/6,1.6)*(1080-horizon),y1=horizon+Math.pow((r+1)/6,1.6)*(1080-horizon);for(let c=-8;c<9;c++){if((r+c+Math.floor(scroll/W))%2)continue;const k0=.3+.7*r/6,k1=.3+.7*(r+1)/6,off=(scroll%W)*0;
      const xa=960+(c*W-off)*k0,xb=960+((c+1)*W-off)*k0,xc=960+((c+1)*W-off)*k1,xd=960+(c*W-off)*k1;s+=`<path d="M${xa.toFixed(0)} ${y0.toFixed(0)} L${xb.toFixed(0)} ${y0.toFixed(0)} L${xc.toFixed(0)} ${y1.toFixed(0)} L${xd.toFixed(0)} ${y1.toFixed(0)}Z" fill="#4E4268"/>`;}}
  return s+`<path d="M0 ${horizon} H1920" stroke="${INK}" stroke-width="8"/>`;}
function a19_fibres(g,a=1,col='#7A3A5A'){let s='';const r=rng(41);for(let i=0;i<40;i++){const x=r()*2000-40,h=300+r()*500,sw=Math.sin(g*1.2+i)*20,c=r()>.5?col:'#5A2A4A';
  s+=`<path d="M${x.toFixed(0)} 1080 Q${(x+sw+30).toFixed(0)} ${(1080-h*.6).toFixed(0)} ${(x+sw*1.6).toFixed(0)} ${(1080-h).toFixed(0)} Q${(x+sw*1.6+40).toFixed(0)} ${(1080-h-40).toFixed(0)} ${(x+sw+60).toFixed(0)} ${(1080-h+60).toFixed(0)}" stroke="${INK}" stroke-width="30" fill="none" stroke-linecap="round" opacity="${a}"/><path d="M${x.toFixed(0)} 1080 Q${(x+sw+30).toFixed(0)} ${(1080-h*.6).toFixed(0)} ${(x+sw*1.6).toFixed(0)} ${(1080-h).toFixed(0)} Q${(x+sw*1.6+40).toFixed(0)} ${(1080-h-40).toFixed(0)} ${(x+sw+60).toFixed(0)} ${(1080-h+60).toFixed(0)}" stroke="${c}" stroke-width="18" fill="none" stroke-linecap="round" opacity="${a}"/>`;}return s;}
function a19_dust(x,y,s,g){const r=rng(17);let f='';for(let i=0;i<40;i++){const a=r()*6.28,d=150+r()*60;f+=`<path d="M${(Math.cos(a)*d*.6).toFixed(0)} ${(Math.sin(a)*d*.4).toFixed(0)} L${(Math.cos(a)*d*1.1).toFixed(0)} ${(Math.sin(a)*d*.75+Math.sin(g*2+i)*6).toFixed(0)}" stroke="#9A98A8" stroke-width="8" stroke-linecap="round"/>`;}
  return `<g transform="translate(${x},${y}) scale(${s})">${f}<ellipse rx="190" ry="130" fill="#B4B2C0" stroke="${INK}" stroke-width="8"/><ellipse cx="-40" cy="-30" rx="90" ry="50" fill="#CFCDD9"/>${f.replace(/#9A98A8/g,'#8A8898')}</g>`;}
function a19_hand(x,y,s,rot=0,col='#F2C9A0'){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-160 -60 Q-200 0 -160 60 L120 70 Q170 60 170 20 L170 -20 Q170 -60 120 -70Z" fill="${col}" stroke="${INK}" stroke-width="10"/>${[-40,0,40].map(yy=>`<path d="M120 ${yy} H230" stroke="${INK}" stroke-width="54" stroke-linecap="round"/><path d="M120 ${yy} H230" stroke="${col}" stroke-width="38" stroke-linecap="round"/>`).join('')}</g>`;}
function a19_shrew(x,y,s,g){const ch=Math.sin(g*12)*4;return `<g transform="translate(${x},${y}) scale(${s})"><path d="M120 20 Q200 40 240 10" stroke="#C99A9A" stroke-width="10" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="130" ry="70" fill="#8A6A5A" stroke="${INK}" stroke-width="8"/>
  <path d="M-110 -30 L-230 ${(10+ch).toFixed(0)} L-110 40Z" fill="#8A6A5A" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><circle cx="-232" cy="${(10+ch).toFixed(0)}" r="12" fill="#E86A8A" stroke="${INK}" stroke-width="4"/><circle cx="-130" cy="-10" r="9" fill="${INK}"/><circle cx="-100" cy="-50" r="22" fill="#B48A7A" stroke="${INK}" stroke-width="6"/>
  <g transform="translate(-260,40)"><rect x="-20" y="-20" width="40" height="34" rx="6" fill="${P.gold}" stroke="${INK}" stroke-width="5" transform="rotate(${(g*40%360).toFixed(0)})"/></g></g>`;}
function a19_whale(x,y,s,g){const b=Math.sin(g*1.2)*12;return `<g transform="translate(${x},${(y+b).toFixed(1)}) scale(${s})"><path d="M-260 0 Q-240 -110 -40 -110 Q180 -110 240 -10 Q260 40 200 60 Q0 120 -200 60 Q-280 40 -260 0Z" fill="#5A7BD8" stroke="${INK}" stroke-width="9"/><path d="M-220 40 Q0 100 200 50" stroke="#C9D8FF" stroke-width="18" fill="none" opacity=".6"/>
   <path d="M230 -10 L330 ${(-80+Math.sin(g*2)*14).toFixed(0)} L310 0 L340 ${(60+Math.sin(g*2)*14).toFixed(0)}Z" fill="#5A7BD8" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><circle cx="-170" cy="-30" r="10" fill="${INK}"/></g>`;}
function a19_pitch(x,y,w,h){return `<g transform="translate(${x},${y})"><rect width="${w}" height="${h}" fill="#3E9A4A" stroke="${INK}" stroke-width="7"/>${[0,1,2,3].map(i=>`<rect x="${i*w/4}" width="${w/8}" height="${h}" fill="#fff" opacity=".07"/>`).join('')}<rect x="10" y="10" width="${w-20}" height="${h-20}" fill="none" stroke="#fff" stroke-width="4"/><path d="M${w/2} 10 V${h-10}" stroke="#fff" stroke-width="4"/><circle cx="${w/2}" cy="${h/2}" r="${h*.2}" fill="none" stroke="#fff" stroke-width="4"/>
  <rect x="10" y="${h*.28}" width="${w*.12}" height="${h*.44}" fill="none" stroke="#fff" stroke-width="4"/><rect x="${w-10-w*.12}" y="${h*.28}" width="${w*.12}" height="${h*.44}" fill="none" stroke="#fff" stroke-width="4"/></g>`;}
function a19_clip(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-60 30 V-50 Q-60 -80 -30 -80 Q0 -80 0 -50 V40 Q0 60 20 60 Q40 60 40 40 V-30" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-60 30 V-50 Q-60 -80 -30 -80 Q0 -80 0 -50 V40 Q0 60 20 60 Q40 60 40 40 V-30" stroke="#C9D3E3" stroke-width="10" fill="none" stroke-linecap="round"/></g>`;}
function a19_strip(x,y,n,w,col,g,lab){const fw=w/n;let s=`<rect x="${x}" y="${y-60}" width="${w}" height="120" rx="8" fill="#1A1A24" stroke="${INK}" stroke-width="6"/>`;
  for(let i=0;i<n;i++){const on=Math.floor(g*n*.6)%n===i;s+=`<rect x="${(x+i*fw+4).toFixed(1)}" y="${y-44}" width="${(fw-8).toFixed(1)}" height="88" rx="4" fill="${on?col:'#3A3A4A'}" opacity="${on?1:.8}"/>`;}
  return s+T(x-30,y+18,lab,{size:52,fill:P.white,anchor:'end',stroke:10});}
function a19_range(x,y,w,f,col,lab,o={}){const {fade=0}=o;return `<g transform="translate(${x},${y})"><rect x="0" y="-26" width="${w}" height="52" rx="26" fill="#1A2142" stroke="${INK}" stroke-width="6"/><rect x="6" y="-20" width="${(w*f-12).toFixed(0)}" height="40" rx="20" fill="${col}"/>${fade?`<rect x="${(w*f-12).toFixed(0)}" y="-20" width="${(w*fade).toFixed(0)}" height="40" rx="20" fill="${col}" opacity=".25" stroke="${col}" stroke-dasharray="8 8" stroke-width="3"/>`:''}${T(-24,16,lab,{size:44,fill:P.white,anchor:'end',stroke:9})}</g>`;}
const a19_check=(x,y,ok,s=1)=>icon(ok?'check':'cross',x,y,s);
// fridge-top macro: Glint on the fridge edge with the kitchen far below (kitchen drawn small)
function a19_fridgeTop(g,o={}){const k=Object.assign({heat:1},o);
  return `<rect width="1920" height="1080" fill="#252B52"/><g transform="translate(560,300) scale(.72)">${a19_kitchen(g,Object.assign({},k,{phone:1}))}</g>
   <rect width="1920" height="1080" fill="#05030C" opacity=".25"/>
   <path d="M-40 700 L760 640 L800 1100 L-40 1100Z" fill="#E8EEF4" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><path d="M-40 700 L760 640" stroke="#fff" stroke-width="10" opacity=".8"/><path d="M760 640 L800 1100" stroke="#B8C2D4" stroke-width="20"/>`;}

Object.assign(SHOTS,{
antHook(t,d,p,g){
  const pan=p.pan??4.51;
  if(t<pan){const k=eout(prog(t,.2,1.4));
    return `${a19_counterTop(g,{top:'#E8EEF4',wall:'#1E2448'})}<circle cx="960" cy="400" r="380" fill="url(#gGold)" opacity=".2"/>
     ${a19_ruler(1190,820,lerp(0,420,k),'2 CM')}${glint({x:880,y:440,s:1.2,t:g,mouth:'o',brows:'raised',pose:'shrug',blink:BL(g)})}
     ${T(960,150,'2 CENTIMETRES TALL',{size:100,fill:P.gold,sc:IN(t,.2)})}${a19_pill(t,960,940,"TOP OF NAN'S FRIDGE",.9,P.mint,40)}`;}
  const sm=AT(t,p.smoke??8.08), nan=AT(t,p.nan??10.08), sc=AT(t,p.scream??14.24), cant=AT(t,p.cant??17.62), hot=AT(t,p.hot??19.51);
  const th=sm?.15+.25*prog(t,p.smoke??8.08,d):0;
  const ttl=hot?['HOTTER EVERY SECOND',P.red,p.hot]:cant?["SHE CAN'T HEAR A THING",P.red,p.cant]:sc?['"NAN!!"',P.gold,p.scream]:nan?['NAN: FAST ASLEEP',P.ice,p.nan]:sm?["IT'S SMOKING",P.white,p.smoke]:['A PAN OF OIL',P.white,pan];
  const ins=sc?a19_inset(620,470,190,`${glint({x:620,y:430,s:1,t:g,mouth:'o',brows:'angry',pose:'up',blink:0})}${a19_squeak(700,390,g,1,1,1.2)}`,270,140,'a19i1'):'';
  return `${a19_kitchen(g,{smoke:sm?1:0,th,nan:'doze',shim:1})}${a19_tg(270,180,.1,g)}${ins}
   ${sc?a19_squeak(300,140,g,1,1,.5):''}${cant?`<g transform="translate(1630,240) scale(${pop(t,p.cant??17.62)})">${icon('cross',0,0,.8)}</g>`:''}
   ${T(hot?820:960,150,ttl[0],{size:88,fill:ttl[1],sc:pop(t,ttl[2])})}${hot?`<g transform="translate(1660,120) scale(${pop(t,p.hot)})">${a19_timer(a19_left(355.23+(t-p.hot)),g,{x:0,y:0})}</g>`:''}`;
},
antBack(t,d,p,g){
  const ex=p.ex??3.02;
  if(t<ex){const k=ease(prog(t,.15,ex-.25));
    return `${card('cardDark',g)}${[0,1,2].map(i=>`<circle cx="640" cy="540" r="${260+i*40}" fill="none" stroke="${P.violet}" stroke-width="5" stroke-dasharray="30 30" opacity=".4" transform="rotate(${(-g*200*(i+1)).toFixed(0)} 640 540)"/>`).join('')}
     ${a19_clock(640,540,220,21-k*48)}${T(1340,520,'2 DAYS',{size:170,fill:P.gold,sc:IN(t,1.4)})}${T(1340,660,'EARLIER',{size:90,fill:P.white,sc:IN(t,1.6)})}${T(960,150,"LET'S GO BACK",{size:100,fill:P.white,sc:IN(t,.1)})}`;}
  const an=AT(t,p.ants??6.64), pr=AT(t,p.proj??11.57);
  const hall=`<rect width="1920" height="1080" fill="#120C26"/><rect y="820" width="1920" height="260" fill="#1C1430"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="6"/>${[420,960,1500].map((x,i)=>`<path d="M${x-40} 0 L${x-240} 820 H${x+240} L${x+40} 0Z" fill="#FFF6D0" opacity="${(.05+.03*Math.sin(g*2+i)).toFixed(3)}"/>`).join('')}`;
  const plinth=(x,w=360)=>`<rect x="${x-w/2}" y="700" width="${w}" height="120" fill="#2A2450" stroke="${INK}" stroke-width="7"/>`;
  if(!pr) return `${hall}${an?`${plinth(400)}${a19_ant(420,610,1.05*pop(t,p.ants??6.64),g)}${plinth(1000,320)}${a19_beetle(1000,600,.95*pop(t,(p.ants??6.64)+.5),g)}${plinth(1560,300)}${a19_spider(1560,560,.95*pop(t,(p.ants??6.64)+1),g)}`:''}
    ${an?a19_pill(t,960,900,'BLOWN UP TO THE SIZE OF CARS',(p.ants??6.64)+2.5,P.gold,40):glint({x:960,y:540,s:.8,t:g,mouth:'o',brows:'raised',look:Math.sin(g),blink:BL(g)})}
    <g transform="translate(960,170) scale(${IN(t,ex+.1)})"><rect x="-380" y="-80" width="760" height="140" rx="20" fill="${P.violet}" stroke="${INK}" stroke-width="9"/>${T(0,30,'TINY GIANTS',{size:96,fill:P.white})}</g>`;
  return `${hall}<rect x="180" y="200" width="760" height="430" fill="#EDE8F8" stroke="${INK}" stroke-width="10"/>${a19_beam(1340,500,400,230,'#FFF6D0',.25)}${a19_ant(560,430,.85,g)}
   ${a19_projector(1480,560,1.1*pop(t,p.proj??11.57),g)}${glint({x:1100,y:560,s:.62,t:g,mouth:'smile',look:1,blink:BL(g)})}
   ${T(960,150,'AN OLD BRASS PROJECTOR',{size:88,fill:P.gold,sc:pop(t,p.proj??11.57)})}`;
},
antProjector(t,d,p,g){
  const ln=AT(t,p.lean??2.74), fl=AT(t,p.flick??5.45)&&!AT(t,p.back??7.01), bk=AT(t,p.back??7.01), vi=AT(t,p.violet??10.5);
  const beamCol=vi?'#9B7CFF':'#FFF6D0', bop=fl?(Math.sin(g*40)>0?.45:.05):vi?.55:.3;
  const ttl=vi?['DEEP VIOLET',P.violet,p.violet]:bk?['WHIRRR... BACKWARDS',P.gold,p.back]:fl?['FLICKER',P.white,p.flick]:ln?['CHECKING FOR DUST',P.white,p.lean]:['AFTER CLOSING',P.white,.1];
  return `${card(vi?'cardDark':'cardGold',g)}<rect x="0" y="760" width="1920" height="320" fill="#1C1430"/>${a19_beam(1240,520,1400,vi?330:260,beamCol,bop)}
   ${vi?`<rect width="1920" height="1080" fill="${P.violet}" opacity="${(.12+.06*Math.sin(g*5)).toFixed(2)}"/>`:''}
   ${glint({x:ln?900:760,y:ln?470:450,s:.95,t:g,pose:ln?'reach':'point',mouth:vi||fl?'o':'smile',brows:vi||fl?'raised':'calm',rot:ln?-12:0,blink:BL(g),tint:vi?'#E3D8FF':null})}
   ${!ln?`<rect x="910" y="410" width="70" height="44" rx="8" fill="${P.ice}" stroke="${INK}" stroke-width="5" transform="rotate(${(Math.sin(g*8)*14).toFixed(0)} 945 432)"/>`:''}
   ${a19_projector(1440,560,1.2,g,{rev:bk?1:0,beam:vi?'violet':'white',flick:fl?1:0})}
   ${bk&&!vi?[0,1,2].map(i=>`<path d="M${1300+i*60} 250 a60 60 0 1 0 60 -60" stroke="${P.gold}" stroke-width="8" fill="none" opacity="${(.5+.5*Math.sin(g*8+i)).toFixed(2)}"/>`).join(''):''}
   ${T(960,150,ttl[0],{size:96,fill:ttl[1],sc:pop(t,ttl[2])})}`;
},
antGrow(t,d,p,g){
  const cp=p.carpet??5.39;
  if(t<cp){const k=ease(prog(t,0,cp)), ce=AT(t,p.ceil??1.81), fl=AT(t,p.floor??3.73);
    let lines='';for(let i=0;i<20;i++){const a=i/20*6.283;lines+=`<path d="M${(960+Math.cos(a)*200).toFixed(0)} ${(540+Math.sin(a)*200).toFixed(0)} L${(960+Math.cos(a)*1300).toFixed(0)} ${(540+Math.sin(a)*1300).toFixed(0)}" stroke="#fff" stroke-width="4" opacity="${(.15*k).toFixed(2)}"/>`;}
    const hz=lerp(820,640,fl?prog(t,p.floor??3.73,cp):0);
    return `${card('cardDark',g)}<rect width="1920" height="1080" fill="${P.violet}" opacity=".18"/>${lines}
     ${[480,1440].map(x=>`<g transform="translate(${x},${(lerp(60,-400,ce?prog(t,p.ceil??1.81,cp):0)).toFixed(0)})"><path d="M-60 0 H60 L40 30 H-40Z" fill="#2A2450" stroke="${INK}" stroke-width="5"/><ellipse cy="40" rx="160" ry="34" fill="url(#gGold)" opacity=".4"/></g>`).join('')}
     <rect y="${hz.toFixed(0)}" width="1920" height="${(1080-hz).toFixed(0)}" fill="#5A2A4A"/><path d="M0 ${hz.toFixed(0)} H1920" stroke="${INK}" stroke-width="6"/>
     ${glint({x:960,y:hz-300*lerp(1,.22,k),s:lerp(1,.22,k),t:g,mouth:'o',brows:'raised',pose:'up',blink:0})}
     ${T(960,150,fl?'THE FLOOR RUSHES UP':ce?'THE CEILING SOARS AWAY':'THE ROOM STARTS GROWING',{size:92,fill:P.violet,sc:pop(t,fl?p.floor??3.73:ce?p.ceil??1.81:.05)})}`;}
  const st=AT(t,p.stops??9.29), two=AT(t,p.two??14.08), ant=AT(t,p.ant??16.1);
  return `<rect width="1920" height="1080" fill="#2A1840"/>${a19_fibres(g*.5,.5,'#5A2A4A')}
   ${st?a19_dust(1420,650,1.4*pop(t,p.stops??9.29),g):''}${ant?a19_ant(470,700,.75*pop(t,p.ant??16.1),g):''}
   ${glint({x:860,y:520,s:.85,t:g,mouth:st?'o':'flat',brows:'raised',look:st?1:0,blink:BL(g)})}${two?a19_ruler(1010,780,350,'2 CM'):''}
   <g transform="translate(0,${(1080-prog(t,cp,cp+1)*260).toFixed(0)})">${a19_fibres(g,1)}</g>
   ${T(960,150,ant?'THE SIZE OF A BIG ANT':st?'A DUST BUNNY THE SIZE OF A SOFA':'A FOREST OF CARPET',{size:84,fill:ant?P.gold:P.white,sc:pop(t,ant?p.ant??16.1:st?p.stops??9.29:cp)})}`;
},
antRules(t,d,p,g){
  const sq=p.sq??4.89;
  if(t<sq) return `${bgLab(g)}${T(900,500,'THE RULES',{size:200,fill:P.gold,sc:pop(t,.1)})}${AT(t,p.real??1.53)?T(900,680,'(REAL SCIENCE)',{size:76,fill:P.mint,sc:pop(t,p.real??1.53)}):''}
    ${glint({x:1660,y:560,s:.7,t:g,pose:'point',dir:-1,mouth:'o',brows:'raised',blink:BL(g)})}`;
  const gal=AT(t,p.gal??6.89), sh=AT(t,p.shr??10.44), cu=AT(t,p.cube??14.2);
  return `${card('cardDark',g)}${T(960,150,'THE SQUARE-CUBE LAW',{size:100,fill:P.gold,sc:pop(t,sq)})}
   ${!gal?`${glint({x:960,y:520,s:1,t:g,pose:'up',mouth:'grin',brows:'raised',blink:BL(g)})}${a19_iso(560,860,220,'#6FD3F7',1)}${a19_iso(1400,860,110,'#6FD3F7',1)}`:''}${gal&&!sh?`<g transform="translate(960,560) scale(${pop(t,p.gal??6.89)})">${paper(0,0,1,5,'GALILEO',-4)}</g>${a19_pill(t,960,880,'GALILEO · 1638 · TWO NEW SCIENCES',(p.gal??6.89)+.6,P.mint,40)}`:''}
   ${sh?`${a19_iso(560,800,360,'#6FD3F7',2)}${a19_iso(1360,760,180,'#6FD3F7',1)}<path d="M820 560 L1150 600" stroke="${P.gold}" stroke-width="10" stroke-dasharray="20 14"/>${T(980,540,'SHRINK',{size:56,fill:P.gold,stroke:10})}
     ${a19_pill(t,960,340,'SURFACE & CROSS-SECTION: ÷ SQUARE',(p.shr??10.44)+1.2,P.mint,42)}${cu?a19_pill(t,960,440,'VOLUME & WEIGHT: ÷ CUBE',p.cube??14.2,P.coral,42):''}`:''}`;
},
antScale(t,d,p,g){
  const mu=AT(t,p.mus??3.01), wt=AT(t,p.wt??9.43), mn=AT(t,p.means??13.27);
  if(mn){return `${card('cardMint',g)}${T(960,150,'≈90× STRONGER',{size:110,fill:P.mint,sc:pop(t,p.means??13.27)})}${T(960,240,'(FOR HIS OWN WEIGHT)',{size:54,fill:P.white,sc:pop(t,(p.means??13.27)+.3)})}
     <g transform="translate(560,640)">${a19_beetle(0,0,1.5,g*.4)}<path d="M-120 -170 h240" stroke="${INK}" stroke-width="20"/><circle cx="-130" cy="-170" r="34" fill="#5D6A82" stroke="${INK}" stroke-width="7"/><circle cx="130" cy="-170" r="34" fill="#5D6A82" stroke="${INK}" stroke-width="7"/></g>
     ${T(560,900,'BIG: HEAVY FOR ITS MUSCLE',{size:46,fill:P.coral,stroke:9})}
     <g transform="translate(1360,700)">${a19_beetle(0,0,.5,g*2)}<g transform="translate(0,${(-150+Math.sin(g*3)*10).toFixed(0)})"><path d="M-130 0 h260" stroke="${INK}" stroke-width="16"/><circle cx="-150" r="60" fill="#5D6A82" stroke="${INK}" stroke-width="8"/><circle cx="150" r="60" fill="#5D6A82" stroke="${INK}" stroke-width="8"/></g></g>
     ${T(1360,900,'SMALL: STRONG FOR ITS WEIGHT',{size:46,fill:P.mint,stroke:9})}`;}
  const bar=(y,lab,f,col,txt,a)=>`<g transform="translate(860,${y})" opacity="${a}"><rect x="0" y="-40" width="640" height="80" rx="16" fill="#1A2142" stroke="${INK}" stroke-width="6"/><rect x="6" y="-34" width="${Math.max(10,628*f).toFixed(0)}" height="68" rx="12" fill="${col}"/>${T(-24,18,lab,{size:46,fill:P.white,anchor:'end',stroke:9})}${T(320,120,txt,{size:60,fill:col,stroke:11})}</g>`;
  const k1=mu?1-eout(prog(t,(p.mus??3.01)+1,(p.mus??3.01)+3))*.9:1, k2=wt?1-eout(prog(t,(p.wt??9.43)+.5,(p.wt??9.43)+2.5))*.995:1;
  return `${card('cardDark',g)}${T(960,150,'90 TIMES SHORTER',{size:100,fill:P.gold,sc:IN(t,.1)})}
   <g opacity="${mu?.35:1}">${glint({x:400,y:440,s:1.15,t:g,mouth:'smile',blink:BL(g)})}<path d="M640 120 V800" stroke="${P.gold}" stroke-width="6" stroke-dasharray="14 10"/>${a19_tg(760,800,.013*90/10,g)}</g>
   ${mu?bar(400,'MUSCLE',k1,P.mint,'÷ ~8,000',1):''}${wt?bar(640,'WEIGHT',k2,P.coral,'÷ 700,000+',pop(t,p.wt??9.43)):''}`;
},
antRules2(t,d,p,g){
  const c=[['AIR',' > GRAVITY',0,P.ice],['WATER',' = GLUE',p.water??2.56,a19_TEA],['SQUEAKY VOICE','',p.voice??4.95,P.gold],['BRAIN WORKS','',p.fic??12.73,P.violet]];
  const pos=[[520,380],[1400,380],[520,700],[1400,700]];let s='';
  c.forEach(([a,b,at,col],i)=>{if(!AT(t,at))return;const [x,y]=pos[i];const k=pop(t,at);
    let ic='';if(i===0)ic=`<g transform="translate(-230,0)"><path d="M-50 -10 Q0 -80 50 -10Z" fill="${P.coral}" stroke="${INK}" stroke-width="6"/><path d="M-50 -10 L0 40 L50 -10" stroke="${INK}" stroke-width="4" fill="none"/>${[-40,0,40].map(dx=>`<path d="M${dx} 90 v-30" stroke="${P.ice}" stroke-width="6" marker-end=""/>`).join('')}</g>`;
    if(i===1)ic=`<g transform="translate(-230,40)">${a19_drop(0,0,60,g)}</g>`;
    if(i===2)ic=a19_wave(-300,0,130,26,22,g*14,P.gold,5);
    if(i===3)ic=`<g transform="translate(-230,0)">${brain(0,0,.32,1,g)}</g>`;
    ic=`<g transform="translate(-230,0) scale(1.5) translate(230,0)">${ic}</g>`;s+=`<g transform="translate(${x},${y}) scale(${k.toFixed(3)})"><rect x="-370" y="-110" width="740" height="220" rx="24" fill="#120E24" stroke="${col}" stroke-width="8"/>${ic}${T(70,b?-4:20,a,{size:58,fill:col})}${b?T(70,60,b.trim(),{size:50,fill:P.white}):''}</g>`;});
  const real=AT(t,p.real??6.58), fic=AT(t,p.pure??14.75);
  return `${card('cardDark',g)}${s}${real?`<g transform="translate(820,610) rotate(-8) scale(${pop(t,p.real??6.58)})">${labelPill(0,0,'REAL',P.mint,44)}</g>`:''}
   ${fic?stamp(1430,710,.7,'FICTION',P.coral,-10):AT(t,p.fic??12.73)?`<g transform="translate(1440,780)">${labelPill(0,0,'IN THIS WORLD',P.coral,34)}</g>`:''}
   ${T(960,150,AT(t,p.voice??4.95)&&!AT(t,p.fic??12.73)?'SMALLER CORDS = HIGHER PITCH':'MORE RULES',{size:84,fill:P.white,sc:pop(t,AT(t,p.voice??4.95)&&!AT(t,p.fic??12.73)?p.voice+2:.1)})}`;
},
antStrength(t,d,p,g){
  const cb=p.cube??5.23, ants=p.ants??14.12, ch=p.cheer??23, bw=p.bow??24.46, dr=p.drop??26;
  if(t<cb) return `${a19_kitchen(g,{heat:0,nanOn:0})}${person({x:960,y:560,s:1,t:g,who:'kai',legs:'walk',pose:'hold',mouth:'grin',blink:BL(g)})}${a19_matchbox(1020,630,.5)}${a19_tg(1000,602,.05,g,{mark:1})}
    ${a19_pill(t,1060,250,'HOME IN A MATCHBOX',p.kai??2.43,P.gold,46)}${a19_pm(t,'plus','STRENGTH')}`;
  if(t<ants||t>=ch){const lift=AT(t,cb+1.2)?eout(prog(t,cb+1.2,cb+2.6)):0, drop=AT(t,dr)?eout(prog(t,dr,dr+.35)):0;
    const cy=t>=ch?lerp(380,640,drop):lerp(640,330,lift);const bow=t>=bw&&!AT(t,dr);
    return `${a19_counterTop(g)}${t>=ch?`<g transform="translate(1560,380)">${person({x:0,y:0,s:2.4,t:g,who:'kai',pose:'up',mouth:'laugh',brows:'raised',blink:BL(g)})}</g>`:''}
     ${glint({x:860,y:600-(bow?-20:0),s:.85,t:g,pose:lift>.5&&t<bw?'up':bow?'down':'reach',mouth:drop>.9?'teeth':lift>.5?'grin':'o',brows:drop>.9?'angry':'raised',rot:bow?28:0,blink:BL(g),legs:drop>.9?'wobble':'stand'})}
     ${a19_cube(t>=ch?960:860,cy,250,t>=ch?drop*12:0)}
     ${drop>.9?`${T(1050,620,'OW!',{size:120,fill:P.red,sc:pop(t,dr+.35)})}${[0,1,2].map(i=>`<g transform="translate(${(960+Math.cos(g*4+i*2)*120).toFixed(0)},${(560+Math.sin(g*4+i*2)*40).toFixed(0)})"><path d="M0 -20 L6 -6 L20 0 L6 6 L0 20 L-6 6 L-20 0 L-6 -6Z" fill="${P.gold}" stroke="${INK}" stroke-width="3"/></g>`).join('')}`:''}
     ${t<ch&&AT(t,p.forty??10.6)?`${a19_pill(t,1450,420,'SUGAR CUBE ≈ 4 g',p.forty??10.6,'#FFF6EA',44)}${a19_pill(t,1450,530,'GLINT ≈ 0.1 g',(p.forty??10.6)+.4,P.mint,44)}${T(1450,690,'≈ 40×',{size:150,fill:P.gold,sc:pop(t,(p.forty??10.6)+.8)})}`:''}
     ${T(960,150,t>=ch?(bow?'TA-DAA...':'KAI CHEERS'):'LIFTS IT OVER HIS HEAD',{size:92,fill:t>=ch?P.mint:P.white,sc:pop(t,t>=ch?(bow?bw:ch):cb+1.2)})}`;}
  const mg=AT(t,p.magic??19.67);
  return `${card('cardMint',g)}${a19_ant(900,600,1.4,g,{load:1})}${a19_pill(t,960,860,'MANY ANTS: 10–50× THEIR WEIGHT',(p.many??16.35),P.gold,46)}
   ${mg?`<g transform="translate(1560,380) scale(${pop(t,p.magic??19.67)})">${labelPill(0,0,'NOT MAGIC',P.coral,44)}</g>`:''}${AT(t,p.small??21.23)?`<g transform="translate(1560,480) scale(${pop(t,p.small??21.23)})">${labelPill(0,0,'JUST SMALL',P.mint,44)}</g>`:''}
   ${T(960,150,'REAL ANTS DO THIS',{size:100,fill:P.white,sc:pop(t,ants)})}`;
},
antWater(t,d,p,g){
  const ts=p.ten??9.39;
  if(t<ts){const tc=AT(t,p.touch??6.8), gr=AT(t,p.grab??7.92);const gx=tc?900:lerp(420,860,prog(t,2.3,6.5));
    return `${a19_counterTop(g)}${gr?`<g transform="translate(${gx},${560+Math.sin(g*3)*6})">${glint({x:0,y:0,s:.85,t:g,pose:'up',mouth:'o',brows:'raised',legs:'wobble',blink:0})}</g>`:''}
     ${a19_drop(1100,760,gr?300:260,g,{wob:gr?1:0})}${!gr?glint({x:gx,y:520,s:.85,t:g,legs:tc?'stand':'walk',pose:tc?'reach':'down',mouth:'smile',blink:BL(g)}):''}
     ${gr?T(1060,250,'IT GRABS HIM',{size:96,fill:P.red,sc:pop(t,p.grab??7.92)}):AT(t,2.4)?T(1060,250,'A DROP OF SPILLED TEA',{size:84,fill:P.gold,sc:pop(t,2.4)}):''}${a19_pm(t,'minus','WATER')}`;}
  const yo=AT(t,p.you??14.7), hr=AT(t,p.hairs??20.6), kai=AT(t,p.kai??25.85), dk=AT(t,p.drink??29.28);
  if(kai){const wick=prog(t,(p.kai??25.85)+.6,(p.kai??25.85)+2.4);
    if(dk)return `${a19_counterTop(g)}${[0,1,2,3,4].map(i=>a19_drop(700+i*130,770,26+(i%2)*8,g+i)).join('')}${glint({x:1100,y:520,s:.85,t:g,pose:'reach',mouth:'smile',blink:BL(g)})}<circle cx="980" cy="560" r="20" fill="${a19_TEA}" fill-opacity=".8" stroke="${INK}" stroke-width="5"/>
      ${T(960,180,'TINY BEADS. VERY CAREFULLY.',{size:84,fill:P.mint,sc:pop(t,p.drink??29.28)})}`;
    return `${a19_counterTop(g)}${a19_drop(1100,760,300*(1-wick*.7),g)}<g transform="translate(${lerp(1900,1250,eout(prog(t,p.kai??25.85,(p.kai??25.85)+.6)))},300) rotate(20)"><path d="M0 0 L-260 460 L260 460Z" fill="#FFF6EA" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M-260 460 L260 460 L${-260+520*.5} ${460-460*wick*.5}Z" fill="${a19_TEA}" opacity=".5"/>${[0,1,2,3].map(i=>`<circle cx="${-120+i*80}" cy="380" r="8" fill="#D8D2C8"/>`).join('')}</g>
     ${glint({x:wick>.6?760:1060,y:wick>.6?520:560,s:.85,t:g,pose:wick>.6?'shrug':'up',mouth:wick>.6?'grin':'o',brows:'raised',blink:BL(g)})}${T(960,180,'PAPER TOWEL RESCUE',{size:92,fill:P.gold,sc:pop(t,p.kai??25.85)})}`;}
  if(hr){const sc=AT(t,p.scarf??24.07);let hairs='';for(let i=0;i<14;i++)hairs+=`<path d="M${-180+i*26} -20 l${8} -36" stroke="${INK}" stroke-width="5"/>`;
    return `${card('cardIce',g)}<g transform="translate(540,620) scale(1.5)"><path d="M-220 0 Q0 -60 220 0 L220 40 Q0 0 -220 40Z" fill="#3A2A2A" stroke="${INK}" stroke-width="8"/>${hairs}${[0,1,2].map(i=>a19_drop(-120+i*120,-80-Math.abs(Math.sin(g*2+i))*30,30,g)).join('')}</g>
     ${T(540,840,'WATER-REPELLENT HAIRS',{size:52,fill:P.mint,stroke:10})}
     ${sc?`${glint({x:1380,y:500,s:.85,t:g,mouth:'flat',brows:'sad',pose:'shrug',blink:BL(g)})}<path d="M1420 540 q10 40 0 60" stroke="${a19_TEA}" stroke-width="10" fill="none"/>${T(1380,840,'GLINT: A SCARF',{size:56,fill:P.coral,sc:pop(t,p.scarf??24.07)})}`:''}
     ${T(960,150,'HOW INSECTS SURVIVE',{size:96,fill:P.white,sc:pop(t,hr)})}`;}
  if(yo){const an=AT(t,p.ant??17.21);
    return `${card('cardIce',g)}<rect x="955" y="220" width="10" height="680" fill="#fff" opacity=".2"/>
     <g transform="translate(500,620)">${a19_drop(0,40,90,g)}${a19_hand(80,-120,1,-80,'#F2C9A0')}</g>${T(500,860,'FOR YOU: NOTHING',{size:56,fill:P.white,sc:pop(t,p.you??14.7)})}
     ${an?`<g transform="translate(1420,640)">${a19_drop(0,120,300,g,{wob:1})}${glint({x:0,y:-140,s:.6,t:g,pose:'up',mouth:'o',brows:'raised',legs:'wobble',blink:0})}</g>${T(1420,860,'ANT-SIZED: A TRAP',{size:56,fill:P.red,sc:pop(t,p.ant??17.21)})}`:''}
     ${T(960,150,'SURFACE TENSION',{size:110,fill:P.ice,sc:pop(t,ts)})}`;}
  let mol='';for(let i=0;i<9;i++)for(let j=0;j<3;j++){const x=420+i*135,y=520+j*120+Math.sin(g*2+i+j)*5;mol+=`<circle cx="${x}" cy="${y.toFixed(0)}" r="36" fill="#6FD3F7" stroke="${INK}" stroke-width="6"/>`;if(i<8&&j===0)mol+=`<path d="M${x+38} ${y.toFixed(0)} q30 ${(-14+Math.sin(g*6+i)*8).toFixed(0)} 60 0" stroke="${P.gold}" stroke-width="8" fill="none"/>`;}
  return `${card('cardIce',g)}<rect x="360" y="470" width="1200" height="400" rx="20" fill="#1D5A80" opacity=".5"/><path d="M360 482 H1560" stroke="#fff" stroke-width="6" opacity=".6"/>${mol}
   ${T(960,150,'SURFACE TENSION',{size:110,fill:P.ice,sc:pop(t,ts)})}${a19_pill(t,960,340,'THE SURFACE PULLS TOGETHER: A STRETCHY SKIN',(p.skin??11.11),P.gold,40)}`;
},
antFall(t,d,p,g){
  const rt=AT(t,p.right??8.31), sm=AT(t,p.small??9.72), hd=AT(t,p.hald??16.94), ins=AT(t,p.ins??25.95);
  if(!sm) return `${a19_counterTop(g)}<g transform="translate(1500,420)">${person({x:0,y:0,s:2.3,t:g,who:'kai',pose:'point',mouth:'grin',brows:'raised',blink:BL(g)})}</g>
    ${glint({x:600,y:520,s:.85,t:g,mouth:rt?'o':'flat',brows:'raised',pose:'shrug',blink:BL(g)})}
    ${AT(t,p.idea??2.16)?a19_bubble(820,240,780,"\"YOU CAN'T GET HURT",'FALLING. RIGHT?"',{tail:'right',size:48}):''}${rt?stamp(1060,560,.8,'KAI IS RIGHT',P.mint,-10):''}
    ${a19_pm(t,'plus','FALLING')}`;
  if(hd){const k=((t-(p.hald??16.94))*.25)%1;
    return `${card('cardDark',g)}<rect x="760" y="230" width="400" height="660" fill="#0A0716" stroke="#5A4A3A" stroke-width="16"/>${[0,1,2,3,4,5].map(i=>`<path d="M760 ${300+i*100} H1160" stroke="#3A2A1A" stroke-width="6"/>`).join('')}
     <g transform="translate(960,${(280+eout(Math.min(1,k*1.4))*520).toFixed(0)})">${icon('rat',0,0,.55)}</g>${k>.75?T(1360,820,'...WALKS AWAY',{size:56,fill:P.mint}):''}
     ${T(960,150,'J. B. S. HALDANE',{size:96,fill:P.gold,sc:pop(t,p.hald??16.94)})}${a19_pill(t,400,500,'1926',(p.hald??16.94)+.5,P.white,50)}${T(400,620,'"ON BEING',{size:44,fill:P.white,stroke:8})}${T(400,680,'THE RIGHT SIZE"',{size:44,fill:P.white,stroke:8})}
     ${ins?`<g transform="translate(1500,${(400+Math.sin(g)*40).toFixed(0)})">${a19_ant(0,0,.35,g)}</g>${a19_pill(t,1500,560,'INSECTS: TINIER STILL',p.ins??25.95,P.mint,40)}`:''}`;}
  const k1=((t*.9)%1), k2=((t*.22)%1);
  return `${card('cardDark',g)}<g transform="translate(560,${(260+k1*500).toFixed(0)})">${person({x:0,y:0,s:.5,t:g,who:'kai',pose:'up',mouth:'o'})}</g><path d="M680 300 V860" stroke="${P.red}" stroke-width="14"/>
   <g transform="translate(1360,${(300+k2*460).toFixed(0)})">${glint({x:0,y:0,s:.42,t:g,pose:'up',mouth:'grin',blink:0})}${[-60,0,60].map(dx=>`<path d="M${dx} 210 v-60" stroke="${P.ice}" stroke-width="10" stroke-linecap="round" opacity="${(.5+.5*Math.sin(g*6+dx)).toFixed(2)}"/>`).join('')}</g>
   ${T(560,900,'TOP SPEED: HIGH',{size:56,fill:P.red,stroke:10})}${T(1360,900,'TOP SPEED: LOW',{size:56,fill:P.mint,stroke:10})}
   ${a19_pill(t,1360,250,'AIR RESISTANCE ≫ WEIGHT',(p.small??9.72)+2.5,P.ice,40)}${T(960,150,'TERMINAL VELOCITY',{size:100,fill:P.gold,sc:pop(t,p.small??9.72)})}`;
},
antJumps(t,d,p,g){
  const fr=AT(t,p.four??5.58), fun=AT(t,p.fun??7.7);const per=2.2, n=fr?Math.min(5,1+Math.floor((t-(p.four??5.58))/1.1)+1):1;
  const k=fr?((t-(p.four??5.58))/1.1)%1:prog(t,.6,2.6);const fx=lerp(560,700,k), fy=lerp(300,820,k);const land=k>.97||(!fr&&AT(t,2.6));
  return `${a19_counterTop(g,{top:'#3E3352',wall:'#252B52'})}<rect x="-20" y="250" width="560" height="60" fill="#8A6A4A" stroke="${INK}" stroke-width="9"/><rect x="380" y="310" width="70" height="420" fill="#6A4A2A" stroke="${INK}" stroke-width="8"/>
   ${land&&!fr?glint({x:740,y:520,s:.6,t:g,pose:'up',mouth:'grin',brows:'raised',blink:BL(g)}):glint({x:fx,y:fy-300*.6,s:.6,t:g,pose:'up',mouth:'grin',brows:'raised',blink:0})}
   ${!land?[-40,0,40].map(dx=>`<path d="M${fx+dx} ${fy+40} v-50" stroke="${P.ice}" stroke-width="8" stroke-linecap="round" opacity=".7"/>`).join(''):`${T(780,860,'BUMP',{size:56,fill:P.gold,stroke:10})}`}
   ${fr?`<g transform="translate(1500,520)">${labelPill(0,0,'× '+n,P.gold,90)}</g>`:''}
   ${T(960,150,fun?'BEST FUN IN YEARS':'A GENTLE BUMP',{size:100,fill:fun?P.mint:P.white,sc:pop(t,fun?p.fun??7.7:p.drift??2.33)})}`;
},
antVoices(t,d,p,g){
  const fl=AT(t,p.flies??6.77), wd=AT(t,p.world??11.51);
  return `${card('cardDark',g)}${a19_strip(700,460,6,900,P.gold,g,'PEOPLE')}${fl?a19_strip(700,640,24,900,P.mint,g*4,'FLIES'):''}
   ${a19_pill(t,1150,330,'FLICKERS PER SECOND',p.flies??6.77,P.white,40)}
   ${wd?`<rect width="1920" height="1080" fill="#05030C" opacity=".6"/><g transform="translate(960,560) scale(${pop(t,p.world??11.51)})">${brain(0,0,.9,1,g*6)}</g>${[0,1,2].map(i=>`<circle cx="960" cy="560" r="${200+i*40}" fill="none" stroke="${P.violet}" stroke-width="6" stroke-dasharray="20 20" transform="rotate(${(g*400*(i%2?1:-1)).toFixed(0)} 960 560)"/>`).join('')}
     <g transform="translate(960,860)">${labelPill(0,0,'IN THIS WORLD: HIS BRAIN SPEEDS UP',P.coral,40)}</g>`:''}
   ${T(1120,150,'SMALL = FASTER TIME',{size:90,fill:P.gold,sc:pop(t,p.small??2.71)})}${a19_pm(t,'minus','VOICES')}`;
},
antWaves(t,d,p,g){
  const wh=AT(t,p.whale??4.4), own=AT(t,p.own??7.88);
  return `${card('cardIce',g)}${wh?`<g opacity=".55">${a19_whale(1400,330,.8*pop(t,p.whale??4.4),g)}</g>`:''}
   <g transform="translate(150,520)">${person({x:0,y:0,s:1.6,t:0,who:'nan',mouth:Math.sin(g*1.2)>0?'o':'smile',brows:'calm',blink:BL(g)})}</g>
   ${a19_wave(380,470,1150,90,560,g*1.3,P.violet,14)}${T(960,640,'SLOW... DEEP...',{size:64,fill:P.violet,stroke:12,sc:IN(t,.3)})}
   ${own?`${a19_wave(380,770,1150,24,26,g*30,P.gold,5)}${T(960,880,'HIGH, THIN WHISTLE',{size:56,fill:P.gold,sc:pop(t,p.own??7.88)})}`:''}
   ${glint({x:1700,y:own?620:600,s:.45,t:g,mouth:own?'o':'flat',brows:'raised',pose:own?'up':'down',blink:BL(g)})}
   ${T(960,150,wh?'LIKE A WHALE UNDERWATER':'EVERYONE TALKS SLOWLY',{size:88,fill:P.white,sc:pop(t,wh?p.whale??4.4:.1)})}`;
},
antHearing(t,d,p,g){
  const ol=AT(t,p.older??2.36), ln=AT(t,p.lean??8.55), sh=AT(t,p.shout??14.48), ct=AT(t,p.cant??15.67);
  if(ln){return `${a19_counterTop(g)}<g transform="translate(1250,360)">${person({x:0,y:0,s:2.6,t:g,who:'nan',mouth:ct?'flat':'o',brows:ct?'sad':'raised',look:-1,blink:BL(g)})}</g>
     ${a19_matchbox(560,800,1.4)}${glint({x:540,y:536,s:.6,t:g,pose:sh?'up':'down',mouth:sh?'o':'smile',brows:sh?'angry':'calm',blink:BL(g)})}${sh?a19_squeak(620,560,g,1,1,.6):''}
     ${!sh?a19_bubble(1000,200,700,'"GLINT, LOVE?','ARE YOU TALKING?"',{tail:'right',size:48}):''}${ct?T(960,180,"SHE CAN'T HEAR HIM AT ALL",{size:84,fill:P.red,sc:pop(t,p.cant??15.67)}):sh?T(960,180,"HE'S SHOUTING",{size:96,fill:P.gold,sc:pop(t,p.shout??14.48)}):''}`;}
  return `${card('cardDark',g)}${!ol?`<g transform="translate(560,560)">${person({x:0,y:0,s:1.1,t:g,who:'kai',mouth:'o',brows:'raised',pose:'hips',blink:BL(g)})}</g>${a19_squeak(1100,420,g,1,-1,1)}${glint({x:1250,y:500,s:.5,t:g,mouth:'o',blink:BL(g)})}${T(960,150,'KAI CAN HEAR IT. JUST.',{size:92,fill:P.mint,sc:pop(t,.1)})}`
    :`${T(960,150,'THE HIGHEST SOUNDS GO FIRST',{size:84,fill:P.white,sc:pop(t,p.older??2.36)})}${T(1100,320,'LOW → HIGH PITCH',{size:44,fill:P.ice,stroke:9})}
      ${a19_range(560,440,1100,.95,P.mint,'YOUNG')}${a19_range(560,580,1100,.62,P.violet,'OLDER',{fade:.12})}
      <g transform="translate(1600,720)"><path d="M0 -380 V40" stroke="${P.gold}" stroke-width="8" stroke-dasharray="16 12"/>${glint({x:0,y:-50,s:.3,t:g,mouth:'o',blink:BL(g)})}</g>${T(1600,830,"GLINT'S VOICE",{size:44,fill:P.gold,stroke:9})}`}`;
},
antCold(t,d,p,g){
  const sk=AT(t,p.skin??2.78), sr=AT(t,p.shrew??8.64), sv=AT(t,p.shiv??13.43);
  if(sv) return `${a19_counterTop(g,{wall:'#1E2A50'})}${[0,1,2,3,4,5].map(i=>`<rect x="${640+i*130}" y="${780+(i%3)*30}" width="${30+(i%2)*20}" height="${26+(i%3)*10}" rx="6" fill="#D9A23A" stroke="${INK}" stroke-width="5" transform="rotate(${i*30} ${660+i*130} ${790+(i%3)*30})"/>`).join('')}
    ${glint({x:960,y:540,s:.9,t:g,pose:'reach',mouth:'wavy',brows:'sad',shiver:1,frost:.25,blink:BL(g)})}<rect x="1080" y="560" width="40" height="34" rx="6" fill="#D9A23A" stroke="${INK}" stroke-width="5"/>
    ${T(960,150,'SHIVERING. EATING CRUMBS.',{size:88,fill:P.ice,sc:pop(t,p.shiv??13.43)})}`;
  if(sr) return `${card('cardWarm',g)}${a19_shrew(900,560,1.4,g)}${T(960,150,'SHREWS EAT ALMOST NON-STOP',{size:84,fill:P.gold,sc:pop(t,p.shrew??8.64)})}`;
  const arrows=(x,y,r,n,col)=>[...Array(n)].map((_,i)=>{const a=i/n*6.283+g*.3,k=((g*.8+i/n)%1);return `<path d="M${(x+Math.cos(a)*(r+10+k*60)).toFixed(0)} ${(y+Math.sin(a)*(r+10+k*60)).toFixed(0)} l${(Math.cos(a)*30).toFixed(0)} ${(Math.sin(a)*30).toFixed(0)}" stroke="${col}" stroke-width="10" stroke-linecap="round" opacity="${(1-k).toFixed(2)}"/>`;}).join('');
  return `${card('cardIce',g)}${sk?`<circle cx="560" cy="540" r="220" fill="${P.warm}" stroke="${INK}" stroke-width="9"/>${arrows(560,540,220,10,P.red)}${T(560,880,'BIG: KEEPS ITS HEAT',{size:52,fill:P.white,stroke:10})}
    <circle cx="1360" cy="540" r="70" fill="${P.warm}" stroke="${INK}" stroke-width="7"/>${arrows(1360,540,70,10,P.red)}${T(1360,880,'SMALL: LOSES IT FAST',{size:52,fill:P.red,stroke:10})}
    ${a19_pill(t,960,300,'SO MUCH SKIN, SO LITTLE BODY',(p.skin??2.78)+2.5,P.gold,44)}`:''}${a19_pm(t,'minus','EVERYTHING ELSE')}`;
},
antPickles(t,d,p,g){
  const ct=AT(t,p.cats??1.78), hn=AT(t,p.hunt??5.69), er=AT(t,p.ears??9.36);
  const sp=er&&Math.sin(g*1.3)>0;const ears=er?(sp?-1:0):0;
  return `${a19_counterTop(g,{wall:'#1C1838',top:'#3E3352'})}${a19_catFace(1250,560,1.25,g,{ears,slit:!sp})}
   ${glint({x:380,y:600,s:.55,t:g,mouth:sp?'o':'flat',brows:'raised',look:1,blink:BL(g)})}${er&&sp?a19_squeak(440,560,g,1,1,1.4):''}
   ${ct&&!er?`<rect x="60" y="220" width="760" height="240" rx="20" fill="#0B1026" fill-opacity=".85" stroke="${P.mint}" stroke-width="6"/>${a19_range(330,290,440,.31,P.white,'HUMAN')}${a19_range(330,380,440,1,a19_FUR,'CAT')}${T(440,440,'~20 kHz vs ~64 kHz',{size:36,fill:P.ice,stroke:7})}`:''}
   ${hn&&!er?`<g transform="translate(560,820) scale(${pop(t,p.hunt??5.69)})">${icon('rat',0,0,.8)}</g>${T(780,830,'SQUEAK!',{size:56,fill:P.gold,sc:pop(t,(p.hunt??5.69)+.4)})}`:''}
   ${T(960,150,er?'EARS SWIVEL TOWARD HIM':ct?'CATS HEAR HIGHER':'MR. PICKLES',{size:96,fill:er?P.coral:ct?P.gold:a19_FUR,sc:pop(t,er?p.ears??9.36:ct?p.cats??1.78:.1)})}`;
},
antFridge(t,d,p,g){
  const pu=AT(t,p.puts??4.84), nn=AT(t,p.nan??8.61), bk=AT(t,p.bakes??13.25);
  if(!pu) return `${card('cardDark',g)}<g transform="translate(${lerp(560,1500,prog(t,.5,4.5)).toFixed(0)},540)">${person({x:0,y:0,s:1,t:g,who:'kai',legs:'walk',pose:'up',mouth:'grin',brows:'angry',blink:BL(g)})}</g>
    ${T(960,150,'KAI RACES TO THE MUSEUM',{size:88,fill:P.white,sc:pop(t,.1)})}${a19_pill(t,960,880,'HELP DR. OSEI REVERSE THE PROJECTOR',1.6,P.mint,42)}`;
  return `${a19_kitchen(g,{heat:bk?1:0,nanOn:0})}${!nn?`${person({x:560,y:520,s:1,t:g,who:'kai',pose:'up',mouth:'smile',blink:BL(g)})}`:''}${a19_tg(270,180,.1,g)}${pickles(330,880,.7,g,{mood:'grump'})}
   ${nn?person({x:bk?980:760,y:520,s:1,t:g,who:'nan',pose:bk?'hold':'hips',mouth:'frown',brows:'sad',sweat:bk?0:1,legs:bk?'stand':'walk',blink:BL(g)}):''}
   ${bk?`<g transform="translate(1040,600)"><path d="M-90 0 Q-80 80 0 84 Q80 80 90 0Z" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/><ellipse rx="90" ry="16" fill="#F4E2B0" stroke="${INK}" stroke-width="6"/></g>`:''}
   ${T(960,150,bk?'SHE BAKES':nn?'NAN, WORRIED SICK':"WHERE THE CAT CAN'T REACH",{size:88,fill:bk?P.gold:P.white,sc:pop(t,bk?p.bakes??13.25:nn?p.nan??8.61:p.puts??4.84)})}`;
},
antCrisis(t,d,p,g){
  const sit=AT(t,p.sit??4.53), cl=AT(t,p.close??9.08), wa=AT(t,p.watch??10.96), sm=AT(t,p.smoke??15.8), sh=AT(t,p.shim??14.03);
  const tmr=sm?`<g transform="translate(1660,120) scale(${pop(t,p.smoke??15.8)})">${a19_timer(a19_left(g),g,{x:0,y:0})}</g>`:'';
  if(wa) return `${a19_fridgeTop(g,{smoke:sm?1:0,th:.05,shim:sh?1:0,nan:'doze'})}${glint({x:480,y:400,s:.75,t:g,mouth:sm?'o':'flat',brows:sm?'raised':'calm',look:1,blink:BL(g)})}
    ${T(820,150,sm?'A THIN GREY THREAD':sh?'THE OIL SHIMMERS':'WATCHING FROM THE FRIDGE',{size:84,fill:sm?P.red:P.white,sc:pop(t,sm?p.smoke??15.8:sh?p.shim??14.03:p.watch??10.96)})}${tmr}`;
  return `${a19_kitchen(g,{heat:1,nan:cl?'doze':'awake',nanOn:sit})}${!sit?person({x:1200,y:520,s:1,t:g,who:'nan',legs:'walk',mouth:'smile',blink:BL(g)}):''}${a19_tg(270,180,.1,g)}
   ${T(960,150,cl?'HER EYES CLOSE':sit?'JUST FOR A MINUTE':'DOUGHNUTS',{size:96,fill:cl?P.ice:P.gold,sc:pop(t,cl?p.close??9.08:sit?p.sit??4.53:.1)})}`;
},
antOilSci(t,d,p,g){
  const fl=AT(t,p.flames??3.5), fr=AT(t,p.fires??6.81);const lvl=fl?.82+.04*Math.sin(g*3):.6;
  return `${card('cardWarm',g)}${a19_pan(760,620,1.9,g,{heat:1,shim:1})}${a19_smoke(760,560,g,1,.4,380)}
   ${fl?`<g opacity="${(.35+.2*Math.sin(g*6)).toFixed(2)}">${[0,1,2].map(i=>`<path d="M${600+i*160} 560 Q${560+i*160} 400 ${640+i*160+Math.sin(g*4+i)*20} 280 Q${740+i*160} 420 ${680+i*160} 560Z" fill="none" stroke="${P.warm}" stroke-width="8" stroke-dasharray="18 12"/>`).join('')}</g>`:''}
   <g transform="translate(1480,760)"><rect x="-40" y="-520" width="80" height="540" rx="40" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><rect x="-22" y="${(-520*lvl).toFixed(0)}" width="44" height="${(520*lvl).toFixed(0)}" rx="18" fill="${P.red}"/><circle cy="30" r="60" fill="${P.red}" stroke="${INK}" stroke-width="8"/>
    ${[['FLAMES',-470,P.red],['SMOKING',-330,P.gold],['HEATING',-170,P.white]].map(([s,y,c])=>T(70,y+14,s,{size:40,fill:c,anchor:'start',stroke:8})).join('')}</g>
   ${fr?`<g transform="translate(960,890) scale(${pop(t,p.fires??6.81)})">${labelPill(0,0,'A TOP WAY KITCHEN FIRES START',P.red,44)}</g>`:''}
   ${T(820,150,fl?'IT CAN BURST INTO FLAMES':'SMOKE = DANGEROUSLY HOT',{size:84,fill:fl?P.red:P.gold,sc:pop(t,fl?p.flames??3.5:.1)})}${a19_timer(a19_left(g),g)}`;
},
antYell(t,d,p,g){
  const hi=AT(t,p.high??3.16), ph=AT(t,p.phone??7.16), fa=AT(t,p.faint??8.58), fi=AT(t,p.finger??13.02), st=AT(t,p.strong??16.02);
  if(!ph) return `${a19_kitchen(g,{smoke:1,th:.25,nan:'doze'})}${a19_tg(270,180,.1,g)}${a19_inset(620,470,190,`${glint({x:620,y:430,s:1,t:g,mouth:'o',brows:'angry',pose:'up',blink:0})}`,270,140,'a19i2')}
    ${a19_squeak(300,140,g,1,1,.7)}${hi?`<g transform="translate(1100,300) scale(${pop(t,p.high??3.16)})">${labelPill(0,0,'TOO HIGH. TOO SMALL.',P.red,48)}</g>`:''}
    ${T(820,150,AT(t,p.stir??1.47)?"NAN DOESN'T STIR":'GLINT YELLS',{size:92,fill:P.white,sc:pop(t,AT(t,p.stir??1.47)?p.stir??1.47:.1)})}${a19_timer(a19_left(g),g)}`;
  if(st) return `${a19_counterTop(g)}${glint({x:820,y:520,s:.85,t:g,pose:'reach',mouth:'teeth',brows:'angry',legs:'wobble',blink:0,sweat:1})}<g transform="translate(1160,700) rotate(90)">${a19_phone(0,0,2.2)}</g>
    <g transform="translate(560,300) scale(${pop(t,p.strong??16.02)})">${labelPill(0,0,'90× STRONGER FOR HIS SIZE',P.mint,40)}</g>${AT(t,p.human??20.85)?`<g transform="translate(1300,300) scale(${pop(t,p.human??20.85)})">${labelPill(0,0,'HUMAN-SIZED WORLD',P.red,40)}</g>`:''}
    ${T(820,150,'STILL NOT STRONG',{size:96,fill:P.white,sc:pop(t,p.strong??16.02)})}${a19_timer(a19_left(g),g)}`;
  return `${a19_counterTop(g)}<g transform="translate(1160,700) rotate(90)">${a19_phone(0,0,2.2,{lit:fi?1:0})}</g>
   ${glint({x:fi?900:600,y:520,s:.85,t:g,pose:fi?'point':'up',mouth:'o',brows:'raised',blink:BL(g)})}
   ${fa&&!fi?`<g transform="translate(600,330)"><rect x="-300" y="-110" width="600" height="190" rx="18" fill="#0B1026" fill-opacity=".9" stroke="${P.ice}" stroke-width="6"/><rect x="-280" y="-30" width="300" height="70" rx="10" fill="${P.mint}" opacity=".35"/>${T(-130,16,'PHONE BAND',{size:32,fill:P.white,stroke:6})}
     ${a19_wave(60,0,200,22,18,g*24,P.gold,4)}${icon('cross',220,-50,.45)}${T(0,-60,'~300–3,400 Hz',{size:40,fill:P.ice,stroke:8})}</g>`:''}
   ${fi?`<circle cx="1070" cy="520" r="${(10+((g*2)%1)*30).toFixed(0)}" fill="none" stroke="#fff" stroke-width="4" opacity=".7"/>${T(1100,420,'TOO TINY',{size:60,fill:P.red,sc:pop(t,p.finger??13.02)})}`:''}
   ${T(820,150,fi?'THE SCREEN IGNORES HIM':fa?'TOO HIGH, TOO FAINT':'THE PHONE',{size:90,fill:P.white,sc:pop(t,fi?p.finger??13.02:fa?p.faint??8.58:p.phone??7.16)})}${a19_timer(a19_left(g),g)}`;
},
antDistance(t,d,p,g){
  const ch=AT(t,p.chair??1.78), pi=AT(t,p.pitch??4.59), tm=AT(t,p.time??8.81), sk=AT(t,p.shake??13.62), cp=AT(t,p.clip??15.54), rb=AT(t,p.ribbon??17.7), ck=AT(t,p.clock??20.29);
  if(ck){const tick=Math.floor((t-(p.clock??20.29))/1.3)%2, ph=((t-(p.clock??20.29))/1.3)%1;
    return `${card('cardDark',g)}${[0,1,2].map(i=>`<circle cx="960" cy="520" r="${(260+((ph+i/3)%1)*420).toFixed(0)}" fill="none" stroke="${P.gold}" stroke-width="8" opacity="${(.6*(1-((ph+i/3)%1))).toFixed(2)}"/>`).join('')}
     ${a19_clock(960,520,250,21.6+(t-(p.clock??20.29))/3600*20)}${T(960,880,tick?'...TOCK':'TICK...',{size:110,fill:P.gold,stroke:20})}${T(820,150,'LIKE A CHURCH BELL',{size:92,fill:P.white,sc:pop(t,p.clock??20.29)})}${a19_timer(a19_left(g),g)}`;}
  if(rb) return `${a19_kitchen(g,{smoke:1,th:.9,nan:'doze'})}${a19_tg(270,180,.1,g)}${T(820,150,'A THREAD BECOMES A RIBBON',{size:84,fill:P.red,sc:pop(t,p.ribbon??17.7)})}${a19_timer(a19_left(g),g)}`;
  if(sk) return `${card('cardDark',g)}${cp?`<g transform="translate(960,640)"><path d="M0 -300 V120 M-110 140 H110" stroke="${INK}" stroke-width="22"/><path d="M0 -300 V120 M-110 140 H110" stroke="#9AA7BD" stroke-width="12"/>
       <g transform="rotate(14 0 -280)"><path d="M-360 -280 H360" stroke="#9AA7BD" stroke-width="16"/><g transform="translate(-320,-280)"><path d="M-110 0 L0 140 L110 0" stroke="${INK}" stroke-width="5" fill="none"/><rect x="-120" y="130" width="240" height="24" rx="8" fill="${P.gold}" stroke="${INK}" stroke-width="6"/>${glint({x:0,y:-12,s:.33,t:g,mouth:'frown',brows:'sad',blink:BL(g)})}</g>
       <g transform="translate(320,-280)"><path d="M-110 0 L0 140 L110 0" stroke="${INK}" stroke-width="5" fill="none"/><rect x="-120" y="130" width="240" height="24" rx="8" fill="${P.gold}" stroke="${INK}" stroke-width="6"/>${a19_clip(0,90,.7)}</g></g></g>
       ${T(820,150,'LIGHTER THAN A PAPER CLIP',{size:88,fill:P.gold,sc:pop(t,p.clip??15.54)})}`
     :`${a19_hand(1100,520,2.2,0)}${glint({x:600,y:460,s:.6,t:g,pose:'reach',mouth:'teeth',brows:'angry',blink:0,sweat:1})}${T(820,150,"HE CAN'T SHAKE HER AWAKE",{size:84,fill:P.red,sc:pop(t,p.shake??13.62)})}`}${a19_timer(a19_left(g),g)}`;
  if(pi) return `${card('cardMint',g)}${[0,1,2].map(i=>a19_pitch(180+i*530,380,500,300)).join('')}${a19_tg(220,560,.05,g,{mark:1})}
   ${T(960,800,'= 3 FOOTBALL PITCHES',{size:80,fill:P.gold,sc:pop(t,p.pitch??4.59)})}${tm?a19_pill(t,960,900,"HE DOESN'T HAVE THAT KIND OF TIME",p.time??8.81,P.red,42):''}${T(820,150,'TO GLINT...',{size:96,fill:P.white,sc:pop(t,p.pitch??4.59)})}${a19_timer(a19_left(g),g)}`;
  return `${a19_kitchen(g,{smoke:1,th:.5,nan:'doze'})}${a19_tg(270,180,.1,g)}${ch?`<path d="M300 140 Q1000 -40 1620 280" stroke="${P.gold}" stroke-width="10" fill="none" stroke-dasharray="${(2000*eout(prog(t,p.chair??1.78,(p.chair??1.78)+1.2))).toFixed(0)} 3000"/>${T(980,300,'4 METRES',{size:90,fill:P.gold,sc:pop(t,(p.chair??1.78)+.8)})}`:''}
   ${T(820,150,'THE SMOKE THICKENS',{size:96,fill:P.white,sc:pop(t,.1)})}${a19_timer(a19_left(g),g)}`;
},
antEyes(t,d,p,g){
  const ey=AT(t,p.eyes??2.18), ct=AT(t,p.cant??6.17), cn=AT(t,p.can??7.85), br=AT(t,p.brave??9.3), cu=AT(t,p.cups??12.16), ms=AT(t,p.mouse??16.7), ft=AT(t,p.feet??18.21);
  if(br){return `${a19_counterTop(g,{wall:'#1C1838',top:'#E8EEF4'})}${ft?a19_catFace(1350,900-200*eout(prog(t,p.feet??18.21,(p.feet??18.21)+.8)),1.1,g,{ears:-1,slit:0}):a19_eyes(1350,880,.9,g)}
     ${glint({x:620,y:440,s:1.1,t:g,pose:cu?'flex':'down',mouth:cu?'o':'flat',brows:'angry',blink:BL(g)})}${cu?a19_squeak(760,400,g,1,1,2.2)+a19_squeak(770,420,g+.2,1,1,1.6):''}
     ${cu?T(1050,330,'SQUEAK!',{size:110,fill:P.gold,sc:pop(t,p.cups??12.16)}):''}${ms&&!ft?`<g transform="translate(1100,600)">${icon('rat',0,0,.8)}</g>${T(1100,720,'LIKE A MOUSE',{size:52,fill:P.white,stroke:10})}`:''}
     ${T(960,150,ft?'ON HIS FEET. INSTANTLY.':'THE BRAVEST THING OF HIS LIFE',{size:84,fill:ft?a19_FUR:P.white,sc:pop(t,ft?p.feet??18.21:p.brave??9.3)})}${a19_timer(a19_left(g),g)}`;}
  return `${a19_fridgeTop(g,{smoke:1,th:.9,nan:'doze'})}<rect width="1920" height="1080" fill="#05030C" opacity="${ey?.45:0}"/>${ey?a19_eyes(1250,820,.9*pop(t,p.eyes??2.18),g):''}
   ${glint({x:480,y:400,s:.75,t:g,mouth:ey?'o':'flat',brows:'raised',look:1,blink:BL(g)})}
   ${ct?`<g transform="translate(1000,330)">${labelPill(0,0,"NAN CAN'T HEAR HIM",P.red,46)}</g>`:''}${cn?`<g transform="translate(1000,450) scale(${pop(t,p.can??7.85)})">${labelPill(0,0,'BUT THE CAT CAN',P.mint,46)}</g>`:''}
   ${T(820,150,ey?'TWO GREEN EYES':'GLINT LOOKS DOWN',{size:96,fill:ey?a19_GREEN:P.white,sc:pop(t,ey?p.eyes??2.18:.1)})}${a19_timer(a19_left(g),g)}`;
},
antJump(t,d,p,g){
  const ch=AT(t,p.chute??5.57), ld=AT(t,p.land??9.76), rn=AT(t,p.runs??13.3);
  const k=ld?1:eout(prog(t,.4,9.76)*1)*.92;const fy=lerp(200,820,ld?1:prog(t,.4,9.76)), fx=lerp(470,640,prog(t,.4,9.76));
  const gx=rn?lerp(640,1100,prog(t,p.runs??13.3,d)):fx;
  return `${a19_kitchen(g,{smoke:1,th:.9,nan:'doze',nanOn:1})}<rect width="1920" height="1080" fill="#05030C" opacity=".3"/>${pickles(1200,880,1.3,g,{mood:'happy'})}
   ${a19_ruler(80,820,640,'',{})}${T(270,150,'2 M',{size:64,fill:P.gold,stroke:13})}
   ${a19_tg(gx,fy,.16,g,{pose:'up',mouth:rn?'teeth':'o',brows:'raised',legs:rn?'walk':'stand',blink:0})}
   ${!ld?[-30,0,30].map(dx=>`<path d="M${fx+dx} ${fy+40} v-40" stroke="${P.ice}" stroke-width="8" stroke-linecap="round" opacity="${(.5+.5*Math.sin(g*8+dx)).toFixed(2)}"/>`).join(''):''}
   ${ld&&!rn?T(700,880,'SOFT BUMP',{size:56,fill:P.gold,stroke:10}):''}
   ${AT(t,p.person??2.77)&&!ch?a19_pill(t,1100,330,'TO A PERSON: TERRIFYING',p.person??2.77,P.red,42):''}${ch&&!ld?a19_pill(t,1100,330,'AIR RESISTANCE = PARACHUTE',p.chute??5.57,P.ice,42):''}
   ${T(820,150,rn?'AND RUNS':'GLINT JUMPS',{size:100,fill:rn?P.mint:P.gold,sc:pop(t,rn?p.runs??13.3:.1)})}${a19_timer(a19_left(g),g)}`;
},
antChase(t,d,p,g){
  const pw=AT(t,p.paw??5.12), sl=AT(t,p.slow??8.97), br=AT(t,p.brain??15.4), un=AT(t,p.under??19.34), rd=AT(t,p.round??20.48), ar=AT(t,p.arm??21.79);
  const step=pw?Math.max(0,1-((t-(p.paw??5.12))%1.6)/.3):0, sh=step*14*Math.sin(g*60);
  const sq=[0,p.sq2??2.32].some(a=>t>=a&&t<a+1.2);
  const stage=ar?2:rd?1:un?0:-1;
  const prop=stage===0?`<rect x="-20" y="0" width="1960" height="120" fill="#6A4A2A" stroke="${INK}" stroke-width="8"/><rect x="1500" y="100" width="140" height="640" fill="#6A4A2A" stroke="${INK}" stroke-width="8"/>`
    :stage===1?`<rect x="1300" y="0" width="150" height="760" fill="#8A6A4A" stroke="${INK}" stroke-width="8"/>`:stage===2?`<path d="M1240 0 H1920 V760 H1300Z" fill="${P.mint}" stroke="${INK}" stroke-width="9"/>${[0,1,2,3,4,5].map(i=>`<path d="M1300 ${80+i*110} H1900" stroke="${P.mintDark}" stroke-width="8" stroke-dasharray="14 10"/>`).join('')}`:'';
  const steps=['UNDER THE TABLE','ROUND A CHAIR LEG',"NAN'S ARMCHAIR"];
  const track=un?steps.map((s,i)=>{const dn=i<stage,c=i===stage;const w=s.length*21+60;return `<g transform="translate(${[420,960,1480][i]},60)"><rect x="${-w/2}" y="-30" width="${w}" height="60" rx="30" fill="${dn?P.mint:c?P.gold:'#2A3248'}" stroke="${INK}" stroke-width="6"/><text y="12" text-anchor="middle" font-size="32" font-weight="900" fill="${dn||c?INK:'#9AA7BD'}">${s}</text></g>`;}).join(''):'';
  return `<g transform="translate(${sh.toFixed(1)},${(sh*.6).toFixed(1)})">${a19_lino(g,{horizon:560})}${prop}
   <g transform="translate(${(1500-Math.sin(g*.5)*60).toFixed(0)},${(380+Math.sin(g*.7)*20).toFixed(0)})" opacity=".97"><ellipse cx="0" cy="0" rx="700" ry="380" fill="${a19_FUR}" stroke="${INK}" stroke-width="12"/>${[-300,-100,100,300].map(x=>`<path d="M${x} -360 q40 120 0 240" stroke="${a19_FUR2}" stroke-width="22" fill="none"/>`).join('')}</g>
   ${pw?`<g transform="translate(1100,${(lerp(300,700,Math.min(1,((t-(p.paw??5.12))%1.6)/.6))).toFixed(0)})"><ellipse rx="220" ry="120" fill="${a19_FUR}" stroke="${INK}" stroke-width="12"/>${[-120,-40,40,120].map(x=>`<ellipse cx="${x}" cy="90" rx="48" ry="40" fill="#F4B6C2" stroke="${INK}" stroke-width="7"/>`).join('')}</g>${step>.2?T(1100,940,'THUD',{size:90,fill:P.gold,stroke:16}):''}`:''}
   ${glint({x:560,y:560,s:.75,t:g*1.6,legs:'walk',pose:'reach',mouth:sq?'o':'teeth',brows:'raised',dir:-1,blink:0})}${sq?T(380,330,'SQUEAK!',{size:96,fill:P.gold,stroke:18}):''}</g>
   ${sl&&!un?`<g transform="translate(1500,240)">${labelPill(0,0,br?'SPEEDY BRAIN = AHEAD':'SLOW MOTION...',br?P.mint:P.violet,48)}</g>`:''}${track}${!un?T(700,150,sl?'A MOUNTAIN OF FUR':pw?'EVERY STEP: AN EARTHQUAKE':'THE CAT FOLLOWS',{size:84,fill:P.white,sc:pop(t,sl?p.slow??8.97:pw?p.paw??5.12:p.fol??1.01)}):''}${a19_timer(a19_left(g),g)}`;
},
antClimb(t,d,p,g){
  const lp=AT(t,p.lap??5.75), lv=AT(t,p.leap??10.4), fv=AT(t,p.five??12.18), sk=AT(t,p.shriek??15.57), sm=AT(t,p.smell??17.54);
  if(!lp){const cy=lerp(820,360,prog(t,.5,5.6));
    return `<rect width="1920" height="1080" fill="${P.mint}"/>${[...Array(12)].map((_,i)=>`<path d="M0 ${((i*100+t*40)%1200-60).toFixed(0)} H1920" stroke="${P.mintDark}" stroke-width="16" stroke-dasharray="40 26"/>`).join('')}
     ${glint({x:960,y:cy,s:.85,t:g,pose:'up',mouth:'teeth',brows:'angry',legs:'walk',blink:0})}${a19_pill(t,960,880,'90× STRONGER, FOR HIS SIZE',p.str??2.89,P.gold,46)}${T(960,150,'UP THE BLANKET',{size:100,fill:P.white,sc:pop(t,.1)})}${a19_timer(a19_left(g),g)}`;}
  if(!lv) return `${a19_kitchen(g,{smoke:1,th:.9,nan:'doze'})}${a19_tg(1660,672,.1,g,{pose:'up',mouth:'grin'})}${T(820,150,"INTO NAN'S LAP",{size:100,fill:P.mint,sc:pop(t,p.lap??5.75)})}${a19_timer(a19_left(g),g)}`;
  const k=eout(prog(t,p.leap??10.4,(p.leap??10.4)+1.4));const cx=lerp(1100,1590,k), cy=lerp(870,650,k)-Math.sin(k*Math.PI)*260;
  return `${a19_kitchen(g,{smoke:1,th:sm?1:.9,nan:sk?'shriek':'doze'})}${pickles(cx,cy,1.1,g,{mood:'happy'})}
   ${sk?a19_bubble(1300,250,340,'EEK!','',{tail:'right',size:80}):''}${fv&&!sk?a19_pill(t,1300,300,'5 KG OF CAT',p.five??12.18,a19_FUR,56):''}
   ${sm?`<g transform="translate(960,${400}) scale(${pop(t,p.smell??17.54)})">${labelPill(0,0,'...THEN SHE SMELLS THE SMOKE',P.red,46)}</g>`:''}
   ${T(820,150,sk?'NAN WAKES!':'MR. PICKLES LEAPS',{size:100,fill:sk?P.gold:a19_FUR,sc:pop(t,sk?p.shriek??15.57:p.leap??10.4)})}${a19_timer(a19_left(g),g)}`;
},
antSafety(t,d,p,g){
  const ht=AT(t,p.heat??2.48), ld=AT(t,p.lid??4.03), mv=AT(t,p.move??6.31), wt=AT(t,p.water??10.22), cu=AT(t,p.curls??13.87), sf=AT(t,p.safe??15.92);
  const items=[['HEAT OFF',ht,1],['LID ON',ld,1],["DON'T MOVE IT",mv,1],['NEVER WATER',mv,0]];
  const smA=cu?1-prog(t,p.curls??13.87,(p.curls??13.87)+2):1;
  return `${card('cardWarm',g)}${a19_stove(980,620,!ht,g)}${a19_pan(1160,594,1.1,g,{heat:!ht,lid:ld?eout(prog(t,p.lid??4.03,(p.lid??4.03)+1)):0})}${a19_smoke(1160,560,g,smA,.6,340)}
   ${!ld?`<g transform="translate(1270,${ht?640:600})">${a19_hand(0,0,.6,-90)}</g>`:''}
   ${items.map(([s,a,ok],i)=>AT(t,a)?`<g transform="translate(160,${300+i*130}) scale(${pop(t,a+i*.15)})">${a19_check(0,0,ok,.55)}${T(70,18,s,{size:56,fill:ok?P.mint:P.red,anchor:'start',stroke:11})}</g>`:'').join('')}
   ${wt&&!cu?`<rect width="1920" height="1080" fill="#05030C" opacity=".55"/><g transform="translate(960,540) scale(${pop(t,p.water??10.22)})"><circle r="260" fill="url(#gWarm)"/><circle r="180" fill="${P.warm}" opacity=".6"/>${T(0,-20,'WATER + HOT OIL',{size:72,fill:P.white})}${T(0,80,'= FIREBALL',{size:90,fill:P.red})}</g>`:''}
   ${T(820,150,sf?'THE KITCHEN IS SAFE':'EXACTLY THE RIGHT THING',{size:92,fill:sf?P.mint:P.white,sc:pop(t,sf?p.safe??15.92:.1)})}
   ${sf?a19_timer(0,g,{txt:'SAFE',col:P.mint,label:'SMOKING PAN'}):a19_timer(a19_left(Math.min(g,485.91)),g,{txt:ht?a19_fmt(a19_left(485.91)):null,col:ht?P.gold:P.red})}`;
},
antTwist(t,d,p,g){
  const mo=AT(t,p.mouth??4.23), sc=AT(t,p.scratch??11.82), dr=AT(t,p.drops??13.29), pu=AT(t,p.purr??16.5);
  const lap=`<rect width="1920" height="1080" fill="#252B52"/><path d="M-40 760 Q960 640 1960 760 V1100 H-40Z" fill="${'#B58BD6'}" stroke="${INK}" stroke-width="10"/><path d="M200 900 Q960 800 1700 900" stroke="#9468BC" stroke-width="10" fill="none"/>`;
  if(dr){return `${lap}<circle cx="960" cy="560" r="420" fill="url(#gGold)" opacity=".3"/>${a19_hand(1040,700,2.3,180)}${glint({x:880,y:430,s:.62,t:g,mouth:'grin',brows:'raised',pose:'wave',blink:BL(g)})}
     ${pickles(1450,620,1.9,g,{mood:'happy',blink:1})}${pu?[0,1,2].map(i=>{const k=((g*.6+i/3)%1);return T(1300+i*60,420-k*160,'PRRR',{size:44,fill:P.gold,op:Math.sin(k*Math.PI),stroke:8});}).join(''):''}
     ${T(960,150,pu?'...AND STARTS TO PURR':"INTO NAN'S PALM",{size:96,fill:pu?P.gold:P.white,sc:pop(t,pu?p.purr??16.5:p.drops??13.29)})}`;}
  const cx=1060, cy=700, s=2.4, mx=cx-70*s, my=cy-6*s;
  return `${lap}${pickles(cx,cy,s,g,{mood:'happy'})}
   ${mo?`<g transform="translate(${mx},${my})">${glint({x:-40,y:20,s:.42,t:g,mouth:'smile',brows:'raised',pose:'down',blink:BL(g),rot:6})}</g>`:''}
   ${mo?a19_pill(t,960,265,'HELD BY HIS SCARF, LIKE A KITTEN',(p.mouth??4.23)+1,P.gold,40):''}${sc?`<g transform="translate(560,500) scale(${pop(t,p.scratch??11.82)})">${icon('check',0,0,1)}</g>${T(560,660,'NOT A SCRATCH',{size:60,fill:P.mint,stroke:12})}`:''}
   ${T(960,150,mo?'IN HIS MOUTH... GENTLY':'MR. PICKLES IS THERE',{size:96,fill:mo?P.gold:a19_FUR,sc:pop(t,mo?p.mouth??4.23:.1)})}`;
},
antGuard(t,d,p,g){
  const ev=AT(t,p.every??9.55), gd=AT(t,p.guard??15.58), nt=AT(t,p.night??17.88), pl=AT(t,p.pillow??23.05);
  if(nt){if(pl) return `${bgRoom(g)}<rect x="560" y="560" width="900" height="200" rx="20" fill="#5A3E6A" stroke="${INK}" stroke-width="9"/><rect x="580" y="500" width="300" height="100" rx="40" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/>
      <g transform="translate(760,520) rotate(-90)">${glint({x:0,y:0,s:.42,t:g,eyes:'closed',mouth:'smile',scarf:true})}</g><path d="M860 580 H1440 V680 H860Z" fill="${P.mint}" stroke="${INK}" stroke-width="8"/>${pickles(780,450,.75,g,{mood:'happy',blink:1})}${a19_zzz(900,330,g)}
      ${T(960,150,'PICKLES SLEEPS ON HIS PILLOW',{size:84,fill:P.gold,sc:pop(t,p.pillow??23.05)})}`;
    return `${bgLab(g)}${a19_projector(1450,600,1,g,{beam:'white'})}${a19_beam(1170,605,700,200,'#FFF6D0',.3)}${glint({x:760,y:540,s:1,t:g,pose:'up',mouth:'grin',brows:'raised',blink:BL(g),glint:1})}
     ${person({x:340,y:540,s:1,t:g,who:'kai',pose:'up',mouth:'laugh',blink:BL(g)})}${person({x:1700,y:540,s:1,t:g,who:'osei',pose:'point',mouth:'smile',blink:BL(g+1)})}
     ${T(960,150,'BACK TO FULL SIZE',{size:100,fill:P.mint,sc:pop(t,p.night??17.88)})}`;}
  if(ev){const fr=(i,ears,hp)=>`<g transform="translate(${[400,960,1520][i]},560)"><rect x="-250" y="-220" width="500" height="380" rx="20" fill="#1A2142" stroke="${P.gold}" stroke-width="8"/><clipPath id="a19f${i}"><rect x="-250" y="-220" width="500" height="380" rx="20"/></clipPath><g clip-path="url(#a19f${i})">${a19_catFace(60,60,.5,g,{ears,mouth:hp?'flat':'flat',slit:0})}${glint({x:-170,y:40,s:.25,t:g,mouth:'o',blink:BL(g)})}${a19_squeak(-130,10,g+i,1,1,.5)}</g></g>`;
    return `${card('cardGold',g)}${fr(0,-1,0)}${ev&&AT(t,(p.every??9.55)+.8)?fr(1,-1,0):''}${AT(t,(p.every??9.55)+1.6)?fr(2,-1,1):''}
     ${gd?`<rect width="1920" height="1080" fill="#05030C" opacity=".35"/>${T(960,540,'GUARDING HIM,',{size:130,fill:P.gold,sc:pop(t,p.guard??15.58)})}${T(960,690,'ALL ALONG',{size:130,fill:P.mint,sc:pop(t,(p.guard??15.58)+.5)})}`:''}
     ${T(960,150,'LISTENING OUT FOR HIM',{size:96,fill:P.white,sc:pop(t,p.every??9.55)})}`;}
  return `${card('cardWarm',g)}${pickles(620,640,2.4,g,{mood:'happy'})}${a19_squeak(1180,560,g,1,-1,1.2)}
   ${AT(t,p.maybe??2.55)?`<g transform="translate(1300,380) scale(${pop(t,p.maybe??2.55)})"><circle cx="-230" cy="150" r="22" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><rect x="-260" y="-130" width="520" height="230" rx="110" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/>${pickles(-40,10,.6,g,{mood:'happy'})}${T(150,10,'MEW?',{size:56,fill:INK,stroke:0})}</g>${a19_pill(t,1300,700,'MAYBE: A KITTEN IN TROUBLE',(p.maybe??2.55)+.8,P.gold,42)}`:''}
   ${T(960,150,'NEVER HUNTING HIM',{size:100,fill:P.mint,sc:pop(t,.1)})}`;
}
});
