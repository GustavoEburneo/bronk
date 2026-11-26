/**
 * Tabela de melhorias "Panfleto na Esquina" (decisão de 2026-11-16).
 *
 * Regra de aplicação — efeito LINEAR sobre o valor BASE do stat:
 *
 *   efetivo = base × (1 + Σ percentPerStack × stacks) + Σ flatPerStack × stacks
 *
 * clampado em `[min, max]` quando definidos. Cada stack soma sempre o mesmo
 * tanto sobre a base; stacks NÃO compõem multiplicativamente entre si.
 * `name` e `effectLine` são os textos exibíveis do panfleto: a UI só consome.
 *
 * Os stat-alvos `ability.*` valem para a habilidade base EQUIPADA (mordida da
 * capivara, cartas do carteiro, fumaça do churrasqueiro) — decisão do GDD de
 * 2026-11-17: pool único, textos genéricos, iguais para todos os personagens.
 */
import type { GameData } from './tables';
import type { CharacterDef } from './characters';

/**
 * Stats modificáveis por melhoria. `xp.gainMultiplier` é derivado (base 1);
 * `player.contactArmor`, `player.hpRegen`, `ability.critChance` e
 * `ability.knockback` são derivados com base 0 (constantes abaixo).
 *
 * ATENÇÃO de manutenção (TECH 2026-11-18): `ability.critChance` e
 * `ability.knockback` são os primeiros `ability.*` que NÃO resolvem contra
 * campo do `AbilityDef` — `baseStatValue` devolve a constante derivada; não
 * existe campo novo nas tabelas de personagem, e ninguém deve "corrigir" isso
 * criando um.
 */
export type UpgradeStatId =
  | 'ability.damage'
  | 'ability.range'
  | 'ability.cooldown'
  | 'ability.critChance'
  | 'ability.knockback'
  | 'player.moveSpeed'
  | 'player.maxHp'
  | 'player.contactIFrames'
  | 'player.contactArmor'
  | 'player.hpRegen'
  | 'xp.magnetRadius'
  | 'xp.gainMultiplier';

export const ALL_UPGRADE_STATS: readonly UpgradeStatId[] = [
  'ability.damage',
  'ability.range',
  'ability.cooldown',
  'ability.critChance',
  'ability.knockback',
  'player.moveSpeed',
  'player.maxHp',
  'player.contactIFrames',
  'player.contactArmor',
  'player.hpRegen',
  'xp.magnetRadius',
  'xp.gainMultiplier',
];

export interface UpgradeEffect {
  stat: UpgradeStatId;
  /** Fração aditiva por stack sobre a base (0.25 = +25%; -0.12 = −12%). */
  percentPerStack: number;
  /** Valor absoluto somado por stack, após o percentual. */
  flatPerStack: number;
  /** Piso do valor efetivo final do stat (ex.: cooldown nunca abaixo disto). */
  min?: number;
  /** Teto do valor efetivo final do stat (ex.: i-frames nunca acima disto). */
  max?: number;
}

export interface UpgradeDef {
  id: string;
  /** Nome exibível no panfleto. */
  name: string;
  /** Linha de efeito exibível no panfleto. */
  effectLine: string;
  /**
   * Ícone exibível (emoji): aparece no panfleto da escolha e no adesivo da
   * HUD. Exibível como `name`/`effectLine`: a UI só consome, nunca mapeia por id.
   */
  icon: string;
  /** Teto de aplicações. `Infinity` apenas no fallback. */
  maxStacks: number;
  /** Efeito contínuo sobre um stat. Proibido no fallback (teto infinito). */
  effect?: UpgradeEffect;
  /** Cura aplicada no momento da escolha, clampada no maxHp efetivo. */
  healOnPick?: number;
  /**
   * Fallback oferecido como opção única quando todas as outras melhorias
   * atingiram o teto. Exatamente uma entrada da tabela deve ter esta flag.
   */
  isFallback?: boolean;
  /**
   * Filtro de pool: quando presente, a melhoria só entra no sorteio (e no
   * `?melhorias=`) para aquele personagem. Sem uso na v1 (pool único genérico).
   */
  characterId?: string;
}

/** Panfletos oferecidos por escolha de level-up. */
export const UPGRADE_CHOICE_COUNT = 3;

