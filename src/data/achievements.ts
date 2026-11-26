/**
 * Conquistas como dado (decisão de 2026-11-19). Cada conquista é uma condição
 * DECLARATIVA sobre o progresso persistido (e, quando `run*`, sobre a run que
 * acabou de terminar) + um prêmio em bananas — a conquista alimenta a Loja de
 * Talentos: jogar bem acelera a meta-progressão (gamificação do GDD).
 *
 * Quem avalia é `evaluateAchievements` (pura, aqui mesmo): o cofre
 * (`metaStore`) monta o `AchievementProgress`, chama no fim de cada run e
 * após cada compra na loja, credita os prêmios e persiste os desbloqueios.
 * Conquista desbloqueada nunca re-tranca nem re-premia.
 *
 * Condição nova = ramo novo na união + caso novo no switch exaustivo (mesma
 * convenção do `EnemyBehaviorDef`). Números: hipótese a calibrar.
 */
import type { GameData } from './tables';

export type AchievementCondition =
  /** Total de runs jogadas (terminadas por morte OU desistência/saída). */
  | { kind: 'runsPlayed'; count: number }
  /** Abates acumulados em todas as runs; com `enemyTypeId`, só daquele tipo. */
  | { kind: 'lifetimeKills'; count: number; enemyTypeId?: string }
  /** Bananas GANHAS acumuladas (abates; prêmios de conquista não contam). */
  | { kind: 'lifetimeBananas'; count: number }
  /** Abates numa ÚNICA run (a que acabou de terminar). */
  | { kind: 'runKills'; count: number }
  /** Sobreviveu pelo menos N segundos numa run. */
  | { kind: 'runTime'; seconds: number }
  /** Alcançou o nível N numa run. */
  | { kind: 'runLevel'; level: number }
  /** MORREU (não desistiu) em menos de N segundos. */
  | { kind: 'runDeathUnder'; seconds: number }
  /** Níveis de talento comprados, somados entre todos os talentos. */
  | { kind: 'talentRanksBought'; count: number }
  /** Talentos distintos com todos os níveis comprados. */
  | { kind: 'talentsMaxed'; count: number }
  /** Personagens distintos já jogados. */
  | { kind: 'charactersPlayed'; count: number }
  /** Mapas distintos já jogados. */
  | { kind: 'mapsPlayed'; count: number }
  /** Figurinhas acumuladas no álbum (todas as cópias somadas). */
  | { kind: 'albumCards'; count: number }
  /** Tipos de inimigo com pelo menos 1 figurinha. */
  | { kind: 'albumTypesCollected'; count: number }
  /** Tipos de inimigo no ÚLTIMO degrau do álbum (set completo). */
  | { kind: 'albumSetsMaxed'; count: number };

export interface AchievementDef {
  id: string;
  /** Nome exibível no cartaz da conquista. */
  name: string;
  /** Linha exibível de como ganhar (a UI só consome). */
  description: string;
  /** Ícone exibível (emoji). */
  icon: string;
  /** Prêmio em bananas, creditado UMA vez no desbloqueio. */
  reward: number;
  condition: AchievementCondition;
}

/**
 * Resumo da run recém-terminada, para as condições `run*`. `died` separa
 * morte de desistência ("Finalizar run"/"Sair pro menu"): a Rapidinha exige
 * morrer de verdade.
 */
export interface RunFacts {
  kills: number;
  timeSec: number;
  level: number;
  died: boolean;
}

/**
 * Visão do progresso persistido que as condições leem. Quem monta é o cofre
 * (metaStore) — esta camada não conhece storage.
 */
export interface AchievementProgress {
  runsPlayed: number;
  lifetimeKills: number;
  /** Abates acumulados por id de tipo (tipos sem abate podem faltar). */
  lifetimeKillsByType: Readonly<Record<string, number>>;
  lifetimeBananas: number;
  talentRanksBought: number;
  talentsMaxed: number;
  charactersPlayed: number;
  mapsPlayed: number;
  albumCards: number;
  albumTypesCollected: number;
  albumSetsMaxed: number;
  /** A run que acabou de terminar, ou null (avaliação fora de fim de run). */
  lastRun: RunFacts | null;
}

