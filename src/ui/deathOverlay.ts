import type { World } from '../sim/world';
import type { AchievementDef } from '../data/achievements';
import { el, injectScreenThemeOnce, injectStyleOnce, SB_CHAMFER } from './screens/screenTheme';
import { formatRunTime } from './hud';

/** O que o fim de run anuncia além dos números do world (vem do recordRun). */
export interface RunCloseout {
  /** Conquistas desbloqueadas por esta run, na ordem da tabela. */
  newAchievements: readonly AchievementDef[];
}

export interface DeathOverlay {
  readonly visible: boolean;
  show(world: World, closeout?: RunCloseout): void;
  hide(): void;
}

/**
 * Overlay de fim de run. A UI lê o estado e dispara as ações (reinício e
 * volta ao menu) via callbacks — nunca mexe na simulação por dentro.
 *
 * `onBackToMenu` é opcional para manter a chamada atual do main.ts válida:
 * sem o callback, o botão "Voltar ao menu" (`#menu-btn`) fica escondido —
 * botão que não faz nada não aparece. A integração real (parar o loop,
 * desmontar a cena, reabrir o fluxo de telas) é do main.ts, na próxima etapa.
 */
export function createDeathOverlay(onRestart: () => void, onBackToMenu?: () => void): DeathOverlay {
  const root = document.querySelector<HTMLElement>('#death-overlay');
  const stats = document.querySelector<HTMLElement>('#death-stats');
  const restartButton = document.querySelector<HTMLButtonElement>('#restart-btn');
  const menuButton = document.querySelector<HTMLButtonElement>('#menu-btn');
  if (!root || !stats || !restartButton || !menuButton) {
    throw new Error('elementos do overlay de morte não encontrados no index.html');
  }

  let visible = false;

  restartButton.addEventListener('click', () => {
    onRestart();
  });

  if (onBackToMenu === undefined) {
    menuButton.hidden = true;
  } else {
    menuButton.addEventListener('click', () => {
      onBackToMenu();
    });
  }

  return {
    get visible(): boolean {
      return visible;
    },
    show(world: World, closeout?: RunCloseout): void {
      visible = true;
      // O tema traz o keyframes sb-slide-in e o bloco de reduced-motion.
      injectScreenThemeOnce();
      injectStyleOnce('death-overlay-style', DEATH_OVERLAY_CSS);

      let cardsEarned = 0;
      for (const n of world.cardsEarned) cardsEarned += n;
      let orelhoesAnswered = 0;
      for (const o of world.orelhoes) if (o.answered) orelhoesAnswered++;

      // Estatísticas em TABELA (2026-11-24): rótulo | valor, uma linha por
      // número — substitui o parágrafo corrido de antes.
      const rows: Array<[string, string]> = [
        ['⏱️ Tempo sobrevivido', formatRunTime(world.time)],
        ['⭐ Nível alcançado', String(world.player.level)],
        ['💀 Abates', String(world.kills)],
        // O crédito em si é do integrador (main.ts), no momento do gameOver.
        ['🍌 Bananas pro cofre', `+${world.bananasEarned}`],
      ];
      if (cardsEarned > 0) {
        rows.push(['🃏 Figurinhas pro álbum', `+${cardsEarned}`]);
      }
      if (world.orelhoes.length > 0) {
        rows.push(['📞 Orelhões atendidos', `${orelhoesAnswered}/${world.orelhoes.length}`]);
      }

      stats.textContent = '';
      const table = document.createElement('table');
      table.className = 'death-table';
      const body = document.createElement('tbody');
      for (const [label, value] of rows) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.scope = 'row';
        th.textContent = label;
        const td = document.createElement('td');
        td.textContent = value;
        tr.append(th, td);
        body.append(tr);
      }
      table.append(body);
      stats.append(table);

      // Conquistas da run: uma linha por desbloqueio, com o prêmio (o crédito
      // já aconteceu no recordRun; aqui é só o anúncio).
      const achievements = closeout?.newAchievements ?? [];
      if (achievements.length > 0) {
        const list = el('ul', 'death-achievements', null);
        for (const def of achievements) {
          const item = document.createElement('li');
          item.textContent = `🏆 ${def.icon} ${def.name} (+${def.reward} 🍌)`;
          list.append(item);
        }
        stats.append(list);
      }

      root.hidden = false;
      // Foco no reinício: Enter repete a ação mais comum, sem caçar o botão.
      restartButton.focus({ preventScroll: true });
    },
    hide(): void {
      visible = false;
      root.hidden = true;
    },
  };
}

/**
 * Visual do fim de run (tema "placar esportivo BR", 2026-11-26): o CSS do
 * overlay saiu do index.html para cá — o index guarda só a casca e os ids do
 * contrato do harness. O título vira letreiro "FIM DE JOGO" e a tabela vira a
 * SÚMULA DA PARTIDA (linhas zebradas, números tabulares à direita).
 */
const DEATH_OVERLAY_CSS = `
#death-overlay h1 {
  margin: 0;
  position: relative;
  padding: 10px 30px 12px;
  font-size: clamp(32px, 6vw, 52px);
  font-weight: 700;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ui-text);
  background: var(--ui-panel);
  border: 1px solid var(--ui-edge);
  border-left: 6px solid var(--ui-danger);
  clip-path: ${SB_CHAMFER};
  animation: sb-slide-in 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
#death-overlay h1::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--ui-stripe);
  pointer-events: none;
}

/* Súmula: painel de placar com a tabela zebrada dentro. */
#death-stats {
  position: relative;
  padding: 16px 8px 14px;
  background: var(--ui-panel);
  border: 1px solid var(--ui-edge);
  border-left: 5px solid var(--ui-yellow);
  clip-path: ${SB_CHAMFER};
}
#death-stats::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--ui-stripe);
  pointer-events: none;
}
.death-table {
  margin: 0 auto;
  border-collapse: collapse;
  text-align: left;
}
.death-table th,
.death-table td {
  padding: 6px 12px;
  font-size: 16px;
}
/* Zebra de tabela de classificação (sem bordas tracejadas do tema velho). */
.death-table tr:nth-child(even) { background: var(--ui-panel-2); }
.death-table th { font-weight: 500; color: var(--ui-text-dim); }
.death-table td {
  font-weight: 700;
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.death-achievements {
  margin: 14px auto 0;
  padding: 10px 14px 0;
  list-style: none;
  border-top: 1px solid var(--ui-edge);
  font-size: 15px;
  text-align: center;
}
.death-achievements li { margin-top: 4px; }

/* Botões: "Jogar de novo" é a ação principal (barra verde); "Menu" neutra.
   Rótulos e ids são contrato (DECISIONS 2026-11-17 + harness). */
#restart-btn,
#menu-btn {
  font: inherit;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 10px 28px;
  color: var(--ui-text);
  background: var(--ui-panel);
  border: 1px solid var(--ui-edge);
  clip-path: ${SB_CHAMFER};
  cursor: pointer;
}
#restart-btn { border-left: 5px solid var(--ui-green); }
#menu-btn { border-left: 5px solid var(--ui-edge); }
#restart-btn:hover,
#menu-btn:hover {
  background: var(--ui-panel-hover);
  border-left-width: 8px;
}
/* Foco: anel interno (outline morre no clip-path — regra da casa). */
#restart-btn:focus-visible,
#menu-btn:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 3px var(--ui-focus);
  background: var(--ui-panel-hover);
}
`;
