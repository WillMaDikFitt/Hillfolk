from pathlib import Path

root = Path(__file__).resolve().parents[1]
css_path = root / "src" / "style.css"
css = css_path.read_text(encoding="utf-8")
idx = css.find("/* Inner pages")
if idx < 0:
    raise SystemExit("marker missing")

# Also patch fresco leaving -> reading style if needed
if ".fresco.is-reading" not in css:
    css = css.replace(
        """.fresco.is-leaving {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s var(--ease);
}""",
        """.fresco.is-leaving {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s var(--ease);
}

.fresco.is-reading {
  pointer-events: none;
  filter: saturate(0.92) brightness(0.88);
  transition: filter 0.45s var(--ease);
}""",
    )

new = r"""/* Inner pages — sheet over the live hill */
.page {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 0.35s var(--ease),
    visibility 0.35s;
}

.page.is-open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.page__dim {
  position: absolute;
  inset: 0;
  border: 0;
  padding: 0;
  background: rgba(20, 38, 28, 0.18);
  cursor: pointer;
}

.sheet {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: min(100%, 28.5rem);
  height: 100%;
  background: rgba(247, 244, 239, 0.94);
  border-left: 1px solid rgba(26, 43, 37, 0.08);
  box-shadow: -18px 0 50px rgba(20, 38, 28, 0.14);
  backdrop-filter: blur(14px);
  transform: translateX(12px);
  transition: transform 0.45s var(--ease);
}

.page.is-open .sheet {
  transform: none;
}

.sheet__bar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(26, 43, 37, 0.08);
}

.sheet__close {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.sheet__close:hover {
  color: var(--forest);
}

.sheet__logo {
  height: 1.35rem;
  width: auto;
}

.sheet__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1.35rem 1.25rem 2.5rem;
  -webkit-overflow-scrolling: touch;
}

.sheet__kicker {
  margin: 0 0 0.45rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
}

.sheet__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.1rem, 5vw, 2.65rem);
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: -0.025em;
  color: var(--forest);
}

.sheet__lead {
  margin: 0.65rem 0 1.35rem;
  font-size: 1rem;
  line-height: 1.45;
  color: var(--ink-soft);
}

.sheet__h {
  margin: 1.35rem 0 0.55rem;
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 400;
  line-height: 1.2;
  color: var(--forest);
}

.sheet__list {
  margin: 0 0 0.75rem;
  padding: 0;
  list-style: none;
}

.sheet__list li {
  margin: 0 0 0.3rem;
  font-size: 1rem;
  line-height: 1.4;
  color: var(--ink);
}

.sheet__p {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--ink-soft);
}

.sheet__p strong {
  color: var(--forest);
  font-weight: 600;
}

.sheet__p em {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--forest);
}

.sheet__meta {
  margin: 0 0 0.65rem;
  font-family: var(--font-display);
  font-size: 1.05rem;
  color: var(--forest);
}

.sheet__callout {
  margin: 1.35rem 0;
  padding: 1.1rem 1rem;
  background: var(--forest);
  color: var(--cream);
}

.sheet__callout h2 {
  margin: 0 0 0.55rem;
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 400;
  line-height: 1.15;
}

.sheet__callout h2 span {
  color: var(--gold-soft);
}

.sheet__callout p {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  color: rgba(244, 241, 234, 0.8);
}

.sheet__pull {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-style: italic;
  line-height: 1.25;
  color: var(--forest);
}

.sheet__end {
  margin: 1.5rem 0 0;
  font-family: var(--font-display);
  font-size: 1.2rem;
  line-height: 1.25;
  color: var(--forest);
}

.sheet__tag {
  margin: 0.5rem 0 0;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 0.98rem;
  color: var(--gold);
}

.sheet__services {
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
}

.sheet__services li {
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(26, 43, 37, 0.08);
}

.sheet__services li:last-child {
  border-bottom: 0;
}

.sheet__services h2 {
  margin: 0 0 0.25rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--forest);
}

.sheet__services p {
  margin: 0;
  font-size: 0.92rem;
  color: var(--ink-soft);
}

.sheet__contacts {
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
}

.sheet__contacts li {
  display: grid;
  gap: 0.2rem;
  margin-bottom: 1rem;
}

.sheet__contacts span {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
}

.sheet__contacts a {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--forest);
  text-decoration: none;
}

.sheet__contacts a:hover {
  color: var(--leaf);
}

@media (max-width: 720px) {
  .page {
    align-items: flex-end;
  }

  .sheet {
    width: 100%;
    height: min(88dvh, 100%);
    border-left: 0;
    border-top: 1px solid rgba(26, 43, 37, 0.08);
    border-radius: 12px 12px 0 0;
    box-shadow: 0 -16px 40px rgba(20, 38, 28, 0.16);
    transform: translateY(16px);
  }

  .page.is-open .sheet {
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sheet {
    transition: none;
  }
}
"""

css_path.write_text(css[:idx] + new if "/* Inner pages" in css[idx:idx+20] else css[:idx] + new, encoding="utf-8")
# Re-read and write properly - the replace for is-reading was on css before slicing
# Fix: apply is-reading to the head portion
head = css[:idx]
if ".fresco.is-reading" not in head:
    head = head.replace(
        """.fresco.is-leaving {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s var(--ease);
}""",
        """.fresco.is-leaving {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s var(--ease);
}

.fresco.is-reading {
  pointer-events: none;
  filter: saturate(0.92) brightness(0.88);
  transition: filter 0.45s var(--ease);
}""",
    )
css_path.write_text(head + new, encoding="utf-8")
print("css ok")
