// episode 017 scenes (STORY: what if you could rewind 60 seconds?)
const R17_DEFS=`<defs>
 <filter id="r17_mb1" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="6 1"/></filter>
 <filter id="r17_mb2" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="14 1"/></filter>
 <filter id="r17_mb3" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="24 2"/></filter>
 <filter id="r17_mb4" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="36 2"/></filter>
 <filter id="r17_grey"><feColorMatrix type="saturate" values="0.12"/></filter>
 <pattern id="r17_sl" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="3" fill="#000"/></pattern>
 <radialGradient id="r17_brass" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#FFE9A8"/><stop offset=".5" stop-color="#D9A441"/><stop offset="1" stop-color="#7A561C"/></radialGradient>
 <radialGradient id="r17_greyEdge" cx=".5" cy=".5" r=".72"><stop offset=".4" stop-color="#8a8a8a" stop-opacity="0"/><stop offset="1" stop-color="#9a9a9a" stop-opacity=".97"/></radialGradient>
 <linearGradient id="r17_storm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070A18"/><stop offset=".6" stop-color="#1C1F42"/><stop offset="1" stop-color="#3A2E5E"/></linearGradient>
 <radialGradient id="r17_faceGlow"><stop offset="0" stop-color="#FFE7A8" stop-opacity=".9"/><stop offset="1" stop-color="#FFE7A8" stop-opacity="0"/></radialGradient>
 <linearGradient id="r17_morning" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FB6F2"/><stop offset=".7" stop-color="#FFD7A0"/><stop offset="1" stop-color="#FFB37A"/></linearGradient>
 <linearGradient id="r17_kitch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A3550"/><stop offset="1" stop-color="#3A2238"/></linearGradient>
 <linearGradient id="r17_stoneIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1A30"/><stop offset="1" stop-color="#2E2846"/></linearGradient>
 <radialGradient id="r17_down" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#2B2550"/><stop offset="1" stop-color="#0A0918"/></radialGradient>
</defs>`;
const r17_BRASS='#D9A441', r17_STONE='#4A4368', r17_WOOD='#7A4E32';
const r17_fmt=s=>{s=Math.max(0,Math.ceil(s));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;};
const r17_rad=a=>a*Math.PI/180;

// ---------- HUD pieces ----------
function r17_arrow(x,y,r,col=P.mint,w=16,rot=0){ // counter-clockwise circular arrow (the rewind symbol)
  const p=a=>[r*Math.cos(r17_rad(a)),r*Math.sin(r17_rad(a))];
  const [sx,sy]=p(-115),[ex,ey]=p(-65); const dx=Math.sin(r17_rad(-65)), dy=-Math.cos(r17_rad(-65));
  const nx=Math.cos(r17_rad(-65)), ny=Math.sin(r17_rad(-65));
  const tip=[ex+dx*30,ey+dy*30], b1=[ex+nx*26-dx*6,ey+ny*26-dy*6], b2=[ex-nx*26-dx*6,ey-ny*26-dy*6];
  const d=`M${sx.toFixed(1)} ${sy.toFixed(1)} A${r} ${r} 0 1 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(-1,1)"><path d="${d}" stroke="${INK}" stroke-width="${w+12}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>
   <path d="M${tip[0]} ${tip[1]} L${b1[0]} ${b1[1]} L${b2[0]} ${b2[1]}Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`;
}
function r17_hud(x,y,s,g,o={}){ const {col=P.mint,spin=0,sec='60s',secCol=null}=o;
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-470" y="-105" width="940" height="210" rx="30" fill="#06121A" fill-opacity=".88" stroke="${col}" stroke-width="9"/>
   <text x="-430" y="38" font-size="112" font-weight="900" fill="#fff" letter-spacing="2">REWIND</text>
   ${r17_arrow(125,0,58,col,15,-spin)}
   <text x="215" y="38" font-size="104" font-weight="900" fill="${secCol||col}">${sec}</text></g>`;
}
function r17_timer(x,y,secs,g,o={}){ const {label='NEXT JUMP',col=P.red,s=1,stopped=false}=o; const urg=!stopped&&secs<10;
  const fl=urg?(.55+.45*Math.abs(Math.sin(g*7))):1;
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-175" y="-82" width="350" height="164" rx="20" fill="#0B0814" fill-opacity=".9" stroke="${stopped?P.steel:col}" stroke-width="8"/>
   <text y="-38" text-anchor="middle" font-size="32" font-weight="900" fill="${stopped?P.steel:col}" letter-spacing="3">${label}</text>
   <text y="50" text-anchor="middle" font-size="92" font-weight="900" fill="${stopped?P.steel:col}" opacity="${fl}" letter-spacing="4">${stopped?'STOP':r17_fmt(secs)}</text></g>`;
}
function r17_left(x,y,n,g,o={}){ const {max=4,s=1,flash=0}=o; let pips='';
  for(let i=0;i<max;i++){const on=i<n; pips+=`<g transform="translate(${-((max-1)*62)/2+i*62},40)">${on?`<circle r="27" fill="${P.gold}" stroke="${INK}" stroke-width="6"/>`:`<circle r="27" fill="#2A2440" stroke="#5D587A" stroke-width="6"/>`}${r17_arrow(0,0,13,on?INK:'#5D587A',5)}</g>`;}
  return `<g transform="translate(${x},${y}) scale(${s*(1+.25*flash)})"><rect x="-170" y="-70" width="340" height="160" rx="20" fill="#0B0814" fill-opacity=".9" stroke="${n<=1?P.red:P.gold}" stroke-width="8"/>
   <text y="-22" text-anchor="middle" font-size="31" font-weight="900" fill="${n<=1?P.red:P.gold}" letter-spacing="2">REWINDS LEFT: ${n}</text>${pips}</g>`;
}
function r17_notches(x,y,n,g,o={}){ const {s=1}=o; let pips='';
  for(let i=0;i<3;i++) pips+=`<path d="M${-70+i*70} 20 v44" stroke="${i<n?P.red:'#5D587A'}" stroke-width="18" stroke-linecap="round"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-170" y="-70" width="340" height="160" rx="20" fill="#0B0814" fill-opacity=".9" stroke="${P.red}" stroke-width="8"/>
   <text y="-20" text-anchor="middle" font-size="31" font-weight="900" fill="${P.red}" letter-spacing="2">NOTCHES LEFT: ${n}</text>${pips}</g>`;
}
function r17_vhs(k,g){ if(k<=0) return ''; const band=((g*700)%1400)-200;
  const tri=(x)=>`<path d="M${x} 0 L${x+44} -30 V30Z" fill="#fff"/>`;
  return `<rect width="1920" height="1080" fill="url(#r17_sl)" opacity="${.45*k}"/><rect width="1920" height="1080" fill="${P.mint}" opacity="${.07*k}"/>
   <rect y="${band}" width="1920" height="46" fill="#fff" opacity="${.13*k}"/><rect y="${band+60}" width="1920" height="7" fill="#fff" opacity="${.25*k}"/>
   <g opacity="${k*(Math.sin(g*10)>-.3?1:.25)}" transform="translate(90,100)"><g transform="translate(0,0)">${tri(44)}${tri(0)}</g><text x="110" y="22" font-size="62" font-weight="900" fill="#fff">REW</text></g>`;
}
// rewind look: horizontal smear + ghost copy + scanlines + HUD
function r17_rewWrap(inner,k,g,o={}){ if(k<=.001) return inner; const lv=Math.min(4,Math.max(1,Math.round(k*4)));
  return `<g filter="url(#r17_mb${lv})">${inner}</g><g opacity="${.3*k}" transform="translate(${-110*k},0)">${inner}</g>${r17_vhs(k,g)}
   ${o.hud===false?'':r17_hud(960,o.hy??470,.95*clamp(k*1.6),g,{spin:g*500})}`;
}
// rewind envelope: 1 during [a, a+dur], ramps .15 s
const r17_rk=(t,a,dur=1.1)=>a==null?0:clamp(Math.min((t-a)/.15,(a+dur-t)/.2));
// big PLUS: / MINUS: label that pops, then flies to the top-left corner
function r17_pm(t,kind,title,o={}){ const plus=kind==='plus', col=plus?P.mint:P.red; const fly=o.fly??1.9;
  const k=eout(prog(t,fly,fly+.5)); const x=lerp(960,240,k), y=lerp(520,120,k), sc=lerp(1,.36,k)*pop(t,.02,.4);
  return `<rect width="1920" height="1080" fill="#05040C" opacity="${.62*(1-k)}"/>
   <g transform="translate(${x},${y}) scale(${sc})">${T(0,60,plus?'PLUS:':'MINUS:',{size:300,fill:col,stroke:60})}</g>
   ${k<1?T(960,760,title,{size:110,fill:'#fff',op:1-k,sc:pop(t,.3,.4)}):`<g transform="translate(${470+title.length*16},108)">${T(0,0,title,{size:52,fill:'#fff',anchor:'middle',stroke:12})}</g>`}`;
}
// ---------- props ----------
function r17_gear(x,y,r,n,rot,col=r17_BRASS){ let d='';
  for(let i=0;i<n;i++){const A=k=>(i+k)/n*2*Math.PI, ri=r*.82;
    d+=`${i?'L':'M'}${(ri*Math.cos(A(0))).toFixed(1)} ${(ri*Math.sin(A(0))).toFixed(1)} L${(r*Math.cos(A(.2))).toFixed(1)} ${(r*Math.sin(A(.2))).toFixed(1)} L${(r*Math.cos(A(.5))).toFixed(1)} ${(r*Math.sin(A(.5))).toFixed(1)} L${(ri*Math.cos(A(.7))).toFixed(1)} ${(ri*Math.sin(A(.7))).toFixed(1)} `;}
  return `<g transform="translate(${x},${y}) rotate(${rot})"><path d="${d}Z" fill="${col}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
   <circle r="${r*.6}" fill="none" stroke="#8A6424" stroke-width="${r*.09}"/><path d="M${-r*.6} 0 H${r*.6} M0 ${-r*.6} V${r*.6}" stroke="#8A6424" stroke-width="${r*.1}"/>
   <circle r="${r*.15}" fill="#5A3E14" stroke="${INK}" stroke-width="6"/></g>`;
}
function r17_pend(x,y,L,a,rb=60,o={}){ const {rod='#B8862E',glow=0}=o;
  return `<g transform="translate(${x},${y}) rotate(${a})">${glow?`<circle cy="${L}" r="${rb*2.6}" fill="url(#gGold)" opacity="${glow}"/>`:''}<rect x="-10" y="0" width="20" height="${L}" rx="6" fill="${rod}" stroke="${INK}" stroke-width="6"/>
   <circle cy="${L}" r="${rb}" fill="url(#r17_brass)" stroke="${INK}" stroke-width="9"/><circle cx="${-rb*.34}" cy="${L-rb*.36}" r="${rb*.22}" fill="#fff" opacity=".5"/><circle r="16" fill="${INK}"/></g>`;
}
function r17_rain(g,op=1,dir=1,n=80,seed=23){const r=rng(seed);let s='';
  for(let i=0;i<n;i++){const x=r()*2100-100,sp=1100+r()*600,l=34+r()*40;const y=(((r()*1300+dir*g*sp)%1300)+1300)%1300-160;
    s+=`<path d="M${x.toFixed(0)} ${y.toFixed(0)} l-10 ${l.toFixed(0)}" stroke="#A9D8FF" stroke-width="4" stroke-linecap="round" opacity="${(op*(.35+r()*.4)).toFixed(2)}"/>`;}
  return s;}
function r17_bolt(x,y,s,op=1){return `<g transform="translate(${x},${y}) scale(${s})" opacity="${op}"><path d="M0 0 L-40 150 L10 140 L-50 320 L80 110 L20 120 L60 0Z" fill="#FFF8D0" stroke="#fff" stroke-width="8" stroke-linejoin="round"/><circle cx="0" cy="150" r="220" fill="url(#gWhite)" opacity=".5"/></g>`;}
function r17_clouds(g,op=1){let s='';[[200,120,1.3],[760,70,1],[1300,140,1.4],[1800,90,1.1]].forEach(([x,y,k],i)=>{const xx=x+Math.sin(g*.2+i)*30;
  s+=`<g transform="translate(${xx},${y}) scale(${k})" opacity="${op}"><ellipse rx="210" ry="70" fill="#2A2C52"/><ellipse cx="-90" cy="-40" rx="110" ry="70" fill="#2A2C52"/><ellipse cx="80" cy="-50" rx="120" ry="80" fill="#30325C"/></g>`;});return s;}
function r17_bgStorm(g,o={}){const {flash=0,rain=1,city=1,dir=1}=o; const r=rng(31); let st='';
  for(let i=0;i<50;i++) st+=`<circle cx="${r()*1920}" cy="${r()*500}" r="${1+r()*2}" fill="#fff" opacity="${.25+.3*Math.abs(Math.sin(g+i))}"/>`;
  return `<rect width="1920" height="1080" fill="url(#r17_storm)"/>${st}${r17_clouds(g)}
   ${city?`${TK_r17sky(g)}`:''}${rain?r17_rain(g,rain,dir):''}<rect width="1920" height="1080" fill="#E8F0FF" opacity="${flash*.55}"/>`;
}
function TK_r17sky(g){const r=rng(5);let s='',x=-40;while(x<1960){const w=50+r()*90,h=60+r()*170;s+=`<rect x="${x}" y="${1080-h}" width="${w}" height="${h}" fill="#151230"/>`;
  for(let k=0;k<4;k++) if(r()>.3) s+=`<rect x="${x+6+r()*(w-16)}" y="${1080-h+10+r()*(h-20)}" width="6" height="7" fill="${P.gold}" opacity="${.5+.4*Math.sin(g*2+k+x)}"/>`; x+=w+6;}return s;}
