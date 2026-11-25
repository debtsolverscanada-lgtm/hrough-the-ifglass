// episode 028 scenes (everyone gone) — story episode. Cold teal daylight + golden hour; night blue for the grid going dark.
const t28_DEF=`<defs>
 <linearGradient id="t28day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FA9B8"/><stop offset=".62" stop-color="#B9E0D6"/><stop offset="1" stop-color="#F6D7A2"/></linearGradient>
 <linearGradient id="t28gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#245E78"/><stop offset=".55" stop-color="#E7965A"/><stop offset="1" stop-color="#FFD58A"/></linearGradient>
 <linearGradient id="t28night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040817"/><stop offset=".7" stop-color="#0D2140"/><stop offset="1" stop-color="#173458"/></linearGradient>
 <linearGradient id="t28snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1428"/><stop offset=".7" stop-color="#22385E"/><stop offset="1" stop-color="#3E5A84"/></linearGradient>
 <linearGradient id="t28water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FC8F0"/><stop offset="1" stop-color="#0A3C78"/></linearGradient>
 <linearGradient id="t28murk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E6A6A"/><stop offset="1" stop-color="#132A30"/></linearGradient>
 <radialGradient id="t28blue"><stop offset="0" stop-color="#9FF0FF" stop-opacity=".95"/><stop offset="1" stop-color="#2AA8FF" stop-opacity="0"/></radialGradient>
 <radialGradient id="t28lamp"><stop offset="0" stop-color="#FFE2A0" stop-opacity=".95"/><stop offset="1" stop-color="#FFB050" stop-opacity="0"/></radialGradient>
</defs>`;
const t28_TEAL='#5FE0D0', t28_AMB='#FFB650';
const t28_f=n=>(+n).toFixed(1);
// ---------- HUD ----------
function t28_fmt(sec){sec=Math.max(0,Math.ceil(sec));const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}
function t28_timer(sec,g,o={}){const {x=1400,y=120,s=1,label='BACKUP DIESEL'}=o;const c=sec<=3600?P.red:t28_AMB;const pl=1+.03*Math.sin(g*8);
  return `<g transform="translate(${x},${y}) scale(${(s*pl).toFixed(3)})"><rect x="-240" y="-82" width="480" height="164" rx="20" fill="#08121C" fill-opacity=".92" stroke="${c}" stroke-width="7"/>
   <g transform="translate(-196,-40)"><rect x="-14" y="-12" width="28" height="26" rx="4" fill="${c}"/><path d="M-6 -12 V-20 H8" stroke="${c}" stroke-width="5" fill="none"/></g>
   <text x="16" y="-30" text-anchor="middle" font-size="30" font-weight="900" letter-spacing="3" fill="${c}">${label}</text>
   <text y="54" text-anchor="middle" font-size="86" font-weight="900" fill="#fff" style="font-variant-numeric:tabular-nums">${t28_fmt(sec)}</text></g>`;}
function t28_pm(t,kind,sub){const plus=kind==='plus',col=plus?P.mint:P.red,k=eout(prog(t,2.0,2.6)),sc=lerp(1,.4,k)*pop(t,.02,.4),x=lerp(960,470,k),y=lerp(470,105,k);
  return `<rect width="1920" height="1080" fill="#03070C" opacity="${(.62*(1-k)).toFixed(3)}"/><g transform="translate(${t28_f(x)},${t28_f(y)}) scale(${sc.toFixed(3)}) rotate(${(-3*(1-k)).toFixed(2)})">${T(0,0,plus?'PLUS:':'MINUS:',{size:230,fill:col,stroke:52})}${T(0,150,sub,{size:96,fill:P.white})}</g>`;}
const t28_pill=(x,y,str,col,t,a,size=44)=>AT(t,a)?`<g transform="translate(${x},${y}) scale(${pop(t,a).toFixed(3)})">${labelPill(0,0,str,col,size)}</g>`:'';
const t28_head=(t,a,str,col=P.white,size=90,y=150)=>AT(t,a)?T(960,y,str,{size,fill:col,sc:pop(t,a)}):'';
// Glint wearing a backpack with Mr. Pickles peeking over his shoulder (draw BEFORE glint so straps sit in front)
function t28_pack(x,y,s,g){const by=Math.sin(g*2.4)*5;return `<g transform="translate(${x},${t28_f(y+by)}) scale(${s})">${pickles(150,-10,.62,g,{mood:'grump',blink:BL(g+2)})}<rect x="40" y="0" width="170" height="190" rx="34" fill="#3E6E8A" stroke="${INK}" stroke-width="8"/><rect x="66" y="60" width="118" height="70" rx="14" fill="#2E5670" stroke="${INK}" stroke-width="5"/></g>`;}
function t28_straps(x,y,s,g){const by=Math.sin(g*2.4)*5;return `<g transform="translate(${x},${t28_f(y+by)}) scale(${s})"><path d="M30 30 Q50 90 40 160" stroke="${INK}" stroke-width="20" fill="none"/><path d="M30 30 Q50 90 40 160" stroke="#3E6E8A" stroke-width="10" fill="none"/></g>`;}
// ---------- sets ----------
function t28_sky(mode,g){const id={day:'t28day',gold:'t28gold',night:'t28night',snow:'t28snow'}[mode]||'t28day';let st='';
  if(mode==='night'||mode==='snow'){const r=rng(28);for(let i=0;i<110;i++)st+=`<circle cx="${(r()*1920).toFixed(0)}" cy="${(r()*620).toFixed(0)}" r="${(r()*2.2+.5).toFixed(1)}" fill="#fff" opacity="${(.25+.6*Math.abs(Math.sin(g*1.5+i))).toFixed(2)}"/>`;}
  const sun=mode==='gold'?`<circle cx="1540" cy="560" r="330" fill="url(#t28lamp)" opacity=".75"/><circle cx="1540" cy="560" r="80" fill="#FFE7B0"/>`:mode==='day'?`<circle cx="1580" cy="190" r="260" fill="url(#gWhite)" opacity=".35"/><circle cx="1580" cy="190" r="64" fill="#FFF7DE"/>`:'';
  return `${t28_DEF}<rect width="1920" height="1080" fill="url(#${id})"/>${st}${sun}`;}
// empty street in one-point perspective. wild 0..1 = how overgrown, lit = fraction of windows lit (night)
function t28_street(g,o={}){const {mode='day',wild=0,lit=0,snow=0,cam=0,bare=0}=o;const VX=960+cam*.1,VY=540;
  const wallCol=mode==='night'||mode==='snow'?['#14203A','#1A2A48']:mode==='gold'?['#8A5A4A','#A86C52']:['#5E8C96','#77A6AE'];
  const nearL={x:-40,top:-80,bot:1010},farL={x:VX-150,top:VY-140,bot:VY+40},nearR={x:1960,top:-80,bot:1010},farR={x:VX+150,top:VY-140,bot:VY+40};
  const map=(n,f,u,v)=>{const x=lerp(n.x,f.x,u),top=lerp(n.top,f.top,u),bot=lerp(n.bot,f.bot,u);return [x,lerp(top,bot,v)];};
  const quad=(n,f,u1,u2,v1,v2,fill,op=1)=>{const a=map(n,f,u1,v1),b=map(n,f,u2,v1),c=map(n,f,u2,v2),d=map(n,f,u1,v2);return `<path d="M${t28_f(a[0])} ${t28_f(a[1])} L${t28_f(b[0])} ${t28_f(b[1])} L${t28_f(c[0])} ${t28_f(c[1])} L${t28_f(d[0])} ${t28_f(d[1])}Z" fill="${fill}" opacity="${op}" stroke="${INK}" stroke-width="3"/>`;};
  const r=rng(9);let w='';const D=[0,.3,.5,.64,.74,.81,.86,.9,.93];
  [[nearL,farL],[nearR,farR]].forEach(([n,f],side)=>{w+=quad(n,f,0,1,0,1,wallCol[side]);
    for(let i=0;i<D.length-1;i++){const u1=D[i]+.04*(D[i+1]-D[i]),u2=D[i+1]-.3*(D[i+1]-D[i]);
      for(let j=0;j<4;j++){const v1=.08+j*.2,v2=v1+.12;const on=r()<lit;w+=quad(n,f,u1,u2,v1,v2,on?'#FFD27A':(mode==='night'||mode==='snow'?'#0A1224':'#2E4A56'),1);}}
    const gr=wild*1;if(gr>0)for(let i=0;i<14;i++){const u=r()*.85,p=map(n,f,u,1);const rr=(60-u*50)*gr*(.6+r()*.6);w+=`<circle cx="${t28_f(p[0])}" cy="${t28_f(p[1]-rr*.4)}" r="${t28_f(rr)}" fill="${bare?'#5A4A3A':i%2?'#3E8A4A':'#2E7A3E'}" stroke="${INK}" stroke-width="4"/>`;
      const p2=map(n,f,u,.2+r()*.6);if(!bare)w+=`<path d="M${t28_f(p2[0])} ${t28_f(p2[1])} q${t28_f(18-u*14)} ${t28_f(40-u*30)} 0 ${t28_f(90-u*70)}" stroke="#3E9A4A" stroke-width="${t28_f(9-u*6)}" fill="none" opacity="${gr.toFixed(2)}"/>`;}});
  const road=`<path d="M-40 1080 L${VX-150} ${VY+40} L${VX+150} ${VY+40} L1960 1080Z" fill="${mode==='night'||mode==='snow'?'#1A2236':'#4A5A62'}"/>
   ${[0,1,2,3,4,5].map(i=>{const a=1-Math.pow(.62,i),b=1-Math.pow(.62,i+.5);const y1=lerp(1080,VY+40,a),y2=lerp(1080,VY+40,b),w1=lerp(26,3,a),w2=lerp(26,3,b);return `<path d="M${t28_f(VX-w1)} ${t28_f(y1)} L${t28_f(VX-w2)} ${t28_f(y2)} L${t28_f(VX+w2)} ${t28_f(y2)} L${t28_f(VX+w1)} ${t28_f(y1)}Z" fill="#F2E6C8" opacity=".85"/>`;}).join('')}`;
  let cracks='';if(wild>0){const r2=rng(4);for(let i=0;i<10;i++){const x=300+r2()*1320,y=760+r2()*300,s=.5+r2()*.8;cracks+=`<path d="M${t28_f(x)} ${t28_f(y)} l${t28_f(40*s)} -${t28_f(10*s)} l${t28_f(30*s)} ${t28_f(16*s)}" stroke="#222" stroke-width="4" fill="none"/>${bare?'':`<path d="M${t28_f(x+30*s)} ${t28_f(y)} q-10 -${t28_f(40*s*wild)} -20 -${t28_f(60*s*wild)} M${t28_f(x+30*s)} ${t28_f(y)} q10 -${t28_f(40*s*wild)} 24 -${t28_f(56*s*wild)}" stroke="#4FB85A" stroke-width="7" fill="none" stroke-linecap="round"/>`}`;}}
  const sn=snow?`<path d="M-40 1080 L${VX-150} ${VY+42} L${VX+150} ${VY+42} L1960 1080Z" fill="#E8F0FF" opacity="${(.7*snow).toFixed(2)}"/>`:'';
  return `${t28_sky(mode,g)}<path d="M${VX-200} ${VY+40} L${VX-170} ${VY-260} L${VX-60} ${VY-300} L${VX+40} ${VY-220} L${VX+180} ${VY-280} L${VX+210} ${VY+40}Z" fill="${mode==='night'||mode==='snow'?'#0E1830':'#7FA9B4'}" opacity=".9"/>${road}${w}${cracks}${sn}`;}
// city skyline across the river; lit = fraction of lit windows
function t28_skyline(g,o={}){const {lit=0,y0=760,col='#0E1A30',seed=31,one=null}=o;const r=rng(seed);let s='',x=-40,i=0;
  while(x<1980){const w=90+r()*150,h=180+r()*360;s+=`<rect x="${t28_f(x)}" y="${t28_f(y0-h)}" width="${t28_f(w)}" height="${t28_f(h+400)}" fill="${col}" stroke="${INK}" stroke-width="3"/>`;
    for(let a=0;a<Math.floor(h/60);a++)for(let b=0;b<Math.floor(w/40);b++){const on=r()<lit;if(on)s+=`<rect x="${t28_f(x+12+b*38)}" y="${t28_f(y0-h+20+a*58)}" width="18" height="24" fill="#FFD27A" opacity=".9"/>`;}
    x+=w+10;i++;}
  return s;}
function t28_tree(x,y,s,o={}){const {leaves=1,snow=0,col='#3E8A4A'}=o;return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-14 0 L-10 -200 L10 -200 L14 0Z" fill="#4A3426" stroke="${INK}" stroke-width="6"/><path d="M0 -150 L-80 -260 M0 -180 L70 -280 M0 -200 L-20 -320 M-50 -220 L-110 -250 M40 -240 L110 -260" stroke="#4A3426" stroke-width="12" stroke-linecap="round"/>
  ${leaves>0?`<g opacity="${leaves}"><circle cx="-70" cy="-270" r="80" fill="${col}" stroke="${INK}" stroke-width="6"/><circle cx="60" cy="-290" r="86" fill="${col}" stroke="${INK}" stroke-width="6"/><circle cx="-10" cy="-340" r="90" fill="#4E9A56" stroke="${INK}" stroke-width="6"/></g>`:''}
  ${snow?`<path d="M-80 -262 l-30 -14 M70 -282 l40 -12 M-20 -322 l0 -10" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="${snow}"/>`:''}</g>`;}
// the nuclear plant: containment dome, fuel building, turbine hall, stack, river
function t28_plant(x,y,s,g,o={}){const {warn=0,river=1,cut=0}=o;const bl=warn&&Math.sin(g*6)>0;
  return `<g transform="translate(${x},${y}) scale(${s})">${river?`<path d="M-900 120 Q0 80 900 120 V260 H-900Z" fill="#2E6E8A" stroke="${INK}" stroke-width="6"/><path d="M-700 170 h140 M-200 200 h180 M300 160 h160" stroke="#9FE0F0" stroke-width="6" stroke-linecap="round" opacity=".6"/>`:''}
   <rect x="-520" y="-160" width="520" height="280" fill="#C8D2DC" stroke="${INK}" stroke-width="8"/><path d="M-520 -160 L-260 -220 L0 -160" fill="#AEB8C4" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
   ${[0,1,2,3].map(i=>`<rect x="${-490+i*120}" y="-110" width="80" height="40" fill="#5A6E80"/>`).join('')}
   <rect x="40" y="-320" width="300" height="440" fill="#E4E8EE" stroke="${INK}" stroke-width="8"/><path d="M40 -320 A150 150 0 0 1 340 -320Z" fill="#E4E8EE" stroke="${INK}" stroke-width="8"/>
   <rect x="380" y="-120" width="260" height="240" fill="#B8C4D0" stroke="${INK}" stroke-width="8"/><text x="510" y="-50" text-anchor="middle" font-size="30" font-weight="900" fill="${INK}">FUEL</text>
   ${cut?`<rect x="410" y="-20" width="200" height="120" fill="#0A3C78" stroke="${INK}" stroke-width="6"/><rect x="410" y="-20" width="200" height="120" fill="url(#t28blue)" opacity="${(.6+.3*Math.sin(g*3)).toFixed(2)}"/>`:''}
   <rect x="660" y="-460" width="50" height="580" fill="#D0D6DE" stroke="${INK}" stroke-width="7"/><path d="M660 -400 h50 M660 -340 h50" stroke="${P.red}" stroke-width="12"/>
   <circle cx="685" cy="-470" r="${bl?16:10}" fill="${bl?P.red:'#7A2A2A'}" stroke="${INK}" stroke-width="4"/>${bl?`<circle cx="685" cy="-470" r="80" fill="url(#gRed)"/>`:''}
   <path d="M-560 120 H760" stroke="${INK}" stroke-width="8"/></g>`;}
function t28_gauge(x,y,r,frac,label,o={}){const {col=P.red}=o;const a=-120+240*clamp(frac);
  return `<g transform="translate(${x},${y})"><circle r="${r}" fill="#F4F0E6" stroke="${INK}" stroke-width="9"/>
   <path d="M${t28_f(-r*.72*Math.cos(Math.PI/6))} ${t28_f(r*.72*.5)} A${r*.72} ${r*.72} 0 0 1 ${t28_f(-r*.72*Math.cos(Math.PI/6)+r*.72*.6)} ${t28_f(-r*.72*.25)}" stroke="${P.red}" stroke-width="${r*.12}" fill="none"/>
   <text x="${-r*.6}" y="${r*.62}" font-size="${r*.3}" font-weight="900" fill="${INK}">E</text><text x="${r*.42}" y="${r*.62}" font-size="${r*.3}" font-weight="900" fill="${INK}">F</text>
   <g transform="rotate(${a.toFixed(1)})"><path d="M0 0 V${-r*.78}" stroke="${col}" stroke-width="${r*.08}" stroke-linecap="round"/></g><circle r="${r*.1}" fill="${INK}"/>
   ${label?`<text y="${r*1.45}" text-anchor="middle" font-size="${r*.32}" font-weight="900" fill="#fff" stroke="${INK}" stroke-width="${r*.06}" paint-order="stroke">${label}</text>`:''}</g>`;}
function t28_gen(x,y,s,g,o={}){const {run=1,fuel=.5,shake=0}=o;const jx=run?Math.sin(g*40)*2:0;let puff='';
  if(run)for(let i=0;i<5;i++){const k=((g*.9+i/5)%1);puff+=`<circle cx="${t28_f(150+Math.sin(g+i)*12)}" cy="${t28_f(-230-k*200)}" r="${t28_f(18+k*40)}" fill="#6A707E" opacity="${(run*.5*(1-k)).toFixed(2)}"/>`;}
  return `<g transform="translate(${t28_f(x+jx)},${y}) scale(${s})"><ellipse cx="0" cy="150" rx="300" ry="20" fill="rgba(0,0,0,.35)"/>${puff}
   <rect x="120" y="-230" width="40" height="110" fill="#5D6A82" stroke="${INK}" stroke-width="6"/>
   <rect x="-280" y="-130" width="560" height="270" rx="18" fill="#E9B23A" stroke="${INK}" stroke-width="9"/>
   ${[0,1,2,3,4,5].map(i=>`<path d="M${-240+i*36} -90 V40" stroke="#B8861E" stroke-width="12" stroke-linecap="round"/>`).join('')}
   <text x="-110" y="100" text-anchor="middle" font-size="34" font-weight="900" fill="${INK}">DIESEL</text>
   ${t28_gauge(150,-10,80,fuel,'')}</g>`;}
function t28_pool(x,y,s,g,o={}){const {level=1,glow=1,warm=0,inlet=0,steam=0,label=true}=o;const H=520,W=760,wl=-H*level;let rods='';
  for(let i=0;i<9;i++)rods+=`<rect x="${-330+i*76}" y="-160" width="52" height="150" rx="6" fill="${warm>.5?'#FF7A4A':'#8FA0B4'}" stroke="${INK}" stroke-width="5"/><path d="M${-318+i*76} -150 v130 M${-304+i*76} -150 v130" stroke="${INK}" stroke-width="3" opacity=".5"/>`;
  let st='';if(steam>0)for(let i=0;i<7;i++){const k=((g*.4+i/7)%1);st+=`<circle cx="${-300+i*100}" cy="${t28_f(wl-k*240)}" r="${t28_f(30+k*50)}" fill="#E8F4FF" opacity="${(steam*.45*(1-k)).toFixed(2)}"/>`;}
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="${-W/2-60}" y="${-H-60}" width="${W+120}" height="${H+100}" fill="#8A949E" stroke="${INK}" stroke-width="9"/>
   <rect x="${-W/2}" y="${-H}" width="${W}" height="${H}" fill="#1A2636"/>
   <rect x="${-W/2}" y="${t28_f(wl)}" width="${W}" height="${t28_f(-wl)}" fill="url(#t28water)" opacity=".95"/>
   ${glow?`<ellipse cx="0" cy="-90" rx="${t28_f(360+20*Math.sin(g*2))}" ry="180" fill="url(#t28blue)" opacity="${(glow*(.55+.15*Math.sin(g*3))).toFixed(2)}"/>`:''}
   ${warm?`<ellipse cx="0" cy="-90" rx="380" ry="200" fill="url(#gWarm)" opacity="${(warm*.6).toFixed(2)}"/>`:''}${rods}
   <path d="M${-W/2} ${t28_f(wl)} ${[...Array(12)].map((_,i)=>`q${W/24} ${(Math.sin(g*3+i)*8).toFixed(1)} ${W/12} 0`).join(' ')}" stroke="#CFF6FF" stroke-width="6" fill="none"/>
   ${inlet?`<path d="M${W/2+60} ${-H-20} H${W/2-40} V${t28_f(-H+40)}" stroke="#C04A3A" stroke-width="34" fill="none"/><path d="M${W/2-40} ${-H+40} V${t28_f(wl)}" stroke="#AEE8FF" stroke-width="${t28_f(22*inlet)}" stroke-dasharray="20 14" stroke-dashoffset="${t28_f(-g*120)}" opacity=".9"/>`:''}
   <rect x="${-W/2-60}" y="${-H-60}" width="${W+120}" height="${H+100}" fill="none" stroke="${INK}" stroke-width="9"/>${st}
   ${label?`<g transform="translate(0,${H*0+70})">${labelPill(0,0,'USED FUEL POOL',P.ice,36)}</g>`:''}</g>`;}
