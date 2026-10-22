import { useCallback, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Experience } from './Experience'
import { places } from './content'

const INTERIORS = new Set(['about', 'services', 'cafe', 'contact'])

export default function App() {
  const [started, setStarted] = useState(false)
  const [overview, setOverview] = useState(false)
  const [scene, setScene] = useState('town')
  const [interiorId, setInteriorId] = useState('about')
  const [nearPlace, setNearPlace] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [guideTarget, setGuideTarget] = useState(null)
  const [guideId, setGuideId] = useState(null)
  const [destinationId, setDestinationId] = useState(null)
  const [guiding, setGuiding] = useState(false)
  const [playerPose, setPlayerPose] = useState(null)
  const [visited, setVisited] = useState(() => new Set())
  const [nearExit, setNearExit] = useState(false)

  const hint = useMemo(() => {
    if (!started) return 'Drive the hillside town'
    if (scene === 'entering') return 'Stepping inside…'
    if (scene === 'leaving') return 'Back on the road…'
    if (INTERIORS.has(scene)) {
      if (nearExit) return 'At the door — Enter or Esc to leave'
      return 'Walk around — info is on the walls & tables'
    }
    if (guiding) return 'Driving there — steer to take over'
    if (overview) return 'Overview — pick a destination'
    if (nearPlace) return `Stopped at ${nearPlace.label} — open it`
    if (destinationId) {
      const p = places.find((x) => x.id === destinationId)
      return `Heading to ${p?.label ?? 'place'} — follow the arrow`
    }
    return 'WASD drive · stop in a ring · Enter opens'
  }, [started, scene, overview, nearPlace, guiding, destinationId, nearExit])

  const markVisited = useCallback((id) => {
    setVisited((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const enterBuilding = useCallback(
    (id) => {
      if (!started || scene !== 'town') return
      if (!INTERIORS.has(id)) return
      setGuideTarget(null)
      setGuideId(null)
      setGuiding(false)
      setDestinationId(null)
      setOverview(false)
      setNearPlace(null)
      setInteriorId(id)
      setScene('entering')
      markVisited(id)
    },
    [started, scene, markVisited],
  )

  const exitBuilding = useCallback(() => {
    setNearExit(false)
    setScene('leaving')
  }, [])

  const onArrive = useCallback((next) => {
    setScene(next)
    setNearExit(false)
  }, [])

  const startExploring = useCallback(() => {
    setStarted(true)
    setOverview(false)
  }, [])

  const guideTo = useCallback(
    (id) => {
      const place = places.find((p) => p.id === id)
      if (!place || scene !== 'town') return
      setOverview(false)
      setGuideId(id)
      setDestinationId(id)
      setGuideTarget([place.position[0], 0, place.position[2] + 2.35])
      setGuiding(true)
      setNearPlace(null)
    },
    [scene],
  )

  /** Click building: open if parked in its ring, otherwise set route & auto-drive. */
  const selectBuilding = useCallback(
    (id) => {
      if (!started || scene !== 'town') return
      if (nearPlace?.id === id) {
        enterBuilding(id)
        return
      }
      guideTo(id)
    },
    [started, scene, nearPlace, enterBuilding, guideTo],
  )

  const onGuideArrive = useCallback((reason) => {
    setGuiding(false)
    setGuideTarget(null)
    // Park only — Zesiger waits for Enter / tap to open
    if (reason === 'parked' && guideId) {
      const place = places.find((p) => p.id === guideId)
      if (place) setNearPlace(place)
    }
    if (reason === 'cancel') {
      setGuideId(null)
    }
  }, [guideId])

  useEffect(() => {
    const onKey = (e) => {
      if (!started) {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault()
          startExploring()
        }
        return
      }

      if (e.code === 'KeyO' && (scene === 'town' || overview)) {
        e.preventDefault()
        setOverview((v) => !v)
        return
      }

      if (e.code === 'KeyF' && scene === 'town') {
        e.preventDefault()
        if (nearPlace) guideTo(nearPlace.id)
        else setOverview(true)
        return
      }

      if (e.code === 'Escape') {
        if (guiding) {
          setGuiding(false)
          setGuideTarget(null)
          setGuideId(null)
          return
        }
        if (INTERIORS.has(scene) || scene === 'entering') {
          exitBuilding()
          return
        }
        if (overview) setOverview(false)
        else if (destinationId) setDestinationId(null)
        return
      }

      if (e.code === 'Enter' && INTERIORS.has(scene) && nearExit) {
        e.preventDefault()
        exitBuilding()
        return
      }

      if (e.code === 'Enter' && scene === 'town' && !overview) {
        const target = nearPlace || hovered
        if (target?.enterable) {
          e.preventDefault()
          enterBuilding(target.id)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    started,
    scene,
    overview,
    nearPlace,
    nearExit,
    hovered,
    guiding,
    destinationId,
    enterBuilding,
    exitBuilding,
    startExploring,
    guideTo,
  ])

  const progress = visited.size
  const destLabel = places.find((p) => p.id === destinationId)?.label

  return (
    <div className="shell">
      <header className="topbar">
        <a className="topbar__brand" href="/town3d.html" aria-label="Hillfolk 3D home">
          <p className="topbar__mark">Hillfolk</p>
          <p className="topbar__tag">Creativity from the hills</p>
        </a>
        <div className="topbar__actions">
          {(INTERIORS.has(scene) || scene === 'entering') && (
            <button className="btn" type="button" onClick={exitBuilding}>
              Back to the hill
            </button>
          )}
          {started && scene === 'town' && (
            <>
              <button className="btn btn--ghost" type="button" onClick={() => setOverview((v) => !v)}>
                {overview ? 'Drop down' : 'Overview'}
                <kbd>O</kbd>
              </button>
              <button
                className="btn btn--ghost"
                type="button"
                onClick={() => {
                  if (nearPlace) guideTo(nearPlace.id)
                  else setOverview(true)
                }}
              >
                Drive to…
                <kbd>F</kbd>
              </button>
            </>
          )}
          <p className="topbar__hint">{hint}</p>
        </div>
      </header>

      {started && scene === 'town' && destinationId && !nearPlace && (
        <div className="route-chip">
          <span className="route-chip__arrow" aria-hidden="true">
            ▲
          </span>
          <span>{guiding ? 'Driving to' : 'Route'} {destLabel}</span>
        </div>
      )}

      <div className="canvas-wrap">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [0, 7, 16], fov: 42, near: 0.1, far: 220 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <color
            attach="background"
            args={[
              scene === 'town' || scene === 'leaving' ? '#8ebfdc' : '#e8dfd0',
            ]}
          />
          {(scene === 'town' || scene === 'leaving') && (
            <fog attach="fog" args={['#b7d0dc', 28, 70]} />
          )}
          <Experience
            scene={scene}
            interiorId={interiorId}
            overview={overview}
            nearId={nearPlace?.id ?? null}
            driving={started}
            guideTarget={guideTarget}
            destinationId={destinationId}
            playerPose={playerPose}
            onArrive={onArrive}
            onSelectBuilding={selectBuilding}
            onHoverBuilding={setHovered}
            onNearPlace={setNearPlace}
            onGuideArrive={onGuideArrive}
            onPlayerMove={setPlayerPose}
            onNearExit={setNearExit}
          />
        </Canvas>
      </div>

      {!started && (
        <div className="intro">
          <div className="intro__card">
            <p className="intro__eyebrow">Hillfolk town</p>
            <h1 className="intro__title">Drive the hillside.</h1>
            <p className="intro__lead">
              Cruise the road, stop in a circle, open a place — like exploring a little world of the studio.
            </p>
            <ol className="intro__steps">
              <li>
                <strong>Drive</strong>
                <span>WASD · Space to brake</span>
              </li>
              <li>
                <strong>Stop & open</strong>
                <span>Park in a ring, then Enter</span>
              </li>
              <li>
                <strong>Walk inside</strong>
                <span>Explore on foot · Esc to leave</span>
              </li>
            </ol>
            <button className="btn intro__cta" type="button" onClick={startExploring}>
              Start driving
              <kbd>Enter</kbd>
            </button>
            <p className="intro__note">O map · F pick a place · Esc back</p>
          </div>
        </div>
      )}

      {started && scene === 'town' && nearPlace && !overview && (
        <button
          type="button"
          className="proximity proximity--action"
          onClick={() => enterBuilding(nearPlace.id)}
        >
          <p className="proximity__label">{nearPlace.label}</p>
          <p className="proximity__blurb">{nearPlace.blurb}</p>
          <p className="proximity__action">
            Tap or press <kbd>Enter</kbd> to open
          </p>
        </button>
      )}

      {started && scene === 'town' && guiding && !nearPlace && (
        <div className="proximity proximity--guide">
          <p className="proximity__label">On the way to {destLabel}</p>
          <p className="proximity__blurb">Steer any time to take over · park in the ring to open</p>
        </div>
      )}

      {started && INTERIORS.has(scene) && nearExit && (
        <button type="button" className="proximity proximity--action" onClick={exitBuilding}>
          <p className="proximity__label">Exit to the hill</p>
          <p className="proximity__blurb">Step back outside</p>
          <p className="proximity__action">
            Tap or press <kbd>Enter</kbd>
          </p>
        </button>
      )}

      {started && scene === 'town' && overview && (
        <div className="overview-map">
          <p className="overview-map__title">Choose a destination</p>
          <ul>
            {places.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    setOverview(false)
                    guideTo(p.id)
                  }}
                >
                  <span>
                    {p.label}
                    {visited.has(p.id) ? ' · visited' : ''}
                  </span>
                  <em>{p.blurb}</em>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {started && scene === 'town' && (
        <div className="progress-chip" aria-label="Places visited">
          {progress} / {places.length} places
        </div>
      )}

      {started && scene === 'town' && (
        <p className="asset-credit" aria-hidden="true">
          Buildings · Grab3D Cozy Kit (CC0)
        </p>
      )}

      {started && INTERIORS.has(scene) && (
        <div className="hud-keys" aria-hidden="true">
          <span>
            <kbd>W</kbd>
            <kbd>A</kbd>
            <kbd>S</kbd>
            <kbd>D</kbd> walk
          </span>
          <span>
            <kbd>Q</kbd>
            <kbd>E</kbd> strafe
          </span>
          <span>
            <kbd>Shift</kbd> sprint
          </span>
          <span>
            <kbd>Esc</kbd> leave
          </span>
        </div>
      )}

      {started && scene === 'town' && (
        <div className="hud-keys" aria-hidden="true">
          <span>
            <kbd>W</kbd>
            <kbd>A</kbd>
            <kbd>S</kbd>
            <kbd>D</kbd> drive
          </span>
          <span>
            <kbd>Space</kbd> brake
          </span>
          <span>
            <kbd>Enter</kbd> open
          </span>
          <span>
            <kbd>F</kbd> destination
          </span>
          <span>
            <kbd>O</kbd> map
          </span>
        </div>
      )}

      <nav className="corner-nav">
        <a href="/">Home</a>
        <a href="/hill.html">2D hill</a>
      </nav>
    </div>
  )
}
