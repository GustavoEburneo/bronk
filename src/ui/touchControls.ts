import type { InputFrame } from '../sim/tick';
import { el, injectStyleOnce } from './screens/screenTheme';

/**
 * Controles de TOQUE (celular/tablet, 2026-11-26) — o jogo vira jogável sem
 * teclado/mouse:
 *
 * - METADE ESQUERDA da tela: joystick virtual de movimento. O toque ancora a
 *   base onde o dedo pousou (padrão do gênero: nada de posição fixa que o
 *   polegar tem que achar às cegas) e o knob segue o dedo até o raio máximo.
 * - METADE DIREITA: arrastar gira a câmera. O delta vai para o MESMO caminho
 *   do mouse (`mouseLook.nudge`): mesma sensibilidade da configuração, mesma
 *   inversão e clamp — só com um ganho extra, porque o polegar percorre menos
 *   pixels que um mouse.
 * - Botões de PULO (segurável, como o Espaço) e PAUSA, dentro da camada #hud:
 *   somem com ela no menu, e os overlays (z-index 10) os cobrem quando abertos.
 *
 * Os listeners de jogo ficam no CANVAS via Pointer Events filtrados por
 * `pointerType === 'touch'`: mouse/caneta seguem no fluxo do pointer lock, e
 * em menus/overlays o DOM por cima recebe o toque — o canvas nem vê. Os
 * BOTÕES só aparecem em tela de toque (`@media (pointer: coarse)`); os
 * listeners sem toque nunca disparam, então criar sempre é inofensivo.
 *
 * O módulo NÃO conhece a sim: ele só mescla seu estado no InputFrame do
 * teclado (`merge`), e o integrador segue rotacionando pelo yaw da câmera.
 */

export interface TouchControls {
  /**
   * Mescla o estado de toque no frame vindo do teclado: o joystick, quando
   * ativo, VENCE o teclado (não soma — evita diagonal fantasma em híbridos);
   * o pulo é OR (segurar o botão = segurar Espaço).
   */
  merge(frame: InputFrame): InputFrame;
  dispose(): void;
}

/** Raio máximo do knob (px): além disso o vetor satura em 1. */
const STICK_RADIUS = 56;
/** Zona morta do joystick (fração do raio): tremida de polegar não anda. */
const STICK_DEADZONE = 0.16;
/**
 * Ganho do arrasto de câmera sobre a sensibilidade do mouse: o polegar cobre
 * ~1/3 dos pixels de um movimento de mouse equivalente.
 */
const LOOK_GAIN = 2.4;

