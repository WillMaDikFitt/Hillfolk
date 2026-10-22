import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  OrbitControls,
  Sky,
  useGLTF,
  useProgress,
} from '@react-three/drei'
import * as THREE from 'three'
import { GlbFit } from './GlbFit'
import { bindKeys, pressed } from '../town3d/keys'
import { collectMeshes, sampleHeight } from './terrain'

const LANDSCAPE_URL = '/models/landscape.glb'
const CAR_URL = '/models/car.glb'

useGLTF.preload(LANDSCAPE_URL)
useGLTF.preload(CAR_URL)

function Loader() {
  const { progress, active, loaded, total } = useProgress()
  if (!active && progress >= 100) return null
  return (
    <div className="loader">
      <p className="loader__title">Loading the hill…</p>
      <div className="loader__bar">
        <div className="loader__fill" style={{ width: `${Math.min(100, progress)}%` }} />
      </div>
      <p className="loader__meta">
        {Math.round(progress)}% · {loaded}/{total || '?'} files
        <br />
        Landscape + car are large — first load can take a minute
      </p>
    </div>
  )
}

/**
 * Driveable car that sticks to the landscape mesh via downward raycasts.
 */
function DriveCar({ start = [0, 0, 8], terrainRef }) {
  const group = useRef()
  const yaw = useRef(0)
  const speed = useRef(0)
  const meshesRef = useRef([])
  const { camera } = useThree()
  const camPos = useRef(new THREE.Vector3(0, 8, 16))
  const camLook = useRef(new THREE.Vector3(0, 1, 0))
  const camVel = useRef(new THREE.Vector3())
  const _fwd = useMemo(() => new THREE.Vector3(), [])
  const _back = useMemo(() => new THREE.Vector3(), [])
  const _desired = useMemo(() => new THREE.Vector3(), [])
  const _look = useMemo(() => new THREE.Vector3(), [])
  const _up = useMemo(() => new THREE.Vector3(0, 3.8, 0), [])
  const _eye = useMemo(() => new THREE.Vector3(0, 1.15, 0), [])
  const _quat = useMemo(() => new THREE.Quaternion(), [])
  const _targetQuat = useMemo(() => new THREE.Quaternion(), [])
  const _yawQ = useMemo(() => new THREE.Quaternion(), [])
  const _upAxis = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const _normal = useMemo(() => new THREE.Vector3(0, 1, 0), [])

  useEffect(() => bindKeys(), [])

  // Rebuild mesh list when terrain finishes loading / updates
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!terrainRef?.current) return
      const list = []
      collectMeshes(terrainRef.current, list)
      if (list.length) {
        meshesRef.current = list
        window.clearInterval(id)
      }
    }, 200)
    return () => window.clearInterval(id)
  }, [terrainRef])

  useEffect(() => {
    if (!group.current) return
    group.current.position.set(start[0], start[1] ?? 20, start[2])
  }, [start])

  useFrame((_, delta) => {
    if (!group.current) return
    const dt = Math.min(delta, 0.05)

    let steer = 0
    if (pressed('KeyA', 'ArrowLeft')) steer += 1
    if (pressed('KeyD', 'ArrowRight')) steer -= 1
    let throttle = 0
    if (pressed('KeyW', 'ArrowUp')) throttle += 1
    if (pressed('KeyS', 'ArrowDown')) throttle -= 1

    const turn = THREE.MathUtils.clamp(0.55 + Math.abs(speed.current) / 6, 0.55, 1)
    yaw.current += steer * 2.2 * turn * dt

    if (throttle > 0) speed.current = THREE.MathUtils.damp(speed.current, 8.5, 3, dt)
    else if (throttle < 0) speed.current = THREE.MathUtils.damp(speed.current, -3.5, 5, dt)
    else if (pressed('Space')) speed.current = THREE.MathUtils.damp(speed.current, 0, 12, dt)
    else speed.current = THREE.MathUtils.damp(speed.current, 0, 4.5, dt)

    // Move on XZ first, then snap Y to terrain
    _fwd.set(Math.sin(yaw.current), 0, Math.cos(yaw.current))
    group.current.position.addScaledVector(_fwd, speed.current * dt)
    group.current.position.x = THREE.MathUtils.clamp(group.current.position.x, -55, 55)
    group.current.position.z = THREE.MathUtils.clamp(group.current.position.z, -55, 55)

    const hit = sampleHeight(
      meshesRef.current,
      group.current.position.x,
      group.current.position.z,
      group.current.position.y + 80,
      250,
    )

    if (hit) {
      // Sit slightly above surface so wheels don't clip
      const targetY = hit.point.y + 0.05
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 14, dt)

      // Light slope follow (keeps car from looking flat inside a hillside)
      if (hit.face && hit.object) {
        _normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld).normalize()
        if (_normal.y < 0) _normal.negate()
      } else {
        _normal.copy(_upAxis)
      }
      // Soften extreme slopes
      if (_normal.y < 0.35) {
        speed.current *= Math.exp(-2 * dt)
      }
      _targetQuat.setFromUnitVectors(_upAxis, _normal)
      _yawQ.setFromAxisAngle(_upAxis, yaw.current)
      _quat.copy(_targetQuat).multiply(_yawQ)
      group.current.quaternion.slerp(_quat, 1 - Math.exp(-6 * dt))
    } else {
      // No hit — drift down until meshes are ready / we find ground
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, 0, 2, dt)
      _yawQ.setFromAxisAngle(_upAxis, yaw.current)
      group.current.quaternion.slerp(_yawQ, 1 - Math.exp(-6 * dt))
    }

    _back.set(-Math.sin(yaw.current), 0, -Math.cos(yaw.current))
    _desired.copy(group.current.position).addScaledVector(_back, 8.5).add(_up)
    camVel.current.x += (_desired.x - camPos.current.x) * 10 * dt
    camVel.current.y += (_desired.y - camPos.current.y) * 10 * dt
    camVel.current.z += (_desired.z - camPos.current.z) * 10 * dt
    camVel.current.multiplyScalar(Math.exp(-7 * dt))
    camPos.current.addScaledVector(camVel.current, dt)
    _look.copy(group.current.position).add(_eye).addScaledVector(_fwd, 2.2)
    camLook.current.lerp(_look, 1 - Math.exp(-5 * dt))
    camera.position.copy(camPos.current)
    camera.lookAt(camLook.current)
  })

  return (
    <group ref={group} position={[start[0], 25, start[2]]}>
      <GlbFit url={CAR_URL} fit={[2.2, 1.1, 4.6]} rotation={[0, 0, 0]} />
    </group>
  )
}

