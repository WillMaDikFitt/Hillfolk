from pathlib import Path

root = Path(__file__).resolve().parents[1]
css_path = root / "src" / "style.css"
css = css_path.read_text(encoding="utf-8")

# Nudge home logo more left + down
old_mark = """.fresco__mark {
  position: absolute;
  z-index: 6;
  right: clamp(3rem, 9vw, 7rem);
  top: clamp(6.5rem, 19vh, 10.5rem);"""
new_mark = """.fresco__mark {
  position: absolute;
  z-index: 6;
  right: clamp(5.5rem, 15vw, 12rem);
  top: clamp(9rem, 28vh, 15rem);"""
if old_mark not in css:
    raise SystemExit("fresco__mark block not found")
css = css.replace(old_mark, new_mark)

# Replace mobile mark inset too
css = css.replace(
    """@media (max-width: 720px) {
  .fresco__mark {
    width: clamp(7rem, 34vw, 10rem);
    top: auto;
    bottom: 1rem;
    right: clamp(2rem, 8vw, 3rem);
  }
}""",
    """@media (max-width: 720px) {
  .fresco__mark {
    width: clamp(7rem, 34vw, 10rem);
    top: auto;
    bottom: 0.65rem;
    right: clamp(3.5rem, 12vw, 5rem);
  }
}""",
)

