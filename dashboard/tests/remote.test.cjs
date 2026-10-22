const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
function setup(){
 const document={activeElement:null};const context={window:{},document};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tizen/remote.js'),'utf8'),context);
 function input(id){return {id,tagName:'INPUT',readOnly:false,listeners:{},setAttribute(){},addEventListener(k,f){this.listeners[k]=f;},blur(){if(document.activeElement===this){document.activeElement=null;if(this.listeners.blur)this.listeners.blur();}},focus(){if(document.activeElement&&document.activeElement!==this)document.activeElement.blur();document.activeElement=this;}};}
 const room=input('room'),note=input('note'),save={tagName:'BUTTON',focus(){document.activeElement=this;},blur(){document.activeElement=null;}};
 const remote=context.window.StillRemote.create({native:true,next:i=>i===room?note:save});remote.prepare([room,note]);
 function key(code,name){const e={keyCode:code,key:name,prevented:false,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;}};const handled=remote.handle(e);return {handled,event:e};}
 return {remote,room,note,save,document,key,normalize:context.window.StillRemote.key};
}
test('fields remain selectable without opening the keyboard until OK',()=>{const s=setup();s.room.focus();assert.equal(s.room.readOnly,true);assert.equal(s.remote.isEditing(),false);assert.equal(s.key(40,'Unidentified').handled,false);assert.equal(s.key(13,'Enter').event.prevented,true);assert.equal(s.remote.isEditing(),true);assert.equal(s.room.readOnly,false);});
test('IME arrow keys are never intercepted by dashboard focus navigation',()=>{const s=setup();s.room.focus();s.key(13,'Enter');for(const code of [37,38,39,40]){const result=s.key(code,'Unidentified');assert.equal(result.handled,true);assert.equal(result.event.prevented,false);}assert.equal(s.document.activeElement,s.room);});
test('Done advances to next field, then Save, without submitting or reopening IME',()=>{const s=setup();s.room.focus();s.key(13,'Enter');s.key(65376,'Unidentified');assert.equal(s.document.activeElement,s.note);assert.equal(s.note.readOnly,true);assert.equal(s.room.readOnly,true);assert.equal(s.remote.isEditing(),false);s.key(13,'Enter');s.key(65376,'Unidentified');assert.equal(s.document.activeElement,s.save);assert.equal(s.remote.isEditing(),false);});
test('keyboard Back/Cancel finishes the field before page Back is handled',()=>{for(const code of [10009,65385]){const s=setup();s.room.focus();s.key(13,'Enter');assert.equal(s.key(code,'Unidentified').handled,true);assert.equal(s.remote.isEditing(),false);assert.equal(s.document.activeElement,s.room);assert.equal(s.room.readOnly,true);assert.equal(s.key(10009,'Unidentified').handled,false);}});
test('numeric Samsung remote key codes work without a usable key string',()=>{const s=setup();assert.equal(s.normalize({keyCode:40,key:'Unidentified'}),'ArrowDown');assert.equal(s.normalize({keyCode:13,key:'Unidentified'}),'Enter');assert.equal(s.normalize({key:'Left'}),'ArrowLeft');});

test('remote scrolling preserves the layout safe area at both screen edges',()=>{
 const calls=[];
 const window={innerHeight:1080,pageYOffset:200,pageXOffset:0,matchMedia:()=>({matches:false}),getComputedStyle:()=>({paddingTop:'37.8px',paddingBottom:'27px'}),scrollTo:options=>calls.push(options)};
 const document={getElementById:()=>({})};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tizen/remote.js'),'utf8'),{window,document});
 function target(top,bottom){return {closest:()=>null,getBoundingClientRect:()=>({top,bottom})};}
 window.StillRemote.reveal(target(0,50));
 assert.equal(calls.pop().top,162.2);
 window.StillRemote.reveal(target(1000,1080));
 assert.equal(calls.pop().top,227);
 window.StillRemote.reveal(target(100,200));
 assert.equal(calls.length,0);
});

test('dialog navigation keeps scrolling inside the dialog',()=>{
 let scrolled=false;
 const window={matchMedia:()=>({matches:true})};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tizen/remote.js'),'utf8'),{window,document:{}});
 window.StillRemote.reveal({closest:()=>({}),scrollIntoView:options=>{scrolled=true;assert.equal(options.block,'nearest');assert.equal(options.behavior,'auto');}});
 assert.equal(scrolled,true);
});

test('remote reveals offscreen app tiles sideways without scrolling the page',()=>{
 const calls=[];
 const shelf={scrollLeft:100,getBoundingClientRect:()=>({left:80,right:1840}),scrollTo:options=>calls.push(options)};
 const window={innerHeight:1080,pageYOffset:0,pageXOffset:0,matchMedia:()=>({matches:false}),getComputedStyle:()=>({paddingTop:'38px',paddingBottom:'27px'}),scrollTo:()=>assert.fail('Home should not scroll vertically')};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tizen/remote.js'),'utf8'),{window,document:{getElementById:()=>({})}});
 const target={closest:selector=>selector==='dialog[open]'?null:shelf,getBoundingClientRect:()=>({left:1780,right:2000,top:450,bottom:655})};
 window.StillRemote.reveal(target);
 assert.equal(calls[0].left,308);
 target.getBoundingClientRect=()=>({left:0,right:220,top:450,bottom:655});
 window.StillRemote.reveal(target);
 assert.equal(calls[1].left,-28);
});

test('last Settings controls reveal the information panel and footer within the safe area',()=>{
 const calls=[];
 const footer={getBoundingClientRect:()=>({bottom:1160})};
 const shell={querySelector:()=>footer};
 const window={innerHeight:1080,pageYOffset:0,pageXOffset:0,matchMedia:()=>({matches:false}),getComputedStyle:()=>({paddingTop:'38px',paddingBottom:'27px'}),scrollTo:o=>calls.push(o)};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tizen/remote.js'),'utf8'),{window,document:{getElementById:()=>shell}});
 const target={closest:s=>s==='#settings-view .panel.wide'?{}:null,getBoundingClientRect:()=>({top:900,bottom:950})};
 window.StillRemote.reveal(target);
 assert.equal(calls[0].top,107);
 // A footer that cannot fit alongside the focused control must not hide that control.
 footer.getBoundingClientRect=()=>({bottom:2200});calls.length=0;
 window.StillRemote.reveal(target);assert.equal(calls.length,0);
});

test('shelf animation eases over 420ms in both directions and cancels on reversal',()=>{
 let frame=null;
 const shelf={scrollLeft:100,scrollWidth:2000,clientWidth:800};
 const window={requestAnimationFrame:fn=>{frame=fn;return 1;},cancelAnimationFrame:()=>{frame=null;}};
 const source=fs.readFileSync(path.join(__dirname,'../tizen/remote.js'),'utf8').replace('window.StillRemote={','window.scrollShelf=scrollShelf;window.StillRemote={');
 vm.runInNewContext(source,{window});
 window.scrollShelf(shelf,500,'smooth');
 frame(0);frame(210);
 assert.equal(shelf.scrollLeft,450);
 window.scrollShelf(shelf,0,'smooth');
 frame(220);frame(430);
 assert.equal(shelf.scrollLeft,56.25);
 frame(640);
 assert.equal(shelf.scrollLeft,0);
 window.scrollShelf(shelf,500,'smooth');frame(700);frame(1120);
 assert.equal(shelf.scrollLeft,500);
});
