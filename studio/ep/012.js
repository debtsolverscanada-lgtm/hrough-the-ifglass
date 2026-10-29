// episode 012 scenes (taste words)
const w12_O=`stroke="${INK}" stroke-width="7" stroke-linejoin="round"`;
const w12_FC={straw:'#FF3B5C',toast:'#8A5A2E',pancake:'#FFB86B',cereal:'#C9D3E0',mint:'#7CF5C2',choc:'#C77B4A',mash:'#FFF1C9',sweet:'#FF6BD6',sushi:'#FF8A5B',coffee:'#C9A07A',wax:'#E8B83A',egg:'#9BE15D',soap:'#FFB4D9',cake:'#E8A06A',berry:'#8A9BFF',icecream:'#FF9EC0',stink:'#9BE15D'};
function w12_food(k,x,y,s=1,g=0){
  const o=w12_O; let f='';
  if(k==='straw'){
    f=`<path d="M0 95 C-80 40 -95 -40 -55 -62 C-20 -78 20 -78 55 -62 C95 -40 80 40 0 95Z" fill="#FF3B5C" ${o}/>
     ${[[-35,-30],[0,-40],[35,-28],[-22,8],[18,4],[0,45],[-45,-2],[45,0],[-12,-12],[12,28]].map(([a,b])=>`<ellipse cx="${a}" cy="${b}" rx="5" ry="8" fill="#FFE07A"/>`).join('')}
     <path d="M-50 -64 L-30 -96 L-8 -74 L12 -100 L22 -72 L50 -88 L46 -60 Q0 -48 -50 -64Z" fill="#3DBE5C" ${o}/>
     <path d="M-50 -30 Q-55 0 -36 30" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".5"/>`;
  } else if(k==='toast'){
    const sm=[0,1,2].map(i=>{const q=((g*.5+i/3)%1);return `<path d="M${-40+i*40} ${-100-q*120} q20 -20 0 -40 q-20 -20 0 -40" stroke="#8A8A9A" stroke-width="12" fill="none" stroke-linecap="round" opacity="${(1-q)*.8}"/>`;}).join('');
    f=`${sm}<path d="M-85 90 V-30 Q-110 -95 -40 -95 H40 Q110 -95 85 -30 V90Z" fill="#2A170C" ${o}/>
     <path d="M-62 70 V-24 Q-78 -70 -32 -72 H32 Q78 -70 62 -24 V70Z" fill="#4A2A14"/>
     <ellipse cx="-20" cy="-20" rx="26" ry="18" fill="#140904"/><ellipse cx="28" cy="30" rx="22" ry="14" fill="#140904"/><ellipse cx="-30" cy="45" rx="14" ry="10" fill="#140904"/>`;
  } else if(k==='pancake'){
    f=`<ellipse cx="0" cy="70" rx="140" ry="30" fill="#E8EEF5" ${o}/>${[0,1,2].map(i=>`<ellipse cx="0" cy="${50-i*36}" rx="112" ry="32" fill="#D98A3A" ${o}/><ellipse cx="0" cy="${44-i*36}" rx="100" ry="22" fill="#F2B060"/>`).join('')}
     <path d="M-90 -30 Q-60 -10 -70 30 Q-60 50 -50 20 Q-40 -10 0 -20 Q60 -10 70 20 Q80 40 86 0 Q90 -30 60 -40Z" fill="#8A4A12" opacity=".9"/>
     <rect x="-30" y="-64" width="60" height="34" rx="6" fill="#FFE07A" ${o}/>
     ${[0,1,2].map(i=>{const q=((g*.6+i/3)%1);return `<path d="M${-50+i*50} ${-90-q*90} q14 -16 0 -32" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity="${(1-q)*.7}"/>`;}).join('')}`;
  } else if(k==='cereal'){
    f=`<path d="M-130 -10 H130 Q120 100 0 104 Q-120 100 -130 -10Z" fill="#7CA4C8" ${o}/>
     <ellipse cx="0" cy="-10" rx="130" ry="30" fill="#D9D6C8" ${o}/>
     ${[[-70,-14],[-30,-6],[10,-16],[50,-8],[85,-14],[-50,-22],[30,-24]].map(([a,b])=>`<ellipse cx="${a}" cy="${b}" rx="18" ry="9" fill="#A08A5A" stroke="#6A5A3A" stroke-width="4" transform="rotate(${a/3} ${a} ${b})"/>`).join('')}
     <path d="M-60 104 q4 20 0 30 M40 104 q4 16 0 24" stroke="#D9D6C8" stroke-width="10" stroke-linecap="round"/>
     <path d="M80 -40 L110 -110" stroke="#C9D3E0" stroke-width="16" stroke-linecap="round"/>`;
  } else if(k==='mint'){
    f=`<path d="M-70 0 L-120 -34 L-112 34Z M70 0 L120 -34 L112 34Z" fill="#E8F4FF" ${o}/><circle r="72" fill="#fff" ${o}/>
     ${[0,60,120,180,240,300].map(a=>`<path d="M0 0 L60 -14 Q72 10 54 30Z" fill="${P.red}" transform="rotate(${a+g*40})"/>`).join('')}<circle r="72" fill="none" stroke="${INK}" stroke-width="7"/><circle r="14" fill="#fff"/>`;
  } else if(k==='choc'){
    f=`<rect x="-100" y="-62" width="200" height="124" rx="10" fill="#6B3A1E" ${o}/>${[-50,0,50].map(a=>`<path d="M${a} -62 V62" stroke="#4A2410" stroke-width="6"/>`).join('')}<path d="M-100 0 H100" stroke="#4A2410" stroke-width="6"/>
     <path d="M30 62 L100 -10 V62Z" fill="#C9D3E3" ${o}/>${[-75,-25,25,75].map(a=>`<rect x="${a-18}" y="-50" width="36" height="8" rx="4" fill="#8A5030"/>`).join('')}`;
  } else if(k==='mash'){
    f=`<path d="M-120 0 H120 Q110 90 0 92 Q-110 90 -120 0Z" fill="#FFF6EA" ${o}/>
     <path d="M-100 2 Q-110 -40 -60 -50 Q-40 -90 0 -76 Q40 -96 66 -56 Q112 -50 100 2Z" fill="#FFF1C9" ${o}/>
     <rect x="-18" y="-80" width="44" height="30" rx="5" fill="#FFE07A" ${o} transform="rotate(-10)"/><path d="M-60 -20 q20 -10 40 0 M20 -30 q20 -10 40 0" stroke="#E8D8A8" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  } else if(k==='sweet'){
    f=`<path d="M-60 0 L-120 -44 L-110 44Z M60 0 L120 -44 L110 44Z" fill="#FFC83D" ${o}/><ellipse rx="72" ry="50" fill="#FF6BD6" ${o}/>
     <path d="M-40 -30 Q-20 0 -40 30 M0 -48 Q20 0 0 48 M40 -30 Q60 0 40 30" stroke="#fff" stroke-width="8" fill="none" opacity=".6"/>`;
  } else if(k==='sushi'){
    f=`<rect x="-100" y="-20" width="200" height="70" rx="30" fill="#fff" ${o}/><path d="M-110 -10 Q-100 -60 0 -56 Q100 -60 110 -10 Q100 10 0 6 Q-100 10 -110 -10Z" fill="#FF8A5B" ${o}/>
     <path d="M-60 -40 q10 20 0 40 M-10 -46 q10 22 0 46 M40 -42 q10 20 0 40" stroke="#FFD3B8" stroke-width="7" fill="none"/><rect x="-18" y="-50" width="36" height="104" fill="#1E2A22" ${o}/>`;
  } else if(k==='coffee'){
    f=`${[0,1].map(i=>{const q=((g*.6+i/2)%1);return `<path d="M${-20+i*40} ${-80-q*80} q14 -16 0 -32 q-14 -16 0 -32" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity="${(1-q)*.7}"/>`;}).join('')}
     <ellipse cx="0" cy="80" rx="130" ry="24" fill="#E8EEF5" ${o}/><path d="M-90 -60 H90 L76 60 Q70 80 0 80 Q-70 80 -76 60Z" fill="#fff" ${o}/>
     <path d="M90 -30 Q140 -30 130 10 Q120 40 82 34" stroke="${INK}" stroke-width="20" fill="none"/><path d="M90 -30 Q140 -30 130 10 Q120 40 82 34" stroke="#fff" stroke-width="8" fill="none"/>
     <ellipse cx="0" cy="-60" rx="90" ry="20" fill="#7A4A2A" ${o}/><path d="M0 -50 C-20 -70 -30 -54 0 -46 C30 -54 20 -70 0 -50Z" fill="#FFF1C9"/>`;
  } else if(k==='wax'){
    f=`<rect x="-120" y="-9" width="240" height="18" rx="9" fill="#F4F4F8" ${o}/>
     ${[-1,1].map(d=>`<ellipse cx="${d*130}" cy="0" rx="42" ry="30" fill="#fff" ${o}/><path d="M${d*130-24} -10 Q${d*130} -34 ${d*130+24} -8 Q${d*130+30} 16 ${d*130} 18 Q${d*130-30} 18 ${d*130-24} -10Z" fill="#D9A21B"/>`).join('')}
     ${[0,1,2].map(i=>`<path d="M${-30+i*30} ${-40-((g*40+i*20)%40)} q8 -10 0 -20" stroke="#B8C860" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/>`).join('')}`;
  } else if(k==='egg'){
    f=`${[0,1,2].map(i=>{const q=((g*.5+i/3)%1);return `<path d="M${-40+i*40} ${-90-q*100} q22 -18 0 -36 q-22 -18 0 -36" stroke="#9BE15D" stroke-width="12" fill="none" stroke-linecap="round" opacity="${(1-q)}"/>`;}).join('')}
     <path d="M0 -90 C60 -90 85 0 80 30 C75 80 40 95 0 95 C-40 95 -75 80 -80 30 C-85 0 -60 -90 0 -90Z" fill="#E8E2C8" ${o}/>
     <path d="M-60 -10 L-30 -30 L-10 0 L20 -36 L40 -6 L66 -24" stroke="${INK}" stroke-width="6" fill="none" stroke-linejoin="round"/><ellipse cx="-20" cy="40" rx="30" ry="18" fill="#B8C860" opacity=".6"/>`;
  } else if(k==='soap'){
    f=`<rect x="-110" y="-60" width="220" height="120" rx="40" fill="#FFB4D9" ${o}/><text y="16" text-anchor="middle" font-size="48" font-weight="900" fill="#C2457A">SOAP</text>
     ${[0,1,2,3].map(i=>{const q=((g*.4+i/4)%1);return `<circle cx="${-80+i*55+Math.sin(g*2+i)*10}" cy="${-80-q*140}" r="${14+i*5}" fill="#E6F6FF" fill-opacity=".4" stroke="#fff" stroke-width="5" opacity="${1-q}"/>`;}).join('')}`;
  } else if(k==='cake'){
    f=`<ellipse cx="0" cy="84" rx="140" ry="22" fill="#E8EEF5" ${o}/><path d="M-110 76 V-20 L110 -50 V76Z" fill="#5A2E14" ${o}/>
     <path d="M-110 10 L110 -16 M-110 44 L110 24" stroke="#FFF1C9" stroke-width="12"/><path d="M-118 -24 Q-90 -4 -60 -30 Q-30 -6 0 -36 Q30 -10 60 -42 Q90 -18 118 -54 L110 -64 L-112 -34Z" fill="#7A3E1C" ${o}/>
     <circle cx="50" cy="-76" r="22" fill="${P.red}" ${o}/><path d="M50 -96 q10 -20 26 -22" stroke="${INK}" stroke-width="5" fill="none"/>`;
  } else if(k==='berry'){
    f=`${[[-40,10],[40,14],[0,-36]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="48" fill="#4A5BD8" ${o}/><path d="M${a-10} ${b-30} l10 8 l10 -8 l-4 12 l-12 0Z" fill="#2A3398"/><circle cx="${a-16}" cy="${b-8}" r="8" fill="#fff" opacity=".4"/>`).join('')}`;
  } else if(k==='icecream'){
    f=`<path d="M-60 0 L0 140 L60 0Z" fill="#E8A54B" ${o}/><path d="M-40 20 L20 100 M0 10 L40 60 M-20 60 L30 20" stroke="#B87A2A" stroke-width="5"/>
     <circle cx="0" cy="-30" r="62" fill="#FF9EC0" ${o}/><circle cx="0" cy="-104" r="48" fill="#7CF5C2" ${o}/><circle cx="10" cy="-150" r="14" fill="${P.red}" ${o}/>`;
  } else if(k==='stink'){
    f=`${[0,1,2,3].map(i=>{const q=((g*.4+i/4)%1);return `<circle cx="${Math.sin(g+i*2)*30}" cy="${-q*80}" r="${40+q*40}" fill="#9BE15D" opacity="${.6*(1-q)}"/>`;}).join('')}`;
  }
  return G(x,y+Math.sin(g*2.2+x*.01)*6,s,f);
}
// word flies from (x0,y0) to (x1,y1) and turns into food
function w12_morph(t,a,word,food,x0,y0,x1,y1,o={}){
  if(a==null||t<a) return '';
  const k=prog(t,a,a+1.3), e=eout(k), x=lerp(x0,x1,e), y=lerp(y0,y1,e)-Math.sin(k*Math.PI)*(o.arc??140);
  const wo=1-prog(k,.5,.75), fs=pop(t,a+.7,.45)*(o.fs||1), g=o.g||0;
  const burst=prog(k,.5,1); let b='';
  if(burst>0&&burst<1) for(let i=0;i<10;i++){const an=i/10*6.283,r=60+burst*150;b+=`<circle cx="${x+Math.cos(an)*r}" cy="${y+Math.sin(an)*r}" r="${10*(1-burst)}" fill="${w12_FC[food]||P.gold}"/>`;}
  return `${b}${wo>0?T(x,y,word,{size:o.size||70,fill:o.col||P.white,op:wo,sc:1-.5*prog(k,.45,.75)}):''}
   ${fs>0?w12_food(food,x,y,fs,g):''}${o.lab&&AT(t,a+1)?T(x1,y1+(o.ly??150),o.lab,{size:o.ls||52,fill:o.lc||w12_FC[food]||P.gold,stroke:9,sc:pop(t,a+1)}):''}`;
}
function w12_tag(x,y,name,s=1,rot=0){
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-90" y="-50" width="180" height="100" rx="10" fill="#fff" ${w12_O}/><path d="M-90 -40 Q-90 -50 -80 -50 H80 Q90 -50 90 -40 V-16 H-90Z" fill="${P.red}"/>
   <text y="-24" text-anchor="middle" font-size="18" font-weight="900" fill="#fff">HELLO MY NAME IS</text><text y="34" text-anchor="middle" font-size="${name.length>5?36:44}" font-weight="900" fill="${INK}">${name}</text></g>`;
}
const w12_chip=(x,y,str,col,sc=1,size=46)=>{const w=str.length*size*.66+50;return `<g transform="translate(${x},${y}) scale(${sc})"><rect x="${-w/2}" y="${-size*.9}" width="${w}" height="${size*1.6}" rx="${size*.5}" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/><text y="${size*.36}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${col||INK}">${str}</text></g>`;};
function w12_blob(x,y,r,g,col='#7CF5FF'){let d='';const n=40;for(let i=0;i<=n;i++){const a=i/n*6.283,w=1+Math.sin(a*3+g*1.5)*.08+Math.sin(a*2-g)*.05;d+=(i?'L':'M')+(x+Math.cos(a)*r*w).toFixed(1)+' '+(y+Math.sin(a)*r*w*.9).toFixed(1);}return `<path d="${d}Z" fill="${col}" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>`;}
function w12_star(x,y,r,g,col=P.gold){let d='';const n=9;for(let i=0;i<n*2;i++){const a=i/(n*2)*6.283+g*.2,rr=i%2?r*.42:r*(1+Math.sin(g*3+i)*.04);d+=(i?'L':'M')+(x+Math.cos(a)*rr).toFixed(1)+' '+(y+Math.sin(a)*rr).toFixed(1);}return `<path d="${d}Z" fill="${col}" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>`;}
function w12_note(x,y,s,col=P.gold){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M10 -70 V30" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M10 -70 L50 -50 V-24 L10 -44" fill="${INK}"/><ellipse cx="-10" cy="32" rx="26" ry="20" fill="${col}" stroke="${INK}" stroke-width="7" transform="rotate(-20 -10 32)"/><path d="M10 -70 V30" stroke="${col}" stroke-width="6"/></g>`;}
function w12_mouthTongue(x,y,s,g,word){
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-260 -40 Q0 -170 260 -40 Q200 180 0 190 Q-200 180 -260 -40Z" fill="#5A1A2A" stroke="${INK}" stroke-width="12"/>
   <path d="M-220 -50 Q0 -140 220 -50" stroke="#fff" stroke-width="34" fill="none" stroke-dasharray="40 8"/>
   <path d="M-170 40 Q-180 ${150+Math.sin(g*3)*8} 0 ${170+Math.sin(g*3)*10} Q180 ${150+Math.sin(g*3)*8} 170 40 Q0 0 -170 40Z" fill="#FF7A9A" stroke="${INK}" stroke-width="9"/><path d="M0 50 V140" stroke="#D94A6A" stroke-width="8" stroke-linecap="round"/>
   ${word?`<g transform="translate(0,${150+Math.sin(g*3)*10})">${w12_chip(0,0,word,P.red,1,40)}</g>`:''}</g>`;
}

Object.assign(SHOTS,{
twHook(t,d,p,g){
  const nm=p.name??2.3, mo=p.mon??5.6, ml=p.meal??10.1, gr=p.gross??12.5;
  const gross=AT(t,gr), meal=AT(t,ml);
  const sx=380, sy=470, gx=1560;
  const curFood = AT(t,mo)?'toast':'straw';
  return `${card('cardWarm',g)}
   ${t<nm?`${T(960,200,'WHAT IF YOU COULD',{size:80,fill:P.white,sc:IN(t,.1)})}${T(960,340,'TASTE WORDS?',{size:150,fill:P.gold,sc:IN(t,.9)})}`:''}
   ${extra({x:sx,y:560,s:.95,t:g,head:'#FFD3A8',mouth:'laugh',pose:'point'})}
   ${glint({x:gx,y:560,s:1,t:g,mouth:gross?'wavy':(AT(t,mo)?'frown':(AT(t,nm+1)?'grin':'smile')),brows:gross||AT(t,mo)?'sad':(AT(t,nm+1)?'raised':'calm'),tint:gross?'#CFF5B0':null,sweat:gross?1:0,blink:BL(g)})}
   ${!meal?`${w12_morph(t,nm,'YOUR NAME','straw',sx+80,sy-40,960,480,{g,lab:AT(t,mo)?'':'STRAWBERRIES',size:68,col:P.white})}
     ${AT(t,mo)?w12_morph(t,mo,'"MONDAY"','toast',sx+80,sy-40,960,480,{g,lab:'BURNT TOAST',lc:'#C9A07A',size:76,col:P.ice}):''}`:''}
   ${meal?`<g transform="translate(960,520) scale(${pop(t,ml)})"><ellipse rx="300" ry="90" fill="#E8EEF5" ${w12_O}/><ellipse rx="230" ry="62" fill="#fff"/>
       <path d="M-360 -40 V60 M-380 -40 V-5 M-340 -40 V-5 M360 -40 V60" stroke="${INK}" stroke-width="12" stroke-linecap="round"/></g>
     ${w12_food('straw',800,450,.7*pop(t,ml+.2),g)}${w12_food('toast',1120,440,.65*pop(t,ml+.35),g)}${w12_food(gross?'egg':'pancake',960,470,.75*pop(t,gross?gr:ml+.5),g)}
     ${T(960,200,gross?'SOME ARE DISGUSTING':'EVERY CHAT IS A MEAL',{size:96,fill:gross?'#9BE15D':P.gold,sc:pop(t,gross?gr:ml)})}`:''}`;
},
twReal(t,d,p,g){
  const re=AT(t,p.real??1.7), you=AT(t,p.you??5.2);
  return `${card('cardDark',g)}${glint({x:520,y:560,s:1.05,t:g,pose:re?'point':'shrug',mouth:you?'grin':(re?'smirk':'flat'),brows:re?'raised':'calm',blink:BL(g),glint:you?Math.max(0,Math.sin(t*2)):0})}
   ${!you?`${T(1320,330,'MADE UP?',{size:120,fill:P.white,sc:IN(t,.2)})}${re?stamp(1320,560,1.3*pop(t,p.real??1.7),"IT'S REAL",P.mint,-10):''}`
     :`${brain(1320,500,1.1*pop(t,p.you??5.2),1,g)}${T(1320,250,'YOUR BRAIN',{size:96,fill:P.gold,sc:pop(t,p.you??5.2)})}${T(1320,760,'DOES IT TOO (A BIT)',{size:64,fill:P.white,sc:pop(t,(p.you??5.2)+.5)})}`}`;
},
twLanes(t,d,p,g){
  const but=p.but??6.6, bl=eout(prog(t,but,but+1.5));
  const L=[['HEARING',P.gold,340,'ear'],['TASTING',P.coral,560,'tongue'],['SEEING',P.mint,780,'eye']];
  const ic=(kind,x,y)=>`<g transform="translate(${x},${y})"><circle r="74" fill="#22305A" stroke="${INK}" stroke-width="8"/>${
     kind==='ear'?`<path d="M-20 40 Q-40 30 -30 0 Q-36 -46 4 -50 Q44 -50 40 -10 Q38 14 18 24 Q8 30 10 48 Q8 60 -8 56" stroke="${P.cream}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M0 -20 Q18 -24 18 -6 Q16 6 4 8" stroke="${P.cream}" stroke-width="10" fill="none" stroke-linecap="round"/>`
    :kind==='tongue'?`<path d="M-50 -10 Q0 -40 50 -10 Q40 40 0 46 Q-40 40 -50 -10Z" fill="#5A1A2A" stroke="${INK}" stroke-width="6"/><path d="M-34 0 Q-34 52 0 54 Q34 52 34 0 Q0 -10 -34 0Z" fill="#FF7A9A" stroke="${INK}" stroke-width="5"/>`
    :`<path d="M-56 0 Q0 -50 56 0 Q0 50 -56 0Z" fill="#fff" stroke="${INK}" stroke-width="6"/><circle r="22" fill="#3A7BD5" stroke="${INK}" stroke-width="5"/><circle r="10" fill="${INK}"/>`}</g>`;
  let s='';
  L.forEach(([lab,c,y,k],i)=>{
    s+=`<rect x="380" y="${y-34}" width="1340" height="68" rx="34" fill="#fff" opacity=".07"/>${ic(k,300,y)}${T(560,y-50,lab,{size:42,fill:c,stroke:8,anchor:'start'})}`;
    for(let j=0;j<7;j++){const q=((g*.25+j/7)%1);let x=420+q*1280, yy=y, col=c;
      if(i===0&&bl>0&&x>900){const m=clamp((x-900)/300); yy=lerp(y,560,ease(m)*bl); col=m>.5&&bl>.5?P.coral:c;}
      s+=`<circle cx="${x}" cy="${yy}" r="20" fill="${col}" stroke="${INK}" stroke-width="5"/>`;}
  });
  return `${card('cardDark',g)}${s}${bl>0?`<path d="M900 340 C1050 340 1050 560 1200 560" stroke="${P.gold}" stroke-width="10" fill="none" stroke-dasharray="20 16" opacity="${bl}"/>`:''}
   ${T(960,150,bl>0?'ONE SENSE TRIGGERS ANOTHER':'SENSES IN THEIR OWN LANES',{size:84,fill:bl>0?P.gold:P.white,sc:pop(t,bl>0?but:.2)})}`;
},
twLetters(t,d,p,g){
  const A=p.a??3.9, S=p.seven??7.3, ev=p.every??10, lf=p.life??11.2;
  const chars=[['A',A,P.red],['B',null],['C',null],['5',null],['6',null],['7',S,'#3DDB6A']];
  let s='';
  chars.forEach(([c,a,col],i)=>{const x=360+i*240, on=a!=null&&AT(t,a), k=on?pop(t,a,.5):0;
    s+=`${on?`<circle cx="${x}" cy="490" r="${150}" fill="url(#${col===P.red?'gRed':'gMint'})" opacity="${.5+.2*Math.sin(g*3)}"/>`:''}${T(x,560+Math.sin(g*2+i)*8,c,{size:on?230:180,fill:on?col:'#8A93B8',sc:1+k*.15})}`;});
  return `${card('cardDark',g)}${s}
   ${AT(t,A)?T(360,740,'ALWAYS RED',{size:48,fill:P.red,stroke:9,sc:pop(t,A+.3)}):''}${AT(t,S)?T(1560,740,'ALWAYS GREEN',{size:48,fill:'#3DDB6A',stroke:9,sc:pop(t,S+.3)}):''}
   ${AT(t,ev)?stamp(960,800,.9*pop(t,ev),AT(t,lf)?'FOR LIFE':'EVERY TIME',P.gold,-6):''}
   ${T(960,150,'COLORED LETTERS & NUMBERS',{size:84,fill:P.white,sc:IN(t,.2)})}`;
},
twMusic(t,d,p,g){
  const fe=p.feel??3.8, ta=p.taste??5.3;
  const cols=[P.mint,P.coral,P.gold,'#B47CFF','#7CC4FF']; let s='';
  for(let i=0;i<6;i++){const q=((g*.22+i/6)%1), x=500+q*900, y=500+Math.sin(q*6+i)*130;
    const sh=q>.35; const c=cols[i%5];
    s+= !sh? w12_note(x,y,.8,c)
      : `<g transform="translate(${x},${y}) rotate(${g*60+i*50}) scale(${.6+q*.6})" opacity="${1-prog(q,.85,1)}">${i%3===0?`<circle r="44" fill="${c}" stroke="${INK}" stroke-width="7"/>`:i%3===1?`<path d="M0 -52 L48 36 H-48Z" fill="${c}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`:`<path d="M-50 0 q12 -30 25 0 t25 0 t25 0 t25 0" stroke="${c}" stroke-width="16" fill="none" stroke-linecap="round"/>`}</g>`;}
  const spk=`<g transform="translate(330,560)"><rect x="-110" y="-190" width="220" height="380" rx="24" fill="#2A3248" stroke="${INK}" stroke-width="9"/><circle cy="-90" r="48" fill="#141C34" stroke="${INK}" stroke-width="6"/><circle cy="60" r="${78+Math.sin(g*14)*5}" fill="#141C34" stroke="${INK}" stroke-width="6"/><circle cy="60" r="26" fill="#5D6A82"/></g>`;
  return `${card('cardMint',g)}${spk}${s}${glint({x:1640,y:560,s:.85,t:g,mouth:'o',brows:'raised',look:-1,blink:BL(g)})}
   ${AT(t,fe)?labelPill(1100,800,'SOME FEEL COLORS',P.coral,40):''}${AT(t,ta)?labelPill(1520,250,'SOME TASTE SOUNDS',P.gold,40):''}
   ${T(900,150,'MUSIC = FLOATING SHAPES',{size:84,fill:P.white,sc:IN(t,.2)})}`;
},
twPercent(t,d,p,g){
  const mu=p.mus??4.4, ra=p.rare??9.8, rare=AT(t,ra), mus=AT(t,mu)&&!rare;
  let s=''; const hi=[13,47,71,88];
  for(let i=0;i<100;i++){const c=i%20, r=Math.floor(i/20), x=390+c*60, y=330+r*110;
    const on = rare? i===47 : hi.includes(i);
    const col = on?(rare?P.gold:P.mint):'#4A5478'; const k=on?1+.15*Math.sin(g*4+i):1;
    s+=`<g transform="translate(${x},${y}) scale(${k})" opacity="${mus?.25:1}"><circle cy="-20" r="16" fill="${col}" stroke="${INK}" stroke-width="4"/><path d="M-16 34 Q-16 0 0 0 Q16 0 16 34Z" fill="${col}" stroke="${INK}" stroke-width="4"/></g>`;}
  const musG = mus?`<g transform="translate(960,${520+Math.sin(g*2)*8}) scale(${pop(t,mu)})"><rect x="-26" y="-40" width="52" height="250" rx="20" fill="#5D6A82" stroke="${INK}" stroke-width="8"/><rect x="-70" y="-190" width="140" height="170" rx="70" fill="#C9D3E3" stroke="${INK}" stroke-width="9"/>${[0,1,2].map(i=>`<path d="M-50 ${-160+i*40} H50" stroke="#8E9AB0" stroke-width="6"/>`).join('')}</g>
     ${[P.coral,P.gold,P.mint,'#B47CFF','#7CC4FF','#FF6BD6'].map((c,i)=>{const a=i/6*6.283+g*.6;return `<circle cx="${960+Math.cos(a)*320}" cy="${440+Math.sin(a)*190}" r="${44+Math.sin(g*3+i)*8}" fill="${c}" stroke="${INK}" stroke-width="6" opacity=".9"/>`;}).join('')}`:'';
  return `${card('cardDark',g)}${s}${musG}
   ${T(960,150,rare?'TASTING WORDS: ONE OF THE RAREST':mus?'SOME MUSICIANS SEE COLORS':'A FEW PERCENT OF PEOPLE',{size:rare?76:88,fill:rare?P.gold:mus?P.coral:P.mint,sc:pop(t,rare?ra:mus?mu:.2)})}`;
},
twJames(t,d,p,g){
  const wo=p.words??5, de=p.derek??13.3, wx=p.wax??14.8, di=p.dinner??17.4;
  if(AT(t,di)){
    return `${bgRoom(g)}<rect x="300" y="700" width="1320" height="40" rx="12" fill="#7A5A3A" stroke="${INK}" stroke-width="8"/><path d="M380 740 V880 M1540 740 V880" stroke="${INK}" stroke-width="20"/>
     ${glint({x:600,y:450,s:.9,t:g,mouth:'wavy',brows:'sad',tint:'#D8F5C0',sweat:1,blink:BL(g)})}
     ${extra({x:1320,y:440,s:.95,t:g,head:'#C3B1FF',mouth:'laugh',pose:'up'})}${w12_tag(1320,540,'DEREK',.85,-4)}
     ${bubble(1000,250,380,120,"HI, I'M DEREK!",{size:46,tail:'right'})}${w12_food('wax',600,250,.6,g)}
     ${w12_food('mash',830,660,.6,g)}${w12_food('cake',1560,660,.5,g)}
     ${T(960,140,'DINNER WITH DEREK',{size:80,fill:P.gold,sc:pop(t,di)})}`;
  }
  const words=['TABLE','BLUE','LONDON','SHOE'];
  let fl='';
  if(AT(t,wo)) words.forEach((w,i)=>{const q=((t-wo)*.28+i/4)%1; const x=lerp(1700,780,q), y=320+i*120+Math.sin(q*6)*20;
    fl+=`<g opacity="${1-prog(q,.8,1)}">${w12_chip(x,y,w,[P.coral,'#3A7BD5','#1FAF8A','#B47CFF'][i],1.4-q*.6,48)}${q>.5?`<circle cx="${x}" cy="${y}" r="${60*(q-.5)*2}" fill="${[P.coral,P.iceDeep,P.mint,'#B47CFF'][i]}" opacity="${.5*(1-q)}"/>`:''}</g>`;});
  const ew=AT(t,wx);
  return `${card('cardWarm',g)}${!AT(t,de)?fl:''}
   ${extra({x:600,y:560,s:1.1,t:g,head:ew?'#D8F0B0':'#F2C9A0',mouth:ew?'flat':'smile',glasses:true})}
   ${labelPill(600,960-60-20,'JAMES WANNERTON, ENGLAND',P.gold,38)}
   ${AT(t,de)?`${bubble(1300,330,400,150,'"DEREK"',{size:80,tail:'left'})}`:''}
   ${ew?`${w12_food('wax',1300,620,1.1*pop(t,wx),g)}${T(1300,800,'EARWAX',{size:90,fill:'#E8B83A',sc:pop(t,wx+.2)})}`:''}
   ${T(960,140,AT(t,de)?'HIS STRANGEST EXAMPLE':'WORDS HAVE TASTES',{size:84,fill:P.white,sc:pop(t,AT(t,de)?de:.2)})}`;
},
twRetest(t,d,p,g){
  const li=p.list??2.9, la=p.later??7, ma=p.match??12.6, fk=p.fake??17.3;
  const rows=[['BLUE','pancake'],['FRIDAY','choc'],['TABLE','mint']];
  const cardF=(x,lab,show,fill,chk)=>`<g transform="translate(${x},520)"><rect x="-330" y="-300" width="660" height="560" rx="26" fill="#FFF6EA" stroke="${INK}" stroke-width="10"/>
     <text y="-220" text-anchor="middle" font-size="54" font-weight="900" fill="${INK}">${lab}</text><path d="M-280 -190 H280" stroke="#C9C2B8" stroke-width="6"/>
     ${rows.map(([w,f],i)=>{const y=-110+i*140, sh=show(i);return sh?`<text x="-280" y="${y+18}" font-size="56" font-weight="900" fill="${INK}">${w}</text><text x="40" y="${y+16}" font-size="50" font-weight="900" fill="#9AA7BD">=</text>${fill(i)?w12_food(f,170,y,.5*fill(i),g):`<text x="170" y="${y+18}" text-anchor="middle" font-size="56" font-weight="900" fill="#C9C2B8">?</text>`}${chk(i)?icon('check',290,y,.42*chk(i)):''}`:'';}).join('')}</g>`;
  const later=AT(t,la);
  return `${card('cardMint',g)}
   ${cardF(later?520:960,'TEST 1',i=>AT(t,li+i*.5),i=>pop(t,li+.3+i*.5),i=>0)}
   ${later?`<g transform="translate(1400,0)">${''}</g>${cardF(1400,'MONTHS LATER',i=>AT(t,la+.4+i*.3),i=>pop(t,ma+i*.4),i=>pop(t,ma+.3+i*.4))}`:''}
   ${later?`<g transform="translate(960,${520+Math.sin(g*2)*6}) scale(${pop(t,la)})"><path d="M-40 -30 H20 V-60 L70 0 L20 60 V30 H-40Z" fill="${P.gold}" stroke="${INK}" stroke-width="7"/></g>`:''}
   ${AT(t,fk)?`<rect width="1920" height="1080" fill="#000" opacity="${.55*prog(t,fk,fk+.3)}"/>${T(960,560,"CAN'T FAKE IT",{size:150,fill:P.red,rot:-8,sc:pop(t,fk)})}`:''}
   ${T(960,150,AT(t,ma)?'SAME WORD, SAME TASTE':later?'NO WARNING. TEST AGAIN.':'THE TASTE TEST',{size:84,fill:AT(t,ma)?P.mint:P.white,sc:pop(t,AT(t,ma)?ma:later?la:.2)})}`;
},
twMorning(t,d,p,g){
  const wk=p.wake??2.6, pa=p.pan??7.3, gd=p.good??9.8;
  if(!AT(t,wk)){
    let sp='';for(let i=0;i<8;i++){const a=i/8*6.283+g;sp+=`<g transform="translate(${960+Math.cos(a)*420},${560+Math.sin(a)*300}) scale(${.6+.4*Math.sin(g*4+i)})"><path d="M0 -20 L5 -5 L20 0 L5 5 L0 20 L-5 5 L-20 0 L-5 -5Z" fill="${P.gold}"/></g>`;}
    return `${card('cardGold',g)}${sp}${glint({x:960,y:560,s:1.1,t:g,pose:'flex',mouth:'grin',brows:'raised',blink:BL(g),glint:Math.max(0,Math.sin(t*3))})}${T(960,170,'YOUR NEW POWER',{size:110,fill:P.gold,sc:IN(t,.1)})}`;
  }
  const ring=!AT(t,pa)?Math.sin(g*40)*6:0;
  return `${bgRoom(g)}<rect x="900" y="640" width="900" height="120" rx="20" fill="#5A6AA0" stroke="${INK}" stroke-width="8"/><rect x="900" y="560" width="200" height="100" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="920" y="760" width="30" height="100" fill="${INK}"/><rect x="1750" y="760" width="30" height="100" fill="${INK}"/>
   ${glint({x:1250,y:400,s:.85,t:g,legs:'sit',pose:AT(t,gd)?'up':'down',mouth:AT(t,pa+.8)?'grin':'o',brows:'raised',blink:BL(g)})}
   <rect x="1150" y="600" width="600" height="120" rx="30" fill="#7C8CD0" stroke="${INK}" stroke-width="8"/>
   <rect x="280" y="660" width="260" height="200" fill="#5A4A3A" stroke="${INK}" stroke-width="8"/>
   <g transform="translate(410,${560}) rotate(${ring})"><circle r="90" fill="${P.coral}" stroke="${INK}" stroke-width="9"/><circle r="66" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M0 0 V-46 M0 0 L30 14" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><circle cx="-60" cy="-80" r="26" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><circle cx="60" cy="-80" r="26" fill="${P.gold}" stroke="${INK}" stroke-width="6"/></g>
   ${!AT(t,pa)?bubble(470,300,420,120,'"GOOD MORNING!"',{size:50,tail:'left'}):''}
   ${w12_morph(t,pa,'GOOD MORNING','pancake',470,300,900,330,{g,lab:'WARM PANCAKES',ly:-170,size:60,col:P.gold})}
   ${AT(t,gd)?labelPill(560,850,'A GOOD START',P.mint,44):''}`;
},
twMeeting(t,d,p,g){
  const ms=p.msg??1.4, mt=p.meet??3.2, ce=p.cereal??4.3, oc=p.course??7.5;
  return `${bgRoom(g)}${glint({x:520,y:560,s:1,t:g,pose:'reach',mouth:AT(t,ce+.8)?(AT(t,oc)?'flat':'frown'):'smile',brows:AT(t,oc)?'angry':(AT(t,ce+.8)?'sad':'calm'),blink:BL(g),look:1})}
   <g transform="translate(1000,${540+Math.sin(g*2)*5}) rotate(6)"><rect x="-150" y="-260" width="300" height="520" rx="36" fill="${INK}"/><rect x="-130" y="-230" width="260" height="450" rx="18" fill="#1E2A48"/>
     ${AT(t,ms)?`<g transform="scale(${pop(t,ms)})"><rect x="-115" y="-200" width="230" height="${AT(t,mt)?170:110}" rx="16" fill="#FFF6EA" stroke="${INK}" stroke-width="5"/><text x="-95" y="-160" font-size="30" font-weight="900" fill="${P.coral}">BOSS</text>
     ${AT(t,mt)?`<text x="-95" y="-75" font-size="42" font-weight="900" fill="${INK}">Meeting.</text>`:`<circle cx="-70" cy="-120" r="8" fill="#9AA7BD"/><circle cx="-45" cy="-120" r="8" fill="#9AA7BD"/><circle cx="-20" cy="-120" r="8" fill="#9AA7BD"/>`}</g>`:''}</g>
   ${w12_morph(t,ce,'"MEETING."','cereal',1000,380,1480,470,{g,lab:'COLD, SOGGY CEREAL',lc:'#C9D3E0',size:64,col:P.white,fs:1.1,ly:170})}
   ${AT(t,oc)?T(960,160,'OF COURSE IT DOES.',{size:90,fill:P.coral,sc:pop(t,oc)}):''}`;
},
twHey(t,d,p,g){
  const pm=p.mint??3.4, ev=p.every??4.7, so=p.song??9.3, nw=p.news??12.2;
  if(!AT(t,ev)){
    return `${bgRoom(g)}<rect x="0" y="640" width="1920" height="40" fill="#D9D6C8" stroke="${INK}" stroke-width="6"/><rect x="0" y="680" width="1920" height="200" fill="#8A6A4A"/>
     ${glint({x:560,y:430,s:.95,t:g,mouth:AT(t,pm+.6)?'grin':'smile',brows:AT(t,pm+.6)?'raised':'calm',blink:BL(g)})}
     ${extra({x:1440,y:430,s:.95,t:g,head:'#8D5A3B',mouth:'smile',pose:'up'})}
     ${!AT(t,pm)?bubble(1180,200,260,120,'"HEY!"',{size:64,tail:'right'}):''}
     ${w12_morph(t,pm,'"HEY"','mint',1180,220,900,360,{g,lab:'PEPPERMINT',ly:160,size:80,col:P.mint})}`;
  }
  const words=['HELLO','PIZZA?','LOL','THANKS','RAIN','WOW','OKAY','LATER'], foods=['straw','pancake','sweet','choc','mint','berry','cake','coffee'];
  let sw='';
  const song=AT(t,so), news=AT(t,nw);
  if(!song) words.forEach((w,i)=>{const a=i/8*6.283+g*.35, rx=700, ry=290; const x=960+Math.cos(a)*rx, y=500+Math.sin(a)*ry;
     sw+=`${w12_chip(x,y-60,w,[P.coral,'#3A7BD5','#1FAF8A','#B47CFF'][i%4],pop(t,ev+i*.1),38)}${w12_food(foods[i],x,y+40,.4*pop(t,ev+.2+i*.1),g+i)}`;});
  const tv=`<g transform="translate(1360,500)"><rect x="-230" y="-170" width="460" height="320" rx="20" fill="#2A3248" stroke="${INK}" stroke-width="9"/><rect x="-200" y="-140" width="400" height="250" rx="10" fill="#1E2A48"/><text y="-50" text-anchor="middle" font-size="64" font-weight="900" fill="${P.red}">NEWS</text><rect x="-160" y="0" width="320" height="18" rx="9" fill="#5D6A82"/><rect x="-160" y="40" width="240" height="18" rx="9" fill="#5D6A82"/></g>`;
  return `${card(song?'cardGold':'cardDark',g)}${sw}
   ${song&&!news?`${[0,1,2,3].map(i=>w12_note(420+i*130,440+Math.sin(g*3+i)*40,.9,[P.gold,P.coral,P.mint,'#B47CFF'][i])).join('')}${w12_food('cake',1350,520,1.3*pop(t,so),g)}${w12_food('icecream',1060,560,.8*pop(t,so+.3),g)}${T(1200,800,'AMAZING',{size:90,fill:P.gold,sc:pop(t,so+.4)})}`:''}
   ${news?`${tv}${w12_food('stink',1360,300,1.3,g)}${glint({x:520,y:560,s:.9,t:g,mouth:'wavy',brows:'sad',tint:'#D8F5C0',blink:BL(g)})}${T(1360,800,'MAYBE NOT...',{size:80,fill:'#9BE15D',sc:pop(t,nw+1)})}`:''}
   ${!song?`<g>${glint({x:960,y:470,s:.7,t:g,mouth:'o',brows:'raised',blink:BL(g)})}</g>`:''}
   ${T(960,140,news?'THE NEWS...':song?'YOUR FAVORITE SONG':'EVERY WORD HAS A FLAVOR',{size:84,fill:P.white,sc:pop(t,news?nw:song?so:ev)})}`;
},
twChildhood(t,d,p,g){
  const ns=p.not??15.7, A=[p.choc??11.4,p.mash??12.3,p.cer??13.7,p.sw??14.6];
  const F=[['choc','CHOCOLATE'],['mash','MASHED POTATOES'],['cereal','CEREAL'],['sweet','SWEETS']];
  const not=AT(t,ns), kids=AT(t,p.kids??8.3);
  let row=''; if(!not) F.forEach(([f,l],i)=>{if(AT(t,A[i])){const x=330+i*420; row+=`${w12_food(f,x,500,1.05*pop(t,A[i]),g+i)}${T(x,700,l,{size:l.length>10?40:50,fill:w12_FC[f],stroke:8,sc:pop(t,A[i]+.2)})}`;}});
  const kid = !AT(t,A[0]) ? `${paper(1300,520,.9,4,'NOTES',6)}${glint({x:640,y:560,s:1,t:g,mouth:'grin',brows:'raised',blink:BL(g)})}${kids?`<g transform="translate(960,850)">${labelPill(0,0,'FOODS FROM WHEN THEY WERE KIDS',P.gold,44)}</g>`:''}`:'';
  return `${card('cardWarm',g)}${kid}${row}
   ${not?`${w12_food('sushi',700,500,1.2*pop(t,ns),g)}${w12_food('coffee',1220,500,1*pop(t,ns+.3),g)}${icon('cross',820,380,.8*pop(t,ns+.7))}${icon('cross',1340,380,.8*pop(t,ns+.9))}`:''}
   ${T(960,140,not?'NOT SUSHI OR FANCY COFFEE':'TASTES FROM CHILDHOOD',{size:84,fill:not?P.coral:P.white,sc:pop(t,not?ns:.2)})}`;
},
twYoungBrain(t,d,p,g){
  const st=p.set??6.4, set=AT(t,st);
  const W=['CAT','SUN','BALL','MOM'], F=['choc','pancake','cereal','sweet'];
  const k=prog(t,.6,5.5); let s='';
  W.forEach((w,i)=>{const y=300+i*150; s+=w12_chip(330,y,w,[P.coral,'#3A7BD5','#1FAF8A','#B47CFF'][i],1,46)+w12_food(F[i],1600,y,.5,g+i);
    const kk=prog(k,i*.2,i*.2+.3); if(kk>0){s+=`<path d="M440 ${y} C700 ${y} 760 520 960 520 C1160 520 1220 ${y} 1480 ${y}" stroke="${set?P.gold:P.mint}" stroke-width="10" fill="none" stroke-dasharray="${kk*1400} 2000" opacity=".8"/>`;}});
  const lock=set?`<g transform="translate(960,700) scale(${pop(t,st)})"><path d="M-50 -20 V-60 Q-50 -110 0 -110 Q50 -110 50 -60 V-20" stroke="${INK}" stroke-width="30" fill="none"/><path d="M-50 -20 V-60 Q-50 -110 0 -110 Q50 -110 50 -60 V-20" stroke="#C9D3E3" stroke-width="14" fill="none"/><rect x="-80" y="-30" width="160" height="130" rx="18" fill="${P.gold}" stroke="${INK}" stroke-width="9"/><circle cy="20" r="16" fill="${INK}"/><path d="M0 20 V60" stroke="${INK}" stroke-width="12"/></g>`:'';
  return `${card('cardDark',g)}${s}${brain(960,500,.9,1,g)}${lock}
   ${T(330,200,'WORDS',{size:56,fill:P.white,stroke:9})}${T(1600,200,'FOODS',{size:56,fill:P.white,stroke:9})}
   ${T(960,150,set?'SET FOR LIFE':'WIRED WHILE YOUNG',{size:90,fill:set?P.gold:P.mint,sc:pop(t,set?st:.2)})}`;
},
twSoundAlike(t,d,p,g){
  const fo=p.food??3.3, sh=p.share??8.4, share=AT(t,sh);
  if(share){
    const L=['NAMES','PLACES','BRANDS'];
    return `${card('cardMint',g)}${L.map((l,i)=>{const x=420+i*540;return `${w12_chip(x,330,l,[P.coral,'#3A7BD5','#B47CFF'][i],pop(t,sh+i*.3),56)}<path d="M${x} 400 Q${x} 520 960 600" stroke="${P.gold}" stroke-width="10" fill="none" stroke-dasharray="20 14" opacity="${prog(t,sh+.6,sh+1)}"/>`;}).join('')}
      <g transform="translate(960,${680+Math.sin(g*2)*8}) scale(${pop(t,sh+1)})"><path d="M0 -90 C40 -40 70 0 70 40 A70 70 0 0 1 -70 40 C-70 0 -40 -40 0 -90Z" fill="${P.gold}" stroke="${INK}" stroke-width="9"/></g>
      ${T(960,880-30,'ONE SHARED FLAVOR',{size:56,fill:P.gold,sc:pop(t,sh+1.3)})}${T(960,150,'SOUND ALIKE, TASTE ALIKE',{size:84,fill:P.white,sc:pop(t,sh)})}`;
  }
  const wv=(x0,x1,y)=>{let d='';for(let i=0;i<=40;i++){const x=lerp(x0,x1,i/40);d+=(i?'L':'M')+x+' '+(y+Math.sin(i*.9-g*6)*24);}return `<path d="${d}" stroke="${P.gold}" stroke-width="9" fill="none" stroke-linecap="round"/>`;};
  return `${card('cardMint',g)}${w12_chip(520,420,'BARRY',P.coral,1.4*IN(t,.3),60)}${w12_chip(1400,420,'BERRY',P.coral,1.4*IN(t,.8),60)}${wv(740,1180,420)}
   ${T(960,340,'SOUNDS LIKE',{size:44,fill:P.gold,stroke:8,op:prog(t,1,1.3)})}
   ${w12_food('berry',1400,660,1*IN(t,1),g)}${AT(t,fo)?`${w12_food('berry',520,660,1*pop(t,fo),g)}${T(520,830-30,'TASTES LIKE BERRIES?',{size:48,fill:'#8A9BFF',stroke:8,sc:pop(t,fo+.3)})}`:''}
   ${T(960,150,'THE SOUND OF A WORD',{size:84,fill:P.white,sc:IN(t,.2)})}`;
},
twTipTongue(t,d,p,g){
  const li=p.lit??6.2, lit=AT(t,li);
  if(!lit){
    return `${card('cardIce',g)}${glint({x:620,y:580,s:1.05,t:g,mouth:'wavy',brows:'sad',look:1,blink:BL(g)})}
     ${[0,1,2].map(i=>`<circle cx="${800+i*60}" cy="${370-i*50}" r="${14+i*8}" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/>`).join('')}
     <g transform="translate(1300,330)"><ellipse rx="380" ry="170" fill="#FFF6EA" stroke="${INK}" stroke-width="9"/><text y="-20" text-anchor="middle" font-size="58" font-weight="900" fill="${INK}">IT'S ON THE TIP</text><text y="56" text-anchor="middle" font-size="58" font-weight="900" fill="${INK}">OF MY TONGUE...</text></g>
     ${T(1300,700,'? ? ?',{size:120,fill:P.ice,sc:1+.08*Math.sin(g*4)})}`;
  }
  return `${card('cardIce',g)}${w12_mouthTongue(960,470,1.25,g,'WORD?')}${w12_food('straw',1500,380,.6*pop(t,li+1),g)}${T(1500,560,'TASTE!',{size:56,fill:P.red,stroke:9,sc:pop(t,li+1.2)})}
   ${T(960,140,'ALMOST LITERAL',{size:96,fill:P.gold,sc:pop(t,li)})}`;
},
twRareObj(t,d,p,g){
  const ta=p.taste??5.9, be=p.before??10.1, br=p.brain??12.7, co=p.conn??15.8;
  if(AT(t,br)){
    const k=prog(t,co,co+1.5);
    return `${card('cardDark',g)}${brain(960,520,1.2,1,g)}
     ${w12_chip(420,520,'1. MEANING',P.mint,pop(t,co),50)}${w12_chip(1500,520,'2. SOUNDS',P.coral,pop(t,co+.8),50)}
     ${k>0?`<path d="M600 520 H${lerp(600,1310,k)}" stroke="${P.gold}" stroke-width="14" stroke-linecap="round" stroke-dasharray="26 18"/>`:''}
     ${T(960,150,AT(t,co)?'MEANING FIRST, SOUNDS LATER':'SOMETHING AMAZING',{size:84,fill:AT(t,co)?P.gold:P.white,sc:pop(t,AT(t,co)?co:br)})}`;
  }
  if(AT(t,be)){
    const k1=eout(prog(t,be+.2,be+1.2)), k2=eout(prog(t,be+.9,be+2.4));
    return `${card('cardGold',g)}<path d="M360 360 V720" stroke="#fff" stroke-width="6" opacity=".4"/><path d="M1560 360 V720" stroke="${P.mint}" stroke-width="8" stroke-dasharray="14 10"/>${T(1560,330,'FINISH',{size:40,fill:P.mint,stroke:7})}
     <rect x="360" y="420" width="${1200*k1}" height="90" rx="45" fill="${P.gold}" stroke="${INK}" stroke-width="7"/>${T(400,485,'TASTE',{size:56,fill:P.white,anchor:'start',stroke:10})}
     <rect x="360" y="580" width="${1200*k2}" height="90" rx="45" fill="${P.coral}" stroke="${INK}" stroke-width="7"/>${T(400,645,'WORD',{size:56,fill:P.white,anchor:'start',stroke:10})}
     ${k1>=1?T(1680,485,'1ST',{size:56,fill:P.gold,stroke:9}):''}${k2>=1?T(1680,645,'2ND',{size:56,fill:P.coral,stroke:9}):''}
     ${T(960,150,'THE TASTE ARRIVED FIRST',{size:90,fill:P.white,sc:pop(t,be)})}`;
  }
  const tst=AT(t,ta);
  return `${bgLab(g)}<g transform="translate(560,500) rotate(-4)"><rect x="-260" y="-230" width="520" height="440" rx="20" fill="#FFF6EA" stroke="${INK}" stroke-width="10"/>
     <g transform="translate(0,-10) rotate(${g*20})"><circle r="130" fill="#C9A46A" stroke="${INK}" stroke-width="8"/><circle r="90" fill="none" stroke="${INK}" stroke-width="6"/>${[0,45,90,135].map(a=>`<path d="M-130 0 H130" stroke="${INK}" stroke-width="5" transform="rotate(${a})"/>`).join('')}<circle r="22" fill="${P.gold}" stroke="${INK}" stroke-width="6"/></g>
     ${T(0,180,'NAME THIS?',{size:44,fill:P.coral,stroke:8})}</g>
   ${glint({x:1360,y:560,s:1,t:g,mouth:tst?'o':'wavy',brows:tst?'raised':'sad',look:-1,blink:BL(g)})}
   ${!tst?bubble(1360,230,300,120,'UMM...',{size:60,tail:'left'}):`${w12_food('choc',1620,320,.7*pop(t,ta),g)}${T(1620,450,'TASTE!',{size:56,fill:P.gold,stroke:9,sc:pop(t,ta+.2)})}`}
   ${T(960,110,'NAME THE RARE OBJECT',{size:72,fill:P.white,sc:IN(t,.2)})}`;
},
twBadTastes(t,d,p,g){
  const A=[0.3,p.teach??4.6,p.menu??13.2,p.song??17.8];
  const pan=(i,x,y,inner,title,col)=>{const on=AT(t,A[i]);if(!on)return '';const cur=(i===3||!AT(t,A[i+1]));
    return `<g transform="translate(${x},${y}) scale(${pop(t,A[i])*(cur?1:.94)})" opacity="${cur?1:.55}"><rect x="-410" y="-160" width="820" height="320" rx="24" fill="#1E2A48" stroke="${cur?col:INK}" stroke-width="10"/>${inner}${T(-380,-100,title,{size:44,fill:col,anchor:'start',stroke:8})}</g>`;};
  return `${card('cardDark',g)}
   ${pan(0,500,370,`${extra({x:-220,y:30,s:.4,t:g,head:'#FFB4A2',mouth:'smile'})}${w12_tag(-220,80,'???',.5)}${w12_food('egg',150,40,.75,g)}${T(150,140,'ROTTEN EGGS',{size:40,fill:'#9BE15D',stroke:7})}`,'A DATE',P.coral)}
   ${pan(1,1420,370,`<rect x="-360" y="-60" width="240" height="160" rx="6" fill="#2F5A3A" stroke="#7A5A3A" stroke-width="10"/>${extra({x:-80,y:0,s:.4,t:g,head:'#C3B1FF',glasses:true,mouth:'flat',pose:'point'})}${w12_food('soap',190,40,.75,g)}${T(190,140,'EVERY. DAY.',{size:40,fill:'#FFB4D9',stroke:7})}`,'YOUR TEACHER',P.gold)}
   ${pan(2,500,720,`<rect x="-330" y="-70" width="200" height="200" rx="10" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><text x="-230" y="-10" text-anchor="middle" font-size="30" font-weight="900" fill="${INK}">MENU</text><text x="-230" y="50" text-anchor="middle" font-size="36" font-weight="900" fill="#3DBE5C">SALAD</text><path d="M-90 30 H20" stroke="${P.gold}" stroke-width="10"/><path d="M20 30 l-24 -16 v32Z" fill="${P.gold}"/>${w12_food('cake',170,40,.75,g)}`,'THE MENU',P.mint)}
   ${pan(3,1420,720,`${[0,1,2].map(i=>w12_note(-300+i*110,40+Math.sin(g*3+i)*20,.6,[P.gold,P.coral,P.mint][i])).join('')}${w12_food('stink',170,80,1.1,g)}${T(170,60,'CHORUS',{size:44,fill:'#9BE15D',stroke:8})}`,'A SONG YOU LOVE',P.mint)}
   ${T(960,140,'NOT ALWAYS FUN',{size:84,fill:P.white,sc:IN(t,.2)})}`;
},
twBuffet(t,d,p,g){
  const mo=p.most??7.1, most=AT(t,mo);
  if(most){
    let h='';for(let i=0;i<6;i++){const a=i/6*6.283+g*.5;h+=`<g transform="translate(${960+Math.cos(a)*460},${560+Math.sin(a)*210}) scale(.7)">${heart(0,0,1,Math.sin(g*4+i))}</g>`;}
    return `${card('cardMint',g)}${h}${glint({x:960,y:560,s:1.05,t:g,pose:'up',mouth:'grin',brows:'raised',blink:BL(g),glint:Math.max(0,Math.sin(t*2))})}
     ${T(960,150,"WOULDN'T GIVE IT UP",{size:96,fill:P.mint,sc:pop(t,mo)})}${AT(t,p.world??10.5)?labelPill(960,880-40,"IT'S JUST HOW THE WORLD WORKS",P.gold,40):''}`;
  }
  const fs=['pancake','straw','choc','mint','sweet','cake','berry','toast','coffee','mash'];
  let c='';[[240,'#FFD3A8'],[560,'#8D5A3B'],[1360,'#C3B1FF'],[1680,'#F2C9A0']].forEach(([x,h],i)=>{c+=extra({x,y:600,s:.7,t:g+i,head:h,mouth:'laugh'});});
  let b='';for(let i=0;i<10;i++){const r=rng(40+i); const x=200+((i*173)%1520), y=260+((i*97)%170)+Math.sin(g*2+i)*16; const sc=pop(t,.2+i*.3);
    b+=`<g transform="translate(${x},${y}) scale(${sc})"><ellipse rx="90" ry="70" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/>${w12_food(fs[i],0,0,.45,g+i)}</g>`;}
  return `${bgNight(g)}${c}${b}${glint({x:960,y:600,s:.85,t:g,legs:'wobble',mouth:'wavy',brows:'sad',sweat:1,blink:BL(g)})}
   ${T(960,140,AT(t,p.buffet??2.4)?'A BUFFET YOU NEVER ORDERED':'IT CAN BE DISTRACTING',{size:84,fill:AT(t,p.buffet??2.4)?P.gold:P.white,sc:pop(t,AT(t,p.buffet??2.4)?p.buffet??2.4:.2)})}`;
},
twBouba(t,d,p,g){
  const ts=p.test??2.7, sh=p.shapes??4, ro=p.round??5.7, sp=p.spiky??9, bo=p.bouba??12.6, ki=p.kiki??14.5, wh=p.which??16.7, an=p.ans??18.1, ev=p.every??22.2;
  if(!AT(t,sh)){
    return `${card('cardGold',g)}${glint({x:560,y:560,s:1.1,t:g,pose:AT(t,ts)?'point':'shrug',mouth:'smirk',brows:'raised',blink:BL(g),glint:AT(t,ts)?Math.max(0,Math.sin(t*3)):0})}
     ${T(1300,450,'DO YOU HAVE IT',{size:90,fill:P.white,sc:IN(t,.2)})}${T(1300,560,'TOO?',{size:90,fill:P.white,sc:IN(t,.5)})}${AT(t,ts)?T(1300,740,"LET'S TEST IT",{size:100,fill:P.gold,sc:pop(t,ts)}):''}`;
  }
  const ans=AT(t,an), k=eout(prog(t,an,an+1));
  const lbB = ans ? [lerp(960,520,k),lerp(320,820,k)] : [960,320];
  const lbK = ans ? [lerp(960,1400,k),lerp(470,820,k)] : [960,470];
  const pause = AT(t,wh)&&!ans;
  return `${card('cardDark',g)}
   ${AT(t,ro)?`<g transform="translate(520,540) scale(${pop(t,ro)})">${w12_blob(0,0,190,g,'#7CF5FF')}</g>`:''}
   ${AT(t,sp)?`<g transform="translate(1400,540) scale(${pop(t,sp)})">${w12_star(0,0,220,g,P.gold)}</g>`:''}
   ${AT(t,bo)?T(lbB[0],lbB[1],'BOUBA',{size:96,fill:'#7CF5FF',sc:pop(t,bo)}):''}${AT(t,ki)?T(lbK[0],lbK[1],'KIKI',{size:96,fill:P.gold,sc:pop(t,ki)}):''}
   ${pause?`${T(960,720,'?',{size:220,fill:P.white,sc:1+.1*Math.sin(g*5)})}${labelPill(960,850,'PAUSE AND PICK!',P.coral,44)}`:''}
   ${ans?`${icon('check',700,380,.6*pop(t,an+1))}${icon('check',1600,350,.6*pop(t,an+1.2))}`:''}
   ${T(960,150,AT(t,ev)?"YOU'RE WITH ALMOST EVERYONE":pause?'WHICH IS WHICH?':'ROUND OR SPIKY?',{size:84,fill:AT(t,ev)?P.mint:P.white,sc:pop(t,AT(t,ev)?ev:pause?wh:sh)})}`;
},
twWorld(t,d,p,g){
  const nb=p.nobody??6.5, lk=p.linked??8.1, bl=p.blend??11.7;
  if(AT(t,lk)){
    const wv=(y,jag)=>{let d='';for(let i=0;i<=30;i++){const x=300+i*20;const v=jag?((i%2)?-40:40):Math.sin(i*.5-g*4)*40;d+=(i?'L':'M')+x+' '+(y+v);}return d;};
    return `${card('cardMint',g)}${T(300,330,'"BOUBA"',{size:56,fill:'#7CF5FF',anchor:'start',stroke:9})}<path d="${wv(400,false)}" stroke="#7CF5FF" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
     ${T(300,620,'"KIKI"',{size:56,fill:P.gold,anchor:'start',stroke:9})}<path d="${wv(690,true)}" stroke="${P.gold}" stroke-width="12" fill="none" stroke-linejoin="round"/>
     ${[400,690].map(y=>`<path d="M960 ${y} H1160" stroke="#fff" stroke-width="12"/><path d="M1180 ${y} l-34 -22 v44Z" fill="#fff"/>`).join('')}
     ${w12_blob(1420,400,110,g,'#7CF5FF')}${w12_star(1420,690,120,g,P.gold)}
     ${T(960,150,AT(t,bl)?'A TINY BIT OF BLENDING':'SOUND → SHAPE',{size:90,fill:AT(t,bl)?P.gold:P.white,sc:pop(t,AT(t,bl)?bl:lk)})}`;
  }
  const nob=AT(t,nb);
  let ppl='';for(let i=0;i<8;i++){const a=i/8*6.283+g*.15;const x=960+Math.cos(a)*500, y=560+Math.sin(a)*250;
    ppl+=`${extra({x,y:y-40,s:.32,t:g+i,head:['#FFD3A8','#8D5A3B','#F2C9A0','#C68B59'][i%4],mouth:'smile'})}<g transform="translate(${x+60},${y-120})"><rect x="-50" y="-30" width="100" height="60" rx="12" fill="#FFF6EA" stroke="${INK}" stroke-width="4"/>${w12_blob(-22,0,16,g,'#7CF5FF')}${w12_star(22,0,18,g,P.gold)}</g>`;}
  return `${card('cardIce',g)}<circle cx="960" cy="530" r="210" fill="#2A6FB0" stroke="${INK}" stroke-width="10"/>
   <path d="M820 420 q60 -60 120 -20 q40 40 -20 80 q-60 20 -40 80 q-40 20 -60 -40Z M1020 560 q60 -40 110 10 q10 60 -50 90 q-60 -20 -60 -100Z M1000 360 q40 -20 70 10 q-20 30 -70 -10Z" fill="#3DBE5C" stroke="${INK}" stroke-width="6"/>
   ${ppl}${nob?`<g transform="translate(960,530) scale(${pop(t,nb)})">${icon('cross',0,0,1.6)}</g>${T(960,880-40,'NOBODY TAUGHT YOU',{size:72,fill:P.coral,sc:pop(t,nb+.2)})}`:''}
   ${T(960,150,'SAME ANSWER, EVERYWHERE',{size:84,fill:P.white,sc:IN(t,.2)})}`;
},
twSweetSound(t,d,p,g){
  const sw=p.sweet??3.3, sm=p.smooth??4.6, ld=p.loud??6.4, mx=p.mixed??9.1;
  const C=[[sw,'A "SWEET" SOUND',P.gold],[sm,'A "SMOOTH" VOICE',P.mint],[ld,'A "LOUD" COLOR','#FF3DAE']];
  let s='';C.forEach(([a,l,c],i)=>{if(!AT(t,a))return;const x=380+i*580;
    const art = i===0?`${w12_note(-60,0,1.1,P.gold)}${w12_food('sweet',70,40,.6,g)}`
      : i===1?`${bubble(0,-30,220,110,'',{})}<path d="M-120 80 Q-60 40 0 80 T120 80" stroke="${P.mint}" stroke-width="16" fill="none" stroke-linecap="round"/>`
      : `<rect x="-110" y="-90" width="220" height="180" rx="20" fill="#FF3DAE" stroke="${INK}" stroke-width="8"/>${[0,1,2].map(j=>`<path d="M${130+j*22} ${-40-j*10} q${20} ${40+j*10} 0 ${80+j*20}" stroke="#fff" stroke-width="7" fill="none" opacity="${.5+.5*Math.sin(g*8+j)}"/>`).join('')}`;
    s+=`<g transform="translate(${x},${470}) scale(${pop(t,a)})"><rect x="-260" y="-230" width="520" height="460" rx="30" fill="#1E2A48" stroke="${c}" stroke-width="10"/><g transform="translate(0,-30)">${art}</g></g>${T(x,780,l,{size:46,fill:c,stroke:9,sc:pop(t,a+.2)})}`;});
  return `${card('cardDark',g)}${s}${T(960,150,AT(t,mx)?'MORE MIXED THAN YOU THINK':'YOU DO IT WITH TASTE TOO',{size:84,fill:AT(t,mx)?P.gold:P.white,sc:pop(t,AT(t,mx)?mx:.2)})}`;
},
twFeast(t,d,p,g){
  const fr=p.friend??3.6, po=p.poetry??6.8, bo=p.boss??8.9;
  if(AT(t,bo)){
    return `${bgRoom(g)}${glint({x:620,y:560,s:1,t:g,mouth:'wavy',brows:'sad',sweat:1,tint:'#E0F5C8',blink:BL(g)})}
     ${extra({x:1340,y:560,s:1,t:g,head:'#C3B1FF',tie:true,pose:'point'})}${w12_tag(1340,640,'DEREK',.85,-4)}${labelPill(1340,250,'YOUR NEW BOSS',P.coral,40)}
     ${w12_food('wax',960,360,.9*pop(t,bo+.8),g)}${T(960,140,'PLEASE NOT DEREK',{size:90,fill:P.coral,sc:pop(t,bo)})}`;
  }
  const pt=AT(t,po);
  return `${card('cardGold',g)}
   ${!pt?`${w12_tag(560,520,'BFF',2*IN(t,.3))}${T(560,720,'BEST FRIEND',{size:52,fill:P.white,stroke:9,op:prog(t,.3,.6)})}${w12_morph(t,fr,'BFF','icecream',560,520,1340,560,{g,lab:'FAVORITE DESSERT',size:56,fs:1.3,ly:240,lc:P.coral})}`
     :`<g transform="translate(960,560) scale(${pop(t,po)})"><path d="M-260 -140 Q-130 -180 0 -140 Q130 -180 260 -140 V160 Q130 120 0 160 Q-130 120 -260 160Z" fill="#FFF6EA" stroke="${INK}" stroke-width="9"/><path d="M0 -140 V160" stroke="${INK}" stroke-width="6"/>${[0,1,2,3].map(i=>`<rect x="-220" y="${-90+i*50}" width="${170-(i%2)*40}" height="14" rx="7" fill="#C9C2B8"/><rect x="40" y="${-90+i*50}" width="${170-(i%2)*30}" height="14" rx="7" fill="#C9C2B8"/>`).join('')}</g>
       ${['pancake','cake','straw','choc','sweet','berry'].map((f,i)=>{const a=i/6*6.283+g*.4;return w12_food(f,960+Math.cos(a)*560,520+Math.sin(a)*260,.6*pop(t,po+.2+i*.15),g+i);}).join('')}`}
   ${T(960,140,pt?'POETRY IS A FEAST':'EVERY WORD HAS A FLAVOR',{size:90,fill:P.white,sc:pop(t,pt?po:.2)})}`;
},
twAsk(t,d,p,g){
  const q=p.q??1.9, on=AT(t,q);
  return `${bgNight(g)}${glint({x:560,y:600,s:1.3,t:g,pose:'shrug',mouth:on?'smirk':'smile',brows:on?'raised':'calm',blink:BL(g),glint:on?Math.max(0,Math.sin((t-q)*3)):0})}
   ${on?`${T(960,150,'WHAT WOULD YOUR NAME',{size:84,fill:P.white,sc:pop(t,q)})}${T(960,260,'TASTE LIKE?',{size:110,fill:P.gold,sc:pop(t,q+.3)})}
     ${w12_tag(1300,560,'YOU',1.6*pop(t,q+.6),-6)}<path d="M1300 700 V760" stroke="${P.gold}" stroke-width="12"/><path d="M1300 790 l-26 -36 h52Z" fill="${P.gold}"/>
     <g transform="translate(1300,840)"><ellipse rx="190" ry="50" fill="#E8EEF5" ${w12_O}/>${T(0,10,'?',{size:110,fill:P.gold,sc:1+.1*Math.sin(g*4)})}</g>`:''}`;
}
});
