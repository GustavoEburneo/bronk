import type { World } from '../sim/world';
import type { InputFrame } from '../sim/tick';
import { SIM_DT, tick } from '../sim/tick';
import type { Perf } from './perf';

/** Maior delta aceito por frame (aba em segundo plano acumula tempo). */
const MAX_FRAME_SECONDS = 0.25;
/** Teto de ticks por frame: evita a espiral da morte quando a sim atrasa. */
const MAX_STEPS_PER_FRAME = 5;

export interface GameLoopDeps {
  /** Lido a cada frame: o restart troca o mundo por baixo do loop. */
  getWorld(): World;
  sampleInput(): InputFrame;
  draw(world: World, alpha: number, frameDt: number): void;
  perf: Perf;
  afterFrame(world: World): void;
  /**
   * Pausa EXTERNA (menu de pausa): lida a cada frame; true segura a sim como
   * a escolha de melhoria — render e afterFrame seguem vivos, tick não roda e
   * o tempo parado não vira rajada na retomada. Ausente = nunca pausado.
   */
  isPaused?(): boolean;
}

export interface GameLoopHandle {
  /**
   * Para o loop de vez (volta ao menu): cancela o frame agendado e nenhum
   * outro é agendado. O handle não é reutilizável — partida nova cria um
   * loop novo via `startGameLoop`.
   */
  stop(): void;
}

/**
 * Acumulador de timestep fixo com render interpolado: a sim roda sempre a
 * SIM_DT; o render interpola entre o tick anterior e o atual com `alpha`
 * (sem isso, monitores acima de 60 Hz exibem stutter).
 */
export function startGameLoop(deps: GameLoopDeps): GameLoopHandle {
  let accumulator = 0;
  let lastNow = performance.now();
  let stopped = false;
  let frameId = 0;

  function frame(now: number): void {
    if (stopped) return;
    const frameDt = Math.min((now - lastNow) / 1000, MAX_FRAME_SECONDS);
    lastNow = now;
    accumulator += frameDt;

    const world = deps.getWorld();

    // Escolha de melhoria aberta ("Panfleto na Esquina") ou pausa externa
    // (menu de pausa): a sim pausa e só o render continua. A escolha é checada
    // também dentro do while porque um tick pode abri-la no meio da rajada —
    // nenhum tick roda depois disso. A pausa externa não muda no meio do
    // frame (é UI), então basta lê-la uma vez.
    const paused = deps.isPaused?.() === true;
    const simStart = performance.now();
    let steps = 0;
    while (
      !paused &&
      world.upgradeChoice === null &&
      accumulator >= SIM_DT &&
      steps < MAX_STEPS_PER_FRAME
    ) {
      tick(world, deps.sampleInput(), SIM_DT);
      accumulator -= SIM_DT;
      steps++;
    }
    // Na pausa o acumulador zera a cada frame: senão o tempo parado viraria
    // uma rajada de ticks na retomada.
    if (paused || world.upgradeChoice !== null || steps === MAX_STEPS_PER_FRAME) accumulator = 0;
    deps.perf.recordSim(performance.now() - simStart);

    // Com o mundo congelado (gameOver, escolha aberta ou pausa), alpha variável
    // faria a cena vibrar entre prev e pos para sempre: desenha sem interpolação.
    const frozen = world.status !== 'running' || world.upgradeChoice !== null || paused;
    const alpha = frozen ? 1 : accumulator / SIM_DT;

    const drawStart = performance.now();
    deps.draw(world, alpha, frameDt);
    deps.perf.recordRender(performance.now() - drawStart);

    deps.perf.recordFrame(now);
    deps.afterFrame(world);

    frameId = requestAnimationFrame(frame);
  }

  frameId = requestAnimationFrame(frame);

  return {
    stop(): void {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(frameId);
    },
  };
}
