import { describe, expect, it } from 'vitest';
import { SIM_DT, tick } from '../tick';
import type { World } from '../world';
import { EnemyState } from '../enemyState';
import { PROJECTILE_HIT_COOLDOWN } from '../../data/characters';
import { chooseUpgrade } from '../upgrades';
import { baseEnemyType, cloneGameData, makeTestWorld } from './helpers';

/**
 * Simulação de balanceamento sem tela, pelas métricas do GDD ("Balanceamento
 * do trio", FECHADO em 2026-11-18), com a mordida de ALVO ÚNICO:
 *
 * 1. Identidade por ativação (primária, horda padrão): capivara com cooldown
 *    segurado em 0 por falta de alvo em <= 30% do tempo; carteiro com >= 50%
 *    dos arremessos com 2+ acertos (ida+volta); churrasqueiro com média >= 3
 *    inimigos por pulso após o 1º minuto.
 * 2. Vazão (estresse): SATURAÇÃO DA OFERTA >= 90% para os kits de área
 *    (carteiro, churrasqueiro). A capivara fica FORA da régua de vazão de
 *    propósito (identidade de alvo único; kills dela são característica, não
 *    alvo). Faixas em % da capivara e ordem churrasqueiro × carteiro foram
 *    APOSENTADAS (mediam taxa de spawn; a ordem é ruído — virou hipótese para
 *    jogadas humanas).
 * 3. Viabilidade (piso, horda padrão): DPS >= 90% do TETO TEÓRICO de alvo
 *    único do próprio kit (dano ÷ cooldown; cartas contam ida+volta).
 *
 * Cenário comum aos dois modos: player parado, dano de contato neutralizado
 * para isolar a ofensa, mesmo bot para os três (sempre o 1º panfleto), seed 42.
 *
 * As asserções são só de sanidade e de ordenação robusta — os NÚMEROS saem no
 * log e voltam para o game-designer; limiar fino aqui viraria teste frágil.
 * Limite conhecido do cenário (GDD): sem colisão entre inimigos a horda
 * converge num bolo de densidade irrealista — o resultado vale como ordenação
 * e ordem de grandeza, não como número fino.
 */

const RUN_SECONDS = 180;
const BALANCE_SEED = 42;

/**
 * CENÁRIO CONGELADO (GDD "Proteção das métricas fechadas", 2026-11-18): este
 * teste constrói o próprio GameData pinando mix de 100% Cone Revoltado (stats
 * vigentes) e a CURVA ANTIGA — base 1,5/s na horda padrão (25/s no estresse) e
 * crescimento 3,0/min. A tabela real mudou para 2,0/4,5 e este cenário NÃO
 * acompanha: as réguas do trio medem as HABILIDADES; seguir a tabela reabriria
 * o balanceamento fechado a cada ajuste de curva. Balancear a CURVA é cenário
 * próprio (difficulty.sim.test.ts), nunca este.
 */
const FROZEN_BASE_RATE_PER_SEC = 1.5;
const FROZEN_RATE_GROWTH_PER_MINUTE = 3.0;

/**
 * Spawn do cenário de estresse (inimigos/s base; o crescimento por minuto da
 * tabela continua valendo). CALIBRADO em 2026-11-18 pelo critério objetivo do
 * GDD: com a capivara (alvo único, ~1,25 mordidas/s, 2 mordidas por kill), a
 * população de vivos CRESCE ao longo da run em vez de estabilizar — com 25/s a
 * população sobe monotonicamente até o teto do pool (`enemies.maxAlive` = 600,
 * atingido em ~27 s) e fica cravada nele até o fim; a oferta supera a
 * capacidade de matar da capivara durante a run inteira (o ponto de partida
 * `spawn=25` do TECH já satisfaz o critério; não foi preciso subir).
 */
const STRESS_SPAWN_RATE = 25;

/** Janela (s) para a média da população de vivos e checagem de crescimento. */
const ALIVE_WINDOW_SECONDS = 30;

