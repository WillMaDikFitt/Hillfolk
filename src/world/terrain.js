import * as THREE from 'three'

const _raycaster = new THREE.Raycaster()
const _origin = new THREE.Vector3()
const _down = new THREE.Vector3(0, -1, 0)
const _hits = []

/**
 * Collect mesh objects under a root for terrain raycasts.
 */
export function collectMeshes(root, out = []) {
  if (!root) return out
  root.traverse((obj) => {
    if (obj.isMesh && obj.geometry) {
      // Ensure world matrices are current before casting
      obj.updateWorldMatrix?.(true, false)
      out.push(obj)
    }
  })
  return out
}

/**
 * Sample ground height at (x, z). Returns hit y or null.
 * Casts from high above so we hit the top of hills, not the underside.
 */
export function sampleHeight(meshes, x, z, fromY = 200, maxDist = 400) {
  if (!meshes?.length) return null
  _origin.set(x, fromY, z)
  _raycaster.set(_origin, _down)
  _raycaster.far = maxDist
  _hits.length = 0
  _raycaster.intersectObjects(meshes, false, _hits)
  if (!_hits.length) return null
  // Prefer the highest hit (top surface) in case of nested shells
  let best = _hits[0]
  for (let i = 1; i < _hits.length; i++) {
    if (_hits[i].point.y > best.point.y) best = _hits[i]
  }
  return best
}
