from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root=Path(__file__).resolve().parent.parent/'weather-check'
items=[('wmo-00-sunrise.png','Sunrise · Toronto 7:40 AM'),('wmo-00-day.png','Clear daytime · sun rays'),('wmo-00-sunset.png','Sunset · Toronto 6:22 PM'),('wmo-00-night.png','Clear night · moon and stars'),('wmo-02-day.png','Partly cloudy'),('wmo-51-day.png','Light drizzle'),('wmo-63-day.png','Moderate rain'),('wmo-65-night.png','Heavy rain at night'),('wmo-75-day.png','Heavy snow'),('wmo-45-day.png','Fog'),('wmo-95-sunset.png','Thunderstorm at sunset'),('wmo-99-day.png','Thunderstorm with heavy hail')]
try: font=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',22)
except OSError: font=ImageFont.load_default()
canvas=Image.new('RGB',(1920,4*400+65),'#192522');draw=ImageDraw.Draw(canvas)
draw.text((20,20),'Weather preview checks · simulated conditions using Toronto sunrise/sunset',font=font,fill='white')
for i,(name,label) in enumerate(items):
 x=(i%3)*640;y=65+(i//3)*400
 image=Image.open(root/'screenshots'/name).convert('RGB').resize((640,360),Image.Resampling.LANCZOS)
 canvas.paste(image,(x,y));draw.text((x+12,y+368),label,font=font,fill='white')
canvas.save(root/'overview.jpg',quality=92)
