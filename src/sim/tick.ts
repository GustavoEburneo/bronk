import type { World } from './world';
import { updatePlayerMovement } from './systems/playerMovement';
import { updatePlayerRegen } from './systems/playerRegen';
import { updateEnemySpawn } from './systems/enemySpawn';
import { updateEnemyAI } from './systems/enemyAI';
import { updateAbility } from './systems/ability';
import { updateXpOrbs } from './systems/xpOrbs';
import { updateContactDamage } from './systems/contactDamage';
import { updateOrelhoes } from './systems/orelhoes';
import { openPendingUpgradeChoice } from './upgrades';

/**
 * Timestep fixo da simulação. O render interpola entre ticks. O valor mora em
 * `data/tables.ts` (a validação anti-tunneling precisa dele); re-export aqui
 * mantém o ponto de import de sempre para app e testes.
 */
export { SIM_DT } from '../data/tables';

/** Entrada abstrata produzida pela camada de apresentação. A sim nunca vê eventos de teclado. */
export interface InputFrame {
  /** Eixo X em [-1, 1]. */
  moveX: number;
  /** Eixo Z em [-1, 1]. */
  moveZ: number;
  /**
   * Pulo segurado (Espaço). Opcional: ausente = sem pulo (bots e testes
   * antigos seguem válidos). Desde 2026-11-24 o pulo é DA SIM — pular por
   * cima de inimigo esquiva o dano de contato (ver playerMovement e
   * contactDamage), então ele precisa ser determinístico como o movimento.
   */
  jump?: boolean;
}

/**
 * Avança a simulação em `dt` segundos. Ordem dos sistemas é fixa — mudanças de
 * ordem mudam o resultado e quebram o teste de determinismo.
 */
export function tick(world: World, input: InputFrame, dt: number): void {
  if (world.status !== 'running') return;

  world.events.length = 0;
  savePreviousPositions(world);

  updatePlayerMovement(world, input, dt);
  updatePlayerRegen(world, dt);
  updateEnemySpawn(world, dt);
  updateEnemyAI(world, dt);
  updateAbility(world, dt);
  updateXpOrbs(world, dt);
  updateContactDamage(world, dt);
  // Depois do dano: os abates do tick já contaram, e morrer encostado num
  // orelhão pronto ainda atende (a morte congela o mundo só no fim do tick).
  updateOrelhoes(world);
  // Depois do dano de contato: morte e level-up no mesmo tick, a morte vence.
  openPendingUpgradeChoice(world);

  world.tickCount++;
  world.time += dt;
}

function savePreviousPositions(world: World): void {
  const { player, enemies, orbs, cards } = world;
  player.prevX = player.x;
  player.prevZ = player.z;
  player.prevJumpOffset = player.jumpOffset;
  for (let i = 0; i < enemies.count; i++) {
    enemies.prevX[i] = enemies.posX[i]!;
    enemies.prevZ[i] = enemies.posZ[i]!;
  }
  for (let i = 0; i < orbs.count; i++) {
    orbs.prevX[i] = orbs.posX[i]!;
    orbs.prevZ[i] = orbs.posZ[i]!;
  }
  for (let i = 0; i < cards.count; i++) {
    cards.prevX[i] = cards.posX[i]!;
    cards.prevZ[i] = cards.posZ[i]!;
  }
}
