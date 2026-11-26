/**
 * Personagens jogáveis como dado (decisão de 2026-11-17). Os stats base do
 * player e a habilidade equipada vivem aqui — `gameData.player` e
 * `gameData.bite` saíram da tabela. A habilidade é união discriminada:
 * parâmetro novo de habilidade = campo novo no ramo dela, tipado; nunca
 * "campo opcional que só vale para um kind".
 */

export interface CharacterStats {
  moveSpeed: number;
  maxHp: number;
  radius: number;
  /** Janela de invulnerabilidade após sofrer dano de contato (s). */
  contactIFrames: number;
}

export type AbilityDef =
  | { kind: 'mordida'; damage: number; cooldown: number; range: number }
  | {
      kind: 'cartas';
      damage: number;
      cooldown: number;
      /** Alcance de arremesso: distância máxima da ida, em unidades. */
      range: number;
      /** Velocidade da carta (u/s), ida e volta. */
      projectileSpeed: number;
      /** Raio de acerto da carta (u). */
      cardRadius: number;
      /** Máximo de cartas EM VOO (regra de jogo do GDD, não capacidade do pool). */
      maxLive: number;
    }
  | {
      /**
       * Pulso instantâneo sem mira centrado no player: `damage` em todos os
       * inimigos Chasing a até `range` (centro-a-centro), a cada `cooldown`.
       */
      kind: 'fumaca';
      damage: number;
      cooldown: number;
      /** Raio da nuvem (u), distância centro-a-centro, convenção da mordida. */
      range: number;
    };

export interface CharacterDef {
  id: string;
  /** Nome exibível no card de seleção. */
  name: string;
  /** Linha do card: habilidade base + o que muda no jeito de jogar. */
  tagline: string;
  stats: CharacterStats;
  ability: AbilityDef;
}

/**
 * Capacidade técnica do CardPool (decisão do TECH, orçamento de desempenho).
 * Independe do `maxLive` (regra de jogo): a validação exige maxLive <= isto.
 */
export const CARD_POOL_CAPACITY = 32;

/** Teto de segurança do voo (s): a carta some mesmo sem captura (GDD). */
export const CARD_FLIGHT_TIMEOUT = 3;

/**
 * Janela pós-acerto (s) em que o inimigo não leva dano de NENHUMA carta
 * (decisão do TECH): garante no máximo 1 acerto por passada e ainda permite
 * acertar o mesmo inimigo na ida e na volta.
 */
export const PROJECTILE_HIT_COOLDOWN = 0.2;

export const characterTable: CharacterDef[] = [
  {
    id: 'capivara',
    name: 'Capivara',
    tagline: 'Mordida automática — briga colada: curto alcance, ritmo rápido',
    stats: { moveSpeed: 8, maxHp: 100, radius: 0.5, contactIFrames: 0.6 },
    ability: { kind: 'mordida', damage: 10, cooldown: 0.8, range: 2.2 },
  },
  {
    // Demais stats iguais aos da capivara por decisão do GDD (diferenciar
    // stats defensivos é hipótese futura).
    id: 'carteiro',
    name: 'Carteiro',
    tagline:
      'Cartas que voltam — briga à distância: a carta atravessa a horda na ida e na volta',
    stats: { moveSpeed: 8, maxHp: 100, radius: 0.5, contactIFrames: 0.6 },
    ability: {
      kind: 'cartas',
      damage: 7,
      cooldown: 1.2,
      range: 7,
      projectileSpeed: 14,
      cardRadius: 0.6,
      maxLive: 3,
    },
  },
  {
    // Stats defensivos iguais aos da capivara por decisão do GDD (2026-11-18);
    // "tanque com mais HP base" é hipótese futura.
    id: 'churrasqueiro',
    name: 'Churrasqueiro',
    tagline:
      'Baforadas de fumaça ao redor — briga no meio da horda: ser cercado é o plano',
    stats: { moveSpeed: 8, maxHp: 100, radius: 0.5, contactIFrames: 0.6 },
    // Dano do pulso: o experimento 6 → 8 de 2026-11-18 foi REVERTIDO pelo
    // game-designer no fechamento do balanceamento (GDD, "Balanceamento do
    // trio"): a vantagem medida era ruído de cenário saturado, e o 8
    // desalinhava as réguas internas. A ordem churrasqueiro × carteiro virou
    // hipótese para jogadas humanas (valores: hipótese).
    ability: { kind: 'fumaca', damage: 6, cooldown: 1.0, range: 2.0 },
  },
];
