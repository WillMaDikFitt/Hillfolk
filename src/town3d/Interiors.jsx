import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AboutInterior } from './AboutInterior'
import { INTERIOR_LAYOUT } from './interiorLayout'
import {
  Bookshelf,
  Pendant,
  Person,
  Plant,
  RoomShell,
  Rug,
  WindowPane,
} from './InteriorProps'
import { CafeSignage, ContactSignage, ServicesSignage } from './WorldSignage'

function ServicesInterior({ active }) {
  const L = INTERIOR_LAYOUT.services
  const belt = useRef()
  useFrame((state) => {
    if (belt.current) belt.current.position.x = ((state.clock.elapsedTime * 0.4) % 8) - 4
  })
  const cards = ['#6b8f71', '#8a7355', '#c4a574', '#7d8b99', '#4f6f56', '#e85d2c', '#c9a66b']
  return (
    <group>
      <RoomShell width={L.width} depth={L.depth} height={L.height} floor="#cfc4b0" wall="#ebe3d4" />
      <Rug position={[0, 0, 2]} size={[6, 4]} color="#8a7355" />

      <WindowPane position={[-6, 3, -L.depth / 2 + 0.2]} size={[3.5, 2.4]} />
      <WindowPane position={[0, 3.1, -L.depth / 2 + 0.2]} size={[4.5, 2.6]} />
      <WindowPane position={[6, 3, -L.depth / 2 + 0.2]} size={[3.5, 2.4]} />
      <WindowPane position={[-L.width / 2 + 0.2, 2.8, 0]} size={[2.4, 2.2]} rotation={[0, Math.PI / 2, 0]} />
      <WindowPane position={[L.width / 2 - 0.2, 2.8, -2]} size={[2.4, 2.2]} rotation={[0, -Math.PI / 2, 0]} />

      <Pendant position={[-5, L.height - 1.1, -2]} color="#e85d2c" lit={active} />
      <Pendant position={[0, L.height - 0.95, 0]} color="#e85d2c" lit={active} size={1.2} />
      <Pendant position={[5, L.height - 1.1, -2]} color="#e85d2c" lit={active} />
      <Pendant position={[-3, L.height - 1.2, 4]} color="#4f6f56" lit={active} />
      <Pendant position={[4, L.height - 1.2, 4]} color="#4f6f56" lit={active} />

      {/* Giant wall board */}
      <mesh position={[0, 3.0, -L.depth / 2 + 0.25]} castShadow>
        <boxGeometry args={[12, 3.6, 0.18]} />
        <meshStandardMaterial color="#f7f1e7" />
      </mesh>
      <mesh position={[0, 4.5, -L.depth / 2 + 0.36]}>
        <boxGeometry args={[10, 0.35, 0.08]} />
        <meshStandardMaterial color="#e85d2c" />
      </mesh>
      {[-4, -1.5, 1.5, 4].map((x) => (
        <mesh key={x} position={[x, 4.85, -L.depth / 2 + 0.7]} rotation={[0.45, 0, 0]}>
          <boxGeometry args={[0.4, 0.2, 0.5]} />
          <meshStandardMaterial color="#1c2420" />
        </mesh>
      ))}
      {[-3.5, -1.2, 1.2, 3.5].map((x, i) => (
        <mesh key={x} position={[x, 2.8, -L.depth / 2 + 0.4]} castShadow>
          <boxGeometry args={[1.6, 1.8, 0.06]} />
          <meshStandardMaterial color={cards[i]} />
        </mesh>
      ))}

      {/* Conveyor */}
      <mesh position={[0, 0.95, -3]} receiveShadow castShadow>
        <boxGeometry args={[14, 0.24, 1.5]} />
        <meshStandardMaterial color="#3a3228" />
      </mesh>
      {[-6, -3, 0, 3, 6].map((x) => (
        <mesh key={x} position={[x, 0.72, -3]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.22, 12]} />
          <meshStandardMaterial color="#1c2420" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <group ref={belt}>
        {cards.map((c, i) => (
          <group key={i} position={[-3.5 + i * 1.35, 1.6, -3]}>
            <mesh castShadow>
              <boxGeometry args={[1.0, 1.3, 0.08]} />
              <meshStandardMaterial color={c} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.3, 0.05]}>
              <boxGeometry args={[0.6, 0.35, 0.02]} />
              <meshStandardMaterial color="#f4efe6" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Work tables */}
      <mesh position={[-7, 0.72, 2]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.12, 1.4]} />
        <meshStandardMaterial color="#8b6a45" />
      </mesh>
      {[[-8.2, 0.35, 1.4], [-5.8, 0.35, 1.4], [-8.2, 0.35, 2.6], [-5.8, 0.35, 2.6]].map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.1, 0.7, 0.1]} />
          <meshStandardMaterial color="#6d5136" />
        </mesh>
      ))}
      <mesh position={[7, 0.72, 1.5]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.12, 1.3]} />
        <meshStandardMaterial color="#8b6a45" />
      </mesh>

      <Person position={[-7, 0, 2.8]} hue="#6b5a45" pose="type" delay={0.4} />
      <Person position={[6.5, 0, 2.2]} hue="#3f5f73" pose="stand" delay={1} />
      <Person position={[2, 0, 4]} hue="#4d6b58" pose="wave" delay={0.2} />
      <Person position={[-2, 0, 5]} hue="#c45c3e" pose="stand" delay={0.8} yaw={1} />

      <Bookshelf position={[-10, 0, -4]} yaw={Math.PI / 2} />
      <Plant position={[-10, 0, -7]} scale={1.2} />
      <Plant position={[10, 0, -6.5]} scale={1.1} />
      <Plant position={[-9, 0, 6]} scale={1} />
      <Plant position={[9.5, 0, 6]} scale={0.95} />
      <ServicesSignage />

      <pointLight position={[0, 4.5, 0]} intensity={active ? 1.5 : 0} distance={28} color="#fff4e5" />
      <pointLight position={[-5, 3.2, -3]} intensity={active ? 0.45 : 0} distance={12} color="#e85d2c" />
      <pointLight position={[5, 3.2, 2]} intensity={active ? 0.4 : 0} distance={12} color="#ffe0c0" />
    </group>
  )
}

