import { describe, expect, it } from 'vitest';
import type { World } from '../world';
import { baseEnemyType, cloneGameData, makeTestWorld, mapById, runTicks } from './helpers';

interface SpawnSample {
  x: number;
  z: number;
}

/**
 * Roda `ticks` ticks registrando a posição de cada inimigo novo no tick em que
 * nasceu (recém-spawnado fica em Spawning e não se move no próprio tick).
 * Exige um cenário sem mortes: swap-remove embaralharia os índices.
 */
function collectSpawnPositions(world: World, ticks: number): SpawnSample[] {
  const samples: SpawnSample[] = [];
  for (let i = 0; i < ticks; i++) {
    const countBefore = world.enemies.count;
    runTicks(world, 1);
    for (let j = countBefore; j < world.enemies.count; j++) {
      samples.push({ x: world.enemies.posX[j]!, z: world.enemies.posZ[j]! });
    }
  }
  return samples;
}

describe('spawn de inimigos', () => {
  it('total spawnado segue a curva de taxa (±1 pelo acumulador)', () => {
    const world = makeTestWorld({ seed: 42 });
    // 6 s: nenhum inimigo (anel >= 24, velocidade 3,2) alcança a mordida; ninguém morre.
    const seconds = 6;
    runTicks(world, seconds * 60);

    const { baseRatePerSec, rateGrowthPerMinute } = world.data.spawn;
    const expected = baseRatePerSec * seconds + (rateGrowthPerMinute / 60) * (seconds ** 2 / 2);
    expect(Math.abs(world.enemies.count - expected)).toBeLessThanOrEqual(1);
    expect(world.enemies.count).toBeGreaterThan(0);
  });

  it('nunca passa de maxAlive e satura o acumulador em 1 enquanto o teto segura', () => {
    const data = cloneGameData();
    data.enemies.maxAlive = 8;
    data.spawn.baseRatePerSec = 30; // meio spawn por tick: lota o teto em 16 ticks
    data.spawn.rateGrowthPerMinute = 0;
    const world = makeTestWorld({ data, seed: 7 });

    for (let i = 0; i < 120; i++) {
      runTicks(world, 1);
      expect(world.enemies.count).toBeLessThanOrEqual(data.enemies.maxAlive);
      expect(world.spawnAccumulator).toBeLessThanOrEqual(1);
    }
    expect(world.enemies.count).toBe(data.enemies.maxAlive);
    expect(world.spawnAccumulator).toBe(1);
  });

  it('spawna no anel [ringMin, ringMax] ao redor do player', () => {
    const data = cloneGameData();
    data.spawn.baseRatePerSec = 10;
    data.spawn.rateGrowthPerMinute = 0;
    for (const type of data.enemyTypes) type.maxHp = 1e6; // ninguém morre: índices estáveis
    const world = makeTestWorld({ data, seed: 99 });

    const samples = collectSpawnPositions(world, 300); // player parado na origem
    expect(samples.length).toBeGreaterThan(20);

    for (const sample of samples) {
      const distance = Math.hypot(sample.x, sample.z);
      expect(distance).toBeGreaterThanOrEqual(data.spawn.ringMinRadius - 1e-3);
      expect(distance).toBeLessThanOrEqual(data.spawn.ringMaxRadius + 1e-3);
    }
  });

  it('clampa o spawn na borda da arena quando o anel sai dela', () => {
    const data = cloneGameData();
    data.spawn.baseRatePerSec = 10;
    data.spawn.rateGrowthPerMinute = 0;
    for (const type of data.enemyTypes) type.maxHp = 1e6;
    const world = makeTestWorld({ data, seed: 5 });
    // Player no canto: boa parte do anel cai fora da arena.
    world.player.x = 59;
    world.player.z = 59;
    const limit = mapById(data, 'cidade').arena.halfSize - baseEnemyType(data).radius;

    const samples = collectSpawnPositions(world, 240);
    expect(samples.length).toBeGreaterThan(20);

    let clampedCount = 0;
    for (const sample of samples) {
      expect(Math.abs(sample.x)).toBeLessThanOrEqual(limit + 1e-3);
      expect(Math.abs(sample.z)).toBeLessThanOrEqual(limit + 1e-3);

      const distance = Math.hypot(sample.x - world.player.x, sample.z - world.player.z);
      // Clamp projeta para dentro da arena: nunca aumenta a distância ao player.
      expect(distance).toBeLessThanOrEqual(data.spawn.ringMaxRadius + 1e-3);

      const touchedBorder =
        Math.abs(sample.x) >= limit - 1e-3 || Math.abs(sample.z) >= limit - 1e-3;
      if (touchedBorder) {
        clampedCount++;
      } else {
        expect(distance).toBeGreaterThanOrEqual(data.spawn.ringMinRadius - 1e-3);
      }
    }
    expect(clampedCount).toBeGreaterThan(0);
  });
});
