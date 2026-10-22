from pathlib import Path

css_path = Path("src/style.css")
css = css_path.read_text(encoding="utf-8")
for a, b in [
    ('"Syne", system-ui, sans-serif', '"Bricolage Grotesque", system-ui, sans-serif'),
    ('"Manrope", system-ui, sans-serif', '"Public Sans", system-ui, sans-serif'),
]:
    css = css.replace(a, b)

idx = css.find("/* ——— Inner pages")
if idx < 0:
    idx = css.find("\n.page {")
if idx > 0:
    css = css[:idx].rstrip() + "\n"

pages = r'''
/* ——— Inner pages ——— */
.page {
  --page-ink: #142019;
  --page-mist: #dfe9e2;
  --page-leaf: #5f8f3d;
  --page-deep: #0f1c16;
  --page-paper: #f2f5f0;
  position: fixed;
  inset: 0;
  z-index: 55;
  background: var(--page-paper);
  color: var(--page-ink);
  opacity: 0;
  pointer-events: none;
  transform: translateY(14px);
  transition: opacity 0.55s var(--ease), transform 0.7s var(--ease);
}

.page[hidden] {
  display: none;
}

.page.is-open {
  opacity: 1;
  pointer-events: auto;
  transform: none;
}

.page__back {
  position: fixed;
  top: 1.1rem;
  left: 1.1rem;
  z-index: 8;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.72rem 1.05rem;
  background: rgba(242, 245, 240, 0.9);
  color: var(--page-ink);
  font-family: var(--font-body);
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: 0 12px 32px rgba(15, 28, 22, 0.14);
  backdrop-filter: blur(12px);
  transition: transform 0.25s var(--ease), background 0.25s;
}

.page__back:hover {
  transform: translateX(-3px);
  background: #fff;
}

.page__scroll {
  height: 100%;
  overflow: auto;
  overscroll-behavior: contain;
}

/* About cinematic hero */
.page-hero {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  align-items: end;
  overflow: hidden;
  background: var(--page-deep);
}

.page-hero__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 42%;
  transform: scale(1.04);
  animation: hero-drift 18s var(--ease) infinite alternate;
}

.page-hero__veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(15, 28, 22, 0.78) 0%, rgba(15, 28, 22, 0.35) 48%, rgba(15, 28, 22, 0.15) 100%),
    linear-gradient(180deg, rgba(15, 28, 22, 0.2) 0%, rgba(15, 28, 22, 0.82) 100%);
  pointer-events: none;
}

.page-hero__copy {
  position: relative;
  z-index: 1;
  padding: clamp(5.5rem, 12vh, 8rem) clamp(1.4rem, 6vw, 5rem) clamp(2.5rem, 7vh, 4rem);
  max-width: 18ch;
  color: #f2f5f0;
  animation: rise-in 0.9s 0.08s var(--ease) both;
}

.page-hero__brand {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.15rem, 2.4vw, 1.45rem);
  letter-spacing: -0.04em;
  color: #c5de9a;
}

.page-hero__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(3.2rem, 8.5vw, 6.2rem);
  letter-spacing: -0.055em;
  line-height: 0.92;
}

.page-hero__sub {
  margin: 1.35rem 0 0;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(242, 245, 240, 0.62);
}

@keyframes hero-drift {
  from { transform: scale(1.04) translate3d(0, 0, 0); }
  to { transform: scale(1.08) translate3d(-1.2%, 0.8%, 0); }
}

@keyframes rise-in {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: none; }
}

/* Who we are strip */
.page-strip {
  display: grid;
  grid-template-columns: 0.35fr 1fr;
  gap: clamp(1.5rem, 4vw, 3rem);
  padding: clamp(3.5rem, 8vw, 6rem) clamp(1.4rem, 6vw, 5rem);
  background:
    linear-gradient(135deg, #e8f0e4 0%, var(--page-paper) 55%, #e4ece8 100%);
  border-bottom: 1px solid rgba(15, 28, 22, 0.08);
}

.page-strip__label {
  margin: 0.35rem 0 0;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--page-leaf);
}

.page-strip__title {
  margin: 0 0 1.75rem;
  grid-column: 2;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.9rem, 4vw, 3rem);
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: var(--page-deep);
  max-width: 16ch;
}

.page-strip__cols {
  grid-column: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  max-width: 40rem;
}

.page-strip__cols p {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 300;
  line-height: 1.65;
  color: #3d4a42;
}

.page-strip__cols strong {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.03em;
  color: var(--page-deep);
  line-height: 1.25;
}

/* Perspective */
.page-lens {
  padding: clamp(3.5rem, 8vw, 6rem) clamp(1.4rem, 6vw, 5rem);
  background: var(--page-deep);
  color: #f2f5f0;
}

.page-lens__head {
  max-width: 18ch;
  margin-bottom: clamp(2rem, 5vw, 3.25rem);
}

.page-lens__label {
  margin: 0 0 0.85rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #9fc46a;
}

.page-lens__head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(2rem, 4.2vw, 3.2rem);
  letter-spacing: -0.04em;
  line-height: 1.05;
}

.page-lens__list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid rgba(242, 245, 240, 0.18);
}

.page-lens__list li {
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 1rem;
  align-items: baseline;
  padding: clamp(1.15rem, 2.5vw, 1.6rem) 0;
  border-bottom: 1px solid rgba(242, 245, 240, 0.14);
  transition: padding-left 0.35s var(--ease);
}

.page-lens__list li:hover {
  padding-left: 0.65rem;
}

.page-lens__list span {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  color: #9fc46a;
}

.page-lens__list em {
  font-family: var(--font-display);
  font-style: normal;
  font-weight: 700;
  font-size: clamp(1.45rem, 3vw, 2.15rem);
  letter-spacing: -0.035em;
  color: #f2f5f0;
}

.page-lens__foot {
  margin: clamp(2rem, 4vw, 3rem) 0 0;
  max-width: 28rem;
  font-size: 1.12rem;
  font-weight: 300;
  line-height: 1.6;
  color: rgba(242, 245, 240, 0.72);
}

.page-lens__foot strong {
  display: block;
  margin-top: 0.4rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.35rem;
  letter-spacing: -0.03em;
  color: #c5de9a;
}

/* Why */
.page-why {
  position: relative;
  padding: clamp(4rem, 9vw, 7rem) clamp(1.4rem, 6vw, 5rem);
  background:
    radial-gradient(ellipse 80% 60% at 100% 0%, rgba(95, 143, 61, 0.18), transparent 55%),
    var(--page-mist);
  overflow: hidden;
}

.page-why::before {
  content: "LOOK";
  position: absolute;
  right: -2%;
  top: 8%;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(6rem, 18vw, 14rem);
  letter-spacing: -0.06em;
  line-height: 0.8;
  color: rgba(15, 28, 22, 0.06);
  pointer-events: none;
  user-select: none;
}

.page-why__label {
  position: relative;
  margin: 0 0 1rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--page-leaf);
}

.page-why blockquote {
  position: relative;
  margin: 0 0 1.75rem;
  padding: 0;
  border: 0;
  max-width: 14ch;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  letter-spacing: -0.045em;
  line-height: 1.02;
  color: var(--page-deep);
}

.page-why p {
  position: relative;
  margin: 0;
  max-width: 36rem;
  font-size: 1.08rem;
  font-weight: 300;
  line-height: 1.75;
  color: #3d4a42;
}

.page-why strong {
  color: var(--page-deep);
  font-weight: 600;
}

/* Closing */
.page-end {
  padding: clamp(4rem, 10vw, 7rem) clamp(1.4rem, 6vw, 5rem);
  background: var(--page-deep);
  color: #f2f5f0;
  text-align: left;
}

.page-end__kicker {
  margin: 0 0 1.1rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #9fc46a;
}

.page-end h2 {
  margin: 0 0 1.5rem;
  max-width: 12ch;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.4rem, 5.5vw, 4rem);
  letter-spacing: -0.05em;
  line-height: 0.98;
}

.page-end h2 i {
  font-style: normal;
  color: #c5de9a;
}

.page-end__line {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 300;
  color: rgba(242, 245, 240, 0.7);
}

/* Room pages */
.room-hero {
  position: relative;
  min-height: min(72vh, 640px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: clamp(5.5rem, 12vh, 7.5rem) clamp(1.4rem, 6vw, 5rem) clamp(2.5rem, 6vh, 3.5rem);
  overflow: hidden;
  background:
    radial-gradient(ellipse 70% 80% at 85% 20%, rgba(95, 143, 61, 0.35), transparent 50%),
    linear-gradient(160deg, #1a3328 0%, #0f1c16 55%, #152820 100%);
  color: #f2f5f0;
}

.room-hero[data-theme="services"] {
  background:
    radial-gradient(ellipse 65% 70% at 90% 10%, rgba(70, 130, 160, 0.35), transparent 50%),
    linear-gradient(160deg, #16303a 0%, #0e1a20 60%, #142830 100%);
}

.room-hero[data-theme="contact"] {
  background:
    radial-gradient(ellipse 65% 70% at 80% 15%, rgba(180, 110, 60, 0.28), transparent 50%),
    linear-gradient(160deg, #2a2418 0%, #14110c 55%, #1e1a14 100%);
}

.room-hero[data-theme="cafe"] {
  background:
    radial-gradient(ellipse 65% 70% at 75% 20%, rgba(200, 90, 70, 0.28), transparent 50%),
    linear-gradient(160deg, #3a1e1c 0%, #180f0e 55%, #2a1614 100%);
}

.room-hero__mark {
  position: absolute;
  right: -2%;
  top: 12%;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(5rem, 16vw, 12rem);
  letter-spacing: -0.07em;
  line-height: 0.8;
  color: rgba(242, 245, 240, 0.06);
  pointer-events: none;
  user-select: none;
}

.room-hero__kicker {
  position: relative;
  margin: 0 0 1rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(242, 245, 240, 0.55);
}

.room-hero__title {
  position: relative;
  margin: 0;
  max-width: 11ch;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.8rem, 7vw, 5rem);
  letter-spacing: -0.05em;
  line-height: 0.95;
}

.room-hero__lead {
  position: relative;
  margin: 1.25rem 0 0;
  max-width: 28ch;
  font-size: clamp(1.05rem, 2vw, 1.2rem);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(242, 245, 240, 0.72);
}

.room-flow {
  display: flex;
  flex-direction: column;
}

.room-row {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: clamp(1rem, 3vw, 2.5rem);
  padding: clamp(2.25rem, 5vw, 3.5rem) clamp(1.4rem, 6vw, 5rem);
  border-bottom: 1px solid rgba(15, 28, 22, 0.1);
  background: var(--page-paper);
  transition: background 0.35s var(--ease);
}

.room-row:nth-child(even) {
  background: #e8efe6;
}

.room-row:hover {
  background: #e0ebe0;
}

.room-row__n {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: -0.05em;
  line-height: 1;
  color: var(--page-leaf);
}

.room-row h2 {
  margin: 0 0 0.65rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.55rem, 3vw, 2.1rem);
  letter-spacing: -0.035em;
  color: var(--page-deep);
}

.room-row p {
  margin: 0;
  max-width: 38rem;
  font-size: 1.05rem;
  font-weight: 300;
  line-height: 1.7;
  color: #3d4a42;
}

.room-end {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.4rem, 6vw, 5rem);
  background: var(--page-deep);
  color: #f2f5f0;
}

.room-end p {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  letter-spacing: -0.03em;
}

.room-end__back {
  padding: 0.85rem 1.35rem;
  background: #c5de9a;
  color: var(--page-deep);
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: transform 0.25s var(--ease), background 0.25s;
}

.room-end__back:hover {
  transform: translateX(4px);
  background: #d9eba8;
}

@media (max-width: 800px) {
  .page-strip {
    grid-template-columns: 1fr;
  }

  .page-strip__title,
  .page-strip__cols {
    grid-column: 1;
  }

  .page-strip__cols {
    grid-template-columns: 1fr;
  }

  .room-row {
    grid-template-columns: 3.5rem 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-hero__img {
    animation: none;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
'''

css_path.write_text(css + "\n" + pages, encoding="utf-8")
print("written", len(css) + len(pages))
