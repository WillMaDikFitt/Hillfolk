/** Lift interiors far above the town so enter cams never clip through streets/hills. */
export const INTERIOR_Y = 80

/** Shared room sizes, spawn points, and walk bounds (local to interior group). */
export const ROOM_LAYOUTS = {
  about: {
    width: 20,
    depth: 16,
    height: 5.4,
    spawn: [0, 0, 5.2],
    spawnYaw: Math.PI,
    bounds: { minX: -9.5, maxX: 9.5, minZ: -7.2, maxZ: 7.2 },
  },
  services: {
    width: 22,
    depth: 17,
    height: 5.6,
    spawn: [0, 0, 5.5],
    spawnYaw: Math.PI,
    bounds: { minX: -10.2, maxX: 10.2, minZ: -7.6, maxZ: 7.6 },
  },
  cafe: {
    width: 19,
    depth: 15,
    height: 5.2,
    spawn: [0, 0, 4.8],
    spawnYaw: Math.PI,
    bounds: { minX: -8.8, maxX: 8.8, minZ: -6.6, maxZ: 6.6 },
  },
  contact: {
    width: 19,
    depth: 15.5,
    height: 5.3,
    spawn: [0, 0, 5],
    spawnYaw: Math.PI,
    bounds: { minX: -8.8, maxX: 8.8, minZ: -6.8, maxZ: 6.8 },
  },
}