export const achievementTable: AchievementDef[] = [
  // ——— Primeiros passos ———————————————————————————————————————————————
  {
    id: 'estreia',
    name: 'Estreia no Asfalto',
    description: 'Jogue a sua primeira run',
    icon: '🎬',
    reward: 10,
    condition: { kind: 'runsPlayed', count: 1 },
  },
  {
    id: 'primeiro-cascudo',
    name: 'Primeiro Cascudo',
    description: 'Derrote 1 inimigo',
    icon: '👊',
    reward: 5,
    condition: { kind: 'lifetimeKills', count: 1 },
  },
  {
    id: 'deja-vu',
    name: 'Déjà Vu',
    description: 'Jogue 10 runs',
    icon: '🔁',
    reward: 50,
    condition: { kind: 'runsPlayed', count: 10 },
  },
  {
    id: 'sindico',
    name: 'Síndico do Caos',
    description: 'Jogue 50 runs',
    icon: '📋',
    reward: 150,
    condition: { kind: 'runsPlayed', count: 50 },
  },

  // ——— Combate ————————————————————————————————————————————————————————
  {
    id: 'cem-na-conta',
    name: 'Cem na Conta',
    description: 'Derrote 100 inimigos numa única run',
    icon: '💯',
    reward: 30,
    condition: { kind: 'runKills', count: 100 },
  },
  {
    id: 'dizimador',
    name: 'Dizimador de Esquina',
    description: 'Derrote 400 inimigos numa única run',
    icon: '🌪️',
    reward: 80,
    condition: { kind: 'runKills', count: 400 },
  },
  {
    id: 'mil-e-uma',
    name: 'Mil e Uma Utilidades',
    description: 'Derrote 1.000 inimigos no total',
    icon: '🧮',
    reward: 60,
    condition: { kind: 'lifetimeKills', count: 1000 },
  },
  {
    id: 'praga-urbana',
    name: 'Praga Urbana',
    description: 'Derrote 10.000 inimigos no total',
    icon: '😈',
    reward: 200,
    condition: { kind: 'lifetimeKills', count: 10000 },
  },
  {
    id: 'xo-pombo',
    name: 'Xô, Pombo!',
    description: 'Derrote 100 Pombos de Obra',
    icon: '🐦',
    reward: 40,
    condition: { kind: 'lifetimeKills', count: 100, enemyTypeId: 'pombo' },
  },
  {
    id: 'ferias-pro-britador',
    name: 'Férias pro Britador',
    description: 'Derrote 50 Britadeiras Desgovernadas',
    icon: '⚒️',
    reward: 40,
    condition: { kind: 'lifetimeKills', count: 50, enemyTypeId: 'britadeira' },
  },
  {
    id: 'depenador',
    name: 'Depenador',
    description: 'Derrote 100 Galinhas de Quintal',
    icon: '🐔',
    reward: 40,
    condition: { kind: 'lifetimeKills', count: 100, enemyTypeId: 'galinha' },
  },
  {
    id: 'estacionamento',
    name: 'Flanelinha Vingador',
    description: 'Derrote 30 Carrinhos de Feira Desembestados',
    icon: '🛒',
    reward: 40,
    condition: { kind: 'lifetimeKills', count: 30, enemyTypeId: 'carrinho' },
  },

  // ——— Sobrevivência ———————————————————————————————————————————————————
  {
    id: 'aguenta-mao',
    name: 'Aguenta Mão',
    description: 'Sobreviva 5 minutos numa run',
    icon: '⏱️',
    reward: 40,
    condition: { kind: 'runTime', seconds: 300 },
  },
  {
    id: 'hora-extra',
    name: 'Hora Extra',
    description: 'Sobreviva 10 minutos numa run',
    icon: '🕙',
    reward: 120,
    condition: { kind: 'runTime', seconds: 600 },
  },
  {
    id: 'subiu-na-vida',
    name: 'Subiu na Vida',
    description: 'Alcance o nível 10 numa run',
    icon: '📈',
    reward: 30,
    condition: { kind: 'runLevel', level: 10 },
  },
  {
    id: 'lenda-do-bairro',
    name: 'Lenda do Bairro',
    description: 'Alcance o nível 20 numa run',
    icon: '👑',
    reward: 100,
    condition: { kind: 'runLevel', level: 20 },
  },
  {
    id: 'rapidinha',
    name: 'Rapidinha',
    description: 'Morra em menos de 30 segundos (acontece nas melhores famílias)',
    icon: '💀',
    reward: 15,
    condition: { kind: 'runDeathUnder', seconds: 30 },
  },

  // ——— Meta-progressão ————————————————————————————————————————————————
  {
    id: 'cliente-da-casa',
    name: 'Cliente da Casa',
    description: 'Compre 1 nível de talento na loja',
    icon: '🛍️',
    reward: 20,
    condition: { kind: 'talentRanksBought', count: 1 },
  },
  {
    id: 'investidor-anjo',
    name: 'Investidor Anjo',
    description: 'Compre todos os níveis de um talento',
    icon: '😇',
    reward: 80,
    condition: { kind: 'talentsMaxed', count: 1 },
  },
  {
    id: 'cacho-cheio',
    name: 'Cacho Cheio',
    description: 'Acumule 1.000 bananas ganhas em abates',
    icon: '🍌',
    reward: 100,
    condition: { kind: 'lifetimeBananas', count: 1000 },
  },
  {
    id: 'rodizio',
    name: 'Rodízio de Heróis',
    description: 'Jogue com os 3 personagens',
    icon: '🎭',
    reward: 40,
    condition: { kind: 'charactersPlayed', count: 3 },
  },
  {
    id: 'turista-local',
    name: 'Turista Local',
    description: 'Jogue nos 2 mapas abertos',
    icon: '🗺️',
    reward: 40,
    condition: { kind: 'mapsPlayed', count: 2 },
  },

  // ——— Álbum ——————————————————————————————————————————————————————————
  {
    id: 'colecionador',
    name: 'Colecionador Iniciante',
    description: 'Ganhe a sua primeira figurinha do álbum',
    icon: '🃏',
    reward: 20,
    condition: { kind: 'albumCards', count: 1 },
  },
  {
    id: 'zoologico-urbano',
    name: 'Zoológico Urbano',
    description: 'Tenha figurinha de 8 tipos de inimigo diferentes',
    icon: '🦁',
    reward: 60,
    condition: { kind: 'albumTypesCollected', count: 8 },
  },
  {
    id: 'pagina-virada',
    name: 'Página Virada',
    description: 'Complete o set de figurinhas de um inimigo (último degrau)',
    icon: '📖',
    reward: 100,
    condition: { kind: 'albumSetsMaxed', count: 1 },
  },
];

