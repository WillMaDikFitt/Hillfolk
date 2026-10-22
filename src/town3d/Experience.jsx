import { Suspense, useRef } from 'react'
import { ContactShadows, Environment, Sky } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Town } from './Town'
import { PlaceInterior } from './Interiors'
import { Player } from './Player'
import { RouteArrow } from './RouteArrow'
import { Walker } from './Walker'
import { CAM, INTERIOR_LAYOUT, INTERIOR_Y } from './interiorLayout'

const INTERIOR_IDS = new Set(['about', 'services', 'cafe', 'contact'])

function smootherstep(t) {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function CameraRig({ scene, interiorId, onArrive }) {
  const progress = useRef(1)
  const fromPos = useRef(CAM.town.position.clone())
  const toPos = useRef(CAM.town.position.clone())
  const fromTarget = useRef(CAM.town.target.clone())
  const toTarget = useRef(CAM.town.target.clone())
  const currentTarget = useRef(CAM.town.target.clone())
  const lastScene = useRef(null)
  const pendingArrive = useRef(false)

  useFrame((state, delta) => {
    const destKey = INTERIOR_IDS.has(interiorId) ? interiorId : 'about'

    if (lastScene.current !== scene) {
      if (scene === 'entering' || scene === 'leaving') {
        progress.current = 0
        pendingArrive.current = true
        fromPos.current.copy(state.camera.position)
        fromTarget.current.copy(currentTarget.current)

        if (scene === 'entering') {
          // Drop straight into the room behind the person, looking at the back wall — no sky flash
          const layout = INTERIOR_LAYOUT[destKey] || INTERIOR_LAYOUT.about
          const dest = CAM[destKey] || CAM.about
          fromPos.current.copy(dest.position)
          fromTarget.current.copy(dest.target)
          toPos.current.copy(dest.position)
          toTarget.current.copy(dest.target)
          state.camera.position.copy(dest.position)
          currentTarget.current.copy(dest.target)
          state.camera.lookAt(dest.target)
          // Instant settle — room is already framed
          progress.current = 1
          void layout
        } else {
          const dest = CAM.town
          toPos.current.copy(dest.position)
          toTarget.current.copy(dest.target)
        }
      }
      lastScene.current = scene
    }

    if (scene === 'entering' || scene === 'leaving') {
      if (scene === 'leaving') {
        progress.current = Math.min(1, progress.current + delta * 1.15)
        const t = smootherstep(progress.current)
        state.camera.position.lerpVectors(fromPos.current, toPos.current, t)
        currentTarget.current.lerpVectors(fromTarget.current, toTarget.current, t)
        state.camera.lookAt(currentTarget.current)
      }

      if (progress.current >= 1 && pendingArrive.current) {
        pendingArrive.current = false
        onArrive(scene === 'entering' ? destKey : 'town')
      }
    }
  })

  return null
}

export function Experience({
  scene,
  interiorId,
  overview,
  nearId,
  driving,
  guideTarget,
  destinationId,
  playerPose,
  onArrive,
  onSelectBuilding,
  onHoverBuilding,
  onNearPlace,
  onGuideArrive,
  onPlayerMove,
  onNearExit,
}) {
  const activeInterior = interiorId || 'about'
  const inInterior = INTERIOR_IDS.has(scene)
  const townVisible = scene === 'town' || scene === 'leaving'
  const showInterior = inInterior || scene === 'entering'
  const walking = inInterior || scene === 'entering'
  const arrowOn = driving && scene === 'town' && !overview && Boolean(destinationId) && !nearId

  return (
    <>
      <ambientLight intensity={showInterior ? 0.7 : 0.38} />
      <hemisphereLight args={showInterior ? ['#f2ebe1', '#c4b090', 0.65] : ['#cfe4f2', '#6f7d55', 0.55]} />
      <directionalLight
        castShadow={!showInterior}
        position={[12, 18, 6]}
        intensity={showInterior ? 0.4 : 1.55}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-camera-far={70}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
      />
      {/* Soft fill from the opposite side — sells form on buildings */}
      {!showInterior && <directionalLight position={[-8, 6, -10]} intensity={0.35} color="#b7d0e8" />}
      {!showInterior && (
        <Sky sunPosition={[50, 22, 10]} turbidity={3.5} rayleigh={0.9} mieCoefficient={0.008} mieDirectionalG={0.85} />
      )}
      {/* HDRI-style bounce light — biggest “not basic” upgrade for free */}
      <Environment preset={showInterior ? 'warehouse' : 'sunset'} />
      <color attach="background" args={[showInterior ? '#e8dfd0' : '#8ebfdc']} />
      {!showInterior && (
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.45}
          scale={48}
          blur={2.2}
          far={18}
          color="#2a332e"
        />
      )}

      {(scene === 'entering' || scene === 'leaving') && (
        <CameraRig scene={scene} interiorId={activeInterior} onArrive={onArrive} />
      )}

      <Suspense fallback={null}>
        <group visible={townVisible}>
          <Town
            nearId={nearId}
            destId={destinationId}
            onSelectBuilding={onSelectBuilding}
            onHoverBuilding={onHoverBuilding}
          />
          <RouteArrow playerPose={playerPose} destinationId={destinationId} visible={arrowOn} />
        </group>

        {/* Keep car mounted while driving so leave doesn't kill controls / listeners */}
        {driving && (
          <Player
            enabled={scene === 'town'}
            overview={overview && scene === 'town'}
            guideTarget={guideTarget}
            onNearPlace={onNearPlace}
            onGuideArrive={onGuideArrive}
            onMove={onPlayerMove}
            takeCamera={scene === 'town'}
            visible={townVisible}
          />
        )}

        <group position={[0, INTERIOR_Y, 0]} visible={showInterior}>
          <ambientLight intensity={0.65} />
          <pointLight position={[0, 5, 2]} intensity={1.5} distance={30} color="#fff6e8" />
          <pointLight position={[-4, 3.5, -2]} intensity={0.55} distance={16} color="#d7ebe4" />
          <pointLight position={[4, 3.5, 3]} intensity={0.45} distance={14} color="#ffe8d0" />
          <PlaceInterior placeId={activeInterior} active={showInterior} />
          {walking && (
            <Walker
              placeId={activeInterior}
              enabled={inInterior}
              takeCamera={inInterior}
              onNearExit={onNearExit}
            />
          )}
        </group>
      </Suspense>
    </>
  )
}
