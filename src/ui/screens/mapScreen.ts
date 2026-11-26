import { gameData } from '../../data/tables';
import {
  el,
  injectScreenThemeOnce,
  blurWithin,
  hasModifier,
  swallowEnterRepeat,
  INPUT_GUARD_MS,
  type Screen,
} from './screenTheme';

export interface MapScreenCallbacks {
  /** Mapa confirmado (clique no card liberado, ou tecla dele/Enter). */
  onConfirm(mapId: string): void;
  /** Botão "Voltar" clicado (o Esc é tratado pelo screenFlow). */
  onBack(): void;
}

/**
 * Seleção de mapa: cards gerados de `data.maps`, na ordem da tabela
 * (fronteira do TECH: conteúdo como dado). `playable` decide o desenho:
 * card selecionável (nome + tagline) ou slot bloqueado com a placa LED
 * "PRÓXIMA RODADA". Com 2+ mapas jogáveis (Feira desde 2026-11-19), a tela segue
 * o modelo da seleção de personagem: clique confirma direto; teclas 1..N
 * selecionam (e focam) e Enter confirma a seleção. A última escolha fica
 * destacada na próxima visita. Clicar num bloqueado dá feedback curto de
 * negado (balanço + aviso) e não navega (GDD).
 */
export function createMapScreen(parent: HTMLElement, callbacks: MapScreenCallbacks): Screen {
  injectScreenThemeOnce();

  const maps = gameData.maps;
  const firstPlayableIndex = maps.findIndex((def) => def.playable);
  if (firstPlayableIndex < 0) {
    // A validação de boot exige ao menos 1 mapa jogável; chegar aqui é bug.
    throw new Error('seleção de mapa sem mapa jogável — gameData.maps inválido');
  }

  const root = document.createElement('section');
  root.className = 'screen map-screen';
  root.setAttribute('aria-label', 'Seleção de mapa');
  root.hidden = true;

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'screen-back';
  backButton.textContent = '← Voltar (Esc)';
  backButton.addEventListener('click', () => callbacks.onBack());

  const title = el('h1', 'screen-title', 'Tabela de jogos');
  const hint = el('p', 'screen-hint', 'Clique num mapa liberado para jogar. Esc volta.');

  // Aviso de "negado": leitores de tela anunciam a mudança (aria-live).
  const status = el('p', 'screen-status', '');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const cardsRow = el('div', 'screen-cards', null);

  let visible = false;
  /** Última seleção persiste entre visitas (o objeto da tela vive no app). */
  let selectedIndex = firstPlayableIndex;
  let acceptInputAt = 0;

  function deny(card: HTMLElement, name: string): void {
    status.textContent = `"${name}" ainda não abriu — escolha um dos mapas liberados.`;
    // Reinicia a animação de balanço mesmo em cliques seguidos.
    card.classList.remove('denied');
    void card.offsetWidth;
    card.classList.add('denied');
  }

  // Um card por mapa, na ordem da tabela; `playable` decide o desenho.
  const cards: HTMLButtonElement[] = [];
  const stamps: (HTMLElement | null)[] = [];
  maps.forEach((def, index) => {
    const card = document.createElement('button');
    card.type = 'button';

    // Sempre textContent (via el): texto nunca entra como HTML.
    if (def.playable) {
      card.className = `screen-card card-paper-${index % 3}`;
      card.setAttribute('aria-pressed', 'false');
      const stamp = el('span', 'card-chosen', 'É AQUI!');
      stamp.hidden = true;
      card.append(el('span', 'card-name', def.name));
      if (def.tagline !== undefined) card.append(el('span', 'card-line', def.tagline));
      card.append(el('span', 'card-key', 'clique para jogar aqui'), stamp);
      card.addEventListener('click', () => {
        if (performance.now() < acceptInputAt) return;
        select(index);
        callbacks.onConfirm(def.id);
      });
      stamps.push(stamp);
    } else {
      // Slot bloqueado: só o nome + placa LED "PRÓXIMA RODADA"; não navega.
      card.className = 'screen-card locked';
      // aria-disabled (e não disabled): continua focável e o clique explica o porquê.
      card.setAttribute('aria-disabled', 'true');
      card.append(
        el('span', 'card-stamp', 'PRÓXIMA RODADA'),
        el('span', 'card-name', def.name),
        el('span', 'card-key', 'ainda fechado'),
      );
      card.addEventListener('click', () => deny(card, def.name));
      stamps.push(null);
    }

    cards.push(card);
    cardsRow.append(card);
  });

  root.append(backButton, title, hint, cardsRow, status);
  parent.append(root);

  function select(index: number): void {
    selectedIndex = index;
    cards.forEach((card, i) => {
      if (!maps[i]!.playable) return;
      card.classList.toggle('selected', i === index);
      card.setAttribute('aria-pressed', i === index ? 'true' : 'false');
      stamps[i]!.hidden = i !== index;
    });
  }

  // Sem atalhos (interação só por clique — 2026-11-23); o listener fica só
  // para engolir o Enter REPETIDO no card focado (cadeia de telas).
  const onKeyDown = (event: KeyboardEvent): void => {
    if (!visible || hasModifier(event)) return;
    swallowEnterRepeat(event);
  };
  window.addEventListener('keydown', onKeyDown);

  return {
    show(): void {
      visible = true;
      acceptInputAt = performance.now() + INPUT_GUARD_MS;
      status.textContent = '';
      select(selectedIndex);
      root.hidden = false;
      cards[selectedIndex]?.focus({ preventScroll: true });
    },
    hide(): void {
      visible = false;
      root.hidden = true;
      blurWithin(root);
    },
  };
}
