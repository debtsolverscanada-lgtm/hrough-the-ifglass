// episode 018 scenes (never sleep) — story episode
const n18_HZ='#A9AEBE', n18_CO1='#4A4F5C', n18_ICE='#CFE8FF';
const n18_CRISIS=396.54; // global time when "Nan won't wake" — countdown starts at 3:00
function n18_zzz(x,y,g,s=1,col=P.ice){let z='';for(let i=0;i<3;i++){const k=((g*.45+i/3)%1);z+=T(x+k*70*s,y-k*130*s,'Z',{size:(34+i*12)*s,fill:col,stroke:7*s,op:Math.sin(k*Math.PI)});}return z;}
function n18_blurDef(){return `<defs><filter id="n18bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="34"/></filter></defs>`;}
// carbon monoxide made visible: faint grey drifting haze
function n18_haze(g,a,seed=5){if(a<=0)return '';const r=rng(seed);let s='';
  for(let i=0;i<14;i++){const x=r()*2100-90+Math.sin(g*.3+i)*70,y=r()*860+80+Math.cos(g*.25+i)*30,rx=200+r()*240;s+=`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${(rx*.5).toFixed(0)}" fill="${n18_HZ}" opacity="${(a*.3).toFixed(3)}" filter="url(#n18bl)"/>`;}
  let d='';for(let i=0;i<46;i++){const x=(r()*1920+g*(8+r()*14))%1920,y=r()*900;d+=`<circle cx="${x.toFixed(0)}" cy="${(y+Math.sin(g+i)*10).toFixed(0)}" r="${(2+r()*3).toFixed(1)}" fill="#D6DAE4" opacity="${(a*.4).toFixed(3)}"/>`;}
  return n18_blurDef()+s+d+`<rect width="1920" height="1080" fill="${n18_HZ}" opacity="${(a*.13).toFixed(3)}"/>`;}
function n18_fmt(sec){sec=Math.max(0,Math.ceil(sec));return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;}
function n18_timer(sec,g,o={}){const {x=1660,y=120,s=1,label='NAN NEEDS AIR',col=P.red,txt=null}=o;const pl=txt?1:1+.04*Math.sin(g*8);
  return `<g transform="translate(${x},${y}) scale(${s*pl})"><rect x="-210" y="-80" width="420" height="160" rx="20" fill="#120610" fill-opacity=".9" stroke="${col}" stroke-width="7"/>
   ${txt?'':`<circle cx="-170" cy="-44" r="10" fill="${col}" opacity="${Math.sin(g*6)>0?1:.25}"/>`}<text y="-34" text-anchor="middle" font-size="30" font-weight="900" letter-spacing="3" fill="${col}">${label}</text>
   <text y="50" text-anchor="middle" font-size="88" font-weight="900" fill="#fff" style="font-variant-numeric:tabular-nums">${txt||n18_fmt(sec)}</text></g>`;}
const n18_left=g=>180-(g-n18_CRISIS);
function n18_days(x,y,n,s=1,o={}){const {label='DAYS AWAKE',col=P.mint}=o;
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-200" y="-92" width="400" height="184" rx="22" fill="#0B1026" fill-opacity=".92" stroke="${col}" stroke-width="7"/>
   <text y="-44" text-anchor="middle" font-size="34" font-weight="900" letter-spacing="3" fill="${col}">${label}</text><text y="64" text-anchor="middle" font-size="108" font-weight="900" fill="#fff">${n}</text></g>`;}
function n18_clock(x,y,r,hours,o={}){const {face='#FFF6EA',col=P.red}=o;const m=((hours*60)%60+60)%60,h=((hours%12)+12)%12;
  return `<g transform="translate(${x},${y})"><circle r="${r}" fill="${face}" stroke="${INK}" stroke-width="${Math.max(6,r*.09)}"/>${[...Array(12)].map((_,i)=>`<path d="M0 ${-r*.86} V${-r*.7}" stroke="${INK}" stroke-width="${Math.max(3,r*.05)}" transform="rotate(${i*30})"/>`).join('')}
   <path d="M0 0 V${-r*.5}" stroke="${INK}" stroke-width="${r*.09}" stroke-linecap="round" transform="rotate(${h*30})"/><path d="M0 0 V${-r*.76}" stroke="${col}" stroke-width="${r*.055}" stroke-linecap="round" transform="rotate(${m*6})"/><circle r="${r*.08}" fill="${INK}"/></g>`;}
// big "PLUS:" / "MINUS:" label that pops at centre, then tucks into the top-left corner
function n18_pm(t,kind,sub){const plus=kind==='plus',col=plus?P.mint:P.red,k=eout(prog(t,2.1,2.7)),sc=lerp(1,.4,k)*pop(t,.02,.4),x=lerp(960,310,k),y=lerp(470,110,k);
  return `<rect width="1920" height="1080" fill="#05030C" opacity="${.62*(1-k)}"/><g transform="translate(${x},${y}) scale(${sc}) rotate(${-3*(1-k)})">${T(0,0,plus?'PLUS:':'MINUS:',{size:230,fill:col,stroke:52})}${T(0,150,sub,{size:96,fill:P.white})}</g>`;}
// microsleep: a black flicker
function n18_gap(t,a,len=.8){if(a==null||t<a||t>a+len)return '';const k=(t-a)/len,o=k<.12?k/.12:k>.88?(1-k)/.12:1;const r=rng(Math.floor(t*30)+3);let b='';
  for(let i=0;i<6;i++)b+=`<rect x="0" y="${(r()*1080).toFixed(0)}" width="1920" height="${(4+r()*18).toFixed(0)}" fill="#fff" opacity=".07"/>`;return `<g opacity="${o.toFixed(3)}"><rect width="1920" height="1080" fill="#000"/>${b}</g>`;}
function n18_throb(x,y,g,s=1,a=1){if(a<=0)return '';let o='';for(let i=0;i<3;i++){const k=((g*1.2+i/3)%1);o+=`<circle cx="${x}" cy="${y}" r="${(120+k*90)*s}" fill="none" stroke="${P.red}" stroke-width="${8*s}" opacity="${(a*(1-k)*.7).toFixed(3)}"/>`;}return o;}
function n18_swirl(x,y,g,s=1){let d='';for(let i=0;i<=40;i++){const a=i*.45,r=4+i*2.2;d+=(i?'L':'M')+(Math.cos(a)*r).toFixed(1)+' '+(Math.sin(a)*r).toFixed(1);}
  return `<g transform="translate(${x},${y}) scale(${s}) rotate(${g*160})"><path d="${d}" stroke="${P.violet}" stroke-width="9" fill="none" stroke-linecap="round"/></g>`;}
function n18_note(x,y,s=1,col=P.gold,op=1){return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s})" opacity="${Math.max(0,op).toFixed(3)}"><ellipse cx="0" cy="0" rx="20" ry="14" fill="${col}" stroke="${INK}" stroke-width="5" transform="rotate(-20)"/><path d="M16 -4 V-72 Q42 -62 46 -36" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;}
function n18_notes(x,y,g,a=1,n=6,col=P.gold,fall=0){let s='';for(let i=0;i<n;i++){const k=((g*.35+i/n)%1);s+=n18_note(x+Math.sin(g*1.5+i*2)*60+i*36-n*18,y-k*300+fall*k*420,.9+.3*Math.sin(i),col,a*Math.sin(k*Math.PI));}return s;}
function n18_air(g,a,x0=560,y0=330){if(a<=0)return '';let s='';for(let i=0;i<6;i++){const k=((g*.6+i/6)%1),yy=y0+i*26-60;let d=`M${x0} ${yy}`;for(let j=1;j<=8;j++)d+=` L${x0+j*70*k*1.8} ${yy+Math.sin(j*.9+g*4+i)*18}`;s+=`<path d="${d}" stroke="${n18_ICE}" stroke-width="7" fill="none" stroke-linecap="round" opacity="${(a*(1-k)*.8).toFixed(3)}"/>`;}return s;}
function n18_sparks(x,y,g,a=1){const r=rng(Math.floor(g*12)+5);let s='';for(let i=0;i<10;i++){const an=r()*6.28,l=40+r()*110;s+=`<path d="M${x} ${y} L${(x+Math.cos(an)*l).toFixed(0)} ${(y+Math.sin(an)*l).toFixed(0)}" stroke="${r()>.5?P.gold:'#fff'}" stroke-width="${(4+r()*4).toFixed(1)}" stroke-linecap="round" opacity="${a}"/>`;}return s+`<circle cx="${x}" cy="${y}" r="34" fill="#fff" opacity="${a*.8}"/>`;}
function n18_bubble2(x,y,w,l1,l2,o={}){const {size=46,tail='left',col=INK}=o;const h=l2?size*2.7:size*1.8,tx=tail==='left'?-w/2+60:w/2-60;
  return `<g transform="translate(${x},${y})"><path d="M${-w/2} ${-h/2} H${w/2} V${h/2} H${tx+30} L${tx} ${h/2+46} L${tx-14} ${h/2} H${-w/2}Z" fill="#FFF6EA" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   <text y="${l2?-size*.2:size*.35}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${col}">${l1}</text>${l2?`<text y="${size*1.0}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${col}">${l2}</text>`:''}</g>`;}
function n18_think(x,y,w,str,size=46){return `<g transform="translate(${x},${y})"><circle cx="${-w/2+30}" cy="80" r="16" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><circle cx="${-w/2+6}" cy="112" r="10" fill="#FFF6EA" stroke="${INK}" stroke-width="5"/><rect x="${-w/2}" y="-55" width="${w}" height="110" rx="55" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><text y="${size*.35}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${INK}">${str}</text></g>`;}
// ---------- sets ----------
function n18_city(g,o={}){const {win=1}=o;const r=rng(81);let far='',near='',st='';
  for(let i=0;i<90;i++){const x=r()*1920,y=r()*520;st+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1+r()*2.2).toFixed(1)}" fill="#fff" opacity="${(.3+.6*Math.abs(Math.sin(g*1.3+i))).toFixed(2)}"/>`;}
  let x=-40;while(x<1960){const w=70+r()*120,h=220+r()*360;far+=`<rect x="${x.toFixed(0)}" y="${(820-h).toFixed(0)}" width="${w.toFixed(0)}" height="${(h+300).toFixed(0)}" fill="#1B1640"/>`;
    for(let k=0;k<8;k++){const wx=x+8+r()*(w-24),wy=830-h+20+r()*(h-60),th=r();far+=`<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="10" height="12" fill="${P.gold}" opacity="${(th<win?.6:.07).toFixed(2)}"/>`;}x+=w+10;}
  x=-60;while(x<1980){const w=120+r()*170,h=120+r()*220;near+=`<rect x="${x.toFixed(0)}" y="${(900-h).toFixed(0)}" width="${w.toFixed(0)}" height="${(h+200).toFixed(0)}" rx="6" fill="#110C26"/>`;
    for(let k=0;k<5;k++){const wx=x+12+r()*(w-40),wy=910-h+16+r()*(h-50),th=r();near+=`<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="16" height="18" fill="#FFD98E" opacity="${(th<win?.75:.06).toFixed(2)}"/>`;}x+=w+12;}
  return `<rect width="1920" height="1080" fill="url(#sky)"/>${st}<circle cx="1560" cy="190" r="200" fill="url(#moon)" opacity=".5"/><circle cx="1560" cy="190" r="64" fill="#fff4dc"/>${far}${near}<rect y="900" width="1920" height="180" fill="${P.ground}"/>`;}
function n18_coAlarm(x,y,s,state,g){const led=state==='on'?(Math.sin(g*3)>.6?'#5CFF8A':'#2E7D4A'):state==='alarm'?(Math.sin(g*12)>0?P.red:'#5A1020'):'#3A3A44';
  return `<g transform="translate(${x},${y}) scale(${s})">${state!=='off'?`<circle r="100" fill="${state==='alarm'?'url(#gRed)':'url(#gMint)'}" opacity=".5"/>`:''}<circle r="56" fill="#F4F2EC" stroke="${INK}" stroke-width="8"/><circle r="42" fill="none" stroke="#C9C2B8" stroke-width="4"/>
   <text y="8" text-anchor="middle" font-size="34" font-weight="900" fill="${INK}">CO</text><circle cy="28" r="7" fill="${led}" stroke="${INK}" stroke-width="3"/></g>`;}
function n18_boiler(g,o={}){const {boil=1,leak=0,hum=0}=o;const f1=Math.sin(g*9)*6,f2=Math.sin(g*7+1)*8;
  let s=`<path d="M1560 600 V820 M1660 600 V820" stroke="${INK}" stroke-width="26"/><path d="M1560 600 V820 M1660 600 V820" stroke="#9AA7BD" stroke-width="16"/>`;
  if(boil)s+=`<circle cx="1610" cy="440" r="${(270+Math.sin(g*3)*10).toFixed(0)}" fill="url(#gWarm)" opacity="${leak?.55:.28}"/>`;
  s+=`<rect x="1490" y="220" width="240" height="380" rx="20" fill="#E8E2D6" stroke="${INK}" stroke-width="9"/><rect x="1530" y="258" width="160" height="44" rx="8" fill="#C9C2B8" stroke="${INK}" stroke-width="5"/><circle cx="1560" cy="280" r="8" fill="${boil?P.mint:'#555'}"/>
   <rect x="1560" y="400" width="100" height="92" rx="12" fill="#1A1020" stroke="${INK}" stroke-width="6"/>`;
  if(boil)s+=`<path d="M1580 484 Q1592 ${(446+f1).toFixed(0)} 1610 ${(418+f2).toFixed(0)} Q1628 ${(446+f1).toFixed(0)} 1640 484Z" fill="${leak?'#FFB13B':'#5AB8FF'}" opacity=".95"/>`;
  if(hum)for(let i=0;i<3;i++){const k=((g*.9+i/3)%1);s+=`<path d="M${1750+k*60} ${330+i*50} q20 -14 40 0 t40 0" stroke="${P.gold}" stroke-width="6" fill="none" opacity="${(hum*(1-k)).toFixed(2)}"/>`;}
  return s;}
