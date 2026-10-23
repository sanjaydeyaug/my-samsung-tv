(function(){
'use strict';
// Pure catalog policy: no DOM, storage, or device API access.
function shortName(name){if(/youtube/i.test(name))return /kids/i.test(name)?'YouTube Kids':(/youtubetv/i.test(name)?'YouTube TV':'YouTube');if(/spotify/i.test(name))return 'Spotify';if(/tubi/i.test(name))return 'Tubi';return name;}
function rank(a){var names=['youtube','netflix','prime video','disney+','samsung tv plus','spotify'];var n=a.name.toLowerCase();var i=names.indexOf(n);return i<0?99:i;}
function normalize(raw,own){own=own||'StillHome1.Dashboard';
// Samsung marks internal panels and test apps show:true too. Store packages
// have generated IDs; native consumer apps need explicit, verified identities.
var nativeApps=['org.tizen.netflix-app','org.tizen.primevideo','org.tizen.browser','com.samsung.tv.cobalt-yt','HEPsqFNie0.tvplusstandalone','com.samsung.tv.SmartThingsApp','com.samsung.tv.samsung-health','com.samsung.tv.knox-browser-win365'];
var excluded=['yL49PNFmjW.PromotionApp','2025ePop01.SmartTV','25emanual1.emanual'];
var seen={},result=[];raw.forEach(function(a){var n=(a.name||'').trim(),id=a.id||'';if(!id||!n||id===own||seen[id]||excluded.indexOf(id)>=0)return;
var builtin=nativeApps.indexOf(id)>=0;
if(!builtin&&!(a.show===true&&/^[A-Za-z0-9]{10}\./.test(id)))return;
if(a.categories&&a.categories.indexOf('http://tizen.org/category/service')>=0)return;
// Prefer the native YouTube launch target over its installed wrapper.
if(id==='9Ur5IzDKqV.TizenYouTube'&&raw.some(function(x){return x.id==='com.samsung.tv.cobalt-yt';}))return;
seen[id]=true;result.push({id:id,name:shortName(n),iconPath:a.iconPath||''});});return result.sort(function(a,b){return rank(a)-rank(b)||a.name.localeCompare(b.name)||a.id.localeCompare(b.id);});}
window.StillCatalog={normalize:normalize};
})();
