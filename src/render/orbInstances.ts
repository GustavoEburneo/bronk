import * as THREE from 'three';
import type { GameData } from '../data/tables';
import type { World } from '../sim/world';
import type { GroundHeightFn } from './terrain';

export interface OrbInstances {
  readonly mesh: THREE.InstancedMesh;
  update(world: World, alpha: number): void;
}

/**
 * Orbes de XP em lote. MeshBasic (sem luz): mais barato e "brilha".
 * `ground` assenta cada orbe no relevo do mapa (ver render/terrain.ts).
 */
export function createOrbInstances(data: GameData, ground: GroundHeightFn): OrbInstances {
  const geometry = new THREE.SphereGeometry(0.18, 8, 6);
  geometry.translate(0, 0.25, 0);
  const material = new THREE.MeshBasicMaterial({ color: 0x4ade80 });

  const mesh = new THREE.InstancedMesh(geometry, material, data.xp.maxOrbs);
  mesh.frustumCulled = false;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  const matrices = mesh.instanceMatrix.array as Float32Array;
  for (let i = 0; i < data.xp.maxOrbs; i++) {
    const offset = i * 16;
    matrices[offset] = 1;
    matrices[offset + 5] = 1;
    matrices[offset + 10] = 1;
    matrices[offset + 15] = 1;
  }

  return {
    mesh,
    update(world: World, alpha: number): void {
      const orbs = world.orbs;
      for (let i = 0; i < orbs.count; i++) {
        const offset = i * 16;
        const x = orbs.prevX[i]! + (orbs.posX[i]! - orbs.prevX[i]!) * alpha;
        const z = orbs.prevZ[i]! + (orbs.posZ[i]! - orbs.prevZ[i]!) * alpha;
        matrices[offset + 12] = x;
        matrices[offset + 13] = ground(x, z);
        matrices[offset + 14] = z;
      }
      mesh.count = orbs.count;
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}
