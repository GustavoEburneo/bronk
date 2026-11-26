/**
 * Testes do loop de timestep fixo em ambiente node: requestAnimationFrame e
 * performance.now são substituídos por um relógio manual, para dirigir os
 * frames de forma determinística e verificar a pausa da escolha de melhoria.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { World } from '../sim/world';
import { openPendingUpgradeChoice, chooseUpgrade } from '../sim/upgrades';
import { cloneGameData, disableSpawn, makeTestWorld } from '../sim/tests/helpers';
import type { Perf } from './perf';
import { createPerf } from './perf';
import type { GameLoopHandle } from './gameLoop';
import { startGameLoop } from './gameLoop';

/** 20 ms por frame: cabe exatamente 1 tick de SIM_DT, sem briga de epsilon. */
const FRAME_MS = 20;

interface LoopHarness {
  world: World;
  perf: Perf;
  draws: { alpha: number }[];
  handle: GameLoopHandle;
  /** Pausa externa lida pelo isPaused do loop (menu de pausa). */
  paused: { value: boolean };
  /** Avança o relógio em `ms` e roda o frame agendado no rAF. */
  advanceFrame(ms: number): void;
  hasScheduledFrame(): boolean;
  /** O callback agendado, sem consumi-lo (simula um frame tardio pós-stop). */
  peekScheduled(): FrameRequestCallback | null;
}

function startHarness(): LoopHarness {
  let nowMs = 0;
  vi.spyOn(performance, 'now').mockImplementation(() => nowMs);

  let scheduled: FrameRequestCallback | null = null;
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback): number => {
    scheduled = callback;
    return 0;
  });
  vi.stubGlobal('cancelAnimationFrame', (): void => {
    scheduled = null;
  });

  const world = makeTestWorld({ data: disableSpawn(cloneGameData()) });
  const perf = createPerf();
  const draws: { alpha: number }[] = [];
  const paused = { value: false };

  const handle = startGameLoop({
    getWorld: () => world,
    sampleInput: () => ({ moveX: 0, moveZ: 0 }),
    draw: (_world, alpha) => {
      draws.push({ alpha });
    },
    perf,
    afterFrame: () => {},
    isPaused: () => paused.value,
  });

  return {
    world,
    perf,
    draws,
    handle,
    paused,
    advanceFrame(ms: number): void {
      const frame = scheduled;
      if (frame === null) throw new Error('nenhum frame agendado no rAF');
      scheduled = null;
      nowMs += ms;
      frame(nowMs);
    },
    hasScheduledFrame: () => scheduled !== null,
    peekScheduled: () => scheduled,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('pausa da sim com escolha de melhoria aberta', () => {
  it('não roda tick durante a pausa, segue desenhando com alpha 1 e retoma sem rajada', () => {
    const h = startHarness();

    // Rodando: 20 ms cabem exatamente 1 tick e sobra alpha ~0.2 interpolado.
    h.advanceFrame(FRAME_MS);
    expect(h.world.tickCount).toBe(1);
    expect(h.draws.at(-1)!.alpha).toBeCloseTo(0.2, 5);

    // Abre a escolha pelo caminho real da sim.
    h.world.pendingLevelUps = 1;
    openPendingUpgradeChoice(h.world);
    expect(h.world.upgradeChoice).not.toBeNull();

    // 10 frames de 100 ms parados: 1 s de pausa valeria 60 ticks se vazasse.
    const drawsBefore = h.draws.length;
    for (let i = 0; i < 10; i++) {
      h.advanceFrame(100);
      expect(h.draws.at(-1)!.alpha).toBe(1);
    }
    expect(h.world.tickCount).toBe(1);
    // Render e medição seguem vivos durante a pausa.
    expect(h.draws.length).toBe(drawsBefore + 10);
    expect(h.perf.fps).toBeGreaterThan(0);

    // Retomada: o acumulador foi zerado, então 20 ms rendem 1 tick, não 5.
    chooseUpgrade(h.world, 0);
    expect(h.world.upgradeChoice).toBeNull();
    h.advanceFrame(FRAME_MS);
    expect(h.world.tickCount).toBe(2);
    expect(h.draws.at(-1)!.alpha).toBeCloseTo(0.2, 5);
  });

  it('tick que abre a escolha interrompe a rajada no meio do frame', () => {
    const h = startHarness();

    // 70 ms acumulados valem 4 ticks, mas o 1º abre a escolha e para a rajada.
    h.world.pendingLevelUps = 1;
    h.advanceFrame(70);
    expect(h.world.tickCount).toBe(1);
    expect(h.world.upgradeChoice).not.toBeNull();
    expect(h.draws.at(-1)!.alpha).toBe(1);

    // O resto dos 70 ms não pode despejar na retomada: só o novo frame conta.
    chooseUpgrade(h.world, 0);
    h.advanceFrame(FRAME_MS);
    expect(h.world.tickCount).toBe(2);
  });
});

describe('pausa externa (menu de pausa, via isPaused)', () => {
  it('congela a sim como a escolha de melhoria e retoma sem rajada', () => {
    const h = startHarness();

    h.advanceFrame(FRAME_MS);
    expect(h.world.tickCount).toBe(1);

    // Pausado: 10 frames de 100 ms (1 s) não rendem tick e desenham alpha 1.
    h.paused.value = true;
    const drawsBefore = h.draws.length;
    for (let i = 0; i < 10; i++) {
      h.advanceFrame(100);
      expect(h.draws.at(-1)!.alpha).toBe(1);
    }
    expect(h.world.tickCount).toBe(1);
    expect(h.draws.length).toBe(drawsBefore + 10);

    // Retomada: acumulador zerado — 20 ms rendem exatamente 1 tick.
    h.paused.value = false;
    h.advanceFrame(FRAME_MS);
    expect(h.world.tickCount).toBe(2);
    expect(h.draws.at(-1)!.alpha).toBeCloseTo(0.2, 5);
  });
});

describe('stop() do handle (volta ao menu)', () => {
  it('cancela o frame agendado e barra até um frame tardio do navegador', () => {
    const h = startHarness();
    h.advanceFrame(FRAME_MS);
    expect(h.world.tickCount).toBe(1);
    expect(h.hasScheduledFrame()).toBe(true);

    const lateFrame = h.peekScheduled();
    h.handle.stop();
    expect(h.hasScheduledFrame()).toBe(false);

    // cancelAnimationFrame não garante contra um frame já em voo: a flag barra.
    const drawsBefore = h.draws.length;
    lateFrame?.(10_000);
    expect(h.world.tickCount).toBe(1);
    expect(h.draws.length).toBe(drawsBefore);
    expect(h.hasScheduledFrame()).toBe(false);

    // Idempotente: segundo stop não lança nem reagenda.
    h.handle.stop();
    expect(h.hasScheduledFrame()).toBe(false);
  });
});
