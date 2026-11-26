import type { World } from '../sim/world';
import type { GameSettings } from '../meta/settingsStore';
import { ABILITY_DISPLAY, formatRunTime } from './hud';
import { createSettingsSheet } from './settingsSheet';
import { el, injectScreenThemeOnce, injectStyleOnce, INPUT_GUARD_MS } from './screens/screenTheme';

/**
 * Menu de pausa da run (GDD 2026-11-19): Esc (ou P) congela a sim — quem
 * deixa de chamar `tick` é o gameLoop, via `isPaused` — e abre um mural com o
 * BUILD atual (habilidade equipada com números efetivos, passivas da run com
 * stacks, talentos da loja) e as ações: Continuar, Configurações, Finalizar
 * run e Sair pro menu principal.
 *
 * CONFIGURAÇÕES (destravada em 2026-11-23): abre um sub-painel DENTRO da
 * pausa com o mesmo panfleto de ajustes do menu (ui/settingsSheet.ts) — a sim
 * segue congelada; volume e sensibilidade aplicam na hora via o assinante do
 * cofre. Esc/P com o sub-painel aberto volta ao menu de pausa, não retoma:
 * o integrador pergunta via `closeSettings()` antes de esconder a pausa.
 *
 * Mesmo contrato dos outros overlays: a UI lê o world e dispara ações via
 * callbacks — nunca mexe na simulação por dentro. DOM e CSS nascem aqui;
 * reutiliza as classes das telas (screenTheme) para papéis e botões.
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
  root.setAttribute('aria-label', 'Pausa');
  root.hidden = true;

  const title = el('h1', 'pause-title', 'PAUSA');
  const metaLine = el('p', 'pause-meta', '');

  // Mural do build: carta da habilidade + passivas + talentos, re-render no show.
  let build = el('div', 'pause-build', null);

  const column = el('div', 'menu-column pause-actions', null);
  const resumeButton = actionButton('Continuar', 'Esc também continua', () => {
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

  const endRunButton = actionButton('Finalizar run', 'fecha a conta e mostra o resumo', () => {
    if (performance.now() < acceptInputAt) return;
    actions.endRun();
  });
  endRunButton.id = 'pause-end-run';

  const exitButton = actionButton('Sair pro menu principal', 'as bananas vão pro cofre', () => {
    if (performance.now() < acceptInputAt) return;
    actions.exitToMenu();
  });
  exitButton.id = 'pause-exit-menu';

  // Sub-painel de configurações: o panfleto compartilhado + Voltar. Vive
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
    title.textContent = 'PAUSA';
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
    next.append(labeled('Habilidade', skill));

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
        el('p', 'pause-empty', 'Nenhuma passiva ainda — sobe de nível que os panfletos chegam.'),
      );
    }
    next.append(labeled(`Passivas da run (${passiveCount})`, passives));

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
      next.append(labeled('Talentos da loja (valem sempre)', talents));
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

/** Botão estilo panfleto (classes do screenTheme) com rótulo + sublinha. */
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

const PAUSE_CSS = `
#pause-overlay {
  /* Conjunto COMPLETO das variáveis que as classes reutilizadas do
     screenTheme consomem (.screen-card, .locked, .card-stamp, .denied):
     elas são definidas em #screens, que não é ancestral deste overlay. */
  --ui-dim: rgba(10, 8, 14, 0.82);
  --ui-text: #e8e4da;
  --ui-ink: #26180b;
  --ui-paper-0: #fff3b0;
  --ui-paper-1: #ffd6ec;
  --ui-paper-2: #d2f4ff;
  --ui-paper-locked: #cfcabc;
  --ui-ink-locked: #4a443a;
  --ui-promo: #e8231a;
  --ui-promo-ink: #fffbe6;
  --ui-accent: #ffe066;
  --ui-shadow: #2a1016;
  --ui-staple: #b9b9b9;
  --ui-gap: 16px;

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
#pause-overlay[hidden] { display: none; }

.pause-title {
  margin: 0;
  font-size: clamp(26px, 5vw, 44px);
  color: var(--ui-accent);
  transform: rotate(-2deg);
  text-shadow: 3px 3px 0 var(--ui-shadow);
}
.pause-meta { margin: 0; font-size: 16px; }

/* Mural do build: papel grande com as seções (habilidade/passivas/talentos). */
.pause-build {
  position: relative;
  width: min(640px, 92vw);
  padding: 14px 18px 16px;
  background: var(--ui-paper-0);
  color: var(--ui-ink);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px;
  box-shadow: 4px 6px 0 rgba(0, 0, 0, 0.45);
  transform: rotate(-0.8deg);
  text-align: left;
}
.pause-build::before { /* grampo, como nos demais papéis */
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 26px;
  height: 8px;
  background: #b9b9b9;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  transform: translateX(-50%) rotate(-2deg);
}
.pause-section + .pause-section {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 2px dashed rgba(0, 0, 0, 0.3);
}
.pause-section-label {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.7;
}

.pause-skill { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.pause-skill-icon { font-size: 26px; line-height: 1; }
.pause-skill-name { font-size: 18px; font-weight: bold; }
.pause-skill-stats { font-size: 14px; opacity: 0.85; }

.pause-passives {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 6px 14px;
}
.pause-passive { display: flex; flex-direction: column; }
.pause-passive-head { font-size: 14px; font-weight: bold; line-height: 1.2; }
.pause-passive-line { font-size: 12px; opacity: 0.8; line-height: 1.2; }
.pause-empty { margin: 0; font-size: 14px; opacity: 0.8; }

.pause-talents { display: flex; flex-wrap: wrap; gap: 6px; }
.pause-talent {
  padding: 2px 10px;
  background: var(--ui-paper-2);
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 999px;
  font-size: 13px;
  font-weight: bold;
}
.pause-talents .pause-talent:nth-child(odd) { transform: rotate(-1.5deg); }
.pause-talents .pause-talent:nth-child(even) { transform: rotate(1.2deg); }

/* Sub-painel de configurações: panfleto compartilhado + Voltar, no lugar do
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

/* Janela baixa: mural e botões encolhem para caber sem rolagem na maioria. */
@media (max-width: 640px), (max-height: 640px) {
  #pause-overlay { justify-content: flex-start; padding-top: 20px; }
  .pause-title { font-size: 24px; }
  .pause-build { padding: 10px 12px; }
  .pause-actions { gap: 6px; }
  .pause-actions .menu-btn { padding: 5px 12px 4px; }
  .pause-actions .menu-btn .card-name { font-size: 14px; }
  #pause-resume .card-name { font-size: 17px; }
}

@media (prefers-reduced-motion: reduce) {
  #pause-overlay * { animation: none !important; transition: none !important; }
}
`;
