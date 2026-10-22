from pathlib import Path

css_path = Path(__file__).resolve().parents[1] / "src" / "style.css"
css = css_path.read_text(encoding="utf-8")
idx = css.find("/* Inner pages")
if idx < 0:
    raise SystemExit("marker missing")

new = r"""/* Inner pages — town board on the hill */
.page {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: #8eafc4;
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

.town-sky {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.town-sky__bg,
.town-sky__fg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 42%;
}

.town-sky__fg {
  object-position: 48% 58%;
}

.town-sky__shade {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 28% 55%, rgba(20, 38, 28, 0.28), transparent 62%),
    linear-gradient(90deg, rgba(20, 38, 28, 0.42) 0%, rgba(20, 38, 28, 0.12) 48%, transparent 72%),
    linear-gradient(180deg, rgba(142, 175, 196, 0.15), transparent 30%, rgba(20, 38, 28, 0.2) 100%);
}

.page__scroll {
  position: relative;
  z-index: 1;
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 1rem clamp(0.85rem, 3vw, 2rem) 2.5rem;
}

.town-exit {
  display: inline-flex;
  margin: 0 0 0.85rem;
  padding: 0.45rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--forest);
  background: rgba(247, 244, 239, 0.88);
  border: 1px solid rgba(26, 43, 37, 0.12);
  box-shadow: 0 8px 24px rgba(20, 38, 28, 0.12);
  backdrop-filter: blur(8px);
}

.town-exit:hover {
  background: #fff;
}

.board {
  position: relative;
  width: min(100%, 34rem);
  margin: 0;
  padding: 1.6rem 1.45rem 1.75rem;
  background:
    linear-gradient(180deg, rgba(255, 252, 246, 0.97), rgba(247, 244, 239, 0.94));
  border: 1px solid rgba(26, 43, 37, 0.12);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.8) inset,
    0 18px 50px rgba(20, 38, 28, 0.22),
    0 2px 0 rgba(163, 134, 92, 0.25);
  clip-path: polygon(
    0% 1.5%,
    2% 0%,
    98% 0.8%,
    100% 2%,
    99.2% 97%,
    97% 100%,
    1.5% 99%,
    0% 97%
  );
}

@media (min-width: 900px) {
  .board {
    margin-left: clamp(0.5rem, 4vw, 3rem);
    margin-top: 0.5rem;
  }
}

.board__pin {
  position: absolute;
  top: 0.7rem;
  right: 1rem;
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #d7b48a, #8a6a3d);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
}

.board__sign {
  margin: 0 0 0.35rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink);
}

.board__sign--sm {
  margin-bottom: 0.45rem;
  color: var(--gold);
  letter-spacing: 0.14em;
  font-weight: 600;
}

.board__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.35rem, 6vw, 3.35rem);
  font-weight: 400;
  line-height: 0.98;
  letter-spacing: -0.03em;
  color: var(--forest);
}

.board__tag {
  margin: 0.55rem 0 1.15rem;
  font-size: 1rem;
  color: var(--ink-soft);
}

.board__path {
  position: absolute;
  left: 1.55rem;
  top: 9.5rem;
  bottom: 5.5rem;
  width: 2px;
  background: linear-gradient(180deg, rgba(63, 107, 69, 0.45), rgba(163, 134, 92, 0.35));
  border-radius: 2px;
  opacity: 0.55;
}

.board__stop {
  position: relative;
  padding: 0 0 1.15rem 1.35rem;
  margin-bottom: 0.15rem;
}

.board__stop:last-of-type {
  padding-bottom: 0.5rem;
}

.board__dot {
  position: absolute;
  left: -0.05rem;
  top: 0.35rem;
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 50%;
  background: var(--leaf);
  border: 2px solid #f7f4ef;
  box-shadow: 0 0 0 1px rgba(63, 107, 69, 0.35);
}

.board__stop h2 {
  margin: 0 0 0.45rem;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.5vw, 1.45rem);
  font-weight: 400;
  line-height: 1.2;
  color: var(--forest);
}

.board__stop ul {
  margin: 0 0 0.55rem;
  padding: 0;
  list-style: none;
}

.board__stop li {
  margin: 0 0 0.2rem;
  font-size: 0.98rem;
  line-height: 1.4;
  color: var(--ink);
}

.board__stop p {
  margin: 0 0 0.55rem;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--ink-soft);
}

.board__stop p:last-child {
  margin-bottom: 0;
}

.board__stop strong {
  color: var(--forest);
  font-weight: 600;
}

.board__stop em {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--forest);
}

.board__lane {
  margin-bottom: 0.55rem !important;
  font-family: var(--font-display);
  font-size: 1.05rem !important;
  color: var(--forest) !important;
}

.board__stop--stamp {
  margin: 0.35rem 0 0.85rem;
  padding: 0.95rem 0.95rem 0.95rem 1.35rem;
  background: rgba(20, 38, 28, 0.94);
  color: var(--cream);
  box-shadow: 0 10px 28px rgba(20, 38, 28, 0.18);
}

.board__stop--stamp .board__dot {
  background: var(--gold-soft);
  border-color: #1a3226;
  box-shadow: none;
  left: 0.85rem;
  top: 1.15rem;
}

.board__stop--stamp p {
  color: rgba(244, 241, 234, 0.78);
}

.board__stamp-title {
  margin: 0 0 0.45rem !important;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3vw, 1.75rem) !important;
  line-height: 1.15 !important;
  color: var(--cream) !important;
}

.board__stamp-title em {
  color: var(--gold-soft);
}

.board__contacts {
  margin: 0;
  padding: 0;
  list-style: none;
}

.board__contacts li {
  display: grid;
  gap: 0.15rem;
  margin-bottom: 0.85rem;
}

.board__contacts li:last-child {
  margin-bottom: 0;
}

.board__contacts span {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold-soft);
}

.board__contacts a {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--cream);
  text-decoration: none;
}

.board__contacts a:hover {
  color: var(--gold-soft);
}

.board__end {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed rgba(26, 43, 37, 0.18);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.board__end p {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  line-height: 1.25;
  color: var(--forest);
}

.board__logo {
  flex: 0 0 auto;
}

.board__logo img {
  height: 1.35rem;
  width: auto;
}

@media (prefers-reduced-motion: no-preference) {
  .page.is-open .board {
    animation: board-in 0.6s var(--ease) both;
  }

  .page.is-open .town-sky__fg {
    animation: town-fg 0.9s var(--ease) both;
  }
}

@keyframes board-in {
  from {
    opacity: 0;
    transform: translateY(24px) rotate(-0.6deg);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes town-fg {
  from {
    opacity: 0;
    transform: scale(1.04);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
"""

css_path.write_text(css[:idx] + new, encoding="utf-8")
print("css ok")
