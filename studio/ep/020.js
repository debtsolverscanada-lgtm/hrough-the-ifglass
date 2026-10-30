// episode 020 scenes: What If You Could Move 100x FASTER? (story episode)
const s20_DEFS=`<defs>
 <linearGradient id="s20sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34405F"/><stop offset=".7" stop-color="#6E7DA2"/><stop offset="1" stop-color="#9AA8C4"/></linearGradient>
 <linearGradient id="s20day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6EC1F5"/><stop offset="1" stop-color="#D8F0FF"/></linearGradient>
 <linearGradient id="s20kit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E5A8A"/><stop offset="1" stop-color="#5C78A8"/></linearGradient>
 <linearGradient id="s20mtn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7B267"/><stop offset="1" stop-color="#F4845F"/></linearGradient>
 <radialGradient id="s20heat"><stop offset="0" stop-color="#FFF3A0" stop-opacity=".95"/><stop offset=".45" stop-color="#FF9F43" stop-opacity=".7"/><stop offset="1" stop-color="#FF4D5E" stop-opacity="0"/></radialGradient>
 <radialGradient id="s20glow"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".9"/><stop offset="1" stop-color="#FFC83D" stop-opacity="0"/></radialGradient>
 <filter id="s20blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
</defs>`;
const s20_ANG=20.66, s20_SL=.377, s20_FROST='#BFE6FF';
const s20_gl=o=>glint(Object.assign({blink:BL(o.t||0)},o));
// ground line of Hill Street (side view): steep slope down to the right, flat at the bottom
const s20_hy=x=>x<1180?370+(x+40)*s20_SL:830;
const s20_lrot=X=>X<1100?s20_ANG:X>1260?0:lerp(s20_ANG,0,(X-1100)/160);
// countdown: Glint-time seconds left (900 s = 9 s real) keyed to the narration
const s20_K=[[330.71,900],[370.45,840],[382.17,780],[418.2,752],[450.04,660],[451.36,420],[452.34,240],[461.48,200],[464.71,180],[474.43,0]];
function s20_left(g){const K=s20_K;if(g<=K[0][0])return K[0][1];for(let i=1;i<K.length;i++)if(g<=K[i][0])return lerp(K[i-1][1],K[i][1],(g-K[i-1][0])/(K[i][0]-K[i-1][0]));return 0;}
const s20_mmss=L=>`${Math.floor(L/60)}:${String(Math.floor(L%60)).padStart(2,'0')}`;
// split timer: REAL TIME vs GLINT TIME
function s20_split(x,y,s,real,mine,o={}){const {g=0,pulse=0,lab1='REAL TIME',lab2='GLINT TIME',c1=P.ice,c2=P.gold,op=1}=o;const k=1+pulse*.025*Math.sin(g*8);
  const fs=v=>Math.min(118,330/(v.length*.6));
  const box=(cx,lab,v,c)=>`<rect x="${cx-200}" y="-130" width="400" height="260" rx="26" fill="#0B1026" fill-opacity=".93" stroke="${c}" stroke-width="9"/><text x="${cx}" y="-62" text-anchor="middle" font-size="40" font-weight="900" letter-spacing="3" fill="${c}">${lab}</text><text x="${cx}" y="72" text-anchor="middle" font-size="${fs(v).toFixed(0)}" font-weight="900" fill="#fff" style="font-variant-numeric:tabular-nums">${v}</text>`;
  return `<g transform="translate(${x},${y}) scale(${(s*k).toFixed(3)})" opacity="${op}">${box(-220,lab1,real,c1)}${box(220,lab2,mine,c2)}<circle r="46" fill="${P.coral}" stroke="${INK}" stroke-width="8"/><text y="15" text-anchor="middle" font-size="40" font-weight="900" fill="#fff">VS</text></g>`;}
function s20_hud(g,o={}){const {x=1590,y=122,s=.6}=o;const L=s20_left(g);return s20_split(x,y,s,(L/100).toFixed(1)+' s',s20_mmss(L),{g,pulse:1});}
// big "PLUS:" / "MINUS:" label: pops at centre, then tucks into the top-left corner
function s20_pm(t,kind,sub,a=0){t-=a;if(t<0)return '';const plus=kind==='plus',col=plus?P.mint:P.red,k=eout(prog(t,2.1,2.7)),sc=lerp(1,.4,k)*pop(t,.02,.4),x=lerp(960,330,k),y=lerp(470,110,k);
  return `<rect width="1920" height="1080" fill="#05030C" opacity="${(.62*(1-k)).toFixed(3)}"/><g transform="translate(${x},${y}) scale(${sc}) rotate(${-3*(1-k)})">${T(0,0,plus?'PLUS:':'MINUS:',{size:230,fill:col,stroke:52})}${T(0,150,sub,{size:96,fill:P.white})}</g>`;}
function s20_bub(x,y,w,l1,l2='',o={}){const {size=44,tail='left',col=INK}=o;const h=l2?size*2.7:size*1.8,tx=tail==='left'?-w/2+60:w/2-60;
  return `<g transform="translate(${x},${y})"><path d="M${-w/2} ${-h/2} H${w/2} V${h/2} H${tx+30} L${tx} ${h/2+46} L${tx-14} ${h/2} H${-w/2}Z" fill="#FFF6EA" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   <text y="${l2?-size*.2:size*.35}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${col}">${l1}</text>${l2?`<text y="${size*1.0}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${col}">${l2}</text>`:''}</g>`;}
const s20_pill=(x,y,str,col,size,sc=1)=>sc>0?`<g transform="translate(${x},${y}) scale(${sc.toFixed(3)})">${labelPill(0,0,str,col,size)}</g>`:'';
// rain: falling streaks, or frozen beads that creep 100x slower
function s20_rain(g,o={}){const {frozen=1,n=90,seed=7,op=.85,y1=900,x0=0,w=1920,col=s20_FROST,big=1}=o;const r=rng(seed);let s='';
  for(let i=0;i<n;i++){const x=x0+r()*w,y0=r()*y1,sp=650+r()*300;
    if(frozen){const y=(y0+g*sp/100)%y1,sh=.5+.5*Math.sin(g*3+i);s+=`<g transform="translate(${x.toFixed(0)},${y.toFixed(0)}) scale(${big})"><path d="M0 -14 Q8 0 7 5 A7 7 0 0 1 -7 5 Q-8 0 0 -14Z" fill="${col}" opacity="${op}" stroke="#fff" stroke-width="2"/><circle cx="-2" cy="2" r="2.4" fill="#fff" opacity="${sh.toFixed(2)}"/></g>`;}
    else{const y=(y0+g*sp)%y1;s+=`<path d="M${x.toFixed(0)} ${y.toFixed(0)} l-9 36" stroke="${col}" stroke-width="3.5" opacity="${(op*.6).toFixed(2)}" stroke-linecap="round"/>`;}}
  return s;}
function s20_lines(x,y,g,o={}){const {len=520,n=7,dir=-1,col=P.gold,h=300,op=1}=o;let s='';const r=rng(19);
  for(let i=0;i<n;i++){const yy=y-h/2+i*h/(n-1),l=len*(.5+r()*.5),off=((g*3+r())%1)*60;s+=`<path d="M${(x+dir*(40+off)).toFixed(0)} ${yy.toFixed(0)} h${(dir*l).toFixed(0)}" stroke="${col}" stroke-width="${(7+r()*6).toFixed(1)}" stroke-linecap="round" opacity="${(op*(.45+.5*r())).toFixed(2)}"/>`;}
  return s;}
// Glint at speed: gold aura + fading afterimages
function s20_fast(o,n=3,dx=-110,aura=1){let s=aura?`<circle cx="${o.x}" cy="${o.y-40*(o.s||1)}" r="${240*(o.s||1)}" fill="url(#s20glow)" opacity="${(.55*aura).toFixed(2)}"/>`:'';
  for(let i=n;i>=1;i--)s+=`<g opacity="${(.42-.11*i).toFixed(2)}">${glint({...o,x:o.x+dx*i,blink:0,tint:'#FFE9A8'})}</g>`;return s+s20_gl(o);}
