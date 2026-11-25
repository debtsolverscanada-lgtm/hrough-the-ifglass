// episode 030 scenes (coma, hear everything) — story episode
// palette: hospital night blue + warm amber monitor glow
const c30_AMB='#FFB45C', c30_BLU='#0E2340', c30_TEAL='#5FD3C8';
const c30_DEF=`<defs><linearGradient id="c30wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1B36"/><stop offset="1" stop-color="#17345A"/></linearGradient>
 <linearGradient id="c30storm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A0F24"/><stop offset="1" stop-color="#2A2F5A"/></linearGradient>
 <linearGradient id="c30corr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D8E6EE"/><stop offset="1" stop-color="#9FB6C8"/></linearGradient>
 <radialGradient id="c30amb"><stop offset="0" stop-color="${c30_AMB}" stop-opacity=".8"/><stop offset="1" stop-color="${c30_AMB}" stop-opacity="0"/></radialGradient>
 <radialGradient id="c30heat"><stop offset="0" stop-color="#FFF3A0"/><stop offset=".35" stop-color="#FFB13B"/><stop offset=".7" stop-color="#FF4D5E" stop-opacity=".7"/><stop offset="1" stop-color="#FF4D5E" stop-opacity="0"/></radialGradient>
 <radialGradient id="c30cool"><stop offset="0" stop-color="#E0FFFF"/><stop offset=".4" stop-color="#3DF5C2"/><stop offset=".75" stop-color="#3D7BFF" stop-opacity=".6"/><stop offset="1" stop-color="#3D7BFF" stop-opacity="0"/></radialGradient></defs>`;
const c30_f=(v)=>(+v).toFixed(2);
// ---------- props ----------
function c30_timer(str,o={}){const {x=1500,y=130,s=1,label='TIME LEFT',col=P.red,g=0}=o;const pl=1+.03*Math.sin(g*8);
  return `<g transform="translate(${x},${y}) scale(${c30_f(s*pl)})"><rect x="-230" y="-82" width="460" height="164" rx="22" fill="#0A0612" fill-opacity=".9" stroke="${col}" stroke-width="7"/>
   <text y="-30" text-anchor="middle" font-size="30" font-weight="900" letter-spacing="3" fill="${col}">${label}</text>
   <text y="52" text-anchor="middle" font-size="90" font-weight="900" fill="#fff" style="font-variant-numeric:tabular-nums">${str}</text></g>`;}
function c30_ecgPath(x,y,w,g,o={}){const {col=c30_AMB,amp=1,spike=0,flat=0,sw=7,speed=1}=o;let d=`M${x} ${y}`;const n=140;
  for(let i=1;i<=n;i++){const px=x+w*i/n;let py=y;if(!flat){const p=(((i/n*3)-g*.9*speed*(1+spike))%1+1)%1;const A=amp*(1+spike*.6);
    if(p>.40&&p<.45)py=y-12*A;else if(p>=.45&&p<.5)py=y-95*A;else if(p>=.5&&p<.55)py=y+45*A;else if(p>=.6&&p<.68)py=y-18*A;}
    d+=` L${px.toFixed(1)} ${py.toFixed(1)}`;}
  return `<path d="${d}" stroke="${col}" stroke-width="${sw+10}" fill="none" opacity=".25" stroke-linejoin="round"/><path d="${d}" stroke="${col}" stroke-width="${sw}" fill="none" stroke-linejoin="round"/>`;}
function c30_monitor(x,y,s,g,o={}){const {spike=0,bpm=null}=o;const b=bpm??Math.round(64+spike*48+Math.sin(g*.7)*2);
  return `<g transform="translate(${x},${y}) scale(${s})"><circle r="380" fill="url(#c30amb)" opacity="${c30_f(.55+.1*Math.sin(g*3))}"/>
   <path d="M0 150 V520 M-90 520 H90" stroke="#3A4868" stroke-width="18" stroke-linecap="round"/>
   <rect x="-230" y="-160" width="460" height="320" rx="26" fill="#1C2438" stroke="${INK}" stroke-width="10"/><rect x="-200" y="-130" width="400" height="260" rx="12" fill="#06101C"/>
   ${c30_ecgPath(-190,10,280,g,{spike,amp:.8,sw:6})}
   <text x="186" y="-74" text-anchor="end" font-size="30" font-weight="900" fill="${spike>.3?P.red:P.mint}">HR</text>
   <text x="186" y="-10" text-anchor="end" font-size="64" font-weight="900" fill="${spike>.3?P.red:P.mint}">${b}</text>
   <text x="186" y="90" text-anchor="end" font-size="34" font-weight="900" fill="#7FC4FF">SpO2 98</text>
   <circle cx="-180" cy="-108" r="9" fill="${Math.sin(g*6)>0?c30_AMB:'#4A3A20'}"/></g>`;}
// Glint lying in a hospital bed (head left). o.eye: 0..1 one eye opening, o.tear, o.lid (left-eyelid flicker)
function c30_bed(x,y,s,g,o={}){const {eye=0,tear=0,blanket='#5FA8C8',brows='calm',breath=1}=o;const br=Math.sin(g*1.3)*4*breath;
  const face=glint({x:0,y:0,s:1,t:0,eyes:'closed',mouth:'flat',brows,scarf:false}).replace(/<ellipse cx="0" cy="[^"]*" rx="80" ry="14"[^>]*>/,'');
  const eyeOpen=eye>0?`<ellipse cx="30" cy="-62" rx="17" ry="${c30_f(20*eye)}" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="30" cy="-60" r="${c30_f(9.5*eye)}" fill="${INK}"/><circle cx="33" cy="-64" r="${c30_f(3*eye)}" fill="#fff"/>`:'';
  const tr=tear>0?`<path d="M44 -36 q12 ${c30_f(12+tear*40)} 0 ${c30_f(22+tear*44)} q-12 -10 0 ${c30_f(-22-tear*44)}Z" fill="#9FD8FF" stroke="${INK}" stroke-width="4" opacity="${c30_f(tear)}"/>`:'';
  const cid='c30h'+Math.round(x*7+y*3+s*100);
  return `<g transform="translate(${x},${y}) scale(${s})">
   <rect x="-330" y="80" width="760" height="40" rx="10" fill="#8C9AB4" stroke="${INK}" stroke-width="8"/>
   <path d="M-320 120 V300 M420 120 V300" stroke="#5D6A82" stroke-width="20"/><circle cx="-320" cy="310" r="18" fill="#22202E"/><circle cx="420" cy="310" r="18" fill="#22202E"/>
   <rect x="-350" y="-120" width="30" height="240" rx="12" fill="#C9D3E3" stroke="${INK}" stroke-width="7"/>
   <rect x="-320" y="20" width="740" height="70" rx="22" fill="#EEF4FA" stroke="${INK}" stroke-width="8"/>
   <ellipse cx="-180" cy="30" rx="160" ry="58" fill="#FFFFFF" stroke="${INK}" stroke-width="7"/>
   <clipPath id="${cid}"><circle cx="0" cy="-60" r="106"/></clipPath><g transform="translate(-180,0) scale(.9) rotate(-8)"><g clip-path="url(#${cid})">${face}</g>${eyeOpen}${tr}<path d="M-88 -100 Q0 -150 88 -100" stroke="#F4F6FA" stroke-width="24" fill="none" stroke-linecap="round"/><path d="M-88 -100 Q0 -150 88 -100" stroke="${INK}" stroke-width="3" fill="none" opacity=".3"/></g>
   <path d="M-80 ${c30_f(-20-br)} Q60 ${c30_f(-62-br)} 260 ${c30_f(-40-br*.6)} Q380 -30 420 10 L420 70 L-90 70Z" fill="${blanket}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   <path d="M-60 ${c30_f(-8-br)} Q80 ${c30_f(-46-br)} 250 ${c30_f(-28-br*.6)}" stroke="#fff" stroke-width="6" fill="none" opacity=".35"/>
   <path d="M-90 10 Q-60 30 -40 70" stroke="#EEF4FA" stroke-width="16" fill="none"/></g>`;}
// a little glowing "inner Glint" in a bubble: awake inside
function c30_inner(x,y,s,g,o={}){const {pose='up',mouth='o',a=1,brows='raised',label=''}=o;const sh=Math.sin(g*14)*3;
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="${c30_f(a)}"><circle r="260" fill="url(#gMint)" opacity="${c30_f(.45+.15*Math.sin(g*4))}"/>
   <circle r="190" fill="#06202A" fill-opacity=".85" stroke="${P.mint}" stroke-width="9"/><circle r="190" fill="none" stroke="#fff" stroke-width="3" opacity=".4" stroke-dasharray="40 30"/>
   ${glint({x:sh,y:-50,s:.62,t:g,pose,mouth,brows,blink:BL(g)})}${label?`<g transform="translate(0,230)">${labelPill(0,0,label,P.mint,34)}</g>`:''}</g>`;}
function c30_room(g,o={}){const {storm=0,dark=0,night=1}=o;const fl=storm&&((g*1.7)%5)<.12?1:0;let rain='';const r=rng(30);
  for(let i=0;i<40;i++){const rx=150+r()*360,ry=((r()*360+g*420*(1+r()))%360)+140;rain+=`<path d="M${rx.toFixed(0)} ${ry.toFixed(0)} l-8 26" stroke="#9FC3E0" stroke-width="3" opacity=".5"/>`;}
  return `${c30_DEF}<rect width="1920" height="1080" fill="url(#c30wall)"/>
   <rect x="130" y="120" width="400" height="400" rx="12" fill="${fl?'#C9D8FF':'#070C1E'}"/>${night?`<circle cx="430" cy="210" r="34" fill="#fff4dc" opacity=".55"/>`:''}${rain}
   <rect x="130" y="120" width="400" height="400" rx="12" fill="none" stroke="#8C9AB4" stroke-width="18"/><path d="M330 120 V520 M130 320 H530" stroke="#8C9AB4" stroke-width="10"/>
   <path d="M1240 60 H1880" stroke="#8C9AB4" stroke-width="10"/>${[0,1,2,3,4].map(i=>`<path d="M${1260+i*120} 66 Q${1300+i*120} 400 ${1250+i*120} 760" stroke="#4E8C98" stroke-width="60" fill="none" opacity=".55"/>`).join('')}
   <rect x="660" y="260" width="300" height="70" rx="8" fill="#22305A" stroke="#3B4A78" stroke-width="5"/><circle cx="700" cy="295" r="12" fill="${P.mint}" opacity=".7"/><circle cx="740" cy="295" r="12" fill="#7FC4FF" opacity=".7"/>
   <rect y="840" width="1920" height="240" fill="#0C1A30"/><path d="M0 840 H1920" stroke="#2A4468" stroke-width="6"/>
   ${[...Array(9)].map((_,i)=>`<path d="M${i*240} 840 L${i*240-80} 1080" stroke="#13243E" stroke-width="5"/>`).join('')}
   ${fl?`<rect width="1920" height="1080" fill="#C9D8FF" opacity=".12"/>`:''}<rect width="1920" height="1080" fill="#02040C" opacity="${c30_f(dark*.5)}"/>`;}
function c30_glasses(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><circle cx="-30" r="26" fill="none" stroke="${INK}" stroke-width="11"/><circle cx="30" r="26" fill="none" stroke="${INK}" stroke-width="11"/><circle cx="-30" r="26" fill="none" stroke="${P.goldRim}" stroke-width="5"/><circle cx="30" r="26" fill="none" stroke="${P.goldRim}" stroke-width="5"/><path d="M-56 0 L-90 10 M56 0 L90 10" stroke="${P.goldRim}" stroke-width="5"/></g>`;}
function c30_table(x,y){return `<g transform="translate(${x},${y})"><rect x="-120" y="-20" width="240" height="30" rx="8" fill="#C9D3E3" stroke="${INK}" stroke-width="7"/><path d="M0 10 V200" stroke="#5D6A82" stroke-width="16"/>${c30_glasses(-40,-36,.7)}<rect x="40" y="-100" width="50" height="80" rx="10" fill="#9FD8FF" stroke="${INK}" stroke-width="6" opacity=".9"/></g>`;}
function c30_doctor(x,y,s,g,o={}){const {pose='down',mouth='flat',look=0,head='#E6B98E'}=o;const by=Math.sin(g*2.4+1)*4;
  return `${extra({x,y,s,t:g,head,pose,mouth,look,hair:`<path d="M-78 -80 Q-70 -142 0 -142 Q70 -142 78 -80 Q50 -118 0 -116 Q-50 -118 -78 -80Z" fill="#3A2A22" stroke="${INK}" stroke-width="7"/>`})}
   <g transform="translate(${x},${(y+by).toFixed(1)}) scale(${s})"><path d="M-44 30 L44 30 L60 200 L-60 200Z" fill="#F4F6FA" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-20 34 Q-30 90 0 100 Q30 90 20 34" stroke="#4A5468" stroke-width="7" fill="none"/><circle cx="0" cy="104" r="10" fill="#9AA7BD" stroke="${INK}" stroke-width="4"/><path d="M0 30 V200" stroke="#C9D2E0" stroke-width="5"/></g>`;}
