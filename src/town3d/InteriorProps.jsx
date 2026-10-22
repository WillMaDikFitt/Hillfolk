import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function Pendant({ position, color = '#4f6f56', lit, size = 1 }) {
  return (
    <group position={position} scale={size}>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.9, 6]} />
        <meshStandardMaterial color="#3a3228" />
      </mesh>
      <mesh>
        <coneGeometry args={[0.32, 0.4, 14, 1, true]} />
        <meshStandardMaterial color={color} side={2} />
      </mesh>
      <mesh position={[0, -0.06, 0]}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshStandardMaterial color="#f5e6c8" emissive="#f0d79a" emissiveIntensity={lit ? 0.85 : 0.15} />
      </mesh>
      {lit && <pointLight position={[0, -0.25, 0]} intensity={0.55} distance={7} color="#ffd9a0" />}
    </group>
  )
}

export function WindowPane({ position, size = [2.2, 1.8], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={size} />
        <meshStandardMaterial color="#cfe8f2" emissive="#9fd0e4" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[size[0] + 0.12, 0.08, 0.06]} />
        <meshStandardMaterial color="#4f6f56" />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.08, size[1] + 0.12, 0.06]} />
        <meshStandardMaterial color="#4f6f56" />
      </mesh>
      <mesh position={[0, size[1] / 2 + 0.06, 0.02]}>
        <boxGeometry args={[size[0] + 0.2, 0.1, 0.08]} />
        <meshStandardMaterial color="#3d5c42" />
      </mesh>
    </group>
  )
}

export function Plant({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.18, 0.42, 12]} />
        <meshStandardMaterial color="#c45c3e" />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial color="#3f6b45" roughness={0.95} />
      </mesh>
      <mesh position={[0.18, 0.78, 0.08]} castShadow>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color="#4a7a4e" />
      </mesh>
      <mesh position={[-0.14, 0.75, -0.1]} castShadow>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshStandardMaterial color="#357044" />
      </mesh>
    </group>
  )
}

export function Person({ position, hue = '#4d6b58', pose = 'stand', delay = 0, yaw = 0 }) {
  const arm = useRef()
  const body = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime + delay
    if (body.current) body.current.rotation.y = Math.sin(t * 0.5) * 0.06
    if (arm.current && pose === 'type') {
      const click = Math.max(0, Math.sin(t * 5))
      arm.current.rotation.x = -0.85 + click * 0.35
    }
    if (arm.current && pose === 'wave') {
      arm.current.rotation.z = 0.4 + Math.sin(t * 3) * 0.35
      arm.current.rotation.x = -0.3
    }
  })
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <group ref={body}>
        <mesh position={[0, pose === 'sit' ? 0.7 : 0.95, 0]} castShadow>
          <capsuleGeometry args={[0.2, pose === 'sit' ? 0.35 : 0.5, 4, 8]} />
          <meshStandardMaterial color={hue} roughness={0.65} />
        </mesh>
        <mesh position={[0, pose === 'sit' ? 1.15 : 1.42, 0]} castShadow>
          <sphereGeometry args={[0.17, 12, 12]} />
          <meshStandardMaterial color="#e6c4a5" />
        </mesh>
        <group ref={arm} position={[0.28, pose === 'sit' ? 0.85 : 1.08, 0.1]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.055, 0.3, 3, 6]} />
            <meshStandardMaterial color={hue} />
          </mesh>
        </group>
      </group>
      {pose === 'sit' && (
        <>
          <mesh position={[0, 0.4, 0.15]} castShadow>
            <boxGeometry args={[0.42, 0.08, 0.42]} />
            <meshStandardMaterial color="#3f4742" />
          </mesh>
          <mesh position={[0, 0.7, 0.32]} castShadow>
            <boxGeometry args={[0.42, 0.5, 0.08]} />
            <meshStandardMaterial color="#3f4742" />
          </mesh>
        </>
      )}
    </group>
  )
}

export function Rug({ position, size = [4, 3], color = '#8b5a3c' }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[position[0], 0.02, position[2]]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  )
}

export function Bookshelf({ position, yaw = 0 }) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 2.8, 0.45]} />
        <meshStandardMaterial color="#6d5136" />
      </mesh>
      {[0.5, 1.15, 1.8, 2.45].map((y) => (
        <mesh key={y} position={[0, y, 0.05]}>
          <boxGeometry args={[2.05, 0.06, 0.4]} />
          <meshStandardMaterial color="#8b6a45" />
        </mesh>
      ))}
      {[-0.7, -0.2, 0.3, 0.75].map((x, i) => (
        <mesh key={x} position={[x, 0.85 + (i % 3) * 0.65, 0.12]} castShadow>
          <boxGeometry args={[0.28, 0.45, 0.22]} />
          <meshStandardMaterial color={['#e85d2c', '#4f6f56', '#c9a66b', '#3f5f73'][i]} />
        </mesh>
      ))}
    </group>
  )
}

