from pathlib import Path

root = Path(__file__).resolve().parents[1]
css_path = root / "src" / "style.css"
css = css_path.read_text(encoding="utf-8")
idx = css.find("/* Inner pages")
if idx < 0:
    raise SystemExit("marker missing")

new = r"""/* Inner pages — gate over the live hillside */
.fresco.is-dimmed {
  opacity: 1;
  pointer-events: none;
  filter: brightness(0.92) saturate(0.95);
  transition: filter 0.5s var(--ease);
}

.fresco.is-leaving {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s var(--ease);
}

.page {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: end center;
  padding: 0;
  background: transparent;
  color: var(--ink);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.4s var(--ease),
    visibility 0.4s;
}

.page.is-open {
  opacity: 1;
  visibility: visible;
}

.gate__scrim {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(
    180deg,
    rgba(20, 38, 28, 0.15) 0%,
    rgba(20, 38, 28, 0.28) 45%,
    rgba(20, 38, 28, 0.45) 100%
  );
  cursor: pointer;
  border: 0;
  padding: 0;
}

.gate {
  position: relative;
  z-index: 1;
  width: min(100%, 34rem);
  max-height: min(88dvh, 52rem);
  display: flex;
  flex-direction: column;
  margin: 0 clamp(0.75rem, 3vw, 1.5rem) clamp(0.75rem, 3vw, 1.5rem);
  background: rgba(247, 244, 239, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.7) inset,
    0 24px 60px rgba(20, 38, 28, 0.28);
  backdrop-filter: blur(18px);
  transform: translateY(18px);
  transition: transform 0.5s var(--ease);
}

.page.is-open .gate {
  transform: none;
}

@media (min-width: 720px) {
  .page {
    place-items: center end;
  }

  .gate {
    width: min(100%, 28rem);
    max-height: min(90dvh, 56rem);
    margin: clamp(1rem, 3vh, 2rem) clamp(1.25rem, 4vw, 3rem);
  }
}

.gate__bar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.95rem 1.15rem;
  border-bottom: 1px solid rgba(26, 43, 37, 0.08);
}

.gate__back {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.gate__back:hover {
  color: var(--forest);
}

.gate__logo img {
  height: 1.35rem;
  width: auto;
}

.gate__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1.25rem 1.25rem 1.75rem;
  -webkit-overflow-scrolling: touch;
}

.gate__kicker {
  margin: 0 0 0.45rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
}

.gate__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 2.65rem);
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: var(--forest);
}

.gate__lead {
  margin: 0.55rem 0 0;
  font-size: 1rem;
  line-height: 1.45;
  color: var(--ink-soft);
}

.gate__rule {
  height: 1px;
  margin: 1.15rem 0;
  background: rgba(26, 43, 37, 0.1);
}

.gate__h {
  margin: 0 0 0.55rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.2;
  color: var(--forest);
}

.gate__list {
  margin: 0 0 0.75rem;
  padding: 0;
  list-style: none;
}

.gate__list li {
  margin: 0 0 0.25rem;
  font-size: 0.98rem;
  line-height: 1.4;
  color: var(--ink);
}

.gate__p {
  margin: 0 0 1rem;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--ink-soft);
}

.gate__p strong {
  color: var(--forest);
  font-weight: 600;
}

.gate__p em {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--forest);
}

.gate__meta {
  margin: 0 0 0.55rem;
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--forest);
}

.gate__feature {
  margin: 0.25rem 0 1.15rem;
  padding: 1rem 1rem 1.05rem;
  background: var(--forest);
  color: var(--cream);
}

.gate__feature-title {
  margin: 0 0 0.5rem;
  font-family: var(--font-display);
  font-size: 1.35rem;
  line-height: 1.15;
  color: var(--cream);
}

.gate__feature-title span {
  color: var(--gold-soft);
}

.gate__feature .gate__p {
  margin: 0;
  color: rgba(244, 241, 234, 0.8);
}

.gate__pull {
  margin: 0 0 0.65rem;
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-style: italic;
  line-height: 1.25;
  color: var(--forest);
}

.gate__end {
  margin: 1.15rem 0 0;
  font-family: var(--font-display);
  font-size: 1.2rem;
  line-height: 1.25;
  color: var(--forest);
}

.gate__tag {
  margin: 0.45rem 0 0;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 0.98rem;
  color: var(--gold);
}

.gate__services {
  margin: 0;
  padding: 0;
  list-style: none;
}

.gate__services li {
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(26, 43, 37, 0.08);
}

.gate__services li:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.gate__services h2 {
  margin: 0 0 0.2rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--forest);
}

.gate__services p {
  margin: 0;
  font-size: 0.92rem;
  color: var(--ink-soft);
}

.gate__contacts {
  margin: 0;
  padding: 0;
  list-style: none;
}

.gate__contacts li {
  display: grid;
  gap: 0.2rem;
  margin: 0 0 0.9rem;
}

.gate__contacts span {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
}

.gate__contacts a {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--forest);
  text-decoration: none;
}

.gate__contacts a:hover {
  color: var(--leaf);
}

@media (prefers-reduced-motion: reduce) {
  .gate {
    transition: none;
  }
}
"""

css_path.write_text(css[:idx] + new, encoding="utf-8")
print("css ok")
