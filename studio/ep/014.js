// episode 014 scenes (magnetic sense)
const m14_F='#7CF5FF', m14_F2='#B47CFF', m14_AUR='#7CF5A0', m14_SAND='#E8C98A', m14_SEA='#1E5AA8';
// dipole field lines around a planet at (cx,cy) radius R. kl squashes the left (sun) side.
function m14_field(cx,cy,R,g,o={}){
  const {Ls=[1.5,2.1,2.9,3.9],col=m14_F,op=.75,w=6,flow=1,kl=1,kr=1,grow=1,shake=0}=o; let s='';
  for(const L of Ls){ for(const side of [-1,1]){ let dd=''; const th0=Math.asin(Math.sqrt(1/L)); const n=44;
    for(let i=0;i<=n;i++){const th=th0+(Math.PI-2*th0)*i/n; const r=R*L*Math.sin(th)**2*grow+R*(1-grow);
      const k=side<0?kl:kr; const x=side*r*Math.sin(th)*k+(shake?Math.sin(g*40+i)*shake:0), y=-r*Math.cos(th);
      dd+=(i?'L':'M')+(cx+x).toFixed(1)+' '+(cy+y).toFixed(1);}
    s+=`<path d="${dd}" stroke="${col}" stroke-width="${w}" fill="none" opacity="${op}" stroke-dasharray="20 16" stroke-dashoffset="${(g*45*flow).toFixed(1)}" stroke-linecap="round"/>`;}}
  return s;
}
const m14_BLOBS=(()=>{const r=rng(77);return [[-.35,-.3,.38],[.25,.15,.42],[.7,-.45,.28],[-.65,.4,.3],[1.1,.3,.34],[-1.2,-.1,.4]].map(([x,y,sz])=>{let d='';for(let i=0;i<12;i++){const a=i/12*6.283,rr=sz*(.7+r()*.5);d+=(i?'L':'M')+(Math.cos(a)*rr).toFixed(3)+' '+(Math.sin(a)*rr*.8).toFixed(3);}return [x,y,d+'Z'];});})();
function m14_earth(cx,cy,R,g,o={}){
  const {spin=1,id='a',glow=.35,land=true}=o; const cid='m14e'+id; let L='';
  if(land){const off=(g*spin*.05)%3; m14_BLOBS.forEach(([x,y,d])=>{for(const k of [-3,0,3]){const xx=((x+off+k+1.5)%3+3)%3-1.5; if(Math.abs(xx)<1.4) L+=`<path d="${d}" transform="translate(${cx+xx*R},${cy+y*R}) scale(${R})" fill="#4FC36A" stroke="${INK}" stroke-width="${6/R}"/>`;}});}
  return `<circle cx="${cx}" cy="${cy}" r="${R*1.25}" fill="url(#gIce)" opacity="${glow}"/>
   <clipPath id="${cid}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>
   <circle cx="${cx}" cy="${cy}" r="${R}" fill="${m14_SEA}"/>
   <g clip-path="url(#${cid})">${L}<ellipse cx="${cx}" cy="${cy-R}" rx="${R*.7}" ry="${R*.16}" fill="#F2FAFF"/><ellipse cx="${cx}" cy="${cy+R}" rx="${R*.7}" ry="${R*.16}" fill="#F2FAFF"/>
     <circle cx="${cx+R*.45}" cy="${cy+R*.35}" r="${R*1.05}" fill="none" stroke="#000" stroke-width="${R*.5}" opacity=".18"/></g>
   <ellipse cx="${cx-R*.38}" cy="${cy-R*.45}" rx="${R*.3}" ry="${R*.16}" fill="#fff" opacity=".18" transform="rotate(-30 ${cx-R*.38} ${cy-R*.45})"/>
   <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK}" stroke-width="10"/>`;
}
function m14_core(cx,cy,R,g,o={}){
  const {iron=0}=o; let sw='';
  for(let i=0;i<6;i++){const rr=R*(.3+(i%3)*.07), a0=i*60+g*(i%2?-38:30);
    const p=a=>[cx+Math.cos(a*Math.PI/180)*rr,cy+Math.sin(a*Math.PI/180)*rr];const [x1,y1]=p(a0),[x2,y2]=p(a0+70);
    sw+=`<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${rr} ${rr} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="#FFE7A0" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/>`;}
  return `<circle cx="${cx}" cy="${cy}" r="${R*1.15}" fill="url(#gWarm)" opacity=".35"/>
   <circle cx="${cx}" cy="${cy}" r="${R}" fill="#7A5A3A" stroke="${INK}" stroke-width="10"/>
   <circle cx="${cx}" cy="${cy}" r="${R*.94}" fill="#B8432E"/>
   <circle cx="${cx}" cy="${cy}" r="${R*.55}" fill="#FF8A2A" stroke="${INK}" stroke-width="6"/>${sw}
   <circle cx="${cx}" cy="${cy}" r="${R*.3}" fill="url(#gGold)"/><circle cx="${cx}" cy="${cy}" r="${R*.19}" fill="#FFE14D" stroke="${INK}" stroke-width="6"/>
   ${iron?`<g opacity="${iron}">${[0,1,2,3,4].map(i=>{const a=i*72+g*20,rr=R*.42;return `<g transform="translate(${cx+Math.cos(a*Math.PI/180)*rr},${cy+Math.sin(a*Math.PI/180)*rr})"><circle r="30" fill="#C9D3E3" stroke="${INK}" stroke-width="5"/><text y="11" text-anchor="middle" font-size="30" font-weight="900" fill="${INK}">Fe</text></g>`;}).join('')}</g>`:''}`;
}
function m14_compass(x,y,s,ang,o={}){
  const {glow=0,face='#FFF6EA',rim='#C9A46A'}=o; let tk='';
  for(let i=0;i<8;i++) tk+=`<path d="M0 -90 V${i%2?-80:-72}" stroke="${INK}" stroke-width="${i%2?4:6}" transform="rotate(${i*45})"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${glow?`<circle r="230" fill="url(#gIce)" opacity="${glow}"/>`:''}
   <circle r="112" fill="${rim}" stroke="${INK}" stroke-width="10"/><circle r="92" fill="${face}" stroke="${INK}" stroke-width="6"/>${tk}
   <text y="-46" text-anchor="middle" font-size="30" font-weight="900" fill="${P.red}">N</text>
   <g transform="rotate(${ang})"><path d="M0 -74 L16 0 L-16 0Z" fill="${P.red}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M0 74 L16 0 L-16 0Z" fill="#E8EEF8" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>
   <circle r="11" fill="${INK}"/></g>`;
}
// Glint with a glowing compass on his chest
function m14_glintC(o,ang=0,glow=.8){const s=o.s||1,by=Math.sin((o.t||0)*2.4)*5;return glint(o)+m14_compass(o.x,o.y+by+100*s,.42*s,ang,{glow});}
function m14_robin(x,y,s,flap,o={}){
  const {dir=1}=o; const w=Math.sin(flap);
  return `<g transform="translate(${x},${y}) scale(${s*dir},${s})">
   <path d="M-60 0 L-135 -22 L-128 20Z" fill="#6A4A30" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
   <ellipse cx="0" cy="0" rx="80" ry="48" fill="#8A6A4A" stroke="${INK}" stroke-width="7"/>
   <path d="M30 -30 Q80 -10 70 30 Q40 46 10 30 Q20 0 30 -30Z" fill="#FF7A2E"/>
   <circle cx="64" cy="-28" r="38" fill="#8A6A4A" stroke="${INK}" stroke-width="7"/>
   <path d="M46 -22 Q58 14 100 -10 Q98 -34 78 -36Z" fill="#FF7A2E"/>
   <circle cx="78" cy="-38" r="8" fill="${INK}"/><circle cx="80" cy="-41" r="3" fill="#fff"/>
   <path d="M98 -34 L128 -26 L98 -18Z" fill="#E8B04A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
   <path d="M-6 -24 Q-36 ${-80-w*55} -84 ${-62-w*70} Q-56 -30 -24 -8Z" fill="#6A4A30" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`;
}
function m14_turtle(x,y,s,g,a=0,o={}){
  const {swim=1}=o; const f=Math.sin(g*5)*22*swim;
  const fl=(fx,fy,r,sx,sy)=>`<ellipse cx="${fx}" cy="${fy}" rx="${sx}" ry="${sy}" fill="#6BBF78" stroke="${INK}" stroke-width="6" transform="rotate(${r} ${fx} ${fy})"/>`;
  let hex=`<path d="M-22 -26 L22 -26 L36 0 L22 26 L-22 26 L-36 0Z" fill="#46A262" stroke="#1F5A34" stroke-width="5"/>`;
  [[-56,-22],[-56,22],[0,-50],[0,50],[50,-22],[50,22]].forEach(([hx,hy])=>hex+=`<circle cx="${hx}" cy="${hy}" r="14" fill="#46A262" stroke="#1F5A34" stroke-width="4"/>`);
  return `<g transform="translate(${x},${y}) rotate(${a}) scale(${s})">
   ${fl(40,-56,-40-f,46,18)}${fl(40,56,40+f,46,18)}${fl(-58,-44,-150+f*.5,28,14)}${fl(-58,44,150-f*.5,28,14)}
   <ellipse cx="96" cy="0" rx="32" ry="24" fill="#6BBF78" stroke="${INK}" stroke-width="6"/><circle cx="108" cy="-10" r="5" fill="${INK}"/><circle cx="108" cy="10" r="5" fill="${INK}"/>
   <ellipse cx="0" cy="0" rx="84" ry="66" fill="#2E7A4A" stroke="${INK}" stroke-width="8"/>${hex}</g>`;
}
function m14_salmon(x,y,s,g,dir=1){const w=Math.sin(g*8)*12;
  return `<g transform="translate(${x},${y}) scale(${s*dir},${s})"><path d="M-70 0 L-122 ${-34+w} L-116 ${34+w}Z" fill="#E06A5A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
   <path d="M-84 0 Q-20 -50 64 -16 Q96 0 64 16 Q-20 50 -84 0Z" fill="#F28C7A" stroke="${INK}" stroke-width="7"/>
   <path d="M-60 2 Q0 -18 66 -2" stroke="#E8EEF8" stroke-width="10" fill="none" opacity=".7" stroke-linecap="round"/><circle cx="58" cy="-6" r="7" fill="${INK}"/></g>`;}
