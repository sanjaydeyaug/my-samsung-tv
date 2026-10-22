const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../tizen/app.js'),'utf8');
function fn(name){const start=source.indexOf('function '+name+'('),end=source.indexOf('\nfunction ',start+1);return source.slice(start,end);}
function setup(){
 const launched=[],edited=[];
 function element(){return {dataset:{},children:[],attrs:{},appendChild(n){this.children.push(n);},setAttribute(k,v){this.attrs[k]=v;}};}
 const context={document:{createElement:element},window:{StillLogos:{render(){}}},prefs:{favoriteIds:['one']},libraryEditing:false,view:'apps',isHidden:()=>false,text:(parent,tag,cls,value)=>{const e=element();e.className=cls;e.textContent=value;parent.appendChild(e);return e;},launch:a=>launched.push(a.id),openAppEditor:(a,b)=>edited.push([a.id,b])};
 vm.createContext(context);vm.runInContext(fn('tile'),context);return {context,launched,edited};
}
test('normal Apps browsing has one launch target per app and no separate management button',()=>{
 const s=setup(),wrapper=s.context.tile({id:'one',name:'One'},true);assert.equal(wrapper.children.length,1);
 const button=wrapper.children[0];assert.equal(button.attrs['aria-label'],'Open One');button.onclick();assert.deepEqual(s.launched,['one']);assert.equal(s.edited.length,0);
});
test('Edit mode uses the same app target for management without launching it',()=>{
 const s=setup(),wrapper=s.context.tile({id:'one',name:'One'},true);s.context.libraryEditing=true;wrapper.children[0].onclick();assert.equal(s.launched.length,0);assert.equal(s.edited[0][0],'one');assert.equal(s.edited[0][1],wrapper.children[0]);
});
test('Home and Search launch normally even while library edit state is active',()=>{
 const s=setup();s.context.libraryEditing=true;s.context.view='search';s.context.tile({id:'one',name:'One'},false).children[0].onclick();assert.deepEqual(s.launched,['one']);assert.equal(s.edited.length,0);
});
test('Back exits library editing before navigating away from Apps',()=>{
 const changes=[];const context={document:{querySelector:()=>null},$:()=>({hidden:true}),view:'apps',libraryEditing:true,setLibraryEditing:(...args)=>changes.push(args),switchView:()=>assert.fail('should stay on Apps')};vm.createContext(context);vm.runInContext(fn('back').split('\n')[0],context);context.back();assert.deepEqual(changes,[[false,true]]);
});
