/**
 * Tabela de talentos da "Loja de Talentos" (meta-progressão, decisão de
 * 2026-11-19). Referência: PowerUps do Vampire Survivors — bônus PERMANENTES
 * comprados no menu com bananas (1 banana por abate, creditadas no fim da
 * run) e aplicados a TODA partida, de qualquer personagem.
 *
 * Regra de aplicação — a MESMA fórmula linear das melhorias de dentro da run
 * (ver `upgrades.ts`): talento é só mais uma fonte de percentual/absoluto
 * somada sobre o valor BASE do stat, ANTES do clamp:
 *
 *   efetivo = base × (1 + Σ melhorias + Σ talentos) + Σ flats, clamp [min, max]
 *
 * `effect` reutiliza `UpgradeEffect` de propósito: "stack" ali lê-se "nível
 * do talento" aqui, e a conta em `effectiveStatValue` é uma só — duas
 * fórmulas iguais em dois lugares dessincronizariam.
 *
 * `name`/`effectLine`/`icon` são exibíveis (loja e telas): a UI só consome.
 * Custos em bananas POR NÍVEL, crescentes (números: hipótese a calibrar
 * pelo systems-engineer com runs reais — ~1 banana/abate, run típica da POC
 * rende dezenas a poucas centenas).
 */
import type { UpgradeEffect } from './upgrades';

export interface TalentDef {
  id: string;
  /** Nome exibível no cartaz da loja. */
  name: string;
  /** Linha de efeito exibível (o bônus de UM nível). */
  effectLine: string;
  /** Ícone exibível (emoji), como nas melhorias. */
  icon: string;
  /** Níveis compráveis (equivale ao maxStacks das melhorias). */
  maxRank: number;
  /** Custo em bananas de cada nível, 1º ao último. length === maxRank. */
  costPerRank: number[];
  /** Efeito por nível, na fórmula das melhorias ("per stack" = por nível). */
  effect: UpgradeEffect;
}

export const talentTable: TalentDef[] = [
  {
    id: 'feijoada',
    name: 'Feijoada Completa',
    effectLine: '+5% de dano por nível',
    icon: '🍛',
    maxRank: 5,
    costPerRank: [50, 100, 200, 350, 550],
    effect: { stat: 'ability.damage', percentPerStack: 0.05, flatPerStack: 0 },
  },
  {
    id: 'casca',
    name: 'Casca Grossa',
    effectLine: '+10 de HP máximo por nível',
    icon: '🥥',
    maxRank: 3,
    costPerRank: [60, 140, 260],
    effect: { stat: 'player.maxHp', percentPerStack: 0, flatPerStack: 10 },
  },
  {
    id: 'tenis',
    name: 'Tênis de Camelô',
    effectLine: '+4% de velocidade por nível',
    icon: '👟',
    maxRank: 3,
    costPerRank: [50, 120, 240],
    effect: { stat: 'player.moveSpeed', percentPerStack: 0.04, flatPerStack: 0 },
  },
  {
    // Mesmo piso de recarga do Café Passado na Hora: os clamps são por stat,
    // e o mais apertado vence (ver effectiveStatValue).
    id: 'despertador',
    name: 'Despertador Velho',
    effectLine: '-5% de recarga por nível',
    icon: '⏰',
    maxRank: 3,
    costPerRank: [80, 180, 320],
    effect: { stat: 'ability.cooldown', percentPerStack: -0.05, flatPerStack: 0, min: 0.35 },
  },
  {
    id: 'cha',
    name: 'Chá da Vizinha',
    effectLine: '+0,2 de HP por segundo por nível',
    icon: '🍵',
    maxRank: 2,
    costPerRank: [120, 280],
    effect: { stat: 'player.hpRegen', percentPerStack: 0, flatPerStack: 0.2 },
  },
  {
    id: 'bolso',
    name: 'Bolso Fundo',
    effectLine: '+20% no raio do ímã de XP por nível',
    icon: '👖',
    maxRank: 2,
    costPerRank: [40, 90],
    effect: { stat: 'xp.magnetRadius', percentPerStack: 0.2, flatPerStack: 0 },
  },
  {
    id: 'cracha',
    name: 'Crachá de Esforçado',
    effectLine: '+10% de XP por orbe por nível',
    icon: '📛',
    maxRank: 3,
    costPerRank: [70, 160, 300],
    effect: { stat: 'xp.gainMultiplier', percentPerStack: 0.1, flatPerStack: 0 },
  },
  {
    id: 'coelho',
    name: 'Pé de Coelho Falsificado',
    effectLine: '+2% de chance de crítico por nível',
    icon: '🐰',
    maxRank: 3,
    costPerRank: [100, 220, 400],
    effect: { stat: 'ability.critChance', percentPerStack: 0, flatPerStack: 0.02 },
  },
];
