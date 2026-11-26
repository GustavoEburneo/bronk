import type { World } from '../world';
import { EnemyState } from '../enemyState';
import { applyAbilityHit, beginHitBatch, emitHitBatch } from '../combat';

/**
 * "Baforada de Fumaça" (habilidade do churrasqueiro): pulso instantâneo, sem
 * mira e sem projétil, centrado no player. A cada `cooldown` efetivo, aplica
 * `damage` efetivo a TODOS os inimigos Chasing a até `range` efetivo
 * (distância centro-a-centro, convenção da mordida), sem limite de alvos e
 * sem janela de imunidade entre pulsos (o espaçamento é o próprio cooldown).
 *
 * Sem inimigo no raio, NÃO pulsa e o cooldown não gasta (segura em 0 e tenta
 * no próximo tick) — mesma regra das cartas; o primeiro inimigo que entrar na
 * nuvem leva o pulso imediatamente. A nuvem visual é enfeite de render: a
 * hitbox só existe no tick do pulso.
 */
export function updateSmokeAbility(world: World, dt: number): void {
  const { player, stats } = world;

  player.abilityCooldown -= dt;
  if (player.abilityCooldown > 0) return;

  const hits = pulseSmoke(world);
  // Pulsou: o resto negativo acumulado carrega para o próximo intervalo (como
  // na mordida). Não pulsou: segura em 0 para tentar de novo no próximo tick.
  player.abilityCooldown = hits > 0 ? player.abilityCooldown + stats.abilityCooldown : 0;
}

/**
 * Aplica o dano do pulso a todos os Chasing dentro do raio e retorna quantos
 * foram atingidos (0 = o pulso não disparou e nenhum evento foi emitido).
 * Acertos pelo pipeline comum (crit → dano → knockback → morte), com o lote
 * agregado na ordem do contrato: smokeFired → enemyHit (count = atingidos no
 * pulso) → enemyDieds. A rolagem de crit é por inimigo, na ordem do scan.
 */
function pulseSmoke(world: World): number {
  const { player, enemies, stats } = world;
  const rangeSq = stats.abilityRange * stats.abilityRange;
  let hits = 0;

  beginHitBatch();
  for (let i = 0; i < enemies.count; i++) {
    if (enemies.state[i] !== EnemyState.Chasing) continue;
    const dx = enemies.posX[i]! - player.x;
    const dz = enemies.posZ[i]! - player.z;
    if (dx * dx + dz * dz > rangeSq) continue;

    if (hits === 0) world.events.push({ type: 'smokeFired' });
    hits++;
    applyAbilityHit(world, i);
  }
  emitHitBatch(world);

  return hits;
}
