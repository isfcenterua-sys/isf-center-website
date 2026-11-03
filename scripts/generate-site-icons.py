"""Resize and pad the approved brand image. No retouching, painting or colour changes.

Generated files are committed; the normal Node build does not require Pillow.
"""
from pathlib import Path
from PIL import Image
import hashlib, json

root = Path(__file__).resolve().parent.parent
source = root / 'assets/brand/isf-mother-of-god-384.webp'
original = Image.open(source).convert('RGBA')
image = original.crop(original.getchannel('A').getbbox())

def square(size, maskable=False):
    # The maskable image fits completely inside the central 80% safe circle.
    extent = round(size * (0.625 if maskable else 0.90))
    if size <= 32:
        extent = size - 2
    scale = extent / max(image.size)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (size, size), '#F7F3E9')
    canvas.alpha_composite(resized, ((size-resized.width)//2, (size-resized.height)//2))
    return canvas.convert('RGB')

outputs = {'favicon-16x16.png':16, 'favicon-32x32.png':32, 'apple-touch-icon.png':180,
           'android-chrome-192x192.png':192, 'android-chrome-512x512.png':512}
for name, size in outputs.items():
    square(size).save(root/'assets'/name, optimize=True)
square(512, True).save(root/'assets/android-maskable-512x512.png', optimize=True)
square(512).save(root/'assets/favicon.ico', sizes=[(n,n) for n in [16,32,48,64,128,256]])
print(json.dumps({'source':source.name,'sourceSHA256':hashlib.sha256(source.read_bytes()).hexdigest(),
                  'sourceSize':original.size,'processing':'alpha bounds, Lanczos resize, cream padding',
                  'pngFiles':outputs,'icoSizes':[16,32,48,64,128,256],'maskableSafeCircle':True},ensure_ascii=False))