function t28_reactor(x,y,s,g,rods=0){const ry=lerp(-330,-120,eout(clamp(rods)));let core='';for(let i=0;i<7;i++)core+=`<rect x="${-150+i*46}" y="-120" width="26" height="200" rx="5" fill="${rods>=1?'#8FA0B4':'#FF9A4A'}" stroke="${INK}" stroke-width="4"/>`;
  let cr='';for(let i=0;i<6;i++)cr+=`<rect x="${-126+i*46}" y="${t28_f(ry)}" width="20" height="210" rx="4" fill="#2A2E3A" stroke="${INK}" stroke-width="4"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-230 -300 Q-230 -400 0 -400 Q230 -400 230 -300 V200 Q230 280 0 280 Q-230 280 -230 200Z" fill="#C8D0DA" stroke="${INK}" stroke-width="10"/>
   <rect x="-190" y="-150" width="380" height="270" rx="20" fill="#0C2A4A" stroke="${INK}" stroke-width="7"/>${rods<1?`<ellipse cx="0" cy="-20" rx="200" ry="150" fill="url(#gWarm)" opacity="${(.6*(1-rods)).toFixed(2)}"/>`:''}${core}${cr}
   <rect x="-150" y="-380" width="300" height="40" rx="10" fill="#5D6A82" stroke="${INK}" stroke-width="6"/></g>`;}
function t28_radio(x,y,s,g,o={}){const {on=0}=o;return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-300" y="-180" width="600" height="340" rx="26" fill="#7A4A2A" stroke="${INK}" stroke-width="9"/>
   <rect x="-260" y="-140" width="300" height="140" rx="14" fill="${on?'#FFD27A':'#3A2A1E'}" stroke="${INK}" stroke-width="6"/>${[0,1,2,3,4,5,6].map(i=>`<path d="M${-240+i*40} -120 v${i%2?40:60}" stroke="${INK}" stroke-width="4"/>`).join('')}<path d="M${-220+((g*30)%240)} -140 v140" stroke="${P.red}" stroke-width="5"/>
   <circle cx="150" cy="-70" r="70" fill="#2A1A12" stroke="${INK}" stroke-width="7"/>${[0,1,2,3].map(i=>`<circle cx="150" cy="-70" r="${16+i*14}" fill="none" stroke="#5A3A22" stroke-width="4"/>`).join('')}
   <circle cx="-200" cy="80" r="34" fill="#C9A46A" stroke="${INK}" stroke-width="6"/><circle cx="-100" cy="80" r="34" fill="#C9A46A" stroke="${INK}" stroke-width="6"/>
   <g transform="translate(120,90)"><rect x="-90" y="-14" width="180" height="28" rx="8" fill="#2A2E3A" stroke="${INK}" stroke-width="5"/><rect x="-40" y="-40" width="110" height="18" rx="6" fill="#C9A46A" stroke="${INK}" stroke-width="5" transform="rotate(${(Math.sin(g*8)>.6?6:0)} -40 -30)"/><circle cx="70" cy="-34" r="14" fill="#2A2E3A" stroke="${INK}" stroke-width="4"/></g></g>`;}
function t28_alarm(x,y,s,g,ring=1){const sh=ring?Math.sin(g*50)*6:0;return `<g transform="translate(${x},${y}) scale(${s}) rotate(${t28_f(sh)})"><circle cx="-40" cy="-62" r="22" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><circle cx="40" cy="-62" r="22" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><circle r="60" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/>
   <path d="M0 0 V-38 M0 0 L26 10" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>${ring?`<path d="M-90 -40 q-14 30 0 60 M90 -40 q14 30 0 60" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity="${(.5+.5*Math.sin(g*20)).toFixed(2)}"/>`:''}</g>`;}
function t28_phone(x,y,s,inner='',rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-150" y="-280" width="300" height="560" rx="40" fill="#1A1A26" stroke="${INK}" stroke-width="10"/><rect x="-126" y="-244" width="252" height="470" rx="18" fill="#0E1830"/>${inner}<rect x="-36" y="-264" width="72" height="9" rx="4" fill="#333"/></g>`;}
function t28_bubble(x,y,w,str,o={}){const {size=40,mine=1,col=mine?'#2F8CFF':'#3A4458'}=o;return `<g transform="translate(${x},${y})"><rect x="${-w/2}" y="-36" width="${w}" height="72" rx="30" fill="${col}"/><text y="${size*.35}" text-anchor="middle" font-size="${size}" font-weight="800" fill="#fff">${str}</text></g>`;}
function t28_globe(x,y,r,g){const sp=g*30%360;let land='';const r2=rng(6);for(let i=0;i<9;i++){const lx=((r2()*720+g*40)%720)-360,ly=(r2()-.5)*r*1.4,rr=30+r2()*70;if(Math.abs(lx)<r)land+=`<ellipse cx="${t28_f(lx*.9)}" cy="${t28_f(ly)}" rx="${t28_f(rr*Math.sqrt(1-Math.pow(lx/r,2)))}" ry="${t28_f(rr*.7)}" fill="#4FB86A" stroke="${INK}" stroke-width="4"/>`;}
  return `<g transform="translate(${x},${y})"><circle r="${r+40}" fill="url(#gIce)" opacity=".35"/><clipPath id="t28gl"><circle r="${r}"/></clipPath><circle r="${r}" fill="#2E78B8"/><g clip-path="url(#t28gl)">${land}</g><circle r="${r}" fill="none" stroke="${INK}" stroke-width="10"/><path d="M${-r*.6} ${-r*.5} A${r} ${r} 0 0 1 ${r*.1} ${-r*.85}" stroke="#fff" stroke-width="10" fill="none" opacity=".4" stroke-linecap="round"/></g>`;}
