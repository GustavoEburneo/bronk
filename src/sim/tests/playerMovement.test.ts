import { describe, expect, it } from 'vitest';
import { SIM_DT, tick } from '../tick';
import { cloneGameData, disableSpawn, makeTestWorld, runTicks } from './helpers';
import type { World } from '../world';

function makeWorld(): World {
  return makeTestWorld({ data: disableSpawn(cloneGameData()) });
}

describe('movimento do player', () => {
  it('anda moveSpeed*dt por tick na direção do input', () => {
    const world = makeWorld();
    const stepPerTick = world.stats.moveSpeed * SIM_DT;

    tick(world, { moveX: 1, moveZ: 0 }, SIM_DT);
    expect(world.player.x).toBeCloseTo(stepPerTick, 10);
    expect(world.player.z).toBe(0);

    runTicks(world, 9, { moveX: 1, moveZ: 0 });
    expect(world.player.x).toBeCloseTo(10 * stepPerTick, 10);
  });

  it('diagonal (1,1) não é mais rápida que (1,0)', () => {
    const straight = makeWorld();
    const diagonal = makeWorld();

    runTicks(straight, 60, { moveX: 1, moveZ: 0 });
    runTicks(diagonal, 60, { moveX: 1, moveZ: 1 });

    const straightDistance = Math.hypot(straight.player.x, straight.player.z);
    const diagonalDistance = Math.hypot(diagonal.player.x, diagonal.player.z);
    expect(diagonalDistance).toBeCloseTo(straightDistance, 10);
    // E a diagonal realmente dividiu o movimento entre os dois eixos.
    expect(diagonal.player.x).toBeCloseTo(diagonal.player.z, 10);
    expect(diagonal.player.x).toBeLessThan(straight.player.x);
  });

  it('é travado na borda da arena (halfSize - radius)', () => {
    const world = makeWorld();
    const limit = world.arenaHalfSize - world.stats.playerRadius;
    // Ticks de sobra para atravessar a arena inteira mesmo na diagonal.
    const ticksToCross = Math.ceil((2 * world.arenaHalfSize) / (world.stats.moveSpeed * SIM_DT));

    runTicks(world, ticksToCross, { moveX: 1, moveZ: 1 });

    expect(world.player.x).toBe(limit);
    expect(world.player.z).toBe(limit);
  });
});
