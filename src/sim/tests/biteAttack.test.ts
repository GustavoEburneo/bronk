import { describe, expect, it } from 'vitest';
import { SIM_DT } from '../tick';
import { EnemyState } from '../enemyState';
import {
  baseEnemyType,
  cloneGameData,
  disableSpawn,
  freezeEnemies,
  makeTestWorld,
  placeEnemy,
  runTicks,
} from './helpers';
import type { World } from '../world';

/**
 * Mordida de ALVO ÚNICO (GDD/DECISIONS 2026-11-18): quando o cooldown vence,
 * morde APENAS o inimigo Chasing mais próximo com distância centro-a-centro
 * <= alcance — exatamente 1 por disparo, dano cheio. Empate exato → o primeiro
 * na ordem do pool. Sem alvo no alcance, não morde, não emite biteFired e o
 * cooldown segura em 0 (mesma regra das cartas e da fumaça).
 */

function makeWorld(): World {
  return makeTestWorld({ data: disableSpawn(cloneGameData()) });
}

/** Mundo com inimigos congelados: distâncias exatas para empate/ordenação. */
function makeFrozenWorld(): World {
  return makeTestWorld({ data: freezeEnemies(disableSpawn(cloneGameData())) });
}

function biteFiredCount(world: World): number {
  return world.events.filter((event) => event.type === 'biteFired').length;
}

