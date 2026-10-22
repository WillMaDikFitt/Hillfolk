import { Suspense, useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { places } from './content'
import { bindKeys, pressed } from './keys'
import { GlbModel } from './GlbModel'

const CAR_URL = '/models/car.glb'
useGLTF.preload(CAR_URL)

const MAX_SPEED = 8.8
const COAST = 4.5
const TURN_RATE = 2.1
const GUIDE_MAX = 6.6
const PARK_SPEED = 1.35
const START = [0, 0, 11]

const _fwd = new THREE.Vector3()
const _back = new THREE.Vector3()
const _desiredCam = new THREE.Vector3()
const _look = new THREE.Vector3()
const _upOffset = new THREE.Vector3()
const _overviewPos = new THREE.Vector3(0, 36, 24)
const _overviewLook = new THREE.Vector3(0, 0, -1)

/**
 * Driveable car — soft accel, spring camera, park in ring to open.
 */
export function Player({
  enabled = true,
  overview = false,
  takeCamera = true,
  visible = true,
  guideTarget = null,
  onNearPlace,
  onGuideArrive,
  onMove,
  start = START,
}) {
  const group = useRef()
  const { camera } = useThree()

  const speed = useRef(0)
  const yaw = useRef(Math.PI)
  const steerInput = useRef(0)
  const camPos = useRef(new THREE.Vector3(0, 6.5, 16))
  const camLook = useRef(new THREE.Vector3(0, 1, 2))
  const camVel = useRef(new THREE.Vector3())
  const nearId = useRef(null)
  const guiding = useRef(false)
  const parkedAnnounce = useRef(false)
  const moveTick = useRef(0)
  const wasEnabled = useRef(enabled)

  const enabledRef = useRef(enabled)
  const overviewRef = useRef(overview)
  const takeCameraRef = useRef(takeCamera)
  const guideTargetRef = useRef(guideTarget)
  const onNearPlaceRef = useRef(onNearPlace)
  const onGuideArriveRef = useRef(onGuideArrive)
  const onMoveRef = useRef(onMove)

  enabledRef.current = enabled
  overviewRef.current = overview
  takeCameraRef.current = takeCamera
  guideTargetRef.current = guideTarget
  onNearPlaceRef.current = onNearPlace
  onGuideArriveRef.current = onGuideArrive
  onMoveRef.current = onMove

  useEffect(() => bindKeys(), [])

  // When driving resumes after an interior, adopt the live camera so we don't snap oddly
  useEffect(() => {
    if (enabled && !wasEnabled.current && group.current) {
      camPos.current.copy(camera.position)
      const p = group.current.position
      camLook.current.set(p.x, 1.1, p.z)
      camVel.current.set(0, 0, 0)
    }
    wasEnabled.current = enabled
  }, [enabled, camera])

  useEffect(() => {
    guiding.current = Boolean(guideTarget)
    parkedAnnounce.current = false
  }, [guideTarget])

  useFrame((_, delta) => {
    if (!group.current) return
    const dt = Math.min(delta, 0.05)
    const isOverview = overviewRef.current
    const target = guideTargetRef.current
    const canDrive = enabledRef.current

    if (canDrive) {
      const manual = pressed(
        'KeyW',
        'KeyA',
        'KeyS',
        'KeyD',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Space',
      )

      let steer = 0

      if (!isOverview) {
        if (target && guiding.current) {
          if (manual) {
            guiding.current = false
            onGuideArriveRef.current?.('cancel')
          } else {
            const dx = target[0] - group.current.position.x
            const dz = target[2] - group.current.position.z
            const dist = Math.hypot(dx, dz)
            if (dist < 1.15) {
              speed.current = THREE.MathUtils.damp(speed.current, 0, 8, dt)
              if (Math.abs(speed.current) < 0.12 && !parkedAnnounce.current) {
                speed.current = 0
                parkedAnnounce.current = true
                guiding.current = false
                onGuideArriveRef.current?.('parked')
              }
            } else {
              const desiredYaw = Math.atan2(dx, dz)
              let diff = desiredYaw - yaw.current
              while (diff > Math.PI) diff -= Math.PI * 2
              while (diff < -Math.PI) diff += Math.PI * 2
              const turnScale = THREE.MathUtils.clamp(0.4 + Math.abs(speed.current) / 4, 0.4, 1)
              yaw.current += THREE.MathUtils.clamp(diff, -TURN_RATE * turnScale * dt, TURN_RATE * turnScale * dt)
              steer = Math.sign(diff)
              const targetSpeed = dist < 3.5 ? GUIDE_MAX * 0.42 : GUIDE_MAX
              speed.current = THREE.MathUtils.damp(speed.current, targetSpeed, 2.4, dt)
            }
          }
        } else {
          if (pressed('KeyA', 'ArrowLeft')) steer += 1
          if (pressed('KeyD', 'ArrowRight')) steer -= 1
          let throttle = 0
          if (pressed('KeyW', 'ArrowUp')) throttle += 1
          if (pressed('KeyS', 'ArrowDown')) throttle -= 1

          const turnScale = THREE.MathUtils.clamp(0.5 + Math.abs(speed.current) / 5, 0.5, 1)
          yaw.current += steer * TURN_RATE * turnScale * dt

          if (throttle > 0) speed.current = THREE.MathUtils.damp(speed.current, MAX_SPEED, 3.2, dt)
          else if (throttle < 0) speed.current = THREE.MathUtils.damp(speed.current, -MAX_SPEED * 0.4, 5, dt)
          else if (pressed('Space')) speed.current = THREE.MathUtils.damp(speed.current, 0, 12, dt)
          else speed.current = THREE.MathUtils.damp(speed.current, 0, COAST, dt)
        }

        steerInput.current = THREE.MathUtils.damp(steerInput.current, steer, 8, dt)
        group.current.rotation.y = yaw.current
        _fwd.set(Math.sin(yaw.current), 0, Math.cos(yaw.current))
        group.current.position.addScaledVector(_fwd, speed.current * dt)
        group.current.position.x = THREE.MathUtils.clamp(group.current.position.x, -26, 26)
        group.current.position.z = THREE.MathUtils.clamp(group.current.position.z, -16, 18)

        group.current.rotation.z = THREE.MathUtils.damp(
          group.current.rotation.z,
          -steerInput.current * Math.min(Math.abs(speed.current) / MAX_SPEED, 1) * 0.07,
          6,
          dt,
        )

        let closest = null
        let closestDist = Infinity
        const px = group.current.position.x
        const pz = group.current.position.z
        if (Math.abs(speed.current) < PARK_SPEED) {
          for (const place of places) {
            const dx = place.position[0] - px
            const dz = place.position[2] + 1.45 - pz
            const dist = Math.hypot(dx, dz)
            if (dist < place.radius * 0.78 && dist < closestDist) {
              closestDist = dist
              closest = place
            }
          }
        }
        const nextId = closest?.id ?? null
        if (nextId !== nearId.current) {
          nearId.current = nextId
          onNearPlaceRef.current?.(closest)
        }

        moveTick.current += dt
        if (moveTick.current > 0.1) {
          moveTick.current = 0
          onMoveRef.current?.({
            x: px,
            z: pz,
            yaw: yaw.current,
            speed: speed.current,
            nearId: nextId,
            guiding: guiding.current,
          })
        }
      }
    }

    if (!takeCameraRef.current) return

    const p = group.current.position
    if (isOverview) {
      camPos.current.lerp(_overviewPos, 1 - Math.exp(-2.0 * dt))
      camLook.current.lerp(_overviewLook, 1 - Math.exp(-2.2 * dt))
      camVel.current.set(0, 0, 0)
    } else {
      _back.set(-Math.sin(yaw.current), 0, -Math.cos(yaw.current))
      _fwd.set(Math.sin(yaw.current), 0, Math.cos(yaw.current))
      const lookAhead = THREE.MathUtils.clamp(speed.current * 0.2, -0.8, 2.4)
      const speedNorm = Math.abs(speed.current) / MAX_SPEED
      _upOffset.set(0, 3.4 + speedNorm * 0.45, 0)
      _desiredCam
        .copy(p)
        .addScaledVector(_back, 7.2 + speedNorm * 0.9)
        .add(_upOffset)

      // Softer spring
      const stiffness = 10
      const damping = 7
      camVel.current.x += (_desiredCam.x - camPos.current.x) * stiffness * dt
      camVel.current.y += (_desiredCam.y - camPos.current.y) * stiffness * dt
      camVel.current.z += (_desiredCam.z - camPos.current.z) * stiffness * dt
      camVel.current.multiplyScalar(Math.exp(-damping * dt))
      camPos.current.addScaledVector(camVel.current, dt)

      _look.copy(p).add(_upOffset.set(0, 1.05, 0)).addScaledVector(_fwd, lookAhead)
      camLook.current.lerp(_look, 1 - Math.exp(-4.5 * dt))
    }

    camera.position.copy(camPos.current)
    camera.lookAt(camLook.current)
  })

  return (
    <group ref={group} position={start} visible={visible}>
      <Suspense
        fallback={
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[1.2, 0.4, 2.2]} />
            <meshStandardMaterial color="#c45c3e" metalness={0.2} roughness={0.45} />
          </mesh>
        }
      >
        <GlbModel
          url={CAR_URL}
          fit={[2.0, 1.05, 4.2]}
          scaleBoost={1}
          rotation={[0, 0, 0]}
        />
      </Suspense>
    </group>
  )
}