function m14_sat(x,y,s,rot=0,gl=0,g=0){const jx=gl?Math.sin(g*70)*8*gl:0;
  const pan=xx=>`<rect x="${xx}" y="-28" width="96" height="56" fill="#2C4A8A" stroke="${INK}" stroke-width="6"/><path d="M${xx+32} -28 V28 M${xx+64} -28 V28 M${xx} 0 H${xx+96}" stroke="#7CC4FF" stroke-width="3"/>`;
  return `<g transform="translate(${x+jx},${y}) rotate(${rot}) scale(${s})">${pan(-150)}${pan(54)}<path d="M-54 0 H54" stroke="${INK}" stroke-width="8"/>
   <rect x="-40" y="-44" width="80" height="88" rx="12" fill="#C9D3E3" stroke="${INK}" stroke-width="7"/><path d="M0 -44 V-76" stroke="${INK}" stroke-width="6"/><circle cy="-80" r="9" fill="${gl?P.red:P.mint}" stroke="${INK}" stroke-width="4"/>
   ${gl?`<g opacity="${gl}"><path d="M-70 -70 l20 20 l-14 6 l22 22" stroke="${P.gold}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M70 60 l-18 -18 l14 -6 l-22 -22" stroke="${P.gold}" stroke-width="7" fill="none" stroke-linecap="round"/></g>`:''}</g>`;}
function m14_sun(x,y,r,g){let ry='';for(let i=0;i<14;i++){const a=i*360/14+g*8,l=r*.4+Math.sin(g*4+i)*r*.1;ry+=`<path d="M-14 ${-r+6} L0 ${-r-l} L14 ${-r+6}Z" fill="${P.gold}" stroke="${INK}" stroke-width="5" stroke-linejoin="round" transform="rotate(${a})"/>`;}
  return `<g transform="translate(${x},${y})"><circle r="${r*2.2}" fill="url(#gWarm)" opacity=".6"/>${ry}<circle r="${r}" fill="#FFB52E" stroke="${INK}" stroke-width="10"/><circle cx="${-r*.3}" cy="${-r*.3}" r="${r*.35}" fill="#FFE14D" opacity=".7"/></g>`;}
function m14_aurora(x,y,w,h,g,op=1){let s='';
  for(let k=0;k<3;k++){const col=[m14_AUR,m14_F,m14_F2][k];const n=26,pts=[];
    for(let i=0;i<=n;i++){const px=x+w*i/n;pts.push([px,y-h+Math.sin(i*.5+g*1.3+k*2)*45+k*40,y+Math.sin(i*.4+g+k)*22]);}
    const dd='M'+pts.map(q=>q[0].toFixed(0)+' '+q[1].toFixed(0)).join(' L')+' L'+pts.slice().reverse().map(q=>q[0].toFixed(0)+' '+q[2].toFixed(0)).join(' L')+'Z';
    s+=`<path d="${dd}" fill="${col}" opacity="${op*(.3-k*.07)}"/>`;
    pts.forEach((q,i)=>{if(i%2===k%2)s+=`<path d="M${q[0].toFixed(0)} ${q[2].toFixed(0)} V${q[1].toFixed(0)}" stroke="${col}" stroke-width="7" opacity="${op*.12}"/>`;});}
  return s;}
function m14_eeg(x,y,w,g,dip=0,col=m14_AUR){let dd='';const n=170;
  for(let i=0;i<=n;i++){const u=i/n,b=Math.exp(-Math.pow((u-.6)/.1,2)),A=50*(1-dip*b*.85);dd+=(i?'L':'M')+(x+u*w).toFixed(1)+' '+(y+Math.sin(u*70-g*7)*A).toFixed(1);}
  return `<path d="${dd}" stroke="${col}" stroke-width="7" fill="none" stroke-linejoin="round"/>`;}
