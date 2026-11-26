import type { World } from '../world';
import type { InputFrame } from '../tick';

/** Velocidade inicial do pulo (u/s). Ápice = SPEED²/(2·GRAVITY) ≈ 2,1 u. */
const JUMP_SPEED = 9;
/** Gravidade do pulo (u/s²). */
const JUMP_GRAVITY = 19;
/**
 * Altura (u) acima da qual o player passou "por cima" dos inimigos: o dano de
 * contato não acerta (contactDamage). Abaixo disso — subindo ou aterrissando —
 * o contato vale: pular não é invulnerabilidade, é janela de voo.
 */
export const JUMP_CLEAR_HEIGHT = 0.8;

export function updatePlayerMovement(world: World, input: InputFrame, dt: number): void {
  const { player } = world;

  let moveX = input.moveX;
  let moveZ = input.moveZ;
  const length = Math.hypot(moveX, moveZ);
  // Entrada é apresentação: pode chegar fora do círculo unitário. Diagonal não acelera.
  if (length > 1) {
    moveX /= length;
    moveZ /= length;
  }

  if (length > 0) {
    player.x += moveX * world.stats.moveSpeed * dt;
    player.z += moveZ * world.stats.moveSpeed * dt;
    const facingLength = Math.hypot(moveX, moveZ);
    player.facingX = moveX / facingLength;
    player.facingZ = moveZ / facingLength;
  }

  const limit = world.arenaHalfSize - world.stats.playerRadius;
  if (player.x > limit) player.x = limit;
  if (player.x < -limit) player.x = -limit;
  if (player.z > limit) player.z = limit;
  if (player.z < -limit) player.z = -limit;

  // Pulo (2026-11-24, da sim — esquiva o contato lá no alto): segurar a tecla
  // dá pulinhos contínuos (novo impulso só APOIADO); a queda integra sempre.
  if (input.jump === true && player.jumpOffset === 0 && player.jumpVelocity <= 0) {
    player.jumpVelocity = JUMP_SPEED;
  }
  if (player.jumpOffset > 0 || player.jumpVelocity > 0) {
    player.jumpVelocity -= JUMP_GRAVITY * dt;
    player.jumpOffset += player.jumpVelocity * dt;
    if (player.jumpOffset <= 0) {
      player.jumpOffset = 0;
      player.jumpVelocity = 0;
    }
  }
}
