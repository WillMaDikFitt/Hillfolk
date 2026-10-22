import { Suspense, useMemo, useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { places } from './content'
import {
  ArchDoor,
  ArchWindow,
  Awning,
  ChimneyStack,
  GrassTuft,
  LayeredRoof,
  Mat,
  Planter,
  SignBoard,
  Steps,
  StonePlinth,
  TimberBattens,
} from './DetailKit'
import { GlbModel, TOWN_MODELS } from './GlbModel'

function Hill({ position, scale, color = '#6f8f63' }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[1, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
      <meshStandardMaterial color={color} roughness={0.94} />
    </mesh>
  )
}

function Tree({ position, scale = 1, crown = '#3f6b45' }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.16, 1.15, 10]} />
        <Mat type="timber" />
      </mesh>
      {/* Layered canopy — reads as foliage, not one blob */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <icosahedronGeometry args={[0.58, 1]} />
        <meshStandardMaterial color={crown} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0.32, 1.55, 0.15]} castShadow>
        <icosahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial color={crown} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[-0.28, 1.6, -0.18]} castShadow>
        <icosahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial color="#4a7a4e" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0.05, 1.85, -0.05]} castShadow>
        <icosahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial color="#357044" roughness={0.95} flatShading />
      </mesh>
    </group>
  )
}

function Lamp({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.14, 12]} />
        <Mat type="stoneDark" />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.06, 2.2, 10]} />
        <Mat type="metal" />
      </mesh>
      <mesh position={[0, 2.22, 0]}>
        <boxGeometry args={[0.32, 0.1, 0.32]} />
        <Mat type="metal" />
      </mesh>
      {/* Lantern cage */}
      <mesh position={[0, 2.42, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.28, 8, 1, true]} />
        <meshStandardMaterial color="#2a241e" roughness={0.6} metalness={0.3} side={2} />
      </mesh>
      <mesh position={[0, 2.42, 0]}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshStandardMaterial color="#f5e6c8" emissive="#f0d79a" emissiveIntensity={0.85} />
      </mesh>
      <mesh position={[0, 2.6, 0]}>
        <coneGeometry args={[0.16, 0.14, 8]} />
        <Mat type="metal" />
      </mesh>
      <pointLight position={[0, 2.4, 0]} intensity={0.55} distance={8} color="#ffd9a0" />
    </group>
  )
}

