from pathlib import Path

css_path = Path(__file__).resolve().parents[1] / "src" / "style.css"
css = css_path.read_text(encoding="utf-8")
idx = css.find("/* Inner pages")
if idx < 0:
    raise SystemExit("marker missing")

new = r"""/* Inner pages — hillside still in frame */
.page {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  grid-template-columns: 1fr;
  background: var(--cream);
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

@media (min-width: 900px) {
  .page {
    grid-template-columns: minmax(22rem, 46%) 1fr;
  }
}

.page__art {
  display: none;
  position: relative;
  overflow: hidden;
  background: #c8d8e4;
}

@media (min-width: 900px) {
  .page__art {
    display: block;
    order: 2;
  }
}

.page__art img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 62% 40%;
}

.page__art-fg {
  object-position: 58% 55%;
}

.page__panel {
  order: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  background: var(--paper);
  box-shadow: 8px 0 40px rgba(20, 38, 28, 0.08);
}

.panel-bar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.35rem;
  border-bottom: 1px solid rgba(26, 43, 37, 0.08);
  background: rgba(247, 244, 239, 0.95);
}

.panel-bar__back {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.panel-bar__back:hover {
  color: var(--forest);
}

.panel-bar__logo img {
  height: 1.4rem;
  width: auto;
}

.page__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.panel {
  padding: 1.5rem 1.35rem 2.75rem;
  max-width: 36rem;
}

@media (min-width: 900px) {
  .panel {
    padding: 1.75rem 2rem 3rem;
  }
}

.panel-head {
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(26, 43, 37, 0.1);
}

.panel-kicker {
  margin: 0 0 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
}

.panel-head h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 5vw, 3.4rem);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--forest);
}

.panel-lead {
  margin: 0.7rem 0 0;
  font-size: 1.05rem;
  line-height: 1.45;
  color: var(--ink-soft);
}

.panel-block {
  margin-bottom: 1.35rem;
  padding-bottom: 1.35rem;
  border-bottom: 1px solid rgba(26, 43, 37, 0.08);
}

.panel-block:last-child {
  border-bottom: 0;
  margin-bottom: 0;
  padding-bottom: 0;
}

.panel-block h2 {
  margin: 0 0 0.7rem;
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.4vw, 1.55rem);
  font-weight: 400;
  line-height: 1.2;
  color: var(--forest);
}

.panel-block ul {
  margin: 0 0 0.85rem;
  padding: 0;
  list-style: none;
}

.panel-block li {
  margin: 0 0 0.3rem;
  font-size: 1.02rem;
  line-height: 1.4;
  color: var(--ink);
}

.panel-block p {
  margin: 0 0 0.75rem;
  font-size: 0.98rem;
  line-height: 1.55;
  color: var(--ink-soft);
}

.panel-block p:last-child {
  margin-bottom: 0;
}

.panel-block strong {
  color: var(--forest);
  font-weight: 600;
}

.panel-block em {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--forest);
}

.panel-meta {
  margin: 0 0 0.75rem !important;
  font-family: var(--font-display);
  font-size: 1.05rem !important;
  color: var(--forest) !important;
}

.panel-block--feature {
  padding: 1.15rem 1.1rem;
  border: 0;
  background: var(--forest);
  color: var(--cream);
}

.panel-block--feature h2 {
  color: var(--cream);
}

.panel-block--feature h2 span {
  color: var(--gold-soft);
}

.panel-block--feature p {
  color: rgba(244, 241, 234, 0.78);
}

.panel-foot {
  margin-top: 0.5rem;
  padding-top: 1.25rem;
}

.panel-foot p {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  line-height: 1.25;
  color: var(--forest);
}

.panel-foot__tag {
  margin-top: 0.55rem !important;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1rem !important;
  color: var(--gold) !important;
}

.panel-services {
  margin: 0 !important;
}

.panel-services li {
  display: grid;
  gap: 0.2rem;
  margin: 0 0 1rem !important;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(26, 43, 37, 0.08);
}

.panel-services li:last-child {
  margin-bottom: 0 !important;
  padding-bottom: 0;
  border-bottom: 0;
}

.panel-services h2 {
  margin: 0;
  font-size: 1.25rem;
}

.panel-services p {
  margin: 0;
}

.panel-contacts {
  margin: 0 !important;
}

.panel-contacts li {
  display: grid;
  gap: 0.25rem;
  margin: 0 0 1rem !important;
}

.panel-contacts span {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
}

.panel-contacts a {
  font-family: var(--font-display);
  font-size: 1.35rem;
  color: var(--forest);
  text-decoration: none;
}

.panel-contacts a:hover {
  color: var(--leaf);
}

@media (max-width: 899px) {
  .page {
    background:
      linear-gradient(180deg, rgba(247, 244, 239, 0.92), var(--paper) 35%),
      url("/scene/hero-bg.png") center top / cover no-repeat;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .page.is-open .page__panel {
    animation: panel-in 0.55s var(--ease) both;
  }

  .page.is-open .page__art {
    animation: art-in 0.7s var(--ease) both;
  }
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes art-in {
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
