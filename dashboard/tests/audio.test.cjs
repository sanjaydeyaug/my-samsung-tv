const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function setup(audio){const tizen={application:{},tvaudiocontrol:audio};const context={window:{tizen},tizen};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tizen/platform.js'),'utf8'),context);return context.window.StillTV;}
test('volume listener uses the changed value even when getVolume is temporarily stale',()=>{
 let listener,state;
 const api=setup({setVolumeChangeListener(callback){listener=callback;},getVolume:()=>20,isMute:()=>false});
 assert.equal(api.watchAudio(value=>state=value),true);listener(21);
 assert.equal(state.volume,21);assert.equal(state.muted,false);assert.equal(api.audio().volume,20);
});
test('volume listener includes current mute state and handles remote volume changes',()=>{
 let listener,muted=false,states=[];
 const api=setup({setVolumeChangeListener(callback){listener=callback;},isMute:()=>muted});
 api.watchAudio(state=>states.push(state));listener(14);muted=true;listener(13);
 assert.equal(states[0].volume,14);assert.equal(states[1].volume,13);assert.equal(states[1].muted,true);
});
test('unsupported volume notifications leave periodic refresh available',()=>{
 assert.equal(setup({setVolumeChangeListener(){throw Error('Not supported');}}).watchAudio(()=>assert.fail()),false);
});
test('Settings renders notification state without rereading stale volume',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../tizen/app.js'),'utf8'),start=source.indexOf('function updateAudio('),end=source.indexOf('\n',start);
 const nodes={volume:{},mute:{setAttribute(key,value){this[key]=value;}},'audio-status':{}};
 const context={$:id=>nodes[id],bridge:{audio(){throw Error('stale read');}}};vm.createContext(context);vm.runInContext(source.slice(start,end),context);context.updateAudio({volume:32,muted:true});
 assert.equal(nodes.volume.textContent,'32');assert.equal(nodes.mute.textContent,'Unmute');assert.equal(nodes.mute['aria-pressed'],'true');
});
