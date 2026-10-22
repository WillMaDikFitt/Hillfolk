"""Extract soft-edged building cutouts from the hill-town base illustration."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(r"d:\Projects\Hillfolk")
SRC = ROOT / "public" / "scene" / "hill-town.jpg"
OUT = ROOT / "public" / "scene" / "cutouts"
OUT.mkdir(parents=True, exist_ok=True)

# Polygon points for each spot (same as SVG paths in spots.js)
SPOTS = {
    "about": [(368, 168), (572, 168), (576, 272), (364, 272)],
    "services": [
        (328, 232),
        (408, 232),
        (408, 278),
        (398, 278),
        (398, 298),
        (338, 298),
        (338, 278),
        (328, 278),
    ],
    "portfolio": [(632, 272), (738, 272), (742, 348), (628, 348)],
    "contact": [
        (520, 288),
        (630, 268),
        (760, 288),
        (768, 318),
        (768, 528),
        (512, 528),
        (512, 318),
    ],
    "what": [(174, 268), (206, 268), (206, 338), (174, 338)],
    "cafe": [(4, 285), (208, 285), (212, 318), (212, 535), (2, 535)],
}

PAD = 10


def extract(name: str, points: list[tuple[int, int]], base: Image.Image):
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    x0 = max(0, min(xs) - PAD)
    y0 = max(0, min(ys) - PAD)
    x1 = min(base.width, max(xs) + PAD)
    y1 = min(base.height, max(ys) + PAD)
    w, h = x1 - x0, y1 - y0

    crop = base.crop((x0, y0, x1, y1)).convert("RGBA")
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    local = [(x - x0, y - y0) for x, y in points]
    draw.polygon(local, fill=255)
    # Soft edge so cutout doesn't look like a sticker
    mask = mask.filter(ImageFilter.GaussianBlur(1.2))

    out = crop.copy()
    # Multiply existing alpha by mask
    r, g, b, a = out.split()
    a_arr = (np.array(a).astype(np.float32) * (np.array(mask).astype(np.float32) / 255.0)).astype(np.uint8)
    out.putalpha(Image.fromarray(a_arr, "L"))

    path = OUT / f"{name}.png"
    out.save(path, optimize=True)
    # Percent positions relative to 1024x576
    meta = {
        "file": f"/scene/cutouts/{name}.png",
        "x": round(x0 / base.width * 100, 3),
        "y": round(y0 / base.height * 100, 3),
        "w": round(w / base.width * 100, 3),
        "h": round(h / base.height * 100, 3),
        "px": (x0, y0, w, h),
    }
    print(name, meta)
    return meta


def main():
    base = Image.open(SRC).convert("RGBA")
    metas = {}
    for name, pts in SPOTS.items():
        metas[name] = extract(name, pts, base)

    # Print JS snippet for spots.js
    print("\n// cutout boxes")
    for name, m in metas.items():
        print(f'  // {name}: x:{m["x"]}, y:{m["y"]}, w:{m["w"]}, h:{m["h"]}')


if __name__ == "__main__":
    main()
