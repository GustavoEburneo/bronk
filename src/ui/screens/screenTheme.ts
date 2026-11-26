/**
 * Base compartilhada das telas de menu (início → personagem → mapa) E das
 * peças visuais do tema "placar esportivo BR" (decisão 2026-11-26, substitui
 * o panfleto/Comic Sans de 2026-11-16).
 *
 * As CORES vivem em `:root` (src/theme/tokens.ts, injetado no boot pelo main)
 * — aqui ficam as CLASSES. As classes `.sb-*` ("scoreboard") são o vocabulário
 * compartilhado do tema e NÃO são escopadas a `#screens` de propósito: HUD e
 * overlays (que vivem fora de `#screens`) as reutilizam chamando
 * `injectScreenThemeOnce()`.
 *
 * REGRA DA CASA do painel chanfrado: `clip-path` CORTA `box-shadow` e
 * `outline`. Então: profundidade = `filter: drop-shadow(...)` (aplica DEPOIS
 * do clip — só em peça estática, nunca em painel repintado por frame como a
 * HUD: o filter re-rasteriza a cada repaint); foco = anel INTERNO
 * `box-shadow: inset ...` (inset sobrevive ao clip) + clareada de fundo.
 *
 * Mesmo mecanismo de construção dos overlays (ver upgradeOverlay): DOM e CSS
 * nascem nos módulos, nada no index.html. As telas são DOM por cima do
 * canvas, então o texto fica nítido independente da resolução do render.
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

/** Injeta o tema (classes compartilhadas do placar) uma vez. */
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

/**
 * Breakpoint compacto compartilhado (janela estreita OU baixa, ex.: 800×500).
 * Os módulos interpolam `@media ${MEDIA_COMPACT} { ... }` — o valor para de
 * derivar entre os arquivos. Exceções documentadas nos próprios módulos:
 * a pausa usa também um corte próprio de altura (o mural do build é alto) e
 * o álbum tem a dobra extra de 900px.
 */
export const MEDIA_COMPACT = '(max-width: 640px), (max-height: 560px)';

/**
 * Chanfro padrão do painel de placar (canto inferior direito cortado).
 * Interpolado onde o painel é recriado em CSS local de módulo.
 */
export const SB_CHAMFER =
  'polygon(0 0, 100% 0, 100% calc(100% - var(--ui-chamfer)), calc(100% - var(--ui-chamfer)) 100%, 0 100%)';

