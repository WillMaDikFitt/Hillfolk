"""Composite AI side extensions with original layers — soft joins, no mirror seams."""
from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np

ROOT = Path(r"d:\Projects\Hillfolk\public\layers")
BACKUP = ROOT / "_original_1670"
LEFT = Path(r"C:\Users\Asus\.cursor\projects\d-Projects-Hillfolk\assets\extend-left.png")
RIGHT = Path(r"C:\Users\Asus\.cursor\projects\d-Projects-Hillfolk\assets\extend-right.png")
SKY = ROOT / "sky-extend.png"

# Final display canvas (ultrawide-friendly 21:9-ish)
CANVAS = (3360, 1440)
CW, CH = CANVAS
BLEND = 70  # crossfade width at joins


def sky_to_alpha(im: Image.Image, thresh: int = 228) -> Image.Image:
    """Make pale sky pixels transparent so mid/fg extensions only keep hills."""
    arr = np.array(im.convert("RGBA")).astype(np.float32)
    rgb = arr[:, :, :3]
    lum = rgb.mean(axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    # sky: bright, low saturation
    sky = (lum > thresh) & (sat < 28)
    # also near-white cream
    cream = (rgb[:, :, 0] > 235) & (rgb[:, :, 1] > 232) & (rgb[:, :, 2] > 220) & (sat < 35)
    mask = sky | cream
    arr[:, :, 3] = np.where(mask, 0, arr[:, :, 3])
    # soft edge on remaining alpha
    a = Image.fromarray(arr[:, :, 3].astype(np.uint8), "L")
    a = a.filter(ImageFilter.GaussianBlur(0.8))
    out = Image.fromarray(arr[:, :, :3].astype(np.uint8), "RGB").convert("RGBA")
    out.putalpha(a)
    return out


def scale_to_height(im: Image.Image, height: int) -> Image.Image:
    w, h = im.size
    nw = int(w * (height / h) + 0.5)
    return im.resize((nw, height), Image.Resampling.LANCZOS)


def build_wide(art: Image.Image, left: Image.Image, right: Image.Image, keep_sky: bool) -> Image.Image:
    """art is original layer; left/right are extension panels scaled to art height."""
    ah = art.height
    left = scale_to_height(left, ah)
    right = scale_to_height(right, ah)
    if not keep_sky:
        left = sky_to_alpha(left)
        right = sky_to_alpha(right)

    # Use only the outer portion of each panel (the continuation side)
    lw, _ = left.size
    rw, _ = right.size
    left_use = left.crop((0, 0, int(lw * 0.62), ah))
    right_use = right.crop((int(rw * 0.38), 0, rw, ah))

    left_w = left_use.width
    total_w = left_w + art.width + right_use.width - 2 * BLEND
    canvas = Image.new("RGBA", (total_w, ah), (0, 0, 0, 0))
    canvas.alpha_composite(left_use, (0, 0))

    # Feather left+right edges of art for soft joins
    art_feathered = art.copy()
    a = np.array(art_feathered.split()[3]).astype(np.float32)
    ramp = np.ones(art.width, dtype=np.float32)
    for i in range(BLEND):
        t = (i + 1) / (BLEND + 1)
        s = t * t * (3 - 2 * t)
        ramp[i] = s
        ramp[art.width - 1 - i] = s
    a *= ramp[np.newaxis, :]
    art_feathered.putalpha(Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "L"))
    canvas.alpha_composite(art_feathered, (left_w - BLEND, 0))

    # Right panel with feathered left edge
    ru = right_use.copy()
    ra = np.array(ru.split()[3]).astype(np.float32)
    rr = np.ones(ru.width, dtype=np.float32)
    for i in range(BLEND):
        t = (i + 1) / (BLEND + 1)
        rr[i] = t * t * (3 - 2 * t)
    ra *= rr[np.newaxis, :]
    ru.putalpha(Image.fromarray(np.clip(ra, 0, 255).astype(np.uint8), "L"))
    rx = left_w - BLEND + art.width - BLEND
    canvas.alpha_composite(ru, (rx, 0))

    return canvas


