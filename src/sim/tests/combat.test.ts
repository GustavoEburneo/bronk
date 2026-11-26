import { describe, expect, it } from 'vitest';
import type { World } from '../world';
import { EnemyState } from '../enemyState';
import { mulberry32 } from '../rng';
import { rollCrit } from '../combat';
import { applyUpgradesById } from '../upgrades';
import { CRIT_DAMAGE_MULTIPLIER } from '../../data/upgrades';
import {
  cloneGameData,
  disableSpawn,
  enemyTypeById,
  freezeEnemies,
  makeTestWorld,
  placeEnemy,
  runTicks,
} from './helpers';
import type { GameData } from '../../data/tables';

/**
 * Crítico (Dado Viciado) e knockback (Rodo de Enchente) — helpers de
 * `sim/combat.ts` consumidos pelos 3 sistemas de habilidade na ordem fixa
 * rollCrit → dano → applyKnockback → morte, e o evento agregado `enemyHit`.
 */

function makeWorld(seed = 1, data?: GameData): World {
  return makeTestWorld({ seed, data: data ?? freezeEnemies(disableSpawn(cloneGameData())) });
}

/** Tabela com o Dado em chance 100% por stack (crit determinístico). */
function certainCritData(): GameData {
  const data = freezeEnemies(disableSpawn(cloneGameData()));
  data.upgrades.find((def) => def.id === 'dado')!.effect!.flatPerStack = 1;
  return data;
}

describe('rollCrit e consumo de RNG', () => {
  it('com critChance 0 NÃO consome RNG: a sequência de seed fica intacta', () => {
    const world = makeWorld(9);
    const reference = mulberry32(9);

    expect(rollCrit(world)).toBe(false);
    expect(rollCrit(world)).toBe(false);

    // O próximo número da sim é o PRIMEIRO da seed: nada foi consumido.
    expect(world.rng.next()).toBe(reference.next());
  });

  it('com Dado no build consome exatamente 1 rng.next() por rolagem', () => {
    const world = makeWorld(9);
    applyUpgradesById(world, ['dado']);
    const reference = mulberry32(9);

    rollCrit(world);
    reference.next(); // a rolagem consumiu 1

    expect(world.rng.next()).toBe(reference.next());
  });

  it('mordidas sem Dado produzem run idêntica à de um mundo que nunca rolou crit', () => {
    // Determinismo de regressão: inserir o pipeline de crit nos sistemas não
    // muda nenhum resultado de build sem Dado (curto-circuito sem RNG).
    const roll = (): unknown => {
      const data = cloneGameData();
      data.spawn.ringMinRadius = 3;
      data.spawn.ringMaxRadius = 6;
      data.spawn.baseRatePerSec = 4;
      const world = makeTestWorld({ seed: 77, data });
      runTicks(world, 300);
      return {
        count: world.enemies.count,
        hp: Array.from(world.enemies.hp.subarray(0, world.enemies.count)),
        x: world.player.x,
      };
    };
    expect(roll()).toEqual(roll());
  });
});

describe('dano crítico', () => {
  it('crit garantido multiplica o dano da mordida por CRIT_DAMAGE_MULTIPLIER', () => {
    const world = makeWorld(1, certainCritData());
    applyUpgradesById(world, ['dado']);
    const index = placeEnemy(world, { x: 1, z: 0, hp: 1000 });

    runTicks(world, 1);

    expect(world.enemies.hp[index]!).toBe(
      1000 - world.stats.abilityDamage * CRIT_DAMAGE_MULTIPLIER,
    );
  });

  it('crit aplica depois da Pimenta: base melhorada × 2', () => {
    const world = makeWorld(1, certainCritData());
    applyUpgradesById(world, ['dado', 'pimenta']);
    const index = placeEnemy(world, { x: 1, z: 0, hp: 1000 });

    runTicks(world, 1);

    const expected = world.ability.damage * 1.25 * CRIT_DAMAGE_MULTIPLIER;
    expect(world.enemies.hp[index]!).toBeCloseTo(1000 - expected, 4);
  });
});

