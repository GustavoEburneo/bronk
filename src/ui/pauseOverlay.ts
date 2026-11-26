import type { World } from '../sim/world';
import type { GameSettings } from '../meta/settingsStore';
import { ABILITY_DISPLAY, formatRunTime } from './hud';
import { createSettingsSheet } from './settingsSheet';
import {
  el,
  injectScreenThemeOnce,
  injectStyleOnce,
  INPUT_GUARD_MS,
  MEDIA_COMPACT,
  SB_CHAMFER,
} from './screens/screenTheme';

/**
 * Menu de pausa da run (GDD 2026-11-19): Esc (ou P) congela a sim — quem
 * deixa de chamar `tick` é o gameLoop, via `isPaused` — e abre um mural com o
 * BUILD atual (habilidade equipada com números efetivos, passivas da run com
 * stacks, talentos da loja) e as ações: Continuar, Configurações, Finalizar
 * run e Sair pro menu principal.
 *
 * CONFIGURAÇÕES (destravada em 2026-11-23): abre um sub-painel DENTRO da
 * pausa com o mesmo formulário de ajustes do menu (ui/settingsSheet.ts) — a sim
 * segue congelada; volume e sensibilidade aplicam na hora via o assinante do
 * cofre. Esc/P com o sub-painel aberto volta ao menu de pausa, não retoma:
 * o integrador pergunta via `closeSettings()` antes de esconder a pausa.
 *
 * Mesmo contrato dos outros overlays: a UI lê o world e dispara ações via
 * callbacks — nunca mexe na simulação por dentro. DOM e CSS nascem aqui;
 * reutiliza as classes do tema de placar (screenTheme) para painéis e botões.
 * No tema "placar esportivo BR" (2026-11-26) a pausa é o VESTIÁRIO: o build
 * vira a prancheta do técnico, os talentos viram flâmulas.
 */

export interface PauseOverlayActions {
  /** Continuar jogando (fecha a pausa; quem fecha o overlay é o integrador). */
  resume(): void;
  /** Finalizar a run agora (vira fim de run normal, com crédito de bananas). */
  endRun(): void;
  /** Abandonar a run e voltar direto à tela de início (bananas creditadas). */
  exitToMenu(): void;
}

export interface PauseOverlay {
  readonly visible: boolean;
  /** Abre renderizando o build atual do `world` (sempre no menu de pausa). */
  show(world: World): void;
  hide(): void;
  /**
   * Fecha o sub-painel de configurações se ele estiver aberto e devolve true
   * (o Esc/P foi "consumido" — a pausa continua aberta, no menu). false =
   * não havia sub-painel: o integrador pode retomar o jogo.
   */
  closeSettings(): boolean;
}

