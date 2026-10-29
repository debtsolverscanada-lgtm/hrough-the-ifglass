// usage: node render.js <outdir> <startFrame> <endFrame> <mode> [fps]
const {chromium}=require('playwright'),path=require('path'),fs=require('fs');
(async()=>{
  const [out,a,b,mode='land',fps=30]=[process.argv[2],+process.argv[3],+process.argv[4],process.argv[5],+(process.argv[6]||30)];
  const TL=JSON.parse(fs.readFileSync(process.env.TLFILE||'timeline.json')); fs.mkdirSync(out,{recursive:true});
  const br=await chromium.launch(); const p=await br.newPage({viewport:mode==='land'?{width:1920,height:1080}:{width:1080,height:1920}});
  await p.goto('file://'+path.resolve(__dirname,'engine.html')); await p.evaluate(async d=>{await setData(d)},TL); await p.waitForTimeout(200);
  const off=+(process.env.TOFF||0);
  for(let f=a;f<b;f++){ await p.evaluate(([t,m])=>renderFrame(t,m),[off+f/fps,mode]);
    await p.locator('#stage').screenshot({path:`${out}/f${String(f).padStart(6,'0')}.jpg`,type:'jpeg',quality:90}); }
  await br.close();
})();
