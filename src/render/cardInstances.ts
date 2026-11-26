import * as THREE from 'three';
import type { World } from '../sim/world';
import { CARD_POOL_CAPACITY } from '../data/characters';
import { createEnvelopeTexture } from './jankTextures';
import type { GroundHeightFn } from './terrain';

export interface CardInstances {
  readonly mesh: THREE.InstancedMesh;
  update(world: World, alpha: number, frameDt: number): void;
}

/** Altura de voo da carta (enfeite do render; a sim é 2D no plano do chão). */
const FLY_HEIGHT = 0.9;
/** Velocidade do giro (rad/s). O giro é decoração do render, não estado da sim. */
const SPIN_SPEED = 14;
/** Defasagem de giro por slot: cartas vizinhas não giram em uníssono. */
const SPIN_PHASE_PER_SLOT = 0.9;

/**
 * Cartas do carteiro em lote: um único InstancedMesh (plano pequeno com textura
 * de envelope mal desenhado) com as matrizes escritas direto no buffer — mesmo
 * padrão de enemyInstances/orbInstances, zero alocação por frame. A instância i
 * corresponde ao slot i do CardPool da sim; posição interpola prev→pos com
 * alpha e a orientação parte de dirX/dirZ, com o giro somado como enfeite
 * (função do tempo de frame — congela posição junto com a sim, mas segue
 * girando no lugar, como os overlays seguem vivos).
 *
 * `ground` assenta o voo no relevo do mapa: a carta voa a FLY_HEIGHT sobre o
 * chão LOCAL (sobe o morro junto com ele — ver render/terrain.ts).
 */
export function createCardInstances(ground: GroundHeightFn): CardInstances {
  // Proporção de envelope deitado no plano do chão, girando como bumerangue.
  const geometry = new THREE.PlaneGeometry(0.7, 0.5);
  geometry.rotateX(-Math.PI / 2);
  // MeshBasic (sem luz) e DoubleSide: a carta é pequena, rápida e precisa ser
  // legível por cima e por baixo do giro.
  const material = new THREE.MeshBasicMaterial({
    map: createEnvelopeTexture(),
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.InstancedMesh(geometry, material, CARD_POOL_CAPACITY);
  mesh.frustumCulled = false;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  // Buffer nasce zerado: inicializa identidade uma vez.
  const matrices = mesh.instanceMatrix.array as Float32Array;
  for (let i = 0; i < CARD_POOL_CAPACITY; i++) {
    const offset = i * 16;
    matrices[offset] = 1;
    matrices[offset + 5] = 1;
    matrices[offset + 10] = 1;
    matrices[offset + 15] = 1;
  }

  // Relógio próprio do giro, acumulado do tempo de frame (nada de taxa fixa).
  let spinTime = 0;

  return {
    mesh,
    update(world: World, alpha: number, frameDt: number): void {
      spinTime += frameDt;
      const cards = world.cards;
      for (let i = 0; i < cards.count; i++) {
        const offset = i * 16;
        const yaw = Math.atan2(cards.dirX[i]!, cards.dirZ[i]!);
        const angle = yaw + spinTime * SPIN_SPEED + i * SPIN_PHASE_PER_SLOT;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        // Rotação em Y escrita direto nos elementos (column-major).
        matrices[offset] = c;
        matrices[offset + 2] = -s;
        matrices[offset + 8] = s;
        matrices[offset + 10] = c;
        const x = cards.prevX[i]! + (cards.posX[i]! - cards.prevX[i]!) * alpha;
        const z = cards.prevZ[i]! + (cards.posZ[i]! - cards.prevZ[i]!) * alpha;
        matrices[offset + 12] = x;
        matrices[offset + 13] = ground(x, z) + FLY_HEIGHT;
        matrices[offset + 14] = z;
      }
      mesh.count = cards.count;
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}
