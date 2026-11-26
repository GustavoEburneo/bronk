import type { World } from '../sim/world';
import type { Perf } from '../app/perf';
import type { AbilityDef } from '../data/characters';
import { el, injectStyleOnce } from './screens/screenTheme';

/**
 * HUD da run no estilo "papel de rua" das telas (ver screenTheme): crachá de
 * papel com vida e XP, relógio de ponto, carta da habilidade com a recarga e
 * adesivos das passivas coladas. DOM por cima do canvas: texto nítido mesmo
 * com o render interno em 270p. O `#hud` do index.html é só a camada
 * (fixed + pointer-events none); todo o resto nasce aqui, como nos overlays.
 *
 * Duas cadências de atualização:
 * - POR FRAME, só transforms (barras e véu de recarga): sem layout, cabe no
 *   orçamento, e a recarga a 5 Hz ficaria aos trancos.
 * - ~5 Hz (throttle abaixo), textos e reconciliação dos adesivos: números
 *   legíveis e sem custo de DOM por frame.
 */

export interface Hud {
  update(world: World, perf: Perf): void;
}

/** Atualização textual limitada a ~5 Hz: números legíveis e sem custo de layout por frame. */
const UPDATE_INTERVAL_MS = 200;

/** Vida abaixo desta fração: a barra vira vermelho-promoção e pulsa. */
const LOW_HP_FRACTION = 0.25;

/**
 * Exibíveis da habilidade equipada, por ramo da união (exaustivo por tipo).
 * Exportado: o menu de pausa mostra a mesma carta da habilidade.
 */
export const ABILITY_DISPLAY: Record<AbilityDef['kind'], { icon: string; label: string }> = {
  mordida: { icon: '🦷', label: 'Mordida' },
  cartas: { icon: '🃏', label: 'Cartas' },
  fumaca: { icon: '💨', label: 'Fumaça' },
};

