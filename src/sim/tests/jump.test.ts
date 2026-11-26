/**
 * Pulo na SIM (2026-11-24, movido da apresentação): integrado em
 * updatePlayerMovement a partir de `input.jump`, e acima de JUMP_CLEAR_HEIGHT
 * o dano de contato não acerta — pular por cima de inimigo esquiva.
 */
import { describe, expect, it } from 'vitest';
import { cloneGameData, freezeEnemies, makeTestWorld, placeEnemy, runTicks } from './helpers';
import { JUMP_CLEAR_HEIGHT } from '../systems/playerMovement';
import { SIM_DT } from '../tick';

describe('pulo', () => {
  it('sobe com input.jump, passa da altura livre e volta ao chão', () => {
    const data = cloneGameData();
    data.spawn.baseRatePerSec = 0.0001;
    const world = makeTestWorld({ seed: 1, data });

    // Um tick com a tecla: ganha impulso e sai do chão.
    runTicks(world, 1, { moveX: 0, moveZ: 0, jump: true });
    expect(world.player.jumpOffset).toBeGreaterThan(0);

    // Sem segurar: sobe além da altura livre e aterrissa sozinho (ápice ~2,1 u).
    let peak = 0;
    for (let i = 0; i < Math.ceil(1.2 / SIM_DT); i++) {
      runTicks(world, 1);
      peak = Math.max(peak, world.player.jumpOffset);
    }
    expect(peak).toBeGreaterThan(JUMP_CLEAR_HEIGHT);
    expect(world.player.jumpOffset).toBe(0);
  });

  it('acima da altura livre o contato não machuca; no chão, machuca', () => {
    const data = freezeEnemies(cloneGameData());
    data.spawn.baseRatePerSec = 0.0001;
    const world = makeTestWorld({ seed: 1, data });
    placeEnemy(world, { x: world.player.x, z: world.player.z });

    // "Por cima" do inimigo: nenhum dano de contato.
    world.player.jumpOffset = JUMP_CLEAR_HEIGHT + 0.5;
    world.player.jumpVelocity = 0.1; // ainda no ar (a física segue integrando)
    const hpBefore = world.player.hp;
    runTicks(world, 1);
    expect(world.player.hp).toBe(hpBefore);

    // De volta ao chão, o mesmo contato machuca.
    world.player.jumpOffset = 0;
    world.player.jumpVelocity = 0;
    runTicks(world, 1);
    expect(world.player.hp).toBeLessThan(hpBefore);
  });
});
