import { describe, expect, it } from 'vitest';
import type { InputFrame } from '../tick';
import { SIM_DT, tick } from '../tick';
import type { World } from '../world';
import { makeTestWorld } from './helpers';

/** Roteiro de input determinístico que varia a direção ao longo dos ticks. */
function scriptedInput(tickIndex: number): InputFrame {
  const phase = Math.floor(tickIndex / 90) % 4;
  if (phase === 0) return { moveX: 1, moveZ: 0 };
  if (phase === 1) return { moveX: 0, moveZ: 1 };
  if (phase === 2) return { moveX: -1, moveZ: -1 };
  return { moveX: 0.5, moveZ: -1 };
}

function runScripted(world: World, ticks: number): void {
  for (let i = 0; i < ticks; i++) {
    tick(world, scriptedInput(i), SIM_DT);
  }
}

/** Fotografa todo o estado observável da sim, só nos índices ativos dos pools. */
function snapshotWorld(world: World) {
  const { enemies, orbs, cards } = world;
  return {
    tickCount: world.tickCount,
    time: world.time,
    status: world.status,
    player: { ...world.player },
    upgradeStacks: [...world.upgradeStacks],
    pendingLevelUps: world.pendingLevelUps,
    upgradeChoice: world.upgradeChoice === null ? null : { ...world.upgradeChoice },
    stats: { ...world.stats },
    enemyCount: enemies.count,
    enemyPosX: Array.from(enemies.posX.subarray(0, enemies.count)),
    enemyPosZ: Array.from(enemies.posZ.subarray(0, enemies.count)),
    enemyHp: Array.from(enemies.hp.subarray(0, enemies.count)),
    enemyState: Array.from(enemies.state.subarray(0, enemies.count)),
    enemyStateTime: Array.from(enemies.stateTime.subarray(0, enemies.count)),
    enemyTypeIndex: Array.from(enemies.typeIndex.subarray(0, enemies.count)),
    enemyDirX: Array.from(enemies.dirX.subarray(0, enemies.count)),
    enemyDirZ: Array.from(enemies.dirZ.subarray(0, enemies.count)),
    enemyHitCooldown: Array.from(enemies.projectileHitCooldown.subarray(0, enemies.count)),
    orbCount: orbs.count,
    orbPosX: Array.from(orbs.posX.subarray(0, orbs.count)),
    orbPosZ: Array.from(orbs.posZ.subarray(0, orbs.count)),
    orbXpValue: Array.from(orbs.xpValue.subarray(0, orbs.count)),
    cardCount: cards.count,
    cardPosX: Array.from(cards.posX.subarray(0, cards.count)),
    cardPosZ: Array.from(cards.posZ.subarray(0, cards.count)),
    cardDirX: Array.from(cards.dirX.subarray(0, cards.count)),
    cardDirZ: Array.from(cards.dirZ.subarray(0, cards.count)),
    cardTraveled: Array.from(cards.traveled.subarray(0, cards.count)),
    cardAge: Array.from(cards.age.subarray(0, cards.count)),
    cardPhase: Array.from(cards.phase.subarray(0, cards.count)),
  };
}

describe('determinismo da simulação', () => {
  it('capivara: mesma seed e mesmo roteiro de input, estados idênticos após 600 ticks', () => {
    const worldA = makeTestWorld({ seed: 123 });
    const worldB = makeTestWorld({ seed: 123 });

    runScripted(worldA, 600);
    runScripted(worldB, 600);

    expect(snapshotWorld(worldA)).toEqual(snapshotWorld(worldB));
    // O cenário exercita a sim de verdade: houve spawn em 10 s simulados.
    expect(worldA.enemies.count).toBeGreaterThan(0);
  });

  it('carteiro: mesma seed e mesmo roteiro de input, estados idênticos após 600 ticks', () => {
    const makeWorld = (): World => {
      const world = makeTestWorld({ seed: 123, characterId: 'carteiro' });
      // Anel de spawn curto: inimigos entram no alcance de arremesso (7 u)
      // dentro da janela do teste e as cartas voam de verdade.
      world.data.spawn.ringMinRadius = 8;
      world.data.spawn.ringMaxRadius = 12;
      world.data.spawn.baseRatePerSec = 4;
      return world;
    };
    const runCountingCards = (world: World): number => {
      let fired = 0;
      for (let i = 0; i < 600; i++) {
        tick(world, scriptedInput(i), SIM_DT);
        fired += world.events.filter((event) => event.type === 'cardFired').length;
      }
      return fired;
    };
    const worldA = makeWorld();
    const worldB = makeWorld();

    const firedA = runCountingCards(worldA);
    const firedB = runCountingCards(worldB);

    expect(snapshotWorld(worldA)).toEqual(snapshotWorld(worldB));
    // O cenário exercitou as cartas: houve arremessos, e o mesmo tanto nos dois.
    expect(firedA).toBeGreaterThan(0);
    expect(firedA).toBe(firedB);
  });

  it('churrasqueiro: mesma seed e mesmo roteiro de input, estados idênticos após 600 ticks', () => {
    const makeWorld = (): World => {
      const world = makeTestWorld({ seed: 123, characterId: 'churrasqueiro' });
      // Anel de spawn curto e taxa alta: inimigos chegam ao raio da nuvem
      // (2 u) dentro da janela do teste e a fumaça pulsa de verdade.
      world.data.spawn.ringMinRadius = 4;
      world.data.spawn.ringMaxRadius = 8;
      world.data.spawn.baseRatePerSec = 4;
      return world;
    };
    const runCountingPulses = (world: World): number => {
      let fired = 0;
      for (let i = 0; i < 600; i++) {
        tick(world, scriptedInput(i), SIM_DT);
        fired += world.events.filter((event) => event.type === 'smokeFired').length;
      }
      return fired;
    };
    const worldA = makeWorld();
    const worldB = makeWorld();

    const firedA = runCountingPulses(worldA);
    const firedB = runCountingPulses(worldB);

    expect(snapshotWorld(worldA)).toEqual(snapshotWorld(worldB));
    // O cenário exercitou a fumaça: houve pulsos, e o mesmo tanto nos dois.
    expect(firedA).toBeGreaterThan(0);
    expect(firedA).toBe(firedB);
  });

  it('seeds diferentes divergem com o mesmo roteiro de input', () => {
    const worldA = makeTestWorld({ seed: 1 });
    const worldB = makeTestWorld({ seed: 2 });

    runScripted(worldA, 600);
    runScripted(worldB, 600);

    expect(snapshotWorld(worldA)).not.toEqual(snapshotWorld(worldB));
  });
});
