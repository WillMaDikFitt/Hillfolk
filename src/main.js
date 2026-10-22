import { VIEW, spots, placeholders } from "./spots.js";

const fresco = document.getElementById("fresco");
const stage = document.getElementById("stage");
const mapHits = document.getElementById("map-hits");
const birdsEl = document.getElementById("birds");
const topbar = document.getElementById("topbar");
const hint = document.getElementById("explore-hint");
const veil = document.getElementById("veil");
const about = document.getElementById("about");
const aboutBack = document.getElementById("about-back");
const aboutScroll = document.getElementById("about-scroll");
const room = document.getElementById("room");
const roomBack = document.getElementById("room-back");
const roomScroll = document.getElementById("room-scroll");
const roomEyebrow = document.getElementById("room-eyebrow");
const roomTitle = document.getElementById("room-title");
const roomLead = document.getElementById("room-lead");
const roomBody = document.getElementById("room-body");

let inside = false;
let busy = false;
let activeId = null;
let px = 0;
let py = 0;
let tx = 0;
let ty = 0;

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function boot() {
  buildHits();
  if (!reduce) buildBirds();
  requestAnimationFrame(() => {
    fresco.classList.add("is-ready");
    topbar.classList.add("is-on");
    if (!reduce) fresco.classList.add("is-hinting");
    if (hint) {
      hint.textContent = "Glowing rings mark places you can open";
      hint.classList.add("is-on");
    }
    if (!reduce) {
      fresco.classList.add("is-motion");
      startParallax();
    }
  });
}

function ensureSpotDefs(svg) {
  if (!svg || svg.querySelector("#hf-spot-glow")) return;
  const NS = "http://www.w3.org/2000/svg";
  const defs = document.createElementNS(NS, "defs");
  defs.innerHTML = `
    <radialGradient id="hf-spot-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.34)"/>
      <stop offset="45%" stop-color="rgba(255,248,235,0.14)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>`;
  svg.insertBefore(defs, svg.firstChild);
}

function buildHits() {
  const NS = "http://www.w3.org/2000/svg";
  const svg = mapHits?.ownerSVGElement || mapHits?.closest("svg");
  ensureSpotDefs(svg);

  spots.forEach((spot) => {
    const g = document.createElementNS(NS, "g");
    g.classList.add("spot");
    g.dataset.id = spot.id;

    const glow = document.createElementNS(NS, "circle");
    glow.classList.add("spot-glow");
    glow.setAttribute("cx", String(spot.cx));
    glow.setAttribute("cy", String(spot.cy));
    glow.setAttribute("r", String(spot.r * 1.15));
    glow.setAttribute("fill", "url(#hf-spot-glow)");

    const ring = document.createElementNS(NS, "circle");
    ring.classList.add("spot-ring");
    ring.setAttribute("cx", String(spot.cx));
    ring.setAttribute("cy", String(spot.cy));
    ring.setAttribute("r", String(spot.r * 0.92));

    const hit = document.createElementNS(NS, "circle");
    hit.classList.add("spot__hit");
    hit.setAttribute("cx", String(spot.cx));
    hit.setAttribute("cy", String(spot.cy));
    hit.setAttribute("r", String(spot.r));
    hit.setAttribute("tabindex", "0");
    hit.setAttribute("role", "link");
    hit.setAttribute("aria-label", spot.label);

    hit.addEventListener("pointerenter", () => setActive(spot.id));
    hit.addEventListener("pointerleave", () => clearActive(spot.id));
    hit.addEventListener("focus", () => setActive(spot.id));
    hit.addEventListener("blur", () => clearActive(spot.id));
    hit.addEventListener("click", () => goIn(spot.href));
    hit.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goIn(spot.href);
      }
    });

    g.append(glow, ring, hit);
    mapHits.appendChild(g);
  });
}