function c30_nurse(x,y,s,g,o={}){const by=Math.sin(g*2.4+1)*4;return `${extra({x,y,s,t:g,head:'#C68B59',pose:o.pose||'down',mouth:o.mouth||'smile',look:o.look||0,hair:`<path d="M-80 -70 Q-84 -150 0 -150 Q84 -150 80 -70 Q60 -120 0 -118 Q-60 -120 -80 -70Z" fill="#15100C" stroke="${INK}" stroke-width="7"/><circle cx="0" cy="-150" r="30" fill="#15100C" stroke="${INK}" stroke-width="6"/>`})}
   <g transform="translate(${x},${(y+by).toFixed(1)}) scale(${s})"><path d="M-46 30 L46 30 L54 190 L-54 190Z" fill="#3D7BC8" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-14 30 L0 56 L14 30" stroke="${INK}" stroke-width="5" fill="none"/><rect x="14" y="70" width="24" height="30" rx="4" fill="#fff" stroke="${INK}" stroke-width="3"/></g>`;}
// Mr. Hale: tall, grey swept hair, dark suit, red tie, clicking pen. sil: 0..1 silhouette (night)
function c30_hale(x,y,s,g,o={}){const {pose='down',mouth='smile',look=0,sil=0,click=0,flowers=0,grapes=0}=o;const by=Math.sin(g*2.4+1)*4;const hd=sil>.5?'#1A2036':'#E8C4A0';
  const body=`${extra({x,y,s,t:g,head:hd,pose,mouth:sil>.5?'flat':mouth,look,tie:true,hair:`<path d="M-80 -70 Q-90 -150 -10 -150 Q70 -156 84 -96 Q40 -132 -30 -118 Q-66 -110 -80 -70Z" fill="${sil>.5?'#0A0E1C':'#B8BCC8'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`})}
   <g transform="translate(${x},${(y+by).toFixed(1)}) scale(${s})"><path d="M-50 30 L50 30 L56 196 L-56 196Z" fill="${sil>.5?'#0A0E1C':'#2E3448'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-22 30 L0 90 L22 30" fill="#F4F6FA" stroke="${INK}" stroke-width="4"/><path d="M0 40 L-9 58 L0 110 L9 58Z" fill="${P.red}" stroke="${INK}" stroke-width="4"/>
   <g transform="translate(60,140) rotate(-30)"><rect x="-6" y="-46" width="12" height="70" rx="5" fill="${P.gold}" stroke="${INK}" stroke-width="4"/><rect x="-4" y="${-58+(click?8:0)}" width="8" height="16" fill="#C9D3E3" stroke="${INK}" stroke-width="3"/></g>
   ${flowers?`<g transform="translate(-60,120)"><path d="M0 0 L-30 -110 M0 0 L0 -120 M0 0 L30 -110" stroke="#2E7A3E" stroke-width="8"/>${[[-30,-120,'#FF8FA3'],[0,-134,'#FFD84D'],[30,-120,'#FF8FA3']].map(([a,b,c])=>`<circle cx="${a}" cy="${b}" r="24" fill="${c}" stroke="${INK}" stroke-width="5"/>`).join('')}<path d="M-34 -40 L34 -40 L12 30 L-12 30Z" fill="#F4F6FA" stroke="${INK}" stroke-width="5"/></g>`:''}
   ${grapes?`<g transform="translate(-70,110)">${[[0,0],[-22,-20],[22,-20],[-12,-44],[12,-44],[0,22],[-24,6],[24,6]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="16" fill="#7A3E9A" stroke="${INK}" stroke-width="4"/>`).join('')}<path d="M0 -60 V-80" stroke="#2E7A3E" stroke-width="6"/></g>`:''}</g>`;
  return body;}
function c30_click(x,y,t,at,g){if(at==null||t<at)return '';const k=t-at;let s='';[[0,'CLICK,'],[.45,'CLICK.'],[1.15,'CLICK.']].forEach(([dt,w],i)=>{if(k<dt)return;const sc=pop(t,at+dt,.25);s+=`<g transform="translate(${x+i*190},${y-i*18}) rotate(${-8+i*6}) scale(${c30_f(sc)})">${T(0,0,w,{size:62,fill:P.gold})}</g>`;});return s;}
function c30_notes(x,y,g,a=1){let s='';for(let i=0;i<4;i++){const k=((g*.5+i/4)%1);s+=`<g transform="translate(${(x+k*160+Math.sin(g*3+i)*16).toFixed(0)},${(y-k*170).toFixed(0)})" opacity="${c30_f(a*(1-k))}"><ellipse rx="15" ry="11" fill="${c30_TEAL}" transform="rotate(-20)"/><path d="M13 -4 V-52 L34 -42" stroke="${c30_TEAL}" stroke-width="6" fill="none"/></g>`;}return s;}
function c30_rock(x,y,s,g,o={}){const {glow=1}=o;return `<g transform="translate(${x},${y}) scale(${s})"><circle r="200" fill="url(#c30amb)" opacity="${c30_f(.35*glow)}"/>
   <path d="M-150 30 Q-170 -60 -90 -110 Q-20 -150 60 -120 Q150 -90 160 -10 Q170 70 90 100 Q0 130 -80 105 Q-140 90 -150 30Z" fill="#3A3440" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>
   ${[[-70,-40,26],[10,-70,20],[70,0,28],[-20,40,22],[-100,40,14],[100,60,12]].map(([a,b,r])=>`<ellipse cx="${a}" cy="${b}" rx="${r}" ry="${r*.7}" fill="#2A2530"/><path d="M${a-r*.6} ${b-r*.4} q${r*.6} -${r*.4} ${r*1.2} 0" stroke="#6A6070" stroke-width="5" fill="none"/>`).join('')}
   <path d="M-120 -40 Q-80 -100 -10 -110" stroke="#8A8296" stroke-width="8" fill="none" stroke-linecap="round" opacity=".7"/><circle cx="40" cy="-30" r="5" fill="#E8D9A0"/><circle cx="-40" cy="70" r="4" fill="#E8D9A0"/></g>`;}
function c30_case(x,y,s,g,o={}){const {label='KESTREL METEORITE',fake=0,beam=0}=o;return `<g transform="translate(${x},${y}) scale(${s})">
   <rect x="-170" y="80" width="340" height="300" fill="#1E1840" stroke="${INK}" stroke-width="9"/><rect x="-130" y="200" width="260" height="70" rx="8" fill="#F4F1EA" stroke="${INK}" stroke-width="5"/><text y="246" text-anchor="middle" font-size="${label.length>14?24:30}" font-weight="900" fill="${INK}">${label}</text>
   ${c30_rock(0,10,.62,g,{glow:beam?1:.4})}
   <rect x="-180" y="-150" width="360" height="230" fill="#BFEFFF" fill-opacity=".12" stroke="#BFEFFF" stroke-width="7"/><path d="M-150 -130 L-90 -60 M-120 -140 L-60 -70" stroke="#fff" stroke-width="7" opacity=".5"/>
   ${fake?`<g transform="translate(0,-40) rotate(-12) scale(${c30_f(fake)})">${stamp(0,0,1,'FAKE')}</g>`:''}</g>`;}
