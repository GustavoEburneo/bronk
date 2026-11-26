import type { World } from '../world';
import type { AbilityDef } from '../../data/characters';
import { CARD_FLIGHT_TIMEOUT, PROJECTILE_HIT_COOLDOWN } from '../../data/characters';
import { EnemyState } from '../enemyState';
import { CardPhase, allocCard, freeCard } from '../pool';
import { applyAbilityHit, beginHitBatch, emitHitBatch } from '../combat';

/** Guarda numérica contra normalizar vetor nulo; não é constante de jogo. */
const MIN_AIM_DISTANCE = 1e-6;

type CardsAbility = Extract<AbilityDef, { kind: 'cartas' }>;

/**
 * "Cartas que Voltam" (habilidade do carteiro), um sistema só: lançamento,
 * voo (FSM Outgoing → Returning) e dano por contato nas duas fases.
 *
 * - Lança 1 carta mirando o inimigo Chasing mais próximo dentro do alcance;
 *   SEM alvo no alcance, não arremessa e o cooldown não gasta (segura em 0).
 * - Teto de cartas em voo (`maxLive`, regra de jogo) ou pool técnico cheio
 *   também adiam o lançamento segurando o cooldown em 0 — nunca perdem o tiro
 *   em silêncio.
 * - A carta atravessa inimigos; `projectileHitCooldown` por inimigo garante no
 *   máximo 1 acerto por passada e permite acertar o mesmo inimigo na ida E na
 *   volta. Só inimigos Chasing tomam dano, como na mordida.
 * - Captura por soma de raios (playerRadius + cardRadius); teto de segurança
 *   de voo (`CARD_FLIGHT_TIMEOUT`) despacha cartas órfãs.
 */
export function updateCardAbility(world: World, dt: number): void {
  const ability = world.ability;
  if (ability.kind !== 'cartas') {
    throw new Error(`updateCardAbility com habilidade '${ability.kind}'`);
  }

  const { player, enemies, cards, stats } = world;

  // Timers de "1 acerto por passada", por inimigo.
  for (let i = 0; i < enemies.count; i++) {
    if (enemies.projectileHitCooldown[i]! > 0) {
      enemies.projectileHitCooldown[i] = enemies.projectileHitCooldown[i]! - dt;
    }
  }

  // Lançamento: o cooldown conta a partir do arremesso; adiado (sem alvo, teto
  // de voo ou pool cheio) fica segurado em 0 e tenta de novo no próximo tick.
  player.abilityCooldown -= dt;
  if (player.abilityCooldown <= 0) {
    const launched = tryLaunchCard(world, ability);
    player.abilityCooldown = launched ? player.abilityCooldown + stats.abilityCooldown : 0;
  }

  // Voo e dano. Iteração reversa: swap-remove reaproveita slot já processado.
  const captureRadius = stats.playerRadius + ability.cardRadius;
  const captureSq = captureRadius * captureRadius;
  const step = ability.projectileSpeed * dt;

  for (let c = cards.count - 1; c >= 0; c--) {
    cards.age[c] = cards.age[c]! + dt;
    if (cards.age[c]! >= CARD_FLIGHT_TIMEOUT) {
      freeCard(cards, c);
      continue;
    }

    if (cards.phase[c] === CardPhase.Outgoing) {
      cards.posX[c] = cards.posX[c]! + cards.dirX[c]! * step;
      cards.posZ[c] = cards.posZ[c]! + cards.dirZ[c]! * step;
      cards.traveled[c] = cards.traveled[c]! + step;
      if (cards.traveled[c]! >= stats.abilityRange) {
        cards.phase[c] = CardPhase.Returning;
      }
    } else {
      // Homing na posição ATUAL do player: andar muda o caminho da volta.
      const toPlayerX = player.x - cards.posX[c]!;
      const toPlayerZ = player.z - cards.posZ[c]!;
      const dist = Math.hypot(toPlayerX, toPlayerZ);
      if (dist > MIN_AIM_DISTANCE) {
        cards.dirX[c] = toPlayerX / dist;
        cards.dirZ[c] = toPlayerZ / dist;
      }
      // Sem ultrapassar o player no tick: o passo satura na distância restante.
      const homingStep = step < dist ? step : dist;
      cards.posX[c] = cards.posX[c]! + cards.dirX[c]! * homingStep;
      cards.posZ[c] = cards.posZ[c]! + cards.dirZ[c]! * homingStep;

      const dx = player.x - cards.posX[c]!;
      const dz = player.z - cards.posZ[c]!;
      if (dx * dx + dz * dz <= captureSq) {
        freeCard(cards, c); // "pegou de volta"
        continue;
      }
    }

    damageEnemiesTouching(world, c, ability.cardRadius);
  }
}

