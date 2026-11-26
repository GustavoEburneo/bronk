import * as THREE from 'three';
import type { World } from '../sim/world';
import { applyVertexSnap } from './retro';
import type { GroundHeightFn } from './terrain';

/**
 * Vista dos orelhões (2026-11-24): o aparelho laranja clássico (poste + concha
 * acústica) assentado no relevo, com um RÓTULO DOM projetado por cima dizendo
 * o requisito de abates — vermelho enquanto falta, verde pulsando quando dá
 * para atender, ✅ depois de atendido. O rótulo é a REGRA do orelhão visível
 * no mundo (sem ele o jogador não teria como saber o número).
 *
 * Grupos pré-criados na capacidade da rampa (≤ ~6) e reciclados por estado;
 * zero alocação por frame fora do texto do rótulo (throttled por mudança).
 */

export interface OrelhaoView {
  readonly group: THREE.Group;
  update(world: World, camera: THREE.PerspectiveCamera): void;
  dispose(): void;
}

const STYLE_ID = 'orelhao-view-style';

export function createOrelhaoView(capacity: number, ground: GroundHeightFn): OrelhaoView {
  if (document.getElementById(STYLE_ID) === null) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = ORELHAO_CSS;
    document.head.append(style);
  }

  const group = new THREE.Group();
  const layer = document.createElement('div');
  layer.className = 'orelhao-layer';
  document.body.append(layer);

  // Materiais/geometrias compartilhados entre os aparelhos.
  const shellWaiting = applyVertexSnap(new THREE.MeshLambertMaterial({
    color: 0xe8862a,
    side: THREE.DoubleSide,
  }));
  const shellAnswered = applyVertexSnap(new THREE.MeshLambertMaterial({
    color: 0x8a9a8a,
    side: THREE.DoubleSide,
  }));
  const poleMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x4a4a52 }));
  const phoneMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x26242a }));
  // Concha: meia-casca de esfera (a "orelha" laranja icônica).
  const shellGeometry = new THREE.SphereGeometry(0.62, 8, 6, 0, Math.PI);
  const poleGeometry = new THREE.CylinderGeometry(0.07, 0.09, 1.3, 5);
  const phoneGeometry = new THREE.BoxGeometry(0.16, 0.34, 0.12);

  interface Slot {
    root: THREE.Group;
    shell: THREE.Mesh;
    label: HTMLSpanElement;
    /** Último texto escrito (evita reescrever DOM por frame). */
    text: string;
  }
  const slots: Slot[] = [];
  for (let i = 0; i < capacity; i++) {
    const root = new THREE.Group();
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 0.65;
    const shell = new THREE.Mesh(shellGeometry, shellWaiting);
    shell.position.y = 1.55;
    shell.rotation.y = Math.PI / 2; // abertura de frente para -Z local
    const phone = new THREE.Mesh(phoneGeometry, phoneMaterial);
    phone.position.set(0, 1.45, -0.18);
    root.add(pole, shell, phone);
    root.visible = false;
    group.add(root);

    const label = document.createElement('span');
    label.className = 'orelhao-label';
    label.hidden = true;
    layer.append(label);

    slots.push({ root, shell, label, text: '' });
  }

  const projected = new THREE.Vector3();

  return {
    group,
    update(world: World, camera: THREE.PerspectiveCamera): void {
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i]!;
        const state = world.orelhoes[i];
        if (state === undefined) {
          slot.root.visible = false;
          slot.label.hidden = true;
          continue;
        }

        slot.root.visible = true;
        const baseY = ground(state.x, state.z);
        slot.root.position.set(state.x, baseY, state.z);
        slot.shell.material = state.answered ? shellAnswered : shellWaiting;

        const ready = !state.answered && world.kills >= state.requirement;
        // Tocando e pronto para atender: o aparelho "vibra" chamando.
        slot.root.rotation.z = ready ? Math.sin(world.time * 22) * 0.07 : 0;

        // Rótulo projetado acima da concha.
        projected.set(state.x, baseY + 2.3, state.z).project(camera);
        const onScreen =
          projected.z < 1 && Math.abs(projected.x) <= 1.02 && Math.abs(projected.y) <= 1.02;
        slot.label.hidden = !onScreen;
        if (!onScreen) continue;
        slot.label.style.left = `${((projected.x + 1) / 2) * 100}%`;
        slot.label.style.top = `${((1 - projected.y) / 2) * 100}%`;

        const text = state.answered
          ? '✅ atendido'
          : `📞 ${Math.min(world.kills, state.requirement)}/${state.requirement} abates`;
        if (text !== slot.text) {
          slot.text = text;
          slot.label.textContent = text;
        }
        slot.label.classList.toggle('ready', ready);
        slot.label.classList.toggle('answered', state.answered);
      }
    },
    dispose(): void {
      layer.remove();
    },
  };
}

const ORELHAO_CSS = `
.orelhao-layer {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 4; /* como a camada de dano: acima do canvas, abaixo dos overlays */
}
.orelhao-label {
  position: absolute;
  transform: translate(-50%, -100%);
  /* Pilha de fonte duplicada CONSCIENTEMENTE (render não importa de ui/;
     a família é global via @fontsource no main — ver src/theme/tokens.ts e
     index.html). */
  font-family: 'Barlow Condensed', 'Arial Narrow', 'Liberation Sans Narrow',
    'Helvetica Neue', sans-serif;
  font-weight: 700; /* peso embarcado da Barlow (500/600/700 no main) */
  font-size: 14px;
  white-space: nowrap;
  /* Cores CLARAS de propósito (legibilidade sobre o 3D): o salmão pendente e
     o verde-claro pronto não têm token equivalente — ficam literais. */
  color: #ffb0a6;
  /* Contorno escuro no tom do fundo do tema (--ui-bg-0), como o damageNumbers. */
  -webkit-text-stroke: 3px rgba(12, 17, 24, 0.9);
  paint-order: stroke fill;
}
.orelhao-label.ready {
  color: #8aff7a;
  animation: orelhao-ring 0.5s steps(2) infinite;
}
.orelhao-label.answered { color: #cfc8b4; }
.orelhao-label[hidden] { display: none; }
/* Pulso só de escala (o torto do tema antigo morreu — sem rotate decorativo). */
@keyframes orelhao-ring {
  50% { transform: translate(-50%, -100%) scale(1.15); }
}
@media (prefers-reduced-motion: reduce) {
  .orelhao-label.ready { animation: none; }
}
`;
