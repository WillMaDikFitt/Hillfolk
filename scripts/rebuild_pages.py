from pathlib import Path

html = Path("index.html").read_text(encoding="utf-8")
pages = r'''
    <section class="page" id="about" hidden aria-hidden="true">
      <button class="page__back" id="about-back" type="button">
        <span aria-hidden="true">←</span> Back to the hill
      </button>

      <div class="page__scroll" id="about-scroll">
        <header class="hero-panel">
          <img
            class="hero-panel__img"
            src="/interiors/about-office.png"
            alt="Inside the Hillfolk summit studio"
            width="1920"
            height="1080"
          />
          <div class="hero-panel__shade"></div>
          <div class="hero-panel__copy">
            <p class="hero-panel__kicker">About</p>
            <h1 class="hero-panel__title">We are Hillfolk</h1>
            <p class="hero-panel__tag">Creativity, from the hills.</p>
          </div>
        </header>

        <section class="story">
          <div class="story__intro">
            <p class="story__index">01 — Who we are</p>
            <h2>A core team of creatives</h2>
          </div>
          <div class="story__grid">
            <ul class="story__list">
              <li><span>01</span>A core team of creatives</li>
              <li><span>02</span>Backed by a growing team of specialists</li>
              <li><span>03</span>From across the North-East</li>
            </ul>
            <div class="story__aside">
              <p>We don’t believe in one-size-fits-all teams.</p>
              <p class="story__aside-em">We build the right team for every brief.</p>
            </div>
          </div>
        </section>

        <section class="lens">
          <div class="lens__head">
            <p class="story__index">02 — Perspective</p>
            <h2>When perspectives shift,<br />ideas get interesting.</h2>
          </div>
          <ol class="lens__rows">
            <li>
              <span class="lens__n">01</span>
              <div>
                <h3>From different cultures</h3>
                <p>Taste, language, and ways of seeing that don’t flatten into a single market voice.</p>
              </div>
            </li>
            <li>
              <span class="lens__n">02</span>
              <div>
                <h3>Different cities</h3>
                <p>Hill towns and metros — each place leaves a mark on how we brief and build.</p>
              </div>
            </li>
            <li>
              <span class="lens__n">03</span>
              <div>
                <h3>Different disciplines</h3>
                <p>Strategy, craft, film, digital, experience — assembled around what the work needs.</p>
              </div>
            </li>
            <li>
              <span class="lens__n">04</span>
              <div>
                <h3>Different experiences</h3>
                <p>Years in the making, under a new name — depth without the usual agency sameness.</p>
              </div>
            </li>
          </ol>
          <p class="lens__foot">
            The North-East gives us a unique lens.
            <em>Our differences widen the view.</em>
          </p>
        </section>

        <section class="why">
          <p class="story__index story__index--on-dark">03 — Why Hillfolk?</p>
          <blockquote>Because where you look from changes what you see.</blockquote>
          <p>
            The North-East has always had its own creative language. Distinct in taste, culture and
            perspective, yet still under-represented in mainstream creative work.
            <strong>Hillfolk brings that perspective to the table.</strong>
            A core team with the region’s best creative minds, brought together around what each brief
            actually needs.
          </p>
        </section>

        <section class="close-band">
          <p class="close-band__kicker">New name. Years in the making.</p>
          <h2>Hillfolk is new.<br />Our experience <em>runs deep</em>.</h2>
          <p class="close-band__line">Not your usual agency mix. Not the usual point of view.</p>
          <p class="close-band__tag">Creativity, from the hills.</p>
        </section>
      </div>
    </section>

    <section class="page" id="room" hidden aria-hidden="true">
      <button class="page__back" id="room-back" type="button">
        <span aria-hidden="true">←</span> Back to the hill
      </button>
      <div class="page__scroll" id="room-scroll">
        <header class="room-hero" id="room-hero">
          <div class="room-hero__inner">
            <p class="hero-panel__kicker" id="room-eyebrow"></p>
            <h1 class="room-hero__title" id="room-title"></h1>
            <p class="room-hero__lead" id="room-lead"></p>
          </div>
          <div class="room-hero__mark" aria-hidden="true"></div>
        </header>
        <div class="room-flow" id="room-body"></div>
      </div>
    </section>
'''

marker = '<div class="veil" id="veil"'
head = html.split(marker)[0]
out = (
    head
    + '    <div class="veil" id="veil" aria-hidden="true"></div>\n\n'
    + pages.strip()
    + '\n\n    <script type="module" src="/src/main.js"></script>\n  </body>\n</html>\n'
)
Path("index.html").write_text(out, encoding="utf-8")
print("html ok")