export function createTouchControls(
  canvas: HTMLCanvasElement,
  hudLayer: HTMLElement,
  deps: {
    /** Delta de olhar em px (vai para mouseLook.nudge — sensibilidade de lá). */
    nudgeLook(deltaX: number, deltaY: number): void;
    /** Mesmo alternar de pausa do Esc/P (o integrador aplica as guardas). */
    togglePause(): void;
  },
): TouchControls {
  injectStyleOnce('touch-controls-style', TOUCH_CSS);

  // --- Visual do joystick (só aparece enquanto um toque de movimento vive) ---
  const stickKnob = el('div', 'tc-stick-knob', null);
  const stickBase = el('div', 'tc-stick', null);
  stickBase.append(stickKnob);
  stickBase.hidden = true;

  // --- Botões (na camada da HUD: somem no menu junto com ela) ---------------
  const jumpButton = document.createElement('button');
  jumpButton.type = 'button';
  jumpButton.className = 'tc-btn tc-jump';
  jumpButton.textContent = 'PULO';
  jumpButton.setAttribute('aria-label', 'Pular (segure)');

  const pauseButton = document.createElement('button');
  pauseButton.type = 'button';
  pauseButton.className = 'tc-btn tc-pause';
  pauseButton.textContent = '❚❚';
  pauseButton.setAttribute('aria-label', 'Pausar');

  hudLayer.append(stickBase, jumpButton, pauseButton);

  // --- Estado -----------------------------------------------------------------
  /** pointerId do toque do joystick (-1 = nenhum). */
  let movePointer = -1;
  let moveOriginX = 0;
  let moveOriginY = 0;
  let moveX = 0;
  let moveZ = 0;
  /** pointerId do toque de câmera (-1 = nenhum). */
  let lookPointer = -1;
  let lookLastX = 0;
  let lookLastY = 0;
  let jumpHeld = false;

  function releaseMove(): void {
    movePointer = -1;
    moveX = 0;
    moveZ = 0;
    stickBase.hidden = true;
  }

  const onPointerDown = (event: PointerEvent): void => {
    if (event.pointerType !== 'touch') return;
    // Sem compatibility mouse events: o click sintetizado tentaria o pointer
    // lock (fluxo do mouse) à toa num navegador de celular. Captura explícita
    // não é preciso (nem seguro — pode lançar com o toque já solto): toque tem
    // captura IMPLÍCITA no alvo do pointerdown, por spec.
    event.preventDefault();

    if (event.clientX < window.innerWidth / 2 && movePointer === -1) {
      movePointer = event.pointerId;
      moveOriginX = event.clientX;
      moveOriginY = event.clientY;
      moveX = 0;
      moveZ = 0;
      stickBase.hidden = false;
      stickBase.style.left = `${moveOriginX}px`;
      stickBase.style.top = `${moveOriginY}px`;
      stickKnob.style.transform = 'translate(0px, 0px)';
    } else if (lookPointer === -1) {
      lookPointer = event.pointerId;
      lookLastX = event.clientX;
      lookLastY = event.clientY;
    }
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (event.pointerType !== 'touch') return;
    if (event.pointerId === movePointer) {
      let dx = event.clientX - moveOriginX;
      let dy = event.clientY - moveOriginY;
      const dist = Math.hypot(dx, dy);
      if (dist > STICK_RADIUS) {
        dx *= STICK_RADIUS / dist;
        dy *= STICK_RADIUS / dist;
      }
      stickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
      // Tela: +Y é para BAIXO; o frame local usa a convenção do teclado
      // (W = moveZ -1 = frente), então dy mapeia direto em moveZ.
      const magnitude = Math.min(dist, STICK_RADIUS) / STICK_RADIUS;
      if (magnitude < STICK_DEADZONE) {
        moveX = 0;
        moveZ = 0;
      } else {
        moveX = dx / STICK_RADIUS;
        moveZ = dy / STICK_RADIUS;
      }
    } else if (event.pointerId === lookPointer) {
      deps.nudgeLook(
        (event.clientX - lookLastX) * LOOK_GAIN,
        (event.clientY - lookLastY) * LOOK_GAIN,
      );
      lookLastX = event.clientX;
      lookLastY = event.clientY;
    }
  };

  const onPointerEnd = (event: PointerEvent): void => {
    if (event.pointerType !== 'touch') return;
    if (event.pointerId === movePointer) releaseMove();
    if (event.pointerId === lookPointer) lookPointer = -1;
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerEnd);
  canvas.addEventListener('pointercancel', onPointerEnd);

  // Pulo segurável: down segura, up/cancel solta — igual ao Espaço na sim.
  const onJumpDown = (event: PointerEvent): void => {
    event.preventDefault(); // sem click sintetizado/zoom de duplo toque
    jumpHeld = true;
  };
  const onJumpEnd = (): void => {
    jumpHeld = false;
  };
  jumpButton.addEventListener('pointerdown', onJumpDown);
  jumpButton.addEventListener('pointerup', onJumpEnd);
  jumpButton.addEventListener('pointercancel', onJumpEnd);

  const onPause = (): void => {
    deps.togglePause();
  };
  pauseButton.addEventListener('click', onPause);

  return {
    merge(frame: InputFrame): InputFrame {
      if (movePointer !== -1) {
        frame.moveX = moveX;
        frame.moveZ = moveZ;
      }
      frame.jump = frame.jump === true || jumpHeld;
      return frame;
    },
    dispose(): void {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerEnd);
      canvas.removeEventListener('pointercancel', onPointerEnd);
      stickBase.remove();
      jumpButton.remove();
      pauseButton.remove();
    },
  };
}

/**
 * Estilo dos controles de toque (tokens do :root). Os BOTÕES só existem para
 * dedo: escondidos fora de `(pointer: coarse)`. O joystick não precisa de
 * media query — sem toque, nunca aparece.
 */
const TOUCH_CSS = `
/* Base do joystick ancorada no ponto do toque (left/top via JS). */
.tc-stick {
  position: fixed;
  width: ${STICK_RADIUS * 2}px;
  height: ${STICK_RADIUS * 2}px;
  margin: -${STICK_RADIUS}px 0 0 -${STICK_RADIUS}px;
  border: 2px solid var(--ui-edge);
  border-radius: 50%;
  background: rgba(22, 35, 58, 0.35); /* --ui-panel translúcido */
  pointer-events: none; /* visual puro: quem rastreia o dedo é o canvas */
  z-index: 6; /* acima da HUD (sem z), abaixo dos overlays (10) */
}
.tc-stick[hidden] { display: none; }
.tc-stick-knob {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 48px;
  height: 48px;
  margin: -24px 0 0 -24px;
  border-radius: 50%;
  background: var(--ui-yellow);
  border: 2px solid var(--ui-yellow-deep);
  opacity: 0.85;
}

/* Botões de dedo: redondos e grandes (alvo mínimo confortável ~56px). */
.tc-btn {
  display: none; /* só em tela de toque (media query abaixo) */
  position: fixed;
  pointer-events: auto; /* a camada #hud é pointer-events: none */
  touch-action: none;   /* sem zoom de duplo toque / scroll no botão */
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  font: inherit;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ui-text);
  background: rgba(22, 35, 58, 0.72); /* --ui-panel translúcido: HUD de jogo */
  border: 2px solid var(--ui-edge);
  border-radius: 50%;
  z-index: 6;
}
.tc-jump {
  right: 20px;
  bottom: 24px;
  width: 76px;
  height: 76px;
  font-size: 15px;
  border-color: var(--ui-green);
}
.tc-jump:active { background: rgba(0, 155, 58, 0.5); }
.tc-pause {
  /* Abaixo do mini-placar do topo-direita, fora do caminho do polegar de pulo. */
  right: 12px;
  top: 96px;
  width: 48px;
  height: 48px;
  font-size: 14px;
}
.tc-btn:focus-visible { outline: 3px solid var(--ui-focus); outline-offset: 2px; }

@media (pointer: coarse) {
  .tc-btn { display: block; }
}
`;
