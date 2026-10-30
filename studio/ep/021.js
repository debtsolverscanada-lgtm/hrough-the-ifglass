// episode 021 scenes (talk to animals) — story episode
const t21_Y='#FFD84D', t21_Y2='#E2B21E'; // Kai's banana-yellow hoodie (this episode only)
// DAYLIGHT LEFT keyframes: [global seconds, seconds of daylight] — lands on each spoken number
const t21_KF=[[327.33,2400],[362.69,2100],[423.21,1500],[451.35,900],[466.80,600],[499.56,0]];
function t21_left(gt){const K=t21_KF;if(gt<=K[0][0])return K[0][1];for(let i=1;i<K.length;i++)if(gt<=K[i][0])return lerp(K[i-1][1],K[i][1],(gt-K[i-1][0])/(K[i][0]-K[i-1][0]));return 0;}
function t21_fmt(sec){sec=Math.max(0,Math.ceil(sec));return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;}
function t21_timer(sec,g,o={}){const {x=1660,y=120,s=1,label='DAYLIGHT LEFT'}=o;const c=sec<=900?P.red:'#FFB13B';const pl=1+.035*Math.sin(g*8);
  return `<g transform="translate(${x},${y}) scale(${(s*pl).toFixed(3)})"><rect x="-220" y="-80" width="440" height="160" rx="20" fill="#120610" fill-opacity=".9" stroke="${c}" stroke-width="7"/>
   <g transform="translate(-176,-40)"><path d="M-16 0 A16 16 0 0 1 16 0Z" fill="${c}"/><path d="M-24 2 H24" stroke="${c}" stroke-width="4"/></g>
   <text x="14" y="-30" text-anchor="middle" font-size="30" font-weight="900" letter-spacing="3" fill="${c}">${label}</text>
   <text y="52" text-anchor="middle" font-size="88" font-weight="900" fill="#fff" style="font-variant-numeric:tabular-nums">${t21_fmt(sec)}</text></g>`;}
// big "PLUS:" / "MINUS:" label that pops at centre, then tucks into the top-left corner
function t21_pm(t,kind,sub){const plus=kind==='plus',col=plus?P.mint:P.red,k=eout(prog(t,2.1,2.7)),sc=lerp(1,.4,k)*pop(t,.02,.4),x=lerp(960,330,k),y=lerp(470,105,k);
  return `<rect width="1920" height="1080" fill="#05030C" opacity="${(.62*(1-k)).toFixed(3)}"/><g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(3)}) rotate(${(-3*(1-k)).toFixed(2)})">${T(0,0,plus?'PLUS:':'MINUS:',{size:230,fill:col,stroke:52})}${T(0,150,sub,{size:96,fill:P.white})}</g>`;}
// Glint's translation box (mint frame, "TRANSLATION" tab with tiny glasses)
function t21_tb(x,y,str,o={}){const {size=52,tail=0,sc=1,col=P.mint,op=1,tag='TRANSLATION',hi=-1,minw=330}=o;const L=Array.isArray(str)?str:[str];
  const w=Math.max(minw,Math.max(...L.map(l=>l.length))*size*.64+90),h=L.length*size*1.18+58,tx=clamp(tail,-w/2+50,w/2-50);
  return `<g transform="translate(${x},${y}) scale(${sc.toFixed?sc.toFixed(3):sc})" opacity="${op}"><path d="M${-w/2} ${-h/2} H${w/2} V${h/2} H${tx+24} L${tx} ${h/2+44} L${tx-24} ${h/2} H${-w/2}Z" fill="#0A1B24" fill-opacity=".94" stroke="${col}" stroke-width="7" stroke-linejoin="round"/>
   <g transform="translate(${-w/2+24},${-h/2})"><rect y="-21" width="${tag.length*19+90}" height="42" rx="14" fill="${col}" stroke="${INK}" stroke-width="5"/><circle cx="24" cy="0" r="9" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="46" cy="0" r="9" fill="none" stroke="${INK}" stroke-width="4"/><text x="64" y="9" font-size="25" font-weight="900" letter-spacing="2" fill="${INK}">${tag}</text></g>
   ${L.map((l,i)=>`<text y="${((i-(L.length-1)/2)*size*1.18+size*.36+6).toFixed(1)}" text-anchor="middle" font-size="${size}" font-weight="900" font-style="italic" fill="${hi===i?col:'#fff'}">${l}</text>`).join('')}</g>`;}
// plain cream speech bubble for people
function t21_bub(x,y,w,l1,l2,o={}){const {size=46,tail='left',sc=1}=o;const h=l2?size*2.7:size*1.8,tx=tail==='left'?-w/2+60:tail==='right'?w/2-60:0;
  return `<g transform="translate(${x},${y}) scale(${sc})"><path d="M${-w/2} ${-h/2} H${w/2} V${h/2} H${tx+30} L${tx} ${h/2+46} L${tx-14} ${h/2} H${-w/2}Z" fill="#FFF6EA" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   <text y="${l2?-size*.2:size*.35}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${INK}">${l1}</text>${l2?`<text y="${size*1.0}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${INK}">${l2}</text>`:''}</g>`;}
function t21_kai(o){let s=person({...o,who:'kai'}).split('#FF5E5B').join(t21_Y).split('#D8403E').join(t21_Y2);if(o.pale)s=s.split('#C68B59').join('#CDB2A0');return s;}
// headphones on Glint (same x,y,s,t as the glint() call). mode head|neck|off(lifted)
function t21_hp(x,y,s,t,o={}){const {mode='head',smoke=0,lift=0,col=P.coral}=o;const by=Math.sin(t*2.4)*5;let h='';
  if(mode==='neck') h=`<path d="M-74 26 Q0 74 74 26" stroke="${INK}" stroke-width="24" fill="none"/><path d="M-74 26 Q0 74 74 26" stroke="#3A3F58" stroke-width="12" fill="none"/><rect x="-104" y="-4" width="44" height="64" rx="18" fill="${col}" stroke="${INK}" stroke-width="7" transform="rotate(-20 -82 28)"/><rect x="60" y="-4" width="44" height="64" rx="18" fill="${col}" stroke="${INK}" stroke-width="7" transform="rotate(20 82 28)"/>`;
  else h=`<g transform="translate(0,${(-lift*170).toFixed(1)})"><path d="M-100 -60 Q-100 -178 0 -178 Q100 -178 100 -60" stroke="${INK}" stroke-width="26" fill="none"/><path d="M-100 -60 Q-100 -178 0 -178 Q100 -178 100 -60" stroke="#3A3F58" stroke-width="13" fill="none"/>
   <rect x="-126" y="-104" width="46" height="92" rx="20" fill="${col}" stroke="${INK}" stroke-width="8"/><rect x="80" y="-104" width="46" height="92" rx="20" fill="${col}" stroke="${INK}" stroke-width="8"/></g>`;
  let sm='';if(smoke>0)for(let i=0;i<6;i++){const k=((t*.5+i/6)%1),sx=(i%2?103:-103)+Math.sin(t*2+i)*14;sm+=`<circle cx="${sx.toFixed(0)}" cy="${(-80-k*220).toFixed(0)}" r="${(16+k*30).toFixed(0)}" fill="#8A8FA0" opacity="${(smoke*.55*(1-k)).toFixed(2)}"/>`;}
  return `<g transform="translate(${x},${(y+by).toFixed(1)}) scale(${s})">${h}${sm}</g>`;}
function t21_arcs(x,y,g,a=1,col='#fff',dir=1,s=1){if(a<=0)return '';let o='';for(let i=0;i<3;i++){const k=((g*1.6+i/3)%1),r=(30+k*70)*s;o+=`<path d="M${x+dir*r*.5} ${y-r} Q${x+dir*r*1.25} ${y} ${x+dir*r*.5} ${y+r}" stroke="${col}" stroke-width="${7*s}" fill="none" stroke-linecap="round" opacity="${(a*(1-k)).toFixed(2)}"/>`;}return o;}
// ---------- animals ----------
function t21_crow(x,y,s=1,g=0,o={}){const {call=0,dir=1,fly=0,ph=0,angry=0,col='#22202E'}=o;
  const bob=fly?Math.sin(g*6+ph)*8:Math.sin(g*3+ph)*3,gap=call?(.35+.65*Math.abs(Math.sin(g*9+ph))):0,fl=Math.sin(g*12+ph);
  const wing=fly?`<path d="M-20 -10 Q-30 ${(-70-fl*50).toFixed(0)} -120 ${(-50-fl*70).toFixed(0)} Q-70 0 -10 14Z" fill="#34304A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`
    :`<path d="M-48 -18 Q6 -42 44 -4 Q0 22 -56 14Z" fill="#34304A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  return `<g transform="translate(${x},${(y+bob).toFixed(1)}) scale(${s*dir},${s})">
   ${fly?'':`<path d="M-8 38 L-14 66 M14 38 L18 66" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`}
   <path d="M-50 4 L-128 ${fly?0:34} L-118 ${fly?-26:-2}Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
   <ellipse cx="0" cy="0" rx="66" ry="44" fill="${col}" stroke="${INK}" stroke-width="7"/>${wing}
   <circle cx="56" cy="-40" r="34" fill="${col}" stroke="${INK}" stroke-width="7"/>
   <g transform="translate(84,-44)"><path d="M0 -10 L52 ${(-2-gap*8).toFixed(1)} L2 4Z" fill="#4A4658" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M2 6 L46 ${(10+gap*14).toFixed(1)} L0 14Z" fill="#4A4658" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>
   <circle cx="64" cy="-50" r="10" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="67" cy="-50" r="5" fill="${INK}"/>
   ${angry?`<path d="M46 -70 L82 -60" stroke="${P.red}" stroke-width="7" stroke-linecap="round"/>`:''}
   ${call?t21_arcs(150,-44,g+ph,call,'#fff',1,.8):''}</g>`;}
function t21_pigeon(x,y,s=1,g=0,o={}){const {tilt=0,dir=1,blink=0}=o;const bob=Math.sin(g*2.6)*3;
  return `<g transform="translate(${x},${(y+bob).toFixed(1)}) scale(${s*dir},${s})"><path d="M-8 40 L-12 66 M14 40 L16 66" stroke="#E88A8A" stroke-width="8" stroke-linecap="round"/>
   <path d="M-52 4 L-118 26 L-108 -4Z" fill="#6E7790" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><ellipse cx="0" cy="4" rx="70" ry="48" fill="#A3ACC0" stroke="${INK}" stroke-width="7"/>
   <path d="M-50 -14 Q4 -36 40 0 Q0 24 -58 16Z" fill="#8892A8" stroke="${INK}" stroke-width="5"/><path d="M-30 -8 l24 4 M-36 4 l26 4" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
   <path d="M30 -30 Q52 -10 60 10" stroke="#5FBF9A" stroke-width="16" fill="none" opacity=".8"/>
   <g transform="translate(50,-48) rotate(${tilt*22})"><circle r="30" fill="#8E97AC" stroke="${INK}" stroke-width="7"/><path d="M26 -2 L46 4 L26 10Z" fill="#6A6070" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="24" cy="-6" r="5" fill="#fff"/>
   ${blink?`<path d="M2 -10 h18" stroke="${INK}" stroke-width="5"/>`:`<circle cx="10" cy="-8" r="9" fill="#FF9A3D" stroke="${INK}" stroke-width="3"/><circle cx="12" cy="-8" r="4" fill="${INK}"/>`}</g></g>`;}
function t21_pdog(x,y,s=1,g=0,o={}){const {call=0,dir=1,ph=0,look=0}=o;const gap=call?(.3+.7*Math.abs(Math.sin(g*10+ph))):0,bob=Math.sin(g*2+ph)*3;
  return `<g transform="translate(${x},${y}) scale(${s*dir},${s})"><g transform="translate(0,${bob.toFixed(1)})"><path d="M-46 0 Q-64 -110 -30 -168 Q0 -192 30 -168 Q64 -110 46 0Z" fill="#C9965A" stroke="${INK}" stroke-width="7"/><path d="M-22 -8 Q-30 -88 0 -116 Q30 -88 22 -8Z" fill="#EBCB98"/>
   <ellipse cx="-20" cy="-118" rx="14" ry="10" fill="#B8844A" stroke="${INK}" stroke-width="4"/><ellipse cx="20" cy="-118" rx="14" ry="10" fill="#B8844A" stroke="${INK}" stroke-width="4"/>
   <circle cx="-34" cy="-226" r="11" fill="#B8844A" stroke="${INK}" stroke-width="5"/><circle cx="34" cy="-226" r="11" fill="#B8844A" stroke="${INK}" stroke-width="5"/>
   <ellipse cx="0" cy="-198" rx="46" ry="38" fill="#C9965A" stroke="${INK}" stroke-width="7"/><ellipse cx="0" cy="-184" rx="22" ry="14" fill="#EBCB98"/>
   <circle cx="${-17+look*6}" cy="-208" r="7" fill="${INK}"/><circle cx="${17+look*6}" cy="-208" r="7" fill="${INK}"/><path d="M-6 -192 h12 l-6 6Z" fill="#5A3A2A"/>
   ${call?`<ellipse cx="0" cy="-176" rx="9" ry="${(3+gap*9).toFixed(1)}" fill="#3a1220" stroke="${INK}" stroke-width="3"/>`:`<path d="M-8 -178 q8 6 16 0" stroke="${INK}" stroke-width="4" fill="none"/>`}</g>
   ${call?t21_arcs(70,-190,g+ph,call,'#fff',1,.8):''}</g>`;}
function t21_mound(x,y,w=260){return `<path d="M${x-w/2} ${y} Q${x-w/4} ${y-60} ${x} ${y-64} Q${x+w/4} ${y-60} ${x+w/2} ${y}Z" fill="#B88A58" stroke="${INK}" stroke-width="7"/><ellipse cx="${x}" cy="${y-56}" rx="${w*.2}" ry="14" fill="#3A2416"/>`;}
function t21_bee(x,y,s=1,rot=0,g=0){const f=.55+.45*Math.abs(Math.sin(g*40));
  return `<g transform="translate(${x.toFixed?x.toFixed(1):x},${y.toFixed?y.toFixed(1):y}) rotate(${rot.toFixed?rot.toFixed(1):rot}) scale(${s})"><g transform="scale(1,${f.toFixed(2)})"><ellipse cx="-6" cy="-30" rx="26" ry="16" fill="#E6F6FF" fill-opacity=".85" stroke="${INK}" stroke-width="4" transform="rotate(-20 -6 -30)"/><ellipse cx="10" cy="-30" rx="22" ry="14" fill="#E6F6FF" fill-opacity=".85" stroke="${INK}" stroke-width="4" transform="rotate(20 10 -30)"/></g>
   <path d="M-44 0 L-58 0" stroke="${INK}" stroke-width="5"/><ellipse rx="42" ry="26" fill="#FFC83D" stroke="${INK}" stroke-width="6"/><path d="M-14 -23 V23 M8 -25 V25" stroke="${INK}" stroke-width="10"/><circle cx="44" cy="0" r="16" fill="${INK}"/><circle cx="50" cy="-5" r="4" fill="#fff"/></g>`;}
function t21_whale(x,y,s,g,dir=1){const b=Math.sin(g*1.1)*10,tf=Math.sin(g*1.6)*18;
  return `<g transform="translate(${x},${(y+b).toFixed(1)}) scale(${s*dir},${s})"><path d="M-330 -10 Q-336 -96 -240 -104 L60 -92 Q200 -70 300 -14 Q210 40 40 62 L-250 72 Q-336 62 -330 -10Z" fill="#5B6886" stroke="${INK}" stroke-width="9"/>
   <path d="M-310 44 Q-170 76 -10 58" stroke="#3E4866" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-60 -60 q30 10 60 0 M40 -50 q30 10 60 0 M-160 -70 q30 10 60 0" stroke="#7E8BAA" stroke-width="6" fill="none" stroke-linecap="round"/>
   <circle cx="-120" cy="8" r="9" fill="${INK}"/><circle cx="-117" cy="5" r="3" fill="#fff"/>
   <path d="M290 -14 L388 ${(-80+tf).toFixed(0)} L360 -12 L392 ${(56+tf).toFixed(0)}Z" fill="#5B6886" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/></g>`;}
function t21_bird(x,y,s=1,g=0,o={}){const {body='#8A6A4A',breast='#FF7A3A',dir=1,call=0,ph=0,cock=0}=o;const bob=Math.sin(g*4+ph)*3,gap=call?Math.abs(Math.sin(g*12+ph)):0;
  return `<g transform="translate(${x},${(y+bob).toFixed(1)}) scale(${s*dir},${s})"><path d="M-6 30 L-8 50 M8 30 L10 50" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
   <path d="M-34 0 L${cock?-56:-74} ${cock?-56:14} L${cock?-40:-70} ${cock?-60:-8}Z" fill="${body}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><ellipse rx="44" ry="34" fill="${body}" stroke="${INK}" stroke-width="6"/>
   <path d="M10 -20 Q44 0 20 30 Q0 20 6 -14Z" fill="${breast}"/><circle cx="30" cy="-26" r="22" fill="${body}" stroke="${INK}" stroke-width="6"/><path d="M14 -40 Q30 -30 26 -14" fill="${breast}" opacity="${breast===body?0:1}"/>
   <path d="M50 -30 L${68} ${(-28-gap*6).toFixed(1)} L50 -24Z M50 -22 L66 ${(-18+gap*8).toFixed(1)} L50 -18Z" fill="#E0A040" stroke="${INK}" stroke-width="3"/><circle cx="36" cy="-30" r="5" fill="${INK}"/></g>`;}
function t21_owl(x,y,s=1,g=0,o={}){const {blink=0}=o;const yawn=o.yawn||0;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-50 -60 L-40 -96 L-20 -66 M50 -60 L40 -96 L20 -66" fill="#8A6A4A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><ellipse rx="56" ry="70" fill="#8A6A4A" stroke="${INK}" stroke-width="6"/><ellipse cy="20" rx="34" ry="42" fill="#C9A47A"/>
   ${blink?`<path d="M-36 -26 h24 M12 -26 h24" stroke="${INK}" stroke-width="6"/>`:`<circle cx="-22" cy="-26" r="18" fill="#FFD84D" stroke="${INK}" stroke-width="5"/><circle cx="22" cy="-26" r="18" fill="#FFD84D" stroke="${INK}" stroke-width="5"/><circle cx="-22" cy="-26" r="8" fill="${INK}"/><circle cx="22" cy="-26" r="8" fill="${INK}"/>`}
   ${yawn?`<ellipse cy="2" rx="10" ry="12" fill="#3a1220" stroke="${INK}" stroke-width="4"/>`:`<path d="M-8 -6 L0 8 L8 -6Z" fill="#E0A040" stroke="${INK}" stroke-width="3"/>`}</g>`;}
