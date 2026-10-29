// episode 015 scenes (hibernate like a bear)
const h15_BR='#8B5A3C', h15_BRD='#5E3A26', h15_MUZ='#D9A27A';
const h15_MON=['NOV','DEC','JAN','FEB','MAR','APR'];
function h15_zzz(x,y,g,s=1,col=P.ice){let z='';for(let i=0;i<3;i++){const k=((g*.45+i/3)%1);z+=T(x+k*70*s,y-k*130*s,'Z',{size:(34+i*12)*s,fill:col,stroke:7*s,op:Math.sin(k*Math.PI)});}return z;}
function h15_snow(g,n=70,op=1,x0=0,y0=0,w=1920,h=1080){const r=rng(17);let s='';for(let i=0;i<n;i++){const x=x0+r()*w,sp=40+r()*70,y=y0+((r()*h+g*sp)%h),rr=3+r()*6;s+=`<circle cx="${x+Math.sin(g+i)*14}" cy="${y}" r="${rr}" fill="#fff" opacity="${op*(.5+r()*.5)}"/>`;}return s;}
function h15_bgSnow(g,flakes=1,moon=1){
  return `<rect width="1920" height="1080" fill="url(#sky)"/>${bgCard('cardDark',g).replace('<rect width="1920" height="1080" fill="url(#cardDark)"/>','')}
   ${moon?`<circle cx="1560" cy="200" r="70" fill="#fff4dc" opacity=".9"/><circle cx="1560" cy="200" r="200" fill="url(#moon)" opacity=".5"/>`:''}
   <path d="M-50 1080 V760 Q300 680 700 730 Q1200 660 1970 740 V1080Z" fill="#DDEBFA" stroke="${INK}" stroke-width="8"/>
   <path d="M-50 1080 V860 Q500 800 1000 850 Q1500 800 1970 860 V1080Z" fill="#F2F8FF"/>${flakes?h15_snow(g,70,flakes):''}`;
}
function h15_bgSpring(g){
  return `<rect width="1920" height="1080" fill="#7CC4FF"/><rect y="0" width="1920" height="300" fill="#5AAEF0"/>
   <circle cx="1600" cy="190" r="${80+Math.sin(g*2)*4}" fill="${P.gold}" stroke="${INK}" stroke-width="8"/><circle cx="1600" cy="190" r="220" fill="url(#gGold)" opacity=".6"/>
   ${[[300,180],[900,130]].map(([x,y],i)=>`<g transform="translate(${x+Math.sin(g*.3+i)*30},${y})"><ellipse rx="110" ry="40" fill="#fff"/><ellipse cx="-40" cy="-26" rx="60" ry="40" fill="#fff"/><ellipse cx="40" cy="-20" rx="50" ry="34" fill="#fff"/></g>`).join('')}
   <path d="M-50 1080 V760 Q300 680 700 730 Q1200 660 1970 740 V1080Z" fill="#5FBF5A" stroke="${INK}" stroke-width="8"/>
   <path d="M-50 1080 V860 Q500 800 1000 850 Q1500 800 1970 860 V1080Z" fill="#4AA845"/>
   ${[[180,820],[420,860],[1280,830],[1500,870],[1760,830]].map(([x,y],i)=>`<g transform="translate(${x},${y+Math.sin(g*2+i)*3})"><path d="M0 0 V-40" stroke="#2E7D32" stroke-width="6"/>${[0,72,144,216,288].map(a=>`<circle cx="${Math.cos(a/57.3)*14}" cy="${-40+Math.sin(a/57.3)*14}" r="11" fill="${['#FF8FA3','#FFE14D','#fff'][i%3]}" stroke="${INK}" stroke-width="3"/>`).join('')}<circle cy="-40" r="9" fill="${P.gold}" stroke="${INK}" stroke-width="3"/></g>`).join('')}`;
}
function h15_bgSpace(g){const r=rng(41);let s='';for(let i=0;i<140;i++){const x=r()*1920,y=r()*1080,z=r()*2.6+.5;s+=`<circle cx="${x}" cy="${y}" r="${z}" fill="#fff" opacity="${.3+.6*Math.abs(Math.sin(g*1.5+i))}"/>`;}
  return `<rect width="1920" height="1080" fill="#070818"/><circle cx="400" cy="300" r="500" fill="#2A1846" opacity=".35"/><circle cx="1600" cy="800" r="520" fill="#14324A" opacity=".35"/>${s}`;}