inner = r'''/* Inner pages — editorial sheet */
.page {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: var(--paper);
  color: var(--ink);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.45s var(--ease),
    visibility 0.45s;
}

.page.is-open {
  opacity: 1;
  visibility: visible;
}

.page__scroll {
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.sheet {
  min-height: 100%;
  background:
    radial-gradient(ellipse 70% 40% at 100% 0%, rgba(216, 224, 212, 0.35), transparent 55%),
    var(--paper);
}

.sheet-nav {
  position: sticky;
  top: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.95rem clamp(1.25rem, 5vw, 4rem);
  background: rgba(247, 244, 239, 0.9);
  border-bottom: 1px solid rgba(26, 36, 33, 0.07);
  backdrop-filter: blur(10px);
}

.sheet-nav__back {
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  color: var(--ink-soft);
}

.sheet-nav__back:hover {
  color: var(--ink);
}

.sheet-nav__logo img {
  display: block;
  height: 1.45rem;
  width: auto;
}

.sheet-pad {
  width: min(100%, 78rem);
  margin: 0;
  padding: clamp(2.25rem, 6vw, 4.5rem) clamp(1.25rem, 5vw, 4rem) clamp(4.5rem, 12vw, 7rem);
}

.sheet-hero {
  max-width: 38rem;
  margin-bottom: clamp(3rem, 8vw, 5.5rem);
  padding-bottom: clamp(2rem, 5vw, 3rem);
}

.sheet-kicker {
  margin: 0 0 1rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--leaf);
}

.sheet-kicker--soft {
  color: rgba(244, 241, 234, 0.55);
}

.sheet-display {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.85rem, 7.5vw, 5rem);
  font-weight: 400;
  line-height: 0.96;
  letter-spacing: -0.025em;
  color: var(--forest);
}

.sheet-tag {
  margin: 1.15rem 0 0;
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2.4vw, 1.45rem);
  font-style: italic;
  color: var(--gold);
}

.sheet-rule {
  display: block;
  width: 2.75rem;
  height: 1px;
  margin: 1.35rem 0 0;
  background: var(--gold-soft);
}

.sheet-rule--sm {
  width: 1.75rem;
  margin: 0.85rem 0;
}

.sheet-intro {
  margin: 1.5rem 0 0;
  max-width: 28rem;
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--ink-soft);
}

.sheet-block {
  margin-bottom: clamp(3rem, 7vw, 5rem);
  padding-top: clamp(0.5rem, 2vw, 1rem);
  border-top: 1px solid rgba(26, 36, 33, 0.09);
}

.sheet-block--flush {
  border-top: 0;
  padding-top: 0;
}

.sheet-block--invert {
  margin-left: clamp(-1.25rem, -5vw, -4rem);
  margin-right: clamp(-1.25rem, -5vw, -4rem);
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 5vw, 4rem);
  background: var(--forest);
  color: var(--paper);
  border-top: 0;
}

.sheet-duo {
  display: grid;
  gap: clamp(1.75rem, 4vw, 3rem);
  margin-top: 1.25rem;
  align-items: start;
}

@media (min-width: 720px) {
  .sheet-duo {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: clamp(2.5rem, 8vw, 6rem);
  }
}

.sheet-bullets {
  margin: 0;
  padding: 0;
  list-style: none;
}

.sheet-bullets li {
  margin: 0 0 0.85rem;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.5vw, 1.55rem);
  line-height: 1.25;
  color: var(--forest);
}

.sheet-aside {
  padding-top: 0.2rem;
  border-left: 1px solid var(--gold-soft);
  padding-left: 1.25rem;
}

.sheet-aside p {
  margin: 0 0 0.55rem;
  font-size: 1rem;
  line-height: 1.55;
  color: var(--ink-soft);
}

.sheet-aside__em {
  font-weight: 600;
  color: var(--ink) !important;
}

.sheet-h2 {
  margin: 0.35rem 0 1.75rem;
  max-width: 18ch;
  font-family: var(--font-display);
  font-size: clamp(1.55rem, 3.5vw, 2.25rem);
  font-weight: 400;
  line-height: 1.15;
  color: var(--forest);
}

.sheet-h2--soft {
  color: var(--paper);
  max-width: 22ch;
}

.sheet-h2--soft em {
  font-style: italic;
  color: var(--gold-soft);
}

.sheet-pillars {
  display: grid;
  gap: 1.25rem 0;
  margin: 0 0 2rem;
}

@media (min-width: 700px) {
  .sheet-pillars {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .sheet-pillars > div {
    padding: 0 1.25rem;
    border-left: 1px solid rgba(163, 134, 92, 0.35);
  }

  .sheet-pillars > div:first-child {
    padding-left: 0;
    border-left: 0;
  }
}

.sheet-pillars h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  font-weight: 400;
  line-height: 1.3;
  color: var(--forest);
}

.sheet-note {
  margin: 0;
  max-width: 28rem;
  font-size: 1.05rem;
  line-height: 1.55;
  color: var(--ink-soft);
}

.sheet-note strong {
  display: inline;
  color: var(--ink);
  font-weight: 600;
}

.sheet-note--invert {
  margin-top: 1.75rem;
  color: rgba(244, 241, 234, 0.7);
}

.sheet-note--invert em {
  display: block;
  margin-top: 0.35rem;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.15rem;
  color: var(--gold-soft);
}

.sheet-lead-invert {
  margin: 1rem 0 0.65rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--paper);
}

.sheet-copy-invert {
  margin: 0;
  max-width: 34rem;
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(244, 241, 234, 0.72);
}

.sheet-quote {
  margin: 0.5rem 0 1.5rem;
  padding: 0;
  border: 0;
  max-width: 18ch;
  font-family: var(--font-display);
  font-size: clamp(1.55rem, 3.5vw, 2.15rem);
  font-style: italic;
  line-height: 1.2;
  color: var(--forest);
}

.sheet-quote--lg {
  max-width: 22ch;
  font-size: clamp(1.65rem, 4vw, 2.5rem);
}

.sheet-prose {
  max-width: 38rem;
  display: grid;
  gap: 1rem;
}

.sheet-prose p {
  margin: 0;
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--ink-soft);
}

.sheet-prose strong {
  color: var(--ink);
  font-weight: 600;
}

.sheet-close {
  margin-top: clamp(1rem, 4vw, 2rem);
  padding-top: clamp(2rem, 5vw, 3rem);
  border-top: 1px solid rgba(26, 36, 33, 0.09);
}

.sheet-close__quote {
  margin: 0;
  max-width: 16ch;
  font-family: var(--font-display);
  font-size: clamp(1.45rem, 3.2vw, 2rem);
  line-height: 1.2;
  color: var(--forest);
}

.sheet-close__tag {
  margin: 1.1rem 0 0;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
}

.sheet-services {
  display: grid;
  gap: 0;
  border-top: 1px solid rgba(26, 36, 33, 0.09);
}

@media (min-width: 820px) {
  .sheet-services {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

.sheet-service {
  padding: 1.5rem 0 1.75rem;
  border-bottom: 1px solid rgba(26, 36, 33, 0.09);
}

@media (min-width: 820px) {
  .sheet-service {
    padding: 1.75rem 1.15rem 2rem;
    border-bottom: 0;
    border-right: 1px solid rgba(26, 36, 33, 0.09);
  }

  .sheet-service:first-child {
    padding-left: 0;
  }

  .sheet-service:last-child {
    padding-right: 0;
    border-right: 0;
  }
}

.sheet-service h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.2;
  color: var(--forest);
}

.sheet-service p {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--ink-soft);
}

.sheet-contact {
  display: grid;
  gap: 0;
  max-width: 34rem;
  border-top: 1px solid rgba(26, 36, 33, 0.09);
}

.sheet-contact__row {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  gap: 1rem;
  align-items: baseline;
  padding: 1.35rem 0;
  border-bottom: 1px solid rgba(26, 36, 33, 0.09);
  text-decoration: none;
  color: inherit;
}

.sheet-contact__label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--leaf);
}

.sheet-contact__value {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.5vw, 1.55rem);
  color: var(--forest);
}

.sheet-contact__row:hover .sheet-contact__value {
  color: var(--leaf);
}
'''

idx = css.find("/* Inner pages")
if idx < 0:
    raise SystemExit("inner pages marker missing")
css_path.write_text(css[:idx] + inner, encoding="utf-8")
print("css updated")
