import type { GameData } from '../data/tables';
import type { AbilityDef } from '../data/characters';
import { CARD_POOL_CAPACITY } from '../data/characters';
import type { Rng } from './rng';
import { mulberry32 } from './rng';
import { albumDamageBonus } from '../data/album';
import type { SpawnPhase } from '../data/enemies';
import type { CardPool, EnemyPool, OrbPool } from './pool';
import { createCardPool, createEnemyPool, createOrbPool } from './pool';
import type { EffectiveStats } from './stats';
import { createEffectiveStats } from './stats';

/** Eventos efêmeros de um tick: o array é esvaziado no início do tick seguinte. */
export type SimEvent =
  | { type: 'biteFired' }
  | { type: 'cardFired' }
  | { type: 'smokeFired' }
  /**
   * UM evento AGREGADO por aplicação de dano de habilidade por tick (mordida:
   * count 1; fumaça: 1 por pulso com count = atingidos; cartas: 1 por carta
   * por tick), nunca 1 por inimigo — o teto de vozes do áudio começa no
   * formato do dado. `critCount` = acertos críticos do lote; `x`/`z` =
   * posição do 1º inimigo atingido. Ordem no lote de um golpe:
   * `*Fired` → `enemyHit` → `enemyDied`s. Golpe que não fere não emite nada.
   */
  | { type: 'enemyHit'; count: number; critCount: number; x: number; z: number }
  | { type: 'enemyDied'; x: number; z: number }
  | { type: 'levelUp'; level: number }
  | { type: 'playerDied' }
  /** Orelhão atendido (2026-11-24): prêmio em bananas já creditado na run. */
  | { type: 'orelhaoAnswered'; x: number; z: number; reward: number };

/**
 * Fase do cronograma de spawn compilada por `createWorld` para forma indexada
 * (a sim não faz lookup de string no tick): tipos com peso > 0, na ordem da
 * tabela, com pesos acumulados — 1 `rng.next()` sorteia pelo acumulado.
 */
export interface CompiledSpawnPhase {
  fromTime: number;
  /** Índices em `data.enemyTypes` dos tipos com peso > 0. */
  typeIndices: number[];
  /** Pesos acumulados, alinhados com `typeIndices`; o último é o total. */
  cumulativeWeights: number[];
}

/**
 * Orelhão que tocou na run (2026-11-24): atender exige chegar a `answerRadius`
 * do aparelho com `requirement` abates acumulados — prêmio em bananas igual ao
 * requisito. Sistema `updateOrelhoes`; config em `data.orelhoes`.
 */
export interface OrelhaoState {
  x: number;
  z: number;
  /** Abates mínimos para atender este aparelho. */
  requirement: number;
  answered: boolean;
}

export interface PlayerState {
  x: number;
  z: number;
  prevX: number;
  prevZ: number;
  facingX: number;
  facingZ: number;
  hp: number;
  level: number;
  xp: number;
  xpToNext: number;
  /** Cooldown da habilidade equipada (mordida, cartas ou fumaça), em segundos. */
  abilityCooldown: number;
  invulnTimer: number;
  state: 'alive' | 'dead';
  /**
   * Pulo (2026-11-24, movido da apresentação para a SIM): altura atual acima
   * do chão (u) e velocidade vertical. Acima de `JUMP_CLEAR_HEIGHT` o dano de
   * contato não acerta — por isso o pulo é estado determinístico, integrado em
   * `updatePlayerMovement`. O movimento XZ, alcances e habilidades seguem 2D.
   */
  jumpOffset: number;
  jumpVelocity: number;
  prevJumpOffset: number;
  /**
   * Último golpe SOFRIDO, para a apresentação (vinheta de dano e número —
   * 2026-11-24): tick (-1 = nunca) e dano. `contactDamage` escreve; nenhum
   * sistema da sim lê.
   */
  lastHitTick: number;
  lastHitDamage: number;
}

/**
 * Escolha de melhoria aberta ("Panfleto na Esquina"). A sim NÃO se pausa:
 * ela só expõe este estado; quem deixa de chamar `tick` enquanto a escolha
 * está aberta é o gameLoop. A UI resolve com `chooseUpgrade`/`rerollChoice`.
 */
export interface UpgradeChoice {
  /** Índices em `data.upgrades` das opções sorteadas (3, ou 1 no fallback). */
  options: number[];
  /** Reroll grátis ainda disponível para esta escolha (1 por level-up). */
  rerollAvailable: boolean;
}