interface RunReport {
  characterId: string;
  kills: number;
  approxDps: number;
  level: number;
  aliveSeconds: number;
  /** Disparos da habilidade (biteFired/cardFired/smokeFired). */
  shots: number;
  /** Fração do tempo com o cooldown segurado em 0 por falta de alvo. */
  heldCooldownFraction: number;
  /** Média de vivos (Spawning+Chasing) por janela de 30 s, em ordem. */
  aliveWindowAverages: number[];
  /** Média de vivos na run inteira. */
  aliveAverage: number;
  /** Vivos no último tick. */
  aliveFinal: number;
  /** Carteiro: fração dos arremessos CONCLUÍDOS com 2+ acertos (ida+volta). */
  multiHitThrowFraction: number | null;
  /** Churrasqueiro: média de inimigos atingidos por pulso após o 1º minuto. */
  avgHitsPerPulseAfterFirstMinute: number | null;
}

/** Vivos = Spawning + Chasing (Dying é corpo à espera do orbe). */
function countAlive(world: World): number {
  let alive = 0;
  for (let i = 0; i < world.enemies.count; i++) {
    if (world.enemies.state[i] !== EnemyState.Dying) alive++;
  }
  return alive;
}

/** Inimigos Chasing ou recém-mortos neste tick dentro do raio efetivo do pulso. */
function countPulseHits(world: World): number {
  const { enemies, player, stats } = world;
  const rangeSq = stats.abilityRange * stats.abilityRange;
  let hits = 0;
  for (let i = 0; i < enemies.count; i++) {
    const state = enemies.state[i]!;
    const freshDead = state === EnemyState.Dying && enemies.stateTime[i] === 0;
    if (state !== EnemyState.Chasing && !freshDead) continue;
    const dx = enemies.posX[i]! - player.x;
    const dz = enemies.posZ[i]! - player.z;
    if (dx * dx + dz * dz <= rangeSq) hits++;
  }
  return hits;
}

/**
 * Rastreador de acertos POR ARREMESSO do carteiro, de fora da sim (a sim não
 * guarda identidade de arremesso). Identidade: há no máximo 1 lançamento por
 * tick, então a idade de cada carta em voo (em ticks) é única — uma carta deste
 * tick com idade N é a mesma do tick anterior com idade N-1; idade 1 é
 * arremesso novo. Acerto fresco: inimigo cujo `projectileHitCooldown` terminou
 * o tick EXATAMENTE no valor recém-armado — comparado em float32
 * (`Math.fround`), porque o pool guarda em `Float32Array` (atribuição à carta
 * mais próxima — aproximação: com 2+ cartas sobrepostas no mesmo inimigo, o
 * acerto pode ir à carta errada; raro e sem efeito na ordem de grandeza).
 */
const FRESH_HIT_COOLDOWN = Math.fround(PROJECTILE_HIT_COOLDOWN);

class CardThrowTracker {
  private byAgeTicks = new Map<number, { hits: number }>();
  /** Todos os arremessos vistos (em voo contam com os acertos até aqui). */
  readonly throws: { hits: number }[] = [];

  afterTick(world: World): void {
    const { cards, enemies } = world;
    const next = new Map<number, { hits: number }>();
    for (let c = 0; c < cards.count; c++) {
      const ageTicks = Math.round(cards.age[c]! / SIM_DT);
      const carried = this.byAgeTicks.get(ageTicks - 1);
      const record = carried ?? { hits: 0 };
      if (carried === undefined) this.throws.push(record);
      next.set(ageTicks, record);
    }
    this.byAgeTicks = next;

    for (let i = 0; i < enemies.count; i++) {
      if (enemies.projectileHitCooldown[i] !== FRESH_HIT_COOLDOWN) continue;
      const record = this.nearestCardRecord(world, i, next);
      if (record !== null) record.hits++;
    }
  }

