const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../tizen/app.js'),'utf8');
function include(context,names){vm.createContext(context);for(const name of names){const start=source.indexOf('function '+name+'('),end=source.indexOf('\nfunction ',start+1);vm.runInContext(source.slice(start,end),context);}return context;}
test('startup builds only Home; hidden shelves render once when visited and invalidate after changes',()=>{
 const calls=[];const c=include({view:'home',renderedViews:{},apps:[],bridge:{native:false},$:()=>({}),renderFavorites:()=>calls.push('home'),renderLibrary:()=>calls.push('apps'),renderSearch:()=>calls.push('search')},['renderCurrent','renderAll']);
 c.renderAll();assert.deepEqual(calls,['home']);c.view='apps';c.renderCurrent();c.renderCurrent();assert.deepEqual(calls,['home','apps']);c.renderAll();assert.deepEqual(calls,['home','apps','apps']);c.view='home';c.renderCurrent();assert.deepEqual(calls,['home','apps','apps','home']);
});
test('identical discovery keeps current DOM and focus; changed app artwork refreshes it',()=>{
 let raw=[{id:'one',name:'One',iconPath:'one.png'}],renders=0,lists=0;
 const c=include({loadGeneration:0,catalogKey:null,apps:[],prefs:{favoriteIds:['one'],addedRequestedApps:[],hiddenIds:[]},bridge:{currentAppId:()=>'StillHome1.Dashboard',list:ok=>{lists++;ok(raw);}},window:{StillCatalog:{normalize:r=>r}},byId:()=>null,save(){},renderAll:()=>renders++,$:()=>({}),toast(){}},['load']);
 c.load();c.load();assert.equal(lists,2);assert.equal(renders,1);raw=[{...raw[0],iconPath:'updated.png'}];c.load();assert.equal(renders,2);
});
test('clock makes no DOM writes within the same minute, but applies format changes immediately',()=>{
 let writes=0;const nodes={},prefs={};
 const context={window:{},Date};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tizen/clock.js'),'utf8'),context);
 const clock=context.window.StillClock.create({element:id=>nodes[id]||(nodes[id]={set textContent(v){writes++;this.value=v;},get textContent(){return this.value;},style:{}}),text:()=>{writes++;}});
 clock.tick(false);const initial=writes;assert.ok(initial>0);clock.tick(false);assert.equal(writes,initial);clock.tick(true);assert.ok(writes>initial);
});
