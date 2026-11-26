import { gameData } from '../../data/tables';
import type { MetaStore } from '../../meta/metaStore';
import {
  el,
  injectScreenThemeOnce,
  injectStyleOnce,
  blurWithin,
  hasModifier,
  swallowEnterRepeat,
  INPUT_GUARD_MS,
  MEDIA_COMPACT,
  type Screen,
} from './screenTheme';

/**
 * Loja de Talentos (meta-progressão, GDD 2026-11-19): cartazes de talento no
 * mural, comprados com bananas ganhas por abate — referência: PowerUps do
 * Vampire Survivors. A tela consome `data.talents` (exibíveis como dado) e
 * compra VIA MetaStore — nunca toca o storage nem a simulação.
 *
 * Interação no padrão das outras telas: clique compra 1 nível; teclas 1..N
 * focam o cartaz e Enter compra; Esc/Voltar saem (screenFlow). Sem saldo ou
 * no teto, o clique dá o feedback de negado (balanço + aviso aria-live).
 */
export function createShopScreen(
  parent: HTMLElement,
  meta: MetaStore,
  onBack: () => void,
): Screen {
  injectScreenThemeOnce();
  injectStyleOnce('shop-screen-style', SHOP_CSS);

  const talents = gameData.talents;

  const root = document.createElement('section');
  root.className = 'screen shop-screen';
  root.setAttribute('aria-label', 'Loja de talentos');
  root.hidden = true;

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'screen-back';
  backButton.textContent = '← Voltar (Esc)';
  backButton.addEventListener('click', () => onBack());

  const title = el('h1', 'screen-title', 'Mercado da bola');
  const hint = el(
    'p',
    'screen-hint',
    'Bônus permanentes, pagos em banana. Clique num cartaz para comprar.',
  );

  // Carteira: papel próprio, sempre visível acima dos cartazes.
  const wallet = el('p', 'shop-wallet', '');

  // Aviso (comprou / sem saldo / no teto): leitores anunciam via aria-live.
  const status = el('p', 'screen-status', '');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const cardsRow = el('div', 'screen-cards shop-cards', null);
  const cards: HTMLButtonElement[] = [];

  let visible = false;
  let acceptInputAt = 0;

  talents.forEach((_def, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `screen-card shop-card card-paper-${index % 3}`;
    card.addEventListener('click', () => {
      if (performance.now() < acceptInputAt) return;
      buy(index);
    });
    cards.push(card);
    cardsRow.append(card);
  });

  root.append(backButton, title, hint, wallet, status, cardsRow);
  parent.append(root);

  function renderWallet(): void {
    wallet.textContent = `🍌 ${meta.bananas} no caixa do clube`;
  }

  /** Re-renderiza o cartaz `index` a partir do estado atual do cofre. */
  function renderCard(index: number): void {
    const def = talents[index]!;
    const card = cards[index]!;
    const rank = meta.rankOf(def.id);
    const cost = meta.nextCost(def.id);
    const maxed = cost === null;

    card.textContent = '';
    card.classList.toggle('maxed', maxed);
    // "CONTRATADO" não é "PRÓXIMA RODADA": o cartaz segue legível, só não compra mais.
    card.setAttribute('aria-disabled', maxed ? 'true' : 'false');

    // Pips em spans próprios: cheio e vazio com cores distintas (só decoração —
    // o número "nível R/M" ao lado segue sendo a informação).
    const rankLine = el('span', 'shop-rank', `nível ${rank}/${def.maxRank} `);
    rankLine.append(
      el('span', 'shop-pip-full', '●'.repeat(rank)),
      el('span', 'shop-pip-empty', '○'.repeat(def.maxRank - rank)),
    );

    card.append(
      el('span', 'shop-icon', def.icon),
      el('span', 'card-name', def.name),
      el('span', 'card-line', def.effectLine),
      rankLine,
    );
    if (maxed) {
      card.append(el('span', 'card-stamp', 'CONTRATADO'), el('span', 'card-key', 'craque garantido'));
    } else {
      card.append(el('span', 'card-key', `${cost} 🍌 · clique para comprar`));
    }
  }

  function renderAll(): void {
    renderWallet();
    for (let i = 0; i < talents.length; i++) renderCard(i);
  }

  /** Feedback de negado — mesmo balanço dos cards "PRÓXIMA RODADA" do mapa. */
  function deny(card: HTMLElement, message: string): void {
    status.textContent = message;
    card.classList.remove('denied');
    void card.offsetWidth;
    card.classList.add('denied');
  }

  function buy(index: number): void {
    const def = talents[index]!;
    const card = cards[index]!;
    const cost = meta.nextCost(def.id);
    if (cost === null) {
      deny(card, `"${def.name}" já está contratado — esgotou o mercado.`);
      return;
    }
    if (!meta.buy(def.id)) {
      deny(card, `Faltam ${cost - meta.bananas} bananas para "${def.name}". Vai lá abater uns cones.`);
      return;
    }
    renderWallet();
    renderCard(index);
    status.textContent = `Comprou "${def.name}" nível ${meta.rankOf(def.id)}! Vale em toda run.`;
  }

  // Sem atalhos (interação só por clique — 2026-11-23); o listener fica só
  // para engolir o Enter REPETIDO no cartaz focado (compra em cadeia).
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
      renderAll(); // o cofre pode ter crescido desde a última visita
      root.hidden = false;
      backButton.focus({ preventScroll: true });
    },
    hide(): void {
      visible = false;
      root.hidden = true;
      blurWithin(root);
    },
  };
}

const SHOP_CSS = `
/* Carteira = visor LED do caixa do clube: o número é o dado que muda, então
   tabular-nums segura a largura entre visitas. */
.shop-wallet {
  margin: 0;
  padding: 6px 18px;
  background: var(--ui-led-bg);
  color: var(--ui-led);
  border: 1px solid var(--ui-edge);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.08em;
  font-variant-numeric: tabular-nums;
}

/* Mais cartazes que personagens: cards menores para o mercado caber na tela. */
.shop-cards { max-width: 1200px; }
#screens .shop-card {
  width: clamp(160px, 20vw, 215px);
  min-height: 185px;
  padding-top: 14px;
}
.shop-icon { font-size: 30px; line-height: 1.1; }
.shop-rank { font-size: 13px; letter-spacing: 1px; font-variant-numeric: tabular-nums; }
/* Pips: cheio aceso, vazio apagado — forma além do número. */
.shop-pip-full { color: var(--ui-yellow); }
.shop-pip-empty { color: var(--ui-text-dim); }

/* Contratado: continua legível (não é "PRÓXIMA RODADA"), mas sem cara de botão. */
#screens .shop-card.maxed {
  cursor: not-allowed;
  background: var(--ui-locked);
  color: var(--ui-locked-text);
  border-left-color: var(--ui-edge);
}

@media ${MEDIA_COMPACT} {
  #screens .shop-card { width: clamp(140px, 40vw, 190px); min-height: 160px; }
  .shop-wallet { font-size: 14px; }
}
`;
