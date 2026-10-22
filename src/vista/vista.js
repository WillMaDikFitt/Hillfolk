import gsap from 'gsap'

gsap.config({ force3D: true, nullTargetWarn: false })
/* Any hitch >100ms must NOT skip the tween (that felt like a hard cut) */
gsap.ticker.lagSmoothing(100, 16)

/**
 * Wave-like motion — sine eases rise and fall gradually (no sharp power curves).
 * Durations stay long enough for the S-curve to read.
 */
const MOTION = {
  roomIn: 1.2,
  roomOut: 1.05,
  vistaFade: 0.7,
  vistaFadeAt: 0.28,
  panelIn: 0.65,
  panelOut: 0.5,
  scrimIn: 0.55,
  scrimOut: 0.45,
  scroll: 0.55,
  easeRoom: 'sine.inOut',
  easePanel: 'sine.out',
  easePanelOut: 'sine.in',
  easeVista: 'sine.inOut',
  easeSoft: 'sine.inOut',
}

/** Iris veil (empty disc + box-shadow) — keeps clip-path off room PNGs */
function ensureRoomVeil(roomEl) {
  let veil = roomEl.querySelector('.room__veil')
  if (veil) return veil
  veil = document.createElement('div')
  veil.className = 'room__veil'
  veil.setAttribute('aria-hidden', 'true')
  roomEl.appendChild(veil)
  return veil
}

const roomWarm = new WeakMap()

function frames(n = 2) {
  return new Promise((resolve) => {
    const step = () => {
      n -= 1
      if (n <= 0) resolve()
      else requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })
}

/** Decode one image off the critical path (cache + bitmap) */
async function warmImage(img) {
  if (!img) return
  const url = img.currentSrc || img.src
  if (!url) return

  try {
    if (typeof createImageBitmap === 'function') {
      const res = await fetch(url, { credentials: 'same-origin' })
      if (res.ok) {
        const blob = await res.blob()
        const bitmap = await createImageBitmap(blob)
        bitmap.close()
      }
    }
  } catch {
    /* network / decode — fall through to img.decode */
  }

  try {
    if (!img.complete) {
      await new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true })
        img.addEventListener('error', resolve, { once: true })
      })
    }
    if (img.decode) await img.decode()
  } catch {
    /* ignore decode abort */
  }
}

/** Preload + decode every room__art in a room before animating into it */
function warmRoom(roomEl) {
  if (!roomEl) return Promise.resolve()
  let pending = roomWarm.get(roomEl)
  if (pending) return pending

  pending = Promise.all(
    [...roomEl.querySelectorAll('img.room__art')].map((img) => warmImage(img)),
  ).catch(() => {})

  roomWarm.set(roomEl, pending)
  return pending
}

function roomForSpotId(spotId) {
  if (spotId === 'about') return aboutRoom
  if (spotId === 'whatwedo') return whatwedoRoom
  if (spotId === 'services') return servicesRoom
  if (spotId === 'contact') return contactRoom
  return null
}

/** Idle-time warm of all interiors so the first click isn’t a decode hitch */
function startRoomWarmup() {
  const rooms = [aboutRoom, whatwedoRoom, servicesRoom, contactRoom].filter(Boolean)
  let i = 0
  const next = () => {
    if (i >= rooms.length) return
    const room = rooms[i++]
    warmRoom(room).finally(() => {
      if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(next, { timeout: 1200 })
      } else {
        window.setTimeout(next, 120)
      }
    })
  }
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(next, { timeout: 800 })
  } else {
    window.setTimeout(next, 200)
  }
}

/** Art space from reference plates: 1670 × 942 */
const SX = 1670 / 1024
const SY = 942 / 577

/** Circle hotspot in plate layout coords → vista art space */
function circ(cx, cy, r) {
  return {
    cx: Math.round(cx * SX),
    cy: Math.round(cy * SY),
    r: Math.round(r * ((SX + SY) / 2)),
  }
}

/** Home hill — About + Services on mid; What We Do pole + Contact on fg */
const spots = [
  {
    id: 'about',
    label: 'About Us',
    layer: 'mid',
    ...circ(512, 88, 72),
  },
  {
    id: 'services',
    label: 'Our Services',
    layer: 'mid',
    ...circ(349, 187, 70),
  },
  {
    id: 'whatwedo',
    label: 'What We Do',
    layer: 'fg',
    // Pole sign on v2-fg (red WHAT WE DO letters) — higher on the board
    ...circ(122, 335, 82),
  },
  {
    id: 'contact',
    label: 'Contact Us',
    layer: 'fg',
    ...circ(720, 410, 88),
  },
]

/** About studio — 1024×576; four wall / workspace stops */
const aboutSpots = [
  { id: 'brand', label: 'About Hillfolk', cx: 175, cy: 165, r: 58 },
  { id: 'studio', label: 'How we work', cx: 475, cy: 345, r: 72 },
  { id: 'team', label: 'Our team', cx: 780, cy: 285, r: 56 },
  { id: 'story', label: 'Our story', cx: 935, cy: 275, r: 48 },
]

/** What We Do poster — four lines on the hanging board (left) */
/** What We Do poster lines — viewBox 1024×576; poster ~x 225–491 */
const whatWeDoSpots = [
  { id: 'brand', label: 'Brand & Design', cx: 358, cy: 216, r: 52 },
  { id: 'digital', label: 'Digital & Video', cx: 358, cy: 268, r: 52 },
  { id: 'visual', label: 'Visual Communication', cx: 358, cy: 322, r: 52 },
  { id: 'story', label: 'Strategy & Storytelling', cx: 358, cy: 376, r: 52 },
]

