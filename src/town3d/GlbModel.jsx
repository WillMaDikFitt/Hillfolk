import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Drop-in GLB with auto ground-pivot + fit-to-footprint scaling.
 * Models are Grab3D CC0 cozy buildings (metres in file).
 */
export function GlbModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  /** Desired footprint [width, height, depth] in world units */
  fit = [2.8, 3.2, 2.6],
  /** Extra uniform scale after fit (tweak per building) */
  scaleBoost = 1,
  castShadow = true,
}) {
  const { scene } = useGLTF(url)

  const model = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = castShadow
        obj.receiveShadow = true
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => {
            m.side = THREE.FrontSide
            m.needsUpdate = true
          })
        }
      }
    })

    const box = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    box.getSize(size)
    if (size.x < 0.001 || size.y < 0.001 || size.z < 0.001) return clone

    const sx = fit[0] / size.x
    const sy = fit[1] / size.y
    const sz = fit[2] / size.z
    const s = Math.min(sx, sy, sz) * scaleBoost
    clone.scale.setScalar(s)

    const fitted = new THREE.Box3().setFromObject(clone)
    const center = new THREE.Vector3()
    fitted.getCenter(center)
    clone.position.set(-center.x, -fitted.min.y, -center.z)
    return clone
  }, [scene, fit[0], fit[1], fit[2], scaleBoost, castShadow])

  return (
    <group position={position} rotation={rotation}>
      <primitive object={model} />
    </group>
  )
}

export const TOWN_MODELS = {
  about: {
    url: '/models/cottage-house.glb',
    fit: [3.4, 3.6, 3.2],
    scaleBoost: 1.05,
    yaw: 0,
  },
  services: {
    url: '/models/office-building.glb',
    fit: [4.2, 4.0, 3.6],
    scaleBoost: 1.0,
    yaw: Math.PI,
  },
  cafe: {
    url: '/models/cafe.glb',
    fit: [3.6, 3.0, 3.2],
    scaleBoost: 1.08,
    yaw: 0,
  },
  contact: {
    url: '/models/train-station.glb',
    fit: [3.8, 3.4, 3.4],
    scaleBoost: 0.95,
    yaw: Math.PI,
  },
  church: {
    url: '/models/church.glb',
    fit: [3.2, 5.5, 3.2],
    scaleBoost: 1.15,
    yaw: 0,
  },
}

// Warm the cache as soon as the module loads
Object.values(TOWN_MODELS).forEach((m) => useGLTF.preload(m.url))
useGLTF.preload('/models/library.glb')