function Cloud({ seed, y = 7 }) {
  const ref = useRef()
  const cfg = useMemo(() => {
    const rand = (n) => {
      const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453
      return x - Math.floor(x)
    }
    return {
      x0: -18 + rand(1) * 36,
      z0: -14 + rand(2) * 12,
      speed: 0.1 + rand(3) * 0.16,
      parts: [
        [0, 0, 0, 1.3],
        [1.0, 0.1, 0.15, 0.95],
        [-0.95, 0.08, -0.1, 0.9],
        [0.25, 0.4, 0, 0.7],
        [0.55, 0.15, -0.35, 0.55],
      ],
    }
  }, [seed])

  useFrame((state) => {
    const t = state.clock.elapsedTime * cfg.speed
    ref.current.position.set(((cfg.x0 + t * 4) % 40) - 20, y + Math.sin(t + seed) * 0.25, cfg.z0)
  })

  return (
    <group ref={ref}>
      {cfg.parts.map(([px, py, pz, s], i) => (
        <mesh key={i} position={[px, py, pz]} scale={s}>
          <sphereGeometry args={[1, 14, 12]} />
          <meshStandardMaterial color="#f4f7fa" roughness={1} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Bird({ seed }) {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime * (0.35 + (seed % 5) * 0.04) + seed
    const x = Math.sin(t) * 12 + Math.cos(t * 0.4) * 3
    const z = Math.cos(t * 0.7) * 10 - 4
    const y = 6 + Math.sin(t * 2) * 0.6
    ref.current.position.set(x, y, z)
    ref.current.rotation.y = Math.atan2(
      Math.cos(t) * 12 - Math.sin(t * 0.4) * 1.2,
      -Math.sin(t * 0.7) * 7,
    )
  })
  return (
    <mesh ref={ref} scale={[0.35, 0.12, 0.45]}>
      <coneGeometry args={[0.4, 1, 3]} />
      <meshStandardMaterial color="#2a332e" />
    </mesh>
  )
}

function Walker({ path, color, speed = 1 }) {
  const ref = useRef()
  const legL = useRef()
  const legR = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed
    const u = (Math.sin(t) + 1) / 2
    const x = THREE.MathUtils.lerp(path[0][0], path[1][0], u)
    const z = THREE.MathUtils.lerp(path[0][1], path[1][1], u)
    ref.current.position.set(x, 0.55, z)
    const dx = path[1][0] - path[0][0]
    const dz = path[1][1] - path[0][1]
    const facing = Math.cos(t) >= 0 ? 1 : -1
    ref.current.rotation.y = Math.atan2(dx * facing, dz * facing)
    const swing = Math.sin(t * 6) * 0.45
    legL.current.rotation.x = swing
    legR.current.rotation.x = -swing
  })
  return (
    <group ref={ref}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.45, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#e8c7a6" />
      </mesh>
      <mesh ref={legL} position={[-0.08, 0.15, 0]}>
        <capsuleGeometry args={[0.06, 0.28, 3, 6]} />
        <meshStandardMaterial color="#2f3a34" />
      </mesh>
      <mesh ref={legR} position={[0.08, 0.15, 0]}>
        <capsuleGeometry args={[0.06, 0.28, 3, 6]} />
        <meshStandardMaterial color="#2f3a34" />
      </mesh>
    </group>
  )
}

/** Soft pulsing ring — park here to open (Zesiger-style). */
function PlaceRing({ active, dest }) {
  const ref = useRef()
  const glow = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const pulse = active ? 1 + Math.sin(t * 3.4) * 0.06 : dest ? 1 + Math.sin(t * 2.2) * 0.03 : 1
    ref.current.scale.setScalar(pulse)
    ref.current.rotation.z = t * (active ? 0.55 : 0.28)
    if (glow.current) {
      glow.current.material.opacity = active ? 0.22 + Math.sin(t * 3.4) * 0.06 : dest ? 0.12 : 0.05
    }
  })
  const color = active ? '#e85d2c' : dest ? '#c9a66b' : '#f3ebe0'
  return (
    <group position={[0, 0.04, 1.45]}>
      <mesh ref={glow} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.55, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.15, 1.48, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={active || dest ? color : '#000'}
          emissiveIntensity={active ? 0.55 : dest ? 0.25 : 0}
          transparent
          opacity={active ? 0.95 : dest ? 0.75 : 0.45}
          roughness={0.4}
        />
      </mesh>
      {/* Dashed inner ticks */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, a]}
            position={[Math.cos(a) * 1.0, 0.015, Math.sin(a) * 1.0]}
          >
            <planeGeometry args={[0.12, 0.28]} />
            <meshBasicMaterial color={color} transparent opacity={active ? 0.85 : 0.35} />
          </mesh>
        )
      })}
    </group>
  )
}

