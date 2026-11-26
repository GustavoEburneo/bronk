import type { World } from '../world';
import { EnemyState } from '../enemyState';
import { allocOrb, freeEnemy } from '../pool';

/**
 * Avança a FSM de cada inimigo e move os que estão em Chasing. A FSM
 * Spawning → Chasing → Dying é a MESMA para todos os comportamentos; o
 * `behavior.kind` do tipo só muda o movimento e a regra de despawn (switch
 * exaustivo com `never`: comportamento novo sem caso não compila). Durações e
 * stats saem de `data.enemyTypes[typeIndex]`. Remoções usam swap-remove, por
 * isso a iteração é reversa: o slot que entra no lugar do removido já foi
 * processado neste tick.
 */
/** Clamp simétrico em ±limit (borda da arena menos o raio do tipo). */
function clampTo(value: number, limit: number): number {
  return value < -limit ? -limit : value > limit ? limit : value;
}

export function updateEnemyAI(world: World, dt: number): void {
  const { enemies, orbs, player, data } = world;
  const types = data.enemyTypes;

  for (let i = enemies.count - 1; i >= 0; i--) {
    enemies.stateTime[i] = enemies.stateTime[i]! + dt;
    const state = enemies.state[i]!;
    const type = types[enemies.typeIndex[i]!]!;

    if (state === EnemyState.Spawning) {
      if (enemies.stateTime[i]! >= type.spawnStateDuration) {
        enemies.state[i] = EnemyState.Chasing;
        enemies.stateTime[i] = 0;
      }
    } else if (state === EnemyState.Chasing) {
      const behavior = type.behavior;
      switch (behavior.kind) {
        case 'chase': {
          const dx = player.x - enemies.posX[i]!;
          const dz = player.z - enemies.posZ[i]!;
          const dist = Math.hypot(dx, dz);
          if (dist > 1e-4) {
            const step = type.moveSpeed * dt;
            enemies.posX[i] = enemies.posX[i]! + (dx / dist) * step;
            enemies.posZ[i] = enemies.posZ[i]! + (dz / dist) * step;
          }
          break;
        }
        case 'investida': {
          // Ciclo mira→arrancada derivado de stateTime (zero estado novo no
          // pool): durante o windup fica PARADO re-mirando o player (dir é o
          // telegraph — o render encara a direção); depois arranca reto em
          // moveSpeed na direção congelada. Knockback desloca a posição mas
          // não toca em dir (mesma regra do flyby).
          const cycle = behavior.windup + behavior.chargeTime;
          const phase = enemies.stateTime[i]! % cycle;
          if (phase < behavior.windup) {
            const dx = player.x - enemies.posX[i]!;
            const dz = player.z - enemies.posZ[i]!;
            const dist = Math.hypot(dx, dz);
            if (dist > 1e-4) {
              enemies.dirX[i] = dx / dist;
              enemies.dirZ[i] = dz / dist;
            }
          } else {
            // Clamp na arena (como spawn/knockback): a arrancada é reta e
            // passaria da borda; parar nela é o comportamento desejado.
            const step = type.moveSpeed * dt;
            const limit = world.arenaHalfSize - type.radius;
            enemies.posX[i] = clampTo(enemies.posX[i]! + enemies.dirX[i]! * step, limit);
            enemies.posZ[i] = clampTo(enemies.posZ[i]! + enemies.dirZ[i]! * step, limit);
          }
          break;
        }
        case 'flyby': {
          // Voa reto na direção gravada no spawn; nunca vira.
          const step = type.moveSpeed * dt;
          const x = enemies.posX[i]! + enemies.dirX[i]! * step;
          const z = enemies.posZ[i]! + enemies.dirZ[i]! * step;
          enemies.posX[i] = x;
          enemies.posZ[i] = z;

          // Despawn SILENCIOSO (sem Dying, sem evento, sem orbe): além de
          // despawnRadius do CENTRO da arena E se afastando dele (dir·pos > 0
          // — perto da borda o pombo pode nascer já além do raio voando para
          // dentro), ou após despawnAfter de voo (stateTime em Chasing).
          const movingOutward = enemies.dirX[i]! * x + enemies.dirZ[i]! * z > 0;
          const beyondRadius =
            x * x + z * z > behavior.despawnRadius * behavior.despawnRadius;
          if ((beyondRadius && movingOutward) || enemies.stateTime[i]! > behavior.despawnAfter) {
            freeEnemy(enemies, i);
          }
          break;
        }
        default: {
          // Exaustividade em tempo de compilação: kind novo sem caso não compila.
          const unhandled: never = behavior;
          throw new Error(`comportamento sem caso: ${JSON.stringify(unhandled)}`);
        }
      }
    } else {
      // Dying: inerte; ao expirar dropa orbe (XP do tipo) e sai do pool.
      if (enemies.stateTime[i]! >= type.dyingStateDuration) {
        const orbIndex = allocOrb(orbs);
        if (orbIndex >= 0) {
          orbs.posX[orbIndex] = enemies.posX[i]!;
          orbs.posZ[orbIndex] = enemies.posZ[i]!;
          orbs.prevX[orbIndex] = enemies.posX[i]!;
          orbs.prevZ[orbIndex] = enemies.posZ[i]!;
          orbs.xpValue[orbIndex] = type.xpValue;
        }
        freeEnemy(enemies, i);
      }
    }
  }
}