describe('mordida automática (alvo único)', () => {
  it('fere inimigo Chasing dentro do alcance no primeiro tick e emite biteFired', () => {
    const world = makeWorld();
    const index = placeEnemy(world, { x: 1, z: 0 });

    runTicks(world, 1);

    expect(world.events).toContainEqual({ type: 'biteFired' });
    expect(world.enemies.hp[index]!).toBe(baseEnemyType(world.data).maxHp - world.ability.damage);
  });

  it('com N inimigos no raio, morde SÓ o mais próximo, com dano cheio', () => {
    const world = makeFrozenWorld();
    const far = placeEnemy(world, { x: 2.0, z: 0, hp: 1000 });
    const nearest = placeEnemy(world, { x: 0.8, z: 0, hp: 1000 });
    const mid = placeEnemy(world, { x: 0, z: -1.4, hp: 1000 });

    runTicks(world, 1);

    expect(biteFiredCount(world)).toBe(1);
    expect(world.enemies.hp[nearest]!).toBe(1000 - world.ability.damage);
    expect(world.enemies.hp[mid]!).toBe(1000);
    expect(world.enemies.hp[far]!).toBe(1000);
  });

  it('inimigo exatamente na borda do alcance (<= alcance) ainda é alvo', () => {
    // Alcance 2,5: exato em float32 (as posições do pool são Float32Array),
    // então "exatamente na borda" é representável — 2,2 não seria.
    const data = freezeEnemies(disableSpawn(cloneGameData()));
    const capivara = data.characters.find((def) => def.id === 'capivara')!;
    capivara.ability.range = 2.5;
    const world = makeTestWorld({ data });
    const atEdge = placeEnemy(world, { x: 2.5, z: 0, hp: 1000 });

    runTicks(world, 1);

    expect(world.enemies.hp[atEdge]!).toBe(1000 - world.ability.damage);
  });

  it('empate exato de distância: determinístico, vence o primeiro na ordem do pool', () => {
    const world = makeFrozenWorld();
    // Mesma distância exata (1,0 u) em lados opostos; o slot 0 vence o empate.
    const first = placeEnemy(world, { x: 1, z: 0, hp: 1000 });
    const second = placeEnemy(world, { x: -1, z: 0, hp: 1000 });

    runTicks(world, 1);

    expect(world.enemies.hp[first]!).toBe(1000 - world.ability.damage);
    expect(world.enemies.hp[second]!).toBe(1000);
  });

  it('sem alvo no alcance: não morde, não emite biteFired e o cooldown segura em 0', () => {
    const world = makeWorld();
    // Fora do range mesmo depois dos passos de perseguição dos ticks.
    const outside = placeEnemy(world, { x: world.ability.range + 6, z: 0 });

    runTicks(world, 60); // 1 s sem alvo: nenhuma mordida dispara

    expect(world.enemies.hp[outside]!).toBe(baseEnemyType(world.data).maxHp);
    expect(world.events).not.toContainEqual({ type: 'biteFired' });
    // Cooldown segurado em 0, pronto para o primeiro inimigo que entrar.
    expect(world.player.abilityCooldown).toBe(0);
  });

  it('o primeiro inimigo a entrar no alcance é mordido imediatamente', () => {
    const world = makeWorld();
    runTicks(world, 120); // cooldown segurado em 0, sem alvo

    const index = placeEnemy(world, { x: 1, z: 0, hp: 1000 });
    runTicks(world, 1);

    expect(world.events).toContainEqual({ type: 'biteFired' });
    expect(world.enemies.hp[index]!).toBe(1000 - world.ability.damage);
  });

  it('não morde duas vezes dentro do cooldown', () => {
    const world = makeWorld();
    const index = placeEnemy(world, { x: 1, z: 0, hp: 1000 });

    runTicks(world, 1); // primeira mordida dispara no primeiro tick
    const hpAfterFirstBite = world.enemies.hp[index]!;
    expect(hpAfterFirstBite).toBe(1000 - world.ability.damage);

    // 39 ticks a mais = 40 ticks (~0,67 s), ainda dentro do cooldown de 0,8 s.
    runTicks(world, 39);
    expect(world.enemies.hp[index]!).toBe(hpAfterFirstBite);
  });

  it('volta a morder quando o cooldown vence', () => {
    const world = makeWorld();
    const index = placeEnemy(world, { x: 1, z: 0, hp: 1000 });
    const cooldownTicks = Math.round(world.ability.cooldown / SIM_DT);

    // Folga de 2 ticks para acúmulo de erro de ponto flutuante no cooldown.
    runTicks(world, cooldownTicks + 2);

    expect(world.enemies.hp[index]!).toBe(1000 - 2 * world.ability.damage);
  });

  // O dano por nível (levelDamageBonus) saiu com a decisão "Panfleto na
  // Esquina"; a cobertura do dano via melhorias está em upgrades.test.ts.

  it('inimigo em Spawning sozinho no raio não é alvo: nada dispara', () => {
    const world = makeWorld();
    const index = placeEnemy(world, { x: 1, z: 0, state: EnemyState.Spawning });

    runTicks(world, 1);

    expect(world.enemies.state[index]).toBe(EnemyState.Spawning);
    expect(world.enemies.hp[index]!).toBe(baseEnemyType(world.data).maxHp);
    expect(world.events).not.toContainEqual({ type: 'biteFired' });
    expect(world.player.abilityCooldown).toBe(0);
  });

  it('Spawning mais próximo não rouba o alvo: morde o Chasing mais próximo', () => {
    const world = makeFrozenWorld();
    const spawning = placeEnemy(world, { x: 0.4, z: 0, state: EnemyState.Spawning });
    const chasing = placeEnemy(world, { x: 1.5, z: 0, hp: 1000 });

    runTicks(world, 1);

    expect(world.enemies.hp[spawning]!).toBe(baseEnemyType(world.data).maxHp);
    expect(world.enemies.hp[chasing]!).toBe(1000 - world.ability.damage);
  });

  it('inimigo morto (Dying) mais próximo nunca é alvo: morde o Chasing atrás dele', () => {
    const world = makeFrozenWorld();
    const dying = placeEnemy(world, { x: 0.5, z: 0, hp: 1000, state: EnemyState.Dying });
    const chasing = placeEnemy(world, { x: 1.8, z: 0, hp: 1000 });

    runTicks(world, 1);

    expect(world.enemies.hp[dying]!).toBe(1000);
    expect(world.enemies.hp[chasing]!).toBe(1000 - world.ability.damage);
  });

  it('alvo que morre na mordida emite enemyDied e vira Dying', () => {
    const world = makeFrozenWorld();
    const index = placeEnemy(world, { x: 1, z: 0, hp: world.ability.damage });

    runTicks(world, 1);

    expect(world.enemies.state[index]).toBe(EnemyState.Dying);
    expect(world.events.filter((event) => event.type === 'enemyDied')).toHaveLength(1);
  });

  it('determinismo: mesma seed, mesmos alvos mordidos e mesmo estado após 300 ticks', () => {
    const roll = (): { fired: number } & Record<string, unknown> => {
      const data = cloneGameData();
      // Anel de spawn curto e taxa alta: inimigos chegam ao alcance da mordida
      // (2,2 u) dentro da janela do teste e a escolha de alvo é exercitada.
      data.spawn.ringMinRadius = 3;
      data.spawn.ringMaxRadius = 6;
      data.spawn.baseRatePerSec = 4;
      const world = makeTestWorld({ seed: 321, data });
      let fired = 0;
      for (let i = 0; i < 300; i++) {
        runTicks(world, 1);
        fired += biteFiredCount(world);
      }
      return {
        fired,
        hp: Array.from(world.enemies.hp.subarray(0, world.enemies.count)),
        states: Array.from(world.enemies.state.subarray(0, world.enemies.count)),
        cooldown: world.player.abilityCooldown,
      };
    };

    const a = roll();
    const b = roll();
    expect(a).toEqual(b);
    // O cenário exercitou a mordida de verdade: houve disparos.
    expect(a.fired).toBeGreaterThan(0);
  });
});