function n18_kitchen(g,o={}){const {win=0,door=0,boil=1,leak=1,alarm='off',clock=3,morning=0,hum=0}=o;
  const wall=morning?'#34467A':'#19213F',tile=morning?'#40538A':'#1F2A4E';
  let s=`<rect width="1920" height="1080" fill="${wall}"/><rect y="560" width="1920" height="260" fill="${tile}"/>`;
  for(let i=1;i<24;i++)s+=`<path d="M${i*80} 560 V820" stroke="#000" stroke-opacity=".14" stroke-width="3"/>`;
  s+=`<path d="M0 640 H1920 M0 720 H1920" stroke="#000" stroke-opacity=".14" stroke-width="3"/><rect y="820" width="1920" height="260" fill="#2A2036"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="6"/>`;
  const sky=morning?'#8FD0FF':'#0A0F26';
  s+=`<rect x="180" y="150" width="380" height="320" fill="${sky}"/>${morning?`<circle cx="470" cy="240" r="46" fill="${P.gold}"/>`:`<circle cx="470" cy="230" r="28" fill="#fff4dc"/><circle cx="260" cy="200" r="3" fill="#fff"/><circle cx="330" cy="262" r="2.5" fill="#fff"/><circle cx="400" cy="190" r="2" fill="#fff"/>`}
   <path d="M180 470 L260 400 L320 430 L380 380 L460 420 L560 390 V470Z" fill="${morning?'#5C7AB0':'#141A38'}"/>
   <rect x="180" y="150" width="380" height="320" fill="none" stroke="#E8E2D6" stroke-width="16"/><path d="M370 150 V310" stroke="#E8E2D6" stroke-width="10"/>
   <g transform="translate(0,${(-win*150).toFixed(1)})"><rect x="180" y="310" width="380" height="160" fill="${win>0?'none':'rgba(180,220,255,.08)'}" stroke="#E8E2D6" stroke-width="14"/><path d="M370 310 V470" stroke="#E8E2D6" stroke-width="10"/></g>
   <rect x="160" y="470" width="420" height="26" rx="6" fill="#E8E2D6" stroke="${INK}" stroke-width="5"/>`;
  s+=`<rect x="640" y="300" width="230" height="520" fill="#0A1430"/>${door>0?`<circle cx="760" cy="430" r="3" fill="#fff"/><circle cx="820" cy="380" r="2" fill="#fff"/><path d="M640 820 V720 Q760 690 870 712 V820Z" fill="#C9DDF2" opacity=".55"/>`:''}
   <g transform="translate(640,300) scale(${(1-door*.82).toFixed(3)},1)"><rect width="230" height="520" fill="#6B4A3A" stroke="${INK}" stroke-width="8"/><rect x="34" y="40" width="162" height="160" fill="#0A1430" stroke="${INK}" stroke-width="6"/><circle cx="196" cy="290" r="12" fill="${P.gold}" stroke="${INK}" stroke-width="4"/></g>
   <rect x="632" y="292" width="246" height="536" fill="none" stroke="#E8E2D6" stroke-width="12"/>`;
  s+=n18_clock(1080,230,70,clock)+n18_boiler(g,{boil,leak,hum})+n18_coAlarm(1380,300,1,alarm,g);
  return s;}
