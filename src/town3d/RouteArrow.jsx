import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { places } from './content'

/**
 * World-space arrow above the car pointing toward the active destination.
 */
export function RouteArrow({ playerPose, destinationId, visible }) {
  const ref = useRef()
  const mat = useRef()
  const dest = useMemo(() => places.find((p) => p.id === destinationId), [destinationId])

  useFrame((state) => {
    if (!ref.current || !visible || !dest || !playerPose) {
      if (ref.current) ref.current.visible = false
      return
    }
    ref.current.visible = true
    const px = playerPose.x
    const pz = playerPose.z
    const dx = dest.position[0] - px
    const dz = dest.position[2] + 1.45 - pz
    const dist = Math.hypot(dx, dz)
    const ang = Math.atan2(dx, dz)
    const bob = Math.sin(state.clock.elapsedTime * 3.2) * 0.1
    const pulse = 0.9 + Math.sin(state.clock.elapsedTime * 4) * 0.08
    ref.current.position.set(px, 2.25 + bob, pz)
    ref.current.rotation.set(0.12, ang, 0)
    ref.current.scale.setScalar(pulse * (dist < 4 ? 0.85 : 1))
    if (mat.current) {
      mat.current.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.15
    }
  })

  return (
    <group ref={ref} visible={false}>
      <mesh position={[0, 0, 0.65]} castShadow>
        <coneGeometry args={[0.32, 0.78, 4]} />
        <meshStandardMaterial
          ref={mat}
          color="#e85d2c"
          emissive="#e85d2c"
          emissiveIntensity={0.4}
          roughness={0.45}
        />
      </mesh>
      <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.65, 8]} />
        <meshStandardMaterial color="#e85d2c" emissive="#e85d2c" emissiveIntensity={0.28} />
      </mesh>
      {/* Soft glow disc under arrow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0.2]}>
        <circleGeometry args={[0.45, 24]} />
        <meshBasicMaterial color="#e85d2c" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  )
}
