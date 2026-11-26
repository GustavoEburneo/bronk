/**
 * Helpers de acerto de habilidade compartilhados pelos 3 sistemas (mordida,
 * cartas, fumaça). NÃO é sistema: não entra na ordem do tick.
 *
 * Ordem fixa dentro de UM acerto (por inimigo atingido, na ordem do scan do
 * pool): `rollCrit` → dano (`abilityDamage × CRIT_DAMAGE_MULTIPLIER` se crit)
 * → `applyKnockback` → checagem de morte (o golpe letal TAMBÉM empurra).
 *
 * Lote de eventos: `beginHitBatch` → N × `applyAbilityHit` → `emitHitBatch`,
 * que emite UM `enemyHit` agregado seguido dos `enemyDied`s do lote (ordem do
 * contrato: `*Fired` → `enemyHit` → `enemyDied`s). O estado do lote é
 * module-level reutilizado (a sim é single-thread e processa um golpe por
 * vez) — zero alocação em runtime fora do crescimento amortizado dos arrays.
 */
import type { World } from './world';
import { EnemyState } from './enemyState';
import { CRIT_DAMAGE_MULTIPLIER } from '../data/upgrades';

/** Guarda numérica contra normalizar vetor nulo; não é constante de jogo. */
const MIN_KNOCKBACK_DISTANCE = 1e-6;

/**
 * Rola crítico para UM inimigo atingido. Com critChance 0 NÃO consome RNG
 * (curto-circuito): builds sem Dado preservam as sequências de seed
 * existentes — os testes de determinismo atuais não mudam.
 */
export function rollCrit(world: World): boolean {
  const chance = world.stats.critChance;
  if (chance === 0) return false;
  return world.rng.next() < chance;
}

/**
 * Empurra o inimigo `enemyIndex` em `stats.knockback` u na direção
 * player→inimigo (TODAS as habilidades, carta incluída — a direção é do
 * player, não do projétil: regra do GDD). No-op com knockback 0. Posição
 * clampada em ±(arenaHalfSize − tipo.radius) (mesmo clamp do spawn). Vetor
 * nulo (inimigo exatamente sobre o player) → empurra na direção do facing
 * (mesmo fallback do arremesso de carta). Não toca em prev* (o render
 * interpola o tranco em 1 frame — é o visual desejado) nem em dirX/dirZ
 * (o flyby mantém a direção de voo).
 */
export function applyKnockback(world: World, enemyIndex: number): void {
  const knockback = world.stats.knockback;
  if (knockback === 0) return;

  const { player, enemies, data } = world;
  const dx = enemies.posX[enemyIndex]! - player.x;
  const dz = enemies.posZ[enemyIndex]! - player.z;
  const dist = Math.hypot(dx, dz);
  const dirX = dist > MIN_KNOCKBACK_DISTANCE ? dx / dist : player.facingX;
  const dirZ = dist > MIN_KNOCKBACK_DISTANCE ? dz / dist : player.facingZ;

  const type = data.enemyTypes[enemies.typeIndex[enemyIndex]!]!;
  const limit = world.arenaHalfSize - type.radius;
  enemies.posX[enemyIndex] = clamp(enemies.posX[enemyIndex]! + dirX * knockback, -limit, limit);
  enemies.posZ[enemyIndex] = clamp(enemies.posZ[enemyIndex]! + dirZ * knockback, -limit, limit);
}

// Estado do lote corrente (reutilizado entre golpes; ver doc do módulo).
let hitCount = 0;
let critCount = 0;
let firstX = 0;
let firstZ = 0;
const deathX: number[] = [];
const deathZ: number[] = [];

/** Abre um lote de acertos (um golpe: 1 mordida, 1 pulso, 1 carta×tick). */
export function beginHitBatch(): void {
  hitCount = 0;
  critCount = 0;
  deathX.length = 0;
  deathZ.length = 0;
}

/**
 * Aplica UM acerto de habilidade ao inimigo `enemyIndex`, na ordem fixa do
 * contrato (crit → dano → knockback → morte), acumulando no lote corrente.
 * O chamador garante que o inimigo é alvo válido (Chasing).
 */
export function applyAbilityHit(world: World, enemyIndex: number): void {
  const { enemies, stats } = world;
  const typeIndex = enemies.typeIndex[enemyIndex]!;

  const crit = rollCrit(world);
  if (hitCount === 0) {
    firstX = enemies.posX[enemyIndex]!;
    firstZ = enemies.posZ[enemyIndex]!;
  }
  hitCount++;
  if (crit) critCount++;

  // Álbum: multiplicador de dano CONTRA o tipo (1 sem figurinhas) — entra
  // depois do crítico, na mesma multiplicação.
  const damage =
    stats.abilityDamage *
    (crit ? CRIT_DAMAGE_MULTIPLIER : 1) *
    world.albumDamageMult[typeIndex]!;
  enemies.hp[enemyIndex] = enemies.hp[enemyIndex]! - damage;
  // Registro do golpe para a APRESENTAÇÃO (flash + número de dano): nenhum
  // sistema da sim lê estes campos.
  enemies.hitTick[enemyIndex] = world.tickCount;
  enemies.hitDamage[enemyIndex] = damage;
  enemies.hitCrit[enemyIndex] = crit ? 1 : 0;

  applyKnockback(world, enemyIndex);

  if (enemies.hp[enemyIndex]! <= 0) {
    enemies.state[enemyIndex] = EnemyState.Dying;
    enemies.stateTime[enemyIndex] = 0;
    // Posição pós-knockback: o corpo morre empurrado e o orbe cai lá.
    deathX.push(enemies.posX[enemyIndex]!);
    deathZ.push(enemies.posZ[enemyIndex]!);
    // Moeda de meta-progressão: cada abate rende bananas na hora (o cofre
    // persistido só é creditado no fim da run, pelo integrador).
    world.bananasEarned += world.data.bananas.perKill;
    // Contadores de abate (conquistas e álbum leem no fim da run).
    world.kills++;
    world.killsByType[typeIndex] = world.killsByType[typeIndex]! + 1;
    // Drop de figurinha: rolado no RNG PRÓPRIO do álbum (dropRng) para não
    // tocar nas sequências do RNG da sim (determinismo/balance intactos).
    if (world.dropRng.next() < world.data.album.dropChance) {
      world.cardsEarned[typeIndex] = world.cardsEarned[typeIndex]! + 1;
    }
  }
}

/**
 * Fecha o lote: emite o `enemyHit` agregado seguido dos `enemyDied`s, na
 * ordem do contrato. Lote vazio (nenhum acerto) não emite nada.
 */
export function emitHitBatch(world: World): void {
  if (hitCount === 0) return;
  world.events.push({ type: 'enemyHit', count: hitCount, critCount, x: firstX, z: firstZ });
  for (let d = 0; d < deathX.length; d++) {
    world.events.push({ type: 'enemyDied', x: deathX[d]!, z: deathZ[d]! });
  }
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}
