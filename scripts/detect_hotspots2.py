"""Refine hotspot centers for interiors + print viewBox-mapped coords."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

PUBLIC = Path(r"d:\Projects\Hillfolk\public")


def to_vb(cx, cy, iw, ih, vw, vh):
    return round(cx * vw / iw), round(cy * vh / ih)


def find_white_cards(path, y0_frac=0.35, y1_frac=0.78):
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    arr = np.array(im.resize((1200, int(h * 1200 / w)), Image.Resampling.BILINEAR))
    scale = w / 1200
    r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
    white = (a > 200) & (r > 235) & (g > 235) & (b > 235)
    y0, y1 = int(arr.shape[0] * y0_frac), int(arr.shape[1] and arr.shape[0] * y1_frac)
    band = white[y0:y1]
    # column density
    dens = band.mean(axis=0)
    thresh = dens.max() * 0.35
    on = dens > thresh
    groups = []
    start = None
    for i, v in enumerate(on):
        if v and start is None:
            start = i
        if (not v or i == len(on) - 1) and start is not None:
            end = i if not v else i
            if end - start > 40:
                groups.append((start, end))
            start = None
    cards = []
    for x0, x1 in groups:
        sub = band[:, x0:x1]
        rows = sub.any(axis=1)
        ys = np.where(rows)[0]
        if len(ys) < 10:
            continue
        cy = (y0 + (ys[0] + ys[-1]) / 2) * scale
        cx = ((x0 + x1) / 2) * scale
        cards.append((cx, cy, (x1 - x0) * scale, (ys[-1] - ys[0]) * scale))
    # merge tiny fragments, keep largest by width
    cards.sort(key=lambda c: -c[2])
    return cards, w, h


def annotate_points(path, points, out, color=(255, 0, 255)):
    im = Image.open(path).convert("RGBA")
    # preview
    pw = 1400
    scale = pw / im.width
    prev = im.resize((pw, int(im.height * scale)), Image.Resampling.BILINEAR)
    d = ImageDraw.Draw(prev)
    for name, cx, cy, r in points:
        x, y, rr = cx * scale, cy * scale, r * scale
        d.ellipse([x - rr, y - rr, x + rr, y + rr], outline=color + (255,), width=3)
        d.ellipse([x - 4, y - 4, x + 4, y + 4], fill=(255, 255, 0, 255))
        d.text((x + 8, y - 10), name, fill=color + (255,))
    prev.convert("RGB").save(out, quality=92)
    print("saved", out)


# --- Services cards ---
cards, sw, sh = find_white_cards(PUBLIC / "interiors" / "services-fg.png")
print("services white regions (full px):")
for i, (cx, cy, ww, hh) in enumerate(cards[:12]):
    print(f"  {i}: cx={cx:.0f} cy={cy:.0f} w={ww:.0f} h={hh:.0f} -> vb {to_vb(cx,cy,sw,sh,1024,576)}")

# Pick 5 mid-sized card-like regions in the lower board
cardish = [c for c in cards if 200 < c[2] < 900 and c[3] > 200]
cardish.sort(key=lambda c: c[0])
print("cardish sorted by x:", [(round(c[0]), round(c[1])) for c in cardish[:8]])

# --- Contact: locate "contact info" poster + open book by dark/text regions in ROIs ---
cim = Image.open(PUBLIC / "interiors" / "contact-fg.png").convert("RGBA")
cw, ch = cim.size
carr = np.array(cim.resize((1400, int(ch * 1400 / cw)), Image.Resampling.BILINEAR))
scale = cw / 1400
r, g, b, a = carr[:,:,0], carr[:,:,1], carr[:,:,2], carr[:,:,3]
# framed poster often has dark text on light paper — left half mid
dark = (a > 180) & (r < 70) & (g < 70) & (b < 70)
# book page: large light area lower-right
light = (a > 180) & (r > 220) & (g > 210) & (b > 190)

def densest_window(mask, x0, x1, y0, y1, win_w, win_h):
    sub = mask[y0:y1, x0:x1].astype(np.float32)
    # integral image
    ii = np.pad(sub.cumsum(0).cumsum(1), ((1, 0), (1, 0)))
    best = None
    for y in range(0, sub.shape[0] - win_h, 4):
        for x in range(0, sub.shape[1] - win_w, 4):
            s = ii[y + win_h, x + win_w] - ii[y, x + win_w] - ii[y + win_h, x] + ii[y, x]
            if best is None or s > best[0]:
                best = (s, x0 + x + win_w / 2, y0 + y + win_h / 2)
    return best

# contact info poster: left-center
poster = densest_window(dark, int(0.12 * 1400), int(0.42 * 1400), int(0.22 * 1400 * ch / cw) if False else int(0.18 * carr.shape[0]), int(0.55 * carr.shape[0]), 90, 120)
# book: lower right light
book = densest_window(light, int(0.55 * 1400), int(0.95 * 1400), int(0.55 * carr.shape[0]), int(0.95 * carr.shape[0]), 160, 120)
print("poster", poster, "->", None if not poster else (poster[1] * scale, poster[2] * scale))
print("book", book, "->", None if not book else (book[1] * scale, book[2] * scale))

# About: known composition percentages from art
about_pts = [
    ("brand", 0.145, 0.36, 0.055),
    ("studio", 0.46, 0.58, 0.07),
    ("view", 0.50, 0.30, 0.065),
    ("team", 0.72, 0.48, 0.055),
    ("story", 0.90, 0.48, 0.05),
]
aw, ah = 6000, 3375
about_mapped = []
print("\nABOUT viewBox 1024x576:")
for name, fx, fy, fr in about_pts:
    cx, cy, r = aw * fx, ah * fy, min(aw, ah) * fr
    vx, vy = to_vb(cx, cy, aw, ah, 1024, 576)
    vr = round(r * 1024 / aw)
    print(f"  {name}: vb ({vx}, {vy}) r={vr}")
    about_mapped.append((name, cx, cy, r))

annotate_points(PUBLIC / "interiors" / "about-us.png", about_mapped, PUBLIC / "debug-about-final.jpg")

# Vista home direct pixels
vista_pts = [
    ("about", 753, 175, 68),
    ("services", 571, 310, 62),
    ("contact", 1220, 690, 88),
]
annotate_points(PUBLIC / "scene" / "v2-mid.png", vista_pts[:2], PUBLIC / "debug-vista-mid-final.jpg")
# contact on fg
annotate_points(PUBLIC / "scene" / "v2-fg.png", [vista_pts[2]], PUBLIC / "debug-vista-fg-final.jpg")

# Hero index
hero_pts = [
    ("about", 4096 * 0.375, 1600 * 0.34, 90),
    ("services", 1340, 760, 110),
    ("contact", 2267, 1120, 130),
    ("cafe", 4096 * 0.09, 1600 * 0.62, 140),
]
annotate_points(PUBLIC / "scene" / "hero-fg.png", hero_pts, PUBLIC / "debug-hero-final.jpg")
print("\nHERO viewBox 4096x1600 (native):")
for n, x, y, r in hero_pts:
    print(f"  {n}: ({x:.0f}, {y:.0f}) r={r}")

# Services: if we found 5 cards use them; else even spacing estimate from orange arrows
if len(cardish) >= 5:
    svc = cardish[:5]
else:
    # fallback from detected orange arrow x positions, raise cy onto card body
    xs = [1193, 1883, 2539, 3127, 3866]
    svc = [(x, 1950, 420, 700) for x in xs]
print("\nSERVICES viewBox 1024x576:")
svc_pts = []
names = ["strategy", "design", "story", "campaign", "tech"]
for name, (cx, cy, ww, hh) in zip(names, svc):
    # lift center from conveyor into card body
    cy2 = cy - hh * 0.08 if hh > 100 else cy - 180
    vx, vy = to_vb(cx, cy2, sw, sh, 1024, 576)
    vr = max(36, round(min(ww, hh) * 0.22 * 1024 / sw))
    print(f"  {name}: full ({cx:.0f},{cy2:.0f}) vb ({vx},{vy}) r={vr}")
    svc_pts.append((name, cx, cy2, min(ww, hh) * 0.28))
annotate_points(PUBLIC / "interiors" / "services-fg.png", svc_pts, PUBLIC / "debug-services-final.jpg")

# Contact mapped
if poster:
    pcx, pcy = poster[1] * scale, poster[2] * scale
else:
    pcx, pcy = cw * 0.28, ch * 0.38
if book:
    bcx, bcy = book[1] * scale, book[2] * scale
else:
    bcx, bcy = cw * 0.78, ch * 0.72
print("\nCONTACT viewBox 1024x576:")
for name, cx, cy, fr in (("address", pcx, pcy, 0.055), ("connect", bcx, bcy, 0.07)):
    vx, vy = to_vb(cx, cy, cw, ch, 1024, 576)
    vr = round(min(cw, ch) * fr * 1024 / cw)
    print(f"  {name}: full ({cx:.0f},{cy:.0f}) vb ({vx},{vy}) r={vr}")
annotate_points(
    PUBLIC / "interiors" / "contact-fg.png",
    [("address", pcx, pcy, min(cw, ch) * 0.055), ("connect", bcx, bcy, min(cw, ch) * 0.07)],
    PUBLIC / "debug-contact-final.jpg",
)
