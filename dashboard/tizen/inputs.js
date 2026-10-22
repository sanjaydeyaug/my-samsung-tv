/* Public HDMI inventory, with user-defined device labels. */
(function(){
'use strict';
var bridge=window.StillTV,$=function(id){return document.getElementById(id);},labels={},editing=null,trigger=null,busy=false;
try{labels=JSON.parse(localStorage.getItem('still-input-labels')||'{}')||{};}catch(e){}
function errorText(){ $('input-status').textContent='Connection status unavailable. Open TV inputs to view connected devices.';document.querySelectorAll('.input-state').forEach(function(s){s.textContent='Status unavailable';s.parentNode.removeAttribute('data-connected');}); }
function title(source){return labels[source.number]||'HDMI '+source.number;}
function rename(source,button){editing=source;trigger=button;$('input-name').value=labels[source.number]||'';$('input-name-dialog').showModal();$('input-name').focus();}
function update(sources){
 var list=$('input-list');
 sources.forEach(function(source){
  var id='hdmi-'+source.number,card=$(id);
  if(!card){
   card=document.createElement('div');card.id=id;card.className='input-card';
   var name=document.createElement('h3');name.className='input-title';card.appendChild(name);
   var port=document.createElement('p');port.className='input-port';port.textContent='HDMI '+source.number;card.appendChild(port);
   var state=document.createElement('p');state.className='input-state';card.appendChild(state);
   var actions=document.createElement('div');actions.className='page-actions';
   var open=document.createElement('button');open.className='subtle input-open';open.textContent='Open input';open.onclick=function(){bridge.selectInput(source,function(){},function(){bridge.openSystem('inputs',function(){ $('input-status').textContent='Could not open TV inputs. Please try again.';});});};actions.appendChild(open);
   var edit=document.createElement('button');edit.className='text-button';edit.textContent='Name device';edit.onclick=function(){rename(source,edit);};actions.appendChild(edit);card.appendChild(actions);list.appendChild(card);
  }
  card.dataset.connected=String(source.connected);card.querySelector('.input-title').textContent=title(source);card.querySelector('.input-state').textContent=source.connected?'Connected':'Not connected';
  card.querySelector('.input-open').setAttribute('aria-label','Open '+title(source)+' on HDMI '+source.number);
 });
 Array.prototype.slice.call(list.children).forEach(function(card){if(!sources.some(function(s){return card.id==='hdmi-'+s.number;}))card.remove();});
 $('input-status').textContent=sources.length?'Name a port for your PS5 or another device. Status reflects the TV’s HDMI connection.':'No HDMI ports reported. Open TV inputs to check your devices.';
}
function refresh(){if(busy||document.hidden)return;busy=true;bridge.inputs(function(sources){busy=false;update(sources);},function(){busy=false;errorText();});}
$('refresh-inputs').onclick=refresh;
$('open-tv-inputs').onclick=function(){bridge.openSystem('inputs',function(){ $('input-status').textContent='Could not open TV inputs. Please try again.';});};
$('input-name-form').onsubmit=function(e){e.preventDefault();var input=$('input-name');if(!input.readOnly&&bridge.native){input.blur();input.readOnly=true;return;}
 if(!editing)return;var value=input.value.trim();if(value)labels[editing.number]=value;else delete labels[editing.number];
 try{localStorage.setItem('still-input-labels',JSON.stringify(labels));}catch(e){}
 var card=$('hdmi-'+editing.number);if(card)card.querySelector('.input-title').textContent=title(editing);$('input-name-dialog').close();refresh();};
$('input-name-dialog').addEventListener('close',function(){if(trigger&&document.contains(trigger))trigger.focus({preventScroll:true});});
function sizeLanding(){var landing=$('home-landing');if(!landing.getClientRects().length)return;var top=landing.getBoundingClientRect().top+window.pageYOffset,padding=parseFloat(window.getComputedStyle($('shell')).paddingBottom)||0;landing.style.minHeight=Math.max(0,window.innerHeight-top-padding)+'px';}
window.addEventListener('resize',sizeLanding);
new MutationObserver(sizeLanding).observe($('home-view'),{attributes:true,attributeFilter:['hidden']});
sizeLanding();refresh();setInterval(function(){if(!$('home-view').hidden)refresh();},10000);
document.addEventListener('visibilitychange',function(){if(!document.hidden){sizeLanding();refresh();}});
})();
