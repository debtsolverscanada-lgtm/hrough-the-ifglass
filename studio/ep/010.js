// episode 010 scenes (see every germ)
const g10_C={germ:'#8CFF5A',germD:'#3FAF2A',spark:'#E6D2FF',bad:'#FF5E7A',bug:'#7CF5A0',bug2:'#7CD8FF',bug3:'#FFD27C'};
// glowing bacteria dots scattered in an ellipse
function g10_dots(cx,cy,rx,ry,n,seed,g,o={}){const {op=1,col=g10_C.germ,r:rad=7}=o;if(op<=0||n<=0)return '';const r=rng(seed);let s='';
  for(let i=0;i<n;i++){const a=r()*6.283,dd=Math.sqrt(r()),rr=rad*(.6+r()*.8);const x=cx+Math.cos(a)*dd*rx+Math.sin(g*1.3+i)*4,y=cy+Math.sin(a)*dd*ry+Math.cos(g*1.1+i*1.7)*4;const tw=.55+.45*Math.sin(g*4+i*1.9);
    s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(rr*2.6).toFixed(1)}" fill="${col}" opacity="${(op*.2*tw).toFixed(2)}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(rr*(.7+.3*tw)).toFixed(1)}" fill="${col}" opacity="${op}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(rr*.3).toFixed(1)}" fill="#fff" opacity="${(op*.8).toFixed(2)}"/>`;}
  return s;}
// faint virus sparkles
function g10_star(x,y,sz,col,op){x=+x;y=+y;const k=sz*.25;return `<path d="M${x} ${y-sz} L${x+k} ${y-k} L${x+sz} ${y} L${x+k} ${y+k} L${x} ${y+sz} L${x-k} ${y+k} L${x-sz} ${y} L${x-k} ${y-k}Z" fill="${col}" opacity="${op}"/>`;}
function g10_sparks(cx,cy,rx,ry,n,seed,g,o={}){const {op=1,col=g10_C.spark,size=12}=o;if(op<=0)return '';const r=rng(seed);let s='';
  for(let i=0;i<n;i++){const a=r()*6.283,dd=Math.sqrt(r());const x=cx+Math.cos(a)*dd*rx,y=cy+Math.sin(a)*dd*ry;const tw=Math.max(0,Math.sin(g*3+i*2.3));s+=g10_star(x.toFixed(1),y.toFixed(1),size*(.4+.6*tw),col,(op*(.25+.75*tw)).toFixed(2));}
  return s;}
// cute cartoon bacterium
function g10_bug(x,y,s,g,o={}){const {col=g10_C.bug,mood='happy',rot=0,glow=1,wave=0}=o;const w=Math.sin(g*8+x)*10;
  const face=mood==='mean'?`<path d="M-26 -22 L-8 -12 M26 -22 L8 -12" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle cx="-14" cy="-4" r="6" fill="${INK}"/><circle cx="14" cy="-4" r="6" fill="${INK}"/><path d="M-14 16 L-7 9 L0 16 L7 9 L14 16" stroke="${INK}" stroke-width="5" fill="none" stroke-linejoin="round"/>`
    :`<circle cx="-14" cy="-6" r="7" fill="${INK}"/><circle cx="14" cy="-6" r="7" fill="${INK}"/><circle cx="-11" cy="-9" r="2.5" fill="#fff"/><circle cx="17" cy="-9" r="2.5" fill="#fff"/><path d="M-12 8 Q0 20 12 8" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="-30" cy="6" rx="7" ry="4" fill="${P.coral}" opacity=".6"/><ellipse cx="30" cy="6" rx="7" ry="4" fill="${P.coral}" opacity=".6"/>`;
  return `<g transform="translate(${x},${y+Math.sin(g*3+x*.01)*6}) rotate(${rot+Math.sin(g*2+x)*4}) scale(${s})">${glow?`<ellipse rx="110" ry="80" fill="${col}" opacity="${.18*glow}"/>`:''}
   <path d="M-58 0 q-20 ${w} -40 0 t-40 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>
   ${wave?`<path d="M30 -28 L${50+Math.sin(g*9)*10} -70" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`:''}
   <rect x="-62" y="-36" width="124" height="72" rx="36" fill="${col}" stroke="${INK}" stroke-width="6"/><path d="M-40 -22 Q-20 -30 0 -28" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6"/>${face}</g>`;}
// glow dots over Glint's body (matches glint's bob)
function g10_glintDots(x,y,s,g,n,op,seed=3,half=false){if(op<=0)return '';const r=rng(seed);let d='';const seg=[[0,30,0,170],[0,40,-62,150],[0,40,62,150],[0,170,-40,300],[0,170,40,300]];
  for(let i=0;i<n;i++){let px,py;if(r()<.55){const a=r()*6.283,dd=Math.sqrt(r())*88;px=Math.cos(a)*dd;py=-60+Math.sin(a)*dd;}else{const sg=seg[Math.floor(r()*5)],k=r();px=lerp(sg[0],sg[2],k)+(r()-.5)*16;py=lerp(sg[1],sg[3],k);}
    if(half&&px>0)continue;if(Math.abs(px)<72&&py>-100&&py<-5)continue;const tw=.5+.5*Math.sin(g*4+i*1.7),rr=4+r()*5;d+=`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${rr*2.4}" fill="${g10_C.germ}" opacity="${(op*.22*tw).toFixed(2)}"/><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${rr}" fill="${g10_C.germ}" opacity="${op}"/>`;}
  return `<g transform="translate(${x},${y+Math.sin(g*2.4)*5}) scale(${s})">${d}</g>`;}
const g10_dim=(op)=>`<rect width="1920" height="1080" fill="#03100A" opacity="${op}"/>`;
// props
function g10_phone(x,y,s,o={}){const {g=0,germ=0,rot=0,glow=0}=o;
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">${glow?`<ellipse rx="190" ry="280" fill="${g10_C.germ}" opacity="${.16*glow}"/>`:''}<rect x="-100" y="-190" width="200" height="380" rx="32" fill="#1E2436" stroke="${INK}" stroke-width="10"/>
   <rect x="-82" y="-160" width="164" height="316" rx="16" fill="#2B3A66"/><rect x="-26" y="-178" width="52" height="10" rx="5" fill="#0E1220"/><path d="M-60 -130 L-20 -150" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".3"/>
   ${g10_dots(0,0,78,150,Math.round(germ*110),31,g,{r:6})}${germ>.3?g10_sparks(0,0,78,150,Math.round(germ*14),32,g,{size:10}):''}</g>`;}
function g10_brush(x,y,s,rot=0,col='#7CD8FF'){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-14" y="-40" width="28" height="280" rx="14" fill="${col}" stroke="${INK}" stroke-width="7"/><rect x="-20" y="-130" width="40" height="100" rx="14" fill="#fff" stroke="${INK}" stroke-width="7"/>
   <rect x="20" y="-124" width="40" height="84" rx="6" fill="#E6FAFF" stroke="${INK}" stroke-width="5"/><path d="M30 -122 V-42 M40 -122 V-42 M50 -122 V-42" stroke="#9cc" stroke-width="3"/></g>`;}
function g10_sponge(x,y,s,o={}){const {g=0,blaze=0,germ=0,fresh=0}=o;
  return `<g transform="translate(${x},${y}) scale(${s})">${blaze>0?`<ellipse rx="${330+Math.sin(g*6)*16}" ry="${240+Math.sin(g*5)*12}" fill="${g10_C.germ}" opacity="${.22*blaze}"/><ellipse rx="240" ry="160" fill="${g10_C.germ}" opacity="${.3*blaze}"/>`:''}
   <rect x="-160" y="-50" width="320" height="120" rx="14" fill="#FFD44D" stroke="${INK}" stroke-width="8"/>${[[-110,-10],[-60,30],[-10,-15],[40,25],[90,-10],[120,40],[-130,45]].map(([a,b])=>`<ellipse cx="${a}" cy="${b}" rx="12" ry="9" fill="#E0A92A"/>`).join('')}
   <rect x="-160" y="-100" width="320" height="56" rx="12" fill="${fresh?'#4FD07A':'#3E9A55'}" stroke="${INK}" stroke-width="8"/>
   ${g10_dots(0,0,170,90,Math.round(germ*90+blaze*120),41,g,{r:7})}${blaze>0?[0,1,2,3,4,5].map(i=>{const k=(g*.7+i/6)%1;return `<circle cx="${-130+i*52+Math.sin(g*3+i)*14}" cy="${-110-k*220}" r="${(14-k*8)}" fill="${g10_C.germ}" opacity="${blaze*(1-k)}"/>`;}).join(''):''}</g>`;}