function s20_smoke(x,y,g,a=1,s=1){if(a<=0)return '';let o='';for(let i=0;i<5;i++){const k=((g*.7+i/5)%1);o+=`<circle cx="${(x+Math.sin(g*2+i)*16*s+k*30*s).toFixed(0)}" cy="${(y-k*170*s).toFixed(0)}" r="${((14+k*40)*s).toFixed(0)}" fill="#9AA0AE" opacity="${(a*(1-k)*.7).toFixed(2)}"/>`;}return o;}
function s20_shoe(x,y,s,o={}){const {melt=0,heat=0,col='#F4F6FA',rot=0,g=0,sm=0}=o;const sole=Math.max(4,30*(1-melt));
  let dr='';if(melt>0)for(let i=0;i<6;i++){const dx=-130+i*52,l=(20+((i*37)%30))*melt+Math.sin(g*2+i)*4;dr+=`<path d="M${dx-10} 0 Q${dx} ${l} ${dx+2} ${l+8} Q${dx+12} ${l} ${dx+12} 0Z" fill="#4A3A3A" stroke="${INK}" stroke-width="4"/>`;}
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">${heat?`<ellipse cx="0" cy="-10" rx="230" ry="90" fill="url(#s20heat)" opacity="${heat}"/>`:''}
   <path d="M-150 ${-sole} Q-165 -100 -115 -122 L-45 -132 Q5 -100 60 -82 Q145 -70 165 ${-sole-14} L170 ${-sole}Z" fill="${col}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
   <path d="M-120 -70 Q0 -40 120 ${-sole-20}" stroke="${P.mint}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M-62 -122 L-22 -78 M-36 -126 L4 -86 M-10 -116 L28 -84" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
   <path d="M-160 ${-sole} H172 Q176 0 150 0 H-150 Q-166 0 -160 ${-sole}Z" fill="${melt>.4?'#5A4646':'#E2DCCF'}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>${dr}</g>${s20_smoke(x,y-60*s,g,sm,s*1.2)}`;}
function s20_bun(x,y,s=1,rot=0){let d='';for(let i=0;i<=30;i++){const a=i*.42,r=4+i*1.5;d+=(i?'L':'M')+(Math.cos(a)*r).toFixed(1)+' '+(Math.sin(a)*r*.8).toFixed(1);}
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><ellipse rx="56" ry="46" fill="#D9933F" stroke="${INK}" stroke-width="6"/><path d="${d}" stroke="#8A4A1A" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-36 -16 q14 10 28 -2 t30 4" stroke="#FFF6EA" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;}
// Nan's tin (seen from above-front). n = buns left (of 6), open 0..1
function s20_tin(x,y,s,o={}){const {open=0,n=6}=o;const slots=[[-70,-12],[0,-18],[70,-12],[-70,26],[0,30],[70,26]];
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-130 0 V70 Q0 110 130 70 V0Z" fill="#C8323C" stroke="${INK}" stroke-width="8"/><path d="M-130 40 Q0 80 130 40" stroke="#F4E2B0" stroke-width="8" fill="none"/>
   <ellipse rx="130" ry="44" fill="${open?'#7A1A22':'#D8404A'}" stroke="${INK}" stroke-width="8"/>${open?slots.map(([a,b],i)=>i<n?s20_bun(a,b,.5):`<ellipse cx="${a}" cy="${b}" rx="26" ry="16" fill="#5A1018"/><circle cx="${a+8}" cy="${b-4}" r="4" fill="#D9933F"/>`).join(''):`<ellipse rx="96" ry="28" fill="none" stroke="#F4E2B0" stroke-width="6"/>`}
   ${open?`<g transform="translate(150,-80) rotate(30)"><ellipse rx="130" ry="44" fill="#D8404A" stroke="${INK}" stroke-width="8" opacity="${open}"/></g>`:''}</g>`;}
// cat carrier with Mr. Pickles inside (hiss 0..1)
function s20_carrier(x,y,s,o={}){const {hiss=0}=o;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-50 22 Q0 -40 50 22" stroke="${INK}" stroke-width="14" fill="none"/><path d="M-50 22 Q0 -40 50 22" stroke="#7A6A8A" stroke-width="7" fill="none"/>
   <rect x="-110" y="20" width="220" height="150" rx="22" fill="#E8DCC4" stroke="${INK}" stroke-width="8"/><circle cx="0" cy="95" r="58" fill="#2A2030" stroke="${INK}" stroke-width="7"/>
   <g transform="translate(0,100)"><path d="M-40 -20 L-36 -58 L-12 -34Z M40 -20 L36 -58 L12 -34Z" fill="#F0913A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle r="40" fill="#F0913A" stroke="${INK}" stroke-width="6"/>
    <path d="M-26 -12 L-8 -4 M26 -12 L8 -4" stroke="${INK}" stroke-width="5"/><circle cx="-15" cy="-1" r="5" fill="${INK}"/><circle cx="15" cy="-1" r="5" fill="${INK}"/>
    ${hiss?`<path d="M-16 12 Q0 ${10+22*hiss} 16 12Z" fill="#3a1220" stroke="${INK}" stroke-width="4"/><path d="M-10 13 l3 8 l3 -8 M4 13 l3 8 l3 -8" fill="#fff" stroke="${INK}" stroke-width="2"/>`:`<path d="M-8 14 q8 6 16 0" stroke="${INK}" stroke-width="4" fill="none"/>`}</g>
   ${[-34,-12,12,34].map(v=>`<path d="M${v} 42 V148" stroke="#5A5060" stroke-width="5"/>`).join('')}</g>`;}
// Nan on the crossing with tin + carrier
function s20_nan(x,y,s,g,o={}){const {frozen=1,hiss=1,mouth='smile',look=1,tin=1,carrier=1,pose='hold',brows='calm'}=o;const S=s*.92;
  return `${person({x,y,s,t:frozen?0:g,who:'nan',pose,look,mouth,brows,blink:0})}${carrier?`<g>${s20_carrier(x+62*S,y+90*S,.55*S,{hiss})}</g>`:''}${tin?s20_tin(x-10*S,y+105*S,.42*S):''}`;}
function s20_lorry(x,y,s,rot,g,o={}){const {panic=1,brake=1,lights=1}=o;const hx=196,hy=-200;
  const face=`<circle cx="${hx}" cy="${hy}" r="34" fill="#E8B98A" stroke="${INK}" stroke-width="6"/>${panic?`<circle cx="${hx-12}" cy="${hy-6}" r="10" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="${hx+14}" cy="${hy-6}" r="10" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="${hx-10}" cy="${hy-6}" r="4" fill="${INK}"/><circle cx="${hx+16}" cy="${hy-6}" r="4" fill="${INK}"/><ellipse cx="${hx+2}" cy="${hy+16}" rx="8" ry="10" fill="#3a1220"/><path d="M${hx-40} ${hy+44} L${hx-52} ${hy-6} M${hx+42} ${hy+44} L${hx+54} ${hy-4}" stroke="#E8B98A" stroke-width="10" stroke-linecap="round"/>`:`<circle cx="${hx-12}" cy="${hy-4}" r="4" fill="${INK}"/><circle cx="${hx+14}" cy="${hy-4}" r="4" fill="${INK}"/>`}`;
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><ellipse cx="-30" cy="6" rx="330" ry="16" fill="rgba(0,0,0,.35)"/>
   <rect x="-340" y="-360" width="410" height="272" rx="14" fill="#ECE6DA" stroke="${INK}" stroke-width="10"/><rect x="-340" y="-360" width="410" height="46" rx="12" fill="${P.coral}" stroke="${INK}" stroke-width="8"/>
   <text x="-135" y="-215" text-anchor="middle" font-size="60" font-weight="900" fill="${INK}">DELIVERIES</text><rect x="-250" y="-178" width="230" height="52" rx="10" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><text x="-135" y="-139" text-anchor="middle" font-size="36" font-weight="900" fill="${INK}">12 TONNES</text>
   <rect x="-356" y="-160" width="22" height="44" rx="6" fill="${P.red}" stroke="${INK}" stroke-width="5"/>${brake?`<circle cx="-345" cy="-138" r="40" fill="url(#gRed)"/>`:''}
   <path d="M80 -90 V-270 Q80 -290 100 -290 H200 Q238 -290 254 -230 L284 -140 V-90Z" fill="#4A7BD8" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
   <path d="M150 -270 H200 Q226 -270 240 -222 L262 -160 H150Z" fill="#CFEAFF" stroke="${INK}" stroke-width="6"/>${face}
   <rect x="-350" y="-104" width="640" height="40" rx="10" fill="#3A3F52" stroke="${INK}" stroke-width="8"/>
   ${lights?`<circle cx="276" cy="-118" r="16" fill="#FFF3A0" stroke="${INK}" stroke-width="5"/><path d="M290 -118 L560 -170 L560 -60Z" fill="#FFF3A0" opacity=".14"/>`:''}
   ${[-262,-150,196].map(wx=>`<circle cx="${wx}" cy="-46" r="50" fill="#22252F" stroke="${INK}" stroke-width="8"/><circle cx="${wx}" cy="-46" r="20" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/>`).join('')}</g>`;}
const s20_lorryAt=(X,s,g,o={})=>s20_lorry(X,s20_hy(X),s,s20_lrot(X),g,o);
function s20_car(x,y,s,col,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-170 -40 V-90 Q-160 -110 -120 -114 L-80 -170 H70 L120 -114 Q170 -108 176 -80 V-40Z" fill="${col}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
   <path d="M-66 -156 H-4 V-114 H-100Z M10 -156 H62 L100 -114 H10Z" fill="#CFEAFF" stroke="${INK}" stroke-width="6"/>${[-110,110].map(w=>`<circle cx="${w}" cy="-36" r="34" fill="#22252F" stroke="${INK}" stroke-width="7"/><circle cx="${w}" cy="-36" r="12" fill="#9AA7BD"/>`).join('')}</g>`;}
function s20_barrier(x,y,w=200){let st='';for(let i=0;i<w/40;i++)st+=`<rect x="${-w/2+i*40}" y="-90" width="20" height="34" fill="${P.red}"/>`;
  return `<g transform="translate(${x},${y})"><path d="M${-w/2+16} -56 V0 M${w/2-16} -56 V0" stroke="${INK}" stroke-width="12"/><rect x="${-w/2}" y="-90" width="${w}" height="34" fill="#fff" stroke="${INK}" stroke-width="6"/>${st}<rect x="${-w/2}" y="-90" width="${w}" height="34" fill="none" stroke="${INK}" stroke-width="6"/><circle cx="${w/2-20}" cy="-104" r="13" fill="#FFB13B" stroke="${INK}" stroke-width="4"/></g>`;}
function s20_stones(x0,x1,ytop,ybot,n,seed,op=1){const r=rng(seed);let s='';const C=['#B8AE9C','#9A8F80','#CFC6B4','#857A6C'];
  for(let i=0;i<n;i++){const x=x0+r()*(x1-x0),y=ytop(x)+r()*(ybot(x)-ytop(x));if(y>=ybot(x)-2)continue;s+=`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(5+r()*7).toFixed(0)}" ry="${(4+r()*5).toFixed(0)}" fill="${C[i%4]}" stroke="${INK}" stroke-width="2" opacity="${op}"/>`;}return s;}
function s20_heap(x,y,w,h,k=1,glow=0,g=0){if(k<=0)return '';const H=h*k,W=w*(.55+.45*k);const top=xx=>y-H*Math.max(0,1-Math.pow((xx-x)/(W/2),2));
  return `${glow?`<ellipse cx="${x}" cy="${y-H*.4}" rx="${W*.8}" ry="${H*.9}" fill="url(#gGold)" opacity="${(glow*(.6+.3*Math.sin(g*4))).toFixed(2)}"/>`:''}<path d="M${x-W/2} ${y} Q${x} ${y-H*2} ${x+W/2} ${y}Z" fill="#9A8F80" stroke="${INK}" stroke-width="8"/>${s20_stones(x-W/2+10,x+W/2-10,xx=>top(xx)+6,()=>y,Math.round(70*k),5)}`;}
function s20_beacon(x,y,g,frozen=1){const on=frozen?.8:(Math.sin(g*4)>0?1:.35);return `<g transform="translate(${x},${y})"><rect x="-8" y="-240" width="16" height="240" fill="#fff" stroke="${INK}" stroke-width="5"/>${[0,1,2,3,4,5].map(i=>`<rect x="-8" y="${-240+i*40}" width="16" height="20" fill="${INK}"/>`).join('')}<circle cy="-262" r="60" fill="url(#gWarm)" opacity="${on*.6}"/><circle cy="-262" r="28" fill="#FFA43B" stroke="${INK}" stroke-width="6" opacity="${.5+.5*on}"/></g>`;}
// Hill Street, side view. bed 0..1 = gravel bed built across the lane
function s20_street(g,o={}){const {frozen=1,rain=1,heap=1,heapGlow=0,bed=0,cars=1,tint=1,beacons=1,rails=1}=o;
  let s=`${s20_DEFS}<rect width="1920" height="1080" fill="url(#s20sky)"/>`;
  s+=[[260,110],[900,70],[1560,130]].map(([x,y],i)=>`<g opacity=".6"><ellipse cx="${x}" cy="${y}" rx="280" ry="64" fill="#4C587C"/><ellipse cx="${x+90}" cy="${y-30}" rx="170" ry="58" fill="#56628A"/></g>`).join('');
  const r=rng(23);let far='',xx=-40;while(xx<1960){const w=80+r()*120,h=120+r()*220;far+=`<rect x="${xx.toFixed(0)}" y="${(520-h).toFixed(0)}" width="${w.toFixed(0)}" height="${(h+400).toFixed(0)}" fill="#4A5578"/>`;xx+=w+6;}
  s+=far;
  const HC=['#8A5A50','#6A5E80','#5E7088','#86704C','#7A5068'];let hs='';
  for(let i=0;i<11;i++){const x0=-90+i*190,b=s20_hy(x0+95)-64,h=250;const c=HC[i%5];
    hs+=`<rect x="${x0}" y="${b-h}" width="190" height="${h+40}" fill="${c}" stroke="${INK}" stroke-width="6"/><path d="M${x0-6} ${b-h} L${x0+40} ${b-h-60} H${x0+150} L${x0+196} ${b-h}Z" fill="#3A3448" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
     <rect x="${x0+24}" y="${b-h+40}" width="54" height="64" fill="#FFD98E" opacity=".75" stroke="${INK}" stroke-width="5"/><rect x="${x0+112}" y="${b-h+40}" width="54" height="64" fill="#FFD98E" opacity="${i%3?.75:.25}" stroke="${INK}" stroke-width="5"/>
     <rect x="${x0+24}" y="${b-h+140}" width="54" height="64" fill="#FFD98E" opacity="${i%2?.25:.7}" stroke="${INK}" stroke-width="5"/><rect x="${x0+116}" y="${b-h+130}" width="46" height="${h-90}" fill="#2A2238" stroke="${INK}" stroke-width="5"/>`;}
  s+=hs;
  const TOP=`M-40 ${s20_hy(-40)} L1180 830 L1960 830`;const off=(d)=>`M-40 ${s20_hy(-40)+d} L1180 ${830+d} L1960 ${830+d}`;
  s+=`<path d="${off(-34)} V${s20_hy(-40)-64} Z" fill="none"/><path d="M-40 ${s20_hy(-40)-64} L1180 766 L1960 766 L1960 796 L1180 796 L-40 ${s20_hy(-40)-34}Z" fill="#5A5E74" stroke="${INK}" stroke-width="5"/>`;
  if(cars) s+=`${s20_car(170,s20_hy(170)-40,.55,'#E0A040',s20_ANG)}${s20_car(640,s20_hy(640)-40,.55,'#5AB8A0',s20_ANG)}`;
  if(rails){let rl='';for(let x=840;x<=1160;x+=34){const b=s20_hy(x)-38;rl+=`<path d="M${x} ${b} V${b-70}" stroke="${INK}" stroke-width="6"/>`;}rl+=`<path d="M840 ${s20_hy(840)-108} L1160 ${s20_hy(1160)-108} M840 ${s20_hy(840)-74} L1160 ${s20_hy(1160)-74}" stroke="${INK}" stroke-width="8"/>`;s+=rl;}
  s+=`<g transform="translate(0,0)">${s20_heap(1330,770,300,250,heap,heapGlow,g)}${heap>0?s20_barrier(1330,790,250):''}</g>`;
  s+=`<path d="M-40 ${s20_hy(-40)-34} L1180 796 L1960 796 V864 L1180 864 L-40 ${s20_hy(-40)+34}Z" fill="#30344A"/>`;
  // ice sheen on the slope
  for(let i=0;i<9;i++){const x=60+i*120,y=s20_hy(x)-6;s+=`<ellipse cx="${x}" cy="${y.toFixed(0)}" rx="${70+(i%3)*20}" ry="9" fill="#CFEFFF" opacity="${(.35+.2*Math.sin(g*2+i)).toFixed(2)}" transform="rotate(${s20_ANG} ${x} ${y.toFixed(0)})"/>`;}
  // zebra crossing + pavement
  for(let x=1440;x<1680;x+=60)s+=`<rect x="${x}" y="797" width="34" height="66" fill="#F4F2EC" opacity=".92"/>`;
  s+=`<path d="M1720 790 H1960 V864 H1720Z" fill="#7A8096" stroke="${INK}" stroke-width="6"/><path d="${TOP}" stroke="#8A93A8" stroke-width="5" fill="none" opacity=".5"/>`;
  s+=`<path d="M-40 ${s20_hy(-40)+34} L1180 864 L1960 864 V1080 H-40Z" fill="#1A1C2A"/>`;
  if(bed>0){const x1=1420,x0=lerp(1420,820,bed),top=x=>s20_hy(x)-8-34*Math.min(1,(x-x0)/60,(x1-x)/40);let d=`M${x0} ${s20_hy(x0)+20}`;for(let x=x0;x<=x1;x+=10)d+=` L${x} ${top(x).toFixed(1)}`;d+=` L${x1} ${s20_hy(x1)+20}Z`;
    s+=`<path d="${d}" fill="#9A8F80" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>${s20_stones(x0+6,x1-6,x=>top(x)+4,x=>s20_hy(x)+18,Math.round(140*bed),9)}`;}
  if(beacons)s+=`${s20_beacon(1420,830,g,frozen)}${s20_beacon(1700,830,g,frozen)}`;
  return s;}
function s20_streetFx(g,o={}){const {frozen=1,rain=1,tint=1}=o;return `${rain?s20_rain(g,{frozen,n:110,seed:7}):''}${frozen&&tint?`<rect width="1920" height="1080" fill="#9CC8FF" opacity=".08"/>`:''}`;}
// inset top-down map: lorry lane, crossing, gravel bed curving away (k 0..1)
function s20_map(x,y,s,k,g,o={}){const {steer=0}=o;const L=`M90 -150 Q100 -20 90 140`;const B=`M84 -10 Q70 70 -40 110 Q-110 130 -150 150`;
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-210" y="-190" width="420" height="380" rx="20" fill="#0B1026" fill-opacity=".9" stroke="${P.gold}" stroke-width="7"/>
   <path d="${L}" stroke="#4A4E62" stroke-width="70" fill="none"/>${[0,1,2,3].map(i=>`<rect x="55" y="${90+i*14}" width="70" height="7" fill="#fff"/>`).join('')}
   <path d="${B}" stroke="#9A8F80" stroke-width="44" fill="none" stroke-linecap="round" stroke-dasharray="${(400*k).toFixed(0)} 999"/>
   <rect x="72" y="-170" width="36" height="64" rx="6" fill="#ECE6DA" stroke="${INK}" stroke-width="4"/><rect x="74" y="-112" width="32" height="18" fill="#4A7BD8"/>
   ${steer?`<path d="M90 -80 Q90 0 60 50 Q20 100 -60 120" stroke="${P.mint}" stroke-width="8" fill="none" stroke-dasharray="14 10" opacity="${steer}"/>`:''}
   <circle cx="90" cy="112" r="14" fill="#B58BD6" stroke="${INK}" stroke-width="4"/>
   <text x="-190" y="-150" font-size="30" font-weight="900" fill="${P.gold}">TOP VIEW</text><text x="-60" y="175" text-anchor="middle" font-size="26" font-weight="900" fill="#CFC6B4">GRAVEL BED</text></g>`;}
// museum clock hall; ang = pendulum angle (deg)
function s20_bolt(x,y,s,op=1){return `<g transform="translate(${x},${y}) scale(${s})" opacity="${op}"><path d="M0 0 L-40 150 L10 140 L-50 320 L80 110 L20 120 L60 0Z" fill="#FFF8D0" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/></g>`;}
function s20_pend(x,y,L,ang,o={}){const {glow=0,trail=0}=o;let tr='';if(trail)for(let i=1;i<=4;i++)tr+=`<g transform="rotate(${ang-trail*i*1.5} ${x} ${y})" opacity="${(.18/i).toFixed(2)}"><circle cx="${x}" cy="${y+L}" r="96" fill="${P.gold}"/></g>`;
  return `${tr}<g transform="rotate(${ang.toFixed(2)} ${x} ${y})"><rect x="${x-9}" y="${y}" width="18" height="${L}" fill="#B8862E" stroke="${INK}" stroke-width="6"/>${glow?`<circle cx="${x}" cy="${y+L}" r="190" fill="url(#gGold)" opacity="${glow}"/>`:''}<ellipse cx="${x}" cy="${y+L}" rx="92" ry="112" fill="#D9A441" stroke="${INK}" stroke-width="10"/><ellipse cx="${x-26}" cy="${y+L-36}" rx="24" ry="34" fill="#FFE7A8" opacity=".7"/></g><circle cx="${x}" cy="${y}" r="16" fill="${INK}"/>`;}
function s20_win(x,y,w,h,g,o={}){const {flash=0,frozen=0,rain=1,drop=0}=o;
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w/2}" fill="${flash>0?'#D8E4FF':'#0B1236'}" stroke="#2E2856" stroke-width="18"/>
   <clipPath id="s20wc${x}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w/2}"/></clipPath><g clip-path="url(#s20wc${x})">${rain?s20_rain(g,{frozen,n:26,seed:3,x0:x,w,y1:y+h,op:.8}):''}${flash>0?s20_bolt(x+w*.45,y+30,.9,flash):''}</g>
   <path d="M${x+w/2} ${y} V${y+h} M${x} ${y+h*.55} H${x+w}" stroke="#2E2856" stroke-width="10"/></g>`;}
function s20_hall(g,o={}){const {lights=1,flash=0,ang=0,hum=0,frozen=0,glow=0,trail=0,ladder=1}=o;
  let s=`${s20_DEFS}<rect width="1920" height="1080" fill="#16112E"/><rect y="860" width="1920" height="220" fill="#221A3C"/><path d="M0 860 H1920" stroke="${INK}" stroke-width="6"/>`;
  [640,1720].forEach(x=>s+=`<rect x="${x-46}" y="0" width="92" height="860" fill="#221C46" stroke="${INK}" stroke-width="6"/>`);
  s+=s20_win(110,150,380,560,g,{flash,frozen});
  // brass gears behind the clock
  const gear=(cx,cy,R,rot)=>{let d='';for(let i=0;i<12;i++){const a=i*30+rot;d+=`<rect x="${-14}" y="${-R-22}" width="28" height="30" fill="#8A6A2A" stroke="${INK}" stroke-width="4" transform="rotate(${a.toFixed(1)})"/>`;}return `<g transform="translate(${cx},${cy})">${d}<circle r="${R}" fill="#8A6A2A" stroke="${INK}" stroke-width="6"/><circle r="${R*.35}" fill="#5A4418" stroke="${INK}" stroke-width="4"/></g>`;};
  const sp=frozen?.0:1;s+=gear(900,210,80,g*30*sp*lights)+gear(1460,190,100,-g*24*sp*lights)+gear(1520,420,60,g*40*sp*lights);
  s+=`<rect x="980" y="40" width="400" height="430" rx="24" fill="#3A2A1A" stroke="${INK}" stroke-width="9"/><circle cx="1180" cy="230" r="170" fill="#FFF6E0" stroke="#D9A441" stroke-width="18"/><circle cx="1180" cy="230" r="170" fill="none" stroke="${INK}" stroke-width="6"/>
   ${[...Array(12)].map((_,i)=>`<path d="M1180 76 V102" stroke="${INK}" stroke-width="8" transform="rotate(${i*30} 1180 230)"/>`).join('')}<path d="M1180 230 V130" stroke="${INK}" stroke-width="12" stroke-linecap="round" transform="rotate(92 1180 230)"/><path d="M1180 230 V110" stroke="${INK}" stroke-width="9" stroke-linecap="round" transform="rotate(0 1180 230)"/><circle cx="1180" cy="230" r="14" fill="${INK}"/>
   <rect x="1030" y="470" width="300" height="20" fill="#3A2A1A" stroke="${INK}" stroke-width="6"/>`;
  s+=s20_pend(1180,480,250,ang,{glow,trail});
  if(hum>0){[`M1180 480 V720`,`M1180 470 Q1040 420 935 470`].forEach((d,i)=>s+=`<path d="${d}" stroke="${P.gold}" stroke-width="12" fill="none" stroke-dasharray="30 40" stroke-dashoffset="${(-g*500).toFixed(0)}" opacity="${hum}" stroke-linecap="round"/>`);}
  if(ladder)s+=`<g><path d="M800 860 L900 330 M900 860 L990 330" stroke="${INK}" stroke-width="22"/><path d="M800 860 L900 330 M900 860 L990 330" stroke="#B88A5A" stroke-width="12"/>${[0,1,2,3,4,5,6,7].map(i=>{const k=i/8+.06;return `<path d="M${lerp(800,900,k)} ${lerp(860,330,k)} L${lerp(900,990,k)} ${lerp(860,330,k)}" stroke="${INK}" stroke-width="14"/><path d="M${lerp(800,900,k)} ${lerp(860,330,k)} L${lerp(900,990,k)} ${lerp(860,330,k)}" stroke="#B88A5A" stroke-width="7"/>`;}).join('')}</g>`;
  s+=`<rect width="1920" height="1080" fill="#03020A" opacity="${(1-lights)*.62}"/>`;
  return s;}
function s20_oil(x,y,s,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-30 0 H30 L24 -50 H-24Z" fill="#9AA7BD" stroke="${INK}" stroke-width="6"/><path d="M20 -40 L80 -76" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M20 -40 L80 -76" stroke="#C9D3E3" stroke-width="5" stroke-linecap="round"/></g>`;}
// kitchen (morning)
function s20_kettle(x,y,s,g,o={}){const {steam=0,click=0}=o;return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-70 0 Q-80 -110 -50 -130 H50 Q80 -110 70 0Z" fill="#E8EEF5" stroke="${INK}" stroke-width="8"/><path d="M70 -100 Q120 -90 110 -40 Q100 -10 70 -20" stroke="${INK}" stroke-width="14" fill="none"/><path d="M-70 -90 L-120 -120 L-110 -100Z" fill="#E8EEF5" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
   <rect x="-30" y="-150" width="60" height="22" rx="8" fill="${INK}"/><circle cx="40" cy="-30" r="9" fill="${click?'#555':P.red}" stroke="${INK}" stroke-width="3"/><rect x="-80" y="0" width="160" height="16" rx="6" fill="#3A3F52" stroke="${INK}" stroke-width="5"/>
   ${steam?[0,1,2].map(i=>{const k=((g*.8+i/3)%1);return `<circle cx="${-115+Math.sin(g*3+i)*10}" cy="${-130-k*120}" r="${14+k*26}" fill="#fff" opacity="${(steam*(1-k)*.6).toFixed(2)}"/>`;}).join(''):''}</g>`;}
function s20_kitchen(g,o={}){const {oven=0,drip=1,kettle=1,steam=0,click=0,clock=8}=o;
  let s=`${s20_DEFS}<rect width="1920" height="1080" fill="url(#s20kit)"/><rect x="160" y="140" width="420" height="320" fill="#9AD8FF" stroke="#E8E2D6" stroke-width="18"/><circle cx="480" cy="230" r="46" fill="${P.gold}"/><path d="M370 140 V460 M160 300 H580" stroke="#E8E2D6" stroke-width="10"/>`;
  s+=`<rect y="500" width="1920" height="120" fill="#E8E2D6" opacity=".25"/>${[...Array(24)].map((_,i)=>`<path d="M${i*80} 500 V620" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>`).join('')}`;
  s+=`<rect x="0" y="620" width="1920" height="30" fill="#C9A46A" stroke="${INK}" stroke-width="7"/><rect x="0" y="650" width="1920" height="210" fill="#4A6A9A" stroke="${INK}" stroke-width="6"/>${[0,1,2,3,4,5].map(i=>`<rect x="${40+i*230}" y="670" width="200" height="170" rx="10" fill="#557AAD" stroke="${INK}" stroke-width="5"/><rect x="${125+i*230}" y="690" width="30" height="10" rx="5" fill="${INK}"/>`).join('')}`;
  s+=`<rect x="1440" y="660" width="300" height="200" rx="12" fill="#2A2E3A" stroke="${INK}" stroke-width="7"/><rect x="1470" y="700" width="240" height="130" rx="10" fill="${oven?'#FF9F43':'#14161E'}" stroke="${INK}" stroke-width="6" opacity="${oven?.6+.3*Math.sin(g*3):1}"/>${oven?`<circle cx="1590" cy="760" r="160" fill="url(#gWarm)" opacity=".45"/>`:''}`;
  s+=`<rect x="860" y="600" width="220" height="24" rx="8" fill="#9AA7BD" stroke="${INK}" stroke-width="6"/><path d="M930 600 V530 Q930 500 970 500 H1000 V520" stroke="${INK}" stroke-width="18" fill="none"/><path d="M930 600 V530 Q930 500 970 500 H1000 V520" stroke="#C9D3E3" stroke-width="9" fill="none"/>${drip?`<path d="M1000 ${528+((g*90)%80)} q6 10 0 14 q-6 -4 0 -14Z" fill="#9AD1FF" stroke="${INK}" stroke-width="2"/>`:''}`;
  s+=`<rect x="0" y="860" width="1920" height="220" fill="#3A2C40"/><path d="M0 860 H1920" stroke="${INK}" stroke-width="6"/>`;
  s+=`<g transform="translate(1250,250)"><circle r="76" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><path d="M0 0 V-46" stroke="${INK}" stroke-width="9" stroke-linecap="round" transform="rotate(${(clock*30)%360})"/><path d="M0 0 V-62" stroke="${P.red}" stroke-width="6" stroke-linecap="round" transform="rotate(${(clock*360)%360})"/></g>`;
  if(kettle)s+=s20_kettle(560,620,.9,g,{steam,click});
  return s;}
function s20_glass(x,y,s,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-34 -110 H34 L26 0 H-26Z" fill="#CFEAFF" fill-opacity=".75" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-20 -96 L-16 -14" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".85"/><path d="M-30 -60 H30" stroke="#9AD1FF" stroke-width="5" opacity=".7"/></g>`;}
function s20_sand(x,y,s=1,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-70 30 L0 -50 L70 30Z" fill="#F4DCA0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-62 30 H62" stroke="#7BC46B" stroke-width="10"/><path d="M-58 40 H58" stroke="#FF8FA3" stroke-width="10"/><path d="M-70 48 H70 L66 58 H-66Z" fill="#F4DCA0" stroke="${INK}" stroke-width="6"/></g>`;}
function s20_fuel(x,y,s,v,g,o={}){const {label='FUEL'}=o;const ap=(R,a0,a1)=>{const p=a=>[Math.sin(a*Math.PI/180)*R,-Math.cos(a*Math.PI/180)*R];const [x0,y0]=p(a0),[x1,y1]=p(a1);return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;};
  const a=-75+150*clamp(v),low=v<.22,fl=low&&Math.sin(g*10)>0;
  return `<g transform="translate(${x},${y}) scale(${s})"><circle r="150" fill="#0B1026" stroke="${fl?P.red:INK}" stroke-width="10"/>${low?`<circle r="190" fill="url(#gRed)" opacity="${fl?.7:.25}"/>`:''}
   <path d="${ap(110,-75,-40)}" stroke="${P.red}" stroke-width="24" fill="none"/><path d="${ap(110,-38,20)}" stroke="${P.gold}" stroke-width="24" fill="none"/><path d="${ap(110,22,75)}" stroke="${P.mint}" stroke-width="24" fill="none"/>
   <text x="-96" y="10" font-size="40" font-weight="900" fill="${P.red}">E</text><text x="72" y="10" font-size="40" font-weight="900" fill="${P.mint}">F</text>
   <path d="M0 0 L0 -112" stroke="#fff" stroke-width="10" stroke-linecap="round" transform="rotate(${a.toFixed(1)})"/><circle r="16" fill="#fff" stroke="${INK}" stroke-width="5"/>
   <text y="92" text-anchor="middle" font-size="38" font-weight="900" fill="#fff" letter-spacing="3">${label}</text></g>`;}
function s20_growl(x,y,g,a=1){if(a<=0)return '';let o='';for(let i=0;i<3;i++){const k=((g*1.4+i/3)%1);o+=`<path d="M${x-50-k*80} ${y-30-k*30} q${-20} ${30+k*20} 0 ${60+k*40} M${x+50+k*80} ${y-30-k*30} q20 ${30+k*20} 0 ${60+k*40}" stroke="${P.gold}" stroke-width="8" fill="none" stroke-linecap="round" opacity="${(a*(1-k)).toFixed(2)}"/>`;}return o;}
function s20_wave(x0,y,w,amp,cyc,g,o={}){const {col=P.mint,sw=10,speed=4,op=1}=o;let d='';const n=160;for(let i=0;i<=n;i++){const xx=x0+w*i/n,yy=y+Math.sin(i/n*cyc*6.283-g*speed)*amp;d+=(i?'L':'M')+xx.toFixed(1)+' '+yy.toFixed(1);}return `<path d="${d}" stroke="${col}" stroke-width="${sw}" fill="none" stroke-linecap="round" opacity="${op}"/>`;}
function s20_mute(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><circle r="110" fill="#0B1026" stroke="${P.red}" stroke-width="10"/><path d="M-60 -24 H-26 L16 -62 V62 L-26 24 H-60Z" fill="#FFF6EA" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M34 -30 L84 30 M84 -30 L34 30" stroke="${P.red}" stroke-width="14" stroke-linecap="round"/></g>`;}
function s20_ear(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-40 60 Q-70 -10 -40 -60 Q0 -100 40 -60 Q70 -20 30 20 Q10 40 10 70 Q0 100 -30 90" fill="#F2C9A0" stroke="${INK}" stroke-width="8"/><path d="M-14 -30 Q20 -50 26 -14 Q22 6 4 14" stroke="${INK}" stroke-width="6" fill="none"/></g>`;}
function s20_switch(x,y,s,on,lab){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-110" y="-160" width="220" height="320" rx="26" fill="#FFF6EA" stroke="${INK}" stroke-width="9"/><rect x="-46" y="-96" width="92" height="192" rx="20" fill="#C9C2B8" stroke="${INK}" stroke-width="7"/>
   <rect x="-36" y="${on?-88:8}" width="72" height="80" rx="14" fill="${on?P.mint:P.red}" stroke="${INK}" stroke-width="7"/><text y="${on?-118:140}" text-anchor="middle" font-size="40" font-weight="900" fill="${on?P.mintDark:P.red}">${on?'ON':'OFF'}</text>${lab?`<g transform="translate(0,230)">${labelPill(0,0,lab,P.gold,38)}</g>`:''}</g>`;}
function s20_bee(x,y,s,g,o={}){const {blur=1,wing=0}=o;let w='';
  if(blur){for(let i=0;i<7;i++){const a=-60+i*20;w+=`<ellipse cx="0" cy="-60" rx="34" ry="70" fill="#E6F6FF" opacity=".16" transform="rotate(${a} 0 0)"/>`;}w+=`<ellipse cx="0" cy="-40" rx="120" ry="70" fill="#E6F6FF" opacity=".2" filter="url(#s20blur)"/>`;}
  else{[-1,1].forEach(sd=>w+=`<g transform="rotate(${(sd*(20+wing*55)).toFixed(1)} 0 -10)"><ellipse cx="${sd*10}" cy="-80" rx="34" ry="78" fill="#E6F6FF" fill-opacity=".8" stroke="${INK}" stroke-width="6"/><path d="M${sd*10} -20 L${sd*10} -140 M${sd*10} -70 L${sd*30} -110" stroke="#9AB8D8" stroke-width="3"/></g>`);}
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="40" rx="110" ry="72" fill="${P.gold}" stroke="${INK}" stroke-width="8"/><path d="M-50 -20 Q-60 40 -50 104 M0 -30 V112 M50 -20 Q60 40 50 104" stroke="${INK}" stroke-width="20" fill="none"/>
   <path d="M110 40 L150 46 L110 56Z" fill="${INK}"/><circle cx="-110" cy="20" r="56" fill="#3A2A1A" stroke="${INK}" stroke-width="7"/><circle cx="-124" cy="8" r="14" fill="#fff"/><circle cx="-128" cy="8" r="7" fill="${INK}"/><path d="M-130 -30 Q-150 -80 -170 -84 M-110 -32 Q-110 -80 -94 -92" stroke="${INK}" stroke-width="6" fill="none"/>${w}</g>`;}
function s20_lav(x,y,s,g){let o='';for(let i=0;i<7;i++){const dx=-60+i*20,h=120+((i*37)%50),sw=Math.sin(g*1.5+i+x)*6;o+=`<path d="M${dx} 0 Q${dx+sw} ${-h/2} ${dx+sw*1.5} ${-h}" stroke="#4A8A4A" stroke-width="6" fill="none"/>${[0,1,2,3].map(k=>`<ellipse cx="${(dx+sw*1.5-k*0).toFixed(1)}" cy="${-h+k*16}" rx="10" ry="14" fill="${k%2?'#9A6AD8':'#B48AE8'}" stroke="${INK}" stroke-width="3"/>`).join('')}`;}return `<g transform="translate(${x},${y}) scale(${s})">${o}</g>`;}
function s20_shards(x,y,k,seed=3,n=12){if(k<=0)return '';const r=rng(seed);let o='';for(let i=0;i<n;i++){const a=-Math.PI*(.1+r()*.8),d=(80+r()*300)*k;o+=`<path d="M0 0 l${(14+r()*22).toFixed(0)} ${(-6-r()*12).toFixed(0)} l${(-4+r()*10).toFixed(0)} ${(16+r()*14).toFixed(0)}Z" fill="#CFEAFF" stroke="${INK}" stroke-width="3" transform="translate(${(x+Math.cos(a)*d).toFixed(0)},${(y+Math.sin(a)*d+k*k*180).toFixed(0)}) rotate(${(k*400*r()).toFixed(0)})" opacity="${(1-k*.4).toFixed(2)}"/>`;}return o;}
function s20_park(g,o={}){const {shat=0,flash=0}=o;const r=rng(51);let st='';for(let i=0;i<70;i++)st+=`<circle cx="${(r()*1920).toFixed(0)}" cy="${(r()*480).toFixed(0)}" r="${(1+r()*2).toFixed(1)}" fill="#fff" opacity="${(.3+.5*Math.abs(Math.sin(g+i))).toFixed(2)}"/>`;
  let s=`${s20_DEFS}<rect width="1920" height="1080" fill="url(#sky)"/>${st}<circle cx="420" cy="170" r="54" fill="#fff4dc"/><circle cx="420" cy="170" r="170" fill="url(#moon)" opacity=".5"/>
   <rect y="700" width="1920" height="380" fill="#2A2838"/><path d="M0 700 H1920" stroke="${INK}" stroke-width="6"/>${[0,1,2,3,4,5,6,7].map(i=>`<path d="M${80+i*170} 720 L${20+i*170} 860" stroke="#E8E2D6" stroke-width="7" opacity=".55"/>`).join('')}
   <path d="M210 700 V250 H290" stroke="${INK}" stroke-width="18" fill="none"/><path d="M210 700 V250 H290" stroke="#5D6A82" stroke-width="9" fill="none"/><path d="M270 250 H330 L310 270 H290Z" fill="#FFE9A8" stroke="${INK}" stroke-width="5"/><path d="M290 270 L180 700 H440Z" fill="#FFE9A8" opacity=".12"/>`;
  s+=`<rect x="1240" y="250" width="640" height="460" fill="#3A5A7A" stroke="${INK}" stroke-width="9"/><rect x="1300" y="280" width="520" height="100" rx="14" fill="#1A1430" stroke="${INK}" stroke-width="7"/><circle cx="1560" cy="330" r="220" fill="url(#gGold)" opacity=".35"/><text x="1560" y="358" text-anchor="middle" font-size="84" font-weight="900" fill="${P.gold}" letter-spacing="10">CHIPS</text>`;
  [[1290,420],[1490,420],[1690,420]].forEach(([x,y],i)=>{s+=`<rect x="${x}" y="${y}" width="170" height="${i===1?280:200}" fill="${i===1?'#5A3A2A':'#FFD98E'}" opacity="${i===1?1:shat?.25:.85}" stroke="${INK}" stroke-width="8"/>`;if(shat&&i!==1)s+=`<path d="M${x} ${y} L${x+60} ${y+90} L${x+20} ${y+200} M${x+170} ${y} L${x+100} ${y+80} L${x+150} ${y+200} M${x+60} ${y+90} L${x+100} ${y+80}" stroke="#CFEAFF" stroke-width="6" fill="none"/>${s20_shards(x+85,y+100,shat,i*7+2,14)}`;});
  s+=`<rect y="860" width="1920" height="220" fill="#1A1826"/>`;
  return s+(flash>0?`<rect width="1920" height="1080" fill="#fff" opacity="${flash.toFixed(2)}"/>`:'');}
function s20_dino(x,y,s){const b='#F4EAD4';const bone=d=>`<path d="${d}" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${b}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${bone('M-420 -60 Q-200 -240 60 -220 Q200 -210 260 -260')}${[...Array(8)].map((_,i)=>bone(`M${-180+i*36} ${-215+Math.abs(i-3)*6} q-10 70 10 110`)).join('')}
   ${bone('M-60 -180 L-90 -40 L-40 120')}${bone('M80 -200 L70 -60 L120 120')}${bone('M230 -250 L250 -180')}<path d="M240 -300 Q330 -330 380 -270 Q380 -230 320 -226 L250 -230Z" fill="${b}" stroke="${INK}" stroke-width="9"/><circle cx="300" cy="-282" r="12" fill="${INK}"/><path d="M260 -240 l10 12 l10 -12 l10 12 l10 -12 l10 12" stroke="${INK}" stroke-width="4" fill="none"/>
   <rect x="-460" y="120" width="900" height="40" rx="10" fill="#4A3A5A" stroke="${INK}" stroke-width="7"/></g>`;}
function s20_walker(x,y,s,ph,o={}){const {head='#F2C9A0',top='#5A8AD8',umb='#FF5E5B'}=o;const lg=Math.sin(ph)*26,ar=Math.sin(ph)*22;const L=d=>`<path d="${d}" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#3B4A78" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${L(`M0 170 Q${-10-lg} 230 ${-30-lg} 300`)}${L(`M0 170 Q${10+lg} 230 ${30+lg} 300`)}<path d="M-46 30 Q0 20 46 30 L52 175 Q0 186 -52 175Z" fill="${top}" stroke="${INK}" stroke-width="8"/>
   <path d="M30 50 Q70 20 60 -150" stroke="${INK}" stroke-width="8" fill="none"/><path d="M-120 -140 Q60 -300 240 -140Z" fill="${umb}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   <path d="M-30 50 Q${-60-ar} 100 ${-50-ar} 150" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-30 50 Q${-60-ar} 100 ${-50-ar} 150" stroke="${top}" stroke-width="12" fill="none" stroke-linecap="round"/>
   <circle cy="-50" r="72" fill="${head}" stroke="${INK}" stroke-width="8"/><circle cx="-22" cy="-56" r="8" fill="${INK}"/><circle cx="24" cy="-56" r="8" fill="${INK}"/><path d="M-14 -20 H14" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>`;}
function s20_steps(g,o={}){const {frozen=0}=o;let s=`${s20_DEFS}<rect width="1920" height="1080" fill="url(#s20sky)"/><rect x="200" y="120" width="1520" height="600" fill="#8A8FA8" stroke="${INK}" stroke-width="8"/><path d="M160 130 L960 -20 L1760 130Z" fill="#9AA0B8" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   <rect x="520" y="140" width="880" height="70" rx="10" fill="#3A3F52" stroke="${INK}" stroke-width="6"/><text x="960" y="192" text-anchor="middle" font-size="46" font-weight="900" fill="${P.gold}" letter-spacing="6">CITY SCIENCE MUSEUM</text>`;
  [300,520,740,1180,1400,1620].forEach(x=>s+=`<rect x="${x-40}" y="230" width="80" height="490" fill="#C9CCDA" stroke="${INK}" stroke-width="7"/>`);
  s+=`<rect x="860" y="380" width="200" height="340" rx="8" fill="#2A2238" stroke="${INK}" stroke-width="7"/>`;
  for(let i=0;i<4;i++)s+=`<rect x="${120-i*30}" y="${720+i*40}" width="${1680+i*60}" height="40" fill="${['#B8BCCC','#A8ACBE','#989CB0','#888CA2'][i]}" stroke="${INK}" stroke-width="5"/>`;
  s+=`<rect y="880" width="1920" height="200" fill="#3A3E52"/>`;return s;}
function s20_poster(x,y,s,g){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-260" y="-330" width="520" height="660" rx="10" fill="#FFF6EA" stroke="${INK}" stroke-width="10"/><rect x="-230" y="-300" width="460" height="110" fill="${P.gold}" stroke="${INK}" stroke-width="6"/>
   <text y="-256" text-anchor="middle" font-size="50" font-weight="900" fill="${INK}">RUNAWAY</text><text y="-206" text-anchor="middle" font-size="50" font-weight="900" fill="${INK}">LORRY RAMPS</text>
   <path d="M-230 160 L-60 -60 L80 -150 L230 -170 V230 H-230Z" fill="#B8C4D8" stroke="${INK}" stroke-width="6"/><path d="M-230 200 L230 -120" stroke="#3A3F52" stroke-width="30"/><path d="M40 -20 L200 -80" stroke="#9A8F80" stroke-width="34"/>${s20_stones(40,200,xx=>-20-(xx-40)*.375-14,xx=>-20-(xx-40)*.375+14,30,4)}
   <text y="300" text-anchor="middle" font-size="36" font-weight="900" fill="#5A5060">TRANSPORT GALLERY</text></g>`;}
function s20_frame(x,y,s,inner,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-170" y="-210" width="340" height="420" rx="10" fill="#C9A46A" stroke="${INK}" stroke-width="10"/><rect x="-140" y="-180" width="280" height="360" fill="#E8D8B0" stroke="${INK}" stroke-width="6"/>${inner}</g>`;}
function s20_hero(x,y,s,g){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-40 30 Q-140 200 -100 300 H100 Q140 200 40 30Z" fill="${P.red}" stroke="${INK}" stroke-width="8"/>${extra({x:0,y:0,s:1,t:g,head:'#F2C9A0',pose:'up',mouth:'smile'})}<path d="M-30 80 L30 80 L0 120Z" fill="${P.gold}" stroke="${INK}" stroke-width="5"/></g>`;}
function s20_flicker(t,a,on=1){if(!on)return '';const r=rng(Math.floor(t*14)+9);if(r()>.35)return '';let b='';for(let i=0;i<5;i++)b+=`<rect x="0" y="${(r()*1080).toFixed(0)}" width="1920" height="${(6+r()*30).toFixed(0)}" fill="#fff" opacity=".12"/>`;return `<g opacity="${a}"><rect width="1920" height="1080" fill="#FF4D5E" opacity=".1"/>${b}</g>`;}

Object.assign(SHOTS,{
spdHook(t,d,p,g){
  const X=lerp(300,410,t/d), lo=AT(t,p.lorry??2.3), ice=AT(t,p.ice??5.6), nan=AT(t,p.nan??8.3), pk=AT(t,p.pick??11.7), bn=AT(t,p.buns??13.3), nine=AT(t,p.nine??15.9);
  return `${s20_street(g,{frozen:0})}${s20_lorryAt(X,.72,g)}${s20_nan(1540,630,.72,g,{frozen:0,hiss:pk?1:0,look:1})}${s20_streetFx(g,{frozen:0})}
   ${nan?`<circle cx="1560" cy="680" r="${(190+Math.sin(g*5)*8).toFixed(0)}" fill="none" stroke="${P.gold}" stroke-width="8" stroke-dasharray="20 14"/>${s20_pill(1540,420,'NAN',P.gold,44,pop(t,p.nan??8.3))}`:''}
   ${pk?s20_pill(1740,640,'MR. PICKLES',P.coral,34,pop(t,p.pick??11.7)):''}${bn?s20_pill(1300,620,'CINNAMON BUNS',P.gold,34,pop(t,p.buns??13.3)):''}
   ${lo?s20_pill(X+40,s20_hy(X)+110,'NO BRAKES',P.red,40,pop(t,(p.brakes??5.2))):''}${ice?s20_pill(760,780,'ICY HILL STREET',P.ice,40,pop(t,p.ice??5.6)):''}
   ${T(960,150,'NAN HAS 9 SECONDS',{size:100,fill:P.white,sc:IN(t,.1)})}
   ${nine?`<g transform="translate(960,330) scale(${pop(t,p.nine??15.9)})"><rect x="-190" y="-90" width="380" height="180" rx="22" fill="#120610" fill-opacity=".92" stroke="${P.red}" stroke-width="8"/><text y="-32" text-anchor="middle" font-size="32" font-weight="900" letter-spacing="3" fill="${P.red}">TIME LEFT</text><text y="62" text-anchor="middle" font-size="100" font-weight="900" fill="#fff">9.0 s</text></g>`:''}`;
},
spdSplit(t,d,p,g){
  const hu=AT(t,p.hungry??4.07);
  return `${card('cardDark',g)}${s20_DEFS}${s20_rain(g,{frozen:1,n:70,seed:12})}${s20_split(960,250,.95,'9 s','15 MIN',{g,pulse:1,op:1})}
   ${s20_lines(960,620,g,{dir:-1,len:600,h:320})}${s20_fast({x:960,y:600,s:.85,t:g,mouth:hu?'wavy':'o',brows:hu?'sad':'raised',pose:hu?'cross':'down',sweat:hu?1:0},3,-120)}
   ${hu?`${s20_growl(960,700,g)}<g transform="translate(1520,620) scale(${pop(t,p.hungry??4.07)})">${s20_fuel(0,0,.9,.08,g,{label:'FUEL'})}</g>${T(400,640,'VERY, VERY',{size:70,fill:P.white,sc:pop(t,(p.hungry??4.07)+.3)})}${T(400,740,'HUNGRY',{size:110,fill:P.red,sc:pop(t,(p.hungry??4.07)+.5)})}`
     :`${T(420,640,'FOR GLINT:',{size:66,fill:P.white,sc:IN(t,.6)})}${T(1500,640,'= 15 MINUTES',{size:66,fill:P.gold,sc:IN(t,1.2)})}`}`;
},
spdBack(t,d,p,g){
  const mus=p.museum??2.4;
  if(t<mus){const k=prog(t,.1,mus);const days=['SUN','SAT','FRI','THU','WED','TUE','MON'];const di=Math.min(6,Math.floor(k*7));
    return `${card('cardDark',g)}${[0,1,2].map(i=>`<circle cx="960" cy="560" r="${250+i*50}" fill="none" stroke="${P.ice}" stroke-width="6" stroke-dasharray="30 30" opacity=".35" transform="rotate(${(-g*200*(i+1)).toFixed(0)} 960 560)"/>`).join('')}
     <g transform="translate(960,560)"><rect x="-160" y="-170" width="320" height="340" rx="22" fill="#FFF6EA" stroke="${INK}" stroke-width="10"/><rect x="-160" y="-170" width="320" height="90" rx="22" fill="${P.red}" stroke="${INK}" stroke-width="10"/><text y="-108" text-anchor="middle" font-size="56" font-weight="900" fill="#fff">${days[di]}</text><text y="90" text-anchor="middle" font-size="150" font-weight="900" fill="${INK}">${di===6?'-7':-di}</text></g>
     ${T(960,170,"LET'S GO BACK",{size:110,fill:P.white,sc:IN(t,.05)})}${AT(t,p.week??1.29)?T(960,880,'ONE WEEK EARLIER',{size:70,fill:P.gold,sc:pop(t,p.week??1.29)}):''}`;}
  const st=AT(t,p.storm??5.2), lad=AT(t,p.ladder??7.55), bolt=p.bolt??15.95, die=AT(t,p.die??17.73), hum=AT(t,p.hum??19.22);
  const fl=AT(t,bolt)?Math.max(0,1-(t-bolt)/1.2):0, ang=Math.sin(g*1.6)*16;
  const lights=die?0:1, hm=hum?prog(t,p.hum??19.22,(p.hum??19.22)+1.5):0;
  const title=hum?'SOMETHING HUMS...':die?'THE LIGHTS DIE':fl>0?'LIGHTNING!':lad?'THE GREAT CLOCK':st?'A STORM OUTSIDE':'3 AM: THE MUSEUM';
  const ta=hum?p.hum??19.22:die?p.die??17.73:fl>0?bolt:lad?p.ladder??7.55:st?p.storm??5.2:mus;
  return `${s20_hall(g,{lights:die?.25:1,flash:fl,ang,hum:hm,glow:hm*.6})}
   ${s20_gl({x:945,y:470,s:.6,t:g,pose:'reach',mouth:fl>0||hum?'o':'smile',brows:fl>0||hum?'raised':'calm',look:1,glint:hm})}${s20_oil(1030,465,.8,-10)}
   ${hm?`<circle cx="945" cy="500" r="${(90+Math.sin(g*9)*10).toFixed(0)}" fill="url(#gGold)" opacity="${hm.toFixed(2)}"/>`:''}
   ${lad&&!die?`${s20_pill(1180,940-90,'PENDULUM: SIZE OF A DOOR',P.gold,34,pop(t,p.oil??11))}`:''}
   <rect width="1920" height="1080" fill="#FFF6D0" opacity="${(fl*.55).toFixed(2)}"/>
   ${T(960,150,title,{size:90,fill:fl>0||hum?P.gold:P.white,sc:pop(t,ta)})}`;
},
spdSlow(t,d,p,g){
  const drop=p.drop??8.71, wor=p.world??12.32;
  if(t<drop){const ns=AT(t,p.notst??3.7), mv=AT(t,p.moving??5.0), sl=AT(t,p.slowly??6.07);const ang=12+Math.sin(g*.06)*4;
    return `${s20_hall(g,{lights:.45,ang,frozen:1,trail:.6})}${s20_gl({x:945,y:470,s:.6,t:g,pose:'shrug',mouth:'o',brows:'raised',look:1})}
     ${ns?s20_pill(1500,620,'NOT STOPPED',P.coral,40,pop(t,p.notst??3.7)):''}${mv?s20_pill(1500,720,'MOVING...',P.mint,40,pop(t,p.moving??5)):''}${sl?s20_pill(1500,820,'IMPOSSIBLY SLOWLY',P.gold,40,pop(t,p.slowly??6.07)):''}
     ${T(960,150,'THE PENDULUM HANGS',{size:90,fill:P.white,sc:IN(t,.1)})}`;}
  if(t<wor){const k=prog(t,drop,wor);const bx=lerp(560,1360,k),by=480+Math.sin(g*1.2)*30,wb=1+.06*Math.sin(g*3);
    return `${card('cardIce',g)}${s20_DEFS}<rect x="120" y="150" width="1680" height="680" rx="30" fill="#0B1236" stroke="#2E2856" stroke-width="20"/>${s20_rain(g,{frozen:1,n:40,seed:4,x0:140,w:1640,y1:820})}
     <g transform="translate(${bx.toFixed(0)},${by.toFixed(0)}) scale(${wb.toFixed(3)},${(2-wb).toFixed(3)})"><circle r="120" fill="url(#gIce)" opacity=".5"/><circle r="92" fill="#CFEAFF" fill-opacity=".35" stroke="#fff" stroke-width="6"/><path d="M-50 -40 A60 60 0 0 1 10 -70" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity=".9"/><path d="M-60 30 A70 70 0 0 0 40 60" stroke="#FFB0F0" stroke-width="5" fill="none" opacity=".6"/><path d="M-30 50 A70 70 0 0 0 60 20" stroke="#A0FFE0" stroke-width="5" fill="none" opacity=".6"/></g>
     ${s20_gl({x:1560,y:720,s:.7,t:g,mouth:'o',brows:'raised',look:-1})}${T(960,150,'A RAINDROP DRIFTS BY',{size:90,fill:P.ice,sc:IN(t,drop+.1)})}${T(620,780,'LIKE A SOAP BUBBLE',{size:56,fill:P.white,sc:IN(t,drop+1.2)})}`;}
  const sp=AT(t,p.sped??14.57), hu=AT(t,p.hund??16.31);
  if(!sp) return `${card('cardDark',g)}<g transform="translate(960,520)"><circle r="230" fill="#2A6AB0" stroke="${INK}" stroke-width="10"/><path d="M-120 -120 Q-40 -60 -80 20 Q-20 80 -60 150 M60 -200 Q120 -80 60 0 Q120 60 160 120" stroke="#5AB86A" stroke-width="60" fill="none" stroke-linecap="round"/></g>
    ${clockP(1500,520,130,g*.6)}${T(960,150,"THE WORLD HASN'T SLOWED",{size:84,fill:P.white,sc:IN(t,wor)})}${T(960,860,'SAME SPEED AS ALWAYS',{size:56,fill:P.mint,sc:IN(t,wor+.8)})}`;
  return `${card('cardGold',g)}${s20_DEFS}${s20_lines(960,580,g,{len:700,h:380,n:9})}${s20_fast({x:hu?620:960,y:600,s:hu?1:1.1,t:g,pose:hu?'flex':'up',mouth:'grin',brows:'raised',glint:1},3,-120)}
   ${T(960,150,'GLINT HAS SPED UP',{size:96,fill:P.white,sc:pop(t,p.sped??14.57)})}${hu?`${T(1340,640,'100x',{size:320,fill:P.gold,stroke:60,sc:pop(t,p.hund??16.31)})}`:''}`;
},
spdRules(t,d,p,g){
  const sec=p.sec??5.05, on=p.on??14.7;
  if(t<sec) return `${bgLab(g)}${s20_DEFS}<rect x="1100" y="640" width="560" height="40" rx="10" fill="#4A5468" stroke="${INK}" stroke-width="7"/>
    ${person({x:1480,y:520,s:.95,t:g,who:'osei',pose:'hold',mouth:'smile',look:-1,blink:BL(g+1)})}<g transform="translate(1530,600)">${clockP(0,0,46,g*4)}</g>
    ${s20_fast({x:620,y:560,s:.9,t:g,pose:'down',mouth:'smile',legs:'walk'},2,-100,.5)}
    ${T(960,170,AT(t,p.rules??2.98)?'THE RULES':'DR. OSEI TESTS HIM',{size:AT(t,p.rules??2.98)?150:90,fill:AT(t,p.rules??2.98)?P.gold:P.white,sc:pop(t,AT(t,p.rules??2.98)?p.rules??2.98:.1)})}`;
  if(t<on){const mu=AT(t,p.mus??8.77);
    return `${card('cardDark',g)}<g transform="translate(560,470)">${clockP(0,0,180,(t-sec)*.06)}</g>${T(560,740,'WORLD: 1 SECOND',{size:56,fill:P.ice})}
     <g transform="translate(1360,470)">${clockP(0,0,180,(t-sec)*6)}</g>${T(1360,740,'GLINT: 100 SECONDS',{size:56,fill:P.gold})}
     ${T(960,480,'=',{size:180,fill:P.white})}${T(960,160,'1 SECOND = 100 SECONDS',{size:90,fill:P.white,sc:IN(t,sec+.1)})}
     ${mu?['MUSCLES','THOUGHTS','HEARTBEAT'].map((w,i)=>s20_pill(480+i*480,860,w+' x100',[P.coral,P.violet,P.red][i],40,pop(t,(p.mus??8.77)+i*1.3))).join(''):''}`;}
  const off=AT(t,p.off??17.01);const beat=Math.max(0,Math.sin(g*(off?5:14)));
  return `${card(off?'cardIce':'cardWarm',g)}${heart(560,500,off?.75:.8+.1*beat,off?.2:beat)}${T(560,820,off?'HE LETS GO':'HEART RACES',{size:64,fill:off?P.ice:P.red,sc:pop(t,off?p.off??17.01:on)})}
   ${T(960,500,'→',{size:150,fill:P.white})}${s20_switch(1360,470,1,!off,'100x MODE')}${!off?s20_lines(1360,470,g,{dir:-1,len:300,h:260,op:.6}):''}
   ${T(960,160,off?'SWITCHES OFF':'SWITCHES ON',{size:100,fill:off?P.ice:P.mint,sc:pop(t,off?p.off??17.01:on)})}`;
},
spdSound(t,d,p,g){
  const st=AT(t,p.stretch??4.4), dp=AT(t,p.deep??7.2), sil=AT(t,p.silent??10.33);
  const k=st?eout(prog(t,p.stretch??4.4,(p.stretch??4.4)+2.2)):0;
  if(sil) return `${card('cardDark',g)}${person({x:560,y:520,s:.95,t:0,who:'kai',mouth:'laugh',pose:'wave',brows:'raised'})}${s20_bub(620,200,420,'HEY GLINT!','',{size:46,col:'#9AA7BD'})}
    ${s20_fast({x:1300,y:540,s:.9,t:g,mouth:'flat',brows:'raised',look:-1},2,120,.5)}${s20_mute(1640,300,.8*pop(t,p.silent??10.33))}
    ${T(960,860,'THE WORLD GOES SILENT',{size:80,fill:P.white,sc:pop(t,p.silent??10.33)})}`;
  return `${card('cardMint',g)}${person({x:300,y:500,s:.85,t:g,who:'kai',mouth:'laugh',brows:'raised',blink:BL(g)})}
   ${s20_wave(420,480,1080,lerp(70,90,k),lerp(14,1.2,k),g,{col:k>.5?P.violet:P.mint,speed:lerp(8,.3,k)})}
   ${T(960,170,st?'STRETCHED 100x':'A VOICE = A VIBRATION',{size:90,fill:st?P.gold:P.white,sc:pop(t,st?p.stretch??4.4:.1)})}
   ${dp?`<g transform="translate(1660,470) scale(${pop(t,p.deep??7.2)})">${s20_ear(0,0,1.3)}${icon('cross',90,90,.7)}</g>${T(1020,800,'TOO DEEP FOR HUMAN EARS',{size:62,fill:P.red,sc:pop(t,(p.deep??7.2)+.4)})}`:`${s20_ear(1660,470,1.3)}`}`;
},
spdLight(t,d,p,g){
  const km=AT(t,p.km??1.68), mil=AT(t,p.mil??5.0), see=AT(t,p.sees??8.71);
  if(see) return `${card('cardGold',g)}${s20_DEFS}<g transform="translate(960,560) scale(2.2)">${s20_gl({x:0,y:0,s:1,t:g,mouth:'o',brows:'raised',glint:1})}</g>
    ${[0,1,2,3,4,5].map(i=>{const a=i*60+g*20;return `<path d="M960 420 L${(960+Math.cos(a*Math.PI/180)*900).toFixed(0)} ${(420+Math.sin(a*Math.PI/180)*900).toFixed(0)}" stroke="#FFF3A0" stroke-width="40" opacity=".1"/>`;}).join('')}
    ${T(960,170,'HE STILL SEES EVERYTHING',{size:84,fill:P.white,sc:pop(t,p.sees??8.71)})}${T(960,860,'INSTANTLY',{size:90,fill:P.gold,sc:pop(t,(p.sees??8.71)+.9)})}`;
  const lx=((t*1.3)%1)*2200-140, sx=200+t*20;
  return `${card('cardDark',g)}<rect x="0" y="330" width="1920" height="150" fill="#1A1430"/><rect x="0" y="560" width="1920" height="150" fill="#1A1430"/><path d="M0 330 H1920 M0 480 H1920 M0 560 H1920 M0 710 H1920" stroke="#3B4A78" stroke-width="5"/>
   <path d="M${lx-700} 405 H${lx}" stroke="#FFF3A0" stroke-width="22" stroke-linecap="round"/><circle cx="${lx}" cy="405" r="40" fill="#FFF8D0" stroke="${INK}" stroke-width="6"/><circle cx="${lx}" cy="405" r="110" fill="url(#gGold)"/>
   ${s20_wave(sx-160,635,160,26,3,g,{col:P.mint,sw:9})}${T(110,425,'LIGHT',{size:52,fill:P.gold,anchor:'start'})}${T(110,655,'SOUND',{size:52,fill:P.mint,anchor:'start'})}
   ${km?s20_pill(960,250,'300,000 KM EVERY SECOND',P.gold,48,pop(t,p.km??1.68)):''}${mil?s20_pill(960,800,'ALMOST 1,000,000x FASTER THAN SOUND',P.white,42,pop(t,p.mil??5)):''}
   ${T(960,150,'LIGHT IS DIFFERENT',{size:90,fill:P.white,sc:IN(t,.1)})}`;
},
spdAir(t,d,p,g){
  const rule=p.rule??14.26;
  if(t>=rule){const wk=AT(t,p.walk??16.95), nv=AT(t,p.never??17.82);
    return `${bgLab(g)}${person({x:520,y:520,s:.95,t:g,who:'osei',pose:'point',mouth:'flat',brows:'angry',blink:BL(g+1)})}
     <g transform="translate(1260,470) rotate(-3) scale(${pop(t,rule+.3)})"><rect x="-360" y="-230" width="720" height="460" rx="24" fill="#FFF6EA" stroke="${INK}" stroke-width="12"/><text y="-130" text-anchor="middle" font-size="56" font-weight="900" fill="${P.red}" letter-spacing="6">RULE 1</text>
      ${wk?`<text y="0" text-anchor="middle" font-size="130" font-weight="900" fill="${INK}">WALK.</text>`:''}${nv?`<text y="150" text-anchor="middle" font-size="96" font-weight="900" fill="${P.red}">NEVER SPRINT.</text>`:''}</g>`;}
  const tw=AT(t,p.twice??5.42), sp=AT(t,p.sprint??9.46);
  if(sp){const k=prog(t,p.sprint??9.46,(p.sprint??9.46)+2);let cone='';for(let i=0;i<4;i++){const xx=1180-i*90;cone+=`<path d="M${xx+420} 300 L${xx+120} 560 L${xx+420} 820" stroke="#CFEAFF" stroke-width="${10-i*2}" fill="none" opacity="${(k*(1-i*.2)).toFixed(2)}"/>`;}
    return `${card('cardIce',g)}${s20_DEFS}${cone}${s20_lines(900,560,g,{len:800,h:360,n:9})}${s20_fast({x:1100,y:540,s:.85,t:g,pose:'reach',mouth:'teeth',brows:'angry',legs:'walk',rot:12},4,-150)}
     ${T(960,160,'FULL SPRINT?',{size:96,fill:P.white,sc:pop(t,p.sprint??9.46)})}${T(960,880,'PAST THE SPEED OF SOUND',{size:66,fill:P.red,sc:pop(t,(p.sprint??9.46)+1.5)})}`;}
  const bar=(x,v,lab,col)=>`<rect x="${x-60}" y="${780-v*130}" width="120" height="${v*130}" rx="12" fill="${col}" stroke="${INK}" stroke-width="7"/>${T(x,840,lab,{size:40,fill:P.white,stroke:8})}`;
  let arrows='';for(let i=0;i<6;i++){const k=((g*1.4+i/6)%1);arrows+=`<path d="M${(1000-k*360).toFixed(0)} ${300+i*60} h-90 m30 -20 l-30 20 l30 20" stroke="#9AD1FF" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${(1-k).toFixed(2)}" transform="scale(-1,1) translate(-1300,0)"/>`;}
  return `${card('cardIce',g)}${arrows}${s20_gl({x:420,y:540,s:.85,t:g,pose:'reach',legs:'walk',mouth:'teeth',brows:'angry',rot:10})}
   <g>${bar(1320,1,'1x SPEED',P.mint)}${tw?bar(1560,4,'2x SPEED',P.red):''}</g>${tw?`${T(1560,220,'4x PUSH',{size:70,fill:P.red,sc:pop(t,(p.twice??5.42)+.8)})}`:''}${T(1320,640,'PUSH',{size:44,fill:P.white})}
   ${T(760,160,'AIR PUSHES BACK',{size:96,fill:P.white,sc:IN(t,(p.push??1.91))})}`;
},
spdKettle(t,d,p,g){
  const th=AT(t,p.three??6.47), fv=AT(t,p.five??9.14), ch=p.chores??11.65, cl=AT(t,p.click??17.87), nan=AT(t,p.nan??19.44);
  const items=['BREAKFAST','OVEN','TAP','HALF A BOOK'];const nd=AT(t,ch)?Math.min(4,1+Math.floor((t-ch)/1.5)):0;
  const sta=[[1590,560],[1000,560],[1240,560],[760,560]];const si=nd?Math.min(3,nd-1):0;
  let gl='';
  if(!AT(t,ch)) gl=s20_gl({x:1180,y:560,s:.75,t:g,mouth:'smile',look:-1});
  else if(!cl){const [gx,gy]=sta[si];gl=s20_fast({x:gx,y:gy,s:.75,t:g,pose:'reach',mouth:'grin',legs:'walk'},3,-100)+(si===3?`<rect x="${gx+60}" y="${gy-10}" width="90" height="70" rx="6" fill="${P.coral}" stroke="${INK}" stroke-width="6"/>`:'');}
  else gl=s20_gl({x:1180,y:560,s:.75,t:g,mouth:'grin',pose:'hips',glint:1});
  return `${s20_kitchen(g,{oven:0,drip:nd<3,steam:cl?1:prog(t,3,17)*.4,click:cl})}
   ${person({x:340,y:600,s:.82,t:AT(t,p.kettle??3.55)&&!cl?0:g,who:'nan',pose:cl?'hips':'point',mouth:cl?'o':'smile',brows:cl?'raised':'calm',blink:0})}${gl}
   ${th?s20_split(960,300,.55,'3 MIN',fv?'5 HOURS':'?',{g}):''}
   ${nd?`<g transform="translate(1660,300)"><rect x="-190" y="-120" width="380" height="${70+4*56}" rx="18" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/>${items.map((w,i)=>`<g transform="translate(-160,${-60+i*56})">${i<nd?`<path d="M0 0 l12 12 l22 -24" stroke="${P.mintDark}" stroke-width="9" fill="none" stroke-linecap="round"/>`:`<rect x="0" y="-16" width="30" height="30" rx="5" fill="none" stroke="${INK}" stroke-width="4"/>`}<text x="50" y="12" font-size="34" font-weight="900" fill="${INK}">${w}</text></g>`).join('')}</g>`:''}
   ${cl&&!nan?T(560,380,'CLICK!',{size:90,fill:P.gold,sc:pop(t,p.click??17.87)}):''}
   ${nan?s20_bub(560,300,640,'WHO ARE YOU, AND WHAT HAVE','YOU DONE WITH MY GRANDSON?',{size:36,tail:'left'}):''}
   ${s20_pm(t,'plus','NEVER LATE AGAIN')}`;
},
spdShoes(t,d,p,g){
  const fr=AT(t,p.fric??2.32), ht=AT(t,p.heat??4.6), tu=AT(t,p.tue??9.26), we=AT(t,p.wed??12.98), nan=AT(t,p.nan??15.74);
  if(nan) return `${s20_kitchen(g,{kettle:0})}${person({x:640,y:600,s:.85,t:g,who:'nan',pose:'up',mouth:'flat',brows:'angry',blink:BL(g)})}
    <g transform="translate(540,330) rotate(-12)">${s20_shoe(0,0,.42,{melt:1,col:'#C9C2B8'})}</g><g transform="translate(760,320) rotate(14)">${s20_shoe(0,0,.42,{melt:1,col:'#C9C2B8'})}</g>
    ${[0,1,2].map(i=>s20_shoe(980+i*70,850-i*26,.34,{melt:1,col:'#C9C2B8',rot:-10+i*12})).join('')}
    ${s20_gl({x:1450,y:560,s:.8,t:g,mouth:'flat',brows:'sad',pose:'shrug',look:-1})}${s20_pill(1060,700,'PAIR #4',P.red,40,pop(t,(p.nan??15.74)+.5))}
    ${s20_bub(1220,180,820,"SHOES DON'T GROW","ON TREES, LOVE.",{size:50,tail:'left'})}`;
  const melt=we?prog(t,p.wed??12.98,(p.wed??12.98)+1.5):0, heat=ht?.6+.3*Math.sin(g*6):fr?.3:0;
  let sp='';if(fr&&!we){const r=rng(Math.floor(g*12));for(let i=0;i<8;i++){const a=Math.PI+(-.5+r())*.9,l=40+r()*90;sp+=`<path d="M720 760 l${(Math.cos(a)*l).toFixed(0)} ${(Math.sin(a)*l*.4-20).toFixed(0)}" stroke="${r()>.5?P.gold:'#fff'}" stroke-width="5" stroke-linecap="round"/>`;}}
  return `${card('cardWarm',g)}${s20_DEFS}<rect y="760" width="1920" height="320" fill="#3A3448"/><path d="M0 760 H1920" stroke="${INK}" stroke-width="7"/>${[...Array(12)].map((_,i)=>{const x=((i*190-g*900)%2280+2280)%2280-180;return `<path d="M${x} 790 h90" stroke="#5A5468" stroke-width="10"/>`;}).join('')}
   ${s20_lines(760,660,g,{dir:-1,len:500,h:160,col:'#fff',op:.5})}${s20_shoe(960,762,1.45,{melt,heat,g,sm:tu?1:0,col:'#F4F6FA'})}${sp}
   ${fr?s20_pill(960,250,'100x MORE SCRAPING',P.white,46,pop(t,p.fric??2.32)):''}${ht?s20_pill(960,350,'FRICTION → HEAT',P.coral,52,pop(t,p.heat??4.6)):''}
   ${tu&&!we?s20_pill(1480,520,'TUE: BURNING TYRE SMELL',P.gold,38,pop(t,p.tue??9.26)):''}${we?s20_pill(1480,520,'WED: SOLES GONE',P.red,44,pop(t,p.wed??12.98)):''}
   ${s20_pm(t,'minus','HIS SHOES')}`;
},
spdGlass(t,d,p,g){
  const sh=p.shove??2.81, hf=AT(t,p.half??7.25), ft=AT(t,p.forty??11.85), sr=p.stroll??14.82, of=AT(t,p.off??19.0);
  const fall=AT(t,sh+.6)?prog(t,sh+.6,sr+3)*.55:0, caught=AT(t,sr+3), back=AT(t,sr+3.6);
  const gx=1230, gy=back?620:caught?680:620+fall*140, grot=back?0:caught?0:fall*90;
  const glx=AT(t,sr)?lerp(400,gx-70,eout(prog(t,sr,sr+3))):400;
  return `${s20_kitchen(g,{kettle:1})}${pickles(1420,560,.6,of?0:g,{mood:'grump'})}${AT(t,sh)&&!of?`<path d="M1340 545 l-50 10" stroke="#F0913A" stroke-width="22" stroke-linecap="round"/><path d="M1340 545 l-50 10" stroke="${INK}" stroke-width="4" fill="none"/>`:''}
   ${s20_glass(caught&&!back?gx-20:gx,gy,.8,grot)}${AT(t,sh+.6)&&!caught?`<path d="M${gx+60} 600 v120" stroke="#fff" stroke-width="6" stroke-dasharray="10 12" opacity=".7"/>`:''}
   ${s20_gl({x:glx,y:560,s:.75,t:g,legs:AT(t,sr)&&!caught?'walk':'stand',pose:caught&&!back?'reach':'down',mouth:of?'smirk':'smile',look:1})}
   ${hf?s20_split(830,290,.5,'< 0.5 s',ft?'40+ s':'?',{g}):''}${caught&&!of?s20_pill(1230,450,'CAUGHT!',P.mint,48,pop(t,sr+3)):''}
   ${of?`${s20_pill(1420,380,'DEEPLY OFFENDED',P.coral,44,pop(t,p.off??19))}`:''}
   ${s20_pm(t,'plus','NOTHING FALLS')}`;
},
spdHunger(t,d,p,g){
  const sa=p.sand??14.02, fa=p.faint??16.5, bk=p.bake??18.69;
  if(t>=bk){const n=Math.min(9,1+Math.floor((t-bk)*2.2));let tr='';for(let i=0;i<n;i++){const x=300+(i%3)*190,y=560-Math.floor(i/3)*70;tr+=`<rect x="${x-80}" y="${y}" width="170" height="20" rx="6" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/>${[0,1,2].map(j=>s20_bun(x-45+j*45,y-12,.36)).join('')}`;}
    return `${s20_kitchen(g,{oven:1,kettle:0,clock:(t-bk)*3})}${tr}${person({x:1180,y:600,s:.85,t:g,who:'nan',pose:'hold',mouth:'smile',brows:'sad',blink:BL(g)})}<circle cx="1180" cy="420" r="0"/>
     <g transform="translate(1590,330)">${[0,1].map(i=>`<circle cx="${i*0}" r="${70}" fill="${(Math.floor((t-bk)*1.5)%2)===i?'#FFC83D':'#26204A'}" stroke="${INK}" stroke-width="6" opacity="${(Math.floor((t-bk)*1.5)%2)===i?1:0}"/>`).join('')}</g>
     ${T(960,150,'NAN BAKES DAY AND NIGHT',{size:84,fill:P.gold,sc:pop(t,bk)})}`;}
  if(t>=fa) return `${card('cardDark',g)}${s20_dino(980,620,1.05)}${s20_gl({x:960,y:700,s:.7,t:0,eyes:'x',mouth:'wavy',rot:-90,pose:'down'})}
    ${T(960,150,'FAINTS IN THE DINOSAUR HALL',{size:80,fill:P.white,sc:pop(t,fa)})}`;
  if(t>=sa){const n=Math.min(12,1+Math.floor((t-sa)*5));let pile='';for(let i=0;i<12;i++)if(i<n)pile+=s20_sand(1260+((i*37)%60)-30,780-i*46,.9,((i*53)%20)-10);
    return `${card('cardWarm',g)}${pile}${s20_gl({x:620,y:560,s:.9,t:g,mouth:'grin',pose:'reach',brows:'raised'})}${s20_bun(760,560,0)}
     <g transform="translate(1600,330)">${T(0,0,String(n),{size:200,fill:P.gold})}${T(0,80,'SANDWICHES',{size:46,fill:P.white})}</g>${T(760,160,'LUNCH',{size:100,fill:P.white,sc:pop(t,sa)})}`;}
  const ca=AT(t,p.cal??2.25), bu=AT(t,p.but??6.39), hr=AT(t,p.hour??9.6);
  let pile='';if(hr){const k=prog(t,p.hour??9.6,(p.hour??9.6)+3.2);const r=rng(5);for(let i=0;i<Math.round(110*k);i++){const x=1300+(r()-.5)*1100*(1-i/130),y=840-i*5.2-r()*24;pile+=r()>.5?s20_bun(x,y,.85,r()*40-20):s20_sand(x,y,.8,r()*30-15);}}
  return `${card('cardWarm',g)}${s20_DEFS}${pile}${s20_gl({x:hr?420:700,y:560,s:.9,t:g,mouth:hr?'o':'smile',brows:hr?'raised':'calm',pose:hr?'shrug':'down'})}
   ${ca&&!hr?`<g transform="translate(1320,520) scale(${pop(t,p.cal??2.25)})"><rect x="-300" y="-170" width="600" height="340" rx="22" fill="#FFF6EA" stroke="${INK}" stroke-width="10"/><text y="-80" text-anchor="middle" font-size="44" font-weight="900" fill="${INK}">NORMAL DAY</text><text y="40" text-anchor="middle" font-size="110" font-weight="900" fill="${P.red}">~2,500</text><text y="120" text-anchor="middle" font-size="44" font-weight="900" fill="${INK}">CALORIES</text></g>`:''}
   ${bu&&!hr?s20_pill(1320,800,'GLINT: RUNNING 100x FASTER',P.gold,40,pop(t,p.but??6.39)):''}
   ${hr?`${s20_pill(1180,230,'1 HOUR OF SPEED = 100 HOURS OF FOOD',P.gold,44,pop(t,p.hour??9.6))}`:''}
   ${s20_pm(t,'minus','THE HUNGER')}`;
},
spdBee(t,d,p,g){
  const wi=AT(t,p.wings??6.56), bl=AT(t,p.blur??10.08), bt=AT(t,p.beat??12.95);
  const wing=bt?(Math.sin(g*1.6)+1)/2:0;
  return `${s20_DEFS}<rect width="1920" height="1080" fill="url(#s20day)"/><circle cx="1650" cy="160" r="70" fill="#FFF3A0"/><circle cx="1650" cy="160" r="200" fill="url(#gGold)" opacity=".4"/>
   <rect y="600" width="1920" height="480" fill="#6FBF6A"/><rect x="0" y="380" width="1920" height="230" fill="#C9B89A" stroke="${INK}" stroke-width="6"/>${[...Array(12)].map((_,i)=>`<path d="M${i*170} 380 V610" stroke="#A8987A" stroke-width="5"/>`).join('')}<path d="M0 495 H1920" stroke="#A8987A" stroke-width="5"/>
   ${[120,380,640,1280,1540,1800].map((x,i)=>s20_lav(x,860,1.2+.2*(i%2),g)).join('')}
   ${s20_bee(960,520+Math.sin(g*2)*14,1.15,g,{blur:!bt,wing})}${bl&&!bt?T(1300,330,'BZZZZ',{size:80,fill:P.gold,rot:-8,sc:pop(t,p.blur??10.08)}):''}
   ${bt?`${s20_gl({x:400,y:560,s:.85,t:g,mouth:'o',brows:'raised',look:1,glint:1})}${[0,1,2].map(i=>{const k=((g*.5+i/3)%1);return `<path d="M${(1100+k*200).toFixed(0)} ${(380-k*100).toFixed(0)} l6 -18 l6 18 l18 6 l-18 6 l-6 18 l-6 -18 l-18 -6Z" fill="#fff" opacity="${(1-k).toFixed(2)}"/>`;}).join('')}${s20_pill(1380,820,'SLOW AND PERFECT',P.mint,46,pop(t,(p.beat??12.95)+.6))}`:''}
   ${wi?s20_pill(1340,200,'200+ WING BEATS A SECOND',P.gold,42,pop(t,p.wings??6.56)):''}
   ${s20_pm(t,'plus','THE HIDDEN WORLD')}`;
},
spdBoom(t,d,p,g){
  const sa=AT(t,p.says??7.94), sp=p.sprint??12.07, so=AT(t,p.sound??13.52), bo=p.boom??18.77, wi=p.win??20.64, hu=AT(t,p.hurt??23.34), be=AT(t,p.best??24.83), pa=AT(t,p.pays??27.75);
  const fl=AT(t,bo)?Math.max(0,1-(t-bo)/.9):0, shat=AT(t,wi)?prog(t,wi,wi+2.2):0;
  let gl;
  if(!AT(t,sp)) gl=s20_gl({x:760,y:560,s:.85,t:g,mouth:'flat',brows:'raised',look:-1,pose:'cross'});
  else if(!AT(t,bo)){const gx=lerp(760,1100,prog(t,sp,sp+1.2));gl=`${s20_lines(gx,560,g,{len:700,h:340,n:9})}${s20_fast({x:gx,y:560,s:.85,t:g,pose:'reach',legs:'walk',mouth:'teeth',brows:'angry',rot:12},4,-140)}`;
    if(so){const k=prog(t,p.sound??13.52,(p.sound??13.52)+1.5);for(let i=0;i<4;i++){const xx=gx+150-i*70;gl+=`<path d="M${xx+260} 260 L${xx} 560 L${xx+260} 860" stroke="#CFEAFF" stroke-width="${12-i*2}" fill="none" opacity="${(k*(1-i*.2)).toFixed(2)}"/>`;}}}
  else gl=s20_gl({x:1000,y:560,s:.85,t:g,mouth:pa?'flat':'o',brows:pa?'sad':'raised',pose:pa?'reach':'shrug'});
  const rings=AT(t,bo)?[0,1,2].map(i=>{const k=clamp((t-bo)/1.6-i*.15);return k>0&&k<1?`<circle cx="1100" cy="520" r="${(80+k*900).toFixed(0)}" fill="none" stroke="#fff" stroke-width="${(26*(1-k)).toFixed(1)}" opacity="${(1-k).toFixed(2)}"/>`:'';}).join(''):'';
  return `${s20_park(g,{shat,flash:fl*.8})}${person({x:420,y:540,s:.9,t:g,who:'kai',pose:be?'up':sa?'point':'wave',mouth:'laugh',brows:'raised',blink:BL(g+1)})}${gl}${rings}
   ${sa&&!AT(t,sp)?s20_bub(740,280,560,'ONE PROPER SPRINT.','FOR SCIENCE.',{size:44}):''}
   ${so&&!AT(t,bo)?T(960,160,'SPEED OF SOUND',{size:96,fill:P.white,sc:pop(t,p.sound??13.52)}):''}
   ${AT(t,bo)&&!hu?T(960,240,'BOOM!',{size:260,fill:P.gold,stroke:56,rot:-6,sc:pop(t,bo)}):''}${shat>0&&!hu?s20_pill(1560,780,'EVERY WINDOW',P.red,44,pop(t,wi+.3)):''}
   ${hu&&!be?s20_pill(960,180,'NOBODY HURT',P.mint,54,pop(t,p.hurt??23.34)):''}${be&&!pa?s20_bub(740,280,600,'BEST NIGHT','OF MY LIFE!',{size:50}):''}
   ${pa?`${coinStack(1180,700,Math.min(8,1+Math.floor((t-(p.pays??27.75))*4)),.8)}${s20_pill(960,180,'GLINT PAYS FOR THE WINDOWS',P.gold,46,pop(t,p.pays??27.75))}`:''}
   ${s20_pm(t,'minus','THE BOOM')}`;
},
spdNoGrab(t,d,p,g){
  const ya=AT(t,p.yank??5.83), su=AT(t,p.sudden??10.37), pm=p.pm??13.51, sun=AT(t,p.sun??18.16);
  if(sun) return `${s20_steps(g)}${s20_rain(g,{frozen:0,n:90})}<g transform="translate(960,520) scale(${pop(t,p.sun??18.16)})"><rect x="-200" y="-200" width="400" height="400" rx="26" fill="#FFF6EA" stroke="${INK}" stroke-width="12"/><rect x="-200" y="-200" width="400" height="110" rx="26" fill="${P.red}" stroke="${INK}" stroke-width="12"/><text y="-125" text-anchor="middle" font-size="64" font-weight="900" fill="#fff">SUNDAY</text><text y="110" text-anchor="middle" font-size="150" font-weight="900" fill="${INK}">9 AM</text></g>
    ${T(960,860,'HE FINDS OUT WHAT THAT MEANS',{size:62,fill:P.white,sc:pop(t,(p.sun??18.16)+.6)})}`;
  if(AT(t,pm)) return `${card('cardWarm',g)}${s20_hero(760,460,1,g)}${extra({x:1060,y:500,s:.8,t:g,head:'#9AD1FF',pose:'up',mouth:'laugh'})}${s20_lines(1100,520,g,{dir:-1,len:300,h:200,col:'#fff'})}
    ${AT(t,pm+2.8)?`<g transform="translate(910,500)">${icon('cross',0,0,2*pop(t,pm+2.8))}</g>${T(960,860,'NOT IN REAL LIFE',{size:70,fill:P.red,sc:pop(t,pm+3)})}`:''}
    ${T(1220,150,'FILM-STYLE RESCUES',{size:76,fill:P.white,sc:pop(t,pm+2.6)})}${s20_pm(t,'minus','NO HERO GRABS',pm)}`;
  let body;
  if(!ya) body=`${person({x:560,y:520,s:.95,t:g,who:'osei',pose:'point',mouth:'flat',brows:'angry',blink:BL(g)})}<g transform="translate(1260,470) rotate(-3) scale(${pop(t,p.never??3.21)})"><rect x="-360" y="-200" width="720" height="400" rx="24" fill="#FFF6EA" stroke="${INK}" stroke-width="12"/><text y="-100" text-anchor="middle" font-size="56" font-weight="900" fill="${P.red}" letter-spacing="6">RULE 2</text><text y="20" text-anchor="middle" font-size="88" font-weight="900" fill="${INK}">NEVER GRAB</text><text y="120" text-anchor="middle" font-size="88" font-weight="900" fill="${INK}">A PERSON</text></g>`;
  else{const k=prog(t,(p.yank??5.83)+.3,(p.yank??5.83)+.6);
    body=`${extra({x:lerp(360,680,k),y:500,s:.8,t:0,head:'#FFD3A8',pose:'up',mouth:'flat'})}${k>0&&k<1?s20_lines(lerp(360,680,k),540,g,{len:300,h:240,col:'#fff'}):''}${T(520,850,'A FEW METRES, IN A BLINK',{size:48,fill:P.white})}
     ${T(960,520,'=',{size:180,fill:P.white})}<g transform="translate(1400,560)">${s20_car(0,120,1,P.coral)}<path d="M-260 -60 l40 30 l-60 20 l60 10 l-30 40" stroke="${P.gold}" stroke-width="12" fill="none"/></g>${T(1400,850,'LIKE BEING HIT BY A CAR',{size:48,fill:P.red})}
     ${su?s20_pill(960,260,'SUDDEN ACCELERATION HURTS',P.red,52,pop(t,p.sudden??10.37)):''}`;}
  return `${bgLab(g)}${body}${T(960,150,'THE HARDEST RULE',{size:96,fill:P.gold,sc:IN(t,.3)})}`;
},
spdSteps(t,d,p,g){
  const ra=AT(t,p.races??4.0), pw=AT(t,p.power??5.2), fz=AT(t,p.freeze??6.92), va=AT(t,p.vanish??8.55);
  const ph=fz?2.1:g*3.2;
  return `${s20_steps(g)}${s20_walker(380,560,.62,ph,{umb:P.coral})}${s20_walker(1560,560,.62,ph+2,{umb:P.mint,top:'#D8A040',head:'#C68B59'})}${s20_walker(1240,600,.55,ph+1,{umb:P.violet,top:'#7A5A9A'})}
   ${pw?`<circle cx="860" cy="540" r="${(260+Math.sin(g*6)*16).toFixed(0)}" fill="url(#s20glow)" opacity=".7"/>`:''}${s20_gl({x:860,y:540,s:.75,t:g,mouth:'o',brows:'raised',look:1,glint:pw?1:0})}
   ${ra&&!fz?`<g transform="translate(1080,360)">${heart(0,0,.35+.06*Math.max(0,Math.sin(g*14)),Math.max(0,Math.sin(g*14)))}</g>`:''}
   ${s20_rain(g,{frozen:fz?1:0,n:120,seed:8})}${fz?`<rect width="1920" height="1080" fill="#9CC8FF" opacity=".1"/>`:''}
   ${fz?s20_pill(960,330,'RAINDROPS FREEZE',P.ice,52,pop(t,p.freeze??6.92)):''}${va?s20_mute(1660,330,.8*pop(t,p.vanish??8.55)):''}
   ${T(960,150,pw?'100x: ON':'SUNDAY. THE MUSEUM STEPS',{size:pw?120:80,fill:pw?P.gold:P.white,sc:pop(t,pw?p.power??5.2:.1)})}`;
},
spdLorry(t,d,p,g){
  const dr=AT(t,p.driver??4.08), ft=AT(t,p.foot??6.6), tn=AT(t,p.tonnes??9.63);
  return `<g transform="translate(-60,-120) scale(1.35)">${s20_street(g,{frozen:1,heap:1,cars:1,beacons:0})}${s20_lorryAt(560,.8,g)}${s20_streetFx(g)}</g>
   ${dr?`<g transform="translate(1540,470) scale(${pop(t,p.driver??4.08)})"><circle r="190" fill="#0B1026" stroke="${P.gold}" stroke-width="10"/><g transform="scale(2.6) translate(-196,200)"><circle cx="196" cy="-200" r="34" fill="#E8B98A" stroke="${INK}" stroke-width="5"/><circle cx="184" cy="-206" r="10" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="210" cy="-206" r="10" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="186" cy="-206" r="4" fill="${INK}"/><circle cx="212" cy="-206" r="4" fill="${INK}"/><ellipse cx="198" cy="-184" rx="8" ry="10" fill="#3a1220"/></g>${T(0,250,'FROZEN IN PANIC',{size:46,fill:P.white})}</g>`:''}
   ${ft?`<g transform="translate(1540,${dr?820:470})">${s20_pill(0,0,'BRAKE: NOT WORKING',P.red,40,pop(t,p.foot??6.6))}</g>`:''}
   ${tn?T(700,880,'12 TONNES, SLIDING',{size:84,fill:P.gold,sc:pop(t,p.tonnes??9.63)}):''}
   ${T(760,150,'BLACK ICE',{size:110,fill:P.ice,sc:IN(t,.2)})}`;
},
spdNan(t,d,p,g){
  const ma=p.maths??12.06;
  if(t<ma){const bu=AT(t,p.buns??3.32), hs=AT(t,p.hiss??6.77), se=AT(t,p.seen??9.75);
    return `<g transform="translate(-1700,-760) scale(1.9)">${s20_street(g,{frozen:1,heap:0,cars:0})}${s20_streetFx(g)}</g>
     ${person({x:1060,y:520,s:1.25,t:0,who:'nan',pose:'hold',look:1,mouth:'smile',blink:0})}${s20_carrier(1060+62*1.15,520+90*1.15,.55*1.15,{hiss:hs?1:0})}${s20_tin(1060-10*1.15,520+105*1.15,.42*1.15,{open:0})}
     ${s20_rain(g,{frozen:1,n:60,seed:31,big:1.6})}
     ${bu?s20_pill(640,640,'BUNS FOR GLINT',P.gold,44,pop(t,p.buns??3.32)):''}${hs?s20_pill(1500,880-60,'MID-HISS',P.coral,44,pop(t,p.hiss??6.77)):''}
     ${se?`<g transform="translate(330,330)">${s20_lorry(0,0,.32,s20_ANG,g)}</g>${s20_pill(400,480,"SHE HASN'T SEEN IT",P.red,40,pop(t,p.seen??9.75))}`:''}
     ${T(1060,150,'NAN. ON THE CROSSING.',{size:84,fill:P.white,sc:IN(t,.1)})}`;}
  const ni=AT(t,p.nine??13.65), fi=AT(t,p.fifteen??16.35);
  return `${s20_street(g,{frozen:1})}${s20_lorryAt(480,.72,g)}${s20_nan(1540,630,.72,g,{hiss:1})}${s20_gl({x:1830,y:600,s:.62,t:g,mouth:'flat',brows:'raised',look:-1})}${s20_streetFx(g)}
   <path d="M${480+200} ${s20_hy(480)-60} Q1100 520 1480 640" stroke="${P.gold}" stroke-width="8" fill="none" stroke-dasharray="22 16"/>
   ${s20_split(760,300,.62,ni?'9 s':'?',fi?'15:00':'?',{g,pulse:1})}${T(760,150,'GLINT DOES THE MATHS',{size:76,fill:P.white,sc:IN(t,ma)})}`;
},
spdCant(t,d,p,g){
  const ne=AT(t,p.never??1.18), pu=AT(t,p.push??2.82), mo=AT(t,p.mom??4.57), fl=AT(t,p.fly??8.11), gr=AT(t,p.grab??11.01), hu=AT(t,p.hurt??12.77);
  const panel=(x,lab,inner,show,a,crossA)=>show?`<g transform="translate(${x},540) scale(${pop(t,a)})"><rect x="-280" y="-300" width="560" height="600" rx="26" fill="#0B1026" fill-opacity=".9" stroke="${P.gold}" stroke-width="8"/>${inner}${T(0,250,lab,{size:58,fill:P.white})}${AT(t,crossA)?icon('cross',190,-200,.8*pop(t,crossA)):''}</g>`:'';
  const p1=`${s20_gl({x:-60,y:-20,s:.55,t:g,mouth:'o',brows:'angry'})}${s20_wave(30,-80,200,24,3,g,{col:P.mint,sw:8})}${ne?T(0,170,"SHE'D NEVER HEAR",{size:36,fill:P.red}):''}`;
  const bx=fl?-60-((t-(p.fly??8.11))*80%60):-40;
  const p2=`${s20_lorry(80,30,.36,0,g,{panic:1})}${s20_gl({x:bx-90,y:-30,s:.45,t:g,pose:'reach',mouth:'teeth',rot:fl?-20:0})}${mo?T(0,170,'HUGE MOMENTUM',{size:40,fill:P.red}):''}`;
  const p3=`${person({x:40,y:-40,s:.55,t:0,who:'nan',pose:'hold',mouth:'smile'})}${s20_gl({x:-130,y:-30,s:.45,t:g,pose:'reach',mouth:'frown',brows:'sad'})}${hu?T(0,170,'WOULD HURT HER',{size:40,fill:P.red}):''}`;
  return `${s20_street(g,{frozen:1})}${s20_streetFx(g)}<rect width="1920" height="1080" fill="#05030C" opacity=".55"/>
   ${panel(340,"CAN'T SHOUT",p1,1,.05,(p.never??1.18)+.5)}${panel(960,"CAN'T PUSH",p2,pu,p.push??2.82,(p.fly??8.11)+.6)}${panel(1580,"CAN'T GRAB",p3,gr,p.grab??11.01,(p.hurt??12.77)+.8)}
   ${s20_hud(g)}${T(620,150,"HE CAN'T...",{size:96,fill:P.white,sc:IN(t,.1)})}`;
},
spdFuel(t,d,p,g){
  const sk=AT(t,p.skip??2.14), lg=AT(t,p.legs??3.5), fk=AT(t,p.flick??5.5), fu=AT(t,p.fuel??10.02), ag=AT(t,p.again??13.0);
  const v=fu?Math.max(0,.12-prog(t,p.fuel??10.02,(p.fuel??10.02)+3)*.12):.2-.06*prog(t,0,10);
  return `${s20_street(g,{frozen:fk?(Math.sin(g*9)>.6?0:1):1})}${s20_lorryAt(480,.72,g)}${s20_nan(1540,630,.72,g)}${s20_streetFx(g,{frozen:1})}
   <rect width="1920" height="1080" fill="#05030C" opacity=".35"/>
   ${s20_gl({x:900,y:520,s:1.05,t:g,mouth:'wavy',brows:'sad',pose:'cross',sweat:1,shiver:lg?1:0,legs:lg?'wobble':'stand'})}${s20_growl(900,640,g)}
   ${sk?s20_pill(500,520,'SKIPPED BREAKFAST',P.coral,40,pop(t,p.skip??2.14)):''}${lg?s20_pill(500,640,'LEGS SHAKING',P.coral,40,pop(t,p.legs??3.5)):''}
   ${s20_fuel(1390,560,.95,v,g)}${fu?s20_pill(1390,800,ag?'9 SECONDS = 9 SECONDS':'FUEL OUT = POWER DIES',P.red,40,pop(t,ag?p.again??13:p.fuel??10.02)):''}
   ${s20_flicker(g,1,fk)}${s20_hud(g)}${T(620,150,'HIS STOMACH SCREAMS',{size:80,fill:P.white,sc:IN(t,.1)})}`;
},
spdLook(t,d,p,g){
  const ra=AT(t,p.rain??2.97), rl=AT(t,p.rail??3.97), ca=AT(t,p.cars??4.93), gv=AT(t,p.gravel??6.36), th=AT(t,p.thirteen??11.72), ha=AT(t,p.hands??13.38), bu=AT(t,p.burn??15.51);
  const ring=(x,y,r,a)=>`<circle cx="${x}" cy="${y}" r="${r*pop(t,a)}" fill="none" stroke="${P.gold}" stroke-width="8" stroke-dasharray="18 12"/>`;
  return `${s20_street(g,{frozen:1,heapGlow:gv?1:0})}${s20_lorryAt(480,.72,g)}${s20_nan(1540,630,.72,g)}${s20_streetFx(g)}
   ${s20_gl({x:1180,y:560,s:.62,t:g,mouth:gv?'o':'flat',brows:'raised',look:Math.sin(g*1.5),shiver:ha?1:0})}
   ${ra&&!gv?`${ring(300,330,90,p.rain??2.97)}${T(300,460,'RAIN',{size:44,fill:P.ice})}`:''}${rl&&!gv?`${ring(1000,700,120,p.rail??3.97)}${T(1000,560,'RAILINGS',{size:44,fill:P.white})}`:''}${ca&&!gv?`${ring(640,480,120,p.cars??4.93)}${T(640,340,'PARKED CARS',{size:44,fill:P.white})}`:''}
   ${gv?`${ring(1330,640,200,p.gravel??6.36)}${s20_pill(1330,410,'LOOSE GRAVEL!',P.gold,52,pop(t,(p.gravel??6.36)+1.2))}`:''}
   ${bu?`${s20_fuel(330,620,.7,.1-prog(t,p.burn??15.51,d)*.05,g,{label:'BURNING FUEL'})}`:''}
   ${s20_hud(g)}${T(620,150,th?'13 MINUTES LEFT':'HE LOOKS AROUND',{size:84,fill:th?P.gold:P.white,sc:pop(t,th?p.thirteen??11.72:.1)})}`;
},
spdRamp(t,d,p,g){
  const mo=p.mount??5.67, sh=p.shoes??21.0;
  if(t<mo) return `${s20_hall(g,{lights:.6,ladder:0,frozen:1})}<rect width="1920" height="1080" fill="#05030C" opacity=".4"/>${s20_poster(1240,470,.95*pop(t,(p.ramps??3.84)-.6),g)}
    ${s20_gl({x:560,y:560,s:.95,t:g,mouth:'o',brows:'raised',look:1,glint:AT(t,p.ramps??3.84)?1:0,pose:'point'})}${T(560,170,'HE REMEMBERS...',{size:84,fill:P.white,sc:IN(t,.1)})}`;
  if(t>=sh){const sv=AT(t,p.save??23.84);
    return `${card('cardDark',g)}${s20_DEFS}<g transform="translate(480,560)">${s20_shoe(0,60,1,{melt:1,col:'#C9C2B8',g,sm:1})}</g>${T(480,780,'DESTROYED HIS SHOES',{size:52,fill:P.red})}
     ${T(960,520,'→',{size:160,fill:P.white})}${sv?`<g transform="scale(${pop(t,p.save??23.84)})" style="transform-origin:1440px 560px">${s20_heap(1440,660,520,260,1)}${person({x:1440,y:300,s:.5,t:0,who:'nan',mouth:'smile'})}</g>${T(1440,780,'WILL SAVE NAN',{size:52,fill:P.mint})}`:''}
     ${T(960,160,'FRICTION',{size:140,fill:P.gold,sc:pop(t,sh)})}`;}
  const br=p.brakes??10.98, k=prog(t,br,br+5), en=AT(t,p.energy??17.58);
  const path=s=>{const pts=[[100,300],[700,620],[1100,700],[1500,640]];const i=Math.min(2,Math.floor(s*3)),f=s*3-i;return [lerp(pts[i][0],pts[i+1][0],f),lerp(pts[i][1],pts[i+1][1],f),Math.atan2(pts[i+1][1]-pts[i][1],pts[i+1][0]-pts[i][0])*180/Math.PI];};
  const kk=eout(k);const [lx,ly,la]=path(lerp(.15,1,kk*(kk<.66?1:1)));const sink=AT(t,p.sink??14)?14:0;
  let spray='';if(k>.6&&k<1){const r=rng(Math.floor(g*10));for(let i=0;i<10;i++)spray+=`<circle cx="${(lx-60+r()*60).toFixed(0)}" cy="${(ly-30-r()*90).toFixed(0)}" r="${(5+r()*7).toFixed(0)}" fill="#B8AE9C" stroke="${INK}" stroke-width="2"/>`;}
  return `${s20_DEFS}<rect width="1920" height="1080" fill="url(#s20mtn)"/><path d="M0 520 L360 140 L640 420 L980 120 L1400 460 L1920 200 V1080 H0Z" fill="#8A5A6A" stroke="${INK}" stroke-width="6"/><path d="M300 210 L360 140 L420 210 Z M920 190 L980 120 L1040 190Z" fill="#fff"/>
   <path d="M-40 280 L700 640 L1960 1000" stroke="#3A3F52" stroke-width="90" fill="none"/><path d="M-40 280 L700 640 L1960 1000" stroke="#fff" stroke-width="5" fill="none" stroke-dasharray="40 40"/>
   <path d="M700 640 L1100 720 L1560 650" stroke="#9A8F80" stroke-width="120" fill="none" stroke-linejoin="round"/>${s20_stones(760,1540,x=>x<1100?640+(x-700)*.2-50:720-(x-1100)*.152-50,x=>x<1100?640+(x-700)*.2+50:720-(x-1100)*.152+50,160,11)}
   ${AT(t,br)?`<g transform="translate(${lx.toFixed(0)},${(ly+sink*k).toFixed(0)})">${s20_lorry(0,0,.42,la,g,{panic:1,lights:1})}</g>${spray}`:''}
   ${s20_pill(1280,860,'DEEP, LOOSE GRAVEL',P.gold,44,IN(t,mo+.6))}${AT(t,p.sink??14)?s20_pill(560,860,'WHEELS SINK',P.coral,44,pop(t,p.sink??14)):''}
   ${en?s20_pill(960,260,'ENERGY → SHOVING STONES ASIDE',P.mint,48,pop(t,p.energy??17.58)):''}
   ${T(960,150,'ESCAPE LANES',{size:110,fill:P.white,sc:IN(t,mo)})}`;
},
spdBuns(t,d,p,g){
  const tn=p.tin??1.94, so=AT(t,p.sorry??5.32), su=AT(t,p.sugar??6.5), stv=AT(t,p.steady??8.16), kc=AT(t,p.kcal??9.93), en=AT(t,p.enough??13.3), ju=AT(t,p.just??18.56);
  const eaten=AT(t,tn)?Math.min(6,Math.floor((t-tn-.4)*2.2)+1):0, left=6-Math.max(0,eaten);
  const v=su?lerp(.08,.55,eout(prog(t,p.sugar??6.5,(p.sugar??6.5)+3))):.08;
  return `${card('cardWarm',g)}${s20_DEFS}${s20_rain(g,{frozen:1,n:40})}${person({x:1400,y:520,s:1,t:0,who:'nan',pose:'hold',look:1,mouth:'smile'})}${s20_carrier(1400+62*.92,520+90*.92,.55*.92,{hiss:1})}
   ${s20_tin(1080,720,.9,{open:AT(t,tn)?1:0,n:left})}
   ${s20_gl({x:620,y:540,s:1,t:g,mouth:eaten>0&&eaten<6&&!so?'grin':'smile',brows:so?'sad':'raised',pose:'reach',glint:su?1:0})}${eaten>0&&eaten<6?s20_bun(760,520+Math.sin(g*12)*6,.7):''}
   ${s20_fuel(330,280,.7,v,g)}${!stv?s20_flicker(g,.8,1):''}
   ${AT(t,tn)?`<g transform="translate(1720,330)">${T(0,0,String(Math.max(0,eaten)),{size:150,fill:P.gold})}${T(0,70,'BUNS EATEN',{size:40,fill:P.white})}</g>`:''}
   ${so&&!kc?s20_pill(1080,520,'SORRY, NAN',P.coral,48,pop(t,p.sorry??5.32)):''}${stv&&!kc?s20_pill(330,520,'FLICKER STEADIES',P.mint,40,pop(t,p.steady??8.16)):''}
   ${kc?s20_pill(960,840,'6 BUNS ≈ 2,000 CALORIES',P.gold,48,pop(t,p.kcal??9.93)):''}${en?s20_pill(1100,300,ju?'JUST ENOUGH':'15 MIN OF WORK (HIS TIME)',ju?P.mint:P.white,42,pop(t,ju?p.just??18.56:p.enough??13.3)):''}
   ${s20_hud(g)}${T(620,150,'FIRST: FUEL',{size:110,fill:P.gold,sc:IN(t,.1)})}`;
},
spdShovel(t,d,p,g){
  const bu=p.build??4.94, wk=AT(t,p.walk??2.85), sm=AT(t,p.smoke??15.27), ar=AT(t,p.arms??16.69);
  const bed=AT(t,bu)?eout(prog(t,bu,bu+11.4)):0;const r=rng(3);
  const gx=lerp(1380,860,bed);const gy=s20_hy(gx);
  const ghosts=AT(t,bu)?[0,1,2].map(i=>{const x=gx+80+i*120;return `<g opacity="${(.32-.09*i).toFixed(2)}">${glint({x,y:s20_hy(x)-190,s:.6,t:g,pose:'reach',blink:0,tint:'#FFE9A8'})}</g>`;}).join(''):'';
  const shov=`<g transform="translate(${gx-80},${gy-110}) rotate(${(-30+Math.sin(g*6)*30).toFixed(0)})"><path d="M0 0 L-120 60" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M0 0 L-120 60" stroke="#B88A5A" stroke-width="7" stroke-linecap="round"/><path d="M-120 40 L-170 70 L-150 110 L-100 80Z" fill="#9AA7BD" stroke="${INK}" stroke-width="6"/></g>`;
  return `${s20_street(g,{frozen:1,heap:1-bed*.75,bed})}${s20_lorryAt(480,.72,g)}${s20_nan(1540,630,.72,g)}${s20_streetFx(g)}
   ${ghosts}${s20_gl({x:gx,y:gy-190,s:.6,t:g,pose:'reach',mouth:ar?'teeth':'grin',brows:ar?'angry':'raised',legs:'walk',sweat:ar?1:0})}${shov}
   ${sm?s20_smoke(gx-20,gy-10,g,1,1)+s20_smoke(gx+30,gy-10,g+.4,1,1):''}${ar?`<circle cx="${gx}" cy="${gy-150}" r="110" fill="url(#gRed)" opacity="${(.4+.3*Math.sin(g*6)).toFixed(2)}"/>`:''}
   ${s20_map(1150,340,.75,bed,g)}${wk?s20_pill(620,880-40,'WALK, NEVER SPRINT',P.mint,40,pop(t,p.walk??2.85)):''}
   ${sm?s20_pill(1060,470,ar?'ARMS BURN':'SHOES SMOKE',P.red,40,pop(t,ar?p.arms??16.69:p.smoke??15.27)):''}
   ${s20_hud(g)}${T(760,150,'SHOVEL AFTER SHOVEL',{size:80,fill:P.white,sc:IN(t,.1)})}`;
},
spdSteer(t,d,p,g){
  const na=p.nan??5.02;
  if(t<na){const k=eout(prog(t,.8,na-.5));
    return `${card('cardDark',g)}${s20_DEFS}<rect x="160" y="160" width="1600" height="680" rx="40" fill="#2A3A5A" stroke="${INK}" stroke-width="10"/><path d="M220 220 H1700 V520 H220Z" fill="#9CC8FF" opacity=".5" stroke="${INK}" stroke-width="8"/>${s20_rain(g,{frozen:1,n:30,x0:220,w:1480,y1:520,seed:44})}
     <g transform="translate(1250,460)"><circle r="90" fill="#E8B98A" stroke="${INK}" stroke-width="8"/><circle cx="-30" cy="-14" r="24" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="34" cy="-14" r="24" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-26" cy="-14" r="9" fill="${INK}"/><circle cx="38" cy="-14" r="9" fill="${INK}"/><ellipse cx="4" cy="44" rx="18" ry="24" fill="#3a1220"/></g>
     <g transform="translate(860,620) rotate(${(-50*k).toFixed(1)})"><circle r="200" fill="none" stroke="${INK}" stroke-width="44"/><circle r="200" fill="none" stroke="#3A3F52" stroke-width="30"/><path d="M-190 0 H190 M0 0 V190" stroke="${INK}" stroke-width="30"/><path d="M-190 0 H190 M0 0 V190" stroke="#3A3F52" stroke-width="18"/><circle r="50" fill="#3A3F52" stroke="${INK}" stroke-width="8"/></g>
     <path d="M500 860 Q560 760 690 520" stroke="${INK}" stroke-width="40" fill="none" stroke-linecap="round"/><path d="M500 860 Q560 760 690 520" stroke="${P.cream}" stroke-width="26" fill="none" stroke-linecap="round"/>
     <path d="M520 360 A340 340 0 0 0 420 620" stroke="${P.mint}" stroke-width="14" fill="none" stroke-linecap="round" opacity="${(.4+.6*k).toFixed(2)}"/><path d="M420 620 l-10 -50 m10 50 l44 -24" stroke="${P.mint}" stroke-width="14" fill="none" stroke-linecap="round" opacity="${(.4+.6*k).toFixed(2)}"/>
     ${s20_pill(960,920-60,'SLOWLY... TOWARD THE GRAVEL',P.gold,44,IN(t,1.2))}${s20_map(1660,330,.6,1,g,{steer:k})}${s20_hud(g)}${T(700,150,'HE TURNS THE WHEEL',{size:80,fill:P.white,sc:IN(t,.1)})}`;}
  const ng=AT(t,p.nograb??6.89), ar=p.arm??8.25, wo=AT(t,p.world??13.6);
  const k=AT(t,ar)?eout(prog(t,ar+.3,(p.world??13.6)+1.5)):0, nx=lerp(1080,1500,k);
  return `<g transform="translate(-1700,-760) scale(1.9)">${s20_street(g,{frozen:1,heap:0,bed:1,cars:0})}</g>${s20_rain(g,{frozen:1,n:60,seed:31,big:1.6})}
   ${person({x:nx,y:520,s:1.2,t:0,who:'nan',pose:'hold',look:1,mouth:'smile',blink:0,rot:-4*k})}${s20_carrier(nx+62*1.1,520+90*1.1,.55*1.1,{hiss:1})}${s20_tin(nx-10*1.1,520+105*1.1,.42*1.1)}
   ${s20_gl({x:nx-280,y:540,s:1,t:g,pose:AT(t,ar)?'reach':'down',mouth:'flat',brows:'raised',look:1,rot:AT(t,ar)?10:0})}
   ${!AT(t,ar)&&ng?s20_pill(700,330,"HE DOESN'T GRAB HER",P.red,44,pop(t,p.nograb??6.89)):''}${AT(t,ar)?s20_pill(700,330,'GENTLY... 3 MINUTES (HIS TIME)',P.gold,40,pop(t,ar)):''}
   ${wo?s20_pill(1300,880-60,'TO THE WORLD: 2 STEPS BACK',P.mint,44,pop(t,p.world??13.6)):''}
   ${s20_hud(g)}${T(700,150,'LAST: NAN',{size:110,fill:P.white,sc:IN(t,na+.1)})}`;
},
spdCrash(t,d,p,g){
  const sn=p.snd??1.31, hi=p.hit??3.48, sp=AT(t,p.spray??6.22), gr=AT(t,p.groan??7.72), st=p.stop??9.06, me=AT(t,p.metre??11.5);
  const X=t<sn?480:t<hi?lerp(480,840,prog(t,sn,hi)):lerp(840,1262,eout(prog(t,hi,st+.4)));
  const shake=t>hi&&t<st+.6?Math.sin(g*50)*6:0;
  let spray='';if(t>hi&&t<st+1){const r=rng(Math.floor(g*12));const fx=X+200;for(let i=0;i<16;i++)spray+=`<ellipse cx="${(fx-120+r()*240).toFixed(0)}" cy="${(s20_hy(fx)-40-r()*200).toFixed(0)}" rx="${(7+r()*8).toFixed(0)}" ry="${(5+r()*6).toFixed(0)}" fill="#B8AE9C" stroke="${INK}" stroke-width="3"/>`;}
  const rings=AT(t,sn)?[0,1,2].map(i=>{const k=clamp((t-sn)/1.4-i*.18);return k>0&&k<1?`<circle cx="960" cy="540" r="${(60+k*900).toFixed(0)}" fill="none" stroke="#fff" stroke-width="${(22*(1-k)).toFixed(1)}" opacity="${(1-k).toFixed(2)}"/>`:'';}).join(''):'';
  return `<g transform="translate(${shake.toFixed(1)},0)">${s20_street(g,{frozen:0,heap:.25,bed:1})}${s20_lorryAt(X,.72,g,{panic:1})}${spray}
   ${person({x:1800,y:610,s:.7,t:g,who:'nan',pose:'hold',look:-1,mouth:me?'o':'smile',brows:me?'raised':'calm',blink:BL(g)})}${s20_carrier(1800+62*.65,610+90*.65,.36)}
   ${s20_gl({x:1660,y:630,s:.55,t:g,mouth:'o',brows:'raised',look:-1})}${s20_streetFx(g,{frozen:0})}</g>${rings}
   ${me?`<g opacity="${prog(t,p.metre??11.5,(p.metre??11.5)+.5)}"><rect x="1490" y="520" width="110" height="300" rx="50" fill="none" stroke="${P.gold}" stroke-width="7" stroke-dasharray="16 12"/><path d="M${1262+200} 470 H1500" stroke="${P.gold}" stroke-width="8"/>${T(1480,440,'1 METRE',{size:52,fill:P.gold})}</g>`:''}
   ${AT(t,sn)&&t<hi?T(960,160,'SOUND CRASHES BACK',{size:90,fill:P.white,sc:pop(t,sn)}):''}${sp&&!gr?T(760,300,'STONES SPRAY',{size:70,fill:'#CFC6B4',sc:pop(t,p.spray??6.22)}):''}
   ${gr&&!AT(t,st)?T(760,300,'METAL GROANS',{size:70,fill:P.white,sc:pop(t,p.groan??7.72)}):''}${AT(t,st)?T(800,190,'CRUNCH.',{size:200,fill:P.gold,stroke:46,rot:-4,sc:pop(t,st)}):''}`;
},
spdKerb(t,d,p,g){
  const em=AT(t,p.empty??2.12), sh=AT(t,p.shaking??2.95), ba=AT(t,p.bare??3.84), go=AT(t,p.gone??4.94), si=p.sits??8.5, mi=AT(t,p.miss??11.64), sa=p.says??15.3, fr=AT(t,p.fridge??18.26), no=AT(t,p.notice??20.18);
  const ns=AT(t,si);
  return `<g transform="translate(0,-260) scale(1.3)">${s20_street(g,{frozen:0,heap:.25,bed:1,rain:1})}${s20_lorryAt(1262,.72,g,{panic:0,brake:0})}</g>${s20_rain(g,{frozen:0,n:50,op:.5})}
   <rect x="0" y="780" width="1920" height="120" fill="#7A8096" stroke="${INK}" stroke-width="7"/>
   ${s20_gl({x:760,y:520,s:1,t:g,legs:'sit',mouth:ns?'o':'flat',brows:ns?'raised':'sad',pose:'down',lid:ns?0:.35,shiver:sh&&!ns?.6:0,look:ns?1:0})}
   ${[0,1].map(i=>s20_shoe(470+i*90,800,.32,{melt:1,col:'#C9C2B8',g,sm:.6,rot:-6+i*10})).join('')}
   ${ns?`${person({x:1150,y:520,s:.95,t:g,who:'nan',legs:'sit',pose:'hold',mouth:AT(t,sa)?'grin':'smile',brows:'calm',look:-1,blink:BL(g)})}${s20_tin(1170,690,.6,{open:1,n:0})}`:''}
   ${!ns&&!go&&em?s20_pill(1130,380,'EMPTY',P.coral,46,pop(t,p.empty??2.12)):''}${!ns&&!go&&sh?s20_pill(1130,490,'SHAKING',P.coral,46,pop(t,p.shaking??2.95)):''}${!ns&&!go&&ba?s20_pill(1130,600,'BAREFOOT',P.coral,46,pop(t,p.bare??3.84)):''}
   ${go&&!ns?`<g transform="translate(1130,520) scale(${pop(t,p.gone??4.94)})">${s20_switch(0,0,.7,false,'')}</g>${T(960,170,'POWER: GONE FOR GOOD?',{size:80,fill:P.white,sc:pop(t,p.gone??4.94)})}`:''}
   ${mi&&!AT(t,sa)?s20_pill(1170,860-40,'6 BUNS MISSING',P.red,44,pop(t,p.miss??11.64)):''}${AT(t,p.nos??13.55)&&!AT(t,sa)?T(960,170,"SHE DOESN'T LOOK SURPRISED",{size:76,fill:P.gold,sc:pop(t,p.nos??13.55)}):''}
   ${AT(t,sa)?s20_bub(1300,210,820,no?"YOU THINK I":fr?'AN EMPTY FRIDGE':'MELTED SHOES',no?"DIDN'T NOTICE?":fr?'EVERY MORNING.':'EVERY NIGHT.',{size:54,tail:'left'}):''}`;
},
spdTwist(t,d,p,g){
  const wo=AT(t,p.worried??2.41), kn=AT(t,p.knew??4.04), fu=AT(t,p.fuel??5.55), gd=p.grandad??7.69;
  if(t<gd){let tr='';for(let i=0;i<9;i++){const x=300+(i%3)*190,y=560-Math.floor(i/3)*70;tr+=`<rect x="${x-80}" y="${y}" width="170" height="20" rx="6" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/>${[0,1,2].map(j=>s20_bun(x-45+j*45,y-12,.36)).join('')}`;}
    return `${s20_kitchen(g,{oven:1,kettle:0,clock:2+t})}${tr}${person({x:1180,y:600,s:.85,t:g,who:'nan',pose:'hold',mouth:kn?'grin':'smile',brows:kn?'raised':'calm',blink:BL(g)})}
     ${wo?`<g transform="translate(1560,330) scale(${pop(t,p.worried??2.41)})">${labelPill(0,0,'WORRIED',P.white,48)}<path d="M-150 0 H150" stroke="${P.red}" stroke-width="14" stroke-linecap="round"/></g>`:''}
     ${kn?s20_pill(1560,460,'SHE KNEW',P.gold,64,pop(t,p.knew??4.04)):''}${fu?`<g transform="translate(1560,700) scale(${pop(t,p.fuel??5.55)})">${s20_fuel(0,0,.7,.95,g,{label:'GLINT FUEL'})}</g>`:''}
     ${T(960,150,'BAKING ALL WEEK',{size:96,fill:P.white,sc:IN(t,.1)})}`;}
  const ph=`<circle cx="0" cy="-70" r="60" fill="#E8C9A0" stroke="${INK}" stroke-width="6"/><circle cx="-22" cy="-74" r="18" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="22" cy="-74" r="18" fill="none" stroke="${INK}" stroke-width="5"/><path d="M-16 -46 Q0 -34 16 -46" stroke="${INK}" stroke-width="5" fill="none"/><path d="M-30 -10 Q0 0 30 -10 L36 10 Q0 22 -36 10Z" fill="#2E8A6A" stroke="${INK}" stroke-width="4"/><path d="M-60 40 H60 V170 H-60Z" fill="#8A7A6A" stroke="${INK}" stroke-width="5"/>${[0,1,2,3,4].map(i=>`<ellipse cx="80" cy="${150-i*16}" rx="46" ry="9" fill="#fff" stroke="${INK}" stroke-width="4"/>`).join('')}`;
  return `<g transform="translate(0,-260) scale(1.3)">${s20_street(g,{frozen:0,heap:.25,bed:1})}</g>${s20_rain(g,{frozen:0,n:40,op:.5})}<rect x="0" y="780" width="1920" height="120" fill="#7A8096" stroke="${INK}" stroke-width="7"/>
   ${s20_gl({x:620,y:520,s:1,t:g,legs:'sit',mouth:'o',brows:'raised',look:1,pose:'reach'})}${person({x:1000,y:520,s:.95,t:g,who:'nan',legs:'sit',pose:'reach',mouth:'smile',look:-1,blink:BL(g)})}
   <g transform="translate(1520,420) rotate(6) scale(${pop(t,gd+3)})">${s20_frame(0,0,1,ph)}</g>${AT(t,gd+3)?T(1520,700,'GRANDAD',{size:56,fill:P.gold}):''}
   ${s20_bub(800,190,940,'YOUR GRANDAD USED TO','EAT LIKE THAT TOO, YOU KNOW.',{size:44})}`;
},
spdAsk(t,d,p,g){
  const q=AT(t,p.q??.5), hu=AT(t,p.hung??4.4), sh=AT(t,p.shoes??6.6), so=AT(t,p.sound??8.4), wy=AT(t,p.wy??9.9);
  return `${bgNight(g)}${s20_DEFS}${s20_lines(960,600,g,{len:500,h:300,op:.5})}${s20_fast({x:960,y:620,s:1.2,t:g,pose:'shrug',mouth:'smirk',brows:'raised',glint:1},2,-130,.6)}
   ${s20_pill(420,360,'100x FASTER',P.mint,56,IN(t,1.5))}${hu?s20_pill(1500,320,'100x HUNGRIER',P.red,48,pop(t,p.hung??4.4)):''}${sh?s20_pill(1500,450,'A PAIR OF SHOES A DAY',P.red,42,pop(t,p.shoes??6.6)):''}${so?s20_pill(1500,580,'NO SOUND',P.red,48,pop(t,p.sound??8.4)):''}
   ${T(960,170,'WOULD YOU TAKE IT?',{size:110,fill:P.gold,sc:IN(t,.2)})}`;
}
});
