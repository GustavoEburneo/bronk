/**
 * Medição do orçamento de desempenho (TECH): FPS, custo da simulação e custo do
 * render por frame, em médias móveis exponenciais (sem alocação por frame).
 */
export interface Perf {
  recordFrame(nowMs: number): void;
  recordSim(ms: number): void;
  recordRender(ms: number): void;
  readonly fps: number;
  readonly simMs: number;
  readonly renderMs: number;
}

const SMOOTHING = 0.05;

export function createPerf(): Perf {
  let lastFrameAt = -1;
  let frameDeltaMs = 1000 / 60;
  let simMs = 0;
  let renderMs = 0;

  return {
    recordFrame(nowMs: number): void {
      if (lastFrameAt >= 0) {
        const delta = nowMs - lastFrameAt;
        frameDeltaMs += (delta - frameDeltaMs) * SMOOTHING;
      }
      lastFrameAt = nowMs;
    },
    recordSim(ms: number): void {
      simMs += (ms - simMs) * SMOOTHING;
    },
    recordRender(ms: number): void {
      renderMs += (ms - renderMs) * SMOOTHING;
    },
    get fps(): number {
      return 1000 / frameDeltaMs;
    },
    get simMs(): number {
      return simMs;
    },
    get renderMs(): number {
      return renderMs;
    },
  };
}
