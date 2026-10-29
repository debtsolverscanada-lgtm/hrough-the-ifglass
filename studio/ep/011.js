// episode 011 scenes (fly time / slow motion)
const f11_RED='#E0344A', f11_WING='#CFEFFF', f11_SKY='#7CC4FF';
// ghost trail: draws fn(k) for k=1..0 (1 = oldest) with fading opacity
function f11_ghost(n,fn,maxOp=.35){let s='';for(let i=n;i>=1;i--){s+=`<g opacity="${(maxOp*(1-i/(n+1))).toFixed(3)}">${fn(i/n)}</g>`;}return s+fn(0);}
// cartoon fly, top-down, facing up (rot to turn)
function f11_fly(x,y,s,g,o={}){
  const {rot=0,wings='flap',crouch=0,legs=1,eyes=1}=o;
  const wa = wings==='flap'?28+Math.sin(g*50)*22: wings==='still'?20:28;
  const wing=(a,op=.75)=>`<g transform="rotate(${a})"><ellipse cx="0" cy="-95" rx="34" ry="80" fill="${f11_WING}" opacity="${op}" stroke="${INK}" stroke-width="6"/><path d="M0 -30 V-160 M0 -90 L-18 -130 M0 -90 L18 -130" stroke="#7FA9C4" stroke-width="3" opacity="${op}"/></g>`;
  let W='';
  if(wings==='blur'){for(let k=0;k<7;k++){const a=10+k*12;W+=`<g transform="translate(-16,-10)">${wing(-a,.18)}</g><g transform="translate(16,-10)">${wing(a,.18)}</g>`;}}
  else W=`<g transform="translate(-16,-10)">${wing(-wa)}</g><g transform="translate(16,-10)">${wing(wa)}</g>`;
  const ls=[[-1,-20],[-1,10],[-1,40],[1,-20],[1,10],[1,40]].map(([sd,yy],i)=>{const sp=(1-crouch)*40+crouch*70, dy=(i%3-1)*30*(1-crouch*.5);
    return `<path d="M${sd*20} ${yy} L${sd*(sp+10)} ${yy+dy-10} L${sd*(sp+34)} ${yy+dy+18}" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;}).join('');
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">${legs?ls:''}
   <ellipse cx="0" cy="55" rx="40" ry="60" fill="#3A4150" stroke="${INK}" stroke-width="8"/><path d="M-34 45 Q0 58 34 45 M-30 75 Q0 88 30 75" stroke="#5E6A80" stroke-width="7" fill="none"/>
   ${W}<circle cx="0" cy="-5" r="42" fill="#2A2E38" stroke="${INK}" stroke-width="8"/><path d="M-20 -30 Q0 -40 20 -30" stroke="#55607A" stroke-width="6" fill="none"/>
   <circle cx="0" cy="-58" r="30" fill="#2A2E38" stroke="${INK}" stroke-width="7"/>
   ${eyes?`<circle cx="-27" cy="-68" r="27" fill="${f11_RED}" stroke="${INK}" stroke-width="7"/><circle cx="27" cy="-68" r="27" fill="${f11_RED}" stroke="${INK}" stroke-width="7"/>
   <circle cx="-34" cy="-78" r="8" fill="#fff" opacity=".85"/><circle cx="20" cy="-78" r="8" fill="#fff" opacity=".85"/>
   ${[[-20,-58],[-30,-60],[-24,-50],[34,-58],[24,-60],[30,-50]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="3" fill="#8A1828"/>`).join('')}`:''}</g>`;
}
function f11_ball(x,y,r,rot=0,col='#FFF6EA'){ // baseball
  const st=[...Array(9)].map((_,i)=>{const a=-.9+i*.22;const px=Math.cos(a)*r*.62-r*.55,py=Math.sin(a)*r*.62;return `<path d="M${px-8} ${py-6} l14 10" stroke="${P.red}" stroke-width="${r*.05+1}" stroke-linecap="round"/><path d="M${-px+8} ${py-6} l-14 10" stroke="${P.red}" stroke-width="${r*.05+1}" stroke-linecap="round"/>`;}).join('');
  return `<g transform="translate(${x},${y}) rotate(${rot})"><circle r="${r}" fill="${col}" stroke="${INK}" stroke-width="${Math.max(4,r*.07)}"/>
   <path d="M${-r*.55} ${-r*.8} Q${r*.15} 0 ${-r*.55} ${r*.8}" stroke="${P.red}" stroke-width="${r*.05+1}" fill="none"/><path d="M${r*.55} ${-r*.8} Q${-r*.15} 0 ${r*.55} ${r*.8}" stroke="${P.red}" stroke-width="${r*.05+1}" fill="none"/>
   ${r>60?st:''}<circle cx="${-r*.35}" cy="${-r*.4}" r="${r*.18}" fill="#fff" opacity=".6"/></g>`;
}
function f11_swatter(x,y,s,rot=0){
  let grid='';for(let i=-3;i<=3;i++){grid+=`<path d="M${i*36} -150 V150 M-130 ${i*42} H130" stroke="${INK}" stroke-width="4" opacity=".55"/>`;}
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-14" y="150" width="28" height="420" rx="12" fill="#FFC83D" stroke="${INK}" stroke-width="8"/>
   <rect x="-140" y="-170" width="280" height="330" rx="40" fill="${P.red}" stroke="${INK}" stroke-width="10"/><g clip-path="none">${grid}</g>
   <rect x="-140" y="-170" width="280" height="330" rx="40" fill="none" stroke="${INK}" stroke-width="10"/></g>`;
}
function f11_paperRoll(x,y,s,rot=0){
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-40" y="-330" width="80" height="420" rx="30" fill="#EDE6D6" stroke="${INK}" stroke-width="9"/>
   <path d="M-30 -260 H30 M-30 -200 H30 M-30 -140 H20 M-30 -80 H30" stroke="#9A9284" stroke-width="7"/><ellipse cx="0" cy="-330" rx="40" ry="14" fill="#D9D0BC" stroke="${INK}" stroke-width="7"/></g>`;
}
function f11_bulb(x,y,s,on,g=0){
  return `<g transform="translate(${x},${y}) scale(${s})">${on>0?`<circle r="${230}" fill="url(#gGold)" opacity="${on}"/>`:''}
   <path d="M0 -150 V-90" stroke="${INK}" stroke-width="10"/><rect x="-34" y="-100" width="68" height="50" rx="8" fill="#9AA7BD" stroke="${INK}" stroke-width="7"/>
   <circle cy="10" r="80" fill="${on>.5?'#FFE58A':'#5A5A6E'}" stroke="${INK}" stroke-width="9"/>
   <path d="M-24 10 l12 -24 l12 24 l12 -24" stroke="${on>.5?P.warm:'#3A3A4E'}" stroke-width="7" fill="none"/><path d="M-50 -20 a60 60 0 0 1 30 -40" stroke="#fff" stroke-width="9" fill="none" opacity=".5" stroke-linecap="round"/></g>`;
}
function f11_fan(x,y,r,ang,blur=0){ // seen from below, perspective
  const blade=a=>`<g transform="rotate(${a})"><path d="M0 -18 C${r*.3} -40 ${r*.95} -44 ${r} -10 C${r*.95} 20 ${r*.3} 22 0 18Z" fill="#C9A46A" stroke="${INK}" stroke-width="8"/></g>`;
  let b='';
  if(blur>0){b+=`<circle r="${r}" fill="#C9A46A" opacity=".28"/>`;for(let k=0;k<4;k++)for(let i=0;i<4;i++)b+=`<g opacity=".14">${blade(ang+i*90+k*22)}</g>`;}
  else for(let i=0;i<4;i++)b+=blade(ang+i*90);
  return `<g transform="translate(${x},${y}) scale(1,.42)">${b}<circle r="42" fill="#8A6A4A" stroke="${INK}" stroke-width="9"/></g><path d="M${x} ${y-120} V${y-14}" stroke="${INK}" stroke-width="12"/>`;
}
function f11_hummer(x,y,s,g,o={}){
  const {blur=false,wa=0}=o;
  const wing=a=>`<g transform="translate(-10,-30) rotate(${a})"><path d="M0 0 C-40 -60 -150 -120 -210 -90 C-150 -40 -60 -10 0 0Z" fill="#9FE3C4" stroke="${INK}" stroke-width="7"/></g>`;
  let W='';
  if(blur){for(let k=0;k<9;k++)W+=`<g opacity=".16">${wing(-60+k*15)}</g>`;W+=`<ellipse cx="-110" cy="-60" rx="140" ry="110" fill="#CFF7E6" opacity=".2"/>`;}
  else W=wing(wa);
  return `<g transform="translate(${x},${y}) scale(${s})">
   <path d="M-60 40 L-150 110 L-110 50Z" fill="#2E8B6A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
   <ellipse cx="0" cy="10" rx="90" ry="55" transform="rotate(-25)" fill="#3DBE8C" stroke="${INK}" stroke-width="8"/>
   <path d="M20 40 Q50 30 70 0" stroke="${P.red}" stroke-width="18" fill="none" stroke-linecap="round"/>
   <circle cx="75" cy="-50" r="44" fill="#3DBE8C" stroke="${INK}" stroke-width="8"/><path d="M112 -55 L230 -40" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
   <circle cx="88" cy="-58" r="10" fill="${INK}"/><circle cx="91" cy="-61" r="3" fill="#fff"/>${W}</g>`;
}
function f11_flower(x,y,s,g){
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M0 0 Q${Math.sin(g)*10} 160 0 360" stroke="#2E8B6A" stroke-width="16" fill="none"/><path d="M0 200 q60 -40 100 -10 q-50 30 -100 10" fill="#3DBE8C" stroke="${INK}" stroke-width="6"/>
   ${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-60" rx="38" ry="64" transform="rotate(${a+Math.sin(g)*4})" fill="#FF6BD6" stroke="${INK}" stroke-width="7"/>`).join('')}<circle r="34" fill="${P.gold}" stroke="${INK}" stroke-width="7"/></g>`;
}
function f11_turtle(x,y,s,g,o={}){
  const step=Math.sin(g*1.2)*6;
  return `<g transform="translate(${x},${y}) scale(${s*(o.dir||1)},${s})"><ellipse cx="0" cy="70" rx="150" ry="16" fill="rgba(0,0,0,.3)"/>
   <path d="M-100 30 v40 M-50 40 v34 M50 40 v34 M100 30 v40" stroke="#7DBE6A" stroke-width="30" stroke-linecap="round" transform="translate(${step},0)"/>
   <path d="M120 0 q50 -10 70 10 q10 30 -20 36 q-30 4 -50 -20" fill="#7DBE6A" stroke="${INK}" stroke-width="8"/><circle cx="170" cy="8" r="7" fill="${INK}"/>
   <path d="M-140 40 Q-140 -110 0 -110 Q140 -110 140 40Z" fill="#4E8A3E" stroke="${INK}" stroke-width="9"/>
   <path d="M-70 -70 L-30 -20 L30 -20 L70 -70 M-30 -20 L-50 38 M30 -20 L50 38 M-100 0 L-50 10 M100 0 L50 10" stroke="#2E5A24" stroke-width="7" fill="none"/></g>`;
}
function f11_bird(x,y,s,g,col='#7C5CFF'){
  const w=Math.sin(g*14)*40;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-70 10 L-120 -10 L-110 30Z" fill="${col}" stroke="${INK}" stroke-width="6"/><ellipse rx="80" ry="48" fill="${col}" stroke="${INK}" stroke-width="7"/>
   <circle cx="70" cy="-30" r="36" fill="${col}" stroke="${INK}" stroke-width="7"/><path d="M100 -32 L140 -22 L100 -14Z" fill="${P.gold}" stroke="${INK}" stroke-width="5"/><circle cx="80" cy="-38" r="7" fill="${INK}"/>
   <path d="M-10 -10 Q-40 ${-60-w} -90 ${-50-w}" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-10 -10 Q-40 ${-60-w} -90 ${-50-w}" stroke="${col}" stroke-width="12" fill="none" stroke-linecap="round"/></g>`;
}
function f11_clock(x,y,r,speed,g,lab='',col=P.white){
  const a=g*speed*60;
  return `<g transform="translate(${x},${y})"><circle r="${r}" fill="#FFF6EA" stroke="${INK}" stroke-width="9"/>${[...Array(12)].map((_,i)=>`<path d="M0 ${-r+10} V${-r+22}" stroke="${INK}" stroke-width="5" transform="rotate(${i*30})"/>`).join('')}
   <path d="M0 0 V${-r*.78}" stroke="${P.red}" stroke-width="7" stroke-linecap="round" transform="rotate(${a})"/><path d="M0 0 V${-r*.5}" stroke="${INK}" stroke-width="9" stroke-linecap="round" transform="rotate(${a/12})"/><circle r="9" fill="${INK}"/>
   ${lab?T(0,r+70,lab,{size:44,fill:col,stroke:8}):''}</g>`;
}
function f11_screen(x,y,w,h,inner,col='#0A0818'){
  return `<g transform="translate(${x},${y})"><rect x="${-w/2-16}" y="${-h/2-16}" width="${w+32}" height="${h+32}" rx="18" fill="#2A2450" stroke="${INK}" stroke-width="10"/>
   <rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" fill="${col}"/>${inner}</g>`;
}
function f11_watch(x,y,s,num,g){
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-70" y="-260" width="140" height="520" rx="30" fill="#3B4A78" stroke="${INK}" stroke-width="9"/>
   <rect x="-170" y="-130" width="340" height="260" rx="36" fill="#22305A" stroke="${INK}" stroke-width="10"/><rect x="-140" y="-100" width="280" height="200" rx="16" fill="#0A1A12" stroke="${INK}" stroke-width="6"/>
   <text y="62" text-anchor="middle" font-size="170" font-weight="900" fill="#7CFF6B" font-family="monospace">${num}</text></g>`;
}
function f11_panel(x,y,w,h,inner,lab,col,k=1){
  return `<g transform="translate(${x},${y}) scale(${k})"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="26" fill="#1A1638" stroke="${col}" stroke-width="10"/>${inner}${lab?T(0,h/2+64,lab,{size:46,fill:col,stroke:8}):''}</g>`;
}
function f11_micro(x,y,s,txt){
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-190" y="-120" width="380" height="240" rx="20" fill="#DDE3EE" stroke="${INK}" stroke-width="9"/><rect x="-160" y="-90" width="230" height="180" rx="12" fill="#2A3248" stroke="${INK}" stroke-width="6"/>
   <circle cx="-45" cy="0" r="50" fill="#FFC83D" opacity=".35"/><rect x="90" y="-90" width="80" height="50" rx="6" fill="#0A1A12" stroke="${INK}" stroke-width="5"/><text x="130" y="-54" text-anchor="middle" font-size="32" font-weight="900" fill="#7CFF6B" font-family="monospace">${txt}</text>
   ${[0,1,2].map(i=>`<circle cx="${110+i*25}" cy="30" r="9" fill="#9AA7BD" stroke="${INK}" stroke-width="4"/>`).join('')}</g>`;
}
function f11_car(x,y,s,col){
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-110" y="-40" width="220" height="70" rx="20" fill="${col}" stroke="${INK}" stroke-width="7"/><path d="M-70 -40 L-40 -90 H40 L70 -40" fill="${col}" stroke="${INK}" stroke-width="7"/><path d="M-50 -46 L-32 -80 H-6 V-46Z M6 -46 V-80 H32 L50 -46Z" fill="#BFEFFF"/>
   <circle cx="-60" cy="32" r="26" fill="${INK}"/><circle cx="60" cy="32" r="26" fill="${INK}"/><circle cx="-110" cy="-10" r="10" fill="${P.red}"/></g>`;
}
function f11_net(x,y,w){return `<g transform="translate(${x},${y})"><path d="M${-w/2} 0 Q0 60 ${w/2} 0" stroke="${P.gold}" stroke-width="10" fill="none"/>${[...Array(9)].map((_,i)=>`<path d="M${-w/2+i*w/8} ${Math.sin(i/8*Math.PI)*0} L${-w/2+i*w/8} ${Math.sin(i/8*Math.PI)*60}" stroke="${P.gold}" stroke-width="4" opacity=".7"/>`).join('')}<path d="M${-w/2} 0 V80 M${w/2} 0 V80" stroke="${INK}" stroke-width="12"/></g>`;}
function f11_tower(x,y){ // top at y, base 860
  const h=860-y;let rungs='';for(let i=0;i<h/60;i++)rungs+=`<path d="M-70 ${i*60} L70 ${i*60+60} M70 ${i*60} L-70 ${i*60+60}" stroke="#5D6A82" stroke-width="7"/>`;
  return `<g transform="translate(${x},${y})"><rect x="-70" y="0" width="140" height="${h}" fill="none" stroke="#9AA7BD" stroke-width="12"/>${rungs}<rect x="-110" y="-24" width="220" height="30" rx="8" fill="#9AA7BD" stroke="${INK}" stroke-width="7"/></g>`;
}

Object.assign(SHOTS,{
flyHook(t,d,p,g){
  const B=p.ball??4.2, S=p.swat??8.7, M=p.movie??13.5;
  const ph = AT(t,M)?3:AT(t,S)?2:AT(t,B)?1:0;
  let art='', gl={x:960,y:560,s:1,mouth:'o',brows:'raised',look:0,legs:'stand',pose:'down'};
  if(ph===0){ art=`${f11_fly(1500,330,.9,g,{rot:-20})}${f11_fly(420,300,.6,g+1,{rot:25})}`; gl.mouth='grin'; gl.pose='wave';
    art+=T(960,170,'SLOW MOTION',{size:130,fill:P.mint,sc:IN(t,.3)}); }
  if(ph===1){ const k=prog(t,B,S); const bx=k2=>lerp(1750,1180,k2), by=k2=>420+Math.sin(k2*3)*40;
    art=f11_ghost(5,q=>{const kk=Math.max(0,k-q*.08);return f11_ball(bx(kk),by(kk),70,kk*120);},.3);
    gl.look=1; gl.mouth='smile'; art+=T(1380,230,'LIKE A BALLOON',{size:80,fill:P.ice,sc:IN(t,B+.4)}); }
  if(ph===2){ const k=prog(t,S,M); const sw=q=>{const kk=Math.max(0,k-q*.07);return f11_swatter(lerp(1550,1100,kk),lerp(60,380,kk),.85,lerp(-50,-8,kk));};
    art=f11_ghost(5,sw,.3); gl.x=lerp(960,520,eout(prog(t,S+.6,S+3))); gl.legs=t<S+3?'walk':'stand'; gl.mouth='smirk'; gl.brows='calm'; gl.look=1;
    art+=T(860,170,'ALL THE TIME IN THE WORLD',{size:76,fill:P.gold,sc:IN(t,S+.8)}); }
  if(ph===3){ const fr=Math.floor((t-M)*1.6)%3; const inner=[0,1,2].map(i=>i===fr?`${extra({x:-140+i*140,y:-10,s:.42,t:0,head:['#9AD1FF','#FFB4A2','#C3B1FF'][i],pose:['down','point','up'][i]})}`:'').join('');
    art=f11_screen(1250,470,700,420,inner,'#22305A')+T(1250,800,'CLICK... CLICK... CLICK',{size:56,fill:P.white,stroke:9})+T(1250,160,'A SLIDESHOW',{size:96,fill:P.gold,sc:pop(t,M+.2)});
    gl.x=440; gl.mouth='flat'; gl.brows='sad'; }
  return `${bgRoom(g)}${art}${glint({...gl,t:g,blink:BL(g)})}`;
},
flyTeaser(t,d,p,g){
  const E=p.end??3;
  if(!AT(t,E)){ const sw=Math.max(0,Math.sin(g*3)); const fx=1150+Math.sin(g*2.3)*260, fy=420+Math.cos(g*3.1)*140;
    return `${bgRoom(g)}${f11_fly(fx,fy,.7,g,{rot:Math.sin(g*2)*40})}
     ${f11_swatter(lerp(1600,1350,sw),lerp(380,520,sw),.7,lerp(-60,-10,sw))}
     ${glint({x:520,y:560,s:1,t:g,pose:'shrug',mouth:'frown',brows:'angry',blink:BL(g),sweat:1})}${T(960,160,'WHY ARE FLIES SO HARD TO CATCH?',{size:76,fill:P.white,sc:IN(t,.2)})}`; }
  const c=[[400,'FLY',8,f11_fly(400,640,.7,g)],[960,'YOU',1,glint({x:960,y:600,s:.55,t:g,mouth:'o',blink:BL(g)})],[1520,'TURTLE',.15,f11_turtle(1520,720,.9,g)]];
  return `${card('cardDark',g)}${c.map(([x,l,sp,art],i)=>`<g opacity="${prog(t,E+i*.5,E+i*.5+.3)}">${f11_clock(x,360,110,sp,g)}${art}${T(x,880,l,{size:56,fill:[P.coral,P.mint,'#7DBE6A'][i],stroke:9})}</g>`).join('')}
   ${T(960,150,'EVERY CREATURE, ITS OWN TIME',{size:80,fill:P.gold,sc:pop(t,E)})}`;
},
flyFlicker(t,d,p,g){
  const C=p.cam??2.9, L=p.limit??6.1, F=p.flick??9.4, S=p.glow??13.2;
  if(!AT(t,F)){
    const eye=`<g transform="translate(${AT(t,C)?560:960},540)"><ellipse rx="230" ry="140" fill="#fff" stroke="${INK}" stroke-width="12"/><circle cx="${Math.sin(g*1.5)*40}" r="90" fill="#3B8FD9" stroke="${INK}" stroke-width="8"/><circle cx="${Math.sin(g*1.5)*40}" r="44" fill="${INK}"/><circle cx="${Math.sin(g*1.5)*40-22}" cy="-26" r="14" fill="#fff"/></g>`;
    const cam=AT(t,C)&&!AT(t,L)?`<g transform="translate(1380,540) scale(${pop(t,C)})"><rect x="-170" y="-110" width="280" height="220" rx="24" fill="#5D6A82" stroke="${INK}" stroke-width="10"/><path d="M110 -40 L200 -100 V100 L110 40Z" fill="#3B4A78" stroke="${INK}" stroke-width="9"/><circle cx="-30" r="60" fill="#22305A" stroke="${INK}" stroke-width="9"/><circle cx="130" cy="-150" r="18" fill="${P.red}" opacity="${.5+.5*Math.sin(g*6)}"/></g>${T(960,540,'≠',{size:200,fill:P.white})}${T(1380,800,'NOT A CAMERA',{size:60,fill:P.coral,stroke:9})}`:'';
    const lim=AT(t,L)?`<g transform="translate(1380,500) scale(${pop(t,L)})"><circle r="190" fill="#fff" stroke="${P.red}" stroke-width="40"/><circle r="210" fill="none" stroke="${INK}" stroke-width="8"/><text y="20" text-anchor="middle" font-size="90" font-weight="900" fill="${INK}">LIMIT</text></g>${T(1380,800,'HOW FAST CAN IT KEEP UP?',{size:52,fill:P.gold,stroke:9})}`:'';
    return `${card('cardIce',g)}${eye}${cam}${lim}${T(960,150,'HOW DO YOU SEE MOVEMENT?',{size:90,fill:P.white,sc:IN(t,.2)})}`;
  }
  const hz=lerp(1.2,7,prog(t,F,S)); const on=AT(t,S)?1:((t*hz)%1<.5?1:0);
  return `${card('cardDark',g)}${f11_bulb(960,520,1.5,on,g)}
   ${T(960,150,AT(t,S)?'A STEADY GLOW':'FLICKER... FLICKER...',{size:96,fill:AT(t,S)?P.gold:P.white,sc:pop(t,AT(t,S)?S:F)})}
   ${labelPill(960,850,AT(t,S)?'TOO FAST TO SEE THE FLICKER':'FASTER... AND FASTER',AT(t,S)?P.gold:P.ice,44)}`;
},
flyMeter(t,d,p,g){
  const fly=p.mode==='fly', F=p.fly??3.4, X=p.x4??8.2;
  const x0=520, W=1180, sc=v=>v/300*W;
  const yk=fly?1:eout(prog(t,.4,2)), fk=fly?eout(prog(t,F,F+2.2)):0;
  const tick=[0,60,100,200,250,300].map(v=>`<path d="M${x0+sc(v)} 760 v20" stroke="${P.steel}" stroke-width="5"/><text x="${x0+sc(v)}" y="820" text-anchor="middle" font-size="34" font-weight="800" fill="${P.steel}">${v}</text>`).join('');
  const dot=(x,y,hz,col)=>`<circle cx="${x}" cy="${y}" r="34" fill="${col}" opacity="${(g*hz)%1<.5?1:.15}" stroke="${INK}" stroke-width="6"/>`;
  return `${card('cardDark',g)}<path d="M${x0} 760 H${x0+W}" stroke="${P.steel}" stroke-width="6"/>${tick}
   <g transform="translate(300,400)">${glint({s:.5,t:g,mouth:fly&&AT(t,X)?'o':'smile',brows:fly&&AT(t,X)?'raised':'calm',blink:BL(g)})}</g>
   <rect x="${x0}" y="390" width="${Math.max(1,sc(60)*yk)}" height="90" rx="20" fill="${P.mint}" stroke="${INK}" stroke-width="7"/>
   ${yk>.95?T(x0+sc(60)+160,460,'~60 / s',{size:66,fill:P.mint,stroke:10}):''}
   ${fly||p.tease?`${f11_fly(330,640,.5,g)}<rect x="${x0}" y="590" width="${Math.max(1,sc(250)*fk)}" height="90" rx="20" fill="${P.coral}" stroke="${INK}" stroke-width="7"/>
     ${fk>.95?T(Math.min(x0+sc(250)+150,1780),660,'~250 / s',{size:60,fill:P.coral,stroke:10}):''}`:''}
   ${fly&&AT(t,X)?T(1150,300,'ABOUT 4x FASTER',{size:76,fill:P.gold,sc:pop(t,X)}):''}
   ${T(960,150,'FLASHES PER SECOND YOU CAN SEE',{size:76,fill:P.white,sc:IN(t,.2)})}`;
},
flyFilm(t,d,p,g){
  const N=p.n24??4.9, B=p.blend??7.8;
  if(AT(t,B)){ const ph=(g*.6)%1; const x=-260+ph*520;
    return `${card('cardMint',g)}${f11_screen(960,500,900,520,`${f11_ghost(4,q=>f11_ball(x-q*90,0,60,(x-q*90)*1.5),.3)}`,'#22305A')}
     ${T(960,150,'YOUR BRAIN BLENDS THEM',{size:90,fill:P.white,sc:pop(t,B)})}${labelPill(960,860,'SMOOTH MOTION',P.mint,56)}`; }
  const off=(g*140)%300; let fr='';
  for(let i=-1;i<8;i++){const x=i*300-off+150; const k=((i+Math.floor(g*140/300))%6+6)%6;
    fr+=`<rect x="${x-120}" y="380" width="240" height="220" rx="8" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/>${f11_ball(x-80+k*32,490-Math.sin(k/5*Math.PI)*70,26,k*30)}`;}
  let holes='';for(let i=-1;i<34;i++){const x=i*60-(off%60);holes+=`<rect x="${x}" y="335" width="30" height="24" rx="5" fill="#FFF6EA" opacity=".8"/><rect x="${x}" y="622" width="30" height="24" rx="5" fill="#FFF6EA" opacity=".8"/>`;}
  return `${card('cardMint',g)}<rect x="0" y="320" width="1920" height="340" fill="#1A1A22" stroke="${INK}" stroke-width="8"/>${holes}${fr}
   ${T(960,150,'A MOVIE = STILL PICTURES',{size:90,fill:P.white,sc:IN(t,.2)})}
   ${AT(t,N)?T(960,820,'24 EVERY SECOND',{size:96,fill:P.gold,sc:pop(t,N)}):''}`;
},
flySwat(t,d,p,g){
  const k=ease(prog(t,.5,d-.3));
  const roll=q=>{const kk=Math.max(0,k-q*.05);return f11_paperRoll(460,900,1.3,lerp(-40,55,kk));};
  return `${bgRoom(g)}<rect x="1100" y="700" width="760" height="40" rx="10" fill="#7A5A3A" stroke="${INK}" stroke-width="7"/>
   ${f11_ghost(6,roll,.28)}${f11_fly(1460,600,.55,g,{wings:'still'})}
   <g transform="translate(1460,420)">${bubble(0,0,420,110,'SO... SLOW...',{size:52,tail:'left'})}</g>
   ${T(960,150,"YOUR HAND, TO A FLY",{size:96,fill:P.white,sc:IN(t,.2)})}${labelPill(700,860,'SLOW MOTION',P.coral,50)}`;
},
flyEscape(t,d,p,g){
  const S=p.swoop??1, W=p.where??8, L=p.legs??11.5, J=p.launch??13, B=p.before??16.6, U=p.luck??19.6;
  if(AT(t,U)) return `${card('cardGold',g)}${f11_fly(960,560,1.3,g)}${icon('bolt',1450,440,1.1*pop(t,U+.4))}${T(960,170,'A BRAIN BUILT FOR SPEED',{size:96,fill:P.gold,sc:pop(t,U)})}${T(960,880,'NOT LUCK',{size:64,fill:P.white,op:prog(t,U+.3,U+.6)})}`;
  const sw=eout(prog(t,S,W+1)); const jk=eout(prog(t,J,J+2.5));
  const fx=lerp(1060,1600,jk), fy=lerp(640,300,jk);
  const thr=`<g transform="translate(${lerp(260,640,sw)},${lerp(160,380,sw)})"><circle r="${120+sw*30}" fill="#0A0818" stroke="${INK}" stroke-width="8"/><circle r="${150+sw*40}" fill="none" stroke="${P.red}" stroke-width="6" opacity=".5"/></g>`;
  const frame=String(Math.floor(t*240)).padStart(5,'0');
  return `${bgLab(g)}<rect x="900" y="700" width="320" height="30" rx="8" fill="#9AA7BD" stroke="${INK}" stroke-width="6"/>
   <g transform="translate(1650,780)"><rect x="-110" y="-70" width="200" height="140" rx="16" fill="#5D6A82" stroke="${INK}" stroke-width="8"/><circle cx="-110" r="44" fill="#22305A" stroke="${INK}" stroke-width="8"/></g>
   ${AT(t,S)?thr:''}${AT(t,W)&&!AT(t,J)?`<path d="M${lerp(260,640,sw)+150} ${lerp(160,380,sw)+80} L960 590" stroke="${P.gold}" stroke-width="10" stroke-dasharray="20 14"/>`:''}
   ${AT(t,J)?f11_ghost(5,q=>{const kk=Math.max(0,jk-q*.12);return f11_fly(lerp(1060,1600,kk),lerp(640,300,kk),.55,g,{rot:50,wings:'blur'});},.3):f11_fly(fx,fy,.55,g,{wings:'still',crouch:AT(t,L)?1:0})}
   ${T(1700,120,'FRAME '+frame,{size:40,fill:P.mint,stroke:7,anchor:'end'})}
   ${T(760,150,AT(t,B)?'ALL IN A FRACTION OF A SECOND':'HIGH-SPEED CAMERA',{size:80,fill:AT(t,B)?P.gold:P.white,sc:pop(t,AT(t,B)?B:.2)})}
   ${[[W,'1. WHERE IS IT?'],[L,'2. ADJUST LEGS'],[J,'3. LAUNCH AWAY']].map(([a,s],i)=>AT(t,a)?labelPill(380,640+i*100,s,[P.ice,P.gold,P.coral][i],42):'').join('')}`;
},
flyFan(t,d,p,g){
  const Wk=p.wake??3, Sp=p.spin??4.1, See=p.see??6.1;
  const seen=AT(t,See);
  const ang=seen?g*25:g*900;
  return `${bgRoom(g)}<rect x="0" y="0" width="1920" height="120" fill="#101830"/>${f11_fan(960,250,330,ang,seen?0:1)}
   ${seen?[0,1,2,3].map(i=>AT(t,See+.6+i*.7)?T(960+Math.cos((ang+i*90)*Math.PI/180)*250,250+Math.sin((ang+i*90)*Math.PI/180)*105+18,String(i+1),{size:60,fill:P.gold,stroke:10}):'').join(''):''}
   <rect x="1180" y="720" width="560" height="110" rx="20" fill="#3B4A78" stroke="${INK}" stroke-width="8"/>
   ${glint({x:760,y:600,s:.85,t:g,mouth:seen?'o':'smile',brows:seen?'raised':'calm',eyes:AT(t,Wk)?'open':'closed',look:-.3,blink:BL(g),glint:seen?1:0})}
   ${!AT(t,Wk)?T(1400,480,'FLY-SPEED VISION: ON',{size:70,fill:P.mint,sc:IN(t,.2)}):''}
   ${seen?labelPill(1460,600,'ONE BY ONE',P.gold,50):AT(t,Sp)?labelPill(1460,600,'SPINNING',P.ice,50):''}`;
},
flyStrobe(t,d,p,g){
  const O=p.fast??2.5, S=p.strobe??8.5, N=p.club??10.4;
  const strobe=AT(t,S); const on=strobe?((g*2.4)%1<.5?1:.25):1;
  const club=AT(t,N);
  const beams=club?[0,1,2,3].map(i=>{const a=Math.sin(g*.8+i*1.6)*40;return `<path d="M960 140 L${960+Math.tan((a-14)*Math.PI/180)*800} 900 L${960+Math.tan((a+14)*Math.PI/180)*800} 900Z" fill="${['#FF6BD6',P.mint,P.gold,'#7C5CFF'][i]}" opacity=".18"/>`;}).join(''):'';
  return `<rect width="1920" height="1080" fill="#2A2F4A"/><rect y="640" width="1920" height="440" fill="#3B3550"/>
   <rect x="120" y="560" width="1680" height="80" fill="#C9A46A" stroke="${INK}" stroke-width="8"/>
   ${[0,1,2,3,4].map(i=>`<rect x="${160+i*330}" y="660" width="290" height="230" rx="10" fill="#4A4060" stroke="${INK}" stroke-width="6"/><circle cx="${400+i*330}" cy="700" r="8" fill="${P.gold}"/>`).join('')}
   <path d="M960 0 V100" stroke="${INK}" stroke-width="8"/><path d="M960 100 L760 900 H1160Z" fill="#FFE58A" opacity="${.22*on}"/>${beams}
   <path d="M880 100 H1040 L1010 150 H910Z" fill="#DDE3EE" stroke="${INK}" stroke-width="7"/><ellipse cx="960" cy="155" rx="44" ry="18" fill="${on>.5?'#FFE58A':'#5A5A6E'}" stroke="${INK}" stroke-width="5"/>
   ${glint({x:330,y:640,s:.72,t:g,mouth:strobe?'wavy':'smile',brows:strobe?'sad':'calm',lid:strobe?.35:0,blink:BL(g),look:.6})}
   ${AT(t,O)&&!strobe?labelPill(1420,380,'TOO FAST TO NOTICE',P.ice,46):''}
   ${strobe?T(1350,360,club?'NIGHTCLUB. FOREVER.':'STROBING',{size:76,fill:club?'#FF6BD6':P.gold,sc:pop(t,club?N:S)}):''}`;
},
flyWater(t,d,p,g){
  const S=p.see??1.5, seen=AT(t,S);
  let stream='';
  if(!seen) stream=`<path d="M950 300 V780" stroke="#7CC4FF" stroke-width="34" stroke-linecap="round" opacity=".9"/>`;
  else{ let dpath='M950 300';for(let y=300;y<=560;y+=10){dpath+=` L${950+Math.sin(y*.04-g*1.2)*((y-300)/260)*14} ${y}`;}
    stream=`<path d="${dpath}" stroke="#7CC4FF" stroke-width="30" stroke-linecap="round" fill="none"/>`;
    for(let i=0;i<7;i++){const k=((g*.12+i/7)%1);const y=580+k*220;stream+=f11_ghost(3,q=>`<ellipse cx="${950+Math.sin(i*2.1)*14}" cy="${y-q*22}" rx="${16-i%3*2}" ry="${20-i%3*2}" fill="#9FD8FF" stroke="${INK}" stroke-width="4"/>`,.25);} }
  return `${card('cardIce',g)}<path d="M720 220 H960 V300 H920 V250 H720Z" fill="#9AA7BD" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
   ${stream}<path d="M860 760 L880 900 H1020 L1040 760" fill="#DDF3FF" opacity=".6" stroke="${INK}" stroke-width="8"/>
   ${glint({x:1450,y:560,s:.9,t:g,mouth:seen?'o':'smile',brows:seen?'raised':'calm',look:-1,blink:BL(g)})}
   ${seen?`${labelPill(560,430,'TWIST',P.ice,50)}${labelPill(560,690,'DROPLETS',P.mint,50)}`:''}
   ${T(960,140,seen?'WATER, IN SLOW MOTION':'YOU POUR SOME WATER',{size:88,fill:P.white,sc:pop(t,seen?S:.2)})}`;
},
flyHummer(t,d,p,g){
  const N=p.blur??3.4, S=p.see??5.7, seen=AT(t,S);
  const hx=800+Math.sin(g*1.3)*20, hy=440+Math.sin(g*2.1)*14;
  const bird=seen?f11_ghost(3,q=>f11_hummer(hx,hy,1.1,g,{wa:Math.sin(g*3-q*.5)*55}),.25):f11_hummer(hx,hy,1.1,g,{blur:true});
  return `<rect width="1920" height="1080" fill="#8FD3FF"/><circle cx="1650" cy="200" r="110" fill="#FFF2B0"/><rect y="820" width="1920" height="260" fill="#5FBF6A"/>
   ${f11_flower(1240,470,1,g)}${bird}
   ${AT(t,N)&&!seen?labelPill(800,180,'NORMALLY: A BLUR',P.ice,50):''}${seen?T(800,170,'BACK... AND FORTH',{size:90,fill:P.white,sc:pop(t,S)}):''}`;
},
flyPitch(t,d,p,g){
  const D=p.decide??6.4, Gs=p.guess??11.1;
  const ph=(g*.7)%1, bx=lerp(420,1500,ph), by=520+ph*60;
  return `<rect width="1920" height="1080" fill="#1E3A2A"/><path d="M0 620 Q960 560 1920 620 V1080 H0Z" fill="#3E8A4A"/><path d="M200 700 H1750" stroke="#C9A46A" stroke-width="40" opacity=".5"/>
   ${extra({x:300,y:420,s:.75,t:g,head:'#FFB4A2',pose:'point'})}${extra({x:1620,y:420,s:.75,t:g,head:'#9AD1FF',pose:'hold'})}
   <path d="M1600 470 L1730 300" stroke="#C9A46A" stroke-width="22" stroke-linecap="round"/><path d="M1600 470 L1730 300" stroke="${INK}" stroke-width="4" fill="none" opacity=".4"/>
   <path d="M${bx-260} ${by} H${bx}" stroke="#fff" stroke-width="30" opacity=".25" stroke-linecap="round"/>${f11_ball(bx,by,24,g*900)}
   ${AT(t,D)?`<path d="M960 300 V720" stroke="${P.gold}" stroke-width="10" stroke-dasharray="24 16"/>${T(960,280,'DECIDE BEFORE HERE',{size:50,fill:P.gold,stroke:8,sc:pop(t,D)})}`:''}
   ${AT(t,Gs)?`<g transform="translate(1680,190)">${bubble(0,0,280,120,'GUESS?',{size:60,tail:'left'})}</g>`:''}
   ${T(660,150,'UNDER 0.5 SECONDS',{size:96,fill:P.white,sc:IN(t,.2)})}`;
},
flySeams(t,d,p,g){
  const R=p.seams??3, K=p.think??4.6;
  return `${card('cardDark',g)}${f11_ball(700,540,250,g*25)}
   ${[0,1,2].map(i=>`<path d="M${420-i*40} ${380+i*160} q-60 0 -120 20" stroke="${P.ice}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".6"/>`).join('')}
   ${glint({x:1450,y:600,s:.9,t:g,mouth:AT(t,K)?'smirk':'o',brows:'raised',look:-1,blink:BL(g),glint:AT(t,R)?1:0})}
   ${AT(t,K)?`<g transform="translate(1500,230)">${bubble(0,0,440,120,'CURVEBALL. EASY.',{size:46,tail:'left'})}</g>`:''}
   ${T(700,150,AT(t,R)?'READ THE SEAMS':'YOU SEE IT SPIN',{size:96,fill:AT(t,R)?P.gold:P.white,sc:pop(t,AT(t,R)?R:.2)})}`;
},
flyGoalie(t,d,p,g){
  const Dg=p.dodge??2.1, Bs=p.best??4.4;
  const goal=`<path d="M560 860 V340 H1360 V860" stroke="#fff" stroke-width="22" fill="none"/>${[...Array(12)].map((_,i)=>`<path d="M${600+i*64} 360 V860" stroke="#fff" stroke-width="3" opacity=".3"/>`).join('')}${[...Array(8)].map((_,i)=>`<path d="M580 ${400+i*60} H1340" stroke="#fff" stroke-width="3" opacity=".3"/>`).join('')}`;
  let art='';
  if(!AT(t,Dg)){ const k=prog(t,0,1.6); art=f11_ghost(5,q=>{const kk=Math.max(0,k-q*.1);return f11_ball(lerp(1800,1080,kk),lerp(800,400,kk),46,kk*200,'#FFFFFF');},.3)+glint({x:960,y:560,s:.85,t:g,pose:k>=1?'up':'reach',mouth:'grin',blink:BL(g)})+T(960,160,'CATCH: EASY',{size:96,fill:P.mint,sc:IN(t,.2)}); }
  else if(!AT(t,Bs)){ const k=prog(t,Dg,Dg+2); art=f11_ghost(5,q=>{const kk=Math.max(0,k-q*.1);return f11_ball(lerp(1800,300,kk),lerp(420,400,kk),46,kk*300,'#FFFFFF');},.3)+glint({x:960,y:600,s:.85,t:g,rot:-18,pose:'shrug',mouth:'smirk',blink:BL(g)})+T(960,160,'DODGE: EASY',{size:96,fill:P.ice,sc:pop(t,Dg)}); }
  else art=`<g transform="translate(1500,520) scale(${pop(t,Bs+.3)})"><path d="M-90 -120 H90 Q90 40 0 60 Q-90 40 -90 -120Z" fill="${P.gold}" stroke="${INK}" stroke-width="9"/><path d="M-90 -90 Q-160 -90 -140 -20 Q-120 20 -70 10 M90 -90 Q160 -90 140 -20 Q120 20 70 10" stroke="${INK}" stroke-width="9" fill="none"/><rect x="-20" y="60" width="40" height="60" fill="${P.gold}" stroke="${INK}" stroke-width="7"/><rect x="-80" y="120" width="160" height="40" rx="8" fill="#7A5A3A" stroke="${INK}" stroke-width="7"/></g>`
     +glint({x:960,y:560,s:.85,t:g,pose:'flex',mouth:'grin',blink:BL(g),glint:1})+T(960,160,'BEST GOALKEEPER EVER',{size:96,fill:P.gold,sc:pop(t,Bs)});
  return `<rect width="1920" height="1080" fill="#1E3A2A"/><rect y="760" width="1920" height="320" fill="#3E8A4A"/>${goal}${art}`;
},
flyBoring(t,d,p,g){
  const S=p.slow??1.1, Bo=p.boring??4.4, M=p.micro??6.5, Tr=p.traffic??8.1, Le=p.lecture??9.6, St=p.stretch??11.3;
  if(!AT(t,M)) return `${card('cardWarm',g)}${glint({x:560,y:560,s:1.05,t:g,mouth:AT(t,Bo)?'flat':'frown',brows:'sad',blink:BL(g),pose:AT(t,Bo)?'cross':'shrug'})}
     ${T(1300,AT(t,S)?380:520,"BUT THERE'S A CATCH",{size:80,fill:P.white,sc:IN(t,.2)})}${AT(t,S)?T(1300,560,'EVERYTHING',{size:110,fill:P.gold,sc:pop(t,S)})+T(1300,700,'IS SLOW',{size:110,fill:P.gold,sc:pop(t,S+.3)}):''}
     ${AT(t,Bo)?labelPill(1300,840,'INCLUDING THE BORING STUFF',P.coral,44):''}`;
  const secs=59-Math.floor((t-M)*.25);
  const pans=[[340,M,f11_micro(0,-10,.9,'0:'+String(secs).padStart(2,'0')),'MICROWAVE'],[960,Tr,`${f11_car(-140,40,.7,P.coral)}${f11_car(140,40,.7,'#7C5CFF')}<rect x="-230" y="80" width="460" height="10" fill="#fff" opacity=".3"/>`,'TRAFFIC'],[1580,Le,`<rect x="-220" y="-150" width="320" height="180" fill="#2E5A44" stroke="${INK}" stroke-width="7"/><path d="M-190 -110 h200 M-190 -70 h240 M-190 -30 h160" stroke="#fff" stroke-width="6" opacity=".7"/>${extra({x:160,y:-30,s:.4,t:g,head:'#FFD98E',glasses:true,pose:'point'})}`,'A LONG LECTURE']];
  const sk=eout(prog(t,St,St+1.5));
  return `${card('cardWarm',g)}${pans.map(([x,a,inner,l])=>AT(t,a)?f11_panel(x,440,520,360,inner,l,P.gold,pop(t,a)):'').join('')}
   ${AT(t,St)?`<g transform="translate(960,790) scale(${1+sk*2.2},${1-sk*.35})">${f11_clock(0,0,60,.05,g)}</g>${T(960,175,'STRETCHED OUT',{size:90,fill:P.gold,sc:pop(t,St)})}`:T(960,175,'WAITING...',{size:90,fill:P.white,sc:IN(t,M)})}`;
},
flyFlipbook(t,d,p,g){
  const TV=p.tv??4.3;
  if(AT(t,TV)){ const fl=(g*2.2)%1<.5?1:.55; const bar=((g*.4)%1)*300-150;
    return `${bgRoom(g)}<g transform="translate(960,500)"><rect x="-360" y="-250" width="720" height="500" rx="40" fill="#7A5A3A" stroke="${INK}" stroke-width="12"/><rect x="-300" y="-200" width="520" height="400" rx="40" fill="#9EC9C0" opacity="${fl}" stroke="${INK}" stroke-width="8"/>
      <rect x="-300" y="${bar}" width="520" height="40" fill="#fff" opacity=".35"/>${[0,1,2].map(i=>`<circle cx="290" cy="${-120+i*80}" r="22" fill="#C9A46A" stroke="${INK}" stroke-width="6"/>`).join('')}<path d="M-120 -250 L-200 -360 M120 -250 L200 -360" stroke="${INK}" stroke-width="10"/></g>
      ${glint({x:1560,y:600,s:.75,t:g,mouth:'wavy',brows:'sad',lid:.3,blink:BL(g)})}${T(960,150,'OLD TVs: FLASHING',{size:96,fill:P.white,sc:pop(t,TV)})}`; }
  const fr=Math.floor(t*2.5)%6;
  const inner=`${glint({x:-220+fr*90,y:20,s:.4,t:fr*.3,legs:'walk',mouth:'smile'})}`;
  const pg=(g*3)%1;
  return `${card('cardDark',g)}${f11_screen(820,500,900,500,inner,'#22305A')}
   <g transform="translate(1660,560)"><rect x="-150" y="-110" width="300" height="220" rx="8" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><g transform="translate(-150,0) scale(${Math.cos(pg*Math.PI)},1)"><rect x="0" y="-110" width="300" height="220" rx="8" fill="#F0E6D2" stroke="${INK}" stroke-width="6"/></g></g>
   ${T(1660,820,'FLIP BOOK',{size:56,fill:P.gold,stroke:9})}
   ${T(960,150,'MOVIES: JUMPY & CHOPPY',{size:96,fill:P.white,sc:IN(t,.2)})}`;
},
flyTalk(t,d,p,g){
  const L=p.lips??5, Pa=p.pause??7, B=p.bored??9.5;
  if(AT(t,B)) return `${card('cardDark',g)}${glint({x:960,y:580,s:1.1,t:g,pose:'cross',mouth:'flat',brows:'sad',lid:.45,blink:BL(g)})}${T(960,160,"YOU'D GET BORED",{size:110,fill:P.white,sc:pop(t,B)})}${AT(t,B+1.4)?T(1500,520,'A LOT.',{size:110,fill:P.coral,sc:pop(t,B+1.4)}):''}`;
  const mo=.3+.7*Math.abs(Math.sin(g*.6));
  const word='HELLOOO...';const n=Math.min(word.length,Math.floor(t*1.1)+1);
  let letters='';for(let i=0;i<n;i++){const age=t-i/1.1;letters+=T(1000+i*72,470+Math.sin(g+i)*10,word[i],{size:80,fill:P.gold,stroke:12,op:clamp(age*2)});}
  return `${card('cardWarm',g)}<g transform="translate(560,520)"><circle r="300" fill="#FFD3A8" stroke="${INK}" stroke-width="12"/><circle cx="-100" cy="-80" r="26" fill="${INK}"/><circle cx="100" cy="-80" r="26" fill="${INK}"/>
    <ellipse cx="0" cy="110" rx="${120}" ry="${12+mo*70}" fill="#3a1220" stroke="${INK}" stroke-width="10"/></g>${letters}
   ${AT(t,L)?labelPill(1300,700,'LIPS... MOVING... SLOWLY',P.ice,44):''}${AT(t,Pa)?labelPill(1300,820,'PAUSES FOREVER',P.coral,44):''}
   ${T(960,150,'CONVERSATIONS',{size:96,fill:P.white,sc:IN(t,.2)})}`;
},
flyScale(t,d,p,g){
  const Fl=p.flies??8.4, Bi=p.birds??9.3, Hu=p.hunt??10.3, U=p.update??12.4, Bg=p.big??17, Tu=p.turtle??20.8;
  const ref=(x,y,sp,col)=>`<g transform="translate(${x},${y}) rotate(${g*sp})"><path d="M-40 0 A40 40 0 1 1 0 40" stroke="${col}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M0 40 l-18 -14 M0 40 l-16 18" stroke="${col}" stroke-width="10" stroke-linecap="round"/></g>`;
  return `${card('cardDark',g)}<path d="M180 840 H1740" stroke="${P.steel}" stroke-width="10"/><path d="M180 840 l40 -24 v48Z M1740 840 l-40 -24 v48Z" fill="${P.steel}"/>
   ${T(260,900-14,'FASTER',{size:44,fill:P.coral,stroke:8,anchor:'start'})}${T(1660,900-14,'SLOWER',{size:44,fill:'#7DBE6A',stroke:8,anchor:'end'})}
   ${!AT(t,Fl)?icon('bulb',450,520,1.3*IN(t,.6))+labelPill(450,720,'SCIENTISTS FOUND',P.ice,40):''}${AT(t,Fl)?f11_fly(300,580,.55,g):''}${AT(t,Bi)?f11_bird(600,600,.9,g):''}${AT(t,Hu)?labelPill(450,380,'SMALL, QUICK HUNTERS',P.coral,40):''}
   <g opacity="${prog(t,.5,1)}">${glint({x:1000,y:520,s:.6,t:g,mouth:'smile',blink:BL(g)})}</g>
   ${AT(t,U)?ref(450,270,720,P.coral):''}${AT(t,Tu)?f11_turtle(1480,690,.9,g)+ref(1480,470,60,'#7DBE6A'):''}
   ${T(960,150,AT(t,Bg)?'BIG & SLOW: UPDATE SLOWER':'SMALL & FAST: SEE FASTER',{size:84,fill:AT(t,Bg)?'#7DBE6A':P.gold,sc:pop(t,AT(t,Bg)?Bg:.2)})}`;
},
flyPOV(t,d,p,g){
  const F=p.fly??4.8, Tu=p.turtle??7.8;
  if(!AT(t,F)) return `${card('cardMint',g)}${f11_clock(480,520,140,6,g,'FLY',P.coral)}${f11_clock(960,520,140,1,g,'YOU',P.mint)}${f11_clock(1440,520,140,.12,g,'TURTLE','#7DBE6A')}${T(960,150,'ITS OWN SPEED OF TIME',{size:96,fill:P.white,sc:IN(t,.2)})}`;
  const slowX=480+Math.sin(g*.4)*120;
  const fastX=1440+Math.sin(g*6)*140;
  return `${card('cardDark',g)}<rect x="40" y="250" width="880" height="620" rx="30" fill="#2A1A3A" stroke="${P.coral}" stroke-width="10"/>
   ${f11_ghost(4,q=>glint({x:slowX-q*60*Math.cos(g*.4),y:560,s:.7,t:g*.2,legs:'walk',mouth:'wavy',blink:0}),.25)}${f11_fly(820,330,.35,g)}
   ${T(480,230,'TO A FLY: SLOW',{size:66,fill:P.coral,stroke:10})}
   ${AT(t,Tu)?`<g opacity="${prog(t,Tu,Tu+.3)}"><rect x="1000" y="250" width="880" height="620" rx="30" fill="#1A3A2A" stroke="#7DBE6A" stroke-width="10"/>
     ${[0,1,2,3].map(i=>`<path d="M${fastX-140-i*30} ${420+i*70} h-120" stroke="#fff" stroke-width="8" opacity=".4" stroke-linecap="round"/>`).join('')}
     ${glint({x:fastX,y:560,s:.7,t:g*4,legs:'walk',mouth:'grin',blink:0})}${f11_turtle(1760,800,.4,g)}
     ${T(1440,230,'TO A TURTLE: FAST-FORWARD',{size:50,fill:'#7DBE6A',stroke:10})}</g>`:''}`;
},
flyTower(t,d,p,g){
  const Sc=p.sci??10.5, V=p.tower??15.2, Wa=p.watch??19.9, If=p.ifslow??27.2, No=p.couldnt??31.6;
  if(!AT(t,Sc)){ const k=(t*.25)%1;
    return `${card('cardIce',g)}${f11_ghost(5,q=>glint({x:960,y:lerp(380,620,Math.max(0,k-q*.06)),s:.8,t:g,rot:lerp(0,120,Math.max(0,k-q*.06)),pose:'up',mouth:'o',brows:'raised',blink:0}),.25)}
      ${T(960,150,'TIME SLOWS DOWN?',{size:100,fill:P.white,sc:IN(t,.2)})}${AT(t,(p.ppl??6.8))?labelPill(960,870,'"EVERYTHING WENT SLOW-MO"',P.ice,44):''}`; }
  if(!AT(t,V)) return `${bgLab(g)}${glint({x:960,y:560,s:1,t:g,pose:'point',mouth:'smirk',brows:'raised',blink:BL(g)})}${T(960,160,'IS IT REAL?',{size:120,fill:P.gold,sc:pop(t,Sc)})}${AT(t,Sc+2.6)?labelPill(960,880,'SO THEY TESTED IT',P.mint,48):''}`;
  const k=((t-V)*.35)%1; const fy=lerp(260,700,k*k); const fx=lerp(360,640,k);
  const num=Math.floor(g*30*7.3)%10;
  return `${bgNight(g)}${f11_tower(360,300)}${f11_net(640,760,380)}
   <g transform="translate(${fx},${fy}) rotate(${-90*k-20})">${extra({s:.4,t:g,head:'#FFD3A8',pose:'up'})}</g>
   ${AT(t,Wa)?`<g transform="translate(1400,520)">${f11_watch(0,0,1,AT(t,No)?'?':num,g)}${AT(t,No)?stamp(0,0,.9,"COULDN'T",P.red):''}</g>
     ${T(1400,890-30,AT(t,If)?'SLOW TIME = READABLE?':'TOO FAST TO READ',{size:50,fill:P.gold,stroke:9})}`:''}
   ${T(960,150,'THE FALLING EXPERIMENT',{size:90,fill:P.white,sc:pop(t,V)})}`;
},
flyMemory(t,d,p,g){
  const A=p.after??2.4, R=p.rich??7.2, Bk=p.back??12.7, Br=p.brain??16.2;
  if(!AT(t,R)) return `${card('cardDark',g)}${f11_clock(560,520,160,1,g,'REAL TIME',P.mint)}
     ${AT(t,A)?`<g transform="translate(1340,520) scale(${1+.8*eout(prog(t,A,A+1.5))},1)">${f11_clock(0,0,160,1,g)}</g>${T(1340,800,'FELT LONGER',{size:60,fill:P.coral,stroke:10})}`:''}
     ${T(960,150,"TIME DIDN'T SLOW DOWN",{size:96,fill:P.white,sc:IN(t,.2)})}`;
  const n=AT(t,Bk)?12:Math.min(12,1+Math.floor((t-R)*3));
  const spread=eout(prog(t,Bk,Bk+1.6));
  let frs='';for(let i=0;i<n;i++){const x=lerp(1160+(i%4)*130,260+i*125,spread), y=lerp(330+Math.floor(i/4)*130,720,spread);
    frs+=`<rect x="${x-52}" y="${y-44}" width="104" height="88" rx="8" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><path d="M${x-30} ${y+20} l20 -30 l16 18 l14 -10 l14 22" stroke="${['#7C5CFF',P.coral,P.mint][i%3]}" stroke-width="6" fill="none"/>`;}
  return `${card('cardMint',g)}${spread<1?brain(600,480,1.1*(1-spread*.6),1,g):glint({x:960,y:430,s:.6,t:g,mouth:'o',brows:'raised',look:-1,blink:BL(g)})}${frs}
   ${T(960,150,AT(t,Br)?'IT REMEMBERS MORE DETAIL':AT(t,Bk)?'LOOKING BACK: FEELS LONGER':'SCARY = RICHER MEMORIES',{size:84,fill:AT(t,Br)?P.gold:P.white,sc:pop(t,AT(t,Br)?Br:AT(t,Bk)?Bk:R)})}
   ${AT(t,Br)?labelPill(960,880,"YOUR BRAIN DOESN'T SLOW TIME",P.mint,44):''}`;
},
flyRecap(t,d,p,g){
  const C=p.catch??3.5, R=p.rain??5.4, H=p.hum??8.3, Me=p.meet??10.5;
  const rain=[...Array(6)].map((_,i)=>{const y=-100+((g*20+i*47)%200);return `<path d="M${-200+i*80} ${y} q20 36 0 52 q-20 -16 0 -52Z" fill="#9FD8FF" stroke="${INK}" stroke-width="4"/>`;}).join('');
  const meet=`${extra({x:-150,y:-20,s:.33,t:g,head:'#FFD98E',tie:true})}${extra({x:150,y:-20,s:.33,t:g+1,head:'#C3B1FF',tie:true})}${glint({x:0,y:-10,s:.33,t:g,mouth:'flat',lid:.5,blink:0})}${f11_clock(230,-70,34,.3,g)}`;
  const items=[[C,500,350,`${f11_ghost(3,q=>f11_ball(-60+((g*20)%120)-q*30,0,40,g*20),.3)}${glint({x:110,y:20,s:.3,t:g,pose:'reach',mouth:'grin',blink:0})}`,'EVERY BALL',P.mint],
    [R,1420,350,rain,'RAINDROPS, ONE BY ONE',P.ice],[H,500,700,f11_hummer(30,30,.6,g,{wa:Math.sin(g*3)*50}),"HUMMINGBIRD WINGS",'#3DBE8C'],[Me,1420,700,meet,'THE LONGEST MEETING',P.coral]];
  return `${card('cardDark',g)}${items.map(([a,x,y,inner,l,c])=>AT(t,a)?f11_panel(x,y,600,250,`<g clip-path="none">${inner}</g>`,'',c,pop(t,a))+T(x,y+180,l,{size:40,fill:c,stroke:8,op:prog(t,a,a+.3)}):`<g opacity=".3">${f11_panel(x,y,600,250,'','',c,1)}</g>`).join('')}
   ${T(960,140,'ONE DAY OF FLY VISION',{size:90,fill:P.white,sc:IN(t,.2)})}`;
}
});