export function createHud(element: HTMLElement): Hud {
  injectStyleOnce('hud-style', HUD_CSS);

  // Camada: limpa o "carregando…" do index.html e monta a estrutura uma vez.
  element.textContent = '';

  // --- Crachá do personagem (topo-esquerda): nome, mapa, vida e XP. ---------
  const charName = el('span', 'hud-char', '');
  const mapName = el('span', 'hud-map', '');
  const nameRow = el('div', 'hud-name-row', null);
  nameRow.append(charName, mapName);

  const hpFill = el('div', 'hud-bar-fill', null);
  const hpText = el('span', 'hud-bar-text', '');
  const hpBar = el('div', 'hud-bar hud-hp', null);
  hpBar.append(hpFill, hpText);

  const xpFill = el('div', 'hud-bar-fill', null);
  const xpText = el('span', 'hud-bar-text', '');
  const xpBar = el('div', 'hud-bar hud-xp', null);
  xpBar.append(xpFill, xpText);

  const badge = el('div', 'hud-badge hud-paper', null);
  badge.append(nameRow, hpBar, xpBar);

  // --- Relógio da run (topo-CENTRO, grande — destaque pedido em 2026-11-24).
  const timeText = el('div', 'hud-timer hud-paper', '0:00');

  // --- Contadores (topo-direita): inimigos vivos, bananas e figurinhas. -----
  const aliveText = el('div', 'hud-alive', '');
  const bananaText = el('div', 'hud-bananas', '🍌 0');
  // Figurinhas dropadas na run (álbum): só aparece quando a 1ª cai — contador
  // em 0 o tempo todo só poluiria o relógio.
  const cardText = el('div', 'hud-bananas', '🃏 0');
  cardText.hidden = true;
  const clock = el('div', 'hud-clock hud-paper', null);
  clock.append(aliveText, bananaText, cardText);

  // --- Kit (base-esquerda): carta da habilidade + adesivos das passivas. ----
  const skillIcon = el('div', 'hud-skill-icon', '');
  const skillVeil = el('div', 'hud-skill-cd', null);
  const skillLabel = el('div', 'hud-skill-label', '');
  const skill = el('div', 'hud-skill hud-paper', null);
  skill.append(skillIcon, skillVeil, skillLabel);

  const passives = el('div', 'hud-passives', null);

  const kit = el('div', 'hud-kit', null);
  kit.append(skill, passives);

  // --- Instrumentação (base-direita): FPS e tempos, discreto e mono. --------
  const perfLine = el('div', 'hud-perf', '');

  element.append(badge, timeText, clock, kit, perfLine);

  let lastTextUpdateAt = 0;
  /**
   * Mundo da última atualização: o restart/menu troca o objeto, e aí os
   * adesivos e exibíveis fixos (nome, habilidade) são reconstruídos do zero.
   */
  let lastWorld: World | null = null;
  /** Adesivo por índice de melhoria (null = ainda não colado) + stacks exibidos. */
  let passiveNodes: ({ root: HTMLElement; count: HTMLElement; stacks: number } | null)[] = [];

  function resetForWorld(world: World): void {
    lastWorld = world;
    passiveNodes = new Array(world.data.upgrades.length).fill(null);
    passives.textContent = '';

    charName.textContent = world.data.characters[world.characterIndex]?.name ?? '?';
    mapName.textContent = world.data.maps.find((m) => m.id === world.mapId)?.name ?? world.mapId;
    const ability = ABILITY_DISPLAY[world.ability.kind];
    skillIcon.textContent = ability.icon;
    skillLabel.textContent = ability.label;
  }

  function syncPassives(world: World): void {
    for (let i = 0; i < world.data.upgrades.length; i++) {
      const stacks = world.upgradeStacks[i] ?? 0;
      if (stacks <= 0) continue;
      const def = world.data.upgrades[i]!;
      // Só efeito contínuo vira adesivo: cura instantânea (fallback Trocado)
      // não é estado de build — mostrá-la mentiria uma passiva ativa.
      if (def.effect === undefined) continue;

      let node = passiveNodes[i];
      if (node === null || node === undefined) {
        const icon = el('span', 'hud-passive-icon', def.icon);
        const count = el('span', 'hud-passive-count', '');
        count.hidden = true;
        const root = el('div', 'hud-passive', null);
        // Exibível completo para leitores/depuração (pointer-events none: sem tooltip).
        root.title = `${def.name} — ${def.effectLine}`;
        root.setAttribute('aria-label', root.title);
        root.append(icon, count);
        passives.append(root);
        node = { root, count, stacks: 0 };
        passiveNodes[i] = node;
      }
      if (node.stacks !== stacks) {
        node.stacks = stacks;
        node.count.textContent = `×${stacks}`;
        node.count.hidden = stacks < 2;
      }
    }
  }

  return {
    update(world: World, perf: Perf): void {
      if (world !== lastWorld) resetForWorld(world);

      // Por frame: só transforms (nenhum layout/texto).
      const hpFraction = clamp01(world.player.hp / world.stats.maxHp);
      hpFill.style.transform = `scaleX(${hpFraction})`;
      xpFill.style.transform = `scaleX(${clamp01(world.player.xp / world.player.xpToNext)})`;
      skillVeil.style.transform = `scaleY(${clamp01(
        world.player.abilityCooldown / world.stats.abilityCooldown,
      )})`;

      const now = performance.now();
      if (now - lastTextUpdateAt < UPDATE_INTERVAL_MS) return;
      lastTextUpdateAt = now;

      // maxHp efetivo (base + melhorias), senão "Marmita Reforçada" dessincroniza.
      hpText.textContent = `${Math.ceil(world.player.hp)}/${Math.round(world.stats.maxHp)}`;
      hpBar.classList.toggle('low', hpFraction < LOW_HP_FRACTION);
      xpText.textContent =
        `Nv ${world.player.level} · ` +
        `${Math.floor(world.player.xp)}/${Math.ceil(world.player.xpToNext)} XP`;

      timeText.textContent = formatRunTime(world.time);
      aliveText.textContent = `${world.enemies.count} na sua cola`;
      bananaText.textContent = `🍌 ${world.bananasEarned}`;
      let cardsEarned = 0;
      for (const n of world.cardsEarned) cardsEarned += n;
      cardText.hidden = cardsEarned === 0;
      if (cardsEarned > 0) cardText.textContent = `🃏 ${cardsEarned}`;

      syncPassives(world);

      perfLine.textContent =
        `FPS ${perf.fps.toFixed(0)} · ` +
        `sim ${perf.simMs.toFixed(2)} ms · render ${perf.renderMs.toFixed(2)} ms`;
    },
  };
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** "m:ss" do tempo de run. Exportado: o menu de pausa mostra o mesmo relógio. */
export function formatRunTime(seconds: number): string {
  const total = Math.floor(seconds);
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${mm}:${String(ss).padStart(2, '0')}`;
}

/**
 * Estilo da HUD. Variáveis no topo como nos overlays: os valores espelham a
 * paleta das telas (unificar num :root é dívida registrada no upgradeOverlay).
 */
const HUD_CSS = `
#hud {
  --ui-ink: #26180b;
  --ui-paper-0: #fff3b0;
  --ui-paper-1: #ffd6ec;
  --ui-paper-2: #d2f4ff;
  --ui-promo: #e8231a;
  --ui-promo-ink: #fffbe6;
  --ui-accent: #ffe066;
  --ui-staple: #b9b9b9;
  --hud-hp: #4f9440;
  --hud-margin: 12px;
}

/* Papel grampeado, mesma linguagem dos cards das telas (posição fica em cada peça). */
#hud .hud-paper {
  padding: 8px 12px;
  color: var(--ui-ink);
  background: var(--ui-paper-0);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px;
  box-shadow: 3px 4px 0 rgba(0, 0, 0, 0.45);
}
#hud .hud-paper::before { /* grampo no topo */
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 22px;
  height: 7px;
  background: var(--ui-staple);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  transform: translateX(-50%) rotate(-2deg);
}

