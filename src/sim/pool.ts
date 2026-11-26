import { EnemyState } from './enemyState';

/**
 * Pools SoA com capacidade fixa e remoção por swap-remove: entidades ativas
 * ocupam sempre os índices [0, count). Zero alocação em runtime.
 */

export interface EnemyPool {
  readonly capacity: number;
  count: number;
  posX: Float32Array;
  posZ: Float32Array;
  prevX: Float32Array;
  prevZ: Float32Array;
  hp: Float32Array;
  state: Uint8Array;
  stateTime: Float32Array;
  /** Índice do tipo em `data.enemyTypes` (teto de 256 tipos é folga). */
  typeIndex: Uint8Array;
  /**
   * Direção normalizada spawn→player gravada no spawn (o flyby voa reto nela
   * e NUNCA vira; o chase não a usa). Knockback desloca a posição e não toca
   * aqui — "deslocado mas mantém a direção de voo" (GDD).
   */
  dirX: Float32Array;
  dirZ: Float32Array;
  /**
   * Janela pós-acerto de carta (s): enquanto > 0 o inimigo não leva dano de
   * NENHUMA carta. Mecanismo barato de "1 acerto por passada" imune ao
   * swap-remove (TECH). Só `cardAbility` escreve/decrementa.
   */
  projectileHitCooldown: Float32Array;
  /**
   * Último acerto sofrido, PARA A APRESENTAÇÃO (flash de hit e número de dano
   * — 2026-11-24): tick do golpe (-1 = nunca), dano aplicado e se foi crítico.
   * `combat.applyAbilityHit` escreve; NENHUM sistema da sim lê — é estado
   * exposto ao render, como posição.
   */
  hitTick: Int32Array;
  hitDamage: Float32Array;
  hitCrit: Uint8Array;
}

export interface OrbPool {
  readonly capacity: number;
  count: number;
  posX: Float32Array;
  posZ: Float32Array;
  prevX: Float32Array;
  prevZ: Float32Array;
  /** XP do orbe, capturado do tipo do inimigo na hora do drop. */
  xpValue: Float32Array;
}

/**
 * Fase do voo da carta (FSM explícita):
 * Outgoing:  linha reta na direção do arremesso até o alcance máximo.
 * Returning: persegue a posição ATUAL do player até a captura.
 */
export const CardPhase = {
  Outgoing: 0,
  Returning: 1,
} as const;

export type CardPhaseId = (typeof CardPhase)[keyof typeof CardPhase];

export interface CardPool {
  readonly capacity: number;
  count: number;
  posX: Float32Array;
  posZ: Float32Array;
  prevX: Float32Array;
  prevZ: Float32Array;
  /** Direção de voo normalizada (atualizada no homing da volta). */
  dirX: Float32Array;
  dirZ: Float32Array;
  /** Distância percorrida na ida (u); ao atingir o alcance, vira Returning. */
  traveled: Float32Array;
  /** Tempo de voo (s); no teto de segurança a carta some sem captura. */
  age: Float32Array;
  phase: Uint8Array;
}

export function createEnemyPool(capacity: number): EnemyPool {
  return {
    capacity,
    count: 0,
    posX: new Float32Array(capacity),
    posZ: new Float32Array(capacity),
    prevX: new Float32Array(capacity),
    prevZ: new Float32Array(capacity),
    hp: new Float32Array(capacity),
    state: new Uint8Array(capacity),
    stateTime: new Float32Array(capacity),
    typeIndex: new Uint8Array(capacity),
    dirX: new Float32Array(capacity),
    dirZ: new Float32Array(capacity),
    projectileHitCooldown: new Float32Array(capacity),
    hitTick: new Int32Array(capacity).fill(-1),
    hitDamage: new Float32Array(capacity),
    hitCrit: new Uint8Array(capacity),
  };
}

/** Retorna o índice do slot alocado, ou -1 se o pool está cheio. */
export function allocEnemy(pool: EnemyPool): number {
  if (pool.count >= pool.capacity) return -1;
  const i = pool.count;
  pool.count++;
  pool.state[i] = EnemyState.Spawning;
  pool.stateTime[i] = 0;
  pool.projectileHitCooldown[i] = 0;
  pool.hitTick[i] = -1;
  pool.hitDamage[i] = 0;
  pool.hitCrit[i] = 0;
  return i;
}

