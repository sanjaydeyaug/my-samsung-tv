/* Reproducible browser check. All non-live screenshots use labelled test fixtures. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../tizen'),out=path.resolve(__dirname,'../weather-check');
const live=JSON.parse(fs.readFileSync(path.join(out,'toronto-live.json'),'utf8'));
const codes=[0,1,2,3,45,48,51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99];
const rise=live.daily.sunrise[0]*1000,sunset=live.daily.sunset[0]*1000;
const phases=[['sunrise',rise],['day',rise+7200000],['sunset',sunset],['night',sunset+7200000]];
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
 const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1,timezoneId:'America/Toronto'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let forecast=live;
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.hostname==='api.open-meteo.com')return route.fulfill({json:forecast,headers:{'access-control-allow-origin':'*'}});
  if(url.hostname!=='still-weather.test')return route.abort();
  const file=path.join(root,url.pathname==='/'?'index.html':decodeURIComponent(url.pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:''});
  const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.gif':'image/gif'};
  return route.fulfill({body:fs.readFileSync(file),contentType:mime[path.extname(file)]||'application/octet-stream'});
 });
 await page.addInitScript(()=>{localStorage.setItem('still-weather-location',JSON.stringify({name:'Toronto',latitude:43.6532,longitude:-79.3832}));localStorage.setItem('still-prefs',JSON.stringify({theme:'light',nightTheme:'forest',autoAppearance:true}));});
 await page.clock.install({time:new Date(live.current.time*1000)});
 await page.goto('https://still-weather.test/');
 await page.waitForFunction(()=>document.getElementById('weather-city').textContent==='Toronto'&&document.getElementById('home-weather').dataset.phase);
 await page.screenshot({path:path.join(out,'screenshots/toronto-live.png')});
 const liveScene=await page.locator('#home-weather').evaluate(e=>({...e.dataset}));
 const results=[];
 for(const code of codes){
  for(const [phase,now] of phases){
   forecast={...live,current:{...live.current,weather_code:code,is_day:now>=rise&&now<sunset?1:0},daily:live.daily};
   await page.clock.setFixedTime(new Date(now));
   await page.clock.runFor(1000);
   await page.evaluate(()=>window.StillWeather.refresh(true));
   await page.waitForFunction(({phase,code})=>{const e=document.getElementById('home-weather');return e.dataset.phase===phase&&document.getElementById('weather-condition').textContent===window.StillWeather.condition(code,e.dataset.night!=='true')[1];},{phase,code});
   const actual=await page.evaluate(()=>{
    const el=document.getElementById('home-weather'),r=el.getBoundingClientRect();
    for(const a of el.getAnimations({subtree:true})){a.pause();a.currentTime=a.effect.target.classList.contains('sky-lightning')?7900:a.effect.target.tagName==='I'?350:4500;}
    const visible=cls=>getComputedStyle(el.querySelector('.'+cls)).display!=='none';
    return {dataset:{...el.dataset},right:r.right,top:r.top,visible:{rays:visible('sky-rays'),drops:visible('sky-drops'),hail:visible('sky-hail'),lightning:visible('sky-lightning'),solar:visible('sky-solar'),moon:visible('sky-moon')}};
   });
   assert.equal(actual.right,1920);assert.equal(actual.top,0);
   assert.equal(actual.visible.lightning,code>=95);
   assert.equal(actual.visible.hail,code===96||code===99);
   assert.equal(actual.visible.solar,phase==='sunrise'||phase==='sunset');
   assert.equal(actual.visible.rays,[0,1,2].includes(code)&&phase!=='sunset'&&phase!=='night');
   assert.equal(actual.visible.drops,[51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99].includes(code));
   const filename=`wmo-${String(code).padStart(2,'0')}-${phase}.png`;
   await page.screenshot({path:path.join(out,'screenshots',filename)});
   results.push({code,phase,filename,...actual});
  }
  console.log('Checked WMO '+code+' in all four solar phases');
 }
 // Small screen and reduced-motion checks use heavy hail at sunset.
 await page.setViewportSize({width:800,height:600});
 await page.screenshot({path:path.join(out,'screenshots/compact.png')});
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.sky-lightning').evaluate(e=>getComputedStyle(e).display),'none');
 assert.equal(await page.locator('.sky-hail').evaluate(e=>getComputedStyle(e).display),'none');
 await page.screenshot({path:path.join(out,'screenshots/reduced-motion.png')});
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checkedAt:new Date().toISOString(),live,liveScene,errors,scenarios:results.length,results},null,2));
 console.log('PASS: '+results.length+' weather/solar combinations, live Toronto, compact layout and reduced motion.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
