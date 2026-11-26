import type { World } from '../sim/world';
import { UPGRADE_CHOICE_COUNT } from '../data/upgrades';

/**
 * Overlay "Panfleto na Esquina": uma mão estende panfletos toscos com as
 * melhorias sorteadas. A UI lê `world.upgradeChoice` e dispara ações via
 * callbacks — nunca mexe na simulação por dentro (ver TECH, fronteira 4).
 *
 * O DOM e o CSS nascem aqui (nada no index.html): o overlay é DOM por cima
 * do canvas, então o texto fica nítido mesmo com o render interno em 270p.
 */

export interface UpgradeOverlayActions {
  /** Escolhe a opção exibida no slot `optionIndex` (0..opções-1). */
  choose(optionIndex: number): void;
  /** Pede o re-sorteio das opções (1 grátis por level-up). */
  reroll(): void;
}

export interface UpgradeOverlay {
  readonly visible: boolean;
  /**
   * Reconcilia o DOM com o estado, uma vez por frame: abre quando surge uma
   * escolha, re-renderiza quando as opções mudam (reroll ou próxima tela da
   * fila — `chooseUpgrade` pode reabrir na hora) e fecha quando a escolha
   * some. Sem mudança, não toca no DOM.
   */
  sync(world: World): void;
}

/** Faixas de topo dos panfletos, variando por slot para o mural parecer vivo. */
const BANNERS = ['PROMOÇÃO!!!', 'SÓ HOJE!!!', 'IMPERDÍVEL!!!'] as const;

/**
 * Janela em que uma tela recém-aberta ignora escolha: evita que um clique
 * duplo (ou tecla segurada) do panfleto anterior escolha sem querer na
 * próxima tela da fila, que abre no mesmo lugar.
 */
const INPUT_GUARD_MS = 250;

export function createUpgradeOverlay(actions: UpgradeOverlayActions): UpgradeOverlay {
  injectStylesOnce();

  const root = document.createElement('div');
  root.id = 'upgrade-overlay';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Escolha de melhoria');
  root.hidden = true;

  const title = el('h1', 'upgrade-title', 'SUBIU DE NÍVEL!');
  const hint = el('p', 'upgrade-hint', '');
  const queueNote = el('p', 'upgrade-queue', '');
  queueNote.hidden = true;

  // A mão que estende os panfletos: puramente decorativa.
  const arm = el('div', 'upgrade-arm', null);
  arm.setAttribute('aria-hidden', 'true');

  let flyers = el('div', 'upgrade-flyers', null);

  const rerollButton = document.createElement('button');
  rerollButton.type = 'button';
  rerollButton.id = 'upgrade-reroll';
  rerollButton.append(
    el('span', 'reroll-label', 'Pedir outro panfleto'),
    el('span', 'reroll-sub', 'troca os 3 — só uma vez'),
  );

  root.append(arm, title, hint, queueNote, flyers, rerollButton);
  document.body.append(root);

  let visible = false;
  /** Opções renderizadas, por referência: a sim troca o array a cada sorteio. */
  let renderedOptions: readonly number[] | null = null;
  let acceptInputAt = 0;

  function guardedChoose(optionIndex: number): void {
    if (performance.now() < acceptInputAt) return;
    if (renderedOptions === null || optionIndex >= renderedOptions.length) return;
    actions.choose(optionIndex);
  }

  rerollButton.addEventListener('click', () => {
    if (performance.now() < acceptInputAt) return;
    actions.reroll();
  });

  function render(world: World): void {
    const choice = world.upgradeChoice;
    if (choice === null) return;
    renderedOptions = choice.options;
    acceptInputAt = performance.now() + INPUT_GUARD_MS;

    const count = choice.options.length;
    hint.textContent = count === 1 ? 'Clique no panfleto para pegar.' : 'Clique num panfleto para pegar.';

    const queued = world.pendingLevelUps - 1;
    if (queued > 0) {
      queueNote.textContent =
        queued === 1
          ? 'E tem fila: falta mais 1 panfleto depois deste.'
          : `E tem fila: faltam mais ${queued} panfletos depois deste.`;
      queueNote.hidden = false;
    } else {
      queueNote.hidden = true;
    }

    // Container novo a cada tela: replay da animação de entrada sinaliza que
    // as opções mudaram (reroll ou próxima tela da fila).
    const next = el('div', 'upgrade-flyers', null);
    for (let slot = 0; slot < count; slot++) {
      next.append(buildFlyer(world, choice.options[slot]!, slot));
    }
    flyers.replaceWith(next);
    flyers = next;

    // Com menos de 3 opções elegíveis o re-sorteio devolve o mesmo conjunto
    // (regra do GDD): o botão some para não vender um reroll inútil.
    rerollButton.hidden = !(choice.rerollAvailable && count >= UPGRADE_CHOICE_COUNT);
  }

  function buildFlyer(world: World, upgradeIndex: number, slot: number): HTMLButtonElement {
    const def = world.data.upgrades[upgradeIndex];
    if (def === undefined) {
      throw new Error(`upgradeChoice aponta para melhoria inexistente: ${upgradeIndex}`);
    }
    const stacks = world.upgradeStacks[upgradeIndex] ?? 0;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = `flyer flyer-paper-${slot % 3}`;
    button.addEventListener('click', () => guardedChoose(slot));

    // Sempre textContent: texto vindo de dados nunca entra como HTML.
    button.append(
      el('span', 'flyer-banner', BANNERS[slot % BANNERS.length]!),
      // O mesmo ícone do adesivo da HUD: o jogador reconhece o que pegou.
      el('span', 'flyer-icon', def.icon),
      el('span', 'flyer-name', def.name),
      el('span', 'flyer-effect', def.effectLine),
      el(
        'span',
        'flyer-stacks',
        Number.isFinite(def.maxStacks)
          ? `já colou ${stacks}/${def.maxStacks}`
          : 'pode pegar sempre que aparecer',
      ),
      el('span', 'flyer-key', 'clique para pegar'),
    );

    // Penúltimo stack: aviso em forma de adesivo (forma e posição, não só cor).
    if (Number.isFinite(def.maxStacks) && stacks + 1 === def.maxStacks) {
      button.append(el('span', 'flyer-last', 'ÚLTIMA!'));
    }
    return button;
  }

  function hide(): void {
    visible = false;
    renderedOptions = null;
    root.hidden = true;
    // Botão focado não pode sobrar recebendo Espaço/Enter do jogo retomado.
    if (document.activeElement instanceof HTMLElement && root.contains(document.activeElement)) {
      document.activeElement.blur();
    }
  }

  return {
    get visible(): boolean {
      return visible;
    },
    sync(world: World): void {
      const choice = world.upgradeChoice;
      if (choice === null) {
        if (visible) hide();
        return;
      }
      if (!visible) {
        visible = true;
        root.hidden = false;
      }
      if (renderedOptions !== choice.options) render(world);
    },
  };
}

