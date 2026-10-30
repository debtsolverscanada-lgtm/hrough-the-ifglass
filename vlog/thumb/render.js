// node render.js cfg.json out.jpg   (paths in cfg are file:// absolute)
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const cfg=JSON.parse(fs.readFileSync(process.argv[2]));const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+__dirname+'/thumb.html');await p.evaluate(c=>build(c),cfg);
await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
await p.screenshot({path:process.argv[3],type:'jpeg',quality:92});await b.close()})();
