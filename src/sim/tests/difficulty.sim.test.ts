import { describe, expect, it } from 'vitest';
import { SIM_DT, tick } from '../tick';
import type { InputFrame } from '../tick';
import type { World } from '../world';
import { EnemyState } from '../enemyState';
import { chooseUpgrade } from '../upgrades';
import { makeTestWorld } from './helpers';

/**
 * Cenário da CURVA de dificuldade (GDD "Curva de dificuldade" — "Veredito
 * pós-medição" e "Guardas de regressão", 2026-11-18) — separado do cenário
 * CONGELADO do trio (balance.sim.test.ts). Dois modos:
 *
 * 1. GUARDAS DE REGRESSÃO (contato LIGADO, curva e mix reais, seed 42): o bot
 *    é proxy fraco declarado (idle é jogador degenerado; orbit fecha o círculo
 *    sobre o próprio rastro), então as faixas guardam o MODELO — quem governa
 *    a morte do bot é o contato (1º contato ~7,9 s + engolfado ~7,5 s), não o
 *    spawn. Fora da faixa = mudou anel, velocidade do Cone ou modelo de
 *    contato. O critério que decide a curva é HUMANO (playtest, GDD).
 *    - idle (capivara): morre entre 10 e 30 s.
 *    - orbit: morre entre 45 e 120 s, e os TRÊS personagens caem na mesma
 *      faixa (a morte é dominada pelo contato, não pela vazão do kit).
 *
 * 2. CENÁRIO SEM CONTATO (bot imortal, curva e mix reais, 7 min, seed 42):
 *    cobre os critérios que a morte precoce do bot esconde — encontros do
 *    Pombo (>= 1/min no idle nas faixas em que spawna; < 0,2/min no orbit) e
 *    level-ups aos 5 min <= 16 (GDD, seções "Inimigos" e "Curva").
 *
 * O fino sai no console.log para o game-designer.
 */

const DIFFICULTY_SEED = 42;

/** Teto da run no teste: acima do limite de 10 min do GDD, com folga. */
const MAX_RUN_SECONDS = 660;

/**
 * Raio do círculo do bot orbit (u). Medido com raios 10/16/22: quanto maior,
 * mais o bot sobrevive (10 → ~29 s; 16 → ~34 s; 22 → ~70 s na seed 42); 22 é
 * o kiting mais competente que cabe na arena com o anel de spawn (24–32)
 * ainda em volta. Limitação declarada do bot: o círculo fecha sobre o próprio
 * rastro de perseguidores a cada volta (~17 s) — um humano kita em espiral
 * aberta e deve durar mais.
 */
const ORBIT_RADIUS = 22;

/** Ganho da correção radial do orbit (fração do input dedicada a voltar ao raio). */
const ORBIT_RADIAL_GAIN = 0.6;

const IDLE_INPUT: InputFrame = { moveX: 0, moveZ: 0 };

/**
 * Input roteirizado do orbit: tangente ao círculo (sentido anti-horário) +
 * correção radial proporcional ao erro de raio, normalizado. Determinístico:
 * função só da posição atual do player.
 */
function orbitInput(world: World): InputFrame {
  const { x, z } = world.player;
  const r = Math.hypot(x, z);
  if (r < 1e-3) return { moveX: 1, moveZ: 0 }; // sai do centro para a órbita

  const ux = x / r;
  const uz = z / r;
  const radialError = (ORBIT_RADIUS - r) / ORBIT_RADIUS;
  // Tangente (-uz, ux) + radial (ux, uz) escalada pelo erro.
  const mx = -uz + ux * radialError * ORBIT_RADIAL_GAIN;
  const mz = ux + uz * radialError * ORBIT_RADIAL_GAIN;
  const len = Math.hypot(mx, mz);
  return { moveX: mx / len, moveZ: mz / len };
}

interface BotReport {
  characterId: string;
  bot: 'idle' | 'orbit';
  died: boolean;
  /** Tempo simulado ao morrer (ou MAX_RUN_SECONDS se sobreviveu). */
  survivedSeconds: number;
  kills: number;
  level: number;
}

function runBot(characterId: string, bot: 'idle' | 'orbit'): BotReport {
  const world = makeTestWorld({ seed: DIFFICULTY_SEED, characterId });
  let kills = 0;

  const maxTicks = Math.round(MAX_RUN_SECONDS / SIM_DT);
  for (let i = 0; i < maxTicks && world.status === 'running'; i++) {
    tick(world, bot === 'idle' ? IDLE_INPUT : orbitInput(world), SIM_DT);
    for (const event of world.events) {
      if (event.type === 'enemyDied') kills++;
    }
    // Bot de panfleto: sempre a 1ª opção (mesma convenção do cenário do trio).
    while (world.upgradeChoice !== null) chooseUpgrade(world, 0);
  }

  return {
    characterId,
    bot,
    died: world.status === 'gameOver',
    survivedSeconds: world.time,
    kills,
    level: world.player.level,
  };
}

