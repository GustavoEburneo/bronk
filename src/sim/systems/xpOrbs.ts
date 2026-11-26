import type { World } from '../world';
import { xpRequiredForLevel } from '../world';
import { freeOrb } from '../pool';

/**
 * Orbes de XP: dentro do raio do ímã (stat efetivo) voam até o player; dentro
 * do raio de coleta somem e viram XP — o valor é o `xpValue` capturado do
 * TIPO do inimigo na hora do drop (vive no orbe), multiplicado pelo ganho
 * efetivo. Level-up carrega o excedente, recalcula a curva e enfileira uma
 * escolha de melhoria (aberta no fim do tick por `openPendingUpgradeChoice`).
 */
export function updateXpOrbs(world: World, dt: number): void {
  const { orbs, player, data } = world;
  const collectSq = data.xp.collectRadius * data.xp.collectRadius;
  const magnetSq = world.stats.magnetRadius * world.stats.magnetRadius;

  for (let i = orbs.count - 1; i >= 0; i--) {
    const dx = player.x - orbs.posX[i]!;
    const dz = player.z - orbs.posZ[i]!;
    const distSq = dx * dx + dz * dz;

    if (distSq <= collectSq) {
      const xpValue = orbs.xpValue[i]!;
      freeOrb(orbs, i);
      collectXp(world, xpValue * world.stats.xpGainMultiplier);
    } else if (distSq <= magnetSq) {
      const dist = Math.sqrt(distSq);
      const step = Math.min(data.xp.magnetSpeed * dt, dist);
      orbs.posX[i] = orbs.posX[i]! + (dx / dist) * step;
      orbs.posZ[i] = orbs.posZ[i]! + (dz / dist) * step;
    }
  }
}

function collectXp(world: World, amount: number): void {
  const { player } = world;
  player.xp += amount;
  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level++;
    player.xpToNext = xpRequiredForLevel(world.data, player.level);
    world.pendingLevelUps++;
    world.events.push({ type: 'levelUp', level: player.level });
  }
}