// black bear, side view facing right; origin at ground under body
function h15_bear(x,y,s,g,o={}){const {walk=0,eyes='open',dir=1}=o; const lg=walk?Math.sin(g*7)*16:0; const by=walk?-Math.abs(Math.sin(g*7))*6:Math.sin(g*2)*3;
  const leg=(lx,ph,c)=>`<g transform="rotate(${ph} ${lx} -110)"><rect x="${lx-24}" y="-120" width="48" height="120" rx="22" fill="${c}" stroke="${INK}" stroke-width="7"/></g>`;
  return `<g transform="translate(${x},${y}) scale(${s*dir},${s})"><ellipse cx="20" cy="4" rx="200" ry="18" fill="rgba(0,0,0,.3)"/>
   ${leg(-120,-lg,h15_BRD)}${leg(80,lg,h15_BRD)}
   <g transform="translate(0,${by})"><ellipse cx="0" cy="-180" rx="200" ry="120" fill="${h15_BR}" stroke="${INK}" stroke-width="9"/>
    <path d="M-130 -265 q70 -40 170 -22" stroke="#A9744F" stroke-width="16" fill="none" stroke-linecap="round" opacity=".7"/>
    <ellipse cx="-196" cy="-200" rx="26" ry="20" fill="${h15_BR}" stroke="${INK}" stroke-width="7"/>
    <g transform="translate(190,-250)"><circle cx="-40" cy="-72" r="30" fill="${h15_BR}" stroke="${INK}" stroke-width="8"/><circle cx="-40" cy="-72" r="13" fill="${h15_MUZ}"/>
     <circle cx="0" cy="0" r="88" fill="${h15_BR}" stroke="${INK}" stroke-width="9"/><circle cx="30" cy="-80" r="26" fill="${h15_BR}" stroke="${INK}" stroke-width="8"/><circle cx="30" cy="-80" r="11" fill="${h15_MUZ}"/>
     <ellipse cx="72" cy="22" rx="50" ry="38" fill="${h15_MUZ}" stroke="${INK}" stroke-width="7"/><ellipse cx="110" cy="8" rx="17" ry="13" fill="${INK}"/>
     ${eyes==='closed'?`<path d="M14 -24 q14 10 28 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`:`<circle cx="28" cy="-24" r="12" fill="${INK}"/><circle cx="32" cy="-28" r="4" fill="#fff"/>`}
     <path d="M66 48 q22 10 42 -4" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/></g></g>
   ${leg(-70,lg,h15_BR)}${leg(130,-lg,h15_BR)}</g>`;
}
// curled sleeping bear; origin bottom centre
function h15_bearSleep(x,y,s,g){const br=1+Math.sin(g*.9)*.025;
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="230" ry="20" fill="rgba(0,0,0,.35)"/><g transform="scale(${br})">
   <ellipse cx="20" cy="-120" rx="220" ry="120" fill="${h15_BR}" stroke="${INK}" stroke-width="9"/>
   <path d="M-100 -215 q110 -45 230 -10" stroke="#A9744F" stroke-width="16" fill="none" stroke-linecap="round" opacity=".7"/>
   <circle cx="-185" cy="-185" r="28" fill="${h15_BR}" stroke="${INK}" stroke-width="8"/><circle cx="-185" cy="-185" r="11" fill="${h15_MUZ}"/>
   <circle cx="-140" cy="-100" r="84" fill="${h15_BR}" stroke="${INK}" stroke-width="9"/>
   <ellipse cx="-92" cy="-60" rx="46" ry="32" fill="${h15_MUZ}" stroke="${INK}" stroke-width="7"/><ellipse cx="-56" cy="-70" rx="15" ry="11" fill="${INK}"/>
   <path d="M-170 -110 q14 10 28 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
   <path d="M-30 -10 q100 20 200 -20" stroke="${h15_BRD}" stroke-width="44" fill="none" stroke-linecap="round"/><path d="M-30 -10 q100 20 200 -20" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".4"/></g></g>`;
}
// snowy den mound; inner drawn inside the opening (den coords, floor y=0)
function h15_den(x,y,s,o={}){const {snow=1,inner='',melt=0}=o;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-560 0 Q-500 -440 0 -460 Q500 -440 560 0Z" fill="#4A3A4E" stroke="${INK}" stroke-width="10"/>
   <path d="M-330 0 Q-320 -300 0 -310 Q320 -300 330 0Z" fill="#140B16" stroke="${INK}" stroke-width="8"/>${inner}
   ${snow?`<path d="M-500 -240 Q-450 -440 0 -460 Q450 -440 500 -240 Q440 -290 360 -262 Q270 -${340-melt*60} 120 -312 Q0 -${372-melt*60} -150 -312 Q-270 -${340-melt*60} -360 -262 Q-440 -300 -500 -240Z" fill="#F2F8FF" stroke="${INK}" stroke-width="8" opacity="${1-melt*.6}"/>`:''}</g>`;
}
function h15_cal(x,y,s,m,o={}){const {col=P.red,flip=1,sub=''}=o;
  return `<g transform="translate(${x},${y}) scale(${s},${s*flip})"><rect x="-120" y="-110" width="240" height="240" rx="18" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><path d="M-120 -40 V-92 Q-120 -110 -102 -110 H102 Q120 -110 120 -92 V-40Z" fill="${col}" stroke="${INK}" stroke-width="8"/>
   <circle cx="-60" cy="-110" r="13" fill="${INK}"/><circle cx="60" cy="-110" r="13" fill="${INK}"/><text y="${sub?50:70}" text-anchor="middle" font-size="84" font-weight="900" fill="${INK}">${m}</text>${sub?`<text y="105" text-anchor="middle" font-size="38" font-weight="900" fill="${col}">${sub}</text>`:''}</g>`;
}
// calendar that flips through h15_MON between a and b
function h15_flipCal(x,y,s,t,a,b){const f=(clamp((t-a)/(b-a)))*5, i=Math.floor(f+1e-6), fr=f-i; const fl=(t>a&&t<b)?Math.abs(Math.cos(fr*Math.PI)):1;
  return h15_cal(x,y,s,h15_MON[Math.min(5,i)],{flip:Math.max(.35,fl),col:i>=5?'#4AA845':P.red});}
function h15_need(kind,x,y,s,cr=0){
  const k={food:`<circle cx="0" cy="10" r="40" fill="${P.red}" stroke="${INK}" stroke-width="6"/><path d="M0 -28 q4 -16 14 -22" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M6 -34 q22 -18 38 -6 q-18 16 -38 6Z" fill="${P.mint}" stroke="${INK}" stroke-width="4"/>`,
    water:`<path d="M0 -52 Q38 0 38 18 A38 38 0 0 1 -38 18 Q-38 0 0 -52Z" fill="${P.iceDeep}" stroke="${INK}" stroke-width="6"/><path d="M-16 10 q0 16 12 22" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    pee:`<path d="M0 -52 Q38 0 38 18 A38 38 0 0 1 -38 18 Q-38 0 0 -52Z" fill="${P.gold}" stroke="${INK}" stroke-width="6"/>`,
    poop:`<g fill="#7A4A2A" stroke="${INK}" stroke-width="5"><ellipse cy="36" rx="46" ry="16"/><ellipse cy="14" rx="36" ry="14"/><ellipse cy="-6" rx="24" ry="12"/></g><path d="M0 -16 q12 -14 -4 -30" stroke="${INK}" stroke-width="6" fill="#7A4A2A"/><circle cx="-12" cy="14" r="5" fill="#fff"/><circle cx="12" cy="14" r="5" fill="#fff"/>`,
    wc:`<rect x="-40" y="-52" width="34" height="54" rx="6" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M-44 0 H42 Q42 30 12 40 L16 56 H-20 L-16 40 Q-44 30 -44 0Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`}[kind];
  return `<g transform="translate(${x},${y}) scale(${s})"><circle r="80" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/>${k}
   ${cr>0?`<circle r="80" fill="none" stroke="${P.red}" stroke-width="14" opacity="${cr}"/><path d="M-56 -56 L${-56+112*cr} ${-56+112*cr}" stroke="${P.red}" stroke-width="16" stroke-linecap="round"/>`:''}</g>`;
}
function h15_dial(x,y,r,k,o={}){const {col=P.red}=o; const a=Math.PI+Math.PI*clamp(k);
  let tk=''; for(let i=0;i<=10;i++){const b=Math.PI+Math.PI*i/10;tk+=`<path d="M${Math.cos(b)*r*.78} ${Math.sin(b)*r*.78} L${Math.cos(b)*r*.92} ${Math.sin(b)*r*.92}" stroke="${INK}" stroke-width="6"/>`;}
  return `<g transform="translate(${x},${y})"><path d="M${-r} 0 A${r} ${r} 0 0 1 ${r} 0Z" fill="#FFF6EA" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>
   <path d="M${-r*.85} 0 A${r*.85} ${r*.85} 0 0 1 ${Math.cos(Math.PI*1.25)*r*.85} ${Math.sin(Math.PI*1.25)*r*.85}" stroke="${P.iceDeep}" stroke-width="16" fill="none"/>
   <path d="M${Math.cos(Math.PI*1.75)*r*.85} ${Math.sin(Math.PI*1.75)*r*.85} A${r*.85} ${r*.85} 0 0 1 ${r*.85} 0" stroke="${P.red}" stroke-width="16" fill="none"/>${tk}
   <path d="M0 0 L${Math.cos(a)*r*.8} ${Math.sin(a)*r*.8}" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M0 0 L${Math.cos(a)*r*.8} ${Math.sin(a)*r*.8}" stroke="${col}" stroke-width="7" stroke-linecap="round"/><circle r="18" fill="${INK}"/></g>`;
}
function h15_bar(x,y,w,k,lab,col=P.mint,size=40){const c=k<.45?P.red:col;
  return `<g transform="translate(${x},${y})">${T(-w/2,-24,lab,{size,fill:P.white,anchor:'start',stroke:8})}<rect x="${-w/2}" y="0" width="${w}" height="60" rx="30" fill="#1A1430" stroke="${INK}" stroke-width="8"/>
   <rect x="${-w/2+8}" y="8" width="${Math.max(0,(w-16)*clamp(k))}" height="44" rx="22" fill="${c}"/></g>`;
}
function h15_bone(x,y,s,k=1,rot=0){ // k = strength (1 solid, lower = holes + paler)
  const sh=(f,sw)=>`<g fill="${f}" stroke="${INK}" stroke-width="${sw}"><circle cx="-150" cy="-30" r="42"/><circle cx="-150" cy="30" r="42"/><circle cx="150" cy="-30" r="42"/><circle cx="150" cy="30" r="42"/><rect x="-150" y="-28" width="300" height="56"/></g>`;
  const r=rng(8); let h=''; for(let i=0;i<14;i++){const hx=-170+r()*340,hy=-30+r()*60; h+=`<circle cx="${hx}" cy="${hy}" r="${4+r()*9}" fill="#B8AE9C" opacity="${clamp((1-k)*2.2-i*.07)}"/>`;}
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">${sh(INK,16)}${sh(k>.6?'#FFF6EA':'#E9DFC9',0)}${h}</g>`;
}
function h15_shield(x,y,s,g){return `<g transform="translate(${x},${y}) scale(${s})"><circle r="${150+Math.sin(g*3)*8}" fill="url(#gMint)" opacity=".7"/><path d="M0 -110 L90 -76 Q92 30 0 110 Q-92 30 -90 -76Z" fill="${P.mint}" stroke="${INK}" stroke-width="9" opacity=".9"/><path d="M-36 0 L-8 28 L40 -30" stroke="${INK}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;}
// lying Glint (head to the left) on a bed, under a blanket
function h15_bed(x,y,s,g,o={}){const {eyes='closed',mouth='smile',blanket=P.violet,lid=0,inner=''}=o;
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-330" y="-40" width="660" height="70" rx="16" fill="#6B4A3A" stroke="${INK}" stroke-width="8"/>
   <rect x="-340" y="-210" width="50" height="320" rx="14" fill="#6B4A3A" stroke="${INK}" stroke-width="8"/><rect x="300" y="-120" width="44" height="230" rx="14" fill="#6B4A3A" stroke="${INK}" stroke-width="8"/>
   <rect x="-300" y="-90" width="600" height="60" rx="24" fill="#E8EEF8" stroke="${INK}" stroke-width="7"/>
   <ellipse cx="-220" cy="-100" rx="80" ry="34" fill="#fff" stroke="${INK}" stroke-width="7"/>
   <g transform="translate(-130,-150) rotate(-90) scale(.62)">${glint({t:g,eyes,mouth,lid,scarf:true})}</g>
   ${inner}<path d="M-150 -150 Q60 ${-190+Math.sin(g*1.2)*6} 300 -140 L300 -40 L-150 -40Z" fill="${blanket}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   <path d="M-110 -120 Q60 -150 270 -110" stroke="#fff" stroke-width="6" fill="none" opacity=".35"/></g>`;
}
// bedroom with a window; win = window content (in window coords 0..W,0..H); cur = curtain closed fraction
function h15_room(g,win,cur=0,o={}){const {wx=1180,wy=150,W=560,H=420,cal=''}=o;
  const cw=(W/2)*clamp(cur);
  return `<rect width="1920" height="1080" fill="url(#room)"/>
   <rect x="${wx-20}" y="${wy-20}" width="${W+40}" height="${H+40}" rx="16" fill="#3B4A78" stroke="${INK}" stroke-width="8"/>
   <svg x="${wx}" y="${wy}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${win}</svg>
   <path d="M${wx+W/2} ${wy} V${wy+H} M${wx} ${wy+H/2} H${wx+W}" stroke="#3B4A78" stroke-width="12"/><rect x="${wx}" y="${wy}" width="${W}" height="${H}" fill="none" stroke="${INK}" stroke-width="6"/>
   <rect x="${wx-50}" y="${wy-50}" width="${W+100}" height="20" rx="10" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/>
   <path d="M${wx-40} ${wy-36} h${60+cw} v${H+80} h${-60-cw}Z" fill="${P.coral}" stroke="${INK}" stroke-width="7"/>
   <path d="M${wx+W+40} ${wy-36} h${-60-cw} v${H+80} h${60+cw}Z" fill="${P.coral}" stroke="${INK}" stroke-width="7"/>
   ${cal}<rect y="820" width="1920" height="260" fill="#141C34"/><path d="M0 820 H1920" stroke="#3B4A78" stroke-width="4"/>`;
}
function h15_winSnow(g,W=560,H=420,depth=.3){return `<rect width="${W}" height="${H}" fill="#0E1838"/><circle cx="${W*.8}" cy="70" r="34" fill="#fff4dc"/>${h15_snow(g,40,1,0,0,W,H)}<path d="M0 ${H} V${H-H*depth} Q${W/2} ${H-H*depth-30} ${W} ${H-H*depth} V${H}Z" fill="#F2F8FF"/>`;}
function h15_winSpring(g,W=560,H=420){return `<rect width="${W}" height="${H}" fill="#7CC4FF"/><circle cx="${W*.75}" cy="90" r="50" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><path d="M0 ${H} V${H-110} Q${W/2} ${H-150} ${W} ${H-110} V${H}Z" fill="#5FBF5A"/>
  ${[80,200,330,450].map((x,i)=>`<circle cx="${x}" cy="${H-70+Math.sin(g*2+i)*3}" r="14" fill="${['#FF8FA3','#FFE14D'][i%2]}" stroke="${INK}" stroke-width="4"/>`).join('')}<path d="M60 70 q20 -14 40 0 q20 -14 40 0" stroke="${INK}" stroke-width="5" fill="none"/>`;}
