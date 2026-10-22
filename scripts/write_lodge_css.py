from pathlib import Path

css_path = Path(__file__).resolve().parents[1] / "src" / "style.css"
css = css_path.read_text(encoding="utf-8")
idx = css.find("/* Inner pages")
if idx < 0:
    raise SystemExit("marker missing")

new = r"""/* Inner pages — still on the hill */
.page {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: #c8d8e4;
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

.page__sky {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.page__sky-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 55% 35%;
  transform: scale(1.08);
  filter: saturate(0.95) brightness(0.92);
}

.page__sky-mist {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(200, 220, 232, 0.35) 0%, rgba(244, 241, 234, 0.55) 38%, rgba(244, 241, 234, 0.88) 72%, var(--cream) 100%),
    radial-gradient(ellipse 70% 45% at 70% 20%, rgba(255, 255, 255, 0.35), transparent 60%);
}

.page__scroll {
  position: relative;
  z-index: 1;
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.lodge-bar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem clamp(1.15rem, 3.5vw, 2.25rem);
  background: rgba(244, 241, 234, 0.72);
  border-bottom: 1px solid rgba(26, 43, 37, 0.08);
  backdrop-filter: blur(14px);
}

.lodge-bar__back {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-soft);
  text-shadow: 0 1px 8px rgba(255, 255, 255, 0.55);
}

.lodge-bar__back:hover {
  color: var(--forest);
}

.lodge-bar__logo img {
  height: 1.5rem;
  width: auto;
  filter: drop-shadow(0 1px 10px rgba(255, 255, 255, 0.45));
}

.lodge {
  width: min(100%, 58rem);
  margin: 0 auto;
  padding: 0 clamp(1.15rem, 3.5vw, 2.25rem) 2.75rem;
}

.lodge-hero {
  padding: clamp(1.75rem, 5vh, 3rem) 0 1.5rem;
}

.lodge-kicker {
  margin: 0 0 0.55rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
  text-shadow: 0 1px 10px rgba(255, 255, 255, 0.5);
}

.lodge-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 7vw, 4.4rem);
  font-weight: 400;
  line-height: 0.96;
  letter-spacing: -0.03em;
  color: var(--forest);
  text-shadow: 0 2px 28px rgba(255, 255, 255, 0.55);
  max-width: 14ch;
}

.lodge-tag {
  margin: 0.75rem 0 0;
  font-size: 1.05rem;
  line-height: 1.45;
  color: var(--ink-soft);
  max-width: 36ch;
}

.lodge-board {
  display: grid;
  gap: 0.85rem;
}

.lodge-card {
  padding: 1.25rem 1.3rem 1.35rem;
  background: rgba(247, 244, 239, 0.86);
  border: 1px solid rgba(26, 43, 37, 0.08);
  border-radius: 4px;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.65) inset,
    0 10px 30px rgba(26, 43, 37, 0.06);
  backdrop-filter: blur(10px);
}

.lodge-card--deep {
  background:
    linear-gradient(155deg, rgba(26, 50, 38, 0.94), rgba(20, 38, 28, 0.97));
  border-color: rgba(20, 38, 28, 0.4);
  color: var(--cream);
  box-shadow: 0 14px 36px rgba(20, 38, 28, 0.22);
}

.lodge-card--quote {
  background:
    linear-gradient(160deg, rgba(247, 244, 239, 0.7), rgba(232, 239, 228, 0.82));
}

.lodge-card--row {
  display: grid;
  gap: 0.35rem 1.5rem;
}

@media (min-width: 700px) {
  .lodge-card--row {
    grid-template-columns: minmax(10rem, 0.42fr) minmax(0, 1fr);
    align-items: baseline;
  }
}

.lodge-bullets {
  margin: 0 0 0.85rem;
  padding: 0;
  list-style: none;
}

.lodge-bullets li {
  position: relative;
  padding-left: 0.95rem;
  margin-bottom: 0.35rem;
  font-size: 1.05rem;
  line-height: 1.4;
  color: var(--ink);
}

.lodge-bullets li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--gold-soft);
}

.lodge-h2 {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2.8vw, 1.85rem);
  font-weight: 400;
  line-height: 1.18;
  color: var(--forest);
}

.lodge-card--row .lodge-h2 {
  margin-bottom: 0;
}

.lodge-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 0 0 0.9rem;
}

.lodge-chips span {
  padding: 0.35rem 0.7rem;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--forest);
  background: rgba(216, 224, 212, 0.55);
  border: 1px solid rgba(63, 107, 69, 0.18);
  border-radius: 3px;
}

.lodge-copy {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.55;
  color: var(--ink-soft);
}

.lodge-copy strong {
  color: var(--forest);
  font-weight: 600;
}

.lodge-copy em {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--gold-soft);
}

.lodge-copy--on-deep {
  color: rgba(244, 241, 234, 0.78);
  max-width: 48ch;
}

.lodge-copy--on-deep em {
  color: var(--gold-soft);
}

.lodge-display {
  margin: 0 0 0.9rem;
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 4vw, 2.5rem);
  font-weight: 400;
  line-height: 1.05;
  color: var(--cream);
}

.lodge-display em {
  font-style: italic;
  color: var(--gold-soft);
}

.lodge-split {
  display: grid;
  gap: 0.9rem 1.5rem;
}

@media (min-width: 700px) {
  .lodge-split {
    grid-template-columns: 1fr 1fr;
  }
}

.lodge-quote {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3vw, 1.85rem);
  line-height: 1.2;
  color: var(--forest);
}

.lodge-card--quote .lodge-tag {
  margin-top: 0.75rem;
  font-family: var(--font-display);
  font-style: italic;
  color: var(--gold);
}

.lodge-contacts {
  display: grid;
  gap: 0.85rem;
}

.lodge-contact {
  display: grid;
  gap: 0.2rem;
  text-decoration: none;
  color: inherit;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid rgba(26, 43, 37, 0.1);
}

.lodge-contact:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.lodge-contact span {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
}

.lodge-contact strong {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.4vw, 1.55rem);
  font-weight: 400;
  color: var(--forest);
}

.lodge-contact:hover strong {
  color: var(--leaf);
}

@media (prefers-reduced-motion: no-preference) {
  .page.is-open .lodge-hero {
    animation: lodge-in 0.7s var(--ease) both;
  }

  .page.is-open .lodge-card {
    animation: lodge-in 0.65s var(--ease) both;
  }

  .page.is-open .lodge-card:nth-child(1) { animation-delay: 0.05s; }
  .page.is-open .lodge-card:nth-child(2) { animation-delay: 0.09s; }
  .page.is-open .lodge-card:nth-child(3) { animation-delay: 0.13s; }
  .page.is-open .lodge-card:nth-child(4) { animation-delay: 0.17s; }
  .page.is-open .lodge-card:nth-child(5) { animation-delay: 0.21s; }
}

@keyframes lodge-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
"""

css_path.write_text(css[:idx] + new, encoding="utf-8")
print("css ok")