function ParkedCar({ position, terrainRef }) {
  const group = useRef()
  const meshesRef = useRef([])

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!terrainRef?.current) return
      const list = []
      collectMeshes(terrainRef.current, list)
      if (list.length) {
        meshesRef.current = list
        window.clearInterval(id)
      }
    }, 200)
    return () => window.clearInterval(id)
  }, [terrainRef])

  useFrame(() => {
    if (!group.current || !meshesRef.current.length) return
    const hit = sampleHeight(meshesRef.current, position[0], position[2], 120, 300)
    if (hit) group.current.position.y = hit.point.y + 0.05
  })

  return (
    <group ref={group} position={[position[0], 20, position[2]]}>
      <GlbFit url={CAR_URL} fit={[2.2, 1.1, 4.6]} rotation={[0, 0, 0]} />
    </group>
  )
}

function Scene({ mode }) {
  const terrainRef = useRef()

  return (
    <>
      <color attach="background" args={['#8ebfdc']} />
      <ambientLight intensity={0.45} />
      <hemisphereLight args={['#d7ebf5', '#6f7d55', 0.55]} />
      <directionalLight
        castShadow
        position={[18, 28, 10]}
        intensity={1.45}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={90}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <Sky sunPosition={[40, 22, 12]} turbidity={3.5} rayleigh={0.95} />
      <Environment preset="sunset" />

      <group ref={terrainRef}>
        <GlbFit url={LANDSCAPE_URL} fit={[90, 40, 90]} scaleBoost={1} position={[0, 0, 0]} />
      </group>

      {mode === 'drive' ? (
        <DriveCar start={[0, 30, 12]} terrainRef={terrainRef} />
      ) : (
        <>
          <ParkedCar position={[0, 0, 10]} terrainRef={terrainRef} />
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            maxPolarAngle={1.45}
            minDistance={4}
            maxDistance={80}
          />
        </>
      )}

      <ContactShadows position={[0, 0.02, 0]} opacity={0.28} scale={80} blur={2.8} far={40} />
    </>
  )
}

export default function App() {
  const [mode, setMode] = useState('orbit')

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'KeyM') setMode((m) => (m === 'orbit' ? 'drive' : 'orbit'))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const hint =
    mode === 'drive'
      ? 'WASD drive on the terrain · Space brake · M orbit'
      : 'Drag to look · scroll zoom · M drive on terrain'

  return (
    <div className="shell">
      <header className="topbar">
        <a href="/world.html">
          <p className="brand">Hillfolk</p>
          <p className="tag">World sandbox</p>
        </a>
        <p className="hint">{hint}</p>
      </header>

      <Loader />

      <div className="canvas-wrap">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [12, 14, 24], fov: 42, near: 0.1, far: 400 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <Scene mode={mode} />
          </Suspense>
        </Canvas>
      </div>

      <div className="hud">
        <span className="chip">Terrain raycast on</span>
        <span className="chip">{mode === 'drive' ? 'Drive' : 'Orbit'}</span>
      </div>

      <nav className="corner-nav">
        <a href="/town3d.html">3D town</a>
        <a href="/">Home</a>
        <a href="/hill.html">2D hill</a>
      </nav>
    </div>
  )
}
