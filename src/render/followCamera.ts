import type * as THREE from 'three';
import type { GroundHeightFn } from './terrain';

export interface FollowCamera {
  /** `targetY` é a altura do CHÃO sob o player (relevo — 0 em mapa plano). */
  update(
    targetX: number,
    targetY: number,
    targetZ: number,
    yaw: number,
    pitch: number,
    frameDt: number,
  ): void;
}

/** Distância da câmera ao player. */
const DISTANCE = 6;
/** Altura do ponto que a câmera olha (aprox. a cabeça da capivara). */
const LOOK_Y = 0.8;
/** Rigidez do amortecimento da posição (independente da taxa de quadros). */
const POSITION_STIFFNESS = 6;

/** Margem mínima da câmera acima do relevo (colisão câmera×morro). */
const GROUND_CLEARANCE = 0.5;

/**
 * Câmera em terceira pessoa que orbita o player. A orientação (yaw/pitch) vem
 * do mouse e é aplicada sem amortecimento — suavizar input de mouse dá a
 * sensação de câmera "boiando"; só a posição segue o player com amortecimento.
 * `ground` (relevo do mapa — terrain.ts) dá a COLISÃO da câmera com os morros:
 * a posição final nunca fica abaixo do chão no ponto da câmera, senão um morro
 * entre a câmera e o player enfiaria a vista por dentro do terreno.
 */
export function createFollowCamera(
  camera: THREE.PerspectiveCamera,
  ground: GroundHeightFn,
): FollowCamera {
  let x = 0;
  let y = 0;
  let z = 0;
  let initialized = false;

  return {
    update(
      targetX: number,
      targetY: number,
      targetZ: number,
      yaw: number,
      pitch: number,
      frameDt: number,
    ): void {
      if (!initialized) {
        x = targetX;
        y = targetY;
        z = targetZ;
        initialized = true;
      }

      const blend = 1 - Math.exp(-POSITION_STIFFNESS * frameDt);
      x += (targetX - x) * blend;
      // A altura segue o relevo com o MESMO amortecimento: subir o morro
      // levanta a câmera junto, sem solavanco a cada ondulação do chão.
      y += (targetY - y) * blend;
      z += (targetZ - z) * blend;

      const horizontal = Math.cos(pitch) * DISTANCE;
      const cameraX = x - Math.sin(yaw) * horizontal;
      const cameraZ = z - Math.cos(yaw) * horizontal;
      let cameraY = y + LOOK_Y + Math.sin(pitch) * DISTANCE;
      // Colisão com o relevo: morro entre a câmera e o player empurra a
      // câmera para cima do chão em vez de atravessá-lo.
      const minY = ground(cameraX, cameraZ) + GROUND_CLEARANCE;
      if (cameraY < minY) cameraY = minY;
      camera.position.set(cameraX, cameraY, cameraZ);
      camera.lookAt(x, y + LOOK_Y, z);
    },
  };
}