function h15_phone(x,y,s,n,g,o={}){const {msgs=0}=o;
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-120" y="-220" width="240" height="440" rx="34" fill="${INK}"/><rect x="-104" y="-196" width="208" height="380" rx="18" fill="#22305A"/>
   ${[0,1,2,3,4].map(i=>i<msgs?`<rect x="-90" y="${-180+i*72}" width="180" height="58" rx="14" fill="#FFF6EA" stroke="${INK}" stroke-width="4"/><circle cx="-62" cy="${-151+i*72}" r="16" fill="${[P.mint,P.coral,P.gold,P.violet,P.iceDeep][i]}"/><rect x="-36" y="${-162+i*72}" width="${90-i*8}" height="10" rx="5" fill="#C9C2B8"/><rect x="-36" y="${-144+i*72}" width="${60+i*6}" height="10" rx="5" fill="#C9C2B8"/>`:'').join('')}
   ${n>0?`<g transform="translate(110,-210) scale(${1+Math.max(0,Math.sin(g*8))*.08})"><rect x="-80" y="-44" width="160" height="88" rx="44" fill="${P.red}" stroke="${INK}" stroke-width="8"/><text y="20" text-anchor="middle" font-size="56" font-weight="900" fill="#fff">${n}</text></g>`:''}</g>`;
}
function h15_pizza(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><ellipse rx="120" ry="48" fill="#E0A050" stroke="${INK}" stroke-width="8"/><ellipse rx="100" ry="38" fill="#FFD966"/>
  ${[[-50,-6],[10,-18],[50,8],[-14,16],[60,-20]].map(([a,b])=>`<ellipse cx="${a}" cy="${b}" rx="17" ry="9" fill="${P.red}" stroke="${INK}" stroke-width="3"/>`).join('')}<path d="M-100 0 L100 0 M0 -38 L0 38" stroke="#E0A050" stroke-width="4"/></g>`;}