function el(tag: string, className: string, text: string | null): HTMLElement {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== null) node.textContent = text;
  return node;
}

function injectStylesOnce(): void {
  if (document.getElementById('upgrade-overlay-style') !== null) return;
  const style = document.createElement('style');
  style.id = 'upgrade-overlay-style';
  style.textContent = OVERLAY_CSS;
  document.head.append(style);
}

/**
 * Estilo do overlay. As variáveis no topo são a fonte única de cor, tipo e
 * espaçamento daqui; os valores espelham a paleta do index.html (hoje
 * hard-codada lá — unificar num :root é dívida fora deste arquivo).
 */
const OVERLAY_CSS = `
#upgrade-overlay {
  --ui-dim: rgba(10, 8, 14, 0.78);
  --ui-text: #e8e4da;
  --ui-ink: #26180b;
  --ui-paper-0: #fff3b0;
  --ui-paper-1: #ffd6ec;
  --ui-paper-2: #d2f4ff;
  --ui-promo: #e8231a;
  --ui-promo-ink: #fffbe6;
  --ui-accent: #ffe066;
  --ui-panel: #2a2433;
  --ui-panel-hover: #3a3145;
  --ui-shadow: #2a1016;
  --ui-skin: #e0a46c;
  --ui-sleeve: #3f6d3a;
  --ui-gap: 16px;
  --ui-radius: 8px;

  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ui-gap);
  padding: calc(var(--ui-gap) * 1.5);
  overflow: auto;
  background: var(--ui-dim);
  color: var(--ui-text);
  text-align: center;
}
#upgrade-overlay[hidden] { display: none; }

.upgrade-title {
  margin: 0;
  font-size: clamp(26px, 5vw, 44px);
  color: var(--ui-accent);
  transform: rotate(-2deg);
  text-shadow: 3px 3px 0 var(--ui-shadow);
}
.upgrade-hint { margin: 0; font-size: 17px; }
.upgrade-queue {
  margin: 0;
  padding: 4px 14px;
  background: var(--ui-paper-0);
  color: var(--ui-ink);
  border-radius: 4px;
  transform: rotate(1.5deg);
  font-size: 15px;
  box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.45);
}

.upgrade-flyers {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--ui-gap);
  max-width: 920px;
  animation: upgrade-flyers-in 0.35s cubic-bezier(0.22, 1.2, 0.36, 1) both;
}
@keyframes upgrade-flyers-in {
  from { transform: translateY(60px); opacity: 0; }
  to { transform: none; opacity: 1; }
}

.flyer {
  --flyer-tilt: 0deg;
  --flyer-shift: 0px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: clamp(170px, 24vw, 230px);
  min-height: 230px;
  padding: 14px 12px 16px;
  font: inherit;
  color: var(--ui-ink);
  background: var(--ui-paper-0);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px; /* papel de rua, não botão bonito */
  box-shadow: 4px 6px 0 rgba(0, 0, 0, 0.45);
  cursor: pointer;
  transform: rotate(var(--flyer-tilt)) translateY(var(--flyer-shift));
  transition: transform 0.12s ease-out;
  will-change: transform;
}
.flyer-paper-1 { background: var(--ui-paper-1); }
.flyer-paper-2 { background: var(--ui-paper-2); }
.upgrade-flyers .flyer:nth-child(1) { --flyer-tilt: -3.5deg; }
.upgrade-flyers .flyer:nth-child(2) { --flyer-tilt: 1.8deg; --flyer-shift: 10px; }
.upgrade-flyers .flyer:nth-child(3) { --flyer-tilt: 4deg; }
.upgrade-flyers .flyer:hover,
.upgrade-flyers .flyer:focus-visible {
  transform: rotate(var(--flyer-tilt)) translateY(var(--flyer-shift)) scale(1.06);
}
/* Amarelo sobre o fundo escurecido: o contorno fica fora do papel. */
.flyer:focus-visible { outline: 4px dashed var(--ui-accent); outline-offset: 4px; }

.flyer-banner {
  align-self: stretch;
  padding: 3px 0;
  background: var(--ui-promo);
  color: var(--ui-promo-ink);
  font-weight: bold;
  font-size: 15px;
  letter-spacing: 1px;
  transform: rotate(-2deg);
}
.flyer-icon { font-size: 30px; line-height: 1.1; }
.flyer-name { font-size: 19px; font-weight: bold; line-height: 1.15; }
.flyer-effect { font-size: 15px; line-height: 1.25; }
.flyer-stacks { font-size: 13px; opacity: 0.85; }
.flyer-key {
  margin-top: auto;
  align-self: stretch;
  padding-top: 6px;
  border-top: 2px dashed rgba(0, 0, 0, 0.4);
  font-size: 14px;
}
.flyer-last {
  position: absolute;
  top: -10px;
  right: -12px;
  padding: 4px 8px;
  background: var(--ui-promo);
  color: var(--ui-promo-ink);
  font-size: 12px;
  font-weight: bold;
  border-radius: 999px;
  transform: rotate(12deg);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
}

#upgrade-reroll {
  position: relative;
  z-index: 1;
  font: inherit;
  font-size: 17px;
  padding: 12px 28px;
  border-radius: var(--ui-radius);
  border: 2px solid var(--ui-accent);
  background: var(--ui-panel);
  color: var(--ui-accent);
  cursor: pointer;
  transform: rotate(-1.5deg);
}
#upgrade-reroll:hover { background: var(--ui-panel-hover); }
#upgrade-reroll:focus-visible { outline: 3px dashed var(--ui-accent); outline-offset: 3px; }
#upgrade-reroll[hidden] { display: none; }
.reroll-label { display: block; }
.reroll-sub { display: block; font-size: 12px; opacity: 0.8; }

/* A mão entra pela lateral esquerda estendendo os panfletos (GDD). */
.upgrade-arm {
  position: absolute;
  left: 0;
  top: 52%;
  z-index: 0;
  width: 40vw;
  height: 88px;
  background: var(--ui-sleeve);
  border-radius: 0 18px 18px 0;
  transform: translateY(-50%) rotate(-3deg);
  transform-origin: left center;
  animation: upgrade-arm-in 0.45s cubic-bezier(0.22, 1.1, 0.36, 1) both;
}
.upgrade-arm::before { /* palma */
  content: '';
  position: absolute;
  right: -48px;
  top: 50%;
  width: 84px;
  height: 72px;
  background: var(--ui-skin);
  border-radius: 14px 30px 30px 14px;
  transform: translateY(-50%);
}
.upgrade-arm::after { /* dedos segurando os papéis */
  content: '';
  position: absolute;
  right: -66px;
  top: 50%;
  width: 30px;
  height: 18px;
  background: var(--ui-skin);
  border-radius: 9px;
  transform: translateY(-50%);
  box-shadow: 4px -24px 0 0 var(--ui-skin), 2px 24px 0 0 var(--ui-skin);
}
@keyframes upgrade-arm-in {
  from { transform: translateY(-50%) rotate(-3deg) translateX(-110%); }
  to { transform: translateY(-50%) rotate(-3deg) translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
  #upgrade-overlay .upgrade-arm,
  #upgrade-overlay .upgrade-flyers {
    animation: none;
  }
  #upgrade-overlay .flyer { transition: none; }
}

/* Janela estreita ou baixa: panfletos quebram linha e a mão sai de cena. */
@media (max-width: 640px), (max-height: 560px) {
  #upgrade-overlay { justify-content: flex-start; padding-top: 24px; }
  .upgrade-title { font-size: 26px; }
  .flyer { width: clamp(150px, 44vw, 210px); min-height: 200px; }
  .upgrade-arm { display: none; }
}
`;
