import * as THREE from 'three';
import type { World } from '../sim/world';
import type { GroundHeightFn } from './terrain';

/**
 * Números de dano flutuantes + vinheta de dano do jogador (2026-11-24).
 * Camada DOM por cima do canvas (texto nítido, como a HUD): a cada draw o
 * módulo compara `hitTick`/`lastHitTick` da sim com o último tick processado
 * e solta um rótulo na posição PROJETADA do golpe — ele flutua e some via
 * animação CSS, sem seguir o alvo (vida curta; é o padrão do gênero).
 *
 * - Números de INIMIGO (amarelo; crítico maior e laranja) e do JOGADOR
 *   (vermelho, com "-") obedecem à configuração `showDamageNumbers`.
 * - A VINHETA vermelha de dano sofrido é efeito de hit, não número: sempre ativa.
 *
 * Vive no render (precisa da câmera e do relevo para projetar), mas só produz
 * DOM — nenhum objeto three na cena. Criado por partida (beginMatch) e
 * removido no endMatch, como o resto da cena.
 */

export interface DamageNumbers {
  update(world: World, camera: THREE.PerspectiveCamera, showNumbers: boolean): void;
  dispose(): void;
}

/** Rótulos simultâneos no teto: além disso, golpes novos são descartados. */
const MAX_LABELS = 40;
/** Vida do rótulo (casa com a animação CSS). */
const LABEL_LIFETIME_MS = 700;
/** Janela da vinheta, em ticks (~0,33 s a 60 Hz). */
const VIGNETTE_TICKS = 20;

const STYLE_ID = 'damage-numbers-style';

export function createDamageNumbers(ground: GroundHeightFn): DamageNumbers {
  if (document.getElementById(STYLE_ID) === null) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = DAMAGE_CSS;
    document.head.append(style);
  }

  const root = document.createElement('div');
  root.className = 'dmg-layer';
  const vignette = document.createElement('div');
  vignette.className = 'dmg-vignette';
  root.append(vignette);
  document.body.append(root);

  let liveLabels = 0;
  /**
   * Primeiro tick AINDA NÃO processado. Os golpes de um draw têm `hitTick` em
   * [tickCount anterior, tickCount atual): o tickCount incrementa DEPOIS dos
   * sistemas, então um golpe do tick T é gravado com T e o draw seguinte vê
   * tickCount = T+1. (Correção de 2026-11-24: a janela antiga usava `>` e
   * perdia TODO golpe quando rodava 1 tick por frame — a 60 FPS, sempre.)
   */
  let nextTick = 0;
  const projected = new THREE.Vector3();

  function spawnLabel(
    camera: THREE.PerspectiveCamera,
    x: number,
    y: number,
    z: number,
    text: string,
    className: string,
  ): void {
    if (liveLabels >= MAX_LABELS) return;
    projected.set(x, y, z).project(camera);
    // Atrás da câmera ou fora da tela: não gasta DOM com o invisível.
    if (projected.z > 1 || Math.abs(projected.x) > 1.05 || Math.abs(projected.y) > 1.05) return;

    const label = document.createElement('span');
    label.className = `dmg-label ${className}`;
    label.textContent = text;
    label.style.left = `${((projected.x + 1) / 2) * 100}%`;
    label.style.top = `${((1 - projected.y) / 2) * 100}%`;
    root.append(label);
    liveLabels++;
    window.setTimeout(() => {
      label.remove();
      liveLabels--;
    }, LABEL_LIFETIME_MS);
  }

  return {
    update(world: World, camera: THREE.PerspectiveCamera, showNumbers: boolean): void {
      // Restart: o mundo novo recomeça o relógio — re-ancora o processamento.
      if (world.tickCount < nextTick) nextTick = 0;

      // Vinheta de dano sofrido (sempre ativa): decai ao longo da janela.
      const sinceHit = world.tickCount - world.player.lastHitTick;
      const strength =
        world.player.lastHitTick >= 0 && sinceHit < VIGNETTE_TICKS
          ? 1 - sinceHit / VIGNETTE_TICKS
          : 0;
      vignette.style.opacity = strength === 0 ? '0' : String(0.5 * strength);

      if (showNumbers) {
        const enemies = world.enemies;
        for (let i = 0; i < enemies.count; i++) {
          const hitTick = enemies.hitTick[i]!;
          if (hitTick < nextTick || hitTick >= world.tickCount) continue;
          const x = enemies.posX[i]!;
          const z = enemies.posZ[i]!;
          const crit = enemies.hitCrit[i]! === 1;
          spawnLabel(
            camera,
            x,
            ground(x, z) + 1.3,
            z,
            String(Math.max(1, Math.round(enemies.hitDamage[i]!))),
            crit ? 'dmg-crit' : 'dmg-enemy',
          );
        }
        const playerHitTick = world.player.lastHitTick;
        if (playerHitTick >= nextTick && playerHitTick < world.tickCount) {
          spawnLabel(
            camera,
            world.player.x,
            ground(world.player.x, world.player.z) + 1.7,
            world.player.z,
            `-${Math.max(1, Math.round(world.player.lastHitDamage))}`,
            'dmg-player',
          );
        }
      }

      nextTick = world.tickCount;
    },
    dispose(): void {
      root.remove();
    },
  };
}

const DAMAGE_CSS = `
.dmg-layer {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 4; /* acima do canvas, abaixo dos overlays de UI (que usam 10+) */
}
.dmg-vignette {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 90ms linear;
  box-shadow: inset 0 0 120px 40px rgba(205, 30, 20, 0.85);
}
.dmg-label {
  position: absolute;
  transform: translate(-50%, -100%);
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
  font-weight: bold;
  font-size: 17px;
  color: #ffe066;
  -webkit-text-stroke: 3px rgba(20, 10, 4, 0.9);
  paint-order: stroke fill;
  animation: dmg-float ${LABEL_LIFETIME_MS}ms ease-out forwards;
  white-space: nowrap;
}
.dmg-crit {
  font-size: 24px;
  color: #ff9f2a;
}
.dmg-player {
  font-size: 22px;
  color: #ff4a3a;
}
@keyframes dmg-float {
  0% { translate: 0 0; opacity: 1; scale: 1.25; }
  20% { scale: 1; }
  100% { translate: 0 -46px; opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .dmg-label { animation-duration: 1ms; }
}
`;
