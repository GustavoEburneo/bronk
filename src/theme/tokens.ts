/**
 * Tokens de estilo da UI — fonte ÚNICA de cores/medidas, em `:root` (2026-11-26).
 *
 * Módulo NEUTRO de propósito: não importa nada de `ui/` nem de `render/`, e os
 * dois lados o consomem sem se tocarem —
 * - `ui/` usa `var(--ui-*)` direto (o main injeta os tokens no boot, antes de
 *   qualquer tela);
 * - `render/` (damageNumbers, orelhaoView) usa `var(--ui-*, fallback)` SEM
 *   importar este módulo: a fronteira render×ui segue de pé, e o fallback
 *   hard-coded (comentado lá apontando para cá) cobre até um boot fora de ordem.
 *
 * Isto mata a paleta copiada 4× (screenTheme/hud/upgradeOverlay/pauseOverlay)
 * — dívida registrada no BACKLOG ("unificar variáveis num :root").
 *
 * Linguagem visual (decisão 2026-11-26, substitui o panfleto/Comic Sans de
 * 2026-11-16): PLACAR ESPORTIVO BR — transmissão de futebol de TV + placar
 * eletrônico de estádio de várzea. Painéis azul-petróleo chanfrados (lower
 * thirds), faixas diagonais verde/amarelo/azul, caixa alta condensada.
 */

export const TOKENS_CSS = `
:root {
  /* Texto e fundos de transmissão (noite de jogo) */
  --ui-text: #f2f5f8;
  --ui-text-dim: rgba(242, 245, 248, 0.72);
  --ui-bg-0: #0c1118;
  --ui-bg-1: #121a26;
  --ui-panel: #16233a;        /* painel de placar (azul-petróleo de TV) */
  --ui-panel-2: #1c2d4a;      /* variação de linha / zebra */
  --ui-panel-hover: #24395c;
  --ui-edge: #2e4668;         /* aresta/borda fina dos painéis */

  /* Brasil */
  --ui-green: #009b3a;        /* verde bandeira */
  --ui-green-deep: #006427;
  --ui-yellow: #ffd400;       /* amarelo canário — o ACENTO principal */
  --ui-yellow-deep: #e0a800;
  --ui-blue: #0b4ea2;         /* azul do círculo */
  --ui-ink: #10231a;          /* tinta escura SOBRE amarelo/verde (contraste AA) */

  /* Estados */
  --ui-danger: #d7263d;       /* cartão vermelho (vida baixa, dano sofrido) */
  --ui-danger-ink: #fff4f2;
  --ui-crit: #ff9f2a;         /* dano crítico (números de dano do render) */
  --ui-locked: #233041;       /* painel "fora da rodada" */
  --ui-locked-text: #8d9aab;
  --ui-focus: var(--ui-yellow);

  /* Medidas e texturas */
  --ui-gap: 16px;
  --ui-chamfer: 12px;         /* tamanho do corte de canto dos painéis */
  --ui-stripe: repeating-linear-gradient(135deg,
      var(--ui-green) 0 14px, var(--ui-yellow) 14px 26px, var(--ui-blue) 26px 32px);
  --ui-led-bg: #0a0f14;       /* "visor" de placar eletrônico */
  --ui-led: #ffd400;          /* dígitos do visor */
}
`;

/**
 * Injeta os tokens uma única vez. Cópia mínima consciente do injectStyleOnce
 * do screenTheme: importar de `ui/` quebraria a neutralidade deste módulo.
 */
export function injectUiTokensOnce(): void {
  const id = 'ui-tokens-style';
  if (document.getElementById(id) !== null) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = TOKENS_CSS;
  document.head.append(style);
}
