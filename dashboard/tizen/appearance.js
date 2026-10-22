/* Local TV time, with manual theme and preferred night appearance preserved. */
(function(root){
'use strict';
var dark=['forest','charcoal','warm'];
function solarForDate(solar,date){
 if(!solar||!Number.isFinite(solar.sunrise)||!Number.isFinite(solar.sunset)||solar.sunset<=solar.sunrise||solar.sunset-solar.sunrise>86400000)return null;
 var offset=Number.isFinite(solar.utcOffsetSeconds)?solar.utcOffsetSeconds*1000:0;
 function day(ms){return new Date(ms+offset).toISOString().slice(0,10);}
 return day(date.getTime())===day(solar.sunrise)&&day(solar.sunrise)===day(solar.sunset)?solar:null;
}
function solarTime(ms,offset,hour24){var d=new Date(ms+(offset||0)*1000),h=d.getUTCHours(),m=String(d.getUTCMinutes()).padStart(2,'0');return hour24?String(h).padStart(2,'0')+':'+m:(h%12||12)+':'+m+' '+(h<12?'AM':'PM');}
function theme(prefs,date,solar){
 var manual=dark.concat(['light']).indexOf(prefs.theme)>=0?prefs.theme:'forest';
 if(!prefs.autoAppearance)return manual;
 var sun=solarForDate(solar,date);
 if(sun)return date.getTime()>=sun.sunrise&&date.getTime()<sun.sunset?'light':(dark.indexOf(prefs.nightTheme)>=0?prefs.nightTheme:(dark.indexOf(manual)>=0?manual:'charcoal'));
 var hour=date.getHours();
 if(hour>=7&&hour<19)return 'light';
 return dark.indexOf(prefs.nightTheme)>=0?prefs.nightTheme:(dark.indexOf(manual)>=0?manual:'charcoal');
}
root.StillAppearance={theme:theme,solarForDate:solarForDate,solarTime:solarTime};
})(window);
