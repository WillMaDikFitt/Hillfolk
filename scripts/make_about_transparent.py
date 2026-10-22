"""Punch only the connected black window-sky to alpha. Lossless PNG, no resize."""
from collections import deque
from pathlib import Path
from PIL import Image

SRC = Path(
    r"C:\Users\Asus\.cursor\projects\d-Projects-Hillfolk\assets"
    r"\c__Users_Asus_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"7c3dbb2587365d67219cfb5d6056e7fb_images_CMECC_WEBSITE_169__10_"
    r"-d2f621ae-e989-48d8-bf44-c3fcc1411b63.jpg"
)
ALT = Path(r"d:\Projects\Hillfolk\public\images\about-us.jpg")
src = SRC if SRC.exists() else ALT

rgb = Image.open(src).convert("RGB")
w, h = rgb.size
pixels = rgb.load()
print(f"source: {src} {w}x{h}")

THRESH = 14


def is_sky(x, y):
    r, g, b = pixels[x, y]
    return r <= THRESH and g <= THRESH and b <= THRESH


# Seed from known window-sky samples
seeds = [(w // 2, 160), (w // 2, 180), (w // 2, 200), (400, 170), (600, 170)]
visited = [[False] * h for _ in range(w)]
mask = [[False] * h for _ in range(w)]
q = deque()

for sx, sy in seeds:
    if 0 <= sx < w and 0 <= sy < h and is_sky(sx, sy) and not visited[sx][sy]:
        visited[sx][sy] = True
        q.append((sx, sy))

while q:
    x, y = q.popleft()
    mask[x][y] = True
    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
        if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny] and is_sky(nx, ny):
            visited[nx][ny] = True
            q.append((nx, ny))

out = Image.new("RGBA", (w, h))
out_px = out.load()
transparent = 0
for y in range(h):
    for x in range(w):
        r, g, b = pixels[x, y]
        if mask[x][y]:
            out_px[x, y] = (0, 0, 0, 0)
            transparent += 1
        else:
            out_px[x, y] = (r, g, b, 255)

print(f"sky hole pixels: {transparent} ({100 * transparent / (w * h):.1f}%)")

# bbox of hole
xs = [x for x in range(w) for y in range(h) if mask[x][y]]
ys = [y for x in range(w) for y in range(h) if mask[x][y]]
if xs:
    print(
        f"hole bbox x={min(xs)}-{max(xs)} ({min(xs)/w:.0%}-{max(xs)/w:.0%}) "
        f"y={min(ys)}-{max(ys)} ({min(ys)/h:.0%}-{max(ys)/h:.0%})"
    )

dests = [
    Path(r"d:\Projects\Hillfolk\public\images\about-us.png"),
    Path(r"d:\Projects\Hillfolk\public\interiors\about-us.png"),
    Path(r"d:\Projects\Hillfolk\public\interiors\about-fg.png"),
]
for dest in dests:
    out.save(dest, format="PNG", compress_level=1, optimize=False)
    print(f"wrote {dest} ({dest.stat().st_size} bytes)")