function formatReport(report: BotReport): string {
  const fate = report.died
    ? `morreu aos ${report.survivedSeconds.toFixed(1)} s`
    : `sobreviveu os ${MAX_RUN_SECONDS} s`;
  return (
    `${report.characterId}/${report.bot}: ${fate}, ` +
    `${report.kills} kills, nível ${report.level}`
  );
}

// ---------------------------------------------------------------------------
// Cenário SEM CONTATO (GDD "Cenário extra sem contato"): bot imortal, curva e
// mix reais, 7 min, seed 42, capivara.
// ---------------------------------------------------------------------------

/** Duração do cenário sem contato (s): 7 min, fixado no GDD. */
const NO_CONTACT_RUN_SECONDS = 420;

/** Instante da medição de level-ups (s): "level-ups aos 5 min <= 16" (GDD). */
const LEVEL_CHECK_SECONDS = 300;

/**
 * Início da janela de medição do Pombo (s): o cronograma o introduz aos
 * 240 s ("nas faixas em que spawna", GDD).
 */
const POMBO_WINDOW_START_SECONDS = 240;

/**
 * Definição MENSURÁVEL de "encontro" com o Pombo (o GDD diz "acerta o bot";
 * com bot imortal cercado pelo bolo, o golpe de contato formal quase sempre
 * vem do primeiro Chasing do pool em raio — um cone —, então o golpe formal
 * não mede o Pombo): encontro = BORDA DE SUBIDA do predicado "existe Pombo
 * Chasing com distância centro-a-centro <= playerRadius + raio do Pombo" (o
 * MESMO raio de toque do dano de contato — é a distância em que ele feriria o
 * player de verdade). Um pombo a 7 u/s atravessa esse disco em <= ~0,3 s,
 * então cada passada conta 1 vez; duas passadas simultâneas colapsam em 1
 * (raro e conservador para o alvo ">= 1/min").
 */
function anyPomboTouching(world: World, pomboTypeIndex: number, pomboRadius: number): boolean {
  const { enemies, player, stats } = world;
  const touchRadius = stats.playerRadius + pomboRadius;
  const touchSq = touchRadius * touchRadius;
  for (let i = 0; i < enemies.count; i++) {
    if (enemies.typeIndex[i] !== pomboTypeIndex) continue;
    if (enemies.state[i] !== EnemyState.Chasing) continue;
    const dx = enemies.posX[i]! - player.x;
    const dz = enemies.posZ[i]! - player.z;
    if (dx * dx + dz * dz <= touchSq) return true;
  }
  return false;
}

interface ImmortalReport {
  bot: 'idle' | 'orbit';
  /** Encontros com o Pombo por minuto na janela [240 s, 420 s]. */
  pomboEncountersPerMinute: number;
  pomboEncounters: number;
  /** Level-ups (nível − 1) no instante dos 5 min. */
  levelUpsAt5Min: number;
  kills: number;
  finalLevel: number;
}

function runImmortal(bot: 'idle' | 'orbit'): ImmortalReport {
  const world = makeTestWorld({ seed: DIFFICULTY_SEED, characterId: 'capivara' });
  const pomboTypeIndex = world.data.enemyTypes.findIndex((type) => type.id === 'pombo');
  const pomboRadius = world.data.enemyTypes[pomboTypeIndex]!.radius;

  let kills = 0;
  let encounters = 0;
  let touching = false;
  let levelUpsAt5Min = 0;

  const maxTicks = Math.round(NO_CONTACT_RUN_SECONDS / SIM_DT);
  for (let i = 0; i < maxTicks; i++) {
    tick(world, bot === 'idle' ? IDLE_INPUT : orbitInput(world), SIM_DT);
    // Bot IMORTAL pelo mesmo mecanismo do cenário congelado do trio: restaura
    // o HP por tick (contactDamage ~0 na tabela viraria dano 1 real pelo piso
    // CONTACT_DAMAGE_MIN). Nenhum golpe (<= 18) mata entre restaurações.
    world.player.hp = world.stats.maxHp;
    for (const event of world.events) {
      if (event.type === 'enemyDied') kills++;
    }
    while (world.upgradeChoice !== null) chooseUpgrade(world, 0);

    if (world.time <= LEVEL_CHECK_SECONDS) levelUpsAt5Min = world.player.level - 1;
    if (world.time >= POMBO_WINDOW_START_SECONDS) {
      const touchingNow = anyPomboTouching(world, pomboTypeIndex, pomboRadius);
      if (touchingNow && !touching) encounters++;
      touching = touchingNow;
    }
  }

  const windowMinutes = (NO_CONTACT_RUN_SECONDS - POMBO_WINDOW_START_SECONDS) / 60;
  return {
    bot,
    pomboEncounters: encounters,
    pomboEncountersPerMinute: encounters / windowMinutes,
    levelUpsAt5Min,
    kills,
    finalLevel: world.player.level,
  };
}