function c30_crate(x,y,s,o={}){const {open=0,label='FRI 7:00 AM'}=o;return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-230" y="-170" width="460" height="320" fill="#B88A58" stroke="${INK}" stroke-width="10"/>
   ${[-110,0,110].map(yy=>`<path d="M-230 ${yy} H230" stroke="#8A6A3A" stroke-width="10"/>`).join('')}<path d="M-230 -170 L230 150 M230 -170 L-230 150" stroke="#8A6A3A" stroke-width="14" opacity=".7"/>
   <rect x="-150" y="-60" width="300" height="70" rx="8" fill="#FFF6EA" stroke="${INK}" stroke-width="5"/><text y="-12" text-anchor="middle" font-size="40" font-weight="900" fill="${P.red}">${label}</text>
   <text y="120" text-anchor="middle" font-size="44" font-weight="900" fill="#5A3A1A" letter-spacing="6">FRAGILE</text>
   ${open?`<g transform="translate(0,${c30_f(-170-open*60)}) rotate(${c30_f(-open*18)})"><rect x="-240" y="-30" width="480" height="40" fill="#C99A68" stroke="${INK}" stroke-width="8"/></g>`:''}</g>`;}
function c30_gallery(g,o={}){const {dark=0,beam=0,storm=1,gone=0}=o;const fl=storm&&((g*1.3)%4)<.1?1:0;let s=`${c30_DEF}<rect width="1920" height="1080" fill="#130E2A"/>`;
  s+=`<path d="M0 0 H1920 V280 Q960 180 0 280Z" fill="#1C1640"/>${[300,700,1220,1620].map(x=>`<rect x="${x-26}" y="200" width="52" height="560" fill="#241C4A" stroke="${INK}" stroke-width="5"/>`).join('')}
   <path d="M760 80 Q960 -10 1160 80 L1160 220 L760 220Z" fill="${fl?'#DDE6FF':'#0A0F24'}" stroke="#3B3270" stroke-width="10"/><path d="M960 30 V220 M760 150 H1160" stroke="#3B3270" stroke-width="7"/>
   ${c30_case(960,600,1,g,{beam})}
   <rect y="840" width="1920" height="240" fill="#1C1430"/><path d="M0 840 H1920" stroke="${INK}" stroke-width="6"/>`;
  if(beam)s+=`<path d="M${1500+Math.sin(g*1.3)*30} 380 L${880+Math.sin(g*1.7)*40} 560 L${1060+Math.sin(g*1.7)*40} 680Z" fill="#FFF6C0" opacity=".28"/><circle cx="${1500+Math.sin(g*1.3)*30}" cy="380" r="16" fill="#FFF6C0"/>`;
  s+=`<rect width="1920" height="1080" fill="#02030A" opacity="${c30_f(dark*.55)}"/>${fl?`<rect width="1920" height="1080" fill="#DDE6FF" opacity=".14"/>`:''}`;return s;}
function c30_rail(x,y,w,gone=0){const gap=i=>gone&&i>w*.42&&i<w*.8;let s='';
  if(gone)s+=`<path d="M${x} ${y} H${x+w*.42} M${x+w*.8} ${y} H${x+w}" stroke="#8C9AB4" stroke-width="14"/>`;else s+=`<path d="M${x} ${y} H${x+w}" stroke="#8C9AB4" stroke-width="14"/>`;
  s+=`<path d="M${x} ${y+110} H${x+w}" stroke="#5D6A82" stroke-width="20"/>`;
  for(let i=0;i<=w;i+=60){if(gap(i))continue;s+=`<path d="M${x+i} ${y} V${y+110}" stroke="#8C9AB4" stroke-width="9"/>`;}
  return s;}
function c30_brainScan(x,y,s,g,o={}){const {mode='none',k=1,lab=''}=o;const pul=.85+.15*Math.sin(g*5);
  let hot='';if(mode==='tennis'||mode==='yes')hot=`<ellipse cx="10" cy="-150" rx="${c30_f(90*k*pul)}" ry="${c30_f(60*k*pul)}" fill="url(#c30heat)"/>`;
  if(mode==='house'||mode==='no')hot=`<ellipse cx="90" cy="20" rx="${c30_f(70*k*pul)}" ry="${c30_f(50*k*pul)}" fill="url(#c30cool)"/><ellipse cx="150" cy="-70" rx="${c30_f(60*k*pul)}" ry="${c30_f(45*k*pul)}" fill="url(#c30cool)"/><ellipse cx="-70" cy="-90" rx="${c30_f(50*k*pul)}" ry="${c30_f(36*k*pul)}" fill="url(#c30cool)"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-300" y="-300" width="600" height="560" rx="30" fill="#050810" stroke="#3B4A78" stroke-width="8"/>
   <path d="M-210 60 Q-250 -120 -120 -220 Q0 -290 140 -230 Q250 -170 240 -30 Q236 60 190 110 L190 190 Q100 200 60 170 L-80 170 Q-150 160 -170 120 Q-220 100 -210 60Z" fill="#3A4258" stroke="#8C9AB4" stroke-width="6"/>
   <path d="M-170 30 Q-190 -110 -90 -180 Q10 -240 120 -190 Q210 -140 200 -30 Q195 50 140 90 Q40 120 -60 100 Q-150 90 -170 30Z" fill="#7A8098" stroke="#B8C0D8" stroke-width="5"/>
   <path d="M-120 -120 q40 20 20 60 M-40 -190 q10 50 -30 80 M60 -200 q-10 60 40 80 M140 -120 q-50 20 -30 70 M-100 20 q60 -20 100 10 M40 60 q30 -40 90 -30" stroke="#5A6078" stroke-width="7" fill="none" stroke-linecap="round"/>
   ${hot}${lab?`<text y="236" text-anchor="middle" font-size="36" font-weight="900" fill="#B8C0D8" letter-spacing="3">${lab}</text>`:''}</g>`;}
function c30_racket(x,y,s,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M0 40 V170" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="M0 40 V170" stroke="#C98A6A" stroke-width="14" stroke-linecap="round"/><ellipse cy="-60" rx="80" ry="104" fill="none" stroke="${INK}" stroke-width="22"/><ellipse cy="-60" rx="80" ry="104" fill="none" stroke="${P.coral}" stroke-width="12"/>${[-40,-10,20,50].map(a=>`<path d="M${a} -150 V30" stroke="#fff" stroke-width="3" opacity=".7"/>`).join('')}${[-130,-90,-50,-10,30].map(b=>`<path d="M-70 ${b} H70" stroke="#fff" stroke-width="3" opacity=".7"/>`).join('')}</g>`;}
function c30_ball(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><circle r="30" fill="#D8F04A" stroke="${INK}" stroke-width="6"/><path d="M-22 -18 Q0 0 -22 20 M22 -20 Q0 0 22 18" stroke="#fff" stroke-width="5" fill="none"/></g>`;}
function c30_house(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-140 -40 L0 -160 L140 -40Z" fill="#C9605A" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><rect x="-120" y="-40" width="240" height="180" fill="#F4E2C8" stroke="${INK}" stroke-width="9"/><rect x="-30" y="40" width="60" height="100" fill="#6A4A3A" stroke="${INK}" stroke-width="6"/><rect x="-100" y="0" width="50" height="50" fill="#FFD84D" stroke="${INK}" stroke-width="5"/><rect x="50" y="0" width="50" height="50" fill="#FFD84D" stroke="${INK}" stroke-width="5"/></g>`;}
function c30_yn(x,y,word,col,s=1){return `<g transform="translate(${x},${y}) scale(${c30_f(s)})"><rect x="-150" y="-62" width="300" height="124" rx="30" fill="${col}" stroke="${INK}" stroke-width="9"/><text y="30" text-anchor="middle" font-size="86" font-weight="900" fill="${INK}">${word}</text></g>`;}
function c30_bagPickles(x,y,s,g){return `<g transform="translate(${x},${y}) scale(${s})"><g transform="translate(0,-90)">${pickles(0,0,.8,g,{mood:'grump',blink:BL(g+1)}).replace('<ellipse cx="0" cy="62" rx="90" ry="12" fill="rgba(0,0,0,.3)"/>','')}</g><path d="M-140 -40 H140 L120 160 H-120Z" fill="#B58BD6" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M-80 -40 Q-80 -130 0 -130 Q80 -130 80 -40" stroke="${INK}" stroke-width="10" fill="none"/><path d="M-100 40 H100" stroke="#9468BC" stroke-width="10"/></g>`;}
function c30_newspaper(x,y,s,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-150" y="-100" width="300" height="200" fill="#F4F1EA" stroke="${INK}" stroke-width="7"/><text y="-50" text-anchor="middle" font-size="40" font-weight="900" fill="${INK}">FOOTBALL</text><path d="M-120 -20 H120 M-120 10 H60 M-120 40 H100 M-120 70 H80" stroke="#8A8A9A" stroke-width="8"/><text x="90" y="40" text-anchor="middle" font-size="34" font-weight="900" fill="${P.red}">2-1</text></g>`;}
function c30_alpha(x,y,s,hi=-1,o={}){const L='ESARINTULOMDPCFBVHGJQZYXKW';let r='';for(let i=0;i<L.length;i++){const cx=-330+(i%9)*82,cy=-80+Math.floor(i/9)*92,on=i===hi;
   r+=`<rect x="${cx-34}" y="${cy-40}" width="68" height="76" rx="12" fill="${on?P.gold:'#FFF6EA'}" stroke="${INK}" stroke-width="5"/><text x="${cx}" y="${cy+18}" text-anchor="middle" font-size="50" font-weight="900" fill="${INK}">${L[i]}</text>`;}
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-400" y="-150" width="800" height="330" rx="24" fill="#2A3A5A" stroke="${INK}" stroke-width="10"/>${r}</g>`;}
function c30_scanner(x,y,s,g,o={}){const {bed=1,knock=0}=o;const sh=knock?Math.sin(g*30)*3:0;return `<g transform="translate(${x+sh},${y}) scale(${s})"><rect x="-420" y="-360" width="840" height="720" rx="120" fill="#E8EEF6" stroke="${INK}" stroke-width="12"/>
   <circle r="230" fill="#1A2438" stroke="${INK}" stroke-width="12"/><circle r="200" fill="#0A1020"/><circle r="230" fill="none" stroke="#7FC4FF" stroke-width="8" opacity="${c30_f(.4+.4*Math.abs(Math.sin(g*3)))}"/>
   <rect x="-300" y="300" width="600" height="40" rx="10" fill="#9AA7BD" stroke="${INK}" stroke-width="7"/><text y="-280" text-anchor="middle" font-size="40" font-weight="900" fill="#5D6A82" letter-spacing="8">MRI</text>${bed?`<clipPath id="c30bore"><circle r="200"/></clipPath><g clip-path="url(#c30bore)">${glint({x:0,y:110,s:.8,t:0,eyes:'closed',mouth:'flat',scarf:false})}<path d="M-120 140 Q0 115 120 140 L140 220 H-140Z" fill="#5FA8C8" stroke="${INK}" stroke-width="7"/></g><path d="M-96 60 Q-96 -40 0 -40 Q96 -40 96 60" stroke="${INK}" stroke-width="20" fill="none"/><rect x="-124" y="30" width="40" height="76" rx="16" fill="#5D6A82" stroke="${INK}" stroke-width="6"/><rect x="84" y="30" width="40" height="76" rx="16" fill="#5D6A82" stroke="${INK}" stroke-width="6"/>`:''}</g>`;}
function c30_porter(o){let s=person({...o,who:'kai'});return s.split('#FF5E5B').join('#2E8B57').split('#D8403E').join('#1F6A42');}
function c30_bub(x,y,w,l1,l2,o={}){return t21_bub(x,y,w,l1,l2,o);}
function c30_whisper(x,y,w,l1,l2,o={}){const {size=46,sc=1}=o;const h=l2?size*2.7:size*1.8;return `<g transform="translate(${x},${y}) scale(${c30_f(sc)})"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="30" fill="#1A1030" fill-opacity=".92" stroke="${P.red}" stroke-width="6" stroke-dasharray="18 12"/>
   <text y="${l2?-size*.2:size*.35}" text-anchor="middle" font-size="${size}" font-weight="900" font-style="italic" fill="#FFD0D6">${l1}</text>${l2?`<text y="${size*1.0}" text-anchor="middle" font-size="${size}" font-weight="900" font-style="italic" fill="#FFD0D6">${l2}</text>`:''}</g>`;}
function c30_clock(x,y,s,str,col=c30_AMB){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-170" y="-70" width="340" height="140" rx="20" fill="#06101C" stroke="${col}" stroke-width="7"/><text y="30" text-anchor="middle" font-size="84" font-weight="900" fill="${col}" style="font-variant-numeric:tabular-nums">${str}</text></g>`;}
function c30_police(x,y,s,g){const on=Math.sin(g*10)>0;return `<g transform="translate(${x},${y}) scale(${s})"><circle cx="${on?-60:60}" cy="-170" r="220" fill="${on?'#3D7BFF':P.red}" opacity=".22"/><path d="M-260 -40 L-180 -130 H150 L240 -40 V40 H-260Z" fill="#F4F6FA" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-170 -120 H-20 V-50 H-240Z M0 -120 H140 L210 -50 H0Z" fill="#9AD1FF" stroke="${INK}" stroke-width="6"/>
   <rect x="-260" y="-20" width="500" height="34" fill="#3D7BFF"/><rect x="-260" y="-20" width="500" height="34" fill="url(#c30amb)" opacity=".0"/>${[-220,-140,-60,20,100,180].map((a,i)=>`<rect x="${a}" y="-20" width="40" height="34" fill="${i%2?'#FFD84D':'#3D7BFF'}"/>`).join('')}
   <rect x="-60" y="-160" width="60" height="26" rx="8" fill="${on?'#3D7BFF':'#1A2A5A'}" stroke="${INK}" stroke-width="5"/><rect x="0" y="-160" width="60" height="26" rx="8" fill="${on?'#4A1020':P.red}" stroke="${INK}" stroke-width="5"/>
   <circle cx="-170" cy="40" r="46" fill="#22202E" stroke="${INK}" stroke-width="8"/><circle cx="150" cy="40" r="46" fill="#22202E" stroke="${INK}" stroke-width="8"/><text x="-10" y="-60" text-anchor="middle" font-size="34" font-weight="900" fill="${INK}">POLICE</text></g>`;}
function c30_qrow(x,y,q,a,k,o={}){const col=a==='YES'?P.mint:a==='NO'?P.coral:'#6A7088';const w=o.w||1020;return `<g transform="translate(${x},${y}) scale(${c30_f(k)})"><rect x="${-w/2}" y="-46" width="${w}" height="92" rx="20" fill="#0A1426" fill-opacity=".92" stroke="#3B4A78" stroke-width="5"/>
   <text x="${-w/2+30}" y="16" font-size="44" font-weight="900" fill="#fff">${q}</text>${a?`<g transform="translate(${w/2-110},0)"><rect x="-90" y="-36" width="180" height="72" rx="18" fill="${col}" stroke="${INK}" stroke-width="6"/><text y="17" text-anchor="middle" font-size="48" font-weight="900" fill="${INK}">${a}</text></g>`:''}</g>`;}

Object.assign(SHOTS,{
coHook(t,d,p,g){
  const mon=AT(t,p.monitor??3),nan=AT(t,p.nan??5.5),man=AT(t,p.man??8),wh=AT(t,p.whisper??11);
  const zoom=1+.18*eout(prog(t,0,4));
  return `${c30_room(g,{storm:1})}
   ${c30_monitor(1620,470,.6,g,{spike:wh?.6:0})}${c30_table(1720,760)}
   <g transform="translate(820,640) scale(${c30_f(zoom)}) translate(-820,-640)">${c30_bed(880,660,1.05,g,{brows:wh?'sad':'calm'})}
   ${nan?`${person({x:330,y:470,s:.9,t:g,who:'nan',pose:'reach',mouth:'frown',brows:'sad',blink:BL(g),look:1})}`:''}</g>
   ${man?`<g opacity="${c30_f(prog(t,p.man??8,(p.man??8)+.8))}">${c30_hale(1330,430,.95,g,{sil:1,pose:'down',click:Math.sin(g*6)>.6?1:0})}</g>`:''}
   ${wh?c30_whisper(860,170,860,'"FORTY-EIGHT HOURS.','THEN IT\'S ON A PLANE…"',{sc:pop(t,p.whisper??11),size:48}):''}
   ${!wh?T(960,140,mon?'HE CAN HEAR EVERYTHING':'IN A COMA',{size:96,fill:mon?P.white:c30_AMB,sc:IN(t,mon?p.monitor??3:.1)}):''}
   ${wh?c30_timer('48:00:00',{x:1480,y:150,s:.6,label:'UNTIL IT\'S GONE',g}):''}`;
},
coFlash(t,d,p,g){
  const acc=AT(t,p.night??1.6),fin=AT(t,p.finger??4.5);
  if(!fin) return `${c30_gallery(g,{dark:.7,beam:1})}${c30_rail(300,250,1320,0)}<rect width="1920" height="1080" fill="#7A2A4A" opacity=".18"/>
   ${T(960,150,'THE VOICE FROM THAT NIGHT',{size:80,fill:P.white,sc:IN(t,.1)})}${acc?`<g transform="translate(960,840) rotate(-6) scale(${c30_f(pop(t,p.night??1.6))})">${labelPill(0,0,'NOT AN ACCIDENT',P.red,70)}</g>`:''}`;
  const k=eout(prog(t,p.finger??4.5,(p.finger??4.5)+3));
  return `${c30_room(g,{dark:.4})}<g transform="translate(960,560) scale(${c30_f(1.6+k*.5)}) translate(-960,-560)">${c30_bed(960,560,1,g)}
    <g transform="translate(1180,600)"><path d="M0 0 q30 -10 60 0 q-30 14 -60 0Z" fill="${P.cream}" stroke="${INK}" stroke-width="5"/><circle cx="70" cy="0" r="${c30_f(26+8*Math.sin(g*4))}" fill="none" stroke="${P.red}" stroke-width="5"/></g></g>
   ${T(960,150,"CAN'T MOVE A FINGER",{size:96,fill:P.red,sc:IN(t,p.finger??4.5)})}`;
},
coStorm(t,d,p,g){
  const st=AT(t,p.storm??1.5),gal=AT(t,p.gallery??4.5),met=AT(t,p.met??8),old=AT(t,p.older??11);
  if(!st) return `${card('cardDark',g)}<g transform="translate(960,470) scale(${c30_f(pop(t,.05))})">${[0,1].map(i=>`<path d="M${-20-i*110} -90 L${-150-i*110} 0 L${-20-i*110} 90Z" fill="${c30_AMB}" stroke="${INK}" stroke-width="10" stroke-linejoin="round" transform="translate(${130+((g*200)%40)},0)"/>`).join('')}</g>${T(960,700,"LET'S GO BACK",{size:110,fill:P.white,sc:IN(t,.1)})}${T(960,820,'3 NIGHTS EARLIER',{size:60,fill:c30_AMB,sc:IN(t,.6)})}`;
  if(!gal){const fl=((g*1.2)%3)<.12;let rain='';const r=rng(8);for(let i=0;i<90;i++){const x=r()*1920,y=((r()*1080+g*900*(1+r()*.5))%1080);rain+=`<path d="M${x.toFixed(0)} ${y.toFixed(0)} l-14 40" stroke="#9FC3E0" stroke-width="3" opacity=".45"/>`;}
    return `${c30_DEF}<rect width="1920" height="1080" fill="url(#c30storm)"/>${fl?`<path d="M1400 0 L1340 180 L1400 190 L1310 420" stroke="#fff" stroke-width="10" fill="none"/><rect width="1920" height="1080" fill="#C9D8FF" opacity=".25"/>`:''}
     <path d="M560 380 L960 220 L1360 380Z" fill="#2A2A4A" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><rect x="560" y="380" width="800" height="460" fill="#24243E" stroke="${INK}" stroke-width="10"/>
     ${[640,780,920,1060,1200].map(x=>`<rect x="${x}" y="420" width="60" height="420" fill="#3A3A5A" stroke="${INK}" stroke-width="6"/>`).join('')}<rect x="900" y="660" width="120" height="180" fill="${c30_AMB}" opacity=".8" stroke="${INK}" stroke-width="6"/>
     ${t21_sign(960,330,'SCIENCE MUSEUM',c30_AMB,g,40)}<rect y="840" width="1920" height="240" fill="#14142A"/>${rain}${T(960,160,'A STORM HITS THE MUSEUM',{size:80,fill:P.white,sc:IN(t,p.storm??1.5)})}`;}
  return `${c30_gallery(g,{storm:1})}${c30_rail(300,250,1320,0)}
   ${glint({x:1500,y:120,s:.55,t:g,look:-1,mouth:'smile',blink:BL(g)})}
   ${met?`<g transform="translate(960,330) scale(${c30_f(pop(t,p.met??8))})">${labelPill(0,0,'THE KESTREL METEORITE',c30_AMB,46)}</g>`:''}
   ${old?`<g transform="translate(470,620) scale(${c30_f(pop(t,p.older??11))})"><rect x="-220" y="-90" width="440" height="180" rx="22" fill="#0B1026" stroke="${c30_AMB}" stroke-width="7"/>${T(0,-16,'OLDER THAN',{size:52,fill:P.white})}${T(0,56,'THE OCEANS',{size:60,fill:c30_AMB})}</g>`:''}
   ${AT(t,p.loan??13)?`<g transform="translate(1450,620) scale(${c30_f(pop(t,p.loan??13))})">${labelPill(0,0,'ON LOAN · WORTH MILLIONS',P.gold,40)}</g>`:''}`;
},
coBlackout(t,d,p,g){
  const dk=AT(t,p.dies??1.4),tor=AT(t,p.torch??3),hum=AT(t,p.hum??6),clk=p.click??8,say=AT(t,p.says??11);
  return `${c30_gallery(g,{dark:dk?1:0,beam:tor?1:0})}${!dk&&((t*8)%1)<.5?`<rect width="1920" height="1080" fill="#DDE6FF" opacity=".25"/>`:''}
   ${tor?`<g opacity=".9">${c30_hale(1560,520,.8,g,{sil:1,pose:'point',click:AT(t,clk)&&Math.sin(g*7)>.3?1:0})}</g>`:''}${hum?c30_notes(1460,330,g,1):''}
   ${c30_click(640,210,t,AT(t,clk)?clk:null,g)}
   ${say?c30_whisper(960,860,920,'"NOBODY LOOKS TWICE','AT A ROCK."',{sc:pop(t,p.says??11),size:50}):''}
   ${!tor?T(960,160,'EVERY LIGHT DIES',{size:96,fill:P.white,sc:IN(t,p.dies??1.4)}):''}`;
},
coFall(t,d,p,g){
  const gone=AT(t,p.gone??3),dk=AT(t,p.dark??5),bp=AT(t,p.beep??7.5);
  if(dk&&!bp) return `<rect width="1920" height="1080" fill="#000"/>${T(960,560,'DARKNESS',{size:70,fill:'#3A4060',op:prog(t,p.dark??5,(p.dark??5)+1)})}`;
  if(bp){const k=prog(t,p.beep??7.5,(p.beep??7.5)+5);return `<rect width="1920" height="1080" fill="#02040A"/>${c30_ecgPath(200,560,1520*Math.min(1,k*1.4+.1),g,{amp:1.2,sw:9})}
    ${[0,1,2].map(i=>AT(t,(p.beep??7.5)+i*.8)?T(560+i*400,330,'BEEP.',{size:84,fill:c30_AMB,sc:pop(t,(p.beep??7.5)+i*.8)}):'').join('')}`;}
  const tip=eout(prog(t,p.gone??3,(p.gone??3)+1.6));
  return `${c30_gallery(g,{dark:.8,beam:1})}<g transform="translate(0,${c30_f(-tip*140)})">${c30_rail(300,620,1320,gone?1:0)}
   ${glint({x:1050,y:380+tip*260,s:.95,t:g,mouth:gone?'o':'flat',brows:gone?'raised':'calm',pose:gone?'up':'down',rot:-tip*70,blink:0})}</g>
   ${gone?`<g transform="translate(960,150) scale(${c30_f(pop(t,p.gone??3))})">${T(0,0,"THE RAILING ISN'T THERE",{size:84,fill:P.red})}</g>`:T(960,150,'HE STEPS BACK…',{size:84,fill:P.white,sc:IN(t,.1)})}`;
},
coGCS(t,d,p,g){
  const rows=[['EYES OPEN?','1–4',p.eyes??4],['CAN YOU SPEAK?','1–5',p.speak??5.5],['CAN YOU MOVE?','1–6',p.move??7]];
  let rs='';rows.forEach(([a,b,at],i)=>{if(!AT(t,at))return;const k=pop(t,at);rs+=`<g transform="translate(960,${360+i*150}) scale(${c30_f(k)})"><rect x="-520" y="-58" width="1040" height="116" rx="24" fill="#0A1426" stroke="#3B4A78" stroke-width="6"/><text x="-480" y="18" font-size="56" font-weight="900" fill="#fff">${a}</text><text x="470" y="20" text-anchor="end" font-size="64" font-weight="900" fill="${c30_AMB}">${b}</text></g>`;});
  const tot=AT(t,p.score??9),co=AT(t,p.coma??12.5);
  const pre=!AT(t,p.eyes??4);
  if(pre) return `${c30_room(g)}${c30_bed(760,680,1.05,g)}${c30_doctor(1320,440,1,g,{pose:'point',look:-1})}<path d="M1470 470 L700 610" stroke="#FFF6C0" stroke-width="30" opacity=".18"/>${T(960,170,'HOW AWAKE IS HE?',{size:96,fill:P.white,sc:IN(t,.3)})}`;
  return `${c30_DEF}<rect width="1920" height="1080" fill="url(#c30wall)"/>${T(960,170,'GLASGOW COMA SCALE',{size:96,fill:P.white,sc:IN(t,.2)})}${rs}
   ${tot?`<g transform="translate(680,830) scale(${c30_f(pop(t,p.score??9))})">${labelPill(0,0,'SCORE: 3 TO 15',P.mint,52)}</g>`:''}${co?`<g transform="translate(1300,830) rotate(-4) scale(${c30_f(pop(t,p.coma??12.5))})">${labelPill(0,0,'8 OR LESS = COMA',P.red,52)}</g>`:''}`;
},
coSqueeze(t,d,p,g){
  const no=AT(t,p.nothing??2),sc=AT(t,p.gcs??3.5);
  return `${c30_room(g)}${c30_bed(820,640,1.1,g)}${c30_doctor(1300,420,1,g,{pose:'point',look:-1})}${c30_monitor(1600,300,.6,g)}
   ${c30_bub(1300,140,700,'"SQUEEZE MY HAND,','GLINT."',{tail:'center',sc:IN(t,.2)})}
   ${no?T(560,300,'NOTHING.',{size:110,fill:'#9AA7BD',sc:pop(t,p.nothing??2)}):''}${sc?stamp(560,480,1.1,'GCS 6'):''}`;
},
coInside(t,d,p,g){
  const wk=AT(t,p.awake??1.2),wo=AT(t,p.wont??3);
  return `${c30_room(g,{dark:.3})}${c30_bed(640,700,1,g)}
   <path d="M560 600 Q700 420 1100 400" stroke="${P.mint}" stroke-width="8" fill="none" stroke-dasharray="20 16" opacity="${wk?.8:0}"/>
   ${wk?c30_inner(1260,420,1.25*pop(t,p.awake??1.2),g,{pose:'up',mouth:'o',label:'WIDE AWAKE'}):''}
   ${T(960,140,'IN THIS WORLD…',{size:84,fill:P.white,sc:IN(t,.1)})}${wo?`<g transform="translate(560,860) scale(${c30_f(pop(t,p.wont??3))})">${labelPill(0,0,"BODY WON'T ANSWER",P.coral,46)}</g>`:''}`;
},
coOneInFour(t,d,p,g){
  const yr=AT(t,p.year??3),n=AT(t,p.three??5),one=AT(t,p.one??7.5),aw=AT(t,p.hidden??10);
  let beds='';for(let i=0;i<4;i++){const x=360+i*400;const lit=one&&i===2;beds+=`<g transform="translate(${x},620)">${c30_bed(0,0,.5,g+i,{blanket:lit?'#5FA8C8':'#4A6A88'})}${lit&&aw?c30_inner(-180,-190,.5,g,{pose:'wave',mouth:'grin'}):''}</g>`;}
  return `${c30_DEF}<rect width="1920" height="1080" fill="url(#c30wall)"/>${beds}
   ${yr?`<g transform="translate(520,180) scale(${c30_f(pop(t,p.year??3))})">${labelPill(0,0,'STUDY · 2024',P.gold,50)}</g>`:''}${n?`<g transform="translate(1340,180) scale(${c30_f(pop(t,p.three??5))})">${labelPill(0,0,'300+ PATIENTS',P.ice,50)}</g>`:''}
   ${one?T(960,330,'ABOUT 1 IN 4',{size:130,fill:P.mint,sc:pop(t,p.one??7.5)}):''}${aw?T(960,860,'HIDDEN AWARENESS',{size:70,fill:P.white,sc:pop(t,p.hidden??10)}):''}`;
},
coSound(t,d,p,g){
  const enc=AT(t,p.encourage??5),hear=AT(t,p.hear??8),ans=AT(t,p.answer??9.5);
  let waves='';for(let i=0;i<5;i++){const k=((g*.7+i/5)%1);waves+=`<path d="M${(380+k*520).toFixed(0)} ${(460-90).toFixed(0)} Q${(430+k*520).toFixed(0)} 460 ${(380+k*520).toFixed(0)} ${(460+90).toFixed(0)}" stroke="${c30_AMB}" stroke-width="10" fill="none" opacity="${c30_f(1-k)}"/>`;}
  if(hear) return `${c30_DEF}<rect width="1920" height="1080" fill="url(#c30wall)"/>
   <g transform="translate(560,520) scale(${c30_f(pop(t,p.hear??8))})"><circle r="230" fill="#0A1426" stroke="${P.mint}" stroke-width="12"/><path d="M-50 -110 Q60 -150 90 -40 Q110 40 40 70 Q0 90 10 140 Q-30 160 -50 120" stroke="${P.cream}" stroke-width="34" fill="none" stroke-linecap="round"/>${T(0,320,'HEARS',{size:80,fill:P.mint})}</g>
   ${ans?`<g transform="translate(1360,520) scale(${c30_f(pop(t,p.answer??9.5))})"><circle r="230" fill="#0A1426" stroke="${P.red}" stroke-width="12"/><path d="M-90 0 H90" stroke="${P.cream}" stroke-width="30" stroke-linecap="round"/><path d="M-150 -150 L150 150" stroke="${P.red}" stroke-width="30" stroke-linecap="round"/>${T(0,320,"CAN'T ANSWER",{size:80,fill:P.red})}</g>`:''}`;
  return `${c30_room(g)}${c30_bed(1260,720,.9,g)}${person({x:300,y:520,s:.85,t:g,who:'nan',pose:'hold',mouth:Math.sin(g*9)>0?'o':'smile',blink:BL(g),look:1})}${waves}
   ${c30_brainScan(1260,330,.55,g,{mode:'yes',k:.7})}${T(960,120,'SOUND STILL REACHES THE BRAIN',{size:72,fill:P.white,sc:IN(t,.2)})}
   ${enc?`<g transform="translate(700,860) scale(${c30_f(pop(t,p.encourage??5))})">${labelPill(0,0,'KEEP TALKING TO THEM',c30_AMB,48)}</g>`:''}`;
},
coNan(t,d,p,g){
  const sc=AT(t,p.scores??2.6),bk=AT(t,p.baking??5),bag=AT(t,p.bag??7),nur=AT(t,p.nurses??10);
  return `${c30_room(g,{night:0})}${c30_bed(1120,700,.95,g)}${c30_monitor(1640,320,.55,g)}
   ${person({x:430,y:520,s:.95,t:g,who:'nan',pose:'hold',mouth:Math.sin(g*8)>0?'o':'smile',blink:BL(g),look:1})}
   ${sc?c30_newspaper(450,640,.8,-6):''}${bk&&!bag?`<g transform="translate(760,300) scale(${c30_f(pop(t,p.baking??5))})">${c30_bub(0,0,520,'"LEMON DRIZZLE,','LOVE."',{tail:'left'})}</g>`:''}
   ${bag?c30_bagPickles(760,760,.85*pop(t,p.bag??7),g):''}${nur?`${c30_nurse(1650,560,.85,g,{look:-1,mouth:'smile'})}<g transform="translate(1650,230) scale(${c30_f(pop(t,p.nurses??10))})">${labelPill(0,0,'NURSE: "I SAW NOTHING"',P.ice,34)}</g>`:''}
   ${t21_pm(t,'plus','NAN')}`;
},
coStories(t,d,p,g){
  const four=AT(t,p.four??4.5),six=AT(t,p.six??6.5),fast=AT(t,p.faster??8.5);
  const k=prog(t,p.faster??8.5,(p.faster??8.5)+3);
  return `${c30_DEF}<rect width="1920" height="1080" fill="url(#c30wall)"/>${T(960,150,'SMALL STUDY · 2015',{size:80,fill:P.gold,sc:IN(t,.2)})}
   <g transform="translate(470,450)"><rect x="-230" y="-200" width="460" height="400" rx="30" fill="#0A1426" stroke="#3B4A78" stroke-width="7"/>
    <path d="M-120 20 Q-120 -130 0 -130 Q120 -130 120 20" stroke="${INK}" stroke-width="30" fill="none"/><path d="M-120 20 Q-120 -130 0 -130 Q120 -130 120 20" stroke="#5D6A82" stroke-width="16" fill="none"/>
    <rect x="-150" y="0" width="60" height="110" rx="24" fill="${c30_AMB}" stroke="${INK}" stroke-width="8"/><rect x="90" y="0" width="60" height="110" rx="24" fill="${c30_AMB}" stroke="${INK}" stroke-width="8"/>${c30_notes(-40,-20,g,1)}${T(0,170,'FAMILY STORIES',{size:40,fill:P.white})}</g>
   ${four?`<g transform="translate(470,740) scale(${c30_f(pop(t,p.four??4.5))})">${labelPill(0,0,'4× A DAY',c30_AMB,46)}</g>`:''}${six?`<g transform="translate(470,840) scale(${c30_f(pop(t,p.six??6.5))})">${labelPill(0,0,'6 WEEKS',P.ice,40)}</g>`:''}
   ${fast?`<g transform="translate(1300,560)"><rect x="-420" y="-300" width="840" height="560" rx="24" fill="#0A1426" stroke="#3B4A78" stroke-width="7"/><path d="M-360 220 H380 M-360 220 V-260" stroke="#8C9AB4" stroke-width="8"/>
     <path d="M-360 200 Q${-100} ${c30_f(160-k*200)} ${c30_f(-360+700*k)} ${c30_f(200-k*400)}" stroke="${P.mint}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M-360 205 Q0 190 ${c30_f(-360+700*k)} ${c30_f(205-k*90)}" stroke="#6A7088" stroke-width="12" fill="none" stroke-linecap="round"/>
     ${T(200,-200,'STORIES',{size:50,fill:P.mint,op:k})}${T(240,90,'SILENCE',{size:44,fill:'#9AA7BD',op:k})}${T(0,-330,'RECOVERED FASTER',{size:60,fill:P.white,sc:pop(t,p.faster??8.5)})}</g>`:''}`;
},
coQuestion(t,d,p,g){
  const q=AT(t,p.ask??3.6),sc=AT(t,p.screams??6.5),mo=AT(t,p.mouth??8);
  return `${c30_room(g,{night:0})}${c30_bed(1100,720,1,g)}${person({x:420,y:520,s:.95,t:g,who:'nan',pose:'reach',mouth:q&&!sc?'o':'frown',brows:'sad',blink:BL(g),look:1})}
   ${q?c30_bub(620,250,760,'"CAN YOU HEAR ME,','LOVE?"',{tail:'left',sc:pop(t,p.ask??3.6)}):''}
   ${sc?c30_inner(1360,320,1.05*pop(t,p.screams??6.5),g,{pose:'up',mouth:'teeth',brows:'angry',label:'YES! YES!'}):''}
   ${mo?`<g transform="translate(1000,860) scale(${c30_f(pop(t,p.mouth??8))})">${labelPill(0,0,"HIS MOUTH DOESN'T MOVE",P.coral,44)}</g>`:''}${t21_pm(t,'minus','THE QUESTION')}`;
},
coBauby(t,d,p,g){
  const ey=AT(t,p.eyelid??5),bk=AT(t,p.book??8),tr=AT(t,p.tries??11),tw=AT(t,p.twitch??13);
  if(tr){const k=prog(t,p.tries??11,(p.tries??11)+2);return `${c30_room(g,{dark:.3})}<g transform="translate(960,560) scale(2.4) translate(-860,-560)">${c30_bed(960,600,1,g)}</g>
    ${T(960,150,'GLINT TRIES TO BLINK…',{size:84,fill:P.white,sc:IN(t,p.tries??11)})}${tw?`<g transform="translate(960,850) scale(${c30_f(pop(t,p.twitch??13))})">${labelPill(0,0,'NOT EVEN A TWITCH',P.red,56)}</g>`:''}`;}
  const L='ESARINTULOM',hi=Math.floor(t*2.2)%L.length;const bl=((g*2.2)%1)<.25;
  return `${c30_DEF}<rect width="1920" height="1080" fill="#1A1A30"/><circle cx="560" cy="500" r="420" fill="url(#c30amb)" opacity=".35"/>
   <g transform="translate(560,560)"><rect x="-180" y="60" width="360" height="40" rx="10" fill="#5D6A82" stroke="${INK}" stroke-width="7"/><circle cx="-130" cy="260" r="80" fill="none" stroke="#3A4058" stroke-width="20"/><circle cx="130" cy="260" r="80" fill="none" stroke="#3A4058" stroke-width="20"/>
    ${extra({x:0,y:-60,s:.95,t:g,head:'#E8C4A0',mouth:'flat',hair:`<path d="M-80 -80 Q-70 -146 0 -146 Q70 -146 80 -80 Q40 -110 0 -110 Q-40 -110 -80 -80Z" fill="#6A5A4A" stroke="${INK}" stroke-width="7"/>`})}
    ${ey?`<circle cx="-26" cy="-122" r="${bl?3:18}" fill="${bl?INK:'#fff'}" stroke="${INK}" stroke-width="5"/><circle cx="-26" cy="-122" r="${bl?0:9}" fill="${INK}"/><circle cx="-26" cy="-122" r="44" fill="none" stroke="${P.gold}" stroke-width="6" opacity="${c30_f(.5+.5*Math.sin(g*5))}"/>`:''}</g>
   ${T(1220,170,'JEAN-DOMINIQUE BAUBY',{size:60,fill:P.white,sc:IN(t,.2)})}${T(1220,250,'LOCKED-IN AFTER A STROKE',{size:44,fill:'#9AA7BD',sc:IN(t,1.4)})}
   ${ey?`<g transform="translate(1220,450) scale(${c30_f(pop(t,p.eyelid??5))})">${labelPill(0,0,'ONLY HIS LEFT EYELID',P.gold,46)}</g>`:''}
   ${bk?`<g transform="translate(1220,700) scale(${c30_f(pop(t,p.book??8))})"><rect x="-190" y="-130" width="380" height="260" rx="10" fill="#2E5A8A" stroke="${INK}" stroke-width="9"/><rect x="-170" y="-110" width="20" height="220" fill="#1E3A5A"/>${T(10,-30,'A WHOLE BOOK',{size:42,fill:P.white})}${T(10,40,'BY BLINKING',{size:42,fill:P.gold})}</g>
     <g transform="translate(1220,880)">${[...L].map((c,i)=>`<text x="${-330+i*66}" y="0" text-anchor="middle" font-size="54" font-weight="900" fill="${i===hi?P.gold:'#5D6A82'}">${c}</text>`).join('')}</g>`:''}`;
},
coOsei(t,d,p,g){
  const six=AT(t,p.six??3.6),ten=AT(t,p.tennis??7),lit=AT(t,p.lit??9.5),hs=AT(t,p.house??12.5),dif=AT(t,p.diff??15),ex=AT(t,p.exactly??17);
  if(!six) return `${c30_room(g,{night:0})}${c30_bed(1300,740,.8,g)}${person({x:420,y:520,s:.95,t:g,who:'osei',pose:'point',mouth:Math.sin(g*8)>0?'o':'smile',blink:BL(g),look:1})}${person({x:760,y:560,s:.85,t:g,who:'nan',mouth:'o',blink:BL(g+2),look:-1})}${t21_pm(t,'plus','DR. OSEI')}`;
  const mode=hs?'house':lit?'tennis':'none';
  return `${c30_DEF}<rect width="1920" height="1080" fill="#0A1020"/>${c30_brainScan(1320,520,1.2,g,{mode,k:hs?pop(t,p.house??12.5):pop(t,p.lit??9.5),lab:'fMRI SCAN'})}
   <g transform="translate(470,560)"><rect x="-300" y="-330" width="600" height="660" rx="30" fill="#0A1426" stroke="#3B4A78" stroke-width="7"/>
    ${!hs?`${ten?c30_racket(-40,-20,1.1*pop(t,p.tennis??7),-25+Math.sin(g*4)*25):''}${ten?c30_ball(120,-160+Math.sin(g*4)*40,1):''}${T(0,260,ten?'"IMAGINE TENNIS"':'ADRIAN OWEN',{size:52,fill:P.white})}`
      :`${c30_house(0,-40,1.4*pop(t,p.house??12.5))}${T(0,260,'"WALK THROUGH',{size:46,fill:P.white})}${T(0,316,'YOUR HOUSE"',{size:46,fill:P.white})}`}</g>
   ${T(960,140,'2006: A WOMAN WHO SEEMED UNRESPONSIVE',{size:58,fill:P.gold,sc:IN(t,p.six??3.6)})}
   ${lit&&!hs?`<g transform="translate(1320,890) scale(${c30_f(pop(t,p.lit??9.5))})">${labelPill(0,0,'MOVEMENT AREA LIGHTS UP',c30_AMB,40)}</g>`:''}
   ${dif&&!ex?`<g transform="translate(1320,890) scale(${c30_f(pop(t,p.diff??15))})">${labelPill(0,0,'TOTALLY DIFFERENT AREAS',P.mint,40)}</g>`:''}
   ${ex?`<g transform="translate(1320,890) scale(${c30_f(pop(t,p.exactly??17))})">${labelPill(0,0,'LIKE A HEALTHY VOLUNTEER',P.white,40)}</g>`:''}`;
},
coCode(t,d,p,g){
  const no=AT(t,p.no??3.5),bk=AT(t,p.booked??6),pr=AT(t,p.practise??10);
  if(pr) return `${c30_room(g,{dark:.3})}<g transform="translate(-200,0)">${c30_bed(900,740,.9,g)}</g>${c30_inner(1200,400,1.1,g,{pose:'flex',mouth:'grin',brows:'angry',label:'PRACTISING'})}
    ${c30_racket(1200,380,.35,Math.sin(g*5)*30)}${T(960,140,'INSIDE, HE STARTS PRACTISING',{size:72,fill:P.white,sc:IN(t,p.practise??10)})}`;
  return `${c30_DEF}<rect width="1920" height="1080" fill="url(#c30wall)"/>${T(960,150,'A CODE',{size:110,fill:P.white,sc:IN(t,.2)})}
   <g transform="translate(560,500)">${c30_racket(-150,0,.8,-20)}<text x="10" y="20" font-size="90" font-weight="900" fill="#fff">=</text>${c30_yn(220,0,'YES',P.mint,pop(t,.8))}</g>
   ${no?`<g transform="translate(1360,500)">${c30_house(-160,40,.8)}<text x="10" y="20" font-size="90" font-weight="900" fill="#fff">=</text>${c30_yn(220,0,'NO',P.coral,pop(t,p.no??3.5))}</g>`:''}
   ${bk?`<g transform="translate(960,830) scale(${c30_f(pop(t,p.booked??6))})">${c30_bub(0,0,980,'"SCANNER BOOKED:','FRIDAY, SIX A.M."',{tail:'center',size:52})}</g>`:''}`;
},
coKai(t,d,p,g){
  const sh=AT(t,p.should??5),sw=AT(t,p.swapped??7.5),cn=AT(t,p.concert??10);
  return `${c30_room(g,{night:0})}${c30_bed(1150,720,.95,g)}${person({x:470,y:560,s:.95,t:g,who:'kai',legs:'sit',mouth:'frown',brows:'sad',blink:BL(g),look:1,rot:Math.sin(g*20)*1.2})}
   ${sh?c30_bub(720,220,740,'"IT SHOULD\'VE','BEEN ME."',{tail:'left',sc:pop(t,p.should??5)}):''}
   ${sw?`<g transform="translate(1420,400) rotate(5) scale(${c30_f(pop(t,p.swapped??7.5))})"><rect x="-200" y="-150" width="400" height="300" rx="14" fill="#F4F1EA" stroke="${INK}" stroke-width="8"/>${T(0,-90,'NIGHT ROTA',{size:40,fill:INK,stroke:0})}
     <text x="-170" y="-20" font-size="40" font-weight="900" fill="${INK}">FRI: <tspan text-decoration="line-through" fill="${P.red}">KAI</tspan></text><text x="-170" y="50" font-size="40" font-weight="900" fill="${INK}">FRI: GLINT</text>${cn?`<g transform="translate(110,110) rotate(-12)"><rect x="-90" y="-40" width="180" height="80" rx="10" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><text y="14" text-anchor="middle" font-size="30" font-weight="900" fill="${INK}">CONCERT</text></g>`:''}</g>`:''}
   ${t21_pm(t,'minus',"KAI'S SECRET")}`;
},
coKaiLie(t,d,p,g){
  const q=AT(t,p.quit??3.5),here=AT(t,p.here??4.8),fam=AT(t,p.familiar??6.2),sh=AT(t,p.shout??12);
  if(fam){const k=prog(t,p.familiar??6.2,(p.familiar??6.2)+2);return `${c30_DEF}<rect width="1920" height="1080" fill="#0A1020"/>
    <g transform="translate(560,560)"><rect x="-380" y="-300" width="760" height="620" rx="24" fill="#0A1426" stroke="#3B4A78" stroke-width="7"/>${T(0,-220,'BRAIN RESPONSE',{size:48,fill:P.white})}
     <rect x="-250" y="${c30_f(220-380*k)}" width="180" height="${c30_f(380*k)}" fill="${P.mint}" stroke="${INK}" stroke-width="7"/><rect x="70" y="${c30_f(220-160*k)}" width="180" height="${c30_f(160*k)}" fill="#6A7088" stroke="${INK}" stroke-width="7"/>
     <path d="M-320 220 H320" stroke="#8C9AB4" stroke-width="8"/>${T(-160,280,'FAMILIAR',{size:38,fill:P.mint})}${T(160,280,'STRANGER',{size:38,fill:'#9AA7BD'})}</g>
    ${T(1360,330,'"GLINT"',{size:110,fill:c30_AMB,sc:IN(t,p.familiar??6.2)})}${T(1360,450,'= HIS OWN NAME',{size:52,fill:P.white,sc:IN(t,(p.familiar??6.2)+1)})}
    ${sh?c30_inner(1360,690,.75*pop(t,p.shout??12),g,{pose:'up',mouth:'teeth',brows:'angry',label:'NOBODY CAN SEE IT'}):''}`;}
  return `${c30_room(g,{night:0})}${c30_bed(1150,720,.95,g)}${person({x:470,y:560,s:.95,t:g,who:'kai',legs:'sit',mouth:Math.sin(g*8)>0?'o':'frown',brows:'sad',blink:BL(g),look:1})}
   ${c30_whisper(780,230,860,'"I TOLD NAN I\'M AT','THE BIKE SHOP…"',{sc:IN(t,.2),size:46})}
   ${q?`<g transform="translate(1440,420) rotate(-6) scale(${c30_f(pop(t,p.quit??3.5))})"><rect x="-200" y="-60" width="400" height="120" rx="14" fill="#2E5A8A" stroke="${INK}" stroke-width="8"/>${T(0,20,'BIKE SHOP',{size:56,fill:P.white})}<path d="M-200 -60 L200 60 M200 -60 L-200 60" stroke="${P.red}" stroke-width="14"/></g>`:''}
   ${here?`<g transform="translate(760,900) scale(${c30_f(pop(t,p.here??4.8))})">${labelPill(0,0,'"I QUIT. I\'M HERE."',P.gold,50)}</g>`:''}`;
},
coVisitor(t,d,p,g){
  const fs=AT(t,p.foot??3),clk=p.click??5,hl=AT(t,p.hale??8),kind=AT(t,p.kind??11);
  const walk=eout(prog(t,p.foot??3,(p.foot??3)+3));
  return `${c30_room(g,{dark:.6})}${c30_bed(760,720,.95,g)}${c30_monitor(330,640,.45,g)}${c30_clock(1600,150,.8,'03:00',P.red)}
   ${fs?c30_hale(lerp(1900,1320,walk),440,.95,g,{sil:hl?0:1,flowers:1,click:AT(t,clk)&&Math.sin(g*7)>.4?1:0,mouth:'smile',look:-1}):''}
   ${c30_click(560,250,t,AT(t,clk)?clk:null,g)}
   ${hl?`<g transform="translate(1320,860) scale(${c30_f(pop(t,p.hale??8))})">${labelPill(0,0,'MR. HALE · HEAD OF EXHIBITIONS',P.ice,38)}</g>`:''}${kind?`<g transform="translate(700,380) rotate(-5) scale(${c30_f(pop(t,p.kind??11))})">${labelPill(0,0,'VERY KIND. VERY WORRIED.',P.white,40)}</g>`:''}
   ${t21_pm(t,'minus','THE VISITOR')}`;
},
coNurse(t,d,p,g){
  const ns=AT(t,p.nurse??2.8),gd=AT(t,p.good??7),lean=AT(t,p.lean??8.5),wh=AT(t,p.whisper??10.5);
  if(lean){const k=eout(prog(t,p.lean??8.5,(p.lean??8.5)+1.5));return `${c30_room(g,{dark:.7})}<g transform="translate(860,620) scale(${c30_f(1.3+k*.3)}) translate(-860,-620)">${c30_bed(860,680,1,g)}${c30_hale(lerp(1400,1180,k),420,1,g,{pose:'down',mouth:'smile',look:-1,click:Math.sin(g*7)>.5?1:0})}</g>
    ${wh?c30_whisper(960,160,1000,'"FORTY-EIGHT HOURS. THEN IT\'S ON','A PLANE, AND NOBODY WILL EVER KNOW."',{sc:pop(t,p.whisper??10.5),size:44}):''}${wh?c30_timer('48:00:00',{x:250,y:150,s:.55,label:'UNTIL IT\'S GONE',g}):''}`;}
  return `${c30_room(g,{dark:.6})}${c30_bed(760,720,.95,g)}${c30_hale(1320,440,.95,g,{mouth:'smile',look:-1,flowers:1})}${c30_nurse(260,460,.9,g,{look:1,mouth:ns?(Math.sin(g*8)>0?'o':'smile'):'smile'})}
   ${c30_bub(1260,130,760,'"WILL HE REMEMBER','ANYTHING?"',{tail:'center',sc:IN(t,.2)})}
   ${ns&&!gd?c30_bub(560,250,860,'"PEOPLE OFTEN DON\'T REMEMBER','THE MOMENTS BEFORE."',{tail:'left',sc:pop(t,p.nurse??2.8),size:40}):''}
   ${gd?T(1320,240,'"GOOD."',{size:140,fill:P.red,sc:pop(t,p.good??7)}):''}`;
},
coDeduce(t,d,p,g){
  const fk=AT(t,p.fake??3),cr=AT(t,p.crate??5.5),rl=AT(t,p.railing??11),bo=AT(t,p.bolts??13);
  return `${c30_DEF}<rect width="1920" height="1080" fill="#06202A"/><circle cx="960" cy="540" r="700" fill="url(#gMint)" opacity=".18"/>
   ${T(960,130,'GLINT PUTS IT TOGETHER',{size:80,fill:P.mint,sc:IN(t,.2)})}
   ${fk?`<g transform="translate(500,560) scale(${c30_f(.8*pop(t,p.fake??3))})">${c30_case(0,-80,1,g,{fake:1})}</g>`:''}
   ${cr?`<g transform="translate(990,600) scale(${c30_f(.8*pop(t,p.crate??5.5))})">${c30_crate(0,0,1)}${T(0,-240,'THE REAL ONE',{size:56,fill:P.white})}</g>`:''}
   ${rl?`<g transform="translate(1420,600) scale(${c30_f(pop(t,p.railing??11))})"><rect x="-200" y="-200" width="400" height="400" rx="20" fill="#0A1426" stroke="#3B4A78" stroke-width="7"/>${c30_rail(-170,-120,340,1)}
     ${bo?[[-60,30],[10,60],[70,20]].map(([a,b])=>`<g transform="translate(${a},${b})"><rect x="-10" y="-30" width="20" height="50" fill="#9AA7BD" stroke="${INK}" stroke-width="4"/><rect x="-20" y="-40" width="40" height="16" fill="#9AA7BD" stroke="${INK}" stroke-width="4"/></g>`).join('')+T(0,160,'BOLTS REMOVED',{size:44,fill:P.red}):''}</g>`:''}
   ${fk||cr?`<path d="M640 520 Q720 440 790 520 M1190 520 Q1220 440 1230 520" stroke="${P.mint}" stroke-width="7" fill="none" stroke-dasharray="16 12"/>`:''}`;
},
coCorridor(t,d,p,g){
  const dc=AT(t,p.doctors??2.5),lt=AT(t,p.care??6),mi=AT(t,p.miles??8),ns=AT(t,p.nan??10.5);
  return `${c30_DEF}<rect width="1920" height="1080" fill="url(#c30corr)"/>${[0,1,2,3].map(i=>`<rect x="${120+i*460}" y="200" width="200" height="560" rx="10" fill="#8CA6BC" stroke="${INK}" stroke-width="6"/>`).join('')}<rect y="780" width="1920" height="300" fill="#7A92A8"/><path d="M0 780 H1920" stroke="${INK}" stroke-width="6"/>
   ${[300,960,1620].map(x=>`<rect x="${x-120}" y="40" width="240" height="30" rx="12" fill="#fff"/>`).join('')}
   ${c30_timer('48:00:00',{x:1480,y:120,s:.6,label:'UNTIL THE SCAN',g,col:c30_AMB})}
   ${dc?`${c30_doctor(1500,480,.95,g,{look:-1,mouth:Math.sin(g*8)>0?'o':'flat'})}`:''}${person({x:640,y:480,s:.95,t:g,who:'nan',mouth:ns?'o':'frown',brows:'sad',blink:BL(g),look:1})}
   ${lt?`<g transform="translate(1080,310) scale(${c30_f(pop(t,p.care??6))})">${labelPill(0,0,'NO SIGN = LONG-TERM CARE',P.red,40)}</g>`:''}${mi?`<g transform="translate(1080,400) scale(${c30_f(pop(t,p.miles??8))})">${labelPill(0,0,'200 MILES AWAY',P.gold,40)}</g>`:''}
   ${ns?c30_bub(600,170,720,'"HE\'S IN THERE.','I KNOW HE IS."',{tail:'center',sc:pop(t,p.nan??10.5)}):''}`;
},
coGrapes(t,d,p,g){
  const tr=AT(t,p.tragic??2.5),th=AT(t,p.thanks??6),jp=AT(t,p.jumps??7),sp=AT(t,p.spike??10);
  const spike=jp?clamp((t-(p.jumps??7))*1.5):0;
  return `${c30_room(g,{night:0})}${c30_bed(780,720,.95,g)}${c30_monitor(1560,330,.72,g,{spike})}
   ${c30_hale(1080,470,.9,g,{grapes:1,mouth:'smile',look:-1})}${person({x:300,y:520,s:.9,t:g,who:'nan',mouth:th?'smile':'flat',blink:BL(g),look:1})}
   ${c30_timer('30:00:00',{x:250,y:120,s:.6,label:'UNTIL THE SCAN',g,col:c30_AMB})}
   ${tr&&!jp?c30_bub(1000,180,760,'"SUCH A TRAGIC ACCIDENT.','OLD RAILINGS."',{tail:'center',sc:pop(t,p.tragic??2.5),size:42}):''}
   ${jp&&!sp?T(1560,580,'HEART RATE JUMPS',{size:60,fill:P.red,sc:pop(t,p.jumps??7)}):''}
   ${sp?`${c30_nurse(1330,480,.85,g,{look:-1})}${c30_bub(1150,170,700,'"JUST A SPIKE.','IT HAPPENS."',{tail:'center',sc:pop(t,p.spike??10)})}`:''}`;
},
coProblem(t,d,p,g){
  const yn=AT(t,p.yesno??2.5),q1=AT(t,p.name??6.5),q2=AT(t,p.tues??7.8),q3=AT(t,p.steal??9.5),rq=AT(t,p.right??13);
  return `${c30_DEF}<rect width="1920" height="1080" fill="#0A1020"/>${c30_timer('12:00:00',{x:1460,y:120,s:.6,label:'UNTIL THE SCAN',g,col:c30_AMB})}
   ${T(720,150,'THE REAL PROBLEM',{size:90,fill:P.white,sc:IN(t,.2)})}
   ${yn?`${c30_yn(760,330,'YES',P.mint,pop(t,p.yesno??2.5))}${c30_yn(1160,330,'NO',P.coral,pop(t,(p.yesno??2.5)+.3))}`:''}
   ${q1?c30_qrow(960,490,'IS YOUR NAME GLINT?','',pop(t,p.name??6.5)):''}${q2?c30_qrow(960,600,'IS IT TUESDAY?','',pop(t,p.tues??7.8)):''}
   ${q3?`${c30_qrow(960,720,'DID SOMEONE STEAL A METEORITE?','',pop(t,p.steal??9.5),{w:1300})}<path d="M330 720 H1590" stroke="${P.red}" stroke-width="14" opacity="${c30_f(prog(t,(p.steal??9.5)+1,(p.steal??9.5)+1.5))}"/>`:''}
   ${rq?`<g transform="translate(960,850) scale(${c30_f(pop(t,p.right??13))})">${labelPill(0,0,'HE NEEDS THE RIGHT QUESTION',P.gold,48)}</g>`:''}`;
},
coPractise(t,d,p,g){
  const hm=AT(t,p.home??6.2),ov=AT(t,p.over??11),oh=AT(t,p.one??13);
  const tl=oh?'01:00:00':'06:00:00';
  if(!hm) return `${c30_DEF}<rect width="1920" height="1080" fill="#06202A"/><circle cx="960" cy="560" r="620" fill="url(#gMint)" opacity=".25"/>
   ${glint({x:860,y:520,s:1.05,t:g,pose:'flex',mouth:'grin',brows:'angry',blink:BL(g)})}${c30_racket(990,460,.7,-40+Math.sin(g*5)*50)}${c30_ball(1200+Math.sin(g*5)*80,320,1.2)}
   ${c30_yn(1450,700,'YES',P.mint,pop(t,2.5))}${T(780,140,'TENNIS. SERVE. SWING.',{size:84,fill:P.white,sc:IN(t,.2)})}${c30_timer(tl,{x:1480,y:140,s:.6,label:'UNTIL THE SCAN',g,col:c30_AMB})}`;
  const k=prog(t,p.home??6.2,(p.home??6.2)+5);
  return `${c30_DEF}<rect width="1920" height="1080" fill="#4A3358"/><rect y="560" width="1920" height="260" fill="#5B4068"/><rect y="820" width="1920" height="260" fill="#2E2238"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="6"/>
   <rect x="160" y="200" width="280" height="620" fill="#6A4A3A" stroke="${INK}" stroke-width="9"/><circle cx="400" cy="520" r="14" fill="${P.gold}"/>
   <rect x="760" y="560" width="440" height="40" rx="8" fill="#C9A46A" stroke="${INK}" stroke-width="7"/><rect x="780" y="600" width="400" height="220" fill="#8A6A4A" stroke="${INK}" stroke-width="7"/><path d="M880 470 h100 v90 h-100Z" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><text x="930" y="525" text-anchor="middle" font-size="26" font-weight="900" fill="${INK}">FLOUR</text>
   ${[0,1,2,3,4].map(i=>`<rect x="${1380+i*90}" y="${820-i*70}" width="420" height="70" fill="#8A6A4A" stroke="${INK}" stroke-width="6"/>`).join('')}${pickles(1640,640,.7,g,{blink:1})}
   <g opacity=".85">${glint({x:lerp(420,1100,k),y:520,s:.8,t:g,legs:'walk',mouth:'smile',blink:BL(g),tint:'#BFFFF0'})}</g>
   ${c30_yn(960,140,'NO',P.coral,pop(t,(p.home??6.2)+.5))}${c30_timer(tl,{x:400,y:140,s:.6,label:'UNTIL THE SCAN',g,col:oh?P.red:c30_AMB})}
   ${ov&&!oh?T(1300,320,'OVER AND OVER',{size:70,fill:P.white,sc:pop(t,p.over??11)}):''}`;
},
coScanner(t,d,p,g){
  const kn=AT(t,p.knock??2),dv=AT(t,p.voice??5),sw=AT(t,p.swings??9.5),lit=AT(t,p.screen??11.5),gr=AT(t,p.grabs??14);
  if(lit){const k=pop(t,p.screen??11.5);return `${c30_DEF}<rect width="1920" height="1080" fill="#0A1020"/><rect y="760" width="1920" height="320" fill="#141C30"/>
    ${c30_brainScan(820,450,1.05,g,{mode:'yes',k,lab:'LIVE SCAN'})}${c30_yn(820,800,'YES',P.mint,k)}
    ${person({x:1420,y:480,s:.9,t:g,who:'nan',pose:gr?'reach':'down',mouth:'o',brows:'raised',blink:BL(g),look:-1})}${person({x:1700,y:500,s:.9,t:g,who:'kai',mouth:'o',brows:'raised',blink:BL(g+1),look:-1})}
    ${T(960,120,'IT LIGHTS UP',{size:96,fill:c30_AMB,sc:k})}`;}
  return `${c30_DEF}<rect width="1920" height="1080" fill="#16263E"/><rect y="820" width="1920" height="260" fill="#0E1A2E"/>${c30_scanner(960,500,1,g,{knock:kn})}
   ${c30_clock(260,150,.7,'06:00')}
   ${kn&&!dv?[0,1].map(i=>T(560+i*800,260,'KNOCK!',{size:80,fill:P.gold,rot:i?8:-8,sc:.9+.1*Math.abs(Math.sin(g*12+i))})).join(''):''}
   ${dv?c30_bub(960,170,1180,'"GLINT, IF YOU CAN HEAR ME,','IMAGINE PLAYING TENNIS."',{tail:'center',sc:pop(t,p.voice??5),size:46}):''}
   ${sw?c30_inner(1560,600,.8*pop(t,p.swings??9.5),g,{pose:'flex',mouth:'teeth',brows:'angry',label:'EVERYTHING HE HAS'}):''}`;
},
coAnswers(t,d,p,g){
  const q1=p.q1??0,a1=p.a1??3,q2=p.q2??5,a2=p.a2??8.5,br=AT(t,p.breath??10.5);
  return `${c30_DEF}<rect width="1920" height="1080" fill="#0A1020"/>${c30_brainScan(1250,680,.6,g,{mode:AT(t,a2)?'no':AT(t,a1)?'yes':'none',k:1})}
   ${c30_qrow(900,250,'IS YOUR GRANDMOTHER CALLED NAN?',AT(t,a1)?'YES':'',IN(t,q1),{w:1100})}
   ${AT(t,q2)?`${c30_qrow(900,370,'KAI: DID YOU FALL BECAUSE OF ME?',AT(t,a2)?'NO':'',pop(t,q2),{w:1100})}`:''}
   ${AT(t,q2)?person({x:620,y:600,s:.75,t:g,who:'kai',pose:'hold',mouth:br?'smile':'o',brows:br?'calm':'sad',blink:BL(g),look:1}):''}
   ${br?`<g transform="translate(800,860) scale(${c30_f(pop(t,p.breath??10.5))})">${labelPill(0,0,'3 DAYS OF HOLDING HIS BREATH',P.gold,40)}</g>`:''}`;
},
coOseiQ(t,d,p,g){
  const Q=[['SOMETHING WE NEED TO KNOW?','YES',p.a0??4,p.q0??0],['IS IT ABOUT THE FALL?','YES',p.a1??6.5,p.q1??5],['WAS IT AN ACCIDENT?','NO',p.a2??9.5,p.q2??7.5],['THE MUSEUM? THE METEORITE?','YES',p.a3??17,p.q3??14],['IS THE METEORITE REAL?','NO',p.a4??20.5,p.q4??19]];
  const vis=Q.filter(q=>AT(t,q[3]));const last=vis.slice(-4);const clk=AT(t,p.clock??12);
  let rows='';last.forEach((q,i)=>{rows+=c30_qrow(860,290+i*135,q[0],AT(t,q[2])?q[1]:'…',pop(t,q[3]),{w:1060});});
  const cur=[...Q].reverse().find(q=>AT(t,q[2]));
  return `${c30_DEF}<rect width="1920" height="1080" fill="#0A1020"/>${person({x:1650,y:520,s:.8,t:g,who:'osei',pose:'point',mouth:Math.sin(g*8)>0?'o':'flat',brows:'raised',blink:BL(g),look:-1})}
   ${T(800,150,"DR. OSEI'S QUESTIONS",{size:70,fill:P.white,sc:IN(t,.2)})}${rows}
   ${c30_clock(1450,150,.7,clk?(AT(t,p.a3??17)?'06:46':'06:40'):'06:22',clk?P.red:c30_AMB)}
   ${cur?`<g transform="translate(1520,860)">${c30_yn(0,0,cur[1],cur[1]==='YES'?P.mint:P.coral,.8)}</g>`:''}`;
},
coPolice(t,d,p,g){
  const pc=AT(t,p.cars??3),op=AT(t,p.inside??6),rk=AT(t,p.real??8.5);const ok=prog(t,p.inside??6,(p.inside??6)+1.5);
  return `${c30_DEF}<rect width="1920" height="1080" fill="#141A2E"/><rect x="0" y="200" width="1920" height="520" fill="#1E2640"/>${[0,1,2,3].map(i=>`<rect x="${200+i*440}" y="260" width="320" height="460" fill="#2A3454" stroke="${INK}" stroke-width="6"/>${[0,1,2,3,4,5].map(j=>`<path d="M${200+i*440} ${300+j*70} H${520+i*440}" stroke="#1A2036" stroke-width="6"/>`).join('')}`).join('')}
   <rect y="720" width="1920" height="360" fill="#3A4060"/><path d="M0 720 H1920" stroke="${INK}" stroke-width="6"/>${t21_sign(960,150,'LOADING BAY',P.gold,g,50)}
   ${c30_crate(960,640,.9,{open:ok})}${rk?`<g transform="translate(960,${c30_f(520-ok*60)})">${c30_rock(0,0,.7*pop(t,p.real??8.5),g)}${T(0,-170,'THE REAL KESTREL',{size:60,fill:c30_AMB,sc:pop(t,p.real??8.5)})}</g>`:''}
   ${pc?`${c30_police(lerp(-300,330,eout(prog(t,p.cars??3,(p.cars??3)+1.5))),860,.9,g)}${c30_police(lerp(2200,1590,eout(prog(t,(p.cars??3)+.3,(p.cars??3)+1.8))),880,.9,g+1)}`:''}
   ${c30_clock(1620,150,.7,pc?'06:58':'06:52',P.red)}${!pc?T(760,320,'OSEI CALLS THE POLICE',{size:70,fill:P.white,sc:IN(t,.2)}):''}`;
},
coBoard(t,d,p,g){
  const bd=AT(t,p.board??3),pt=AT(t,p.points??6);const hi=pt?Math.floor((t-(p.points??6))*2.5)%26:-1;
  return `${c30_room(g,{night:0})}${!bd?`<g transform="translate(960,560) scale(2.2) translate(-860,-560)">${c30_bed(960,600,1,g,{eye:.25*(1+Math.sin(g*9))/2})}</g>${T(960,150,'4 DAYS LATER',{size:90,fill:c30_AMB,sc:IN(t,.2)})}${T(960,840,'HIS LEFT EYELID FLICKERS',{size:64,fill:P.white,sc:IN(t,1.5)})}`
   :`${c30_bed(700,760,.85,g,{eye:pt&&((g*2.5)%1)<.3?0:.8})}${c30_nurse(1500,500,.9,g,{pose:'point',look:-1})}${c30_alpha(1100,300,.8*pop(t,p.board??3),hi)}${T(1100,620,'THE BAUBY ALPHABET',{size:52,fill:P.gold,sc:IN(t,(p.board??3)+.5)})}`}`;
},
coNotebook(t,d,p,g){
  const sw=AT(t,p.swears??3),rd=AT(t,p.red??5.5),nj=AT(t,p.newjob??9.5),po=AT(t,p.porter??11),nb=AT(t,p.notebook??15),hl=AT(t,p.hale??18.5);
  if(nb){const k=pop(t,p.notebook??15);const rows=[['MON 09:00','NAN'],['MON 14:00','DR. OSEI'],['TUE 03:00','MR. HALE'],['WED 03:00','MR. HALE'],['THU 03:00','MR. HALE']];
    return `${c30_room(g,{night:0})}${c30_porter({x:360,y:560,s:.95,t:g,pose:'hold',mouth:'smile',blink:BL(g),look:1})}
    <g transform="translate(1100,540) rotate(-3) scale(${c30_f(k)})"><rect x="-380" y="-340" width="760" height="680" rx="16" fill="#F4F1EA" stroke="${INK}" stroke-width="10"/><path d="M-380 -250 H380" stroke="${P.red}" stroke-width="5"/>${T(0,-280,"KAI'S VISITOR LOG",{size:46,fill:INK,stroke:0})}
     ${rows.map((r,i)=>{const h=r[1]==='MR. HALE';return `<text x="-330" y="${-170+i*110}" font-size="46" font-weight="900" fill="${h&&hl?P.red:'#3A3A4A'}">${r[0]}</text><text x="60" y="${-170+i*110}" font-size="46" font-weight="900" fill="${h&&hl?P.red:'#3A3A4A'}">${r[1]}</text>${h&&hl?`<ellipse cx="190" cy="${-186+i*110}" rx="170" ry="44" fill="none" stroke="${P.red}" stroke-width="7"/>`:''}`;}).join('')}</g>`;}
  return `${c30_DEF}<rect width="1920" height="1080" fill="url(#c30corr)"/><rect y="780" width="1920" height="300" fill="#7A92A8"/><path d="M0 780 H1920" stroke="${INK}" stroke-width="6"/>
   ${c30_hale(1500,480,.9,g,{mouth:'flat',look:-1})}${sw?c30_bub(1450,170,700,'"I NEVER','CAME AT NIGHT."',{tail:'center',sc:pop(t,p.swears??3)}):''}
   ${po?c30_porter({x:560,y:500,s:1,t:g,pose:'hips',mouth:'grin',blink:BL(g),look:1}):person({x:560,y:500,s:1,t:g,who:'kai',mouth:rd?'o':'smile',blink:BL(g),look:1,sweat:rd?1:0})}
   ${rd&&!po?`<ellipse cx="510" cy="470" rx="22" ry="12" fill="${P.red}" opacity=".6"/><ellipse cx="610" cy="470" rx="22" ry="12" fill="${P.red}" opacity=".6"/>`:''}
   ${nj&&!po?T(760,320,'A NEW JOB…',{size:80,fill:P.white,sc:pop(t,p.newjob??9.5)}):''}${po?`<g transform="translate(760,250) scale(${c30_f(pop(t,p.porter??11))})">${labelPill(0,0,'NIGHT PORTER · THIS HOSPITAL',P.mint,44)}</g>`:''}`;
},
coIHear(t,d,p,g){
  const ask=AT(t,p.ask??2.5),b=p.blink??5.5,w=[p.w1??7.8,p.w2??8.4,p.w3??8.9,p.w4??9.5];
  const bl=AT(t,b)&&t<w[0]&&((t-b)%.7)<.2;
  return `${c30_room(g,{night:0})}<circle cx="760" cy="660" r="600" fill="url(#c30amb)" opacity=".3"/>${c30_bed(860,720,1.05,g,{eye:bl?0:AT(t,b)?1:.35,tear:prog(t,w[3],w[3]+1.5)})}
   ${person({x:380,y:500,s:.95,t:g,who:'nan',pose:'reach',mouth:AT(t,w[3])?'laugh':ask?'o':'smile',brows:AT(t,w[3])?'raised':'sad',blink:BL(g),look:1})}${c30_monitor(1640,330,.55,g)}
   ${ask&&!AT(t,w[0])?c30_bub(760,240,760,'"CAN YOU HEAR ME,','LOVE?"',{tail:'left',sc:pop(t,p.ask??2.5)}):''}
   ${AT(t,b)&&!AT(t,w[0])?T(1350,560,'BLINK.',{size:90,fill:c30_AMB,sc:.9+.1*Math.abs(Math.sin(g*6))}):''}
   ${['I','CAN','HEAR','YOU.'].map((x,i)=>AT(t,w[i])?T([520,720,1070,1420][i],230,x,{size:130,fill:i===3?c30_AMB:P.white,sc:pop(t,w[i])}):'').join('')}`;
},
coAsk(t,d,p,g){
  const q=AT(t,p.say??4);
  return `${c30_room(g,{dark:.3})}${c30_bed(900,760,.8,g)}${c30_inner(960,360,1.2,g,{pose:'shrug',mouth:q?'smile':'o',brows:'raised'})}
   ${T(960,140,'TRAPPED, BUT HEARING EVERYTHING',{size:70,fill:P.white,sc:IN(t,.2)})}
   ${q?`<g transform="translate(960,860) scale(${c30_f(pop(t,p.say??4))})">${labelPill(0,0,'WHAT WOULD YOU WANT TO HEAR?',c30_AMB,50)}</g>`:''}`;
},
});
