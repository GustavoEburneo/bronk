/** Orientação da câmera lida pelo render a cada frame. */
export interface CameraLook {
  readonly yaw: number;
  readonly pitch: number;
}

export interface MouseLook extends CameraLook {
  /** Solta o ponteiro (ex.: ao abrir a tela de morte, que precisa de clique). */
  unlock(): void;
  /**
   * Re-trava o ponteiro no canvas (2026-11-24): chamado pelo integrador no
   * CLIQUE que fecha um overlay (escolher panfleto, Continuar da pausa) — o
   * gesto do clique autoriza o requestPointerLock, e o jogador volta direto
   * ao jogo sem ter que clicar na tela de novo. Falha silenciosa (ex.:
   * cooldown do navegador após Esc): o próximo clique no canvas resolve.
   */
  lock(): void;
  /**
   * Multiplicador sobre a sensibilidade base (1 = padrão). Quem manda o valor
   * é o integrador, lendo o cofre de configurações (a faixa clampa LÁ);
   * aqui só se descarta o inválido (não finito ou <= 0) — nunca lança.
   */
  setSensitivity(multiplier: number): void;
  dispose(): void;
}

const BASE_SENSITIVITY = 0.0025;
/** Levemente negativo: a câmera desce um pouco abaixo da cabeça e enquadra o céu. */
const MIN_PITCH = -0.05;
const MAX_PITCH = 1.3;
const INITIAL_PITCH = 0.4;

/**
 * Mouse → yaw/pitch da câmera via Pointer Lock: clique no canvas captura o
 * ponteiro, Esc solta (comportamento do navegador). Sem captura, mover o
 * mouse não gira a câmera.
 */
export function createMouseLook(canvas: HTMLCanvasElement): MouseLook {
  let yaw = 0;
  let pitch = INITIAL_PITCH;
  let sensitivity = BASE_SENSITIVITY;

  const onClick = (): void => {
    if (document.pointerLockElement === canvas) return;
    try {
      // Pode rejeitar (ex.: Chrome impõe pausa após o Esc); o próximo clique resolve.
      const result = canvas.requestPointerLock() as unknown as Promise<void> | undefined;
      result?.catch?.(() => {});
    } catch {
      /* navegador sem suporte: o jogo segue com a câmera fixa */
    }
  };

  const onMouseMove = (event: MouseEvent): void => {
    if (document.pointerLockElement !== canvas) return;
    yaw -= event.movementX * sensitivity;
    // Vertical invertida: mouse para cima abaixa a câmera, mirando o céu.
    pitch += event.movementY * sensitivity;
    if (pitch < MIN_PITCH) pitch = MIN_PITCH;
    if (pitch > MAX_PITCH) pitch = MAX_PITCH;
  };

  canvas.addEventListener('click', onClick);
  document.addEventListener('mousemove', onMouseMove);

  return {
    get yaw(): number {
      return yaw;
    },
    get pitch(): number {
      return pitch;
    },
    lock(): void {
      onClick();
    },
    unlock(): void {
      if (document.pointerLockElement === canvas) document.exitPointerLock();
    },
    setSensitivity(multiplier: number): void {
      if (!Number.isFinite(multiplier) || multiplier <= 0) return;
      sensitivity = BASE_SENSITIVITY * multiplier;
    },
    dispose(): void {
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('mousemove', onMouseMove);
    },
  };
}