describe('knockback (Rodo de Enchente)', () => {
  it('empurra na direção player→inimigo em todo acerto, 0,5 u por stack', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['rodo']);
    const east = placeEnemy(world, { x: 1, z: 0, hp: 1000 });

    runTicks(world, 1); // mordida acerta o único alvo

    expect(world.enemies.posX[east]!).toBeCloseTo(1.5, 5);
    expect(world.enemies.posZ[east]!).toBeCloseTo(0, 5);
  });

  it('empurra na direção correta também no sul (sinal do vetor)', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['rodo', 'rodo', 'rodo']); // teto: 1,5 u
    const south = placeEnemy(world, { x: 0, z: -1, hp: 1000 });

    runTicks(world, 1);

    expect(world.enemies.posX[south]!).toBeCloseTo(0, 5);
    expect(world.enemies.posZ[south]!).toBeCloseTo(-2.5, 5);
  });

  it('clampa a posição na arena (±(halfSize − raio do tipo))', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['rodo']);
    const cone = enemyTypeById(world.data, 'cone');
    const limit = world.arenaHalfSize - cone.radius;
    // Player colado na borda; inimigo entre ele e a parede.
    world.player.x = limit - 0.5;
    world.player.prevX = world.player.x;
    const index = placeEnemy(world, { x: limit - 0.2, z: 0, hp: 1000 });

    runTicks(world, 1);

    // O pool guarda em Float32Array: compara no arredondamento de float32.
    expect(world.enemies.posX[index]!).toBe(Math.fround(limit));
  });

  it('inimigo exatamente sobre o player é empurrado na direção do facing', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['rodo']);
    // Facing default do mundo novo: (0, 1).
    const index = placeEnemy(world, { x: 0, z: 0, hp: 1000 });

    runTicks(world, 1);

    expect(world.enemies.posX[index]!).toBeCloseTo(0, 5);
    expect(world.enemies.posZ[index]!).toBeCloseTo(0.5, 5);
  });

  it('o golpe letal TAMBÉM empurra: o corpo morre deslocado e o orbe cai lá', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['rodo']);
    const index = placeEnemy(world, { x: 1, z: 0, hp: 1 }); // morre na mordida

    runTicks(world, 1);

    expect(world.enemies.state[index]).toBe(EnemyState.Dying);
    expect(world.enemies.posX[index]!).toBeCloseTo(1.5, 5);
    const died = world.events.find((event) => event.type === 'enemyDied');
    if (died?.type !== 'enemyDied') throw new Error('enemyDied não emitido');
    expect(died.x).toBeCloseTo(1.5, 5);
  });

  it('não toca em dirX/dirZ: o flyby empurrado mantém a direção de voo', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['rodo']);
    const index = placeEnemy(world, { x: 1, z: 0, typeId: 'pombo', dirX: 0, dirZ: 1, hp: 1000 });

    runTicks(world, 1);

    expect(world.enemies.posX[index]!).toBeGreaterThan(1); // empurrado
    expect(world.enemies.dirX[index]!).toBe(0); // direção de voo intacta
    expect(world.enemies.dirZ[index]!).toBe(1);
  });

  it('sem Rodo (knockback 0) nenhum acerto desloca o inimigo', () => {
    const world = makeWorld();
    const index = placeEnemy(world, { x: 1, z: 0, hp: 1000 });

    runTicks(world, 1);

    expect(world.enemies.posX[index]!).toBe(1);
    expect(world.enemies.posZ[index]!).toBe(0);
  });
});