function r17_clockPt(cx,cy,R,ma,f){const a=r17_rad(ma);return [cx+R*f*Math.sin(a),cy-R*f*Math.cos(a)];}
function r17_face(cx,cy,R,ma,ha,o={}){ const {glow=1,back=false}=o; let tk='';
  for(let i=0;i<60;i++){const big=i%5===0;tk+=`<path d="M0 ${-R+16} V${-R+(big?50:30)}" stroke="${INK}" stroke-width="${big?10:4}" transform="rotate(${i*6})"/>`;}
  const nums=[['XII',0],['III',90],['VI',180],['IX',270]].map(([s,a])=>{const [x,y]=[Math.sin(r17_rad(a))*R*.7,-Math.cos(r17_rad(a))*R*.7];return `<text x="${x}" y="${y+R*.07}" text-anchor="middle" font-size="${R*.19}" font-weight="900" fill="${INK}" font-family="Georgia,serif">${s}</text>`;}).join('');
  const L=R*.92;
  return `<g transform="translate(${cx},${cy})"><circle r="${R*1.7}" fill="url(#r17_faceGlow)" opacity="${.55*glow}"/>
   <circle r="${R+34}" fill="#2B2546" stroke="${INK}" stroke-width="10"/><circle r="${R+34}" fill="none" stroke="${r17_BRASS}" stroke-width="8" opacity=".7"/>
   <circle r="${R}" fill="${back?'#E8D7AA':'#FFF2D2'}" opacity="${back?.55:1}" stroke="${INK}" stroke-width="9"/>${back?'':tk+nums}
   <path d="M-13 24 L-9 ${-R*.5} L0 ${-R*.58} L9 ${-R*.5} L13 24Z" fill="#1A1626" stroke="${INK}" stroke-width="5" transform="rotate(${ha})"/>
   <g transform="rotate(${ma})"><path d="M-12 34 L-8 ${-L+30} L0 ${-L} L8 ${-L+30} L12 34Z" fill="#26213A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-4 20 V${-L+40}" stroke="#5D587A" stroke-width="4"/></g>
   <circle r="${R*.07}" fill="${r17_BRASS}" stroke="${INK}" stroke-width="6"/></g>`;
}
function r17_tower(cx,cy,R,g,o={}){ const {ma=96,ha=7,hatch=null,top=true}=o; const W=R*1.38, y0=cy-R*1.55;
  let st=''; for(let y=y0+40,row=0;y<1100;y+=64,row++){st+=`<path d="M${cx-W} ${y} H${cx+W}" stroke="#3A3456" stroke-width="5"/>`;for(let x=cx-W+(row%2?60:0);x<cx+W;x+=130) st+=`<path d="M${x} ${y} V${y+64}" stroke="#3A3456" stroke-width="5"/>`;}
  return `${top?`<path d="M${cx-W-30} ${y0} L${cx} ${y0-R*1.1} L${cx+W+30} ${y0}Z" fill="#2E2A48" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>
   <path d="M${cx} ${y0-R*1.1} V${y0-R*1.1-90}" stroke="${INK}" stroke-width="10"/><circle cx="${cx}" cy="${y0-R*1.1-96}" r="14" fill="${r17_BRASS}" stroke="${INK}" stroke-width="5"/>`:''}
   <rect x="${cx-W}" y="${y0}" width="${W*2}" height="1400" fill="${r17_STONE}" stroke="${INK}" stroke-width="10"/>${st}
   <rect x="${cx-W-24}" y="${y0-6}" width="${W*2+48}" height="40" fill="#5A5280" stroke="${INK}" stroke-width="8"/>
   ${hatch?`<g transform="translate(${hatch[0]},${hatch[1]})"><path d="M-62 60 V-30 Q-62 -80 0 -80 Q62 -80 62 -30 V60Z" fill="#FFC86B" stroke="${INK}" stroke-width="9"/><path d="M-50 60 V-26 Q-50 -66 0 -66 Q50 -66 50 -26 V60Z" fill="#3A2A20" opacity=".25"/><rect x="-80" y="56" width="160" height="22" rx="6" fill="#5A5280" stroke="${INK}" stroke-width="6"/></g>`:''}
   ${r17_face(cx,cy,R,ma,ha)}`;
}
function r17_kaiHang(cx,cy,R,ma,f,s,g,o={}){ const [px,py]=r17_clockPt(cx,cy,R,ma,f); const rot=(ma-90)*.35+Math.sin(g*1.7)*3+(o.rot||0); const r=r17_rad(rot);
  return person({x:px-70*s*Math.sin(r),y:py+70*s*Math.cos(r)-4*s,s,t:g,who:'kai',pose:'up',mouth:o.mouth||'o',brows:o.brows||'sad',legs:'walk',rot,sweat:1,look:o.look||0});
}
function r17_rope(pts,k=1,col='#E8C98A'){ // pts: bezier [x0,y0,cx,cy,x1,y1], k = how much drawn
  const [x0,y0,c1,c2,x1,y1]=pts; let d=''; const n=28;
  for(let i=0;i<=n;i++){const u=i/n*k, a=(1-u)*(1-u), b=2*(1-u)*u, c=u*u; d+=`${i?'L':'M'}${(a*x0+b*c1+c*x1).toFixed(1)} ${(a*y0+b*c2+c*y1).toFixed(1)}`;}
  return `<path d="${d}" stroke="${INK}" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${col}" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="14 8"/>`;
}
function r17_coil(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})">${[0,1,2].map(i=>`<ellipse cy="${-i*14}" rx="${70-i*6}" ry="${24-i*2}" fill="none" stroke="${INK}" stroke-width="20"/><ellipse cy="${-i*14}" rx="${70-i*6}" ry="${24-i*2}" fill="none" stroke="#E8C98A" stroke-width="10"/>`).join('')}</g>`;}
function r17_wind(g,op=1,y0=200,h=500){let s='';for(let i=0;i<9;i++){const x=((g*900+i*260)%2300)-250,y=y0+(i*97)%h;s+=`<path d="M${x} ${y} q80 -30 160 0 t160 0" stroke="#CFE6FF" stroke-width="8" fill="none" stroke-linecap="round" opacity="${op*.6}"/>`;}return s;}
function r17_bgTowerIn(g,o={}){const {flash=0,win=true}=o; let st='';
  for(let y=40,row=0;y<820;y+=80,row++){st+=`<path d="M0 ${y} H1920" stroke="#151225" stroke-width="5"/>`;for(let x=(row%2?90:0);x<1920;x+=180) st+=`<path d="M${x} ${y} V${y+80}" stroke="#151225" stroke-width="5"/>`;}
  return `<rect width="1920" height="1080" fill="url(#r17_stoneIn)"/>${st}
   ${win?`<g transform="translate(1600,300)"><path d="M-130 200 V-60 Q-130 -190 0 -190 Q130 -190 130 -60 V200Z" fill="#0A0D20" stroke="${INK}" stroke-width="12"/><g opacity=".8">${r17_rain(g,.8,1,10,7).replace(/M(-?\d+) /g,(m,x)=>m)}</g><path d="M0 -190 V200 M-130 40 H130" stroke="#2A2440" stroke-width="12"/><rect x="-130" y="-190" width="260" height="390" fill="#DDE8FF" opacity="${flash}"/></g>`:''}
   <rect y="0" width="1920" height="60" fill="#3A2A20" stroke="${INK}" stroke-width="8"/><path d="M200 60 V0 M760 60 V0 M1320 60 V0" stroke="${INK}" stroke-width="6"/>
   <rect y="820" width="1920" height="260" fill="#2A1E18"/>${[0,1,2,3,4,5,6,7,8,9].map(i=>`<path d="M${i*200} 820 V1080" stroke="#1C140F" stroke-width="5"/>`).join('')}<path d="M0 820 H1920" stroke="${INK}" stroke-width="8"/>
   <rect width="1920" height="1080" fill="#DDE8FF" opacity="${flash*.35}"/>`;
}
function r17_bgKitchen(g,o={}){const {morning=false}=o;
  return `<rect width="1920" height="1080" fill="url(#r17_kitch)"/>
   ${[...Array(14)].map((_,i)=>`<path d="M${i*150} 520 V760" stroke="#6A4560" stroke-width="4"/>`).join('')}<path d="M0 520 H1920 M0 600 H1920 M0 680 H1920" stroke="#6A4560" stroke-width="4"/>
   <g transform="translate(1500,250)"><rect x="-210" y="-160" width="420" height="320" rx="10" fill="${morning?'#9BD0FF':'#0B1026'}" stroke="${INK}" stroke-width="12"/><path d="M0 -160 V160 M-210 0 H210" stroke="#7A5A3A" stroke-width="12"/>${morning?'':`<circle cx="120" cy="-90" r="30" fill="#fff4dc"/>`}</g>
   <rect x="160" y="230" width="520" height="24" fill="${r17_WOOD}" stroke="${INK}" stroke-width="6"/>${[0,1,2,3].map(i=>`<ellipse cx="${230+i*120}" cy="200" rx="46" ry="34" fill="#F4F6FA" stroke="${INK}" stroke-width="6"/><ellipse cx="${230+i*120}" cy="200" rx="28" ry="20" fill="none" stroke="#7CC4FF" stroke-width="5"/>`).join('')}
   <path d="M960 0 V110" stroke="${INK}" stroke-width="6"/><path d="M900 110 H1020 L990 150 H930Z" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><ellipse cx="960" cy="190" rx="300" ry="90" fill="url(#gGold)" opacity=".35"/>
   <rect y="760" width="1920" height="320" fill="#8A5A3A"/><rect y="760" width="1920" height="30" fill="#A9744F" stroke="${INK}" stroke-width="6"/>`;
}
function r17_plate(x,y,s=1,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><ellipse rx="80" ry="30" fill="#F7F9FC" stroke="${INK}" stroke-width="7"/><ellipse rx="52" ry="18" fill="none" stroke="#5AA6E8" stroke-width="5"/><path d="M-70 -6 q10 -14 40 -18" stroke="#fff" stroke-width="5" fill="none"/></g>`;}
function r17_shards(x,y,k,s=1){let o='';const r=rng(77);for(let i=0;i<9;i++){const a=r()*Math.PI-Math.PI,d=(60+r()*160)*k;o+=`<path d="M0 0 l${18+r()*20} ${-6-r()*10} l${-6+r()*10} ${16+r()*10}Z" fill="#F7F9FC" stroke="${INK}" stroke-width="4" transform="translate(${x+Math.cos(a)*d*1.6} ${y+Math.sin(a)*d*.35*s+ (k>0?0:0)}) rotate(${r()*360})"/>`;}return o;}
function r17_ball(x,y,n,col,r=34){return `<g transform="translate(${x},${y})"><circle r="${r}" fill="${col}" stroke="${INK}" stroke-width="6"/><circle r="${r*.6}" fill="#fff"/><text y="${r*.24}" text-anchor="middle" font-size="${r*.66}" font-weight="900" fill="${INK}">${n}</text></g>`;}
const r17_BC=['#FF5E5B','#FFC83D','#3DF5C2','#7CC4FF','#B47CFF','#FF8FA3'];
function r17_lotto(x,y,s,g,o={}){const {spin=1,seed=3}=o; const r=rng(seed); let b='';
  for(let i=0;i<14;i++){const ph=r()*6.28,fr=1+r()*2.2,fr2=1.3+r()*2; const bx=Math.sin(g*fr*spin+ph)*120, by=Math.cos(g*fr2*spin+ph*1.7)*110; b+=`<circle cx="${bx}" cy="${by}" r="26" fill="${r17_BC[i%6]}" stroke="${INK}" stroke-width="5"/><circle cx="${bx}" cy="${by}" r="13" fill="#fff"/>`;}
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-40" y="170" width="80" height="140" fill="#9AA7BD" stroke="${INK}" stroke-width="8"/><rect x="-170" y="300" width="340" height="40" rx="12" fill="#5D6A82" stroke="${INK}" stroke-width="8"/>
   <circle r="190" fill="#BFEFFF" opacity=".18"/>${b}<circle r="190" fill="none" stroke="${INK}" stroke-width="10"/><circle r="190" fill="none" stroke="#DFF6FF" stroke-width="4" opacity=".7"/><path d="M-120 -120 a170 170 0 0 1 70 -46" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity=".7"/></g>`;
}
function r17_drawRow(x,y,nums,t,a,o={}){const {s=1,cross=false}=o; let r='';nums.forEach((n,i)=>{const k=pop(t,a+i*.18);if(k>0) r+=`<g transform="translate(${x+(i-(nums.length-1)/2)*96*s},${y}) scale(${k*s})">${r17_ball(0,0,n,r17_BC[(n*7)%6],40)}</g>`;});
  return r+(cross?`<path d="M${x-300*s} ${y-40} L${x+300*s} ${y+40}" stroke="${P.red}" stroke-width="16" stroke-linecap="round" opacity=".9"/>`:'');}
function r17_butterfly(x,y,s,g){const f=.25+.75*Math.abs(Math.sin(g*9));
  return `<g transform="translate(${x},${y}) scale(${s})"><g transform="scale(${f},1)"><path d="M0 0 C-60 -110 -170 -90 -150 -20 C-140 20 -60 20 0 0Z M0 0 C60 -110 170 -90 150 -20 C140 20 60 20 0 0Z" fill="#FF9F43" stroke="${INK}" stroke-width="8"/><path d="M0 0 C-50 70 -130 90 -110 30 Z M0 0 C50 70 130 90 110 30Z" fill="#FFC83D" stroke="${INK}" stroke-width="8"/><circle cx="-90" cy="-50" r="16" fill="#fff" opacity=".8"/><circle cx="90" cy="-50" r="16" fill="#fff" opacity=".8"/></g>
   <rect x="-8" y="-50" width="16" height="100" rx="8" fill="${INK}"/><path d="M-4 -50 q-20 -40 -40 -44 M4 -50 q20 -40 40 -44" stroke="${INK}" stroke-width="5" fill="none"/></g>`;}
function r17_tornado(x,y,s,g,k=1){let o='';for(let i=0;i<9;i++){const w=(40+i*28)*k,yy=-i*52, sw=Math.sin(g*3+i*.7)*20*k;o+=`<ellipse cx="${sw}" cy="${yy}" rx="${w}" ry="${18+i*3}" fill="#8E9AB0" stroke="${INK}" stroke-width="6" opacity=".95"/>`;}
  return `<g transform="translate(${x},${y}) scale(${s})">${o}</g>`;}
function r17_computer(x,y,s,g){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-200" y="-260" width="400" height="520" rx="14" fill="#C9C2B0" stroke="${INK}" stroke-width="9"/>
   ${[-1,1].map(i=>`<g transform="translate(${i*90},-150)"><circle r="68" fill="#2A2440" stroke="${INK}" stroke-width="7"/><g transform="rotate(${g*120*i})"><circle r="20" fill="#9AA7BD"/><path d="M0 -60 V60 M-60 0 H60" stroke="#5D587A" stroke-width="10"/></g></g>`).join('')}
   <rect x="-160" y="-40" width="320" height="110" rx="8" fill="#2A2440" stroke="${INK}" stroke-width="6"/>${[...Array(12)].map((_,i)=>`<circle cx="${-130+(i%6)*52}" cy="${-10+Math.floor(i/6)*50}" r="11" fill="${Math.sin(g*5+i*1.7)>0?P.red:P.gold}"/>`).join('')}
   <rect x="-160" y="110" width="320" height="110" rx="8" fill="#A39C8A" stroke="${INK}" stroke-width="6"/></g>`;}
function r17_cake(x,y,s,g,ice=1){return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="10" rx="170" ry="26" fill="#E8EEF5" stroke="${INK}" stroke-width="6"/><rect x="-130" y="-120" width="260" height="130" rx="18" fill="#B5793F" stroke="${INK}" stroke-width="7"/>
   <path d="M-130 -120 H${-130+260*ice} V-80 Q${-130+260*ice-20} -60 ${-130+260*ice-40} -84 Q-60 -50 -90 -80 Q-110 -50 -130 -80Z" fill="#FFB6D0" stroke="${INK}" stroke-width="6"/>
   ${[-60,0,60].map((cx,i)=>`<rect x="${cx-8}" y="-180" width="16" height="60" fill="${r17_BC[i]}" stroke="${INK}" stroke-width="4"/><path d="M${cx} -186 q-10 -18 0 -30 q10 12 0 30Z" fill="${P.gold}" opacity="${.6+.4*Math.sin(g*9+i)}"/>`).join('')}</g>`;}
