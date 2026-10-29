// ============================================================
//  Shot library. Each shot: (t local secs, d duration, p params, g global secs) -> svg
// ============================================================
const BL = g => ((g%3.7)>3.55)?1:0;                 // natural blink
const AT = (t,a)=> a!=null && t>=a;                  // after anchor
const IN = (t,a,dd=.35)=> a==null?1:pop(t,a,dd);     // pop-in at anchor
const card = (id,g)=>bgCard(id,g);
const labelPill=(x,y,str,col=P.mint,size=40)=>{const w=str.length*size*.62+60;return `<g transform="translate(${x},${y})"><rect x="${-w/2}" y="${-size*.85}" width="${w}" height="${size*1.5}" rx="${size*.75}" fill="${col}" stroke="${INK}" stroke-width="7"/><text y="${size*.32}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${INK}">${str}</text></g>`;};
const icon=(kind,x,y,s=1,op=1)=>{
  const k={
   chart:`<rect x="-80" y="-70" width="160" height="140" rx="14" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/><path d="M-60 -40 L-20 0 L10 -20 L60 40" stroke="${P.red}" stroke-width="12" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M60 40 l-30 2 m30 -2 l-4 -28" stroke="${P.red}" stroke-width="12" stroke-linecap="round"/>`,
   bolt:`<circle r="80" fill="#22305A" stroke="${INK}" stroke-width="7"/><path d="M10 -60 L-34 8 H0 L-12 62 L36 -8 H2Z" fill="${P.gold}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`,
   flag:`<circle r="80" fill="#3A1A2A" stroke="${INK}" stroke-width="7"/><path d="M-30 60 V-56" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M-30 -56 Q10 -76 46 -50 Q20 -30 46 -8 Q10 -24 -30 -10Z" fill="${P.red}" stroke="${INK}" stroke-width="6"/>`,
   closed:`<rect x="-90" y="-60" width="180" height="120" rx="12" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/><text y="16" text-anchor="middle" font-size="44" font-weight="900" fill="${P.red}">CLOSED</text>`,
   tv:`<rect x="-80" y="-60" width="160" height="110" rx="16" fill="#7A5A3A" stroke="${INK}" stroke-width="7"/><rect x="-60" y="-44" width="100" height="78" rx="10" fill="#9EC9C0" stroke="${INK}" stroke-width="5"/><path d="M-30 -60 L-50 -90 M30 -60 L50 -90" stroke="${INK}" stroke-width="6"/>`,
   rocket:`<path d="M0 -80 Q40 -40 30 40 H-30 Q-40 -40 0 -80Z" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/><circle cy="-20" r="16" fill="${P.iceDeep}" stroke="${INK}" stroke-width="5"/><path d="M-30 20 L-56 56 L-26 46 M30 20 L56 56 L26 46" fill="${P.red}" stroke="${INK}" stroke-width="6"/>`,
   pc:`<rect x="-80" y="-66" width="160" height="104" rx="10" fill="#2A3248" stroke="${INK}" stroke-width="7"/><rect x="-64" y="-52" width="128" height="76" rx="6" fill="${P.mint}" opacity=".6"/><path d="M-30 38 L-40 62 H40 L30 38" fill="#5D6A82" stroke="${INK}" stroke-width="6"/>`,
   id:`<rect x="-100" y="-64" width="200" height="128" rx="14" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/><circle cx="-50" cy="-6" r="26" fill="#C9C2B8"/><rect x="-10" y="-30" width="90" height="12" rx="6" fill="#C9C2B8"/><rect x="-10" y="-4" width="70" height="12" rx="6" fill="#C9C2B8"/>`,
   bank:`<path d="M-90 -30 L0 -80 L90 -30Z" fill="#FFF6EA" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-60 -20 V50 M-20 -20 V50 M20 -20 V50 M60 -20 V50" stroke="#FFF6EA" stroke-width="18"/><path d="M-60 -20 V50 M-20 -20 V50 M20 -20 V50 M60 -20 V50" stroke="${INK}" stroke-width="4"/><rect x="-96" y="50" width="192" height="22" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/>`,
   home:`<path d="M-80 0 L0 -70 L80 0 V70 H-80Z" fill="#FFF6EA" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-18" y="20" width="36" height="50" fill="#7A5A3A" stroke="${INK}" stroke-width="5"/>`,
   finger:`<circle r="80" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/>${[18,32,46,60].map(r=>`<path d="M${-r*.8} ${r*.5} A${r} ${r} 0 1 1 ${r*.8} ${r*.5}" stroke="#7E4E2E" stroke-width="6" fill="none"/>`).join('')}`,
   comment:`<path d="M-90 -60 H90 Q110 -60 110 -40 V30 Q110 50 90 50 H-20 L-60 86 L-50 50 H-90 Q-110 50 -110 30 V-40 Q-110 -60 -90 -60Z" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><circle cx="-40" cy="-6" r="10" fill="${INK}"/><circle cx="0" cy="-6" r="10" fill="${INK}"/><circle cx="40" cy="-6" r="10" fill="${INK}"/>`,
   bulb:`<circle cy="-20" r="60" fill="${P.gold}" stroke="${INK}" stroke-width="8"/><rect x="-26" y="34" width="52" height="40" rx="8" fill="#9AA7BD" stroke="${INK}" stroke-width="6"/><circle cy="-20" r="120" fill="url(#gGold)"/>`,
   check:`<circle r="70" fill="${P.mint}" stroke="${INK}" stroke-width="8"/><path d="M-32 0 L-8 26 L36 -26" stroke="${INK}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
   cross:`<circle r="70" fill="${P.red}" stroke="${INK}" stroke-width="8"/><path d="M-26 -26 L26 26 M26 -26 L-26 26" stroke="${INK}" stroke-width="14" stroke-linecap="round"/>`,
   hazard:`<circle r="90" fill="${P.gold}" stroke="${INK}" stroke-width="8"/>${[0,120,240].map(a=>`<path d="M0 -14 A40 40 0 0 1 34 -60 A70 70 0 0 0 -34 -60 A40 40 0 0 1 0 -14Z" fill="${INK}" transform="rotate(${a})"/>`).join('')}<circle r="16" fill="${INK}"/>`,
   rat:`<ellipse cx="0" cy="10" rx="80" ry="50" fill="#B8B8C8" stroke="${INK}" stroke-width="7"/><circle cx="70" cy="-10" r="34" fill="#B8B8C8" stroke="${INK}" stroke-width="7"/><circle cx="62" cy="-44" r="18" fill="#F4B6C2" stroke="${INK}" stroke-width="6"/><circle cx="84" cy="-14" r="6" fill="${INK}"/><path d="M-80 20 Q-140 40 -150 -10" stroke="#F4B6C2" stroke-width="8" fill="none" stroke-linecap="round"/>`
  }[kind];
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="${op}">${k}</g>`;
};
function kidney(x,y,s,glow=0,t=0,frozen=1){
  let dots=''; const r=rng(4); for(let i=0;i<26;i++){const a=r()*6.28,d=r()*80;dots+=`<circle cx="${Math.cos(a)*d}" cy="${Math.sin(a)*d*1.2}" r="6" fill="${P.gold}" opacity="${glow*(0.5+0.5*Math.sin(t*8+i))}"/>`;}
  return `<g transform="translate(${x},${y}) scale(${s})"><circle r="${180}" fill="url(#gWarm)" opacity="${glow*.6}"/>
   <path d="M-40 -120 C40 -150 120 -90 110 0 C100 100 30 150 -40 120 C-90 100 -100 60 -50 30 C-20 10 -20 -20 -50 -40 C-110 -70 -100 -110 -40 -120Z" fill="${frozen>.5?'#B9D9F0':'#C4506A'}" stroke="${INK}" stroke-width="9"/>
   ${frozen>.5?`<path d="M-10 -90 l20 10 M40 -40 l20 0 M20 40 l18 14" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`:''}${dots}</g>`;
}
function rings(x,y,t,on=1,col=P.mint){ let s=''; for(let i=0;i<4;i++){const k=((t*.8+i/4)%1);s+=`<circle cx="${x}" cy="${y}" r="${80+k*420}" fill="none" stroke="${col}" stroke-width="8" opacity="${on*(1-k)*.8}"/>`;} return s; }
function glintFrozen(x,y,s,t,o={}){ return glint({x,y,s,t,mouth:'flat',eyes:'closed',tint:'#CFEFFF',frost:.8,...o}); }
function particlesBody(x,y,s,t,n,col,op){ const r=rng(13);let d='';for(let i=0;i<n;i++){const px=(r()-.5)*170,py=-140+r()*430; d+=`<circle cx="${px}" cy="${py}" r="${5+r()*4}" fill="${col}" opacity="${op*(0.5+0.5*Math.sin(t*6+i))}"/>`;} return `<g transform="translate(${x},${y}) scale(${s})">${d}</g>`; }

const SHOTS = {
// ---------- HOOK ----------
hook(t,d,p,g){
  const f=prog(t,1.6,3.2);
  return `${bgNight(g)}
   ${glint({x:960,y:520,s:1.15,t:g,pose:f>0?'down':'wave',mouth:f>.3?'o':'grin',brows:f>.3?'raised':'calm',tint:f>.6?'#D8F2FF':null,frost:f,blink:BL(g),glint:f>.9?1:0})}
   ${f>0?iceBlock(960,560,420*eout(f)+1,720*eout(f)+1,0):''}
   <rect width="1920" height="1080" fill="${P.ice}" opacity="${.18*f}"/>
   ${T(960,190,'100 YEARS',{size:150*IN(t,3.4),fill:P.ice,op:prog(t,3.4,3.6)})}`;
},
yearSpin(t,d,p,g){
  const k=ease(prog(t,p.open??2.2,(p.open??2.2)+1.6)); const yr=Math.round(2026+(p.years??100)*k);
  return `${card('cardIce',g)}
   ${glint({x:480,y:560,s:.95,t:g,eyes:AT(t,p.open??2.2)?'open':'closed',mouth:AT(t,p.open??2.2)?'o':'smile',brows:AT(t,p.open??2.2)?'raised':'calm'})}
   ${T(1260,600,String(yr),{size:300,fill:k>=1?P.mint:P.white})}
   ${T(1260,330,k>=1?'YOU WAKE UP':'YOU FALL ASLEEP',{size:64,fill:P.ice})}`;
},
gonePeople(t,d,p,g){
  const f=prog(t,.6,2.2); let ex='';
  [[260,'#9AD1FF'],[560,'#FFB4A2'],[1360,'#C3B1FF'],[1660,'#FFD98E']].forEach(([x,h],i)=>ex+=`<g opacity="${1-f*.85}">${extra({x,y:560,s:.85,t:g+i,head:h})}</g>`);
  return `${bgNight(g)}${ex}${glint({x:960,y:540,s:1,t:g,look:Math.sin(g*1.5),mouth:'frown',brows:'sad',blink:BL(g)})}`;
},
museum(t,d,p,g){
  return `${card('cardDark',g)}<path d="M760 0 L560 1080 H1360 L1160 0Z" fill="#fff" opacity=".06"/>
   <rect x="760" y="700" width="400" height="300" fill="#2A2450" stroke="${INK}" stroke-width="10"/>
   <rect x="780" y="380" width="360" height="320" fill="url(#iceG)" opacity=".25" stroke="${INK}" stroke-width="8"/>
   <g transform="translate(960,${560+Math.sin(g*2)*6}) rotate(-8)"><rect x="-70" y="-130" width="140" height="260" rx="22" fill="${INK}"/><rect x="-60" y="-116" width="120" height="226" rx="12" fill="#2C6E8A"/><circle cy="118" r="8" fill="#444"/></g>
   ${labelPill(960,800,'SMARTPHONE · c. 2026',P.gold,34)}${T(960,180,'MUSEUM PIECE',{size:90,fill:P.gold,sc:IN(t,.2)})}`;
},
doctor(t,d,p,g){
  return `${bgRoom(g)}
   <rect x="300" y="640" width="760" height="70" rx="20" fill="#E8EEF8" stroke="${INK}" stroke-width="8"/><rect x="300" y="700" width="30" height="120" fill="#9AA7BD"/><rect x="1030" y="700" width="30" height="120" fill="#9AA7BD"/>
   <g transform="translate(520,610) rotate(-90)">${glint({s:.6,t:g,eyes:'open',mouth:'smile',tint:'#DDF2FF',scarf:false})}</g>
   ${extra({x:1300,y:540,s:1,t:g,head:'#FFFFFF',mask:true,pose:'point'})}
   ${bubble(1430,240,200,140,'?!',{size:90,tail:'left'})}
   <path d="M1380 380 q10 18 0 26 q-10 -8 0 -26Z" fill="${P.iceDeep}" stroke="${INK}" stroke-width="4"/>`;
},
talk(t,d,p,g){
  const bg={night:bgNight(g),lab:bgLab(g),room:bgRoom(g),future:bgFuture(g),ice:card('cardIce',g),mint:card('cardMint',g),dark:card('cardDark',g),warm:card('cardWarm',g)}[p.bg||'night'];
  const gx=p.text?560:960;
  return `${bg}${glint({x:gx,y:520,s:1.1,t:g,pose:p.pose||'down',mouth:p.mouth||'smile',brows:p.brows||'calm',look:p.look||0,blink:BL(g),glint:p.gl?Math.max(0,Math.sin(t*2)):0})}
   ${p.icon?icon(p.icon,gx+300,330,1*IN(t,p.iconAt??.3)):''}
   ${p.text?T(1320,p.text2?470:560,p.text,{size:p.size||110,fill:p.col||P.mint,sc:IN(t,p.textAt??.3)}):''}
   ${p.text2?T(1320,640,p.text2,{size:p.size||110,fill:p.col2||P.white,sc:IN(t,p.text2At??.8)}):''}`;
},
bigWord(t,d,p,g){
  const w=p.word; const n=w.length; let s='';
  const size=p.size||170, cw=size*.68, x0=960-(n-1)*cw/2;
  for(let i=0;i<n;i++){const k=pop(t,.05+i*.05);s+=T(x0+i*cw,600,w[i],{size,fill:p.col||P.ice,sc:k});}
  const sh=prog(t,.9,1.6);
  return `${card(p.card||'cardIce',g)}${s}${p.sub?T(960,780,p.sub,{size:56,fill:P.white,op:prog(t,.8,1.1)}):''}
   ${sh>0&&sh<1?`<rect x="${-400+sh*2700}" y="350" width="120" height="400" fill="#fff" opacity=".35" transform="skewX(-20)"/>`:''}`;
},
// ---------- FREEZER / CELLS ----------
freezer(t,d,p,g){
  const jump=prog(t,.6,1.4), fr=prog(t,1.2,p.die??2.5), dead=AT(t,p.die??2.5);
  const gy=lerp(560,470,Math.sin(jump*Math.PI))+jump*0, gx=lerp(560,980,eout(jump));
  return `${bgLab(g)}
   <rect x="760" y="250" width="440" height="600" rx="24" fill="#F2F6FA" stroke="${INK}" stroke-width="10"/>
   <rect x="790" y="280" width="380" height="540" rx="12" fill="#BFE3F2" stroke="${INK}" stroke-width="6"/>
   ${glint({x:gx,y:gy,s:.8,t:g,mouth:dead?'flat':(jump>0?'grin':'smile'),eyes:dead?'x':'open',tint:fr>.5?'#D8F2FF':null,frost:fr,shiver:fr>0&&!dead?1:0,blink:BL(g)})}
   <g transform="translate(1200,250) scale(${1-eout(prog(t,1.3,1.7))*0.95},1)"><rect x="-440" width="440" height="600" rx="24" fill="#F2F6FA" stroke="${INK}" stroke-width="10" opacity=".0"/></g>
   <rect x="790" y="280" width="380" height="540" rx="12" fill="url(#iceG)" opacity="${fr*.5}"/>
   ${dead?T(1500,560,'YOU DIE',{size:120,fill:P.red,sc:pop(t,p.die??2.5)}):''}`;
},
water(t,d,p,g){
  const lv=eout(prog(t,.3,1.8))*.6;
  return `${card('cardIce',g)}
   <g transform="translate(700,520) scale(1.25)"><clipPath id="wclip"><circle cx="0" cy="-60" r="92"/><rect x="-30" y="20" width="60" height="160"/><path d="M-80 30 H80 V170 H-80Z"/></clipPath>
     ${glint({t:g,mouth:'o',brows:'raised',scarf:false})}
     <g clip-path="url(#wclip)"><rect x="-200" y="${180-(330*lv)}" width="400" height="400" fill="${P.iceDeep}" opacity=".6"/></g></g>
   ${T(1350,560,Math.round(lv*100)+'%',{size:240,fill:P.iceDeep})}${T(1350,700,'WATER',{size:90,fill:P.white})}`;
},
crystals(t,d,p,g){
  const k=prog(t,.5,d-.5); let cells='', sh='';
  for(let i=0;i<3;i++)for(let j=0;j<2;j++){const x=480+i*480,y=340+j*400;cells+=cellShape(x,y,150,k*.6,0,g+i+j);}
  const r=rng(31); for(let i=0;i<46;i++){const x=r()*1920,y=r()*1080,a=r()*360,l=40+r()*220;const kk=prog(k,i/46*.7,i/46*.7+.3);if(kk>0)sh+=iceShard(x,y,l*kk,a,1);}
  return `${bgMicro(g)}${cells}${sh}${T(960,120,p.label||'ICE CRYSTALS',{size:80,fill:P.ice,op:prog(t,.3,.6)})}`;
},
cellsBurst(t,d,p,g){
  const s1=prog(t,.2,1.0), b=prog(t,1.3,2.0); let c='';
  [[560,540],[960,500],[1360,560]].forEach(([x,y],i)=>c+=cellShape(x,y,160,s1,b,g+i));
  return `${bgMicro(g)}${c}${T(960,180,b>0?'BURST!':'SHRIVEL',{size:110,fill:b>0?P.red:P.ice,sc:b>0?pop(t,1.3):pop(t,.2)})}`;
},
deadCold(t,d,p,g){
  return `${bgLab(g)}<ellipse cx="960" cy="830" rx="420" ry="40" fill="${P.iceDeep}" opacity=".35"/>
   <g transform="translate(960,700) rotate(-90)">${glint({s:.85,t:0,eyes:'x',mouth:'wavy',tint:'#D8F2FF',frost:1})}</g>
   ${T(960,250,'VERY COLD.',{size:100,fill:P.ice,sc:IN(t,.4)})}${T(960,380,'VERY DEAD.',{size:100,fill:P.red,sc:IN(t,1.6)})}`;
},
glassy(t,d,p,g){
  const k=prog(t,.4,1.6), sh=prog(t,1.4,2.4);
  return `${card('cardIce',g)}${glint({x:960,y:520,s:1.2,t:g,mouth:'o',brows:'raised',tint:k>.5?'#E6FAFF':null,blink:BL(g)})}
   <g opacity="${k*.55}"><circle cx="960" cy="448" r="112" fill="url(#iceG)"/><rect x="900" y="560" width="120" height="400" rx="40" fill="url(#iceG)"/></g>
   ${sh>0&&sh<1?`<rect x="${700+sh*560}" y="300" width="60" height="700" fill="#fff" opacity=".5" transform="skewX(-20)"/>`:''}
   ${T(960,170,'LIKE GLASS',{size:110,fill:P.white,sc:IN(t,1.2)})}`;
},
vessel(t,d,p,g,rev=false){
  const k=prog(t,.6,d-.6); const front=rev?2000-k*2200:-200+k*2200;
  let parts=''; for(let i=0;i<40;i++){const x=((i*53+g*260)%2100)-100,y=470+((i*37)%120);const blue=rev? x<front: x<front;
    parts+=`<ellipse cx="${x}" cy="${y}" rx="22" ry="14" fill="${(rev?!blue:blue)?P.iceDeep:P.red}" stroke="${INK}" stroke-width="4"/>`;}
  return `${bgMicro(g)}<rect x="-20" y="420" width="1960" height="220" fill="#5A1530" stroke="${INK}" stroke-width="10"/>${parts}
   <rect x="-20" y="420" width="1960" height="30" fill="#7A2040" opacity=".6"/>
   ${labelPill(960,260,p.label||'ANTIFREEZE IN',rev?P.red:P.iceDeep,52)}
   ${p.sub?T(960,830,p.sub,{size:70,fill:P.ice,op:prog(t,.6,1)}):''}`;
},
flush(t,d,p,g){ return SHOTS.vessel(t,d,{label:'WARM BLOOD IN',...p},g,true); },
molecules(t,d,p,g){
  const st=p.stop??3; const frozen=AT(t,st); const k=prog(t,st,st+.4);
  let m=''; for(let i=0;i<10;i++)for(let j=0;j<5;j++){const bx=330+i*140,by=320+j*120;const jx=frozen?0:Math.sin(g*30+i*3+j)*(26),jy=frozen?0:Math.cos(g*27+i+j*5)*(26);
    m+=`<g transform="translate(${bx+jx*(1-k)},${by+jy*(1-k)})"><circle r="26" fill="${frozen?P.ice:P.iceDeep}" stroke="${INK}" stroke-width="5"/><circle cx="-22" cy="-18" r="12" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="22" cy="-18" r="12" fill="#fff" stroke="${INK}" stroke-width="4"/></g>`;}
  return `${card('cardIce',g)}${m}${frozen?`<rect x="250" y="250" width="1420" height="620" rx="30" fill="url(#iceG)" opacity="${k*.35}" stroke="#fff" stroke-width="6"/>`:''}
   ${T(960,150,frozen?'LOCKED IN PLACE':'COOLED SUPER FAST',{size:90,fill:frozen?P.mint:P.white,sc:frozen?pop(t,st):1})}
   ${!frozen?[0,1,2,3].map(i=>`<path d="M${120} ${300+i*150} h${80+((g*400+i*90)%120)}" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".4"/>`).join(''):''}`;
},
vial(t,d,p,g){
  return `${bgLab(g)}<g transform="translate(960,560)"><circle r="300" fill="url(#gIce)" opacity=".5"/>
   <rect x="-80" y="-260" width="160" height="440" rx="60" fill="url(#iceG)" stroke="${INK}" stroke-width="10"/><rect x="-96" y="-300" width="192" height="70" rx="16" fill="${P.iceDeep}" stroke="${INK}" stroke-width="8"/>
   <circle cy="40" r="44" fill="#FFC9D6" stroke="${INK}" stroke-width="6"/><circle cx="-12" cy="30" r="14" fill="#F59AB0"/><circle cx="14" cy="50" r="12" fill="#F59AB0"/>
   ${labelPill(0,240,p.label||'FROZEN EMBRYO',P.ice,36)}</g>${T(960,150,p.title||'NOT SCIENCE FICTION',{size:90,fill:P.mint,sc:IN(t,.3)})}`;
},
babies(t,d,p,g){
  const baby=(x,lab,yr,k)=>`<g transform="translate(${x},560) scale(${k})"><circle r="170" fill="url(#gGold)" opacity=".5"/><circle cy="-40" r="110" fill="#FFE3C9" stroke="${INK}" stroke-width="9"/>
    <path d="M-20 -150 q20 -30 40 0" stroke="${INK}" stroke-width="7" fill="none"/><path d="M-40 -40 q8 -8 16 0 M24 -40 q8 -8 16 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-14 0 q14 12 28 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-120 70 Q0 30 120 70 L100 220 H-100Z" fill="#FFF6EA" stroke="${INK}" stroke-width="9"/>${labelPill(0,290,lab+' · '+yr,P.gold,38)}</g>`;
  return `${card('cardGold',g)}${baby(1220,'MOLLY','2020',pop(t,.3))}${p.emma!=null?baby(640,'EMMA','2017',pop(t,p.emma)):''}
   ${T(960,150,'FROZEN 27 YEARS',{size:100,fill:P.gold,sc:IN(t,.8)})}`;
},
// ---------- -196 ----------
thermo(t,d,p,g){
  const k=eout(prog(t,.2,2.2)); const v=Math.round(lerp(37,-196,k));
  return `${card('cardIce',g)}${thermometer(560,820,lerp(.85,.05,k))}
   ${T(1220,600,(v<0?'−':'')+Math.abs(v)+'°C',{size:230,fill:k>.95?P.ice:P.white})}
   ${T(1220,760,'LIQUID NITROGEN',{size:70,fill:P.mint,op:prog(t,p.ln??1.8,(p.ln??1.8)+.3)})}
   <g opacity="${k}">${iceShard(0,0,260,30)}${iceShard(1920,0,260,150)}${iceShard(0,1080,260,-30)}${iceShard(1920,1080,260,-150)}</g>`;
},
coldest(t,d,p,g){
  const k1=eout(prog(t,.3,1.2)),k2=eout(prog(t,1.0,2.2));
  return `${card('cardIce',g)}
   <rect x="520" y="300" width="300" height="${260*k1}" rx="16" fill="#9AD1FF" stroke="${INK}" stroke-width="8"/><rect x="1100" y="300" width="300" height="${520*k2}" rx="16" fill="${P.iceDeep}" stroke="${INK}" stroke-width="8"/>
   <path d="M420 300 H1500" stroke="#fff" stroke-width="6"/>
   ${T(670,260,'EARTH RECORD',{size:44,fill:P.white})}${T(670,300+260*k1+90,'−89°C',{size:80,fill:'#9AD1FF',op:k1})}
   ${T(1250,260,'YOU',{size:44,fill:P.mint})}${k2>.5?T(1250,770,'−196°C',{size:90,fill:INK,stroke:0}):''}`;
},
vitals(t,d,p,g){
  const row=(y,ico,lab,at)=>{const k=pop(t,at);return `<g opacity="${k>0?1:0}" transform="translate(0,${(1-Math.min(1,k))*30})">${ico}${T(820,y+26,lab,{size:66,anchor:'start',fill:P.white})}${icon('cross',1620,y,.7*k)}</g>`;};
  return `${card('cardDark',g)}
   ${row(220,`<text x="660" y="250" font-size="90" font-weight="900" fill="#9AD1FF" text-anchor="middle">Zz</text>`,'ASLEEP',.2)}
   ${row(420,`<rect x="600" y="380" width="120" height="80" rx="10" fill="#9AA7BD" stroke="${INK}" stroke-width="6"/>`,'IN A COMA',p.coma??1.5)}
   ${row(620,heart(660,630,.32,0),'HEARTBEAT',p.heart??3)}
   ${row(820,brain(660,830,.38,.1,g),'BRAIN ACTIVITY',p.brain??4.6)}`;
},
clocks(t,d,p,g){
  const slow=Math.max(0,1-prog(t,0,2.6)); const tt=g*slow+ (1-slow)*0;
  return `${card('cardDark',g)}${clockP(560,520,190,tt*(1+slow*3),slow<.02)}${clockP(1360,520,190,tt*(.4+slow),slow<.02)}
   ${T(960,900,'CHEMISTRY ≈ 0',{size:96,fill:P.ice,sc:IN(t,2.4)})}`;
},
noAge(t,d,p,g){
  const yrs=Math.round(100*eout(prog(t,p.pass??5.6,(p.pass??5.6)+4)));
  let pages=''; for(let i=0;i<6;i++){const k=((g*.9+i/6)%1);pages+=`<g transform="translate(${1500+k*300},${200+i*120-k*200}) rotate(${k*120})" opacity="${1-k}"><rect x="-60" y="-70" width="120" height="140" rx="10" fill="#FFF6EA" stroke="${INK}" stroke-width="5"/><rect x="-60" y="-70" width="120" height="34" fill="${P.red}"/></g>`;}
  return `${card('cardIce',g)}${pages}${iceBlock(700,560,460,760,0)}${glintFrozen(700,520,.95,g)}
   ${T(1280,380,'AGE',{size:70,fill:P.white})}${T(1280,560,'25',{size:220,fill:P.mint})}
   ${T(1280,760,'+'+yrs+' YEARS',{size:80,fill:P.ice,op:prog(t,p.pass??5.6,(p.pass??5.6)+.4)})}
   ${T(700,140,"YOU DON'T AGE",{size:100,fill:P.mint,sc:IN(t,p.dont??2)})}`;
},
dewarIn(t,d,p,g){
  return `${bgLab(g)}${dewar(820,560,1.1,g,{inside:true,label:'DEWAR'})}
   ${AT(t,p.brain??3.9)?`<path d="M1060 500 H1260" stroke="${P.gold}" stroke-width="12" stroke-linecap="round"/><path d="M1060 500 l30 -22 m-30 22 l30 22" stroke="${P.gold}" stroke-width="12" stroke-linecap="round"/>${labelPill(1440,500,'HEAD DOWN',P.gold,46)}`:''}
   ${T(820,110,'UPSIDE DOWN',{size:90,fill:P.white,sc:IN(t,.4)})}`;
},
wait(t,d,p,g){
  const dots='.'.repeat(1+Math.floor(g*2)%3);
  return `${bgLab(g)}<rect width="1920" height="1080" fill="#000" opacity=".35"/>${dewar(960,600,1,g,{inside:true})}${T(960,150,'WAITING'+dots,{size:90,fill:P.ice})}`;
},
refill(t,d,p,g){
  const lv=.3+.7*Math.abs(((g*.25)%2)-1);
  return `${bgLab(g)}${dewar(760,600,1,g,{level:lv})}
   ${extra({x:1300,y:560,s:.95,t:g,head:'#FFD98E',pose:'hold'})}
   <path d="M1330 660 Q1200 500 980 260" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M1330 660 Q1200 500 980 260" stroke="#5D6A82" stroke-width="12" fill="none" stroke-linecap="round"/>
   ${T(960,140,p.title||'TOP UP · AGAIN & AGAIN',{size:80,fill:P.ice,sc:IN(t,.3)})}`;
},
century(t,d,p,g){
  const yr=Math.round(2026+100*prog(t,0,d)); const ic=[['chart','RECESSIONS',p.a],['bolt','POWER CUTS',p.b],['flag','WARS',p.c],['closed','BANKRUPT',p.e]];
  return `${card('cardDark',g)}${T(960,330,String(yr),{size:200,fill:P.white})}
   ${ic.map(([k,l,a],i)=>a!=null&&t>=a?`<g>${icon(k,330+i*420,640,pop(t,a))}${T(330+i*420,830,l,{size:48,fill:P.gold,op:prog(t,a,a+.3)})}</g>`:'').join('')}`;
},
cemetery(t,d,p,g){
  let stones=''; [300,560,1360,1620].forEach((x,i)=>stones+=`<path d="M${x-70} 880 V700 Q${x} 620 ${x+70} 700 V880Z" fill="#3B3560" stroke="${INK}" stroke-width="8"/>`);
  return `${bgNight(g)}${stones}<rect x="760" y="560" width="400" height="330" fill="#2A2450" stroke="${INK}" stroke-width="10"/><path d="M730 560 L960 430 L1190 560Z" fill="#3B3560" stroke="${INK}" stroke-width="10"/>
   <rect x="900" y="700" width="120" height="190" fill="#120B22" stroke="${INK}" stroke-width="8"/>${labelPill(960,200,'CALIFORNIA · 1970s',P.gold,50)}
   ${AT(t,p.money??3)?T(960,360,'OUT OF MONEY',{size:90,fill:P.red,sc:pop(t,p.money??3)}):''}`;
},
tanksWarn(t,d,p,g){
  const lv=Math.max(.05,1-prog(t,0,2.5));
  return `${bgLab(g)}<rect width="1920" height="1080" fill="${P.red}" opacity="${.08+.06*Math.sin(g*6)}"/>${tankRow(500,640,.75,4,g,{level:lv,warn:1,fog:.2*lv})}
   ${AT(t,p.thaw??2)?T(960,170,'THAWED',{size:120,fill:P.red,sc:pop(t,p.thaw??2)}):''}
   ${AT(t,p.bill??6)?`${paper(1500,560,.9*pop(t,p.bill??6),4,'INVOICE',8)}${stamp(1500,600,.7*pop(t,(p.bill??6)+.3),'PAST DUE')}`:''}`;
},
lucky(t,d,p,g){
  const yr=Math.round(100*eout(prog(t,1.4,d-.3)));
  return `${bgLab(g)}${dewar(700,600,1,g,{inside:true,level:1})}${T(1320,560,yr+' YEARS',{size:140,fill:P.mint})}${yr>=100?icon('check',1320,760,pop(t,d-.3)):''}`;
},
rewarmBad(t,d,p,g){
  const u=p.uneven??6.9; const two=AT(t,u);
  const sh=prog(t,.5,4); let s=''; const r=rng(8);for(let i=0;i<14;i++)s+=iceShard(260+r()*480,300+r()*480,90*prog(sh,i/14*.6,i/14*.6+.4),r()*360);
  const cr=prog(t,u+2.5,u+3.2);
  return `${card('cardWarm',g)}<rect x="120" y="180" width="760" height="720" rx="30" fill="#000" opacity=".25" stroke="#fff3" stroke-width="4"/>${s}
   ${T(500,140,'TOO SLOW',{size:70,fill:P.ice})}${T(500,860,'→ ICE AGAIN',{size:56,fill:P.white,op:prog(t,1,1.4)})}
   ${two?`<rect x="1040" y="180" width="760" height="720" rx="30" fill="#000" opacity=".25" stroke="#fff3" stroke-width="4"/>${T(1420,140,'UNEVEN',{size:70,fill:P.warm})}
     <g transform="translate(1420,540)">${glint({s:.85,t:g,mouth:cr>0?'o':'flat',tint:'#D8F2FF',frost:.7})}${cr>0?`<path d="M-30 -150 l30 60 l-40 50 l40 60 l-20 80 l30 70" stroke="${INK}" stroke-width="10" fill="none" stroke-linejoin="round"/>`:''}</g>
     ${cr>0?T(1420,860,'CRACK!',{size:90,fill:P.red,sc:pop(t,u+2.5)}):''}`:''}`;
},
iceCube(t,d,p,g){
  const fall=eout(prog(t,.2,.9)), cr=prog(t,.9,1.5);
  let bub='';for(let i=0;i<10;i++){const k=((g*.7+i/10)%1);bub+=`<circle cx="${880+((i*47)%160)}" cy="${840-k*300}" r="${6+i%3*3}" fill="#fff" opacity="${.5*(1-k)}"/>`;}
  return `${card('cardWarm',g)}<path d="M720 420 L780 900 H1140 L1200 420Z" fill="#FFB36B" opacity=".55" stroke="${INK}" stroke-width="10"/>${bub}
   <path d="M700 420 H1220" stroke="${INK}" stroke-width="10"/>
   <g transform="translate(960,${lerp(100,560,fall)}) rotate(${fall*18})">${iceBlock(0,0,200,200,cr)}${cr>0?`<path d="M-20 -100 l20 60 l-30 40 l40 100" stroke="${INK}" stroke-width="8" fill="none"/>`:''}</g>
   ${cr>0?T(1500,400,'CRACK',{size:110,fill:P.ice,sc:pop(t,.9)}):''}`;
},
kidneyLab(t,d,p,g){
  const rw=p.rew??7.7, wk=p.work??16.2; const glow=prog(t,rw,rw+1.5);
  return `${bgLab(g)}${rings(720,520,g,glow)}${kidney(720,520,1.2,glow,g,glow>.6?0:1)}
   ${labelPill(720,860,glow>.6?'REWARMED':'VITRIFIED · 100 DAYS',glow>.6?P.warm:P.ice,44)}
   ${T(720,150,'UNIVERSITY OF MINNESOTA · 2023',{size:56,fill:P.white,op:prog(t,.2,.5)})}
   ${AT(t,rw+1.2)?`${T(1420,330,'IRON',{size:80,fill:P.gold,sc:pop(t,rw+1.2)})}${T(1420,430,'NANOPARTICLES',{size:64,fill:P.gold,sc:pop(t,rw+1.4)})}`:''}
   ${AT(t,wk)?`${icon('rat',1380,700,1.2*pop(t,wk))}${icon('check',1620,620,pop(t,wk+.6))}`:''}`;
},
nanoBody(t,d,p,g){
  const fld=p.field??4.9, ev=p.every??8.3; const on=prog(t,fld,fld+.5), warm=prog(t,ev,ev+2);
  return `${card('cardDark',g)}${rings(960,520,g,on,P.gold)}
   ${glint({x:960,y:500,s:1.2,t:g,eyes:warm>.7?'open':'closed',mouth:warm>.7?'o':'flat',tint:warm>.5?null:'#CFEFFF',frost:1-warm})}
   ${particlesBody(960,500,1.2,g,60,P.gold,prog(t,.3,1.4))}
   <circle cx="960" cy="560" r="420" fill="url(#gWarm)" opacity="${warm*.5}"/>
   ${T(960,140,warm>0?'WARMING… EVENLY':'NANOPARTICLES',{size:84,fill:warm>0?P.warm:P.gold})}`;
},
heartShock(t,d,p,g){
  const t1=p.t1??2.6,t2=p.t2??3.6,al=p.alive??4.6;
  const beat=Math.max(Math.max(0,1-Math.abs(t-t1)*4),Math.max(0,1-Math.abs(t-t2)*4), AT(t,al)?Math.max(0,Math.sin(g*7)):0);
  const zap=t>1.6&&t<2.4;
  return `${card(AT(t,al)?'cardMint':'cardDark',g)}${zap?`<rect width="1920" height="1080" fill="#fff" opacity="${.5*Math.abs(Math.sin(g*40))}"/>`:''}
   ${heart(960,500,1.2,beat)}${AT(t,al)?ecg(160,900,1600,g,'beat'):ecg(160,900,1600,g,'flat')}
   ${AT(t,t1)&&t<t2+.6?T(960,180,'THUMP',{size:160,fill:P.white,sc:pop(t,t>=t2?t2:t1,.2)}):''}
   ${AT(t,al)?T(960,180,"YOU'RE ALIVE",{size:140,fill:P.mint,sc:pop(t,al)}):''}`;
},
shiver(t,d,p,g){
  let puffs='';for(let i=0;i<3;i++){const k=((g*.8+i/3)%1);puffs+=`<circle cx="${1060+k*120}" cy="${380-k*60}" r="${20+k*40}" fill="#fff" opacity="${.4*(1-k)}"/>`;}
  return `${bgRoom(g)}<path d="M760 620 Q960 560 1160 620 L1190 900 H730Z" fill="#7C5CFF" stroke="${INK}" stroke-width="10"/>
   ${glint({x:960,y:520,s:1.05,t:g,pose:'cross',mouth:'teeth',brows:'sad',tint:'#E2F4FF',shiver:1,blink:BL(g)})}
   <path d="M760 640 Q960 600 1160 640 L1180 900 H740Z" fill="#7C5CFF" stroke="${INK}" stroke-width="10"/>${puffs}
   ${T(960,140,p.title||'SO. COLD.',{size:110,fill:P.ice,sc:IN(t,.3)})}`;
},
astro(t,d,p,g){
  const lg=p.legs??10;
  const helmet=`<circle cx="0" cy="-55" r="96" fill="#FFFFFF" stroke="${INK}" stroke-width="9"/><rect x="-62" y="-100" width="124" height="80" rx="36" fill="#2C3E70" stroke="${INK}" stroke-width="7"/>`;
  return `${card('cardDark',g)}
   <g transform="rotate(${Math.sin(g*3)*6},520,820)">${extra({x:520,y:540,s:1,t:g,head:'#FFFFFF',hair:helmet})}</g>
   ${labelPill(520,880,'6 MONTHS IN SPACE',P.ice,38)}${T(520,180,'WEAK',{size:90,fill:P.ice,op:prog(t,1,1.3)})}
   ${AT(t,lg)?`${glint({x:1400,y:540,s:1,t:g,pose:'flex',mouth:'grin',blink:BL(g),glint:Math.max(0,Math.sin(t*3))})}${labelPill(1400,880,'100 YEARS FROZEN',P.mint,38)}${T(1400,180,'STRONG',{size:90,fill:P.mint,sc:pop(t,lg)})}`:''}`;
},
brainDim(t,d,p,g){
  const dim=prog(t,.6,2.6); const m=p.mem??6.6; let q='';
  if(AT(t,m))for(let i=0;i<5;i++){const k=((g*.4+i/5)%1);q+=T(560+i*200,700-k*500,'?',{size:90,fill:P.gold,op:1-k});}
  return `${card('cardDark',g)}${brain(960,520,1.5,1,g,dim)}${q}${T(960,880,'SOME NEURONS DIDN\'T MAKE IT',{size:60,fill:P.white,op:prog(t,2,2.4)})}`;
},
confused(t,d,p,g){
  let q='';for(let i=0;i<3;i++)q+=T(780+i*170,300+Math.sin(g*3+i)*20,'?',{size:110,fill:P.gold,sc:pop(t,.3+i*.3)});
  return `${bgRoom(g)}${glint({x:960,y:540,s:1.05,t:g,look:Math.sin(g*1.8),mouth:'wavy',brows:'raised',blink:BL(g)})}${q}${T(960,870,'WHERE AM I?',{size:80,fill:P.white,op:prog(t,.6,.9)})}`;
},
nurse(t,d,p,g){
  const w=eout(prog(t,0,1.5));
  return `${bgRoom(g)}${glint({x:600,y:540,s:1,t:g,look:1,mouth:'o',brows:'raised',blink:BL(g)})}
   ${extra({x:lerp(2100,1360,w),y:540,s:1,t:g,head:'#FFE3C9',mask:AT(t,p.mask??2)})}
   ${AT(t,p.mask??2)?labelPill(1360,170,'MASK ON',P.ice,48):''}`;
},
hazard(t,d,p,g){
  let v='';[[300,300],[1620,320],[260,800],[1660,780]].forEach(([x,y],i)=>v+=virus(x,y,60,g+i));
  return `${card('cardWarm',g)}<circle cx="960" cy="520" r="360" fill="url(#gGold)" opacity="${.4+.2*Math.sin(g*4)}"/>${v}
   ${glint({x:960,y:520,s:1.05,t:g,mouth:'frown',brows:'sad',blink:BL(g)})}${icon('hazard',1260,260,pop(t,.3))}${T(960,880,'WALKING BIOHAZARD',{size:90,fill:P.gold,sc:IN(t,.5)})}`;
},
viruses(t,d,p,g){
  const k=eout(prog(t,.3,d)); let v='';
  for(let i=0;i<6;i++){const a=i/6*6.283+.4;const r=lerp(760,330,k);v+=virus(960+Math.cos(a)*r,540+Math.sin(a)*r*.7,62,g+i,{badge:p.badge||'2126',col:p.col||'#9BE15D'});}
  return `${card('cardDark',g)}${v}${glint({x:960,y:500,s:.9,t:g,mouth:'o',brows:'sad',sweat:1,look:Math.sin(g*2),blink:BL(g)})}
   ${T(960,140,p.title||'NEVER MET THESE',{size:90,fill:P.red,sc:IN(t,.3)})}`;
},
icu(t,d,p,g){
  return `${bgRoom(g)}<rect x="380" y="640" width="760" height="70" rx="20" fill="#E8EEF8" stroke="${INK}" stroke-width="8"/>
   <g transform="translate(600,610) rotate(-90)">${glint({s:.6,t:g,eyes:'closed',mouth:'frown',scarf:false})}</g>
   <rect x="1260" y="300" width="300" height="220" rx="16" fill="#0B1026" stroke="${INK}" stroke-width="8"/>${ecg(1280,420,260,g,'beat')}
   ${labelPill(1410,600,'INTENSIVE CARE',P.red,40)}${T(960,150,'JUST A FLU',{size:90,fill:P.white,sc:IN(t,.3)})}`;
},
jar(t,d,p,g){
  let v='';[[860,560],[1060,520],[960,700]].forEach(([x,y],i)=>v+=virus(x,y,56,g+i,{badge:'2026',col:'#C8B07A',angry:false}));
  return `${card('cardGold',g)}<rect x="700" y="300" width="520" height="560" rx="60" fill="url(#iceG)" opacity=".3" stroke="${INK}" stroke-width="10"/>${v}
   <rect x="680" y="260" width="560" height="70" rx="18" fill="#7A5A3A" stroke="${INK}" stroke-width="8"/>${labelPill(960,880,'100-YEAR-OLD GERMS',P.gold,44)}`;
},
quarantine(t,d,p,g){
  let st='';for(let i=0;i<5;i++){const at=.6+i*.9;if(t>=at)st+=`<g transform="translate(${820+((i*97)%280)},${430+((i*61)%380)}) rotate(${(i*37)%90-45}) scale(${pop(t,at)})"><rect x="-40" y="-14" width="80" height="28" rx="12" fill="#F2C9A0" stroke="${INK}" stroke-width="4"/><rect x="-12" y="-14" width="24" height="28" fill="#E0B08A"/></g>`;}
  return `${bgRoom(g)}${glint({x:960,y:540,s:.95,t:g,mouth:'flat',brows:'sad',blink:BL(g)})}${st}
   <path d="M600 900 Q600 140 960 140 Q1320 140 1320 900Z" fill="url(#iceG)" opacity=".28" stroke="#fff" stroke-width="8"/>
   ${labelPill(960,100,'QUARANTINE · WEEKS',P.mint,46)}`;
},
doorOpen(t,d,p,g){ const o=eout(prog(t,.4,2)); return `${card('cardDark',g)}${door(960,600,1.3,o)}${glint({x:960,y:620,s:.7*(1-o*.3),t:g,dir:1,mouth:'o',blink:BL(g)})}<rect width="1920" height="1080" fill="#fff" opacity="${o*.35}"/>`; },
futureReveal(t,d,p,g){
  return `${bgFuture(g,t*20)}${glint({x:960,y:700,s:.75,t:g,mouth:'o',brows:'raised',look:Math.sin(g*.8),blink:BL(g),glint:Math.max(0,Math.sin(t*1.5))})}
   ${T(960,150,'2126',{size:150,fill:P.mint,sc:IN(t,.3)})}${p.sub?T(960,280,p.sub,{size:60,fill:P.white,op:prog(t,1,1.4)}):''}`;
},
popGraph(t,d,p,g){
  const k=eout(prog(t,.3,d*.8)); const pts=[[0,8.2],[.3,9.4],[.55,10.3],[.75,10.2],[1,9.6]];
  let path='';const X=v=>260+v*1400, Y=v=>860-(v-7)*170; const n=60;
  for(let i=0;i<=n*k;i++){const u=i/n;let v; for(let j=0;j<pts.length-1;j++){if(u>=pts[j][0]&&u<=pts[j+1][0]){const q=(u-pts[j][0])/(pts[j+1][0]-pts[j][0]);v=lerp(pts[j][1],pts[j+1][1],(1-Math.cos(q*Math.PI))/2);}} path+=(i?'L':'M')+X(u)+' '+Y(v);}
  return `${card('cardDark',g)}<path d="M260 860 H1680 M260 860 V300" stroke="#fff5" stroke-width="5"/>
   <path d="${path}" stroke="${P.mint}" stroke-width="12" fill="none" stroke-linecap="round"/>
   ${T(330,910,'2026',{size:44,fill:P.white})}${T(1030,910,'2080s',{size:44,fill:P.gold})}${T(1660,910,'2126',{size:44,fill:P.white})}
   ${k>.55?labelPill(1030,250,'PEAK ~10.3 BILLION',P.gold,44):''}${T(960,140,'FEWER PEOPLE?',{size:90,fill:P.white,sc:IN(t,.2)})}`;
},
seaWall(t,d,p,g){
  const rise=eout(prog(t,.3,3)); const wv=Math.sin(g*2)*14;
  return `${bgNight(g)}<rect x="0" y="${900-rise*160+wv}" width="1920" height="400" fill="#1C5D8A" opacity=".85"/>
   <path d="M0 ${900-rise*160+wv} ${[...Array(20)].map((_,i)=>`q48 ${i%2?20:-20} 96 0`).join(' ')}" stroke="#9AD1FF" stroke-width="8" fill="none"/>
   <rect x="880" y="560" width="160" height="440" fill="#5D6A82" stroke="${INK}" stroke-width="10"/>${T(960,150,'SEA WALLS',{size:100,fill:P.ice,sc:IN(t,.3)})}`;
},
slang(t,d,p,g){
  const b=p.bees??9; const laugh=AT(t,b+1.6);
  return `${bgFuture(g)}${extra({x:420,y:560,s:.9,t:g,head:'#FF6BD6',mouth:laugh?'laugh':'flat'})}${extra({x:1500,y:560,s:.9,t:g+1,head:'#6BE4FF',mouth:laugh?'laugh':'flat'})}
   ${bubble(480,210,300,130,'zorbly?',{size:56})}${bubble(1440,230,320,130,'mega-flux!',{size:52,tail:'right'})}
   ${glint({x:960,y:560,s:.95,t:g,mouth:AT(t,b)?'grin':'o',brows:'raised',blink:BL(g)})}
   ${AT(t,b)?bubble(960,190,560,140,"the bee's knees!",{size:58,fill:P.gold}):''}${laugh?T(960,960,'HA HA HA',{size:80,fill:'#FF6BD6',sc:pop(t,b+1.6)}):''}`;
},
then1926(t,d,p,g){
  const row=[['tv',p.tv??3.1],['rocket',p.space??7.5],['pc',p.pc??9.9]];
  return `${card('cardGold',g)}${T(960,200,'100 YEARS AGO',{size:96,fill:P.gold,sc:IN(t,.2)})}
   ${row.map(([k,a],i)=>AT(t,a)?`${icon(k,520+i*440,560,1.6*pop(t,a))}${icon('cross',640+i*440,680,.7*pop(t,a+.3))}`:'').join('')}`;
},
holo(t,d,p,g){
  let h='';for(let i=0;i<4;i++){const x=420+i*360,y=320+Math.sin(g*1.5+i)*30;h+=`<g transform="translate(${x},${y}) rotate(${g*30+i*40})" opacity=".8"><path d="M0 -70 L60 35 L-60 35Z" fill="none" stroke="${P.mint}" stroke-width="8"/><circle r="26" fill="${P.mint}" opacity=".4"/></g>`;}
  return `${bgFuture(g)}${h}${glint({x:960,y:700,s:.8,t:g,mouth:'wavy',brows:'raised',look:Math.sin(g),blink:BL(g)})}${T(960,880,'???',{size:90,fill:P.white})}`;
},
paperwork(t,d,p,g){
  const items=[['id','NO IDENTITY',p.id],['bank','NO BANK ACCOUNT',p.bank],['home','NO HOME',p.home]];
  return `${card('cardDark',g)}${paper(520,540,1.4,5,'DEATH CERT.',-4)}${AT(t,p.dead??2)?stamp(520,560,1*pop(t,p.dead??2,.25),'DECEASED'):''}
   ${items.map(([k,l,a],i)=>a!=null&&AT(t,a)?`${icon(k,1100,330+i*220,.9*pop(t,a))}${T(1220,350+i*220,l,{size:58,anchor:'start',fill:P.white,op:prog(t,a,a+.3)})}`:'').join('')}`;
},
money(t,d,p,g){
  const c=p.comp??8.6; const k=prog(t,c,c+5); const P0=p.p0??10000, R=p.rate??0.07, Y=p.years??100; const val=P0*Math.pow(1+R,Y*k);
  const fmt= val>=1e12?'$'+Math.round(val/1e12).toLocaleString('en-US')+' TRILLION': val>=1e9?'$'+(val/1e9).toFixed(1)+' BILLION': val>=1e7?'$'+(val/1e6).toFixed(1)+' MILLION':'$'+Math.round(val).toLocaleString('en-US');
  return `${card('cardGold',g)}${coinStack(520,860,Math.round(3+k*22),1.1)}
   ${T(1240,520,fmt,{size:150,fill:k>=1?P.gold:P.white})}
   ${T(1240,680,Math.round(R*100)+'% A YEAR · YEAR '+Math.round(Y*k),{size:56,fill:P.white,op:prog(t,.5,.9)})}
   ${T(960,150,'THE TWIST',{size:90,fill:P.mint,sc:IN(t,.2)})}`;
},
prices(t,d,p,g){
  const k=eout(prog(t,.2,2)); const v=Math.round(lerp(6,115,k));
  return `${card('cardWarm',g)}<g transform="translate(760,540) rotate(-12)"><path d="M-200 -120 H160 L260 0 L160 120 H-200Z" fill="#FFF6EA" stroke="${INK}" stroke-width="10"/><circle cx="170" r="20" fill="none" stroke="${INK}" stroke-width="8"/>
   <text x="-20" y="40" text-anchor="middle" font-size="130" font-weight="900" fill="${INK}">$${v}</text></g>
   ${T(1460,520,'BURGER',{size:70,fill:P.white})}${T(1460,640,'2126',{size:70,fill:P.warm})}${T(960,150,'PRICES GO UP',{size:96,fill:P.warm,sc:IN(t,.2)})}`;
},
lawyer(t,d,p,g){
  const fp=p.fp??5.9;
  return `${bgRoom(g)}${extra({x:1300,y:560,s:1,t:g,head:'#FFD3A8',tie:true,pose:'hold',look:-1})}
   ${frame(1180,520,.55,`<g transform="translate(0,40) scale(.55)" opacity=".75">${glint({t:0,mouth:'flat',scarf:true})}</g><rect x="-160" y="-200" width="320" height="400" fill="#B08850" opacity=".35"/>`,6)}
   ${glint({x:560,y:540,s:1,t:g,mouth:'smile',blink:BL(g)})}${bubble(1380,170,340,130,'IS THIS YOU?',{size:48,tail:'left'})}
   ${AT(t,fp)?`${icon('finger',760,250,pop(t,fp))}${icon('check',870,330,.6*pop(t,fp+.4))}`:''}`;
},
ghostRich(t,d,p,g){
  let bills='';for(let i=0;i<14;i++){const k=((g*.35+i/14)%1);bills+=`<g transform="translate(${(i*137)%1920},${-80+k*1200}) rotate(${Math.sin(g+i)*40})"><rect x="-60" y="-30" width="120" height="60" rx="8" fill="#7BD88F" stroke="${INK}" stroke-width="5"/><text y="14" text-anchor="middle" font-size="36" font-weight="900" fill="${INK}">$</text></g>`;}
  return `${card('cardGold',g)}${bills}<g opacity=".55">${glint({x:960,y:540,s:1.15,t:g,mouth:'grin',brows:'raised',tint:'#E8E0FF',blink:BL(g)})}</g>
   ${T(560,200,'GHOST',{size:100,fill:'#E8E0FF',sc:IN(t,p.ghost??1.4)})}${AT(t,p.rich??3.4)?T(1360,200,'MILLIONAIRE',{size:100,fill:P.gold,sc:pop(t,p.rich??3.4)}):''}`;
},
walk(t,d,p,g){
  return `${bgNight(g,t*80)}${glint({x:960,y:540,s:1,t:g,legs:'walk',mouth:'flat',brows:'sad',look:.4,blink:BL(g)})}`;
},
chairs(t,d,p,g){
  const a=p.a??1.3,b=p.b??3.6; let ch='';
  [[560,'#9AD1FF',a],[820,'#FFB4A2',a],[1100,'#C3B1FF',b],[1360,'#FFD98E',b]].forEach(([x,h,at])=>{const f=prog(t,at,at+1);
    ch+=`<g opacity="${1-f}">${extra({x,y:500,s:.75,t:g+x,head:h})}</g><rect x="${x-60}" y="640" width="120" height="20" fill="#7A5A3A" stroke="${INK}" stroke-width="5"/><path d="M${x-50} 660 V820 M${x+50} 660 V820 M${x-60} 640 V500" stroke="${INK}" stroke-width="10"/>`;});
  return `${bgRoom(g)}<rect x="400" y="720" width="1120" height="40" rx="10" fill="#9A6A40" stroke="${INK}" stroke-width="8"/>${ch}
   ${AT(t,a)?T(700,200,'GONE',{size:90,fill:P.white,op:prog(t,a,a+.3)}):''}${AT(t,b)?T(1230,200,'GONE',{size:90,fill:P.white,op:prog(t,b,b+.3)}):''}`;
},
lifetimes(t,d,p,g){
  const k=prog(t,.3,d-1); const hair=`<path d="M-70 -110 Q0 -170 70 -110" stroke="#ddd" stroke-width="22" fill="none"/>`;
  return `${card('cardDark',g)}${[0,1,2].map(i=>{const kk=prog(k,i*.25,i*.25+.5);return `<g opacity="${1-prog(k,.75,1)}">${extra({x:520+i*440,y:520,s:lerp(.6,1,Math.min(1,kk*2)),t:g+i,head:lerp(0,1,kk)>.6?'#E8E8E8':'#FFD3A8',hair:kk>.6?hair:''})}</g>`;}).join('')}
   ${dewar(1720,700,.45,g,{inside:true})}${T(960,150,'ENTIRE LIVES',{size:90,fill:P.white,sc:IN(t,.3)})}`;
},
grandchild(t,d,p,g){
  return `${bgFuture(g)}${glint({x:640,y:560,s:1,t:g,look:1,mouth:'smile',brows:'sad',blink:BL(g)})}
   ${extra({x:1280,y:620,s:.8,t:g,head:'#FFF0DE',glasses:true,look:-1})}
   ${AT(t,p.eyes??2.6)?labelPill(1280,250,'YOUR EYES',P.gold,46):''}${AT(t,p.str??4.8)?bubble(1300,140,520,120,'"Great-great-grandpa?"',{size:44,tail:'left'}):''}`;
},
lonely(t,d,p,g){
  const a=p.a??3.8,b=p.b??5.1,c=p.c??6.7;
  return `${card('cardDark',g)}${AT(t,a)?T(960,330,'NOT THE COLD',{size:90,fill:P.ice,sc:pop(t,a)}):''}${AT(t,b)?T(960,480,'NOT THE VIRUSES',{size:90,fill:'#9BE15D',sc:pop(t,b)}):''}
   ${AT(t,c)?T(960,700,'THE LONELINESS',{size:150,fill:P.white,sc:pop(t,c)}):''}${!AT(t,a)?brain(960,520,1.2,.6,g):''}`;
},
aloneHill(t,d,p,g){
  return `${bgFuture(g)}<rect width="1920" height="1080" fill="#0B1026" opacity=".45"/>${hill(g)}${glint({x:1200,y:520,s:.55,t:g,mouth:'flat',brows:'sad',look:-1,blink:BL(g)})}`;
},
zero(t,d,p,g){
  return `${card('cardDark',g)}${T(960,580,'0',{size:420,fill:P.red,sc:IN(t,.3)})}${T(960,800,'PEOPLE REVIVED',{size:90,fill:P.white,op:prog(t,.6,.9)})}`;
},
warehouse(t,d,p,g){
  return `${bgLab(g)}${tankRow(260,500,.5,7,g)}${tankRow(160,800,.6,8,g+1)}${labelPill(960,130,'~500 PEOPLE WAITING',P.ice,56)}`;
},
bedford(t,d,p,g){
  const y=Math.round(1967+59*eout(prog(t,1.5,d-1)));
  return `${bgLab(g)}${dewar(700,600,1.1,g,{inside:true,label:'J. BEDFORD'})}
   ${T(1360,420,'FROZEN 1967',{size:80,fill:P.ice,sc:IN(t,.3)})}${T(1360,600,String(y),{size:200,fill:P.white})}${AT(t,p.still??7)?T(1360,760,'STILL WAITING',{size:80,fill:P.gold,sc:pop(t,p.still??7)}):''}`;
},
stepOut(t,d,p,g){
  const o=eout(prog(t,p.open??2.2,(p.open??2.2)+1.8)), w=prog(t,(p.open??2.2)+1.5,(p.open??2.2)+4);
  return `${bgFuture(g)}${door(960,600,1.2,o)}${o>.3?`<g opacity="${.5+.5*w}">${glint({x:960,y:lerp(620,640,w),s:lerp(.4,.75,w),t:g,legs:'walk',mouth:'o',blink:BL(g)})}</g>`:''}`;
},
ask(t,d,p,g){
  return `${bgNight(g)}${glint({x:960,y:620,s:1.6,t:g,mouth:AT(t,p.q??2.1)?'smirk':'smile',brows:AT(t,p.q??2.1)?'raised':'calm',blink:BL(g),glint:AT(t,p.q??2.1)?Math.max(0,Math.sin((t-(p.q??2.1))*3)):0,pose:'shrug'})}
   ${AT(t,(p.q??2.1)+3.4)?`${T(960,170,'WOULD YOU?',{size:130,fill:P.mint,sc:pop(t,(p.q??2.1)+3.4)})}${labelPill(560,560,'YES',P.mint,64)}${labelPill(1360,560,'NO',P.coral,64)}`:''}`;
},
endCard(t,d,p,g){
  return `${bgNight(g)}${icon('comment',520,300,pop(t,.2))}${T(520,500,'COMMENT BELOW',{size:56,fill:P.white,op:prog(t,.3,.6)})}
   ${glint({x:520,y:700,s:.8,t:g,pose:'wave',mouth:'grin',blink:BL(g)})}
   ${AT(t,p.next??1.8)?`<g transform="translate(1340,540) scale(${pop(t,p.next??1.8)})"><rect x="-380" y="-260" width="760" height="520" rx="30" fill="url(#gMint)" stroke="${P.mint}" stroke-width="12"/>
     ${T(0,-130,'NEXT',{size:60,fill:P.mint})}${T(0,20,p.n1||'1,000 YEARS',{size:110,fill:P.white})}${T(0,140,p.n2||'IN THE FUTURE',{size:70,fill:P.gold})}</g>`:''}`;
}
};

// ===================== episode 002 scenes =====================
const GLY='ᚠᛟᛉᚹᚱᚲᛞᛇᛒᛗ';
function glyphs(n,seed){const r=rng(seed);let s='';for(let i=0;i<n;i++)s+=GLY[Math.floor(r()*GLY.length)];return s;}
Object.assign(SHOTS,{
signs3026(t,d,p,g){
  let signs='';[[300,260,'#FF6BD6'],[1560,300,P.mint],[700,520,P.gold],[1300,560,'#6BE4FF']].forEach(([x,y,c],i)=>{
    const fl=.75+.25*Math.sin(g*6+i*2);
    signs+=`<g transform="translate(${x},${y})" opacity="${fl}"><rect x="-150" y="-50" width="300" height="100" rx="18" fill="#120826" stroke="${c}" stroke-width="8"/>
      <text y="22" text-anchor="middle" font-size="60" font-weight="900" fill="${c}" font-family="serif">${glyphs(5,i+9)}</text></g>`;});
  return `${bgFuture(g,t*12)}${signs}${glint({x:960,y:700,s:.75,t:g,mouth:'o',brows:'raised',look:Math.sin(g*1.3),blink:BL(g)})}
   ${T(960,150,'YEAR 3026',{size:140,fill:P.mint,sc:IN(t,.2)})}`;
},
hotel705(t,d,p,g){
  const roof=(y,w)=>`<path d="M${960-w} ${y} Q960 ${y-90} ${960+w} ${y} L${960+w-40} ${y+24} L${960-w+40} ${y+24}Z" fill="#5A2A2A" stroke="${INK}" stroke-width="8"/>`;
  let steam='';for(let i=0;i<4;i++){const k=((g*.4+i/4)%1);steam+=`<circle cx="${1420+Math.sin(g+i)*20}" cy="${760-k*260}" r="${20+k*40}" fill="#fff" opacity="${.35*(1-k)}"/>`;}
  return `${bgNight(g)}<rect x="640" y="560" width="640" height="320" fill="#C9A46A" stroke="${INK}" stroke-width="8"/>${roof(560,380)}
   <rect x="740" y="400" width="440" height="160" fill="#C9A46A" stroke="${INK}" stroke-width="8"/>${roof(400,280)}
   ${[700,820,940,1060,1180].map(x=>`<rect x="${x}" y="640" width="70" height="110" fill="#FFD98E" opacity=".75" stroke="${INK}" stroke-width="5"/>`).join('')}
   <ellipse cx="1420" cy="830" rx="150" ry="40" fill="#6BE4FF" opacity=".6" stroke="${INK}" stroke-width="6"/>${steam}
   ${labelPill(960,950,'OPEN SINCE 705 AD',P.gold,46)}${T(960,170,'1,300+ YEARS',{size:110,fill:P.white,sc:IN(t,.4)})}`;
},
tankOrShip(t,d,p,g){
  const two=AT(t,p.ship??14);
  return `${card('cardDark',g)}<rect x="960" y="140" width="6" height="800" fill="#fff" opacity=".15"/>
   ${dewar(480,600,.8,g,{inside:true,warn:AT(t,p.who??10)?1:0})}${T(480,170,'OPTION 1: FREEZE',{size:56,fill:P.ice})}
   ${AT(t,p.who??10)?T(480,880,'WHO KEEPS IT COLD?',{size:52,fill:P.red,sc:pop(t,p.who??10)}):''}
   <g opacity="${two?1:.25}">${T(1440,170,'OPTION 2: FLY',{size:56,fill:P.gold})}
   <g transform="translate(1440,560) rotate(-20)"><path d="M-200 0 Q-60 -90 200 0 Q-60 90 -200 0Z" fill="#E8E8FF" stroke="${INK}" stroke-width="9"/><circle cx="60" r="34" fill="${P.iceDeep}" stroke="${INK}" stroke-width="7"/>
   <path d="M-200 0 L-${330+Math.sin(g*20)*20} 0" stroke="${P.warm}" stroke-width="40" stroke-linecap="round" opacity=".8"/></g></g>`;
},
dilation(t,d,p,g){
  const k=eout(prog(t,.4,d-.6)); const ship=(14.1*k).toFixed(1), earth=Math.round(1000*k);
  let stars='';const r=rng(2);for(let i=0;i<60;i++){const y=r()*1080,x=(r()*1920-g*1800*(.5+r()))%1920;stars+=`<path d="M${x<0?x+1920:x} ${y} h${60+r()*140}" stroke="#fff" stroke-width="3" opacity="${.3+r()*.5}"/>`;}
  return `<rect width="1920" height="1080" fill="#05060F"/>${stars}
   <g transform="translate(960,470)"><path d="M-330 0 Q-100 -140 330 0 Q-100 140 -330 0Z" fill="#E8E8FF" stroke="${INK}" stroke-width="10"/>
   <circle cx="110" r="52" fill="${P.iceDeep}" stroke="${INK}" stroke-width="8"/><g transform="translate(110,18) scale(.22)">${glint({t:g,mouth:'grin',scarf:false})}</g>
   <path d="M-330 0 L-${520+Math.sin(g*25)*25} 0" stroke="${P.warm}" stroke-width="60" stroke-linecap="round" opacity=".85"/></g>
   ${T(960,140,'99.99% SPEED OF LIGHT',{size:80,fill:P.gold,sc:IN(t,.2)})}
   ${T(520,880,'YOU: '+ship+' YRS',{size:80,fill:P.mint})}${T(1400,880,'EARTH: '+earth+' YRS',{size:80,fill:P.white})}`;
},
oldEnglish(t,d,p,g){
  const tr=p.tr??7.5;
  return `${card('cardGold',g)}<g transform="translate(960,520) rotate(-2)"><rect x="-620" y="-240" width="1240" height="480" rx="24" fill="#F2E2BE" stroke="${INK}" stroke-width="10"/>
   <rect x="-650" y="-270" width="60" height="540" rx="30" fill="#B08850" stroke="${INK}" stroke-width="8"/><rect x="590" y="-270" width="60" height="540" rx="30" fill="#B08850" stroke="${INK}" stroke-width="8"/>
   <text y="-40" text-anchor="middle" font-size="84" font-weight="800" fill="#4A2A10" font-family="serif" font-style="italic" opacity="${prog(t,.2,1.2)}">Fæder ūre þū þe eart</text>
   <text y="70" text-anchor="middle" font-size="84" font-weight="800" fill="#4A2A10" font-family="serif" font-style="italic" opacity="${prog(t,.8,1.8)}">on heofonum…</text></g>
   ${T(960,150,'ENGLISH · 1,000 YEARS AGO',{size:72,fill:P.gold,sc:IN(t,.2)})}
   ${AT(t,tr)?labelPill(960,870,'"Our Father, who art in heaven"',P.mint,46):''}`;
},
noTalk(t,d,p,g){
  return `${bgFuture(g)}${extra({x:1400,y:560,s:.95,t:g,head:'#6BE4FF',mouth:'flat',glasses:false})}
   ${bubble(1440,200,420,140,glyphs(4,3)+' '+glyphs(3,7)+'?',{size:60,tail:'right'})}
   ${glint({x:600,y:560,s:1,t:g,mouth:'wavy',brows:'raised',look:1,blink:BL(g)})}${bubble(560,210,320,140,'Hello…?',{size:60})}
   ${AT(t,p.lost??6)?T(960,880,"YOU'RE THE OLD LANGUAGE",{size:72,fill:P.gold,sc:pop(t,p.lost??6)}):''}`;
},
futureHumans(t,d,p,g){
  const imp=(x,y)=>`<circle cx="${x}" cy="${y}" r="14" fill="${P.mint}" opacity="${.6+.4*Math.sin(g*5+x)}"/><circle cx="${x}" cy="${y}" r="34" fill="url(#gMint)"/>`;
  return `${bgFuture(g)}${extra({x:380,y:560,s:.85,t:g,head:'#FFD3A8'})}${imp(440,420)}${extra({x:1540,y:560,s:.85,t:g+1,head:'#C9967A'})}${imp(1480,420)}
   ${glint({x:960,y:560,s:1,t:g,mouth:AT(t,p.same??7)?'smile':'o',brows:'raised',blink:BL(g)})}
   ${T(960,150,AT(t,p.same??7)?'THEY LOOK LIKE YOU':'~40 GENERATIONS',{size:96,fill:P.mint,sc:pop(t,AT(t,p.same??7)?p.same??7:.2)})}
   ${AT(t,p.impl??22)?labelPill(960,880,'IMPLANTS · EDITED GENES · LONGER LIVES',P.gold,40):''}`;
},
drift(t,d,p,g){
  const k=eout(prog(t,.5,d-.5));
  return `${card('cardIce',g)}<rect x="0" y="0" width="1920" height="1080" fill="#1C5D8A" opacity=".45"/>
   <path d="M${420-k*30} 300 q120 -80 260 -20 q90 90 40 240 q-60 160 -200 140 q-140 -40 -160 -170 q-10 -120 60 -190Z" fill="#7BD88F" stroke="${INK}" stroke-width="9"/>
   <path d="M${1240+k*30} 280 q200 -40 300 60 q60 140 -40 260 q-140 90 -250 0 q-80 -120 -10 -320Z" fill="#7BD88F" stroke="${INK}" stroke-width="9"/>
   <g transform="translate(960,560)"><path d="M-40 -60 h80 v90 q0 40 -40 40 q-40 0 -40 -40Z" fill="#FFE3C9" stroke="${INK}" stroke-width="7"/><rect x="-32" y="-60" width="64" height="40" rx="10" fill="#FFF6EA" stroke="${INK}" stroke-width="5"/></g>
   ${T(960,860,'2–5 CM A YEAR',{size:80,fill:P.white,sc:IN(t,.5)})}${T(960,150,'1,000 YEARS = A FEW DOZEN METERS',{size:64,fill:P.ice,sc:IN(t,p.dz??3)})}`;
},
moonDay(t,d,p,g){
  const a=g*.8;
  return `<rect width="1920" height="1080" fill="#05060F"/>${bgCard('cardDark',g).replace('<rect width="1920" height="1080" fill="url(#cardDark)"/>','')}
   <circle cx="760" cy="540" r="200" fill="#3A7BD5" stroke="${INK}" stroke-width="10"/><path d="M640 470 q60 -50 120 0 q40 60 -30 100 q-90 0 -90 -100Z M800 600 q60 -20 90 40 q-40 50 -90 -40Z" fill="#7BD88F"/>
   <ellipse cx="760" cy="540" rx="520" ry="160" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10 14" opacity=".4"/>
   <circle cx="${760+Math.cos(a)*520}" cy="${540+Math.sin(a)*160}" r="64" fill="#D8D8E0" stroke="${INK}" stroke-width="8"/>
   ${T(1460,480,'+0.017 s',{size:120,fill:P.gold,sc:IN(t,p.plus??7)})}${T(1460,600,'EVERY DAY',{size:64,fill:P.white,op:prog(t,(p.plus??7)+.3,(p.plus??7)+.6)})}
   ${AT(t,p.watch??13)?T(1460,760,'⌚ WRONG',{size:70,fill:P.red,sc:pop(t,p.watch??13)}):''}`;
},
voyager(t,d,p,g){
  const vx=lerp(300,420,eout(prog(t,p.fly??8,d)));
  return `<rect width="1920" height="1080" fill="#05060F"/>${bgCard('cardDark',g).replace('<rect width="1920" height="1080" fill="url(#cardDark)"/>','')}
   <g transform="translate(${vx},430) rotate(-8)"><circle r="46" fill="none" stroke="#E8E8E8" stroke-width="10"/><path d="M0 0 L-120 0 M0 0 L80 -60 M0 0 L60 90" stroke="#E8E8E8" stroke-width="8"/><rect x="-24" y="-18" width="48" height="36" fill="${P.gold}" stroke="${INK}" stroke-width="5"/></g>
   <path d="M200 760 H1720" stroke="#fff" stroke-width="6" opacity=".5"/>
   <circle cx="200" cy="760" r="16" fill="${P.iceDeep}"/>${T(200,840,'EARTH',{size:40,fill:P.white})}
   <circle cx="${200+1520*0.06/4.24}" cy="760" r="12" fill="${P.gold}"/>${T(330,700,'VOYAGER 1 · 3026',{size:40,fill:P.gold,op:prog(t,p.fly??8,(p.fly??8)+.4)})}
   <circle cx="1720" cy="760" r="30" fill="#FF9F43"/><circle cx="1720" cy="760" r="90" fill="url(#gWarm)" opacity=".7"/>${T(1720,860,'NEAREST STAR · 4.24 LY',{size:40,fill:P.white})}
   ${T(960,170,AT(t,p.noth??20)?"TO SPACE, IT'S NOTHING":'1977 → 3026',{size:96,fill:P.mint,sc:pop(t,AT(t,p.noth??20)?p.noth??20:.2)})}`;
},
survivors(t,d,p,g){
  const items=[[420,'pyr','PYRAMIDS',p.a??0.3],[960,'bottle','PLASTIC',p.b??10.5],[1500,'barrel','NUCLEAR WASTE',p.c??19]];
  const draw={pyr:`<path d="M-170 120 L0 -150 L170 120Z" fill="#E0B86A" stroke="${INK}" stroke-width="9"/><path d="M0 -150 L60 120" stroke="#B8903E" stroke-width="6"/>`,
    bottle:`<rect x="-50" y="-110" width="100" height="230" rx="40" fill="#9AD1FF" opacity=".8" stroke="${INK}" stroke-width="8"/><rect x="-24" y="-150" width="48" height="44" rx="8" fill="${P.red}" stroke="${INK}" stroke-width="6"/>`,
    barrel:`<rect x="-90" y="-130" width="180" height="250" rx="22" fill="${P.gold}" stroke="${INK}" stroke-width="9"/>${'<g transform="scale(.55)">'+''+'</g>'}`};
  return `${card('cardDark',g)}${items.map(([x,k,l,a])=>AT(t,a)?`<g transform="translate(${x},520) scale(${pop(t,a)})">${draw[k]}${k==='barrel'?`<g transform="scale(.6)">${icon('hazard',0,0,1).replace('<g transform="translate(0,0) scale(1)" opacity="1">','<g>')}</g>`:''}</g>${T(x,770,l,{size:52,fill:P.white})}${icon('check',x+130,340,.6*pop(t,a+.3))}`:'').join('')}
   ${T(960,150,'WHAT SURVIVES',{size:100,fill:P.gold,sc:IN(t,.2)})}`;
},
digitalDecay(t,d,p,g){
  const k=prog(t,p.fade??3,d-1); const r=rng(6); let tiles='';
  for(let i=0;i<3;i++)for(let j=0;j<4;j++){const on=r()>k;tiles+=`<rect x="${-150+i*102}" y="${-260+j*100}" width="92" height="90" rx="10" fill="${on?['#FFB4A2','#9AD1FF','#7BD88F','#FFD98E'][(i+j)%4]:'#222'}" opacity="${on?1:.6}"/>`;}
  const tab=AT(t,p.tab??12.5);
  return `${card('cardDark',g)}<g transform="translate(${tab?1300:960},560)"><rect x="-180" y="-330" width="360" height="660" rx="44" fill="${INK}" stroke="#555" stroke-width="8"/>${tiles}</g>
   ${tab?`<g transform="translate(560,560) rotate(-6) scale(${pop(t,p.tab??12.5)})"><rect x="-170" y="-220" width="340" height="440" rx="30" fill="#C9A46A" stroke="${INK}" stroke-width="9"/>${[...Array(7)].map((_,i)=>`<path d="M-120 ${-160+i*55} h${200+((i*29)%40)}" stroke="#8A6A3A" stroke-width="10" stroke-dasharray="14 10"/>`).join('')}</g>
     ${T(560,900,'4,000 YEARS',{size:64,fill:P.gold})}${T(1300,950,'~50 YEARS?',{size:64,fill:P.red})}`:''}
   ${T(960,140,'DIGITAL DARK AGE',{size:100,fill:P.red,sc:IN(t,p.name??8.5)})}`;
},
oldBank(t,d,p,g){
  const x=AT(t,p.never??7.6);
  return `${card('cardGold',g)}${icon('bank',700,540,2.4)}${labelPill(700,820,'OPENED 1472',P.gold,48)}
   ${T(1400,480,'~550 YEARS',{size:110,fill:P.white,sc:IN(t,p.yrs??4.6)})}
   ${x?`${T(1400,660,'1,000 YEARS?',{size:90,fill:P.red,sc:pop(t,p.never??7.6)})}${icon('cross',1400,820,pop(t,(p.never??7.6)+.3))}`:''}`;
},
exhibit(t,d,p,g){
  let crowd='';[[260,'#6BE4FF'],[1660,'#FF6BD6']].forEach(([x,h],i)=>crowd+=extra({x,y:600,s:.75,t:g+i,head:h,pose:i?'point':'down',look:i?-1:1}));
  return `${bgFuture(g)}<rect width="1920" height="1080" fill="#0B1026" opacity=".35"/>${crowd}
   <rect x="700" y="840" width="520" height="140" fill="#2A2450" stroke="${INK}" stroke-width="10"/>
   ${glint({x:960,y:520,s:.85,t:g,mouth:'flat',brows:'sad',look:Math.sin(g*.7),blink:BL(g)})}
   <rect x="690" y="140" width="540" height="700" fill="url(#iceG)" opacity=".22" stroke="#fff" stroke-width="8"/>
   ${labelPill(960,910,'HUMAN · c. 2026',P.gold,42)}${T(960,120,p.title||'YOU ARE HISTORY',{size:96,fill:P.white,sc:IN(t,.3)})}`;
},
hook3026(t,d,p,g){
  const op=p.open??3.5, k=ease(prog(t,1,op)); const yr=Math.round(2026+1000*k);
  return `${k<1?bgNight(g):bgFuture(g)}<rect width="1920" height="1080" fill="#000" opacity="${k<1?.25+.4*Math.sin(k*Math.PI):0}"/>
   ${glint({x:960,y:560,s:1.1,t:g,eyes:AT(t,op)?'open':'closed',mouth:AT(t,op)?'o':'smile',brows:AT(t,op)?'raised':'calm',blink:0})}
   ${T(960,190,String(yr),{size:180,fill:k>=1?P.mint:P.white})}`;
}
});

// ===================== episode 003 scenes (sound vision) =====================
const SV={col:P.mint};
// outline object library: each returns svg drawn in outline style with opacity op
const OBJ={
  wallL:op=>`<path d="M140 120 V940" stroke="${P.mint}" stroke-width="14" opacity="${op}"/>`,
  wallR:op=>`<path d="M1780 120 V940" stroke="${P.mint}" stroke-width="14" opacity="${op}"/>`,
  floor:op=>`<path d="M140 940 H1780" stroke="${P.mint}" stroke-width="10" opacity="${op}"/>`,
  table:op=>`<g opacity="${op}" stroke="${P.mint}" stroke-width="10" fill="none"><path d="M1180 700 H1520 M1220 700 V900 M1480 700 V900"/></g>`,
  bed:op=>`<g opacity="${op*.6}" stroke="${P.mint}" stroke-width="10" fill="none" stroke-dasharray="6 10"><rect x="260" y="720" width="460" height="180" rx="40"/><rect x="280" y="660" width="140" height="70" rx="30"/></g>`,
  door:op=>`<g opacity="${op}" stroke="${P.mint}" stroke-width="10" fill="none"><path d="M880 940 V420 H1060 V940"/></g>`,
  person:op=>`<g opacity="${op}" stroke="${P.mint}" stroke-width="10" fill="none"><circle cx="1660" cy="420" r="60"/><path d="M1660 480 V720 M1660 540 L1600 640 M1660 540 L1720 640 M1660 720 L1610 900 M1660 720 L1710 900"/></g>`,
  car:op=>`<g opacity="${op}" stroke="${P.mint}" stroke-width="10" fill="none"><path d="M1100 860 V790 L1180 720 H1420 L1500 790 V860 Z"/><circle cx="1180" cy="870" r="40"/><circle cx="1420" cy="870" r="40"/></g>`,
  lamp:op=>`<g opacity="${op}" stroke="${P.mint}" stroke-width="10" fill="none"><path d="M1640 940 V300 Q1640 260 1600 260 H1540"/><path d="M1520 260 h60 l-10 30 h-40z"/></g>`,
  tree:op=>`<g opacity="${op}" stroke="${P.mint}" stroke-width="10" fill="none"><path d="M400 940 V640"/><circle cx="400" cy="560" r="120" stroke-dasharray="8 10" opacity=".6"/></g>`,
  cat:op=>`<g opacity="${op}" stroke="${P.mint}" stroke-width="8" fill="none"><path d="M760 600 H1000"/><path d="M820 600 q0 -60 40 -70 l10 -30 l14 26 h20 l14 -26 l10 30 q40 10 40 70"/><path d="M948 600 q40 -10 30 -60"/></g>`,
  brick:op=>`<g opacity="${op}" stroke="${P.mint}" stroke-width="12" fill="none"><rect x="1220" y="380" width="440" height="520"/>${[0,1,2,3,4].map(i=>`<path d="M1220 ${480+i*90} H1660" stroke-width="5"/>`).join('')}</g>`,
};
const SCENES_SV={room:[['wallL',140,540],['wallR',1780,540],['floor',960,940],['bed',490,800],['door',970,680],['table',1350,800],['person',1660,640]],
  street:[['floor',960,940],['tree',400,700],['car',1300,800],['lamp',1600,600],['brick',1440,640]],
  home:[['floor',960,940],['car',1300,800],['lamp',1600,600],['cat',880,560],['tree',400,700]]};
function soundVision(t,g,o){
  const {scene='room',clicks=[.5],ox=560,oy=560,speed=1100,walk=false,glintOn=true}=o;
  let objs='', rings='';
  for(const [k,x,y] of SCENES_SV[scene]){
    const dist=Math.hypot(x-ox,y-oy); let b=0;
    for(const c of clicks){const hit=c+dist/speed; if(t>=hit) b=Math.max(b,Math.exp(-(t-hit)/1.6));}
    objs+=OBJ[k](Math.max(.04,b));
  }
  for(const c of clicks){const r=(t-c)*speed; if(r>0&&r<2400) rings+=`<circle cx="${ox}" cy="${oy}" r="${r}" fill="none" stroke="${P.mint}" stroke-width="6" opacity="${Math.max(0,.6-r/2600)}"/>`;}
  const lastClick=clicks.filter(c=>t>=c).pop(); const clickNow=lastClick!=null&&t-lastClick<.25;
  return `<rect width="1920" height="1080" fill="#03040A"/>${objs}${rings}
   ${glintOn?glint({x:ox,y:oy-20,s:.7,t:g,eyes:'closed',mouth:clickNow?'o':'smile',legs:walk?'walk':'stand',tint:'#1A2A30'}).replace(/fill="#FFF6EA"/g,'fill="#1A2A30"'):''}
   ${clickNow?T(ox+150,oy-200,'CLICK',{size:60,fill:P.mint,sc:pop(t,lastClick,.15)}):''}`;
}
function bat(x,y,s,flap,col='#4A3F78'){const w=Math.sin(flap)*30;return `<g transform="translate(${x},${y}) scale(${s})"><path d="M0 0 Q-60 ${-40-w} -130 ${-10-w} Q-110 10 -90 30 Q-60 10 -40 30 Q-20 10 0 25 Q20 10 40 30 Q60 10 90 30 Q110 10 130 ${-10-w} Q60 ${-40-w} 0 0Z" fill="${col}" stroke="${P.mint}" stroke-width="5" stroke-opacity=".7"/><circle cx="-8" cy="-6" r="4" fill="#fff"/><circle cx="8" cy="-6" r="4" fill="#fff"/><path d="M-12 -20 l-6 -18 l12 10 M12 -20 l6 -18 l-12 10" fill="${col}" stroke="#2a2440" stroke-width="3"/></g>`;}
function bug(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><ellipse rx="14" ry="8" fill="#C8B07A" stroke="${INK}" stroke-width="3"/><path d="M-4 -6 q-10 -16 -20 -6 M4 -6 q10 -16 20 -6" stroke="#E8E8FF" stroke-width="4" fill="none"/></g>`;}
function nightSky(g){const r=rng(41);let st='';for(let i=0;i<90;i++)st+=`<circle cx="${r()*1920}" cy="${r()*900}" r="${r()*2+.5}" fill="#fff" opacity="${.2+.5*Math.abs(Math.sin(g+i))}"/>`;
  return `<rect width="1920" height="1080" fill="#05060F"/>${st}<path d="M0 1080 L0 900 ${[...Array(20)].map((_,i)=>`L${i*100+50} ${860-((i*37)%80)} L${i*100+100} 900`).join(' ')} L1920 1080Z" fill="#0A0716"/>`;}
Object.assign(SHOTS,{
svHook(t,d,p,g){return soundVision(t,g,{scene:'room',clicks:p.clicks||[1.6],ox:560,oy:560})+(p.label?T(960,120,p.label,{size:80,fill:P.white,sc:IN(t,p.labelAt??0)}):'');},
svRoom(t,d,p,g){return soundVision(t,g,{scene:'room',clicks:p.clicks||[.6],ox:560,oy:560})+(p.label?T(960,120,p.label,{size:72,fill:P.mint,sc:IN(t,p.labelAt??.3)}):'');},
svStreet(t,d,p,g){return soundVision(t,g,{scene:p.scene||'street',clicks:p.clicks||[.6],ox:p.ox??700,oy:600,walk:!!p.walk})+(p.label?T(960,120,p.label,{size:72,fill:P.mint,sc:IN(t,p.labelAt??.3)}):'');},
batHunt(t,d,p,g){
  const bx=330+((t*200)%1200), by=420+Math.sin(t*1.5)*120; let rings='';
  for(let i=0;i<5;i++){const k=((t*1.5+i/5)%1);rings+=`<path d="M${bx+60+k*300} ${by-60-k*120} Q${bx+100+k*360} ${by} ${bx+60+k*300} ${by+60+k*120}" stroke="${P.mint}" stroke-width="6" fill="none" opacity="${1-k}"/>`;}
  return `${nightSky(g)}${rings}${bat(bx,by,1.9,g*14)}${bug(bx+460,by-20+Math.sin(g*9)*20,1.8)}
   ${p.label?T(960,150,p.label,{size:p.size||90,fill:P.mint,sc:IN(t,p.labelAt??.3)}):''}${p.sub?T(960,880,p.sub,{size:50,fill:P.white,op:prog(t,(p.subAt??1),(p.subAt??1)+.3)}):''}`;
},
batLoud(t,d,p,g){
  const lv=eout(prog(t,.4,2)); const clamp_=AT(t,p.clamp??7);
  return `${card('cardWarm',g)}${bat(560,520,2.4,g*14)}
   ${[0,1,2].map(i=>{const k=((g*1.4+i/3)%1);return `<path d="M${700+k*200} ${420-k*80} q${60} ${100} 0 ${200+k*160}" stroke="${P.red}" stroke-width="10" fill="none" opacity="${1-k}"/>`}).join('')}
   <rect x="1240" y="${820-480*lv}" width="120" height="${480*lv}" rx="20" fill="${P.red}" stroke="${INK}" stroke-width="8"/><rect x="1240" y="340" width="120" height="480" rx="20" fill="none" stroke="${INK}" stroke-width="8"/>
   ${T(1300,300,Math.round(130*lv)+' dB',{size:96,fill:P.white})}${T(1580,620,'✈️ JET',{size:70,fill:P.gold,op:prog(t,2,2.4)})}
   ${clamp_?labelPill(560,880,'EAR MUSCLES CLAMP SHUT',P.ice,44):''}`;
},
hzScale(t,d,p,g){
  const X=f=>200+Math.log10(f/20)/Math.log10(200000/20)*1520;
  const hb=pop(t,.3), bb=pop(t,p.bats??4.2);
  return `${card('cardDark',g)}<path d="M200 640 H1720" stroke="#fff5" stroke-width="6"/>
   ${[20,200,2000,20000,200000].map(f=>`<path d="M${X(f)} 620 V660" stroke="#fff8" stroke-width="5"/>${T(X(f),720,f>=1000?(f/1000)+'k':String(f),{size:36,fill:'#fffa',stroke:6})}`).join('')}
   <rect x="${X(20)}" y="540" width="${(X(20000)-X(20))*hb}" height="70" rx="20" fill="${P.iceDeep}" stroke="${INK}" stroke-width="6"/>${T((X(20)+X(20000))/2,505,'YOU HEAR',{size:52,fill:P.ice,op:hb})}
   ${AT(t,p.bats??4.2)?`<rect x="${X(20000)}" y="770" width="${(X(120000)-X(20000))*bb}" height="70" rx="20" fill="${P.mint}" stroke="${INK}" stroke-width="6"/>${T((X(20000)+X(120000))/2,900,'BATS SHOUT',{size:52,fill:P.mint})}`:''}
   ${T(960,170,'VIBRATIONS PER SECOND',{size:72,fill:P.white,sc:IN(t,.2)})}`;
},
echoTime(t,d,p,g){
  const cyc=((t-.4)%2.2+2.2)%2.2, out=cyc<1, k=out?cyc:2-cyc, x=lerp(560,1440,eout(Math.min(1,k)));
  return `${card('cardDark',g)}${glint({x:420,y:540,s:.9,t:g,eyes:'closed',mouth:cyc<.2?'o':'smile'})}
   <rect x="1460" y="200" width="70" height="680" fill="#5D6A82" stroke="${INK}" stroke-width="8"/>
   <path d="M${x} 420 q40 120 0 240" stroke="${out?P.mint:P.gold}" stroke-width="12" fill="none"/>${T(x,380,out?'→':'←',{size:70,fill:out?P.mint:P.gold})}
   ${T(960,150,'343 METERS / SECOND',{size:80,fill:P.white,sc:IN(t,.3)})}${AT(t,p.ms??4.2)?T(960,900,'ECHO BACK IN ~0.01 s',{size:72,fill:P.gold,sc:pop(t,p.ms??4.2)}):''}`;
},
hardSoft(t,d,p,g){
  return `${soundVision(t,g,{scene:'street',clicks:[.4,3.4,6.4],ox:860,oy:620,glintOn:true})}
   ${T(1440,300,'HARD = BRIGHT',{size:64,fill:P.mint,op:prog(t,.8,1.1)})}${AT(t,p.soft??7)?T(400,300,'SOFT = DIM',{size:64,fill:'#5aa',sc:pop(t,p.soft??7)}):''}`;
},
glassWall(t,d,p,g){
  const op=Math.exp(-Math.max(0,t-1)/2);
  return `${card('cardDark',g)}<rect x="0" y="0" width="960" height="1080" fill="#0B1026"/><rect x="960" y="0" width="960" height="1080" fill="#03040A"/>
   ${T(480,150,'YOUR EYES',{size:64,fill:P.white})}${T(1440,150,'YOUR SOUND VISION',{size:64,fill:P.mint})}
   <rect x="300" y="300" width="360" height="460" rx="10" fill="url(#iceG)" opacity=".25" stroke="#fff" stroke-width="8"/>${extra({x:480,y:560,s:.5,t:g,head:'#FFD3A8'})}
   <rect x="1260" y="300" width="360" height="460" rx="10" fill="${P.mint}" opacity="${.25+op*.6}" stroke="${P.mint}" stroke-width="12"/>
   ${T(1440,880,'= SOLID WALL',{size:60,fill:P.mint,op:prog(t,1,1.3)})}`;
},
noColor(t,d,p,g){
  const book=AT(t,p.book??12.5);
  return `${card('cardDark',g)}${!book?`<g transform="translate(560,560) scale(1.4)"><path d="M-160 60 V0 L-100 -60 H100 L160 0 V60Z" fill="${lerp(1,0,prog(t,1,2.5))>0?P.red:'#555'}" opacity="${1-prog(t,1.5,2.5)*.7}" stroke="${P.mint}" stroke-width="8"/></g>
     <g transform="translate(1360,560) scale(1.4)"><path d="M-160 60 V0 L-100 -60 H100 L160 0 V60Z" fill="${P.iceDeep}" opacity="${1-prog(t,1.5,2.5)*.7}" stroke="${P.mint}" stroke-width="8"/></g>${T(960,180,'NO COLORS',{size:96,fill:P.white,sc:IN(t,.2)})}`
   :`<g transform="translate(960,540)"><rect x="-320" y="-220" width="640" height="440" rx="16" fill="#03040A" stroke="${P.mint}" stroke-width="10"/><path d="M0 -220 V220" stroke="${P.mint}" stroke-width="6"/>
     ${[...Array(6)].map((_,i)=>`<path d="M-270 ${-150+i*55} h210 M50 ${-150+i*55} h210" stroke="#fff" stroke-width="8" opacity="${.5*(1-prog(t,(p.book??12.5)+.4,(p.book??12.5)+1.6))}"/>`).join('')}</g>
     ${T(960,180,'INK MAKES NO ECHO',{size:90,fill:P.mint,sc:pop(t,p.book??12.5)})}`}`;
},
noiseStorm(t,d,p,g){
  const r=rng(Math.floor(g*20)); let n='';for(let i=0;i<160;i++)n+=`<rect x="${r()*1920}" y="${r()*1080}" width="${4+r()*10}" height="3" fill="#fff" opacity="${r()*.6}"/>`;
  const flash=Math.max(0,Math.sin(g*2.2))>.95;
  return `${soundVision(t,g,{scene:'street',clicks:[.4,2.4,4.4,6.4,8.4],ox:860,oy:620})}${n}${flash?'<rect width="1920" height="1080" fill="#fff" opacity=".35"/>':''}
   ${T(960,150,'NOISE = SNOWSTORM',{size:90,fill:P.white,sc:IN(t,.3)})}`;
},
handDemo(t,d,p,g){
  const k=eout(prog(t,p.move??10,(p.move??10)+5)); const hx=lerp(1500,1050,k);
  let w='';for(let i=0;i<4;i++){const kk=((g*1.6+i/4)%1);w+=`<path d="M${820+kk*(hx-860)} ${470-40} q30 40 0 80" stroke="${P.mint}" stroke-width="${6+k*6}" fill="none" opacity="${(1-kk)*(.4+k*.6)}"/>`;}
  return `${card('cardMint',g)}${glint({x:600,y:540,s:1,t:g,mouth:'o',brows:'raised'})}${w}
   <g transform="translate(${hx},500)"><rect x="-50" y="-150" width="100" height="260" rx="44" fill="#FFE3C9" stroke="${INK}" stroke-width="8"/>${[0,1,2,3].map(i=>`<rect x="${-46+i*24}" y="-210" width="22" height="80" rx="11" fill="#FFE3C9" stroke="${INK}" stroke-width="5"/>`).join('')}</g>
   ${T(1300,170,'TRY IT: "SHHHH"',{size:84,fill:P.white,sc:IN(t,.3)})}${AT(t,p.echo??20.5)?T(1300,940,"THAT'S AN ECHO",{size:76,fill:P.mint,sc:pop(t,p.echo??20.5)}):''}`;
},
darkPowers(t,d,p,g){
  const fog=[...Array(14)].map((_,i)=>`<circle cx="${(i*160+g*40)%2100-100}" cy="${500+Math.sin(i)*200}" r="${160+i%3*40}" fill="#9AA7BD" opacity=".12"/>`).join('');
  return `${soundVision(t,g,{scene:'street',clicks:[.5,2.5,4.5,6.5,8.5,10.5,12.5],ox:860,oy:620})}${fog}
   ${T(960,150,'DARKNESS · FOG · SMOKE',{size:76,fill:P.white,sc:IN(t,.3)})}${AT(t,p.corner??10.6)?labelPill(960,950,'IT EVEN BENDS AROUND CORNERS',P.mint,42):''}`;
},
feedingBuzz(t,d,p,g){
  const k=prog(t,.5,d-1); const rate=lerp(3,40,k*k); const bx=lerp(300,1150,eout(k)); let rings='';
  for(let i=0;i<10;i++){const kk=((g*rate/10+i/10)%1);rings+=`<path d="M${bx+60+kk*200} ${480-50-kk*60} q${30+kk*30} ${80} 0 ${100+kk*120}" stroke="${P.mint}" stroke-width="5" fill="none" opacity="${1-kk}"/>`;}
  return `${nightSky(g)}${rings}${bat(bx,520,1.8,g*20)}${bug(1500,520+Math.sin(g*12)*30,1.6)}
   ${T(960,150,Math.round(lerp(10,200,k*k))+' CALLS / SECOND',{size:84,fill:P.mint})}${AT(t,p.buzz??6.6)?T(960,960,'THE FEEDING BUZZ',{size:70,fill:P.gold,sc:pop(t,p.buzz??6.6)}):''}`;
},
dolphinScan(t,d,p,g){
  const scan=AT(t,p.us??8);
  return `${card(scan?'cardDark':'cardIce',g)}${!scan?`<g transform="translate(760,560)"><path d="M-260 0 Q-80 -140 180 -40 Q240 -20 260 10 Q200 20 160 30 Q-60 120 -260 0Z" fill="#7C9BC0" stroke="${INK}" stroke-width="9"/><path d="M-60 -70 l40 -80 l30 70" fill="#7C9BC0" stroke="${INK}" stroke-width="8"/><circle cx="150" cy="-20" r="9" fill="${INK}"/></g>
    ${[0,1,2,3].map(i=>{const k=((g*1.5+i/4)%1);return `<path d="M${1040+k*400} ${440-k*80} q50 ${120+k*80} 0 ${240+k*160}" stroke="${P.mint}" stroke-width="8" fill="none" opacity="${1-k}"/>`}).join('')}${T(960,150,'DOLPHIN CLICKS',{size:90,fill:P.white})}`
   :`<g transform="translate(960,560)"><rect x="-460" y="-330" width="920" height="620" rx="30" fill="#111" stroke="#555" stroke-width="10"/><path d="M0 -280 L-380 240 A460 460 0 0 0 380 240Z" fill="#1d1d1d"/>
     <path d="M-60 40 q-20 -140 100 -160 q120 0 110 110 q-10 90 -110 110 q-90 10 -100 -60Z" fill="none" stroke="#ccc" stroke-width="8" opacity=".8"/><circle cx="90" cy="-60" r="40" fill="none" stroke="#ccc" stroke-width="7" opacity=".8"/></g>${T(960,150,'ULTRASOUND = ECHOLOCATION',{size:72,fill:P.mint,sc:pop(t,p.us??8)})}`}`;
},
mothWar(t,d,p,g){
  const dive=AT(t,p.dive??9), jam=AT(t,p.jam??13.2);
  const my=dive&&!jam?lerp(420,900,eout(prog(t,p.dive??9,(p.dive??9)+1.2))):420;
  let jz='';if(jam)for(let i=0;i<5;i++){const k=((g*3+i/5)%1);jz+=`<path d="M${1300-k*260} ${400} l-20 -30 l-20 30 l-20 -30 l-20 30" stroke="${P.gold}" stroke-width="6" fill="none" opacity="${1-k}"/>`;}
  const bx=jam?lerp(500,860,eout(prog(t,(p.jam??13.2)+3,(p.jam??13.2)+4))):500;
  return `${nightSky(g)}${bat(bx,420,1.9,g*14)}
   <g transform="translate(1320,${my})"><ellipse rx="40" ry="20" fill="${jam?'#E8C27A':'#B8A27A'}" stroke="${INK}" stroke-width="5"/><path d="M-10 -10 q-50 -60 -90 -10 q40 20 90 10 M10 -10 q50 -60 90 -10 q-40 20 -90 10" fill="${jam?'#F2A65A':'#C8B07A'}" stroke="${INK}" stroke-width="5"/></g>${jz}
   ${T(960,150,jam?'TIGER MOTHS JAM THE SONAR':dive?'MOTHS HEAR IT… AND DROP':'THE SILENT WAR',{size:80,fill:jam?P.gold:P.white})}
   ${AT(t,(p.jam??13.2)+4.5)?T(960,960,'MISS!',{size:110,fill:P.red,sc:pop(t,(p.jam??13.2)+4.5)}):''}`;
},
kish(t,d,p,g){
  const x=lerp(300,1500,(t*.12)%1);
  const shades=`<rect x="-60" y="-78" width="120" height="34" rx="14" fill="${INK}"/>`;
  return `${bgNight(g,t*80)}<g transform="translate(${x},480)"><circle cx="-110" cy="200" r="80" fill="none" stroke="${INK}" stroke-width="12"/><circle cx="130" cy="200" r="80" fill="none" stroke="${INK}" stroke-width="12"/><path d="M-110 200 L0 120 L130 200 M0 120 L-20 40" stroke="#C9302C" stroke-width="12" fill="none"/></g>
   ${extra({x:x-10,y:300,s:.75,t:g,head:'#E0B48A',hair:shades})}${[0,1].map(i=>{const k=((g*1.2+i/2)%1);return `<circle cx="${x+40}" cy="${330}" r="${40+k*360}" fill="none" stroke="${P.mint}" stroke-width="6" opacity="${(1-k)*.8}"/>`}).join('')}
   ${labelPill(960,130,'DANIEL KISH · ECHOLOCATOR',P.gold,48)}`;
},
brainCortex(t,d,p,g){
  const lit=prog(t,p.lit??7,(p.lit??7)+1.5);
  return `${card('cardDark',g)}${brain(960,560,1.6,.6,g)}
   <ellipse cx="${960+190}" cy="${560-10}" rx="130" ry="110" fill="${P.gold}" opacity="${lit*.55}"/>
   ${[0,1,2].map(i=>{const k=((g*1.2+i/3)%1);return `<path d="M${400+k*300} 460 q40 100 0 200" stroke="${P.mint}" stroke-width="8" fill="none" opacity="${1-k}"/>`}).join('')}
   ${lit>0?labelPill(1240,860,'VISUAL CORTEX',P.gold,46):''}${T(960,130,AT(t,p.sight??12)?'SOUND → SIGHT':'BRAIN SCAN',{size:96,fill:P.white,sc:pop(t,AT(t,p.sight??12)?p.sight??12:.2)})}`;
},
tenWeeks(t,d,p,g){
  const k=prog(t,.5,6); let cal='';
  for(let i=0;i<10;i++){const on=k*10>i;cal+=`<g transform="translate(${360+(i%5)*300},${i<5?420:640})"><rect x="-110" y="-80" width="220" height="160" rx="16" fill="${on?P.mint:'#2A2450'}" stroke="${INK}" stroke-width="7"/><text y="20" text-anchor="middle" font-size="44" font-weight="900" fill="${INK}">WK ${i+1}</text></g>`;}
  return `${card('cardMint',g)}${cal}${T(960,170,'10 WEEKS OF PRACTICE',{size:90,fill:P.white,sc:IN(t,.2)})}
   ${AT(t,p.skill??13)?T(960,900,"IT'S A SKILL",{size:100,fill:P.gold,sc:pop(t,p.skill??13)}):''}`;
}
});

// ===================== episode 004 scenes (WiFi vision) =====================
const WV='#7CF5FF', WV2='#B47CFF';
function wifiWaves(x,y,g,o={}){const {n=6,max=900,col=WV,speed=.5,op=.7,w=8}=o;let s='';for(let i=0;i<n;i++){const k=((g*speed+i/n)%1);s+=`<circle cx="${x}" cy="${y}" r="${30+k*max}" fill="none" stroke="${col}" stroke-width="${w}" opacity="${op*(1-k)}"/>`;}return s;}
function router(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-70" y="-20" width="140" height="44" rx="12" fill="#1C2433" stroke="${WV}" stroke-width="5"/><path d="M-40 -20 V-80 M40 -20 V-80" stroke="${WV}" stroke-width="7" stroke-linecap="round"/>${[-40,-10,20,50].map(i=>`<circle cx="${i}" cy="2" r="5" fill="${P.mint}"/>`).join('')}<circle r="120" fill="url(#gMint)" opacity=".5"/></g>`;}
function wvBg(){return `<rect width="1920" height="1080" fill="#050814"/>`;}
Object.assign(SHOTS,{
wifiHook(t,d,p,g){
  return `${wvBg()}<rect x="500" y="160" width="920" height="700" fill="none" stroke="${WV}" stroke-width="4" opacity=".25" stroke-dasharray="14 12"/>
   ${wifiWaves(1200,520,g,{max:1300})}${router(1200,520,1.2)}
   ${glint({x:620,y:560,s:.95,t:g,mouth:'o',brows:'raised',look:1,blink:BL(g),glint:1})}
   ${T(960,140,p.label||'WIFI VISION',{size:110,fill:WV,sc:IN(t,p.labelAt??.3)})}`;
},
spectrum(t,d,p,g){
  const big=AT(t,p.big??15);
  let small='';for(let i=0;i<60;i++)small+=`${i?'L':'M'}${330+i*8} ${520+Math.sin(i*1.4+g*6)*24}`;
  let wide='';for(let i=0;i<=80;i++)wide+=`${i?'L':'M'}${960+i*9} ${520+Math.sin(i*.16+g*3)*80}`;
  return `${card('cardDark',g)}<path d="${small}" stroke="${P.gold}" stroke-width="6" fill="none"/>${T(560,700,'LIGHT YOU SEE',{size:48,fill:P.gold})}${T(560,770,'< a bacterium',{size:36,fill:'#fffa',stroke:6})}
   ${big?`<path d="${wide}" stroke="${WV}" stroke-width="10" fill="none"/>${T(1320,700,'WIFI',{size:56,fill:WV})}${T(1320,770,'~12 cm ≈ your phone',{size:40,fill:'#fffa',stroke:6})}`:''}
   ${T(960,170,'WIFI IS LIGHT',{size:110,fill:P.white,sc:IN(t,p.lightAt??4)})}`;
},
kmEyes(t,d,p,g){
  const k=eout(prog(t,.4,2.5));
  return `${card('cardDark',g)}<rect x="1380" y="${880-420}" width="180" height="420" fill="#2A2450" stroke="${INK}" stroke-width="8"/><rect x="1600" y="560" width="140" height="320" fill="#2A2450" stroke="${INK}" stroke-width="8"/>
   <g transform="translate(700,520)"><ellipse rx="${120+k*360}" ry="${70+k*220}" fill="#fff" stroke="${INK}" stroke-width="12"/><circle r="${50+k*170}" fill="${INK}"/><circle cx="${30+k*60}" cy="${-20-k*50}" r="${14+k*30}" fill="#fff"/></g>
   ${T(960,150,'PUPILS 1 KM WIDE',{size:110,fill:WV,sc:IN(t,.3)})}${T(1500,300,'(so we cheat)',{size:56,fill:'#fffa',op:prog(t,p.cheat??7,(p.cheat??7)+.3)})}`;
},
wifiRoom(t,d,p,g){
  const walls=prog(t,p.walls??17,(p.walls??17)+2), shadow=AT(t,p.shadow??44);
  return `${wvBg()}<rect x="200" y="160" width="1520" height="760" fill="none" stroke="#fff" stroke-width="8" opacity="${.8-walls*.6}"/>
   <rect x="1720" y="160" width="200" height="760" fill="${WV}" opacity="${walls*.08}"/><rect x="0" y="160" width="200" height="760" fill="${WV}" opacity="${walls*.06}"/>
   ${wifiWaves(1500,600,g,{max:1500,op:.55})}${router(1500,600,1)}
   <rect x="280" y="300" width="200" height="560" rx="16" fill="#000" stroke="#333" stroke-width="6" opacity="${AT(t,p.fridge??37)?1:.2}"/>${AT(t,p.fridge??37)?T(380,270,'FRIDGE',{size:40,fill:'#fff8',stroke:6}):''}
   ${shadow?`<path d="M900 520 L320 380 L320 900 L900 900Z" fill="#000" opacity=".75"/>`:''}
   ${glint({x:960,y:560,s:.85,t:g,mouth:shadow?'o':'smile',brows:'raised',look:1,blink:BL(g)})}
   ${shadow?T(560,860,'YOUR WIFI SHADOW',{size:64,fill:WV,sc:pop(t,p.shadow??44)}):''}`;
},
phoneStrobe(t,d,p,g){
  const burst=(g*2.2)%1<.15;
  return `${wvBg()}<g transform="translate(960,560)"><rect x="-150" y="-280" width="300" height="560" rx="44" fill="#111" stroke="${WV}" stroke-width="6"/><rect x="-128" y="-250" width="256" height="480" rx="20" fill="#1C2433"/>
   ${burst?`<circle r="420" fill="url(#gMint)" opacity=".9"/>${wifiWaves(0,0,g*4,{n:3,max:600,col:'#fff',op:.9})}`:''}</g>
   ${T(960,140,"IT'S SHOUTING BACK",{size:96,fill:WV,sc:IN(t,.2)})}`;
},
devices(t,d,p,g){
  const items=[['tv',380,380],['bulb',960,330],['pc',1540,380],['finger',380,760],['comment',960,780],['bolt',1540,760]];
  const lbl=['SMART TV','SPEAKER','WATCH','BABY MONITOR','EARBUDS','…'];
  return `${wvBg()}${items.map(([k,x,y],i)=>`${wifiWaves(x,y,g+i*.37,{n:3,max:200,op:.6,w:5})}${icon(k,x,y,.8)}${T(x,y+130,lbl[i],{size:36,fill:WV,stroke:7})}`).join('')}
   ${T(960,120,'EVERYTHING IS TALKING',{size:90,fill:P.white,sc:IN(t,.2)})}`;
},
keyFlash(t,d,p,g){
  const press=prog(t,p.press??1.5,(p.press??1.5)+1.2);
  return `${wvBg()}${extra({x:460,y:560,s:.9,t:g,head:'#FFD3A8',pose:'point'})}<rect x="590" y="500" width="60" height="90" rx="20" fill="#333" stroke="${WV}" stroke-width="5"/>
   ${press>0&&press<1?`<path d="M650 540 L${650+press*900} 540" stroke="#fff" stroke-width="${40*(1-press)+6}" stroke-linecap="round" opacity="${1-press*.5}"/><circle cx="${650+press*900}" cy="540" r="60" fill="url(#gWhite)"/>`:''}
   <g transform="translate(1500,560) scale(1.4)"><path d="M-160 60 V0 L-100 -60 H100 L160 0 V60Z" fill="#1C2433" stroke="${WV}" stroke-width="7"/><circle cx="-90" cy="70" r="34" fill="#111" stroke="${WV}" stroke-width="5"/><circle cx="90" cy="70" r="34" fill="#111" stroke="${WV}" stroke-width="5"/></g>
   ${T(960,140,'CAR KEYS',{size:90,fill:WV,sc:IN(t,.2)})}`;
},
tapPay(t,d,p,g){
  const k=eout(prog(t,p.enter??5,(p.enter??5)+1.5)), on=k>.95;
  return `${card('cardDark',g)}<rect x="1180" y="380" width="260" height="380" rx="30" fill="#2A3248" stroke="${INK}" stroke-width="8"/><rect x="1210" y="420" width="200" height="120" rx="10" fill="#0B1026"/>
   <ellipse cx="1080" cy="560" rx="${200+Math.sin(g*4)*10}" ry="${220+Math.sin(g*4)*10}" fill="${WV}" opacity=".18" stroke="${WV}" stroke-width="5"/>
   <g transform="translate(${lerp(380,1000,k)},560) rotate(-8)"><rect x="-150" y="-95" width="300" height="190" rx="18" fill="#7C5CFF" stroke="${INK}" stroke-width="7"/><rect x="-110" y="-30" width="60" height="44" rx="8" fill="${on?P.gold:'#C9A46A'}" stroke="${INK}" stroke-width="4"/>${on?`<circle cx="-80" cy="-8" r="70" fill="url(#gGold)"/>`:''}</g>
   ${T(960,150,on?'POWER FROM THIN AIR':'TAP TO PAY',{size:96,fill:on?P.gold:P.white,sc:on?pop(t,(p.enter??5)+1.5):1})}${on?T(960,880,'NO BATTERY NEEDED',{size:60,fill:WV}):''}`;
},
microwave(t,d,p,g){
  const pw=AT(t,p.power??11);
  return `${card('cardDark',g)}<g transform="translate(${pw?560:960},560)"><rect x="-300" y="-190" width="600" height="380" rx="24" fill="#D8DEE8" stroke="${INK}" stroke-width="9"/><rect x="-270" y="-160" width="400" height="320" rx="14" fill="#111"/>
   <rect x="-270" y="-160" width="400" height="320" rx="14" fill="${WV}" opacity="${.25+.15*Math.sin(g*8)}"/><circle cx="-70" r="${200+Math.sin(g*6)*20}" fill="url(#gMint)" opacity=".7"/>
   <rect x="160" y="-150" width="110" height="300" rx="10" fill="#B8C0CC" stroke="${INK}" stroke-width="5"/></g>
   ${pw?`<g>${T(1360,330,'ROUTER  0.1 W',{size:56,fill:WV})}<rect x="1180" y="370" width="${6}" height="40" fill="${WV}"/>${T(1360,560,'MICROWAVE  1,000 W',{size:56,fill:P.gold})}<rect x="1100" y="600" width="520" height="40" fill="${P.gold}"/>${T(1360,760,'10,000× MORE',{size:80,fill:P.white,sc:pop(t,(p.power??11)+5.5)})}</g>`:''}
   ${T(960,140,'SAME WAVE: 2.4 GHz',{size:96,fill:WV,sc:IN(t,p.same??3)})}`;
},
wifiStreet(t,d,p,g){
  let houses='';[260,620,980,1340,1700].forEach((x,i)=>{houses+=`<path d="M${x-130} 900 V700 L${x} 590 L${x+130} 700 V900Z" fill="#0E1426" stroke="#2A3550" stroke-width="6"/>${wifiWaves(x,760,g+i*.31,{n:4,max:260,op:.45,w:5})}<circle cx="${x}" cy="760" r="12" fill="${WV}"/>`;});
  const tower=AT(t,p.tower??14), a=g*1.4;
  return `${wvBg()}${houses}
   ${tower?`<path d="M1500 560 L1560 160 L1620 560Z" fill="none" stroke="${WV2}" stroke-width="8"/><circle cx="1560" cy="170" r="30" fill="${WV2}"/>
     <path d="M1560 170 L${1560+Math.cos(a)*1400} ${170+Math.sin(a)*500} L${1560+Math.cos(a+.25)*1400} ${170+Math.sin(a+.25)*500}Z" fill="${WV2}" opacity=".18"/>`:''}
   ${T(960,130,tower?'THE CELL TOWER LIGHTHOUSE':'EVERY HOUSE GLOWS',{size:84,fill:tower?WV2:WV,sc:pop(t,tower?(p.tower??14):.2)})}`;
},
radioRadar(t,d,p,g){
  const radar=AT(t,p.radar??8.7), a=g*2;
  let rip='';for(let i=0;i<4;i++){const k=((g*.25+i/4)%1);rip+=`<path d="M-100 ${640-k*20} ${[...Array(12)].map((_,j)=>`q90 ${j%2?60:-60} 180 0`).join(' ')}" stroke="${P.gold}" stroke-width="8" fill="none" opacity="${.7*(1-k)}" transform="translate(${k*300},${-k*420})"/>`;}
  return `${wvBg()}${rip}<path d="M0 900 ${[...Array(20)].map((_,i)=>`H${i*100+60} V${700-((i*53)%180)} H${i*100+100} V900`).join(' ')} H1920 V1080 H0Z" fill="#0E1426"/>
   ${radar?`<g transform="translate(1500,700)"><path d="M-70 120 L0 0 L70 120Z" fill="#2A3550"/><ellipse rx="110" ry="40" fill="#D8DEE8" stroke="${INK}" stroke-width="6" transform="rotate(${Math.sin(a)*30})"/>
     <path d="M0 0 L${Math.cos(a-1.6)*1600} ${Math.sin(a-1.6)*1600} L${Math.cos(a-1.5)*1600} ${Math.sin(a-1.5)*1600}Z" fill="${P.mint}" opacity=".2"/></g>`:''}
   ${T(960,130,radar?'AIRPORT RADAR':'RADIO: 3-METER WAVES',{size:90,fill:radar?P.mint:P.gold,sc:pop(t,radar?(p.radar??8.7):.2)})}`;
},
wifiSky(t,d,p,g){
  const cmb=prog(t,p.cmb??28,(p.cmb??28)+4), sun=AT(t,p.sun??20);
  const r=rng(77);let speck='';for(let i=0;i<220;i++)speck+=`<circle cx="${r()*1920}" cy="${r()*900}" r="${3+r()*8}" fill="${r()>.5?'#FF7A6B':'#6BA8FF'}" opacity="${cmb*.25*r()}"/>`;
  let gps='';for(let i=0;i<6;i++){const x=(i*340+g*20)%2100-100;gps+=`<circle cx="${x}" cy="${160+i*70}" r="7" fill="${WV}" opacity=".9"/><circle cx="${x}" cy="${160+i*70}" r="30" fill="url(#gMint)" opacity=".5"/>`;}
  return `<rect width="1920" height="1080" fill="#03040A"/>${speck}${gps}
   ${sun?`<circle cx="1620" cy="260" r="90" fill="${P.warm}"/>${wifiWaves(1620,260,g,{n:4,max:300,col:P.warm,op:.5,w:6})}`:''}
   <path d="M0 1080 V920 ${[...Array(24)].map((_,i)=>`L${i*80+40} ${900-((i*31)%60)} L${i*80+80} 920`).join(' ')} V1080Z" fill="#0A0716"/>
   ${T(960,cmb>0?500:130,cmb>0?'THE BIG BANG\'S AFTERGLOW':'GPS SATELLITES',{size:cmb>0?100:84,fill:cmb>0?'#FFB4A2':WV,sc:pop(t,cmb>0?(p.cmb??28):.2)})}${cmb>.5?T(960,620,'13.8 BILLION YEARS OLD',{size:60,fill:P.white}):''}`;
},
safeWaves(t,d,p,g){
  return `${card('cardMint',g)}<rect x="160" y="440" width="1600" height="90" rx="45" fill="url(#gMint)" stroke="${INK}" stroke-width="7"/>
   <path d="M1240 400 V580" stroke="${P.red}" stroke-width="10" stroke-dasharray="16 10"/>${T(1500,380,'IONIZING (X-RAYS, UV)',{size:42,fill:P.red})}${T(560,380,'NON-IONIZING',{size:42,fill:P.mint})}
   ${icon('home',380,660,.6)}${T(380,780,'WIFI',{size:40,fill:P.white})}${icon('check',560,660,.7*pop(t,1.5))}
   ${T(960,170,'IS IT DANGEROUS?',{size:96,fill:P.white,sc:IN(t,.2)})}${AT(t,p.harm??23)?T(960,860,'A HARMLESS LIGHT SHOW',{size:76,fill:P.mint,sc:pop(t,p.harm??23)}):''}`;
},
seesYou(t,d,p,g){
  const breath=AT(t,p.breath??22);
  let wave='';for(let i=0;i<=120;i++)wave+=`${i?'L':'M'}${1100+i*6} ${820+Math.sin((i/120)*12+g*2)*30*(breath?1:.2)}`;
  return `${wvBg()}<rect x="900" y="200" width="70" height="680" fill="#2A3550" stroke="${INK}" stroke-width="8"/>
   ${wifiWaves(420,520,g,{max:900,op:.5})}${router(420,520,1)}
   <g transform="translate(1400,${560+Math.sin(g*2)*4})">${extra({x:0,y:0,s:.9,t:g,head:'#FFD3A8'}).replace(/stroke="#FFF6EA"/g,`stroke="${WV}"`)}</g>
   <rect x="1080" y="760" width="760" height="120" rx="16" fill="#0B1026" stroke="${WV}" stroke-width="4"/><path d="${wave}" stroke="${P.mint}" stroke-width="6" fill="none"/>
   ${T(1460,730,breath?'BREATHING DETECTED':'MOTION DETECTED',{size:44,fill:P.mint})}
   ${T(960,130,AT(t,p.sees??21)?'IT CAN SEE YOU':'THROUGH WALLS',{size:100,fill:WV,sc:pop(t,AT(t,p.sees??21)?p.sees??21:.2)})}`;
}
});

// ===================== episode 005 scenes (plants scream) =====================
const LEAF='#4FC36A', LEAFD='#2E8A47', CLK='#FFE14D';
function plPot(x,y,s=1,o={}){const {g=0,dry=0,tomato=true,cut=false}=o;const sw=Math.sin(g*1.3)*3;
  const lc=dry>.5?'#9DA35A':LEAF;
  let lv='';[[-60,-120,-30],[60,-150,30],[-50,-210,-40],[55,-250,35],[0,-300,0]].forEach(([lx,ly,a],i)=>lv+=`<ellipse cx="${lx}" cy="${ly+dry*20}" rx="44" ry="20" fill="${lc}" stroke="${INK}" stroke-width="6" transform="rotate(${a+dry*(i%2?25:-25)} ${lx} ${ly})"/>`);
  return `<g transform="translate(${x},${y}) scale(${s}) rotate(${sw})"><path d="M0 -10 Q${dry*20} -150 0 -300" stroke="${LEAFD}" stroke-width="12" fill="none" stroke-linecap="round"/>${cut?`<path d="M-20 -180 L20 -170" stroke="${P.red}" stroke-width="8"/>`:''}${lv}
   ${tomato?`<circle cx="40" cy="-110" r="26" fill="${P.red}" stroke="${INK}" stroke-width="6"/><circle cx="-36" cy="-180" r="20" fill="${P.red}" stroke="${INK}" stroke-width="5"/>`:''}
   <path d="M-80 -10 H80 L62 100 H-62Z" fill="#C7683E" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><rect x="-90" y="-24" width="180" height="26" rx="8" fill="#D9804F" stroke="${INK}" stroke-width="7"/></g>`;}
function plClick(x,y,g,phase=0,o={}){const {rate=1.3,size=1,label=true}=o;const k=((g*rate+phase)%1);if(k>.35)return '';const e=k/.35;
  let r='';for(let i=0;i<8;i++){const a=i*Math.PI/4;r+=`<path d="M${x+Math.cos(a)*(14+e*30)*size} ${y+Math.sin(a)*(14+e*30)*size} L${x+Math.cos(a)*(30+e*46)*size} ${y+Math.sin(a)*(30+e*46)*size}" stroke="${CLK}" stroke-width="${7*size}" stroke-linecap="round" opacity="${1-e}"/>`;}
  return r+(label?T(x+60*size,y-50*size,'click',{size:40*size,fill:CLK,op:1-e,stroke:8}):'');}
function plClicksAt(t,list,x,y){return (list||[]).map((a,i)=>{const k=t-a;if(k<0||k>.7)return '';const e=k/.7;let r='';for(let j=0;j<10;j++){const an=j*Math.PI/5;r+=`<path d="M${x+Math.cos(an)*(20+e*60)} ${y+Math.sin(an)*(20+e*60)} L${x+Math.cos(an)*(50+e*110)} ${y+Math.sin(an)*(50+e*110)}" stroke="${CLK}" stroke-width="10" stroke-linecap="round" opacity="${1-e}"/>`;}return r+T(x+(i%2?150:-150),y-120,'CLICK!',{size:80,fill:CLK,sc:1+e*.3,op:1-e*e});}).join('');}
function plGarden(g){return `<rect width="1920" height="1080" fill="url(#sky)"/><circle cx="1600" cy="200" r="90" fill="#FFE9A8" opacity=".9"/><path d="M0 820 Q480 760 960 800 T1920 790 V1080 H0Z" fill="#1F4A2E"/><path d="M0 880 H1920 V1080 H0Z" fill="#183A24"/>`;}
Object.assign(SHOTS,{
plantHook(t,d,p,g){
  return `${plGarden(g)}${plPot(1180,820,1.5,{g})}${glint({x:620,y:560,s:1.05,t:g,pose:'reach',mouth:AT(t,(p.clicks||[99])[0])?'o':'smile',brows:AT(t,(p.clicks||[99])[0])?'raised':'calm',blink:BL(g)})}
   ${plClicksAt(t,p.clicks,1180,450)}${p.label?T(960,150,p.label,{size:110,fill:CLK,sc:IN(t,p.labelAt)}):''}`;
},
soundBox(t,d,p,g){
  const box=(x,lab,on,rate,col,o)=>`<g transform="translate(${x},0)"><rect x="-230" y="260" width="460" height="560" rx="24" fill="#152238" stroke="${col}" stroke-width="8"/><path d="M-230 300 H230" stroke="${col}" stroke-width="3" opacity=".4"/>
     ${plPot(0,760,.95,{g,...o})}<g transform="translate(150,330)"><rect x="-14" y="0" width="28" height="70" rx="14" fill="#9AA7BD" stroke="${INK}" stroke-width="5"/><path d="M0 70 V120" stroke="#9AA7BD" stroke-width="6"/></g>
     ${on?plClick(0,430,g,x*.001,{rate,label:false}):''}${T(0,890,lab,{size:46,fill:col})}</g>`;
  const th=AT(t,p.thirsty??12), cu=AT(t,p.cut??17);
  return `${bgLab(g)}${box(420,'HEALTHY',false,0,P.mint,{})}${box(960,'THIRSTY',th,1.6,CLK,{dry:1})}${box(1500,'CUT',cu,1.2,P.coral,{cut:true})}
   ${AT(t,p.quiet??7)?T(420,220,'< 1 / hour',{size:52,fill:P.white,sc:pop(t,p.quiet??7)}):''}${th?T(960,220,'~35 / hour',{size:52,fill:CLK,sc:pop(t,p.thirsty??12)}):''}
   ${AT(t,p.loud??31)?`<g transform="translate(960,${150})">${labelPill(0,0,'AS LOUD AS A CONVERSATION (UP CLOSE)',P.gold,44)}</g>`:T(960,130,'THE EXPERIMENT',{size:90,fill:P.white,sc:IN(t,.2)})}`;
},
hzPlants(t,d,p,g){
  const X=f=>240+f*16.5, pl=AT(t,p.plants??4.4);
  return `${card('cardDark',g)}<rect x="240" y="560" width="1440" height="40" rx="20" fill="#22305A" stroke="${INK}" stroke-width="6"/>
   <rect x="240" y="560" width="${X(20)-240}" height="40" rx="20" fill="${P.mint}"/>${T(X(10),520,'YOU HEAR',{size:46,fill:P.mint})}${T(X(20),660,'20 kHz',{size:40,fill:P.white,stroke:7})}
   ${pl?`<rect x="${X(40)}" y="560" width="${X(80)-X(40)}" height="40" rx="20" fill="${CLK}" opacity="${pop(t,p.plants??4.4)}"/>${T(X(60),520,'PLANT CLICKS',{size:46,fill:CLK,sc:pop(t,p.plants??4.4)})}${T(X(40),660,'40',{size:40,fill:'#fffa',stroke:7})}${T(X(80),660,'80 kHz',{size:40,fill:'#fffa',stroke:7})}`:''}
   ${AT(t,p.ultra??8.4)?T(960,820,'ULTRASONIC',{size:110,fill:CLK,sc:pop(t,p.ultra??8.4)}):''}${AT(t,p.bat??9.7)?bat(1560,300,1.3,g*10):''}
   ${T(960,170,'TOO HIGH TO HEAR',{size:96,fill:P.white,sc:IN(t,.2)})}`;
},
popcorn(t,d,p,g){
  let wv='';for(let i=0;i<=160;i++){const x=200+i*9.5, sp=((i*7)%23===0)?(1-((g*2+i*.05)%1))*160:0;wv+=`${i?'L':'M'}${x} ${560+Math.sin(i*.9)*6-sp}`;}
  const r=rng(31);let pc='';for(let i=0;i<14;i++){const ph=r();const k=((g*.8+ph)%1);if(k<.5){pc+=`<g transform="translate(${200+r()*1520},${700-k*200}) scale(${pop(k,0,.12)*.9})"><circle r="30" fill="#FFF3C4" stroke="${INK}" stroke-width="6"/><circle cx="20" cy="-14" r="22" fill="#FFF3C4" stroke="${INK}" stroke-width="6"/><circle cx="-18" cy="-16" r="20" fill="#FFF3C4" stroke="${INK}" stroke-width="6"/></g>`;}else r();}
  return `${card('cardWarm',g)}<path d="${wv}" stroke="${INK}" stroke-width="14" fill="none"/><path d="${wv}" stroke="${CLK}" stroke-width="6" fill="none"/>${pc}
   ${T(960,170,AT(t,p.bubble??5.4)?'LIKE BUBBLE WRAP':'SLOWED DOWN: POPCORN',{size:90,fill:P.white,sc:pop(t,AT(t,p.bubble??5.4)?p.bubble??5.4:.2)})}`;
},
sillPlant(t,d,p,g){
  const ai=AT(t,p.ai??17), farm=AT(t,p.farm??28);
  return `${bgRoom(g)}<rect x="1150" y="530" width="580" height="40" rx="8" fill="#8A6A4A" stroke="${INK}" stroke-width="6"/>${plPot(1440,520,.9,{g,dry:.8,tomato:false})}${plClick(1440,300,g,0,{rate:.45})}
   ${glint({x:560,y:600,s:1,t:g,mouth:AT(t,p.thirst??10.4)?'o':'smile',brows:'raised',blink:BL(g),look:1})}
   ${AT(t,p.thirst??10.4)&&!ai?bubble(1440,180,420,110,'WATER ME!',{size:56,tail:'right'}):''}
   ${ai?`<g transform="translate(960,${farm?260:280})"><rect x="-330" y="-110" width="660" height="220" rx="20" fill="#0B1026" stroke="${P.mint}" stroke-width="6"/>${[...Array(40)].map((_,i)=>`<rect x="${-300+i*15}" y="${-Math.abs(Math.sin(i*1.7+g*3))*60}" width="9" height="${Math.abs(Math.sin(i*1.7+g*3))*120+4}" fill="${P.mint}"/>`).join('')}${T(0,160,'AI: "THIRSTY"',{size:50,fill:P.mint})}</g>`:''}
   ${farm?T(560,930,'FARMS THAT LISTEN',{size:70,fill:CLK,sc:pop(t,p.farm??28)}):''}`;
},
xylem(t,d,p,g){
  const pop0=p.pop??12;let tubes='';for(let i=0;i<4;i++){const x=560+i*260;tubes+=`<rect x="${x-50}" y="160" width="100" height="760" rx="50" fill="#0E2A3A" stroke="${LEAF}" stroke-width="8"/>`;
    for(let k=0;k<6;k++){const y=900-(((g*.25+k/6+i*.13)%1)*720);tubes+=`<circle cx="${x+Math.sin(y*.05)*10}" cy="${y}" r="16" fill="${P.iceDeep}" opacity=".8"/>`;}
    const bt=t-pop0-i*.35;if(bt>-2.5){const b=prog(bt,-2.5,0);tubes+=bt<0?`<circle cx="${x}" cy="${500+i*40}" r="${8+b*36}" fill="#fff" opacity=".85" stroke="${INK}" stroke-width="4"/>`:(bt<.6?plClick(x,500+i*40,0,0,{label:false,size:1.4}).replace(/opacity="1"/g,''):'')}
  }
  return `${card('cardDark',g)}${tubes}${T(1500,300,'WATER',{size:48,fill:P.iceDeep})}${AT(t,pop0-2.5)?T(1500,420,'AIR BUBBLES',{size:48,fill:P.white}):''}
   ${T(960,110,AT(t,pop0)?'POP = CLICK':'LIKE A LONG STRAW',{size:90,fill:AT(t,pop0)?CLK:P.white,sc:pop(t,AT(t,pop0)?pop0:.2)})}${AT(t,p.ship??14.5)?T(960,1000-80,'A SOUND OF STRESS, NOT PAIN',{size:56,fill:P.mint}):''}`;
},
mothListen(t,d,p,g){
  const mx=900+Math.sin(g*1.2)*260, my=360+Math.sin(g*2.1)*60, fl=Math.sin(g*30)*.5+.5;
  return `${plGarden(g)}${plPot(1400,840,1.3,{g,dry:1})}${plClick(1400,480,g,0,{rate:1.4})}${plPot(520,840,1.3,{g})}
   <g transform="translate(${mx},${my})"><ellipse rx="26" ry="16" fill="#C8B07A" stroke="${INK}" stroke-width="5"/><path d="M-6 -6 Q-80 ${-80*fl-20} -110 -10 Q-70 20 -6 6Z M6 -6 Q80 ${-80*fl-20} 110 -10 Q70 20 6 6Z" fill="#E6D3A0" stroke="${INK}" stroke-width="5"/>
   ${[1,2].map(i=>`<path d="M30 -20 a${i*30} ${i*30} 0 0 1 0 40" stroke="${P.mint}" stroke-width="5" fill="none" opacity="${.5+.5*Math.sin(g*5+i)}"/>`).join('')}</g>
   ${T(960,130,AT(t,p.choose??12)?'NOT THIS ONE...':'MOTHS HEAR ULTRASOUND',{size:84,fill:P.white,sc:pop(t,AT(t,p.choose??12)?p.choose??12:.2)})}
   ${AT(t,p.unproven??17.3)?stamp(960,290,.7,'NOT PROVEN YET',P.gold,-6):''}`;
},
beeFlower(t,d,p,g){
  const sw=prog(t,p.sweet??6,(p.sweet??6)+2.5), bx=1300+Math.sin(g*2)*30, by=330+Math.sin(g*3)*20, wf=Math.sin(g*40);
  return `${plGarden(g)}<path d="M760 900 Q770 700 760 560" stroke="${LEAFD}" stroke-width="16" fill="none"/>${[0,72,144,216,288].map(a=>`<ellipse cx="760" cy="440" rx="60" ry="110" fill="#FFE97A" stroke="${INK}" stroke-width="7" transform="rotate(${a} 760 540) "/>`).join('')}<circle cx="760" cy="540" r="50" fill="#F5A623" stroke="${INK}" stroke-width="7"/>
   <g transform="translate(${bx},${by})"><ellipse rx="56" ry="38" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><path d="M-20 -36 V36 M8 -38 V38" stroke="${INK}" stroke-width="10"/><ellipse cx="-10" cy="-50" rx="30" ry="${16+wf*10}" fill="#fff" opacity=".7" stroke="${INK}" stroke-width="4"/></g>
   ${[1,2,3].map(i=>`<path d="M${bx-80-i*40} ${by-50} q-30 50 0 100" stroke="${P.white}" stroke-width="5" fill="none" opacity="${.3+.6*((g*3+i/3)%1)}"/>`).join('')}
   <g transform="translate(1600,780)"><rect x="-40" y="-240" width="80" height="240" rx="20" fill="#22305A" stroke="${INK}" stroke-width="6"/><rect x="-28" y="${-12-sw*200}" width="56" height="${sw*200}" rx="14" fill="${P.gold}"/>${T(0,60,'SWEETNESS',{size:36,fill:P.gold,stroke:7})}</g>
   ${T(960,130,AT(t,p.sweet??6)?'SWEETER IN 3 MINUTES':'FLOWERS HEAR BEES',{size:90,fill:AT(t,p.sweet??6)?P.gold:P.white,sc:pop(t,AT(t,p.sweet??6)?p.sweet??6:.2)})}`;
},
caterpillarVib(t,d,p,g){
  const play=AT(t,p.play??5.6), def=prog(t,p.defend??9.1,(p.defend??9.1)+2), ch=Math.sin(g*14)*6;
  return `${card('cardMint',g)}<g transform="translate(520,560)"><path d="M-260 0 Q0 -200 260 0 Q0 200 -260 0Z" fill="${LEAF}" stroke="${INK}" stroke-width="9"/><path d="M-240 0 H240" stroke="${LEAFD}" stroke-width="6"/>
     <g transform="translate(${100+ch},-40)">${[0,1,2,3,4].map(i=>`<circle cx="${-i*38}" cy="${Math.sin(g*6+i)*6}" r="26" fill="#9BE15D" stroke="${INK}" stroke-width="5"/>`).join('')}<circle cx="0" cy="0" r="6" fill="${INK}"/></g>
     ${[1,2,3].map(i=>`<path d="M${280+i*40} -60 q30 60 0 120" stroke="${INK}" stroke-width="6" fill="none" opacity="${.3+.7*((g*4+i/3)%1)}"/>`).join('')}</g>
   ${play?`<g transform="translate(1050,560)"><path d="M-40 -40 H0 L50 -90 V90 L0 40 H-40Z" fill="#2A3248" stroke="${INK}" stroke-width="6"/></g>${plPot(1460,880,1.25,{g})}
     <circle cx="1460" cy="560" r="${220+def*40}" fill="none" stroke="${P.violet}" stroke-width="${10*def}" opacity="${def*.8}"/>`:''}
   ${T(960,130,def>0?'SHIELDS UP':'RECORDED: CHEWING',{size:90,fill:def>0?P.violet:P.white,sc:pop(t,def>0?(p.defend??9.1):.2)})}`;
},
peaRoots(t,d,p,g){
  const gr=eout(prog(t,.5,6));
  let roots='';for(let i=0;i<5;i++){const a=-.6+i*.3;roots+=`<path d="M960 420 Q${960+Math.cos(a)*100} ${500+i*20} ${960+gr*(380+i*30)} ${520+i*60}" stroke="#F3E2B8" stroke-width="${10-i}" fill="none" stroke-linecap="round"/>`;}
  return `${card('cardDark',g)}<rect x="300" y="380" width="1320" height="560" rx="30" fill="#3B2A20" stroke="${INK}" stroke-width="10"/><rect x="1480" y="380" width="80" height="560" fill="#22305A" stroke="${INK}" stroke-width="7"/>
   ${[...Array(6)].map((_,i)=>`<circle cx="1520" cy="${400+((g*120+i*95)%540)}" r="14" fill="${P.iceDeep}"/>`).join('')}${roots}
   <path d="M960 380 V230" stroke="${LEAFD}" stroke-width="12"/><ellipse cx="920" cy="250" rx="44" ry="20" fill="${LEAF}" stroke="${INK}" stroke-width="5"/><ellipse cx="1000" cy="230" rx="44" ry="20" fill="${LEAF}" stroke="${INK}" stroke-width="5"/>
   ${T(1520,330,'SEALED PIPE',{size:40,fill:P.iceDeep,stroke:7})}${T(760,140,AT(t,p.hear??7)?'ONLY HEAR IT':'ROOTS FIND WATER',{size:84,fill:P.white,sc:pop(t,AT(t,p.hear??7)?p.hear??7:.2)})}`;
},
crackleStreet(t,d,p,g){
  const rain=prog(t,p.rain??25,(p.rain??25)+3), tr=AT(t,p.trees??15);
  let hedges='';for(let i=0;i<6;i++){const x=180+i*320;hedges+=`<ellipse cx="${x}" cy="800" rx="150" ry="90" fill="${rain>.5?LEAF:'#8C9B4A'}" stroke="${INK}" stroke-width="7"/>${rain<.8?plClick(x,720,g,i*.17,{rate:1.6,label:i%2==0}):''}`;}
  let trees='';if(tr)for(let i=0;i<4;i++){const x=300+i*440;trees+=`<path d="M${x} 700 V480" stroke="#5A3A22" stroke-width="30"/><circle cx="${x}" cy="400" r="140" fill="${rain>.5?'#3F9F57':'#7A8A40'}" stroke="${INK}" stroke-width="8"/>${rain<.8?plClick(x,360,g,i*.29,{rate:1.2,label:false}):''}`;}
  let drops='';if(rain>0)for(let i=0;i<70;i++){const x=(i*137)%1920, y=((g*900+i*71)%1080);drops+=`<path d="M${x} ${y} l-8 30" stroke="#BFEFFF" stroke-width="4" opacity="${rain*.8}"/>`;}
  return `<rect width="1920" height="1080" fill="${rain>.3?'#2A3550':'#3A6EA5'}"/>${rain<.3?`<circle cx="1650" cy="180" r="100" fill="#FFE14D"/>`:''}${trees}<rect y="860" width="1920" height="220" fill="#2A2A33"/>${hedges}${drops}
   ${T(960,130,rain>.3?'THE GARDEN GOES CALM':tr?'FORESTS CRACKLE TOO':'THE STREET IS CRACKLING',{size:84,fill:rain>.3?P.iceDeep:CLK,sc:pop(t,rain>.3?(p.rain??25):tr?(p.trees??15):.2)})}`;
},
mower(t,d,p,g){
  const mx=lerp(-200,2100,prog(t,.3,(p.end??11)));
  let grass='';for(let i=0;i<96;i++){const x=i*20+5, cut=x<mx;grass+=`<path d="M${x} 960 l8 ${cut?-30:-130}" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M${x} 960 l8 ${cut?-30:-130}" stroke="${cut?'#6FD67F':LEAF}" stroke-width="9" stroke-linecap="round"/>`;}
  let smell='';for(let i=0;i<8;i++){const k=((g*.4+i/8)%1);if(mx>i*240)smell+=`<circle cx="${i*240+Math.sin(g+i)*40}" cy="${820-k*500}" r="${40+k*60}" fill="#B6F25A" opacity="${.6*(1-k)}"/>`;}
  return `${plGarden(g)}${grass}${smell}<g transform="translate(${mx},880) scale(1.6)"><rect x="-90" y="-50" width="180" height="70" rx="16" fill="${P.coral}" stroke="${INK}" stroke-width="7"/><path d="M-80 -50 L-200 -200" stroke="${INK}" stroke-width="10"/><circle cx="-60" cy="30" r="24" fill="#333" stroke="${INK}" stroke-width="5"/><circle cx="60" cy="30" r="24" fill="#333" stroke="${INK}" stroke-width="5"/></g>
   ${AT(t,p.clicks??99)?[...Array(6)].map((_,i)=>mx>i*320?plClick(i*320+80,820,g,i*.21,{rate:1.8,label:false}):'').join(''):''}
   ${T(960,130,AT(t,p.warn??11)?'A WARNING SIGNAL':'THAT CUT-GRASS SMELL',{size:90,fill:AT(t,p.warn??11)?'#9BE15D':P.white,sc:pop(t,AT(t,p.warn??11)?p.warn??11:.2)})}`;
},
cornWasp(t,d,p,g){
  const ws=prog(t,p.wasp??6,(p.wasp??6)+3), wx=lerp(1900,1060,ws), wy=300+Math.sin(g*4)*40;
  let smell='';for(let i=0;i<6;i++){const k=((g*.35+i/6)%1);smell+=`<circle cx="${900+k*700}" cy="${500-k*150+Math.sin(g*2+i)*30}" r="${30+k*50}" fill="#C9F27A" opacity="${.4*(1-k)}"/>`;}
  return `${plGarden(g)}<g transform="translate(860,900)"><path d="M0 0 V-600" stroke="${LEAFD}" stroke-width="22"/>${[-1,1,-1,1].map((s,i)=>`<path d="M0 ${-120-i*120} Q${s*160} ${-200-i*120} ${s*260} ${-120-i*120}" stroke="${LEAF}" stroke-width="22" fill="none" stroke-linecap="round"/>`).join('')}<rect x="20" y="-420" width="54" height="150" rx="27" fill="${CLK}" stroke="${INK}" stroke-width="6"/>
     <g transform="translate(-150,-330)">${[0,1,2,3].map(i=>`<circle cx="${-i*30}" cy="0" r="20" fill="#9BE15D" stroke="${INK}" stroke-width="5"/>`).join('')}</g></g>${smell}
   <g transform="translate(${wx},${wy})"><ellipse rx="44" ry="18" fill="#1a1a1a" stroke="${CLK}" stroke-width="5"/><path d="M-10 -10 V10 M10 -10 V10" stroke="${CLK}" stroke-width="6"/><ellipse cx="0" cy="-26" rx="34" ry="${10+Math.sin(g*40)*6}" fill="#fff" opacity=".6"/><path d="M44 0 L66 6" stroke="${INK}" stroke-width="5"/></g>
   ${T(960,130,AT(t,p.backup??14)?'IT CALLED FOR BACKUP':'A SMELL FOR HELP',{size:90,fill:AT(t,p.backup??14)?P.coral:'#C9F27A',sc:pop(t,AT(t,p.backup??14)?p.backup??14:.2)})}`;
},
kitchenPlant(t,d,p,g){
  const list=AT(t,p.list??18);
  return `${bgRoom(g)}<rect x="0" y="700" width="1920" height="60" fill="#8A6A4A" stroke="${INK}" stroke-width="6"/>${plPot(1180,700,1,{g,tomato:false})}
   <rect x="1400" y="660" width="320" height="40" rx="10" fill="#C99A6A" stroke="${INK}" stroke-width="6"/><circle cx="1560" cy="640" r="44" fill="${P.red}" stroke="${INK}" stroke-width="7"/>
   ${plClicksAt(t,p.clicks,1260,420)}${glint({x:560,y:520,s:1,t:g,mouth:list?'smile':'o',brows:list?'calm':'raised',blink:BL(g),pose:'point'})}
   ${list?`<g transform="translate(960,200)">${['NO BRAIN','NO NERVES','NO FEAR'].map((s,i)=>AT(t,(p.list??18)+i*.9)?labelPill(-560+i*560,0,s,P.mint,48):'').join('')}</g>`:T(960,170,'SHOULD YOU FEEL GUILTY?',{size:84,fill:P.white,sc:pop(t,p.guilt??10)*(AT(t,p.guilt??10)?1:0)})}`;
},
loudWorld(t,d,p,g){
  const a=AT(t,p.bats??0), b=AT(t,p.wifi??2.5), c=AT(t,p.plants??5.2);
  return `${nightSky(g)}${hill(g)}${a?bat(480,300,1.4,g*10)+`<circle cx="480" cy="300" r="${120+((g*.8)%1)*200}" fill="none" stroke="${P.mint}" stroke-width="5" opacity="${1-((g*.8)%1)}"/>`:''}
   ${b?router(960,640,1)+wifiWaves(960,640,g,{n:4,max:400,op:.5}):''}${c?plPot(1440,900,1.2,{g})+plClick(1440,560,g,0,{rate:1.3}):''}
   ${AT(t,p.louder??8)?T(960,160,'LOUDER THAN YOU THINK',{size:96,fill:P.white,sc:pop(t,p.louder??8)}):''}`;
}
});