const THEME_CSS = `
/* ===== Vocabulário "placar esportivo BR" (compartilhado por telas, HUD e
   overlays — nada aqui é escopado a #screens de propósito) ================ */

/* Painel de placar: o substituto único do antigo "papel grampeado". */
.sb-panel {
  position: relative;
  color: var(--ui-text);
  background: var(--ui-panel);
  border: 1px solid var(--ui-edge);
  border-left: 5px solid var(--ui-yellow);
  clip-path: ${SB_CHAMFER};
}
/* Fita diagonal BR no topo: a substituta do grampo. */
.sb-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--ui-stripe);
  opacity: 0.9;
  pointer-events: none;
}
.sb-green { border-left-color: var(--ui-green); }
.sb-blue { border-left-color: var(--ui-blue); }
/* Profundidade pós-clip (ver regra da casa no topo): só em peça ESTÁTICA. */
.sb-raised { filter: drop-shadow(0 4px 0 rgba(0, 0, 0, 0.4)); }

/* Letreiro lower third (título de tela/overlay): itálico 700 caps deslizando. */
.sb-title {
  margin: 0;
  position: relative;
  padding: 10px 28px 12px;
  font-size: clamp(26px, 5vw, 44px);
  font-weight: 700;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1.05;
  color: var(--ui-text);
  background: var(--ui-panel);
  border: 1px solid var(--ui-edge);
  border-left: 6px solid var(--ui-yellow);
  clip-path: ${SB_CHAMFER};
  animation: sb-slide-in 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sb-title::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--ui-stripe);
  pointer-events: none;
}
@keyframes sb-slide-in {
  from { transform: translateX(-28px); opacity: 0; }
}

/* Chip do VAR: aviso/nota curta — amarelo com tinta escura. */
.sb-chip {
  padding: 4px 14px 5px;
  background: var(--ui-yellow);
  color: var(--ui-ink);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border-left: 4px solid var(--ui-green);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
}

/* Placa LED de 4º árbitro: "PRÓXIMA RODADA", "CONTRATADO"… */
.sb-stamp {
  padding: 4px 10px;
  background: var(--ui-led-bg);
  color: var(--ui-led);
  border: 1px solid var(--ui-edge);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

/* Bandeirinha de escanteio: flâmula com ponta ("ÚLTIMO LANCE!", "TITULAR!"). */
.sb-flag {
  padding: 4px 20px 4px 10px;
  background: var(--ui-yellow);
  color: var(--ui-ink);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%);
}
.sb-flag-green {
  background: var(--ui-green);
  color: var(--ui-text);
}

/* Botão de placar: caixa alta 600, chanfro, barra de acento que ALARGA no
   hover (feedback por forma, não só cor; o deslize de 3px é proposital). */
.sb-btn {
  font: inherit;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ui-text);
  background: var(--ui-panel);
  border: 1px solid var(--ui-edge);
  border-left: 5px solid var(--ui-yellow);
  clip-path: ${SB_CHAMFER};
  cursor: pointer;
}
.sb-btn:hover {
  background: var(--ui-panel-hover);
  border-left-width: 8px;
}
/* Foco em peça chanfrada: anel INTERNO (outline morreria no clip). */
.sb-btn:focus-visible,
.sb-panel:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 3px var(--ui-focus);
  background: var(--ui-panel-hover);
}

/* Reduced motion de TODAS as camadas do tema (telas, HUD e overlays): bloco
   único — os módulos não precisam repetir o media query. */
@media (prefers-reduced-motion: reduce) {
  #screens *, #hud *, #upgrade-overlay *, #pause-overlay *, #death-overlay *,
  .sb-title {
    animation: none !important;
    transition: none !important;
  }
}

/* ===== Telas de menu ===================================================== */

#screens {
  position: fixed;
  inset: 0;
  z-index: 5;
  color: var(--ui-text);
  font-weight: 500;
  text-align: center;
  /* Estádio à noite (opaco: em menu nada do canvas aparece): arquibancada
     sutil em linhas horizontais + faixa BR translúcida cruzando + gradiente. */
  background:
    linear-gradient(115deg,
      transparent 0 56%,
      rgba(0, 155, 58, 0.09) 56% 64%,
      rgba(255, 212, 0, 0.07) 64% 68%,
      rgba(11, 78, 162, 0.10) 68% 78%,
      transparent 78%),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0 3px, transparent 3px 26px),
    linear-gradient(180deg, var(--ui-bg-1) 0%, var(--ui-bg-0) 100%);
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

/* Título de tela = letreiro lower third (mesma receita do .sb-title). */
.screen-title {
  margin: 0;
  position: relative;
  padding: 10px 28px 12px;
  font-size: clamp(26px, 5vw, 44px);
  font-weight: 700;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1.05;
  color: var(--ui-text);
  background: var(--ui-panel);
  border: 1px solid var(--ui-edge);
  border-left: 6px solid var(--ui-yellow);
  clip-path: ${SB_CHAMFER};
  animation: sb-slide-in 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.screen-title::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--ui-stripe);
  pointer-events: none;
}

.screen-hint { margin: 0; font-size: 17px; color: var(--ui-text-dim); }

/* Linha de aviso (ex.: mapa bloqueado): chip do VAR, sempre reserva altura. */
.screen-status {
  margin: 0;
  min-height: 1.8em;
  font-size: 15px;
}
.screen-status:not(:empty) {
  padding: 4px 14px 5px;
  background: var(--ui-yellow);
  color: var(--ui-ink);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border-left: 4px solid var(--ui-green);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
}

.screen-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--ui-gap);
  max-width: 1100px;
}

/* Card de seleção: painel de placar (reto — o torto morreu com o panfleto). */
.screen-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: clamp(180px, 26vw, 260px);
  min-height: 170px;
  padding: 20px 14px 18px; /* topo maior: a fita BR ocupa 6px */
  font: inherit;
  font-weight: 500;
  color: var(--ui-text);
  background: var(--ui-panel);
  border: 1px solid var(--ui-edge);
  border-left: 5px solid var(--ui-yellow);
  clip-path: ${SB_CHAMFER};
  cursor: pointer;
}
.screen-card::before { /* fita BR no topo (ex-grampo) */
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--ui-stripe);
  pointer-events: none;
}
/* As variações de "papel" viram variações da barra de acento. */
.card-paper-1 { border-left-color: var(--ui-green); }
.card-paper-2 { border-left-color: var(--ui-blue); }
.screen-cards .screen-card:not(.locked):hover {
  background: var(--ui-panel-hover);
  border-left-width: 8px;
}
/* Foco: anel interno (outline morre no clip-path — regra da casa). */
.screen-card:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 3px var(--ui-focus);
  background: var(--ui-panel-hover);
}

.card-name {
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  line-height: 1.15;
}
.card-line { font-size: 15px; line-height: 1.25; }
.card-play {
  padding-top: 6px;
  border-top: 1px solid var(--ui-edge);
  font-size: 14px;
  line-height: 1.3;
}
.card-key {
  margin-top: auto;
  align-self: stretch;
  padding-top: 6px;
  border-top: 1px solid var(--ui-edge);
  font-size: 13px;
  color: var(--ui-text-dim);
}

/* Card selecionado: barra verde larga + fundo de linha de tabela + flâmula. */
.screen-card.selected {
  background: var(--ui-panel-2);
  border-left: 8px solid var(--ui-green);
}
.card-chosen {
  position: absolute;
  top: -10px;
  right: -8px;
  padding: 4px 20px 4px 10px;
  background: var(--ui-green);
  color: var(--ui-text);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%);
}

/* Card bloqueado: painel "fora da rodada" + placa LED do 4º árbitro. */
.screen-card.locked {
  background: var(--ui-locked);
  color: var(--ui-locked-text);
  border-left-color: var(--ui-edge);
  cursor: not-allowed;
}
.screen-card.locked::before { opacity: 0.25; }
.card-stamp {
  position: absolute;
  top: 12px;
  right: 8px;
  padding: 4px 10px;
  background: var(--ui-led-bg);
  color: var(--ui-led);
  border: 1px solid var(--ui-edge);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.screen-card.denied { animation: card-denied 0.3s steps(4); }
@keyframes card-denied {
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

/* Botões de painel (CONFIRMAR/Voltar): botão de placar. */
.screen-primary,
.screen-back {
  font: inherit;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ui-text);
  background: var(--ui-panel);
  border: 1px solid var(--ui-edge);
  border-left: 5px solid var(--ui-yellow);
  clip-path: ${SB_CHAMFER};
  cursor: pointer;
}
.screen-primary:hover,
.screen-back:hover {
  background: var(--ui-panel-hover);
  border-left-width: 8px;
}
.screen-primary:focus-visible,
.screen-back:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 3px var(--ui-focus);
  background: var(--ui-panel-hover);
}

.screen-primary {
  font-size: 20px;
  padding: 14px 40px;
  border-left-color: var(--ui-green);
  filter: drop-shadow(0 4px 0 rgba(0, 0, 0, 0.4));
}
.primary-label { display: block; }
.primary-sub {
  display: block;
  font-size: 13px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  color: var(--ui-text-dim);
}

.screen-back {
  position: absolute;
  top: 14px;
  left: 14px;
  font-size: 15px;
  padding: 8px 16px;
}

/* Escudo do clube na tela de início: painel com a ponta de escudo embaixo. */
.start-poster {
  position: relative;
  padding: 30px 56px 52px;
  color: var(--ui-text);
  background: var(--ui-panel);
  border: 1px solid var(--ui-edge);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 34px), 50% 100%, 0 calc(100% - 34px));
  filter: drop-shadow(0 5px 0 rgba(0, 0, 0, 0.4));
}
.start-poster::before { /* fita BR larga: a faixa do escudo */
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 9px;
  background: var(--ui-stripe);
  pointer-events: none;
}
.start-title {
  margin: 0;
  font-size: clamp(44px, 10vw, 88px);
  font-weight: 700;
  font-style: italic;
  line-height: 1.05;
  letter-spacing: 0.02em;
  color: var(--ui-yellow);
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.35);
}

/* Coluna de botões do início: lower thirds empilhados, retos. */
.menu-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.menu-btn {
  width: clamp(220px, 32vw, 300px);
  min-height: 0;
  padding: 14px 18px 10px;
  gap: 4px;
}
.menu-btn .card-key { margin-top: 0; }
/* JOGAR: o único funcional — maior por forma (barra verde larga), não só cor. */
.menu-play { border-left: 8px solid var(--ui-green); }
.menu-play .card-name { font-size: 28px; color: var(--ui-yellow); }
/* Botão compacto: a placa sobe para o canto e não cobre o rótulo. */
.menu-btn .card-stamp { top: -10px; right: -8px; font-size: 12px; }

/* Placa de patrocínio da transmissão (a caixinha do Pix do dev): painel
   pequeno no canto inferior direito, fora do caminho visual título → JOGAR.
   Fixa: não rola junto e não cria scroll horizontal. */
.dev-box {
  position: fixed;
  right: 14px;
  bottom: 14px;
  width: 182px;
  padding: 16px 12px 10px;
  color: var(--ui-text);
  background: var(--ui-panel);
  border: 1px solid var(--ui-edge);
  border-left: 4px solid var(--ui-blue);
  clip-path: ${SB_CHAMFER};
  font-size: 13px;
  line-height: 1.25;
}
.dev-box::before { /* fita BR, como nos demais painéis */
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: var(--ui-stripe);
  pointer-events: none;
}
.dev-invite { margin: 0 0 8px; font-weight: 600; }
/* Botão de copiar: verde de "contratação fechada". */
.dev-copy {
  font: inherit;
  font-size: 12.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 7px 10px;
  background: var(--ui-green);
  color: var(--ui-text);
  border: 1px solid var(--ui-green-deep);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
  cursor: pointer;
}
.dev-copy:hover { background: var(--ui-green-deep); }
.dev-copy:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 3px var(--ui-ink);
}
/* Fallback sem clipboard: o código aparece num "visor" para copiar na mão. */
.dev-payload {
  width: 100%;
  margin-top: 6px;
  padding: 3px 4px;
  font-size: 10px;
  font-family: monospace;
  color: var(--ui-led);
  background: var(--ui-led-bg);
  border: 1px solid var(--ui-edge);
}
.dev-caption { margin: 8px 0 0; font-size: 11.5px; min-height: 1.2em; color: var(--ui-text-dim); }

/* Janela estreita ou baixa (ex.: 800×500): conteúdo encolhe e ancora no topo. */
@media ${MEDIA_COMPACT} {
  #screens .screen { justify-content: flex-start; padding-top: 22px; }
  .screen-title { font-size: 24px; padding: 8px 18px 9px; }
  .start-title { font-size: 42px; }
  .screen-card { width: clamp(150px, 42vw, 210px); min-height: 150px; }
  .screen-back { top: 10px; left: 10px; }
  /* Menu de início compacto: escudo, coluna e botões encolhem para os botões
     + aviso caberem sem rolagem; a placa de patrocínio encolhe para não
     cobrir os botões — mesma decisão do GDD (reduzir, não mover). */
  .start-poster { padding: 16px 32px 38px; }
  .menu-column { gap: 8px; }
  .menu-btn { width: clamp(190px, 46vw, 250px); min-height: 0; padding: 10px 14px 4px; }
  .menu-btn .card-name { font-size: 16px; }
  .menu-btn .card-key { font-size: 11px; padding-top: 3px; }
  .menu-play .card-name { font-size: 21px; }
  .dev-box { right: 8px; bottom: 8px; width: 148px; font-size: 11px; }
  .dev-copy { font-size: 11px; padding: 5px 8px; }
  .dev-caption { font-size: 10px; }
}
`;
