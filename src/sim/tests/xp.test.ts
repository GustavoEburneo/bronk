import { describe, expect, it } from 'vitest';
import { SIM_DT } from '../tick';
import { EnemyState } from '../enemyState';
import { xpRequiredForLevel } from '../world';
import {
  baseEnemyType,
  characterById,
  cloneGameData,
  disableSpawn,
  makeTestWorld,
  placeEnemy,
  placeOrb,
  runTicks,
} from './helpers';
import type { World } from '../world';

function makeWorld(): World {
  return makeTestWorld({ data: disableSpawn(cloneGameData()) });
}

describe('XP: orbes e level-up', () => {
  it('inimigo morto entra em Dying e dropa orbe na posição após dyingStateDuration', () => {
    const data = disableSpawn(cloneGameData());
    // Range alongado: o inimigo morre longe do ímã e o orbe fica parado no drop.
    characterById(data, 'capivara').ability.range = 10;
    const world = makeTestWorld({ data });
    const index = placeEnemy(world, { x: 5, z: 0, hp: world.ability.damage });

    runTicks(world, 1); // mordida do primeiro tick zera o HP

    expect(world.enemies.state[index]).toBe(EnemyState.Dying);
    const death = world.events.find((event) => event.type === 'enemyDied');
    if (death?.type !== 'enemyDied') throw new Error('evento enemyDied não emitido');

    // Duração nominal de 0,25 s = 15 ticks: aos 14 ainda está morrendo...
    runTicks(world, 14);
    expect(world.enemies.count).toBe(1);
    expect(world.enemies.state[index]).toBe(EnemyState.Dying);
    expect(world.orbs.count).toBe(0);

    // ...e com folga de ponto flutuante (até +17) já virou orbe onde morreu.
    runTicks(world, 3);
    expect(world.enemies.count).toBe(0);
    expect(world.orbs.count).toBe(1);
    expect(world.orbs.posX[0]!).toBeCloseTo(death.x, 4);
    expect(world.orbs.posZ[0]!).toBeCloseTo(death.z, 4);
  });

  it('coleta orbe dentro do collectRadius e soma o XP do inimigo', () => {
    const world = makeWorld();
    placeOrb(world, 0.5, 0);

    runTicks(world, 1);

    expect(world.orbs.count).toBe(0);
    expect(world.player.xp).toBe(baseEnemyType(world.data).xpValue);
  });

  it('ímã puxa orbe dentro do magnetRadius até a coleta', () => {
    const world = makeWorld();
    placeOrb(world, 2, 0); // entre collectRadius (0,8) e magnetRadius (3,5)

    runTicks(world, 1);
    const distanceAfterOneTick = Math.hypot(world.orbs.posX[0]!, world.orbs.posZ[0]!);
    expect(distanceAfterOneTick).toBeCloseTo(2 - world.data.xp.magnetSpeed * SIM_DT, 5);

    runTicks(world, 10); // 12/s percorre 1,2 restante em ~6 ticks
    expect(world.orbs.count).toBe(0);
    expect(world.player.xp).toBe(baseEnemyType(world.data).xpValue);
  });

  it('sobe de nível carregando o excedente e recalcula xpToNext', () => {
    const data = disableSpawn(cloneGameData());
    baseEnemyType(data).xpValue = data.xp.baseToNext + 2; // um orbe sobe de nível sobrando 2
    const world = makeTestWorld({ data });
    placeOrb(world, 0.5, 0);

    runTicks(world, 1);

    expect(world.player.level).toBe(2);
    expect(world.player.xp).toBe(2);
    expect(world.player.xpToNext).toBe(xpRequiredForLevel(data, 2));
    expect(world.events).toContainEqual({ type: 'levelUp', level: 2 });
  });

  it('coleta grande pode subir mais de um nível de uma vez', () => {
    const data = disableSpawn(cloneGameData());
    const costLevel1 = xpRequiredForLevel(data, 1);
    const costLevel2 = xpRequiredForLevel(data, 2);
    baseEnemyType(data).xpValue = costLevel1 + costLevel2 + 1;
    const world = makeTestWorld({ data });
    placeOrb(world, 0.5, 0);

    runTicks(world, 1);

    expect(world.player.level).toBe(3);
    expect(world.player.xp).toBe(1);
    expect(world.player.xpToNext).toBe(xpRequiredForLevel(data, 3));
    expect(world.events).toContainEqual({ type: 'levelUp', level: 2 });
    expect(world.events).toContainEqual({ type: 'levelUp', level: 3 });
  });
});
