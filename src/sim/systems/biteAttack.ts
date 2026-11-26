import type { World } from '../world';
import { EnemyState } from '../enemyState';
import { applyAbilityHit, beginHitBatch, emitHitBatch } from '../combat';

/**
 * Mordida automática (habilidade da capivara), ALVO ÚNICO (GDD 2026-11-18):
 * quando o cooldown vence, morde APENAS o inimigo Chasing mais próximo com
 * distância centro-a-centro <= alcance — exatamente 1 por disparo, dano cheio.
 * Empate exato de distância → o primeiro na ordem do pool (determinístico).
 * Spawning/Dying nunca são alvo.
 *
 * Sem alvo no alcance, NÃO morde, não emite biteFired e o cooldown não gasta
 * (segura em 0 e tenta no próximo tick) — mesma regra das cartas e da fumaça;
 * as três habilidades seguem uma única convenção. Dano, alcance e cooldown vêm
 * dos stats efetivos da habilidade equipada (base + melhorias).
 */
export function updateBiteAttack(world: World, dt: number): void {
  const { player, stats } = world;

  player.abilityCooldown -= dt;
  if (player.abilityCooldown > 0) return;

  const target = findNearestChasingInRange(world);
  if (target < 0) {
    player.abilityCooldown = 0; // segura e tenta no próximo tick
    return;
  }

  // Mordeu: o resto negativo acumulado carrega para o próximo intervalo.
  player.abilityCooldown += stats.abilityCooldown;
  world.events.push({ type: 'biteFired' });

  // Acerto pelo pipeline comum (crit → dano → knockback → morte) com o lote
  // de eventos na ordem do contrato: biteFired → enemyHit → enemyDied.
  beginHitBatch();
  applyAbilityHit(world, target);
  emitHitBatch(world);
}

/**
 * Índice do inimigo Chasing mais próximo com distância <= alcance efetivo, ou
 * -1 sem alvo. A comparação estrita (<) resolve empate exato de distância a
 * favor do primeiro na ordem do pool.
 */
function findNearestChasingInRange(world: World): number {
  const { player, enemies, stats } = world;
  const rangeSq = stats.abilityRange * stats.abilityRange;
  let target = -1;
  let bestSq = Infinity;

  for (let i = 0; i < enemies.count; i++) {
    if (enemies.state[i] !== EnemyState.Chasing) continue;
    const dx = enemies.posX[i]! - player.x;
    const dz = enemies.posZ[i]! - player.z;
    const distSq = dx * dx + dz * dz;
    if (distSq > rangeSq || distSq >= bestSq) continue;
    bestSq = distSq;
    target = i;
  }

  return target;
}