/** Seleção de partida vinda das telas (ou dos overrides `?personagem=`/`?mapa=`). */
export interface MatchSelection {
  /** Id em `data.characters` (ex.: 'capivara', 'carteiro'). */
  characterId: string;
  /** Id de mapa JOGÁVEL em `data.maps`; padrão/undefined: o primeiro jogável. */
  mapId?: string | undefined;
  /**
   * Níveis comprados na Loja de Talentos, alinhados por índice com
   * `data.talents` (o integrador lê do cofre persistido). Padrão/undefined:
   * nenhum talento — a sim não conhece persistência.
   */
  talentRanks?: readonly number[] | undefined;
  /**
   * Cópias de figurinha do álbum por tipo, alinhadas por índice com
   * `data.enemyTypes` (o integrador lê do cofre). Viram o bônus de dano por
   * tipo (`albumDamageMult`). Padrão/undefined: álbum vazio.
   */
  albumCopies?: readonly number[] | undefined;
  /**
   * Semente do RNG PRÓPRIO dos drops de figurinha (`dropRng`): separado do
   * RNG da sim para a coleção não alterar as sequências de spawn/crit.
   * Padrão: `DEFAULT_DROP_SEED` (determinístico nos testes).
   */
  dropSeed?: number | undefined;
}

/** Semente padrão do `dropRng` (data da decisão do álbum). */
export const DEFAULT_DROP_SEED = 20261119;

export interface World {
  readonly data: GameData;
  readonly rng: Rng;
  /** Índice do personagem equipado em `data.characters`. */
  readonly characterIndex: number;
  /** Habilidade equipada (referência à ability do personagem). */
  readonly ability: AbilityDef;
  /** Id do mapa da partida (em `data.maps`). */
  readonly mapId: string;
  /** Cache de `maps[].arena.halfSize` do mapa escolhido. */
  readonly arenaHalfSize: number;
  /** Cronograma de spawn compilado (índices + pesos acumulados por fase). */
  readonly spawnSchedule: CompiledSpawnPhase[];
  tickCount: number;
  /** Tempo simulado em segundos. */
  time: number;
  status: 'running' | 'gameOver';
  player: PlayerState;
  enemies: EnemyPool;
  orbs: OrbPool;
  /** Cartas em voo (só a habilidade 'cartas' usa; vazio para as demais). */
  cards: CardPool;
  events: SimEvent[];
  spawnAccumulator: number;
  /** Stacks aplicados por melhoria, alinhado por índice com `data.upgrades`. */
  upgradeStacks: number[];
  /** Níveis de talento da partida (fixos; a loja só existe no menu). */
  readonly talentRanks: readonly number[];
  /**
   * Bananas ganhas NESTA run (1 por abate, `data.bananas.perKill`). O
   * integrador credita no cofre persistido no fim da run; a sim só conta.
   */
  bananasEarned: number;
  /** Abates NESTA run (total e por tipo, alinhado com `data.enemyTypes`). */
  kills: number;
  killsByType: number[];
  /**
   * Figurinhas dropadas NESTA run por tipo (alinhado com `data.enemyTypes`).
   * Creditadas ao álbum persistido no fim da run, como as bananas.
   */
  cardsEarned: number[];
  /**
   * Multiplicador de dano CONTRA cada tipo (alinhado com `data.enemyTypes`):
   * 1 + bônus do maior degrau do álbum atingido com as cópias da seleção.
   * Fixo pela partida (o álbum só cresce no fim da run).
   */
  readonly albumDamageMult: readonly number[];
  /** RNG próprio dos drops de figurinha (1 roll por abate; ver `dropSeed`). */
  readonly dropRng: Rng;
  /** Orelhões que já tocaram (spawn pelo relógio; ver `updateOrelhoes`). */
  orelhoes: OrelhaoState[];
  /**
   * RNG PRÓPRIO das posições de orelhão (semente derivada do `dropSeed`):
   * como o do álbum, nunca toca as sequências do RNG da sim — spawn e crit
   * continuam reproduzindo as runs congeladas dos testes.
   */
  readonly orelhaoRng: Rng;
  /** Level-ups aguardando escolha, incluindo o da escolha aberta. */
  pendingLevelUps: number;
  /** Escolha aberta, ou null. Abre no fim do tick (a morte no tick vence). */
  upgradeChoice: UpgradeChoice | null;
  /** Stats efetivos (base + melhorias); cache mantido por `applyUpgrade`. */
  stats: EffectiveStats;
}

/**
 * Encerra a run por desistência ("Finalizar run" do menu de pausa): o mundo
 * entra em `gameOver` pelo MESMO caminho de estado da morte — o integrador
 * (afterFrame) mostra o fim de run e credita as bananas sem código especial.
 * Sem evento `playerDied`: a desistência não toca o som de morte.
 */
export function abandonRun(world: World): void {
  if (world.status !== 'running') return;
  world.status = 'gameOver';
}

export function xpRequiredForLevel(data: GameData, level: number): number {
  return data.xp.baseToNext * Math.pow(data.xp.growthPerLevel, level - 1);
}

