/**
 * Escolha de melhorias "Panfleto na Esquina" (decisão de 2026-11-16).
 *
 * Contrato com os consumidores (gameLoop e UI):
 * - `world.upgradeChoice !== null` sinaliza escolha aberta; o gameLoop para de
 *   chamar `tick` enquanto durar (a sim NÃO se pausa sozinha).
 * - A UI resolve com `chooseUpgrade(world, optionIndex)` e, no máximo uma vez
 *   por level-up, `rerollChoice(world)` — cheque `rerollAvailable` antes.
 * - Chamada inválida (sem escolha aberta, índice fora das opções, reroll já
 *   usado) lança `Error`: é bug do chamador, nunca estado alcançável pelo jogo.
 */
import type { GameData } from '../data/tables';
import { UPGRADE_CHOICE_COUNT } from '../data/upgrades';
import type { World } from './world';
import { recomputeEffectiveStats } from './stats';

/** Índice da melhoria `id` em `data.upgrades`. Lança se não existir. */
export function findUpgradeIndex(data: GameData, id: string): number {
  for (let i = 0; i < data.upgrades.length; i++) {
    if (data.upgrades[i]!.id === id) return i;
  }
  throw new Error(`melhoria desconhecida: ${id}`);
}

/**
 * Aplica uma melhoria: incrementa o stack, recalcula os stats efetivos e
 * aplica a cura instantânea (clampada no maxHp JÁ melhorado — a marmita cura
 * contra o novo máximo). Lança se a melhoria já estiver no teto ou se for
 * filtrada (`characterId`) para outro personagem — build inválida é bug do
 * chamador, nunca estado alcançável pelo jogo.
 */
export function applyUpgrade(world: World, upgradeIndex: number): void {
  const def = world.data.upgrades[upgradeIndex];
  if (def === undefined) {
    throw new Error(`índice de melhoria fora da tabela: ${upgradeIndex}`);
  }
  const equippedId = world.data.characters[world.characterIndex]!.id;
  if (def.characterId !== undefined && def.characterId !== equippedId) {
    throw new Error(
      `melhoria ${def.id} é exclusiva do personagem ${def.characterId} (equipado: ${equippedId})`,
    );
  }
  if (world.upgradeStacks[upgradeIndex]! >= def.maxStacks) {
    throw new Error(`melhoria ${def.id} já está no teto de ${def.maxStacks} stacks`);
  }

  world.upgradeStacks[upgradeIndex]!++;
  recomputeEffectiveStats(world);

  if (def.healOnPick !== undefined) {
    world.player.hp = Math.min(world.player.hp + def.healOnPick, world.stats.maxHp);
  }
}

/**
 * Aplica uma sequência de melhorias por id, em ordem (montagem de build para
 * verificação, ex. `?melhorias=cafe,cafe,bocao`). Id desconhecido ou teto de
 * stacks estourado lançam: build de teste inválida é bug do chamador.
 */
export function applyUpgradesById(world: World, ids: readonly string[]): void {
  for (const id of ids) {
    applyUpgrade(world, findUpgradeIndex(world.data, id));
  }
}

/**
 * Resolve a escolha aberta aplicando a opção `optionIndex` (0..options-1) e,
 * se a fila de level-ups não esvaziou, abre a próxima escolha imediatamente
 * (com o reroll renovado: ele é 1 por level-up).
 */
export function chooseUpgrade(world: World, optionIndex: number): void {
  const choice = world.upgradeChoice;
  if (choice === null) {
    throw new Error('chooseUpgrade sem escolha aberta');
  }
  if (!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= choice.options.length) {
    throw new Error(`opção inválida: ${optionIndex} (há ${choice.options.length} opções)`);
  }

  applyUpgrade(world, choice.options[optionIndex]!);
  world.pendingLevelUps--;
  world.upgradeChoice = null;
  openPendingUpgradeChoice(world);
}

/** Redescarta as opções e sorteia novas. Só uma vez por level-up. */
export function rerollChoice(world: World): void {
  const choice = world.upgradeChoice;
  if (choice === null) {
    throw new Error('rerollChoice sem escolha aberta');
  }
  if (!choice.rerollAvailable) {
    throw new Error('reroll já usado nesta escolha');
  }
  choice.options = rollOptions(world);
  choice.rerollAvailable = false;
}

/**
 * Abre a escolha do próximo level-up da fila, se houver. Chamada no FIM do
 * tick, depois do dano de contato: morte e level-up no mesmo tick — a morte
 * vence e nenhuma escolha abre (status já saiu de 'running').
 */
export function openPendingUpgradeChoice(world: World): void {
  if (world.status !== 'running') return;
  if (world.upgradeChoice !== null) return;
  if (world.pendingLevelUps === 0) return;
  world.upgradeChoice = { options: rollOptions(world), rerollAvailable: true };
}

/**
 * Sorteia (via o RNG determinístico da sim) até UPGRADE_CHOICE_COUNT melhorias
 * distintas entre as elegíveis: não-fallback, abaixo do teto de stacks e sem
 * filtro `characterId` para outro personagem. Restando menos que isso, oferece
 * as que restam; pool esgotado, a opção única é o fallback. Fisher–Yates
 * parcial sobre a lista de elegíveis.
 */
function rollOptions(world: World): number[] {
  const { data, rng, upgradeStacks } = world;
  const equippedId = data.characters[world.characterIndex]!.id;

  const eligible: number[] = [];
  let fallbackIndex = -1;
  for (let i = 0; i < data.upgrades.length; i++) {
    const def = data.upgrades[i]!;
    if (def.isFallback === true) {
      fallbackIndex = i;
    } else if (
      upgradeStacks[i]! < def.maxStacks &&
      (def.characterId === undefined || def.characterId === equippedId)
    ) {
      eligible.push(i);
    }
  }

  if (eligible.length === 0) return [fallbackIndex];

  const count = Math.min(UPGRADE_CHOICE_COUNT, eligible.length);
  for (let k = 0; k < count; k++) {
    const j = k + Math.floor(rng.next() * (eligible.length - k));
    const swap = eligible[k]!;
    eligible[k] = eligible[j]!;
    eligible[j] = swap;
  }
  eligible.length = count;
  return eligible;
}
