from pathlib import Path

css_path = Path(__file__).resolve().parents[1] / "src" / "style.css"
css = css_path.read_text(encoding="utf-8")
idx = css.find("/* Inner pages")
if idx < 0:
    raise SystemExit("marker missing")

new = r"""/* Inner pages — stay in the hill world */
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

.world {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.world__stage {
  position: absolute;
  inset: -8%;
  transform-origin: 50% 40%;
  transition: transform 1.1s var(--ease);
  will-change: transform;
}

.page.is-open .world__stage {
  transform: scale(var(--world-scale, 1.18))
    translate(
      calc((50% - var(--world-x, 50%)) * 0.35),
      calc((42% - var(--world-y, 40%)) * 0.45)
    );
}

.world__bg,
.world__fg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
}

.world__fg {
  object-position: center 48%;
}

.world__mist {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      180deg,
      rgba(185, 207, 220, 0.12) 0%,
      rgba(244, 241, 234, 0.18) 42%,
      rgba(244, 241, 234, 0.72) 78%,
      rgba(239, 235, 227, 0.92) 100%
    );
}

.page__scroll {
  position: relative;
  z-index: 1;
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.sign-bar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem clamp(1rem, 3vw, 1.75rem);
  background: rgba(244, 241, 234, 0.55);
  border-bottom: 1.5px solid rgba(26, 43, 37, 0.12);
  backdrop-filter: blur(10px);
}

.sign-bar__back {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
  text-shadow: 0 1px 8px rgba(255, 255, 255, 0.6);
}

.sign-bar__back:hover {
  color: var(--forest);
}

.sign-bar__logo img {
  height: 1.45rem;
  width: auto;
  filter: drop-shadow(0 2px 10px rgba(255, 255, 255, 0.55));
}

.signs {
  width: min(100%, 40rem);
  margin: 0 auto;
  padding: 0 clamp(1rem, 3vw, 1.75rem) 3rem;
}

.sign-sky {
  padding: clamp(1.75rem, 6vh, 3.25rem) 0 1.25rem;
}

.sign-paint {
  display: inline-block;
  margin: 0 0 0.65rem;
  padding: 0.35rem 0.7rem;
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2.5vw, 1.45rem);
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1;
  color: var(--cream);
  background: var(--forest);
  border: 2px solid #0f1a14;
  box-shadow: 3px 3px 0 rgba(15, 26, 20, 0.18);
}

.sign-sky__title {
  margin: 0;
  max-width: 12ch;
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 8vw, 4.4rem);
  font-weight: 400;
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: var(--forest);
  text-shadow:
    0 1px 0 rgba(255, 255, 255, 0.55),
    0 8px 28px rgba(255, 255, 255, 0.35);
}

.sign-sky__tag {
  margin: 0.85rem 0 0;
  max-width: 28ch;
  font-size: 1.05rem;
  line-height: 1.4;
  color: var(--ink-soft);
  text-shadow: 0 1px 10px rgba(255, 255, 255, 0.55);
}

.board {
  position: relative;
  margin-bottom: 0.85rem;
  padding: 1.15rem 1.2rem 1.25rem;
  background: #f7f3ea;
  border: 2.5px solid #1a2b25;
  box-shadow:
    4px 4px 0 rgba(26, 43, 37, 0.12),
    0 18px 40px rgba(26, 43, 37, 0.1);
}

.board::before,
.board::after {
  content: "";
  position: absolute;
  top: 0.55rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #d8c4a0, #8a6b3d 70%);
  border: 1px solid #5c4524;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.35);
}

.board::before {
  left: 0.65rem;
}

.board::after {
  right: 0.65rem;
}

.board--chalk {
  background: linear-gradient(160deg, #1f3a2c, #14261c);
  border-color: #0d1611;
  color: var(--cream);
  box-shadow:
    4px 4px 0 rgba(13, 22, 17, 0.35),
    0 18px 40px rgba(13, 22, 17, 0.28);
}

.board--chalk::before,
.board--chalk::after {
  background: radial-gradient(circle at 35% 35%, #c4a574, #6b5230 70%);
}

.board__nail {
  margin: 0 0 0.55rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #b45a3c;
}

.board--chalk .board__nail {
  color: var(--gold-soft);
}

.board__list {
  margin: 0 0 0.75rem;
  padding: 0;
  list-style: none;
}

.board__list li {
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2.2vw, 1.3rem);
  line-height: 1.3;
  color: var(--forest);
}

.board__title {
  margin: 0 0 0.55rem;
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2.8vw, 1.7rem);
  font-weight: 400;
  line-height: 1.18;
  color: var(--forest);
}

.board__meta {
  margin: 0 0 0.7rem;
  font-family: var(--font-display);
  font-size: 1.05rem;
  color: #3f6b45;
}

.board__text {
  margin: 0 0 0.65rem;
  font-size: 0.96rem;
  line-height: 1.5;
  color: var(--ink-soft);
}

.board__text:last-child {
  margin-bottom: 0;
}

.board__text strong {
  color: var(--forest);
  font-weight: 700;
}

.board__text em {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--forest);
}

.board__text--light {
  color: rgba(244, 241, 234, 0.82);
}

.board__display {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-size: clamp(1.55rem, 3.5vw, 2.1rem);
  font-weight: 400;
  line-height: 1.05;
  color: var(--cream);
}

.board__display span {
  color: var(--gold-soft);
}

.sign-close {
  margin: 1.5rem 0 0;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3vw, 1.85rem);
  line-height: 1.2;
  color: var(--forest);
  text-shadow: 0 2px 18px rgba(255, 255, 255, 0.55);
}

.sign-close span {
  display: block;
  margin-top: 0.55rem;
  font-size: 1.05rem;
  font-style: italic;
  color: #b45a3c;
}

.shop-row {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(13.5rem, 16rem);
  gap: 0.75rem;
  overflow-x: auto;
  padding: 0.15rem 0 1.25rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.shop {
  scroll-snap-align: start;
  min-height: 11.5rem;
  padding: 1rem 1.05rem 1.15rem;
  background: #f7f3ea;
  border: 2.5px solid #1a2b25;
  box-shadow: 3px 3px 0 rgba(26, 43, 37, 0.12);
}

.shop__n {
  display: block;
  margin-bottom: 0.45rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #b45a3c;
}

.shop h2 {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.15;
  color: var(--forest);
}

.shop p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--ink-soft);
}

.board--contact .board__lines {
  display: grid;
  gap: 0.85rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.board--contact a {
  display: grid;
  gap: 0.2rem;
  text-decoration: none;
  color: inherit;
}

.board--contact span {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b45a3c;
}

.board--contact strong {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.4vw, 1.55rem);
  font-weight: 400;
  color: var(--forest);
}

.board--contact a:hover strong {
  color: var(--leaf);
}

.board--air {
  background: rgba(247, 243, 234, 0.82);
  backdrop-filter: blur(6px);
}

@media (prefers-reduced-motion: no-preference) {
  .page.is-open .sign-sky,
  .page.is-open .board,
  .page.is-open .shop,
  .page.is-open .sign-close {
    animation: sign-in 0.7s var(--ease) both;
  }

  .page.is-open .board:nth-of-type(1) { animation-delay: 0.06s; }
  .page.is-open .board:nth-of-type(2) { animation-delay: 0.12s; }
  .page.is-open .board:nth-of-type(3) { animation-delay: 0.18s; }
  .page.is-open .board:nth-of-type(4) { animation-delay: 0.24s; }
  .page.is-open .shop:nth-child(1) { animation-delay: 0.08s; }
  .page.is-open .shop:nth-child(2) { animation-delay: 0.12s; }
  .page.is-open .shop:nth-child(3) { animation-delay: 0.16s; }
  .page.is-open .shop:nth-child(4) { animation-delay: 0.2s; }
  .page.is-open .shop:nth-child(5) { animation-delay: 0.24s; }
  .page.is-open .sign-close { animation-delay: 0.28s; }
}

@keyframes sign-in {
  from {
    opacity: 0;
    translate: 0 18px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
"""

css_path.write_text(css[:idx] + new, encoding="utf-8")
print("css ok")