  private nearestCardRecord(
    world: World,
    enemyIndex: number,
    live: Map<number, { hits: number }>,
  ): { hits: number } | null {
    const { cards, enemies } = world;
    let best: { hits: number } | null = null;
    let bestSq = Infinity;
    for (let c = 0; c < cards.count; c++) {
      const dx = enemies.posX[enemyIndex]! - cards.posX[c]!;
      const dz = enemies.posZ[enemyIndex]! - cards.posZ[c]!;
      const distSq = dx * dx + dz * dz;
      if (distSq >= bestSq) continue;
      bestSq = distSq;
      best = live.get(Math.round(cards.age[c]! / SIM_DT)) ?? null;
    }
    return best;
  }
}

function simulateRun(characterId: string, spawnRatePerSec?: number): RunReport {
  const data = cloneGameData();
  // Cenário congelado: mix fixo de 100% Cone + curva antiga (ver constantes).
  // A curva é dado do mapa (2026-11-19): congela no mapa padrão dos testes.
  data.maps.find((map) => map.id === 'cidade')!.spawnSchedule = [
    { fromTime: 0, weights: { cone: 1 } },
  ];
  data.spawn.baseRatePerSec = spawnRatePerSec ?? FROZEN_BASE_RATE_PER_SEC;
  data.spawn.rateGrowthPerMinute = FROZEN_RATE_GROWTH_PER_MINUTE;
  const world: World = makeTestWorld({ seed: BALANCE_SEED, data, characterId });
  const isCarteiro = world.ability.kind === 'cartas';
  const isChurrasqueiro = world.ability.kind === 'fumaca';

  let kills = 0;
  let shots = 0;
  let heldTicks = 0;
  let aliveSum = 0;
  let aliveFinal = 0;
  let windowSum = 0;
  let windowTicks = 0;
  const aliveWindowAverages: number[] = [];
  let pulseHitsAfterFirstMinute = 0;
  let pulsesAfterFirstMinute = 0;
  const cardTracker = isCarteiro ? new CardThrowTracker() : null;

  const ticks = Math.round(RUN_SECONDS / SIM_DT);
  const windowTickCount = Math.round(ALIVE_WINDOW_SECONDS / SIM_DT);
  for (let i = 0; i < ticks && world.status === 'running'; i++) {
    tick(world, { moveX: 0, moveZ: 0 }, SIM_DT);

    let firedThisTick = false;
    for (const event of world.events) {
      if (event.type === 'enemyDied') kills++;
      if (
        event.type === 'biteFired' ||
        event.type === 'cardFired' ||
        event.type === 'smokeFired'
      ) {
        shots++;
        firedThisTick = true;
        if (isChurrasqueiro && world.time > 60) {
          pulsesAfterFirstMinute++;
          pulseHitsAfterFirstMinute += countPulseHits(world);
        }
      }
    }
    // Cooldown vencido e nenhum disparo = segurado em 0 por falta de alvo
    // (nas cartas, também por teto de voo — não ocorre com o player parado).
    if (!firedThisTick && world.player.abilityCooldown === 0) heldTicks++;

    cardTracker?.afterTick(world);

    aliveFinal = countAlive(world);
    aliveSum += aliveFinal;
    windowSum += aliveFinal;
    windowTicks++;
    if (windowTicks === windowTickCount) {
      aliveWindowAverages.push(windowSum / windowTicks);
      windowSum = 0;
      windowTicks = 0;
    }

    // Neutraliza a ofensa dos inimigos para a run medir a ofensa da
    // habilidade, não a sobrevivência. (Era `contactDamage = 1e-6` na tabela;
    // o piso CONTACT_DAMAGE_MIN da leva de armor transformaria isso em 1 de
    // dano real, então o cenário passou a restaurar o HP por tick — efeito
    // idêntico nas métricas de ofensa, que não dependem do HP do player.)
    world.player.hp = world.stats.maxHp;

    while (world.upgradeChoice !== null) chooseUpgrade(world, 0);
  }

  const throws = cardTracker?.throws ?? null;
  return {
    characterId,
    kills,
    approxDps: (kills * baseEnemyType(world.data).maxHp) / world.time,
    level: world.player.level,
    aliveSeconds: world.time,
    shots,
    heldCooldownFraction: heldTicks / world.tickCount,
    aliveWindowAverages,
    aliveAverage: aliveSum / world.tickCount,
    aliveFinal,
    multiHitThrowFraction:
      throws === null || throws.length === 0
        ? null
        : throws.filter((record) => record.hits >= 2).length / throws.length,
    avgHitsPerPulseAfterFirstMinute:
      isChurrasqueiro && pulsesAfterFirstMinute > 0
        ? pulseHitsAfterFirstMinute / pulsesAfterFirstMinute
        : null,
  };
}

