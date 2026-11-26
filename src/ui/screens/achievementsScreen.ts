/**
 * Tela de Conquistas (GDD 2026-11-19): o mural de panfletos com os feitos do
 * jogador. Cartaz desbloqueado = papel vivo com carimbo "FEITO!"; trancado =
 * papel desbotado com a descrição de como ganhar e o prêmio em bananas — a
 * conquista é um CONTRATO exibido ao jogador (gamificação: meta clara, prêmio
 * claro). A tela só LÊ (`data.achievements` + MetaStore); quem desbloqueia e
 * credita é o cofre, no fim da run e na compra da loja.
 */
import { gameData } from '../../data/tables';
import type { MetaStore } from '../../meta/metaStore';
import {
  el,
  injectScreenThemeOnce,
  injectStyleOnce,
  blurWithin,
  type Screen,
} from './screenTheme';

export function createAchievementsScreen(
  parent: HTMLElement,
  meta: MetaStore,
  onBack: () => void,
): Screen {
  injectScreenThemeOnce();
  injectStyleOnce('achievements-screen-style', ACHIEVEMENTS_CSS);

  const achievements = gameData.achievements;

  const root = document.createElement('section');
  root.className = 'screen achievements-screen';
  root.setAttribute('aria-label', 'Conquistas');
  root.hidden = true;

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'screen-back';
  backButton.textContent = '← Voltar (Esc)';
  backButton.addEventListener('click', () => onBack());

  const title = el('h1', 'screen-title', 'Conquistas');
  // Contador de progresso: papel próprio, como a carteira da loja.
  const counter = el('p', 'ach-counter', '');

  const cardsRow = el('div', 'screen-cards ach-cards', null);
  cardsRow.setAttribute('role', 'list');

  root.append(backButton, title, counter, cardsRow);
  parent.append(root);

  /** Re-renderiza tudo do estado atual (desbloqueios acontecem fora da tela). */
  function renderAll(): void {
    let unlockedCount = 0;
    cardsRow.textContent = '';

    achievements.forEach((def, index) => {
      const isUnlocked = meta.isUnlocked(def.id);
      if (isUnlocked) unlockedCount++;

      const card = el(
        'div',
        isUnlocked ? `screen-card ach-card card-paper-${index % 3}` : 'screen-card ach-card locked',
        null,
      );
      card.setAttribute('role', 'listitem');

      card.append(
        el('span', 'ach-icon', def.icon),
        el('span', 'card-name', def.name),
        el('span', 'card-line', def.description),
      );
      if (isUnlocked) {
        card.append(
          el('span', 'card-chosen', 'FEITO!'),
          el('span', 'card-key', `prêmio recebido: ${def.reward} 🍌`),
        );
      } else {
        card.append(el('span', 'card-key', `prêmio: ${def.reward} 🍌`));
      }
      cardsRow.append(card);
    });

    counter.textContent = `${unlockedCount} de ${achievements.length} desbloqueadas`;
  }

  return {
    show(): void {
      renderAll(); // runs/compras desde a última visita podem ter desbloqueado
      root.hidden = false;
      backButton.focus({ preventScroll: true });
    },
    hide(): void {
      root.hidden = true;
      blurWithin(root);
    },
  };
}

const ACHIEVEMENTS_CSS = `
.ach-counter {
  margin: 0;
  padding: 5px 18px;
  background: var(--ui-paper-0);
  color: var(--ui-ink);
  font-size: 17px;
  font-weight: bold;
  border-radius: 4px;
  transform: rotate(-1deg);
  box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.45);
}

/* Mural maior que a janela + justify-content center cortaria o topo (título e
   1ª fileira ficam fora da área rolável). Ancora no topo com respiro; onde o
   navegador suporta, "safe center" centra apenas quando o conteúdo cabe. */
#screens .achievements-screen { justify-content: flex-start; padding-top: 56px; }
@supports (justify-content: safe center) {
  #screens .achievements-screen { justify-content: safe center; }
}

/* Muitos cartazes: cards menores, mural largo, a tela rola (overflow do tema). */
.ach-cards { max-width: 1280px; padding-top: 8px; }
#screens .ach-card {
  width: clamp(160px, 19vw, 210px);
  min-height: 165px;
  padding-top: 14px;
  cursor: default;
}
/* Trancado aqui não é "EM BREVE": é meta a cumprir — sem cursor de proibido.
   Aspecto de desabilitado: papel e tinta acinzentados, emoji sem cor. */
#screens .ach-card.locked {
  cursor: default;
  filter: grayscale(0.9);
  opacity: 0.75;
  color: #6b655a;
}
#screens .ach-card.locked .ach-icon { opacity: 0.55; }
.ach-icon { font-size: 30px; line-height: 1.1; }

@media (max-width: 640px), (max-height: 560px) {
  #screens .ach-card { width: clamp(140px, 40vw, 180px); min-height: 150px; }
  .ach-counter { font-size: 14px; }
}
`;