/**
 * Compila o `spawnSchedule` DO MAPA (Record por id, formato da tabela) para a
 * forma indexada que o `enemySpawn` consome. Iteração na ordem de `enemyTypes`:
 * resultado estável, independente da ordem das chaves do Record. Pesos 0 são
 * descartados (nunca sorteiam). A validação de boot garante fases sãs.
 */
function compileSpawnSchedule(
  data: GameData,
  schedule: readonly SpawnPhase[],
): CompiledSpawnPhase[] {
  return schedule.map((phase) => {
    const typeIndices: number[] = [];
    const cumulativeWeights: number[] = [];
    let total = 0;
    for (let t = 0; t < data.enemyTypes.length; t++) {
      const weight = phase.weights[data.enemyTypes[t]!.id];
      if (weight === undefined || weight <= 0) continue;
      total += weight;
      typeIndices.push(t);
      cumulativeWeights.push(total);
    }
    return { fromTime: phase.fromTime, typeIndices, cumulativeWeights };
  });
}

export function createWorld(data: GameData, rng: Rng, selection: MatchSelection): World {
  const characterIndex = data.characters.findIndex((def) => def.id === selection.characterId);
  if (characterIndex < 0) {
    throw new Error(`personagem desconhecido: ${selection.characterId}`);
  }
  const character = data.characters[characterIndex]!;

  const map =
    selection.mapId === undefined
      ? data.maps.find((def) => def.playable)
      : data.maps.find((def) => def.id === selection.mapId);
  if (map === undefined) {
    throw new Error(`mapa desconhecido: ${selection.mapId ?? '(nenhum jogável)'}`);
  }
  if (!map.playable) {
    throw new Error(`mapa não jogável: ${map.id}`);
  }
  if (map.spawnSchedule === undefined) {
    // A validação de boot garante cronograma em mapa jogável; aqui é blindagem.
    throw new Error(`mapa jogável sem spawnSchedule: ${map.id}`);
  }

  // Talentos: fixos pela partida inteira (a loja só existe no menu). Tamanho
  // errado é bug do integrador — fail fast, como os ids desconhecidos acima.
  const talentRanks = selection.talentRanks ?? new Array<number>(data.talents.length).fill(0);
  if (talentRanks.length !== data.talents.length) {
    throw new Error(
      `talentRanks com tamanho ${talentRanks.length}; esperado ${data.talents.length}`,
    );
  }

  // Álbum: cópias por tipo viram multiplicador de dano fixo da partida.
  const albumCopies =
    selection.albumCopies ?? new Array<number>(data.enemyTypes.length).fill(0);
  if (albumCopies.length !== data.enemyTypes.length) {
    throw new Error(
      `albumCopies com tamanho ${albumCopies.length}; esperado ${data.enemyTypes.length}`,
    );
  }
  const albumDamageMult = albumCopies.map(
    (copies) => 1 + albumDamageBonus(data.album, copies),
  );

  const upgradeStacks = new Array<number>(data.upgrades.length).fill(0);
  const stats = createEffectiveStats(data, character, upgradeStacks, talentRanks);
  return {
    data,
    rng,
    characterIndex,
    ability: character.ability,
    mapId: map.id,
    arenaHalfSize: map.arena.halfSize,
    spawnSchedule: compileSpawnSchedule(data, map.spawnSchedule),
    tickCount: 0,
    time: 0,
    status: 'running',
    player: {
      x: 0,
      z: 0,
      prevX: 0,
      prevZ: 0,
      facingX: 0,
      facingZ: 1,
      hp: stats.maxHp,
      level: 1,
      xp: 0,
      xpToNext: xpRequiredForLevel(data, 1),
      abilityCooldown: 0,
      invulnTimer: 0,
      state: 'alive',
      jumpOffset: 0,
      jumpVelocity: 0,
      prevJumpOffset: 0,
      lastHitTick: -1,
      lastHitDamage: 0,
    },
    enemies: createEnemyPool(data.enemies.maxAlive),
    orbs: createOrbPool(data.xp.maxOrbs),
    cards: createCardPool(CARD_POOL_CAPACITY),
    events: [],
    spawnAccumulator: 0,
    upgradeStacks,
    talentRanks,
    bananasEarned: 0,
    kills: 0,
    killsByType: new Array<number>(data.enemyTypes.length).fill(0),
    cardsEarned: new Array<number>(data.enemyTypes.length).fill(0),
    albumDamageMult,
    dropRng: mulberry32((selection.dropSeed ?? DEFAULT_DROP_SEED) >>> 0),
    orelhoes: [],
    orelhaoRng: mulberry32((((selection.dropSeed ?? DEFAULT_DROP_SEED) >>> 0) ^ 0x03e1f0e) >>> 0),
    pendingLevelUps: 0,
    upgradeChoice: null,
    stats,
  };
}
