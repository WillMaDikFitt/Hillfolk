import { INTERIOR_LAYOUT } from './interiorLayout'
import { Bookshelf, Pendant, Person, Plant, RoomShell, Rug, WindowPane } from './InteriorProps'
import { AboutSignage } from './WorldSignage'

function Desk({ position, yaw = 0 }) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.09, 0.85]} />
        <meshStandardMaterial color="#8b6a45" roughness={0.7} />
      </mesh>
      {[[-0.7, -0.3], [0.7, -0.3], [-0.7, 0.3], [0.7, 0.3]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.38, z]} castShadow>
          <boxGeometry args={[0.1, 0.76, 0.1]} />
          <meshStandardMaterial color="#6d5136" />
        </mesh>
      ))}
      <mesh position={[0.2, 1.2, -0.18]} castShadow>
        <boxGeometry args={[0.75, 0.48, 0.06]} />
        <meshStandardMaterial color="#1d2422" emissive="#2f6f62" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.2, 0.94, -0.12]}>
        <boxGeometry args={[0.14, 0.22, 0.14]} />
        <meshStandardMaterial color="#2a2f2c" />
      </mesh>
      <mesh position={[-0.4, 0.86, 0.12]}>
        <boxGeometry args={[0.38, 0.04, 0.26]} />
        <meshStandardMaterial color="#2c3330" />
      </mesh>
      <mesh position={[-0.55, 0.88, -0.15]}>
        <cylinderGeometry args={[0.08, 0.07, 0.14, 10]} />
        <meshStandardMaterial color="#f4efe6" />
      </mesh>
    </group>
  )
}

function Sofa({ position, yaw = 0 }) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[3.2, 0.5, 1.1]} />
        <meshStandardMaterial color="#3d5c42" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.85, -0.4]} castShadow>
        <boxGeometry args={[3.2, 0.7, 0.28]} />
        <meshStandardMaterial color="#4f6f56" />
      </mesh>
      <mesh position={[-1.4, 0.7, 0.05]} castShadow>
        <boxGeometry args={[0.28, 0.4, 0.9]} />
        <meshStandardMaterial color="#4f6f56" />
      </mesh>
      <mesh position={[1.4, 0.7, 0.05]} castShadow>
        <boxGeometry args={[0.28, 0.4, 0.9]} />
        <meshStandardMaterial color="#4f6f56" />
      </mesh>
      <mesh position={[-0.7, 0.72, 0.1]}>
        <boxGeometry args={[0.55, 0.18, 0.4]} />
        <meshStandardMaterial color="#e85d2c" />
      </mesh>
    </group>
  )
}

