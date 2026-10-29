// Recurring story cast: Nan, Kai, Dr. Osei, Mr. Pickles. Same look in every story episode.
const CAST = {
  nan:  { skin:'#F2C9A0', top:'#B58BD6', top2:'#9468BC', hair:'#E8E6EF', s:.92 },
  kai:  { skin:'#C68B59', top:'#FF5E5B', top2:'#D8403E', hair:'#2A1A12', s:1.0 },
  osei: { skin:'#6B3F24', top:'#F4F6FA', top2:'#C9D2E0', hair:'#15100C', s:1.02 },
};
function person(o){
  const {x=0,y=0,s=1,t=0,who='kai',pose='down',mouth='smile',brows='calm',look=0,legs='stand',blink=0,rot=0,sweat=0}=o;
  const c=CAST[who], S=s*c.s, LW=14, by=Math.sin(t*2.4+(who==='nan'?2:who==='osei'?4:0))*4;
  const limb=(d,col=P.cream)=>`<path d="${d}" stroke="${INK}" stroke-width="${LW+10}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${col}" stroke-width="${LW}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const wa=Math.sin(t*9)*20;
  const A={down:['M0 40 Q-48 80 -60 145','M0 40 Q48 80 60 145'],point:['M0 40 Q-48 80 -60 145','M0 40 L85 35 L165 15'],
    up:[`M0 40 Q-70 10 -100 ${-70+Math.sin(t*6)*8}`,`M0 40 Q70 10 100 ${-70+Math.sin(t*6+1)*8}`],wave:['M0 40 Q-48 80 -60 145',`M0 40 Q90 40 ${120+wa*.4} ${-30+wa}`],
    hips:['M0 40 Q-70 80 -12 118','M0 40 Q70 80 12 118'],hold:['M0 40 Q-40 95 30 92','M0 40 Q40 95 62 82'],shrug:['M0 40 Q-70 70 -110 10','M0 40 Q70 70 110 10'],
    reach:['M0 40 Q-60 30 -135 0','M0 40 Q60 30 135 0'],cross:['M0 40 Q-50 95 34 86','M0 40 Q50 100 -34 74']}[pose]||[];
  const lg=legs==='walk'?Math.sin(t*8)*22:0;
  const L=legs==='sit'?['M0 170 L-70 170 L-70 290','M0 170 L60 175 L60 290']:[`M0 170 Q${-20-lg} 230 ${-38-lg} 300`,`M0 170 Q${20+lg} 230 ${38+lg} 300`];
  const top = who==='osei' ? `<path d="M-46 30 L46 30 L66 215 L-66 215Z" fill="${c.top}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M0 30 V200 M-20 30 L0 80 L20 30" stroke="${c.top2}" stroke-width="6" fill="none"/><rect x="18" y="90" width="26" height="30" rx="4" fill="${c.top2}" stroke="${INK}" stroke-width="4"/>`
    : who==='kai' ? `<path d="M-50 30 Q0 18 50 30 L56 175 Q0 188 -56 175Z" fill="${c.top}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-20 120 H20 V150 H-20Z" fill="${c.top2}" stroke="${INK}" stroke-width="4"/><path d="M-12 36 V70 M12 36 V70" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`
    : `<path d="M-48 30 Q0 22 48 30 L58 185 Q0 196 -58 185Z" fill="${c.top}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M0 34 V188" stroke="${c.top2}" stroke-width="6"/>${[70,105,140].map(yy=>`<circle cx="10" cy="${yy}" r="6" fill="#fff" stroke="${INK}" stroke-width="3"/>`).join('')}`;
  const hair = who==='nan' ? `<circle cx="0" cy="-150" r="40" fill="${c.hair}" stroke="${INK}" stroke-width="8"/><path d="M-82 -60 Q-86 -140 0 -142 Q86 -140 82 -60 Q70 -110 0 -112 Q-70 -110 -82 -60Z" fill="${c.hair}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`
    : who==='kai' ? `<path d="M-84 -66 Q-90 -150 -20 -150 L-10 -170 L10 -150 L30 -168 L40 -146 Q92 -140 84 -66 Q60 -120 0 -118 Q-60 -120 -84 -66Z" fill="${c.hair}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`
    : `<path d="M-80 -78 Q-80 -146 0 -146 Q80 -146 80 -78 Q60 -124 0 -124 Q-60 -124 -80 -78Z" fill="${c.hair}" stroke="${INK}" stroke-width="8"/>`;
  const glasses = who==='nan' ? `<path d="M-50 -62 h40 M10 -62 h40 M-10 -62 h20" stroke="${INK}" stroke-width="0"/><rect x="-54" y="-80" width="44" height="34" rx="10" fill="none" stroke="${INK}" stroke-width="7"/><rect x="10" y="-80" width="44" height="34" rx="10" fill="none" stroke="${INK}" stroke-width="7"/><path d="M-10 -66 H10" stroke="${INK}" stroke-width="6"/>`
    : who==='osei' ? `<rect x="-56" y="-78" width="46" height="30" rx="6" fill="none" stroke="${INK}" stroke-width="8"/><rect x="10" y="-78" width="46" height="30" rx="6" fill="none" stroke="${INK}" stroke-width="8"/><path d="M-10 -64 H10" stroke="${INK}" stroke-width="6"/>` : '';
  const ex = blink ? `<path d="M-42 -62 h28 M14 -62 h28" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` : `<circle cx="${-28+look*8}" cy="-62" r="${mouth==='o'?12:10}" fill="${INK}"/><circle cx="${28+look*8}" cy="-62" r="${mouth==='o'?12:10}" fill="${INK}"/>`;
  const bY={calm:-96,raised:-108,angry:-90,sad:-98}[brows]||-96, bR={calm:0,raised:-6,angry:16,sad:-14}[brows]||0;
  const br = `<path d="M-46 ${bY} L-14 ${bY}" stroke="${who==='nan'?'#9C98A8':INK}" stroke-width="8" stroke-linecap="round" transform="rotate(${bR} -30 ${bY})"/><path d="M14 ${bY} L46 ${bY}" stroke="${who==='nan'?'#9C98A8':INK}" stroke-width="8" stroke-linecap="round" transform="rotate(${-bR} 30 ${bY})"/>`;
  const M = {smile:`<path d="M-20 -24 Q0 -4 20 -24" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    o:`<ellipse cx="0" cy="-16" rx="12" ry="16" fill="#3a1220" stroke="${INK}" stroke-width="5"/>`,
    laugh:`<path d="M-26 -28 H26 Q22 4 0 4 Q-22 4 -26 -28Z" fill="#3a1220" stroke="${INK}" stroke-width="5"/>`,
    frown:`<path d="M-18 -12 Q0 -28 18 -12" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    flat:`<path d="M-14 -18 H14" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`,
    grin:`<path d="M-26 -28 Q0 6 26 -28Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`}[mouth]||'';
  const extraFace = who==='nan' ? `<path d="M-60 -40 q8 6 14 0 M46 -40 q8 6 14 0" stroke="#D99A88" stroke-width="4" fill="none"/>` : who==='kai' ? `<path d="M30 -20 l10 -6" stroke="${INK}" stroke-width="4"/>` : `<path d="M-30 -2 Q0 14 30 -2" stroke="${c.hair}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".9"/>`;
  return `<g transform="translate(${x},${y+by}) rotate(${rot}) scale(${S})">
    <ellipse cx="0" cy="302" rx="72" ry="12" fill="rgba(0,0,0,.3)"/>
    ${limb(L[0],'#3B4A78')}${limb(L[1],'#3B4A78')}${top}${A[0]?limb(A[0],c.top):''}${A[1]?limb(A[1],c.top):''}
    <circle cx="0" cy="-55" r="84" fill="${c.skin}" stroke="${INK}" stroke-width="9"/>${hair}${extraFace}${br}${ex}${glasses}${M}
    <circle cx="-48" cy="-30" r="12" fill="#FF8FA3" opacity=".35"/><circle cx="48" cy="-30" r="12" fill="#FF8FA3" opacity=".35"/>
    ${sweat?`<path d="M70 -110 q10 18 0 26 q-10 -8 0 -26Z" fill="#9AD1FF" stroke="${INK}" stroke-width="3"/>`:''}
  </g>`;
}
function pickles(x,y,s=1,t=0,o={}){ const {mood='grump',blink=0}=o; const tw=Math.sin(t*3)*14;
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="62" rx="90" ry="12" fill="rgba(0,0,0,.3)"/>
   <path d="M70 20 Q${130+tw} -20 ${110+tw} -70" stroke="${INK}" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M70 20 Q${130+tw} -20 ${110+tw} -70" stroke="#F0913A" stroke-width="16" fill="none" stroke-linecap="round"/>
   <ellipse cx="0" cy="20" rx="90" ry="50" fill="#F0913A" stroke="${INK}" stroke-width="8"/><path d="M-40 -10 q10 20 0 50 M0 -24 q10 24 0 60 M40 -10 q10 20 0 50" stroke="#C86A1E" stroke-width="7" fill="none"/>
   <g transform="translate(-70,-30)"><path d="M-46 -30 L-40 -78 L-12 -50 Z M46 -30 L40 -78 L12 -50Z" fill="#F0913A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><circle r="56" fill="#F0913A" stroke="${INK}" stroke-width="8"/>
   ${blink?`<path d="M-30 -6 h18 M12 -6 h18" stroke="${INK}" stroke-width="6"/>`:mood==='grump'?`<path d="M-34 -14 L-12 -6 M34 -14 L12 -6" stroke="${INK}" stroke-width="6"/><circle cx="-20" cy="2" r="6" fill="${INK}"/><circle cx="20" cy="2" r="6" fill="${INK}"/>`:`<circle cx="-20" cy="-2" r="9" fill="${INK}"/><circle cx="20" cy="-2" r="9" fill="${INK}"/>`}
   <path d="M-6 16 L6 16 L0 24Z" fill="#E86A8A"/><path d="M0 24 q-10 12 -20 4 M0 24 q10 12 20 4" stroke="${INK}" stroke-width="4" fill="none"/><path d="M-28 22 h-34 M-28 30 h-30 M28 22 h34 M28 30 h30" stroke="${INK}" stroke-width="3"/></g></g>`; }
