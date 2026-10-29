// episode 009 scenes (octopus brains)
const o9_OC='#FF7A59', o9_OCD='#C9483A', o9_SK='#FFD9C2', o9_SEA='#0A2A44', o9_GUT='#7CF5FF';
const o9_DEFS=`<defs><linearGradient id="o9sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E4A6E"/><stop offset=".6" stop-color="#0A2A48"/><stop offset="1" stop-color="#06162A"/></linearGradient>
 <filter id="o9gray"><feColorMatrix type="saturate" values="0"/></filter></defs>`;
function o9_mix(a,b,k){const h=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const A=h(a),B=h(b);return '#'+A.map((v,i)=>Math.round(lerp(v,B[i],clamp(k))).toString(16).padStart(2,'0')).join('');}
function o9_bgSea(g,o={}){const {floor=true}=o;let rays='',bub='';
  for(let i=0;i<6;i++){const x=150+i*330+Math.sin(g*.4+i)*40;rays+=`<path d="M${x-40} -20 L${x+40} -20 L${x+260} 1080 L${x+80} 1080Z" fill="#BFEFFF" opacity="${.05+.03*Math.sin(g*.8+i*2)}"/>`;}
  for(let i=0;i<22;i++){const k=((g*.12+i*.137)%1);const x=(i*263)%1920+Math.sin(g*2+i)*14;bub+=`<circle cx="${x}" cy="${1000-k*1100}" r="${4+(i%4)*3}" fill="none" stroke="#BFEFFF" stroke-width="3" opacity="${.5*(1-k)}"/>`;}
  return `<rect width="1920" height="1080" fill="url(#o9sea)"/>${rays}${bub}${floor?`<path d="M0 900 Q300 860 640 890 T1300 880 T1920 870 V1080 H0Z" fill="#14324A"/><path d="M0 930 Q480 900 960 925 T1920 915 V1080 H0Z" fill="#0F2638"/>`:''}`;}
function o9_tentPts(x0,y0,x1,y1,g,ph=0,o={}){const {bow=50,wav=22,n=16}=o;const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;const pts=[];
  for(let i=0;i<=n;i++){const u=i/n;const off=Math.sin(Math.PI*u)*bow+Math.sin(u*5+g*2.2+ph)*wav*u;pts.push([x0+dx*u+nx*off,y0+dy*u+ny*off]);}return pts;}