/**
 * Arremessa 1 carta mirando o inimigo Chasing mais próximo dentro do alcance
 * efetivo. Retorna false (lançamento adiado) sem alvo, no teto de cartas em
 * voo ou com o pool técnico cheio.
 */
function tryLaunchCard(world: World, ability: CardsAbility): boolean {
  const { player, enemies, cards, stats } = world;

  if (cards.count >= ability.maxLive) return false;

  const rangeSq = stats.abilityRange * stats.abilityRange;
  let targetIndex = -1;
  let bestSq = Number.POSITIVE_INFINITY;
  for (let i = 0; i < enemies.count; i++) {
    if (enemies.state[i] !== EnemyState.Chasing) continue;
    const dx = enemies.posX[i]! - player.x;
    const dz = enemies.posZ[i]! - player.z;
    const distSq = dx * dx + dz * dz;
    // Borda do alcance inclusiva; empate exato fica com o PRIMEIRO do pool
    // (mesma regra de desempate da mordida, como manda o GDD).
    if (distSq > rangeSq || distSq >= bestSq) continue;
    bestSq = distSq;
    targetIndex = i;
  }
  if (targetIndex < 0) return false;

  const index = allocCard(cards);
  if (index < 0) return false;

  const toTargetX = enemies.posX[targetIndex]! - player.x;
  const toTargetZ = enemies.posZ[targetIndex]! - player.z;
  const dist = Math.hypot(toTargetX, toTargetZ);
  // Alvo em cima do player: arremessa na direção do facing (sempre unitário).
  const dirX = dist > MIN_AIM_DISTANCE ? toTargetX / dist : player.facingX;
  const dirZ = dist > MIN_AIM_DISTANCE ? toTargetZ / dist : player.facingZ;

  cards.posX[index] = player.x;
  cards.posZ[index] = player.z;
  cards.prevX[index] = player.x;
  cards.prevZ[index] = player.z;
  cards.dirX[index] = dirX;
  cards.dirZ[index] = dirZ;

  world.events.push({ type: 'cardFired' });
  return true;
}

/**
 * Dano por contato da carta `c` em qualquer fase: colisão por soma de raios
 * (`cardRadius + radius do TIPO`, por inimigo no loop), sem limite de
 * perfuração. Inimigo atingido ganha a janela `PROJECTILE_HIT_COOLDOWN` e não
 * leva dano de nenhuma carta enquanto ela corre. Acertos pelo pipeline comum
 * (crit → dano → knockback → morte); o lote emite UM `enemyHit` por carta por
 * tick (count = feridos por esta carta neste tick) antes dos `enemyDied`s.
 */
function damageEnemiesTouching(world: World, c: number, cardRadius: number): void {
  const { enemies, cards, data } = world;
  const cardX = cards.posX[c]!;
  const cardZ = cards.posZ[c]!;
  const types = data.enemyTypes;

  beginHitBatch();
  for (let i = 0; i < enemies.count; i++) {
    if (enemies.state[i] !== EnemyState.Chasing) continue;
    if (enemies.projectileHitCooldown[i]! > 0) continue;
    const hitRadius = cardRadius + types[enemies.typeIndex[i]!]!.radius;
    const dx = enemies.posX[i]! - cardX;
    const dz = enemies.posZ[i]! - cardZ;
    if (dx * dx + dz * dz > hitRadius * hitRadius) continue;

    applyAbilityHit(world, i);
    enemies.projectileHitCooldown[i] = PROJECTILE_HIT_COOLDOWN;
  }
  emitHitBatch(world);
}
