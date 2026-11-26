import { describe, expect, it } from 'vitest';
import { SIM_DT } from '../tick';
import type { World } from '../world';
import { EnemyState } from '../enemyState';
import {
  cloneGameData,
  disableSpawn,
  enemyTypeById,
  makeTestWorld,
  placeEnemy,
  runTicks,
} from './helpers';

/**
 * Comportamento `flyby` (Pombo de Obra, GDD 2026-11-18): voa reto na direção
 * gravada no spawn (nunca vira) e despawna SILENCIOSO (freeEnemy direto, sem
 * Dying, sem evento, sem orbe) quando (dist ao CENTRO > despawnRadius E se
 * afastando — dir·pos > 0) OU stateTime em Chasing > despawnAfter. Morto pelo
 * jogador, morre como qualquer um: Dying normal + orbe com o XP do tipo.
 */

function makeWorld(): World {
  return makeTestWorld({ data: disableSpawn(cloneGameData()) });
}

describe('flyby (Pombo de Obra)', () => {
  it('voa reto na direção gravada e não vira para o player', () => {
    const world = makeWorld();
    const pombo = enemyTypeById(world.data, 'pombo');
    // Player na origem; direção perpendicular à linha pombo→player: um chase
    // viraria para a origem, o flyby mantém (0, 1).
    const index = placeEnemy(world, { x: 5, z: 0, typeId: 'pombo', dirX: 0, dirZ: 1, hp: 1e6 });

    runTicks(world, 30);

    expect(world.enemies.posX[index]!).toBeCloseTo(5, 4);
    expect(world.enemies.posZ[index]!).toBeCloseTo(pombo.moveSpeed * SIM_DT * 30, 3);
    // A direção gravada não muda durante o voo.
    expect(world.enemies.dirX[index]!).toBe(0);
    expect(world.enemies.dirZ[index]!).toBe(1);
  });

  it('despawna silencioso além do despawnRadius quando se AFASTANDO do centro', () => {
    const world = makeWorld();
    const pombo = enemyTypeById(world.data, 'pombo');
    // Já além do raio (40 u) e voando para fora: some no primeiro tick de IA.
    placeEnemy(world, {
      x: pombo.behavior.kind === 'flyby' ? pombo.behavior.despawnRadius + 1 : 0,
      z: 0,
      typeId: 'pombo',
      dirX: 1,
      dirZ: 0,
    });

    runTicks(world, 1);

    expect(world.enemies.count).toBe(0); // freeEnemy direto, sem Dying
    expect(world.orbs.count).toBe(0); // sem orbe de XP
    expect(world.events.some((event) => event.type === 'enemyDied')).toBe(false);
    expect(world.events.some((event) => event.type === 'enemyHit')).toBe(false);
  });

  it('recém-nascido além do raio voando PARA DENTRO não despawna (produto escalar)', () => {
    const world = makeWorld();
    // Além dos 40 u, mas com dir·pos < 0 (voando para o centro): o anel de
    // spawn é relativo ao player, então perto da borda isso acontece de fato.
    const index = placeEnemy(world, { x: 45, z: 0, typeId: 'pombo', dirX: -1, dirZ: 0, hp: 1e6 });

    runTicks(world, 30);

    expect(world.enemies.count).toBe(1);
    expect(world.enemies.posX[index]!).toBeLessThan(45); // seguiu voando para dentro
  });

  it('despawna silencioso após despawnAfter de voo, mesmo dentro do raio', () => {
    const data = disableSpawn(cloneGameData());
    const pombo = enemyTypeById(data, 'pombo');
    if (pombo.behavior.kind !== 'flyby') throw new Error('pombo deveria ser flyby');
    // Isola o gatilho de tempo: raio de despawn inalcançável e teto curto.
    pombo.behavior.despawnRadius = 1e6;
    pombo.behavior.despawnAfter = 0.5;
    const world = makeTestWorld({ data });
    // Longe da mordida (alcance 2,2) para o player não matá-lo antes.
    placeEnemy(world, { x: 10, z: 0, typeId: 'pombo', dirX: 0, dirZ: 1, hp: 1e6 });

    const ticks = Math.round(pombo.behavior.despawnAfter / SIM_DT);
    runTicks(world, ticks - 2);
    expect(world.enemies.count).toBe(1);

    runTicks(world, 4);
    expect(world.enemies.count).toBe(0);
    expect(world.orbs.count).toBe(0);
    expect(world.events.some((event) => event.type === 'enemyDied')).toBe(false);
  });

  it('o relógio de voo é o stateTime em Chasing: Spawning não conta', () => {
    const data = disableSpawn(cloneGameData());
    const pombo = enemyTypeById(data, 'pombo');
    if (pombo.behavior.kind !== 'flyby') throw new Error('pombo deveria ser flyby');
    pombo.behavior.despawnRadius = 1e6;
    pombo.behavior.despawnAfter = 0.5;
    const world = makeTestWorld({ data });
    const index = placeEnemy(world, {
      x: 10,
      z: 0,
      typeId: 'pombo',
      dirX: 0,
      dirZ: 1,
      hp: 1e6,
      state: EnemyState.Spawning,
    });

    // Passa o Spawning inteiro (0,4 s) + quase todo o teto de voo: ainda vivo.
    const spawningTicks = Math.round(pombo.spawnStateDuration / SIM_DT);
    const flightTicks = Math.round(pombo.behavior.despawnAfter / SIM_DT);
    runTicks(world, spawningTicks + flightTicks - 2);
    expect(world.enemies.count).toBe(1);
    expect(world.enemies.state[index]).toBe(EnemyState.Chasing);

    runTicks(world, 4);
    expect(world.enemies.count).toBe(0);
  });

  it('morto pelo jogador morre como qualquer um: Dying + orbe com XP do tipo', () => {
    const world = makeWorld();
    const pombo = enemyTypeById(world.data, 'pombo');
    // Dentro do alcance da mordida, com HP de 1 mordida.
    const index = placeEnemy(world, {
      x: 1,
      z: 0,
      typeId: 'pombo',
      dirX: 0,
      dirZ: 1,
      hp: world.ability.damage,
    });

    runTicks(world, 1);
    expect(world.enemies.state[index]).toBe(EnemyState.Dying);
    expect(world.events.some((event) => event.type === 'enemyDied')).toBe(true);

    // O orbe dropa a 1 u (dentro do ímã) e é coletado nos ticks seguintes:
    // o XP do player comprova o drop com o xpValue do TIPO (2, não 1).
    runTicks(world, Math.round(pombo.dyingStateDuration / SIM_DT) + 4);
    expect(world.enemies.count).toBe(0);
    expect(world.player.xp).toBe(pombo.xpValue);
  });
});
