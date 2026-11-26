import {
  el,
  injectScreenThemeOnce,
  injectStyleOnce,
  blurWithin,
  hasModifier,
  swallowEnterRepeat,
  INPUT_GUARD_MS,
  type Screen,
} from './screenTheme';

/**
 * Contatos do canto inferior esquerdo (pedido do autor, 2026-11-24). Pontos
 * únicos, como o PIX_PAYLOAD: os DOIS botões abrem o formulário do Google
 * (trocados do mailto a pedido do autor no mesmo dia; por ora é o mesmo form
 * para bug e feedback — quando o bug ganhar um form próprio, troca-se a URL).
 */
const BUG_FORM_URL = 'https://forms.gle/rSCMH7aAy899CQ7r7';
const FEEDBACK_FORM_URL = 'https://forms.gle/rSCMH7aAy899CQ7r7';

/**
 * PONTO ÚNICO do payload Pix da caixinha do dev (DECISIONS 2026-11-18;
 * payload real + decisão SEM QR: 2026-11-23).
 *
 * O payload é o "Pix copia e cola" fornecido pelo autor: chave ALEATÓRIA
 * (EVP/UUID) + nome + cidade — nunca CPF/telefone/e-mail, o código fica
 * público. CRC16 validado na entrada (6E43). A caixinha oferece um botão de
 * COPIAR em vez de QR: o QR placeholder de 2026-11-18 saiu junto com a
 * hipótese de gerar um real (decisão do autor em 2026-11-23 — jogo de
 * navegador: quem está jogando copia e cola no app do banco; apontar a
 * câmera para a própria tela é o caso raro).
 *
 * `null` volta a esconder a caixinha inteira (sem UI morta no mural).
 */
export const PIX_PAYLOAD: string | null =
  '00020126580014BR.GOV.BCB.PIX01366c9908c2-db64-4a76-808d-49d10befec15' +
  '5204000053039865802BR5920Luiz Gustavo Eburneo6009SAO PAULO' +
  '62140510HNABXVtoD063046E43';

/**
 * Botões do menu, na ordem do GDD. Desde 2026-11-23 TODOS funcionam
 * (CONFIGURAÇÕES foi o último a abrir) e a interação é SÓ POR CLIQUE —
 * os atalhos numéricos saíram de todas as telas (decisão de 2026-11-23).
 */
const MENU_BUTTONS = [
  { label: 'JOGAR', action: 'play' },
  { label: 'LOJA DE TALENTOS', action: 'shop' },
  { label: 'CONFIGURAÇÕES', action: 'settings' },
  { label: 'CONQUISTAS', action: 'achievements' },
  { label: 'ÁLBUM', action: 'album' },
] as const;

type MenuAction = (typeof MENU_BUTTONS)[number]['action'];

/** Textos da caixinha do dev (convite exato do GDD, decidido em 2026-11-18). */
const DEV_INVITE = 'Gostou do caos? Paga um café pro dev.';
const DEV_CAPTION = 'Pix, e o troco é seu.';
const DEV_COPY_LABEL = '💸 Copiar Pix copia e cola';
const DEV_COPIED = 'Copiado! Cola no app do banco. ☕';
const DEV_COPY_MANUAL = 'Copia daqui (Ctrl+C):';

/**
 * Copia o payload para a área de transferência. Clipboard API primeiro; se o
 * navegador negar (contexto inseguro, permissão), mostra o código num campo
 * somente leitura já selecionado para copiar na mão — nunca falha em silêncio.
 */
