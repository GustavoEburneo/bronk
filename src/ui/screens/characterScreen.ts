import { gameData } from '../../data/tables';
import { drawCharacterPortrait } from './characterPortraits';
import {
  el,
  injectScreenThemeOnce,
  injectStyleOnce,
  blurWithin,
  hasModifier,
  swallowEnterRepeat,
  INPUT_GUARD_MS,
  MEDIA_COMPACT,
  SB_CHAMFER,
} from './screenTheme';

/**
 * Separador da `tagline` dos personagens ("habilidade — o que muda"): a ficha
 * divide na primeira ocorrência (habilidade em negrito, descrição embaixo);
 * tagline sem separador vira linha única.
 */
const TAGLINE_SEPARATOR = ' — ';

export interface CharacterScreenCallbacks {
  /** Personagem CONFIRMADO na ficha (botão, ou Enter com seleção ativa). */
  onConfirm(characterId: string): void;
  /** Botão "Voltar" clicado (o Esc é tratado pelo screenFlow). */
  onBack(): void;
}

export interface CharacterScreen {
  /** `preselect` re-destaca o personagem da visita anterior (voltar do mapa). */
  show(preselect?: string): void;
  hide(): void;
}

/**
 * Seleção de personagem em DOIS tempos (pedido de 2026-11-23): o card é só o
 * RETRATO (arte provisória de characterPortraits — o texto saiu do card);
 * o CLIQUE no retrato SELECIONA e abre a ficha na lateral, com nome,
 * habilidade e descrição; e só o CONFIRMAR da ficha segue para o mapa.
 * Interação só por clique (atalhos numéricos saíram em 2026-11-23).
 *
 * Conteúdo segue vindo de `data.characters` (fronteira do TECH: conteúdo como
 * dado); personagem novo na tabela ganha card, retrato placeholder e ficha de
 * graça. A tela abre SEM seleção: a ficha vazia pede a escolha.
 */
export function createCharacterScreen(
  parent: HTMLElement,
  callbacks: CharacterScreenCallbacks,
): CharacterScreen {
  injectScreenThemeOnce();
  injectStyleOnce('character-screen-style', CHARACTER_CSS);

  const characters = gameData.characters;

  const root = document.createElement('section');
  root.className = 'screen character-screen';
  root.setAttribute('aria-label', 'Seleção de personagem');
  root.hidden = true;

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'screen-back';
  backButton.textContent = '← Voltar (Esc)';
  backButton.addEventListener('click', () => callbacks.onBack());

  const title = el('h1', 'screen-title', 'Escalação');
  const hint = el(
    'p',
    'screen-hint',
    'Clique num retrato para ver a ficha, e confirme nela para seguir.',
  );

  // --- Ficha lateral: aparece preenchida quando um personagem é selecionado.
  const panel = el('aside', 'char-panel', null);
  panel.setAttribute('aria-label', 'Ficha do personagem');
  // Leitores de tela anunciam a ficha ao trocar a seleção (conteúdo muda junto).
  panel.setAttribute('aria-live', 'polite');

  const panelEmpty = el('p', 'char-panel-empty', 'Escolha um personagem para ver a ficha.');

  const panelBody = el('div', 'char-panel-body', null);
  panelBody.hidden = true;
  const panelPortrait = document.createElement('canvas');
  panelPortrait.className = 'char-panel-portrait';
  panelPortrait.setAttribute('aria-hidden', 'true'); // o nome ao lado já diz quem é
  const panelName = el('h2', 'char-panel-name', '');
  const panelAbility = el('p', 'char-panel-ability', '');
  const panelDesc = el('p', 'char-panel-desc', '');

  const confirmButton = document.createElement('button');
  confirmButton.type = 'button';
  confirmButton.id = 'character-confirm-btn';
  confirmButton.className = 'screen-primary char-confirm';
  confirmButton.append(
    el('span', 'primary-label', 'CONFIRMAR'),
    el('span', 'primary-sub', 'clique para escolher o mapa'),
  );

  panelBody.append(panelPortrait, panelName, panelAbility, panelDesc, confirmButton);
  panel.append(panelEmpty, panelBody);

  // --- Cards: só o retrato e o atalho; o texto mora na ficha.
  const cardsRow = el('div', 'screen-cards char-cards', null);
  const cards: HTMLButtonElement[] = [];
  const stamps: HTMLElement[] = [];

  let visible = false;
  /** null = nada selecionado ainda (a tela abre pedindo a escolha). */
  let selectedIndex: number | null = null;
  let acceptInputAt = 0;

  characters.forEach((def, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `screen-card char-card card-paper-${index % 3}`;
    card.setAttribute('aria-pressed', 'false');
    // O card virou imagem: o nome entra pelo rótulo acessível.
    card.setAttribute('aria-label', `${def.name} — ver ficha`);

    const stamp = el('span', 'card-chosen', 'TITULAR!');
    stamp.hidden = true;

    const portrait = document.createElement('canvas');
    portrait.className = 'char-portrait';
    portrait.setAttribute('aria-hidden', 'true');
    drawCharacterPortrait(portrait, def.id);

    card.append(portrait, el('span', 'card-key', 'clique para ver a ficha'), stamp);

    card.addEventListener('click', () => {
      if (performance.now() < acceptInputAt) return;
      select(index);
      // Foco segue para o CONFIRMAR: o próximo Enter/clique fecha a escolha.
      confirmButton.focus({ preventScroll: true });
    });

    cards.push(card);
    stamps.push(stamp);
    cardsRow.append(card);
  });

  const layout = el('div', 'char-layout', null);
  layout.append(cardsRow, panel);

  root.append(backButton, title, hint, layout);
  parent.append(root);

  /** Marca o card e preenche a ficha. NÃO mexe no foco (os handlers decidem). */
  function select(index: number): void {
    selectedIndex = index;
    cards.forEach((card, i) => {
      card.classList.toggle('selected', i === index);
      card.setAttribute('aria-pressed', i === index ? 'true' : 'false');
      stamps[i]!.hidden = i !== index;
    });

    const def = characters[index]!;
    drawCharacterPortrait(panelPortrait, def.id);
    panelName.textContent = def.name;
    // Sempre textContent (via el/atribuição): texto nunca entra como HTML.
    const separatorAt = def.tagline.indexOf(TAGLINE_SEPARATOR);
    if (separatorAt >= 0) {
      panelAbility.textContent = def.tagline.slice(0, separatorAt);
      panelDesc.textContent = def.tagline.slice(separatorAt + TAGLINE_SEPARATOR.length);
    } else {
      panelAbility.textContent = def.tagline;
      panelDesc.textContent = '';
    }
    panelEmpty.hidden = true;
    panelBody.hidden = false;
  }

  function confirmSelected(): void {
    if (performance.now() < acceptInputAt) return;
    if (selectedIndex === null) return; // nada escolhido: a ficha vazia já orienta
    const def = characters[selectedIndex];
    if (def === undefined) return;
    callbacks.onConfirm(def.id);
  }

  confirmButton.addEventListener('click', confirmSelected);

  // Sem atalhos (interação só por clique — 2026-11-23); o listener fica só
  // para engolir o Enter REPETIDO no botão focado (cadeia de telas).
  const onKeyDown = (event: KeyboardEvent): void => {
    if (!visible || hasModifier(event)) return;
    swallowEnterRepeat(event);
  };
  window.addEventListener('keydown', onKeyDown);

  return {
    show(preselect?: string): void {
      visible = true;
      acceptInputAt = performance.now() + INPUT_GUARD_MS;
      if (preselect !== undefined) {
        const index = characters.findIndex((def) => def.id === preselect);
        if (index >= 0) selectedIndex = index;
      }
      // Re-seleciona a escolha anterior (volta do mapa) — a ficha reabre
      // preenchida; primeira visita abre sem seleção, com a ficha vazia.
      if (selectedIndex !== null) select(selectedIndex);
      root.hidden = false;
      cards[selectedIndex ?? 0]?.focus({ preventScroll: true });
    },
    hide(): void {
      visible = false;
      root.hidden = true;
      blurWithin(root);
    },
  };
}

