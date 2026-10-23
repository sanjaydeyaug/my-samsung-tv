/* Actual lunar illumination, sampled at local noon and fixed for each day. */
(function(){
'use strict';
function shape(fraction,waxing){
 var f=Math.max(0,Math.min(1,fraction)),points=[],i,y,x;
 // Trace the lit limb and curved terminator, rather than covering a full moon
 // with a background-colored disc (which fails in light themes).
 for(i=0;i<=64;i++){y=-1+2*i/64;x=Math.sqrt(Math.max(0,1-y*y));points.push([50+(waxing?1:-1)*48*x,50+48*y]);}
 for(i=64;i>=0;i--){y=-1+2*i/64;x=(1-2*f)*Math.sqrt(Math.max(0,1-y*y));points.push([50+(waxing?1:-1)*48*x,50+48*y]);}
 return 'M'+points.map(function(p){return p[0].toFixed(3)+','+p[1].toFixed(3);}).join('L')+'Z';
}
/* Project NASA's longitude/latitude map onto a sphere. The sun direction
   comes from the same daily phase; its dot product gives a curved terminator. */
var surface=null,currentLight=null,canvas=document.getElementById('moon-surface');
function lighting(x,y,phase){
 var z=Math.sqrt(Math.max(0,1-x*x-y*y)),angle=2*Math.PI*phase;
 var incidence=x*Math.sin(angle)-z*Math.cos(angle);
 return 0.55+0.45*Math.pow(Math.max(0,incidence),0.55);
}
function paint(light){
 if(!surface||!canvas||!canvas.getContext)return;
 var size=192,context=canvas.getContext('2d');if(!context)return;
 var pixels=context.createImageData(size,size),out=pixels.data;
 for(var row=0;row<size;row++)for(var col=0;col<size;col++){
  var x=(col+.5-size/2)/(size/2-2),y=(row+.5-size/2)/(size/2-2),r=x*x+y*y;
  if(r>=1)continue;
  var z=Math.sqrt(1-r),u=.5+Math.atan2(x,z)/(2*Math.PI),v=.5+Math.asin(y)/Math.PI;
  var tx=Math.min(surface.width-1,Math.max(0,Math.floor(u*surface.width)));
  var ty=Math.min(surface.height-1,Math.max(0,Math.floor(v*surface.height)));
  var source=(ty*surface.width+tx)*4,target=(row*size+col)*4,shade=lighting(x,y,light.phase);
  // Pale editorial illustration: white highlands and quiet light-gray maria.
  var luminance=.2126*surface.data[source]+.7152*surface.data[source+1]+.0722*surface.data[source+2];
  var pigment=208+47*Math.max(0,Math.min(1,(luminance-55)/200));
  for(var channel=0;channel<3;channel++)out[target+channel]=Math.round(pigment*shade);
  out[target+3]=Math.round(255*Math.min(1,(1-Math.sqrt(r))*(size/2-2)));
 }
 context.putImageData(pixels,0,0);canvas.hidden=false;
}
if(canvas&&canvas.getContext&&window.Image){
 var image=new window.Image();
 image.onload=function(){
  try{
   var source=document.createElement('canvas');source.width=image.naturalWidth;source.height=image.naturalHeight;
   var context=source.getContext('2d');context.drawImage(image,0,0);
   surface=context.getImageData(0,0,source.width,source.height);
   if(currentLight)paint(currentLight);
  }catch(error){surface=null;}
 };
 image.src='images/moon-map-minimal.png';
}
var lastDay=null,lastHemisphere=null;
function phaseFor(now){
 var date=new Date(now);
 // Calendar arithmetic avoids shortened/lengthened days at daylight-saving changes.
 var day=Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000;
 var light=window.SunCalc.getMoonIllumination(new Date(date.getFullYear(),date.getMonth(),date.getDate(),12));
 return {day:day,phase:light.phase,fraction:light.fraction};
}
function update(now,latitude){
 var path=document.getElementById('moon-lit');if(!path)return;
 var light=phaseFor(now),hemisphere=latitude<0?'south':'north';
 if(light.day!==lastDay){
  path.setAttribute('d',shape(light.fraction,light.phase<0.5));
  currentLight=light;paint(light);
  var scene=document.getElementById('home-weather');
  if(scene.style){scene.style.setProperty('--moon-halo-opacity',String(0.55*Math.sqrt(light.fraction)));scene.style.setProperty('--moon-halo-x',light.phase<0.5?'65%':'35%');}
  scene.dataset.moonPhase=String(light.phase);scene.dataset.moonIllumination=String(Math.round(light.fraction*100));
  lastDay=light.day;
 }
 if(hemisphere!==lastHemisphere){if(canvas&&canvas.style)canvas.style.transform=hemisphere==='south'?'rotate(180deg)':'';path.setAttribute('transform',hemisphere==='south'?'rotate(180 50 50)':'');lastHemisphere=hemisphere;}
}
window.StillMoon={shape:shape,lighting:lighting,phaseFor:phaseFor,update:update};update(Date.now(),0);
})();