function o9_tentDraw(pts,o={}){const {w=40,col=o9_OC,suck=o9_SK,tip=.15,suckers=true,op=1,sw=6}=o;const n=pts.length-1,L=[],R=[],S=[];
  for(let i=0;i<=n;i++){const u=i/n,a=pts[Math.max(i-1,0)],b=pts[Math.min(i+1,n)];let dx=b[0]-a[0],dy=b[1]-a[1];const l=Math.hypot(dx,dy)||1;const nx=-dy/l,ny=dx/l,ww=w*(1-u*(1-tip))/2,p=pts[i];
    L.push([p[0]+nx*ww,p[1]+ny*ww]);R.push([p[0]-nx*ww,p[1]-ny*ww]);if(suckers&&i>0&&i<n&&i%2===0)S.push([p[0]-nx*ww*.42,p[1]-ny*ww*.42,ww*.4]);}
  const d='M'+L.map(q=>q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' L')+' L'+R.reverse().map(q=>q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' L')+'Z';
  return `<g opacity="${op}"><path d="${d}" fill="${col}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>${S.map(([x,y,r])=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${suck}" stroke="${INK}" stroke-width="${Math.max(2,r*.25).toFixed(1)}"/>`).join('')}</g>`;}
function o9_mini(x,y,k,g,col=P.gold){if(k<=0)return '';const pl=1+.15*Math.sin(g*5);return `<g transform="translate(${x},${y}) scale(${k*pl})"><circle r="60" fill="url(#gGold)"/><circle r="17" fill="${col}" stroke="${INK}" stroke-width="5"/><path d="M-7 -3 q7 -8 14 0" stroke="${INK}" stroke-width="3" fill="none"/></g>`;}
function o9_spark(x,y,g,col=P.gold,s=1){const k=.6+.4*Math.sin(g*7+x);return `<g transform="translate(${x},${y}) scale(${s*k}) rotate(${g*60})"><path d="M0 -22 L5 -5 L22 0 L5 5 L0 22 L-5 5 L-22 0 L-5 -5Z" fill="${col}" stroke="${INK}" stroke-width="3"/></g>`;}
function o9_taste(x,y,g,col='#9BE15D',s=1){let r='';for(let i=0;i<3;i++){const k=((g*1.2+i/3)%1);r+=`<path d="M${x-30*s} ${y-20*s-k*90*s} q${15*s} ${-14*s} ${30*s} 0 t${30*s} 0" stroke="${col}" stroke-width="${7*s}" fill="none" stroke-linecap="round" opacity="${1-k}"/>`;}return r;}
function o9_octo(x,y,s,g,o={}){
  const {col=o9_OC,dark=o9_OCD,brain=0,mini=0,miniN=8,eyes='open',ends=null,extra=null,mouth='smile',bob=1,bumps=0,armDots=0,headDots=0,dotCol=P.mint,headCol=P.mint,op=1,wav=22,hi=-1}=o;
  const by=Math.sin(g*1.6)*10*bob;const arms=[];
  for(let i=0;i<8;i++){const a=(15+i*150/7)*Math.PI/180;const bx=Math.cos(a)*95;let ex=Math.cos(a)*370,ey=70+Math.sin(a)*250+Math.sin(g*1.5+i)*22;if(ends&&ends[i])[ex,ey]=ends[i];
    arms.push([i,o9_tentPts(bx,10,ex,ey,g,i*1.7,{bow:(i<4?-1:1)*40,wav}),Math.sin(a)]);}
  let A='',top='';const r=rng(17);
  arms.slice().sort((p,q)=>p[2]-q[2]).forEach(([i,pts])=>{A+=o9_tentDraw(pts,{w:58,col,suck:bumps>.5?o9_mix(o9_SK,col,.6):o9_SK,tip:.12});
    if(bumps>0)pts.forEach((p,j)=>{if(j%2&&j<14)A+=`<circle cx="${p[0]+(r()-.5)*16}" cy="${p[1]+(r()-.5)*16}" r="${6+r()*5}" fill="${dark}" opacity="${bumps*.8}"/>`;});
    if(armDots>0)pts.forEach((p,j)=>{if(j>1&&j<15)top+=`<circle cx="${p[0]}" cy="${p[1]}" r="${7-j*.25}" fill="${dotCol}" opacity="${armDots*(.55+.45*Math.sin(g*6+j+i))}"/>`;});
    if(hi===i)top+=pts.slice(2,15).map((p,j)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${12-j*.5}" fill="${P.gold}" stroke="${INK}" stroke-width="3" opacity="${.6+.4*Math.sin(g*6+j)}"/>`).join('');
    if(mini>0&&i<miniN)top+=o9_mini(pts[5][0],pts[5][1],mini,g+i);if(extra)top+=extra(i,pts);});
  let sp='';const r2=rng(23);for(let i=0;i<9;i++)sp+=`<circle cx="${(r2()-.5)*230}" cy="${-300+r2()*230}" r="${8+r2()*12}" fill="${dark}" opacity="${.55+bumps*.4}"/>`;
  let hd='';if(headDots>0){const r3=rng(29);for(let i=0;i<22;i++)hd+=`<circle cx="${(r3()-.5)*200}" cy="${-290+r3()*230}" r="6" fill="${headCol}" opacity="${headDots*(.5+.5*Math.sin(g*5+i))}"/>`;}
  const eye=ex=>eyes==='closed'?`<path d="M${ex-26} -18 Q${ex} -4 ${ex+26} -18" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`
    :`<ellipse cx="${ex}" cy="-22" rx="36" ry="32" fill="#FFF6EA" stroke="${INK}" stroke-width="7"/><rect x="${ex-18}" y="-29" width="36" height="14" rx="7" fill="${INK}"/><circle cx="${ex+8}" cy="-32" r="5" fill="#fff"/>`;
  const M=mouth==='frown'?`<path d="M-16 40 Q0 28 16 40" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`:mouth==='o'?`<ellipse cx="0" cy="36" rx="9" ry="11" fill="#3a1220" stroke="${INK}" stroke-width="4"/>`:`<path d="M-16 30 Q0 44 16 30" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  return `<g transform="translate(${x},${y+by}) scale(${s})" opacity="${op}">${A}
    <path d="M-125 30 C-215 -90 -165 -340 0 -340 C165 -340 215 -90 125 30 Q0 70 -125 30Z" fill="${col}" stroke="${INK}" stroke-width="9"/>${sp}
    <path d="M-110 -230 Q-90 -300 -20 -318" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity=".3"/>
    ${brain>0?`<g opacity="${brain}"><circle cx="0" cy="-190" r="170" fill="url(#gGold)"/>${G(0,-190,.42,o9_brain(g))}</g>`:''}${hd}
    ${eye(-62)}${eye(62)}${M}${top}</g>`;}
function o9_brain(g){return brain(0,0,1,1,g);}
// Glint with octopus arms instead of his own two arms. ends: local endpoints (glint units)
const o9_REST=[[-250,-20],[-240,100],[-180,210],[-80,265],[80,265],[180,210],[240,100],[250,-20]];
function o9_gT(o,ends=o9_REST,q={}){
  const {grow=1,mini=0,col=P.cream,w=30,items=[],wav=16,tips=null}=o9_q(q);const g=o.t||0;let tt='',it='';
  ends.forEach(([ex,ey],i)=>{const x1=lerp(0,ex,grow),y1=lerp(40,ey,grow);const pts=o9_tentPts(0,40,x1,y1,g,i*1.3,{bow:(i%2?1:-1)*26*grow,wav:wav*grow});
    tt+=o9_tentDraw(pts,{w:w*Math.max(.25,grow),col,suck:'#FFC2B0',tip:.2,sw:6});if(mini>0)it+=o9_mini(pts[5][0],pts[5][1],mini*.8,g+i);if(tips)it+=tips(i,x1,y1);});
  items.forEach(([i,svg])=>{if(!svg)return;const [ex,ey]=ends[i];it+=`<g transform="translate(${lerp(0,ex,grow)},${lerp(40,ey,grow)})">${svg}</g>`;});
  let base=glint({...o,pose:'down'}).replace(/<path d="M0 40 Q-48 80 -62 150"[^>]*\/>/g,'').replace(/<path d="M0 40 Q48 80 62 150"[^>]*\/>/g,'');
  return base.replace(/<g transform="rotate\([^)]*\)">/,m=>tt+it+m);}
function o9_q(q){return q;}
const o9_loc=(X,Y,x,y,s)=>[(X-x)/s,(Y-y)/s];
function o9_crab(x,y,s=1,g=0,o={}){const {op=1,glow=0}=o;const cl=Math.sin(g*4)*8;
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="${op}">${glow?`<circle r="200" fill="url(#gGold)" opacity="${glow}"/>`:''}
   ${[-1,1].map(d=>[0,1,2].map(i=>`<path d="M${d*60} ${10+i*14} q${d*50} ${-10} ${d*80} ${40}" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${d*60} ${10+i*14} q${d*50} ${-10} ${d*80} ${40}" stroke="#E2483B" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')).join('')}
   ${[-1,1].map(d=>`<path d="M${d*70} -20 Q${d*120} -60 ${d*120} -100" stroke="${INK}" stroke-width="14" fill="none"/><path d="M${d*70} -20 Q${d*120} -60 ${d*120} -100" stroke="#E2483B" stroke-width="8" fill="none"/><g transform="translate(${d*120},-110) rotate(${d*cl})"><path d="M0 0 C${d*-40} -30 ${d*-10} -80 ${d*20} -60 L${d*4} -30 L${d*36} -40 C${d*40} 0 ${d*20} 10 0 0Z" fill="#E2483B" stroke="${INK}" stroke-width="6"/></g>`).join('')}
   <ellipse rx="90" ry="58" fill="#E2483B" stroke="${INK}" stroke-width="8"/><path d="M-20 -50 V-80 M20 -50 V-80" stroke="${INK}" stroke-width="7"/><circle cx="-20" cy="-86" r="11" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="20" cy="-86" r="11" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="-18" cy="-86" r="5" fill="${INK}"/><circle cx="22" cy="-86" r="5" fill="${INK}"/></g>`;}
function o9_item(k,s=1,g=0,rot=0){const I={
  phone:`<rect x="-34" y="-60" width="68" height="120" rx="12" fill="${INK}" stroke="${INK}" stroke-width="6"/><rect x="-26" y="-48" width="52" height="92" rx="6" fill="${P.mint}" opacity="${.7+.3*Math.sin(g*8)}"/><rect x="-18" y="-36" width="30" height="8" rx="4" fill="#fff"/><rect x="-18" y="-20" width="22" height="8" rx="4" fill="#fff"/>`,
  toast:`<path d="M-55 50 V-20 Q-70 -60 -30 -62 Q0 -76 30 -62 Q70 -60 55 -20 V50Z" fill="#E8B26A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-40 40 V-14 Q-50 -44 -20 -46 Q0 -56 20 -46 Q50 -44 40 -14 V40Z" fill="#F7D79A"/><rect x="-22" y="-14" width="40" height="22" rx="6" fill="#FFE97A" stroke="${INK}" stroke-width="4"/>`,
  knife:`<rect x="-6" y="-20" width="12" height="60" rx="5" fill="#5A3A22" stroke="${INK}" stroke-width="4"/><path d="M-8 -20 V-90 Q8 -100 10 -70 V-20Z" fill="#DDE3EC" stroke="${INK}" stroke-width="4"/>`,
  pot:`<path d="M-40 -60 H40 L50 50 Q0 70 -50 50Z" fill="#BFEFFF" opacity=".9" stroke="${INK}" stroke-width="7"/><path d="M-46 0 L48 0 L50 50 Q0 70 -50 50Z" fill="#6B3A1E"/><path d="M40 -40 Q90 -30 80 30 L46 30" stroke="${INK}" stroke-width="10" fill="none"/><path d="M-40 -60 L-64 -78" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>`,
  mug:`<rect x="-40" y="-40" width="80" height="84" rx="12" fill="#fff" stroke="${INK}" stroke-width="7"/><ellipse cx="0" cy="-36" rx="34" ry="8" fill="#6B3A1E"/><path d="M40 -20 Q72 -16 66 14 Q60 30 40 26" stroke="${INK}" stroke-width="9" fill="none"/>`,
  pan:`<path d="M60 0 H170" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><ellipse rx="80" ry="34" fill="#2A2A33" stroke="${INK}" stroke-width="7"/><ellipse cx="-6" cy="-4" rx="40" ry="18" fill="#fff"/><circle cx="-4" cy="-6" r="13" fill="${P.gold}"/>`,
  shoe:`<path d="M-80 30 V-20 Q-60 -44 -20 -34 L40 6 Q92 8 92 30Z" fill="#E8574A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-80 30 H92" stroke="#fff" stroke-width="10"/><path d="M-30 -24 l20 14 M-14 -30 l20 14" stroke="#fff" stroke-width="5"/>`,
  comb:`<rect x="-70" y="-16" width="140" height="26" rx="8" fill="${P.violet}" stroke="${INK}" stroke-width="6"/>${[...Array(9)].map((_,i)=>`<rect x="${-62+i*15}" y="8" width="7" height="28" fill="${P.violet}" stroke="${INK}" stroke-width="2"/>`).join('')}`,
  laptop:`<rect x="-80" y="-90" width="160" height="104" rx="10" fill="#2A3248" stroke="${INK}" stroke-width="7"/><rect x="-66" y="-78" width="132" height="80" rx="4" fill="#E8F4FF"/><path d="M-40 -60 H40 V-20 H-40Z M-40 -60 L0 -36 L40 -60" stroke="${P.coral}" stroke-width="5" fill="none"/><path d="M-100 14 H100 L88 34 H-88Z" fill="#9AA7BD" stroke="${INK}" stroke-width="6"/>`,
  cookie:`<circle r="44" fill="#D9A05B" stroke="${INK}" stroke-width="7"/>${[[-14,-12],[16,-6],[-4,16],[20,20],[-22,12]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="6" fill="#4A2A14"/>`).join('')}`,
  pizza:`<path d="M0 -60 L60 50 Q0 74 -60 50Z" fill="#FFD27A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-60 50 Q0 74 60 50" stroke="#C98A3A" stroke-width="14" fill="none"/><circle cx="-6" cy="10" r="10" fill="${P.red}"/><circle cx="14" cy="34" r="9" fill="${P.red}"/><circle cx="-20" cy="38" r="8" fill="${P.red}"/>`,
  shell:`<path d="M-50 30 Q-60 -40 0 -50 Q60 -40 50 30Z" fill="#F2C9A0" stroke="${INK}" stroke-width="6"/><path d="M0 30 V-46 M-24 30 L-30 -36 M24 30 L30 -36" stroke="#C98A6A" stroke-width="5"/>`,
  pebble:`<ellipse rx="44" ry="30" fill="#9AA7BD" stroke="${INK}" stroke-width="6"/><ellipse cx="-12" cy="-10" rx="12" ry="6" fill="#fff" opacity=".5"/>`,
  ball:`<circle r="34" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><path d="M-34 0 Q0 20 34 0" stroke="${INK}" stroke-width="4" fill="none"/>`,
  puzzle:`<path d="M-60 -60 H-14 Q-14 -90 10 -90 Q34 -90 34 -60 H60 V-14 Q90 -14 90 10 Q90 34 60 34 V60 H-60Z" fill="${P.mint}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`,
  jar:`<rect x="-56" y="-50" width="112" height="120" rx="20" fill="#BFEFFF" opacity=".85" stroke="${INK}" stroke-width="7"/><rect x="-46" y="-80" width="92" height="34" rx="8" fill="${P.red}" stroke="${INK}" stroke-width="6" transform="rotate(${Math.sin(g*3)*12} 0 -63)"/><circle cx="0" cy="20" r="22" fill="#E2483B" stroke="${INK}" stroke-width="5"/>`,
  tank:`<rect x="-90" y="-60" width="180" height="130" rx="10" fill="#6FD3F7" opacity=".7" stroke="${INK}" stroke-width="7"/><path d="M-90 -30 H90" stroke="#fff" stroke-width="4" opacity=".6"/><path d="M60 -60 q20 -40 60 -30" stroke="${o9_OC}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M60 -60 q20 -40 60 -30" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/>`
 }[k]||'';return `<g transform="scale(${s}) rotate(${rot})">${I}</g>`;}
