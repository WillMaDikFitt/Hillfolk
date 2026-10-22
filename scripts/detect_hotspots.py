"""Detect clickable landmark centers from Hillfolk art layers."""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"


def red_mask(arr: np.ndarray) -> np.ndarray:
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    return (a > 180) & (r > 150) & (g < 120) & (b < 120) & (r > g + 35) & (r > b + 35)


def dark_on_light_mask(arr: np.ndarray) -> np.ndarray:
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    dark = (a > 180) & (r < 55) & (g < 55) & (b < 55)
    # keep dark pixels that have bright neighbors (sign text)
    bright = (a > 180) & (r > 210) & (g > 210) & (b > 210)
    # dilate bright a little
    br = bright.copy()
    for _ in range(2):
        m = br.copy()
        m[1:] |= br[:-1]
        m[:-1] |= br[1:]
        m[:, 1:] |= br[:, :-1]
        m[:, :-1] |= br[:, 1:]
        br = m
    return dark & br


def cluster_mask(mask: np.ndarray, dilate: int = 4, min_area: int = 120) -> list[dict]:
    h, w = mask.shape
    dil = mask.copy()
    for _ in range(dilate):
        m = dil.copy()
        m[1:] |= dil[:-1]
        m[:-1] |= dil[1:]
        m[:, 1:] |= dil[:, :-1]
        m[:, :-1] |= dil[:, 1:]
        dil = m

    visited = np.zeros_like(dil, dtype=bool)
    blobs: list[dict] = []
    ys, xs = np.where(dil)
    for y, x in zip(ys, xs):
        if visited[y, x]:
            continue
        q = deque([(x, y)])
        visited[y, x] = True
        ox: list[int] = []
        oy: list[int] = []
        while q:
            cx, cy = q.popleft()
            if mask[cy, cx]:
                ox.append(cx)
                oy.append(cy)
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < w and 0 <= ny < h and dil[ny, nx] and not visited[ny, nx]:
                    visited[ny, nx] = True
                    q.append((nx, ny))
        if len(ox) < min_area:
            continue
        minx, maxx, miny, maxy = min(ox), max(ox), min(oy), max(oy)
        blobs.append(
            {
                "area": len(ox),
                "cx": sum(ox) / len(ox),
                "cy": sum(oy) / len(oy),
                "box": (minx, miny, maxx, maxy),
                "w": maxx - minx,
                "h": maxy - miny,
            }
        )
    blobs.sort(key=lambda b: -b["area"])
    return blobs


def annotate(path: Path, blobs: list[dict], out: Path) -> None:
    im = Image.open(path).convert("RGBA")
    draw = ImageDraw.Draw(im)
    for i, b in enumerate(blobs[:10]):
        x0, y0, x1, y1 = b["box"]
        draw.rectangle([x0 - 3, y0 - 3, x1 + 3, y1 + 3], outline=(255, 0, 255, 255), width=3)
        draw.ellipse([b["cx"] - 7, b["cy"] - 7, b["cx"] + 7, b["cy"] + 7], fill=(255, 255, 0, 255))
        draw.text((x0, max(0, y0 - 16)), f"{i}:{int(b['cx'])},{int(b['cy'])}", fill=(255, 0, 255, 255))
    im.convert("RGB").save(out, quality=92)
    print("saved", out)


def pct(cx: float, cy: float, w: int, h: int) -> tuple[float, float]:
    return round(100 * cx / w, 2), round(100 * cy / h, 2)


def report(name: str, path: Path, blobs: list[dict]) -> None:
    im = Image.open(path)
    w, h = im.size
    print(f"\n=== {name} {w}x{h} ===")
    for i, b in enumerate(blobs[:12]):
        px, py = pct(b["cx"], b["cy"], w, h)
        print(
            f"  [{i}] cx={b['cx']:.0f} cy={b['cy']:.0f} "
            f"({px}%, {py}%) area={b['area']} box={b['box']} size={b['w']}x{b['h']}"
        )


def load_rgba(path: Path, max_w: int = 0) -> tuple[np.ndarray, float, Image.Image]:
    im = Image.open(path).convert("RGBA")
    scale = 1.0
    if max_w and im.width > max_w:
        scale = max_w / im.width
        im_small = im.resize((max_w, int(im.height * scale)), Image.Resampling.BILINEAR)
        return np.array(im_small), scale, im
    return np.array(im), 1.0, im