function r17_slot(x,y,w,h,label,o={}){const {col=P.mint,op=1,check=0,num=''}=o;
  return `<g transform="translate(${x},${y})" opacity="${op}"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="20" fill="#0E1A2A" stroke="${col}" stroke-width="8"/>
   ${num?`<text x="${-w/2+30}" y="${h*.16}" font-size="${h*.4}" font-weight="900" fill="${col}">${num}</text>`:''}
   ${label?`<text x="${num?-w/2+90:0}" y="${h*.15}" text-anchor="${num?'start':'middle'}" font-size="${h*.36}" font-weight="900" fill="#fff">${label}</text>`:''}
   ${check?icon('check',w/2-14,-h/2+14,.45*check):''}</g>`;}
function r17_ghost(x,y,s,inner,g,i=0){const bob=Math.sin(g*1.6+i)*12;return `<g transform="translate(${x},${y+bob}) scale(${s})" opacity=".8"><circle r="120" fill="#C9D6FF" opacity=".18" stroke="#C9D6FF" stroke-width="6" stroke-dasharray="14 10"/><g opacity=".75">${inner}</g></g>`;}
// double pendulum (m=l=1), RK4, cached per start state
const r17_DP={};
function r17_dpd(s){const [a1,a2,w1,w2]=s,G=9.81,d=a1-a2,den=3-Math.cos(2*d);
  return [w1,w2,(-G*3*Math.sin(a1)-G*Math.sin(a1-2*a2)-2*Math.sin(d)*(w2*w2+w1*w1*Math.cos(d)))/den,(2*Math.sin(d)*(w1*w1*2+G*2*Math.cos(a1)+w2*w2*Math.cos(d)))/den];}
function r17_dp(key,a1,a2,t){let c=r17_DP[key]; if(!c) c=r17_DP[key]=[[a1,a2,0,0]]; const n=Math.max(0,Math.floor(t*200));
  while(c.length<=n){const s=c[c.length-1],h=1/200,k1=r17_dpd(s),k2=r17_dpd(s.map((v,i)=>v+h/2*k1[i])),k3=r17_dpd(s.map((v,i)=>v+h/2*k2[i])),k4=r17_dpd(s.map((v,i)=>v+h*k3[i]));c.push(s.map((v,i)=>v+h/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i])));}
  return c[n];}
function r17_dpDraw(x,y,L,key,a1,a2,t,col){const st=r17_dp(key,a1,a2,t), p=s=>{const x1=x+L*Math.sin(s[0]),y1=y+L*Math.cos(s[0]);return [x1,y1,x1+L*Math.sin(s[1]),y1+L*Math.cos(s[1])];};
  const [x1,y1,x2,y2]=p(st); let tr='';for(let i=0;i<=40;i++){const tt=t-i*.03;if(tt<0)break;const q=p(r17_dp(key,a1,a2,tt));tr+=`${i?'L':'M'}${q[2].toFixed(1)} ${q[3].toFixed(1)}`;}
  return `<path d="${tr}" stroke="${col}" stroke-width="8" fill="none" opacity=".55" stroke-linecap="round" stroke-linejoin="round"/>
   <path d="M${x} ${y} L${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${x} ${y} L${x1} ${y1} L${x2} ${y2}" stroke="${col}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
   <circle cx="${x1}" cy="${y1}" r="26" fill="${col}" stroke="${INK}" stroke-width="7"/><circle cx="${x2}" cy="${y2}" r="34" fill="${col}" stroke="${INK}" stroke-width="7"/><circle cx="${x}" cy="${y}" r="14" fill="${INK}"/>`;}
