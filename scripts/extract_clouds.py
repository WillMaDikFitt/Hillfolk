"""Extract cloud sprites from Hillfolk background art and clear them from the BG layer."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
from scipy import ndimage

ROOT = Path(r"d:\Projects\Hillfolk")
BG = ROOT / "public" / "layers" / "background.png"
OUT = ROOT / "public" / "layers"
BACKUP = ROOT / "public" / "layers" / "background.pre-clouds.png"

# Regions roughly matching the painted cloud clusters (x0,y0,x1,y1) on 1670x942
# Tuned from visual inspection of the sky
REGIONS = [
    ("cloud-left", 0, 0, 620, 280),
    ("cloud-mid", 520, 40, 980, 220),
    ("cloud-right", 980, 20, 1670, 300),
]


def cloud_mask(rgba: np.ndarray, y0: int, y1: int, x0: int, x1: int) -> np.ndarray:
    """Soft mask of cloud-like pixels in a crop (full-image sized bool)."""
    h, w = rgba.shape[:2]
    mask = np.zeros((h, w), dtype=bool)
    crop = rgba[y0:y1, x0:x1]
    rgb = crop[:, :, :3].astype(np.float32)
    a = crop[:, :, 3].astype(np.float32)
    lum = rgb.mean(axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)

    # Clouds: light, low-sat, with some opacity. Exclude fully transparent sky holes.
    # Also include soft grey mist bands.
    is_cloud = (a > 40) & (lum > 175) & (sat < 45) & (lum < 252)
    # Keep brighter white puffs
    is_puff = (a > 80) & (lum > 220) & (sat < 30)

    local = is_cloud | is_puff

    # Drop near-solid sky plate if present (very large flat alpha-less areas already excluded)
    # Prefer blobs with alpha variation / not the green hills
    greenish = (rgb[:, :, 1] > rgb[:, :, 0] + 15) & (rgb[:, :, 1] > rgb[:, :, 2] + 10) & (lum < 200)
    local = local & ~greenish

    mask[y0:y1, x0:x1] = local
    # Clean up
    mask = ndimage.binary_opening(mask, iterations=1)
    mask = ndimage.binary_closing(mask, iterations=2)
    mask = ndimage.binary_dilation(mask, iterations=2)
    return mask


def extract_sprite(rgba: np.ndarray, mask: np.ndarray, pad: int = 8) -> tuple[Image.Image, tuple[int, int]]:
    ys, xs = np.where(mask)
    if len(xs) == 0:
        raise ValueError("empty mask")
    y0, y1 = max(0, ys.min() - pad), min(rgba.shape[0], ys.max() + pad + 1)
    x0, x1 = max(0, xs.min() - pad), min(rgba.shape[1], xs.max() + pad + 1)
    sprite = np.zeros((y1 - y0, x1 - x0, 4), dtype=np.uint8)
    m = mask[y0:y1, x0:x1]
    sprite[m] = rgba[y0:y1, x0:x1][m]
    # Soft edge
    alpha = sprite[:, :, 3].astype(np.float32)
    feather = ndimage.gaussian_filter(m.astype(np.float32), sigma=1.2)
    sprite[:, :, 3] = np.clip(alpha * feather / (feather.max() + 1e-6) * (alpha.max() / 255.0) * 255, 0, 255).astype(
        np.uint8
    )
    # Simpler: keep original alpha where mask, feather mask into alpha
    out = rgba[y0:y1, x0:x1].copy()
    soft = ndimage.gaussian_filter(m.astype(np.float32), sigma=1.5)
    soft = soft / (soft.max() + 1e-6)
    out_a = (out[:, :, 3].astype(np.float32) * soft).astype(np.uint8)
    out[:, :, 3] = out_a
    # Zero outside soft mask
    out[soft < 0.05, 3] = 0
    return Image.fromarray(out, "RGBA"), (x0, y0)


def erase_clouds(rgba: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """Remove cloud pixels so animated sprites don't double-up."""
    out = rgba.copy()
    # Expand erase a bit
    erase = ndimage.binary_dilation(mask, iterations=3)
    # Make erased pixels transparent — sky wash behind shows through
    out[erase, 3] = 0
    # Soften hole edge
    edge = erase & ~ndimage.binary_erosion(erase, iterations=2)
    # Slightly reduce alpha on edge of remaining art near hole
    return out


def main():
    bg = Image.open(BG).convert("RGBA")
    if not BACKUP.exists():
        bg.save(BACKUP)
        print("backed up", BACKUP)

    rgba = np.array(bg)
    combined = np.zeros(rgba.shape[:2], dtype=bool)
    sprites = []

    for name, x0, y0, x1, y1 in REGIONS:
        m = cloud_mask(rgba, y0, y1, x0, x1)
        # Keep only reasonably sized components inside region
        labeled, n = ndimage.label(m)
        keep = np.zeros_like(m)
        for i in range(1, n + 1):
            size = int((labeled == i).sum())
            if size < 400:
                continue
            keep |= labeled == i
        m = keep
        px = int(m.sum())
        print(f"{name}: {px} px")
        if px < 800:
            print(f"  skip {name} — too small")
            continue
        sprite, (sx, sy) = extract_sprite(rgba, m)
        path = OUT / f"{name}.png"
        sprite.save(path)
        sprites.append({"name": name, "file": path.name, "x": sx, "y": sy, "w": sprite.width, "h": sprite.height})
        print(f"  saved {path.name} at ({sx},{sy}) {sprite.size}")
        combined |= m

    cleaned = erase_clouds(rgba, combined)
    Image.fromarray(cleaned, "RGBA").save(BG)
    print("updated background.png (clouds cleared)")

    # Also write a tiny meta json for positioning
    meta = OUT / "clouds.json"
    import json

    meta.write_text(json.dumps({"canvas": [1670, 942], "clouds": sprites}, indent=2), encoding="utf-8")
    print("wrote", meta)


if __name__ == "__main__":
    main()
