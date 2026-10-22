from pathlib import Path

css_path = Path(__file__).resolve().parents[1] / "src" / "style.css"
css = css_path.read_text(encoding="utf-8")
idx = css.find("/* Inner pages")
if idx < 0:
    raise SystemExit("marker missing")

new = r"""/* Inner pages — trail through the hill */
.page {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: #b9cfdc;
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
  height: 120%;
  object-fit: cover;
  object-position: 58% 28%;
  transform: scale(1.12);
  filter: saturate(1.05) contrast(1.02);
  will-change: transform;
}

.page__sky-mist {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(185, 207, 220, 0.2) 0%, rgba(244, 241, 234, 0.28) 32%, rgba(244, 241, 234, 0.78) 68%, #efebe3 100%),
    radial-gradient(ellipse 55% 40% at 80% 18%, rgba(255, 255, 255, 0.4), transparent 55%);
}

.page__ghost {
  position: absolute;
  left: 50%;
  top: 18%;
  margin: 0;
  transform: translate3d(-50%, -40%, 0);
  font-family: var(--font-display);
  font-size: clamp(5rem, 18vw, 14rem);
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 0.85;
  color: rgba(20, 38, 28, 0.06);
  white-space: nowrap;
  user-select: none;
  will-change: transform;
}

.page__scroll {
  position: relative;
  z-index: 1;
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.trail-bar {
  position: sticky;
  top: 0;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.95rem clamp(1rem, 3vw, 2rem);
  background: rgba(244, 241, 234, 0.55);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(26, 43, 37, 0.06);
}

.trail-bar__back {
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--ink-soft);
}

.trail-bar__back:hover {
  color: var(--forest);
}

.trail-bar__logo img {
  height: 1.45rem;
  width: auto;
  filter: drop-shadow(0 2px 12px rgba(255, 255, 255, 0.5));
}

.trail {
  width: min(100%, 64rem);
  margin: 0 auto;
  padding: 0 clamp(1rem, 3vw, 2rem) 3rem;
}

.trail-hero {
  position: relative;
  padding: clamp(2rem, 7vh, 4rem) 0 1.75rem;
  min-height: clamp(12rem, 34vh, 20rem);
}

.trail-hero__mark {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
}

.trail-hero__mark i {
  width: 2rem;
  height: 1px;
  background: var(--gold-soft);
}

.trail-hero__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(3rem, 9vw, 5.5rem);
  font-weight: 400;
  line-height: 0.92;
  letter-spacing: -0.035em;
  color: var(--forest);
  text-shadow: 0 4px 40px rgba(255, 255, 255, 0.45);
}

.trail-hero__title span {
  font-style: italic;
}

.trail-hero__tag {
  margin: 1rem 0 0;
  max-width: 22ch;
  font-size: 1.1rem;
  color: var(--ink-soft);
}

.trail-hero__float {
  position: absolute;
  right: 0;
  bottom: 2rem;
  display: none;
  flex-direction: column;
  gap: 0.55rem;
  align-items: flex-end;
}

@media (min-width: 800px) {
  .trail-hero__float {
    display: flex;
  }
}

.trail-hero__float span {
  padding: 0.4rem 0.75rem;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--forest);
  background: rgba(247, 244, 239, 0.7);
  border: 1px solid rgba(26, 43, 37, 0.1);
  backdrop-filter: blur(8px);
  transform: rotate(-2deg);
}

.trail-hero__float span:last-child {
  transform: rotate(2deg);
}

.trail-mosaic {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 1fr;
}

@media (min-width: 760px) {
  .trail-mosaic {
    grid-template-columns: 1.25fr 0.85fr;
    grid-auto-flow: dense;
  }

  .trail-tile--wide {
    grid-column: 1 / -1;
  }

  .trail-tile--span {
    grid-column: 1 / -1;
  }
}

.trail-mosaic--tight {
  margin-top: 0.75rem;
}

.trail-tile {
  position: relative;
  padding: 1.2rem 1.25rem 1.35rem;
  background: rgba(247, 244, 239, 0.78);
  border: 1px solid rgba(26, 43, 37, 0.08);
  box-shadow: 0 12px 36px rgba(26, 43, 37, 0.07);
  backdrop-filter: blur(12px);
  transform: rotate(-0.35deg);
}

.trail-tile:nth-child(even) {
  transform: rotate(0.45deg);
}

.trail-tile--accent {
  background: linear-gradient(160deg, rgba(63, 107, 69, 0.92), rgba(20, 38, 28, 0.96));
  color: var(--cream);
  transform: rotate(1deg);
}

.trail-tile--quote {
  background: rgba(247, 244, 239, 0.88);
  transform: rotate(-1deg);
}

.trail-tile--link {
  text-decoration: none;
  color: inherit;
  transition: transform 0.25s var(--ease), box-shadow 0.25s;
}

.trail-tile--link:hover {
  transform: translateY(-3px) rotate(0deg);
  box-shadow: 0 18px 40px rgba(26, 43, 37, 0.12);
}

.trail-tile--link strong {
  display: block;
  margin-top: 0.45rem;
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.5vw, 1.7rem);
  font-weight: 400;
  color: var(--forest);
}

.trail-label {
  margin: 0 0 0.7rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
}

.trail-tile--accent .trail-label {
  color: var(--gold-soft);
}

.trail-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.trail-list li {
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2.3vw, 1.45rem);
  line-height: 1.35;
  color: var(--forest);
}

.trail-blurb {
  margin: 0 0 0.65rem;
  font-size: 1rem;
  line-height: 1.5;
  color: rgba(244, 241, 234, 0.82);
}

.trail-blurb--strong {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.35rem;
  line-height: 1.25;
  color: var(--cream);
}

.trail-h2 {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.4vw, 2.2rem);
  font-weight: 400;
  line-height: 1.15;
  color: var(--forest);
  max-width: 22ch;
}

.trail-orbit {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem 0.75rem;
  margin: 0 0 1rem;
}

.trail-orbit span {
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2.2vw, 1.4rem);
  color: var(--forest);
  opacity: 0.9;
  transform: translateY(calc(var(--i) * 2px)) rotate(calc((var(--i) - 1.5) * 1.2deg));
}

.trail-orbit span::after {
  content: " ·";
  color: var(--gold-soft);
}

.trail-orbit span:last-child::after {
  content: "";
}

.trail-note {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.55;
  color: var(--ink-soft);
}

.trail-note em {
  display: block;
  margin-top: 0.35rem;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.15rem;
  color: var(--forest);
}

.trail-note strong {
  color: var(--forest);
  font-weight: 600;
}

.trail-tile--quote blockquote {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-style: italic;
  line-height: 1.22;
  color: var(--forest);
}

.trail-vista {
  position: relative;
  margin: 1.25rem 0;
  padding: clamp(2.5rem, 8vh, 4.5rem) clamp(1.1rem, 3vw, 2rem);
  border-radius: 2px;
  overflow: hidden;
  isolation: isolate;
  background:
    linear-gradient(120deg, rgba(15, 28, 22, 0.72), rgba(20, 38, 28, 0.45) 55%, rgba(20, 38, 28, 0.2)),
    url("/scene/hero-fg.png") center 65% / cover no-repeat;
  color: var(--cream);
  box-shadow: 0 20px 50px rgba(20, 38, 28, 0.25);
}

.trail-vista--cafe {
  min-height: 12rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.trail-vista__kicker {
  margin: 0 0 0.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold-soft);
}

.trail-vista__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 5.5vw, 3.4rem);
  font-weight: 400;
  line-height: 1.02;
}

.trail-vista__title em {
  font-style: italic;
  color: var(--gold-soft);
}

.trail-vista__copy {
  margin: 1rem 0 0;
  max-width: 42ch;
  font-size: 1rem;
  line-height: 1.55;
  color: rgba(244, 241, 234, 0.82);
}

.trail-close {
  margin-top: 1.25rem;
  padding: 1.5rem 0 0.5rem;
}

.trail-close__line {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.2rem);
  line-height: 1.15;
  color: var(--forest);
  text-shadow: 0 2px 20px rgba(255, 255, 255, 0.4);
}

.trail-close__tag {
  margin: 0.75rem 0 0;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.1rem;
  color: var(--gold);
}

.trail-rail {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(14rem, 18rem);
  gap: 0.75rem;
  overflow-x: auto;
  padding: 0.25rem 0 1.25rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.trail-stop {
  scroll-snap-align: start;
  padding: 1.25rem 1.2rem 1.4rem;
  min-height: 12rem;
  background: rgba(247, 244, 239, 0.82);
  border: 1px solid rgba(26, 43, 37, 0.08);
  box-shadow: 0 12px 32px rgba(26, 43, 37, 0.08);
  backdrop-filter: blur(12px);
  transform: rotate(calc((var(--d) - 2) * 0.5deg));
}

.trail-stop__n {
  display: block;
  margin-bottom: 0.65rem;
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  color: var(--gold);
}

.trail-stop h2 {
  margin: 0 0 0.55rem;
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 400;
  color: var(--forest);
}

.trail-stop p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.45;
  color: var(--ink-soft);
}

@media (prefers-reduced-motion: no-preference) {
  .page.is-open .trail-hero,
  .page.is-open .trail-tile,
  .page.is-open .trail-vista,
  .page.is-open .trail-close,
  .page.is-open .trail-stop {
    animation: trail-in 0.75s var(--ease) both;
  }

  .page.is-open .trail-tile:nth-child(1) { animation-delay: 0.06s; }
  .page.is-open .trail-tile:nth-child(2) { animation-delay: 0.12s; }
  .page.is-open .trail-tile:nth-child(3) { animation-delay: 0.18s; }
  .page.is-open .trail-vista { animation-delay: 0.2s; }
  .page.is-open .trail-stop:nth-child(1) { animation-delay: 0.08s; }
  .page.is-open .trail-stop:nth-child(2) { animation-delay: 0.12s; }
  .page.is-open .trail-stop:nth-child(3) { animation-delay: 0.16s; }
  .page.is-open .trail-stop:nth-child(4) { animation-delay: 0.2s; }
  .page.is-open .trail-stop:nth-child(5) { animation-delay: 0.24s; }
}

@keyframes trail-in {
  from {
    opacity: 0;
    translate: 0 22px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
"""

css_path.write_text(css[:idx] + new, encoding="utf-8")
print("css ok")
