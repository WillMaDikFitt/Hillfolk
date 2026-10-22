from pathlib import Path

root = Path(__file__).resolve().parents[1]
html = (root / "index.html").read_text(encoding="utf-8")
pages = (root / "scripts" / "site_pages.html").read_text(encoding="utf-8")
start = html.index('<section class="page" id="about"')
end = html.index('<script type="module"')
(root / "index.html").write_text(
    html[:start] + pages.strip() + "\n\n    " + html[end:],
    encoding="utf-8",
)
print("spliced index.html")
