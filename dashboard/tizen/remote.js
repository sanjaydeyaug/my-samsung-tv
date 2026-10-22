/* Separate remote focus navigation from Samsung's text-input/IME key events. */
(function(){
'use strict';
var shelfAnimation=null;
function scrollShelf(shelf,left,behavior){
 if(shelfAnimation){window.cancelAnimationFrame(shelfAnimation.frame);shelfAnimation=null;}
 if(behavior==='auto'||!window.requestAnimationFrame){shelf.scrollTo({left:left,behavior:behavior});return;}
 var start=shelf.scrollLeft,end=Math.max(0,Math.min(left,shelf.scrollWidth-shelf.clientWidth));
 var animation={frame:0},started=null;
 shelfAnimation=animation;
 function step(time){
  if(shelfAnimation!==animation)return;
  if(started===null)started=time;
  var progress=Math.min(1,(time-started)/420),eased=1-Math.pow(1-progress,3);
  shelf.scrollLeft=start+(end-start)*eased;
  if(progress<1)animation.frame=window.requestAnimationFrame(step);
  else shelfAnimation=null;
 }
 animation.frame=window.requestAnimationFrame(step);
}
/* Keep the page's initial safe area when remote focus scrolls the document. */
function reveal(target){
 var behavior=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
 if(target.closest('dialog[open]')){target.scrollIntoView({behavior:behavior,block:'nearest',inline:'nearest'});return;}
 var shelf=target.closest('#favorites,#results');
 if(shelf){
  var bounds=shelf.getBoundingClientRect(),tile=target.getBoundingClientRect(),shift=0;
  if(tile.left<bounds.left+48)shift=tile.left-bounds.left-48;
  else if(tile.right>bounds.right-48)shift=tile.right-bounds.right+48;
  if(shift||shelfAnimation)scrollShelf(shelf,shelf.scrollLeft+shift,behavior);
 }
 var shell=document.getElementById('shell'),style=window.getComputedStyle(shell||document.body);
 var top=Math.max(10,parseFloat(style.paddingTop)||0),bottom=Math.max(10,parseFloat(style.paddingBottom)||0);
 var rect=target.getBoundingClientRect(),height=window.innerHeight,delta=0;
 // Reveal the complete Settings ending when its final controls receive focus.
 if(target.closest('#settings-view .panel.wide')&&shell&&shell.querySelector){
  var footer=shell.querySelector('.global-footer');
  if(footer){var end=footer.getBoundingClientRect().bottom;if(end-rect.top<=height-top-bottom)rect={top:rect.top,bottom:Math.max(rect.bottom,end)};}
 }
 if(rect.top<top)delta=rect.top-top;
 else if(rect.bottom>height-bottom)delta=rect.bottom-height+bottom;
 if(delta)window.scrollTo({top:window.pageYOffset+delta,left:window.pageXOffset,behavior:behavior});
}
window.StillRemote={reveal:reveal,key:function(e){var codes={13:'Enter',37:'ArrowLeft',38:'ArrowUp',39:'ArrowRight',40:'ArrowDown',10009:'Back',65376:'Done',65385:'Cancel'};return codes[e.keyCode]||({Left:'ArrowLeft',Right:'ArrowRight',Up:'ArrowUp',Down:'ArrowDown',Escape:'Back'}[e.key]||e.key);},create:function(options){var active=null;
function consume(e){e.preventDefault();e.stopImmediatePropagation();}
function finish(advance){var input=active;if(!input)return;active=null;input.readOnly=true;input.blur();var next=advance?options.next(input):input;if(next)next.focus();}
function begin(input){if(!options.native||active===input)return;if(active)finish(false);input.blur();input.readOnly=false;input.focus();active=input;}
return {prepare:function(inputs){if(!options.native)return;Array.prototype.forEach.call(inputs,function(input){input.readOnly=true;input.setAttribute('aria-describedby','text-help');input.addEventListener('click',function(){begin(input);});input.addEventListener('blur',function(){if(active===input){active=null;input.readOnly=true;}});});},isEditing:function(){return active!==null;},finish:finish,handle:function(e){if(!options.native)return false;var key=window.StillRemote.key(e);if(active){if(key==='Done'){consume(e);finish(true);return true;}if(key==='Cancel'||key==='Back'){consume(e);finish(false);return true;}if(key==='Enter'){/* Let the TV keyboard select its current key. */return true;}/* IME arrows and text keys belong to Samsung, not dashboard navigation. */return true;}var input=document.activeElement;if(input&&input.tagName==='INPUT'&&key==='Enter'){consume(e);begin(input);return true;}if(key==='Done'||key==='Cancel'){consume(e);return true;}return false;}};
}};
})();