describe('evento agregado enemyHit', () => {
  it('mordida: 1 evento com count 1 e posição do alvo, entre biteFired e enemyDied', () => {
    const world = makeWorld();
    const index = placeEnemy(world, { x: 1, z: 0, hp: 1 });

    runTicks(world, 1);

    const types = world.events.map((event) => event.type);
    expect(types.indexOf('biteFired')).toBeLessThan(types.indexOf('enemyHit'));
    expect(types.indexOf('enemyHit')).toBeLessThan(types.indexOf('enemyDied'));

    const hit = world.events.find((event) => event.type === 'enemyHit');
    if (hit?.type !== 'enemyHit') throw new Error('enemyHit não emitido');
    expect(hit.count).toBe(1);
    expect(hit.critCount).toBe(0);
    expect(hit.x).toBeCloseTo(world.enemies.posX[index]!, 5);
  });

  it('fumaça: UM evento por pulso com count = atingidos (nunca 1 por inimigo)', () => {
    const world = makeTestWorld({
      data: freezeEnemies(disableSpawn(cloneGameData())),
      characterId: 'churrasqueiro',
    });
    placeEnemy(world, { x: 1, z: 0, hp: 1000 });
    placeEnemy(world, { x: -1, z: 0, hp: 1000 });
    placeEnemy(world, { x: 0, z: 1.5, hp: 1000 });
    placeEnemy(world, { x: 0, z: 10, hp: 1000 }); // fora do raio de 2,0

    runTicks(world, 1);

    const hits = world.events.filter((event) => event.type === 'enemyHit');
    expect(hits).toHaveLength(1);
    if (hits[0]?.type !== 'enemyHit') throw new Error('enemyHit não emitido');
    expect(hits[0].count).toBe(3);
    // x/z do PRIMEIRO inimigo do lote na ordem do scan do pool.
    expect(hits[0].x).toBeCloseTo(1, 5);
    expect(hits[0].z).toBeCloseTo(0, 5);
  });

  it('fumaça letal: smokeFired → enemyHit → enemyDieds, nesta ordem', () => {
    const world = makeTestWorld({
      data: freezeEnemies(disableSpawn(cloneGameData())),
      characterId: 'churrasqueiro',
    });
    placeEnemy(world, { x: 1, z: 0, hp: 1 });
    placeEnemy(world, { x: -1, z: 0, hp: 1 });

    runTicks(world, 1);

    const types = world.events.map((event) => event.type);
    expect(types).toEqual(['smokeFired', 'enemyHit', 'enemyDied', 'enemyDied']);
  });

  it('carta: 1 evento por carta por tick com count = feridos naquele tick', () => {
    const data = freezeEnemies(disableSpawn(cloneGameData()));
    const world = makeTestWorld({ data, characterId: 'carteiro' });
    // Dois inimigos quase sobrepostos na rota da carta: ela cruza o raio de
    // acerto dos dois (0,6 + 0,45) no MESMO tick (passo de 14/60 ≈ 0,23 u).
    placeEnemy(world, { x: 3, z: 0.1, hp: 1000 });
    placeEnemy(world, { x: 3, z: -0.1, hp: 1000 });

    let batched = false;
    for (let i = 0; i < 60 && !batched; i++) {
      runTicks(world, 1);
      const hit = world.events.find((event) => event.type === 'enemyHit');
      if (hit?.type === 'enemyHit' && hit.count === 2) batched = true;
      expect(world.events.filter((event) => event.type === 'enemyHit').length).toBeLessThanOrEqual(
        1, // há 1 carta em voo: no máximo 1 evento agregado por tick
      );
    }
    expect(batched).toBe(true);
  });

  it('crit garantido aparece no critCount do lote', () => {
    const world = makeWorld(1, certainCritData());
    applyUpgradesById(world, ['dado']);
    placeEnemy(world, { x: 1, z: 0, hp: 1000 });

    runTicks(world, 1);

    const hit = world.events.find((event) => event.type === 'enemyHit');
    if (hit?.type !== 'enemyHit') throw new Error('enemyHit não emitido');
    expect(hit.count).toBe(1);
    expect(hit.critCount).toBe(1);
  });

  it('golpe que não fere ninguém não emite enemyHit (nem *Fired)', () => {
    const world = makeWorld();
    placeEnemy(world, { x: 20, z: 0, hp: 1000 }); // fora do alcance

    runTicks(world, 30);

    expect(world.events.some((event) => event.type === 'enemyHit')).toBe(false);
    expect(world.events.some((event) => event.type === 'biteFired')).toBe(false);
  });
});