async function copyPixPayload(
  payload: string,
  feedback: HTMLElement,
  devBox: HTMLElement,
): Promise<void> {
  try {
    await navigator.clipboard.writeText(payload);
    feedback.textContent = DEV_COPIED;
    return;
  } catch {
    // Sem clipboard: cai para o campo manual abaixo.
  }
  feedback.textContent = DEV_COPY_MANUAL;
  let field = devBox.querySelector<HTMLInputElement>('.dev-payload');
  if (field === null) {
    field = document.createElement('input');
    field.className = 'dev-payload';
    field.readOnly = true;
    field.value = payload;
    field.setAttribute('aria-label', 'Código Pix copia e cola');
    devBox.append(field);
  }
  field.focus({ preventScroll: true });
  field.select();
}

export interface StartScreenCallbacks {
  /** JOGAR confirmado (segue para a seleção de personagem). */
  onStart(): void;
  /** LOJA DE TALENTOS confirmada (abre a loja). */
  onShop(): void;
  /** CONFIGURAÇÕES confirmada (abre a tela de ajustes). */
  onSettings(): void;
  /** CONQUISTAS confirmada (abre o mural de conquistas). */
  onAchievements(): void;
  /** ÁLBUM confirmado (abre o álbum de figurinhas). */
  onAlbum(): void;
}

/**
 * Tela de início — menu principal (GDD 2026-11-18; loja: 2026-11-19;
 * configurações: 2026-11-23): título "BRonk" no topo, coluna de botões estilo
 * panfleto (todos funcionais) e a caixinha do dev (botão que copia o Pix
 * copia e cola) no canto inferior direito, fora do caminho título → JOGAR.
 * A tela só dispara callbacks — não conhece as outras telas nem a simulação.
 */