function StudioBuilding({ data, lit }) {
  const [w, h, d] = data.size
  const wallY = 0.28
  return (
    <group>
      <StonePlinth width={w} depth={d} height={wallY} />
      <mesh castShadow receiveShadow position={[0, wallY + h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={lit ? '#d7c4a3' : data.color}
          roughness={0.86}
          emissive={lit ? '#3d5c42' : '#000'}
          emissiveIntensity={lit ? 0.16 : 0}
        />
      </mesh>
      <TimberBattens width={w} height={h} z={d / 2 + 0.03} count={5} />
      {/* Corner quoins */}
      {[
        [-w / 2, d / 2],
        [w / 2, d / 2],
        [-w / 2, -d / 2],
        [w / 2, -d / 2],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, wallY + h * 0.35, z]} castShadow>
          <boxGeometry args={[0.14, h * 0.7, 0.14]} />
          <Mat type="stone" />
        </mesh>
      ))}
      <LayeredRoof width={w} depth={d} wallH={wallY + h} color={data.roof} />
      <ChimneyStack position={[0.55, wallY + h + 0.95, -0.15]} />
      <ArchDoor position={[0, wallY + 0.85, d / 2 + 0.05]} lit={lit} />
      <ArchWindow position={[-0.78, wallY + 2.15, d / 2 + 0.05]} lit={lit} />
      <ArchWindow position={[0.78, wallY + 2.15, d / 2 + 0.05]} lit={lit} />
      <ArchWindow
        position={[-0.7, wallY + 2.1, -d / 2 - 0.05]}
        rotation={[0, Math.PI, 0]}
        width={0.55}
        height={0.7}
        lit={lit}
      />
      <ArchWindow
        position={[0.7, wallY + 2.1, -d / 2 - 0.05]}
        rotation={[0, Math.PI, 0]}
        width={0.55}
        height={0.7}
        lit={lit}
      />
      <SignBoard position={[0, wallY + 2.75, d / 2 + 0.14]} width={1.55} />
      <Steps width={1.15} position={[0, 0, d / 2]} steps={3} />
      <Planter position={[-1.15, 0.15, d / 2 + 0.35]} flower="#e85d2c" />
      <Planter position={[1.15, 0.15, d / 2 + 0.35]} flower="#c9a66b" />
      {/* Side gutter */}
      <mesh position={[w / 2 + 0.02, wallY + h * 0.7, 0]}>
        <cylinderGeometry args={[0.04, 0.04, h * 0.9, 8]} />
        <Mat type="metal" />
      </mesh>
    </group>
  )
}