function r17_banner(x,y,w,str,g,o={}){const {fold=0,s=1}=o;const wv=Math.sin(g*2)*8;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M${-w/2} 0 Q0 ${wv} ${w/2} 0 L${w/2} 130 Q0 ${130+wv} ${-w/2} 130Z" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/>
   <text y="88" text-anchor="middle" font-size="72" font-weight="900" fill="${P.red}" letter-spacing="2">${str}</text>
   ${fold>0?`<path d="M${-w*.18} -6 L${w*.2} -6 L${w*.24} 136 L${-w*.14} 136Z" fill="#E9DCC6" stroke="${INK}" stroke-width="7" opacity="${fold}"/>`:''}</g>`;}
const r17_glow=(x,y,r,col='url(#gGold)',op=.6)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity="${op}"/>`;

Object.assign(SHOTS,{
// ---------------- COLD OPEN ----------------
rwHook(t,d,p,g){
  const jump=p.jump??11.3, below=p.below??19.6, afraid=p.afraid??23.3;
  const tm=t<jump?jump-t:60-(t-jump); const timer=r17_timer(1660,160,tm,g);
  if(t<below){
    const wob=t>jump?Math.sin((t-jump)*14)*4*Math.exp(-(t-jump)*2.5):0;
    const ma=96+6*eout(prog(t,jump,jump+.2))+wob;
    const f=lerp(.80,.86,eout(prog(t,jump,jump+.6)))+.05*eout(prog(t,p.soon??16.4,(p.soon??16.4)+2.5));
    const cx=760,cy=360,R=240; const [kx,ky]=r17_clockPt(cx,cy,R*.92,ma,f);
    const m40=AT(t,p.m40??2.7), steep=AT(t,p.steep??13.4);
    const shake=t>jump&&t<jump+.4?Math.sin(t*90)*8:0;
    return `${R17_DEFS}<g transform="translate(${shake},0)">${r17_bgStorm(g,{flash:t<.25?1-t*4:0})}${r17_tower(cx,cy,R,g,{ma})}
     ${r17_kaiHang(cx,cy,R*.92,ma,f,.62,g)}
     ${m40?`<g opacity="${prog(t,p.m40??2.7,(p.m40??2.7)+.4)}"><path d="M${kx+150} ${ky+260} V880" stroke="#fff" stroke-width="6" stroke-dasharray="16 12"/><path d="M${kx+130} 860 L${kx+150} 890 L${kx+170} 860" stroke="#fff" stroke-width="6" fill="none"/>${T(kx+300,ky+420,'40 M',{size:96,fill:P.gold,sc:pop(t,p.m40??2.7)})}${T(kx+300,ky+480,'STRAIGHT DOWN',{size:36,fill:'#fff',stroke:8})}</g>`:''}
     ${AT(t,jump)?T(cx+40,cy+R+110,'CLUNK!',{size:84,fill:P.gold,sc:pop(t,jump),op:1-prog(t,jump+1.6,jump+2.2)}):''}
     ${steep?`<g transform="translate(${cx},${cy})"><path d="M120 0 H${R*.95}" stroke="#fff" stroke-width="5" stroke-dasharray="12 10"/><path d="M${R*.55} 0 A${R*.55} ${R*.55} 0 0 1 ${R*.55*Math.cos(r17_rad(ma-90))} ${R*.55*Math.sin(r17_rad(ma-90))}" stroke="${P.red}" stroke-width="8" fill="none"/></g>${T(cx+R+40,cy-R-40,'STEEPER',{size:64,fill:P.red,sc:pop(t,p.steep??13.4)})}`:''}
     ${AT(t,p.soon??16.4)?`<path d="M${kx-20} ${ky-70} h120" stroke="${P.red}" stroke-width="14" stroke-linecap="round"/><path d="M${kx+90} ${ky-90} l34 20 l-34 20" fill="none" stroke="${P.red}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`:''}
     </g>${timer}`;
  }
  if(t<afraid){ // looking straight down past Kai's shoes
    const r=rng(9); let dots='', streets='';
    for(let i=0;i<14;i++){const a=i/14*6.283; streets+=`<path d="M960 600 L${960+Math.cos(a)*1400} ${600+Math.sin(a)*1400}" stroke="#2A2650" stroke-width="10"/>`;}
    for(let i=0;i<260;i++){const a=r()*6.283,dd=40+r()*700; dots+=`<circle cx="${960+Math.cos(a)*dd*1.3}" cy="${600+Math.sin(a)*dd*.8}" r="${2+r()*3}" fill="${r()>.5?P.gold:'#FFE9B0'}" opacity="${.5+.5*Math.abs(Math.sin(g*2+i))}"/>`;}
    const sw=Math.sin(g*1.3)*16;
    const leg=(x)=>`<path d="M${x} -20 L${x+sw} 260" stroke="${INK}" stroke-width="44" stroke-linecap="round"/><path d="M${x} -20 L${x+sw} 260" stroke="#3B4A78" stroke-width="30" stroke-linecap="round"/><ellipse cx="${x+sw}" cy="290" rx="58" ry="40" fill="#fff" stroke="${INK}" stroke-width="8"/><path d="M${x+sw-40} 300 h80" stroke="${P.red}" stroke-width="10"/>`;
    return `${R17_DEFS}<rect width="1920" height="1080" fill="url(#r17_down)"/>${streets}${dots}<circle cx="960" cy="600" r="560" fill="#000" opacity=".15"/>
     <g opacity=".7">${r17_rain(g,.5,1,40,11)}</g>${leg(880)}${leg(1040)}
     ${T(960,840,'STREET LIGHTS = GRAINS OF SUGAR',{size:54,fill:P.gold,sc:IN(t-below,.5)})}${T(960,770,'40 M',{size:80,fill:'#fff',sc:IN(t-below,.2)})}${timer}`;
  }
  const scared=AT(t,p.now??25.7);
  return `${R17_DEFS}${r17_bgStorm(g,{city:0})}<path d="M-40 250 L1960 330" stroke="${INK}" stroke-width="60" stroke-linecap="round"/><path d="M-40 250 L1960 330" stroke="#26213A" stroke-width="42" stroke-linecap="round"/>
   ${person({x:960,y:540,s:1.55,t:g,who:'kai',pose:'up',mouth:scared?'o':'grin',brows:scared?'sad':'raised',legs:'walk',sweat:scared?1:0,rot:2})}
   ${scared?'':T(1480,520,'NOT AFRAID OF',{size:56,fill:'#fff',sc:pop(t,afraid+.1)})+T(1480,600,'ANYTHING',{size:76,fill:P.mint,sc:pop(t,afraid+.3)})}
   ${scared?T(1480,560,'...UNTIL NOW',{size:80,fill:P.red,sc:pop(t,p.now??25.7)}):''}${timer}`;
},
rwPower(t,d,p,g){
  const jg=p.jg??11.3, tm=60-(g-jg), one=AT(t,p.one??4.3), only=AT(t,p.only??2.3);
  return `${R17_DEFS}${r17_bgTowerIn(g,{flash:t<.2?.8:0})}
   ${r17_pend(420,60,560,Math.sin(g*2.1)*12,70)}${r17_gear(1180,700,150,16,g*20)}${r17_gear(1390,620,90,10,-g*34)}
   ${glint({x:860,y:560,s:1.15,t:g,pose:'reach',mouth:only?'flat':'smirk',brows:only?'angry':'raised',blink:BL(g),glint:Math.max(0,Math.sin(t*2))})}
   ${r17_hud(960,200,pop(t,p.hud??.2,.45),g,{spin:g*60,secCol:only&&!one?(Math.sin(g*8)>0?P.red:P.mint):P.mint})}
   ${only?T(960,385,'ONLY 60 SECONDS',{size:64,fill:P.gold,sc:pop(t,p.only??2.3)}):''}
   ${one?r17_left(1480,520,1,g,{s:1.35,flash:1-prog(t,p.one??4.3,(p.one??4.3)+.5)}):''}
   ${r17_timer(1660,850,tm,g,{s:.75})}<rect width="1920" height="1080" fill="url(#r17_sl)" opacity=".18"/>`;
},
// ---------------- ONE WEEK EARLIER ----------------
rwTower(t,d,p,g){
  const st=p.start??2.4; const back=t<st;
  if(back){ const k=r17_rk(t,0,st);
    const inner=`${r17_bgStorm(g,{dir:-1})}${r17_tower(760,360,240,g,{ma:96-t*40})}`;
    return `${R17_DEFS}${r17_rewWrap(inner,Math.max(.5,k),g,{hud:false})}
      ${T(960,520,"LET'S GO BACK",{size:130,fill:'#fff',sc:pop(t,.05)})}${AT(t,p.week??1.2)?T(960,680,'ONE WEEK EARLIER',{size:90,fill:P.gold,sc:pop(t,p.week??1.2)}):''}`;
  }
  const flash=AT(t,p.storm??15.4)&&((t-(p.storm??15.4))%3.2<.18)?1:0, creak=AT(t,p.creak??11.8)&&t<(p.creak??11.8)+1?Math.sin(t*60)*3:0;
  const pa=Math.sin(g*2.1)*14;
  return `${R17_DEFS}<g transform="translate(${creak},0)">${r17_bgTowerIn(g,{flash})}
   ${r17_gear(1220,430,190,18,g*12)}${r17_gear(1490,300,110,12,-g*21)}${r17_gear(1500,600,90,10,-g*26)}${r17_gear(1040,190,80,9,-g*29)}
   ${r17_pend(640,70,610,pa,78)}
   ${glint({x:1130,y:520,s:1,t:g,pose:'point',mouth:'smile',look:-1,blink:BL(g)})}
   <g transform="translate(1310,500) rotate(-20)"><rect x="-40" y="-30" width="80" height="90" rx="12" fill="#C9302C" stroke="${INK}" stroke-width="6"/><path d="M20 -26 L80 -80" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M-30 -30 q30 -36 60 0" stroke="${INK}" stroke-width="6" fill="none"/></g>
   ${AT(t,p.age??3.4)?labelPill(960,150,'150 YEARS OLD',P.gold,52):''}
   ${AT(t,p.tall??5.6)?`<g opacity="${prog(t,p.tall??5.6,(p.tall??5.6)+.4)}"><path d="M330 90 V740" stroke="#fff" stroke-width="6"/><path d="M310 100 h40 M310 730 h40" stroke="#fff" stroke-width="6"/>${T(280,420,'TALLER THAN',{size:40,fill:'#fff',stroke:8,anchor:'end'})}${T(280,470,'A MAN',{size:40,fill:'#fff',stroke:8,anchor:'end'})}</g>`:''}
   ${AT(t,p.job??8.8)?T(1180,860,'JOB: OIL THE GEARS',{size:56,fill:P.mint,sc:pop(t,p.job??8.8)}):''}
   ${AT(t,p.creak??11.8)?T(420,860,'CREAK...',{size:56,fill:P.steel,sc:pop(t,p.creak??11.8)}):''}
   ${AT(t,p.storm??15.4)?T(1600,600,'RUMBLE',{size:52,fill:'#9AD1FF',sc:pop(t,p.storm??15.4)}):''}</g>`;
},
rwLightning(t,d,p,g){
  const bolt=p.bolt??5.5, spin=p.spin??7.5; const fl=AT(t,bolt)?Math.max(0,1-(t-bolt)*1.6):0; const rev=AT(t,spin);
  const ga=rev?-(t-spin)*(t-spin)*160:g*12;
  const zoom=1+.0*t;
  const inner=`${r17_bgTowerIn(g,{flash:fl})}${r17_gear(1180,470,260,20,ga)}${r17_gear(1530,260,130,12,-ga*1.9)}${r17_gear(820,170,110,11,-ga*2.2)}${r17_gear(1560,700,120,12,-ga*2.1)}
   ${r17_pend(520,40,640,rev?Math.sin(-(t-spin)*4)*16:Math.sin(g*2.1)*14,80)}
   ${glint({x:760,y:540,s:1.05,t:g,pose:'reach',mouth:fl>0||rev?'o':'flat',brows:fl>0||rev?'raised':'calm',look:1,blink:0,sweat:rev?1:0})}
   <g transform="translate(905,${545})"><rect x="-26" y="-22" width="52" height="44" rx="10" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><circle r="13" fill="#FFF6EA" stroke="${INK}" stroke-width="3"/><path d="M0 0 V-9 M0 0 L${rev?-8:6} 3" stroke="${INK}" stroke-width="3"/></g>
   ${!rev?T(960,150,'HIS WATCH CATCHES',{size:72,fill:'#fff',sc:pop(t,.4)}):''}
   ${fl>0?r17_bolt(1600,90,1,fl):''}`;
  const k=rev?clamp((t-spin)/.4):0;
  return `${R17_DEFS}${rev?r17_rewWrap(inner,.35+.65*k,g,{hud:false}):inner}${fl>0?`<rect width="1920" height="1080" fill="#fff" opacity="${fl*.7}"/>`:''}
   ${AT(t,bolt)&&!rev?T(960,150,'CRACK!',{size:150,fill:P.gold,sc:pop(t,bolt)}):''}
   ${rev?T(960,170,'EVERY GEAR SPINS BACKWARDS',{size:76,fill:P.mint,sc:pop(t,spin)}):''}`;
},
rwStill(t,d,p,g){
  const again=p.again??10.6;
  if(t<again){
    const can=AT(t,p.can??2.6), clk=AT(t,p.clock??5), rem=AT(t,p.rem??7.5);
    return `${R17_DEFS}${r17_bgTowerIn(g)}${r17_gear(1500,520,170,16,0)}${r17_pend(260,60,560,0,66)}
     <rect x="520" y="300" width="380" height="22" fill="${r17_WOOD}" stroke="${INK}" stroke-width="6"/>
     ${can?`<g transform="translate(650,${255-6*Math.abs(Math.sin(g*3))*(1-prog(t,p.can??2.6,(p.can??2.6)+1))})"><rect x="-40" y="-40" width="80" height="85" rx="12" fill="#C9302C" stroke="${INK}" stroke-width="6"/><path d="M20 -36 L70 -80" stroke="${INK}" stroke-width="10" stroke-linecap="round"/></g>${T(710,400,'BACK ON THE SHELF?',{size:44,fill:'#fff',stroke:9,sc:pop(t,p.can??2.6)})}`:''}
     ${glint({x:880,y:560,s:1,t:g,pose:can?'shrug':'down',mouth:'o',brows:'raised',look:-.6,blink:BL(g)})}
     ${clk?`<g transform="translate(1500,520) scale(${pop(t,p.clock??5)})">${r17_face(0,0,150,AT(t,(p.clock??5)+.8)?354:0,0)}</g>${T(1500,790,'1 MINUTE EARLIER',{size:56,fill:P.gold,sc:pop(t,p.clock??5)})}`:''}
     ${rem?`<g transform="translate(1040,230) scale(${pop(t,p.rem??7.5)})"><path d="M-210 -120 H210 Q240 -120 240 -90 V90 Q240 120 210 120 H-210 Q-240 120 -240 90 V-90 Q-240 -120 -210 -120Z" fill="#1A1630" stroke="#C9D6FF" stroke-width="7" stroke-dasharray="16 10"/>
        <g opacity=".6">${r17_bolt(-120,-100,.45)}</g>${T(60,10,'A MINUTE THAT',{size:40,fill:'#C9D6FF',stroke:8})}${T(60,60,'NEVER HAPPENED',{size:40,fill:'#C9D6FF',stroke:8})}</g>`:''}`;
  }
  const lt=t-again, snap=p.snap??1.4, rain=p.rain??4.4, sixty=p.sixty??6.2, every=p.every??8.1;
  const rk=lt>rain&&lt<sixty+1.2?clamp(Math.min((lt-rain)/.3,1)):0;
  const inner=`${r17_bgStorm(g,{dir:AT(lt,rain)?-1:1,rain:1})}${r17_tower(1450,420,170,g,{ma:AT(lt,rain)?96-(lt-rain)*60:96})}
     ${glint({x:640,y:560,s:1.15,t:g,pose:AT(lt,snap)?'flex':'down',mouth:AT(lt,snap)?'grin':'flat',brows:'raised',blink:BL(g)})}`;
  const tries=AT(lt,every)?[0,1,2,3].map(i=>icon('check',260+i*150,250,.6*pop(lt,every+i*.15))).join(''):'';
  return `${R17_DEFS}${rk>0?r17_rewWrap(inner,rk*.7,g,{hud:false}):inner}
    ${AT(lt,snap)&&lt<rain?`${T(820,330,'SNAP!',{size:110,fill:P.gold,sc:pop(lt,snap),rot:-8})}<circle cx="740" cy="460" r="${40+(lt-snap)*200}" fill="none" stroke="${P.gold}" stroke-width="8" opacity="${Math.max(0,1-(lt-snap)*1.5)}"/>`:''}
    ${AT(lt,rain)?T(1300,150,'THE RAIN UN-FALLS',{size:76,fill:'#A9D8FF',sc:pop(lt,rain)}):''}
    ${AT(lt,sixty)?r17_hud(960,800,.85*pop(lt,sixty),g,{spin:g*200}):''}
    ${AT(lt,every)?T(560,150,'EVERY TIME',{size:84,fill:P.mint,sc:pop(lt,every)})+tries:''}`;
},
// ---------------- THE RULES ----------------
rwRules(t,d,p,g){
  const x0=280,x1=1640,y=560, X=s=>lerp(x0,x1,(s+120)/120);
  const send=p.send??1.3, more=p.more??6, stack=p.stack??7.6, twice=p.twice??9.3, never=p.never??13.4;
  const k1=eout(prog(t,send+1.2,send+2.6)); const gx=AT(t,stack)?X(0):lerp(X(0),X(-60),k1);
  const k2=eout(prog(t,twice+1,twice+2.4));
  let ticks='';for(let s=-120;s<=0;s+=10) ticks+=`<path d="M${X(s)} ${y-(s%60===0?34:18)} V${y+(s%60===0?34:18)}" stroke="#fff" stroke-width="${s%60===0?8:4}"/>`;
  const arc=(a,b,col,k,yy=-80)=>{const xa=X(a),xb=lerp(X(a),X(b),k);return `<path d="M${xa} ${y-40} Q${(xa+xb)/2} ${y+yy*2} ${xb} ${y-40}" stroke="${col}" stroke-width="12" fill="none" stroke-linecap="round"/>`;};
  return `${R17_DEFS}${card('cardDark',g)}${T(960,150,'THE RULES',{size:120,fill:P.gold,sc:pop(t,.1)})}
   <path d="M${x0} ${y} H${x1}" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="M${x0} ${y} H${x1}" stroke="#5D587A" stroke-width="14" stroke-linecap="round"/>
   <path d="M${X(-60)} ${y} H${x1}" stroke="${P.mint}" stroke-width="14" stroke-linecap="round" opacity="${AT(t,send)?1:0}"/>${ticks}
   ${T(X(0),y+110,'NOW',{size:56,fill:'#fff'})}${T(X(-60),y+110,'-60 s',{size:56,fill:P.mint})}${T(X(-120),y+110,'-120 s',{size:56,fill:'#8C87A8'})}
   ${AT(t,send)&&!AT(t,stack)?arc(0,-60,P.mint,k1):''}
   ${AT(t,send)?T(960,300,'THE WHOLE UNIVERSE: BACK 60 s',{size:60,fill:'#fff',sc:pop(t,send)}):''}
   ${AT(t,more)?`<g transform="translate(${X(-60)-10},${y})"><rect x="-14" y="-110" width="28" height="220" fill="${P.red}" stroke="${INK}" stroke-width="6"/></g>${T(X(-90),y-140,'NOT 1 SECOND MORE',{size:44,fill:P.red,stroke:9,sc:pop(t,more)})}`:''}
   ${AT(t,stack)?`${arc(0,-60,P.mint,1,-60)}${AT(t,twice)?arc(-60,-120,P.red,eout(prog(t,twice,twice+.8)),-60)+(AT(t,twice+.8)?icon('cross',X(-90),y-150,.7*pop(t,twice+.8)):''):''}`:''}
   ${AT(t,stack)?T(960,780,"CAN'T STACK REWINDS",{size:80,fill:P.gold,sc:pop(t,stack)}):''}
   ${AT(t,never)?T(960,870,'NEVER FURTHER',{size:60,fill:P.red,sc:pop(t,never)}):''}
   <g transform="translate(${gx},${y-40})">${glint({x:0,y:-150,s:.4,t:g,mouth:'o',brows:'raised',blink:BL(g)})}</g>`;
},
rwMemory(t,d,p,g){
  const wm=p.wm??20.3;
  if(t<wm){ const lim=AT(t,p.limit??3.7), lock=AT(t,p.lock??6.8), hrs=AT(t,p.hours??9.4), mind=AT(t,p.mind??13.9);
    return `${R17_DEFS}${card('cardMint',g)}${glint({x:420,y:580,s:1,t:g,pose:'point',mouth:lim?'flat':'smile',brows:lim?'sad':'raised',blink:BL(g)})}
     ${brain(1100,430,1.15,1,g)}${T(1100,180,'ONLY HIS MEMORY',{size:76,fill:P.mint,sc:pop(t,.3)})}
     ${lim&&!lock?labelPill(1100,740,'BUT THERE\'S A LIMIT',P.red,50):''}
     ${lock?`<g transform="translate(1520,600) scale(${pop(t,p.lock??6.8)})"><rect x="-80" y="-30" width="160" height="130" rx="18" fill="${P.gold}" stroke="${INK}" stroke-width="8"/><path d="M-50 -30 V-80 Q-50 -130 0 -130 Q50 -130 50 ${AT(t,p.hours??9.4)?-80:-110}" stroke="${INK}" stroke-width="20" fill="none"/><circle cy="30" r="18" fill="${INK}"/></g>${T(1100,740,'NEW MEMORIES LOCK IN SLOWLY',{size:52,fill:'#fff',sc:pop(t,p.lock??6.8)})}`:''}
     ${hrs&&!mind?`${clockP(720,250,80,g)}${T(720,390,'HOURS',{size:48,fill:P.gold,stroke:9})}${T(1100,830,'+ USUALLY SLEEP',{size:52,fill:'#C9D6FF',sc:pop(t,p.hours??9.4)})}`:''}
     ${mind?`<circle cx="1100" cy="430" r="${150+Math.sin(g*4)*8}" fill="none" stroke="${P.gold}" stroke-width="10" stroke-dasharray="20 14"/>${T(1100,830,'KEEPS ONLY WHAT IS IN MIND',{size:54,fill:P.gold,sc:pop(t,p.mind??13.9)})}`:''}`;
  }
  const lt=t-wm, four=p.four??5.3, th=p.things??9.6, carry=p.carry??10.9;
  const items=[['A',P.coral],['B',P.gold],['C',P.mint],['D','#7CC4FF']];
  let slots='';items.forEach(([l,c],i)=>{const x=620+i*230;const k=pop(lt,1+i*.5);slots+=`<g transform="translate(${x},520)"><rect x="-95" y="-95" width="190" height="190" rx="24" fill="#0E1A2A" stroke="${P.mint}" stroke-width="8"/>${k>0?`<g transform="scale(${k})"><rect x="-62" y="-62" width="124" height="124" rx="18" fill="${c}" stroke="${INK}" stroke-width="7"/><text y="26" text-anchor="middle" font-size="76" font-weight="900" fill="${INK}">${i+1}</text></g>`:''}</g>`;});
  const bx=lerp(1800,1560,eout(prog(lt,carry,carry+.4)))+(AT(lt,carry+.5)?eout(prog(lt,carry+.5,carry+1.1))*300:0), by=520-(AT(lt,carry+.5)?Math.sin(prog(lt,carry+.5,carry+1.1)*Math.PI)*200:0);
  return `${R17_DEFS}${card('cardDark',g)}${T(960,170,'WORKING MEMORY',{size:100,fill:P.mint,sc:pop(lt,.1)})}${T(960,260,'(TINY)',{size:52,fill:'#C9D6FF',op:prog(lt,2,2.4)})}
   ${glint({x:260,y:580,s:.85,t:g,mouth:'o',brows:'raised',pose:'point',blink:BL(g)})}${slots}
   ${AT(lt,four)?T(960,770,'ABOUT 4 CHUNKS AT ONCE',{size:70,fill:P.gold,sc:pop(lt,four)}):''}
   ${AT(lt,th)?T(960,860,'4 THINGS. THAT\'S ALL.',{size:62,fill:'#fff',sc:pop(lt,th)}):''}
   ${AT(lt,carry)?`<g transform="translate(${bx},${by}) rotate(${(lt-carry)*200})"><rect x="-55" y="-55" width="110" height="110" rx="16" fill="#B47CFF" stroke="${INK}" stroke-width="7"/><text y="24" text-anchor="middle" font-size="64" font-weight="900" fill="${INK}">5</text></g>${icon('cross',1560,380,.6*pop(lt,carry+.3))}`:''}`;
},
// ---------------- PLUS / MINUS ----------------
rwPlate(t,d,p,g){
  const drop=p.drop??2.4, crash=p.crash??4.4, rew=p.rew??5.5, cat=p.catch??6.9;
  const fall=t<rew?eout(prog(t,drop+.4,crash))*0+prog(t,drop+.4,crash):(t<cat?1-prog(t,rew,rew+1.2):0);
  const broken=t>=crash&&t<rew+.6, caught=AT(t,cat);
  const py=lerp(470,800,caught?Math.min(.7,prog(t,cat-.3,cat)):fall*fall);
  const shardK=t<rew?eout(prog(t,crash,crash+.4)):1-prog(t,rew,rew+.6);
  const inner=`${r17_bgKitchen(g)}${person({x:560,y:520,s:1,t:g,who:'nan',pose:AT(t,drop)&&!caught?'up':'hold',mouth:caught?'laugh':AT(t,drop)?'o':'smile',brows:AT(t,drop)?'raised':'calm',blink:BL(g)})}
   ${pickles(1500,830,.75,g,{mood:caught?'happy':'grump'})}
   ${glint({x:caught?900:1180,y:caught?560:540,s:1,t:g,pose:caught?'reach':'down',mouth:caught?'grin':'o',brows:'raised',blink:BL(g),legs:caught?'walk':'stand'})}
   ${broken?r17_shards(720,800,shardK):r17_plate(caught?1040:700,caught?560:py,1,fall*200)}
   ${AT(t,crash)&&t<rew?T(720,700,'CRASH!',{size:120,fill:P.red,sc:pop(t,crash),rot:-6}):''}
   ${caught?T(1040,400,'CAUGHT!',{size:110,fill:P.mint,sc:pop(t,cat)}):''}`;
  const rk=t>rew&&t<cat?clamp(Math.min((t-rew)/.2,(cat-t)/.2)):0;
  return `${R17_DEFS}${rk>0?r17_rewWrap(inner,rk,g,{hy:300}):inner}${r17_pm(t,'plus',"NAN'S PLATES")}`;
},
rwRuler(t,d,p,g){
  const avg=p.avg??1.9, tr=p.try??6.7, slip=p.slip??11, kn=p.knows??14.2, fut=p.future??17.1, nan=p.nan??20.4, sc=p.scarf??23.1;
  if(t>=nan){ const lt=t-nan;
    return `${R17_DEFS}${r17_bgKitchen(g)}${person({x:560,y:520,s:1.05,t:g,who:'nan',pose:'hold',mouth:'o',brows:'raised',blink:BL(g)})}${r17_plate(620,600,.9)}
     ${glint({x:1250,y:540,s:1.05,t:g,pose:AT(t,sc)?'point':'shrug',mouth:AT(t,sc)?'smirk':'grin',brows:'raised',blink:BL(g),dir:-1,glint:AT(t,sc)?Math.max(0,Math.sin(t*3)):0})}
     ${bubble(560,170,620,130,'HOW DID YOU DO THAT?',{size:46,tail:'left'})}
     ${AT(t,sc)?`${bubble(1310,170,560,130,"IT'S THE SCARF.",{size:50,tail:'right'})}<circle cx="1230" cy="590" r="${70+Math.sin(g*6)*10}" fill="none" stroke="${P.mint}" stroke-width="8"/>`:''}`;
  }
  const hand=(x,y,close)=>`<g transform="translate(${x},${y})"><path d="M-30 ${close?-10:-40} Q-60 0 -30 40 H30 Q60 0 30 ${close?-10:-40}" fill="#FFF6EA" stroke="${INK}" stroke-width="9"/><rect x="-60" y="40" width="120" height="200" rx="40" fill="#FFF6EA" stroke="${INK}" stroke-width="9"/></g>`;
  const ruler=(x,y)=>`<g transform="translate(${x},${y})"><rect x="-26" y="-230" width="52" height="460" rx="6" fill="${P.gold}" stroke="${INK}" stroke-width="7"/>${[...Array(11)].map((_,i)=>`<path d="M-26 ${-200+i*40} h${i%2?16:28}" stroke="${INK}" stroke-width="5"/>`).join('')}</g>`;
  let body;
  if(t<tr){ body=`${glint({x:520,y:560,s:1,t:g,pose:'point',mouth:'smile',blink:BL(g)})}<g transform="translate(1200,470)">${clockP(0,0,170,AT(t,avg)?Math.min(g,1e9):0)}</g>
      ${AT(t,avg)?T(1200,760,'REACTION TIME',{size:60,fill:'#fff',sc:pop(t,avg)})+T(1200,860,'~ 1/4 SECOND',{size:80,fill:P.gold,sc:pop(t,avg+.4)}):''}`; }
  else if(t<kn){ const fy=t<tr+2.2?-60:lerp(-60,430,clamp((t-tr-2.2)/.6)); const cl=t>tr+2.2+.35;
    body=`${ruler(960,360+fy)}${hand(900,520,cl)}${T(960,170,'THE RULER DROP',{size:84,fill:'#fff',sc:pop(t,tr)})}${AT(t,slip)?T(1400,520,'TOO SLOW!',{size:84,fill:P.red,sc:pop(t,slip)}):''}`; }
  else { const caught=t>kn+1.4; const fy=t<kn+1.0?-60:Math.min(lerp(-60,40,clamp((t-kn-1.0)/.3)),40);
    body=`${glint({x:420,y:560,s:.95,t:g,pose:'point',mouth:'smirk',brows:'raised',blink:BL(g)})}${ruler(1000,360+fy)}${hand(940,520,caught)}
      ${T(1000,160,'HE KNOWS WHEN',{size:84,fill:P.mint,sc:pop(t,kn)})}${AT(t,fut)?T(1400,600,'FUTURE',{size:80,fill:P.gold,sc:pop(t,fut)})+T(1400,690,'BEATS',{size:56,fill:'#fff',sc:pop(t,fut+.2)})+T(1400,780,'REACTION',{size:80,fill:P.red,sc:pop(t,fut+.4)}):''}`; }
  return `${R17_DEFS}${card('cardMint',g)}${body}`;
},
rwLottery(t,d,p,g){
  const idea=p.idea??2, plan=p.plan??4.2, tries=p.tries??8.2, rew=p.rew??9.4, diff=p.diff??10.6;
  const rk=t>rew&&t<diff?clamp(Math.min((t-rew)/.2,(diff-t)/.2)):0;
  const inner=`${r17_bgStorm(g,{rain:0,city:1})}<rect width="1920" height="1080" fill="#2A1846" opacity=".55"/>${r17_lotto(1250,420,1,g,{spin:1.4})}
   ${person({x:380,y:560,s:1,t:g,who:'kai',pose:AT(t,diff)?'hips':'point',mouth:AT(t,diff)?'frown':'grin',brows:AT(t,diff)?'angry':'raised',blink:BL(g)})}
   ${AT(t,idea)&&!AT(t,tries)?icon('bulb',380,180,.9*pop(t,idea)):''}
   ${AT(t,tries)?glint({x:720,y:600,s:.85,t:g,mouth:AT(t,diff)?'o':'smirk',brows:'raised',blink:BL(g)}):''}
   ${AT(t,plan)&&!AT(t,diff)?r17_drawRow(1250,820,[7,19,23,31,42],t,plan+.6):''}`;
  return `${R17_DEFS}${rk>0?r17_rewWrap(inner,rk,g,{hy:300}):inner}
   ${AT(t,idea)&&!AT(t,plan)?T(1250,820,"KAI'S TERRIBLE IDEA",{size:64,fill:P.gold,sc:pop(t,idea)}):''}
   ${AT(t,plan)&&!AT(t,tries)?`${T(1250,150,'1. WATCH  2. REWIND  3. BUY',{size:56,fill:'#fff',sc:pop(t,plan),stroke:12})}`:''}
   ${AT(t,diff)?r17_drawRow(1250,820,[3,11,28,36,40],t,diff)+T(1250,160,'COMPLETELY DIFFERENT!',{size:80,fill:P.red,sc:pop(t,diff+.5)}):''}
   ${r17_pm(t,'minus','THE LOTTERY')}`;
},
rwLorenz(t,d,p,g){
  const real=p.real??1.4, lor=p.lorenz??2.6, tiny=p.tiny??12, wild=p.wild??15.6;
  if(t<lor) return `${R17_DEFS}${card('cardWarm',g)}${T(960,520,'CHAOS',{size:300,fill:P.red,sc:pop(t,.05),rot:Math.sin(g*7)*3})}${AT(t,real)?T(960,720,'REAL SCIENCE',{size:90,fill:'#fff',sc:pop(t,real)}):''}`;
  let curves='';
  if(AT(t,wild)){const k=prog(t,wild,wild+2.4); const n=Math.floor(80*k); let a='',b='';
    for(let i=0;i<=n;i++){const x=980+i*10, u=i/80, base=Math.sin(u*9)*60+Math.sin(u*23)*20, dv=Math.exp(u*6)/400*Math.sin(u*31+1)*90; a+=`${i?'L':'M'}${x} ${560-base}`; b+=`${i?'L':'M'}${x} ${560-base-dv}`;}
    curves=`<rect x="960" y="300" width="840" height="520" rx="16" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><path d="${a}" stroke="${P.iceDeep}" stroke-width="9" fill="none"/><path d="${b}" stroke="${P.red}" stroke-width="9" fill="none"/>${T(1380,880,'FORECAST: WILDLY DIFFERENT',{size:48,fill:P.red,stroke:10,sc:pop(t,wild+1)})}`;}
  return `${R17_DEFS}${card('cardWarm',g)}${T(960,150,'1961 · EDWARD LORENZ',{size:80,fill:P.gold,sc:pop(t,lor)})}
   ${r17_computer(500,540,.95,g)}${extra({x:200,y:620,s:.75,t:g,head:'#F2C9A0',glasses:true,pose:'point',tie:true})}
   ${AT(t,tiny)&&!AT(t,wild)?`<g transform="translate(1380,520)">${T(0,-110,'0.506127',{size:110,fill:'#fff'})}${T(0,40,'0.506',{size:110,fill:P.gold,sc:pop(t,tiny+.3)})}${T(0,180,'4TH DECIMAL PLACE',{size:52,fill:P.mint,sc:pop(t,tiny+.8)})}</g>`:''}
   ${!AT(t,tiny)?`<g transform="translate(1380,520)">${T(0,0,'WEATHER',{size:80,fill:'#fff',sc:pop(t,lor+1)})}${T(0,100,'FORECAST',{size:80,fill:'#fff',sc:pop(t,lor+1.2)})}${AT(t,lor+4)?T(0,220,'ONE NUMBER ROUNDED',{size:48,fill:P.gold,sc:pop(t,lor+4)}):''}</g>`:''}${curves}`;
},
rwButterfly(t,d,p,g){
  const tor=p.tor??3.2, lot=p.lot??6.1, br=p.breath??9.2, nev=p.never??15.6;
  if(t<lot){const k=eout(prog(t,1,tor+1));let path='';for(let i=0;i<=40*k;i++){const u=i/40;path+=`${i?'L':'M'}${420+u*1060} ${560+Math.sin(u*14)*60*u-u*120}`;}
    return `${R17_DEFS}${card('cardMint',g)}<path d="M120 860 Q600 700 960 820 T1800 760" stroke="#1FAF8A" stroke-width="10" fill="none" opacity=".5"/>
      ${r17_butterfly(420,520,1,g)}${T(420,760,'BRAZIL',{size:64,fill:P.gold})}<path d="${path}" stroke="#CFE6FF" stroke-width="10" fill="none" stroke-dasharray="20 14" stroke-linecap="round"/>
      ${AT(t,tor)?r17_tornado(1500,760,1.1,g,pop(t,tor))+T(1500,860,'TEXAS?',{size:64,fill:P.red}):''}${T(960,160,'THE BUTTERFLY EFFECT',{size:96,fill:'#fff',sc:pop(t,.2)})}`;}
  const lt=t;
  return `${R17_DEFS}${card('cardDark',g)}${r17_lotto(1250,430,.95,g,{spin:1.6,seed:AT(lt,nev)?9:3})}
   ${glint({x:520,y:560,s:1,t:g,mouth:'o',brows:'raised',blink:BL(g),legs:AT(lt,br)?'walk':'stand'})}
   ${AT(lt,br)?[0,1,2].map(i=>{const k=((g*.7+i/3)%1);return `<path d="M${620+k*420} ${420+i*40} q40 -30 80 0 t80 0" stroke="#CFE6FF" stroke-width="8" fill="none" opacity="${1-k}" stroke-linecap="round"/>`;}).join('')+T(700,250,'EVERY BREATH NUDGES THE AIR',{size:50,fill:'#CFE6FF',sc:pop(lt,br),stroke:10}):''}
   ${T(1250,150,'A LOTTERY MACHINE = CHAOS',{size:66,fill:P.red,sc:pop(lt,lot)})}
   ${AT(lt,nev)?T(1250,820,'NEVER THE SAME TWICE',{size:74,fill:P.gold,sc:pop(lt,nev)}):''}`;
},
rwPendulums(t,d,p,g){
  const same=p.same??6.9, dbl=p.dbl??11.6, fl=p.flail??15.8, q=p.quote??22.8, two=p.two??27.2;
  const sa=Math.sin(g*2.6)*32;
  let dp='';
  if(AT(t,dbl)){ const tt=AT(t,fl)?t-fl:0; const a1=2.4,a2=2.7;
    dp=r17_dpDraw(1400,400,200,'r17a',a1,a2,tt,P.gold)+(AT(t,fl)?r17_dpDraw(1400,400,200,'r17b',a1,a2+.004,tt,P.mint):'');}
  let ghosts='';if(AT(t,same)) for(let i=1;i<=3;i++) ghosts+=`<g opacity="${.18}">${r17_pend(720,250,400,Math.sin((g-.05*i)*2.6)*32,52,{rod:'#C9D6FF'})}</g>`;
  return `${R17_DEFS}${bgLab(g)}${person({x:220,y:560,s:.85,t:g,who:'osei',pose:AT(t,dbl)?'point':'hips',mouth:AT(t,q)?'smile':'flat',blink:BL(g)})}
   ${glint({x:1760,y:620,s:.7,t:g,mouth:AT(t,fl)?'o':'smile',brows:AT(t,fl)?'raised':'calm',look:-1,blink:BL(g),dir:-1})}
   <rect x="560" y="236" width="320" height="28" rx="8" fill="#5D6A82" stroke="${INK}" stroke-width="6"/>${ghosts}${r17_pend(720,250,400,sa,52)}
   <path d="M${720+Math.sin(r17_rad(-32))*400} ${250+Math.cos(r17_rad(-32))*400} A400 400 0 0 0 ${720+Math.sin(r17_rad(32))*400} ${250+Math.cos(r17_rad(32))*400}" stroke="${P.mint}" stroke-width="5" fill="none" stroke-dasharray="10 12" opacity="${AT(t,same)?.8:0}" transform="scale(1,1)"/>
   ${AT(t,dbl)?`<rect x="1240" y="386" width="320" height="28" rx="8" fill="#5D6A82" stroke="${INK}" stroke-width="6"/>${dp}`:''}
   ${T(720,150,AT(t,q)?'PREDICT FOREVER':AT(t,same)?'SAME EVERY TIME':'1 PENDULUM',{size:64,fill:P.mint,sc:pop(t,AT(t,q)?q:AT(t,same)?same:.3)})}
   ${AT(t,dbl)?T(1400,150,AT(t,two)?'NOT EVEN 10 s':AT(t,fl+2)?'TOTALLY DIFFERENT':AT(t,fl)?'SAME START?':'2 PENDULUMS',{size:64,fill:AT(t,fl+2)?P.red:P.gold,sc:pop(t,AT(t,two)?two:AT(t,fl+2)?fl+2:AT(t,fl)?fl:dbl)}):''}
   ${AT(t,q)?bubble(560,820,640,110,'ONE: PREDICTABLE. TWO: CHAOS.',{size:40,tail:'left'}):''}`;
},
rwWords(t,d,p,g){
  const sad=p.sad??2.6, wr=p.wrong??6.3, r1=p.r1??8.3, r2=p.r2??11, f4=p.four??12.3, la=p.laugh??15.4;
  const tryN=t<r1?1:t<r2?2:t<f4-.5?3:4; const happy=AT(t,la);
  const rk=Math.max(r17_rk(t,r1,.9),r17_rk(t,r2,.9),r17_rk(t,f4-.9,.7));
  const say=AT(t,wr)?(tryN===4?'...':tryN===1?'UM... SHE\'S IN A BETTER--':'...'):'';
  const inner=`${r17_bgKitchen(g)}${person({x:620,y:540,s:1.05,t:g,who:'nan',pose:'hold',mouth:happy?'laugh':tryN>=2&&AT(t,wr)?'flat':'frown',brows:happy?'raised':'sad',blink:BL(g)})}
   ${frame(620,640,.38,`<g transform="translate(0,40) scale(.7)">${extra({t:g,head:'#E8C8A8',glasses:true,mouth:'smile'})}</g>`)}
   ${glint({x:1240,y:540,s:1.05,t:g,pose:tryN===4?'hips':'shrug',mouth:happy?'grin':tryN===1&&AT(t,wr)?'wavy':'flat',brows:happy?'raised':'sad',blink:BL(g),dir:-1})}
   ${AT(t,wr)&&!happy?bubble(1240,200,520,120,tryN===1?'UH... CHEER UP?':tryN===2?'SHE... WAIT.':'HMM...',{size:50,tail:'right'}):''}
   ${happy?`${bubble(1240,200,560,120,'HE BURNT THE TOAST!',{size:46,tail:'right'})}${T(620,190,'HA HA HA!',{size:90,fill:P.gold,sc:pop(t,la)})}`:''}`;
  return `${R17_DEFS}${rk>0?r17_rewWrap(inner,rk,g,{hy:470}):inner}
   ${AT(t,wr)?`<g transform="translate(1700,860)">${labelPill(0,0,'TRY '+tryN,tryN===4?P.mint:P.gold,54)}</g>`:''}${r17_pm(t,'plus','PERFECT WORDS')}`;
},
rwForget(t,d,p,g){
  const rew=p.rew??4.4, four=p.four??7.5, five=p.five??9.1, ch=p.choose??10.7, gone=p.gone??13.6;
  const W=['APPLE','RIVER','CANDLE','TIGER','PIANO','CLOUD','HAMMER','ORANGE','WINDOW','PENCIL','GARDEN','ROCKET','BUTTON','LEMON','SPIDER','CASTLE','MIRROR','BANANA','TRUMPET','PILLOW'];
  const keep=[0,6,11,17], maybe=14; const after=AT(t,four);
  let grid='';W.forEach((w,i)=>{const x=900+(i%4)*240,y=260+Math.floor(i/4)*110;const kp=keep.includes(i), mb=i===maybe;
    const op=!after?1:kp?1:(mb&&AT(t,five)&&!AT(t,gone))?(.4+.6*Math.abs(Math.sin(g*6))):AT(t,gone)?.06:.2;
    grid+=`<g opacity="${op}"><rect x="${x-110}" y="${y-44}" width="220" height="84" rx="14" fill="${after&&kp?P.mint:'#FFF6EA'}" stroke="${INK}" stroke-width="6"/><text x="${x}" y="${y+14}" text-anchor="middle" font-size="38" font-weight="900" fill="${INK}">${w}</text></g>`;});
  const rk=r17_rk(t,rew,1.2);
  const inner=`${bgLab(g)}${person({x:300,y:560,s:.85,t:g,who:'osei',pose:'point',mouth:'flat',blink:BL(g)})}<rect x="760" y="190" width="980" height="590" rx="24" fill="#0E1A2A" opacity=".7" stroke="${P.mint}" stroke-width="6"/>${grid}`;
  return `${R17_DEFS}${rk>0?r17_rewWrap(inner,rk,g,{hy:470}):inner}
   ${T(1250,150,after?'HE BRINGS BACK 4':'20 WORDS',{size:70,fill:after?P.mint:'#fff',sc:pop(t,after?four:2.4)})}
   ${AT(t,five)&&!AT(t,ch)?T(1250,860,'MAYBE 5',{size:64,fill:P.gold,sc:pop(t,five)}):''}
   ${AT(t,ch)?T(1250,860,AT(t,gone)?'THE REST: GONE FOR GOOD':'CHOOSE WHAT TO KEEP',{size:64,fill:AT(t,gone)?P.red:P.gold,sc:pop(t,AT(t,gone)?gone:ch)}):''}
   ${r17_pm(t,'minus','THE FORGETTING')}`;
},
rwGhosts(t,d,p,g){
  const scan=p.scan??14.4, say=p.say??18.7, stop=p.stop??24, few=p.few??25.3, prom=p.prom??27.9, kai=p.kai??29.8;
  if(t<scan){ const dz=AT(t,p.dozens??5.6), cv=AT(t,p.conv??8.9), pl=AT(t,p.plate??11.5);
    const gs=[[380,300,r17_plate(0,0,.9)],[1540,280,person({s:.35,t:g,who:'nan',mouth:'frown'})],[1600,640,person({s:.35,t:g,who:'kai',mouth:'grin',pose:'up'})],[320,680,r17_ball(-40,0,7,P.coral,40)+r17_ball(40,10,23,P.gold,40)],[960,170,clockP(0,0,70,g)]];
    let gh='';const n=dz?gs.length:2;for(let i=0;i<n;i++) gh+=r17_ghost(gs[i][0],gs[i][1],dz?1:.8,gs[i][2],g,i);
    if(cv) [[620,200],[1300,180]].forEach(([x,y],i)=>gh+=`<g opacity=".7">${bubble(x,y+Math.sin(g*2+i)*10,240,90,'...',{size:60,fill:'#C9D6FF'})}</g>`);
    if(pl) gh+=`<g opacity=".75">${r17_shards(960,760,1)}</g>`;
    return `${R17_DEFS}${card('cardDark',g)}${gh}<circle cx="960" cy="470" r="${190+Math.sin(g*5)*14}" fill="url(#gRed)" opacity=".5"/>
     ${glint({x:960,y:540,s:1.1,t:g,mouth:'wavy',brows:'sad',lid:.45,sweat:1,shiver:.5})}
     ${labelPill(1680,860,'DAY 5',P.gold,52)}${AT(t,p.dozens??5.6)?T(960,880,'DOZENS OF MINUTES THAT NEVER HAPPENED',{size:50,fill:'#C9D6FF',sc:pop(t,p.dozens??5.6)}):''}
     ${r17_pm(t,'minus','THE GHOSTS')}`;
  }
  if(t<kai){
    const r=rng(5);let dots='';for(let i=0;i<40;i++){dots+=`<circle cx="${-150+r()*300}" cy="${-100+r()*190}" r="${7+r()*5}" fill="${P.red}" opacity="${.4+.6*Math.abs(Math.sin(g*5+i))}"/>`;}
    return `${R17_DEFS}${bgLab(g)}<g transform="translate(1100,400)"><rect x="-330" y="-260" width="660" height="460" rx="24" fill="#0B1026" stroke="${INK}" stroke-width="10"/><rect x="-310" y="-240" width="620" height="420" rx="14" fill="#0E2A36"/>${brain(0,-30,1,1,g)}<g transform="translate(0,-30)">${dots}</g></g>
     ${person({x:340,y:560,s:.9,t:g,who:'osei',pose:AT(t,stop)?'point':'cross',mouth:AT(t,stop)?'frown':'flat',brows:'sad',blink:BL(g)})}
     ${glint({x:1640,y:600,s:.85,t:g,mouth:AT(t,prom)?'flat':'o',brows:'sad',blink:BL(g),dir:-1,pose:AT(t,prom)?'cross':'down'})}
     ${AT(t,say)&&!AT(t,stop)?T(1100,770,'MEMORIES WITH NO PLACE TO FILE',{size:56,fill:'#fff',sc:pop(t,say)}):''}
     ${AT(t,stop)?T(1100,150,'STOP, GLINT.',{size:110,fill:P.red,sc:pop(t,stop)}):''}${AT(t,few)?T(1100,770,'A FEW MORE REWINDS. AT MOST.',{size:56,fill:P.gold,sc:pop(t,few)}):''}
     ${AT(t,prom)?T(1640,200,'I PROMISE.',{size:60,fill:P.mint,sc:pop(t,prom)}):''}`;
  }
  return `${R17_DEFS}${card('cardWarm',g)}${person({x:960,y:560,s:1.2,t:g,who:'kai',pose:'up',mouth:'grin',brows:'raised',blink:BL(g)})}${icon('bulb',960,170,1.1*pop(t,kai))}
   ${stamp(960,820,.9*pop(t,kai+.6),'TERRIBLE IDEA',P.red,-6)}`;
},
// ---------------- THE CRISIS ----------------
rwBanner(t,d,p,g){
  const plan=p.plan??6.3, mid=p.mid??11.6, yell=p.yell??14.9, slip=p.slip??18, hang=p.hang??20.6;
  if(t<plan) return `${R17_DEFS}${r17_bgKitchen(g)}${T(960,150,"IT'S NAN'S BIRTHDAY",{size:96,fill:P.gold,sc:pop(t,.1)})}
     ${r17_banner(960,330,1500,'HAPPY BRITHDAY NAN',g)}${person({x:880,y:560,s:1.05,t:g,who:'kai',pose:'hold',mouth:'grin',brows:'raised',blink:BL(g)})}
     <rect x="640" y="320" width="220" height="150" fill="#FFF6EA"/><rect x="600" y="320" width="140" height="150" fill="#FFF6EA"/><path d="M640 320 V450" stroke="none"/>
     <g transform="translate(1180,700) rotate(30)"><rect x="-10" y="-120" width="20" height="160" fill="${r17_WOOD}" stroke="${INK}" stroke-width="5"/><path d="M-16 40 h32 l-6 40 h-20Z" fill="${P.red}" stroke="${INK}" stroke-width="5"/></g>`;
  if(t<mid){ const lt=t-plan;
    return `${R17_DEFS}${r17_bgStorm(g,{rain:.4})}${r17_tower(520,420,150,g,{ma:0,ha:0})}
     <g transform="translate(1500,600)"><rect x="-260" y="-200" width="520" height="500" fill="#3A2E4E" stroke="${INK}" stroke-width="10"/><path d="M-300 -200 L0 -380 L300 -200Z" fill="#5A3550" stroke="${INK}" stroke-width="10"/><rect x="-110" y="-110" width="220" height="170" fill="#FFD27A" stroke="${INK}" stroke-width="8"/><path d="M0 -110 V60 M-110 -25 H110" stroke="${INK}" stroke-width="7"/></g>
     <path d="M700 420 Q1100 ${150} 1400 500" stroke="${P.gold}" stroke-width="10" fill="none" stroke-dasharray="22 16" stroke-dashoffset="${-g*60}"/>
     ${T(1500,250,"NAN'S KITCHEN",{size:56,fill:P.gold,stroke:11})}${T(960,880,'SHE\'LL SEE IT FROM HER WINDOW',{size:56,fill:'#fff',sc:pop(lt,.4)})}`;}
  const cx=860,cy=380,R=230; const hanging=AT(t,hang); const ma=hanging?96:84;
  const kx=AT(t,slip)&&!hanging?r17_clockPt(cx,cy,R*.92,84,.8):null;
  const clock=AT(t,yell)?'12:14':'12:00';
  return `${R17_DEFS}${r17_bgStorm(g)}${r17_tower(cx,cy,R,g,{ma:t<yell?0:ma,ha:t<yell?0:7,hatch:[cx+250,cy-330]})}
   ${!AT(t,slip)?person({x:cx+250+Math.min(1,(t-mid)/2)*-40,y:cy-260,s:.45,t:g,who:'kai',pose:'hold',legs:'walk',mouth:'grin'}):''}
   ${kx?`<g transform="rotate(${(t-slip)*40} ${kx[0]} ${kx[1]})">${person({x:kx[0],y:kx[1]+60,s:.55,t:g,who:'kai',pose:'up',mouth:'o',brows:'raised',legs:'walk'})}</g>`:''}
   ${hanging?r17_kaiHang(cx,cy,R*.92,ma,.84,.6,g):''}
   ${labelPill(1600,160,clock,AT(t,yell)?P.red:P.gold,70)}
   ${AT(t,yell)&&!AT(t,slip)?T(1320,420,'AAAAH!',{size:110,fill:P.red,sc:pop(t,yell),rot:-6}):''}
   ${AT(t,slip)&&!hanging?T(1300,780,'WET STONE',{size:70,fill:'#A9D8FF',sc:pop(t,slip)}):''}
   ${hanging?T(1360,820,'JUST PAST THE THREE',{size:62,fill:P.gold,sc:pop(t,hang)}):''}${T(960,130-0,'MIDNIGHT',{size:70,fill:'#fff',op:t<yell?1:0})}`;
},
rwGears(t,d,p,g){
  const clunk=p.clunk??1.6, jump=p.jump??3.7, slide=p.slide??5.9, rule=p.rule??8.9, tip=p.tip??12.7, sh=p.shout??15.4, ks=p.kai??17.3;
  const step=AT(t,jump)?1:0, ma=96+6*eout(prog(t,jump,jump+.2)); const f=.84+.04*eout(prog(t,slide,slide+.8));
  const tm=t<jump?jump-t:60-(t-jump); const gr=AT(t,clunk)?(t<clunk+.25?prog(t,clunk,clunk+.25)*15:15):0;
  return `${R17_DEFS}${r17_bgTowerIn(g,{win:false})}
   <g transform="translate(470,470)">${r17_face(0,0,330,264-ma+180,0,{back:true,glow:.6})}</g>
   ${r17_gear(300,560,150,16,gr+g*2)}${r17_gear(520,380,100,11,-gr*1.5)}${r17_gear(700,600,120,12,gr*1.2)}
   ${glint({x:470,y:640,s:.75,t:g,pose:AT(t,sh)?'up':'down',mouth:AT(t,sh)?'teeth':'o',brows:'raised',blink:BL(g),look:1})}
   ${AT(t,clunk)?T(560,200,'CLUNK',{size:96,fill:P.gold,sc:pop(t,clunk),op:1-prog(t,clunk+2,clunk+2.5)}):''}
   <g transform="translate(1390,460)"><circle r="400" fill="#000" opacity=".25"/><g clip-path="url(#r17_cp)"><clipPath id="r17_cp"><circle r="380"/></clipPath>
     <g transform="translate(-1390,-460)">${r17_bgStorm(g,{city:0,rain:.6})}${r17_tower(1230,380,230,g,{ma})}${r17_kaiHang(1230,380,230*.92,ma,f,.55,g)}</g></g><circle r="380" fill="none" stroke="${INK}" stroke-width="16"/><circle r="380" fill="none" stroke="${P.gold}" stroke-width="7"/></g>
   ${AT(t,rule)?labelPill(1390,150,'1 NOTCH EVERY MINUTE',P.gold,48):''}
   ${AT(t,tip)?T(1390,880,'EVERY JUMP = STEEPER',{size:60,fill:P.red,sc:pop(t,tip)}):''}
   ${AT(t,sh)?bubble(420,170,420,110,"I'M COMING!",{size:54}):''}${AT(t,ks)?bubble(1500,250,380,110,'HURRY!',{size:64,tail:'right'}):''}
   ${AT(t,jump)?r17_timer(160+0,880,tm,g,{s:.7,label:'NEXT NOTCH'}):''}`;
},
rwTry12(t,d,p,g){
  const thr=p.throw??1, wind=p.wind??4.6, miss=p.miss??6.1, slip=p.slip??7.9, r1=p.r1??9.7, t2=p.t2??10.7, gust=p.gust??14.1, ch=p.chaos??16.4, m2=p.miss2??18.1, r2=p.r2??20.4;
  const second=t>=t2; const T0=second?t2:0; const lt=t-T0;
  const cx=1240,cy=600,R=270, ma=102; const [kx,ky]=r17_clockPt(cx,cy,R*.92,ma,.84);
  const hx=560,hy=250; const thrA=second?t2+.9:thr;
  const kk=eout(prog(t,thrA,thrA+(second?3:3.2))); const missX=second?250:130, missY=second?-140:-70;
  const end=[kx+missX*eout(prog(t,second?gust:wind,(second?gust:wind)+1.4)),ky-60+missY*eout(prog(t,second?gust:wind,(second?gust:wind)+1.4))];
  const rope=AT(t,thrA)?r17_rope([hx+40,hy+40,(hx+end[0])/2,hy-160,end[0],end[1]],Math.min(1,kk*1.05)):r17_coil(hx+60,hy+50,.7);
  const slipK=AT(t,slip)&&!second?1:0;
  const left=t<r1?4:t<r2?3:2; const tmBase=48, tm=tmBase-(t<r1?t:t<r2?t-r1:t-r2);
  const rk=Math.max(r17_rk(t,r1,1),r17_rk(t,r2,1));
  const windOn=second?AT(t,gust):AT(t,wind);
  const inner=`${r17_bgStorm(g,{rain:.8})}${r17_tower(cx,cy,R,g,{ma,top:false})}
    <rect x="300" y="0" width="560" height="${hy+70}" fill="${r17_STONE}" stroke="${INK}" stroke-width="10"/><rect x="${hx-90}" y="${hy-120}" width="200" height="170" rx="20" fill="#FFC86B" stroke="${INK}" stroke-width="9"/>
    ${glint({x:hx+10,y:hy-20,s:.55,t:g,pose:AT(t,thrA)&&kk<1?'point':'reach',mouth:AT(t,second?m2:miss)?'o':'teeth',brows:'angry',blink:BL(g)})}
    <rect x="${hx-110}" y="${hy+40}" width="240" height="30" rx="8" fill="#5A5280" stroke="${INK}" stroke-width="7"/>
    ${r17_kaiHang(cx,cy,R*.92,ma,.84,.6,g,{rot:slipK?18:0,mouth:'o'})}${rope}${windOn?r17_wind(g,1,250,400)+T(1040,240,'WIND',{size:60,fill:'#CFE6FF',stroke:11}):''}
    ${AT(t,second?m2:miss)?`<path d="M${kx} ${ky-60} H${end[0]}" stroke="${P.red}" stroke-width="8" stroke-dasharray="14 10"/>${T((kx+end[0])/2,ky-110,second?'MISSED BY 2 M':'MISSED BY 1 M',{size:58,fill:P.red,sc:pop(t,second?m2:miss)})}`:''}
    ${slipK&&t<r1?T(kx,ky+330,'FINGERS SLIPPING!',{size:58,fill:P.gold,sc:pop(t,slip)}):''}
    ${second&&AT(t,ch)?T(960,880,'CHAOS, AGAIN',{size:70,fill:P.red,sc:pop(t,ch)}):''}`;
  return `${R17_DEFS}${rk>0?r17_rewWrap(inner,rk,g,{hy:470}):inner}
   ${labelPill(170+30,150,second?'TRY 2':'TRY 1',P.gold,54)}${r17_left(1690,140,left,g,{s:.85})}${r17_timer(1690,330,tm,g,{s:.7,label:'NEXT NOTCH'})}`;
},
rwTry3(t,d,p,g){
  const go=p.go??3.5, q=p.q??6.2, brain_=p.brain??7.9, dr=p.drop??10.7, br=p.brush??14.3, miss=p.miss??15.9;
  const slow=AT(t,q)&&t<br; const fall=AT(t,go)? (t<q? (t-go)*.15 : t<br? .4+ (t-q)*.03 : .4+(br-q)*.03+(t-br)*.9 ):0;
  const ky=640+fall*80+(AT(t,miss)?Math.pow(Math.max(0,t-miss),2)*600:0);
  const tm=48-(t+21.3*0); const timer=r17_timer(1690,330,40-t,g,{s:.7,label:'NEXT NOTCH'});
  return `${R17_DEFS}${r17_bgStorm(g,{rain:.7,city:0})}${slow?`<rect width="1920" height="1080" fill="#7CC4FF" opacity=".12"/>`:''}
   ${r17_tower(1280,980,330,g,{ma:110,top:false})}
   <rect x="0" y="0" width="1100" height="330" fill="${r17_STONE}" stroke="${INK}" stroke-width="10"/><rect x="0" y="300" width="1100" height="40" fill="#5A5280" stroke="${INK}" stroke-width="8"/>
   <g transform="translate(720,250)">${glint({s:.85,t:g,pose:'point',rot:90,mouth:AT(t,miss)?'o':'teeth',brows:AT(t,miss)?'raised':'angry',blink:0})}</g>
   ${person({x:780,y:ky,s:.85,t:g,who:'kai',pose:'up',mouth:'o',brows:'raised',legs:'walk',sweat:1})}
   ${AT(t,q)?`<g transform="translate(1480,480) scale(${pop(t,q)})">${clockP(0,0,110,slow?g*.1:g)}</g>${T(1480,670,'0.25 SECONDS',{size:70,fill:P.gold,sc:pop(t,q)})}`:''}
   ${AT(t,brain_)&&!AT(t,dr)?T(1480,770,"GLINT'S REACTION TIME",{size:50,fill:'#fff',sc:pop(t,brain_)}):''}
   ${AT(t,dr)?`<g transform="translate(1080,${640-130})"><rect x="-22" y="0" width="44" height="${lerp(0,1,prog(t,dr,dr+.5))*0+ 120}" rx="6" fill="${P.gold}" stroke="${INK}" stroke-width="6"/>${[0,1,2].map(i=>`<path d="M-22 ${i*40+20} h18" stroke="${INK}" stroke-width="4"/>`).join('')}</g>${T(1240,610,'30 CM',{size:80,fill:P.gold,sc:pop(t,dr)})}`:''}
   ${AT(t,br)&&!AT(t,miss)?T(960,150,'BRUSH...',{size:96,fill:'#fff',sc:pop(t,br)}):''}${AT(t,miss)?T(960,150,'MISS!',{size:150,fill:P.red,sc:pop(t,miss)}):''}
   ${labelPill(200,420,'TRY 3',P.red,54)}${r17_left(1690,140,2,g,{s:.85})}${timer}`;
},
rwGrey(t,d,p,g){
  const one=p.one??4.9, nt=p.notch??6.9, city=p.city??9.6, nan=p.nan??12.3;
  if(t<city){ const rk=r17_rk(t,0,1); const grey=prog(t,.8,3);
    const inner=`${r17_bgTowerIn(g,{win:false})}${r17_coil(1300,820,1)}${glint({x:820,y:560,s:1.15,t:g,mouth:'o',brows:'sad',sweat:1,shiver:.6,lid:.3,pose:'hips'})}`;
    return `${R17_DEFS}${rk>0?r17_rewWrap(inner,rk,g,{hy:300}):inner}<rect width="1920" height="1080" fill="url(#r17_greyEdge)" opacity="${grey}"/>
     ${r17_left(1500,300,1,g,{s:1.2,flash:1-prog(t,.9,1.4)})}
     ${AT(t,one)?T(820,170,"ONE MORE, AND THAT'S IT",{size:80,fill:P.red,sc:pop(t,one)}):''}
     ${AT(t,nt)?r17_notches(1500,620,3,g,{s:1.2*pop(t,nt)}):''}${t>1.2&&t<one?T(820,170,'GASPING',{size:70,fill:'#C9D6FF',sc:pop(t,1.2)}):''}`;
  }
  const lt=t-city; const zoom=eout(prog(lt,.3,2.6));
  if(t<nan) return `${R17_DEFS}${r17_bgStorm(g,{rain:.5,city:1})}<g transform="translate(960,700) scale(${1+zoom*.6}) translate(-960,-700)"><g transform="translate(960,700)"><rect x="-220" y="-180" width="440" height="400" fill="#2E2646" stroke="${INK}" stroke-width="10"/><path d="M-260 -180 L0 -330 L260 -180Z" fill="#3A2E4E" stroke="${INK}" stroke-width="10"/><rect x="-90" y="-90" width="180" height="140" fill="#FFD27A" stroke="${INK}" stroke-width="8"/><circle cy="-20" r="200" fill="url(#gGold)" opacity=".5"/></g></g>${T(960,170,'ACROSS THE CITY...',{size:86,fill:P.gold,sc:pop(lt,.2)})}`;
  return `${R17_DEFS}${r17_bgKitchen(g)}${person({x:760,y:540,s:1.05,t:g,who:'nan',pose:'hold',mouth:'smile',blink:BL(g)})}${r17_cake(1120,760,1,g,prog(t,nan,nan+3))}
   ${pickles(1560,830,.7,g,{blink:1})}${T(960,160,'SHE HAS NO IDEA',{size:80,fill:'#fff',sc:pop(t,p.idea??14.2),op:AT(t,p.idea??14.2)?1:0})}`;
},
// ---------------- THE SOLUTION ----------------
rwThink(t,d,p,g){
  const wi=p.wind??2.3, ch=p.chaos??3.9, re=p.react??5.7, bi=p.bio??7.9, on=p.one??9.5, pe=p.pend??12.9;
  const card_=(x,lab,sub,col,a,b,inner,cross)=>`<g transform="translate(${x},460) scale(${pop(t,a)})"><rect x="-200" y="-220" width="400" height="440" rx="30" fill="#0E1A2A" stroke="${col}" stroke-width="9"/>${inner}${T(0,150,lab,{size:56,fill:'#fff',stroke:11})}${AT(t,b)?T(0,205,sub,{size:40,fill:col,stroke:9}):''}${cross?icon(cross,140,-180,.6*pop(t,b)):''}</g>`;
  const pend=`<g transform="translate(0,-200)">${r17_pend(0,0,230,Math.sin(g*2.4)*20,44,{glow:AT(t,pe)?.6:0})}</g>`;
  return `${R17_DEFS}${card('cardDark',g)}${glint({x:220,y:560,s:.8,t:g,mouth:AT(t,pe)?'grin':'flat',brows:AT(t,pe)?'raised':'angry',blink:BL(g),pose:AT(t,pe)?'point':'cross',glint:AT(t,pe)?1:0})}
   ${AT(t,wi)?card_(700,'WIND','= CHAOS',P.red,wi,ch,r17_wind(g,1,-200,200).replace(/M(-?[\d.]+) /g,(m,x)=>`M${(+x%380)-190} `)+`<g transform="translate(0,-40)">${[0,1,2].map(i=>`<path d="M-120 ${-60+i*50} q60 -40 120 0 t120 0" stroke="#CFE6FF" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('')}</g>`,'cross'):''}
   ${AT(t,re)?card_(1170,'REACTION','= BIOLOGY',P.red,re,bi,`<g transform="translate(0,-40)">${clockP(0,0,90,g)}</g>`,'cross'):''}
   ${AT(t,on)?card_(1640,'PENDULUM','NEVER CHAOTIC',P.mint,on,pe,AT(t,pe)?pend:T(0,-20,'?',{size:200,fill:P.gold}),AT(t,pe)?'check':null):''}
   ${T(960,140,AT(t,pe)?'THE PENDULUM.':'GLINT STOPS. THINKS.',{size:84,fill:AT(t,pe)?P.gold:'#fff',sc:pop(t,AT(t,pe)?pe:.1)})}`;
},
rwEscape(t,d,p,g){
  const cl=p.clocks??4.2, sw=p.swing??6.4, es=p.esc??9.3, stp=p.step??14.2, stop=p.stop??17.9, hand=p.hand??20.7;
  const stopK=AT(t,stop)?Math.max(0,1-(t-stop)*1.2):1; const A=22*stopK; const ph=g*Math.PI/1.0; const pa=Math.sin(ph)*A;
  const swings=Math.floor((g+.5)/1.0); const wheel=AT(t,stop)?Math.floor((stop+(g-t)+.5)/1.0)*24:swings*24+eout(clamp(((g+.5)%1.0)*6))*0;
  const zoom=AT(t,es);
  const esc=`<g transform="translate(1180,330)"><g transform="rotate(${pa*.9})"><path d="M-170 -10 Q0 -90 170 -10 L190 80 L150 70 L130 10 Q0 -40 -130 10 L-150 70 L-190 80Z" fill="#9AA7BD" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><circle r="22" fill="${INK}"/></g>
     <g transform="translate(0,230)">${r17_gear(0,0,170,15,wheel,'#E0B050')}</g></g>${r17_gear(1560,640,120,12,-wheel*1.4)}${r17_gear(1420,820,80,10,wheel*2.1)}`;
  return `${R17_DEFS}${card('cardGold',g)}${r17_pend(zoom?1180:760,zoom?330:120,zoom?560:600,pa,zoom?60:80)}${zoom?esc:''}
   ${!zoom?`${T(1380,330,'MOST PREDICTABLE',{size:72,fill:P.gold,sc:pop(t,.4)})}${T(1380,420,'THING IN PHYSICS',{size:72,fill:'#fff',sc:pop(t,.7)})}${AT(t,cl)?T(1380,560,'= WHY CLOCKS USE IT',{size:56,fill:P.mint,sc:pop(t,cl)}):''}
      ${AT(t,sw)?[0,1,2,3].map(i=>`<rect x="${1100+i*150}" y="700" width="130" height="50" rx="12" fill="${P.mint}" stroke="${INK}" stroke-width="6" opacity="${pop(t,sw+i*.2)}"/>`).join('')+T(1380,830,'EVERY SWING: SAME TIME',{size:52,fill:'#fff',sc:pop(t,sw)}):''}`:''}
   ${zoom?`${T(500,190,'THE ESCAPEMENT',{size:70,fill:P.gold,sc:pop(t,es)})}${AT(t,stp)?T(500,300,'1 SWING =',{size:60,fill:'#fff',sc:pop(t,stp)})+T(500,380,'1 TINY STEP',{size:72,fill:P.mint,sc:pop(t,stp+.2)}):''}
      ${AT(t,stop)?T(500,560,'STOP THE PENDULUM',{size:60,fill:P.red,sc:pop(t,stop)})+T(500,650,'= CLOCK STOPS',{size:60,fill:'#fff',sc:pop(t,stop+.5)}):''}
      ${AT(t,hand)?`<g transform="translate(500,800) scale(${pop(t,hand)*.6})">${r17_face(0,0,140,102,7)}</g>${T(780,820,'HAND FROZEN',{size:50,fill:P.gold,stroke:10,anchor:'start'})}`:''}`:''}`;
},
rwChoose(t,d,p,g){
  const fifth=p.fifth??2.2, cl=p.close??3.7, lo=p.lot??7.2, pl=p.plates??8.2, fa=p.falls??9.3, ch=p.choose??12.1, s=[p.s1??13.9,p.s2??15.1,p.s3??16.3,p.s4??17.6];
  const old=[['LOTTERY',lo],['PLATES',pl],['3 FALLS',fa],['20 WORDS',fa+.6]]; const nw=['LEFT STAIRS','RED DOOR','GRAB PENDULUM','THEN THE ROPE'];
  let sl='';for(let i=0;i<4;i++){const y=250+i*150;const gone=AT(t,old[i][1]);const k=prog(t,old[i][1],old[i][1]+.8);
    sl+=r17_slot(1240,y,620,120,'',{col:AT(t,s[i])?P.mint:'#5D587A'});
    if(!AT(t,s[i])&&k<1) sl+=`<g transform="translate(${1240+k*600},${y-k*200})" opacity="${1-k}">${T(0,18,old[i][0],{size:52,fill:'#C9D6FF',stroke:10})}</g>`;
    if(AT(t,s[i])) sl+=`<g transform="translate(1240,${y}) scale(${pop(t,s[i])})">${T(0,20,nw[i],{size:58,fill:'#fff',stroke:12})}</g>${T(900,y+20,String(i+1),{size:64,fill:P.mint})}`;}
  return `${R17_DEFS}${card('cardMint',g)}${glint({x:420,y:560,s:1.05,t:g,eyes:AT(t,cl)?'closed':'open',mouth:AT(t,ch)?'flat':'o',brows:'calm',blink:0})}
   ${AT(t,cl)?`<circle cx="420" cy="500" r="${200+Math.sin(g*3)*10}" fill="url(#gMint)" opacity=".4"/>`:''}${T(1240,110,'ROOM FOR 4 THINGS',{size:72,fill:P.mint,sc:pop(t,.1)})}${sl}
   ${AT(t,fifth)&&!AT(t,lo)?`${r17_slot(1240,860,620,90,'',{col:P.red,op:.8})}${T(1240,880,'NOT A FIFTH',{size:52,fill:P.red,stroke:10})}`:''}`;
},
rwRun(t,d,p,g){
  const back=p.back??1.1, rope=p.rope??2.8, echo=p.echo??5.2, run=p.run??7.5, st=p.stairs??8.7, door=p.door??10.8, room=p.room??13.1, hug=p.hug??18.3, drag=p.drag??22.9, slow=p.slow??24.5, stops=p.stops??25.8;
  const cks=[AT(t,st)?1:0,AT(t,door)?1:0,AT(t,stops)?1:0,0];
  const list=`<g transform="translate(1660,260) scale(.62)">${['LEFT STAIRS','RED DOOR','GRAB PENDULUM','THEN THE ROPE'].map((l,i)=>r17_slot(0,i*140,560,110,l,{col:cks[i]?P.mint:'#5D587A',check:cks[i]?pop(t,[st,door,stops][i]):0})).join('')}</g>`;
  const tm=60-(t-back);
  if(t<run){ const rk=r17_rk(t,0,1.1);
    const inner=`${r17_bgTowerIn(g,{win:false})}${r17_coil(1100,820,1.1)}${glint({x:700,y:560,s:1.1,t:g,pose:'flex',mouth:'grin',brows:'angry',blink:BL(g)})}`;
    return `${R17_DEFS}${rk>0?r17_rewWrap(inner,rk,g,{hy:300}):inner}${t<.6?T(960,520,'SNAP',{size:200,fill:P.gold,sc:pop(t,0)}):''}
     ${AT(t,back)?T(960,170,'60 SECONDS BACK',{size:86,fill:P.mint,sc:pop(t,back)}):''}${AT(t,rope)?T(1100,700,'ROPE: BACK AT HIS FEET',{size:46,fill:'#fff',stroke:10,sc:pop(t,rope)}):''}
     ${AT(t,echo)?T(1400,380,'aaaah...',{size:70,fill:P.red,op:.6,sc:pop(t,echo)}):''}
     ${r17_left(1690,140,0,g,{s:.85,flash:1-prog(t,.8,1.3)})}${list}${r17_timer(1690,850,tm,g,{s:.7,label:'NEXT NOTCH'})}`;
  }
  if(t<room){ const lt=t-run; const dr=AT(t,door);
    let steps='';for(let i=0;i<9;i++) steps+=`<rect x="${200+i*140}" y="${860-i*70}" width="150" height="${70+i*70}" fill="#3A2E4E" stroke="${INK}" stroke-width="7"/>`;
    const gx=dr?lerp(1200,1500,prog(t,door,door+1)):lerp(260,1150,prog(t,run,door)); const gy=dr?300:lerp(560,0,prog(t,run,door))+ (dr?0:0);
    return `${R17_DEFS}${r17_bgTowerIn(g,{win:false})}${steps}<g transform="translate(1560,330)">${dr?`<g transform="rotate(${-70*eout(prog(t,door,door+.3))} -110 0)"><rect x="-110" y="-190" width="220" height="380" fill="${P.red}" stroke="${INK}" stroke-width="10"/></g><rect x="-110" y="-190" width="220" height="380" fill="#1A1626" opacity=".6"/>`:`<rect x="-110" y="-190" width="220" height="380" fill="${P.red}" stroke="${INK}" stroke-width="10"/><circle cx="70" cy="10" r="14" fill="${P.gold}" stroke="${INK}" stroke-width="5"/>`}</g>
     ${glint({x:gx,y:Math.min(gy,560)+0,s:.7,t:g,legs:'walk',pose:'reach',mouth:'teeth',brows:'angry',blink:0})}
     ${AT(t,st)&&!dr?T(700,180,'3 AT A TIME',{size:72,fill:P.gold,sc:pop(t,st)}):''}${dr?T(1000,180,'SHOULDER FIRST!',{size:80,fill:P.red,sc:pop(t,door)}):''}
     ${list}${r17_timer(1690,850,tm,g,{s:.7,label:'NEXT NOTCH'})}`;
  }
  const holdK=AT(t,hug); const amp=!holdK?18:AT(t,stops)?0:AT(t,slow)?lerp(9,0,prog(t,slow,stops)):AT(t,drag)?12:lerp(18,12,prog(t,hug,hug+1.5));
  const pa=Math.sin(g*2.2)*amp; const bx=960+Math.sin(r17_rad(pa))*560, by=40+Math.cos(r17_rad(pa))*560;
  let dust='';const r=rng(3);for(let i=0;i<40;i++) dust+=`<circle cx="${r()*1920}" cy="${(r()*1080+g*12*(1+r()))%1080}" r="${2+r()*3}" fill="#E8D7AA" opacity="${.15+r()*.25}"/>`;
  return `${R17_DEFS}${r17_bgTowerIn(g,{win:false})}<rect width="1920" height="1080" fill="#C9A46A" opacity=".1"/>${dust}${r17_gear(1500,380,150,15,AT(t,stops)?0:g*15)}${r17_gear(380,330,110,12,AT(t,stops)?0:-g*20)}
   ${r17_pend(960,40,560,pa,90)}
   ${holdK?glint({x:bx-60,y:by-10,s:.85,t:g,pose:'reach',mouth:AT(t,stops)?'grin':'teeth',brows:'angry',legs:'walk',rot:pa*.6}):glint({x:lerp(1500,1150,prog(t,room,room+3)),y:560,s:.85,t:g,legs:'walk',pose:'reach',mouth:'o',brows:'raised'})}
   ${!holdK?T(960,880-0,'TICK... TOCK...',{size:64,fill:'#E8D7AA',sc:pop(t,room+.3)}):''}
   ${AT(t,drag)&&!AT(t,slow)?T(960,880,'IT DRAGS HIM',{size:64,fill:'#fff',sc:pop(t,drag)}):''}${AT(t,slow)&&!AT(t,stops)?T(960,880,'SLOWER...',{size:72,fill:P.gold,sc:pop(t,slow)}):''}
   ${AT(t,stops)?T(960,880,'STOPPED.',{size:110,fill:P.mint,sc:pop(t,stops)}):''}${list}${r17_timer(1690,850,tm,g,{s:.7,label:'NEXT NOTCH',stopped:AT(t,stops)})}`;
},
rwRescue(t,d,p,g){
  const nr=p.norush??4, lo=p.lower??6, nt=p.nothrow??9.1, nw=p.nowind??10.1, lp=p.loop??11.7, hl=p.haul??13.7;
  const cx=900,cy=560,R=290,ma=102; const [kx0,ky0]=r17_clockPt(cx,cy,R*.92,ma,.84);
  const hx=kx0, hy=110; const ropeY=lerp(hy+40,ky0-60,eout(prog(t,lo,lo+2)));
  const up=eout(prog(t,hl,hl+4.5)); const lift=up*(ky0-hy+40);
  const frozen=`${T(cx-200,cy+R+120,'MINUTE HAND: FROZEN',{size:56,fill:P.mint,sc:pop(t,.5)})}`;
  return `${R17_DEFS}${r17_bgStorm(g,{rain:.4})}${r17_tower(cx,cy,R,g,{ma,top:false})}
   <rect x="${hx-120}" y="0" width="240" height="${hy+30}" fill="${r17_STONE}"/><rect x="${hx-90}" y="${hy-90}" width="180" height="120" rx="16" fill="#FFC86B" stroke="${INK}" stroke-width="8"/><rect x="${hx-110}" y="${hy+20}" width="220" height="26" rx="8" fill="#5A5280" stroke="${INK}" stroke-width="7"/>
   ${glint({x:hx-10,y:hy-70,s:.42,t:g,pose:'reach',mouth:up>0?'teeth':'smile',brows:'angry',blink:BL(g)})}
   ${AT(t,lo)?`<path d="M${hx} ${hy+30} V${ropeY-lift}" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M${hx} ${hy+30} V${ropeY-lift}" stroke="#E8C98A" stroke-width="10" stroke-dasharray="14 8"/>`:''}
   ${up>0?person({x:kx0,y:ky0+60-lift,s:.6,t:g,who:'kai',pose:'up',mouth:'grin',brows:'raised',legs:'stand'}):r17_kaiHang(cx,cy,R*.92,ma,.84,.6,g,{mouth:AT(t,lp)?'smile':'o'})}
   ${AT(t,lp)?`<ellipse cx="${kx0}" cy="${ky0+120-lift}" rx="70" ry="22" fill="none" stroke="#E8C98A" stroke-width="12"/>`:''}
   ${t<lo?frozen:''}${AT(t,nr)&&t<lo+2?T(1500,330,'NO RUSH NOW',{size:70,fill:P.gold,sc:pop(t,nr)}):''}
   ${AT(t,nt)?T(1500,330,'NO THROWING',{size:64,fill:'#fff',sc:pop(t,nt)}):''}${AT(t,nw)?T(1500,430,'NO WIND GAMES',{size:64,fill:'#fff',sc:pop(t,nw)}):''}
   ${AT(t,hl)?T(1500,600,'INCH BY INCH',{size:70,fill:P.mint,sc:pop(t,hl)}):''}${r17_timer(1690,850,0,g,{s:.7,label:'NEXT NOTCH',stopped:true})}`;
},
// ---------------- THE TWIST ----------------
rwFloor(t,d,p,g){
  const od=p.odd??3.8, we=p.weird??6.4, fe=p.fell??8.7, ca=p.cant??11.9, fo=p.forever??16.2;
  const sad=AT(t,ca);
  let falls='';if(sad) for(let i=0;i<3;i++){const k=((g*.5+i/3)%1);falls+=`<g opacity="${(1-k)*.8}">${person({x:1240+i*170,y:240+k*120,s:.28,t:g,who:'kai',pose:'up',mouth:'o',legs:'walk',rot:k*40})}</g>`;}
  return `${R17_DEFS}${r17_bgTowerIn(g,{win:true})}
   <g transform="translate(560,760) rotate(-90)">${glint({s:.85,t:g,mouth:sad?'flat':'grin',brows:sad?'sad':'raised',blink:BL(g),pose:'up'})}</g>
   <g transform="translate(1180,780) rotate(90)">${person({s:.85,t:g,who:'kai',mouth:AT(t,we)?'flat':'laugh',brows:AT(t,we)?'raised':'calm',pose:'up'})}</g>
   ${!AT(t,od)?T(960,160,'LAUGHING AND SHAKING',{size:76,fill:P.gold,sc:pop(t,.4)}):''}
   ${AT(t,we)&&!sad?bubble(1160,300,780,170,AT(t,fe)?"I FEEL LIKE I'VE FALLEN 3 TIMES":'WEIRD.',{size:AT(t,fe)?44:80,tail:'right'})+(AT(t,fe)?T(1160,350,'TONIGHT.',{size:44,fill:INK,stroke:0}):''):''}
   ${sad?`<g><path d="M1080 120 H1820 V420 H1080Z" fill="#1A1630" stroke="#C9D6FF" stroke-width="6" stroke-dasharray="16 10" rx="20"/>${falls}</g>${T(560,240,"HE CAN'T TELL HIM",{size:60,fill:'#C9D6FF',sc:pop(t,ca)})}`:''}
   ${AT(t,fo)?T(1450,520,'ALONE. FOREVER.',{size:66,fill:'#C9D6FF',sc:pop(t,fo)}):''}`;
},
rwBrithday(t,d,p,g){
  const la=p.laugh??4.1, sp=p.spell??7.1, no=p.none??9.8;
  const reveal=AT(t,sp);
  return `${R17_DEFS}<rect width="1920" height="1080" fill="url(#r17_morning)"/><circle cx="1700" cy="200" r="90" fill="${P.gold}" stroke="${INK}" stroke-width="8"/><circle cx="1700" cy="200" r="240" fill="url(#gGold)" opacity=".6"/>
   ${r17_tower(1260,330,170,g,{ma:102,ha:7})}
   <path d="M${1260-230} ${330+190} L${1260+230} ${330+190}" stroke="${INK}" stroke-width="6"/>
   ${r17_banner(1260,560,reveal?720:620,reveal?'HAPPY BRITHDAY NAN':'HAPPY ... NAN',g,{s:reveal?1+.06*pop(t,sp):1})}
   ${reveal?`<ellipse cx="${1260-30}" cy="${560+62}" rx="150" ry="56" fill="none" stroke="${P.red}" stroke-width="10" transform="rotate(-4 1230 622)"/>`:''}
   <g transform="translate(470,620)"><rect x="-330" y="-330" width="660" height="560" fill="#5A3550" stroke="${INK}" stroke-width="12"/><rect x="-260" y="-260" width="520" height="420" fill="#FFE9C0" stroke="${INK}" stroke-width="10"/>
    <g transform="translate(0,-40)">${person({s:.9,t:g,who:'nan',pose:AT(t,la)?'hips':'point',mouth:AT(t,la)?'laugh':'o',brows:'raised',legs:AT(t,la)?'sit':'stand',blink:BL(g)})}</g><path d="M-260 160 H260" stroke="${INK}" stroke-width="10"/></g>
   ${AT(t,la)?T(470,200,'HA HA HA!',{size:96,fill:P.gold,sc:pop(t,la)}):''}${T(960,140,'THE NEXT MORNING',{size:70,fill:'#fff',op:AT(t,la)?0:1})}
   ${AT(t,sp)?T(1260,820,"IT'S 'BIRTHDAY', KAI",{size:58,fill:P.red,sc:pop(t,sp+.6)}):''}
   ${AT(t,no)?r17_left(1690,380,0,g,{s:1.1,flash:1-prog(t,no,no+.5)}):''}`;
}
});