/** Base do multiplicador de ganho de XP (stat derivado, sem campo base na tabela). */
export const XP_GAIN_BASE_MULTIPLIER = 1;

/**
 * Bases dos stats derivados sem campo nas tabelas de personagem (padrão do
 * `xp.gainMultiplier`). Base 0 obriga as melhorias a usarem `flatPerStack`
 * (percentual sobre base 0 é no-op; a validação de boot rejeita efeito
 * só-percentual em stat de base 0).
 */
export const CONTACT_ARMOR_BASE = 0;
export const HP_REGEN_BASE = 0;
export const CRIT_CHANCE_BASE = 0;
export const KNOCKBACK_BASE = 0;

/** Multiplicador de dano do crítico (regra do Dado Viciado, GDD). */
export const CRIT_DAMAGE_MULTIPLIER = 2;

/**
 * Piso do dano de contato pós-armor (regra do GDD "dói no mínimo 1"): o
 * Capacete nunca zera o dano; o clamp blinda contra linha futura da tabela.
 */
export const CONTACT_DAMAGE_MIN = 1;

export const upgradeTable: UpgradeDef[] = [
  {
    id: 'pimenta',
    icon: '🌶️',
    name: 'Pimenta no Dente',
    effectLine: '+25% de dano',
    maxStacks: 5,
    effect: { stat: 'ability.damage', percentPerStack: 0.25, flatPerStack: 0 },
  },
  {
    id: 'bocao',
    icon: '🗣️',
    name: 'Abriu o Bocão',
    effectLine: '+20% de alcance',
    maxStacks: 4,
    effect: { stat: 'ability.range', percentPerStack: 0.2, flatPerStack: 0 },
  },
  {
    id: 'cafe',
    icon: '☕',
    name: 'Café Passado na Hora',
    effectLine: '-12% de recarga',
    maxStacks: 4,
    effect: { stat: 'ability.cooldown', percentPerStack: -0.12, flatPerStack: 0, min: 0.35 },
  },
  {
    id: 'chinelo',
    icon: '🩴',
    name: 'Chinelo Ligeiro',
    effectLine: '+10% de velocidade',
    maxStacks: 4,
    effect: { stat: 'player.moveSpeed', percentPerStack: 0.1, flatPerStack: 0 },
  },
  {
    id: 'marmita',
    icon: '🍱',
    name: 'Marmita Reforçada',
    effectLine: '+20 de HP máximo e cura 20 na hora',
    maxStacks: 5,
    effect: { stat: 'player.maxHp', percentPerStack: 0, flatPerStack: 20 },
    healOnPick: 20,
  },
  {
    id: 'ima',
    icon: '🧲',
    name: 'Ímã de Geladeira Gigante',
    effectLine: '+50% no raio do ímã de XP',
    maxStacks: 3,
    effect: { stat: 'xp.magnetRadius', percentPerStack: 0.5, flatPerStack: 0 },
  },
  {
    id: 'capa',
    icon: '🧥',
    name: 'Capa de Chuva de Saco de Lixo',
    effectLine: '+0,25 s de invulnerabilidade ao levar dano',
    maxStacks: 2,
    effect: { stat: 'player.contactIFrames', percentPerStack: 0, flatPerStack: 0.25, max: 1.1 },
  },
  {
    id: 'figurinha',
    icon: '✨',
    name: 'Figurinha Premiada',
    effectLine: '+25% de XP por orbe',
    maxStacks: 3,
    effect: { stat: 'xp.gainMultiplier', percentPerStack: 0.25, flatPerStack: 0 },
  },
  {
    id: 'capacete',
    icon: '⛑️',
    name: 'Capacete de Obra Emprestado',
    effectLine: '-2 de dano por pancada (dói no mínimo 1)',
    maxStacks: 2,
    effect: { stat: 'player.contactArmor', percentPerStack: 0, flatPerStack: 2 },
  },
  {
    id: 'soro',
    icon: '🥤',
    name: 'Soro Caseiro',
    effectLine: '+0,5 de HP por segundo',
    maxStacks: 3,
    effect: { stat: 'player.hpRegen', percentPerStack: 0, flatPerStack: 0.5 },
  },
  {
    id: 'dado',
    icon: '🎲',
    name: 'Dado Viciado',
    effectLine: '15% de chance de dano em dobro',
    maxStacks: 3,
    effect: { stat: 'ability.critChance', percentPerStack: 0, flatPerStack: 0.15 },
  },
  {
    id: 'rodo',
    icon: '🧹',
    name: 'Rodo de Enchente',
    effectLine: 'Empurra 0,5 u quem você acerta',
    maxStacks: 3,
    effect: { stat: 'ability.knockback', percentPerStack: 0, flatPerStack: 0.5 },
  },
  {
    id: 'trocado',
    icon: '🪙',
    name: 'Trocado',
    effectLine: 'Cura 20 de HP',
    maxStacks: Number.POSITIVE_INFINITY,
    healOnPick: 20,
    isFallback: true,
  },
];