export function AboutInterior({ active }) {
  const L = INTERIOR_LAYOUT.about
  return (
    <group>
      <RoomShell width={L.width} depth={L.depth} height={L.height} floor="#d4c0a0" wall="#ebe4d6" />
      <Rug position={[0, 0, 0.5]} size={[5.5, 4]} color="#a67c52" />
      <Rug position={[-5.5, 0, 3]} size={[3.2, 2.4]} color="#6b8f71" />

      <WindowPane position={[-5.5, 2.8, -L.depth / 2 + 0.2]} size={[3.2, 2.2]} />
      <WindowPane position={[0, 2.9, -L.depth / 2 + 0.2]} size={[4.2, 2.4]} />
      <WindowPane position={[5.5, 2.8, -L.depth / 2 + 0.2]} size={[3.2, 2.2]} />
      <WindowPane position={[-L.width / 2 + 0.2, 2.6, -2]} size={[2.0, 2.0]} rotation={[0, Math.PI / 2, 0]} />
      <WindowPane position={[L.width / 2 - 0.2, 2.6, 1]} size={[2.0, 2.0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Brand wall */}
      <mesh position={[-6.2, 2.6, -L.depth / 2 + 0.22]} castShadow>
        <boxGeometry args={[3.4, 2.2, 0.08]} />
        <meshStandardMaterial color="#f4efe6" />
      </mesh>
      <mesh position={[-6.2, 3.2, -L.depth / 2 + 0.28]}>
        <boxGeometry args={[2.2, 0.28, 0.04]} />
        <meshStandardMaterial color="#1c2420" />
      </mesh>
      <mesh position={[-6.2, 2.7, -L.depth / 2 + 0.28]}>
        <boxGeometry args={[1.8, 0.12, 0.04]} />
        <meshStandardMaterial color="#e85d2c" />
      </mesh>
      <mesh position={[0, 2.7, -L.depth / 2 + 0.22]} castShadow>
        <boxGeometry args={[4.0, 1.5, 0.1]} />
        <meshStandardMaterial color="#4f6f56" />
      </mesh>

      <Pendant position={[-4, L.height - 1.1, -2]} color="#4f6f56" lit={active} />
      <Pendant position={[0, L.height - 1.0, 0]} color="#4f6f56" lit={active} size={1.15} />
      <Pendant position={[4, L.height - 1.1, -2]} color="#e85d2c" lit={active} />
      <Pendant position={[-3, L.height - 1.2, 3.5]} color="#4f6f56" lit={active} />
      <Pendant position={[3.5, L.height - 1.2, 3]} color="#4f6f56" lit={active} />

      <Desk position={[-4.5, 0, -3.5]} />
      <Desk position={[-1.2, 0, -4]} />
      <Desk position={[2.2, 0, -3.2]} />
      <Desk position={[5.2, 0, -4]} yaw={-0.2} />
      <Desk position={[-3.5, 0, 0.8]} yaw={0.4} />

      <Person position={[-4.5, 0, -2.85]} hue="#4d6b58" pose="type" delay={0.2} />
      <Person position={[-1.2, 0, -3.35]} hue="#6b5a45" pose="type" delay={1.1} />
      <Person position={[2.2, 0, -2.55]} hue="#3f5f73" pose="type" delay={0.7} />
      <Person position={[5.5, 0, 1.5]} hue="#c45c3e" pose="stand" delay={0.4} yaw={-0.8} />
      <Person position={[-6, 0, 3.2]} hue="#4f6f56" pose="sit" delay={0.9} />

      <Sofa position={[-5.5, 0, 4.2]} yaw={0.15} />
      <mesh position={[-5.5, 0.38, 2.8]} castShadow>
        <cylinderGeometry args={[0.55, 0.6, 0.16, 20]} />
        <meshStandardMaterial color="#8b6a45" />
      </mesh>

      <Bookshelf position={[8.2, 0, -2]} yaw={-Math.PI / 2} />
      <Bookshelf position={[8.2, 0, 2.2]} yaw={-Math.PI / 2} />

      {/* Team board */}
      <mesh position={[7.5, 2.3, 5]} rotation={[0, -0.5, 0]} castShadow>
        <boxGeometry args={[2.0, 2.4, 0.1]} />
        <meshStandardMaterial color="#f4efe6" />
      </mesh>
      {[-0.45, 0.45].map((x) =>
        [0.55, -0.15, -0.85].map((y) => (
          <mesh key={`${x}${y}`} position={[7.45 + x * 0.2, 2.5 + y, 5.05]} rotation={[0, -0.5, 0]}>
            <boxGeometry args={[0.4, 0.45, 0.04]} />
            <meshStandardMaterial color="#d9ebe2" />
          </mesh>
        )),
      )}

      <Plant position={[-9, 0, -6.5]} scale={1.25} />
      <Plant position={[9, 0, -6]} scale={1.15} />
      <Plant position={[-9, 0, 5]} scale={1} />
      <Plant position={[8.5, 0, 6]} scale={0.95} />
      <Plant position={[0, 0, -7]} scale={0.85} />

      <AboutSignage />

      <pointLight position={[0, 4.2, 0]} intensity={active ? 1.4 : 0} distance={24} color="#fff2df" />
      <pointLight position={[-5, 3.2, -3]} intensity={active ? 0.5 : 0} distance={12} color="#b7e0d2" />
      <pointLight position={[5, 3.2, 2]} intensity={active ? 0.45 : 0} distance={12} color="#9fd0e4" />
    </group>
  )
}