function CafeInterior({ active }) {
  const L = INTERIOR_LAYOUT.cafe
  const steam = useRef()
  useFrame((state) => {
    if (!steam.current) return
    const t = state.clock.elapsedTime
    steam.current.position.y = 1.7 + Math.sin(t * 2.2) * 0.1
    steam.current.scale.setScalar(0.9 + Math.sin(t * 3) * 0.15)
    steam.current.material.opacity = 0.22 + Math.sin(t * 2.5) * 0.1
  })
  return (
    <group>
      <RoomShell
        width={L.width}
        depth={L.depth}
        height={L.height}
        floor="#cbb894"
        wall="#efe6d6"
        ceiling="#f6efe4"
      />
      <Rug position={[0, 0, 1.5]} size={[5, 3.5]} color="#c45c3e" />

      <WindowPane position={[-5, 2.7, -L.depth / 2 + 0.2]} size={[3.2, 2.2]} />
      <WindowPane position={[5, 2.7, -L.depth / 2 + 0.2]} size={[3.2, 2.2]} />
      <WindowPane position={[0, 2.9, -L.depth / 2 + 0.2]} size={[3.8, 2.4]} />
      <WindowPane position={[-L.width / 2 + 0.2, 2.5, 0]} size={[2.2, 2]} rotation={[0, Math.PI / 2, 0]} />

      <Pendant position={[-3, L.height - 1.05, 0]} color="#4f6f56" lit={active} />
      <Pendant position={[0, L.height - 0.95, -1]} color="#4f6f56" lit={active} size={1.15} />
      <Pendant position={[3, L.height - 1.05, 0]} color="#e85d2c" lit={active} />
      <Pendant position={[-4, L.height - 1.15, 4]} color="#4f6f56" lit={active} />
      <Pendant position={[4, L.height - 1.15, 3.5]} color="#4f6f56" lit={active} />

      {/* Bar */}
      <mesh position={[0, 0.7, -3.2]} castShadow receiveShadow>
        <boxGeometry args={[10, 1.2, 1.5]} />
        <meshStandardMaterial color="#8b6a45" />
      </mesh>
      <mesh position={[0, 1.35, -3.2]}>
        <boxGeometry args={[10.2, 0.12, 1.6]} />
        <meshStandardMaterial color="#a67c52" />
      </mesh>
      <mesh position={[0, 0.6, -2.35]}>
        <boxGeometry args={[10, 0.95, 0.1]} />
        <meshStandardMaterial color="#6d5136" />
      </mesh>

      <mesh position={[-2.5, 1.95, -3.4]} castShadow>
        <boxGeometry args={[1.0, 1.1, 0.6]} />
        <meshStandardMaterial color="#2a2f2c" metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh ref={steam} position={[-2.5, 1.7, -2.8]}>
        <sphereGeometry args={[0.25, 10, 10]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.28} />
      </mesh>
      {[0.2, 0.7, 1.2, 1.7].map((x) => (
        <mesh key={x} position={[x, 1.48, -2.7]} castShadow>
          <cylinderGeometry args={[0.1, 0.08, 0.2, 10]} />
          <meshStandardMaterial color="#f4efe6" />
        </mesh>
      ))}
      <mesh position={[3.5, 1.8, -3.3]} castShadow>
        <boxGeometry args={[1.8, 0.8, 0.6]} />
        <meshStandardMaterial color="#d9efe8" transparent opacity={0.55} />
      </mesh>

      {/* Tables */}
      {[
        [-5.5, 2],
        [-2.5, 3.5],
        [1.5, 2.5],
        [5, 3.2],
        [-5, 5],
        [4.5, 5.2],
        [0, 5.5],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.74, 0]} castShadow>
            <cylinderGeometry args={[0.62, 0.62, 0.08, 22]} />
            <meshStandardMaterial color="#d4b896" />
          </mesh>
          <mesh position={[0, 0.37, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 0.74, 8]} />
            <meshStandardMaterial color="#6d5136" />
          </mesh>
          <mesh position={[0.65, 0.5, 0.2]} castShadow>
            <boxGeometry args={[0.42, 0.55, 0.42]} />
            <meshStandardMaterial color="#4f6f56" />
          </mesh>
          <mesh position={[-0.6, 0.5, -0.15]} castShadow>
            <boxGeometry args={[0.42, 0.55, 0.42]} />
            <meshStandardMaterial color="#3d5c42" />
          </mesh>
        </group>
      ))}

      <Person position={[-0.5, 0, -2.2]} hue="#c45c3e" pose="stand" delay={0.5} />
      <Person position={[-5.5, 0, 2.6]} hue="#6b5a45" pose="sit" delay={0.1} />
      <Person position={[5, 0, 3.8]} hue="#3f5f73" pose="sit" delay={1.2} />
      <Person position={[1.5, 0, 3.1]} hue="#4d6b58" pose="sit" delay={0.6} />

      {/* Menu board */}
      <mesh position={[0, 3.2, -L.depth / 2 + 0.25]} castShadow>
        <boxGeometry args={[2.8, 1.7, 0.1]} />
        <meshStandardMaterial color="#2f3a34" />
      </mesh>
      <mesh position={[0, 3.6, -L.depth / 2 + 0.32]}>
        <boxGeometry args={[2.0, 0.22, 0.04]} />
        <meshStandardMaterial color="#e85d2c" />
      </mesh>

      <Plant position={[-8, 0, -6]} scale={1.2} />
      <Plant position={[8, 0, -5.5]} scale={1.1} />
      <Plant position={[-8, 0, 5.5]} scale={0.95} />
      <Plant position={[7.5, 0, 5]} scale={0.9} />

      <CafeSignage />

      <pointLight position={[0, 3.8, 0]} intensity={active ? 1.35 : 0} distance={22} color="#ffe6c4" />
      <pointLight position={[-3, 2.8, -3]} intensity={active ? 0.4 : 0} distance={10} color="#f0d79a" />
    </group>
  )
}