function n18_chair(x,y,s=1,col='#7A4A6A'){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-150" y="-330" width="300" height="250" rx="40" fill="${col}" stroke="${INK}" stroke-width="8"/><rect x="-170" y="-110" width="340" height="80" rx="20" fill="${col}" stroke="${INK}" stroke-width="8"/><path d="M-130 -30 V0 M130 -30 V0" stroke="${INK}" stroke-width="14"/></g>`;}
function n18_chairArms(x,y,s=1,col='#7A4A6A'){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-200" y="-200" width="60" height="170" rx="26" fill="${col}" stroke="${INK}" stroke-width="8"/><rect x="140" y="-200" width="60" height="170" rx="26" fill="${col}" stroke="${INK}" stroke-width="8"/></g>`;}
// Nan in her armchair (floor y=820). state: doze|slump|awake
function n18_nanChair(x,g,o={}){const {state='doze',knit=1,s=.9}=o;const sl=state==='slump';
  return `${n18_chair(x,820,1)}${person({x:x+10,y:580,s,t:sl?0:g,who:'nan',legs:'sit',pose:knit?'hold':'down',blink:state==='awake'?BL(g):1,mouth:sl?'flat':state==='awake'?'frown':'smile',brows:state==='awake'?'raised':'calm',rot:sl?-14:0})}
   ${knit?`<g transform="translate(${x+40},${sl?690:672})"><circle r="26" fill="${P.coral}" stroke="${INK}" stroke-width="5"/><path d="M-50 -30 L30 20 M-30 -44 L50 10" stroke="#C9A46A" stroke-width="6" stroke-linecap="round"/></g>`:''}${n18_chairArms(x,820,1)}`;}
function n18_table(x,y,w=320,col='#8A6A4A',rot=0){return `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="${-w/2}" y="-14" width="${w}" height="28" rx="8" fill="${col}" stroke="${INK}" stroke-width="7"/><path d="M${-w/2+30} 14 V${820-y} M${w/2-30} 14 V${820-y}" stroke="${INK}" stroke-width="20"/><path d="M${-w/2+30} 14 V${820-y-4} M${w/2-30} 14 V${820-y-4}" stroke="${col}" stroke-width="10"/></g>`;}
function n18_museum(g,o={}){const {flare=0,lights=1}=o;let s=`<rect width="1920" height="1080" fill="#120C26"/><rect y="820" width="1920" height="260" fill="#1C1430"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="6"/>`;
  [120,1800].forEach(x=>s+=`<rect x="${x-50}" y="0" width="100" height="820" fill="#1E1840" stroke="${INK}" stroke-width="6"/>`);
  [420,960,1500].forEach((x,i)=>s+=`<path d="M${x-40} 0 L${x-240} 820 H${x+240} L${x+40} 0Z" fill="#FFF6D0" opacity="${(lights*(.05+.03*Math.sin(g*2+i))+flare*.3).toFixed(3)}"/><rect x="${x-40}" y="0" width="80" height="30" fill="#2A2450" stroke="${INK}" stroke-width="5"/>`);
  return s+(flare?`<rect width="1920" height="1080" fill="#FFF6D0" opacity="${(flare*.75).toFixed(3)}"/>`:'');}
function n18_stormWin(x,y,w,h,g,on=1){const fl=on&&((g*1.3)%3.1)<.14;let rain='';const r=rng(33);for(let i=0;i<26;i++){const rx=x+r()*w,ry=y+((r()*h+g*700)%h);rain+=`<path d="M${rx.toFixed(0)} ${ry.toFixed(0)} l-12 34" stroke="#9AB8E8" stroke-width="3" opacity=".6"/>`;}
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w/2}" fill="${fl?'#C8D8FF':'#0A1030'}" stroke="#2A2450" stroke-width="16"/>${on?rain:''}${fl?`<path d="M${x+w*.6} ${y+30} l-60 120 l50 0 l-70 150" stroke="#fff" stroke-width="10" fill="none"/>`:''}<path d="M${x+w/2} ${y} V${y+h} M${x} ${y+h*.55} H${x+w}" stroke="#2A2450" stroke-width="10"/>`;}
function n18_whale(x,y,s,g){const b=Math.sin(g*1.2)*12;return `<g transform="translate(${x},${(y+b).toFixed(1)}) scale(${s})"><circle r="320" fill="url(#gIce)" opacity=".25"/><path d="M-260 0 Q-240 -110 -40 -110 Q180 -110 240 -10 Q260 40 200 60 Q0 120 -200 60 Q-280 40 -260 0Z" fill="#5A7BD8" stroke="${INK}" stroke-width="9"/><path d="M-220 40 Q0 100 200 50" stroke="#C9D8FF" stroke-width="18" fill="none" opacity=".6"/>
   <path d="M230 -10 L330 ${(-80+Math.sin(g*2)*14).toFixed(0)} L310 0 L340 ${(60+Math.sin(g*2)*14).toFixed(0)}Z" fill="#5A7BD8" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-170 -30 q16 12 32 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-60 40 q20 50 60 40" fill="#4A68C0" stroke="${INK}" stroke-width="6"/></g>${n18_zzz(x-210*s,y-110*s,g,s*1.2)}`;}
function n18_machine(x,y,s,g,o={}){const {nd=.6,spin=0,spark=0,glow=0,press=0}=o;
  const dial=(cx,v)=>{const a=spin?g*900+cx:-70+v*140;return `<g transform="translate(${cx},-170)"><circle r="56" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/><path d="M-40 10 A42 42 0 0 1 40 10" stroke="${P.red}" stroke-width="6" fill="none" opacity=".5"/><path d="M0 0 L0 -44" stroke="${INK}" stroke-width="6" stroke-linecap="round" transform="rotate(${a.toFixed(1)})"/><circle r="7" fill="${INK}"/></g>`;};
  let wave='';for(let i=0;i<=40;i++){const xx=-150+i*7.5,yy=-20+Math.sin(i*.6+g*6)*14*(1+Math.sin(i*1.3)*.8);wave+=(i?'L':'M')+xx.toFixed(1)+' '+yy.toFixed(1);}
  return `<g transform="translate(${x},${y}) scale(${s})">${glow?`<circle cy="-100" r="330" fill="url(#gGold)" opacity="${glow.toFixed(2)}"/>`:''}
   <rect x="-200" y="-260" width="400" height="460" rx="20" fill="#5D6A82" stroke="${INK}" stroke-width="9"/><rect x="-200" y="-260" width="400" height="40" rx="14" fill="#7E8AA2" stroke="${INK}" stroke-width="7"/>
   ${dial(-90,nd)}${dial(90,nd*.8)}<rect x="-160" y="-84" width="320" height="128" rx="10" fill="#0A1E1A" stroke="${INK}" stroke-width="6"/><path d="${wave}" stroke="${P.mint}" stroke-width="5" fill="none"/>
   <circle cx="-100" cy="116" r="${press?38:46}" fill="#3DDC6A" stroke="${INK}" stroke-width="8"/>${[0,1,2].map(i=>`<circle cx="${30+i*50}" cy="116" r="14" fill="${[P.red,P.gold,P.mint][i]}" opacity="${(.4+.6*Math.abs(Math.sin(g*3+i))).toFixed(2)}" stroke="${INK}" stroke-width="4"/>`).join('')}
   ${spark?n18_sparks(0,-262,g,spark)+n18_sparks(-150,-60,g+.5,spark):''}</g>`;}
function n18_cabinet(x,y,s,g,o={}){const {label='LONG-TERM',open=0}=o;return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-150" y="-260" width="300" height="520" rx="14" fill="#8E9AB0" stroke="${INK}" stroke-width="9"/>
   ${[0,1,2].map(i=>`<g transform="translate(${i===0?open*60:0},0)"><rect x="-125" y="${-235+i*165}" width="250" height="140" rx="10" fill="#B8C2D4" stroke="${INK}" stroke-width="7"/><rect x="-40" y="${-180+i*165}" width="80" height="20" rx="10" fill="${INK}"/></g>`).join('')}
   ${label?`<rect x="-130" y="-320" width="260" height="56" rx="12" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><text y="-280" text-anchor="middle" font-size="34" font-weight="900" fill="${INK}">${label}</text>`:''}</g>`;}
function n18_card(x,y,s,kind,o={}){const {ink=INK,op=1}=o;const ic={piano:`<rect x="-46" y="-12" width="92" height="40" fill="#fff" stroke="${ink}" stroke-width="5"/><path d="M-23 -12 V28 M0 -12 V28 M23 -12 V28" stroke="${ink}" stroke-width="4"/>`,book:`<rect x="-40" y="-30" width="80" height="56" rx="6" fill="${P.coral}" stroke="${ink}" stroke-width="5"/>`,table:`<path d="M-44 -6 H44 M-30 -6 V30 M30 -6 V30" stroke="${ink}" stroke-width="9" stroke-linecap="round"/>`,song:`<ellipse cx="-10" cy="16" rx="14" ry="10" fill="${ink}"/><path d="M2 14 V-30 L30 -20" stroke="${ink}" stroke-width="6" fill="none"/>`}[kind]||'';
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s})" opacity="${op}"><rect x="-70" y="-56" width="140" height="112" rx="10" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/>${ic}</g>`;}
function n18_piano(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-230" y="-380" width="460" height="380" rx="14" fill="#3A2418" stroke="${INK}" stroke-width="9"/><rect x="-250" y="-214" width="500" height="54" rx="8" fill="#4A2E20" stroke="${INK}" stroke-width="7"/>
   <rect x="-232" y="-204" width="464" height="36" fill="#fff" stroke="${INK}" stroke-width="5"/>${[...Array(15)].map((_,i)=>`<path d="M${(-232+i*30.9).toFixed(1)} -204 V-168" stroke="${INK}" stroke-width="3"/>`).join('')}${[...Array(15)].map((_,i)=>[0,1,3,4,5].includes(i%7)?`<rect x="${(-232+(i+1)*30.9-8).toFixed(1)}" y="-204" width="16" height="22" fill="${INK}"/>`:'').join('')}
   <rect x="-120" y="-350" width="240" height="120" rx="6" fill="#FFF6EA" stroke="${INK}" stroke-width="5"/></g>`;}
function n18_bellClock(x,y,s,g,ring=0){const j=ring?Math.sin(g*40)*6:0;return `<g transform="translate(${x},${y}) rotate(${j.toFixed(1)}) scale(${s})"><circle cx="-90" cy="-130" r="50" fill="${P.gold}" stroke="${INK}" stroke-width="8"/><circle cx="90" cy="-130" r="50" fill="${P.gold}" stroke="${INK}" stroke-width="8"/>
   <path d="M-110 150 L-140 200 M110 150 L140 200" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>${n18_clock(0,0,170,7.0)}${ring?`<path d="M-200 -160 l-50 -30 M200 -160 l50 -30 M-220 -60 l-60 0 M220 -60 l60 0" stroke="${P.gold}" stroke-width="10" stroke-linecap="round"/>`:''}</g>`;}
function n18_switch(x,y,s,on,label){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-150" y="-210" width="300" height="420" rx="30" fill="#FFF6EA" stroke="${INK}" stroke-width="10"/><rect x="-60" y="-120" width="120" height="240" rx="24" fill="#C9C2B8" stroke="${INK}" stroke-width="8"/>
   <rect x="-48" y="${on?-110:10}" width="96" height="100" rx="18" fill="${on?P.mint:P.red}" stroke="${INK}" stroke-width="8"/><text y="${on?-150:190}" text-anchor="middle" font-size="44" font-weight="900" fill="${on?P.mintDark:P.red}">${on?'ON':'OFF'}</text>
   ${label?`<g transform="translate(0,280)">${labelPill(0,0,label,P.gold,40)}</g>`:''}</g>`;}
function n18_meter(x,y,v,label,col=P.violet){const h=440,f=h*clamp(v);return `<g transform="translate(${x},${y})"><rect x="-70" y="${-h}" width="140" height="${h}" rx="22" fill="#0B1026" stroke="${INK}" stroke-width="8"/><rect x="-54" y="${(-f-8+(f>0?0:8)).toFixed(1)}" width="108" height="${Math.max(0,f-8).toFixed(1)}" rx="14" fill="${col}"/>${T(0,64,label,{size:40,fill:P.white,stroke:8})}</g>`;}
function n18_garden(g,o={}){const {house=1,doorLit=1}=o;const r=rng(61);let st='',fr='';for(let i=0;i<70;i++)st+=`<circle cx="${(r()*1920).toFixed(0)}" cy="${(r()*560).toFixed(0)}" r="${(1+r()*2).toFixed(1)}" fill="#fff" opacity="${(.3+.6*Math.abs(Math.sin(g+i))).toFixed(2)}"/>`;
  for(let i=0;i<60;i++){const x=r()*1920,y=790+r()*200;fr+=`<path d="M${x.toFixed(0)} ${y.toFixed(0)} l6 -18 l6 18" stroke="#E6F4FF" stroke-width="3" fill="none" opacity="${(.4+.5*Math.abs(Math.sin(g*2+i))).toFixed(2)}"/>`;}
  return `<rect width="1920" height="1080" fill="url(#sky)"/>${st}<circle cx="1500" cy="180" r="56" fill="#fff4dc"/><circle cx="1500" cy="180" r="180" fill="url(#moon)" opacity=".5"/>
   <path d="M0 720 Q500 690 1000 720 T1920 710 V1080 H0Z" fill="#2E4A5C"/><path d="M0 780 H1920 V1080 H0Z" fill="#3E6074"/><path d="M0 780 H1920" stroke="#C9DDF2" stroke-width="6" opacity=".7"/>${fr}
   ${house?`<rect x="-20" y="220" width="420" height="560" fill="#2A2246" stroke="${INK}" stroke-width="8"/><path d="M-40 230 L190 90 L420 230Z" fill="#3A2E5A" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   <rect x="200" y="460" width="150" height="320" fill="${doorLit?'#FFD98E':'#0A1430'}" stroke="${INK}" stroke-width="8"/>${doorLit?`<path d="M350 780 L560 900 H200 Z" fill="#FFD98E" opacity=".18"/>`:''}<rect x="40" y="300" width="120" height="110" fill="#FFD98E" opacity=".8" stroke="${INK}" stroke-width="6"/>`:''}`;}
function n18_steps(t,cur,done){const L=['WINDOW','BACK DOOR','NAN','PICKLES','PHONE'],X=[220,480,710,900,1110];
  return L.map((s,i)=>{const d=i<done,c=i===cur&&!d;const w=s.length*21+(d?96:60);const k=c?1+.06*Math.sin(t*8):1;
    return `<g transform="translate(${X[i]},110) scale(${k.toFixed(3)})"><rect x="${-w/2}" y="-30" width="${w}" height="60" rx="30" fill="${d?P.mint:c?P.gold:'#2A3248'}" stroke="${INK}" stroke-width="6"/>${d?`<path d="M${-w/2+18} 0 l12 12 l20 -22" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`:''}<text x="${d?18:0}" y="12" text-anchor="middle" font-size="34" font-weight="900" fill="${d||c?INK:'#9AA7BD'}">${s}</text></g>`;}).join('');}
function n18_rbc(x,y,s,nCO,g){const seats=[[-130,-60],[130,-60],[-130,75],[130,75]];
  let o=`<g transform="translate(${x},${y}) scale(${s})"><ellipse rx="320" ry="220" fill="#D93A4A" stroke="${INK}" stroke-width="10"/><ellipse rx="200" ry="120" fill="#B82838" opacity=".7"/>`;
  seats.forEach(([sx,sy],i)=>{const co=i<nCO;o+=`<circle cx="${sx}" cy="${sy}" r="58" fill="#7A1420" stroke="${INK}" stroke-width="6"/>`+(co?n18_coMol(sx,sy,.5)+`<circle cx="${sx}" cy="${sy}" r="70" fill="none" stroke="${n18_HZ}" stroke-width="6" stroke-dasharray="10 10"/>`:n18_o2(sx,sy+Math.sin(g*3+i)*6,.5));});
  return o+'</g>';}
function n18_coMol(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><circle cx="-42" r="58" fill="${n18_CO1}" stroke="${INK}" stroke-width="8"/><circle cx="46" r="52" fill="${P.red}" stroke="${INK}" stroke-width="8"/><text x="-42" y="18" text-anchor="middle" font-size="54" font-weight="900" fill="#fff">C</text><text x="46" y="18" text-anchor="middle" font-size="54" font-weight="900" fill="#fff">O</text></g>`;}
function n18_o2(x,y,s){return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s})"><circle cx="-44" r="52" fill="#6FD3F7" stroke="${INK}" stroke-width="8"/><circle cx="44" r="52" fill="#6FD3F7" stroke="${INK}" stroke-width="8"/><text x="-44" y="18" text-anchor="middle" font-size="54" font-weight="900" fill="${INK}">O</text><text x="44" y="18" text-anchor="middle" font-size="54" font-weight="900" fill="${INK}">O</text></g>`;}
function n18_mask(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-40 -30 Q0 -44 40 -30 L34 26 Q0 40 -34 26Z" fill="#DFF6EE" fill-opacity=".85" stroke="${INK}" stroke-width="6"/><path d="M0 34 Q10 100 70 120" stroke="#9FE3C8" stroke-width="10" fill="none"/></g>`;}
function n18_phone(x,y,s,g,o={}){const {screen='CALLING...',ring=1}=o;return `<g transform="translate(${x},${y}) scale(${s})">${ring?[0,1,2].map(i=>{const k=((g*.9+i/3)%1);return `<circle r="${(200+k*160).toFixed(0)}" fill="none" stroke="${P.mint}" stroke-width="8" opacity="${(1-k)*.6}"/>`;}).join(''):''}
   <rect x="-110" y="-200" width="220" height="400" rx="34" fill="${INK}"/><rect x="-94" y="-170" width="188" height="320" rx="16" fill="#123A34"/><circle cy="0" r="46" fill="${P.mint}" stroke="${INK}" stroke-width="6"/><path d="M-20 -14 q0 34 34 34 l8 -14 l-16 -10 l-8 8 q-12 -6 -18 -18 l8 -8 l-10 -16Z" fill="${INK}"/>
   <text y="-110" text-anchor="middle" font-size="30" font-weight="900" fill="#fff">${screen}</text></g>`;}
function n18_gGlint(o){return glint(Object.assign({blink:BL(o.t||0)},o));}
function n18_dark(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-56 -36 q26 14 52 0 M4 -36 q26 14 52 0" stroke="#6A4A8A" stroke-width="8" fill="none" opacity=".75" stroke-linecap="round"/></g>`;}

Object.assign(SHOTS,{
nsHook(t,d,p,g){
  const win=1-prog(t,.3,3.6), ten=AT(t,p.ten??6.7);
  return `${n18_city(g,{win:Math.max(.12,win)})}
   <rect x="720" y="380" width="480" height="560" fill="#151030" stroke="${INK}" stroke-width="8"/><path d="M700 392 L960 250 L1220 392Z" fill="#221A44" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   <circle cx="960" cy="585" r="${(280+Math.sin(g*2)*10).toFixed(0)}" fill="url(#gGold)" opacity=".55"/><rect x="800" y="470" width="320" height="240" fill="#FFD98E"/>
   <clipPath id="n18w1"><rect x="800" y="470" width="320" height="240"/></clipPath><g clip-path="url(#n18w1)">${glint({x:960,y:640,s:.75,t:g,mouth:'flat',lid:.05,look:Math.sin(g*.8)*.6})}${n18_dark(960,640-45,.75)}</g>
   <rect x="800" y="470" width="320" height="240" fill="none" stroke="${INK}" stroke-width="10"/>
   ${n18_clock(380,540,150,3+t/3600)}${T(380,780,'3:00 AM',{size:80,fill:P.gold,sc:IN(t,.3)})}
   ${T(960,160,'THE ONLY ONE AWAKE',{size:96,fill:P.white,sc:IN(t,p.only??.4)})}
   ${ten?n18_days(1560,520,10,1.05):''}${AT(t,p.need??9.1)?`<g transform="translate(1560,700) scale(${pop(t,p.need??9.1)})">${labelPill(0,0,"DOESN'T NEED SLEEP",P.mint,40)}</g>`:''}`;
},
nsColdOpen(t,d,p,g){
  const nan=AT(t,p.nan??5.05), few=AT(t,p.few??12.4), head=AT(t,p.head??2.95);
  if(!nan) return `${card('cardDark',g)}${n18_throb(960,470,g,1.4,head?1:0)}${glint({x:960,y:600,s:1.4,t:g,lid:.55+.12*Math.sin(g*2),mouth:'flat',brows:'sad'})}${n18_dark(960,600-84,1.4)}
    ${T(960,170,head?'HEAD: POUNDING':'EYELIDS: HEAVY',{size:100,fill:head?P.red:P.ice,sc:pop(t,head?p.head??2.95:.1)})}`;
  return `${n18_kitchen(g,{alarm:'off',leak:1})}${n18_nanChair(1250,g,{state:'slump'})}${pickles(930,860,.62,0,{blink:1})}${n18_haze(g,.55)}
   ${T(960,150,"NAN WON'T WAKE UP",{size:84,fill:P.red,sc:pop(t,p.nan??5.05)})}
   ${few?`<g transform="translate(470,690) scale(${pop(t,p.few??12.4)})">${n18_timer(180-(t-(p.few??12.4)),g,{x:0,y:0,s:1.1,label:'A FEW MINUTES'})}</g>`:''}`;
},
nsBack(t,d,p,g){
  const ex=p.ex??2.93;
  if(t<ex){const k=ease(prog(t,.15,ex-.25));const days=Math.round(10-10*k);
    return `${card('cardDark',g)}${[0,1,2].map(i=>`<circle cx="640" cy="540" r="${260+i*40}" fill="none" stroke="${P.ice}" stroke-width="5" stroke-dasharray="30 30" opacity=".35" transform="rotate(${(-g*200*(i+1)).toFixed(0)} 640 540)"/>`).join('')}
     ${n18_clock(640,540,220,3-k*240)}${n18_days(1360,470,days,1.25)}${T(1360,720,'10 DAYS EARLIER',{size:70,fill:P.gold,sc:IN(t,.8)})}${T(960,150,"LET'S GO BACK",{size:100,fill:P.white,sc:IN(t,.1)})}`;}
  const tb=t; const br=AT(tb,p.brain??5.9), wh=AT(tb,p.whale??7.8), mc=AT(tb,p.mach??10.15);
  return `${n18_museum(g)}${wh?`<g transform="translate(0,0)">${n18_whale(1000,330,.95*pop(tb,p.whale??7.8),g)}</g>`:''}
   ${br?[300,620].map((x,i)=>`<rect x="${x-90}" y="660" width="180" height="160" fill="#2A2450" stroke="${INK}" stroke-width="7"/><circle cx="${x}" cy="560" r="170" fill="url(#gMint)" opacity="${(.4+.2*Math.sin(g*3+i)).toFixed(2)}"/>${brain(x,560,.5*pop(tb,(p.brain??5.9)+i*.3),1,g+i)}`).join(''):''}
   ${mc?`<g transform="translate(1500,620) scale(${pop(tb,p.mach??10.15)})">${n18_machine(0,0,.8,g)}</g>${T(1500,860,'OLD SLEEP-LAB MACHINE',{size:40,fill:P.gold,stroke:8})}`:''}
   ${glint({x:mc?1000:960,y:560,s:.75,t:g,mouth:'o',brows:'raised',look:mc?1:-.5,blink:BL(g)})}
   ${T(960,150,'NEW: THE SLEEP EXHIBIT',{size:84,fill:P.mint,sc:IN(tb,ex+.1)})}`;
},
nsMachine(t,d,p,g){
  const feel=p.feel??17.88;
  if(t<feel){
    const storm=AT(t,p.storm??4.6), press=AT(t,p.press??6.6), sg=AT(t,p.surge??9)?prog(t,p.surge??9,(p.surge??9)+2.5):0,
      fl=AT(t,p.flare??11.86)?Math.max(0,1-(t-(p.flare??11.86))/1.4):0, zero=AT(t,p.zero??14.15), sp=AT(t,p.spark??16.18);
    const nd=zero?0:.6, spin=sg>0&&!zero?1:0;
    let wires='';[0,1,2].forEach(i=>{const hx=730+i*30,hy=455-Math.abs(i-1)*8;const dd=`M${hx} ${hy} Q${900+i*20} ${250-i*30} 1090 ${370+i*24}`;
      wires+=`<path d="${dd}" stroke="${INK}" stroke-width="12" fill="none"/><path d="${dd}" stroke="${['#FF8FA3',P.mint,'#9AD1FF'][i]}" stroke-width="6" fill="none"/>`+(sg>0?`<path d="${dd}" stroke="${P.gold}" stroke-width="10" fill="none" stroke-dasharray="40 60" stroke-dashoffset="${(-g*600).toFixed(0)}" opacity="${(sg*(zero?.3:1)).toFixed(2)}"/>`:'')+`<circle cx="${hx}" cy="${hy}" r="10" fill="#C9C2B8" stroke="${INK}" stroke-width="4"/>`;});
    const title=sp?'SPARKS!':zero?'DIALS: ZERO':fl>0?'FLARE!':sg>0?'POWER SURGE':press?'CLICK.':storm?'A STORM OUTSIDE':'THE NIGHT SHIFT';
    const ta=sp?p.spark??16.18:zero?p.zero??14.15:fl>0?p.flare??11.86:sg>0?p.surge??9:press?p.press??6.6:storm?p.storm??4.6:.2;
    return `${n18_museum(g,{flare:fl})}${n18_stormWin(160,170,360,520,g,storm?1:0)}
     <rect x="560" y="640" width="360" height="40" rx="10" fill="#4A3A5A" stroke="${INK}" stroke-width="6"/>
     ${glint({x:760,y:573,s:.85,t:g,legs:'sit',pose:press&&!sg?'point':'down',mouth:fl>0||sp?'o':'smile',brows:fl>0||sp?'raised':'calm',blink:BL(g)})}${wires}
     ${n18_machine(1250,600,1,g,{nd,spin,spark:sp?1:0,glow:sg*.8+fl,press})}
     ${press&&!sg?T(1150,770,'CLICK',{size:56,fill:'#3DDC6A',sc:pop(t,p.press??6.6)}):''}
     <rect width="1920" height="1080" fill="#FFF6D0" opacity="${(fl*.5).toFixed(3)}"/>
     ${T(960,150,title,{size:96,fill:sp||fl>0?P.gold:P.white,sc:pop(t,ta)})}`;}
  const wt=AT(t,p.wait??25.48), nev=AT(t,p.never??28.2), op=eout(prog(t,feel+.3,feel+1.8));
  const words=[['FRESH',p.fresh??21.96,420,430],['BRIGHT',p.bright??22.96,1500,430],['WIDE AWAKE',p.wide??23.8,960,880]];
  return `${card('cardMint',g)}${n18_rays(960,250,g,op)}
   <g transform="translate(960,250)"><rect x="-130" y="-100" width="260" height="200" fill="#FFF6D0" opacity="${op.toFixed(2)}"/><rect x="-130" y="-100" width="260" height="200" fill="none" stroke="${INK}" stroke-width="10"/>
    <g transform="translate(-130,-100) scale(${(1-op*.85).toFixed(3)},1)"><rect width="130" height="200" fill="#2A3A6A" stroke="${INK}" stroke-width="8"/></g><g transform="translate(130,-100) scale(${(-(1-op*.85)).toFixed(3)},1)"><rect width="130" height="200" fill="#2A3A6A" stroke="${INK}" stroke-width="8"/></g></g>
   ${glint({x:wt?760:960,y:680,s:1.25,t:g,mouth:nev?'flat':'o',brows:'raised',glint:op,look:wt?1:0,blink:0})}
   ${wt?'':words.map(([w,a,x,y])=>AT(t,a)?T(x,y,w,{size:w.length>6?96:110,fill:P.gold,sc:pop(t,a)}):'').join('')}
   ${wt?`${n18_clock(1400,560,170,3+(t-(p.wait??25.48))*.9)}${T(1400,840,nev?'IT NEVER COMES':'WAITING FOR TIRED...',{size:60,fill:nev?P.red:P.white,sc:pop(t,nev?p.never??28.2:p.wait??25.48)})}`:''}`;
},
nsRules(t,d,p,g){
  const sig=p.sig??5.63;
  if(t<sig) return `${bgLab(g)}${T(900,500,'THE RULES',{size:200,fill:P.gold,sc:pop(t,.1)})}${AT(t,p.real??1.94)?T(900,680,'(THE REAL SCIENCE)',{size:76,fill:P.mint,sc:pop(t,p.real??1.94)}):''}
    ${glint({x:1660,y:560,s:.7,t:g,pose:'point',dir:-1,mouth:'o',brows:'raised',blink:BL(g)})}`;
  const ad=prog(t,p.aden??8.58,(p.feel??13.23)+3), cof=AT(t,p.coffee??16.36);
  const r=rng(19);let dots='';const n=Math.floor(ad*34);
  for(let i=0;i<34;i++){const a=r()*6.28,dd=r()*150,x=560+Math.cos(a)*dd*1.15,y=500+Math.sin(a)*dd*.8;if(i<n)dots+=`<circle cx="${x.toFixed(0)}" cy="${(y+Math.sin(g*2+i)*4).toFixed(0)}" r="16" fill="${cof?'#6A6680':P.violet}" stroke="${INK}" stroke-width="4"/>`+(cof?`<path d="M${(x-10).toFixed(0)} ${(y-10).toFixed(0)} l20 20" stroke="${P.gold}" stroke-width="5"/>`:'');}
  const lvl=cof?ad*.35:ad;
  return `${card('cardDark',g)}${brain(560,500,1.25,.6,g)}${dots}
   ${AT(t,p.aden??8.58)?`<g transform="translate(560,800) scale(${pop(t,p.aden??8.58)})">${labelPill(0,0,'ADENOSINE BUILDS UP',P.violet,44)}</g>`:''}
   ${n18_meter(1080,740,lvl,'SLEEPY',cof?'#8A86A0':P.violet)}
   ${cof?`<g transform="translate(1500,560) scale(${pop(t,p.coffee??16.36)})"><path d="M-110 -80 H110 L90 120 Q0 150 -90 120Z" fill="#FFF6EA" stroke="${INK}" stroke-width="9"/><ellipse cy="-80" rx="110" ry="24" fill="#6B3A1E" stroke="${INK}" stroke-width="8"/><path d="M110 -40 q70 0 60 60 q-8 40 -70 40" stroke="${INK}" stroke-width="14" fill="none"/>
     ${[0,1,2].map(i=>`<path d="M${-40+i*40} -120 q-16 -30 0 -60 q16 -30 0 -60" stroke="#fff" stroke-width="7" fill="none" opacity="${(.3+.3*Math.sin(g*3+i)).toFixed(2)}"/>`).join('')}</g>${T(1500,800,'BLOCKS IT (FOR A WHILE)',{size:44,fill:P.gold,stroke:8})}`:''}
   ${T(960,150,'SLEEPY = A SIGNAL',{size:96,fill:P.white,sc:IN(t,sig+.1)})}`;
},
nsSwitch(t,d,p,g){
  const off=AT(t,p.off??2.4), nev=AT(t,p.never??4.49), rea=AT(t,p.reason??6.62), al=AT(t,p.alarm??9.78);
  return `${card('cardWarm',g)}${glint({x:520,y:560,s:1.05,t:g,mouth:rea?'flat':nev?'grin':'smile',brows:rea?'raised':'calm',pose:rea?'shrug':'point',blink:BL(g),glint:nev&&!rea?1:0})}
   ${rea?`<g transform="translate(1340,520) scale(${pop(t,p.reason??6.62)})">${n18_bellClock(0,0,1,g,al?1:0)}</g>${T(1340,850,al?"IT'S JUST THE ALARM":'NOT WHY WE SLEEP',{size:64,fill:al?P.gold:P.white,sc:pop(t,al?p.alarm??9.78:p.reason??6.62)})}`
     :`${n18_switch(1340,470,1,!off,'SLEEPY SIGNAL')}${nev?T(1340,880,'NEVER SLEEPY',{size:70,fill:P.mint,sc:pop(t,p.never??4.49)}):''}`}
   <g transform="translate(960,150) scale(${IN(t,.2)})">${labelPill(0,0,'IN THIS WORLD (FICTION)',P.coral,46)}</g>`;
},
nsJobs(t,d,p,g){
  const cl=p.clean??7.98;
  if(t<cl){let cards='';['piano','book','table','song'].forEach((k,i)=>{const q=((t*.45+i/4)%1);const x=lerp(640,1300,q),y=520-Math.sin(q*Math.PI)*220;cards+=n18_card(x,y,.8,k,{op:Math.sin(q*Math.PI).toFixed(2)});});
    return `${card('cardDark',g)}${brain(480,560,1,1,g)}${n18_cabinet(1420,600,1,g,{open:.4+.4*Math.sin(g*2)})}${AT(t,p.file??2.4)?cards:''}
     <circle cx="960" cy="760" r="54" fill="#fff4dc"/><circle cx="984" cy="742" r="50" fill="#1A2142"/>${T(960,880,'WHILE YOU SLEEP',{size:50,fill:P.ice,stroke:8})}
     ${T(960,150,AT(t,p.file??2.4)?'JOB 1: FILE THE DAY':'SLEEP HAS REAL JOBS',{size:96,fill:AT(t,p.file??2.4)?P.gold:P.white,sc:pop(t,AT(t,p.file??2.4)?p.file??2.4:.1)})}`;}
  const k=ease(prog(t,cl+1.5,cl+5)), gl=AT(t,p.gly??18.74), crew=AT(t,p.crew??21.23), nd=AT(t,p.need??24.09);
  let cells='',streams='',waste='';const R=86*(1-.24*k);
  for(let i=0;i<5;i++)for(let j=0;j<3;j++){const x=300+i*330,y=380+j*200;cells+=`<ellipse cx="${x}" cy="${y}" rx="${(R*1.6).toFixed(1)}" ry="${R.toFixed(1)}" fill="#FF9EC0" stroke="${INK}" stroke-width="7"/><circle cx="${x}" cy="${y}" r="${(R*.3).toFixed(1)}" fill="#C2457A"/>`;}
  [480,680].forEach((y,i)=>{const dd=`M-40 ${y} Q480 ${y+30*Math.sin(g+i)} 960 ${y} T1960 ${y}`;streams+=`<path d="${dd}" stroke="${P.mint}" stroke-width="${(14+40*k).toFixed(1)}" fill="none" opacity="${(.25+.4*k).toFixed(2)}"/><path d="${dd}" stroke="#E6FFF7" stroke-width="6" fill="none" stroke-dasharray="20 50" stroke-dashoffset="${(-g*300).toFixed(0)}" opacity="${(.3+.6*k).toFixed(2)}"/>`;});
  [465,795,1125,1455].forEach((x,i)=>{const dd=`M${x} 240 Q${x+20*Math.sin(g+i)} 560 ${x} 860`;streams+=`<path d="${dd}" stroke="${P.mint}" stroke-width="${(10+30*k).toFixed(1)}" fill="none" opacity="${(.2+.35*k).toFixed(2)}"/>`;});
  for(let i=0;i<22;i++){const q=((g*.12+i/22)%1),y=[480,680][i%2]+Math.sin(i)*10;waste+=`<circle cx="${(q*2000-40).toFixed(0)}" cy="${y.toFixed(0)}" r="${(9+(i%3)*3)}" fill="#7A6A50" stroke="${INK}" stroke-width="3" opacity="${(k*(1-q*.8)).toFixed(2)}"/>`;}
  const title=nd?'GLINT SWITCHED OFF...':crew?'NIGHT-TIME CLEANING CREW':gl?'THE GLYMPHATIC SYSTEM':'JOB 2: WASH OUT WASTE';
  return `${bgMicro(g)}${streams}${cells}${waste}
   ${AT(t,cl+2)&&!nd?`<g transform="translate(960,235) scale(${pop(t,cl+2)})">${labelPill(0,0,'IN MICE: ~60% MORE SPACE',P.mint,42)}</g>`:''}
   ${nd?`<rect width="1920" height="1080" fill="#05030C" opacity=".55"/><g transform="translate(620,520) scale(${pop(t,p.need??24.09)})">${n18_switch(0,0,.8,false,'')}</g>${T(620,800,'THE ALARM',{size:60,fill:P.red})}
     ${AT(t,p.not??26.14)?`<g transform="translate(1300,520) scale(${pop(t,p.not??26.14)})">${brain(0,0,.9,.4,g,.7)}</g>${T(1300,800,'NOT THE NEED',{size:60,fill:P.gold})}`:''}`:''}
   ${T(960,150,title,{size:88,fill:nd?P.white:P.mint,sc:pop(t,nd?p.need??24.09:crew?p.crew??21.23:gl?p.gly??18.74:cl)})}`;
},
nsPlusTime(t,d,p,g){
  const mo=p.mont??10.8;
  if(t<mo){const hr=AT(t,p.hours??2.16), th=AT(t,p.third??5.75), bk=AT(t,p.back??7.94);
    const fly=bk?eout(prog(t,p.back??7.94,(p.back??7.94)+1.2)):0;const a0=-90,a1=-90+120;const cx=lerp(640,1250,fly),cy=lerp(540,420,fly);
    const arc=(c,r,f,col)=>{const x0=c[0]+Math.cos(a0*Math.PI/180)*r,y0=c[1]+Math.sin(a0*Math.PI/180)*r,x1=c[0]+Math.cos(a1*Math.PI/180)*r,y1=c[1]+Math.sin(a1*Math.PI/180)*r;return `<path d="M${c[0]} ${c[1]} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z" fill="${col}" stroke="${INK}" stroke-width="8"/>`;};
    return `${card('cardMint',g)}<circle cx="640" cy="540" r="250" fill="#1A2142" stroke="${INK}" stroke-width="10"/>${[...Array(24)].map((_,i)=>`<path d="M640 ${540-238} V${540-218}" stroke="#fff" stroke-width="5" opacity=".5" transform="rotate(${i*15} 640 540)"/>`).join('')}
     ${hr?arc([cx,cy],250,1,P.gold):''}${T(640,880,th?'ABOUT 1/3 OF YOUR LIFE':hr?'7 TO 9 HOURS A NIGHT':'',{size:56,fill:th?P.gold:P.white,sc:pop(t,th?p.third??5.75:p.hours??2.16)})}
     ${glint({x:1500,y:560,s:.95,t:g,pose:bk?'up':'down',mouth:bk?'grin':'smile',brows:bk?'raised':'calm',blink:BL(g),glint:bk?1:0})}
     ${bk?T(1500,180,'ALL OF IT BACK',{size:80,fill:P.mint,sc:pop(t,(p.back??7.94)+.6)}):''}${n18_pm(t,'plus','TIME')}`;}
  const tm=t-mo, night=Math.min(4,1+Math.floor((t-mo)/2.6)), bk=AT(t,p.books??13.2), pi=AT(t,p.piano??16.12), song=AT(t,p.song??17.85), cry=AT(t,p.cry??21.47), lau=AT(t,p.laugh??24.64);
  let act='';
  if(!bk){const fix=prog(t,mo+.8,mo+2.2);act=`${n18_table(1080,700,340,'#8A6A4A',Math.sin(g*9)*4*(1-fix))}<rect x="${1040}" y="640" width="70" height="30" rx="6" fill="#9AA7BD" stroke="${INK}" stroke-width="5" transform="rotate(${(Math.sin(g*8)*25).toFixed(0)} 1075 655)"/>${glint({x:780,y:545,s:.9,t:g,pose:'point',mouth:'grin',blink:BL(g)})}${T(1080,560,'FIXED',{size:60,fill:P.mint,op:fix})}`;}
  else if(!pi){const nb=Math.min(9,1+Math.floor((t-(p.books??13.2))*3.2));act=`${[...Array(nb)].map((_,i)=>`<rect x="${1020+(i%2)*10}" y="${790-i*38}" width="180" height="34" rx="5" fill="${[P.coral,P.mint,P.gold,'#9AD1FF',P.violet][i%5]}" stroke="${INK}" stroke-width="5"/>`).join('')}${glint({x:780,y:545,s:.9,t:g,pose:'reach',mouth:'o',blink:BL(g)})}<rect x="860" y="520" width="90" height="70" rx="6" fill="${P.coral}" stroke="${INK}" stroke-width="6"/>${T(1110,380,'EVERY BOOK',{size:56,fill:P.gold})}`;}
  else act=`${n18_piano(1000,820,.95)}${glint({x:700,y:572,s:.85,t:g,legs:'sit',pose:'reach',mouth:song?'grin':'o',blink:BL(g)})}${song?n18_notes(1000,380,g,1,6):''}
    ${song?`${person({x:1500,y:540,s:.9,t:g,who:'nan',mouth:cry?'smile':'laugh',brows:cry?'sad':'raised',blink:BL(g+1)})}${cry?`<path d="M${1500-28} ${540-30} q-6 20 0 30 q6 -10 0 -30Z" fill="#9AD1FF" stroke="${INK}" stroke-width="3"/>${n18_bubble2(1490,200,520,'GO TO BED,','LOVE!',{tail:'right'})}`:''}`:''}
    ${lau?n18_bubble2(560,250,440,"DON'T HAVE TO!",'',{size:42}):''}`;
  return `${bgRoom(g)}${n18_clock(330,250,100,22+tm*6)}${n18_days(330,460,night,.7,{label:'NIGHT'})}${act}
   ${!song?T(960,150,pi?'LEARNS THE PIANO':'ALL NIGHT, EVERY NIGHT',{size:84,fill:P.white,sc:pop(t,pi?p.piano??16.12:mo)}):!cry?T(960,150,"NAN'S FAVOURITE SONG",{size:84,fill:P.gold,sc:pop(t,p.song??17.85)}):''}`;
},
nsMinusPiano(t,d,p,g){
  const n5=AT(t,p.n5??2.56), cant=AT(t,p.cant??5.77), gone=AT(t,p.gone??6.97);
  const fall=gone?prog(t,p.gone??6.97,(p.gone??6.97)+2):0;
  let crumbs='';if(gone){const r=rng(7);for(let i=0;i<14;i++){const x=900+r()*260,y=300+r()*120+fall*400*r();crumbs+=`<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="10" height="10" fill="${P.gold}" opacity="${(1-fall).toFixed(2)}" transform="rotate(${(fall*300*r()).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`;}}
  return `${bgRoom(g)}${n18_piano(1000,820,.95)}${glint({x:700,y:572,s:.85,t:g,legs:'sit',pose:'reach',mouth:cant?'frown':'smile',brows:cant?'sad':'calm',blink:BL(g)})}
   ${!cant?n18_notes(1000,380,g,1,5):''}${crumbs}${cant?`<g transform="translate(1000,330)">${T(0,0,'?',{size:160,fill:P.white,sc:pop(t,p.cant??5.77)})}</g>`:''}
   ${n5?n18_days(330,300,5,.7,{label:'NIGHT'}):''}${gone?T(960,890,'THE NOTES ARE GONE',{size:70,fill:P.red,sc:pop(t,p.gone??6.97)}):''}${n18_pm(t,'minus','THE PIANO')}`;
},
nsFiling(t,d,p,g){
  const rat=p.rat??7.34;
  if(t<rat){let cards='';['piano','song','book'].forEach((k,i)=>{const q=((t*.4+i/3)%1);cards+=n18_card(lerp(560,1360,q),560-Math.sin(q*Math.PI)*240,.8,k,{op:Math.sin(q*Math.PI).toFixed(2)});});
    return `${card('cardDark',g)}<rect x="300" y="600" width="420" height="40" rx="10" fill="#8A6A4A" stroke="${INK}" stroke-width="7"/>${T(510,700,'TODAY',{size:56,fill:P.white})}
     ${[0,1,2].map(i=>`<rect x="${360+i*110}" y="${540-i*6}" width="90" height="60" rx="6" fill="#FFF6EA" stroke="${INK}" stroke-width="5" transform="rotate(${-8+i*8} ${405+i*110} 570)"/>`).join('')}${cards}
     ${n18_cabinet(1420,600,1,g,{label:'LONG-TERM'})}<circle cx="960" cy="300" r="50" fill="#fff4dc"/><circle cx="982" cy="284" r="46" fill="#26204A"/>${n18_zzz(1010,280,g)}
     ${T(960,150,'THE FILING JOB',{size:100,fill:P.gold,sc:IN(t,.1)})}`;}
  const tr=t-rat, sl=AT(t,p.sleep??10.41), rep=AT(t,p.replay??16.69), no=AT(t,p.norep??18.28), pen=AT(t,p.pencil??20.05);
  if(pen){const er=prog(t,(p.pencil??20.05)+1,(p.pencil??20.05)+4);
    return `${card('cardWarm',g)}<g transform="translate(900,520) rotate(-3)"><rect x="-420" y="-260" width="840" height="520" rx="16" fill="#FFF6EA" stroke="${INK}" stroke-width="9"/>${[...Array(5)].map((_,i)=>`<path d="M-380 ${-140+i*60} H380" stroke="#C9C2B8" stroke-width="4"/>`).join('')}
      ${[...Array(9)].map((_,i)=>n18_note(-330+i*80,-110+((i*37)%120),.9,'#6A6A72',(i/9<er?.08:.9))).join('')}</g>
     <g transform="translate(${lerp(560,1320,er)},${430+Math.sin(g*14)*20}) rotate(-35)"><rect x="-30" y="-160" width="60" height="260" rx="10" fill="${P.gold}" stroke="${INK}" stroke-width="7"/><rect x="-30" y="-200" width="60" height="50" rx="10" fill="#FF8FA3" stroke="${INK}" stroke-width="7"/></g>
     ${T(960,150,'WRITTEN IN PENCIL',{size:96,fill:P.white,sc:pop(t,p.pencil??20.05)})}${er>.3?T(960,880,'RUBBED OUT BY MORNING',{size:64,fill:P.red}):''}`;}
  const cells=[[0,0],[1,0],[2,0],[2,1],[3,1],[3,2]];const C=150,ox=960-2*C,oy=330;
  const ph=sl?(t-(p.sleep??10.41))*1.6:tr*1.2;const idx=Math.floor(ph)%cells.length;
  let maze='';for(let i=0;i<4;i++)for(let j=0;j<3;j++){const ci=cells.findIndex(c=>c[0]===i&&c[1]===j);const lit=ci>=0&&ci<=idx;maze+=`<rect x="${ox+i*C}" y="${oy+j*C}" width="${C}" height="${C}" fill="${lit?(sl?P.mint:P.gold):'#1A2142'}" opacity="${lit?.85:1}" stroke="#3B4A78" stroke-width="6"/>`+(ci>=0?`<text x="${ox+i*C+C/2}" y="${oy+j*C+C/2+22}" text-anchor="middle" font-size="60" font-weight="900" fill="${lit?INK:'#3B4A78'}">${ci+1}</text>`:'');}
  const cc=cells[idx];
  return `${card('cardDark',g)}${maze}<rect x="${ox}" y="${oy}" width="${4*C}" height="${3*C}" fill="none" stroke="${INK}" stroke-width="12"/>
   ${sl?`${icon('rat',ox-170,oy+3*C-40,.9)}${n18_zzz(ox-120,oy+3*C-140,g)}`:icon('rat',ox+cc[0]*C+C/2,oy+cc[1]*C+C/2,.6)}
   ${T(960,150,sl?(rep?'LIKE A REPLAY':'ASLEEP: SAME ORDER'):'AWAKE: RUNS THE MAZE',{size:88,fill:sl?P.mint:P.gold,sc:pop(t,sl?(rep?p.replay??16.69:p.sleep??10.41):rat)})}
   ${no?`<rect width="1920" height="1080" fill="#05030C" opacity=".6"/>${glint({x:760,y:560,s:1,t:g,mouth:'frown',brows:'sad',blink:BL(g)})}<g transform="translate(1260,480) scale(${pop(t,p.norep??18.28)})"><circle r="130" fill="#2A3248" stroke="${INK}" stroke-width="10"/><path d="M-40 -60 L70 0 L-40 60Z" fill="${P.mint}" stroke="${INK}" stroke-width="8"/>${icon('cross',90,90,.6)}</g>${T(1260,760,'GLINT: NO REPLAY',{size:64,fill:P.red})}`:''}`;
},
nsKai(t,d,p,g){
  const sol=AT(t,p.sol??6.32), hrs=AT(t,p.hrs??8.68), fall=AT(t,(p.hrs??8.68)+2.6);
  const h=hrs?Math.min(26,Math.round(26*prog(t,p.hrs??8.68,(p.hrs??8.68)+2.2))):0;
  const kai=fall?`${person({x:1160,y:540,s:.95,t:0,who:'kai',legs:'sit',blink:1,mouth:'flat',rot:28})}<g transform="translate(1220,520)"><path d="M-120 -10 H120 Q110 90 0 96 Q-110 90 -120 -10Z" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><ellipse cy="-10" rx="120" ry="20" fill="#F4E2B0" stroke="${INK}" stroke-width="6"/>${[0,1,2,3].map(i=>`<circle cx="${-60+i*40}" cy="${-30-Math.abs(Math.sin(g*3+i))*30}" r="10" fill="${P.gold}" stroke="${INK}" stroke-width="3"/>`).join('')}</g>${n18_zzz(1300,360,g)}`
    :person({x:1160,y:540,s:.95,t:g,who:'kai',legs:'sit',pose:sol?'up':'down',mouth:sol?'laugh':'grin',brows:'raised',blink:BL(g+1)});
  return `${bgRoom(g)}<rect x="440" y="700" width="1000" height="90" rx="30" fill="#5A3E6A" stroke="${INK}" stroke-width="8"/>
   ${glint({x:700,y:572,s:.85,t:g,legs:'sit',mouth:fall?'smirk':'smile',pose:fall?'shrug':'down',blink:BL(g)})}${kai}<rect x="1100" y="610" width="260" height="20" fill="#8A6A4A" stroke="${INK}" stroke-width="5" opacity="${fall?1:0}"/>
   ${sol&&!fall?n18_bubble2(1350,180,460,'SOLIDARITY!','',{tail:'left',size:50}):''}
   ${hrs?`<g transform="translate(1660,560)">${n18_days(0,0,h+'h',.8,{label:'KAI AWAKE',col:'#FF5E5B'})}</g>`:''}${fall?T(960,880,'FACE-FIRST IN THE CEREAL',{size:60,fill:P.gold,sc:pop(t,(p.hrs??8.68)+2.6)}):''}
   ${n18_pm(t,'plus',"KAI'S CHALLENGE")}`;
},
nsGardner(t,d,p,g){
  const fri=p.fri??28.88;
  if(t>=fri){const days=['MON','TUE','WED','THU','FRI','SAT','SUN'];
    return `${card('cardDark',g)}${days.map((s,i)=>`<g transform="translate(${330+i*210},520)"><rect x="-90" y="-110" width="180" height="220" rx="16" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><rect x="-90" y="-110" width="180" height="56" rx="16" fill="${i===4?P.red:'#3B4A78'}" stroke="${INK}" stroke-width="8"/><text y="-68" text-anchor="middle" font-size="36" font-weight="900" fill="#fff">${s}</text><text y="50" text-anchor="middle" font-size="70" font-weight="900" fill="${INK}">${7+i}</text></g>`).join('')}
     <ellipse cx="1170" cy="530" rx="150" ry="170" fill="none" stroke="${P.red}" stroke-width="12" stroke-dasharray="${(1000*eout(prog(t,fri+.4,fri+1.4))).toFixed(0)} 2000"/>
     ${T(960,150,'DAY 11 = FRIDAY',{size:100,fill:P.red,sc:pop(t,fri)})}${T(960,840,'GLINT PASSES THE RECORD',{size:60,fill:P.white,sc:pop(t,fri+.6)})}`;}
  const yr=AT(t,p.yr??1.99), sym=AT(t,p.sym??11.99), saw=AT(t,p.saw??17.51), slp=AT(t,p.slept??20.22), rec=AT(t,p.rec??24.3);
  const dn=yr?Math.min(11,Math.round(11*prog(t,p.yr??1.99,(p.yr??1.99)+5))):0;
  let hall='';if(saw&&!slp){for(let i=0;i<5;i++){const a=g*.8+i*1.26;hall+=`<g transform="translate(${(520+Math.cos(a)*260).toFixed(0)},${(420+Math.sin(a)*150).toFixed(0)}) rotate(${(g*60+i*40).toFixed(0)})" opacity=".8"><path d="M-30 0 Q0 -40 30 0 Q0 40 -30 0Z" fill="${[P.violet,P.mint,P.coral][i%3]}" stroke="${INK}" stroke-width="5"/><circle r="10" fill="${INK}"/></g>`;}}
  const right=slp?`${rec?'':`<g transform="translate(1350,450) scale(${pop(t,p.slept??20.22)})">${labelPill(0,0,'SLEPT ~14 HOURS',P.mint,52)}</g><g transform="translate(1350,580) scale(${pop(t,(p.slept??20.22)+1.6)})">${labelPill(0,0,'RECOVERED',P.mint,52)}</g>`}`
    :sym?`${[['MOODY',0],['HARD TO CONCENTRATE',.9],['MEMORY TROUBLE',1.9]].map(([s,o],i)=>AT(t,(p.sym??11.99)+o)?`<g transform="translate(1350,${380+i*120}) scale(${pop(t,(p.sym??11.99)+o)})">${labelPill(0,0,s,P.coral,46)}</g>`:'').join('')}${saw?`<g transform="translate(1350,740) scale(${pop(t,p.saw??17.51)})">${labelPill(0,0,'SAW THINGS',P.violet,46)}</g>`:''}`
    :`${n18_days(1350,420,dn,1.1)}${AT(t,(p.yr??1.99)+5)?`<g transform="translate(1350,640) scale(${pop(t,(p.yr??1.99)+5)})">${labelPill(0,0,'SCHOOL SCIENCE FAIR',P.gold,46)}</g>`:''}`;
  return `${card('cardWarm',g)}${hall}${extra({x:520,y:560,s:1.05,t:g,head:'#FFD3A8',mouth:slp?'smile':sym?'flat':'smile'})}${slp?n18_zzz(600,330,g):''}
   ${T(520,900,'RANDY GARDNER, 17',{size:52,fill:P.white,stroke:9})}${right}
   ${rec?`${stamp(1350,520,.85,'NO NEW RECORDS',P.red,-8)}${T(1350,700,'TOO RISKY',{size:64,fill:P.white,sc:pop(t,(p.rec??24.3)+2.4)})}`:''}
   ${T(960,150,'1964: THE RECORD',{size:96,fill:P.gold,sc:IN(t,.1)})}`;
},
nsGaps(t,d,p,g){
  const mi=p.micro??10.61;
  if(t<mi){const bl=(p.blink??5.46)+.35, over=AT(t,bl+.8), two=AT(t,p.two??8.66);const fill=over?1:clamp(prog(t,2,bl)*.7);
    return `${n18_kitchen(g,{morning:1,leak:0,alarm:'off',clock:8.2})}${n18_days(1660,470,7,.7,{label:'DAY'})}
     ${n18_table(1000,720,380,'#8A6A4A')}
     ${glint({x:760,y:545,s:.9,t:g,pose:'reach',mouth:over?'o':'smile',brows:over?'raised':'calm',lid:over?0:.25,blink:BL(g)})}
     <g transform="translate(900,560) rotate(${over?5:30})"><ellipse rx="70" ry="54" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/><path d="M60 -10 L120 -40" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M60 -10 L120 -40" stroke="#FFF6EA" stroke-width="8" stroke-linecap="round"/></g>
     ${!over||true?`<path d="M1010 ${over?520:530} Q1030 600 1032 650" stroke="#C88A4A" stroke-width="12" fill="none" opacity=".85"/>`:''}
     <g transform="translate(1040,690)"><path d="M-50 -40 H50 L40 10 Q0 22 -40 10Z" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/><rect x="-44" y="${(-36+(1-fill)*40).toFixed(0)}" width="88" height="${(fill*40).toFixed(0)}" fill="#C88A4A" opacity=".8"/></g>
     ${over?`<path d="M990 655 q-10 30 -6 40 M1090 655 q10 30 6 40" stroke="#C88A4A" stroke-width="10" fill="none" stroke-linecap="round"/><ellipse cx="1040" cy="${712}" rx="${(80+60*prog(t,bl+.8,bl+3)).toFixed(0)}" ry="12" fill="#C88A4A" opacity=".8"/>`:''}
     ${n18_gap(t,bl,.8)}${two?T(960,880,'2 SECONDS: MISSING',{size:76,fill:P.red,sc:pop(t,p.two??8.66)}):''}${n18_pm(t,'minus','THE GAPS')}`;}
  const nf=AT(t,p.feel??17.63), dr=AT(t,p.drive??21.18), ti=AT(t,p.tired??24.83), wn=AT(t,p.warn??27.1);
  if(ti) return `${card('cardDark',g)}${glint({x:620,y:560,s:1.05,t:g,mouth:'flat',brows:wn?'sad':'calm',blink:BL(g)})}<g transform="translate(1300,470) scale(${pop(t,p.tired??24.83)})">${n18_bellClock(0,0,.8,g,0)}${icon('cross',150,150,.9)}</g>
    ${T(1300,820,wn?'NO WARNING AT ALL':"CAN'T FEEL TIRED",{size:64,fill:wn?P.red:P.white,sc:pop(t,wn?p.warn??27.1:p.tired??24.83)})}${T(960,150,'NO TIREDNESS = NO ALARM',{size:80,fill:P.gold,sc:pop(t,p.tired??24.83)})}${n18_gap(t,(p.warn??27.1)+1.2,.5)}`;
  if(dr){const sw=Math.sin(g*1.6)*120;const lane=`<path d="M960 420 L${960-900} 1080 M960 420 L${960+900} 1080" stroke="#3B4A78" stroke-width="10"/>${[0,1,2,3,4].map(i=>{const k=((g*.8+i/5)%1);return `<rect x="${960-6-k*14}" y="${420+k*k*660}" width="${12+k*28}" height="${20+k*80}" fill="${P.gold}" opacity="${.3+.7*k}"/>`;}).join('')}`;
    return `<rect width="1920" height="1080" fill="url(#sky)"/><rect y="420" width="1920" height="660" fill="#141A2E"/><path d="M960 420 L60 1080 H1860Z" fill="#2A3248"/>${lane}
     <g transform="translate(${960+sw},740) rotate(${(Math.cos(g*1.6)*4).toFixed(1)})"><rect x="-220" y="-120" width="440" height="190" rx="30" fill="${P.coral}" stroke="${INK}" stroke-width="9"/><rect x="-160" y="-210" width="320" height="110" rx="24" fill="#9AD1FF" stroke="${INK}" stroke-width="8"/><circle cx="-160" cy="70" r="40" fill="${INK}"/><circle cx="160" cy="70" r="40" fill="${INK}"/><circle cx="-170" cy="-30" r="22" fill="#FFF6D0" stroke="${INK}" stroke-width="5"/><circle cx="170" cy="-30" r="22" fill="#FFF6D0" stroke="${INK}" stroke-width="5"/></g>
     ${n18_gap(t,(p.drive??21.18)+1.4,.5)}${T(960,150,'SLEEPY DRIVING = DANGER',{size:90,fill:P.red,sc:pop(t,p.drive??21.18)})}`;}
  const r=rng(Math.floor(g*2.2)+1);let off='';for(let i=0;i<4;i++){const a=r()*6.28,dd=r()*120;off+=`<circle cx="${(960+Math.cos(a)*dd*1.3).toFixed(0)}" cy="${(520+Math.sin(a)*dd*.9).toFixed(0)}" r="${(60+r()*40).toFixed(0)}" fill="#05030C" opacity=".75"/>`;}
  return `${card('cardDark',g)}${brain(960,520,1.5,1,g)}${off}
   ${nf?`<g transform="translate(440,820) scale(${pop(t,p.feel??17.63)})">${labelPill(0,0,"YOU DON'T FEEL IT COMING",P.coral,40)}</g>`:''}${AT(t,p.notice??19.25)?`<g transform="translate(1480,820) scale(${pop(t,p.notice??19.25)})">${labelPill(0,0,"YOU DON'T NOTICE IT GOING",P.coral,40)}</g>`:''}
   ${T(960,150,'MICROSLEEP',{size:120,fill:P.violet,sc:pop(t,mi)})}${AT(t,mi+1.8)&&!nf?T(960,860,'PART OF THE BRAIN SWITCHES OFF',{size:56,fill:P.white}):''}`;
},
nsFFI(t,d,p,g){
  const os=AT(t,p.osei??19.48), fic=AT(t,p.fic??17.23), ser=AT(t,p.ser??10.33);
  if(os) return `${bgLab(g)}${glint({x:620,y:545,s:.95,t:g,mouth:'flat',brows:'raised',blink:BL(g)})}${person({x:1260,y:545,s:.95,t:g,who:'osei',pose:'hold',mouth:'flat',blink:BL(g+2)})}
    ${paper(1320,640,.4,4,'',8)}${n18_bubble2(1350,190,560,'COME IN','FOR TESTS',{tail:'left',size:52})}${T(960,880,'DR. OSEI READS THE RESEARCH',{size:56,fill:P.white,sc:pop(t,p.osei??19.48)})}`;
  return `${card('cardDark',g)}${brain(960,560,1.05,.5,g,.6)}
   ${AT(t,p.ffi??2.58)?`<g transform="translate(960,330) scale(${pop(t,p.ffi??2.58)})">${labelPill(0,0,'FATAL FAMILIAL INSOMNIA',P.gold,60)}</g>`:''}
   ${AT(t,(p.ffi??2.58)+2)?[['VERY RARE',420],['INHERITED',1500]].map(([s,x],i)=>`<g transform="translate(${x},600) scale(${pop(t,(p.ffi??2.58)+2+i*.6)})">${labelPill(0,0,s,P.coral,46)}</g>`).join(''):''}
   ${ser&&!fic?T(960,860,'WHY SCIENTISTS TAKE SLEEP SERIOUSLY',{size:56,fill:P.white,sc:pop(t,p.ser??10.33)}):''}
   ${fic?`<rect width="1920" height="1080" fill="#05030C" opacity=".5"/>${stamp(960,580,1.1,'GLINT = FICTION',P.mint,-8)}`:''}
   ${n18_pm(t,'minus',"NAN'S QUESTION")}`;
},
nsBattery(t,d,p,g){
  const ask=AT(t,p.ask??4.49), yes=AT(t,p.yes??8.1), ev=AT(t,p.every??10.28), th=AT(t,p.thinks??11.81);
  const ring=ask?`<circle cx="1380" cy="300" r="${(80+Math.sin(g*6)*8).toFixed(0)}" fill="none" stroke="${P.gold}" stroke-width="8"/>`:'';
  return `${n18_kitchen(g,{morning:1,leak:0,alarm:'off',clock:8})}${ring}
   ${person({x:1150,y:530,s:.9,t:g,who:'nan',pose:ask?'point':'down',mouth:ask&&!yes?'o':'smile',brows:'raised',blink:BL(g+1)})}
   ${glint({x:560,y:545,s:.9,t:g,mouth:th?'flat':'smile',brows:th?'sad':'calm',blink:BL(g),pose:yes&&!th?'wave':'down'})}
   ${ask&&!yes?n18_bubble2(1080,170,760,'DID YOU CHANGE THE BATTERY','IN THE ALARM, LOVE?',{tail:'left',size:44}):''}
   ${yes&&!th?n18_bubble2(560,190,360,'YES, NAN.','',{size:54}):''}
   ${th?n18_think(560,190,420,'...I DID?',56):''}
   ${ev?`<g transform="translate(960,880) scale(${pop(t,p.every??10.28)})">${labelPill(0,0,'EVERY MORNING',P.gold,48)}</g>`:''}`;
},
nsBack3am(t,d,p,g){
  const rd=p.read??2.74;
  if(t<rd){const k=ease(prog(t,.1,rd-.2));return `${card('cardDark',g)}${n18_clock(960,560,260,8+k*19)}${T(960,150,'BACK TO 3:00 AM',{size:100,fill:P.gold,sc:IN(t,.1)})}`;}
  const pk=AT(t,p.pick??9.36), bo=AT(t,p.boil??13.21);
  return `${n18_kitchen(g,{leak:1,alarm:'off',hum:bo?1:.3})}${n18_table(640,690,300)}
   ${glint({x:430,y:545,s:.9,t:g,legs:'sit',mouth:'smile',look:1,blink:BL(g)})}<g transform="translate(560,600) rotate(-10)"><rect x="-60" y="-44" width="120" height="88" rx="6" fill="${P.coral}" stroke="${INK}" stroke-width="6"/><path d="M0 -44 V44" stroke="${INK}" stroke-width="5"/></g>
   ${n18_nanChair(1250,g,{state:'doze'})}<ellipse cx="930" cy="900" rx="200" ry="34" fill="#6A3A4A" opacity=".8"/>${pickles(930,860,.62,g,{blink:1})}${n18_zzz(1180,360,g,.8)}
   ${pk?`<g transform="translate(930,730) scale(${pop(t,p.pick??9.36)})">${labelPill(0,0,"WON'T LIFT HIS HEAD",P.coral,32)}</g>`:''}
   ${n18_days(1660,700,10,.6)}${T(960,150,'3:00 AM',{size:96,fill:P.white,sc:IN(t,rd+.1)})}`;
},
nsSleepy(t,d,p,g){
  const sl=AT(t,p.sleepy??4.01), sag=AT(t,p.sag??5.4), thr=AT(t,p.throb??7.15), con=AT(t,p.conf??8.92), jmp=AT(t,p.jump??10.47), shr=AT(t,p.shrug??13.85), tdy=AT(t,p.ten??16.79);
  const tick=jmp&&t>(p.jump??10.47)+.6?3+8/60:3+7/60;
  return `${card('cardDark',g)}${n18_throb(760,470,g,1.4,thr?1:0)}
   ${glint({x:760,y:600,s:1.4,t:g,mouth:shr?'smirk':sl?'flat':'o',brows:sl&&!shr?'sad':'raised',lid:sag?.55+.15*Math.sin(g*1.5):0,pose:shr?'shrug':'down'})}${sag?n18_dark(760,600-84,1.4):''}
   ${con?n18_swirl(760,250,g,.9):''}
   ${n18_clock(1450,500,150,tick)}${T(1450,730,jmp?'+1 MINUTE?':'3:07 AM',{size:56,fill:jmp?P.red:P.white})}${n18_gap(t,(p.jump??10.47)+.2,.5)}
   ${sl&&!shr?T(960,170,'SLEEPY.',{size:150,fill:P.violet,sc:pop(t,p.sleepy??4.01)}):''}${!sl?T(960,160,'SOMETHING NEW...',{size:84,fill:P.white,sc:IN(t,.2)}):''}
   ${shr?T(960,160,tdy?'10 DAYS AWAKE... OF COURSE':'JUST FOGGY?',{size:80,fill:P.gold,sc:pop(t,tdy?p.ten??16.79:p.shrug??13.85)}):''}`;
},
nsLogic(t,d,p,g){
  const bulb=AT(t,p.sci??2.01), rule=AT(t,p.rule??4.48), off=AT(t,p.off??7.85), so=AT(t,p.so??9.78), nb=AT(t,p.notb??11.88), air=AT(t,p.air??13.63);
  if(air) return `${n18_kitchen(g,{leak:1,alarm:'off'})}${n18_haze(g,.25+.5*prog(t,p.air??13.63,(p.air??13.63)+1.2))}${glint({x:760,y:545,s:.9,t:g,mouth:'o',brows:'raised',look:1})}${T(960,160,"IT'S THE AIR.",{size:130,fill:P.white,sc:pop(t,p.air??13.63)})}`;
  return `${card('cardDark',g)}${glint({x:500,y:560,s:1.05,t:g,mouth:bulb?'o':'flat',brows:bulb?'raised':'calm',lid:bulb?0:.4,blink:bulb?BL(g):0})}${bulb?icon('bulb',500,170,.9*pop(t,p.sci??2.01)):''}
   ${rule?`<g transform="translate(1300,250) scale(${pop(t,p.rule??4.48)})">${labelPill(0,0,"RULE: HE CAN'T FEEL SLEEPY",P.gold,46)}</g>`:''}
   ${off?`<g transform="translate(1300,500) scale(${pop(t,p.off??7.85)})">${n18_switch(0,0,.6,false,'')}</g>`:''}
   ${so?T(1300,760,nb?"...IT ISN'T HIS BRAIN":'SO IF HE FEELS SLEEPY...',{size:60,fill:nb?P.mint:P.white,sc:pop(t,nb?p.notb??11.88:p.so??9.78)}):''}
   ${T(960,150,bulb?'THE SCIENTIST WAKES UP':'HE STOPS.',{size:84,fill:P.white,sc:pop(t,bulb?p.sci??2.01:.1)})}`;
},
nsCO(t,d,p,g){
  const col=AT(t,p.col??1.65), bo=AT(t,p.boil??4.79), bl=AT(t,p.blood??6.6), two=AT(t,p.two??9), sym=AT(t,p.sym??15.79), asl=AT(t,p.asleep??19.21);
  if(bl){const n=Math.floor(4.2*prog(t,(p.blood??6.6)+1.5,(p.blood??6.6)+7));
    let free='';for(let i=0;i<3;i++){const x=1550+Math.sin(g+i*2)*60,y=280+i*170+Math.cos(g*1.3+i)*20;free+=i<Math.min(n,3)?n18_o2(x,y,.42):'';}
    return `${bgMicro(g)}${n18_rbc(760,520,1,n,g)}${free}${!sym?`<g transform="translate(${lerp(1500,1000,prog(t,(p.blood??6.6)+.5,(p.blood??6.6)+1.5)).toFixed(0)},${(820).toFixed(0)})">${n18_coMol(0,0,.7)}</g>`:''}
     ${two&&!sym?`<g transform="translate(1450,520) scale(${pop(t,p.two??9)})">${labelPill(0,0,'~200x TIGHTER GRIP',P.gold,52)}</g>`:''}
     ${sym?[['SLEEPY',0],['DIZZY',.6],['CONFUSED',1.2]].map(([s,o],i)=>`<g transform="translate(1520,${300+i*120}) scale(${pop(t,(p.sym??15.79)+o)})">${labelPill(0,0,s,P.violet,48)}</g>`).join(''):''}
     ${asl?`<g transform="translate(1520,720) scale(${pop(t,p.asleep??19.21)})">${labelPill(0,0,'SLEEPERS MAY NOT WAKE',P.red,40)}</g>`:''}
     ${T(960,150,'IT STEALS OXYGEN SEATS',{size:84,fill:P.white,sc:pop(t,p.blood??6.6)})}${T(760,880,'RED BLOOD CELL',{size:44,fill:'#FF9EC0',stroke:8})}`;}
  if(bo) return `${n18_kitchen(g,{leak:1,alarm:'off'})}${n18_haze(g,.75)}${[0,1,2,3].map(i=>{const k=((g*.4+i/4)%1);return `<circle cx="${(1610-k*300).toFixed(0)}" cy="${(420-k*120).toFixed(0)}" r="${(40+k*120).toFixed(0)}" fill="${n18_HZ}" opacity="${((1-k)*.45).toFixed(2)}"/>`;}).join('')}
    <g transform="translate(1610,700) scale(${pop(t,p.boil??4.79)})">${labelPill(0,0,'FAULTY BOILER',P.red,46)}</g>${T(960,150,'IT CAN LEAK',{size:100,fill:P.white,sc:pop(t,p.boil??4.79)})}`;
  return `${card('cardDark',g)}${n18_haze(g,col?.8:.2)}${n18_coMol(960,470,1.6*pop(t,.1))}
   ${col?`<g transform="translate(560,760) scale(${pop(t,p.col??1.65)})"><ellipse rx="100" ry="56" fill="#fff" stroke="${INK}" stroke-width="8"/><circle r="30" fill="${INK}"/>${icon('cross',90,-50,.5)}</g>${T(560,900,'NO COLOUR',{size:50,fill:P.white,stroke:8})}
     <g transform="translate(1360,760) scale(${pop(t,(p.col??1.65)+.5)})"><path d="M-20 -80 Q-10 20 -60 50 Q-30 80 20 60 Q60 50 40 20 Q10 0 20 -80Z" fill="#FFD3A8" stroke="${INK}" stroke-width="8"/>${icon('cross',90,-50,.5)}</g>${T(1360,900,'NO SMELL',{size:50,fill:P.white,stroke:8})}`:''}
   ${T(960,160,'CARBON MONOXIDE',{size:110,fill:P.white,sc:pop(t,.05)})}${col?`<g transform="translate(960,260) scale(${pop(t,(p.col??1.65)+1)})">${labelPill(0,0,'SHOWN HERE AS A GREY HAZE',n18_HZ,36)}</g>`:''}`;
},
nsAlarm(t,d,p,g){
  const lo=AT(t,p.light??2.48), po=AT(t,p.pocket??4.0), nan=AT(t,p.nan??8.78), br=AT(t,p.breath??11.04), pk=AT(t,p.pick??13.61);
  if(!nan) return `${n18_kitchen(g,{leak:1,alarm:'off'})}${n18_haze(g,.6)}<rect width="1920" height="1080" fill="#05030C" opacity=".35"/>
    ${po?`<g transform="translate(1100,520)"><path d="M-30 -260 L30 -260" stroke="#9AA7BD" stroke-width="14" stroke-linecap="round"/><path d="M-150 -240 Q0 -280 150 -240 L190 220 H-190Z" fill="#4A6A8A" stroke="${INK}" stroke-width="10"/><path d="M0 -250 V220" stroke="${INK}" stroke-width="6"/>
      <rect x="40" y="40" width="120" height="110" rx="10" fill="#3A5A78" stroke="${INK}" stroke-width="7"/><g transform="translate(100,30) rotate(-12)"><circle r="${(70+Math.sin(g*5)*8).toFixed(0)}" fill="url(#gGold)"/><rect x="-24" y="-60" width="48" height="90" rx="8" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><rect x="-10" y="-72" width="20" height="14" fill="#C9C2B8" stroke="${INK}" stroke-width="4"/><text y="0" text-anchor="middle" font-size="40" font-weight="900" fill="${INK}">+</text></g></g>
      ${T(1100,880,'STILL IN HIS COAT POCKET',{size:60,fill:P.gold,sc:pop(t,p.pocket??4.0)})}${AT(t,p.ten??6.38)?`<g transform="translate(1580,640) scale(${pop(t,p.ten??6.38)})">${labelPill(0,0,'FOR 10 DAYS',P.red,48)}</g>`:''}`
     :`${n18_coAlarm(760,480,3.2,'off',g)}${glint({x:1450,y:545,s:.9,t:g,mouth:'o',brows:'raised',look:-1,blink:BL(g)})}${lo?T(760,860,'LIGHT: OFF',{size:80,fill:P.red,sc:pop(t,p.light??2.48)}):''}`}
    ${T(960,150,po?'THE BATTERY...':'THE ALARM BY THE BOILER',{size:84,fill:P.white,sc:pop(t,po?p.pocket??4.0:.1)})}`;
  const sh=Math.sin(g*30)*6;const tl=n18_left(g);
  return `${n18_kitchen(g,{leak:1,alarm:'off'})}${n18_nanChair(1250,g,{state:'slump'})}
   ${glint({x:1000+sh,y:545,s:.9,t:g,pose:'reach',mouth:'o',brows:'raised',blink:0})}${pk?`${pickles(800,870,.62,0,{blink:1})}${T(800,770,'mew...',{size:36,fill:P.white,stroke:7,sc:pop(t,p.pick??13.61)})}`:pickles(800,870,.62,0,{blink:1})}
   ${n18_haze(g,.65)}${n18_bubble2(980,200,260,'NAN!','',{size:64,tail:'left'})}
   ${br?`<g transform="translate(440,640)"><rect x="-200" y="-90" width="400" height="180" rx="20" fill="#0B1026" fill-opacity=".9" stroke="${P.ice}" stroke-width="6"/><text y="-44" text-anchor="middle" font-size="32" font-weight="900" fill="${P.ice}" letter-spacing="2">BREATHING</text><path d="M-170 40 ${[...Array(17)].map((_,i)=>`L${-170+i*21} ${(40-Math.max(0,Math.sin(i*.5-g*1.2))*40).toFixed(0)}`).join(' ')}" stroke="${P.ice}" stroke-width="6" fill="none"/></g>${T(440,780,'SLOW, SHALLOW',{size:50,fill:P.ice,stroke:8})}`:''}
   ${n18_timer(tl,g)}`;
},
nsHeart(t,d,p,g){
  const need=AT(t,p.need??3.73), hard=AT(t,p.hard??8.0), hs=AT(t,p.house??11.05), more=AT(t,p.more??13.93);const tl=n18_left(g);
  if(hs){const a=.35+.5*prog(t,p.house??11.05,d);let rooms='';[[560,300,800,240],[560,560,800,240],[1360,300,800,240],[1360,560,800,240]];
    return `${n18_garden(g,{house:0})}<g transform="translate(960,560)"><path d="M-520 -260 L0 -480 L520 -260Z" fill="#3A2E5A" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><rect x="-480" y="-260" width="960" height="560" fill="#1C2444" stroke="${INK}" stroke-width="10"/><path d="M-480 20 H480 M0 -260 V300" stroke="${INK}" stroke-width="8"/>
      <rect x="-470" y="-250" width="940" height="540" fill="${n18_HZ}" opacity="${(a*.75).toFixed(2)}"/>${[...Array(18)].map((_,i)=>`<circle cx="${(-440+((i*97+g*30)%880)).toFixed(0)}" cy="${(-220+((i*61)%500)).toFixed(0)}" r="${10+(i%4)*6}" fill="#E6E8F0" opacity="${(a*.5).toFixed(2)}"/>`).join('')}
      <g transform="translate(-240,200) scale(.35)">${n18_chair(0,0,1)}</g><circle cx="300" cy="200" r="40" fill="#E8E2D6" stroke="${INK}" stroke-width="6"/></g>
     ${T(960,150,more?'EVERY MINUTE, MORE':'FILLING UP, UNSEEN',{size:90,fill:P.white,sc:pop(t,more?p.more??13.93:p.house??11.05)})}${n18_timer(tl,g)}`;}
  const beat=Math.pow(Math.abs(Math.sin(g*(hard?6:4))),6);let o2='';
  for(let i=0;i<8;i++){const k=((g*.5+i/8)%1);const co=i%3!==0;o2+=co?`<circle cx="${(1500-k*820).toFixed(0)}" cy="${(520+Math.sin(i*2+g)*60).toFixed(0)}" r="20" fill="${n18_CO1}" stroke="${INK}" stroke-width="4" opacity="${(1-k*.3).toFixed(2)}"/>`:`<circle cx="${(1500-k*820).toFixed(0)}" cy="${(520+Math.sin(i*2+g)*60).toFixed(0)}" r="20" fill="#6FD3F7" stroke="${INK}" stroke-width="4"/>`;}
  return `${card('cardWarm',g)}${o2}${heart(600,500,.95,beat)}${hard?`<path d="M780 300 q12 20 0 30 q-12 -10 0 -30Z" fill="#9AD1FF" stroke="${INK}" stroke-width="4"/>`:''}
   <g transform="translate(600,820) scale(${IN(t,.2)})">${labelPill(0,0,"NAN'S WEAK HEART",P.red,48)}</g>
   ${need?`<g transform="translate(1320,300) scale(${pop(t,p.need??3.73)})">${labelPill(0,0,'NEEDS NONSTOP OXYGEN',P.iceDeep,44)}</g>`:''}${hard?`<g transform="translate(1320,760) scale(${pop(t,p.hard??8.0)})">${labelPill(0,0,'WORKING TOO HARD',P.coral,48)}</g>`:''}
   ${T(960,150,'HARDEST ON A WEAK HEART',{size:84,fill:P.white,sc:IN(t,.1)})}${n18_timer(tl,g)}`;
},
nsPlan(t,d,p,g){
  const gp=AT(t,p.gaps??5.02), lg=AT(t,p.long??8.67), sh=AT(t,p.short??11.02), sf=AT(t,p.safe??12.8), ld=AT(t,p.loud??16.61);const tl=n18_left(g);
  let right='';
  if(sh) right=`${[0,1,2,3,4].map(i=>`<g transform="translate(${1060+i*150},${470+Math.sin(g*2+i)*6}) scale(${pop(t,(p.short??11.02)+i*.15)})"><rect x="-60" y="-60" width="120" height="120" rx="18" fill="${P.mint}" stroke="${INK}" stroke-width="7"/><text y="26" text-anchor="middle" font-size="72" font-weight="900" fill="${INK}">${i+1}</text></g>`).join('')}${T(1360,660,'SHORT STEPS',{size:70,fill:P.mint})}${sf?`<g transform="translate(1360,780) scale(${pop(t,p.safe??12.8)})">${labelPill(0,0,'STILL WORK AFTER A GAP',P.gold,40)}</g>`:''}`;
  else if(lg) right=`<g transform="translate(1360,500)">${paper(0,0,.95,7,'BIG PLAN',-4)}${icon('cross',160,180,1.2*pop(t,(p.long??8.67)+.5))}</g>`;
  else if(gp) right=`<g transform="translate(1360,480) scale(${pop(t,p.gaps??5.02)})">${brain(0,0,1,1,g,.8)}</g>${T(1360,800,'GAPS: ANY SECOND',{size:60,fill:P.red})}`;
  return `${card('cardDark',g)}${glint({x:500,y:560,s:1.05,t:g,mouth:ld?'o':'flat',brows:'angry',pose:ld?'point':'cross',blink:BL(g)})}${ld?n18_bubble2(560,200,560,'SAY IT OUT LOUD','',{size:52}):''}
   ${right}${!ld?T(860,150,gp?'THE RULES FIGHT BACK':'HE KNOWS NOW',{size:84,fill:P.white,sc:pop(t,gp?p.gaps??5.02:.1)}):''}
   ${n18_gap(t,(p.gaps??5.02)+1.6,.45)}${n18_timer(tl,g)}`;
},
nsSteps(t,d,p,g){
  const wo=prog(t,p.shove??1.04,(p.shove??1.04)+1), air=AT(t,p.cold??3.49), dn=AT(t,p.door??5.39), dk=dn?eout(prog(t,p.kick??6.48,(p.kick??6.48)+.5)):0,
    gp=p.gap??7.82, fl=AT(t,p.floor??10.07), kg=AT(t,p.keep??12.36);const tl=n18_left(g);
  const hz=.65-.25*prog(t,p.cold??3.49,d);
  const gl=fl?glint({x:960,y:640,s:.8,t:g,legs:'sit',pose:'reach',mouth:'frown',brows:'angry',rot:-8})
    :dn?glint({x:1000,y:545,s:.9,t:g,legs:AT(t,p.kick??6.48)&&!AT(t,(p.kick??6.48)+.6)?'wobble':'stand',pose:'reach',mouth:'teeth',brows:'angry',blink:0,dir:-1})
    :glint({x:470,y:545,s:.9,t:g,pose:'up',mouth:'teeth',brows:'angry'});
  return `${n18_kitchen(g,{leak:1,alarm:'off',win:wo,door:dk})}${n18_air(g,air?1:0,560,330)}${n18_air(g,dk,870,560)}${gl}${n18_haze(g,hz)}
   <rect x="0" y="40" width="1340" height="140" fill="#05030C" opacity=".35"/>${n18_steps(t,dn?1:0,dn?(fl?1:1):(wo>=1?1:0))}
   ${!dn&&wo>0?T(470,880,'"WINDOW."',{size:70,fill:P.gold,sc:pop(t,p.shove??1.04)}):''}${air&&!dn?T(1150,560,'COLD AIR',{size:56,fill:n18_ICE,stroke:9}):''}
   ${dn&&!fl&&!AT(t,gp)?T(1000,250,'"BACK DOOR."',{size:70,fill:P.gold,sc:pop(t,p.door??5.39)}):''}
   ${AT(t,gp+.9)&&!kg?T(1250,300,'2 SECONDS GONE',{size:70,fill:P.red,sc:pop(t,gp+.9)}):''}${kg?T(1250,300,'KEEP GOING.',{size:90,fill:P.mint,sc:pop(t,p.keep??12.36)}):''}
   ${n18_gap(t,gp,.9)}${n18_timer(tl,g)}`;
},
nsNanOut(t,d,p,g){
  const co=AT(t,p.co??3.72), lw=AT(t,p.low??7.38), out=AT(t,p.out??8.98), dr=p.drag??11.09, pk=AT(t,p.pick??18.81), gd=AT(t,p.good??22.93);const tl=n18_left(g);
  if(t<dr){const room=(x,lab,kind,ok)=>{let fill='';if(kind==='smoke'){for(let i=0;i<6;i++)fill+=`<ellipse cx="${(x-220+i*90+Math.sin(g+i)*10).toFixed(0)}" cy="${(330+Math.sin(g*1.5+i)*10).toFixed(0)}" rx="90" ry="60" fill="#3A3640" opacity=".85"/>`;}else fill=`<rect x="${x-290}" y="250" width="580" height="420" fill="${n18_HZ}" opacity=".55"/>${n18_blurDef()}`;
      return `<rect x="${x-300}" y="240" width="600" height="440" fill="#1C2444" stroke="${INK}" stroke-width="10"/>${fill}<g transform="translate(${x},630) rotate(90) scale(.4)">${glint({t:g,mouth:'flat',scarf:true})}</g>${T(x,740,lab,{size:52,fill:P.white,stroke:9})}${ok!=null?icon(ok?'check':'cross',x+220,320,.7):''}`;};
    return `${card('cardDark',g)}${room(560,'SMOKE: STAY LOW','smoke',true)}${co?room(1360,'CO: MIXES EVENLY','co',lw?false:null):''}
     ${out?T(960,880,'OUT IS THE ONLY ANSWER',{size:76,fill:P.mint,sc:pop(t,p.out??8.98)}):''}<rect x="0" y="40" width="1340" height="140" fill="#05030C" opacity=".35"/>${n18_steps(t,2,2)}${n18_timer(tl,g)}`;}
  const k=prog(t,dr+.3,dr+6.5), gx=lerp(560,1250,ease(k));
  const nan=`<g>${person({x:gx-230,y:720,s:.8,t:0,who:'nan',blink:1,mouth:'flat',rot:90})}<rect x="${(gx-640).toFixed(0)}" y="690" width="400" height="96" rx="30" fill="#7A4A6A" stroke="${INK}" stroke-width="8"/></g>`;
  return `${n18_garden(g)}${nan}${glint({x:gx,y:520,s:.85,t:g,legs:k<1?'walk':'stand',pose:'reach',mouth:'teeth',brows:'angry',dir:-1,blink:0})}
   ${pk?`<g transform="translate(${gx+70},560)">${pickles(0,0,.45,g,{mood:'grump'})}</g>`:''}
   ${pk?`<g transform="translate(1560,560) scale(${pop(t,p.pick??18.81)})">${labelPill(0,0,'VERY ANNOYED',P.coral,44)}</g>`:''}${gd?`<g transform="translate(1560,680) scale(${pop(t,p.good??22.93)})">${labelPill(0,0,'A GOOD SIGN',P.mint,44)}</g>`:''}
   ${!pk?T(1250,320,'INTO THE FREEZING GARDEN',{size:60,fill:n18_ICE,sc:pop(t,dr)}):''}
   <rect x="0" y="40" width="1340" height="140" fill="#05030C" opacity=".35"/>${n18_steps(t,pk?3:2,pk?3:2)}${n18_timer(tl,g)}`;
},
nsCall(t,d,p,g){
  const st=p.sit??10.96, op=AT(t,p.op??18.29), ez=AT(t,p.easy??23.03);const tl=n18_left(g);
  if(t<st){const ws=[['CARBON MONOXIDE',p.w1??5.16],['GRANDMOTHER',p.w2??7.06],['WEAK HEART',p.w3??8.35],['BREATHING',p.w4??9.65]];
    return `${n18_garden(g)}${n18_phone(620,520,1.3,g)}${ws.map(([s,a],i)=>AT(t,a)?`<g transform="translate(1340,${330+i*130}) scale(${pop(t,a)})">${labelPill(0,0,s,[P.red,P.gold,P.coral,P.ice][i],52)}</g>`:'').join('')}
     ${AT(t,p.slow??2.2)&&!AT(t,p.w1??5.16)?T(1340,520,'SLOWLY. CLEARLY.',{size:70,fill:P.white,sc:pop(t,p.slow??2.2)}):''}
     <rect x="0" y="40" width="1340" height="140" fill="#05030C" opacity=".35"/>${n18_steps(t,4,4)}${n18_timer(tl,g)}`;}
  return `${n18_garden(g)}${person({x:1020,y:740,s:.8,t:0,who:'nan',blink:1,mouth:'flat',rot:90})}<rect x="620" y="710" width="390" height="96" rx="30" fill="#7A4A6A" stroke="${INK}" stroke-width="8"/>
   ${glint({x:1180,y:560,s:.8,t:g,legs:'sit',mouth:ez?'smirk':'o',brows:'raised',pose:'point',dir:-1,blink:0})}<rect x="1140" y="410" width="34" height="70" rx="8" fill="${INK}" transform="rotate(-20 1157 445)"/>
   ${!op?n18_bubble2(1260,250,560,'THE ADDRESS...','AGAIN... AGAIN...',{size:46,tail:'left'}):''}
   ${op?`${[['STAY OUTSIDE',0],['STAY AWAKE',.8],['KEEP TALKING',1.6]].map(([s,o],i)=>`<g transform="translate(560,${300+i*120}) scale(${pop(t,(p.op??18.29)+o)})">${labelPill(0,0,s,P.mint,50)}</g>`).join('')}${T(560,210,'THE OPERATOR:',{size:50,fill:P.white,stroke:9})}`:''}
   ${ez?`<g transform="translate(1460,280) scale(${pop(t,p.easy??23.03)})">${labelPill(0,0,'THE EASY PART',P.gold,48)}</g>`:''}${n18_timer(tl,g)}`;
},
nsSirens(t,d,p,g){
  const mk=AT(t,p.mask??1.48), ff=AT(t,p.ff??3.47), off=AT(t,p.off??9.21);const tl=n18_left(g);
  const fl=Math.sin(g*10)>0;
  if(ff){const tim=off?n18_timer(0,g,{label:'BOILER OFF',col:P.mint,txt:'SAFE'}):n18_timer(tl,g);
    return `${n18_kitchen(g,{leak:1,boil:off?0:1,alarm:'off'})}${n18_haze(g,off?.35:.6)}<rect width="1920" height="1080" fill="${fl?'#3050FF':'#FF3040'}" opacity=".08"/>
     ${extra({x:1250,y:540,s:1,t:g,head:'#C68B59',pose:'hold',mouth:'flat'})}<path d="M1155 450 Q1250 360 1345 450 L1360 470 H1140Z" fill="${P.red}" stroke="${INK}" stroke-width="7"/>
     <g transform="translate(1310,640)"><rect x="-60" y="-80" width="120" height="150" rx="14" fill="${P.gold}" stroke="${INK}" stroke-width="7"/><rect x="-44" y="-62" width="88" height="56" rx="6" fill="#1A1020" stroke="${INK}" stroke-width="4"/><text y="-22" text-anchor="middle" font-size="30" font-weight="900" fill="${Math.sin(g*8)>0?P.red:'#7A1020'}">HIGH</text><text y="40" text-anchor="middle" font-size="34" font-weight="900" fill="${INK}">CO</text></g>
     ${off?T(1610,700,'OFF',{size:90,fill:P.mint,sc:pop(t,p.off??9.21)}):T(960,880,'...VERY QUIET',{size:64,fill:P.white,sc:pop(t,(p.ff??3.47)+3.5)})}
     ${T(860,150,off?'BOILER: OFF':'THE METER READING',{size:84,fill:off?P.mint:P.white,sc:pop(t,off?p.off??9.21:p.ff??3.47)})}${tim}`;}
  const vx=lerp(2200,1400,eout(prog(t,0,1.4)));
  return `${n18_garden(g)}<rect width="1920" height="1080" fill="${fl?'#3050FF':'#FF3040'}" opacity=".14"/>
   <g transform="translate(${vx.toFixed(0)},700)"><rect x="-300" y="-260" width="600" height="300" rx="30" fill="#F4F6FA" stroke="${INK}" stroke-width="10"/><rect x="-300" y="-80" width="600" height="40" fill="${P.red}"/><rect x="-60" y="-300" width="120" height="44" rx="10" fill="${fl?'#3050FF':P.red}" stroke="${INK}" stroke-width="6"/>
    <circle cy="-280" r="${fl?120:60}" fill="${fl?'#3050FF':P.red}" opacity=".3"/><path d="M-30 -200 H30 M0 -230 V-170" stroke="${P.red}" stroke-width="20"/><circle cx="-180" cy="50" r="56" fill="${INK}"/><circle cx="180" cy="50" r="56" fill="${INK}"/></g>
   ${person({x:700,y:740,s:.8,t:0,who:'nan',blink:1,mouth:'flat',rot:90})}<rect x="300" y="710" width="390" height="96" rx="30" fill="#7A4A6A" stroke="${INK}" stroke-width="8"/>${mk?n18_mask(752,705,.7):''}
   ${glint({x:860,y:560,s:.8,t:g,legs:'sit',mouth:'o',brows:'raised',blink:0})}
   ${T(960,150,mk?'OXYGEN MASKS':'THE SIRENS COME',{size:96,fill:P.white,sc:pop(t,mk?p.mask??1.48:.1)})}${n18_timer(tl,g)}`;
},
nsHospital(t,d,p,g){
  const hs=AT(t,p.hosp??3.74), sl=AT(t,p.sleeps??6.79), h14=AT(t,p.h14??9.2), rg=AT(t,p.randy??11.61), wk=AT(t,p.wake??13.7), ti=AT(t,p.tired??15.95), gn=AT(t,p.gone??18.7);
  if(!hs) return `<rect width="1920" height="1080" fill="#DDE6F2"/><rect y="760" width="1920" height="320" fill="#9AA7BD"/><rect x="0" y="0" width="1920" height="80" fill="${Math.sin(g*10)>0?'#3050FF':P.red}" opacity=".5"/>
    <rect x="900" y="650" width="760" height="70" rx="20" fill="#fff" stroke="${INK}" stroke-width="8"/>${person({x:1200,y:420,s:.95,t:g,who:'nan',legs:'sit',pose:'hips',mouth:'frown',brows:'angry',blink:BL(g)})}
    ${glint({x:520,y:545,s:.9,t:g,mouth:'grin',brows:'sad',pose:'shrug',blink:BL(g+1)})}${n18_bubble2(1360,150,400,'MY NIGHTIE!','',{size:56,tail:'left'})}${T(560,170,'NAN WAKES UP',{size:80,fill:P.mint,sc:IN(t,.1)})}`;
  const bed=`<rect x="460" y="620" width="1000" height="80" rx="24" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="420" y="480" width="80" height="320" rx="20" fill="#9AA7BD" stroke="${INK}" stroke-width="8"/><path d="M500 800 V820 M1420 700 V820" stroke="${INK}" stroke-width="18"/>`;
  const lying=!wk;
  const gl=lying?`<g>${glint({x:760,y:600,s:.75,t:sl?0:g,eyes:sl?'closed':'open',mouth:sl?'smile':'flat',rot:-90})}</g><rect x="820" y="560" width="600" height="90" rx="30" fill="#9AD1FF" stroke="${INK}" stroke-width="8"/>${!sl?n18_mask(724,590,.75):''}`
    :`${glint({x:820,y:400,s:.8,t:g,legs:'sit',mouth:ti?'smile':'o',lid:ti?.35:.5,brows:'calm',pose:'up',blink:BL(g)})}<rect x="560" y="560" width="860" height="110" rx="30" fill="#9AD1FF" stroke="${INK}" stroke-width="8"/>`;
  const hrs=h14?Math.min(14,Math.round(14*prog(t,p.h14??9.2,(p.h14??9.2)+2.2))):0;
  return `<rect width="1920" height="1080" fill="#C9D6E8"/><rect y="760" width="1920" height="320" fill="#8E9AB0"/><rect x="1500" y="200" width="300" height="220" rx="16" fill="#0A1E1A" stroke="${INK}" stroke-width="8"/>${ecg(1520,330,260,g)}
   ${bed}${gl}${sl&&lying?n18_zzz(700,420,g,1.2,P.violet):''}
   ${h14&&!wk?`${n18_clock(1650,640,110,22+hrs)}${n18_days(1650,850-30,hrs+'h',.55,{label:'ASLEEP',col:P.violet})}`:''}
   ${T(960,150,gn?'THE POWER IS GONE':ti?'TIRED. NORMALLY TIRED.':wk?'HE WAKES UP...':rg?'JUST LIKE RANDY GARDNER':h14?'14 HOURS':sl?'AND GLINT SLEEPS':'OXYGEN FOR BOTH',{size:84,fill:gn?P.gold:ti?P.mint:P.white,sc:pop(t,gn?p.gone??18.7:ti?p.tired??15.95:wk?p.wake??13.7:rg?p.randy??11.61:h14?p.h14??9.2:sl?p.sleeps??6.79:p.hosp??3.74)})}
   ${gn?n18_days(1650,560,0,.8):''}`;
},
nsSong(t,d,p,g){
  const hm=AT(t,p.hum??2.99), fg=AT(t,p.fing??5.45), ev=AT(t,p.every??7.75), dr=AT(t,p.draft??9.17), ns=AT(t,p.nan??17.45);
  if(dr&&!ns){let sh='';for(let i=0;i<4;i++){const q=((t*.4+i/4)%1);const x=lerp(500,1400,q),y=520-Math.sin(q*Math.PI)*240;sh+=`<g transform="translate(${x.toFixed(0)},${y.toFixed(0)}) rotate(${(q*30-15).toFixed(0)})" opacity="${Math.sin(q*Math.PI).toFixed(2)}"><rect x="-70" y="-90" width="140" height="180" rx="8" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/>${[0,1,2].map(j=>n18_note(-30+j*30,-20+j*25,.45,q>.5?INK:'#9A9AA2',1)).join('')}</g>`;}
    return `${card('cardDark',g)}<g transform="translate(420,560)">${[0,1,2].map(i=>`<rect x="${-80+i*14}" y="${-100-i*14}" width="160" height="200" rx="8" fill="#FFF6EA" stroke="${INK}" stroke-width="6" opacity=".9"/>`).join('')}</g>${T(420,760,'PENCIL DRAFTS',{size:48,fill:'#C9C2B8',stroke:8})}
     ${n18_cabinet(1460,600,1,g,{label:'LONG-TERM',open:.5+.4*Math.sin(g*2)})}${sh}
     <g transform="translate(960,150) scale(${pop(t,p.draft??9.17)})">${labelPill(0,0,'IN THIS WORLD: FILED AT LAST',P.coral,46)}</g>${T(960,880,'ONE LONG NIGHT OF FILING',{size:60,fill:P.mint,sc:pop(t,(p.draft??9.17)+1.5)})}`;}
  return `<rect width="1920" height="1080" fill="#C9D6E8"/><rect y="760" width="1920" height="320" fill="#8E9AB0"/>
   <rect x="460" y="620" width="1000" height="80" rx="24" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="420" y="480" width="80" height="320" rx="20" fill="#9AA7BD" stroke="${INK}" stroke-width="8"/><path d="M500 800 V820 M1420 700 V820" stroke="${INK}" stroke-width="18"/>
   ${glint({x:760,y:400,s:.8,t:g,legs:'sit',mouth:hm?'o':'smile',brows:'raised',pose:'reach',blink:BL(g),glint:ev?1:0})}<rect x="560" y="560" width="860" height="110" rx="30" fill="#9AD1FF" stroke="${INK}" stroke-width="8"/>
   ${fg?`<g transform="translate(980,600)"><rect x="-200" y="-24" width="400" height="48" fill="#fff" stroke="${INK}" stroke-width="5" opacity=".95"/>${[...Array(10)].map((_,i)=>`<rect x="${-200+i*40}" y="-24" width="40" height="48" fill="${Math.floor(g*4)%10===i?P.gold:'none'}" stroke="${INK}" stroke-width="3"/>`).join('')}</g>`:''}
   ${hm?n18_notes(800,300,g,1,7):''}
   ${ns?`${person({x:1560,y:540,s:.9,t:g,who:'nan',mouth:'smile',brows:'raised',pose:'hips',blink:BL(g+1)})}${n18_bubble2(1260,190,700,'NEXT TIME, LOVE,','JUST TAKE THE NAP.',{size:50,tail:'right'})}`
     :T(960,150,ev?'EVERY NOTE':'HE HUMS NAN\'S SONG',{size:96,fill:ev?P.gold:P.white,sc:pop(t,ev?p.every??7.75:p.hum??2.99)})}`;
}
});
// soft light rays (local helper; thumbkit isn't loaded in the engine)
function n18_rays(x,y,g,a=1){if(a<=0)return '';let s='';for(let i=0;i<12;i++){const an=i*Math.PI/6+g*.1,b=an+.12;s+=`<path d="M${x} ${y} L${(x+Math.cos(an)*1400).toFixed(0)} ${(y+Math.sin(an)*1400).toFixed(0)} L${(x+Math.cos(b)*1400).toFixed(0)} ${(y+Math.sin(b)*1400).toFixed(0)}Z" fill="#FFF6D0" opacity="${(.1*a).toFixed(3)}"/>`;}return s;}
