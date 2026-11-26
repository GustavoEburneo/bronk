/**
 * Base compartilhada das telas de menu (início → personagem → mapa).
 *
 * Fonte única das variáveis de estilo das telas: cores, tipografia e
 * espaçamento vivem nas custom properties de `#screens`, e todo o CSS das
 * telas vive aqui, usando essas variáveis. Os valores espelham a paleta dos
 * overlays (hoje duplicada no index.html e no upgradeOverlay — unificar num
 * :root é dívida registrada lá).
 *
 * Mesmo mecanismo de construção dos overlays novos (ver upgradeOverlay):
 * DOM e CSS nascem nos módulos, nada no index.html. As telas são DOM por
 * cima do canvas, então o texto fica nítido mesmo com o render em 270p.
 */

/** Contrato mínimo de uma tela de menu (ver TECH, "Estado de aplicação"). */
export interface Screen {
  show(): void;
  hide(): void;
}

/**
 * Janela em que uma tela recém-aberta ignora confirmação: evita que um clique
 * duplo (ou Enter apertado de novo rápido) da tela anterior confirme sem
 * querer na tela seguinte, que abre com um controle no mesmo lugar/foco.
 * Mesmo racional do guard do upgradeOverlay.
 */
export const INPUT_GUARD_MS = 250;

/** Cria elemento com classe e texto. Sempre textContent: nada entra como HTML. */
export function el(tag: string, className: string, text: string | null): HTMLElement {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== null) node.textContent = text;
  return node;
}

/** Injeta um bloco de CSS uma única vez, identificado por `id`. */
export function injectStyleOnce(id: string, css: string): void {
  if (document.getElementById(id) !== null) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.append(style);
}

/** Injeta o tema das telas (variáveis + classes compartilhadas) uma vez. */
export function injectScreenThemeOnce(): void {
  injectStyleOnce('screen-theme-style', THEME_CSS);
}

/**
 * Tira o foco de dentro de `root`: botão focado numa tela escondida seguiria
 * recebendo Enter/Espaço (e o jogo usa essas teclas).
 */
export function blurWithin(root: HTMLElement): void {
  const active = document.activeElement;
  if (active instanceof HTMLElement && root.contains(active)) active.blur();
}

/** Tecla com modificador não é atalho de tela. */
export function hasModifier(event: KeyboardEvent): boolean {
  return event.ctrlKey || event.altKey || event.metaKey;
}

/**
 * Enter segurado dispara click nativo repetido no botão focado — numa cadeia
 * de telas isso atravessaria início → personagem → mapa num segurar de tecla.
 * Cada tela visível chama isto no keydown para cortar a repetição na raiz.
 * Devolve true se o evento era uma repetição (e já foi neutralizado).
 */
export function swallowEnterRepeat(event: KeyboardEvent): boolean {
  if (!event.repeat) return false;
  if (event.code === 'Enter' || event.code === 'NumpadEnter') event.preventDefault();
  return true;
}

