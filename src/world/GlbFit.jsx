import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Fit a GLB into a target size, sit on y=0, optional yaw.
 */
export function GlbFit({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  fit = [10, 10, 10],
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
    if (size.x < 1e-4 || size.y < 1e-4 || size.z < 1e-4) return clone

    const s = Math.min(fit[0] / size.x, fit[1] / size.y, fit[2] / size.z) * scaleBoost
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