function o9_body(x,y,s,g,o={}){const {armR=[150,160],armL=[-150,160],gut=0,spine=0,brainK=1,vagus=0,cut=0,net=0,fly=0,food=0,pulseUp=0,col='#14304A',line=o9_GUT}=o;
  const arm=([ex,ey],sx)=>`<path d="M${sx*105} -170 Q${sx*130+ex*.2} ${(ey-170)*.4} ${ex} ${ey}" stroke="${line}" stroke-width="70" fill="none" stroke-linecap="round"/><path d="M${sx*105} -170 Q${sx*130+ex*.2} ${(ey-170)*.4} ${ex} ${ey}" stroke="${col}" stroke-width="56" fill="none" stroke-linecap="round"/>`;
  const leg=sx=>`<path d="M${sx*55} 180 L${sx*70} 440" stroke="${line}" stroke-width="80" stroke-linecap="round"/><path d="M${sx*55} 180 L${sx*70} 440" stroke="${col}" stroke-width="66" stroke-linecap="round"/>`;
  let intest='M-60 40';for(let i=0;i<5;i++)intest+=` Q${i%2?-80:80} ${60+i*22} ${i%2?-60:60} ${80+i*22}`;
  let nd='';if(net>0){const r=rng(37);const pts=[];for(let i=0;i<30;i++)pts.push([(r()-.5)*170,-80+r()*240]);pts.forEach((p,i)=>{const q=pts[(i+3)%30];nd+=`<path d="M${p[0]} ${p[1]} L${q[0]} ${q[1]}" stroke="${P.mint}" stroke-width="3" opacity="${net*.35}"/>`;});pts.forEach((p,i)=>nd+=`<circle cx="${p[0]}" cy="${p[1]}" r="7" fill="${P.mint}" opacity="${net*(.5+.5*Math.sin(g*5+i))}"/>`);}
  let fd='';if(food>0)for(let i=0;i<4;i++){const k=((g*.25+i/4)%1);const yy=40+k*130, xx=Math.sin(k*14)*60;fd+=`<circle cx="${xx}" cy="${yy}" r="12" fill="${P.gold}" stroke="${INK}" stroke-width="3" opacity="${food}"/>`;}
  let fl='';if(fly>0)for(let i=0;i<5;i++){const fx=Math.sin(g*2+i*1.7)*70, fy=40+Math.cos(g*1.6+i*2.3)*70;fl+=o9_fly(fx,fy,.45*fly,g+i,[P.gold,P.coral,P.violet,P.mint,'#FF8FA3'][i]);}
  const vp='M-30 -240 Q-70 -150 -40 -60';const vm='M-30 -240 Q-70 -150 -40 -60';
  let pu='';if(pulseUp>0)for(let i=0;i<3;i++){const k=((g*.8+i/3)%1);const yy=lerp(-60,-240,k), xx=-40-Math.sin(k*Math.PI)*22;pu+=`<circle cx="${xx}" cy="${yy}" r="12" fill="${P.gold}" stroke="${INK}" stroke-width="3" opacity="${pulseUp}"/>`;}
  return `<g transform="translate(${x},${y}) scale(${s})">${leg(-1)}${leg(1)}${arm(armL,-1)}${arm(armR,1)}
   <path d="M-60 -200 Q-130 -195 -125 -120 L-105 150 Q-100 195 -60 195 H60 Q100 195 105 150 L125 -120 Q130 -195 60 -200Z" fill="${col}" stroke="${line}" stroke-width="7"/>
   <rect x="-30" y="-250" width="60" height="60" fill="${col}"/><circle cx="0" cy="-320" r="95" fill="${col}" stroke="${line}" stroke-width="7"/>
   ${G(0,-320,.36,`<g opacity="${brainK}">${brain(0,0,1,1,g)}</g>`)}
   ${spine>0?`<path d="M0 -230 V160" stroke="${P.gold}" stroke-width="16" stroke-linecap="round" opacity="${.3+.7*spine}"/>${[...Array(10)].map((_,i)=>`<rect x="-16" y="${-215+i*38}" width="32" height="18" rx="6" fill="${P.gold}" opacity="${spine}" stroke="${INK}" stroke-width="3"/>`).join('')}`:''}
   ${gut>0?`<g opacity="${gut}"><path d="M-70 -60 Q-90 -120 -20 -120 Q60 -120 60 -70 Q60 -10 -10 0 Q-70 6 -70 -60Z" fill="#FF9EC0" stroke="${INK}" stroke-width="6"/><path d="${intest}" stroke="${INK}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="${intest}" stroke="#FF9EC0" stroke-width="20" fill="none" stroke-linecap="round"/></g>`:''}
   ${nd}${fd}${vagus>0?(cut>0?`<path d="${vp}" stroke="${P.mint}" stroke-width="8" fill="none" stroke-dasharray="70 40 400" opacity="${vagus}"/>`:`<path d="${vm}" stroke="${P.mint}" stroke-width="8" fill="none" opacity="${vagus}"/>`):''}${pu}${fl}</g>`;}
function o9_fly(x,y,s,g,col){const f=Math.abs(Math.sin(g*14));return `<g transform="translate(${x},${y}) scale(${s})"><path d="M0 0 C-60 ${-70*f-10} -90 -10 0 0 C-70 50 -30 70 0 0Z" fill="${col}" stroke="${INK}" stroke-width="5"/><path d="M0 0 C60 ${-70*f-10} 90 -10 0 0 C70 50 30 70 0 0Z" fill="${col}" stroke="${INK}" stroke-width="5"/><rect x="-5" y="-26" width="10" height="52" rx="5" fill="${INK}"/></g>`;}
function o9_scissors(x,y,s,open){const a=open*24;return `<g transform="translate(${x},${y}) scale(${s})"><g transform="rotate(${-a})"><path d="M0 0 L140 -8 L140 8Z" fill="#DDE3EC" stroke="${INK}" stroke-width="5"/><circle cx="-40" cy="-16" r="26" fill="none" stroke="${P.red}" stroke-width="12"/></g><g transform="rotate(${a})"><path d="M0 0 L140 8 L140 -8Z" fill="#DDE3EC" stroke="${INK}" stroke-width="5"/><circle cx="-40" cy="16" r="26" fill="none" stroke="${P.red}" stroke-width="12"/></g><circle r="8" fill="${INK}"/></g>`;}
function o9_rocks(g,col='#6E6A72'){let r='';[[200,900,260,160],[620,920,320,190],[1100,900,300,170],[1560,910,340,200],[1880,900,200,150]].forEach(([x,y,w,h],i)=>{r+=`<path d="M${x-w} ${y+60} Q${x-w*.9} ${y-h} ${x} ${y-h*1.05} Q${x+w*.9} ${y-h} ${x+w} ${y+60}Z" fill="${col}" stroke="${INK}" stroke-width="8"/>`;const q=rng(50+i);for(let j=0;j<8;j++)r+=`<circle cx="${x+(q()-.5)*w*1.3}" cy="${y-q()*h*.8}" r="${8+q()*14}" fill="#4E4A55" opacity=".7"/>`;});return r;}
function o9_reef(w,h,g){let c='';const cols=['#FF5E5B','#FFC83D','#7C5CFF','#3DF5C2','#FF8FA3'];
  for(let i=0;i<5;i++){const x=-w/2+60+i*(w-120)/4;c+=`<path d="M${x} ${h/2} Q${x-30} ${h/2-80} ${x-10} ${h/2-140} M${x} ${h/2} Q${x+30} ${h/2-90} ${x+20} ${h/2-160}" stroke="${cols[i]}" stroke-width="22" fill="none" stroke-linecap="round"/>`;}
  for(let i=0;i<3;i++){const fx=-w/2+((g*60+i*170)%w), fy=-h/2+60+i*50;c+=`<g transform="translate(${fx},${fy})"><ellipse rx="30" ry="16" fill="${cols[(i+1)%5]}" stroke="${INK}" stroke-width="4"/><path d="M-28 0 L-50 -14 V14Z" fill="${cols[(i+1)%5]}" stroke="${INK}" stroke-width="4"/></g>`;}
  return `<rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="20" fill="#1D6FA0"/>${c}<rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="20" fill="none" stroke="${INK}" stroke-width="8"/>`;}
function o9_ttl(t,a,b,s1,s2,c1=P.white,c2=P.gold,size=84,y=140){const sw=AT(t,b);return T(960,y,sw?s2:s1,{size,fill:sw?c2:c1,sc:pop(t,sw?b:a)});}

Object.assign(SHOTS,{
octHook(t,d,p,g){
  const arm=prog(t,p.arms??4.5,(p.arms??4.5)+1.4), hd=AT(t,p.head??3.3), tas=AT(t,p.taste??9.2), rch=eout(prog(t,p.reach??10.8,(p.reach??10.8)+1.4));
  const gx=700,gy=520;const ends=o9_REST.map((e,i)=>i===0?[lerp(e[0],-330,rch),lerp(e[1],-240,rch)]:i===7?[lerp(e[0],380,rch),lerp(e[1],-220,rch)]:e);
  return `${o9_DEFS}${o9_bgSea(g)}${o9_octo(1450,560,.85,g,{brain:1,mini:1})}
   ${rch>0?`<g transform="translate(${gx-330},${gy-250})">${o9_item('pizza',1,g)}</g><g transform="translate(${gx+380},${gy-230})">${o9_item('phone',1,g)}</g>`:''}
   ${hd?`<circle cx="${gx}" cy="${gy-60}" r="${150}" fill="url(#gGold)" opacity="${.7*pop(t,p.head??3.3)}"/>`:''}
   ${o9_gT({x:gx,y:gy,s:1,t:g,mouth:arm>0?'grin':'o',brows:'raised',blink:BL(g)},ends,{grow:arm,mini:arm>.6?1:0,tips:tas?(i,x,y)=>i%2?o9_spark(x,y,g+i,P.gold,.8):'':null})}
   ${hd?T(gx-210,gy-200,'1',{size:90,fill:P.gold,sc:pop(t,p.head??3.3)}):''}${arm>.3?T(gx+230,gy-180,'+8',{size:90,fill:P.gold,sc:pop(t,(p.arms??4.5)+.5)}):''}
   ${T(960,140,'9 BRAINS?',{size:120,fill:P.gold,sc:IN(t,.3)})}${AT(t,p.taste??9.2)?labelPill(1450,880,tas&&!rch?'TASTE THE WORLD':'ARMS THAT DECIDE',P.mint,42):''}`;
},
octTease(t,d,p,g){
  const oc=AT(t,p.oct??2), en=AT(t,p.end??5.3);
  if(en){return `${o9_DEFS}${o9_bgSea(g)}${o9_octo(560,520,.75,g,{brain:1,mini:1})}
    <circle cx="1380" cy="600" r="${170+10*Math.sin(g*4)}" fill="url(#gMint)"/>${glint({x:1380,y:500,s:1,t:g,mouth:'o',brows:'raised',blink:BL(g),pose:'shrug'})}
    ${T(1380,640,'?',{size:110,fill:P.mint,sc:pop(t,p.end??5.3)})}${T(960,140,'A SECOND BRAIN... IN YOU?',{size:80,fill:P.mint,sc:pop(t,p.end??5.3)})}`;}
  const ox=oc?lerp(2200,1350,eout(prog(t,p.oct??2,(p.oct??2)+1.5))):2400;
  return `${o9_DEFS}${o9_bgSea(g)}${glint({x:oc?620:960,y:520,s:1.05,t:g,mouth:oc?'o':'smirk',brows:'raised',blink:BL(g),pose:oc?'point':'shrug'})}
   ${oc?o9_octo(ox,540,.85,g,{brain:1,mini:1}):icon('rocket',1400,420,1.2)}
   ${o9_ttl(t,.2,p.oct??2,'SCIENCE FICTION?','AN OCTOPUS: EVERY DAY',P.white,P.gold,90)}`;
},
octCount(t,d,p,g){
  const n=Math.round(500*eout(prog(t,.3,2.3)));const ms=AT(t,p.mouse??5.9), dg=AT(t,p.dog??8.3);
  const bar=(y,lab,w,col,a,ic)=>{const k=eout(prog(t,a,a+.9));return `${ic}<rect x="960" y="${y-35}" width="${Math.max(1,w*k)}" height="70" rx="16" fill="${col}" stroke="${INK}" stroke-width="7"/>${k>.3?`<text x="985" y="${y+14}" font-size="38" font-weight="900" fill="${INK}">${lab}</text>`:''}`;};
  return `${o9_DEFS}${o9_bgSea(g)}${o9_octo(470,520,.75,g,{headDots:1,armDots:1})}
   ${T(1300,330,`${n} MILLION`,{size:110,fill:P.gold})}${T(1300,430,'NERVE CELLS',{size:56,fill:P.white})}
   ${ms?bar(560,'OCTOPUS',720,P.gold,p.mouse??5.9,`<g transform="translate(880,560)">${o9_octo(0,10,.17,g,{bob:0})}</g>`)+bar(680,'MOUSE',230,'#B8B8C8',(p.mouse??5.9)+.3,icon('rat',880,680,.42)):''}
   ${dg?bar(800,'DOG',660,'#C9A46A',p.dog??8.3,dog(865,810,.32,g)):''}
   ${T(960,130,ms?(dg?'SAME LEAGUE AS A DOG':'MORE THAN A MOUSE'):'AN OCTOPUS HAS...',{size:84,fill:P.white,sc:pop(t,dg?p.dog??8.3:ms?p.mouse??5.9:.2)})}`;
},
octSplit(t,d,p,g){
  const ar=AT(t,p.arms??4.7), mo=AT(t,p.most??1.8);const k=eout(prog(t,p.arms??4.7,(p.arms??4.7)+1.2));
  return `${o9_DEFS}${o9_bgSea(g)}${o9_octo(700,560,.9,g,{headDots:1-.5*k,armDots:.5+.5*k,dotCol:ar?P.gold:P.mint})}
   <g transform="translate(1500,0)"><rect x="-110" y="250" width="220" height="600" rx="24" fill="#0B1A2A" stroke="${INK}" stroke-width="8"/>
    ${ar?`<rect x="-110" y="250" width="220" height="${200*k}" rx="24" fill="${P.violet}" stroke="${INK}" stroke-width="6"/><rect x="-110" y="${850-400*k}" width="220" height="${400*k}" rx="24" fill="${P.gold}" stroke="${INK}" stroke-width="6"/>
     ${k>.5?T(0,370,'HEAD 1/3',{size:40,fill:P.white,stroke:8})+T(0,670,'ARMS 2/3',{size:46,fill:P.white,stroke:9}):''}`:T(0,560,'?',{size:160,fill:P.white})}</g>
   ${T(960,130,ar?'2/3 ARE IN THE ARMS':mo?'NOT IN ITS HEAD!':"HERE'S THE WEIRD PART",{size:84,fill:ar?P.gold:P.white,sc:pop(t,ar?p.arms??4.7:mo?p.most??1.8:.2)})}`;
},
octNine(t,d,p,g){
  const nine=AT(t,p.nine??4.9), one=AT(t,p.one??8.5), mi=AT(t,p.mini??10);const mn=mi?Math.min(8,Math.floor((t-(p.mini??10))/.32)+1):0;
  return `${o9_DEFS}${o9_bgSea(g)}${o9_octo(960,540,.95,g,{brain:one?1:0,mini:mi?1:0,miniN:mn,hi:nine?-1:5})}
   ${one?labelPill(330,330,'1 CENTRAL BRAIN',P.gold,44):''}${mi?labelPill(1590,330,`+ ${mn} MINI BRAINS`,P.gold,44):''}
   ${!nine?labelPill(420,640,'ITS OWN NERVE CLUSTER',P.gold,36):''}
   ${T(960,130,nine?'9 BRAINS':'EACH ARM GETS ITS OWN',{size:nine?120:84,fill:nine?P.gold:P.white,sc:pop(t,nine?p.nine??4.9:.2)})}`;
},
octOrder(t,d,p,g){
  const rest=p.rest??3.6;const k=eout(prog(t,rest,rest+4.5));const [lx,ly]=o9_loc(1450,720,520,520,.85);
  const ends=[[lerp(358,lx,k),lerp(160,ly,k)]];
  const sig=AT(t,rest)?(i,pts)=>{if(i!==0)return '';const q=pts[Math.floor(((t*1.2)%1)*16)];return `<circle cx="${q[0]}" cy="${q[1]}" r="22" fill="${P.gold}" stroke="${INK}" stroke-width="5"/><circle cx="${q[0]}" cy="${q[1]}" r="50" fill="url(#gGold)"/>`;}:null;
  const L=[['HOW TO BEND',p.bend??6.4],['HOW TO GRAB',p.grab??7.5],['WHICH SUCKER?',p.sucker??8.6]];
  return `${o9_DEFS}${o9_bgSea(g)}${o9_crab(1500,770,.8,g)}${o9_octo(520,520,.85,g,{brain:1,mini:1,ends,extra:sig})}
   ${!AT(t,rest)?bubble(900,250,620,110,'GO GET THAT CRAB!',{size:50,tail:'left'}):''}
   ${L.map(([s,a],i)=>AT(t,a)?labelPill(1480,300+i*120,s,P.mint,44):'').join('')}
   ${AT(t,rest)?T(960,130,'THE ARM DOES THE REST',{size:84,fill:P.gold,sc:pop(t,rest)}):''}`;
},
octSucker(t,d,p,g){
  const ta=AT(t,p.taste??2.5), se=AT(t,p.sensors??4);let su='';
  for(let i=0;i<7;i++){const x=200+i*250, y=560+Math.sin(g*1.5+i*.7)*20, r=82-i*5;
    su+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${o9_SK}" stroke="${INK}" stroke-width="8"/><circle cx="${x}" cy="${y}" r="${r*.5}" fill="#E9A890" stroke="${INK}" stroke-width="5"/>${ta?`<circle cx="${x}" cy="${y}" r="${r+12+6*Math.sin(g*6+i)}" fill="none" stroke="${P.gold}" stroke-width="8" opacity=".8"/>`:''}`;}
  let ch='';if(se)for(let i=0;i<16;i++){const k=((g*.5+i/16)%1);const x=(i*131)%1920, y=lerp(240,520,k);ch+=`<g transform="translate(${x},${y}) rotate(${g*90+i*40})" opacity="${1-k*.7}"><path d="M0 -14 L12 7 L-12 7Z" fill="${['#9BE15D',P.violet,'#FF8FA3',P.gold][i%4]}" stroke="${INK}" stroke-width="3"/></g>`;}
  return `${o9_DEFS}${o9_bgSea(g,{floor:false})}<path d="M-50 ${440+Math.sin(g*1.5)*20} Q960 ${400} 1970 ${440+Math.sin(g*1.5+5)*20} V720 Q960 760 -50 720Z" fill="${o9_OC}" stroke="${INK}" stroke-width="10"/>${su}${ch}
   ${se?labelPill(960,850,'PACKED WITH CHEMICAL SENSORS',P.gold,46):''}
   ${o9_ttl(t,.2,p.taste??2.5,'NOT JUST TOUCH...','THEY TASTE!',P.white,P.gold,100)}`;
},
octCrack(t,d,p,g){
  const eat=p.eat??11.2;
  if(AT(t,eat)){const ys=AT(t,p.yum??13.5);
    return `${bgRoom(g)}<rect x="0" y="700" width="1920" height="60" fill="#8A6A4A" stroke="${INK}" stroke-width="6"/>
     ${glint({x:760,y:500,s:1.05,t:g,pose:'reach',mouth:ys?'grin':'o',brows:'raised',blink:BL(g)})}<g transform="translate(925,470) rotate(20)">${o9_item('pizza',1.1,g)}</g>
     ${ys?[0,1,2,3].map(i=>o9_spark(900+Math.cos(g*2+i*1.6)*80,470+Math.sin(g*2+i*1.6)*80,g+i,P.gold,1)).join('')+T(1250,420,'YUM!',{size:110,fill:P.gold,sc:pop(t,p.yum??13.5)}):''}
     ${T(960,140,ys?'TASTE WITH YOUR FINGERTIPS':'EATING WITH YOUR HANDS...',{size:84,fill:ys?P.gold:P.white,sc:pop(t,ys?p.yum??13.5:eat)})}`;}
  const k=eout(prog(t,.3,5.5)), cr=AT(t,p.crab??6.1);const tx=lerp(150,1260,k);
  const pts=o9_tentPts(-80,640,tx,520,g,0,{bow:-30,wav:14});
  return `${o9_DEFS}<rect width="1920" height="1080" fill="#3A3640"/>${o9_rocks(g,'#5E5866')}
   <path d="M-20 460 Q300 420 600 480 Q900 540 1200 470 Q1450 420 1720 480 L1720 580 Q1450 540 1200 590 Q900 640 600 590 Q300 540 -20 600Z" fill="#05070D" stroke="${INK}" stroke-width="8"/>
   ${o9_crab(1560,530,.55,g,{op:cr?1:.25,glow:cr?1:0})}${o9_tentDraw(pts,{w:90,tip:.25})}${o9_taste(tx+30,500,g,'#9BE15D',1.2)}
   ${cr?T(1560,360,'A CRAB!',{size:84,fill:P.gold,sc:pop(t,p.crab??6.1)}):''}
   ${T(960,140,cr?'TASTED BEFORE IT IS SEEN':'TASTING IN THE DARK',{size:84,fill:cr?P.gold:P.white,sc:pop(t,cr?p.crab??6.1:.2)})}`;
},
octGrow(t,d,p,g){
  const gr=eout(prog(t,.4,2.4)), ar=AT(t,p.arms??2.5);
  return `${bgRoom(g)}${o9_gT({x:960,y:540,s:1.05,t:g,mouth:gr>.5?'grin':'o',brows:'raised',blink:BL(g),glint:ar?1:0},o9_REST,{grow:gr})}
   ${o9_ttl(t,.2,p.arms??2.5,'YOUR OCTOPUS BODY','WELL... JUST THE ARMS',P.white,P.gold,90)}`;
},
octBed(t,d,p,g){
  const k=eout(prog(t,p.reach??1,(p.finds??2.4)+1.6)), kn=AT(t,p.knows??7.7);const [lx,ly]=o9_loc(1430,560,640,560,1);
  const ends=o9_REST.map((e,i)=>i===7?[lerp(e[0],lx,k),lerp(e[1],ly,k)]:e);
  return `${bgRoom(g)}<rect width="1920" height="1080" fill="#0B1026" opacity=".35"/>
   <rect x="200" y="560" width="70" height="300" rx="16" fill="#5A3A22" stroke="${INK}" stroke-width="7"/><rect x="230" y="640" width="900" height="120" rx="20" fill="#5A6FA8" stroke="${INK}" stroke-width="8"/>
   <rect x="1340" y="620" width="220" height="220" rx="12" fill="#8A6A4A" stroke="${INK}" stroke-width="7"/>
   ${o9_gT({x:640,y:560,s:1,t:g,eyes:'closed',mouth:kn?'smirk':'smile',blink:0},ends,{})}
   <path d="M220 700 Q640 640 1140 700 V820 H220Z" fill="#7C8FD0" stroke="${INK}" stroke-width="8"/>
   <g transform="translate(1440,${595-(k>.95?Math.min(1,(t-(p.finds??2.4)-1.6)*2)*30:0)}) rotate(${k>.95?0:90})">${o9_item('phone',.9,g)}</g>
   ${!kn&&k<.95?T(1450,480,'BZZ',{size:50,fill:P.mint,rot:Math.sin(g*30)*4}):''}${T(820,300,'z',{size:60,fill:P.ice,op:.5+.5*Math.sin(g*2)})}${T(870,240,'Z',{size:80,fill:P.ice,op:.5+.5*Math.sin(g*2+1)})}
   ${AT(t,p.look??6)?labelPill(640,180+60,'EYES: STILL CLOSED',P.ice,40):''}
   ${o9_ttl(t,.2,p.knows??7.7,'YOU WAKE UP','IT JUST KNOWS',P.white,P.gold,90,130)}`;
},
octKitchen(t,d,p,g){
  const tA=p.toast??3.3, cA=p.coffee??5.8, oA=p.orders??10.6;const kt=eout(prog(t,tA,tA+1)), kc=eout(prog(t,cA,cA+1));
  const [ax,ay]=o9_loc(520,640,960,480,1), [bx,by]=o9_loc(1380,540,960,480,1);
  const ends=o9_REST.map((e,i)=>i===0?[lerp(e[0],ax,kt),lerp(e[1],ay,kt)]:i===7?[lerp(e[0],bx,kc),lerp(e[1],by,kc)]:e);
  const pour=kc>.95;
  return `${bgRoom(g)}<rect x="0" y="720" width="1920" height="200" fill="#8A6A4A" stroke="${INK}" stroke-width="7"/>
   <ellipse cx="520" cy="722" rx="120" ry="20" fill="#fff" stroke="${INK}" stroke-width="6"/><g transform="translate(520,670)">${o9_item('toast',1,g)}</g>
   <g transform="translate(1480,680)">${o9_item('mug',1,g)}</g>${pour?`<path d="M1430 ${560} Q1475 600 1478 640" stroke="#6B3A1E" stroke-width="12" fill="none"/>`:''}
   ${o9_gT({x:960,y:480,s:1,t:g,mouth:AT(t,oA)?'grin':'smile',brows:'calm',blink:BL(g),look:Math.sin(g*.7)},ends,{items:[[0,kt>.9?`<g transform="translate(${Math.sin(g*10)*20},-40) rotate(${60+Math.sin(g*10)*15})">${o9_item('knife',1,g)}</g>`:''],[7,`<g transform="rotate(${pour?-40:0})">${o9_item('pot',1,g)}</g>`]]})}
   <g transform="translate(1320,230)"><circle cx="-210" cy="110" r="14" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="-170" cy="80" r="20" fill="#fff" stroke="${INK}" stroke-width="4"/><ellipse rx="210" ry="80" fill="#fff" stroke="${INK}" stroke-width="7"/><text y="16" text-anchor="middle" font-size="44" font-weight="900" fill="${INK}">TODAY'S PLAN...</text></g>
   ${AT(t,tA)?T(330,560,'BUTTER',{size:46,fill:P.gold,sc:pop(t,tA)}):''}${AT(t,cA)?T(1700,560,'COFFEE',{size:46,fill:'#E8B07A',sc:pop(t,cA)}):''}
   ${AT(t,oA)?T(600,140,'YOU GIVE THE ORDERS',{size:76,fill:P.gold,sc:pop(t,oA)}):T(560,140,'BREAKFAST',{size:90,fill:P.white,sc:IN(t,.2)})}`;
},
octMulti(t,d,p,g){
  const gx=960,gy=500,s=.95;
  const S=[[0,[-470,-160],'phone','TEXT',0],[1,[-470,120],'pan','COOK',0],[2,[-260,330],'shoe','SHOES',p.shoes??2.7],[6,[200,-280],'comb','HAIR',p.hair??4.4],[7,[480,40],'laptop','EMAIL',p.email??5.4]];
  const ends=o9_REST.slice();const items=[];let labs='';
  S.forEach(([i,e,k,lab,a])=>{const q=eout(prog(t,a,a+.7));ends[i]=[lerp(o9_REST[i][0],e[0],q),lerp(o9_REST[i][1],e[1],q)];if(AT(t,a)){items.push([i,o9_item(k,.9*pop(t,a),g,k==='comb'?Math.sin(g*8)*20:0)]);labs+=T(gx+e[0]*s,gy+e[1]*s+(k==='comb'?-80:110),lab,{size:40,fill:P.mint,stroke:8});}});
  const as=AT(t,p.assist??8.1);
  return `${bgRoom(g)}${o9_gT({x:gx,y:gy,s,t:g,mouth:as?'grin':'o',brows:'raised',blink:BL(g),glint:as?1:0},ends,{items,mini:as?1:0})}${labs}
   ${T(960,130,as?'8 LITTLE ASSISTANTS':'ALL AT ONCE',{size:90,fill:as?P.gold:P.white,sc:pop(t,as?p.assist??8.1:.2)})}`;
},
octTasteCity(t,d,p,g){
  const kn=p.knob??4.6, sh=p.shake??11.4;
  if(AT(t,sh)){const [lx,ly]=o9_loc(760,565,1250,540,1);const ends=o9_REST.map((e,i)=>i===0?[lx,ly]:e);
    return `${bgNight(g)}${extra({x:600,y:560,s:1,t:g,head:'#FFD3A8',pose:'point',mouth:'flat'})}
     ${o9_gT({x:1250,y:540,s:1,t:g,mouth:'wavy',brows:'raised',blink:BL(g)},ends,{})}${o9_taste(760,520,g,'#9BE15D',1.2)}
     ${T(960,140,'A VERY PERSONAL EXPERIENCE',{size:80,fill:P.coral,sc:pop(t,sh)})}`;}
  if(!AT(t,kn)){const re=AT(t,p.rem??1.9);
    return `${card('cardWarm',g)}${o9_gT({x:960,y:560,s:1,t:g,mouth:re?'o':'flat',brows:re?'raised':'sad',blink:BL(g)},o9_REST,{tips:re?(i,x,y)=>i%2?o9_taste(x,y-20,g+i,'#9BE15D',.7):'':null})}
     ${o9_ttl(t,.2,p.rem??1.9,'SOME PROBLEMS...','YOUR ARMS CAN TASTE',P.white,'#9BE15D',90)}`;}
  const P3=[['DOORKNOB',kn],['SUBWAY POLE',p.pole??5.6],['CART HANDLE',p.cart??6.9]];
  const ob=[`<rect x="-90" y="-150" width="180" height="300" rx="10" fill="#5A3A22" stroke="${INK}" stroke-width="7"/><circle cx="40" cy="0" r="34" fill="${P.gold}" stroke="${INK}" stroke-width="7"/>`,
    `<rect x="-20" y="-230" width="40" height="420" fill="url(#steel)" stroke="${INK}" stroke-width="6"/><path d="M-140 -200 H140" stroke="${INK}" stroke-width="10"/>`,
    `<path d="M-130 -40 H130" stroke="${P.red}" stroke-width="34" stroke-linecap="round"/><path d="M-130 -40 H130" stroke="${INK}" stroke-width="4" opacity=".4"/><path d="M-110 -20 L-70 140 H110 L130 -20" stroke="#9AA7BD" stroke-width="12" fill="none"/><path d="M-90 40 H120 M-80 90 H115" stroke="#9AA7BD" stroke-width="6"/>`];
  const tip=[[40,30],[0,0],[0,-40]];
  const ta=AT(t,p.taste??9.9);
  return `${card('cardDark',g)}${P3.map(([s,a],i)=>{if(!AT(t,a))return '';const x=380+i*580, y=520;const k=pop(t,a);
     const pts=o9_tentPts(x-120,900,x+tip[i][0],y+tip[i][1],g,i,{bow:40,wav:12});
     return `<g transform="translate(${x},${y}) scale(${k})">${ob[i]}</g>${o9_tentDraw(pts,{w:60,col:P.cream,suck:'#FFC2B0',tip:.3})}${o9_taste(x+tip[i][0]+30,y+tip[i][1]-30,g+i,'#9BE15D',1.2)}${T(x,300,s,{size:48,fill:P.white,stroke:9})}`;}).join('')}
   ${T(960,140,ta?"...YOU'RE TASTING IT":'EVERY...',{size:96,fill:ta?'#9BE15D':P.white,sc:pop(t,ta?p.taste??9.9:kn)})}`;
},
octSevered(t,d,p,g){
  const ex=p.exp??5.6;
  if(!AT(t,ex)){const ends=o9_REST.map((e,i)=>[e[0]+Math.sin(g*(1.5+i*.37)+i)*80,e[1]+Math.cos(g*(1.2+i*.29)+i*2)*70]);
    return `${card('cardDark',g)}${o9_gT({x:960,y:520,s:1,t:g,mouth:'wavy',brows:'raised',blink:BL(g),look:Math.sin(g*3)},ends,{wav:30,tips:(i,x,y)=>i%3===0?T(x,y-40,'?',{size:50,fill:P.gold,stroke:8}):''})}
     ${AT(t,p.act??3)?labelPill(960,870,'ARMS CAN ACT ON THEIR OWN',P.gold,44):''}${T(960,140,"WHO'S IN CHARGE?",{size:100,fill:P.white,sc:IN(t,.2)})}`;}
  const gr=AT(t,p.grab??11.7);const tch=((t*.7)%1)<.25;
  const tipX=1400+(gr?-40:0), tipY=gr?520:600;
  const pts=o9_tentPts(420,640,tipX,tipY,g,0,{bow:-60,wav:tch?40:24});
  return `${bgLab(g)}<rect x="300" y="660" width="1320" height="70" rx="20" fill="#DDE3EC" stroke="${INK}" stroke-width="8"/>
   ${o9_tentDraw(pts,{w:90,col:o9_OC,tip:.25})}
   ${gr?`<g transform="translate(${tipX+30},${tipY-40})">${o9_item('ball',1.2,g)}</g><path d="M${tipX-30} ${tipY} q60 20 70 -60" stroke="${INK}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M${tipX-30} ${tipY} q60 20 70 -60" stroke="${o9_OC}" stroke-width="18" fill="none" stroke-linecap="round"/>`
     :`<path d="M${1700} 200 L${1180+(tch?0:60)} ${520+(tch?0:-60)}" stroke="#BFEFFF" stroke-width="16" stroke-linecap="round"/>${tch?o9_spark(1180,530,g,P.gold,1.4):''}`}
   ${T(960,140,gr?'STILL REACHED. STILL GRABBED.':'IN EXPERIMENTS',{size:80,fill:gr?P.gold:P.white,sc:pop(t,gr?p.grab??11.7:ex)})}${!gr?labelPill(960,860,'IT KEPT REACTING TO TOUCH',P.mint,44):''}`;
},
octCookie(t,d,p,g){
  const no=AT(t,p.no??2.5), ta=AT(t,p.taste??4.8), re=prog(t,p.reach??8,(p.reach??8)+1);
  const [lx,ly]=o9_loc(1400,640,700,500,1);const tx=lerp(lx,lx-150,re), ty=lerp(ly,ly-200,re);
  const ends=o9_REST.map((e,i)=>i===7&&ta?[tx,ty]:e);
  return `${bgRoom(g)}<rect x="1000" y="700" width="900" height="40" rx="8" fill="#8A6A4A" stroke="${INK}" stroke-width="6"/><rect x="1080" y="740" width="30" height="160" fill="#5A3A22"/><rect x="1790" y="740" width="30" height="160" fill="#5A3A22"/>
   <ellipse cx="1400" cy="692" rx="170" ry="26" fill="#fff" stroke="${INK}" stroke-width="6"/><g transform="translate(1320,664)">${o9_item('cookie',.8,g)}</g><g transform="translate(1480,664)">${o9_item('cookie',.8,g)}</g>
   ${o9_gT({x:700,y:500,s:1,t:g,mouth:re>0?'o':no?'flat':'smile',brows:re>0?'raised':no?'angry':'calm',blink:BL(g),look:no&&!ta?Math.sin(g*8):0},ends,{items:[[7,ta?`<g transform="translate(0,-10)">${o9_item('cookie',.8,g)}</g>`:'']],tips:(i,x,y)=>i===7&&ta&&re<.1?o9_taste(x,y-30,g,P.gold,1):''})}
   ${no?bubble(1000,230,420,110,'NO COOKIE!',{size:54,tail:'left'}):''}
   ${o9_ttl(t,.2,p.reach??8,'ON A DIET','YOUR ARM: YES PLEASE',P.white,P.gold,90,130)}`;
},
octTangle(t,d,p,g){
  const tr=p.trick??9, ch=p.chem??15.3, yo=p.you??22.4;
  if(AT(t,yo)){const st=AT(t,p.stuck??24.6);const E=[[-70,-120],[60,-40],[-40,90],[30,160],[-160,40],[150,180],[90,-130],[200,60]];
    return `${bgRoom(g)}${o9_gT({x:960,y:540,s:1.05,t:g,mouth:st?'frown':'flat',brows:'sad',blink:BL(g),shiver:st?.5:0},E,{wav:8})}
     ${o9_ttl(t,.2,p.stuck??24.6,'YOU NEED THE SAME RULE','STUCK TO YOURSELF',P.white,P.coral,90)}`;}
  if(AT(t,ch)){const p1=o9_tentPts(100,820,1300,300,g,0,{bow:60,wav:10}), p2=o9_tentPts(1820,820,560,330,g,2,{bow:-60,wav:10});
    return `${o9_DEFS}${o9_bgSea(g)}${o9_tentDraw(p2,{w:110,tip:.3})}${p2.slice(3,14).map((q,i)=>`<circle cx="${q[0]}" cy="${q[1]}" r="${10+4*Math.sin(g*5+i)}" fill="#9BE15D" opacity=".85"/>`).join('')}
     ${o9_tentDraw(p1,{w:110,tip:.3,col:'#FF946F'})}${icon('cross',960,560,.7)}
     ${bubble(960,250,760,110,"DON'T GRAB THIS, IT'S ME!",{size:50,tail:'left'})}${labelPill(1500,880,'A CHEMICAL IN ITS SKIN',P.mint,40)}`;}
  if(AT(t,tr)){const au=AT(t,p.auto??11.5);const pts=o9_tentPts(-60,650,1900,560,g,0,{bow:-40,wav:16});
    return `${o9_DEFS}${o9_bgSea(g)}${o9_tentDraw(pts,{w:150,tip:.5})}${au?[['shell',4],['pebble',8],['ball',12]].map(([k,j],i)=>`<g transform="translate(${pts[j][0]},${pts[j][1]-70}) scale(${pop(t,(p.auto??11.5)+i*.4)})">${o9_item(k,1.2,g)}</g>`).join(''):''}
     ${o9_ttl(t,.2,p.auto??11.5,'ONE STUDY FOUND A TRICK','SUCKERS GRAB ANYTHING',P.white,P.gold,84)}`;}
  const tg=AT(t,p.tangle??2.9);const E=tg?[[-200,330],[300,160],[-330,120],[200,320],[-120,340],[340,100],[-300,180],[60,330]]:null;
  return `${o9_DEFS}${o9_bgSea(g)}${o9_octo(960,500,.9,g,{ends:E,mouth:tg?'o':'smile',mini:1})}${tg?[[560,420],[1360,420],[960,880]].map(([x,y],i)=>T(x,y,'?',{size:110,fill:P.gold,sc:pop(t,(p.tangle??2.9)+i*.3)})).join(''):''}
   ${o9_ttl(t,.2,p.tangle??2.9,'A MYSTERY','WHY NO TANGLES?',P.white,P.gold,90,130)}`;
},
octPowers(t,d,p,g){
  const sk=p.skin??6.8;
  if(AT(t,sk)){const k=prog(t,sk+.6,sk+3);const fl=['#FF5E5B','#FFC83D','#7C5CFF','#3DF5C2'][Math.floor(g*8)%4];
    const col=k<.4?fl:o9_mix(o9_OC,'#6E6A72',1), dk=k<.4?o9_OCD:'#4E4A55';
    return `${o9_DEFS}${o9_bgSea(g,{floor:false})}${o9_rocks(g)}<path d="M600 900 Q960 640 1320 900Z" fill="#6E6A72" stroke="${INK}" stroke-width="8"/>${o9_octo(960,560,.7,g,{col,dark:dk,bumps:k>=.4?1:0,bob:.3})}
     ${T(960,140,k>=.4?'NOW YOU SEE IT...':'CHANGE COLOUR. INSTANTLY.',{size:84,fill:P.white,sc:pop(t,k>=.4?sk+1.8:sk)})}`;}
  const he=AT(t,p.hearts??3), bl=AT(t,p.blood??4.9);const bt=Math.max(0,Math.sin(g*6))**4;
  return `${o9_DEFS}${o9_bgSea(g)}${o9_octo(560,560,.8,g,{})}
   ${he?[1100,1350,1600].map((x,i)=>heart(x,380,.32*pop(t,(p.hearts??3)+i*.25),bt)).join('')+T(1350,560,'3 HEARTS',{size:70,fill:P.coral}):''}
   ${bl?`<g transform="translate(1350,${720}) scale(${pop(t,p.blood??4.9)})"><path d="M0 -90 Q60 0 50 30 A50 50 0 0 1 -50 30 Q-60 0 0 -90Z" fill="#3D7CFF" stroke="${INK}" stroke-width="8"/><ellipse cx="-18" cy="10" rx="10" ry="18" fill="#fff" opacity=".5"/></g>${T(1350,880,'BLUE BLOOD',{size:60,fill:'#6FA8FF'})}`:''}
   ${T(960,130,'STRANGE POWERS',{size:90,fill:P.white,sc:IN(t,.2)})}`;
},
octEye(t,d,p,g){
  const nb=p.nobody??10.7;
  if(AT(t,nb)){const pr=AT(t,p.prot??1.8+10.7), ey=AT(t,p.eyes??9.3+10.7);let sk='';const r=rng(61);
    for(let i=0;i<70;i++){const x=200+r()*1520, y=330+r()*520;sk+=`<circle cx="${x}" cy="${y}" r="${10+r()*22}" fill="${o9_OCD}" opacity=".6"/>`;}
    let pd='';if(pr){const r2=rng(71);for(let i=0;i<40;i++){const x=200+r2()*1520, y=330+r2()*520;pd+=`<circle cx="${x}" cy="${y}" r="${7+3*Math.sin(g*6+i)}" fill="${P.gold}" stroke="${INK}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="26" fill="url(#gGold)" opacity="${.5+.5*Math.sin(g*4+i)}"/>`;}}
    return `${o9_DEFS}${o9_bgSea(g,{floor:false})}<rect x="160" y="300" width="1600" height="580" rx="60" fill="${o9_OC}" stroke="${INK}" stroke-width="10"/>${sk}${pd}
     ${pr?[0,1,2,3].map(i=>`<path d="M${400+i*380} 220 L${360+i*380} 330 M${400+i*380} 220 L${440+i*380} 330" stroke="#FFF6B0" stroke-width="10" stroke-linecap="round" opacity="${.5+.5*Math.sin(g*4+i)}"/>`).join(''):''}
     ${pr&&!ey?labelPill(960,820,'LIGHT-SENSING PROTEINS IN THE SKIN',P.gold,40):''}
     ${T(960,140,ey?'SEEING WITHOUT EYES?':'NOBODY KNOWS FOR SURE',{size:90,fill:ey?P.gold:P.white,sc:pop(t,ey?p.eyes??20:.2)})}`;}
  const cb=AT(t,p.cb??1.7), on=AT(t,p.one??4.5), hw=AT(t,p.how??7.6);const bl=((g%3)>2.85)?1:0;
  return `${o9_DEFS}${card('cardDark',g)}<g transform="translate(470,500)"><circle r="250" fill="${o9_OC}" stroke="${INK}" stroke-width="10"/><ellipse rx="170" ry="${bl?10:140}" fill="#F7E9A8" stroke="${INK}" stroke-width="9"/>${bl?'':`<rect x="-110" y="-28" width="220" height="56" rx="28" fill="${INK}"/><circle cx="50" cy="-50" r="20" fill="#fff"/>`}</g>
   ${cb?`<g transform="translate(1180,480) scale(${pop(t,p.cb??1.7)})">${o9_reef(380,300,g)}${T(0,210,'YOU',{size:50,fill:P.white,stroke:9})}</g><g transform="translate(1600,480) scale(${pop(t,(p.cb??1.7)+.4)})"><g filter="url(#o9gray)">${o9_reef(380,300,g)}</g>${T(0,210,'OCTOPUS?',{size:50,fill:P.white,stroke:9})}</g>`:''}
   ${on?labelPill(470,850,'1 TYPE OF LIGHT SENSOR',P.ice,42):''}${hw?T(1390,840,'?',{size:150,fill:P.gold,sc:pop(t,p.how??7.6)}):''}
   ${T(960,130,hw?'SO HOW DO THEY MATCH COLOURS?':cb?'COLOURBLIND?':"HERE'S THE TWIST",{size:80,fill:hw?P.gold:P.white,sc:pop(t,hw?p.how??7.6:cb?p.cb??1.7:.2)})}`;
},
octGut(t,d,p,g){
  const nu=AT(t,p.num??6.3), oc=AT(t,p.oct??8.3), se=AT(t,p.second??11.9);const k=prog(t,.6,2.5);
  return `${o9_DEFS}${card('cardMint',g)}${se?`<circle cx="960" cy="${560}" r="${230+10*Math.sin(g*4)}" fill="url(#gGold)"/>`:''}${o9_body(960,560,.78,g,{gut:1,net:k})}
   ${nu?labelPill(420,560,'HUNDREDS OF MILLIONS',P.mint,40):''}
   ${oc?`${T(1300,580,'≈',{size:120,fill:P.white,sc:pop(t,p.oct??8.3)})}${o9_octo(1590,560,.42,g,{armDots:1,headDots:1})}${T(1590,830,'A WHOLE OCTOPUS',{size:40,fill:P.gold,stroke:8})}`:''}
   ${T(960,130,se?'YOUR SECOND BRAIN':'INSIDE YOUR GUT',{size:96,fill:se?P.gold:P.white,sc:pop(t,se?p.second??11.9:.2)})}`;
},
octGutSolo(t,d,p,g){
  const cu=AT(t,p.cut??5.3), up=AT(t,p.up??11.1), fl=AT(t,p.fly??14.6);const sn=cu&&!up?prog(t,p.cut??5.3,(p.cut??5.3)+.6):0;
  const title=fl?'BUTTERFLIES IN YOUR STOMACH':up?'SIGNALS UP TO YOUR BRAIN':cu?'NERVE CUT? GUT KEEPS GOING':'IT RUNS DIGESTION BY ITSELF';
  const at=fl?p.fly??14.6:up?p.up??11.1:cu?p.cut??5.3:.2;
  return `${o9_DEFS}${card('cardMint',g)}${o9_body(760,580,.78,g,{gut:1,net:.6,food:1,vagus:1,cut:cu&&!up?1:0,pulseUp:up?1:0,fly:fl?1:0})}
   ${cu&&!up?o9_scissors(760-36,580-125*.78,.8,Math.abs(Math.sin(g*6))*(1-sn)):''}
   ${!cu?labelPill(1400,520,'NO ORDERS NEEDED',P.mint,44):''}${cu&&!up?labelPill(1400,520,'STILL WORKING',P.mint,48):''}
   ${fl?`${o9_fly(1350,380,.9,g,P.gold)}${o9_fly(1600,560,.7,g+1,P.coral)}${o9_fly(1300,700,.6,g+2,P.violet)}`:''}
   ${up&&!fl?`<path d="M1300 700 V360" stroke="${P.gold}" stroke-width="16" stroke-linecap="round"/><path d="M1260 400 L1300 340 L1340 400" stroke="${P.gold}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`:''}
   ${T(960,130,title,{size:80,fill:fl?P.gold:P.white,sc:pop(t,at)})}`;
},
octSpine(t,d,p,g){
  const ht=p.hot??3, mind=p.mind??11.3, team=p.team??14.3;
  if(AT(t,mind)){const tm=AT(t,team);
    return `${o9_DEFS}${card('cardDark',g)}<circle cx="960" cy="${580-320*.78}" r="120" fill="url(#gGold)"/><circle cx="960" cy="${580+30*.78}" r="160" fill="url(#gMint)"/>${o9_body(960,580,.78,g,{gut:1,net:1,spine:1})}
     ${tm?`${labelPill(500,330,'BRAIN',P.gold,44)}${labelPill(500,560,'SPINAL CORD',P.gold,44)}${labelPill(1420,580,'GUT',P.mint,44)}`:''}
     ${T(960,130,tm?"YOU'RE A TEAM":'NOT ONE SINGLE MIND',{size:96,fill:tm?P.gold:P.white,sc:pop(t,tm?team:mind)})}`;}
  const ys=AT(t,ht+3.6);const hand=ys?[300,-60]:AT(t,ht)?[540,110]:[150,160];
  const s=.78, bx=720, by=580;const hx=bx+hand[0]*s, hy=by+hand[1]*s, sx=bx, sy=by-100*s;
  const k1=prog(t,ht+.8,ht+2.2), k2=prog(t,ht+2.2,ht+3.4);
  const dot=(k,a,b,c)=>k>0&&k<1?`<circle cx="${lerp(a[0],b[0],k)}" cy="${lerp(a[1],b[1],k)}" r="18" fill="${c}" stroke="${INK}" stroke-width="5"/><circle cx="${lerp(a[0],b[0],k)}" cy="${lerp(a[1],b[1],k)}" r="50" fill="url(#gGold)"/>`:'';
  const br=AT(t,p.brain??8.2);
  return `${o9_DEFS}${card('cardDark',g)}${stove(1260,720,.8,1,g)}${o9_body(bx,by,s,g,{spine:1,armR:hand,brainK:br?1:.35})}
   ${AT(t,ht)?`<path d="M${hx} ${hy} L${sx} ${sy}" stroke="${NERVE}" stroke-width="6" stroke-dasharray="14 10" opacity=".7"/>`:''}${dot(k1,[hx,hy],[sx,sy],NERVE)}${dot(k2,[sx,sy],[hx,hy],P.gold)}
   ${ys?T(1200,420,'YANK!',{size:110,fill:P.gold,sc:pop(t,ht+3.6)}):''}${br?bubble(1060,230,300,100,'OUCH?',{size:54,tail:'left'}):''}
   ${labelPill(380,700,'SPINAL CORD',P.gold,38)}
   ${T(960,130,ys?'YOUR SPINE ACTED FIRST':'IT THINKS TOO',{size:90,fill:ys?P.gold:P.white,sc:pop(t,ys?ht+3.6:.2)})}`;
},
octLife(t,d,p,g){
  const yr=AT(t,p.yr??2.7), go=AT(t,p.gone??12.1), im=AT(t,p.imagine??14.2);
  const I=[['puzzle','PUZZLES',p.puzzle??7.5],['jar','JARS',p.jar??9],['tank','ESCAPES',p.tank??10]];
  const op=go&&!im?.25:1;
  return `${o9_DEFS}${o9_bgSea(g)}${o9_octo(520,540,.8,g,{op,mouth:go&&!im?'frown':'smile',brain:im?1:0})}${im?icon('bulb',520,170,.9):''}
   ${yr?T(1340,330,'1–2 YEARS',{size:120,fill:P.coral,sc:pop(t,p.yr??2.7),op:go&&!im?.4:1}):''}
   ${I.map(([k,s,a],i)=>AT(t,a)?`<g opacity="${op}"><g transform="translate(${1080+i*270},620) scale(${pop(t,a)})">${o9_item(k,1,g)}</g>${T(1080+i*270,780,s,{size:40,fill:P.mint,stroke:8})}</g>`:'').join('')}
   ${T(960,130,im?'IF THEY LIVED AS LONG AS US...':go?'AND THEN THEY ARE GONE':'THE SAD PART',{size:80,fill:im?P.gold:P.white,sc:pop(t,im?p.imagine??14.2:go?p.gone??12.1:.2)})}`;
}
});