function pct(ratio: number): string {
  return `${(ratio * 100).toFixed(0)}%`;
}

function formatReport(report: RunReport): string {
  return (
    `${report.characterId}: ${report.kills} kills, ~${report.approxDps.toFixed(1)} DPS, ` +
    `nível ${report.level}, ${report.shots} disparos, ` +
    `vivos méd ${report.aliveAverage.toFixed(0)} / final ${report.aliveFinal}`
  );
}

/**
 * Saturação da oferta: fração dos inimigos OFERTADOS na run que o personagem
 * abateu. Ofertados = kills + vivos ao final (todo spawn ou morreu ou está em
 * tela; com o pool cheio o spawn para, então a oferta de quem não mata é menor).
 */
function offerSaturation(report: RunReport): number {
  return report.kills / (report.kills + report.aliveFinal);
}

/** Teto teórico de DPS de alvo único do kit (dano ÷ cooldown; cartas ida+volta). */
function kitCeilingDps(characterId: string): number {
  const character = cloneGameData().characters.find((c) => c.id === characterId);
  if (character === undefined) throw new Error(`personagem desconhecido: ${characterId}`);
  const ability = character.ability;
  const damagePerShot = ability.kind === 'cartas' ? ability.damage * 2 : ability.damage;
  return damagePerShot / ability.cooldown;
}

