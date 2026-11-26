import { describe, expect, it } from 'vitest';
import { SIM_DT } from '../tick';
import { validateGameData } from '../../data/validate';
import type { World } from '../world';
import { EnemyState } from '../enemyState';
import {
  baseEnemyType,
  cloneGameData,
  enemyTypeById,
  makeTestWorld,
  mapById,
  placeEnemy,
  runTicks,
} from './helpers';
import type { GameData } from '../../data/tables';
import type { SpawnPhase } from '../../data/enemies';

/** Cronograma do mapa padrão dos testes (cidade) — a curva é dado do mapa. */
function cidadeSchedule(data: GameData): SpawnPhase[] {
  const schedule = mapById(data, 'cidade').spawnSchedule;
  if (schedule === undefined) throw new Error('cidade sem spawnSchedule no teste');
  return schedule;
}

/**
 * Tabela de tipos de inimigo + cronograma de spawn (GDD "Inimigos — Avenida
 * em Obras", 2026-11-18): o tipo de cada spawn é sorteado por peso na fase
 * vigente (1 rng.next() por spawn, compilado em createWorld), e os stats
 * (hp, raio, durações, XP) saem do tipo.
 */

/** Conta os spawns por tipo durante `ticks`, lendo o typeIndex dos novos. */
function countSpawnsByType(world: World, ticks: number): Map<number, number> {
  const counts = new Map<number, number>();
  for (let i = 0; i < ticks; i++) {
    const before = world.enemies.count;
    runTicks(world, 1);
    for (let j = before; j < world.enemies.count; j++) {
      const type = world.enemies.typeIndex[j]!;
      counts.set(type, (counts.get(type) ?? 0) + 1);
    }
  }
  return counts;
}

/** Mundo de sorteio: spawn alto, pool largo, ninguém morre nem alcança o player. */
function makeRollWorld(seed: number): World {
  const data = cloneGameData();
  data.enemies.maxAlive = 4096;
  data.spawn.baseRatePerSec = 600; // satura o acumulador: ~10 spawns/tick
  data.spawn.rateGrowthPerMinute = 0;
  for (const type of data.enemyTypes) {
    type.maxHp = 1e6; // ninguém morre: índices de spawn ficam estáveis
    type.moveSpeed = 0; // ninguém encosta no player
  }
  return makeTestWorld({ seed, data });
}

describe('cronograma de spawn (sorteio ponderado por faixa de tempo)', () => {
  it('na 1ª faixa (0–60 s) todo spawn é cone', () => {
    const world = makeRollWorld(42);
    const counts = countSpawnsByType(world, 120); // 2 s de partida
    const coneIndex = world.data.enemyTypes.findIndex((type) => type.id === 'cone');

    const total = [...counts.values()].reduce((sum, n) => sum + n, 0);
    expect(total).toBeGreaterThan(500);
    expect(counts.size).toBe(1);
    expect(counts.get(coneIndex)).toBe(total);
  });

  it('a troca de faixa é instantânea no timestamp (rato só após 60 s)', () => {
    const world = makeRollWorld(7);
    // Avança o relógio até logo antes da fronteira sem rodar a sim inteira.
    world.time = 59;
    const before = countSpawnsByType(world, 30); // 59,0–59,5 s
    const after = countSpawnsByType(world, 300); // ~59,5–64,5 s
    const ratoIndex = world.data.enemyTypes.findIndex((type) => type.id === 'rato');

    expect(before.has(ratoIndex)).toBe(false);
    expect(after.get(ratoIndex) ?? 0).toBeGreaterThan(0);
  });

  it('respeita os pesos da fase vigente (55/30/15 em 150–240 s, ±5 pp)', () => {
    const world = makeRollWorld(99);
    world.time = 160;
    const counts = countSpawnsByType(world, 240); // ~2400 spawns na fase
    const types = world.data.enemyTypes;
    const total = [...counts.values()].reduce((sum, n) => sum + n, 0);
    expect(total).toBeGreaterThan(1500);

    const share = (id: string): number =>
      (counts.get(types.findIndex((type) => type.id === id)) ?? 0) / total;
    expect(share('cone')).toBeGreaterThan(0.5);
    expect(share('cone')).toBeLessThan(0.6);
    expect(share('rato')).toBeGreaterThan(0.25);
    expect(share('rato')).toBeLessThan(0.35);
    expect(share('britadeira')).toBeGreaterThan(0.1);
    expect(share('britadeira')).toBeLessThan(0.2);
    expect(share('pombo')).toBe(0); // pombo só entra aos 240 s
  });

  it('na última faixa (360 s+) os 4 tipos aparecem', () => {
    const world = makeRollWorld(5);
    world.time = 400;
    const counts = countSpawnsByType(world, 240);
    expect(counts.size).toBe(4);
  });
});