function BillboardBuilding({ data, lit }) {
  return (
    <>
      {/* Concrete pads */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[0.7, 0.12, 0.7]} />
        <meshStandardMaterial color="#6a6358" />
      </mesh>
      <mesh position={[1.1, 0.06, 0]} receiveShadow>
        <boxGeometry args={[0.7, 0.12, 0.7]} />
        <meshStandardMaterial color="#6a6358" />
      </mesh>
      {/* Posts with bolts */}
      <mesh castShadow position={[0, 1.15, 0]}>
        <boxGeometry args={[0.28, 2.3, 0.28]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[1.1, 1.15, 0]}>
        <boxGeometry args={[0.28, 2.3, 0.28]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.2} roughness={0.7} />
      </mesh>
      {/* Cross brace */}
      <mesh position={[0.55, 1.4, -0.05]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[1.35, 0.08, 0.08]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      <mesh position={[0.55, 1.4, -0.05]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[1.35, 0.08, 0.08]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      {/* Main board */}
      <mesh castShadow receiveShadow position={[0.55, 2.7, 0]}>
        <boxGeometry args={[3.5, 2.15, 0.16]} />
        <meshStandardMaterial
          color={lit ? '#fff8ee' : '#f4efe6'}
          roughness={0.65}
          emissive={lit ? '#e85d2c' : '#000'}
          emissiveIntensity={lit ? 0.1 : 0}
        />
      </mesh>
      {/* Frame */}
      <mesh position={[0.55, 2.7, 0.1]}>
        <boxGeometry args={[3.6, 2.25, 0.04]} />
        <meshStandardMaterial color="#1c2420" transparent opacity={0} />
      </mesh>
      <mesh position={[0.55, 3.8, 0.02]}>
        <boxGeometry args={[3.65, 0.1, 0.28]} />
        <meshStandardMaterial color="#1c2420" />
      </mesh>
      <mesh position={[0.55, 1.6, 0.02]}>
        <boxGeometry args={[3.65, 0.1, 0.28]} />
        <meshStandardMaterial color="#1c2420" />
      </mesh>
      {[-1.2, 0.55, 2.3].map((x) => (
        <mesh key={x} position={[x, 2.7, 0.1]}>
          <boxGeometry args={[0.08, 2.2, 0.06]} />
          <meshStandardMaterial color="#1c2420" />
        </mesh>
      ))}
      {/* Flood lights */}
      {[-0.7, 0.55, 1.8].map((x) => (
        <group key={x} position={[x, 3.65, 0.35]}>
          <mesh rotation={[0.45, 0, 0]}>
            <boxGeometry args={[0.4, 0.16, 0.5]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0, -0.12, 0.05]}>
            <boxGeometry args={[0.28, 0.06, 0.2]} />
            <meshStandardMaterial
              color="#ffe8c8"
              emissive="#ffe8c8"
              emissiveIntensity={lit ? 0.9 : 0.35}
            />
          </mesh>
        </group>
      ))}
      {/* Brand stripe + fake copy blocks */}
      <mesh position={[0.55, 3.05, 0.1]}>
        <boxGeometry args={[2.7, 0.32, 0.04]} />
        <meshStandardMaterial color="#e85d2c" />
      </mesh>
      <mesh position={[0.55, 2.55, 0.1]}>
        <boxGeometry args={[2.4, 0.12, 0.03]} />
        <meshStandardMaterial color="#c9a66b" />
      </mesh>
      <mesh position={[0.55, 2.25, 0.1]}>
        <boxGeometry args={[2.0, 0.1, 0.03]} />
        <meshStandardMaterial color="#d8cfc2" />
      </mesh>
      <mesh position={[0.2, 1.95, 0.1]}>
        <boxGeometry args={[1.4, 0.35, 0.03]} />
        <meshStandardMaterial color="#e8dfd2" />
      </mesh>
    </>
  )
}

function CafeBuilding({ data, lit }) {
  const [w, h, d] = data.size
  const base = 0.22
  return (
    <group>
      <StonePlinth width={w} depth={d} height={base} />
      <mesh castShadow receiveShadow position={[0, base + h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={lit ? '#e2c9a0' : data.color} roughness={0.8} />
      </mesh>
      <LayeredRoof width={w} depth={d} wallH={base + h} color={data.roof} style="flat" />
      <ArchDoor position={[0.4, base + 0.7, d / 2 + 0.05]} width={0.58} height={1.35} lit={lit} />
      <ArchWindow
        position={[-0.55, base + 1.15, d / 2 + 0.05]}
        width={1.05}
        height={1.1}
        lit={lit}
        panes={[2, 2]}
      />
      <ArchWindow
        position={[-w / 2 - 0.05, base + 1.15, 0.1]}
        rotation={[0, Math.PI / 2, 0]}
        width={0.7}
        height={0.85}
        lit={lit}
      />
      <group position={[0, base + 1.85, 0]}>
        <Awning width={w} z={d / 2 + 0.35} />
      </group>
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
        <mesh key={i} position={[x, base + 1.72, d / 2 + 0.55]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color="#ffe6a8" emissive="#ffd070" emissiveIntensity={0.9} />
        </mesh>
      ))}
      {[-0.8, 0.8].map((x) => (
        <group key={x} position={[x, 0, d / 2 + 1.05]}>
          <mesh position={[0, 0.58, 0]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.06, 20]} />
            <Mat type="paper" />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.045, 0.055, 0.55, 8]} />
            <Mat type="timber" />
          </mesh>
          <mesh position={[0.32, 0.48, 0.12]} castShadow>
            <boxGeometry args={[0.24, 0.48, 0.24]} />
            <meshStandardMaterial color="#3f6f8a" roughness={0.75} />
          </mesh>
        </group>
      ))}
      <group position={[w / 2 + 0.1, base + 1.05, 0.45]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.75, 0.06]} />
          <Mat type="timberDark" />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.4, 0.6, 0.02]} />
          <Mat type="paper" />
        </mesh>
      </group>
      <Planter position={[-w / 2 - 0.2, 0.12, d / 2 + 0.2]} flower="#4f6f56" />
      <Steps width={0.9} position={[0.35, 0, d / 2]} steps={2} />
    </group>
  )
}