/** Tiny V-shaped birds drifting across the sky */
function buildBirds() {
  const NS = "http://www.w3.org/2000/svg";
  const sx = 4096 / 1024;
  const sy = 1600 / 400;
  const flock = [
    { x: 620, y: 70, s: 1.1, delay: 0, dur: 28 },
    { x: 640, y: 82, s: 0.95, delay: 1.2, dur: 30 },
    { x: 655, y: 68, s: 0.9, delay: 2.1, dur: 26 },
    { x: 670, y: 90, s: 0.85, delay: 0.6, dur: 32 },
    { x: 690, y: 75, s: 1.0, delay: 3.4, dur: 29 },
    { x: 780, y: 55, s: 0.75, delay: 8, dur: 36 },
    { x: 810, y: 62, s: 0.7, delay: 9.5, dur: 34 },
  ];

  flock.forEach((b, i) => {
    const g = document.createElementNS(NS, "g");
    g.classList.add("bird");
    g.style.setProperty("--sx", String(b.s));
    g.style.setProperty("--delay", `${b.delay}s`);
    g.style.setProperty("--dur", `${b.dur}s`);
    g.style.setProperty("--x", `${Math.round(b.x * sx)}px`);
    g.style.setProperty("--y", `${Math.round(b.y * sy)}px`);
    g.style.setProperty("--drift-y", `${Math.round((i % 2 === 0 ? -16 : 12) * sy)}px`);

    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", "M0 2 Q4 0 8 2 Q4 1.2 0 2 M8 2 Q12 0 16 2");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "rgba(26,43,37,0.55)");
    path.setAttribute("stroke-width", "1.2");
    path.setAttribute("stroke-linecap", "round");
    g.appendChild(path);
    birdsEl.appendChild(g);
  });
}

function setActive(id) {
  if (inside || busy) return;
  fresco.classList.remove("is-hinting");
  activeId = id;
  fresco.dataset.active = id;
  fresco.classList.add("is-hovering");
  document.querySelectorAll(".spot.is-hot").forEach((el) => el.classList.remove("is-hot"));
  document.querySelector(`.spot[data-id="${id}"]`)?.classList.add("is-hot");
  if (hint) hint.textContent = `Open ${spots.find((s) => s.id === id)?.label ?? "place"}`;
}

function clearActive(id) {
  if (activeId !== id) return;
  activeId = null;
  delete fresco.dataset.active;
  fresco.classList.remove("is-hovering");
  document.querySelector(`.spot[data-id="${id}"]`)?.classList.remove("is-hot");
}