/* --- Crachá do personagem (vida + XP) --- */
#hud .hud-badge {
  position: absolute;
  top: var(--hud-margin);
  left: var(--hud-margin);
  width: 220px;
  transform: rotate(-1.5deg);
}
.hud-name-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
  text-align: left;
}
.hud-char { font-size: 17px; font-weight: bold; line-height: 1.1; }
.hud-map { font-size: 12px; opacity: 0.75; }

.hud-bar {
  position: relative;
  height: 18px;
  margin-top: 4px;
  background: rgba(0, 0, 0, 0.22);
  border: 2px solid rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  overflow: hidden;
}
.hud-bar-fill {
  position: absolute;
  inset: 0;
  background: var(--hud-hp);
  transform-origin: left center;
  transform: scaleX(1);
}
.hud-bar-text {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: bold;
  color: var(--ui-promo-ink);
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.55);
  white-space: nowrap;
}
.hud-hp.low .hud-bar-fill {
  background: var(--ui-promo);
  animation: hud-hp-pulse 0.8s steps(2) infinite;
}
@keyframes hud-hp-pulse {
  50% { filter: brightness(1.45); }
}
.hud-xp { height: 12px; }
.hud-xp .hud-bar-fill { background: var(--ui-accent); }
.hud-xp .hud-bar-text { font-size: 10px; }

/* --- Relógio da run: topo-centro, GRANDE (destaque de 2026-11-24) --- */
#hud .hud-timer {
  position: absolute;
  top: var(--hud-margin);
  left: 50%;
  transform: translateX(-50%) rotate(-0.8deg);
  padding: 6px 22px;
  background: var(--ui-paper-2);
  font-size: 38px;
  font-weight: bold;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

