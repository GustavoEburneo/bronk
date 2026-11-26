/**
 * Talentos (Loja de Talentos) e bananas na SIMULAÇÃO: contagem por abate e
 * efeito dos ranks na fórmula linear de stats (a persistência do cofre é do
 * metaStore, testada em src/meta/metaStore.test.ts).
 */
import { describe, expect, it } from 'vitest';
import { cloneGameData, disableSpawn, makeTestWorld, placeEnemy, runTicks } from './helpers';
import { createWorld } from '../world';
import { mulberry32 } from '../rng';
import { applyUpgradesById } from '../upgrades';
import type { GameData } from '../../data/tables';

/** Ranks zerados com o talento `id` em `rank`; lança se o id não existir. */
function ranksWith(data: GameData, id: string, rank: number): number[] {
  const index = data.talents.findIndex((def) => def.id === id);
  if (index < 0) throw new Error(`talento desconhecido no teste: ${id}`);
  const ranks = new Array<number>(data.talents.length).fill(0);
  ranks[index] = rank;
  return ranks;
}

describe('bananas por abate', () => {
  it('cada abate soma data.bananas.perKill em bananasEarned', () => {
    const data = disableSpawn(cloneGameData());
    const world = makeTestWorld({ data });
    // Dois inimigos de 1 HP no alcance da mordida (alvo único): 1 morre por golpe.
    placeEnemy(world, { x: 0, z: 1, hp: 1 });
    placeEnemy(world, { x: 0, z: 1.2, hp: 1 });

    expect(world.bananasEarned).toBe(0);
    runTicks(world, 1); // 1ª mordida (cooldown começa zerado)
    expect(world.bananasEarned).toBe(data.bananas.perKill);

    // Espera a recarga e abate o segundo.
    runTicks(world, Math.ceil(world.stats.abilityCooldown / (1 / 60)) + 1);
    expect(world.bananasEarned).toBe(2 * data.bananas.perKill);
  });

  it('golpe que não mata não rende banana', () => {
    const data = disableSpawn(cloneGameData());
    const world = makeTestWorld({ data });
    placeEnemy(world, { x: 0, z: 1, hp: 9999 });
    runTicks(world, 1);
    expect(world.bananasEarned).toBe(0);
  });
});

describe('talentos nos stats efetivos', () => {
  it('rank de talento entra na fórmula linear sobre a base', () => {
    const data = cloneGameData();
    const feijoada = data.talents.find((def) => def.id === 'feijoada')!;
    const world = makeTestWorld({
      data,
      talentRanks: ranksWith(data, 'feijoada', feijoada.maxRank),
    });

    const base = data.characters[world.characterIndex]!.ability.damage;
    const expected = base * (1 + feijoada.effect.percentPerStack * feijoada.maxRank);
    expect(world.stats.abilityDamage).toBeCloseTo(expected, 10);
  });

  it('talento e melhoria SOMAM percentuais sobre a base (não compõem)', () => {
    const data = cloneGameData();
    const feijoada = data.talents.find((def) => def.id === 'feijoada')!;
    const pimenta = data.upgrades.find((def) => def.id === 'pimenta')!;
    const world = makeTestWorld({ data, talentRanks: ranksWith(data, 'feijoada', 2) });
    applyUpgradesById(world, ['pimenta', 'pimenta']);

    const base = data.characters[world.characterIndex]!.ability.damage;
    const expected =
      base * (1 + feijoada.effect.percentPerStack * 2 + pimenta.effect!.percentPerStack * 2);
    expect(world.stats.abilityDamage).toBeCloseTo(expected, 10);
  });

  it('clamp de recarga segura café + despertador no piso compartilhado', () => {
    const data = cloneGameData();
    const despertador = data.talents.find((def) => def.id === 'despertador')!;
    const cafe = data.upgrades.find((def) => def.id === 'cafe')!;
    const world = makeTestWorld({
      data,
      talentRanks: ranksWith(data, 'despertador', despertador.maxRank),
    });
    applyUpgradesById(world, new Array<string>(cafe.maxStacks).fill('cafe'));

    // Capivara: 0,8 × (1 − 0,12×4 − 0,05×3) = 0,296 → piso 0,35 dos dois efeitos.
    expect(world.stats.abilityCooldown).toBeCloseTo(0.35, 10);
  });

  it('talentRanks com tamanho errado derruba a criação do mundo', () => {
    const data = cloneGameData();
    expect(() =>
      createWorld(data, mulberry32(1), { characterId: 'capivara', talentRanks: [1] }),
    ).toThrow(/talentRanks/);
  });
});
