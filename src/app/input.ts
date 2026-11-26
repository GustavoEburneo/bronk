import type { InputFrame } from '../sim/tick';

export interface KeyboardInput {
  /** Retorna o frame de entrada atual. O objeto é reutilizado — não guarde referência. */
  sample(): InputFrame;
  dispose(): void;
}

/**
 * Teclado (WASD + setas) → InputFrame em espaço local da câmera: W é "para
 * frente" (moveZ = -1) e D é "para a direita". A conversão para espaço de
 * mundo é feita por rotateFrameToCamera com o yaw atual da câmera.
 */
/**
 * Rotaciona o frame local da câmera para o espaço de mundo, no plano do chão.
 * Com a câmera atrás do player olhando para (sin(yaw), cos(yaw)), W afasta o
 * player da câmera e D move para a direita da tela. Muta e retorna o frame.
 */
export function rotateFrameToCamera(frame: InputFrame, yaw: number): InputFrame {
  const forward = -frame.moveZ;
  const right = frame.moveX;
  const sin = Math.sin(yaw);
  const cos = Math.cos(yaw);
  frame.moveX = forward * sin - right * cos;
  frame.moveZ = forward * cos + right * sin;
  return frame;
}

export function createKeyboardInput(target: Window): KeyboardInput {
  const pressed = new Set<string>();
  const frame: InputFrame = { moveX: 0, moveZ: 0, jump: false };

  const onKeyDown = (event: KeyboardEvent): void => {
    pressed.add(event.code);
  };
  const onKeyUp = (event: KeyboardEvent): void => {
    pressed.delete(event.code);
  };
  const onBlur = (): void => {
    pressed.clear();
  };

  target.addEventListener('keydown', onKeyDown);
  target.addEventListener('keyup', onKeyUp);
  target.addEventListener('blur', onBlur);

  return {
    sample(): InputFrame {
      let x = 0;
      let z = 0;
      if (pressed.has('KeyA') || pressed.has('ArrowLeft')) x -= 1;
      if (pressed.has('KeyD') || pressed.has('ArrowRight')) x += 1;
      if (pressed.has('KeyW') || pressed.has('ArrowUp')) z -= 1;
      if (pressed.has('KeyS') || pressed.has('ArrowDown')) z += 1;
      const length = Math.hypot(x, z);
      if (length > 1) {
        x /= length;
        z /= length;
      }
      frame.moveX = x;
      frame.moveZ = z;
      // Pulo (Espaço) é da SIM desde 2026-11-24 (esquiva o contato no alto):
      // entra no frame como o movimento, nunca por canal paralelo.
      frame.jump = pressed.has('Space');
      return frame;
    },
    dispose(): void {
      target.removeEventListener('keydown', onKeyDown);
      target.removeEventListener('keyup', onKeyUp);
      target.removeEventListener('blur', onBlur);
    },
  };
}
