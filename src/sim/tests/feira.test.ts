/**
 * Mapa Feira de Domingo (GDD 2026-11-19): cronograma próprio (a curva de
 * dificuldade é dado do mapa) e o comportamento novo `investida` (Carrinho):
 * ciclo mira parada (re-mirando o player) → arrancada reta na direção
 * congelada, clampada na arena.
 */
import { describe, expect, it } from 'vitest';
import { SIM_DT } from '../tick';
import { EnemyState } from '../enemyState';
import {
  cloneGameData,
  disableSpawn,
  enemyTypeById,
  makeTestWorld,
  placeEnemy,
  runTicks,
} from './helpers';

/** Mundo na feira sem spawn aleatório, pronto para posicionar inimigos à mão. */
function makeFeiraWorld() {
  const data = disableSpawn(cloneGameData());
  return makeTestWorld({ data, mapId: 'feira' });
}

/** Ticks que cobrem `seconds` de sim (arredondado pra cima). */
function ticksFor(seconds: number): number {
  return Math.ceil(seconds / SIM_DT);
}

describe('mapa feira', () => {
  it('cria mundo com o cronograma do mapa: a 1ª fase só spawna galinha', () => {
    const data = cloneGameData();
    data.spawn.baseRatePerSec = 60;
    data.spawn.rateGrowthPerMinute = 0;
    const world = makeTestWorld({ seed: 11, data, mapId: 'feira' });
    const galinhaIndex = data.enemyTypes.findIndex((type) => type.id === 'galinha');

    runTicks(world, 60); // 1 s — dentro da fase 0 (galinha 100)
    expect(world.enemies.count).toBeGreaterThan(0);
    for (let i = 0; i < world.enemies.count; i++) {
      expect(world.enemies.typeIndex[i]).toBe(galinhaIndex);
    }
  });

  it('mapId e arena vêm do mapa escolhido', () => {
    const world = makeFeiraWorld();
    expect(world.mapId).toBe('feira');
    expect(world.arenaHalfSize).toBe(60);
  });
});

describe('comportamento investida (Carrinho de Feira)', () => {
  const carrinhoBehavior = () => {
    const behavior = enemyTypeById(cloneGameData(), 'carrinho').behavior;
    if (behavior.kind !== 'investida') throw new Error('carrinho deveria ser investida');
    return behavior;
  };

  it('no windup fica parado re-mirando o player; na arrancada anda reto', () => {
    const world = makeFeiraWorld();
    const behavior = carrinhoBehavior();
    // hp alto: a mordida automática da capivara não pode matar o alvo.
    const index = placeEnemy(world, { x: 10, z: 0, typeId: 'carrinho', hp: 1e6 });

    // Metade do windup: não saiu do lugar e a mira aponta pro player (-1, 0).
    runTicks(world, ticksFor(behavior.windup / 2));
    expect(world.enemies.posX[index]).toBeCloseTo(10, 5);
    expect(world.enemies.posZ[index]).toBeCloseTo(0, 5);
    expect(world.enemies.dirX[index]).toBeCloseTo(-1, 5);
    expect(world.enemies.dirZ[index]).toBeCloseTo(0, 5);

    // Completa o windup e meia arrancada: andou na direção da mira.
    const before = world.enemies.posX[index]!;
    runTicks(world, ticksFor(behavior.windup / 2) + ticksFor(behavior.chargeTime / 2));
    expect(world.enemies.posX[index]!).toBeLessThan(before - 1);
    expect(world.enemies.posZ[index]).toBeCloseTo(0, 4);
  });

  it('a direção fica CONGELADA durante a arrancada (mover o player não vira o carrinho)', () => {
    const world = makeFeiraWorld();
    const behavior = carrinhoBehavior();
    const index = placeEnemy(world, { x: 10, z: 0, typeId: 'carrinho', hp: 1e6 });

    // Passa do windup: mira congelada em (-1, 0).
    runTicks(world, ticksFor(behavior.windup) + 2);
    // Teleporta o player pro lado: se a arrancada re-mirasse, z mudaria.
    world.player.x = 10;
    world.player.z = 30;
    world.player.prevX = 10;
    world.player.prevZ = 30;

    runTicks(world, ticksFor(behavior.chargeTime / 2));
    expect(world.enemies.dirX[index]).toBeCloseTo(-1, 5);
    expect(world.enemies.dirZ[index]).toBeCloseTo(0, 5);
    expect(world.enemies.posZ[index]).toBeCloseTo(0, 4);
  });

  it('a arrancada clampa na borda da arena (não sai do chão)', () => {
    const world = makeFeiraWorld();
    const type = enemyTypeById(world.data, 'carrinho');
    // Player perto da borda: a mira aponta pra +x e a arrancada passaria dela.
    world.player.x = 58;
    world.player.prevX = 58;
    const index = placeEnemy(world, { x: 52, z: 0, typeId: 'carrinho', hp: 1e6 });

    // Alguns ciclos completos: mesmo exagerando, nunca além do limite.
    runTicks(world, ticksFor(5));
    const limit = world.arenaHalfSize - type.radius;
    expect(world.enemies.posX[index]!).toBeLessThanOrEqual(limit + 1e-4);
    expect(world.enemies.state[index]).toBe(EnemyState.Chasing);
  });
});
