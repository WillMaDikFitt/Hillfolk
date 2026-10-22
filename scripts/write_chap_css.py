from pathlib import Path

root = Path(__file__).resolve().parents[1]
css_path = root / "src" / "style.css"
css = css_path.read_text(encoding="utf-8")
idx = css.find("/* Inner pages")
if idx < 0:
    raise SystemExit("marker missing")

new = r"""/* Inner pages — cinematic hillside chapters */
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

.chap-stage {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.chap-stage__bg,
.chap-stage__fg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 115%;
  object-fit: cover;
  object-position: 55% 35%;
  will-change: transform;
}

.chap-stage__fg {
  object-position: 52% 58%;
  opacity: 0.55;
}

.chap-stage__mist {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(185, 207, 220, 0.25) 0%, rgba(244, 241, 234, 0.35) 40%, rgba(244, 241, 234, 0.72) 78%, rgba(239, 235, 227, 0.9) 100%),
    radial-gradient(ellipse 70% 50% at 75% 20%, rgba(255, 255, 255, 0.35), transparent 55%);
}

.chap-chrome {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem clamp(1.15rem, 3.5vw, 2.25rem);
  pointer-events: none;
}

.chap-chrome__back,
.chap-chrome__logo {
  pointer-events: auto;
}

.chap-chrome__back {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
  text-shadow: 0 1px 10px rgba(255, 255, 255, 0.65);
  padding: 0.4rem 0;
}

.chap-chrome__back:hover {
  color: var(--forest);
}

.chap-chrome__logo img {
  height: 1.5rem;
  width: auto;
  filter: drop-shadow(0 2px 14px rgba(255, 255, 255, 0.55));
}

.chap-scroll {
  position: relative;
  z-index: 2;
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
}

.chap {
  position: relative;
  min-height: 100%;
  min-height: 100dvh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding:
    clamp(5rem, 12vh, 7rem)
    clamp(1.25rem, 5vw, 4rem)
    clamp(2.5rem, 8vh, 4.5rem);
  box-sizing: border-box;
}

.chap--hero {
  justify-content: center;
  padding-top: clamp(6rem, 16vh, 9rem);
}

.chap--left {
  align-items: flex-start;
}

.chap--center {
  align-items: center;
  text-align: center;
}

.chap--center .chap-note,
.chap--center .chap-headline,
.chap--center .chap-meta {
  margin-left: auto;
  margin-right: auto;
}

.chap--deep {
  justify-content: flex-end;
  color: var(--cream);
  background: linear-gradient(180deg, transparent 10%, rgba(15, 28, 22, 0.55) 45%, rgba(15, 28, 22, 0.82) 100%);
}

.chap--close {
  justify-content: center;
  align-items: flex-start;
}

.chap-kicker {
  margin: 0 0 0.85rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
  text-shadow: 0 1px 12px rgba(255, 255, 255, 0.45);
}

.chap-kicker--light {
  color: var(--gold-soft);
  text-shadow: none;
}

.chap-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(3rem, 9vw, 5.75rem);
  font-weight: 400;
  line-height: 0.94;
  letter-spacing: -0.03em;
  color: var(--forest);
  text-shadow: 0 3px 36px rgba(255, 255, 255, 0.4);
  max-width: 12ch;
}

.chap-title em {
  font-style: italic;
}

.chap-title--sm {
  font-size: clamp(2.4rem, 7vw, 4.25rem);
  color: var(--cream);
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
  max-width: 14ch;
}

.chap-title--sm em {
  color: var(--gold-soft);
}

.chap-dek {
  margin: 1rem 0 0;
  max-width: 28ch;
  font-size: 1.15rem;
  line-height: 1.45;
  color: var(--ink-soft);
  text-shadow: 0 1px 14px rgba(255, 255, 255, 0.5);
}

.chap-lines {
  margin: 0 0 1.25rem;
  padding: 0;
  list-style: none;
  max-width: 22ch;
}

.chap-lines li {
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3vw, 1.85rem);
  line-height: 1.3;
  color: var(--forest);
  text-shadow: 0 2px 20px rgba(255, 255, 255, 0.45);
}

.chap-headline {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4.5vw, 2.85rem);
  font-weight: 400;
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: var(--forest);
  max-width: 18ch;
  text-shadow: 0 2px 24px rgba(255, 255, 255, 0.4);
}

.chap-meta {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 2.2vw, 1.3rem);
  color: var(--forest);
  opacity: 0.9;
}

.chap-note {
  margin: 0;
  max-width: 36ch;
  font-size: 1.05rem;
  line-height: 1.55;
  color: var(--ink-soft);
  text-shadow: 0 1px 12px rgba(255, 255, 255, 0.4);
}

.chap-note strong {
  display: block;
  margin-top: 0.4rem;
  color: var(--forest);
  font-weight: 600;
}

.chap-note em {
  display: block;
  margin-top: 0.35rem;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.2rem;
  color: var(--forest);
}

.chap-note--light {
  color: rgba(244, 241, 234, 0.82);
  text-shadow: none;
  max-width: 40ch;
}

.chap-note--light strong {
  color: var(--cream);
}

.chap-duo {
  display: grid;
  gap: 1rem;
  max-width: 48rem;
}

@media (min-width: 760px) {
  .chap-duo {
    grid-template-columns: 1fr 1fr;
    gap: 1.75rem;
  }
}

.chap-duo p {
  margin: 0;
  font-size: 1.02rem;
  line-height: 1.55;
  color: var(--ink-soft);
  text-shadow: 0 1px 12px rgba(255, 255, 255, 0.35);
}

.chap-duo strong {
  color: var(--forest);
  font-weight: 600;
}

.chap-quote {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.85rem, 5vw, 3rem);
  line-height: 1.12;
  color: var(--forest);
  max-width: 14ch;
  text-shadow: 0 3px 30px rgba(255, 255, 255, 0.4);
}

.chap-tag {
  margin: 1.1rem 0 0;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.15rem;
  color: var(--gold);
}

.chap-services {
  display: contents;
}

.chap-service {
  /* each service is its own snap chapter via wrapper */
}

.chap .chap-service-list {
  margin: 0;
  padding: 0;
  list-style: none;
  width: min(100%, 36rem);
}

.chap .chap-service-list li {
  display: grid;
  gap: 0.25rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(26, 43, 37, 0.12);
}

.chap .chap-service-list li:last-child {
  border-bottom: 0;
}

.chap .chap-service-list h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2.8vw, 1.75rem);
  font-weight: 400;
  color: var(--forest);
}

.chap .chap-service-list p {
  margin: 0;
  font-size: 0.98rem;
  color: var(--ink-soft);
}

.chap-contacts {
  margin: 0;
  padding: 0;
  list-style: none;
  width: min(100%, 32rem);
}

.chap-contacts li {
  display: grid;
  gap: 0.3rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid rgba(244, 241, 234, 0.18);
}

.chap-contacts li:last-child {
  border-bottom: 0;
}

.chap-contacts span {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold-soft);
}

.chap-contacts a {
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3vw, 1.85rem);
  color: var(--cream);
  text-decoration: none;
}

.chap-contacts a:hover {
  color: var(--gold-soft);
}

@media (prefers-reduced-motion: no-preference) {
  .page.is-open .chap {
    animation: chap-rise 0.7s var(--ease) both;
  }

  .page.is-open .chap:nth-of-type(1) { animation-delay: 0.02s; }
  .page.is-open .chap:nth-of-type(2) { animation-delay: 0.06s; }
}

@keyframes chap-rise {
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
