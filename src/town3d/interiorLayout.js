import * as THREE from 'three'

/** Lift interiors far above the town so enter cams never clip through streets/hills. */
export const INTERIOR_Y = 80

/**
 * Spacious room layouts (local space inside the INTERIOR_Y group).
 * spawnYaw: Math.PI faces toward -Z (into the room from the entrance).
 */
export const INTERIOR_LAYOUT = {
  about: {
    width: 20,
    depth: 16,
    height: 5.6,
    center: [0, 0, 0],
    // Spawn already inside the room looking toward the back wall (-Z)
    spawn: [0, 0, 3.2],
    spawnYaw: Math.PI,
    exit: [0, 0, 7.2],
  },
  services: {
    width: 22,
    depth: 17,
    height: 5.8,
    center: [0, 0, 0],
    spawn: [0, 0, 3.5],
    spawnYaw: Math.PI,
    exit: [0, 0, 7.6],
  },
  cafe: {
    width: 18,
    depth: 15,
    height: 5.2,
    center: [0, 0, 0],
    spawn: [0, 0, 3.0],
    spawnYaw: Math.PI,
    exit: [0, 0, 6.6],
  },
  contact: {
    width: 18,
    depth: 15,
    height: 5.4,
    center: [0, 0, 0],
    spawn: [0, 0, 3.0],
    spawnYaw: Math.PI,
    exit: [0, 0, 6.6],
  },
}

function roomCam(spawnZ) {
  // Over-the-shoulder, facing into the room
  return {
    position: new THREE.Vector3(0, INTERIOR_Y + 2.25, spawnZ + 3.4),
    target: new THREE.Vector3(0, INTERIOR_Y + 1.4, spawnZ - 3.5),
  }
}

export const CAM = {
  town: { position: new THREE.Vector3(0, 6.5, 14), target: new THREE.Vector3(0, 1.2, 0) },
  about: roomCam(3.2),
  services: roomCam(3.5),
  cafe: roomCam(3.0),
  contact: roomCam(3.0),
}
