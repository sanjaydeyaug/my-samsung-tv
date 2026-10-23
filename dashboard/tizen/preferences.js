(function(){
'use strict';
// One persistence boundary. Keep the existing key and unknown feature settings.
window.StillPreferences={create:function(options){
 var key=options.key||'still-prefs';
 function read(){
  var prefs={};
  try{prefs=JSON.parse(options.storage().getItem(key)||'{}');}catch(e){}
  if(!prefs||typeof prefs!=='object'||Array.isArray(prefs))prefs={};
  ['hiddenIds','favoriteIds','addedRequestedApps'].forEach(function(name){
   if(Array.isArray(prefs[name]))prefs[name]=prefs[name].filter(function(id,index,ids){return typeof id==='string'&&id.length>0&&ids.indexOf(id)===index;});
   else delete prefs[name];
  });
  if(!prefs.hiddenIds)prefs.hiddenIds=[];
  return prefs;
 }
 function write(prefs){
  try{options.storage().setItem(key,JSON.stringify(prefs));return true;}
  catch(error){if(options.onError)options.onError(error);return false;}
 }
 return {read:read,write:write};
}};
})();