const CHARACTER_CSS = `
/* Retratos à esquerda, ficha à direita; em janela estreita a ficha desce. */
.char-layout {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  gap: calc(var(--ui-gap) * 1.75);
}
.char-cards { max-width: 620px; }

/* Card compacto: só o retrato e o atalho — o texto mora na ficha. */
#screens .char-card {
  width: clamp(120px, 15vw, 168px);
  min-height: 0;
  padding: 16px 12px 10px;
}
.char-portrait {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  image-rendering: pixelated;
  border: 2px solid var(--ui-edge);
  background: var(--ui-led-bg); /* canvas vazio (fallback sem 2d) fica "visor apagado" */
}

/* Ficha técnica do jogador: painel de placar (receita do tema — chanfro +
   barra de acento + fita BR no ::before). Peça ESTÁTICA: pode drop-shadow. */
.char-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: clamp(240px, 30vw, 310px);
  min-height: 330px;
  padding: 24px 18px 20px; /* topo maior: a fita BR ocupa 6px */
  background: var(--ui-panel);
  color: var(--ui-text);
  text-align: center;
  border: 1px solid var(--ui-edge);
  border-left: 5px solid var(--ui-yellow);
  clip-path: ${SB_CHAMFER};
  filter: drop-shadow(0 4px 0 rgba(0, 0, 0, 0.4));
}
.char-panel::before { /* fita BR no topo (ex-grampo) */
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--ui-stripe);
  pointer-events: none;
}
.char-panel-empty { margin: auto 0; font-size: 15px; color: var(--ui-text-dim); max-width: 220px; }
.char-panel-empty[hidden] { display: none; }
.char-panel-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
  align-self: stretch;
}
.char-panel-body[hidden] { display: none; }
/* Retrato emoldurado, reto: a fita BR do painel já faz a faixa em cima. */
.char-panel-portrait {
  width: 128px;
  height: 128px;
  image-rendering: pixelated;
  border: 2px solid var(--ui-edge);
  background: var(--ui-led-bg);
}
.char-panel-name {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  line-height: 1.1;
}
.char-panel-ability { margin: 0; font-size: 15px; font-weight: 700; }
.char-panel-desc {
  margin: 0;
  padding-top: 8px;
  border-top: 1px solid var(--ui-edge);
  align-self: stretch;
  font-size: 14px;
  line-height: 1.3;
  color: var(--ui-text-dim);
}
.char-confirm { margin-top: auto; }

@media ${MEDIA_COMPACT} {
  .char-layout { gap: var(--ui-gap); }
  #screens .char-card { width: clamp(96px, 26vw, 130px); padding: 10px 8px 6px; }
  .char-panel { width: min(420px, 92vw); min-height: 0; }
  .char-panel-portrait { width: 84px; height: 84px; }
  .char-panel-name { font-size: 20px; }
}
`;
