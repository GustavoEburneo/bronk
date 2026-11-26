/**
 * Orelhões (2026-11-24): spawn pelo relógio da run em RNG próprio (as
 * sequências da sim ficam intactas — coberto pelos testes de determinismo
 * existentes, que não mudaram), e atendimento por proximidade + abates
 * mínimos, com prêmio em bananas igual ao requisito.
 */
import { describe, expect, it } from 'vitest';
import { cloneGameData, makeTestWorld, runTicks } from './helpers';
import { SIM_DT } from '../tick';

describe('orelhões', () => {
  it('aparecem pelo relógio, um por entrada da rampa, dentro da arena', () => {
    const data = cloneGameData();
    data.spawn.baseRatePerSec = 0.0001; // sem horda: o teste é do relógio
    data.orelhoes.firstAtSec = 1;
    data.orelhoes.intervalSec = 2;
    data.orelhoes.killRequirements = [5, 15, 30];
    const world = makeTestWorld({ seed: 7, data });

    runTicks(world, Math.ceil(0.5 / SIM_DT));
    expect(world.orelhoes.length).toBe(0); // antes do primeiro toque

    runTicks(world, Math.ceil(1 / SIM_DT));
    expect(world.orelhoes.length).toBe(1);

    runTicks(world, Math.ceil(4.5 / SIM_DT));
    expect(world.orelhoes.length).toBe(3); // rampa esgotada: para em 3

    for (const orelhao of world.orelhoes) {
      expect(Math.abs(orelhao.x)).toBeLessThanOrEqual(world.arenaHalfSize);
      expect(Math.abs(orelhao.z)).toBeLessThanOrEqual(world.arenaHalfSize);
      expect(orelhao.answered).toBe(false);
    }
    expect(world.orelhoes.map((o) => o.requirement)).toEqual([5, 15, 30]);
  });

  it('atender exige proximidade E os abates mínimos; prêmio = requisito', () => {
    const data = cloneGameData();
    data.spawn.baseRatePerSec = 0.0001;
    data.orelhoes.firstAtSec = 0.1;
    data.orelhoes.killRequirements = [5];
    const world = makeTestWorld({ seed: 7, data });

    runTicks(world, Math.ceil(0.5 / SIM_DT));
    const orelhao = world.orelhoes[0]!;

    // Em cima do aparelho, mas sem os abates: não atende.
    world.player.x = orelhao.x;
    world.player.z = orelhao.z;
    world.player.prevX = orelhao.x;
    world.player.prevZ = orelhao.z;
    runTicks(world, 1);
    expect(orelhao.answered).toBe(false);

    // Longe, com os abates: também não atende.
    world.kills = 5;
    world.player.x = orelhao.x + 10;
    runTicks(world, 1);
    expect(orelhao.answered).toBe(false);

    // Perto E com os abates: atende, credita bananas e emite o evento.
    world.player.x = orelhao.x;
    const bananasBefore = world.bananasEarned;
    runTicks(world, 1);
    expect(orelhao.answered).toBe(true);
    expect(world.bananasEarned).toBe(bananasBefore + 5);
    expect(world.events.some((e) => e.type === 'orelhaoAnswered' && e.reward === 5)).toBe(true);

    // Atendido não atende de novo (nem re-credita).
    runTicks(world, 1);
    expect(world.bananasEarned).toBe(bananasBefore + 5);
  });
});