def fit_cover(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    tw, th = size
    scale = max(tw / im.width, th / im.height)
    nw, nh = int(im.width * scale + 0.5), int(im.height * scale + 0.5)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (nw - tw) // 2
    y = max(0, (nh - th) // 2 + int(th * 0.02))
    if y + th > nh:
        y = nh - th
    return im.crop((x, y, x + tw, y + th))


def main():
    left = Image.open(LEFT).convert("RGBA")
    right = Image.open(RIGHT).convert("RGBA")

    bg0 = Image.open(BACKUP / "background.png").convert("RGBA")
    mid0 = Image.open(BACKUP / "midground.png").convert("RGBA")
    fg0 = Image.open(BACKUP / "foreground.png").convert("RGBA")

    wide_bg = build_wide(bg0, left, right, keep_sky=True)
    wide_mid = build_wide(mid0, left, right, keep_sky=False)
    wide_fg = build_wide(fg0, left, right, keep_sky=False)
    print("wide sizes", wide_bg.size, wide_mid.size, wide_fg.size)

    # Cover onto final canvas; sky plate under bg
    if SKY.exists():
        sky = fit_cover(Image.open(SKY).convert("RGBA"), CANVAS)
    else:
        sky = Image.new("RGBA", CANVAS, (250, 248, 241, 255))

    bg = sky.copy()
    bg.alpha_composite(fit_cover(wide_bg, CANVAS), (0, 0))
    bg.save(ROOT / "background.png", optimize=True)

    fit_cover(wide_mid, CANVAS).save(ROOT / "midground.png", optimize=True)
    fit_cover(wide_fg, CANVAS).save(ROOT / "foreground.png", optimize=True)
    print("wrote", CANVAS)

    # Hotspot map: art sits in center of wide then cover-cropped
    # Approximate: original art fraction of wide width
    left_w = scale_to_height(left, bg0.height).crop((0, 0, int(scale_to_height(left, bg0.height).width * 0.62), bg0.height)).width
    # rebuild numbers used in build_wide
    ah = bg0.height
    left_s = scale_to_height(left, ah)
    right_s = scale_to_height(right, ah)
    left_use_w = int(left_s.width * 0.62)
    right_use_w = right_s.width - int(right_s.width * 0.38)
    total_w = left_use_w + bg0.width + right_use_w - 2 * BLEND
    art_x0 = left_use_w - BLEND

    # After fit_cover of wide → canvas
    scale = max(CW / total_w, CH / ah)
    nw, nh = int(total_w * scale + 0.5), int(ah * scale + 0.5)
    crop_x = (nw - CW) // 2
    crop_y = max(0, (nh - CH) // 2 + int(CH * 0.02))
    if crop_y + CH > nh:
        crop_y = nh - CH

    def map_box(x, y, w, h):
        def pt(px, py):
            sx = (art_x0 + px / 100 * bg0.width) * scale - crop_x
            sy = (py / 100 * ah) * scale - crop_y
            return sx / CW * 100, sy / CH * 100

        x0, y0 = pt(x, y)
        x1, y1 = pt(x + w, y + h)
        return round(x0, 2), round(y0, 2), round(x1 - x0, 2), round(y1 - y0, 2)

    spots = {
        "about": (43, 16, 16, 11, 51, 20),
        "services": (24, 33, 13, 9, 30, 36),
        "portfolio": (66, 38, 14, 12, 72, 44),
        "what": (8, 56, 7, 18, 11, 62),
        "contact": (68, 60, 16, 22, 76, 70),
    }
    print("\n// remapped hotspot %")
    for id_, (x, y, w, h, dx, dy) in spots.items():
        nx, ny, nw_, nh_ = map_box(x, y, w, h)
        ndx, ndy, _, _ = map_box(dx, dy, 1, 1)
        print(f"  {id_}: {{ x: {nx}, y: {ny}, w: {nw_}, h: {nh_}, doorX: {ndx}, doorY: {ndy} }},")


if __name__ == "__main__":
    main()