/**
 * Avalia TODAS as conquistas ainda trancadas contra o progresso dado e
 * retorna as recém-desbloqueadas, na ordem da tabela. Pura: quem credita
 * prêmio e persiste é o cofre.
 */
export function evaluateAchievements(
  data: GameData,
  progress: AchievementProgress,
  unlocked: ReadonlySet<string>,
): AchievementDef[] {
  const fresh: AchievementDef[] = [];
  for (const def of data.achievements) {
    if (unlocked.has(def.id)) continue;
    if (conditionMet(def.condition, progress)) fresh.push(def);
  }
  return fresh;
}

function conditionMet(condition: AchievementCondition, p: AchievementProgress): boolean {
  switch (condition.kind) {
    case 'runsPlayed':
      return p.runsPlayed >= condition.count;
    case 'lifetimeKills': {
      if (condition.enemyTypeId === undefined) return p.lifetimeKills >= condition.count;
      return (p.lifetimeKillsByType[condition.enemyTypeId] ?? 0) >= condition.count;
    }
    case 'lifetimeBananas':
      return p.lifetimeBananas >= condition.count;
    case 'runKills':
      return p.lastRun !== null && p.lastRun.kills >= condition.count;
    case 'runTime':
      return p.lastRun !== null && p.lastRun.timeSec >= condition.seconds;
    case 'runLevel':
      return p.lastRun !== null && p.lastRun.level >= condition.level;
    case 'runDeathUnder':
      return p.lastRun !== null && p.lastRun.died && p.lastRun.timeSec < condition.seconds;
    case 'talentRanksBought':
      return p.talentRanksBought >= condition.count;
    case 'talentsMaxed':
      return p.talentsMaxed >= condition.count;
    case 'charactersPlayed':
      return p.charactersPlayed >= condition.count;
    case 'mapsPlayed':
      return p.mapsPlayed >= condition.count;
    case 'albumCards':
      return p.albumCards >= condition.count;
    case 'albumTypesCollected':
      return p.albumTypesCollected >= condition.count;
    case 'albumSetsMaxed':
      return p.albumSetsMaxed >= condition.count;
    default: {
      // Exaustividade em tempo de compilação: condição nova sem caso não compila.
      const unhandled: never = condition;
      throw new Error(`condição de conquista sem caso: ${JSON.stringify(unhandled)}`);
    }
  }
}