describe('curva de dificuldade — critérios do GDD (curva e mix reais, contato ligado)', () => {
  it('bot idle (capivara) morre entre 10 e 30 s — guarda do "1º contato + engolfado"', () => {
    // GDD "Curva de dificuldade", "Guardas de regressão" (medido: 17,1 s).
    const report = runBot('capivara', 'idle');

    // eslint-disable-next-line no-console -- relatório para o game-designer
    console.log(`[difficulty seed=${DIFFICULTY_SEED}]\n  ${formatReport(report)}`);

    expect(report.died).toBe(true);
    expect(report.survivedSeconds).toBeGreaterThanOrEqual(10);
    expect(report.survivedSeconds).toBeLessThanOrEqual(30);
  });

  it('bot orbit (capivara, melhor raio) morre entre 45 e 120 s', () => {
    // GDD "Curva de dificuldade", "Guardas de regressão" (medido: 70,2 s).
    const report = runBot('capivara', 'orbit');

    // eslint-disable-next-line no-console -- relatório para o game-designer
    console.log(`[difficulty seed=${DIFFICULTY_SEED}]\n  ${formatReport(report)}`);

    expect(report.died).toBe(true);
    expect(report.survivedSeconds).toBeGreaterThanOrEqual(45);
    expect(report.survivedSeconds).toBeLessThanOrEqual(120);
  });

  it('os três personagens no orbit caem na MESMA faixa 45–120 s', () => {
    // GDD "Guardas de regressão": a morte do bot é dominada pelo contato, não
    // pela vazão do kit — kit fugindo muito da faixa é achado a investigar
    // (medido: ~70 s os três na seed 42).
    const carteiro = runBot('carteiro', 'orbit');
    const churrasqueiro = runBot('churrasqueiro', 'orbit');

    // eslint-disable-next-line no-console -- relatório para o game-designer
    console.log(
      `[difficulty seed=${DIFFICULTY_SEED}]\n` +
        `  ${formatReport(carteiro)}\n  ${formatReport(churrasqueiro)}`,
    );

    for (const report of [carteiro, churrasqueiro]) {
      expect(report.died).toBe(true);
      expect(report.survivedSeconds).toBeGreaterThanOrEqual(45);
      expect(report.survivedSeconds).toBeLessThanOrEqual(120);
    }
  });
});

// Cache dos runs imortais: 2 runs de 7 min servem aos dois testes abaixo.
let immortalCache: { idle: ImmortalReport; orbit: ImmortalReport } | null = null;
function immortalReports(): { idle: ImmortalReport; orbit: ImmortalReport } {
  immortalCache ??= { idle: runImmortal('idle'), orbit: runImmortal('orbit') };
  return immortalCache;
}

/** Timeout (ms) dos testes do cenário sem contato (runs de 7 min simulados). */
const NO_CONTACT_TEST_TIMEOUT = 120000;

describe('curva de dificuldade — cenário SEM contato (bot imortal, 7 min, capivara)', () => {
  it('Pombo pune parados: >= 1 encontro/min no idle e < 0,2/min no orbit', () => {
    // GDD "Cenário extra sem contato" + "Inimigos — Como saber se funcionou".
    const { idle, orbit } = immortalReports();

    // eslint-disable-next-line no-console -- relatório para o game-designer
    console.log(
      `[difficulty:sem-contato seed=${DIFFICULTY_SEED} 7min]\n` +
        `  idle: pombo ${idle.pomboEncounters} encontros em 3 min ` +
        `(${idle.pomboEncountersPerMinute.toFixed(2)}/min, alvo >= 1) | ` +
        `${idle.kills} kills, nível final ${idle.finalLevel}\n` +
        `  orbit: pombo ${orbit.pomboEncounters} encontros em 3 min ` +
        `(${orbit.pomboEncountersPerMinute.toFixed(2)}/min, alvo < 0,2) | ` +
        `${orbit.kills} kills, nível final ${orbit.finalLevel}`,
    );

    expect(idle.pomboEncountersPerMinute).toBeGreaterThanOrEqual(1);
    expect(orbit.pomboEncountersPerMinute).toBeLessThan(0.2);
  }, NO_CONTACT_TEST_TIMEOUT);

  it('o mix novo não dispara o XP: level-ups aos 5 min <= 16', () => {
    // GDD "Inimigos — Como saber se funcionou" (acima disso, recalibrar
    // xpValue ou baseToNext em rodada com números — não antes).
    const { idle, orbit } = immortalReports();

    // eslint-disable-next-line no-console -- relatório para o game-designer
    console.log(
      `[difficulty:sem-contato seed=${DIFFICULTY_SEED}]\n` +
        `  level-ups aos 5 min — idle: ${idle.levelUpsAt5Min} | ` +
        `orbit: ${orbit.levelUpsAt5Min} (alvo: <= 16)`,
    );

    expect(idle.levelUpsAt5Min).toBeLessThanOrEqual(16);
    expect(orbit.levelUpsAt5Min).toBeLessThanOrEqual(16);
  }, NO_CONTACT_TEST_TIMEOUT);
});