export function createStartScreen(parent: HTMLElement, callbacks: StartScreenCallbacks): Screen {
  injectScreenThemeOnce();

  const root = document.createElement('section');
  root.className = 'screen start-screen';
  root.setAttribute('aria-label', 'Tela de início');
  root.hidden = true;

  const poster = el('div', 'start-poster', null);
  poster.append(el('h1', 'start-title', 'BRonk'));

  const hint = el('p', 'screen-hint', 'Clique num botão do mural.');

  let visible = false;
  let acceptInputAt = 0;

  function guardedStart(): void {
    if (performance.now() < acceptInputAt) return;
    callbacks.onStart();
  }

  /** Dispara `action` respeitando a janela de guarda de input da tela. */
  function guarded(action: () => void): () => void {
    return () => {
      if (performance.now() < acceptInputAt) return;
      action();
    };
  }

  /** Callback de cada botão secundário (JOGAR tem caminho próprio). */
  const SECONDARY: Record<Exclude<MenuAction, 'play'>, { id: string; open: () => void }> = {
    shop: { id: 'shop-btn', open: callbacks.onShop },
    settings: { id: 'settings-btn', open: callbacks.onSettings },
    achievements: { id: 'achievements-btn', open: callbacks.onAchievements },
    album: { id: 'album-btn', open: callbacks.onAlbum },
  };

  // Coluna de botões, na ordem do GDD.
  const column = el('div', 'menu-column', null);
  const buttons: HTMLButtonElement[] = [];
  for (const { label, action } of MENU_BUTTONS) {
    const button = document.createElement('button');
    button.type = 'button';

    if (action === 'play') {
      // JOGAR: a ação principal — maior e primeira no caminho visual.
      button.id = 'start-btn';
      button.className = 'screen-card menu-btn menu-play';
      button.append(el('span', 'card-name', label), el('span', 'card-key', 'clique para jogar'));
      button.addEventListener('click', guardedStart);
    } else {
      // Botões funcionais secundários (loja, configurações, conquistas, álbum).
      const { id, open } = SECONDARY[action];
      button.id = id;
      button.className = 'screen-card menu-btn';
      button.append(el('span', 'card-name', label), el('span', 'card-key', 'clique para abrir'));
      button.addEventListener('click', guarded(open));
    }

    buttons.push(button);
    column.append(button);
  }

  // Caixinha do dev (desde 2026-11-23, com o payload real): interativa — o
  // botão copia o "Pix copia e cola" e a legenda vira o feedback (aria-live:
  // leitores de tela anunciam o "copiado"). Sem payload, a caixinha nem entra.
  root.append(poster, hint, column);
  if (PIX_PAYLOAD !== null) {
    const payload = PIX_PAYLOAD;
    const devBox = el('aside', 'dev-box', null);
    devBox.setAttribute('aria-label', 'Caixinha do dev — Pix');

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.id = 'dev-pix-copy';
    copyButton.className = 'dev-copy';
    copyButton.textContent = DEV_COPY_LABEL;

    const feedback = el('p', 'dev-caption', DEV_CAPTION);
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');

    copyButton.addEventListener('click', () => {
      void copyPixPayload(payload, feedback, devBox);
    });

    devBox.append(el('p', 'dev-invite', DEV_INVITE), copyButton, feedback);
    root.append(devBox);
  }

  // Canto inferior ESQUERDO: contato com o dev (2026-11-24) — reportar bug e
  // mandar feedback, os dois por e-mail (mailto abre o cliente do jogador;
  // âncoras, não botões: navegação, e o teclado/leitor já as entende assim).
  injectStyleOnce('start-contact-style', CONTACT_CSS);
  const contact = el('aside', 'contact-box', null);
  contact.setAttribute('aria-label', 'Contato com o desenvolvedor');
  const bugLink = document.createElement('a');
  bugLink.id = 'report-bug-link';
  bugLink.className = 'contact-link';
  bugLink.href = BUG_FORM_URL;
  bugLink.target = '_blank';
  bugLink.rel = 'noopener noreferrer';
  bugLink.textContent = '🐞 Reportar bug';
  const feedbackLink = document.createElement('a');
  feedbackLink.id = 'feedback-link';
  feedbackLink.className = 'contact-link';
  feedbackLink.href = FEEDBACK_FORM_URL;
  feedbackLink.target = '_blank';
  feedbackLink.rel = 'noopener noreferrer';
  feedbackLink.textContent = '💬 Feedback';
  contact.append(bugLink, feedbackLink);
  root.append(contact);

  parent.append(root);

  // Sem atalhos (interação só por clique — 2026-11-23); o listener fica só
  // para engolir o Enter REPETIDO: o foco inicial cai no JOGAR (acessível via
  // Tab + Enter nativos) e um Enter segurado atravessaria as telas em cadeia.
  const onKeyDown = (event: KeyboardEvent): void => {
    if (!visible || hasModifier(event)) return;
    swallowEnterRepeat(event);
  };
  window.addEventListener('keydown', onKeyDown);

  return {
    show(): void {
      visible = true;
      acceptInputAt = performance.now() + INPUT_GUARD_MS;
      root.hidden = false;
      buttons[0]!.focus({ preventScroll: true });
    },
    hide(): void {
      visible = false;
      root.hidden = true;
      blurWithin(root);
    },
  };
}

/**
 * Papeizinhos de contato do canto inferior esquerdo (espelham a linguagem da
 * dev-box do canto direito; as variáveis --ui-* vêm do #screens).
 */
const CONTACT_CSS = `
.contact-box {
  position: absolute;
  left: 14px;
  bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
.contact-link {
  display: inline-block;
  padding: 6px 12px;
  background: var(--ui-paper-2);
  color: var(--ui-ink);
  font-size: 13px;
  font-weight: bold;
  text-decoration: none;
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.45);
  transform: rotate(-1.5deg);
}
.contact-link + .contact-link {
  background: var(--ui-paper-1);
  transform: rotate(1deg);
}
.contact-link:hover { filter: brightness(1.06); }
.contact-link:focus-visible { outline: 3px dashed var(--ui-promo); outline-offset: 3px; }
@media (max-width: 640px), (max-height: 560px) {
  .contact-box { left: 8px; bottom: 8px; gap: 6px; }
  .contact-link { font-size: 11.5px; padding: 5px 9px; }
}
`;
