const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup(){
 const panes={},buttons=['appearance','sound','about'].map(name=>{
  panes['settings-'+name]={hidden:name!=='appearance'};
  return {dataset:{settings:name},attrs:{'aria-controls':'settings-'+name},events:{},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];},getAttribute(k){return this.attrs[k];},addEventListener(k,fn){this.events[k]=fn;}};
 });
 let focused=false;
 const root={querySelectorAll:()=>buttons,querySelector:()=>({focus(){focused=true;}})};
 const context={window:{},document:{getElementById:id=>id==='settings-view'?root:panes[id]}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../tizen/settings.js'),'utf8'),context);
 return {panes,buttons,select:context.window.StillSettings.select,focused:()=>focused};
}
test('category focus reveals only its detail and keeps selection distinct from focus',()=>{
 const s=setup();s.buttons[1].events.focus();
 assert.equal(s.panes['settings-sound'].hidden,false);assert.equal(s.panes['settings-appearance'].hidden,true);assert.equal(s.panes['settings-about'].hidden,true);
 assert.equal(s.buttons[1].attrs['aria-current'],'true');assert.equal(s.buttons[0].attrs['aria-current'],undefined);assert.equal(s.focused(),false);
});
test('category activation moves into its controls and Sound shortcut can reveal its pane',()=>{
 const s=setup();s.buttons[2].events.click();assert.equal(s.focused(),true);assert.equal(s.panes['settings-about'].hidden,false);
 s.select('sound');assert.equal(s.panes['settings-sound'].hidden,false);assert.equal(s.panes['settings-about'].hidden,true);
});
