import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { INTERIOR_LAYOUT, INTERIOR_Y } from './interiorLayout'
import { bindKeys, pressed } from './keys'

const WALK = 3.8
const SPRINT = 6.2
const TURN = 2.35

const _fwd = new THREE.Vector3()
const _right = new THREE.Vector3()
const _wish = new THREE.Vector3()
const _desiredCam = new THREE.Vector3()
const _look = new THREE.Vector3()
const _back = new THREE.Vector3()

/**
 * Third-person person for interiors — soft walk, spring cam into the room.
 */
export function Walker({ placeId, enabled = true, takeCamera = true, onNearExit }) {
  const group = useRef()
  const legL = useRef()
  const legR = useRef()
  const armL = useRef()
  const armR = useRef()
  const { camera } = useThree()

  const layout = INTERIOR_LAYOUT[placeId] || INTERIOR_LAYOUT.about
  const yaw = useRef(layout.spawnYaw)
  const speed = useRef(0)
  const velocity = useRef(new THREE.Vector3())
  const bob = useRef(0)
  const camPos = useRef(
    new THREE.Vector3(layout.spawn[0], INTERIOR_Y + 2.25, layout.spawn[2] + 3.4),
  )
  const camLook = useRef(
    new THREE.Vector3(layout.spawn[0], INTERIOR_Y + 1.4, layout.spawn[2] - 3.5),
  )
  const camVel = useRef(new THREE.Vector3())
  const nearExit = useRef(false)

  const enabledRef = useRef(enabled)
  const takeCameraRef = useRef(takeCamera)
  const onNearExitRef = useRef(onNearExit)
  enabledRef.current = enabled
  takeCameraRef.current = takeCamera
  onNearExitRef.current = onNearExit

  useEffect(() => bindKeys(), [])

  useEffect(() => {
    if (!group.current) return
    const L = INTERIOR_LAYOUT[placeId] || INTERIOR_LAYOUT.about
    group.current.position.set(L.spawn[0], 0, L.spawn[2])
    yaw.current = L.spawnYaw
    group.current.rotation.y = yaw.current
    speed.current = 0
    velocity.current.set(0, 0, 0)
    nearExit.current = false
    camPos.current.set(L.spawn[0], INTERIOR_Y + 2.25, L.spawn[2] + 3.4)
    camLook.current.set(L.spawn[0], INTERIOR_Y + 1.4, L.spawn[2] - 3.5)
    camVel.current.set(0, 0, 0)
    camera.position.copy(camPos.current)
    camera.lookAt(camLook.current)
  }, [placeId, camera])

  useFrame((_, delta) => {
    if (!group.current) return
    const dt = Math.min(delta, 0.05)
    const L = INTERIOR_LAYOUT[placeId] || INTERIOR_LAYOUT.about
    const halfW = L.width * 0.5 - 0.75
    const halfD = L.depth * 0.5 - 0.75
    const cx = L.center[0]
    const cz = L.center[2]

    if (enabledRef.current) {
      if (pressed('KeyA', 'ArrowLeft')) yaw.current += TURN * dt
      if (pressed('KeyD', 'ArrowRight')) yaw.current -= TURN * dt

      let forward = 0
      let strafe = 0
      if (pressed('KeyW', 'ArrowUp')) forward += 1
      if (pressed('KeyS', 'ArrowDown')) forward -= 1
      if (pressed('KeyQ')) strafe -= 1
      if (pressed('KeyE')) strafe += 1

      const sprint = pressed('ShiftLeft', 'ShiftRight')
      const maxSpeed = sprint ? SPRINT : WALK
      const moving = Math.abs(forward) + Math.abs(strafe) > 0

      _fwd.set(Math.sin(yaw.current), 0, Math.cos(yaw.current))
      _right.set(Math.cos(yaw.current), 0, -Math.sin(yaw.current))
      _wish.set(0, 0, 0)
      if (moving) {
        _wish.addScaledVector(_fwd, forward).addScaledVector(_right, strafe)
        if (_wish.lengthSq() > 0) _wish.normalize().multiplyScalar(maxSpeed)
        velocity.current.lerp(_wish, 1 - Math.exp(-9 * dt))
      } else {
        velocity.current.multiplyScalar(Math.exp(-8 * dt))
      }
      speed.current = velocity.current.length()

      group.current.position.addScaledVector(velocity.current, dt)
      group.current.position.x = THREE.MathUtils.clamp(group.current.position.x, cx - halfW, cx + halfW)
      group.current.position.z = THREE.MathUtils.clamp(group.current.position.z, cz - halfD, cz + halfD)
      group.current.rotation.y = yaw.current

      const gait = moving ? bob.current + dt * speed.current * 2.2 : bob.current
      bob.current = gait
      const swing = moving ? Math.sin(gait * 5.5) * 0.5 : 0
      if (legL.current) legL.current.rotation.x = swing
      if (legR.current) legR.current.rotation.x = -swing
      if (armL.current) armL.current.rotation.x = -swing * 0.65
      if (armR.current) armR.current.rotation.x = swing * 0.65

      const distExit = Math.hypot(group.current.position.x - L.exit[0], group.current.position.z - L.exit[2])
      const isNear = distExit < 1.7
      if (isNear !== nearExit.current) {
        nearExit.current = isNear
        onNearExitRef.current?.(isNear)
      }
    }

    if (!takeCameraRef.current) return

    const p = group.current.position
    _back.set(-Math.sin(yaw.current), 0, -Math.cos(yaw.current))
    _fwd.set(Math.sin(yaw.current), 0, Math.cos(yaw.current))
    _desiredCam
      .set(p.x, INTERIOR_Y + 2.2 + Math.min(speed.current, 4) * 0.03, p.z)
      .addScaledVector(_back, 3.5)

    _desiredCam.x = THREE.MathUtils.clamp(_desiredCam.x, cx - halfW + 0.5, cx + halfW - 0.5)
    _desiredCam.z = THREE.MathUtils.clamp(_desiredCam.z, cz - halfD + 0.5, cz + halfD + 0.8)
    _desiredCam.y = THREE.MathUtils.clamp(_desiredCam.y, INTERIOR_Y + 1.7, INTERIOR_Y + L.height - 0.7)

    const stiffness = 12
    const damping = 8
    camVel.current.x += (_desiredCam.x - camPos.current.x) * stiffness * dt
    camVel.current.y += (_desiredCam.y - camPos.current.y) * stiffness * dt
    camVel.current.z += (_desiredCam.z - camPos.current.z) * stiffness * dt
    camVel.current.multiplyScalar(Math.exp(-damping * dt))
    camPos.current.addScaledVector(camVel.current, dt)

    _look.set(p.x, INTERIOR_Y + 1.35, p.z).addScaledVector(_fwd, 2.2)
    camLook.current.lerp(_look, 1 - Math.exp(-6.5 * dt))

    camera.position.copy(camPos.current)
    camera.lookAt(camLook.current)
  })

  const shirt = '#4f6f56'
  const pants = '#2f3a34'

  return (
    <group ref={group} position={layout.spawn}>
      <mesh position={[0, 1.05, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.48, 6, 10]} />
        <meshStandardMaterial color={shirt} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.58, 0]} castShadow>
        <sphereGeometry args={[0.18, 14, 14]} />
        <meshStandardMaterial color="#e6c4a5" />
      </mesh>
      <mesh position={[0, 1.68, -0.02]} castShadow>
        <sphereGeometry args={[0.17, 12, 10]} />
        <meshStandardMaterial color="#3a3228" />
      </mesh>
      <group ref={armL} position={[-0.32, 1.15, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.38, 4, 8]} />
          <meshStandardMaterial color={shirt} />
        </mesh>
      </group>
      <group ref={armR} position={[0.32, 1.15, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.38, 4, 8]} />
          <meshStandardMaterial color={shirt} />
        </mesh>
      </group>
      <group ref={legL} position={[-0.1, 0.55, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
          <meshStandardMaterial color={pants} />
        </mesh>
        <mesh position={[0, -0.48, 0.04]} castShadow>
          <boxGeometry args={[0.14, 0.1, 0.24]} />
          <meshStandardMaterial color="#1c2420" />
        </mesh>
      </group>
      <group ref={legR} position={[0.1, 0.55, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
          <meshStandardMaterial color={pants} />
        </mesh>
        <mesh position={[0, -0.48, 0.04]} castShadow>
          <boxGeometry args={[0.14, 0.1, 0.24]} />
          <meshStandardMaterial color="#1c2420" />
        </mesh>
      </group>
    </group>
  )
}