/**
 * Valor base do stat (sem nenhuma melhoria aplicada). `ability.*` resolve
 * contra a habilidade equipada do personagem; `player.*` contra os stats dele;
 * `xp.*` contra a tabela global.
 */
export function baseStatValue(
  data: GameData,
  character: CharacterDef,
  stat: UpgradeStatId,
): number {
  switch (stat) {
    case 'ability.damage':
      return character.ability.damage;
    case 'ability.range':
      return character.ability.range;
    case 'ability.cooldown':
      return character.ability.cooldown;
    // Derivados de base 0: NÃO resolvem contra campo do AbilityDef/stats do
    // personagem (ver nota no topo do UpgradeStatId).
    case 'ability.critChance':
      return CRIT_CHANCE_BASE;
    case 'ability.knockback':
      return KNOCKBACK_BASE;
    case 'player.contactArmor':
      return CONTACT_ARMOR_BASE;
    case 'player.hpRegen':
      return HP_REGEN_BASE;
    case 'player.moveSpeed':
      return character.stats.moveSpeed;
    case 'player.maxHp':
      return character.stats.maxHp;
    case 'player.contactIFrames':
      return character.stats.contactIFrames;
    case 'xp.magnetRadius':
      return data.xp.magnetRadius;
    case 'xp.gainMultiplier':
      return XP_GAIN_BASE_MULTIPLIER;
  }
}

/**
 * Valor efetivo do stat com os `stacks` dados (alinhados por índice com
 * `data.upgrades`), pela regra linear sobre a base documentada no topo.
 * Quem garante que melhorias filtradas por `characterId` têm stack 0 para os
 * demais personagens é `applyUpgrade`/o sorteio — aqui os stacks mandam.
 *
 * `talentRanks` (alinhado com `data.talents`; padrão: nenhum talento) entra
 * na MESMA soma de percentuais/absolutos antes do clamp — talento é só mais
 * uma fonte do efeito linear (ver `talents.ts`). Clamps de melhorias e
 * talentos do mesmo stat se combinam: vale o mais apertado.
 */
export function effectiveStatValue(
  data: GameData,
  character: CharacterDef,
  stat: UpgradeStatId,
  stacks: readonly number[],
  talentRanks: readonly number[] = [],
): number {
  let percent = 0;
  let flat = 0;
  let min = Number.NEGATIVE_INFINITY;
  let max = Number.POSITIVE_INFINITY;

  for (let i = 0; i < data.upgrades.length; i++) {
    const effect = data.upgrades[i]!.effect;
    if (effect === undefined || effect.stat !== stat) continue;
    const count = stacks[i] ?? 0;
    percent += effect.percentPerStack * count;
    flat += effect.flatPerStack * count;
    if (effect.min !== undefined && effect.min > min) min = effect.min;
    if (effect.max !== undefined && effect.max < max) max = effect.max;
  }

  for (let i = 0; i < data.talents.length; i++) {
    const effect = data.talents[i]!.effect;
    if (effect.stat !== stat) continue;
    const ranks = talentRanks[i] ?? 0;
    percent += effect.percentPerStack * ranks;
    flat += effect.flatPerStack * ranks;
    if (effect.min !== undefined && effect.min > min) min = effect.min;
    if (effect.max !== undefined && effect.max < max) max = effect.max;
  }

  const value = baseStatValue(data, character, stat) * (1 + percent) + flat;
  return value < min ? min : value > max ? max : value;
}
