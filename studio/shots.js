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
   ${AT(t,p.next??1.8)?`<g transform="translate(1340,540) scale(${pop(t,p.next??1.8)})"><rect x="-380" y="-260" width="760" height="520" rx="30" fill="url(#future)" stroke="${P.mint}" stroke-width="12"/>
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