export function createPauseOverlay(
  actions: PauseOverlayActions,
  settings: GameSettings,
): PauseOverlay {
  injectScreenThemeOnce(); // classes de papel/botão reutilizadas pelo overlay
  injectStyleOnce('pause-overlay-style', PAUSE_CSS);

  const root = document.createElement('div');
  root.id = 'pause-overlay';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Vestiário (pausa)');
  root.hidden = true;

  // Letreiro lower third do tema; o texto novo entra como escrito (contrato).
  const title = el('h1', 'sb-title pause-title', 'VESTIÁRIO');
  const metaLine = el('p', 'pause-meta', '');

  // Mural do build: carta da habilidade + passivas + talentos, re-render no show.
  let build = el('div', 'pause-build', null);

  const column = el('div', 'menu-column pause-actions', null);
  const resumeButton = actionButton('Voltar pro jogo', 'Esc também volta', () => {
    if (performance.now() < acceptInputAt) return;
    actions.resume();
  });
  resumeButton.id = 'pause-resume';
  resumeButton.classList.add('menu-play');

  const settingsButton = actionButton('Configurações', 'volume e sensibilidade', () => {
    if (performance.now() < acceptInputAt) return;
    openSettingsView();
  });
  settingsButton.id = 'pause-settings-btn';

  const endRunButton = actionButton('Apitar o fim', 'fecha a conta e mostra a súmula', () => {
    if (performance.now() < acceptInputAt) return;
    actions.endRun();
  });
  endRunButton.id = 'pause-end-run';

  const exitButton = actionButton('Sair do estádio', 'as bananas vão pro cofre', () => {
    if (performance.now() < acceptInputAt) return;
    actions.exitToMenu();
  });
  exitButton.id = 'pause-exit-menu';

  // Sub-painel de configurações: o formulário compartilhado + Voltar. Vive
  // escondido; abrir troca o mural/ações por ele (a pausa continua uma só).
  const settingsSheet = createSettingsSheet(settings, 'pause-settings');
  const settingsBackButton = actionButton('Voltar', 'Esc também volta', () => {
    closeSettingsView();
  });
  settingsBackButton.id = 'pause-settings-back';
  const settingsView = el('div', 'pause-settings', null);
  settingsView.append(settingsSheet.root, settingsBackButton);
  settingsView.hidden = true;

  column.append(resumeButton, settingsButton, endRunButton, exitButton);
  root.append(title, metaLine, build, column, settingsView);
  document.body.append(root);

  let visible = false;
  let settingsOpen = false;
  let acceptInputAt = 0;

  function openSettingsView(): void {
    settingsOpen = true;
    settingsSheet.sync(); // a outra instância (menu) pode ter mudado o cofre
    title.textContent = 'CONFIGURAÇÕES';
    build.hidden = true;
    column.hidden = true;
    settingsView.hidden = false;
    settingsBackButton.focus({ preventScroll: true });
  }

  /** Volta ao menu de pausa. `focus` falso no hide(): overlay já está saindo. */
  function closeSettingsView(focus = true): void {
    settingsOpen = false;
    title.textContent = 'VESTIÁRIO';
    build.hidden = false;
    column.hidden = false;
    settingsView.hidden = true;
    if (focus) resumeButton.focus({ preventScroll: true });
  }

  function render(world: World): void {
    const characterName = world.data.characters[world.characterIndex]?.name ?? '?';
    metaLine.textContent =
      `${characterName} · ${formatRunTime(world.time)} de run · ` +
      `nível ${world.player.level} · 🍌 ${world.bananasEarned} na mochila`;

    const next = el('div', 'pause-build', null);

    // --- Carta da habilidade equipada, com os números EFETIVOS de agora. ---
    const ability = ABILITY_DISPLAY[world.ability.kind];
    const skill = el('div', 'pause-skill', null);
    skill.append(
      el('span', 'pause-skill-icon', ability.icon),
      el('span', 'pause-skill-name', ability.label),
      el(
        'span',
        'pause-skill-stats',
        `dano ${formatNumber(world.stats.abilityDamage)} · ` +
          `recarga ${formatNumber(world.stats.abilityCooldown)} s · ` +
          `alcance ${formatNumber(world.stats.abilityRange)} u`,
      ),
    );
    next.append(labeled('Jogada ensaiada', skill));

    // --- Passivas da run (melhorias com efeito contínuo e stack > 0). -------
    const passives = el('div', 'pause-passives', null);
    let passiveCount = 0;
    for (let i = 0; i < world.data.upgrades.length; i++) {
      const stacks = world.upgradeStacks[i] ?? 0;
      const def = world.data.upgrades[i]!;
      if (stacks <= 0 || def.effect === undefined) continue;
      passiveCount++;
      const item = el('div', 'pause-passive', null);
      const stackLabel = Number.isFinite(def.maxStacks)
        ? `×${stacks}/${def.maxStacks}`
        : `×${stacks}`;
      item.append(
        el('span', 'pause-passive-head', `${def.icon} ${def.name} ${stackLabel}`),
        el('span', 'pause-passive-line', def.effectLine),
      );
      passives.append(item);
    }
    if (passiveCount === 0) {
      passives.append(
        el('p', 'pause-empty', 'Nenhuma passiva ainda — sobe de nível que o mercado abre.'),
      );
    }
    next.append(labeled(`Entrosamento da partida (${passiveCount})`, passives));

    // --- Talentos da loja (permanentes), só se houver algum comprado. -------
    const talentItems: HTMLElement[] = [];
    for (let i = 0; i < world.data.talents.length; i++) {
      const rank = world.talentRanks[i] ?? 0;
      if (rank <= 0) continue;
      const def = world.data.talents[i]!;
      const chip = el('span', 'pause-talent', `${def.icon} ${def.name} ×${rank}`);
      chip.title = def.effectLine;
      talentItems.push(chip);
    }
    if (talentItems.length > 0) {
      const talents = el('div', 'pause-talents', null);
      talents.append(...talentItems);
      next.append(labeled('Elenco permanente (loja)', talents));
    }

    build.replaceWith(next);
    build = next;
  }

  return {
    get visible(): boolean {
      return visible;
    },
    show(world: World): void {
      if (visible) return;
      visible = true;
      acceptInputAt = performance.now() + INPUT_GUARD_MS;
      // A pausa sempre abre no MENU (o sub-painel não sobrevive entre pausas).
      if (settingsOpen) closeSettingsView(false);
      render(world);
      root.hidden = false;
      // Foco no Continuar: Enter retoma, sem caçar botão (padrão da morte).
      resumeButton.focus({ preventScroll: true });
    },
    hide(): void {
      if (!visible) return;
      visible = false;
      if (settingsOpen) closeSettingsView(false);
      root.hidden = true;
      // Botão focado não pode sobrar recebendo Espaço/Enter do jogo retomado.
      if (document.activeElement instanceof HTMLElement && root.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    },
    closeSettings(): boolean {
      if (!visible || !settingsOpen) return false;
      closeSettingsView();
      return true;
    },
  };
}

/** Botão de placar (classes do screenTheme) com rótulo + sublinha. */
function actionButton(label: string, sub: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'screen-card menu-btn';
  button.append(el('span', 'card-name', label), el('span', 'card-key', sub));
  button.addEventListener('click', onClick);
  return button;
}

/** Bloco com rótulo pequeno em cima (estrutura única das seções do mural). */
function labeled(label: string, content: HTMLElement): HTMLElement {
  const wrap = el('div', 'pause-section', null);
  wrap.append(el('p', 'pause-section-label', label), content);
  return wrap;
}

/** Número com até 1 casa, vírgula pt-BR, sem zero à toa (8, 12,5). */
function formatNumber(value: number): string {
  return (Math.round(value * 10) / 10).toString().replace('.', ',');
}

/**
 * Regras do modo compacto, compartilhadas entre o breakpoint do tema e o
 * corte PRÓPRIO de altura da pausa (ver os dois @media no fim do CSS): a
 * prancheta do build + a coluna de 4 botões são altas, então a pausa precisa
 * encolher ANTES do corte global de 560px de altura.
 */
const PAUSE_COMPACT_RULES = `
  #pause-overlay { justify-content: flex-start; padding-top: 20px; }
  #pause-overlay .pause-title { font-size: 24px; padding: 8px 18px 9px; }
  .pause-build { padding: 12px 12px 10px; }
  .pause-actions { gap: 6px; }
  .pause-actions .menu-btn { padding: 5px 12px 4px; }
  .pause-actions .menu-btn .card-name { font-size: 14px; }
  #pause-resume .card-name { font-size: 17px; }
`;

const PAUSE_CSS = `
/* Tokens --ui-* vêm do :root (src/theme/tokens.ts, injetado no boot). */
#pause-overlay {
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
  /* Escurecida de transmissão sobre o jogo parado (tom do --ui-bg-0; o
     translúcido não tem token — mesma receita do upgradeOverlay). */
  background: rgba(8, 11, 17, 0.8);
  color: var(--ui-text);
  text-align: center;
}
#pause-overlay[hidden] { display: none; }

/* Letreiro: a base vem de .sb-title; aqui só o teto de tamanho local
   (a pausa tem mais conteúdo embaixo que uma tela de menu). */
#pause-overlay .pause-title { font-size: clamp(24px, 4.5vw, 38px); }

/* Linha meta da run: chip do VAR (o CONTEÚDO não muda, só o visual).
   Caixa alta via CSS — o texto/dados seguem como vieram do world. */
.pause-meta {
  margin: 0;
  padding: 4px 14px 5px;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-variant-numeric: tabular-nums;
  background: var(--ui-yellow);
  color: var(--ui-ink);
  border-left: 4px solid var(--ui-green);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
}

/* Prancheta do técnico: painel de placar com as seções do build dentro. */
.pause-build {
  position: relative;
  width: min(640px, 92vw);
  padding: 18px 18px 16px; /* topo maior: a fita BR ocupa 6px */
  background: var(--ui-panel);
  color: var(--ui-text);
  border: 1px solid var(--ui-edge);
  border-left: 5px solid var(--ui-yellow);
  clip-path: ${SB_CHAMFER};
  text-align: left;
}
.pause-build::before { /* fita BR no topo (a ex-posição do grampo) */
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--ui-stripe);
  pointer-events: none;
}
.pause-section + .pause-section {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--ui-edge);
}
.pause-section-label {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ui-text-dim);
}

/* Linha da habilidade: primeira linha do placar (fundo de zebra destacado). */
.pause-skill {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
  padding: 6px 10px;
  background: var(--ui-panel-2);
}
.pause-skill-icon { font-size: 26px; line-height: 1; }
.pause-skill-name {
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.pause-skill-stats {
  font-size: 14px;
  color: var(--ui-text-dim);
  font-variant-numeric: tabular-nums;
}

.pause-passives {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 4px 10px;
}
/* Itens em zebra: alternância --ui-panel/--ui-panel-2 (linhas de tabela). */
.pause-passive {
  display: flex;
  flex-direction: column;
  padding: 4px 10px 5px;
}
.pause-passive:nth-child(odd) { background: var(--ui-panel-2); }
.pause-passive-head {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.25;
  font-variant-numeric: tabular-nums;
}
.pause-passive-line { font-size: 12.5px; color: var(--ui-text-dim); line-height: 1.25; }
.pause-empty { margin: 0; font-size: 14px; color: var(--ui-text-dim); }

/* Talentos da loja: flâmulas de bandeirinha (valem sempre = títulos do clube). */
.pause-talents { display: flex; flex-wrap: wrap; gap: 6px; }
.pause-talent {
  padding: 4px 20px 4px 10px;
  background: var(--ui-yellow);
  color: var(--ui-ink);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-variant-numeric: tabular-nums;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%);
}

/* Sub-painel de configurações: formulário compartilhado + Voltar, no lugar do
   mural/ações (hidden precisa vencer o display:flex da classe). */
.pause-settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ui-gap);
}
.pause-settings[hidden] { display: none; }
.pause-build[hidden] { display: none; }
#pause-overlay .pause-actions[hidden] { display: none; }

/* Coluna de ações mais compacta que a do menu principal. */
.pause-actions { gap: 10px; }
.pause-actions .menu-btn { min-height: 0; padding: 8px 16px 6px; }
.pause-actions .menu-btn .card-name { font-size: 17px; }
#pause-resume .card-name { font-size: 22px; }

/* Breakpoint compacto compartilhado do tema (janela estreita OU baixa). */
@media ${MEDIA_COMPACT} {
${PAUSE_COMPACT_RULES}
}
/* Corte PRÓPRIO de altura (640px > os 560px do tema): o mural do build é
   alto — prancheta + 4 botões estouram a janela antes do corte global. */
@media (max-height: 640px) {
${PAUSE_COMPACT_RULES}
}
`;
