import sys
from PIL import Image, ImageDraw, ImageFont
out = sys.argv[1]
GREEN=(73,94,87); YELLOW=(244,206,20); LEAF=(103,140,72)
def font(sz):
    for p in ["/System/Library/Fonts/Supplemental/Arial Bold.ttf","/System/Library/Fonts/Helvetica.ttc"]:
        try: return ImageFont.truetype(p, sz)
        except Exception: pass
    return ImageFont.load_default()
def lemon(d, cx, cy, r):
    d.ellipse([cx-r*1.25, cy-r, cx+r*1.25, cy+r], fill=YELLOW, outline=(214,176,0), width=max(2,r//10))
    d.ellipse([cx+r*0.15, cy-r*1.45, cx+r*0.95, cy-r*0.85], fill=LEAF)
# logo: lemon + text, transparent
S=4; W,H=600*S,120*S
img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
lemon(d, 60*S, 64*S, 38*S)
d.text((130*S, 60*S), "LITTLE LEMON", font=font(64*S), fill=GREEN, anchor="lm")
img.resize((W//S,H//S), Image.LANCZOS).save(f"{out}/logo.png")
# app icon
S=1024
for name,bg in [("icon.png",(73,94,87,255)),("splash-icon.png",(0,0,0,0)),("android-icon-foreground.png",(0,0,0,0))]:
    ic=Image.new("RGBA",(S,S),bg); d=ImageDraw.Draw(ic); lemon(d,S//2,S//2+60,280); ic.save(f"{out}/{name}")