/** Libera o slot `index` copiando o último slot ativo por cima (swap-remove). */
export function freeEnemy(pool: EnemyPool, index: number): void {
  const last = pool.count - 1;
  if (index !== last) {
    pool.posX[index] = pool.posX[last]!;
    pool.posZ[index] = pool.posZ[last]!;
    pool.prevX[index] = pool.prevX[last]!;
    pool.prevZ[index] = pool.prevZ[last]!;
    pool.hp[index] = pool.hp[last]!;
    pool.state[index] = pool.state[last]!;
    pool.stateTime[index] = pool.stateTime[last]!;
    pool.typeIndex[index] = pool.typeIndex[last]!;
    pool.dirX[index] = pool.dirX[last]!;
    pool.dirZ[index] = pool.dirZ[last]!;
    pool.projectileHitCooldown[index] = pool.projectileHitCooldown[last]!;
    pool.hitTick[index] = pool.hitTick[last]!;
    pool.hitDamage[index] = pool.hitDamage[last]!;
    pool.hitCrit[index] = pool.hitCrit[last]!;
  }
  pool.count = last;
}

export function createOrbPool(capacity: number): OrbPool {
  return {
    capacity,
    count: 0,
    posX: new Float32Array(capacity),
    posZ: new Float32Array(capacity),
    prevX: new Float32Array(capacity),
    prevZ: new Float32Array(capacity),
    xpValue: new Float32Array(capacity),
  };
}

/** Retorna o índice do slot alocado, ou -1 se o pool está cheio. */
export function allocOrb(pool: OrbPool): number {
  if (pool.count >= pool.capacity) return -1;
  const i = pool.count;
  pool.count++;
  return i;
}

/** Libera o slot `index` copiando o último slot ativo por cima (swap-remove). */
export function freeOrb(pool: OrbPool, index: number): void {
  const last = pool.count - 1;
  if (index !== last) {
    pool.posX[index] = pool.posX[last]!;
    pool.posZ[index] = pool.posZ[last]!;
    pool.prevX[index] = pool.prevX[last]!;
    pool.prevZ[index] = pool.prevZ[last]!;
    pool.xpValue[index] = pool.xpValue[last]!;
  }
  pool.count = last;
}

export function createCardPool(capacity: number): CardPool {
  return {
    capacity,
    count: 0,
    posX: new Float32Array(capacity),
    posZ: new Float32Array(capacity),
    prevX: new Float32Array(capacity),
    prevZ: new Float32Array(capacity),
    dirX: new Float32Array(capacity),
    dirZ: new Float32Array(capacity),
    traveled: new Float32Array(capacity),
    age: new Float32Array(capacity),
    phase: new Uint8Array(capacity),
  };
}

/** Retorna o índice do slot alocado, ou -1 se o pool está cheio. */
export function allocCard(pool: CardPool): number {
  if (pool.count >= pool.capacity) return -1;
  const i = pool.count;
  pool.count++;
  pool.traveled[i] = 0;
  pool.age[i] = 0;
  pool.phase[i] = CardPhase.Outgoing;
  return i;
}

/** Libera o slot `index` copiando o último slot ativo por cima (swap-remove). */
export function freeCard(pool: CardPool, index: number): void {
  const last = pool.count - 1;
  if (index !== last) {
    pool.posX[index] = pool.posX[last]!;
    pool.posZ[index] = pool.posZ[last]!;
    pool.prevX[index] = pool.prevX[last]!;
    pool.prevZ[index] = pool.prevZ[last]!;
    pool.dirX[index] = pool.dirX[last]!;
    pool.dirZ[index] = pool.dirZ[last]!;
    pool.traveled[index] = pool.traveled[last]!;
    pool.age[index] = pool.age[last]!;
    pool.phase[index] = pool.phase[last]!;
  }
  pool.count = last;
}
