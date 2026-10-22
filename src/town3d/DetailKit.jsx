/**
 * Shared architectural pieces — the difference between “boxes” and a place.
 * Keep proportions small and layered; silhouette + trim sells craft.
 */
import { useMemo } from 'react'

export const MAT = {
  plaster: { color: '#d7c4a3', roughness: 0.88 },
  plasterWarm: { color: '#e2c9a0', roughness: 0.82 },
  stone: { color: '#8a8578', roughness: 0.95 },
  stoneDark: { color: '#6a6558', roughness: 0.92 },
  timber: { color: '#5a4030', roughness: 0.78 },
  timberDark: { color: '#3a2a1c', roughness: 0.75 },
  roof: { color: '#4a3f35', roughness: 0.9 },
  roofMoss: { color: '#3d4f3a', roughness: 0.92 },
  metal: { color: '#2a2a2a', roughness: 0.55, metalness: 0.35 },
  glass: { color: '#9ec4d8', roughness: 0.2, metalness: 0.1, emissive: '#6aa8c8', emissiveIntensity: 0.25 },
  glassLit: { color: '#e8f6f0', roughness: 0.15, metalness: 0.05, emissive: '#8fd0b8', emissiveIntensity: 0.55 },
  paper: { color: '#f4efe6', roughness: 0.85 },
  brass: { color: '#c9a66b', roughness: 0.35, metalness: 0.65 },
  terracotta: { color: '#c45c3e', roughness: 0.8 },
  moss: { color: '#3f6b45', roughness: 0.95 },
  asphalt: { color: '#5a554c', roughness: 0.98 },
  road: { color: '#6a6358', roughness: 0.96 },
}

export function Mat({ type = 'plaster', color, ...rest }) {
  const base = MAT[type] || MAT.plaster
  return <meshStandardMaterial {...base} color={color || base.color} {...rest} />
}

/** Framed window with sill, mullions, slight depth */
export function ArchWindow({
  position,
  rotation = [0, 0, 0],
  width = 0.7,
  height = 0.85,
  depth = 0.08,
  lit = false,
  panes = [2, 2],
}) {
  const [cols, rows] = panes
  const inset = 0.06
  const glassW = width - inset * 2
  const glassH = height - inset * 2
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[width, height, depth]} />
        <Mat type="timberDark" />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 0, depth / 2 + 0.01]}>
        <boxGeometry args={[glassW, glassH, 0.02]} />
        <Mat type={lit ? 'glassLit' : 'glass'} transparent opacity={0.85} />
      </mesh>
      {/* Mullions */}
      {Array.from({ length: cols - 1 }).map((_, i) => {
        const x = -glassW / 2 + ((i + 1) / cols) * glassW
        return (
          <mesh key={`c${i}`} position={[x, 0, depth / 2 + 0.02]}>
            <boxGeometry args={[0.035, glassH, 0.03]} />
            <Mat type="timber" />
          </mesh>
        )
      })}
      {Array.from({ length: rows - 1 }).map((_, i) => {
        const y = -glassH / 2 + ((i + 1) / rows) * glassH
        return (
          <mesh key={`r${i}`} position={[0, y, depth / 2 + 0.02]}>
            <boxGeometry args={[glassW, 0.035, 0.03]} />
            <Mat type="timber" />
          </mesh>
        )
      })}
      {/* Sill */}
      <mesh position={[0, -height / 2 - 0.04, depth * 0.4]} castShadow>
        <boxGeometry args={[width + 0.12, 0.07, depth + 0.12]} />
        <Mat type="stone" />
      </mesh>
      {/* Lintal */}
      <mesh position={[0, height / 2 + 0.04, 0]}>
        <boxGeometry args={[width + 0.1, 0.08, depth + 0.04]} />
        <Mat type="timber" />
      </mesh>
    </group>
  )
}

export function ArchDoor({ position, rotation = [0, 0, 0], width = 0.75, height = 1.65, lit = false }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[width + 0.14, height + 0.1, 0.12]} />
        <Mat type="timberDark" />
      </mesh>
      <mesh position={[0, 0, 0.05]} castShadow>
        <boxGeometry args={[width, height, 0.08]} />
        <Mat type="timber" color="#6b4f38" />
      </mesh>
      {/* Panels */}
      <mesh position={[0, 0.28, 0.1]}>
        <boxGeometry args={[width * 0.7, height * 0.28, 0.03]} />
        <Mat type="timberDark" />
      </mesh>
      <mesh position={[0, -0.28, 0.1]}>
        <boxGeometry args={[width * 0.7, height * 0.28, 0.03]} />
        <Mat type="timberDark" />
      </mesh>
      {/* Handle */}
      <mesh position={[width * 0.28, 0, 0.14]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <Mat type="brass" />
      </mesh>
      {/* Transom */}
      <mesh position={[0, height / 2 + 0.22, 0.02]}>
        <boxGeometry args={[width * 0.85, 0.28, 0.06]} />
        <Mat type={lit ? 'glassLit' : 'glass'} transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

export function StonePlinth({ width, depth, height = 0.28 }) {
  return (
    <group>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.35, height, depth + 0.35]} />
        <Mat type="stone" />
      </mesh>
      {/* Cap edge */}
      <mesh position={[0, height + 0.03, 0]} receiveShadow>
        <boxGeometry args={[width + 0.42, 0.06, depth + 0.42]} />
        <Mat type="stoneDark" />
      </mesh>
    </group>
  )
}