function m14_forest(g){let tr='';const r=rng(61);
  for(let row=0;row<2;row++)for(let i=0;i<14;i++){const x=i*150+(row?75:0)-40+r()*30,h=260+r()*200,y=row?900:760,c=row?'#0F3A24':'#0A2A1A';
    tr+=`<rect x="${x-10}" y="${y-40}" width="20" height="60" fill="#3A2A1A"/><path d="M${x} ${y-h} L${x+90} ${y-30} H${x-90}Z M${x} ${y-h+60} L${x+110} ${y+10} H${x-110}Z" fill="${c}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;}
  return `<rect width="1920" height="1080" fill="#061A12"/>${nightSky(g).replace('#05060F','#071A14')}${tr}<rect y="900" width="1920" height="180" fill="#05140C"/>`;}
function m14_phone(x,y,s,crossed=0){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-55" y="-95" width="110" height="190" rx="18" fill="${INK}"/><rect x="-45" y="-80" width="90" height="150" rx="8" fill="#2C6E8A"/><circle cy="82" r="6" fill="#555"/>${crossed?icon('cross',50,-80,.6*crossed):''}</g>`;}
function m14_map(x,y,s,crossed=0){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-100 -70 L-35 -90 L35 -70 L100 -90 V70 L35 90 L-35 70 L-100 90Z" fill="#FFF6EA" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-35 -90 V70 M35 -70 V90" stroke="#C9C2B8" stroke-width="5"/><path d="M-80 40 Q-20 -20 20 20 T80 -50" stroke="${P.red}" stroke-width="7" fill="none" stroke-dasharray="12 10"/>${crossed?icon('cross',80,-80,.6*crossed):''}</g>`;}
function m14_cup(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M48 -30 q46 0 46 34 q0 34 -46 34" stroke="${INK}" stroke-width="22" fill="none"/><path d="M48 -30 q46 0 46 34 q0 34 -46 34" stroke="#FF8FA3" stroke-width="10" fill="none"/><path d="M-60 -60 H60 L50 60 Q0 74 -50 60Z" fill="#FF8FA3" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><ellipse cy="-60" rx="60" ry="14" fill="#7A4A2A" stroke="${INK}" stroke-width="6"/></g>`;}
function m14_rose(x,y,s,g,o={}){const {lit=[1,1,1,1]}=o;const L=[['N',0,P.red],['E',90,P.white],['S',180,P.white],['W',270,P.white]];
  return `<g transform="translate(${x},${y}) scale(${s})"><circle r="250" fill="url(#gGold)" opacity=".35"/><circle r="170" fill="none" stroke="${P.gold}" stroke-width="6" opacity=".6"/>
   ${L.map(([n,a,c],i)=>`<g transform="rotate(${a})" opacity="${lit[i]}"><path d="M0 -150 L26 0 L-26 0Z" fill="${i?'#FFF6EA':P.red}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`).join('')}
   ${L.map(([n,a,c],i)=>{const rr=230,xx=Math.sin(a*Math.PI/180)*rr,yy=-Math.cos(a*Math.PI/180)*rr;return T(xx,yy+30,n,{size:90*lit[i]+.01,fill:i?P.gold:P.red});}).join('')}<circle r="22" fill="${INK}"/></g>`;}

Object.assign(SHOTS,{
magHook(t,d,p,g){
  const fo=AT(t,p.forest??2.8), ci=AT(t,p.city??4), dk=AT(t,p.dark??6.3), lo=AT(t,p.lost??8.1), no=AT(t,p.north??3.2);
  const bg= lo?bgNight(g) : dk?`<rect width="1920" height="1080" fill="#020308"/>` : ci?bgNight(g) : fo?m14_forest(g) : card('cardDark',g)+m14_field(1380,560,170,g,{op:.6})+m14_earth(1380,560,170,g,{id:'h'});
  const lab= lo?['NEVER LOST AGAIN',P.mint,p.lost??8.1] : dk?['IN TOTAL DARKNESS',P.ice,p.dark??6.3] : ci?['IN A NEW CITY',P.gold,p.city??4] : fo?['IN A FOREST',m14_AUR,p.forest??2.8] : no?['YOU ALWAYS KNOW NORTH',P.white,p.north??3.2]:['FEEL THE PLANET?',m14_F,.2];
  const gx=fo?960:600, ang=-35+Math.sin(g*2.2)*4;
  return `${bg}
   ${dk&&!lo?`<circle cx="960" cy="${620}" r="420" fill="url(#gIce)" opacity=".25"/>`:''}
   <g opacity="${dk&&!lo?.35:1}">${glint({x:gx,y:540,s:1.05,t:g,mouth:lo?'grin':(no?'smile':'o'),brows:no?'calm':'raised',pose:lo?'flex':(ci?'point':'down'),blink:BL(g),glint:lo?1:0})}</g>
   ${m14_compass(gx,540+Math.sin(g*2.4)*5+105,.5,ang,{glow:1})}
   ${no?`<g transform="translate(${gx-330},330)">${T(0,0,'N',{size:90,fill:P.red,sc:1+Math.sin(g*4)*.06})}<circle cy="-30" r="80" fill="url(#gRed)" opacity=".5"/></g>`:''}
   ${T(960,150,lab[0],{size:96,fill:lab[1],sc:pop(t,lab[2])})}`;
},
magTeaser(t,d,p,g){
  const tu=AT(t,p.turtle??1.3), br=AT(t,p.brain??3);
  return `${card('cardDark',g)}
   <g transform="translate(400,${470+Math.sin(g*2)*14})">${m14_robin(0,0,1.25*pop(t,0),g*9)}</g>${T(400,700,'BIRDS',{size:64,fill:P.warm,sc:pop(t,.1)})}
   ${tu?`${m14_turtle(960,470,1.2*pop(t,p.turtle??1.3),g,-90+Math.sin(g)*6)}${T(960,700,'SEA TURTLES',{size:64,fill:m14_AUR,sc:pop(t,p.turtle??1.3)})}`:''}
   ${br?`${brain(1520,470,.9*pop(t,p.brain??3),1,g)}${T(1520,700,'YOUR BRAIN?',{size:64,fill:'#FF9EC0',sc:pop(t,p.brain??3)})}${T(1700,320,'?',{size:140,fill:P.gold,sc:pop(t,(p.brain??3)+.6)*(1+Math.sin(g*5)*.08)})}`:''}
   ${m14_field(960,470,90,g,{op:.18,Ls:[3,5,8]})}
   ${T(960,150,'THEY CAN FEEL IT',{size:96,fill:P.white,sc:IN(t,.2)})}`;
},
magCore(t,d,p,g){
  const co=AT(t,p.core??3.3), ir=AT(t,p.iron??11.4), fi=AT(t,p.field??12.9), cp=AT(t,p.comp??18.7);
  if(!co) return `${bgCard('cardIce',g)}${m14_field(960,560,230,g,{op:.35})}${m14_earth(960,560,230,g,{id:'c0'})}${glint({x:960,y:240,s:.35,t:g,mouth:'o',brows:'raised',blink:BL(g)})}${T(960,150,"EARTH'S MAGNETIC FIELD",{size:90,fill:m14_F,sc:IN(t,.2)})}`;
  if(!fi){const R=330;return `${card('cardWarm',g)}${m14_core(820,560,R,g,{iron:ir?pop(t,p.iron??11.4):0})}
     <path d="M820 ${560-R} V${560-R*.55}" stroke="#fff" stroke-width="7" stroke-dasharray="14 10"/><path d="M806 ${560-R*.55-22} L820 ${560-R*.55} L834 ${560-R*.55-22}" stroke="#fff" stroke-width="7" fill="none"/>
     ${labelPill(1420,340,'~3,000 KM DOWN',P.gold,46)}<path d="M1180 350 L${830} ${560-R*.75}" stroke="${P.gold}" stroke-width="5" stroke-dasharray="10 10"/>
     ${AT(t,(p.core??3.3)+3)?labelPill(1420,540,'OUTER CORE',P.warm,46):''}${AT(t,(p.core??3.3)+5.5)?labelPill(1420,700,'HOT LIQUID METAL',P.coral,46):''}
     ${ir?T(1420,840,'MOSTLY IRON',{size:60,fill:'#C9D3E3',sc:pop(t,p.iron??11.4)}):''}
     ${T(960,140,'DEEP UNDER YOUR FEET',{size:84,fill:P.white,sc:pop(t,p.core??3.3)})}`;}
  const gr=eout(prog(t,p.field??12.9,(p.field??12.9)+2.5));
  return `${card('cardIce',g)}${m14_field(cp?700:960,540,200,g,{op:.85,grow:gr})}${m14_earth(cp?700:960,540,200,g,{id:'c1'})}
   ${cp?`${m14_compass(1450,520,1.5*pop(t,p.comp??18.7),lerp(110,0,eout(prog(t,(p.comp??18.7)+.4,(p.comp??18.7)+2)))+Math.sin(g*3)*3)}${T(1450,800,'LINES UP WITH THE FIELD',{size:50,fill:P.white,sc:pop(t,(p.comp??18.7)+2)})}`:''}
   ${T(960,140,cp?'WHY A COMPASS WORKS':'A FIELD AROUND THE PLANET',{size:84,fill:m14_F,sc:pop(t,cp?p.comp??18.7:p.field??12.9)})}`;
},
magFridge(t,d,p,g){
  const fr=AT(t,p.fridge??1.6), ev=AT(t,p.every??4.9), iv=AT(t,p.inv??7.5), nv=AT(t,p.never??8.6);
  if(ev) return `${bgNight(g)}${m14_field(960,560,210,g,{op:iv?.25+.15*Math.sin(g*3):.8})}${m14_earth(960,560,210,g,{id:'f'})}
     ${nv?`${glint({x:1560,y:560,s:.85,t:g,pose:'shrug',mouth:'flat',brows:'raised',blink:BL(g)})}${T(1560,240,'NEVER FELT IT',{size:60,fill:P.gold,sc:pop(t,p.never??8.6)})}`:''}
     ${T(960,140,iv?'INVISIBLE':'EVERYWHERE. ALL THE TIME.',{size:90,fill:iv?P.ice:m14_F,sc:pop(t,iv?p.inv??7.5:p.every??4.9)})}`;
  const fk=eout(prog(t,p.fridge??1.6,(p.fridge??1.6)+1.8));
  return `${card('cardDark',g)}
   <rect x="560" y="${820-6}" width="260" height="6" fill="${m14_F}"/>
   <rect x="1100" y="${820-480*fk}" width="260" height="${480*fk}" rx="12" fill="${P.red}" stroke="${INK}" stroke-width="7"/>
   <path d="M480 820 H1440" stroke="#fff" stroke-width="6" opacity=".5"/>
   ${m14_earth(690,700,70,g,{id:'f2',glow:.2})}${T(690,880,"EARTH'S FIELD",{size:46,fill:m14_F,stroke:8})}
   ${fr?`<g transform="translate(1230,${820-480*fk-90}) scale(${pop(t,p.fridge??1.6)})"><path d="M-60 40 V-10 A60 60 0 0 1 60 -10 V40 H24 V-10 A24 24 0 0 0 -24 -10 V40Z" fill="${P.red}" stroke="${INK}" stroke-width="7"/><rect x="-60" y="22" width="36" height="22" fill="#E8EEF8" stroke="${INK}" stroke-width="5"/><rect x="24" y="22" width="36" height="22" fill="#E8EEF8" stroke="${INK}" stroke-width="5"/></g>
     ${T(1230,880,'FRIDGE MAGNET',{size:46,fill:P.coral,stroke:8})}${T(1600,480,'~100×',{size:110,fill:P.gold,sc:pop(t,(p.fridge??1.6)+1.2)})}`:''}
   ${T(960,140,'THE FIELD IS WEAK',{size:96,fill:P.white,sc:IN(t,.2)})}`;
},
magRobin(t,d,p,g){
  const ni=AT(t,p.night??5.6), st=AT(t,p.stars??7), cp=AT(t,p.comp??8.7);
  const bx=lerp(300,1500,prog(t,0,d)), by=520+Math.sin(g*1.6)*30;
  const C=[[300,220],[430,170],[560,240],[700,190],[820,260]];
  return `${ni?nightSky(g):`<rect width="1920" height="1080" fill="url(#sky)"/>`}
   ${st?`<path d="M${C.map(c=>c.join(' ')).join(' L')}" stroke="${P.gold}" stroke-width="4" opacity=".7" stroke-dasharray="8 8"/>${C.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="${9+Math.sin(g*4+x)*3}" fill="${P.gold}"/>`).join('')}${T(560,330,'STARS',{size:48,fill:P.gold,stroke:8,sc:pop(t,p.stars??7)})}`:''}
   ${cp?m14_field(960,1500,700,g,{op:.35,Ls:[1.25,1.45,1.7],w:7}):''}
   ${m14_robin(bx,by,1.4,g*10)}
   ${cp?m14_compass(bx+40,by-190,.55*pop(t,p.comp??8.7),Math.sin(g*2)*5,{glow:.6}):''}
   ${!ni?`${labelPill(960,780,'EUROPEAN ROBIN',P.warm,48)}`:''}
   ${T(960,140,cp?'AND A MAGNETIC COMPASS':(ni?'OFTEN AT NIGHT':'THOUSANDS OF KM'),{size:90,fill:cp?m14_F:P.white,sc:pop(t,cp?p.comp??8.7:(ni?p.night??5.6:.2))})}`;
},
magEye(t,d,p,g){
  const pr=AT(t,p.protein??5.7); const z=eout(prog(t,p.protein??5.7,(p.protein??5.7)+1.2));
  if(!pr) return `${card('cardWarm',g)}<g transform="translate(860,640) scale(4)">${m14_robin(0,0,1,g*2)}</g>
     <circle cx="1172" cy="488" r="${70+Math.sin(g*4)*8}" fill="none" stroke="${m14_F}" stroke-width="8" stroke-dasharray="16 12"/>
     ${T(960,140,'A COMPASS IN ITS EYES?',{size:90,fill:P.white,sc:IN(t,.2)})}`;
  let prot=''; const r=rng(19);
  for(let i=0;i<14;i++){const x=560+r()*800,y=330+r()*460,a=Math.sin(g*3+i)*25;prot+=`<g transform="translate(${x},${y}) rotate(${a})"><ellipse rx="44" ry="22" fill="${P.gold}" stroke="${INK}" stroke-width="5"/><circle cx="-18" r="10" fill="#fff" opacity="${.5+.5*Math.sin(g*6+i)}"/><circle cx="18" r="10" fill="#fff" opacity="${.5+.5*Math.sin(g*6+i+2)}"/></g>`;}
  let fl=''; for(let i=0;i<6;i++){const y=280+i*110;fl+=`<path d="M300 ${y} H1620" stroke="${m14_F}" stroke-width="6" opacity=".45" stroke-dasharray="22 16" stroke-dashoffset="${-g*50}"/>`;}
  return `<rect width="1920" height="1080" fill="#0A0412"/><circle cx="960" cy="560" r="${300+z*260}" fill="#1B2440" stroke="${INK}" stroke-width="14"/><circle cx="960" cy="560" r="${300+z*260}" fill="url(#gIce)" opacity=".15"/>
   <g opacity="${z}">${fl}${prot}</g>
   ${AT(t,(p.protein??5.7)+2.5)?labelPill(960,830,'QUANTUM PHYSICS?',m14_F2,54):''}
   ${T(960,140,'SPECIAL PROTEINS',{size:90,fill:P.gold,sc:pop(t,p.protein??5.7)})}`;
},
magBirdView(t,d,p,g){
  const pt=eout(prog(t,p.pattern??4,(p.pattern??4)+1.5)); const base=.25+.45*pt;
  let bands=''; for(let i=0;i<5;i++){bands+=`<ellipse cx="${700+Math.sin(g*.5)*30}" cy="420" rx="${260+i*190}" ry="${150+i*110}" fill="none" stroke="${m14_F2}" stroke-width="40" opacity="${base*.25}"/>`;}
  return `${nightSky(g)}<path d="M0 820 Q300 700 640 780 T1300 760 T1920 800 V1080 H0Z" fill="#0F1A2E"/>
   <g>${bands}<circle cx="${700+Math.sin(g*.5)*30}" cy="420" r="260" fill="url(#gIce)" opacity="${base*.7}"/></g>
   <rect x="40" y="40" width="1840" height="860" rx="60" fill="none" stroke="${P.warm}" stroke-width="10" opacity=".7"/>
   ${m14_robin(1640,840,.55,g*9)}
   ${labelPill(1560,250,'MAYBE',P.gold,54)}
   ${T(960,150,'SEEING THE FIELD?',{size:96,fill:P.white,sc:IN(t,.2)})}`;
},
magNoise(t,d,p,g){
  const ge=AT(t,p.germany??2.1), sc=AT(t,p.scramble??8), sh=AT(t,p.shield??10.8);
  if(!ge) return `${wvBg()}${wifiWaves(960,560,g,{max:1100})}${router(960,560,1.6)}${T(960,150,'REMEMBER WIFI VISION?',{size:90,fill:WV,sc:IN(t,.2)})}`;
  const ang=sc&&!sh? (g*700)%360 : Math.sin(g*2)*4;
  let city=''; [[120,420],[300,560],[460,380],[620,500]].forEach(([x,h])=>city+=`<rect x="${x}" y="${880-h}" width="140" height="${h}" fill="#1E1638" stroke="${INK}" stroke-width="5"/>${[0,1,2,3].map(k=>`<rect x="${x+20+(k%2)*60}" y="${900-h+Math.floor(k/2)*70}" width="36" height="30" fill="${P.gold}" opacity=".5"/>`).join('')}`);
  return `${bgCard('cardDark',g)}${city}${wifiWaves(420,520,g,{max:sh?560:1600,col:WV2,op:.6})}
   ${sh?`<rect x="1000" y="300" width="560" height="520" rx="20" fill="#2A3248" opacity=".9" stroke="${P.steel}" stroke-width="14"/>${[...Array(8)].map((_,i)=>`<path d="M${1000+i*70} 300 V820" stroke="${P.steel}" stroke-width="4" opacity=".7"/>`).join('')}${[...Array(7)].map((_,i)=>`<path d="M1000 ${300+i*74} H1560" stroke="${P.steel}" stroke-width="4" opacity=".7"/>`).join('')}`:''}
   ${m14_robin(1280,700,.9,sh?0:g*12)}
   ${m14_compass(1280,450,.9,ang,{glow:sh?.6:0})}
   ${sc&&!sh?T(1500,420,'?!',{size:120,fill:P.red,sc:pop(t,p.scramble??8)}):''}${sh?icon('check',1640,300,.9*pop(t,p.shield??10.8)):''}
   ${labelPill(420,180+80,'CITY RADIO NOISE',WV2,40)}
   ${T(960,150,sh?'SHIELDED = COMPASS BACK':(sc?'SCRAMBLED':'GERMANY'),{size:84,fill:sh?P.mint:(sc?P.red:P.white),sc:pop(t,sh?p.shield??10.8:(sc?p.scramble??8:p.germany??2.1))})}`;
},
magTurtle(t,d,p,g){
  const ha=AT(t,p.hatch??2.9), sw=AT(t,p.swim??5.8), tr=AT(t,p.travel??8), bk=AT(t,p.back??11.9);
  if(tr&&!bk){const k=prog(t,p.travel??8,(p.back??11.9)-.2);const pth=u=>{const a=u*Math.PI*2;return [960+Math.sin(a)*620,560-Math.sin(a*2)*200+ (1-Math.cos(a))*40];};
    let dd='';for(let i=0;i<=60;i++){const u=i/60*k;const [x,y]=pth(u);dd+=(i?'L':'M')+x.toFixed(0)+' '+y.toFixed(0);}
    const [tx,ty]=pth(k),[tx2,ty2]=pth(k+.01);
    return `<rect width="1920" height="1080" fill="${m14_SEA}"/>${[...Array(8)].map((_,i)=>`<path d="M${((i*270+g*30)%2100)-100} ${260+i*80} q30 -16 60 0 t60 0" stroke="#7CC4FF" stroke-width="5" fill="none" opacity=".5"/>`).join('')}
     <path d="M840 860 Q960 820 1080 860 V1080 H840Z" fill="${m14_SAND}" stroke="${INK}" stroke-width="6"/>
     <path d="${dd}" stroke="#fff" stroke-width="7" fill="none" stroke-dasharray="14 14" opacity=".8"/>
     ${m14_turtle(tx,ty,.7,g,Math.atan2(ty2-ty,tx2-tx)*180/Math.PI)}
     ${T(960,150,'THOUSANDS OF KM',{size:96,fill:P.white,sc:pop(t,p.travel??8)})}`;}
  const beach=`<rect width="1920" height="1080" fill="url(#sky)"/><rect y="380" width="1920" height="300" fill="${m14_SEA}"/>${[0,1,2].map(i=>`<path d="M0 ${560+i*50+Math.sin(g*2+i)*10} Q480 ${540+i*50} 960 ${560+i*50+Math.sin(g*2+i)*10} T1920 ${560+i*50}" stroke="#7CC4FF" stroke-width="5" fill="none" opacity=".5"/>`).join('')}
   <path d="M0 ${680+Math.sin(g*1.5)*8} Q960 ${640+Math.sin(g*1.5)*8} 1920 ${680+Math.sin(g*1.5)*8} V1080 H0Z" fill="${m14_SAND}" stroke="${INK}" stroke-width="6"/>`;
  if(bk){return `${beach}${m14_turtle(960,800,1.3,g*.3,-90,{swim:.3})}${[0,1,2,3].map(i=>`<circle cx="${1240+i*46}" cy="${850+(i%2)*20}" r="20" fill="#FFF6EA" stroke="${INK}" stroke-width="5"/>`).join('')}
     ${labelPill(960,460,'SAME BEACH. YEARS LATER.',P.gold,48)}${T(960,150,'IT COMES HOME',{size:96,fill:m14_AUR,sc:pop(t,p.back??11.9)})}`;}
  const k=sw?prog(t,p.swim??5.8,(p.travel??8)):0; const hx=960, hy=ha?lerp(900,620,eout(prog(t,p.hatch??2.9,(p.swim??5.8)))):900;
  return `${beach}<ellipse cx="960" cy="920" rx="120" ry="30" fill="#C9A86A" stroke="${INK}" stroke-width="5"/>
   ${ha?m14_turtle(hx,hy-k*240,.7*pop(t,p.hatch??2.9),g,-90):`<ellipse cx="960" cy="890" rx="40" ry="50" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/>`}
   ${T(960,150,ha?'A BABY TURTLE HATCHES':'SEA TURTLES',{size:90,fill:ha?P.white:m14_AUR,sc:pop(t,ha?p.hatch??2.9:.2)})}`;
},
magSignature(t,d,p,g){
  const an=AT(t,p.angle??5.8), hm=AT(t,p.home??9.2), sa=AT(t,p.salmon??13.7);
  if(sa) return `<rect width="1920" height="1080" fill="url(#lab)"/><path d="M0 760 Q500 700 900 640 Q1300 560 1920 300 V420 Q1300 680 900 760 Q500 830 0 900Z" fill="#2C6EAA" stroke="${INK}" stroke-width="6"/>
     <path d="M0 0 H1920 V300 Q1300 560 900 640 Q500 700 0 760Z" fill="#2E6A3A"/><path d="M0 900 Q500 830 900 760 Q1300 680 1920 420 V1080 H0Z" fill="#2E6A3A"/>
     ${m14_salmon(lerp(200,1500,prog(t,p.salmon??13.7,d)),lerp(830,500,prog(t,p.salmon??13.7,d)),1.6,g,1)}
     ${labelPill(1600,250,'HOME RIVER',P.gold,46)}${T(960,140,'SALMON TOO',{size:96,fill:'#F28C7A',sc:pop(t,p.salmon??13.7)})}`;
  const segs=8; let coast='';
  for(let i=0;i<segs;i++){const y=230+i*85, home=i===5, on=hm&&home;
    const a=-60+i*17, l=60+((i*37)%50);
    coast+=`<rect x="1000" y="${y}" width="80" height="80" fill="${on?P.gold:['#3E9A5A','#4FAF6A'][i%2]}" stroke="${INK}" stroke-width="5"/>
     <g transform="translate(1200,${y+40}) rotate(${a+Math.sin(g*2+i)*3})" opacity="${an?1:.6}"><path d="M0 0 H${l}" stroke="${on?P.gold:m14_F}" stroke-width="10" stroke-linecap="round"/><path d="M${l} 0 l-18 -12 M${l} 0 l-18 12" stroke="${on?P.gold:m14_F}" stroke-width="10" stroke-linecap="round"/></g>`;}
  const tk=hm?prog(t,(p.home??9.2)+1,(p.salmon??13.7)-.3):0;
  return `<rect width="1920" height="1080" fill="${m14_SEA}"/><rect x="1000" y="0" width="920" height="1080" fill="#2E6A3A"/>${coast}
   ${an?`${labelPill(1560,420,'STRENGTH',m14_F,44)}${labelPill(1560,560,'ANGLE',m14_F2,44)}`:''}
   ${hm?`${labelPill(1560,720,'HOME',P.gold,50)}${m14_turtle(lerp(300,930,eout(tk)),lerp(300,700,eout(tk)),.8,g,lerp(30,10,tk))}`:''}
   ${T(960,140,hm?'IT REMEMBERS HOME':'A MAGNETIC SIGNATURE',{size:90,fill:hm?P.gold:P.white,sc:pop(t,hm?p.home??9.2:.2)})}`;
},
magWake(t,d,p,g){
  const wk=AT(t,p.wake??2.4), no=AT(t,p.north??8.3), pl=AT(t,p.pull??10), dn=AT(t,p.down??11.6);
  if(!wk) return `${card('cardMint',g)}${m14_glintC({x:620,y:520,s:1.1,t:g,pose:'flex',mouth:'grin',blink:BL(g),glint:1},Math.sin(g*2)*5,1)}${T(1300,470,'YOUR NEW',{size:110,fill:P.mint})}${T(1300,640,'SENSE',{size:150,fill:P.white,sc:pop(t,.3)})}`;
  const ang=-90+Math.sin(g*1.5)*3;
  return `${bgRoom(g)}<rect x="300" y="660" width="900" height="90" rx="20" fill="#E8EEF8" stroke="${INK}" stroke-width="8"/><rect x="260" y="560" width="60" height="260" rx="14" fill="#7A5A3A" stroke="${INK}" stroke-width="7"/><rect x="300" y="740" width="30" height="100" fill="#7A5A3A"/><rect x="1170" y="740" width="30" height="100" fill="#7A5A3A"/>
   <ellipse cx="420" cy="630" rx="90" ry="34" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/>
   <g transform="translate(520,640) rotate(-90)">${glint({s:.62,t:0,eyes:'closed',mouth:'smile',scarf:true})}</g>
   <path d="M620 640 Q900 600 1180 650 V700 H620Z" fill="${P.violet}" stroke="${INK}" stroke-width="7" opacity=".95"/>
   ${m14_compass(780,560,.4,ang+90,{glow:.8})}
   ${no?`<g transform="translate(${1520+(pl?Math.sin(g*2)*20:0)},420)"><circle r="160" fill="url(#gIce)" opacity="${.5+.3*Math.sin(g*3)}"/>${T(0,30,'N',{size:150,fill:P.red})}</g>${T(1520,620,'NORTH →',{size:64,fill:m14_F,sc:pop(t,p.north??8.3)})}`:''}
   ${pl?[0,1,2].map(i=>{const k=((g*.6+i/3)%1);return `<path d="M${900+k*400} ${520-i*30} q20 -14 40 0" stroke="${m14_F}" stroke-width="7" fill="none" opacity="${1-k}"/>`;}).join(''):''}
   ${T(960,140,dn?'LIKE KNOWING WHICH WAY IS DOWN':(pl?'A GENTLE PULL':'EYES CLOSED. YOU KNOW.'),{size:dn?72:90,fill:P.white,sc:pop(t,dn?p.down??11.6:(pl?p.pull??10:p.wake??2.4))})}`;
},
magCity(t,d,p,g){
  const ph=AT(t,p.phone??3.7), mp=AT(t,p.map??4.7), ca=AT(t,p.calm??5.7), hm=AT(t,p.home??9.9), lo=AT(t,p.lost??12.4);
  const ang=-30+Math.sin(g*2)*4;
  if(lo) return `${bgNight(g)}${[[300,'#FFD3A8'],[560,'#C68B59'],[1460,'#F2C9A0'],[1700,'#9AD1FF']].map(([x,h],i)=>extra({x,y:580,s:.75,t:g+i,head:h,mouth:'flat',pose:'hold'})+T(x,330,'?',{size:90,fill:P.coral,sc:1+Math.sin(g*4+i)*.1})).join('')}
     ${m14_glintC({x:960,y:540,s:1,t:g,pose:'hips',mouth:'grin',blink:BL(g),glint:1},ang,1)}${T(960,140,'LOST? NOT YOU.',{size:100,fill:P.mint,sc:pop(t,p.lost??12.4)})}`;
  return `${bgNight(g,t*60)}
   ${m14_glintC({x:lerp(560,760,prog(t,0,d)),y:560,s:.95,t:g,legs:ca?'stand':'walk',mouth:ca?'smile':'o',pose:hm?'point':'down',blink:BL(g)},ang,1)}
   ${ph?m14_phone(1240,660,1.1*pop(t,p.phone??3.7),1):''}${mp?m14_map(1560,660,1.1*pop(t,p.map??4.7),1):''}
   ${hm?`<g transform="translate(1400,320)">${icon('home',0,0,1.1*pop(t,p.home??9.9))}<circle r="150" fill="url(#gGold)" opacity="${.4+.3*Math.sin(g*3)}"/></g>${T(1400,460,'HOME →',{size:64,fill:P.gold})}`:''}
   ${T(960,140,hm?'YOU ALWAYS KNOW THE WAY':(ca?'NOT WORRIED AT ALL':'A CITY YOU NEVER VISITED'),{size:84,fill:hm?P.gold:P.white,sc:pop(t,hm?p.home??9.9:(ca?p.calm??5.7:.2))})}`;
},
magGuugu(t,d,p,g){
  if(p.real!=null&&t<p.real) return `${card('cardWarm',g)}${glint({x:560,y:520,s:1.1,t:g,pose:'point',mouth:'grin',blink:BL(g)})}${T(1320,470,'REAL PEOPLE',{size:100,fill:P.gold,sc:IN(t,.3)})}${T(1320,640,'ALREADY DO THIS',{size:90,fill:P.white,sc:IN(t,2.2)})}`;
  const no=AT(t,p.no??5.5), di=AT(t,p.dirs??9.9); const lit=[p.n??11.4,p.e??13.2,p.s??12.2,p.w??14].map(a=>AT(t,a)?pop(t,a):0);
  const land=`<rect width="1920" height="1080" fill="url(#future)"/><path d="M0 820 Q500 760 960 800 T1920 780 V1080 H0Z" fill="#8A3A20" stroke="${INK}" stroke-width="6"/><rect y="880" width="1920" height="200" fill="#6A2A18"/>`;
  if(di) return `${card('cardGold',g)}${m14_rose(960,560,1.15,g,{lit})}${T(960,140,'THEY USE DIRECTIONS',{size:90,fill:P.white,sc:pop(t,p.dirs??9.9)})}`;
  return `${land}${[[560,'#8D5A3B'],[960,'#6B4226'],[1360,'#A0663F']].map(([x,h],i)=>extra({x,y:540,s:.85,t:g+i,head:h,mouth:'smile',pose:i===1?'point':'down'})).join('')}
   ${no?`${labelPill(700,300,'LEFT',P.white,54)}${labelPill(1220,300,'RIGHT',P.white,54)}${icon('cross',820,240,.6*pop(t,p.no??5.5))}${icon('cross',1360,240,.6*pop(t,p.no??5.5))}`:labelPill(960,300,'NORTHERN AUSTRALIA',P.gold,52)}
   ${T(960,140,'GUUGU YIMITHIRR',{size:100,fill:P.gold,sc:IN(t,.2)})}`;
},
magCup(t,d,p,g){
  const nr=AT(t,p.north??3.8), kn=AT(t,p.know??6.7), pt=AT(t,p.point??12.1);
  if(AT(t,p.trained)) return `${card('cardDark',g)}${glint({x:560,y:520,s:1.1,t:g,pose:'point',mouth:'smile',blink:BL(g)})}${brain(1340,330,.6,.6+.4*Math.sin(g*3),g)}${T(1340,600,'NO MAGNET SENSE',{size:80,fill:m14_F,sc:pop(t,p.trained)})}${T(1340,740,'JUST PRACTICE',{size:96,fill:P.white,sc:pop(t,p.trained+1.9)})}`;
  if(pt) return `${card('cardDark',g)}<path d="M500 420 L960 180 L1420 420 V860 H500Z" fill="#22305A" stroke="${P.ice}" stroke-width="10" stroke-linejoin="round"/>
     ${extra({x:860,y:560,s:.85,t:g,head:'#8D5A3B',pose:'up'})}<path d="M940 300 V200" stroke="${P.red}" stroke-width="10"/><path d="M920 220 L940 190 L960 220" stroke="${P.red}" stroke-width="10" fill="none"/>${T(1010,210,'N',{size:70,fill:P.red})}
     ${icon('check',1240,560,.9*pop(t,(p.point??12.1)+1.5))}${labelPill(1240,720,'EVEN INDOORS',P.mint,40)}
     ${T(960,120,'THEY POINT NORTH',{size:90,fill:P.white,sc:pop(t,p.point??12.1)})}`;
  return `${card('cardWarm',g)}<rect x="1060" y="700" width="640" height="40" rx="10" fill="#7A5A3A" stroke="${INK}" stroke-width="7"/>${m14_cup(1200,630,.9)}
   ${extra({x:560,y:560,s:.9,t:g,head:'#8D5A3B',mouth:'smile',pose:'point'})}
   ${!nr?bubble(560,190,540,130,'ON YOUR LEFT',{size:60}):`<g opacity=".35">${bubble(560,190,540,130,'ON YOUR LEFT',{size:60})}</g>${bubble(1060,330,620,140,'TO YOUR NORTH',{size:64,col:P.red})}`}
   ${nr?icon('cross',820,150,.55*pop(t,p.north??3.8)):''}
   ${kn?`${m14_rose(1600,320,.45,g)}${T(1300,880,'ALWAYS KNOW WHICH WAY YOU FACE',{size:46,fill:P.gold,stroke:8,sc:pop(t,p.know??6.7)})}`:''}`;
},
magPole(t,d,p,g){
  const ch=AT(t,p.change??3.8), dr=AT(t,p.drift??9), km=AT(t,p.km??13.5), mp=AT(t,p.maps??17.8), fe=AT(t,p.feel??22.9);
  if(!dr) return `${bgCard('cardDark',g)}${m14_field(960,580,220,g,{op:.6})}${m14_earth(960,580,220,g,{id:'p0',spin:ch?4:1})}${ch?`<circle cx="960" cy="580" r="${300+Math.sin(g*3)*20}" fill="none" stroke="${P.gold}" stroke-width="6" opacity=".5" stroke-dasharray="20 20"/>`:''}
     ${T(960,140,ch?'THE PLANET CHANGING':'SOMETHING EVEN BIGGER',{size:90,fill:ch?P.gold:P.white,sc:pop(t,ch?p.change??3.8:.2)})}`;
  const cx=fe?620:900, cy=560, R=fe?330:360; const k=prog(t,p.drift??9,(p.drift??9)+9);
  const s0=[cx-R*.38,cy+R*.28], s1=[cx+R*.32,cy-R*.3]; const px=lerp(s0[0],s1[0],k), py=lerp(s0[1],s1[1],k);
  let trail='';for(let i=0;i<=12;i++){const u=k*i/12;trail+=`<circle cx="${lerp(s0[0],s1[0],u)}" cy="${lerp(s0[1],s1[1],u)}" r="7" fill="${P.red}" opacity="${.3+.5*i/12}"/>`;}
  const sc=R/360;
  return `${bgCard('cardIce',g)}<clipPath id="m14arc"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath><circle cx="${cx}" cy="${cy}" r="${R}" fill="#2A5E9A" stroke="${INK}" stroke-width="10"/>
   <g clip-path="url(#m14arc)" transform="translate(${cx},${cy}) scale(${sc})"><path d="M-400 120 Q-300 40 -200 90 Q-120 30 -60 140 Q-20 220 40 260 L-40 420 H-420Z" fill="#4FC36A" stroke="${INK}" stroke-width="6"/>
     <path d="M-60 -40 Q-10 -110 60 -60 Q40 20 -20 40Z" fill="#E8F4FF" stroke="${INK}" stroke-width="6"/>
     <path d="M60 -420 L420 -420 V40 Q340 -40 260 -80 Q180 -150 120 -230 Q60 -300 60 -420Z" fill="#4FC36A" stroke="${INK}" stroke-width="6"/></g>
   ${T(cx-R*.62,cy+R*.62,'CANADA',{size:46*Math.max(sc,.9),fill:P.white,stroke:8})}${T(cx+R*.55,cy-R*.66,'SIBERIA',{size:46*Math.max(sc,.9),fill:P.white,stroke:8})}
   ${trail}<circle cx="${px}" cy="${py}" r="${26+Math.sin(g*5)*4}" fill="${P.red}" stroke="${INK}" stroke-width="6"/><circle cx="${px}" cy="${py}" r="70" fill="url(#gRed)" opacity=".6"/>
   ${km&&!fe?`${labelPill(1500,380,'~50 KM / YEAR',P.gold,52)}`:''}
   ${mp&&!fe?`${m14_phone(1400,640,.9*pop(t,p.maps??17.8))}<g transform="translate(1640,640) scale(${pop(t,(p.maps??17.8)+.5)}) rotate(-30)"><path d="M0 -90 Q14 -80 14 -40 L90 10 V30 L14 0 V60 L36 80 V94 L0 84 L-36 94 V80 L-14 60 V0 L-90 30 V10 L-14 -40 Q-14 -80 0 -90Z" fill="#E8EEF8" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>${labelPill(1520,820,'MAPS NEED UPDATES',m14_F,42)}`:''}
   ${fe?`${m14_glintC({x:1380,y:520,s:.95,t:g,mouth:'o',brows:'raised',blink:BL(g)},lerp(-10,25,prog(t,p.feel??22.9,d)),1)}${T(1380,880-20,'NORTH, SLOWLY SLIDING',{size:50,fill:P.gold,stroke:8})}`:''}
   ${T(960,120,'THE NORTH MAGNETIC POLE MOVES',{size:76,fill:P.white,sc:pop(t,p.drift??9)})}`;
},
magAnomaly(t,d,p,g){
  const sa=AT(t,p.sat??3.9); const cx=960, cy=580, R=300;
  const a=(g*.5)%(2*Math.PI); const ox=cx+Math.cos(a)*R*1.3, oy=cy+Math.sin(a)*R*.42; const front=Math.sin(a)>0;
  const over=front && Math.abs(ox-(cx-R*.05))<R*.7; const sp=[cx-R*.05,cy+R*.42];
  const SA=[[-.55,-.15],[-.3,-.22],[-.12,-.02],[-.18,.25],[-.32,.5],[-.42,.78],[-.5,.62],[-.55,.32],[-.66,.05]].map(([x,y])=>`${cx+x*R} ${cy+y*R}`).join(' L');
  const AF=[[.12,-.6],[.5,-.58],[.66,-.3],[.72,.02],[.56,.3],[.46,.58],[.36,.58],[.3,.22],[.18,-.04],[.04,-.2],[.04,-.42]].map(([x,y])=>`${cx+x*R} ${cy+y*R}`).join(' L');
  const orbit=`<ellipse cx="${cx}" cy="${cy}" rx="${R*1.3}" ry="${R*.42}" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="10 12" opacity=".5"/>`;
  const sat=m14_sat(ox,oy,.55,0,sa&&over?1:0,g);
  return `${bgCard('cardDark',g)}${!front?sat:''}
   <circle cx="${cx}" cy="${cy}" r="${R*1.2}" fill="url(#gIce)" opacity=".3"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="${m14_SEA}" stroke="${INK}" stroke-width="10"/>
   <path d="M${SA}Z" fill="#4FC36A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M${AF}Z" fill="#4FC36A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
   <ellipse cx="${sp[0]}" cy="${sp[1]}" rx="${R*.32}" ry="${R*.2}" fill="url(#gRed)" opacity="${.6+.3*Math.sin(g*3)}"/>
   ${orbit}${front?sat:''}
   ${labelPill(1520,420,'WEAK SPOT',P.coral,50)}<path d="M1380 450 L${sp[0]+60} ${sp[1]-20}" stroke="${P.coral}" stroke-width="6" stroke-dasharray="12 10"/>
   ${sa&&over?T(ox,oy-110,'GLITCH!',{size:56,fill:P.gold}):''}
   ${T(960,140,'SOUTH ATLANTIC',{size:96,fill:P.white,sc:IN(t,.2)})}`;
},
magFlip(t,d,p,g){
  const f1=AT(t,p.ns??5.9), f2=AT(t,p.sn??7.5), la=AT(t,p.last??9.5), nb=AT(t,p.nobody??13.7);
  const k=ease(prog(t,p.ns??5.9,(p.ns??5.9)+1.4)); const rot=k*180;
  const lab=(y,str,col)=>`<g transform="translate(960,${y})"><circle r="46" fill="${col}" stroke="${INK}" stroke-width="7"/><text y="20" text-anchor="middle" font-size="56" font-weight="900" fill="${INK}">${str}</text></g>`;
  return `${bgCard('cardDark',g)}${m14_field(960,560,220,g,{op:.8,flow:k>.5?-1:1,col:k>.5?m14_F2:m14_F})}${m14_earth(960,560,220,g,{id:'fl'})}
   <g transform="rotate(${rot} 960 560)">${lab(290,'N',P.red)}${lab(830,'S','#E8EEF8')}</g>
   ${f1?T(420,560,'N → S',{size:80,fill:P.red,sc:pop(t,p.ns??5.9)}):''}${f2?T(1500,560,'S → N',{size:80,fill:'#E8EEF8',sc:pop(t,p.sn??7.5)}):''}
   ${la&&!nb?labelPill(960,860-20,'LAST TIME: ~780,000 YEARS AGO',P.gold,48):''}${nb?labelPill(960,840,'NEXT TIME: NOBODY KNOWS',m14_F2,48):''}
   ${T(960,140,'THE FIELD FLIPS',{size:100,fill:P.white,sc:IN(t,.2)})}`;
},
magSolar(t,d,p,g){
  const bl=AT(t,p.blast??2.1), hi=AT(t,p.hit??6.8), st=AT(t,p.storm??11), au=AT(t,p.aur??13.8);
  const ex=1360, ey=580, R=150; let pt='';
  if(bl){const r=rng(5);for(let i=0;i<40;i++){const k=((g*.45+r())%1);const x=lerp(420,ex-R*1.6,k),y=ey+(r()-.5)*360*(1-k*.4);pt+=`<circle cx="${x}" cy="${y}" r="${6+r()*6}" fill="${P.gold}" opacity="${.9*(1-k*.3)}"/>`;}}
  const sh=hi?(st?8:5):0, kl=hi?.55+.08*Math.sin(g*6):1;
  return `${bgCard('cardDark',g)}${m14_sun(180,560,190,g)}${pt}
   ${m14_field(ex,ey,R,g,{op:.85,kl,kr:1.25,shake:sh,Ls:[1.5,2,2.6]})}${m14_earth(ex+(hi?Math.sin(g*30)*3:0),ey,R,g,{id:'so'})}
   ${au?`<g opacity="${pop(t,p.aur??13.8)}"><ellipse cx="${ex}" cy="${ey-R*.92}" rx="${R*.6}" ry="${R*.15}" fill="none" stroke="${m14_AUR}" stroke-width="16" opacity="${.6+.4*Math.sin(g*6)}"/><ellipse cx="${ex}" cy="${ey+R*.92}" rx="${R*.6}" ry="${R*.15}" fill="none" stroke="${m14_AUR}" stroke-width="16" opacity="${.6+.4*Math.sin(g*6+1)}"/></g>${labelPill(ex,880-30,'NORTHERN LIGHTS',m14_AUR,46)}`:''}
   ${bl&&!hi?labelPill(760,860-20,'CHARGED PARTICLES',P.gold,44):''}
   ${T(960,140,st?'GEOMAGNETIC STORM':(hi?'THE FIELD SHAKES':'THEN THERE\'S THE SUN'),{size:90,fill:st?m14_AUR:P.white,sc:pop(t,st?p.storm??11:(hi?p.hit??6.8:.2))})}`;
},
magAurora(t,d,p,g){
  const cl=AT(t,p.cloud??5.5); const ang=-30+Math.sin(g*7)*28;
  let clouds='';if(cl)for(let i=0;i<6;i++){const x=((i*380+g*25)%2300)-200,y=180+(i%3)*90;clouds+=`<g opacity=".85"><ellipse cx="${x}" cy="${y}" rx="220" ry="70" fill="#2A3048"/><ellipse cx="${x+90}" cy="${y-40}" rx="140" ry="60" fill="#2A3048"/></g>`;}
  return `${nightSky(g)}${m14_aurora(0,560,1920,420,g,cl?.45:1)}${clouds}
   ${m14_glintC({x:960,y:540,s:1,t:g,mouth:'o',brows:'raised',look:Math.sin(g)*.5,blink:BL(g),pose:cl?'point':'down'},ang,1)}
   ${T(960,140,cl?'YOU\'D FEEL IT COMING':'THE GROUND SHIFTING',{size:90,fill:cl?m14_AUR:P.white,sc:pop(t,cl?p.cloud??5.5:.2)})}`;
},
magTwist(t,d,p,g){
  const tw=AT(t,p.twist??3.7), mb=AT(t,p.maybe??5.1), li=AT(t,p.little??6.1);
  return `${card('cardMint',g)}${glint({x:540,y:540,s:1.1,t:g,pose:mb?'shrug':'down',mouth:mb?'smirk':'o',brows:'raised',blink:BL(g),glint:mb?1:0})}
   ${!tw?`${T(1300,460,'CAN HUMANS',{size:100,fill:P.white})}${T(1300,600,'SENSE IT?',{size:100,fill:P.mint,sc:pop(t,.6)})}`
     :mb?`${T(1300,520,'MAYBE.',{size:170,fill:P.gold,sc:pop(t,p.maybe??5.1)})}${li?T(1300,700,'JUST A LITTLE',{size:70,fill:P.white,sc:pop(t,p.little??6.1)}):''}`
     :T(1300,520,'THE TWIST',{size:130,fill:P.mint,sc:pop(t,p.twist??3.7)})}`;
},
magCaltech(t,d,p,g){
  const ro=AT(t,p.rot??5.8), no=AT(t,p.none??10.9), br=AT(t,p.brain??13.3), dp=AT(t,p.dip??16.3);
  const a=ro?g*40:0; let arrows='';
  if(ro)for(let i=0;i<3;i++){const aa=(a+i*120)*Math.PI/180;arrows+=`<g transform="translate(${560+Math.cos(aa)*250},${560+Math.sin(aa)*110}) rotate(${a+i*120+90})"><path d="M-40 0 H30" stroke="${m14_F}" stroke-width="10" stroke-linecap="round"/><path d="M14 -16 L40 0 L14 16Z" fill="${m14_F}"/></g>`;}
  const dk=dp?pop(t,p.dip??16.3)*(.6+.4*Math.sin(g*1.5)):0;
  return `<rect width="1920" height="1080" fill="#05060C"/>
   <rect x="200" y="240" width="720" height="620" rx="16" fill="#0E1222" stroke="${P.steel}" stroke-width="10"/>${[...Array(9)].map((_,i)=>`<path d="M${200+i*90} 240 V860" stroke="${P.steel}" stroke-width="3" opacity=".35"/>`).join('')}
   <ellipse cx="560" cy="560" rx="250" ry="110" fill="none" stroke="${m14_F}" stroke-width="3" opacity="${ro?.4:0}" stroke-dasharray="8 10"/>${arrows}
   <rect x="470" y="620" width="180" height="24" rx="10" fill="#3B4A78"/><rect x="620" y="520" width="24" height="120" rx="10" fill="#3B4A78"/>
   ${extra({x:560,y:470,s:.6,t:g,head:'#FFD3A8',mouth:'flat',glasses:false})}
   <path d="M500 380 Q560 330 620 380" stroke="#C9D3E3" stroke-width="8" fill="none"/>${[510,540,580,610].map(x=>`<circle cx="${x}" cy="${375-Math.abs(x-560)*-.1}" r="7" fill="${P.gold}"/>`).join('')}
   ${no?T(560,280+20,'NOTICED NOTHING',{size:44,fill:P.white,sc:pop(t,p.none??10.9)}):''}
   ${br?`<rect x="1040" y="300" width="760" height="460" rx="20" fill="#0B1A14" stroke="${INK}" stroke-width="10"/><path d="M1070 ${530} H1770" stroke="#fff" stroke-width="2" opacity=".2"/>${m14_eeg(1080,530,680,g,dk)}${T(1420,360,'BRAINWAVES',{size:44,fill:m14_AUR,stroke:8})}
     ${dp?`<rect x="${1080+680*.5}" y="420" width="${680*.2}" height="220" rx="12" fill="none" stroke="${P.gold}" stroke-width="6" stroke-dasharray="12 8"/>${labelPill(1420,830,'SOME BRAINS REACTED',P.gold,44)}`:''}`:''}
   ${T(960,140,'CALTECH, 2019',{size:90,fill:P.white,sc:IN(t,.2)})}${ro&&!br?labelPill(1400,520,'ROTATING FIELD (EARTH-STRENGTH)',m14_F,40):''}`;
},
magListen(t,d,p,g){
  const nv=AT(t,p.nav??2), li=AT(t,p.listen??4.1);
  if(li) return `${bgNight(g)}${m14_field(960,1700,900,g,{op:.3,Ls:[1.2,1.35,1.55],w:8})}${brain(1380,520,.9,.4+.6*Math.abs(Math.sin(g*1.5)),g)}${glint({x:620,y:540,s:1,t:g,mouth:'smile',brows:'calm',eyes:'closed'})}
     ${rings(1380,520,g,.35,m14_F)}${T(960,140,'STILL LISTENING?',{size:96,fill:m14_F,sc:pop(t,p.listen??4.1)})}`;
  return `${card('cardDark',g)}${stamp(960,460,1.2*pop(t,.2),'NOT PROOF',P.coral)}
   ${nv?`${m14_map(760,740,.8)}${icon('cross',860,680,.5*pop(t,p.nav??2))}${m14_compass(1160,740,.7,g*120)}${icon('cross',1240,680,.5*pop(t,p.nav??2))}`:''}
   ${T(960,140,nv?'NOBODY NAVIGATES WITH IT':'CAREFUL',{size:84,fill:P.white,sc:pop(t,nv?p.nav??2:.1)})}`;
},
magMRI(t,d,p,g){
  const mr=AT(t,p.mri??1.5), xx=AT(t,p.x??6), sp=AT(t,p.spin??12.4);
  if(!mr) return `${card('cardWarm',g)}${m14_glintC({x:960,y:540,s:1.05,t:g,pose:'cross',mouth:'flat',brows:'angry',blink:BL(g)},Math.sin(g*2)*5,1)}${T(960,140,'ONE LAST WARNING',{size:96,fill:P.coral,sc:IN(t,.2)})}`;
  const spin=sp?(t-(p.spin??12.4))*260:0;
  return `${bgLab(g)}<g transform="translate(${sp?1200:1100},560)"><rect x="-300" y="-300" width="600" height="560" rx="80" fill="#E8EEF8" stroke="${INK}" stroke-width="10"/><circle r="170" cy="-20" fill="#22305A" stroke="${INK}" stroke-width="10"/><circle r="200" cy="-20" fill="none" stroke="${m14_F}" stroke-width="8" opacity="${.4+.4*Math.sin(g*8)}"/><rect x="-420" y="80" width="560" height="50" rx="14" fill="#C9D3E3" stroke="${INK}" stroke-width="7"/></g>
   ${sp?`<g transform="rotate(${spin} 520 520)">${m14_glintC({x:520,y:520,s:.85,t:g,mouth:'wavy',eyes:'x',blink:0},g*900,1)}</g>${T(520,900-40,'THE WHOLE WORLD SPINNING',{size:50,fill:P.gold,stroke:8})}`
     :`${m14_glintC({x:480,y:540,s:.9,t:g,mouth:'o',brows:'raised',pose:'reach',blink:BL(g),dir:1},(g*300)%360,1)}`}
   ${xx&&!sp?labelPill(1100,880-30,"~60,000× EARTH'S FIELD",P.red,52):''}
   ${T(960,140,sp?'WHOA':'STAY AWAY FROM MRI',{size:96,fill:sp?P.gold:P.white,sc:pop(t,sp?p.spin??12.4:p.mri??1.5)})}`;
}
});