/* --- Contadores (vivos, bananas, figurinhas) --- */
#hud .hud-clock {
  position: absolute;
  top: var(--hud-margin);
  right: var(--hud-margin);
  min-width: 92px;
  transform: rotate(1.5deg);
  background: var(--ui-paper-2);
  text-align: center;
}
.hud-alive { font-size: 11.5px; opacity: 0.8; white-space: nowrap; }
/* Bananas da run (viram cofre no fim): separadas do tempo por traço de papel. */
.hud-bananas {
  margin-top: 3px;
  padding-top: 2px;
  border-top: 2px dashed rgba(0, 0, 0, 0.3);
  font-size: 14px;
  font-weight: bold;
}

/* --- Kit: carta da habilidade + adesivos das passivas --- */
.hud-kit {
  position: absolute;
  left: var(--hud-margin);
  bottom: var(--hud-margin);
  display: flex;
  align-items: flex-end;
  gap: 12px;
}
#hud .hud-skill {
  position: relative;
  width: 64px;
  padding: 8px 6px 5px;
  transform: rotate(-2deg);
  background: var(--ui-paper-1);
  text-align: center;
}
.hud-skill-icon { font-size: 32px; line-height: 1.15; }
.hud-skill-label {
  font-size: 11px;
  font-weight: bold;
  border-top: 2px dashed rgba(0, 0, 0, 0.35);
  margin-top: 3px;
  padding-top: 2px;
}
/* Véu da recarga: drena de cima para baixo até liberar o golpe. */
.hud-skill-cd {
  position: absolute;
  inset: 0;
  background: rgba(16, 10, 20, 0.5);
  transform-origin: center bottom;
  transform: scaleY(0);
}

.hud-passives {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 7px;
  max-width: min(46vw, 420px);
}
/* Adesivo redondo de passiva, tortinho alternado como os papéis do mural. */
.hud-passive {
  position: relative;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  background: var(--ui-promo-ink);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 999px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.45);
  animation: hud-passive-in 0.25s cubic-bezier(0.22, 1.4, 0.36, 1) both;
}
.hud-passives .hud-passive:nth-child(odd) { transform: rotate(-6deg); }
.hud-passives .hud-passive:nth-child(even) { transform: rotate(5deg); }
.hud-passive-icon { font-size: 18px; line-height: 1; }
.hud-passive-count {
  position: absolute;
  top: -7px;
  right: -8px;
  padding: 1px 5px;
  background: var(--ui-promo);
  color: var(--ui-promo-ink);
  font-size: 10px;
  font-weight: bold;
  border-radius: 999px;
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
}
.hud-passive-count[hidden] { display: none; }
@keyframes hud-passive-in {
  from { scale: 0; }
  to { scale: 1; }
}

/* --- Instrumentação (FPS, ms): discreta, mono, fora do caminho do olho. --- */
.hud-perf {
  position: absolute;
  right: var(--hud-margin);
  bottom: var(--hud-margin);
  font-family: ui-monospace, 'Cascadia Mono', Consolas, monospace;
  font-size: 11px;
  text-align: right;
  color: rgba(232, 228, 218, 0.6);
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.6);
}

@media (prefers-reduced-motion: reduce) {
  #hud * { animation: none !important; }
}

/* Janela estreita ou baixa: tudo encolhe e cola mais na borda. */
@media (max-width: 640px), (max-height: 560px) {
  #hud { --hud-margin: 8px; }
  #hud .hud-badge { width: 176px; padding: 6px 10px; }
  #hud .hud-char { font-size: 14px; }
  #hud .hud-timer { font-size: 26px; padding: 4px 14px; }
  #hud .hud-skill { width: 52px; }
  #hud .hud-skill-icon { font-size: 24px; }
  #hud .hud-passive { width: 30px; height: 30px; }
  #hud .hud-passive-icon { font-size: 15px; }
  #hud .hud-perf { display: none; }
}
`;