function PostBuilding({ data, lit }) {
  const [w, h, d] = data.size
  const base = 0.24
  return (
    <group>
      <StonePlinth width={w} depth={d} height={base} />
      <mesh castShadow receiveShadow position={[0, base + h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={lit ? '#c5d0da' : data.color} roughness={0.86} />
      </mesh>
      {/* Cornice layers */}
      <mesh castShadow position={[0, base + h + 0.12, 0]}>
        <boxGeometry args={[w + 0.45, 0.2, d + 0.45]} />
        <Mat type="roof" color={data.roof} />
      </mesh>
      <mesh position={[0, base + h + 0.28, 0]}>
        <boxGeometry args={[w + 0.2, 0.1, d + 0.2]} />
        <Mat type="metal" color="#2f3a42" />
      </mesh>
      <mesh position={[0.75, base + h + 1.0, -0.25]}>
        <cylinderGeometry args={[0.028, 0.028, 1.5, 8]} />
        <Mat type="metal" color="#8a8578" />
      </mesh>
      <mesh position={[1.05, base + h + 1.4, -0.25]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.55, 0.35, 0.03]} />
        <meshStandardMaterial color="#e85d2c" roughness={0.7} />
      </mesh>
      <SignBoard position={[0, base + h + 0.55, d / 2 + 0.08]} width={1.65} />
      <ArchDoor position={[0, base + 0.85, d / 2 + 0.05]} width={0.68} height={1.55} lit={lit} />
      <ArchWindow position={[-0.72, base + 1.9, d / 2 + 0.05]} width={0.55} height={0.75} lit={lit} />
      <ArchWindow position={[0.72, base + 1.9, d / 2 + 0.05]} width={0.55} height={0.75} lit={lit} />
      <mesh position={[0, base + 1.1, d / 2 + 0.42]} castShadow>
        <boxGeometry args={[1.6, 0.12, 0.55]} />
        <Mat type="timber" color="#8b6a45" />
      </mesh>
      <mesh position={[0, base + 0.65, d / 2 + 0.35]} castShadow>
        <boxGeometry args={[1.45, 0.7, 0.4]} />
        <Mat type="timberDark" color="#6b5340" />
      </mesh>
      <group position={[-w / 2 - 0.28, 0.75, 0.55]}>
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.6, 0.3]} />
          <meshStandardMaterial color="#4f6f56" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.12, 0.16]}>
          <boxGeometry args={[0.24, 0.06, 0.04]} />
          <Mat type="metal" />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[0.42, 0.08, 0.34]} />
          <meshStandardMaterial color="#3d5a44" />
        </mesh>
      </group>
      <Steps width={1.2} position={[0, 0, d / 2 + 0.15]} steps={2} />
      <Planter position={[w / 2 + 0.25, 0.12, d / 2 + 0.15]} flower="#c9a66b" />
    </group>
  )
}

function ProceduralBuilding({ data, lit }) {
  if (data.kind === 'studio') return <StudioBuilding data={data} lit={lit} />
  if (data.kind === 'billboard') return <BillboardBuilding data={data} lit={lit} />
  if (data.kind === 'cafe') return <CafeBuilding data={data} lit={lit} />
  if (data.kind === 'post') return <PostBuilding data={data} lit={lit} />
  return null
}

function AssetBuilding({ data, lit }) {
  const cfg = TOWN_MODELS[data.id]
  if (!cfg) return <ProceduralBuilding data={data} lit={lit} />
  return (
    <Suspense fallback={<ProceduralBuilding data={data} lit={lit} />}>
      <GlbModel
        url={cfg.url}
        fit={cfg.fit}
        scaleBoost={cfg.scaleBoost}
        rotation={[0, cfg.yaw || 0, 0]}
      />
      {/* Soft ground pad so the asset sits into the hill */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.2]} receiveShadow>
        <circleGeometry args={[Math.max(data.size[0], data.size[2]) * 0.85, 24]} />
        <meshStandardMaterial color="#6a6358" roughness={1} />
      </mesh>
    </Suspense>
  )
}