/** Services billboard — five cards on the conveyor; viewBox 1024×576 */
const servicesSpots = [
  { id: 'strategy', label: 'Brand Strategy', cx: 300, cy: 350, r: 48, tag: 'below' },
  { id: 'design', label: 'Digital Design', cx: 412, cy: 350, r: 48, tag: 'below' },
  { id: 'story', label: 'Content & Storytelling', cx: 522, cy: 350, r: 48, tag: 'below' },
  { id: 'campaign', label: 'Campaign Creative', cx: 628, cy: 350, r: 48, tag: 'below' },
  { id: 'tech', label: 'Tech & Innovation', cx: 718, cy: 350, r: 48, tag: 'below' },
]

/** Contact — info board (left of door) + Connect guestbook (front right); viewBox 1024×576 */
const contactSpots = [
  { id: 'address', label: 'Contact info', cx: 280, cy: 240, r: 62 },
  { id: 'connect', label: 'Connect with us', cx: 790, cy: 410, r: 72 },
]

function ensureSpotDefs() {
  /* tags need no shared defs */
}

/** Vintage luggage / trail tag — eyelet + cord, not a UI pill */
function attachCircleSpot(g, spot, hitClass) {
  const ns = 'http://www.w3.org/2000/svg'
  const cx = spot.cx
  const cy = spot.cy
  const fs = Math.max(7, Math.min(10, spot.r * 0.12))
  const label = 'click here'
  const h = fs * 1.7
  const eye = h * 0.22
  const body = label.length * fs * 0.48 + fs * 1.1
  const notch = h * 0.38
  const w = eye * 2.6 + body + notch
  const below = spot.tag === 'below'
  const x = cx - w * 0.42
  const y = below
    ? cy + spot.r * 0.55
    : cy - spot.r * 0.5 - h - fs * 0.9
  // Slight unique tilt so tags feel placed, not stamped
  const tilt =
    ((spot.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 9) - 4

  const tag = document.createElementNS(ns, 'g')
  tag.classList.add('spot-tag')
  if (below) tag.classList.add('spot-tag--below')
  tag.setAttribute('transform', `rotate(${tilt} ${cx} ${cy})`)

  // Cord between eyelet and landmark
  const cord = document.createElementNS(ns, 'path')
  cord.classList.add('spot-tag__cord')
  const eyeCx = x + eye * 1.35
  const eyeCy = y + h / 2
  if (below) {
    cord.setAttribute(
      'd',
      `M ${eyeCx} ${eyeCy - eye * 0.85} Q ${eyeCx + fs * 0.15} ${cy + spot.r * 0.2}, ${cx} ${cy + spot.r * 0.12}`,
    )
  } else {
    cord.setAttribute(
      'd',
      `M ${eyeCx} ${eyeCy + eye * 0.85} Q ${eyeCx + fs * 0.2} ${cy - spot.r * 0.15}, ${cx} ${cy - spot.r * 0.08}`,
    )
  }

  // Luggage-tag silhouette: round eyelet end + pointed tip
  const bg = document.createElementNS(ns, 'path')
  bg.classList.add('spot-tag__bg')
  const r = h / 2
  const tipX = x + w
  const midY = y + h / 2
  bg.setAttribute(
    'd',
    [
      `M ${x + r} ${y}`,
      `L ${tipX - notch} ${y}`,
      `L ${tipX} ${midY}`,
      `L ${tipX - notch} ${y + h}`,
      `L ${x + r} ${y + h}`,
      `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
      'Z',
    ].join(' '),
  )

  const hole = document.createElementNS(ns, 'circle')
  hole.classList.add('spot-tag__hole')
  hole.setAttribute('cx', String(eyeCx))
  hole.setAttribute('cy', String(eyeCy))
  hole.setAttribute('r', String(eye))

  const stitch = document.createElementNS(ns, 'line')
  stitch.classList.add('spot-tag__stitch')
  stitch.setAttribute('x1', String(x + r * 1.85))
  stitch.setAttribute('y1', String(y + h * 0.28))
  stitch.setAttribute('x2', String(x + r * 1.85))
  stitch.setAttribute('y2', String(y + h * 0.72))

  const text = document.createElementNS(ns, 'text')
  text.classList.add('spot-tag__text')
  text.setAttribute('x', String(x + r * 2.15 + body * 0.42))
  text.setAttribute('y', String(midY + fs * 0.05))
  text.setAttribute('text-anchor', 'middle')
  text.setAttribute('dominant-baseline', 'middle')
  text.setAttribute('font-size', String(fs))
  text.textContent = label

  tag.appendChild(cord)
  tag.appendChild(bg)
  tag.appendChild(hole)
  tag.appendChild(stitch)
  tag.appendChild(text)

  const hit = document.createElementNS(ns, 'circle')
  hit.classList.add(hitClass)
  hit.setAttribute('cx', String(cx))
  hit.setAttribute('cy', String(cy))
  hit.setAttribute('r', String(spot.r))
  hit.setAttribute('tabindex', '0')

  g.appendChild(tag)
  g.appendChild(hit)
  return hit
}

const CLOUD_ASSETS = ['/scene/clouds-1.png', '/scene/clouds-2.png']

const vista = document.getElementById('vista')
const stage = document.getElementById('stage')
const world = document.getElementById('world')
const hint = document.getElementById('hint')
const toast = document.getElementById('toast')
const topbar = document.querySelector('.topbar')
const bg = document.getElementById('bg')
const mid = document.getElementById('mid')
const fg = document.getElementById('fg')
const clouds = document.getElementById('clouds')
const hitsMid = document.getElementById('hits-mid')
const hitsFg = document.getElementById('hits-fg')

const aboutRoom = document.getElementById('about-room')
const aboutBack = document.getElementById('about-back')
const aboutHint = document.getElementById('about-hint')
const aboutHitGroup = document.getElementById('about-hit-group')
const aboutCloudsEl = document.getElementById('about-clouds')
const whatwedoRoom = document.getElementById('whatwedo-room')
const whatwedoBack = document.getElementById('whatwedo-back')
const whatwedoCloudsEl = document.getElementById('whatwedo-clouds')
const whatwedoHint = document.getElementById('whatwedo-hint')
const whatwedoHitGroup = document.getElementById('whatwedo-hit-group')
const servicesRoom = document.getElementById('services-room')
const servicesBack = document.getElementById('services-back')
const servicesCloudsEl = document.getElementById('services-clouds')
const servicesHint = document.getElementById('services-hint')
const servicesHitGroup = document.getElementById('services-hit-group')
const contactRoom = document.getElementById('contact-room')
const contactBack = document.getElementById('contact-back')
const contactCloudsEl = document.getElementById('contact-clouds')
const contactHint = document.getElementById('contact-hint')
const contactHitGroup = document.getElementById('contact-hit-group')

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
const narrowMq = window.matchMedia('(max-width: 720px)')
const portraitMq = window.matchMedia('(orientation: portrait)')
const ROTATE_DISMISS_KEY = 'hf-rotate-dismissed'

const trailNav = document.getElementById('trail-nav')
const rotateHint = document.getElementById('rotate-hint')
const rotateContinue = document.getElementById('rotate-continue')
const WAYMARK_SHORT = {
  about: 'About',
  whatwedo: 'What We Do',
  services: 'Services',
  contact: 'Contact',
}

let rotateDismissed = false
try {
  rotateDismissed = sessionStorage.getItem(ROTATE_DISMISS_KEY) === '1'
} catch {
  rotateDismissed = false
}

let activeId = null
let px = 0
let py = 0
let tx = 0
let ty = 0
let toastTimer = 0
let cloudSprites = []
let aboutCloudSprites = []
let whatwedoCloudSprites = []
let servicesCloudSprites = []
let contactCloudSprites = []
let openRoomEl = null
let lastFrame = 0
let inside = false
let busy = false
let panelOpen = false
let activePanel = null
let enterOrigin = { x: '50%', y: '40%' }

function buildHits() {
  const ns = 'http://www.w3.org/2000/svg'
  ensureSpotDefs(hitsMid?.ownerSVGElement || hitsMid?.closest('svg'))
  ensureSpotDefs(hitsFg?.ownerSVGElement || hitsFg?.closest('svg'))
  spots.forEach((spot) => {
    const parent = spot.layer === 'mid' ? hitsMid : hitsFg
    ensureSpotDefs(parent?.ownerSVGElement || parent?.closest('svg'))
    const g = document.createElementNS(ns, 'g')
    g.classList.add('spot')
    g.dataset.id = spot.id

    const hit = attachCircleSpot(g, spot, 'spot__hit')
    hit.setAttribute('role', 'link')
    hit.setAttribute('aria-label', spot.label)

    hit.addEventListener('pointerenter', () => setActive(spot.id))
    hit.addEventListener('pointerleave', () => clearActive(spot.id))
    hit.addEventListener('focus', () => setActive(spot.id))
    hit.addEventListener('blur', () => clearActive(spot.id))
    hit.addEventListener('click', () => onClick(spot))
    hit.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick(spot)
      }
    })

    parent.appendChild(g)
  })
}

function buildRoomHits(group, room, list, ui) {
  if (!group) return
  const ns = 'http://www.w3.org/2000/svg'
  const svg = group.ownerSVGElement || group.closest('svg')
  ensureSpotDefs(svg)
  list.forEach((spot) => {
    const g = document.createElementNS(ns, 'g')
    g.classList.add('room-spot')
    g.dataset.id = spot.id

    const hit = attachCircleSpot(g, spot, 'room-spot__hit')
    hit.setAttribute('role', 'button')
    hit.setAttribute('aria-label', spot.label)

    hit.addEventListener('pointerenter', () => {
      if (panelOpen) return
      clearClickHints()
      ui.hoverId = spot.id
      room.classList.add('is-hovering')
      g.classList.add('is-hot')
      if (ui.hint) ui.hint.textContent = spot.label
    })
    hit.addEventListener('pointerleave', () => {
      if (ui.hoverId !== spot.id) return
      ui.hoverId = null
      room.classList.remove('is-hovering')
      g.classList.remove('is-hot')
      if (!panelOpen && ui.hint) ui.hint.textContent = ui.idleHint
    })
    hit.addEventListener('focus', () => {
      if (panelOpen) return
      ui.hoverId = spot.id
      room.classList.add('is-hovering')
      g.classList.add('is-hot')
    })
    hit.addEventListener('blur', () => {
      if (ui.hoverId !== spot.id) return
      ui.hoverId = null
      room.classList.remove('is-hovering')
      g.classList.remove('is-hot')
    })
    hit.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      showSection(ui, spot.id)
    })
    hit.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        showSection(ui, spot.id)
      }
    })

    group.appendChild(g)
  })
}

function clearClickHints() {
  vista.classList.remove('is-hinting')
  aboutRoom?.classList.remove('is-hinting')
  whatwedoRoom?.classList.remove('is-hinting')
  servicesRoom?.classList.remove('is-hinting')
  contactRoom?.classList.remove('is-hinting')
}

function setActive(id) {
  if (inside || busy) return
  clearClickHints()
  activeId = id
  vista.dataset.active = id
  vista.classList.add('is-hovering')
  document.querySelectorAll('.spot.is-hot').forEach((el) => el.classList.remove('is-hot'))
  document.querySelector(`.spot[data-id="${id}"]`)?.classList.add('is-hot')
  hint.textContent = `Open ${spots.find((s) => s.id === id)?.label ?? 'place'}`
  // Start decoding that room while the cursor hovers — before click
  const room = roomForSpotId(id)
  if (room) warmRoom(room)
}

function clearActive(id) {
  if (activeId !== id) return
  activeId = null
  delete vista.dataset.active
  vista.classList.remove('is-hovering')
  document.querySelector(`.spot[data-id="${id}"]`)?.classList.remove('is-hot')
  hint.textContent = 'Small tags mark places you can open'
}

function onClick(spot) {
  if (busy || inside) return
  if (spot.id === 'about') {
    enterRoom(aboutRoom, aboutBack, 'about')
    return
  }
  if (spot.id === 'whatwedo') {
    enterRoom(whatwedoRoom, whatwedoBack, 'whatwedo')
    return
  }
  if (spot.id === 'services') {
    enterRoom(servicesRoom, servicesBack, 'services')
    return
  }
  if (spot.id === 'contact') {
    enterRoom(contactRoom, contactBack, 'contact')
    return
  }
  toast.hidden = false
  toast.textContent = `${spot.label} — coming next on this draft`
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toast.hidden = true
  }, 2200)
}

function getBuildingOrigin(spotId) {
  const hit = document.querySelector(`.spot[data-id="${spotId}"] .spot__hit`)
  if (!hit) {
    return { x: '50%', y: '38%', worldX: '50%', worldY: '42%' }
  }
  const r = hit.getBoundingClientRect()
  const cx = r.left + r.width * 0.5
  const cy = r.top + r.height * 0.55
  const wr = world.getBoundingClientRect()
  return {
    x: `${Math.round(cx)}px`,
    y: `${Math.round(cy)}px`,
    worldX: `${(((cx - wr.left) / wr.width) * 100).toFixed(2)}%`,
    worldY: `${(((cy - wr.top) / wr.height) * 100).toFixed(2)}%`,
  }
}

function setActiveSection(ui, id, { pulse = false } = {}) {
  if (!id) return
  if (ui.activeId === id && !pulse) return
  ui.activeId = id

  ui.nav.forEach((btn) => {
    const on = btn.dataset.section === id
    btn.classList.toggle('is-active', on)
    btn.setAttribute('aria-current', on ? 'true' : 'false')
  })

  ui.sections.forEach((sec) => {
    const on = sec.dataset.section === id
    sec.classList.toggle('is-active', on)
    if (on && pulse && !reduce) {
      sec.classList.remove('is-pulse')
      requestAnimationFrame(() => {
        sec.classList.add('is-pulse')
        window.clearTimeout(ui.pulseTimer)
        ui.pulseTimer = window.setTimeout(() => sec.classList.remove('is-pulse'), 720)
      })
    }
  })
}

/** Pick the section whose top has crossed the reading line near the top of the scroller. */
function syncActiveFromScroll(ui, { pulse = false } = {}) {
  if (!ui?.sections?.length) return

  const { scrollTop, clientHeight, scrollHeight } = ui.scroll
  const maxScroll = Math.max(0, scrollHeight - clientHeight)

  // At the bottom, force the last section so short last blocks still activate.
  if (maxScroll > 0 && scrollTop >= maxScroll - 2) {
    const last = ui.sections[ui.sections.length - 1]
    setActiveSection(ui, last.dataset.section, { pulse })
    return
  }

  const marker = scrollTop + Math.min(56, clientHeight * 0.18)
  let current = ui.sections[0].dataset.section

  for (const sec of ui.sections) {
    if (sec.offsetTop <= marker) current = sec.dataset.section
    else break
  }

  setActiveSection(ui, current, { pulse })
}

function unlockSpy(ui) {
  ui.lockSpy = false
  window.clearTimeout(ui.lockTimer)
  syncActiveFromScroll(ui)
}

function scrollToSection(ui, id, instant = false) {
  const section = ui.sections.find((sec) => sec.dataset.section === id)
  if (!section) return

  ui.lockSpy = true
  window.clearTimeout(ui.lockTimer)
  setActiveSection(ui, id, { pulse: !instant })

  const top = Math.max(0, section.offsetTop - 12)
  gsap.killTweensOf(ui.scroll)

  if (instant || reduce) {
    ui.scroll.scrollTop = top
    requestAnimationFrame(() => unlockSpy(ui))
    return
  }

  gsap.to(ui.scroll, {
    scrollTop: top,
    duration: reduce ? 0.01 : MOTION.scroll,
    ease: MOTION.easePanel,
    overwrite: true,
    onComplete: () => unlockSpy(ui),
  })
  ui.lockTimer = window.setTimeout(() => unlockSpy(ui), reduce ? 40 : 650)
}

function openPanel(ui, thenScrollId) {
  if (busy || !ui) return

  activePanel = ui
  ui.panel.hidden = false
  ui.panel.classList.add('is-open')
  ui.panel.setAttribute('aria-hidden', 'false')
  ui.room.classList.add('is-panel-open')
  panelOpen = true
  syncTrailMode()

  const label = ui.spots.find((s) => s.id === thenScrollId)?.label
  if (ui.hint) ui.hint.textContent = label ?? ui.idleHint

  const mobile = narrowMq.matches
  gsap.killTweensOf([ui.panel, ui.card, ui.scrim])
  gsap.set(ui.panel, { autoAlpha: 1 })
  gsap.set(ui.scrim, { autoAlpha: 0 })
  if (mobile) {
    gsap.set(ui.card, { y: 40, x: 0, autoAlpha: 0, force3D: true })
  } else {
    gsap.set(ui.card, { x: 28, y: 8, autoAlpha: 0, force3D: true })
  }

  scrollToSection(ui, thenScrollId || ui.spots[0]?.id, true)

  gsap
    .timeline({
      defaults: { force3D: true },
      onComplete: () => {
        ui.closeBtn.focus()
        if (!reduce) setActiveSection(ui, thenScrollId || ui.spots[0]?.id, { pulse: true })
      },
    })
    .to(ui.scrim, { duration: reduce ? 0.1 : MOTION.scrimIn, autoAlpha: 1, ease: MOTION.easeSoft }, 0)
    .to(
      ui.card,
      {
        duration: reduce ? 0.16 : MOTION.panelIn,
        x: 0,
        y: 0,
        autoAlpha: 1,
        ease: MOTION.easePanel,
      },
      0,
    )
}

function showSection(ui, id) {
  if (!inside || busy) return
  if (!panelOpen || activePanel !== ui) {
    openPanel(ui, id)
    return
  }
  scrollToSection(ui, id)
  const label = ui.spots.find((s) => s.id === id)?.label
  if (label && ui.hint) ui.hint.textContent = label
}

function closePanel({ onComplete, quick = false } = {}) {
  if (!panelOpen || !activePanel) {
    onComplete?.()
    return
  }
  const ui = activePanel
  const dur = reduce || quick ? 0.1 : MOTION.panelOut
  const scrimDur = reduce || quick ? 0.08 : MOTION.scrimOut
  const mobile = narrowMq.matches

  gsap.killTweensOf([ui.panel, ui.card, ui.scrim, ui.scroll])
  gsap
    .timeline({
      defaults: { force3D: true },
      onComplete: () => {
        ui.panel.hidden = true
        ui.panel.classList.remove('is-open')
        ui.panel.setAttribute('aria-hidden', 'true')
        ui.room.classList.remove('is-panel-open')
        panelOpen = false
        activePanel = null
        if (ui.hint) {
          ui.hint.textContent = narrowMq.matches ? 'Pick a stamp on the trail' : ui.idleHint
        }
        gsap.set([ui.panel, ui.card, ui.scrim], { clearProps: 'transform,opacity,visibility' })
        syncTrailMode()
        onComplete?.()
      },
    })
    .to(
      ui.card,
      {
        duration: dur,
        x: mobile ? 0 : 18,
        y: mobile ? 24 : 6,
        autoAlpha: 0,
        ease: MOTION.easePanelOut,
      },
      0,
    )
    .to(ui.scrim, { duration: scrimDur, autoAlpha: 0, ease: MOTION.easeSoft }, 0)
}

function bindPanel(room, panel, hint, spots, idleHint) {
  const ui = {
    room,
    panel,
    card: panel.querySelector('.panel__card'),
    scroll: panel.querySelector('.panel__scroll'),
    closeBtn: panel.querySelector('.panel__close'),
    scrim: panel.querySelector('.panel__scrim'),
    nav: [...panel.querySelectorAll('.panel__nav-btn')],
    sections: [...panel.querySelectorAll('.panel__section')],
    hint,
    spots,
    idleHint,
    hoverId: null,
    activeId: null,
    lockSpy: false,
    lockTimer: 0,
    pulseTimer: 0,
    spyRaf: 0,
  }

  ui.closeBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    closePanel()
  })
  ui.scrim.addEventListener('click', (e) => {
    e.stopPropagation()
    closePanel()
  })
  ui.card.addEventListener('click', (e) => e.stopPropagation())
  ui.nav.forEach((btn) => {
    btn.setAttribute('aria-current', 'false')
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const id = btn.dataset.section
      scrollToSection(ui, id)
      const label = spots.find((s) => s.id === id)?.label
      if (label && hint) hint.textContent = label
    })
  })

  ui.scroll.addEventListener(
    'scroll',
    () => {
      if (ui.lockSpy || activePanel !== ui) return
      if (ui.spyRaf) return
      ui.spyRaf = requestAnimationFrame(() => {
        ui.spyRaf = 0
        const prev = ui.activeId
        syncActiveFromScroll(ui)
        if (ui.activeId && ui.activeId !== prev) {
          const label = spots.find((s) => s.id === ui.activeId)?.label
          if (label && hint) hint.textContent = label
        }
      })
    },
    { passive: true },
  )

  return ui
}

/**
 * Enter a room. Large PNGs (~25MB) must be decoded BEFORE the tween starts,
 * otherwise the main-thread hitch makes GSAP jump and it looks like a hard cut.
 */
function enterRoom(roomEl, backBtn, spotId) {
  if (busy || inside || !roomEl) return
  busy = true
  inside = true
  openRoomEl = roomEl
  clearActive(activeId)
  clearClickHints()
  tx = 0
  ty = 0
  px = 0
  py = 0
  vista.classList.add('is-leaving', 'is-animating')
  document.documentElement.classList.add('is-room-animating')
  topbar?.classList.add('is-dim')
  hint.textContent = 'Stepping inside…'
  syncTrailMode()

  enterOrigin = getBuildingOrigin(spotId)
  const veil = ensureRoomVeil(roomEl)

  // Cover immediately so decode work never flashes a sudden room
  roomEl.hidden = false
  roomEl.classList.add('is-open')
  roomEl.setAttribute('aria-hidden', 'false')
  vista.classList.remove('is-parked')
  gsap.killTweensOf([world, roomEl, vista, veil])
  gsap.set(world, {
    transformOrigin: `${enterOrigin.worldX} ${enterOrigin.worldY}`,
    force3D: true,
  })
  gsap.set(roomEl, {
    autoAlpha: 1,
    scale: 1.02,
    transformOrigin: `${enterOrigin.x} ${enterOrigin.y}`,
    force3D: true,
  })
  gsap.set(veil, {
    autoAlpha: 1,
    left: enterOrigin.x,
    top: enterOrigin.y,
    xPercent: -50,
    yPercent: -50,
    width: 0,
    height: 0,
  })

  void (async () => {
    await warmRoom(roomEl)
    await frames(2)

    if (openRoomEl !== roomEl) return

    const dur = reduce ? 0.22 : MOTION.roomIn
    gsap
      .timeline({
        defaults: { force3D: true, ease: MOTION.easeRoom },
        onComplete: () => {
          busy = false
          vista.classList.remove('is-animating')
          vista.classList.add('is-parked')
          document.documentElement.classList.remove('is-room-animating')
          gsap.set(roomEl, { clearProps: 'scale,transformOrigin' })
          gsap.set(veil, { autoAlpha: 0, width: 0, height: 0 })
          if (!reduce && !narrowMq.matches) roomEl.classList.add('is-hinting')
          backBtn?.focus()
          syncTrailMode()
          if (narrowMq.matches && roomEl.querySelector('.room__hint')) {
            roomEl.querySelector('.room__hint').textContent = 'Pick a stamp on the trail'
          }
        },
      })
      .to(world, { duration: dur, scale: 1.36 }, 0)
      .to(roomEl, { duration: dur, scale: 1 }, 0)
      .to(veil, { duration: dur, width: '280vmax', height: '280vmax' }, 0)
      .to(
        vista,
        {
          duration: reduce ? 0.12 : MOTION.vistaFade,
          autoAlpha: 0,
          ease: MOTION.easeVista,
        },
        reduce ? 0.04 : MOTION.vistaFadeAt,
      )
  })()
}

function runExitRoom() {
  busy = true
  const roomEl = openRoomEl
  const origin = enterOrigin
  if (!roomEl) {
    busy = false
    return
  }

  vista.classList.add('is-animating')
  document.documentElement.classList.add('is-room-animating')
  roomEl.classList.remove('is-hinting')
  tx = 0
  ty = 0
  px = 0
  py = 0

  const veil = ensureRoomVeil(roomEl)
  vista.classList.remove('is-parked')
  gsap.killTweensOf([world, roomEl, vista, veil])
  gsap.set(vista, { autoAlpha: 1 })
  gsap.set(world, {
    scale: 1.36,
    transformOrigin: `${origin.worldX} ${origin.worldY}`,
    force3D: true,
  })
  gsap.set(roomEl, {
    scale: 1,
    transformOrigin: `${origin.x} ${origin.y}`,
    force3D: true,
  })
  gsap.set(veil, {
    autoAlpha: 1,
    left: origin.x,
    top: origin.y,
    xPercent: -50,
    yPercent: -50,
    width: '280vmax',
    height: '280vmax',
  })

  const dur = reduce ? 0.18 : MOTION.roomOut
  gsap
    .timeline({
      defaults: { force3D: true, ease: MOTION.easeRoom },
      onComplete: () => {
        roomEl.hidden = true
        roomEl.setAttribute('aria-hidden', 'true')
        roomEl.classList.remove('is-open', 'is-hovering', 'is-panel-open', 'is-hinting')
        gsap.set(vista, { clearProps: 'autoAlpha' })
        gsap.set(roomEl, { clearProps: 'autoAlpha,scale,transformOrigin' })
        gsap.set(world, { clearProps: 'scale,transformOrigin' })
        gsap.set(veil, { autoAlpha: 0, width: 0, height: 0 })
        vista.classList.remove('is-leaving', 'is-animating')
        document.documentElement.classList.remove('is-room-animating')
        topbar?.classList.remove('is-dim')
        inside = false
        openRoomEl = null
        panelOpen = false
        busy = false
        syncTrailMode()
        if (!narrowMq.matches && !reduce) vista.classList.add('is-hinting')
        if (!narrowMq.matches) {
          hint.textContent = 'Small tags mark places you can open'
        }
      },
    })
    .to(veil, { duration: dur, width: 0, height: 0 }, 0)
    .to(roomEl, { duration: dur, scale: 1.02 }, 0)
    .to(world, { duration: dur, scale: 1 }, 0)
}

function exitRoom() {
  if (busy || !inside || !openRoomEl) return
  if (panelOpen) {
    closePanel({ quick: true, onComplete: runExitRoom })
    return
  }
  runExitRoom()
}

function spawnCloudSprites(host, className, count, store) {
  if (!host) return
  host.replaceChildren()
  store.length = 0

  for (let i = 0; i < count; i++) {
    const img = document.createElement('img')
    img.className = className
    img.src = CLOUD_ASSETS[i % CLOUD_ASSETS.length]
    img.alt = ''
    img.draggable = false

    const widthPct = 18 + Math.random() * 22
    const topPct = 4 + Math.random() * 48
    const opacity = 0.5 + Math.random() * 0.4
    img.style.setProperty('--w', `${widthPct}%`)
    img.style.setProperty('--o', opacity.toFixed(2))
    img.style.setProperty('--top', `${topPct}%`)
    if (className === 'cloud-sprite') {
      img.style.setProperty('--cloud-w', `${widthPct}%`)
      img.style.setProperty('--cloud-o', opacity.toFixed(2))
      img.style.top = `${topPct}%`
    }

    const eastWind = Math.random() > 0.3
    const speed = 0.005 + Math.random() * 0.012

    store.push({
      el: img,
      x: Math.random() * 120 - 20,
      vx: eastWind ? speed : -speed,
      bobAmp: 0.15 + Math.random() * 0.7,
      bobSpeed: 0.0005 + Math.random() * 0.0012,
      swayAmp: 0.04 + Math.random() * 0.16,
      swaySpeed: 0.00035 + Math.random() * 0.0009,
      phase: Math.random() * Math.PI * 2,
      swayPhase: Math.random() * Math.PI * 2,
      flip: Math.random() > 0.5 ? -1 : 1,
      depth: 0.5 + Math.random() * 0.5,
    })

    host.appendChild(img)
  }
}

function buildClouds() {
  spawnCloudSprites(clouds, 'cloud-sprite', reduce ? 3 : 8, cloudSprites)
}

function buildAboutClouds() {
  spawnCloudSprites(aboutCloudsEl, 'room__skycloud', reduce ? 2 : 4, aboutCloudSprites)
}

function buildWhatWeDoClouds() {
  spawnCloudSprites(whatwedoCloudsEl, 'room__skycloud', reduce ? 2 : 4, whatwedoCloudSprites)
}

function buildServicesClouds() {
  spawnCloudSprites(servicesCloudsEl, 'room__skycloud', reduce ? 2 : 4, servicesCloudSprites)
}

function buildContactClouds() {
  spawnCloudSprites(contactCloudsEl, 'room__skycloud', reduce ? 2 : 4, contactCloudSprites)
}

function tickSpriteClouds(list, dt) {
  list.forEach((c) => {
    c.x += c.vx * dt
    c.phase += c.bobSpeed * dt
    c.swayPhase += c.swaySpeed * dt

    if (c.x > 112) c.x = -30 - Math.random() * 10
    if (c.x < -34) c.x = 108 + Math.random() * 10

    const bob = Math.sin(c.phase) * c.bobAmp
    const sway = Math.sin(c.swayPhase) * c.swayAmp
    const scale = 0.9 + c.depth * 0.14

    c.el.style.transform = `translate3d(calc(${c.x}% + ${sway}%), ${bob}%, 0) scale(${scale * c.flip}, ${scale})`
  })
}

function tickClouds(dt) {
  if (!inside) tickSpriteClouds(cloudSprites, dt)
  else if (openRoomEl === aboutRoom) tickSpriteClouds(aboutCloudSprites, dt)
  else if (openRoomEl === whatwedoRoom) tickSpriteClouds(whatwedoCloudSprites, dt)
  else if (openRoomEl === servicesRoom) tickSpriteClouds(servicesCloudSprites, dt)
  else if (openRoomEl === contactRoom) tickSpriteClouds(contactCloudSprites, dt)
}

function applyRoomParallax(room, x, y) {
  if (!room) return
  // Contact art displays as-is — no parallax shift / scale
  if (room.id === 'contact-room') return

  const roomBg = room.querySelector('.room__art--bg')
  const roomClouds = room.querySelector('.room__skyclouds')
  const aboutPlate = room.querySelector('.about-plate')
  const containPlate = room.querySelector('.contain-plate')

  if (roomBg) {
    roomBg.style.transform = `translate3d(${x * -8}px, ${y * -4}px, 0) scale(1.06)`
  }
  if (roomClouds) {
    roomClouds.style.transform = `translate3d(${x * -14}px, ${y * -5}px, 0)`
  }

  // Move whole plate (art + hits together) so pointers stay locked to landmarks
  if (aboutPlate) {
    aboutPlate.style.transform = `translate3d(${x * -3}px, calc(-5% + ${y * -1.5}px), 0)`
    return
  }
  if (containPlate) {
    containPlate.style.transform = `translate(-50%, -50%) translate3d(${x * -4}px, ${y * -2}px, 0)`
  }
}

function startMotion() {
  lastFrame = performance.now()

  const loop = (now) => {
    const dt = Math.min(48, now - lastFrame) / 16.667
    lastFrame = now

    // Freeze parallax / clouds during panel + room transitions so GSAP stays buttery
    if (!panelOpen && !busy) {
      if (!reduce) tickClouds(dt)

      px += (tx - px) * 0.055
      py += (ty - py) * 0.055

      if (!inside) {
        if (clouds) clouds.style.transform = `translate3d(${px * -10}px, ${py * -3}px, 0)`
        if (bg) bg.style.transform = `translate3d(${px * -4}px, calc(-28% + ${py * -2}px), 0) scale(1.12)`
        if (mid) mid.style.transform = `translate3d(${px * -10}px, calc(4% + ${py * -4}px), 0) scale(0.88)`
        if (fg) fg.style.transform = `translate3d(${px * -18}px, calc(-4% + ${py * -7}px), 0) scale(1.03)`
      } else if (openRoomEl) {
        applyRoomParallax(openRoomEl, px, py)
      }
    }

    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}

function startParallaxInput() {
  if (finePointer && !reduce) {
    window.addEventListener(
      'pointermove',
      (e) => {
        if (busy || narrowMq.matches) return
        const trackEl =
          inside && openRoomEl
            ? openRoomEl.querySelector('.room__frame') || openRoomEl
            : stage
        const rect = trackEl.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        tx = (e.clientX - rect.left) / rect.width - 0.5
        ty = (e.clientY - rect.top) / rect.height - 0.5
      },
      { passive: true },
    )
  }

  // Mobile: drag the hill / room for a light pan
  let panId = null
  let panX = 0
  let panY = 0
  const onPanTarget = (e) => {
    if (!narrowMq.matches || busy || panelOpen || reduce) return
    if (e.target.closest?.('.trail-nav, .trail-stamps, .room__back, .panel, .topbar, a, button')) {
      return
    }
    if (!e.target.closest?.('#stage, .room__frame')) return
    panId = e.pointerId
    panX = e.clientX
    panY = e.clientY
  }
  const onPanMove = (e) => {
    if (panId !== e.pointerId || !narrowMq.matches) return
    const dx = (e.clientX - panX) / (window.innerWidth || 1)
    const dy = (e.clientY - panY) / (window.innerHeight || 1)
    panX = e.clientX
    panY = e.clientY
    tx = Math.max(-0.45, Math.min(0.45, tx - dx * 0.9))
    ty = Math.max(-0.35, Math.min(0.35, ty - dy * 0.55))
  }
  const onPanEnd = (e) => {
    if (panId !== e.pointerId) return
    panId = null
  }
  document.addEventListener('pointerdown', onPanTarget, { passive: true })
  window.addEventListener('pointermove', onPanMove, { passive: true })
  window.addEventListener('pointerup', onPanEnd, { passive: true })
  window.addEventListener('pointercancel', onPanEnd, { passive: true })
}

function buildTrailNav() {
  if (!trailNav) return
  trailNav.replaceChildren()
  const post = document.createElement('div')
  post.className = 'trail-nav__post'
  post.setAttribute('aria-hidden', 'true')

  const row = document.createElement('div')
  row.className = 'trail-nav__row'

  spots.forEach((spot, i) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'trail-nav__mark'
    btn.dataset.id = spot.id
    btn.setAttribute('aria-label', spot.label)
    const num = String(i + 1).padStart(2, '0')
    btn.innerHTML = `<span class="trail-nav__num">${num}</span><span class="trail-nav__label">${WAYMARK_SHORT[spot.id] ?? spot.label}</span>`
    btn.addEventListener('pointerenter', () => {
      const room = roomForSpotId(spot.id)
      if (room) warmRoom(room)
    })
    btn.addEventListener('click', () => {
      if (busy || inside) return
      onClick(spot)
    })
    row.appendChild(btn)
  })

  trailNav.appendChild(post)
  trailNav.appendChild(row)
}

function buildRoomTrail(trailEl, list, ui) {
  if (!trailEl || !ui) return
  trailEl.replaceChildren()
  list.forEach((spot, i) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'trail-stamps__mark'
    btn.dataset.id = spot.id
    btn.setAttribute('aria-label', spot.label)
    const num = String(i + 1).padStart(2, '0')
    btn.innerHTML = `<span class="trail-stamps__num">${num}</span><span class="trail-stamps__label">${spot.label}</span>`
    btn.addEventListener('click', () => {
      if (!inside || busy) return
      showSection(ui, spot.id)
    })
    trailEl.appendChild(btn)
  })
}

function syncRotateHint() {
  const show = narrowMq.matches && portraitMq.matches && !rotateDismissed
  if (!rotateHint) return
  rotateHint.hidden = !show
  rotateHint.setAttribute('aria-hidden', show ? 'false' : 'true')
  if (show) {
    rotateContinue?.focus?.({ preventScroll: true })
  }
}

function dismissRotateHint() {
  rotateDismissed = true
  try {
    sessionStorage.setItem(ROTATE_DISMISS_KEY, '1')
  } catch {
    /* private mode */
  }
  syncRotateHint()
}

function syncTrailMode() {
  const on = narrowMq.matches
  document.documentElement.classList.toggle('is-trail-nav', on)
  vista?.classList.toggle('is-trail-nav', on)
  ;[aboutRoom, whatwedoRoom, servicesRoom, contactRoom].forEach((room) => {
    room?.classList.toggle('is-trail-nav', on)
  })

  if (trailNav) {
    trailNav.hidden = !on || inside
    trailNav.setAttribute('aria-hidden', on && !inside ? 'false' : 'true')
  }

  const trails = [
    [document.getElementById('about-trail'), aboutRoom],
    [document.getElementById('whatwedo-trail'), whatwedoRoom],
    [document.getElementById('services-trail'), servicesRoom],
    [document.getElementById('contact-trail'), contactRoom],
  ]
  trails.forEach(([el, room]) => {
    if (!el) return
    const show = on && inside && openRoomEl === room && !panelOpen
    el.hidden = !show
    el.setAttribute('aria-hidden', show ? 'false' : 'true')
  })

  syncRotateHint()

  if (on) {
    if (!inside) {
      hint.textContent = 'Pick a waymark on the trail'
      hint.classList.add('is-on')
    }
    clearClickHints()
  } else if (!inside && !busy) {
    hint.textContent = 'Small tags mark places you can open'
  }
}

const aboutPanelUi = bindPanel(
  aboutRoom,
  document.getElementById('about-panel'),
  aboutHint,
  aboutSpots,
  'Small tags mark places you can open',
)
const whatwedoPanelUi = bindPanel(
  whatwedoRoom,
  document.getElementById('whatwedo-panel'),
  whatwedoHint,
  whatWeDoSpots,
  'Tags mark each line on the poster',
)
const servicesPanelUi = bindPanel(
  servicesRoom,
  document.getElementById('services-panel'),
  servicesHint,
  servicesSpots,
  'Tags mark each service card',
)
const contactPanelUi = bindPanel(
  contactRoom,
  document.getElementById('contact-panel'),
  contactHint,
  contactSpots,
  'Tags mark the board and the guestbook',
)

aboutBack.addEventListener('click', () => {
  if (panelOpen) closePanel()
  else exitRoom()
})
whatwedoBack.addEventListener('click', () => {
  if (panelOpen) closePanel()
  else exitRoom()
})
servicesBack.addEventListener('click', () => {
  if (panelOpen) closePanel()
  else exitRoom()
})
contactBack.addEventListener('click', () => {
  if (panelOpen) closePanel()
  else exitRoom()
})

const contactForm = document.getElementById('contact-form')
const contactFormNote = document.getElementById('contact-form-note')
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault()
  contactForm.classList.add('is-sent')
  const submitBtn = contactForm.querySelector('.panel__submit')
  if (submitBtn) submitBtn.textContent = 'Sent'
  if (contactFormNote) contactFormNote.hidden = false
})

window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || !inside || busy) return
  if (panelOpen) closePanel()
  else exitRoom()
})

buildHits()
buildRoomHits(aboutHitGroup, aboutRoom, aboutSpots, aboutPanelUi)
buildRoomHits(whatwedoHitGroup, whatwedoRoom, whatWeDoSpots, whatwedoPanelUi)
buildRoomHits(servicesHitGroup, servicesRoom, servicesSpots, servicesPanelUi)
buildRoomHits(contactHitGroup, contactRoom, contactSpots, contactPanelUi)
buildTrailNav()
buildRoomTrail(document.getElementById('about-trail'), aboutSpots, aboutPanelUi)
buildRoomTrail(document.getElementById('whatwedo-trail'), whatWeDoSpots, whatwedoPanelUi)
buildRoomTrail(document.getElementById('services-trail'), servicesSpots, servicesPanelUi)
buildRoomTrail(document.getElementById('contact-trail'), contactSpots, contactPanelUi)
buildClouds()
buildAboutClouds()
buildWhatWeDoClouds()
buildServicesClouds()
buildContactClouds()
startParallaxInput()

const onViewportModeChange = () => syncTrailMode()
if (typeof narrowMq.addEventListener === 'function') {
  narrowMq.addEventListener('change', onViewportModeChange)
  portraitMq.addEventListener('change', onViewportModeChange)
} else {
  narrowMq.addListener(onViewportModeChange)
  portraitMq.addListener(onViewportModeChange)
}
rotateContinue?.addEventListener('click', dismissRotateHint)
syncTrailMode()

requestAnimationFrame(() => {
  vista.classList.add('is-ready')
  if (!narrowMq.matches && !reduce) vista.classList.add('is-hinting')
  if (!narrowMq.matches) {
    hint.textContent = 'Small tags mark places you can open'
  }
  hint.classList.add('is-on')
  startMotion()
  startRoomWarmup()
})
