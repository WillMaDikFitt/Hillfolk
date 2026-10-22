import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { INTERIOR_Y, ROOM_LAYOUTS } from './roomLayouts'

const EYE = 1.68
const SPEED = 4.6
const SPRINT = 7.2
const KEYS = new Set()
const _fwd = new THREE.Vector3()
const _right = new THREE.Vector3()
const _wish = new THREE.Vector3()

function bindKeys() {
  const down = (e) => {
    KEYS.add(e.code)
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault()
  }
  const up = (e) => KEYS.delete(e.code)
  const blur = () => KEYS.clear()
  window.addEventListener('keydown', down, { passive: false })
  window.addEventListener('keyup', up)
  window.addEventListener('blur', blur)
  return () => {
    window.removeEventListener('keydown', down)
    window.removeEventListener('keyup', up)
    window.removeEventListener('blur', blur)
  }
}

function pressed(...codes) {
  return codes.some((c) => KEYS.has(c))
}

/**
 * First-person walk inside a room — WASD, Shift sprint, mouse look (click to capture).
 */
export function InteriorWalker({ placeId, enabled }) {
  const { camera, gl } = useThree()
  const yaw = useRef(Math.PI)
  const pitch = useRef(0.08)
  const pos = useRef(new THREE.Vector3(0, EYE, 3.5))
  const looking = useRef(false)
  const ready = useRef(false)

  const layout = ROOM_LAYOUTS[placeId] || ROOM_LAYOUTS.about

  useEffect(() => bindKeys(), [])

  // Reset pose when entering a room
  useEffect(() => {
    if (!enabled) {
      ready.current = false
      return
    }
    const [sx, , sz] = layout.spawn
    pos.current.set(sx, EYE, sz)
    yaw.current = layout.spawnYaw ?? Math.PI
    pitch.current = 0.06
    ready.current = true
    camera.position.set(sx, INTERIOR_Y + EYE, sz)
  }, [enabled, placeId, layout, camera])

  // Pointer lock + drag look
  useEffect(() => {
    if (!enabled) return undefined
    const el = gl.domElement

    const onClick = () => {
      if (document.pointerLockElement !== el) el.requestPointerLock?.()
    }
    const onLockChange = () => {
      looking.current = document.pointerLockElement === el
    }
    const onMove = (e) => {
      if (!looking.current && e.buttons !== 1) return
      const sens = looking.current ? 0.0022 : 0.004
      yaw.current -= e.movementX * sens
      pitch.current -= e.movementY * sens
      pitch.current = THREE.MathUtils.clamp(pitch.current, -1.15, 1.15)
    }
    const onContext = (e) => e.preventDefault()

    el.addEventListener('click', onClick)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('contextmenu', onContext)
    document.addEventListener('pointerlockchange', onLockChange)
    return () => {
      el.removeEventListener('click', onClick)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('contextmenu', onContext)
      document.removeEventListener('pointerlockchange', onLockChange)
      if (document.pointerLockElement === el) document.exitPointerLock?.()
    }
  }, [enabled, gl])

  useFrame((_, delta) => {
    if (!enabled || !ready.current) return
    const dt = Math.min(delta, 0.05)
    const { minX, maxX, minZ, maxZ } = layout.bounds

    // Keyboard turn when not pointer-locked
    if (!looking.current) {
      if (pressed('ArrowLeft', 'KeyQ')) yaw.current += 1.8 * dt
      if (pressed('ArrowRight', 'KeyE')) yaw.current -= 1.8 * dt
      if (pressed('ArrowUp')) pitch.current = Math.min(1.15, pitch.current + 1.2 * dt)
      if (pressed('ArrowDown')) pitch.current = Math.max(-1.15, pitch.current - 1.2 * dt)
    }

    let mx = 0
    let mz = 0
    if (pressed('KeyW')) mz += 1
    if (pressed('KeyS')) mz -= 1
    if (pressed('KeyA')) mx -= 1
    if (pressed('KeyD')) mx += 1

    _fwd.set(Math.sin(yaw.current), 0, Math.cos(yaw.current))
    _right.set(Math.cos(yaw.current), 0, -Math.sin(yaw.current))
    _wish.set(0, 0, 0)
    if (mx || mz) {
      _wish.addScaledVector(_fwd, mz).addScaledVector(_right, mx)
      if (_wish.lengthSq() > 0) _wish.normalize()
    }

    const sprint = pressed('ShiftLeft', 'ShiftRight')
    const spd = sprint ? SPRINT : SPEED
    pos.current.addScaledVector(_wish, spd * dt)

    // Soft wall clamp with a little inset so you don't clip props on the rim
    const pad = 0.55
    pos.current.x = THREE.MathUtils.clamp(pos.current.x, minX + pad, maxX - pad)
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, minZ + pad, maxZ - pad)
    pos.current.y = EYE

    camera.position.set(pos.current.x, INTERIOR_Y + EYE, pos.current.z)
    camera.rotation.order = 'YXZ'
    camera.rotation.y = yaw.current
    camera.rotation.x = pitch.current
    camera.rotation.z = 0
  })

  return null
}
