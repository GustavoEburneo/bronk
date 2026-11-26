import { describe, expect, it } from 'vitest';
import { SIM_DT } from '../tick';
import { EnemyState } from '../enemyState';
import type { World } from '../world';
import { applyUpgradesById } from '../upgrades';
import {
  baseEnemyType,
  cloneGameData,
  disableSpawn,
  freezeEnemies,
  makeTestWorld,
  placeEnemy,
  runTicks,
} from './helpers';

/**
 * "Baforada de Fumaça" (churrasqueiro): pulso instantâneo, sem mira, centrado
 * no player, que fere TODOS os inimigos Chasing a até `range` (centro-a-centro)
 * a cada `cooldown`. Sem alvo no raio, não pulsa e o cooldown segura em 0.
 */

function makeWorld(seed = 1): World {
  return makeTestWorld({
    seed,
    data: freezeEnemies(disableSpawn(cloneGameData())),
    characterId: 'churrasqueiro',
  });
}

describe('baforada de fumaça', () => {
  it('pulso fere TODOS os inimigos Chasing dentro do raio e emite smokeFired', () => {
    const world = makeWorld();
    const near = placeEnemy(world, { x: 1, z: 0, hp: 1000 });
    const alsoNear = placeEnemy(world, { x: 0, z: -1.5, hp: 1000 });
    const atEdge = placeEnemy(world, { x: world.ability.range, z: 0, hp: 1000 });

    runTicks(world, 1);

    expect(world.events).toContainEqual({ type: 'smokeFired' });
    expect(world.enemies.hp[near]!).toBe(1000 - world.ability.damage);
    expect(world.enemies.hp[alsoNear]!).toBe(1000 - world.ability.damage);
    // Centro-a-centro <= raio: a borda exata ainda é atingida.
    expect(world.enemies.hp[atEdge]!).toBe(1000 - world.ability.damage);
  });

  it('poupa inimigo fora do raio', () => {
    const world = makeWorld();
    placeEnemy(world, { x: 1, z: 0 }); // garante que o pulso dispara
    const outside = placeEnemy(world, { x: world.ability.range + 0.01, z: 0 });

    runTicks(world, 1);

    expect(world.enemies.hp[outside]!).toBe(baseEnemyType(world.data).maxHp);
  });

  it('inimigo em Spawning não leva dano, mesmo dentro do raio', () => {
    const world = makeWorld();
    placeEnemy(world, { x: 1, z: 0 });
    const spawning = placeEnemy(world, { x: 0.5, z: 0, state: EnemyState.Spawning });

    runTicks(world, 1);

    expect(world.enemies.hp[spawning]!).toBe(baseEnemyType(world.data).maxHp);
  });

  it('sem inimigo no raio não pulsa, não emite evento e o cooldown não gasta', () => {
    const world = makeWorld();
    const outside = placeEnemy(world, { x: world.ability.range + 2, z: 0 });

    runTicks(world, 120); // 2 s sem alvo: nenhum pulso dispara

    expect(world.enemies.hp[outside]!).toBe(baseEnemyType(world.data).maxHp);
    expect(world.events).not.toContainEqual({ type: 'smokeFired' });
    // Cooldown segurado em 0, pronto para o primeiro inimigo que entrar.
    expect(world.player.abilityCooldown).toBe(0);
  });

  it('o primeiro inimigo a entrar no raio leva o pulso imediatamente', () => {
    const world = makeWorld();
    runTicks(world, 120); // cooldown segurado em 0, sem alvo

    const index = placeEnemy(world, { x: 1, z: 0, hp: 1000 });
    runTicks(world, 1);

    expect(world.events).toContainEqual({ type: 'smokeFired' });
    expect(world.enemies.hp[index]!).toBe(1000 - world.ability.damage);
  });

  it('não pulsa duas vezes dentro do cooldown e volta a pulsar quando ele vence', () => {
    const world = makeWorld();
    const index = placeEnemy(world, { x: 1, z: 0, hp: 1000 });
    const cooldownTicks = Math.round(world.ability.cooldown / SIM_DT);

    runTicks(world, 1); // primeiro pulso no primeiro tick
    const hpAfterFirst = world.enemies.hp[index]!;
    expect(hpAfterFirst).toBe(1000 - world.ability.damage);

    runTicks(world, cooldownTicks - 2); // ainda dentro do cooldown
    expect(world.enemies.hp[index]!).toBe(hpAfterFirst);

    // Folga de ponto flutuante, como nos testes da mordida.
    runTicks(world, 3);
    expect(world.enemies.hp[index]!).toBe(1000 - 2 * world.ability.damage);
  });

  it('sem janela de imunidade: o mesmo inimigo leva dano cheio a cada pulso', () => {
    const world = makeWorld();
    const index = placeEnemy(world, { x: 1, z: 0, hp: 1000 });
    const cooldownTicks = Math.round(world.ability.cooldown / SIM_DT);

    // 3 pulsos: tick 1 + 2 cooldowns completos (folga de 2 ticks cada).
    runTicks(world, 1 + 2 * (cooldownTicks + 2));

    expect(world.enemies.hp[index]!).toBe(1000 - 3 * world.ability.damage);
  });

  it('inimigos mortos pelo pulso emitem enemyDied e viram Dying no lote', () => {
    const world = makeWorld();
    const a = placeEnemy(world, { x: 1, z: 0, hp: world.ability.damage });
    const b = placeEnemy(world, { x: -1, z: 0, hp: world.ability.damage });

    runTicks(world, 1);

    expect(world.enemies.state[a]).toBe(EnemyState.Dying);
    expect(world.enemies.state[b]).toBe(EnemyState.Dying);
    expect(world.events.filter((event) => event.type === 'enemyDied')).toHaveLength(2);
  });

  it('gameOver congela o mundo: nenhum pulso dispara depois da morte', () => {
    const world = makeWorld();
    world.status = 'gameOver';
    const index = placeEnemy(world, { x: 1, z: 0 });

    runTicks(world, 120);

    expect(world.enemies.hp[index]!).toBe(baseEnemyType(world.data).maxHp);
  });
});

