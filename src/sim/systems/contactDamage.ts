import type { World } from '../world';
import { EnemyState } from '../enemyState';
import { CONTACT_DAMAGE_MIN } from '../../data/upgrades';
import { JUMP_CLEAR_HEIGHT } from './playerMovement';

/**
 * Dano de contato com janela de invulnerabilidade: no máximo um golpe por
 * janela, aplicado após os i-frames. Raio de toque e dano saem do TIPO do
 * inimigo; o Capacete reduz de forma PLANA com piso
 * `CONTACT_DAMAGE_MIN` — armor nunca zera o dano (GDD "dói no mínimo 1").
 * HP zerado encerra a run (status gameOver congela o mundo).
 */
export function updateContactDamage(world: World, dt: number): void {
  const { player, enemies, data, stats } = world;

  if (player.invulnTimer > 0) {
    player.invulnTimer -= dt;
    if (player.invulnTimer > 0) return;
  }

  // No alto do pulo o player passa POR CIMA dos inimigos: contato não acerta
  // (2026-11-24 — a razão de o pulo morar na sim). Subindo/aterrissando
  // (abaixo da altura livre), o contato vale normalmente.
  if (player.jumpOffset > JUMP_CLEAR_HEIGHT) return;

  const types = data.enemyTypes;

  for (let i = 0; i < enemies.count; i++) {
    if (enemies.state[i] !== EnemyState.Chasing) continue;
    const type = types[enemies.typeIndex[i]!]!;
    const touchRadius = stats.playerRadius + type.radius;
    const dx = enemies.posX[i]! - player.x;
    const dz = enemies.posZ[i]! - player.z;
    if (dx * dx + dz * dz > touchRadius * touchRadius) continue;

    const damage = Math.max(CONTACT_DAMAGE_MIN, type.contactDamage - stats.contactArmor);
    player.hp -= damage;
    player.invulnTimer = stats.contactIFrames;
    // Registro para a apresentação (vinheta + número de dano); a sim não lê.
    player.lastHitTick = world.tickCount;
    player.lastHitDamage = damage;

    if (player.hp <= 0) {
      player.hp = 0;
      player.state = 'dead';
      // Morreu aterrissando: o corpo cai no chão (sem tombo flutuante).
      player.jumpOffset = 0;
      player.jumpVelocity = 0;
      world.status = 'gameOver';
      world.events.push({ type: 'playerDied' });
    }
    return;
  }
}