export function FloatingCard({ position, color, spin = 1 }) {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 1.3 + position[0]) * 0.12
    ref.current.rotation.y = t * 0.4 * spin
  })
  return (
    <mesh ref={ref} position={position} castShadow>
      <boxGeometry args={[0.75, 1.0, 0.05]} />
      <meshStandardMaterial color={color} roughness={0.45} />
    </mesh>
  )
}

/** Shared spacious room shell driven by layout sizes */
export function RoomShell({
  width = 20,
  depth = 16,
  height = 5.5,
  floor = '#d8c3a3',
  wall = '#e7dfd1',
  side = '#ddd4c5',
  ceiling = '#f2ebe1',
}) {
  const w = width
  const d = depth
  const h = height
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={floor} roughness={0.9} />
      </mesh>
      {/* Floor planks */}
      {Array.from({ length: 11 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-w / 2 + 0.9 + i * (w / 11), 0.012, 0]}>
          <planeGeometry args={[0.05, d * 0.94]} />
          <meshStandardMaterial color="#c4b090" transparent opacity={0.4} />
        </mesh>
      ))}
      {/* Area rug shadow tone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0.5]} receiveShadow>
        <planeGeometry args={[w * 0.35, d * 0.28]} />
        <meshStandardMaterial color="#b89a72" roughness={1} transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, h, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={ceiling} roughness={1} />
      </mesh>
      {/* Crown moldings */}
      <mesh position={[0, h - 0.12, -d / 2 + 0.2]}>
        <boxGeometry args={[w - 0.3, 0.14, 0.1]} />
        <meshStandardMaterial color="#d4c8b0" roughness={0.85} />
      </mesh>
      <mesh position={[0, h / 2, -d / 2]} receiveShadow>
        <boxGeometry args={[w, h, 0.36]} />
        <meshStandardMaterial color={wall} roughness={0.92} />
      </mesh>
      <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[d, h, 0.36]} />
        <meshStandardMaterial color={side} roughness={0.92} />
      </mesh>
      <mesh position={[w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[d, h, 0.36]} />
        <meshStandardMaterial color={side} roughness={0.92} />
      </mesh>
      <mesh position={[-w / 4 - 0.9, h / 2, d / 2]} receiveShadow>
        <boxGeometry args={[w / 2 - 1.6, h, 0.32]} />
        <meshStandardMaterial color={wall} roughness={0.92} />
      </mesh>
      <mesh position={[w / 4 + 0.9, h / 2, d / 2]} receiveShadow>
        <boxGeometry args={[w / 2 - 1.6, h, 0.32]} />
        <meshStandardMaterial color={wall} roughness={0.92} />
      </mesh>
      <mesh position={[0, h - 0.55, d / 2]} receiveShadow>
        <boxGeometry args={[3.4, 1.1, 0.32]} />
        <meshStandardMaterial color={wall} roughness={0.92} />
      </mesh>
      {/* Doorframe with depth */}
      <mesh position={[-1.05, 1.45, d / 2 - 0.08]} castShadow>
        <boxGeometry args={[0.18, 2.95, 0.28]} />
        <meshStandardMaterial color="#5a5048" roughness={0.75} />
      </mesh>
      <mesh position={[1.05, 1.45, d / 2 - 0.08]} castShadow>
        <boxGeometry args={[0.18, 2.95, 0.28]} />
        <meshStandardMaterial color="#5a5048" roughness={0.75} />
      </mesh>
      <mesh position={[0, 2.98, d / 2 - 0.08]}>
        <boxGeometry args={[2.3, 0.18, 0.28]} />
        <meshStandardMaterial color="#5a5048" roughness={0.75} />
      </mesh>
      <mesh position={[0, 1.45, d / 2 + 0.02]}>
        <planeGeometry args={[1.9, 2.8]} />
        <meshStandardMaterial color="#e8dcc8" emissive="#d4c4a8" emissiveIntensity={0.2} transparent opacity={0.35} />
      </mesh>
      {/* Baseboards + chair rail */}
      <mesh position={[0, 0.14, -d / 2 + 0.2]}>
        <boxGeometry args={[w - 0.5, 0.28, 0.1]} />
        <meshStandardMaterial color="#8b6a45" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.1, -d / 2 + 0.2]}>
        <boxGeometry args={[w - 0.5, 0.08, 0.06]} />
        <meshStandardMaterial color="#a89070" roughness={0.85} />
      </mesh>
      <mesh position={[-w / 2 + 0.2, 0.14, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[d - 0.5, 0.28, 0.1]} />
        <meshStandardMaterial color="#8b6a45" roughness={0.8} />
      </mesh>
      <mesh position={[w / 2 - 0.2, 0.14, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[d - 0.5, 0.28, 0.1]} />
        <meshStandardMaterial color="#8b6a45" roughness={0.8} />
      </mesh>
    </group>
  )
}
