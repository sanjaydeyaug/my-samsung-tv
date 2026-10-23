const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tizen/appearance.js'),'utf8'),context);const resolve=context.window.StillAppearance.theme;
const at=(h,m=0)=>new Date(2026,9,22,h,m);
test('automatic appearance switches precisely at 7 AM and 7 PM local time',()=>{const p={autoAppearance:true,theme:'light'};assert.equal(resolve(p,at(6,59)),'charcoal');assert.equal(resolve(p,at(7)),'light');assert.equal(resolve(p,at(18,59)),'light');assert.equal(resolve(p,at(19)),'charcoal');assert.equal(resolve(p,at(0)),'charcoal');});
test('manual mode preserves every selected theme throughout day and night',()=>{for(const theme of ['black','charcoal','warm','light'])for(const hour of [0,12,23])assert.equal(resolve({theme},at(hour)),theme);});
test('automatic night uses the saved dark theme without mutating preferences',()=>{const p={autoAppearance:true,theme:'light',nightTheme:'warm'},before=JSON.stringify(p);assert.equal(resolve(p,at(21)),'warm');assert.equal(resolve(p,at(12)),'light');assert.equal(JSON.stringify(p),before);assert.equal(resolve({autoAppearance:true,theme:'forest'},at(21)),'black');});
test('invalid saved themes use safe manual and night defaults',()=>{assert.equal(resolve({theme:'invalid'},at(12)),'black');assert.equal(resolve({autoAppearance:true,theme:'light',nightTheme:'light'},at(21)),'charcoal');});

test('sunrise and sunset override fixed hours at the exact transition instants',()=>{
 const sunrise=Date.parse('2026-10-22T11:42:00Z'),sunset=Date.parse('2026-10-22T22:21:00Z'),solar={sunrise,sunset,utcOffsetSeconds:-14400},p={autoAppearance:true,theme:'light',nightTheme:'warm'};
 assert.equal(resolve(p,new Date(sunrise-1),solar),'warm');assert.equal(resolve(p,new Date(sunrise),solar),'light');assert.equal(resolve(p,new Date(sunset-1),solar),'light');assert.equal(resolve(p,new Date(sunset),solar),'warm');
});
test('sun times use the weather-location day across UTC midnight',()=>{
 const solar={sunrise:Date.parse('2026-10-22T14:00:00Z'),sunset:Date.parse('2026-10-23T01:00:00Z'),utcOffsetSeconds:-25200};
 assert.ok(context.window.StillAppearance.solarForDate(solar,new Date('2026-10-23T00:30:00Z')));assert.equal(context.window.StillAppearance.solarForDate(solar,new Date('2026-10-23T08:00:00Z')),null);
});
test('stale, missing and polar sun times safely fall back to the fixed schedule',()=>{
 const p={autoAppearance:true,theme:'light'},date=at(12);
 for(const solar of [null,{sunrise:0,sunset:1000},{sunrise:NaN,sunset:NaN},{sunrise:date.getTime(),sunset:date.getTime()-1}])assert.equal(resolve(p,date,solar),'light');
});
test('solar labels respect the location offset and clock-format preference',()=>{const ms=Date.parse('2026-10-22T11:42:00Z');assert.equal(context.window.StillAppearance.solarTime(ms,-14400,false),'7:42 AM');assert.equal(context.window.StillAppearance.solarTime(ms,-14400,true),'07:42');});

test('saved Forest selections migrate to OLED Black, including automatic nights',()=>{assert.equal(resolve({theme:'forest'},at(12)),'black');assert.equal(resolve({autoAppearance:true,theme:'light',nightTheme:'forest'},at(21)),'black');assert.equal(resolve({},at(12)),'black');});
