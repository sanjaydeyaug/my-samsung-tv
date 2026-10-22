const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function setup(systeminfo,tvwindow){const tizen={application:{getCurrentApplication:()=>({hide(){}})},systeminfo,tvwindow};const context={window:{tizen},tizen};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tizen/platform.js'),'utf8'),context);return context.window.StillTV;}
test('HDMI inventory keeps connected and disconnected ports, sorted, without guessing device identity',()=>{
 const api=setup({getPropertyValue(key,ok){assert.equal(key,'VIDEOSOURCE');ok({connected:[{type:'HDMI',number:3},{type:'TV',number:1}],disconnected:[{type:'HDMI',number:2},{type:'HDMI',number:1}]});}});
 api.inputs(sources=>{assert.deepEqual(JSON.parse(JSON.stringify(sources)),[{type:'HDMI',number:1,connected:false},{type:'HDMI',number:2,connected:false},{type:'HDMI',number:3,connected:true}]);},()=>assert.fail());
});
test('permission or API errors are reported instead of claiming disconnected ports',()=>{
 setup({getPropertyValue(){throw Error('Unavailable');}}).inputs(()=>assert.fail(),message=>assert.equal(message,'Unavailable'));
});
test('selecting a port passes its HDMI number and hides the app only after switching succeeds',()=>{
 const calls=[];const tizen={application:{getCurrentApplication:()=>({hide(){calls.push('hide');}})},tvwindow:{setSource(source,ok){assert.equal(source.type,'HDMI');assert.equal(source.number,3);calls.push('switch');ok();}}};const context={window:{tizen},tizen};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tizen/platform.js'),'utf8'),context);
 context.window.StillTV.selectInput({number:3},()=>calls.push('done'),()=>assert.fail());assert.deepEqual(calls,['switch','hide','done']);
});
test('failed source switch keeps the dashboard visible and reports failure',()=>{
 const api=setup({}, {setSource(source,ok,error){error({message:'No signal'});}});api.selectInput({number:1},()=>assert.fail(),message=>assert.equal(message,'No signal'));
});
