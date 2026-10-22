const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
function setup(responses,initial={}){
 const nodes={},storage={...initial};function node(id){return nodes[id]||(nodes[id]={textContent:'',dataset:{},setAttribute(k,v){this[k]=v;},getAttribute(k){return this[k]||null;},focus(){},appendChild(){},querySelector(){return {focus(){}};}});}
 const requests=[];class XHR {open(method,url){this.url=url;}send(){requests.push(this.url);const result=responses.shift();queueMicrotask(()=>{if(result instanceof Error)this.onerror();else{this.status=200;this.responseText=JSON.stringify(result);this.onload();}});}}
 const window={addEventListener(){},StillTV:{native:false}},document={hidden:false,getElementById:node,addEventListener(){},createElement(){return node(Math.random());}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tizen/appearance.js'),'utf8'),{window,Date,Number});
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tizen/weather.js'),'utf8'),{window,document,localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v,removeItem:k=>delete storage[k]},XMLHttpRequest:XHR,setInterval(){},Date,Promise,Error,encodeURIComponent,isFinite});
 return {window,nodes,storage,requests};
}
const location={name:'Test City',latitude:43.7,longitude:-79.4,auto:false};
const data={current:{temperature_2m:0,weather_code:71,is_day:1,apparent_temperature:-4,relative_humidity_2m:80,wind_speed_10m:11},daily:{temperature_2m_max:[2],temperature_2m_min:[-5]}};
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('freezing temperature renders as 0°, and snow animates from weather code',async()=>{const s=setup([data],{'still-weather-location':JSON.stringify(location)});await flush();assert.equal(s.nodes['weather-temp'].textContent,'0°');assert.equal(s.nodes['weather-card'].dataset.sky,'snow');assert.match(s.nodes['weather-range'].textContent,/-5°/);assert.ok(s.requests[0].startsWith('https://api.open-meteo.com/'));});
test('current-location lookup resolves coordinates before the forecast',async()=>{const s=setup([{city:'Local City',latitude:43,longitude:-79},data]);await flush();assert.equal(s.requests.length,2);assert.ok(s.requests[0].includes('ipapi.co'));assert.equal(s.nodes['weather-city'].textContent,'Local City');assert.ok(s.storage['still-weather-auto-location']);});
test('offline data stays explicitly marked saved rather than live',async()=>{const s=setup([new Error('offline')],{'still-weather-location':JSON.stringify(location),'still-weather-cache':JSON.stringify({data,location,savedAt:Date.now()})});await flush();assert.match(s.nodes['weather-status'].textContent,/Offline.*saved/);assert.equal(s.nodes['weather-temp'].textContent,'0°');});
test('failed detection shows unavailable rather than invented local weather',async()=>{const s=setup([{error:true}]);await flush();assert.equal(s.nodes['weather-condition'].textContent,'Weather unavailable');assert.equal(s.requests.length,1);});
test('day, night, fog, rain and storms map to matching scenes',async()=>{const s=setup([new Error('offline')]);await flush();for(const [code,day,scene] of [[0,true,'sun'],[0,false,'night'],[45,true,'fog'],[63,true,'rain'],[95,true,'storm']])assert.equal(s.window.StillWeather.condition(code,day)[0],scene);});

test('sun times request Unix timestamps and expose milliseconds with location offset',async()=>{const forecast={...data,utc_offset_seconds:-14400,daily:{...data.daily,sunrise:[1792669320],sunset:[1792707660]}};const s=setup([forecast],{'still-weather-location':JSON.stringify(location)});await flush();assert.ok(s.requests[0].includes('sunrise,sunset'));assert.ok(s.requests[0].includes('timeformat=unixtime'));const sun=s.window.StillWeather.sunTimes();assert.equal(sun.sunrise,1792669320000);assert.equal(sun.sunset,1792707660000);assert.equal(sun.utcOffsetSeconds,-14400);});
test('older weather cache without solar data leaves solar schedule unavailable',async()=>{const s=setup([new Error('offline')],{'still-weather-location':JSON.stringify(location),'still-weather-cache':JSON.stringify({data,location,savedAt:Date.now()})});await flush();assert.equal(s.window.StillWeather.sunTimes(),null);});

test('current precipitation selects distinct labels and scene intensity',async()=>{
 for(const [code,label,intensity] of [[51,'Light drizzle','drizzle'],[61,'Light rain','light'],[63,'Moderate rain','moderate'],[65,'Heavy rain','heavy'],[82,'Heavy rain showers','heavy'],[75,'Heavy snow','heavy']]){
  const s=setup([{...data,current:{...data.current,weather_code:code,is_day:0}}],{'still-weather-location':JSON.stringify(location)});
  await flush();
  assert.equal(s.nodes['weather-condition'].textContent,label);
  assert.equal(s.nodes['home-weather'].dataset.intensity,intensity);
  assert.equal(s.nodes['home-weather'].dataset.night,'true');
 }
});
test('refresh replaces rainy scene with clear skies',async()=>{
 const clear={...data,current:{...data.current,weather_code:0}};
 const s=setup([{...data,current:{...data.current,weather_code:65}},clear],{'still-weather-location':JSON.stringify(location)});
 await flush();assert.equal(s.nodes['home-weather'].dataset.sky,'rain');
 s.window.StillWeather.refresh(true);await flush();
 assert.equal(s.nodes['home-weather'].dataset.sky,'sun');
 assert.equal(s.nodes['home-weather'].dataset.intensity,'none');
});

test('every supported WMO condition retains precipitation through all solar phases',async()=>{
 const s=setup([new Error('offline')]);await flush();
 const rise=Date.parse('2026-10-22T11:40:00Z'),set=Date.parse('2026-10-22T22:20:00Z');
 const codes=[0,1,2,3,45,48,51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99];
 for(const code of codes)for(const [now,phase] of [[rise,'sunrise'],[rise+7200000,'day'],[set,'sunset'],[set+7200000,'night']]){
  const forecast={...data,utc_offset_seconds:-14400,current:{...data.current,weather_code:code},daily:{sunrise:[rise/1000],sunset:[set/1000]}};
  const scene=s.window.StillWeather.sceneFor(forecast,now);
  assert.equal(scene.phase,phase,code+' phase');
  assert.equal(scene.sky,s.window.StillWeather.condition(code,!scene.night)[0]);
  assert.equal(scene.hail,code===96||code===99);
  assert.equal(scene.ice,[56,57,66,67].includes(code));
 }
 assert.equal(s.window.StillWeather.sceneFor(data,rise).phase,'day');
});
test('solar window boundaries and stale solar dates never invent sunrise or sunset',async()=>{
 const s=setup([new Error('offline')]);await flush();
 const rise=Date.parse('2026-10-22T11:40:00Z'),set=Date.parse('2026-10-22T22:20:00Z');
 const forecast={...data,utc_offset_seconds:-14400,daily:{sunrise:[rise/1000],sunset:[set/1000]}};
 for(const [time,phase,night] of [[rise-1800001,'night',true],[rise-1800000,'sunrise',true],[rise,'sunrise',false],[rise+1800001,'day',false],[set-1800000,'sunset',false],[set,'sunset',true],[set+1800001,'night',true]]){
  const scene=s.window.StillWeather.sceneFor(forecast,time);assert.equal(scene.phase,phase);assert.equal(scene.night,night);
 }
 assert.equal(s.window.StillWeather.sceneFor(forecast,rise+86400000).phase,'day');
});
