import { describe, expect, it } from 'vitest';
import { SIM_DT } from '../tick';
import {
  baseEnemyType,
  characterById,
  cloneGameData,
  disableSpawn,
  makeTestWorld,
  placeEnemy,
  runTicks,
} from './helpers';
import type { World } from '../world';

function makeWorld(): World {
  return makeTestWorld({ data: disableSpawn(cloneGameData()) });
}

describe('dano de contato e morte do player', () => {
  it('aplica um golpe por janela de i-frames, mesmo com contato contínuo', () => {
    const world = makeWorld();
    placeEnemy(world, { x: 0.5, z: 0, hp: 1000 }); // gruda no player e não morre

    const { maxHp, contactIFrames } = characterById(world.data, 'capivara').stats;
    const { contactDamage } = baseEnemyType(world.data);

    runTicks(world, 2); // dois ticks seguidos em contato = um único golpe
    expect(world.player.hp).toBe(maxHp - contactDamage);

    runTicks(world, 30); // ainda dentro da janela de 0,6 s (36 ticks)
    expect(world.player.hp).toBe(maxHp - contactDamage);

    // Janela vencida (folga de ponto flutuante): exatamente um segundo golpe.
    const windowTicks = Math.round(contactIFrames / SIM_DT);
    runTicks(world, windowTicks - 30 + 4);
    expect(world.player.hp).toBe(maxHp - 2 * contactDamage);
  });

  it('hp zerado: state dead, status gameOver e evento playerDied', () => {
    const world = makeWorld();
    world.player.hp = baseEnemyType(world.data).contactDamage; // um golpe mata
    placeEnemy(world, { x: 0.5, z: 0, hp: 1000 });

    runTicks(world, 1);

    expect(world.player.hp).toBe(0);
    expect(world.player.state).toBe('dead');
    expect(world.status).toBe('gameOver');
    expect(world.events).toContainEqual({ type: 'playerDied' });
  });

  it('após gameOver os ticks não avançam a simulação', () => {
    const world = makeWorld();
    world.player.hp = baseEnemyType(world.data).contactDamage;
    const index = placeEnemy(world, { x: 0.5, z: 0, hp: 1000 });

    runTicks(world, 1);
    expect(world.status).toBe('gameOver');

    const tickCount = world.tickCount;
    const time = world.time;
    const playerX = world.player.x;
    const playerZ = world.player.z;
    const enemyX = world.enemies.posX[index]!;
    const enemyZ = world.enemies.posZ[index]!;

    runTicks(world, 10, { moveX: 1, moveZ: 1 }); // input é ignorado após o fim

    expect(world.tickCount).toBe(tickCount);
    expect(world.time).toBe(time);
    expect(world.player.x).toBe(playerX);
    expect(world.player.z).toBe(playerZ);
    expect(world.enemies.posX[index]!).toBe(enemyX);
    expect(world.enemies.posZ[index]!).toBe(enemyZ);
  });
});
