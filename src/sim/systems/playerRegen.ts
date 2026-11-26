import type { World } from '../world';

/**
 * Regeneração contínua (Soro Caseiro): item 2 da ordem fixa do tick, logo
 * após o movimento. `hp = min(maxHp, hp + regen × dt)`, só com o player vivo.
 * Rodar ANTES do dano de contato é decisão: regen não ressuscita nem salva no
 * tick do golpe letal — a morte do tick vence. Regen é contínuo: não emite
 * evento; congela com a sim (pausa do Panfleto/morte: o tick não roda).
 *
 * Com regen 0 é no-op byte a byte (early return antes de tocar em `hp`):
 * inserir o sistema não muda nenhum resultado existente (determinismo).
 */
export function updatePlayerRegen(world: World, dt: number): void {
  const { player, stats } = world;
  if (player.state !== 'alive') return;
  const regen = stats.hpRegenPerSec;
  if (regen === 0) return;
  player.hp = Math.min(stats.maxHp, player.hp + regen * dt);
}
