import type { GameData } from '../data/tables';
import type { CharacterDef } from '../data/characters';
import { effectiveStatValue } from '../data/upgrades';
import type { World } from './world';

/**
 * Stats efetivos do player: base do personagem equipado + melhorias aplicadas,
 * pela regra linear de `data/upgrades.ts`. Os stat-alvos `ability.*` resolvem
 * contra a habilidade equipada (mordida da capivara, cartas do carteiro,
 * fumaça do churrasqueiro).
 * É um cache recalculado só quando uma melhoria é aplicada — os sistemas do
 * tick leem daqui, nunca recalculam por frame.
 */
export interface EffectiveStats {
  abilityDamage: number;
  abilityRange: number;
  abilityCooldown: number;
  /** Chance de crítico por inimigo atingido (fração 0..1; base 0). */
  critChance: number;
  /** Empurrão por acerto de habilidade (u; base 0). */
  knockback: number;
  moveSpeed: number;
  maxHp: number;
  contactIFrames: number;
  /** Redução PLANA do dano de contato por golpe (HP; base 0). */
  contactArmor: number;
  /** Regeneração contínua (HP/s; base 0). */
  hpRegenPerSec: number;
  /** Raio do player (cache da base; nenhuma melhoria o altera hoje). */
  playerRadius: number;
  magnetRadius: number;
  /** Multiplicador sobre o `xpValue` de cada orbe coletado (base 1). */
  xpGainMultiplier: number;
}

export function createEffectiveStats(
  data: GameData,
  character: CharacterDef,
  stacks: readonly number[],
  talentRanks: readonly number[],
): EffectiveStats {
  const stats = {
    abilityDamage: 0,
    abilityRange: 0,
    abilityCooldown: 0,
    critChance: 0,
    knockback: 0,
    moveSpeed: 0,
    maxHp: 0,
    contactIFrames: 0,
    contactArmor: 0,
    hpRegenPerSec: 0,
    playerRadius: 0,
    magnetRadius: 0,
    xpGainMultiplier: 0,
  };
  fillEffectiveStats(data, character, stacks, talentRanks, stats);
  return stats;
}

/** Recalcula `world.stats` in-place (sem alocar) a partir dos stacks atuais. */
export function recomputeEffectiveStats(world: World): void {
  const character = world.data.characters[world.characterIndex]!;
  fillEffectiveStats(world.data, character, world.upgradeStacks, world.talentRanks, world.stats);
}

function fillEffectiveStats(
  data: GameData,
  character: CharacterDef,
  stacks: readonly number[],
  talentRanks: readonly number[],
  out: EffectiveStats,
): void {
  out.abilityDamage = effectiveStatValue(data, character, 'ability.damage', stacks, talentRanks);
  out.abilityRange = effectiveStatValue(data, character, 'ability.range', stacks, talentRanks);
  out.abilityCooldown = effectiveStatValue(
    data,
    character,
    'ability.cooldown',
    stacks,
    talentRanks,
  );
  out.critChance = effectiveStatValue(data, character, 'ability.critChance', stacks, talentRanks);
  out.knockback = effectiveStatValue(data, character, 'ability.knockback', stacks, talentRanks);
  out.moveSpeed = effectiveStatValue(data, character, 'player.moveSpeed', stacks, talentRanks);
  out.maxHp = effectiveStatValue(data, character, 'player.maxHp', stacks, talentRanks);
  out.contactIFrames = effectiveStatValue(
    data,
    character,
    'player.contactIFrames',
    stacks,
    talentRanks,
  );
  out.contactArmor = effectiveStatValue(data, character, 'player.contactArmor', stacks, talentRanks);
  out.hpRegenPerSec = effectiveStatValue(data, character, 'player.hpRegen', stacks, talentRanks);
  out.playerRadius = character.stats.radius;
  out.magnetRadius = effectiveStatValue(data, character, 'xp.magnetRadius', stacks, talentRanks);
  out.xpGainMultiplier = effectiveStatValue(
    data,
    character,
    'xp.gainMultiplier',
    stacks,
    talentRanks,
  );
}
