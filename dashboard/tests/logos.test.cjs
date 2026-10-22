const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function render(name){const context={window:{},document:{createElement:()=>({setAttribute(){}})}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tizen/logos.js'),'utf8'),context);const attrs={},children=[];context.window.StillLogos.render({setAttribute(k,v){attrs[k]=v;},appendChild(e){children.push(e);},removeAttribute(){},removeChild(){}},{name});return {attrs,image:children[0]};}
test('current official vectors are shared by app names in all tile views',()=>{
 for(const [name,brand] of [['YouTube','youtube'],['Netflix','netflix'],['Spotify','spotify'],['Bongo','bongo'],['Tubi','tubi'],['CuriosityStream','curiosity'],['Curiosity Stream','curiosity'],['Perplexity','perplexity'],['TSN','tsn']]){
  const r=render(name);assert.equal(r.attrs['data-brand'],brand);assert.equal(r.image.src,'icons/official/'+brand+'-current.svg');assert.ok(fs.existsSync(path.join(__dirname,'../tizen',r.image.src)));
 }
});
test('new standalone SVGs contain vector paths without bitmap, script or remote dependencies',()=>{
 for(const name of ['youtube','netflix','spotify','bongo','tubi','curiosity','perplexity','tsn']){
  const svg=fs.readFileSync(path.join(__dirname,'../tizen/icons/official',name+'-current.svg'),'utf8');assert.match(svg,/<path\b/);assert.match(svg,/viewBox=/);assert.doesNotMatch(svg,/<(?:image|script|foreignObject)\b/i);assert.doesNotMatch(svg,/(?:href|src)=["'](?:https?:|\/\/)/i);assert.doesNotMatch(svg,/@import|@font-face/);
 }
});
test('apps without verified local artwork retain installed icon support',()=>{
 const context={window:{},document:{createElement:()=>({setAttribute(){}})}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tizen/logos.js'),'utf8'),context);let image;
 context.window.StillLogos.render({setAttribute(){},appendChild(e){image=e;}},{name:'Xbox',iconPath:'/opt/usr/apps/xbox/icon.png'});assert.equal(image.src,'file:///opt/usr/apps/xbox/icon.png');
});