const THEME_CSS = `
#screens {
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
  --ui-panel: #2a2433;
  --ui-panel-hover: #3a3145;
  --ui-shadow: #2a1016;
  --ui-staple: #b9b9b9;
  --ui-gap: 16px;
  --ui-radius: 8px;

  position: fixed;
  inset: 0;
  z-index: 5;
  color: var(--ui-text);
  text-align: center;
  /* Mural opaco (poste com papéis grampeados): em menu nada do canvas aparece. */
  background:
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0 2px, transparent 2px 9px),
    repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.22) 0 2px, transparent 2px 110px),
    linear-gradient(180deg, #241e2e 0%, #14121a 100%);
}
#screens[hidden] { display: none; }

#screens .screen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ui-gap);
  padding: calc(var(--ui-gap) * 1.5);
  overflow-y: auto;
  overflow-x: hidden;
}
#screens .screen[hidden] { display: none; }

.screen-title {
  margin: 0;
  font-size: clamp(26px, 5vw, 44px);
  color: var(--ui-accent);
  transform: rotate(-2deg);
  text-shadow: 3px 3px 0 var(--ui-shadow);
}
.screen-hint { margin: 0; font-size: 16px; }
/* Linha de aviso (ex.: mapa bloqueado): papel amarelo, sempre reserva altura. */
.screen-status {
  margin: 0;
  min-height: 1.6em;
  font-size: 15px;
}
.screen-status:not(:empty) {
  padding: 3px 14px;
  background: var(--ui-paper-0);
  color: var(--ui-ink);
  border-radius: 4px;
  transform: rotate(-1deg);
  box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.45);
}

.screen-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--ui-gap);
  max-width: 1100px;
}

/* Card estilo panfleto grampeado num poste (GDD). */
.screen-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: clamp(180px, 26vw, 260px);
  min-height: 170px;
  padding: 18px 14px 14px;
  font: inherit;
  color: var(--ui-ink);
  background: var(--ui-paper-0);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px; /* papel de rua, não botão bonito */
  box-shadow: 4px 6px 0 rgba(0, 0, 0, 0.45);
  cursor: pointer;
}
.screen-card::before { /* grampo no topo */
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 26px;
  height: 8px;
  background: var(--ui-staple);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  transform: translateX(-50%) rotate(-2deg);
}
.card-paper-1 { background: var(--ui-paper-1); }
.card-paper-2 { background: var(--ui-paper-2); }
.screen-cards .screen-card:nth-child(odd) { transform: rotate(-2.5deg); }
.screen-cards .screen-card:nth-child(even) { transform: rotate(1.8deg) translateY(8px); }
.screen-cards .screen-card:not(.locked):hover,
.screen-cards .screen-card:not(.locked):focus-visible { transform: scale(1.05); }
/* Amarelo sobre o mural escuro: o contorno fica fora do papel. */
.screen-card:focus-visible { outline: 4px dashed var(--ui-accent); outline-offset: 4px; }

.card-name { font-size: 20px; font-weight: bold; line-height: 1.15; }
.card-line { font-size: 15px; line-height: 1.25; }
.card-play {
  padding-top: 6px;
  border-top: 2px dashed rgba(0, 0, 0, 0.35);
  font-size: 14px;
  line-height: 1.3;
}
.card-key {
  margin-top: auto;
  align-self: stretch;
  padding-top: 6px;
  border-top: 2px dashed rgba(0, 0, 0, 0.4);
  font-size: 13px;
}

/* Card selecionado: adesivo torto + moldura — forma e posição, não só cor. */
.screen-card.selected {
  border-color: var(--ui-promo);
  box-shadow: 0 0 0 3px var(--ui-promo), 6px 8px 0 rgba(0, 0, 0, 0.45);
}
.card-chosen {
  position: absolute;
  top: -12px;
  right: -12px;
  padding: 4px 10px;
  background: var(--ui-promo);
  color: var(--ui-promo-ink);
  font-size: 13px;
  font-weight: bold;
  border-radius: 999px;
  transform: rotate(10deg);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
}

/* Card bloqueado: papel desbotado, borda tracejada, carimbo torto EM BREVE. */
.screen-card.locked {
  background: var(--ui-paper-locked);
  color: var(--ui-ink-locked);
  border-style: dashed;
  box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.35);
  cursor: not-allowed;
}
.card-stamp {
  position: absolute;
  top: 10px;
  right: -8px;
  padding: 3px 10px;
  border: 3px solid var(--ui-promo);
  border-radius: 4px;
  background: rgba(255, 251, 230, 0.92);
  color: var(--ui-promo);
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 2px;
  transform: rotate(8deg);
}
.screen-card.denied { animation: card-denied 0.3s steps(4); }
@keyframes card-denied {
  25% { transform: translateX(-6px) rotate(-2deg); }
  75% { transform: translateX(6px) rotate(2deg); }
}

/* Botões de painel (Voltar): mesmo desenho do reroll do panfleto. */
.screen-primary,
.screen-back {
  font: inherit;
  border-radius: var(--ui-radius);
  border: 2px solid var(--ui-accent);
  background: var(--ui-panel);
  color: var(--ui-accent);
  cursor: pointer;
}
.screen-primary:hover,
.screen-back:hover { background: var(--ui-panel-hover); }
.screen-primary:focus-visible,
.screen-back:focus-visible { outline: 3px dashed var(--ui-accent); outline-offset: 3px; }

.screen-primary {
  font-size: 20px;
  padding: 14px 40px;
  border-width: 3px;
  transform: rotate(1.5deg);
  box-shadow: 4px 5px 0 rgba(0, 0, 0, 0.45);
}
.primary-label { display: block; }
.primary-sub { display: block; font-size: 13px; opacity: 0.85; }

.screen-back {
  position: absolute;
  top: 14px;
  left: 14px;
  font-size: 15px;
  padding: 8px 16px;
  transform: rotate(-1.5deg);
}

/* Cartaz da tela de início: um panfleto grande grampeado. */
.start-poster {
  position: relative;
  padding: 26px 52px 34px;
  background: var(--ui-paper-0);
  color: var(--ui-ink);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px;
  box-shadow: 6px 8px 0 rgba(0, 0, 0, 0.45);
  transform: rotate(-2deg);
}
.start-poster::before { /* grampo */
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 30px;
  height: 9px;
  background: var(--ui-staple);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  transform: translateX(-50%) rotate(-2deg);
}
.start-title {
  margin: 0;
  font-size: clamp(44px, 10vw, 88px);
  line-height: 1.05;
  color: var(--ui-promo);
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
  transform: rotate(-1deg);
}

/* Coluna de botões da tela de início: panfletos empilhados, levemente tortos. */
.menu-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.menu-btn {
  width: clamp(220px, 32vw, 300px);
  min-height: 0;
  padding: 12px 18px 10px;
  gap: 4px;
}
.menu-btn .card-key { margin-top: 0; }
.menu-column .menu-btn:nth-child(odd) { transform: rotate(-1.6deg); }
.menu-column .menu-btn:nth-child(even) { transform: rotate(1.2deg); }
.menu-column .menu-btn:not(.locked):hover,
.menu-column .menu-btn:not(.locked):focus-visible { transform: scale(1.06); }
/* JOGAR: o único funcional — maior por forma e posição, não só por cor. */
.menu-play .card-name { font-size: 28px; color: var(--ui-promo); letter-spacing: 1px; }
/* Botão compacto: o carimbo sobe para o canto e não cobre o rótulo. */
.menu-btn .card-stamp { top: -10px; right: -14px; font-size: 12px; }

/* Caixinha do dev (botão de copiar o Pix copia e cola — sem QR desde
   2026-11-23): panfleto menor no canto inferior direito, fora do caminho
   visual título → JOGAR. Fixa: não rola junto e não cria scroll horizontal. */
.dev-box {
  position: fixed;
  right: 14px;
  bottom: 14px;
  width: 182px;
  padding: 12px 12px 8px;
  background: var(--ui-paper-2);
  color: var(--ui-ink);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px;
  box-shadow: 4px 5px 0 rgba(0, 0, 0, 0.45);
  transform: rotate(2deg);
  font-size: 13px;
  line-height: 1.25;
}
.dev-box::before { /* grampo, como nos demais panfletos */
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 22px;
  height: 7px;
  background: var(--ui-staple);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  transform: translateX(-50%) rotate(3deg);
}
.dev-invite { margin: 0 0 8px; font-weight: bold; }
/* Botão de copiar: adesivo de promoção (vermelho), torto como tudo aqui. */
.dev-copy {
  font: inherit;
  font-size: 12.5px;
  font-weight: bold;
  padding: 7px 10px;
  background: var(--ui-promo);
  color: var(--ui-promo-ink);
  border: 2px solid rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.4);
  transform: rotate(-1.5deg);
  cursor: pointer;
}
.dev-copy:hover { transform: rotate(-1.5deg) scale(1.05); }
.dev-copy:focus-visible { outline: 3px dashed var(--ui-ink); outline-offset: 3px; }
/* Fallback sem clipboard: o código aparece num campo para copiar na mão. */
.dev-payload {
  width: 100%;
  margin-top: 6px;
  padding: 3px 4px;
  font-size: 10px;
  font-family: monospace;
  color: var(--ui-ink);
  background: #fffbe6;
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px;
}
.dev-caption { margin: 8px 0 0; font-size: 11.5px; min-height: 1.2em; }

@media (prefers-reduced-motion: reduce) {
  #screens * { animation: none !important; transition: none !important; }
}

/* Janela estreita ou baixa (ex.: 800×500): conteúdo encolhe e ancora no topo. */
@media (max-width: 640px), (max-height: 560px) {
  #screens .screen { justify-content: flex-start; padding-top: 22px; }
  .screen-title { font-size: 24px; }
  .start-title { font-size: 42px; }
  .screen-card { width: clamp(150px, 42vw, 210px); min-height: 150px; }
  .screen-back { top: 10px; left: 10px; }
  /* Menu de início compacto: cartaz, coluna e botões encolhem para os 4
     botões + aviso caberem sem rolagem; a caixinha do dev encolhe (QR menor)
     para não cobrir os botões — decisão do GDD: reduzir o QR, não movê-lo. */
  .start-poster { padding: 12px 32px 16px; }
  .menu-column { gap: 8px; }
  .menu-btn { width: clamp(190px, 46vw, 250px); min-height: 0; padding: 6px 14px 4px; }
  .menu-btn .card-name { font-size: 16px; }
  .menu-btn .card-key { font-size: 11px; padding-top: 3px; }
  .menu-play .card-name { font-size: 21px; }
  .dev-box { right: 8px; bottom: 8px; width: 148px; font-size: 11px; }
  .dev-copy { font-size: 11px; padding: 5px 8px; }
  .dev-caption { font-size: 10px; }
}
`;
