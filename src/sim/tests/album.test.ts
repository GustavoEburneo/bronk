/**
 * Álbum de Figurinhas na SIM (GDD 2026-11-19): drop por abate no RNG próprio
 * (`dropRng`, separado do RNG da sim), contadores de abate por tipo e o
 * multiplicador de dano contra o tipo vindo das cópias (`albumCopies`).
 */
import { describe, expect, it } from 'vitest';
import { albumDamageBonus, nextAlbumTier } from '../../data/album';
import { applyAbilityHit, beginHitBatch, emitHitBatch } from '../combat';
import { createWorld } from '../world';
import { mulberry32 } from '../rng';
import { cloneGameData, disableSpawn, makeTestWorld, placeEnemy } from './helpers';

/** Mata o inimigo `index` com um golpe de habilidade (dano >> hp). */
function killWithAbility(world: ReturnType<typeof makeTestWorld>, index: number): void {
  beginHitBatch();
  applyAbilityHit(world, index);
  emitHitBatch(world);
}

describe('albumDamageBonus (degraus)', () => {
  const album = cloneGameData().album;

  it('abaixo do 1º degrau não há bônus; cada degrau substitui o anterior', () => {
    expect(albumDamageBonus(album, 0)).toBe(0);
    expect(albumDamageBonus(album, album.tiers[0]!.copies)).toBe(album.tiers[0]!.damageBonus);
    const last = album.tiers[album.tiers.length - 1]!;
    expect(albumDamageBonus(album, last.copies)).toBe(last.damageBonus);
    expect(albumDamageBonus(album, last.copies + 999)).toBe(last.damageBonus);
  });

  it('nextAlbumTier aponta o próximo degrau e null no teto', () => {
    expect(nextAlbumTier(album, 0)).toBe(album.tiers[0]!);
    const last = album.tiers[album.tiers.length - 1]!;
    expect(nextAlbumTier(album, last.copies)).toBeNull();
  });
});

describe('drop de figurinha por abate', () => {
  it('com dropChance 1, todo abate dropa a figurinha do TIPO abatido', () => {
    const data = disableSpawn(cloneGameData());
    data.album.dropChance = 1;
    const world = makeTestWorld({ data });
    const ratoIndex = data.enemyTypes.findIndex((type) => type.id === 'rato');

    const slot = placeEnemy(world, { x: 1, z: 0, typeId: 'rato', hp: 1 });
    killWithAbility(world, slot);

    expect(world.kills).toBe(1);
    expect(world.killsByType[ratoIndex]).toBe(1);
    expect(world.cardsEarned[ratoIndex]).toBe(1);
    expect(world.bananasEarned).toBe(data.bananas.perKill);
  });

  it('com dropChance ínfima, o abate conta mas não dropa', () => {
    const data = disableSpawn(cloneGameData());
    data.album.dropChance = 1e-12;
    const world = makeTestWorld({ data });

    const slot = placeEnemy(world, { x: 1, z: 0, hp: 1 });
    killWithAbility(world, slot);

    expect(world.kills).toBe(1);
    expect(world.cardsEarned.every((n) => n === 0)).toBe(true);
  });

  it('mesmo dropSeed → mesmos drops; o RNG da SIM não é tocado pelo roll', () => {
    const run = (dropSeed: number): { cards: number[]; simRoll: number } => {
      const data = disableSpawn(cloneGameData());
      const world = makeTestWorld({ data, seed: 7, dropSeed });
      for (let i = 0; i < 50; i++) {
        const slot = placeEnemy(world, { x: 1, z: 0, hp: 1 });
        killWithAbility(world, slot);
      }
      // Próximo número do RNG da sim: deve ser idêntico entre as execuções —
      // o roll de drop acontece no dropRng, nunca aqui.
      return { cards: world.cardsEarned.slice(), simRoll: world.rng.next() };
    };

    const a = run(123);
    const b = run(123);
    const c = run(456);
    expect(a.cards).toEqual(b.cards);
    expect(a.simRoll).toBe(b.simRoll);
    expect(c.simRoll).toBe(a.simRoll); // seed da sim igual → stream igual
  });
});

describe('bônus de dano do álbum contra o tipo', () => {
  it('cópias no degrau multiplicam o dano SÓ contra aquele tipo', () => {
    const data = disableSpawn(cloneGameData());
    const coneIndex = data.enemyTypes.findIndex((type) => type.id === 'cone');
    const ratoIndex = data.enemyTypes.findIndex((type) => type.id === 'rato');
    const lastTier = data.album.tiers[data.album.tiers.length - 1]!;

    const albumCopies = new Array<number>(data.enemyTypes.length).fill(0);
    albumCopies[coneIndex] = lastTier.copies; // bônus máximo contra cone
    const world = makeTestWorld({ data, albumCopies });

    expect(world.albumDamageMult[coneIndex]).toBeCloseTo(1 + lastTier.damageBonus, 10);
    expect(world.albumDamageMult[ratoIndex]).toBe(1);

    // hp entre o dano base e o dano com bônus: só o cone morre num golpe.
    const damage = world.stats.abilityDamage;
    const hp = damage * (1 + lastTier.damageBonus / 2);
    const coneSlot = placeEnemy(world, { x: 1, z: 0, typeId: 'cone', hp });
    killWithAbility(world, coneSlot);
    expect(world.kills).toBe(1);

    const ratoSlot = placeEnemy(world, { x: 1, z: 0, typeId: 'rato', hp });
    killWithAbility(world, ratoSlot);
    expect(world.kills).toBe(1); // o rato sobrevive: sem figurinha, sem bônus
    expect(world.enemies.hp[ratoSlot]!).toBeCloseTo(hp - damage, 4);
  });

  it('albumCopies com tamanho errado falha rápido (bug do integrador)', () => {
    const data = cloneGameData();
    expect(() =>
      createWorld(data, mulberry32(1), { characterId: 'capivara', albumCopies: [1, 2] }),
    ).toThrow(/albumCopies/);
  });
});