describe('melhorias genéricas sobre a fumaça (ability.* resolve contra fumaca)', () => {
  it('pimenta aumenta o dano do pulso aplicado de verdade', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['pimenta']);
    const index = placeEnemy(world, { x: 1, z: 0, hp: 1000 });

    runTicks(world, 1);

    expect(world.enemies.hp[index]!).toBeCloseTo(1000 - world.ability.damage * 1.25, 10);
  });

  it('bocao alarga a nuvem: alvo antes fora do raio passa a ser atingido', () => {
    const world = makeWorld();
    const base = world.ability.range;
    const index = placeEnemy(world, { x: base + 0.2, z: 0 }); // fora do raio base

    runTicks(world, 1);
    expect(world.enemies.hp[index]!).toBe(baseEnemyType(world.data).maxHp);

    applyUpgradesById(world, ['bocao']); // raio base * 1,2
    expect(world.stats.abilityRange).toBeCloseTo(base * 1.2, 10);
    runTicks(world, 1);
    expect(world.enemies.hp[index]!).toBeLessThan(baseEnemyType(world.data).maxHp);
  });

  it('cafe acelera o ritmo das baforadas', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['cafe']);
    expect(world.stats.abilityCooldown).toBeCloseTo(world.ability.cooldown * 0.88, 10);

    const index = placeEnemy(world, { x: 1, z: 0, hp: 1000 });
    const boostedTicks = Math.round((world.ability.cooldown * 0.88) / SIM_DT);

    // Com o cooldown reduzido, 2 pulsos cabem onde a base só daria 1.
    runTicks(world, 1 + boostedTicks + 2);
    expect(world.enemies.hp[index]!).toBe(1000 - 2 * world.ability.damage);
  });

  it('cafe no teto fica acima do piso de 0,35 s (1,0 × 0,52 = 0,52)', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['cafe', 'cafe', 'cafe', 'cafe']);

    expect(world.stats.abilityCooldown).toBeCloseTo(world.ability.cooldown * 0.52, 10);
    expect(world.stats.abilityCooldown).toBeGreaterThan(0.35);
  });
});