describe('stats por tipo aplicados pela sim', () => {
  it('spawn grava hp do tipo sorteado e direção normalizada spawn→player', () => {
    const data = cloneGameData();
    data.spawn.baseRatePerSec = 60;
    data.spawn.rateGrowthPerMinute = 0;
    // Mix 100% britadeira para o hp do tipo ficar observável.
    mapById(data, 'cidade').spawnSchedule = [{ fromTime: 0, weights: { britadeira: 1 } }];
    const world = makeTestWorld({ seed: 3, data });

    runTicks(world, 10);
    expect(world.enemies.count).toBeGreaterThan(0);

    const britadeira = enemyTypeById(data, 'britadeira');
    const typeIndex = data.enemyTypes.findIndex((type) => type.id === 'britadeira');
    for (let i = 0; i < world.enemies.count; i++) {
      expect(world.enemies.typeIndex[i]).toBe(typeIndex);
      expect(world.enemies.hp[i]).toBe(britadeira.maxHp);
      // Direção spawn→player (player na origem): aponta para dentro, unitária.
      const dirX = world.enemies.dirX[i]!;
      const dirZ = world.enemies.dirZ[i]!;
      expect(Math.hypot(dirX, dirZ)).toBeCloseTo(1, 5);
      const dot = dirX * world.enemies.posX[i]! + dirZ * world.enemies.posZ[i]!;
      expect(dot).toBeLessThan(0);
    }
  });

  it('durações de Spawning/Dying e XP do orbe saem do tipo (rato: 0,3/0,2/XP 1)', () => {
    const data = cloneGameData();
    data.spawn.baseRatePerSec = 0;
    data.spawn.rateGrowthPerMinute = 0;
    const world = makeTestWorld({ data });
    const rato = enemyTypeById(data, 'rato');

    const index = placeEnemy(world, { x: 5, z: 0, typeId: 'rato', state: EnemyState.Spawning });
    const spawningTicks = Math.round(rato.spawnStateDuration / SIM_DT);
    runTicks(world, spawningTicks - 2);
    expect(world.enemies.state[index]).toBe(EnemyState.Spawning);
    runTicks(world, 4);
    expect(world.enemies.state[index]).toBe(EnemyState.Chasing);

    // Mata o rato (fora do alcance da mordida: morte manual) e espera o orbe.
    world.enemies.state[index] = EnemyState.Dying;
    world.enemies.stateTime[index] = 0;
    const dyingTicks = Math.round(rato.dyingStateDuration / SIM_DT);
    runTicks(world, dyingTicks + 2);
    expect(world.enemies.count).toBe(0);
    expect(world.orbs.count).toBe(1);
    expect(world.orbs.xpValue[0]).toBe(rato.xpValue);
  });

  it('contato usa o raio e o dano do TIPO (britadeira alcança mais longe e dói 18)', () => {
    const data = cloneGameData();
    data.spawn.baseRatePerSec = 0;
    data.spawn.rateGrowthPerMinute = 0;
    for (const type of data.enemyTypes) type.moveSpeed = 0;
    const world = makeTestWorld({ data });
    const britadeira = enemyTypeById(data, 'britadeira');
    const cone = baseEnemyType(data);
    // Entre os raios de toque: toca como britadeira (0,5+0,7), não como cone
    // (0,5+0,45).
    const x = world.stats.playerRadius + (cone.radius + britadeira.radius) / 2;
    placeEnemy(world, { x, z: 0, typeId: 'britadeira', hp: 1e6 });

    const hpBefore = world.player.hp;
    runTicks(world, 1);
    expect(world.player.hp).toBe(hpBefore - britadeira.contactDamage);
  });
});

describe('validação da tabela de tipos e do cronograma', () => {
  it('a tabela oficial passa na validação', () => {
    expect(() => validateGameData(cloneGameData())).not.toThrow();
  });

  it('id de tipo duplicado é rejeitado', () => {
    const data = cloneGameData();
    data.enemyTypes[1]!.id = data.enemyTypes[0]!.id;
    expect(() => validateGameData(data)).toThrow(/duplicado/);
  });

  it('campo não finito ou <= 0 é rejeitado citando o campo', () => {
    for (const field of ['moveSpeed', 'maxHp', 'radius', 'xpValue'] as const) {
      const data = cloneGameData();
      enemyTypeById(data, 'rato')[field] = 0;
      expect(() => validateGameData(data)).toThrow(new RegExp(field));
    }
  });

  it('flyby com despawnRadius ou despawnAfter inválidos é rejeitado', () => {
    for (const field of ['despawnRadius', 'despawnAfter'] as const) {
      const data = cloneGameData();
      const behavior = enemyTypeById(data, 'pombo').behavior;
      if (behavior.kind !== 'flyby') throw new Error('pombo deveria ser flyby');
      behavior[field] = Number.NaN;
      expect(() => validateGameData(data)).toThrow(new RegExp(field));
    }
  });

  it('schedule vazio é rejeitado', () => {
    const data = cloneGameData();
    mapById(data, 'cidade').spawnSchedule = [];
    expect(() => validateGameData(data)).toThrow(/spawnSchedule/);
  });

  it('mapa jogável sem schedule é rejeitado', () => {
    const data = cloneGameData();
    delete mapById(data, 'cidade').spawnSchedule;
    expect(() => validateGameData(data)).toThrow(/precisa de spawnSchedule/);
  });

  it('schedule que não começa em fromTime 0 é rejeitado', () => {
    const data = cloneGameData();
    cidadeSchedule(data)[0]!.fromTime = 5;
    expect(() => validateGameData(data)).toThrow(/começar em 0/);
  });

  it('fromTime não estritamente crescente é rejeitado', () => {
    const data = cloneGameData();
    cidadeSchedule(data)[2]!.fromTime = cidadeSchedule(data)[1]!.fromTime;
    expect(() => validateGameData(data)).toThrow(/crescente/);
  });

  it('peso negativo é rejeitado; fase só com pesos 0 é rejeitada', () => {
    const negative = cloneGameData();
    cidadeSchedule(negative)[1]!.weights['rato'] = -1;
    expect(() => validateGameData(negative)).toThrow(/>= 0/);

    const allZero = cloneGameData();
    cidadeSchedule(allZero)[0]!.weights = { cone: 0 };
    expect(() => validateGameData(allZero)).toThrow(/soma dos pesos/);
  });

  it('peso para tipo desconhecido é rejeitado', () => {
    const data = cloneGameData();
    cidadeSchedule(data)[0]!.weights['jacare'] = 1;
    expect(() => validateGameData(data)).toThrow(/desconhecido.*jacare/);
  });
});
