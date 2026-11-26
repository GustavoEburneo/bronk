/**
 * Utilitários de teste da simulação pura. Mundos de teste sempre usam um clone
 * profundo do `gameData` oficial: cada teste pode ajustar campos sem vazar
 * estado para os demais.
 */
import type { GameData } from '../../data/tables';
import { gameData } from '../../data/tables';
import type { CharacterDef } from '../../data/characters';
import type { EnemyTypeDef } from '../../data/enemies';
import type { MapDef } from '../../data/maps';
import type { World } from '../world';
import { createWorld } from '../world';
import { mulberry32 } from '../rng';
import type { InputFrame } from '../tick';
import { SIM_DT, tick } from '../tick';
import { allocEnemy, allocOrb } from '../pool';
import type { EnemyStateId } from '../enemyState';
import { EnemyState } from '../enemyState';

export const IDLE_INPUT: InputFrame = { moveX: 0, moveZ: 0 };

/** Clone profundo da tabela oficial, pronto para o teste customizar campos. */
export function cloneGameData(): GameData {
  return structuredClone(gameData);
}

/** Personagem por id. Lança se não existir (setup de teste errado). */
export function characterById(data: GameData, id: string): CharacterDef {
  const def = data.characters.find((character) => character.id === id);
  if (def === undefined) throw new Error(`personagem desconhecido no teste: ${id}`);
  return def;
}

/** Mapa por id. Lança se não existir (setup de teste errado). */
export function mapById(data: GameData, id: string): MapDef {
  const def = data.maps.find((map) => map.id === id);
  if (def === undefined) throw new Error(`mapa desconhecido no teste: ${id}`);
  return def;
}

/** Tipo de inimigo por id. Lança se não existir (setup de teste errado). */
export function enemyTypeById(data: GameData, id: string): EnemyTypeDef {
  const def = data.enemyTypes.find((type) => type.id === id);
  if (def === undefined) throw new Error(`tipo de inimigo desconhecido no teste: ${id}`);
  return def;
}

/** O tipo básico (1ª linha da tabela, o Cone) — o default do `placeEnemy`. */
export function baseEnemyType(data: GameData): EnemyTypeDef {
  return data.enemyTypes[0]!;
}

/** Zera a taxa de spawn para testar sistemas sem inimigos aleatórios no caminho. */
export function disableSpawn(data: GameData): GameData {
  data.spawn.baseRatePerSec = 0;
  data.spawn.rateGrowthPerMinute = 0;
  return data;
}

/** Congela os inimigos no lugar (moveSpeed 0) para asserções de posição exata. */
export function freezeEnemies(data: GameData): GameData {
  for (const type of data.enemyTypes) type.moveSpeed = 0;
  return data;
}

export interface TestWorldOptions {
  seed?: number;
  /** Tabela customizada; por padrão, um clone do `gameData` oficial. */
  data?: GameData;
  /** Personagem equipado; por padrão, 'capivara' (comportamento da POC). */
  characterId?: string;
  /** Mapa da partida; por padrão, o primeiro jogável. */
  mapId?: string;
  /** Níveis de talento (alinhados com `data.talents`); por padrão, nenhum. */
  talentRanks?: readonly number[];
  /** Cópias do álbum (alinhadas com `data.enemyTypes`); por padrão, nenhuma. */
  albumCopies?: readonly number[];
  /** Semente do RNG de drops do álbum; por padrão, a DEFAULT_DROP_SEED. */
  dropSeed?: number;
}

export function makeTestWorld(options: TestWorldOptions = {}): World {
  const data = options.data ?? cloneGameData();
  return createWorld(data, mulberry32(options.seed ?? 1), {
    characterId: options.characterId ?? 'capivara',
    mapId: options.mapId,
    talentRanks: options.talentRanks,
    albumCopies: options.albumCopies,
    dropSeed: options.dropSeed,
  });
}

/** Avança `n` ticks de `SIM_DT` com o mesmo input (parado, por padrão). */
export function runTicks(world: World, n: number, input: InputFrame = IDLE_INPUT): void {
  for (let i = 0; i < n; i++) {
    tick(world, input, SIM_DT);
  }
}

export interface PlaceEnemyOptions {
  x: number;
  z: number;
  /** HP inicial; por padrão, o `maxHp` do TIPO do inimigo. */
  hp?: number;
  /** Estado inicial; por padrão, `Chasing` (pronto para morder e ser mordido). */
  state?: EnemyStateId;
  /** Id do tipo em `data.enemyTypes`; por padrão, o básico (1ª linha, Cone). */
  typeId?: string;
  /**
   * Direção de voo gravada no slot (só o flyby a usa); por padrão, a direção
   * normalizada posição→player, como o spawn real grava.
   */
  dirX?: number;
  dirZ?: number;
}

/** Posiciona um inimigo manualmente no pool e retorna o índice do slot. */
export function placeEnemy(world: World, options: PlaceEnemyOptions): number {
  const index = allocEnemy(world.enemies);
  if (index < 0) throw new Error('pool de inimigos cheio no setup do teste');
  const { enemies, data, player } = world;

  const typeIndex =
    options.typeId === undefined
      ? 0
      : data.enemyTypes.findIndex((type) => type.id === options.typeId);
  if (typeIndex < 0) throw new Error(`tipo de inimigo desconhecido no teste: ${options.typeId}`);

  enemies.posX[index] = options.x;
  enemies.posZ[index] = options.z;
  enemies.prevX[index] = options.x;
  enemies.prevZ[index] = options.z;
  enemies.hp[index] = options.hp ?? data.enemyTypes[typeIndex]!.maxHp;
  enemies.state[index] = options.state ?? EnemyState.Chasing;
  enemies.stateTime[index] = 0;
  enemies.typeIndex[index] = typeIndex;

  if (options.dirX !== undefined || options.dirZ !== undefined) {
    enemies.dirX[index] = options.dirX ?? 0;
    enemies.dirZ[index] = options.dirZ ?? 0;
  } else {
    // Mesma regra do spawn real: direção normalizada spawn→player.
    const toPlayerX = player.x - options.x;
    const toPlayerZ = player.z - options.z;
    const dist = Math.hypot(toPlayerX, toPlayerZ);
    enemies.dirX[index] = dist > 1e-6 ? toPlayerX / dist : 0;
    enemies.dirZ[index] = dist > 1e-6 ? toPlayerZ / dist : 1;
  }
  return index;
}

/** Posiciona um orbe de XP manualmente no pool e retorna o índice do slot. */
export function placeOrb(world: World, x: number, z: number, xpValue?: number): number {
  const index = allocOrb(world.orbs);
  if (index < 0) throw new Error('pool de orbes cheio no setup do teste');
  const { orbs } = world;
  orbs.posX[index] = x;
  orbs.posZ[index] = z;
  orbs.prevX[index] = x;
  orbs.prevZ[index] = z;
  // Default: o XP do tipo básico, como um drop comum da POC.
  orbs.xpValue[index] = xpValue ?? baseEnemyType(world.data).xpValue;
  return index;
}
