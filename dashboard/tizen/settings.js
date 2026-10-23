/* tvOS-style category/detail navigation, using the existing remote focus engine. */
(function(){
'use strict';
var root=document.getElementById('settings-view');
var categories=root.querySelectorAll('[data-settings]');
function select(name){
 categories.forEach(function(button){
  var active=button.dataset.settings===name;
  if(active)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');
  document.getElementById(button.getAttribute('aria-controls')).hidden=!active;
 });
}
categories.forEach(function(button){
 button.addEventListener('focus',function(){select(button.dataset.settings);});
 button.addEventListener('click',function(){select(button.dataset.settings);var target=root.querySelector('.settings-pane:not([hidden]) button');if(target)target.focus();});
});
window.StillSettings={select:select};
})();
