import { describe, expect, it } from 'vitest';
import { SIM_DT } from '../tick';
import type { World } from '../world';
import type { GameData } from '../../data/tables';
import { CONTACT_DAMAGE_MIN } from '../../data/upgrades';
import { validateGameData } from '../../data/validate';
import { applyUpgradesById } from '../upgrades';
import {
  baseEnemyType,
  cloneGameData,
  disableSpawn,
  enemyTypeById,
  freezeEnemies,
  makeTestWorld,
  placeEnemy,
  runTicks,
} from './helpers';

/**
 * Passivas novas (GDD "Melhorias novas", 2026-11-18): Capacete de Obra
 * Emprestado (armor plano com piso CONTACT_DAMAGE_MIN) e Soro Caseiro
 * (regen contínuo clampado no maxHp, que nunca ressuscita).
 */

function makeWorld(data?: GameData): World {
  return makeTestWorld({ data: data ?? freezeEnemies(disableSpawn(cloneGameData())) });
}

describe('Capacete (player.contactArmor): redução plana com piso', () => {
  it('reduz o dano de contato em 2 por stack (cone 8 → 4 no teto)', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['capacete', 'capacete']);
    placeEnemy(world, { x: 0.5, z: 0, hp: 1e6 });

    const hpBefore = world.player.hp;
    runTicks(world, 1);

    expect(world.player.hp).toBe(hpBefore - (baseEnemyType(world.data).contactDamage - 4));
  });

  it('aplica sobre o dano do TIPO: rato (5) com teto de armor dói o piso 1', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['capacete', 'capacete']); // armor 4; rato 5 − 4 = 1
    placeEnemy(world, { x: 0.5, z: 0, typeId: 'rato', hp: 1e6 });

    const hpBefore = world.player.hp;
    runTicks(world, 1);

    expect(world.player.hp).toBe(hpBefore - 1);
  });

  it('armor acima do dano nunca zera: piso CONTACT_DAMAGE_MIN por golpe', () => {
    // Blindagem contra linha futura da tabela: armor exagerado via tabela
    // customizada ainda dói o piso (GDD "dói no mínimo 1").
    const data = freezeEnemies(disableSpawn(cloneGameData()));
    data.upgrades.find((def) => def.id === 'capacete')!.effect!.flatPerStack = 100;
    const world = makeWorld(data);
    applyUpgradesById(world, ['capacete']);
    placeEnemy(world, { x: 0.5, z: 0, hp: 1e6 });

    const hpBefore = world.player.hp;
    runTicks(world, 1);

    expect(world.player.hp).toBe(hpBefore - CONTACT_DAMAGE_MIN);
  });

  it('sem Capacete o dano é o cheio do tipo (britadeira 18)', () => {
    const world = makeWorld();
    placeEnemy(world, { x: 0.5, z: 0, typeId: 'britadeira', hp: 1e6 });

    const hpBefore = world.player.hp;
    runTicks(world, 1);

    expect(world.player.hp).toBe(
      hpBefore - enemyTypeById(world.data, 'britadeira').contactDamage,
    );
  });
});

describe('Soro (player.hpRegen): regeneração contínua', () => {
  it('regenera 0,5 HP/s por stack, fração por tick', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['soro']);
    world.player.hp = 50;

    runTicks(world, 60); // 1 s

    expect(world.player.hp).toBeCloseTo(50.5, 5);
  });

  it('no teto (3 stacks) regenera 1,5 HP/s', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['soro', 'soro', 'soro']);
    world.player.hp = 50;

    runTicks(world, 120); // 2 s

    expect(world.player.hp).toBeCloseTo(53, 5);
  });

  it('clampa no maxHp efetivo e não passa dele', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['soro']);
    world.player.hp = world.stats.maxHp - 0.1;

    runTicks(world, 60);

    expect(world.player.hp).toBe(world.stats.maxHp);
  });

  it('não ressuscita: morto fica em 0 HP mesmo com regen no build', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['soro', 'soro', 'soro']);
    world.player.hp = 1; // o primeiro golpe mata (dano mínimo 1 já basta)
    placeEnemy(world, { x: 0.5, z: 0, hp: 1e6 });

    runTicks(world, 1);
    expect(world.player.state).toBe('dead');
    expect(world.player.hp).toBe(0);

    runTicks(world, 120);
    expect(world.player.hp).toBe(0); // gameOver congela; regen nunca roda morto
  });

  it('a morte do tick vence: regen roda ANTES do dano de contato', () => {
    // hp 1 + regen não salva do golpe letal no mesmo tick: a ordem fixa
    // aplica o regen primeiro (1 → 1,00x) e o contato depois (mata).
    const world = makeWorld();
    applyUpgradesById(world, ['soro', 'soro', 'soro']);
    world.player.hp = 1;
    placeEnemy(world, { x: 0.5, z: 0, hp: 1e6 }); // cone: 8 de dano

    runTicks(world, 1);

    expect(world.player.state).toBe('dead');
    expect(world.status).toBe('gameOver');
  });

  it('com regen 0 o HP não muda em nada (no-op byte a byte)', () => {
    const world = makeWorld();
    world.player.hp = 37.25; // exato em float64; nenhum épsilon pode aparecer

    runTicks(world, 90);

    expect(world.player.hp).toBe(37.25);
  });
});

describe('validação dos stats derivados de base 0', () => {
  it('efeito só-percentual sobre stat de base 0 é rejeitado no boot', () => {
    for (const id of ['capacete', 'soro', 'dado', 'rodo']) {
      const data = cloneGameData();
      const def = data.upgrades.find((upgrade) => upgrade.id === id)!;
      def.effect!.percentPerStack = 0.25;
      def.effect!.flatPerStack = 0;
      expect(() => validateGameData(data)).toThrow(/base 0/);
    }
  });

  it('a tabela oficial (4 melhorias novas com flatPerStack) passa', () => {
    expect(() => validateGameData(cloneGameData())).not.toThrow();
  });

  it('regen por tick usa SIM_DT: 1 tick de soro soma exatamente 0,5 × SIM_DT', () => {
    const world = makeWorld();
    applyUpgradesById(world, ['soro']);
    world.player.hp = 50;

    runTicks(world, 1);

    expect(world.player.hp).toBeCloseTo(50 + 0.5 * SIM_DT, 10);
  });
});
