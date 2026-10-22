/* Keep Home content aligned with the viewport. */
(function(){
'use strict';
var $=function(id){return document.getElementById(id);};
function sizeLanding(){var landing=$('home-landing');if(!landing.getClientRects().length)return;var top=landing.getBoundingClientRect().top+window.pageYOffset,padding=parseFloat(window.getComputedStyle($('shell')).paddingBottom)||0;landing.style.minHeight=Math.max(0,window.innerHeight-top-padding)+'px';}
window.addEventListener('resize',sizeLanding);
new MutationObserver(sizeLanding).observe($('home-view'),{attributes:true,attributeFilter:['hidden']});
sizeLanding();
document.addEventListener('visibilitychange',function(){if(!document.hidden)sizeLanding();});
})();
