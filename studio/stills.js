const {chromium}=require('playwright'),path=require('path'),fs=require('fs');
(async()=>{
  const TL=JSON.parse(fs.readFileSync(process.env.TLFILE||'timeline.json')); const out=process.argv[2]; const frac=+(process.argv[3]||.6); const mode=process.argv[4]||'land';
  fs.mkdirSync(out,{recursive:true});
  const b=await chromium.launch(); const p=await b.newPage({viewport:mode==='land'?{width:1920,height:1080}:{width:1080,height:1920}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('file://'+path.resolve('engine.html')); await p.evaluate(async d=>{await setData(d)},TL);
  const list=process.argv[5]?process.argv[5].split(',').map(Number):TL.shots.map((s,i)=>i);
  for(const i of list){const s=TL.shots[i]; const t=s.s+(s.e-s.s)*frac;
    await p.evaluate(([t,m])=>renderFrame(t,m),[t,mode]); await p.locator('#stage').screenshot({path:`${out}/s${String(i).padStart(3,'0')}.jpg`,type:'jpeg',quality:80});}
  console.log('errors:',errs.slice(0,5)); await b.close();
})();
