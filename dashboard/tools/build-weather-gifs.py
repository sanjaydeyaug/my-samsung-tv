"""Generate looping, antialiased geometric weather illustrations for the TV."""
from PIL import Image, ImageDraw
from pathlib import Path
import math
OUT=Path(__file__).resolve().parents[1]/'tizen/icons/weather';OUT.mkdir(exist_ok=True)
S=3; SIZE=144
def circle(draw,box,color):draw.ellipse(tuple(int(v*S) for v in box),fill=color)
def line(draw,points,color,width):draw.line([(int(x*S),int(y*S)) for x,y in points],fill=color,width=width*S)
def sun(draw,t,small=False):
 x,y,r=(78,48,22) if small else (76,58,27)
 for i in range(12):
  a=2*math.pi*(i/12+t/12);inner=r+8;outer=r+18+2*math.sin(t*math.tau)
  line(draw,[(x+inner*math.cos(a),y+inner*math.sin(a)),(x+outer*math.cos(a),y+outer*math.sin(a))],'#ffdf83',3)
 circle(draw,(x-r,y-r,x+r,y+r),'#ffd15a');circle(draw,(x-r+3,y-r+3,x+r-3,y+r-3),'#ffdd7e');circle(draw,(x-13,y-17,x+5,y+1),'#ffeaa8')
def cloud(draw,t,dark=False,back=False):
 x=9*math.sin(t*math.tau)+(8 if back else 0);y=52+(0 if back else 10)
 color='#9aafc8' if dark else '#e1edf7'
 draw.rounded_rectangle(tuple(int(v*S) for v in (23+x,y+19,125+x,y+52)),radius=17*S,fill=color)
 circle(draw,(38+x,y,85+x,y+47),color);circle(draw,(71+x,y+8,110+x,y+47),color)
 line(draw,[(42+x,y+46),(104+x,y+46)],'#b7c9db',2)
def frame(kind,t):
 im=Image.new('RGB',(SIZE*S,SIZE*S),'#31658a' if kind in ['sun','partly'] else '#2b405c');d=ImageDraw.Draw(im)
 if kind in ['sun','partly']:sun(d,t,kind=='partly')
 if kind=='night':
  circle(d,(50,24,104,78),'#e8efff');circle(d,(68,15,114,66),'#2b405c')
  for i,(x,y) in enumerate([(29,40),(115,29),(110,102),(44,104)]):
   r=2+2*(1+math.sin(t*math.tau+i))/2;line(d,[(x-r,y),(x+r,y)],'#e8efff',1);line(d,[(x,y-r),(x,y+r)],'#e8efff',1)
 if kind in ['cloud','partly','rain','snow','storm','fog']:cloud(d,t,kind in ['rain','storm'])
 if kind in ['rain','storm']:
  for i in range(8):
   p=(t*2+i*.173)%1;x=32+i*12-p*13;y=96+p*40
   line(d,[(x,y),(x-4,y+10)],'#9edcfa',2)
 if kind=='snow':
  for i in range(7):
   p=(t+i*.153)%1;x=29+i*14+5*math.sin(p*math.tau);y=93+p*43
   for a in [0,math.pi/3,2*math.pi/3]:line(d,[(x-3*math.cos(a),y-3*math.sin(a)),(x+3*math.cos(a),y+3*math.sin(a))],'#ffffff',1)
 if kind=='fog':
  for i in range(3):
   x=12*math.sin(t*math.tau+i);line(d,[(26+x,106+i*10),(119+x,106+i*10)],'#dce9f1',3)
 if kind=='storm' and .25<t<.5:
  d.polygon([(77*S,91*S),(64*S,113*S),(76*S,113*S),(67*S,136*S),(95*S,105*S),(82*S,105*S)],fill='#ffdf7a')
 return im.resize((SIZE*2,SIZE*2),Image.Resampling.LANCZOS)
for kind in ['sun','night','partly','cloud','rain','snow','fog','storm']:
 frames=[frame(kind,i/32) for i in range(32)]
 # Shared palette prevents color flicker between frames.
 sheet=Image.new('RGB',(288*8,288*4))
 for i,f in enumerate(frames):sheet.paste(f,((i%8)*288,(i//8)*288))
 palette=sheet.quantize(colors=128)
 frames=[f.quantize(palette=palette,dither=Image.Dither.NONE) for f in frames]
 frames[0].save(OUT/(kind+'.gif'),save_all=True,append_images=frames[1:],duration=100,loop=0,optimize=False,disposal=2)
 print(kind, (OUT/(kind+'.gif')).stat().st_size)