function g10_toilet(x,y,s,o={}){const {lid=1,glow=0}=o;const lidUp=`<ellipse cx="0" cy="-350" rx="150" ry="125" fill="#F4F7FB" stroke="${INK}" stroke-width="9"/><ellipse cx="0" cy="-350" rx="115" ry="92" fill="none" stroke="#C9D3E3" stroke-width="5"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="8" rx="170" ry="22" fill="rgba(0,0,0,.35)"/><rect x="-125" y="-470" width="250" height="210" rx="18" fill="#EEF3FA" stroke="${INK}" stroke-width="9"/><rect x="-110" y="-450" width="60" height="16" rx="8" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/>
   ${lid?lidUp:''}<path d="M-160 -228 Q-150 -90 -60 -60 L-70 0 H70 L60 -60 Q150 -90 160 -228Z" fill="#EEF3FA" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
   <ellipse cx="0" cy="-232" rx="168" ry="50" fill="#F4F7FB" stroke="${INK}" stroke-width="9"/><ellipse cx="0" cy="-230" rx="118" ry="30" fill="#8FD3F0" stroke="${INK}" stroke-width="6"/>${glow?`<ellipse cx="0" cy="-230" rx="118" ry="30" fill="${g10_C.germ}" opacity="${.5*glow}"/>`:''}
   ${lid?'':`<ellipse cx="0" cy="-246" rx="172" ry="52" fill="#F4F7FB" stroke="${INK}" stroke-width="9"/><path d="M-110 -262 Q-40 -282 40 -276" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>`}</g>`;}
// rising droplet plume
function g10_plume(x,y,k,g,h,o={}){const {n=90,spread=360,col=g10_C.germ,op=1}=o;if(k<=0)return '';const r=rng(77);let s='';
  for(let i=0;i<n;i++){const r1=r(),r2=r(),r3=r();const ph=(g*.55+r1)%1;const py=y-ph*h*k,px=x+(r2-.5)*spread*(.15+ph)+Math.sin(g*2+i)*10;const rr=3+r3*6;const o2=(1-ph*.6)*k*op;
    s+=`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${rr*2.4}" fill="${col}" opacity="${(o2*.2).toFixed(2)}"/><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${rr}" fill="${col}" opacity="${o2.toFixed(2)}"/>`;}
  return s;}
function g10_bath(g){let t='';for(let i=0;i<14;i++)for(let j=0;j<7;j++)t+=`<rect x="${i*140}" y="${j*120}" width="136" height="116" fill="#1F3550"/>`;
  return `<rect width="1920" height="1080" fill="#16263C"/>${t}<rect y="820" width="1920" height="260" fill="#0E1A2A"/><path d="M0 820 H1920" stroke="#3B5A80" stroke-width="5"/>`;}
function g10_kitchen(g){let t='';for(let i=0;i<24;i++)for(let j=0;j<4;j++)t+=`<rect x="${i*82}" y="${300+j*82}" width="78" height="78" fill="#2A3A5E"/>`;
  return `<rect width="1920" height="1080" fill="#1B2440"/><rect x="0" y="40" width="1920" height="220" fill="#22305A"/>${[0,1,2,3,4].map(i=>`<rect x="${60+i*380}" y="60" width="340" height="180" rx="10" fill="#2A3A6A" stroke="#3B4A78" stroke-width="5"/>`).join('')}${t}
   <rect y="630" width="1920" height="450" fill="#5A3A2A"/><rect y="630" width="1920" height="40" fill="#7A5240" stroke="${INK}" stroke-width="5"/>`;}
function g10_melon(x,y,s,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-130 0 A130 130 0 0 0 130 0Z" fill="#3E9A55" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-112 0 A112 112 0 0 0 112 0Z" fill="#FFF3D6"/><path d="M-100 0 A100 100 0 0 0 100 0Z" fill="#FF5E7A"/>
   ${[[-50,25],[0,45],[50,25],[-20,70],[25,70]].map(([a,b])=>`<ellipse cx="${a}" cy="${b}" rx="6" ry="10" fill="${INK}"/>`).join('')}<path d="M-130 0 H130" stroke="${INK}" stroke-width="8" stroke-linecap="round"/></g>`;}
function g10_gummy(x,y,s,col='#FF9F43'){return `<g transform="translate(${x},${y}) scale(${s})" opacity=".95"><circle cx="-34" cy="-80" r="20" fill="${col}" stroke="${INK}" stroke-width="6"/><circle cx="34" cy="-80" r="20" fill="${col}" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-50" r="46" fill="${col}" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="40" rx="60" ry="64" fill="${col}" stroke="${INK}" stroke-width="6"/>
   <circle cx="-56" cy="10" r="18" fill="${col}" stroke="${INK}" stroke-width="5"/><circle cx="56" cy="10" r="18" fill="${col}" stroke="${INK}" stroke-width="5"/><circle cx="-16" cy="-56" r="6" fill="${INK}"/><circle cx="16" cy="-56" r="6" fill="${INK}"/><path d="M-20 -60 Q-30 -30 -10 -20" stroke="#fff" stroke-width="6" fill="none" opacity=".6" stroke-linecap="round"/></g>`;}
function g10_print(x,y,s,op,rot=0){let a='';[12,24,36,48].forEach(r=>a+=`<path d="M${-r*.8} ${r*.6} A${r} ${r*1.25} 0 1 1 ${r*.8} ${r*.6}" stroke="${g10_C.germ}" stroke-width="6" fill="none" stroke-linecap="round"/>`);
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})" opacity="${op}"><ellipse rx="80" ry="90" fill="${g10_C.germ}" opacity=".18"/>${a}</g>`;}
function g10_aura(x,y,s,g,col,op=1,seed=5){if(op<=0)return '';const pul=1+Math.sin(g*2+seed)*.04;
  return `<g transform="translate(${x},${y})" opacity="${op}"><ellipse cx="0" cy="${40*s}" rx="${210*s*pul}" ry="${330*s*pul}" fill="${col}" opacity=".12"/><ellipse cx="0" cy="${40*s}" rx="${170*s*pul}" ry="${280*s*pul}" fill="${col}" opacity=".14"/>${g10_dots(0,40*s,200*s,320*s,26,seed,g,{col,r:5*s+1,op:.85})}</g>`;}