describe('balanceamento do trio — métricas do GDD 2026-11-18 (fechamento)', () => {
  it('estresse (spawn calibrado): saturação da oferta >= 90% para os kits de área', () => {
    const capivara = simulateRun('capivara', STRESS_SPAWN_RATE);
    const carteiro = simulateRun('carteiro', STRESS_SPAWN_RATE);
    const churrasqueiro = simulateRun('churrasqueiro', STRESS_SPAWN_RATE);

    // eslint-disable-next-line no-console -- relatório de balanceamento
    console.log(
      `[balance:estresse spawn=${STRESS_SPAWN_RATE} seed=${BALANCE_SEED}]\n` +
        `  ${formatReport(capivara)}\n  ${formatReport(carteiro)}\n` +
        `  ${formatReport(churrasqueiro)}\n` +
        `  saturação da oferta — carteiro: ${pct(offerSaturation(carteiro))} | ` +
        `churrasqueiro: ${pct(offerSaturation(churrasqueiro))} (alvo: >= 90%; ` +
        `capivara fora da régua de vazão: ${capivara.kills} kills, característica)\n` +
        `  vivos capivara por janela de 30 s: ` +
        capivara.aliveWindowAverages.map((avg) => avg.toFixed(0)).join(' → '),
    );

    for (const report of [capivara, carteiro, churrasqueiro]) {
      expect(report.kills).toBeGreaterThan(0);
      expect(report.shots).toBeGreaterThan(0);
      expect(report.aliveSeconds).toBeCloseTo(RUN_SECONDS, 0);
    }

    // Critério objetivo da calibração (GDD): com a capivara, a população de
    // vivos CRESCE ao longo da run (oferta > capacidade). O teto do pool
    // (enemies.maxAlive) limita o crescimento: as janelas sobem até o teto e
    // nunca caem — a 1ª janela fica bem abaixo da última.
    const windows = capivara.aliveWindowAverages;
    expect(windows[0]!).toBeLessThan(windows[windows.length - 1]! * 0.75);
    for (let w = 1; w < windows.length; w++) {
      expect(windows[w]!).toBeGreaterThanOrEqual(windows[w - 1]! * 0.99);
    }
    expect(capivara.aliveFinal).toBeGreaterThan(windows[0]!);

    // Critério de vazão do GDD fechado: kits de área saturam a oferta. A ponta
    // churrasqueiro × carteiro NÃO é asserida (ruído ±0,1% — aposentada, virou
    // hipótese para jogadas humanas); a capivara está fora da régua de vazão
    // de propósito (só sanidade estrita de que os kits de área limpam mais).
    expect(offerSaturation(carteiro)).toBeGreaterThanOrEqual(0.9);
    expect(offerSaturation(churrasqueiro)).toBeGreaterThanOrEqual(0.9);
    expect(carteiro.kills).toBeGreaterThan(capivara.kills);
    expect(churrasqueiro.kills).toBeGreaterThan(capivara.kills);
  });

  it('horda padrão: piso de viabilidade (DPS >= 90% do teto do próprio kit) e identidade', () => {
    const capivara = simulateRun('capivara');
    const carteiro = simulateRun('carteiro');
    const churrasqueiro = simulateRun('churrasqueiro');
    const floorRatio = (report: RunReport): number =>
      report.approxDps / kitCeilingDps(report.characterId);

    // eslint-disable-next-line no-console -- relatório de balanceamento
    console.log(
      `[balance:horda-padrao seed=${BALANCE_SEED}]\n` +
        `  ${formatReport(capivara)}\n  ${formatReport(carteiro)}\n` +
        `  ${formatReport(churrasqueiro)}\n` +
        `  piso (DPS ÷ teto teórico do kit) — capivara: ${pct(floorRatio(capivara))} | ` +
        `carteiro: ${pct(floorRatio(carteiro))} | ` +
        `churrasqueiro: ${pct(floorRatio(churrasqueiro))} (alvo: >= 90%)\n` +
        `  identidade — capivara cooldown segurado: ` +
        `${pct(capivara.heldCooldownFraction)} (alvo: <= 30%) | ` +
        `carteiro arremessos com 2+ acertos: ` +
        `${pct(carteiro.multiHitThrowFraction ?? 0)} (alvo: >= 50%) | ` +
        `churrasqueiro inimigos/pulso após 1º min: ` +
        `${(churrasqueiro.avgHitsPerPulseAfterFirstMinute ?? 0).toFixed(1)} (alvo: >= 3)`,
    );

    for (const report of [capivara, carteiro, churrasqueiro]) {
      expect(report.kills).toBeGreaterThan(0);
      expect(report.shots).toBeGreaterThan(0);
      expect(report.aliveSeconds).toBeCloseTo(RUN_SECONDS, 0);
    }

    // Sanidade das métricas de identidade (frações válidas e medidas).
    expect(capivara.heldCooldownFraction).toBeGreaterThanOrEqual(0);
    expect(capivara.heldCooldownFraction).toBeLessThanOrEqual(1);
    expect(carteiro.multiHitThrowFraction).not.toBeNull();
    expect(churrasqueiro.avgHitsPerPulseAfterFirstMinute).not.toBeNull();

    // Piso de viabilidade do GDD fechado: cada kit entrega >= 90% do próprio
    // teto teórico de alvo único (pega kit quebrado sem comparar personagens).
    expect(floorRatio(capivara)).toBeGreaterThanOrEqual(0.9);
    expect(floorRatio(carteiro)).toBeGreaterThanOrEqual(0.9);
    expect(floorRatio(churrasqueiro)).toBeGreaterThanOrEqual(0.9);
  });
});
