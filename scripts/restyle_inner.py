from pathlib import Path

css_path = Path(r"d:\Projects\Hillfolk\src\style.css")
css = css_path.read_text(encoding="utf-8")
idx = css.find("/* Inner pages")
if idx < 0:
    raise SystemExit("marker not found")

new = r"""/* Inner pages — same hill world as the fresco */
.page {
  position: fixed;
  inset: 0;
  z-index: 50;
  background:
    radial-gradient(ellipse 90% 40% at 50% -5%, rgba(185, 207, 220, 0.45), transparent 55%),
    radial-gradient(ellipse 70% 35% at 80% 100%, rgba(213, 228, 200, 0.35), transparent 50%),
    var(--paper);
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

.inv-bar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem clamp(1.25rem, 4vw, 2.5rem);
  background: color-mix(in srgb, var(--paper) 82%, transparent);
  border-bottom: 1px solid rgba(26, 43, 37, 0.08);
  backdrop-filter: blur(12px);
}

.inv-bar__close {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-soft);
  text-shadow: 0 1px 8px rgba(255, 255, 255, 0.5);
}

.inv-bar__close:hover {
  color: var(--forest);
}

.inv-bar__logo img {
  height: 1.45rem;
  width: auto;
}

.inv {
  width: min(100%, 68rem);
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 4vw, 2.5rem) 3rem;
}

.inv-intro {
  padding: 1.35rem 0 1.75rem;
}

.inv-kicker {
  margin: 0 0 0.55rem;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
}

.inv-h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6.5vw, 4.25rem);
  font-weight: 400;
  line-height: 0.98;
  letter-spacing: -0.03em;
  color: var(--forest);
  max-width: 16ch;
}

.inv-sub {
  margin: 0.7rem 0 0;
  font-size: 1.05rem;
  line-height: 1.45;
  color: var(--ink-soft);
  max-width: 40ch;
}

.inv-spread {
  display: grid;
  gap: 0.65rem 2rem;
  padding: 1.35rem 0;
  border-top: 1px solid rgba(26, 43, 37, 0.1);
}

@media (min-width: 800px) {
  .inv-spread {
    grid-template-columns: 5.5rem minmax(0, 1fr);
  }
}

.inv-rail {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
  padding-top: 0.25rem;
}

.inv-h2 {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 1.95rem);
  font-weight: 400;
  line-height: 1.18;
  letter-spacing: -0.02em;
  max-width: 28ch;
  color: var(--forest);
}

.inv-lines {
  margin: 0 0 0.9rem;
  padding: 0;
  list-style: none;
}

.inv-lines li {
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  line-height: 1.4;
  color: var(--ink);
}

.inv-note {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.55;
  color: var(--ink-soft);
  max-width: 48ch;
}

.inv-note span {
  color: var(--forest);
  font-weight: 600;
}

.inv-note em {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  color: var(--forest);
}

.inv-note--wide {
  max-width: 52ch;
  margin-top: 1rem;
}

.inv-words {
  margin: 0 0 0.85rem;
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  line-height: 1.45;
  color: var(--forest);
}

.inv-words i {
  font-style: normal;
  color: var(--gold-soft);
  margin: 0 0.35rem;
}

.inv-cols {
  display: grid;
  gap: 1rem 2rem;
  max-width: 54rem;
}

@media (min-width: 720px) {
  .inv-cols {
    grid-template-columns: 1fr 1fr;
  }
}

.inv-cols p {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.55;
  color: var(--ink-soft);
}

.inv-manifesto {
  padding: 1.75rem 0;
  border-top: 1px solid rgba(26, 43, 37, 0.1);
}

.inv-manifesto__a,
.inv-manifesto__b {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.85rem, 4.5vw, 3rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.inv-manifesto__a {
  color: var(--forest);
}

.inv-manifesto__b {
  color: var(--gold);
}

.inv-end {
  padding: 1.5rem 0 0;
  border-top: 1px solid rgba(26, 43, 37, 0.1);
  max-width: 36ch;
}

.inv-end__line {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.5vw, 1.65rem);
  line-height: 1.25;
  color: var(--forest);
}

.inv-end__tag {
  margin: 0.65rem 0 0;
  font-size: 0.9rem;
  color: var(--gold);
}

.inv-list {
  border-top: 1px solid rgba(26, 43, 37, 0.1);
}

.inv-list__row {
  display: grid;
  gap: 0.25rem 2rem;
  padding: 0.95rem 0;
  border-bottom: 1px solid rgba(26, 43, 37, 0.08);
}

@media (min-width: 720px) {
  .inv-list__row {
    grid-template-columns: minmax(10rem, 0.38fr) minmax(0, 1fr);
    align-items: baseline;
    padding: 1.05rem 0;
  }
}

.inv-list__row h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.2vw, 1.5rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--forest);
}

.inv-list__row p {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.45;
  color: var(--ink-soft);
}

.inv-links {
  display: grid;
  gap: 0;
  border-top: 1px solid rgba(26, 43, 37, 0.1);
  max-width: 40rem;
}

.inv-links__item {
  display: grid;
  gap: 0.2rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(26, 43, 37, 0.08);
  text-decoration: none;
  color: inherit;
  transition: color 0.2s ease;
}

.inv-links__item:hover strong {
  color: var(--leaf);
}

.inv-links__item span {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
}

.inv-links__item strong {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.5vw, 1.55rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--forest);
  transition: color 0.2s ease;
}

.inv-cafe {
  padding-top: 0.25rem;
}

.inv-cafe__tag {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--gold);
}

@media (prefers-reduced-motion: no-preference) {
  .page.is-open .inv-intro,
  .page.is-open .inv-spread,
  .page.is-open .inv-manifesto,
  .page.is-open .inv-end,
  .page.is-open .inv-list,
  .page.is-open .inv-links,
  .page.is-open .inv-cafe {
    animation: inv-in 0.65s var(--ease) both;
  }

  .page.is-open .inv-spread:nth-of-type(1) { animation-delay: 0.04s; }
  .page.is-open .inv-spread:nth-of-type(2) { animation-delay: 0.08s; }
  .page.is-open .inv-manifesto { animation-delay: 0.1s; }
  .page.is-open .inv-end { animation-delay: 0.12s; }
}

@keyframes inv-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
"""

css_path.write_text(css[:idx] + new, encoding="utf-8")
print("css ok")