function t28_fridge(x,y,s,open=0,g=0){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-150" y="-420" width="300" height="640" rx="20" fill="#E8EEF4" stroke="${INK}" stroke-width="9"/><path d="M-150 -170 H150" stroke="${INK}" stroke-width="7"/>
   ${open?`<rect x="-130" y="-150" width="260" height="350" fill="#2A3440"/>${[0,1,2].map(i=>`<path d="M-130 ${-60+i*90} H130" stroke="#8A96A4" stroke-width="6"/>`).join('')}<rect x="-100" y="-130" width="60" height="70" rx="8" fill="#FFF6EA" stroke="${INK}" stroke-width="4"/><circle cx="40" cy="-90" r="30" fill="#E86A4A" stroke="${INK}" stroke-width="4"/><rect x="-80" y="-40" width="140" height="40" rx="8" fill="#F2D06A" stroke="${INK}" stroke-width="4"/>
     <path d="M150 -150 L300 -120 L300 230 L150 200Z" fill="#DDE4EC" stroke="${INK}" stroke-width="8"/>`:`<rect x="110" y="-120" width="14" height="110" rx="7" fill="#9AA7BD"/>`}
   <rect x="110" y="-380" width="14" height="120" rx="7" fill="#9AA7BD"/></g>`;}
function t28_tin(x,y,s,lab='BEANS',col='#E8604A'){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-60" y="-80" width="120" height="160" fill="#C9D2DC" stroke="${INK}" stroke-width="6"/><rect x="-60" y="-50" width="120" height="100" fill="${col}" stroke="${INK}" stroke-width="5"/><ellipse cy="-80" rx="60" ry="14" fill="#E8EEF4" stroke="${INK}" stroke-width="5"/><text y="12" text-anchor="middle" font-size="26" font-weight="900" fill="#fff">${lab}</text></g>`;}
function t28_deer(x,y,s,g,o={}){const {dir=1,eat=0}=o;const hy=eat?60+Math.sin(g*3)*6:0;return `<g transform="translate(${x},${y}) scale(${s*dir},${s})"><ellipse cx="0" cy="170" rx="140" ry="14" fill="rgba(0,0,0,.3)"/>
   ${[-80,-50,60,90].map(lx=>`<path d="M${lx} 30 L${lx+(lx>0?6:-4)} 170" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M${lx} 30 L${lx+(lx>0?6:-4)} 170" stroke="#B07A4A" stroke-width="10" stroke-linecap="round"/>`).join('')}
   <ellipse cx="0" cy="0" rx="130" ry="64" fill="#B07A4A" stroke="${INK}" stroke-width="8"/><circle cx="-110" cy="-10" r="16" fill="#FFF6EA" stroke="${INK}" stroke-width="4"/>
   <g transform="translate(110,${-30+hy})"><path d="M-20 10 L20 -90 L60 -80 L30 20Z" fill="#B07A4A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="50" cy="-100" rx="50" ry="32" fill="#B07A4A" stroke="${INK}" stroke-width="7"/><circle cx="92" cy="-96" r="9" fill="${INK}"/><circle cx="46" cy="-108" r="7" fill="${INK}"/>
   <path d="M30 -128 L10 -200 M10 -200 L-20 -220 M10 -200 L30 -240 M50 -128 L70 -200 M70 -200 L100 -224 M70 -200 L60 -246" stroke="#6A4A2A" stroke-width="9" stroke-linecap="round"/><path d="M20 -126 l-26 -14 l12 22Z" fill="#B07A4A" stroke="${INK}" stroke-width="5"/></g></g>`;}
function t28_fox(x,y,s,g,o={}){const {sleep=1,dir=1}=o;const br=Math.sin(g*2)*3;return `<g transform="translate(${x},${y}) scale(${s*dir},${s})"><ellipse cx="0" cy="50" rx="120" ry="12" fill="rgba(0,0,0,.3)"/>
   <path d="M60 20 Q150 30 120 -40 Q100 -70 60 -40" fill="#E8783A" stroke="${INK}" stroke-width="7"/><path d="M110 -38 q14 -6 14 -20" stroke="#FFF6EA" stroke-width="12" fill="none" stroke-linecap="round"/>
   <ellipse cx="0" cy="${t28_f(10-br)}" rx="100" ry="${t28_f(46+br)}" fill="#E8783A" stroke="${INK}" stroke-width="7"/><g transform="translate(-80,0)"><path d="M-30 -30 L-20 -76 L4 -40Z M24 -36 L36 -80 L50 -36Z" fill="#E8783A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><ellipse cx="0" cy="0" rx="52" ry="40" fill="#E8783A" stroke="${INK}" stroke-width="7"/><path d="M-50 10 L-90 20 L-44 30Z" fill="#FFF6EA" stroke="${INK}" stroke-width="5"/><circle cx="-90" cy="20" r="7" fill="${INK}"/>
   ${sleep?`<path d="M-30 -6 q8 6 16 0 M8 -6 q8 6 16 0" stroke="${INK}" stroke-width="5" fill="none"/>`:`<circle cx="-20" cy="-6" r="7" fill="${INK}"/><circle cx="16" cy="-6" r="7" fill="${INK}"/>`}</g>
   ${sleep?T(-120,-90-((g*20)%30),'z',{size:44,fill:'#fff',stroke:8,op:.8}):''}</g>`;}
function t28_wolf(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-110 0 Q-160 -40 -170 -80" stroke="${INK}" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M-110 0 Q-160 -40 -170 -80" stroke="#8A8EA0" stroke-width="14" fill="none" stroke-linecap="round"/>${[-80,-50,50,80].map(lx=>`<path d="M${lx} 20 V110" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M${lx} 20 V110" stroke="#8A8EA0" stroke-width="10" stroke-linecap="round"/>`).join('')}<ellipse rx="120" ry="52" fill="#8A8EA0" stroke="${INK}" stroke-width="7"/><g transform="translate(120,-40)"><path d="M-20 -30 L-10 -76 L10 -40Z M14 -38 L30 -80 L40 -36Z" fill="#8A8EA0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><ellipse rx="50" ry="38" fill="#8A8EA0" stroke="${INK}" stroke-width="7"/><path d="M30 0 L84 12 L30 26Z" fill="#B8BCCA" stroke="${INK}" stroke-width="5"/><circle cx="84" cy="12" r="7" fill="${INK}"/><circle cx="14" cy="-8" r="7" fill="#FFD84D" stroke="${INK}" stroke-width="3"/></g></g>`;}
function t28_boar(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})">${[-60,-30,40,70].map(lx=>`<path d="M${lx} 20 V80" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M${lx} 20 V80" stroke="#5A4434" stroke-width="10" stroke-linecap="round"/>`).join('')}<ellipse rx="110" ry="60" fill="#5A4434" stroke="${INK}" stroke-width="7"/><path d="M80 -40 L170 -10 L160 30 L80 30Z" fill="#5A4434" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="166" cy="10" rx="14" ry="18" fill="#C98A7A" stroke="${INK}" stroke-width="4"/><path d="M146 24 q10 -24 26 -26" stroke="#FFF6EA" stroke-width="7" fill="none"/><circle cx="120" cy="-14" r="6" fill="${INK}"/><path d="M90 -40 L100 -70 L114 -38Z" fill="#5A4434" stroke="${INK}" stroke-width="5"/></g>`;}
function t28_elk(x,y,s,g){return t28_deer(x,y,s*1.1,g).replace(/#B07A4A/g,'#7A5236');}
function t28_win(x,y,w,h,lit=0,g=0,o={}){const {frame='#1A2236'}=o;return `<g transform="translate(${x},${y})">${lit>0?`<circle r="${t28_f(Math.max(w,h)*2.2)}" fill="url(#t28lamp)" opacity="${(lit*.8).toFixed(2)}"/>`:''}<rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" fill="${lit>0?'#FFD27A':'#0A1224'}" stroke="${frame}" stroke-width="${Math.max(4,w*.08)}"/><path d="M0 ${-h/2} V${h/2} M${-w/2} 0 H${w/2}" stroke="${frame}" stroke-width="${Math.max(3,w*.05)}"/></g>`;}
function t28_flakes(g,a=1,n=60,seed=8){if(a<=0)return '';const r=rng(seed);let s='';for(let i=0;i<n;i++){const sp=40+r()*70,x0=r()*1920,y=((r()*1100+g*sp)%1100)-10,x=x0+Math.sin(g*.8+i)*30;s+=`<circle cx="${t28_f(x)}" cy="${t28_f(y)}" r="${(2+r()*4).toFixed(1)}" fill="#fff" opacity="${(a*(.4+r()*.5)).toFixed(2)}"/>`;}return s;}
function t28_museum(x,y,s,g,o={}){const {lamp=0,solar=1,night=1}=o;return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-420" y="-360" width="840" height="560" fill="${night?'#1C2A44':'#C9B89A'}" stroke="${INK}" stroke-width="9"/><path d="M-470 -360 L0 -520 L470 -360Z" fill="${night?'#243552':'#D9C8A8'}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
   ${[-300,-150,0,150,300].map(cx=>`<rect x="${cx-26}" y="-300" width="52" height="460" fill="${night?'#2A3A58':'#E8DCC4'}" stroke="${INK}" stroke-width="6"/>`).join('')}
   <rect x="-420" y="180" width="840" height="40" fill="${night?'#2A3A58':'#B8A88A'}" stroke="${INK}" stroke-width="7"/>
   ${solar?`<g transform="translate(-300,-430) rotate(-12)">${[0,1,2].map(i=>`<rect x="${i*80}" y="0" width="74" height="44" fill="#1E3E7A" stroke="#9FC0FF" stroke-width="4"/>`).join('')}</g>`:''}
   ${t28_win(0,-430,70,56,lamp,g,{frame:INK})}<text y="-330" text-anchor="middle" font-size="40" font-weight="900" fill="${night?'#7A8AA8':INK}" letter-spacing="6">MUSEUM</text></g>`;}
// ---------- shots ----------
Object.assign(SHOTS,{
t28Hook(t,d,p,g){
  const six=AT(t,p.six??2.2),pl=AT(t,p.plant??3.6),fu=AT(t,p.fuel??5.6);const k=eout(prog(t,p.plant??3.6,(p.plant??3.6)+.8));
  const street=`${t28_street(g,{mode:'day',cam:t*30})}${glint({x:960,y:760,s:.42,t:g,look:Math.sin(g*.9),mouth:'o',brows:'raised',blink:BL(g)})}`;
  const plant=`${t28_sky('gold',g)}${t28_skyline(g,{y0:760,col:'#4A3A4A',seed:5})}${t28_plant(900,760,1.0,g,{warn:1})}${t28_tree(120,1000,1.2,{col:'#2E5A3A'})}${t28_tree(1820,1010,1.1,{col:'#2E5A3A'})}`;
  return `${k<1?street:''}${k>0?`<g opacity="${k.toFixed(2)}">${plant}</g>`:''}
   ${!pl?T(960,170,'EVERYONE ON EARTH',{size:100,fill:P.white})+T(960,290,'IS GONE',{size:130,fill:t28_TEAL}):''}
   ${pl?T(960,160,'THE NUCLEAR PLANT',{size:96,fill:P.white,sc:pop(t,p.plant??3.6)}):''}
   ${six?t28_timer(21600,g,{x:pl?1380:960,y:pl?330:470,s:pl?.9:1.3}):''}
   ${fu?`<g transform="translate(580,440) scale(${pop(t,p.fuel??5.6).toFixed(3)})"><rect x="-260" y="-120" width="520" height="240" rx="24" fill="#08121C" fill-opacity=".88" stroke="${P.red}" stroke-width="7"/>${t28_gauge(-150,-10,74,.08,'')}${T(-50,-10,'COOLING',{size:50,fill:P.white,anchor:'start'})}${T(-50,56,'PUMPS',{size:50,fill:P.red,anchor:'start'})}</g>`:''}`;
},
t28Gate(t,d,p,g){
  const wa=AT(t,p.walls??11.2),po=AT(t,p.pool??13.4),cl=AT(t,p.clean??17);
  if(wa){const z=eout(prog(t,p.walls??11.2,(p.walls??11.2)+2));
    return `${t28_sky('gold',g)}<g transform="translate(960,700) scale(${lerp(1,1.9,z).toFixed(3)}) translate(-1410,-700)">${t28_plant(900,760,1,g,{warn:1,cut:po?1:0})}</g>
     ${po?`<g transform="translate(1340,600) scale(${(pop(t,p.pool??13.4)*.62).toFixed(3)})">${t28_pool(0,0,1,g,{label:true})}</g>`:''}
     ${T(960,150,po?'A POOL OF WATER':'BEHIND THOSE WALLS',{size:96,fill:po?P.ice:P.white,sc:pop(t,po?p.pool??13.4:p.walls??11.2)})}
     ${cl?`<g transform="translate(470,560) scale(${pop(t,p.clean??17).toFixed(3)})"><rect x="-330" y="-150" width="660" height="300" rx="26" fill="#08121C" fill-opacity=".9" stroke="${P.red}" stroke-width="7"/>${T(0,-50,'THE ONLY THING',{size:56,fill:P.white})}${T(0,20,'BETWEEN THE CITY',{size:56,fill:P.white})}${T(0,95,'AND DISASTER',{size:64,fill:P.red})}</g>`:''}
     ${t28_timer(21600-t*3,g,{x:1380,y:880,s:.75})}`;}
  const gt=AT(t,p.gate??3.6),ca=AT(t,p.cat??6),sx=AT(t,p.six??9.3);
  const fence=[...Array(22)].map((_,i)=>`<path d="M${i*90} 520 V840" stroke="#4A5A66" stroke-width="10"/>`).join('');
  return `${t28_sky('gold',g)}${t28_plant(1100,640,.75,g,{warn:1})}<rect y="830" width="1920" height="250" fill="#5A4A3A"/>
   <g>${fence}<path d="M0 540 H700 M1220 540 H1920 M0 690 H700 M1220 690 H1920" stroke="#4A5A66" stroke-width="10"/></g>
   <g transform="translate(700,520) skewY(14)"><rect width="230" height="320" fill="none" stroke="#6A7A86" stroke-width="12"/><path d="M0 0 L230 320 M230 0 L0 320" stroke="#6A7A86" stroke-width="7"/></g>
   <rect x="60" y="420" width="580" height="80" rx="10" fill="#F4F0E6" stroke="${INK}" stroke-width="6"/><text x="350" y="475" text-anchor="middle" font-size="40" font-weight="900" fill="${INK}">RIVERSIDE POWER STATION</text>
   ${t28_pack(960,640,.95,g)}${glint({x:960,y:640,s:.95,t:g,mouth:ca?'flat':'frown',brows:'sad',blink:BL(g),look:-.3})}${t28_straps(960,640,.95,g)}
   ${!gt?T(960,170,'NOBODY LEFT TO COME',{size:96,fill:P.white,sc:IN(t,.1)}):''}${gt&&!ca?T(960,170,'ALONE',{size:130,fill:t28_TEAL,sc:pop(t,p.gate??3.6)}):''}
   ${ca?`<g transform="translate(1290,420) scale(${pop(t,p.cat??6).toFixed(3)})">${labelPill(0,0,'+ ONE GRUMPY CAT',P.gold,40)}</g>`:''}
   ${sx?t28_timer(21600,g,{x:960,y:170,s:1.15}):''}`;
},
t28Basement(t,d,p,g){
  const th=AT(t,p.three??3.2),fl=AT(t,p.flick??11.2),pp=AT(t,p.pop??12.9),no=AT(t,p.noth??15.6);
  if(!th) return `${t28_DEF}${bgCard('cardDark',g)}<g transform="translate(960,420) scale(${pop(t,.05).toFixed(3)})">${[0,1].map(i=>`<path d="M${-20-i*110} -90 L${-150-i*110} 0 L${-20-i*110} 90Z" fill="${t28_TEAL}" stroke="${INK}" stroke-width="10" stroke-linejoin="round" transform="translate(${130+((g*200)%40)},0)"/>`).join('')}</g>${T(960,660,"LET'S GO BACK",{size:110,fill:P.white,sc:IN(t,.1)})}${AT(t,p.seven??1.4)?T(960,800,'7 DAYS EARLIER',{size:90,fill:P.gold,sc:pop(t,p.seven??1.4)}):''}`;
  const flick=fl&&!no?(Math.sin(g*37)>.2?1:0):0;const dark=no?.55:flick?.75:0;
  return `<rect width="1920" height="1080" fill="#1A1E2A"/>${[0,1,2,3,4,5].map(i=>`<path d="M${i*340} 0 V820" stroke="#242A3A" stroke-width="40"/>`).join('')}<rect y="820" width="1920" height="260" fill="#12151E"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="6"/>
   <path d="M0 120 H1920" stroke="#3A4050" stroke-width="30"/>${[480,1440].map(x=>`<path d="M${x} 120 V180" stroke="${INK}" stroke-width="6"/><ellipse cx="${x}" cy="196" rx="70" ry="20" fill="#FFF2C8" opacity="${dark?.2:1}"/><path d="M${x-300} 1080 L${x-60} 200 H${x+60} L${x+300} 1080Z" fill="#FFF2C8" opacity="${dark?.0:.07}"/>`).join('')}
   <rect x="300" y="640" width="900" height="40" fill="#6A4A3A" stroke="${INK}" stroke-width="7"/><path d="M340 680 V900 M1160 680 V900" stroke="#6A4A3A" stroke-width="24"/>
   ${t28_radio(750,500,.95,g)}<g transform="translate(750,330)">${labelPill(0,0,'OLD RADIO EXHIBIT',P.gold,34)}</g>
   ${glint({x:1440,y:560,s:.95,t:g,look:-1,mouth:pp?'o':'smile',brows:pp?'raised':'calm',blink:BL(g),pose:pp?'up':'point',glint:0})}
   <rect width="1920" height="1080" fill="#000" opacity="${dark}"/>
   ${pp?`<g opacity="${(1-prog(t,p.pop??12.9,(p.pop??12.9)+2)).toFixed(2)}">${[0,1,2].map(i=>`<circle cx="1440" cy="500" r="${t28_f(120+((t-(p.pop??12.9))*400+i*80)%400)}" fill="none" stroke="${t28_TEAL}" stroke-width="8"/>`).join('')}</g>`:''}
   <g transform="translate(260,140)"><rect x="-190" y="-60" width="380" height="120" rx="18" fill="#0B1026" stroke="${P.ice}" stroke-width="6"/>${T(0,24,'3:00 AM',{size:72,fill:P.ice})}</g>
   ${AT(t,p.shift??5)&&!fl?T(1150,170,'THE NIGHT SHIFT',{size:84,fill:P.white,sc:pop(t,p.shift??5)}):''}${fl&&!pp?T(1150,170,'FLICKER',{size:110,fill:P.gold,sc:pop(t,p.flick??11.2)}):''}${pp&&!no?T(1150,170,'POP!',{size:130,fill:t28_TEAL,sc:pop(t,p.pop??12.9)}):''}${no?T(1150,170,'THEN NOTHING',{size:96,fill:P.white,sc:pop(t,p.noth??15.6)}):''}`;
},
t28Street(t,d,p,g){
  const al=AT(t,p.alarm??1.2);let clocks='';
  if(al)[[300,300,.7],[540,430,.5],[1620,300,.7],[1380,440,.5],[720,500,.35],[1200,500,.35]].forEach(([x,y,s],i)=>{clocks+=`<g transform="translate(${x},${y}) scale(${pop(t,(p.alarm??1.2)+i*.15).toFixed(3)})"><circle r="${100*s+30}" fill="#08121C" opacity=".55"/>${t28_alarm(0,0,s,g+i*.3)}</g>`;});
  return `${t28_street(g,{mode:'day',cam:t*20})}${clocks}${glint({x:960,y:720,s:.6,t:g,look:Math.sin(g*1.2)*1.2,mouth:'o',brows:'raised',blink:BL(g)})}
   ${t28_pill(420,820,'NO CARS',P.ice,t,p.cars??6.1,46)}${t28_pill(1500,820,'NO DOG WALKERS',P.ice,t,p.dog??7.2,46)}
   ${AT(t,p.none??8.8)?T(960,170,'NO ONE',{size:150,fill:t28_TEAL,sc:pop(t,p.none??8.8)}):T(960,170,al?'EVERY ALARM RINGING':'7:00 AM',{size:96,fill:al?P.gold:P.white,sc:pop(t,al?p.alarm??1.2:.1)})}
   ${AT(t,p.off??3.7)&&!AT(t,p.cars??6.1)?T(960,880,'NOBODY SWITCHES THEM OFF',{size:58,fill:P.white,sc:pop(t,p.off??3.7)}):''}`;
},
t28NanFlat(t,d,p,g){
  const gl=AT(t,p.glass??3),pk=AT(t,p.pick??5);
  return `<rect width="1920" height="1080" fill="#5A6E8A"/><rect x="1240" y="140" width="460" height="380" rx="10" fill="#BFE3F0" stroke="${INK}" stroke-width="12"/><path d="M1470 140 V520 M1240 330 H1700" stroke="${INK}" stroke-width="8"/><rect x="1200" y="130" width="90" height="420" fill="#B58BD6" stroke="${INK}" stroke-width="6"/><rect x="1650" y="130" width="90" height="420" fill="#B58BD6" stroke="${INK}" stroke-width="6"/>
   <rect y="820" width="1920" height="260" fill="#7A5A4A"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="6"/>
   <g transform="translate(860,760)"><rect x="-420" y="-90" width="840" height="150" rx="24" fill="#E8D8F4" stroke="${INK}" stroke-width="8"/><rect x="-440" y="-260" width="60" height="380" rx="14" fill="#8A6A4A" stroke="${INK}" stroke-width="7"/><rect x="-380" y="-150" width="200" height="80" rx="34" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><path d="M-160 -90 Q100 -110 420 -90" stroke="#C9B4E4" stroke-width="10" fill="none"/></g>
   <g transform="translate(260,700)"><rect x="-110" y="-20" width="220" height="140" rx="10" fill="#8A6A4A" stroke="${INK}" stroke-width="7"/><rect x="-60" y="-120" width="18" height="100" fill="#C9A46A"/><path d="M-100 -150 h100 l-20 -40 h-60z" fill="#FFD27A" stroke="${INK}" stroke-width="5"/>
     <g transform="translate(50,-34) scale(${gl?1+.1*Math.sin(g*4):1})"><rect x="-44" y="-16" width="38" height="28" rx="8" fill="none" stroke="${INK}" stroke-width="6"/><rect x="6" y="-16" width="38" height="28" rx="8" fill="none" stroke="${INK}" stroke-width="6"/><path d="M-6 -4 H6" stroke="${INK}" stroke-width="5"/></g></g>
   ${pickles(1320,780,1.05,g,{mood:'grump',blink:0})}${pk?`<g transform="translate(1500,560) scale(${pop(t,p.pick??5).toFixed(3)})"><path d="M-170 -60 H170 V60 H-40 L-90 110 L-80 60 H-170Z" fill="#FFF6EA" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>${T(0,18,'MRAAOW!',{size:62,fill:P.red,stroke:8})}</g>`:''}
   ${glint({x:1760,y:620,s:.8,t:g,look:-1,mouth:'o',brows:'sad',blink:BL(g)})}
   ${T(860,170,gl?(pk?'BREAKFAST, PLEASE':'HER GLASSES. NO NAN.'):'NAN?',{size:96,fill:gl?P.white:P.gold,sc:pop(t,pk?p.pick??5:gl?p.glass??3:.05)})}
   ${AT(t,p.bed??1.4)&&!gl?`<g transform="translate(860,560) scale(${pop(t,p.bed??1.4).toFixed(3)})">${labelPill(0,0,'EMPTY',P.coral,56)}</g>`:''}`;
},
t28Calls(t,d,p,g){
  const os=AT(t,p.osei??3.6);
  if(!os){const k=(g*1.4)%1;return `${bgCard('cardDark',g)}${[0,1,2].map(i=>{const kk=(k+i/3)%1;return `<circle cx="960" cy="540" r="${t28_f(200+kk*500)}" fill="none" stroke="${t28_TEAL}" stroke-width="8" opacity="${(1-kk).toFixed(2)}"/>`;}).join('')}
    ${t28_phone(960,560,1,`<circle cy="-110" r="70" fill="#FF5E5B" stroke="${INK}" stroke-width="6"/><text y="-88" text-anchor="middle" font-size="64" font-weight="900" fill="#fff">K</text><text y="20" text-anchor="middle" font-size="46" font-weight="900" fill="#fff">KAI</text><text y="76" text-anchor="middle" font-size="30" font-weight="700" fill="#9AA7BD">calling…</text><circle cx="0" cy="170" r="44" fill="${P.red}"/>`,Math.sin(g*30)*2)}
    ${glint({x:430,y:640,s:.85,t:g,mouth:'frown',brows:'sad',blink:BL(g),look:1})}${AT(t,p.rings??1)?T(1450,500,'RING… RING…',{size:76,fill:P.white,sc:pop(t,p.rings??1)}):''}${T(1450,640,'NO ANSWER',{size:76,fill:P.coral,op:prog(t,2.4,2.8)})}`;}
  return `${t21_museum?t21_museum(g):'<rect width="1920" height="1080" fill="#120C26"/>'}<rect x="560" y="660" width="800" height="40" fill="#6A4A3A" stroke="${INK}" stroke-width="7"/><path d="M600 700 V880 M1320 700 V880" stroke="#6A4A3A" stroke-width="22"/>
   <g transform="translate(1100,620)"><rect x="-90" y="-260" width="180" height="40" rx="10" fill="#4A4A5A" stroke="${INK}" stroke-width="6"/><rect x="-80" y="-230" width="160" height="200" rx="14" fill="#4A4A5A" stroke="${INK}" stroke-width="6"/><path d="M-60 -30 V220 M60 -30 V220" stroke="#4A4A5A" stroke-width="16"/>
    <path d="M-70 -250 L70 -250 L100 30 L-100 30Z" fill="#F4F6FA" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M0 -250 V20 M-26 -250 L0 -190 L26 -250" stroke="#C9D2E0" stroke-width="6" fill="none"/></g>
   <g transform="translate(760,600)"><rect x="-70" y="-50" width="140" height="60" rx="8" fill="#2A3248" stroke="${INK}" stroke-width="5"/><rect x="-100" y="10" width="200" height="40" rx="6" fill="#3A4258" stroke="${INK}" stroke-width="5"/></g>
   ${glint({x:430,y:600,s:.85,t:g,mouth:'flat',brows:'sad',blink:BL(g),look:1})}${T(960,170,"DR. OSEI'S COAT",{size:96,fill:P.white,sc:pop(t,p.osei??3.6)})}${AT(t,p.coat??5.5)?T(1100,880,'STILL ON HER CHAIR',{size:60,fill:P.ice,sc:pop(t,p.coat??5.5)}):''}`;
},
t28World(t,d,p,g){
  const ev=AT(t,p.every??3),co=AT(t,p.country??5),go=AT(t,p.gone??6.6),ex=AT(t,p.except??8.4),ca=AT(t,p.cat??9.8);
  if(go){return `${t28_street(g,{mode:'gold'})}<rect width="1920" height="1080" fill="#000" opacity=".35"/><ellipse cx="960" cy="700" rx="${ex?460:0}" ry="420" fill="url(#t28lamp)" opacity=".7"/>
    ${ex?glint({x:900,y:620,s:1.05,t:g,mouth:'flat',brows:'sad',blink:BL(g)}):''}${ca?pickles(1200,880,.9,g,{mood:'grump'}):''}${T(960,170,'EVERYONE IS GONE',{size:110,fill:P.white,sc:pop(t,p.gone??6.6)})}${ex?T(960,300,ca?'EXCEPT GLINT. AND THE CAT.':'EXCEPT GLINT',{size:70,fill:t28_TEAL,sc:pop(t,ca?p.cat??9.8:p.except??8.4)}):''}`;}
  let cards='';[[400,300,'NEWS'],[1520,300,'WORLD'],[340,760,'LIVE'],[1580,760,'24/7']].forEach(([x,y,lab],i)=>{const a=i<2?.3:co?(p.country??5)-1+i*.2:99;if(!AT(t,a))return;
    cards+=`<g transform="translate(${x},${y}) scale(${pop(t,a).toFixed(3)}) rotate(${i%2?4:-4})"><rect x="-210" y="-120" width="420" height="240" rx="16" fill="#F4F6FA" stroke="${INK}" stroke-width="7"/><rect x="-210" y="-120" width="420" height="60" rx="16" fill="${P.red}" stroke="${INK}" stroke-width="7"/><text y="-78" text-anchor="middle" font-size="36" font-weight="900" fill="#fff">${lab}</text>
    <rect x="-180" y="-40" width="300" height="18" rx="9" fill="#C9C2B8"/><rect x="-180" y="0" width="240" height="18" rx="9" fill="#C9C2B8"/><text y="84" text-anchor="middle" font-size="30" font-weight="900" fill="${P.red}">LAST UPDATE 3:00 AM</text></g>`;});
  return `${bgCard('cardIce',g)}${t28_globe(960,560,300,g)}${cards}${T(960,150,ev?'STOPPED UPDATING':'BY NOON',{size:96,fill:ev?P.coral:P.white,sc:pop(t,ev?p.every??3:.05)})}${co?T(960,900,'IN EVERY COUNTRY',{size:70,fill:P.white,sc:pop(t,p.country??5)}):''}`;
},
t28Rules(t,d,p,g){
  const wo=AT(t,p.world??1.6),sc=AT(t,p.sci??4),ru=AT(t,p.run??8.3),pe=AT(t,p.ppl??10.4),or=AT(t,p.order??13.8);
  if(or){const L=[['1','PHONES',P.ice],['2','THE GRID',P.gold],['3','BATTERIES',P.coral],['4','???',P.red]];
    return `${bgCard('cardMint',g)}${T(960,150,'THINGS FAIL IN ORDER',{size:96,fill:P.white,sc:pop(t,p.order??13.8)})}
     ${L.map(([n,s,c],i)=>{const a=(p.order??13.8)+.2+i*.32;return AT(t,a)?`<g transform="translate(${560+i*0},${320+i*170}) scale(${pop(t,a).toFixed(3)})"><circle cx="-260" r="60" fill="${c}" stroke="${INK}" stroke-width="8"/>${T(-260,26,n,{size:72,fill:INK,stroke:0})}<rect x="-180" y="-56" width="760" height="112" rx="20" fill="#08121C" fill-opacity=".85" stroke="${c}" stroke-width="6"/>${T(200,26,s,{size:70,fill:c})}</g>`:'';}).join('')}
     ${glint({x:1600,y:640,s:.8,t:g,pose:'point',dir:-1,mouth:'flat',brows:'raised',blink:BL(g)})}`;}
  if(ru){let ppl='';for(let i=0;i<12;i++){const a=i*Math.PI/6+g*.2,x=960+Math.cos(a)*360,y=580+Math.sin(a)*240;ppl+=`<g opacity="${pe?(1-prog(t,(p.ppl??10.4)+.5+i*.1,(p.ppl??10.4)+1+i*.1)).toFixed(2):1}">${extra({x,y:y-60,s:.28,t:g+i,head:['#F2C9A0','#C68B59','#6B3F24','#E8B88A'][i%4]})}</g>`;}
    return `${bgCard('cardDark',g)}<g transform="translate(960,580) rotate(${(g*20%360).toFixed(1)})"><circle r="150" fill="#5D6A82" stroke="${INK}" stroke-width="10"/>${[...Array(10)].map((_,i)=>`<rect x="-26" y="-190" width="52" height="60" rx="8" fill="#5D6A82" stroke="${INK}" stroke-width="8" transform="rotate(${i*36})"/>`).join('')}<circle r="56" fill="#1A2236" stroke="${INK}" stroke-width="8"/></g>${ppl}
     ${T(960,150,pe?'IT RUNS ON PEOPLE':"THE WORLD DOESN'T RUN ITSELF",{size:pe?110:80,fill:pe?t28_TEAL:P.white,sc:pop(t,pe?p.ppl??10.4:p.run??8.3)})}`;}
  return `${bgCard('cardDark',g)}${T(960,170,'THE RULES',{size:130,fill:P.gold,sc:IN(t,.1)})}
   ${wo?`<g transform="translate(560,560) scale(${pop(t,p.world??1.6).toFixed(3)})"><circle r="170" fill="#22305A" stroke="${INK}" stroke-width="10"/>${T(0,70,'?',{size:240,fill:P.white})}${T(0,260,'NOBODY KNOWS WHY',{size:52,fill:P.white})}</g>`:''}
   ${sc?`<g transform="translate(1360,560) scale(${pop(t,p.sci??4).toFixed(3)})"><rect x="-230" y="-170" width="460" height="340" rx="24" fill="#0E2A2A" stroke="${t28_TEAL}" stroke-width="8"/>${T(0,-60,'REAL',{size:90,fill:t28_TEAL})}${T(0,50,'SCIENCE',{size:90,fill:t28_TEAL})}${T(0,260,AT(t,p.next??6)?'SAYS WHAT HAPPENS NEXT':'',{size:44,fill:P.white})}</g>`:''}
   ${!wo?glint({x:960,y:620,s:1,t:g,pose:'hips',mouth:'flat',brows:'raised',blink:BL(g)}):''}`;
},
t28Hour1(t,d,p,g){
  const ne=AT(t,p.net??1.6),no=AT(t,p.none??3.4);
  const msgs=[['Kai??',1,.2],['Nan, where are you?',1,.8],['Anyone??',1,1.4]];
  return `${bgCard('cardIce',g)}${t28_phone(700,560,1.2,`${msgs.map(([m,mi,a],i)=>AT(t,a)?t28_bubble(20,-150+i*110,220,m.length>12?'Nan, where…?':m,{size:32}):'').join('')}${msgs.map((_,i)=>AT(t,msgs[i][2])?`<text x="110" y="${-100+i*110}" text-anchor="end" font-size="20" font-weight="700" fill="#9AA7BD">${no?'No reply':'Delivered'}</text>`:'').join('')}`)}
   <g transform="translate(1340,420)">${[0,1,2].map(i=>`<path d="M${-60-i*50} ${-i*50} A${90+i*70} ${90+i*70} 0 0 1 ${60+i*50} ${-i*50}" stroke="${ne?t28_TEAL:'#3A4458'}" stroke-width="22" fill="none" stroke-linecap="round" transform="translate(0,${i*-10})"/>`).join('')}<circle cy="40" r="22" fill="${t28_TEAL}"/>${T(0,170,ne?'INTERNET: WORKS':'PHONES: WORK',{size:56,fill:t28_TEAL})}</g>
   ${T(960,150,'HOUR ONE',{size:120,fill:P.white,sc:IN(t,.1)})}${no?T(1340,760,'NOBODY ANSWERS',{size:92,fill:P.coral,sc:pop(t,p.none??3.4)}):''}`;
},
t28Grid(t,d,p,g){
  const ba=AT(t,p.bal??1.6),se=AT(t,p.sec??4.6),pp=AT(t,p.ppl??6.3),no=AT(t,p.none??10.8),on=AT(t,p.one??13.6),dk=AT(t,p.dark??15.3);
  if(dk){const lit=lerp(.5,0,prog(t,p.dark??15.3,(p.dark??15.3)+3));return `${t28_sky('night',g)}${t28_skyline(g,{lit,y0:880,col:'#0E1A30'})}<rect y="880" width="1920" height="200" fill="#060C18"/>
    ${T(960,170,'THE GRID GOES DARK',{size:100,fill:P.white,sc:pop(t,p.dark??15.3)})}${T(960,300,'WITHIN A DAY OR TWO',{size:70,fill:P.gold,sc:pop(t,(p.dark??15.3)+1.5)})}`;}
  if(no){let plants='';for(let i=0;i<5;i++){const off=AT(t,(p.one??13.6)-1.6+i*.55);plants+=`<g transform="translate(${260+i*350},700)"><rect x="-80" y="-120" width="160" height="220" fill="${off?'#3A4050':'#C8D2DC'}" stroke="${INK}" stroke-width="7"/><rect x="30" y="-260" width="34" height="150" fill="${off?'#3A4050':'#C8D2DC'}" stroke="${INK}" stroke-width="6"/>${off?'':[0,1,2].map(j=>{const k=((g*.6+j/3)%1);return `<circle cx="${47+Math.sin(g+j)*8}" cy="${t28_f(-270-k*120)}" r="${t28_f(14+k*26)}" fill="#E8EEF4" opacity="${(.6*(1-k)).toFixed(2)}"/>`;}).join('')}
      <circle cx="0" cy="-30" r="26" fill="${off?P.red:P.mint}" stroke="${INK}" stroke-width="5"/>${off?T(0,180,'OFF',{size:50,fill:P.red}):''}</g>`;}
    return `${bgCard('cardDark',g)}${plants}${T(960,170,on?'ONE BY ONE':'NO ONE AT THE CONTROLS',{size:90,fill:on?P.coral:P.white,sc:pop(t,on?p.one??13.6:p.none??10.8)})}`;}
  const tip=ba?Math.sin(g*2.2)*(se?10:4):0;
  return `${bgCard('cardMint',g)}<g transform="translate(960,640)"><path d="M-60 260 H60 L0 0Z" fill="#5D6A82" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <g transform="rotate(${t28_f(tip)})"><path d="M-500 0 H500" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M-500 0 H500" stroke="#C9D3E3" stroke-width="10" stroke-linecap="round"/>
     <g transform="translate(-420,0)"><path d="M0 0 L-90 120 H90Z" fill="none" stroke="${INK}" stroke-width="5"/><rect x="-120" y="120" width="240" height="70" rx="12" fill="${P.gold}" stroke="${INK}" stroke-width="7"/><text y="168" text-anchor="middle" font-size="40" font-weight="900" fill="${INK}">SUPPLY</text></g>
     <g transform="translate(420,0)"><path d="M0 0 L-90 120 H90Z" fill="none" stroke="${INK}" stroke-width="5"/><rect x="-120" y="120" width="240" height="70" rx="12" fill="${t28_TEAL}" stroke="${INK}" stroke-width="7"/><text y="168" text-anchor="middle" font-size="40" font-weight="900" fill="${INK}">DEMAND</text></g></g></g>
   ${pp?`<g transform="translate(960,330) scale(${pop(t,p.ppl??6.3).toFixed(3)})">${extra({x:-120,y:0,s:.4,t:g,head:'#F2C9A0',pose:'point'})}${extra({x:120,y:0,s:.4,t:g+1,head:'#6B3F24',pose:'up'})}${T(0,190,'BALANCED BY PEOPLE, 24/7',{size:48,fill:P.white})}</g>`:''}
   ${T(960,150,se?'EVERY SINGLE SECOND':'THE POWER GRID',{size:96,fill:se?P.gold:P.white,sc:pop(t,se?p.sec??4.6:.05)})}`;
},
t28Batt(t,d,p,g){
  const si=AT(t,p.sil??5.4),or=AT(t,p.order??7.3),wa=AT(t,p.watch??11.5);
  if(or){return `${t28_sky('night',g)}${t28_plant(960,760,.95,g,{warn:1})}${wa?`<g transform="translate(1600,330) scale(${pop(t,p.watch??11.5).toFixed(3)})"><path d="M-130 0 Q0 -110 130 0 Q0 110 -130 0Z" fill="#FFF6EA" stroke="${INK}" stroke-width="9"/><circle r="46" fill="${t28_TEAL}" stroke="${INK}" stroke-width="7"/><circle r="20" fill="${INK}"/></g>`:''}
    ${T(960,150,wa?'BUILT TO BE WATCHED':'THE MOST DANGEROUS THINGS',{size:90,fill:wa?P.red:P.white,sc:pop(t,wa?p.watch??11.5:p.order??7.3)})}`;}
  const items=[['PHONE MASTS',p.mast??1.6],['TRAFFIC LIGHTS',p.traf??2.6],['HOSPITAL ALARMS',p.hosp??3.8]];
  return `${bgCard('cardDark',g)}${items.map(([lab,a],i)=>{const lv=si?0:clamp(1-(t-a)/4);if(!AT(t,a-.6))return '';return `<g transform="translate(${400+i*560},560) scale(${pop(t,a-.6).toFixed(3)})"><rect x="-90" y="-200" width="180" height="340" rx="22" fill="#1A2236" stroke="${INK}" stroke-width="9"/><rect x="-36" y="-228" width="72" height="30" rx="8" fill="#1A2236" stroke="${INK}" stroke-width="7"/>
     <rect x="-66" y="${t28_f(116-300*lv)}" width="132" height="${t28_f(300*lv)}" rx="10" fill="${lv<.3?P.red:P.mint}"/>${T(0,240,lab,{size:46,fill:P.white})}</g>`;}).join('')}
   ${T(960,150,si?'SILENCE':'THEN THE BATTERIES DIE',{size:si?140:90,fill:si?P.ice:P.white,sc:pop(t,si?p.sil??5.4:.05)})}`;
},
t28PlusCity(t,d,p,g){
  const re=AT(t,p.rest??4.6),pk=AT(t,p.pick??8.6),of=AT(t,p.off??11);let body;
  if(pk){body=`<rect width="1920" height="1080" fill="#6A4A3A"/><rect x="200" y="120" width="1520" height="560" fill="#8A6A52" stroke="${INK}" stroke-width="8"/><rect x="760" y="160" width="400" height="300" rx="10" fill="#C9A46A" stroke="${INK}" stroke-width="7"/>${T(960,330,'THE MAYOR',{size:56,fill:'#6A4A3A',stroke:0})}
     <rect x="360" y="680" width="1200" height="60" fill="#5A3A2A" stroke="${INK}" stroke-width="8"/><rect x="420" y="740" width="60" height="320" fill="#5A3A2A" stroke="${INK}" stroke-width="7"/><rect x="1440" y="740" width="60" height="320" fill="#5A3A2A" stroke="${INK}" stroke-width="7"/>
     <g transform="translate(1260,650)"><rect x="-140" y="-40" width="280" height="60" rx="8" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><text y="2" text-anchor="middle" font-size="30" font-weight="900" fill="${INK}">MAYOR</text></g>${pickles(800,620,1.05,g,{blink:1})}${T(720,470,'Z',{size:70,fill:'#fff',op:.8})}`;}
  else if(re){body=`${t28_street(g,{mode:'day'})}<rect x="380" y="260" width="1160" height="700" fill="#2A1A1E" stroke="${INK}" stroke-width="14"/><rect x="420" y="300" width="1080" height="560" fill="#F2DDB0" opacity=".25"/><text x="960" y="240" text-anchor="middle" font-size="56" font-weight="900" fill="${P.gold}" font-style="italic">Le Très Cher</text>
     <rect x="620" y="700" width="680" height="30" fill="#FFF6EA" stroke="${INK}" stroke-width="6"/><path d="M660 730 V860 M1260 730 V860" stroke="#8A6A4A" stroke-width="16"/><ellipse cx="840" cy="690" rx="70" ry="18" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="840" cy="680" r="26" fill="${P.gold}" stroke="${INK}" stroke-width="4"/>
     ${glint({x:1080,y:560,s:.75,t:g,mouth:'grin',blink:BL(g),pose:'wave'})}`;}
  else{body=`${t28_sky('day',g)}<path d="M-200 1080 L900 560 H1020 L2120 1080Z" fill="#4A5A62"/><path d="M940 560 L700 1080 M980 560 L1220 1080" stroke="#F2E6C8" stroke-width="8" stroke-dasharray="40 40"/><path d="M-200 1080 L900 560 M2120 1080 L1020 560" stroke="#9AA7BD" stroke-width="14"/>
     <rect x="1200" y="420" width="420" height="120" rx="10" fill="#2E8A4A" stroke="${INK}" stroke-width="7"/><text x="1410" y="495" text-anchor="middle" font-size="42" font-weight="900" fill="#fff">M1  NORTH</text><path d="M1260 540 V600 M1560 540 V600" stroke="#5D6A82" stroke-width="10"/>
     <g transform="translate(960,860) rotate(-90)">${glint({x:0,y:0,s:.7,t:0,mouth:'grin',eyes:'closed',pose:'up'})}</g>`;}
  return `${body}${T(1060,260,pk?'NAP ON THE MAYOR\'S DESK':re?'BREAKFAST IN THE FANCIEST WINDOW':'LIE ON THE MOTORWAY',{size:76,fill:P.white,sc:pop(t,pk?p.pick??8.6:re?p.rest??4.6:2.6)})}${of?T(960,880,'NOBODY TELLS THEM OFF',{size:64,fill:t28_TEAL,sc:pop(t,p.off??11)}):''}${t28_pm(t,'plus','THE CITY IS HIS')}`;
},
t28Lights(t,d,p,g){
  const fr=AT(t,p.fridge??4.6),fo=AT(t,p.four??8.6),tw=AT(t,p.two??12.4),ti=AT(t,p.tins??14.6),ye=AT(t,p.years??17.4);
  if(ti){let tins='';for(let r=0;r<3;r++)for(let c=0;c<5-r;c++)tins+=t28_tin(660+c*130+r*65,880-r*165,1,['BEANS','SOUP','PEAS','CORN','FISH'][(c+r)%5],['#E8604A','#D84A6A','#4FA86A','#E8B83A','#4A7AD8'][(c+r)%5]);
    return `${bgCard('cardGold',g)}${tins}${glint({x:1500,y:620,s:.85,t:g,mouth:ye?'smile':'flat',blink:BL(g),pose:'point',dir:-1})}${T(1060,260,ye?'CANNED FOOD LASTS YEARS':'LIFE ON TINS',{size:90,fill:ye?P.mint:P.white,sc:pop(t,ye?p.years??17.4:p.tins??14.6)})}${t28_pm(t,'minus','THE LIGHTS GO OUT')}`;}
  if(fr){return `${t28_DEF}<rect width="1920" height="1080" fill="#18202E"/><rect y="820" width="1920" height="260" fill="#10151E"/>${t28_fridge(620,800,1,fo?1:0,g)}
     ${fo?`<g transform="translate(1330,380) scale(${pop(t,p.four??8.6).toFixed(3)})">${clockP(-200,0,90,fo?(t-(p.four??8.6))*2:0)}${T(100,-10,'FRIDGE',{size:56,fill:P.white,anchor:'start'})}${T(100,60,'≈ 4 HOURS',{size:64,fill:P.gold,anchor:'start'})}</g>`:''}
     ${tw?`<g transform="translate(1330,680) scale(${pop(t,p.two??12.4).toFixed(3)})"><rect x="-290" y="-80" width="180" height="160" rx="12" fill="#CFEFFF" stroke="${INK}" stroke-width="7"/><path d="M-240 -40 l30 30 l-30 30 M-160 -40 l-30 30 l30 30" stroke="#6FD3F7" stroke-width="7" fill="none"/>${T(-60,-10,'FREEZER',{size:56,fill:P.white,anchor:'start'})}${T(-60,60,'≈ 2 DAYS',{size:64,fill:P.ice,anchor:'start'})}</g>`:''}
     ${T(1060,260,fo?'FOOD SAFE FOR…':'THE FRIDGES STOP HUMMING',{size:86,fill:P.white,sc:pop(t,fo?p.four??8.6:p.fridge??4.6)})}${t28_pm(t,'minus','THE LIGHTS GO OUT')}`;}
  const lit=lerp(.55,0,prog(t,p.night??2.4,(p.night??2.4)+2));
  return `${t28_sky('night',g)}${t28_skyline(g,{lit,y0:900,col:'#0E1A30',seed:12})}<rect y="900" width="1920" height="180" fill="#060C18"/>${glint({x:300,y:640,s:.75,t:g,look:1,mouth:'o',brows:'raised',blink:BL(g)})}${T(960,860,'DAY 2: THE GRID FAILS',{size:70,fill:P.gold,op:prog(t,(p.night??2.4)+.3,(p.night??2.4)+.6)})}${t28_pm(t,'minus','THE LIGHTS GO OUT')}`;
},
t28Subway(t,d,p,g){
  const ny=AT(t,p.ny??4.4),ga=AT(t,p.gal??6.5),st=AT(t,p.stop??11.6),wk=AT(t,p.walk??14.6),sp=AT(t,p.steps??19.2),fi=AT(t,p.fill??21.6);
  if(wk){const lv=lerp(820,sp?700:780,prog(t,p.walk??14.6,(p.fill??21.6)+2))-(fi?60*prog(t,p.fill??21.6,(p.fill??21.6)+3):0);let steps='';for(let i=0;i<9;i++)steps+=`<rect x="${300+i*40}" y="${300+i*70}" width="${1320-i*80}" height="70" fill="${i%2?'#5A6470':'#4A545E'}" stroke="${INK}" stroke-width="4"/>`;
    const bx=520,by=560;
    return `<rect width="1920" height="1080" fill="#0A0E16"/>${steps}<rect x="160" y="120" width="1600" height="80" rx="10" fill="#E8EEF4" stroke="${INK}" stroke-width="7"/><circle cx="260" cy="160" r="30" fill="${P.red}" stroke="${INK}" stroke-width="5"/><text x="960" y="178" text-anchor="middle" font-size="48" font-weight="900" fill="${INK}">CENTRAL  UNDERGROUND</text>
     <rect x="0" y="${t28_f(lv)}" width="1920" height="${t28_f(1080-lv)}" fill="url(#t28murk)" opacity=".92"/><path d="M0 ${t28_f(lv)} ${[...Array(16)].map((_,i)=>`q60 ${(Math.sin(g*2+i)*8).toFixed(1)} 120 0`).join(' ')}" stroke="#9FD0D0" stroke-width="5" fill="none"/>
     <path d="M${bx+60} ${by-80} L1500 ${lv-10} L1100 ${lv+30}Z" fill="#FFF2C8" opacity=".16"/>${glint({x:bx,y:by-120,s:.75,t:g,mouth:'o',brows:'raised',pose:'point',blink:BL(g)})}<rect x="${bx+110}" y="${by-110}" width="70" height="30" rx="8" fill="#5D6A82" stroke="${INK}" stroke-width="5" transform="rotate(20 ${bx+110} ${by-110})"/>
     ${T(960,300,sp?(fi?'WITHIN DAYS, THE TUNNELS FILL':'THE STEPS ARE UNDER WATER'):'DOWN WITH A TORCH',{size:76,fill:sp?P.ice:P.white,sc:pop(t,fi?p.fill??21.6:sp?p.steps??19.2:p.walk??14.6)})}`;}
  const k=st?1:0;
  return `${bgCard('cardIce',g)}<g transform="translate(960,620)"><rect x="-700" y="-100" width="1400" height="260" rx="130" fill="#2A3240" stroke="${INK}" stroke-width="10"/><rect x="-700" y="40" width="1400" height="120" fill="#3E6A6A" opacity=".8"/>
     ${[...Array(6)].map((_,i)=>`<path d="M${-640+i*240} 140 V160" stroke="#8A6A4A" stroke-width="20"/>`).join('')}
     <g transform="translate(520,-20)"><rect x="-90" y="-80" width="180" height="160" rx="16" fill="${st?'#5A5A66':P.gold}" stroke="${INK}" stroke-width="8"/><circle r="50" fill="#2A2E3A" stroke="${INK}" stroke-width="6"/><g transform="rotate(${st?0:(g*400%360).toFixed(0)})"><path d="M0 -44 V44 M-44 0 H44" stroke="#9AA7BD" stroke-width="10"/></g>${T(0,140,st?'PUMP: OFF':'PUMP',{size:44,fill:st?P.red:P.white})}</g>
     ${!st?`<path d="M430 -100 V-300" stroke="#6FD3F7" stroke-width="30" stroke-dasharray="30 20" stroke-dashoffset="${t28_f(g*80)}"/>`:''}</g>
   ${ga?`<g transform="translate(700,280) scale(${pop(t,p.gal??6.5).toFixed(3)})"><rect x="-460" y="-110" width="920" height="220" rx="24" fill="#08121C" fill-opacity=".9" stroke="${P.ice}" stroke-width="7"/>${T(0,-20,'13 MILLION GALLONS',{size:76,fill:P.ice})}${T(0,60,'PUMPED OUT EVERY DAY',{size:50,fill:P.white})}</g>`:''}
   ${T(1060,260,st?'THE PUMPS STOP':ny?'NEW YORK SUBWAY':'CITIES SIT ON HIDDEN WATER',{size:86,fill:st?P.red:P.white,sc:pop(t,st?p.stop??11.6:ny?p.ny??4.4:2.4)})}${t28_pm(t,'minus','THE UNDERGROUND FLOODS')}`;
},
t28Stars(t,d,p,g){
  const mw=AT(t,p.milky??4.6),re=AT(t,p.real??9),la=AT(t,p.la??11.4),ca=AT(t,p.call??14.6),cl=AT(t,p.cloud??17.8),it=AT(t,p.mw??20.4),nv=AT(t,p.never??22.4);
  const band=k=>{const r=rng(3);let s='';for(let i=0;i<260;i++){const u=r(),x=u*2100-90,y=760-u*640+(r()-.5)*220*(1-Math.abs(u-.5));s+=`<circle cx="${t28_f(x)}" cy="${t28_f(y)}" r="${(r()*2.6+.4).toFixed(1)}" fill="${r()>.8?'#FFE7C4':'#fff'}" opacity="${(k*(.3+.7*Math.abs(Math.sin(g+i)))).toFixed(2)}"/>`;}
    return `<path d="M-100 860 Q900 420 2020 60" stroke="#B8C8FF" stroke-width="240" fill="none" opacity="${(.14*k).toFixed(2)}" stroke-linecap="round"/><path d="M-100 860 Q900 420 2020 60" stroke="#FFE7C4" stroke-width="90" fill="none" opacity="${(.12*k).toFixed(2)}" stroke-linecap="round"/>${s}`;};
  if(re&&!it){return `${t28_sky('night',g)}${band(.5)}${t28_skyline(g,{lit:0,y0:900,col:'#0A1426',seed:44})}<rect y="900" width="1920" height="180" fill="#05080F"/>
     ${la?`<g transform="translate(480,420) scale(${pop(t,p.la??11.4).toFixed(3)})"><rect x="-320" y="-150" width="640" height="300" rx="24" fill="#08121C" fill-opacity=".92" stroke="${P.gold}" stroke-width="7"/>${T(0,-40,'1994',{size:110,fill:P.gold})}${T(0,70,'LOS ANGELES QUAKE',{size:52,fill:P.white})}</g>`:''}
     ${ca?t28_phone(1350,560,.85,`<text y="-120" text-anchor="middle" font-size="40" font-weight="900" fill="${P.red}">EMERGENCY</text>${cl?`<rect x="-110" y="-60" width="220" height="150" rx="16" fill="#2A3A5A"/><text y="0" text-anchor="middle" font-size="28" font-weight="800" fill="#fff">"A strange</text><text y="40" text-anchor="middle" font-size="28" font-weight="800" fill="#fff">silver cloud!"</text>`:''}<circle cx="0" cy="170" r="44" fill="${P.mint}"/>`,Math.sin(g*20)*2):''}
     ${T(1060,260,'THIS REALLY HAPPENED',{size:96,fill:P.white,sc:pop(t,p.real??9)})}`;}
  return `${t28_sky('night',g)}${band(mw?1:.3)}${t28_skyline(g,{lit:0,y0:900,col:'#0A1426',seed:44})}<rect y="900" width="1920" height="180" fill="#05080F"/>
   ${glint({x:340,y:700,s:.7,t:g,look:1,mouth:'o',brows:'raised',blink:BL(g)})}
   ${T(1060,260,it?(nv?'MOST HAD NEVER SEEN IT':'IT WAS THE MILKY WAY'):mw?'THE MILKY WAY':'THE SKY COMES BACK',{size:96,fill:it?P.gold:P.white,sc:pop(t,nv?p.never??22.4:it?p.mw??20.4:mw?p.milky??4.6:p.sky??2.4)})}${t28_pm(t,'plus','THE STARS')}`;
},
t28Roof(t,d,p,g){
  const r=rng(70);let st='';for(let i=0;i<150;i++)st+=`<circle cx="${t28_f(r()*1920)}" cy="${t28_f(r()*700)}" r="${(r()*2.4+.4).toFixed(1)}" fill="#fff" opacity="${(.3+.6*Math.abs(Math.sin(g+i))).toFixed(2)}"/>`;
  const C=[[[300,200],[420,150],[540,210],[660,170],[780,240],[720,330],[600,300]],[[1200,160],[1300,260],[1420,200],[1520,300],[1640,240]],[[900,380],[980,300],[1080,360],[1000,450]]];
  const k=prog(t,.3,(p.names??2.4)+3);let lines='';C.forEach((pts,ci)=>{const n=Math.floor(clamp(k*3-ci)*pts.length);for(let i=0;i<n-1;i++)lines+=`<path d="M${pts[i][0]} ${pts[i][1]} L${pts[i+1][0]} ${pts[i+1][1]}" stroke="${t28_TEAL}" stroke-width="5" opacity=".8"/>`;pts.slice(0,n).forEach(q=>lines+=`<circle cx="${q[0]}" cy="${q[1]}" r="9" fill="#fff"/>`);});
  return `${t28_sky('night',g)}${st}${lines}<path d="M0 860 L1920 800 V1080 H0Z" fill="#1A2236" stroke="${INK}" stroke-width="7"/>
   <g transform="translate(860,850) rotate(-84)">${glint({x:0,y:0,s:.6,t:0,mouth:'grin',pose:'up',look:0})}</g>${pickles(1240,880,.7,g,{mood:'grump',blink:BL(g)})}
   ${['ORION','CASSIOPEIA','THE PLOUGH'].map((n,i)=>AT(t,(p.names??2.4)+i*1.2)?T([560,1420,990][i],[400,380,520][i],n,{size:40,fill:t28_TEAL,stroke:8,sc:pop(t,(p.names??2.4)+i*1.2)}):'').join('')}
   ${T(960,150,'THE MUSEUM ROOF',{size:84,fill:P.white,sc:IN(t,.1)})}`;
},
t28Silence(t,d,p,g){
  const na=AT(t,p.nan??3),wi=AT(t,p.wind??6),ta=AT(t,p.talk??7.8),bk=AT(t,p.back??10.4);
  return `<rect width="1920" height="1080" fill="#3E5A6A"/><rect x="200" y="160" width="520" height="360" rx="10" fill="#9FC8D8" stroke="${INK}" stroke-width="12"/><path d="M460 160 V520 M200 340 H720" stroke="${INK}" stroke-width="8"/>${wi?[0,1,2].map(i=>`<path d="M${240+((g*120+i*160)%440)} ${240+i*80} q40 -20 80 0" stroke="#fff" stroke-width="6" fill="none" opacity=".7"/>`).join(''):''}
   <rect y="820" width="1920" height="260" fill="#5A4A3A"/><path d="M0 820 H1920" stroke="${INK}" stroke-width="6"/>
   <rect x="1500" y="180" width="20" height="300" fill="#8A6A4A"/><g transform="translate(1510,300)"><path d="M-40 0 L-60 220 H60 L40 0Z" fill="#B58BD6" stroke="${INK}" stroke-width="6"/><path d="M-30 0 Q0 -30 30 0" stroke="${INK}" stroke-width="6" fill="none"/></g>${na?`<g transform="translate(1510,580)">${labelPill(0,0,"NAN'S APRON",P.ice,32)}</g>`:''}
   <rect x="640" y="700" width="760" height="40" fill="#8A6A4A" stroke="${INK}" stroke-width="7"/><path d="M680 740 V900 M1360 740 V900" stroke="#8A6A4A" stroke-width="18"/>
   ${glint({x:700,y:560,s:.8,t:g,legs:'sit',look:1,mouth:ta?(Math.sin(g*9)>0?'o':'smile'):'flat',brows:ta?'raised':'sad',blink:BL(g),pose:ta?'shrug':'down'})}${pickles(1180,650,.9,g,{mood:'grump',blink:bk?1:0})}
   ${ta?t21_bub?t21_bub(1000,430,520,'"…AND THEN I SAID…"','',{size:40}):'':''}${bk?`<g transform="translate(1260,480) scale(${pop(t,p.back??10.4).toFixed(3)})">${T(0,0,'…',{size:110,fill:P.white})}</g>`:''}
   ${T(1060,260,ta?'HE TALKS TO THE CAT':'NO CARS. NO VOICES.',{size:90,fill:P.white,sc:pop(t,ta?p.talk??7.8:2.4)})}${t28_pm(t,'minus','THE SILENCE')}`;
},
t28Leaflet(t,d,p,g){
  const lf=AT(t,p.leaf??2.6),rv=AT(t,p.riv??5.4),q=AT(t,p.q??9.6),wh=AT(t,p.who??12.4);
  if(wh){return `${t28_sky('gold',g)}${t28_plant(960,760,.95,g,{warn:1})}<rect width="1920" height="1080" fill="#000" opacity=".25"/>${glint({x:260,y:640,s:.95,t:g,look:1,mouth:'o',brows:'raised',blink:0,sweat:1})}${T(1060,170,'WHO IS LOOKING',{size:100,fill:P.white,sc:pop(t,p.who??12.4)})}${T(1060,300,'AFTER THAT?',{size:110,fill:P.red,sc:pop(t,(p.who??12.4)+.3)})}`;}
  return `<rect width="1920" height="1080" fill="#2A3A4A"/>${t21_museum?'':''}<rect y="760" width="1920" height="320" fill="#6A4A3A" stroke="${INK}" stroke-width="7"/>
   ${lf?`<g transform="translate(960,560) rotate(-4) scale(${pop(t,p.leaf??2.6).toFixed(3)})"><rect x="-380" y="-300" width="760" height="560" rx="16" fill="#FFF6EA" stroke="${INK}" stroke-width="9"/><rect x="-380" y="-300" width="760" height="110" rx="16" fill="#2E8A9A" stroke="${INK}" stroke-width="9"/>
     <text y="-262" text-anchor="middle" font-size="40" font-weight="900" fill="#fff">RIVERSIDE NUCLEAR</text><text y="-212" text-anchor="middle" font-size="40" font-weight="900" fill="#fff">POWER STATION</text>
     <g transform="translate(0,90) scale(.36)">${t28_plant(0,0,1,g,{river:1})}</g>${rv?`<rect x="-250" y="150" width="500" height="80" rx="40" fill="${P.gold}" stroke="${INK}" stroke-width="6"/><text y="205" text-anchor="middle" font-size="44" font-weight="900" fill="${INK}">SCHOOL OPEN DAY</text>`:''}</g>`:''}
   ${glint({x:1650,y:620,s:.8,t:g,look:-1,mouth:q?'o':'flat',brows:q?'raised':'calm',blink:BL(g)})}
   ${T(1120,150,q?'ONE QUESTION':'DAY 6: DR. OSEI\'S OFFICE',{size:76,fill:q?P.gold:P.white,sc:pop(t,q?p.q??9.6:p.day??0)})}${t28_pm(t,'minus','THE PLANT')}`;
},
t28Scram(t,d,p,g){
  const dn=AT(t,p.down??3.4),ro=AT(t,p.rods??6.6),de=AT(t,p.design??9.6);const rods=prog(t,p.rods??6.6,(p.rods??6.6)+1.2);
  return `${bgCard('cardIce',g)}${t28_reactor(700,600,1.1,g,rods)}
   ${ro?`<g transform="translate(1400,440) scale(${pop(t,p.rods??6.6).toFixed(3)})">${labelPill(0,0,'CONTROL RODS DROP IN',P.gold,44)}</g>`:''}${AT(t,(p.rods??6.6)+1.4)?`<g transform="translate(1400,580) scale(${pop(t,(p.rods??6.6)+1.4).toFixed(3)})">${icon('check',-260,0,.8)}${T(60,22,'SHUT DOWN',{size:70,fill:P.mint})}</g>`:''}
   ${de?`<g transform="translate(1400,760) scale(${pop(t,p.design??9.6).toFixed(3)})">${labelPill(0,0,'DESIGNED TO DO THAT',P.ice,40)}</g>`:''}
   ${T(960,150,dn?'SHUT DOWN IN SECONDS':'THE REACTOR IS FINE',{size:96,fill:dn?P.white:P.mint,sc:pop(t,dn?p.down??3.4:p.fine??1)})}`;
},
t28Pool(t,d,p,g){
  const dp=AT(t,p.deep??1.8),us=AT(t,p.used??3),ho=AT(t,p.hot??5),pu=AT(t,p.pump??7),sf=AT(t,p.safe??9.4),bl=AT(t,p.block??11.4);
  return `${bgCard('cardDark',g)}${t28_pool(820,840,1,g,{label:false,warm:ho&&!pu?.5:0,inlet:pu?1:0})}
   ${dp?`<g transform="translate(330,${840-260})" opacity="${prog(t,p.deep??1.8,(p.deep??1.8)+.4).toFixed(2)}"><path d="M0 -250 V250 M-24 -226 L0 -254 L24 -226 M-24 226 L0 254 L24 226" stroke="#fff" stroke-width="9" fill="none"/>${T(-10,20,'12 m',{size:64,fill:P.white,rot:-90})}</g>`:''}
   ${us?`<g transform="translate(820,600) scale(${pop(t,p.used??3).toFixed(3)})">${labelPill(0,0,'USED FUEL',P.ice,40)}</g>`:''}
   ${ho?`<g transform="translate(1530,360) scale(${pop(t,p.hot??5).toFixed(3)})">${labelPill(0,0,'HOT FOR YEARS',P.coral,42)}</g>`:''}
   ${pu?`<g transform="translate(1530,500) scale(${pop(t,p.pump??7).toFixed(3)})">${labelPill(0,0,'PUMPS KEEP IT COOL',P.ice,40)}</g>`:''}
   ${bl?`<g transform="translate(1530,640) scale(${pop(t,p.block??11.4).toFixed(3)})">${labelPill(0,0,'WATER BLOCKS RADIATION',P.mint,38)}</g>`:sf?`<g transform="translate(1530,640) scale(${pop(t,p.safe??9.4).toFixed(3)})">${labelPill(0,0,'WATER KEEPS IT SAFE',P.mint,40)}</g>`:''}
   ${T(960,150,'THE POOL NEXT DOOR',{size:96,fill:P.ice,sc:IN(t,.1)})}`;
},
t28Diesel(t,d,p,g){
  const us=AT(t,p.us??3.6),sv=AT(t,p.seven??5.4),dy=AT(t,p.day??8);
  if(dy){return `${bgCard('cardWarm',g)}<g transform="translate(960,600) scale(${pop(t,p.day??8).toFixed(3)})"><rect x="-300" y="-260" width="600" height="520" rx="24" fill="#FFF6EA" stroke="${INK}" stroke-width="10"/><rect x="-300" y="-260" width="600" height="120" rx="24" fill="${P.red}" stroke="${INK}" stroke-width="10"/>${T(0,-178,'DAY',{size:70,fill:'#fff',stroke:0})}${T(0,140,'7',{size:300,fill:INK,stroke:0})}<circle cx="0" cy="40" r="150" fill="none" stroke="${P.red}" stroke-width="14" stroke-dasharray="1100" stroke-dashoffset="${t28_f(1100*(1-prog(t,(p.day??8)+.3,(p.day??8)+1.2)))}"/></g>${T(960,150,"IT'S DAY SEVEN",{size:100,fill:P.white,sc:pop(t,p.day??8)})}`;}
  return `${t28_DEF}<rect width="1920" height="1080" fill="#2A323E"/><rect y="800" width="1920" height="280" fill="#1A2028"/>${t28_gen(560,700,1,g,{run:1,fuel:.6})}${t28_gen(1360,700,1,g+.4,{run:1,fuel:.6})}
   ${T(960,150,'EMERGENCY DIESEL GENERATORS',{size:80,fill:P.gold,sc:IN(t,.1)})}
   ${us?`<g transform="translate(960,330) scale(${pop(t,p.us??3.6).toFixed(3)})"><rect x="-420" y="-80" width="840" height="160" rx="24" fill="#08121C" fill-opacity=".9" stroke="${P.gold}" stroke-width="7"/>${T(0,-10,'UNITED STATES:',{size:44,fill:P.white})}${T(0,56,sv?'≈ 7 DAYS OF DIESEL ON SITE':'…',{size:56,fill:P.gold})}</g>`:''}`;
},
t28Control(t,d,p,g){
  const rm=AT(t,p.room??2.6),al=AT(t,p.alarms??4.2),ga=AT(t,p.gauge??6.4);
  if(ga){const z=eout(prog(t,p.gauge??6.4,(p.gauge??6.4)+1.4));return `${t28_DEF}<rect width="1920" height="1080" fill="#2A323E"/><g transform="translate(960,560) scale(${lerp(1,1.6,z).toFixed(3)}) translate(-960,-560)">${t28_gen(960,700,1.3,g,{run:1,fuel:.1})}</g>
     ${T(960,150,'FUEL GAUGE',{size:90,fill:P.white,sc:pop(t,p.gauge??6.4)})}${AT(t,p.six??8.2)?t28_timer(21600,g,{x:1380,y:330,s:1.1}):''}`;}
  if(rm){let panels='';for(let i=0;i<6;i++){panels+=`<rect x="${120+i*290}" y="260" width="260" height="400" rx="12" fill="#3A4A5A" stroke="${INK}" stroke-width="7"/>`;for(let j=0;j<8;j++){const on=al&&Math.sin(g*8+i*3+j)>.2;panels+=`<circle cx="${160+i*290+(j%4)*60}" cy="${320+Math.floor(j/4)*70}" r="16" fill="${on?P.red:'#5A6A7A'}" stroke="${INK}" stroke-width="3"/>`;}panels+=`<rect x="${150+i*290}" y="480" width="200" height="120" rx="8" fill="#0A2A3A" stroke="${INK}" stroke-width="5"/><path d="M${160+i*290} 560 ${[...Array(8)].map((_,k)=>`L${170+i*290+k*24} ${540+Math.sin(g*3+k+i)*24}`).join(' ')}" stroke="${t28_TEAL}" stroke-width="4" fill="none"/>`;}
    return `${t28_DEF}<rect width="1920" height="1080" fill="#1E2632"/>${panels}<rect y="700" width="1920" height="380" fill="#151B24"/><rect x="300" y="660" width="1320" height="60" fill="#4A5A6A" stroke="${INK}" stroke-width="7"/>
     ${[600,960,1320].map(x=>`<g transform="translate(${x},820)"><rect x="-70" y="-110" width="140" height="120" rx="20" fill="#2A3A4A" stroke="${INK}" stroke-width="6"/><path d="M-40 10 V120 M40 10 V120" stroke="#2A3A4A" stroke-width="14"/></g>`).join('')}
     ${al?`<rect width="1920" height="1080" fill="${P.red}" opacity="${(.12*Math.abs(Math.sin(g*6))).toFixed(2)}"/>`:''}${T(960,150,al?'ALARMS BLINKING FOR NOBODY':'THE CONTROL ROOM: EMPTY',{size:84,fill:al?P.red:P.white,sc:pop(t,al?p.alarms??4.2:p.room??2.6)})}`;}
  return `${t28_sky('gold',g)}<path d="M-200 1080 L900 620 H1020 L2120 1080Z" fill="#4A5A62"/>${t28_plant(1200,620,.6,g,{warn:1})}
   <g transform="translate(${t28_f(lerp(300,700,prog(t,0,2.6)))},860)"><rect x="-200" y="-180" width="400" height="180" rx="24" fill="#F4F0E6" stroke="${INK}" stroke-width="8"/><rect x="100" y="-160" width="80" height="70" rx="10" fill="#9FD0E0" stroke="${INK}" stroke-width="5"/><text x="-40" y="-80" text-anchor="middle" font-size="34" font-weight="900" fill="#2E8A9A">MUSEUM</text><circle cx="-120" r="40" fill="#22202E" stroke="${INK}" stroke-width="7"/><circle cx="120" r="40" fill="#22202E" stroke="${INK}" stroke-width="7"/></g>
   ${T(960,150,'DAWN, DAY SEVEN',{size:90,fill:P.white,sc:IN(t,.1)})}${AT(t,p.gate??1.6)?`<g transform="translate(1200,330) scale(${pop(t,p.gate??1.6).toFixed(3)})">${labelPill(0,0,'THE GATE IS OPEN',P.gold,42)}</g>`:''}`;
},
t28Chain(t,d,p,g){
  const ra=AT(t,p.rad??10),li=AT(t,p.life??17);
  if(ra){const sp=eout(prog(t,p.rad??10,(p.rad??10)+5));const pins=[['NAN\'S FLAT',560,700,p.nan??12.6],['MUSEUM',1000,520,p.mus??14],['KAI\'S STREET',1400,760,p.kai??15]];
    return `${t28_DEF}<rect width="1920" height="1080" fill="#5E8C6A"/><path d="M0 300 Q500 360 900 300 T1920 340" stroke="#2E6E8A" stroke-width="70" fill="none"/>${[...Array(30)].map((_,i)=>{const r=rng(i+3);return `<rect x="${t28_f(r()*1900)}" y="${t28_f(380+r()*640)}" width="${t28_f(30+r()*50)}" height="${t28_f(26+r()*40)}" fill="#8AA88A" stroke="${INK}" stroke-width="3"/>`;}).join('')}
     <g transform="translate(260,280) scale(.25)">${t28_plant(0,0,1,g,{river:0,warn:1})}</g><circle cx="260" cy="300" r="${t28_f(80+sp*1500)}" fill="${P.gold}" opacity=".22" stroke="${P.gold}" stroke-width="10" stroke-dasharray="30 20"/>
     ${pins.map(([n,x,y,a])=>AT(t,a)?`<g transform="translate(${x},${y}) scale(${pop(t,a).toFixed(3)})"><path d="M0 0 L-30 -60 A34 34 0 1 1 30 -60Z" fill="${P.red}" stroke="${INK}" stroke-width="6"/><circle cy="-84" r="14" fill="#fff"/>${T(0,60,n,{size:46,fill:P.white})}</g>`:'').join('')}
     ${T(960,150,li?'FOR A LIFETIME':'RADIATION ACROSS THE VALLEY',{size:76,fill:li?P.red:P.white,sc:pop(t,li?p.life??17:p.rad??10)})}`;}
  const st=[['PUMPS STOP',p.stop??.6,P.red],['POOL WARMS',p.warm??2.4,P.warm],['BOILS: DAYS',p.boil??4.4,P.coral],['BOILS AWAY: WEEKS',p.away??5.8,P.red]];
  const lv=AT(t,p.away??5.8)?lerp(1,.45,prog(t,p.away??5.8,(p.unc??7.6)+1)):1;
  return `${bgCard('cardWarm',g)}${t28_pool(560,880,.8,g,{label:false,glow:1-prog(t,p.warm??2.4,p.boil??4.4)*.5,warm:AT(t,p.warm??2.4)?1:0,steam:AT(t,p.boil??4.4)?1:0,level:lv})}
   ${st.map(([s,a,c],i)=>AT(t,a)?`<g transform="translate(1430,${300+i*150}) scale(${pop(t,a).toFixed(3)})">${labelPill(0,0,s,c,42)}</g>${i?`<path d="M1430 ${300+i*150-90} v30" stroke="#fff" stroke-width="8"/>`:''}`:'').join('')}
   ${AT(t,p.unc??7.6)?T(960,150,'IF THE FUEL IS UNCOVERED…',{size:84,fill:P.white,sc:pop(t,p.unc??7.6)}):T(960,150,'WHEN IT HITS ZERO',{size:96,fill:P.white,sc:IN(t,.1)})}`;
},
t28Forever(t,d,p,g){
  const ne=AT(t,p.next??1.4),fo=AT(t,p.forever??4),al=AT(t,p.alone??5),fi=AT(t,p.five??6.4);const wk=Math.floor(t*2.4)+1;
  return `${t28_DEF}<rect width="1920" height="1080" fill="#2A323E"/><rect y="800" width="1920" height="280" fill="#1A2028"/>${t28_gen(1300,700,.9,g,{run:1,fuel:.2})}
   ${glint({x:520,y:560,s:.9,t:g,legs:'walk',mouth:'frown',brows:'sad',blink:BL(g),sweat:1})}${[0,1].map(i=>`<g transform="translate(${430+i*180},790)"><rect x="-50" y="-70" width="100" height="130" rx="10" fill="${P.red}" stroke="${INK}" stroke-width="7"/><path d="M-30 -70 V-96 H20" stroke="${INK}" stroke-width="8" fill="none"/></g>`).join('')}
   ${ne?`<g transform="translate(960,380) rotate(${Math.sin(g*20)*3})"><rect x="-160" y="-120" width="320" height="240" rx="20" fill="#FFF6EA" stroke="${INK}" stroke-width="8"/><rect x="-160" y="-120" width="320" height="70" rx="20" fill="${P.red}" stroke="${INK}" stroke-width="8"/>${T(0,60,`WEEK ${fo?'∞':wk}`,{size:76,fill:INK,stroke:0})}</g>`:''}
   ${fo?T(960,150,al?'FOREVER. ALONE.':'FOREVER',{size:120,fill:al?P.red:P.white,sc:pop(t,al?p.alone??5:p.forever??4)}):T(960,150,'REFILL IT. AGAIN. AND AGAIN.',{size:80,fill:P.white,sc:IN(t,.1)})}
   ${t28_timer(fi?18000:18600,g,{x:1400,y:330,s:fi?1:.8})}`;
},
t28Bucket(t,d,p,g){
  const re=AT(t,p.rem??3.8),b1=AT(t,p.b1??6.6),ho=AT(t,p.hose??8.4),b2=AT(t,p.b2??9.2),gr=AT(t,p.grav??11.4);
  if(!re)return `${bgCard('cardDark',g)}${glint({x:960,y:500,s:.95,t:g,mouth:'flat',brows:'raised',blink:BL(g),look:Math.sin(g)})}${T(960,160,'WATER THAT FLOWS BY ITSELF',{size:80,fill:t28_TEAL,sc:IN(t,.1)})}${AT(t,p.nop??1.8)?T(960,880,'NO POWER. NO PEOPLE.',{size:70,fill:P.white,sc:pop(t,p.nop??1.8)}):''}`;
  const fl=ho?1:0;
  return `<rect width="1920" height="1080" fill="#2E3A5A"/><rect x="0" y="0" width="1920" height="1080" fill="url(#gGold)" opacity=".15"/><rect y="840" width="1920" height="240" fill="#1E2640"/>
   <rect x="1000" y="380" width="520" height="30" fill="#8A6A4A" stroke="${INK}" stroke-width="6"/>
   ${b1?`<g transform="translate(1260,380)"><path d="M-90 -170 L90 -170 L70 0 H-70Z" fill="#9AA7BD" stroke="${INK}" stroke-width="8"/><rect x="-86" y="-150" width="172" height="30" fill="#4FB8E8"/></g>`:''}
   ${ho?`<path d="M1240 -360 Q1240 -420 1200 -420" transform="translate(0,800)" stroke="none"/><path d="M1240 240 Q1160 160 1120 260 Q1060 620 800 760" stroke="${INK}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M1240 240 Q1160 160 1120 260 Q1060 620 800 760" stroke="#4A8A4A" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M1240 240 Q1160 160 1120 260 Q1060 620 800 760" stroke="#9FE0FF" stroke-width="8" fill="none" stroke-dasharray="16 22" stroke-dashoffset="${t28_f(-g*140)}"/>`:''}
   ${b2?`<g transform="translate(760,840)"><path d="M-90 -170 L90 -170 L70 0 H-70Z" fill="#9AA7BD" stroke="${INK}" stroke-width="8"/><rect x="-80" y="${t28_f(-30-90*prog(t,p.b2??9.2,(p.b2??9.2)+4))}" width="160" height="${t28_f(30+90*prog(t,p.b2??9.2,(p.b2??9.2)+4))}" fill="#4FB8E8" opacity=".85"/></g>`:''}
   <g opacity=".9">${person({x:420,y:560,s:.95,t:g,who:'osei',pose:'point',mouth:'smile',blink:BL(g)})}</g><g transform="translate(420,190)">${labelPill(0,0,'DR. OSEI',P.ice,36)}</g>
   <rect x="20" y="20" width="1880" height="1040" rx="40" fill="none" stroke="#FFE2A0" stroke-width="10" opacity=".5" stroke-dasharray="40 30"/>
   ${gr?T(960,170,'GRAVITY',{size:180,fill:t28_TEAL,sc:pop(t,p.grav??11.4)}):T(960,150,'HER FAVOURITE DEMO',{size:86,fill:P.white,sc:pop(t,p.rem??3.8)})}`;
},
t28Dam(t,d,p,g){
  const mp=AT(t,p.map??3),fo=AT(t,p.forty??6);const k=prog(t,p.forty??6,(p.forty??6)+1.2);
  return `${t28_sky('day',g)}<path d="M0 360 L700 360 L760 1080 H0Z" fill="#6A8A6A"/><path d="M0 400 H700 V560 H0Z" fill="url(#t28water)"/><path d="M0 400 ${[...Array(10)].map((_,i)=>`q35 ${Math.sin(g*2+i)*5} 70 0`).join(' ')}" stroke="#CFF6FF" stroke-width="5" fill="none"/>
   <path d="M680 340 L760 340 L860 1080 L700 1080Z" fill="#B8BCC4" stroke="${INK}" stroke-width="9"/><path d="M760 340 Q1300 760 1920 900 V1080 H860Z" fill="#7A9A6A" stroke="${INK}" stroke-width="6"/>
   <g transform="translate(1520,900) scale(.42)">${t28_plant(0,0,1,g,{river:0})}</g>
   ${fo?`<g opacity="${k.toFixed(2)}"><path d="M300 400 H1780 M1740 400 V820" stroke="#fff" stroke-width="7" stroke-dasharray="20 16"/><path d="M1716 430 L1740 400 L1764 430 M1716 790 L1740 820 L1764 790" stroke="#fff" stroke-width="8" fill="none"/>${T(1640,640,'40 m',{size:96,fill:P.white})}</g>`:''}
   ${T(400,330,'RESERVOIR',{size:54,fill:P.white,sc:IN(t,p.res??1.4)})}${T(1520,700,'FUEL POOL',{size:46,fill:P.white,sc:IN(t,(p.res??1.4)+.6)})}
   ${mp?`<g transform="translate(1300,200) scale(${pop(t,p.map??3).toFixed(3)})">${labelPill(0,0,'IN THIS STORY',P.gold,40)}</g>`:''}${T(600,160,'ABOVE THE PLANT',{size:80,fill:P.white,sc:IN(t,.1),op:fo?0:1})}`;
},
t28Pressure(t,d,p,g){
  const tn=AT(t,p.ten??1.2),at=AT(t,p.atm??3.2),tw=AT(t,p.tower??6.2),ht=AT(t,p.height??9.2);const k=prog(t,.2,2);
  return `${bgCard('cardMint',g)}<g transform="translate(560,960)"><rect x="-130" y="-760" width="260" height="760" fill="#1A2636" stroke="${INK}" stroke-width="9"/><rect x="-130" y="${t28_f(-760*k)}" width="260" height="${t28_f(760*k)}" fill="url(#t28water)"/>
     ${[1,2,3,4].map(i=>{const y=-190*i+190;const a=(p.atm??3.2)+(4-i)*.4;return `<path d="M130 ${y} H180" stroke="#fff" stroke-width="6"/>${T(-210,y+14,`${(4-i)*10+10} m`,{size:38,fill:P.white})}${at&&AT(t,a)?`<g transform="translate(330,${y}) scale(${pop(t,a).toFixed(3)})">${labelPill(0,0,`+${4-i+1} atm`,P.gold,38)}</g>`:''}`;}).join('')}</g>
   ${tw?`<g transform="translate(1440,620) scale(${pop(t,p.tower??6.2).toFixed(3)})"><ellipse cy="-220" rx="200" ry="150" fill="#C9D3E3" stroke="${INK}" stroke-width="9"/><text y="-200" text-anchor="middle" font-size="44" font-weight="900" fill="${INK}">WATER</text><path d="M-120 -100 L-170 300 M120 -100 L170 300 M-140 100 H140" stroke="#8E9AB0" stroke-width="20"/><path d="M60 -80 V300 H320" stroke="#4FB8E8" stroke-width="20" fill="none"/>${icon('home',380,240,.8)}</g>`:''}
   ${T(1100,150,ht?'JUST HEIGHT':AT(t,p.nop??8.2)?'NO PUMPS':tn?'+1 ATMOSPHERE PER 10 m':'REAL SCIENCE',{size:84,fill:ht?t28_TEAL:P.white,sc:pop(t,ht?p.height??9.2:AT(t,p.nop??8.2)?p.nop??8.2:tn?p.ten??1.2:.05)})}`;
},
t28Flex(t,d,p,g){
  const co=AT(t,p.conn??2.6),ou=AT(t,p.outside??6.4),ho=AT(t,p.hose??8.4);
  return `${t28_sky('day',g)}<rect y="840" width="1920" height="240" fill="#6A7A6A"/><rect x="200" y="200" width="1100" height="660" fill="#B8C4D0" stroke="${INK}" stroke-width="10"/><text x="750" y="300" text-anchor="middle" font-size="56" font-weight="900" fill="${INK}">FUEL BUILDING</text><g transform="translate(750,800) scale(.55)">${t28_pool(0,0,1,g,{label:false})}</g>
   ${co?`<g transform="translate(1300,640)"><rect x="-20" y="-40" width="220" height="80" fill="#C04A3A" stroke="${INK}" stroke-width="8"/><rect x="190" y="-64" width="40" height="128" rx="8" fill="#9AA7BD" stroke="${INK}" stroke-width="7"/><circle cx="210" cy="0" r="22" fill="#2A2E3A"/></g><g transform="translate(1520,500) scale(${pop(t,p.conn??2.6).toFixed(3)})">${labelPill(0,0,'EMERGENCY FILL',P.gold,46)}</g>`:''}
   ${ho?`<path d="M1530 640 Q1700 640 1760 860 T1920 1000" stroke="${INK}" stroke-width="34" fill="none"/><path d="M1530 640 Q1700 640 1760 860 T1920 1000" stroke="#E8D0A0" stroke-width="20" fill="none"/>`:''}
   ${T(960,150,'AFTER FUKUSHIMA, 2011',{size:90,fill:P.white,sc:IN(t,.1)})}${ou?T(750,560,'WATER FROM OUTSIDE',{size:60,fill:P.ice,sc:pop(t,p.outside??6.4)}):''}`;
},
t28Hoses(t,d,p,g){
  const K=[[0,4*3600],[p.h3??10.8,3*3600],[p.h1??12.4,3600],[p.m10??16.6,600],[d,420]];let sec=K[0][1];for(let i=1;i<K.length;i++)if(t<=K[i][0]){sec=lerp(K[i-1][1],K[i][1],(t-K[i-1][0])/Math.max(.01,K[i][0]-K[i-1][0]));break;}
  const path='M330 300 Q700 380 820 560 T1300 820 T1640 900';const k=prog(t,p.drag??3.6,(p.m10??16.6)-.5);
  const gx=lerp(640,1560,k),gy=lerp(470,880,k);
  return `${t28_sky('gold',g)}<path d="M0 260 L520 260 L560 1080 H0Z" fill="#6A8A6A"/><path d="M0 300 H520 V420 H0Z" fill="url(#t28water)"/><path d="M500 240 L560 240 L640 1080 L520 1080Z" fill="#B8BCC4" stroke="${INK}" stroke-width="8"/>
   <path d="M560 250 Q1200 700 1920 820 V1080 H600Z" fill="#7A8A5A" stroke="${INK}" stroke-width="6"/><g transform="translate(1660,900) scale(.34)">${t28_plant(0,0,1,g,{river:0})}</g>
   <path d="${path}" stroke="#000" stroke-width="10" fill="none" opacity=".15"/><path d="${path}" stroke="${INK}" stroke-width="26" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="${k.toFixed(3)} 2"/><path d="${path}" stroke="#E8D0A0" stroke-width="14" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="${k.toFixed(3)} 2"/>
   ${glint({x:gx,y:gy-170,s:.55,t:g*2,legs:'walk',pose:'reach',mouth:AT(t,p.arms??13.6)?'teeth':'flat',brows:'angry',sweat:AT(t,p.h1??12.4)?1:0,blink:BL(g)})}
   ${AT(t,p.len??6.6)?`<g transform="translate(900,380) scale(${pop(t,p.len??6.6).toFixed(3)})">${labelPill(0,0,'CLICK. CLICK. CLICK.',P.ice,40)}</g>`:''}
   ${T(960,150,AT(t,p.hund??1.6)?'HUNDREDS OF METRES OF HOSE':'FIRE HOSES',{size:80,fill:P.white,sc:pop(t,AT(t,p.hund??1.6)?p.hund??1.6:.05)})}${t28_timer(sec,g,{x:1380,y:330,s:1})}`;
},
t28Stop(t,d,p,g){
  const sp=AT(t,p.sput??.9),st=AT(t,p.stop??1.8),wi=AT(t,p.wind??2.8);const run=st?0:1;const fan=wi?Math.max(0,1-(t-(p.wind??2.8))/1.5):1;
  return `${t28_DEF}<rect width="1920" height="1080" fill="#2A323E"/><rect y="800" width="1920" height="280" fill="#1A2028"/>${t28_gen(700,700,1.2,g*(sp&&!st?.6:1),{run,fuel:0})}
   <g transform="translate(1500,620)"><circle r="160" fill="#3A4A5A" stroke="${INK}" stroke-width="9"/><g transform="rotate(${t28_f((g*600*fan)%360)})">${[0,1,2,3].map(i=>`<path d="M0 0 Q60 -40 0 -130 Q-30 -60 0 0Z" fill="#9AA7BD" stroke="${INK}" stroke-width="5" transform="rotate(${i*90})"/>`).join('')}</g><circle r="26" fill="${INK}"/>${T(0,230,'COOLING PUMP',{size:44,fill:P.white})}</g>
   ${st?`<rect width="1920" height="1080" fill="${P.red}" opacity="${(.15+.1*Math.sin(g*6)).toFixed(2)}"/>`:''}
   ${T(960,150,st?'STOPS.':sp?'SPUTTERS…':'COUGHS…',{size:130,fill:st?P.red:P.white,sc:pop(t,st?p.stop??1.8:sp?p.sput??.9:.05)})}${t28_timer(st?0:300,g,{x:1300,y:880,s:.8})}`;
},
t28Valve(t,d,p,g){
  const hv=AT(t,p.heave??1.4),no=AT(t,p.noth??3.4),ki=AT(t,p.kick??4.8),sw=AT(t,p.swell??6.6);const k=prog(t,p.kick??4.8,(p.swell??6.6)+3);const rot=hv?Math.min(1,(t-(p.heave??1.4))/1.8)*540:0;
  const path='M330 300 Q700 380 820 560 T1300 820 T1640 900';
  return `${t28_sky('gold',g)}<path d="M0 260 L520 260 L560 1080 H0Z" fill="#6A8A6A"/><path d="M0 300 H520 V420 H0Z" fill="url(#t28water)"/><path d="M500 240 L560 240 L640 1080 L520 1080Z" fill="#B8BCC4" stroke="${INK}" stroke-width="8"/>
   <path d="M560 250 Q1200 700 1920 820 V1080 H600Z" fill="#7A8A5A" stroke="${INK}" stroke-width="6"/><g transform="translate(1660,900) scale(.34)">${t28_plant(0,0,1,g,{river:0})}</g>
   <path d="${path}" stroke="${INK}" stroke-width="${t28_f(22+k*12)}" fill="none" stroke-linecap="round"/><path d="${path}" stroke="#E8D0A0" stroke-width="${t28_f(10+k*10)}" fill="none" stroke-linecap="round"/><path d="${path}" stroke="#7FD8FF" stroke-width="${t28_f(12)}" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="${k.toFixed(3)} 2" opacity=".9"/>
   <g transform="translate(330,300)"><circle r="70" fill="none" stroke="${INK}" stroke-width="22"/><circle r="70" fill="none" stroke="${P.red}" stroke-width="12"/><g transform="rotate(${t28_f(rot)})"><path d="M-70 0 H70 M0 -70 V70" stroke="${P.red}" stroke-width="12"/></g></g>
   ${glint({x:470,y:420,s:.55,t:g,pose:'reach',dir:-1,mouth:ki?'grin':'teeth',brows:ki?'raised':'angry',blink:BL(g)})}
   ${T(1100,170,sw?'ALL THE WAY DOWN THE HILL':ki?'THE HOSE KICKS':no?'NOTHING…':'OPEN THE VALVE',{size:84,fill:ki?t28_TEAL:P.white,sc:pop(t,sw?p.swell??6.6:ki?p.kick??4.8:no?p.noth??3.4:.05)})}`;
},
t28Blue(t,d,p,g){
  const ch=AT(t,p.cher??6.2),ho=AT(t,p.holds??9.6),ov=AT(t,p.over??11.4),gr=AT(t,p.grav??17.6),cr=AT(t,p.cry??21.4),hb=AT(t,p.head??24.6);
  if(cr){return `${t28_DEF}<rect width="1920" height="1080" fill="#0A1A2E"/><ellipse cx="960" cy="900" rx="1100" ry="360" fill="url(#t28blue)" opacity=".6"/><rect y="820" width="1920" height="260" fill="#3A4A5A" stroke="${INK}" stroke-width="7"/>
     ${glint({x:840,y:540,s:1.05,t:g,legs:'sit',mouth:hb?'smile':'wavy',eyes:hb?'closed':'open',brows:'sad',blink:BL(g)})}${[0,1].map(i=>`<path d="M${808+i*64} ${t28_f(500+((g*90+i*30)%70))} q-6 14 0 20 q6 -6 0 -20Z" fill="#9FE0FF" opacity="${hb?0:.9}"/>`).join('')}
     ${pickles(hb?1020:1220,hb?620:820,.85,g,{mood:hb?'happy':'grump',blink:hb?1:0})}${hb?T(1150,450,'♥',{size:90,fill:P.red}):''}${T(960,150,hb?'HEADBUTT':'IT HOLDS',{size:110,fill:hb?P.gold:t28_TEAL,sc:pop(t,hb?p.head??24.6:p.cry??21.4)})}`;}
  return `${t28_DEF}<rect width="1920" height="1080" fill="#061224"/>${t28_pool(960,920,1.25,g,{label:false,glow:1.3,inlet:1,level:1})}<ellipse cx="960" cy="700" rx="900" ry="340" fill="url(#t28blue)" opacity="${(.35+.1*Math.sin(g*2)).toFixed(2)}"/>
   ${ov?`<path d="M460 270 q-40 0 -50 80" stroke="#AEE8FF" stroke-width="18" fill="none" stroke-dasharray="14 10" stroke-dashoffset="${t28_f(-g*80)}"/><g transform="translate(440,240)">${labelPill(0,0,'OVERFLOW',P.ice,34)}</g>`:''}
   ${ho?`<g transform="translate(1520,360) scale(${pop(t,p.holds??9.6).toFixed(3)})">${t28_gauge(0,0,90,.82,'LEVEL',{col:P.mint})}</g>`:''}
   ${ch?`<g transform="translate(1420,620) scale(${pop(t,p.cher??6.2).toFixed(3)})">${labelPill(0,0,'CHERENKOV LIGHT',t28_TEAL,40)}</g>`:''}
   ${T(960,150,gr?'JUST GRAVITY':AT(t,p.nop??15.6)?'NO POWER. NO PEOPLE.':ov?'COLD IN, WARM OUT':AT(t,p.glow??2.6)?'A SOFT, EERIE BLUE':'WATER POURS IN',{size:90,fill:gr?t28_TEAL:P.white,sc:pop(t,gr?p.grav??17.6:AT(t,p.nop??15.6)?p.nop??15.6:ov?p.over??11.4:AT(t,p.glow??2.6)?p.glow??2.6:.05)})}`;
},
t28Wild(t,d,p,g){
  const we=AT(t,p.weeds??2),fx=AT(t,p.fox??4.4),de=AT(t,p.deer??7),sc=AT(t,p.sci??10.6),ch=AT(t,p.cher??12.6),wo=AT(t,p.wolf??16.4);
  if(sc){return `${bgCard('cardMint',g)}${ch?`<g transform="translate(960,300) scale(${pop(t,p.cher??12.6).toFixed(3)})"><rect x="-470" y="-90" width="940" height="180" rx="24" fill="#08121C" fill-opacity=".9" stroke="${P.gold}" stroke-width="7"/>${T(0,-14,'CHERNOBYL ZONE',{size:70,fill:P.gold})}${T(0,60,'PEOPLE LEFT IN 1986',{size:48,fill:P.white})}</g>`:''}
     ${wo?`${t28_wolf(420,740,1.0)}${t28_elk(980,660,.8,g)}${t28_boar(1520,760,.9)}${T(420,900,'WOLVES',{size:50,fill:P.white})}${T(980,900,'ELK',{size:50,fill:P.white})}${T(1520,900,'WILD BOAR',{size:50,fill:P.white})}`:t28_tree(960,1000,1.0)}
     ${T(960,ch?560:150,ch?'':'SCIENTISTS HAVE SEEN THIS',{size:84,fill:P.white,sc:pop(t,p.sci??10.6)})}${wo?T(960,560,'CAME BACK IN HUGE NUMBERS',{size:70,fill:t28_TEAL,sc:pop(t,p.wolf??16.4)}):''}`;}
  if(de){return `${t28_DEF}<rect width="1920" height="1080" fill="#C9B89A"/>${[300,700,1220,1620].map(x=>`<rect x="${x-40}" y="0" width="80" height="820" fill="#E8DCC4" stroke="${INK}" stroke-width="6"/>`).join('')}<rect y="820" width="1920" height="260" fill="#A8987A" stroke="${INK}" stroke-width="6"/>
     <rect x="1100" y="660" width="320" height="180" fill="#8A6A4A" stroke="${INK}" stroke-width="7"/>${[0,1,2,3,4].map(i=>`<path d="M${1140+i*60} 670 q-30 -120 -${10+i*4} -${200-i*20} M${1140+i*60} 670 q40 -110 ${30-i*2} -${180-i*10}" stroke="#2E8A3E" stroke-width="16" fill="none" stroke-linecap="round"/>`).join('')}<g transform="translate(1260,880)">${labelPill(0,0,'FERN DISPLAY',P.gold,32)}</g>
     ${t28_deer(800,690,1.15,g,{eat:1})}${T(960,150,'A DEER IN THE MUSEUM',{size:90,fill:P.white,sc:pop(t,p.deer??7)})}`;}
  if(fx){return `${t28_DEF}<rect width="1920" height="1080" fill="#8AA0A8"/><rect x="0" y="0" width="1920" height="200" fill="#5A6E78"/><rect x="560" y="60" width="800" height="100" rx="12" fill="#1A2236"/><text x="960" y="130" text-anchor="middle" font-size="60" font-weight="900" fill="#FF6BD6" opacity=".4">SHOPPING CENTRE</text>
     ${[0,1,2,3].map(i=>`<rect x="${100+i*460}" y="260" width="380" height="460" fill="#C9D8DC" stroke="${INK}" stroke-width="7"/><path d="M${100+i*460} 720 q120 -150 200 -40 q80 -140 180 0" fill="#3E8A4A" stroke="${INK}" stroke-width="5"/>`).join('')}<rect y="720" width="1920" height="360" fill="#B8C4C8"/>
     ${t28_fox(640,880,1,g)}${t28_fox(1240,900,.85,g+1,{dir:-1})}${T(960,960,'',{size:10})}${T(960,250,'FOXES ASLEEP IN THE SHOPS',{size:80,fill:P.white,sc:pop(t,p.fox??4.4)})}`;}
  return `${t28_street(g,{mode:'day',wild:we?1:.4})}${T(960,150,we?'WEEDS BURST THROUGH':'MONTHS PASS',{size:96,fill:we?P.mint:P.white,sc:pop(t,we?p.weeds??2:.05)})}`;
},
t28Lamp(t,d,p,g){
  const so=AT(t,p.solar??3),ju=AT(t,p.just??7.4);
  return `${t28_sky('night',g)}${t28_skyline(g,{lit:0,y0:900,col:'#0A1426',seed:61})}${t28_museum(960,820,1,g,{lamp:1,solar:1,night:1})}<rect y="1000" width="1920" height="80" fill="#05080F"/>
   ${so?`<g transform="translate(560,340) scale(${pop(t,p.solar??3).toFixed(3)})">${labelPill(0,0,'SOLAR PANELS',t28_TEAL,40)}</g>`:''}${T(960,150,ju?'JUST IN CASE':'ONE LAMP, EVERY NIGHT',{size:96,fill:ju?P.gold:P.white,sc:pop(t,ju?p.just??7.4:.05)})}`;
},
t28FarWindow(t,d,p,g){
  const sn=AT(t,p.snow??1),lv=AT(t,p.leaves??2.6),li=AT(t,p.light??5.4),im=AT(t,p.imp??7.4),su=AT(t,p.summer??18.4),ba=AT(t,p.bare??21);
  const leaves=lv?1-prog(t,p.leaves??2.6,(p.leaves??2.6)+2.4):1;const fw=li?pop(t,p.light??5.4):0;
  const rules=[[p.batt??9.6,'BATTERIES: ALL DEAD',P.coral],[p.nosol??12,'NO SOLAR PANELS',P.coral],[p.gen??14,'= A GENERATOR',P.gold],[p.fill??16,'= SOMEONE',t28_TEAL]];
  if(su){const lf=ba?1-prog(t,p.bare??21,(p.bare??21)+1.6):1;return `${t28_sky('snow',g)}${t28_museum(400,900,.6,g,{lamp:1})}${[700,860,1020,1180].map((x,i)=>t28_tree(x,1000,1.3,{leaves:lf,snow:ba?1:0})).join('')}
     <g transform="translate(1600,640)">${t28_win(0,0,70,56,1,g)}</g>${t28_flakes(g,.8)}${T(960,150,ba?'NOW THE TREES ARE BARE':'ALL SUMMER, THE FOREST HID IT',{size:80,fill:ba?t28_TEAL:P.white,sc:pop(t,ba?p.bare??21:p.summer??18.4)})}`;}
  return `${t28_sky('snow',g)}${t28_skyline(g,{lit:0,y0:820,col:'#14203A',seed:73})}<g transform="translate(1380,${820-300})">${t28_win(0,0,46,40,fw,g)}</g>
   ${[160,360,1680,1820].map(x=>t28_tree(x,1080,1.1,{leaves,snow:sn?1:0})).join('')}<rect y="980" width="1920" height="100" fill="#E8F0FF" opacity=".8"/>${t28_flakes(g,sn?1:0)}
   ${im?rules.map(([a,s,c],i)=>AT(t,a)?`<g transform="translate(560,${320+i*120}) scale(${pop(t,a).toFixed(3)})">${labelPill(0,0,s,c,40)}</g>`:'').join(''):''}
   ${T(960,150,im?'BY THE RULES: IMPOSSIBLE':li?'A WINDOW LIGHTS UP':lv?'THE LAST LEAVES FALL':'MONTH SIX. FIRST SNOW.',{size:84,fill:im?P.red:li?P.gold:P.white,sc:pop(t,im?p.imp??7.4:li?p.light??5.4:lv?p.leaves??2.6:.05)})}`;
},
t28Morse(t,d,p,g){
  const b=[p.b1??.4,p.b2??1.2,p.b3??2];const to=AT(t,p.torch??3.4),pa=AT(t,p.pause??7),mo=AT(t,p.morse??9),kn=AT(t,p.knows??12.6),fr=AT(t,p.frost??18.4),l1=AT(t,p.l1??22);
  const far=b.some(a=>t>=a&&t<a+.35)||(mo&&!l1&&Math.sin(g*9)>.3)||(l1&&((t-(p.l1??22))%.8)<.4);
  const mine=to&&!pa&&[0,1,2].some(i=>t>=(p.torch??3.4)+1.2+i*.7&&t<(p.torch??3.4)+1.55+i*.7);
  const L=['P','I','C','K','L','E','S'],M=['·−−·','··','−·−·','−·−','·−··','·','···'];
  const nL=l1?Math.min(7,1+Math.floor((t-(p.l1??22))/0.62)):0;
  return `${t28_sky('snow',g)}${t28_skyline(g,{lit:0,y0:900,col:'#14203A',seed:73})}<g transform="translate(1380,560)">${t28_win(0,0,64,54,far?1:.08,g)}</g>
   <rect x="0" y="0" width="1920" height="1080" fill="none" stroke="#1A2236" stroke-width="120"/><path d="M960 0 V1080 M0 540 H1920" stroke="#1A2236" stroke-width="30"/><rect x="60" y="60" width="1800" height="960" fill="#DDEBFF" opacity=".07"/>
   ${glint({x:420,y:680,s:.95,t:g,look:1,mouth:l1?'o':mine?'flat':'o',brows:'raised',blink:far?0:BL(g),pose:to?'point':'down'})}${to?`<g transform="translate(590,640)"><rect x="-40" y="-20" width="90" height="40" rx="10" fill="#5D6A82" stroke="${INK}" stroke-width="6"/>${mine?`<path d="M50 -20 L900 -200 L900 140 L50 20Z" fill="#FFF2C8" opacity=".25"/>`:''}</g>`:''}
   ${mo&&!fr?`<g transform="translate(1380,800)">${T(0,0,M[Math.floor(g*1.2)%7],{size:110,fill:P.gold})}</g>`:''}
   ${fr?`<g transform="translate(960,380)">${L.slice(0,nL).map((c,i)=>T(-480+i*160,0,c,{size:150,fill:'#F4FAFF',rot:(i%2?3:-3),stroke:16})).join('')}</g>`:''}
   ${kn&&!fr?`<g transform="translate(1100,860) scale(${pop(t,p.knows??12.6).toFixed(3)})">${labelPill(0,0,'MORSE CODE: FROM THE RADIO EXHIBIT',P.gold,36)}</g>`:''}
   ${!fr?T(960,150,mo?'MORSE CODE':pa?'A LONG PAUSE…':to?'HE BLINKS BACK':'ONCE. TWICE. THREE TIMES.',{size:90,fill:mo?P.gold:P.white,sc:pop(t,mo?p.morse??9:pa?p.pause??7:to?p.torch??3.4:.05)}):''}`;
},
t28Nan(t,d,p,g){
  const na=AT(t,p.nan??3.4);const z=eout(prog(t,0,3.4));
  if(!na)return `${t28_sky('snow',g)}${t28_skyline(g,{lit:0,y0:900,col:'#14203A',seed:73})}<g transform="translate(960,560) scale(${lerp(1,2.6,z).toFixed(3)}) translate(-1380,-560)"><g transform="translate(1380,560)">${t28_win(0,0,64,54,1,g)}</g></g>${T(960,170,'ONLY ONE PERSON',{size:96,fill:P.white,sc:IN(t,.1)})}${T(960,290,'WOULD ASK ABOUT THAT CAT',{size:70,fill:P.gold,sc:IN(t,1.2)})}`;
  return `${t28_DEF}<rect width="1920" height="1080" fill="#1A2236"/><circle cx="960" cy="560" r="700" fill="url(#t28lamp)" opacity=".9"/><rect x="560" y="200" width="800" height="720" fill="#FFD27A" stroke="#0A1224" stroke-width="40"/><path d="M960 200 V920 M560 560 H1360" stroke="#0A1224" stroke-width="24"/>
   <g transform="translate(960,640)">${person({x:0,y:0,s:1.4,t:g,who:'nan',pose:'wave',mouth:'smile',blink:BL(g)}).replace(/#F2C9A0/g,'#2A2030').replace(/#B58BD6/g,'#2A2030').replace(/#9468BC/g,'#2A2030').replace(/#E8E6EF/g,'#2A2030')}</g>
   ${T(960,170,'NAN.',{size:170,fill:P.gold,sc:pop(t,p.nan??3.4)})}`;
},
t28Ask(t,d,p,g){
  const fi=AT(t,p.first??1.2),wh=AT(t,p.who??4.4);
  return `${t28_street(g,{mode:'gold',wild:.7,cam:t*10})}${glint({x:700,y:640,s:.95,t:g,look:1,mouth:wh?'smirk':'o',brows:'raised',blink:BL(g),pose:'shrug'})}${pickles(1000,880,.7,g,{mood:'grump'})}
   ${fi?T(960,160,'WHAT WOULD YOU DO FIRST?',{size:90,fill:P.white,sc:pop(t,p.first??1.2)}):''}${wh?T(960,290,'WHO WOULD YOU HOPE IS OUT THERE?',{size:62,fill:P.gold,sc:pop(t,p.who??4.4)}):''}`;
}
});

// every 028 shot carries its own gradients (cards from the shared lib don't)
Object.keys(SHOTS).filter(k=>k.startsWith('t28')).forEach(k=>{const f=SHOTS[k];SHOTS[k]=(t,d,p,g)=>t28_DEF+f(t,d,p,g);});
