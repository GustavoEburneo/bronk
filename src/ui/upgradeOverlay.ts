import type { World } from '../sim/world';
import { UPGRADE_CHOICE_COUNT } from '../data/upgrades';
import {
  el,
  INPUT_GUARD_MS,
  injectScreenThemeOnce,
  injectStyleOnce,
  MEDIA_COMPACT,
  SB_CHAMFER,
} from './screens/screenTheme';

/**
 * Overlay da escolha de melhoria ("Panfleto na Esquina" no GDD; visual de
 * MERCADO DA BOLA desde o tema "placar esportivo BR" de 2026-11-26: cartas de
 * contratação estilo figurinha de Copa no lugar dos panfletos — a mecânica e
 * os nomes da sim não mudam). A UI lê `world.upgradeChoice` e dispara ações
 * via callbacks — nunca mexe na simulação por dentro (ver TECH, fronteira 4).
 *
 * O DOM e o CSS nascem aqui (nada no index.html): o overlay é DOM por cima do
 * canvas, então o texto fica nítido independente da resolução do render.
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

/** Tarjas de topo das cartas, variando por slot — jargão de janela de transferências. */
const BANNERS = ['CONTRATAÇÃO!', 'REFORÇO!', 'GOLAÇO!'] as const;

export function createUpgradeOverlay(actions: UpgradeOverlayActions): UpgradeOverlay {
  // Tema primeiro: keyframes e reduced-motion compartilhados vêm de lá.
  injectScreenThemeOnce();
  injectStyleOnce('upgrade-overlay-style', OVERLAY_CSS);

  const root = document.createElement('div');
  root.id = 'upgrade-overlay';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Escolha de melhoria');
  root.hidden = true;

  // Faixa diagonal BR de fundo: o "palco" da vinheta (substituiu o braço de
  // CSS do tema panfleto). Puramente decorativa.
  const stripe = el('div', 'upgrade-stripe', null);
  stripe.setAttribute('aria-hidden', 'true');

  const title = el('h1', 'upgrade-title', 'SUBIU DE NÍVEL!');
  const hint = el('p', 'upgrade-hint', '');
  const queueNote = el('p', 'upgrade-queue', '');
  queueNote.hidden = true;

  let flyers = el('div', 'upgrade-flyers', null);

  const rerollButton = document.createElement('button');
  rerollButton.type = 'button';
  rerollButton.id = 'upgrade-reroll';
  rerollButton.append(
    el('span', 'reroll-label', 'Pedir substituição'),
    el('span', 'reroll-sub', 'troca os 3 — só uma vez'),
  );

  root.append(stripe, title, hint, queueNote, flyers, rerollButton);
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
    hint.textContent =
      count === 1 ? 'Clique na carta para contratar.' : 'Clique numa carta para contratar.';

    const queued = world.pendingLevelUps - 1;
    if (queued > 0) {
      queueNote.textContent =
        queued === 1
          ? 'Tem fila no mercado: falta mais 1 contratação depois desta.'
          : `Tem fila no mercado: faltam mais ${queued} contratações depois desta.`;
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
    // `.flyer` é contrato do harness (verify:headless clica nela) — não renomear.
    button.className = `flyer flyer-paper-${slot % 3}`;
    button.addEventListener('click', () => guardedChoose(slot));

    // Sempre textContent: texto vindo de dados nunca entra como HTML.
    button.append(
      el('span', 'flyer-banner', BANNERS[slot % BANNERS.length]!),
      // O mesmo ícone do escudinho da HUD: o jogador reconhece o que pegou.
      el('span', 'flyer-icon', def.icon),
      el('span', 'flyer-name', def.name),
      el('span', 'flyer-effect', def.effectLine),
      el(
        'span',
        'flyer-stacks',
        Number.isFinite(def.maxStacks)
          ? `no elenco ${stacks}/${def.maxStacks}`
          : 'contrata quantas vezes aparecer',
      ),
      el('span', 'flyer-key', 'clique para contratar'),
    );

    // Penúltimo stack: bandeirinha de escanteio (forma e posição, não só cor).
    if (Number.isFinite(def.maxStacks) && stacks + 1 === def.maxStacks) {
      button.append(el('span', 'flyer-last', 'ÚLTIMO LANCE!'));
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

/**
 * Estilo do overlay (cores nos tokens do :root — src/theme/tokens.ts; peças
 * compartilhadas no screenTheme). A carta de contratação recria a receita do
 * painel de placar com MOLDURA clara de figurinha de Copa.
 */
const OVERLAY_CSS = `
#upgrade-overlay {
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
  background: rgba(8, 11, 17, 0.8);
  color: var(--ui-text);
  font-weight: 500;
  text-align: center;
}
#upgrade-overlay[hidden] { display: none; }

/* Faixa diagonal BR translúcida cruzando o fundo: o palco da vinheta. */
.upgrade-stripe {
  position: absolute;
  left: -12%;
  right: -12%;
  top: 54%;
  height: 130px;
  z-index: 0;
  background: var(--ui-stripe);
  opacity: 0.1;
  transform: rotate(-6deg);
  pointer-events: none;
}

/* Letreiro lower third (mesma receita do .screen-title do tema). */
.upgrade-title {
  margin: 0;
  position: relative;
  z-index: 1;
  padding: 10px 28px 12px;
  font-size: clamp(26px, 5vw, 44px);
  font-weight: 700;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1.05;
  color: var(--ui-text);
  background: var(--ui-panel);
  border: 1px solid var(--ui-edge);
  border-left: 6px solid var(--ui-yellow);
  clip-path: ${SB_CHAMFER};
  animation: sb-slide-in 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.upgrade-title::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--ui-stripe);
  pointer-events: none;
}
.upgrade-hint { margin: 0; z-index: 1; font-size: 17px; color: var(--ui-text-dim); }
/* Aviso de fila: chip do VAR. */
.upgrade-queue {
  margin: 0;
  z-index: 1;
  padding: 4px 14px 5px;
  background: var(--ui-yellow);
  color: var(--ui-ink);
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border-left: 4px solid var(--ui-green);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
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

/* Carta de contratação (figurinha de Copa): painel de placar com moldura
   clara. Classe .flyer é contrato do harness. */
.flyer {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: clamp(170px, 24vw, 230px);
  min-height: 230px;
  padding: 12px;
  font: inherit;
  font-weight: 500;
  color: var(--ui-text);
  background: var(--ui-panel);
  border: 3px solid rgba(242, 245, 248, 0.85); /* moldura de figurinha */
  clip-path: ${SB_CHAMFER};
  cursor: pointer;
  transition: transform 0.12s ease-out, background-color 0.12s ease-out;
  will-change: transform;
}
/* Barra de acento por slot (ex-cores de papel): amarelo / verde / azul. */
.flyer-paper-0 { border-left: 6px solid var(--ui-yellow); }
.flyer-paper-1 { border-left: 6px solid var(--ui-green); }
.flyer-paper-2 { border-left: 6px solid var(--ui-blue); }
.upgrade-flyers .flyer:hover {
  background: var(--ui-panel-hover);
  transform: translateY(-5px);
}
/* Foco: anel interno (outline morre no clip-path — regra da casa). */
.flyer:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 3px var(--ui-focus);
  background: var(--ui-panel-hover);
}

/* Tarja de lower third no topo da carta. */
.flyer-banner {
  align-self: stretch;
  padding: 4px 0;
  background: var(--ui-green);
  color: var(--ui-text);
  font-weight: 700;
  font-style: italic;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.flyer-icon { font-size: 30px; line-height: 1.1; }
.flyer-name {
  font-size: 19px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  line-height: 1.15;
}
.flyer-effect { font-size: 15px; line-height: 1.25; }
.flyer-stacks { font-size: 13px; color: var(--ui-text-dim); }
.flyer-key {
  margin-top: auto;
  align-self: stretch;
  padding-top: 6px;
  border-top: 1px solid var(--ui-edge);
  font-size: 13px;
  color: var(--ui-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
/* Penúltimo stack: bandeirinha de escanteio amarela no canto. */
.flyer-last {
  position: absolute;
  top: -9px;
  right: -6px;
  padding: 4px 18px 4px 8px;
  background: var(--ui-yellow);
  color: var(--ui-ink);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%);
}

/* Botão de substituição: botão de placar. */
#upgrade-reroll {
  position: relative;
  z-index: 1;
  font: inherit;
  font-size: 17px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 28px;
  color: var(--ui-text);
  background: var(--ui-panel);
  border: 1px solid var(--ui-edge);
  border-left: 5px solid var(--ui-yellow);
  clip-path: ${SB_CHAMFER};
  cursor: pointer;
}
#upgrade-reroll:hover {
  background: var(--ui-panel-hover);
  border-left-width: 8px;
}
#upgrade-reroll:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 3px var(--ui-focus);
  background: var(--ui-panel-hover);
}
#upgrade-reroll[hidden] { display: none; }
.reroll-label { display: block; }
.reroll-sub {
  display: block;
  font-size: 12px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  color: var(--ui-text-dim);
}

/* Janela estreita ou baixa: cartas quebram linha e a faixa de fundo some.
   (reduced-motion vem do bloco global do screenTheme.) */
@media ${MEDIA_COMPACT} {
  #upgrade-overlay { justify-content: flex-start; padding-top: 24px; }
  .upgrade-title { font-size: 26px; padding: 8px 18px 9px; }
  .flyer { width: clamp(150px, 44vw, 210px); min-height: 200px; }
  .upgrade-stripe { display: none; }
}
`;