export function Steps({ width = 1.2, position = [0, 0, 0], steps = 3 }) {
  return (
    <group position={position}>
      {Array.from({ length: steps }).map((_, i) => (
        <mesh
          key={i}
          position={[0, 0.08 + i * 0.12, 0.35 - i * 0.18]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[width - i * 0.08, 0.12, 0.32]} />
          <Mat type="stoneDark" />
        </mesh>
      ))}
    </group>
  )
}

/** Layered hip / gable roof with overhang and ridge */
export function LayeredRoof({ width, depth, wallH, color = '#4a3f35', style = 'hip' }) {
  const span = Math.max(width, depth)
  if (style === 'flat') {
    return (
      <group>
        <mesh position={[0, wallH + 0.12, 0.05]} castShadow>
          <boxGeometry args={[width + 0.55, 0.14, depth + 0.7]} />
          <Mat type="roof" color={color} />
        </mesh>
        <mesh position={[0, wallH + 0.22, 0]}>
          <boxGeometry args={[width + 0.2, 0.06, depth + 0.2]} />
          <Mat type="metal" />
        </mesh>
      </group>
    )
  }
  return (
    <group>
      <mesh position={[0, wallH + 0.55, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[span * 0.9, 1.45, 4]} />
        <Mat type="roof" color={color} />
      </mesh>
      {/* Overhang fascia */}
      <mesh position={[0, wallH + 0.08, 0]}>
        <boxGeometry args={[width + 0.45, 0.1, depth + 0.45]} />
        <Mat type="timberDark" />
      </mesh>
      {/* Ridge cap hint */}
      <mesh position={[0, wallH + 1.2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.12, 0.08, span * 0.55]} />
        <Mat type="metal" />
      </mesh>
    </group>
  )
}

export function ChimneyStack({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.38, 0.85, 0.38]} />
        <Mat type="stoneDark" color="#6a5a4a" />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[0.48, 0.12, 0.48]} />
        <Mat type="stone" />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <boxGeometry args={[0.22, 0.12, 0.22]} />
        <Mat type="metal" />
      </mesh>
    </group>
  )
}

export function Planter({ position, flower = '#e85d2c' }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.18, 0.32, 10]} />
        <Mat type="terracotta" />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.16, 10, 10]} />
        <Mat type="moss" />
      </mesh>
      <mesh position={[0.06, 0.32, 0.04]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color={flower} roughness={0.7} />
      </mesh>
    </group>
  )
}

export function TimberBattens({ width, height, z = 0, count = 4 }) {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const x = -width / 2 + 0.12 + (i / (count - 1 || 1)) * (width - 0.24)
        return (
          <mesh key={i} position={[x, height / 2, z]}>
            <boxGeometry args={[0.07, height * 0.92, 0.06]} />
            <Mat type="timber" />
          </mesh>
        )
      })}
      <mesh position={[0, height * 0.55, z]}>
        <boxGeometry args={[width * 0.95, 0.07, 0.06]} />
        <Mat type="timber" />
      </mesh>
    </group>
  )
}

export function GrassTuft({ position, scale = 1 }) {
  const blades = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        x: (i - 2) * 0.06,
        rot: (i - 2) * 0.15,
        h: 0.25 + (i % 3) * 0.06,
      })),
    [],
  )
  return (
    <group position={position} scale={scale}>
      {blades.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, 0]} rotation={[0.15, b.rot, 0.08 * (i - 2)]}>
          <coneGeometry args={[0.03, b.h, 4]} />
          <Mat type="moss" color={i % 2 ? '#4a7a4e' : '#3f6b45'} />
        </mesh>
      ))}
    </group>
  )
}

export function SignBoard({ position, width = 1.5, textColor = '#1c2420' }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[width, 0.38, 0.08]} />
        <Mat type="paper" />
      </mesh>
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[0.06, 0.55, 0.06]} />
        <Mat type="timberDark" />
      </mesh>
      <mesh position={[0, 0.12, 0.05]}>
        <boxGeometry args={[width * 0.7, 0.05, 0.02]} />
        <meshStandardMaterial color="#e85d2c" />
      </mesh>
      <mesh position={[0, -0.05, 0.05]}>
        <boxGeometry args={[width * 0.55, 0.04, 0.02]} />
        <meshStandardMaterial color={textColor} />
      </mesh>
    </group>
  )
}

export function Awning({ width, z, color = '#e85d2c' }) {
  return (
    <group>
      <mesh position={[0, 0, z]} rotation={[0.45, 0, 0]} castShadow>
        <boxGeometry args={[width + 0.25, 0.07, 0.9]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const x = -width / 2 + 0.15 + (i / 4) * width
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0.45, 0, 0]}>
            <boxGeometry args={[0.18, 0.075, 0.92]} />
            <Mat type="paper" />
          </mesh>
        )
      })}
      {[-width / 2 + 0.1, width / 2 - 0.1].map((x) => (
        <mesh key={x} position={[x, -0.55, z + 0.35]}>
          <cylinderGeometry args={[0.025, 0.025, 1.2, 6]} />
          <Mat type="metal" />
        </mesh>
      ))}
    </group>
  )
}