function Building({ data, near, isDest, onSelect, onHover, useAssets = true }) {
  const [hot, setHot] = useState(false)
  const lit = hot || near
  const [w, h] = data.size
  const labelY = useAssets ? h + 1.8 : h + (data.kind === 'billboard' ? 2.4 : 1.55)

  return (
    <group position={data.position}>
      <PlaceRing active={near} dest={isDest && !near} />
      <group
        onPointerOver={(e) => {
          e.stopPropagation()
          setHot(true)
          onHover?.(data)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHot(false)
          onHover?.(null)
          document.body.style.cursor = 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.(data.id)
        }}
      >
        {useAssets ? <AssetBuilding data={data} lit={lit} /> : <ProceduralBuilding data={data} lit={lit} />}
      </group>
      <Html position={[0, labelY, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className={`label-chip ${lit ? 'is-hot' : ''} ${isDest ? 'is-dest' : ''}`}>{data.label}</div>
      </Html>
    </group>
  )
}

function Road() {
  const strips = [
    { pos: [0, 0.02, 3.2], size: [18, 3.4] },
    { pos: [0, 0.02, -4], size: [18, 2.8] },
    { pos: [-7.2, 0.02, -0.5], size: [2.8, 8.5] },
    { pos: [7.2, 0.02, -0.2], size: [2.8, 8.5] },
    { pos: [0, 0.02, 8], size: [5.2, 10] },
  ]
  return (
    <group>
      {/* Road shoulder */}
      {strips.map((s, i) => (
        <mesh key={`s${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[s.pos[0], 0.015, s.pos[2]]} receiveShadow>
          <planeGeometry args={[s.size[0] + 0.6, s.size[1] + 0.5]} />
          <meshStandardMaterial color="#5a554c" roughness={1} />
        </mesh>
      ))}
      {strips.map((s, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={s.pos} receiveShadow>
          <planeGeometry args={s.size} />
          <meshStandardMaterial color="#6a6358" roughness={0.95} />
        </mesh>
      ))}
      {/* Center dashes */}
      {[-1, 1, 3, 5, 7, 9].map((z, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, z]}>
          <planeGeometry args={[0.16, 0.65]} />
          <meshStandardMaterial color="#e8d9b8" />
        </mesh>
      ))}
      {/* Edge lines */}
      {[-1.55, 1.55].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.032, 4]}>
          <planeGeometry args={[0.06, 8]} />
          <meshStandardMaterial color="#d4c8a8" transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  )
}

function Fountain() {
  const spout = useRef()
  const drops = useRef([])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    spout.current.position.y = 0.85 + Math.sin(t * 4) * 0.08
    spout.current.scale.y = 0.8 + Math.sin(t * 4) * 0.2
    drops.current.forEach((d, i) => {
      if (!d) return
      const phase = t * 2.2 + i * 1.1
      d.position.y = 0.7 + Math.abs(Math.sin(phase)) * 0.55
      d.position.x = Math.cos(phase * 1.3 + i) * 0.25
      d.position.z = Math.sin(phase * 1.1 + i) * 0.25
      d.scale.setScalar(0.08 + Math.abs(Math.sin(phase)) * 0.06)
    })
  })
  return (
    <group position={[0, 0, 0.4]}>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[1.25, 1.4, 0.28, 32]} />
        <meshStandardMaterial color="#8a9094" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[1.05, 1.15, 0.18, 32]} />
        <meshStandardMaterial color="#9aa3a8" />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.08, 32]} />
        <meshStandardMaterial color="#7eb0c8" transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.45, 16]} />
        <meshStandardMaterial color="#9aa3a8" />
      </mesh>
      <mesh ref={spout} position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#9ec4d8" transparent opacity={0.75} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            drops.current[i] = el
          }}
          position={[0, 0.7, 0]}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#b5d8e8" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Fence({ from, to }) {
  const posts = []
  const dx = to[0] - from[0]
  const dz = to[1] - from[1]
  const len = Math.hypot(dx, dz)
  const n = Math.max(2, Math.floor(len / 1.2))
  for (let i = 0; i <= n; i++) {
    const t = i / n
    posts.push([from[0] + dx * t, from[1] + dz * t])
  }
  return (
    <group>
      {posts.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.45, z]} castShadow>
          <boxGeometry args={[0.08, 0.9, 0.08]} />
          <meshStandardMaterial color="#5a4030" />
        </mesh>
      ))}
      <mesh
        position={[(from[0] + to[0]) / 2, 0.7, (from[1] + to[1]) / 2]}
        rotation={[0, -Math.atan2(dz, dx), 0]}
      >
        <boxGeometry args={[len, 0.06, 0.05]} />
        <meshStandardMaterial color="#6b4f38" />
      </mesh>
      <mesh
        position={[(from[0] + to[0]) / 2, 0.4, (from[1] + to[1]) / 2]}
        rotation={[0, -Math.atan2(dz, dx), 0]}
      >
        <boxGeometry args={[len, 0.05, 0.04]} />
        <meshStandardMaterial color="#6b4f38" />
      </mesh>
    </group>
  )
}

function Bench({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.1, 0.08, 0.4]} />
        <meshStandardMaterial color="#6b4f38" />
      </mesh>
      <mesh position={[0, 0.55, -0.15]}>
        <boxGeometry args={[1.1, 0.35, 0.08]} />
        <meshStandardMaterial color="#5a4030" />
      </mesh>
      {[-0.45, 0.45].map((x) => (
        <mesh key={x} position={[x, 0.18, 0]}>
          <boxGeometry args={[0.08, 0.35, 0.35]} />
          <meshStandardMaterial color="#4a3a2c" />
        </mesh>
      ))}
    </group>
  )
}

function MarketStall({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.12, 1.1]} />
        <meshStandardMaterial color="#8b6a45" />
      </mesh>
      {[-0.75, 0.75].map((x) => (
        <mesh key={x} position={[x, 0.28, 0.4]}>
          <cylinderGeometry args={[0.05, 0.05, 0.55, 6]} />
          <meshStandardMaterial color="#5a4030" />
        </mesh>
      ))}
      {[-0.75, 0.75].map((x) => (
        <mesh key={`b${x}`} position={[x, 0.28, -0.4]}>
          <cylinderGeometry args={[0.05, 0.05, 0.55, 6]} />
          <meshStandardMaterial color="#5a4030" />
        </mesh>
      ))}
      <mesh position={[0, 1.35, 0]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[2.0, 0.08, 1.3]} />
        <meshStandardMaterial color="#e85d2c" />
      </mesh>
      <mesh position={[0, 1.55, -0.55]}>
        <boxGeometry args={[1.6, 0.35, 0.06]} />
        <meshStandardMaterial color="#f4efe6" />
      </mesh>
      {[-0.45, 0, 0.45].map((x, i) => (
        <mesh key={i} position={[x, 0.72, 0.1]} castShadow>
          <sphereGeometry args={[0.16, 10, 10]} />
          <meshStandardMaterial color={['#c45c3e', '#d4a017', '#4f6f56'][i]} />
        </mesh>
      ))}
    </group>
  )
}

function FlowerBed({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[1.4, 0.22, 0.7]} />
        <meshStandardMaterial color="#6b5340" />
      </mesh>
      {[-0.4, 0, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.35, (i - 1) * 0.12]}>
          <sphereGeometry args={[0.14, 8, 8]} />
          <meshStandardMaterial color={i === 1 ? '#e85d2c' : '#c9a66b'} />
        </mesh>
      ))}
    </group>
  )
}

export function Town({ nearId, destId, onSelectBuilding, onHoverBuilding }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[40, 64]} />
        <meshStandardMaterial color="#7f9a68" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12, 0.01, 6]} receiveShadow>
        <circleGeometry args={[5, 24]} />
        <meshStandardMaterial color="#8fad72" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12, 0.01, 7]} receiveShadow>
        <circleGeometry args={[4.5, 24]} />
        <meshStandardMaterial color="#86a56c" roughness={1} />
      </mesh>
      {/* Path stones around fountain */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2
        return (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, a]}
            position={[Math.cos(a) * 2.1, 0.025, Math.sin(a) * 2.1 + 0.4]}
            receiveShadow
          >
            <circleGeometry args={[0.28, 8]} />
            <meshStandardMaterial color="#9a9588" roughness={0.95} />
          </mesh>
        )
      })}

      <Road />
      <Fountain />

      <Hill position={[-14, 0, -11]} scale={[9, 4, 6.5]} color="#5f7d55" />
      <Hill position={[13, 0, -12]} scale={[10, 4.6, 7]} color="#6a875c" />
      <Hill position={[1, 0, -16]} scale={[13, 5.5, 7.5]} color="#587450" />
      <Hill position={[-11, 0, 12]} scale={[6.5, 2.8, 5]} color="#738f62" />
      <Hill position={[12, 0, 13]} scale={[5.5, 2.4, 4.5]} color="#6d8a5e" />

      <Suspense fallback={null}>
        <GlbModel
          url={TOWN_MODELS.church.url}
          position={[2, 0, -14.5]}
          fit={TOWN_MODELS.church.fit}
          scaleBoost={TOWN_MODELS.church.scaleBoost}
          rotation={[0, 0.35, 0]}
        />
      </Suspense>

      {places.map((b) => (
        <Building
          key={b.id}
          data={b}
          near={nearId === b.id}
          isDest={destId === b.id}
          onSelect={onSelectBuilding}
          onHover={onHoverBuilding}
          useAssets
        />
      ))}

      {[1, 2, 3, 4, 5, 6, 7].map((s) => (
        <Cloud key={s} seed={s} y={8 + s * 0.35} />
      ))}
      {[1, 2, 3, 4, 5].map((s) => (
        <Bird key={s} seed={s * 17.3} />
      ))}

      <Walker path={[[-7, 4.5], [7, 4.2]]} color="#c45c3e" speed={0.5} />
      <Walker path={[[5, 6], [-4, 6.5]]} color="#3f6f8a" speed={0.38} />
      <Walker path={[[-2, 8.5], [3, 5]]} color="#d4a017" speed={0.62} />

      {/* Off the roadway — shoulders / grass only */}
      <Lamp position={[-5.4, 0, 5.6]} />
      <Lamp position={[5.4, 0, 5.6]} />
      <Lamp position={[-9.6, 0, -0.5]} />
      <Lamp position={[9.6, 0, 0]} />
      <Lamp position={[-2.9, 0, 10.2]} />
      <Lamp position={[2.9, 0, 10.2]} />

      <Fence from={[-10, 5.5]} to={[-4, 5.5]} />
      <Fence from={[4, 5.5]} to={[10, 5.5]} />

      <Bench position={[-2.2, 0, 5.2]} rotation={0.2} />
      <Bench position={[2.4, 0, 5.0]} rotation={-0.15} />
      <MarketStall position={[-5.2, 0, 5.8]} rotation={0.35} />
      <FlowerBed position={[5.8, 0, 5.5]} />
      <FlowerBed position={[-8.8, 0, 3.2]} />
      <FlowerBed position={[9, 0, -3.5]} />

      {/* Ground texture: grass tufts along shoulders */}
      {[
        [-6.2, 5.2],
        [-5.5, 6.1],
        [6.0, 5.4],
        [6.8, 6.0],
        [-10.2, 2],
        [10.5, 1.5],
        [-3.5, 7.2],
        [3.2, 7.5],
        [-9, -4],
        [9.2, -5],
        [-1.5, -6.5],
        [2, -7],
        [-11, 7],
        [11.5, 6.5],
      ].map(([x, z], i) => (
        <GrassTuft key={`g${i}`} position={[x, 0, z]} scale={0.7 + (i % 4) * 0.15} />
      ))}

      {[
        [-9, 1, -3],
        [-10.5, 0.9, 1],
        [9.5, 1.1, -2],
        [10, 0.85, 3],
        [-5, 1.2, 7],
        [5.5, 1, 7.5],
        [-12, 1.3, 5],
        [11, 1, 8],
        [-3, 0.9, -7],
        [4, 1.1, -8],
        [-8, 1.15, 8],
        [8.5, 0.95, -6],
      ].map((p, i) => (
        <Tree key={i} position={p} scale={0.85 + (i % 3) * 0.15} crown={i % 2 ? '#3f6b45' : '#4a7a4e'} />
      ))}
    </group>
  )
}