function g10_cube(x,y,sz,op=1){const h=sz*.5;return `<g transform="translate(${x},${y})" opacity="${op}"><path d="M0 ${-sz} L${sz} ${-h} L0 0 L${-sz} ${-h}Z" fill="#FFFFFF" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M${-sz} ${-h} L0 0 V${sz} L${-sz} ${h}Z" fill="#E4E9F2" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M${sz} ${-h} L0 0 V${sz} L${sz} ${h}Z" fill="#C9D3E3" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/></g>`;}
function g10_spray(x,y,s,lab='BLEACH',rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-60" y="-60" width="120" height="200" rx="26" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><path d="M-30 -60 V-110 H40 L80 -90 L40 -80 V-60" fill="${P.iceDeep}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M10 -80 Q0 -40 -20 -30" stroke="${INK}" stroke-width="7" fill="none"/>
   <rect x="-48" y="10" width="96" height="60" rx="8" fill="${P.iceDeep}" stroke="${INK}" stroke-width="5"/><text y="50" text-anchor="middle" font-size="22" font-weight="900" fill="${INK}">${lab}</text></g>`;}
function g10_fungus(x,y,s,g){return `<g transform="translate(${x},${y+Math.sin(g*2.6+1)*6}) scale(${s})"><ellipse cx="34" cy="-50" rx="40" ry="34" fill="#F2D49A" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="10" rx="70" ry="58" fill="#F2D49A" stroke="${INK}" stroke-width="6"/><circle cx="-18" cy="0" r="7" fill="${INK}"/><circle cx="18" cy="0" r="7" fill="${INK}"/><path d="M-12 22 Q0 32 12 22" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;}
function g10_chip(x,y,lab,col,k,iconSvg=''){return `<g transform="translate(${x},${y}) scale(${k})"><rect x="-230" y="-70" width="460" height="140" rx="30" fill="#1B2440" stroke="${col}" stroke-width="8"/>${iconSvg}${T(50,18,lab,{size:44,fill:col,stroke:8})}</g>`;}
function g10_bus(s=1){return `<g transform="scale(${s})"><rect x="-60" y="-36" width="120" height="66" rx="14" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><rect x="-48" y="-26" width="30" height="24" rx="4" fill="#BFEFFF"/><rect x="-12" y="-26" width="30" height="24" rx="4" fill="#BFEFFF"/><circle cx="-34" cy="32" r="12" fill="#333" stroke="${INK}" stroke-width="5"/><circle cx="34" cy="32" r="12" fill="#333" stroke="${INK}" stroke-width="5"/></g>`;}
function g10_cart(s=1){return `<g transform="scale(${s})"><path d="M-70 -40 H-50 L-30 20 H50 L64 -24 H-44" stroke="${INK}" stroke-width="16" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M-70 -40 H-50 L-30 20 H50 L64 -24 H-44" stroke="#C9D3E3" stroke-width="7" fill="none" stroke-linejoin="round" stroke-linecap="round"/><circle cx="-24" cy="40" r="11" fill="#333" stroke="${INK}" stroke-width="5"/><circle cx="44" cy="40" r="11" fill="#333" stroke="${INK}" stroke-width="5"/></g>`;}
function g10_burger(s=1){return `<g transform="scale(${s})"><path d="M-60 -6 Q-60 -54 0 -54 Q60 -54 60 -6Z" fill="#E8A04A" stroke="${INK}" stroke-width="6"/><rect x="-64" y="-8" width="128" height="16" rx="8" fill="#4FC36A" stroke="${INK}" stroke-width="5"/><rect x="-60" y="8" width="120" height="18" rx="8" fill="#7A3A2A" stroke="${INK}" stroke-width="5"/><path d="M-58 28 H58 Q58 50 0 50 Q-58 50 -58 28Z" fill="#E8A04A" stroke="${INK}" stroke-width="6"/></g>`;}
function g10_cam(x,y,s,g){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M0 60 L-70 260 M0 60 L70 260 M0 60 V260" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><rect x="-110" y="-60" width="200" height="130" rx="18" fill="#2A3248" stroke="${INK}" stroke-width="8"/><rect x="90" y="-36" width="70" height="80" rx="10" fill="#5D6A82" stroke="${INK}" stroke-width="7"/><circle cx="160" cy="4" r="30" fill="#7CD8FF" stroke="${INK}" stroke-width="7"/><circle cx="-80" cy="-40" r="10" fill="${P.red}" opacity="${.4+.6*Math.abs(Math.sin(g*4))}"/></g>`;}
// extra sneezing into elbow (arm across face)
function g10_elbow(x,y,s,g,head){return `${extra({x,y,s,t:g,head,mouth:'flat'})}<g transform="translate(${x},${y+Math.sin(g*2.4+1)*4}) scale(${s})"><path d="M0 40 Q80 20 70 -20 Q60 -40 -50 -30" stroke="${INK}" stroke-width="24" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M0 40 Q80 20 70 -20 Q60 -40 -50 -30" stroke="${P.cream}" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;}

Object.assign(SHOTS,{
germHook(t,d,p,g){
  const gl=prog(t,p.glow??9.6,(p.glow??9.6)+.8);
  const it=[[340,330,p.phone??3.1,'YOUR PHONE',k=>g10_phone(0,0,.75,{g,germ:k,rot:-8,glow:k})],[1580,330,p.brush??4.1,'TOOTHBRUSH',k=>g10_brush(0,30,.95,18)+g10_dots(10,-50,70,80,Math.round(k*30),12,g,{r:5})],
    [340,700,p.sponge??5.3,'KITCHEN SPONGE',k=>g10_sponge(0,0,.9,{g,blaze:k})],[1580,700,p.air??6.8,'AFTER A SNEEZE',k=>g10_dots(0,0,160,90,Math.round(10+k*60),13,g,{r:5,op:.35+.65*k})+g10_sparks(0,0,160,90,14,14,g,{op:.3+.7*k})]];
  return `${card('cardDark',g)}${g10_dim(.55*gl)}
   ${it.map(([x,y,a,lab,f])=>AT(t,a)?`<g transform="translate(${x},${y}) scale(${pop(t,a)})">${f(gl)}</g>${T(x,y+180,lab,{size:48,fill:gl>0?g10_C.germ:P.white,stroke:8,sc:pop(t,a)})}`:'').join('')}
   ${glint({x:960,y:520,s:1.05,t:g,mouth:gl>0?'o':'smile',brows:gl>0?'raised':'calm',blink:BL(g),pose:gl>0?'shrug':'down'})}${g10_glintDots(960,520,1.05,g,40,gl*.9)}
   ${T(960,150,gl>0?'ALL OF IT. GLOWING.':'SEE EVERY GERM?',{size:96,fill:gl>0?g10_C.germ:P.white,sc:gl>0?pop(t,p.glow??9.6):IN(t,.2)})}`;
},
germSide(t,d,p,g){
  const side=AT(t,p.side??8.2);
  const B=[[300,420,g10_C.bug,-10],[1620,400,g10_C.bug2,12],[420,760,g10_C.bug3,6],[1520,760,g10_C.bug,-8],[700,300,g10_C.bug2,0],[1240,290,g10_C.bug3,-6]];
  return `${card('cardMint',g)}${g10_dots(960,560,900,420,60,21,g,{r:4,op:.5})}
   ${B.map(([x,y,c,r],i)=>g10_bug(x,y,.95*pop(t,.3+i*.25),g,{col:c,rot:r,wave:side?1:0})).join('')}
   ${glint({x:960,y:540,s:1,t:g,mouth:side?'grin':'o',brows:side?'calm':'raised',pose:side?'up':'down',blink:BL(g)})}
   ${side?icon('check',1180,260,.8*pop(t,p.side??8.2)):''}
   ${T(960,150,side?'MOST ARE ON YOUR SIDE':'NEVER ALONE',{size:96,fill:side?P.mint:P.white,sc:pop(t,side?p.side??8.2:.2)})}`;
},
germScale(t,d,p,g){
  const hair=AT(t,p.hair??10.8), vir=AT(t,p.vir??17.7);
  if(!AT(t,p.b??7.3)) return `${card('cardDark',g)}${g10_dots(960,560,900,380,40,11,g,{r:3,op:.5})}${glint({x:960,y:560,s:1,t:g,mouth:'o',brows:'raised',blink:BL(g),pose:'shrug'})}
     ${T(960,170,AT(t,1.6)?'GERMS = TINY LIVING THINGS':'REALITY CHECK',{size:84,fill:P.white,sc:pop(t,AT(t,1.6)?1.6:.2)})}${AT(t,3.5)?T(960,280,'TOO SMALL TO SEE',{size:52,fill:P.ice,sc:pop(t,3.5)}):''}`;
  if(!hair){const L=[[480,'BACTERIA',g10_C.bug,p.b??7.3,g10_bug(480,520,1.5,g,{col:g10_C.bug})],[960,'FUNGI','#F2D49A',p.f??8.4,g10_fungus(960,520,1.4,g)],[1440,'VIRUSES','#C89BFF',p.v??9.3,virus(1440,520,80,g,{col:'#C89BFF',angry:false})]];
    return `${card('cardDark',g)}${L.map(([x,lab,c,a,svg])=>AT(t,a)?`<g transform="translate(${x},520) scale(${pop(t,a)}) translate(${-x},-520)">${svg}</g>${T(x,760,lab,{size:60,fill:c,sc:pop(t,a)})}`:'').join('')}
     ${T(960,170,'GERMS = TINY LIVING THINGS',{size:84,fill:P.white,sc:IN(t,.2)})}${T(960,280,'TOO SMALL TO SEE',{size:52,fill:P.ice,op:prog(t,1,1.4)})}`;}
  let row='';const n=28;for(let i=0;i<n;i++){const a=(p.hair??10.8)+.6+i*.07;if(AT(t,a))row+=`<rect x="${-302+i*21.5}" y="-9" width="19" height="18" rx="9" fill="${g10_C.germ}" stroke="${INK}" stroke-width="3" transform="scale(${pop(t,a)})"/>`;}
  return `${card('cardDark',g)}<g transform="translate(960,560)"><rect x="-320" y="-340" width="640" height="660" rx="30" fill="#6B4423" stroke="${INK}" stroke-width="10"/>
     ${[...Array(8)].map((_,i)=>`<path d="M-320 ${-300+i*84} Q0 ${-270+i*84} 320 ${-300+i*84}" stroke="#4E2F17" stroke-width="6" fill="none"/>`).join('')}
     <rect x="-310" y="-26" width="620" height="52" rx="26" fill="#03100A" opacity=".55"/>${row}</g>
   ${T(960,140,'ONE HUMAN HAIR (ZOOMED IN)',{size:72,fill:P.white,sc:pop(t,p.hair??10.8)})}
   ${T(1560,460,'DOZENS',{size:60,fill:g10_C.germ,op:prog(t,(p.hair??10.8)+2,(p.hair??10.8)+2.4)})}${T(1560,530,'OF BACTERIA',{size:44,fill:g10_C.germ,op:prog(t,(p.hair??10.8)+2,(p.hair??10.8)+2.4)})}
   ${T(1560,600,'SIDE BY SIDE',{size:44,fill:g10_C.germ,op:prog(t,(p.hair??10.8)+2,(p.hair??10.8)+2.4)})}
   ${vir?`<g transform="translate(360,560) scale(${pop(t,p.vir??17.7)})"><rect x="-200" y="-150" width="400" height="300" rx="24" fill="#120722" stroke="#C89BFF" stroke-width="7"/><rect x="-110" y="-30" width="220" height="80" rx="40" fill="${g10_C.germ}" stroke="${INK}" stroke-width="5"/>${g10_star(150,-80,16,g10_C.spark,1)}${g10_star(120,-110,10,g10_C.spark,.8)}${g10_star(160,-40,8,g10_C.spark,.8)}</g>${T(360,780,'VIRUSES:',{size:48,fill:'#C89BFF'})}${T(360,840,'MUCH SMALLER',{size:48,fill:'#C89BFF'})}`:''}`;
},
germGoggles(t,d,p,g){
  const on=prog(t,p.on??10.2,(p.on??10.2)+.6), fl=on>0&&on<1?1-on:0;
  return `${card('cardDark',g)}${g10_dim(.6*on)}${on>0?g10_dots(960,540,960,540,80,51,g,{r:5,op:on*.8})+g10_sparks(960,540,960,540,30,52,g,{op:on}):''}
   ${glint({x:520,y:540,s:1.15,t:g,mouth:on>0?'grin':'smile',brows:on>0?'raised':'calm',pose:AT(t,p.on??10.2)?'up':'point',blink:BL(g),glint:on})}
   ${on>0?`<g transform="translate(520,${540+Math.sin(g*2.4)*5}) scale(1.15)"><circle cx="-30" cy="-62" r="27" fill="${g10_C.germ}" opacity="${.45*on}"/><circle cx="30" cy="-62" r="27" fill="${g10_C.germ}" opacity="${.45*on}"/></g>`:''}
   ${AT(t,p.dots??4.5)?`<g transform="translate(1320,430) scale(${pop(t,p.dots??4.5)})"><rect x="-400" y="-90" width="800" height="180" rx="30" fill="#0E1A2A" stroke="${g10_C.germ}" stroke-width="7"/>${g10_dots(-300,0,50,40,7,61,g,{r:9})}${T(80,22,'= BACTERIA',{size:64,fill:g10_C.germ})}</g>`:''}
   ${AT(t,p.spark??7.6)?`<g transform="translate(1320,670) scale(${pop(t,p.spark??7.6)})"><rect x="-400" y="-90" width="800" height="180" rx="30" fill="#0E1A2A" stroke="${g10_C.spark}" stroke-width="7"/>${g10_sparks(-300,0,50,40,7,62,g,{size:18})}${T(80,22,'= VIRUSES',{size:64,fill:g10_C.spark})}</g>`:''}
   ${T(960,150,on>0?'GERM VISION: ON':'GERM VISION',{size:110,fill:on>0?g10_C.germ:P.white,sc:pop(t,on>0?p.on??10.2:p.gv??2.5)})}
   <rect width="1920" height="1080" fill="${g10_C.germ}" opacity="${fl*.5}"/>`;
},
germGlow(t,d,p,g){
  const op=AT(t,p.open??0.1), me=prog(t,p.self??3.5,(p.self??3.5)+1.2);
  const L=[[1330,330,'SKIN',p.skin??6.2,[1100,420]],[1330,520,'MOUTH',p.mouth??8.6,[1010,500]],[1330,710,'GUT: TRILLIONS',p.gut??10.4,[990,690]]];
  return `${card('cardDark',g)}${g10_dim(.4)}${glint({x:760,y:560,s:1.2,t:g,eyes:AT(t,.6)?'open':'closed',mouth:me>0?'o':'smile',brows:me>0?'raised':'calm',blink:BL(g)})}
   ${g10_glintDots(760,560,1.2,g,90,me)}
   ${L.map(([x,y,s,a,[ax,ay]])=>AT(t,a)?`<path d="M${x-60} ${y} L${ax} ${ay}" stroke="${g10_C.germ}" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round" opacity="${pop(t,a)}"/>${T(x+200,y+20,s,{size:58,fill:g10_C.germ,sc:pop(t,a)})}`:'').join('')}
   ${AT(t,p.glow??4.9)?T(960,150,"YOU'RE GLOWING",{size:110,fill:g10_C.germ,sc:pop(t,p.glow??4.9)}):''}`;
},
germCount(t,d,p,g){
  const same=prog(t,p.same??6.3,(p.same??6.3)+1.5), half=AT(t,p.half??9.8);
  if(half) return `${card('cardMint',g)}${glint({x:960,y:560,s:1.3,t:g,mouth:'grin',brows:'raised',blink:BL(g),pose:'shrug'})}${g10_glintDots(960,560,1.3,g,120,1,7,true)}
     <path d="M960 260 V900" stroke="#fff" stroke-width="5" stroke-dasharray="14 14" opacity=".5"/>${T(560,640,'GERM',{size:90,fill:g10_C.germ})}${T(1360,640,'YOU',{size:90,fill:P.cream})}
     ${T(960,150,'ABOUT HALF GERM',{size:110,fill:g10_C.germ,sc:pop(t,p.half??9.8)})}`;
  const tilt=lerp(14,1.5,ease(same))+Math.sin(g*2)*1.2;
  return `${card('cardDark',g)}<g transform="translate(960,600)"><path d="M0 0 V280 M-120 280 H120" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M0 0 V280 M-120 280 H120" stroke="${P.steel}" stroke-width="10" stroke-linecap="round"/>
     <g transform="rotate(${-tilt})"><path d="M-520 0 H520" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M-520 0 H520" stroke="${P.gold}" stroke-width="10" stroke-linecap="round"/>
      <g transform="translate(-460,0) rotate(${tilt})"><path d="M0 0 L-120 160 M0 0 L120 160" stroke="${INK}" stroke-width="5"/><path d="M-160 160 H160 Q140 210 0 210 Q-140 210 -160 160Z" fill="#2A3248" stroke="${INK}" stroke-width="7"/>${g10_dots(0,120,140,50,45,71,g,{r:7})}</g>
      <g transform="translate(460,0) rotate(${tilt})"><path d="M0 0 L-120 160 M0 0 L120 160" stroke="${INK}" stroke-width="5"/><path d="M-160 160 H160 Q140 210 0 210 Q-140 210 -160 160Z" fill="#2A3248" stroke="${INK}" stroke-width="7"/>
       ${AT(t,p.same??6.3)?[[-80,120],[0,110],[80,120],[-40,80],[40,80]].map(([a,b])=>cellShape(a,b,36,0,0,g,'#FF8FA3')).join(''):''}</g></g><circle r="20" fill="${P.gold}" stroke="${INK}" stroke-width="7"/></g>
   ${T(500,380,'~38 TRILLION',{size:66,fill:g10_C.germ,sc:IN(t,.3)})}${T(500,450,'BACTERIA',{size:48,fill:g10_C.germ,sc:IN(t,.5)})}
   ${AT(t,p.same??6.3)?T(1420,380,'~30 TRILLION',{size:66,fill:'#FF8FA3',sc:pop(t,p.same??6.3)})+T(1420,450,'HUMAN CELLS',{size:48,fill:'#FF8FA3',sc:pop(t,p.same??6.3)}):''}
   ${T(960,150,same>.6?'ROUGHLY THE SAME':'LIVING IN AND ON YOU',{size:90,fill:P.white,sc:pop(t,same>.6?(p.same??6.3)+.9:.2)})}`;
},
germHelpers(t,d,p,g){
  const P3=[[400,'BREAK DOWN FOOD',p.gut??5.9],[960,'MAKE VITAMINS',p.vit??10.4],[1520,'GUARD YOUR SKIN',p.skin??11.9]];
  const pan=(x,i)=>{const k=g*1.5;if(i==0)return `${g10_bug(x-70,560,.7,g,{col:g10_C.bug})}${[0,1,2].map(j=>`<rect x="${x+40+j*36-((k*40+j*30)%60)}" y="${520+j*22}" width="26" height="26" rx="6" fill="${P.warm}" stroke="${INK}" stroke-width="4" transform="rotate(${j*20+g*40} ${x+53+j*36} ${533+j*22})"/>`).join('')}`;
    if(i==1)return `${g10_bug(x-60,580,.7,g,{col:g10_C.bug3})}<g transform="translate(${x+80},${520+Math.sin(g*3)*10}) rotate(-30)"><rect x="-50" y="-24" width="100" height="48" rx="24" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><path d="M0 -24 V24" stroke="${INK}" stroke-width="5"/>${T(-24,14,'V',{size:36,fill:P.white,stroke:6})}</g>`;
    const bx=x+130+Math.abs(Math.sin(g*2))*60;return `${[-120,-30,60].map((dx,j)=>g10_bug(x+dx-30,600-j%2*20,.48,g+j,{col:g10_C.bug2,glow:0})).join('')}${g10_bug(bx+30,470,.5,g,{col:g10_C.bad,mood:'mean',glow:0})}${T(x,450,'TAKEN!',{size:40,fill:P.mint,stroke:7})}`;};
  return `${card('cardMint',g)}${T(960,140,'THE GOOD NEWS',{size:96,fill:P.white,sc:IN(t,.2)})}
   ${AT(t,p.harm??1.4)?labelPill(660,270,'MOSTLY HARMLESS',P.mint,46):''}${AT(t,p.help??3.9)?labelPill(1260,270,'MANY HELP YOU',P.gold,46):''}
   ${!AT(t,p.gut??5.9)?glint({x:960,y:560,s:1,t:g,mouth:'grin',pose:'up',blink:BL(g)})+g10_bug(560,620,.8,g,{col:g10_C.bug,wave:1})+g10_bug(1360,620,.8,g,{col:g10_C.bug3,wave:1}):''}
   ${P3.map(([x,lab,a],i)=>AT(t,a)?`<g transform="translate(${x},570) scale(${pop(t,a)}) translate(${-x},-570)"><rect x="${x-260}" y="380" width="520" height="380" rx="30" fill="#0B2A2A" stroke="${P.mint}" stroke-width="7"/>${pan(x,i)}</g>${T(x,830,lab,{size:46,fill:P.mint,sc:pop(t,a),stroke:8})}`:'').join('')}`;
},
germCity(t,d,p,g){
  const fr=AT(t,p.friendly??4.4);
  let city='';[[-250,150],[-170,230],[-80,180],[10,260],[110,200],[200,240],[280,140]].forEach(([x,h],i)=>{city+=`<rect x="${x-40}" y="${120-h}" width="80" height="${h}" rx="10" fill="${['#1F5A4A','#2A4A7A','#4A2A6A'][i%3]}" stroke="${INK}" stroke-width="5"/>`;for(let j=0;j<3;j++)city+=`<rect x="${x-22}" y="${140-h+j*40}" width="16" height="16" fill="${g10_C.germ}" opacity="${.4+.5*Math.abs(Math.sin(g*2+i+j))}"/><rect x="${x+6}" y="${140-h+j*40}" width="16" height="16" fill="${g10_C.germ}" opacity="${.4+.5*Math.abs(Math.sin(g*2.4+i*2+j))}"/>`;});
  let walkers='';for(let i=0;i<6;i++){const x=((g*60+i*120)%720)-360;walkers+=g10_bug(x,170,.32,g+i,{col:[g10_C.bug,g10_C.bug2,g10_C.bug3][i%3],glow:0,wave:fr?1:0});}
  return `${card('cardDark',g)}${glint({x:420,y:560,s:1.05,t:g,legs:'walk',mouth:'grin',blink:BL(g)})}${g10_glintDots(420,560,1.05,g,50,.8)}
   <path d="M480 640 L930 420 M480 640 L930 780" stroke="${g10_C.germ}" stroke-width="5" stroke-dasharray="6 14" opacity=".7"/>
   <g transform="translate(1260,560)"><circle r="360" fill="#0B1A2A" stroke="${g10_C.germ}" stroke-width="12"/>${city}<rect x="-340" y="120" width="680" height="110" fill="#1B2440"/>${walkers}<circle r="360" fill="none" stroke="${INK}" stroke-width="4"/></g>
   ${T(960,140,fr?'MOSTLY FRIENDLY CITIZENS':'A WALKING CITY',{size:96,fill:fr?P.mint:g10_C.germ,sc:pop(t,fr?p.friendly??4.4:.2)})}`;
},
germToilet(t,d,p,g){
  const fl=AT(t,p.flush??3.7), cl=prog(t,p.cloud??8.5,(p.cloud??8.5)+1.6);
  return `${g10_bath(g)}${g10_dim(.35+.3*cl)}${g10_toilet(780,820,1.3,{lid:1,glow:fl?1:0})}
   ${fl?`<g transform="translate(780,520)">${[0,1,2].map(i=>`<ellipse rx="${60+i*40}" ry="${12+i*8}" fill="none" stroke="#BFEFFF" stroke-width="5" opacity=".7" transform="rotate(${g*300+i*60})"/>`).join('')}</g>`:''}
   ${g10_plume(780,520,cl,g,460,{spread:380})}
   ${glint({x:1460,y:560,s:1.05,t:g,mouth:cl>0?'o':'smile',brows:cl>0?'raised':'calm',pose:cl>0?'shrug':'point',blink:BL(g),dir:-1})}
   ${T(960,150,cl>0?'A CLOUD!':fl?'FLUSH... WITH THE LID UP':'THE BATHROOM',{size:96,fill:cl>0?g10_C.germ:P.white,sc:pop(t,cl>0?p.cloud??8.5:fl?p.flush??3.7:.2)})}`;
},
germLaser(t,d,p,g){
  const dr=prog(t,p.drops??7.3,(p.drops??7.3)+3), br=AT(t,p.brush??13.2), lid=AT(t,p.lid??16.4);
  const h=lerp(240,420,dr), k=lid?Math.max(0,1-prog(t,p.lid??16.4,(p.lid??16.4)+.6)):1;
  return `${g10_bath(g)}${g10_dim(.6)}<path d="M120 80 L560 900 L1080 900 Z" fill="${g10_C.germ}" opacity=".10"/><path d="M120 80 L820 900" stroke="${g10_C.germ}" stroke-width="5" opacity=".5"/>
   <g transform="translate(120,80)"><rect x="-60" y="-30" width="120" height="60" rx="12" fill="#5D6A82" stroke="${INK}" stroke-width="6"/><circle cx="50" cy="20" r="14" fill="${g10_C.germ}"/></g>
   ${g10_toilet(820,840,1.2,{lid:lid?0:1})}${g10_plume(820,564,k,g,h,{spread:440,n:110})}
   ${lid?T(820,330,'SLAM!',{size:80,fill:P.white,sc:pop(t,p.lid??16.4),rot:-8}):''}
   ${AT(t,p.drops??7.3)&&!lid?`<path d="M560 520 H1080" stroke="#fff" stroke-width="5" stroke-dasharray="16 12"/>${T(1250,540,'SEAT',{size:44,fill:P.white,stroke:7})}${T(1220,440,"WELL ABOVE IT"',{size:56,fill:g10_C.germ,sc:pop(t,(p.drops??7.3)+1.5)})}`:''}
   ${br?`<g transform="translate(1500,${lid?560:540})"><rect x="-150" y="120" width="300" height="60" rx="12" fill="#EEF3FA" stroke="${INK}" stroke-width="7"/><rect x="-55" y="0" width="110" height="130" rx="16" fill="#7CD8FF" opacity=".8" stroke="${INK}" stroke-width="7"/>${g10_brush(10,-40,.6,10,P.coral)}${lid?'':g10_dots(10,-80,70,60,24,81,g,{r:5})}</g>${T(1500,800,lid?'SAFE':'YOUR TOOTHBRUSH?!',{size:52,fill:lid?P.mint:P.coral,sc:pop(t,lid?p.lid??16.4:p.brush??13.2)})}`:''}
   ${T(960,140,lid?'CLOSE THE LID':'REAL: GREEN LASERS, COLORADO',{size:lid?110:76,fill:lid?P.mint:P.white,sc:pop(t,lid?p.lid??16.4:.2)})}`;
},
germSponge(t,d,p,g){
  const bl=prog(t,p.blaze??5.3,(p.blaze??5.3)+.8), small=AT(t,p.look??2.2)?1:0;
  const L=[[420,420,'WARM',p.warm??7.6,P.warm],[1500,420,'WET',p.wet??8.3,P.iceDeep],[420,560,'TINY HOLES',p.holes??8.8,P.gold],[1500,560,'FOOD',p.food??10.6,P.coral]];
  const par=AT(t,p.par??12.5);
  return `${g10_kitchen(g)}${g10_dim(.35+.25*bl)}<rect x="660" y="560" width="600" height="60" rx="10" fill="#9AA7BD" stroke="${INK}" stroke-width="6"/>
   ${g10_sponge(960,560,1.3,{g,blaze:bl,germ:small*.3})}
   ${L.map(([x,y,s,a,c])=>AT(t,a)?T(x,y,s,{size:62,fill:c,sc:pop(t,a)}):'').join('')}
   ${par?[[700,800],[960,820],[1220,800]].map(([x,y],i)=>g10_bug(x,y,.55,g+i,{col:[g10_C.bug,g10_C.bug2,g10_C.bug3][i],wave:1})).join(''):''}
   ${T(960,150,par?'BACTERIA PARADISE':bl>0?"IT'S BLAZING":'THE KITCHEN SPONGE',{size:100,fill:bl>0?g10_C.germ:P.white,sc:pop(t,par?p.par??12.5:bl>0?p.blaze??5.3:.2)})}`;
},
germCube(t,d,p,g){
  const cr=AT(t,p.crowd??9.8), cu=prog(t,p.cube??6.5,(p.cube??6.5)+1);
  let crowd='';if(cr){for(let i=0;i<14;i++){const x=600+(i%7)*120,y=470+Math.floor(i/7)*120;crowd+=g10_bug(x+Math.sin(g*3+i)*8,y,.55,g+i,{col:[g10_C.bug,g10_C.bug2,g10_C.bug3][i%3],glow:0});}}
  return `${g10_kitchen(g)}${g10_dim(.55)}
   ${cr?`${crowd}${g10_sponge(960,780,.9,{g,blaze:1})}`:`${g10_sponge(700,560,1.4,{g,blaze:1})}
   ${cu>0?`<g transform="translate(1420,600) scale(${eout(cu)})">${g10_cube(0,0,120)}${g10_dots(0,0,110,110,70,91,g,{r:5})}</g>${T(1420,360,'SUGAR-CUBE SIZE',{size:52,fill:P.white,op:cu})}${T(1420,860,'TENS OF BILLIONS',{size:64,fill:g10_C.germ,sc:pop(t,(p.cube??6.5)+.8)})}`:''}`}
   ${T(960,150,cr?'MOST CROWDED PLACE IN THE HOUSE?':'USED SPONGES, GERMANY',{size:cr?76:90,fill:cr?g10_C.germ:P.white,sc:pop(t,cr?p.crowd??9.8:.2)})}`;
},
germPhone(t,d,p,g){
  const A=[p.bus??3.7,p.cart??4.9,p.lunch??6.3]; const n=A.filter(a=>AT(t,a)).length; const face=AT(t,p.face??7.4);
  const ch=[[300,'AFTER THE BUS',g10_bus(.8)],[500,'SHOPPING CART',g10_cart(.8)],[700,'AFTER LUNCH',g10_burger(.8)]];
  return `${bgRoom(g)}${g10_dim(.3)}
   ${glint({x:face?860:520,y:560,s:1.05,t:g,mouth:face?'wavy':'smile',brows:face?'sad':'calm',pose:face?'down':'reach',blink:BL(g)})}
   ${g10_phone(face?1010:720,face?440:560,face?.62:.75,{g,germ:.15+n*.28,glow:n/3,rot:face?-14:-6})}
   ${ch.map(([y,lab,ic],i)=>AT(t,A[i])?`<g transform="translate(1440,${y}) scale(${pop(t,A[i])})"><rect x="-300" y="-75" width="600" height="150" rx="30" fill="#1B2440" stroke="${g10_C.germ}" stroke-width="7"/><g transform="translate(-200,0)">${ic}</g>${T(70,18,lab,{size:46,fill:P.white,stroke:8})}</g>`:'').join('')}
   ${T(960,140,face?'...AND ON YOUR FACE':'YOU TOUCH IT ALL DAY',{size:96,fill:face?g10_C.germ:P.white,sc:pop(t,face?p.face??7.4:.2)})}`;
},
germVs(t,d,p,g){
  const cl=AT(t,p.clean??4.5);
  return `${card('cardDark',g)}${g10_phone(560,520,1,{g,germ:1,glow:1})}${g10_toilet(1360,760,.95,{lid:1,glow:.3})}${g10_dots(1360,540,150,40,10,101,g,{r:5,op:.7})}
   ${T(960,520,'VS',{size:120,fill:P.gold})}
   ${T(560,860,cl?'ALMOST NEVER CLEANED':'MORE BACTERIA',{size:54,fill:cl?P.coral:g10_C.germ,sc:pop(t,cl?p.clean??4.5:.4)})}
   ${cl?`${g10_spray(1640,520,.8,'CLEANER',-10)}${T(1360,860,'GETS CLEANED',{size:54,fill:P.mint,sc:pop(t,p.clean??4.5)})}`:''}
   ${T(960,150,'PHONE VS TOILET SEAT',{size:96,fill:P.white,sc:IN(t,.2)})}${T(960,250,'(IN SOME STUDIES)',{size:44,fill:P.ice,op:prog(t,1,1.4)})}`;
},
germGalaxy(t,d,p,g){
  const pr=AT(t,p.prints??4.2);
  let gal='';const r=rng(111);for(let i=0;i<150;i++){const arm=i%3,dd=r(),a=arm*2.09+dd*4.2+g*.25,rr=dd*300;const x=Math.cos(a)*rr+(r()-.5)*40,y=Math.sin(a)*rr*.55+(r()-.5)*30;const tw=.5+.5*Math.sin(g*4+i);gal+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(3+r()*5)*1.1}" fill="${i%9?g10_C.germ:g10_C.spark}" opacity="${(.5+.5*tw).toFixed(2)}"/>`;}
  const pts=[[300,780,-20],[520,700,10],[760,780,-10],[1000,690,20],[1240,770,-15],[1480,680,8],[1700,760,-12]];
  return `${card('cardDark',g)}${g10_dim(.4)}
   <g transform="translate(960,${pr?400:540}) scale(${pr?.72:1})"><rect x="-560" y="-300" width="1120" height="600" rx="70" fill="#1E2436" stroke="${INK}" stroke-width="14"/><rect x="-520" y="-262" width="1040" height="524" rx="40" fill="#0A0E24"/><circle r="50" fill="${g10_C.germ}" opacity=".3"/>${gal}</g>
   ${pr?pts.map(([x,y,r],i)=>AT(t,(p.prints??4.2)+i*.3)?g10_print(x,y,.8,pop(t,(p.prints??4.2)+i*.3),r):'').join(''):''}
   ${T(960,140,pr?'GLOWING FINGERPRINTS':'A BUSY LITTLE GALAXY',{size:96,fill:pr?g10_C.germ:P.white,sc:pop(t,pr?p.prints??4.2:.2)})}`;
},
germDrop(t,d,p,g){
  const dr=prog(t,p.drop??2.5,(p.drop??2.5)+.6), pk=AT(t,p.pick??5.2), sf=AT(t,p.safe??7.4);
  const my=pk?lerp(820,560,eout(prog(t,p.pick??5.2,(p.pick??5.2)+.5))):lerp(380,820,dr*dr);
  return `${g10_kitchen(g)}<rect y="880" width="1920" height="200" fill="#3A2A22"/>
   ${glint({x:1450,y:520,s:1,t:g,mouth:sf?'smirk':pk?'smile':dr>0?'o':'smile',brows:sf?'raised':'calm',pose:pk?'reach':'down',blink:BL(g),dir:-1})}
   ${AT(t,p.drop??2.5)?g10_melon(pk?1300:960,my,.8,pk?-10:dr*80):''}${dr>=1&&!pk?T(960,720,'SPLAT',{size:60,fill:P.coral,sc:pop(t,(p.drop??2.5)+.6)}):''}
   ${clockP(420,500,150,pk?g*.2:g)}${pk?T(420,740,'UNDER 1 SECOND',{size:56,fill:P.gold,sc:pop(t,p.pick??5.2)}):''}
   ${T(960,140,sf?'SAFE, RIGHT?':'THE 5-SECOND RULE',{size:100,fill:sf?P.gold:P.white,sc:pop(t,sf?p.safe??7.4:.2)})}`;
},
germRutgers(t,d,p,g){
  const jp=AT(t,p.jump??3.9), wet=AT(t,p.wet??8.7), rule=AT(t,p.rule??15.6), eat=AT(t,p.eat??18.8);
  if(rule) return `${card('cardWarm',g)}${glint({x:560,y:560,s:1.1,t:g,mouth:eat?'wavy':'frown',brows:eat?'sad':'calm',blink:BL(g),pose:eat?'shrug':'cross'})}
     <g transform="translate(1330,520)">${g10_melon(0,-40,1)}${g10_dots(0,10,140,70,eat?60:20,121,g,{r:6,op:eat?1:.5})}</g>
     ${stamp(1330,560,.9*pop(t,p.rule??15.6),'NOT A RULE')}${eat?T(1330,840,'NOW YOU SEE IT',{size:56,fill:g10_C.germ,sc:pop(t,p.eat??18.8)}):''}
     ${T(960,140,'THE 5-SECOND RULE?',{size:96,fill:P.white,sc:pop(t,p.rule??15.6)})}`;
  const bars=[['WATERMELON',P.coral,.95,p.melon??11.3],['GUMMY CANDY',P.warm,.18,p.gummy??13.4]];
  return `${bgLab(g)}
   ${wet?bars.map(([lab,c,v,a],i)=>{const k=eout(prog(t,a,a+.8));const y=420+i*220;return AT(t,a)?`${i?g10_gummy(420,y+10,.6):g10_melon(420,y,.6)}<rect x="600" y="${y-50}" width="${1100*v*k}" height="100" rx="20" fill="${c}" stroke="${INK}" stroke-width="7"/>${T(620,y+90+20,lab,{size:44,fill:c,anchor:'start',stroke:8})}${k>.9?T(600+1100*v+(v<.5?120:-140),y+20,v>.5?'WORST':'LEAST',{size:46,fill:P.white,stroke:8}):''}`:''}).join('')+T(960,270,'WET FOOD = FASTEST',{size:60,fill:P.ice,sc:pop(t,p.wet??8.7)})
   :`<rect x="300" y="720" width="1320" height="40" rx="10" fill="#5D6A82" stroke="${INK}" stroke-width="6"/>${g10_melon(960,700,1)}
     ${g10_dots(960,800,600,40,40,131,g,{r:6})}${jp?[...Array(12)].map((_,i)=>{const k=((g*1.2+i/12)%1);const sx=420+i*95,ex=900+(i%5)*30;return `<circle cx="${lerp(sx,ex,k)}" cy="${790-Math.sin(k*Math.PI)*220-k*60}" r="7" fill="${g10_C.germ}" opacity="${1-k*.3}"/>`;}).join('')+T(960,420,'IN LESS THAN 1 SECOND',{size:70,fill:g10_C.germ,sc:pop(t,p.jump??3.9)}):''}`}
   ${T(960,150,wet?'WHAT PICKS UP THE MOST?':'RUTGERS UNIVERSITY TESTED IT',{size:84,fill:P.white,sc:pop(t,wet?p.wet??8.7:.2)})}`;
},
germSneeze(t,d,p,g){
  const fw=prog(t,p.fire??3.8,(p.fire??3.8)+1.2), big=AT(t,p.big??9.6), sm=prog(t,p.small??12,(p.small??12)+5);
  const r=rng(141);let burst='';if(fw>0){for(let i=0;i<70;i++){const a=-1.1+r()*2.2,sp=200+r()*500,rr=3+r()*6;const x=470+Math.cos(a)*sp*eout(fw)+sm*900*(.4+r()*.6),y=420+Math.sin(a)*sp*.6*eout(fw)+Math.sin(g*2+i)*8;burst+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr*2.4}" fill="${g10_C.germ}" opacity="${.2*(1-fw*.3)}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr}" fill="${g10_C.germ}" opacity="${1-fw*.3}"/>`;}}
  let drops='';if(big)for(let i=0;i<7;i++){const k=prog(t,(p.big??9.6)+i*.1,(p.big??9.6)+1.2+i*.1);drops+=`<circle cx="${560+i*60+k*80}" cy="${420+k*k*440}" r="16" fill="${P.iceDeep}" stroke="${INK}" stroke-width="5"/>`;}
  return `${bgNight(g)}${g10_dim(.35)}${extra({x:360,y:560,s:1,t:g,head:'#FFD3A8',mouth:fw>0?'laugh':'smile'})}
   ${!AT(t,p.fire??3.8)?T(560,330,'AH... AH...',{size:56,fill:P.white,op:prog(t,p.sn??1.9,(p.sn??1.9)+.3)}):''}
   ${burst}${drops}${big?T(760,300,'BIG ONES FALL',{size:48,fill:P.iceDeep,sc:pop(t,p.big??9.6)}):''}
   ${glint({x:1640,y:560,s:.95,t:g,mouth:sm>.3?'o':'smile',brows:sm>.3?'raised':'calm',blink:BL(g),dir:-1,pose:sm>.5?'shrug':'down'})}
   ${sm>0?`<path d="M480 900 H1500" stroke="${P.white}" stroke-width="6"/>${[0,1,2,3,4].map(i=>`<path d="M${480+i*255} 880 V920" stroke="${P.white}" stroke-width="6"/>`).join('')}${T(1240,840,'SEVERAL METERS',{size:52,fill:g10_C.germ,sc:pop(t,p.small??12)})}`:''}
   ${T(960,150,fw>0?'LIKE A FIREWORK':'STEP OUTSIDE',{size:100,fill:fw>0?g10_C.germ:P.white,sc:pop(t,fw>0?p.fire??3.8:.2)})}`;
},
germMIT(t,d,p,g){
  const cv=AT(t,p.cover??7.6);
  if(cv) return `${bgNight(g)}${[[420,'#FFD3A8'],[960,'#C68B59'],[1500,'#F2C9A0']].map(([x,h],i)=>g10_elbow(x,560,.95,g+i,h)).join('')}
     ${T(960,150,AT(t,p.elbow??9.8)?'SNEEZE INTO YOUR ELBOW':'COVER UP',{size:96,fill:P.mint,sc:pop(t,AT(t,p.elbow??9.8)?p.elbow??9.8:p.cover??7.6)})}`;
  const k=prog(t,1,6);let fr='';for(let i=0;i<4;i++){const x=760+i*290;const sp=(i+1)/4;fr+=`<rect x="${x-130}" y="380" width="260" height="300" rx="10" fill="#0A0E24" stroke="${P.white}" stroke-width="6"/>${g10_dots(x-120+sp*130,530,40+sp*90,40+sp*50,8+i*8,150+i,g,{r:4})}`;}
  return `${card('cardDark',g)}${g10_cam(300,520,1.1,g)}<path d="M480 524 L620 420 L620 640Z" fill="#fff" opacity=".08"/>${fr}
   ${AT(t,p.far??3.3)?`<path d="M640 760 H${lerp(700,1840,eout(prog(t,p.far??3.3,(p.far??3.3)+2)))}" stroke="${g10_C.germ}" stroke-width="12" stroke-linecap="round"/>${T(1260,850,'MUCH FARTHER THAN EXPECTED',{size:52,fill:g10_C.germ,sc:pop(t,(p.far??3.3)+1)})}`:''}
   ${T(960,150,'MIT: HIGH-SPEED CAMERAS',{size:90,fill:P.white,sc:IN(t,.2)})}`;
},
germCloud(t,d,p,g){
  const L=[[1380,330,'SKIN',p.skin??3.8],[1380,500,'BREATH',p.breath??4.6],[1380,670,'CLOTHES',p.clothes??5.6]];
  const au=prog(t,.6,2.4);
  return `${card('cardDark',g)}${g10_aura(760,500,1.2,g,g10_C.germ,au,3)}${glint({x:760,y:540,s:1.05,t:g,mouth:'o',brows:'raised',blink:BL(g),look:-.4})}
   ${L.map(([x,y,s,a])=>AT(t,a)?`<path d="M${x-170} ${y-10} L${1000} ${y+40}" stroke="${g10_C.germ}" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round"/>${T(x+60,y+10,s,{size:66,fill:g10_C.germ,sc:pop(t,a)})}`:'').join('')}
   ${T(960,150,'YOUR PERSONAL CLOUD',{size:100,fill:P.white,sc:IN(t,.2)})}`;
},
germAura(t,d,p,g){
  const ap=AT(t,p.apart??5.9), au=AT(t,p.aura??10.7), un=AT(t,p.unique??15.8);
  const cols=[g10_C.germ,'#C89BFF','#FFB86B','#7CD8FF','#FF8FA3'];
  if(au){const ppl=[[260,'#FFD3A8'],[620,'#C68B59'],[1300,'#F2C9A0'],[1660,'#8D5A3B']];
    return `${bgNight(g)}${g10_dim(.45)}${ppl.map(([x,h],i)=>g10_aura(x,560,.9,g,cols[i+1],1,i+11)+extra({x,y:580,s:.8,t:g+i,head:h})).join('')}
     ${g10_aura(960,520,1,g,g10_C.germ,1,9)}${glint({x:960,y:560,s:.9,t:g,mouth:'grin',blink:BL(g),pose:'shrug'})}
     ${T(960,150,un?'UNIQUELY YOURS':'EVERYONE HAS AN AURA',{size:100,fill:un?g10_C.germ:P.white,sc:pop(t,un?p.unique??15.8:p.aura??10.7)})}`;}
  return `${card('cardDark',g)}<g transform="translate(${ap?520:960},560)"><rect x="-300" y="-330" width="600" height="600" rx="20" fill="#E8F4FF" opacity=".15" stroke="#E8F4FF" stroke-width="10"/>
     ${g10_aura(0,-20,.9,g,cols[0],prog(t,1.5,3),2)}${extra({x:0,y:-20,s:.75,t:g,head:'#FFD3A8'})}<g transform="translate(200,160)"><rect x="-40" y="-60" width="80" height="120" rx="14" fill="#5D6A82" stroke="${INK}" stroke-width="6"/><circle cy="-20" r="20" fill="${g10_C.germ}" opacity="${.5+.5*Math.sin(g*5)}"/></g></g>
   ${ap?[0,1,2].map(i=>`<g transform="translate(1300,${360+i*190}) scale(${pop(t,(p.apart??5.9)+i*.3)})"><circle cx="-120" r="70" fill="${cols[i+1]}" opacity=".25"/>${g10_dots(-120,0,60,60,14,170+i,g,{col:cols[i+1],r:5})}${T(150,20,['PERSON A','PERSON B','PERSON C'][i],{size:52,fill:cols[i+1],stroke:8})}</g>`).join(''):''}
   ${T(960,150,ap?'TELL PEOPLE APART':'A CLEAN ROOM STUDY',{size:96,fill:ap?g10_C.germ:P.white,sc:pop(t,ap?p.apart??5.9:.2)})}`;
},
germBleach(t,d,p,g){
  const tw=AT(t,p.twist??3.4), hm=AT(t,p.harm??6.7), tr=AT(t,p.trained??13), wp=prog(t,p.wipe??15.6,(p.wipe??15.6)+1.8);
  if(!hm) return `${card('cardWarm',g)}${glint({x:620,y:560,s:1.1,t:g,mouth:tw?'o':'grin',brows:tw?'raised':'angry',pose:'reach',blink:BL(g)})}${g10_spray(820,560,1,'BLEACH',-6)}
     ${!tw?[0,1,2,3,4].map(i=>{const k=(g*1.5+i/5)%1;return `<circle cx="${900+k*500}" cy="${470+Math.sin(i*2)*60*k}" r="${10+k*30}" fill="#E6FAFF" opacity="${.6*(1-k)}"/>`;}).join(''):''}
     ${tw?icon('cross',1380,520,1.6*pop(t,p.twist??3.4))+T(1380,760,'COULD MAKE IT WORSE',{size:56,fill:P.coral,sc:pop(t,(p.twist??3.4)+.6)}):''}
     ${T(960,150,tw?'THE TWIST':'BLEACH EVERYTHING?',{size:100,fill:tw?P.coral:P.white,sc:pop(t,tw?p.twist??3.4:.2)})}`;
  const r=rng(181);let f='';for(let i=0;i<22;i++){const x=260+r()*1400,y=330+r()*480,mean=i%7===0;const gone=!mean&&x<lerp(-200,2100,wp);const grow=mean?1+wp*.8:1;if(!gone)f+=g10_bug(x,y,.68*grow,g+i,{col:mean?g10_C.bad:[g10_C.bug,g10_C.bug2,g10_C.bug3][i%3],mood:mean?'mean':'happy',glow:0});}
  return `${card('cardMint',g)}${f}${wp>0&&wp<1?`<rect x="${lerp(-200,2100,wp)-60}" y="260" width="120" height="640" rx="40" fill="#E6FAFF" opacity=".55"/>`:''}
   ${tr&&wp<=0?`<g transform="translate(1700,760) scale(${pop(t,p.trained??13)})"><path d="M0 -90 L80 -60 V10 Q80 70 0 100 Q-80 70 -80 10 V-60Z" fill="${P.iceDeep}" stroke="${INK}" stroke-width="8"/>${icon('check',0,0,.6)}</g>`:''}
   ${T(960,150,wp>0?'WIPE OUT THE FRIENDLY ONES...':tr?'THEY TRAIN YOUR IMMUNE SYSTEM':'MOST ARE HARMLESS',{size:wp>0?80:84,fill:wp>0?P.coral:P.mint,sc:pop(t,wp>0?p.wipe??15.6:tr?p.trained??13:p.harm??6.7)})}
   ${wp>=1?T(960,880,'...AND THE BAD ONES MOVE IN',{size:56,fill:P.coral,sc:pop(t,(p.wipe??15.6)+1.8)}):''}`;
},
germTips(t,d,p,g){
  const tiles=[[1020,400,'WASH 20 SEC',p.wash??5.4,`<rect x="-60" y="-30" width="120" height="60" rx="24" fill="#FFB4D8" stroke="${INK}" stroke-width="6"/>${[0,1,2].map(i=>`<circle cx="${-40+i*40}" cy="${-50-((g*40+i*20)%40)}" r="14" fill="#E6FAFF" stroke="${INK}" stroke-width="4" opacity=".9"/>`).join('')}`],
    [1580,400,'CLOSE THE LID',p.lid??8.2,g10_toilet(0,90,.35,{lid:0})],[1020,700,'NEW SPONGE',p.sponge??9.7,g10_sponge(0,0,.45,{fresh:1})],[1580,700,'CLEAN YOUR PHONE',p.phone??11.3,g10_phone(0,0,.35,{})+g10_star(50,-50,24,'#fff',1)]];
  return `${card('cardMint',g)}${glint({x:380,y:560,s:1,t:g,mouth:'grin',pose:AT(t,p.hide??2.5)?'point':'down',blink:BL(g)})}
   ${tiles.map(([x,y])=>`<rect x="${x-260}" y="${y-125}" width="520" height="250" rx="30" fill="none" stroke="${P.mint}" stroke-width="5" stroke-dasharray="14 14" opacity=".4"/>`).join('')}
   ${tiles.map(([x,y,lab,a,ic])=>AT(t,a)?`<g transform="translate(${x},${y}) scale(${pop(t,a)})"><rect x="-260" y="-125" width="520" height="250" rx="30" fill="#0B2A2A" stroke="${P.mint}" stroke-width="7"/><g transform="translate(-150,0)">${ic}</g>${T(90,18,lab,{size:42,fill:P.white,stroke:8})}${icon('check',210,-90,.4)}</g>`:'').join('')}
   ${T(960,150,AT(t,p.hide??2.5)?'KNOW WHERE THEY HIDE':'THE REAL TRICK',{size:96,fill:AT(t,p.hide??2.5)?g10_C.germ:P.white,sc:pop(t,AT(t,p.hide??2.5)?p.hide??2.5:.2)})}`;
}
});