function t21_squirrel(x,y,s=1,g=0,o={}){const {dir=1,call=0}=o;const tw=Math.sin(g*5)*8;
  return `<g transform="translate(${x},${y}) scale(${s*dir},${s})"><path d="M-30 10 Q${-110+tw} -10 ${-80+tw} -110 Q-40 -150 -30 -80 Q-50 -30 -20 0Z" fill="#B0603A" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="0" rx="36" ry="44" fill="#C06A40" stroke="${INK}" stroke-width="6"/>
   <circle cx="20" cy="-46" r="26" fill="#C06A40" stroke="${INK}" stroke-width="6"/><path d="M8 -70 L12 -86 L22 -70Z" fill="#C06A40" stroke="${INK}" stroke-width="4"/><circle cx="28" cy="-50" r="5" fill="${INK}"/>${call?`<ellipse cx="42" cy="-36" rx="5" ry="${(3+Math.abs(Math.sin(g*14))*5).toFixed(1)}" fill="#3a1220"/>`:''}</g>`;}
function t21_nut(x,y,s=1,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-34 -14 Q-40 -34 -18 -34 Q-2 -34 0 -20 Q2 -6 18 -6 Q40 -4 36 16 Q32 34 10 30 Q-6 28 -8 14 Q-10 2 -24 2 Q-32 0 -34 -14Z" fill="#D9A867" stroke="${INK}" stroke-width="5"/><path d="M-22 -22 l4 4 M12 12 l4 4 M20 6 l4 4" stroke="#A87A3A" stroke-width="4" stroke-linecap="round"/></g>`;}
function t21_bag(x,y,s=1,crush=0,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-70 -80 L${-60+crush*12} -100 L-20 ${-84+crush*10} L20 ${-102+crush*8} L${60-crush*10} -86 L70 -80 L${76-crush*14} 90 Q0 ${104-crush*16} ${-76+crush*14} 90Z" fill="#C9965A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
   ${crush?`<path d="M-50 -30 L-10 0 L-40 30 M30 -40 L10 10 L44 40" stroke="#8A6A3A" stroke-width="5" fill="none"/>`:''}<rect x="-58" y="-14" width="116" height="40" rx="8" fill="#FFF6EA" stroke="${INK}" stroke-width="4"/><text y="16" text-anchor="middle" font-size="25" font-weight="900" fill="${P.red}">PEANUTS</text>${t21_nut(0,60,.6,20)}</g>`;}
function t21_phone(x,y,s,inner='',rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-120" y="-210" width="240" height="420" rx="32" fill="#1A1A26" stroke="${INK}" stroke-width="9"/><rect x="-100" y="-178" width="200" height="350" rx="14" fill="#0E1830"/>${inner}<rect x="-30" y="-196" width="60" height="8" rx="4" fill="#333"/></g>`;}
// "DANGER FACE" / "PEANUT FACE" tag that floats above Kai. flip: 0..1 animates the switch
function t21_ftag(x,y,sc=1,flip=0,g=0){const k=clamp(flip),pea=k>=.5,fx=Math.abs(Math.cos(k*Math.PI))||.02,col=pea?P.gold:P.red,bob=Math.sin(g*3)*6;
  return `<g transform="translate(${x},${(y+bob).toFixed(1)}) scale(${(sc*fx).toFixed(3)},${sc})"><path d="M-22 50 L0 84 L22 50Z" fill="${col}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-290" y="-54" width="580" height="108" rx="22" fill="${col}" stroke="${INK}" stroke-width="9"/>
   ${pea?t21_nut(-232,0,.85,-20):`<g transform="translate(-236,0)"><path d="M0 -36 L36 30 H-36Z" fill="#FFF6EA" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M0 -14 V10" stroke="${P.red}" stroke-width="9" stroke-linecap="round"/><circle cy="22" r="5" fill="${P.red}"/></g>`}
   <text x="34" y="22" text-anchor="middle" font-size="62" font-weight="900" fill="${pea?INK:'#fff'}">${pea?'PEANUT FACE':'DANGER FACE'}</text></g>`;}
function t21_call(x,y,w,seed,col,g,a=1){const r=rng(seed);let s='';const n=18,bw=w/n;for(let i=0;i<n;i++){const h=(14+r()*70)*(.75+.25*Math.sin(g*7+i));s+=`<rect x="${(x+i*bw).toFixed(1)}" y="${(y-h/2).toFixed(1)}" width="${(bw*.62).toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="${col}" opacity="${a}"/>`;}return s;}
function t21_rescuer(x,y,s,g,o={}){const {pose='down',look=0,helm='#FF5E2A'}=o;const by=Math.sin(g*2.4+1)*4;
  return `${extra({x,y,s,t:g,head:'#E6B98E',pose,look})}<g transform="translate(${x},${(y+by).toFixed(1)}) scale(${s})"><path d="M-36 34 H36 L42 150 H-42Z" fill="#FF6A2A" stroke="${INK}" stroke-width="6"/><path d="M-40 100 H40" stroke="#F4F6FA" stroke-width="10"/>
   <path d="M-86 -80 Q-86 -150 0 -150 Q86 -150 86 -80Z" fill="${helm}" stroke="${INK}" stroke-width="8"/><path d="M-96 -80 H96" stroke="${INK}" stroke-width="10" stroke-linecap="round"/></g>`;}
// ---------- sets ----------
const t21_DEF=`<defs><linearGradient id="t21sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241E52"/><stop offset=".5" stop-color="#7A3E78"/><stop offset=".82" stop-color="#FF8E5A"/><stop offset="1" stop-color="#FFC98A"/></linearGradient>
 <linearGradient id="t21snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2D6F0"/><stop offset="1" stop-color="#8E94C4"/></linearGradient>
 <linearGradient id="t21day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5FB6F5"/><stop offset="1" stop-color="#CDEBFF"/></linearGradient>
 <linearGradient id="t21sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E6AA8"/><stop offset="1" stop-color="#061A3A"/></linearGradient></defs>`;
function t21_pine(x,y,h,col,sn=0,ink=0){const w=h*.4;let s=`<rect x="${(x-h*.035).toFixed(0)}" y="${(y-h*.16).toFixed(0)}" width="${(h*.07).toFixed(0)}" height="${(h*.16).toFixed(0)}" fill="#2A1A20"/>`;
  for(let i=0;i<3;i++){const ty=y-h*.12-i*h*.26,tw=w*(1-i*.26),th=h*.42;s+=`<path d="M${(x-tw).toFixed(0)} ${ty.toFixed(0)} L${x} ${(ty-th).toFixed(0)} L${(x+tw).toFixed(0)} ${ty.toFixed(0)}Z" fill="${col}" ${ink?`stroke="${INK}" stroke-width="6" stroke-linejoin="round"`:''}/>`;
    if(sn)s+=`<path d="M${(x-tw*.5).toFixed(0)} ${(ty-th*.5).toFixed(0)} L${x} ${(ty-th).toFixed(0)} L${(x+tw*.5).toFixed(0)} ${(ty-th*.5).toFixed(0)} Q${x} ${(ty-th*.62).toFixed(0)} ${(x-tw*.5).toFixed(0)} ${(ty-th*.5).toFixed(0)}Z" fill="#EEF2FF" opacity="${sn}"/>`;}
  return s;}
function t21_flakes(g,a=1,n=70,seed=4){if(a<=0)return '';const r=rng(seed);let s='';for(let i=0;i<n;i++){const sp=40+r()*80,x0=r()*1920,y=((r()*1100+g*sp)%1100)-10,x=x0+Math.sin(g*.8+i)*30,rr=2+r()*5;s+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rr.toFixed(1)}" fill="#fff" opacity="${(a*(.45+r()*.5)).toFixed(2)}"/>`;}return s;}
function t21_woods(g,o={}){const {dusk=.3,near=1,seed=21,sunX=1480}=o;const sy=lerp(560,760,dusk);const r=rng(seed);let far='',mid='',nr='';
  for(let x=-40;x<1980;x+=70+r()*50)far+=t21_pine(x,690,170+r()*130,'#3A2E62',.5);
  for(let x=-60;x<2000;x+=110+r()*90)mid+=t21_pine(x,730,280+r()*180,'#251C46',.8);
  if(near)[[60,1.0],[1880,1.1]].forEach(([x,k])=>nr+=t21_pine(x,1000,620*k,'#160F2C',.9,1));
  return `${t21_DEF}<rect width="1920" height="1080" fill="url(#t21sky)"/><circle cx="${sunX}" cy="${sy.toFixed(0)}" r="330" fill="url(#gWarm)" opacity="${(.7*(1-dusk)).toFixed(2)}"/><circle cx="${sunX}" cy="${sy.toFixed(0)}" r="74" fill="#FFD9A0" opacity="${(1-dusk*.8).toFixed(2)}"/>
   ${far}<path d="M0 700 Q480 670 960 690 Q1440 710 1920 680 V1080 H0Z" fill="url(#t21snow)"/>${mid}
   <path d="M0 770 Q600 740 1100 770 Q1500 790 1920 760 V1080 H0Z" fill="#C4C9E8" stroke="${INK}" stroke-width="5"/>
   <rect width="1920" height="1080" fill="#090722" opacity="${(dusk*.62).toFixed(2)}"/>${nr}`;}
function t21_museum(g,o={}){const {flare=0}=o;let s=`<rect width="1920" height="1080" fill="#120C26"/><rect y="820" width="1920" height="260" fill="#1C1430"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="6"/>`;
  [120,1800].forEach(x=>s+=`<rect x="${x-50}" y="0" width="100" height="820" fill="#1E1840" stroke="${INK}" stroke-width="6"/>`);
  [420,1500].forEach((x,i)=>s+=`<path d="M${x-40} 0 L${x-240} 820 H${x+240} L${x+40} 0Z" fill="#FFF6D0" opacity="${(.05+.03*Math.sin(g*2+i)+flare*.3).toFixed(3)}"/>`);
  return s;}
function t21_dome(x,y,s,g,o={}){const {glow=0,red=0}=o;const c=red?P.red:P.mint;let sp='';
  for(let i=0;i<5;i++)for(let j=0;j<3;j++){const a=Math.PI*(.15+i*.175),rr=150+j*110;const sx=Math.cos(a)*rr,sy=-Math.sin(a)*rr*.86;sp+=`<circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="${26-j*3}" fill="#2A2450" stroke="${INK}" stroke-width="5"/><circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="${(10+glow*6*Math.abs(Math.sin(g*9+i+j))).toFixed(1)}" fill="${c}" opacity="${(.4+glow*.6).toFixed(2)}"/>`;}
  return `<g transform="translate(${x},${y}) scale(${s})"><circle cy="-200" r="${560}" fill="${red?'url(#gRed)':'url(#gMint)'}" opacity="${(.15+glow*.4).toFixed(2)}"/><path d="M-520 0 A520 450 0 0 1 520 0Z" fill="#1C2650" stroke="${INK}" stroke-width="10"/><path d="M-430 0 A430 370 0 0 1 430 0" stroke="#3B4A78" stroke-width="8" fill="none"/><path d="M-300 0 A300 260 0 0 1 300 0" stroke="#3B4A78" stroke-width="8" fill="none"/>${sp}<rect x="-560" y="-8" width="1120" height="30" rx="10" fill="#2A2450" stroke="${INK}" stroke-width="7"/></g>`;}
function t21_sign(x,y,str,col=P.mint,g=0,size=64){const w=str.length*size*.66+70,fl=.85+.15*Math.sin(g*13);return `<g transform="translate(${x},${y})"><rect x="${-w/2}" y="${-size*.85}" width="${w}" height="${size*1.5}" rx="18" fill="#0B0820" stroke="${col}" stroke-width="6" opacity=".95"/><text y="${size*.34}" text-anchor="middle" font-size="${size}" font-weight="900" letter-spacing="4" fill="${col}" opacity="${fl.toFixed(2)}">${str}</text></g>`;}
function t21_kitchen(g,o={}){const {snow=0}=o;let s=`<rect width="1920" height="1080" fill="#4A3358"/><rect y="560" width="1920" height="260" fill="#5B4068"/>`;
  for(let i=1;i<24;i++)s+=`<path d="M${i*80} 560 V820" stroke="#000" stroke-opacity=".12" stroke-width="3"/>`;
  s+=`<path d="M0 640 H1920 M0 720 H1920" stroke="#000" stroke-opacity=".12" stroke-width="3"/><rect y="820" width="1920" height="260" fill="#2E2238"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="6"/>
   <rect x="180" y="150" width="380" height="300" fill="#1A1A44"/><circle cx="470" cy="230" r="28" fill="#fff4dc"/>${snow?t21_flakes(g,.9,16,9).replace(/cx="(\d+)"/g,(m,v)=>`cx="${180+(+v%380)}"`).replace(/cy="(-?\d+)"/g,(m,v)=>`cy="${150+(((+v)%300)+300)%300}"`):''}
   <rect x="180" y="150" width="380" height="300" fill="none" stroke="#E8E2D6" stroke-width="16"/><path d="M370 150 V450 M180 300 H560" stroke="#E8E2D6" stroke-width="10"/><rect x="160" y="450" width="420" height="26" rx="6" fill="#E8E2D6" stroke="${INK}" stroke-width="5"/>
   <circle cx="1600" cy="640" r="${(260+Math.sin(g*3)*12).toFixed(0)}" fill="url(#gWarm)" opacity=".45"/><rect x="1440" y="500" width="320" height="320" rx="14" fill="#E8E2D6" stroke="${INK}" stroke-width="9"/><rect x="1475" y="590" width="250" height="180" rx="12" fill="#FF9F43" stroke="${INK}" stroke-width="7"/><rect x="1500" y="612" width="200" height="136" rx="8" fill="#FFC86A" opacity="${(.6+.3*Math.sin(g*4)).toFixed(2)}"/>
   ${[1500,1570,1640,1710].map(x=>`<circle cx="${x}" cy="535" r="14" fill="#5D6A82" stroke="${INK}" stroke-width="5"/>`).join('')}
   <rect x="900" y="560" width="440" height="40" rx="8" fill="#C9A46A" stroke="${INK}" stroke-width="7"/><rect x="920" y="600" width="400" height="220" fill="#8A6A4A" stroke="${INK}" stroke-width="7"/>
   <path d="M1000 470 h90 v90 h-90Z" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><text x="1045" y="525" text-anchor="middle" font-size="26" font-weight="900" fill="${INK}">FLOUR</text>`;
  return s;}
function t21_zoo(g){const r=rng(5);let cl='';for(let i=0;i<3;i++){const x=((r()*1920+g*12*(i+1))%2200)-140;cl+=`<g transform="translate(${x.toFixed(0)},${110+i*70})"><ellipse rx="110" ry="36" fill="#fff" opacity=".85"/><ellipse cx="60" cy="-20" rx="70" ry="34" fill="#fff" opacity=".85"/></g>`;}
  return `${t21_DEF}<rect width="1920" height="1080" fill="url(#t21day)"/><circle cx="1680" cy="150" r="70" fill="#FFE27A"/><circle cx="1680" cy="150" r="140" fill="url(#gGold)" opacity=".6"/>${cl}
   <path d="M0 560 Q500 520 960 550 Q1500 580 1920 540 V700 H0Z" fill="#7BC47F"/><rect y="640" width="1920" height="440" fill="#E2C28A"/><path d="M0 640 H1920" stroke="${INK}" stroke-width="5"/>
   ${[...Array(13)].map((_,i)=>`<rect x="${i*160}" y="570" width="22" height="130" fill="#8A6A4A" stroke="${INK}" stroke-width="4"/>`).join('')}<path d="M0 595 H1920 M0 650 H1920" stroke="#8A6A4A" stroke-width="12"/>`;}
function t21_street(g,o={}){const {spring=1}=o;return `${t21_DEF}<rect width="1920" height="1080" fill="url(#t21day)"/><rect x="1100" y="200" width="320" height="560" fill="#C98A6A" stroke="${INK}" stroke-width="7"/><rect x="1440" y="300" width="420" height="460" fill="#9AA7BD" stroke="${INK}" stroke-width="7"/>
   ${[0,1,2].map(i=>`<rect x="${1140+i*90}" y="260" width="60" height="80" fill="#2A3248" stroke="${INK}" stroke-width="4"/><rect x="${1140+i*90}" y="400" width="60" height="80" fill="#2A3248" stroke="${INK}" stroke-width="4"/>`).join('')}
   <rect y="760" width="1920" height="320" fill="#8E8A96"/><path d="M0 760 H1920" stroke="${INK}" stroke-width="6"/>${[...Array(10)].map((_,i)=>`<path d="M${i*200} 760 L${i*200-60} 1080" stroke="#7A7682" stroke-width="5"/>`).join('')}
   <rect x="440" y="300" width="70" height="470" fill="#6B4A3A" stroke="${INK}" stroke-width="7"/><path d="M475 420 L330 330 M475 360 L620 280" stroke="#6B4A3A" stroke-width="22" stroke-linecap="round"/>
   <circle cx="380" cy="260" r="170" fill="${spring?'#6CC46C':'#3E7A4A'}" stroke="${INK}" stroke-width="7"/><circle cx="600" cy="230" r="150" fill="${spring?'#7ED07A':'#3E7A4A'}" stroke="${INK}" stroke-width="7"/><circle cx="480" cy="150" r="140" fill="${spring?'#8EDC86':'#4A8A56'}" stroke="${INK}" stroke-width="7"/>
   ${spring?[[330,200],[560,170],[640,280],[420,110],[300,320]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="12" fill="#FFB6C8" stroke="${INK}" stroke-width="3"/>`).join(''):''}`;}
function t21_nest(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-70 0 Q0 50 70 0 Z" fill="#8A6A3A" stroke="${INK}" stroke-width="6"/><path d="M-60 6 l120 -4 M-50 16 l100 -2" stroke="#6A4A2A" stroke-width="5"/></g>`;}
function t21_allot(g){return `${t21_DEF}<rect width="1920" height="1080" fill="url(#t21day)"/><rect y="640" width="1920" height="440" fill="#7A5A3A"/><path d="M0 640 H1920" stroke="${INK}" stroke-width="5"/><path d="M0 600 Q600 570 1200 600 T1920 590 V650 H0Z" fill="#6CB46C"/>
   ${[0,1,2,3].map(i=>`<path d="M0 ${720+i*80} H1920" stroke="#5A3E26" stroke-width="16"/>${[...Array(12)].map((_,j)=>`<circle cx="${80+j*160+(i%2)*60}" cy="${704+i*80}" r="18" fill="#5FB45F" stroke="${INK}" stroke-width="4"/>`).join('')}`).join('')}`;}
function t21_hive(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-110" y="-200" width="220" height="200" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><path d="M-110 -133 H110 M-110 -66 H110" stroke="${INK}" stroke-width="5"/><path d="M-130 -200 L0 -260 L130 -200Z" fill="#C98A6A" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><rect x="-36" y="-20" width="72" height="14" fill="${INK}"/><path d="M-90 0 V40 M90 0 V40" stroke="${INK}" stroke-width="14"/></g>`;}
function t21_berries(x,y,s=1,g=0){let b='';const r=rng(12);for(let i=0;i<26;i++){const bx=(r()-.5)*360,by=-r()*200;b+=`<circle cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" r="${(12+r()*8).toFixed(0)}" fill="${r()>.25?'#3A1A4A':'#B0304A'}" stroke="${INK}" stroke-width="3"/>`;}
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="-90" rx="220" ry="130" fill="#2E7A3E" stroke="${INK}" stroke-width="7"/><path d="M-200 -60 q60 -90 120 -20 q40 -80 110 -10 q50 -70 90 10" stroke="#1E5A2E" stroke-width="8" fill="none"/>${b}</g>`;}
function t21_carpark(g){return `${t21_DEF}<rect width="1920" height="1080" fill="#0B1026"/>${t21_flakes(g,.6,30,7)}<rect y="700" width="1920" height="380" fill="#3A4060"/><path d="M0 700 H1920" stroke="${INK}" stroke-width="6"/><path d="M0 760 H1920" stroke="#E8EEFF" stroke-width="10" opacity=".5"/>
   ${[...Array(14)].map((_,i)=>`<rect x="${i*150}" y="440" width="20" height="270" fill="#6A7088" stroke="${INK}" stroke-width="4"/>`).join('')}<path d="M0 470 H1920" stroke="#6A7088" stroke-width="16"/><path d="M0 470 H1920" stroke="#EEF2FF" stroke-width="5" opacity=".7" transform="translate(0,-9)"/>`;}
function t21_ambulance(x,y,s,g,o={}){const {lights=1}=o;const on=Math.sin(g*10)>0;return `<g transform="translate(${x},${y}) scale(${s})">${lights?`<circle cx="${on?-120:120}" cy="-330" r="260" fill="${on?'#3D7BFF':P.red}" opacity=".25"/>`:''}<rect x="-380" y="-300" width="620" height="300" rx="20" fill="#F4F6FA" stroke="${INK}" stroke-width="9"/><path d="M240 -220 H360 L420 -120 V0 H240Z" fill="#F4F6FA" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M262 -200 H350 L396 -126 H262Z" fill="#9AD1FF" stroke="${INK}" stroke-width="6"/>
   <rect x="-380" y="-140" width="800" height="36" fill="#2E8B57"/><path d="M-140 -260 H-60 V-230 H-30 V-170 H-60 V-140" fill="none"/><rect x="-120" y="-270" width="40" height="110" fill="${P.red}"/><rect x="-155" y="-235" width="110" height="40" fill="${P.red}"/>
   <rect x="-60" y="-326" width="80" height="26" rx="8" fill="${on?'#3D7BFF':'#1A2A5A'}" stroke="${INK}" stroke-width="5"/><rect x="40" y="-326" width="80" height="26" rx="8" fill="${on?'#4A1020':P.red}" stroke="${INK}" stroke-width="5"/>
   <circle cx="-240" cy="0" r="56" fill="#22202E" stroke="${INK}" stroke-width="8"/><circle cx="300" cy="0" r="56" fill="#22202E" stroke="${INK}" stroke-width="8"/><circle cx="-240" cy="0" r="20" fill="#9AA7BD"/><circle cx="300" cy="0" r="20" fill="#9AA7BD"/></g>`;}
function t21_sea(g){let rays='';for(let i=0;i<6;i++)rays+=`<path d="M${200+i*300+Math.sin(g*.5+i)*40} 0 L${100+i*300} 1080 L${260+i*300} 1080Z" fill="#9AD1FF" opacity=".06"/>`;let bub='';const r=rng(3);for(let i=0;i<24;i++){const x=r()*1920,y=1080-((r()*1080+g*(30+r()*40))%1100);bub+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(3+r()*8).toFixed(1)}" fill="none" stroke="#CFE8FF" stroke-width="3" opacity=".5"/>`;}
  return `${t21_DEF}<rect width="1920" height="1080" fill="url(#t21sea)"/>${rays}${bub}`;}
function t21_card(id,g){return bgCard(id,g);}
function t21_bed(x,y){return `<g transform="translate(${x},${y})"><rect x="-360" y="-60" width="720" height="120" rx="20" fill="#5A3E6A" stroke="${INK}" stroke-width="8"/><rect x="-380" y="-200" width="50" height="320" rx="14" fill="#8A6A4A" stroke="${INK}" stroke-width="7"/><rect x="-330" y="-110" width="170" height="70" rx="30" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/></g>`;}

Object.assign(SHOTS,{
aniHook(t,d,p,g){
  const edge=p.edge??17.68;
  if(t<edge){const wh=AT(t,p.where??2.01),ank=AT(t,p.ankle??6.47),sn=AT(t,p.snow??11.79),dk=AT(t,p.dark??13.37);
    const dusk=.22+.35*prog(t,p.sun??9.4,edge);
    const kx=560,ky=600;
    const inset=`<g transform="translate(560,560) scale(${pop(t,p.where??2.01).toFixed(3)}) translate(-560,-560)">
      <clipPath id="t21h1"><rect x="230" y="270" width="660" height="590" rx="30"/></clipPath><g clip-path="url(#t21h1)"><rect x="230" y="270" width="660" height="590" fill="#2A1C24"/>
      <path d="M230 270 H420 L470 470 L440 860 H230Z M890 270 H700 L650 470 L690 860 H890Z" fill="#4A3030"/><path d="M420 270 H700" stroke="#EEF2FF" stroke-width="30"/>
      <path d="M330 600 q30 -40 60 0 q30 -40 60 0 M680 520 q30 -40 60 0 q30 -40 60 0 M300 760 q30 -40 60 0" stroke="#3E2A30" stroke-width="10" fill="none"/>
      <rect x="420" y="270" width="280" height="30" fill="#C9B4FF" opacity=".25"/>
      ${t21_kai({x:kx,y:ky,s:.72,t:g,legs:'sit',mouth:'frown',brows:'sad',blink:BL(g),sweat:1})}
      ${ank?`<circle cx="${kx+48}" cy="${ky+205}" r="${(26+Math.sin(g*6)*6).toFixed(0)}" fill="none" stroke="${P.red}" stroke-width="7"/>`:''}
      ${t21_phone(740,800,.26,`<rect x="-40" y="-24" width="70" height="40" rx="6" fill="none" stroke="${P.red}" stroke-width="8"/><rect x="30" y="-10" width="10" height="14" fill="${P.red}"/>`,-20)}${t21_flakes(g,sn?.9:0,20,2)}</g>
      <rect x="230" y="270" width="660" height="590" rx="30" fill="none" stroke="${INK}" stroke-width="12"/><rect x="230" y="270" width="660" height="590" rx="30" fill="none" stroke="#FFB13B" stroke-width="5"/>
      <g transform="translate(560,270)">${labelPill(0,0,'HARROW WOODS',P.gold,38)}</g></g>`;
    return `${t21_woods(g,{dusk})}${wh?inset:''}
     ${ank?`<g transform="translate(1340,520) scale(${pop(t,p.ankle??6.47).toFixed(3)})">${labelPill(0,0,'TWISTED ANKLE',P.coral,44)}</g><g transform="translate(1340,640) scale(${pop(t,(p.ankle??6.47)+1.6).toFixed(3)})">${labelPill(0,0,'DEAD PHONE',P.coral,44)}</g>`:''}
     ${dk?`<g transform="translate(1340,770) scale(${pop(t,p.dark??13.37).toFixed(3)})">${labelPill(0,0,'SEARCH STOPS AT DARK',P.gold,44)}</g>`:''}
     ${t21_timer(2400,g,{x:1340,y:330,s:1.25})}${T(960,150,'KAI HAS 40 MINUTES',{size:96,fill:P.white,sc:IN(t,.15)})}${t21_flakes(g,sn?prog(t,p.snow??11.79,(p.snow??11.79)+2):0,60)}`;}
  const ls=AT(t,p.listen??21.35),cr=AT(t,p.crows??23.17);
  let crows='';[[1180,330,.6],[1420,250,.55],[1650,360,.62],[1320,470,.5],[1560,520,.5]].forEach(([x,y,s],i)=>{crows+=t21_crow(x,y,s,g,{call:cr?1:0,ph:i*.7,dir:-1});});
  return `${t21_woods(g,{dusk:.55,near:0})}<path d="M1060 400 L1760 300 M1240 520 L1700 560 M1100 300 L1500 280" stroke="#120C22" stroke-width="18" stroke-linecap="round"/>${crows}
   ${glint({x:420,y:520,s:1.05,t:g,look:1,mouth:cr?'o':'flat',brows:cr?'raised':'calm',pose:cr?'point':'down',blink:BL(g)})}${t21_hp(420,520,1.05,g,{mode:'neck'})}
   ${t21_timer(2400,g,{x:1660,y:120,s:.8})}${t21_flakes(g,.8,60)}
   ${T(760,880,'1,000 ACRES OF TREES',{size:60,fill:P.ice,sc:IN(t,edge+.4)})}
   ${ls&&!cr?T(960,150,'NOT LISTENING FOR PEOPLE',{size:84,fill:P.white,sc:pop(t,p.listen??21.35)}):''}${cr?T(960,150,'LISTENING TO THE CROWS',{size:90,fill:P.gold,sc:pop(t,p.crows??23.17)}):''}`;
},
aniDome(t,d,p,g){
  const ten=AT(t,p.ten??1.18),dm=AT(t,p.dome??7.27);const icons=[[p.whale??12.02,470,330],[p.bee??13.22,960,250],[p.bird??14.31,1450,330]];
  let ic='';icons.forEach(([a,x,y],i)=>{if(!AT(t,a))return;const k=pop(t,a);const inner=i===0?`${t21_whale(0,0,.32,g)}${[0,1,2].map(j=>`<path d="M${140+j*24} -30 v60" stroke="${P.mint}" stroke-width="10" stroke-linecap="round" opacity="${(Math.sin(g*10-j)>0?1:.3)}"/>`).join('')}`
      :i===1?`${t21_bee(Math.sin(g*3)*30,Math.cos(g*5)*10,1.3,Math.sin(g*3)*20,g)}${t21_arcs(80,0,g,1,P.gold,1,.8)}`
      :`${t21_bird(0,0,1.4,g,{body:'#6FA0D8',breast:'#FFD84D',call:1})}${[0,1].map(j=>`<g transform="translate(${110+j*50},${-60-((g*60+j*40)%60)})"><circle r="10" fill="${P.white}"/><path d="M8 0 V-36" stroke="#fff" stroke-width="5"/></g>`).join('')}`;
    ic+=`<g transform="translate(${x},${y}) scale(${k.toFixed(3)})"><circle r="120" fill="#0B0820" stroke="${P.mint}" stroke-width="6" opacity=".9"/>${inner}</g>`;});
  if(!ten) return `${t21_card('cardDark',g)}<g transform="translate(960,470) scale(${pop(t,.05).toFixed(3)})">${[0,1].map(i=>`<path d="M${-20-i*110} -90 L${-150-i*110} 0 L${-20-i*110} 90Z" fill="${P.mint}" stroke="${INK}" stroke-width="10" stroke-linejoin="round" transform="translate(${130+((g*200)%40)},0)"/>`).join('')}</g>${T(960,700,"LET'S GO BACK",{size:110,fill:P.white,sc:IN(t,.1)})}`;
  return `${t21_museum(g)}${t21_dome(960,820,dm?1:.9,g,{glow:dm?.6:.15})}${t21_sign(960,150,'WILD VOICES',P.mint,g,80)}${ic}
   ${glint({x:1700,y:520,s:.8,t:g,look:-1,mouth:dm?'grin':'smile',blink:BL(g)})}${t21_hp(1700,520,.8,g,{mode:'neck'})}
   ${!dm?`<g transform="translate(330,470) scale(${pop(t,p.ten??1.18).toFixed(3)})"><rect x="-210" y="-90" width="420" height="180" rx="22" fill="#0B1026" stroke="${P.gold}" stroke-width="8"/>${T(0,-10,'10 DAYS',{size:84,fill:P.gold})}${T(0,60,'EARLIER',{size:50,fill:P.white})}</g>`:''}
   ${dm&&t<(p.whale??12.02)?T(960,330,'A GIANT SOUND DOME',{size:76,fill:P.white,sc:pop(t,p.dome??7.27)}):''}`;
},
aniSurge(t,d,p,g){
  const su=AT(t,p.surge??4.48),sc=AT(t,p.scream??7.29);const sh=sc?Math.sin(g*60)*8:su?Math.sin(g*50)*3:0;
  const fl=su?Math.max(0,1-(t-(p.surge??4.48))*2):0;let rings='';if(sc)for(let i=0;i<5;i++){const k=((g*1.4+i/5)%1);rings+=`<circle cx="960" cy="640" r="${(150+k*900).toFixed(0)}" fill="none" stroke="${P.red}" stroke-width="${(18*(1-k)).toFixed(1)}" opacity="${(1-k).toFixed(2)}"/>`;}
  return `<g transform="translate(${sh.toFixed(1)},${(-sh*.6).toFixed(1)})">${t21_museum(g)}${t21_dome(960,820,1,g,{glow:su?1:.35,red:su})}${rings}
   <rect x="780" y="660" width="360" height="110" rx="14" fill="#2A3248" stroke="${INK}" stroke-width="7"/>${[0,1,2,3,4,5].map(i=>`<rect x="${805+i*55}" y="690" width="36" height="50" rx="6" fill="${[P.mint,P.gold,P.coral][i%3]}" opacity="${(.4+.6*Math.abs(Math.sin(g*(su?20:3)+i))).toFixed(2)}"/>`).join('')}
   ${glint({x:960,y:420,s:.9,t:g,mouth:sc?'o':su?'wavy':'smile',brows:su?'raised':'calm',blink:su?0:BL(g),pose:sc?'up':'down',shiver:su?1:0})}${t21_hp(960,420,.9,g)}
   ${su?`<path d="M1520 0 L1440 220 L1520 220 L1400 460" stroke="#fff" stroke-width="16" fill="none" stroke-linejoin="round"/><path d="M1520 0 L1440 220 L1520 220 L1400 460" stroke="${P.gold}" stroke-width="8" fill="none" stroke-linejoin="round"/>`:''}</g>
   <rect width="1920" height="1080" fill="#fff" opacity="${fl.toFixed(2)}"/>
   <g transform="translate(260,140)"><rect x="-190" y="-60" width="380" height="120" rx="18" fill="#0B1026" stroke="${P.ice}" stroke-width="6"/>${T(0,24,'2:00 AM',{size:72,fill:P.ice})}</g>
   ${sc?T(960,170,'EVERY SPEAKER AT ONCE',{size:96,fill:P.red,sc:pop(t,p.scream??7.29)}):su?T(1100,170,'POWER SURGE',{size:110,fill:P.gold,sc:pop(t,p.surge??4.48)}):''}`;
},
aniPigeon(t,d,p,g){
  const ld=AT(t,p.ledge??3.59),w1=AT(t,p.w1??9.9),w2=AT(t,p.w2??11.09),w3=AT(t,p.w3??12),st=AT(t,p.stare??13.35),bk=AT(t,p.back??15.02);
  const words=w3?['“WARM. WARM.','CRUMBS?”']:w2?['“WARM. WARM.”']:['“WARM.”'];
  const win=`<rect x="1080" y="140" width="640" height="520" fill="#0A1030"/><circle cx="1600" cy="240" r="40" fill="#fff4dc"/>${t21_stars(g)}<rect x="1080" y="140" width="640" height="520" fill="none" stroke="#2A2450" stroke-width="20"/><path d="M1400 140 V660" stroke="#2A2450" stroke-width="12"/><rect x="1050" y="650" width="700" height="34" rx="8" fill="#9AA7BD" stroke="${INK}" stroke-width="6"/>`;
  const gl=ld?glint({x:640,y:560,s:.95,t:g,legs:'sit',look:1,mouth:st?'o':w1?'o':'flat',brows:w1?'raised':'sad',blink:st?0:BL(g),glint:w1?1:0})+t21_hp(640,560,.95,g,{mode:'neck',smoke:.6})
    :glint({x:700,y:728,s:.95,t:0,rot:-90,eyes:t<1.2?'x':'open',mouth:'wavy'})+`<g transform="translate(560,640)">${t21_hp(0,0,.8,g,{smoke:AT(t,p.smoke??1.64)?1:0})}</g>`;
  return `${t21_museum(g)}${win}${t21_pigeon(1290,600,1.15,g,{tilt:ld?Math.sin(g*1.5)*.9:0,dir:-1,blink:bk&&(g%2)<.15})}${gl}
   ${w1?t21_tb(1290,330,words,{size:58,tail:0,sc:pop(t,p.w1??9.9)}):''}
   ${!ld?T(960,150,AT(t,p.smoke??1.64)?'HEADPHONES: SMOKING':'ON THE FLOOR',{size:90,fill:AT(t,p.smoke??1.64)?P.coral:P.white,sc:pop(t,AT(t,p.smoke??1.64)?p.smoke??1.64:.1)}):''}
   ${st&&!bk?T(640,200,'!',{size:160,fill:P.gold,sc:pop(t,p.stare??13.35)}):''}${bk?T(960,880,'THE PIGEON STARES BACK',{size:64,fill:P.white,sc:pop(t,p.back??15.02)}):''}`;
},
aniRules(t,d,p,g){
  const wo=AT(t,p.world??3.01),de=AT(t,p.dec??6.89),mo=AT(t,p.more??9.88),sci=AT(t,p.sci??11.27);
  if(sci){const k=eout(prog(t,(p.sci??11.27)+.4,(p.sci??11.27)+2.4));
    return `${t21_card('cardMint',g)}${T(960,160,'ANIMALS SAY MORE THAN WE THOUGHT',{size:70,fill:P.white,sc:pop(t,p.sci??11.27)})}
     <rect x="360" y="${700-120}" width="320" height="120" rx="10" fill="#5D6A82" stroke="${INK}" stroke-width="8"/>${T(520,780,'WHAT WE USED',{size:44,fill:P.ice})}${T(520,830,'TO THINK',{size:44,fill:P.ice})}
     <rect x="1240" y="${(700-470*k).toFixed(0)}" width="320" height="${(470*k).toFixed(0)}" rx="10" fill="${P.mint}" stroke="${INK}" stroke-width="8"/>${T(1400,780,'REAL SCIENCE',{size:44,fill:P.mint})}
     <path d="M300 700 H1640" stroke="${INK}" stroke-width="10"/>${glint({x:960,y:520,s:.7,t:g,mouth:'grin',brows:'raised',pose:'point',blink:BL(g)})}`;}
  const left=wo?`<g transform="translate(520,520) scale(${pop(t,p.world??3.01).toFixed(3)})">${dog(-40,140,.9,g)}${t21_bub(-10,-150,480,'“HELLO, HUMAN!”','',{size:48})}<path d="M-230 -210 L210 -90 M210 -210 L-230 -90" stroke="${P.red}" stroke-width="18" stroke-linecap="round"/>${T(0,300,'NOT ENGLISH',{size:60,fill:P.red})}</g>`:'';
  const right=de?`<g transform="translate(1380,500) scale(${pop(t,p.dec??6.89).toFixed(3)})"><path d="M-330 -60 ${[...Array(16)].map((_,i)=>`L${-330+i*14} ${-60+Math.sin(i*1.3+g*8)*36}`).join(' ')}" stroke="${P.ice}" stroke-width="8" fill="none"/>
     <g transform="translate(-40,-60)"><circle cx="-24" r="30" fill="none" stroke="${P.goldRim}" stroke-width="12"/><circle cx="24" r="30" fill="none" stroke="${P.goldRim}" stroke-width="12"/></g><path d="M20 -60 H90" stroke="${P.mint}" stroke-width="10"/><path d="M80 -78 L104 -60 L80 -42Z" fill="${P.mint}"/>
     ${['DANGER','FOOD','FAMILY'].map((s,i)=>`<g transform="translate(240,${-150+i*95})">${labelPill(0,0,s,[P.red,P.gold,P.mint][i],40)}</g>`).join('')}${T(0,240,'REAL SIGNALS',{size:60,fill:P.mint})}</g>`:'';
  return `${t21_card('cardDark',g)}${left}${right}${!wo?`${glint({x:960,y:560,s:1.1,t:g,mouth:'smile',brows:'raised',pose:'hips',blink:BL(g)})}`:''}
   ${T(960,150,'THE RULES',{size:120,fill:P.gold,sc:IN(t,.1)})}${mo?`<g transform="translate(960,860) rotate(-4) scale(${pop(t,p.more??9.88).toFixed(3)})">${labelPill(0,0,'NOTHING MORE',P.coral,56)}</g>`:''}`;
},
aniPrairie(t,d,p,g){
  const de=AT(t,p.dec??1.56),ca=AT(t,p.calls??7.27),sh=AT(t,p.shirt??12.15),ds=AT(t,p.desc??17.67);
  const base=`${t21_zoo(g)}${t21_mound(330,820,300)}${t21_pdog(330,780,1,g,{call:ca?1:0})}`;
  if(ds){const ch=[[p.desc??17.67,'TYPE',P.coral],[p.size??21.21,'SIZE',P.gold],[p.col??22.81,'COLOUR',P.mint]];
    return `${base}<rect x="620" y="250" width="1200" height="560" rx="30" fill="#0B1026" fill-opacity=".9" stroke="${INK}" stroke-width="8"/>${T(1220,340,'ONE ALARM CALL CARRIES:',{size:56,fill:P.white})}
     ${ch.map(([a,l,c],i)=>{if(!AT(t,a))return '';const x=800+i*420,k=pop(t,a);const ic=i===0?`<path d="M-80 0 Q-40 -50 0 -10 Q40 -50 80 0 Q40 -20 0 20 Q-40 -20 -80 0Z" fill="${INK}"/>`:i===1?`<rect x="-80" y="10" width="40" height="30" fill="${INK}"/><rect x="-20" y="-20" width="40" height="60" fill="${INK}"/><rect x="40" y="-60" width="40" height="100" fill="${c}" stroke="${INK}" stroke-width="5"/>`:`${['#FF5E5B','#FFD84D','#3D7BFF','#3DDC6A'].map((cc,j)=>`<rect x="${-84+j*44}" y="-36" width="38" height="76" rx="8" fill="${cc}" stroke="${INK}" stroke-width="5"/>`).join('')}`;
       return `<g transform="translate(${x},560) scale(${k.toFixed(3)})"><rect x="-180" y="-150" width="360" height="300" rx="24" fill="${c}" fill-opacity=".18" stroke="${c}" stroke-width="7"/><g transform="translate(0,-30)">${ic}</g>${T(0,110,l,{size:64,fill:c})}</g>`;}).join('')}`;}
  if(sh){const cols=['#3D7BFF','#FFD84D','#3DDC6A','#FF5E5B'],idx=Math.floor((t-(p.shirt??12.15))/1.4)%4,cc=cols[idx],chg=AT(t,p.chg??15.81);
    const walker=extra({x:1100+Math.sin(g*.6)*80,y:430,s:.95,t:g,head:'#F2C9A0',pose:'down'})+`<path d="M${(1100+Math.sin(g*.6)*80-46).toFixed(0)} ${(462+Math.sin(g*2.4+1)*4).toFixed(0)} h92 l8 130 h-108Z" fill="${cc}" stroke="${INK}" stroke-width="6"/>`;
    return `${base}${walker}<rect x="1360" y="300" width="460" height="300" rx="24" fill="#0B1026" fill-opacity=".92" stroke="${cc}" stroke-width="8"/>${T(1590,360,'ALARM CALL',{size:40,fill:P.white})}${t21_call(1400,470,390,30+idx*7,cc,g)}
     ${T(960,150,'SAME PERSON, NEW SHIRT',{size:90,fill:P.white,sc:pop(t,p.shirt??12.15)})}${chg?T(1590,680,'THE CALL CHANGES',{size:52,fill:P.gold,sc:pop(t,p.chg??15.81)}):''}`;}
  const preds=[[p.hawk??8.59,'HAWK',P.coral],[p.coy??9.32,'COYOTE',P.gold],[p.dog??10.19,'DOG','#9AD1FF'],[p.hum??10.97,'HUMAN',P.mint]];
  const grid=ca?preds.map(([a,l,c],i)=>{if(!AT(t,a))return '';const x=880+(i%2)*500,y=330+Math.floor(i/2)*290,k=pop(t,a);
     const ic=i===0?`<path d="M-90 0 Q-40 -40 0 -6 Q40 -40 90 0 Q40 -16 0 16 Q-40 -16 -90 0Z" fill="${INK}"/>`:i===1?dog(-10,10,.42,g,{col:'#A89070'}):i===2?dog(-10,10,.42,g,{col:'#C9A46A'}):extra({x:0,y:-30,s:.28,t:g,head:'#F2C9A0'});
     return `<g transform="translate(${x},${y}) scale(${k.toFixed(3)})"><rect x="-220" y="-120" width="440" height="240" rx="22" fill="#0B1026" fill-opacity=".9" stroke="${c}" stroke-width="7"/><g transform="translate(-130,-10)">${ic}</g>${T(-130,95,l,{size:38,fill:c})}${t21_call(-20,0,220,11+i*13,c,g)}</g>`;}).join(''):'';
  return `${base}${grid}${!ca?`${glint({x:1300,y:520,s:.9,t:g,mouth:'smile',blink:BL(g),pose:'point',dir:-1})}`:''}
   ${!ca?`${T(1100,150,'PRAIRIE DOGS',{size:110,fill:P.white,sc:IN(t,.1)})}${de?`<g transform="translate(1100,290) scale(${pop(t,p.dec??1.56).toFixed(3)})">${labelPill(0,0,'CON SLOBODCHIKOFF · ARIZONA',P.gold,40)}</g>`:''}`:T(1130,135,'A DIFFERENT CALL FOR EACH',{size:70,fill:P.white,sc:pop(t,p.calls??7.27)})}`;
},
aniInfo(t,d,p,g){
  const po=AT(t,p.poet??7.07);
  if(!po){const tiles=[[p.danger??3.13,'DANGER',P.red],[p.food??4.01,'FOOD',P.gold],[p.fam??4.82,'FAMILY',P.mint],[p.who??5.8,"WHO'S WHO",P.violet]];
    return `${t21_card('cardDark',g)}${glint({x:960,y:560,s:1,t:g,mouth:'grin',brows:'raised',blink:BL(g),glint:1,pose:'shrug'})}
     ${tiles.map(([a,l,c],i)=>{if(!AT(t,a))return '';const x=i%2?1500:420,y=i<2?380:680;return `<g transform="translate(${x},${y}) scale(${pop(t,a).toFixed(3)}) rotate(${i%2?3:-3})">${labelPill(0,0,l,c,64)}</g>`;}).join('')}
     ${T(960,150,'REAL INFORMATION',{size:100,fill:P.white,sc:IN(t,.2)})}`;}
  const cr=AT(t,p.crumbs??12.27),li=AT(t,p.life??8.89);
  return `${t21_street(g,{spring:0})}${t21_pigeon(760,700,1.4,g,{tilt:Math.sin(g*1.3)})}
   ${li&&!cr?t21_tb(820,380,['“THE MEANING','OF LIFE IS…”'],{size:58,sc:pop(t,p.life??8.89)})+`<path d="M520 300 L1120 460 M1120 300 L520 460" stroke="${P.red}" stroke-width="18" stroke-linecap="round" opacity="${prog(t,(p.life??8.89)+1.2,(p.life??8.89)+1.5)}"/>`:''}
   ${cr?t21_tb(820,400,'“CRUMBS?”',{size:76,sc:pop(t,p.crumbs??12.27)})+[...Array(8)].map((_,i)=>`<rect x="${600+i*50}" y="${780+Math.sin(i*2)*10}" width="14" height="10" fill="#E8C890" stroke="${INK}" stroke-width="2"/>`).join(''):''}
   ${T(960,150,"BUT IT'S NOT POETRY",{size:96,fill:P.gold,sc:pop(t,p.poet??7.07)})}`;
},
aniPickles(t,d,p,g){
  const fa=AT(t,p.fact??4.01),ea=AT(t,p.each??5.52),hu=AT(t,p.hum??8.67),na=AT(t,p.nan??11.82),yr=AT(t,p.yrs??14);
  if(na){let mw='';for(let i=0;i<5;i++){const k=((g*.45+i/5)%1);mw+=`<g transform="translate(${lerp(820,1260,k).toFixed(0)},${(560-Math.sin(k*Math.PI)*220).toFixed(0)}) scale(${(.7+.3*Math.sin(k*Math.PI)).toFixed(2)})" opacity="${Math.sin(k*Math.PI).toFixed(2)}">${t21_bub(0,0,220,'MEOW','',{size:44})}</g>`;}
    return `${t21_kitchen(g)}${person({x:1440,y:520,s:.95,t:g,who:'nan',mouth:'smile',brows:'raised',blink:BL(g+1)})}${pickles(640,770,1,g,{mood:'grump'})}${mw}
     ${yr?`<g transform="translate(960,190) scale(${pop(t,p.yrs??14).toFixed(3)})"><rect x="-430" y="-80" width="860" height="160" rx="24" fill="#0B1026" stroke="${P.gold}" stroke-width="8"/>${T(0,24,'14 YEARS OF MEOWS → NAN',{size:62,fill:P.gold})}</g>`:''}${t21_pm(t,'plus','MR. PICKLES')}`;}
  const cats=`<g transform="translate(560,640)">${pickles(0,0,.9,g,{mood:'grump'})}</g><g transform="translate(1360,640) scale(-1,1)">${pickles(0,0,.9,g+1,{mood:'grump'}).split('#F0913A').join('#9AA3B8').split('#C86A1E').join('#6E7790')}</g>`;
  return `${t21_card('cardWarm',g)}${!hu?cats:''}
   ${ea&&!hu?`${t21_bub(960,330,360,'MEOW?','',{size:56})}<path d="M790 270 L1130 390 M1130 270 L790 390" stroke="${P.red}" stroke-width="16" stroke-linecap="round"/>${T(960,870,'CAT TO CAT: HARDLY EVER',{size:64,fill:P.white,sc:pop(t,p.each??5.52)})}`:''}
   ${hu?`${pickles(520,700,1,g,{mood:'happy'})}${person({x:1400,y:520,s:.95,t:g,who:'nan',mouth:'smile',blink:BL(g)})}<path d="M720 560 Q960 420 1220 520" stroke="${P.gold}" stroke-width="12" fill="none" stroke-dasharray="26 18"/><path d="M1200 490 L1236 526 L1188 538Z" fill="${P.gold}"/>${t21_bub(960,380,330,'MEOW!','',{size:56})}${T(960,870,'CAT TO HUMAN: MEOW!',{size:64,fill:P.mint,sc:pop(t,p.hum??8.67)})}`:''}
   ${fa&&!ea?`<g transform="translate(960,330) scale(${pop(t,p.fact??4.01).toFixed(3)})">${labelPill(0,0,'REAL FACT',P.gold,56)}</g>`:''}${t21_pm(t,'plus','MR. PICKLES')}`;
},
aniPickTalk(t,d,p,g){
  const steps=[[p.f1??1.83,'FOOD.'],[p.d1??2.8,'DOOR.'],[p.wf??3.7,'WRONG FOOD.'],[p.d2??4.8,'DOOR AGAIN.'],[p.why??5.95,'WHY IS THE DOOR LIKE THIS.']];
  const na=AT(t,p.nan??8.01),pk=AT(t,p.pk??12.92);let n=steps.filter(s=>AT(t,s[0])).length;
  const list=n&&!pk?t21_tb(500,300,steps.slice(0,n).map(s=>s[1]),{size:46,hi:n-1,minw:560,tail:-60}):'';
  return `${t21_kitchen(g)}${pickles(500,770,1,g,{mood:'grump'})}${glint({x:1100,y:540,s:.85,t:g,pose:'point',dir:-1,mouth:na?'flat':'smile',brows:na?'sad':'calm',blink:BL(g),look:-1})}
   ${person({x:1600,y:540,s:.95,t:g,who:'nan',mouth:na&&!pk?'o':pk?'flat':'smile',brows:na?'raised':'calm',pose:na&&!pk?'hips':'down',blink:BL(g+1)})}${list}
   ${na&&!pk?t21_bub(1400,200,760,'“FOURTEEN YEARS, AND THAT’S','ALL HE’S GOT TO SAY?”',{size:44,tail:'right'}):''}
   ${pk?t21_tb(560,420,'“FOOD.”',{size:96,sc:pop(t,p.pk??12.92)}):''}${!n?T(960,150,'GLINT TRANSLATES',{size:96,fill:P.mint,sc:IN(t,.1)}):''}`;
},
aniZoo(t,d,p,g){
  const ho=AT(t,p.hood??5.17),po=AT(t,p.pop??8.67),tr=AT(t,p.tr??12.1),jo=AT(t,p.joy??17.08),nm=AT(t,p.name??18.97);
  const wx=po?0:lerp(-300,0,eout(prog(t,0,3.5)));const L=[];if(AT(t,p.tall??13.67))L.push('TALL HUMAN.');if(AT(t,p.yel??14.82))L.push('YELLOW.');if(AT(t,p.fast??15.58))L.push('COMING FAST.');
  const rise=po?eout(prog(t,p.pop??8.67,(p.pop??8.67)+.5)):0;
  return `${t21_zoo(g)}<g transform="translate(1450,880)">${labelPill(0,0,'PRAIRIE DOGS',P.gold,32)}</g>
   ${t21_mound(1450,830,320)}<clipPath id="t21zc"><rect x="1200" y="400" width="500" height="380"/></clipPath><g clip-path="url(#t21zc)">${t21_pdog(1450,780+(1-rise)*260,1,g,{call:tr?1:0,dir:-1,look:-1})}</g>${t21_mound(1450,830,320).replace(/<ellipse[^>]*\/>/,'')}
   <g transform="translate(${wx.toFixed(0)},0)">${glint({x:520,y:530,s:.85,t:g,legs:po?'stand':'walk',pose:'reach',mouth:jo?'smile':'o',blink:BL(g)})}${t21_kai({x:860,y:520,s:.95,t:g,legs:po?'stand':'walk',pose:jo?'up':'reach',mouth:jo?'laugh':'grin',brows:'raised',blink:BL(g+1)})}</g>
   ${nm?`<g transform="translate(860,620) rotate(-4) scale(${pop(t,p.name??18.97).toFixed(3)})"><rect x="-130" y="-60" width="260" height="120" rx="14" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="-130" y="-60" width="260" height="40" rx="14" fill="${P.red}"/><text y="-30" text-anchor="middle" font-size="22" font-weight="900" fill="#fff">MY NAME IS</text><text y="10" text-anchor="middle" font-size="30" font-weight="900" fill="${INK}">TALL YELLOW</text><text y="44" text-anchor="middle" font-size="30" font-weight="900" fill="${INK}">HUMAN</text></g>`:''}
   ${ho&&!po?`<g transform="translate(860,250) scale(${pop(t,p.hood??5.17).toFixed(3)})">${labelPill(0,0,'BANANA-YELLOW HOODIE',t21_Y,46)}</g><path d="M860 300 V340" stroke="${t21_Y}" stroke-width="10"/>`:''}
   ${L.length?t21_tb(1300,250,L,{size:50,tail:150,hi:L.length-1}):''}${nm?T(1120,150,'A NAME IN PRAIRIE DOG',{size:84,fill:P.white,sc:pop(t,p.name??18.97)}):''}
   ${t21_pm(t,'plus','THE ZOO')}`;
},
aniBaby(t,d,p,g){
  const tr=AT(t,p.tree??6.4),id=AT(t,p.idea??8.93),yo=AT(t,p.young??10.56),pa=AT(t,p.par??14.43),sa=AT(t,p.saw??17.1);
  if(sa){const z=eout(prog(t,p.saw??17.1,(p.saw??17.1)+1));
    return `${t21_street(g)}<rect width="1920" height="1080" fill="#05030C" opacity="${(.55*z).toFixed(2)}"/>${t21_kai({x:960,y:560,s:1.2,t:g,mouth:'o',brows:'raised',blink:BL(g)})}
     <g opacity="${z.toFixed(2)}"><path d="M700 230 h-60 v60 M1220 230 h60 v60 M700 790 h-60 v-60 M1220 790 h60 v-60" stroke="${P.red}" stroke-width="12" fill="none"/><circle cx="960" cy="480" r="200" fill="none" stroke="${P.red}" stroke-width="5" stroke-dasharray="16 14"/><circle cx="660" cy="200" r="12" fill="${P.red}" opacity="${Math.sin(g*8)>0?1:.2}"/><text x="690" y="212" font-size="36" font-weight="900" fill="${P.red}">REC</text></g>
     ${t21_crow(1560,420,.9,g,{dir:-1,angry:1})}${T(960,150,'FACE SAVED',{size:110,fill:P.red,sc:pop(t,(p.saw??17.1)+.6)})}`;}
  const climb=tr?eout(prog(t,p.tree??6.4,(p.tree??6.4)+2)):0;
  const baby=`<g transform="translate(${tr?lerp(720,560,climb):720},${tr?lerp(770,470,climb):770}) scale(.55)">${t21_crow(0,-60,1,g,{col:'#3A3448'})}<circle cx="-20" cy="-70" r="40" fill="#5A5468" opacity=".5"/></g>`;
  return `${t21_street(g)}${t21_nest(470,400,1.2)}${yo?'':baby}
   ${t21_kai({x:tr?lerp(820,640,climb):860,y:tr?lerp(520,330,climb):520,s:.9,t:g,pose:tr?'up':'down',mouth:tr?'grin':'o',brows:'raised',blink:BL(g)})}
   ${yo?`${t21_crow(1000,800,.5,g,{col:'#3A3448'})}<g transform="translate(1000,${(720-Math.abs(Math.sin(g*3))*40).toFixed(0)})"></g><g transform="translate(1180,650) scale(${pop(t,p.young??10.56).toFixed(3)})">${labelPill(0,0,'LEARNING TO FLY',P.mint,40)}</g>`:''}
   ${pa?`<path d="M1300 260 H1920" stroke="${INK}" stroke-width="6"/>${t21_crow(1460,200,.75,g,{dir:-1})}${t21_crow(1700,200,.75,g,{dir:-1,ph:1})}<path d="M1420 180 L1050 740 M1660 180 L1080 740" stroke="#fff" stroke-width="4" stroke-dasharray="14 12" opacity=".7"/><g transform="translate(1580,330) scale(${pop(t,p.par??14.43).toFixed(3)})">${labelPill(0,0,'PARENTS WATCHING',P.gold,38)}</g>`:''}
   ${id&&!yo?`<g transform="translate(1250,420) scale(${pop(t,p.idea??8.93).toFixed(3)})">${stamp(0,0,1.3,'TERRIBLE IDEA')}</g>`:''}
   ${!tr?`<g transform="translate(960,150)">${labelPill(0,0,'LAST SPRING',P.mint,50)}</g>`:''}${t21_pm(t,'minus','THE CROWS HATE KAI')}`;
},
aniMask(t,d,p,g){
  const uw=AT(t,p.uw??2.36),ma=AT(t,p.mask??5.4),yr=AT(t,p.yrs??8.4),nv=AT(t,p.never??13),te=AT(t,p.teach??15.11);
  const masked=(x,y,s,pose)=>`${extra({x,y,s,t:g,head:'#F2C9A0',pose})}<g transform="translate(${x},${(y+Math.sin(g*2.4+1)*4).toFixed(1)}) scale(${s})"><path d="M-80 -110 Q0 -150 80 -110 L74 0 Q0 30 -74 0Z" fill="#B8C2A0" stroke="${INK}" stroke-width="8"/><path d="M-56 -86 L-14 -66 M56 -86 L14 -66" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><ellipse cx="-34" cy="-56" rx="14" ry="10" fill="${INK}"/><ellipse cx="34" cy="-56" rx="14" ry="10" fill="${INK}"/><path d="M-30 -14 Q0 -30 30 -14" stroke="${INK}" stroke-width="8" fill="none"/></g>`;
  if(yr){const n=Math.min(10,1+Math.floor((t-(p.yrs??8.4))*1.4));let crows='';const cnt=nv?7:4;for(let i=0;i<cnt;i++){const x=1080+(i%4)*200,y=250+Math.floor(i/4)*180;crows+=t21_crow(x,y,.6,g,{call:1,angry:1,ph:i,dir:-1,col:i>=4?'#2E3A52':'#22202E'});}
    return `${t21_woods(g,{dusk:0,near:0,sunX:300})}<rect width="1920" height="1080" fill="#7FB8F0" opacity=".25"/>${masked(560,540,.95,'down')}${crows}
     ${nv&&!te?`<g transform="translate(1380,620) scale(${pop(t,p.never??13).toFixed(3)})">${labelPill(0,0,'EVEN CROWS NEVER CAUGHT',P.coral,38)}</g>`:''}
     ${te?`<g transform="translate(1380,620) scale(${pop(t,p.teach??15.11).toFixed(3)})">${labelPill(0,0,'CROWS TEACH EACH OTHER',P.mint,40)}</g>`:''}
     <g transform="translate(330,170)"><rect x="-180" y="-70" width="360" height="140" rx="18" fill="#0B1026" stroke="${P.gold}" stroke-width="7"/>${T(0,28,`YEAR ${n}`,{size:72,fill:P.gold})}</g>${T(1200,150,'STILL SCOLDING',{size:90,fill:P.red,sc:pop(t,p.yrs??8.4)})}`;}
  return `${t21_card('cardIce',g)}${T(960,150,'CROWS REMEMBER FACES',{size:100,fill:P.white,sc:IN(t,.1)})}
   ${uw?`<g transform="translate(960,280) scale(${pop(t,p.uw??2.36).toFixed(3)})">${labelPill(0,0,'UNIVERSITY OF WASHINGTON · JOHN MARZLUFF',P.gold,36)}</g>`:''}
   ${ma?`${masked(760,560,.95,'up')}<path d="M840 460 Q980 360 1120 470" stroke="#C9A46A" stroke-width="10" fill="none"/><path d="M1060 440 Q1140 380 1220 460 Q1180 560 1080 540Z" fill="none" stroke="#C9A46A" stroke-width="6" stroke-dasharray="10 8"/>${t21_crow(1150,500,.55,g,{call:1,angry:1})}<g transform="translate(560,850) scale(${pop(t,p.mask??5.4).toFixed(3)})">${labelPill(0,0,'SCARY MASK',P.coral,44)}</g>`:''}`;
},
aniDanger(t,d,p,g){
  const tr=AT(t,p.tr??4.46),po=AT(t,p.pol??6.04);const walk=(t*90)%2400;let crows='';
  [[260,240],[560,200],[860,250],[1160,210],[1460,240],[1760,200]].forEach(([x,y],i)=>crows+=t21_crow(x,y,.55,g,{call:1,angry:1,ph:i*.6,dir:i<3?1:-1}));
  return `${t21_street(g,{spring:0})}<path d="M0 300 H1920" stroke="${INK}" stroke-width="6"/>${crows}
   ${t21_kai({x:960,y:520,s:.95,t:g,legs:'walk',mouth:'frown',brows:'sad',blink:BL(g),sweat:1})}${t21_ftag(960,330,.9,0,g)}
   ${tr?t21_tb(500,520,po?['“DANGER FACE!','YOU ████ ██████!”']:'“DANGER FACE!”',{size:46,tail:200,sc:pop(t,p.tr??4.46)}):''}
   ${po?`<g transform="translate(1480,620) rotate(5) scale(${pop(t,p.pol??6.04).toFixed(3)})">${labelPill(0,0,'NOT POLITE',P.red,56)}</g>`:''}${T(960,150,'EVERY CROW IN THE CITY',{size:90,fill:P.white,sc:IN(t,.2)})}`;
},
aniBees(t,d,p,g){
  const fo=AT(t,p.fol??20.58);
  if(fo){const be=AT(t,p.berry??22.47),cr=AT(t,p.crum??24.85);
    if(cr)return `${t21_kitchen(g)}<g transform="translate(1000,560)"><ellipse rx="300" ry="70" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><ellipse cy="-26" rx="270" ry="56" fill="#E8B060" stroke="${INK}" stroke-width="7"/>${[...Array(10)].map((_,i)=>`<circle cx="${-200+i*44}" cy="${-30+Math.sin(i*2)*14}" r="13" fill="#5A1A4A"/>`).join('')}</g>
      <g opacity=".75"><circle cx="1000" cy="520" r="250" fill="none" stroke="${P.ice}" stroke-width="8" stroke-dasharray="20 16"/></g><g transform="translate(1000,300)">${labelPill(0,0,'SIZE OF A CAR TYRE',P.ice,40)}</g>
      ${person({x:1560,y:520,s:.95,t:g,who:'nan',mouth:'laugh',brows:'raised',pose:'up',blink:BL(g)})}${glint({x:380,y:540,s:.85,t:g,mouth:'grin',blink:BL(g)})}${T(960,150,'BLACKBERRY CRUMBLE',{size:96,fill:P.gold,sc:pop(t,p.crum??24.85)})}`;
    const k=prog(t,p.fol??20.58,(p.fol??20.58)+2);
    return `${t21_allot(g)}${t21_hive(260,640,.8)}${t21_berries(1550,700,1.1,g)}<path d="M380 600 Q900 420 1400 560" stroke="${P.gold}" stroke-width="10" fill="none" stroke-dasharray="26 18"/>
     ${glint({x:lerp(500,1150,k),y:430,s:.8,t:g,legs:k<1?'walk':'stand',pose:be?'up':'point',mouth:be?'grin':'smile',blink:BL(g)})}${t21_bee(lerp(560,1300,k)+Math.sin(g*6)*20,300,.8,0,g)}
     ${be?T(960,150,'A SECRET BLACKBERRY THICKET',{size:80,fill:P.white,sc:pop(t,p.berry??22.47)}):T(960,150,'GLINT FOLLOWS THE MAP',{size:90,fill:P.white,sc:pop(t,p.fol??20.58)})}`;}
  const da=AT(t,p.dance??4.71),ma=AT(t,p.map??10.22),an=AT(t,p.angle??12.62),su=AT(t,p.sun??15.74),lo=AT(t,p.long??17.29);
  if(!da)return `${t21_allot(g)}${t21_hive(1100,660,1.1)}${t21_bee(lerp(300,1100,prog(t,0,4.5)),lerp(300,560,prog(t,0,4.5))+Math.sin(g*8)*16,1.2,10,g)}${person({x:420,y:520,s:.95,t:g,who:'nan',mouth:'smile',blink:BL(g),pose:'hips'})}${glint({x:1600,y:540,s:.85,t:g,blink:BL(g),look:-1})}
    ${T(960,150,"NAN'S ALLOTMENT",{size:96,fill:P.white,sc:IN(t,.1)})}${t21_pm(t,'plus','THE BEES')}`;
  // waggle-dance diagram: comb (left) + field (right)
  const A=35,ar=A*Math.PI/180,ux=Math.sin(ar),uy=-Math.cos(ar);const runLen=lo?260:170;
  const cyc=4.2,ph=((t-(p.dance??4.71))%cyc)/cyc;let bx,by,rot;const cx=520,cy=560;
  if(ph<.45){const k=ph/.45,w=Math.sin(k*Math.PI*14)*16;bx=cx+(k-.5)*runLen*ux+w*Math.cos(ar);by=cy+(k-.5)*runLen*uy+w*Math.sin(ar);rot=A-90;}
  else{const k=(ph-.45)/.55,side=Math.floor((t-(p.dance??4.71))/cyc)%2?1:-1;const a=Math.PI*k;const ex=cx+.5*runLen*ux,ey=cy+.5*runLen*uy,sx=cx-.5*runLen*ux,sy=cy-.5*runLen*uy;
    const mx=(ex+sx)/2+side*Math.cos(ar)*110*Math.sin(a),my=(ey+sy)/2+side*Math.sin(ar)*110*Math.sin(a);bx=lerp(ex,sx,k)*.4+mx*.6+(lerp(ex,sx,k)-mx)*.0;by=lerp(ey,sy,k)*.4+my*.6;rot=A+90+side*k*180;}
  let hex='';for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++){const hx=cx+i*62+(j%2?31:0),hy=cy+j*54;if(Math.hypot(hx-cx,hy-cy)<300)hex+=`<path d="M${hx} ${hy-34} l30 17 v34 l-30 17 l-30 -17 v-34Z" fill="#E8A830" stroke="#B87A10" stroke-width="4" opacity=".55"/>`;}
  const arc=`<path d="M${cx} ${cy-150} A150 150 0 0 1 ${(cx+150*ux).toFixed(1)} ${(cy+150*uy).toFixed(1)}" stroke="#fff" stroke-width="8" fill="none"/>`;
  const fx=1380,fy=640;const field=su?`<g><rect x="1040" y="250" width="700" height="560" rx="26" fill="#2E6A3E" stroke="${INK}" stroke-width="8"/><circle cx="${fx}" cy="290" r="40" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><path d="M${fx} ${fy} V340" stroke="${P.gold}" stroke-width="7" stroke-dasharray="16 12"/>
     <path d="M${fx} ${fy} L${(fx+(lo?380:250)*ux).toFixed(0)} ${(fy+(lo?380:250)*uy).toFixed(0)}" stroke="#fff" stroke-width="10"/>${t21_hive(fx,fy+70,.4)}<g transform="translate(${(fx+(lo?380:250)*ux).toFixed(0)},${(fy+(lo?380:250)*uy).toFixed(0)})"><circle r="42" fill="#5A1A4A" stroke="${INK}" stroke-width="6"/><circle cx="-12" cy="-8" r="10" fill="#B0304A"/></g>
     <path d="M${fx} ${fy-110} A110 110 0 0 1 ${(fx+110*ux).toFixed(1)} ${(fy+110*uy).toFixed(1)}" stroke="#fff" stroke-width="6" fill="none"/><text x="${fx-60}" y="300" text-anchor="end" font-size="34" font-weight="900" fill="#fff">SUN</text>${T(fx,780,'IN THE FIELD',{size:44,fill:P.white})}</g>`:'';
  return `${t21_card('cardGold',g)}<circle cx="${cx}" cy="${cy}" r="300" fill="#5A3A10" stroke="${INK}" stroke-width="10"/>${hex}
   <path d="M${cx} ${cy+240} V${cy-250}" stroke="${P.gold}" stroke-width="7" stroke-dasharray="16 12"/><path d="M${cx-20} ${cy-230} L${cx} ${cy-270} L${cx+20} ${cy-230}" stroke="${P.gold}" stroke-width="7" fill="none"/><text x="${cx-30}" y="${cy-240}" text-anchor="end" font-size="30" font-weight="900" fill="${P.gold}">UP = SUN</text>
   <path d="M${(cx-.5*runLen*ux).toFixed(0)} ${(cy-.5*runLen*uy).toFixed(0)} L${(cx+.5*runLen*ux).toFixed(0)} ${(cy+.5*runLen*uy).toFixed(0)}" stroke="#fff" stroke-width="6" stroke-dasharray="12 10" opacity=".7"/>${an?arc:''}
   ${t21_bee(bx,by,1,rot,g)}${!su&&ma?`<g transform="translate(1390,420) scale(${pop(t,p.map??10.22).toFixed(3)})">${labelPill(0,0,'KARL VON FRISCH · NOBEL PRIZE',P.gold,36)}</g>`:''}
   ${an&&!su?`<g transform="translate(1390,600) scale(${pop(t,p.angle??12.62).toFixed(3)})">${labelPill(0,0,'ANGLE = DIRECTION',P.mint,52)}</g>`:''}${field}
   ${lo?`<g transform="translate(960,880) scale(${pop(t,p.long??17.29).toFixed(3)})">${labelPill(0,0,'LONGER WAGGLE = FARTHER',P.coral,48)}</g>`:''}
   ${T(960,150,ma?'THE WAGGLE DANCE IS A MAP':'THE BEE DANCES',{size:90,fill:P.white,sc:pop(t,ma?p.map??10.22:p.dance??4.71)})}`;
},
aniWhales(t,d,p,g){
  const co=AT(t,p.codas??7.67),cl=AT(t,p.clans??11.45),ac=AT(t,p.acc??13.91),ni=AT(t,p.night??15.27);
  const bars=(x,y,w,pat,col,lab)=>{let s=`<rect x="${x-20}" y="${y-60}" width="${w+40}" height="120" rx="18" fill="#061428" fill-opacity=".9" stroke="${col}" stroke-width="6"/>`;let cx=x+30;const ph=(g*.5)%1;pat.forEach(gap=>{s+=`<rect x="${cx}" y="${y-40}" width="16" height="80" rx="6" fill="${col}"/>`;cx+=gap;});s+=`<rect x="${(x+ph*w).toFixed(0)}" y="${y-56}" width="6" height="112" fill="#fff" opacity=".6"/>`;if(lab)s+=`<text x="${x}" y="${y-74}" font-size="36" font-weight="900" fill="${col}">${lab}</text>`;return s;};
  if(ni){const L=[];if(AT(t,p.h1??20.99))L.push('“HERE.');if(AT(t,p.h2??21.77))L.push('HERE.');if(AT(t,p.fam??22.51))L.push('FAMILY, HERE.”');
    return `${t21_museum(g)}<rect x="1000" y="230" width="760" height="420" rx="20" fill="#0A1020" stroke="${INK}" stroke-width="10"/><rect x="1020" y="250" width="720" height="380" rx="12" fill="url(#t21sea)"/>${t21_DEF}${t21_whale(1380,470,.6,g)}${bars(1060,590,640,[40,40,40,130,40],P.mint,'')}
     ${glint({x:560,y:540,s:.95,t:g,legs:'sit',mouth:L.length?'smile':'flat',blink:BL(g),lid:.2,look:1})}${t21_hp(560,540,.95,g)}
     ${L.length?t21_tb(560,230,[L.join(' ')],{size:52,tail:0,sc:1}):T(960,150,'ALL NIGHT',{size:100,fill:P.white,sc:pop(t,p.night??15.27)})}
     ${AT(t,p.ears??17.31)&&!L.length?`<g transform="translate(560,330) scale(${pop(t,p.ears??17.31).toFixed(3)})">${labelPill(0,0,'CHECKING ON EACH OTHER',P.mint,40)}</g>`:''}${t21_flakes(0,0)}`;}
  return `${t21_sea(g)}${t21_whale(co?520:900,co?560:520,co?.95:1.2,g)}
   ${co?`${bars(1060,360,640,[40,40,40,130,40],P.mint,'CODA: CLICK PATTERN')}${cl?bars(1060,620,640,[90,90,40,40,40],P.gold,ac?'OTHER CLAN: OTHER ACCENT':'ANOTHER CLAN'):''}`:''}
   ${!co?`<g transform="translate(960,280) scale(${pop(t,p.feed??2.12).toFixed(3)})">${labelPill(0,0,'LIVE FEED · CARIBBEAN',P.mint,44)}</g>`:''}
   ${T(1150,150,co?'SPERM WHALES TALK IN CODAS':'SPERM WHALES',{size:76,fill:P.white,sc:pop(t,co?p.codas??7.67:.1)})}${t21_pm(t,'plus','THE WHALES')}`;
},
aniNoise(t,d,p,g){
  const ev=AT(t,p.every??3.74),sl=AT(t,p.sleep??10.72),bu=AT(t,p.buys??12.28);
  const boxes=[['“CRUMBS?”',300,260],['“MY BRANCH!”',1500,220],['“SQUIRREL!!”',1560,520],['“WHO’S THERE?”',360,560],['“MINE! MINE!”',980,140],['“WARM?”',700,380],['“DOOR!”',1260,380]];
  let bx='';if(ev&&!bu)boxes.forEach(([s,x,y],i)=>{const a=(p.every??3.74)+i*.8;if(AT(t,a))bx+=t21_tb(x+Math.sin(g*2+i)*10,y,s,{size:40,sc:pop(t,a)*(.85+.05*Math.sin(g*5+i)),minw:260});});
  return `${bgRoom(g)}${t21_bed(960,760)}${glint({x:900,y:560,s:.85,t:g,legs:'sit',mouth:bu?'smile':'wavy',brows:bu?'calm':'sad',blink:0,lid:bu?.4:0,shiver:bu?0:.5})}${bu?t21_hp(900,560,.85,g,{col:'#3A3F58'}):''}
   ${t21_pigeon(1600,180,.5,g,{dir:-1})}${dog(1500,760,.7,g)}${bx}
   ${!ev?`<g transform="translate(960,420) scale(${pop(t,p.off??2.01).toFixed(3)})"><rect x="-80" y="-130" width="160" height="260" rx="24" fill="#FFF6EA" stroke="${INK}" stroke-width="9"/><rect x="-40" y="-90" width="80" height="80" rx="14" fill="${P.red}" stroke="${INK}" stroke-width="6"/>${icon('cross',0,70,.5)}</g>${T(960,700,'NO OFF SWITCH',{size:80,fill:P.white,sc:pop(t,p.off??2.01)})}`:''}
   ${sl&&!bu?`<g transform="translate(1660,820)">${clockP(0,0,70,0)}</g>${T(960,860,"CAN'T SLEEP",{size:70,fill:P.coral,sc:pop(t,p.sleep??10.72)})}`:''}
   ${bu?T(1120,150,'NOISE-CANCELLING. EVERYWHERE.',{size:66,fill:P.mint,sc:pop(t,p.buys??12.28)}):''}${t21_pm(t,'minus','THE NOISE')}`;
},
aniVoicemail(t,d,p,g){
  const fv=AT(t,p.five??4.42),ms=AT(t,p.msg??11.99),ha=AT(t,p.harrow??13.93),bk=AT(t,p.back??16.16),cr=AT(t,p.crack??17.71),ye=AT(t,p.yell??18.72),si=AT(t,p.sil??19.77);
  if(!fv){const vib=Math.sin(g*50)*6;return `${t21_street(g,{spring:0})}${glint({x:760,y:520,s:.95,t:g,legs:'walk',mouth:'smile',blink:BL(g)})}${t21_hp(760,520,.95,g,{col:'#3A3F58'})}
    ${t21_phone(1300+vib,500,.8,`<circle cy="-60" r="50" fill="${t21_Y}" stroke="${INK}" stroke-width="5"/>${T(0,40,'KAI',{size:50,fill:'#fff'})}${T(0,110,'CALLING…',{size:30,fill:P.mint})}`,8)}${t21_arcs(1420,400,g,1,P.mint)}
    ${T(960,150,'SATURDAY AFTERNOON',{size:90,fill:P.white,sc:IN(t,.1)})}${AT(t,p.ring??2.4)?`<g transform="translate(1300,860) scale(${pop(t,p.ring??2.4).toFixed(3)})">${labelPill(0,0,'MISSED CALL',P.red,44)}</g>`:''}`;}
  let wave='';const flat=si;for(let i=0;i<40;i++){const h=flat?4:(10+Math.abs(Math.sin(i*1.7+g*9))*60)*(cr&&!ye?2:1);wave+=`<rect x="${-200+i*10}" y="${(-h/2).toFixed(0)}" width="6" height="${h.toFixed(0)}" rx="3" fill="${cr&&!si?P.red:P.mint}"/>`;}
  const lines=[];if(ms)lines.push('“GOING TO MAKE PEACE','WITH THE CROWS.');if(ha)lines.push('HARROW WOODS,','BY THE OLD QUARRY.');if(bk)lines.push('BACK BY FOUR.”');
  return `${t21_card('cardDark',g)}<g transform="translate(560,540)">${t21_phone(0,0,1.25,`<circle cy="-120" r="44" fill="${t21_Y}" stroke="${INK}" stroke-width="5"/>${T(0,-40,'VOICEMAIL',{size:30,fill:P.mint})}${T(0,0,'KAI · 14:07',{size:26,fill:'#fff'})}<g transform="translate(0,90) scale(.45)">${wave}</g>`)}</g>
   ${AT(t,p.wind??9.22)&&!cr?[0,1,2].map(i=>`<path d="M${200+((g*400+i*300)%800)} ${300+i*40} q40 -20 80 0 t80 0" stroke="${P.ice}" stroke-width="6" fill="none" opacity=".6"/>`).join(''):''}
   ${!ms?glint({x:1290,y:560,s:.9,t:g,pose:'point',dir:-1,mouth:AT(t,p.kai??8)?'o':'flat',brows:'raised',blink:BL(g)}):''}${lines.length&&!cr?`<g>${lines.map((l,i)=>T(1290,330+i*90,l,{size:52,fill:i===lines.length-1?P.gold:P.white,anchor:'middle'})).join('')}</g>`:''}
   ${cr&&!si?T(1290,470,ye?'CRACK! A YELL.':'CRACK!',{size:130,fill:P.red,sc:pop(t,p.crack??17.71)}):''}${si?T(1290,470,'… SILENCE.',{size:110,fill:P.ice,sc:pop(t,p.sil??19.77)}):''}
   ${T(1290,160,'AT TEN TO FIVE',{size:84,fill:P.white,sc:pop(t,p.five??4.42)})}`;
},
aniRescue(t,d,p,g){
  const dr=AT(t,p.drone??4.63),dg=AT(t,p.dog??7.18),li=AT(t,p.light??9.82),sn=AT(t,p.snow??11.25);const dusk=.45+.2*prog(t,p.light??9.82,d);
  const dx=1100+Math.sin(g*.8)*120,dy=200+Math.sin(g*1.7)*14;
  return `${t21_woods(g,{dusk})}${t21_rescuer(1300,520,.85,g,{pose:'point'})}${t21_rescuer(1560,530,.8,g)}${glint({x:500,y:530,s:.9,t:g,legs:t<2.5?'walk':'stand',mouth:'frown',brows:'sad',blink:BL(g)})}${t21_hp(500,530,.9,g,{col:'#3A3F58'})}
   ${dr?`<g transform="translate(${dx.toFixed(0)},${dy.toFixed(0)})"><path d="M-60 0 H60" stroke="${INK}" stroke-width="10"/><rect x="-30" y="-14" width="60" height="30" rx="10" fill="#E8EEFF" stroke="${INK}" stroke-width="6"/>${[-60,60].map(x=>`<ellipse cx="${x}" cy="-14" rx="${(30*Math.abs(Math.sin(g*30))).toFixed(0)}" ry="6" fill="#9AA7BD"/>`).join('')}<path d="M-10 16 L-150 400 H150 L10 16Z" fill="${P.ice}" opacity=".18"/></g>
     <g transform="translate(${dx.toFixed(0)},420) scale(${pop(t,p.drone??4.63).toFixed(3)})">${icon('cross',0,0,.7)}</g><g transform="translate(${dx.toFixed(0)},540) scale(${pop(t,p.drone??4.63).toFixed(3)})">${labelPill(0,0,"CAN'T SEE THROUGH PINES",P.coral,34)}</g>`:''}
   ${dg?`<g transform="translate(330,250) scale(${pop(t,p.dog??7.18).toFixed(3)})"><rect x="-210" y="-120" width="420" height="240" rx="22" fill="#0B1026" fill-opacity=".9" stroke="${P.coral}" stroke-width="7"/><g opacity=".5">${dog(-20,10,.55,g)}</g>${T(0,96,'ON ANOTHER CALL',{size:36,fill:P.coral})}</g>`:''}
   ${t21_flakes(g,sn?prog(t,p.snow??11.25,(p.snow??11.25)+1.5):0,70)}${T(960,150,li?'THE LIGHT IS GOING':'MOUNTAIN RESCUE',{size:96,fill:li?'#FFB13B':P.white,sc:pop(t,li?p.light??9.82:.1)})}`;
},
aniClock(t,d,p,g){
  const fo=AT(t,p.forty??2.05),st=AT(t,p.stop??4.07),ni=AT(t,p.night??7.09),bz=AT(t,p.buzz??13.18),na=AT(t,p.nan??14.84),lv=AT(t,p.love??21.93),of=AT(t,p.off??23.58);
  const tm=t21_timer(fo?t21_left(g):2400,g,{x:1660,y:120,s:.85});
  if(bz&&!of){const vib=na?0:Math.sin(g*50)*6;
    return `${t21_woods(g,{dusk:.7})}${t21_flakes(g,.8,60)}${glint({x:420,y:540,s:.9,t:g,pose:'point',mouth:'frown',brows:'sad',blink:BL(g)})}${t21_hp(420,540,.9,g,{col:'#3A3F58'})}${t21_phone(620+vib,520,.4,'',-10)}
     ${na?`<g transform="translate(1150,520) scale(${pop(t,p.nan??14.84).toFixed(3)})"><clipPath id="t21nk"><circle r="330"/></clipPath><g clip-path="url(#t21nk)"><g transform="translate(-1300,-560)">${t21_kitchen(g,{snow:1})}${person({x:1250,y:520,s:.95,t:g,who:'nan',mouth:'frown',brows:'sad',pose:'hold',blink:BL(g+2)})}<circle cx="1280" cy="610" r="18" fill="#fff" opacity=".8"/><circle cx="1220" cy="620" r="14" fill="#fff" opacity=".8"/></g></g><circle r="330" fill="none" stroke="${INK}" stroke-width="14"/><circle r="330" fill="none" stroke="${P.gold}" stroke-width="6"/></g>`:''}
     ${lv?t21_bub(1150,170,620,'“BRING HIM HOME, LOVE.”','',{size:48,tail:'center'}):''}${tm}`;}
  if(of){const lf=eout(prog(t,p.off??23.58,(p.off??23.58)+1));return `${t21_woods(g,{dusk:.72})}${t21_flakes(g,.8,60)}${glint({x:960,y:560,s:1.15,t:g,pose:'up',mouth:'flat',brows:'raised',blink:BL(g)})}${t21_hp(960,560,1.15,g,{lift:lf})}${T(960,150,'HEADPHONES OFF',{size:100,fill:P.gold,sc:pop(t,p.off??23.58)})}${tm}`;}
  const watch=`<g transform="translate(560,560) scale(${(1+.03*Math.sin(g*6)).toFixed(3)})"><rect x="-90" y="-330" width="180" height="660" rx="40" fill="#3A3F58" stroke="${INK}" stroke-width="10"/><circle r="230" fill="#FFF6EA" stroke="${INK}" stroke-width="14"/>${[...Array(12)].map((_,i)=>`<path d="M0 -200 V-176" stroke="${INK}" stroke-width="8" transform="rotate(${i*30})"/>`).join('')}<path d="M0 0 V-110" stroke="${INK}" stroke-width="16" stroke-linecap="round" transform="rotate(${(4*30+40*.5).toFixed(0)})"/><path d="M0 0 V-170" stroke="${P.red}" stroke-width="9" stroke-linecap="round" transform="rotate(${(240+t*6).toFixed(0)})"/><circle r="14" fill="${INK}"/></g>`;
  return `${t21_woods(g,{dusk:.62})}${t21_flakes(g,.7,50)}${!fo?`${t21_rescuer(1300,520,.95,g,{pose:'hold'})}${watch}${T(960,150,'THE TEAM LEADER CHECKS',{size:84,fill:P.white,sc:IN(t,.1)})}`
     :`${t21_timer(t21_left(g),g,{x:960,y:420,s:2.1})}${st?`<g transform="translate(960,700) scale(${pop(t,p.stop??4.07).toFixed(3)})">${labelPill(0,0,'THEN THE SEARCH STOPS',P.coral,56)}</g>`:''}
       ${ni?`<g transform="translate(960,840) scale(${pop(t,p.night??7.09).toFixed(3)})">${labelPill(0,0,'A NIGHT IN THE SNOW',P.ice,46)}</g>`:''}`}`;
},
aniWave(t,d,p,g){
  const th=AT(t,p.thou??9.03),t3=AT(t,p.t35??11.89),ca=AT(t,p.cant??13.37),wk=AT(t,p.walk??16.22),sh=AT(t,p.shout??18.56),sw=AT(t,p.swal??20.37),no=AT(t,p.no??22.3);
  const fam=[[p.rob??2.32,'“MY TREE!”',360,280,'rob'],[(p.rob??2.32)+.5,'“NO, MY TREE!”',760,200,'rob'],[p.sq??3.68,'“OUT! GET OUT!”',1480,240,'sq'],[p.wren??5.19,'“CAT! CAT! CAT!”',1500,560,'wren'],[p.owl??7.28,'“…IS IT NIGHT?”',380,600,'owl']];
  let bx='';const fade=ca?.25:1;fam.forEach(([a,s,x,y],i)=>{if(AT(t,a))bx+=t21_tb(x+Math.sin(g*3+i)*8,y,s,{size:40,sc:pop(t,a),op:fade,minw:280});});
  if(th){const r=rng(9);for(let i=0;i<22;i++){const a=(p.thou??9.03)+i*.07,x=150+r()*1620,y=120+r()*700;if(AT(t,a))bx+=`<g transform="translate(${x.toFixed(0)},${y.toFixed(0)}) scale(${(pop(t,a)*.55).toFixed(3)})" opacity="${(fade*.85).toFixed(2)}"><rect x="-90" y="-36" width="180" height="72" rx="14" fill="#0A1B24" stroke="${P.mint}" stroke-width="7"/><path d="M-60 0 h120" stroke="#fff" stroke-width="10" stroke-dasharray="${(10+r()*20).toFixed(0)} 12"/></g>`;}}
  const ans=[t21_bird(250,400,.7,g,{call:1}),t21_bird(860,330,.7,g,{call:1,dir:-1,ph:1}),t21_squirrel(1600,360,.8,g,{dir:-1,call:1}),t21_bird(1620,690,.5,g,{body:'#9A7A5A',breast:'#9A7A5A',cock:1,call:1,dir:-1}),t21_owl(300,720,.8,g,{yawn:1})].join('');
  const shout=sh?`<g transform="translate(1180,420) scale(${(pop(t,p.shout??18.56)*(sw?Math.max(.05,1-prog(t,p.swal??20.37,(p.swal??20.37)+1.5)):1)).toFixed(3)})">${t21_bub(0,0,300,'“KAI!”','',{size:80,tail:'left'})}</g>`:'';
  return `${t21_woods(g,{dusk:.72})}${ans}${t21_flakes(g,.8,60)}${glint({x:960,y:560,s:1,t:g,mouth:sh&&!sw?'o':ca?'frown':'o',brows:ca?'sad':'raised',pose:wk?'shrug':'down',blink:BL(g),shiver:th&&!ca?.6:0,look:wk?Math.sin(g*2):0})}${bx}${shout}
   ${wk&&!sh?`<g transform="translate(960,240)"><circle r="70" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><path d="M0 -50 L14 0 L0 50 L-14 0Z" fill="${P.red}" stroke="${INK}" stroke-width="4" transform="rotate(${(g*400%360).toFixed(0)})"/></g>`:''}
   ${t3?`<g transform="translate(1660,120) scale(${(1+.6*Math.max(0,1-(t-(p.t35??11.89))*1.5)).toFixed(3)})">${t21_timer(t21_left(g),g,{x:0,y:0,s:.85})}</g>`:''}
   ${no?T(960,880,'NO ANSWER',{size:80,fill:P.ice,sc:pop(t,p.no??22.3)}):th&&!ca?T(960,880,'A THOUSAND VOICES',{size:72,fill:P.white,sc:pop(t,p.thou??9.03)}):ca&&!sh?T(960,880,wk?'WHICH WAY?':"CAN'T FIND ONE VOICE",{size:72,fill:P.coral,sc:pop(t,wk?p.walk??16.22:p.cant??13.37)}):''}`;
},
aniMobbing(t,d,p,g){
  const cw=AT(t,p.crows??1.85),le=AT(t,p.learn??3.3),ha=AT(t,p.hate??6.74),sp=AT(t,p.spot??8.82),ga=AT(t,p.gather??12.98),mo=AT(t,p.mob??15.84),on=AT(t,p.one??18.26),ot=AT(t,p.others??19.57),sa=AT(t,p.same??22.9),iff=AT(t,p.if??24.56);
  if(iff)return `${t21_woods(g,{dusk:.75})}${t21_flakes(g,.8,60)}${glint({x:600,y:560,s:1,t:g,pose:'point',mouth:'grin',brows:'raised',blink:BL(g),glint:1})}${t21_crow(1300,300,.6,g,{call:1,dir:-1})}${t21_crow(1500,380,.6,g,{call:1,dir:-1,ph:1})}
    ${T(1200,600,'FOLLOW THE YELLING',{size:84,fill:P.gold,sc:pop(t,p.if??24.56)})}${t21_timer(t21_left(g),g,{x:1660,y:120,s:.8})}`;
  if(!sp){return `${t21_card('cardDark',g)}${!cw?`${icon('bulb',960,420,1.4*pop(t,.1))}${T(960,700,'THEN HE REMEMBERS',{size:96,fill:P.white,sc:IN(t,.1)})}`:`${t21_kai({x:960,y:540,s:1,t:g,mouth:'frown',brows:'sad',blink:BL(g)})}${t21_ftag(960,300,.95,0,g)}
     ${[[300,300],[300,640],[1620,300],[1620,640]].map(([x,y],i)=>t21_crow(x,y,.8,g,{call:ha?1:0,angry:ha?1:0,dir:x<960?1:-1,ph:i})).join('')}
     ${T(960,150,le?(ha?'EVERY CROW HATES IT':'EVERY CROW KNOWS HIS FACE'):'THE CROWS',{size:96,fill:ha?P.red:P.gold,sc:pop(t,ha?p.hate??6.74:le?p.learn??3.3:p.crows??1.85)})}`}`;}
  // mobbing diagram
  const n=!ga?1:!on?6:!ot?6:sa?18:12;let cr='';const r=rng(17);
  for(let i=0;i<n;i++){const a=r()*Math.PI*2,R=170+r()*170,fx=960+Math.cos(a)*R*1.5,fy=520+Math.sin(a)*R*.75;const fl=i>=6&&ot?eout(prog(t,(p.others??19.57)+(i-6)*.15,(p.others??19.57)+(i-6)*.15+1)):1;
    const sx=960+Math.cos(a)*1300,sy=520+Math.sin(a)*900;cr+=t21_crow(lerp(sx,fx,fl),lerp(sy,fy,fl),.6,g,{call:1,angry:1,fly:fl<1?1:0,dir:Math.cos(a)>0?-1:1,ph:i});}
  return `${t21_card('cardDark',g)}<circle cx="960" cy="520" r="${(120+Math.sin(g*6)*8).toFixed(0)}" fill="url(#gRed)" opacity=".6"/>${t21_kai({x:960,y:450,s:.55,t:g,mouth:'frown',brows:'sad',blink:BL(g)})}${cr}
   ${mo?`<g transform="translate(960,150) scale(${pop(t,p.mob??15.84).toFixed(3)})">${T(0,0,'MOBBING',{size:150,fill:P.red})}</g>`:T(960,150,ga?'THEY GATHER AND SCREAM':"THEY DON'T KEEP QUIET",{size:88,fill:P.white,sc:pop(t,ga?p.gather??12.98:p.spot??8.82)})}
   ${on?`<g transform="translate(260,860) scale(${pop(t,p.one??18.26).toFixed(3)})">${labelPill(0,0,'1 CROW CALLS',P.gold,40)}</g>`:''}${ot?`<g transform="translate(960,860) scale(${pop(t,p.others??19.57).toFixed(3)})">${labelPill(0,0,'OTHERS FLY IN',P.gold,40)}</g>`:''}${sa?`<g transform="translate(1640,860) scale(${pop(t,p.same??22.9).toFixed(3)})">${labelPill(0,0,'ALL AT ONE SPOT',P.red,40)}</g>`:''}`;
},
aniListen(t,d,p,g){
  const pu=AT(t,p.push??1.9),th=AT(t,p.there??6.49),df=AT(t,p.df??9.81),dn=AT(t,p.down??12.25),t25=AT(t,p.t25??14.52);
  const old=[[p.rob??2.44,'ROBINS',360,300],[p.wren??3.73,'WREN',1540,300],[p.owl??4.99,'OWLS',420,640]];let ob='';
  old.forEach(([a,s,x,y],i)=>{const k=pu?eout(prog(t,a,a+.8)):0;ob+=t21_tb(x+(x<960?-1:1)*k*240,y,`“${s}…”`,{size:40,op:(1-k*.85).toFixed(2),minw:260})+(k>.3?`<path d="M${x-120+(x<960?-1:1)*k*240} ${y} h240" stroke="${P.red}" stroke-width="10" opacity="${(1-k*.85).toFixed(2)}"/>`:'');});
  const L=[];if(df)L.push('“DANGER FACE.');if(AT(t,p.df2??10.97))L[0]='“DANGER FACE. DANGER FACE.';if(dn)L.push('DOWN. DOWN.”');else if(L.length)L[0]+='”';
  let rings='';for(let i=0;i<4;i++){const k=((g*.5+i/4)%1);rings+=`<circle cx="960" cy="470" r="${(140+k*600).toFixed(0)}" fill="none" stroke="${P.mint}" stroke-width="5" opacity="${((1-k)*.4).toFixed(2)}"/>`;}
  return `${t21_woods(g,{dusk:.78})}${t21_flakes(g,.7,50)}${rings}${glint({x:960,y:540,s:1.1,t:g,eyes:'closed',mouth:'flat',brows:th?'raised':'calm'})}${ob}
   ${th?`<g opacity="${(.5+.5*Math.abs(Math.sin(g*3))).toFixed(2)}">${t21_crow(1700,330,.35,g,{call:1,dir:-1})}</g><path d="M1160 450 L1560 360" stroke="${P.gold}" stroke-width="8" stroke-dasharray="18 14"/><path d="M1540 340 L1580 356 L1550 384" stroke="${P.gold}" stroke-width="8" fill="none"/>
     <g transform="translate(1560,460) scale(${pop(t,p.far??7.57).toFixed(3)})">${AT(t,p.far??7.57)?labelPill(0,0,AT(t,p.faint??8.74)?'FAR OFF. FAINT.':'FAR OFF',P.gold,36):''}</g>`:''}
   ${L.length?t21_tb(1200,200,L,{size:46,tail:400,col:P.red,tag:'CROW',hi:L.length-1}):''}
   ${!th?T(960,880,'PUSH PAST THE NOISE',{size:72,fill:P.white,sc:pop(t,p.push??1.9)}):''}${t25?`<g transform="translate(330,880)">${t21_timer(t21_left(g),g,{x:0,y:0,s:.75})}</g>`:''}`;
},
aniRun(t,d,p,g){
  const lo=AT(t,p.loud??5.21),fa=AT(t,p.fade??9.22),pa=AT(t,p.pass??12.22),stg=AT(t,p.strong??17.25);
  const r=rng(31);let crowns='';for(let i=0;i<70;i++){const x=r()*1920,y=200+r()*700;crowns+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(40+r()*30).toFixed(0)}" fill="#1E3A3A" stroke="${INK}" stroke-width="5"/><circle cx="${(x-8).toFixed(0)}" cy="${(y-10).toFixed(0)}" r="${(18+r()*14).toFixed(0)}" fill="#E8EEFF" opacity=".75"/>`;}
  const path=[[160,820],[420,700],[640,640],[760,480],[620,380],[900,420],[1180,360],[1460,300],[1720,260]];
  const k=prog(t,.5,d-.5),seg=k*(path.length-1),si=Math.min(path.length-2,Math.floor(seg)),f=seg-si,gx=lerp(path[si][0],path[si+1][0],f),gy=lerp(path[si][1],path[si+1][1],f);
  const wrong=fa&&!pa;const sig=stg?1:pa?.8:wrong?.3:lo?.65:.45;
  const trail=path.slice(0,si+1).map(q=>q.join(' ')).join(' L')+` L${gx.toFixed(0)} ${gy.toFixed(0)}`;
  const relay=[[700,300],[1000,240],[1300,200],[1600,160]];let rl='';relay.forEach(([x,y],i)=>{if(pa&&AT(t,(p.pass??12.22)+i*.6))rl+=t21_crow(x,y,.4,g,{call:1,ph:i,dir:-1})+(i?`<path d="M${relay[i-1][0]+50} ${relay[i-1][1]} L${x-50} ${y}" stroke="${P.red}" stroke-width="6" stroke-dasharray="12 10" opacity=".8"/>`:'');});
  return `<rect width="1920" height="1080" fill="#C4C9E8"/>${crowns}<rect width="1920" height="1080" fill="#090722" opacity=".35"/>
   <path d="M${trail}" stroke="${P.gold}" stroke-width="12" fill="none" stroke-dasharray="24 16" stroke-linecap="round"/>${[...Array(5)].map((_,i)=>{const q=path[Math.min(path.length-1,si+1+i)];return q?`<path d="M${q[0]-18} ${q[1]+14} L${q[0]} ${q[1]-14} L${q[0]+18} ${q[1]+14}" stroke="${P.red}" stroke-width="8" fill="none" opacity="${(.8-i*.15).toFixed(2)}"/>`:'';}).join('')}
   <g transform="translate(${gx.toFixed(0)},${gy.toFixed(0)})"><circle r="44" fill="${P.cream}" stroke="${INK}" stroke-width="8"/><circle cx="-14" cy="-4" r="11" fill="none" stroke="${P.goldRim}" stroke-width="6"/><circle cx="14" cy="-4" r="11" fill="none" stroke="${P.goldRim}" stroke-width="6"/></g>${rl}
   <g transform="translate(1640,560)"><rect x="-140" y="-250" width="280" height="500" rx="24" fill="#0B1026" fill-opacity=".92" stroke="${INK}" stroke-width="8"/>${[...Array(8)].map((_,i)=>`<rect x="-80" y="${180-i*52}" width="160" height="40" rx="8" fill="${i/8<sig?(i<3?P.mint:i<6?P.gold:P.red):'#2A3248'}"/>`).join('')}${T(0,-200,'SIGNAL',{size:40,fill:P.white})}</g>
   ${T(960,150,stg?'EVERY NEW CROW = LOUDER':pa?'PASSED FROM TREE TO TREE':wrong?'FADING = WRONG WAY':lo?'LOUDER = CLOSER':'A TRAIL OF SHOUTING',{size:84,fill:wrong?P.coral:P.white,sc:pop(t,stg?p.strong??17.25:pa?p.pass??12.22:fa?p.fade??9.22:lo?p.loud??5.21:.1)})}
   ${t21_timer(t21_left(g),g,{x:330,y:880,s:.75})}`;
},
aniChase(t,d,p,g){
  const t15=AT(t,p.t15??6.86),th=AT(t,p.thick??8.41),sl=AT(t,p.slip??10.21),lu=AT(t,p.lungs??14.61),sw=AT(t,p.swoop??16.39);
  const sc=(g*260)%640;let tr='';for(let i=-1;i<5;i++)tr+=t21_pine(i*640-sc+200,1000,640,'#160F2C',.9,1);
  const fall=sl&&t<(p.slip??10.21)+1.6;const gr=fall?Math.sin(prog(t,p.slip??10.21,(p.slip??10.21)+1.6)*Math.PI)*70:0;
  const swx=sw?lerp(2100,-200,prog(t,p.swoop??16.39,(p.swoop??16.39)+2.2)):-500;
  return `${t21_woods(g,{dusk:.82,near:0})}${tr}${t21_flakes(g,th?1:.7,th?140:60,6)}
   ${glint({x:1200,y:540,s:.95,t:g*1.6,legs:fall?'wobble':'walk',pose:'reach',mouth:lu?'o':'frown',brows:'raised',rot:gr,blink:0})}
   ${lu?[0,1,2].map(i=>{const k=((g*1.2+i/3)%1);return `<circle cx="${(1300+k*90).toFixed(0)}" cy="${(420-k*40).toFixed(0)}" r="${(14+k*30).toFixed(0)}" fill="#fff" opacity="${((1-k)*.6).toFixed(2)}"/>`;}).join(''):''}
   ${t21_rescuer(560,560,.75,g*1.6,{pose:'point'})}${t21_rescuer(260,570,.72,g*1.6+1)}${T(560,330,'?',{size:110,fill:P.white})}${T(260,350,'?',{size:90,fill:P.white})}
   ${sw?t21_crow(swx,330,.8,g,{fly:1,call:1,dir:-1}):''}
   ${sl&&t<(p.slip??10.21)+2.2?T(1200,860,'SLIP!',{size:90,fill:P.ice,sc:pop(t,p.slip??10.21)}):''}
   ${!t15?T(960,150,'FOLLOWING A BOY WHO FOLLOWS BIRDS',{size:70,fill:P.white,sc:IN(t,.2)}):''}
   ${t15?`<g transform="translate(1660,120) scale(${(1+.5*Math.max(0,1-(t-(p.t15??6.86))*1.5)).toFixed(3)})">${t21_timer(t21_left(g),g,{x:0,y:0,s:.85})}</g>`:''}`;
},
aniPine(t,d,p,g){
  const ov=AT(t,p.over??1.36),th=AT(t,p.thirty??3.9),gu=AT(t,p.gully??8.45),bo=AT(t,p.bottom??11.03),fl=AT(t,p.flash??13.65);
  const r=rng(44);let crows='';const N=th?30:ov?10:4;const spots=[];for(let i=0;i<30;i++){const lvl=Math.floor(i/6),x=1040+(r()-.5)*(520-lvl*60),y=200+lvl*80+r()*30;spots.push([x,y]);}
  for(let i=0;i<N;i++){const [x,y]=spots[i];crows+=t21_crow(x,y,.42,g,{call:1,angry:1,ph:i*.37,dir:x<1040?1:-1});}
  const tree=`<path d="M1040 900 L1030 160" stroke="${INK}" stroke-width="44" stroke-linecap="round"/><path d="M1040 900 L1030 160" stroke="#8A8296" stroke-width="30" stroke-linecap="round"/>${[[260,-1,240],[260,1,250],[340,-1,280],[340,1,270],[420,-1,250],[420,1,260],[500,-1,220],[500,1,230],[580,-1,180],[580,1,190]].map(([y,s,l])=>`<path d="M1035 ${y+60} L${1035+s*l} ${y}" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M1035 ${y+60} L${1035+s*l} ${y}" stroke="#8A8296" stroke-width="12" stroke-linecap="round"/>`).join('')}`;
  const gully=`<path d="M300 760 Q560 960 860 780 L860 900 H300Z" fill="#1A1430"/><path d="M280 760 Q560 980 880 770" stroke="${INK}" stroke-width="10" fill="none"/>${[...Array(9)].map((_,i)=>`<path d="M${330+i*60} ${840-Math.sin(i)*30} q30 -60 60 0 q20 -50 40 0" stroke="#3A2A3A" stroke-width="8" fill="none"/>`).join('')}`;
  return `${t21_woods(g,{dusk:.88,near:0})}<circle cx="1040" cy="420" r="460" fill="url(#gIce)" opacity=".35"/>${gully}${tree}${crows}${t21_flakes(g,1,120,8)}
   ${fl?`<circle cx="580" cy="860" r="${(60+Math.sin(g*8)*14).toFixed(0)}" fill="${t21_Y}" opacity=".35"/><path d="M540 860 q40 -30 80 0 q-40 20 -80 0Z" fill="${t21_Y}" stroke="${INK}" stroke-width="6"/><path d="M500 850 q80 -40 160 0" stroke="#EEF2FF" stroke-width="16" fill="none"/>`:''}
   ${gu?`<path d="M1000 ${(400+Math.sin(g*6)*20).toFixed(0)} L700 760" stroke="${P.red}" stroke-width="8" stroke-dasharray="18 14"/><path d="M690 730 L700 770 L730 740" stroke="${P.red}" stroke-width="8" fill="none"/>`:''}
   ${th?`<g transform="translate(1540,560) scale(${pop(t,p.thirty??3.9).toFixed(3)})">${labelPill(0,0,'30 CROWS',P.red,56)}</g>`:''}
   ${fl?T(580,700,'BANANA YELLOW!',{size:66,fill:t21_Y,sc:pop(t,p.flash??13.65)}):''}${T(960,150,ov?'RIGHT OVERHEAD':'',{size:96,fill:P.white,sc:pop(t,p.over??1.36)})}
   <g transform="translate(1660,120) scale(${(1+.6*Math.max(0,1-t*1.5)).toFixed(3)})">${t21_timer(t21_left(g),g,{x:0,y:0,s:.85})}</g>`;
},
aniFound(t,d,p,g){
  const pa=AT(t,p.pale??2.36),aw=AT(t,p.awake??3.49),sq=AT(t,p.squint??4.79),st=AT(t,p.still??7.88),fo=AT(t,p.found??11.29),li=AT(t,p.lift??13.04),dk=AT(t,p.dark??15.66);
  if(li){const k=eout(prog(t,p.lift??13.04,(p.lift??13.04)+2.5));const night=prog(t,p.dark??15.66,(p.dark??15.66)+1.5);
    return `${t21_woods(g,{dusk:.9+.1*night,near:0})}${t21_flakes(g,1,90)}<g transform="translate(0,${(-k*120).toFixed(0)})">${t21_rescuer(620,520,.85,g,{pose:'hold'})}${t21_rescuer(1300,520,.85,g,{pose:'hold'})}
      <rect x="640" y="600" width="640" height="60" rx="20" fill="#FF6A2A" stroke="${INK}" stroke-width="7"/>${t21_kai({x:960,y:500,s:.6,t:0,legs:'stand',rot:-90,blink:1,mouth:'smile',pale:1}).replace('rotate(-90)','rotate(-90)')}</g>
      ${glint({x:1640,y:540,s:.85,t:g,mouth:'smile',brows:'sad',blink:BL(g)})}${t21_crow(400,260,.45,g,{fly:1})}${t21_crow(1500,220,.45,g,{fly:1,ph:2,dir:-1})}
      <rect width="1920" height="1080" fill="#05030C" opacity="${(night*.5).toFixed(2)}"/><g transform="translate(1660,120)">${t21_timer(t21_left(g),g,{x:0,y:0,s:.85,label:dk?'DARK':'DAYLIGHT LEFT'})}</g>`;}
  let circ='';for(let i=0;i<6;i++){const a=g*1.2+i*Math.PI/3;circ+=t21_crow(960+Math.cos(a)*520,170+Math.sin(a)*60,.36,g,{fly:1,call:1,ph:i,dir:Math.sin(a)>0?-1:1});}
  return `<rect width="1920" height="1080" fill="#1A1430"/><path d="M0 0 H1920 V300 Q960 380 0 300Z" fill="#3A2E62"/>${circ}
   <path d="M0 860 Q960 640 1920 860 V1080 H0Z" fill="#E8EEFF" stroke="${INK}" stroke-width="6"/>${t21_kai({x:900,y:560,s:1.15,t:g,legs:'sit',mouth:st?'o':'frown',brows:sq?'angry':'sad',blink:sq?0:BL(g),sweat:0,pale:1,look:0})}
   <path d="M560 880 Q900 760 1260 880" fill="#EEF2FF" stroke="${INK}" stroke-width="6"/>${t21_flakes(g,1,80)}
   ${[[0,'FREEZING',P.ice,300],[p.pale??2.36,'PALE',P.ice,520],[p.awake??3.49,'BUT AWAKE',P.mint,740]].map(([a,s,c,y])=>!sq&&AT(t,a)?`<g transform="translate(1520,${y}) scale(${pop(t,a).toFixed(3)})">${labelPill(0,0,s,c,52)}</g>`:'').join('')}
   ${st?t21_bub(1380,420,640,'“ARE THEY STILL','YELLING AT ME?”',{size:50,tail:'left'}):''}
   ${fo?`<path d="M0 540 H560 Q640 560 600 600 H0Z" fill="#E8EEFF" stroke="${INK}" stroke-width="6"/>${glint({x:300,y:330,s:.7,t:g,pose:'reach',mouth:'smile',brows:'sad',blink:BL(g)})}${t21_bub(560,140,500,'“THEY FOUND YOU.”','',{size:46,tail:'left'})}`:''}`;
},
aniPeanut(t,d,p,g){
  const ou=AT(t,p.out??9.59);
  if(!ou){const bg=AT(t,p.bag??3.37),rk=AT(t,p.reck??5.74),so=AT(t,p.sorry??7.82);const op=prog(t,.3,1.6);
    return `<rect width="1920" height="1080" fill="#DDE6F0"/><rect x="0" y="0" width="1920" height="220" fill="#C9D4E2"/><rect x="200" y="300" width="380" height="260" rx="20" fill="#0B1026" stroke="${INK}" stroke-width="8"/>${[0,1,2,3].map(i=>`<circle cx="${(1600+((g*80+i*60)%200)).toFixed(0)}" cy="${300+i*20}" r="8" fill="${i%2?'#3D7BFF':P.red}" opacity=".7"/>`).join('')}
     <path d="M260 430 h40 l20 -60 l30 120 l20 -60 h160" stroke="${P.mint}" stroke-width="6" fill="none"/><rect x="560" y="660" width="900" height="70" rx="24" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/>
     ${t21_kai({x:960,y:420,s:.95,t:g,legs:'sit',pose:'hold',mouth:so?'smile':'flat',brows:'sad',blink:BL(g),pale:1})}<rect x="760" y="560" width="420" height="140" rx="30" fill="#7FB8F0" stroke="${INK}" stroke-width="7"/>
     ${bg?t21_bag(1150,500,.8*pop(t,p.bag??3.37),1,-10):`<circle cx="1020" cy="512" r="${(30+op*10).toFixed(0)}" fill="${'#C68B59'}" stroke="${INK}" stroke-width="7"/>`}
     ${glint({x:1560,y:540,s:.85,t:g,mouth:bg?'o':'smile',brows:'raised',blink:BL(g),look:-1})}
     ${so?T(960,150,'HE WENT TO SAY SORRY',{size:96,fill:P.gold,sc:pop(t,p.sorry??7.82)}):rk?T(960,150,'NOT RECKLESS',{size:96,fill:P.white,sc:pop(t,p.reck??5.74)}):bg?T(960,150,'A CRUSHED BAG OF PEANUTS',{size:84,fill:P.white,sc:pop(t,p.bag??3.37)}):T(960,150,'IN THE AMBULANCE',{size:90,fill:P.white,sc:IN(t,.1)})}`;}
  const fe=AT(t,p.fence??11.43),ch=AT(t,p.chg??17.25),no=AT(t,p.not??18.94),nw=AT(t,p.now??21.11),pf=AT(t,p.pf??22.8);
  let crows='';for(let i=0;i<8;i++){if(fe&&AT(t,(p.fence??11.43)+i*.2))crows+=t21_crow(180+i*200,400,.5,g,{dir:i<4?1:-1,ph:i,call:ch?1:0});}
  const flip=nw?prog(t,(p.now??21.11)+.3,(p.now??21.11)+1.1):0;
  return `${t21_carpark(g)}${crows}${t21_ambulance(1200,830,.75,g)}<rect x="1000" y="640" width="160" height="0"/>${glint({x:420,y:560,s:.9,t:g,mouth:pf?'grin':'smile',brows:'raised',blink:BL(g),look:1,pose:AT(t,p.listen??15.91)?'shrug':'down'})}
   ${no||nw?t21_ftag(1180,520,.8,flip,g):''}
   ${pf?t21_tb(700,220,'“PEANUT FACE. PEANUT FACE.”',{size:46,col:P.gold,sc:pop(t,p.pf??22.8)}):ch&&!no?t21_tb(700,220,'“…”',{size:56}):''}
   ${!fe?T(960,150,'GLINT STEPS OUTSIDE',{size:90,fill:P.white,sc:pop(t,p.out??9.59)}):ch&&!pf?T(960,150,'THE CALL HAS CHANGED',{size:90,fill:P.gold,sc:pop(t,p.chg??17.25)}):''}`;
},
aniBlink(t,d,p,g){
  const so=AT(t,p.soft??2.81),la=AT(t,p.last??6.24),bl=AT(t,p.blink??12.98),sc=AT(t,p.sci??14.8),sa=AT(t,p.say??19.34);
  const blinkNow=bl&&t<(p.blink??12.98)+2.2||sa&&((t-(p.say??19.34))%3)>2.3;
  if(la){const z=eout(prog(t,p.last??6.24,(p.last??6.24)+1.5));
    return `${bgRoom(g)}<g transform="translate(${lerp(0,-300,z).toFixed(0)},${lerp(0,-260,z).toFixed(0)}) scale(${lerp(1,1.45,z).toFixed(3)})">${t21_chair(1150)}${person({x:1160,y:560,s:.9,t:g,who:'nan',legs:'sit',mouth:'smile',blink:1})}${pickles(1180,690,.7,g,{mood:'happy',blink:blinkNow?1:0})}</g>
     ${glint({x:330,y:560,s:.85,t:g,legs:'sit',mouth:'smile',brows:'raised',blink:BL(g),look:1})}
     ${bl&&!sa?T(960,150,'A SLOW BLINK',{size:100,fill:P.gold,sc:pop(t,p.blink??12.98)}):''}${sc&&!sa?`<g transform="translate(960,880) scale(${pop(t,p.sci??14.8).toFixed(3)})">${labelPill(0,0,'SLOW BLINK = FRIENDLY',P.mint,52)}</g>`:''}
     ${sa?t21_tb(1050,190,'“DON’T TELL ANYONE.”',{size:60,tail:120,sc:pop(t,p.say??19.34)}):''}`;}
  const fade=prog(t,p.soft??2.81,(p.soft??2.81)+3);const words=[['“CRUMBS?”','CHIRP',360,300],['“MINE!”','WOOF',1500,280],['“WARM?”','TWEET',960,220]];
  return `${t21_city_night(g)}${words.map(([a,b,x,y],i)=>`<g transform="translate(${x},${y})">${t21_tb(0,0,fade<.5?a:b,{size:46,minw:260,op:(1-fade*.5).toFixed(2),col:fade<.5?P.mint:'#6A7088',tag:fade<.5?'TRANSLATION':'STATIC'})}</g>`).join('')}
   ${glint({x:960,y:560,s:1,t:g,mouth:'flat',brows:'sad',blink:BL(g),lid:.2})}
   <g transform="translate(960,860)"><rect x="-300" y="-40" width="600" height="80" rx="20" fill="#0B1026" stroke="${P.mint}" stroke-width="6"/><rect x="-286" y="-26" width="${(572*(1-fade*.85)).toFixed(0)}" height="52" rx="12" fill="${P.mint}"/></g>
   ${T(960,150,so?'VOICES SOFTEN':'THE POWER FADES',{size:96,fill:P.white,sc:pop(t,so?p.soft??2.81:.1)})}`;
},
aniAsk(t,d,p,g){
  const q=AT(t,p.q??2.95),pe=AT(t,p.pet??5.8);
  return `${bgNight(g)}${glint({x:960,y:560,s:1.1,t:g,mouth:q?'smirk':'smile',brows:q?'raised':'calm',pose:'shrug',blink:BL(g),glint:q?1:0})}
   ${t21_pigeon(960,330,.5,g,{tilt:Math.sin(g)})}${t21_crow(1180,610,.5,g,{dir:-1})}${pickles(560,790,.85,g,{mood:'grump',blink:BL(g+1)})}${dog(1450,760,.75,g)}
   ${q?T(960,150,'WOULD YOU WANT TO KNOW?',{size:96,fill:P.mint,sc:pop(t,p.q??2.95)}):''}
   ${pe?t21_tb(560,520,'“…”',{size:70,sc:pop(t,p.pet??5.8),tag:'YOUR PET?'})+`<g transform="translate(1500,420) scale(${pop(t,(p.pet??5.8)+.3).toFixed(3)})">${icon('comment',0,0,1)}</g>${T(1500,580,'TELL ME BELOW',{size:44,fill:P.white})}`:''}`;
}
});
function t21_stars(g){let s='';const r=rng(77);for(let i=0;i<14;i++)s+=`<circle cx="${(1100+r()*600).toFixed(0)}" cy="${(160+r()*460).toFixed(0)}" r="${(1+r()*2.5).toFixed(1)}" fill="#fff" opacity="${(.3+.6*Math.abs(Math.sin(g*1.3+i))).toFixed(2)}"/>`;return s;}
function t21_chair(x){return `<g transform="translate(${x},820)"><rect x="-170" y="-330" width="340" height="250" rx="40" fill="#7A4A6A" stroke="${INK}" stroke-width="8"/><rect x="-190" y="-110" width="380" height="80" rx="20" fill="#7A4A6A" stroke="${INK}" stroke-width="8"/><path d="M-150 -30 V0 M150 -30 V0" stroke="${INK}" stroke-width="14"/></g>`;}
function t21_city_night(g){let s=`<rect width="1920" height="1080" fill="url(#sky)"/>`;const r=rng(81);let x=-40;while(x<1960){const w=80+r()*140,h=200+r()*380;s+=`<rect x="${x.toFixed(0)}" y="${(860-h).toFixed(0)}" width="${w.toFixed(0)}" height="${(h+300).toFixed(0)}" fill="#1B1640"/>`;for(let k=0;k<6;k++)s+=`<rect x="${(x+8+r()*(w-24)).toFixed(0)}" y="${(870-h+20+r()*(h-60)).toFixed(0)}" width="10" height="12" fill="${P.gold}" opacity=".5"/>`;x+=w+10;}
  return s+`<rect y="860" width="1920" height="220" fill="${P.ground}"/>`;}
