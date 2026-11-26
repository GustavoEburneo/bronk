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
 * Eventos de mousemove DESCARTADOS logo após adquirir o pointer lock: o
 * Chromium entrega o primeiro movement* com o salto do cursor do sistema até
 * o centro da tela (centenas/milhares de px), e a câmera dava um giro violento
 * a cada clique que travava o ponteiro (início de partida, fechar panfleto,
 * Continuar da pausa). Dois eventos cobrem o navegador que emite o espúrio no
 * frame seguinte ao pointerlockchange.
 */
const SUPPRESS_EVENTS_AFTER_LOCK = 2;
/**
 * Teto de |movementX/Y| por evento (px). Flick legítimo coalescido a ~60 Hz
 * fica bem abaixo disso; só os picos espúrios do navegador (lock, engasgo de
 * frame) passam de 500 — descartar o evento inteiro evita o giro fantasma.
 */
const MAX_EVENT_DELTA = 500;

/**
 * Mouse → yaw/pitch da câmera via Pointer Lock: clique no canvas captura o
 * ponteiro, Esc solta (comportamento do navegador). Sem captura, mover o
 * mouse não gira a câmera.
 */
export function createMouseLook(canvas: HTMLCanvasElement): MouseLook {
  let yaw = 0;
  let pitch = INITIAL_PITCH;
  let sensitivity = BASE_SENSITIVITY;
  /** Eventos ainda a descartar após o último lock (ver SUPPRESS_EVENTS_AFTER_LOCK). */
  let suppressEvents = 0;

  const onPointerLockChange = (): void => {
    // Vale para QUALQUER caminho de lock (clique no canvas, mouseLook.lock()
    // dos overlays): o primeiro movement* pós-lock é suspeito em todos.
    if (document.pointerLockElement === canvas) suppressEvents = SUPPRESS_EVENTS_AFTER_LOCK;
  };

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
    if (suppressEvents > 0) {
      suppressEvents--;
      return;
    }
    // Pico espúrio fora da janela do lock (engasgo de frame): descarta o
    // evento inteiro — aplicar só um eixo torceria a direção do giro.
    if (Math.abs(event.movementX) > MAX_EVENT_DELTA || Math.abs(event.movementY) > MAX_EVENT_DELTA) {
      return;
    }
    yaw -= event.movementX * sensitivity;
    // Vertical invertida: mouse para cima abaixa a câmera, mirando o céu.
    pitch += event.movementY * sensitivity;
    if (pitch < MIN_PITCH) pitch = MIN_PITCH;
    if (pitch > MAX_PITCH) pitch = MAX_PITCH;
  };

  canvas.addEventListener('click', onClick);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('pointerlockchange', onPointerLockChange);

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
      document.removeEventListener('pointerlockchange', onPointerLockChange);
    },
  };
}
