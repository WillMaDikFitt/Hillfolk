from playwright.sync_api import sync_playwright
from pathlib import Path

out = Path(r"d:\Projects\Hillfolk\public\scene")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:5174/", wait_until="networkidle")
    page.wait_for_selector(".fresco.is-ready")
    page.wait_for_timeout(2000)
    page.screenshot(path=str(out / "_review-desktop.png"), full_page=False)

    page.locator('.spot[data-id="about"] .spot__hit').click(force=True)
    page.wait_for_timeout(1000)
    about_open = page.evaluate(
        "() => document.getElementById('about')?.classList.contains('is-open')"
    )
    print("about_open", about_open)
    page.screenshot(path=str(out / "_review-about.png"), full_page=False)

    if about_open:
        page.locator("#about-back").click()
        page.wait_for_timeout(900)

    page.set_viewport_size({"width": 390, "height": 844})
    page.wait_for_timeout(700)
    page.screenshot(path=str(out / "_review-mobile.png"), full_page=False)
    browser.close()

print("done")