def scale_blobs(blobs: list[dict], scale: float) -> list[dict]:
    if scale == 1.0:
        return blobs
    inv = 1.0 / scale
    out = []
    for b in blobs:
        x0, y0, x1, y1 = b["box"]
        out.append(
            {
                **b,
                "cx": b["cx"] * inv,
                "cy": b["cy"] * inv,
                "box": (int(x0 * inv), int(y0 * inv), int(x1 * inv), int(y1 * inv)),
                "w": int(b["w"] * inv),
                "h": int(b["h"] * inv),
            }
        )
    return out


def main() -> None:
    mid = PUBLIC / "scene" / "v2-mid.png"
    fg = PUBLIC / "scene" / "v2-fg.png"
    hero = PUBLIC / "scene" / "hero-fg.png"
    about = PUBLIC / "interiors" / "about-us.png"
    services = PUBLIC / "interiors" / "services-fg.png"
    contact = PUBLIC / "interiors" / "contact-fg.png"

    mid_arr, _, _ = load_rgba(mid)
    mid_blobs = cluster_mask(red_mask(mid_arr), dilate=5, min_area=100)
    report("v2-mid RED", mid, mid_blobs)
    annotate(mid, mid_blobs, PUBLIC / "debug-mid-labels.jpg")

    fg_arr, _, _ = load_rgba(fg)
    fg_red = cluster_mask(red_mask(fg_arr), dilate=4, min_area=60)
    fg_dark = cluster_mask(dark_on_light_mask(fg_arr), dilate=3, min_area=80)
    report("v2-fg RED", fg, fg_red)
    report("v2-fg DARK-ON-LIGHT", fg, fg_dark)
    annotate(fg, fg_red + fg_dark[:5], PUBLIC / "debug-fg-labels.jpg")

    hero_arr, scale, _ = load_rgba(hero, max_w=2048)
    hero_dark = scale_blobs(
        cluster_mask(dark_on_light_mask(hero_arr), dilate=4, min_area=80), scale
    )
    report("hero-fg DARK-ON-LIGHT", hero, hero_dark)
    annotate(hero, hero_dark, PUBLIC / "debug-hero-labels.jpg")

    # Interior pages: orange/red headings + dark brand text (work on downscaled)
    for name, path in (("about", about), ("services", services), ("contact", contact)):
        arr, scale, full = load_rgba(path, max_w=1600)
        r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
        orange = (a > 180) & (r > 180) & (g > 60) & (g < 160) & (b < 100) & (r > g + 40)
        dark = dark_on_light_mask(arr)
        o_blobs = scale_blobs(cluster_mask(orange, dilate=5, min_area=80), scale)
        d_blobs = scale_blobs(cluster_mask(dark, dilate=3, min_area=100), scale)
        report(f"{name} ORANGE", path, o_blobs)
        report(f"{name} DARK", path, d_blobs)
        # annotate on a preview-sized copy
        preview = full.resize((1600, int(full.height * 1600 / full.width)), Image.Resampling.BILINEAR)
        prev_blobs = []
        for b in o_blobs[:6] + d_blobs[:6]:
            prev_blobs.append(
                {
                    **b,
                    "cx": b["cx"] * scale,
                    "cy": b["cy"] * scale,
                    "box": tuple(int(v * scale) for v in b["box"]),
                }
            )
        draw = ImageDraw.Draw(preview)
        for i, b in enumerate(prev_blobs):
            x0, y0, x1, y1 = b["box"]
            draw.rectangle([x0 - 2, y0 - 2, x1 + 2, y1 + 2], outline=(255, 0, 255, 255), width=2)
            draw.ellipse([b["cx"] - 5, b["cy"] - 5, b["cx"] + 5, b["cy"] + 5], fill=(255, 255, 0, 255))
            draw.text((x0, max(0, y0 - 14)), f"{i}:{int(b['cx']/scale)},{int(b['cy']/scale)}", fill=(255, 0, 255))
        out = PUBLIC / f"debug-{name}-labels.jpg"
        preview.convert("RGB").save(out, quality=90)
        print("saved", out)


if __name__ == "__main__":
    main()