function h15_cake(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-100" y="-90" width="200" height="110" rx="14" fill="#FF9EC0" stroke="${INK}" stroke-width="8"/><path d="M-100 -60 Q-80 -40 -60 -60 Q-40 -40 -20 -60 Q0 -40 20 -60 Q40 -40 60 -60 Q80 -40 100 -60 V-80 Q100 -94 86 -94 H-86 Q-100 -94 -100 -80Z" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><ellipse cy="20" rx="130" ry="16" fill="#E8EEF8" stroke="${INK}" stroke-width="6"/><circle cy="-112" r="18" fill="${P.red}" stroke="${INK}" stroke-width="5"/></g>`;}
// fat-tailed dwarf lemur (sitting); sleep = curled with closed eyes
function h15_lemur(x,y,s,g,o={}){const {sleep=0,fat=0}=o; const by=Math.sin(g*(sleep?.9:2.2))*3; const c='#A89488', cd='#7A685E';
  const eye=cx=>sleep?`<path d="M${cx-14} -6 q14 10 28 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`:`<circle cx="${cx}" cy="-6" r="22" fill="#4A2A1A"/><circle cx="${cx}" cy="-6" r="17" fill="#FFB547" stroke="${INK}" stroke-width="4"/><circle cx="${cx}" cy="-6" r="9" fill="${INK}"/><circle cx="${cx+5}" cy="-11" r="4" fill="#fff"/>`;
  return `<g transform="translate(${x},${y+by}) scale(${s})"><ellipse cx="0" cy="8" rx="120" ry="14" fill="rgba(0,0,0,.3)"/>
   ${fat>0?`<ellipse cx="70" cy="-30" rx="${130+Math.sin(g*4)*8}" ry="90" fill="url(#gGold)" opacity="${fat}"/>`:''}
   <path d="M30 -10 C150 0 170 -110 110 -150 C80 -170 50 -150 70 -120 C100 -90 110 -50 30 -50Z" fill="${cd}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
   <path d="M60 -30 C130 -30 130 -100 100 -130" stroke="#C7B6AA" stroke-width="10" fill="none" stroke-linecap="round" opacity=".5"/>
   <ellipse cx="-10" cy="-80" rx="80" ry="${sleep?72:90}" fill="${c}" stroke="${INK}" stroke-width="7"/><ellipse cx="-20" cy="-60" rx="40" ry="44" fill="#E2D6CC"/>
   <g transform="translate(-20,${sleep?-150:-190}) rotate(${sleep?-14:0})"><circle cx="-46" cy="-46" r="22" fill="${c}" stroke="${INK}" stroke-width="6"/><circle cx="46" cy="-46" r="22" fill="${c}" stroke="${INK}" stroke-width="6"/>
    <circle r="62" fill="${c}" stroke="${INK}" stroke-width="7"/><ellipse cx="0" cy="20" rx="34" ry="26" fill="#E2D6CC"/>${eye(-24)}${eye(24)}<ellipse cx="0" cy="16" rx="9" ry="6" fill="${INK}"/></g></g>`;
}
function h15_mouse(x,y,s,g,o={}){const {sleep=0,cold=0,dir=1}=o; const c=cold>.5?'#BFD9F0':'#B8B8C8';
  const by=sleep?Math.sin(g*.8)*2:Math.sin(g*6)*3;
  return `<g transform="translate(${x},${y+by}) scale(${s*dir},${s})"><ellipse cx="0" cy="6" rx="130" ry="14" fill="rgba(0,0,0,.3)"/>
   ${cold>0?`<circle cx="0" cy="-70" r="170" fill="url(#gIce)" opacity="${cold*.6}"/>`:`<circle cx="0" cy="-70" r="170" fill="url(#gWarm)" opacity=".35"/>`}
   <path d="M-100 -20 Q-200 -10 -190 -90" stroke="#F4B6C2" stroke-width="10" fill="none" stroke-linecap="round"/>
   <ellipse cx="0" cy="-70" rx="${sleep?95:120}" ry="${sleep?80:72}" fill="${c}" stroke="${INK}" stroke-width="8"/>
   <g transform="translate(${sleep?60:100},${sleep?-60:-90}) rotate(${sleep?30:0})"><circle cx="-24" cy="-52" r="30" fill="#F4B6C2" stroke="${INK}" stroke-width="7"/>
    <circle r="50" fill="${c}" stroke="${INK}" stroke-width="8"/><circle cx="48" cy="6" r="10" fill="#F4B6C2" stroke="${INK}" stroke-width="4"/>
    ${sleep?`<path d="M2 -8 q12 8 24 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`:`<circle cx="16" cy="-10" r="9" fill="${INK}"/><circle cx="19" cy="-13" r="3" fill="#fff"/>`}</g>
   ${cold>.5?`<path d="M-60 -130 l12 18 M30 -150 l-8 22 M-90 -60 l20 4" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`:''}</g>`;
}
function h15_squirrel(x,y,s,g,o={}){const {curl=1,warm=0}=o; const c=warm>.5?'#E0A070':'#B98A5E';
  return `<g transform="translate(${x},${y}) scale(${s})">${warm>0?`<circle cx="0" cy="-90" r="200" fill="url(#gWarm)" opacity="${warm*.8}"/>`:''}
   <path d="M80 -40 C200 -60 190 -220 90 -230 C40 -232 30 -190 70 -180 C120 -170 130 -100 60 -90Z" fill="${c}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
   <ellipse cx="-10" cy="-90" rx="110" ry="90" fill="${c}" stroke="${INK}" stroke-width="8"/>
   <g transform="translate(-70,-100) rotate(${curl?20:-10})"><circle cx="-20" cy="-56" r="18" fill="${c}" stroke="${INK}" stroke-width="6"/><circle r="58" fill="${c}" stroke="${INK}" stroke-width="7"/><ellipse cx="-30" cy="16" rx="26" ry="20" fill="#F2DEC4"/><circle cx="-52" cy="10" r="7" fill="${INK}"/>
    ${warm>.5&&!curl?`<circle cx="-10" cy="-12" r="10" fill="${INK}"/><circle cx="-7" cy="-15" r="3" fill="#fff"/>`:`<path d="M-22 -12 q12 8 24 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`}</g>
   <path d="M-60 -40 q40 -10 80 6" stroke="#8A6040" stroke-width="5" fill="none" opacity=".6"/></g>`;
}
function h15_planet(x,y,r,kind,g){
  if(kind==='earth') return `<g transform="translate(${x},${y})"><circle r="${r*1.3}" fill="url(#gIce)" opacity=".4"/><circle r="${r}" fill="#2E7DD7" stroke="${INK}" stroke-width="8"/><path d="M${-r*.6} ${-r*.3} q${r*.3} ${-r*.4} ${r*.6} ${-r*.1} q${r*.1} ${r*.4} ${-r*.2} ${r*.5} q${-r*.3} 0 ${-r*.4} ${-r*.4}Z M${r*.2} ${r*.2} q${r*.4} ${-r*.1} ${r*.5} ${r*.3} q${-r*.2} ${r*.4} ${-r*.5} ${r*.2}Z" fill="#5FBF5A" stroke="${INK}" stroke-width="5"/></g>`;
  return `<g transform="translate(${x},${y})"><circle r="${r*1.35}" fill="url(#gWarm)" opacity=".5"/><circle r="${r}" fill="#D9603B" stroke="${INK}" stroke-width="8"/><path d="M${-r*.9} ${-r*.2} Q0 ${-r*.05} ${r*.9} ${-r*.3}" stroke="#B4452A" stroke-width="${r*.12}" fill="none"/>
   <circle cx="${-r*.35}" cy="${r*.3}" r="${r*.16}" fill="#B4452A" stroke="${INK}" stroke-width="4"/><circle cx="${r*.4}" cy="${r*.1}" r="${r*.1}" fill="#B4452A" stroke="${INK}" stroke-width="4"/><circle cx="${r*.1}" cy="${-r*.55}" r="${r*.09}" fill="#B4452A"/>
   <path d="M${-r*.62} ${-r*.5} A${r*.8} ${r*.8} 0 0 1 ${-r*.1} ${-r*.85}" stroke="#fff" stroke-width="${r*.06}" fill="none" opacity=".4" stroke-linecap="round"/></g>`;
}
function h15_ship(x,y,s,g,o={}){const {flame=1,rot=0}=o; const fl=flame?40+Math.sin(g*20)*14:0;
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">${flame?`<path d="M-200 -30 L${-200-fl*2} 0 L-200 30Z" fill="${P.warm}" stroke="${INK}" stroke-width="5"/><path d="M-200 -16 L${-200-fl} 0 L-200 16Z" fill="${P.gold}"/>`:''}
   <path d="M-200 -60 H120 Q220 -50 240 0 Q220 50 120 60 H-200Z" fill="#E8EEF8" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   <path d="M-160 -60 L-220 -120 H-140 L-80 -60 M-160 60 L-220 120 H-140 L-80 60" fill="${P.coral}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
   ${[-110,-30,50].map(cx=>`<circle cx="${cx}" cy="0" r="22" fill="${P.iceDeep}" stroke="${INK}" stroke-width="6"/>`).join('')}<path d="M160 -40 Q210 -20 215 0" stroke="#fff" stroke-width="6" fill="none" opacity=".6"/></g>`;
}
// vertical sleep pod with a sleeper (fn returns svg of sleeper at origin)
function h15_pod(x,y,s,g,sleeper,o={}){const {glow=1}=o;
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-130" y="-280" width="260" height="520" rx="120" fill="#2A3248" stroke="${INK}" stroke-width="10"/>
   <rect x="-104" y="-250" width="208" height="440" rx="100" fill="#0E2A40"/>${sleeper}
   <rect x="-104" y="-250" width="208" height="440" rx="100" fill="url(#iceG)" opacity=".28"/><path d="M-70 -200 Q-90 -60 -70 80" stroke="#fff" stroke-width="10" fill="none" opacity=".35" stroke-linecap="round"/>
   <rect x="-60" y="200" width="120" height="26" rx="10" fill="#14324A" stroke="${INK}" stroke-width="5"/><circle cx="-30" cy="213" r="7" fill="${P.mint}" opacity="${.4+.6*glow*Math.abs(Math.sin(g*1.2))}"/><circle cx="0" cy="213" r="7" fill="${P.iceDeep}"/><circle cx="30" cy="213" r="7" fill="${P.gold}"/></g>`;
}
function h15_astro(x,y,s,g,rot=0,o={}){const {head='#FFD3A8',pose='up',mouth='smile'}=o;
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">${extra({x:0,y:0,s:1,t:g,head,pose,mouth})}
   <circle cx="0" cy="-55" r="108" fill="#BFEFFF" opacity=".22" stroke="#fff" stroke-width="10"/><path d="M-60 -120 A90 90 0 0 1 10 -150" stroke="#fff" stroke-width="10" fill="none" opacity=".6" stroke-linecap="round"/>
   <rect x="-50" y="50" width="100" height="70" rx="14" fill="#E8EEF8" stroke="${INK}" stroke-width="6" opacity=".9"/></g>`;
}
function h15_arrowLoop(x,y,r,g,col=P.gold){let s='';for(let i=0;i<2;i++){const a0=g*.8+i*Math.PI, a1=a0+Math.PI*.75;
    const p0=[x+Math.cos(a0)*r,y+Math.sin(a0)*r],p1=[x+Math.cos(a1)*r,y+Math.sin(a1)*r];const ta=a1+Math.PI/2;
    s+=`<path d="M${p0[0]} ${p0[1]} A${r} ${r} 0 0 1 ${p1[0]} ${p1[1]}" stroke="${INK}" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M${p0[0]} ${p0[1]} A${r} ${r} 0 0 1 ${p1[0]} ${p1[1]}" stroke="${col}" stroke-width="20" fill="none" stroke-linecap="round"/>
       <g transform="translate(${p1[0]},${p1[1]}) rotate(${ta*57.3})"><path d="M-34 -10 L0 34 L34 -10Z" fill="${col}" stroke="${INK}" stroke-width="7" stroke-linejoin="round" transform="rotate(-90)"/></g>`;}
  return s;}
function h15_brick(x,y,s,col){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-60" y="-30" width="120" height="60" rx="8" fill="${col}" stroke="${INK}" stroke-width="6"/><rect x="-42" y="-48" width="28" height="20" rx="5" fill="${col}" stroke="${INK}" stroke-width="5"/><rect x="14" y="-48" width="28" height="20" rx="5" fill="${col}" stroke="${INK}" stroke-width="5"/></g>`;}
function h15_neuron(x,y,s,on,g,i=0){const b=on?(.6+.4*Math.sin(g*6+i)):0;
  return `<g transform="translate(${x},${y}) scale(${s})">${on?`<circle r="90" fill="url(#gGold)" opacity="${b}"/>`:''}${[0,70,140,200,270].map(a=>`<path d="M0 0 L${Math.cos(a/57.3)*80} ${Math.sin(a/57.3)*80} l${Math.cos((a+30)/57.3)*24} ${Math.sin((a+30)/57.3)*24}" stroke="${on?P.gold:'#6A6290'}" stroke-width="9" fill="none" stroke-linecap="round"/>`).join('')}<circle r="32" fill="${on?P.gold:'#4A4270'}" stroke="${INK}" stroke-width="7"/></g>`;}
function h15_toggle(x,y,s,on){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-110" y="-56" width="220" height="112" rx="56" fill="${on?P.mint:'#3A3458'}" stroke="${INK}" stroke-width="9"/><circle cx="${on?54:-54}" cy="0" r="40" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/><text x="${on?-40:40}" y="14" text-anchor="middle" font-size="38" font-weight="900" fill="${on?INK:'#9AA7BD'}">${on?'ON':'OFF'}</text></g>`;}
function h15_crate(x,y,s,lab,col){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-80" y="-70" width="160" height="140" rx="12" fill="${col}" stroke="${INK}" stroke-width="8"/><path d="M-80 -20 H80 M-80 20 H80" stroke="${INK}" stroke-width="4" opacity=".4"/><text y="16" text-anchor="middle" font-size="40" font-weight="900" fill="${INK}">${lab}</text></g>`;}

Object.assign(SHOTS,{
hibHook(t,d,p,g){
  const cl=p.close??4.7, wk=p.wake??6.2, five=p.five??12, asleep=AT(t,cl)&&!AT(t,wk);
  const wake=AT(t,wk);
  const inner=`<g transform="translate(-10,-30)">${h15_bed(0,0,.85,g,{eyes:asleep?'closed':'open',mouth:wake?'grin':(asleep?'smile':'smile'),lid:AT(t,cl-1)&&!asleep&&!wake?.5:0,blanket:P.violet})}</g>`;
  const nd=[['food',p.food??8.2],['water',p.water??9.3],['wc',p.wc??10.3]];
  return `${h15_bgSnow(g,1,0)}${h15_den(960,880,1,{inner})}${asleep?h15_zzz(1000,480,g,1.2):''}
   ${h15_flipCal(300,360,1.1,t,cl,wk)}
   ${nd.map(([k,a],i)=>AT(t,a)?h15_need(k,1680,300+i*200,.95*pop(t,a),prog(t,a+.3,a+.7)):'').join('')}
   ${AT(t,five)?T(960,170,'5 MONTHS. GONE.',{size:120,fill:P.gold,sc:pop(t,five)}):T(960,170,'HIBERNATE?',{size:140,fill:P.ice,sc:IN(t,.1)})}`;
},
hibTease(t,d,p,g){
  const m=AT(t,p.mars??2.9), k=eout(prog(t,p.mars??2.9,(p.mars??2.9)+1.6));
  const a=g*1.4;
  return `${h15_bgSpace(g)}${h15_planet(1450,560,260*k+1,'mars',g)}
   ${m?h15_ship(1450+Math.cos(a)*380,560+Math.sin(a)*190,.55*k,g,{rot:a*57.3+90}):''}
   <g transform="translate(${lerp(960,520,k)},0)">${glint({x:0,y:540,s:1,t:g,pose:m?'point':'cross',mouth:m?'o':'smirk',brows:m?'raised':'calm',blink:BL(g)})}
   ${!m?`${labelPill(0,200,'SKIP WINTER?',P.ice,64)}${[[-330,380],[330,420],[-300,700],[320,720]].map(([x,y],i)=>`<g transform="translate(${x},${y+Math.sin(g*2+i)*10}) rotate(${g*30+i*20})"><path d="M0 -40 V40 M-35 -20 L35 20 M-35 20 L35 -20" stroke="#fff" stroke-width="10" stroke-linecap="round"/></g>`).join('')}`:''}</g>
   ${m?T(960,170,'THE WAY TO MARS?',{size:110,fill:'#FF8A5B',sc:pop(t,p.mars??2.9)}):''}`;
},
hibDen(t,d,p,g){
  const dn=p.den??3.8, arr=dn+3.2, wk=prog(t,dn,arr);
  const ins=AT(t,arr);
  const nd=[['food','EAT',p.eat??8.4],['water','DRINK',p.drink??10.7],['pee','PEE',p.pee??11.9],['poop','POOP',p.poop??13.1]];
  const any=AT(t,p.eat??8.4);
  return `${h15_bgSnow(g,1,0)}${h15_den(960,880,.95,{inner:ins?h15_bearSleep(0,0,.62,g):''})}${ins?h15_zzz(1100,520,g,1.1):''}
   ${AT(t,dn)&&!ins?h15_bear(lerp(-250,900,wk),lerp(900,860,wk),lerp(.75,.5,wk),g,{walk:1}):''}
   ${!AT(t,dn)?h15_bear(1500,880,.6,g,{dir:-1}):''}
   ${nd.map(([k,l,a],i)=>AT(t,a)?`${h15_need(k,510+i*300,250,.9*pop(t,a),prog(t,a+.25,a+.6))}${T(510+i*300,400,l,{size:48,fill:P.white,stroke:9,op:prog(t,a,a+.3)})}`:'').join('')}
   ${!any?T(960,170,'WHAT A BEAR DOES',{size:110,fill:P.ice,sc:IN(t,.2)}):''}`;
},
hibVitals(t,d,p,g){
  const ten=p.ten??4.5, bpm=lerp(45,8,ease(prog(t,.8,ten)));
  const beat=Math.pow(Math.max(0,Math.sin(g*Math.PI*bpm/60)),10);
  const br=AT(t,p.breath??6.1), tp=AT(t,p.temp??9.5), ft=AT(t,p.fat??12.3);
  const breath=Math.sin(g*Math.PI*2/7);
  const fk=lerp(1,.25,prog(t,(p.fat??12.3)+.4,d));
  return `${card('cardIce',g)}
   ${heart(470,330,.75,beat)}${h15_dial(470,720,240,bpm/60)}${T(470,640,Math.round(bpm),{size:110,fill:bpm<12?P.iceDeep:P.white})}${T(470,830,'BEATS / MIN',{size:44,fill:P.ice,stroke:8})}
   ${br?`<g transform="translate(0,0) scale(1)" opacity="${prog(t,p.breath??6.1,(p.breath??6.1)+.3)}"><g transform="translate(1000,250)"><ellipse rx="${70+breath*14}" ry="${90+breath*16}" fill="#FF9EC0" stroke="${INK}" stroke-width="7" transform="translate(-50,0)"/><ellipse rx="${70+breath*14}" ry="${90+breath*16}" fill="#FF9EC0" stroke="${INK}" stroke-width="7" transform="translate(50,0)"/><path d="M0 -110 V-40" stroke="${INK}" stroke-width="14" stroke-linecap="round"/></g>${T(1140,250,'A FEW BREATHS',{size:56,fill:P.white,anchor:'start',stroke:9})}${T(1140,310,'PER MINUTE',{size:44,fill:P.ice,anchor:'start',stroke:8})}</g>`:''}
   ${tp?`<g transform="translate(1000,700) scale(.5)">${thermometer(0,0,lerp(.75,.55,prog(t,p.temp??9.5,(p.temp??9.5)+2)))}</g>${T(1140,520,'BODY TEMP',{size:56,fill:P.white,anchor:'start',stroke:9,sc:pop(t,p.temp??9.5)})}${T(1140,580,'DOWN A FEW DEGREES',{size:44,fill:P.iceDeep,anchor:'start',stroke:8})}`:''}
   ${ft?h15_bar(1440,780,560,fk,'FAT RESERVES',P.gold,48):''}`;
},
hibBedRot(t,d,p,g){
  const mus=p.mus??4.4, bone=p.bone??6, walk=AT(t,p.walk??8);
  const km=lerp(1,.4,prog(t,mus,mus+1.6)), kb=lerp(1,.4,prog(t,bone,bone+1.6));
  return `${h15_room(g,h15_winSnow(g),0,{wx:1240})}
   ${walk?`${glint({x:640,y:470,s:1,t:g,legs:'wobble',pose:'shrug',mouth:'wavy',brows:'sad',sweat:1,rot:Math.sin(g*3)*4,blink:BL(g)})}${T(640,140,'WOBBLE...',{size:90,fill:P.coral,sc:pop(t,p.walk??8)})}`
     :`${h15_bed(640,760,1.05,g,{eyes:'closed',blanket:P.violet})}${h15_cal(280,250,.85,'5 MO',{col:P.coral})}`}
   ${!walk?T(900,170,'5 MONTHS IN BED',{size:96,fill:P.white,sc:IN(t,.2)}):''}
   ${AT(t,mus)||AT(t,bone)?`<rect x="1150" y="610" width="640" height="300" rx="24" fill="#0B1026" opacity=".75" stroke="${INK}" stroke-width="6"/>`:''}
   ${AT(t,mus)?h15_bar(1470,690,540,km,'MUSCLE',P.mint,44):''}${AT(t,bone)?`${T(1210,820,'BONE',{size:44,fill:P.white,anchor:'start',stroke:8})}${h15_bone(1590,805,.55,kb)}`:''}`;
},
hibAstro(t,d,p,g){
  const pc=AT(t,p.pct??3), m=Math.min(6,Math.floor(Math.max(0,t-(p.pct??3))*1.4));
  return `${h15_bgSpace(g)}${h15_planet(180,1180,560,'earth',g)}
   ${h15_astro(600,500+Math.sin(g*1.3)*30,1,g,Math.sin(g*.7)*25)}
   ${T(1300,170,'NO GRAVITY',{size:100,fill:P.ice,sc:IN(t,.2)})}
   ${pc?`${h15_bone(1320,420,1,1-m*.1)}${T(1320,620,'~1% BONE',{size:96,fill:P.gold,sc:pop(t,p.pct??3)})}${T(1320,720,'LOST EVERY MONTH',{size:56,fill:P.white,stroke:10})}
     ${[...Array(6)].map((_,i)=>`<circle cx="${1145+i*70}" cy="810" r="22" fill="${i<m?P.red:'#2A3248'}" stroke="${INK}" stroke-width="6"/>`).join('')}`:''}`;
},
hibBearOut(t,d,p,g){
  const k=prog(t,.3,4.2), good=AT(t,p.good??4.7);
  const bx=lerp(560,1220,eout(k));
  return `${h15_bgSpring(g)}${h15_den(520,900,.75,{melt:1})}
   ${h15_bear(bx,880,lerp(.45,.8,eout(k)),g,{walk:k>0&&k<1?1:0})}
   ${T(960,160,good?'STILL STRONG':'SPRING!',{size:120,fill:good?P.mint:P.gold,sc:pop(t,good?p.good??4.7:.1)})}
   ${good?`${labelPill(1560,330,'MUSCLES OK',P.mint,48)}${labelPill(1560,450,'BONES OK',P.mint,48)}`:''}`;
},
hibRecycle(t,d,p,g){
  const rc=AT(t,p.rec??1.3), pr=AT(t,p.prot??3.9), bn=AT(t,p.bone??9.4);
  return `${card('cardMint',g)}
   ${!rc?T(960,520,'HOW?',{size:260,fill:P.gold,sc:pop(t,.05)}):''}
   ${rc?`${T(rc&&!bn?960:700,160,bn?'RECYCLED WASTE':'RECYCLE THE WASTE',{size:bn?80:100,fill:P.gold,sc:pop(t,p.rec??1.3)})}
     ${h15_arrowLoop(700,540,230,g)}${h15_bearSleep(700,620,.42,g)}
     <g transform="translate(470,540) scale(${pop(t,p.rec??1.3)})"><circle r="95" fill="#3A2A1A" stroke="${INK}" stroke-width="8"/>${h15_need('pee',0,-10,.7)}</g>${T(470,690,'WASTE',{size:46,fill:P.gold,stroke:8})}
     ${pr?`<g transform="translate(930,540) scale(${pop(t,p.prot??3.9)})"><circle r="95" fill="#14524A" stroke="${INK}" stroke-width="8"/>${h15_brick(-20,30,.6,P.mint)}${h15_brick(20,-20,.6,P.coral)}${h15_brick(-10,-62,.5,P.gold)}</g>${T(930,690,'PROTEIN',{size:46,fill:P.mint,stroke:8})}`:''}`:''}
   ${bn?`${h15_bone(1460,480,.85,1,-20)}${h15_shield(1460,480,1.05,g)}${T(1460,720,'BONES PROTECTED',{size:58,fill:P.mint,stroke:10,sc:pop(t,p.bone??9.4)})}`:''}`;
},
hibHelp(t,d,p,g){
  const L=[[420,'HOSPITAL BEDS',p.bed??1.3],[960,'OLDER PEOPLE',p.old??4.5],[1500,'ASTRONAUTS',p.astro??6.4]];
  const art=[
    `<g transform="translate(0,40)"><rect x="-200" y="60" width="400" height="40" rx="12" fill="#E8EEF8" stroke="${INK}" stroke-width="7"/><path d="M-190 100 V170 M190 100 V170" stroke="#9AA7BD" stroke-width="14"/><g transform="translate(-60,40) rotate(-90) scale(.42)">${extra({t:g,head:'#F2C9A0'})}</g><path d="M-40 10 Q60 -10 190 20 V70 H-40Z" fill="${P.iceDeep}" stroke="${INK}" stroke-width="6"/></g>`,
    `${extra({x:0,y:-40,s:.62,t:g,head:'#E8C9A8',glasses:true,mouth:'smile'})}<path d="M-20 -80 Q-40 -90 -40 -70" stroke="#fff" stroke-width="0"/><path d="M60 40 V150" stroke="#6B4A3A" stroke-width="12" stroke-linecap="round"/><path d="M60 40 q0 -26 -26 -26" stroke="#6B4A3A" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-50 -134 q50 -30 100 0" stroke="#E8E8F0" stroke-width="20" fill="none" stroke-linecap="round"/>`,
    h15_astro(0,-40,.62,g,Math.sin(g)*10)];
  return `${card('cardWarm',g)}${T(960,160,'COPY THE BEAR?',{size:110,fill:P.gold,sc:IN(t,.2)})}
   ${L.map(([x,l,a],i)=>AT(t,a)?`<g transform="translate(${x},520) scale(${pop(t,a)})"><rect x="-240" y="-250" width="480" height="440" rx="30" fill="#1A0A1A" opacity=".55" stroke="${P.gold}" stroke-width="6"/>${art[i]}</g>${labelPill(x,820,l,i===2?P.ice:P.mint,40)}`:'').join('')}`;
},
hibFeast(t,d,p,g){
  const eat=AT(t,p.eat??4.5), big=prog(t,p.big??7,(p.big??7)+3);
  const pz=AT(t,p.pizza??11.7), ck=AT(t,p.cake??13.1), doc=AT(t,p.doc??14.5), sci=AT(t,p.sci??16.2);
  const by=Math.sin(g*2.4)*5, chew=eat&&Math.sin(g*10)>0;
  return `<rect width="1920" height="1080" fill="url(#room)"/><rect y="820" width="1920" height="260" fill="#141C34"/>
   ${h15_cal(250,260,.95,'OCT',{col:P.warm,sub:'END'})}
   ${glint({x:760,y:420,s:.95,t:g,pose:eat?'up':'hips',mouth:chew?'o':'grin',brows:'raised',blink:BL(g)})}
   ${big>0?`<ellipse cx="760" cy="${420+by+.95*115}" rx="${40+70*big}" ry="${40+50*big}" fill="${P.cream}" stroke="${INK}" stroke-width="10"/>`:''}
   <rect x="380" y="690" width="1060" height="44" rx="14" fill="#8B5A3C" stroke="${INK}" stroke-width="8"/><path d="M440 734 V880 M1380 734 V880" stroke="#5E3A26" stroke-width="26"/>
   ${eat?[[520,650],[600,640]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="60" ry="22" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/>`).join(''):''}
   ${pz?`${h15_pizza(1000,650,1.1*pop(t,p.pizza??11.7))}${T(1000,580,'BREAKFAST',{size:44,fill:P.gold,stroke:8})}`:''}
   ${ck?`${h15_cake(1270,660,.9*pop(t,p.cake??13.1))}${T(1270,540,'LUNCH',{size:44,fill:'#FF9EC0',stroke:8})}`:''}
   ${doc?`${extra({x:1650,y:500,s:.85,t:g,head:'#FFFFFF',glasses:true,pose:'point'})}${bubble(1600,210,440,130,sci?'FOR SCIENCE!':"IT'S FINE",{size:56,tail:'right'})}`:''}
   ${!pz?T(1050,170,eat?(big>0?'BULK UP LIKE A BEAR':'START EATING'):'PRE-WINTER FEAST',{size:96,fill:P.gold,sc:pop(t,eat?(big>0?p.big??7:p.eat??4.5):.2)}):''}`;
},
hibSnowSleep(t,d,p,g){
  const sl=AT(t,p.sleepy??2.45), bd=p.bed??4.7, inBed=AT(t,bd+1.2);
  const cur=prog(t,bd,bd+1.2);
  return `${h15_room(g,h15_winSnow(g,560,420,.2),cur)}
   ${inBed?`${h15_bed(620,760,1.05,g,{eyes:'closed'})}${h15_zzz(560,470,g,1.2)}`
     :glint({x:780,y:480,s:1,t:g,pose:sl?'up':'point',mouth:sl?'o':'smile',brows:sl?'sad':'raised',lid:sl?.55:0,blink:BL(g),look:sl?0:1})}
   ${T(700,170,inBed?'GOODNIGHT':(sl?'SO... SLEEPY':'FIRST SNOW'),{size:110,fill:inBed?P.violet:P.ice,sc:pop(t,inBed?bd+1.2:(sl?p.sleepy??2.45:.1))})}`;
},
hibWinterPass(t,d,p,g){
  const ps=p.pass??5.3, k=prog(t,ps,d);
  const day=Math.sin(g*6)>0;
  const snowD=k<.7?lerp(.15,.55,k/.7):lerp(.55,.05,(k-.7)/.3);
  const win=ps<=t?`<rect width="560" height="420" fill="${day?'#5A8AC0':'#0E1838'}"/><circle cx="${(g*700)%700-70}" cy="${80+Math.sin(g*3)*20}" r="34" fill="${day?P.gold:'#fff4dc'}"/>${h15_snow(g*3,40,1,0,0,560,420)}<path d="M0 420 V${420-420*snowD} Q280 ${420-420*snowD-30} 560 ${420-420*snowD} V420Z" fill="#F2F8FF"/>`:h15_winSnow(g,560,420,.2);
  const hud=[[`HEART SLOWS`,p.heart??0,P.red],['BREATHING SLOWS',p.breath??1.4,P.ice],['BODY COOLS',p.cool??3.1,P.iceDeep]];
  return `${h15_room(g,win,0,{cal:AT(t,ps)?h15_flipCal(250,360,.8,t,ps,d-.3):''})}
   ${h15_bed(700,760,1.05,g,{eyes:'closed'})}${h15_zzz(640,470,g,1.1)}
   ${!AT(t,ps)?hud.map(([l,a,c],i)=>AT(t,a)?labelPill(380,200+i*120,l,c,46):'').join(''):''}
   ${AT(t,ps)?T(760,170,'WINTER PASSES...',{size:100,fill:P.ice,sc:pop(t,ps)}):''}`;
},
hibWake(t,d,p,g){
  const lt=AT(t,p.light??1.5), ok=AT(t,p.ok??2.9);
  return `${h15_room(g,h15_winSpring(g),0,{cal:h15_cal(260,300,.95,'APR',{col:'#4AA845'})})}
   ${glint({x:580,y:480,s:1.05,t:g,pose:'up',mouth:'grin',brows:'raised',blink:BL(g),glint:ok?1:0})}
   ${lt?`<g transform="translate(940,${600}) scale(${pop(t,p.light??1.5)})">${labelPill(0,0,'LIGHTER',P.gold,56)}<path d="M0 60 V150 M-30 120 L0 156 L30 120" stroke="${P.gold}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`:''}
   ${ok?`${icon('check',940,330,pop(t,p.ok??2.9))}${T(940,460,'FEELS OKAY',{size:60,fill:P.mint,stroke:10})}`:''}
   ${T(640,160,'APRIL!',{size:130,fill:P.mint,sc:IN(t,.1)})}`;
},
hibMissed(t,d,p,g){
  const msg=p.msg??1.9, nt=p.notif??4, ch=AT(t,p.chap??14.8);
  const n=AT(t,nt)?Math.round(lerp(5,384,eout(prog(t,nt,nt+2)))):(AT(t,msg)?Math.round(lerp(1,5,prog(t,msg,msg+1))):0);
  const it=[['PARTIES',p.party??6.75,`<path d="M0 -70 L50 40 H-50Z" fill="${P.coral}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><circle cy="-74" r="14" fill="${P.gold}" stroke="${INK}" stroke-width="5"/><path d="M-30 -10 L30 -10 M-40 14 L40 14" stroke="${P.gold}" stroke-width="8"/>`],
    ['NEW SONG',p.song??8.6,`<path d="M-30 40 V-50 L40 -64 V26" stroke="${INK}" stroke-width="12" fill="none" stroke-linejoin="round"/><ellipse cx="-44" cy="42" rx="24" ry="18" fill="${P.violet}" stroke="${INK}" stroke-width="6"/><ellipse cx="26" cy="28" rx="24" ry="18" fill="${P.violet}" stroke="${INK}" stroke-width="6"/>`],
    ['PRICES UP',p.price??10.9,`<path d="M-60 -30 L10 -30 L50 10 L10 50 L-60 50Z" fill="${P.gold}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><text x="-20" y="26" text-anchor="middle" font-size="56" font-weight="900" fill="${INK}">$</text><path d="M60 -20 V-80 M36 -56 L60 -84 L84 -56" stroke="${P.red}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`],
    ['HOLIDAYS',p.hol??12.4,`${h15_cal(0,-10,.5,'DEC',{col:P.red})}<path d="M-56 -66 L56 50 M56 -66 L-56 50" stroke="${P.red}" stroke-width="14" stroke-linecap="round"/>`]];
  return `${ch?card('cardDark',g):card('cardWarm',g)}
   ${glint({x:ch?960:380,y:ch?560:520,s:ch?1.05:.95,t:g,pose:ch?'shrug':'reach',mouth:AT(t,p.party??6.75)?'frown':'o',brows:AT(t,p.party??6.75)?'sad':'raised',blink:BL(g)})}
   ${!ch?`${h15_phone(820,470,1.15,n,g,{msgs:Math.min(5,n)})}
     ${it.map(([l,a,svg],i)=>AT(t,a)?`<g transform="translate(${1330+(i%2)*340},${300+Math.floor(i/2)*330}) scale(${pop(t,a)})"><circle r="110" fill="#1A1430" stroke="${P.gold}" stroke-width="6"/>${svg}</g>${T(1330+(i%2)*340,300+Math.floor(i/2)*330+165,l,{size:42,fill:P.white,stroke:8})}`:'').join('')}
     ${T(820,140,'YOU MISSED A LOT',{size:90,fill:P.coral,sc:IN(t,.1)})}`
     :`${T(960,170,'NO WINTER...',{size:100,fill:P.ice,sc:pop(t,p.chap??14.8)})}${AT(t,p.life??17.3)?T(960,290,'...AND A CHAPTER OF LIFE',{size:64,fill:P.coral,sc:pop(t,p.life??17.3)}):''}`}`;
},
hibLemur(t,d,p,g){
  const pr=AT(t,p.prim??5), mo=AT(t,p.months??7), tl=AT(t,p.tail??11.7), far=AT(t,p.far??15);
  const sl=mo&&!far;
  return `${card('cardMint',g)}
   <rect x="1180" y="0" width="420" height="1080" fill="#5E3A26" stroke="${INK}" stroke-width="10"/><path d="M1240 100 q20 120 -10 240 M1520 300 q-20 140 10 300 M1300 700 q30 100 0 200" stroke="#3E2616" stroke-width="10" fill="none"/>
   <ellipse cx="1390" cy="500" rx="170" ry="200" fill="#1A0E08" stroke="${INK}" stroke-width="10"/>
   ${h15_lemur(1390,640,1,g,{sleep:sl?1:0,fat:tl?1:0})}${sl?h15_zzz(1460,360,g,1):''}
   <path d="M1180 60 Q1000 20 900 80" stroke="#5E3A26" stroke-width="40" fill="none" stroke-linecap="round"/>${[[920,60],[1010,30],[860,110]].map(([x,y],i)=>`<ellipse cx="${x}" cy="${y+Math.sin(g+i)*5}" rx="70" ry="34" fill="#2E8B57" stroke="${INK}" stroke-width="6"/>`).join('')}
   ${far?`${glint({x:520,y:520,s:.9,t:g,pose:'point',mouth:'smirk',brows:'raised',blink:BL(g)})}${T(560,170,'NOT SO FAR',{size:100,fill:P.gold,sc:pop(t,p.far??15)})}${T(560,270,'FROM US?',{size:80,fill:P.white,sc:pop(t,(p.far??15)+.2)})}`
     :`${T(600,190,'FAT-TAILED',{size:96,fill:P.gold,sc:IN(t,.2)})}${T(600,300,'DWARF LEMUR',{size:96,fill:P.white,sc:IN(t,.4)})}
     ${!pr?labelPill(600,430,'MADAGASCAR',P.mint,54):''}
     ${pr?labelPill(600,430,'A PRIMATE, LIKE US',P.mint,50):''}
     ${mo?`${h15_cal(420,640,.8,'7',{col:P.violet,sub:'MONTHS'})}${T(720,640,'UP TO',{size:56,fill:P.white,stroke:9,anchor:'start'})}${T(720,710,'7 MONTHS',{size:56,fill:P.violet,stroke:9,anchor:'start'})}`:''}
     ${tl?labelPill(600,850-20,'FAT IN ITS TAIL',P.gold,48):''}`}`;
},
hibCooling(t,d,p,g){
  const ox=AT(t,p.oxy??9.2), br=AT(t,p.brain??11.9);
  const lv=lerp(.75,.5,prog(t,1,4));
  return `${card('cardIce',g)}<rect y="820" width="1920" height="260" fill="#0A1A2A"/>
   <rect x="260" y="620" width="820" height="60" rx="18" fill="#E8EEF8" stroke="${INK}" stroke-width="8"/><path d="M290 680 V820 M1050 680 V820" stroke="#9AA7BD" stroke-width="22"/>
   <g transform="translate(420,600) rotate(-90) scale(.62)">${extra({t:g,head:'#F2C9A0',mouth:'flat'})}</g>
   <path d="M500 520 Q760 500 1060 540 V630 H500Z" fill="${P.iceDeep}" stroke="${INK}" stroke-width="8"/>${[0,1,2,3].map(i=>`<path d="M${580+i*120} ${560+Math.sin(g*2+i)*6} l16 -14 l16 14" stroke="#fff" stroke-width="5" fill="none"/>`).join('')}
   ${[0,1,2].map(i=>{const k=((g*.4+i/3)%1);return `<path d="M${640+i*160} ${500-k*120} q10 -20 0 -40" stroke="${P.ice}" stroke-width="6" fill="none" opacity="${1-k}"/>`;}).join('')}
   <g transform="translate(1300,700) scale(.62)">${thermometer(0,0,lv)}</g>${T(1430,300,'COOLED',{size:64,fill:P.ice,anchor:'start',stroke:10,sc:IN(t,.3)})}${T(1430,370,'ON PURPOSE',{size:48,fill:P.white,anchor:'start',stroke:8,sc:IN(t,.5)})}
   ${ox?`<g transform="translate(1600,520) scale(${pop(t,p.oxy??9.2)})"><circle r="70" fill="${P.iceDeep}" stroke="${INK}" stroke-width="7"/><text y="20" text-anchor="middle" font-size="60" font-weight="900" fill="${INK}">O2</text><path d="M100 -40 V40 M74 14 L100 44 L126 14" stroke="${P.gold}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>${T(1600,660,'LESS OXYGEN',{size:46,fill:P.gold,stroke:8})}`:''}
   ${br?`${brain(700,300,.6,1,g)}${h15_shield(700,300,.9,g).replace('fill="'+P.mint+'"','fill="'+P.mint+'" fill-opacity=".35"')}${T(700,140,'PROTECTS THE BRAIN',{size:80,fill:P.mint,sc:pop(t,p.brain??11.9)})}`:T(700,160,'HOSPITAL COOLING',{size:90,fill:P.ice,sc:IN(t,.2)})}`;
},
hibMouse(t,d,p,g){
  const on=AT(t,p.on??4.4), drop=AT(t,p.drop??8.9), wk=AT(t,p.wake??12.7), nat=AT(t,p.nat??16), th=AT(t,p.there??18.2), hid=AT(t,p.hidden??20.6);
  const cold=on&&!wk?prog(t,(p.on??4.4)+1,(p.on??4.4)+3):0;
  const title=hid?['HIDDEN.',P.gold,p.hidden??20.6]:th?['THE SWITCH WAS THERE',P.mint,p.there??18.2]:nat?["MICE DON'T HIBERNATE",P.coral,p.nat??16]:wk?['WOKE UP FINE',P.mint,p.wake??12.7]:drop?['COLD FOR 1+ DAY',P.ice,p.drop??8.9]:['2020: MOUSE BRAIN CELLS',P.white,.2];
  let gr=''; if(drop){const k=prog(t,p.drop??8.9,(p.drop??8.9)+3);let dd='';for(let i=0;i<=40;i++){const x=i/40;if(x>k)break;const y=x<.15?0:(x<.75?1:Math.max(0,1-(x-.75)*6));dd+=`${i?'L':'M'}${1120+x*560} ${700+y*120}`;}
    gr=`<rect x="1100" y="660" width="600" height="200" rx="16" fill="#1A1430" stroke="${INK}" stroke-width="6"/>${T(1120,700,'BODY TEMP',{size:30,fill:P.ice,stroke:6,anchor:'start'})}<path d="${dd}" stroke="${P.iceDeep}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;}
  return `${card('cardDark',g)}
   ${[[380,420],[520,330],[600,480],[440,560],[300,300]].map(([x,y],i)=>h15_neuron(x,y,.75,on,g,i)).join('')}
   ${h15_toggle(460,760,1,on)}${on&&!AT(t,(p.on??4.4)+1.2)?T(460,880-20,'SWITCHED ON',{size:44,fill:P.mint,stroke:8}):''}
   ${h15_mouse(1400,drop?560:640,1.2,g,{sleep:cold>.4&&!wk?1:0,cold:wk?0:cold})}${cold>.4&&!wk?h15_zzz(1460,380,g,.9):''}${wk?icon('check',1660,360,.7*pop(t,p.wake??12.7)):''}
   ${gr}${T(960,160,title[0],{size:hid?140:84,fill:title[1],sc:pop(t,title[2])})}`;
},
hibMarsTrip(t,d,p,g){
  const ew=AT(t,p.each??3.2), sp=AT(t,p.sup??8.4), sz=AT(t,p.space??12.2), bo=AT(t,p.bored??14.9);
  const k=(t*.12)%1, ax=lerp(330,1560,k), ay=520-Math.sin(k*Math.PI)*190;
  const ang=Math.atan2(-Math.cos(k*Math.PI)*190*Math.PI,1230)*57.3;
  return `${h15_bgSpace(g)}${h15_planet(300,560,120,'earth',g)}${h15_planet(1600,520,100,'mars',g)}
   <path d="M330 520 Q945 140 1560 520" stroke="#fff" stroke-width="7" stroke-dasharray="20 22" fill="none" opacity=".6"/>
   ${ew?`<path d="M1560 560 Q945 900 330 600" stroke="${P.gold}" stroke-width="7" stroke-dasharray="20 22" fill="none" opacity=".8"/>${T(945,700,'EACH WAY',{size:56,fill:P.gold,stroke:9,sc:pop(t,p.each??3.2)})}`:''}
   ${h15_ship(ax,ay,sz?.5:.38,g,{rot:ang})}
   ${AT(t,p.trip??3.7)?T(960,170,'6–9 MONTHS',{size:120,fill:'#FF8A5B',sc:pop(t,p.trip??3.7)}):T(960,170,'WHY SPACE AGENCIES CARE',{size:84,fill:P.white,sc:IN(t,.2)})}
   ${sp?[['FOOD',P.gold],['WATER',P.iceDeep],['O2',P.mint]].map(([l,c],i)=>h15_crate(470+i*190,820,.85*pop(t,(p.sup??8.4)+i*.25),l,c)).join(''):''}
   ${sz?labelPill(1180,800,'ROOM TO MOVE',P.violet,40):''}
   ${bo?[0,1,2].map(i=>`<g transform="translate(${1440+i*120},790) scale(.36)">${extra({t:g+i,head:['#FFD3A8','#C68B59','#F2C9A0'][i],mouth:'flat'})}</g>`).join('')+T(1560,700,'BORED · STRESSED · SICK',{size:34,fill:P.coral,stroke:7}):''}`;
},
hibPods(t,d,p,g){
  const rs=AT(t,p.res??3), nd=AT(t,p.need??8.2), sh=AT(t,p.ship??14.3);
  const sleeper=(h)=>`<g transform="scale(.55) translate(0,-80)">${h}</g>`;
  if(sh){const k=eout(prog(t,p.ship??14.3,(p.ship??14.3)+1.5));
    return `${h15_bgSpace(g)}<g opacity="${.6*(1-k)+.15}">${h15_ship(960,520,lerp(2.4,2.4,k),g,{flame:0})}</g>
     <g opacity="1">${h15_ship(960+Math.sin(g)*10,520,lerp(2.4,1.2,k),g)}</g>
     ${T(960,170,'SMALLER SHIP',{size:110,fill:P.mint,sc:pop(t,p.ship??14.3)})}${labelPill(700,800,'LIGHTER',P.gold,56)}${labelPill(1220,800,'CHEAPER',P.gold,56)}`;}
  return `<rect width="1920" height="1080" fill="#101828"/><rect y="0" width="1920" height="90" fill="#1A2438"/><rect y="820" width="1920" height="260" fill="#0A0F1C"/>
   ${[0,1,2].map(i=>`<path d="M${i*640} 90 V820" stroke="#1F2B44" stroke-width="10"/>`).join('')}
   ${h15_pod(560,560,1,g,sleeper(extra({t:0,head:'#C68B59',mouth:'flat'})))}
   ${h15_pod(960,540,1.1,g,sleeper(glint({t:g,eyes:'closed',mouth:'smile'})))}
   ${h15_pod(1360,560,1,g,sleeper(extra({t:0,head:'#FFD3A8',mouth:'flat'})))}
   ${!nd?h15_zzz(1060,240,g,1):''}
   ${!nd?T(960,170,rs?'NASA + ESA STUDIES':'SLEEP THE WHOLE WAY?',{size:96,fill:rs?P.gold:P.ice,sc:pop(t,rs?p.res??3:.2)}):''}
   ${nd?[['LESS FOOD',P.gold,0],['LESS OXYGEN',P.mint,1.6],['SMALLER SPACE',P.violet,3.6]].map(([l,c,o],i)=>AT(t,(p.need??8.2)+o)?labelPill(480+i*480,150,l,c,48):'').join(''):''}`;
},
hibArrive(t,d,p,g){
  const sf=AT(t,p.scifi??4.1), nw=AT(t,p.now??6.45);
  const m=eout(prog(t,0,2.5));
  return `<rect width="1920" height="1080" fill="#101828"/><rect y="820" width="1920" height="260" fill="#0A0F1C"/>
   <circle cx="1300" cy="440" r="330" fill="#2A3248" stroke="${INK}" stroke-width="12"/><circle cx="1300" cy="440" r="290" fill="#070818"/>
   <g>${h15_planet(1300+lerp(200,40,m),440+lerp(120,40,m),lerp(80,230,m),'mars',g)}</g>
   <circle cx="1300" cy="440" r="290" fill="none" stroke="#5D6A82" stroke-width="20"/><path d="M1120 260 A250 250 0 0 1 1260 190" stroke="#fff" stroke-width="12" fill="none" opacity=".3" stroke-linecap="round"/>
   ${glint({x:520,y:520,s:1,t:g,pose:sf?'shrug':'up',mouth:sf?'smirk':'grin',brows:'raised',blink:BL(g),lid:t<1.5?.5:0})}
   ${!sf?bubble(540,190,560,130,'MORNING, MARS!',{size:56,tail:'left'}):''}
   ${sf?T(560,170,'SCIENCE FICTION?',{size:90,fill:P.violet,sc:pop(t,p.scifi??4.1)}):''}
   ${nw?stamp(1300,830,.9,'BEING STUDIED',P.mint,-6):''}`;
},
hibSquirrel(t,d,p,g){
  const nt=AT(t,p.not??2.6), sq=AT(t,p.sq??6.5), why=AT(t,p.why??14.3), td=AT(t,p.tired??19.8), st=AT(t,p.still??23.2);
  if(td){
    return `${h15_room(g,h15_winSpring(g),0,{cal:h15_cal(260,300,.95,'APR',{col:'#4AA845'})})}
     ${glint({x:760,y:500,s:1.05,t:g,pose:st?'shrug':'down',legs:'wobble',mouth:st?'flat':'wavy',brows:'sad',lid:.6,blink:BL(g)})}
     <path d="M712 432 q18 12 36 0 M772 432 q18 12 36 0" stroke="#7C5CFF" stroke-width="6" fill="none" opacity=".7"/>
     <g transform="translate(1100,620)"><rect x="-50" y="-60" width="100" height="120" rx="14" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/><path d="M50 -30 q40 0 40 30 q0 30 -40 30" stroke="${INK}" stroke-width="10" fill="none"/>${[0,1].map(i=>{const k=((g*.6+i/2)%1);return `<path d="M${-14+i*28} ${-80-k*60} q10 -14 0 -28" stroke="#fff" stroke-width="6" fill="none" opacity="${1-k}"/>`;}).join('')}</g>
     ${T(640,160,st?'STILL TIRED.':'5 MONTHS OF SLEEP...',{size:st?120:84,fill:st?P.coral:P.white,sc:pop(t,st?p.still??23.2:p.tired??19.8)})}`;
  }
  const cyc=sq?((t-(p.sq??6.5))%4):0, warm=sq&&cyc>2.2?Math.sin((cyc-2.2)/1.8*Math.PI):0;
  return `<rect width="1920" height="1080" fill="#4A2E1E"/><rect width="1920" height="230" fill="#F2F8FF"/><path d="M0 230 H1920" stroke="${INK}" stroke-width="8"/>
   ${h15_snow(g,30,1,0,0,1920,230)}
   ${[...Array(30)].map((_,i)=>`<circle cx="${(i*263)%1920}" cy="${300+(i*137)%600}" r="${6+(i%4)*3}" fill="#3A2216"/>`).join('')}
   <path d="M1200 230 Q1180 360 1080 420" stroke="#2A160C" stroke-width="80" fill="none" stroke-linecap="round"/>
   <ellipse cx="960" cy="600" rx="340" ry="210" fill="#2A160C" stroke="${INK}" stroke-width="8"/>
   ${h15_squirrel(960,730,1.2,g,{curl:warm>.5?0:1,warm})}${warm<.3?h15_zzz(1060,420,g,.9):''}
   ${why?bubble(1500,360,560,130,'WARMING UP... TO SLEEP?',{size:40,tail:'left'}):''}
   ${sq?labelPill(960,880-30,'GROUND SQUIRREL',P.gold,44):''}${sq&&!why?T(1560,420,'WAKES UP',{size:56,fill:P.warm,stroke:9})+T(1560,490,'EVERY WEEK OR SO',{size:44,fill:P.white,stroke:8}):''}
   ${T(960,140,nt?'NOT REALLY SLEEP':'ONE LAST FACT',{size:100,fill:nt?P.coral:P.gold,sc:pop(t,nt?p.not??2.6:.2)})}`;
}
});