function startParallax() {
  if (!finePointer) return;

  const bg = stage.querySelector(".layer--bg");
  const clouds = stage.querySelector(".layer--clouds");
  const fg = stage.querySelector(".layer--fg");
  const birds = stage.querySelector(".layer--birds");
  const map = document.getElementById("fresco-map");
  const aboutStage = aboutScroll?.querySelector(".about-bleed__stage");
  const aboutBg = aboutStage?.querySelector(".about-bleed__bg");
  const aboutClouds = aboutStage?.querySelector(".about-bleed__clouds");
  const aboutArt = aboutStage?.querySelector(".about-bleed__art");

  window.addEventListener(
    "pointermove",
    (e) => {
      if (busy) return;
      const trackEl =
        inside && !about.hidden
          ? aboutScroll || about
          : inside
            ? null
            : stage;
      if (!trackEl) return;
      const rect = trackEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      tx = (e.clientX - rect.left) / rect.width - 0.5;
      ty = (e.clientY - rect.top) / rect.height - 0.5;
    },
    { passive: true },
  );

  const tick = () => {
    if (!busy) {
      px += (tx - px) * 0.05;
      py += (ty - py) * 0.05;

      if (!inside) {
        if (bg) bg.style.transform = `translate3d(${px * -4}px, ${py * -2}px, 0) scale(1.03)`;
        if (clouds) clouds.style.transform = `translate3d(${px * -10}px, ${py * -3}px, 0)`;
        if (birds) birds.style.transform = `translate3d(${px * -14}px, ${py * -5}px, 0)`;
        // Keep hit map locked to the foreground art
        const fgMove = `translate3d(${px * -2}px, ${py * -1}px, 0)`;
        if (fg) fg.style.transform = fgMove;
        if (map) map.style.transform = fgMove;
      } else if (!about.hidden) {
        if (aboutBg) {
          aboutBg.style.transform = `translate3d(${px * -8}px, ${py * -4}px, 0) scale(1.08)`;
        }
        if (aboutClouds) {
          aboutClouds.style.transform = `translate3d(${px * -14}px, ${py * -5}px, 0)`;
        }
        if (aboutArt) {
          aboutArt.style.transform = `translate3d(${px * -3}px, calc(-5% + ${py * -1.5}px), 0)`;
        }
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, reduce ? 25 : ms));
}

async function goIn(id) {
  if (busy || inside) return;
  busy = true;
  clearActive(activeId);
  hint.classList.remove("is-on");
  topbar.classList.add("is-hide");
  fresco.classList.add("is-dimmed");
  document.body.classList.add("is-locked");

  if (id === "about") {
    about.hidden = false;
    about.setAttribute("aria-hidden", "false");
    aboutScroll.scrollTop = 0;
    await wait(16);
    about.classList.add("is-open");
    aboutBack.focus();
  } else {
    const data = placeholders[id];
    if (!data) {
      busy = false;
      fresco.classList.remove("is-dimmed");
      topbar.classList.remove("is-hide");
      hint.classList.add("is-on");
      document.body.classList.remove("is-locked");
      return;
    }
    roomEyebrow.textContent = data.eyebrow;
    roomTitle.textContent = data.title;
    roomLead.textContent = data.lead || "";
    room.dataset.layout = data.layout || "";

    if (data.layout === "services") {
      roomBody.innerHTML = `
        <ul class="gate__services">
          ${(data.services || [])
            .map(
              (s) => `
            <li>
              <h2>${s.title}</h2>
              <p>${s.items}</p>
            </li>`,
            )
            .join("")}
        </ul>`;
    } else if (data.layout === "contact") {
      roomBody.innerHTML = `
        <ul class="gate__contacts">
          ${(data.contacts || [])
            .map(
              (c) => `
            <li>
              <span>${c.label}</span>
              <a href="${c.href}">${c.value}</a>
            </li>`,
            )
            .join("")}
        </ul>`;
    } else if (data.layout === "cafe") {
      roomBody.innerHTML = `<p class="gate__tag">Creativity, from the hills.</p>`;
    } else {
      roomBody.innerHTML = "";
    }
    room.hidden = false;
    room.setAttribute("aria-hidden", "false");
    if (roomScroll) roomScroll.scrollTop = 0;
    await wait(16);
    room.classList.add("is-open");
    roomBack.focus();
  }

  await wait(reduce ? 40 : 520);
  inside = true;
  busy = false;
}

async function goOut() {
  if (!inside || busy) return;
  busy = true;

  about.classList.remove("is-open");
  room.classList.remove("is-open");
  await wait(reduce ? 40 : 420);

  about.hidden = true;
  about.setAttribute("aria-hidden", "true");
  room.hidden = true;
  room.setAttribute("aria-hidden", "true");
  roomBody.innerHTML = "";
  delete room.dataset.layout;

  fresco.classList.remove("is-dimmed");
  document.body.classList.remove("is-locked");
  topbar.classList.remove("is-hide");
  hint.classList.add("is-on");
  inside = false;
  busy = false;
}

aboutBack.addEventListener("click", goOut);
roomBack.addEventListener("click", goOut);
document.getElementById("about-scrim")?.addEventListener("click", goOut);
document.getElementById("room-scrim")?.addEventListener("click", goOut);
document.querySelectorAll(".gate__logo").forEach((el) => {
  el.addEventListener("click", (e) => {
    if (!inside) return;
    e.preventDefault();
    goOut();
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && inside) goOut();
});

[
  "/scene/hero-bg.png",
  "/scene/hero-fg.png",
  "/scene/clouds-1.png",
  "/scene/clouds-2.png",
  "/brand/logo.png?v=mark",
  "/interiors/about-bg.jpg?v=2",
  "/images/about-us.png?v=orig",
].forEach((src) => {
  const img = new Image();
  img.src = src;
});

void VIEW;
boot();