function ContactInterior({ active }) {
  const L = INTERIOR_LAYOUT.contact
  const book = useRef()
  useFrame((state) => {
    if (book.current) book.current.rotation.x = -0.15 + Math.sin(state.clock.elapsedTime * 1.4) * 0.06
  })
  return (
    <group>
      <RoomShell width={L.width} depth={L.depth} height={L.height} floor="#d2c2a8" wall="#e8dfd0" />
      <Rug position={[0, 0, 1]} size={[4.5, 3.2]} color="#4f6f56" />

      <WindowPane position={[-5.5, 2.8, -L.depth / 2 + 0.2]} size={[3.4, 2.3]} />
      <WindowPane position={[4.5, 2.9, -L.depth / 2 + 0.2]} size={[2.8, 2.2]} />
      <WindowPane position={[L.width / 2 - 0.2, 2.6, 0]} size={[2.2, 2]} rotation={[0, -Math.PI / 2, 0]} />

      <Pendant position={[-3.5, L.height - 1.1, -1]} color="#4f6f56" lit={active} />
      <Pendant position={[0, L.height - 1.0, 0]} color="#4f6f56" lit={active} size={1.1} />
      <Pendant position={[3.5, L.height - 1.1, -1]} color="#4f6f56" lit={active} />
      <Pendant position={[0, L.height - 1.15, 4]} color="#e85d2c" lit={active} />

      {/* Counter */}
      <mesh position={[0, 0.75, -2.8]} castShadow receiveShadow>
        <boxGeometry args={[9, 1.3, 1.6]} />
        <meshStandardMaterial color="#8b6a45" />
      </mesh>
      <mesh position={[0, 1.45, -2.8]}>
        <boxGeometry args={[9.2, 0.12, 1.7]} />
        <meshStandardMaterial color="#a67c52" />
      </mesh>
      <mesh position={[0, 2.15, -2.1]}>
        <boxGeometry args={[3.2, 1.1, 0.08]} />
        <meshStandardMaterial color="#9ec4d8" emissive="#7eb0c8" emissiveIntensity={0.25} transparent opacity={0.65} />
      </mesh>

      <mesh position={[-2.5, 1.65, -3]} castShadow>
        <boxGeometry args={[0.8, 0.4, 0.6]} />
        <meshStandardMaterial color="#2a2f2c" metalness={0.3} />
      </mesh>

      {/* Mail slots */}
      {[-4, -2, 0, 2, 4].map((x) =>
        [2.4, 3.15, 3.9].map((y) => (
          <mesh key={`${x}${y}`} position={[x, y, -L.depth / 2 + 0.25]} castShadow>
            <boxGeometry args={[1.4, 0.55, 0.25]} />
            <meshStandardMaterial color={y === 3.15 ? '#3a3228' : '#5a4030'} />
          </mesh>
        )),
      )}
      <mesh position={[0, 4.6, -L.depth / 2 + 0.3]} castShadow>
        <boxGeometry args={[5, 0.6, 0.12]} />
        <meshStandardMaterial color="#f4efe6" />
      </mesh>
      <mesh position={[0, 4.6, -L.depth / 2 + 0.38]}>
        <boxGeometry args={[4, 0.14, 0.04]} />
        <meshStandardMaterial color="#4f6f56" />
      </mesh>

      {/* Lectern + book */}
      <mesh position={[6, 0.6, 2.5]} castShadow>
        <boxGeometry args={[0.9, 1.2, 0.65]} />
        <meshStandardMaterial color="#6d5136" />
      </mesh>
      <group position={[6, 1.3, 2.7]} ref={book}>
        <mesh rotation={[-0.45, 0, 0]} position={[-0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.55, 0.02, 0.75]} />
          <meshStandardMaterial color="#f4efe6" />
        </mesh>
        <mesh rotation={[0.2, 0, 0]} position={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.55, 0.02, 0.75]} />
          <meshStandardMaterial color="#f7f2e9" />
        </mesh>
      </group>

      <mesh position={[-6, 0.75, 2]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.1, 1.0]} />
        <meshStandardMaterial color="#8b6a45" />
      </mesh>
      {[[-6.8, 0.35, 1.6], [-5.2, 0.35, 1.6], [-6.8, 0.35, 2.4], [-5.2, 0.35, 2.4]].map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.1, 0.7, 0.1]} />
          <meshStandardMaterial color="#6d5136" />
        </mesh>
      ))}

      {/* Info frame */}
      <mesh position={[-5, 2.6, -L.depth / 2 + 0.28]} castShadow>
        <boxGeometry args={[1.6, 1.9, 0.1]} />
        <meshStandardMaterial color="#4f6f56" />
      </mesh>
      <mesh position={[-5, 2.6, -L.depth / 2 + 0.36]}>
        <boxGeometry args={[1.35, 1.65, 0.05]} />
        <meshStandardMaterial color="#f4efe6" />
      </mesh>

      <Person position={[1.2, 0, -1.7]} hue="#4d6b58" pose="stand" delay={0.3} />
      <Person position={[-6, 0, 2.7]} hue="#6b5a45" pose="sit" delay={0.8} />
      <Person position={[5, 0, 4]} hue="#3f5f73" pose="stand" delay={0.5} yaw={-0.6} />

      <Bookshelf position={[-8, 0, -3]} yaw={Math.PI / 2} />
      <Plant position={[8, 0, -6]} scale={1.15} />
      <Plant position={[-8, 0, 5]} scale={1} />
      <Plant position={[7.5, 0, 5.5]} scale={0.9} />

      <ContactSignage />

      <pointLight position={[0, 4, 0]} intensity={active ? 1.4 : 0} distance={22} color="#fff1df" />
      <pointLight position={[5.5, 2.5, 2.5]} intensity={active ? 0.4 : 0} distance={8} color="#f0d79a" />
    </group>
  )
}

export function PlaceInterior({ placeId, active }) {
  if (placeId === 'about') return <AboutInterior active={active} />
  if (placeId === 'services') return <ServicesInterior active={active} />
  if (placeId === 'cafe') return <CafeInterior active={active} />
  if (placeId === 'contact') return <ContactInterior active={active} />
  return null
}
