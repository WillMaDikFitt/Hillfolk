"""Precise building-only polygons. Root originals are never modified."""
from PIL import Image, ImageDraw, ImageFilter
import json
import os
import shutil

ROOT = r"d:\Projects\Hillfolk"
OUT = os.path.join(ROOT, "public", "layers")
CUT = os.path.join(OUT, "buildings")
os.makedirs(CUT, exist_ok=True)

for name, dst in [
    ("BACKGROUND.png", "background.png"),
    ("MIDGROUND.png", "midground.png"),
    ("FOREGROUND.png", "foreground.png"),
    ("hillfolk_homepage.png", "composite.png"),
]:
    shutil.copy2(os.path.join(ROOT, name), os.path.join(OUT, dst))

mid = Image.open(os.path.join(OUT, "midground.png")).convert("RGBA")
fg = Image.open(os.path.join(OUT, "foreground.png")).convert("RGBA")
W, H = mid.size


def kill_foliage(im):
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 10:
                continue
            # greens / lime hill / trees
            if g > r + 8 and g > b + 4 and g > 40:
                px[x, y] = (0, 0, 0, 0)
            elif g > 70 and r < 140 and b < 120 and g >= r and g >= b:
                px[x, y] = (0, 0, 0, 0)
    return im


def extract(src, polygon, name, door, extra_kill_rects=None):
    mask = Image.new("L", src.size, 0)
    ImageDraw.Draw(mask).polygon(polygon, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(0.5))

    out = Image.new("RGBA", src.size, (0, 0, 0, 0))
    out.paste(src, (0, 0))
    px = out.load()
    mx = mask.load()
    w, h = src.size
    for y in range(h):
        for x in range(w):
            if mx[x, y] < 10:
                px[x, y] = (0, 0, 0, 0)
            else:
                r, g, b, a = px[x, y]
                px[x, y] = (r, g, b, int(a * mx[x, y] / 255))

    if extra_kill_rects:
        draw = ImageDraw.Draw(out)
        for rect in extra_kill_rects:
            draw.rectangle(rect, fill=(0, 0, 0, 0))

    kill_foliage(out)

    bbox = out.getbbox()
    if not bbox:
        raise RuntimeError(name)
    l, t, r, b = bbox
    cropped = out.crop((l, t, r, b))
    cropped.save(os.path.join(CUT, name), optimize=True)

    meta = {
        "file": f"buildings/{name}",
        "x": round(l / W * 100, 2),
        "y": round(t / H * 100, 2),
        "w": round((r - l) / W * 100, 2),
        "h": round((b - t) / H * 100, 2),
        "cx": round((l + r) / 2 / W * 100, 2),
        "cy": round((t + b) / 2 / H * 100, 2),
        "door_x": door[0],
        "door_y": door[1],
        "px": list(cropped.size),
    }
    print(name, cropped.size, f"{meta['w']:.1f}% x {meta['h']:.1f}%")
    return meta


# Hand-traced from zoom grids (1670x942)
polys = {
    # ABOUT — rectangular HQ only (no hill / path / side trees)
    "about": {
        "src": mid,
        "poly": [
            (722, 122), (978, 122), (988, 132), (988, 200),
            (978, 208), (730, 208), (718, 198), (718, 132),
        ],
        "door": (50.5, 16.8),
        "kill": [(700, 205, 1010, 240)],  # hill/bushes under footprint
    },
    # SERVICES — billboard board + frame + poles only
    "services": {
        "src": mid,
        "poly": [
            (448, 272), (612, 272), (618, 280), (618, 338),
            (600, 345), (595, 400), (575, 400), (570, 345),
            (500, 345), (495, 400), (475, 400), (470, 345),
            (448, 338),
        ],
        "door": (29.5, 32.5),
        "kill": [(430, 400, 630, 430)],
    },
    # PORTFOLIO — white gallery box + glass (no big trees / hill)
    "portfolio": {
        "src": mid,
        "poly": [
            (1125, 365), (1310, 365), (1318, 375), (1318, 470),
            (1305, 482), (1140, 482), (1125, 470),
        ],
        "door": (71.0, 43.5),
        "kill": [(1080, 480, 1330, 520)],
    },
    # WHAT WE DO — vertical banner + lamp post only
    "what": {
        "src": fg,
        "poly": [
            (188, 505), (228, 505), (232, 515), (232, 720),
            (220, 735), (200, 735), (192, 720), (192, 640),
            (185, 640), (185, 560),
        ],
        "door": (12.5, 60.0),
        "kill": [],
    },
    # CONTACT — cottage facade + roof (no side trees, no person)
    "contact": {
        "src": fg,
        "poly": [
            (1195, 520), (1280, 505), (1365, 520), (1385, 545),
            (1385, 575), (1375, 590), (1375, 770), (1355, 785),
            (1210, 785), (1195, 770), (1195, 590), (1188, 570),
            (1188, 545),
        ],
        "door": (77.5, 70.0),
        "kill": [
            (1360, 600, 1500, 820),  # right trees
            (1180, 780, 1500, 840),  # person / ground
        ],
    },
}

meta = {}
for key, cfg in polys.items():
    meta[key] = extract(
        cfg["src"],
        cfg["poly"],
        f"{key}.png",
        cfg["door"],
        extra_kill_rects=cfg["kill"],
    )

with open(os.path.join(OUT, "hotspots.json"), "w", encoding="utf-8") as f:
    json.dump(meta, f, indent=2)

# QA
qa = Image.new("RGBA", (1600, 260), (30, 36, 32, 255))
x = 24
for key in meta:
    cut = Image.open(os.path.join(CUT, f"{key}.png")).convert("RGBA")
    card = Image.new("RGBA", (300, 210), (55, 60, 56, 255))
    for yy in range(0, 210, 8):
        for xx in range(0, 300, 8):
            if (xx // 8 + yy // 8) % 2 == 0:
                ImageDraw.Draw(card).rectangle([xx, yy, xx + 8, yy + 8], fill=(68, 74, 70, 255))
    thumb = cut.copy()
    thumb.thumbnail((280, 190))
    card.paste(thumb, ((300 - thumb.size[0]) // 2, (210 - thumb.size[1]) // 2), thumb)
    qa.paste(card, (x, 20))
    ImageDraw.Draw(qa).text((x + 6, 235), key, fill=(255, 255, 255, 255))
    x += 310
qa.convert("RGB").save(os.path.join(OUT, "_qa-cutouts.jpg"), quality=92)

# cleanup zooms
for f in os.listdir(OUT):
    if f.startswith("_zoom-"):
        os.remove(os.path.join(OUT, f))
print("done")
