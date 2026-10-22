/* One compositor-animated focus frame follows remote selection. */
(function(){
'use strict';
var frame=document.createElement('div'),target=null,visible=false,pending=false;
frame.id='remote-focus';frame.setAttribute('aria-hidden','true');document.body.appendChild(frame);
function update(){
 pending=false;
 if(!target||!document.contains(target)||!target.getClientRects().length){frame.style.opacity='0';visible=false;document.body.classList.remove('remote-focus-active');return;}
 if(target.matches('.app')){frame.style.opacity='0';visible=false;document.body.classList.add('remote-focus-active');return;}
 if(target.closest('dialog[open]')){frame.style.opacity='0';visible=false;document.body.classList.remove('remote-focus-active');if(frame.parentNode!==document.body)document.body.appendChild(frame);return;}
 var host=document.body;if(frame.parentNode!==host)host.appendChild(frame);
 var r=target.getBoundingClientRect(),left=r.left,top=r.top;
 if(!visible)frame.classList.add('focus-snap');
 frame.style.width=r.width+10+'px';frame.style.height=r.height+10+'px';
 frame.style.borderRadius=(parseFloat(window.getComputedStyle(target).borderTopLeftRadius)||0)+5+'px';
 frame.style.transform='translate3d('+(left-5)+'px,'+(top-5)+'px,0)';frame.style.opacity='1';
 document.body.classList.add('remote-focus-active');
 if(!visible){frame.getBoundingClientRect();frame.classList.remove('focus-snap');}visible=true;
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
document.addEventListener('focusin',function(e){target=e.target.matches('button,input')?e.target:null;update();});
document.addEventListener('focusout',function(){target=null;schedule();});
window.addEventListener('scroll',schedule,true);window.addEventListener('resize',schedule);
window.addEventListener('blur',function(){target=null;schedule();});
})();

