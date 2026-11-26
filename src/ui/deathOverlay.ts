import type { World } from '../sim/world';
import type { AchievementDef } from '../data/achievements';
import { el, injectStyleOnce } from './screens/screenTheme';
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
      injectStyleOnce('death-stats-style', DEATH_STATS_CSS);

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

/** Tabela de fim de run: rótulo à esquerda, número tabular à direita. */
const DEATH_STATS_CSS = `
.death-table {
  margin: 0 auto;
  border-collapse: collapse;
  text-align: left;
}
.death-table th,
.death-table td {
  padding: 5px 10px;
  border-bottom: 2px dashed rgba(255, 255, 255, 0.18);
  font-size: 16px;
}
.death-table tr:last-child th,
.death-table tr:last-child td { border-bottom: none; }
.death-table th { font-weight: normal; opacity: 0.9; }
.death-table td {
  font-weight: bold;
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.death-achievements {
  margin: 14px auto 0;
  padding: 10px 14px 0;
  list-style: none;
  border-top: 2px dashed rgba(255, 255, 255, 0.25);
  font-size: 15px;
  text-align: center;
}
.death-achievements li { margin-top: 4px; }
`;
